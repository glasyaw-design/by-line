/* 바이라인 1.6 — src/compat/v15.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */



// ===================== 1.3 진입장벽 · 다양성 =====================
// ---- (2) 지금 할 일 한 줄 ----
function nowHint(){if(!S||S.phase!=='game')return null;const ok=id=>rankActs().includes(id)&&!why(id);
  if(S.ap<=0)return {go:'week',t:'이번 달 행동력을 다 썼다',d:'다음 달로 넘기자'};
  if(S.breaking&&ok('breaking'))return {id:'breaking',d:'속보가 터졌다. 지금 잡아야 한다'};
  if(S.hp<28&&ok('rest'))return {id:'rest',d:`컨디션 ${Math.round(S.hp)} — 쓰러지기 전에 쉬자`};
  const due=(S.items||[]).find(i=>i.slot&&i.slot.due<=S.turn+4&&i.facts.some(fOK));if(due&&ok('write'))return {id:'write',d:`「${due.title.slice(0,18)}…」 지면 마감이 코앞이다`};
  const hot=(S.items||[]).find(i=>i.excl&&Math.ceil(i.heat/4)<=1);if(hot){if(hot.facts.filter(fOK).length>=2&&ok('write'))return {id:'write',d:`단독 「${hot.title.slice(0,16)}…」 — 이번 달 말까지 안 쓰면 뺏긴다`};if(ok('invest'))return {id:'invest',d:`단독 「${hot.title.slice(0,16)}…」 — 이번 달 말까지 확인을 끝내자`};}
  if(S.elect)return null;
  try{misEnsure();const M=S.mis;const m=M&&M.list.find(x=>!x.done);if(m){const ids=rankActs().filter(id=>ok(id)&&(id===m.k||(MIS_TAG[m.k]||[]).includes(id)));if(ids.length)return {id:ids[0],d:`이달의 미션 — ${m.t||m.n||'미션'}`};}}catch(e){}
  let r=null;try{r=recommend();}catch(e){}if(r&&ok(r))return {id:r,d:NOW_WHY[r]||ACT[r].d};
  const w=writable&&writable().find(i=>i.facts.filter(fOK).length>=3);if(w&&ok('write'))return {id:'write',d:'확인된 사실이 쌓인 아이템이 있다'};
  const find=['discover','beat','source','sasu','special','spx'].find(ok);if(find&&(S.items||[]).length<2)return {id:find,d:'아이템이 모자라다. 새 거리부터 찾자'};
  let rs=null;try{rs=recommendStat();}catch(e){}if(rs&&ok(rs))return {id:rs,d:NOW_WHY[rs]||ACT[rs].d};
  const any=['invest','write','pitch','beat','source','colleague','deptlife','network','rest'].find(ok);return any?{id:any,d:NOW_WHY[any]||ACT[any].d}:null;}
const NOW_WHY={sasu:'수습은 발로 뛴다. 경찰서를 돌며 단서를 모으자',report:'모은 단서를 캡에게 보고하자',pitch:'아침 발제로 지면을 잡자',invest:'아이템의 빈칸을 채우자',write:'확인된 사실로 기사를 내자',desk:'후배 초고가 쌓였다',meeting:'편집회의를 이끌 때다',front:'내일 자 1면을 정하자',discover:'새 아이템을 찾자',rest:'쉬어야 오래 간다'};
function nowLine(){try{const h=nowHint();if(!h)return '';if(h.go)return `<button class="nowbar" data-go="week"><i>지금 할 일</i><b>${h.t}</b><span>${esc(h.d)}</span></button>`;return `<button class="nowbar" data-act="${h.id}"><i>지금 할 일</i><b>${esc(actName(h.id))}</b><span>${esc(h.d)}</span></button>`;}catch(e){return '';}}
// ---- (3) 빠른 시작 ----
const QS_OPT=[{k:'r1',n:'3년 차 기자',d:'출입처를 가진 기자로 시작한다',pro:'수습 2년을 건너뛴다',con:'수습 시절 캡·동기와 쌓는 정이 없다',rank:1,yrs:2},{k:'r3',n:'10년 차 부장 (작은 회사는 팀장)',d:'부서와 팀을 이끄는 데스크로 시작한다',pro:'팀·제자·데스킹이 바로 열린다',con:'기자 시절 기록이 적다 · 부서 성적 압박이 바로 온다',rank:3,yrs:9},{k:'r5',n:'편집국장 선거를 앞둔 국장',d:'1년 안팎에 편집국장 자리가 빈다',pro:'선거·대주주·자매사 이야기로 바로 들어간다',con:'표를 줄 사람들과 아직 서먹하다 · 정년까지 15년 남짓',rank:5,yrs:18},{k:'r6',n:'갓 취임한 편집국장',d:'편집국 전체를 쥔다. 임기 2년',pro:'인사권·편집 방향·1면을 바로 쥔다',con:'사장 출마는 임기 2년을 마친 뒤 · 정년까지 10년 남짓',rank:6,yrs:22}];
const QS_PC=`<div class="qspc"><div><b class="g">좋은 점</b><ul><li>원하는 단계부터 바로</li><li>연차에 맞는 취재원·저축·제자·라이벌</li><li>엔딩·도감·기록은 그대로 남는다</li></ul></div><div><b class="r">아쉬운 점</b><ul><li>초년 시절 이야기·이정표·초반 업적이 없다</li><li>능력치는 연차 평균 · 관계는 보통 수준</li><li>유산·도전 과제를 못 고른다</li><li>정년까지 남은 시간이 짧다</li></ul></div></div>`;
function qsStart(){openModal('빠른 시작',`<p class="lede">어디서부터 시작할까.</p>${QS_PC}`,QS_OPT.map(q=>({label:q.n,sub:`${q.d} · 좋은 점 — ${q.pro} · 아쉬운 점 — ${q.con}`,fn:()=>{qsPick(q);return false;}})).concat([{label:'뒤로',cls:'ghost',fn:()=>{S.smode='exam';closeModal();render();return false;}}]));}
function qsPick(q){const L=shuffle(OUTLETS.filter(o=>!o.custom&&!o.closed&&!o.npc&&o.p>=2&&o.p<=4&&fitRank(q.rank,o)===q.rank)).slice(0,4);
  openModal(`${q.n} — 어느 회사에서?`,`<p class="hint">회사마다 대주주와 편집국장 뽑는 방식이 다르다.</p>`,L.map(o=>({label:o.n,sub:`${TYPES[o.type].n} · ★${o.p} · ${OWN_T[ownKey(o)].n} · 편집국장 ${SEL_N[OWN_T[ownKey(o)].s6]}`,fn:()=>{qsDept(q,o);return false;}})).concat([{label:'뒤로',cls:'ghost',fn:()=>{qsStart();return false;}}]));}
// 빠른 시작 부서 고르기: 3년 차·부장은 소속 부서, 국장·편집국장은 출신 부서(취재원·출입처 감·부서 이력)
function qsDepts(o){return o.depts.filter(d=>DEPTS[d]&&!(typeof SUPPORT!=='undefined'&&SUPPORT[d]));}
function qsDept(q,o){const L=qsDepts(o);if(L.length<=1)return qsGo(q,o,L[0]);const hi=q.rank>=5,aff=MAJORS[S.major]&&MAJORS[S.major].aff;
  openModal(`${q.n} — ${hi?'어느 부서 출신?':'어느 부서에서?'}`,`<p class="hint">${hi?'오래 몸담은 부서의 취재원과 출입처 감을 갖고 시작한다.':q.rank>=3?'이 부서의 부장으로 팀을 이끈다.':'이 부서 출입처를 맡는다.'}</p>`,L.map(d=>({label:DEPTS[d].n,rec:!!(aff&&catOf(d).includes(aff)),sub:aff&&catOf(d).includes(aff)?'전공과 잘 맞는다':'',fn:()=>{qsGo(q,o,d);return false;}})).concat([{label:'뒤로',cls:'ghost',fn:()=>{qsPick(q);return false;}}]));}
// 경력에 맞는 초기 상태: 취재원·아이템·저축·실적·출입처·사람
function qsSetup(q,o){const r=q.rank,y=q.yrs;const T={1:{src:3,it:2,sv:.16,arts:45,sc:1,beat:32,ev:60,fm:14,tr:52,rel:6},3:{src:5,it:2,sv:.2,arts:42,sc:5,beat:48,ev:promoEv(3)-2,fm:promoFm(3)-6,tr:56,rel:10},5:{src:6,it:1,sv:.22,arts:38,sc:9,beat:52,ev:promoEv(5)+1,fm:promoFm(5)+1,tr:58,rel:12},6:{src:7,it:1,sv:.24,arts:36,sc:11,beat:55,ev:64,fm:Math.max(promoFm(5)+4,58),tr:60,rel:12}}[r];
  for(let i=0;i<T.src;i++)addSource(i<2?S.dept:pick(o.depts),R(26,42)+r*3);
  S.items=[];for(let i=0;i<T.it;i++){const it=makeItem(S.dept,{noPos:1});const f=it.facts.find(x=>!x.key);if(f)fFill(f,'예전 취재');S.items.push(it);}
  S.money=Math.round(payOf(o)*y*12*T.sv/10)*10;S.totalArticles=y*T.arts;S.scoops=T.sc;if(r>=3)S.tokjong=Math.max(S.tokjong||0,1);if(r>=5)S.awards=Math.max(S.awards||0,1);if(r>=5)S.fwWins=Math.max(S.fwWins||0,3);
  S.beatM=Object.assign(S.beatM||{},{[S.dept]:T.beat});S.eval=T.ev;S.fame=T.fm;S.trust=T.tr;S.errT=[];S.errors=r>=3?1:0;
  (S.cols||[]).forEach(c=>c.rel=clamp((c.rel||0)+T.rel+R(-4,4),-50,100));deptPeople().forEach(m=>m.rel=clamp((m.rel??20)+T.rel,-50,100));
  S.deptHist=[...new Set([...(S.deptHist||[]),...shuffle(o.depts.filter(d=>DEPTS[d])).slice(0,r>=5?3:r>=3?2:0),S.dept])];
  if(r===1)S.inRank=YW*2;if(r===3)S.inRank=YW;if(r===5)S.inRank=promoMinW(5);
  if(r>=3&&deptPeople().length){const m=deptPeople().slice().sort((a,b)=>(b.rel??0)-(a.rel??0))[0];if(m){S.protege=m.name;m.rel=Math.max(m.rel??0,52);}}
  try{knowMore();if(r>=5)knowMore();}catch(e){}
  if(S.rival&&!S.rival.pub)S.rival.rk=Math.max(1,r-(chance(.5)?1:0));
  const st=seatEnsure();if(st){if(r===5)st.ed.end=S.turn+R(16,40);if(r===6){st.ed={n:S.name,me:1,end:S.turn+edTermW()};S.edEver=1;S.edTerms=1;S.edDone=0;const W=ownEnsure();if(W&&OWN_T[W.k].grp)W.rel=Math.max(W.rel,25);}}}
function qsGo(q,o,dp){const keep={name:S.name,major:S.major,spec:S.spec,diff:S.diff,traits:S.traits};
  devQuick({mode:'career',outlet:o.id,rank:q.rank,yrs:q.yrs,diff:keep.diff});S.dev=false;S.devUsed=0;S.smode='quick';Object.assign(S,{name:keep.name,major:keep.major,spec:keep.spec,diff:keep.diff||'normal'});if(keep.traits)S.traits=keep.traits;
  const b=bonusOf();for(const k in b)S.st[k]=clamp(S.st[k]+b[k],5,95);S.age0=26;S.ageT0=0;S.qsT=S.turn;
  if(dp&&dp!==S.dept&&o.depts.includes(dp)){S.dept=dp;S.deptT=S.turn;S.items=(S.items||[]).filter(i=>catOf(dp).includes(i.d));S.mates=null;S.ros=null;if(S.rank>=2)S.team=genTeam();if(S.rank>=4)S.area=AREAS[cat1(dp)];S.deptHist=(S.deptHist||[]).filter(x=>x!==dp);}
  qsSetup(q,o);
  Q.length=0;closeModal();render();saveGame();const st=seatEnsure();
  openModal(`${o.n} ${rankName(S.rank)}`,`<p class="lede">${esc(o.n)} ${rankName(S.rank)}, ${years()}년 차. ${q.rank===6&&st?`${rankName(6)} 임기는 ${dateStr(st.ed.end)}까지. 그때 연임 심사를 받는다.`:q.rank===5&&st?`${rankName(6)} ${esc(st.ed.n)}의 임기는 ${dateStr(st.ed.end)}까지다. 그 전에 사람을 모아 두자.`:q.rank===3?'부서원들이 새 부장을 지켜본다.':'출입처 기자실 자리가 하나 생겼다.'}</p><p class="hint">취재원 ${S.sources.length}명 · 아이템 ${S.items.length}개 · 통장 ${S.money.toLocaleString('ko-KR')}만 원${S.protege?` · 제자 ${esc(S.protege)}`:''}${S.rival?` · 라이벌 ${esc(S.rival.name)}`:''}</p><p class="hint">맨 위 「지금 할 일」이 다음에 할 일을 알려 준다.</p>`,[{label:'시작한다',rec:true,fn:()=>{if(!S.traits||!S.traits.length)setTimeout(()=>traitPick(()=>render()),40);}}]);}
// ---- (4) 용어 사전 ----
const GLOSS={'야마':'기사의 핵심 주제·결론','사쓰마와리':'수습기자가 경찰서를 돌며 사건을 챙기는 일','하리꼬미':'밤샘 잠복 취재','물먹':'다른 매체에 단독을 빼앗김','낙종':'남이 먼저 보도해 기사를 놓침','데스킹':'데스크가 기사를 고치는 일','데스크':'기사를 고치고 지면을 정하는 차장·부장','엠바고':'정해진 시각까지 보도를 미루기로 한 약속','오프더레코드':'보도하지 않는다는 전제로 한 말','우라까이':'남의 기사를 베껴 고쳐 쓰기','반론':'기사에 나온 쪽의 해명·입장','특종':'파급력이 큰 단독','대특종':'사회를 뒤흔든 특종','정정보도':'잘못된 기사를 바로잡는 보도','발제':'오늘 쓸 아이템을 데스크에 올리는 일','출입처':'기자가 맡아 드나드는 기관','바이라인':'기사에 붙는 기자 이름','임명동의':'대주주가 지명한 편집국장을 기자 투표로 승인하는 제도','직선제':'기자들이 편집국장을 직접 뽑는 제도','대주주':'회사 지분을 가장 많이 가진 쪽','계열사':'같은 대주주 아래 있는 회사','자매사':'같은 그룹에 속한 언론사','송고':'기사를 편집국에 보내는 일','하명':'윗선이 내려보내는 기사 지시','리드':'기사 첫 문단','캡':'사건팀을 이끄는 선임 기자','직무대행':'정식 임명 전까지 자리를 대신 맡는 사람','포털 제휴':'포털에 기사를 싣는 계약 등급'};
const GL_KEYS=Object.keys(GLOSS).sort((a,b)=>b.length-a.length);const GL_RE=new RegExp(GL_KEYS.join('|'));
function glossify(root){if(!root||!S||S.glOff)return;S.glSeen=S.glSeen||{};const done=new Set();const tw=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode:n=>{const p=n.parentElement;if(!p||p.closest('button,a,input,textarea,.gl,script,style'))return NodeFilter.FILTER_REJECT;return GL_RE.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_SKIP;}});const L=[];while(tw.nextNode())L.push(tw.currentNode);
  const RG=new RegExp(GL_KEYS.join('|'),'g');L.forEach(n0=>{let n=n0,guard=0;while(n&&guard++<12){RG.lastIndex=0;let m,hit=null;while((m=RG.exec(n.nodeValue))){const k=m[0];if(!done.has(k)&&(S.glSeen[k]||0)<6){hit=m;break;}}if(!hit)break;const k=hit[0];done.add(k);S.glSeen[k]=(S.glSeen[k]||0)+1;const a=n.splitText(hit.index);const rest=a.splitText(k.length);const sp=document.createElement('span');sp.className='gl';sp.title=GLOSS[k];sp.textContent=k;sp.onclick=e=>{e.stopPropagation();toast(`${k} — ${GLOSS[k]}`);};a.parentNode.replaceChild(sp,a);n=rest;}});}
// ---- (5) 끝나도 남는 것 ----
function giftFor(kind){const k=String(kind||'');const L=[];
  if(/권고사직|해고|해임|퇴사|퇴장|축출|파산|실패|중단|상실/.test(k))L.push({id:'grit',n:'바닥을 본 사람',d:'멘탈 +5 · 체력 +2',st:{men:5,sta:2}});
  else if(/정년|임기 만료/.test(k))L.push({id:'note',n:'선배의 수첩',d:'믿을 만한 취재원 1명 · 상식 +2',st:{kno:2},src:1});
  else L.push({id:'again',n:'다시 쓰는 첫 기사',d:'문장력 +2 · 취재력 +2',st:{wri:2,inv:2}});
  if(S.edEver)L.push({id:'ed',n:'편집국을 아는 사람',d:'리더십 +3',st:{lead:3}});
  if((S.awards||0)>=1)L.push({id:'aw',n:'기자상 액자',d:'업계 평판 +3',fame:3});
  if(S.founder&&(S.sis||[]).length)L.push({id:'biz',n:'회사를 차려 본 사람',d:'영업력 +3',st:{sal:3}});
  return L.slice(0,2);}
function giftApply(){const G=META&&META.gift;if(!G||!G.length)return;META.gift=null;metaSave();const hard=S.diff==='hard';G.forEach(g=>{for(const k in (g.st||{}))gain(k,(g.st[k])*(hard?.5:1));if(g.fame)S.fame=(S.fame||0)+g.fame*(hard?.5:1);if(g.src)addSource(S.dept,35);});log(`지난 판이 남긴 것: ${G.map(g=>g.n).join(' · ')}`);Q.push(()=>openModal('지난 판이 남긴 것',`<p class="lede">${G.map(g=>`<b>${esc(g.n)}</b> — ${esc(g.d)}`).join('<br>')}</p>${hard?'<p class="hint">어려움 난이도라 절반만 남았다.</p>':''}`,[{label:'확인'}]));}
function giftCard(){try{const G=META&&META.gift;if(!G||!G.length)return '';return `<div class="card" style="margin:10px 0"><div class="t">다음 판에 남는 것</div><div class="meta">${G.map(g=>`<span><b>${esc(g.n)}</b> · ${esc(g.d)}</span>`).join('')}</div></div>`;}catch(e){return '';}}
// ---- (6) 시대: 새 시대 3가지와 판 시작 때 연표 예고 ----
function eraX(){if(ERA_DEF.adwinter)return;Object.assign(ERA_DEF,{
 adwinter:{n:'광고 한파',g:'경제',d:'기업들이 광고비부터 줄였다. 영업이 버거워진다',ad:.86,biz:.9,co:'cost',imp:{eco:1.1},tip:'구독·후원 같은 직접 수입을 늘릴 때',desk:'광고국: 올해 목표를 하향 조정했다'},
 medialaw:{n:'언론 규제 정국',g:'미디어',d:'징벌적 손해배상 법안이 국회를 오간다. 소송 위험이 커지고 검증한 기사가 빛난다',tr:1.02,imp:{pol:1.2,court:1.2},tip:'반론과 교차 확인을 더 챙길 때',desk:'편집국: 법무 검토를 한 단계 더 거친다'},
 pressgate:{n:'언론계 스캔들',g:'미디어',d:'다른 언론사 간부들의 비리가 줄줄이 터졌다. 언론 전체의 신뢰가 흔들린다',tr:1.03,imp:{soc:1.1},tip:'깨끗한 기자가 돋보일 때',desk:''}});}
try{const _eg=eraGen;eraGen=function(){eraX();const E=_eg();const t0=S.turn,HM=12*40;[['adwinter',.55,R(8,16)],['medialaw',.45,R(10,20)],['pressgate',.4,R(4,9)]].forEach(([k,p,len])=>{if(chance(p)){const sm=R(18,HM-30);E.push({k,s:t0+sm*4,e:t0+(sm+len)*4,why:''});}});return E;};}catch(e){console.error(e);}
function eraMonthX(lines){try{eraX();}catch(e){}if(!S.eras)return;if(eraHas('pressgate')){const d=S.trust>=60?.12:-.15;S.trust=clamp(S.trust+d,0,100);}
  if(!S.eraPrev&&S.eraV===2&&S.turn<=16&&!S.story){S.eraPrev=1;const big=S.eras.filter(x=>!['olympic','worldcup','elect_gen','elect_local','contactless','reopen'].includes(x.k)&&ERA_DEF[x.k]);const seen=new Set();const L=shuffle(big).filter(x=>{if(seen.has(x.k))return false;seen.add(x.k);return true;}).slice(0,6);if(L.length>=3)Q.push(()=>openModal('이번 판의 시대',`<p class="lede">앞으로 10년, 이런 일들이 올 것 같다. 언제 올지, 정말 올지는 모른다.</p><div class="elchips">${L.map((x,i)=>`<i>${i<L.length-1?esc(ERA_DEF[x.k].n):'???'}</i>`).join('')}</div><p class="hint">시대가 바뀌면 잘 팔리는 기사, 광고, 회사 분위기가 통째로 바뀐다. 「매체·시대」 탭에서 지금 시대를 볼 수 있다.</p>`,[{label:'알겠다'}]));}}
// ---- (7) 라이벌 연대기: 같이 크고, 같은 회사로 오고, 같은 자리를 다툰다 ----
const RV_STY={fact:'safe',watch:'indep',gov:'own',gire:'digital',agit:'pay',voice:'scoop',poli:'own',hire:'own'};
function rivalYear(lines){const rv=S.rival;if(!rv||rv.pub||S.founder||S.story)return;if(rv.rk==null)rv.rk=Math.max(1,Math.min(S.rank,5));rv.hist=rv.hist||[];if(month()!==1||rv.yrT===S.turn)return;rv.yrT=S.turn;const ro=OUTLETS.find(o=>o.id===rv.outlet);if(!ro)return;
  if(rv.rk<6&&chance(.32+(rv.wins||0)*.03)){rv.rk++;rv.hist.push(`${dateStr()} ${rankName(rv.rk,ro)} 승진`);lines.push({c:rv.rk>S.rank?'r':'',t:`라이벌 ${rv.name}(${ro.n})이 ${jo2(rankName(rv.rk,ro),'이','가')} 됐다${rv.rk>S.rank?' — 나보다 한발 앞섰다':rv.rk===S.rank?' — 이제 같은 자리다':''}`});}
  if(rv.outlet!==S.outlet&&rv.rk>=3&&S.rank>=3&&chance(.08)&&TYPES[ro.type].g===TYPES[OUT().type].g){rv.outlet=S.outlet;rv.hist.push(`${dateStr()} ${jo2(OUT().n,'으로','로')} 이직`);lines.push({c:'r',t:`라이벌 ${jo2(rv.name,'이','가')} 우리 회사로 왔다. 이제 같은 편집국에서 부딪힌다`});try{const c=mkCol('rivalpeer',-5,rv.name);if(!(S.cols||[]).some(x=>x.name===rv.name))S.cols.push(c);}catch(e){}}}
function rivalAsCand(E){const rv=S.rival;if(!rv||rv.pub||S.founder)return false;if(rv.outlet!==S.outlet&&!(E.t>=6&&chance(.25)))return false;if((rv.rk||1)<E.t-2)return false;
  E.rv.name=rv.name;E.rv.sk=Math.max(E.rv.sk,Math.round(rv.skill||60)+4);if(rv.route&&RV_STY[rv.route.k])E.rv.sty=RV_STY[rv.route.k];if(['gov','poli','hire'].includes(rv.route&&rv.route.k))E.rv.ownRel+=10;E.rivalMatch=1;E.voters.forEach(v=>{if(v.role==='rivalpeer'||v.ref&&v.ref.name===rv.name)v.rr+=20;});return true;}
// ---- (8) 감 잡기 훈련: 녹취 편집 · 사진 고르기 · 제목 대결 ----
const DR_QUOTE=[{o:'"규정상 문제는 없습니다. 다만 도의적으로는 사과드려야 한다고 생각합니다."',ok:'"도의적으로는 사과드려야 한다"',bad:['"문제는 없습니다"','"사과드려야… 규정상 문제"'],why:'앞말만 자르면 뜻이 정반대가 된다'},
 {o:'"현재로선 확인된 바 없지만, 내부 조사는 시작했습니다."',ok:'"내부 조사는 시작했다"',bad:['"확인된 바 없다"','"조사 결과 확인됐다"'],why:'조사 착수와 사실 확인은 다르다'},
 {o:'"우리도 피해자입니다. 하청 관리가 부실했던 건 인정합니다."',ok:'"하청 관리 부실은 인정한다"',bad:['"우리도 피해자"','"부실은 없었다"'],why:'인정한 부분을 빼면 반론이 왜곡된다'},
 {o:'"올해 안엔 어렵고, 내년 상반기를 목표로 합니다."',ok:'"내년 상반기 목표"',bad:['"올해 안에 한다"','"계획 없다"'],why:'시점을 바꾸면 오보다'}];
const DR_PHOTO=[['현장 전체와 구조대가 함께 담긴 사진',1,'상황을 정확히 보여 준다'],['울고 있는 유족 얼굴을 크게 잡은 사진',-1,'조회수는 오르지만 2차 가해 논란'],['전날 다른 현장에서 찍은 비슷한 사진',-2,'다른 현장 사진은 조작이다'],['흔들려서 알아보기 힘든 사진',0,'안전하지만 아무도 안 본다']];
function drTitles(it){const t=it.title.replace(/^\[[^\]]+\]\s*/,'');const s=t.split(/[,…·]/)[0];return [[t,1,'사실과 맞고 핵심이 보인다'],[`충격! ${s}…결국 이렇게 됐다`,-1,'낚시성 제목 — 포털 벌점 위험'],[`${s} 관련 사안 논란`,0,'틀리진 않지만 아무것도 말하지 않는다'],[`${s} 사실로 확인`,-2,'확인되지 않은 걸 확정했다']];}
function drPlay(title,lede,opts,stat){const sec=12;let done=false;const fin=(v,why)=>{if(done)return;done=true;const sc=v>0?1:v===0?.1:-.6;const t=mgPay(sc);if(v>0)gain(stat,.6);S.drN=(S.drN||0)+1;mgFin(v>0?'정답':v===0?'무난':'틀렸다',`<p class="lede">${esc(why)}</p>${fxLine(t)}`);};
  mgOpen(title,`<p class="lede">${lede}</p>${mgBar('dr',sec)}`,shuffle(opts).map(o=>({label:o[0],fn:()=>{fin(o[1],o[2]);return false;}})));mgRun(sec,l=>mgBarSet('dr',l,sec),()=>{if(!done){done=true;apply({eval:-.2});mgFin('시간 초과',`<p class="lede">데스크가 기다리다 직접 골랐다. (평가 -0.2)</p>`);}});}
RUN.drill=function(){spend(1,2);setCd('drill');const tv=isTV();const g=tv?'photo':pick(['quote','title','title','photo']);
  if(g==='quote'){const q=pick(DR_QUOTE);drPlay('녹취 편집',`인터뷰 녹취: ${esc(q.o)}<br>기사에 넣을 인용을 골라라.`,[[q.ok,1,'맥락을 지켰다'],[q.bad[0],-2,q.why],[q.bad[1],-1,q.why]],'int');}
  else if(g==='photo'){drPlay(tv?'그림 고르기':'사진 고르기','사고 현장 기사에 붙일 사진을 골라라.',DR_PHOTO.slice(),tv?'brd':'ver');}
  else{const it=(S.items||[]).find(i=>!i.pos)||makeItem(S.dept,{noPos:1});drPlay('제목 대결',`데스크: "${esc(it.title.slice(0,30))}… 제목 뽑아 봐. 12초."`,drTitles(it),'hed');}};
// ---- (9) 도전 과제 추가 ----
try{CHAL.push(
 {id:'clean_ed',n:'무결점 편집국장',d:'오보 0건으로 편집국장에 오른다',ok:()=>!S.errors&&!!S.edEver&&!S.founder},
 {id:'rebel',n:'대주주에 맞선 사장',d:'대주주 계열사 기사를 세 번 이상 그대로 쓰고도 사장에 오른다',ok:()=>S.rank>=7&&!S.founder&&(S.ownHitTot||0)>=3},
 {id:'mgroup',n:'5년 만의 미디어그룹',d:'창간 5년 안에 그룹 체제를 출범한다',ok:()=>!!(S.founder&&S.chair&&(S.chairT-(S.fStart||0))<=YW*5)},
 {id:'direct',n:'기자들이 뽑은 국장',d:'기자 직선제로 편집국장에 오른다',ok:()=>!!S.elDirectWin},
 {id:'comeback',n:'다시 일어선 국장',d:'편집국장 연임에 실패한 뒤 사장에 오른다',ok:()=>!!S.edFail&&S.rank>=7&&!S.founder},
 {id:'rivalwin',n:'오랜 라이벌을 꺾다',d:'편집국장·사장 선거에서 라이벌을 이긴다',ok:()=>!!S.rivalBeat});}catch(e){console.error(e);}
// ---- (10) 같은 이벤트도 다르게 읽히게 ----
const EV_SYS=/결산|승진|인사|선출|선거|업적|튜토리얼|처음 해 보는|새로 열린|기사 쓰기|취재|발제|데스킹|편집국 복귀|결과|맡긴|단계|야마|제목|리드|반론|선택|확인|이달|연간|도움말|메뉴|설정|저장|불러|조직|수첩|도감|정기|훈련|정답|틀렸|무난|시간 초과|빠른 시작|지금|시대|성격|유산|도전|창간|계열사·|누구를|어떤 공약|공약|아이템|회사$|사설|논설|하명|판매 전략|처리했다|삭제 요청|하리꼬미|뻗치기|허탕|부서에|어느 부서|외부 필진|대주주의 증자|ABC/;
const EV_PRE={sp:['벚꽃이 지기 시작한 오후.','황사로 하늘이 누런 날.','새 학기 첫 주였다.'],su:['장맛비가 창을 두드리는 아침.','에어컨이 고장 난 편집국.','열대야가 이어지던 밤.'],au:['은행잎이 쌓인 출근길.','국정감사로 다들 예민한 주였다.','해가 부쩍 짧아졌다.'],wi:['첫눈이 온 날.','연말 송년회 시즌이었다.','손이 곱는 새벽 출입처.'],any:['마감 10분 전.','점심을 거른 채였다.','월요일 아침 회의가 막 끝났다.','금요일 저녁, 다들 퇴근을 서두를 때.'],again:['익숙한 장면이다.','또 이 일이다. 그런데 이번엔 사정이 조금 다르다.','전에도 겪어 본 일이지만, 상대가 다르다.']};
function evVary(t,b){if(!S||S.phase!=='game'||typeof b!=='string')return b;S.seenT=S.seenT||{};const n=(S.seenT[t]=(S.seenT[t]||0)+1);if(n<2||EV_SYS.test(String(t))||!/^\s*<p class="lede">/.test(b))return b;
  const m=month();const se=m>=3&&m<=5?'sp':m>=6&&m<=8?'su':m>=9&&m<=11?'au':'wi';const pre=n>=3&&chance(.5)?pick(EV_PRE.again):chance(.5)?pick(EV_PRE[se]):pick(EV_PRE.any);return b.replace(/^(\s*<p class="lede">)/,`$1${pre} `);}
try{const _om0=openModal;openModal=function(t,b,c){try{b=evVary(t,b);}catch(e){}const r=_om0.call(this,t,b,c);try{if(!$('#modal').hidden)glossify($('#mb'));else{const cd=document.querySelector('#cards .rcard');if(cd)glossify(cd);}}catch(e){}return r;};}catch(e){console.error(e);}
// ---- 행동 등록 · 스타일 ----
try{ACT.drill={n:'감 잡기 훈련',ap:1,sc:'newsroom',cd:4,d:'녹취 편집·사진 고르기·제목 대결 중 하나. 12초 안에 고른다'};[0,1,2,3].forEach(r=>{if(!RANK_ACTS[r].includes('drill'))RANK_ACTS[r].splice(Math.max(0,RANK_ACTS[r].length-2),0,'drill');});ACT_IC.drill='bolt';ACT_STAT.drill='hed';TIPS.drill='짧은 손맛 훈련. 맞히면 능력치와 평가가 오른다. 한 달에 한 번.';}catch(e){console.error(e);}
try{const st=document.createElement('style');st.textContent='.nowbar{display:grid;grid-template-columns:auto 1fr;gap:2px 10px;align-items:center;width:100%;text-align:left;margin:0 0 10px;padding:10px 14px;border-radius:14px;border:1px solid color-mix(in srgb,var(--sodium) 55%,var(--line));background:linear-gradient(135deg,color-mix(in srgb,var(--sodium) 16%,transparent),transparent 70%),var(--panel2);color:var(--fg);cursor:pointer}.nowbar i{grid-row:1/3;font-style:normal;font-size:11px;font-weight:800;color:#1a1206;background:var(--sodium);border-radius:8px;padding:3px 7px}.nowbar b{font-size:15px}.nowbar span{font-size:12.5px;color:var(--mute)}.qspc{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin:6px 0 10px}.qspc>div{background:var(--panel2);border:1px solid var(--line);border-radius:12px;padding:8px 10px}.qspc b{font-size:13px}.qspc b.g{color:var(--good)}.qspc b.r{color:var(--red)}.qspc ul{margin:4px 0 0;padding-left:16px;font-size:12.5px;line-height:1.5;color:var(--mute)}@media (max-width:520px){.qspc{grid-template-columns:1fr}}.gl{border-bottom:1px dotted var(--sodium);cursor:help}';document.head.appendChild(st);}catch(e){}
// ---- 할 일 화면 배치: 추천·미션 배지는 카드 모서리로, 미션 줄은 눌러서 바로 ----
function actBdg(id,isRec){const m=(()=>{try{return !!misTag(id);}catch(e){return false;}})();if(!m&&!isRec)return '';return `<span class="bdgs">${m?'<i class="b-mis">미션</i>':''}${isRec?'<i class="b-rec">추천</i>':''}</span>`;}
function misActAttr(x){try{if(x.done)return '';const ok=id=>rankActs().includes(id)&&!why(id);const L=[x.k].concat(MIS_TAG[x.k]||[]).filter(id=>ACT[id]&&ok(id));return L.length?` data-act="${L[0]}" title="눌러서 ${esc(actName(L[0]))}"`:'';}catch(e){return '';}}
try{const st=document.createElement('style');st.textContent=`
.act{position:relative;overflow:visible}
.act.rec .an::before{display:none!important;content:none!important}
.act.hasic.rec .atg::before,.act.rec .atg::before{display:none!important;content:none!important}
.act .atg .mtag{display:none!important}
.act .bdgs{position:absolute;top:-9px;right:10px;display:flex;gap:4px;z-index:2;pointer-events:none}
.act .bdgs i{font-style:normal;font-size:11px;font-weight:800;line-height:1;padding:4px 8px;border-radius:999px;white-space:nowrap;box-shadow:0 2px 8px rgba(0,0,0,.35)}
.act .bdgs .b-rec{background:var(--sodium);color:#2a1a05}
.act .bdgs .b-mis{background:var(--panel);color:var(--sodium);border:1px solid var(--sodium)}
.acts{row-gap:16px!important;padding-top:8px}
.mis{padding:10px 12px!important}
.mis .misr{grid-template-columns:18px minmax(0,1fr) auto!important;padding:5px 6px!important;border-radius:10px;align-items:center}
.mis .misr span{display:flex;flex-direction:column;min-width:0;line-height:1.35}
.mis .misr span small{display:block;font-size:11.5px;color:var(--mute);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mis .misr em{font-size:11.5px!important;padding:2px 8px;border-radius:999px;background:var(--panel3);white-space:nowrap}
.mis .misr[data-act]{cursor:pointer}
.mis .misr[data-act]:hover{background:color-mix(in srgb,var(--sodium) 10%,transparent)}
.mis .misr[data-act] em::after{content:' ›';color:var(--sodium)}
`;document.head.appendChild(st);}catch(e){}