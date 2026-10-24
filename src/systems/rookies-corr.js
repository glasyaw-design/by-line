/* 바이라인 1.6 — src/systems/rookies-corr.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */

// ===== 수습 기간과 수습 평가 기준 (매체 규모·성격별) =====
// 기간: ★1~2 3개월 · ★3~4 4개월 · ★5 6개월. 기준: 큰 곳일수록 평가 문턱이 높고, 매체 성격마다 보는 게 다르다.
function rookieWeeks(o){o=o||OUT();const w=o.p>=5?24:o.p>=3?16:12;return S&&S.simple?Math.max(8,w-(o.p>=5?8:4)):w;}
function rookieEv(o){o=o||OUT();return Math.round(({1:40,2:42,3:45,4:48,5:52}[o.p]||45)+(DF().need||0)/2);}
function reqOpen(ids){return ids.some(id=>{const w=lockReason(id);return !w||/아이템/.test(w);});}
function rookieReqs(o){o=o||OUT();if(S.story)return [];const mo=rookieWeeks(o)/4;const L=[{t:`수습 평가 ${Math.round(S.eval)}/${rookieEv(o)}`,ok:S.eval>=rookieEv(o)}];
  const rep=Math.max(2,Math.round(mo*(o.p>=4?1.4:1.1)*(S.simple?.7:1)));L.push({t:`정보보고 ${S.rkRep||0}/${rep}회`,ok:(S.rkRep||0)>=rep});
  const T=o.type;
  if(['daily','econ','local','weekly'].includes(T)){const n=Math.max(2,Math.round(mo*1.3*(S.simple?.7:1)));L.push({t:`${sasuN()} ${S.rkSasu||0}/${n}회`,ok:(S.rkSasu||0)>=n});}
  if(T==='wire')L.push({t:`속도 ${Math.round(S.st.spd)}/36 (통신사는 1보가 생명 · 정보보고·현장 돌기로 는다)`,ok:S.st.spd>=36});
  if(['tv','jp','ch'].includes(T))L.push({t:`방송감 ${Math.round(S.st.brd)}/26 (정보보고·현장 스탠딩 연습으로 는다)`,ok:S.st.brd>=26});
  if(T==='online'&&reqOpen(['write']))L.push({t:`출고 기사 ${S.totalArticles||0}/2건`,ok:(S.totalArticles||0)>=2});
  if(['sports'].includes(T)){const n=Math.max(2,Math.round(mo*1.3));L.push({t:`${sasuN()} ${S.rkSasu||0}/${n}회`,ok:(S.rkSasu||0)>=n});}
  if(o.p>=4&&!S.simple&&reqOpen(['colleague','drink'])){const cp=colBy('cap');L.push({t:`캡과의 관계 ${cp?Math.round(cp.rel):0}/25`,ok:!!cp&&cp.rel>=25});}
  if(o.p>=5&&!S.simple)L.push({t:`캡 미션 달성 ${S.rkMiss||0}/2달`,ok:(S.rkMiss||0)>=2});
  return S.simple?L.slice(0,2):L;}
// ===== 수습 건너뛰기 =====
// 남은 수습 기간을 자동으로 보낸다. 직접 할 때보다 능력치·취재원·캡 관계·돈이 조금 덜 쌓인다.
function rookieSkipOK(){return S.phase==='game'&&S.rank===0&&!S.story&&!S.founder;}
function skipRookie(){if(!rookieSkipOK())return;const left=Math.max(0,rookieWeeks()-S.inRank);
  openModal('수습 건너뛰기',`<p class="lede">남은 수습 ${jo2(moTxt(left),'을','를')} 자동으로 보내고 바로 정식 기자로 발령받는다.</p><div class="deal"><div class="dp"><b>좋은 점</b><ul><li>바로 본게임 시작</li><li>수습 평가는 기준선으로 통과</li></ul></div><div class="dc"><b>아쉬운 점</b><ul><li>능력치가 직접 할 때보다 덜 오른다</li><li>취재원 2명만 얻는다 (신뢰 낮음)</li><li>캡·동기와의 관계가 덜 쌓인다</li><li>정보보고 수당·평가 보너스 없음</li></ul></div></div>`,[
   {label:'건너뛴다',fn:()=>{const st0={...S.st};const m0=S.money;let g=0;while(S.rank===0&&(S.inRank<rookieWeeks()-1||S.turn%4!==0)&&g++<52&&S.phase==='game'){S.ap=0;endWeekQuiet();}
     // 직접 했을 때의 절반쯤만 남긴다
     for(const k in S.st){const d=S.st[k]-st0[k];if(d>0)S.st[k]=st0[k]+d*.6;}
     ['inv','net','sta','kno'].forEach(k=>gain(k,.6));
     for(let i=0;i<2;i++){const sc=addSource(S.dept,R(8,15));}
     const cp=colBy('cap');if(cp)cp.rel=Math.min(cp.rel,20);
     S.eval=Math.max(S.eval,rookieEv())-1;S.memo=0;S.rkSkip=1;S.items=[];
     S.inRank=rookieWeeks();log('수습 기간을 건너뛰었다');Q.length=0;$('#modal').hidden=true;mTok++;graduate();
     // 수습 때 쓰던 것들을 비우고 정식 기자로 새 달을 시작한다 (이달의 미션·캡 미션·수습 연장 횟수·행동력)
     S.mission=null;S.rkExt=0;S.memo=0;S.mis=null;S.mAct={};S.mWin={};S.cd={};if(S.flags)S.flags.bait=0;S.ap=apBase();S.hp=Math.max(S.hp,80);try{misEnsure();}catch(e){}render();saveGame();return false;}},
   {label:'직접 한다',cls:'ghost'}]);}
// ===== 선택지 읽기 쉽게: 설명(sub)을 효과 칩으로 쪼갠다 =====
const BAD_RE=/↓|위험|벌점|들키|논란|소송|반발|사표|이탈|비용|손해|불이익|깎|감소|줄어|낮아|-\d|−|적발|징계|체불|무너|흔들|부담|압박|떨어/;
const GOOD_RE=/↑|\+\d|늘|성장|회복|오른|높아|좋아|추천|확보|얻|보너스|안전/;
function subChips(sub){if(!sub)return '';const t=String(sub);if(/[<>]/.test(t))return `<span class="cs">${t}</span>`;
  const parts=t.split(/\s+·\s+|,\s+/).map(x=>x.trim()).filter(Boolean);if(parts.length<=1&&t.length>34)return `<span class="cs">${t}</span>`;
  return `<span class="chips">${parts.map(x=>{const neg=/(위험|비용|부담|소모|피로|벌점|리스크|오보|인건비|손실|경계)[^·]*/;let bad=BAD_RE.test(x),good=GOOD_RE.test(x);if(neg.test(x)&&/↓/.test(x)){good=true;bad=false;}else if(neg.test(x)&&/↑/.test(x)){bad=true;good=false;}if(/(대응|방어|보호|정확)↑/.test(x)){good=true;bad=false;}if(/^＋/.test(x)){good=true;bad=false;}else if(/^－/.test(x)){bad=true;good=false;}const pc=/성공|가능성|확률|%/.test(x)&&!bad;return `<i class="cp ${bad&&!good?'bad':good&&!bad?'good':pc?'pct':bad&&good?'mix':''}">${x}</i>`;}).join('')}</span>`;}
// ===== 수습기자: 사회부에 수습이 온다 · 채용 때 수습을 뽑는다 =====
const RK_PROS=['인건비가 경력보다 훨씬 싸다 (수습 기간 동안 월 인건비 약 40% 할인)','처음부터 우리 회사 방식으로 키운다 — 3년간 이직이 드물다','주니어라 빨리 큰다 (고참이 있으면 더 빨리)'];
const RK_CONS=['실력이 낮다 (20~36) · 수습 기간엔 전력 외','선배들 시간이 든다 — 데스크(차장·부장) 컨디션이 매달 조금 깎인다','실수가 잦다 — 부서원 기사 오류가 늘 수 있다'];
function rkDealHTML(){return `<div class="deal"><div class="dp"><b>수습을 뽑으면 좋은 점</b><ul>${RK_PROS.map(x=>`<li>${x}</li>`).join('')}</ul></div><div class="dc"><b>아쉬운 점</b><ul>${RK_CONS.map(x=>`<li>${x}</li>`).join('')}</ul></div></div>`;}
function rkActive(){return (S.team||[]).filter(m=>m.rk!=null);}
// 매달: 수습 졸업, 인건비 할인, 데스크 부담
function rkMonth(lines){const L=rkActive();if(!L.length)return;const wk=rookieWeeks();
  L.forEach(m=>{if(S.turn-m.rk>=wk){const pf=clamp(.22-(m.skill-20)/90+(m.flaw?.08:0),.04,.3)*(DF()===DIFF.hard?1.3:DF()===DIFF.easy?.7:1);if(!m.rkExt&&chance(pf*.6)){m.rkExt=1;m.rk=S.turn-wk+4;lines.push({c:'',t:`${m.name} 수습은 평가가 모자라 수습이 한 달 연장됐다`});return;}if(chance(pf)){S.team=S.team.filter(x=>x!==m);if(S.co)S.co.staff=Math.max(1,S.co.staff-1);const why=pick(['수습 평가에서 떨어졌다','"기자는 나랑 안 맞는다"며 수습을 포기했다','다른 회사 공채에 붙어 떠났다','잦은 실수로 수습 탈락 판정을 받았다']);lines.push({c:'r',t:`${m.name} 수습이 ${why}`});log(`${m.name} 수습 탈락`);return;}delete m.rk;m.own=S.turn;m.yrs=1;m.t0=S.turn;m._fy=null;const o=OUT();const cnt=d=>(S.team||[]).filter(x=>x.d===d).length;const pool=o.depts.filter(d=>!isRegD(d));const need=(S.rank>=6||S.founder)?pool.slice().sort((a,b)=>cnt(a)-cnt(b))[0]:pick(pool);const moved=need&&need!==m.d&&chance(.5);if(moved)m.d=need;
      if(moved&&!S.founder&&S.rank>=2&&S.rank<=5&&m.d!==S.dept){S.team=S.team.filter(x=>x!==m);(S.alumni=S.alumni||[]).push({name:m.name,d:m.d,rel:10,t:S.turn});}
      lines.push({c:'g',t:`${m.name} 수습이 정식 기자로 발령됐다 — ${DEPTS[m.d]?DEPTS[m.d].n:''} 배치 (실력 ${Math.round(m.skill)})`});log(`${m.name} 수습 → ${DEPTS[m.d]?DEPTS[m.d].n:''}`);}});
  const n=rkActive().length;if(n&&S.co){S.co.extra=+((S.co.extra||0)-.09*.4*n).toFixed(3);}
  if(n&&!S.founder&&S.rank>=2&&S.rank<=3)S.hp=clamp(S.hp-1.5*Math.min(3,n),0,100);}
// 사회부 계열: 회사 공채 수습이 우리 부서로 온다 (평기자~부장)
function traineeEvent(){const nm=rname();const st=pick(['집요함','눈치','글솜씨','체력','배짱']);
  openModal('수습기자가 왔다',`<p class="lede">이번 공채 수습 ${jo2(esc(nm),'이','가')} 우리 부서로 배치됐다. 강점은 「${st}」. ${S.rank>=2?'부서장으로서':'선배로서'} 어떻게 할까?</p><p class="hint">수습은 ${rookieWeeks()/4}개월 동안 경찰서를 돌며 정보보고를 올린다. 최종 평가에서 열에 넷은 떨어진다 — 직접 가르치면 덜 떨어지고, 혹독하게 굴리면 더 떨어진다.</p>`,[
   {label:'사수를 맡아 직접 가르친다',rec:true,sub:'매달 컨디션↓ · 정보보고 거리↑ · 탈락 확률 약 32% · 끝나면 든든한 후배',fn:()=>{S.trainee={name:nm,t:S.turn,mode:'teach',rel:30};toast(`${nm} 수습의 사수가 됐다`);}},
   {label:'기본만 챙겨 준다',sub:'부담 없음 · 관계는 무난 · 탈락 확률 약 40%',fn:()=>{S.trainee={name:nm,t:S.turn,mode:'basic',rel:10};toast('기본만 챙기기로 했다');}},
   {label:'혹독하게 굴린다',risk:true,sub:'평가 조금↑ · 탈락 확률 약 50% · 독하게 크거나, 버티지 못하고 떠난다',fn:()=>{S.trainee={name:nm,t:S.turn,mode:'hard',rel:-5};toast(apply({eval:.5}));}}]);}
function traineeMonth(lines){const T=S.trainee;if(!T)return;const age=S.turn-T.t;
  if(T.mode==='teach'){S.memo=(S.memo||0)+1;S.hp=clamp(S.hp-(S.simple?2:4),0,100);T.rel+=3;if(!S.simple&&chance(.25))lines.push({c:'',t:`${T.name} 수습이 새벽 3시에 라인 보고를 올렸다. "선배, 이거 기사 될까요?"`});}
  if(T.mode==='hard'&&chance(.12)){lines.push({c:'r',t:`${T.name} 수습이 "도저히 못 하겠다"며 사표를 냈다`});apply({eval:-1});S.trainee=null;return;}
  if(T.mode!=='basic'&&chance(.08)){lines.push({c:'r',t:`${T.name} 수습이 확인 안 된 첩보를 그대로 보고했다. 캡에게 같이 깨졌다`});apply({eval:-.4});}
  if(age>=rookieWeeks()){S.trainee=null;const pf=clamp(.4+({teach:-.08,basic:0,hard:.1}[T.mode]||0)+(DF()===DIFF.hard?.05:DF()===DIFF.easy?-.05:0)-(S.simple?.1:0),.15,.6);if(chance(pf))Q.push(()=>traineeFail(T));else Q.push(()=>traineePlace(T));}}
// 수습 평가에서 떨어질 때: 사수라면 보증을 서 볼 수 있다
function traineeFail(T){openModal('수습 탈락 위기',`<p class="lede">${esc(T.name)} 수습이 최종 평가에서 기준에 못 미쳤다. 인사위원회가 탈락 쪽으로 기울고 있다.</p>`,[
   ...(T.mode==='teach'?[{label:'사수로서 보증을 선다',sub:'성공하면 정식 배치 · 실패하면 내 평가↓',fn:()=>{if(chance(.6+T.rel/250)){toast('보증이 받아들여졌다');traineePlace(T);return false;}toast(`보증에도 탈락했다 · ${apply({eval:-1})}`);log(`${T.name} 수습 탈락`);}}]:[]),
   {label:'한 달 더 기회를 달라고 한다',sub:'연장 · 다시 평가',fn:()=>{T.t=S.turn-rookieWeeks()+4;T.rel+=2;S.trainee=T;toast('수습이 한 달 연장됐다');}},
   {label:'결과를 받아들인다',sub:'수습이 떠난다',fn:()=>{log(`${T.name} 수습 탈락`);toast(`${T.name} 수습이 회사를 떠났다`);}}]);}
// 수습이 끝나면 배치: 회사 수요·본인 희망·사수와의 관계로 정해진다
function traineePlace(T){const o=OUT();const others=o.depts.filter(d=>d!==S.dept&&!isRegD(d));const want=pick(others.length?others:o.depts);
  const pStay=clamp(.25+T.rel/150+(S.rank>=3?.2:S.rank>=2?.1:0)+(T.mode==='teach'?.15:0),.1,.85);
  const mk=d=>{const m=genMember(d,T.mode==='hard'?30:26,T.mode==='teach'?44:38);m.yrs=1;m.t0=S.turn;m.own=S.turn;m.rel=T.rel;m.name=T.name;return m;};
  const stay=()=>{const m=mk(S.dept);if(S.rank>=2){S.team.push(m);S.co.staff++;}else{S.mates=S.mates||[];m.role='기자';S.mates.push(m);}if(T.mode==='teach'&&S.rank>=2&&!S.protege)S.protege=T.name;if(T.mode==='teach')apply({eval:1,cha:.5});log(`${T.name} 수습 → 우리 부서 배치`);};
  const away=(d,happy)=>{(S.alumni=S.alumni||[]).push({name:T.name,d,rel:T.rel+(happy?15:0),t:S.turn});if(T.mode==='teach')apply({cha:.5});log(`${T.name} 수습 → ${DEPTS[d].n} 배치`);};
  openModal('수습 배치',`<p class="lede">${esc(T.name)} 수습의 정식 배치가 다가왔다. 본인은 <b>${DEPTS[want].n}</b>를 희망한다.</p><p class="hint">수습은 끝나면 회사 사정과 본인 희망에 따라 여러 부서로 흩어진다. 다른 부서로 가도 가르친 후배는 그 부서 소식을 물어다 준다.</p>`,[
   {label:'우리 부서로 데려오고 싶다고 요청한다',sub:`받아들여질 가능성 ${pStay>=.6?'높음':pStay>=.35?'반반':'낮음'} · 실패하면 관계 조금↓`,fn:()=>{if(chance(pStay)){stay();toast(`${jo2(T.name,'이','가')} 우리 부서에 남게 됐다`);}else{T.rel-=8;away(want,false);toast(`인사팀이 ${jo2(DEPTS[want].n,'으로','로')} 보냈다`);}}},
   {label:'본인 희망대로 가라고 밀어준다',rec:true,sub:`${DEPTS[want].n} 배치 · 관계↑ · 그 부서 소식통이 생긴다`,fn:()=>{away(want,true);toast(`${T.name}, ${jo2(DEPTS[want].n,'으로','로')} 간다`);}},
   {label:'인사팀에 맡긴다',sub:'회사 수요대로',fn:()=>{const d=chance(.3)?S.dept:pick(others.length?others:o.depts);if(d===S.dept){stay();toast(`${jo2(T.name,'이','가')} 우리 부서로 왔다`);}else{away(d,false);toast(`${T.name}, ${DEPTS[d].n} 배치`);}}}]);}
// 다른 부서로 간 후배들: 가끔 그 부서 아이템이나 소식을 귀띔한다
function alumniMonth(lines){const A=S.alumni||[];if(!A.length)return;A.forEach(a=>{if(a.rel>=20&&chance(.05)&&S.items.length<6){const it=makeItem(a.d,{mult:.9});it.from=a.name;S.items.push(it);lines.push({c:'g',t:`${jo2(DEPTS[a.d]?DEPTS[a.d].n:'다른 부서','으로','로')} 간 후배 ${jo2(a.name,'이','가')} 「${it.title}」${jp(it.title,'을','를')} 귀띔했다`});}});if(A.length>8)A.shift();}
// 1월·7월 공채 시즌에 '나올 수도' 있다 (확정 아님, 약 50%)
function traineeTick(Qx){if(S.founder||S.story||S.rank<1||S.rank>3||S.trainee||cat1(S.dept)!=='soc'||![1,7].includes(month())||(S.trT||-999)>=S.turn-YW/3)return;S.trT=S.turn;if(chance(.5))Qx.push(()=>traineeEvent());}
// ===== 인력 수급 균형: 수습이 늘면 그만큼 빠져나간다 =====
// 부서 정원보다 사람이 많으면 다른 부서 발령·이직·퇴사가 늘고, 경쟁사도 북적이는 곳을 노린다
function staffBalance(lines){if(S.founder||S.story)return;const T=S.team||[];
  if(S.rank>=2&&S.rank<=5&&T.length){const cap=teamSize()+2;const over=T.length-cap;if(over>0&&chance(clamp(.22*over,0,.8))){
    const L=T.filter(m=>m.rk==null&&m.name!==S.protege).sort((a,b)=>((a.rel??20)+(npcStage(a)==='vet'?30:0))-((b.rel??20)+(npcStage(b)==='vet'?30:0)));const m=L[0];if(m){S.team=S.team.filter(x=>x!==m);
      const r=Math.random();if(r<.55){const d=pick(OUT().depts.filter(x=>x!==S.dept&&!isRegD(x)))||S.dept;lines.push({c:'',t:`부서가 붐빈다. ${m.name} 기자(${myrs(m)}년 차)가 ${jo2(DEPTS[d].n,'으로','로')} 발령됐다`});}
      else if(r<.85){if(S.co)S.co.staff=Math.max(1,S.co.staff-1);const c=S.comp&&S.comp.length?pick(S.comp):null;lines.push({c:'r',t:`자리가 없다며 ${m.name} 기자가 ${jo2(c?cName(c):'다른 매체','으로','로')} 이직했다`});if(c)c.q+=.5;}
      else{if(S.co)S.co.staff=Math.max(1,S.co.staff-1);lines.push({c:'r',t:`${m.name} 기자가 ${ro2(pick(['기업 홍보실','로스쿨','공공기관','유튜브 채널']))} 진로를 바꿨다`});}}}}
  if(S.rank<=1&&(S.mates||[]).length>9){const m=S.mates.filter(x=>x.name!==S.name).sort((a,b)=>(a.rel??20)-(b.rel??20))[0];if(m){S.mates=S.mates.filter(x=>x!==m);lines.push({c:'',t:`${m.name} 선배가 다른 부서로 옮겼다`});}}
  // 회사 전체: 수습을 많이 뽑으면 그만큼 고참 이탈·명예퇴직이 늘어 인원이 한쪽으로 쏠리지 않는다
  if(S.co&&S.rank>=6){const o=OUT();const base=o.staff||S.co.staff;if(S.co.staff>base*1.25&&chance(.25)){const n=Math.max(1,Math.round((S.co.staff-base*1.25)*.1));S.co.staff-=n;lines.push({c:'',t:`인원이 불어나자 고참 ${n}명이 명예퇴직·이직으로 나갔다`});}}}

// ===== 지역 주재기자 인사: 주재지는 평기자 중심, 고참은 승진해 본사로 =====
// 지역마다 책임자(주재 차장)는 한 명, 통신사·지상파의 지역본부(허브)만 부장급. 넘치는 차장·부장급과 15년 차 이상 고참은 본사 승진 발령
// 빈자리는 본사 평기자가 채운다. 정년·이직(지자체 공보관·지역 기업 홍보실·지방의원 출마 등)으로 사람이 돌아 비율은 유지된다
function corrHubs(P){return P.lead===2?P.regs.slice(0,Math.max(2,Math.ceil(P.regs.length/3))):[];}
// 지역마다 둘 수 있는 직급 자리: 지역본부(통신사·지상파 큰 곳)는 국장·부장·차장 각 1, 일반 주재지는 (부장)·차장 1, 작은 곳은 차장 1
// 아주 작은 회사·막 생긴 회사는 체계가 느슨하다: 주재기자 직급이 자리와 상관없이 차장·부장·국장일 수 있다
function corrSmall(o){o=o||OUT();return o.p<=2||!!o.npc||!!o.custom||(S.founder&&S.turn-(S.fStart||0)<YW*3);}
function corrRankFree(){const x=Math.random();return x<.55?0:x<.8?1:x<.93?2:3;}
function corrSlots(P,r,n){const hub=corrHubs(P).includes(r);if(hub)return n>=3?[3,2,1]:n===2?[2,1]:[2];if(P.lead>=1)return n>=4?[2,1]:n>=1?[1]:[];return n>=3?[1]:[];}
function corrTitle(r,o){o=o||OUT();const tv=['tv','jp','ch'].includes(o.type);return r>=3?(tv?'총국장':'지역본부장'):r===2?(tv?'총국 보도부장':'주재 부장'):r===1?'주재 차장':'주재기자';}
function corrVacant(rk){if(S.founder||!Array.isArray(S.corr))return null;const o=OUT(),P=corrPlan(o);const regs=shuffle([...new Set(S.corr.map(m=>m.reg))]);if(corrSmall(o))return regs.length&&chance(.5)?regs[0]:null;
  for(const r of regs){const L=S.corr.filter(m=>m.reg===r);if(corrSlots(P,r,L.length).includes(rk)&&!L.some(m=>(m.r||0)===rk))return r;}return null;}
// 본사에서 승진이 막힌 기자를 지역 책임자로 승진 발령한다 (본사 적체 해소)
function corrPromoteIn(m,rk,r,d){const o=OUT();const L=S.corr.filter(x=>x.reg===r);const back=L.filter(x=>!x.r).sort((a,b)=>myrs(b)-myrs(a))[0];
  if(back){S.corr=S.corr.filter(x=>x!==back);}m.d=d;m.reg=r;m.r=rk;m.role=corrTitle(rk,o);m.acting=0;m.desk=0;m.hqIn=S.turn;S.corr.push(m);return back;}
// 주재지가 비었거나 없어진 지역에 묶인 주재기자: 사람이 가장 적은 지역으로 옮긴다
function corrRegFix(P){if(!Array.isArray(S.corr))return;const regs=(P&&P.regs)||[];if(!regs.length)return;S.corr.forEach(m=>{if(!m.reg||!regs.includes(m.reg)){const c=regs.map(r=>[r,S.corr.filter(x=>x.reg===r).length]).sort((a,b)=>a[1]-b[1])[0];m.reg=c[0];}});}
// 정기 인사 때 주재지 정리: 정년·이직 → 같은 직급 겹침 정리 → 빈 책임자 자리 채우기
function corrLife(out){if(S.founder||!Array.isArray(S.corr)||!S.corr.length)return;const o=OUT();const P=corrPlan(o);const d=o.depts.find(x=>isRegD(x));if(!d)return;
  corrRegFix(P);const quiet=!S.corrN2;S.corrN2=1;const said=[];const add=t=>{if(!quiet)said.push(t);};const need=[0,10,15,19];
  const repl=m=>{S.corr=S.corr.filter(x=>x!==m);if(S.team)S.team=S.team.filter(x=>x!==m);const n=genMember(d,30,60);n.reg=m.reg;n.r=0;n.role='주재기자';n.yrs=R(2,8);n.t0=S.turn;n.rel=R(0,15);fitSk(n);S.corr.push(n);return n;};
  [...new Set(S.corr.map(m=>m.reg))].forEach(r=>{let L=S.corr.filter(m=>m.reg===r);
    L.forEach(m=>{const a=npcAge(m);if(a>=60){repl(m);add(`${m.name} ${m.role||'주재기자'}(${r}) 정년퇴직`);}else if(m.r&&a>=55&&chance(.08)){repl(m);add(`${m.name} ${m.role}(${r}) 명예퇴직`);}else if(!m.r&&myrs(m)>=6&&chance(.04)){repl(m);add(`${m.name}(${r} 주재) → ${pick(['지자체 공보관','지역 기업 홍보실','지방의원 출마','지역 방송사','고향 지역지'])}`);}});
    L=S.corr.filter(m=>m.reg===r);if(corrSmall(o)){L.forEach(m=>{const k=m.r||0;if(k<3&&myrs(m)>=need[k+1]&&chance(.12)){m.r=k+1;m.role=corrTitle(m.r,o);add(`${m.name} → ${r} ${m.role} 승진`);}});return;}const sl=corrSlots(P,r,L.length);
    // 같은 직급이 둘이거나 자리가 없는 직급: 위 자리가 비면 그 자리로, 아니면 본사 복귀
    for(const rk of [3,2,1]){const H=L.filter(m=>(m.r||0)===rk).sort((a,b)=>myrs(b)-myrs(a));const keep=sl.includes(rk)?1:0;H.slice(keep).forEach(m=>{const up=rk<3&&sl.includes(rk+1)&&!L.some(x=>(x.r||0)===rk+1)&&myrs(m)>=need[rk+1];if(up){m.r=rk+1;m.role=corrTitle(m.r,o);add(`${m.name} → ${r} ${m.role} 승진`);}else{repl(m);add(`${m.name} ${MR[Math.min(3,rk)]}(${r}) → 본사 복귀`);}L=S.corr.filter(x=>x.reg===r);});}
    // 빈 자리: 지역 안에서 올리거나(연차 충분) 다음 인사 때 본사에서 승진 발령으로 채운다
    L=S.corr.filter(m=>m.reg===r);for(const rk of sl){if(L.some(m=>(m.r||0)===rk))continue;const c=L.filter(m=>(m.r||0)===rk-1&&myrs(m)>=need[rk]).sort((a,b)=>myrs(b)-myrs(a))[0];if(c&&(quiet||chance(.5))){c.r=rk;c.role=corrTitle(rk,o);add(`${c.name} → ${r} ${c.role} 승진`);}else if(!quiet&&chance(.55)){const m=genMember(d,40,70);m.r=rk-1;m.yrs=Math.max(yrsFor(rk-1),need[rk]);m.t0=S.turn;fitSk(m);const hq=o.depts.filter(x=>!isRegD(x)&&DEPTS[x]&&!(typeof SUPPORT!=='undefined'&&SUPPORT[x]));corrPromoteIn(m,rk,r,d);m.rel=R(0,15);add(`본사 ${hq.length?DEPTS[pick(hq)].n:''} ${MR[rk-1]} ${m.name} → ${r} ${corrTitle(rk,o)} 승진 발령`);}L=S.corr.filter(x=>x.reg===r);}
    // 주재지에 묶인 15년 차 이상 평기자: 자리가 없으면 본사 차장으로 승진해 돌아간다
    L.filter(m=>!m.r&&myrs(m)>=15).forEach(m=>{if(quiet||chance(.5)){repl(m);add(`${m.name}(${r} 주재 ${myrs(m)}년 차) → 본사 차장 승진`);}});});
  try{fixDept(S.corr,d);}catch(e){}
  if(said.length&&out)out.push(`지역 주재 — ${said.slice(0,4).join(' · ')}${said.length>4?` 외 ${said.length-4}건`:''}`);}
// 본사 승진 적체 해소: 연차가 찼는데 윗자리가 막힌 기자는 지역 책임자 승진 발령 · 명예퇴직 · 다른 길로
function hqJam(m,L,out){const r=m.r||0;if(S.team&&S.team.includes(m)&&S.rank>=2&&!(S.rank>=6||S.founder)&&chance(.5))return false;
  const reg=r<3?corrVacant(r+1):null;const d=OUT().depts.find(x=>isRegD(x));
  if(reg&&d&&chance(.55)){const from=m.d;if(S.team)S.team=S.team.filter(x=>x!==m);if(S.mates)S.mates=S.mates.filter(x=>x!==m);corrPromoteIn(m,r+1,reg,d);out.push(`${m.name} ${MR[r]}(${DEPTS[from]?DEPTS[from].n:''}) → ${reg} ${m.role} 승진 발령`);log(`${m.name}: ${reg} ${m.role} 승진 발령`);return true;}
  const a=npcAge(m);if(r>=1&&a>=50&&chance(.12)){const n=genMember(m.d,30,50);n.yrs=R(1,4);n.t0=S.turn;if(S.team&&S.team.includes(m)){S.team=S.team.filter(x=>x!==m);S.team.push(n);}else if(S.mates&&S.mates.includes(m)){S.mates=S.mates.filter(x=>x!==m);S.mates.push(n);}const w=pick(['명예퇴직','대학 교수','기업 홍보 임원','공공기관 대변인','정치권']);out.push(`${m.name} ${MR[r]}(${a}세) — 승진이 막혀 ${ro2(w)}`);log(`${m.name} ${MR[r]} ${w}`);return true;}
  return false;}
// 부서장(부장 이상)이 있으면 '부장 직무대리'는 없다. 내가 부장인 부서는 내가 부서장이다
function actingFix(per){const grp={};const add=(m,d)=>{if(!m||!d||isRegD(d))return;(grp[d]=grp[d]||[]).includes(m)||grp[d].push(m);};
  if(per)Object.keys(per).forEach(d=>(per[d]||[]).forEach(m=>add(m,d)));(S.team||[]).forEach(m=>add(m,m.d));(S.mates||[]).forEach(m=>add(m,m.d||S.dept));
  Object.keys(grp).forEach(d=>{const L=grp[d];if(!S.founder&&S.rank===2&&d===S.dept)(S.team||[]).forEach(m=>{if((m.r||0)>=1)m.r=0;m.acting=0;});if(!S.founder&&S.rank===3&&d===S.dept){L.forEach(m=>{if(!(S.mates||[]).includes(m)&&(m.r||0)>=2)m.r=1;m.acting=0;});return;}
    const H=L.filter(m=>(m.r||0)>=2);if(H.length){L.forEach(m=>m.acting=0);}else{const A=L.filter(m=>m.acting);A.slice(1).forEach(m=>m.acting=0);}});}