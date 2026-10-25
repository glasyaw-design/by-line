/* 바이라인 — src/systems/legal.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 언론중재위원회 · 소송 =====
function medCheck(it,clip,unv,W){if(!it||!it.subj||S.story==='rookie')return;const D=DF();
  if(!unv&&!(it.adv&&!(W.rb&&it.rebut==='got'))&&W.head!=='bait')return;let p=.01+unv*.06+(!(W.rb&&it.rebut==='got')&&it.adv?.05:0)+(W.head==='bait'?.06:0)+(clip.imp>=40?.04:0)+(it.excl?.02:0);
  p*=(D.legal||1)*(hasF('fact')?.7:1)*(S.simple?.5:1)*otr('legal');if(!chance(clamp(p,0,.6)))return;
  S.medQ=S.medQ||[];S.medQ.push({h:clip.h,subj:it.subj,due:S.turn+R(4,8),unv,rb:!!(W.rb&&it.rebut==='got'),q:clip.q,excl:it.excl,imp:clip.imp});}
function medPen(){return S.simple?.6:1;} // 난이도 배율은 apply()에서 신뢰·평판에 붙는다
function medTick(Qx){if(S.medQ&&S.medQ.length){const due=S.medQ.filter(m=>m.due<=S.turn);S.medQ=S.medQ.filter(m=>m.due>S.turn);due.slice(0,1).forEach(m=>Qx.push(()=>mediation(m)));if(due.length>1)S.medQ.push(...due.slice(1).map(m=>({...m,due:S.turn+4})));}
  if(S.suitQ&&S.suitQ.length){const due=S.suitQ.filter(m=>m.due<=S.turn);S.suitQ=S.suitQ.filter(m=>m.due>S.turn);due.slice(0,1).forEach(m=>Qx.push(()=>lawsuit(m)));}}
function medLoss(m,kind){const k=medPen();const corp=S.rank>=4||S.founder;
  if(kind==='correct'){S.errors++;S.lastError=S.turn;(S.errT=S.errT||[]).push(S.turn);if(S.errT.length>20)S.errT.shift();const dmg=m.unv>=2?+(R(3,15)/100*k).toFixed(2):0;if(dmg&&S.co)S.co.cash-=dmg;log(`언론중재위 직권조정: 「${m.h}」 정정보도${dmg?` · 배상 ${eok(dmg)}`:''}`);tick(`언론중재위, ${OUT().n} 「${m.h.slice(0,18)}…」 정정보도 결정`);
    return apply({trust:-4*k,eval:-3*k,fame:-1.5*k})+(dmg?` · 회사 배상 ${eok(dmg)}`:'');}
  if(kind==='reply'){log(`언론중재위 조정 성립: 「${m.h}」 반론보도 게재`);return apply({trust:-1.2*k,eval:-.8*k});}
  return '';}
function mediation(m){const D=DF();const dem=m.unv>0?`정정보도와 손해배상 ${R(2,9)}천만 원`:m.rb?'정정보도':'반론보도';
  const win=clamp(.22+(3-m.unv)*.1+S.st.ver/260+(m.rb?.1:0)+(hasF('legal')?.12:0)-(D===DIFF.hard?.08:D===DIFF.easy?-.08:0),.05,.85);
  openModal('언론중재위원회 조정 신청',`<p class="lede">「${esc(m.h)}」 보도에 대해 ${esc(sbjN(m.subj))} 측이 언론중재위원회에 <b>${dem}</b>을 청구했다.</p><p>조정 기일이 잡혔다. 중재부(부장판사 출신 중재부장과 위원들)가 양쪽 주장을 듣고 합의를 권한다. 합의가 안 되면 직권조정 결정을 내리고, 어느 쪽이든 불복하면 소송으로 간다.</p><p class="hint">이 기사: 미확인 사실 ${m.unv}개 · 당사자 반론 ${m.rb?'받음':'없음'} · 완성도 ${Math.round(m.q)}${hasF('legal')?' · 사내 법무팀 있음':''}</p>`,[
   {label:'조정 기일에 나가 취재 근거를 낸다',sub:`취재 수첩·녹취·문건 제출 · 이길 확률 약 ${Math.round(win*100)}%`,fn:()=>{spend(0,6);const r=Math.random();
     if(r<win){S.medWin=(S.medWin||0)+1;openModal('신청 기각',`<p class="lede">중재부가 "보도 내용이 진실이라고 믿을 만한 상당한 이유가 있다"며 신청을 기각했다.</p>${fxLine(apply({fame:.6,trust:1}))}`);}
     else if(r<win+(1-win)*.5){openModal('조정 성립 · 반론보도',`<p class="lede">중재부 권유로 신청인 측 반론을 싣는 선에서 합의했다. 원 기사는 그대로 남는다.</p>${fxLine(medLoss(m,'reply'))}`);}
     else{const sue=chance((m.unv>=2?.45:.2)*(D.legal||1));if(sue){S.suitQ=S.suitQ||[];S.suitQ.push({...m,due:S.turn+R(8,16),amt:R(1,5)});}
       openModal('직권조정 · 정정보도 결정',`<p class="lede">중재부가 "핵심 내용이 사실과 다르다"며 정정보도를 결정했다.${sue?' 신청인 측은 이와 별도로 손해배상 소송을 내겠다고 했다.':''}</p>${fxLine(medLoss(m,'correct'))}`);}}},
   {label:'반론보도를 먼저 제안한다',sub:'빨리 끝날 수 있다 · 상대가 거절하면 정정으로 갈 수도',fn:()=>{if(chance((m.unv?.55:.75)*(D===DIFF.hard?.85:1))){openModal('조정 성립 · 반론보도',`<p class="lede">신청인이 반론보도로 받아들였다.</p>${fxLine(medLoss(m,'reply'))}`);}else openModal('제안 거절',`<p class="lede">"반론으로는 안 됩니다. 정정하세요." 결국 정정보도로 조정됐다.</p>${fxLine(medLoss(m,'correct'))}`);}},
   {label:'정정보도를 받아들인다',sub:'소송 위험 없이 끝나지만 신뢰·평가가 깎인다',fn:()=>{const k=medPen();if(m.unv>0){S.errors++;S.lastError=S.turn;(S.errT=S.errT||[]).push(S.turn);if(S.errT.length>20)S.errT.shift();}log(`「${m.h}」 정정보도 수용`);toast(apply({trust:-2.5*k,eval:-1.5*k}));}},
   {label:'불출석한다',sub:'조정 불성립 — 소송으로 갈 확률이 높다',fn:()=>{S.suitQ=S.suitQ||[];if(chance(.65*(D.legal||1))){S.suitQ.push({...m,due:S.turn+R(6,12),amt:R(2,7)});toast('신청인이 소송을 예고했다');}else toast('신청인이 더 나가지 않았다');apply({trust:-.5});}}]);}
function lawsuit(m){const D=DF();const corp=S.rank>=4||S.founder;const amt=m.amt*(D===DIFF.hard?1.5:D===DIFF.easy?.7:1);
  const win=clamp(.3+(3-m.unv)*.1+S.st.ver/300+(hasF('legal')?.15:0)+(S.medWin?.03:0)-(D===DIFF.hard?.1:0),.05,.85);
  openModal('명예훼손 손해배상 소송',`<p class="lede">${esc(sbjN(m.subj))} 측이 「${esc(m.h)}」 보도로 ${corp?'회사':'회사와 나'}를 상대로 손해배상 ${eok(amt)} 소송을 냈다.</p><p class="hint">${D===DIFF.hard?'어려움: 기자 개인에게도 배상 책임이 나눠질 수 있다. ':''}재판은 몇 달이 걸린다.</p>`,[
   {label:'법무팀·변호사를 붙여 끝까지 간다',sub:`변호사 비용 · 이길 확률 약 ${Math.round(win*100)}%`,fn:()=>{const fee=+(.03+amt*.03).toFixed(2);if(S.co)S.co.cash-=fee;
     if(chance(win))openModal('승소',`<p class="lede">법원이 "공익성이 있고 진실이라 믿을 상당한 이유가 있었다"며 청구를 기각했다.</p>${fxLine(apply({fame:1.2,trust:1.5}))}`);
     else{const pay=+(amt*R(15,45)/100).toFixed(2);if(S.co)S.co.cash-=pay;let me='';if(D===DIFF.hard&&!corp){const p=R(300,1200);S.money-=p;me=` 기자 개인 몫 ${p}만 원.`;}S.errors++;log(`명예훼손 패소: 배상 ${eok(pay)}`);tick(`법원, ${OUT().n}에 명예훼손 배상 판결`);
       openModal('패소',`<p class="lede">일부 패소. 회사가 ${eok(pay)}을 배상한다.${me}</p>${fxLine(apply({eval:-4*medPen(),fame:-2*medPen(),trust:-3*medPen()}))}`);}}},
   {label:'합의한다',sub:'배상금 일부 · 정정 기사',fn:()=>{const pay=+(amt*.2).toFixed(2);if(S.co)S.co.cash-=pay;toast('합의 · '+apply({trust:-2*medPen(),eval:-1.5*medPen()}));}}]);}