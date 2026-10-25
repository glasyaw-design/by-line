/* 바이라인 — src/compat/v37.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.41 광고 영업 조정 =====
// 1) 간부는 직함·인맥이 붙는다: 차장 +2.5%p, 부장 +5%p … 부국장 이상 +10%p (예전엔 직급이 올라도 성공률이 그대로라 계약이 커질수록 오히려 실패가 잦았다)
// 3) 지역 일간지: 지역 광고주는 오래 거래한 단골이라 +10%p, 큰 지역 기업일수록 깎이던 것 면제 · 전국 대기업은 지역지에 관심이 적어 -3%p
{const _adP=adP;adP=function(rel,conflict,ci,kind){let p=_adP(rel,conflict,ci,kind);try{const o=OUT();const E=ENT[ci]||{};
  if(!S.founder)p+=.025*clamp((S.rank|0)-1,0,4);
  if(o.type==='local'&&E.kind==='corp'){if(E.c==='loc')p+=.1+Math.max(0,adSz(ci)-1)*.08;else p-=.03;}}catch(e){}return clamp(p,.05,.82);};}
// 2) 광고주마다 계약 규모 차등을 조금 더 (예전 0.6~1.7배 → 0.45~2.1배). 작은 곳은 성공률이 오르고, 큰 곳은 조금 더 깎인다
adSz=function(ci){try{const W=ENTS.filter(e=>e[2]==='corp'&&e[4]).map(e=>e[4]).sort((a,b)=>a-b);const med=W[W.length>>1]||.01;const w=(ENT[ci]&&ENT[ci].w)||med;return clamp(Math.pow(w/med,.62),.45,2.1);}catch(e){return 1;}};
{const _adP2=adP;adP=function(rel,conflict,ci,kind){let p=_adP2(rel,conflict,ci,kind);try{const z=adSz(ci);if(z<1)p+=(1-z)*.12;else p-=(z-1)*.03;
  // AI 단골: 예전에 계약했던 작은·중간 광고주는 예산 공백(반년)이 지나면 다시 만나기 쉽다. 큰 광고주는 성과를 따져 단골 효과가 작다
  const hit=(S.adHit||{})[ci];if(hit!=null&&S.turn-hit>=24&&S.turn-hit<96)p+=z<1.2?.06:.03;}catch(e){}return clamp(p,.05,.82);};}
// AI 광고국 추천: 성공률만 보지 않고 「성공률 × 계약 규모」(기대 실적)로 고르고, 조건이 붙을 회사는 뒤로 미룬다
function adEV(x){try{return x.p*adSz(x.ci)*(x.conflict?.45:1)*(x.warm?1.1:1);}catch(e){return x.p;}}
// ===== 개발자 콘솔: 1.3~1.41 기능 바로 시험 =====
try{if(!DEVSEC.some(x=>x[0]==='new'))DEVSEC.splice(5,0,['new','1.3~1.41 기능']);}catch(e){}
function devForce(fn){const r0=Math.random;Math.random=()=>.001;try{fn();}finally{Math.random=r0;}}
{const _ds=devSecHTML;devSecHTML=function(sec){if(sec!=='new')return _ds.apply(this,arguments);if(S.phase!=='game')return '<p class="empty">게임을 시작해야 쓸 수 있다. "빠른 시작"으로 들어가자.</p>';
  const B=(k,n,a)=>dvBtn(k,n,a);
  return `<div class="sec">논설위원실</div><div class="btns">${B('op','논설위원 발령',1)}${B('op','논설실장 발령',2)}${B('op','주필 발령',3)}${B('opoffer','논설위원실 제안 팝업')}${B('opleave','편집국 복귀')}</div>
  <div class="sec">판매국 · 기사 삭제 요청 · 선거</div><div class="btns">${B('circ','판매 전략 회의')}${B('abc','ABC 부수 공사 결과')}${B('delreq','기사 삭제 요청 오기')}${B('elect','편집국장 선거',6)}${B('elect','사장 선임',7)}${B('scout','타사 스카우트 제안')}</div>
  <div class="sec">조직 (1.41)</div><div class="btns">${B('orgpick','부서장(팀장) 배치')}${B('orgvac','아무 부서 부서장 비우기')}${B('orgmon','조직 한 달 진행')}${B('orgshow','부서 전력 보기')}</div>
  <div class="sec">제자 · 라이벌 · 수습 (1.41)</div><div class="btns">${B('pgset','제자 들이기')}${B('pggrad','제자 독립시키기')}${B('pgyear','옛 제자 1년 진행')}${B('rvup','라이벌 승진')}${B('rvjoin','라이벌이 우리 회사로')}${B('rvinfo','라이벌 정보')}${B('coach','캡 코칭 보기')}${B('grad','수습 평가 바로')}</div>
  <div class="sec">광고 영업 (1.41)</div><div class="btns">${B('adsell','광고·협찬 영업 창')}${B('adsim','영업 40번 시뮬레이션')}</div>
  <div class="sec">배경 음악 (1.4)</div><div class="btns">${Object.keys(BGMF).map(k=>B('bgm',BGMF[k],k)).join('')}${B('bgm','상황대로','')}</div>`;};}
{const _da=devAct;devAct=function(k,arg){const N={
  op:()=>devRun(()=>{if(S.rank<4)S.rank=4;S.op=null;opEnter(+arg||1,'개발자');if(Q.length)Q.shift()();}),
  opoffer:()=>devRun(()=>{S.opOfT=-999;if(S.rank<4||S.rank>5)S.rank=4;S.op=null;devForce(()=>opOffer());if(Q.length)Q.shift()();else toast('조건이 안 맞는다 (부국장·국장, 일반 커리어)');}),
  opleave:()=>devRun(()=>{if(S.op){opLeave();toast('편집국 복귀');}else toast('논설위원실이 아니다');}),
  circ:()=>devRun(()=>{if(typeof circS==='function'&&circS())circOpen();else toast('종이 신문사에서만 (일간지·경제지·지역지·스포츠지 등)');}),
  abc:()=>devRun(()=>{const C=circS&&circS();if(!C){toast('종이 신문사에서만');return;}const L=[];abcRun(C,L);openModal('ABC 부수 공사 (개발자)',`<ul class="feed">${L.map(x=>`<li class="${x.c||''}">${esc(x.t)}</li>`).join('')||'<li>결과 줄 없음</li>'}</ul>`);}),
  delreq:()=>devRun(()=>{S.delT=-999;const L=[];devForce(()=>delMonth(L));if(Q.length)Q.shift()();else toast(L.length?L[0].t:'지울 만한 기사가 없다 — 기사를 몇 건 출고한 뒤 다시');}),
  elect:()=>devRun(()=>{try{electStart(+arg||6);}catch(e){toast('지금은 선거를 열 수 없다: '+e.message);}}),
  scout:()=>devRun(()=>{S.scoutT=-999;S.atOutlet=Math.max(S.atOutlet||0,YW);if(S.rank<1)S.rank=1;const L=[];devForce(()=>scoutMonth(L));if(Q.length)Q.shift()();else toast('조건이 안 맞는다 (평기자~국장)');}),
  orgpick:()=>{orgPickDept();},
  orgvac:()=>devRun(()=>{const per=roster();const d=pick(orgDepts());(per[d]||[]).forEach(m=>{if((m.r||0)>=2||m.acting){m.r=1;m.acting=0;}});toast(`${DEPTS[d].n} 부서장을 비웠다`);}),
  orgmon:()=>devRun(()=>{const L=[];orgMonth(L);openModal('조직 한 달 (개발자)',`<ul class="feed">${L.map(x=>`<li class="${x.c||''}">${esc(x.t)}</li>`).join('')||'<li>변화 없음</li>'}</ul>`);}),
  orgshow:()=>devRun(()=>{const per=roster();openModal('부서 전력 (개발자)',`<p class="hint">기준점 ${orgBase().toFixed(1)}</p><ul class="feed">${orgDepts().map(d=>{const q=orgDeptQ(d,per);return q?`<li>${DEPTS[d].n} ${orgGrade(q.q)} ${q.q} · 부서장 ${q.h?esc(q.h.name)+' '+orgScore(q.h):'공석'} · 평균 ${q.avg}</li>`:'';}).join('')}</ul>`);}),
  pgset:()=>devRun(()=>{if(S.rank<2){S.rank=2;S.team=genTeam();}const m=(S.team||[]).find(x=>!x.r&&x.rk==null)||(S.team||[])[0];if(!m){toast('팀원이 없다');return;}S.protege=m.name;m.rel=Math.max(m.rel??20,60);pgSnap();if(S.pgCur)S.pgCur.t0=S.turn-28;toast(`제자: ${m.name} (7개월째로)`);}),
  pggrad:()=>devRun(()=>{pgSnap();const c=S.pgCur;if(!c){toast('제자가 없다');return;}const m=(S.team||[]).find(x=>x.name===c.name);if(m){m.r=1;m.d=pick(OUT().depts.filter(d=>d!==S.dept&&!isRegD(d)));S.team=S.team.filter(x=>x!==m);}S.protege=null;pgGraduate(c);if(Q.length)Q.shift()();}),
  pgyear:()=>devRun(()=>{if(!(S.pgAlumni||[]).length){toast('옛 제자가 없다');return;}const L=[];const t0=S.turn;S.turn=S.turn-(S.turn%YW)+YW;pgAlumniMonth(L);S.turn=Math.max(t0,S.turn);openModal('옛 제자 1년 (개발자)',`<ul class="feed">${L.map(x=>`<li class="${x.c||''}">${esc(x.t)}</li>`).join('')||'<li>변화 없음</li>'}</ul>`);}),
  rvup:()=>devRun(()=>{const rv=S.rival;if(!rv||rv.pub){toast('라이벌이 없다');return;}rv.rk=Math.min(6,(rv.rk||1)+1);rv.rkT=S.turn;toast(`라이벌 ${rv.name} → ${rankName(rv.rk,OUTLETS.find(o=>o.id===rv.outlet))}`);}),
  rvjoin:()=>devRun(()=>{const rv=S.rival;if(!rv||rv.pub){toast('라이벌이 없다');return;}rv.outlet=S.outlet;S.rival=rivalKeep();toast(`라이벌 ${jo2(rv.name,'이','가')} 우리 회사로 · 새 맞수 ${S.rival.name}`);}),
  rvinfo:()=>devRun(()=>{const rv=S.rival;if(!rv){toast('라이벌 없음');return;}const ro=OUTLETS.find(o=>o.id===rv.outlet)||{};openModal('라이벌 (개발자)',`<p>${esc(rv.name)} · ${esc(ro.n||'')} · ${rv.pub?'대표':rankName(rv.rk||0,ro)} · 실력 ${Math.round(rv.skill||0)} · 낙종시킨 횟수 ${rv.wins||0}${rv.route?` · ${ROUTE[rv.route.k].n} ${rv.route.lv}단계`:''}</p><p class="hint">${(rv.hist||[]).map(esc).join('<br>')||'기록 없음'}</p>`);}),
  coach:()=>devRun(()=>{const t=capCoach();toast(t?t.t:'캡 코칭 없음 (수습 둘째 달부터, 기준이 뒤처질 때)');}),
  grad:()=>devRun(()=>{if(S.rank!==0){toast('수습이 아니다');return;}S.inRank=rookieWeeks();graduateCheck();}),
  adsell:()=>devRun(()=>{S.ap=Math.max(S.ap,3);S.cd=S.cd||{};S.cd.adsell=0;RUN.adsell();}),
  adsim:()=>devRun(()=>{const keep=JSON.stringify(S);let ok=0,sum=0,n=40;const r0=S.money;for(let i=0;i<n;i++){const corps=adCorps();const c=corps[0]||(ENTS.find(e=>e[2]==='corp')||[])[1];if(!c)break;const ci=corpId(c);const p=adP(netRel(ci),false,ci,'ad')*entRamp(ci);if(Math.random()<p){ok++;sum+=(SL_PK[OUT().p]||.4)*(1+(S.rank-2)*.2)*adSz(ci)*.68;}}S=JSON.parse(keep);openModal('영업 시뮬레이션 (개발자)',`<p>대표 광고주 기준 성공 ${ok}/${n} · 수당 ${Math.round(SL_FEE*1000)/10}%</p>`);}),
  bgm:()=>{auUnlock();BF.pin=arg?{k:arg,u:Date.now()+600000}:null;BF.key=null;bgmUpdate();toast(arg?`BGM: ${BGMF[arg]}`:'BGM 상황대로');}};
  if(N[k]){try{N[k]();}catch(e){console.error(e);toast('실행 못 함: '+e.message);}return;}return _da.apply(this,arguments);};}
// ===== 1.41 독립 언론 창간: 내 돈(자본금) 조건 =====
function manW(n){n=Math.round(n);return n>=10000?`${+(n/10000).toFixed(1)}억${n%10000&&n%1000?' '+(n%10000).toLocaleString('ko-KR')+'만':''}`:`${n.toLocaleString('ko-KR')}만`;}
function foundNeed(){return ({easy:6000,normal:10000,hard:15000})[S.diff||'normal']||10000;}
try{UNLOCK.found=Object.assign({},UNLOCK.found||{rw:12},{c:()=>S.money>=foundNeed()});Object.defineProperty(UNLOCK.found,'why',{configurable:true,get(){return S.inRank<(UNLOCK.found.rw||12)?'국장 부임 넉 달째부터':`창간 자금(내 돈) ${manW(foundNeed())} 원부터 · 지금 ${manW(S.money)} 원`;}});
  ACT.found.d=`회사를 나와 내 언론사를 세운다 (창간 모드로 전환) · 내 돈 ${(foundNeed()/10000).toFixed(foundNeed()%10000?1:0)}억 원 이상`;}catch(e){}
{const _rf=RUN.found;RUN.found=function(){if(!S.dev&&S.money<foundNeed()){openModal('창간 자금이 모자라다',`<p class="lede">투자자와 지인들이 먼저 묻는다. "대표님은 얼마 넣으세요?"</p><p>창간하려면 내 돈이 최소 <b>${manW(foundNeed())} 원</b> 있어야 한다. 지금 통장은 ${manW(S.money)} 원.</p><p class="hint">기본 자본(지인·크라우드펀딩)은 따로 모이지만, 대표가 자기 돈을 걸지 않으면 아무도 따라 넣지 않는다. 내 돈의 60%가 자본금으로 들어간다.</p>`);return;}return _rf.apply(this,arguments);};}

// ===== 1.41 창간 대표의 월급·생활비: 회사 규모를 따른다 =====
// 예전: 대표 월급 320~355만인데 생활비는 사장급(340만)이라 창간하는 순간 매달 0원 근처·적자였다
function founderPay(){const c=S.co||{};const st=c.staff||8;const yr=(S.turn-(S.fStart||0))/YW;
  let p=st<=40?240+st*6:480+(st-40)*3.2;p=Math.min(1000,p);
  if(yr<1)p=Math.min(p,260);                                   // 리스크: 창간 첫해는 박봉
  const pf=c.last?(c.last.profit||0):0;
  if((c.cash||0)<0)p=0;                                        // 리스크: 자금이 바닥나면 무급
  else if(pf<0&&(c.cash||0)<Math.max(1.5,-pf*6))p*=.6;          // 리스크: 적자에 자금 6개월치 미만이면 40% 삭감
  return Math.round(p*Math.pow(1.02,Math.floor(S.turn/YW))*(DF().pay||1)/5)*5;}
{const _pay=payOf;payOf=function(o,rank){try{if(S&&S.founder&&o&&(o.id==='mine'||o.custom)&&(rank==null||rank===S.rank))return founderPay();}catch(e){}return _pay.apply(this,arguments);};}
{const _lv=living;living=function(){try{if(S&&S.founder){const st=(S.co&&S.co.staff)||8;return Math.round((230+Math.min(110,st*1.1))*Math.pow(1.015,Math.floor(S.turn/YW)));}}catch(e){}return _lv.apply(this,arguments);};}

// 리턴: 흑자면 해마다 1월에 지난해 이익의 30% × 내 지분을 배당으로 받는다
function fDivMonth(lines){if(!S.founder||!S.co||!S.co.last)return;S.fPLy=(S.fPLy||0)+(S.co.last.profit||0);S.fPLn=(S.fPLn||0)+1;
  if(month()!==1||S.fPLn<6)return;const pl=S.fPLy,eq=(S.equity??100)/100;S.fPLy=0;S.fPLn=0;
  if(pl<=0){lines.push({c:'r',t:`지난해 회사가 ${eok(-pl)} 적자 — 대표 배당은 없다`});return;}
  const cap=Math.max(.5,((S.co.staff||8)*.08));const raw=pl*.3*eq;const div=+Math.min(raw,cap).toFixed(2);const man=Math.round(div*10000);S.co.cash-=div;S.money+=man;S.fDivTot=(S.fDivTot||0)+man;log(`연말 배당 ${man.toLocaleString('ko-KR')}만 원`);
  Q.push(()=>openModal('연말 배당',`<p class="lede">지난해 회사가 <b>${eok(pl)}</b> 흑자를 냈다. 이사회가 이익의 30%를 배당하기로 했다.</p><p>내 지분 ${Math.round(eq*100)}% → <b>${man.toLocaleString('ko-KR')}만 원</b>이 통장에 들어왔다.</p>${raw>cap?`<p class="hint">이익이 커도 배당은 회사 규모만큼만 — 한도 ${eok(cap)} (직원 ${S.co.staff}명 × 800만). 나머지는 회사에 남겨 재투자한다.</p>`:''}<p class="hint">지금까지 받은 배당 ${(S.fDivTot).toLocaleString('ko-KR')}만 원. 회사 자금에서는 ${eok(div)}이 나갔다. 투자를 많이 받아 지분이 줄면 배당도 줄어든다.</p>`));}
{const _em37=endMonth;endMonth=function(){const r=_em37.apply(this,arguments);try{if(S&&S.founder&&S.phase==='game'){const L=[];fDivMonth(L);L.forEach(x=>log(x.t));}}catch(e){console.error(e);}return r;};}
// 창간 버튼: 리스크와 리턴을 먼저 보여 준다
{const _rf2=RUN.found;RUN.found=function(){const r=_rf2.apply(this,arguments);try{if(/독립 언론 창간/.test($('#mt').textContent)&&!$('#mb .rr37')){$('#mb').insertAdjacentHTML('beforeend',`<div class="deal rr37"><div class="dc"><b>리스크</b><ul><li>창간 첫해 월급은 260만 원 이하 (지금 ${payOf(OUT()).toLocaleString('ko-KR')}만 원)</li><li>적자에 자금이 6개월치도 안 남으면 월급 40% 삭감</li><li>회사 자금이 바닥나면 무급 · 파산하면 넣은 돈은 전부 날아간다</li></ul></div><div class="dp"><b>리턴</b><ul><li>회사가 클수록 월급이 오른다 (직원 50명 약 560만 · 최대 1,000만)</li><li>흑자면 해마다 1월에 지난해 이익의 30% × 내 지분을 배당 (한도: 직원 수 × 800만 원)</li><li>회사를 크게 키우면 매각·상장 같은 엔딩</li></ul></div></div>`);}}catch(e){}return r;};}