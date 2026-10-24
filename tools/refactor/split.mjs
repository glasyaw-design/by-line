// 바이라인 1.6 단일 HTML → 여러 파일 프로젝트로 분리 (실행 순서 보존)
// 사용: node split.mjs <원본.html> <출력 폴더>
import * as acorn from '/opt/npm-tools/node_modules/acorn/dist/acorn.mjs';
import fs from 'fs'; import path from 'path'; import crypto from 'crypto';

const [,, ORIG, OUT] = process.argv;
const html = fs.readFileSync(ORIG, 'utf8');
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
const W = (p, data) => { const f = path.join(OUT, p); fs.mkdirSync(path.dirname(f), { recursive: true }); fs.writeFileSync(f, data); };

// ---------- 1) HTML 조각 ----------
const s1a = html.indexOf('<style>'), s1b = html.indexOf('</style>', s1a);
const s2a = html.indexOf('<style>', s1b), s2b = html.indexOf('</style>', s2a);
const sca = html.indexOf('<script>'), scb = html.lastIndexOf('</script>');
const headPre = html.slice(0, s1a);                 // <title> · meta · 폰트 link
const css1 = html.slice(s1a + 7, s1b);
const between = html.slice(s1b + 8, s2a);           // style1과 style2 사이 (보통 빈 줄)
const css2 = html.slice(s2a + 7, s2b);
const markup = html.slice(s2b + 8, sca);            // 로더 · 토스트
const js = html.slice(sca + 8, scb);
const after = html.slice(scb + 9);
if (html !== headPre + '<style>' + css1 + '</style>' + between + '<style>' + css2 + '</style>' + markup + '<script>' + js + '</script>' + after) throw new Error('HTML 조각 재조립 불일치');

// ---------- 2) 리소스 추출 ----------
const manifest = [];   // {file, kind, key, from:'js'|'css1'|'css2', sha256, bytes}
const usedNames = new Set();
function saveB64(b64, dir, base, ext, meta) {
  const buf = Buffer.from(b64, 'base64');
  if (buf.toString('base64') !== b64) throw new Error('base64 비정규: ' + base);
  let name = `${base}.${ext}`, k = 2;
  while (usedNames.has(dir + '/' + name)) {
    // 같은 키가 다른 내용으로 다시 나오면 덮어쓰기 대비로 접미사
    name = `${base}__${k++}.${ext}`;
  }
  usedNames.add(dir + '/' + name);
  const rel = `assets/${dir}/${name}`;
  W(rel, buf);
  manifest.push({ file: rel, ...meta, bytes: buf.length, sha256: sha(buf), b64sha256: sha(b64) });
  return rel;
}
// 2-a/b) JS 리소스 치환은 파일을 나눈 뒤 파일마다 한다 (문장 경계·모듈 찾기는 원본 텍스트 기준)
let imgN = 0, fontN = 0, rankN = 0;
function resJS(t) {
  t = t.replace(/"([A-Za-z0-9_]+)": "data:image\/webp;base64,([A-Za-z0-9+/=]+)"/g, (m, key, b64) => {
    imgN++; const rel = saveB64(b64, 'images', key, 'webp', { kind: 'image/webp', key, from: 'js IMG' });
    return `"${key}": "${rel}"`;
  });
  // RANK_IMG=["data:...", ...] 직급 그림 배열
  t = t.replace(/const RANK_IMG=\[[^\]]*\]/g, arr => arr.replace(/"data:image\/webp;base64,([A-Za-z0-9+/=]+)"/g, (m, b64) => {
    const rel = saveB64(b64, 'images', `rank_${rankN}`, 'webp', { kind: 'image/webp', key: `RANK_IMG[${rankN}]`, from: 'js RANK_IMG' }); rankN++; return `"${rel}"`;
  }));
  t = t.replace(/font-weight:(\d+);font-display:swap;src:url\(data:font\/woff;base64,([A-Za-z0-9+/=]+)\)/g, (m, w, b64) => {
    fontN++; const rel = saveB64(b64, 'fonts', `maplestory-${w}`, 'woff', { kind: 'font/woff', key: 'Maplestory ' + w, from: 'js @font-face' });
    return `font-weight:${w};font-display:swap;src:url(${rel})`;
  });
  // 음악 파일 경로: bgm/ → assets/audio/ (코드 한 곳)
  t = t.replace(/a\.src='bgm\/bgm_'\+k\+'\.mp3'/g, () => { audioRef++; return "a.src='assets/audio/bgm_'+k+'.mp3'"; });
  return t;
}
let audioRef = 0;
// 2-c) 로더 CSS 안의 이미지 (CSS 파일 기준 상대 경로 → ../assets)
let cssImgN = 0; const cssNames = ['loader-bg', 'loader-logo'];
const css1b = css1.replace(/url\(data:image\/webp;base64,([A-Za-z0-9+/=]+)\)/g, (m, b64) => { const rel = saveB64(b64, 'images', 'loader-title-bg', 'webp', { kind: 'image/webp', key: 'loader-title-bg', from: 'css-main' }); return `url(../${rel})`; });
const css2b = css2.replace(/url\(data:image\/webp;base64,([A-Za-z0-9+/=]+)\)/g, (m, b64) => {
  const nm = cssNames[cssImgN] || `css-${cssImgN}`; cssImgN++;
  const rel = saveB64(b64, 'images', nm, 'webp', { kind: 'image/webp', key: nm, from: 'css-loader' });
  return `url(../${rel})`;
});
const leftData0 = (js.match(/data:[a-z]+\/[a-z0-9.+-]+;base64,/g) || []).length + (css1.match(/data:[a-z]+\/[a-z0-9.+-]+;base64,/g) || []).length + (css2b.match(/data:[a-z]+\/[a-z0-9.+-]+;base64,/g) || []).length;


// ---------- 3) JS 분리 ----------
// 같은 리소스 치환은 문장 경계를 바꾸지 않는다(문자열 리터럴 안). 치환 뒤 텍스트를 다시 파싱한다.
const js2 = js;
const ast = acorn.parse(js2, { ecmaVersion: 'latest', sourceType: 'script' });
const B = ast.body;
const stmtAt = off => { let lo = 0, hi = B.length - 1; while (lo < hi) { const m = (lo + hi + 1) >> 1; if (B[m].start <= off) lo = m; else hi = m - 1; } return lo; };
const firstStmtFrom = off => { for (let i = 0; i < B.length; i++) if (B[i].start >= off) return i; return B.length; };
// 모듈(1.x 확장) 경계: 원본 모듈 소스의 첫 코드 줄로 찾는다
const MODS = JSON.parse(fs.readFileSync(new URL('./mods.json', import.meta.url), 'utf8'));
let cur = 0;
const modStart = [];
for (const [name, firstLine, firstLines] of MODS) {
  // 모듈 파일의 첫 줄(대개 머리 주석)을 먼저 찾는다. 못 찾으면 코드 줄로
  let best = firstLine.length && firstLine[0].length >= 8 ? js2.indexOf(firstLine[0], cur) : -1;
  if (best < 0) for (const l of firstLines) { const k = js2.indexOf(l, cur); if (k >= 0 && (best < 0 || k < best)) best = k; }
  if (best < 0) throw new Error('모듈 위치 못 찾음 ' + name);
  const ls = js2.lastIndexOf('\n', best) + 1; modStart.push([name, firstStmtFrom(ls)]); cur = ls + 1;
}
const tailI = firstStmtFrom(js2.indexOf('RUN.cfile=()=>caseAct();'));
const SEC = JSON.parse(fs.readFileSync(new URL('./sections.json', import.meta.url), 'utf8')); // [[첫 문장 찾기용 텍스트, 파일]]
const parts = []; // [stmtIndex, file]
for (const [needle, file] of SEC.head) { const k = needle === '@0' ? 0 : js2.indexOf(needle); if (k < 0) throw new Error('구획 못 찾음 ' + needle); parts.push([needle === '@0' ? 0 : firstStmtFrom(k), file]); }
modStart.forEach(([name, i]) => parts.push([i, `src/compat/${name}`]));
for (const [needle, file] of SEC.tail) { const k = js2.indexOf(needle); if (k < 0) throw new Error('꼬리 구획 못 찾음 ' + needle); parts.push([firstStmtFrom(k), file]); }
parts.sort((a, b) => a[0] - b[0]);
for (let i = 1; i < parts.length; i++) if (parts[i][0] <= parts[i - 1][0]) throw new Error('구획 순서/중복: ' + parts[i - 1][1] + ' / ' + parts[i][1]);
if (parts[0][0] !== 0) throw new Error('첫 구획이 0이 아님');
// 문장 i의 텍스트 구간: 앞 문장 끝 ~ 이 문장 끝 (앞에 붙은 주석·빈 줄은 뒤 문장과 함께 간다)
const cutOff = i => (i === 0 ? 0 : B[i - 1].end);
const fileOf = new Array(B.length);
parts.forEach(([s, f], k) => { const e = k + 1 < parts.length ? parts[k + 1][0] : B.length; for (let i = s; i < e; i++) fileOf[i] = f; });

// 함수 선언 끌어올림 보존: 모듈이 먼저 감싸거나 먼저 쓰는 선언은 앞 파일로 옮긴다
const MOVE = JSON.parse(fs.readFileSync(new URL('./moves.json', import.meta.url), 'utf8')); // {이름: 대상 파일}
const moved = {}; // stmtIndex -> {name, to}
for (const [name, to] of Object.entries(MOVE)) {
  const idx = B.map((n, i) => [n, i]).filter(([n]) => n.type === 'FunctionDeclaration' && n.id.name === name);
  if (idx.length !== 1) throw new Error('옮길 선언이 하나가 아님: ' + name + ' ' + idx.length);
  moved[idx[0][1]] = { name, to };
}
const files = new Map(); parts.forEach(([, f]) => files.set(f, []));
const extra = new Map(); // 옮겨 온 선언
const mapRows = [];
for (let i = 0; i < B.length; i++) {
  const f = fileOf[i]; const text = js2.slice(cutOff(i), B[i].end);
  if (moved[i]) {
    const { name, to } = moved[i];
    const lead = js2.slice(cutOff(i), B[i].start), body = js2.slice(B[i].start, B[i].end);
    files.get(f).push(lead + `/* [옮김] function ${name} → ${to} (원래 이 자리. 함수 선언은 끌어올려지므로 앞 파일에 둬야 원본과 같다) */`);
    if (!extra.has(to)) extra.set(to, []);
    extra.get(to).push(`\n/* [옮겨 옴] ${f} 의 function ${name} — 원본에선 스크립트 뒤쪽에 선언됐지만 앞선 코드가 끌어올림으로 이 함수를 먼저 감쌌다/썼다 */\n` + body);
    continue;
  }
  files.get(f).push(text);
}
const tailText = js2.slice(B[B.length - 1].end);
files.get(fileOf[B.length - 1]).push(tailText);
// 옮겨 온 선언을 붙인다: 대상 파일이 구획 목록에 없으면 바로 앞 파일 다음에 새 파일로 끼운다
const order = parts.map(p => p[1]);
for (const [to] of extra) if (!files.has(to)) {
  const before = JSON.parse(fs.readFileSync(new URL('./moves-insert.json', import.meta.url), 'utf8'))[to];
  const k = order.indexOf(before); if (k < 0) throw new Error('끼울 위치 없음 ' + to);
  order.splice(k, 0, to); files.set(to, []);
}
for (const [to, arr] of extra) files.get(to).push(...arr, '\n');
// 파일 쓰기
const HDR = f => `/* 바이라인 1.6 — ${f}\n * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).\n */\n`;
const outFiles = [];
let leftData = 0;
for (const f of order) { const body = resJS(files.get(f).join('')); leftData += (body.match(/data:[a-z]+\/[a-z0-9.+-]+;base64,/g) || []).length; W(f, HDR(f) + body); outFiles.push(f); }
leftData += (css1b.match(/data:[a-z]+\/[a-z0-9.+-]+;base64,/g) || []).length + (css2b.match(/data:[a-z]+\/[a-z0-9.+-]+;base64,/g) || []).length;
console.log('추출: IMG', imgN, 'RANK_IMG', rankN, '글꼴', fontN, '로더 CSS 이미지', cssImgN, '· 남은 data URI', leftData);

// 대응표
let cursor = 0;
const rows = [];
for (const [s, f] of parts) {
  const e = parts.indexOf(parts.find(p => p[0] === s)); const nx = parts[e + 1]; const end = nx ? nx[0] - 1 : B.length - 1;
  const lineOf = off => js2.slice(0, off).split('\n').length; // 원본 script 블록 안 줄 번호(리소스 치환 뒤 = 원본과 같은 줄 수)
  rows.push({ file: f, stmts: [s, end], lines: [lineOf(cutOff(s) + 1), lineOf(B[end].end)] });
}

// ---------- 4) CSS ----------
W('styles/main.css', `/* 바이라인 1.6 — 원본 첫 번째 <style> (머리) 그대로. 내장 이미지 1개만 ../assets 경로로 */\n` + css1b);
W('styles/loader.css', `/* 바이라인 1.6 — 원본 두 번째 <style> (본문, 로더 바로 앞) 그대로. 이미지 경로만 ../assets 로 */\n` + css2b);

// ---------- 5) index.html ----------
const desc = '수습기자로 시작해 단독을 쫓고, 데스크·편집국장·사장까지 오르거나 내 언론사를 세우는 기자 커리어 시뮬레이션 웹게임';
const meta = `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="theme-color" content="#13151e">
<meta name="description" content="${desc}">
<meta property="og:type" content="website">
<meta property="og:title" content="바이라인 — 기자 커리어 시뮬레이션">
<meta property="og:description" content="${desc}">
<meta property="og:image" content="/og.png">
<meta name="twitter:card" content="summary_large_image">
`;
const head2 = headPre.replace('<meta name="claude:viewport-fit-sides" content="cover">\n', '');
const scripts = outFiles.map(f => `<script src="${f}"></script>`).join('\n');
const idx = meta + head2 + `<link rel="stylesheet" href="styles/main.css">` + '\n</head>\n<body>' + between + `<link rel="stylesheet" href="styles/loader.css">` + markup +
  `<!-- 게임 코드: 아래 순서대로 실행된다 (원본 <script> 한 덩어리를 같은 순서로 나눈 것) -->\n${scripts}\n` + after + '\n</body>\n</html>\n';
W('index.html', idx);
W('tools/build-meta.json', JSON.stringify({ origSha256: sha(html), files: outFiles, rows, moved: Object.values(moved), manifestCount: manifest.length }, null, 1));
W('tools/assets-manifest.json', JSON.stringify(manifest, null, 1));
console.log('JS 파일', outFiles.length, '문장', B.length, '음악 경로 치환', audioRef);
// 음악·OG 이미지·배포 파일 복사 (원본 바이너리 그대로)
const BGM = process.env.BGM_DIR;
if (BGM) for (const f of fs.readdirSync(BGM).filter(x => x.endsWith('.mp3')).sort()) { const buf = fs.readFileSync(path.join(BGM, f)); W('assets/audio/' + f, buf); manifest.push({ file: 'assets/audio/' + f, kind: 'audio/mpeg', key: f, from: 'bgm/ 폴더(외부 파일)', bytes: buf.length, sha256: sha(buf) }); }
W('tools/assets-manifest.json', JSON.stringify(manifest, null, 1));
