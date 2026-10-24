/* 바이라인 1.6 — src/compat/v14.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */



// ===================== 1.3 소유 구조 · 미디어그룹 · 계열사 · 편집국장/사장/회장 선출 =====================
// ---- 소유 유형 ----
const OWN_T={
 chaebol:{n:'대기업 계열',d:'그룹이 대주주다. 계열사 광고가 든든하지만, 그룹을 건드리는 기사엔 위에서 전화가 온다',s6:'appoint',s7:'owner',grp:1},
 family:{n:'사주 일가',d:'창업주 일가가 지분 대부분을 쥐고 있다. 인사는 사주 뜻대로다',s6:'appoint',s7:'owner',grp:1},
 localco:{n:'지역 기업 소유',d:'지역 건설·유통 기업이 대주주다. 지역 개발 기사가 늘 민감하다',s6:'appoint',s7:'owner',grp:1},
 private:{n:'민영 (분산 지분)',d:'여러 주주가 지분을 나눠 가졌다. 편집국장은 기자들의 임명동의를 받아야 하고, 사장은 이사회가 뽑는다',s6:'consent',s7:'board'},
 member:{n:'사원·독자 주주',d:'구성원과 독자가 주인이다. 편집국장은 기자 직선, 사장은 주주 이사회가 뽑는다',s6:'direct',s7:'board'},
 found:{n:'재단·비영리',d:'재단 이사회가 회사를 맡는다. 편집국장은 임명동의, 사장은 이사회 표결',s6:'consent',s7:'board'},
 public:{n:'공영·공적 지분',d:'정부와 공공 지분이 섞여 있다. 사장은 여야가 추천한 이사들이 공모로 뽑는다',s6:'consent',s7:'public'},
 indep:{n:'독립 매체',d:'외부 대주주가 없다. 편집국장은 구성원 투표로, 대표는 주주 이사회가 정한다',s6:'direct',s7:'board'},
 founder:{n:'창업자 소유',d:'내가 세운 회사다. 지분을 지키는 한 경영권은 내 것이다',s6:'none',s7:'none'}};
const SEL_N={appoint:'대주주 임명',consent:'대주주 지명 + 기자 임명동의 투표',direct:'기자 직선',owner:'대주주 지명',board:'이사회 표결',public:'여야 추천 이사회 공모',none:'내가 정한다',heir:'사주 일가 세습',fixed:'그룹 총수가 정한다 (자리가 비어야 열린다)'};
// ---- 미디어그룹: 자매 언론사 ----
const MGRP={
 daehan:{n:'대한미디어그룹',m:['daehan','daehantv','monthlydh'],biz:['대한문화재단','대한레저개발','대한인쇄'],chair:'heir',base:'대한'},
 jungang:{n:'중앙미디어그룹',m:['jungang','hangyeol'],biz:['중앙문화센터','중앙엠앤씨'],chair:'fixed'},
 kyungje:{n:'경제신보미디어그룹',m:['kyungje','mbx','econweekly'],biz:['경제신보 아카데미','경제신보 리서치'],chair:'board',base:'경제신보'},
 seoulsibo:{n:'서울시보미디어',m:['seoulsibo','sibotv'],biz:[],chair:null,base:'서울시보'}};
function grpOf(id){id=id||(S&&S.outlet);if(!id)return null;for(const k in MGRP)if(MGRP[k].m.includes(id))return k;return null;}
function sisOf(id){const g=grpOf();return !!(g&&id&&id!==S.outlet&&MGRP[g].m.includes(id));}
function sisList(){const g=grpOf();return g?MGRP[g].m.filter(x=>x!==S.outlet).map(x=>OUTLETS.find(o=>o.id===x)).filter(Boolean):[];}
function ownKey(o){o=o||OUT();if(!o)return 'private';if(o.id==='mine'||/창업자/.test(o.own||''))return 'founder';const g=grpOf(o.id);let w=String(o.own||'');if(g){const h=OUTLETS.find(x=>x.id===MGRP[g].m[0]);if(h)w=h.own;}
  if(/대기업/.test(w))return 'chaebol';if(/가족/.test(w))return 'family';if(/지역 기업|지역 민영/.test(w))return 'localco';if(/계열/.test(w))return 'family';if(/사원|국민주주|독자 주주/.test(w))return 'member';if(/재단|비영리|협회/.test(w))return 'found';if(/공영|공적|공기업|정부/.test(w))return 'public';if(/독립/.test(w))return 'indep';return 'private';}
const OWN_BASES=['태산','한결','대성','동방','미래','누리','가람'];const OWN_SUF='그룹|건설|전자|유통|화학|식품|제약|캐피탈|레저|개발|에너지|레미콘|문화재단|엠앤씨|인쇄|리서치';
function hashS(t){let h=0;for(const ch of String(t))h=(h*31+ch.charCodeAt(0))>>>0;return h;}
function ownEnsure(){if(!S||!S.outlet||S.phase!=='game'&&S.phase!=='create')return S&&S.own||null;if(S.own&&S.own.oid===S.outlet){const W0=S.own;if(W0.k==='founder'&&S.investor===2&&!W0.base){const base=OWN_BASES[hashS(S.name||'x')%OWN_BASES.length];W0.base=base;W0.grp=base+'그룹 (전략 투자사)';W0.affs=[base+'전자',base+'유통'];}return W0;}const o=OUT();if(!o)return null;
  S.owns=S.owns||{};if(S.own&&S.own.oid&&S.own.oid!==S.outlet){ownLeave(S.own);S.owns[S.own.oid]=S.own;}
  const sv=S.owns[S.outlet];if(sv){delete S.owns[S.outlet];S.own=sv;ownReturn(sv);return sv;}
  const k=ownKey(o),T=OWN_T[k],g=grpOf(o.id);
  const W={oid:o.id,k,rel:R(5,15),hit:0,kill:0,vow:0,t0:S.turn,sis:R(5,20),mg:g};
  if(T.grp){const h=hashS(o.id);let base;
    if(k==='chaebol'){base=OWN_BASES[h%OWN_BASES.length];W.grp=base+'그룹';W.affs=[base+'건설',base+'전자',base+'유통',base+'캐피탈'].filter((x,i)=>i<3+(h%2));}
    else if(k==='family'){base=g&&MGRP[g].base?MGRP[g].base:(o.n.slice(0,2));W.grp=`사주 일가 (${g?MGRP[g].n:o.n})`;W.affs=[base+'레저개발',base+'문화재단',base+'인쇄'];}
    else{base=['동성','삼정','청솔','대륙','금강','한라'][h%6];W.grp=base+'건설';W.affs=[base+'건설',base+'개발',base+'레미콘'];}
    W.base=base;}
  if(g){W.affs=(W.affs||[]).concat(MGRP[g].biz).filter((x,i,a)=>a.indexOf(x)===i);}
  if(k==='founder'&&S.investor===2){const base=OWN_BASES[hashS(S.name||'x')%OWN_BASES.length];W.base=base;W.grp=base+'그룹 (전략 투자사)';W.affs=[base+'전자',base+'유통'];}
  if(g&&S.grpOwn&&S.grpOwn[g]!=null)W.rel=S.grpOwn[g];S.own=W;return W;}
function ownTxt(){const W=ownEnsure();return W?OWN_T[W.k]:OWN_T.private;}
function ownRel(v,why){const W=ownEnsure();if(!W)return;W.rel=clamp(Math.round(W.rel+v),-100,100);if(W.mg){S.grpOwn=S.grpOwn||{};S.grpOwn[W.mg]=W.rel;}if(why)log(`대주주 관계 ${v>0?'+':''}${Math.round(v)} — ${why}`);}
function ownRe(){const W=ownEnsure();if(!W||!W.base)return null;const extra=sisList().map(o=>o.n.replace(/[()]/g,'')).join('|');return new RegExp(`${W.base}(${OWN_SUF})${extra?'|'+extra:''}`);}
function ownHit(it){const re=ownRe();return !!(re&&it&&re.test((it.title||'')+' '+(it.subj||'')));}
// ---- 기사 쓰기 전에: 대주주·계열사·자매사를 건드리는 기사엔 전화가 온다 ----
function ownGate(it,cb){try{const W=ownEnsure();const T=W&&OWN_T[W.k];
  if(W&&T&&(T.grp||(W.k==='founder'&&W.base))&&!S.story&&S.rank>=1&&!it.pos&&!it._ownOK&&ownHit(it)){
    const fd=W.k==='founder';const who=fd?'투자사 측 이사':S.rank<=3?'부장':S.rank<=5?'편집국장':'대주주 비서실';
    const head=fd?`전략 투자사 쪽 이사가 전화했다. "${esc(W.grp.replace(/ \(.*\)/,''))} 얘기는 이사회에서 먼저 보시죠."`:S.rank<=3?`${jo2(who,'이','가')} 부른다. "위에서 전화가 왔다. ${esc(it.title.slice(0,18))}… 이거 계열사 얘기잖아."`:`${who}에서 직접 연락이 왔다. "그룹 일입니다. 사장님도 알고 계세요."`;
    openModal('대주주 쪽 전화',`<p class="lede">${head}</p><p class="hint">대주주 관계 ${Math.round(W.rel)} · 대주주를 건드리면 편집국장·사장 선출에 불리하다. 접으면 신뢰가 깎이고 기자들이 안다.</p>`,[
      {label:'그대로 쓴다',sub:W.vow?'약속을 깬다 — 대주주가 배신으로 기억한다 · 신뢰·평판↑':'대주주 관계 크게↓ · 신뢰·업계 평판↑',fn:()=>{it._ownOK=1;W.hit++;S.ownHitTot=(S.ownHitTot||0)+1;S.ownHitT=S.turn;ownRel(-R(14,22));if(W.vow){W.vow=0;W.betray=(W.betray||0)+1;ownRel(-12);log('대주주와의 약속을 깼다');}if(fd){const c=colBy('invdir');if(c)relUp(c,-12,'투자사 계열 비판');}toast(apply({trust:.8,fame:.6}));valN('ind',2,'대주주 계열사를 비판했다');setTimeout(()=>adGate(it,cb),30);return false;}},
      {label:'표현을 누그러뜨린다',sub:'대주주 관계 조금↓ · 파급력↓',fn:()=>{it._ownOK=1;it.imp=Math.round((it.imp||30)*.8);ownRel(-4);setTimeout(()=>adGate(it,cb),30);return false;}},
      {label:'기사를 접는다',sub:'대주주 관계↑ · 신뢰↓ · 기자들이 안다',fn:()=>{S.items=S.items.filter(x=>x!==it);W.kill++;ownRel(R(8,12));toast(apply({trust:-2}));valN('ind',-3,'대주주 기사를 접었다');try{deptPeople().forEach(m=>mRel(m,-2));relUp(colBy('union'),-6,'기사를 접었다');}catch(e){}log(`「${it.title}」 — 대주주 계열 기사라 접었다`);}}]);
    return;}}catch(e){console.error(e);}
  return adGate(it,cb);}
// ---- 자리(임기): 편집국장·사장·회장은 회사마다 한 명 ----
function edTermW(){return Math.round(YW*2);}
function seatEnsure(){const W=ownEnsure();if(!W)return null;if(!W.seat){const L=S.lead&&S.leadOut===S.outlet?S.lead:null;W.seat={ed:{n:L?L.chief:rname(),end:S.turn+R(4,edTermW())},ceo:{n:L?L.ceo:rname(),end:S.turn+R(12,ceoTermW())},chair:null};}
  W.seat.chair=chairSeat();
  if(S.edDone==null)S.edDone=(S.edEver&&S.rank!==6)?(S.edTerms||1):0;
  const st=W.seat;if(S.rank===6&&!st.ed.me){st.ed={n:S.name,me:1,end:S.turn+edTermW()};S.edEver=1;}if(S.rank!==6&&st.ed.me)st.ed={n:rname(),end:S.turn+edTermW()};
  if(S.rank===7&&!S.founder&&!st.ceo.me)st.ceo={n:S.name,me:1,end:S.turn+ceoTermW()};if(S.rank!==7&&st.ceo.me)st.ceo={n:rname(),end:S.turn+ceoTermW()};
  try{S.lead=S.lead||{};if(S.leadOut===S.outlet){if(!st.ed.me)S.lead.chief=st.ed.n;if(!st.ceo.me)S.lead.ceo=st.ceo.n;}const b=colBy('boss');if(b&&(S.rank===4||S.rank===5))b.name=st.ed.n;if(b&&S.rank===6)b.name=st.ceo.n;}catch(e){}
  return st;}
function seatName(t){return t===8?'그룹 회장':t===7?rankName(7):rankName(6);}
function prevRank(r){const ch=rankChain();const i=ch.indexOf(r);return i>0?ch[i-1]:r;}
function chairWay(){const g=grpOf();return g?MGRP[g].chair:null;}
function selOf(t){const T=ownTxt();if(t===8){const c=chairWay();return c==='board'?'board':'appoint';}return t>=7?T.s7:T.s6;}
function electOn(t){return !!(S&&!S.story&&!S.founder&&!S.simple&&(t===6||t===7||t===8)&&selOf(t)!=='none');}
// ---- 출마 조건 ----
function elReqs(t){const L=[];const ok=(c,tx)=>{if(!c)L.push(tx);};
  if(t===6){ok(S.inRank>=promoMinW(S.rank),`재직 ${moTxt(S.inRank)}/${moTxt(promoMinW(S.rank))}`);ok(S.eval>=promoEv(S.rank),`${evalName()} ${Math.round(S.eval)}/${promoEv(S.rank)}`);ok(S.fame>=promoFm(S.rank),`평판 ${Math.round(S.fame)}/${promoFm(S.rank)}`);try{promoReqs(S.rank).filter(x=>!x.ok).forEach(x=>L.push(x.t));}catch(e){}}
  if(t===7){const ev=promoEv(6)+3,fm=promoFm(6)+4;ok((S.edDone||0)>=1,`${rankName(6)} 임기를 한 번 이상 마치기`);ok(S.eval>=ev,`${evalName()} ${Math.round(S.eval)}/${ev}`);ok(S.fame>=fm,`평판 ${Math.round(S.fame)}/${fm}`);ok(S.trust>=58,`신뢰 ${Math.round(S.trust)}/58`);ok(myAge()+3<=retireAge(),'정년까지 3년 이상');}
  if(t===8){const W=ownEnsure();ok(S.rank===7&&((S.ceoTerm||1)>=2||S.inRank>=YW),'사장 1년 이상');ok(S.eval>=75,`${evalName()} ${Math.round(S.eval)}/75`);ok(S.fame>=72,`평판 ${Math.round(S.fame)}/72`);ok(S.trust>=60,`신뢰 ${Math.round(S.trust)}/60`);if(W&&OWN_T[W.k].grp)ok(W.rel>=55,`대주주 관계 ${Math.round(W.rel)}/55`);}
  return L;}
// ---- 정기 인사에서 선출로 넘긴다 ----
function elJinsa(parts){if(S.story||S.founder||S.simple)return false;const st=seatEnsure();if(!st)return false;const nx=nextRank(S.rank);const T=ownTxt();
  const show=extra=>{openModal('정기 인사 발표',parts.join('')+extra);return true;};
  // 사장 자리: 편집국장을 한 번 이상 지낸 사람만
  if(S.rank>=3&&S.rank<6&&(S.edDone||0)>=1&&electOn(7)){if(st.ceo.end<=S.turn){const lack=elReqs(7);if(lack.length){const nm=rname();const act=!st.ceo.act;st.ceo={n:nm,end:S.turn+(act?24:ceoTermW()),act:act?1:0};if(S.lead)S.lead.ceo=nm;tick(`${OUT().n} 사장${act?' 직무대행':''}에 ${nm}`);return show(`<p>사장 자리가 비었지만 출마 조건이 모자라다. 부족: ${lack.join(', ')}</p><p>${act?`<b>${esc(nm)}</b>${jo2(nm,'이','가').slice(nm.length)} 반년 동안 사장 직무대행을 맡는다.`:`이번엔 <b>${esc(nm)}</b>${jo2(nm,'이','가').slice(nm.length)} 정식으로 맡았다.`}</p><p class="hint">다음 사장 선출은 ${dateStr(st.ceo.end)}.</p>`);}
      if(parts.length)Q.push(()=>openModal('정기 인사',parts.join('')));Q.push(()=>electStart(7,{}));closeModal();return true;}
  }
  if(S.rank===6&&electOn(7))return show(`<p>사장 출마는 ${rankName(6)} 임기를 마친 뒤에 할 수 있다. 내 임기는 ${dateStr(st.ed.end)}까지, ${rankName(7)} ${esc(st.ceo.n)}의 임기는 ${dateStr(st.ceo.end)}까지다.</p>`);
  if(nx===6&&electOn(6)){if(st.ed.end>S.turn){if(S.inRank>=promoMinW(S.rank)*.8)return show(`<p>${rankName(6)} ${esc(st.ed.n)}의 임기는 ${dateStr(st.ed.end)}까지다. 자리는 그때 열린다. (${SEL_N[T.s6]})</p>`);return false;}
    const lack=elReqs(6);if(lack.length){if(S.inRank<promoMinW(S.rank)*.8){st.ed={n:rname(),end:S.turn+edTermW()};return false;}const nm=rname();const act=!st.ed.act;st.ed={n:nm,end:S.turn+(act?24:edTermW()),act:act?1:0};tick(`${OUT().n} ${rankName(6)}${act?' 직무대행':''}에 ${nm}`);return show(`<p>${rankName(6)} 자리가 비었지만 출마 조건이 모자라다. 부족: ${lack.join(', ')}</p><p>${act?`<b>${esc(nm)}</b>${jo2(nm,'이','가').slice(nm.length)} 반년 동안 직무대행을 맡는다. 그 사이 조건을 채우면 다음 인사 때 나설 수 있다.`:`이번엔 <b>${esc(nm)}</b>${jo2(nm,'이','가').slice(nm.length)} 정식으로 맡았다.`}</p><p class="hint">다음 선출은 ${dateStr(st.ed.end)}.</p>`);}
    if(parts.length)Q.push(()=>openModal('정기 인사',parts.join('')));Q.push(()=>electStart(6,{}));closeModal();return true;}
  return false;}
// ---- 선출 엔진: 표를 가진 사람마다 자기 셈법으로 고른다 ----
const EL_INT={indep:'편집권 독립',pay:'처우 개선',scoop:'탐사·특종',safe:'안정·정확',digital:'디지털 혁신',post:'자리'};
function elRec(int){const W=ownEnsure()||{};switch(int){case 'indep':return clamp((S.resist||0)*2+(W.hit||0)*3-(W.kill||0)*5+(S.trust-55)/4,-10,12);case 'scoop':return clamp((S.tokjong||0)*3+(S.scoops||0)*.4+(S.awards||0)*2,0,12);case 'pay':return (S.payLv||1)>1?3:0;case 'safe':{const e=(S.errT||[]).filter(t=>t>S.turn-YW*2).length;return clamp(6-e*4,-8,6);}case 'digital':return S.co&&(S.co.dig||0)>0?4:0;default:return 0;}}
function elProfit(){const p=S.co&&S.co.last&&S.co.last.profit;return clamp((p||0)*3,-8,8);}
function elBase(t){return ({easy:-1,normal:2,hard:5}[S.diff]??2)+(t===7?4:t===8?7:0);}
function elRival(t,re){const cam=S.world?S.world.ruling:'cons';const sty=pick(['own','indep','pay','scoop','digital','safe']);const rk=t===8?'그룹 부회장':t===7?'전무':isTV()?'보도국 부국장':'편집부국장';
  return {name:rname(),rk,sk:R(56,70)+(t>=7?4:0)+(t===8?4:0),sty,ownRel:R(t===8?55:20,t===8?80:45),camp:Math.random()<.7?cam:(cam==='cons'?'prog':'cons')};}
function elVoters(t,how){const V=[];const W=ownEnsure()||{rel:0};const add=o=>V.push(Object.assign({mom:0,mR:0,w:1,nz:R(-6,6)},o));const ints=['indep','pay','scoop','safe','digital','post'];
  if(how==='direct'||how==='consent'){const roles=['cap','photo','editor','boss','peer','rivalpeer','senior','union','junior'];
    (S.cols||[]).filter(c=>roles.includes(c.role)).forEach(c=>add({n:`${c.name} · ${colRole(c)}`,rel:c.rel||0,rr:R(5,35)+(c.role==='rivalpeer'?18:0)+(c.role==='boss'?8:0),int:c.role==='union'?'pay':pick(ints),ref:c,role:c.role,w:c.role==='union'?2:1}));
    deptPeople().filter(m=>m&&m.name!==S.name).slice(0,8).forEach(m=>add({n:`${m.name} 기자`,rel:m.rel??20,rr:R(5,35),int:pick(ints),ref:m,w:1}));
    const hist=new Set(S.deptHist||[]);const D=OUT().depts.filter(d=>d!==S.dept&&DEPTS[d]&&!(typeof isRegD==='function'&&isRegD(d))).slice(0,9);
    D.forEach(d=>add({n:`${DEPTS[d].n} 기자들`,bloc:1,rel:(hist.has(d)?R(14,28):R(-4,12))+clamp((S.fame-45)*.3,-6,10),rr:R(8,28),int:pick(ints.slice(0,5)),w:clamp(Math.round((OUT().staff||40)/Math.max(1,D.length)/6),2,6)}));
    // 전국부·주재기자도 한 표: 주재기자들과의 관계 평균, 전국부를 거쳤으면 가깝다
    try{const CR=corrs();if(CR.length>=3){const avg=CR.reduce((x,m)=>x+(m.rel||0),0)/CR.length;const inReg=[...hist].some(d=>isRegD(d))||isRegD(S.dept);add({n:'전국부·주재기자들',bloc:1,reg:1,rel:avg*.6-3+(inReg?16:0)+clamp((S.fame-45)*.3,-6,10),rr:R(8,28),int:pick(['post','pay','safe']),w:clamp(Math.round(CR.length/5),1,5)});}}catch(e){}}
  else if(how==='appoint'||how==='owner'){add({n:W.k==='family'?'사주 (회장)':W.k==='localco'?`대주주 ${W.grp||''}`:`대주주 (${W.grp||'그룹'} 회장실)`,dec:'owner',w:1,rel:W.rel,rr:0,int:'own'});}
  else if(how==='board'){const k=(ownEnsure()||{}).k;const own=k==='member'?'사원주주 대표 이사':k==='found'?'재단 몫 이사':'최대주주 측 이사';
    for(let i=0;i<2;i++)add({n:`${rname()} (${own})`,dec:k==='member'?'member':'owner',rel:k==='member'?avgRel():W.rel,rr:R(15,35),int:'own'});
    for(let i=0;i<2;i++)add({n:`${rname()} (사외이사)`,dec:'outside',rel:R(0,20),rr:R(10,30),int:'safe'});
    add({n:`${rname()} (노조 추천 이사)`,dec:'labor',rel:(colBy('union')||{rel:10}).rel,rr:R(10,30),int:'pay'});
    add({n:`${rname()} (${k==='member'?'독자위원 몫 이사':'재무 담당 이사'})`,dec:k==='member'?'reader':'finance',rel:R(0,20),rr:R(10,30),int:k==='member'?'indep':'safe'});
    add({n:`${rname()} (${k==='found'?'재단 이사장':'상임이사'})`,dec:'owner',rel:W.rel,rr:R(20,40),int:'own'});}
  else if(how==='public'){const ru=S.world?S.world.ruling:'cons',op=ru==='cons'?'prog':'cons';
    for(let i=0;i<5;i++)add({n:`${rname()} (여권 추천 이사)`,dec:'camp',camp:ru,rel:R(-5,15),rr:R(10,30),int:'own'});
    for(let i=0;i<3;i++)add({n:`${rname()} (야권 추천 이사)`,dec:'camp',camp:op,rel:R(-5,15),rr:R(10,30),int:'indep'});
    add({n:`${rname()} (교수·시민사회 몫)`,dec:'outside',rel:R(0,20),rr:R(10,30),int:'indep'});}
  return V;}
function avgRel(){const L=(S.cols||[]).map(c=>c.rel||0).concat(deptPeople().map(m=>m.rel??20));return L.length?L.reduce((a,b)=>a+b,0)/L.length:15;}
function elU(v,E){const W=ownEnsure()||{rel:0,hit:0,vow:0};const G=clamp((S.fame-55)/6+(S.eval-62)/6,-8,8),RG=(E.rv.sk-62)/4+elBase(E.t)+(E.re?-2:0),pf=elProfit();let up=0,ur=0;const cp={},cr={};const P=(k,x)=>{cp[k]=(cp[k]||0)+x;up+=x;},Rr=(k,x)=>{cr[k]=(cr[k]||0)+x;ur+=x;};
  if(v.dec==='owner'){P('rel',W.rel*.75);P('rec',G*.6+pf);P('hit',-(W.hit||0)*4+(W.vow?8:0)-(W.betray||0)*8);P('mom',v.mom);Rr('rel',E.rv.ownRel*.75);Rr('own',5+(E.t===8?8:0));Rr('mom',v.mR);}
  else if(v.dec==='member'){P('rel',avgRel()*.6);P('int',(E.pp.indep?6:0)+(E.pp.pay?4:0));P('rec',G*.5);P('mom',v.mom);Rr('rel',v.rr*.6);Rr('rec',RG*.6);Rr('mom',v.mR);}
  else if(v.dec==='outside'){P('rec',(S.eval-60)*.45+(S.trust-50)*.4+pf*1.3+(S.fame-55)*.3);P('mom',v.mom);Rr('rec',(E.rv.sk-60)*.8+RG*.5);Rr('mom',v.mR);}
  else if(v.dec==='labor'){const u=colBy('union');P('rel',(u?u.rel:10)*.5);P('int',(E.pp.pay?10:0)+(E.pp.indep?4:0)+((S.wMood??60)-60)*.2);P('mom',v.mom);Rr('rel',v.rr*.5);Rr('int',E.rp.pay?8:0);Rr('mom',v.mR);}
  else if(v.dec==='finance'){P('rec',pf*2+(S.co&&S.co.cash>0?5:-8)+(E.pp.pay?-6:0));P('mom',v.mom);Rr('rec',6+(E.rv.sty==='own'?4:0));Rr('mom',v.mR);}
  else if(v.dec==='reader'){P('int',(S.trust-55)*.5+(E.pp.indep?8:0));P('mom',v.mom);Rr('rec',RG*.5);Rr('mom',v.mR);}
  else if(v.dec==='camp'){P('camp',((S.rep&&S.rep[v.camp])||0)*.5+(S.trust-55)*.3+(E.pp.indep?(v.camp===(S.world||{}).ruling?-4:6):0));P('rec',G*.4);P('mom',v.mom);Rr('camp',E.rv.camp===v.camp?9:3);Rr('mom',v.mR);}
  else{P('rel',v.rel*.5);P('int',(E.pp[v.int]?10:0)+elRec(v.int)*.6);P('rec',G);P('mom',v.mom);if(E.post===v)P('post',22);if(E.unionP&&v.role!=='union')P('union',v.bloc?3:4);
    if(E.how==='consent'){Rr('no',7+(W.kill||0)*4+(v.int==='indep'&&W.vow?8:0));Rr('mom',v.mR);}
    else{Rr('rel',v.rr*.5);Rr('int',(E.rp[v.int]?8:0)+(E.rv.sty===v.int?5:0));Rr('rec',RG);Rr('mom',v.mR);if(E.unionR&&v.role!=='union')Rr('union',v.bloc?3:4);}}
  if(E.scout)P('rec',3);
  up+=v.nz+(E.sw||0);ur-=v.nz*.5;if(E.t>=7)ur+=4;if(E.t===8)ur+=4;return {up,ur,cp,cr};}
const EL_WHY={rel:'관계',int:'공약',rec:'실적·평판',hit:'대주주 기사 앙금',mom:'선거 운동',own:'대주주 뜻',post:'자리 약속',union:'노조 지침',camp:'진영 셈법',no:'아직 못 믿겠다'};
function elWhy(c){let b=null,bv=-1e9;for(const k in c)if(c[k]>bv){bv=c[k];b=k;}return EL_WHY[b]||'';}
function elTally(E,noise){let p=0,r=0,ab=0;const rows=[];let lead=0;if(noise){let a=0,b=0;E.voters.forEach(v=>{const u=elU(v,E);if(u.up>u.ur)a+=v.w;else b+=v.w;});lead=Math.sign(a-b);}E.voters.forEach(v=>{const u=elU(v,E);let d=u.up-u.ur+(noise?(Math.random()*3-1.5):0);if(noise&&Math.abs(d)<3)d+=lead*1.2;
    if(v.bloc){const sh=1/(1+Math.exp(-d/6));const vp=Math.round(v.w*sh);p+=vp;r+=v.w-vp;rows.push({v,p:vp,r:v.w-vp,why:vp>=v.w-vp?elWhy(u.cp):elWhy(u.cr)});}
    else if(E.how==='direct'&&Math.max(u.up,u.ur)<0){ab+=v.w;rows.push({v,ab:1,why:'둘 다 마뜩잖다'});}
    else if(d>0){p+=v.w;rows.push({v,p:v.w,why:elWhy(u.cp)});}else{r+=v.w;rows.push({v,r:v.w,why:elWhy(u.cr)});}});
  const tot=E.voters.reduce((a,v)=>a+v.w,0);const win=E.how==='consent'?p>=tot*.5:E.how==='direct'?p>r:p>r;return {p,r,ab,tot,rows,win};}
function elBarH(p,tot,lab,cons,sub){const pc=tot?Math.round(p/tot*100):0;return `<div class="elhd"><span>${cons?'찬성':'나'} <b>${p}</b></span><span>${lab||''}</span><span>${cons?'반대':'상대'} <b>${tot-p}</b></span></div><div class="elbar"><i style="width:${pc}%"></i><b style="left:50%"></b></div>${sub?`<p class="hint" style="margin:2px 0 8px">${sub}</p>`:''}`;}
function elForecast(E){const t=elTally(E,false);const acc=clamp(.4+(S.st.net||30)/150,.4,.95);const err=Math.max(1,Math.round((1-acc)*t.tot*.35+t.tot*.04));const ep=clamp(t.p+R(-err,err),0,t.tot);const cons=E.how==='consent';const lab=cons?(ep>=t.tot*.58?'통과 유력':ep>=t.tot*.45?'아슬아슬':'부결 위기'):(ep>t.tot*.58?'우세':ep>=t.tot*.42?'접전':'열세');const col=/유력|우세/.test(lab)?'var(--good)':/열세|위기/.test(lab)?'var(--red)':'var(--sodium)';return elBarH(ep,t.tot,`판세 <b style="color:${col}">${lab}</b>`,cons,`내 정보력으로 본 예상${err?` · 오차 ±${err}표`:''}${cons?` · 과반 ${Math.ceil(t.tot/2)}표 필요`:''}`);}
function elMake(t,re){const how=selOf(t);const E={oid:S.outlet,t,how,re:!!re,rv:elRival(t,re),pp:{},rp:{},left:({easy:4,normal:3,hard:3}[S.diff]||3)-(t===8?1:0),log:[],used:{},sw:R(-7,7)};if(t>=7)E.rv.ownRel+=8;E.voters=elVoters(t,how);try{if(t>=6&&t<=7)rivalAsCand(E);}catch(e){}return E;}
function electStart(t,o){o=o||{};const E=elMake(t,o.re),how=E.how;S.elect=E;E.scout=!!o.scout;E.fromEd=!!o.fromEd;
  const seat=seatName(t);const tot=E.voters.reduce((a,v)=>a+v.w,0);const chip=x=>`<i>${x}</i>`;
  const intro=`<p class="lede">${E.re?`${seat} 임기 끝 — 연임 심사`:`${seat} 자리가 비었다`}</p>${E.rivalMatch?`<p class="warn">상대는 오랜 라이벌 ${esc(E.rv.name)}이다.</p>`:''}<div class="elchips">${chip(SEL_N[how]||how)}${chip(`상대 ${esc(E.rv.name)} · ${E.rv.sty==='own'?'대주주와 가깝다':EL_INT[E.rv.sty]}`)}${chip(`총 ${tot}표`)}${chip(`운동 기회 ${E.left}번`)}</div>${elForecast(E)}<p class="hint">${E.re?`떨어지면 ${ro2(rankName(prevRank(t===6?6:7)))} 돌아간다.`:'떨어지면 상대가 임기 동안 자리를 지킨다.'}</p>`;
  if(how==='consent'&&!o.nom){const nom=elNominate(E);if(!nom){openModal(`${seat} 선출`,intro+`<p class="warn">대주주(이사회)가 <b>${esc(E.rv.name)}</b>를 지명했다.</p>`,[{label:'대주주를 설득한다',sub:'한 번뿐 · 영업력·인맥·대주주 관계',fn:()=>{const W=ownEnsure();if(chance(clamp(.18+(S.st.sal||20)/300+(S.st.net||30)/300+W.rel/200,.08,.7))){toast('지명이 바뀌었다 — 내가 후보다');ownRel(3);setTimeout(()=>elRound(),30);}else{toast('설득하지 못했다');setTimeout(()=>elEnd(false,'지명 실패'),30);}return false;}},{label:'받아들인다',cls:'ghost',fn:()=>{setTimeout(()=>elEnd(false,'지명 실패'),30);return false;}}]);return;}}
  openModal(`${seat} 선출`,intro,[{label:'선거 운동 시작',rec:true,fn:()=>{elRound();return false;}},{label:'출마하지 않는다',cls:'ghost',fn:()=>{setTimeout(()=>elEnd(false,'불출마'),30);return false;}}]);}
function elNominate(E){if(E.re){const W=ownEnsure();const u=W.rel*.6+(S.eval-60)*.5-(W.hit||0)*3+R(-6,6);return u>-4;}const W=ownEnsure();const up=W.rel*.7+(S.eval-60)*.5+(S.fame-55)*.3-(W.hit||0)*3-(W.betray||0)*8+R(-6,6),ur=E.rv.ownRel*.7+6+R(-6,6);return up>ur;}
function elActs(E){const A=[];const nr=E.how==='direct'||E.how==='consent';const W=ownEnsure()||{};
  const swing=E.voters.map(v=>{const u=elU(v,E);return {v,d:u.up-u.ur};}).filter(x=>Math.abs(x.d)<16).sort((a,b)=>(b.v.w-a.v.w)||(Math.abs(a.d)-Math.abs(b.d))).slice(0,4);
  const lean=d=>d>4?'내 쪽':d<-4?'상대 쪽':'반반';
  if(swing.length)A.push({label:nr?'설득하러 간다':'이사를 만난다',sub:`흔들리는 ${swing.length}곳 중 고른다`,fn:()=>{openModal('누구를 만날까',`<p class="hint">관계·친화력·리더십이 높을수록 잘 통한다.</p>`,swing.map(x=>({label:x.v.n,sub:`${x.v.w>1?x.v.w+'표 · ':''}${EL_INT[x.v.int]||'회사 사정'} · 지금 ${lean(x.d)}`,fn:()=>{const pr=clamp(.35+(S.st.cha||30)/250+(S.st.lead||20)/300+(x.v.rel||0)/300+(x.v.dec?(S.st.net||30)/400:0),.15,.85);let m;if(chance(pr)){x.v.mom+=R(8,14);m=`${x.v.n} — 마음이 움직였다`;}else{x.v.mom-=3;m=`${x.v.n} — 오히려 경계한다`;}S.hp=clamp(S.hp-3,0,100);return elAfter(E,m);}})).concat([{label:'뒤로',cls:'ghost',fn:()=>{elRound();return false;}}]));return false;}});
  if(nr){const pl=Object.keys(EL_INT).filter(k=>k!=='post'&&!E.pp[k]);if(pl.length)A.push({label:'공약을 건다',sub:'관심사가 맞는 표가 크게 움직인다',fn:()=>{const cnt={};E.voters.forEach(v=>{cnt[v.int]=(cnt[v.int]||0)+v.w;});openModal('어떤 공약?',`<p class="hint">괄호 안은 그 관심사를 가진 표 수. 당선되면 지켜야 한다.</p>`,pl.map(k=>({label:`${EL_INT[k]} (${cnt[k]||0}표)`,sub:{indep:'대주주 관계↓',pay:'당선 뒤 인건비↑',scoop:'부담 없음',safe:'부담 없음',digital:'부담 없음'}[k],fn:()=>{E.pp[k]=1;if(k==='indep')ownRel(-6);return elAfter(E,`「${EL_INT[k]}」 공약을 걸었다`);}})).concat([{label:'뒤로',cls:'ghost',fn:()=>{elRound();return false;}}]));return false;}});
    if(!E.used.debate)A.push({label:'정책 토론회',sub:'이기면 모든 표↑ · 지면 상대 표↑',fn:()=>{E.used.debate=1;const me=((S.st.kno||30)+(S.st.wri||30)+(S.st.lead||20)+(S.st.int||30))/4+R(-10,10),rv=E.rv.sk+R(-10,10);let m;if(me>=rv){E.voters.forEach(v=>v.mom+=5);m='토론회에서 이겼다는 평';}else{E.voters.forEach(v=>v.mR+=4);m='토론회에서 밀렸다';}return elAfter(E,m);}});
    const u=colBy('union');if(u&&!E.used.union)A.push({label:'노조와 만난다',sub:`위원장 관계 ${Math.round(u.rel)} · 지지하면 표가 따라온다`,fn:()=>{E.used.union=1;let m;if(chance(clamp(.25+u.rel/120+(E.pp.pay?.15:0)+(E.pp.indep?.1:0),.1,.9))){E.unionP=1;m='노조가 나를 지지한다';}else if(u.rel<10){E.unionR=1;m='노조가 상대 쪽으로 기울었다';}else m='노조는 중립';return elAfter(E,m);}});
    const pv=E.voters.filter(v=>!v.bloc&&v.int==='post'&&E.post!==v);if(!E.post&&pv.length)A.push({label:`자리를 약속한다`,sub:`${pv[0].n} · 확실한 한 표 · 소문나면 역풍`,risk:true,fn:()=>{E.post=pv[0];let m=`${pv[0].n}에게 요직을 약속했다`;if(chance(.38)){E.voters.forEach(v=>{if(v!==E.post&&['indep','safe'].includes(v.int))v.mR+=5;});apply({trust:-1});m+=' — 소문이 났다';}return elAfter(E,m);}});}
  else{if(!E.used.plan)A.push({label:'경영 계획 발표',sub:'이기면 모든 표↑',fn:()=>{E.used.plan=1;const me=((S.st.sal||20)+(S.st.kno||30)+(S.st.lead||20))/3+R(-10,10)+elProfit(),rv=E.rv.sk+R(-10,10);let m;if(me>=rv){E.voters.forEach(v=>v.mom+=4);m='경영 계획이 먹혔다';}else{E.voters.forEach(v=>v.mR+=3);m='숫자가 약하다는 지적';}return elAfter(E,m);}});
    if(E.voters.some(v=>v.dec==='owner')&&OWN_T[W.k].grp){A.push({label:'대주주 면담',sub:'대주주 관계↑',fn:()=>{const g=Math.round(R(3,8)*(.8+(S.st.sal||20)/200));ownRel(g);return elAfter(E,`대주주와 독대 (관계 +${g})`);}});
      if(!W.vow)A.push({label:'충성을 약속한다',sub:'대주주 관계↑↑ · 신뢰↓',risk:true,fn:()=>{W.vow=1;ownRel(10);apply({trust:-2});valN('ind',-4,'대주주에게 충성을 약속했다');return elAfter(E,'"그룹 기사는 조심하겠습니다"');}});
      if(!E.used.indep)A.push({label:'소신을 밝힌다',sub:'대주주 관계↓ · 신뢰·평판↑ · 사외이사·노조 몫↑',fn:()=>{E.used.indep=1;ownRel(-8);apply({trust:2,fame:1});E.voters.forEach(v=>{if(['outside','labor','reader'].includes(v.dec))v.mom+=6;});return elAfter(E,'편집권 독립을 공개적으로 말했다');}});}
    if(E.how==='public'&&!E.used.camp)A.push({label:'여권 인사와 접촉',sub:'여권 이사↑ · 야권 이사↓ · 신뢰↓',risk:true,fn:()=>{E.used.camp=1;const ru=(S.world||{}).ruling;E.voters.forEach(v=>{if(v.dec==='camp')v.mom+=v.camp===ru?8:-4;});apply({trust:-1});valN('ind',-2,'정권 쪽 인사와 줄을 댔다');return elAfter(E,'여권 실세와 저녁을 먹었다');}});}
  if(!E.used.neg)A.push({label:'상대 약점을 흘린다',sub:'성공하면 상대 표↓ · 들키면 역풍',risk:true,fn:()=>{E.used.neg=1;let m;if(chance(.45)){E.voters.forEach(v=>v.mR-=6);m=`${E.rv.name}의 옛 정정보도가 돌았다`;}else{E.voters.forEach(v=>v.mom-=5);apply({trust:-1});m='흑색선전 역풍';}return elAfter(E,m);}});
  return A;}
function elRivalAct(E){const W=ownEnsure()||{};{const t=elTally(E,false);if(!E.rvNeg&&t.p>t.r*1.3&&chance(.4)){E.rvNeg=1;if(S.trust>=65){E.voters.forEach(v=>v.mR-=3);return '상대 후보 쪽이 내 옛 정정보도를 돌렸지만 오히려 「흑색선전」 역풍이 불었다';}E.voters.forEach(v=>v.mom-=3);return '상대 후보 쪽이 내 옛 기사 정정 이력을 돌리기 시작했다';}}const owner=E.voters.find(v=>v.dec==='owner');if(owner&&chance(.5)){E.rv.ownRel+=R(3,7);return `상대 후보 ${E.rv.name}도 대주주 쪽을 찾아갔다`;}
  const cand=E.voters.map(v=>{const u=elU(v,E);return {v,d:u.up-u.ur};}).filter(x=>x.d>-4&&x.d<14).sort((a,b)=>b.v.w-a.v.w||a.d-b.d);
  if(cand.length&&chance(.75)){const x=cand[0];x.v.mR+=R(6,11);return `상대 후보 ${jo2(E.rv.name,'이','가')} ${x.v.n} 쪽을 따로 만났다`;}
  const cnt={};E.voters.forEach(v=>{if(v.int&&EL_INT[v.int]&&v.int!=='post')cnt[v.int]=(cnt[v.int]||0)+v.w;});const k=Object.keys(cnt).filter(x=>!E.rp[x]).sort((a,b)=>cnt[b]-cnt[a])[0];if(k){E.rp[k]=1;return `상대 후보 ${jo2(E.rv.name,'이','가')} 「${EL_INT[k]}」 공약을 내걸었다`;}
  return `상대 후보 ${jo2(E.rv.name,'은','는')} 조용히 표를 다졌다`;}
function elAfter(E,m){if(E.lock)return false;E.lock=1;E.left--;const rm=elRivalAct(E);E.log.push(m,rm);setTimeout(()=>openModal(`선거 운동 · 남은 기회 ${E.left}번`,`<p class="lede">${esc(m)}</p><p class="hint">↳ ${esc(rm)}</p>${elForecast(E)}`,[{label:E.left>0?'다음 수':'투표함 열기',rec:true,fn:()=>{if(E.left>0)elRound();else elVote();return false;}}]),30);return false;}
function elRound(){const E=S.elect;if(!E)return;E.lock=0;if(E.left<=0)return elVote();openModal(`선거 운동 · 남은 기회 ${E.left}번`,`${elForecast(E)}<p class="hint">한 번에 하나. 상대도 매번 움직인다.</p>`,elActs(E).concat([{label:'바로 투표',cls:'ghost',fn:()=>{elVote();return false;}}]));return false;}
function elVote(){const E=S.elect;if(!E)return;const t=E.T||(E.T=elTally(E,true));const seat=seatName(E.t);const cons=E.how==='consent';
  const why={p:{},r:{}};t.rows.forEach(x=>{if(x.ab)return;const s=(x.p||0)>=(x.r||0)?'p':'r';why[s][x.why]=(why[s][x.why]||0)+(x.p||0)+(x.r||0);});const wl=o=>Object.entries(o).sort((a,b)=>b[1]-a[1]).slice(0,3).map(([k,n])=>`<i>${esc(k)} ${n}</i>`).join('');
  const rows=t.rows.map(x=>`<li>${esc(x.v.n)}${x.v.w>1?` · ${x.v.w}표`:''} → <b style="color:${x.ab?'var(--mute)':(x.p||0)>=(x.r||0)?'var(--good)':'var(--red)'}">${x.ab?'기권':x.v.bloc?`${x.p}:${x.r}`:x.p?(cons?'찬성':'나'):(cons?'반대':'상대')}</b> <span class="hint">${esc(x.why)}</span></li>`).join('');
  const body=`<p class="lede">${t.win?'이겼다.':'졌다.'}</p>${elBarH(t.p,t.tot-(t.ab||0),cons?`재적 ${t.tot} · 과반 ${Math.ceil(t.tot/2)}`:`${esc(S.name)} 대 ${esc(E.rv.name)}${t.ab?` · 기권 ${t.ab}`:''}`,cons)}${!cons&&t.p===t.r?'<p class="hint">동수면 선임자가 이긴다.</p>':''}<div class="sec">왜 이렇게 찍었나</div><div class="elchips"><b style="font-size:12px;color:var(--good);margin-right:4px">${cons?'찬성':'내 표'}</b>${wl(why.p)||'<i>없음</i>'}</div><div class="elchips"><b style="font-size:12px;color:var(--red);margin-right:4px">${cons?'반대':'상대 표'}</b>${wl(why.r)||'<i>없음</i>'}</div><details class="more"><summary>표 하나하나 보기</summary><ul class="feed">${rows}</ul></details>`;
  openModal(`${seat} 선출 — ${t.win?'당선':'낙선'}`,body,[{label:t.win?'자리에 오른다':'결과를 받아들인다',rec:true,fn:()=>{setTimeout(()=>elEnd(t.win),30);return false;}}]);}
function elEnd(win,why){const E=S.elect;if(!E||E.done)return;E.done=1;S.elect=null;const st=seatEnsure();const W=ownEnsure();
  if(E.rivalMatch&&S.rival){if(win){S.rivalBeat=1;S.rival.wins=Math.max(0,(S.rival.wins||0)-1);(S.rival.hist=S.rival.hist||[]).push(`${dateStr()} ${seatName(E.t)} 선거에서 나에게 졌다`);}else{S.rival.wins=(S.rival.wins||0)+1;S.rival.rk=Math.max(S.rival.rk||1,E.t);(S.rival.hist=S.rival.hist||[]).push(`${dateStr()} ${seatName(E.t)} 당선`);}}
  if(win){if(E.how==='direct'&&E.t===6)S.elDirectWin=1;if(E.pp.pay){S.payLv=+((S.payLv||1)+.03).toFixed(2);S.wMood=clamp((S.wMood??60)+8,0,100);}if(E.pp.indep){S.resist=(S.resist||0)+1;}if(E.post&&E.post.ref){const m=E.post.ref;m.rel=clamp((m.rel||0)+8,-50,100);S.elDebt={n:m.name,t:S.turn+R(8,16)};}
    if(E.t===6){if(E.re){st.ed.end=S.turn+edTermW();S.edTerms=(S.edTerms||1)+1;log(`${rankName(6)} 연임`);tick(`${OUT().n} ${S.name} ${rankName(6)} 연임`,1);openModal(`${rankName(6)} 연임`,`<p class="lede">${S.edTerms}기 임기가 시작됐다. 다음 심사는 ${dateStr(st.ed.end)}.</p>${fxLine(apply({fame:1}))}`);return;}
      S.edEver=1;S.edTerms=1;if(S.rank!==6){while(nextRank(S.rank)!==6&&nextRank(S.rank)!=null)S.rank=nextRank(S.rank);promote();}st.ed={n:S.name,me:1,end:S.turn+edTermW()};return;}
    if(E.t===7){if(st.ed.me){const nm=rname();st.ed={n:nm,end:S.turn+edTermW()};edSuccessor(nm,'사장 취임');}S.rank=prevRank(7);promote();st.ceo={n:S.name,me:1,end:S.turn+ceoTermW()};S.ceoTerm=1;return;}
    if(E.t===8){S.chair=1;S.chairT=S.turn;S.retExt=Math.max(S.retExt||0,retireAge()+5);setChair({n:S.name,me:1,end:1e9,k:st.chair?st.chair.k:'board'});log('그룹 회장 취임');tick(`${MGRP[grpOf()].n} 회장에 ${S.name}`,1);openModal('그룹 회장 취임',`<p class="lede">${esc(MGRP[grpOf()].n)} 회장. 자매 언론사와 계열사 전부가 내 결재를 기다린다.</p><p class="hint">사장 임기 대신 정년까지 그룹을 이끈다. 계열사 실적이 매달 회사 자금에 더해진다.</p>${fxLine(apply({fame:4,eval:2}))}`);return;}}
  // 낙선
  if(E.t===6&&E.re){edFarewell(E,why);return;}
  if(E.t===7&&E.fromEd){st.ceo={n:E.rv.name,end:S.turn+ceoTermW()};if(S.lead)S.lead.ceo=E.rv.name;E.succ=rname();edFarewell(E,'사장낙선');return;}
  if(E.t===6&&E.scout){const pr=prevRank(6);st.ed={n:E.rv.name,end:S.turn+edTermW()};S.rank=pr;S.inRank=0;S.scene=baseScene();try{checkUnlocks();}catch(e){}log('임명동의 부결 — 국장급으로 남는다');openModal('임명동의 부결',`<p class="lede">새 회사 기자들이 나를 받아들이지 않았다. ${esc(E.rv.name)} 직무대행 체제로 가고, 나는 ${rankName(pr)} 대우로 남는다.</p><p class="hint">밖에서 온 국장에게 기자들은 냉정하다.</p>${fxLine(apply({eval:-2,men:-4}))}`);return;}
  if(false){const pr=prevRank(6);st.ed={n:E.rv.name,end:S.turn+edTermW()};S.rank=pr;S.inRank=0;S.scene=baseScene();try{checkUnlocks();}catch(e){}const b=colBy('boss');if(b){b.name=E.rv.name;b.rel=R(0,20);}log(`${rankName(6)} 연임 실패 — ${ro2(rankName(pr))}`);tick(`${OUT().n} 새 ${rankName(6)}에 ${E.rv.name}`);
    openModal(`${ro2(rankName(pr))}`,`<p class="lede">${why==='불출마'?'연임에 나서지 않았다':'연임하지 못했다'}. ${jo2(esc(E.rv.name),'이','가')} 새 ${jo2(rankName(6),'이','가')} 됐다. 나는 ${rankName(pr)} 자리로 돌아간다.</p><p class="hint">${jo2(rankName(6),'을','를')} 지낸 사람은 사장 선출에 나설 수 있다. 다음 기회는 사장 자리가 빌 때다.</p>${fxLine(apply({eval:-2,men:-3}))}`);return;}
  if(E.t===6){st.ed={n:E.rv.name,end:S.turn+edTermW()};const b=colBy('boss');if(b&&S.rank>=4){b.name=E.rv.name;b.rel=clamp(Math.round((E.voters[0]&&E.voters[0].rr)||15)-(E.used.neg?15:0),-30,40);}}
  if(E.t===7){st.ceo={n:E.rv.name,end:S.turn+ceoTermW()};if(S.lead)S.lead.ceo=E.rv.name;}
  if(E.t===8){if(st.chair)setChair({n:E.rv.name,end:chairWay()==='board'?S.turn+YW*6:1e9,k:st.chair.k});}
  log(`${seatName(E.t)} 선출 실패${why?` (${why})`:''}`);tick(`${OUT().n} ${seatName(E.t)}에 ${E.rv.name}`);openModal(`${seatName(E.t)} — ${E.rv.name}`,`<p class="lede">${why==='불출마'?'출마하지 않았다.':why==='지명 실패'?'후보로 지명받지 못했다.':'졌다.'} ${jo2(esc(E.rv.name),'이','가')} ${jo2(seatName(E.t),'이','가')} 됐다.</p><p class="hint">다음 기회는 임기가 끝나는 ${E.t===8?'때':dateStr(E.t===7?st.ceo.end:st.ed.end)}.</p>${fxLine(apply({eval:-1,men:-2}))}`);}
// ---- 매달: 대주주·자매사·임기·계열사 ----
function ownMonth(lines){if(!S||S.story)return;const W=ownEnsure();if(!W)return;if(S.founder){try{sisMonth(lines);fedMonth(lines);fShareMonth(lines);}catch(e){console.error(e);}return;}const T=OWN_T[W.k];const st=seatEnsure();if(S.rank===7&&st.ceo.me)st.ceo.end=S.turn-S.inRank+ceoTermW();
  if(S.rank>=4)W.rel=clamp(W.rel+clamp((S.eval-60)/40,-.5,.5),-100,100);
  // 호재 기사로 계열사를 띄우면: 대주주는 반기지만 독자는 안다
  (S.clips||[]).slice(0,6).forEach(c=>{if(c._own||c.turn<S.turn-4||!c.pos)return;if(ownHit({title:c.h||c.title||''})){c._own=1;ownRel(3);apply({trust:-.6});lines.push({c:'',t:`계열사 호재 기사 — 대주주는 반겼지만 "그룹 홍보지"라는 댓글이 달렸다 (신뢰 -0.6)`});}});
  // 편집국장 임기 만료 → 연임 심사
  if(S.rank===6&&st.ed.me&&S.turn>=st.ed.end&&!S.elect&&electOn(6)&&S.edEndT!==st.ed.end){S.edEndT=st.ed.end;S.edDone=(S.edDone||0)+1;
    const ceoNear=electOn(7)&&st.ceo.end<=S.turn+24;const lack7=ceoNear?elReqs(7):['사장 자리가 아직 차 있다'];
    if(ceoNear&&!lack7.length)Q.push(()=>openModal(`${rankName(6)} 임기를 마쳤다`,`<p class="lede">${S.edDone}번째 임기를 마쳤다. 마침 ${rankName(7)} ${esc(st.ceo.n)}의 임기도 ${st.ceo.end<=S.turn?'끝났다':'곧 끝난다'}.</p><p class="hint">연임에 도전하거나, 사장 선출에 나설 수 있다. 사장 선거에서 지면 ${rankName(6)} 자리도 이미 후임에게 넘어가 있다.</p>`,[
      {label:'연임에 도전한다',sub:`${rankName(6)} 연임 심사`,fn:()=>{setTimeout(()=>electStart(6,{re:1}),30);return false;}},
      {label:'사장 선출에 나선다',rec:true,sub:'더 높은 자리 · 지면 국장급으로',fn:()=>{st.ceo.end=Math.min(st.ceo.end,S.turn);setTimeout(()=>electStart(7,{fromEd:1}),30);return false;}}]));
    else Q.push(()=>electStart(6,{re:1}));}
  // 회장 자리가 비었을 때
  if(S.rank===7&&!S.chair&&st.chair&&!S.elect){const k=st.chair.k;if(k==='fixed'&&chance(.004))st.chair.end=S.turn;if(k!=='heir'&&S.turn>=st.chair.end){const lack=elReqs(8);if(!lack.length)Q.push(()=>electStart(8,{}));else{const nm=rname();setChair({n:nm,end:k==='board'?S.turn+YW*6:1e9,k});lines.push({c:'',t:`${MGRP[grpOf()].n} 새 회장에 ${nm} — 나는 아직 조건이 모자랐다 (${lack.slice(0,2).join(', ')})`});}}}
  if(S.chair){const n=sisList().length+((W.affs||[]).length);const d=+(n*.06*(.8+S.fame/200)).toFixed(2);S.co.cash+=d;if(chance(.3))lines.push({c:'g',t:`그룹 계열사 배당 +${eok(d)}`});}
  // 자리 약속을 갚을 때
  if(S.elDebt&&S.turn>=S.elDebt.t){const D=S.elDebt;S.elDebt=null;Q.push(()=>openModal('약속한 자리',`<p class="lede">${jo2(esc(D.n),'이','가')} 찾아왔다. "선거 때 하신 말씀, 기억하시죠?"</p>`,[{label:'약속대로 요직에 앉힌다',sub:'그 사람 관계↑ · 부서 분위기↓ · "보은 인사" 뒷말',fn:()=>{const m=deptPeople().concat(S.cols||[]).find(x=>x.name===D.n);if(m)m.rel=clamp((m.rel||0)+12,-50,100);deptPeople().forEach(x=>{if(x.name!==D.n)mRel(x,-2);});toast(apply({eval:-.5}));}},{label:'없던 일로 한다',sub:'그 사람이 등을 돌린다 · 신뢰↓',fn:()=>{const m=deptPeople().concat(S.cols||[]).find(x=>x.name===D.n);if(m)m.rel=clamp((m.rel||0)-30,-50,100);toast(apply({trust:-1}));}}]));}
  // 대주주 요구
  if(T.grp&&S.rank>=4&&S.turn-(W.reqT??-99)>=12&&chance(.07)){W.reqT=S.turn;const kind=pick(['promo','hire','tone']);const aff=pick(W.affs||[W.grp||'계열사']);
    if(kind==='promo')Q.push(()=>openModal('대주주의 부탁',`<p class="lede">대주주 쪽에서 「${esc(aff)}」 신사업 기사를 "크게 한 번" 실어 달라고 한다.</p>`,[{label:'실어 준다',sub:'대주주 관계↑ · 신뢰↓',fn:()=>{ownRel(8);toast(apply({trust:-2}));}},{label:'뉴스 가치대로 판단하겠다고 한다',sub:'대주주 관계↓ · 신뢰↑',fn:()=>{ownRel(-6);S.resist=(S.resist||0)+1;toast(apply({trust:1}));}}]));
    if(kind==='hire')Q.push(()=>openModal('대주주의 인사 청탁',`<p class="lede">대주주 측근의 자녀를 경력 기자로 뽑아 달라는 말이 내려왔다.</p>`,[{label:'뽑는다',sub:'대주주 관계↑ · 기자들 사기↓',fn:()=>{ownRel(10);deptPeople().forEach(m=>mRel(m,-3));S.team.push(genMember(S.dept,25,40));}},{label:'공채로 들어오라고 한다',sub:'대주주 관계↓',fn:()=>{ownRel(-8);valN('ind',1);}}]));
    if(kind==='tone')Q.push(()=>openModal('그룹의 논조 주문',`<p class="lede">그룹 쪽에서 「${esc(aff)}」 노사 갈등 기사를 "회사 입장 중심으로" 써 달라고 한다.</p>`,[{label:'주문대로 한다',sub:'대주주 관계↑ · 신뢰↓↓',fn:()=>{ownRel(9);toast(apply({trust:-3}));valN('ind',-2,'그룹 논조 주문을 따랐다');}},{label:'양쪽 입장을 같이 쓴다',sub:'대주주 관계↓ · 신뢰↑',fn:()=>{ownRel(-7);toast(apply({trust:1.5}));}}]));}
  // 계열사 관련 제보가 들어온다 (선택의 순간)
  if(T.grp&&S.rank>=1&&S.rank<=6&&(S.items||[]).length<6&&chance(.04)){const aff=pick(W.affs||[W.grp]);const it=makeItem(S.dept,{noPos:1});const sub=pick(['하청업체 단가 후려치기','산재 은폐 의혹','분양 하자 은폐','내부거래 의혹','갑질 녹취']);it.title=`${aff}, ${sub}`;it.ent=null;it.src='내부 제보';S.items.push(it);lines.push({c:'r',t:`제보: 「${it.title}」 — 우리 대주주 계열사다`});}
  // 계열사 광고
  if(T.grp&&W.rel<-35&&S.co&&chance(.12)&&S.turn-(W.adCutT??-99)>=24){W.adCutT=S.turn;S.co.adB=(S.co.adB||0)-.03;lines.push({c:'r',t:'그룹 계열사 광고가 슬그머니 줄었다. 광고국이 이유를 묻는다'});}
  // 자매 언론사
  sisEvents(lines);try{edScoutMonth(lines);}catch(e){console.error(e);}
  // 사장 임기 중 대주주 관계가 바닥이면 압박
  if(S.rank===7&&T.grp&&W.rel<-40&&chance(.15)){apply({eval:-2});lines.push({c:'r',t:'대주주가 사장 교체를 검토한다는 말이 돈다 (이사회 신임 -2)'});}}
function sisEvents(lines){const L=sisList();const W=ownEnsure();if(!L.length||S.rank<1||S.turn-(W.sisT??-99)<8||!chance(.09))return;W.sisT=S.turn;const so=pick(L);const tv=['tv','jp','ch'].includes(so.type),meTV=isTV();
  const ks=['joint','tv','first','xfer','cover'].filter(k=>(k!=='tv'||(tv&&!meTV))&&(k!=='first'||(S.items||[]).some(i=>i.excl))&&(k!=='xfer'||(S.rank>=2&&S.rank<=5))&&(k!=='cover'||S.rank>=4));const k=pick(ks);
  if(k==='joint')Q.push(()=>openModal('자매사 공동 기획',`<p class="lede">자매사 <b>${esc(so.n)}</b>에서 공동 기획을 제안했다. 취재력은 합치고 보도는 같은 날 낸다.</p>`,[{label:'같이 한다',sub:'파급력 큰 공동 취재 아이템 · 자매사 관계↑',fn:()=>{const it=makeItem(S.dept,{mult:1.2,pre:1,noPos:1});it.src=`${so.n} 공동 취재`;S.items.push(it);W.sis+=6;toast(`「${it.title}」 공동 기획`);}},{label:'우리끼리 하겠다',cls:'ghost',fn:()=>{W.sis-=2;}}]));
  if(k==='tv')Q.push(()=>openModal('자매 방송 출연',`<p class="lede">자매사 <b>${esc(so.n)}</b> 저녁 뉴스에서 내 기사 해설을 부탁했다.</p>`,[{label:'나간다',sub:'평판↑ · 컨디션↓',fn:()=>{S.hp=clamp(S.hp-5,0,100);W.sis+=3;toast(apply({fame:1}));}},{label:'바쁘다고 한다',cls:'ghost'}]));
  if(k==='first'){const it=(S.items||[]).find(i=>i.excl);Q.push(()=>openModal('자매사가 먼저 썼다',`<p class="lede">그룹 정보 공유 회의에서 흘린 「${esc(it.title)}」${jp(esc(it.title),'을','를')} 자매사 <b>${esc(so.n)}</b>가 먼저 내보냈다.</p>`,[{label:'그룹에 공식 항의한다',sub:'자매사·대주주 관계↓ · 부서원들은 속 시원해한다',fn:()=>{it.excl=false;W.sis-=10;ownRel(-3);deptPeople().forEach(m=>mRel(m,2));}},{label:'그룹 이익이라며 넘긴다',sub:'단독 꼬리표는 잃는다 · 대주주 관계↑',fn:()=>{it.excl=false;ownRel(3);W.sis+=2;apply({eval:.3});}}]));}
  if(k==='xfer'&&xferRank(so,S.rank)>=S.rank){const r=xferRank(so,S.rank);Q.push(()=>openModal('그룹 내 전출 제안',`<p class="lede">그룹 인사팀이 자매사 <b>${esc(so.n)}</b> ${esc(rankName(r,so))} 자리를 제안했다. 그룹 안의 이동이라 경력은 그대로 이어진다.</p>`,[{label:`${ro2(so.n)} 간다`,sub:'그룹 인사 교류 · 대주주 관계↑ · 새 회사·새 동료',fn:()=>{const keep=W.rel;transfer(so,r);const W2=ownEnsure();if(W2)W2.rel=Math.max(W2.rel,keep+5);log(`그룹 전출 — ${so.n}`);}},{label:'남는다',cls:'ghost'}]));}
  if(k==='cover')Q.push(()=>openModal('그룹 차원의 보도 조율',`<p class="lede">자매사 <b>${esc(so.n)}</b> 간부의 비위가 터졌다. 그룹은 "자매사 일은 짧게"를 주문한다.</p>`,[{label:'짧게 처리한다',sub:'대주주·자매사 관계↑ · 신뢰↓',fn:()=>{ownRel(6);W.sis+=5;toast(apply({trust:-2}));}},{label:'다른 언론처럼 쓴다',sub:'대주주·자매사 관계↓ · 신뢰·평판↑',fn:()=>{ownRel(-6);W.sis-=8;toast(apply({trust:1.5,fame:.5}));valN('ind',2,'자매사 비위를 그대로 썼다');}}]));}
// ---- 대주주 면담 (국장 이상) ----
function ownMeetOK(){const W=ownEnsure();return !!(W&&!S.founder&&OWN_T[W.k].grp&&S.rank>=4);}
// ===================== 창간 모드: 계열사 · 지분 · 편집국장 선임 =====================
const SIS_T={
 event:{n:'행사·콘퍼런스 법인',cost:2,rev:[.22,.42],d:'포럼·시상식을 연다. 평판과 인맥이 높을수록 잘 팔린다',fx:'평판 조금씩↑',risk:'협찬 강요 논란'},
 video:{n:'영상 제작 자회사',cost:3,rev:[.3,.55],d:'외주 영상·다큐를 만든다. 우리 영상 콘텐츠도 좋아진다',fx:'트래픽↑'},
 academy:{n:'저널리즘 아카데미',cost:1,rev:[.08,.18],d:'기자 지망생을 가르친다. 부서원 실력이 조금씩 는다',fx:'부서원 성장'},
 lab:{n:'데이터·여론조사 연구소',cost:2,rev:[.14,.3],d:'보고서와 여론조사를 판다. 신뢰가 조금씩 오른다',fx:'신뢰 조금씩↑'},
 agency:{n:'콘텐츠 마케팅 대행사',cost:1.5,rev:[.35,.7],d:'기업 브랜디드 콘텐츠를 만든다. 돈은 되지만 광고성 기사 의심을 산다',fx:'광고 수입↑ · 신뢰 조금씩↓',conf:1},
 media:{n:'자매 매체 (주간지·영상 채널)',cost:4,rev:[.2,.6],d:'새 자매 매체를 낸다. 독자층이 넓어지지만 초기 적자가 길다',fx:'구독·트래픽↑'},
 book:{n:'출판사',cost:1,rev:[.04,.12],d:'기획 기사를 책으로 낸다',fx:'평판 조금씩↑'}};
function sisVal(x){const T=SIS_T[x.k];return +(T.cost*x.lv*(.6+(x.pl3||0)*1.5)*(1+S.fame/250)).toFixed(1);}
function sisMonth(lines){const L=S.sis||[];if(!L.length)return;let tot=0;L.forEach(x=>{const T=SIS_T[x.k];const age=(S.turn-x.t0)/YW;let rev=(T.rev[0]+Math.random()*(T.rev[1]-T.rev[0]))*x.lv*(.7+S.fame/220+S.trust/500)*(x.k==='media'?Math.min(1,.35+age*.4):1);const op=T.cost*.085*x.lv;if(chance(.08))rev*=.25;
    const pl=+(rev-op).toFixed(2);x.pl=pl;x.pl3=+(((x.pl3||0)*2+pl)/3).toFixed(2);tot+=pl;x.bad=pl<0?(x.bad||0)+1:0;
    if(x.k==='event')S.fame=clamp(S.fame+.04*x.lv,0,100);if(x.k==='lab')S.trust=clamp(S.trust+.04*x.lv,0,100);if(x.k==='book')S.fame=clamp(S.fame+.05*x.lv,0,100);if(x.k==='agency'){S.co.adB=(S.co.adB||0)+.004*x.lv;S.trust=clamp(S.trust-.06*x.lv,0,100);}
    if(x.k==='video'&&S.co)S.co.tr=Math.round(S.co.tr*(1+.004*x.lv));if(x.k==='media'&&S.co)S.co.subs=+(S.co.subs*(1+.002*x.lv)).toFixed(3);if(x.k==='academy'&&(S.team||[]).length)skBump(pick(S.team),.15*x.lv);
    if(x.bad>=4&&!x.warn){x.warn=1;Q.push(()=>openModal('계열사 적자',`<p class="lede">「${esc(x.n)}」${jp(esc(x.n),'이','가')} 넉 달째 적자다.</p>`,[{label:'증자로 버틴다',sub:`회사 자금 -${eok(T.cost*.3)} · 체질 개선`,fn:()=>{S.co.cash-=T.cost*.3;x.bad=0;x.warn=0;x.pl3=Math.max(x.pl3,0);}},{label:'매각한다',sub:`회사 자금 +${eok(sisVal(x)*.6)}`,fn:()=>{S.co.cash+=sisVal(x)*.6;S.sis=S.sis.filter(y=>y!==x);log(`계열사 매각 — ${x.n}`);}},{label:'두고 본다',cls:'ghost',fn:()=>{x.warn=0;}}]));}});
  const g=S.chair?1.1:1;tot*=g;S.co.cash+=tot;S.sisPL=+tot.toFixed(2);if(Math.abs(tot)>=.05)lines.push({c:tot>=0?'g':'r',t:`계열사 ${L.length}곳 이번 달 ${tot>=0?'+':''}${eok(tot)}`});
  if(L.some(x=>x.k==='agency')&&chance(.05)){apply({trust:-1});lines.push({c:'r',t:'경쟁사가 "자회사 대행사로 기사 장사를 한다"고 저격했다 (신뢰 -1)'});}
  if(L.some(x=>x.k==='event')&&chance(.03)){Q.push(()=>openModal('협찬 강요 논란',`<p class="lede">행사 법인 영업 직원이 "기사 나가려면 협찬하라"고 했다는 제보가 돌았다.</p>`,[{label:'사과하고 영업 지침을 바꾼다',sub:'신뢰 조금↓ · 행사 수익↓',fn:()=>{const x=S.sis.find(y=>y.k==='event');if(x)x.lv=Math.max(1,x.lv-1);toast(apply({trust:-1}));}},{label:'오해라고 해명한다',sub:'들키면 크게 다친다',risk:true,fn:()=>{if(chance(.4)){toast(apply({trust:-4}));portalPen(1,'협찬 강요');}else toast('넘어갔다');}}]));}}
RUN.fsister=function(){const L=S.sis=S.sis||[];const own=new Set(L.map(x=>x.k));const max=S.chair?6:4;
  const rows=L.map(x=>({label:`${x.n} · ${x.lv}단계`,sub:`지난달 ${x.pl!=null?(x.pl>=0?'+':'')+eok(x.pl):'—'} · 가치 약 ${eok(sisVal(x))} · ${SIS_T[x.k].fx}`,fn:()=>{const T=SIS_T[x.k];const up=+(T.cost*.7*x.lv).toFixed(1);openModal(x.n,`<p>${esc(T.d)}</p>`,[{label:`키운다 · ${eok(up)}`,sub:'수익·효과 커진다',disabled:x.lv>=3||S.co.cash<up+1,fn:()=>{spend(1,3);setCd('fsister');S.co.cash-=up;x.lv++;log(`${x.n} ${x.lv}단계로`);toast(`${x.n} 확장`);}},{label:`판다 · 약 ${eok(sisVal(x))}`,sub:'회사 자금↑ · 계열사가 줄어든다',fn:()=>{spend(1,2);S.co.cash+=sisVal(x);S.sis=S.sis.filter(y=>y!==x);log(`계열사 매각 — ${x.n}`);toast('매각했다');if(S.chair&&S.sis.length<3)toast('계열사가 줄었지만 그룹 체제는 유지한다');}},{label:'닫기',cls:'ghost'}]);return false;}}));
  const news=Object.keys(SIS_T).filter(k=>!own.has(k)).map(k=>{const T=SIS_T[k];return {label:`새로 세운다: ${T.n}`,sub:`${eok(T.cost)} · ${T.d}`,disabled:L.length>=max||S.co.cash<T.cost+1,fn:()=>{const go=()=>{spend(1,5);setCd('fsister');S.co.cash-=T.cost;L.push({k,n:`${OUT().n} ${T.n.replace(/ \(.*\)/,'')}`,lv:1,t0:S.turn,pl:null,pl3:0});fgain('fund',.4);log(`계열사 설립 — ${T.n}`);tick(`「${OUT().n}」, ${T.n} 설립`,1);if(T.conf)apply({trust:-1});toast(`${T.n} 설립`);};if((S.equity??100)<50){fBoardVote('계열사 설립안',go);return false;}go();}};});
  const grp=!S.chair&&L.length>=3?[{label:`그룹 체제 출범 — 「${OUT().n}미디어그룹」`,rec:true,sub:'계열사 수익 +10% · 계열사 한도↑ · 직함이 그룹 회장 겸 발행인으로 · 지분이 절반 아래면 이사회 표결',fn:()=>{const go=()=>{S.chair=1;S.chairT=S.turn;S.grpName=`${OUT().n}미디어그룹`;log(`${S.grpName} 출범`);tick(`${S.grpName} 출범 — ${S.name} 회장`,1);openModal('그룹 출범',`<p class="lede">「${esc(S.grpName)}」 현판을 걸었다. 이제 매체 하나가 아니라 그룹을 이끈다.</p>${fxLine(apply({fame:2}))}`);};if((S.equity??100)<50){fBoardVote('그룹 체제 전환안',go);return false;}go();return false;}}]:[];
  openModal('계열사·자매 매체',`<p>계열사는 매달 손익을 낸다. 잘 키우면 본업의 버팀목이지만, 적자가 길면 회사 자금을 갉아먹는다. 계열사 ${L.length}/${max}곳${S.sisPL!=null?` · 지난달 합계 ${S.sisPL>=0?'+':''}${eok(S.sisPL)}`:''}.</p>`,grp.concat(rows,news,[{label:'닫기',cls:'ghost'}]));};
// ---- 창간 모드 지분·이사회: 지분이 절반 아래면 투자사 표가 대표를 흔든다 ----
function fHolders(){const eq=S.equity??100;const inv=S.investor||0;const H=[{n:`${S.name} (대표)`,w:eq,me:1}];let rest=100-eq;if(rest<=0)return H;const c=colBy('invdir');
  if(inv===2){H.push({n:`${(ownEnsure()||{}).grp||'전략 투자사'}`,w:Math.round(rest*.6),dec:'corp',rel:(ownEnsure()||{rel:0}).rel});rest-=Math.round(rest*.6);}
  if(rest>0)H.push({n:'벤처캐피털',w:Math.round(rest*.6),dec:'vc',rel:c?c.rel:10});rest-=Math.round(rest*.6);if(rest>0)H.push({n:'엔젤·우리사주',w:rest,dec:'angel',rel:avgRel()});return H;}
function fHolderU(h){const pf=elProfit();if(h.dec==='corp')return h.rel*.6+pf+(S.trust-50)*.1;if(h.dec==='vc')return pf*2+((S.fScore||40)-50)*.3+(S.co.cash>3?4:-6)+h.rel*.2;return h.rel*.5+(S.trust-50)*.3+4;}
function fBoardVote(what,go){const H=fHolders();let yes=0,tot=0;const rows=H.map(h=>{tot+=h.w;const u=h.me?99:fHolderU(h)+R(-6,6);const ok=u>0;if(ok)yes+=h.w;return `<li>${esc(h.n)} · ${h.w}% — <b style="color:${ok?'var(--good)':'var(--red)'}">${ok?'찬성':'반대'}</b>${h.me?'':` <span class="hint">(${h.dec==='vc'?'수익·성장을 본다':h.dec==='corp'?'그룹 이해관계':'신뢰와 관계'})</span>`}</li>`;}).join('');const pass=yes>tot/2;
  openModal(`이사회 표결 — ${what}`,`<p class="lede">찬성 ${yes}% / ${tot}% · ${pass?'가결':'부결'}</p><ul class="feed">${rows}</ul>`,[{label:'확인',fn:()=>{if(pass)setTimeout(go,30);else toast('부결됐다. 지분을 되찾거나 투자사를 설득하자');}}]);}
function fShareMonth(lines){const eq=S.equity??100;if(eq>=100||!S.investor)return;const yr=Math.floor((S.turn-(S.fStart||0))/YW);if(S.fAGM===yr||(S.turn-(S.fStart||0))%YW!==0||S.turn===(S.fStart||0))return;S.fAGM=yr;
  const lossM=(S.kpi&&S.kpi.hist)?0:0;const bad=(S.co.last&&S.co.last.profit<0&&S.co.cash<4)||S.trust<38;
  if(!bad||eq>=50){lines.push({c:'',t:`정기 주주총회 — ${eq>=50?'대표 지분이 과반이라 무난히 끝났다':'실적이 버틸 만해 재신임 안건은 오르지 않았다'}`});return;}
  Q.push(()=>{const H=fHolders();openModal('주주총회 — 대표 재신임 안건',`<p class="lede">투자사들이 "대표 재신임" 안건을 올렸다. 내 지분은 ${eq}%. 과반이 반대하면 공동대표 체제로 바뀐다.</p>`,[
    {label:'투자사를 직접 설득한다',sub:'영업력·리더십이 높을수록 · 컨디션↓',fn:()=>{S.hp=clamp(S.hp-6,0,100);const c=colBy('invdir');if(c&&chance(clamp(.3+(S.st.sal||20)/250+(S.st.lead||20)/250,.15,.8)))relUp(c,15,'주총 설득');const W=ownEnsure();if(W)W.rel+=8;setTimeout(()=>fAGMVote(),30);return false;}},
    {label:'내 돈으로 지분을 사들인다 · 5000만',sub:'지분 +3%',disabled:S.money<5000,fn:()=>{S.money-=5000;S.equity=Math.min(100,eq+3);setTimeout(()=>fAGMVote(),30);return false;}},
    {label:'표결에 맡긴다',cls:'ghost',fn:()=>{setTimeout(()=>fAGMVote(),30);return false;}}]);});}
function fAGMVote(){const H=fHolders();let yes=0,tot=0;const rows=H.map(h=>{tot+=h.w;const u=h.me?99:fHolderU(h)-4+R(-6,6);const ok=u>0;if(ok)yes+=h.w;return `<li>${esc(h.n)} · ${h.w}% — <b style="color:${ok?'var(--good)':'var(--red)'}">${ok?'재신임':'반대'}</b></li>`;}).join('');const pass=yes>tot/2;
  if(!pass){S.fCtlN=(S.fCtlN||0)+1;S.fCtl=S.turn+YW;apply({trust:-1});log('주총 재신임 부결 — 공동대표 체제');}
  openModal(pass?'재신임 가결':'재신임 부결',`<p class="lede">${pass?'대표 재신임안이 통과됐다.':'재신임안이 부결됐다. 투자사가 보낸 공동대표가 들어온다. 1년 동안 매달 행동력 -1.'}</p><ul class="feed">${rows}</ul>`,[{label:'확인',fn:()=>{if(!pass&&S.fCtlN>=2&&(S.equity??100)<35)setTimeout(()=>ending('창업자 축출 · 경영권 상실'),30);}}]);}
// ---- 창간 모드 편집국장 선임 방식 ----
function fedMonth(lines){if(!S.founder)return;const st=(S.co&&S.co.staff)||0;
  if(!S.fEd&&st>=18&&!S.fEdAsk){S.fEdAsk=1;Q.push(()=>openModal('편집국장을 세울 때',`<p class="lede">기자가 ${st}명을 넘었다. 이제 대표가 편집국을 직접 다 볼 수 없다. 편집국장을 어떻게 세울까.</p>`,[
    {label:'내가 직접 임명한다',sub:'편집 방향을 쥔다 · 신뢰·사기 그대로',fn:()=>{S.fEd={how:'appoint',name:rname(),rel:R(30,50),end:S.turn+edTermW()};log(`편집국장 ${S.fEd.name} 임명`);}},
    {label:'임명동의제를 도입한다',sub:'신뢰↑ · 사기↑ · 내가 지명해도 기자 과반이 찬성해야',fn:()=>{S.fEd={how:'consent',name:rname(),rel:R(15,35),end:S.turn+edTermW()};S.wMood=clamp((S.wMood??60)+5,0,100);toast(apply({trust:2}));log(`편집국장 임명동의제 도입 — ${S.fEd.name}`);}},
    {label:'편집국장 직선제를 도입한다',sub:'신뢰↑↑ · 사기↑↑ · 편집국이 내 말을 안 들을 수 있다 · 투자사는 싫어한다',fn:()=>{S.fEd={how:'direct',name:rname(),rel:R(0,25),end:S.turn+edTermW()};S.wMood=clamp((S.wMood??60)+10,0,100);toast(apply({trust:4}));const c=colBy('invdir');if(c)relUp(c,-6,'직선제');log(`편집국장 직선제 — ${S.fEd.name} 당선`);}}]));return;}
  const E=S.fEd;if(!E)return;
  if(S.turn>=E.end){E.end=S.turn+edTermW();if(E.how==='appoint'){lines.push({c:'',t:`편집국장 ${E.name} 임기 연장`});}
    else if(E.how==='consent'){const yes=clamp(.45+E.rel/200+((S.wMood??60)-60)/200+(S.trust-50)/300,.1,.95);if(chance(yes)){lines.push({c:'g',t:`편집국장 ${E.name} 임명동의 통과 (연임)`});}else{const n=rname();lines.push({c:'r',t:`편집국장 ${E.name} 임명동의 부결 — 새 편집국장 ${n}`});E.name=n;E.rel=R(10,30);S.wMood=clamp((S.wMood??60)-5,0,100);}}
    else{const n=chance(.5)?E.name:rname();lines.push({c:'',t:n===E.name?`편집국장 직선 — ${n} 재선`:`편집국장 직선 — 새 편집국장 ${n}`});if(n!==E.name){E.name=n;E.rel=R(-5,25);}}}
  if(E.how!=='appoint'&&chance(.05)&&S.turn-(E.cT??-99)>=12){E.cT=S.turn;const corp=pick(ENTS.filter(e=>e[2]==='corp'&&e[4]))||[null,'큰 광고주'];Q.push(()=>openModal('편집국장의 반대',`<p class="lede">편집국장 ${jo2(esc(E.name),'이','가')} ${esc(corp[1])} 비판 기사를 그대로 내겠다고 한다. 영업팀은 광고가 끊긴다고 울상이다.</p>`,[{label:'편집국장 판단을 존중한다',sub:'신뢰↑ · 광고 조금↓',fn:()=>{S.co.adB=(S.co.adB||0)-.01;E.rel+=6;if(corp[0])netUp(corp[0],-5);toast(apply({trust:1.5}));}},{label:'기사를 내리게 한다',sub:'신뢰↓↓ · 사기↓↓ · 편집국장과 틀어진다',fn:()=>{E.rel-=20;S.wMood=clamp((S.wMood??60)-(E.how==='direct'?10:6),0,100);toast(apply({trust:-3}));valN('ind',-3,'편집국장 기사를 내리게 했다');}}]));}}
// ---- 소유 구조 카드 (회사 탭) ----
function ownBox(){try{const W=ownEnsure();if(!W)return '';const T=OWN_T[W.k];const g=grpOf();const st=S.founder?null:seatEnsure();const bar0=v=>`<div class="statrow"><span>대주주 관계</span>${bar(clamp(v+50,0,100))}<span class="num">${Math.round(v)}</span></div>`;
  let h=`<div class="sec">소유 구조 · 선출</div><div class="card"><div class="t">${esc(T.n)}${g?` · ${esc(MGRP[g].n)}`:S.grpName?` · ${esc(S.grpName)}`:''}</div><div class="meta"><span>${esc(T.d)}</span>`;
  if(W.grp)h+=`<span>대주주: <b>${esc(W.grp)}</b></span>`;if(g)h+=`<span>자매 언론사: ${sisList().map(o=>esc(o.n)).join(' · ')||'없음'}</span>`;if((W.affs||[]).length)h+=`<span>계열사: ${W.affs.map(esc).join(' · ')}</span>`;
  if(!S.founder){h+=`<span>${rankName(6)} 선출: <b>${SEL_N[T.s6]}</b> · 사장: <b>${SEL_N[T.s7]}</b>${g&&MGRP[g].chair?` · 그룹 회장: <b>${SEL_N[MGRP[g].chair==='board'?'board':MGRP[g].chair]}</b>`:''}</span>`;
    if(st)h+=`<span>지금 ${rankName(6)} ${esc(st.ed.n)}${st.ed.me?' (나)':''} · 임기 ${dateStr(st.ed.end)}까지</span><span>사장 ${esc(st.ceo.n)}${st.ceo.me?' (나)':''} · 임기 ${dateStr(st.ceo.end)}까지</span>${st.chair?`<span>그룹 회장 ${esc(st.chair.n)}${st.chair.me?' (나)':''}${st.chair.k==='heir'?' · 사주 일가 세습 — 회장직은 오를 수 없다':st.chair.k==='fixed'?' · 자리가 비어야 열린다':` · 임기 ${dateStr(st.chair.end)}까지`}</span>`:''}`;
    h+=`<span>${rankName(6)} 임기 완주 ${S.edDone||0}번${(S.edDone||0)>=1?' — 사장 출마 자격 있음':` — 사장은 ${rankName(6)} 임기를 마친 사람만 나설 수 있다${S.rank===6&&st?` (내 임기 ${dateStr(st.ed.end)}까지)`:''}`}</span>`;}
  else{h+=`<span>내 지분 <b>${S.equity??100}%</b>${S.investor?` · 투자사 ${100-(S.equity??100)}%`:''}${S.fCtl>S.turn?' · 공동대표 체제':''}</span>`;if(S.fEd)h+=`<span>편집국장 ${esc(S.fEd.name)} · ${SEL_N[S.fEd.how]||S.fEd.how} · 임기 ${dateStr(S.fEd.end)}까지</span>`;if((S.sis||[]).length)h+=`<span>계열사: ${S.sis.map(x=>`${esc(x.n)} ${x.lv}단계 (${x.pl!=null?(x.pl>=0?'+':'')+eok(x.pl):'—'})`).join(' · ')}</span>`;}
  h+=`</div>${!S.founder&&T.grp?bar0(W.rel):''}${W.hit||W.kill?`<p class="hint">대주주 계열 기사 — 그대로 쓴 것 ${W.hit} · 접은 것 ${W.kill}${W.vow?' · 대주주에게 "조심하겠다"고 약속했다':''}</p>`:''}</div>`;return h;}catch(e){console.error(e);return '';}}
// ---- 행동 등록 ----
try{ACT.ownmeet={n:'대주주 면담',ap:1,sc:'office',cd:8,d:'대주주 쪽 사람을 만나 회사 사정을 보고하고 관계를 다진다'};ACT.fsister={n:'계열사·자매 매체',ap:1,sc:'office',cd:4,d:'계열사를 세우고 키우거나 판다. 계열사가 셋이면 그룹 체제로'};
  [4,5,6,7].forEach(r=>{if(!RANK_ACTS[r].includes('ownmeet'))RANK_ACTS[r].splice(Math.max(0,RANK_ACTS[r].length-2),0,'ownmeet');});if(!FOUNDER_ACTS.includes('fsister'))FOUNDER_ACTS.splice(FOUNDER_ACTS.indexOf('fraise')+1,0,'fsister');
  ACT_STAT.ownmeet='sal';FST_GAIN.fsister='fund';TIPS.ownmeet='대주주 관계는 대주주가 임명하는 회사에서 편집국장·사장 선출을 좌우한다. 계열사를 비판하면 깎이고, 기사를 접으면 오른다.';TIPS.fsister='계열사는 매달 손익을 낸다. 셋이 되면 그룹 체제로 바꿀 수 있다. 지분이 절반 아래면 이사회 표결을 거친다.';}catch(e){console.error(e);}
RUN.ownmeet=function(){spend(1,3);setCd('ownmeet');const W=ownEnsure();const g=Math.round(R(3,8)*(.8+(S.st.sal||20)/200));ownRel(g);gain('sal',.3);const n=(S.ownMeetN=(S.ownMeetN||0)+1);let t='';if(n%3===0){apply({trust:-.5});t=' · "대주주 줄"이라는 뒷말 (신뢰 -0.5)';}openModal('대주주 면담',`<p class="lede">${esc(W.grp||'대주주')} 쪽에 회사 사정을 보고했다. 대주주 관계 +${g} (지금 ${Math.round(W.rel)}).${t}</p>`);};

// ---- 연임 실패: 쓸쓸한 퇴장 ----
function edDemote(E){const pr=prevRank(6);const st=seatEnsure();const nm=E.succ||E.rv.name;st.ed={n:nm,end:S.turn+edTermW()};S.rank=pr;S.inRank=0;S.scene=baseScene();try{checkUnlocks();}catch(e){}const b=colBy('boss');if(b){b.name=nm;b.rel=R(0,20)-(E.used&&E.used.neg&&!E.succ?15:0);}log(`${rankName(6)}에서 물러남 — ${ro2(rankName(pr))}`);tick(`${OUT().n} 새 ${rankName(6)}에 ${nm}`);apply({eval:-2,men:-3});}
function edFarewell(E,why){S.edFail=1;const pr=prevRank(6);const yrs=Math.max(2,(S.edTerms||1)*2);const close=deptPeople().filter(m=>(m.rel??20)>=40).slice(0,3).map(m=>m.name);const old=myAge()+3>retireAge();
  const nm=E.succ||E.rv.name;const scene=`<p class="lede">${why==='사장낙선'?`사장 선거에서 ${esc(E.rv.name)}에게 졌다. ${rankName(6)} 임기도 끝나,`:why==='불출마'?'연임에 나서지 않기로 했다.':'연임 투표에서 졌다.'} 다음 주부터 ${jo2(esc(nm),'이','가')} ${rankName(6)}실을 쓴다.</p><p>${yrs}년 동안 쓴 방을 비우는 데 박스 두 개면 충분했다. 벽에 붙여 둔 1면 스크랩을 떼어 내자 누런 자국이 남았다.</p><p>${close.length?`${jo2(close.map(esc).join(', '),'이','가')} 엘리베이터 앞까지 따라 나왔다. "국장님, 그동안…" 다들 말끝을 흐렸다.`:'복도는 조용했다. 다들 모니터만 보고 있었다. 마감 시간이었다.'}</p><p class="hint">${ro2(rankName(pr))} 남을 수도, 이대로 회사를 떠날 수도 있다.${old?' 정년이 멀지 않았다.':''}</p>`;
  const cur=OUT();let so=null,sr=6;if(chance(clamp(.25+S.fame/250+(S.edTerms||1)*.05,.2,.75))){const L=OUTLETS.filter(o=>o.id!==S.outlet&&!o.closed&&!o.custom&&!o.npc&&o.p>=2&&o.p<=cur.p&&o.p>=cur.p-2&&OWN_T[ownKey(o)].s6!=='direct');if(L.length){so=pick(L);sr=chance(clamp(.35+S.fame/300,.3,.7))?6:5;}}
  const sv=so&&sr===6&&OWN_T[ownKey(so)].s6==='consent';
  const scoutOpt=so?[{label:`${so.n}의 제안을 받는다 — ${sr===6?rankName(6,so):rankName(5,so)+' 대우'}`,rec:true,sub:`짐을 싸던 날 ${so.n} 사장에게서 전화가 왔다 · ${TYPES[so.type].n} ★${so.p}${sv?' · 옮긴 뒤 임명동의 투표':''}`,fn:()=>{const st=seatEnsure();st.ed={n:E.succ||E.rv.name,end:S.turn+edTermW()};transfer(so,xferRank(so,sr));if(S.rank===6){S.edTerms=(S.edTerms||1)+1;}log(`${jo2(rankName(6),'을','를')} 마치고 ${ro2(so.n)} 스카우트`);tick(`${so.n}, 전 ${OUTLETS.find(x=>x.id===E.oid)?OUTLETS.find(x=>x.id===E.oid).n:''} ${rankName(6)} ${S.name} 영입`,1);if(sv)Q.push(()=>electStart(6,{nom:1,scout:1}));}}]:[];
  openModal('마지막 출근',scene+(so?`<p class="fx">휴대전화가 울렸다. ${jo2(esc(so.n),'이었다','였다')}.</p>`:''),scoutOpt.concat([
   ...(typeof opOK==='function'&&opOK()?[{label:'논설위원실로 간다 — 논설실장',sub:'사설로 신문의 목소리를 낸다 · 주필까지 오를 수 있다',fn:()=>{edDemote(E);opEnter(2,'ed');}}]:[]),
   {label:`${ro2(rankName(pr))} 남는다`,sub:'기획 쪽 국장급 자리 · 사장 출마 자격은 남는다',fn:()=>{edDemote(E);toast(`${ro2(rankName(pr))} 돌아왔다`);}},
   {label:'사표를 낸다',sub:'다른 회사 제안을 기다리거나 언론계를 떠난다',fn:()=>{const cur=OUT();const L=shuffle(OUTLETS.filter(o=>o.id!==S.outlet&&!o.closed&&!o.custom&&!o.npc&&o.p<=cur.p&&o.p>=Math.max(2,cur.p-2))).filter(()=>chance(.3+S.fame/300)).slice(0,2);
     const ch=L.map(o=>{const r=xferRank(o,chance(.4)?6:5);return {label:`${o.n} ${rankName(r,o)} 제안`,sub:`${TYPES[o.type].n} · ${OWN_T[ownKey(o)].n}`,fn:()=>{transfer(o,r);log(`${jo2(rankName(6),'을','를')} 마치고 ${ro2(o.n)}`);}};});
     setTimeout(()=>openModal('사표',`<p class="lede">사표를 냈다. 사장은 붙잡지 않았다.</p>${L.length?'<p>며칠 뒤 전화가 몇 통 왔다.</p>':'<p>전화는 오지 않았다.</p>'}`,ch.concat([{label:'언론계를 떠난다',sub:'커리어 결산',fn:()=>{ending('편집국장의 퇴장');return false;}}])),30);return false;}}]));}
// ---- 타사가 국장을 편집국장으로, 편집국장 출신을 대표로 데려간다 ----
function edScoutMonth(lines){if(S.founder||S.story||S.simple||S.elect)return;const cur=OUT();if(S.turn-(S.edScT??-99)<YW||(S.atOutlet||0)<YW)return;
  const toEd=(S.rank===5||(S.rank===3&&nextRank(3)===6))&&S.inRank>=YW&&S.fame>=promoFm(S.rank)-4&&S.eval>=58&&S.trust>=50;
  const toCeo=(S.edDone||0)>=1&&S.rank===5&&S.fame>=promoFm(6)&&S.trust>=56&&myAge()+3<=retireAge();
  let k=null;if(toCeo&&chance(.012))k=7;else if(toEd&&chance(.02+(S.edEver?.02:0)))k=6;if(!k)return;S.edScT=S.turn;
  const L=OUTLETS.filter(o=>o.id!==S.outlet&&!o.closed&&!o.custom&&!o.npc&&o.p>=2&&(k===7?o.p<cur.p:o.p<=cur.p&&o.p>=cur.p-2)&&(k===7||OWN_T[ownKey(o)].s6!=='direct')&&xferRank(o,k)===k);if(!L.length)return;const o=pick(L);const r=k;
  const T=OWN_T[ownKey(o)];const vote=k===6&&T.s6==='consent';const who=k===7?`${o.n} 대주주 쪽`:`${o.n} 사장`;
  Q.push(()=>openModal(k===7?'대표이사 제안':`${rankName(6,o)} 제안`,`<p class="lede">${jo2(esc(who),'이','가')} 만나자고 했다. "${k===7?'우리 회사를 맡아 주십시오. 편집국을 아는 경영자가 필요합니다.':`우리 ${jo2(rankName(6,o),'을','를')} 맡아 주십시오.`}"</p><div class="card"><div class="meta"><span>${esc(o.n)} · ${TYPES[o.type].n} · ★${o.p}</span><span>${esc(T.n)}</span>${vote?'<span class="warn">이 회사는 편집국장 임명동의제다. 옮긴 뒤 기자들 투표를 통과해야 자리를 지킨다.</span>':''}</div></div>`,[
    {label:'받아들인다',sub:`${o.n} ${rankName(r,o)}${vote?' · 임명동의 투표가 기다린다':''}`,fn:()=>{transfer(o,r);if(k===6){S.edEver=1;S.edTerms=1;}log(`${o.n} ${ro2(rankName(r,o))} 스카우트`);tick(`${o.n}, ${S.name} ${rankName(r,o)} 영입`,1);if(vote)Q.push(()=>electStart(6,{nom:1,scout:1}));}},
    {label:'지금 자리를 지킨다',cls:'ghost',fn:()=>{apply({eval:.5});}}]));}

// ---- 선출 화면 스타일 ----
try{const st=document.createElement('style');st.textContent='.elbar{height:14px;border-radius:7px;background:color-mix(in srgb,var(--red) 70%,transparent);overflow:hidden;position:relative;margin:4px 0 2px}.elbar i{position:absolute;left:0;top:0;bottom:0;background:var(--good)}.elbar b{position:absolute;top:0;bottom:0;width:2px;background:var(--fg);opacity:.75}.elhd{display:flex;justify-content:space-between;gap:8px;font-size:13px;color:var(--mute)}.elhd b{color:var(--fg)}.elchips{display:flex;flex-wrap:wrap;gap:5px;align-items:center;margin:6px 0}.elchips i{font-style:normal;font-size:12.5px;padding:2px 9px;border-radius:9px;background:var(--panel3);color:var(--fg)}';document.head.appendChild(st);}catch(e){}

// ---- 자리 기록: 회사마다 따로 남는다 ----
function chairSeat(){const g=grpOf();if(!g||!MGRP[g].chair)return null;S.grpChair=S.grpChair||{};if(!S.grpChair[g])S.grpChair[g]={n:rname(),end:MGRP[g].chair==='board'?S.turn+R(YW*3,YW*8):1e9,k:MGRP[g].chair};return S.grpChair[g];}
function setChair(c){const g=grpOf();if(!g)return;S.grpChair=S.grpChair||{};S.grpChair[g]=c;const W=S.own;if(W&&W.seat)W.seat.chair=c;}
function edSuccessor(nm,why){const T=ownTxt();const how={appoint:'대주주가 바로 임명했다',consent:'대주주 지명에 기자들이 임명동의로 답했다',direct:'기자 직선으로 뽑혔다'}[T.s6]||'새로 정해졌다';log(`후임 ${rankName(6)} ${nm} (${why})`);tick(`${OUT().n} 새 ${rankName(6)}에 ${nm}`);Q.push(()=>openModal(`후임 ${rankName(6)}`,`<p class="lede">내가 비운 ${rankName(6)} 자리에 ${jo2(esc(nm),'이','가')} 들어섰다. ${how}.</p><p class="hint">임기 ${dateStr(S.turn+edTermW())}까지.</p>`,[{label:'확인'}]));}
function ownLeave(W){if(!W||!W.seat)return;const st=W.seat;if(st.ed.me)st.ed={n:rname(),end:S.turn+edTermW()};if(st.ceo.me)st.ceo={n:rname(),end:S.turn+ceoTermW()};W.leftT=S.turn;}
function ownReturn(W){const away=S.turn-(W.leftT??S.turn);if(W.mg&&S.grpOwn&&S.grpOwn[W.mg]!=null)W.rel=S.grpOwn[W.mg];if(away>YW/2){W.rel=Math.round(W.rel*.6);if(W.mg)S.grpOwn[W.mg]=W.rel;}const st=W.seat;if(!st)return;
  const roll=(x,term)=>{let k=0;while(!x.me&&x.end+YW/2<=S.turn&&k<20){if(!chance(.4))x.n=rname();x.end+=term;k++;}};roll(st.ed,edTermW());roll(st.ceo,ceoTermW());
  if(away>0)log(`${ro2(OUT().n)} 돌아왔다 — ${rankName(6)} ${st.ed.n} · 사장 ${st.ceo.n}`);}