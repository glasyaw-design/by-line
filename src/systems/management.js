/* 바이라인 — src/systems/management.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 발행인(창간 모드) 능력치 =====
const FSTN={vis:'비전',edit:'편집 판단',integ:'언론 원칙',biz:'경영 수완',sales:'영업력',fund:'자금 조달',lead:'리더십',pr:'대외 협상',dig:'디지털 감각',crisis:'위기관리'};
const FSTD={vis:'매체가 커 나가는 속도(성장 점수)',edit:'보도 품질이 매달 오른다',integ:'신뢰도가 이 값 쪽으로 움직이고 구독 이탈이 준다',biz:'매달 비용을 줄인다',sales:'광고 매출과 영업 성공률',fund:'투자·펀딩 성공률과 금액',lead:'기자 실력 성장, 채용 성공률, 이탈 방지',pr:'포털 심사·제휴·관계망',dig:'트래픽 성장',crisis:'소송·오보·장애를 막는 힘'};
const FSTG=[['방향',['vis','edit','integ']],['돈',['biz','sales','fund']],['사람과 바깥',['lead','pr']],['변화와 위기',['dig','crisis']]];
function fstInit(){const t=S.st;const c=v=>Math.round(clamp(v,10,85));S.fst={vis:c((t.kno+t.wri)/2),edit:c((t.ver+t.hed+t.wri)/3),integ:c(S.trust*.8),biz:c((t.dat+t.kno)/2-8),sales:c((t.cha+t.net)/2-5),fund:c(t.net*.5+t.cha*.3),lead:c((t.cha+t.men)/2),pr:c((t.net+t.cha)/2),dig:c((t.spd+t.dat)/2),crisis:c((t.men+t.ver)/2)};}
const fs=k=>(S.fst&&S.fst[k]!=null)?S.fst[k]:40;
function fgain(k,v){if(!S.fst)fstInit();S.fst[k]=clamp(S.fst[k]+v,0,99);}
const FST_GAIN={fassign:'edit',fbureau:'lead',meeting:'edit',front:'edit',write:'edit',invest:'edit',discover:'vis',source:'pr',network:'pr',portal:'pr',facility:'biz',cut:'biz',fvision:'vis',fsales:'sales',fpartner:'pr',fbrand:'dig',fraise:'fund',fhire:'lead',fcrisis:'crisis',fethics:'integ',life:'lead',rest:'lead'};
const FOUNDER_ACTS=['revenue','lgevent','adrate','wage','fvision','exec','front','discover','invest','write','fassign','source','colleague','deptlife','fsales','fpartner','fbrand','fraise','fhire','fbureau','network','gad','portal','facility','fcrisis','fethics','life','rest'];
const FSTRAT={digital:['디지털 퍼스트','트래픽 성장↑, 종이·방송 비용 절감'],inv:['탐사 보도 집중','보도 품질·평판↑, 비용↑'],local:['독자 밀착','구독·후원 독자↑'],profit:['수익 다각화','광고·사업 수입↑, 품질 조금↓']};
RUN.fvision=function(){openModal('전략 회의',`<p class="lede">앞으로 반년(24주), 회사는 무엇에 집중할까?</p>${S.fStrat&&S.fStrat.due>S.turn?`<p class="hint">지금 전략: ${FSTRAT[S.fStrat.k][0]} (${wkTxt(S.fStrat.due-S.turn)} 남음)</p>`:''}`,Object.keys(FSTRAT).map(k=>({label:FSTRAT[k][0],sub:FSTRAT[k][1],fn:()=>{spend(1,3);setCd('fvision');S.fStrat={k,due:S.turn+24};fgain('vis',.8);log(`전략: ${FSTRAT[k][0]}`);toast(`전략 확정 · ${FSTRAT[k][0]}`);}})).concat([{label:'취소',cls:'ghost'}]));};
RUN.fsales=function(){const o=OUT();const p=clamp(.2+fs('sales')/190-Math.max(0,((S.mAct&&S.mAct.fsales)||0)-1)*.07,.12,.75);const amt=+(o.ad*(.09+fs('sales')/600)).toFixed(2);
  openModal('광고·후원 영업',`<p>발행인이 직접 광고주를 만난다. 성공률은 영업력(${Math.round(fs('sales'))})에 달려 있다.</p>`,[
   {label:'배너·지면 광고 계약',rec:true,sub:`성공 ${pct(p)} · 약 ${adAmt(amt)}`,fn:()=>{spend(1,4);setCd('fsales');fgain('sales',.7);if(chance(p)){S.co.cash+=amt;S.adTotal=(S.adTotal||0)+amt;misWin('fsales');if(chance(.25)){openModal('광고주의 조건',`<p class="lede">광고주가 "기사 하나만 좋게 써 달라"고 덧붙였다.</p>`,[{label:'거절한다',sub:'계약 일부 취소, 언론 원칙↑',fn:()=>{S.co.cash-=amt*.4;fgain('integ',1);toast(apply({trust:1}));}},{label:'써 준다',sub:'포털 벌점·신뢰↓',fn:()=>{portalPen(1,'광고성 기사');toast(apply({trust:-3}));}}]);return false;}toast(`광고 계약 · +${eok(amt)}`);}else toast('이번엔 계약이 무산됐다');}},
   {label:'기업 후원 기획 (포럼·캠페인)',risk:true,sub:`성공 ${pct(p*.85)} · 약 ${adAmt(amt*1.4)} · 신뢰 조금↓`,fn:()=>{spend(1,5);setCd('fsales');fgain('sales',.6);if(chance(p*.85)){S.co.cash+=amt*1.4;misWin('fsales');toast(`후원 유치 · +${eok(amt*1.4)} · `+apply({trust:-1}));}else toast('후원사가 발을 뺐다');}},
   {label:'취소',cls:'ghost'}]);};
RUN.fpartner=function(){const o=OUT();const p=clamp(.3+fs('pr')/130,.25,.9);
  openModal('콘텐츠 제휴·판매',`<p>대외 협상(${Math.round(fs('pr'))})이 높을수록 좋은 조건을 받아 온다.</p>`,[
   {label:'방송사·통신사에 기사 공급',sub:`성공 ${pct(p)} · 매달 들어오는 전재료 계약 (6개월)`,fn:()=>{spend(1,4);setCd('fpartner');fgain('pr',.7);if(chance(p)){S.syndic={due:S.turn+24,v:+(o.ad*.08*(1+fs('pr')/100)).toFixed(2)};toast(`공급 계약 · 월 ${eok(S.syndic.v)}`);log('콘텐츠 공급 계약');}else toast('조건이 맞지 않았다');}},
   {label:'포털 담당자와 정책 협의',sub:'포털 벌점 -1, 포털 관계↑',fn:()=>{spend(1,3);setCd('fpartner');fgain('pr',.6);if(S.portal)S.portal.pen=Math.max(0,S.portal.pen-1);netUp('portal',6);toast('포털과 정례 협의 채널을 열었다');}},
   {label:'경쟁 매체와 공동 기획',sub:`성공 ${pct(p*.9)} · 보도 품질·평판↑`,fn:()=>{spend(1,4);setCd('fpartner');fgain('pr',.5);if(chance(p*.9)){S.co.q+=3;toast('공동 기획 성사 · '+apply({fame:1.5}));}else toast('상대가 거절했다');}},
   {label:'취소',cls:'ghost'}]);};
RUN.fbrand=function(){const d=fs('dig');openModal('브랜딩·독자 확대',`<p>디지털 감각(${Math.round(d)})이 높을수록 효과가 크다.</p>`,[
   {label:'뉴스레터 창간',sub:'구독·후원 독자↑ · 0.1억',fn:()=>{spend(1,3);setCd('fbrand');fgain('dig',.6);S.co.cash-=.1;S.co.bS+=.008+d/5000;toast('뉴스레터 첫 호 발송');}},
   {label:'유튜브·숏폼 채널',sub:`트래픽↑${hasF('studio')?' (스튜디오 효과 2배)':''} · 0.3억`,fn:()=>{spend(1,4);setCd('fbrand');fgain('dig',.8);S.co.cash-=.3;S.co.bT+=(.012+d/4000)*(hasF('studio')?2:1);toast('채널 개설');}},
   {label:'SNS 바이럴 캠페인',sub:'트래픽 크게↑, 자극적이면 신뢰↓',fn:()=>{spend(1,3);setCd('fbrand');fgain('dig',.5);S.co.bT+=.02+d/3000;if(chance(.3))toast('화제는 됐지만 "낚시" 소리도 들었다 · '+apply({trust:-1.5}));else toast('캠페인이 퍼졌다');}},
   {label:'취소',cls:'ghost'}]);};
RUN.fraise=function(){const f=fs('fund'),sc=S.fScore||40;S.equity=S.equity??100;
  const opts=[
   ['크라우드펀딩','지분 그대로 · 신뢰도가 높을수록 많이 모인다',clamp(.4+f/150,.3,.95),()=>+(S.trust/22*(1+f/120)).toFixed(1),0,0],
   ['엔젤 투자','지분 10% · 3~6억',clamp(.3+f/140,.25,.9),()=>+(R(30,60)/10*(1+f/150)).toFixed(1),10,1],
   ['벤처캐피털(VC)','지분 20% · 성장 점수가 높을수록 크게',clamp(.2+f/150+sc/400,.15,.85),()=>+(R(80,160)/10*(sc/60)*(1+f/150)).toFixed(1),20,1],
   ['대기업 전략 투자','지분 30% · 큰돈, 편집권 간섭·신뢰↓',clamp(.3+f/160,.25,.85),()=>+(R(200,350)/10).toFixed(1),30,2]];
  openModal('투자 유치',`<p>지금 내 지분 <b>${S.equity}%</b> · 자금 조달(${Math.round(f)}). 지분이 50% 아래로 내려가면 이사회가 발행인을 흔들 수 있다.</p>`,opts.map(([n,d,p,amt,eq,inv])=>({label:n,sub:`${d} · 성공 ${pct(p)}`,disabled:S.equity-eq<10,fn:()=>{spend(1,5);setCd('fraise');fgain('fund',.9);if(chance(p)){const a=amt();S.co.cash+=a;S.equity-=eq;if(inv)S.investor=Math.max(S.investor||0,inv);if(inv===2)apply({trust:-4});if(eq===0)S.co.bS+=.01;log(`${n} ${eok(a)} 유치`);tick(`「${OUT().n}」, ${n} ${eok(a)} 유치`,1);toast(`${n} 성공 · +${eok(a)}`);}else toast(`${n} 무산 — 다음 기회를 노리자`);}})).concat([{label:'취소',cls:'ghost'}]));};
RUN.fhire=function(){openModal('인재 채용',`<p>리더십(${Math.round(fs('lead'))})과 매체 위상(★${OUT().p})이 높을수록 좋은 기자가 온다. 인건비는 매달 나간다.</p>`,[
   {label:'수습기자 공채',sub:'후보 8명 중 최대 5명 · 인건비 싸다 · 수습 기간엔 전력 외',fn:()=>{hireBoard('new');return false;}},
   {label:'경력 기자 영입',sub:'후보 6명 중 최대 3명',fn:()=>{hireBoard('career');return false;}},
   {label:'스타 기자 스카우트',sub:'후보 6명 중 1명 · 비싸다',fn:()=>{hireBoard('star');return false;}},
   {label:'프리랜서·객원 계약',sub:'싸고 빠르다 · 품질 조금↓',fn:()=>{spend(1,2);setCd('fhire');S.co.staff+=2;S.co.q-=1;toast('객원 기자 2명 계약');}},
   {label:'취소',cls:'ghost'}]);};
RUN.fcrisis=function(){const c=fs('crisis');spend(1,3);setCd('fcrisis');fgain('crisis',.9);let n=0;S.pending=S.pending.filter(x=>{if(['err','suit','bribe'].includes(x.type)&&chance(c/130)){n++;return false;}return true;});if(S.portal&&S.portal.pen)S.portal.pen=Math.max(0,S.portal.pen-1);S.ctsT=S.turn;
  openModal('위기관리 점검',`<p class="lede">법무 검토, 정정 대기 기사, 서버 점검까지 한 번에 훑었다.</p><p>${n?`터지기 직전이던 위험 ${n}건을 미리 막았다.`:'당장 터질 위험은 보이지 않았다.'} 포털 벌점도 1점 정리했다.</p>`);};
RUN.fethics=function(){openModal('윤리강령·독자위원회',`<p>언론 원칙(${Math.round(fs('integ'))})은 신뢰도와 구독 이탈에 영향을 준다.</p>`,[
   {label:'윤리강령 제정·공개',sub:'신뢰↑, 광고성 기사 벌점↓',fn:()=>{spend(1,3);setCd('fethics');fgain('integ',1.2);if(S.portal)S.portal.pen=Math.max(0,S.portal.pen-1);toast(apply({trust:3}));}},
   {label:'독자위원회 구성',sub:'구독 이탈↓, 신뢰↑',fn:()=>{spend(1,3);setCd('fethics');fgain('integ',1);S.co.bS+=.008;toast(apply({trust:2}));}},
   {label:'정정·반론 원칙 공개',sub:'오보 피해↓',fn:()=>{spend(1,2);setCd('fethics');fgain('integ',.8);fgain('crisis',.5);toast(apply({trust:1.5}));}},
   {label:'취소',cls:'ghost'}]);};
function founderStatMonth(lines){if(!S.fst)fstInit();const c=S.co,l=c.last||{};
  const bonus=(l.ad||0)*(fs('sales')-40)/400+(l.cost||0)*(fs('biz')-40)/500+(S.syndic&&S.syndic.due>S.turn?S.syndic.v:0);c.cash+=bonus;
  c.bT+=(fs('dig')-40)/6000;c.bS+=(fs('integ')-40)/8000;c.q=clamp(c.q+(fs('edit')-50)/60,10,100);S.trust=clamp(S.trust+(fs('integ')-S.trust)*.03,0,100);
  S.team.forEach(t=>t.skill=clamp(t.skill+fs('lead')/250,0,95));
  const st=S.fStrat&&S.fStrat.due>S.turn?S.fStrat.k:null;if(st==='digital')c.bT+=.01;if(st==='inv'){c.q+=1;c.cash-=.1;}if(st==='local')c.bS+=.008;if(st==='profit'){c.cash+=(l.ad||0)*.06;c.q-=.4;}
  if(Math.abs(bonus)>=.05)lines.push({c:bonus>0?'g':'r',t:`발행인 역량 효과 (영업·경영·제휴) ${bonus>0?'+':''}${eok(bonus)}`});
  if(S.equity!=null&&S.equity<50&&chance(.15))lines.push({c:'r',t:`지분 ${S.equity}% — 이사회에서 "발행인 교체" 얘기가 나왔다.`});}
function fstBox(){if(!S.fst)fstInit();return FSTG.map(([g,ks])=>`<div class="sec">${g}</div>${ks.map(k=>`<div class="statrow" title="${FSTD[k]}"><span>${FSTN[k]}</span>${bar(S.fst[k])}<span class="num">${Math.round(S.fst[k])}</span></div><p class="hint" style="margin:-4px 0 6px 84px;font-size:11.5px">${FSTD[k]}</p>`).join('')}`).join('')+`<div class="sec">지분</div><p class="hint" style="margin:0">내 지분 ${S.equity??100}%${S.investor?` · 투자자 ${S.investor===2?'대기업 계열':'재무적 투자자'}`:''}</p>`;}

// ===== 총무국 (사장·발행인) =====
// 참고: 신문사 총무국 = 총무부(인사·포상징계·교육·노조·복지·사내행사·문서·법무·자재 구매) + 재무관리부(자금·원가·급여·4대보험·주총·이사회) + ERP팀(영업·인사·재무 전산화) + CTS팀(제작 서버·전산장비)
const RANK_SYS={flat:['수평형',[0,1,3,6,7],'결재 단계가 적어 속보가 빠르다. 승진 자리가 적어 불만이 쌓인다'],std:['표준형',null,'매체 규모에 맞는 기본 체계'],fine:['세분형',[0,1,2,3,4,5,6,7],'보직이 많아 사기가 오르지만 인건비가 는다']};
const GAD=[
 ['총무부','g_rank','직급 체계 개편','수평형·표준형·세분형 중에서 고른다',24],
 ['총무부','g_dept','조직 개편','부서 신설·감축(통폐합)',8],
 ['총무부','g_reward','포상·징계','우수 기자 포상 또는 기강 확립',6],
 ['총무부','g_edu','사내 교육·연수','기자 실력↑',8],
 ['총무부','g_union','노사 교섭(임단협)','노조와 임금·근로조건을 협상한다',24],
 ['총무부','g_welfare','복리후생','자녀 학자금·건강검진·식당. 사기↑, 매달 비용',12],
 ['총무부','g_event','사내 행사','창간기념식·시무식·체육대회',12],
 ['총무부','g_legal','법무·채권 관리','소송 대응, 밀린 광고비 회수',6],
 ['총무부','g_buy','자재 구매 계약','용지·잉크·소모품 일괄 계약. 비용↓',24],
 ['재무관리부','g_pay','급여 체계(임금표)','기자 초임 수준과 연 인상률을 정한다',12],
 ['재무관리부','g_fin','자금·원가 관리','반년 동안 비용 4~6%↓',24],
 ['재무관리부','g_board','주주총회·이사회','이사회 신임·투자자 관계',24],
 ['ERP팀','g_erp','영업 전산화(ERP)','광고·판매 관리 효율↑ (광고 매출 +4%, 한 번)',0],
 ['CTS팀','g_cts','제작 서버·장비 점검','전산 장애 예방 (1년)',24]
];
function gadWhy(id,cd){S.gaCd=S.gaCd||{};if(id==='g_erp'&&S.erp)return '이미 도입';if(S.gaCd[id]&&S.gaCd[id]>S.turn)return `${wkTxt(S.gaCd[id]-S.turn)} 후`;if(S.ap<1)return '행동력 부족';return '';}
function gadUse(id,cd){S.gaCd=S.gaCd||{};S.gaCd[id]=S.turn+(cd||0);spend(1,2);if(S.founder)fgain(id==='g_pay'||id==='g_union'||id==='g_welfare'||id==='g_reward'||id==='g_edu'?'lead':id==='g_legal'||id==='g_cts'?'crisis':'biz',.5);}
RUN.fbureau=runFbureau;RUN.handoff=runHandoff;RUN.assign=runAssign;
RUN.gad=function(){const groups=[...new Set(GAD.map(g=>g[0]))];
  openModal('총무국',`<p>사장 직속 지원 조직. 인사·급여·조직부터 법무·자재·재무·전산까지 회사 살림을 맡는다. 항목마다 행동력 1.</p>${groups.map(g=>`<div class="sec">${g}</div><p class="hint" style="margin:0">${GAD.filter(x=>x[0]===g).map(x=>x[2]).join(' · ')}</p>`).join('')}`,
   GAD.map(([g,id,n,d,cd])=>{const w=gadWhy(id,cd);return{label:`${g} · ${n}`,sub:w?`${d} — ${w}`:d,disabled:!!w,fn:()=>{GAD_RUN[id](cd);return false;}};}).concat([{label:'닫기',cls:'ghost'}]));};
const GAD_RUN={
 g_rank(cd){const o=OUT();S.rankSys=S.rankSys||{};const cur=S.rankSysK||'std';openModal('직급 체계 개편',`<p>지금: <b>${RANK_SYS[cur][0]}</b> — ${rankChain().map(r=>rankName(r)).join(' → ')}</p>`,Object.keys(RANK_SYS).map(k=>({label:RANK_SYS[k][0],sub:RANK_SYS[k][2],disabled:k===cur,fn:()=>{gadUse('g_rank',cd);S.rankSysK=k;if(k==='std')delete S.rankSys[o.id];else S.rankSys[o.id]=RANK_SYS[k][1];if(k==='flat'){S.co.q+=1;S.team.forEach(t=>t.skill-=1);relUp(colBy('union'),-6,'직급 축소');}if(k==='fine'){S.team.forEach(t=>t.skill+=1);}log(`직급 체계: ${RANK_SYS[k][0]}`);toast(`직급 체계 개편 · ${RANK_SYS[k][0]}`);}})).concat([{label:'뒤로',cls:'ghost',fn:()=>{RUN.gad();return false;}}]));},
 g_dept(cd){const o=OUT();openModal('조직 개편',`<p>지금 부서 ${o.depts.length}개: ${o.depts.map(d=>DEPTS[d].n).join('·')}</p>`,[{label:'부서 신설',sub:o.depts.length>=maxDepts()?`지금 인력으로는 부서를 더 늘릴 수 없다 (최대 ${maxDepts()}개) · 기자를 더 뽑으면 늘릴 수 있다`:'발령이나 채용으로 새 부서를 꾸린다 · 인건비와 운영비가 매달 는다',disabled:o.depts.length>=maxDepts(),fn:()=>{S.gaCd=S.gaCd||{};S.gaCd.g_dept=S.turn+cd;RUN.newdept();return false;}},{label:'부서 감축·통폐합',sub:'부서 하나를 없앤다. 인건비↓, 품질·사기↓',disabled:o.depts.length<=3,fn:()=>{openModal('어느 부서를 없앨까',`<p>없앤 부서의 기자 일부는 다른 부서로 가고 일부는 회사를 떠난다.</p>`,o.depts.map(d=>({label:DEPTS[d].n,fn:()=>{gadUse('g_dept',cd);o.depts=o.depts.filter(x=>x!==d);(S.deptMade=S.deptMade||{})[d]=S.turn;S.co.extra=Math.max(0,+((S.co.extra||0)-.006*o.p).toFixed(3));const out=S.team.filter(t=>t.d===d);S.team=S.team.filter(t=>t.d!==d||chance(.4));out.forEach(t=>{if(S.team.includes(t))t.d=pick(o.depts);});S.co.staff=Math.max(5,S.co.staff-Math.max(2,Math.round(S.co.staff/o.depts.length/2)));S.co.q-=2;relUp(colBy('union'),-10,'부서 폐지');if(S.dept===d)S.dept=o.depts[0];log(`${DEPTS[d].n} 폐지`);tick(`${o.n}, ${DEPTS[d].n} 폐지`);toast(`${DEPTS[d].n} 통폐합`);}})).concat([{label:'뒤로',cls:'ghost',fn:()=>{GAD_RUN.g_dept(cd);return false;}}]));return false;}},{label:'뒤로',cls:'ghost',fn:()=>{RUN.gad();return false;}}]);},
 g_reward(cd){openModal('포상·징계','<p>상과 벌은 조직의 공기를 바꾼다.</p>',[{label:'우수 기자 포상',sub:'0.1억 · 부서원 실력·사기↑',fn:()=>{gadUse('g_reward',cd);S.co.cash-=.1;S.team.forEach(t=>t.skill+=.6);toast('사내 특종상 시상');}},{label:'기강 확립 (징계 강화)',sub:'보도 품질↑, 사내 관계↓',fn:()=>{gadUse('g_reward',cd);S.co.q+=2;(S.cols||[]).forEach(c=>relUp(c,-3));toast('징계 규정 강화');}},{label:'뒤로',cls:'ghost',fn:()=>{RUN.gad();return false;}}]);},
 g_edu(cd){gadUse('g_edu',cd);const c=+(0.2*facSize()).toFixed(2);S.co.cash-=c;S.team.forEach(t=>t.skill+=hasF('academy')?2.2:1.5);toast(`사내 연수 · ${eok(c)} · 기자 실력↑`);closeModal();},
 g_union(cd){const u=colBy('union');openModal('노사 교섭(임단협)',`<p class="lede">노조가 임금 5% 인상과 주 52시간 준수를 요구했다.</p>`,[{label:'수용한다',sub:'인건비↑, 사기·관계↑',fn:()=>{gadUse('g_union',cd);S.payLv=+((S.payLv||1)*1.05).toFixed(2);S.team.forEach(t=>t.skill+=1);relUp(u,15,'임단협 수용');toast(apply({trust:1}));}},{label:'절충안 (2.5%)',sub:'무난',fn:()=>{gadUse('g_union',cd);S.payLv=+((S.payLv||1)*1.025).toFixed(3);relUp(u,5,'임단협 절충');toast('임단협 타결');}},{label:'거부한다',sub:'인건비 그대로, 파업 위험',fn:()=>{gadUse('g_union',cd);relUp(u,-20,'임단협 거부');if(chance(.45)){S.co.q-=5;S.co.bT-=.02;log('노조 파업');tick(`${OUT().n} 노조 파업`);toast('노조가 파업에 들어갔다 · '+apply({trust:-2}));}else toast('노조가 일단 물러섰다');}},{label:'뒤로',cls:'ghost',fn:()=>{RUN.gad();return false;}}]);},
 g_welfare(cd){const lv=S.welfareLv||0;openModal('복리후생',`<p>지금 수준 ${lv}/3. 단계마다 매달 비용이 들고, 기자 이탈이 줄고 실력이 자란다.</p>`,[{label:'한 단계 올린다',sub:'자녀 학자금 → 건강검진 → 사내 식당·어린이집',disabled:lv>=3,fn:()=>{gadUse('g_welfare',cd);S.welfareLv=lv+1;(S.cols||[]).forEach(c=>relUp(c,3));toast(`복리후생 ${S.welfareLv}단계`);}},{label:'한 단계 줄인다',sub:'비용↓, 사기↓',disabled:lv<=0,fn:()=>{gadUse('g_welfare',cd);S.welfareLv=lv-1;S.team.forEach(t=>t.skill-=1);relUp(colBy('union'),-8,'복지 축소');toast('복리후생 축소');}},{label:'뒤로',cls:'ghost',fn:()=>{RUN.gad();return false;}}]);},
 g_event(cd){gadUse('g_event',cd);S.co.cash-=.1;(S.cols||[]).forEach(c=>relUp(c,3));toast(pick(['창간기념식','시무식','사내 체육대회','송년회'])+' · '+apply({fame:.8}));closeModal();},
 g_legal(cd){gadUse('g_legal',cd);let n=0;S.pending=S.pending.filter(x=>{if(x.type==='suit'&&chance(.6)){n++;return false;}return true;});const g=+(OUT().ad*.08).toFixed(2);S.co.cash+=g;toast(`법무 대응 ${n}건 · 밀린 광고비 ${eok(g)} 회수`);closeModal();},
 g_buy(cd){gadUse('g_buy',cd);S.costCut={due:S.turn+24,r:.025};toast('자재 일괄 계약 · 반년간 비용 2.5%↓');closeModal();},
 g_pay(cd){S.gaCd=S.gaCd||{};openModal('급여 체계(임금표)',`<p>기자 임금은 사장이 정한다. 지금 초임 수준 ×${f1(S.payLv||1)} · 연 인상률 ${Math.round((S.payRaise||0)*100)}%</p>`,[
   {label:'초임 업계 상위 (×1.2)',sub:'인건비↑, 채용·실력·이탈 방어↑',fn:()=>{gadUse('g_pay',cd);const r=setPay(1.2,'임금표');toast(r.join(' · ')||'임금 상향');}},
   {label:'초임 업계 평균 (×1.0)',fn:()=>{gadUse('g_pay',cd);const r=setPay(1,'임금표');toast(r.join(' · ')||'임금 평균 수준');}},
   {label:'초임 업계 하위 (×0.85)',sub:'인건비↓, 이탈·사기 저하',fn:()=>{gadUse('g_pay',cd);const r=setPay(.85,'임금표');try{relUp(colBy('union'),-10,'임금 하향');}catch(e){}toast(r.join(' · ')||'임금 하향');}},
   {label:'연 인상률 0% (동결)',sub:'노조 반발',fn:()=>{gadUse('g_pay',cd);S.payRaise=0;S.payRaiseT=S.turn;relUp(colBy('union'),-8,'임금 동결');toast('임금 동결');}},
   {label:'연 인상률 3%',sub:'무난',fn:()=>{gadUse('g_pay',cd);S.payRaise=.03;S.payRaiseT=S.turn;toast('연 3% 인상');}},
   {label:'연 인상률 6%',sub:'사기↑, 비용 빠르게↑',fn:()=>{gadUse('g_pay',cd);S.payRaise=.06;S.payRaiseT=S.turn;S.team.forEach(t=>t.skill+=.8);relUp(colBy('union'),8,'임금 인상');toast('연 6% 인상');}},
   {label:'뒤로',cls:'ghost',fn:()=>{RUN.gad();return false;}}]);},
 g_fin(cd){gadUse('g_fin',cd);const r=+(.04+(S.founder?fs('biz'):50)/2500).toFixed(3);S.costCut={due:S.turn+24,r};S.co.q-=1;toast(`원가 관리 · 반년간 비용 ${Math.round(r*1000)/10}%↓`);closeModal();},
 g_board(cd){gadUse('g_board',cd);if(S.founder){if(S.equity!=null&&S.equity<50)toast('주주들을 설득했다 · 경영권 위협이 잦아들었다');else toast('주주총회 무사 통과');}else toast('이사회 보고 · '+apply({eval:3}));closeModal();},
 g_erp(cd){gadUse('g_erp',cd);const c=+(0.5*facSize()).toFixed(2);S.co.cash-=c;S.erp=1;toast(`ERP 도입 · ${eok(c)} · 광고 매출 +4%`);log('영업 전산화(ERP) 도입');closeModal();},
 g_cts(cd){gadUse('g_cts',cd);const c=+(0.15*facSize()).toFixed(2);S.co.cash-=c;S.ctsT=S.turn;toast(`제작 서버 점검 · ${eok(c)} · 1년간 전산 장애 예방`);closeModal();}
};
function gadMonth(lines){if(S.rank!==7)return;const c=S.co;if(S.welfareLv){c.cash-=c.staff*.002*S.welfareLv;S.team.forEach(t=>t.skill+=.15*S.welfareLv);}if(S.rankSysK==='fine')c.cash-=c.staff*.0025;
  if((S.ctsT==null||S.turn-S.ctsT>48)&&chance(.05)){c.q-=3;c.bT-=.02;lines.push({c:'r',t:'편집 서버가 반나절 멈췄다. 기사 송고가 막혔다 (총무국 CTS팀 점검을 미뤘다).'});}}

// ===== 능력치 기반 추천 =====
const ACT_STAT={sasu:'sta',hari:'sta',report:'wri',drink:'cha',pitch:'kno',beat:'net',source:'net',discover:'inv',invest:'inv',write:'wri',desk:'ver',plan:'lead',recruit:'cha',column:'wri',front:'hed',direction:'kno',campaign:'dat',adsales:'sal',digital:'dat',hire:'cha',event:'net',colleague:'cha',meeting:'kno',tour:'cha',taskforce:'inv',breaking:'spd',portal:'net',facility:'dat',network:'net',adsell:'sal',special:'inv',personnel:'lead',life:'men',rest:'sta'};
function judgment(){return S.simple?95:S.founder?fs('vis'):(S.st.kno+S.st.ver)/2;}
function recommendStat(){const j=judgment();const D=S.rec;
  if(!D||D.t!==S.turn){S.rec={t:S.turn,show:S.simple||chance(clamp(.35+j/130,.35,.95)),acc:clamp(.5+j/140,.5,.95),roll:Math.random()};}
  const R0=S.rec;if(!R0.show)return null;const ok=id=>rankActs().includes(id)&&!why(id);
  const best=recommend();if(best&&R0.roll<R0.acc)return best;
  const cand=rankActs().filter(ok).filter(id=>id!=='rest'||S.hp<50);if(!cand.length)return best;
  const val=id=>S.founder?(FST_GAIN[id]?fs(FST_GAIN[id]):30):(ACT_STAT[id]?S.st[ACT_STAT[id]]:30);
  return cand.sort((a,b)=>val(b)-val(a))[0];}

// ===== 위기와 페널티 =====
// 상태가 나빠지면 반드시 대가가 따른다 (컨디션·멘탈·통장·평가·신뢰·회사 자금). 간소화 모드는 빈도·강도 절반.
const CK=()=>S.simple?.5:1;
function crisisWeek(lines,Q){const k=CK();
  // 몸과 마음
  S.lowHp=S.hp<15?(S.lowHp||0)+1:0;
  if(S.lowHp>=3&&!S.simple||S.lowHp>=5){S.lowHp=0;Q.push(()=>openModal('응급실',`<p class="lede">마감 직후 쓰러졌다. 과로와 탈진. 의사가 "최소 2주는 쉬라"고 했다.</p><p>2주 동안 행동력이 절반이 되고, 진행 중인 단독 하나는 타사로 넘어갈 수 있다.</p>${fxLine(apply({eval:-2*k}))}`,[{label:'병가를 낸다',fn:()=>{S.sick=S.turn+5;S.hp=70;S.money-=30;toast('병원비 30만 원');}}]));}
  if(S.st.men<30&&chance(.25*k)&&!S.burnT){S.burnT=S.turn+12;Q.push(()=>openModal('번아웃',`<p class="lede">아침에 일어날 수가 없다. 기사를 보면 손이 떨린다.</p>`,[{label:'휴직한다 (한 달)',sub:'멘탈 크게 회복, 평가↓',fn:()=>{S.sick=S.turn+5;gain('men',12);apply({eval:-4*k});}},{label:'상담을 받으며 버틴다',sub:'통장 -80만, 멘탈 조금↑',fn:()=>{S.money-=80;gain('men',5);}},{label:'참는다',sub:'능력치가 조금씩 깎인다',fn:()=>{['wri','inv','ver'].forEach(x=>gain(x,-2*k));}}]));}
  if(S.burnT&&S.burnT<S.turn)S.burnT=0;
  // 돈
  if(S.money<-10000&&S.house){const v=housePrice(),net=Math.round(v*.92-(S.loan||0));S.money+=net;S.house=0;S.loan=0;gain('men',-6*k);lines.push({c:'r',t:`빚이 1억을 넘어 은행이 집을 처분했다 · 정산 ${net.toLocaleString('ko-KR')}만 원`});log('빚 때문에 집을 처분했다');}
  if(S.money<0){const i=Math.max(1,Math.round(Math.min(-S.money,30000)*.0025));S.money-=i;gain('men',-.4*k);S.debtW=(S.debtW||0)+1;if(S.debtW===1||S.debtW%4===0)lines.push({c:'r',t:`마이너스 통장 ${(-S.money).toLocaleString('ko-KR')}만 원 — 이자 ${i}만 원, 돈 걱정에 멘탈↓`});
    if(S.debtW>=12&&chance(.3*k)){S.debtW=0;Q.push(()=>openModal('카드 연체',`<p class="lede">카드값이 석 달째 밀렸다. 독촉 전화가 회사로 걸려 왔다.</p>`,[{label:'적금·투자를 깬다',disabled:!(S.savings||S.etf||S.stock),fn:()=>{S.money+=(S.savings||0)+(S.etf||0)+(S.stock||0);S.savings=0;S.etf=0;S.stock=0;}},{label:'부모님께 손을 벌린다',sub:'멘탈↓',fn:()=>{S.money+=500;gain('men',-3);}},{label:'버틴다',sub:'사내 평판↓',fn:()=>{apply({eval:-2*k});relUp(colBy('boss'),-5,'연체 독촉 전화');}}]));}}else S.debtW=0;
}
const CRISES=[
 // 기자 (평기자~부장)
 {w:0,c:()=>false,run:()=>{const c=S.clips.find(c=>c.turn>=S.turn-12&&c.q<55);openModal('언론중재위 제소',`<p class="lede">「${esc(c.h)}」 기사 대상자가 언론중재위원회에 정정보도를 청구했다.</p>`,[{label:'정정보도를 받아들인다',sub:'신뢰↓ 조금, 빨리 끝난다',fn:()=>toast(apply({trust:-2*CK(),eval:-1}))},{label:'조정에 맞선다',sub:'검증력이 높으면 이긴다',fn:()=>{if(chance(.3+S.st.ver/150))toast('조정 불성립 — 기사 유지 · '+apply({fame:1}));else{toast('정정보도 결정 · '+apply({trust:-4*CK(),eval:-2*CK()}));S.errors++;}}}]);}},
 {w:2,c:()=>S.rank>=1&&S.sources.length>=3,run:()=>{const s=pick(S.sources);openModal('취재원 노출',`<p class="lede">기사 속 디테일 때문에 ${esc(s.name)}(${esc(s.role)})의 신원이 회사에 들통났다. 그가 징계를 받게 됐다.</p>`,[{label:'찾아가 사과하고 돕는다',sub:'통장 -50만, 다른 취재원 신뢰 유지',fn:()=>{S.money-=50;s.trust=Math.max(0,s.trust-30);toast('취재원이 등을 돌렸다');}},{label:'모른 척한다',sub:'취재원을 잃고 소문이 난다',fn:()=>{S.sources=S.sources.filter(x=>x!==s);S.sources.forEach(x=>x.trust=Math.max(0,x.trust-6*CK()));toast(apply({trust:-1}));}}]);}},
 {w:2,c:()=>S.rank>=1&&S.rank<=3&&S.st.wri<45,run:()=>openModal('표절 시비',`<p class="lede">내 기사 문단이 다른 매체 기사와 거의 같다는 제보가 들어왔다. 급하게 쓰다 참고한 문장이 그대로 남았다.</p>`,[{label:'인정하고 사과문을 낸다',fn:()=>toast(apply({trust:-3*CK(),eval:-2*CK()}))},{label:'"우연의 일치"라고 버틴다',sub:'들통나면 크게 다친다',fn:()=>{if(chance(.5))toast('버텼다');else toast('비교 캡처가 퍼졌다 · '+apply({trust:-7*CK(),fame:-3*CK(),eval:-3}));}}])},
 {w:2,c:()=>S.rank>=1&&S.eval<45,run:()=>openModal('데스크의 경고',`<p class="lede">${bossT()}: "요즘 왜 이래? 이번 달도 이러면 인사 때 각오해."</p>${fxLine(apply({men:-1}))}`,[{label:'"다음 주 단독 하나 가져오겠습니다"',sub:'한 달 안에 단독을 못 내면 평가 -4',fn:()=>{S.promise={due:S.turn+4,sc:S.scoops};}},{label:'고개를 숙인다',fn:()=>toast(apply({eval:-1}))}])},
 {w:2,c:()=>S.rank>=1&&S.rank<=4&&S.items.length>=4,run:()=>{const it=pick(S.items);openModal('취재 정보 유출',`<p class="lede">「${esc(it.title)}」 취재 내용이 취재 대상에게 새 나갔다. 누군가 입이 가벼웠다.</p><p>상대가 증거를 지우기 시작했다.</p>`,[{label:'서둘러 쓴다',sub:'확인 안 된 채로 — 위험',fn:()=>{it.heat=1;}},{label:'접고 다른 걸 판다',fn:()=>{S.items=S.items.filter(x=>x!==it);toast(apply({eval:-1*CK()}));}}]);it.alert=clamp(it.alert+40,0,100);}},
 {w:1,c:()=>S.rank>=1&&S.flags.insider,run:()=>openModal('주식 보유 감사',`<p class="lede">사내 윤리위원회가 경제 담당 기자들의 주식 보유 내역을 조사한다.</p>`,[{label:'자진 신고하고 판다',sub:'평가↓ 조금',fn:()=>{S.money+=S.stock||0;S.stock=0;S.flags.insider=0;toast(apply({eval:-1.5}));}},{label:'숨긴다',sub:'적발되면 징계',fn:()=>{if(chance(.45)){S.flags.insider=0;toast('적발 — 감봉 3개월 · '+apply({eval:-6*CK(),trust:-5*CK(),money:-150}));}else toast('이번엔 넘어갔다');}}])},
 // 회사 (모든 직급에 영향)
 {w:2,c:()=>S.co&&S.co.cash<0&&S.rank>=1&&S.rank<=5,run:()=>openModal('회사가 어렵다',`<p class="lede">경영 악화로 회사가 임금 10% 삭감과 희망퇴직을 발표했다.</p>`,[{label:'버틴다',sub:'월급↓ 3개월',fn:()=>{S.payCut=S.turn+12;gain('men',-2);}},{label:'이직을 알아본다',sub:'이직 쿨다운 초기화',fn:()=>{S.cd.job=0;gain('men',-1);}}])},
 {w:1,c:()=>S.rank>=2&&!S.simple,run:()=>openModal('압수수색',`<p class="lede">검찰이 우리 기사 취재원을 찾겠다며 편집국 압수수색 영장을 들고 왔다.</p>`,[{label:'편집국 앞을 막아선다',sub:'취재원 보호, 평판↑, 사법 리스크',fn:()=>{S.sources.forEach(x=>x.trust=clamp(x.trust+5,0,100));toast(apply({fame:2,trust:2,eval:-1}));}},{label:'협조한다',sub:'취재원들이 등을 돌린다',fn:()=>{S.sources.forEach(x=>x.trust=Math.max(0,x.trust-15));toast(apply({trust:-3}));}}])},
 {w:2,c:()=>S.rank>=4,run:()=>{const n=R(2,5);openModal('기자 집단 이탈',`<p class="lede">에이스 기자 ${n}명이 경쟁사로 한꺼번에 옮긴다고 통보했다.</p>`,[{label:'연봉을 올려 붙잡는다',sub:'인건비↑',fn:()=>{S.co.extra+=n*.08;toast('일부를 붙잡았다');}},{label:'보낸다',sub:'보도 품질↓',fn:()=>{S.co.staff=Math.max(5,S.co.staff-n);S.co.q-=n*1.5*CK();S.team.splice(0,Math.min(n,S.team.length-1));toast(`${n}명 퇴사`);}}]);}},
 {w:2,c:()=>S.rank>=5,run:()=>{const big=pick(ENTS.filter(e=>e[2]==='corp'))||['c0','대기업'];openModal('광고주 대이탈',`<p class="lede">${big[1]} 등 대형 광고주 세 곳이 "논조가 마음에 안 든다"며 올해 광고를 모두 끊었다.</p>`,[{label:'편집 방향을 지킨다',sub:'반년간 광고↓, 신뢰↑',fn:()=>{S.co.adB-=.25*CK();S.resist=(S.resist||0)+1;toast(apply({trust:3}));}},{label:'논조를 조절한다',sub:'광고 회복, 신뢰↓',fn:()=>toast(apply({trust:-6*CK()}))}]);}},
 {w:1,c:()=>S.rank>=5&&!S.simple,run:()=>openModal('노조 파업',`<p class="lede">노조가 편집권 독립과 임금 인상을 요구하며 파업에 들어갔다. 지면이 반으로 줄었다.</p>`,[{label:'요구를 받아들인다',sub:'인건비↑, 품질 회복',fn:()=>{S.payLv=+((S.payLv||1)*1.04).toFixed(3);relUp(colBy('union'),15,'파업 타결');}},{label:'대체 인력으로 버틴다',sub:'품질 크게↓, 신뢰↓',fn:()=>{S.co.q-=8*CK();S.co.bT-=.03;toast(apply({trust:-4*CK()}));}}])},
 {w:2,c:()=>S.rank>=4&&S.portal&&S.portal.lv>=2,run:()=>openModal('해킹 사고',`<p class="lede">홈페이지가 해킹당해 메인 화면에 엉뚱한 글이 올라갔다. 독자 정보 유출 우려도 나온다.</p>`,[{label:'즉시 공지하고 보안 투자',sub:'회사 자금 -0.8억, 신뢰 방어',fn:()=>{S.co.cash-=.8;toast(apply({trust:-1}));}},{label:'조용히 복구한다',sub:'들키면 크게 다친다',fn:()=>{if(chance(.5)){toast('유출 사실이 보도됐다 · '+apply({trust:-6*CK()}));portalPen(2,'보안 사고');}else toast('넘어갔다');}}])},
 {w:2,c:()=>S.rank>=4&&S.portal&&S.portal.pen>=4,run:()=>openModal('포털 퇴출 경고',`<p class="lede">포털 제휴평가위원회가 "다음 심사에서 제휴 해지를 검토하겠다"는 공문을 보냈다.</p>`,[{label:'어뷰징 담당 부서를 없앤다',sub:'트래픽↓, 벌점 -3',fn:()=>{S.portal.pen=Math.max(0,S.portal.pen-3);S.co.bT-=.03;}},{label:'무시한다',sub:'강등 위험',fn:()=>{S.portal.pen+=2;}}])},
 {w:2,c:()=>S.rank>=1&&S.errors>=3,run:()=>openModal('오보 정정 요구',`<p class="lede">반복된 오보로 시민단체가 "${esc(OUT().n)} 기사 바로잡기" 캠페인을 시작했다. 내 이름이 맨 위에 있다.</p>${fxLine(apply({trust:-3*CK(),fame:-2*CK()}))}`)},
 // 창간 전용
 {w:3,c:()=>S.founder&&S.investor,run:()=>openModal('투자금 회수 요구',`<p class="lede">투자자가 "성장이 더디다"며 투자금 일부 회수를 요구했다.</p>`,[{label:'돌려준다',sub:'자금 -5억, 지분 회복 +5%',fn:()=>{S.co.cash-=5*CK();S.equity=Math.min(100,(S.equity||100)+5);}},{label:'설득한다',sub:'자금 조달 능력으로',fn:()=>{if(chance(.35+fs('fund')/150))toast('설득 성공');else{S.co.cash-=8*CK();toast('결국 8억을 돌려줬다');}}}])},
 {w:2,c:()=>S.founder&&S.co.cash<3,run:()=>openModal('월급날 위기',`<p class="lede">이번 달 월급 줄 돈이 모자란다. 기자들이 눈치를 보기 시작했다.</p>`,[{label:'급여를 늦춘다',sub:'기자 이탈, 사기↓',fn:()=>{const n=Math.min(3,S.team.length);S.team.splice(0,n);S.co.staff=Math.max(5,S.co.staff-n);S.team.forEach(t=>t.skill-=2);toast(`${n}명이 떠났다`);}},{label:'내 통장을 턴다',sub:'개인 자금 → 회사',fn:()=>{const v=Math.min(S.money,5000);S.money-=v;S.co.cash+=v/10000;toast(`${eok(v/10000)}을 넣었다`);}},{label:'단기 대출',sub:'자금 +3억, 매달 이자',fn:()=>{S.co.cash+=3;S.coLoan=(S.coLoan||0)+3;}}])},
 {w:2,c:()=>S.founder&&OUT().p<=3,run:()=>openModal('대형 매체의 견제',`<p class="lede">대형 매체가 우리 기사를 "검증 안 된 찌라시"라고 공격하는 기사를 냈다.</p>`,[{label:'반박 기사로 맞선다',sub:'편집 판단이 높으면 이긴다',fn:()=>{if(chance(.3+fs('edit')/140))toast('여론이 우리 편 · '+apply({fame:2}));else toast('밀렸다 · '+apply({trust:-3*CK()}));}},{label:'무시한다',fn:()=>toast(apply({trust:-1}))}])},
 {w:2,c:()=>S.founder&&S.co.staff>=15,run:()=>openModal('편집국 내분',`<p class="lede">창간 멤버와 경력 영입파가 편집 방향을 두고 갈라섰다.</p>`,[{label:'창간 정신을 앞세운다',sub:'경력파 일부 이탈',fn:()=>{S.co.staff-=2;fgain('integ',1);}},{label:'경력파 손을 들어준다',sub:'창간 멤버 이탈, 품질↑',fn:()=>{S.co.staff-=2;S.co.q+=2;fgain('lead',-1);}},{label:'리더십으로 봉합한다',sub:'리더십이 높아야 성공',fn:()=>{if(chance(.3+fs('lead')/140))toast('봉합했다');else{S.co.staff-=4;S.co.q-=3;toast('결국 4명이 나갔다');}}}])}
];
function crisisMonth(Q){if(S.pendFlaw&&chance(.15)){S.pendFlaw--;const m=S.team.find(x=>x.flaw);if(m){m.flaw=null;Q.push(()=>openModal('뽑은 사람의 과거',`<p class="lede">${esc(m.name)} 기자의 전 직장 문제가 업계에 돌았다. 채용 때 평판 조회에서 걸러냈어야 했다.</p>${fxLine(apply({eval:-1.5,trust:-1}))}`));}}if(S.rank===0)return;const k=CK();if(S.story&&chance(.5))return;const p=((S.simple?.08:.18)+(S.trust<40?.05:0)+(S.eval<45?.05:0))*(DF().crisis||1);if(!chance(p))return;
  if((S.calmT||0)>S.turn)return;const el=CRISES.filter(c=>{try{return c.c();}catch(e){return false;}});if(!el.length)return;calmSet(8);let t=el.reduce((a,e)=>a+e.w,0)*Math.random();for(const e of el){t-=e.w;if(t<=0){Q.push(()=>{let ok=true;try{ok=e.c();}catch(x){ok=false;}if(ok)return e.run();closeModal();});break;}}
  if(S.promise&&S.promise.due<=S.turn){if(S.scoops<=S.promise.sc)Q.push(()=>openModal('약속을 못 지켰다',`<p class="lede">${bossT()}: "단독 가져온다며?"</p>${fxLine(apply({eval:-4*k}))}`));S.promise=null;}
  if(S.coLoan>0){S.co.cash-=S.coLoan*.01;}
}

// ================= 도움말 센터 =================
const HELP={
 start:['처음 시작','<p class="hint">복잡한 게 싫다면 새 게임에서 <b>간소화 모드</b>를 고르자(시작 2년 뒤부터 메뉴에서 전환 가능). 기사는 제목만 고르면 되고, 사실 확인은 한 번씩, 승진은 두 배 빠르다.</p><p class="lede">바이라인은 <b>기자 한 사람의 커리어</b>를 일주일 단위로 사는 게임이다. 어렵게 생각하지 말고, 아래 순서만 기억하면 된다.</p><ol class="steps"><li>위쪽 <b>상황판</b>에서 내 직급·다음 승진 조건·평가·평판·신뢰·컨디션을 본다.</li><li><b>이번 달 할 일</b>에서 버튼을 누른다. 버튼마다 행동력(동그라미)이 든다. 노란 테두리의 <b>추천</b>을 따라가도 된다.</li><li>행동력을 다 쓰면 <b>다음 달로 넘기기</b>. 월말마다 결과·이벤트가 나온다.</li><li>매달 말 월급이 들어오고, 1월·7월에 정기 인사(승진·발령)가 있다.</li><li>오른쪽 <b>수첩</b> 탭에서 아이템·취재원·스크랩·관계를 확인한다. 탭은 필요할 때 하나씩 열린다.</li></ol>'],
 report:['취재하고 기사 쓰기','<ol class="steps"><li><b>아이템 얻기</b> — 수습은 사쓰마와리, 기자는 발굴·출입처 브리핑·취재원 만남으로 아이템을 얻는다.</li><li><b>사실 확인</b> — 아이템마다 사실이 4개. "취재 나가기"에서 전화·문건·현장·탐문·데이터·정보공개청구·인터뷰로 확인한다. ★핵심 사실은 <b>서로 다른 두 경로</b>로 확인해야 한다.</li><li><b>반론 받기</b> — 당사자 인터뷰나 서면 질의로 반론을 받는다. 반론 없는 기사는 오보 위험과 관계 손상이 크다.</li><li><b>발제</b> — 아침 발제로 지면과 마감을 받으면 평가가 오르지만, 마감을 넘기면 깎인다.</li><li><b>기사 쓰기</b> — 야마(방향) → 리드 → 사실 고르기 → 제목 → 매체별 마무리. 확인 안 된 사실을 넣으면 오보 위험.</li></ol>'],
 scoop:['단독·특종','<p><b>단독</b> 아이템에는 "추격까지 n주"가 붙는다. 그 안에 쓰지 않으면 라이벌이 먼저 쓴다(낙종). 파급력에 따라 등급이 달라진다.</p><dl class="gloss"><dt>단독</dt><dd>우리만 쓴 기사. 평가·평판이 오른다.</dd><dt>특종</dt><dd>파급력 58 이상. 국회 질의·당국 조사 같은 반응이 따라온다.</dd><dt>대특종</dt><dd>파급력 75 이상. 기자상 후보가 되고 업계 전체가 받아쓴다.</dd><dt>낙종</dt><dd>빼앗긴 단독. 따라가기 기사로 체면을 세우거나 더 깊게 파서 반격할 수 있다.</dd></dl><p class="hint">편집회의에 단독을 올리면 소문이 새서 남은 시간이 줄 수 있다.</p>'],
 people:['사람과 관계망','<p><b>사내 관계</b>: 캡·부장·동기·선배·사진기자·편집기자·노조 위원장. 40 이상이면 도움, -20 이하면 발목.</p><p><b>관계망</b>: 정부 기관·정당·인물·광고주. 처음엔 출입처 정도만 안다. 직급이 오르거나 부서를 옮기거나, "대외 관계 → 새 연줄 뚫기"로 새로운 곳을 안다. 장관·협회장·회장 같은 거물은 부장 이상이거나 같은 분야 기관과 관계 40 이상일 때 소개받을 수 있다.</p><p>각 상대에게는 <b>성향</b>이 있다. 폐쇄적이면 관계가 잘 안 오르고, 소송을 즐기면 비판 기사에 고소로 맞선다. 광고로 압박하는 곳도 있다.</p>'],
 money:['돈 · 생활','<p>월급은 실수령 기준이고 매년 물가만큼 생활비가 오른다. "월급 쓰기"에서 교육·장비·건강·저축·집 마련에 돈을 쓰면 능력치와 컨디션에 도움이 된다.</p>'],
 exec:['데스크 · 간부 · 사장','<ol class="steps"><li><b>차장</b> — 데스킹(후배 초고에서 문제 문장 찾기), 광고·협찬 영업. 광고주에게 리베이트를 주면 계약은 쉬워지지만 위험하다.</li><li><b>부장</b> — 부서 기획, 기자 영입, 분기 광고 목표.</li><li><b>부국장·국장</b> — 편집회의·1면·칼럼·특별취재팀·속보 지휘·포털 제휴 전략.</li><li><b>편집국장</b> — 인사권(승진·이동), 편집 방향, 외부 압력 버티기.</li><li><b>사장</b> — <b>총무국</b>이 열린다: 직급 체계 개편, 조직 개편(부서 신설·감축), 기자 임금표(초임·연 인상률), 포상·징계, 교육, 노사 교섭, 복리후생, 사내 행사, 법무·채권, 자재 구매, 자금·원가, 주주총회·이사회, ERP, CTS(서버 점검). 그밖에 시설 투자, 포털 제휴, 광고·구독·디지털 투자.</li></ol>'],
 market:['언론사 경쟁 · 포털','<p>비슷한 매체 5곳과 <b>광고 시장 점유율</b>을 나눈다(회사 탭). 보도 품질·평판·포털 등급이 점유율을 정한다.</p><dl class="gloss"><dt>포털 제휴</dt><dd>미제휴 → 검색 제휴 → 뉴스스탠드 → 콘텐츠 제휴(CP). 등급이 높을수록 트래픽이 크게 늘고, CP가 되면 전재료가 들어온다.</dd><dt>벌점</dt><dd>자극적 제목·광고성 기사·어뷰징에 쌓인다. 6월·12월 말 평가에서 8점 이상이면 강등.</dd><dt>심사</dt><dd>부국장 이상이 "포털 제휴 전략"으로 승격을 신청한다. 품질·신뢰·평판·매체 급을 본다.</dd></dl>'],
 modes:['모드 · 목표','<dl class="gloss"><dt>언론고시</dt><dd>4곳에 지원해 서류·필기(상식 10문항)·면접(5문항)을 본다. 면접 정답은 매체 성격에 따라 다르다.</dd><dt>중소·중견</dt><dd>바로 입사. 직급 단계가 짧다.</dd><dt>스토리</dt><dd>목표와 제한 시간이 있는 시나리오 5편. 진행 상황은 상황판과 수첩 맨 위.</dd><dt>창간</dt><dd>발행인으로 시작. 능력치가 기자와 다르다: 비전·편집 판단·언론 원칙·경영 수완·영업력·자금 조달·리더십·대외 협상·디지털 감각·위기관리. 행동도 전략 회의·광고 영업·콘텐츠 제휴·브랜딩·투자 유치·인재 채용·위기관리·윤리강령·총무국으로 바뀐다. 이번 판의 창간 목표 3가지 중 2가지를 이루면 엔딩. 매체 위상 ★5·포털 CP·기자 80명이 클리어, 자금이 바닥나면 파산. 작을 땐 발행인이 직접 취재도 한다.</dd><dt>커리어 목표</dt><dd>수첩의 목표 카드. 여러 개를 동시에 노릴 수 있다.</dd></dl>'],
 words:['용어 사전','<dl class="gloss"><dt>사쓰마와리</dt><dd>수습기자가 경찰서를 돌며 사건을 챙기는 일</dd><dt>하리꼬미</dt><dd>뻗치기. 집·사무실 앞에서 취재 대상을 기다리는 일</dd><dt>야마</dt><dd>기사의 핵심 방향, 주제</dd><dt>리드</dt><dd>기사 첫 문장(문단)</dd><dt>발제</dt><dd>아침 회의에 올리는 기사 계획</dd><dt>데스크·데스킹</dt><dd>기사를 고치고 판단하는 사람·일</dd><dt>엠바고</dt><dd>정해진 시각까지 보도 유예</dd><dt>오프더레코드</dt><dd>보도하지 않기로 한 발언</dd><dt>백브리핑</dt><dd>공식 브리핑 뒤 익명 전제 추가 설명</dd><dt>낙종</dt><dd>타사에 기사를 빼앗김</dd><dt>물먹다</dt><dd>낙종하다의 은어</dd><dt>CP</dt><dd>포털 콘텐츠 제휴사. 전재료를 받는다</dd><dt>ABC</dt><dd>신문 부수 공사</dd></dl>']
};
function helpCenter(k='start'){const keys=Object.keys(HELP);openModal(`도움말 · ${HELP[k][0]}`,`<div class="help-nav">${keys.map(x=>`<button type="button" data-hk="${x}" aria-pressed="${x===k}">${HELP[x][0]}</button>`).join('')}</div>${HELP[k][1]}`,[{label:'튜토리얼 처음부터 보기',cls:'ghost',fn:()=>{tutorial(0);return false;}},{label:'닫기'}]);
  document.querySelectorAll('[data-hk]').forEach(b=>b.onclick=()=>helpCenter(b.dataset.hk));}

// ================= 동시 접속자 (웹 배포에서만) =================
function inArtifact(){try{return !!(window.claude&&(window.claude.hot||window.claude.complete))||/claude\.ai|claudeusercontent|anthropic/.test(location.hostname);}catch(e){return false;}}
let LIVE=null;
function liveHTML(){return LIVE&&LIVE.online!=null?`<span class="dot"></span><span class="lv">지금<b>${LIVE.online.toLocaleString('ko-KR')}</b>명 플레이 중</span>${LIVE.total?`<span class="sep"></span><span class="lv">누적<b>${LIVE.total.toLocaleString('ko-KR')}</b>명</span>`:''}`:'';}
// 7.1 접속자 수는 관리자만: 주소 뒤에 ?admin=비밀키 를 한 번 붙여 열면 이 브라우저에 기억된다 (?admin=off 로 해제)
function adminKey(){try{const q=new URLSearchParams(location.search),a=q.get('admin');if(a!=null){if(a==='off'||a==='')localStorage.removeItem('byline-admin');else localStorage.setItem('byline-admin',a.slice(0,80));q.delete('admin');const qs=q.toString();history.replaceState(null,'',location.pathname+(qs?'?'+qs:'')+location.hash);}return localStorage.getItem('byline-admin')||'';}catch(e){return '';}}
function presenceStart(){if(inArtifact()||location.protocol!=='https:')return;const ak=adminKey();let id;try{id=localStorage.getItem('byline-pid');if(!id){id=Math.random().toString(36).slice(2)+Date.now().toString(36);localStorage.setItem('byline-pid',id);}}catch(e){id=Math.random().toString(36).slice(2);}
  const beat=(ev)=>fetch('/api/presence',{method:'POST',headers:Object.assign({'content-type':'application/json'},ak?{'x-admin-key':ak}:{}),body:JSON.stringify({id,ev:ev||'beat'}),keepalive:true}).then(r=>r.ok?r.json():null).then(d=>{if(d&&ak){LIVE=d;const el=$('#live');if(el)el.innerHTML=liveHTML();}}).catch(()=>{});
  window.__presence=beat;let last=Date.now();const go=ev=>{last=Date.now();beat(ev);};beat('open');
  // 7.1 신호는 10분마다 한 번 (화면이 보일 때만). 다른 탭에 있다 돌아오면, 마지막 신호가 5분 넘게 지났을 때만 한 번 더
  setInterval(()=>{if(!document.hidden)go();},600000);document.addEventListener('visibilitychange',()=>{if(!document.hidden&&Date.now()-last>300000)go();});}