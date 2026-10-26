// 1.5~1.6 확장 모듈(v43~)을 릴리스·주제별 파일로 합친다. 읽는 순서는 그대로 (앞 파일 내용 + 뒤 파일 내용)
// 사용: node merge.mjs <프로젝트 폴더>
import fs from 'fs'; import path from 'path';
const D = process.argv[2];
export const GROUPS = [
  ['src/compat/r15-goals-favor.js', '1.5 · 판 시작 목표 점검 · 봉투 개편 · 신세 장부 · 줄타기 · 시의성', ['v43', 'v44']],
  ['src/compat/r16-org.js', '1.6 · 조직 운영 · 지역 TO · 창간 모드 인사', ['v45', 'v46', 'v47', 'v48']],
  ['src/compat/r16-fixes.js', '1.6 · 저장·불러오기 · 총무국 바로잡기', ['v49', 'v50']],
  ['src/compat/r16-ai-ui.js', '1.6 · AI 개선 · 새 시스템 안내 · 관계 한눈에 · NaN 방지 · 사람 화면 간소화 · 밸런스 · 할 일 카드 아이콘', ['v51', 'v52', 'v53', 'v54', 'v55', 'v56']],
  ['src/compat/r17-fixes.js', '1.7 · 삭제 요청 상대 · 내 지갑 · 봉투 팝업 · 개인 투자 · 기자 충성 · 크라우드펀딩 한도 · 경쟁사 지분 인수 · AI 선택 점수 · 회사 금고 · 광고 목표 일할', ['v57', 'v58', 'v59', 'v60', 'v61', 'v62']],
  ['src/compat/r17-specialist.js', '1.7 · 전문기자·선임·대기자 트랙 · 대형 추적 · 다음 자리(전문 에디터·명망가 편집국장·주필·사장) · 승진 레이스 · 조직 정원', ['v63', 'v64']],
  ['src/compat/r17-content.js', '1.7 · 반복 사건의 기억 · 부서별 사건 · 오보 복기 · 지분 인수 2단계 · 후계자 · 연말 기자상 · 취재원 인생 · 대표 통장 · 맡기기 「관계」', ['v65', 'v66']],
  ['src/compat/r17-articles.js', '1.7 · 기사·칼럼 소재 은행 · 해설·기획 시리즈·팩트체크 · 칼럼 개편 · 업적·칭호 · 주필 · 전문기자 휘장', ['v67d', 'v67', 'v68img', 'v68']],
  ['src/compat/r17-account.js', '1.71 · 계정 · 클라우드 저장 · 기록실 동기화', ['v69']],
];
let idx = fs.readFileSync(path.join(D, 'index.html'), 'utf8');
for (const [out, title, mods] of GROUPS) {
  const tags = mods.map(m => `<script src="src/compat/${m}.js"></script>`);
  const at = tags.map(t => idx.indexOf(t));
  if (at.some(k => k < 0)) throw new Error('index.html에 없음: ' + out);
  for (let i = 1; i < at.length; i++) if (idx.slice(at[i - 1] + tags[i - 1].length, at[i]).trim()) throw new Error('붙어 있지 않음: ' + mods[i]);
  const body = mods.map(m => { const f = path.join(D, 'src/compat', m + '.js'); const s = fs.readFileSync(f, 'utf8'); fs.unlinkSync(f); return `// ───── (예전 ${m}.js) ─────\n` + s.replace(/\n*$/, '\n'); }).join('\n');
  fs.writeFileSync(path.join(D, out), `// ${title}\n// 예전 파일 ${mods.map(m => m + '.js').join(' · ')}를 순서 그대로 이어 붙였다\n\n` + body);
  const a = at[0], b = at[at.length - 1] + tags[tags.length - 1].length;
  idx = idx.slice(0, a) + `<script src="${out}"></script>` + idx.slice(b);
}
fs.writeFileSync(path.join(D, 'index.html'), idx);
// tools/build-meta.json(원본 대응표)도 합친 파일 기준으로
const MF = path.join(D, 'tools/build-meta.json');
if (fs.existsSync(MF)) { const meta = JSON.parse(fs.readFileSync(MF, 'utf8'));
  for (const [out, , mods] of GROUPS) { const names = mods.map(m => `src/compat/${m}.js`);
    const rs = meta.rows.filter(r => names.includes(r.file)); if (!rs.length) continue;
    const row = { file: out, stmts: [Math.min(...rs.map(r => r.stmts[0])), Math.max(...rs.map(r => r.stmts[1]))], lines: [Math.min(...rs.map(r => r.lines[0])), Math.max(...rs.map(r => r.lines[1]))], from: mods.map(m => m + '.js') };
    const k = meta.rows.findIndex(r => names.includes(r.file)); meta.rows = meta.rows.filter(r => !names.includes(r.file)); meta.rows.splice(k, 0, row);
    const j = meta.files.findIndex(f => names.includes(f)); meta.files = meta.files.filter(f => !names.includes(f)); meta.files.splice(j, 0, out); }
  fs.writeFileSync(MF, JSON.stringify(meta, null, 1)); }
console.log('합침:', GROUPS.map(g => `${g[0].split('/').pop()}(${g[2].length})`).join(' · '));
