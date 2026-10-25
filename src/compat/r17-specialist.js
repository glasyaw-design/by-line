// 1.7 · 전문기자·선임·대기자 트랙 · 대형 추적 · 다음 자리(전문 에디터·명망가 편집국장·주필·사장) · 승진 레이스 · 조직 정원
// 예전 파일 v63.js · v64.js를 순서 그대로 이어 붙였다

// ───── (예전 v63.js) ─────
/* 바이라인 — src/compat/v63.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.7 전문기자 · 대기자 트랙 + 승진 레이스 =====
// 관리직 사다리 대신 「한 분야의 이름」으로 크는 길. 데스킹·팀·광고 목표가 없고, 대형 추적·칼럼·몸값이 있다.
// 다시 사다리로: 선임 전문기자 → 전문 에디터(부국장급) 발탁 / 대기자 → 명망가 편집국장 직행(기자 총회 임명동의)

const SPEC_T=['전문기자','선임 전문기자','대기자'];
const SPEC_PAY=[1.1,1.25,1.45];
function specOutletOK(o){o=o||OUT();return !!o&&(o.p||0)>=3&&o.type!=='trade';}
function isSpec(){return !!(S&&S.spec63&&!S.spec63.ed);}
function specOn(){return !!(S&&S.spec63);}
function specD(){return (S.spec63&&S.spec63.d)||S.dept;}
function specField(){return DEPTS[specD()]?DEPTS[specD()].n.replace(/(부|팀)$/,''):'';}
function specTitle(){const s=S.spec63;return s?`${specField()} ${SPEC_T[s.lv||0]}`:'';}

// ---------- 직함 · 월급 · 행동력 · 정년 · 구조조정 ----------
{const _rn63=rankName;rankName=function(i,o){if(isSpec()&&(i===undefined||i===S.rank)&&!o)return SPEC_T[S.spec63.lv||0];return _rn63.apply(this,arguments);};}
{const _po63=payOf;payOf=function(o,rank){const v=_po63.apply(this,arguments);try{if(isSpec()&&(rank===undefined||rank===S.rank))return Math.round(v*SPEC_PAY[S.spec63.lv||0]/5)*5;}catch(e){}return v;};}
{const _ap63=apBase;apBase=function(){const v=_ap63.apply(this,arguments);return isSpec()?v+1:v;};}
{const _ra63=retireAge;retireAge=function(){const v=_ra63.apply(this,arguments);return specOn()&&!S.founder?v+5:v;};}
{const _ex63=exitCheck;exitCheck=function(Qx){if(isSpec())return;return _ex63.apply(this,arguments);};}
{const _fi63=fired;fired=function(reason){try{if(isSpec()&&!S.story&&S.trust>=20){S.eval=Math.max(S.eval,42);S.specIso63=(S.specIso63||0)+1;
      openModal('간부회의 소외',`<p class="lede">${esc(String(reason||''))} 인사위원회가 열렸지만 결론은 「현 직무 유지」였다. ${esc(specTitle())}의 이름값을 회사도 무시할 수 없었다.</p><p class="hint">대신 간부회의 자료가 더는 오지 않는다. 사내 평가는 바닥에서 다시 시작한다.</p>${fxLine(apply({eval:-1,fame:-.5}))}`);return;}}catch(e){console.error(e);}
  return _fi63.apply(this,arguments);};}
// 관리 업무는 빠지고, 전문기자 일이 들어온다
const SPEC_DROP=['desk','plan','adsell','recruit','deptreq','assign','tour','meeting','front','personnel','wage','adrate','campaign','portal','lgevent','taskforce'];
{const _rk63=rankActs;rankActs=function(){let a=_rk63.apply(this,arguments);try{if(isSpec()){a=a.filter(id=>!SPEC_DROP.includes(id));['hunt63','spec63'].forEach(id=>{if(!a.includes(id))a.splice(Math.max(0,a.indexOf('invest')),0,id);});if((S.spec63.lv||0)>=2&&!a.includes('col63'))a.splice(1,0,'col63');}
    else if(S&&S.spec63&&S.spec63.ed&&!a.includes('hunt63'))a.push('hunt63');}catch(e){}return a;};}
{const _q63=quota;quota=function(){if(isSpec())return 0;return _q63.apply(this,arguments);};}
{const _ds63=deptShared;deptShared=function(){if(isSpec())return false;return _ds63.apply(this,arguments);};}

// ---------- 행동 ----------
try{
  ACT.hunt63={n:'대형 추적',ap:2,sc:'office',cd:4,d:'몇 달짜리 연속 취재 — 증거를 쌓고, 반격을 버티고, 때를 골라 터뜨린다'};
  ACT.spec63={n:'전문기자의 일',ap:1,sc:'office',cd:2,d:'방송 패널·강연·책 · 몸값 · 트랙 정리'};
  ACT.col63={n:'대기자 칼럼',ap:1,sc:'office',cd:4,d:'여론을 움직인다 — 게이지가 차면 제도가 바뀐다'};
  ACT_IC.hunt63='search';ACT_IC.spec63='mic';ACT_IC.col63='doc';ACT_STAT.hunt63='inv';ACT_STAT.spec63=ACT_STAT.network||'net';ACT_STAT.col63=ACT_STAT.write||'wri';
  const g=ACT_GROUPS.find(x=>x[0]==='취재 현장');if(g){['hunt63'].forEach(id=>{if(!g[2].includes(id))g[2].unshift(id);});}
  const g2=ACT_GROUPS.find(x=>x[0]==='기사와 지면');if(g2&&!g2[2].includes('col63'))g2[2].unshift('col63');
  const g3=ACT_GROUPS.find(x=>x[0]==='사람과 관계');if(g3&&!g3[2].includes('spec63'))g3[2].push('spec63');
  TIPS.hunt63='전문기자만 할 수 있는 몇 달짜리 연속 취재. 증거 게이지를 쌓고 상대 반격 게이지를 버티며, 마감 전에 터뜨린다. 성공하면 1면 톱과 함께 사회가 움직인다.';
}catch(e){console.error(e);}
{const _wy63=why;why=function(id){try{let m=null;if(id==='hunt63'){if(!specOn())m='전문기자만 할 수 있다';else if(!specOutletOK())m='★3 이상 매체에서만';else if(!S.hunt63&&S.turn-(S.huntT63??-999)<YW/2)m=`다음 추적은 ${Math.ceil((YW/2-(S.turn-S.huntT63))/4)}개월 뒤`;}
  else if(id==='spec63'){if(!isSpec())m='전문기자만';}else if(id==='col63'){if(!(isSpec()&&(S.spec63.lv||0)>=2))m='대기자만';}else return _wy63.apply(this,arguments);
  return m||_wy63.apply(this,arguments)||'';}catch(e){return _wy63.apply(this,arguments);}};}
{const _ts63=teamSize;teamSize=function(){if(isSpec())return 0;return _ts63.apply(this,arguments);};}

// ---------- 전문기자 제안: 차장 이상(차장~국장) · 입사 8년 차 이상 ----------
function specOffer63(lines){if(S.spec63||S.founder||S.story||S.op||!S.co||S.rank<2||S.rank>5)return;if(S.turn-(S.specOfT63??-999)<YW*2)return;
  const yrs=years();const stuck=S.inRank>=promoMinW(S.rank)*1.2;const deep=(S.clips||[]).filter(c=>catOf(S.dept).includes(c.d)||c.d===S.dept).length>=40;
  if(yrs<8||!specOutletOK())return;if(typeof spDeptTaken64==='function'&&spDeptTaken64(S.dept))return;if(!chance(stuck?.3:deep?.2:.12))return;S.specOfT63=S.turn;const f=DEPTS[S.dept]?DEPTS[S.dept].n.replace(/(부|팀)$/,''):'';
  Q.push(()=>openModal('전문기자 제안',`<p class="lede">편집국장이 따로 불렀다. "${esc(S.name)} ${esc(rankName())}, <b>${esc(f)} 전문기자</b> 해 볼 생각 없나? 데스크 대신 기사로 승부하는 자리야."</p>
   <ul class="pnl"><li><b>얻는 것</b> 월급 ×1.1~1.45 · 매달 행동력 +1 · 정년 +5년 · 구조조정·권고사직 대상에서 빠진다 · 타사 스카우트 · 대형 추적·칼럼·방송</li>
   <li><b>버리는 것</b> 팀·데스킹·부서 권한 · 사내 정치에서 밀려난다</li>
   <li><b>다시 올라가는 길</b> 선임 전문기자 → 전문 에디터(부국장급) 발탁 · 대기자 → 명망가 편집국장 직행</li></ul>`,[
   {label:`받아들인다 — ${f} 전문기자`,sub:'관리직 사다리를 잠시 내려놓는다',fn:()=>{specEnter63();}},
   {label:'관리직 사다리에 남는다',sub:'2년 뒤 다시 제안이 올 수 있다',cls:'ghost'}]));}
function specEnter63(){S.spec63={d:S.dept,lv:0,ex:Math.min(45,20+(S.clips||[]).filter(c=>catOf(S.dept).includes(c.d)||c.d===S.dept).length*.5),t0:S.turn,op:0,ok:0,fail:0,ref:0,rank0:S.rank};S.specTeam63=(S.team||[]).length;S.team=[];S.dq=[];S.inRank=0;
  log(`${jo2(specTitle(),'으로','로')} 직무 전환`);tick(`${OUT().n} 인사 — ${S.name} ${specTitle()}`,1);
  openModal(`${specTitle()}`,`<p class="lede">명함이 바뀌었다. <b>${esc(specTitle())}</b>. 데스크 자리를 비우고, 창가 쪽 혼자 쓰는 책상으로 옮겼다.</p><p>새 할 일: <b>대형 추적</b>(몇 달짜리 연속 취재) · <b>전문기자의 일</b>(방송·강연·책) · 대기자가 되면 <b>대기자 칼럼</b>.</p><p class="hint">전문성 ${Math.round(S.spec63.ex)}/100 — 분야 기사·단독·취재원으로 오른다. 55면 선임, 85에 15년 차면(또는 대형 추적 성공) 대기자.</p>`,[{label:'시작한다'}]);}
function specLeave63(toRank){const s=S.spec63;S.spec63=null;S.inRank=0;if(toRank!=null)S.rank=toRank;if(S.rank>=2&&!(S.team||[]).length)S.team=genTeam();log('관리직으로 복귀');}

// ---------- 매달: 전문성 · 제보 · 제안 · 단계 ----------
function specMonth63(lines){const s=S.spec63;if(!s)return;const t0=S.turn-4;const cs=catOf(s.d);
  // 전문기자 시기에 내 이름으로 나간 기사는 모두 분야 기사다(분야 밖 아이템은 매달 넘긴다)
  const mine=(S.clips||[]).filter(c=>c.turn>t0&&c.turn>=(s.t0||0)&&!c.staff&&(!c.by||c.by===S.name));let g=Math.min(1.3,mine.length*.4+mine.filter(c=>c.excl||c.crit).length*.6);
  g+=Math.min(.5,(S.sources||[]).filter(x=>x.trust>=40&&(cs.includes(x.d)||x.d===s.d)).length*.1);if(!mine.length)g-=.25;s.ex=clamp((s.ex||0)+g,0,100);
  if(s.ed)return;
  // 이름값: 취재원이 먼저 전화한다
  if((S.items||[]).length<6&&chance(.18+s.ex/300)){try{const it=makeItem(s.d,{excl:true});S.items.push(it);lines.push({c:'g',t:`${specTitle()} 앞으로 제보가 왔다 — 「${it.title}」 (전문기자라 먼저 찾아온다)`});}catch(e){}}
  // 단계
  const okO=specOutletOK();if(!okO&&!s.paused){s.paused=1;lines.push({c:'',t:`${specTitle()} — 이 매체(★${OUT().p})에선 선임·대기자 승격과 대형 추적이 멈춘다. ★3 이상 매체에서 다시 열린다`});}if(okO)s.paused=0;
  const senFull=typeof spSenN64==='function'&&spSenN64()>=SPCAP64.sen,bossTaken=typeof spBoss64==='function'&&!!spBoss64();
  if(okO&&(s.lv||0)===0&&s.ex>=55&&senFull&&!s.wSen){s.wSen=1;lines.push({c:'',t:`선임 전문기자 승격 대기 — 선임 정원 ${SPCAP64.sen}명이 찼다. 자리가 나면 올라간다`});}
  if(okO&&(s.lv||0)===1&&s.ex>=85&&(years()>=15||(s.ok||0)>=1)&&S.turn-(s.t1??S.turn)>=YW*3&&bossTaken&&!s.wBoss){s.wBoss=1;const b=spBoss64();lines.push({c:'',t:`대기자 승격 대기 — 회사 대기자 ${b?b[0].name:''} 자리가 비어야 한다`});}
  if(okO&&!senFull&&(s.lv||0)===0&&s.ex>=55){s.lv=1;s.t1=S.turn;Q.push(()=>openModal('선임 전문기자',`<p class="lede">${esc(specField())} 분야에서 이름이 굳었다. 직함이 <b>선임 전문기자</b>로 바뀐다.</p><p>월급 ×1.25 · 방송·강연 제안이 늘어난다 · 정기 인사에서 <b>전문 에디터(부국장급)</b> 발탁 후보가 된다.</p>${fxLine(apply({fame:2}))}`,[{label:'좋다'}]));log('선임 전문기자');}
  if(okO&&!bossTaken&&(s.lv||0)===1&&s.ex>=85&&(years()>=15||(s.ok||0)>=1)&&S.turn-(s.t1??S.turn)>=YW*3){s.lv=2;Q.push(()=>openModal('대기자',`<p class="lede">사보 1면에 짧은 공지가 실렸다. 「${esc(S.name)}, <b>대기자</b>로 임명」. 회사에 대기자는 한 명뿐이다.</p><p>월급 ×1.45 · <b>대기자 칼럼</b>이 열렸다 — 여론 게이지가 차면 제도가 바뀐다 · <b>명망가 편집국장</b> 후보가 된다 · 은퇴 전 <b>마지막 한 방</b>.</p>${fxLine(apply({fame:4,trust:1}))}`,[{label:'펜을 고쳐 쥔다'}]));log('대기자 임명');tick(`${OUT().n}, ${S.name} 대기자 임명`,1);}
  // 사내 정치에서 밀려난다
  if(chance(.04)){lines.push({c:'',t:'간부회의 자료가 이번 달에도 오지 않았다 — 전문기자는 사내 정치에서 한 발 비켜나 있다'});S.eval=Math.max(30,S.eval-.5);}
  // 몸값: 타사 스카우트
  if((s.lv||0)>=1&&chance(.035)&&S.turn-(S.scT63??-999)>=YW){S.scT63=S.turn;const L=OUTLETS.filter(o=>o.id!==S.outlet&&!o.closed&&!o.custom&&!o.npc&&o.p>=OUT().p-1);const o=pick(L);if(o){const pay=Math.round(payOf(OUT())*1.25/10)*10;
    Q.push(()=>openModal('스카우트 제안',`<p class="lede">${esc(o.n)}에서 연락이 왔다. "${esc(specTitle())} 자리 그대로, 연봉은 지금보다 25% 더 드리겠습니다."</p>`,[
      {label:`옮긴다 — ${o.n}`,sub:'직함·전문성을 들고 간다 · 이적 보너스',fn:()=>{const keep=Object.assign({},S.spec63);try{transfer(o,S.rank);}catch(e){console.error(e);}S.spec63=keep;S.team=[];S.money+=pay*2;log(`${jo2(o.n,'으로','로')} 이적 (${specTitle()})`);}},
      {label:'남는다',sub:'회사가 붙잡는다 · 월급 소폭↑',fn:()=>{S.payK=(S.payK||1)*1.03;toast('회사가 처우를 올려 붙잡았다');}}]));}}
  // 대기자: 마지막 한 방
  if((s.lv||0)>=2&&!s.last&&myAge()>=retireAge()-3){s.last=1;Q.push(()=>openModal('마지막 한 방',`<p class="lede">정년이 3년 남았다. 후배들이 묻는다. "대기자님, 마지막으로 뭘 쓰실 겁니까?"</p><p class="hint">다음 대형 추적은 다섯 단계짜리 <b>마지막 한 방</b>이다. 성공하면 「대기자」 엔딩이 열린다.</p>`,[{label:'준비한다'}]));}}

// ---------- 전문기자의 일: 방송 · 강연 · 책 · 트랙 정리 ----------
RUN.spec63=function(){const s=S.spec63;const lv=s.lv||0;const bookOK=s.ex>=50&&S.turn-(s.bookT??-999)>=YW*3;
  openModal('전문기자의 일',`<p class="lede"><b>${esc(specTitle())}</b> · 전문성 ${Math.round(s.ex)}/100${lv<2?` · 다음 단계 ${lv===0?'선임 55':'대기자 85 + 15년 차(또는 대형 추적 성공)'}`:''} · 대형 추적 성공 ${s.ok||0}회</p>`,[
   {label:'방송 시사 패널 출연',sub:`평판↑ · 출연료 · 너무 잦으면 「방송인」 소리 · 컨디션↓`,fn:()=>{spend(1,4);setCd('spec63');s.tv=(s.tv||0)+1;const fee=Math.round((60+lv*60)*(1+s.ex/200));S.money+=fee;const tr=s.tv>4&&chance(.35)?-1:0;toast(`출연료 ${fee}만 · `+apply({fame:1.2+lv*.4,trust:tr}));}},
   {label:'대학·기업 강연',sub:'돈↑ · 취재원 인맥↑',fn:()=>{spend(1,3);setCd('spec63');const fee=Math.round((80+lv*100)*(1+s.ex/200));S.money+=fee;s.ex=Math.min(100,s.ex+1);toast(`강연료 ${fee}만 · `+apply({net:.5}));}},
   {label:'책을 쓴다',sub:bookOK?'평판↑↑ · 인세 · 전문성↑ · 한 달을 통째로 쓴다':'전문성 50 이상 · 3년에 한 권',disabled:!bookOK,fn:()=>{spend(3,10);setCd('spec63');s.bookT=S.turn;s.books=(s.books||0)+1;const roy=Math.round((300+lv*400)*(.6+Math.random()*.8));S.money+=roy;s.ex=Math.min(100,s.ex+4);log(`책 출간: 『${specField()}의 이면』`);tick(`[신간] ${S.name} ${specTitle()} 『${specField()}의 이면』`,1);toast(`인세 ${roy}만 · `+apply({fame:3+lv,trust:.8}));}},
   {label:'관리직으로 돌아간다',sub:'전문 트랙을 접고 원래 직급으로 · 다시 들어오기 어렵다',risk:true,fn:()=>{specLeave63(s.rank0??S.rank);toast('관리직으로 돌아왔다');}},
   {label:'닫기',cls:'ghost'}]);};

// ---------- 대기자 칼럼: 여론 게이지 → 제도 변화 ----------
const REFORM63={soc:['경찰 수사 기록 공개법','산재 처벌 강화'],eco:['하도급 단가 공개제','공시 위반 처벌 강화'],pol:['정치자금 실시간 공개법','국회 회의록 전면 공개'],loc:['지방의회 업무추진비 공개','개발 사업 주민투표제'],cul:['예술인 계약 표준화법','문화재 보존 예산 독립'],ent:['연습생 계약 보호법','방송 출연료 공개'],spo:['체육 지도자 폭력 처벌법','승부조작 영구 제명'],int:['무기 도입 사업 공개 검증','재외국민 보호법']};
RUN.col63=function(){const s=S.spec63;spend(1,4);setCd('col63');const k=cat1(s.d);const L=REFORM63[k]||REFORM63.soc;s.ref=s.ref||0;const tgt=L[s.ref%L.length];const g=Math.round(10+S.fame/8+s.ex/12+R(0,6));s.op=Math.min(100,(s.op||0)+g);
  const fx=apply({fame:.6,trust:.3});
  if(s.op>=100){s.op=0;s.ref++;log(`대기자 칼럼이 이끈 제도 변화: ${tgt}`);tick(`국회, 「${tgt}」 통과 — ${OUT().n} ${S.name} 대기자 연속 칼럼 1년`,1);
    openModal('제도가 바뀌었다',`<p class="lede">1년 가까이 쓴 칼럼이 결국 국회를 움직였다. <b>「${esc(tgt)}」</b> 통과. 표결 직후 발의 의원이 기자회견에서 우리 칼럼을 인용했다.</p>${fxLine(apply({fame:5,trust:3,eval:2}))}`,[{label:'다음 의제로'}]);return false;}
  openModal('대기자 칼럼',`<p class="lede">이번 주 칼럼: 「${esc(tgt)}, 더는 미룰 수 없다」</p>${bar(s.op,'var(--sodium)')}<p class="hint">여론 게이지 ${s.op}/100 (+${g}) — 평판·전문성이 높을수록 많이 찬다. 다 차면 제도가 바뀐다.</p>${fxLine(fx)}`);return false;};

// ---------- 대형 추적 ----------
const HUNT_T63={soc:['{E} 산하 시설 안전 점검 조작','{E} 내부 은폐 문건'],eco:['{E} 분식회계 장부','{E} 하청 단가 후려치기 이중장부'],pol:['{E} 쪼개기 후원금 명단','{E} 공천 뒷거래 녹취'],loc:['{E} 개발 사업 특혜 결재선','{E} 보조금 유용 장부'],cul:['{E} 지원금 몰아주기 명단','{E} 문화재 수리 비리'],ent:['{E} 노예 계약서 묶음','{E} 정산 조작 장부'],spo:['{E} 승부조작 장부','{E} 지도자 폭력 은폐'],int:['{E} 무기 도입 리베이트','{E} 해외 비자금 계좌']};
function huntTarget63(d){const k=cat1(d);let L=ENTS.filter(e=>e[3]===k&&['corp','gov','pol'].includes(e[2]));if(!L.length)L=ENTS.filter(e=>['corp','gov'].includes(e[2]));return pick(L)||['x','대기업','corp',k,0];}
function huntBar63(H){return `<div class="kv" style="margin:6px 0"><div><span>증거</span><b style="color:var(--good)">${Math.round(H.ev)}</b></div><div><span>상대 반격</span><b style="color:var(--red)">${Math.round(H.cnt)}</b></div><div><span>마감까지</span><b>${Math.max(0,Math.ceil((H.wk-S.turn)/4))}개월</b></div><div><span>단계</span><b>${H.st+1}/${H.n}</b></div></div>`;}
RUN.hunt63=function(){const s=S.spec63;let H=S.hunt63;
  if(!H){const E=huntTarget63(s.d);const k=cat1(s.d);const tpl=pick(HUNT_T63[k]||HUNT_T63.soc);const last=(s.lv||0)>=2&&s.last&&!s.lastDone;
    H=S.hunt63={E:E[0],en:E[1],kind:E[2],title:tpl.replace('{E}',E[1]),st:0,n:last?5:4,ev:8+s.ex/10,cnt:5,wk:S.turn+(last?24:16),t0:S.turn,last:last?1:0,log:[]};
    openModal(last?'마지막 한 방 · 시작':'대형 추적 · 시작',`<p class="lede">${last?'마지막 대형 추적. ':''}책상 서랍에 오래 묵혀 둔 파일을 꺼냈다. <b>「${esc(H.title)}」</b></p>${huntBar63(H)}<p class="hint">단계마다 증거를 쌓고 반격을 버틴다. 마감 전에 터뜨려야 한다 — 늦으면 경쟁사가 먼저 쓴다. 상대 반격은 매달 저절로 오른다.</p>`,[{label:'추적을 시작한다',rec:true,fn:()=>{spend(2,6);setCd('hunt63');huntStage63();return false;}},{label:'아직 아니다',cls:'ghost',fn:()=>{S.hunt63=null;}}]);return false;}
  spend(2,6);setCd('hunt63');huntStage63();return false;};
function huntGo63(dEv,dCnt,msg){const H=S.hunt63;H.ev=clamp(H.ev+dEv,0,100);H.cnt=clamp(H.cnt+dCnt,0,100);H.log.push(msg);H.st++;S.spec63.ex=Math.min(100,S.spec63.ex+.4);
  if(H.st>=H.n-1){huntStage63();}else{openModal('대형 추적',`<p class="lede">${esc(msg)}</p>${huntBar63(H)}<p class="hint">다음 단계는 다음 달 「대형 추적」으로 이어진다.</p>`,[{label:'계속'}]);}return false;}
function huntStage63(){const H=S.hunt63;if(!H)return;const s=S.spec63;const sk=(S.st.inv||40)/100+s.ex/200;const name=esc(H.en);
  const head=`<p class="lede"><b>「${esc(H.title)}」</b></p>${huntBar63(H)}`;
  if(H.st===0)return openModal(`대형 추적 1/${H.n} · 첫 단서`,head+'<p>어디서부터 파고들까.</p>',[
    {label:'공개 자료 전수 분석',sub:'느리지만 안전 · 증거↑ · 반격 조금↑',fn:()=>huntGo63(R(12,18)+sk*6,R(2,5),'5년치 공시와 회의록을 밤새 맞춰 봤다. 숫자가 맞지 않는 곳이 세 군데 나왔다.')},
    {label:'내부자에게 접촉',sub:'증거↑↑ · 반격↑ · 취재원 노출 위험',risk:true,fn:()=>{if(chance(.2-sk*.1)){S.hunt63.cnt+=12;return huntGo63(R(5,10),R(10,16),'내부자가 만나자마자 겁을 먹었다. 우리가 뭔가 쥐고 있다는 소문이 상대 쪽에 돌았다.');}return huntGo63(R(20,28)+sk*8,R(7,11),'내부자가 이름은 빼 달라며 결재 라인을 짚어 줬다.');}},
    {label:`${name} 쪽에 슬쩍 질의`,sub:'반응을 본다 · 반격↑↑',fn:()=>huntGo63(R(6,12),R(14,20),`${H.en} 홍보실이 과하게 펄쩍 뛰었다. 뭔가 있다는 확신이 들었다. 대신 그쪽도 우리를 알게 됐다.`)}]);
  if(H.st===1)return openModal(`대형 추적 2/${H.n} · 결정적 증거`,head+'<p>결정적인 한 조각이 필요하다.</p>',[
    {label:'녹취 파일을 산다',sub:`증거↑↑↑ · 통장 -300만 · 윤리 논란 위험`,risk:true,disabled:S.money<300,fn:()=>{S.money-=300;if(chance(.25))S.pending.push({type:'ethic',why:'취재원에게 돈을 주고 녹취를 샀다',due:S.turn+R(8,20)});return huntGo63(R(26,34),R(4,8),'녹취 속 목소리가 분명했다. "그 건은 위에서 정리했어."');}},
    {label:'내부고발자를 설득한다',sub:`성공하면 증거↑↑↑ · 전문성이 높을수록 · 실패하면 반격↑↑`,fn:()=>{if(chance(.35+sk*.5))return huntGo63(R(28,36),R(3,6),'내부고발자가 결심했다. "실명으로 하겠습니다. 이번엔 누군가 끝까지 써 줄 것 같아서요."');return huntGo63(R(4,8),R(14,20),'내부고발자가 마지막에 물러섰다. 그리고 회사에 상담을 했다.');}},
    {label:'문건끼리 대조한다',sub:'안전 · 증거↑',fn:()=>huntGo63(R(14,20)+sk*6,R(2,5),'두 문건의 날짜가 이틀 어긋났다. 사후에 만든 서류다.')}]);
  if(H.st<H.n-1){const pressure=!S.founder&&(H.kind==='corp'||H.kind==='gov')&&chance(.6);
    if(pressure)return openModal(`대형 추적 ${H.st+1}/${H.n} · 사장실 호출`,head+`<p>사장실에서 불렀다. "${name} 건, 광고국이 난리야. 이번 건은 접지."</p>`,[
      {label:'버틴다 — 기사로 증명하겠다',sub:'증거가 탄탄하면 사장이 물러선다',fn:()=>{if(H.ev>=55||chance(.35))return huntGo63(R(4,8),R(3,6),'사장이 한참 서류를 넘기더니 말했다. "틀리면 자네가 책임지게."');S.hunt63.ev-=12;return huntGo63(0,R(4,8),'사장이 「표현 수위」를 조건으로 걸었다. 핵심 문단 두 개가 빠졌다.');}},
      {label:'반론을 받아 싣겠다고 설득한다',sub:'반격↓ · 증거 조금↑',fn:()=>huntGo63(R(4,8),-R(8,14),`${H.en}의 반론을 충실히 받기로 했다. 사장도 「공정하게 한다면」이라며 물러섰다.`)},
      {label:'사표를 품에 넣고 들어간다',sub:'평판↑ · 사장이 물러서거나, 회사를 나간다',risk:true,fn:()=>{if(chance(.55)){apply({fame:2});return huntGo63(R(6,10),R(2,4),'사표를 책상에 올려놓자 사장실이 조용해졌다. "…알았네. 쓰게."');}
        S.hunt63=null;S.spec63.fail=(S.spec63.fail||0)+1;openModal('펜을 꺾지 않았다',`<p class="lede">사장은 사표를 받았다. 다음 날, 「${esc(H.title)}」 취재 파일을 들고 회사를 나왔다. 기자협회가 성명을 냈다.</p>${fxLine(apply({fame:6,trust:4}))}`,[{label:'커리어를 마무리한다',fn:()=>{ending('펜을 꺾지 않았다');return false;}}]);return false;}}]);
    return openModal(`대형 추적 ${H.st+1}/${H.n} · 반격`,head+`<p>${name} 쪽이 대형 로펌을 선임했다. 우리 취재원 명단을 캐묻는 내용증명이 왔다.</p>`,[
      {label:'반론을 정식으로 요청한다',sub:'반격↓ · 증거 조금↑ · 공정성',fn:()=>huntGo63(R(5,9),-R(10,16),'반론 요청서를 보냈다. 저쪽 답변서에서 오히려 새 단서가 나왔다.')},
      {label:'취재원을 숨기고 정면 돌파',sub:'증거↑ · 반격↑',fn:()=>huntGo63(R(10,16),R(6,10),'내용증명은 서랍에 넣었다. 취재원 두 명을 더 만났다.')},
      {label:'추가 취재로 판을 키운다',sub:'증거↑↑ · 반격↑↑ · 마감 1개월 연장',risk:true,fn:()=>{S.hunt63.wk+=4;return huntGo63(R(16,24),R(12,18),'같은 수법이 다른 계열사에도 있었다. 판이 커졌다.');}}]);}
  // 마지막 단계: 터뜨릴 때
  return openModal(`대형 추적 ${H.n}/${H.n} · 터뜨릴 때`,head+'<p>모든 조각이 책상 위에 있다. 지금인가.</p>',[
    {label:'지금 출고한다',rec:H.ev>=60,sub:`예상: ${H.ev-H.cnt*.4+s.ex*.2>=55?'성공 가능성 높다':'아직 약하다'}`,fn:()=>{huntEnd63();return false;}},
    {label:'2주만 더 다진다',sub:'증거↑ · 경쟁사가 먼저 쓸 위험',risk:true,fn:()=>{if(chance(.3+(S.turn>H.wk-6?.25:0))){huntLost63('경쟁사가 하루 먼저 터뜨렸다.');return false;}S.hunt63.ev=clamp(S.hunt63.ev+R(8,14),0,100);huntEnd63();return false;}}]);}
function huntLost63(why){const H=S.hunt63;S.hunt63=null;S.huntT63=S.turn;const s=S.spec63;s.fail=(s.fail||0)+1;s.ex=Math.max(0,s.ex-6);
  openModal('낙종',`<p class="lede">${esc(why)} 「${esc(H.title)}」 — 몇 달을 쫓은 이야기가 남의 1면에 실렸다.</p><p class="hint">우리 취재 메모는 후속 보도로 쓴다.</p>${fxLine(apply({fame:-1.5,eval:-1}))}`,[{label:'다음을 노린다'}]);}
function huntEnd63(){const H=S.hunt63;if(!H)return;const s=S.spec63;S.hunt63=null;S.huntT63=S.turn;const sc=H.ev-H.cnt*.4+s.ex*.2+R(-6,6);const d=DEPTS[s.d]?s.d:S.dept;
  const mk=(imp,q,lead)=>{const clip={h:`[단독] ${H.title}`,o:OUT().n,d:DEPTS[d]?d:S.dept,q,imp,excl:true,date:dateShort(),turn:S.turn,views:Math.round((OUT().p+1)*R(80,160)*1000*imp/80),lead,by:S.name,place:imp>=85?'1면 톱':'1면',portal:''};S.clips.unshift(clip);if(S.clips.length>60)S.clips.pop();S.totalArticles=(S.totalArticles||0)+1;S.scoops=(S.scoops||0)+1;tick(`[${OUT().n}] ${clip.h}`,1);return clip;};
  if(sc>=55){const c=mk(R(88,98),R(78,92),`${H.en}의 조직적 비리가 내부 문건과 증언으로 확인됐다.`);s.ok=(s.ok||0)+1;s.ex=Math.min(100,s.ex+8);S.tokjong=(S.tokjong||0)+1;
    const imp={corp:`검찰이 ${H.en} 본사를 압수수색했다. 회장이 대국민 사과와 함께 물러났다.`,gov:`감사원이 특별감사에 착수했고, 기관장이 사의를 밝혔다.`,pol:`당사자가 불출마를 선언했다. 국회는 관련법 개정안을 발의했다.`}[H.kind]||'관련 기관이 전면 조사에 들어갔다. 제도 개선안이 나왔다.';
    const last=H.last;if(last)s.lastDone=1;
    openModal(last?'마지막 한 방':'1면 톱',`${clipHTML(c)}<p class="lede" style="margin-top:10px">${esc(imp)}</p><p>몇 달을 버틴 추적이 사회를 움직였다.${(s.lv||0)<2&&s.ex>=85?' 대기자 승격 조건이 채워졌다.':''}</p>${fxLine(apply({fame:7,trust:3,eval:3}))}`,
      last?[{label:'펜을 내려놓는다 — 「대기자」 엔딩',fn:()=>{ending('대기자');return false;}},{label:'정년까지 남는다'}]:[{label:'신문이 깔리는 걸 본다'}]);
    log(`대형 추적 성공: ${H.title}`);return;}
  if(sc>=40){const c=mk(R(66,76),R(62,72),`${jo2(H.en,'을','를')} 둘러싼 의혹이 일부 확인됐다.`);s.ex=Math.min(100,s.ex+4);if(chance(.5))S.pending.push({type:'suit',title:c.h,due:S.turn+R(6,16)});
    openModal('반쪽짜리 특종',`${clipHTML(c)}<p>기사는 나갔지만 결정적인 연결 고리가 약했다. ${esc(H.en)} 쪽이 법적 대응을 예고했다.</p>${fxLine(apply({fame:2,eval:1}))}`,[{label:'후속을 준비한다'}]);return;}
  const c=mk(R(50,60),R(45,55),`${H.en} 관련 의혹이 제기됐다.`);s.fail=(s.fail||0)+1;s.ex=Math.max(0,s.ex-7);S.pending.push({type:'err',title:c.h,due:S.turn+R(2,6),why:['결정적 증거 없이 대형 의혹을 단정했다']});
  openModal('무리한 출고',`${clipHTML(c)}<p>증거가 모자랐다. 반박 자료가 쏟아졌고, 전문성에 금이 갔다.</p>${fxLine(apply({fame:-2,trust:-3}))}`,[{label:'받아들인다'}]);}
// 매달: 반격은 저절로 오르고, 마감이 지나면 낙종
function huntMonth63(lines){const H=S.hunt63;if(!H)return;H.cnt=clamp(H.cnt+R(2,5),0,100);if(S.turn>H.wk){huntLost63('마감을 넘겼다. 경쟁사가 먼저 터뜨렸다.');return;}if(H.wk-S.turn<=4)lines.push({c:'r',t:`대형 추적 「${H.title}」 — 마감까지 한 달. 경쟁사도 냄새를 맡았다`});}

// ---------- 다시 위로: 정기 인사 때 「다음 자리」를 고른다 ----------
// 선임: 전문 에디터(부국장급) · 논설위원 · 남는다 / 대기자: 명망가 편집국장(임명동의) · 주필 직행 · 언론인 출신 사장 · 남는다
function edVote63(){const s=S.spec63;return Math.round(clamp(40+S.trust*.3+S.fame*.2+(s.ok||0)*8+R(-10,10),0,99));}
function nextSeats63(){const s=S.spec63,lv=s.lv||0,O=[];const opO=typeof opOK==='function'&&opOK();
  if(lv===1){if(S.fame>=45&&s.ex>=60)O.push('editor');if(opO&&S.fame>=40)O.push('op1');}
  if(lv>=2){if(S.fame>=55&&S.trust>=55)O.push('chief');if(opO&&S.fame>=55)O.push('jupil');if(years()>=20&&S.fame>=70&&!s.ceoOf)O.push('ceo');}return O;}
function seatGo63(k,r0){const s=S.spec63;
  if(k==='editor'){specLeave63(r0);while(nextRank(S.rank)!=null&&nextRank(S.rank)<4)S.rank=nextRank(S.rank);S.edtr63=specField()||1;promote();log('전문 에디터 발탁');try{ach('edtr63');}catch(e){}return;}
  if(k==='op1'){const keep=s.ex;S.spec63=null;S.inRank=0;opEnter(1,'선임 전문기자 출신');try{S.op.inf+=8;}catch(e){}log('논설위원 전보 (선임 전문기자 출신)');return;}
  if(k==='jupil'){s.ed=1;S.inRank=0;opEnter(3,'대기자 출신 주필');try{S.op.inf=Math.max(S.op.inf,50);S.op.agenda68=Math.round((s.op||0)*.6);}catch(e){}log('주필 직행 (대기자 출신)');tick(`${OUT().n} 인사 — ${S.name} 대기자, 주필로`,1);try{ach('jupil63');metaMark('titles','대기자 출신 주필');}catch(e){}return;}
  if(k==='ceo'){s.ceoOf=1;s.ed=1;while(nextRank(S.rank)!=null&&nextRank(S.rank)<7)S.rank=nextRank(S.rank);S.inRank=0;promote();log('언론인 출신 사장 취임');try{ach('ceo63');metaMark('titles','언론인 출신 사장');}catch(e){}return;}
  if(k==='chief'){const vote=edVote63();if(vote>=60){s.ed=1;while(nextRank(S.rank)!=null&&nextRank(S.rank)<6)S.rank=nextRank(S.rank);S.inRank=0;if(!(S.team||[]).length)S.team=genTeam();promote();try{ach('mged63');metaMark('titles','명망가 편집국장');}catch(e){}
      Q.unshift(()=>openModal('임명동의 통과',`<p class="lede">찬성 ${vote}%. 대기자 출신 편집국장이다. 첫 출근길, 후배들이 복도에 늘어섰다.</p><p class="hint">편집국장이 돼도 「대형 추적」을 할 수 있다(「국장의 펜」). 대신 경영진과 더 자주 부딪친다.</p>`,[{label:'편집국장실로'}]));log('명망가 편집국장 취임');}
    else openModal('임명동의 부결',`<p class="lede">찬성 ${vote}%. 기자들은 「현장에 남아 달라」는 쪽을 택했다.</p>${fxLine(apply({fame:.5}))}`,[{label:'펜으로 돌아간다'}]);return;}}
const SEAT63={editor:['전문 에디터 (부국장급)','분야 섹션 총괄 · 관리직 사다리로 복귀 · 이후 국장·편집국장'],op1:['논설위원','이름 없이 회사의 목소리(사설) · 논설실장 → 주필 사다리'],
  chief:['명망가 편집국장 (임명동의 투표)','부국장·국장 건너뜀 · 찬성 60% 이상 · 편집국장이 돼도 대형 추적 가능'],
  jupil:['주필 직행','논설위원실 꼭대기 · 1면 기명 주필 칼럼 · 「편집권 방패」 · 정년 +5 · 임원 대우'],
  ceo:['언론인 출신 사장 후보','경영을 맡는다 · 이사회 임기제']};
{const _jn63=jinsa;jinsa=function(){if(!isSpec())return raceJinsa63(_jn63);const s=S.spec63;const parts=[];try{const np=npcReshuffle();if(np)parts.push(np);}catch(e){}try{const nj=npcJinsa();if(nj)parts.push(nj);}catch(e){}
  const lv=s.lv||0;const r0=S.rank;const O=specOutletOK()?nextSeats63():[];
  if(O.length&&chance(lv>=2?.6:.45)){openModal('정기 인사 · 다음 자리',parts.join('')+`<p class="lede">${lv>=2?'사장실에서 대기자에게 「다음 자리」를 물었다.':'편집국장이 선임 전문기자에게 「다음 자리」를 물었다.'}</p><p class="hint">고르면 지금 트랙을 떠난다. 남으면 다음 인사 때 다시 물어볼 수 있다.</p>`,
    O.map(k=>({label:SEAT63[k][0],sub:SEAT63[k][1]+(k==='chief'?` · 예상 찬성 약 ${Math.round(clamp(40+S.trust*.3+S.fame*.2+(s.ok||0)*8,0,99))}%`:''),fn:()=>{seatGo63(k,r0);}})).concat([{label:`${jo2(SPEC_T[lv],'으로','로')} 남는다 — 펜이 더 좋다`,sub:'평판 조금↑',fn:()=>{toast(apply({fame:.8}));}}]));return;}
  openModal('정기 인사 발표',parts.join('')+`<p>${esc(specTitle())} — 인사와 상관없이 전문성으로 평가받는다. 전문성 ${Math.round(s.ex)}/100${lv===0?' · 55면 선임':lv===1?' · 선임은 정기 인사에서 전문 에디터·논설위원 후보':' · 대기자는 편집국장·주필·사장 후보'}.</p>`);};}


// ---------- 승진 레이스 (관리직 사다리에서 오래 머물 때) ----------
function raceStart63(lines){if(isSpec()||S.race63||S.founder||S.story||S.op||!S.co||S.rank<1||S.rank>4)return;const nx=nextRank(S.rank);if(nx==null)return;if(S.inRank<promoMinW(S.rank)*.9||S.turn-(S.raceT63??-999)<YW)return;if(!chance(.3))return;
  let rv=null;try{const per=roster();const L=(per[S.dept]||[]).concat(...Object.values(per)).filter(m=>m&&m.name&&(m.r||0)===Math.max(0,S.rank-1)&&!(S.team||[]).includes(m));rv=L.sort((a,b)=>(b.skill||0)-(a.skill||0))[0];}catch(e){}
  const nm=rv?rv.name:rname();const sk=rv?rv.skill||55:R(55,70);S.race63={nm,sk,rv:0,e0:S.eval,s0:S.scoops||0,c0:(S.clips||[]).length,f0:S.fame,t0:S.turn};
  Q.push(()=>openModal('승진 레이스',`<p class="lede">다음 정기 인사, <b>${esc(rankName(nx))}</b> 자리는 하나다. 후보는 둘 — 나와 <b>${esc(nm)}</b>.</p><p>지금부터 인사 때까지 <b>사내 평가·단독·출고·평판</b>이 점수가 된다. 상대도 뛴다(실력 ${Math.round(sk)}).</p><p class="hint">이기면 다른 조건이 조금 모자라도 승진한다(신뢰 40 이상). 지면 상대가 올라가고, 다음 레이스까지 1년.</p>`,[{label:'붙어 보자'}]));}
function raceScore63(R0){R0=R0||S.race63;return Math.round(((S.eval-R0.e0)*.8+((S.scoops||0)-R0.s0)*4+((S.clips||[]).length-R0.c0)*.6+(S.fame-R0.f0)*.5)*10)/10;}
function raceMonth63(lines){const R0=S.race63;if(!R0)return;R0.rv=Math.round((R0.rv+(R0.sk-50)/12+R(0,3)+.5)*10)/10;const me=raceScore63();if(month()%2===0)lines.push({c:me>=R0.rv?'g':'r',t:`승진 레이스 — 나 ${me} : ${R0.nm} ${R0.rv}`});}
function raceJinsa63(base){const R0=S.race63;const r0=S.rank;base();if(!R0||S.turn-R0.t0<8)return;S.race63=null;S.raceT63=S.turn;const me=raceScore63(R0);
  if(S.rank!==r0){Q.push(()=>openModal('승진 레이스 · 결과',`<p class="lede">레이스와 상관없이 조건을 다 채워 올라갔다. ${esc(R0.nm)}도 다음 인사를 노린다.</p>`));return;}
  if(me>=R0.rv&&S.trust>=40&&S.inRank>=promoMinW(S.rank)*.9){Q.push(()=>{openModal('승진 레이스 · 승리',`<p class="lede">나 ${me} : ${esc(R0.nm)} ${R0.rv}. 인사위원회가 나를 택했다.</p>`,[{label:'자리로',fn:()=>{promote();return false;}}]);});log(`승진 레이스 승리 (vs ${R0.nm})`);S.raceW63=(S.raceW63||0)+1;}
  else{Q.push(()=>openModal('승진 레이스 · 패배',`<p class="lede">나 ${me} : ${esc(R0.nm)} ${R0.rv}. ${esc(R0.nm)}${jp(R0.nm,'이','가')} 올라갔다. 축하 자리에서 그가 잔을 내밀었다. "다음엔 선배 차례야."</p><p class="hint">1년 뒤 다시 레이스가 열린다. 그 사이 전문기자 제안이 올 수도 있다.</p>${fxLine(apply({eval:1}))}`));try{const per=roster();Object.values(per).flat().forEach(m=>{if(m&&m.name===R0.nm)m.r=Math.min(3,(m.r||0)+1);});}catch(e){}}}

// ---------- 매달 묶음 ----------
{const _om63=orgMonth;orgMonth=function(lines){const r=_om63.apply(this,arguments);try{if(S&&S.phase==='game'&&!S.story){if(S.m63!==Math.floor(S.turn/4)){S.m63=Math.floor(S.turn/4);specOffer63(lines);if(S.spec63)specMonth63(lines);huntMonth63(lines);raceStart63(lines);raceMonth63(lines);}}}catch(e){console.error(e);}return r;};}
// 엔딩: 전문기자·대기자 정년
{const _en63=ending;ending=function(kind){try{if(S&&S.spec63&&/^정년퇴직/.test(String(kind)))kind=(S.spec63.lv||0)>=2?'대기자 · 펜을 내려놓다':'전문기자로 정년';}catch(e){}return _en63.call(this,kind);};}
try{END_DEX.push(['대기자','retire','전문기자로 시작해 대기자에 오르고, 마지막 대형 추적을 성공시킨다'],['대기자 · 펜을 내려놓다','retire','대기자로 정년을 맞는다'],['전문기자로 정년','retire','관리직 대신 한 분야 전문기자로 정년까지 간다'],['펜을 꺾지 않았다','fired','대형 추적 기사를 지키려 사표를 던진다']);}catch(e){}
try{Object.assign(END_HOW,{'대기자':'전문기자 제안을 받아 대기자까지 오른 뒤, 정년 3년 전 「마지막 한 방」을 성공시킨다','대기자 · 펜을 내려놓다':'대기자로 정년까지 간다','전문기자로 정년':'전문기자로 남아 정년을 맞는다','펜을 꺾지 않았다':'대형 추적 중 사장실 호출에서 사표를 던진다'});}catch(e){}
{const _eh63=endHTML;endHTML=function(){let h=_eh63.apply(this,arguments);try{if(S.spec63&&(S.spec63.lv||0)>=2&&!S.spec63.ed)h=h.replace(/<h1([^>]*)>[^<]*<\/h1>/,'<h1$1>한 시대의 대기자</h1>');}catch(e){}return h;};}
// 맡기기 AI: 추적이 진행 중이면 이어 가고, 대기자는 칼럼을 챙긴다
{const _rc63=recommend;recommend=function(){const r=_rc63.apply(this,arguments);try{if(specOn()&&r!=='rest'&&r!=='breaking'){if(S.hunt63&&!why('hunt63'))return 'hunt63';if(isSpec()&&(S.spec63.lv||0)>=2&&!why('col63')&&chance(.5))return 'col63';if(isSpec()&&!S.hunt63&&!why('hunt63')&&S.spec63.ex>=35)return 'hunt63';}}catch(e){}return r;};}
try{AUTO_DIR.scoop.acts.unshift('hunt63');AUTO_DIR.promo.acts.push('hunt63','col63');}catch(e){}

// ───── (예전 v64.js) ─────
/* 바이라인 — src/compat/v64.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.7 전문기자·선임·대기자를 조직에 넣는다 (정원 · 선임할 이유 · 비용) =====
// NPC도 전문기자 → 선임 전문기자 → 대기자로 큰다 (m.sp63: 1 전문기자 · 2 선임 · 3 대기자)
// 정원: 전문기자 부서당 1명 · 선임 회사 3명 · 대기자 회사 1명 — 나(플레이어)도 이 정원 안에서 움직인다
// 인사권자(편집국장·사장·창간 대표)는 조직 운영에서 직접 선임한다. 인사권이 없으면 경영진(AI)이 해마다 정한다.
// 선임할 이유(매달): 전문기자 — 부서 단독↑·분야 기관 관계↑·보도 품질↑ / 선임 — 방송 패널로 트래픽↑·회사 이름값↑ / 대기자 — 신뢰↑·구독↑·회사 위상↑(창간이면 성장 점수↑)
// 비용: 매달 인건비(전문 40만 · 선임 80만 · 대기자 150만), 팀장·차장 후보에서 빠진다
const SPN64=['','전문기자','선임 전문기자','대기자'];
const SPCAP64={sen:3,boss:1};
const SPCOST64=[0,.004,.008,.015];
const SPWHY64=['','부서 단독↑ · 분야 기관 관계↑ · 보도 품질↑','방송 패널로 트래픽↑ · 회사 이름값↑ · 단독↑','신뢰↑ · 구독↑ · 회사 위상↑'];
function spOK64(){try{return !!(S&&S.co&&(S.founder||specOutletOK()));}catch(e){return false;}}
function spAll64(){const out=[];try{const per=roster();const seen=new Set();Object.keys(per).forEach(d=>(per[d]||[]).forEach(m=>{if(m&&m.sp63&&!seen.has(m)){seen.add(m);out.push([m,d]);}}));}catch(e){}return out;}
function spBoss64(){return spAll64().find(([m])=>m.sp63===3)||null;}
function meLv64(){return S&&S.spec63&&!S.spec63.ed?(S.spec63.lv||0)+1:0;}   // 1 전문 · 2 선임 · 3 대기자
function spDeptTaken64(d){return spAll64().some(([m,dd])=>dd===d&&m.sp63===1)||(meLv64()===1&&specD()===d);}
function spSenN64(){return spAll64().filter(([m])=>m.sp63===2).length+(meLv64()===2?1:0);}
function spBossTaken64(){return !!spBoss64()||meLv64()===3;}
function spTO64(){const D=orgDepts();const n1=spAll64().filter(([m])=>m.sp63===1).length+(meLv64()===1?1:0);return {spec:[n1,D.length],sen:[spSenN64(),SPCAP64.sen],boss:[spBossTaken64()?1:0,1]};}
// 기준: 창간 매체는 사람이 적고 연차가 짧아 문턱을 낮춘다
function spReq64(lv){const f=!!S.founder;return lv===1?{sk:f?58:62,y:f?6:10}:lv===2?{sk:f?66:72,y:f?9:15}:{sk:f?74:80,y:f?12:20};}
// 관리 자리에서 빠진다
{const _oh64=orgHead;orgHead=function(L){return _oh64.call(this,(L||[]).filter(m=>!m||!m.sp63));};}
{const _mi64=mids45;mids45=function(L){return _mi64.call(this,(L||[]).filter(m=>!m||!m.sp63));};}
{const _oc64=orgCands;orgCands=function(d){return (_oc64.apply(this,arguments)||[]).filter(m=>!m.sp63);};}
{const _dm64=deptMates;deptMates=function(){const L=_dm64.apply(this,arguments);try{(L||[]).forEach(m=>{if(m&&m.sp63)m.role=SPN64[m.sp63]+(m.sp63<3&&DEPTS[m.d]?` · ${DEPTS[m.d].n.replace(/(부|팀)$/,'')}`:'');});}catch(e){}return L;};}
// 지정 · 해제 (정원 · 인건비)
function spCanSet64(m,lv){if(lv===1)return !spDeptTaken64(m.d)||'이 부서엔 이미 전문기자가 있다';if(lv===2)return spSenN64()<SPCAP64.sen||`선임 정원(${SPCAP64.sen}명)이 찼다`;if(lv===3)return !spBossTaken64()||'대기자는 회사에 한 명';return true;}
function spSet64(m,lv,why){if(!m)return false;if(lv){const ok=spCanSet64(m,lv);if(ok!==true){toast(ok);return false;}}
  const old=m.sp63||0;try{if(S.co)S.co.extra=Math.max(0,+((S.co.extra||0)-SPCOST64[old]+(lv?SPCOST64[lv]:0)).toFixed(4));}catch(e){}
  if(lv>0&&(m.r||0)>=2)m.r=1;if(lv)m.sp63=lv;else delete m.sp63;m.rel=clamp((m.rel??20)+(lv?(lv>old?8:0):-6),-50,100);log(`인사: ${m.name} ${lv?SPN64[lv]+' 선임':'전문기자 해제'}${why?' — '+why:''}`);return true;}
function spCand64(d,lv){const q=spReq64(lv||1);const per=roster();const L=d?(per[d]||[]):Object.values(per).flat();const head=x=>x===orgHead(per[x.d]||[]);const me=S.founder?[]:(S.rank<6?(S.team||[]):[]);
  return L.filter(m=>m&&m.name&&!m.sp63&&!m.cofounder&&!me.includes(m)&&(m.r||0)<=1&&myrs(m)>=q.y&&(m.skill||0)>=q.sk&&!head(m)).sort((a,b)=>(b.skill||0)-(a.skill||0));}
// 조직 운영 창: 부서별 전문기자 + 선임·대기자 승격 (효과·비용을 보여 준다)
function spBtn64(mc,lab,sub,fn,dis,tag){const b=document.createElement('button');b.className='ch';b.dataset[tag||'sp64']=1;if(dis)b.disabled=true;b.innerHTML=`<span class="cl">${esc(lab)}</span><span class="chips"><i class="cp">${esc(sub)}</i></span>`;b.onclick=fn;const back=[...mc.querySelectorAll('button')].pop();if(back&&back.parentNode)back.parentNode.insertBefore(b,back);else mc.appendChild(b);return b;}
const won64=v=>`월 ${Math.round(v*10000).toLocaleString('ko-KR')}만`;
{const _od64=org45Dept;org45Dept=function(d){_od64.apply(this,arguments);try{const mc=$('#mc');if(!mc||mc.querySelector('[data-sp64]')||!spOK64())return;const per=roster();const L=(per[d]||[]);const sp=L.filter(m=>m.sp63);const taken=spDeptTaken64(d);const c=taken?[]:spCand64(d,1).slice(0,2);
  const add=(lab,sub,fn,dis)=>spBtn64(mc,lab,sub,()=>{fn();org45Dept(d);},dis);
  if(taken&&!sp.some(m=>m.sp63===1))add('전문기자 자리 — 나','이 부서 전문기자 정원(1명)은 내가 쓰고 있다',()=>{},true);
  c.forEach(m=>add(`${m.name} — 전문기자 선임`,`실력 ${Math.round(m.skill)} · ${myrs(m)}년 차 · ${SPWHY64[1]} · 인건비 ${won64(SPCOST64[1])} · 팀장 후보에서 빠진다`,()=>spSet64(m,1)));
  if(!taken&&!c.length){const q=spReq64(1);add('전문기자 후보 없음',`실력 ${q.sk} · ${q.y}년 차 이상 · 팀장 아닌 사람`,()=>{},true);}
  sp.forEach(m=>{const q=spReq64(2);if(m.sp63===1&&(m.skill||0)>=q.sk&&myrs(m)>=q.y)add(`${m.name} — 선임 전문기자로`,`선임 ${spSenN64()}/${SPCAP64.sen} · ${SPWHY64[2]} · 인건비 ${won64(SPCOST64[2])}`,()=>spSet64(m,2),spSenN64()>=SPCAP64.sen);
    add(`${m.name} ${SPN64[m.sp63]} 해제`,'관리직으로 돌린다 · 인건비↓ · 섭섭해한다',()=>spSet64(m,0));});}catch(e){console.error(e);}};}
{const _oo64=org45Open;org45Open=function(){_oo64.apply(this,arguments);try{const mc=$('#mc');if(!mc||mc.querySelector('[data-sp64o]')||!spOK64())return;const T=spTO64();const b0=spBoss64();const me=meLv64()===3;const q=spReq64(3);const c=spAll64().filter(([m])=>m.sp63===2&&(m.skill||0)>=q.sk&&myrs(m)>=q.y).map(x=>x[0]).sort((a,b)=>(b.skill||0)-(a.skill||0))[0];
  spBtn64(mc,`전문기자 ${T.spec[0]}/${T.spec[1]} · 선임 ${T.sen[0]}/${T.sen[1]} · 대기자 ${me?'나':b0?b0[0].name:'공석'}`,me||b0?`대기자: ${SPWHY64[3]} · 회사에 한 명`:c?`대기자 후보: 선임 ${c.name}(실력 ${Math.round(c.skill)}) — 누르면 선임 · ${SPWHY64[3]} · 인건비 ${won64(SPCOST64[3])}`:`대기자 후보가 없다 (선임 중 실력 ${q.sk} · ${q.y}년 차) · 부서를 누르면 전문기자를 선임한다`,()=>{if(!me&&!b0&&c&&spSet64(c,3)){toast(`${c.name}, 대기자 선임`);}org45Open();},false,'sp64o');}catch(e){console.error(e);}};}
// 조직 탭: 정원 현황 · 명단 · 이달의 효과
{const _tb64=tabBody;tabBody=function(){let h=_tb64.apply(this,arguments);try{if(S.tab==='org'&&!S.story&&S.co&&(spOK64()||specOn())){const L=spAll64();const T=spTO64();const me=specOn()?`<li><span class="tg pc">나</span><b>${esc(S.name)}</b> — ${esc(S.spec63.ed?rankName()+' (대기자 출신)':specTitle())} · 전문성 ${Math.round(S.spec63.ex)}</li>`:'';
    const rows=L.sort((a,b)=>b[0].sp63-a[0].sp63).slice(0,10).map(([m,d])=>`<li><span class="tg pc">${SPN64[m.sp63]}</span><b>${esc(m.name)}</b> — ${DEPTS[d]?esc(DEPTS[d].n):''} · 실력 ${Math.round(m.skill)} · ${myrs(m)}년 차</li>`).join('');const cost=L.reduce((a,[m])=>a+SPCOST64[m.sp63],0);const F=S.sp64Fx||{};
    h=`<div class="card"><div class="t">${ic('star')} 전문기자 · 선임 · 대기자</div><p class="hint" style="margin:0 0 6px">정원 — 전문기자 ${T.spec[0]}/${T.spec[1]}(부서당 1명) · 선임 ${T.sen[0]}/${T.sen[1]} · 대기자 ${T.boss[0]}/1${cost?` · 인건비 ${won64(cost)}`:''}</p><ul class="pnl">${me}${rows||'<li>아직 없다 — '+(orgCanRun()?'조직 운영에서 선임한다':'경영진이 해마다 정한다')+'</li>'}</ul>${F.n?`<p class="hint" style="margin:6px 0 0">지난달 효과: 단독 ${F.sc||0}건 · 보도 품질 +${(F.q||0).toFixed(1)} · 신뢰 +${(F.tr||0).toFixed(2)}${F.bs?' · 구독↑':''}${F.bt?' · 트래픽↑':''}</p>`:''}<p class="hint" style="margin:6px 0 0">전문기자 ${SPWHY64[1]} · 선임 ${SPWHY64[2]} · 대기자 ${SPWHY64[3]}</p></div>`+h;}}catch(e){console.error(e);}return h;};}
// 매달: 선임할 이유가 실제로 돌아온다 · 해마다 경영진(AI) 지정 · 은퇴로 자리가 빈다
{const _om64=orgMonth;orgMonth=function(lines){const r=_om64.apply(this,arguments);try{if(!S.co||S.story||S.m64===Math.floor(S.turn/4))return r;S.m64=Math.floor(S.turn/4);const L=spAll64();const F={n:L.length,sc:0,q:0,tr:0,bs:0,bt:0};const show=orgCanRun();
    L.forEach(([m,d])=>{m.skill=clamp((m.skill||50)+.05,10,95);const lv=m.sp63;
      const p=lv===1?.07:lv===2?.08:0;if(p&&chance(p)){S.co.q=Math.min(100,S.co.q+.4);F.sc++;F.q+=.4;if(lines&&(show||d===S.dept))lines.push({c:'g',t:`${DEPTS[d]?DEPTS[d].n:''} ${m.name} ${SPN64[lv]} 단독 — 분야 기사가 포털 1위`});}
      if(lv===1){S.co.q=Math.min(100,S.co.q+.05);F.q+=.05;try{const ents=ENTS.filter(e=>catOf(d).includes(e[3])&&S.net&&S.net[e[0]]);const e=pick(ents);if(e&&chance(.5))netUp(e[0],1);}catch(e){}}
      if(lv===2){try{S.co.bT=(S.co.bT||0)+.0015;F.bt=1;}catch(e){}if(show)S.fame=Math.min(100,S.fame+.04);}
      if(lv===3){S.co.q=Math.min(100,S.co.q+.15);F.q+=.15;S.trust=Math.min(100,S.trust+.08);F.tr+=.08;try{S.co.bS=(S.co.bS||0)+.002;F.bs=1;}catch(e){}if(S.founder)S.fScore=(S.fScore||40)+.2;if(chance(.04)&&lines)lines.push({c:'g',t:`${m.name} 대기자 칼럼이 화제가 됐다 — 신뢰·구독↑`});}
      try{if(npcAge(m)>=60&&chance(.5)){const nm=SPN64[lv]||'전문기자';spSet64(m,0,'정년');if(lines&&(show||d===S.dept))lines.push({c:'',t:`${m.name} ${nm} 정년 — 자리가 하나 비었다`});}}catch(e){}});
    S.sp64Fx=F;
    if(spOK64()&&!orgCanRun()&&!S.founder&&month()===1&&S.sp64Y!==Math.floor(S.turn/YW)){S.sp64Y=Math.floor(S.turn/YW);
      const n1=L.filter(([m])=>m.sp63===1).length;if(n1<Math.max(1,Math.round(orgDepts().length/3))){const c=spCand64(null,1).find(m=>!spDeptTaken64(m.d)&&(m.skill||0)>=68&&myrs(m)>=14);if(c&&spSet64(c,1,'경영진 선임')&&lines)lines.push({c:'',t:`인사: ${c.name}, ${DEPTS[c.d]?DEPTS[c.d].n.replace(/(부|팀)$/,''):''} 전문기자 선임`});}
      const q2=spReq64(2);const up=L.filter(([m])=>m.sp63===1&&(m.skill||0)>=q2.sk&&myrs(m)>=q2.y).map(x=>x[0]).sort((a,b)=>b.skill-a.skill)[0];if(up&&spSenN64()<SPCAP64.sen&&spSet64(up,2,'경영진 승격')&&lines)lines.push({c:'',t:`인사: ${up.name}, 선임 전문기자`});
      const q3=spReq64(3);if(!spBossTaken64()&&OUT().p>=3){const b=L.filter(([m])=>m.sp63===2&&(m.skill||0)>=q3.sk&&myrs(m)>=q3.y).map(x=>x[0]).sort((a,b)=>b.skill-a.skill)[0];if(b&&chance(.5)&&spSet64(b,3,'경영진 선임')&&lines)lines.push({c:'',t:`인사: ${b.name} 대기자 선임 — 회사에 대기자가 생겼다`});}}}catch(e){console.error(e);}return r;};}
// 인사권자 AI: 선임할 이유가 있으면(빈 부서·여유 자금) 조직 운영을 권하고, 맡기기면 알아서 한 명 선임한다
function spAutoPick64(){if(!spOK64()||!orgCanRun())return null;const cash=S.co.cash||0;if(cash<(S.founder?1:5))return null;
  const T=spTO64();const D=orgDepts().filter(d=>!spDeptTaken64(d));for(const d of D){const c=spCand64(d,1)[0];if(c)return [c,1];}
  const q2=spReq64(2);if(T.sen[0]<SPCAP64.sen){const u=spAll64().filter(([m])=>m.sp63===1&&(m.skill||0)>=q2.sk&&myrs(m)>=q2.y).map(x=>x[0])[0];if(u)return [u,2];}
  const q3=spReq64(3);if(!spBossTaken64()){const b=spAll64().filter(([m])=>m.sp63===2&&(m.skill||0)>=q3.sk&&myrs(m)>=q3.y).map(x=>x[0])[0];if(b)return [b,3];}return null;}
{const _rc64=recommend;recommend=function(){const r=_rc64.apply(this,arguments);try{if(S&&!S.story&&r!=='rest'&&r!=='breaking'&&S.turn-(S.spRec64??-99)>=YW/2&&spAutoPick64()){const id=S.founder?(rankActs().includes('fhire')?null:null):'personnel';if(id&&rankActs().includes(id)&&!why(id)){S.spRec64=S.turn;return id;}}}catch(e){}return r;};}
{const _am64=autoMonthRun;autoMonthRun=async function(k){try{if(S&&!S.story&&S.turn-(S.spAuto64??-99)>=YW/2){const x=spAutoPick64();if(x&&spSet64(x[0],x[1],'맡기기')){S.spAuto64=S.turn;log(`맡기기: ${x[0].name} ${SPN64[x[1]]} 선임`);}}}catch(e){}return _am64.apply(this,arguments);};}
