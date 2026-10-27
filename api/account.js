// 바이라인 계정 API (Vercel 서버리스 함수) — 가입 · 로그인 · 클라우드 저장 · 기록실 동기화
// - 동시 접속자 API(presence.js)와 같은 Upstash/Redis 저장소를 쓴다. 따로 설정할 것은 없다.
// - 아이디·비밀번호만 받는다. 이메일 같은 개인 정보는 받지 않는다 (그래서 비밀번호를 잊으면 되찾을 수 없다).
// - 비밀번호는 scrypt(솔트 포함)로 바꿔서만 저장한다. 원래 비밀번호는 어디에도 남지 않는다.
// - 로그인하면 무작위 토큰을 준다 (60일). 브라우저는 Authorization: Bearer <토큰> 으로 보낸다.
// - 저장 파일은 브라우저가 gzip으로 줄여 base64로 보낸다. 서버는 내용을 읽지 않고 그대로 보관한다.
// - 요청: POST /api/account  { a: '동작', ... }
//   register {id,pw,nick} · login {id,pw} · logout · me · password {pw,npw} · delete {pw}
//   list · get {slot} · put {slot,label,t,z} · del {slot} · meta-get · meta-put {t,z}
//   hall-put {run} (로그인) · hall-top {scope:'all'|'month'} (누구나) · ghosts (누구나: 다른 플레이어의 은퇴 기자 몇 명)
// - 연결 점검: GET /api/account?debug=1 (연결 방식과 성공 여부만 보여 준다. 자세한 오류는 Vercel 로그에)

import crypto from 'node:crypto';

const P = 'byline:acc:';
const SESS_TTL = 60 * 24 * 3600;                 // 로그인 유지 60일
const SLOTS = ['auto', '1', '2', '3'];           // 자동 백업 + 슬롯 3개
const MAX_Z = 800 * 1024;                         // 압축한 저장 하나 최대 800KB
const ID_RE = /^[a-z0-9_]{4,16}$/;

function findEnv() {
  const env = process.env, keys = Object.keys(env);
  const pick = (re) => keys.find((k) => re.test(k) && env[k]);
  return {
    restUrlKey: pick(/(^|_)(KV_REST_API_URL|UPSTASH_REDIS_REST_URL|REDIS_REST_URL)$/),
    restTokKey: pick(/(^|_)(KV_REST_API_TOKEN|UPSTASH_REDIS_REST_TOKEN|REDIS_REST_TOKEN)$/),
    tcpKey: pick(/(^|_)(REDIS_URL|KV_URL)$/),
  };
}

// 저장소: 명령 여러 개를 한 번에 보내고 결과 배열을 받는다
let db = null, mode = 'none', initErr = '';
async function getDb() {
  if (db) return db;
  if (globalThis.__BYLINE_TEST_DB) { mode = 'test'; return (db = globalThis.__BYLINE_TEST_DB); }
  const e = findEnv();
  try {
    if (e.restUrlKey && e.restTokKey) {
      const base = process.env[e.restUrlKey].replace(/\/+$/, ''), tok = process.env[e.restTokKey];
      mode = 'upstash-rest';
      db = {
        async run(cmds) {
          const r = await fetch(base + '/pipeline', { method: 'POST', headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds) });
          if (!r.ok) throw new Error('Upstash 응답 ' + r.status);
          const out = await r.json(); const bad = out.find((x) => x && x.error); if (bad) throw new Error(bad.error);
          return out.map((x) => x.result);
        },
      };
    } else if (e.tcpKey) {
      const { createClient } = await import('redis');
      const r = createClient({ url: process.env[e.tcpKey], socket: { connectTimeout: 5000, tls: /^rediss:/.test(process.env[e.tcpKey]) } });
      r.on('error', () => {});
      await r.connect();
      mode = 'redis-url';
      db = { async run(cmds) { const m = r.multi(); cmds.forEach((c) => m.addCommand(c.map(String))); return await m.exec(); }, async quit() { try { await r.quit(); } catch {} } };
    }
  } catch (err) { initErr = String(err && err.message || err).slice(0, 200); db = null; try { console.error('account init', err); } catch {} }
  return db;
}
const one = async (c) => (await db.run([c]))[0];

// 비밀번호
function hashPw(pw, salt) { return crypto.scryptSync(String(pw), salt, 32, { N: 16384, r: 8, p: 1 }).toString('hex'); }
function samePw(pw, salt, h) { if (!salt || !h) return false; const a = Buffer.from(hashPw(pw, salt), 'hex'), b = Buffer.from(String(h || ''), 'hex'); return a.length === b.length && crypto.timingSafeEqual(a, b); }

// 무차별 대입 막기: 키마다 창(초) 안에서 n번까지
async function limited(key, n, win) {
  const k = P + 'rl:' + key;
  const [c] = await db.run([['INCR', k], ['EXPIRE', k, String(win), 'NX']]); // 같은 요청에서 만료를 건다 (사이에 끊겨도 영구 잠금이 없다)
  return Number(c) > n;
}
function ipOf(req) { return String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim().slice(0, 64) || 'x'; }
function cleanNick(s) { return String(s || '').replace(/[<>&"'`\\]/g, '').replace(/\s+/g, ' ').trim().slice(0, 12); }

async function userOf(req) {
  const m = /^Bearer\s+([a-f0-9]{48})$/i.exec(String(req.headers.authorization || ''));
  if (!m) return null;
  const id = await one(['GET', P + 'sess:' + m[1]]);
  return id ? { id: String(id), tok: m[1] } : null;
}
async function newSession(id) {
  const tok = crypto.randomBytes(24).toString('hex');
  await db.run([['SET', P + 'sess:' + tok, id, 'EX', String(SESS_TTL)], ['SADD', P + 'sl:' + id, tok]]);
  return tok;
}
async function profile(id) {
  const [nick, created] = await db.run([['HGET', P + 'u:' + id, 'nick'], ['HGET', P + 'u:' + id, 'created']]);
  return { id, nick: nick || id, created: Number(created || 0) };
}


// ---- 명예의 전당 ----
const HALL_MAX = 300;                              // 순위표에 남기는 사람 수
const clean = (v, n) => String(v == null ? '' : v).replace(/[<>&"'`\\]/g, '').replace(/[\u0000-\u001f]/g, '').replace(/\s+/g, ' ').trim().slice(0, n);
const num = (v, lo, hi) => Math.max(lo, Math.min(hi, Math.round(Number(v) || 0)));
// 다른 플레이어 화면에 나가는 글: 욕설·광고·연락처는 걸러 낸다
const BAD_RE = /시발|씨발|씨빨|ㅅㅂ|병신|ㅂㅅ|좆|개새|지랄|느금|애미|fuck|shit|sex|섹스|야동|http|www|\.com|\.kr|\.net|카톡|텔레그램|토토사이트|바카라|먹튀|010\d|\d{3,}-\d{3,}/i;
const monthKey = () => { const d = new Date(Date.now() + 9 * 3600e3); return d.getUTCFullYear() * 100 + d.getUTCMonth() + 1; }; // 한국 시간 기준 달
function recentMonths() { const L = []; const d = new Date(Date.now() + 9 * 3600e3); for (let i = 0; i < 4; i++) { const x = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() - i, 1)); L.push(x.getUTCFullYear() * 100 + x.getUTCMonth() + 1); } return L; }
function hallEntry(r, uid, nick) {
  let nm = clean(r.nm, 10).replace(/[^가-힣ㄱ-ㅎa-zA-Z0-9 ·]/g, '').trim() || '이름 없는 기자';
  let best = clean(r.best, 70).replace(/[^가-힣ㄱ-ㅎa-zA-Z0-9 ·,.!?\[\]()「」…%-]/g, '').trim();
  if (BAD_RE.test(nm)) nm = '이름 없는 기자';
  if (BAD_RE.test(best)) best = '';
  // 현실적인 상한: 게임 한 판은 길어야 45년, 단독은 한 해 4개 남짓, 기자상은 세 해에 하나 꼴
  const yrs = num(r.yrs, 0, 45), ex = num(r.ex, 0, yrs * 4 + 10), aw = num(r.aw, 0, Math.ceil(yrs / 3) + 2);
  // 점수는 게임의 계산식(직급·평판·신뢰·단독·기자상)으로 낼 수 있는 최대치까지만 받는다
  const scMax = 7 * 14 + 100 * 0.6 + 100 * 0.4 + ex * 2 + aw * 6;
  return { uid, nick: clean(nick, 12), nm, rn: clean(r.rn, 14), o: clean(r.o, 20), end: clean(r.end, 30), yrs, sc: num(r.sc, -500, scMax),
    aw, ex, big: num(r.big, 0, aw), f: r.f ? 1 : 0, story: r.story ? 1 : 0, best, dept: clean(r.dept, 12), t: Date.now() };
}
async function hallRead(key, n, hkey) {
  const flat = (await one(['ZREVRANGE', key, '0', String(n - 1), 'WITHSCORES'])) || [];
  const ids = []; for (let i = 0; i < flat.length; i += 2) ids.push(String(flat[i]));
  if (!ids.length) return [];
  const raw = await db.run(ids.map((u) => ['HGET', hkey || P + 'hall:e', u]));
  return raw.map((x) => { try { return JSON.parse(x); } catch { return null; } }).filter(Boolean);
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  const c = await getDb();
  if (req.method === 'GET') {
    if (req.query && req.query.debug === '1') {
      if (!c) return res.status(200).json({ ok: false, mode, error: initErr ? '연결 실패 — Vercel 로그(Functions)를 확인하자' : '연결할 Redis 환경 변수를 찾지 못했다' });
      // 실제로 저장소에 닿는지 확인한다 (쓰기 권한까지: 1분 뒤 사라지는 키를 하나 쓴다)
      try { const [pong, , back] = await db.run([['PING'], ['SET', P + 'ping', '1', 'EX', '60'], ['GET', P + 'ping']]); return res.status(200).json({ ok: String(pong).toUpperCase() === 'PONG' && String(back) === '1', mode, write: String(back) === '1' }); }
      catch (err) { try { console.error('account debug', err); } catch {} db = null; return res.status(200).json({ ok: false, mode, error: '저장소가 응답하지 않는다 — 토큰(읽기 전용이 아닌지)과 주소를 확인하자' }); }
    }
    return res.status(405).json({ error: '잘못된 요청' });
  }
  if (req.method !== 'POST') return res.status(405).json({ error: '잘못된 요청' });
  if (!c) return res.status(503).json({ error: '계정 서버가 아직 준비되지 않았다' });
  let b = req.body || {};
  if (typeof b === 'string') { try { b = JSON.parse(b); } catch { b = {}; } }
  if (!b || typeof b !== 'object' || Array.isArray(b)) b = {};
  const a = String(b.a || '');
  const fail = (code, msg) => res.status(code).json({ error: msg });
  try {
    // ---- 가입 ----
    if (a === 'register') {
      const id = String(b.id || '').toLowerCase().trim(), pw = String(b.pw || ''), nick = cleanNick(b.nick) || ('기자' + crypto.randomInt(1000, 9999)); // 닉네임을 비우면 아이디를 드러내지 않는다
      if (!ID_RE.test(id)) return fail(400, '아이디는 영문 소문자·숫자·_ 4~16자');
      if (pw.length < 6 || pw.length > 64) return fail(400, '비밀번호는 6~64자');
      if (await limited('reg:' + ipOf(req), 5, 3600)) return fail(429, '가입 시도가 너무 많다. 잠시 뒤에 다시');
      const salt = crypto.randomBytes(16).toString('hex');
      const ok = await one(['HSETNX', P + 'u:' + id, 'pw', hashPw(pw, salt)]);
      if (!Number(ok)) return fail(409, '이미 있는 아이디다');
      await db.run([['HSET', P + 'u:' + id, 'salt', salt, 'nick', nick, 'created', String(Date.now())], ['INCR', P + 'count']]);
      return res.status(200).json({ ok: true, token: await newSession(id), user: await profile(id) });
    }
    // ---- 로그인 ----
    if (a === 'login') {
      const id = String(b.id || '').toLowerCase().trim(), pw = String(b.pw || '');
      if (!ID_RE.test(id) || !pw) return fail(400, '아이디와 비밀번호를 확인하자');
      if (await limited('lg:' + ipOf(req), 30, 600) || await limited('lgid:' + id, 10, 600)) return fail(429, '로그인 시도가 너무 많다. 10분 뒤에 다시');
      const [h, salt] = await db.run([['HGET', P + 'u:' + id, 'pw'], ['HGET', P + 'u:' + id, 'salt']]);
      if (!h || !salt || !samePw(pw, salt, h)) return fail(401, '아이디 또는 비밀번호가 틀렸다');
      return res.status(200).json({ ok: true, token: await newSession(id), user: await profile(id) });
    }
    // ---- 누구나: 전체 순위 · 다른 세계의 기자 ----
    if (a === 'hall-top') {
      if (await limited('ht:' + ipOf(req), 120, 600)) return fail(429, '잠시 뒤에 다시');
      const mo = b.scope === 'month', mk = monthKey();
      const me = await userOf(req);
      const L = await hallRead(mo ? P + 'hall:m:' + mk : P + 'hall:all', 50, mo ? P + 'hall:em:' + mk : P + 'hall:e');
      return res.status(200).json({ ok: true, list: L.map(({ t, uid, ca, ...x }) => ({ ...x, mine: !!(me && me.id === uid) })) }); // 아이디는 내보내지 않는다
    }
    if (a === 'ghosts') {
      if (await limited('gh:' + ipOf(req), 60, 600)) return fail(429, '잠시 뒤에 다시');
      const L = await hallRead(P + 'hall:recent', 60);
      const me = await userOf(req), old = Date.now() - 3 * 24 * 3600e3;
      const pickN = L.filter((x) => x.yrs >= 5 && !x.story && x.nm !== '이름 없는 기자' && (!me || me.id !== x.uid) && (x.ca || 0) < old).sort(() => Math.random() - 0.5).slice(0, 8);
      return res.status(200).json({ ok: true, list: pickN.map((x) => ({ nm: x.nm, rn: x.rn, o: x.o, end: x.end, yrs: x.yrs, sc: x.sc, best: x.best })) });
    }
    // ---- 여기부터는 로그인한 사람만 ----
    const u = await userOf(req);
    if (!u) return fail(401, '로그인이 풀렸다. 다시 로그인하자');
    const id = u.id;
    if (a === 'me') return res.status(200).json({ ok: true, user: await profile(id) });
    if (a === 'logout') { await db.run([['DEL', P + 'sess:' + u.tok], ['SREM', P + 'sl:' + id, u.tok]]); return res.status(200).json({ ok: true }); }
    if (a === 'password' || a === 'delete') {
      const [h, salt] = await db.run([['HGET', P + 'u:' + id, 'pw'], ['HGET', P + 'u:' + id, 'salt']]);
      if (await limited('pw:' + id, 10, 600)) return fail(429, '시도가 너무 많다. 10분 뒤에 다시');
      if (!samePw(String(b.pw || ''), salt, h)) return fail(401, '지금 비밀번호가 틀렸다');
      const toks = (await one(['SMEMBERS', P + 'sl:' + id])) || [];
      const kill = toks.map((t) => ['DEL', P + 'sess:' + t]);
      if (a === 'password') {
        const npw = String(b.npw || ''); if (npw.length < 6 || npw.length > 64) return fail(400, '새 비밀번호는 6~64자');
        const ns = crypto.randomBytes(16).toString('hex');
        await db.run([['HSET', P + 'u:' + id, 'pw', hashPw(npw, ns), 'salt', ns], ...kill, ['DEL', P + 'sl:' + id]]);
        return res.status(200).json({ ok: true, token: await newSession(id) }); // 다른 기기는 모두 로그아웃
      }
      await db.run([...kill, ['DEL', P + 'sl:' + id, P + 'u:' + id, P + 'meta:' + id, ...SLOTS.map((s) => P + 'sv:' + id + ':' + s)], ['DECR', P + 'count'], ['ZREM', P + 'hall:all', id], ['ZREM', P + 'hall:recent', id], ['HDEL', P + 'hall:e', id], ...recentMonths().flatMap((m) => [['ZREM', P + 'hall:m:' + m, id], ['HDEL', P + 'hall:em:' + m, id]])]);
      return res.status(200).json({ ok: true });
    }
    // ---- 명예의 전당에 내 판 올리기: 한 사람은 가장 높은 판 하나만 순위에 남는다 ----
    if (a === 'hall-put') {
      const r = b.run || {}; if (!r.nm || r.sc == null) return fail(400, '판 기록이 없다');
      if (await limited('hp:' + id, 6, 3600)) return fail(429, '잠시 뒤에 다시');
      const [nick, created] = await db.run([['HGET', P + 'u:' + id, 'nick'], ['HGET', P + 'u:' + id, 'created']]);
      const e = hallEntry(r, id, nick || '기자'), mk = P + 'hall:m:' + monthKey(), mh = P + 'hall:em:' + monthKey();
      e.ca = Number(created || Date.now());
      const [prevAll, prevM] = await db.run([['ZSCORE', P + 'hall:all', id], ['ZSCORE', mk, id]]);
      const cmds = [['ZADD', P + 'hall:recent', String(Date.now()), id], ['ZREMRANGEBYRANK', P + 'hall:recent', '0', '-201']];
      const better = prevAll == null || e.sc > Number(prevAll);
      if (better) cmds.push(['ZADD', P + 'hall:all', String(e.sc), id], ['HSET', P + 'hall:e', id, JSON.stringify(e)]);
      if (prevM == null || e.sc > Number(prevM)) cmds.push(['ZADD', mk, String(e.sc), id], ['HSET', mh, id, JSON.stringify(e)], ['EXPIRE', mk, String(100 * 24 * 3600)], ['EXPIRE', mh, String(100 * 24 * 3600)]);
      cmds.push(['ZREMRANGEBYRANK', P + 'hall:all', '0', String(-HALL_MAX - 1)]);
      await db.run(cmds);
      return res.status(200).json({ ok: true, best: better });
    }
    // ---- 클라우드 저장 ----
    if (a === 'list') {
      const r = await db.run(SLOTS.map((s) => ['HMGET', P + 'sv:' + id + ':' + s, 't', 'label', 'n']));
      return res.status(200).json({ ok: true, slots: SLOTS.map((s, i) => { const x = r[i] || []; return x[0] ? { slot: s, t: Number(x[0]), label: x[1] || '', size: Number(x[2] || 0) } : { slot: s }; }) });
    }
    const slot = String(b.slot || '');
    if (a === 'get') {
      if (!SLOTS.includes(slot)) return fail(400, '없는 슬롯');
      const [t, label, z] = await one(['HMGET', P + 'sv:' + id + ':' + slot, 't', 'label', 'z']) || [];
      if (!z) return fail(404, '이 슬롯은 비어 있다');
      return res.status(200).json({ ok: true, t: Number(t), label, z });
    }
    if (a === 'put') {
      if (!SLOTS.includes(slot)) return fail(400, '없는 슬롯');
      const z = String(b.z || ''); if (!z || z.length > MAX_Z || !/^[A-Za-z0-9+/=]+$/.test(z)) return fail(413, '저장 파일이 너무 크거나 올바르지 않다');
      if (await limited('put:' + id, 120, 3600)) return fail(429, '저장이 너무 잦다. 잠시 뒤에 다시');
      await one(['HSET', P + 'sv:' + id + ':' + slot, 't', String(Number(b.t) || Date.now()), 'label', String(b.label || '').slice(0, 160), 'z', z, 'n', String(z.length)]);
      return res.status(200).json({ ok: true });
    }
    if (a === 'del') { if (!SLOTS.includes(slot)) return fail(400, '없는 슬롯'); await one(['DEL', P + 'sv:' + id + ':' + slot]); return res.status(200).json({ ok: true }); }
    // ---- 기록실(업적·엔딩·판 기록) ----
    if (a === 'meta-get') { const [t, z] = await one(['HMGET', P + 'meta:' + id, 't', 'z']) || []; return res.status(200).json({ ok: true, t: Number(t || 0), z: z || '' }); }
    if (a === 'meta-put') {
      const z = String(b.z || ''); if (!z || z.length > MAX_Z || !/^[A-Za-z0-9+/=]+$/.test(z)) return fail(413, '기록이 너무 크거나 올바르지 않다');
      if (await limited('meta:' + id, 120, 3600)) return fail(429, '동기화가 너무 잦다');
      await one(['HSET', P + 'meta:' + id, 't', String(Date.now()), 'z', z]);
      return res.status(200).json({ ok: true });
    }
    return fail(400, '모르는 동작');
  } catch (err) {
    try { console.error('account', a, err); } catch {}
    try { if (db && db.quit) await db.quit(); } catch {}
    db = null;
    return fail(500, '서버 오류 — 잠시 뒤에 다시');
  }
}
