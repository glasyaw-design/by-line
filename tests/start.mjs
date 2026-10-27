// 실제 시작 경로 테스트: npm run test:start   (먼저 npm run build)
// 일반 이용자처럼 첫 화면에서 이름을 넣고 모드를 골라 게임에 들어가 첫 달을 넘긴다.
//  - 시작 모드 5개 × 폰(390px)·PC(1366px)
//  - 배포판(dist)을 vercel.json의 헤더(보안 정책 CSP 포함) 그대로 붙여서 띄운다 → CSP 위반·페이지 오류·멈춘 창을 잡는다
//  - 계정: 가입(동의 체크 필수) → 클라우드 저장 → 다른 브라우저에서 로그인해 불러오기 → 계정 삭제 (메모리 Redis)
//  - 저장 공간이 가득 찬 상황에서 저장 실패 알림이 뜨는지
// 필요: Playwright (npm i -D playwright && npx playwright install chromium)
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { fakeRedis } from './lib/fake-redis.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
if (!fs.existsSync(path.join(DIST, 'index.html'))) { console.error('dist가 없다. 먼저 npm run build'); process.exit(2); }
const req = createRequire(import.meta.url);
let pw = null;
for (const n of ['playwright', 'playwright-core', process.env.PW_MODULE].filter(Boolean)) { try { pw = req(n); break; } catch {} }
if (!pw) { console.error('Playwright가 없습니다: npm i -D playwright && npx playwright install chromium'); process.exit(2); }

globalThis.__BYLINE_TEST_DB = fakeRedis();
const { default: account } = await import('../api/account.js');

// vercel.json 헤더를 그대로 붙인다 (source 패턴은 /(.*) 꼴만 쓰므로 간단히 정규식으로 바꾼다)
const VJ = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
const RULES = (VJ.headers || []).map((h) => ({ re: new RegExp('^' + h.source.replace(/\./g, '\\.').replace(/\(\\\.\*\)|\(\.\*\)/g, '(.*)') + '$'), headers: h.headers }));
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.woff': 'font/woff', '.mp3': 'audio/mpeg', '.json': 'application/json', '.webmanifest': 'application/manifest+json', '.svg': 'image/svg+xml', '.ico': 'image/x-icon', '.txt': 'text/plain; charset=utf-8', '.md': 'text/markdown; charset=utf-8' };
const sv = http.createServer(async (q, a) => {
  const u = new URL(q.url, 'http://x');
  const hdr = {}; for (const r of RULES) if (r.re.test(u.pathname)) for (const h of r.headers) hdr[h.key] = h.value;
  if (u.pathname === '/api/account') {
    let body = ''; for await (const ch of q) body += ch; let j = {}; try { j = JSON.parse(body || '{}'); } catch {}
    const R = { _c: 200, setHeader() {}, status(c) { this._c = c; return this; }, json(o) { a.writeHead(this._c, { ...hdr, 'content-type': 'application/json' }); a.end(JSON.stringify(o)); } };
    q.query = Object.fromEntries(u.searchParams); q.body = j; await account(q, R); return;
  }
  if (u.pathname.startsWith('/api/')) { a.writeHead(200, { 'content-type': 'application/json' }); return a.end('{}'); }
  let p = decodeURIComponent(u.pathname); if (p.endsWith('/')) p += 'index.html';
  let f = path.join(DIST, p); if (!f.startsWith(DIST)) { a.writeHead(403); return a.end(); }
  if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f += '.html'; // cleanUrls
  fs.readFile(f, (e, b) => { if (e) { a.writeHead(404); return a.end(); } a.writeHead(200, { ...hdr, 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); a.end(b); });
});
await new Promise((r) => sv.listen(0, '127.0.0.1', r));
const URL0 = `http://localhost:${sv.address().port}/`;

let fails = 0; const ok = (c, m, x) => { if (c) console.log('  ✓', m); else { fails++; console.log('  ✗', m, x === undefined ? '' : JSON.stringify(x).slice(0, 400)); } };
const browser = await pw.chromium.launch();
const IGN = /fonts\.(googleapis|gstatic)\.com|Failed to load resource|ERR_NAME_NOT_RESOLVED|ERR_INTERNET_DISCONNECTED|ERR_CONNECTION/; // 테스트 환경엔 바깥 인터넷이 없을 수 있다
async function open(vp) {
  const ctx = await browser.newContext({ viewport: { width: vp.w, height: vp.h }, isMobile: !!vp.mob, hasTouch: !!vp.mob, reducedMotion: 'reduce' });
  const page = await ctx.newPage(); const errs = [];
  page.on('pageerror', (e) => errs.push('page ' + String(e).slice(0, 160)));
  page.on('console', (m) => { const t = m.text(); if (m.type() === 'error' && !IGN.test(t)) errs.push('console ' + t.slice(0, 160)); if (/Content Security Policy|Refused to/.test(t)) errs.push('CSP ' + t.slice(0, 200)); });
  await page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort());
  await page.goto(URL0);
  await page.waitForFunction("typeof start==='function'&&typeof S!=='undefined'&&S&&S.phase", null, { timeout: 90000 });
  await page.waitForTimeout(1200);
  return { ctx, page, errs };
}
// 열린 창을 하나씩 넘긴다 (추천 버튼 → 일반 버튼 → 아무 버튼)
async function clearModals(page, max = 40) {
  let last = '', same = 0;
  for (let i = 0; i < max; i++) {
    const st = await page.evaluate(() => ({ open: !$('#modal').hidden, q: Q.length, t: $('#mt').textContent }));
    if (!st.open) { if (st.q) { await page.evaluate(() => { try { Q.shift()(); } catch (e) {} }); continue; } return { stuck: null }; }
    if (st.t === last) { if (++same > 8) return { stuck: st.t }; } else { same = 0; last = st.t; }
    await page.evaluate(() => { for (const i of document.querySelectorAll('#mb input[type=text],#mb input:not([type])')) if (!i.value) i.value = '테스트'; for (const c of [...document.querySelectorAll('#mb input[type=checkbox]')].slice(0, 3)) c.checked = true; });
    const b = await page.$('#mc button.rec:not([disabled])') || await page.$('#mc button:not(.ghost):not([disabled])') || await page.$('#mc button:not([disabled])');
    if (!b) return { stuck: st.t + ' (누를 버튼 없음)' };
    await b.click(); await page.waitForTimeout(150);
  }
  return { stuck: null, more: true };
}

console.log('▶ 시작 모드 5개 × 폰·PC');
const MODES = ['언론고시', '중소 매체', '간소화', '빠른 시작', '창간'];
const VPS = [{ n: '폰', w: 390, h: 844, mob: 1 }, { n: 'PC', w: 1366, h: 900 }];
for (const mode of MODES) for (const vp of VPS) {
  const { ctx, page, errs } = await open(vp); let res = '';
  try {
    const inp = await page.$('input'); if (inp) await inp.fill('테스트기자');
    const card = await page.$(`text="${mode}"`); if (!card) throw new Error('첫 화면에 「' + mode + '」 카드가 없다');
    await card.click(); await page.waitForTimeout(400);
    let stuck = null;
    for (let i = 0; i < 120; i++) {
      const ph = await page.evaluate(() => S.phase);
      if (ph === 'game' && await page.evaluate(() => $('#modal').hidden && !Q.length)) break;
      if (await page.evaluate(() => !$('#modal').hidden)) { const r = await clearModals(page, 6); if (r.stuck) { stuck = r.stuck; break; } continue; }
      const b = await page.$('button.next:not([disabled])') || await page.$('[data-apply]');
      if (!b) { stuck = '진행 버튼 없음 (phase ' + ph + ')'; break; }
      await b.click(); await page.waitForTimeout(250);
    }
    const s1 = await page.evaluate(() => [S.phase, S.turn]);
    if (stuck || s1[0] !== 'game') throw new Error('게임에 못 들어갔다: ' + (stuck || s1[0]));
    const hx = await page.evaluate(() => document.documentElement.scrollWidth - innerWidth);
    await page.evaluate(() => { S.ap = 0; endMonth(); });
    const r2 = await clearModals(page, 60); if (r2.stuck || r2.more) throw new Error('첫 달 결산에서 멈췄다: ' + (r2.stuck || '창이 끝없이 뜬다'));
    const s2 = await page.evaluate(() => [S.phase, S.turn, Number.isFinite(S.money) && Number.isFinite(S.eval)]);
    ok(s2[0] === 'game' && s2[1] > s1[1] && s2[2] && !errs.length && hx <= 1, `${mode} · ${vp.n} — 게임 진입 · 첫 달 넘김${hx > 1 ? ' · 가로 스크롤 ' + hx + 'px' : ''}`, errs.length ? errs.slice(0, 3) : s2);
  } catch (e) { ok(false, `${mode} · ${vp.n}`, String(e.message || e).slice(0, 200) + ' ' + errs.slice(0, 2).join(' | ')); }
  await ctx.close();
}

console.log('▶ 계정 · 클라우드 저장');
{
  const A = await open({ w: 1366, h: 900 });
  const p = A.page;
  await p.evaluate(() => { devQuick({ rank: 1, outlet: 'daehan' }); S.dev = false; closeModal(); Q.length = 0; S.name = '계정테스트'; render(); });
  await p.evaluate(() => accMenu());
  await p.fill('#acci', 'play_test'); await p.fill('#accp', 'pass1234');
  await p.evaluate(() => accDo('register')); await p.waitForTimeout(400);
  ok(/동의/.test(await p.textContent('#accw')) && !(await p.evaluate(() => accGet())), '동의에 체크하지 않으면 가입되지 않는다');
  ok(await p.evaluate(() => !!document.querySelector('.ag76 a[href="privacy.html"]')), '가입 창에 개인정보처리방침 링크가 있다');
  await p.check('#accag'); await p.evaluate(() => accDo('register'));
  await p.waitForFunction(() => !!accGet(), null, { timeout: 10000 }).catch(() => {});
  ok(await p.evaluate(() => !!accGet()), '동의하면 가입되고 로그인된다');
  const turn = await p.evaluate(() => S.turn);
  const put = await p.evaluate(async () => { try { await accPut('1'); return 'ok'; } catch (e) { return String(e.message || e); } });
  ok(put === 'ok', '클라우드 슬롯 1에 올린다', put);
  const B = await open({ w: 390, h: 844, mob: 1 });
  const got = await B.page.evaluate(async () => { const r = await accApi('login', { id: 'play_test', pw: 'pass1234' }); accSet({ tok: r.token, id: r.user.id, nick: r.user.nick }); const g = await accApi('get', { slot: '1' }); const s = JSON.parse(await accUnzip(g.z)); return s ? [s.name, s.turn] : null; });
  ok(got && got[0] === '계정테스트' && got[1] === turn, '다른 기기(폰)에서 로그인해 같은 저장을 받는다', got);
  const del = await B.page.evaluate(async () => { try { await accApi('delete', { pw: 'pass1234' }); return 'ok'; } catch (e) { return String(e.message); } });
  ok(del === 'ok', '계정을 지운다', del);
  ok(!A.errs.length && !B.errs.length, '계정 흐름에서 페이지 오류 없음', [...A.errs, ...B.errs].slice(0, 3));
  await A.ctx.close(); await B.ctx.close();
}

console.log('▶ 저장 공간이 가득 찼을 때');
{
  const { ctx, page, errs } = await open({ w: 390, h: 844, mob: 1 });
  await page.evaluate(() => { devQuick({ rank: 1, outlet: 'daehan' }); S.dev = false; closeModal(); Q.length = 0; render(); });
  await page.evaluate(() => { const orig = Storage.prototype.setItem; window.__full = 1; Storage.prototype.setItem = function (k, v) { if (window.__full && String(v).length > 2000) { const e = new Error('QuotaExceededError'); e.name = 'QuotaExceededError'; throw e; } return orig.call(this, k, v); }; saveGame(); render(); });
  await page.waitForTimeout(300);
  ok(await page.evaluate(() => !!document.getElementById('svf76')), '저장이 실패하면 경고 막대가 뜬다');
  await page.evaluate(() => { window.__full = 0; saveGame(); render(); });
  await page.waitForTimeout(300);
  ok(await page.evaluate(() => !document.getElementById('svf76')), '저장이 다시 되면 막대가 사라진다');
  ok(!errs.length, '페이지 오류 없음', errs.slice(0, 3));
  await ctx.close();
}

console.log('▶ 공개 파일');
for (const f of ['privacy.html', 'manifest.webmanifest', 'favicon.ico', 'icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'robots.txt', 'og.png', 'CREDITS.md']) ok(fs.existsSync(path.join(DIST, f)), 'dist/' + f);
{ const h = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8'); ok(/<script src="src\/app\.[0-9a-f]+\.js"><\/script>/.test(h) && (h.match(/<script /g) || []).length === 1, '게임 코드는 파일 하나로 묶였다'); ok(/rel="manifest"/.test(h) && /rel="icon"/.test(h), 'index.html에 아이콘·manifest 연결'); }

{ const h = await new Promise((res) => http.get(URL0, (r) => { r.resume(); res(r.headers); }));
  ok(/default-src 'self'/.test(h['content-security-policy'] || '') && h['x-content-type-options'] === 'nosniff', '보안 헤더(CSP·nosniff)를 붙인 채로 테스트했다'); }
await browser.close(); sv.close();
console.log(`\n${fails ? '✗ 실패 ' + fails + '건' : '✓ 모두 통과'}`);
process.exit(fails ? 1 : 0);
