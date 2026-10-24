/* 바이라인 1.6 — src/core/utils.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */

// ================= 유틸 =================
const $=s=>document.querySelector(s);
try{const lt=document.getElementById('ldtip');if(lt)lt.textContent='팁: 핵심 사실은 두 출처로 확인해야 기사가 된다.';const lp=document.getElementById('ldp');if(lp)lp.style.width='35%';}catch(e){}
const R=(a,b)=>Math.floor(Math.random()*(b-a+1))+a;
const pick=a=>a[Math.floor(Math.random()*a.length)];
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const chance=p=>Math.random()<p;
const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
let _id=0;const uid=()=>Date.now().toString(36)+(_id++);
const shuffle=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[a[i],a[j]]=[a[j],a[i]];}return a;};
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const f1=n=>{const v=Math.round(n*10)/10;return (v===0?0:v).toLocaleString('ko-KR');};
// 억 단위 금액: 1억 미만은 만 원으로 (0억·-0억 방지)
const eok=v=>{const a=Math.abs(v);if(a>=.95)return f1(v)+'억';const m=Math.round(a*1000)*10;return m?`${v<0?'-':''}${m.toLocaleString('ko-KR')}만 원`:'0원';};
const pct=p=>Math.round(p*100)+'%';

// ================= 난이도 =================
const DIFF={
 easy:{n:'쉬움',d:'승진이 빠르고 월급이 넉넉하다. 사실 확인이 잘 되고 오보 위험이 낮다. 이름값이 잘 오르고, 경쟁사·라이벌·소송 상대가 느긋하며 어두운 길도 덜 들킨다.',ten:.7,ver:1.25,risk:.5,heat:1.35,drift:.6,need:-6,pay:1.15,harsh:.7,start:500,pen:.75,crisis:.65,legal:.6},
 normal:{n:'보통',d:'현실에 가까운 속도. 취재는 쉽지 않고 승진은 느리다. 실수 한 번은 버틸 수 있다.',ten:1,ver:1,risk:1,heat:1,drift:1,need:0,pay:1,harsh:1,start:300,pen:1,crisis:1,legal:1},
 hard:{n:'어려움',d:'승진이 한참 느리고 월급이 박하다. 경쟁사·라이벌은 빠르고 소송 상대는 독하다. 이름값은 잘 안 오르고 매체 목표는 높다. 어두운 길은 금방 들키고, 오보 하나가 커리어를 흔든다. 지난 판의 유산도 쓸 수 없다.',ten:1.3,ver:.75,risk:1.6,heat:.75,drift:1.5,need:4,pay:.85,harsh:1.35,start:260,pen:1.2,crisis:1.45,legal:1.3}
};
const DFX={easy:{fame:1.12,route:.75,case:.75,court:.85,kpi:.85,rival:.7,ft:-2},normal:{},hard:{fame:.78,route:1.3,case:1.3,court:1.2,kpi:1.15,rival:1.4,ft:2}};
function dk(k){const d=DFX[(S&&S.diff)||'normal']||{};return d[k]??(k==='ft'?0:1);}
const SIMPLE_CACHE={};
const DF=()=>{const k=(S&&S.diff)||'normal';const d=DIFF[k];if(!(S&&S.simple))return d;return SIMPLE_CACHE[k]||(SIMPLE_CACHE[k]={...d,n:d.n+' · 간소화',ten:d.ten*.55,ver:d.ver*1.18,risk:d.risk*.6,heat:d.heat*1.25,need:d.need-8,harsh:d.harsh*.7,drift:d.drift*.6});};
const SIMPLE_HIDE=['hari','drink','special','network','colleague','deptreq','job','plan','direction','paypol','newdept','digital','event','recruit','personnel','taskforce','found','column','tour','fpartner','fethics','fcrisis','fbureau','gad'];
/* [옮겨 옴] src/systems/desking.js 의 function jo2 — 원본에선 스크립트 뒤쪽에 선언됐지만 앞선 코드가 끌어올림으로 이 함수를 먼저 감쌌다/썼다 */
function jo2(w,a,b){const c=String(w||'').trim().slice(-1);const k=c.charCodeAt(0);if(k>=44032&&k<=55203)return w+((k-44032)%28?a:b);if(/[0-9]/.test(c))return w+('2459'.includes(c)?b:a);return w+b;}
