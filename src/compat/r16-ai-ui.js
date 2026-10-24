// 1.6 · AI 개선 · 안내 · 관계 한눈에 · NaN 방지 · 화면 간소화 · 밸런스 · 할 일 카드 아이콘 · 삭제 요청 · 내 지갑 · 봉투 팝업 · 투자·충성·지분 인수 · 전수 조사(버그·AI 선택·금고·광고 목표)
// 예전 파일 v51.js · v52.js · v53.js · v54.js · v55.js · v56.js · v57.js · v58.js · v59.js · v60.js · v61.js · v62.js를 순서 그대로 이어 붙였다

// ───── (예전 v51.js) ─────
/* 바이라인 1.6 — src/compat/v51.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 AI 개선: 신세 · 줄타기 · 물때 · 봉투 · 조직 운영을 AI가 읽는다 + 비판 기사 종류 =====

// ---------- 1) 신세: 쓸 데가 있을 때만, 가장 값진 쓰임으로 ----------
// 예전엔 신세가 3개만 쌓이면 무조건 「신세 쓰기」를 권했고, 맡기기는 첫 선택지를 골랐다
function favScore51(o){try{const L=String(o.label||'');const its=S.items||[];const ready1=its.filter(i=>i.facts&&i.facts.filter(x=>!fOK(x)).length===1&&(i.imp||0)>=55).length;
  const big=its.filter(i=>(i.imp||0)>=60);const hasCrit=nm=>its.some(i=>!i.pos&&(i.imp||0)>=50&&i.ent&&entName(i.ent)===nm);
  if(o.disabled)return -9;
  if(/대신 뛰어 주기/.test(L))return S.ap<=1&&big.length?7:S.ap<=2?3:1;
  if(/확인 보증|현장 동행/.test(L))return ready1?7:its.some(i=>(i.imp||0)>=60&&i.facts&&i.facts.some(x=>!fOK(x)))?4:1;
  if(/소송 막아 주기/.test(L)){const nm=L.split(' — ')[0];return hasCrit(nm)?7:1;}
  if(/공식 입장/.test(L))return big.length?4:2;
  if(/오보 방어|위기 때 방패/.test(L))return (S.errShield44||0)>0?0:((S.trust??50)<50||its.some(i=>(i.alert||0)>=60)?5:2);
  if(/발표 일정/.test(L))return its.length<=2?5:2;
  if(/고과/.test(L))return (S.eval??50)<55?4:2;
  if(/제목·지면/.test(L))return its.some(i=>(i.imp||0)>=60&&i.facts&&i.facts.filter(x=>x.key).every(fOK))?5:1;
  if(/노하우/.test(L))return 2;
  return 1;}catch(e){return 0;}}
function favBest51(){try{const O=favOpts44()||[];let b=-9;O.forEach(o=>{b=Math.max(b,favScore51(o));});const tot=Object.values(S.fav44||{}).reduce((a,f)=>a+(f.n||0),0);return {b,tot};}catch(e){return {b:-9,tot:0};}}
{const _fo51=favOpts44;favOpts44=function(){const O=_fo51.apply(this,arguments)||[];try{O.forEach(o=>{o._sc=favScore51(o);});O.sort((a,b)=>b._sc-a._sc);O.forEach((o,i)=>{o.rec=i===0&&o._sc>=4;});}catch(e){}return O;};}
{const _wy51=why;why=function(id){if(id==='favor'&&S&&S._noFav51)return 'AI 판단 중';return _wy51.apply(this,arguments);};}
{const _rc51=recommend;recommend=function(){if(!S||S.story)return _rc51.apply(this,arguments);
  let r;const fb=favBest51();
  // 쓸 만한 곳이 없거나(점수 5 미만) 신세가 넘치지도 않으면 신세 쓰기를 권하지 않는다
  if(fb.b<5&&!(fb.tot>=8&&fb.b>=3)){S._noFav51=1;try{r=_rc51.apply(this,arguments);}finally{S._noFav51=0;}}else r=_rc51.apply(this,arguments);
  try{if(r!=='rest'&&r!=='breaking'){
    // 물때가 온 준비된 아이템이 있으면 쓰기를 먼저
    const acts=rankActs();if(acts.includes('write')&&!why('write')){const W=typeof writable==='function'?writable():(S.items||[]);const it=W.find(i=>i.peg&&pegDt44(i)<=2&&pegDt44(i)>=-1&&i.facts&&i.facts.filter(x=>x.key).every(fOK));if(it)return 'write';}
    if(fb.b>=6&&acts.includes('favor')&&!why('favor'))return 'favor';}}catch(e){}
  return r;};}

// ---------- 2) 줄타기 · 비판 기사 종류: 어떤 아이템을 쓸지 고를 때 ----------
const CK51=[['비리·특혜',/비리|유착|특혜|뇌물|횡령|배임|청탁|로비|리베이트|뒷돈|접대|편법|쪼개기|낙하산|채용 비리/],['안전·사고',/부실|안전|사고|붕괴|화재|참사|누수|결함|숨져|사망|중독|오염|침수|추락/],['갑질·노동',/갑질|폭언|폭행|괴롭힘|체불|해고|산재|차별|인권|성희롱|학대|하청/],['예산·혈세',/혈세|예산|낭비|보조금|세금|교부금|적자/],['은폐·조작',/은폐|조작|허위|거짓|축소|숨겨|위장|가짜|표절|대필|분식/],['범죄·수사',/마약|사기|살인|수사|기소|재판|구속|검찰|도박|불법|적발/],['의혹·논란',/논란|의혹|반발|파문|갈등|도마/]];
function critKind51(it){try{if(!it||it.pos)return null;const t=String(it.title||'');for(const [n,re] of CK51)if(re.test(t))return n;return '현장 고발';}catch(e){return null;}}
{const _mi51=makeItem;makeItem=function(){const it=_mi51.apply(this,arguments);try{if(it&&!it.pos&&!it.ck)it.ck=critKind51(it);}catch(e){}return it;};}
{const _tt51=timTag44;timTag44=function(it){let h=_tt51.apply(this,arguments)||'';try{const k=it&&!it.pos&&(it.ck||critKind51(it));if(k)h=`<span class="tag">비판 · ${esc(k)}</span>`+h;}catch(e){}return h;};}
{const _ai51=aiItemScore;aiItemScore=function(it,act,dir){let v=_ai51.apply(this,arguments);try{if(act==='write'&&it&&S.net){const id=it.ent;const N=id&&S.net[id];const rel=N?(N.rel||0):null;const rv=id&&typeof rivalEnt44==='function'?rivalEnt44(id):null;const RV=rv&&S.net[rv];const rrel=RV?(RV.rel||0):null;
    if(rel!=null){if(it.pos){if(rel>=75)v-=2;else if(rel<=-20)v+=.5;}else{if(rel>=75)v+=.5;const ck=it.ck||critKind51(it);if((ck==='비리·특혜'||ck==='은폐·조작')&&rel>=55&&rel<75)v-=.6;}}
    if(rrel!=null&&rrel>=50)v+=it.pos?-.7:.4;}}catch(e){}return v;};}

// ---------- 3) 이벤트 선택지 추천: 봉투 · 신세 청구 · 양쪽의 부탁 · 유착 의심 ----------
function recIdx51(t,C){try{const L=C.map(c=>String(c&&c.label||''));const f=re=>L.findIndex(x=>re.test(x));
  if(t==='봉투'){const ref=S.bribeRef||0;if(ref<2)return f(/정중히 돌려준다/);const k=f(/회유 시도까지 기사에/);return k>=0?k:f(/회사에 신고/);}
  if(t==='신세를 갚을 때'){const m=String(($('#mb')||{}).innerText||'');const hot=Object.keys(S.net||{}).some(id=>(S.net[id].rel||0)>=75&&m.includes(entName(id)));if(hot)return f(/선을 긋는다/);return (S.trust??50)>=55?f(/들어준다/):f(/반만 들어준다/);}
  if(t==='양쪽의 부탁')return f(/사실만 담담하게/);
  if(t==='유착 의심')return f(/거리를 두겠다/);
  return -1;}catch(e){return -1;}}
{const _om51=openModal;openModal=function(t,b,c){try{if(Array.isArray(c)&&/^(봉투|신세를 갚을 때|양쪽의 부탁|유착 의심)$/.test(t)){const k=recIdx51(t,c);if(k>=0){c=c.map((x,i)=>x&&typeof x==='object'?Object.assign({},x,{rec:i===k}):x);}}}catch(e){}return _om51.call(this,t,b,c);};}
// 신세를 갚을 때: 본문이 그려진 뒤에 판단해야 해서, 열린 직후 한 번 더 표시를 맞춘다
{const _om51b=openModal;openModal=function(t,b,c){const r=_om51b.apply(this,arguments);try{if(t==='신세를 갚을 때'){const bs=[...document.querySelectorAll('#mc button')];const k=recIdx51(t,bs.map(x=>({label:x.innerText})));bs.forEach((x,i)=>x.classList.toggle('rec',i===k));}}catch(e){}return r;};}

// ---------- 4) 조직 운영: 내가 인사권자가 아니면 국장(AI)이 부서를 굴린다 ----------
const POLMAP51={adpush:'sales',defend:'safe',digital:'scoop',cost:'safe',steady:'none',retain:'grow'};
function npcOrg51(lines){try{if(S.founder||S.story||orgCanRun()||!OUT()||(S.npcOrg51??-99)>S.turn-YW/2)return;S.npcOrg51=S.turn;const per=roster();const D=orgDepts();
  // 회사 전략에 맞춰 부서 방침 (내 부서는 건드리지 않는다)
  const want=POLMAP51[S.coMode]||'none';S.pol45=S.pol45||{};let changed=0;D.forEach(d=>{if(d===S.dept)return;const cur=S.pol45[d]||'none';if(cur!==want&&chance(.5)){S.pol45[d]=want;changed++;}});
  if(changed&&want!=='none')lines.push({c:'',t:`편집국장이 ${changed}개 부서 방침을 「${POL45[want][0]}」${jp('「'+POL45[want][0]+'」','으로','로')} 바꿨다 — 회사 전략 「${CO_MODE[S.coMode]||''}」`});
  // 가장 처진 부서의 팀장을 확실히 나은 사람으로 (반년에 한 번, 내 부서 제외)
  const rows=D.filter(d=>d!==S.dept).map(d=>({d,q:orgDeptQ(d,per)})).filter(x=>x.q&&x.q.h);if(!rows.length)return;const w=rows.sort((a,b)=>a.q.q-b.q.q)[0];
  if(orgGrade(w.q.q)!=='D')return;const h=w.q.h;const c=(orgCands(w.d)||[]).filter(m=>m!==h&&!(S.team||[]).includes(m))[0];if(!c||orgScore(c)-orgScore(h)<10)return;
  const L=per[w.d]=per[w.d]||[];if(c.d!==w.d){Object.keys(per).forEach(x=>{if(Array.isArray(per[x])&&x!==w.d)per[x]=per[x].filter(y=>y!==c);});c.d=w.d;if(!L.includes(c))L.push(c);}
  h.r=1;h.acting=0;h.exHead=S.turn;h.rel=clamp((h.rel??20)-8,-50,100);c.r=Math.max(2,c.r||0);c.acting=0;c.headT=S.turn;try{lock45(c);lock45(h);h.lk45.dem=1;}catch(e){}
  lines.push({c:'',t:`인사: 편집국장이 ${DEPTS[w.d].n} 팀장을 ${h.name}에서 ${jo2(c.name,'으로','로')} 바꿨다 — 부서 전력 D를 끌어올리려는 인사`});log(`${DEPTS[w.d].n} 팀장 교체: ${c.name}`);}catch(e){console.error(e);}}
{const _om51o=orgMonth;orgMonth=function(lines){const r=_om51o.apply(this,arguments);try{npcOrg51(lines);}catch(e){}return r;};}

// ───── (예전 v52.js) ─────
/* 바이라인 1.6 — src/compat/v52.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 새 시스템 안내 · 관계 한눈에 보기 · 그 밖의 수지 내역 =====

// ---------- 1) 처음 마주칠 때 한 번씩: 월 결산에 짧은 안내 ----------
function tip52(lines){try{if(!S||S.story||S.phase!=='game')return;const T=S.tip52=S.tip52||{};const add=(k,t)=>{if(T[k])return;T[k]=S.turn;lines.push({c:'g',t:'안내 · '+t});};
  const fav=Object.values(S.fav44||{}).reduce((a,f)=>a+(f.n||0),0);if(fav>=1)add('fav','신세가 생겼다 — 할 일 「신세 쓰기」(행동력 0)로 결정적인 순간에 쓴다. 쓸 만한 때가 오면 추천이 뜬다');
  if((S.items||[]).some(i=>i.peg))add('peg','물때 — 아이템에 「물때」가 붙으면 그 직전(2주 안)에 내야 파급력 +35%, 지나면 받아쓰기 취급이다');
  const N=S.net||{};const hot=Object.keys(N).filter(id=>(N[id].rel||0)>=75);if(hot.length)add('zone',`유착 위험 — ${jo2(entName(hot[0]),'과','와')} 관계가 75를 넘었다. 너무 가까우면 신뢰가 새고 유착 의심 기사가 나온다. 「관계망」 탭 맨 위에서 한눈에 본다`);
  const rv=Object.keys(N).some(id=>N[id].known&&typeof rivalEnt44==='function'&&rivalEnt44(id)&&(N[id].rel||0)>=40);if(rv)add('rival','맞수 — 기관·광고주·인물마다 맞수가 있다. 한쪽 호재를 쓰면 맞수가 서운해하고, 비판하면 반긴다. 아이템 카드에 미리 보인다');
  if(!S.founder&&typeof orgCanRun==='function'&&orgCanRun())add('org','조직 운영 — 「인사권 행사」 맨 위 「조직 운영」에서 팀장·차장·부서 방침을 정하고, 「지역 발령」으로 승진 적체를 푼다');
 }catch(e){}}
{const _om52=orgMonth;orgMonth=function(lines){const r=_om52.apply(this,arguments);try{tip52(lines);}catch(e){}return r;};}

// ---------- 2) 관계 한눈에 보기 (관계망 탭 맨 위) ----------
function rel52HTML(){try{if(!S||S.story||!S.net)return '';const N=S.net;const ids=Object.keys(N).filter(id=>ENT[id]&&(N[id].known||Math.abs(N[id].rel||0)>=1));if(!ids.length)return '';
  const nm=id=>esc(entName(id));const r=id=>Math.round(N[id].rel||0);
  const hot=ids.filter(id=>r(id)>=75).sort((a,b)=>r(b)-r(a));
  const close=ids.filter(id=>r(id)>=55&&r(id)<75).sort((a,b)=>r(b)-r(a)).slice(0,5);
  const cold=ids.filter(id=>r(id)<=-10).sort((a,b)=>r(a)-r(b)).slice(0,5);
  const pair=[];ids.forEach(id=>{const v=typeof rivalEnt44==='function'?rivalEnt44(id):null;if(v&&N[v]&&r(id)>=40&&(N[v].rel||0)<=0&&!pair.some(p=>p[0]===v))pair.push([id,v]);});
  const F=Object.entries(S.fav44||{}).filter(([k,f])=>f&&f.n>0).sort((a,b)=>b[1].n-a[1].n).slice(0,6);
  const row=(lab,arr)=>arr.length?`<li><span class="tg pc">${lab}</span>${arr.join(' · ')}</li>`:'';
  const body=row('신세',F.map(([k,f])=>`${esc(favName44(k))} ×${f.n}`))+
    row('유착 위험',hot.map(id=>`<b style="color:var(--red)">${nm(id)} ${r(id)}</b>`))+
    row('가까움',close.map(id=>`${nm(id)} ${r(id)}`))+
    row('틀어짐',cold.map(id=>`${nm(id)} ${r(id)}`))+
    row('맞수 주의',pair.slice(0,4).map(([a,b])=>`${jo2(nm(a),'과','와')} 가깝고 맞수 ${jo2(nm(b),'과는','와는')} 멀다`));
  if(!body)return '';
  return `<div class="card"><div class="t">${ic('link')} 관계 한눈에 보기</div><ul class="pnl">${body}</ul><p class="hint" style="margin:4px 0 0">관계 75 이상은 신뢰가 새고 유착 의심을 받는다 · 20~74는 적정 거리 · 신세는 「신세 쓰기」로 쓴다</p></div>`;}catch(e){return '';}}
{const _tb52=tabBody;tabBody=function(){let h=_tb52.apply(this,arguments);try{if(S&&S.tab==='net')h=rel52HTML()+h;}catch(e){}return h;};}

// ---------- 3) 그 밖의 수지 내역: 월 결산 밖에서 오간 돈을 출처별로 ----------
const ETC52={founderOtrMonth:'매체 특성 효과',coAI:'경영진 전략(투자·사업)',circMonth:'판매 전략(판촉·지국)',wageMonth:'임금 조정',founderStatMonth:'발행인 활동',founderMonth:'창간 회사 운영',fMixMonth:'수익 다변화 사업',oidMonth2:'매체 정체성 사업',oidMonth:'매체 정체성 사업',chiefSales:'국장 광고 영업',supMonth:'대주주 지원',corrMonth:'지역 주재 운영',fAdMonth:'부서 광고 목표',standYear:'연말 결산',portalReview:'포털 심사',eventMonth:'행사 사업',lgeMonth:'지자체 행사 사업'};
function etcSrc52(){try{const st=String(new Error().stack||'').split('\n').slice(2,14);for(const l of st){const m=l.match(/(?:at\s+)?(?:[\w$]+\.)*([\w$]+)\s*(?:\[as [\w$]+\])?\s*[@(]/);const n=m&&m[1];if(!n)continue;if(n==='gadMonth')return null;if(ETC52[n])return ETC52[n];}}catch(e){}return '기타';}
{const _em52=endMonth;endMonth=function(){const c=S&&S.co;if(!c||typeof c.cash!=='number')return _em52.apply(this,arguments);
  const dc=Object.getOwnPropertyDescriptor(c,'cash'),dl=Object.getOwnPropertyDescriptor(c,'last');if(!dc||!('value' in dc)||!dl||!('value' in dl))return _em52.apply(this,arguments);
  let cv=c.cash,lv=c.last,after=false;const by={};
  try{Object.defineProperty(c,'cash',{configurable:true,enumerable:true,get(){return cv;},set(x){const d=x-cv;cv=x;if(after&&typeof d==='number'&&Math.abs(d)>1e-9){const k=etcSrc52();if(k)by[k]=(by[k]||0)+d;}}});
    Object.defineProperty(c,'last',{configurable:true,enumerable:true,get(){return lv;},set(x){lv=x;after=true;}});}catch(e){return _em52.apply(this,arguments);}
  let r;try{r=_em52.apply(this,arguments);}finally{try{delete c.cash;delete c.last;c.cash=cv;c.last=lv;}catch(e){}
    try{if(lv&&after){const E={};Object.keys(by).forEach(k=>{if(Math.abs(by[k])>=.0005)E[k]=+by[k].toFixed(4);});lv.etcBy=E;}}catch(e){}}
  return r;};}
{const _fl52=flow50HTML;flow50HTML=function(){let h=_fl52.apply(this,arguments);try{const l=S&&S.co&&S.co.last;const E=l&&l.etcBy;if(h&&E&&Object.keys(E).length&&Math.abs(l.etc||0)>=.005){const L=Object.entries(E).sort((a,b)=>Math.abs(b[1])-Math.abs(a[1])).map(([k,v])=>`<span>${esc(k)} ${v>0?'+':''}${eok(v)}</span>`).join('');const blk=`<div class="meta" style="margin-top:4px"><span class="hint">그 밖의 수지 내역</span>${L}</div>`;h=/<p class="hint"/.test(h)?h.replace(/<p class="hint"/,blk+'<p class="hint"'):h.replace(/<\/div>$/,blk+'</div>');}}catch(e){}return h;};}

// ───── (예전 v53.js) ─────
/* 바이라인 1.6 — src/compat/v53.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 장기 플레이 NaN 바로잡기 =====
// 조직 운영(1.4)이 평가 기록이 없는 부장에게 빈 기록({})을 만들어, 반기 광고 할당 평가에서 「없는 값 + 3」 = NaN이 됐다.
// 그 부장 밑 부서원 실력 → 회사 보도 품질 → 신뢰도까지 NaN으로 번졌다(사장 4년 차 무렵). 원인은 v35에서 고쳤고, 이미 망가진 값은 여기서 되살린다.
const AIDEF53={h:70,e:50,s:2,ar:0,sc:0,er:0,sl:0,bo:0};
function personFix53(m){if(!m||typeof m!=='object')return 0;let n=0;try{
  if(m.ai&&typeof m.ai==='object'){const a=m.ai;if(a.e==null||!Number.isFinite(a.e)||a.h==null||!a.y){const keep=a;delete m.ai;const b=npcAI(m);Object.keys(keep).forEach(k=>{const v=keep[k];if(v!=null&&!(typeof v==='number'&&!Number.isFinite(v)))b[k]=v;});n++;}
    const b=m.ai;Object.keys(AIDEF53).forEach(k=>{if(b[k]!=null&&typeof b[k]==='number'&&!Number.isFinite(b[k])){b[k]=AIDEF53[k];n++;}});['q','qr','qS'].forEach(k=>{if(b[k]!=null&&!Number.isFinite(b[k])){b[k]=0;n++;}});}
  if(m.skill!=null&&!Number.isFinite(m.skill)){const dv=Number.isFinite(m._dv)?m._dv:0;m.skill=clamp(Math.round(skillYrs(m.yrs||0)+dv),14,92);m._sk0=m.skill;m._fy=m.yrs;n++;}
  if(m.rel!=null&&!Number.isFinite(m.rel)){m.rel=20;n++;}}catch(e){}return n;}
function nanFix53(s){s=s||S;if(!s||s.phase!=='game')return 0;let n=0;const each=a=>(a||[]).forEach(m=>{n+=personFix53(m);});
  try{each(s.team);each(s.mates);if(Array.isArray(s.corr))each(s.corr);if(s.ros&&s.ros.per)Object.values(s.ros.per).forEach(a=>Array.isArray(a)&&each(a));if(s.corrList)Object.values(s.corrList).forEach(a=>Array.isArray(a)&&each(a));
    const fix=(o,k,v)=>{if(o&&o[k]!=null&&typeof o[k]==='number'&&!Number.isFinite(o[k])){o[k]=v;n++;}};
    fix(s,'trust',45);fix(s,'fame',20);fix(s,'eval',45);fix(s,'wMood',60);fix(s,'hp',70);if(s.co){fix(s.co,'q',50);fix(s.co,'cash',0);fix(s.co,'subs',1);fix(s.co,'tr',1000);}
    if(s.st)Object.keys(s.st).forEach(k=>fix(s.st,k,30));}catch(e){}return n;}
{const _em53=endMonth;endMonth=function(){try{nanFix53();}catch(e){}const r=_em53.apply(this,arguments);try{nanFix53();}catch(e){}return r;};}
{const _mg53=migrate;migrate=function(s){const r=_mg53.apply(this,arguments);try{const n=nanFix53(r);if(n)console.log('[바이라인] 저장 데이터의 숫자 오류 '+n+'곳을 바로잡았다');}catch(e){}return r;};}
// 불러오기가 게임을 바꾸지 않게 (ver4와 같은 종류):
//  ① know2 — 새 게임에 표시가 없어 처음 불러올 때마다 옛 저장용 보정(기관 더 알기)이 돌았다 → 새 게임은 처음부터 표시
//  ② ents — 불러올 때만 광고 비중을 「지금 매체 체급」으로 다시 맞춰, 불러오기를 하면 광고주별 비중이 바뀌었다 → 한 번 맞춘 저장은 그대로 둔다
{const _ns53=newState;newState=function(){const s=_ns53.apply(this,arguments);try{s.know2=1;s.entsN53=1;}catch(e){}return s;};}
{const _mg53b=migrate;migrate=function(s){let keep=null;try{if(s&&s.entsN53&&Array.isArray(s.ents))keep=s.ents.map(e=>[e[0],e[4]]);}catch(e){}
  const r=_mg53b.apply(this,arguments);
  try{if(r&&keep&&Array.isArray(r.ents)){const M=new Map(keep);r.ents.forEach(e=>{if(M.has(e[0])&&M.get(e[0])!=null)e[4]=M.get(e[0]);});try{setEnts(r.ents);}catch(e){}}if(r&&r.phase)r.entsN53=1;}catch(e){}return r;};}
// ③ 같은 사람이 「같은 부서」 목록과 「주재기자」 목록에 함께 있으면, 저장 파일에선 두 사람으로 풀린다
//    → 불러온 뒤 이름 중복 정리가 주재기자 쪽 이름을 새로 지어 버렸다. 불러올 때 같은 사람으로 다시 묶는다
function relink53(s){try{if(!s)return;const canon=new Map();const J=m=>{try{return JSON.stringify(m);}catch(e){return null;}};
  // 앞 목록에 「완전히 똑같은」 사람이 있을 때만 같은 사람으로 묶는다 (이름만 같은 다른 사람은 건드리지 않는다)
  const fix=a=>{if(!Array.isArray(a))return a;const add=[];const r=a.map(m=>{if(!m||typeof m!=='object')return m;const k=J(m);if(k&&canon.has(k))return canon.get(k);add.push([k,m]);return m;});add.forEach(([k,m])=>{if(k&&!canon.has(k))canon.set(k,m);});return r;};
  s.team=fix(s.team);s.mates=fix(s.mates);s.corr=fix(s.corr);if(s.corrList)Object.keys(s.corrList).forEach(r=>{s.corrList[r]=fix(s.corrList[r]);});}catch(e){console.error(e);}}
{const _mg53c=migrate;migrate=function(s){relink53(s);return _mg53c.apply(this,arguments);};}
// ④ 취재원 기관이 비어 있는 아이템은 불러올 때에만 기관이 채워져, 불러오기 전후로 줄타기·관계 계산이 달라졌다 → 만들 때 채운다
{const _mi53=makeItem;makeItem=function(){const it=_mi53.apply(this,arguments);try{if(it&&!it.ent)it.ent=findEnt(it.title,it.subj||'',it.d)||it.ent;}catch(e){}return it;};}
{const _em53e=endMonth;endMonth=function(){const r=_em53e.apply(this,arguments);try{(S.items||[]).forEach(i=>{if(i&&!i.ent){const e=findEnt(i.title,i.subj||'',i.d);if(e)i.ent=e;}});}catch(e){}return r;};}

// ───── (예전 v54.js) ─────
/* 바이라인 1.6 — src/compat/v54.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 사람 화면 간소화: 같은 부서 · 사내 관계 · 관계망 (보이는 방식만 바꾼다) =====
(function(){const st=document.createElement('style');st.textContent=`
.tb .psum.p54{display:flex;flex-wrap:wrap;gap:4px 10px;padding:8px 10px;font-size:12.5px}
.tb .psum.p54 .pr{display:inline-flex;gap:5px;align-items:center;margin:0;padding:0;border:0;background:none}
.tb .psum.p54 .pr .tag{font-size:11.5px;padding:1px 6px}
.tb .psum.p54 .pr .bar{display:none}
.tb .acat.s54{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch;margin:6px 0!important}
.tb .acat.s54::-webkit-scrollbar{display:none}
.tb .acat.s54 .achip{flex:0 0 auto;padding:4px 10px;font-size:12.5px}
details.m54 summary .nn small{display:block}
details.m54 .sk54{font-size:12.5px;color:var(--mute);white-space:nowrap;margin-left:auto;padding-right:6px}details.m54 .sk54 b{color:var(--fg);font-size:14px}details.m54 .rpill{min-width:56px}
details.x54{margin:6px 0}
details.x54>summary{cursor:pointer;font-weight:700;padding:6px 2px;list-style:none}
details.x54>summary::after{content:" ▸";color:var(--mute)}
details.x54[open]>summary::after{content:" ▾"}
.card.d54 .pnl,.card.d54>.hint{display:none}
.card.d54.open .pnl,.card.d54.open>.hint{display:block}
.card.d54 .t{cursor:pointer}
.card.d54 .t::after{content:" · 부서 특성 보기 ▸";font-weight:400;font-size:12px;color:var(--mute)}
.card.d54.open .t::after{content:" ▾"}
`;document.head.appendChild(st);})();
// 1.6에 새로 넣은 카드(관계 한눈에 보기 · 자금 흐름 · 인사 TO)가 탭 메뉴 위로 올라가던 것 → 탭 본문 맨 위로
{const _tb54=tabBody;tabBody=function(){let h=_tb54.apply(this,arguments);try{if(typeof h==='string'){const n=h.indexOf('<nav'),t=h.indexOf('<div class="tb">');if(n>0&&t>n&&/class="card/.test(h.slice(0,n))){const pre=h.slice(0,n);h=h.slice(n);const k=h.indexOf('<div class="tb">')+16;h=h.slice(0,k)+pre+h.slice(k);}}}catch(e){}return h;};}
function simp54(){try{if(!S||S.phase!=='game')return;const tab=S.tab;const root=document.querySelector('.bx-tab .tb');if(!root)return;
  // 요약 상자: 사내 관계에서만 한 줄로, 다른 사람 탭에선 숨긴다
  const ps=root.querySelector('.card.psum');if(ps){if(tab==='cols')ps.classList.add('p54');else if(tab==='mates'||tab==='net')ps.remove();}
  // 가로로 미는 필터 줄
  if(tab==='net'||tab==='cols')root.querySelectorAll('.acat').forEach(a=>a.classList.add('s54'));
  if(tab==='mates'){
    // 부서 현황: 특성 설명은 접는다
    const dc=[...root.querySelectorAll(':scope > .card')].find(c=>/현황/.test((c.querySelector('.t')||{}).textContent||''));if(dc&&!dc.classList.contains('d54')){dc.classList.add('d54');const t=dc.querySelector('.t');if(t)t.addEventListener('click',()=>dc.classList.toggle('open'));}
    [...root.querySelectorAll(':scope > p.hint')].forEach(p=>{if(/추정치|능력치는/.test(p.textContent))p.textContent='종합 능력치는 겉으로 본 추정치 — 가깝고 오래 같이 일할수록 범위가 좁아진다. 사람을 누르면 세부 능력치가 나온다.';});
    // 사람 카드 → 한 줄 (누르면 자세히)
    root.querySelectorAll('.card.mcard').forEach(c=>{const img=c.querySelector('img.face');const t=c.querySelector('.t');if(!t)return;const nm=(t.childNodes[0]&&t.childNodes[0].textContent||'').trim();const sub=(t.querySelector('span')||{}).textContent||'';const parts=sub.replace(/^\s*·\s*/,'').split('·').map(x=>x.trim()).filter(Boolean);
      const role=parts[0]||'';const yr=(parts.find(x=>/년 차/.test(x))||'').replace(/\s*\(.*\)/,'');const bar=c.querySelector('.bar i');const w=bar?parseFloat(bar.style.width)||0:0;const col=bar?bar.style.getPropertyValue('--c')||'var(--siren)':'var(--siren)';const meta=(c.querySelector('.meta')||{}).textContent||'';
      let rg='',mid=w;try{const m=(deptMates()||[]).find(x=>x&&x.name===nm);if(m){rg=estRange(m.skill,(m.rel||0)+Math.min(40,S.inRank||0),m.name.length*7,'sk');const [lo,hi]=rg.split('~').map(Number);if(lo&&hi)mid=(lo+hi)/2;}}catch(e){}
      const d=document.createElement('details');d.className='nrow m54';d.innerHTML=`<summary><span class="ni nf"></span><span class="nn">${esc(nm)}<small>${esc([role,yr].filter(Boolean).join(' · '))}</small></span><span class="nb"></span><span class="sk54">종합 <b>${rg||Math.round(w)}</b></span><span class="rpill" style="--c:${col}"><i style="width:${mid}%"></i></span></summary><div class="nd"><p>${esc(parts.join(' · '))}</p><p class="meta">${esc(meta)}</p></div>`;if(img)d.querySelector('.ni').appendChild(img);c.replaceWith(d);});}
  if(tab==='cols'){
    // 지역 주재기자 연락망: 접어 둔다
    const all=[...root.children];const k=all.findIndex(e=>/^\s*지역 주재기자 연락망/.test(e.textContent||'')&&(e.textContent||'').length<80);if(k<0){const big=all.find(e=>/^\s*지역 주재기자 연락망/.test(e.textContent||''));if(big&&!root.querySelector('details.x54')){const ttl=((big.textContent||'').match(/지역 주재기자 연락망\s*\d+명/)||['지역 주재기자 연락망'])[0];const d=document.createElement('details');d.className='x54';const sm=document.createElement('summary');sm.textContent=ttl;d.appendChild(sm);big.replaceWith(d);d.appendChild(big);}}
    if(k>=0&&!root.querySelector('details.x54')){const head=all[k];const d=document.createElement('details');d.className='x54';const sm=document.createElement('summary');sm.textContent=(head.textContent||'').trim();d.appendChild(sm);all.slice(k+1).forEach(e=>d.appendChild(e));head.replaceWith(d);}}
 }catch(e){console.error(e);}}
{const _rd54=render;render=function(){const r=_rd54.apply(this,arguments);try{simp54();}catch(e){}return r;};}

// ───── (예전 v55.js) ─────
/* 바이라인 1.6 — src/compat/v55.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 밸런스: 줄타기가 실제로 일어나게 · AI가 물때를 기다린다 =====
// 측정: 5년을 플레이해도 관계 55 이상인 곳이 0 — 좋은 관계가 매주 1%씩 식어(1년에 약 40%) 「가까움·유착 위험」에 닿을 수 없었다
// → 좋은 관계가 식는 속도를 절반으로(나쁜 관계가 풀리는 속도는 그대로), 평소의 관계 상승(+10 이하)은 1.25배
{const _nw55=netWeek;netWeek=function(lines){const N=S&&S.net;const b={};if(N)Object.keys(N).forEach(id=>{b[id]=N[id].rel;});const r=_nw55.apply(this,arguments);
  try{if(N)Object.keys(b).forEach(id=>{const e=N[id];if(!e)return;const x=b[id];if(x>0&&Math.abs(e.rel-(x+(0-x)*.01))<1e-9)e.rel=x-x*.005;});}catch(e){}return r;};}
{const _nu55=netUp;netUp=function(id,v){if(typeof v==='number'&&v>0&&v<=10)v*=1.25;return _nu55.call(this,id,v);};}
// AI: 석 달 안에 물때가 오는 아이템은 기다린다(단독·식기 쉬운 건 제외)
{const _ai55=aiItemScore;aiItemScore=function(it,act,dir){let v=_ai55.apply(this,arguments);try{if(act==='write'&&it&&it.peg&&!it.excl){const dt=pegDt44(it);if(dt>8&&dt<=12)v-=3;else if(dt>2&&dt<=8)v-=2;}}catch(e){}return v;};}
// 맡기기: 쓸 수 있는 아이템이 모두 「물때 전」(3개월 안, 단독 아님)이면 이번엔 쓰기를 건너뛰고 다른 일을 한다
{const _ap55=autoPickAct;autoPickAct=function(k){let r=_ap55.apply(this,arguments);try{if(r==='write'&&typeof writable==='function'){const W=writable();if(W.length&&W.every(i=>i.peg&&!i.excl&&pegDt44(i)>2&&pegDt44(i)<=12)){const had=!!S._autoBan;const B=S._autoBan||(S._autoBan=new Set());const hw=B.has('write');B.add('write');let r2=null;try{r2=_ap55.apply(this,arguments);}finally{if(!hw)B.delete('write');if(!had)delete S._autoBan;}if(r2)r=r2;}}}catch(e){}return r;};}

// ───── (예전 v56.js) ─────
/* 바이라인 1.6 — src/compat/v56.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 할 일 카드: 그림이 없는 행동(신세 쓰기 · 국장/사장 전략 등)의 아이콘이 카드 절반을 차지하던 것 =====
// 간결한 화면(기본)에선 다른 카드처럼 아이콘 칸을 숨긴다. 그림 카드 화면에선 다른 카드 그림과 같은 크기 칸에 아이콘을 둔다(그대로)
(function(){const st=document.createElement('style');st.textContent=`
body.cmp42 .act.hasic .aic:not(:has(.aimg)){display:none!important}
`;document.head.appendChild(st);})();

// ───── (예전 v57.js) ─────
/* 바이라인 1.6 — src/compat/v57.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 기사 삭제 요청: 기사 내용과 맞는 사람이 찾아오게 =====
// 예전엔 부서만 보고 골라서, 문화부의 「작은도서관 휴관」 기사에 연예인 소속사가 찾아왔다
// → 연예인·무죄·피해자 요청은 제목에 그런 내용이 있을 때만. 그 밖의 비판 기사엔 「기관·단체의 삭제 요청」
try{DEL_T.org={n:'기관·단체의 삭제 요청',who:'기사 속 기관 관계자',ask:'"지적하신 건 이미 바로잡았습니다. 그런데 기사가 계속 검색되니 후원과 이용이 끊겨 갑니다. 내려 주시거나 고친 내용을 실어 주세요."',best:['follow'],c:['cul','ent','spo','culspo','soc','loc','sigun','edu','wel','nat','int','sci','it','env']};}catch(e){}
const DELRE57={
 star:/연예인|배우|가수|아이돌|걸그룹|보이그룹|열애|결혼|이혼|스캔들|사생활|소속사|예능|드라마|영화배우|스타|방송인|유튜버|인플루언서/,
 acq:/기소|구속|혐의|재판|수사|피의자|체포|검찰|경찰|송치|입건|고소|고발|영장/,
 victim:/사건|사고|피해자|피해 가족|유족|범죄|폭행|숨져|숨진|사망|화재|참사|학대|성범죄|스토킹|실종|살인|중상|부상/,
 old:/[가-힣]{2,4} ?씨|주민|시민|학부모|상인|세입자|직원|노동자|운전자|학생/};
{const _dk57=delKind;delKind=function(c){try{if(!c)return null;const t=String(c.h||'');const k=cat1(c.d||'soc');const age=S.turn-c.turn;
  const L=Object.keys(DEL_T).filter(x=>{const T=DEL_T[x];if(!T.c.includes(k)&&!T.c.includes(c.d))return false;
    if(x==='old'&&(age<YW*2||!DELRE57.old.test(t)))return false;
    if(x==='acq'&&(c.pos||!DELRE57.acq.test(t)))return false;
    if(x==='victim'&&!DELRE57.victim.test(t))return false;
    if(x==='star'&&!DELRE57.star.test(t)&&k!=='ent'&&c.d!=='ent')return false;
    if((x==='corp'||x==='pol'||x==='org')&&c.pos)return false;
    if(x==='org'&&(DELRE57.star.test(t)||DELRE57.acq.test(t)||DELRE57.victim.test(t)))return false;
    return true;});
  return L.length?pick(L):null;}catch(e){return _dk57.apply(this,arguments);}};}

// ───── (예전 v58.js) ─────
/* 바이라인 1.6 — src/compat/v58.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 「나」 탭에 내 지갑: 넓은 화면에선 월급·생활비 상자가 숨겨져 있어 볼 곳이 없었다 =====
(function(){const st=document.createElement('style');st.textContent=`
.wal58{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:6px;margin:8px 0 10px}
.wal58>div{background:rgba(255,255,255,.04);border:1px solid var(--edge,rgba(120,140,200,.16));border-radius:12px;padding:7px 10px}
.wal58 span{display:block;font-size:11.5px;color:var(--mute)}.wal58 b{font-size:14.5px}
`;document.head.appendChild(st);})();
function wal58HTML(){try{const C=[];const won=v=>Math.round(v).toLocaleString('ko-KR')+'만';
  C.push(['통장',won(S.money||0)]);
  if(!S.founder){try{C.push(['월급 (실수령)',`<span style="display:inline;color:var(--good);font-size:inherit">${won(payOf(OUT()))}</span>`]);}catch(e){}}
  try{C.push(['한 달 생활비',won(living())]);}catch(e){}
  if(S.co&&(S.rank>=5||S.founder))C.push(['회사 자금',f1(S.co.cash)+'억']);
  return `<div class="wal58">${C.map(([a,b])=>`<div><span>${a}</span><b>${b}</b></div>`).join('')}</div>`;}catch(e){return '';}}
{const _me58=v19Me;v19Me=function(){const had=!!document.querySelector('.bx-tab .tb .mehero');const r=_me58.apply(this,arguments);
  try{if(S&&S.phase==='game'&&S.tab==='me'){const tb=document.querySelector('.bx-tab .tb');if(tb&&!tb.querySelector('.wal58')){const h=tb.querySelector('.mehero');if(h)h.insertAdjacentHTML('afterend',wal58HTML());else tb.insertAdjacentHTML('afterbegin',wal58HTML());}}}catch(e){}return r;};}

// ───── (예전 v59.js) ─────
/* 바이라인 1.6 — src/compat/v59.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 봉투 팝업 바로잡기 =====
// ① 취재 결과의 「바뀐 것」(행동력·컨디션·능력치)이 이어서 뜨는 봉투 팝업에 붙어, 봉투 때문에 바뀐 것처럼 보였다 → 봉투 팝업엔 붙이지 않는다 (결과는 원래대로 따로 보여 준다)
{const _si59=snapInject;snapInject=function(body,title){if(/^(봉투|고맙다는 인사)$/.test(String(title||'')))return body;return _si59.apply(this,arguments);};}
// ② 독립영화·동네 가게·시민단체처럼 작은 곳이 홍보 기사에 수십만 원 봉투를 내미는 건 어색하다 → 작은 곳은 봉투 대신 고맙다는 인사로 끝난다
const SMALL59=/독립|동네|작은|소규모|마을|시민단체|비영리|청년|학생|소상공인|1인|자원봉사|봉사단|동아리|협동조합|사회적|풀뿌리|공부방|야학|복지관|도서관/;
{const _be59=bribeEvent;bribeEvent=function(it){try{if(it&&it.pos&&SMALL59.test(String(it.title||'')+' '+String(it.subj||''))){it.bribed=1;const who=esc(sbjN(it.subj));
    openModal('고맙다는 인사',`<p class="lede">${who} 쪽 담당자가 몇 번이고 고개를 숙였다. "저희 같은 데를 다 써 주시고… 정말 고맙습니다." 손에 쥐여 준 건 직접 만든 소식지 한 부였다.</p>`,[{label:'기사로 보답하자',sub:'취재원 관계↑',fn:()=>{if(it.ent&&S.net&&S.net[it.ent])netUp(it.ent,3);}}]);return;}}catch(e){}
  return _be59.apply(this,arguments);};}

// ───── (예전 v60.js) ─────
/* 바이라인 1.6 — src/compat/v60.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 피드백: 개인 투자 · 호감도 높은 기자의 이탈 · 크라우드펀딩 한도 · 경쟁사 지분 인수 =====

// ---------- 1) 개인 투자: 정수 난수 탓에 손실 달이 잦고 체감상 까먹기만 했다 ----------
// ETF 월 평균 +0.7%(변동 3%) · 개별주 +0.9%(변동 7%) · 코인 +0.8%(변동 12%, 가끔 폭락·폭등). 경기가 좋으면 더 오른다
function gs60(){let u=0;while(!u)u=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*Math.random());}
function ec60(){try{return clamp((econ()||1)-1,-.3,.3);}catch(e){return 0;}}
coinPct=function(){const x=Math.random();return Math.round(x<.025?-R(35,55):x<.06?R(35,80):.8+12*gs60()+ec60()*10);};
{const _lm60=lifeMonth;lifeMonth=function(lines){const e=S.etf||0,s=S.stock||0;S.etf=0;S.stock=0;let r;try{r=_lm60.apply(this,arguments);}finally{S.etf=e;S.stock=s;}
  try{let inv=0;if(S.etf){const d=Math.round(S.etf*Math.max(-15,.7+2.8*gs60()+ec60()*3)/100);S.etf=Math.max(0,S.etf+d);inv+=d;}
    if(S.stock){const d=Math.round(S.stock*Math.max(-35,.9+7*gs60()+ec60()*8)/100);S.stock=Math.max(0,S.stock+d);inv+=d;}
    if(inv){const B=S.invB60||{};const base=(B.etf||0)+(B.stock||0);const now=(S.etf||0)+(S.stock||0);const tot=base?` · 원금 대비 ${now-base>=0?'+':''}${Math.round((now-base)/base*100)}%`:'';
      lines.push({c:inv>0?'g':'r',t:`투자 평가 ${inv>0?'+':''}${inv.toLocaleString('ko-KR')}만 원 (ETF ${(S.etf||0).toLocaleString('ko-KR')}만 · 주식 ${(S.stock||0).toLocaleString('ko-KR')}만${tot})`});}}catch(e){console.error(e);}
  return r;};}
// 원금 기록: 사면 더하고, 전부 팔면 0으로
function invSnap60(){return {etf:S.etf||0,stock:S.stock||0,coin:S.coin||0};}
function invNote60(){try{const B=S.invB60||{};const row=(n,k)=>{const v=S[k]||0,b=B[k]||0;if(!v&&!b)return '';const p=b?Math.round((v-b)/b*100):0;return `${n} 원금 ${b.toLocaleString('ko-KR')}만 → 지금 <b style="color:${v>=b?'var(--good)':'var(--red)'}">${v.toLocaleString('ko-KR')}만 (${p>=0?'+':''}${p}%)</b>`;};
  const L=[row('ETF','etf'),row('주식','stock'),row('코인','coin')].filter(Boolean);return L.length?`<p class="hint">${L.join(' · ')}</p>`:'';}catch(e){return '';}}
{const _om60=openModal;openModal=function(t,b,c){try{if((t==='저축과 투자'||t==='코인 투자')&&S&&S.phase==='game'){S.invB60=S.invB60||{};b=String(b||'')+invNote60();
    if(t==='저축과 투자'&&typeof b==='string')b=b.replace('매달 -4%~+5% · 장기적으로 조금씩 오른다','');
    if(Array.isArray(c))c=c.map(x=>{if(!x||typeof x!=='object'||typeof x.fn!=='function')return x;const fn=x.fn;let sub=x.sub;
      if(/지수 ETF/.test(x.label||''))sub='매달 평균 +0.7% 안팎 · 잔잔하게 오래 오른다 · 경기가 좋으면 더';
      if(/개별 주식 .*매수/.test(x.label||''))sub=String(x.sub||'').replace(/매달 -12%~\+14%/,'매달 평균 +0.9% · 출렁임이 크다');
      return Object.assign({},x,{sub,fn:function(){const a=invSnap60();const r=fn.apply(this,arguments);try{const z=invSnap60(),B=S.invB60=S.invB60||{};['etf','stock','coin'].forEach(k=>{if(z[k]>a[k])B[k]=(B[k]||0)+(z[k]-a[k]);if(!z[k])B[k]=0;});}catch(e){}return r;}});});
    if(t==='코인 투자')b=b.replace('길게 보면 거의 제자리다.','길게 보면 조금 오르지만, 셋 중 하나는 손해를 본다.');}}catch(e){}
  return _om60.call(this,t,b,c);};}
// 코인 급등·급락 이벤트도 위아래가 같게
try{const ev=EVENTS.find(e=>String(e.run).includes('코인 급등'));if(ev){ev.run=()=>{const up=chance(.5);const v=Math.round(S.coin*(up?R(20,50):-R(20,45))/100);openModal(up?'코인 급등':'코인 급락',`<p class="lede">새벽에 알림이 울렸다. 넣어 둔 코인이 ${up?'폭등':'폭락'}했다. 지금 평가 ${(S.coin+v).toLocaleString('ko-KR')}만 원 (${v>=0?'+':''}${v.toLocaleString('ko-KR')}만).</p>`,[{label:'전부 판다',fn:()=>{const t=Math.max(0,S.coin+v);S.coin=0;try{(S.invB60=S.invB60||{}).coin=0;}catch(e){}toast(apply({money:t}));}},{label:'계속 들고 간다',fn:()=>{S.coin=Math.max(0,S.coin+v);toast('계속 들고 가기로 했다');}}]);};}}catch(e){}

// ---------- 2) 호감도가 높은 기자는 쉽게 떠나지 않는다 ----------
// 예전: 타사 영입·처우 불만 퇴사·주니어 이탈이 관계를 전혀 보지 않았다
function loy60(m){const r=(m&&m.rel)??20;return r>=90?.1:r>=75?.25:r>=55?.55:1;}
poachPick=function(){const T=S.team||[];const w=T.map(m=>{const st=npcStage(m);return (st==='mid'?3:st==='jr'?1.2:st==='sr'?.8:.2)*(1+Math.max(0,m.skill-50)/25)*(m.name===S.protege?((m.rel??20)>=60?.08:.5):1)*loy60(m);});let t=w.reduce((a,b)=>a+b,0)*Math.random();for(let i=0;i<T.length;i++){t-=w[i];if(t<=0)return T[i];}return T[0];};
quitBest=function(n,why){const out=[];for(let i=0;i<n&&(S.team||[]).length>3;i++){const L=S.team;const w=L.map(m=>(1+Math.max(0,(m.skill||40)-45)/15)*loy60(m));let t=w.reduce((a,b)=>a+b,0)*Math.random(),k=0;for(;k<L.length-1;k++){t-=w[k];if(t<=0)break;}const m=L[k];S.team=S.team.filter(x=>x!==m);S.co.staff=Math.max(1,S.co.staff-1);out.push(m.name);log(`${m.name} 기자 퇴사 — ${why}`);}if(out.length)S.co.q=clamp(S.co.q-out.length,10,100);return out;};
{const _nl60=npcLife;npcLife=function(lines){const keep=[];try{(S.team||[]).forEach(m=>{if(m&&loy60(m)<1&&chance(1-loy60(m))){keep.push([m,m.own]);m.own=S.turn;}});}catch(e){}
  try{return _nl60.apply(this,arguments);}finally{keep.forEach(([m,o])=>{if(o===undefined)delete m.own;else m.own=o;});}};}

// ---------- 3) 크라우드펀딩·엔젤 투자: 회사가 커지면 못 쓴다 ----------
const CF_CAP60=50,ANGEL_CAP60=200;
function cfBig60(){return !!(S&&S.co&&(S.co.cash>=CF_CAP60));}
{const _om60b=openModal;openModal=function(t,b,c){try{if(t==='투자 유치'&&Array.isArray(c)){const cash=S.co?S.co.cash:0;c=c.map(x=>{if(!x||typeof x!=='object')return x;
    if(x.label==='크라우드펀딩'&&cash>=CF_CAP60)return Object.assign({},x,{disabled:true,sub:`회사 자금 ${CF_CAP60}억 이상이면 독자에게 손을 벌릴 명분이 없다 (지금 ${eok(cash)})`});
    if(x.label==='엔젤 투자'&&cash>=ANGEL_CAP60)return Object.assign({},x,{disabled:true,sub:`이 정도 회사엔 엔젤 투자가 의미가 없다 (회사 자금 ${ANGEL_CAP60}억 이상)`});return x;});}}catch(e){}return _om60b.call(this,t,b,c);};}
try{EVENTS.filter(e=>/openModal\('크라우드펀딩'/.test(String(e.run))).forEach(e=>{const c0=e.c;e.c=()=>c0()&&!cfBig60();});}catch(e){}

// ---------- 4) 경쟁사 지분 인수 ----------
// 10% 배당 · 20% 이사회 한 자리(우리 기자 빼가기·사설 공격·광고 덤핑을 멈춘다) · 51% 자회사(자매사 시너지 · 배당 커짐)
function mnaOk60(){return !!(S&&!S.story&&S.co&&((S.rank===7&&!S.founder)||S.founder));}
function mnaSt60(){return S.mna60=S.mna60||{};}
function mnaP60(id){const x=(S.mna60||{})[id];return x?x.p:0;}
function mnaVal60(c){return Math.max(8,+((c.pw||10)*1.6+Math.max(0,c.cash||0)*.8).toFixed(1));}
try{ACT.mna60={n:'경쟁사 지분 인수',ap:1,sc:'office',cd:4,d:'다른 언론사 지분을 사들인다 — 배당 · 이사회 자리 · 과반이면 자회사'};ACT_IC.mna60='chart';ACT_STAT.mna60=ACT_STAT.fraise||ACT_STAT.board||ACT_STAT.exec||'lead';const g=ACT_GROUPS.find(x=>x[0]==='영업과 경영');if(g&&!g[2].includes('mna60'))g[2].push('mna60');}catch(e){}
{const _rk60=rankActs;rankActs=function(){const a=_rk60.apply(this,arguments);try{if(mnaOk60()&&!a.includes('mna60'))a.push('mna60');}catch(e){}return a;};}
{const _wy60=why;why=function(id){if(id==='mna60'){if(!mnaOk60())return '사장·발행인만 할 수 있다';if(!S.comp||!S.comp.length)return '경쟁사 정보가 없다';if((S.co.cash||0)<3)return '회사 자금이 모자라다 (최소 3억)';}return _wy60.apply(this,arguments);};}
RUN.mna60=function(){const L=(S.comp||[]).slice().sort((a,b)=>(b.pw||0)-(a.pw||0));const st=mnaSt60();
  openModal('경쟁사 지분 인수',`<p class="lede">회사 자금 <b>${eok(S.co.cash)}</b>. 어느 회사 지분을 살까?</p><p class="hint">지분 10% 이상이면 해마다 배당을 받는다. 20%면 이사회에 한 자리를 얻어 그 회사가 우리 기자를 빼 가거나 사설로 공격하지 못한다. 51%를 넘기면 자회사 — 자매사로 서로 기사를 받아 준다. 과반 인수는 독과점 논란으로 신뢰가 조금 깎인다.</p>`,
   L.map(c=>{const p=mnaP60(c.id);const v=mnaVal60(c);return {label:`${cName(c)}${p?` · 내 지분 ${p}%`:''}`,sub:`기업가치 약 ${eok(v)} · ${(C_STRAT[c.strat]||['?'])[0]} ${c.share>=1?` · 점유율 ${Math.round(c.share)}%`:''}${p>=51?' · 자회사':p>=20?' · 이사회 자리':''}`,fn:()=>{mnaOne60(c);return false;}};}).concat([{label:'닫기',cls:'ghost'}]));};
function mnaOne60(c){const st=mnaSt60();const x=st[c.id]=st[c.id]||{p:0,t0:S.turn,paid:0};const v=mnaVal60(c),n=cName(c),cash=S.co.cash;
  const tr=+(v*.1*(1+.08*(x.p/10))).toFixed(1);const need=Math.max(0,51-x.p);const tko=+(v*need/100*1.35).toFixed(1);const sell=+(v*x.p/100*.9).toFixed(1);
  const done=(t)=>{spend(1,3);setCd('mna60');toast(t);};
  const C=[];
  if(x.p<51)C.push({label:`지분 10% 매입 · ${eok(tr)}`,sub:`${x.p}% → ${x.p+10}%${x.p+10>=20&&x.p<20?' · 이사회 한 자리':''} · 살수록 값이 오른다`,disabled:cash<tr||x.p+10>50,fn:()=>{S.co.cash-=tr;x.p+=10;x.paid=+(x.paid+tr).toFixed(1);log(`${n} 지분 10% 매입 (${x.p}%)`);try{tick(`「${OUT().n}」, ${n} 지분 ${x.p}% 확보`,1);}catch(e){}done(`${n} 지분 ${x.p}% · -${eok(tr)}`);}});
  if(x.p>=20&&x.p<51)C.push({label:`경영권 인수 — 51%까지 공개매수 · ${eok(tko)}`,sub:'웃돈 35% · 자회사가 된다 · 독과점 논란(신뢰 조금↓)',risk:true,disabled:cash<tko,fn:()=>{S.co.cash-=tko;x.p=51;x.paid=+(x.paid+tko).toFixed(1);x.own=S.turn;c.aggro=0;try{S.co.bS+=.008;}catch(e){}log(`${n} 경영권 인수`);try{tick(`「${OUT().n}」, ${n} 인수 — 언론 그룹으로`,2);}catch(e){}done(`${n} 인수 · ${apply({trust:-2,fame:1.5})}`);}});
  if(x.p>0)C.push({label:`지분 전량 매각 · +${eok(sell)}`,sub:`${x.p}% 전부 · 시가보다 10% 싸게`,fn:()=>{S.co.cash+=sell;log(`${n} 지분 ${x.p}% 매각`);delete st[c.id];done(`${n} 지분 매각 · +${eok(sell)}`);}});
  C.push({label:'뒤로',cls:'ghost',fn:()=>{RUN.mna60();return false;}});
  openModal(`${n} 지분`,`<p class="lede">기업가치 약 <b>${eok(v)}</b> · 지금 내 지분 <b>${x.p}%</b>${x.paid?` (들인 돈 ${eok(x.paid)})`:''}.</p><p class="hint">${C_STRAT[c.strat]?`${C_STRAT[c.strat][0]} — ${C_STRAT[c.strat][1]}. `:''}회사 자금 ${eok(cash)}.</p>`,C);}
// 이사회 자리 이상: 우리를 겨냥한 수를 두지 않는다
{const _cd60=compDecide;compDecide=function(c,ctx){const k=_cd60.apply(this,arguments);try{const p=mnaP60(c&&c.id);if(p>=20&&['poach','editorial','pricecut','lgebid'].includes(k))return p>=51?'follow':'invest';}catch(e){}return k;};}
{const _so60=sisOf;sisOf=function(id){if(mnaP60(id)>=51)return true;return _so60.apply(this,arguments);};}
// 해마다 배당 (1월 첫 주)
{const _cm60=compMonth;compMonth=function(lines){const r=_cm60.apply(this,arguments);try{if(S.mna60&&S.co&&S.turn%YW===0&&S.mnaY60!==S.turn){S.mnaY60=S.turn;let tot=0;const by=[];
    Object.keys(S.mna60).forEach(id=>{const x=S.mna60[id];const c=(S.comp||[]).find(y=>y.id===id);if(!c||x.p<10)return;const d=+(x.p/100*Math.max(0,c.cash||0)*(x.p>=51?.45:.25)).toFixed(2);if(d<=0)return;c.cash-=d;S.co.cash+=d;tot+=d;by.push(`${cName(c)} ${eok(d)}`);});
    if(tot>0&&lines)lines.push({c:'g',t:`지분 배당 +${eok(tot)} (${by.join(' · ')})`});}}catch(e){console.error(e);}return r;};}

// ───── (예전 v61.js) ─────
/* 바이라인 1.6 — src/compat/v61.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 전수 조사 ①: 버그 · AI 선택 · 회사 금고 =====

// ---------- 1) 그룹 복귀(ownReturn) 때 기록 상자가 없으면 멈추던 문제 ----------
{const _or61=ownReturn;ownReturn=function(){try{if(S&&!S.grpOwn)S.grpOwn={};}catch(e){}return _or61.apply(this,arguments);};}

// ---------- 2) 맡기기 AI가 고르는 선택지 ----------
// 예전: 「거절·접는다·넘긴다」가 들어간 선택지는 무조건 피해서, 「광고주의 조건 → 써 준다」처럼 신뢰를 깎는 쪽을 골랐다
// 이제: 추천 · 방향 · 위험 · 신뢰·벌점·소송 표시를 점수로 따져 고른다
function aiBtnScore61(k,b,i){const D=AUTO_DIR[k]||{};const t=b.innerText||'';let s=0;
  if(b.classList.contains('rec')||b.querySelector('.bdg.rec,.rec'))s+=4;
  if(D.pref&&D.pref.test(t))s+=1.2;
  if(b.querySelector('.bdg.rsk')||b.classList.contains('risk')||/위험/.test(t))s-=k==='scoop'?1.5:3;
  if(/그만두|포기|취소|닫기|뒤로|나중에/.test(t))s-=3;
  if(/신뢰도?\s*↓↓|신뢰도?\s*크게\s*↓/.test(t))s-=3;else if(/신뢰도?\s*조금\s*↓/.test(t))s-=.8;else if(/신뢰도?\s*↓/.test(t))s-=2;
  if(/신뢰도?\s*(조금\s*|크게\s*)?↑/.test(t))s+=.8;
  if(/포털 벌점|벌점|들킬|윤리 위반|징계/.test(t))s-=1.5;
  if(/소송/.test(t)&&!/소송을 막|소송 방패/.test(t))s-=.8;
  if(/접는다|킬한다|덮는다/.test(t))s-=1;
  if(k==='money'&&/돈↑|매출↑|수입↑|광고↑/.test(t))s+=.6;
  if(k==='safe'&&/확인|반론|사실만|정정/.test(t))s+=.6;
  return s-i*.01;}
autoPickBtn=function(k,tried){const bs=[...document.querySelectorAll('#mc button')].filter(b=>!b.disabled&&!(tried&&tried.has((b.innerText||'').split('\n')[0])));if(!bs.length)return null;
  const main=bs.filter(b=>!b.classList.contains('ghost'));const L=main.length?main:bs;let best=null,bv=-1e9;L.forEach((b,i)=>{const v=aiBtnScore61(k,b,i);if(v>bv){bv=v;best=b;}});return best;};

// ---------- 3) 사장의 광고주 순회: 신뢰가 낮으면 추천하지 않는다 ----------
{const _om61=openModal;openModal=function(t,b,c){try{if(t==='광고주 영업 (사장)'&&Array.isArray(c)&&(S.trust??50)<50){c=c.map(x=>{if(!x||typeof x!=='object')return x;if(x.label==='대형 광고주 순회')return Object.assign({},x,{rec:false});if(/정부·공공기관/.test(x.label||''))return Object.assign({},x,{rec:true});return x;});}}catch(e){}return _om61.call(this,t,b,c);};}

// ---------- 4) 회사 금고: 경영권 밖이면 돈이 끝없이 쌓이지 않는다 ----------
// 예전: 큰 매체는 10년이면 회사 자금이 1,000억을 넘었고, 나중에 사장이 되면 그대로 물려받았다
// 이제: 해마다 연 매출의 0.8배를 넘는 현금은 60%를 대주주 배당·설비 투자로 내보낸다 (내가 사장·발행인이면 내가 정한다)
{const _om61b=orgMonth;orgMonth=function(lines){const r=_om61b.apply(this,arguments);try{const c=S.co;if(c&&!S.founder&&!S.story&&S.rank<7&&month()===12&&S.cashCapY61!==Math.floor(S.turn/YW)){S.cashCapY61=Math.floor(S.turn/YW);
    const yr=((c.last&&c.last.rev)||0)*12;if(yr>0&&c.cash>yr*.8){const out=+((c.cash-yr*.8)*.6).toFixed(1);c.cash-=out;if(lines&&S.rank>=4)lines.push({c:'',t:`연말 결산 — 쌓인 현금 ${eok(out)}을 대주주 배당과 설비 투자로 내보냈다 (회사 자금 ${eok(c.cash)})`});}}}catch(e){console.error(e);}return r;};}

// ---------- 5) 경찰서 기자실 텃세: 스포츠·연예·전문지·영문지·주간지 수습에겐 어색하다 ----------
try{EVENTS.filter(e=>String(e.run).includes("'기자실의 텃세'")).forEach(e=>{const c0=e.c;e.c=()=>c0()&&!['sports','trade','eng','weekly'].includes((OUT()||{}).type);});}catch(e){}

// ---------- 6) 효과가 안 적혀 있던 선택지에 효과를 적는다 (플레이어와 AI가 같이 보고 고른다) ----------
const SUB61={'회장님 사진':{'싣는다':'광고주 관계↑ · 자금 조금↑ · 신뢰↓','광고면에만 싣겠다고 한다':'광고주 관계 조금↓ · 신뢰 조금↑'},
 '정부 광고 축소':{'담당자를 찾아가 관계를 푼다':'기관 관계↑ · 신뢰 조금↓'},
 '정부 광고 배정':{'고맙게 받는다':'자금↑ · 신뢰 조금↓','편집국에 "신경 쓰지 말라"고 공지한다':'자금↑ · 신뢰↑'},
 '압수수색':{'협조한다':'취재원들이 등을 돌린다 · 신뢰↓'}};
{const _om61c=openModal;openModal=function(t,b,c){try{const M=SUB61[t];if(M&&Array.isArray(c))c=c.map(x=>x&&typeof x==='object'&&M[x.label]&&(!x.sub||!/신뢰/.test(x.sub))?Object.assign({},x,{sub:M[x.label]}):x);}catch(e){}return _om61c.call(this,t,b,c);};}

// ---------- 7) 데스킹: 문제 문장이 남았으면 출고 대신 보강 지시를 권한다 ----------
// 예전: 맡기기 AI가 문제 문장이 남은 초고도 늘 「출고한다」를 눌러, 부장 10년이면 신뢰가 70 넘게 깎였다
{const _om61d=openModal;openModal=function(t,b,c){try{if(t==='데스킹 3/3 · 처리'&&Array.isArray(c)&&/오보 위험/.test(String(b||''))){c=c.map(x=>{if(!x||typeof x!=='object')return x;if(x.label==='출고한다')return Object.assign({},x,{sub:(x.sub||'')+' · 오보 위험',rec:false});if(/^보강 지시/.test(x.label||''))return Object.assign({},x,{rec:true});return x;});}}catch(e){}return _om61d.call(this,t,b,c);};}

// ───── (예전 v62.js) ─────
/* 바이라인 1.6 — src/compat/v62.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 전수 조사 ②: 광고 목표 =====
// 반기 중간에 부서를 옮기거나 팀원이 새로 꾸려지면, 새 사람들의 실적은 0부터 쌓이는데 목표는 반기 전체 몫으로 잡혀
// 「목표 10억 · 실적 20%」처럼 처음부터 못 채우는 목표가 됐다 → 반기 중간에 들어온 사람은 남은 기간만큼만 목표를 진다
function qHalf62(){return Math.floor(S.turn/(4*QM));}
function qTrack62(m){if(!m||typeof m!=='object')return;const hk=qHalf62();if(m.qH62!==hk){m.qH62=hk;m.qS62=qMon()<=1?hk*4*QM:S.turn;}}
function qFrac62(m){try{if(!m||m.qH62!==qHalf62())return 1;const h0=qHalf62()*4*QM;return clamp((h0+4*QM-m.qS62)/(4*QM),0,1);}catch(e){return 1;}}
function qTrackAll62(){try{const per=roster();Object.values(per).forEach(L=>(L||[]).forEach(qTrack62));(S.team||[]).forEach(qTrack62);}catch(e){}}
{const _das62=deptAdStat;deptAdStat=function(d){const r=_das62.apply(this,arguments);try{if(r&&Array.isArray(r.rows)){let cut=0;r.rows.forEach(x=>{qTrack62(x.m);const f=qFrac62(x.m);if(f<1){cut+=x.goal*(1-f);x.goal*=f;x.part62=f;}});r.goal-=cut;r.cut62=cut;}}catch(e){}return r;};}
{const _em62=endMonth;endMonth=function(){qTrackAll62();const r=_em62.apply(this,arguments);qTrackAll62();return r;};}
// 영업 창: 부서 목표 가운데 내 몫이 얼마인지, 나머지는 누가 채우는지 보여 준다
{const _om62=openModal;openModal=function(t,b,c){try{if(t==='광고·협찬 영업'&&typeof b==='string'&&S&&S.co&&!S.founder&&(deptShared()||nrAll())){const st=nrAll()?nrAdStat():deptAdStat(S.dept);const own=quotaOwn(),mine=myAdDirect();const rest=Math.max(0,st.goal-own),restGot=Math.max(0,st.got-mine);
    const line=`<p class="hint" style="margin:6px 0 0">이 목표는 ${jo2(nrAll()?'편집국 전체 부서':'부서원 모두','이','가')} 함께 진다 — <b>내 몫 ${eok(own)}</b> (지금 ${eok(mine)}) · ${nrAll()?'부서들':'부서원'} 몫 ${eok(rest)} (지금 ${eok(restGot)}). 부서원은 매달 알아서 영업한다.</p>`;
    b=b.replace(/(<div class="adq">[\s\S]*?<\/p>)/,'$1'+line);}}catch(e){}return _om62.call(this,t,b,c);};}
