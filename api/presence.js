// 바이라인 동시 접속자 API (Vercel 서버리스 함수)
// - 게임 화면이 열려 있는 동안 브라우저가 10분마다 신호(POST)를 보낸다. 페이지를 열면 바로 첫 신호.
// - 최근 11분 안에 신호를 보낸 브라우저 수 = "지금 플레이 중", 누적 고유 방문자, 새 게임 시작 수도 센다.
// - Upstash(REST) 환경 변수든, Redis 접속 주소(REDIS_URL)든 이름에 상관없이 찾아서 쓴다.
// - 숫자는 관리자만: Vercel 환경 변수 ADMIN_KEY 를 정해 두면, 같은 값을 x-admin-key 헤더로 보낸 요청에만 숫자를 돌려준다.
//   (1.76부터 주소 ?key= 는 받지 않는다 — 주소는 기록·공유로 새기 쉽다. 게임은 ?admin= 으로 한 번 열면 헤더로 바꿔 보낸다)
//   ADMIN_KEY 가 없으면 아무에게도 숫자를 보여주지 않는다 (신호는 그대로 센다).
// - 연결 상태 점검: 배포 주소 뒤에 /api/presence?debug=1 을 열면 연결 방식과 오류가 보인다 (환경 변수 이름·값은 보이지 않는다).
// - 한 IP에서 10분에 40번 넘게 신호를 보내면 그 신호는 세지 않는다 (접속자 수 부풀리기 막기).

import crypto from 'node:crypto';

const BEAT_MS = 10 * 60 * 1000;          // 신호 간격 10분 (index.html의 600000과 맞춘다)
const WINDOW_MS = BEAT_MS + 60 * 1000;   // 11분 안에 신호가 있으면 접속 중
const K = { online: 'byline:online', visitors: 'byline:visitors', games: 'byline:games' };
const EMPTY = { online: null, total: null, games: null };
const RL_N = 40, RL_WIN = 600;            // IP 하나당 10분에 40번까지
const sameKey = (a, b) => { const x = Buffer.from(String(a)), y = Buffer.from(String(b)); return x.length === y.length && crypto.timingSafeEqual(x, y); };
const ipOf = (req) => String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim().replace(/[^0-9a-fA-F:.]/g, '').slice(0, 64) || 'x';

// 환경 변수 찾기: 접두사를 붙여 연결했어도 찾는다 (예: STORAGE_KV_REST_API_URL, MYDB_UPSTASH_REDIS_REST_URL)
function findEnv() {
  const env = process.env, keys = Object.keys(env);
  const pick = (re) => keys.find((k) => re.test(k) && env[k]);
  const restUrlKey = pick(/(^|_)(KV_REST_API_URL|UPSTASH_REDIS_REST_URL|REDIS_REST_URL)$/);
  const restTokKey = pick(/(^|_)(KV_REST_API_TOKEN|UPSTASH_REDIS_REST_TOKEN|REDIS_REST_TOKEN)$/) ;
  const tcpKey = pick(/(^|_)(REDIS_URL|KV_URL)$/);
  return { restUrlKey, restTokKey, tcpKey, seen: keys.filter((k) => /REDIS|KV_|UPSTASH/i.test(k)) };
}

let client = null, mode = 'none', initErr = '';
async function getClient() {
  if (client) return client;
  const e = findEnv();
  try {
    if (e.restUrlKey && e.restTokKey) {
      // Upstash REST는 라이브러리 없이 fetch로 바로 부른다 (패키지 설치 문제로 안 되는 일을 없앤다)
      const base = process.env[e.restUrlKey].replace(/\/+$/, ''), tok = process.env[e.restTokKey];
      mode = 'upstash-rest';
      client = {
        async limited(ip) {
          const r = await fetch(base + '/pipeline', { method: 'POST', headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' }, body: JSON.stringify([['INCR', 'byline:rl:pr:' + ip], ['EXPIRE', 'byline:rl:pr:' + ip, String(RL_WIN), 'NX']]) });
          if (!r.ok) return false; const out = await r.json(); return Number(out[0] && out[0].result) > RL_N;
        },
        async run(id, ev, now) {
          const cmds = [];
          if (id) { cmds.push(['ZADD', K.online, String(now), id]); if (ev === 'open') cmds.push(['PFADD', K.visitors, id]); if (ev === 'start') cmds.push(['INCR', K.games]); }
          cmds.push(['ZREMRANGEBYSCORE', K.online, '0', String(now - WINDOW_MS)], ['ZCARD', K.online], ['PFCOUNT', K.visitors], ['GET', K.games]);
          const r = await fetch(base + '/pipeline', { method: 'POST', headers: { Authorization: 'Bearer ' + tok, 'Content-Type': 'application/json' }, body: JSON.stringify(cmds) });
          if (!r.ok) throw new Error('Upstash 응답 ' + r.status + (r.status === 401 ? ' (토큰이 틀렸거나 읽기 전용 토큰)' : ''));
          const out = await r.json(); const bad = out.find((x) => x && x.error); if (bad) throw new Error(bad.error);
          const n = out.length; return [out[n - 3].result, out[n - 2].result, out[n - 1].result];
        },
      };
    } else if (e.tcpKey) {
      const { createClient } = await import('redis');
      const r = createClient({ url: process.env[e.tcpKey], socket: { connectTimeout: 5000, tls: /^rediss:/.test(process.env[e.tcpKey]) } });
      r.on('error', () => {});
      await r.connect();
      mode = 'redis-url';
      client = {
        async limited(ip) { const k = 'byline:rl:pr:' + ip; const out = await r.multi().incr(k).expire(k, RL_WIN, 'NX').exec(); return Number(out[0]) > RL_N; },
        async run(id, ev, now) {
          const m = r.multi();
          if (id) { m.zAdd(K.online, { score: now, value: id }); if (ev === 'open') m.pfAdd(K.visitors, id); if (ev === 'start') m.incr(K.games); }
          m.zRemRangeByScore(K.online, 0, now - WINDOW_MS); m.zCard(K.online); m.pfCount(K.visitors); m.get(K.games);
          const out = await m.exec(); const n = out.length;
          return [out[n - 3], out[n - 2], out[n - 1]];
        },
      };
    }
  } catch (err) { initErr = String(err && err.message || err).slice(0, 200); client = null; try { console.error('presence init', err); } catch {} }
  return client;
}

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  if (req.method !== 'POST' && req.method !== 'GET') return res.status(405).json({ error: 'method' });
  const debug = req.query && (req.query.debug === '1');
  const ADMIN = process.env.ADMIN_KEY || '';
  const given = String(req.headers['x-admin-key'] || '');
  const isAdmin = !!ADMIN && sameKey(given, ADMIN);
  const c = await getClient();
  if (!c) {
    const e = findEnv();
    return res.status(200).json(debug ? { ...EMPTY, mode, found: { rest: !!(e.restUrlKey && e.restTokKey), redisUrl: !!e.tcpKey }, error: initErr ? '연결 실패 — Vercel 로그를 확인하자' : '연결할 Redis 환경 변수를 찾지 못했다' } : EMPTY);
  }
  let body = req.body || {};
  if (typeof body === 'string') { try { body = JSON.parse(body); } catch { body = {}; } }
  let id = req.method === 'POST' ? String(body.id || '').replace(/[^a-z0-9]/gi, '').slice(0, 40) : '';
  try { if (id && c.limited && await c.limited(ipOf(req))) id = ''; } catch {}
  const ev = ['open', 'start', 'beat'].includes(body.ev) ? body.ev : 'beat';
  try {
    const [online, total, games] = await c.run(id, ev, Date.now());
    const out = { online: Number(online || 0), total: Number(total || 0), games: Number(games || 0), beat: BEAT_MS };
    if (!isAdmin) return res.status(200).json(debug ? { ok: true, mode, admin: ADMIN ? '키가 틀렸거나 없음' : 'ADMIN_KEY 미설정' } : { ok: true });
    return res.status(200).json(debug ? { ...out, mode } : out);
  } catch (err) {
    client = null;
    try { console.error('presence', err); } catch {}
    return res.status(200).json(debug ? { ...EMPTY, mode, error: '저장소 응답 오류 — Vercel 로그를 확인하자' } : EMPTY);
  }
}
