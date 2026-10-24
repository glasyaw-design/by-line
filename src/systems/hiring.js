/* 바이라인 1.6 — src/systems/hiring.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */

// ===== 채용 게시판: 지원자를 직접 보고 고른다 =====
const TRAITS=[['집요함','inv',6],['꼼꼼함','ver',6],['글솜씨','wri',6],['마당발','net',6],['속도','spd',5],['친화력','cha',5],['데이터','dat',5],['배짱','men',4]];
const FLAWS_C=['전 직장 갈등설','오보 이력 1건','잦은 이직','마감을 자주 넘긴다는 평','SNS 설화 전력'];
// 채용: 지역부가 있는 매체는 지역 주재를 희망하는 지원자가 꽤 있다
function hireRegs(){const o=OUT();if(S.founder)return Object.keys(S.posts||{}).length?Object.keys(S.posts):(hasCorrDept(o)?NAT_REG.slice(0,4):[]);if(!hasCorrDept(o))return [];const P=corrPlan(o);return P.regs&&P.regs.length?P.regs:[];}
function hireCorr(m,reg){const d=OUT().depts.find(x=>['nat','loc','sigun'].includes(x))||m.d;m.d=d;m.reg=reg;m.role='주재기자';m.rel=R(5,20);
  if(S.founder){S.posts=S.posts||{};S.corrList=S.corrList||{};S.posts[reg]=(S.posts[reg]||0)+1;(S.corrList[reg]=S.corrList[reg]||[]).push(m);log(`${m.name}, ${reg} 주재기자로 입사`);return true;}
  corrs();if(Array.isArray(S.corr)){S.corr.push(fitSk(m));log(`${m.name}, ${reg} 주재기자로 입사`);return true;}return false;}
function hireEye(){return S.founder?fs('lead'):(S.st.cha+S.st.net+S.st.kno+(S.st.lead||0))/4;}
function hireCands(kind){const o=OUT();const n=kind==='new'?8:6;const L=[];
  for(let i=0;i<n;i++){const from=kind==='new'?null:pick(OUTLETS.filter(x=>x.id!==S.outlet&&!x.custom));const tr=pick(TRAITS);
    const yrs0=kind==='new'?1:kind==='star'?R(12,20):R(4,14);const base=kind==='new'?R(20,36):kind==='star'?skillYrs(yrs0)+R(10,20):skillYrs(yrs0)+R(-6,9);const skill=clamp(Math.round(base),10,90);
    const st={inv:skill+R(-12,12),wri:skill+R(-12,12),ver:skill+R(-12,12),net:skill+R(-12,12)};st[tr[1]]=(st[tr[1]]||skill)+tr[2]*2;
    const yrs=yrs0;const d=pick(o.depts);
    const ask=kind==='new'?0.01:+((.03+skill/1400)*(from?(.7+from.p*.15):1)*(kind==='star'?2:1)).toFixed(2);
    const will=kind==='new'?.92:clamp(.55+(o.p-(from?from.p:3))*.14+S.fame/400+(kind==='star'?-.15:0),.1,.92);
    const regs=hireRegs();const reg=regs.length&&chance(kind==='new'?.3:.35)?pick(regs):null;L.push({id:uid(),name:rname(),age:kind==='new'?R(25,31):24+yrs+R(0,4),yrs,from,major:pick(MAJORS).n,spec:pick(SPECS).n,trait:tr[0],tk:tr[1],d,skill,st,ask,will,flaw:chance(kind==='new'?.12:.2)?pick(FLAWS_C):null,cut:R(0,4),reg});}
  return L;}
function hireBoard(kind,keep){const o=OUT();const B=keep&&S.hb&&S.hb.kind===kind?S.hb:(S.hb={kind,c:hireCands(kind),round:0});
  const acc=clamp(.35+hireEye()/150+B.round*.18,.35,.95);const w=Math.round(26*(1-acc));
  const slots=kind==='new'?(S.rank===7||S.founder?5:2):kind==='star'?1:3;const title={new:'수습기자 공채',career:'경력 기자 영입',star:'스타 기자 스카우트'}[kind];
  const est=(v,seed)=>{const off=((seed*37)%(w+1))-w/2;const m=clamp(Math.round(v+off*.6),5,99);return `${clamp(m-Math.round(w/2),1,99)}~${clamp(m+Math.round(w/2),1,99)}`;};
  const card=(c,i)=>`<label class="chk"><input type="checkbox" data-hc="${i}"><span><b>${esc(c.name)}</b> · ${c.age}세${c.from?` · ${esc(c.from.n)} ${c.yrs}년 차`:` · ${esc(c.major)}`} · 희망 ${c.reg?`<b style="color:var(--good)">지역 주재 · ${esc(c.reg)}</b>`:DEPTS[c.d]?DEPTS[c.d].n:''}
   <small>추정 실력 ${est(c.skill,i+3)} · 강점 「${c.trait}」 · 취재 ${est(c.st.inv,i+5)} · 문장 ${est(c.st.wri,i+7)} · 검증 ${est(c.st.ver,i+9)}${c.from?` · 영입 비용 ${adAmt(c.ask)} (채용 절차·첫해 처우 인상분) · 이적 의사 ${c.will>=.7?'높음':c.will>=.45?'반반':'낮음'}`:` · 대표 스펙 ${esc(c.spec)}`}${c.flaw&&acc>=.6?` · <span style="color:var(--red)">평판 조회: ${c.flaw}</span>`:''}</small></span></label>`;
  openModal(title,`${kind==='new'?rkDealHTML():''}<p>${kind==='new'?'필기·면접을 통과한 수습기자 최종 후보들이다. 뽑으면 수습 기간을 거쳐 정식 기자가 된다.':'헤드헌터와 기자들 사이 평판으로 추린 후보들이다.'} 최대 <b>${slots}명</b>까지 고를 수 있다. 회사 자금 ${eok(S.co.cash)} · 인건비(월급·4대 보험·취재비 포함)는 한 사람당 매달 수습 약 ${eok(hireCost('new'))}, 기자 ${eok(hireCost('career',{yrs:5}))}, 10년 차 이상 ${eok(hireCost('career',{yrs:12}))}${kind==='star'?`, 스타 기자 ${eok(hireCost('star'))}`:''}이다.</p>
   <p class="hint">실력은 겉으로 본 추정치다. 사람 보는 눈(${S.founder?'리더십':'친화력·인맥·상식'} ${Math.round(hireEye())})이 좋을수록, 면접을 더 볼수록 범위가 좁아지고 숨은 흠도 보인다. 지금 정확도 ${Math.round(acc*100)}%.</p>${B.c.map(card).join('')}`,[
   {label:`선택한 후보 채용 (최대 ${slots}명)`,sub:'행동력 1',fn:()=>{const sel=[...document.querySelectorAll('#mb input[data-hc]:checked')].map(x=>B.c[+x.dataset.hc]);if(!sel.length){toast('후보를 골라 주세요');return false;}if(sel.length>slots){toast(`${slots}명까지 뽑을 수 있다`);return false;}
     const cost=sel.reduce((a,c)=>a+c.ask,0);if(S.co.cash<cost){toast('회사 자금이 모자란다');return false;}if(S.ap<1){toast('행동력이 없다');return false;}
     spend(1,3);setCd(S.founder?'fhire':kind==='new'?'hire':'recruit');if(S.founder)fgain('lead',.6);
     const got=[],no=[];const boss=S.rank===3?.8:1;
     sel.forEach(c=>{if(chance(c.will*boss*clamp((S.payLv||1)*(.85+(S.wMood??60)/400),.7,1.3))){S.co.cash-=c.ask;S.co.staff++;try{S.co.extra=+((S.co.extra||0)+hireCostD(kind,c)).toFixed(3);}catch(e){}const m={id:uid(),name:c.name,skill:c.skill,d:o.depts.includes(c.d)?c.d:o.depts[0],r:0,yrs:c.yrs,st:c.st,t0:S.turn,flaw:c.flaw};if(kind==='new'){m.rk=S.turn;m.yrs=0;}if(kind!=='new'&&c.yrs>=10&&chance(.4))m.r=1;if(c.reg&&hireCorr(m,c.reg)){}else S.team.push(m);got.push(c);if(c.flaw)S.pendFlaw=(S.pendFlaw||0)+1;}else no.push(c);});
     if(kind==='star'&&got.length){S.co.q+=3;apply({fame:2});}if(kind!=='new'&&got.length)apply({eval:1});S.hb=null;S.ros=null;
     got.forEach(c=>{log(`${kind==='new'?'수습기자':'경력'} 채용: ${c.name}${c.from?` (${c.from.n})`:''}`);if(c.from)tick(`${c.from.n} ${c.name} 기자, ${jo2(o.n,'으로','로')} 이적`);});
     openModal('채용 결과',`<p class="lede">${got.length?`${got.map(c=>esc(c.name)).join(', ')} 입사 확정.`:'아무도 오지 않았다.'}</p>${no.length?`<p>${jo2(no.map(c=>esc(c.name)).join(', '),'은','는')} "지금 회사에 남겠다"며 거절했다.${S.rank===3?' (국장 결재에서 막힌 건도 있다)':''}</p>`:''}${got.some(c=>c.flaw)?'<p class="hint">평판 조회에 걸렸던 사람이 있다. 시간이 지나면 드러날 수도 있다.</p>':''}`);return false;}},
   {label:'면접을 한 번 더 본다',sub:'행동력 1 · 추정 범위가 좁아지고 숨은 흠이 보인다',disabled:B.round>=2||S.ap<1,fn:()=>{spend(1,2);B.round++;hireBoard(kind,true);return false;}},
   {label:'후보를 새로 받는다',sub:S.hbRm===Math.floor(S.turn/4)?'이번 달엔 새 명단을 더 받을 수 없다':'지금 명단을 버린다 · 한 달에 한 번',disabled:S.hbRm===Math.floor(S.turn/4),fn:()=>{S.hbRm=Math.floor(S.turn/4);hireBoard(kind);return false;}},
   {label:'닫기',cls:'ghost'}]);}

function candidates(){return [0,1,2].map(()=>{const from=pick(OUTLETS.filter(o=>o.id!==S.outlet));return{name:rname(),from,d:pick(from.depts),skill:R(45,85),ask:R(4,9)};});}
RUN.recruit=function(){openModal('기자 채용','<p>어떤 기자를 뽑을까?</p>',[{label:'수습기자 공채',sub:'실력 20~36 · 인건비 싸다 · 수습 기간엔 전력 외',fn:()=>{hireBoard('new');return false;}},{label:'경력 기자 영입',sub:'실력 40~80 · 최대 3명 · 바로 전력',fn:()=>{hireBoard('career');return false;}},...(S.rank===7&&!S.founder?[{label:'스타 기자 스카우트',sub:'실력 70~90 · 비싸다 · 평판↑',fn:()=>{hireBoard('star');return false;}}]:[]),{label:'취소',cls:'ghost'}]);};
RUN.column=function(){
  const topics=shuffle(TPL).slice(0,3).map(t=>makeItem(t[0]));
  openModal('칼럼 주제','<p>기명 칼럼은 평판과 매체의 얼굴이 된다.</p>',topics.map(it=>({label:it.title,sub:DEPTS[it.d].n,fn:()=>{
    openModal('칼럼 논조',`<p class="lede">「${esc(it.title)}」</p>`,[
      {label:'날카롭게 비판한다',sub:'평판↑, 반발도 크다',fn:()=>{spend(1,5);setCd('column');const t=apply({fame:.8+S.st.wri/120,eval:.5,trust:chance(.5)?1:-2,wri:.4});S.co.q+=1;S.co.bT+=.004;toast('칼럼 게재 · '+t);}},
      {label:'균형 잡힌 분석',sub:'신뢰도↑',fn:()=>{spend(1,5);setCd('column');toast('칼럼 게재 · '+apply({fame:.6,eval:.5,trust:1.5,kno:.4}));S.co.q+=1;}},
      {label:'현장 경험을 담은 에세이',sub:'독자 반응↑',fn:()=>{spend(1,5);setCd('column');toast('칼럼 게재 · '+apply({fame:.8,eval:.5,wri:.5}));S.co.bS+=.003;}}]);return false;}})).concat([{label:'취소',cls:'ghost'}]));
};
RUN.front=function(){
  const cs=[0,1,2].map(()=>{const it=makeItem(pick(Object.keys(DEPTS)),{excl:chance(.4)});const vr=R(35,100)/100;it.facts.forEach((f,i)=>{if(i<Math.round(vr*4))f.conf=f.need;});const tag=it.ideo?pick(['cons','prog','neu']):null;return{it,vr:it.facts.filter(fOK).length/4,tag,by:S.team.length?pick(S.team).name:rname()};});
  const L=OUT().lean;
  openModal('1면 회의 · 내일 자 톱',`<p>${isTV()?'메인뉴스 첫 꼭지를':'1면 톱을'} 정한다. 우리 논조: <b>${LEAN[L]}</b></p>`,cs.map(c=>({label:(c.it.excl?'[단독] ':'')+c.it.title,sub:`${c.by} 기자 · ${DEPTS[c.it.d].n} · 사실 확인 ${pct(c.vr)}${c.tag?` · ${{cons:'보수 프레임',prog:'진보 프레임',neu:'균형 프레임'}[c.tag]}`:''}${c.it.adv?' · 광고주 관련':''}`,fn:()=>{
    spend(1,4);setCd('front');const fx={fame:c.it.imp/90*(c.it.excl?1.4:1),eval:.7+c.vr*.5};const co=S.co;let note='';
    if(c.vr<.6&&chance((1-c.vr)*.22*DF().risk))S.pending.push({type:'err',title:c.it.title,due:S.turn+R(1,3),desk:1});
    if(c.it.adv){co.adB-=.05;fx.trust=3;note='광고주가 불편해할 것이다. 광고 매출이 줄 수 있다.';}
    const ll=L==='market'?'cons':L;
    if(c.tag){if(c.tag===ll){co.bS+=.005;note+=' 핵심 독자층이 반겼다.';}else if(c.tag!=='neu'&&ll!=='neu'){co.bS-=.004;co.bT+=.01;fx.eval=-1;note+=' 기존 독자층이 반발했다. 대신 새 독자가 몰렸다.';}else co.bT+=.004;}
    co.q+=c.vr*2;log(`톱 결정: ${c.it.title}`);tick(`[${OUT().n}] ${c.it.excl?'[단독] ':''}${c.it.title}`,1);
    // 부국장~편집국장: 다음 날 아침 경쟁지 1면과의 승부 (1면 대결 승수에 들어간다)
    let duel='';if(S.rank>=4&&S.comp&&S.comp.length){const rv=compPick();if(rv){const me=c.it.imp*c.vr*(c.it.excl?1.35:1)+S.co.q*.3+R(-10,10),them=(rv.q||50)*.55+R(5,35)+(rv.buzz?10:0);if(me>=them){S.fwStreak=(S.fwStreak||0)+1;S.fwWins=(S.fwWins||0)+1;fx.fame+=.4;duel=`<p class="fx">다음 날 아침 — ${esc(cName(rv))} 1면을 눌렀다. 1면 대결 ${S.fwWins}승째${S.fwStreak>=2?` (${S.fwStreak}연승)`:''}.</p>`;}else{S.fwStreak=0;duel=`<p class="hint">다음 날 아침 — ${esc(cName(rv))} 1면이 더 많이 읽혔다. 확인이 단단하고 파급력 큰 단독일수록 이긴다.</p>`;}}}
    openModal(isTV()?'온에어':'윤전기가 돈다',`<p class="lede">${isTV()?'오후 9시':'새벽 1시'}, 「${esc(c.it.title)}」${jp(esc(c.it.title),'이','가')} ${isTV()?'메인뉴스 첫 꼭지로 나갔다':'1면에 걸렸다'}.</p><p>${note}</p>${duel}${fxLine(apply(fx))}`);return false;}})));
};
RUN.direction=function(){
  openModal('편집 방향 회의','<p>매체의 방향을 정한다. 효과는 몇 달에 걸쳐 나타난다.</p>',[
    {label:'핵심 독자층 결집',sub:'구독↑ 트래픽↓',fn:()=>{spend(1,4);setCd('direction');S.co.bS+=.012;S.co.bT-=.008;toast(apply({eval:2}));}},
    {label:'중도 독자로 외연 확장',sub:'트래픽↑ 기존 구독 소폭↓',fn:()=>{spend(1,4);setCd('direction');S.co.bT+=.025;S.co.bS-=.004;toast(apply({eval:1,trust:1}));}},
    {label:'탐사보도 강화',sub:'회사 자금 -2억, 품질↑ 신뢰↑',fn:()=>{spend(1,4);setCd('direction');S.co.cash-=2;S.co.q+=6;toast(apply({trust:3,fame:2}));}},
    {label:'취소',cls:'ghost'}]);
};
function coRev(){const c=S.co,o=OUT();return c.last?c.last.rev:c.subs*o.rate+o.ad+c.tr*.01;}
RUN.campaign=function(){const o=OUT();const cost=Math.max(.5,o.subs*o.rate*.45);const K=[['디지털 구독 할인','첫 석 달 반값 · 구독↑',1,.02,{}],['독자 참여 이벤트','독자 제보·투표 연계 · 구독 조금↑ · 평판↑',.7,.015,{fame:.5}],['기업·기관 단체 구독','구독↑↑ · 출입처와 엮여 신뢰 조금↓',.8,.026,{trust:-.6}]];
  const go=k=>()=>{spend(1,4);setCd('campaign');const c=cost*k[2];if(S.rank===5){if(chance(.65)){S.co.cash-=c;S.co.bS+=k[3]*.75;toast(`「${k[0]}」 승인 · 비용 ${eok(c)} · `+apply(Object.assign({eval:2},k[4])));log(`구독 캠페인 제안 승인: ${k[0]}`);}else toast(`경영진이 「${k[0]}」 예산을 깎았다`);return;}
    S.co.cash-=c;S.co.bS+=k[3];toast(`「${k[0]}」 집행 · ${eok(c)}`+(Object.keys(k[4]).length?' · '+apply(k[4]):''));log(`구독 캠페인: ${k[0]}`);};
  openModal(S.rank===5?'구독 캠페인 제안':'구독 캠페인',`<p>어떤 방식으로 독자를 모을까? 기본 비용 ${eok(cost)}.${S.rank===5?' 국장은 경영진에 제안하고, 승인되면 집행된다.':''}</p>`,K.map(k=>({label:k[0],sub:`${k[1]} · 비용 ${eok(cost*k[2])}`,fn:go(k)})).concat([{label:'취소',cls:'ghost'}]));};
RUN.adsales=function(){const pw=mediaPower();const top=ENTS.filter(e=>e[2]==='corp'&&e[4]&&S.net[e[0]]&&!S.net[e[0]].cut).sort((a,b)=>b[4]-a[4]).slice(0,3).map(e=>e[1]).join('·');
  openModal('광고주 영업 (사장)',`<div class="adq"><div><small>매체 파워</small><b>${pw.toFixed(2)}</b><small> · 광고 단가 ${Math.round((S.adRate||1)*100)}% · 수요 ${Math.round(adDemand()*100)}%</small></div><p class="hint" style="margin:4px 0 0">큰 광고주: ${esc(top||'없음')} · 지난달 광고 ${S.co.last?adAmt(S.co.last.ad||0):'-'} · 경기 ${ECON_N(econ())}</p></div>`,[
   {label:'대형 광고주 순회',rec:true,sub:'광고 매출↑ · 신뢰 조금↓ · 인맥↑',fn:()=>{spend(1,6);setCd('adsales');S.co.adB+=.07*(.8+(S.st.sal||0)/250);S.flags.adPush=(S.flags.adPush||0)+1;toast('광고주 미팅 · 광고 매출↑ · '+apply({trust:-1,net:.4}));}},
   {label:'정부·공공기관 광고 담당 미팅',sub:'광고 매출 조금↑ · 신뢰 그대로',fn:()=>{spend(1,5);setCd('adsales');S.co.adB+=.04;ENTS.filter(e=>e[2]==='gov'&&e[4]).slice(0,3).forEach(e=>netUp(e[0],3));toast('정부광고 담당자들과 인사를 나눴다');}},
   {label:'광고 단가·연간 계약',sub:'단가 조정과 큰 광고주 연간 계약',fn:()=>{RUN.adrate();return false;}},
   {label:'닫기',cls:'ghost'}]);};
RUN.digital=function(){const c=Math.max(1,coRev()*.3);const K=[['뉴스 앱 개편','트래픽↑ · 보도 품질 조금↑',.03,1],['영상·숏폼 팀 신설','트래픽↑↑ · 품질 그대로',.042,0],['데이터·검색 인프라','트래픽 조금↑ · 보도 품질↑',.02,2]];
  openModal('디지털 투자',`<p>투자 규모 ${eok(c)}. 어디에 돈을 넣을까?</p>`,K.map(k=>({label:k[0],sub:k[1],fn:()=>{spend(1,6);setCd('digital');S.co.cash-=c;S.co.bT+=k[2];S.co.q+=k[3];toast(`${k[0]} · ${eok(c)}`);log(`디지털 투자: ${k[0]}`);}})).concat([{label:'취소',cls:'ghost'}]));};
RUN.hire=function(){hireBoard('new');};
RUN.cut=function(){spend(1,4);setCd('cut');S.co.staff=Math.max(10,S.co.staff-6);S.co.q-=3;if(S.team.length>2)S.team.splice(R(0,S.team.length-1),1);toast('희망퇴직 실시 · '+apply({eval:2,trust:-2}));log('비용 절감: 희망퇴직');};
RUN.event=function(){spend(1,5);setCd('event');const g=coRev()*.12;S.co.cash+=g;const nm=pick(['미래경제포럼','지역균형발전 포럼','AI·산업 대전환 콘퍼런스','저출생 해법 토론회','기후·에너지 포럼','청년 일자리 박람회','글로벌 리더스 서밋']);toast(`「${nm}」 개최 · 후원 수입 ${eok(g)} · `+apply({trust:-2,net:.5}));log(`${nm} 개최`);};
// --- 동료 ---
const COL_LINES={
 lunch:['"오, 웬일로 밥을 다 사?"','"여기 김치찌개 잘해. 다음엔 내가 살게."','"요즘 위에서 분위기 어때?" 수다가 길어졌다.'],
 coffee:['"그 얘기 들었어? 다음 인사 때 큰 폭으로 바뀐대."','"너 요즘 기사 좋더라."','"나 요즘 진짜 그만두고 싶다..."'],
 drink:['"우리 회사 진짜 왜 이러냐." 새벽 두 시까지 마셨다.','"너니까 하는 말인데..." 속 깊은 이야기를 들었다.','노래방까지 갔다. 내일이 걱정이다.']
};
RUN.colleague=function(){colGroup();};
RUN.colleagueOld=function(){
  const list=S.cols.slice().sort((a,b)=>b.rel-a.rel);
  openModal('누구와 시간을 보낼까',`<p>관계가 좋아지면 일이 쉬워지고, 나빠지면 발목을 잡는다.</p>`,[{label:'여러 명과 함께 (최대 4명)',sub:'한 번에 여럿 · 한 사람당 효과는 절반쯤',fn:()=>{colGroup();return false;}}].concat(list.map(c=>({label:`${c.name} · ${colRole(c)}`,sub:`${relLabel(c.rel)} (${Math.round(c.rel)}) · ${CROLE[c.role].perk}${c.role==='boss'?` · 성향: ${BPREF[colPref(c)].n}`:''}`,fn:()=>{colTalk(c);return false;}}))).concat([{label:'취소',cls:'ghost'}]));
};
// 여러 동료를 골라 함께 시간을 보낸다: 한 사람당 효과는 1:1보다 작고, 돈·체력은 인원만큼 든다
// 여럿을 함께 챙길수록 한 사람당 효과는 줄지만 합치면 더 크다 (1명 100% · 2명 각 80% · 3명 각 70% · 4명 각 62%)
const GF=[0,1,.8,.7,.62];
function grpBind(attr,max,unit){const up=()=>{const L=[...document.querySelectorAll(`#mb input[${attr}]`)];const n=L.filter(x=>x.checked).length;const el=document.getElementById('gsel');if(el)el.textContent=n?`선택 ${n}${unit} / 최대 ${max}${unit}${n>1?` · 한 ${unit==='곳'?'곳':'사람'}당 효과 ${Math.round(GF[n]*100)}%, 합치면 ${Math.round(GF[n]*n*100)}%`:' · 1:1이면 깊은 대화를 고를 수 있다'}`:`먼저 ${unit==='곳'?'챙길 곳':'사람'}을 고르자 (최대 ${max}${unit})`;L.forEach(x=>{x.disabled=!x.checked&&n>=max;});};document.querySelectorAll(`#mb input[${attr}]`).forEach(x=>x.onchange=up);up();}
function colGroup(){const list=S.cols.slice().sort((a,b)=>b.rel-a.rel),MAX=4;
  const sel=()=>[...document.querySelectorAll('#mb input[data-cg]:checked')].map(x=>list[+x.dataset.cg]).filter(Boolean);
  const go=(v,fx,hp,mon,tag,line)=>()=>{const L=sel();if(!L.length){toast('먼저 사람을 골라 주세요');return false;}if(L.length>MAX){toast(`${MAX}명까지 고를 수 있다`);return false;}
    spend(1,hp?0:3);const out=L.map(c=>{const k=(c.pers==='strict'?.75:c.pers==='talk'?1.3:1)*1.35;const g=v*GF[L.length]*k*(1+S.st.cha/150)*(c.role==='rivalpeer'&&L.length>1?.7:1);relUp(c,g,tag);return `${c.name} ${colRole(c)} → ${relLabel(c.rel)} (${Math.round(c.rel)})`;});
    gain('cha',.25);const t=apply(Object.assign({},fx,hp?{hp:-hp}:{},mon?{money:-mon*L.length}:{}));
    openModal(tag,`<p class="lede">${line(L)}</p><ul class="feed">${out.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${fxLine(t)}`);return false;};
  const nm=L=>L.map(c=>c.name).join('·');
  openModal('동료 챙기기',`<p>함께할 동료를 1~${MAX}명 고른다. 여럿을 함께 챙기면 한 사람당 효과는 줄지만 합치면 더 크다. 한 명만 고르면 그 사람과 깊이 얘기할 수도 있다.</p><p class="pcount" id="gsel"></p>${list.map((c,i)=>`<label class="chk"><input type="checkbox" data-cg="${i}"><span><b>${esc(c.name)}</b> · ${esc(colRole(c))}<small>${relLabel(c.rel)} (${Math.round(c.rel)}) · ${esc(CROLE[c.role].perk)}${c.role==='boss'?` · 성향: ${BPREF[colPref(c)].n}`:''}</small></span></label>`).join('')}`,[
   {label:'1:1로 깊게 얘기한다',sub:'한 명만 골랐을 때 · 조언·부탁 같은 그 사람만의 선택지',fn:()=>{const L=sel();if(L.length!==1){toast('한 명만 골라 주세요');return false;}colTalk(L[0]);return false;}},
   {label:'다 같이 점심',sub:'한 사람당 통장 -3만 · 관계↑',fn:go(6,{},0,3,'단체 점심',L=>`${jo2(nm(L),'과','와')} 점심을 먹었다. ${pick(COL_LINES.lunch)}`)},
   {label:'커피 타임',sub:'돈 안 듦 · 관계 조금↑',fn:go(4,{},0,0,'커피 타임',L=>`${jo2(nm(L),'과','와')} 탕비실에서 커피를 마셨다. ${pick(COL_LINES.coffee)}`)},
   {label:'퇴근 후 회식',sub:'체력 -14 · 한 사람당 통장 -4만 · 관계 크게↑',fn:go(12,{},14,4,'번개 회식',L=>`${jo2(nm(L),'과','와')} 퇴근길에 한잔했다. ${pick(COL_LINES.drink)}`)},
   {label:'취소',cls:'ghost'}]);grpBind('data-cg',MAX,'명');}
function colTalk(c){
  const k=(c.pers==='strict'?.75:c.pers==='talk'?1.3:1)*1.35;
  const done=(v,why,fx,line)=>{spend(1,fx.hp?0:3);relUp(c,v*k*(1+S.st.cha/150),why);gain('cha',.2);const t=apply(fx);openModal(`${c.name} ${colRole(c)}`,`<p class="lede">${line}</p><p>관계: ${relLabel(c.rel)} (${Math.round(c.rel)})</p>${fxLine(t)}`);return false;};
  const opts=[
   {label:'점심을 산다',sub:'통장 -3만, 관계↑',fn:()=>done(6,'점심',{money:-3},pick(COL_LINES.lunch))},
   {label:'커피 마시며 수다',sub:'관계 조금↑, 소문을 들을 수도',fn:()=>{const line=pick(COL_LINES.coffee);let extra='';if(c.role==='peer'&&c.rel>=30&&chance(.35)&&S.rank<=3){const it=makeItem(S.dept,{pre:1});S.items.push(it);extra=` 그러다 "이거 너 줄게" — 「${esc(it.title)}」`;}return done(4,'커피',{},line+extra);}},
   {label:'일을 도와준다',sub:'체력 -8, 관계 크게↑',fn:()=>done(10,'업무 지원',{hp:-8,eval:.4},`${c.name}의 밀린 일을 같이 처리했다. "진짜 고마워. 이건 빚이다."`)},
   {label:'조언을 구한다',sub:c.role==='senior'||c.role==='cap'?'취재력·필력 성장':c.role==='editor'?'필력 성장':c.role==='boss'?'관계가 좋으면 평가↑':'관계 조금↑',fn:()=>{const fx={};let line='';
     if(c.role==='senior'||c.role==='cap'){fx.inv=.8;fx.wri=.6;line=`"${pick(['반론은 무조건 받아.','핵심은 두 군데서 확인해.','리드는 한 문장으로 끝내.','취재원한테 받은 만큼 지켜줘야 한다.'])}"`;}
     else if(c.role==='editor'){fx.wri=.8;line='"제목은 동사로 끝내 봐. 훨씬 살아."';}
     else if(c.role==='boss'){if(c.rel>=20){fx.eval=1;line='"좋아, 그렇게 고민하는 게 맞아."';}else{fx.eval=-.5;line='"그걸 왜 나한테 물어? 알아서 해."';}}
     else if(c.role==='union'){fx.trust=1;line='"기자는 독자를 보고 쓰는 거야. 회사가 아니라."';}
     else{fx.kno=.4;line='"나도 잘 모르지만..." 그래도 도움이 됐다.';}
     return done(3,'조언',fx,line);}},
   {label:'퇴근 후 술 한잔',sub:'체력 -12, 통장 -5만, 관계 크게↑',fn:()=>done(12,'술자리',{hp:-12,money:-5},pick(COL_LINES.drink))}
  ];
  const SP={
   photo:{label:'현장 동행을 부탁한다',sub:'다음 취재 때 현장 사진·증언이 붙을 수 있다',fn:()=>{const it=S.items.find(x=>x.facts.some(f=>f.k==='s'&&!fOK(f)));if(it&&chance(.6)){const f=it.facts.find(x=>x.k==='s'&&!fOK(x));f.conf++;f.via.push('사진기자 동행');return done(5,'현장 동행',{},`${jo2(c.name,'이','가')} 카메라를 메고 따라나섰다. 「${esc(it.title)}」 현장 사진을 건졌다.`);}return done(5,'현장 동행',{},'같이 나갔지만 오늘 현장은 조용했다. 그래도 사이는 가까워졌다.');}},
   editor:{label:'제목을 같이 고민해 달라고 한다',sub:'다음 기사 완성도↑',fn:()=>{S.peerRev={n:c.name,b:R(3,6)};return done(4,'제목 회의',{wri:.3},`"이건 동사로 끝내야 살아." ${jo2(c.name,'이','가')} 빨간 펜으로 몇 줄을 그었다. 다음 기사 때 봐 주기로 했다.`);}},
   boss:{label:'인사 분위기를 넌지시 묻는다',sub:'관계가 좋으면 승진 조건을 귀띔해 준다',fn:()=>{if(c.rel>=25)return done(2,'인사 상담',{},`"요즘 위에서 보는 건 ${pick(['단독 몇 건','평판','꾸준함','후배 키우는 거'])}야." ${jo2(bossT(),'이','가')} 목소리를 낮췄다.${promoLine().replace(/<[^>]+>/g,' ')}`);return done(-2,'눈치 없는 질문',{eval:-.3},'"그런 걸 왜 나한테 물어?" 분위기가 싸해졌다.');}},
   senior:{label:'취재원을 소개해 달라고 한다',sub:'관계가 좋으면 새 취재원',fn:()=>{if(c.rel>=20&&chance(.7)){const s2=addSource(S.dept,R(18,30));return done(3,'취재원 소개',{},`"이 사람 내 이름 대고 연락해." ${s2.name} ${s2.role}의 번호를 받았다.`);}return done(2,'취재원 소개',{},'"그건 아직 일러. 네 힘으로 뚫어 봐."');}},
   cap:{label:'라인 노하우를 묻는다',sub:`취재력↑ · 다음 ${jo2(sasuN(),'이','가')} 수월하다`,fn:()=>done(4,'노하우',{inv:.6,sta:.3},`"형사과는 새벽 4시가 제일 말이 많아. 그때 가." ${c.name} 캡이 담배를 끄며 말했다.`)},
   union:{label:'회사 돌아가는 얘기를 듣는다',sub:'회사 소식 · 가끔 사내 정보',fn:()=>done(4,'노조 소식',{kno:.3},`"${pick(['다음 달 구조조정 얘기가 있어.','사장이 광고국을 쪼으고 있다더라.','편집국장 교체설이 돈다.','올해 임금 협상은 길어질 거야.'])}" ${jo2(c.name,'이','가')} 커피를 건넸다.`)},
   rivalpeer:{label:'정보 교환을 제안한다',sub:'아이템을 얻을 수도 · 내 걸 들킬 수도',fn:()=>{if(chance(.5)){const it=makeItem(S.dept,{pre:1,mult:.8});S.items.push(it);return done(6,'정보 교환',{},`의외로 순순히 하나를 내놨다. → 「${esc(it.title)}」`);}const ex=S.items.find(x=>x.excl);if(ex){ex.heat=Math.max(1,(ex.heat||2)-1);}return done(-3,'정보 교환',{},'말을 섞다 보니 내가 쥔 아이템 얘기만 흘렸다. 찜찜하다.');}},
   peer:{label:'서로 기사 초고를 봐 준다',sub:'다음 기사 완성도↑ · 관계↑',fn:()=>{S.peerRev={n:c.name,b:R(2,5)};return done(6,'초고 교환',{},`${jo2(c.name,'과','와')} 초고를 바꿔 읽었다. 서로 빨간 줄이 가득했다.`);}}};
  const base=[opts[3]].concat(shuffle([opts[0],opts[1],opts[2],opts[4]]).slice(0,2));const spc=SP[c.role];const ch2=spc?[spc].concat(base):base;
  openModal(`${c.name} · ${colRole(c)}`,`<p class="lede">${esc(CROLE[c.role].d)}. 성격은 ${PERS[c.pers].n}.</p><p>지금 관계: <b>${relLabel(c.rel)}</b> (${Math.round(c.rel)}) · ${CROLE[c.role].perk}</p>${c.role==='boss'?`<p class="hint">성향: ${esc(prefTxt(c))}</p>`:''}${c.hist.length?`<ul class="feed">${c.hist.map(h=>`<li>${esc(h)}</li>`).join('')}</ul>`:''}`,ch2.concat([{label:'다음에',cls:'ghost'}]));
}
const COL_EVENTS=[
 {w:2,c:()=>colBy('peer'),run:()=>{const c=colBy('peer');openModal('동기의 결혼식',`<p class="lede">입사 동기 ${jo2(c.name,'이','가')} 청첩장을 내밀었다. "꼭 와야 돼."</p>`,[{label:'축의금 10만 원 들고 간다',fn:()=>{relUp(c,12,'결혼식 참석');toast(apply({money:-10,hp:-3}));}},{label:'5만 원만 보낸다',fn:()=>{relUp(c,3,'축의금만');toast(apply({money:-5}));}},{label:'마감 때문에 못 간다',fn:()=>{relUp(c,-8,'결혼식 불참');}}]);}},
 {w:2,c:()=>S.rank>=1&&S.rank<=3&&S.clips.length>0&&S.clips.some(x=>x.turn>=S.turn-3)&&(colBy('senior')||colBy('boss')),run:()=>{const c=pick([colBy('senior'),colBy('boss')].filter(Boolean));const cl=S.clips.find(x=>x.turn>=S.turn-3);openModal('바이라인 공동 표기',`<p class="lede">${c.name} ${colRole(c)}: "「${esc(cl.h)}」 말이야, 내가 방향 잡아 준 거잖아. 이름 같이 올리자."</p>`,[{label:'양보한다',sub:'관계 크게↑, 평판 조금↓',fn:()=>{relUp(c,14,'바이라인 양보');cl.by=`${S.name}·${c.name}`;toast(apply({fame:-.6}));}},{label:'정중히 거절한다',sub:'관계↓',fn:()=>{relUp(c,-12,'바이라인 거절');toast(apply({trust:.5}));}}]);}},
 {w:2,c:()=>{const c=colBy('rivalpeer');return c&&c.rel<15;},run:()=>{const c=colBy('rivalpeer');openModal('뒷말',`<p class="lede">경쟁 동기 ${jo2(c.name,'이','가')} 회식 자리에서 내 기사를 두고 "그거 보도자료 베낀 거잖아"라고 했다는 말이 들린다.</p>`,[{label:'직접 찾아가 따진다',fn:()=>{if(chance(.5)){relUp(c,10,'오해를 풀었다');toast('오해를 풀었다. 의외로 말이 통한다');}else{relUp(c,-8,'말다툼');toast(apply({eval:-.5}));}}},{label:`${bossT()}에게 넌지시 말한다`,fn:()=>{relUp(colBy('boss'),3,'고충 상담');relUp(c,-10,'고자질');}},{label:'기사로 보여주면 된다',sub:'무시',fn:()=>toast(apply({eval:-1}))}]);}},
 {w:2,c:()=>{const c=colBy('peer');return c&&c.rel>=30&&S.rank>=1&&S.rank<=3;},run:()=>{const c=colBy('peer');const it=makeItem(S.dept,{excl:true,pre:1});openModal('동기의 귀띔',`<p class="lede">${c.name}: "이거 우리 부서 일은 아닌데, 너희 쪽 얘기 같더라." → 「${esc(it.title)}」</p>`,[{label:'고맙게 받는다',fn:()=>{S.items.push(it);relUp(c,3,'정보 공유');}},{label:'"나중에 꼭 갚을게" 밥 약속',sub:'통장 -3만',fn:()=>{S.items.push(it);relUp(c,8,'정보 공유와 밥');S.money-=3;}}]);}},
 {w:2,c:()=>colBy('boss')&&S.rank<=3,run:()=>{const c=colBy('boss');openModal('부장의 호출',`<p class="lede">밤 9시. ${c.name} 부장: "어디야? 다들 모여 있어. 한잔하자."</p>`,[{label:'간다',sub:'체력 -12',fn:()=>{relUp(c,8,'호출 술자리');toast(apply({hp:-12}));}},{label:'"취재 중입니다" 핑계',fn:()=>{relUp(c,-5,'호출 거절');}}]);}},
 {w:1,c:()=>colBy('photo'),run:()=>{const c=colBy('photo');openModal(`${colRole(c)}의 부상`,`<p class="lede">${c.name} ${jo2(colRole(c),'이','가')} 현장에서 장비를 메고 넘어져 깁스를 했다.</p>`,[{label:'병문안을 간다',sub:'체력 -3',fn:()=>{relUp(c,12,'병문안');toast(apply({hp:-3}));}},{label:'문자로 안부만',fn:()=>relUp(c,2,'안부 문자')}]);}},
 {w:1,c:()=>colBy('editor')&&S.clips.length&&!isTV(),run:()=>{const c=colBy('editor');openModal('제목 다툼',`<p class="lede">편집기자 ${c.name}: "제목 좀 세게 바꿨어. 이래야 읽혀."</p>`,[{label:'받아들인다',fn:()=>{relUp(c,8,'제목 수용');toast(apply({trust:-.5}));}},{label:'원래 제목을 고집한다',fn:()=>{relUp(c,-6,'제목 고집');toast(apply({trust:1}));}}]);}},
 {w:2,c:()=>colBy('junior')&&S.rank>=2,run:()=>{const c=colBy('junior');openModal('후배의 실수',`<p class="lede">후배 ${jo2(c.name,'이','가')} 기사 속 숫자를 틀렸다. 아직 아무도 모른다.</p>`,[{label:'조용히 고치고 감싸 준다',sub:'관계 크게↑',fn:()=>{relUp(c,15,'실수 감싸줌');toast(apply({eval:-.5}));}},{label:'원칙대로 정정 보고',sub:'신뢰↑',fn:()=>{relUp(c,-8,'원칙대로 보고');toast(apply({trust:1.5}));}}]);}},
 {w:1,c:()=>colBy('union'),run:()=>{const c=colBy('union');openModal('노조 서명',`<p class="lede">노조 위원장 ${jo2(c.name,'이','가')} "편집국장 임명동의제 도입" 서명지를 내밀었다.</p>`,[{label:'서명한다',fn:()=>{relUp(c,10,'서명');relUp(colBy('boss'),-3,'노조 서명');toast(apply({trust:1}));}},{label:'정중히 거절한다',fn:()=>relUp(c,-8,'서명 거절')}]);}},
 {w:1,c:()=>(S.cols||[]).length>=5,run:()=>{const c=pick(S.cols.filter(x=>x.role!=='boss'&&x.role!=='cap'));if(!c)return closeModal();openModal('송별회',`<p class="lede">${c.name} ${jo2(colRole(c),'이','가')} 다른 회사로 옮긴다. 오늘이 마지막 날이다.</p>`,[{label:'송별회에 끝까지 남는다',fn:()=>{toast(apply({hp:-8,net:.6}));if(c.rel>=50&&S.atOutlet>=48){S.flags.colOffer=1;}swapCol(c);}},{label:'선물만 건넨다',fn:()=>{swapCol(c);}}]);}},
 {w:2,c:()=>(S.cols||[]).some(x=>x.rel<=-20),run:()=>{const c=S.cols.find(x=>x.rel<=-20);const bs=colBy('boss');const safe=bs&&bs.rel>=40;openModal('투서',`<p class="lede">감사실에 나를 겨냥한 익명 투서가 들어갔다. 취재비 사용을 문제 삼았다. 보낸 사람이 ${c.name}라는 소문이다.</p>`,[{label:'영수증을 들고 소명한다',fn:()=>{toast(apply(safe?{eval:.5}:{eval:-2,hp:-6}));if(safe)log(`${bs.name} ${jo2(colRole(bs),'이','가')} 감사실에 나를 변호해 줬다`);}},{label:`${jo2(c.name,'을','를')} 찾아가 화해한다`,fn:()=>{relUp(c,18,'화해');toast(apply({eval:-1}));}}]);}},
 {w:1,c:()=>(S.cols||[]).length>=4,run:()=>{const c=pick(S.cols);openModal('육아휴직 대체',`<p class="lede">${c.name} ${jo2(colRole(c),'이','가')} 육아휴직에 들어간다. 그 출입처를 석 달간 누가 맡을지 정해야 한다.</p>`,[{label:'내가 맡는다',sub:'체력 -10, 관계·평가↑',fn:()=>{relUp(c,14,'휴직 공백 메움');toast(apply({hp:-10,eval:1.5}));}},{label:'"저도 벅찹니다"',fn:()=>relUp(c,-4,'대체 거절')}]);}},
 {w:1,c:()=>(S.cols||[]).length>=4,run:()=>openModal('사내 체육대회',`<p class="lede">창사 기념 체육대회. 족구에 부서 명예가 걸렸다.</p>`,[{label:'열심히 뛴다',sub:'체력 -8, 모두와 관계↑',fn:()=>{S.cols.forEach(c=>relUp(c,3));toast(apply({hp:-8}));}},{label:'응원석에서 박수만',fn:()=>{S.cols.forEach(c=>relUp(c,1));}},{label:'취재 핑계로 빠진다',fn:()=>{S.cols.forEach(c=>relUp(c,-2));toast(apply({hp:5}));}}])},
 {w:2,c:()=>colBy('rivalpeer')&&S.rank>=1,run:()=>{const c=colBy('rivalpeer');const up=chance(.5);openModal(up?'경쟁 동기의 승진':'경쟁 동기의 단독',`<p class="lede">${up?`경쟁 동기 ${jo2(c.name,'이','가')} 먼저 좋은 보직을 받았다는 소식.`:`경쟁 동기 ${jo2(c.name,'이','가')} 1면 단독을 냈다. ${jo2(bossT(),'이','가')} "봤지?"라며 내 쪽을 본다.`}</p>`,[{label:'진심으로 축하한다',fn:()=>{relUp(c,10,'축하');}},{label:'자극받아 이를 악문다',sub:'취재력↑',fn:()=>{relUp(c,-3,'경쟁심');toast(apply({inv:.6,hp:-4}));}}]);}}
];
function swapCol(c){const role=c.role;S.cols=S.cols.filter(x=>x!==c);const n=mkCol(role,R(0,15));S.cols.push(n);log(`${c.name} ${colRole(c)} 퇴사, 후임 ${n.name}`);}
const safeRun=e=>()=>{let ok=true;try{ok=e.c();}catch(x){ok=false;}if(ok)return e.run();closeModal();};
function pickColEvent(){const el=COL_EVENTS.filter(e=>{try{return e.c()&&fOk(e);}catch(x){return false;}});if(!el.length)return null;let t=el.reduce((a,e)=>a+e.w,0)*Math.random();for(const e of el){t-=e.w;if(t<=0)return e;}return el[0];}