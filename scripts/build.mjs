// 빌드 (외부 패키지 없음)
//  dist/         서버(Vercel 등)에 올리는 판 — 게임 코드 94개를 파일 하나(src/app.<해시>.js)로, CSS 2개를 하나(styles/app.<해시>.css)로 묶는다.
//                이름에 내용 해시가 들어가므로 오래 캐시해도 된다 (vercel.json). 그림·글꼴·음악은 assets/ 그대로.
//                public/(개인정보처리방침·아이콘·manifest·robots·크레딧)도 함께 복사한다.
//                SITE_URL(또는 Vercel이 주는 VERCEL_PROJECT_PRODUCTION_URL)이 있으면 공유 이미지 주소를 절대 주소로 바꾼다.
//  dist-single/  index.html 하나로 다시 합친 판 (CSS·JS·그림·글꼴 내장, 음악만 assets/audio 폴더) — 예전 단일 파일과 같은 방식
// 사용: node scripts/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import crypto from 'node:crypto';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = p => path.join(ROOT, p);
const copyDir = (from, to) => { fs.mkdirSync(to, { recursive: true }); for (const e of fs.readdirSync(from, { withFileTypes: true })) { const a = path.join(from, e.name), b = path.join(to, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } };

const index = fs.readFileSync(r('index.html'), 'utf8');
const scripts = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const styles = [...index.matchAll(/<link rel="stylesheet" href="(styles\/[^"]+)">/g)].map(m => m[1]);
// 1) 참조 확인: index.html이 가리키는 파일이 모두 있어야 한다
const missing = [...scripts, ...styles].filter(f => !fs.existsSync(r(f)));
if (missing.length) { console.error('없는 파일:', missing); process.exit(1); }

const hash8 = t => crypto.createHash('sha256').update(t).digest('hex').slice(0, 10);
const stripHdr = t => t.replace(/^\/\* 바이라인(?: [\d.]+)? — (?:[^*]|\*(?!\/))*\*\/\r?\n/, '');
const block = /<!-- 게임 코드:[^\n]*\n(<script src="[^"]+"><\/script>\r?\n)+/;
if (!block.test(index)) { console.error('script 목록을 찾지 못했다'); process.exit(1); }
const site = (process.env.SITE_URL || (process.env.VERCEL_PROJECT_PRODUCTION_URL ? 'https://' + process.env.VERCEL_PROJECT_PRODUCTION_URL : '')).replace(/\/+$/, '');
const withSite = h => site ? h.replace('<meta property="og:image" content="/og.png">', `<meta property="og:image" content="${site}/og.png">\n<meta property="og:url" content="${site}/">`) : h;
const copyPublic = to => { if (fs.existsSync(r('public'))) copyDir(r('public'), to); if (fs.existsSync(r('og.png'))) fs.copyFileSync(r('og.png'), path.join(to, 'og.png')); };

// 2) dist (서버용: 코드·CSS를 하나씩으로 묶는다)
fs.rmSync(r('dist'), { recursive: true, force: true });
fs.mkdirSync(r('dist/src'), { recursive: true }); fs.mkdirSync(r('dist/styles'));
const appJs = scripts.map(f => { const t = stripHdr(fs.readFileSync(r(f), 'utf8')); return `/* ${f} */\n` + t + (t.endsWith('\n') ? '' : '\n'); }).join('');
const appCss = styles.map(f => `/* ${f} */\n` + stripHdr(fs.readFileSync(r(f), 'utf8'))).join('\n');
const jsName = `src/app.${hash8(appJs)}.js`, cssName = `styles/app.${hash8(appCss)}.css`;
fs.writeFileSync(r('dist/' + jsName), appJs); fs.writeFileSync(r('dist/' + cssName), appCss);
let distIdx = index;
for (const s of styles) distIdx = distIdx.replace(`<link rel="stylesheet" href="${s}">`, '');
distIdx = distIdx.replace('</head>', `<link rel="stylesheet" href="${cssName}">\n</head>`);
distIdx = distIdx.replace(block, () => `<script src="${jsName}"></script>\n`);
fs.writeFileSync(r('dist/index.html'), withSite(distIdx));
copyDir(r('assets'), r('dist/assets'));
copyPublic(r('dist'));

// 3) dist-single (하나로 합치기)
const MIME = { webp: 'image/webp', woff: 'font/woff', png: 'image/png' };
const dataURI = rel => { const ext = rel.split('.').pop(); return `data:${MIME[ext]};base64,` + fs.readFileSync(r(rel)).toString('base64'); };
const inlineCSS = t => stripHdr(t).replace(/url\(\.\.\/(assets\/(?:images|fonts)\/[^)]+)\)/g, (m, rel) => `url(${dataURI(rel)})`);
const inlineJS = t => stripHdr(t)
  .replace(/"(assets\/images\/[^"]+\.webp)"/g, (m, rel) => `"${dataURI(rel)}"`)
  .replace(/url\((assets\/fonts\/[^)]+\.woff)\)/g, (m, rel) => `url(${dataURI(rel)})`);
let single = index;
for (const s of styles) single = single.replace(`<link rel="stylesheet" href="${s}">`, () => '<style>' + inlineCSS(fs.readFileSync(r(s), 'utf8')) + '</style>');
const js = scripts.map(f => inlineJS(fs.readFileSync(r(f), 'utf8'))).join('');
single = single.replace(block, () => '<script>' + js + '</script>');
const left = (single.match(/["(](\.\.\/)?assets\/(images|fonts)\//g) || []).length;
if (left) { console.error('합치지 못한 그림·글꼴 경로', left); process.exit(1); }
fs.rmSync(r('dist-single'), { recursive: true, force: true });
fs.mkdirSync(r('dist-single'));
fs.writeFileSync(r('dist-single/index.html'), withSite(single));
copyDir(r('assets/audio'), r('dist-single/assets/audio'));
copyPublic(r('dist-single'));

const size = p => { let n = 0; const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else n += fs.statSync(f).size; } }; walk(p); return (n / 1048576).toFixed(1) + 'MB'; };
const todo = fs.existsSync(r('public/privacy.html')) && /【입력/.test(fs.readFileSync(r('public/privacy.html'), 'utf8'));
if (todo) console.log('⚠ public/privacy.html에 「【입력: …】」 칸이 남아 있다 — 운영자·연락처·Upstash 지역을 채우자');
if (!site) console.log('· SITE_URL이 없어 공유 이미지(og:image)는 상대 주소로 둔다 (Vercel에서는 저절로 채워진다)');
console.log(`빌드 완료\n  dist/         script ${scripts.length}개 → ${jsName} (${(appJs.length / 1048576).toFixed(1)}MB) · CSS ${styles.length}개 → ${cssName} · ${size(r('dist'))}\n  dist-single/  index.html ${(single.length / 1048576).toFixed(1)}MB(글자 수 기준) + 음악 · ${size(r('dist-single'))}`);
