/* 바이라인 1.6 — src/systems/dept-signature.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===================== 6.0 부서 시그니처: 부서마다 확실히 다른 한 달 =====================
const DEPT_SIG_OF={pol:'pol',city:'pol',diplo:'intl',int:'intl',eco:'eco',ind:'eco',fin:'eco',stock:'eco',estate:'eco',it:'eco',soc:'soc',case:'soc',med:'soc',edu:'soc',court:'court',inv:'inv',cul:'cul',ent:'cul',culspo:'cul',spo:'spo',base:'spo',foot:'spo',nat:'loc',sigun:'loc',loc:'loc'};
const DEPT_SIG={
 pol:['정국 캘린더','총선·지방선거가 있는 봄과 국정감사 10월엔 아이템이 쏟아지고 평판이 크게 오른다. 대신 정당과의 관계가 크게 출렁인다'],
 intl:['특파원 찬스','가끔 해외 출장·특파원 제안이 온다. 어학이 남들보다 훨씬 빨리 큰다. 국내 아이템은 적다'],
 eco:['시장 지표','매달 지수가 움직이고, 크게 흔들린 달엔 긴급 분석 아이템이 온다. 광고주 눈치가 다른 부서의 두 배다'],
 soc:['사건 당번','밤마다 사건이 터진다. 속보가 자주 걸리고 단독도 잦지만 몸이 가장 빨리 닳는다'],
 court:['선고 캘린더','매달 선고 일정이 잡혀 확인이 반쯤 된 아이템이 들어온다. 소송 위험은 가장 낮다'],
 inv:['장기 탐사','한 달에 한 방. 탐사 진척도가 차면 대형 단독이 터진다. 평소엔 아이템이 거의 없다'],
 cul:['연재와 트래픽','문화부는 연재가 쌓일수록 기자상 후보가 되고, 연예부는 조회수 전쟁에 이기면 평판이 뛰지만 신뢰가 깎인다'],
 spo:['시즌 캘린더','시즌 중엔 매주 경기라 행동력 +1, 대신 몸이 더 지친다. 비시즌엔 이적 시장 단독이 몰린다'],
 loc:['토박이 지수','동네 사람 모두가 취재원이라 관계가 훨씬 잘 쌓인다. 대신 지역 유지의 청탁이 자주 들어온다']};
function deptFam(){return DEPT_SIG_OF[S.dept]||null;}
function deptSigOn(){return !!(S&&S.phase==='game'&&!S.founder&&!S.story&&S.rank<=3&&deptFam());}
function inSeason(){const m=month();const d=S.dept;return d==='base'?(m>=3&&m<=10):d==='foot'?(m>=2&&m<=11):(m>=3&&m<=11);}
function polSeason(){const m=month();return m===10||((typeof yearN==='function'?yearN():Math.floor(S.turn/YW))%2===0&&(m===3||m===4));}
function deptSigMonth(lines){if(!deptSigOn())return;const f=deptFam();const add=it=>{S.items.push(it);return it;};
  if(f==='pol'){if(polSeason()){const it=add(makeItem(S.dept,{mult:1.15,excl:chance(.3)}));lines.push({c:'g',t:`${month()===10?'국정감사':'선거'} 시즌 — 정치부에 아이템이 쏟아진다 → 「${it.title}」`});S.polHot=S.turn;['ruling','opp'].forEach(k=>{if(S.net&&S.net[k])netUp(k,R(-7,4));});}}
  if(f==='intl'){if(!S.simple&&chance(.16))Q.push(()=>openModal('특파원 찬스',`<p class="lede">국제 회의 현장 출장 자리가 났다. 데스크가 "갈 사람?" 하고 쳐다본다.</p>`,[{label:'간다',sub:'어학·상식↑ · 해외 단독 아이템 · 컨디션↓',fn:()=>{gain('lng',2.5);gain('kno',1);S.hp=clamp(S.hp-8,0,100);const it=makeItem(S.dept,{excl:true,mult:1.1});S.items.push(it);toast(apply({fame:1})+` · 「${it.title}」`);}},{label:'이번엔 양보한다',sub:'동료 관계↑',fn:()=>{(S.cols||[]).slice(0,2).forEach(c=>relUp(c,4,'출장 양보'));}}]));}
  if(f==='eco'){const mv=Math.round((Math.random()-.5)*10*10)/10;S.mkt=Math.round(((S.mkt||2500)*(1+mv/100))*10)/10;if(Math.abs(mv)>=3.2){const it=add(makeItem(S.dept,{mult:1.12,pre:1}));lines.push({c:mv<0?'r':'g',t:`시장 지표 ${mv>0?'+':''}${mv}% ${mv<0?'급락':'급등'} — 긴급 분석 아이템 「${it.title}」`});}else lines.push({c:'',t:`시장 지표 ${mv>0?'+':''}${mv}% · 지수 ${Math.round(S.mkt)}`});}
  if(f==='soc'){if(!S.breaking&&chance(.32)&&typeof newBreaking==='function'){try{newBreaking();lines.push({c:'r',t:'사건 당번 — 새벽에 큰 사건이 터졌다. 할 일에 "속보 대응"이 떴다'});}catch(e){}}S.hp=clamp(S.hp-2,0,100);}
  if(f==='court'&&chance(.45)){const it=add(makeItem(S.dept,{pre:1,mult:.95}));it.src='선고 일정';lines.push({c:'g',t:`선고 캘린더 — 이달 선고가 잡혔다. 판결문 일부를 미리 확인 → 「${it.title}」`});}
  if(f==='inv'){S.invP=Math.min(100,(S.invP||0)+R(9,16)+((S._mqA||[]).length?4:0));if(S.invP>=100){S.invP=0;const it=add(makeItem(S.dept,{excl:true,pre:2,mult:1.35,keyConf:true}));lines.push({c:'g',t:`장기 탐사 결실 — 몇 달 판 끝에 대형 단독이 손에 들어왔다 → 「${it.title}」`});}else lines.push({c:'',t:`장기 탐사 진척도 ${S.invP}%`});}
  if(f==='cul'){const n=(S._mqA||[]).length;if(S.dept==='ent'){if(n>=2){const fx=apply({fame:1,trust:-.4});lines.push({c:'',t:`조회수 전쟁 승리 — 연예 기사 ${n}건이 포털을 덮었다 (${fx})`});}}else{S.culRun=n?(S.culRun||0)+1:0;if(S.culRun>=3&&chance(.2)){S.culRun=0;S.awards=(S.awards||0)+1;const fx=apply({fame:2.5,eval:1.5});lines.push({c:'g',t:`석 달 연재가 쌓였다 — 문화 부문 기자상 수상 (${fx})`});}else if(S.culRun)lines.push({c:'',t:`연재 ${S.culRun}달째 · 석 달이 쌓이면 기자상 후보`});}}
  if(f==='spo'){if(!inSeason()){if(chance(.5)){const it=add(makeItem(S.dept,{excl:chance(.6),mult:1.05}));lines.push({c:'g',t:`비시즌 이적 시장 — 「${it.title}」`});}}}
  if(f==='loc'){if(!S.simple&&chance(.22))Q.push(()=>{const ce=typeof cityEnt==='function'?cityEnt():null;openModal('지역 유지의 청탁',`<p class="lede">지역 건설업체 회장이 저녁을 사며 봉투를 내민다. "우리 회사 기사는 좀 살살…"</p>`,[{label:'정중히 거절한다',sub:'신뢰↑ · 지역 권력과 껄끄러워진다',fn:()=>{if(ce)netUp(ce,-8);toast(apply({trust:1.5}));}},{label:'밥만 먹고 봉투는 돌려준다',sub:'관계 유지 · 소문 위험',fn:()=>{if(ce)netUp(ce,3);if(chance(.25))toast(apply({trust:-1.5})+' · 밥자리 소문이 돌았다');else toast('조용히 넘어갔다');}}]);});}}
function deptSigHTML(){if(!deptSigOn())return '';const f=deptFam(),F=DEPT_SIG[f];let st='';
  if(f==='pol')st=polSeason()?'지금은 시즌 — 아이템 폭주':'다음 시즌: 봄 선거(짝수 해) · 10월 국감';if(f==='eco')st=`지수 ${Math.round(S.mkt||2500)}`;if(f==='inv')st=`탐사 진척도 ${S.invP||0}%`;if(f==='spo')st=inSeason()?'시즌 중 · 행동력 +1':'비시즌 · 이적 시장';if(f==='cul'&&S.dept!=='ent')st=`연재 ${S.culRun||0}달째`;
  return `<div class="card rkc sigc"><div class="t">${ic('star')} ${esc(DEPTS[S.dept].n)} · ${esc(F[0])}${st?` <small>${esc(st)}</small>`:''}</div><p class="hint" style="margin:4px 0 0">${esc(F[1])}</p></div>`;}