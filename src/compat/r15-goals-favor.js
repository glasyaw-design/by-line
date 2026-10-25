// 1.5 · 판 시작 목표 점검 · 봉투 개편 · 신세 장부 · 줄타기 · 시의성
// 예전 파일 v43.js · v44.js를 순서 그대로 이어 붙였다

// ───── (예전 v43.js) ─────
/* 바이라인 — src/compat/v43.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.5 판 시작 목표 점검: 이미 이룬 목표·이룰 수 없는 목표를 거른다 =====
function g43Start(){return {r:S.rank,chair:!!S.chair,op:!!S.op,fp:(typeof firstP==='function'?firstP():OUT().p)};}
// 커리어 목표가 이번 판에서 말이 되는지
function goalOK43(g){try{if(!g||!S)return true;
  if(g.chk&&g.chk())return false; // 시작부터 이미 이뤘다
  const r=S.rank,ch=!!S.chair,op=!!S.op;
  if(g.id==='cp'&&S.portal&&S.portal.lv===3)return false; // 이미 CP 매체
  if(g.id==='climb2'&&(firstP()>=4||r>=6||ch))return false; // ★5가 끝이라 ★4 매체에선 못 이룬다
  if(g.id==='ceo'&&ch)return false;
  if(g.id==='chief'&&(ch||r>=6))return false;
  if(g.id==='hopper'&&(ch||r>=6))return false;
  if(g.id==='desk30'&&(r>=4||ch||op))return false; // 데스킹은 차장~부국장만
  if(['legend','scoop25','big3','clean','award2','smallboss'].includes(g.id)&&(r>=5||ch||op))return false; // 간부는 취재를 안 한다
  if(g.id==='smallboss'&&OUT().p>=3&&r>=3)return false;
  if(g.id==='loyal'&&(ch||r>=6))return false;
  if(g.id==='major5'&&ch)return false;
  if(g.id==='bigdesk'&&ch)return false;
  return true;}catch(e){return true;}}
{const _gs43=goalSetup;goalSetup=function(){_gs43.apply(this,arguments);try{if(!S||!S.goalSet)return;
  if(S.founder){const P=FOUNDER_GOALS;S.goalSet=S.goalSet.map(id=>{const g=P.find(x=>x.id===id);if(!g||!g.chk||!g.chk())return id;const alt=P.filter(x=>x.g===g.g&&!S.goalSet.includes(x.id)&&!(x.chk&&x.chk()));return alt.length?pick(alt).id:id;});return;}
  const okBase=g=>!g.fo&&!(S.simple&&['net8','loved','source10','desk30'].includes(g.id))&&goalOK43(g);
  const keep=S.goalSet.filter(id=>{const g=GOAL_POOL.find(x=>x.id===id);return g&&okBase(g);});
  const want=['c','r','l'];const has=k=>keep.some(id=>(GOAL_POOL.find(x=>x.id===id)||{}).g===k);
  const clash=id=>(id==='loyal'&&keep.includes('hopper'))||(id==='hopper'&&keep.includes('loyal'));
  want.forEach(k=>{if(has(k))return;const c=GOAL_POOL.filter(g=>g.g===k&&okBase(g)&&!keep.includes(g.id)&&!clash(g.id));if(c.length)keep.push(pick(c).id);});
  while(keep.length<3){const c=GOAL_POOL.filter(g=>okBase(g)&&!keep.includes(g.id)&&!clash(g.id));if(!c.length)break;keep.push(pick(c).id);}
  S.goalSet=keep.slice(0,3);}catch(e){console.error(e);}};}
// 「사장실의 주인」은 임기를 마칠 때 이뤄진다 (예전엔 끝까지 미완료로 남았다)
try{const g=GOAL_POOL.find(x=>x.id==='ceo');if(g){g.chk=()=>/^임기 만료 · 사장실의 주인/.test(String(S.endKind||''));g.p=()=>S.rank>=7?`사장 임기 중 · 끝까지 채우면 달성`:`현재 ${rankName()}`;}}catch(e){}
{const _en43=ending;ending=function(kind){try{if(S&&S.goalSet&&S.goalSet.includes('ceo')&&/^임기 만료 · 사장실의 주인/.test(String(kind))){S.goals=S.goals||{};if(!S.goals.ceo)S.goals.ceo=dateShort();}}catch(e){}return _en43.apply(this,arguments);};}
// 창간 목표: 새 재무 규칙에 맞춰 곳간 목표를 30억으로
try{const g=FOUNDER_GOALS.find(x=>x.id==='f_cash50');if(g){g.d='회사 자금 30억 원';g.p=()=>`${S.co?f1(S.co.cash):0}/30억`;g.chk=()=>S.co&&S.co.cash>=30;}
  const s=FOUNDER_GOALS.find(x=>x.id==='f_share20');if(s)s.p=()=>`점유율 ${S.myShare==null?'집계 전':f1(S.myShare)+'%'}/20%`;}catch(e){}

// ---- 이번 판의 도전: 이미 이뤘거나 이번 판엔 못 하는 도전은 빼고 보여 준다 ----
try{const a=CHAL.find(c=>c.id==='award');if(a)a.d='이달의 기자상을 세 번 받는다';}catch(e){}
function chalOK43(c){try{if(!S)return true;const r=S.rank,ch=!!S.chair;
  if(c.id==='iron')return S.diff==='hard';
  if(c.id==='fast')return !S.founder&&r<3&&years()<10;
  if((c.id==='local'||c.id==='tv'||c.id==='nomad')&&(ch||S.founder))return false;
  if(c.id==='local'&&r>=6)return false;
  if(c.id==='tv'&&r>=6)return false;
  if(['scoop','award'].includes(c.id)&&(r>=6||ch)&&!S.founder)return false;
  if(S.op&&['scoop','award','local','tv'].includes(c.id))return false; // 논설위원실은 취재·편집국 승진과 거리가 있다
  if(c.id==='mgroup')return !!S.founder&&!S.chair;
  if(c.id==='clean_ed'&&(r>=6||ch))return false;
  if(c.id==='rebel'&&ch)return false;
  if(c.id==='direct'&&(r>=6||ch||S.simple||!(typeof selOf==='function'&&selOf(6)==='direct')))return false; // 직선제 회사에서만
  if(c.id==='comeback'&&(r>=7||ch||S.simple))return false;
  if(c.id==='rivalwin'&&(r>=7||ch||S.simple||!S.rival||!(electOn(6)||electOn(7))))return false; // 선거가 있는 회사에서만
  if(c.ok&&c.ok())return false; // 시작부터 이미 이룬 도전
  return true;}catch(e){return true;}}

// ---- 이번 판 목표 엔딩: 이번 판에서 갈 수 없는 엔딩은 후보에서 뺀다 ----
try{END_DEX.push(['창간 성공','found','창간 목표 둘을 이루고 박수 속에 엔딩을 본다'],['창업자 축출 · 경영권 상실','found','투자사에 지분을 내주다 주총에서 쫓겨난다'],['편집국장의 퇴장','retire','편집국장 자리에서 사표를 내고 언론계를 떠난다']);}catch(e){}
function chairPath43(){try{if(S.chair)return true;if(S.founder||S.simple)return false;const w=chairWay();return !!(w&&w!=='heir');}catch(e){return false;}}
function endOK43(e){try{const n=e[0],r=S.rank,ch=!!S.chair;
  if(/^회장 은퇴/.test(n))return chairPath43();
  if(/^주필|^논설위원으로/.test(n))return !!S.op||(!ch&&!S.founder&&r<=5&&opOK());
  if(ch&&['정년퇴직','임기 만료 퇴임','임기 만료 · 사장실의 주인','명예퇴직','희망퇴직','권고사직','이사회 해임','편집국장의 퇴장'].includes(n))return false;
  if(n==='편집국장의 퇴장')return !S.founder&&r<=6;
  if(S.op&&['정년퇴직','임기 만료 퇴임','임기 만료 · 사장실의 주인','이사회 해임'].includes(n))return false; // 논설위원은 정년이면 논설위원 엔딩으로 바뀐다
  if(n==='창업자 축출 · 경영권 상실')return !!S.founder;
  if(/전문 분야/.test(e[2])&&r>=6&&!S.spec2)return false; // 간부 시작은 전문 분야를 키울 시간이 없다
  return true;}catch(err){return true;}}
Object.assign(END_HOW,{
 '창간 성공 · 메이저 언론':'내 매체를 ★5로 키우고 포털 CP와 기자 진용까지 갖추면 엔딩을 고를 수 있다',
 '창간 성공':'창간 목표 셋 가운데 둘을 이루면 창간 엔딩을 고를 수 있다',
 '창간 엔딩 · 매각':'회사가 커지면 인수 제안이 온다. 받아들이면 매각 엔딩',
 '매각 후 은퇴':'대표로 나이가 차서 은퇴할 때 회사를 매각하고 떠난다',
 '대표 은퇴 · 승계':'대표로 나이가 차서 은퇴할 때 후배에게 대표를 물려준다',
 '창간 10주년 · 아름다운 퇴장':'창간 10년을 버티면 기념식에서 물러날 수 있다',
 '창간 완전 클리어':'창간 목표 셋을 모두 이룬다',
 '창간 실패 · 파산':'회사 자금이 은행 한도 밑으로 떨어진 채 달을 넘긴다',
 '창업자 축출 · 경영권 상실':'투자를 받아 지분이 35% 밑으로 줄고, 주총 재신임에서 두 번 지면 쫓겨난다',
 '편집국장의 퇴장':'편집국장 자리에서 사표를 내고, 들어오는 제안도 마다하고 떠난다',
 '정권의 입 · 대변인':'「어용의 길」 제안을 받아 끝(3단계)까지 간 뒤, 길의 끝 제안을 받아들인다',
 '기자 출신 국회의원':'「유착의 길」 제안을 받아 끝(3단계)까지 간 뒤, 길의 끝 제안을 받아들인다',
 '클릭 공장장':'「기레기의 길」 제안을 받아 끝(3단계)까지 간 뒤, 길의 끝 제안을 받아들인다',
 '광장의 스타 유튜버':'「선동가의 길」 제안을 받아 끝(3단계)까지 간 뒤, 길의 끝 제안을 받아들인다',
 '홍보대행사 대표':'「청부 기사의 길」 제안을 받아 끝(3단계)까지 간 뒤, 길의 끝 제안을 받아들인다',
 '권력 감시의 상징':'「감시견의 길」을 끝(3단계)까지 걷고, 권력의 압박을 버틴다',
 '약자의 펜':'「약자의 목소리」 길을 끝(3단계)까지 걷는다',
 '팩트체크의 대명사':'「팩트의 파수꾼」 길을 끝(3단계)까지 걷는다',
 '어용 기자의 몰락':'「어용의 길」에서 위험(노출)이 끝까지 쌓이면 무너진다',
 '게이트 연루':'「유착의 길」에서 위험(노출)이 끝까지 쌓이면 수사에 휘말린다',
 '언론계 퇴출':'「기레기의 길」에서 위험(노출)이 끝까지 쌓이면 쫓겨난다',
 '가짜뉴스 유포자':'「선동가의 길」에서 위험(노출)이 끝까지 쌓이면 거짓이 드러난다',
 '기사 거래 적발':'「청부 기사의 길」에서 위험(노출)이 끝까지 쌓이면 장부가 드러난다',
 '펜이 꺾이다':'「감시견의 길」에서 압박이 한계에 이르렀을 때 「끝까지 쓴다」를 골랐다가 꺾인다',
 '데이터 저널리즘의 개척자':'전문 분야로 데이터를 골라 4단계까지 키우고, 10년 차 이상·평판 55 이상이면 제안이 온다(다른 「길」은 걷지 않는다)',
 '탐사보도의 전설':'전문 분야로 탐사를 골라 4단계까지 키우고 사건 파일을 2건 이상 해결한다. 10년 차 이상·평판 55 이상(다른 「길」은 걷지 않는다)',
 '간판 앵커':'전문 분야로 방송·앵커를 골라 4단계까지 키우고, 10년 차 이상·평판 55 이상이면 제안이 온다(다른 「길」은 걷지 않는다)',
 '시대의 논객':'전문 분야로 칼럼을 골라 4단계까지 키우고, 10년 차 이상·평판 55 이상이면 제안이 온다(다른 「길」은 걷지 않는다)',
 '르포 문학의 거장':'전문 분야로 르포를 골라 4단계까지 키우고, 10년 차 이상·평판 55 이상이면 제안이 온다(다른 「길」은 걷지 않는다)',
 '회장 은퇴 · 가족 승계':'그룹 소속 매체에서 사장을 거쳐 회장에 오르고, 「후계 구도」에서 가족 승계를 골라 은퇴한다',
 '회장 은퇴 · 이사회 승계':'그룹 소속 매체에서 사장을 거쳐 회장에 오르고, 「후계 구도」에서 이사회 승계를 골라 은퇴한다',
 '회장 은퇴 · 기자 출신 승계':'그룹 소속 매체에서 사장을 거쳐 회장에 오르고, 「후계 구도」에서 기자 출신 승계를 골라 은퇴한다'});
try{if(typeof END_ARCH!=='undefined'){const add=(i,n)=>{const a=END_ARCH.find(x=>x[0]===i);if(a&&!a[1].includes(n))a[1].push(n);};add(4,'창간 성공');add(6,'창업자 축출 · 경영권 상실');add(3,'편집국장의 퇴장');}}catch(e){}

// ===== 1.5 호재 기사의 상대: 이름이 안 나오는 호재도 관련 기관·광고주·인물이 반응한다 =====
// 예전엔 「가람 타이거즈 한국시리즈 진출」 「한빛대 의대 희귀질환 치료」처럼 등록된 상대 이름이 없는 호재는 관계 변화가 전혀 없었다
const POS43=[
 [/타이거즈|돌핀스|블루윙즈|이글스|베어스|자이언츠|위즈|야구|한국시리즈|투수|타자|홈런|구단/,['프로야구연맹','누리스포츠'],['에이스 선수','선수 에이전트']],
 [/FC|축구|K리그|월드컵|빅클럽|이적/,['축구협회','누리스포츠'],['국가대표 감독','에이스 선수']],
 [/농구/,['프로농구연맹'],['에이스 선수']],
 [/신기록|금메달|올림픽|선수상|메달|국가대표|체육|마라톤|시즌권|선수|관중|팬 투표|베테랑|은퇴 경기|통산|기록 새로/,['체육회','누리스포츠'],['올림픽 금메달리스트','에이스 선수']],
 [/영화|관객|OTT|드라마|흥행|천만/,['누리시네마','스트림원','콘텐츠진흥원'],['거장 감독','국민 배우']],
 [/연기 변신|배우|주연/,['콘텐츠진흥원'],['국민 배우','톱스타']],
 [/음반|음원|아이돌|앨범|월드 투어|콘서트|팬덤|빌보드|차트/,['음원 플랫폼 뮤직원','스타라인엔터','블루밍엔터'],['대형 기획사 대표','월드 투어 아이돌','팬덤 연합 대표']],
 [/예능|시청률/,['방송사 예능국'],['스타 예능 PD','톱스타']],
 [/전시|박물관|미술|갤러리|극장|아트센터|공연|문화재단|문화|축제|도서|출판|작가|국가유산|문화재/,['문화체육관광부','국립박물관','국립극장','예술위원회','국가유산청'],['미술관장','원로 작가']],
 [/소방|심폐소생|구했다|살려|불길|구조/,['소방청'],[]],
 [/이웃|어르신|동네|골목|무료 이발|봉사|기부|미담|주운 돈|장학금/,['광역시·도청'],['광역단체장','도지사']],
 [/의대|병원|의료|치료|수술|환자|질환|신약/,['보건복지부','건강보험공단'],[]],
 [/보건소|복지|돌봄|쉼터|저출산|출산|결식|도시락|한부모|생활비/,['보건복지부'],[]],
 [/초등|중학교|고등학교|학교|교사|학생|대학|교육|학력|성적/,['시·도 교육청','교육부'],[]],
 [/법원|판결|재판|법률/,['대법원','법률구조공단'],['법원행정처장']],
 [/경찰|보이스피싱|검거|범인|지구대|순찰|실종/,['경찰청'],['경찰청장','강력계 반장']],
 [/국회|협치|예산안|법안/,['국회사무처'],['국회의장']],
 [/통일부|재외국민|교민|대피|파병|외교|대사관/,['외교부','통일부','국방부'],['외교부 장관','주한 대사']],
 [/KOTRA|코트라|할랄|K-뷰티|중동|해외 진출|수출/,['무역협회','산업통상자원부'],[]],
 [/저축은행|은행|금융|보험|카드/,['은행연합회','금융위원회·금감원'],['시중은행장']],
 [/코스닥|상장사|신용등급|주가|증시|중소기업/,['중소벤처기업부','대한상공회의소'],['중견기업 회장']],
 [/중견기업|특허|국산화|양산|공장|설비|공정|탄소/,['대한상공회의소','산업통상자원부','중소벤처기업부'],['중견기업 회장']],
 [/공공임대|주거|아파트|분양|부동산|입주/,['국토교통부','광역시·도청'],[]],
 [/정부|OECD|물가|성장률|고용률|일자리/,['기획재정부','고용노동부'],[]],
 [/공익 신고|내부 고발|신고자/,['국민권익위원회'],['공익신고자 모임']],
 [/농협|상인|전통시장|마을 기업|지역 경제|지역 기업|지역에|주민|시청|군청|도청/,['광역시·도청','지방의회'],['광역단체장','도지사','농민회 대표']]];
function entByName43(n){const e=ENTS.find(x=>x[1]===n);return e&&S.net&&S.net[e[0]]?e[0]:null;}
function posResolve43(it){try{const txt=`${it.title||''} ${it.subj||''}`;
  // 1) 기사에 이름이 그대로 나오는 상대 (가장 긴 이름부터)
  const direct=ENTS.filter(e=>e[1].length>=2&&!/\(/.test(e[1])&&txt.includes(e[1])&&S.net&&S.net[e[0]]).sort((a,b)=>b[1].length-a[1].length)[0];
  let org=direct?direct[0]:null,per=null;
  const rule=POS43.find(r=>r[0].test(txt));
  if(!org&&rule){for(const n of rule[1]){const id=entByName43(n);if(id){org=id;break;}}}
  if(rule&&rule[2].length){const id=entByName43(pick(rule[2]));if(id&&id!==org)per=id;}
  if(!per&&org){const on=ENT[org]&&ENT[org].n;const p=on&&ENTS.find(e=>e[2]==='person'&&e[1].startsWith(on)&&S.net&&S.net[e[0]]);if(p)per=p[0];}
  return {org,per};}catch(e){return {org:null,per:null};}}
{const _pi43=posItem;posItem=function(){const it=_pi43.apply(this,arguments);try{if(it){const r=posResolve43(it);if(!it.ent&&r.org)it.ent=r.org;if(r.per&&r.per!==it.ent)it.ent2=r.per;}}catch(e){}return it;};}
{const _ph43=posEntHit;posEntHit=function(it,W,imp){try{if(it&&!it.ent){const r=posResolve43(it);if(r.org)it.ent=r.org;if(!it.ent2&&r.per&&r.per!==it.ent)it.ent2=r.per;}}catch(e){}
  let out=_ph43.apply(this,arguments)||'';
  try{const id=it&&it.ent2,e=id&&S.net&&S.net[id];if(e&&id!==it.ent){const was=e.known;e.known=true;const r0=e.rel;netUp(id,Math.min(6,Math.max(1.5,imp/10))*(W&&W.head==='bait'?.6:1));const got=Math.max(1,Math.round(e.rel-r0));out=(out?out+' · ':'')+`${jo2(entName(id),'과','와')}의 관계 +${got}${was?'':' (나를 알게 됐다)'}`;}}catch(e){}
  return out;};}

// ===== 1.5 호재 기사엔 중재위·소송·반격이 붙지 않는다 =====
// 칭찬받은 쪽이 정정보도를 청구할 리 없다. 호재 기사의 실수는 「부풀린 받아쓰기」로 돌아온다
{const _mc43=medCheck;medCheck=function(it){if(it&&it.pos)return;return _mc43.apply(this,arguments);};}
{const _cp43=ctrPick;ctrPick=function(it){if(it&&it.pos)return null;return _cp43.apply(this,arguments);};}
{const _sc43=scandal;scandal=function(p){let pos=!!(p&&p.pos);try{if(!pos&&p&&p.title){const c=(S.clips||[]).find(x=>x.h===p.title);pos=!!(c&&c.pos);}}catch(e){}
  if(!pos)return _sc43.apply(this,arguments);
  calmSet(8);S.errors++;S.lastError=S.turn;(S.errT=S.errT||[]).push(S.turn);if(S.errT.length>20)S.errT.shift();
  const who=p.desk?'데스크로서 놓친 호재 기사':'내 호재 기사';try{const c0=(S.clips||[]).find(x=>x.h===p.title);if(c0){c0.flDone=1;c0.corr=c0.corr||'정정보도';}}catch(e){}
  openModal('부풀린 호재 기사',`<p class="lede">${who} 「${esc(p.title)}」 속 숫자와 내용이 실제와 달랐다. 경쟁사가 바로잡는 기사를 냈고, 댓글엔 「보도자료 받아쓰기」라는 말이 붙었다. ${p.why&&p.why.length?'문제가 된 부분: '+esc(p.why.join(' · '))+'.':'확인이 덜 된 성과를 그대로 썼다.'}</p>${tipN('호재 기사도 홍보실 자료만 믿지 말고 숫자는 따로 확인하자.')}`,[
    {label:'바로잡는 기사를 낸다',sub:'빨리 털고 간다 · 신뢰 조금↓',fn:()=>{const k=(p.desk?.5:1)*honestK()*(S.simple?.7:1);(S.corrLog=S.corrLog||[]).push({h:p.title,k:'정정',t:S.turn});toast(apply({trust:-2*k,eval:-1.2*k,fame:-.8*k}));log(`호재 기사 정정: ${p.title}`);}},
    {label:'모른 척 넘어간다',risk:true,sub:'넘어갈 수도, 「홍보 매체」 낙인이 붙을 수도',fn:()=>{if(chance(.5)){toast('조용히 묻혔다');log(`호재 기사 오류 무마: ${p.title}`);}else{const kk=(p.desk?.5:1)*(S.simple?.7:1);toast('독자권익위원회가 「받아쓰기 기사」로 지적했다 · '+apply({trust:-5*kk,eval:-3*kk,fame:-1.5*kk}));try{portalPen(1,'홍보성 기사 오류');}catch(e){}log(`호재 기사 오류 지적: ${p.title}`);}}}]);};}

// ===== 1.5 호재 기사엔 어떤 경로로도 소송·조정이 걸리지 않는다 (마지막 안전장치) =====
function posClip43(h){if(!h)return false;h=String(h);const c=(S.clips||[]).find(x=>x.h===h||(x.h&&h.length>=8&&(x.h.startsWith(h)||h.startsWith(x.h))));return !!(c&&c.pos);}
function critClip43(){const c=(S.clips||[]).find(x=>!x.pos&&!x.staff&&x.crit&&S.turn-(x.turn||0)<=YW);return c||null;}
{const _se43=suitEvent;suitEvent=function(p){try{if(p&&posClip43(p.title)){const c=critClip43();if(!c||p.wrong)return closeModal();p={...p,title:c.h};}}catch(e){}return _se43.call(this,p);};}
{const _md43=mediation;mediation=function(m){try{if(m&&posClip43(m.h))return closeModal();}catch(e){}return _md43.apply(this,arguments);};}
{const _lw43=lawsuit;lawsuit=function(m){try{if(m&&posClip43(m.h))return closeModal();}catch(e){}return _lw43.apply(this,arguments);};}
{const _dm43=delMonth;delMonth=function(){try{if(S.delSuit)S.delSuit=S.delSuit.filter(x=>!posClip43(x.h));}catch(e){}return _dm43.apply(this,arguments);};}
{const _df43=delFx;delFx=function(k,o,c){const r=_df43.apply(this,arguments);try{if(c&&c.pos&&o==='keep'){S.delSuit=(S.delSuit||[]).filter(x=>x.h!==c.h);r.t=String(r.t||'').replace(/ [^.]*쪽이 언론중재위원회에 조정을 신청하겠다고 한다\./,'');}}catch(e){}return r;};}

// ===== 1.5 할 일 카드: 행동력 소모를 글자로 (간결한 화면) =====
{const _af43=actFx;actFx=function(id){const h=_af43.apply(this,arguments);let ac=1;try{ac=actCost(id);}catch(e){}const chip=`<i class="ap42${ac>=2?' hi':''}">${ac?'행동력 '+ac:'무료'}</i>`;return h?h.replace('<span class="afx">','<span class="afx">'+chip):`<span class="afx">${chip}</span>`;};}

// ===== 1.5 호재 기사엔 「반론」이 아니라 「코멘트」 =====
// 칭찬받는 쪽에 반론을 받을 일은 없다. 호재 아이템을 취재·작성할 때는 반론 문구를 모두 「공식 코멘트」로 바꾼다
window.__pos43=false;
function pos43Txt(t){if(typeof t!=='string'||!t.includes('반론'))return t;return t.replace(/반론과 자백을 노린다/g,'직접 만나 이야기를 듣는다').replace(/서면 질의\(반론 요청\)/g,'공식 코멘트 요청').replace(/반론 기회를 주고 마무리/g,'공식 코멘트를 받고 마무리').replace(/반론은 왜 없음\?/g,'좋은 소식이네요').replace(/반론보도/g,'정정보도').replace(/반론을/g,'코멘트를').replace(/반론이/g,'코멘트가').replace(/반론은/g,'코멘트는').replace(/반론과/g,'코멘트와').replace(/반론으로/g,'코멘트로').replace(/반론/g,'코멘트');}
{const _om43=openModal;openModal=function(t,b,c){try{if(window.__pos43&&S&&['invest','write','desk'].includes(S._curAct)){t=pos43Txt(t);b=pos43Txt(b);if(Array.isArray(c))c=c.map(x=>x?Object.assign({},x,{label:pos43Txt(x.label),sub:pos43Txt(x.sub)}):x);}}catch(e){}const r=_om43.call(this,t,b,c);try{if(window.__pos43&&S&&['invest','write','desk'].includes(S._curAct))document.querySelectorAll('#mb .wstep span').forEach(x=>{if(x.textContent.includes('반론'))x.textContent=pos43Txt(x.textContent);});}catch(e){}return r;};}
{const _ss43=session;session=function(it){window.__pos43=!!(it&&it.pos);return _ss43.apply(this,arguments);};}
{const _iv43=interview;interview=function(it){window.__pos43=!!(it&&it.pos);return _iv43.apply(this,arguments);};}
['writeAngle','writeLead','writeFacts','writeHead','writeHeadList','writeFinish','writeSimple'].forEach(n=>{try{const f=window[n];if(typeof f!=='function')return;window[n]=function(W){window.__pos43=!!(W&&W.it&&W.it.pos);return f.apply(this,arguments);};}catch(e){}});

// ===== 1.5 부서 분위기 미션: 챙긴 횟수로 센다 =====
// 예전엔 「부서 평균 관계 +3」이라 한 사람과 점심을 먹어도 평균이 0.5밖에 안 올랐고, 달 중 관계가 저절로 식거나 사람이 바뀌면 다시 내려가 깨기 어려웠다
try{MIS_DEF.moodUp={h:'부서 사람들과(점심·노하우·가르쳐 주기·공동 취재) · 월급 쓰기 › 생활과 사람의 회식·간식',v:x=>x.m2?((S.moodAct||0)-(x.b||0)):Math.floor(deptStat().mood-x.b)};}catch(e){}
const MOOD43=/^(점심|노하우 전수|가르쳐 줌|공동 취재|원고 검토|정보 교환|취재원 소개|제자|고민 상담|부서 회식|간식|회식)$/;
{const _mr43=mRel;mRel=function(m,v,why){const r=_mr43.apply(this,arguments);try{if(v>0&&why&&MOOD43.test(why)&&S&&!S.story){const team=why==='부서 회식'||why==='간식'||why==='회식';const key=team?`${why}:${S.turn}`:`${why}:${m&&m.name}:${S.turn}`;S._moodK=S._moodK||{};if(!S._moodK[key]){S._moodK[key]=1;S.moodAct=(S.moodAct||0)+(why==='부서 회식'?2:1);const ks=Object.keys(S._moodK);if(ks.length>40)delete S._moodK[ks[0]];try{misCheck();}catch(e){}}}}catch(e){}return r;};}
{const _ru43=relUp;relUp=function(c,v,why){const r=_ru43.apply(this,arguments);try{if(c&&v>0&&S&&!S.story&&S._curAct==='colleague'){const key=`col:${c.name}:${S.turn}`;S._moodK=S._moodK||{};if(!S._moodK[key]){S._moodK[key]=1;S.moodAct=(S.moodAct||0)+1;try{misCheck();}catch(e){}}}}catch(e){}return r;};}

// ===== 1.5 내 담당 권역: 「수도권 담당」이면 인천·경기는 내 지역이다 =====
// 예전엔 지역 이름 끝 글자만 비교해서 「수도권 담당」 기자가 인천·경기 기사를 쓸 때도 「주재기자에게 전화」가 떴다
const MACRO43={'수도권':['인천','경기','경인'],'충청권':['대전','세종','충남','충북','청주','중원','충청'],'호남권':['광주','전남','전북','전주','서남','호남'],'영남권':['대구','경북','부산','울산','경남','창원','남부','동해','영남'],'강원·제주권':['강원','춘천','제주','설악','탐라']};
function regMine43(reg){try{if(!S||!S.region||!reg)return false;const my=String(S.region);if(my.includes(String(reg).split(' ').pop()))return true;const toks=String(reg).split(/[·\s]+/).filter(t=>t.length>=2);for(const k in MACRO43){if(my.includes(k)&&toks.some(t=>MACRO43[k].some(x=>t.includes(x))))return true;}return false;}catch(e){return false;}}

// ===== 1.5 AI 기자의 영업력: 광고 실적이 각자 영업력을 따른다 =====
// 예전엔 종합 실력·성향만 봐서 누가 영업을 잘하는지 드러나지 않았다. 이제 기자마다 영업력이 있고(인맥·연차·성향·타고난 수완), 실적 폭이 그만큼 벌어진다. 평균은 거의 그대로(약 +4%)
function npcSal43(m){try{if(!m)return 50;m.st=m.st||{};if(m.st.sal==null){let h=0;for(const ch of String(m.id||m.name||''))h=(h*37+ch.charCodeAt(0))>>>0;const a=m.ai||{};const net=m.st.net??(m.skill||50);
    m.st.sal=Math.round(clamp(net*.45+(m.skill||50)*.3+12+((h%25)-12)+(a.y==='sales'?10:a.y==='fact'?-4:0)+Math.min(3,m.r||0)*2,20,90));}return m.st.sal;}catch(e){return 50;}}
{const _ab43=npcAbil;npcAbil=function(m,a){const base=_ab43.apply(this,arguments);try{const sal=npcSal43(m);const sf=clamp(.97+(sal-50)/90,.72,1.25);return clamp(base*.45+sf*.55,.75,1.25);}catch(e){return base;}};}

// ===== 1.5 호재 아이템: 비판 아이템과 반반 · 레퍼런스 대폭 추가 =====
const POS_SPEC43=`pol|deal|{S}, 민생 법안 {n}건 한꺼번에 합의|40|pol_d
pol|deal|{S} 청년 주거 지원법 만장일치 통과|38|pol_d
pol|deal|{S}, 재난 예산 추경 하루 만에 처리|36|pol_d
pol|deal|{S} 상임위, 회의록 전면 공개 합의|30|pol_d
pol|deal|{S}, 의원 특권 축소안 처리…세비 동결|34|pol_d
pol|policy|{S}, 규제 {n}건 정비…민원 처리 기간 절반|32|pol_g
pol|policy|{S} 공공 데이터 개방 확대…앱 {n}개 탄생|28|pol_g
pol|policy|{S}, 재난 문자 오발송 0건 1년 이어 가|26|pol_g
pol|policy|{S} 국민 제안 {n}건 실제 정책으로|30|pol_g
pol|award|{S}, 국제 투명성 평가 순위 {n}계단 올라|34|pol_g
pol|pper|{S}, 지역구 민원 {n}건 직접 해결|28|pol_p
pol|pper|{S} 의정 활동 우수 의원 선정|30|pol_p
pol|pper|{S}, 장애인 이동권 법안 끝까지 챙겨 통과|32|pol_p
pol|pper|{S} 후원금 전액 사회 환원|30|pol_p
pol|pper|{S}, 초당적 연구모임 꾸려 첫 법안|28|pol_p
int|record|{S}, 해외 수주 사상 최대|42|int_co
int|record|{S} 현지 점유율 {n}% 돌파…1위 올라|38|int_co
int|share|{S}, 지진 피해국에 구호 물품 {n}톤 보내|30|int_n
int|share|{S} 현지 학교 {n}곳에 도서관 지어|26|int_n
int|person|{S}, 산불 현장에서 이웃 구했다|30|int_p
int|person|{S} 현지 의료 봉사 {y}년째|28|int_p
int|award|{S}, 현지 정부 훈장 받았다|30|int_u
int|award|{S} 국제학회 최우수 논문상|30|int_u
int|pper|{S}, 현지 의회 첫 당선|34|int_e
int|policy|{S}, 재외국민 영사 서비스 대기 시간 절반|28|int_g
int|policy|{S} 교민 안전 대피 신속 지원 호평|30|int_g
int|deal|{S}, 이웃 나라와 청년 교류 협정 맺어|30|diplo|diplo
int|deal|{S} 항공 자유화 협상 타결…노선 {n}개 늘어|34|diplo|diplo
int|policy|{S}, 해외 파병 부대 현지 주민 호평|28|diplo|diplo
int|deal|{S} 6년 만에 정상회담 정례화 합의|38|diplo|diplo
cul|record|{S} 관람객 {n}만 명…개관 이래 최다|34|cul_i
cul|event|{S}, 야간 개장 시민 {n}만 명 몰려|30|cul_i
cul|policy|{S} 장애인 관람 지원 확대 호평|26|cul_i
cul|award|{S}, 해외 영화제 작품상|40|cul_w
cul|record|{S} 개봉 {n}주째 박스오피스 1위|36|cul_w
cul|record|{S}, OTT 글로벌 순위 {n}위|34|cul_w
cul|award|{S} 해외 문학상 최종 후보|36|cul_b
cul|record|{S}, {n}쇄 찍었다…서점가 돌풍|30|cul_b
cul|record|{S} 전 회차 매진…연장 공연 확정|30|cul_m
cul|award|{S}, 국제 공연예술제 초청|30|cul_m
cul|person|{S}, 50년 모은 작품 미술관에 기증|30|cul_p
cul|award|{S} 국제 콩쿠르 우승|38|cul_p
cul|person|{S}, 시골 학교 아이들에 무료 레슨 {y}년|26|cul_p
cul|share|{S}, 지역 예술인 {n}명 창작 지원|26|cul_co
cul|policy|{S} 문화누리카드 이용률 역대 최고|26|cul_g
spo|sport|{S}, {n}연승 질주…선두 굳혀|36|spo_t
spo|sport|{S} 창단 첫 우승|40|spo_t
spo|sport|{S}, 꼴찌에서 플레이오프 진출|36|spo_t
spo|record|{S} 시즌 최다 관중 기록|30|spo_t
spo|record|{S}, 아시아 신기록|40|spo_p
spo|award|{S} 이달의 선수 선정|28|spo_p
spo|person|{S}, 상금 전액 유소년 팀에 기부|30|spo_p
spo|person|{S} 부상 딛고 1년 만에 복귀 골|32|spo_p
spo|sport|{S}, 데뷔전서 결승골|32|spo_y
spo|award|{S} 신인왕 유력…압도적 기록|30|spo_y
spo|policy|{S}, 생활체육 시설 {n}곳 무료 개방|24|spo_g
spo|share|{S}, 유소년 축구 교실 무료 운영|24|spo_co
spo|sport|{S} 9회 말 역전 끝내기…{n}연패 탈출|32|base|base
spo|record|{S}, 시즌 최다 홈런 신기록|36|base_p|base
spo|record|{S} 완봉승…평균자책점 1위|32|base_p|base
spo|sport|{S}, 원정 무패 행진 {n}경기|30|foot|foot
spo|record|{S} 유럽 무대 시즌 {n}호골|36|foot|foot
loc|event|{S} 축제 방문객 {n}만 명…역대 최다|32|loc_e
loc|event|{S}, 야시장 개장 첫 주 상인 매출 두 배|28|loc_e
loc|policy|{S}, 공공 배달앱으로 소상공인 수수료 절반|30|loc_g
loc|policy|{S} 청년 정착 지원…전입 {n}명 늘어|30|loc_g
loc|policy|{S}, 버스 노선 개편 후 출퇴근 시간 {n}분 줄어|26|loc_g
loc|hire|{S}, 지역 청년 {n}명 정규직 채용|32|loc_co
loc|share|{S} 지역 학교에 장학금 {m}억 원|26|loc_co
loc|person|{S}, 폐교를 마을 도서관으로 되살려|28|loc_p
loc|person|{S} 홀몸 어르신 반찬 나눔 {y}년|24|loc_p
loc|person|{S}, 귀농 5년 만에 마을 소득 두 배|28|loc_p
loc|policy|{S} 의회, 의원 해외 연수 전면 폐지|28|city|city
loc|policy|{S}, 주민참여예산 {n}건 실제 집행|26|city|city
loc|record|{S} 관광객 {n}만 명 돌파|30|nat|nat
loc|policy|{S}, 지방 소멸 대책 우수 사례 선정|28|nat|nat
loc|event|{S} 농산물 직거래 장터 {n}억 원 매출|26|loc_e|sigun
loc|person|{S}, 마을 버스 직접 몰아 어르신 병원길|26|loc_p|sigun
ent|record|{S}, 데뷔 앨범 초동 {n}만 장|34|ent_a
ent|record|{S} 월드 투어 전석 매진|36|ent_a
ent|award|{S}, 연말 시상식 대상|38|ent_a
ent|share|{S} 팬클럽 이름으로 {m}억 원 기부|28|ent_a
ent|record|{S} 시청률 {n}% 돌파…주말 1위|32|ent_c
ent|award|{S}, 국제 에미상 후보|36|ent_c
ent|record|{S} 해외 {n}개국 판권 판매|30|ent_c
ent|person|{S}, 무명 시절 동료들 공연 직접 후원|26|ent_p
ent|award|{S} 인생 연기 호평…주연상 수상|32|ent_p
ent|share|{S}, 연습생 처우 개선안 업계 첫 도입|30|ent_co
soc|person|{S}, 불길 속 이웃 할머니 업고 나왔다|32|soc_p
soc|person|{S} 주운 지갑 돌려주고 사례금도 사양|22|soc_p
soc|person|{S}, 동네 아이들 무료 공부방 {y}년|26|soc_p
soc|policy|{S}, 고독사 예방 사업으로 {n}명 구했다|30|soc_g
soc|policy|{S} 무더위 쉼터 {n}곳 24시간 운영|24|soc_g
soc|record|{S}, 실종 아동 {n}명 전원 가족 품으로|30|soc_gp
soc|policy|{S} 보이스피싱 피해 {n}% 줄였다|28|soc_gp
soc|share|{S}, 결식 아동 도시락 {n}만 개 전달|26|soc_co
soc|tech|{S}, 희귀질환 치료법 세계 첫 성공|40|soc_h
soc|policy|{S} 야간 소아 진료 시작…부모들 환영|28|soc_h
soc|policy|{S}, 전학 온 다문화 학생 적응 프로그램 호평|24|edu|edu
soc|record|{S} 졸업생 취업률 {n}%…역대 최고|28|edu|edu
soc|policy|{S}, 기초학력 지원 1년…성적 올랐다|26|edu|edu
soc|policy|{S} 장애인 재판 지원 제도 첫 도입|26|court|court
soc|policy|{S}, 판결문 쉬운 말 쓰기 정착|22|court|court
soc|record|{S} 무료 법률 상담 {n}만 건 돌파|24|court|court
soc|record|{S}, 미제 사건 {y}년 만에 해결|34|case|case
soc|person|{S} 순찰 중 쓰러진 시민 심폐소생술로 살려|28|case|case
soc|policy|{S}, 응급실 대기 시간 절반으로|30|med|med
soc|tech|{S} 국내 첫 로봇 수술 {n}건 성공|30|med|med
soc|share|{S}, 오지 마을 무료 진료 {y}년째|26|med|med
eco|record|{S}, 수출 {n}억 달러 돌파…역대 최대|40|ind|ind
eco|tech|{S} 핵심 소재 국산화 성공|38|ind|ind
eco|hire|{S}, 지방 공장 증설…{n}00명 채용|34|ind|ind
eco|policy|{S}, 소상공인 대출 금리 인하|28|fin|fin
eco|share|{S} 고령층 전용 창구 호평|24|fin|fin
eco|record|{S}, 주가 사상 최고…시가총액 {n}조|36|stock|stock
eco|perf|{S} 배당 {n}% 늘린다…주주 환원 확대|30|stock|stock
eco|policy|{S}, 공공임대 입주 만족도 역대 최고|26|estate|estate
eco|record|{S} 전세 사기 피해 지원 {n}명 구제|28|estate|estate
eco|tech|{S}, AI 번역 정확도 세계 1위|36|it|it
eco|record|{S} 앱 다운로드 {n}만 돌파|30|it|it
eco|tech|{S}, 개인정보 보호 인증 최고 등급|28|it|it
eco|policy|{S}, 중소기업 수출 바우처 {n}곳 지원|28|eco_gov
eco|record|{S} 일자리 사업 참여자 {n}% 취업|28|eco_gov`;
try{const have=new Set(POS_TPL.map(t=>t.raw||t.t));let add=0;POS_SPEC43.trim().split('\n').forEach(l=>{const [c,k,t,imp,sk,sd]=l.split('|');if(have.has(t))return;const L=POS_SUBJ[sk];if(L&&t.includes('{S}'))L.forEach(s=>{POS_TPL.push({c,k,t:t.replace('{S}',s),raw:t,s,sk,imp:+imp,sd:sd||null});add++;});else{POS_TPL.push({c,k,t:t.replace('{S}',sk),s:sk,sk:'',imp:+imp,sd:sd||null});add++;}});window.__posAdd43=add;}catch(e){console.error(e);}
// 호재가 들어올 확률: 예전 약 30% → 약 50% (탐사팀은 여전히 비판 위주)
{const _pr43=posRate;posRate=function(d0){const p=_pr43.apply(this,arguments);if(!p)return p;if(d0==='inv')return .18;return clamp(p+.22,.25,.7);};}

// ===== 1.5 포털 「많이 본 뉴스」 순위: 웬만한 기사는 순위권 밖, 특종이어야 위로 =====
// 예전엔 평범한 기사도 대부분 10~14위에 올랐다. 이제 매체 체급이 더 크게 작용하고, 평범한 기사는 30위 언저리이거나 순위권(50위) 밖이다
{const _r0=portalRank;portalRank=function(imp,q,excl,gr,mult,p){try{const gk={S:1.8,A:1.35,B:1.1}[gr]||1;const sc=Math.max(1,(imp||20)*(excl?1.3:1)*gk*(.55+(q||50)/220)*(mult||1)*(.45+(p||3)*.15)*(typeof portalMult==='function'?portalMult():1)*(.8+Math.random()*.4));return clamp(Math.round(128-25*Math.log(sc)),1,60);}catch(e){return _r0.apply(this,arguments);}};}

// ===== 1.5 봉투 다시 짜기 =====
// 예전: 받으면 150만 원에 신뢰 -8, 그리고 반드시(100%) 들켜 신뢰 -20·평가 -15·평판 -10 — 고를 이유가 없는 함정이었다. 돌려주기만 하면 매번 신뢰 +3이라 오히려 봉투가 신뢰 공장이었다
// 이제: 금액은 상대 체급·아이템 크기를 따르고, 받는 방식에 따라 대가와 들킬 확률이 다르다. 돌려줄 때 얻는 신뢰는 여러 번 하면 줄어든다. 호재 기사에도 「잘 부탁드린다」는 홍보 촌지가 온다
function bribeAmt43(it){const g=gradeOf(it);const E=it.ent&&ENT[it.ent];const big=E&&(E.w||0)>=.008;let a=({S:300,A:180,B:100,C:50})[g]||80;if(big)a*=1.5;if(it.pos)a*=.4;return Math.round(a*(.8+Math.random()*.4)/10)*10;}
function bribeEvent(it){it.bribed=1;const amt=bribeAmt43(it),who=esc(sbjN(it.subj)),pos=!!it.pos,ref=S.bribeRef||0,n=S.bribeN||0;
  const expo=k=>clamp(k+n*.08+(gradeOf(it)==='S'?.08:0)-(S.st&&S.st.net?S.st.net/600:0),.05,.75);
  const take=(k,fx,note)=>{S.money+=amt*(fx.m||1);S.bribeN=n+1;if(it.ent&&S.net&&S.net[it.ent])netUp(it.ent,fx.rel||0);const p=expo(k);if(chance(p))S.pending.push({type:'bribe',due:S.turn+R(8,30),title:it.title,amt:Math.round(amt*(fx.m||1)),how:fx.how});log(note);return apply({trust:fx.trust||0});};
  const lede=pos?`${who} 홍보 담당자가 저녁 자리를 마무리하며 봉투를 내밀었다. "기사 잘 부탁드립니다. 차비라도 하세요." 얼핏 봐도 ${amt}만 원은 돼 보인다.`:`${who} 측 인사가 저녁을 청했다. 헤어질 때 두툼한 봉투를 내밀었다. "기자님 고생하시는데 차비라도." 얼핏 봐도 ${amt}만 원은 돼 보인다.`;
  const C=[
   {label:'정중히 돌려준다',sub:`신뢰↑${ref>=2?' (이미 여러 번 거절해 조금만)':''} · 상대는 머쓱해한다`,fn:()=>{S.bribeRef=ref+1;if(it.ent&&S.net&&S.net[it.ent])netUp(it.ent,-2);toast(apply({trust:Math.max(.4,1.6-ref*.4)}));log('취재 대상의 봉투를 돌려줬다');}}];
  if(!pos)C.push({label:'돌려주고 회유 시도까지 기사에 쓴다',sub:'파급력↑ · 신뢰↑ · 평판↑ · 상대와는 척을 진다',fn:()=>{it.imp=Math.round(it.imp*1.12);it.alert=clamp(it.alert+15,0,100);if(it.ent&&S.net&&S.net[it.ent])netUp(it.ent,-15);toast(apply({trust:2,fame:.8}));log('회유 시도까지 기록했다');}});
  C.push({label:'회사에 신고하고 봉투를 증거로 넘긴다',sub:`독립성↑ · 평가 조금↑${pos?'':' · 회유 증거가 사실 하나로 붙는다'} · 상대와 크게 틀어진다`,fn:()=>{if(!pos){const f=it.facts.find(x=>!fOK(x));if(f){f.conf=Math.max(f.conf,f.need);f.via.push('회유 증거');}}if(it.ent&&S.net&&S.net[it.ent])netUp(it.ent,-20);try{valN('ind',5,'봉투를 신고했다');}catch(e){}toast(apply({trust:2.5,eval:1}));log('받은 봉투를 회사 윤리위원회에 신고했다');}});
  C.push({label:pos?`받고 기사를 좀 더 띄워 준다 (+${amt}만 원)`:`받고 기사 수위를 낮춘다 (+${amt}만 원)`,risk:true,sub:`돈↑ · 상대와 가까워진다 · ${pos?'홍보성 기사 눈총':'파급력↓'} · 들킬 확률 약 ${Math.round(expo(.22)*100)}%`,fn:()=>{if(!pos)it.imp=Math.round(it.imp*.75);else it.imp=Math.round(it.imp*1.05);toast(take(.22,{trust:-2,rel:10,how:'soft'},`${who} 측 봉투를 받았다`));}});
  if(!pos)C.push({label:`받고 기사를 접는다 (+${Math.round(amt*1.6)}만 원)`,risk:true,sub:`돈↑↑ · 아이템이 사라진다 · 상대가 크게 반긴다 · 들킬 확률 약 ${Math.round(expo(.35)*100)}%`,fn:()=>{S.items=S.items.filter(x=>x!==it);try{valN('ind',-8,'돈을 받고 기사를 덮었다');}catch(e){}toast(take(.35,{trust:-4,rel:20,m:1.6,how:'kill'},`${who} 측 돈을 받고 기사를 접었다`));}});
  openModal('봉투',`<p class="lede">${lede}</p><p class="hint">청탁금지법 한도(식사 3만 원·선물 5만 원)를 훌쩍 넘는다. 받은 봉투는 언젠가 드러날 수 있다 — 받는 횟수가 늘수록, 사건이 클수록 더 쉽게.</p>`,C);}
function bribeOut(p){const amt=p.amt||150,kill=p.how==='kill',k=(kill?1.3:1)*(1+Math.min(2,(S.bribeOutN||0))*.35);S.bribeOutN=(S.bribeOutN||0)+1;
  openModal('봉투가 드러났다',`<p class="lede">「${esc(p.title)}」 취재 당시 받은 ${amt}만 원이 다른 매체 보도로 드러났다.${kill?' 기사를 접은 대가였다는 정황까지 나왔다.':''} 회사가 감사에 착수했다.</p>`,[
   {label:'사실을 인정하고 돈을 돌려준다',sub:'신뢰·평가가 크게 깎이지만 덜 다친다',fn:()=>{S.money-=amt;toast(apply({trust:-(6+amt/60)*k,eval:-(5+amt/80)*k,fame:-3*k}));log('봉투 수수를 인정하고 반납했다');}},
   {label:'"차비 정도였다"고 버틴다',risk:true,sub:'운이 좋으면 묻힌다 · 아니면 징계까지',fn:()=>{if(chance(kill?.2:.4)){toast('감사가 흐지부지 끝났다 · '+apply({trust:-3}));log('봉투 의혹 — 흐지부지');}else{toast('징계위원회 회부 · '+apply({trust:-(12+amt/40)*k,eval:-(10+amt/50)*k,fame:-6*k}));log('봉투 수수 — 징계');}}}]);}

// ===== 1.5 이직하면 부서를 고르거나 배정받는다 =====
// 예전엔 같은 이름의 부서가 있으면 그대로, 없으면 비슷한 부서로 자동 배치됐다. 이제 새 회사 인사팀이 경력을 보고 배정하고, 이름값이 있거나 작은 회사로 가면 원하는 부서를 고를 수 있다. 큰 회사에선 원하는 부서를 「요청」하고 받아들여질지 본다
function xferDept43(o,prevP,free){try{if(!S||S.story||S.founder||S.rank<1||S.rank>5||S.op)return closeModal();const L=o.depts.filter(d=>DEPTS[d]);if(L.length<2)return closeModal();const cur=S.dept;
  const acc=d=>{const [t]=deptTier(d);return free?1:({A:.35,B:.6,C:.8,D:.95})[t]||.7;};
  const go=(d,ok)=>{const prev=S.dept;if(ok&&d!==prev){S.dept=d;if(S.rank>=4)S.area=AREAS[cat1(d)];if(REGION_DEPTS.includes(d))S.region=pickRegion();if(S.rank>=2){try{S.team=genTeam();}catch(e){}}S.deptHist=S.deptHist||[];if(!S.deptHist.includes(d))S.deptHist.push(d);S.deptT=S.turn;}};
  const C=[{label:`회사 배정대로 — ${DEPTS[cur].n}`,rec:true,sub:`경력을 살린 자리 · 첫 고과↑ · ${deptPCtxt(cur,true)}`,fn:()=>{toast(`${DEPTS[cur].n}에서 새 출발 · `+apply({eval:1}));log(`${o.n} ${DEPTS[cur].n} 배치`);}}];
  L.filter(d=>d!==cur).forEach(d=>{const p=acc(d);C.push({label:free?jo2(DEPTS[d].n,'으로','로')+' 간다':jo2(DEPTS[d].n,'을','를')+' 요청한다',sub:`${free?'원하는 대로 간다':`받아 줄 확률 약 ${Math.round(p*100)}%`} · ${deptPCtxt(d,true)}`,fn:()=>{if(chance(p)){go(d,true);toast(`${DEPTS[d].n} 발령`);log(`${o.n} ${DEPTS[d].n} 배치 (희망 부서)`);}else{toast(`인사팀: "이번엔 어렵습니다. ${DEPTS[cur].n}에서 시작하시죠." · `+apply({eval:-.5}));log(`${o.n} 희망 부서 요청 불발 — ${DEPTS[cur].n}`);}}});});
  openModal('새 회사 · 부서 배치',`<p class="lede">${esc(o.n)} 인사팀: "경력을 보고 <b>${esc(DEPTS[cur].n)}</b>에 자리를 마련했습니다.${free?' 원하시는 부서가 있으면 말씀하세요.':' 희망 부서가 있으면 요청은 받아 보겠습니다.'}"</p><p class="hint">${free?(S.fame>=45?'이름값이 있어 회사가 원하는 자리를 내준다.':S.rank>=4?'간부로 오는 자리라 부서를 고를 수 있다.':'더 작은 회사로 오는 거라 원하는 자리를 내준다.'):'인기 부서일수록 요청이 받아들여지기 어렵다. 거절당하면 배정 부서로 간다.'}</p>`,C);}catch(e){console.error(e);closeModal();}}
{const _tr43=transfer;transfer=function(o,rank){const prevP=(OUT()||{}).p||3;const r=_tr43.apply(this,arguments);try{if(!S.story&&!S.founder&&S.rank>=1&&S.rank<=5&&!S.op&&!S._auto){const free=S.fame>=45||S.rank>=4||(o.p||3)<prevP;Q.unshift(()=>xferDept43(o,prevP,free));}}catch(e){}return r;};}

// ===== 1.5 플레이어 광고 영업: 실적 요구에 맞춰 유동적으로 =====
// 반기 내 몫 대비 페이스를 본다. 한참 앞서 있으면 광고주 예산이 빠듯해져 계약이 작아지고 성사도 조금 어려워진다. 뒤처지면 평소대로(조금 수월하게). 목표 몫이 없는 직급은 그대로
function adPace43(){try{if(!S||S.founder||!S.co)return 1;const own=quotaOwn();if(!(own>0))return 1;const k=Math.max(1,qMon());const exp=own*Math.min(1,(k+1)/QM);return (myAdDirect()+.0001)/Math.max(.01,exp);}catch(e){return 1;}}
function adDyn43(){const r=adPace43();return r>=2?.5:r>=1.5?.65:r>=1.15?.82:r<=.6?1.08:1;}
function adDynP43(){const r=adPace43();return r>=2?.8:r>=1.5?.88:r>=1.15?.95:r<=.6?1.04:1;}
{const _adP43=adP;adP=function(){return clamp(_adP43.apply(this,arguments)*adDynP43(),0,.97);};}

// ===== 1.5 AI 기자도 일하면서 큰다 =====
// 연차 곡선 말고도, 이달 기사를 쓰거나 영업을 뛴 기자는 조금씩 실력이 붙는다(1년에 약 +1~2). 실력 좋은 부서장 밑이면 더 빨리
{const _em43=endMonth;endMonth=function(){try{if(S&&S.phase==='game'&&!S.story&&!S.founder&&S.co){const per=roster();Object.entries(per).forEach(([d,L])=>{if(!DEPTS[d])return;const h=(L||[]).find(m=>m&&(m.r||0)>=2);const hk=h&&(h.skill||50)>=62?1.3:1;(L||[]).forEach(m=>{if(!m||(m.skill||0)>=90)return;const a=m.ai||{};const worked=(a.arts||0)>0||(a.sl||0)>0||chance(.35);if(worked&&chance(.3*hk)){m.skill=+Math.min(92,(m.skill||40)+R(3,6)/10).toFixed(2);}});});}}catch(e){}return _em43.apply(this,arguments);};}
{const _om44=openModal;openModal=function(t,b,c){try{if(t==='광고·협찬 영업'&&typeof b==='string'){const d=adDyn43();if(d<1)b+=`<p class="hint" style="color:var(--sodium)">이번 반기 내 몫을 이미 ${Math.round(adPace43()*100)}% 페이스로 앞서 있다 — 광고주 예산이 빠듯해 계약이 작아진다(약 ${Math.round(d*100)}%). 반기가 바뀌면 다시 넉넉해진다.</p>`;else if(d>1)b+=`<p class="hint" style="color:var(--good)">이번 반기 내 몫보다 뒤처져 있다 — 광고주가 조금 더 잘 들어준다.</p>`;}}catch(e){}return _om44.call(this,t,b,c);};}

// ===== 1.5 지역 부서(전국부·지방 주재·시군 주재·자치행정부)는 지역마다 평가한다 =====
// 한 부서 안에서도 인천·경기와 제주는 사정이 다르다. 지역 버튼을 누르면 그 지역 주재기자들의 실력·분위기·광고 실적·기사를 보고 지역끼리 순위를 매긴다
function regEval43(){const C=(typeof corrs==='function'?corrs():[])||[];const regs=[...new Set(C.map(m=>m.reg).filter(Boolean))];const yr=S.turn-YW;
    const out=regs.map(r=>{const L=C.filter(m=>m.reg===r);const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;const sk=avg(L.map(m=>m.skill||40)),rel=avg(L.map(m=>m.rel??20));
    let got=0,goal=0;L.forEach(m=>{try{got+=npcQGot(m);goal+=npcQuota(m,m.d||S.dept);}catch(e){}});
    const A=L.map(m=>m.ai||{});const arts=A.reduce((x,a)=>x+(a.ar||0),0),ex=A.reduce((x,a)=>x+(a.sc||0),0),er=A.reduce((x,a)=>x+(a.er||0),0),ev=avg(A.map(a=>a.e??50));
    const adP=goal>0?Math.min(1.3,got/Math.max(.001,goal*Math.min(1,Math.max(1,qMon())/QM))):1;
    return {r,L,n:L.length,sk,rel,got,goal,arts,ex,er,ev,adP,apn:L.length?arts/L.length:0,mineReg:typeof regMine43==='function'&&regMine43(r)};});
  const mx=Math.max(.5,...out.map(x=>x.apn)),anyAd=out.some(x=>x.got>0);
  out.forEach(x=>{x.sc=x.sk*.3+x.ev*.25+(anyAd?Math.min(100,x.adP*75):60)*.2+(x.apn/mx*100)*.15+Math.min(100,x.ex*25)*.1-x.er*4;});out.sort((a,b)=>b.sc-a.sc);
  const mu=out.reduce((a,x)=>a+x.sc,0)/out.length,sd=Math.max(1.5,Math.sqrt(out.reduce((a,x)=>a+(x.sc-mu)**2,0)/out.length));out.forEach((x,i)=>{x.rk=i+1;const z=(x.sc-mu)/sd;x.g=z>=1.2?'S':z>=.4?'A':z>=-.4?'B':z>=-1.2?'C':'D';});return out;}
function regEvalHTML43(){try{if(!S||S.founder||S.story||!isRegD(S.dept))return '';const E=regEval43();if(E.length<2)return '';const sel=S.rg43&&E.find(x=>x.r===S.rg43)?S.rg43:'all';
  const btn=(k,l)=>`<button class="achip" data-rg43="${esc(k)}" aria-pressed="${sel===k}" style="--c:var(--sodium)">${esc(l)}</button>`;
  const head=`<div class="acat" style="margin:6px 0">${btn('all','전체')}${E.map(x=>btn(x.r,x.r+(x.mineReg?' ★':''))).join('')}</div>`;
  let body='';
  if(sel==='all')body=`<ul class="pnl">${E.map(x=>`<li><span class="tg pc">${x.rk}위 · ${x.g}</span><b>${esc(x.r)}</b>${x.mineReg?' (내 담당)':''} — ${x.n}명 · 실력 ${Math.round(x.sk)} · 기사 ${x.arts}건${x.ex?`(단독 ${x.ex})`:''} · 광고 ${eok(x.got)}${x.goal?` / ${eok(x.goal)}`:''}</li>`).join('')}</ul><p class="hint" style="margin:4px 0 0">주재기자 실력·사내 평가, 1인당 기사 수와 단독, 이번 반기 광고 페이스로 매기고 오보는 깎는다. ★는 내 담당 지역.</p>`;
  else{const x=E.find(y=>y.r===sel);body=`<div class="meta"><span>평가 <b>${x.g}</b> · 지역 ${x.rk}위 / ${E.length}곳</span><span>인원 ${x.n}명</span><span>평균 실력 ${Math.round(x.sk)}</span><span>분위기 ${relWord(x.rel)} (${Math.round(x.rel)})</span><span>기사 ${x.arts}건${x.ex?` · 단독 ${x.ex}건`:''}${x.er?` · 오보 ${x.er}건`:''}</span><span>사내 평가 평균 ${Math.round(x.ev)}</span><span>광고 ${eok(x.got)}${x.goal?` / ${eok(x.goal)}`:''}</span></div><ul class="pnl" style="margin-top:6px">${x.L.slice().sort((a,b)=>(b.r||0)-(a.r||0)||(b.skill||0)-(a.skill||0)).map(m=>`<li><span class="tg pc">${esc(m.role||'주재기자')}</span>${esc(m.name)} · 실력 ${Math.round(m.skill||0)} · ${myrs(m)}년 차 · 관계 ${Math.round(m.rel??20)}</li>`).join('')}</ul><p class="hint" style="margin:4px 0 0">${x.g==='S'||x.g==='A'?'이 지역은 잘 돌아간다. 주재기자들이 제보와 단독을 꾸준히 올린다.':x.g==='D'?'이 지역은 처진다. 실력 있는 기자를 보내거나 관계를 다져야 한다.':'평범하게 돌아가는 지역이다.'}</p>`;}
  return `<div class="card"><div class="t">${ic('map')} 지역별 평가 · ${esc(DEPTS[S.dept].n)}</div>${head}${body}</div>`;}catch(e){console.error(e);return '';}}
{const _db43=deptBox;deptBox=function(){const h=_db43.apply(this,arguments)||'';return h+regEvalHTML43();};}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-rg43]');if(!b)return;e.preventDefault();S.rg43=b.getAttribute('data-rg43');try{render();}catch(x){}});

// ───── (예전 v44.js) ─────
/* 바이라인 — src/compat/v44.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.5 신세 장부 · 줄타기 · 시의성 =====
// 아이템과 광고는 넘친다. 그래서 사람·기관과의 관계가 주는 것을 「신세」로 바꿨다 — 쌓아 두었다가 결정적인 순간에 쓴다.
// 동시에 모두와 가까울 수는 없다: 맞수가 있고, 너무 가까우면 유착 의심을 받고, 사람은 뜨고 진다.

// ---------- 공통 ----------
function e44(id){return id&&ENT[id]&&S.net&&S.net[id];}
function fav44(k){S.fav44=S.fav44||{};return S.fav44[k]||(S.fav44[k]={n:0});}
function favAdd44(k,v,cap){const f=fav44(k);f.n=clamp((f.n||0)+v,0,cap||3);return f.n;}
function favName44(k){const [t,id]=[k[0],k.slice(2)];if(t==='e')return entName(id);if(t==='s'){const s=(S.sources||[]).find(x=>String(x.id)===id);return s?`${s.name} ${s.role}`:'취재원';}if(t==='c'){const c=(S.cols||[]).find(x=>x.name===id);return c?`${c.name} ${colRole(c)}`:id;}return id;}

// ---------- 1. 맞수 관계 ----------
function rivalEnt44(id){S._rv44=S._rv44||{};if(S._rv44[id]!==undefined)return S._rv44[id];const E=ENT[id];let r=null;
  try{if(E){const same=ENTS.filter(e=>e[0]!==id&&S.net&&S.net[e[0]]);
    if(E.kind==='corp'){const L=same.filter(e=>e[2]==='corp'&&e[3]===E.c&&(e[4]||0)>0&&!/협회|연합회|상공회의소/.test(e[1]));if(L.length&&!/협회|연합회|상공회의소/.test(E.n)){L.sort((a,b)=>Math.abs((a[4]||0)-(E.w||0))-Math.abs((b[4]||0)-(E.w||0)));r=L[0][0];}}
    else if(E.kind==='party'){const L=same.filter(e=>e[2]==='party').sort((a,b)=>(b[4]||0)-(a[4]||0));r=L[0]?L[0][0]:null;}
    else if(E.kind==='gov'){if(/정부|부$|처$|청$|위원회|대통령실/.test(E.n)){const L=same.filter(e=>e[2]==='party').sort((a,b)=>(b[4]||0)-(a[4]||0));r=L[1]?L[1][0]:L[0]?L[0][0]:null;}}
    else if(E.kind==='person'){const L=same.filter(e=>e[2]==='person'&&e[3]===E.c);r=L.length?L[hashS2(id)%L.length][0]:null;}}}catch(e){}
  S._rv44[id]=r;return r;}
{const _eh44=entHit;entHit=function(it,W,imp){let out=_eh44.apply(this,arguments)||'';try{const id=it&&it.ent,rv=id&&rivalEnt44(id);if(rv&&e44(rv)&&S.net[rv].known){const d=it.pos?-Math.min(4,Math.max(1,imp/15)):Math.min(3,Math.max(1,imp/20));netUp(rv,d);out=(out?out+' · ':'')+(it.pos?`맞수 ${entName(rv)}${jp(entName(rv),'은','는')} 서운해한다(관계 ${Math.round(d)})`:`맞수 ${entName(rv)}${jp(entName(rv),'이','가')} 반긴다(관계 +${Math.round(d)})`);}
    if(it&&it.pos&&id&&e44(id))favAdd44('e:'+id,1,3);}catch(e){}return out;};}

// ---------- 3. 거리 구간 ----------
function zone44(r){r=r??0;return r>=75?['유착 위험','r']:r>=55?['가까움','g']:r>=20?['적정 거리','']:r>=-10?['데면데면','']:['냉랭','r'];}
{const _ie44=itEntHTML;itEntHTML=function(it){let h=_ie44.apply(this,arguments)||'';try{const id=it&&it.ent;if(h&&id&&e44(id)){const z=zone44(S.net[id].rel),rv=rivalEnt44(id),f=(S.fav44||{})['e:'+id];const ps=ENT[id].kind==='person'?pst44(id):null;
    const add=`<div class="meta" style="margin-top:2px">${S.net[id].known?`<span class="tag${z[1]==='r'?' ex':''}">${z[0]}</span>`:''}${f&&f.n?`<span class="tag so">내가 받을 신세 ${f.n}</span>`:''}${ps&&ps!=='flat'?`<span class="tag${ps==='down'?' ex':''}">${ps==='up'?'뜨는 중':'위태로움'}</span>`:''}${rv&&e44(rv)&&S.net[rv].known?`<span>맞수 ${esc(entName(rv))} — ${it.pos?'이 기사엔 서운해한다':'이 기사를 반긴다'}</span>`:''}</div>`;h=h.replace(/<\/div>$/,add+'</div>');}}catch(e){}return h;};}

// ---------- 5. 인물: 뜨고 진다 ----------
function pst44(id){S.pst44=S.pst44||{};if(!S.pst44[id]){const r=Math.random();S.pst44[id]={s:r<.22?'up':r<.36?'down':'flat',t:S.turn};}return S.pst44[id].s;}

// ---------- 매달: 신세 청구 · 유착 · 양다리 · 인물 · 시의성 ----------
function netMonth44(lines){if(!S||S.phase!=='game'||S.story||!S.net)return;const K=Object.keys(S.net).filter(id=>ENT[id]&&S.net[id].known);
  // 취재원: 신뢰 높고 최근에 만난 사람은 신세를 쌓아 둔다
  try{(S.sources||[]).forEach(s=>{if(s.trust>=45&&(s.last??-99)>=S.turn-4&&chance(.5))favAdd44('s:'+s.id,1,2);});}catch(e){}
  // 유착 위험 · 균형
  try{const close=K.filter(id=>S.net[id].rel>=75),mid=K.filter(id=>S.net[id].rel>=20&&S.net[id].rel<75);
    if(close.length){apply({trust:-.25*Math.min(3,close.length)});if(chance(.05*close.length)){const id=pick(close);const cp=(S.comp&&S.comp.length)?cName(pick(S.comp)):'경쟁 매체';Q.push(()=>openModal('유착 의심',`<p class="lede">${jo2(esc(cp),'이','가')} 「${jo2(esc(entName(id)),'과','와')} 유독 가까운 기자들」이라는 기사를 냈다. 내 이름이 이니셜로 나온다.</p>`,[{label:'거리를 두겠다고 밝힌다',sub:`${entName(id)} 관계↓ · 신뢰 덜 깎인다`,fn:()=>{netUp(id,-18);toast(apply({trust:-1}));}},{label:'"취재원 관리일 뿐"이라고 버틴다',risk:true,sub:'관계 유지 · 신뢰↓↓',fn:()=>{toast(apply({trust:-3,fame:-1}));}}]));}}
    else if(mid.length>=6){apply({trust:.15});if(chance(.15))lines.push({c:'g',t:`어느 한쪽에 기울지 않는 기자 — 적정 거리를 지키는 곳 ${mid.length}곳 (신뢰 조금↑)`});}}catch(e){}
  // 2. 신세 청구: 가까운 곳이 부탁을 해 온다
  try{const ask=K.filter(id=>S.net[id].rel>=60&&!((S.fav44||{})['e:'+id]||{}).n);if(ask.length&&chance(.08)){const id=pick(ask);const nm=entName(id);Q.push(()=>openModal('신세를 갚을 때',`<p class="lede">${esc(nm)} 쪽에서 연락이 왔다. "그동안 저희가 많이 도와드렸죠. 이번엔 저희 부탁 하나 들어주세요." ${pick(['다음 주 발표를 크게 써 달라고 한다.','경쟁사 문제를 한번 들여다봐 달라고 한다.','지난 기사 표현을 좀 누그러뜨려 달라고 한다.'])}</p>`,[{label:'들어준다',sub:'관계↑ · 나중에 내가 받을 신세 +1 · 신뢰↓',fn:()=>{netUp(id,6);favAdd44('e:'+id,1,3);toast(apply({trust:-1.5}));log(`${nm}의 부탁을 들어줬다`);}},{label:'선을 긋는다',sub:'신뢰↑ · 관계↓↓ · 자료가 끊길 수 있다',fn:()=>{netUp(id,-12);if(chance(.3)&&S.net[id])S.net[id].block=(S.net[id].block||0)+4;toast(apply({trust:1}));log(`${nm}의 부탁을 거절했다`);}},{label:'반만 들어준다',sub:'관계 조금↓ · 신뢰 조금↓',fn:()=>{netUp(id,-3);toast(apply({trust:-.5}));}}]));}}catch(e){}
  // 4. 양다리: 맞수 둘이 같은 달에 정반대 부탁
  try{const pairs=K.filter(id=>{const rv=rivalEnt44(id);return rv&&e44(rv)&&S.net[rv].known&&S.net[id].rel>=15&&S.net[rv].rel>=15;});if(pairs.length&&chance(.07)){const a=pick(pairs),b=rivalEnt44(a),A=entName(a),B=entName(b);
    Q.push(()=>openModal('양쪽의 부탁',`<p class="lede">같은 날 두 통의 전화. ${esc(A)}: "${esc(B)} 쪽 얘기, 이번엔 크게 써 주시죠." 한 시간 뒤 ${esc(B)}: "그 기사 나가면 곤란합니다. 이번만 넘어가 주세요."</p><p class="hint">맞수 사이다. 한쪽을 들면 다른 쪽이 등을 돌린다.</p>`,[
     {label:`${A} 편을 든다 — 크게 쓴다`,sub:`${A} 관계↑ · ${B} 관계↓↓ · 평판 조금↑`,fn:()=>{netUp(a,8);netUp(b,-12);toast(apply({fame:.6}));}},
     {label:`${B} 편을 든다 — 기사를 미룬다`,sub:`${B} 관계↑ · ${A} 관계↓↓ · 신뢰 조금↓`,fn:()=>{netUp(b,8);netUp(a,-12);toast(apply({trust:-.8}));}},
     {label:'사실만 담담하게 쓴다',sub:'양쪽 다 조금씩 서운 · 신뢰↑',fn:()=>{netUp(a,-2);netUp(b,-2);toast(apply({trust:1}));}},
     {label:'양쪽에 다 좋은 얼굴을 한다',risk:true,sub:'잘 되면 둘 다 관계↑ · 들키면 둘 다 크게 틀어진다',fn:()=>{if(chance(.5)){netUp(a,6);netUp(b,6);toast('둘 다 내 편이라고 믿는다');}else{netUp(a,-15);netUp(b,-15);toast('양쪽에 다른 말을 한 게 들통났다 · '+apply({trust:-2}));}}}]));}}catch(e){}
  // 5. 인물: 해마다 운이 바뀌고, 달마다 발탁·낙마가 일어난다
  try{if(month()===1)S.pst44={};K.filter(id=>ENT[id].kind==='person').forEach(id=>{const s=pst44(id),r=S.net[id].rel,nm=entName(id);
    if(s==='up'&&chance(.04)){S.pst44[id]={s:'flat',t:S.turn};if(r>=50){favAdd44('e:'+id,1,3);const t=apply({fame:1.2,eval:.5});lines.push({c:'g',t:`${nm}, 요직 발탁 — 가까이 지낸 덕에 내 연락을 먼저 받는다 · 받을 신세 +1 · ${t}`});}else if(r<=-10)lines.push({c:'r',t:`${nm}, 요직 발탁 — 껄끄러운 사이라 앞으로 자료 얻기가 어렵겠다`});else lines.push({c:'',t:`${nm}, 요직에 올랐다`});}
    else if(s==='down'&&chance(.04)){S.pst44[id]={s:'flat',t:S.turn};if(r>=50){const t=apply({trust:-2.5,fame:-.5});netUp(id,-20);lines.push({c:'r',t:`${nm} 낙마 — 「측근 기자」로 엮였다 · ${t}`});}else if(r<=0){lines.push({c:'g',t:`${nm} 낙마 — 거리를 둔 덕에 역풍을 피했다 · ${apply({trust:.6})}`});}else lines.push({c:'',t:`${nm}, 자리에서 물러났다`});}});}catch(e){}
  // 시의성
  try{tim44Month(lines);}catch(e){console.error(e);}}
// 월말 결과에 함께 나오도록 매달 정체성 처리(oidMonth) 뒤에 붙인다
{const _om44m=oidMonth;oidMonth=function(lines){const r=_om44m.apply(this,arguments);try{if(S._nm44!==mKey()){S._nm44=mKey();netMonth44(lines||[]);}}catch(e){console.error(e);}return r;};}

// ---------- 신세 쌓기 (동료·대외 관계) ----------
{const _ru44=relUp;relUp=function(c,v,why){const r=_ru44.apply(this,arguments);try{if(c&&v>0&&(c.rel||0)>=30&&chance(.3))favAdd44('c:'+c.name,1,2);}catch(e){}return r;};}
{const _nu44=netUp;netUp=function(id,v){const r=_nu44.apply(this,arguments);try{if(v>=2&&S.net&&S.net[id]&&S.net[id].known&&S.net[id].rel>=30&&chance(.25))favAdd44('e:'+id,1,2);}catch(e){}return r;};}

// ---------- 신세 쓰기 (새 행동) ----------
try{ACT.favor={n:'신세 쓰기',ap:0,sc:'meet',cd:0,d:'그동안 쌓은 신세를 결정적인 순간에 쓴다 — 사실 보증, 소송 방패, 오보 방어, 대신 뛰어 주기'};ACT_IC.favor='heart';ACT_STAT.favor='net';const g=ACT_GROUPS.find(x=>x[0]==='사람과 관계');if(g&&!g[2].includes('favor'))g[2].unshift('favor');}catch(e){}
{const _rk44=rankActs;rankActs=function(){const a=_rk44.apply(this,arguments);try{if(S&&!S.story&&S.rank>=1&&!a.includes('favor'))a.push('favor');}catch(e){}return a;};}
{const _wy44=why;why=function(id){if(id==='favor'){const n=Object.values(S.fav44||{}).filter(f=>f.n>0).length;return n?'':'쌓인 신세가 없다 — 취재원·동료·대외 관계를 챙기고 호재 기사를 쓰면 쌓인다';}return _wy44.apply(this,arguments);};}
function favOpts44(){const O=[];const F=S.fav44||{};const its=S.items||[];
  Object.keys(F).forEach(k=>{const f=F[k];if(!f||f.n<1)return;const t=k[0],id=k.slice(2),nm=favName44(k);const use=(fn)=>()=>{f.n--;fn();return undefined;};
    if(t==='s'){const s=(S.sources||[]).find(x=>String(x.id)===id);if(!s)return;const it=its.find(i=>catOf(s.d).includes(i.d)&&i.facts.some(x=>!fOK(x)))||its.find(i=>i.facts.some(x=>!fOK(x)));
      if(it)O.push({label:`${nm} — 확인 보증`,sub:`「${it.title.slice(0,18)}…」 사실 하나를 바로 확인해 준다`,fn:use(()=>{const x=it.facts.find(y=>!fOK(y)&&y.key)||it.facts.find(y=>!fOK(y));x.conf=x.need;x.via.push(`${s.name} 보증`);toast(`${s.name}: "그건 맞습니다. 제가 책임질게요."`);})});
      O.push({label:`${nm} — 오보 방어 증언`,sub:'다음에 오보 논란이 터지면 이 취재원이 나서서 피해를 크게 줄여 준다',fn:use(()=>{S.errShield44=(S.errShield44||0)+1;toast('든든한 증인이 생겼다');})});}
    if(t==='e'){const E=ENT[id];if(!E)return;const mine=its.filter(i=>i.ent===id||catOf(E.c).includes(i.d));const it=mine.find(i=>!i.rebut)||null;
      if(it)O.push({label:`${nm} — 공식 입장 바로 받기`,sub:`「${it.title.slice(0,18)}…」에 ${jo2(it.pos?'코멘트':'반론','이','가')} 바로 붙는다`,fn:use(()=>{it.rebut='got';toast(`${nm}: "입장문 바로 보내 드리겠습니다."`);})});
      O.push({label:`${nm} — 소송 막아 주기`,sub:'반년 동안 이곳은 내 기사에 소송을 걸지 않는다',fn:use(()=>{S.shield44=S.shield44||{};S.shield44[id]=S.turn+YW/2;toast(`${nm} 법무팀이 한발 물러섰다`);})});
      O.push({label:`${nm} — 발표 일정 미리 귀띔`,sub:'곧 나올 발표를 미리 알려 준다 — 물때가 붙은 아이템, 그때 내면 크게 실린다',fn:use(()=>{const it2=makeItem(catOf(S.dept).includes(E.c)?S.dept:S.dept,{pre:1,noPos:1});it2.peg={t:S.turn+R(3,6),l:`${nm} 발표`,k:'sched'};it2.src=nm;S.items.push(it2);toast(`물때 아이템 — 「${it2.title}」`);})});}
    if(t==='c'){const c=(S.cols||[]).find(x=>x.name===id);if(!c)return;const role=c.role;
      if(role==='boss')O.push({label:`${nm} — 고과 챙겨 주기`,sub:'사내 평가↑↑',fn:use(()=>{toast(apply({eval:2}));})});
      else if(role==='editor')O.push({label:`${nm} — 제목·지면 손봐 주기`,sub:'다음 기사 완성도↑↑',fn:use(()=>{S.peerRev={n:c.name,b:6};toast('다음 기사 제목은 편집기자가 붙어 준다');})});
      else if(role==='photo')O.push({label:`${nm} — 현장 동행 확정`,sub:'아이템 하나의 현장 사실을 바로 확인',fn:use(()=>{const it=its.find(i=>i.facts.some(x=>x.k==='s'&&!fOK(x)))||its.find(i=>i.facts.some(x=>!fOK(x)));if(it){const x=it.facts.find(y=>y.k==='s'&&!fOK(y))||it.facts.find(y=>!fOK(y));x.conf=x.need;x.via.push(`${colRole(c)} 동행`);toast(`「${it.title.slice(0,16)}…」 현장 컷을 건졌다`);}else toast('지금은 확인할 현장이 없다 — 다음 기회로');})});
      else if(role==='union')O.push({label:`${nm} — 위기 때 방패`,sub:'다음 오보·사내 위기 때 노조가 편이 된다(피해 절반)',fn:use(()=>{S.errShield44=(S.errShield44||0)+1;toast('노조가 등을 받쳐 주기로 했다');})});
      else if(['cap','mentor','senior'].includes(role))O.push({label:`${nm} — 노하우 전수`,sub:'취재력·검증력 조금↑',fn:use(()=>{gain('inv',1);gain('ver',1);toast('선배의 수첩을 한 장 넘겨받았다');})});
      O.push({label:`${nm} — 대신 뛰어 주기`,sub:S.favAp44===mKey()?'이번 달엔 이미 부탁했다':'이번 달 행동력 +1',disabled:S.favAp44===mKey(),fn:use(()=>{S.favAp44=mKey();S.ap+=1;toast(`${c.name}: "그건 내가 다녀올게."`);})});}});
  return O;}
RUN.favor=function(){const O=favOpts44();if(!O.length){toast('지금 쓸 수 있는 신세가 없다');return;}
  openModal('신세 쓰기',`<p class="lede">그동안 쌓아 둔 신세. 한 번 쓰면 사라진다 — 아이템이나 광고보다 귀한, 결정적인 순간을 위해.</p><p class="hint">신세는 신뢰 높은 취재원을 꾸준히 만나고, 동료와 가깝게 지내고, 기관·광고주·인물의 호재를 쓰면 쌓인다. 상대가 먼저 신세를 갚으라고 할 때도 있다.</p>`,O.slice(0,14).concat([{label:'닫기',cls:'ghost'}]));};
// 방패 효과
{const _se44=suitEvent;suitEvent=function(p){try{if(p&&p.ent&&S.shield44&&S.shield44[p.ent]>S.turn){toast(`${entName(p.ent)}${jp(entName(p.ent),'은','는')} 소송을 접었다 — 쌓아 둔 신세 덕`);return closeModal();}}catch(e){}return _se44.apply(this,arguments);};}
{const _sc44=scandal;scandal=function(p){try{if(S.errShield44>0){S.errShield44--;S.errors++;S.lastError=S.turn;openModal('오보 논란 — 방패가 있었다',`<p class="lede">「${esc(p&&p.title||'기사')}」에 문제가 제기됐다. 하지만 미리 받아 둔 증언과 사내 지원 덕에 보완 기사 한 건으로 끝났다.</p>${fxLine(apply({trust:-1,eval:-.5}))}`);return;}}catch(e){}return _sc44.apply(this,arguments);};}
// AI: 신세가 쌓였고 쓸 데가 있으면 추천한다
{const _rc44=recommend;recommend=function(){const r=_rc44.apply(this,arguments);try{if(S&&!S.story&&r!=='rest'&&r!=='breaking'){const F=Object.values(S.fav44||{});const tot=F.reduce((a,f)=>a+(f.n||0),0);if(tot>=3&&!why('favor')&&rankActs().includes('favor'))return 'favor';}}catch(e){}return r;};}

// ---------- 시의성: 전개형 · 물때 · 지면 경쟁 ----------
const PEG_CAL44={pol:[[10,'국정감사'],[12,'예산안 처리'],[2,'임시국회']],soc:[[7,'장마철'],[8,'폭염'],[9,'추석 연휴'],[12,'연말 안전 점검']],eco:[[1,'연간 실적 발표'],[4,'1분기 실적'],[7,'상반기 결산'],[10,'3분기 실적']],int:[[9,'유엔 총회'],[11,'정상회의']],cul:[[12,'연말 시상식'],[5,'칸 영화제'],[10,'가을 축제']],ent:[[12,'연말 시상식'],[7,'여름 성수기']],spo:[[3,'시즌 개막'],[10,'포스트시즌'],[7,'올스타전']],loc:[[10,'지역 축제'],[2,'예산 집행 시작'],[6,'단체장 취임 1년']]};
const PEG_SCH44={pol:['국회 표결','정부 발표','당 지도부 선출'],soc:['판결 선고','정부 대책 발표','감사 결과 발표'],eco:['실적 발표','금리 결정','공정위 심의'],int:['정상회담','협상 타결 예정일'],cul:['개봉','수상작 발표'],ent:['컴백','시상식'],spo:['결승전','이적 시장 마감'],loc:['도의회 표결','개발 심의']};
function pegMk44(it){const c=cat1(it.d);const now=month();if(chance(.5)&&PEG_CAL44[c]){const [m,l]=pick(PEG_CAL44[c]);let d=(m-now+12)%12;if(d===0)d=12;if(d>8)return null;return {t:S.turn+d*4,l,k:'cal'};}const L=PEG_SCH44[c]||['발표'];return {t:S.turn+R(3,10),l:pick(L),k:'sched'};}
{const _mi44=makeItem;makeItem=function(d0,o={}){const it=_mi44.apply(this,arguments);try{if(it&&S&&S.phase==='game'&&!o.ticker&&!o.anyScale&&!o.story&&!o.hoax&&!it.story&&!it.peg&&!it.dev){const r=Math.random();if(r<.2){const p=pegMk44(it);if(p)it.peg=p;}else if(r<.36&&!it.pos){it.dev={up:R(25,45)/100,down:R(10,25)/100,n:0};}}}catch(e){}return it;};}
function pegDt44(it){return it&&it.peg?Math.round((it.peg.t-S.turn)):null;}
function timTag44(it){try{let h='';if(it.peg){const dt=pegDt44(it);h+=`<span class="tag so">물때 · ${esc(it.peg.l)} ${dt>2?`${dt}주 남음`:dt>=-1?'지금이 때!':'지났다'}</span>`;}if(it.dev&&it.dev.n<3)h+=`<span class="tag">전개 중 · 다음 달 커질 ${Math.round(it.dev.up*100)}% / 식을 ${Math.round(it.dev.down*100)}%</span>`;return h;}catch(e){return '';}}
function timTxt44(it){try{if(it.peg){const dt=pegDt44(it);return ` · 물때 ${it.peg.l} ${dt>2?dt+'주 뒤':dt>=-1?'지금!':'지남'}`;}if(it.dev&&it.dev.n<3)return ' · 전개 중';return '';}catch(e){return '';}}
function newsLoad44(){try{const m=month();if(S.breaking)return 'flood';const y=2027+Math.floor(S.turn/YW);if((m===4&&y%4===0)||(m===6&&y%4===2)||(m===3&&y%5===0))return 'flood';try{if(typeof eraNow==='function'&&eraNow().some(x=>/disaster|pandemic|crash/.test(x.k)))return 'flood';}catch(e){}if(m===8||m===1||(m===9&&S.turn%4>=2))return 'drought';return 'normal';}catch(e){return 'normal';}}
function tim44Month(lines){const ld=newsLoad44();if(ld!=='normal'&&S._ld44!==mKey()){S._ld44=mKey();lines.push({c:ld==='drought'?'g':'',t:ld==='drought'?'이번 달 지면: 뉴스 가뭄 — 큰 뉴스가 없어 웬만한 기사도 크게 실린다. 아껴 둔 아이템을 낼 때다':'이번 달 지면: 뉴스 홍수 — 큰 뉴스에 묻혀 좋은 기사도 작게 실린다. 급하지 않은 건 묵혀 두자'});}
  (S.items||[]).forEach(it=>{if(it.dev&&it.dev.n<3){const r=Math.random();if(r<it.dev.up){it.dev.n++;it.imp=Math.round(it.imp*1.15);lines.push({c:'g',t:`「${it.title}」 전개 — 새 사실이 나와 판이 커졌다 (파급력 ${it.imp})`});}else if(r<it.dev.up+it.dev.down){it.dev.n=3;it.imp=Math.round(it.imp*.85);lines.push({c:'r',t:`「${it.title}」 관심이 식었다 (파급력 ${it.imp})`});}else it.dev.n++;}
    if(it.peg){const dt=pegDt44(it);if(!it.excl&&dt>-2)it.heat=Math.max(it.heat,dt+2);if(dt>=0&&dt<=4&&!it._pegN){it._pegN=1;lines.push({c:'g',t:`들고 있던 「${it.title}」 — 물때(${it.peg.l})가 다가온다. 지금 내면 크게 실린다`});}}});}
{const _wf44=writeFinish;writeFinish=function(W){try{const it=W&&W.it;if(it&&!W._tim44){W._tim44=1;let m=1;const N=[];if(it.peg){const dt=pegDt44(it);if(dt<=2&&dt>=-1){m*=1.35;N.push(`물때(${it.peg.l})를 맞췄다 — 파급력 +35%`);}else if(dt<-1){m*=.8;N.push(`물때(${it.peg.l})가 지났다 — 받아쓰기 취급`);}else{m*=.95;N.push(`물때(${it.peg.l})보다 ${dt}주 이르다`);}}
    const ld=newsLoad44();if(ld==='drought'){m*=1.15;N.push('뉴스 가뭄 — 크게 실렸다');}else if(ld==='flood'){m*=.85;N.push('뉴스 홍수 — 큰 뉴스에 묻혔다');}
    if(m!==1){it.imp=Math.max(5,Math.round(it.imp*m));setTimeout(()=>{try{toast(N.join(' · '));}catch(e){}},400);}}}catch(e){}return _wf44.apply(this,arguments);};}
// AI: 물때·전개·지면을 읽는다
{const _ai44=aiItemScore;aiItemScore=function(it,act,dir){let v=_ai44.apply(this,arguments);try{if(act==='write'){if(it.peg){const dt=pegDt44(it);if(dt>2&&dt<=8&&!it.excl)v-=3;else if(dt<=2&&dt>=-1)v+=4;else if(dt<-1)v+=1;}if(it.dev&&it.dev.n<3&&!it.excl&&it.dev.up>=.35&&(it.heat||0)>4)v-=1;const ld=newsLoad44();if(ld==='drought')v+=.8;else if(ld==='flood'&&!it.excl&&!(it.slot))v-=1;}}catch(e){}return v;};}
