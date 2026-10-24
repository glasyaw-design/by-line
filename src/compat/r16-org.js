// 1.6 · 조직 운영 · 지역 TO · 창간 모드 인사
// 예전 파일 v45.js · v46.js · v47.js · v48.js를 순서 그대로 이어 붙였다

// ───── (예전 v45.js) ─────
/* 바이라인 1.6 — src/compat/v45.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 조직 운영 다시 짜기: 인사가 실제로 남고, 팀장·차장·방침이 부서를 바꾼다 =====
// 문제였던 것: ① 승진시켜도 부서마다 차장 1자리라 「자리가 찼다」며 막혔다 ② 부장을 보직 해임해도 명단을 다시 정리할 때(가장 선임을 부서장으로) 그 사람이 되돌아왔다
// ③ 직급에 맞춰 연차가 몰래 바뀌었다 ④ 조직도는 보여 주기만 할 뿐 부서 성과와 잘 이어지지 않았다
// 이제: 내가 한 인사는 2년 동안 그대로 남는다(자동 정리가 손대지 않는다). 차장 정원은 부서 크기만큼, 모자라면 늘린다. 팀장 성향과 내가 정한 「부서 방침」이 매달 단독·오보·광고·성장으로 드러난다

const LK45=YW*2;
function lk45(m){return m&&m.lk45&&S.turn-m.lk45.t<LK45?m.lk45:null;}
function lock45(m){if(!m)return;m.lk45={r:m.r||0,t:S.turn,head:(m.r||0)>=2};}
function cap45(d,L){if(isRegD(d))return 99;const n=(L||[]).length;return Math.max(1,1+Math.floor(n/8))+((S.midX45||{})[d]||0);}
function mids45(L){const h=orgHead(L);return (L||[]).filter(m=>m!==h&&(m.r||0)===1&&!m.acting).length;}

// 자동 정리(fixDept)가 끝난 뒤 내가 한 인사를 다시 입힌다
{const _fd45=fixDept;fixDept=function(list,d){const lk=(list||[]).filter(m=>lk45(m));const ys=lk.map(m=>m.yrs);const r=_fd45.apply(this,arguments);
  try{if(lk.length&&!isRegD(d)){lk.forEach((m,i)=>{m.r=m.lk45.r;m.acting=0;m.yrs=ys[i];});
    const lh=list.filter(m=>lk45(m)&&m.lk45.head).sort((a,b)=>b.lk45.t-a.lk45.t)[0];
    let head=lh||list.filter(m=>(m.r||0)>=2&&!(lk45(m)&&m.lk45.r<2)).sort((a,b)=>orgScore(b)-orgScore(a))[0]||list.find(m=>m.acting&&!lk45(m))||null;
    list.forEach(m=>{if(m!==head&&(m.r||0)>=2){m.r=1;}if(m!==head)m.acting=0;});
    if(!head&&list.length>=2){const c=list.filter(m=>!lk45(m)).sort((a,b)=>orgScore(b)-orgScore(a))[0];if(c){if(orgCanRun()){c.r=Math.max(1,c.r||0);c.acting=1;}else{c.r=2;c.acting=0;}}}}}catch(e){console.error(e);}return r;};}
// 보직 해임된 사람은 2년 동안 부서장 후보에 오르지 않는다
{const _oc45=orgCands;orgCands=function(d){return _oc45.apply(this,arguments).filter(m=>!(lk45(m)&&m.lk45.dem));};}
// 팀장 배치는 어느 경로로 하든 내 인사로 남는다
{const _oa45=orgAssign;orgAssign=function(d,m,kind){const per=roster();const h0=orgHead(per[d]||[]);const r=_oa45.apply(this,arguments);try{if(m&&(m.r||0)>=1){lock45(m);if(kind==='head'&&h0&&h0!==m){lock45(h0);h0.lk45.dem=1;}}}catch(e){}return r;};}

// ---------- 승진 · 보직 해임 ----------
function pass45(m,L){(L||[]).filter(x=>x!==m&&(x.r||0)===(m.r||0)-1+0&&myrs(x)>myrs(m)+2&&(x.skill||0)>=(m.skill||0)).forEach(x=>{x.rel=clamp((x.rel??20)-5,-50,100);});}
{const _pb45=personBatch;personBatch=function(kind){if(kind!=='up'&&kind!=='down')return _pb45.apply(this,arguments);
  const sel=personSel();if(!sel.length){toast('먼저 기자를 골라 주세요');return false;}if(S.ap<1){toast('행동력이 1 필요하다');return false;}
  spend(1,3);setCd('personnel');const per=roster();const res=[],full=[],heads=[],gone=[];let good=0,bad=0;
  sel.forEach(m=>{const d=m.d,L=per[d]||[];
    if(kind==='up'){if((m.r||0)===0){if(mids45(L)<cap45(d,L)){m.r=1;m.acting=0;lock45(m);const fair=m.skill>=50&&myrs(m)>=6;m.rel=clamp((m.rel??20)+6,-50,100);m.skill=clamp(m.skill+1,0,95);if(fair)good++;else{bad++;pass45(m,L);}res.push(`${m.name} → ${DEPTS[d].n} 차장${fair?'':' (파격)'}`);}else full.push(m);}
      else if((m.r||0)===1)heads.push(m);else res.push(`${m.name}은(는) 이미 부서장이다`);}
    else{if((m.r||0)>=2||m.acting){const wasH=orgHead(L)===m;m.r=1;m.acting=0;lock45(m);m.lk45.dem=1;m.exHead=S.turn;m.rel=clamp((m.rel??20)-10,-50,100);const fair=orgScore(m)<orgBase()||((m.ai&&m.ai.er)||0)>=2;fair?good++:bad++;res.push(`${m.name}, ${DEPTS[d].n} 부서장에서 차장으로`);if(wasH)heads.push({__vac:d});}
      else if((m.r||0)===1){m.r=0;lock45(m);m.lk45.dem=1;m.rel=clamp((m.rel??20)-8,-50,100);const fair=(m.skill||0)<50;fair?good++:bad++;res.push(`${m.name}, 차장 보직 해임`);}
      if((m.rel??20)<-5&&chance(.15)){per[d]=(per[d]||[]).filter(x=>x!==m);if(S.co)S.co.staff=Math.max(1,S.co.staff-1);gone.push(m.name);}}});
  if(good){S.co.q=Math.min(100,S.co.q+.4*good);S.wMood=clamp((S.wMood??60)+.7*good,0,100);S.persOk=(S.persOk||0)+good;S.flags.plan=(S.flags.plan||0)+good*2;}
  if(bad){S.wMood=clamp((S.wMood??60)-.8*bad,0,100);apply(kind==='up'?{trust:-.4*bad}:{eval:-.6*bad});}
  log(`인사: ${res.join(' · ')||'변동 없음'}`);
  const FU=heads.map(m=>m.__vac?()=>{toast(`${DEPTS[m.__vac].n} 부서장 자리가 비었다 — 후임을 고르자`);orgPickPerson(m.__vac);}:()=>org45HeadFor(m)).concat(full.map(m=>()=>org45Full(m)));
  openModal('인사 발표',`<p class="lede">${res.length?res.map(esc).join('<br>'):'바로 바뀐 자리는 없다.'}</p><p>${good?`${good}명은 다들 납득했다. `:''}${bad?`${bad}명은 "${kind==='up'?'왜 저 사람이?':'너무하다'}"는 뒷말이 돈다. `:''}${gone.length?`${gone.join(', ')}${jp(gone[gone.length-1],'은','는')} 사표를 냈다. `:''}${heads.filter(x=>!x.__vac).length?`차장 ${heads.filter(x=>!x.__vac).length}명은 어느 부서 팀장으로 보낼지 정한다. `:''}${heads.some(x=>x.__vac)?'비게 된 부서장 자리의 후임을 고른다. ':''}${full.length?`${full.length}명은 차장 정원이 차 있다 — 정원을 늘리거나 사람을 바꾼다.`:''}</p><p class="hint">내가 한 인사는 2년 동안 그대로 유지된다. 연차·정기 인사 정리가 되돌리지 않는다.</p>`,FU.length?[{label:`이어서 정한다 (${FU.length}건)`,rec:true,fn:()=>{S._fu45=FU.slice(1);FU[0]();return false;}},{label:'나중에',cls:'ghost'}]:[{label:'확인'}]);return false;};}
// 후속 인사가 여러 건이면 하나 끝날 때마다 다음 것을 연다
{const _cm45=closeModal;closeModal=function(){if(S&&S._fu45&&S._fu45.length){const n=S._fu45.shift();try{n();return;}catch(e){}}return _cm45.apply(this,arguments);};}
// 차장 → 팀장: 어느 부서로?
function org45HeadFor(m){const per=roster();const D=orgDepts();const own=m.d;const L=D.map(d=>({d,q:orgDeptQ(d,per)})).filter(x=>x.q).sort((a,b)=>(a.d===own?-1:b.d===own?1:0)||(!a.q.h?-1:!b.q.h?1:0)||a.q.q-b.q.q).slice(0,6);
  openModal(`${m.name} 팀장 발령`,`<p class="lede">${esc(m.name)} 차장(실력 ${Math.round(m.skill)} · ${myrs(m)}년 차 · 부서장 점수 ${orgScore(m)})을 어느 부서 팀장으로 보낼까?</p><p class="hint">지금 팀장보다 점수가 확실히 높으면 다들 납득하고, 낮으면 뒷말이 돈다. 밀려난 팀장은 차장(선임)으로 남는다.</p>`,
   L.map(x=>({label:`${DEPTS[x.d].n}${x.d===own?' (지금 부서)':''} · 전력 ${orgGrade(x.q.q)}`,sub:x.q.h?`지금 팀장 ${x.q.h.name} (점수 ${orgScore(x.q.h)})`:'팀장 공석',fn:()=>{S.orgT=S.turn;orgAssign(x.d,m,'head');lock45(m);if(x.q.h&&x.q.h!==m){lock45(x.q.h);}return false;}})).concat([{label:'이번엔 보류',cls:'ghost'}]));}
// 차장 정원이 찼을 때
function org45Full(m){const per=roster();const d=m.d,L=per[d]||[];const h=orgHead(L);const M=L.filter(x=>x!==h&&(x.r||0)===1&&!x.acting).sort((a,b)=>orgScore(a)-orgScore(b));const cost=+(.004*(OUT().p||3)).toFixed(3);
  openModal(`${DEPTS[d].n} 차장 정원`,`<p class="lede">${esc(DEPTS[d].n)} 차장 자리(${cap45(d,L)}명)가 다 찼다. ${esc(m.name)}(실력 ${Math.round(m.skill)})을 어떻게 할까?</p>`,
   [{label:`정원을 하나 늘려 승진시킨다`,sub:`회사 인건비 월 ${eok(cost)}↑ · 데스크가 늘어 부서 기사 품질↑`,fn:()=>{S.midX45=S.midX45||{};S.midX45[d]=(S.midX45[d]||0)+1;S.co.extra=+((S.co.extra||0)+cost).toFixed(3);m.r=1;m.acting=0;lock45(m);m.rel=clamp((m.rel??20)+6,-50,100);toast(`${m.name}, ${DEPTS[d].n} 차장 (정원 증원)`);log(`인사: ${DEPTS[d].n} 차장 정원 증원 — ${m.name}`);}}]
   .concat(M.slice(0,2).map(x=>({label:`${x.name} 차장과 자리를 바꾼다`,sub:`${x.name}(점수 ${orgScore(x)})은 평기자로 · ${orgScore(m)>orgScore(x)+3?'다들 납득한다':'뒷말이 돈다'}`,fn:()=>{x.r=0;lock45(x);x.lk45.dem=1;x.rel=clamp((x.rel??20)-10,-50,100);m.r=1;m.acting=0;lock45(m);if(orgScore(m)<=orgScore(x)+3)S.wMood=clamp((S.wMood??60)-1,0,100);toast(`${m.name} 차장 · ${x.name} 평기자`);log(`인사: ${DEPTS[d].n} 차장 교체 ${x.name} → ${m.name}`);}})))
   .concat([{label:'이번엔 보류',cls:'ghost'}]));}

// ---------- 부서 방침 ----------
const POL45={none:['정하지 않음','팀장 성향대로 굴러간다'],scoop:['단독 우선','단독·특종↑ · 오보 위험↑ · 부서원 지침'],safe:['검증 우선','오보↓↓ · 단독 조금↓'],sales:['영업 강화','부서 광고 실적↑ · 신뢰 조금↓ · 단독↓'],grow:['인재 육성','부서원 실력이 빨리 큰다 · 당장 성과 조금↓']};
function pol45(d){return (S.pol45&&S.pol45[d])||'none';}
const STY45={scoop:'단독형',fact:'검증형',speed:'속보형',sales:'영업형',people:'관계형',inv:'탐사형'};
function sty45(h,d){try{return h?npcPref(h,d):null;}catch(e){return null;}}
function deptFx45(d,per){const q=orgDeptQ(d,per);if(!q||!q.h)return null;const z=(q.q-orgBase())/10;const st=sty45(q.h,d),p=pol45(d);
  let sc=.03+z*.03+(st==='scoop'||st==='inv'?.03:0)+(p==='scoop'?.05:p==='safe'?-.015:p==='sales'?-.015:p==='grow'?-.01:0);
  let er=.02-z*.015+(st==='speed'?.02:0)-(st==='fact'?.015:0)+(p==='scoop'?.025:p==='safe'?-.02:0);
  let ad=1+z*.04+(st==='sales'?.08:0)+(p==='sales'?.15:p==='grow'?-.04:0);
  let gr=(q.hs-orgBase()-2)/400+(p==='grow'?.06:0);
  return {q,z,st,p,sc:clamp(sc,0,.2),er:clamp(er,0,.12),ad:clamp(ad,.8,1.35),gr};}
// 매달: 부서마다 팀장·방침이 성과로 드러난다
function orgMonth45(lines){if(!S.co||S.story)return;const per=roster();const D=orgDepts();const T=new Set(S.team||[]);const show=orgCanRun();const rep=[];
  D.forEach(d=>{const L=per[d]||[];if(L.length<2)return;const F=deptFx45(d,per);if(!F)return;const nm=DEPTS[d].n;
    if(chance(F.sc)){S.co.q=Math.min(100,S.co.q+.6);if(show)apply({fame:.25});rep.push({c:'g',t:`${nm} 단독 — ${F.q.h.name} 팀장${F.p!=='none'?` · 방침 「${POL45[F.p][0]}」`:''} (전력 ${orgGrade(F.q.q)})`});}
    if(chance(F.er)){S.co.q=Math.max(10,S.co.q-.8);if(show)apply({trust:-.4});rep.push({c:'r',t:`${nm}에서 정정보도 — ${F.st==='speed'?'속보형 팀장이 서두르다':F.p==='scoop'?'단독 몰이 방침에 확인이 덜 됐다':'데스크가 놓쳤다'}`});}
    if(F.ad!==1)L.forEach(m=>{if(m.ai&&!T.has(m)&&slOk(m)){try{m.ai.q=(m.ai.q||0)+npcQuota(m,d)/QM*(F.ad-1)*.6;}catch(e){}}});
    if(F.p==='grow'||F.gr>0)L.forEach(m=>{if(!T.has(m)&&m!==F.q.h&&F.p==='grow')m.skill=clamp((m.skill||40)+.15,10,92);});
    if(F.p==='sales'&&show)apply({trust:-.05});
    if(F.p==='scoop')S.wMood=clamp((S.wMood??60)-.15,0,100);});
  rep.slice(0,3).forEach(x=>lines.push(x));}
{const _om45=orgMonth;orgMonth=function(lines){const r=_om45.apply(this,arguments);try{orgMonth45(lines);}catch(e){console.error(e);}return r;};}

// ---------- 조직 운영 화면 ----------
function org45Open(){if(!orgCanRun()){toast('조직 운영은 편집국장·대표만 할 수 있다');return;}const per=roster();const D=orgDepts();
  const rows=D.map(d=>{const q=orgDeptQ(d,per);if(!q)return null;const st=sty45(q.h,d);return {d,q,st};}).filter(Boolean);
  const weak=rows.slice().sort((a,b)=>a.q.q-b.q.q)[0];const best=weak&&orgCands(weak.d)[0];
  openModal('조직 운영',`<p class="lede">부서마다 팀장·차장·방침을 정한다. 팀장의 실력과 성향, 내가 정한 방침이 매달 그 부서의 단독·오보·광고·성장으로 나온다.</p>${weak&&best&&best!==weak.q.h?`<p class="hint">인사팀 의견: ${esc(DEPTS[weak.d].n)} 전력이 가장 처진다(${orgGrade(weak.q.q)}). ${esc(best.name)}(점수 ${orgScore(best)})을 팀장으로 검토해 보시죠.</p>`:''}<p class="hint">팀장 교체는 한 달에 행동력 1(여러 부서를 바꿔도 1). 방침·차장 지명은 행동력 없이.</p>`,
   rows.map(x=>({label:`${DEPTS[x.d].n} · 전력 ${orgGrade(x.q.q)}`,sub:`${x.q.h?`팀장 ${x.q.h.name}(${STY45[x.st]||'관리형'}${lk45(x.q.h)?' · 내 인사':''})`:'팀장 공석'} · 차장 ${mids45(per[x.d])}/${cap45(x.d,per[x.d])} · 방침 ${POL45[pol45(x.d)][0]} · ${x.q.n}명`,fn:()=>{org45Dept(x.d);return false;}})).concat([{label:'닫기',cls:'ghost'}]));}
function org45Dept(d){const per=roster();const L=per[d]||[];const q=orgDeptQ(d,per);const h=q&&q.h;const M=L.filter(m=>m!==h&&(m.r||0)===1&&!m.acting);const F=deptFx45(d,per);
  const cand=L.filter(m=>(m.r||0)===0&&myrs(m)>=4&&!(lk45(m)&&m.lk45.dem)).sort((a,b)=>orgScore(b)-orgScore(a)).slice(0,3);
  const body=`<div class="meta"><span>전력 <b>${q?orgGrade(q.q):'-'}</b></span><span>${h?`팀장 ${esc(h.name)} · ${STY45[sty45(h,d)]||'관리형'} · 실력 ${Math.round(h.skill)}`:'팀장 공석'}</span><span>차장 ${M.map(m=>esc(m.name)).join(', ')||'없음'} (${M.length}/${cap45(d,L)})</span><span>${L.length}명 · 평균 실력 ${q?q.avg:'-'}</span></div>${F?`<p class="hint" style="margin:6px 0 0">매달 단독 확률 약 ${Math.round(F.sc*100)}% · 정정보도 위험 약 ${Math.round(F.er*100)}% · 광고 실적 ${F.ad>=1?'+':''}${Math.round((F.ad-1)*100)}%${F.gr>0?' · 부서원 성장↑':''}</p>`:''}`;
  openModal(`${DEPTS[d].n} 운영`,body,[
   {label:'팀장 바꾸기',sub:'후보를 보고 고른다 · 행동력 1(이번 달 처음이면)',fn:()=>{orgPickPerson(d);return false;}},
   {label:'방침 정하기',sub:`지금: ${POL45[pol45(d)][0]} — ${POL45[pol45(d)][1]}`,fn:()=>{openModal(`${DEPTS[d].n} 방침`,`<p>이 부서가 이번에 무엇에 힘을 줄지 정한다. 팀장 성향(${STY45[sty45(h,d)]||'관리형'})과 맞으면 효과가 더 잘 난다.</p>`,Object.keys(POL45).map(k=>({label:POL45[k][0]+(pol45(d)===k?' (지금)':''),sub:POL45[k][1],fn:()=>{S.pol45=S.pol45||{};S.pol45[d]=k;log(`조직: ${DEPTS[d].n} 방침 「${POL45[k][0]}」`);toast(`${DEPTS[d].n} 방침 — ${POL45[k][0]}`);org45Dept(d);return false;}})));return false;}},
   ...cand.map(m=>({label:`${m.name} 차장 지명`,sub:`실력 ${Math.round(m.skill)} · ${myrs(m)}년 차 · 점수 ${orgScore(m)}${M.length>=cap45(d,L)?' · 정원이 차 있다':''}`,fn:()=>{if(M.length>=cap45(d,L)){org45Full(m);return false;}m.r=1;m.acting=0;lock45(m);m.rel=clamp((m.rel??20)+6,-50,100);log(`인사: ${DEPTS[d].n} 차장 ${m.name}`);toast(`${m.name}, ${DEPTS[d].n} 차장`);org45Dept(d);return false;}})),
   ...M.slice(0,2).map(m=>({label:`${m.name} 차장 보직 해임`,sub:`점수 ${orgScore(m)} · ${orgScore(m)<orgBase()?'다들 납득한다':'뒷말이 돈다'}`,fn:()=>{m.r=0;lock45(m);m.lk45.dem=1;m.rel=clamp((m.rel??20)-8,-50,100);if(orgScore(m)>=orgBase())S.wMood=clamp((S.wMood??60)-1,0,100);log(`인사: ${DEPTS[d].n} 차장 ${m.name} 해임`);toast(`${m.name} 차장 보직 해임`);org45Dept(d);return false;}})),
   {label:'뒤로',cls:'ghost',fn:()=>{org45Open();return false;}}]);}
// 인사권 행사 창 맨 위에 「조직 운영」 버튼
{const _pr45=RUN.personnel;RUN.personnel=function(){_pr45.apply(this,arguments);try{const mc=$('#mc');if(mc&&!mc.querySelector('[data-org45]')){const b=document.createElement('button');b.className='ch';b.dataset.org45=1;b.innerHTML='<span class="cl">조직 운영 — 팀장·차장·부서 방침</span><span class="chips"><i class="cp">부서마다 누가 이끌고 무엇에 힘줄지 · 성과가 매달 드러난다</i></span>';b.onclick=()=>org45Open();mc.insertBefore(b,mc.firstChild);}}catch(e){}};}
// 조직 탭: 팀장 성향·방침·내 인사 표시 + 버튼
{const _tb45=tabBody;tabBody=function(){let h=_tb45.apply(this,arguments);try{if(S.tab==='org'&&!S.story){const per=roster();const D=orgDepts();const rows=D.map(d=>{const q=orgDeptQ(d,per);if(!q)return '';const F=deptFx45(d,per);return `<li><span class="tg pc">${orgGrade(q.q)}</span><b>${esc(DEPTS[d].n)}</b> — ${q.h?`${esc(q.h.name)} 팀장 · ${STY45[sty45(q.h,d)]||'관리형'}${lk45(q.h)?' · 내 인사':''}`:'팀장 공석'} · 차장 ${mids45(per[d])}/${cap45(d,per[d])} · 방침 ${POL45[pol45(d)][0]}${F?` · 단독 ${Math.round(F.sc*100)}% / 정정 ${Math.round(F.er*100)}%`:''}</li>`;}).join('');
    const box=`<div class="card"><div class="t">${ic('users')} 조직 운영</div><ul class="pnl">${rows}</ul>${orgCanRun()?'<button class="ch" data-org45o="1" style="margin-top:8px"><span class="cl">조직 운영 열기</span></button>':'<p class="hint" style="margin:6px 0 0">팀장·차장·방침은 편집국장·대표가 정한다.</p>'}</div>`;h=box+h;}}catch(e){console.error(e);}return h;};}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-org45o]');if(!b)return;e.preventDefault();org45Open();});
// AI: 인사권자 추천 — 전력 D 부서가 있으면 조직 운영을 권한다
{const _rc45=recommend;recommend=function(){const r=_rc45.apply(this,arguments);try{if(S&&orgCanRun()&&!S.story&&S.orgT!==S.turn&&r!=='rest'&&r!=='breaking'&&rankActs().includes('personnel')&&!why('personnel')){const per=roster();if(orgDepts().some(d=>{const q=orgDeptQ(d,per);return q&&(!q.h||orgGrade(q.q)==='D');})&&chance(.5))return 'personnel';}}catch(e){}return r;};}
// 전력 기준: 1.6에서 AI 기자 실력 곡선을 올린 만큼 기준도 올린다 (예전 기준이면 거의 모든 부서가 S·A)
orgBase=function(){try{return 52+OUT().p*1.2;}catch(e){return 56;}};

// ───── (예전 v46.js) ─────
/* 바이라인 1.6 — src/compat/v46.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 지역 TO로 승진 적체를 푼다: 알리고, 고를 수 있게, 내 커리어 길로도 =====
// 본사엔 차장·부장 자리가 정해져 있는데 연차 찬 사람은 계속 늘어난다. 지역 주재 책임자(주재 차장 · 주재 부장 · 지역본부장/총국장) 자리가 그 숨통이다.
// 예전엔 정기 인사 때 몰래 일어나 잘 보이지 않았다 → 이제 TO 현황판, 인사권자의 「지역 발령」, 「지역 TO 신설」, 내가 직접 가는 「지역 책임자 공모」

const NEED46=[0,10,15,19];
function regD46(){const o=OUT();return o.depts.find(x=>isRegD(x));}
// 지역 TO: 주재지마다 둘 수 있는 직급 자리 (+ 내가 새로 만든 자리)
// 지역 TO를 넓힌다: ★3 이상 매체는 지역마다 주재 차장·주재 부장, 거점 지역은 지역본부장(국장급)까지 둔다 — 본사 적체를 받아 주는 자리
{const _cs46=corrSlots;corrSlots=function(P,r,n){let a=_cs46.apply(this,arguments)||[];try{const o=OUT();if(o&&(o.p||0)>=3&&!corrSmall(o)&&n>=1){const hub=(corrHubs(P)||[]).includes(r)||(P.regs&&P.regs.indexOf(r)>=0&&P.regs.indexOf(r)<2);const b=hub?(n>=2?[3,2,1]:[2]):(n>=3?[2,1]:n>=2?[2,1]:[1]);a=[...new Set(a.concat(b))];}
  const X=(S.corrX46||{})[r];if(X&&X.length)a=[...new Set(a.concat(X))];}catch(e){}return a.sort((x,y)=>y-x);};}
function to46(){const out={hq:{},reg:{},wait:{},vac:[]};try{const per=roster();const D=orgDepts();const T=new Set(S.team||[]);
  // 본사 자리: 부장 = 부서마다 1, 차장 = 정원
  out.hq[2]={cap:D.length,fill:D.filter(d=>orgHead(per[d]||[])).length};out.hq[1]={cap:D.reduce((a,d)=>a+cap45(d,per[d]),0),fill:D.reduce((a,d)=>a+mids45(per[d]),0)};
  // 대기자: 다음 직급 연차·실력이 찼는데 본사 윗자리가 없는 사람
  [0,1].forEach(r=>{out.wait[r+1]=D.flatMap(d=>(per[d]||[]).filter(m=>!T.has(m)&&(m.r||0)===r&&!m.acting&&myrs(m)>=NEED46[r+1]&&(m.skill||0)>=50&&!(lk45(m)&&m.lk45.dem)));});
  out.wait[2]=out.wait[2].filter(()=>out.hq[2].fill>=out.hq[2].cap);out.wait[1]=out.wait[1].filter(m=>mids45(per[m.d])>=cap45(m.d,per[m.d]));
  // 지역 자리
  if(Array.isArray(S.corr)&&S.corr.length&&!S.founder){const P=corrPlan(OUT());const regs=[...new Set(S.corr.map(m=>m.reg))];[1,2,3].forEach(rk=>{out.reg[rk]={cap:0,fill:0};});
    regs.forEach(r=>{const L=S.corr.filter(m=>m.reg===r);const sl=corrSlots(P,r,L.length);sl.forEach(rk=>{if(!out.reg[rk])return;out.reg[rk].cap++;if(L.some(m=>(m.r||0)===rk))out.reg[rk].fill++;else out.vac.push({reg:r,rk});});});}}catch(e){console.error(e);}return out;}
function toBox46(){try{if(S.founder||S.story)return '';const T=to46();const rd=regD46();if(!rd)return '';const rn=['','차장','부장','국장급'];const vac=r=>T.vac.filter(v=>v.rk===r).length;
  const row=(r,lab)=>{const h=T.hq[r],g=T.reg[r]||{cap:0,fill:0},w=(T.wait[r]||[]).length;return `<li><span class="tg pc">${lab}</span>본사 ${h?`${h.fill}/${h.cap}`:'—'} · 지역 ${g.fill}/${g.cap}${vac(r)?` <b style="color:var(--good)">빈 자리 ${vac(r)}</b>`:''}${w?` · <b style="color:var(--sodium)">승진 대기 ${w}명</b>`:''}</li>`;};
  const wN=(T.wait[1]||[]).length+(T.wait[2]||[]).length,vN=T.vac.length;
  return `<div class="card"><div class="t">${ic('map')} 인사 TO — 본사와 지역</div><ul class="pnl">${row(1,'차장')}${row(2,'부장')}${row(3,'국장급')}</ul><p class="hint" style="margin:4px 0 0">${wN&&vN?`본사에서 윗자리가 막힌 사람이 ${wN}명, 지역 책임자 자리가 ${vN}곳 비어 있다 — ${orgCanRun()?'「조직 운영 → 지역 발령」으로 풀 수 있다':'정기 인사 때 지역 책임자로 승진 발령이 난다'}.`:wN?`본사 적체 ${wN}명 — 지역 TO가 차 있다.${orgCanRun()?' 「지역 TO 신설」로 자리를 만들 수 있다.':''}`:'지금은 적체가 크지 않다.'} 지역 책임자는 승진이자 발령이다 — 몇 년 뒤 본사로 돌아오면 그 직급 그대로 온다.</p></div>`;}catch(e){return '';}}
{const _tb46=tabBody;tabBody=function(){let h=_tb46.apply(this,arguments);try{if(S.tab==='org'&&!S.story)h=toBox46()+h;}catch(e){}return h;};}

// 정기 인사: 지역 발령이 났으면 맨 위에 따로 알린다
{const _nj46=npcJinsa;npcJinsa=function(){const r=_nj46.apply(this,arguments);try{if(typeof r==='string'){const n=(r.match(/승진 발령/g)||[]).length;if(n)return `<p class="hint" style="color:var(--good)">적체 해소 — 본사에서 윗자리가 막혀 있던 ${n}명이 지역 책임자로 승진 발령됐다. 본사엔 자리가 하나씩 비어 다음 사람이 올라간다.</p>`+r;}}catch(e){}return r;};}
// 매달: 인사권자에게 적체 알림 (석 달에 한 번)
{const _om46=orgMonth;orgMonth=function(lines){const r=_om46.apply(this,arguments);try{if(orgCanRun()&&!S.founder&&(S.toN46??-99)<S.turn-12){const T=to46();const w=(T.wait[1]||[]).length+(T.wait[2]||[]).length;if(w>=2){S.toN46=S.turn;lines.push({c:'',t:`인사 적체: 승진 대기 ${w}명 · 지역 책임자 빈 자리 ${T.vac.length}곳 — 조직 운영에서 지역 발령으로 풀 수 있다`});}}}catch(e){}return r;};}

// ---------- 인사권자: 지역 발령 · 지역 TO 신설 ----------
function toOpen46(){if(!orgCanRun()){toast('인사권자만 할 수 있다');return;}const T=to46();const rd=regD46();if(!rd){toast('이 회사엔 지역 취재망이 없다');return;}
  const W=[].concat((T.wait[2]||[]).map(m=>[m,2]),(T.wait[1]||[]).map(m=>[m,1])).sort((a,b)=>orgScore(b[0])-orgScore(a[0])).slice(0,8);
  const used=new Set();const O=W.map(([m,rk])=>{const v=T.vac.find(x=>x.rk===rk&&!used.has(x));if(v)used.add(v);return {label:`${m.name} ${MR[rk-1]} → ${v?`${v.reg} ${corrTitle(rk)}`:`지역 ${corrTitle(rk)} (새 자리)`}`,sub:`${DEPTS[m.d]?DEPTS[m.d].n:''} · ${myrs(m)}년 차 · 실력 ${Math.round(m.skill)} · 점수 ${orgScore(m)}${v?' · 빈 자리로 승진 발령':' · 지역 TO를 새로 만든다(인건비↑)'}`,fn:()=>{toSend46(m,rk,v&&v.reg);return false;}};});
  openModal('지역 발령으로 적체 해소',`<p class="lede">본사 윗자리가 막힌 사람을 지역 책임자로 승진 발령한다. 본인은 승진하고, 본사엔 자리가 비어 다음 사람이 올라간다.</p><p class="hint">대기자 ${W.length}명 · 지역 빈 자리 ${T.vac.length}곳. 지역 책임자가 강하면 그 지역 평가·제보·광고가 오른다.</p>`,(O.length?O:[{label:'지금은 승진 대기자가 없다',disabled:true}]).concat([{label:'뒤로',cls:'ghost',fn:()=>{org45Open();return false;}}]));}
function toSend46(m,rk,reg){const rd=regD46();const per=roster();const from=m.d,oldR=m.r||0,P=corrPlan(OUT());let cost=0;
  if(!reg){const regs=[...new Set((S.corr||[]).map(x=>x.reg))];reg=regs.map(r=>[r,(S.corr||[]).filter(x=>x.reg===r&&(x.r||0)>=1).length]).sort((a,b)=>a[1]-b[1])[0];reg=reg&&reg[0];if(!reg){toast('지역 주재지가 없다');return;}S.corrX46=S.corrX46||{};S.corrX46[reg]=(S.corrX46[reg]||[]).concat([rk]);cost=+(.004*rk*(OUT().p||3)).toFixed(3);S.co.extra=+((S.co.extra||0)+cost).toFixed(3);}
  Object.keys(per).forEach(d=>{per[d]=(per[d]||[]).filter(x=>x!==m);});corrPromoteIn(m,rk,reg,rd);(per[rd]=per[rd]||[]).includes(m)||per[rd].push(m);lock45(m);m.rel=clamp((m.rel??20)+8,-50,100);m.hqFrom46=from;
  S.wMood=clamp((S.wMood??60)+.6,0,100);S.co.q=Math.min(100,S.co.q+.2);
  // 본사 연쇄 승진: 빈 자리에 다음 사람
  let chain='';try{const L=per[from]||[];if(oldR===1&&mids45(L)<cap45(from,L)){const c=L.filter(x=>(x.r||0)===0&&myrs(x)>=8&&(x.skill||0)>=48&&!(lk45(x)&&x.lk45.dem)).sort((a,b)=>orgScore(b)-orgScore(a))[0];if(c){c.r=1;lock45(c);c.rel=clamp((c.rel??20)+5,-50,100);chain=` · 본사 ${DEPTS[from].n} 차장 자리엔 ${c.name}${jp(c.name,'이','가')} 올라갔다`;}}}catch(e){}
  log(`인사: ${m.name} → ${reg} ${corrTitle(rk)} 승진 발령${cost?' (지역 TO 신설)':''}`);
  openModal('지역 발령',`<p class="lede"><b>${esc(m.name)}</b> ${MR[oldR]} → <b>${esc(reg)} ${corrTitle(rk)}</b> 승진 발령.</p><p>${cost?`${esc(reg)}에 ${corrTitle(rk)} 자리를 새로 만들었다(월 인건비 ${eok(cost)}↑). `:''}본사 적체가 풀려 편집국 분위기가 한결 낫다${esc(chain)}.</p>`,[{label:'다른 사람도 보낸다',fn:()=>{toOpen46();return false;}},{label:'닫기',cls:'ghost'}]);}
// 조직 운영 목록 맨 위에 버튼
{const _oo46=org45Open;org45Open=function(){_oo46.apply(this,arguments);try{if(regD46()&&!S.founder){const mc=$('#mc');if(mc&&!mc.querySelector('[data-to46]')){const T=to46();const w=(T.wait[1]||[]).length+(T.wait[2]||[]).length;const b=document.createElement('button');b.className='ch';b.dataset.to46=1;b.innerHTML=`<span class="cl">지역 발령으로 적체 해소</span><span class="chips"><i class="cp">승진 대기 ${w}명</i><i class="cp">지역 빈 자리 ${T.vac.length}곳</i></span>`;b.onclick=()=>toOpen46();mc.insertBefore(b,mc.firstChild);}}}catch(e){}};}

// ---------- 내 커리어: 지역 책임자 공모 ----------
// 본사에서 승진이 막혔을 때(같은 직급에 오래 있었는데 승진 신호가 없을 때) 지역 책임자 자리가 비면 공모가 온다. 가면 한 직급 올라 지역을 이끈다
function myStall46(){try{return !S.founder&&!S.story&&!S.op&&!S.chair&&S.rank>=2&&S.rank<=4&&!isRegD(S.dept)&&S.inRank>=promoMinW(S.rank)+YW/2;}catch(e){return false;}}
function leadOffer46(lines){if(!myStall46()||!regD46()||(S.leadOf46??-99)>S.turn-YW)return;if((S.eval||0)<38)return;const reg=corrVacant(S.rank);if(!reg||!chance(.25))return;S.leadOf46=S.turn;const rk=S.rank,title=corrTitle(rk);const stay=(S.eval||0)>=68&&S.inRank<promoMinW(S.rank)+YW;
  Q.push(()=>openModal('지역 책임자 공모',`<p class="lede">본사 ${rankName(S.rank+1)} 자리가 몇 년째 막혀 있다. 그때 인사팀에서 연락이 왔다. "${esc(reg)} ${title} 자리가 비었습니다. 가시면 승진 발령입니다."</p><p class="hint">지역을 이끄는 자리다 — 지역 기관·광고주와의 관계, 주재기자들의 제보가 내 몫이 된다. 2년쯤 뒤 본사로 돌아올 때는 올라간 직급 그대로 온다. 지역 평가가 A 이상이면 복귀 때 사내 평가도 오른다.</p>${stay?'<p class="hint">사내 평가가 높아 본사 승진도 멀지 않다 — 버텨 볼 만하다.</p>':''}`,[
   {label:`간다 — ${reg} ${title}`,rec:!stay,sub:'한 직급 승진 · 지역 책임자 재량(행동력 +1) · 지역 평판↑ · 본사 사내 정치와는 멀어진다',fn:()=>{const rd=regD46();promote();deptHistAdd(S.dept);S.dept=rd;S.deptT=S.turn;S.region=`${reg} ${title}`;S.items=S.items.filter(i=>catOf(rd).includes(i.d));if(S.rank>=2)S.team=genTeam();S.lead46={reg,t:S.turn};log(`${reg} ${jo2(title,'으로','로')} 승진 발령`);toast(`${reg} ${title} 발령`);try{deptArrive(rd);}catch(e){}}},
   {label:'본사에서 버틴다',rec:stay,sub:'승진은 다음 기회로 · 사내 평가 조금↑(충성)',fn:()=>{toast(apply({eval:.5}));}}]));}
{const _om46b=orgMonth;orgMonth=function(lines){const r=_om46b.apply(this,arguments);try{leadOffer46(lines);lead46Month(lines);}catch(e){console.error(e);}return r;};}
function lead46Month(lines){const L=S.lead46;if(!L||!isRegD(S.dept))return;apply({fame:.15});
  if(S.turn-L.t>=YW*2&&!L.ask){L.ask=1;const hq=OUT().depts.filter(d=>!isRegD(d)&&DEPTS[d]);Q.push(()=>openModal('본사 복귀 제안',`<p class="lede">${esc(L.reg)}에서 2년. 본사에서 "이제 올라오라"는 연락이 왔다.</p>`,hq.slice(0,6).map(d=>({label:`${jo2(DEPTS[d].n,'으로','로')} 복귀`,sub:`${rankName()} 그대로 · ${deptPCtxt(d,true)}`,fn:()=>{doRotate(d);S.region=null;S.lead46=null;toast(`본사 ${DEPTS[d].n} 복귀`);}})).concat([{label:'지역에 남는다',sub:'지역 책임자 재량은 계속',fn:()=>{L.ask=0;L.t=S.turn;}}])));}}
{const _ap46=apParts;apParts=function(){const p=_ap46.apply(this,arguments);try{if(S&&S.lead46&&isRegD(S.dept))p.push(['지역 책임자 재량',1]);}catch(e){}return p;};}
// AI: 인사권자에게 적체가 크면 조직 운영을 권한다(이미 1.6 조직 운영 추천에 더해 적체도 본다)
{const _rc46=recommend;recommend=function(){const r=_rc46.apply(this,arguments);try{if(S&&orgCanRun()&&!S.founder&&r!=='rest'&&r!=='breaking'&&rankActs().includes('personnel')&&!why('personnel')&&(S.toR46??-99)<S.turn-8){const T=to46();if(((T.wait[1]||[]).length+(T.wait[2]||[]).length)>=3&&T.vac.length){S.toR46=S.turn;return 'personnel';}}}catch(e){}return r;};}
// 지역 책임자로 막 발령된 달엔 「승진과 함께 다른 부서 발령」이 끼어들지 않는다
{const _dr46=doRotate;doRotate=function(nd){if(S&&S.lead46&&S.lead46.t===S.turn&&isRegD(S.dept)&&!isRegD(nd))return;return _dr46.apply(this,arguments);};}

// ───── (예전 v47.js) ─────
/* 바이라인 1.6 — src/compat/v47.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 지역 TO — AI 개선과 밸런스 =====
// 1) 순환: 지역 책임자도 3년쯤 지나면 본사 빈자리로 돌아온다 → 지역 TO가 다시 열려 적체 해소가 한 번으로 끝나지 않는다
// 2) 방치 비용: 인사권자가 적체를 오래 두면 분위기가 처지고 막힌 사람이 떠난다
// 3) 지역 책임자의 힘: 책임자가 강한 지역은 주재기자가 자라고 제보가 늘어난다 / 내가 책임자면 그 제보가 내 몫
// 4) TO 신설 상한, 공모 조건(사내 평가), 공모 추천은 내 승진 가능성을 보고 판단

// ---------- 1) 순환 복귀 ----------
function back47(lines){try{if(S.founder||!Array.isArray(S.corr)||!S.corr.length)return;const per=roster();const rd=regD46();if(!rd)return;const D=orgDepts().filter(d=>!isRegD(d));const T=new Set(S.team||[]);let n=0;
  S.corr.filter(m=>(m.r||0)>=1&&(m.r||0)<=2&&S.turn-(m.hqIn??m.t0??0)>=YW*3&&!T.has(m)&&npcAge(m)<56).sort((a,b)=>orgScore(b)-orgScore(a)).forEach(m=>{if(n>=2||!chance(.45))return;const rk=m.r||0;
    // 같은 직급 빈자리가 있는 본사 부서
    const d=(m.hqFrom46&&D.includes(m.hqFrom46)?[m.hqFrom46]:[]).concat(shuffle(D.slice())).find(d=>{const L=per[d]||[];return rk===2?!orgHead(L):mids45(L)<cap45(d,L);});if(!d)return;
    S.corr=S.corr.filter(x=>x!==m);per[rd]=(per[rd]||[]).filter(x=>x!==m);const from=m.reg;m.d=d;m.reg=null;m.role=null;m.acting=0;m.hqIn=null;m.back47=S.turn;(per[d]=per[d]||[]).push(m);try{lock45(m);}catch(e){}
    n++;const t=`${m.name} ${from} ${corrTitle(rk)} → 본사 ${DEPTS[d]?DEPTS[d].n:''} ${MR[rk]} 복귀 — ${from} 자리가 다시 열렸다`;log(t);if(lines)lines.push({c:'',t});});}catch(e){console.error(e);}}

// ---------- 2) 방치 비용 · 3) 지역 책임자의 힘 ----------
{const _om47=orgMonth;orgMonth=function(lines){const r=_om47.apply(this,arguments);try{
  if(!S.founder&&!S.story&&regD46()){
    // 순환은 반기마다
    if((S.bk47??-99)<=S.turn-YW/2){S.bk47=S.turn;back47(lines);}
    const T=to46();const w=(T.wait[1]||[]).length+(T.wait[2]||[]).length;
    if(orgCanRun()){S.jam47=w>=4&&T.vac.length?(S.jam47||0)+1:0;
      if(S.jam47>=6){S.wMood=clamp((S.wMood??60)-.35,0,100);
        if(S.jam47%6===0){const W=[].concat(T.wait[2]||[],T.wait[1]||[]).filter(m=>!(S.team||[]).includes(m));const m=W.length?pick(W):null;
          if(m&&chance(.5)){const per=roster();per[m.d]=(per[m.d]||[]).filter(x=>x!==m);const dest=pick(['경쟁사 경력 채용','대기업 홍보실','지역 방송사 보도국장','공기관 대변인실']);
            lines.push({c:'b',t:`승진 적체: ${m.name} ${MR[m.r||0]}(${DEPTS[m.d]?DEPTS[m.d].n:''}) → ${dest}. "자리가 안 날 거면 나가겠다" — 지역 책임자 자리 ${T.vac.length}곳은 아직 비어 있다`});log(`${m.name} 적체로 퇴사`);}
          else lines.push({c:'b',t:`승진 적체가 반년째다 — 편집국 분위기가 처진다(승진 대기 ${w}명 · 지역 빈 자리 ${T.vac.length}곳)`});}}}
    // 지역 책임자가 강한 지역: 주재기자가 자란다
    const C=(typeof corrs==='function'?corrs():[])||[];[...new Set(C.map(m=>m.reg).filter(Boolean))].forEach(rg=>{const L=C.filter(m=>m.reg===rg);const top=L.filter(m=>(m.r||0)>=1).sort((a,b)=>(b.skill||0)-(a.skill||0))[0];
      if(top&&(top.skill||0)>=55)L.filter(m=>!(m.r||0)).forEach(m=>{m.skill=Math.min(85,(m.skill||40)+.06*((top.skill-50)/10));});});
    // 내가 지역 책임자면 주재기자 제보가 내 몫
    if(S.lead46&&isRegD(S.dept)&&chance(.35)){const rg=S.lead46.reg;const L=C.filter(m=>m.reg===rg&&m!==undefined&&!(m.r||0));const by=L.length?pick(L):null;const it=makeItem('loc',{excl:chance(.4)});it.reg=rg;if(by){it.coord='co';it.coBy=by.name;}S.items.push(it);
      lines.push({c:'g',t:`${by?`${by.name} 주재기자`:`${rg} 주재팀`}가 책임자에게 제보를 올렸다 → 「${it.title}」`});}}}catch(e){console.error(e);}return r;};}

// ---------- 4) TO 신설 상한 ----------
function newCap47(){const regs=[...new Set((S.corr||[]).map(m=>m.reg))];return Math.max(2,Math.ceil(regs.length/2));}
function newUsed47(){return Object.values(S.corrX46||{}).reduce((a,x)=>a+(x||[]).length,0);}
{const _ts47=toSend46;toSend46=function(m,rk,reg){if(!reg){if(newUsed47()>=newCap47()){toast(`지역 TO 신설은 ${newCap47()}자리까지 — 빈 자리가 날 때를 기다린다`);return;}if(rk>=3&&(OUT().p||0)<4){toast('국장급 지역 자리 신설은 ★4 이상 매체만');return;}
    if(S.co&&S.co.cash<.3){toast('회사 돈이 모자라 자리를 새로 만들 수 없다');return;}}
  return _ts47.apply(this,arguments);};}
// 발령 목록: 새 자리는 상한 안내, 사람 추천은 실력·지역 적합도로
{const _to47=toOpen46;toOpen46=function(){_to47.apply(this,arguments);try{const mc=$('#mc');const lede=mc&&mc.parentElement&&mc.parentElement.querySelector('.hint');const left=newCap47()-newUsed47();
  if(lede&&!lede.dataset.n47){lede.dataset.n47=1;lede.innerHTML+=` 새 지역 TO는 ${Math.max(0,left)}자리 더 만들 수 있다. 실력 55 이상을 책임자로 보내면 그 지역 주재기자들이 함께 자란다. 지역 책임자는 3년쯤 뒤 본사 빈자리로 돌아온다.`;}
  const bs=[...mc.querySelectorAll('button.ch')];let best=null,bv=-1;bs.forEach(b=>{const t=b.textContent;const m=t.match(/실력 (\d+)/);if(m&&!/새 자리/.test(t)&&+m[1]>bv){bv=+m[1];best=b;}});if(best&&!best.querySelector('.rec47')){const i=document.createElement('i');i.className='cp rec47';i.style.color='var(--good)';i.textContent='추천';(best.querySelector('.chips')||best).appendChild(i);}}catch(e){}};}

// ---------- 공모: 조건과 AI 추천 ----------
// 사내 평가가 바닥이면 공모가 오지 않는다. 승진 직전(평가 높음)이면 「버틴다」를, 오래 막혔으면 「간다」를 추천
// 지역 책임자의 복귀 때: 지역 평가가 좋았으면 사내 평가 보너스
{const _rot47=doRotate;doRotate=function(nd){const L=S&&S.lead46;const r=_rot47.apply(this,arguments);try{if(L&&!L.done47&&!isRegD(S.dept)){L.done47=1;const E=regEval43().find(x=>x.r===L.reg);const g=E&&E.g;if(g==='S'||g==='A'){toast(apply({eval:3,fame:.5}));log(`${L.reg} 책임자 성과 인정 — 사내 평가↑`);}}}catch(e){}return r;};}
// AI: 승진 대기자를 3명 이상 두고 반년 넘게 방치하면 조직 운영 추천을 더 자주
{const _rc47=recommend;recommend=function(){const r=_rc47.apply(this,arguments);try{if(S&&(S.jam47||0)>=4&&orgCanRun()&&r!=='rest'&&r!=='breaking'&&rankActs().includes('personnel')&&!why('personnel')&&(S.toR47??-99)<S.turn-4){S.toR47=S.turn;return 'personnel';}}catch(e){}return r;};}

// ───── (예전 v48.js) ─────
/* 바이라인 1.6 — src/compat/v48.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 창간 모드 인사 바로잡기 + 영입 배치 + 수습 vs 경력 균형 =====
// (1) 창간 매체 위상이 저장·불러오기 뒤 되돌아가던 문제 → patch.py에서 oModApply가 창간 매체를 건드리지 않게
// (2) 영입한 기자의 실력이 연차 기준으로 다시 계산돼 깎이던 문제 → 영입 순간의 실력을 기준점으로 고정
// (3) 창간 모드 명부: 실제 직원만 (가상 인물로 채우지 않는다)
// (4) 창간 모드 부서장 후보: 다른 부서의 우리 기자도 데려와 앉힐 수 있다
// (5) 경력·스타 영입 때 어느 부서에 어떤 직책으로 둘지 고른다
// (6) 수습을 뽑을 이유: 공채 출신은 충성·성장, 경력·스타는 텃세·이탈 위험·처우 요구

function fix48(m){try{if(!m||m.yrs==null)return m;m._fy=m.yrs;m._sk0=m.skill;m._dv=m.skill-skillYrs(m.yrs);}catch(e){}return m;}

// (3) 창간 모드 명부
{const _ro48=roster;roster=function(){const per=_ro48.apply(this,arguments);try{if(S&&S.founder&&per){const keep=new Set([].concat(S.team||[],(typeof corrs==='function'?corrs():[])||[]));Object.keys(per).forEach(d=>{if(!DEPTS[d]||/^x_/.test(d))return;const L=per[d];if(!Array.isArray(L))return;for(let i=L.length-1;i>=0;i--)if(!keep.has(L[i]))L.splice(i,1);});
  // 팀에는 있는데 명부에 빠진 사람 넣기
  (S.team||[]).forEach(m=>{if(!per[m.d])per[m.d]=[];if(!Object.values(per).some(L=>Array.isArray(L)&&L.includes(m)))per[m.d].push(m);});}}catch(e){console.error(e);}return per;};}

// (4) 창간 모드 부서장 후보
{const _oc48=orgCands;orgCands=function(d){let C=_oc48.apply(this,arguments)||[];try{if(S&&S.founder){const per=roster();const L=(per[d]||[]).filter(m=>myrs(m)>=2||(m.skill||0)>=55);
  const out=Object.keys(per).filter(x=>x!==d&&DEPTS[x]&&!isRegD(x)).flatMap(x=>(per[x]||[]).filter(m=>m.rk==null&&(myrs(m)>=4||(m.skill||0)>=60)&&!(lk45(m)&&m.lk45.dem)));
  C=[...new Set(C.concat(L,out.sort((a,b)=>orgScore(b)-orgScore(a)).slice(0,6)))].filter(m=>m.rk==null).sort((a,b)=>orgScore(b)-orgScore(a)).slice(0,9);}}catch(e){}return C;};}

// (5) 영입 배치
function place48(list){list=(list||[]).filter(m=>m&&(S.team||[]).includes(m));if(!list.length)return;const m=list[0],rest=list.slice(1);const D=orgDepts();const per=roster();
  const fit=d=>{const L=(per[d]||[]).filter(x=>x!==m);const h=orgHead(L);return `${L.length}명 · 부서장 ${h?`${esc(h.name)}(실력 ${Math.round(h.skill)})`:'공석'}`;};
  openModal(`${m.name} 배치 — 어느 부서로`,`<p class="lede"><b>${esc(m.name)}</b> · 실력 ${Math.round(m.skill)} · ${myrs(m)}년 차${m.src48==='star'?' · 스타 기자':''}</p><p class="hint">영입한 사람을 어디에 어떤 직책으로 둘지 정한다. 행동력은 들지 않는다. 기존 사람 위에 앉히면 "굴러온 돌" 뒷말이 나온다.</p>`,
   D.map(d=>({label:DEPTS[d].n+(d===m.d?' (희망 부서)':''),sub:fit(d),rec:d===m.d,fn:()=>{place48Role(m,d,rest);return false;}})).concat([{label:'희망 부서에 평기자로 둔다',cls:'ghost',fn:()=>{if(rest.length)Q.push(()=>place48(rest));}}]));}
function place48Role(m,d,rest){const per=roster();Object.keys(per).forEach(x=>{if(Array.isArray(per[x]))per[x]=per[x].filter(y=>y!==m);});m.d=d;(per[d]=per[d]||[]).push(m);const L=per[d];const h=orgHead(L.filter(x=>x!==m));const mids=mids45(L.filter(x=>x!==m)),cap=cap45(d,L);
  const done=(t)=>{log(`배치: ${m.name} → ${DEPTS[d].n} ${t}`);toast(`${m.name} → ${DEPTS[d].n} ${t}`);if(rest.length)Q.push(()=>place48(rest));};
  const O=[{label:'부서장(팀장)',sub:h?`${h.name} 부서장은 차장으로 물러난다 · 기존 부서원 불만↑ · 실력이 확실히 나으면 납득`:'공석을 채운다',fn:()=>{if(h){h.r=1;h.acting=0;h.exHead=S.turn;h.rel=clamp((h.rel??20)-(m.skill-h.skill>=8?6:12),-50,100);}m.r=Math.max(2,m.r||0);m.acting=0;m.headT=S.turn;lock45(m);
      if(h){const gap=orgScore(m)-orgScore(h);S.wMood=clamp((S.wMood??60)+(gap>=8?-.3:-1.5),0,100);L.filter(x=>x!==m&&x!==h).forEach(x=>{x.rel=clamp((x.rel??20)-(gap>=8?1:3),-50,100);});}done('부서장');}},
   {label:'차장',sub:mids>=cap?`차장 정원(${cap})이 찼다 — 정원을 하나 늘린다(인건비↑)`:'부서장을 받치는 자리',fn:()=>{if(mids>=cap){S.midX45=S.midX45||{};S.midX45[d]=(S.midX45[d]||0)+1;S.co.extra=+((S.co.extra||0)+.004*(OUT().p||2)).toFixed(3);}m.r=1;m.acting=0;lock45(m);done('차장');}},
   {label:'평기자',sub:'직책 없이 현장부터 — 기존 부서원 반발 없음',fn:()=>{m.r=0;lock45(m);done('평기자');}}];
  openModal(`${m.name} — ${DEPTS[d].n}에서 맡을 직책`,`<p>${DEPTS[d].n}: ${L.length-1}명 · 부서장 ${h?`${esc(h.name)} (실력 ${Math.round(h.skill)})`:'공석'} · 차장 ${mids}/${cap}</p>`,O);}

// 채용이 끝나면: 영입자 표시 · 실력 고정 · (경력·스타) 배치 · 텃세
{const _hb48=hireBoard;hireBoard=function(kind){const before=new Set(S.team||[]);const r=_hb48.apply(this,arguments);try{
  // 채용 확정은 버튼 클릭 때 일어나므로, 결과 창이 뜰 때 새로 들어온 사람을 찾는다
  S._hb48={kind,before:[...before].map(m=>m.id)};}catch(e){}return r;};}
{const _om48=openModal;openModal=function(t,b,c){try{if(t==='채용 결과'&&S&&S._hb48){const H=S._hb48;S._hb48=null;const old=new Set(H.before);const corrAll=(typeof corrs==='function'?corrs():[])||[];const nw=[].concat(S.team||[],corrAll,...Object.values(S.corrList||{}).filter(Array.isArray)).filter(m=>m&&m.t0===S.turn&&!old.has(m.id)&&!m.src48);
    nw.forEach(m=>{m.src48=H.kind;m.hT48=S.turn;fix48(m);});
    const pro=nw.filter(m=>H.kind!=='new'&&(S.team||[]).includes(m));
    if(H.kind!=='new'&&nw.length){const k=H.kind==='star'?1.2:.4;S.wMood=clamp((S.wMood??60)-k*nw.length,0,100);
      b+=`<p class="hint">${H.kind==='star'?'스타 영입은 회사 얼굴이 되지만, 기존 기자들 사이엔 "우리는 뭐냐"는 말도 돈다':'경력 기자가 들어오면 기존 기자들이 조금 긴장한다'} (편집국 분위기 −${(k*nw.length).toFixed(1)}). 경력·스타는 3년 안에 더 좋은 조건을 찾아 떠날 수도 있다.</p>`;}
    if(H.kind==='new'&&nw.length){S.wMood=clamp((S.wMood??60)+.3*nw.length,0,100);b+=`<p class="hint">공채 기수가 들어왔다 — 편집국에 활기가 돈다. 우리 손으로 키운 기자는 오래 남고 빨리 자란다.</p>`;}
    if(pro.length){c=[{label:'배치를 정한다',rec:true,sub:'어느 부서 · 어떤 직책(부서장·차장·평기자)',fn:()=>{Q.push(()=>place48(pro));}},{label:'희망 부서에 그냥 둔다',cls:'ghost'}];}}}catch(e){console.error(e);}return _om48.call(this,t,b,c);};}

// (6) 매달: 공채 출신 성장 보너스 · 경력·스타 적응/이탈
{const _om48m=orgMonth;orgMonth=function(lines){const r=_om48m.apply(this,arguments);try{if(!S.story){const T=S.team||[];
  T.forEach(m=>{if(m.src48==='new'&&m.rk==null&&S.turn-(m.hT48||0)<YW*5)m.skill=Math.min(88,(m.skill||30)+.12);});
  const out=T.filter(m=>(m.src48==='career'||m.src48==='star')&&S.turn-(m.hT48||0)<YW*3&&S.turn-(m.hT48||0)>=YW/2);
  const mood=S.wMood??60;out.forEach(m=>{const p=(m.src48==='star'?.012:.006)*(mood<45?2:mood>70?.6:1)*((m.rel??20)<0?1.6:1)*((S.payLv||1)<1?1.5:1)*((m.rel??20)>=90?.1:(m.rel??20)>=75?.25:(m.rel??20)>=55?.55:1);
    if(chance(p)){S.team=S.team.filter(x=>x!==m);try{const per=roster();if(per[m.d])per[m.d]=per[m.d].filter(x=>x!==m);}catch(e){}S.co.staff=Math.max(1,(S.co.staff||1)-1);try{S.co.extra=Math.max(0,+((S.co.extra||0)-hireCostD(m.src48,m)).toFixed(3));}catch(e){}
      const dest=(S.comp||[]).length?cName(pick(S.comp)):'경쟁사';lines.push({c:'b',t:`${m.name} ${jo2(m.src48==='star'?'스타 기자':'경력 기자','이','가')} ${dest}의 더 좋은 조건을 받고 떠났다 — 영입 ${Math.round((S.turn-m.hT48)/4)}개월 만`});log(`${m.name} 이직 (영입 기자)`);}});}}catch(e){console.error(e);}return r;};}
