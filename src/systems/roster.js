/* 바이라인 — src/systems/roster.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 사람 정보는 한 명단으로: 조직 탭·같은 부서·사내 관계가 같은 사람을 가리키게 =====
// 회사 명단(roster)의 내 부서에서 부서장=사내 관계의 '부장', 차장급 한 명=캡, 고참 기자 한 명=선배로 이름을 맞춘다
// 부서장은 한 함수로만 정한다 (조직 탭·사내 관계·같은 부서가 같은 사람을 본다). 내가 부장인 부서는 null → 나
function deptHead(per,d){if(!S.founder&&S.rank===3&&d===S.dept)return null;const L=(per||{})[d]||[];const T=S.team||[];const nt=m=>!T.includes(m);
  return L.find(m=>(m.r||0)>=2&&nt(m))||L.find(m=>m.desk&&nt(m))||L.find(m=>m.acting&&nt(m))||L.find(m=>m.r===1&&nt(m))||L.find(m=>(m.r||0)>=2)||null;}
function headLabel(per,d){if(!S.founder&&S.rank===3&&d===S.dept)return `${rankName()} ${esc(S.name)}(나)`;const h=deptHead(per,d);return h?`${rTitle(h)} ${esc(h.name)}`:'';}
// 내가(또는 회사가) 부서를 옮기면: 내 부서원은 새 부서 명단으로, 부서장 자리는 비지 않게, 사내 관계의 부장·캡·선배는 새 부서 사람으로
function rosterMove(per){if(S.founder||!per)return;const cur=S.dept,prev=S.rosDept;S.rosDept=cur;const T=S.team||[];
  const Ln=per[cur]=per[cur]||[];
  if(S.rank>=2&&S.rank<=3&&!isRegD(cur)){let added=0;T.forEach(m=>{if(Ln.includes(m))return;Object.keys(per).forEach(d=>{if(d!==cur)per[d]=per[d].filter(x=>x!==m);});m.d=cur;Ln.push(m);added++;});
    if(added){const names=new Set((S.cols||[]).map(c=>c.name));const spare=Ln.filter(m=>!T.includes(m)&&!(m.r>0)&&!m.acting&&!m.desk&&!names.has(m.name));spare.slice(0,Math.min(added,Math.max(0,Ln.length-T.length-3))).forEach(m=>{const i=Ln.indexOf(m);if(i>=0)Ln.splice(i,1);});}
    T.forEach(m=>{const cap=Math.max(0,S.rank-2);if((m.r||0)>cap||m.acting){m.r=Math.min(m.r||0,cap);m.acting=0;}});}
  if(prev==null||prev===cur)return;
  const Lo=per[prev];const hasHead=L=>L&&L.some(m=>(m.r||0)>=2||m.acting||m.desk);
  if(S.rank===3&&!isRegD(cur)){const h=Ln.find(m=>(m.r||0)>=2&&!T.includes(m));if(h){Ln.splice(Ln.indexOf(h),1);if(Lo&&!isRegD(prev)&&!hasHead(Lo)){h.d=prev;Lo.push(h);}else{h.r=1;h.acting=0;Ln.push(h);}}}
  if(Lo&&!isRegD(prev)&&Lo.length>=2&&!hasHead(Lo)){const c=Lo.filter(m=>m.r===1&&!T.includes(m)).sort((a,b)=>myrs(b)-myrs(a))[0]||Lo.filter(m=>!T.includes(m)).sort((a,b)=>myrs(b)-myrs(a))[0];if(c){if(Lo.length<=7){c.r=1;c.acting=1;}else{c.r=2;c.acting=0;}}}
  if(!isRegD(cur)&&S.rank<=2&&!hasHead(Ln.filter(m=>!T.includes(m)))){const c=Ln.filter(m=>!T.includes(m)).sort((a,b)=>myrs(b)-myrs(a))[0];if(c){if(Ln.length<=7){c.r=1;c.acting=1;}else{c.r=2;c.acting=0;}}}
  ['boss','cap','senior'].forEach(r=>{const c=colBy(r);if(c&&(r==='boss'?S.rank<=2:S.rank<=1))c.fresh=1;});}
function syncPeople(per){if(!S||S.founder||!S.cols||!per)return;const L=per[S.dept];if(!L||!L.length)return;
  // 전국부·지역 부서: 명단이 주재기자뿐이라 사내 관계의 부장·캡이 명단에 없었다 → 본사 데스크(부장·차장)를 명단 맨 앞에 둔다
  if(isRegD(S.dept)){const T=S.team||[];let d=L.find(m=>m.hq===1);if(!d){d=genMember(S.dept,50,70);d.r=2;d.hq=1;d.yrs=R(18,26);d.t0=S.turn;fitSk(d);L.unshift(d);}
    const b=colBy('boss');if(b&&S.rank<=2){d.name=b.name;b.ttl=rTitle(d);}else if(b)b.ttl=null;
    const cp=colBy('cap');if(cp&&S.rank<=1){let c2=L.find(m=>m.hq===2);if(!c2){c2=genMember(S.dept,45,62);c2.r=1;c2.hq=2;c2.yrs=R(10,16);c2.t0=S.turn;fitSk(c2);L.splice(1,0,c2);}c2.name=cp.name;c2.isCap=1;}
    const sn=colBy('senior');if(sn&&S.rank<=1){let c3=L.find(m=>m.hq===3)||L.find(m=>!m.hq&&!(m.r>=1)&&!T.includes(m)&&myrs(m)>=3);if(!c3){c3=genMember(S.dept,40,60);c3.r=0;c3.hq=3;c3.yrs=R(5,9);c3.t0=S.turn;fitSk(c3);L.push(c3);}c3.hq=c3.hq||3;c3.name=sn.name;}
    return;}
  const used=new Set();const setName=(m,c)=>{if(!m||!c)return;if(c.fresh){c.name=m.name;c.rel=R(0,15);c.yrs=null;c.t0=S.turn;delete c.fresh;}if(m.name!==c.name){const dup=Object.values(per).flat().find(x=>x!==m&&x.name===c.name);if(dup)dup.name=rname();m.name=c.name;}used.add(m);if(c.yrs==null&&m.yrs!=null){c.yrs=myrs(m);c.t0=S.turn;}};
  const head=deptHead(per,S.dept)||Object.values(per).flat().find(m=>m.desk);
  const b=colBy('boss');if(b&&head&&S.rank<=2){setName(head,b);b.ttl=rTitle(head);}
  if(b&&!(head&&S.rank<=2))b.ttl=null;const cp=colBy('cap');L.forEach(m=>{if(m.isCap)m.isCap=0;});if(cp&&S.rank<=1){const c=L.filter(m=>!used.has(m)&&m.r===1&&!m.acting)[0]||L.filter(m=>!used.has(m)&&!S.team.includes(m)).sort((x,y)=>myrs(y)-myrs(x))[0];if(c){setName(c,cp);c.isCap=1;
    // 캡은 차장급이다: 부서에 차장이 없으면 그 고참을 차장으로 (아주 작은 부서는 선임 기자가 캡을 겸한다)
    if(!(c.r>=1)&&L.length>=4){c.r=1;c.acting=0;if(myrs(c)<8){c.yrs=R(8,12);c.t0=S.turn;}}}}
  const sn=colBy('senior');if(sn&&S.rank<=1){let c=L.filter(m=>!used.has(m)&&!(m.r>=2)&&!m.desk&&!S.team.includes(m)).sort((x,y)=>myrs(y)-myrs(x))[0];if(!c||myrs(c)<3){c=genMember(S.dept,40,65);c.r=0;c.yrs=R(5,9);c.t0=S.turn;fitSk(c);L.push(c);}setName(c,sn);}}
// ===== 창간 모드: 편집국이 돌아간다 =====
// 대표 혼자 쓰는 게 아니다. 기자들이 매달 기사를 내고(품질·편집력에 따라 단독도), 대표는 아이템을 기자에게 맡길 수 있다
function fAsgMax(){return clamp(Math.floor(((S.co&&S.co.staff)||2)/3),1,4);}
function fReporters(){const T=(S.team||[]).filter(m=>m&&m.name);if(T.length)return T;S.fNames=S.fNames||Array.from({length:4},()=>({id:uid(),name:rname(),skill:R(40,58)}));return S.fNames;}
// 창간 모드 취재 지시: 쥔 아이템 최대 두 건을 한 기자에게 맡기거나, 새 기획 취재를 시킨다 (부국장·국장의 취재 지시와 같은 결)
RUN.fassign=function(){const L=S.items.slice().sort((a,b)=>(b.excl-a.excl)||(b.imp-a.imp)).slice(0,6);const free=fAsgMax()-(S.fAsg||[]).length;const mx=Math.min(2,free);
  const sel=()=>[...document.querySelectorAll('#mb input[data-ai]:checked')].map(x=>L[+x.dataset.ai]).filter(Boolean);
  openModal('취재 지시',`<p>쥔 아이템을 편집국 기자에게 맡기거나, 새 기획 취재를 시킨다. 확인된 사실이 많을수록, 기자 실력·대표 편집력(${Math.round(fs('edit'))})이 높을수록 좋은 기사가 된다. 핵심 사실이 확인 안 된 채 넘기면 오보 위험이 있다.</p><p class="hint">지금 맡길 수 있는 건 ${free}건 (기자 3명당 1건)</p>${L.length?`<p class="pcount" id="gsel"></p>${L.map((it,i)=>{const cf=it.facts.filter(fOK).length;const key=it.facts.some(f=>f.key&&fOK(f));return `<label class="chk"><input type="checkbox" data-ai="${i}"><span><b>${esc(it.title)}</b><small>확인 ${cf}/${it.facts.length}${it.excl?' · 단독':''}${key?' · 핵심 확인':' · 핵심 미확인(위험)'} · 파급 ${it.imp}</small></span></label>`;}).join('')}`:'<p class="hint">지금 쥐고 있는 아이템이 없다. 새 기획 취재는 시킬 수 있다.</p>'}`,
   [...(L.length?[{label:'고른 아이템을 맡긴다',sub:`최대 ${mx}건 · 같은 기자에게`,fn:()=>{const X=sel();if(!X.length){toast('맡길 아이템을 골라 주세요');return false;}fAsgWho(X.slice(0,mx),false);return false;}}]:[]),
    {label:'새 기획 취재를 시킨다',sub:'기자가 직접 아이템을 찾아 확인까지 해 온다 · 시간이 더 걸린다',fn:()=>{fAsgWho([],true);return false;}},{label:'취소',cls:'ghost'}]);
  if(L.length){const up=()=>{const c=[...document.querySelectorAll('#mb input[data-ai]')];const n=c.filter(x=>x.checked).length;const el=document.getElementById('gsel');if(el)el.textContent=n?`선택 ${n}건 / 최대 ${mx}건`:`맡길 아이템을 고르자 (최대 ${mx}건)`;c.forEach(x=>{x.disabled=!x.checked&&n>=mx;});};document.querySelectorAll('#mb input[data-ai]').forEach(x=>x.onchange=up);up();}};
function fAsgWho(its,plan){const R0=fReporters().slice().sort((a,b)=>(b.skill||0)-(a.skill||0)).slice(0,5);
  openModal('누구에게 맡길까',`<p class="lede">${plan?'새 기획 취재':its.map(x=>`「${esc(x.title)}」`).join(' · ')}</p><p class="hint">실력이 좋을수록 잘 살린다. 지시받은 기자는 실력이 늘고, 잘 터지면 매체 신뢰와 대표 평판이 함께 오른다.</p>`,[...R0.map(m=>({label:`${m.name} 기자`,sub:`실력 ${Math.round(m.skill||45)}${(S.fAsg||[]).some(a=>a.who===m.name)?' · 이미 취재 중':''}`,disabled:(S.fAsg||[]).some(a=>a.who===m.name),fn:()=>{spend(1,2);
    const ITS=plan?[makeItem(S.dept,{excl:chance(.3),mult:1.05})]:its;S.fAsg=S.fAsg||[];
    ITS.forEach((it,k)=>{S.items=S.items.filter(x=>x!==it);S.fAsg.push({it,who:m.name,sk:(m.skill||45)-(k?4:0)-(plan?4:0),due:S.turn+(plan?R(4,8):R(2,5))+(k?R(1,3):0),plan:!!plan});});
    m.skill=clamp((m.skill||45)+.4,0,95);fgain('lead',.15);const tt=ITS.map(x=>`「${x.title}」`).join(' · ');
    toast(`${m.name}: "${pick(['알겠습니다, 바로 붙겠습니다.','네, 이번 달 안에 결과 가져오겠습니다.','방향 잡아 주셔서 감사합니다.'])}"`);log(`취재 지시: ${tt} → ${m.name} 기자`);}})),{label:'← 다시 고르기',cls:'ghost',fn:()=>{RUN.fassign();return false;}}]);}
function fStaffClip(title,q,imp,excl,who,it){const o=OUT();q=clamp(Math.round(q),10,95);imp=clamp(Math.round(imp),5,90);const pl=placeOf(q,imp,it||{d:S.dept});const views=Math.round(q*imp*(o.p+1)*R(6,10)/10);
  const clip={h:(excl?'[단독] ':'')+title,o:o.n,d:(it&&it.d)||cat1(S.dept),q,imp,excl:!!excl,date:dateShort(),turn:S.turn,views,lead:title+'.',by:who+' 기자',staff:1,place:pl.n,portal:portalRank(imp,q,!!excl,it?gradeOf(it):'',1,OUT().p),base:it&&it.base};
  S.clips.unshift(clip);if(S.clips.length>60)S.clips.pop();const c=S.co,k=clamp(imp/50,.4,1.8)*(q/60);c.bS+=(.002+(excl?.005:0))*k;c.bT+=(.004+(excl?.01:0))*k;if(excl){S.fNewsX=(S.fNewsX||0)+1;apply({fame:imp/110});}return clip;}
function fNewsroom(lines){const c=S.co,o=OUT();const rep=Math.max(0,c.staff-1);if(!rep)return;
  // 맡긴 취재 결과
  const due=(S.fAsg||[]).filter(a=>a.due<=S.turn);S.fAsg=(S.fAsg||[]).filter(a=>a.due>S.turn);
  due.forEach(a=>{const it=a.it;let cf=it.facts.filter(fOK).length/Math.max(1,it.facts.length);let key=it.facts.some(f=>f.key&&fOK(f));
    // 기획 취재는 기자가 직접 확인까지 해 온다: 실력이 좋을수록 많이, 핵심까지
    if(a.plan){cf=clamp(.35+(a.sk-45)/80+R(-10,10)/100,.2,.85);key=chance(clamp(.55+(a.sk-45)/100,.4,.85));}
    if(it.hoax&&!key){lines.push({c:'',t:`${a.who} 기자: "「${it.title}」${jp(it.title,'은','는')} 아무리 파도 근거가 없습니다. 접겠습니다." (허위 제보였다)`});return;}
    if(it.dud&&chance(.6)){lines.push({c:'',t:`${a.who} 기자가 「${it.title}」${jp(it.title,'을','를')} 파 봤지만 기사가 되지 않았다`});return;}
    const q=18+a.sk*.4+cf*26+(key?5:-8)+fs('edit')/8+R(-8,8);const cl=fStaffClip(it.title,q,it.imp,it.excl,a.who,it);
    if(!key&&chance(.3*(DF().risk||1)))S.pending.push({type:'err',title:cl.h,due:S.turn+R(2,8)});
    const g=fReporters().find(m=>m.name===a.who);if(g)g.skill=clamp((g.skill||45)+(cl.q>=70?1.2:.6),0,95);fgain('edit',.3);S.subDone=(S.subDone||0)+1;if(cl.q>=70)apply({fame:.4});
    lines.push({c:it.excl?'g':'',t:`${a.who} 기자 출고 — 「${cl.h}」 (${cl.place} · 완성도 ${cl.q})`});});
  // 평소 기사: 기자 한 명이 한 달에 몇 건씩. 단독은 품질·편집력·기자 실력에 달렸다
  const R1=fReporters();const avgSk=R1.reduce((x,m)=>x+(m.skill||45),0)/Math.max(1,R1.length);
  const n=Math.round(rep*(4+c.q/18)*R(85,115)/100);const exP=clamp(.022+(c.q-50)/650+(fs('edit')-40)/1500+(avgSk-50)/1300,.005,.08)*(S.turn-(S.fExT??-99)<12?.4:1);let ex=0;for(let i=0;i<rep;i++)if(chance(exP))ex++;if(ex)S.fExT=S.turn;
  c.bS+=n*.00004;c.bT+=n*.00008;let first='';
  if(ex){const who=pick(R1).name;const it=makeItem(pick(OUT().depts||[S.dept]),{excl:true});const cl=fStaffClip(it.title,c.q+R(-8,10),it.imp,true,who,it);first=` · 「${cl.h}」(${who} 기자)`;S.fNewsX+=Math.max(0,ex-1);}
  let err='';if(c.q<46&&chance((46-c.q)/50)){apply({trust:-.8});c.q=clamp(c.q-1,10,100);err=' · 정정보도 1건 (품질이 낮다)';}
  // 돈은 쌓이는데 편집국이 작으면 공동창업자가 채용을 권한다
  const yrC=c.staff*.066*12;const want=6+o.p*3;if(c.staff<want&&c.cash>yrC*1.2+3&&S.turn-(S.fHireAskT??-99)>=24){S.fHireAskT=S.turn;const cf=colBy('cofound');const nm=cf?cf.name:'편집장';
    (window.__wq=window.__wq||[]).push(()=>openModal('편집국이 너무 작다',`<p class="lede">${esc(nm)}: "통장에 돈은 쌓이는데 기자가 ${c.staff}명뿐이야. 이대로면 기사가 안 나와. 사람 좀 뽑자."</p><p class="hint">기자가 늘면 편집국 기사·단독이 늘고 맡길 수 있는 취재도 늘어난다. 인건비는 1명당 월 약 ${eok(.066*(S.payLv||1))}.</p>`,[
      {label:'경력 기자 2명 영입',sub:`자금 -${eok(.4)}(영입비) · 기자 +2 · 품질↑`,fn:()=>{c.cash-=.4;c.staff+=2;for(let i=0;i<2;i++){const m=genMember(S.dept,48,66);m.yrs=R(4,10);(S.team=S.team||[]).push(m);}c.q=clamp(c.q+1.5,10,100);toast('경력 기자 2명이 합류했다');log('경력 기자 2명 영입');}},
      {label:'수습 공채 3명',sub:'싸다 · 기자 +3 · 한동안 품질 조금↓',fn:()=>{c.staff+=3;for(let i=0;i<3;i++){const m=genMember(S.dept,28,42);m.yrs=0;(S.team=S.team||[]).push(m);}c.q=clamp(c.q-1,10,100);toast('수습기자 3명을 뽑았다');log('수습 공채 3명');}},
      {label:'아직은 버틴다',cls:'ghost',fn:()=>{if(cf)relUp(cf,-2,'채용 미룸');}}]));}
  S.fNewsN=n;lines.push({c:ex?'g':'',t:`편집국 기사 ${n}건 출고${ex?` · 단독 ${ex}건${first}`:''}${err}`});}
// ===== 모바일: 한 화면에 하나씩 (할 일 · 현황 · 나 · 취재 · 사람 · 회사) =====
const MNAV_IC={act:ic('clip'),dash:ic('chart'),me:ic('user'),work:ic('mic'),people:ic('users'),company:ic('bld')};
// 6.1 하단 메뉴 순서: 오른손 엄지가 닿기 쉬운 가운데에 할 일을 두고, 순서는 기기마다 바꿀 수 있다
const NAV_DEF=['company','me','act','work','dash','people'],NAV_NM={act:'할 일',dash:'현황',me:'나',work:'취재',people:'사람',company:'회사'};
function navOrder(){try{const a=JSON.parse(localStorage.getItem('byline-nav')||'null');if(Array.isArray(a)&&a.length===NAV_DEF.length&&NAV_DEF.every(k=>a.includes(k)))return a;}catch(e){}return NAV_DEF.slice();}
function navSave(a){try{localStorage.setItem('byline-nav',JSON.stringify(a));}catch(e){}window.__navO=a;}
function navOrderMenu(sel){const o=window.__navO||navOrder();
  const bar=`<div class="nvo">${o.map((k,i)=>`<button type="button" data-nk="${k}" aria-pressed="${sel===k}"><i aria-hidden="true">${MNAV_IC[k]||'•'}</i><span>${NAV_NM[k]}</span></button>`).join('')}</div>`;
  openModal('하단 메뉴 순서 설정',`<p class="hint">모바일 하단 메뉴의 순서를 바꾼다. 바꿀 두 칸을 차례로 누르면 자리가 바뀐다.</p>${bar}<p class="hint">${sel?`「${NAV_NM[sel]}」을(를) 골랐다. 바꿀 자리를 누르세요.`:'이 기기에만 저장된다.'}</p>`,[
    {label:'오른손 배치 (기본)',sub:'회사 · 나 · 할 일 · 취재 · 현황 · 사람',fn:()=>{navSave(NAV_DEF.slice());render();navOrderMenu();return false;}},
    {label:'왼손 배치',sub:'오른손 배치를 좌우로 뒤집는다',fn:()=>{navSave(NAV_DEF.slice().reverse());render();navOrderMenu();return false;}},
    {label:'예전 배치',sub:'할 일 · 현황 · 나 · 취재 · 사람 · 회사',fn:()=>{navSave(['act','dash','me','work','people','company']);render();navOrderMenu();return false;}},
    {label:'닫기',cls:'ghost'}]);
  document.querySelectorAll('.nvo [data-nk]').forEach(b=>b.onclick=()=>{const k=b.dataset.nk;if(!sel)return navOrderMenu(k);if(sel===k)return navOrderMenu();const a=o.slice(),i=a.indexOf(sel),j=a.indexOf(k);[a[i],a[j]]=[a[j],a[i]];navSave(a);render();navOrderMenu();});}
function mobileNav(){let nav=$('#mnav');const on=!!(S&&S.phase==='game');document.body.classList.toggle('mvon',on);
  if(!on){if(nav)nav.remove();['mv-act','mv-dash','mv-tab'].forEach(c=>document.body.classList.remove(c));return;}
  if(window.__mvTurn!==S.turn){window.__mvTurn=S.turn;window.__MV='act';}
  const tg=window.__TG||[];const curG=((tg.find(x=>x[2].some(t=>t[0]===S.tab))||tg[0]||[''])[0]);const mv=window.__MV||'act';
  ['mv-act','mv-dash','mv-tab'].forEach(c=>document.body.classList.toggle(c,c==='mv-'+mv));
  if(!nav){nav=document.createElement('nav');nav.id='mnav';nav.setAttribute('aria-label','화면 전환');document.body.appendChild(nav);}
  const NO=window.__navO||(window.__navO=navOrder());const items=[['act','할 일',S.ap>0?S.ap:''],['dash','현황',''],...tg.map(g=>['tab:'+g[0],g[1],''])].sort((a,b)=>{const ia=NO.indexOf(a[0].split(':')[1]||a[0]),ib=NO.indexOf(b[0].split(':')[1]||b[0]);return (ia<0?99:ia)-(ib<0?99:ib);});
  nav.innerHTML=items.map(([k,n,b])=>{const key=k.split(':')[1]||k;const sel=k==='act'?mv==='act':k==='dash'?mv==='dash':(mv==='tab'&&key===curG);return `<button data-mv="${k}" aria-pressed="${sel}"><i aria-hidden="true">${MNAV_IC[key]||'•'}</i><span>${n}</span>${b!==''?`<em>${b}</em>`:''}</button>`;}).join('');
  nav.querySelectorAll('[data-mv]').forEach(b=>b.onclick=()=>{const k=b.dataset.mv;if(k.startsWith('tab:')){window.__MV='tab';const g=tg.find(x=>x[0]===k.slice(4));if(g){const last=S.tabLast&&S.tabLast[g[0]];S.tab=g[2].some(t=>t[0]===last)?last:g[2][0][0];}}else window.__MV=k;render();try{window.scrollTo({top:0,behavior:'instant'});}catch(e){window.scrollTo(0,0);}});}