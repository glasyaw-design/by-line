// 바이라인 자동 회귀 테스트
//   npm test            검사 → 빌드 → 브라우저로 시나리오를 돌려 기준값(tests/golden.json)과 비교
//   npm run test:update 의도한 게임 변경 뒤 기준값을 새로 저장
// 필요: Playwright (처음 한 번: npm i -D playwright && npx playwright install chromium)
import fs from 'node:fs';
import path from 'node:path';
import http from 'node:http';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execFileSync } from 'node:child_process';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = p => path.join(ROOT, p);
const UPDATE = process.argv.includes('--update');
const QUICK = process.argv.includes('--quick');
const req = createRequire(import.meta.url);
let pw = null;
for (const n of ['playwright', 'playwright-core', process.env.PW_MODULE].filter(Boolean)) { try { pw = req(n); break; } catch {} }
if (!pw) { console.error('Playwright가 없습니다. 한 번만 설치하세요:\n  npm i -D playwright\n  npx playwright install chromium'); process.exit(2); }

const step = (t) => console.log(`\n▶ ${t}`);
let fails = 0; const fail = (...a) => { fails++; console.log('  ✗', ...a); }; const ok = (...a) => console.log('  ✓', ...a);

// 1) 정적 검사 · 빌드
step('정적 검사 · 빌드');
for (const s of ['scripts/check.mjs', 'scripts/build.mjs']) {
  try { const out = execFileSync(process.execPath, [r(s)], { encoding: 'utf8' }); ok(out.trim().split('\n').pop()); }
  catch (e) { fail(s, String(e.stdout || '') + String(e.stderr || '')); process.exit(1); }
}

// 2) 정적 서버 (dist · dist-single)
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.woff': 'font/woff', '.mp3': 'audio/mpeg', '.json': 'application/json' };
function serve(root) {
  return new Promise(res => {
    const sv = http.createServer((q, a) => {
      let p = decodeURIComponent(new URL(q.url, 'http://x').pathname); if (p.endsWith('/')) p += 'index.html';
      const f = path.join(root, p); if (!f.startsWith(root)) { a.writeHead(403); return a.end(); }
      fs.readFile(f, (e, b) => { if (e) { a.writeHead(404); return a.end(); } a.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' }); a.end(b); });
    });
    sv.listen(0, '127.0.0.1', () => res({ url: `http://127.0.0.1:${sv.address().port}/`, close: () => sv.close() }));
  });
}

// 3) 테스트 전용 고정: 난수 · 시각 (게임 코드는 건드리지 않는다)
const INIT = `(()=>{let s=0x9E3779B9>>>0;window.__seed=v=>{s=v>>>0;};
 Math.random=function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
 let now=1767225600000;const D=Date;const tick=()=>{now+=7;return now;};window.Date=class extends D{constructor(...a){if(a.length)super(...a);else super(tick());}static now(){return tick();}};window.Date.UTC=D.UTC;window.Date.parse=D.parse;
 window.__devTest=1;try{if(!sessionStorage.getItem('__t')){localStorage.clear();localStorage.setItem('byline-vet','1');sessionStorage.setItem('__t','1');}}catch(e){}})();`;
// 무작위 플레이 + 점검: 게임 안에서 실행된다
const SIM = `async([cfg,months,seed])=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));
 let ds=seed>>>0;const drand=()=>{ds=(ds*1664525+1013904223)>>>0;return ds/4294967296;};window.toast=()=>{};__seed(seed);
 if(cfg)devQuick(cfg);await sleep(0);S.dev=false;closeModal();Q.length=0;const errs=[];const bad=[];
 const drain=()=>{for(let i=0;i<80;i++){const m=$('#modal');if(m.hidden){if(Q.length){try{Q.shift()();}catch(e){errs.push('Q '+e.message);}continue;}return;}const t=$('#mt').textContent;const bs=[...document.querySelectorAll('#mc button')].filter(x=>!x.disabled);let c=bs[Math.floor(drand()*bs.length)];if(/인수|매각|사표|퇴사|이직|창간|스카우트|권유|희망퇴직|명예퇴직/.test(t))c=bs.find(x=>/거절|버틴|남는다|사양|안 간다|정중히|생각 없/.test(x.innerText))||bs[bs.length-1];if(!c){closeModal();continue;}try{c.click();}catch(e){errs.push('click '+e.message);}}$('#modal').hidden=true;Q.length=0;};
 const inv=(m)=>{const num={money:S.money,eval:S.eval,fame:S.fame,trust:S.trust,hp:S.hp,cash:S.co&&S.co.cash,q:S.co&&S.co.q};for(const k in num){if(num[k]!=null&&!Number.isFinite(num[k]))bad.push('m'+m+' NaN '+k);}
   try{const per=roster();const seen=new Map();Object.entries(per).forEach(([d,L])=>{if(!Array.isArray(L))return;L.forEach(p=>{if(!p)return;if(seen.has(p))bad.push('m'+m+' 두 부서에 '+p.name);seen.set(p,d);if(!Number.isFinite(p.skill))bad.push('m'+m+' 실력 NaN '+p.name);});});(S.team||[]).forEach(p=>{if(!seen.has(p)&&!p.reg)bad.push('m'+m+' 명부에 없는 팀원 '+p.name);});}catch(e){bad.push('m'+m+' 명부 '+e.message);}
   const l=S.co&&S.co.last;if(l&&l.net!=null&&Math.abs((l.profit||0)+(l.etc||0)-l.net)>.001)bad.push('m'+m+' 재무 불일치');};
 for(let m=0;m<months&&S.phase==='game';m++){const ids=rankActs().filter(id=>ACT[id]&&!why(id)&&!['job','found'].includes(id)).sort();
   for(let g=0;g<3&&S.ap>0&&ids.length;g++){const id=ids[Math.floor(drand()*ids.length)];const a0=S.ap;try{doAction(id);}catch(e){errs.push('act '+id+' '+e.message);}drain();if(S.ap===a0)S.ap--;}
   S.ap=0;try{endMonth();}catch(e){errs.push('endMonth '+e.message);}drain();inv(m);}
 return {st:JSON.stringify(S,(k,v)=>k==='scene'?undefined:v),turn:S.turn,phase:S.phase,errs:errs.slice(0,5),bad:[...new Set(bad)].slice(0,5)};}`;
const H = s => crypto.createHash('sha256').update(s).digest('hex').slice(0, 16);

const SC = JSON.parse(fs.readFileSync(r('tests/scenarios.json'), 'utf8')).filter(x => !QUICK || x.quick);
const GOLD_F = r('tests/golden.json');
const gold = fs.existsSync(GOLD_F) ? JSON.parse(fs.readFileSync(GOLD_F, 'utf8')) : {};
const newGold = {};

const A = await serve(r('dist')), B = await serve(r('dist-single'));
const browser = await pw.chromium.launch();
async function run(url, sc, months, seed, pre) {
  const ctx = await browser.newContext({ reducedMotion: 'reduce', viewport: { width: 1280, height: 900 } });
  const page = await ctx.newPage(); const perr = [];
  page.on('pageerror', e => perr.push(String(e).slice(0, 160)));
  await page.addInitScript(INIT); await page.goto(url);
  await page.waitForFunction("typeof start==='function'&&typeof S!=='undefined'&&S&&S.phase", null, { timeout: 60000 });
  await page.waitForTimeout(300);
  if (pre) await page.evaluate(pre.fn, pre.arg);
  const out = await page.evaluate(`(${SIM})(${JSON.stringify([sc, months, seed])})`);
  out.perr = perr; out.page = page; out.ctx = ctx; return out;
}
try {
  step(`시나리오 ${SC.length}개 (같은 난수 · dist와 단일 빌드 비교 · 기준값 비교)`);
  for (const s of SC) {
    const seed = parseInt(H(s.name).slice(0, 8), 16);
    const a = await run(A.url, s.cfg, s.months, seed), b = await run(B.url, s.cfg, s.months, seed);
    const ha = H(a.st), hb = H(b.st); newGold[s.name] = ha;
    const issues = [...a.errs, ...a.perr, ...a.bad];
    if (ha !== hb) fail(`${s.name}: dist와 단일 빌드 결과가 다르다 (${ha} / ${hb})`);
    else if (issues.length) fail(`${s.name}: ${issues.join(' | ')}`);
    else if (gold[s.name] && gold[s.name] !== ha && !UPDATE) fail(`${s.name}: 기준값과 다르다 (${gold[s.name]} → ${ha}) — 의도한 변경이면 npm run test:update`);
    else ok(`${s.name}: ${a.turn}턴 · 상태 ${ha}${gold[s.name] ? ' · 기준값과 같음' : ' · (기준값 없음)'}`);
    // 저장 → 새 창에서 불러오기: 불러온 직후 상태가 저장 전과 같고, 이어서 3개월을 해도 오류가 없어야 한다
    if (s.save) {
      const snapJS = `JSON.stringify(S,(k,v)=>['scene','dev','_auto','_autoBan','tab'].includes(k)?undefined:v)`;
      const before = await a.page.evaluate(`(()=>{const c=saveCode();return [c,${snapJS}];})()`);
      const ctx2 = await browser.newContext({ reducedMotion: 'reduce' }); const p2 = await ctx2.newPage(); const e2 = [];
      p2.on('pageerror', e => e2.push(String(e).slice(0, 160)));
      await p2.addInitScript(INIT); await p2.goto(A.url); await p2.waitForFunction("typeof start==='function'&&S&&S.phase", null, { timeout: 60000 }); await p2.waitForTimeout(300);
      const after = await p2.evaluate(async ([c, sj]) => { const d = JSON.parse(decodeURIComponent(escape(atob(c)))); loadInto(d); await new Promise(r => setTimeout(r, 900)); closeModal(); Q.length = 0; return eval(sj); }, [before[0], snapJS]);
      const X = JSON.parse(before[1]), Y = JSON.parse(after);
      const diff = [...new Set([...Object.keys(X), ...Object.keys(Y)])].filter(k => JSON.stringify(X[k]) !== JSON.stringify(Y[k]));
      const y = await p2.evaluate(`(${SIM})([null,3,${seed + 1}])`);
      const probs = [...e2, ...y.errs, ...y.bad];
      if (diff.length) fail(`${s.name}: 불러온 상태가 저장 전과 다르다 — ${diff.slice(0, 8).join(', ')}`);
      else if (probs.length) fail(`${s.name}: 불러온 뒤 이어 하기 오류 — ${probs.join(' | ')}`);
      else ok(`${s.name}: 저장 → 불러오기 상태 같음 · 이어서 3개월 오류 없음`);
      await ctx2.close();
    }
    await a.ctx.close(); await b.ctx.close();
  }
} finally { await browser.close(); A.close(); B.close(); }

if (UPDATE) { fs.writeFileSync(GOLD_F, JSON.stringify(newGold, null, 1) + '\n'); console.log(`\n기준값을 저장했다: tests/golden.json (${Object.keys(newGold).length}개)`); }
console.log(fails ? `\n실패 ${fails}건` : '\n모두 통과');
process.exit(fails ? 1 : 0);
