/* 바이라인 1.6 — src/compat/v35.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.4 조직 운영: 인사가 실제로 남고, 부서장이 부서를 바꾼다 =====
// 1) 명단을 새로 만들 때(인원 변화·부서 이동·채용) 기존 사람·직급·배치가 사라지던 문제 → 예전 사람을 그대로 옮겨 담고 모자란 자리만 새로 채운다
{const _ros=roster;roster=function(){const prev=S&&S.ros&&S.rosOut===S.outlet&&S.ros.per?S.ros:null;const keep=[];
  if(prev)Object.entries(prev.per).forEach(([d,L])=>(L||[]).forEach(m=>{if(m)keep.push([m.d||d,m]);}));const snap=new Map();keep.forEach(([d,m])=>snap.set(m,[m.r||0,m.acting||0]));(S.team||[]).forEach(m=>{if(!snap.has(m))snap.set(m,[m.r||0,m.acting||0]);});
  const r=_ros.apply(this,arguments);
  try{if(prev&&S.ros!==prev&&keep.length){const per=S.ros.per;const T=new Set(S.team||[]);const byD={};const seen=new Set();
    keep.forEach(([d,m])=>{if(T.has(m)||seen.has(m)||!per[d])return;seen.add(m);(byD[d]=byD[d]||[]).push(m);});
    Object.keys(per).forEach(d=>{const old=byD[d];if(!old||!old.length)return;const tgt=per[d].length;let L=per[d].filter(m=>T.has(m)).concat(old);
      if(L.length<tgt)per[d].filter(m=>!T.has(m)&&!(m.r>0)&&!m.acting&&!L.includes(m)).forEach(m=>{if(L.length<tgt)L.push(m);});
      if(L.length>tgt){const rm=L.filter(m=>!T.has(m)&&!(m.r>0)&&!m.acting&&!m.hq&&!m.isCap&&!m.desk).sort((a,b)=>a.skill-b.skill);while(L.length>tgt&&rm.length){const x=rm.shift();L.splice(L.indexOf(x),1);}}
      per[d]=L;});
    snap.forEach((v,m)=>{m.r=v[0];m.acting=v[1];});
    try{syncPeople(per);}catch(e){}try{dedupeNames(per);}catch(e){}return per;}}catch(e){console.error(e);}return r;};}
function rosRelocate(){if(!S.ros||!S.ros.per)return;const per=S.ros.per;Object.keys(per).forEach(d=>{per[d]=(per[d]||[]).filter(m=>{if(m.d&&m.d!==d&&DEPTS[m.d]){(per[m.d]=per[m.d]||[]).includes(m)||per[m.d].push(m);return false;}return true;});});}
// 2) 부서장 점수 (실력 + 연차 + 올해 성적) — 인사팀 AI가 이걸로 추천한다
function orgScore(m){if(!m)return 0;const a=m.ai||{};const y=myrs(m);return Math.round((m.skill||40)+clamp((y-10)/2,-6,6)+((a.e??50)-50)*.15+Math.min(6,(a.sc||0)*1.5)-Math.min(9,(a.er||0)*3)+(m.rel!=null?clamp((m.rel-20)/20,-2,2):0));}
function orgHead(L){return (L||[]).find(m=>(m.r||0)>=2)||(L||[]).find(m=>m.acting)||null;}
function orgMid(L,h){return (L||[]).find(m=>m!==h&&m.r===1&&!m.acting)||null;}
function orgDepts(){const o=OUT();return o.depts.filter(d=>DEPTS[d]&&!isRegD(d));}
function orgBase(){try{return 44+OUT().p*1.2;}catch(e){return 48;}}
function orgGrade(v){const b=orgBase();return v>=b+12?'S':v>=b+6?'A':v>=b?'B':v>=b-6?'C':'D';}
function orgDeptQ(d,per){per=per||roster();const L=per[d]||[];if(!L.length)return null;const h=orgHead(L),c=orgMid(L,h);const avg=L.reduce((a,m)=>a+(m.skill||40),0)/L.length;
  const hs=h?orgScore(h)-(h.acting?4:0):30;return {d,n:L.length,h,c,avg:Math.round(avg),hs,q:Math.round(hs*.6+(c?orgScore(c):avg-4)*.15+avg*.25)};}
function orgCanRun(){return !S.founder?S.rank>=6:true;}
// 3) 부서장(팀장) 배치
function orgPickDept(){const per=roster();const D=orgDepts();
  openModal('부서장(팀장) 배치',`<p>부서마다 부장(팀장) 한 명과 차장을 둔다. 부서장의 실력·성적이 그 부서 기사 품질과 단독, 부서원 성장에 그대로 반영된다.</p><p class="hint">한 번 들어오면 이번 달엔 여러 부서를 바꿔도 행동력 1. 「인사팀 추천」은 실력·연차·올해 성적·평판을 따져 고른 1순위다.</p>`,
   D.map(d=>{const q=orgDeptQ(d,per);if(!q)return null;const h=q.h;return {label:`${DEPTS[d].n} · 부서 전력 ${orgGrade(q.q)}`,sub:h?`${h.acting?'직무대리 ':''}${esc(h.name)} (실력 ${Math.round(h.skill)}·${myrs(h)}년 차)${q.c?` · 차장 ${esc(q.c.name)}`:' · 차장 없음'} · ${q.n}명`:`부서장 공석 · ${q.n}명`,fn:()=>{orgPickPerson(d);return false;}};}).filter(Boolean).concat([{label:'뒤로',cls:'ghost',fn:()=>{RUN.personnel();return false;}}]));}
function orgCands(d){const per=roster();const L=(per[d]||[]).slice();const out=Object.keys(per).filter(x=>x!==d&&DEPTS[x]&&!isRegD(x)).flatMap(x=>(per[x]||[]).filter(m=>(m.r||0)>=1&&!(S.team||[]).includes(m)&&m!==orgHead(per[x])));
  const C=L.concat(out.sort((a,b)=>orgScore(b)-orgScore(a)).slice(0,4)).filter(m=>myrs(m)>=6).sort((a,b)=>orgScore(b)-orgScore(a)).slice(0,8);return C;}
function orgPickPerson(d){const per=roster();const L=per[d]||[];const h=orgHead(L),c=orgMid(L,h);const C=orgCands(d);const best=C[0];
  openModal(`${DEPTS[d].n} 부서장 고르기`,`<p>지금 부서장: <b>${h?esc(h.name)+` (${h.acting?'직무대리 · ':''}실력 ${Math.round(h.skill)})`:'공석'}</b>${c?` · 차장 ${esc(c.name)}`:''}</p><p class="hint">연차가 짧은 사람을 앉히면 "파격 인사" 뒷말이 돌고, 실력이 앞 사람보다 확실히 나으면 다들 납득한다. 밀려난 부서장은 차장(선임)으로 남는다 — 사이가 틀어질 수 있다.</p>`,
   C.map(m=>({label:`${m===best?'★ ':''}${esc(m.name)} · ${MR[Math.min(3,m.r||0)]}${m.d!==d?` (${DEPTS[m.d]?DEPTS[m.d].n:''}에서)`:''}`,sub:`부서장 점수 ${orgScore(m)} · 실력 ${Math.round(m.skill)} · ${myrs(m)}년 차${m.ai?` · ${npcLine(m)}`:''}${m===best?' · 인사팀 추천':''}${m===h?' · 지금 부서장':''}`,fn:()=>{if(m===h){toast('이미 부서장이다');return false;}orgAssign(d,m,'head');return false;}}))
   .concat(C.filter(m=>m!==h&&m!==c).slice(0,3).map(m=>({label:`${esc(m.name)} → 차장으로`,sub:'부서장은 그대로, 차장 자리만',fn:()=>{orgAssign(d,m,'mid');return false;}})))
   .concat([{label:'뒤로',cls:'ghost',fn:()=>{orgPickDept();return false;}}]));}
function orgSpend(){if(S.orgT===S.turn)return true;if(S.ap<1){toast('행동력이 1 필요하다');return false;}spend(1,2);setCd('personnel');S.orgT=S.turn;return true;}
function orgAssign(d,m,kind){if(!orgSpend())return;const per=roster();const L=per[d]=per[d]||[];const h=orgHead(L),c=orgMid(L,h);
  if(m.d!==d){Object.keys(per).forEach(x=>{if(x!==d)per[x]=(per[x]||[]).filter(y=>y!==m);});m.d=d;if(!L.includes(m))L.push(m);}
  const msg=[];let mood=0;
  if(kind==='head'){const fr=myrs(m)<12;const gap=h?orgScore(m)-orgScore(h):10;
    if(h){h.r=1;h.acting=0;h.exHead=S.turn;if(h.rel!=null)h.rel-=gap>=0?6:12;msg.push(`${h.name} 부장은 차장(선임)으로 물러났다`);}
    m.r=Math.max(2,m.r||0);m.acting=0;m.headT=S.turn;
    if(gap>=5&&!fr){mood+=1.2;msg.push('편집국이 고개를 끄덕였다');}else if(gap<-5){mood-=2;apply({trust:-.4});msg.push('"왜 저 사람이?" 뒷말이 돈다');}else if(fr){mood-=1;msg.push('연차가 짧아 "파격 인사"라는 말이 나온다');}
    log(`인사: ${DEPTS[d].n} 부서장 ${m.name}`);}
  else{if(m===h){toast('부서장은 차장으로 둘 수 없다');return;}m.r=1;m.acting=0;log(`인사: ${DEPTS[d].n} 차장 ${m.name}`);msg.push(`${m.name}, ${DEPTS[d].n} 차장`);}
  S.wMood=clamp((S.wMood??60)+mood,0,100);S.orgLog=(S.orgLog||[]).concat([{t:S.turn,d,n:m.name,k:kind}]).slice(-20);
  openModal('인사 발표',`<p class="lede">${DEPTS[d].n} ${kind==='head'?'부서장':'차장'} — <b>${esc(m.name)}</b> (실력 ${Math.round(m.skill)} · ${myrs(m)}년 차)</p><p>${msg.map(esc).join('. ')}.</p>${fxLine(orgFxOf(orgDeptQ(d)))}`,[{label:'다른 부서도 정한다',fn:()=>{orgPickDept();return false;}},{label:'닫기',cls:'ghost'}]);}
function orgFxOf(q){if(!q)return '';const v=q.q,b=orgBase();return v>=b+10?'부서 전력 '+orgGrade(v)+' · 이 부서 기사 품질↑ · 부서원이 빨리 큰다':v<b-6?'부서 전력 '+orgGrade(v)+' · 오보·사고 위험↑':'부서 전력 '+orgGrade(v);}
// 인사권 행사 창에 버튼 추가
{const _pr=RUN.personnel;RUN.personnel=function(){_pr.apply(this,arguments);try{const mc=$('#mc');if(mc&&!mc.querySelector('[data-org]')){const b=document.createElement('button');b.className='ch';b.dataset.org=1;b.innerHTML='<span class="cl">부서장(팀장) 배치</span><span class="chips"><i class="cp">부서마다 누가 이끌지 정한다 · 부서 전력에 바로 반영</i></span>';b.onclick=()=>orgPickDept();mc.insertBefore(b,mc.firstChild);}}catch(e){}};}
// 4) 매달: 부서장이 부서를 바꾼다 + AI 인사팀이 빈자리를 채운다 + 밀려난 부서장 AI
function orgMonth(lines){if(!S.co||S.story)return;const per=roster();const D=orgDepts();if(!D.length)return;const T=new Set(S.team||[]);const Q0=[];
  D.forEach(d=>{const L=per[d]||[];if(L.length<2)return;let q=orgDeptQ(d,per);if(!q)return;
    // 공석 2달이면 AI 인사팀이 1순위를 앉힌다 (내가 사장·국장이면 알림만, 석 달째엔 자동)
    if(!q.h){const k='vac_'+d;S.orgVac=S.orgVac||{};S.orgVac[k]=(S.orgVac[k]||0)+1;if(S.orgVac[k]>=(orgCanRun()?3:1)){const c=orgCands(d)[0];if(c){c.r=Math.max(2,c.r||0);c.acting=0;if(c.d!==d){Object.keys(per).forEach(x=>{if(x!==d)per[x]=per[x].filter(y=>y!==c);});c.d=d;L.push(c);}lines.push({c:'',t:`인사팀이 비어 있던 ${DEPTS[d].n} 부서장에 ${c.name}(실력 ${Math.round(c.skill)})을 앉혔다`});S.orgVac[k]=0;q=orgDeptQ(d,per);}}
      else if(orgCanRun())lines.push({c:'r',t:`${DEPTS[d].n} 부서장이 비어 있다 — 인사권 행사 → 부서장 배치`});}
    if(!q.h)return;
    // 부서장 실력이 부서원 성장·사기로 번진다
    const g=(q.hs-orgBase()-2)/400;L.forEach(m=>{if(!T.has(m)&&m!==q.h)m.skill=clamp((m.skill||40)+g,10,95);});
    npcAI(q.h);
    if(q.q<orgBase()-7&&chance(.06)){Q0.push({c:'r',t:`${DEPTS[d].n}에서 데스크를 거치지 않은 기사가 나가 정정보도를 냈다 (부서 전력 ${orgGrade(q.q)})`});S.co.q=Math.max(10,S.co.q-1);}
    if(q.q>=orgBase()+10&&chance(.05)){Q0.push({c:'g',t:`${DEPTS[d].n} ${q.h.name} 부장이 이끄는 팀이 단독을 냈다 (부서 전력 ${orgGrade(q.q)})`});S.co.q=Math.min(100,S.co.q+.6);if(S.rank>=6||S.founder)apply({fame:.3});}
    // 밀려난 부서장 AI: 사이가 나쁘면 버티거나 떠난다
    L.filter(m=>m.exHead&&S.turn-m.exHead<=24&&!T.has(m)).forEach(m=>{if((m.rel??20)<0&&chance(.08)){per[d]=per[d].filter(x=>x!==m);if(S.co)S.co.staff=Math.max(1,S.co.staff-1);Q0.push({c:'r',t:`부서장에서 밀려난 ${m.name} 차장이 사표를 냈다`});}else if((m.rel??20)>=15&&chance(.05)){m.exHead=0;Q0.push({c:'g',t:`부서장에서 물러난 ${m.name} 차장이 새 부장을 도와 부서를 다잡았다`});m.skill+=.5;}});});
  // 조직 전체 점수 → 보도 품질·사기
  const qs=D.map(d=>orgDeptQ(d,per)).filter(Boolean);if(qs.length){const avg=qs.reduce((a,x)=>a+x.q,0)/qs.length;S.orgQ=Math.round(avg);const dq=clamp((avg-orgBase())/25,-.5,.5);S.co.q=clamp(S.co.q+dq,10,100);if(orgCanRun()&&Math.abs(dq)>=.15)lines.push({c:dq>0?'g':'r',t:`조직 전력 ${orgGrade(avg)} (${Math.round(avg)}) — 보도 품질 ${dq>0?'+':''}${dq.toFixed(1)}`});}
  Q0.slice(0,2).forEach(x=>lines.push(x));}
{const _em35=endMonth;endMonth=function(){const r=_em35.apply(this,arguments);try{if(S&&S.phase==='game'){const L=[];orgMonth(L);if(L.length){L.forEach(x=>log(x.t));try{const fd=document.querySelector('#mb .feed');if(fd&&!$('#modal').hidden)fd.insertAdjacentHTML('beforeend',L.map(x=>`<li class="${x.c}">${esc(x.t)}</li>`).join(''));}catch(e){}}}}catch(e){console.error(e);}return r;};}
// 5) 조직 탭: 부서마다 부서장·차장·부서 전력
{const _tb35=tabBody;tabBody=function(){let h=_tb35.apply(this,arguments);try{if(S.tab==='org'){const per=roster();const D=orgDepts();const qs=D.map(d=>orgDeptQ(d,per)).filter(Boolean);
  const avg=qs.length?Math.round(qs.reduce((a,x)=>a+x.q,0)/qs.length):0;
  const rows=qs.map(q=>`<div class="org35r"><b>${DEPTS[q.d].n}</b><span class="org35g g${orgGrade(q.q)}">${orgGrade(q.q)}</span><span>${q.h?`${q.h.acting?'직무대리 ':'부장 '}${esc(q.h.name)} <small>${Math.round(q.h.skill)}</small>`:'<em>부서장 공석</em>'}${q.c?` · 차장 ${esc(q.c.name)} <small>${Math.round(q.c.skill)}</small>`:''}</span><small>${q.n}명 · 평균 ${q.avg}</small></div>`).join('');
  const box=`<div class="sec">조직 전력 ${orgGrade(avg)} · ${avg}</div><p class="hint" style="margin:0 0 6px">부서장의 실력·성적이 부서 기사 품질·단독·부서원 성장을 정하고, 조직 전체 전력이 매달 보도 품질을 올리거나 깎는다.${orgCanRun()?' 바꾸려면 「인사권 행사 → 부서장(팀장) 배치」.':''}</p><div class="org35">${rows}</div>`;
  h=h.replace('<div class="sec">부서장</div>',box+'<div class="sec">부서장</div>');}}catch(e){console.error(e);}return h;};}
(function(){const st=document.createElement('style');st.textContent=`.org35{display:grid;gap:6px;margin-bottom:10px}.org35r{display:grid;grid-template-columns:88px 30px minmax(0,1fr) auto;gap:8px;align-items:center;padding:7px 10px;border-radius:12px;background:rgba(12,16,28,.55);border:1px solid rgba(120,140,200,.18);font-size:13.5px}.org35r small{color:#8f99b6}.org35r em{color:#ff9488;font-style:normal}.org35g{display:grid;place-items:center;width:26px;height:26px;border-radius:8px;font-weight:700;background:#2a3150}.org35g.gS,.org35g.gA{background:#1f5a42;color:#7ee8b4}.org35g.gB{background:#3a3f5c}.org35g.gC{background:#5a4a1f;color:#ffd27a}.org35g.gD{background:#5a2626;color:#ff9488}@media(max-width:520px){.org35r{grid-template-columns:70px 26px minmax(0,1fr)}.org35r>small{grid-column:3}}`;document.head.appendChild(st);})();
// 부서장 배치 창: 한 줄씩 넓게, 선택지 그림 없이
{const _om35=openModal;openModal=function(t,b,c){const r=_om35.apply(this,arguments);try{if(/부서장\(팀장\) 배치|부서장 고르기/.test(String(t))){const bx=document.querySelector('#modal .mbx');if(bx){bx.classList.remove('p21grid');bx.classList.add('org35m');}document.querySelectorAll('#mc .p21ci').forEach(x=>x.remove());}}catch(e){}return r;};}
(function(){const st=document.createElement('style');st.textContent=`#modal .mbx.org35m #mc{display:flex!important;flex-direction:column;gap:8px}#modal .mbx.org35m #mc .ch{width:100%!important;min-height:0!important}#modal .mbx.org35m #mc .ch .cl{white-space:normal}`;document.head.appendChild(st);})();