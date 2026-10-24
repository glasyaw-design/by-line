// 1.6 · AI 개선 · 안내 · 관계 한눈에 · NaN 방지 · 화면 간소화 · 밸런스 · 할 일 카드 아이콘
// 예전 파일 v51.js · v52.js · v53.js · v54.js · v55.js · v56.js를 순서 그대로 이어 붙였다

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
