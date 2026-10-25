/* 바이라인 — src/compat/v16.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.31 취재 지시 재편 · 편집국장 기획 하명 =====
// 취재 지시: 차장(한 달 1건 · B등급 이하) · 부장·부국장·국장(한 달 2건). 나보다 직급이 낮거나 연차가 적은 기자에게만
function asgLim(){if(S.founder)return 99;return S.rank===2?1:S.rank>=3&&S.rank<=5?2:0;}
function asgKey(){return Math.floor(S.turn/4);}
function asgUsed(){const a=S.asgM;return a&&a.k===asgKey()?a.n:0;}
function asgUse(n){const k=asgKey();if(!S.asgM||S.asgM.k!==k)S.asgM={k,n:0};S.asgM.n+=n;}
function asgLeft(){return Math.max(0,asgLim()-asgUsed());}
function asgGradeOK(it){return S.rank!==2||['B','C'].includes(gradeOf(it));}
// 지시할 수 있는 사람: 직급이 나보다 낮거나(차장=1·부장=2·부국장=3), 직급이 같아도 연차가 적은 사람
function asgCan(m){const mine=S.rank-1;const r=m.r||0;if(r<mine)return true;if(r===mine&&myrs(m)<years())return true;return false;}
function asgWhyNot(m){return (m.r||0)>S.rank-1?'직급이 위다':'연차가 같거나 많다';}
// 지시받은 기자의 성향(AI): 사실 확인형은 꼼꼼하지만 느리고, 속보형은 빠르지만 덜 다듬고, 특종형은 단독을 키운다
function asgAI(m,h){const p=(m.ai&&m.ai.y)||'fact';const rel=m.rel??20;
  if(p==='fact'){h.sk+=5;h.due+=1;}else if(p==='buzz'){h.sk-=2;h.due=Math.max(S.turn+2,h.due-2);}else if(p==='scoop'){h.sk+=2;if(!h.excl&&chance(.18))h.excl=true;}else if(p==='net'){h.sk+=1;}else if(p==='sales'){h.sk-=1;}
  // 관계가 나쁘면 시큰둥하게 받는다 · 관계가 좋으면 더 붙는다
  h.sk+=clamp((rel-20)/8,-4,5);
  return p;}
const ASG_SAY={fact:'"확인 다 하고 올리겠습니다. 며칠 더 주세요."',buzz:'"오늘 안에 초고 띄우겠습니다!"',scoop:'"이거 더 파면 단독 나오겠는데요."',net:'"아는 사람 통해서 먼저 알아보겠습니다."',sales:'"광고 쪽이랑 겹치는 건 없죠?"'};
function runAssign2(){if(S.founder)return runAssign();const lim=asgLim(),left=asgLeft();if(!left){toast(`이번 달 취재 지시 ${lim}건을 다 썼다`);return;}
  const P0=assignPool();const P=P0.filter(asgCan);if(!P.length){toast(P0.length?'지시할 수 있는 후배가 없다 · 선배·고참에겐 지시할 수 없다':'맡길 기자가 없다');return;}
  const L=S.items.slice();const ch=S.rank===2;
  const sel=()=>[...document.querySelectorAll('#mb input[data-ai]:checked')].map(x=>L[+x.dataset.ai]).filter(Boolean);
  const who=(its,plan)=>openModal('누구에게 맡길까',`<p class="lede">${plan?'새 기획 취재':its.map(x=>`「${esc(x.title)}」`).join(' · ')}</p><p class="hint">나보다 직급이 낮거나 연차가 적은 기자에게만 지시할 수 있다. 기자마다 일하는 방식이 다르다.</p>`,
    P.map(m=>{const p=(m.ai&&m.ai.y)||'fact';return {label:`${m.name} ${MR[Math.min(3,m.r||0)]}`,sub:`실력 ${Math.round(m.skill||45)} · ${yrsTxt(m)} · 관계 ${Math.round(m.rel??20)}${{fact:' · 꼼꼼·느림',buzz:' · 빠름',scoop:' · 단독 욕심',net:' · 발이 넓다',sales:' · 영업 성향'}[p]||''}${(S.handoffs||[]).some(h=>h.who===m.name)?' · 이미 맡은 일이 있다':''}`,fn:()=>{spend(1,2);setCd('assign');
      let ITS=its;if(plan){let it=null;for(let g=0;g<12;g++){it=makeItem(S.dept,{excl:!ch&&chance(.35),mult:1.05});if(asgGradeOK(it))break;}if(ch&&!asgGradeOK(it)){it.imp=Math.min(it.imp,46);it.excl=false;}ITS=[it];}
      S.handoffs=S.handoffs||[];let pf='fact';
      ITS.forEach((it,k)=>{S.items=S.items.filter(x=>x!==it);const h={who:m.name,kind:'부서원',ref:m.id,col:false,title:it.title,imp:it.imp,excl:it.excl,sk:(m.skill||45)+(it.facts.filter(fOK).length*5)+8-(k?4:0)-(plan?6:0),due:S.turn+R(4,10)+(k?R(2,5):0),rival:false,sub:true,mode:'order'};pf=asgAI(m,h);S.handoffs.push(h);});
      asgUse(ITS.length);if(ITS.length>1){S.mAct=S.mAct||{};S.mAct.assign=(S.mAct.assign||0)+ITS.length-1;try{misCheck();}catch(e){}}m.skill=clamp((m.skill||45)+.6,0,95);S.flags.plan=(S.flags.plan||0)+1;
      // 같은 사람에게 몰아 주면 불만, 고르게 맡기면 부서 분위기가 산다
      const busy=(S.handoffs||[]).filter(h=>h.who===m.name&&h.due>S.turn).length;if(busy>=3){mRel(m,-3,'일 몰아주기');}else if((m.rel??20)<40)mRel(m,1.5,'취재 지시');
      log(`취재 지시: ${ITS.map(x=>`「${x.title}」`).join(' · ')} → ${m.name}`);toast(`${m.name}: ${ASG_SAY[pf]||'"알겠습니다."'} · 이번 달 남은 지시 ${asgLeft()}건`);}};}).concat([{label:'← 뒤로',cls:'ghost',fn:()=>{runAssign2();return false;}}]));
  const max=Math.min(2,left);
  openModal('취재 지시',`<p>쥐고 있는 아이템을 후배에게 맡기거나 새 기획 취재를 시킨다. 이번 달 남은 지시 <b>${left}/${lim}건</b>${ch?' · 차장은 B등급 이하 아이템만':''}.</p><p class="hint">나보다 직급이 낮거나 연차가 적은 기자에게만 지시할 수 있다.${P0.length>P.length?` (선배·고참 ${P0.length-P.length}명은 제외)`:''}</p>${L.length?`<p class="pcount" id="gsel"></p>${L.map((it,i)=>{const g=gradeOf(it),ok=asgGradeOK(it);return `<label class="chk${ok?'':' off'}"><input type="checkbox" data-ai="${i}"${ok?'':' disabled data-lock="1"'}><span><b>${esc(it.title)}</b><small>${g}등급 · 확인 ${it.facts.filter(fOK).length}/${it.facts.length}${it.excl?' · 단독':''} · 파급력 ${it.imp}${ok?'':' · 차장은 맡길 수 없다'}</small></span></label>`;}).join('')}`:'<p class="hint">지금 쥐고 있는 아이템이 없다.</p>'}`,
   [...(L.some(asgGradeOK)?[{label:'고른 아이템을 맡긴다',sub:`최대 ${max}건 · 같은 기자에게`,fn:()=>{const X=sel();if(!X.length){toast('맡길 아이템을 골라 주세요');return false;}who(X.slice(0,max),false);return false;}}]:[]),
    {label:'새 기획 취재를 시킨다',sub:ch?'부서 출입처에서 B등급 이하 아이템을 찾아 취재하게 한다':'부서 출입처에서 아이템을 찾아 취재하게 한다',fn:()=>{who([],true);return false;}},{label:'취소',cls:'ghost'}]);
  if(L.length){const up=()=>{const c=[...document.querySelectorAll('#mb input[data-ai]')];const n=c.filter(x=>x.checked).length;const el=document.getElementById('gsel');if(el)el.textContent=n?`선택 ${n}건 / 최대 ${max}건`:`맡길 아이템을 고르자 (최대 ${max}건)`;c.forEach(x=>{if(x.dataset.lock)return;x.disabled=!x.checked&&n>=max;});};document.querySelectorAll('#mb input[data-ai]').forEach(x=>x.onchange=up);up();}}

// ---- 편집국장 기획 하명: 부장에게 기획을 내려보낸다 ----
const HM_K={
 inv:{n:'탐사 기획',d:'부서가 몇 주 동안 한 주제를 판다',w:[6,8],sub:'파급력 큼 · 확인이 덜 되면 오보 위험',pref:['inv','fact','scoop']},
 agenda:{n:'어젠다 연계 기획',d:'연중 어젠다 캠페인에 부서 기획을 붙인다',w:[4,5],sub:'어젠다 진척↑ · 신뢰↑',pref:['fact','people'],c:()=>S.agenda&&!S.agenda.done},
 rush:{n:'이슈 총력 대응',d:'오늘 터진 이슈에 지면을 몰아준다',w:[2,2],sub:'트래픽↑ · 빠르지만 얕다',pref:['speed','scoop']},
 friendly:{n:'대주주·광고주 우호 기획',d:'회사에 도움이 되는 기획을 내려보낸다',w:[4,4],sub:'대주주 관계·광고↑ · 기자들 반발 · 신뢰↓',pref:['sales','people']}};
function hmHead(d){let L=[];try{L=(roster()[d]||[]).slice();}catch(e){}const h=L.filter(m=>m&&m.name!==S.name).sort((a,b)=>((b.r||0)-(a.r||0))||(myrs(b)-myrs(a)))[0];return h||null;}
function hmDepts(){const o=OUT();return o.depts.filter(d=>DEPTS[d]&&!(typeof SUPPORT!=='undefined'&&SUPPORT[d])&&!(S.hm||[]).some(h=>h.d===d));}
function hmSkill(d){let L=[];try{L=(roster()[d]||[]).filter(m=>m&&m.name!==S.name);}catch(e){}return L.length?avg(L.map(m=>m.skill||45)):45;}
RUN.hamyeong=function(){const D=hmDepts();if(!D.length){toast('부서마다 이미 하명이 내려가 있다');return;}
  openModal('기획 하명 · 어느 부서에',`<p>부장에게 기획을 내려보낸다. 부서 실력과 부장과의 관계가 결과를 가른다. 부장의 성향에 맞는 기획이면 더 잘 받는다.</p><p class="hint">동시에 두 부서까지.</p>`,D.slice(0,10).map(d=>{const h=hmHead(d);const p=h?npcPref(h,d):'fact';return {label:DEPTS[d].n,sub:`${h?`${h.name} ${MR[Math.min(3,h.r||0)]} · 관계 ${Math.round(h.rel??20)} · `:''}부서 실력 ${Math.round(hmSkill(d))} · ${{inv:'탐사형',fact:'원칙형',scoop:'특종형',speed:'속보형',sales:'영업형',people:'사람형'}[p]||'원칙형'} 부장`,fn:()=>{hmKind(d);return false;}};}).concat([{label:'취소',cls:'ghost'}]));};
function hmKind(d){const h=hmHead(d);const p=h?npcPref(h,d):'fact';
  openModal(`기획 하명 · ${DEPTS[d].n}`,`<p class="lede">${h?esc(h.name)+' 부장에게 ':''}무엇을 내려보낼까.</p>`,Object.keys(HM_K).filter(k=>!HM_K[k].c||HM_K[k].c()).map(k=>{const K=HM_K[k];const fit=K.pref.includes(p);return {label:K.n,tag:fit?'부장 성향과 맞음':'',sub:`${K.d} · ${K.w[0]===K.w[1]?K.w[0]:K.w[0]+'~'+K.w[1]}주 · ${K.sub}`,fn:()=>{hmGo(d,k,h,fit);}};}).concat([{label:'← 뒤로',cls:'ghost',fn:()=>{RUN.hamyeong();return false;}}]));}
function hmGo(d,k,h,fit){const K=HM_K[k];spend(1,4);setCd('hamyeong');const it=makeItem(d,{excl:k==='inv'&&chance(.6),mult:k==='inv'?1.35:k==='rush'?.9:1.05,noPos:k!=='friendly'});
  const rel=h?(h.rel??20):20;const x={d,k,title:it.title,imp:it.imp,excl:!!it.excl,head:h?h.name:'',hid:h?h.id:null,fit:!!fit,rel,sk:hmSkill(d),t0:S.turn,due:S.turn+R(K.w[0],K.w[1])};
  S.hm=(S.hm||[]).concat([x]);S.hmN=(S.hmN||0)+1;
  let say='"알겠습니다. 부서 회의 바로 소집하겠습니다."';
  if(k==='friendly'){if(h&&npcPref(h,d)!=='sales'&&rel<45){say='"…국장님, 이건 기자들한테 뭐라고 설명합니까."';if(h)mRel(h,-6,'우호 기획 하명');S.wMood=clamp((S.wMood??60)-3,0,100);}else say='"회사 사정 압니다. 티 안 나게 만들어 보겠습니다."';}
  else if(fit){say={inv:'"제가 기다리던 겁니다. 제대로 파 보겠습니다."',agenda:'"캠페인이랑 묶으면 힘이 붙겠네요."',rush:'"지면 다 털어서 붙겠습니다."'}[k]||say;if(h)mRel(h,2,'성향에 맞는 하명');}
  else if(h&&rel<10){say='"…알겠습니다." 부장 표정이 썩 밝지 않다.';}
  log(`기획 하명: ${DEPTS[d].n} 「${it.title}」 (${K.n})`);
  openModal('하명이 내려갔다',`<p class="lede">${DEPTS[d].n} · 「${esc(it.title)}」</p><p>${h?esc(h.name)+' 부장: ':''}${say}</p><p class="hint">${wkTxt(x.due-S.turn)} 뒤 지면에 나온다. 그사이 부장과 관계를 다지면 결과가 좋아진다.</p>`);}
// 월말: 기한이 된 하명은 기사로 나온다
function hmMonth(lines){if(!S.hm||!S.hm.length||S.rank!==6||S.founder){if(S.hm&&S.hm.length&&S.rank!==6){S.hm=[];}return;}
  const due=S.hm.filter(x=>x.due<=S.turn);S.hm=S.hm.filter(x=>x.due>S.turn);
  due.forEach(x=>{const K=HM_K[x.k];let h=null;try{h=(roster()[x.d]||[]).find(m=>m.id===x.hid);}catch(e){}const rel=h?(h.rel??20):x.rel;
    let q=Math.round(30+x.sk*.42+rel*.12+(S.co.q-50)*.2+(x.fit?7:0)+(S.st.lead||30)*.08+R(-9,9));if(x.k==='rush')q-=4;q=clamp(q,20,94);
    const o=OUT();const pl=placeOf(q,x.imp,{d:x.d});const views=Math.round(q*x.imp*(o.p+1)*R(6,10)/10)*(x.k==='rush'?1.6:1);
    const c={h:(x.excl&&q>=60?'[단독] ':'')+`[기획] ${x.title}`,o:o.n,d:x.d,q,imp:x.imp,excl:!!(x.excl&&q>=60),date:dateShort(),turn:S.turn,views:Math.round(views),lead:`${x.title}.`,by:`${DEPTS[x.d].n} 기획취재팀`,staff:1,desk:S.name,place:pl.n,portal:portalRank(x.imp,q,!!x.excl,gradeOf({imp:x.imp,excl:x.excl}),1,o.p),hm:x.k};
    S.clips.unshift(c);if(S.clips.length>60)S.clips.pop();
    const good=q>=62,bad=q<42;let fx={};
    if(x.k==='inv'){fx=good?{eval:1.6,fame:1.4,trust:.8}:bad?{eval:-1,trust:-.6}:{eval:.6,fame:.4};if(good){S.co.q=Math.min(100,S.co.q+1.2);}if(bad&&chance(.35*DF().risk))S.pending.push({type:'err',title:`${DEPTS[x.d].n} 기획 「${x.title}」`,due:S.turn+R(1,3),desk:1});}
    else if(x.k==='agenda'){fx=good?{trust:1,eval:1}:{eval:.4};if(S.agenda&&!S.agenda.done)S.agenda.p=Math.min(100,S.agenda.p+(good?18:bad?5:11));}
    else if(x.k==='rush'){fx=good?{eval:.8,fame:.3}:{eval:.3};S.co.bT+=good?.012:.006;}
    else if(x.k==='friendly'){fx={trust:-1.2,eval:.5};try{ownRel(good?6:3);}catch(e){}S.co.adB+=.03;S.wMood=clamp((S.wMood??60)-2,0,100);if(chance(.25+(h&&npcPref(h,x.d)!=='sales'?.15:0))){S.wMood=clamp((S.wMood??60)-4,0,100);lines.push({c:'r',t:`${DEPTS[x.d].n} 기자들이 "하명 기사" 비판 성명을 냈다 — 편집국 분위기↓`});}}
    if(h){mRel(h,good?4:bad?-3:1,good?'하명 기획 성공':bad?'하명 기획 부진':'하명 기획');skBump?skBump(h,good?.8:.3):0;}
    const t=apply(fx);lines.push({c:good?'g':bad?'r':'',t:`기획 하명 결과 — ${DEPTS[x.d].n} 「${x.title}」 ${pl.n} · 완성도 ${q}${t?' · '+t:''}`});
    S.hmDone=(S.hmDone||0)+1;});}
// 직속 상사 호칭
function bossT(){if(!S||S.founder)return '투자사';const r=S.rank;const tv=typeof isTV==='function'&&isTV();const sm=S.outlet&&OUT().p<=2;if(r<=2)return sm?'팀장':'부장';if(r===3)return sm?'편집국장':'부국장';if(r===4)return '국장';if(r===5)return tv?'보도국장':'편집국장';if(r===6)return sm?'대표':'사장';return '이사회';}
// ---- 등록 ----
try{ACT.hamyeong={n:'기획 하명',ap:1,sc:'office',cd:6,d:'부장에게 기획을 내려보낸다. 부서 실력·부장과의 관계·부장 성향이 결과를 가른다'};
  if(!RANK_ACTS[6].includes('hamyeong'))RANK_ACTS[6].splice(Math.max(0,RANK_ACTS[6].indexOf('meeting')+1),0,'hamyeong');
  [2,3].forEach(r=>{if(!RANK_ACTS[r].includes('assign'))RANK_ACTS[r].splice(Math.max(0,RANK_ACTS[r].indexOf('handoff')+1),0,'assign');});
  ACT.assign.d='후배 기자에게 아이템을 맡기거나 새 기획 취재를 시킨다. 차장 한 달 1건(B등급 이하) · 부장 이상 2건';ACT.assign.cd=0;
  ACT_IC.hamyeong='flag';ACT_STAT.hamyeong='lead';ACT_STAT.assign=ACT_STAT.assign||'lead';
  TIPS.hamyeong='부장 성향(탐사형·속보형·영업형 등)과 맞는 기획이면 더 잘 받는다. 우호 기획은 대주주 관계와 광고를 올리지만 기자들이 반발한다.';
  TIPS.assign='나보다 직급이 낮거나 연차가 적은 기자에게만 지시할 수 있다. 차장은 한 달 1건·B등급 이하, 부장·부국장·국장은 한 달 2건. 기자 성향에 따라 빠르거나 꼼꼼하다.';
  RUN.assign=runAssign2;}catch(e){console.error(e);}
{const _why=why;why=function(id){const w=_why(id);if(w)return w;if(id==='assign'&&!S.founder){if(asgLim()&&!asgLeft())return `이번 달 취재 지시 ${asgLim()}건을 다 썼다`;}if(id==='hamyeong'){if((S.hm||[]).length>=2)return '하명 두 건이 진행 중';}return '';};}
function v16Month(lines){try{asgPropose();}catch(e){console.error(e);}try{hmMonth(lines);}catch(e){console.error(e);}try{circMonth(lines);}catch(e){console.error(e);}try{supMonth(lines);}catch(e){console.error(e);}try{opMonth(lines);}catch(e){console.error(e);}try{delMonth(lines);}catch(e){console.error(e);}try{hmMeMonth(lines);}catch(e){console.error(e);}}
// ===== 1.31 판매국 · 종이신문 부수 =====
// 원칙: 기본 정책(판촉 보통·구독료 동결·지국 지원 보통·디지털 전환 0단계)은 지금까지와 똑같다. 정책을 바꾸면 얻는 것과 잃는 것이 함께 온다
const CIRC_TY=['daily','econ','sports','local','eng','trade','weekly'];
function circOn(){return !!(S&&S.phase==='game'&&!S.founder&&!S.story&&S.outlet&&S.co&&CIRC_TY.includes(OUT().type));}
function circS(){if(!circOn())return null;const c=S.co;if(!c.circ||c.circ.oid!==S.outlet){const o=OUT();c.circ={oid:S.outlet,free:.16,jg:62,pol:{promo:0,price:0,jg:1,dig:0},auto:true,abcY:-1,abc:null,abcK:1,y0:c.subs,paper:0,hit:0,boy:0,ev:{},log:[],sub0:o.subs};}return c.circ;}
const CP={promo:{n:'판촉',v:['정상','경품·무료 구독','공격적 확장'],d:['신문 판매 고시 안에서','석 달 무료 구독·상품권 · 비용↑ 부수↑','지국에 확장 수당 · 비용↑↑ · 고시 위반 위험']},
 price:{n:'구독료',v:['인하','동결','인상'],d:['부수 이탈↓ · 판매 수입↓','지금 그대로','판매 수입↑ · 부수 이탈↑'],o:1},
 jg:{n:'지국 지원',v:['축소','보통','확대'],d:['비용↓ · 지국망 약해짐','지금 그대로','비용↑ · 지국망 튼튼 · 이탈↓']},
 dig:{n:'디지털 전환',v:['종이 중심','병행','디지털 우선'],d:['지금 그대로','종이 부수 이탈 조금↑ · 인쇄비↓ · 트래픽↑','종이 이탈↑ · 인쇄비↓↓ · 트래픽↑↑']}};
function cpv(k){const C=circS();return C?C.pol[k]:0;}
function circPay(){const C=circS();if(!C)return 0;const l=S.co.last||{};return Math.max(0,l.subsRev||0);}
// 매달: 정책 효과 · 지국망 · 무가지 비율 · 판매 손익(정책으로 달라진 몫만 회사 돈에 반영)
function circMonth(lines){const C=circS();if(!C)return;const c=S.co,o=OUT(),P=C.pol,base=circPay();if(!base)return;
  if(C.auto||S.rank<7)circAI(C);
  // 지국망 건강: 지원 수준 쪽으로 천천히 움직인다
  const jgT=[42,62,80][P.jg]-(C.paper>S.turn?4:0);C.jg=clamp(C.jg+(jgT-C.jg)*.12,10,95);
  C.free=clamp(C.free+((.14+P.promo*.07)-C.free)*.2,.05,.4);
  // 부수 변화(월): 판촉 + 구독료 + 지국망 + 디지털 전환
  let g=[0,.002,.0036][P.promo]+[.0011,0,-.0016][P.price+1]-(62-C.jg)/62*.0028-[0,.0015,.003][P.dig];
  if(C.boy>S.turn)g-=.003;
  if(g>0&&typeof coBump==='function'){coBump(g,0);}else c.subs=Math.max(o.subs*.2,c.subs*(1+g));
  if(P.dig)c.bT+=[0,.0018,.0036][P.dig];
  // 돈: 기준(기본 정책) 대비 달라진 몫만
  const d=base*(-[0,.1,.22][P.promo]+[-.06,0,.075][P.price+1]-[-.025,0,.04][P.jg]+[0,.018,.035][P.dig]-(C.paper>S.turn?.05:0));
  c.cash+=d;C.last={base,d,g,jg:C.jg,free:C.free};
  // 신문 판매 고시 위반
  if(P.promo===2&&chance(.05+(S.comp&&S.comp.length?.03:0))){C.hitT=S.turn;const fine=+(base*1.2).toFixed(2);c.cash-=fine;C.hit++;apply({trust:-.6});lines.push({c:'r',t:`공정위: 신문 판매 고시 위반(경품·무가지 과다) 과징금 ${eok(fine)}`});}
  // ABC 부수 공사: 매년 11월 발표 → 다음 해 광고 단가
  if(month()===11&&C.abcY!==yearN0()){abcRun(C,lines);}
  if(C.abcK!==1&&c.last&&c.last.ad){c.cash+=c.last.ad*(C.abcK-1);}
  circEvents(C,lines);}
function yearN0(){return Math.floor(S.turn/YW);}
function abcRun(C,lines){const c=S.co,o=OUT();C.abcY=yearN0();const paid=c.subs,iss=paid*(1+C.free),rate=paid/iss;const yoy=C.y0?paid/C.y0-1:0;C.y0=paid;
  // 같은 유형 다른 신문들(대략): 해마다 2~6% 줄고 판촉을 세게 한 곳은 덜 준다
  const dec={daily:.004,econ:.003,sports:.006,local:.005,eng:.003,weekly:.005,trade:0}[o.type]||0;const pk=Math.pow(1-dec,12);const peers=OUTLETS.filter(x=>x.type===o.type&&x.id!==o.id&&!x.custom&&!x.closed&&x.subs>0).map(x=>{x._ab=(x._ab||x.subs)*pk*(1+R(-25,25)/1000);return [x.n,x._ab];});const rel=yoy-(pk-1);
  const L=peers.concat([[o.n+'(우리)',paid]]).sort((a,b)=>b[1]-a[1]);const rk=L.findIndex(x=>x[0].endsWith('(우리)'))+1;
  C.abcK=+clamp(1+rel*.5+(rate>=.9?.006:rate<.8?-.012:0),.965,1.035).toFixed(3);C.abc={y:yearN0(),paid,iss,rate,yoy,rel,rk,n:L.length,top:L.slice(0,5)};
  if(S.rank>=3)lines.push({c:yoy>=0?'g':yoy<-.05?'r':'',t:`ABC 부수 공사 발표 — 유료 ${f1(paid)}만 부(전년 ${yoy>=0?'+':''}${(yoy*100).toFixed(1)}%) · 유가율 ${Math.round(rate*100)}% · 같은 유형 ${rk}위/${L.length}곳 → 내년 광고 단가 ${C.abcK>=1?'+':''}${((C.abcK-1)*100).toFixed(1)}%`});
  if(S.rank>=5)Q.push(()=>openModal('ABC 부수 공사 발표',`<p class="lede">올해 인증 유료 부수 <b>${f1(paid)}만 부</b> · 발행 ${f1(iss)}만 부 · 유가율 ${Math.round(rate*100)}%</p><ul class="feed">${L.slice(0,6).map((x,i)=>`<li class="${x[0].endsWith('(우리)')?'g':''}">${i+1}. ${esc(x[0])} — ${f1(x[1])}만 부</li>`).join('')}${rk>6?`<li class="g">${rk}. ${esc(o.n)} — ${f1(paid)}만 부</li>`:''}</ul><p class="hint">광고주와 정부 광고는 인증 부수와 유가율을 본다. 무가지를 많이 뿌리면 발행 부수는 늘어도 유가율이 떨어진다. 내년 광고 단가 ${C.abcK>=1?'+':''}${((C.abcK-1)*100).toFixed(1)}%.</p>`));}
// AI 판매국장: 내가 사장이 아니거나 맡겨 두면 회사 사정에 맞춰 정책을 고른다
function circAI(C){const c=S.co,P=C.pol,l=c.last||{};const rev=l.rev||1;const yoy=C.y0?c.subs/C.y0-1:0;const tight=c.cash<rev*1.5;const rich=c.cash>rev*8;
  // ABC에서 밀렸으면(같은 유형 평균보다 더 줄었으면) 이듬해엔 판촉을 건다 · 고시 위반으로 걸린 적이 있으면 조심한다
  const abcBad=C.abc&&C.abc.rel<-.01&&C.abc.y===yearN0()-(month()<11?1:0);P.promo=tight?0:(yoy<-.035||abcBad)&&!(C.hit&&S.turn-(C.hitT||-999)<YW*2)?1:0;P.price=tight&&yoy>-.03?1:0;P.jg=tight?0:C.jg<50&&!tight?2:1;
  const yrs=yearN0();P.dig=yrs>=24&&yoy<-.06?2:yrs>=12||rich?1:0;if(OUT().type==='local')P.dig=Math.min(P.dig,1);}
// 판매 전략 회의 (사장)
RUN.circ=function(){const C=circS();if(!C){toast('종이 신문이 아니다');return;}spend(1,2);setCd('circ');circOpen();};
function circOpen(){const C=circS(),P=C.pol,l=C.last||{};
  const row=k=>{const D=CP[k],v=P[k]+(D.o||0);return `<div class="cprow"><b>${D.n}</b>${D.v.map((t,i)=>`<button type="button" class="cpb" data-k="${k}" data-v="${i-(D.o?1:0)}" aria-pressed="${i===v}">${t}</button>`).join('')}<small>${esc(D.d[v])}</small></div>`;};
  openModal('판매 전략 회의',`<p class="lede">판매국장이 부수 현황을 들고 왔다.</p><div class="kv"><div><span>유료 부수</span><b>${f1(S.co.subs)}만 부</b></div><div><span>발행 부수</span><b>${f1(S.co.subs*(1+C.free))}만 부</b></div><div><span>유가율</span><b>${Math.round(100/(1+C.free))}%</b></div><div><span>지국망</span><b>${Math.round(C.jg)}</b></div></div>${['promo','price','jg','dig'].map(row).join('')}<p class="hint">지난달 정책 손익 ${l.d!=null?`${l.d>=0?'+':''}${eok(l.d)}`:'—'} · 부수 ${l.g!=null?`${l.g>=0?'+':''}${(l.g*100).toFixed(2)}%/월`:'—'}. 판촉은 부수를 늘리지만 돈이 들고 유가율이 떨어진다. 구독료를 올리면 당장 수입이 늘지만 독자가 빠진다. 지국이 약해지면 배달이 끊기고, 디지털 전환은 인쇄비를 아끼는 대신 종이 독자를 잃는다.</p>`,
   [{label:'이대로 정한다',fn:()=>{C.auto=false;S.co.circ.set=S.turn;toast('판매 정책을 정했다');}},{label:'판매국장에게 맡긴다',sub:'회사 사정에 맞춰 알아서 고른다',fn:()=>{C.auto=true;circAI(C);toast('판매국장이 알아서 한다');}}]);
  document.querySelectorAll('#mb .cpb').forEach(b=>b.onclick=()=>{P[b.dataset.k]=+b.dataset.v;C.auto=false;const D=CP[b.dataset.k];b.parentNode.querySelectorAll('.cpb').forEach(x=>x.setAttribute('aria-pressed',x===b?'true':'false'));const sm=b.parentNode.querySelector('small');if(sm)sm.textContent=D.d[+b.dataset.v+(D.o||0)];});}
// 회사 탭: 판매국
function circBox(){try{const C=circS();if(!C)return '';const c=S.co,l=C.last||{},A=C.abc;const P=C.pol;
  return `<div class="sec">판매국 · 종이 부수</div><div class="card"><div class="meta"><span>유료 <b>${f1(c.subs)}만 부</b> · 발행 ${f1(c.subs*(1+C.free))}만 부 · 유가율 ${Math.round(100/(1+C.free))}%</span><span>지국망 ${Math.round(C.jg)} · 판촉 ${CP.promo.v[P.promo]} · 구독료 ${CP.price.v[P.price+1]} · 지국 지원 ${CP.jg.v[P.jg]} · ${CP.dig.v[P.dig]}${C.auto?' (판매국장 재량)':''}</span>${l.g!=null?`<span>지난달 부수 ${l.g>=0?'+':''}${(l.g*100).toFixed(2)}% · 정책 손익 ${l.d>=0?'+':''}${eok(l.d)}</span>`:''}${A?`<span>ABC ${A.y+2027}년: ${f1(A.paid)}만 부(전년 ${A.yoy>=0?'+':''}${(A.yoy*100).toFixed(1)}%) · 같은 유형 ${A.rk}위/${A.n} · 광고 단가 ${C.abcK>=1?'+':''}${((C.abcK-1)*100).toFixed(1)}%</span>`:'<span>ABC 부수 공사는 매년 11월에 발표된다</span>'}${C.paper>S.turn?'<span class="r">용지값 폭등 중</span>':''}${C.boy>S.turn?'<span class="r">절독 운동 중</span>':''}</div></div>`;}catch(e){return '';}}
// 판매 이벤트
function circEvents(C,lines){const P=C.pol,c=S.co,base=circPay();const once=(k,gap)=>{if((C.ev[k]||-999)>S.turn-gap)return false;C.ev[k]=S.turn;return true;};
  if(!chance(.11))return;const r=S.rank;const E=[];
  if(r>=7)E.push([C.jg<58?3:1.2,()=>once('jgfee',48)&&Q.push(()=>openModal('지국장들의 요구',`<p class="lede">지국장 연합회가 찾아왔다. "배달원 인건비가 올라 더는 못 버팁니다. 지원금을 올려 주십시오."</p>`,[{label:'지원금을 올린다',sub:`매달 비용↑ · 지국망↑`,fn:()=>{P.jg=2;C.auto=false;C.jg=Math.min(95,C.jg+6);}},{label:'공동 배달을 제안한다',sub:'다른 신문과 배달망을 나눈다 · 비용 조금↓ · 지국망 조금↑',fn:()=>{C.jg=Math.min(95,C.jg+4);c.cash+=base*.3;}},{label:'거절한다',sub:'지국 몇 곳이 문을 닫는다 · 부수↓',fn:()=>{C.jg=Math.max(10,C.jg-10);c.subs*=.992;}}]))]);
  if(r>=5)E.push([1,()=>once('paper',72)&&Q.push(()=>openModal('용지값 폭등',`<p class="lede">국제 펄프값이 뛰어 신문 용지값이 석 달 새 30% 올랐다. 반년은 간다는 전망이다.</p>`,[{label:'면수를 줄인다',sub:'비용 방어 · 지면이 얇아져 신뢰 조금↓',fn:()=>{apply({trust:-.4});C.paper=S.turn+8;}},{label:'그대로 버틴다',sub:'반년 동안 비용↑',fn:()=>{C.paper=S.turn+24;}}]))]);
  if(r>=5&&S.comp&&S.comp.length)E.push([1.2,()=>once('rivpromo',36)&&(()=>{const cp=compPick();const n=cName(cp);Q.push(()=>openModal('경쟁지의 공격적 판촉',`<p class="lede">${jo2(n,'이','가')} 우리 독자 집에 "1년 무료 + 상품권"을 돌리고 있다. 지국에서 해지 전화가 이어진다.</p>`,[{label:'맞불 판촉',sub:'석 달 판촉 강화 · 비용↑',fn:()=>{P.promo=Math.max(P.promo,1);C.auto=false;}},{label:'공정위에 신고한다',sub:'시간이 걸리지만 상대가 위축된다',fn:()=>{cp.pw=(cp.pw||1)*.96;c.subs*=.996;}},{label:'지면으로 승부한다',sub:'부수 조금↓ · 신뢰 조금↑',fn:()=>{c.subs*=.99;apply({trust:.4});}}]));})()]);
  const crit=(S.clips||[]).find(x=>x.turn>S.turn-8&&!x.staff&&!x.pos&&(x.imp||0)>=55);
  if(crit&&r>=1)E.push([.8,()=>once('boycott',60)&&Q.push(()=>openModal('절독 운동',`<p class="lede">「${esc(crit.h)}」 보도에 반발한 쪽이 "${esc(OUT().n)} 끊기" 운동을 벌인다. 판매국에서 전화가 왔다.</p>`,r>=6?[{label:'보도는 정당하다고 밝힌다',sub:'두어 달 부수↓ · 신뢰↑',fn:()=>{C.boy=S.turn+8;apply({trust:1});}},{label:'유감 표명만 한다',sub:'부수 방어 · 기자들 실망',fn:()=>{S.wMood=clamp((S.wMood??60)-3,0,100);apply({trust:-.5});}}]:[{label:'"기사는 기사"라고 답한다',sub:'신뢰↑',fn:()=>{C.boy=S.turn+6;apply({trust:.6});}},{label:`${typeof bossT==='function'?bossT():'데스크'}에게 넘긴다`,fn:()=>{C.boy=S.turn+4;}}]))]);
  if(r>=1&&r<=4&&month()===10)E.push([2.5,()=>once('quota',40)&&Q.push(()=>openModal('독자 늘리기 운동',`<p class="lede">회사가 "1인 5부 확장" 할당을 내렸다. 친척·지인에게 구독을 권하라는 얘기다.</p>`,[{label:'할당을 채운다',sub:'통장 -20만(내 돈으로 몇 부) · 평가 조금↑',fn:()=>{S.money-=20;c.subs*=1.0015;apply({eval:.4});}},{label:'기사로 독자를 늘리겠다며 버틴다',sub:'평가 조금↓ · 노조 쪽 관계↑',fn:()=>{apply({eval:-.3});const u=colBy('union');if(u)relUp(u,4,'할당 거부');}}]))]);
  if(r>=7&&typeof sisList==='function'&&sisList().some(x=>CIRC_TY.includes(x.type)))E.push([1,()=>once('coprint',96)&&Q.push(()=>{const s=sisList().find(x=>CIRC_TY.includes(x.type));openModal('공동 인쇄 제안',`<p class="lede">자매지 ${jo2(esc(s.n),'이','가')} 윤전기를 같이 쓰자고 한다. 인쇄 공장 하나를 줄일 수 있다.</p>`,[{label:'받아들인다',sub:'한 번에 비용 절감 · 마감 시간이 당겨져 늦은 기사 손해',fn:()=>{c.cash+=base*2.5;S.co.q=Math.max(10,S.co.q-.6);}},{label:'따로 간다',fn:()=>{}}]);})]);
  if(!E.length)return;const tot=E.reduce((a,x)=>a+x[0],0);let t=Math.random()*tot;for(const x of E){t-=x[0];if(t<=0){x[1]();break;}}}
// ===== 1.31 하리꼬미(뻗치기) 재조정 =====
// 수습: 체력 부담을 줄이고 허탕에도 관찰 메모가 남는다 · 평기자: 부서마다 다른 뻗치기 장소, 성공하면 단독 단서
const HARI_SP={soc:[['검찰청 포토라인 앞','소환 인물의 한마디',.4],['피의자 자택 앞','귀가 장면을 노린다',.3],['법원 영장실질심사장','영장 발부 여부',.45]],
 pol:[['의원회관 복도','회의 마치고 나오는 의원의 한마디',.42],['당 대표 자택 앞','출근길 첫마디',.32],['대통령실 앞 길목','비공개 회동 참석자',.28]],
 eco:[['그룹 회장 자택 앞','출근길 한마디',.3],['금융당국 청사 로비','제재심 결과를 들고 나오는 사람',.4],['주주총회장 뒷문','이사회 이후 표정',.38]],
 int:[['대사관 앞','협상 대표의 귀국 일성',.36],['외교부 청사 로비','회담 뒤 당국자',.42]],
 cul:[['소속사 건물 앞','당사자의 해명',.34],['시상식 백스테이지','수상자 첫마디',.45]],ent:[['소속사 건물 앞','당사자의 해명',.34],['촬영장 밖','갈등설 당사자',.3]],
 spo:[['구단 훈련장 앞','이적설 선수의 한마디',.4],['협회 이사회장 앞','징계 결과',.42]],
 loc:[['시장 관사 앞','출근길 해명',.36],['도의회 앞','예산 심사 뒤 의원',.42]]};
function hariSpots(){const k=cat1(S.dept);return (HARI_SP[k]||HARI_SP.soc).map(x=>({n:x[0],s:x[1],p:x[2]}));}
RUN.hari=function(){const spots=S.rank===0?HARI_SP.soc.map(x=>({n:x[0],s:x[1],p:x[2]})):hariSpots();const hp=(S.gear&&S.gear.car?8:13)+(S.rank>0?0:0);
  openModal('하리꼬미 · 어디서 뻗칠까',`<p>찬바람 속에 몇 시간을 버텨야 한다. 체력 ${hp}쯤 든다. 체력·취재력이 높을수록 잘 버틴다.${S.rank>0?' 성공하면 아무도 못 들은 한마디로 단독 단서를 잡는다.':''}</p>`,spots.map(s=>({label:s.n,sub:`${s.s} · 성공 가능성 ${s.p>=.42?'높음':s.p>=.34?'보통':'낮음'}`,fn:()=>{
    spend(2,hp);gain('sta',.5);gain('inv',.3);S.hariN=(S.hariN||0)+1;const p=clamp(s.p+S.st.inv/420+S.st.sta/520+(S.hariN>=4?.04:0),.15,.85);
    if(S.rank===0&&S.story!=='rookie'){if(chance(p)){S.memo=(S.memo||0)+2;let x='';if(chance(.35)){const sr=addSource(S.dept,R(12,22));x=`<p>기다리던 사이 ${esc(sr.role)} ${jo2(esc(sr.name),'과','와')} 말을 텄다 (취재원).</p>`;}log(`뻗치기: ${s.n} — 한마디를 땄다`);openModal('뻗치기 — 한마디',`<p class="lede">몇 시간 만에 나타난 당사자가 한마디를 남겼다. 선배 기사에 한 줄로 들어간다.</p>${x}<p class="hint">수습은 정보를 모아 정보보고 때 평가로 바꾼다. (메모 +2)</p>${fxLine(apply({eval:1.4}))}`);}
      else{S.memo=(S.memo||0)+.5;log(`뻗치기 허탕: ${s.n}`);openModal('허탕',`<p class="lede">${pick(['새벽 4시. 당사자는 뒷문으로 빠져나갔다는 소식이 들린다.','타사 기자 셋과 나란히 언 발을 굴렀다. 아무도 나오지 않았다.','"오늘 안 나온대." 경비원의 한마디에 철수했다.'])}</p><p class="hint">그래도 누가 드나들었는지는 적어 뒀다. (메모 +0.5)</p>${fxLine(apply({eval:.6}))}`);}
      return false;}
    if(chance(p)){const it=makeItem(S.dept,{excl:true,pre:1,mult:1.1});S.items.push(it);log(`뻗치기 성공: ${s.n}`);
      openModal('뻗치기 성공',`<p class="lede">몇 시간 만에 나타난 당사자가 한마디를 남겼다. 아무도 못 들은 말이다.</p><p>아이템 「${esc(it.title)}」 확보 (확인된 사실 1개, 단독 가능)</p>${fxLine(apply({eval:1.6}))}`);}
    else{const sr=chance(.25)?addSource(S.dept,R(10,18)):null;log(`뻗치기 허탕: ${s.n}`);openModal('허탕',`<p class="lede">${pick(['당사자는 끝내 나타나지 않았다.','타사 카메라에 둘러싸여 한마디도 못 건졌다.','"오늘은 안 오십니다." 비서실 직원의 말에 철수했다.'])}</p>${sr?`<p>대신 옆에서 같이 기다리던 ${esc(sr.role)} ${jo2(esc(sr.name),'과','와')} 명함을 바꿨다.</p>`:''}${fxLine(apply({eval:.4}))}`);}
    return false;}})).concat([{label:'오늘은 접는다',cls:'ghost'}]));};
try{if(!RANK_ACTS[1].includes('hari'))RANK_ACTS[1].splice(Math.max(0,RANK_ACTS[1].indexOf('beat')+1),0,'hari');ACT.hari.d='핵심 인물이 나타날 곳에서 몇 시간이고 기다린다. 평기자는 성공하면 단독 단서';
  TIPS.hari='뻗치기는 체력을 쓰지만 아무도 못 들은 한마디를 건질 수 있다. 수습은 허탕이어도 관찰 메모가 남고, 평기자는 성공하면 단독 단서를 잡는다. 여러 번 해 볼수록 요령이 붙는다.';}catch(e){console.error(e);}
try{ACT.circ={n:'판매 전략 회의',ap:1,sc:'office',cd:8,d:'판촉·구독료·지국 지원·디지털 전환을 정한다. 종이 신문만'};if(!RANK_ACTS[7].includes('circ'))RANK_ACTS[7].splice(Math.max(0,RANK_ACTS[7].indexOf('campaign')+1),0,'circ');ACT_IC.circ='paper';ACT_STAT.circ='sal';
  TIPS.circ='기본값은 지금까지와 같다. 판촉은 부수를 늘리지만 돈이 들고 유가율이 떨어지고, 구독료 인상은 수입을 늘리지만 독자가 빠진다. 11월 ABC 부수 공사 결과가 다음 해 광고 단가를 정한다.';}catch(e){console.error(e);}
{const _rk=rankActs;rankActs=function(){let a=_rk();if(a.includes('circ')&&!circOn())a=a.filter(x=>x!=='circ');return a;};}
(function(){const st=document.createElement('style');st.textContent=`.cprow{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin:8px 0;padding:8px 10px;border:1px solid var(--line,#2a3142);border-radius:10px}.cprow b{min-width:72px;font-size:14px}.cprow small{flex-basis:100%;color:var(--mute);font-size:12.5px}.cpb{font:inherit;font-size:13px;padding:5px 10px;border-radius:999px;border:1px solid var(--line,#2a3142);background:transparent;color:inherit;cursor:pointer}.cpb[aria-pressed="true"]{background:var(--sodium,#ffb84d);color:#1a1205;border-color:transparent;font-weight:700}.chk.off{opacity:.5}`;document.head.appendChild(st);})();
// ===== 1.31 광고 영업 난이도 =====
// 성공률: 기본이 낮고 능력치 효과는 완만하며 상한 78%. 같은 달 거듭하면 떨어지고, 반년 안에 계약한 회사는 예산이 바닥났다
function adP(rel,conflict,ci,kind){const n=S.mAct&&S.mAct.adsell||0;const hit=(S.adHit||{})[ci];
  let p=.06+(S.styT==='net'?.05:0)+(S.st.net||30)/450+(S.st.sal||0)/320+trSum('adP')*.7+clamp(rel,-50,100)/300+OUT().p*.025-(conflict?.15:0)+(posWarm(ci)?.08:0)+(kind==='rebate'?.15:0)-Math.max(0,adSz(ci)-1)*.08-Math.max(0,n-1)*.07-(hit!=null&&S.turn-hit<24?.18:0);
  return clamp(p,.05,.78);}
// ===== 1.31 재정: 매출 구조 + 대주주·계열 지원 =====
// 대주주 유형마다 들어오는 돈이 다르다: 대기업 계열은 계열사 광고, 사주 일가는 경영 지원, 지역 기업은 지역 광고·협찬, 공영은 수신료·정부 출연, 재단은 출연금
const SUP_T={chaebol:{n:'그룹 계열사 광고',k:.2,rel:1},family:{n:'사주 일가 경영 지원',k:.1,rel:1},localco:{n:'대주주 기업 광고·협찬',k:.14,rel:1},public:{n:'수신료·정부 출연',k:.42,tv:1},found:{n:'재단 출연금',k:.12},private:null,member:null,indep:null,founder:null};
function supT(){try{const W=ownEnsure();return W?SUP_T[W.k]:null;}catch(e){return null;}}
function supBase(infl){const o=OUT();const T=supT();if(!T)return 0;const tv=['tv','jp','ch'].includes(o.type);return o.ad*T.k*(T.tv&&!tv?.35:1)*(infl||1);}
function ownSup0(infl){return supBase(infl);}
function supK(){const T=supT();if(!T)return 1;let W=null;try{W=ownEnsure();}catch(e){}if(T.rel&&W){const hit=(S.ownHitT!=null&&S.turn-S.ownHitT<12)?.1:0;return clamp(1+(W.rel||0)/110-hit,.45,1.35);}if(T===SUP_T.public)return clamp(.9+(S.trust-50)/250,.82,1.1);return 1;}
function ownSupM(infl){const b=supBase(infl);if(!b)return 0;const c=S.co;const k=supK();c.supK=k;return +(b*k*(c.supCut&&c.supCut>S.turn?.6:1)).toFixed(3);}
// 위기 때 대주주의 손: 자금이 바닥나면 증자로 메워 주지만 조건이 붙는다
function supMonth(lines){if(S.founder||!S.co||!S.co.last)return;const c=S.co,l=c.last,T=supT();if(!T)return;let W=null;try{W=ownEnsure();}catch(e){}
  c.finH=(c.finH||[]).concat([{t:S.turn,rev:+l.rev.toFixed(2),cost:+l.cost.toFixed(2),pr:+l.profit.toFixed(2),sup:+(l.sup||0).toFixed(2)}]).slice(-12);
  if(c.cash<-l.rev*1.5&&S.turn-(c.bailT??-999)>=YW*2&&T!==SUP_T.public){c.bailT=S.turn;const amt=+(l.rev*7).toFixed(2);c.cash+=amt;const tough=W&&W.rel<0;
    if(tough){S.costCut={due:S.turn+24,r:.06};S.wMood=clamp((S.wMood??60)-6,0,100);}
    lines.push({c:tough?'r':'g',t:`대주주가 ${eok(amt)}을 증자해 자금을 메웠다${tough?' — 조건은 "반년 안에 인건비 6% 절감"':''}`});
    if(S.rank>=6)Q.push(()=>openModal('대주주의 증자',`<p class="lede">회사 통장이 바닥났다. 대주주가 ${eok(amt)}을 넣기로 했다.</p><p>${tough?'조건이 붙었다. 반년 안에 인건비를 6% 줄이라는 것이다. 편집국이 술렁인다.':'"이번엔 믿고 맡기겠습니다." 다음은 없을 수도 있다.'}</p>`));}
  if(T===SUP_T.public&&month()===12&&S.rank>=6&&S.turn-(c.supEvT??-99)>=YW){c.supEvT=S.turn;const bad=S.trust<45;Q.push(()=>openModal(bad?'수신료·출연금 삭감론':'내년 수신료·출연금 확정',`<p class="lede">${bad?'국회 예산 심사에서 "편파 방송에 세금을 줄 수 없다"는 말이 나왔다. 내년 출연금이 깎일 판이다.':'국회가 내년 수신료·출연금을 큰 이견 없이 확정했다.'}</p>`,bad?[{label:'국회를 돌며 설득한다',sub:'정치권 관계에 기대 · 독립성 논란',fn:()=>{apply({trust:-.6});if(chance(.6))toast('삭감을 막았다');else{c.supCut=S.turn+YW;toast('결국 깎였다');}}},{label:'공정성 위원회를 만들어 답한다',sub:'신뢰↑ · 올해는 삭감 감수',fn:()=>{c.supCut=S.turn+YW;apply({trust:1.5});}}]:[{label:'좋다'}]));}}
// 회사 탭: 재무
function finBox(){try{if(S.founder||!S.co||!S.co.last)return '';const c=S.co,l=c.last,T=supT();const H=c.finH||[];const sum=k=>H.reduce((a,x)=>a+(x[k]||0),0);
  const rows=[['구독·판매',l.subsRev],['광고',l.ad],['디지털·포털',(l.trRev||0)+(l.cp||0)],['사업·행사',l.bizRev],['기자 영업',l.salesRev],[T?T.n:'대주주 지원',l.sup],['기타',(l.one&&l.one.v>0?l.one.v:0)]].filter(x=>x[1]&&Math.abs(x[1])>=.005);
  const tot=l.rev||1;
  return `<div class="sec">재무 · 지난달</div><div class="card"><div class="meta">${rows.map(x=>`<span>${esc(x[0])} <b>${eok(x[1])}</b> · ${Math.round(x[1]/tot*100)}%</span>`).join('')}<span>매출 <b>${eok(l.rev)}</b> · 비용 ${eok(l.cost)} · ${l.profit>=0?'흑자':'적자'} <b>${eok(l.profit)}</b></span>${H.length>=3?`<span>최근 ${H.length}달 합계: 매출 ${eok(sum('rev'))} · 이익 ${eok(sum('pr'))}${sum('sup')?` · 그중 대주주·계열 ${eok(sum('sup'))}`:''}</span>`:''}<span>회사 자금 <b>${eok(c.cash)}</b>${T&&c.supK?` · 대주주 지원 수준 ${Math.round(c.supK*100)}%`:''}</span>${T&&T.rel?'<span class="hint">대주주와 사이가 나빠지거나 계열사를 건드리면 지원이 줄어든다</span>':''}</div></div>`;}catch(e){return '';}}
// ===== 1.31 논설위원실: 신문의 목소리 =====
// 논설위원 → 논설실장 → 주필. 기사 대신 사설을 쓴다. 회사 논조·대주주·내 지난 입장 사이에서 줄을 탄다.
// 핵심: ① 논지(찬성·반대·절충) ② 논거 두 개(약한 논거를 가려낸다) ③ 맺음말 톤 → 사설 완성도
//       논조 일관성: 같은 주제에 지난번과 다른 입장을 쓰면 "말 바꾸기"가 기록된다
//       영향력: 사설이 인용되고 반향을 일으키면 오른다 → 실장·주필 승진의 열쇠
const OP_N={1:'논설위원',2:'논설실장',3:'주필'};
// 주제: 찬성(pro)·반대(con)가 어느 논조와 맞는지 · 어울리는 맺음말 · 대주주 민감도
const OP_TH=[
 {k:'re',n:'부동산 보유세 강화',pro:['prog'],con:['cons','market'],tone:'촉구'},
 {k:'chaebol',n:'대기업 총수 일가 지배구조 개편',pro:['prog','neu'],con:['market'],tone:'촉구',own:['chaebol','family']},
 {k:'nk',n:'대북 인도적 지원 재개',pro:['prog'],con:['cons'],tone:'유보'},
 {k:'labor',n:'파업 손해배상 제한법',pro:['prog'],con:['market','cons'],tone:'촉구',own:['chaebol','localco']},
 {k:'prosec',n:'검찰 수사권 축소',pro:['prog'],con:['cons'],tone:'질타'},
 {k:'nuke',n:'원전 비중 확대',pro:['cons','market'],con:['prog'],tone:'촉구'},
 {k:'basic',n:'기본소득 도입',pro:['prog'],con:['market','cons'],tone:'유보'},
 {k:'platform',n:'거대 플랫폼 독점 규제',pro:['prog','neu'],con:['market'],tone:'촉구'},
 {k:'pension',n:'국민연금 "더 내고 덜 받는" 개혁',pro:['market','neu','cons'],con:['prog'],tone:'촉구'},
 {k:'wage',n:'최저임금 대폭 인상',pro:['prog'],con:['market','cons'],tone:'유보',own:['localco']},
 {k:'med',n:'의대 정원 확대',pro:['neu','prog','cons'],con:[],tone:'질타'},
 {k:'press',n:'언론중재법 징벌적 손해배상',pro:[],con:['cons','prog','neu','market'],tone:'질타'},
 {k:'dev',n:'지역 대규모 개발 사업 예타 면제',pro:['cons'],con:['prog','neu'],tone:'질타',own:['localco']},
 {k:'tax',n:'법인세 인하',pro:['market','cons'],con:['prog'],tone:'촉구',own:['chaebol']}];
// 논거: 강한 근거 · 보통 · 약한 논거(허수아비·성급한 일반화·출처 불명·감정 호소·미끄러운 비탈)
const OP_ARG={good:['정부 통계와 국책연구원 보고서의 수치','해외 여러 나라에서 실제로 시행한 결과','헌법재판소·대법원 판례의 취지','이해 당사자 양쪽의 공식 입장과 쟁점'],mid:['현장 관계자들의 증언','전문가 다수의 의견','지난 정부의 비슷한 정책 경험'],
 bad:[['반대편은 결국 나라를 망치려는 것이다','허수아비 공격'],['주변에 물어보니 다들 그렇다더라','성급한 일반화'],['한 연구에 따르면(출처 없음)','출처 불명'],['이대로 가면 나라가 무너진다','미끄러운 비탈'],['서민들의 눈물을 외면하는가','감정 호소']]};
function opOn(){return !!(S&&S.op);}
function opOK(o){o=o||(S&&S.outlet?OUT():null);return !!(o&&!S.founder&&!['tv','jp','ch','online','wire'].includes(o.type)&&o.p>=3);}
function opEnter(pos,why){const prev=S.rank;S.op={pos,t0:S.turn,pt:S.turn,inf:pos>=2?32:20,cons:65,st:{},eds:0,good:0,mood:60,prev,why,mE:0};if(S.rank<4)S.rank=4;S.inRank=0;S.items=[];S.handoffs=[];S.hm=[];
  S.op.mem=[0,1,2,3].map(()=>({name:rname(),rel:R(5,30),lean:pick(['pro','con','mid'])}));log(`${ro2(OP_N[pos])} 발령`);tick(`${OUT().n} 인사 — ${S.name} ${OP_N[pos]}`,1);
  Q.push(()=>openModal(`${OP_N[pos]}`,`<p class="lede">${pos>=2?'논설위원실 맨 안쪽 책상':'논설위원실 창가 책상'}. 이제 기사 대신 사설을 쓴다. 이름 없이 회사의 목소리로.</p><p><b>사설 쓰기</b>: 주제 → 논지 → 논거 두 개 → 맺음말. 약한 논거를 걸러 내야 완성도가 오른다.</p><p><b>논조 일관성</b>: 같은 주제에 지난번과 다른 입장을 쓰면 "말 바꾸기"로 남는다. 바꿀 땐 이유를 밝히자.</p><p><b>영향력</b>: 사설이 인용되고 반향을 일으키면 오른다. ${pos<3?`${jo2(OP_N[pos+1],'으로','로')} 가는 열쇠다.`:'주필은 신문의 얼굴이다.'}</p><p class="hint">편집국으로 돌아가고 싶으면 「편집국 복귀 신청」을 하면 다음 정기 인사에 반영된다.</p>`));}
function opLeave(){const pv=S.op?S.op.prev:5;S.op=null;S.rank=Math.min(Math.max(4,pv),5);S.inRank=0;S.team=genTeam();log('편집국 복귀');}
function opLeanK(th,st){const l=OUT().lean||'neu';if(st==='mid')return 0;const L=th[st]||[];const O=th[st==='pro'?'con':'pro']||[];return L.includes(l)?1:O.includes(l)?-1:0;}
function opOwnK(th,st){try{const W=ownEnsure();if(!W||!th.own||!th.own.includes(W.k))return 0;return st==='con'?1:st==='pro'?-1:0;}catch(e){return 0;}}
// 사설 쓰기
RUN.editorial=function(){const T=shuffle(OP_TH.slice()).slice(0,3);const lean=LEAN[OUT().lean]||'중도';
  openModal('사설 · 오늘의 주제',`<p>논설회의에서 오늘 사설 주제 후보 셋이 올라왔다. 우리 신문 논조는 <b>${esc(lean)}</b>.</p>`,T.map(th=>{const prev=S.op.st[th.k];return {label:th.n,sub:prev?`지난번 우리 입장: ${prev.s==='pro'?'찬성':prev.s==='con'?'반대':'절충'} (${prev.y}년)`:'처음 다루는 주제'+(th.own&&opOwnK(th,'pro')?' · 대주주가 민감해한다':''),fn:()=>{opStance(th);return false;}};}).concat([{label:'오늘은 넘긴다',cls:'ghost'}]));};
function opStance(th){const prev=S.op.st[th.k];const lean=OUT().lean;
  const tag=s=>{const k=opLeanK(th,s),w=opOwnK(th,s);return [k>0?'논조와 맞다':k<0?'논조와 반대':'',w>0?'대주주가 반긴다':w<0?'대주주가 싫어한다':'',prev&&prev.s!==s?'지난 입장과 다르다':''].filter(Boolean).join(' · ');};
  openModal(`사설 1/3 · 논지`,`<p class="lede">「${esc(th.n)}」</p><p>우리 신문은 어느 쪽에 설까.</p>`,[['pro','찬성한다'],['con','반대한다'],['mid','절충 — 양쪽의 문제를 함께 짚는다']].map(([s,t])=>({label:t,sub:tag(s)||'—',fn:()=>{if(prev&&prev.s!==s){openModal('입장이 바뀐다',`<p class="lede">${prev.y}년 사설에선 ${prev.s==='pro'?'찬성':prev.s==='con'?'반대':'절충'}했다.</p>`,[{label:'달라진 사정을 사설에 밝힌다',sub:'일관성 조금↓ · 말 바꾸기 비판을 막는다',fn:()=>{opArgs(th,s,'why');return false;}},{label:'그냥 쓴다',sub:'일관성↓↓ · 누군가 지난 사설을 찾아낼 수 있다',fn:()=>{opArgs(th,s,'flip');return false;}}]);return false;}opArgs(th,s,'');return false;}})).concat([{label:'← 다른 주제',cls:'ghost',fn:()=>{RUN.editorial();return false;}}]));}
function opArgs(th,s,flip){const G=shuffle(OP_ARG.good.slice()).slice(0,2),M=[pick(OP_ARG.mid)],B=shuffle(OP_ARG.bad.slice()).slice(0,2);const A=shuffle([...G.map(t=>({t,q:2})),...M.map(t=>({t,q:1})),...B.map(b=>({t:b[0],q:-2,w:b[1]}))]);
  const eye=((S.st.kno||40)+(S.st.int||40))/2;const hint=eye>=62?2:eye>=48?1:0;let shown=0;
  openModal('사설 2/3 · 논거 두 개',`<p class="lede">「${esc(th.n)}」 — ${s==='pro'?'찬성':s==='con'?'반대':'절충'}</p><p>사설을 받칠 논거 두 개를 고른다. 그럴듯하지만 약한 논거가 섞여 있다.${hint?' (상식·지능 덕에 수상한 것 몇 개가 눈에 띈다)':''}</p>${A.map((a,i)=>{let h='';if(a.q<0&&shown<hint){shown++;h=` <small class="r">— ${a.w}?</small>`;}return `<label class="chk"><input type="checkbox" data-op="${i}"><span><b>${esc(a.t)}</b>${h}</span></label>`;}).join('')}`,
   [{label:'다음: 맺음말',fn:()=>{const sel=[...document.querySelectorAll('#mb input[data-op]:checked')].map(x=>A[+x.dataset.op]);if(sel.length!==2){toast('논거를 두 개 골라 주세요');return false;}opTone(th,s,flip,sel);return false;}}]);
  const up=()=>{const c=[...document.querySelectorAll('#mb input[data-op]')];const n=c.filter(x=>x.checked).length;c.forEach(x=>{x.disabled=!x.checked&&n>=2;});};document.querySelectorAll('#mb input[data-op]').forEach(x=>x.onchange=up);}
function opTone(th,s,flip,sel){openModal('사설 3/3 · 맺음말',`<p class="lede">어떻게 끝맺을까.</p>`,[['촉구','"~해야 한다" — 분명하게 요구한다'],['질타','"~를 묻지 않을 수 없다" — 책임을 따진다'],['유보','"차분히 지켜볼 일이다" — 판단을 아낀다']].map(([t,d])=>({label:t,sub:d,fn:()=>{opPublish(th,s,flip,sel,t);}})));}
function opPublish(th,s,flip,sel,tone){spend(1,4);const O=S.op;const L=sel.reduce((a,x)=>a+x.q,0);const bad=sel.filter(x=>x.q<0);const lk=opLeanK(th,s),wk=opOwnK(th,s);
  const tn=tone===th.tone?6:(s==='mid'&&tone==='유보')?4:(tone==='유보'&&s!=='mid')?-3:0;
  let q=Math.round(38+L*7+tn+((S.st.wri||40)+(S.st.kno||40))/9+(lk>0?3:0)+R(-5,5));q=clamp(q,15,95);
  // 실장·주필의 손질: 논조를 거스르면 위원 시절엔 고쳐 쓰라는 말이 나온다
  let note='';if(O.pos===1&&lk<0&&chance(.6-O.inf/200)){q-=6;note=`<p class="hint">논설실장이 "우리 논조와 너무 다르다"며 문단 둘을 고쳤다.</p>`;}
  const prev=O.st[th.k];O.st[th.k]={s,y:2027+Math.floor(S.turn/YW)};
  if(prev&&prev.s!==s){O.cons=clamp(O.cons-(flip==='why'?3:9),0,100);O.flips=(O.flips||0)+1;}else if(prev)O.cons=clamp(O.cons+2,0,100);else O.cons=clamp(O.cons+(lk>=0?1:-1),0,100);
  const lead=O.pos>=2||chance(.25+O.inf/300);const g=q>=65;O.eds++;O.mE++;if(g)O.good++;
  O.inf=clamp(O.inf+(q-48)/12*(lead?1.4:1)+(g&&s!=='mid'?1:0),0,100);
  const fx={eval:(q-45)/22,trust:bad.length?-.5*bad.length:(q>=60?.3:0),fame:g&&lead?.4:0};
  if(wk){try{ownRel(wk*R(3,6));}catch(e){}}
  const c={h:`[사설] ${th.n}${s==='mid'?', 차분한 해법을':s==='pro'?' 서둘러야':' 신중해야'}`,o:OUT().n,d:'pol',q,imp:45,excl:false,date:dateShort(),turn:S.turn,views:Math.round(q*(OUT().p+1)*R(40,80)),lead:sel.map(x=>x.t).join(' · '),by:'사설',staff:1,desk:S.name,place:lead?'사설 첫 꼭지':'사설',ed:1};S.clips.unshift(c);if(S.clips.length>60)S.clips.pop();
  const t=apply(fx);log(`사설: ${th.n} (${q})`);
  // 반향
  let echo='';if(flip==='flip'&&chance(.45)){O.cons=clamp(O.cons-5,0,100);apply({fame:-.6});echo=`<p class="r">한 언론비평 매체가 우리 ${prev.y}년 사설을 나란히 붙여 "말 바꾸기"라고 꼬집었다.</p>`;}
  else if(g&&s!=='mid'&&chance(.35)){O.inf=clamp(O.inf+3,0,100);echo=`<p class="g">${pick(['국회 대정부질문에서 우리 사설이 인용됐다.','장관이 기자간담회에서 "그 사설 읽었다"고 했다.','포털 많이 본 사설 1위에 올랐다.'])} (영향력↑)</p>`;}
  else if(g&&S.comp&&chance(.22)){const cp=compPick();echo=`<p>${jo2(esc(cName(cp)),'이','가')} 다음 날 반박 사설을 실었다. 사설 전쟁이 붙을 수도 있다.</p>`;O.war={c:cp.id,n:cName(cp),th:th.n,t:S.turn};}
  if(bad.length)echo+=`<p class="r">독자 투고: "${esc(bad[0].t)}… 이게 근거입니까?" (${bad[0].w})</p>`;
  openModal('사설이 나갔다',`${clipHTML(c)}${note}<p>완성도 <b>${q}</b> · 논거 ${sel.map(x=>x.q>0?'○':'✕').join(' ')} · 맺음말 ${tone}${tn>0?' (주제와 잘 맞았다)':tn<0?' (힘이 빠졌다)':''}</p>${echo}<p class="hint">영향력 ${Math.round(O.inf)} · 논조 일관성 ${Math.round(O.cons)}</p>${fxLine(t)}`);}
// 논설회의
RUN.opmeet=function(){const O=S.op;spend(1,3);setCd('opmeet');const M=O.mem||[];const th=pick(OP_TH);const split=M.filter(m=>m.lean==='pro').length,con=M.filter(m=>m.lean==='con').length;
  if(O.pos===1){openModal('논설회의',`<p class="lede">오늘 큰 사설 주제는 「${esc(th.n)}」. 위원들 의견이 찬성 ${split} · 반대 ${jo2(con,'으로','로')} 갈렸다. 실장이 나를 본다.</p>`,[{label:'회사 논조에 맞춰 정리한다',sub:'실장 신임↑ · 영향력 조금↑',fn:()=>{O.inf=clamp(O.inf+2,0,100);apply({eval:.6});}},{label:'소수 의견을 끝까지 편다',sub:'설득되면 큰 사설을 맡는다 · 아니면 눈총',fn:()=>{if(chance(.35+(S.st.cha||40)/250)){O.inf=clamp(O.inf+5,0,100);toast('실장: "그럼 그 방향으로 당신이 써 봐." · '+apply({fame:.4}));}else{apply({eval:-.4});toast('실장: "오늘은 그냥 갑시다."');}}},{label:'듣기만 한다',sub:'위원들과 관계↑',fn:()=>{M.forEach(m=>m.rel=clamp(m.rel+3,-50,100));}}]);return;}
  openModal('논설회의 주재',`<p class="lede">${OP_N[O.pos]}로서 회의를 이끈다. 위원실 분위기 ${Math.round(O.mood)}.</p>`,[{label:'주제를 미리 나눠 맡긴다',sub:'위원실 사설 품질↑ · 영향력 꾸준히↑',fn:()=>{O.plan=S.turn+8;O.mood=clamp(O.mood+3,0,100);toast('이번 달 위원실 사설이 고르게 나온다');}},{label:'격론을 붙인다',sub:'좋은 사설이 나올 수 있다 · 분위기 흔들',fn:()=>{if(chance(.55)){O.inf=clamp(O.inf+5,0,100);toast('격론 끝에 날 선 사설이 나왔다 (영향력↑)');}else{O.mood=clamp(O.mood-6,0,100);toast('회의가 말싸움으로 끝났다');}}},{label:'대주주 쪽 의중을 전한다',sub:'대주주 관계↑ · 위원들 반발',fn:()=>{try{ownRel(5);}catch(e){}O.mood=clamp(O.mood-8,0,100);apply({trust:-.4});}}]);};
// 외부 필진 (실장·주필)
RUN.opguest=function(){const O=S.op;spend(1,3);setCd('opguest');openModal('외부 필진',`<p class="lede">고정 칼럼 필진을 손본다. 이름 있는 필진은 영향력을 키우지만 말썽도 부른다.</p>`,[{label:'유명 논객을 영입한다',sub:'영향력↑ · 막말 논란 위험',fn:()=>{O.inf=clamp(O.inf+4,0,100);O.star=S.turn;toast('새 필진 첫 칼럼이 화제가 됐다');}},{label:'현장 전문가를 늘린다',sub:'신뢰↑ · 조용하다',fn:()=>{toast(apply({trust:.8}));}},{label:'청년·지역 필진을 연다',sub:'독자층 확대 · 영향력 조금↑',fn:()=>{O.inf=clamp(O.inf+1.5,0,100);S.co.bS+=.002;}}]);};
// 편집국 복귀 신청
RUN.opleave=function(){S.op.back=1;toast('편집국 복귀를 신청했다 · 다음 정기 인사에 반영된다');};
// 매달
function opMonth(lines){const O=S.op;if(!O)return;O.inf=clamp(O.inf-.8+(O.plan&&O.plan>S.turn?1.2:0),0,100);
  if(!O.mE){apply({eval:-.8});lines.push({c:'r',t:`이번 달 쓴 사설이 한 편도 없다 — ${O.pos===1?'실장':'위원들'} 눈치가 보인다`});}O.mE=0;
  if(O.pos>=2){const q=(O.mood-50)/10+(O.plan&&O.plan>S.turn?2:0);O.inf=clamp(O.inf+q*.3,0,100);}
  // 사설 전쟁 2라운드
  if(O.war&&S.turn-O.war.t<=8&&chance(.6)){const w=O.war;O.war=null;Q.push(()=>openModal('사설 전쟁',`<p class="lede">${jo2(esc(w.n),'이','가')} 「${esc(w.th)}」 반박 사설에서 우리를 "궤변"이라고 했다.</p>`,[{label:'재반박 사설을 쓴다',sub:'영향력↑ 또는 망신',fn:()=>{if(chance(.45+O.cons/250)){O.inf=clamp(O.inf+5,0,100);toast('재반박이 먹혔다 · '+apply({fame:.8}));}else{O.inf=clamp(O.inf-3,0,100);toast('재반박이 더 큰 반박을 불렀다 · '+apply({fame:-.4}));}}},{label:'점잖게 넘어간다',sub:'신뢰 조금↑',fn:()=>toast(apply({trust:.4}))}]));}
  if(!chance(.16))return;const E=[];
  E.push([1.2,()=>{let W=null;try{W=ownEnsure();}catch(e){}if(!W||!OWN_T[W.k].grp)return;Q.push(()=>openModal('사설 한 줄',`<p class="lede">대주주 쪽에서 전화가 왔다. "이번 정부 규제안, 사설로 한번 짚어 주시죠. 우리 계열사 사정도 좀 넣어서."</p>`,[{label:'쓴다',sub:'대주주 관계↑ · 신뢰↓ · 위원실 분위기↓',fn:()=>{ownRel(8);apply({trust:-1});O.mood=clamp(O.mood-5,0,100);}},{label:'"사설은 회사 것이 아닙니다"',sub:'대주주 관계↓ · 신뢰↑ · 위원들 지지',fn:()=>{ownRel(-8);apply({trust:1});O.mood=clamp(O.mood+6,0,100);}},{label:'일반론으로 녹인다',sub:'둘 다 조금씩',fn:()=>{ownRel(3);apply({trust:-.3});}}]));}]);
  E.push([1,()=>Q.push(()=>openModal('정권의 항의',`<p class="lede">대통령실 홍보라인에서 "어제 사설은 사실관계가 틀렸다"는 항의가 왔다.</p>`,[{label:'사실관계를 다시 확인해 답한다',sub:'틀렸으면 정정 · 맞으면 신뢰↑',fn:()=>{if(chance(.7)){O.inf=clamp(O.inf+2,0,100);toast(apply({trust:.8}));}else{O.cons=clamp(O.cons-3,0,100);toast('한 군데가 틀렸다. 정정했다 · '+apply({trust:-.6}));}}},{label:'무시한다',sub:'관계↓ · 영향력 그대로',fn:()=>{}}]))]);
  if(month()===1&&O.pos>=2)E.push([4,()=>Q.push(()=>openModal('신년 사설',`<p class="lede">새해 첫 신문의 첫 사설. 한 해 우리 신문의 방향을 말한다.</p>`,[{label:'통합과 실용을 말한다',sub:'신뢰↑',fn:()=>{O.inf=clamp(O.inf+3,0,100);apply({trust:.8});}},{label:'권력 감시를 다짐한다',sub:'평판↑ · 정권 관계↓',fn:()=>{O.inf=clamp(O.inf+4,0,100);apply({fame:1});}},{label:'회사의 미래(디지털 전환)를 말한다',sub:'대주주 관계↑',fn:()=>{try{ownRel(4);}catch(e){}O.inf=clamp(O.inf+2,0,100);}}]))]);
  if(O.star&&S.turn-O.star<YW)E.push([1.5,()=>{O.star=null;Q.push(()=>openModal('필진 막말 논란',`<p class="lede">영입한 논객의 칼럼 한 문장이 특정 지역을 비하했다는 논란에 휩싸였다.</p>`,[{label:'연재를 중단하고 사과한다',sub:'영향력 조금↓ · 신뢰 방어',fn:()=>{O.inf=clamp(O.inf-3,0,100);apply({trust:.3});}},{label:'"필자 개인 의견"이라며 버틴다',sub:'신뢰↓',fn:()=>{apply({trust:-1.5});}}]));}]);
  if(O.pos===3&&O.mood<38)E.push([3,()=>Q.push(()=>openModal('위원들의 연판장',`<p class="lede">논설위원 셋이 "주필의 사설 방향에 동의할 수 없다"는 연판장을 돌렸다.</p>`,[{label:'회의를 열어 듣는다',sub:'분위기↑ · 영향력 조금↓',fn:()=>{O.mood=clamp(O.mood+12,0,100);O.inf=clamp(O.inf-2,0,100);}},{label:'주필 권한으로 정리한다',sub:'대주주 관계↑ · 분위기↓↓',fn:()=>{try{ownRel(3);}catch(e){}O.mood=clamp(O.mood-10,0,100);}}]))]);
  E.push([.8,()=>Q.push(()=>openModal('독자 반론',`<p class="lede">우리 사설에 정면으로 반대하는 독자 기고가 들어왔다. 글은 좋다.</p>`,[{label:'같은 지면에 싣는다',sub:'신뢰↑ · 일관성 그대로',fn:()=>{apply({trust:1});O.inf=clamp(O.inf+1,0,100);}},{label:'싣지 않는다',fn:()=>{}}]))]);
  const tot=E.reduce((a,x)=>a+x[0],0);let t=Math.random()*tot;for(const x of E){t-=x[0];if(t<=0){x[1]();break;}}}
// 정기 인사: 논설위원실 안에서 오르거나 편집국으로 돌아간다
function opJinsa(){const O=S.op;const y=(S.turn-O.pt)/YW;const parts=[];let W=null;try{W=ownEnsure();}catch(e){}
  if(O.back){O.back=0;opLeave();openModal('정기 인사',`<p class="lede">편집국 ${jo2(rankName(),'으로','로')} 돌아간다. 논설위원실 사람들이 커피를 사 줬다.</p>`);return;}
  if(O.pos===1&&y>=2&&O.inf>=45&&S.eval>=58){O.pos=2;O.pt=S.turn;S.money+=Math.round(payOf(OUT())*.3/10)*10;openModal('논설실장 발령',`<p class="lede">논설실장. 이제 위원들의 사설을 고르고 다듬는다.</p><p class="hint">외부 필진 관리와 논설회의 주재가 열렸다.</p>`);log('논설실장 승진');return;}
  if(O.pos===2&&y>=3&&O.inf>=65&&(S.fame>=55||(W&&W.rel>=10))&&chance(.6)){O.pos=3;O.pt=S.turn;S.money+=Math.round(payOf(OUT())*.5/10)*10;openModal('주필',`<p class="lede">주필. 신문의 논조를 책임지는 자리다. 편집국장도 사설 방향만큼은 나와 상의한다.</p>`);log('주필 취임');tick(`${OUT().n} 주필에 ${S.name}`,1);return;}
  const need=O.pos===1?`논설실장: 2년·영향력 45·평가 58 (지금 ${y.toFixed(1)}년·${Math.round(O.inf)}·${Math.round(S.eval)})`:O.pos===2?`주필: 3년·영향력 65·평판 55 또는 대주주 신임 (지금 ${y.toFixed(1)}년·${Math.round(O.inf)}·${Math.round(S.fame)})`:'주필 — 논설위원실의 꼭대기';
  openModal('정기 인사 발표',`<p>${OP_N[O.pos]} 유임.</p><p class="hint">${need}</p>`);}
function opBox(){if(!S.op)return '';const O=S.op;const th=Object.keys(O.st).length;return `<div class="sec">논설위원실</div><div class="card"><div class="meta"><span><b>${OP_N[O.pos]}</b> · 사설 ${O.eds}편 (잘 쓴 사설 ${O.good}편)</span><span>영향력 ${Math.round(O.inf)} · 논조 일관성 ${Math.round(O.cons)}${O.flips?` · 말 바꾸기 ${O.flips}번`:''} · 입장을 낸 주제 ${th}개</span>${O.pos>=2?`<span>위원실 분위기 ${Math.round(O.mood)}</span>`:''}</div></div>`;}
// ---- 등록 · 기존 흐름과 잇기 ----
try{ACT.editorial={n:'사설 쓰기',ap:1,sc:'office',cd:0,d:'주제 → 논지 → 논거 두 개 → 맺음말. 약한 논거를 걸러 내야 완성도가 오른다'};ACT.opmeet={n:'논설회의',ap:1,sc:'office',cd:4,d:'오늘의 사설 방향을 정한다. 위원일 땐 내 의견을 밀고, 실장·주필일 땐 회의를 이끈다'};
  ACT.opguest={n:'외부 필진',ap:1,sc:'office',cd:12,d:'고정 칼럼 필진을 손본다. 실장·주필'};ACT.opleave={n:'편집국 복귀 신청',ap:0,sc:'office',cd:24,d:'다음 정기 인사 때 편집국 간부로 돌아간다'};
  Object.assign(ACT_IC,{editorial:'quote',opmeet:'users',opguest:'pen',opleave:'flag'});Object.assign(ACT_STAT,{editorial:'wri',opmeet:'cha',opguest:'net'});
  Object.assign(TIPS,{editorial:'회사 논조와 맞으면 무난하고, 대주주 민감 주제에선 대주주 관계가 움직인다. 같은 주제에 입장을 바꾸면 이유를 밝히자. 약한 논거(허수아비·성급한 일반화·출처 불명·감정 호소·미끄러운 비탈)는 독자가 먼저 알아본다.',opmeet:'위원일 땐 소수 의견을 밀어 큰 사설을 따낼 수 있다. 실장·주필은 주제를 나눠 맡기면 영향력이 꾸준히 오른다.',opguest:'유명 논객은 영향력을 키우지만 1년 안에 말썽이 날 수 있다.',opleave:'편집국으로 돌아가면 원래 직급(부국장·국장)으로 간다.'});
  MIS_ACT.editorial='사설 {g}편 쓰기';MIS_ACT.opmeet='논설회의';}catch(e){console.error(e);}
const OP_ACTS=['editorial','opmeet','opguest','column','network','source','colleague','life','rest','opleave','job'];
{const _rk=rankActs;rankActs=function(){if(S&&S.op&&!S.founder){return OP_ACTS.filter(id=>ACT[id]&&(id!=='opguest'||S.op.pos>=2)&&!(S.simple&&SIMPLE_HIDE.includes(id)));}return _rk();};}
{const _rn=rankName;rankName=function(i,o){if(!o&&S&&S.op&&(i===undefined||i===S.rank))return OP_N[S.op.pos];return _rn.apply(this,arguments);};}
{const _dn=deptName;deptName=function(){if(S&&S.op)return '논설위원실';return _dn.apply(this,arguments);};}
{const _q=quota;quota=function(){if(S&&S.op)return 0;return _q.apply(this,arguments);};}
{const _ra=retireAge;retireAge=function(){if(S&&S.op&&S.op.pos===3&&!S.retExt)return AGE_EXEC;return _ra();};}
{const _j=jinsa;jinsa=function(){if(S&&S.op&&!S.founder&&!S.story)return opJinsa();_j();try{opOffer();}catch(e){console.error(e);}};}
{const _e=ending;ending=function(kind){if(S&&S.op&&/^정년퇴직|^임기 만료 퇴임/.test(String(kind)))kind=S.op.pos===3?'주필 · 신문의 목소리':'논설위원으로 펜을 놓다';return _e(kind);};}
try{END_DEX.push(['주필 · 신문의 목소리','retire','논설위원실 꼭대기 주필로 은퇴한다'],['논설위원으로 펜을 놓다','retire','논설위원실에서 사설을 쓰다 은퇴한다']);END_HOW['주필 · 신문의 목소리']='국장급에서 논설위원실로 옮겨 영향력을 쌓아 주필에 오른다';END_HOW['논설위원으로 펜을 놓다']='논설위원실에서 정년을 맞는다';}catch(e){}
// 편집국 간부에게 들어오는 논설위원 제안 (정기 인사 뒤)
function opOffer(){if(S.op||S.founder||S.story||!opOK())return;if(S.rank<4||S.rank>5)return;if(S.turn-(S.opOfT??-999)<YW*2)return;const strong=((S.st.wri||40)+(S.st.kno||40))/2;if(!chance(.12+Math.max(0,strong-50)/200+(S.edFail?.1:0)))return;S.opOfT=S.turn;
  Q.push(()=>openModal('논설위원실 제안',`<p class="lede">편집국장이 불렀다. "논설위원실에 자리가 났는데, 당신 글이면 사설 쓰기 딱이야."</p><p class="hint">논설위원이 되면 기사·데스킹 대신 사설을 쓴다. 영향력을 쌓으면 논설실장·주필로 오른다. 편집국 승진 경쟁에서는 빠진다.</p>`,[{label:'논설위원실로 간다',sub:'새 진로 · 주필까지',fn:()=>{opEnter(1,'offer');}},{label:'편집국에 남겠다',sub:'지금 길을 간다',fn:()=>{}}]));}

{const _t=transfer;transfer=function(){if(S&&S.op){S.op=null;}return _t.apply(this,arguments);};}
// ===== 1.31 기사 삭제 요청 · 잊힐 권리 =====
// 지난 기사를 지워 달라는 요청이 들어온다. 무죄 확정·오래된 일반인 기사·피해자 신원·기업·정치인·연예인.
// 지우면 기록이 사라지고, 버티면 언론중재위·소송이 온다. 비식별 처리와 후속 보도가 대개 정답이지만 상황마다 다르다.
const DEL_T={
 acq:{n:'무죄 확정',who:'기사 속 피의자였던 사람',ask:'"재판에서 무죄가 확정됐습니다. 그런데 검색하면 아직도 제 이름과 범죄 기사가 먼저 나옵니다."',best:['follow','anon'],c:['soc','case','court']},
 old:{n:'오래된 일반인 기사',who:'기사에 실명이 나온 일반인',ask:'"몇 년 전 기사인데, 취업할 때마다 면접관이 이 기사를 압니다. 이제 놓아 주시면 안 될까요."',best:['anon'],c:['soc','loc','case']},
 victim:{n:'피해자 신원 노출',who:'사건 피해자 가족',ask:'"기사에 나온 동네·나이·직업만으로 주변 사람들이 다 알아봤습니다. 2차 피해가 계속됩니다."',best:['anon'],c:['soc','case','court','loc']},
 corp:{n:'기업의 삭제 요청',who:'기업 홍보실',ask:'"이미 해결된 일입니다. 기사 내려 주시면 하반기 광고는 저희가 넉넉히 챙기겠습니다."',best:['keep','follow'],c:['eco','ind','fin','stock','estate','it']},
 pol:{n:'정치인의 삭제 요청',who:'선거를 앞둔 정치인 측',ask:'"선거가 코앞입니다. 지난 의혹 기사, 결론도 안 났는데 계속 걸려 있으면 곤란하죠."',best:['keep','follow'],c:['pol']},
 star:{n:'연예인 사생활 기사',who:'연예인 소속사',ask:'"사생활 기사라 본인이 많이 힘들어합니다. 내려 주시면 다음 인터뷰는 단독으로 드리겠습니다."',best:['anon','del'],c:['cul','ent','spo','culspo']}};
const DEL_O={del:'기사를 지운다',anon:'이름·신원을 가리고 검색에서 뺀다',follow:'후속 보도(결론·반론)를 덧붙인다',keep:'그대로 둔다'};
function delCands(){const t=S.turn;return (S.clips||[]).filter(c=>c&&!c.ed&&!c.delt&&c.turn!=null&&t-c.turn>=6&&(S.rank>=4||String(c.by||'').includes(S.name)||c.desk===S.name));}
function delKind(c){const k=cat1(c.d||'soc');const age=S.turn-c.turn;const L=Object.keys(DEL_T).filter(x=>{const T=DEL_T[x];if(!T.c.includes(k)&&!T.c.includes(c.d))return false;if(x==='old'&&age<YW*2)return false;if(x==='acq'&&c.pos)return false;if((x==='corp'||x==='pol')&&c.pos)return false;return true;});return L.length?pick(L):null;}
function delPolN(){return {rule:'원칙 — 기록은 남기고 가린다',flex:'유연 — 요청은 웬만하면 들어준다',board:'위원회 — 독자권익위원회가 심의한다'}[S.delPol]||'정해진 지침 없음';}
// 결정 효과
function delFx(k,o,c){const T=DEL_T[k];const best=T.best.includes(o);const fx={};let t='';const lg={k,o,t:S.turn};
  if(o==='del'){fx.trust=k==='corp'?-2:k==='pol'?-1.5:k==='star'?-.2:-.4;c.delt='del';if(k==='corp'){try{const e=(ENTS.find(e=>c.h.includes(e[1]))||[])[0];if(e)netUp(e,10);}catch(x){}S.co.adB+=.02;}if(k==='star'&&chance(.6)){const it=makeItem(c.d||'cul',{excl:true,pre:1});if(S.rank<=3)S.items.push(it);}t='기사를 내렸다.';}
  else if(o==='anon'){fx.trust=['acq','old','victim','star'].includes(k)?.6:-.4;c.delt='anon';t='이름과 신원을 가리고 검색 노출을 막았다. 기록은 남았다.';}
  else if(o==='follow'){fx.trust=k==='acq'?1:k==='pol'||k==='corp'?.5:.2;fx.eval=.3;c.delt='follow';t='기사 끝에 후속 사실을 덧붙였다.';}
  else{fx.trust=k==='corp'||k==='pol'?.6:k==='victim'?-1.2:k==='acq'?-.5:0;t='기사를 그대로 두기로 했다.';
    const p={acq:.45,old:.2,victim:.5,corp:.35,pol:.55,star:.25}[k];if(chance(p)){S.delSuit=(S.delSuit||[]).concat([{k,h:c.h,due:S.turn+R(4,10),q:c.q||55}]);t+=` ${T.who} 쪽이 언론중재위원회에 조정을 신청하겠다고 한다.`;}
    if(k==='corp'){try{const e=(ENTS.find(e=>c.h.includes(e[1]))||[])[0];if(e)netUp(e,-10);}catch(x){}if(chance(.4))S.co.adB-=.02;}}
  if(best)fx.trust=(fx.trust||0)+.3;
  S.delLog=(S.delLog||[]).concat([lg]).slice(-20);return {fx,t,best};}
// 매달: 요청 · 조정 · 이중잣대
function delMonth(lines){if(S.founder&&!S.co)return;
  // 언론중재위 조정
  const due=(S.delSuit||[]).filter(x=>x.due<=S.turn);S.delSuit=(S.delSuit||[]).filter(x=>x.due>S.turn);
  due.forEach(x=>Q.push(()=>openModal('언론중재위원회 조정',`<p class="lede">「${esc(x.h)}」 — ${DEL_T[x.k].who} 쪽이 조정을 신청했다.</p><p class="hint">조정에 응하면 반론·추후보도문을 싣고 끝난다. 거부하면 소송으로 간다. 기사가 탄탄할수록 이길 가능성이 크다.</p>`,[{label:'조정에 응한다 — 반론보도문을 싣는다',sub:'신뢰 조금↓ · 일이 끝난다',fn:()=>{toast(apply({trust:-.4}));}},{label:'소송으로 간다',sub:`승소 가능성 약 ${pct(clamp(.3+x.q/180+S.trust/400,.2,.85))} · 회사 비용`,fn:()=>{const w=chance(clamp(.3+x.q/180+S.trust/400,.2,.85));if(S.co)S.co.cash-=.15;toast(w?'승소 — 보도의 공익성이 인정됐다 · '+apply({trust:1.2,fame:.5}):'패소 — 손해배상 · '+apply({trust:-1.5,eval:-1}));if(!w&&S.co)S.co.cash-=.4;}}])));
  // 이중잣대: 기업 요청은 지워 주고 시민 요청은 버텼다
  const D=S.delLog||[];if(D.some(x=>x.k==='corp'&&x.o==='del'&&S.turn-x.t<YW)&&D.some(x=>['acq','old','victim'].includes(x.k)&&x.o==='keep'&&S.turn-x.t<YW)&&S.turn-(S.delDblT??-999)>=YW&&chance(.35)){S.delDblT=S.turn;apply({trust:-1.5,fame:-.6});lines.push({c:'r',t:`미디어 비평지: "${OUT().n}, 광고주 기사는 지워 주고 시민 요청은 외면" — 이중잣대 비판`});}
  if(S.rank>=6&&!S.delPol&&(S.delLog||[]).length>=2&&!S.delPolAsk){S.delPolAsk=1;Q.push(()=>openModal('삭제 요청 처리 지침',`<p class="lede">기사 삭제 요청이 늘어 편집국마다 판단이 제각각이다. 회사 지침을 정하자.</p>`,[{label:'원칙 — 기록은 남기고, 가리거나 덧붙인다',sub:'신뢰↑ · 기업·정치권 불만',fn:()=>{S.delPol='rule';apply({trust:.6});}},{label:'유연 — 요청은 웬만하면 들어준다',sub:'분쟁↓ · 신뢰↓ · 광고주 관계↑',fn:()=>{S.delPol='flex';apply({trust:-.6});}},{label:'위원회 — 독자권익위원회가 심의한다',sub:'신뢰↑ · 처리 느림',fn:()=>{S.delPol='board';apply({trust:.8});}}]));}
  if(S.rank<1||S.story||S.turn-(S.delT??-999)<12||!chance(.12))return;const C=delCands();if(!C.length)return;const c=pick(C.slice(0,30));const k=delKind(c);if(!k)return;S.delT=S.turn;const T=DEL_T[k];
  // 지침이 있으면 일상적인 요청은 알아서 처리한다
  if(S.delPol&&['old','star'].includes(k)&&!(S.rank<=3&&String(c.by||'').includes(S.name))){const o=S.delPol==='flex'?'del':'anon';const r=delFx(k,o,c);apply(r.fx);lines.push({c:'',t:`삭제 요청 「${c.h}」 — 지침(${delPolN().split(' ')[0]})대로 ${DEL_O[o]}`});return;}
  const opts=Object.keys(DEL_O).map(o=>({label:DEL_O[o],sub:{del:k==='corp'?'광고주 관계↑ · 신뢰↓↓ · 들키면 큰일':k==='pol'?'정치권 관계↑ · 신뢰↓':'분쟁은 끝나지만 기록이 사라진다',anon:k==='corp'||k==='pol'?'꼼수로 보일 수 있다':'개인 피해를 막고 기록은 남긴다',follow:k==='acq'?'무죄 확정 사실을 기사에 붙인다':'결론·반론을 덧붙여 균형을 맞춘다',keep:k==='victim'?'2차 피해 비판 · 조정 신청 가능':'공익을 지킨다 · 조정·소송이 올 수 있다'}[o],fn:()=>{const r=delFx(k,o,c);const t=apply(r.fx);if(S.rank<=3&&String(c.by||'').includes(S.name)){const b=colBy('boss');if(b)relUp(b,r.best?2:-1,'삭제 요청 처리');}openModal('처리했다',`<p class="lede">${r.t}</p>${r.best?'<p class="g">이런 요청엔 이 방법이 무난하다.</p>':''}${fxLine(t)}`);}}));
  const mine=String(c.by||'').includes(S.name);const who=S.rank<=3?(mine?'내 기사다. 데스크가 내 의견을 묻는다.':'데스크가 처리 방향을 묻는다.'):S.rank>=6?'편집국장 판단이 필요하다는 보고가 올라왔다.':'담당 부장이 판단을 올렸다.';
  Q.push(()=>openModal(`기사 삭제 요청 · ${T.n}`,`<p class="lede">「${esc(c.h)}」 (${esc(c.date||'')})</p><p>${esc(T.who)}: ${T.ask}</p><p class="hint">${who}${S.delPol?` 회사 지침: ${delPolN()}.`:''}</p>`,opts));}
try{TIPS.delreq='';}catch(e){}
// AI 편집국장의 하명: 내가 부장일 때 위에서 기획이 내려온다
function hmMeMonth(lines){if(S.founder||S.story||S.op||S.rank!==3)return;const H=S.hmMe;
  if(H&&S.turn>=H.due){S.hmMe=null;const done=(S.clips||[]).some(c=>c.turn>=H.t&&String(c.h||'').includes(H.title));const b=colBy('boss');
    if(done){apply({eval:1.5});if(b)relUp(b,5,'하명 기획 완수');lines.push({c:'g',t:`${bossT()} 하명 기획 「${H.title}」${jp(H.title,'을','를')} 해냈다 — "역시 맡길 만하다"`});}
    else{apply({eval:-1});if(b)relUp(b,-4,'하명 기획 불발');lines.push({c:'r',t:`${bossT()} 하명 기획 「${H.title}」${jp(H.title,'이','가')} 지면에 못 나갔다`});}return;}
  if(H||!chance(.07))return;const it=makeItem(S.dept,{excl:chance(.4),mult:1.2});const b=colBy('boss');const sales=b&&b.pref==='sales';
  Q.push(()=>openModal(`${bossT()}의 하명`,`<p class="lede">"${esc(DEPTS[S.dept].n)}에서 「${esc(it.title)}」 기획 하나 해 와. 두 달 안에."</p><p class="hint">맡으면 아이템을 쥐고 시작한다. 두 달 안에 기사로 내면 ${bossT()} 신임이 크게 오른다. 부서원에게 취재 지시로 넘겨도 된다.</p>`,[{label:'맡는다',fn:()=>{S.items.push(it);S.hmMe={title:it.title,t:S.turn,due:S.turn+8};}},{label:'부서 사정을 들어 고사한다',sub:`${bossT()} 관계↓`,fn:()=>{if(b)relUp(b,-3,'하명 고사');}}]));}
// 지금 할 일: 논설위원은 사설부터 · 편집국장은 비어 있으면 하명
{const _nh=nowHint;nowHint=function(){try{if(S&&S.op&&!why('editorial')&&(S.op.mE||0)<2)return {id:'editorial',d:(S.op.mE||0)?'이번 달 사설 한 편 더 — 영향력이 오른다':'이번 달 사설을 아직 안 썼다'};
  if(S&&!S.founder&&S.rank===6&&!(S.hm||[]).length&&!why('hamyeong')&&S.turn%4<2)return {id:'hamyeong',d:'부서에 기획을 내려보내면 지면이 산다'};}catch(e){}return _nh();};}
// 할 일 묶음 · 승진 안내 · 미션 새로 고침
try{const G=n=>ACT_GROUPS.find(g=>g[0]===n);G('기사와 지면')[2].push('editorial','opmeet','opguest','hamyeong');G('영업과 경영')[2].push('circ');G('나의 생활')[2].push('opleave');}catch(e){console.error(e);}
{const _pl=promoLine;promoLine=function(){if(S&&S.op){const O=S.op;const y=(S.turn-O.pt)/YW;if(O.pos>=3)return `<p class="misp">주필 — 논설위원실 꼭대기. 영향력 ${Math.round(O.inf)} · 일관성 ${Math.round(O.cons)}</p>`;const n=O.pos===1?{y:2,inf:45,t:`평가 ${Math.round(S.eval)}/58`}:{y:3,inf:65,t:`평판 ${Math.round(S.fame)}/55 또는 대주주 신임`};return `<p class="misp">${OP_N[O.pos+1]}까지 ${y<n.y?`${OP_N[O.pos]} ${moTxt(Math.ceil((n.y-y)*YW))} 더 · `:''}영향력 ${Math.round(O.inf)}/${n.inf} · ${n.t}</p>`;}return _pl();};}
{const _oe=opEnter;opEnter=function(){const r=_oe.apply(this,arguments);try{S.mis=null;misEnsure();}catch(e){}return r;};}
{const _ol=opLeave;opLeave=function(){const r=_ol.apply(this,arguments);try{S.mis=null;misEnsure();}catch(e){}return r;};}
// AI: 후배가 먼저 아이템을 들고 와 "제가 해 봐도 될까요?" — 받아 주면 이번 달 취재 지시 1건으로 친다
function asgPropose(){if(S.founder||S.story||S.op||S.rank<2||S.rank>5||!asgLeft()||!chance(.2))return;let P=[];try{P=assignPool().filter(asgCan).filter(m=>!(S.handoffs||[]).some(h=>h.who===m.name&&h.due>S.turn));}catch(e){return;}
  const m=P.sort((a,b)=>((b.skill||0)+(b.rel??20)*.3)-((a.skill||0)+(a.rel??20)*.3))[0];if(!m)return;const pf=(m.ai&&m.ai.y)||'fact';
  let it=null;for(let g=0;g<10;g++){it=makeItem(S.dept,{excl:pf==='scoop'?chance(.55):chance(.25),mult:1.05});if(asgGradeOK(it))break;}if(!asgGradeOK(it))return;
  Q.push(()=>openModal('후배의 발제',`<p class="lede">${esc(m.name)} ${MR[Math.min(3,m.r||0)]}: "${pf==='scoop'?'이거 단독 될 것 같습니다. 제가 붙어 봐도 될까요?':pf==='fact'?'자료를 좀 모아 봤는데, 제대로 확인해 보고 싶습니다.':pf==='buzz'?'오늘 반응 올 만한 거 하나 있습니다. 바로 치겠습니다!':'아는 분이 귀띔해 준 게 있는데요.'}"</p><p>「${esc(it.title)}」 · ${gradeOf(it)}등급 · 파급력 ${it.imp}${it.excl?' · 단독 가능':''}</p><p class="hint">받아 주면 이번 달 취재 지시 1건을 쓴다 (남은 ${asgLeft()}건). 후배가 스스로 가져온 일이라 더 열심히 한다.</p>`,[
   {label:'해 보라고 한다',rec:true,sub:'취재 지시 1건 · 후배 관계↑ · 성공 가능성↑',fn:()=>{const h={who:m.name,kind:'부서원',ref:m.id,col:false,title:it.title,imp:it.imp,excl:it.excl,sk:(m.skill||45)+12,due:S.turn+R(4,8),rival:false,sub:true,mode:'order'};asgAI(m,h);S.handoffs=(S.handoffs||[]).concat([h]);asgUse(1);S.mAct=S.mAct||{};S.mAct.assign=(S.mAct.assign||0)+1;try{misCheck();}catch(e){}mRel(m,4,'발제를 받아 줌');log(`후배 발제 수락: 「${it.title}」 → ${m.name}`);}},
   {label:'다음에 하자고 한다',sub:'후배 관계 조금↓',fn:()=>{mRel(m,-2,'발제 반려');}}]));}
// ===== 1.31 글 줄이기 =====
// ① 짧게 보기(기본): 첫 문단만 보이고 나머지 설명은 「자세히」에 접는다 · 긴 목록은 6줄만 · 선택지 아래 긴 설명 칩은 숨기고 숫자·화살표 칩만
// ② 자잘한 일 맡기기(기본): 명절·회식·결혼식 같은 가벼운 이벤트는 내 성향대로 알아서 고르고 카드 한 장으로 알린다
// ⑤ 처음 하는 일 팁: 빠른 시작·두 번째 판부터는 한 줄 알림으로 · 창으로 볼 때도 첫 문장만
function shortOn(){return !!(S&&S.phase==='game'&&S.longTxt!==true);}
const SHORT_SKIP=/튜토리얼|도움말|업데이트|설정|메뉴|엔딩|저장|개발자|용어|기록|도감|결과 보기|커리어 관리|빠른 시작/;
function firstSent(t){t=String(t||'');const m=/^(.+?(?:다|요|까|라|자)[.!?]["”」』]?)(\s|$)/.exec(t);return m?m[1]:t;}
function shortify(title){if(SHORT_SKIP.test(title||''))return;const root=$('#mb');if(!root)return;
  // 긴 목록: 좋은 일·나쁜 일을 먼저 6줄, 나머지는 접는다
  root.querySelectorAll('ul.feed').forEach(ul=>{const L=[...ul.children];if(L.length<=7)return;const pri=li=>li.classList.contains('g')||li.classList.contains('r')?0:1;const keep=L.slice().sort((a,b)=>pri(a)-pri(b)).slice(0,6);const rest=L.filter(x=>!keep.includes(x));const d=document.createElement('details');d.className='more';d.innerHTML=`<summary>나머지 ${rest.length}건 보기</summary>`;const u2=document.createElement('ul');u2.className='feed';rest.forEach(x=>u2.appendChild(x));d.appendChild(u2);ul.after(d);});
  // 문단: 첫 문단(lede)·효과(fx)·경고는 남기고, 설명 문단은 「자세히」로
  const kids=[...root.children];const tot=(root.textContent||'').replace(/\s+/g,' ').length;if(tot>=300){let first=kids.find(e=>e.tagName==='P'&&e.classList.contains('lede'))||kids.find(e=>e.tagName==='P');
    const mov=kids.filter(e=>e.tagName==='P'&&e!==first&&!e.classList.contains('fx')&&!e.classList.contains('warn')&&!e.querySelector('input,button,select,textarea')&&!e.classList.contains('r')&&!e.classList.contains('keep')&&(e.textContent||'').trim().length>0);
    const mt=mov.reduce((a,e)=>a+(e.textContent||'').length,0);if(mov.length&&mt>=120){const d=document.createElement('details');d.className='more';d.innerHTML='<summary>자세히</summary>';const at=mov[mov.length-1].nextSibling;mov.forEach(e=>d.appendChild(e));if(at&&at.parentNode===root)root.insertBefore(d,at);else root.appendChild(d);}}
  // 선택지: 긴 설명 칩은 숨긴다 (숫자·화살표·확률이 있는 칩은 남긴다)
  // 1.5: 선택지 설명·효과 칩은 자르거나 숨기지 않는다 (예전엔 긴 칩을 숨기고 48자 넘는 설명을 첫 문장만 남겼다)
}
// 자잘한 이벤트
const MINOR_RE=/^(추석 연휴|설 연휴|송년회|시무식|폭염|한파|동기의 결혼식|수능|사내 체육대회|송별회|건강검진|부서 회식|수습 동기 단톡방|편집국 순시 · 야식|창립기념일|봄 인사 이동철|장마)$/;
function minorOK(t,b,c){return S&&S.phase==='game'&&S.minorAuto!==false&&MINOR_RE.test(t||'')&&Array.isArray(c)&&c.filter(x=>x&&x.cls!=='ghost'&&!x.disabled).length>=2&&!String(b||'').includes('<input');}
function minorPick(c){const L=c.filter(x=>x&&x.cls!=='ghost'&&!x.disabled&&x.fn);let best=null,bv=-1e9;L.forEach((x,i)=>{const s=String(x.sub||'');let v=(s.match(/↑/g)||[]).length-(s.match(/↓/g)||[]).length*1.2-(x.risk?2:0)+(x.rec?3:0)-i*.05;if(/통장 -|체력 -|-\d/.test(s))v-=.5;
  // 성향: 체력이 바닥이면 쉬는 쪽, 동료 관계를 중시하면 함께하는 쪽
  if(S.hp<35&&/쉰|집|빠진|불참|일찍/.test(x.label))v+=2;if((S.traits||[]).includes('insider')&&/간다|끝까지|함께|참석/.test(x.label))v+=1;if((S.traits||[]).includes('lone')&&/빠진|불참|일찍/.test(x.label))v+=1;if(v>bv){bv=v;best=x;}});return best;}
function minorAuto(t,b,c){const x=minorPick(c);if(!x)return false;let r;const t0=mTok;try{r=x.fn();}catch(e){console.error(e);}if(mTok!==t0)return true;
  try{showCard(t,`${b||''}<p class="fx">알아서 했다 → ${esc(String(x.label).replace(/<[^>]+>/g,''))}</p><p class="hint">자잘한 일은 설정에서 직접 고르게 바꿀 수 있다</p>`,[{label:'확인'}]);}catch(e){}return true;}
{const _omS=openModal;openModal=function(t,b,c){try{if(minorOK(t,b,c)&&minorAuto(t,b,c))return;}catch(e){console.error(e);}const r=_omS.call(this,t,b,c);try{if(shortOn()&&!$('#modal').hidden)shortify(t);}catch(e){console.error(e);}try{if(window.__tipPend&&!$('#modal').hidden){const d=document.createElement('p');d.className='tipline';d.textContent='팁 · '+window.__tipPend;$('#mb').prepend(d);window.__tipPend=null;}}catch(e){}return r;};}
// 팁
function tipMode(){if(!S)return 'on';if(S.tipsOn===false)return 'off';if(S.tipsOn===true)return 'on';if(S.tipsOn==='toast')return 'toast';let vet=false;try{vet=(META&&META.runs&&META.runs.length>=1);}catch(e){}return S.smode==='quick'||vet?'toast':'on';}
function tipToast(id){if(tipMode()!=='toast'||!TIPS[id])return false;S.tipSeen=S.tipSeen||{};if(S.tipSeen[id])return false;S.tipSeen[id]=1;window.__tipPend=firstSent(TIPS[id]);setTimeout(()=>{if(window.__tipPend){try{toast(`팁 · ${window.__tipPend}`);}catch(e){}window.__tipPend=null;}},400);return true;}
function tipBody(t){const f=firstSent(t);const rest=String(t||'').slice(f.length).trim();return `<p class="lede">${f}</p>${rest?`<details class="more"><summary>자세히</summary><p>${rest}</p></details>`:''}`;}
function tipLbl(){return {off:'끔',on:'창으로',toast:'한 줄 알림'}[tipMode()];}
(function(){const st=document.createElement('style');st.textContent=`details.more{margin:6px 0 2px}details.more>summary{cursor:pointer;color:var(--mute,#9aa2bb);font-size:13px;list-style:none;padding:4px 0}details.more>summary::before{content:'＋ ';}details.more[open]>summary::before{content:'－ ';}details.more>summary::-webkit-details-marker{display:none}#mc .cp.cpx{display:none}.mis .misr>span{display:block!important}.misr>span .gl,.misr>span span.gl{display:inline!important;margin:0!important;padding:0!important}.tipline{font-size:13px;color:#ffcf86;background:rgba(255,184,77,.08);border:1px solid rgba(255,184,77,.25);border-radius:10px;padding:6px 10px;margin:0 0 8px}`;document.head.appendChild(st);})();