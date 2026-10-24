// 빌드 (외부 패키지 없음)
//  dist/         여러 파일 그대로 (index.html · styles · src · assets · og.png) — 서버(Vercel 등)에 올리는 용도
//  dist-single/  index.html 하나로 다시 합친 판 (CSS·JS·그림·글꼴 내장, 음악만 assets/audio 폴더) — 예전 단일 파일과 같은 방식
// 사용: node scripts/build.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const r = p => path.join(ROOT, p);
const copyDir = (from, to) => { fs.mkdirSync(to, { recursive: true }); for (const e of fs.readdirSync(from, { withFileTypes: true })) { const a = path.join(from, e.name), b = path.join(to, e.name); if (e.isDirectory()) copyDir(a, b); else fs.copyFileSync(a, b); } };

const index = fs.readFileSync(r('index.html'), 'utf8');
const scripts = [...index.matchAll(/<script src="([^"]+)"><\/script>/g)].map(m => m[1]);
const styles = [...index.matchAll(/<link rel="stylesheet" href="(styles\/[^"]+)">/g)].map(m => m[1]);
// 1) 참조 확인: index.html이 가리키는 파일이 모두 있어야 한다
const missing = [...scripts, ...styles].filter(f => !fs.existsSync(r(f)));
if (missing.length) { console.error('없는 파일:', missing); process.exit(1); }

// 2) dist (여러 파일)
fs.rmSync(r('dist'), { recursive: true, force: true });
fs.mkdirSync(r('dist'));
fs.copyFileSync(r('index.html'), r('dist/index.html'));
for (const d of ['styles', 'src', 'assets']) copyDir(r(d), r('dist/' + d));
if (fs.existsSync(r('og.png'))) fs.copyFileSync(r('og.png'), r('dist/og.png'));

// 3) dist-single (하나로 합치기)
const MIME = { webp: 'image/webp', woff: 'font/woff', png: 'image/png' };
const dataURI = rel => { const ext = rel.split('.').pop(); return `data:${MIME[ext]};base64,` + fs.readFileSync(r(rel)).toString('base64'); };
const stripHdr = t => t.replace(/^\/\* 바이라인 1\.6 — (?:[^*]|\*(?!\/))*\*\/\r?\n/, '');
const inlineCSS = t => stripHdr(t).replace(/url\(\.\.\/(assets\/(?:images|fonts)\/[^)]+)\)/g, (m, rel) => `url(${dataURI(rel)})`);
const inlineJS = t => stripHdr(t)
  .replace(/"(assets\/images\/[^"]+\.webp)"/g, (m, rel) => `"${dataURI(rel)}"`)
  .replace(/url\((assets\/fonts\/[^)]+\.woff)\)/g, (m, rel) => `url(${dataURI(rel)})`);
let single = index;
for (const s of styles) single = single.replace(`<link rel="stylesheet" href="${s}">`, () => '<style>' + inlineCSS(fs.readFileSync(r(s), 'utf8')) + '</style>');
const js = scripts.map(f => inlineJS(fs.readFileSync(r(f), 'utf8'))).join('');
const block = /<!-- 게임 코드:[^\n]*\n(<script src="[^"]+"><\/script>\r?\n)+/;
if (!block.test(single)) { console.error('script 목록을 찾지 못했다'); process.exit(1); }
single = single.replace(block, () => '<script>' + js + '</script>');
const left = (single.match(/["(](\.\.\/)?assets\/(images|fonts)\//g) || []).length;
if (left) { console.error('합치지 못한 그림·글꼴 경로', left); process.exit(1); }
fs.rmSync(r('dist-single'), { recursive: true, force: true });
fs.mkdirSync(r('dist-single'));
fs.writeFileSync(r('dist-single/index.html'), single);
copyDir(r('assets/audio'), r('dist-single/assets/audio'));
if (fs.existsSync(r('og.png'))) fs.copyFileSync(r('og.png'), r('dist-single/og.png'));

const size = p => { let n = 0; const walk = d => { for (const e of fs.readdirSync(d, { withFileTypes: true })) { const f = path.join(d, e.name); if (e.isDirectory()) walk(f); else n += fs.statSync(f).size; } }; walk(p); return (n / 1048576).toFixed(1) + 'MB'; };
console.log(`빌드 완료\n  dist/         ${scripts.length}개 script · ${styles.length}개 CSS · ${size(r('dist'))}\n  dist-single/  index.html ${(single.length / 1048576).toFixed(1)}MB(글자 수 기준) + 음악 · ${size(r('dist-single'))}`);
