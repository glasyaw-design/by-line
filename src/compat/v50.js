/* 바이라인 1.6 — src/compat/v50.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 총무국 바로잡기: 실력 부풀림 · 손익 누락 · 비용 절감 덮어쓰기 =====
// ① 사내 교육·복리후생·포상·임금 인상 같은 총무국 일이 편집국 전원의 실력을 끝없이 올려, 몇 년 지나면 모두 92(상한)에 붙었다.
//    92를 넘긴 몫은 보이지 않게 쌓여, 나중에 깎여도(직급 축소·복지 축소) 화면엔 92 그대로였다 → 이미 잘하는 기자일수록 덜 오르게 한다
// ② 복리후생·세분형 직급의 매달 비용이 그 달 손익을 계산한 뒤에 따로 빠져, 재무 화면의 손익과 실제 회사 자금이 맞지 않았다 → 그 달 비용에 넣는다
// ③ 「자재 구매 계약」(2.5%)과 「원가 관리」(4~6%)가 같은 칸을 덮어써, 둘 다 하면 나중 것만 남았다(원가 관리 뒤 자재 계약을 하면 할인이 오히려 줄었다) → 둘을 더한다(최대 10%)
const GAD_CAP50=88;
const gadK50=s=>clamp((GAD_CAP50-(s||0))/35,0,1);
let gadPend50=[];
function gadSnap50(){return (S&&S.team||[]).map(t=>[t,t.skill]);}
function gadFix50(snap){(snap||[]).forEach(([t,b])=>{if(!t||typeof t.skill!=='number'||typeof b!=='number')return;const d=t.skill-b;if(d>0)t.skill=b+d*gadK50(b);else if(d<0&&t.skill<10)t.skill=10;});}
function gadFlush50(){const P=gadPend50;gadPend50=[];P.forEach(gadFix50);}
// 총무국 일을 시작할 때(gadUse) 실력을 적어 두고, 그 일이 끝난 직후 늘어난 몫을 줄인다
{const _gu50=gadUse;gadUse=function(){gadFlush50();const snap=gadSnap50();gadPend50.push(snap);const r=_gu50.apply(this,arguments);Promise.resolve().then(gadFlush50);return r;};}
// 매달 총무국 처리: 복리후생 실력 성장도 같은 규칙 · 이번 달 비용을 손익에 넣는다
{const _gm50=gadMonth;gadMonth=function(lines){gadFlush50();const c=S&&S.co;const cash0=c?c.cash:0;const snap=gadSnap50();const r=_gm50.apply(this,arguments);
  try{gadFix50(snap);if(c&&c.last&&typeof c.cash==='number'){const d=c.cash-cash0;if(d<0){c.last.cost=+((c.last.cost||0)-d).toFixed(4);c.last.profit=+((c.last.profit||0)+d).toFixed(4);c.last.gad=+(-d).toFixed(4);}}}catch(e){console.error(e);}return r;};}
{const _em50=endMonth;endMonth=function(){gadFlush50();try{costCut50();}catch(e){}return _em50.apply(this,arguments);};}
// 비용 절감: 출처별로 따로 기록하고 매달 합쳐 적용한다
function costCut50(){if(!S)return;const C=S.costCuts50=S.costCuts50||{};
  // 다른 곳(구조조정 등)이 직접 넣은 비용 절감도 한 출처로 받는다
  if(S.costCut&&!S.costCut.m50&&S.costCut.due>S.turn)C.other={due:S.costCut.due,r:S.costCut.r};
  Object.keys(C).forEach(k=>{if(!(C[k]&&C[k].due>S.turn))delete C[k];});
  const A=Object.values(C);if(!A.length){if(S.costCut&&S.costCut.m50)S.costCut=null;return;}
  S.costCut={due:Math.max(...A.map(x=>x.due)),r:+Math.min(.1,A.reduce((a,x)=>a+x.r,0)).toFixed(3),m50:1};}
['g_buy','g_fin'].forEach(id=>{const f=GAD_RUN[id];GAD_RUN[id]=function(){const keep=S.costCut&&S.costCut.due>S.turn?S.costCut:null;if(keep&&!keep.m50){S.costCuts50=S.costCuts50||{};S.costCuts50.other={due:keep.due,r:keep.r};}
  const r=f.apply(this,arguments);try{if(S.costCut&&!S.costCut.m50){S.costCuts50=S.costCuts50||{};S.costCuts50[id]={due:S.costCut.due,r:S.costCut.r};S.costCut=null;}costCut50();}catch(e){console.error(e);}return r;};});
// 총무국 설명
try{const e=GAD.find(g=>g[1]==='g_edu');if(e)e[3]='기자 실력↑ · 이미 잘하는 기자일수록 덜 오른다';const w=GAD.find(g=>g[1]==='g_welfare');if(w)w[3]='자녀 학자금·건강검진·식당. 사기↑·실력 조금씩↑, 매달 비용(재무 손익에 포함)';const f=GAD.find(g=>g[1]==='g_fin');if(f)f[3]='반년 동안 비용 4~6%↓ · 자재 계약과 겹치면 더해진다(최대 10%)';}catch(e){}
// 예전 저장: 92를 넘겨 보이지 않게 쌓인 실력은 92에 맞춘다(그래야 다시 깎일 때 화면에 보인다)
function skDvFix50(list){(list||[]).forEach(m=>{try{if(!m||m.yrs==null||m._dv==null)return;const base=skillYrs(m.yrs);if(base+m._dv>96){m._dv=92-base;m.skill=Math.min(92,m.skill);m._sk0=m.skill;m._fy=m.yrs;}}catch(e){}});}
{const _mg50=migrate;migrate=function(s){const r=_mg50.apply(this,arguments);try{if(r&&r.phase){skDvFix50(r.team);skDvFix50(r.mates);if(Array.isArray(r.corr))skDvFix50(r.corr);if(r.ros&&r.ros.per)Object.values(r.ros.per).forEach(a=>Array.isArray(a)&&skDvFix50(a));}}catch(e){}return r;};}
// ④ 결산 밖에서 오가는 돈(판매 전략 비용·임금 조정·발행인 활동·부가 사업 등)이 재무 화면 손익에 안 보여 「손익과 자금 변화가 안 맞는」 것처럼 보였다
//    → 게임 수치는 그대로 두고, 그 달 「그 밖의 수지」를 따로 계산해 재무 탭에 보여 준다 (손익 + 그 밖의 수지 = 이번 달 자금 변화)
{const _em50b=endMonth;endMonth=function(){const c=S&&S.co;const cash0=c&&typeof c.cash==='number'?c.cash:null;const l0=c&&c.last;const r=_em50b.apply(this,arguments);
  try{const c2=S&&S.co;if(c2&&c2===c&&cash0!=null&&c2.last&&c2.last!==l0){const d=c2.cash-cash0;c2.last.net=+d.toFixed(4);c2.last.etc=+(d-(c2.last.profit||0)).toFixed(4);}}catch(e){}return r;};}
function flow50HTML(){try{const l=S&&S.co&&S.co.last;if(!l||l.net==null)return '';const etc=l.etc||0;
  return `<div class="card"><div class="t">${ic('coin')} 지난달 자금 흐름</div><div class="meta"><span>손익 <b>${eok(l.profit||0)}</b></span>${Math.abs(etc)>=.005?`<span>그 밖의 수지 <b>${etc>0?'+':''}${eok(etc)}</b></span>`:''}<span>자금 변화 <b>${(l.net>0?'+':'')+eok(l.net)}</b></span>${l.gad?`<span class="hint">총무국 복리후생·직급 체계 비용 ${eok(l.gad)}은 손익(비용)에 들어 있다</span>`:''}</div>${Math.abs(etc)>=.005?'<p class="hint" style="margin:4px 0 0">그 밖의 수지: 판매 전략·임금 조정·발행인 활동·계열·부가 사업처럼 월 결산 밖에서 오간 돈. 행동으로 바로 쓴 돈(연수·행사·장비 등)은 쓴 순간 빠져 여기엔 없다.</p>':''}</div>`;}catch(e){return '';}}
{const _tb50=tabBody;tabBody=function(){let h=_tb50.apply(this,arguments);try{if(S&&S.tab==='fin'&&!S.story)h=flow50HTML()+h;}catch(e){}return h;};}