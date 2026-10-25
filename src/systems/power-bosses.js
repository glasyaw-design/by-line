/* 바이라인 — src/systems/power-bosses.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */

// ===== 매체 파워: 사업·광고 규모 =====
function mediaPower(o){o=o||OUT();const lv=S.portal?S.portal.lv:0;return clamp((.5+o.p*.18)*([.8,1,1.12,1.25][lv]||1)*(1+(S.fame||0)/250)*(S&&S.founder?clamp(1+fNPAll()/150,.92,1.12):1)*((S.co&&S.co.tr&&o.tr)?clamp(Math.sqrt(S.co.tr/o.tr),.6,1.5):1),.35,2.2);}

// ===== 직급별 시그니처 시스템 =====
// 수습: 캡의 이달 미션 · 평기자/차장: 출입처 장악도 · 차장/부장: 제자 키우기 · 부장: 사내 부서 성적표
// 부국장~편집국장: 내일 자 1면 대결 · 편집국장: 어젠다 캠페인 · 사장: 이사회 KPI
const MISS_POOL=[['sasu','사쓰마와리',2,3],['report','정보보고',1,3],['hari','하리꼬미(뻗치기)',1,1],['invest','취재 나가기',1,2],['drink','선배와 술자리',1,1],['write','기사 쓰기',1,1]];
function missNew(){const ids=rankActs();const pool=MISS_POOL.filter(m=>ids.includes(m[0])&&!lockReason(m[0]));const g=shuffle(pool).slice(0,3).map(([k,n,lo,hi])=>({k,n,need:S.simple?lo:R(lo,hi),c:0}));S.mission={t:S.turn,g};}
function rankHook(id){if(S.phase!=='game')return;
  if(S.rank===0&&!S.founder){if(!S.mission)missNew();S.mission.g.forEach(x=>{if(x.k===id)x.c++;});}
  if(S.rank>=1&&S.rank<=2&&!S.founder&&['beat','source','discover','write','invest','special','pitch'].includes(id)){S.beatM=S.beatM||{};const v=S.beatM[S.dept]||0;S.beatM[S.dept]=clamp(v+({beat:4,source:3,discover:2,write:3,invest:2,special:4,pitch:1}[id])*(S.simple?1.3:1)*.32*Math.max(0,1-v/112),0,100);}
  if(S.rank===6&&S.agenda&&['meeting','front','taskforce','direction','column'].includes(id))S.agenda.p=Math.min(100,S.agenda.p+({meeting:3,front:4,taskforce:8,direction:5,column:4}[id]));}
function beatTier(){const v=(S.beatM||{})[S.dept]||0;return v>=75?3:v>=45?2:v>=20?1:0;}
const BEAT_T=['낯선 얼굴','얼굴 아는 기자','출입처 터줏대감','출입처의 전설'];
// 매달 결산 때 직급 시스템 처리
// ===== 상사·간부의 성향: 무엇을 좋아하고 무엇을 싫어하는가 =====
const BPREF={scoop:{n:'단독 위주',like:'단독',dis:'물먹기'},inv:{n:'탐사 위주',like:'깊게 판 기획·탐사',dis:'단신만 쓰는 달'},speed:{n:'속보 위주',like:'기사 물량·속보',dis:'출고 없는 달'},
 fact:{n:'검증 위주',like:'반론까지 받은 탄탄한 기사',dis:'오보·정정'},sales:{n:'영업 위주',like:'광고·협찬 실적',dis:'영업을 외면하는 것'},people:{n:'관계 위주',like:'동료 챙기기·회식',dis:'혼자 겉도는 것'},principle:{n:'원칙 위주',like:'광고 압력을 버티는 것',dis:'광고성 기사'}};
// 7.0 상사 성향별 대처법: 눈 밖에 났을 때 무엇을 하면 되는지
const BPREF_TIP={scoop:'단독을 쥐면 타사 추격이 닥치기 전에 먼저 쓰자. 취재원·하리꼬미로 단독을 노리자',inv:'취재 나가기를 여러 번 해 파급력 큰 기사를 내자. 특별취재팀·장기 추적도 좋아한다',speed:'한 달에 기사 세 건쯤 꾸준히 내자. 속보가 터지면 바로 지휘하자',fact:'취재 중 반론을 받아 기사에 넣고, 확인 안 된 사실은 빼자. 정정보도가 가장 싫다',sales:'광고·협찬 영업을 한 달에 한 번은 나가자',people:'동료 챙기기·부서 사람들과·술자리를 한 달에 두 번쯤 하자. 여러 명을 한 번에 챙겨도 된다',principle:'광고성 기사·홍보성 제목을 피하고, 광고주가 기사를 접으라 하면 버티자'};
function colPref(c){if(!c)return null;if(!c.pref){let h=0;for(const ch of String(c.name||'')+(c.role||''))h=(h*31+ch.charCodeAt(0))>>>0;const keys=Object.keys(BPREF);c.pref=keys[h%keys.length];}return c.pref;}
function prefTxt(c){const k=colPref(c),p=BPREF[k];return p?`${p.n} — ${jo2(p.like,'을','를')} 좋아하고, ${jo2(p.dis,'을','를')} 싫어한다. 대처법: ${BPREF_TIP[k]||''}`:'';}
// NPC 부장·부국장의 부서 운영 방향 (AI 기자 스타일과 부서 성격에서 나온다)
function npcPref(m,d){const a=m&&m.ai;if(d==='inv')return 'inv';const y=a?a.y:'fact';return {scoop:'scoop',fact:'fact',buzz:'speed',sales:'sales',net:'people'}[y]||'fact';}
function bossPrefMonth(lines){if(S.story||S.founder||S.rank<1||S.rank>6)return;const b=colBy('boss');if(!b)return;const pf=colPref(b);const P=BPREF[pf];if(!P)return;
  const t0=S.mis&&S.mis.t0!=null?S.mis.t0:S.turn-3;const A=S.mAct||{};const mine=(S.clips||[]).filter(c=>(c.turn??-1)>=t0&&String(c.by||'').includes(S.name));
  const arts=mine.length,ex=mine.filter(c=>c.excl).length,deep=mine.filter(c=>(c.imp||0)>=55).length+(A.invest||0)/3+(A.taskforce||0);
  const lost=(S.lostN||0)-(S._bp0?.lost??(S.lostN||0)),res=(S.resist||0)-(S._bp0?.res??(S.resist||0));const errs=(S.corrLog||[]).filter(x=>x.t>=t0).length;
  const sale=((S.mWin&&S.mWin.adsell)||0)+(A.adsales||0)+(A.adsell||0)*.5,ppl=(A.colleague||0)+(A.drink||0)+(A.deptlife||0),pr=(S.flags&&S.flags.prPub)||0;
  S._bp0={lost:S.lostN||0,res:S.resist||0};if(S.flags)S.flags.prPub=0;
  let like=false,dis=false,why='';
  if(pf==='scoop'){like=ex>=1;dis=lost>=1;why=like?`이번 달 단독 ${ex}건`:dis?'단독을 타사에 뺏겼다':'';}
  if(pf==='inv'){like=deep>=1.5;dis=arts>=3&&deep<.5;why=like?'깊게 판 기사':dis?'단신만 냈다':'';}
  if(pf==='speed'){like=arts>=3||(A.breaking||0)>=1;dis=arts===0&&S.rank<=3;why=like?`기사 ${arts}건${A.breaking?' · 속보':''}`:dis?'한 달 동안 출고가 없었다':'';}
  if(pf==='fact'){like=arts>=1&&errs===0&&mine.some(c=>c.rb);dis=errs>=1;why=like?'반론까지 받은 기사':dis?'정정보도가 나왔다':'';}
  if(pf==='sales'){like=sale>=1;dis=S.rank>=2&&sale===0&&month()%3===0;why=like?'광고·협찬 실적':dis?'이번 분기 영업 실적이 없다':'';}
  S._ppl0=S._ppl0||0;if(pf==='people'){like=ppl>=2;dis=ppl===0&&S._ppl0===0;S._ppl0=ppl;why=like?'동료들과 잘 어울린다':dis?'혼자 겉돈다':'';}
  if(pf==='principle'){like=res>=1;dis=pr>=1;why=like?'광고 압력을 버텼다':dis?'광고성 기사가 나갔다':'';}
  if(like&&dis)return;if(!chance(.75))return;const who=jo2(`${b.name} ${colRole(b)}`,'이','가');
  if(like){relUp(b,4,P.like);apply({eval:S.rank<=3?1:.6});if(lines)lines.push({c:'g',t:`${who} 흡족해했다 (${P.n}) — ${why}`});}
  else if(dis){relUp(b,-3,P.dis);apply({eval:S.rank<=3?-.6:-.4});if(lines){lines.push({c:'r',t:`${b.name} ${colRole(b)}의 눈 밖에 났다 (${P.n}) — ${why}`});lines.push({c:'',t:`대처법: ${BPREF_TIP[pf]||''}`});}}}
function rankMonth(lines){if(S.founder)return;try{bossPrefMonth(lines);}catch(e){console.error(e);}
  // 수습 미션
  if(S.rank===0){if(S.mission&&S.turn-S.mission.t>=4){const done=S.mission.g.filter(x=>x.c>=x.need).length,all=S.mission.g.length;if(done>=Math.max(1,all-1))S.rkMiss=(S.rkMiss||0)+1;const cap=colBy('cap');
     if(done===all){lines.push({c:'g',t:`캡의 이달 미션 완수 (${done}/${all}) — "그래, 이제 좀 기자 같네."`});apply({eval:2.5});if(cap)relUp(cap,6,'미션 완수');}
     else if(done>0){lines.push({c:'',t:`캡의 이달 미션 ${done}/${all} — ${done>=all-1?'"이 정도면 됐다."':'"반만 했네."'}`});apply({eval:done>=all-1?1.2:.6});if(cap&&done>=all-1)relUp(cap,3,'미션 대부분 완수');}
     else{lines.push({c:'r',t:'캡의 이달 미션 0개 — 새벽 3시에 전화가 왔다.'});apply({eval:-1.5});if(cap)relUp(cap,-5,'미션 실패');}
     missNew();} else if(!S.mission)missNew();}
  // 출입처 장악도 혜택
  if(S.rank>=1&&S.rank<=2){S.beatM=S.beatM||{};const t=beatTier();S.beatM[S.dept]=Math.max(0,(S.beatM[S.dept]||0)-1.5);
    if(t>=3&&chance(.2)){const it=makeItem(S.dept,{excl:chance(.35),keyConf:true,mult:1.1});it.src='출입처';S.items.push(it);lines.push({c:'g',t:`출입처의 전설 — 기관 사람이 먼저 귀띔해 줬다 → 「${it.title}」`});}
    else if(t>=2&&chance(.14)){const it=makeItem(S.dept,{pre:1});S.items.push(it);lines.push({c:'g',t:`출입처 터줏대감 — 대변인실이 자료를 먼저 챙겨 줬다 → 「${it.title}」`});}}
  // 제자 키우기
  if(S.protege&&S.rank>=2){const m=deptPeople().find(x=>x.name===S.protege);if(!m){if(S._pgPrev)pgAfterMove('dept');else S.protege=null;}else{skBump(m,.45+clamp((m.rel??20)/250,0,.35));if(chance(.08+m.skill/700)){apply({fame:.8,eval:.6});lines.push({c:'g',t:`제자 ${jo2(m.name,'이','가')} 단독을 냈다. "선배 덕분입니다." (평판↑)`});mRel(m,4);}}}
  // 부장: 사내 부서 성적표
  if(S.rank===3){const MQ=S._mqA||[];const arts=MQ.length,qa=arts?MQ.reduce((a,b)=>a+b,0)/arts:0;const tAvg=(S.team||[]).reduce((a,m)=>a+m.skill,0)/Math.max(1,(S.team||[]).length);let me,others;
    if(bjDeskOn()){const D=bjDeskMonth(lines);me=D.n*7+(D.n?D.q*.35:0)+Math.min(arts,2)*4+Math.max(0,arts-2)*1.2+(arts?qa*.15:0)+tAvg*.25+D.top*3+(S.flags.plan?6:0)-D.err*5+R(-4,4);
      S.deptScore={n:D.n,q:Math.round(D.q),arts,team:Math.round(tAvg),top:D.top,err:D.err,auto:D.auto,kill:D.kill};others=OUT().depts.filter(d=>d!==S.dept&&!isRegD(d)).slice(0,5).map(d=>[DEPTS[d].n,R(30,62)]);}
    else{me=arts*4+qa*.5+tAvg*.3+R(-6,6);others=OUT().depts.filter(d=>d!==S.dept).slice(0,5).map(d=>[DEPTS[d].n,R(18,45)]);}
    me=Math.max(0,me);const all=others.concat([[DEPTS[S.dept].n+'(우리)',Math.round(me)]]).sort((a,b)=>b[1]-a[1]);const rk=all.findIndex(x=>x[0].endsWith('(우리)'))+1;S.deptRank=rk;S.deptBoard=all;if(rk<=2)S.deptTop=(S.deptTop||0)+1;if(rk===1){S.deptT=S.turn;S.deptTopY=(S.deptTopY||0)+1;}
    if(bjDeskOn()&&arts>=4){apply({eval:-.8});lines.push({c:'r',t:`국장: "부장이 기사만 쓰면 데스크는 누가 보나." (기명 기사 ${arts}건)`});}
    if(rk===1){S.apBonus=S.turn+4;apply({eval:1.2});lines.push({c:'g',t:`사내 부서 성적 1위 — 국장이 "다음 달 지면 우선권"을 줬다 (행동력 +1)`});}
    else if(rk===all.length){apply({eval:-1});lines.push({c:'r',t:`사내 부서 성적 꼴찌 — 편집회의에서 우리 부서 이름이 자주 불렸다`});}
    else lines.push({c:'',t:`사내 부서 성적 ${rk}위 / ${all.length}개 부서`});}
  // 편집국장: 어젠다 진행
  if(S.rank===6){if(!S.agenda&&S.simple)S.agenda={k:pick(Object.keys(AGENDA)),p:0,t:S.turn};if(S.agenda){S.agenda.p=Math.min(100,S.agenda.p+2+S.co.q/40);if(S.agenda.p>=100&&!S.agenda.done){S.agenda.done=1;S.agendaDone=(S.agendaDone||0)+1;const A=AGENDA[S.agenda.k];apply({trust:4,fame:4,eval:2});S.co.q+=3;lines.push({c:'g',t:`어젠다 캠페인 「${A[0]}」 결실 — ${A[2]}`});tick(`${OUT().n} 「${A[0]}」 연중 기획, 제도 개선 이끌어`,1);if(chance(.5)){S.awards++;lines.push({c:'g',t:'연중 기획으로 한국기자상 수상'});}}}}
  // 사장: 이사회 KPI (분기마다)
  if(S.rank===7){if(!S.kpi)kpiNew();if(S.turn-S.kpi.t>=12){const k=S.kpi;const rev=S.co.last?S.co.last.rev:0;const ok=[rev>=k.rev,(S.myShare||0)>=k.share,S.trust>=k.trust];const n=ok.filter(Boolean).length;k.t=S.turn;k.hist.push(n);
     if(n===3){apply({eval:3});lines.push({c:'g',t:`이사회 분기 보고 — KPI 3개 모두 달성. 이사회가 박수를 쳤다.`});}else if(n===2){apply({eval:1});lines.push({c:'',t:`이사회 분기 보고 — KPI ${n}/3`});}else{apply({eval:-2.5});lines.push({c:'r',t:`이사회 분기 보고 — KPI ${n}/3. "다음 분기도 이러면 곤란합니다."`});}
     k.rev=+(rev*1.03).toFixed(2);k.share=Math.min(40,+((S.myShare||10)+.5).toFixed(1));}}}
function kpiNew(){const rev=S.co.last?S.co.last.rev:coRev();S.kpi={t:S.turn,rev:+(rev*1.04).toFixed(2),share:+((S.myShare||10)+1).toFixed(1),trust:Math.max(50,Math.round(S.trust)),hist:[]};}
const AGENDA={birth:['저출생, 답을 찾아서','저출생·돌봄','육아휴직 제도 개선 법안이 국회를 통과했다'],climate:['기후 위기 리포트','기후·에너지','정부가 탄소 감축 로드맵을 다시 짰다'],region:['지역 소멸을 막아라','지역·균형 발전','지역 공공기관 2차 이전이 확정됐다'],labor:['일터의 죽음','산업재해','중대재해 감독 인력이 두 배로 늘었다'],housing:['집 없는 청년','주거·부동산','청년 공공임대 공급 계획이 확대됐다'],power:['권력 감시 연중 기획','권력 감시','특수활동비 공개 제도가 도입됐다']};
RUN.agenda=function(){if(S.agenda&&!S.agenda.done){openModal('어젠다 캠페인',`<p class="lede">진행 중: 「${esc(AGENDA[S.agenda.k][0])}」 ${Math.round(S.agenda.p)}%</p><p class="hint">편집회의·1면 회의·특별취재팀·편집 방향 회의·칼럼이 캠페인을 밀어 준다. 100%가 되면 결실을 맺는다.</p>`,[{label:'캠페인을 접는다',sub:'신뢰 조금↓',cls:'ghost',fn:()=>{S.agenda=null;apply({trust:-1});}},{label:'닫기',cls:'ghost'}]);return;}
  openModal('어젠다 세팅 · 올해의 연중 기획',`<p>편집국장으로서 1년 동안 밀고 갈 의제를 정한다. 편집국 전체가 이 주제로 기사를 쌓는다. 끝까지 가면 신뢰·평판이 크게 오르고 기자상도 노릴 수 있다.</p>`,Object.keys(AGENDA).map(k=>({label:AGENDA[k][0],sub:AGENDA[k][1],fn:()=>{spend(1,3);S.agenda={k,p:0,t:S.turn};log(`어젠다 캠페인 시작: ${AGENDA[k][0]}`);tick(`${OUT().n}, 연중 기획 「${AGENDA[k][0]}」 시작`,1);toast('연중 기획을 선포했다');}})).concat([{label:'취소',cls:'ghost'}]));};
// 부국장~편집국장: 내일 자 1면 대결 (이벤트)
function frontWar(){const tv=isTV();const rv=compPick();const rn=cName(rv);const C=[0,1,2].map(()=>{const it=makeItem(pick(OUT().depts),{excl:chance(.45)});return{it,vr:R(40,100)/100};});
  openModal(`내일 자 ${tv?'메인뉴스 톱':'1면'} 대결`,`<p class="lede">마감 직전. ${esc(rn)}도 오늘 밤 ${tv?'톱뉴스를':'1면을'} 정한다. 우리는 무엇으로 갈까?</p><p class="hint">다음 날 아침 독자 반응과 포털 순위로 승패가 갈린다. 지금 ${S.fwStreak||0}연승.</p>`,C.map(c=>({label:`「${c.it.title}」${c.it.excl?' · 단독':''}`,sub:`확인 ${pct(c.vr)} · 파급력 ${c.it.imp}`,fn:()=>{spend(0,3);const me=c.it.imp*c.vr*(c.it.excl?1.35:1)+S.co.q*.3+R(-10,10);const them=(rv.q||50)*.55+R(5,35)+(rv.buzz?10:0);const win=me>=them;
     if(win){S.fwStreak=(S.fwStreak||0)+1;S.fwWins=(S.fwWins||0)+1;const fx=apply({fame:.8+(S.fwStreak>=3?1.2:0),eval:.6});S.co.q+=.5;rv.aggro=clamp((rv.aggro||0)+3,0,100);openModal('1면 대결 승리',`<p class="lede">아침 포털 1위는 우리 「${esc(c.it.title)}」. ${esc(rn)}의 1면은 하루 종일 묻혔다.${S.fwStreak>=3?` ${S.fwStreak}연승 — 업계에서 "요즘 ${OUT().n} 1면 무섭다"는 말이 돈다.`:''}</p>${fxLine(fx)}`);}
     else{S.fwStreak=0;const fx=apply({eval:-.5});if(c.vr<.6&&chance(.25)){S.pending.push({type:'err',title:c.it.title,due:S.turn+R(1,3),desk:1});}openModal('1면 대결 패배',`<p class="lede">${esc(rn)}의 1면이 하루를 가져갔다. 우리 기사는 포털 구석에 머물렀다.${c.vr<.6?' 게다가 확인이 덜 된 기사였다.':''}</p>${fxLine(fx)}`);}
     return false;}})).concat([{label:'평소처럼 편집부에 맡긴다',sub:'대결 없이 넘어간다',cls:'ghost'}]));}
// 직급별 상자 (기자 수첩 맨 위)
function rankBox(){if(S.founder||S.story)return '';const parts=[];
  if(S.rank===0&&S.mission){parts.push(`<div class="card rkc"><div class="t">캡의 이달 미션 <small>${moTxt(Math.max(0,4-(S.turn-S.mission.t)))} 남음</small></div><div class="meta">${S.mission.g.map(x=>`<span class="${x.c>=x.need?'tag ok':''}">${x.n} ${Math.min(x.c,x.need)}/${x.need}</span>`).join('')}</div><p class="hint" style="margin:4px 0 0">다 하면 평가↑·캡 관계↑, 하나도 못 하면 평가↓.</p></div>`);}
  if(S.rank>=1&&S.rank<=2){const v=(S.beatM||{})[S.dept]||0,t=beatTier();parts.push(`<div class="card rkc"><div class="t">출입처 장악도 · ${BEAT_T[t]}</div>${bar(v,'var(--good)')}<p class="hint" style="margin:4px 0 0">${DEPTS[S.dept].n} 출입처 ${Math.round(v)}/100 · 브리핑·취재원·발굴·기사로 오른다. 45 이상이면 자료가 먼저 오고, 75 이상이면 단독 귀띔이 온다. 부서를 옮기면 처음부터.</p></div>`);}
  if(S.rank>=2&&S.rank<=3){parts.push(`<div class="card rkc"><div class="t">제자 키우기 ${S.protege?`· ${esc(S.protege)}`:''}</div><p class="hint" style="margin:0">${S.protege?'제자는 매달 조금씩 크고, 가끔 단독을 내면 내 평판도 오른다.':'"부서 사람들과"에서 후배를 골라 "제자로 삼는다"를 누르자.'}</p></div>`);}
  if(S.rank===3&&S.deptBoard){parts.push(`<div class="card rkc"><div class="t">사내 부서 성적표 · ${S.deptRank}위</div><div class="meta">${S.deptBoard.map((x,i)=>`<span class="${x[0].endsWith('(우리)')?'tag so':''}">${i+1}. ${esc(x[0])} ${x[1]}</span>`).join('')}</div><p class="hint" style="margin:4px 0 0">${bjDeskOn()?`데스킹한 부서 기사 수와 완성도가 가장 크게 반영된다. 그다음이 부서원 실력·톱 지면·기획회의, 부장 본인 기사는 한 달 2건까지만 제대로 쳐 준다. 손 안 댄 초고가 사고를 내면 감점.${S.deptScore?` 지난달: 데스킹 ${S.deptScore.n}건(완성도 ${S.deptScore.q}) · 내 기사 ${S.deptScore.arts}건 · 부서원 실력 ${S.deptScore.team}${S.deptScore.auto?` · 방치 초고 ${S.deptScore.auto}건`:''}`:''}`:'이번 달 기사 수·완성도·부서원 실력으로 매긴다.'} 1위면 다음 달 행동력 +1.</p></div>`);}
  if(bjDeskOn()){bjEnsure();const Q=S.dq||[],M=S.deskM||{n:0,q:0};parts.unshift(`<div class="card rkc deskc"><div class="t">${ic('edit')} 부장 데스크 · 올라온 초고 ${Q.length}건</div><div class="meta"><span>이번 달 데스킹 ${M.n}건${M.n?` · 평균 완성도 ${Math.round(M.q/M.n)}`:''}</span><span>내 기명 기사 ${(S.monthQ||[]).length}건 / 권장 2건</span>${Q.filter(d=>d.due-S.turn<=1).length?`<span class="tag ex">마감 임박 ${Q.filter(d=>d.due-S.turn<=1).length}</span>`:''}</div>${Q.slice(0,4).map(d=>`<div class="dqr">${face(d.role||'peer',d.rel,'dqf',d.w)}<div><b>${esc(d.w)}</b> · ${esc(d.t)}<small>초고 완성도 ${d.q} · 문제 ${d.fl}곳 · 마감 ${heatTxt(d.due-S.turn)}${d.back?' · 보강본':''}</small></div></div>`).join('')}<p class="hint" style="margin:4px 0 0">할 일의 "데스킹"으로 초고를 다듬어 내보낸다. 월말까지 손 안 댄 초고는 차장이 대충 넘기거나 킬된다.</p></div>`);}
  if(S.rank>=4&&S.rank<=6&&S.fwWins!=null){parts.push(`<div class="card rkc"><div class="t">1면 대결 · ${S.fwWins}승 · 지금 ${S.fwStreak||0}연승</div></div>`);}
  if(S.rank===6){parts.push(`<div class="card rkc"><div class="t">어젠다 캠페인 ${S.agenda?`· 「${esc(AGENDA[S.agenda.k][0])}」`:''}</div>${S.agenda?bar(S.agenda.p,'var(--sodium)'):''}<p class="hint" style="margin:4px 0 0">${S.agenda?(S.agenda.done?'결실을 맺었다. 새 어젠다를 정할 수 있다.':`${Math.round(S.agenda.p)}% · 편집회의·1면·특별취재팀·칼럼이 밀어 준다.`):'할 일의 "어젠다 세팅"에서 올해의 연중 기획을 정하자.'}</p></div>`);}
  if(S.rank===7&&S.kpi){parts.push(`<div class="card rkc"><div class="t">이사회 KPI <small>분기마다 보고${!S.founder&&!S.story?` · 사장 ${S.ceoTerm||1}기 · 임기 ${moTxt(Math.max(0,ceoTermW()-S.inRank))} 남음`:''}</small></div><div class="meta"><span>월 매출 ${eok(S.kpi.rev)} 이상</span><span>광고 점유율 ${S.kpi.share}% 이상</span><span>신뢰도 ${S.kpi.trust} 이상</span></div>${S.kpi.hist.length?`<p class="hint" style="margin:4px 0 0">지난 보고: ${S.kpi.hist.slice(-4).map(n=>n+'/3').join(' · ')}</p>`:''}</div>`);}
  try{const sg=deptSigHTML();if(sg)parts.push(sg);}catch(e){}if(S.chal){const c=CHAL.find(x=>x.id===S.chal);if(c)parts.push(`<div class="card rkc"><div class="t">${chImg(c.id,'xs')||ic('flag')} 이번 판의 도전 · ${esc(c.n)}</div><p class="hint" style="margin:4px 0 0">${esc(c.d)} · 판이 끝날 때 판정</p></div>`);}
  return parts.length?`<div class="sec">${rankName()}의 일</div>${parts.join('')}`:'';}
F_EVENTS.push({w:4,c:()=>!S.founder&&!S.story&&S.rank>=4&&S.rank<=6&&S.comp&&S.comp.length,run:()=>frontWar()});