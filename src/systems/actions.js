/* 바이라인 — src/systems/actions.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ================= 행동 =================
const ACT={
 rtact:{n:'길의 업무',ap:1,sc:'office',cd:4,get d(){try{return S&&S.route?ROUTE[S.route.k].actD:'지금 걷는 길의 고유 업무';}catch(e){return '지금 걷는 길의 고유 업무';}}},
 cfile:{n:'사건 파일',ap:1,sc:'field',d:'판마다 진실이 바뀌는 장기 사건. 단서를 모아 몸통을 지목한다'},
 spec:{n:'전문 분야',ap:1,sc:'newsroom',cd:4,get d(){try{return S&&S.spec2?SPEC2[S.spec2.k].d:'나만의 전문 분야를 키운다';}catch(e){return '나만의 전문 분야를 키운다';}}},
 gongse:{n:'공세 보도',ap:1,sc:'newsroom',cd:4,d:'한 곳을 정해 몇 주 동안 연속 기획으로 파헤친다. 광고 압박의 칼이 되기도 한다'},
 spx:{n:'매체 고유 업무',ap:1,sc:'newsroom',cd:2,get d(){const m=typeof spmId==='function'&&S?spmId():null;return m?SPM[m].d:'이 매체만의 일';}},
 sasu:{n:'사쓰마와리',ap:2,get d(){try{return sasuCfg().d;}catch(e){return '새벽 경찰서·응급실·소방서를 돌며 사건을 챙긴다';}},sc:'police'},
 hari:{n:'하리꼬미(뻗치기)',ap:2,d:'핵심 인물이 나타날 곳에서 몇 시간이고 기다린다',sc:'field'},
 report:{n:'정보보고 쓰기',ap:1,get d(){let n='사쓰마와리';try{n=sasuN();}catch(e){}return `${n} 메모를 정리해 캡에게 보고한다. 메모가 쌓였을수록 평가가 오른다`;},sc:'newsroom'},
 drink:{n:'선배와 술자리',ap:1,d:'캡·바이스와 소주 한잔',sc:'meet',cd:2},
 pitch:{n:'아침 발제',ap:0,d:'편집회의에 아이템을 올려 지면과 마감을 받는다',sc:'newsroom',cd:1},
 beat:{n:'출입처 브리핑',ap:1,d:'질문을 던지고 백브리핑을 따라간다',sc:'briefing'},
 source:{n:'취재원 만나기',ap:1,d:'밥 약속으로 신뢰를 쌓고 제보를 얻는다',sc:'meet'},
 discover:{n:'아이템 발굴',ap:1,d:'보도자료·커뮤니티·현장·데이터에서 찾는다',sc:'newsroom'},
 invest:{n:'취재 나가기',ap:1,d:'제한된 시간 안에 취재 기법을 골라 사실을 확인한다',sc:'field'},
 write:{n:'기사 쓰기',ap:1,d:'야마·리드·팩트·반론·제목을 골라 출고한다',sc:'newsroom'},
 desk:{n:'데스킹',ap:1,d:'후배 초고를 다듬어 내보낸다 (부장은 초고함)',sc:'newsroom'},
 plan:{n:'부서 기획회의',ap:1,d:'기획 시리즈로 부서 성과를 끌어올린다',sc:'newsroom',cd:12},
 deptreq:{n:'부서 이동 신청',ap:0,d:'다음 정기 인사 때 원하는 부서로 옮겨 달라고 신청한다',sc:'office',cd:4},
 recruit:{n:'기자 영입',ap:1,d:'타사 기자를 스카우트한다',sc:'office',cd:8},
 column:{n:'칼럼 쓰기',ap:1,d:'기명 칼럼으로 목소리를 낸다',sc:'newsroom',cd:2},
 front:{n:'1면 회의',ap:1,d:'내일 자 톱기사를 결정한다',sc:'press',cd:2},
 direction:{n:'편집 방향 회의',ap:1,d:'매체의 논조와 독자 전략을 정한다',sc:'office',cd:12},
 campaign:{n:'구독 캠페인',ap:1,d:'구독·시청자 확대 캠페인을 벌인다',sc:'office',cd:8},
 adsales:{n:'광고 영업',ap:1,d:'광고주를 만나 매출을 올린다. 압력도 따라온다',sc:'office',cd:4},
 digital:{n:'디지털 투자',ap:1,d:'뉴스 앱·영상 플랫폼에 투자한다',sc:'office',cd:12},
 hire:{n:'공채 채용',ap:1,d:'수습기자를 새로 뽑는다',sc:'office',cd:24},
 cut:{n:'비용 절감',ap:1,d:'인력을 줄여 적자를 막는다',sc:'office',cd:12},
 event:{n:'포럼·행사 사업',ap:1,d:'후원 포럼으로 부대 수입을 올린다',sc:'office',cd:8},
 job:{n:'이직 알아보기',ap:1,d:'다른 매체의 경력기자 채용을 알아본다',sc:'meet',cd:24},
 rest:{n:'휴식',ap:1,d:'컨디션을 크게 회복한다',sc:'newsroom'},
 colleague:{n:'동료 챙기기',ap:1,d:'사내 동료와 시간을 보내며 관계를 다진다',sc:'meet'},
 lgevent:{n:'행사 사업 유치',ap:1,d:'지자체·체육회와 마라톤·탁구대회·축제 같은 행사를 연다',sc:'office'},
 adrate:{n:'광고 단가·수주',ap:1,d:'광고 단가를 올리거나 내리고, 광고주와 연간 계약을 맺는다',sc:'office',cd:4},
 agenda:{n:'어젠다 세팅',ap:1,d:'1년 동안 편집국 전체가 밀고 갈 연중 기획을 정한다',sc:'office'},
 revenue:{n:'수익 다변화',ap:1,d:'뉴스레터·영상·포럼·멤버십 등 광고 말고 다른 수익원을 만든다',sc:'office'},
 deptlife:{n:'부서 사람들과',ap:1,d:'같은 부서 사람과 밥 먹고, 배우고, 가르치고, 같이 취재한다',sc:'newsroom'},
 meeting:{n:'편집회의 주재',ap:1,d:'부장들의 발제를 보고 1면·안쪽 면·보강·킬을 정한다',sc:'newsroom',cd:2},
 assign:{n:'취재 지시',ap:1,d:'부서 기자에게 아이템을 맡기거나 새 기획 취재를 시킨다',sc:'newsroom',cd:2},
 exec:{n:'경영회의 주재',ap:1,d:'부문장 보고를 받고 이번 달 경영 중점을 정한다',sc:'office',cd:4},
 board:{n:'이사회·대주주 보고',ap:1,d:'분기 실적을 이사회에 보고한다. 연임 심사에 남는다',sc:'office',cd:12},
 tour:{n:'편집국 순시',ap:1,d:'기자들 자리를 돌며 고충을 듣고 갈등을 푼다',sc:'newsroom',cd:2},
 taskforce:{n:'특별취재팀',ap:1,d:'정예 기자를 뽑아 몇 주짜리 대형 탐사를 맡긴다',sc:'office',cd:16},
 breaking:{n:'속보 지휘',ap:1,d:'방금 터진 대형 사건의 보도 체제를 정한다',sc:'press'},
 portal:{n:'포털 제휴 전략',ap:1,d:'포털 제휴 등급을 올리거나 벌점을 관리한다 (검색→뉴스스탠드→CP)',sc:'office',cd:4},
 facility:{n:'시설·개선 투자',ap:1,d:'스튜디오·팩트체크센터·앱·사옥 등에 투자한다',sc:'office',cd:2},
 found:{n:'독립 언론 창간',ap:1,d:'회사를 나와 내 언론사를 세운다 (창간 모드로 전환)',sc:'office',cd:48},
 wage:{n:'임금 조정',ap:1,d:'기본급·수당·성과급을 조정한다. 사기·이탈·재정이 걸려 있다',sc:'office',cd:12},
 paypol:{n:'연봉·처우 정책',ap:1,d:'기자 연봉 수준을 정한다. 인건비와 인재 유출이 걸려 있다',sc:'office',cd:12},
 newdept:{n:'부서 신설',ap:1,d:'새 부서를 만들고 기자를 뽑는다',sc:'office',cd:8},
 fvision:{n:'전략 회의',ap:1,d:'반년 동안 회사가 집중할 전략을 정한다 (비전)',sc:'office',cd:12},
 fsales:{n:'광고·후원 영업',ap:1,d:'발행인이 직접 광고주·후원 기업을 만난다 (영업력)',sc:'meet',cd:2},
 fassign:{n:'취재 지시',ap:1,d:'쥔 아이템을 기자에게 맡기거나(최대 두 건) 새 기획 취재를 시킨다. 대표 시간은 아끼고, 결과는 기자 실력·확인된 사실·편집력에 달렸다',sc:'newsroom'},
 fpartner:{n:'콘텐츠 제휴·판매',ap:1,d:'방송사·포털·경쟁사와 제휴하고 기사를 판다 (대외 협상)',sc:'office',cd:4},
 fbrand:{n:'브랜딩·독자 확대',ap:1,d:'뉴스레터·유튜브·SNS로 독자를 모은다 (디지털 감각)',sc:'newsroom',cd:3},
 fraise:{n:'투자 유치',ap:1,d:'크라우드펀딩·엔젤·VC·전략 투자 (자금 조달)',sc:'office',cd:12},
 fhire:{n:'인재 채용',ap:1,d:'신입·경력·스타 기자를 뽑는다 (리더십)',sc:'office',cd:4},
 fcrisis:{n:'위기관리 점검',ap:1,d:'소송·오보·포털 벌점·전산 장애를 미리 막는다 (위기관리)',sc:'office',cd:4},
 fethics:{n:'윤리강령·독자위원회',ap:1,d:'보도 원칙을 세우고 독자에게 검증받는다 (언론 원칙)',sc:'newsroom',cd:8},
 handoff:{n:'아이템 넘기기',ap:1,d:'쥐고 있는 아이템을 동료·부서원·주재기자에게 넘긴다',sc:'newsroom',cd:0},
 fbureau:{n:'지역 주재 운영',ap:1,d:'지역마다 주재기자 1~3명을 둔다 (리더십·대외 협상)',sc:'office',cd:2},
 gad:{n:'총무국',ap:0,d:'인사·급여·직급 체계·조직 개편·복지·노사·법무·자재·재무·전산',sc:'office',cd:0},
 special:{n:'부서 특화 업무',ap:1,d:'부서마다 다른 고유 업무',sc:'field',cd:2},
 life:{n:'월급 쓰기',ap:0,d:'자기계발·장비·생활·저축·투자·내 집 마련',sc:'meet',cd:0},
 personnel:{n:'인사권 행사',ap:1,d:'기자들의 승진·부서 이동·보직을 결정한다',sc:'office',cd:4},
 network:{n:'대외 관계',ap:1,d:'출입처 기관·인물·광고주와 관계를 다진다. 단독과 광고 매출이 걸려 있다',sc:'meet',cd:1},
 adsell:{n:'광고·협찬 영업',ap:1,d:'광고주를 만나 지면 광고·특집·포럼 협찬을 따낸다',sc:'meet',cd:3}
};
const S_ADW='입사 3년 차부터 · 직급이 오르면 한 달 뒤부터 (광고국과 첫 미팅 뒤)';
const RANK_ACTS=[
 ['handoff','sasu','hari','report','drink','invest','write','colleague','deptlife','life','rest'],
 ['handoff','pitch','special','beat','source','network','discover','invest','write','adsell','colleague','deptlife','life','deptreq','job','rest'],
 ['handoff','pitch','special','beat','source','network','discover','invest','write','desk','adsell','colleague','deptlife','life','deptreq','job','rest'],
 ['handoff','special','source','network','discover','invest','write','desk','plan','adsell','recruit','colleague','deptlife','life','deptreq','job','rest'],
 ['breaking','meeting','front','desk','assign','invest','write','handoff','tour','taskforce','column','network','adsell','source','colleague','life','recruit','job','rest'],
 ['breaking','meeting','front','assign','invest','write','handoff','tour','taskforce','column','campaign','portal','lgevent','adrate','network','adsell','source','colleague','life','recruit','found','job','rest'],
 ['breaking','meeting','front','direction','agenda','wage','personnel','portal','lgevent','tour','taskforce','column','network','adsell','source','colleague','life','recruit','found','rest'],
 ['personnel','wage','gad','facility','portal','revenue','lgevent','adrate','tour','network','campaign','adsales','digital','hire','cut','event','recruit','exec','board','front','colleague','life','rest']
];
const SPECIAL={
 pol:['의원실 순회','의원실을 돌며 자료와 국감 정보를 얻는다'],diplo:['외교·안보 백브리핑','당국자 비공개 설명을 따라간다'],int:['외신 모니터링','밤새 외신을 훑어 국내에 없는 기사를 찾는다 (어학)'],
 eco:['경제지표 분석 기사','발표된 지표로 빠르게 분석 기사를 쓴다 (데이터·속도)'],ind:['공장·IR 현장','기업 현장과 실적 발표를 챙긴다'],fin:['금융권 인사 동향','은행·당국 인사 정보를 모은다 (인맥)'],stock:['장 마감 시황 기사','오후 3시 30분, 시황 기사를 빠르게 송고 (속도)'],estate:['분양 현장 르포','견본주택과 현장을 돈다'],it:['신제품·IT 행사 취재','발표회에서 단독 질문을 노린다'],
 soc:['시경 캡 회의','사건팀 정보를 모아 아이템을 고른다'],court:['재판 방청·판결문 분석','판결문 더미에서 기사를 찾는다 (검증·데이터)'],case:['경찰서 야간 순회','밤새 경찰서 두 곳을 돈다'],inv:['장기 추적 파일','아이템 하나를 몇 주간 자동 추적한다'],med:['병원 현장 취재','응급실과 병원 행정을 취재한다'],edu:['입시 설명회 취재','학부모와 학원가 정보를 얻는다'],
 cul:['공연·전시 리뷰','리뷰 기사를 쓴다 (문장력·상식)'],ent:['쇼케이스·제작발표회','연예 현장 기사, 또는 잠복 취재'],culspo:['지역 축제·경기 취재','지역 문화·체육 현장 기사'],
 spo:['경기 현장 기사','경기 직후 마감 기사 (속도)'],base:['야구장 경기 기사','경기 직후 마감 기사 (속도)'],foot:['축구장 경기 기사','경기 직후 마감 기사 (속도)'],
 nat:['지방 총국 순회','지역 주재기자들과 아이템을 모은다'],city:['의회 본회의 취재','지방의회 질의에서 기사를 건진다'],sigun:['마을 민원 현장','주민 민원 현장을 찾는다 (친화력)'],loc:['지역 현안 현장','지역 현안 현장을 찾는다']
};
function actName(id){if(id==='rtact'&&S.route)return ROUTE[S.route.k].act;if(id==='spec'&&S.spec2)return SPEC2[S.spec2.k].act;if(id==='spx'){const m=spmId();return m?SPM[m].act:'매체 고유 업무';}if(id==='special'){const sp=SPECIAL[S.dept];return sp?sp[0]:'부서 특화 업무';}if(id==='write'&&isTV())return '리포트 제작';if(id==='write'&&OUT().type==='wire')return '기사 송고';if(id==='campaign'&&S.rank===5)return '구독 캠페인 제안';if(id==='sasu')return sasuN();if(id==='tour'&&S.rank===7)return '현장 경영';if(id==='source'&&S.rank>=6&&!S.founder)return '고위층 인맥 관리';if(id==='breaking'&&S.rank>=6&&!S.founder)return '속보 체제 지휘';return ACT[id].n;}
function writable(){return S.items.filter(i=>i.facts.some(fOK)&&!(i.hold>S.turn));}
function why(id){
  const a=ACT[id];const lk=lockReason(id);if(lk)return '잠김 · '+lk;
  if(S.cd[id]&&S.cd[id]>S.turn){const w=S.cd[id]-S.turn;return w<=4?'다음 달에 다시':`${Math.ceil(w/4)}달 후 가능`;}
  if(S.ap<actCost(id))return '행동력 부족';
  if(!S.founder&&S.rank>=4&&S.rank<=5){const n=(S.mAct&&S.mAct[id])||0;if(id==='invest'&&n>=2)return '간부라 직접 취재는 한 달에 두 번까지';if(id==='write'&&n>=1)return '간부라 직접 기사는 한 달에 한 건까지';}
  if(id==='write'&&!writable().length)return '확인된 사실이 있는 아이템 없음';
  if(id==='invest'&&!S.items.length)return '아이템 없음';
  if(id==='fassign'&&(S.fAsg||[]).length>=fAsgMax())return '기자들이 모두 취재 중';
  if(id==='pitch'&&!S.items.some(i=>!i.slot))return '발제할 아이템 없음';
  if(id==='beat'&&S.flags.ban)return `출입 정지 ${wkTxt(S.flags.ban)}`;
  if(id==='job'&&S.story)return '스토리 진행 중';
  if(id==='job'&&S.atOutlet<48)return '입사 1년 뒤부터';
  if(id==='breaking'&&!S.breaking)return '터진 사건 없음';
  if(id==='taskforce'&&S.tf)return `취재팀 가동 중 (${wkTxt(S.tf.due-S.turn)} 남음)`;
  if(id==='taskforce'&&S.team.length<2)return '부서원 부족';
  if(id==='colleague'&&!(S.cols&&S.cols.length))return '동료 없음';
  if(id==='found'&&S.founder)return '이미 내 회사';
  if(id==='found'&&S.money<3000)return '창간 자금 3천만 원 필요';
  if(id==='newdept'&&!S.founder&&OUT().depts.length>=13)return '부서가 이미 충분하다';
  if(id==='deptreq'&&S.reqDept)return `${DEPTS[S.reqDept].n} 신청 중`;
  if(id==='recruit'&&S.co.cash<1)return '회사 자금 부족';
  if(['campaign','digital','hire'].includes(id)&&S.co.cash<2)return '회사 자금 부족';
  if(id==='source'&&S.money<15)return '밥값이 없다';
  if(S.hp<6&&id!=='rest'&&a.ap>0)return '컨디션 바닥';
  return '';
}
const VERSION='1.77';
// 단계별 해금: 커리어 주차(w) · 직급 재직 주차(rw) · 조건(c)
const UNLOCK={
 handoff:{w:6,c:()=>S.items.length>0,why:'아이템이 있을 때 (수습 두 달째부터)'},
 report:{w:0},sasu:{w:0},rest:{w:0},
 drink:{w:2,why:'수습 첫 달부터'},colleague:{w:2,why:'수습 첫 달부터'},
 invest:{w:3,c:()=>S.items.length>0,why:'아이템이 생기면'},
 write:{w:4,c:()=>writable().length>0,why:'확인된 사실이 있는 아이템이 생기면'},
 hari:{w:6,why:'수습 두 달째부터'},
 pitch:{rw:0},beat:{rw:0},source:{rw:0},discover:{rw:1,why:'발령 첫 달부터'},
 deptreq:{rw:24,why:'발령 반년 뒤부터'},job:{w:0},
 desk:{rw:0},adsell:{rw:4,c:()=>S.rank!==1||S.turn>=3*YW,why:S_ADW},plan:{rw:2,why:'부장 첫 달부터'},recruit:{rw:6,why:'부임 두 달째부터'},
 meeting:{rw:0},front:{rw:1,why:'부임 첫 달부터'},tour:{rw:2,why:'부임 첫 달부터'},taskforce:{rw:8,why:'부임 세 달째부터'},column:{rw:3,why:'부임 첫 달부터'},
 breaking:{rw:0},direction:{rw:4,why:'부임 두 달째부터'},campaign:{rw:4,why:'부임 두 달째부터'},
 adsales:{rw:0},portal:{rw:2,why:'부임 첫 달부터'},facility:{rw:0},found:{rw:12,why:'국장 부임 넉 달째부터'},paypol:{rw:4,why:'취임 두 달째부터'},newdept:{rw:6,why:'취임 두 달째부터'},special:{rw:0},life:{w:4,why:'첫 월급 뒤부터'},personnel:{rw:0},network:{w:0},digital:{rw:4,why:'취임 두 달째부터'},hire:{rw:8,why:'취임 세 달째부터'},cut:{rw:8,why:'취임 세 달째부터'},event:{rw:2,why:'취임 첫 달부터'}
};
// ===== 아이템 넘기기 =====
function handoffTargets(it){const L=[];const add=(name,skill,rel,kind,ref)=>{if(name&&name!==S.name&&!L.some(x=>x.name===name))L.push({name,skill:Math.round(skill),rel:Math.round(rel||0),kind,ref});};
  if(S.rank>=2)S.team.forEach(m=>add(m.name,m.skill,m.rel||20,'부서원',m));
  else deptMates().filter(m=>m.r===0).forEach(m=>add(m.name,m.skill,m.rel,'같은 부서',m));
  (S.cols||[]).filter(c=>['peer','rivalpeer','senior','junior'].includes(c.role)).forEach(c=>add(c.name,avg(Object.values(c.st||{inv:50})),c.rel,colRole(c),c));
  if(it.d==='loc'){const C=corrs().filter(m=>!it.reg||m.reg===it.reg).slice(0,2);C.forEach(m=>add(m.name,m.skill,m.rel,`${m.reg} 주재`,m));}
  return L.slice(0,7);}
// 7.0 부국장·국장의 취재 지시: 쥐고 있는 아이템을 부서 기자에게 맡기거나, 아이템이 없으면 기획 취재를 시킨다. 결과는 몇 주 뒤 '부서원의 단독'처럼 돌아온다
function assignPool(){const T=(S.team||[]).filter(m=>m&&m.name);let D=[];try{D=(roster()[S.dept]||[]).filter(m=>m&&!T.includes(m)&&(m.r||0)<=1);}catch(e){}return T.concat(D).filter((m,i,a)=>a.indexOf(m)===i).sort((a,b)=>(b.skill||0)-(a.skill||0)).slice(0,8);}
function runAssign(){const P=assignPool();if(!P.length){toast('맡길 기자가 없다');return;}const L=S.items.slice();
  const sel=()=>[...document.querySelectorAll('#mb input[data-ai]:checked')].map(x=>L[+x.dataset.ai]).filter(Boolean);
  const who=(its,plan)=>openModal('누구에게 맡길까',`<p class="lede">${plan?'새 기획 취재':its.map(x=>`「${esc(x.title)}」`).join(' · ')}</p><p class="hint">실력이 좋을수록 잘 살린다. 지시받은 기자는 실력이 늘고, 잘 터지면 부서 성과와 내 평가가 함께 오른다.</p>`,
    P.map(m=>({label:`${m.name} ${MR[Math.min(3,m.r||0)]}`,sub:`실력 ${Math.round(m.skill||45)} · ${yrsTxt(m)}${(S.handoffs||[]).some(h=>h.who===m.name)?' · 이미 맡은 일이 있다':''}`,fn:()=>{spend(1,2);setCd('assign');
      const ITS=plan?[makeItem(S.dept,{excl:chance(.35),mult:1.05})]:its;S.handoffs=S.handoffs||[];
      ITS.forEach((it,k)=>{S.items=S.items.filter(x=>x!==it);const sk=(m.skill||45)+(it.facts.filter(fOK).length*5)+8-(k?4:0)-(plan?6:0);S.handoffs.push({who:m.name,kind:'부서원',ref:m.id,col:false,title:it.title,imp:it.imp,excl:it.excl,sk,due:S.turn+R(4,10)+(k?R(2,5):0),rival:false,sub:true,mode:'order'});});
      m.skill=clamp((m.skill||45)+.6,0,95);S.flags.plan=(S.flags.plan||0)+1;log(`취재 지시: ${ITS.map(x=>`「${x.title}」`).join(' · ')} → ${m.name}`);toast(`${m.name}: "${pick(['알겠습니다, 바로 붙겠습니다.','네, 이번 달 안에 결과 가져오겠습니다.','방향 잡아 주셔서 감사합니다.'])}"`);}})).concat([{label:'← 뒤로',cls:'ghost',fn:()=>{runAssign();return false;}}]));
  openModal('취재 지시',`<p>쥐고 있는 아이템을 부서 기자에게 맡기거나(최대 두 건), 새 기획 취재를 시킨다. 간부는 직접 뛰기보다 사람을 움직여 기사를 만든다.</p>${L.length?`<p class="pcount" id="gsel"></p>${L.map((it,i)=>`<label class="chk"><input type="checkbox" data-ai="${i}"><span><b>${esc(it.title)}</b><small>확인 ${it.facts.filter(fOK).length}/${it.facts.length}${it.excl?' · 단독':''} · 파급력 ${it.imp}</small></span></label>`).join('')}`:'<p class="hint">지금 쥐고 있는 아이템이 없다.</p>'}`,
   [...(L.length?[{label:'고른 아이템을 맡긴다',sub:'최대 두 건 · 같은 기자에게',fn:()=>{const X=sel();if(!X.length){toast('맡길 아이템을 골라 주세요');return false;}who(X.slice(0,2),false);return false;}}]:[]),
    {label:'새 기획 취재를 시킨다',sub:'부서 출입처에서 아이템을 찾아 취재하게 한다',fn:()=>{who([],true);return false;}},{label:'취소',cls:'ghost'}]);
  if(L.length){const up=()=>{const c=[...document.querySelectorAll('#mb input[data-ai]')];const n=c.filter(x=>x.checked).length;const el=document.getElementById('gsel');if(el)el.textContent=n?`선택 ${n}건 / 최대 2건`:'맡길 아이템을 고르자 (최대 2건)';c.forEach(x=>{x.disabled=!x.checked&&n>=2;});};document.querySelectorAll('#mb input[data-ai]').forEach(x=>x.onchange=up);up();}}
// 지시한 취재가 기사로 나가면 그 기자 이름으로 스크랩에 남는다 (데스크: 나)
function subClip(h,good){const o=OUT();const q=clamp(Math.round((good?58:46)+h.sk/5+R(-6,6)),25,92);const imp=h.imp||40;const pl=placeOf(q,imp,{d:S.dept});const views=Math.round(q*imp*(o.p+1)*R(6,10)/10);
  const c={h:(h.excl&&good?'[단독] ':'')+h.title,o:o.n,d:S.dept,q,imp,excl:!!(h.excl&&good),date:dateShort(),turn:S.turn,views,lead:`${h.title}.`,by:h.who+' 기자',staff:1,desk:S.name,place:pl.n,portal:portalRank(imp,q,!!(h.excl&&good),gradeOf({imp,excl:h.excl}),1,o.p)};S.clips.unshift(c);if(S.clips.length>60)S.clips.pop();return c;}
function hRel(ref,v,why){if(!ref)return;if(ref.role&&CROLE[ref.role])relUp(ref,v,why);else ref.rel=clamp((ref.rel||0)+v,-50,100);}
// 7.0 한 번에 두 건까지 넘길 수 있다 (같은 사람에게)
function runHandoff(){const L=S.items.slice();const sel=()=>[...document.querySelectorAll('#mb input[data-hi]:checked')].map(x=>L[+x.dataset.hi]).filter(Boolean);
  openModal('어떤 아이템을 넘길까',`<p>손이 모자라거나, 내 출입처가 아니거나, 동료가 더 잘 쓸 아이템은 넘기는 게 낫다. 한 번에 두 건까지 같은 사람에게 넘길 수 있다. 넘긴 아이템이 잘되면 공을 나누고, 망하면 뒷말이 남는다.</p><p class="pcount" id="gsel"></p>${L.map((it,i)=>`<label class="chk"><input type="checkbox" data-hi="${i}"${L.length===1?' checked':''}><span><b>${esc(it.title)}</b><small>${DEPTS[it.d].n}${esc(itEntTxt(it))} · 확인 ${it.facts.filter(fOK).length}/${it.facts.length}${it.excl?' · 단독':''} · 파급력 ${it.imp}</small></span></label>`).join('')}`,
  [{label:'넘길 사람 고르기',fn:()=>{const X=sel();if(!X.length){toast('넘길 아이템을 골라 주세요');return false;}handoffTo(X);return false;}},{label:'취소',cls:'ghost'}]);
  {const up=()=>{const c=[...document.querySelectorAll('#mb input[data-hi]')];const n=c.filter(x=>x.checked).length;const el=document.getElementById('gsel');if(el)el.textContent=n?`선택 ${n}건 / 최대 2건`:'넘길 아이템을 고르자 (최대 2건)';c.forEach(x=>{x.disabled=!x.checked&&n>=2;});};document.querySelectorAll('#mb input[data-hi]').forEach(x=>x.onchange=up);up();}};
function handoffTo(it){const its=[].concat(it);it=its[0];const T=handoffTargets(it);if(!T.length){toast('넘길 사람이 없다');return;}
  openModal('누구에게 넘길까',`<p class="lede">${its.map(x=>`「${esc(x.title)}」`).join(' · ')}</p><p class="hint">실력이 좋을수록 잘 살리고, 관계가 좋을수록 공을 나눠 준다. 경쟁 동기에게 넘기면 그쪽 공이 될 가능성이 크다.</p>`,
   T.map(t=>({label:`${t.name}`,tag:t.kind,sub:`추정 실력 ${clamp(t.skill-5,1,99)}~${clamp(t.skill+5,1,99)} · 관계 ${t.rel}${t.ref&&t.ref.owe?` · 나에게 빚 ${t.ref.owe}`:''}`,fn:()=>{handoffDeal(its,t);return false;}})).concat([{label:'뒤로',cls:'ghost',fn:()=>{RUN.handoff();return false;}}]));}
// 넘기는 조건: 그냥 · 공동 바이라인 · 맞교환 · 밥 사며 · (데스크) 지시로
function handoffDeal(it,t){const its=[].concat(it);it=its[0];const tradeP=clamp(.35+t.rel/150+t.skill/300,.2,.85);
  const go=(mode)=>{
     spend(1,1);let H=null;its.forEach((it,k)=>{S.items=S.items.filter(x=>x!==it);hRel(t.ref,(it.excl?8:5)*(k?.5:1),'아이템을 넘겨받음');
     const sk=t.skill+(it.facts.filter(fOK).length*5)-(k?4:0);S.handoffs=S.handoffs||[];S.handoffs.push({who:t.name,kind:t.kind,ref:t.ref&&t.ref.id,col:!!(t.ref&&t.ref.role&&CROLE[t.ref.role]),title:it.title,imp:it.imp,excl:it.excl,sk,due:S.turn+R(4,12)+(k?R(2,6):0),rival:t.ref&&t.ref.role==='rivalpeer',sub:S.rank>=2&&t.kind==='부서원'});
     if(S.rank>=2&&t.kind==='부서원')S.flags.plan=(S.flags.plan||0)+1;
     H=S.handoffs[S.handoffs.length-1];H.mode=mode;
     if(mode==='co'){H.sk+=10;H.co=1;if(!k)hRel(t.ref,2,'공동 바이라인');}});
     if(mode==='trade'){if(chance(tradeP)){const ni=makeItem(S.dept,{mult:.95,excl:chance(.3)});ni.from=t.name;S.items.push(ni);H.traded=1;toast(`맞교환 성사 · ${jo2(t.name,'이','가')} 「${ni.title}」${jp(ni.title,'을','를')} 넘겨줬다`);}else{if(t.ref)t.ref.owe=(t.ref.owe||0)+1;toast(`${t.name}: "지금은 줄 게 없어. 대신 하나 빚진 걸로 하자."`);}}
     if(mode==='meal'){hRel(t.ref,6,'밥 한 끼');apply({money:-4,cha:.3});}
     if(mode==='order'){if(t.ref){t.ref.skill=clamp((t.ref.skill||40)+1,0,95);}apply({eval:.4});}
     if(mode==='plain'){apply({cha:.2});}
     log(`아이템 넘김: ${its.map(x=>`「${x.title}」`).join(' · ')} → ${t.name}`);if(mode!=='trade')toast(`${t.name}: "${pick(hoLines(mode,t))}"`);};
  const sub=S.rank>=2&&t.kind==='부서원';
  openModal(`${t.name}에게 넘기기`,`<p class="lede">${its.length>1?`「${esc(its[0].title)}」 · 「${esc(its[1].title)}」 두 건을`:`「${esc(it.title)}」${jo2(it.title,'을','를').slice(it.title.length)}`} ${esc(t.name)}에게 넘긴다. 어떻게 넘길까?</p><p class="hint">넘긴 아이템이 잘되면 공을 나누고, 받은 쪽은 언젠가 아이템·제보·대타로 보답한다.</p>`,[
   {label:'그냥 넘긴다',sub:'관계↑ · 나중에 보답 가능성',fn:()=>go('plain')},
   {label:'공동 바이라인으로',rec:!sub,sub:'성공 확률↑ · 잘되면 평판 나눔 · 관계 조금↑',fn:()=>go('co')},
   {label:'내 출입처 아이템과 맞바꾼다',sub:`맞교환 성사 ${pct(tradeP)} · 안 되면 빚으로 남는다`,fn:()=>go('trade')},
   {label:'밥 사면서 넘긴다',sub:'통장 -4만 · 관계 더↑',fn:()=>go('meal')},
   ...(sub?[{label:'데스크로서 지시해 맡긴다',rec:true,sub:'부서원 실력↑ · 평가 조금↑',fn:()=>go('order')}]:[])]);}
// 받은 쪽의 보답: 빚(owe)이 있으면 가끔 아이템·제보·대타로 갚는다
function owePay(lines){const L=[...(S.cols||[]),...(S.team||[]),...(S.mates||[])].filter(x=>x&&x.owe>0);if(!L.length||!chance(.2))return;const m=pick(L);m.owe--;const r=Math.random();
  if(r<.45&&S.items.length<6){const it=makeItem(S.dept,{excl:chance(.4),mult:1.05});it.from=m.name;S.items.push(it);lines.push({c:'g',t:`${jo2(m.name,'이','가')} 지난번 빚을 갚았다 — 「${it.title}」 귀띔`});}
  else if(r<.75){S.hp=clamp(S.hp+12,0,100);lines.push({c:'g',t:`${jo2(m.name,'이','가')} 내 당직을 대신 서 줬다 (컨디션 회복)`});}
  else{apply({eval:.6});lines.push({c:'g',t:`${jo2(m.name,'이','가')} 회의에서 내 기사를 밀어 줬다 (평가↑)`});}}
function findRef(h){if(!h.ref)return null;return (S.cols||[]).find(c=>c.id===h.ref)||(S.team||[]).find(m=>m.id===h.ref)||(S.mates||[]).find(m=>m.id===h.ref)||(S.corr||[]).find(m=>m.id===h.ref)||null;}
function handoffTick(Q){if(!S.handoffs||!S.handoffs.length)return;const due=S.handoffs.filter(h=>h.due<=S.turn);S.handoffs=S.handoffs.filter(h=>h.due>S.turn).concat(due.slice(2));
  due.slice(0,2).forEach(h=>{const ref=findRef(h);const r=Math.random(),good=clamp(.35+h.sk/160,.25,.85);
    if(r<good){// 잘 터뜨림
      if(h.rival&&chance(.6)){Q.push(()=>openModal('공은 저쪽으로',`<p class="lede">${jo2(esc(h.who),'이','가')} 「${esc(h.title)}」${jp(esc(h.title),'을','를')} ${h.excl?'단독으로 ':''}터뜨렸다. 편집국 메신저에 축하가 쏟아진다. 내 이름은 어디에도 없다.</p>`,[{label:'축하한다고 말한다',sub:'관계↑ · 멘탈↓',fn:()=>{hRel(ref,8,'단독 축하');gain('men',-1);}},{label:'"그거 내가 준 거잖아" 뒷말을 한다',sub:'관계 크게↓, 사내 평판 미묘',fn:()=>{hRel(ref,-18,'공 다툼');toast(apply({eval:-1}));}}]));}
      else if(h.sub){const cl=subClip(h,true);const big=h.excl||/1면|톱|첫 꼭지/.test(cl.place||'');const hi=S.rank>=4;
        Q.push(()=>openModal(h.excl?'부서원의 단독':'맡긴 기사가 나갔다',`<p class="lede">맡긴 「${esc(h.title)}」${jo2(h.title,'을','를').slice(h.title.length)} ${jo2(esc(h.who),'이','가')} ${esc(cl.place||'지면')}에 올렸다. "${jo2(myTitle(),'이','가')} 방향을 잡아 주셔서요."</p>${clipHTML(cl)}${fxLine(apply({eval:(big?1.8:.9)*(hi?.8:1),fame:big?.6:.2}))}`));
        if(ref){ref.skill=clamp((ref.skill||50)+(big?2:1),0,95);if(ref.ai)ref.ai.e=Math.min(95,ref.ai.e+(big?4:2));if(ref.ai&&h.excl)ref.ai.sc=(ref.ai.sc||0)+1;}S.flags.plan=(S.flags.plan||0)+(big?3:1);S.co.q=Math.min(100,S.co.q+(h.excl?.6:.2));S.subDone=(S.subDone||0)+1;}
      else Q.push(()=>openModal('넘겨준 아이템이 터졌다',`<p class="lede">${jo2(esc(h.who),'이','가')} 「${esc(h.title)}」${jp(esc(h.title),'을','를')} ${h.excl?'단독으로 ':''}냈다. 기사 끝에 "${esc(S.name)} 기자가 취재에 참여했다"는 한 줄이 붙었다.</p>`,[{label:'술 한잔 하자고 한다',sub:'관계↑',fn:()=>{hRel(ref,10,'공동 성과');toast(apply({fame:h.excl?1.2:.5,eval:1}));}},{label:'다음엔 내가 쓰겠다고 한다',sub:'평판↑ 조금',fn:()=>toast(apply({fame:h.excl?1:.4}))}]));
      if(ref)ref.owe=(ref.owe||0)+1;}
    else if(r<good+.15){// 망침
      if(h.sub&&ref&&ref.ai)ref.ai.er=(ref.ai.er||0)+1;Q.push(()=>openModal(h.sub?'맡긴 기사가 탈이 났다':'넘겨준 아이템이 탈이 났다',`<p class="lede">${jo2(esc(h.who),'이','가')} 쓴 「${esc(h.title)}」에 정정 요청이 들어왔다. 확인이 덜 된 부분이 있었다.${S.rank>=2&&h.sub?' 데스크로서 책임도 있다.':''}</p>`,[{label:'같이 수습한다',sub:'관계↑, 평가 조금↓',fn:()=>{hRel(ref,6,'함께 수습');toast(apply({eval:h.sub?-1.5:-.5}));}},{label:'"나는 넘겨만 줬다"고 선을 긋는다',sub:'관계↓',fn:()=>{hRel(ref,-12,'책임 회피');}}]));}
    else if(r<good+.27){// 묵혀서 물먹음
      Q.push(()=>openModal('묵혀 둔 아이템',`<p class="lede">${jo2(esc(h.who),'이','가')} 「${esc(h.title)}」${jp(esc(h.title),'을','를')} 미루는 사이 타사가 먼저 썼다.</p><p>"미안, 다른 거 하느라…"</p>`,[{label:'괜찮다고 한다',fn:()=>hRel(ref,4,'너그러움')},{label:`${bossT()}에게 알린다`,sub:'관계↓, 평가 조금↑',fn:()=>{hRel(ref,-10,'고자질');toast(apply({eval:.6}));}}]));}
    else if(h.sub){// 지시한 취재: 평범하게 나간다
      const cl=subClip(h,false);Q.push(()=>openModal('맡긴 기사가 나갔다',`<p class="lede">${jo2(esc(h.who),'이','가')} 「${esc(h.title)}」${jo2(h.title,'을','를').slice(h.title.length)} 무난하게 써냈다. 크게 터지진 않았다.</p>${clipHTML(cl)}${fxLine(apply({eval:.4}))}`));if(ref)ref.skill=clamp((ref.skill||50)+.6,0,95);S.flags.plan=(S.flags.plan||0)+1;}
    else{// 보답 제보
      Q.push(()=>{const it=makeItem(S.dept,{excl:true,pre:1});S.items.push(it);openModal('보답',`<p class="lede">${esc(h.who)}: "지난번에 신세 졌잖아. 이거 네가 써." 「${esc(it.title)}」</p>${fxLine('단독 아이템 확보 (확인된 사실 1개)')}`);});}
  });}
// 처음 하는 사람은 기능이 천천히 열린다 (경험자·개발자 모드·스토리·창간 제외)
function isVet(){try{return localStorage.getItem('byline-vet')==='1';}catch(e){return false;}}
function setVet(){try{localStorage.setItem('byline-vet','1');}catch(e){}}
function newbie(){return S&&!S.dev&&!S.story&&!S.founder&&!S.devUnlock&&!isVet();}
const NEWBIE_W={drink:6,colleague:8,deptlife:10,handoff:16,hari:10,life:4,source:4,discover:4,network:20,special:12,adsell:12,plan:8,recruit:12,taskforce:8,column:8,revenue:8,lgevent:12,agenda:4,direction:8,campaign:8,digital:8,event:8,paypol:8,newdept:12};
// 창간 모드 처음: 대표의 일은 창업 단계에 맞춰 열린다 (취재·영업·채용 → 제휴·투자 → 시설·사업·행사)
const F_NEWBIE_W={network:8,fraise:12,fpartner:16,fethics:12,fcrisis:12,gad:12,facility:24,revenue:24,lgevent:36,fbureau:32,deptlife:8,handoff:16,fbrand:8};
function fNewbie(){return S&&S.founder&&!S.dev&&!S.devUnlock&&!isVet();}
function newbieLock(id){if(fNewbie()){const x=F_NEWBIE_W[id];if(x==null)return '';const w=S.turn-(S.fStart||0);return w>=x?'':`창업 초기라 아직 · ${moTxt(x-w)} 뒤 열린다`;}if(!newbie())return '';const x=NEWBIE_W[id];if(x==null)return '';const u=UNLOCK[id]||{};const useTurn=u.w!=null||S.rank===0;const base=useTurn?(u.w||0):(u.rw||0);const cur=useTurn?S.turn:S.inRank;if(cur>=base+x)return '';return `처음이라 천천히 열린다 · ${moTxt(base+x-cur)} 뒤`;}
function lockReason(id){const nb=newbieLock(id);if(nb)return nb;const u=UNLOCK[id];if(!u||S.devUnlock)return '';const vet=S.story||S.founder;if(!vet&&u.w!=null&&S.turn<u.w)return u.why||'';if(!vet&&u.rw!=null&&S.inRank<u.rw)return u.why||'';if(u.c&&!u.c())return vet?(id==='write'?'확인된 사실이 있는 아이템이 필요하다':'아이템이 필요하다'):u.why||'';return '';}
function rankActs(){let a=RANK_ACTS[S.rank];if(S.founder){a=FOUNDER_ACTS.slice();if(spmId()&&!a.includes('spx'))a.splice(Math.max(0,a.indexOf('discover')),0,'spx');}else if(S.rank>=1&&S.rank<=5&&spmId()&&!a.includes('spx')){a=a.slice();const i=a.indexOf('special');a.splice(i>=0?i+1:Math.max(0,a.indexOf('source')),0,'spx');}if((S.founder||S.rank>=3&&S.rank<=6)&&!S.story&&!a.includes('gongse')){a=a.slice();a.push('gongse');}if(!S.story&&S.cs&&!a.includes('cfile')){a=a.slice();a.push('cfile');}if(!S.story&&S.spec2&&!a.includes('spec')){a=a.slice();a.push('spec');}if(!S.story&&S.route&&S.rank>=1&&!a.includes('rtact')){a=a.slice();a.push('rtact');}if(a.includes('ownmeet')&&!ownMeetOK())a=a.filter(x=>x!=='ownmeet');if(S.simple)a=a.filter(id=>!SIMPLE_HIDE.includes(id));return a;}
function checkUnlocks(){S.unl=S.unl||{};const fresh=[];rankActs().forEach(id=>{if(id==='breaking')return;const k=S.rank+':'+id;if(!S.unl[k]&&!lockReason(id)){S.unl[k]=1;if(S.turn>0||S.rank>0)fresh.push(id);}});return fresh;}
const TIPS={get spx(){const m=typeof spmId==='function'&&S?spmId():null;return m?SPM[m].rule:'';},
 get sasu(){try{return sasuCfg().tip;}catch(e){return SASU_CFG.police.tip;}},
 report:'정보보고는 수습의 기본기다. 평가를 조금씩 쌓는다.',
 drink:'선배들과의 술자리는 평가와 인맥을 올리지만 체력이 든다.',
 colleague:'동료와 시간을 보내 관계를 다진다. 관계가 40을 넘으면 도움을 받고, -20 아래면 투서·뒷말 같은 일이 생긴다. "사내 관계" 탭에서 확인한다.',
 invest:'취재 나가기는 시간 3~4칸짜리 현장이다. 기법마다 노리는 사실과 성공 확률이 보인다. 핵심 사실은 서로 다른 두 경로로 확인해야 한다. 반론(서면 질의·인터뷰)도 받아 두자.',
 write:'기사는 야마 → 리드 → 팩트·반론 → 제목 → 매체별 단계 순서로 쓴다. 확인 안 된 사실을 넣거나 반론이 없으면 오보 위험이 커진다.',
 hari:'뻗치기는 체력을 많이 쓰지만 아무도 못 들은 한마디를 건질 수 있다.',
 pitch:'매주 무료로 할 수 있는 아침 발제. 아이템을 올리면 지면(1면·면 톱·단신)과 마감이 정해진다. 마감을 넘기면 질책을 받는다.',
 beat:'출입처 브리핑에서 질문하거나 백브리핑을 따라가 아이템과 취재원을 얻는다.',
 source:'취재원과 밥을 먹어 신뢰를 쌓는다. 신뢰 40이 넘으면 단독 제보가 나오고, 문건 입수가 가능해진다.',
 discover:'보도자료·커뮤니티·현장·공공 데이터에서 아이템을 찾는다. 커뮤니티 글에는 허위 제보가 섞여 있다.',
 deptreq:'원하는 부서로 이동을 신청하면 다음 정기 인사(1월·7월)에 반영된다. 부장과 사이가 좋을수록 잘 받아들여진다.',
 desk:'데스킹은 후배 초고에서 문제 문장을 골라내는 일이다. 놓치면 오보가 된다.',
 adsell:'차장부터는 광고·협찬 영업도 한다. 광고주를 골라 지면 광고·특집 협찬·포럼 협찬을 제안한다. 차장부터는 부서 반기 광고 목표가 생긴다(차장·부장이 함께 채운다). 우리 기사에 나온 회사는 조건을 붙인다.',
 plan:'부서 기획회의로 분기 기획을 정한다. 부서 성과가 오른다.',
 recruit:'타사 기자를 스카우트한다. 우리 매체 급이 높을수록 잘 넘어온다.',
 meeting:'편집회의를 주재한다. 부장들이 올린 발제 3건을 1면·안쪽 면·보강 지시·킬 가운데 하나로 정한다. 확인이 덜 된 기사를 1면에 올리면 오보 위험이 있다.',
 front:'내일 자 톱을 정한다. 논조와 광고주 관계도 함께 따진다.',
 tour:'편집국을 돌며 번아웃·부서 갈등·이직 조짐 같은 일을 처리한다.',
 taskforce:'에이스를 뽑아 몇 주짜리 대형 탐사를 맡긴다. 성공하면 대특종, 실패하면 시간만 날린다.',
 column:'기명 칼럼으로 평판과 신뢰를 관리한다.',
 breaking:'대형 사건이 터지면 이번 주 안에 보도 체제를 정해야 한다. 늦으면 평가가 깎인다.',
 direction:'편집국장은 매체의 독자 전략과 논조를 정한다.',
 campaign:'구독 캠페인으로 부수·시청자를 늘린다.',
 network:'출입처 기관·정당·인물·광고주와의 관계를 관리한다. 관계가 좋으면 먼저 전화가 오고 문건이 잘 나오며 광고가 늘어난다. 비판 기사를 쓰면 관계가 깎이고, 기업은 광고를 끊고 기관은 자료를 거부하며 인물은 고소한다. 관계망 탭에서 확인한다.',
 adsales:'사장은 광고 영업 총력전을 지휘한다.',digital:'디지털 플랫폼에 투자한다.',hire:'수습기자를 공채로 뽑는다.',cut:'희망퇴직으로 비용을 줄인다.',event:'후원 포럼으로 부대 수입을 올린다.'
};
function apParts(){const o=OUT()||{p:3,type:'daily'};const p=[['기본',4]];{if(S.apBonus>S.turn)p.push(['부서 성적 1위',1]);const ta=otrAp(o);if(ta)p.push(['회사 특성',ta]);const da=(S.phase==='game'&&(deptFx()||{}).ap)||0;if(da)p.push(['일당백 부서',da]);}if(hasF('ai'))p.push(['AI 편집 보조',1]);if(o.p<=2)p.push(['작은 매체, 일당백',1]);if(['wire','ch','online'].includes(o.type))p.push(['속보 매체',1]);if(S.rank>=4)p.push(['간부 보좌',1]);if(S.rank===0)p.push(['막내의 발',1]);if(S.rank===3||S.rank===7&&(!S.founder||o.p>=4))p.push([S.rank===7?'비서실':'부서 장악',1]);if(S.founder&&o.p>=3)p.push(['편집국이 손발',1]);if(S.rank>=1&&S.rank<=3){if(['case','soc','nat','loc','sigun','spo','base','foot','court'].includes(S.dept))p.push(['현장 부서',1]);else if(['inv','int','diplo'].includes(S.dept))p.push(['호흡 긴 부서',-1]);}if(o.p>=4&&S.rank>=4)p.push(['큰 조직의 손발',1]);if(S.phase==='game'&&typeof trSum==='function'&&trSum('ap'))p.push(['워커홀릭',trSum('ap')]);if(S.fCtl>S.turn)p.push(['공동대표 체제',-1]);if(S.st.sta>=65)p.push(['체력',1]);if(S.st.spd>=70)p.push(['속도',1]);if(S.hp<30)p.push(['컨디션 저하',-1]);if(S.hp>=65)p.push(['컨디션 좋음',1]);return p;}
function apBase(){const sum=clamp(apParts().reduce((a,x)=>a+x[1],0),3,8);const b=sum-4;const v=S&&S.simple?clamp(6+Math.round(b*.7),6,9):S&&S.founder?clamp(6+b,6,11):clamp(6+b,6,11);return S&&S.sick>S.turn?Math.max(4,Math.floor(v/2)):v;}
const wkTxt=w=>w<=4?'이번 달 안':`약 ${Math.ceil(w/4)}달`;
// 아이템 시간: 주 대신 '달'과 '행동 몇 번'으로 (한 달 행동력 기준)
const heatTxt=w=>{if(w<=0)return '곧';const n=Math.ceil(w/4);return n<=1?'이번 달 말까지':n===2?'다음 달 말까지':`${n}달 안 (월말 ${n}번)`;};const moTxt=w=>`${Math.floor(w/4)}개월`;
function setCd(id){const cd=ACT[id].cd;if(!cd)return;if(cd<4){S.cdUse=S.cdUse||{};const k=id+':'+S.turn;S.cdUse[k]=(S.cdUse[k]||0)+1;if(S.cdUse[k]>=Math.floor(4/cd))S.cd[id]=S.turn+1;return;}S.cd[id]=S.turn+cd;}
function cdLeft(id){const c=S.cdUse&&S.cdUse[id+':'+S.turn];const cd=ACT[id].cd;return cd&&cd<4?Math.floor(4/cd)-(c||0):null;}
const RUN={};
function quickClip(title,q,imp,extra){
  const o=OUT();q=clamp(Math.round(q),10,95);imp=clamp(Math.round(imp),5,60);const views=Math.round(q*imp*(o.p+1)*R(6,10)/10);
  const clip={h:title,o:o.n,d:cat1(S.dept),q,imp,excl:false,date:dateShort(),turn:S.turn,views,lead:extra||title+'.',by:S.name,place:imp>=30?(isTV()?'메인뉴스':'종합면'):'온라인 단신',portal:portalRank(imp,q,false,'',1,o.p)};
  S.clips.unshift(clip);if(S.clips.length>60)S.clips.pop();S.weekArticles++;S.monthQ.push(q);S.totalArticles=(S.totalArticles||0)+1;ach('first');if(S.totalArticles>=100)ach('hundred');
  try{spQuick(clip);}catch(e){}tick(`[${o.n}] ${title}`,1);return apply({eval:q/45,fame:imp/90,wri:.3,spd:.3});
}
RUN.portal=function(){const P0=S.portal;
  openModal('포털 제휴 전략',`<p>지금 등급: <b>${PORTAL[P0.lv]}</b> · 벌점 ${P0.pen}${P0.demote?` · 강등 패널티 ${wkTxt(P0.demote)}`:''}</p><p class="hint">등급이 높을수록 트래픽이 크게 늘고, 콘텐츠 제휴(CP)가 되면 포털이 전재료를 준다. 심사는 반년에 한 번(6월·12월 말). 자극적 제목·광고성 기사는 벌점이다.</p>`,[
   {label:'다음 심사에 승격 신청',sub:P0.lv>=3?'이미 최고 등급':S.founder&&S.turn-(S.fStart||0)<48?`창간 1년이 지나야 신청할 수 있다 (${Math.ceil((48-(S.turn-(S.fStart||0)))/4)}개월 남음)`:`보도 품질·신뢰도·평판·벌점·매체 급으로 평가`,disabled:P0.lv>=3||P0.apply||(S.founder&&S.turn-(S.fStart||0)<48),fn:()=>{spend(1,3);setCd('portal');P0.apply=1;toast('제휴 심사 신청서를 냈다');}},
   {label:'어뷰징 기사 정리',sub:'벌점 -2, 이번 달 트래픽 조금↓',fn:()=>{spend(1,3);setCd('portal');P0.pen=Math.max(0,P0.pen-2);S.co.bT-=.005;toast('낚시성 기사 수백 건을 내렸다');}},
   {label:'포털 담당자 접대',sub:'심사에 유리할 수도. 들키면 신뢰도↓',fn:()=>{spend(1,4);setCd('portal');S.co.cash-=.1;if(chance(.25))toast(apply({trust:-4})+' · 접대가 업계에 소문났다');else{netUp('portal',8);P0.pen=Math.max(0,P0.pen-1);toast('관계가 좋아졌다');}}},
   {label:'취소',cls:'ghost'}]);};
RUN.facility=function(){S.facil=S.facil||{};const c=S.co.cash;
  openModal('시설·개선 투자',`<p>회사 자금 <b>${eok(c)}</b> · 지금 시설 유지비 월 ${eok(facUpkeep())}. 비용은 매체 규모에 맞춰 달라진다(작은 매체는 작게 짓는다). 한 번 지으면 계속 효과가 난다.</p>`,Object.keys(FACIL).map(k=>{const F=FACIL[k],cost=facCost(k),up=F[3]*facSize();return{label:`${F[0]} · ${eok(cost)}`,sub:`${F[2]} · 유지비 월 ${up<.1?Math.round(up*10000)+'만':f1(up)+'억'}`,disabled:hasF(k)||c<cost,fn:()=>{spend(1,4);setCd('facility');S.co.cash-=cost;S.facil[k]=dateShort();S.facSz=S.facSz||{};S.facSz[k]=facSize();S.co.q+=2;if(k==='hq'){apply({fame:3});S.cols&&S.cols.forEach(x=>relUp(x,5));}log(`시설 투자: ${F[0]}`);tick(`${OUT().n}, ${F[0]} 개소`,1);toast(`${F[0]} 완공`);}};}).concat([{label:'닫기',cls:'ghost'}]));};
RUN.paypol=function(){const cur=S.payLv||1;openModal('연봉·처우 정책',`<p>지금 수준: <b>${cur<1?'업계 하위':cur>1?'업계 상위':'업계 평균'}</b>. 인건비는 회사 비용의 대부분이다.</p>`,[
  {label:'업계 평균 이상으로 올린다 (×1.2)',sub:'인건비↑, 부서원 실력 성장·이직 방어↑, 영입 성공률↑',fn:()=>{spend(1,3);setCd('paypol');S.payLv=1.2;S.team.forEach(t=>t.skill+=1);toast(apply({eval:1,trust:1}));}},
  {label:'평균으로 맞춘다 (×1.0)',fn:()=>{spend(1,3);setCd('paypol');S.payLv=1;toast('연봉을 평균 수준으로 맞췄다');}},
  {label:'동결·삭감 (×0.85)',sub:'인건비↓, 이직·사기 저하',fn:()=>{spend(1,3);setCd('paypol');S.payLv=.85;S.team.forEach(t=>t.skill-=1);if(S.team.length>3&&chance(.5)){const m=pick(S.team);S.team=S.team.filter(x=>x!==m);S.co.staff--;log(`${m.name} 기자 퇴사 — 처우 불만`);}toast(apply({trust:-1}));}},
  {label:'취소',cls:'ghost'}]);};
RUN.newdept=function(){const o=OUT();const cand=Object.keys(DEPTS).filter(d=>!o.depts.includes(d)&&d!=='loc').slice(0,12);const setup=+(.02+.015*o.p).toFixed(2);
  openModal('부서 신설',`<p>지금 부서 ${o.depts.length}개: ${o.depts.map(d=>DEPTS[d].n).join('·')}</p><p class="hint">부서 신설은 조직 개편이다. 사람은 기존 부서에서 발령을 내거나 새로 뽑아 채운다. 따로 목돈이 드는 게 아니라 자리·장비 마련비(약 ${eok(setup)})와, 새로 뽑은 만큼 매달 인건비가 늘어난다. 출입처 운영비도 매달 조금 든다.</p><p class="hint">새 부서의 기관·기업은 처음엔 우리를 모른다. 관계를 쌓고 1년쯤 지나야 광고가 제대로 붙는다. 부서 수는 인력에 맞춰 최대 ${maxDepts()}개 · 없앤 부서는 2년 안에 다시 못 만든다.</p>`,cand.map(d=>{const recent=S.deptMade&&S.deptMade[d]!=null&&S.turn-S.deptMade[d]<YW*2;return {label:DEPTS[d].n,sub:recent?'없앤 지 2년이 안 됐다':S.co.cash<setup?`회사 자금이 모자란다 (${eok(setup)} 필요)`:o.depts.length>=maxDepts()?'부서 수가 이미 최대다':DEPTS[d].lede,disabled:S.co.cash<setup||o.depts.length>=maxDepts()||recent,fn:()=>{newDeptStaff(d,setup);return false;}};}).concat([{label:'취소',cls:'ghost'}]));};
function newDeptMake(d){const o=OUT();o.depts.push(d);S.co.extra=+((S.co.extra||0)+.006*o.p).toFixed(3);const add=buildEnts(o).filter(e=>!ENT[e[0]]);if(add.length){ENTS.push(...add);try{normEnts(ENTS,o);}catch(x){}S.ents=ENTS;setEnts(ENTS);add.forEach(e=>{S.net[e[0]]={rel:R(-5,5),cut:0,block:0,who:e[2]==='person'?rname():null,known:false,fresh:S.turn};});}(S.deptMade=S.deptMade||{})[d]=S.turn;S._entV=null;log(`${DEPTS[d].n} 신설`);}
function newDeptStaff(d,setup){const o=OUT();const mov=(S.team||[]).filter(m=>m.d!==d);const big=o.depts.map(x=>[x,mov.filter(m=>m.d===x).length]).sort((a,b)=>b[1]-a[1]);const canMove=mov.length>=6;const per=(S.founder?.066:.09)*(S.payLv||1);
  const pull=n=>{const out=[];for(let i=0;i<n;i++){const src=o.depts.map(x=>[x,S.team.filter(m=>m.d===x).length]).sort((a,b)=>b[1]-a[1])[0];const m=S.team.filter(t=>t.d===src[0]).sort((a,b)=>a.skill-b.skill)[0];if(m){m.d=d;out.push(m.name);}}return out;};
  const hire=n=>{for(let i=0;i<n;i++)S.team.push(genMember(d,35,60));S.co.staff+=n;};
  openModal(`${DEPTS[d].n} — 사람은 어디서?`,`<p>${jo2(DEPTS[d].n,'을','를')} 꾸릴 기자 3명을 정한다.</p><p class="hint">발령은 돈이 안 들지만 원래 부서에 빈자리가 생긴다. 새로 뽑으면 한 명당 매달 인건비 약 ${eok(per)}이 늘어난다.</p>`,[
   {label:'기존 부서에서 3명 발령',sub:canMove?`인건비 그대로 · 보도 품질 잠시↓ · 큰 부서(${DEPTS[big[0][0]].n})에서 먼저 뺀다`:'부서원이 6명은 넘어야 한다',disabled:!canMove,fn:()=>{spend(1,4);setCd('newdept');newDeptMake(d);S.co.cash-=setup;const L=pull(3);S.co.q=clamp(S.co.q-2,10,100);toast(`${DEPTS[d].n} 신설 · ${L.join('·')} 발령`);}},
   {label:'팀장은 발령, 2명은 새로 뽑기',sub:`매달 인건비 +${eok(per*2)} · 경험 있는 팀장`,disabled:mov.length<4,fn:()=>{spend(1,4);setCd('newdept');newDeptMake(d);S.co.cash-=setup;pull(1);hire(2);toast(`${DEPTS[d].n} 신설 · 1명 발령 + 2명 채용`);}},
   {label:'3명 모두 새로 뽑기',sub:`매달 인건비 +${eok(per*3)} · 다른 부서는 그대로`,fn:()=>{spend(1,4);setCd('newdept');newDeptMake(d);S.co.cash-=setup;hire(3);toast(`${DEPTS[d].n} 신설 · 3명 채용`);}},
   {label:'뒤로',cls:'ghost',fn:()=>{RUN.newdept();return false;}}]);}
RUN.found=function(){openModal('독립 언론 창간',`<p class="lede">회사를 나와 내 언론사를 세운다. 지금까지의 능력치·평판·취재원은 그대로 가져간다.</p><p>통장 ${S.money.toLocaleString('ko-KR')}만 원 중 대부분을 자본금으로 넣는다. 지금 커리어는 여기서 끝나고 창간 모드가 시작된다.</p>`,[{label:'사표를 내고 창간한다',fn:()=>{const keep={age:myAge(),st:{...S.st},fame:S.fame,trust:S.trust,sources:S.sources.slice(),name:S.name,major:S.major,spec:S.spec,diff:S.diff,money:S.money,dev:S.dev,turn:S.turn,awards:S.awards,scoops:S.scoops,history:S.history};log('창간을 결심했다');founderSetup(keep);return false;}},{label:'다시 생각한다',cls:'ghost'}]);};
RUN.special=function(){
  const d=S.dept,c=cat1(d),nm=actName('special');setCd('special');
  const item=(o,msg)=>{spend(1,6);const it=makeItem(d,o||{});S.items.push(it);openModal(nm,`<p class="lede">${msg} → 「${esc(it.title)}」</p>`);return it;};
  const yy=2027+Math.floor(S.turn/YW),mm=month();
  if(['eco','stock','spo','base','foot','cul','culspo','it','city'].includes(d)||(d==='ent'&&false)){
    spend(1,4);let t,q,imp;
    if(d==='eco'){const v=(R(-5,40)/10).toFixed(1);t=`${mm}월 소비자물가 ${v}% 상승…${pick(['외식비가 끌어올려','석 달 만에 최고','농산물값 진정세'])}`;q=S.st.dat*.5+S.st.spd*.3+S.st.wri*.2+R(-5,8);imp=R(14,26);}
    else if(d==='stock'){t=`코스피 ${pick(['반등','하락','보합'])} 마감…${pick(['외국인 순매도','반도체주 강세','개인 매수세','환율 급등 여파'])}`;q=S.st.spd*.5+S.st.dat*.3+S.st.wri*.2+R(-5,8);imp=R(10,20);}
    else if(['spo','base','foot','culspo'].includes(d)){const tm=pick(TEAMS);t=`${tm}, ${jo2(pick(['9회말 끝내기','후반 극장골','연장 혈투','대역전극','완봉승']),'으로','로')} ${R(2,6)}연승`;q=S.st.spd*.45+S.st.wri*.35+S.st.sta*.2+R(-5,8);imp=R(14,28);gain('sta',.1);}
    else if(d==='cul'){t=`[리뷰] ${pick(['연극','오페라','전시','뮤지컬'])} 「${pick(['겨울의 문장','마지막 정원','빛의 기록','붉은 방'])}」, ${pick(['고전을 다시 읽다','침묵으로 말하다','관객을 무대로 끌어들이다'])}`;q=S.st.wri*.55+S.st.kno*.3+S.st.hed*.15+R(-5,8);imp=R(10,22);}
    else if(d==='it'){t=`${pick(CORPS)} 신제품 공개…${pick(['AI 비서 탑재','가격 동결','폴더블 신작','자율주행 칩'])}`;q=S.st.kno*.3+S.st.int*.3+S.st.wri*.4+R(-5,8);imp=R(14,26);}
    else {t=`${pick(CITIES)}의회 본회의, ${pick(['예산 삭감 공방','시장 답변 태도 질타','조례안 통과','행정사무감사 파행'])}`;q=S.st.wri*.4+S.st.int*.3+S.st.net*.3+R(-5,8);imp=R(12,24);}
    const fx=quickClip(t,q,imp);openModal(nm,`<p class="lede">마감 30분 전 송고 완료.</p>${clipHTML(S.clips[0])}${fxLine(fx)}`);return;
  }
  if(d==='ent'){openModal(nm,'<p class="lede">오늘 연예 현장은 어디로 갈까?</p>',[
    {label:'쇼케이스·제작발표회 기사',sub:'무난한 현장 기사 (인터뷰·속도)',fn:()=>{spend(1,4);const t=`${pick(GROUPS_K)}, ${pick(['컴백 쇼케이스서','신곡 무대서','데뷔 5주년 무대서'])} "${pick(['이번엔 진짜 성장','팬들 덕분','처음으로 돌아간 마음'])}"`;const fx=quickClip(t,S.st.int*.4+S.st.spd*.3+S.st.wri*.3+R(-5,8),R(12,24));gain('int',.2);openModal(nm,`${clipHTML(S.clips[0])}${fxLine(fx)}`);return false;}},
    {label:'잠복 취재로 단독을 노린다',sub:'체력 -15, 열애·사생활 단독 가능, 신뢰도↓',fn:()=>{spend(1,15);if(chance(.35+S.st.inv/250+S.st.sta/400)){const it=makeItem('ent',{excl:true,pre:1,mult:1.2});S.items.push(it);openModal('잠복 성공',`<p class="lede">새벽 2시 지하주차장. 셔터를 눌렀다. → 「${esc(it.title)}」</p>${fxLine(apply({trust:-1.5}))}`);}else openModal('허탕',`<p class="lede">매니저 차량이 다른 출구로 빠져나갔다.</p>${fxLine(apply({trust:-.5}))}`);return false;}},
    {label:'방송사 대기실을 돈다',sub:'연예 관계자 취재원 확보',fn:()=>{spend(1,4);const s=addSource('ent',R(12,24));openModal(nm,`<p class="lede">${s.name} ${jo2(s.role,'과','와')} 명함을 바꿨다. "다음에 좋은 거 있으면 연락드릴게요."</p>`);return false;}}]);return;}
  if(d==='inv'){const trk=S.items.filter(i=>i.track),MAXT=3;const left=i=>i.facts.filter(f=>!fOK(f)).length,prog=i=>`확인 ${i.facts.length-left(i)}/${i.facts.length} · 시한 ${heatTxt(i.heat).split(' · ')[0]}`;
    const start=it=>{it.track=1;it.heat+=3;toast(`「${it.title}」 장기 추적 시작`);};
    const fresh=()=>{spend(1,6);const it=makeItem(d,{excl:true,mult:1.2});S.items.push(it);if(trk.length<MAXT)start(it);openModal(nm,`<p class="lede">탐사팀 제보함에서 장기 추적감을 골랐다 → 「${esc(it.title)}」</p><p class="hint">${trk.length<MAXT?'바로 추적 파일을 붙였다. 매주 사실 하나씩 자동으로 확인을 시도한다.':`추적 파일은 ${MAXT}개까지라 이번 건은 손으로 취재해야 한다.`}</p>`);return false;};
    const cand=S.items.filter(i=>!i.track&&!i.story&&left(i)>0);
    if(!cand.length&&trk.length<MAXT){fresh();return;}
    openModal(nm,`<p>추적 파일을 붙일 아이템을 고른다. 매주 사실 하나씩 자동으로 확인을 시도하고, 단독 시한이 늘어난다.</p><p class="hint">추적 중 ${trk.length}/${MAXT}${trk.length?' — '+trk.map(i=>`「${esc(i.title)}」 ${prog(i)}`).join(' · '):''}</p>`,
      (trk.length<MAXT?cand.slice(0,6).map(it=>({label:it.title,sub:prog(it),fn:()=>{spend(1,5);start(it);}})):[])
      .concat([{label:'제보함에서 새 추적감 고르기',sub:trk.length<MAXT?'새 아이템을 받아 바로 추적을 붙인다':`추적 파일이 꽉 찼다 (${MAXT}개) — 새 아이템만 받는다`,fn:fresh},{label:'취소',cls:'ghost'}]));return;}
  if(d==='case'){spend(1,10);let msg=[];for(let i=0;i<2;i++){if(chance(.3+S.st.inv/400)){const it=makeItem('soc',{mult:.8});S.items.push(it);msg.push(`단서 → 「${it.title}」`);}else msg.push(pick(['"오늘은 조용해."','당직 형사가 자리를 비웠다.']));}openModal(nm,`<ul class="feed">${msg.map(m=>`<li>${esc(m)}</li>`).join('')}</ul>`);return;}
  if(d==='court'){spend(1,5);const it=makeItem(d,{excl:chance(.4)});const f=it.facts.find(x=>x.k==='d'||x.k==='n');if(f&&chance(.4+S.st.ver/200+S.st.dat/400)){fFill(f,'판결문');}S.items.push(it);gain('ver',.3);openModal(nm,`<p class="lede">판결문 수십 건을 읽었다. → 「${esc(it.title)}」${f&&fOK(f)?' (문건 사실 확인됨)':''}</p>`);return;}
  if(d==='pol'){const n=month()===10?2:1;spend(1,6);const its=[];for(let i=0;i<n;i++){if(!chance(.7))continue;const it=makeItem('pol',{pre:1,excl:chance(.2)});S.items.push(it);its.push(it);}if(!its.length){openModal(nm,'<p class="lede">의원회관을 다 돌았지만 오늘은 건질 게 없었다. 보좌관들과 얼굴만 익혔다.</p>');gain('net',.4);return;}netUp('ruling',2);netUp('opp',2);openModal(nm,`<p class="lede">의원회관 3층부터 9층까지 돌았다.${n>1?' 국감 시즌이라 자료가 쏟아진다.':''}</p><ul class="feed">${its.map(i=>`<li class="g">「${esc(i.title)}」</li>`).join('')}</ul>`);return;}
  if(d==='int'||d==='diplo'){gain('lng',.3);item({pre:S.st.lng>=40?2:1,excl:chance(.3)},S.st.lng>=40?'현지 언론 원문까지 읽었다':'번역기를 돌려 가며 외신을 훑었다');return;}
  if(d==='fin'){gain('net',.3);item({pre:1},'금융권 인사 하마평을 모으다 실마리를 잡았다');return;}
  if(['nat','sigun','loc','med','edu','soc','ind','estate'].includes(d)){gain('cha',.2);const it=item({pre:1,excl:chance(.3)},{nat:'지방 총국 기자들과 저녁을 먹었다',sigun:'마을회관 어르신들이 하소연을 쏟아냈다',loc:'현장 민원인을 만났다',med:'응급실 앞 대기 의자에서 보호자들과 이야기했다',edu:'입시 설명회장 학부모 틈에 앉았다',soc:'시경 캡 회의에서 사건 정보를 나눴다',ind:'공장 정문 앞에서 교대 근무자들과 이야기했다',estate:'견본주택 상담 창구에 앉아 봤다'}[d]);const ge=it.ent;netUp(ge,2);return;}
  item({pre:1},'부서 고유 업무를 챙겼다');
};

function doAction(id){if(why(id))return;if(S.opScoop===1&&S.phase==='game'&&!S.founder&&!S.story&&S.rank===0&&S.turn<12&&!['life','rest','job'].includes(id)){S.opN=(S.opN||0)+1;if(S.opN>=2){S.opScoop=2;Q.push(opScoopEv);}}MSTACK=[];S._mc=false;if(ACT[id]&&!actCost(id)){S._mc=true;try{misCount(id);}catch(e){}}try{snapStart(id);}catch(e){}S._curAct=id;S._sur=false;try{fMixAdd(id);}catch(e){}if(id==='gad')S.gadUsed=1;if(S.founder&&FST_GAIN[id]&&!/^f[a-z]/.test(id))fgain(FST_GAIN[id],.25);S.scene=ACT[id].sc;drawScene();S.tipSeen=S.tipSeen||{};if(tipToast(id)){}else if(tipMode()==='on'&&!S.tipSeen[id]&&TIPS[id]&&!(S.unl&&S.unl[S.rank+':'+id+':shown'])){S.tipSeen[id]=1;openModal(`처음 해 보는 일 · ${actName(id)}`,tipBody(TIPS[id]),[{label:'시작하기',fn:()=>{const t0=mTok;RUN[id]();return mTok!==t0?false:undefined;}},{label:'앞으로 팁 끄기',cls:'ghost',fn:()=>{S.tipsOn=false;const t0=mTok;RUN[id]();return mTok!==t0?false:undefined;}}]);return;}RUN[id]();}

// --- 수습 ---
RUN.sasu=function(){
  spend(2,0);if(S.rank===0){S.rkSasu=(S.rkSasu||0)+1;if(isTV())gain('brd',.35);if(OUT().type==='wire')gain('spd',.3);}const sp=cat1(S.dept)==='spo';const d=S.dept;
  const SC=sasuCfg();const LOCS=SC.L;
  const run={left:3,lines:[],found:0,visited:new Set()};
  const visit=l=>{run.left--;run.visited.add(l.n);S.hp=clamp(S.hp-(S.gear&&S.gear.car?3:5),0,100);gain('inv',.35);gain('sta',.15);
    const busy=S.items.length>=5?.3:S.items.length>=3?.15:0;let r=Math.random()+S.st.inv/700+S.st.net/1000-busy;if(S.rank===0&&S.story!=='rookie')r=Math.min(r,.99);
    // 수습 사쓰마와리: 아이템은 드물고, 대부분 짧은 정보(메모)다. 메모는 정보보고 때 평가로 바뀌고, 물먹을 일도 없다
    if(r<.38){gain('net',.3);run.lines.push({c:'',t:`${l.n}: ${pick(SC.cold)}`});}
    else if(r<.74&&S.rank===0){S.memo=(S.memo||0)+1;gain('kno',.15);run.found+=.4;run.lines.push({c:'s',t:`${l.n}: ${pick(SC.memo)} (정보보고 거리)`});}
    else if(S.rank===0&&S.story!=='rookie'&&r<.995){const q=Math.random();if(q<.55){const sc=addSource(d,R(10,20));sc.role=sasuRole(l,SC);run.lines.push({c:'s',t:`${l.n}: ${sc.name} ${jo2(sc.role,'과','와')} 안면을 텄다.`});}
      else if(q<.85){const rv=S.rival&&S.rival.name?S.rival.name:'타사 수습';run.lines.push({c:'r',t:`${l.n}: ${pick(SC.miss)} ${jo2(rv,'이','가')} 먼저 챙겨 갔다. 물먹었다.`});apply({eval:-.3});S.memo=(S.memo||0)+.5;}
      else if(q<.97){S.memo=(S.memo||0)+1.5;run.found+=.6;run.lines.push({c:'s',t:`${l.n}: ${pick(SC.big)} (정보보고 거리 · 굵직함)`});}
      else{const it=makeItem(d,{mult:.6*l.k,excl:false});S.items.push(it);run.found++;run.lines.push({c:'g',t:`${l.n}: 단신감 하나 → 「${it.title}」`});}}
    else if(r<.93||S.items.length>=6){const sc=addSource(d,R(10,20));sc.role=sasuRole(l,SC);run.lines.push({c:'s',t:`${l.n}: ${sc.name} ${jo2(sc.role,'과','와')} 안면을 텄다.`});}
    else if(r<(S.rank===0?.985:.995)){const it=makeItem(d,{mult:.7*l.k,excl:chance(S.rank===0?.08:.2)});S.items.push(it);run.found++;run.lines.push({c:'g',t:`${l.n}: 단서 → 「${it.title}」`});}
    else{const it=makeItem(d,{mult:1.3,excl:true,pre:1});S.items.push(it);run.found+=2;run.lines.push({c:'g',t:`${l.n}: 큰 건이다! → 「${it.title}」 (단독 가능)`});}
  };
  const report=()=>{
    const body=`<ul class="feed">${run.lines.map(l=>`<li class="${l.c}">${esc(l.t)}</li>`).join('')}</ul><p>${esc(SC.end.replace('{cap}',S.capName))}</p>`;
    const ch=run.found?[
      {label:'확인된 것만 짧고 정확하게',sub:'캡이 좋아하는 보고',fn:()=>{toast(apply({eval:1.5+run.found,trust:.5}));log('라인 보고 — 캡: "그래, 그거 챙겨봐."');}},
      {label:'확인 안 된 첩보까지 몽땅',sub:'크게 칭찬받거나 깨진다',fn:()=>{if(chance(.5)){toast(apply({eval:4}));log('첩보까지 보고 — 캡: "감 좋네."');}else{toast(apply({eval:-3}));log('첩보까지 보고 — 캡: "확인했어? 안 했으면 말을 마."');}}}
    ]:[
      {label:'솔직하게 "물 없습니다"',fn:()=>{toast(apply({eval:-.5}));log('라인 허탕. 캡: "내일은 더 일찍 나가."');}},
      {label:'사소한 건이라도 부풀려 보고',sub:'들키면 크게 깨진다',fn:()=>{if(chance(.55)){toast(apply({eval:1.5}));}else{toast(apply({eval:-5,trust:-2}));log('부풀린 보고를 들켰다. 캡: "기자가 뻥을 쳐?"');}}}
    ];
    openModal('캡에게 보고',body,ch);
  };
  // 동선 한 번에 고르기: 세 곳을 묶은 라인 중 하나를 고르면 한꺼번에 돈다. 두 번째부터는 '평소처럼 돌기'(보고까지 알아서)
  const safeRep=()=>{if(run.found){const t=apply({eval:1.5+run.found,trust:.5});log('라인 보고 — 캡: "그래, 그거 챙겨봐."');return t;}const t=apply({eval:-.5});log('라인 허탕. 캡: "내일은 더 일찍 나가."');return t;};
  const go=(stops,auto)=>{stops.forEach(visit);S.sasuLast=stops.map(l=>l.n);
    if(!auto)return report();const fx=safeRep();
    openModal(`${SC.n} · 평소처럼`,`<ul class="feed">${run.lines.map(l=>`<li class="${l.c}">${esc(l.t)}</li>`).join('')}</ul><p class="hint">${run.found?'확인된 것만 짧게 보고했다.':'"물 없습니다." 솔직하게 보고했다.'}</p>${fxLine(fx)}`);};
  const pool=shuffle(LOCS.slice());const routes=[];for(let i=0;i+3<=pool.length&&routes.length<3;i+=2){const r=pool.slice(i,i+3);if(r.length===3)routes.push(r);}
  const RN=SC.RN;
  const feel=r=>{const k=r.reduce((a,l)=>a+l.k,0);return k>=3.2?'굵직한 사건 가능성↑ · 피곤하다':k<=2.8?'조용하다 · 안면 트기 좋다':'무난한 동선';};
  const last=(S.sasuLast||[]).map(n=>LOCS.find(l=>l.n===n)).filter(Boolean);
  const ch=[];if(last.length===3)ch.push({label:'평소처럼 돌기',sub:`${last.map(l=>l.n).join(' → ')} · 보고까지 알아서 (확인된 것만 짧게)`,rec:true,fn:()=>{go(last,true);return false;}});
  routes.forEach((r,i)=>ch.push({label:`${RN[i]} — ${r.map(l=>l.n.replace(/경찰서 /,'서 ')).join(' → ')}`,sub:feel(r),fn:()=>{go(r,false);return false;}}));
  openModal(`${SC.n} · 오늘 동선`,`<p class="lede">${esc(SC.open.replace('{cap}',S.capName))}</p><p class="hint">세 곳을 한 번에 돈다. 컨디션이 ${S.gear&&S.gear.car?9:15} 정도 깎인다.</p>`,ch);
};
RUN.hari=function(){
  const spots=[{n:'검찰청 포토라인 앞',s:'소환 인물의 한마디',p:.4},{n:'피의자 자택 앞',s:'귀가 장면을 노린다',p:.3},{n:'법원 영장실질심사장',s:'영장 발부 여부',p:.45}];
  openModal('하리꼬미 · 어디서 뻗칠까',`<p>찬바람 속에 몇 시간을 버텨야 한다. 체력이 많이 든다.</p>`,spots.map(s=>({label:s.n,sub:s.s,fn:()=>{
    spend(2,S.gear&&S.gear.car?11:18);gain('sta',.5);gain('inv',.3);
    if(S.rank===0&&S.story!=='rookie'&&chance(s.p+S.st.inv/420+S.st.sta/520)&&!chance(.08)){S.memo=(S.memo||0)+1.5;log(`뻗치기: ${s.n} — 한마디를 땄다`);openModal('뻗치기 — 한마디',`<p class="lede">6시간 만에 나타난 당사자가 한마디를 남겼다. 선배 기사에 한 줄로 들어간다.</p><p class="hint">수습은 직접 기사를 쓰기보다 선배에게 넘길 정보를 모은다. 정보보고 때 평가로 바뀐다.</p>${fxLine(apply({eval:1.2}))}`);}
    else if(chance(s.p+S.st.inv/420+S.st.sta/520)){const it=makeItem(S.dept,{excl:S.rank>0,pre:1,mult:S.rank===0?.7:1.1});S.items.push(it);log(`뻗치기 성공: ${s.n}`);
      openModal('뻗치기 성공',`<p class="lede">6시간 만에 나타난 당사자가 한마디를 남겼다. 아무도 못 들은 말이다.</p><p>아이템 「${esc(it.title)}」 확보 (확인된 사실 1개, 단독 가능)</p>${fxLine(apply({eval:2}))}`);}
    else{log(`뻗치기 허탕: ${s.n}`);openModal('허탕',`<p class="lede">${pick(['새벽 4시. 당사자는 뒷문으로 빠져나갔다는 소식이 들린다.','타사 기자 셋과 나란히 언 발을 굴렀다. 아무도 나오지 않았다.','"오늘 안 나온대." 경비원의 한마디에 철수했다.'])}</p>${fxLine(apply({eval:.5}))}`);}
    return false;}})).concat([{label:'오늘은 접는다',cls:'ghost'}]));
};
RUN.report=function(){spend(1,4);if(S.rank===0){S.rkRep=(S.rkRep||0)+1;const T=OUT().type;if(T==='wire')gain('spd',.8);if(['tv','jp','ch'].includes(T))gain('brd',.9);}const cp=colBy('cap');const mm=Math.min(S.memo||0,8);S.memo=0;if(mm>=2)S.bigRep=(S.bigRep||0)+1;toast(`정보보고 작성${mm?` (메모 ${mm}건 정리)`:''} — ${pick(mm>=4?['캡: "오, 이번 건 쓸 만하다."','캡이 보고서를 위로 올렸다.','"이거 누구 거야?" 데스크가 물었다.']:mm?['캡: "다음엔 더 파 와."','캡이 빨간 펜으로 두 줄 그었다.','"팩트만 써. 형용사 빼고."']:['캡: "이게 다야?"','캡이 말없이 보고서를 넘겼다.',`"${sasuN()}부터 다시 해."`])} · `+apply({eval:R(8,20)/10+mm*.35+(cp&&cp.rel>=30?.6:0),wri:.4,kno:.4+mm*.05}));relUp(cp,1+(mm>=4?1:0));try{rkCoBy(mm);}catch(e){}};
RUN.drink=function(){spend(1,12);setCd('drink');const ln=pick(['캡이 "너 괜찮다"고 했다.',`바이스가 ${sasuN()} 요령을 알려줬다.`,'선배가 자기 첫 단독 이야기를 세 번째 했다.','2차 노래방에서 부장 18번을 같이 불렀다.','형사 출신 선배가 탐문 요령을 풀어 놨다.','"기자는 발로 쓰는 거야." 오늘만 다섯 번 들었다.']);toast(`${pick(['2차까지 달렸다','새벽 1시에 택시를 탔다','막차를 놓쳤다'])} — ${ln} · `+apply({eval:1.5,net:.6,money:-5}));log(`선배들과 소주. ${ln}`);};
// 6.2 컨디션: 매주 저절로 차는 양을 줄여 컨디션 관리가 의미 있게. 대신 휴식은 더 크게 회복한다
function hpWeek(){return (S.simple?8:6)+(S.st.sta||40)/20;}
function restAmt(){return Math.round(30+(S.st.sta||40)/10+(S.simple?5:0));}
RUN.rest=function(){spend(1,0);toast('푹 쉬었다 · '+apply({hp:restAmt()}));};

// --- 발제 ---
RUN.pitch=function(){
  const its=S.items.filter(i=>!i.slot);const bs=colBy('boss');const bn=bs?`${bs.name} ${colRole(bs)}`:`${DEPTS[S.dept].n} 부장`;const tv=isTV();
  const lvl=v0=>{const v=v0-7-(OUT().p-3)*4;return v>=72?'1면감':v>=55?'면 톱감':'단신감';};const impW=n=>n>=70?'매우 큼':n>=50?'큼':n>=30?'보통':'작음';
  const open=pick([`${jo2(bn,'이','가')} 커피를 내려놓고 노트북을 덮었다. "자, ${DEPTS[S.dept].n} 오늘 뭐 있어?"`,`회의실 화이트보드에 오늘 ${tv?'리포트':'지면'} 계획이 반쯤 비어 있다. ${bn}: "빈칸 채울 사람?"`,`${bn}: "어제 타사에 한 방 맞았다. 오늘은 우리가 갖고 있는 거 다 꺼내 봐."`,`아침 ${tv?'보도국':'편집국'} 회의. 데스크들이 한 명씩 돌아가며 발제를 받는다. 이제 내 차례다.`,`${jo2(bn,'이','가')} 어제 지면을 펼쳐 들었다. "1면 톱이 약했다. 오늘은 제대로 된 거 없어?"`,`회의 시작 5분 전. 단톡방에 국장 지시가 떴다: "오늘 1면은 정치 아니면 사회."`,`${bn}: "짧게 가자. 각자 하나씩, 30초 안에."`,`회의실 공기가 무겁다. 어제 오보 정정이 나갔다. ${bn}: "오늘 발제는 확인된 것만."`]);
  openModal(`아침 ${tv?'보도국':'편집'} 회의 · 발제`,`<p class="lede">${open}</p><p>발제할 아이템을 하나 고른다. 데스크가 받아들이면 <b>${tv?'뉴스 순서와':'지면과'} 마감</b>이 정해진다.</p>
   <ul class="tpts" style="font-size:13.5px"><li><b>${tv?'메인뉴스 첫 꼭지':'1면 톱'}</b> — 완성도 보너스가 가장 크다. 다음 달 말까지</li><li><b>면 톱</b> — 보너스 조금. 다음 달 말까지</li><li><b>단신</b> — 보너스 없음. 이번 달 안에</li><li><b>킬</b> — 확인된 게 없거나 약하면 돌려보낸다</li></ul>
   <p class="hint">확인된 사실이 많고, 파급력이 크고, 단독일수록 높은 자리를 받는다. 데스크와 사이가 좋으면 유리하다. 마감을 넘기면 질책을 받는다.</p>`,its.map(it=>{const ok=it.facts.filter(fOK).length,cr=ok/it.facts.length;const guess=it.imp*(.5+cr)+(it.excl?15:0)+S.st.wri/10+(bs?(bs.rel-20)/4:0);
   return{label:it.title,sub:`확인 ${ok}/${it.facts.length} · 파급력 ${impW(it.imp)}${it.excl?' · 단독 (회의에서 소문이 샐 수 있다)':''} · 예상: ${ok===0?'킬 가능성 높음':lvl(guess)}`,fn:()=>{
    setCd('pitch');const o5=OUT();const recentFront=(S.clips||[]).filter(c=>c.turn>S.turn-8&&/1면|첫 꼭지/.test(c.place||'')).length,recentTop=(S.items||[]).filter(x=>x.slot&&x.slot.g!=='brief'&&x!==it).length;
    const rivalry=R(0,14)+(o5.p-3)*4+recentFront*8+recentTop*6+(S.rank===1&&years()<3?5:0);const val=guess+R(-8,8)-rivalry;
    let g,txt;
    if(cr===0&&chance(.6)){g=null;txt=pick([`"아직 확인된 게 하나도 없잖아. 더 파 와." 그대로 돌려받았다.`,`"그건 소문이지 기사가 아니야." ${jo2(bn,'이','가')} 다음 사람을 불렀다.`,`"반론은? 문건은? 아무것도 없네. 더 확인해서 다시 가져와."`]);apply({eval:-.5});}
    else if(val>=72&&(it.excl||it.imp>=55)&&S.turn-(S.frontSlotT??-99)>=12){g='front';txt=pick([`"이거 ${ro2(tv?'메인뉴스 첫 꼭지':'1면 톱')} 간다. 다음 달 말까지 완성해." 회의실이 잠깐 조용해졌다.`,`${jo2(bn,'이','가')} 펜으로 화이트보드 맨 위에 「${esc(it.title)}」${jp(esc(it.title),'을','를')} 적었다. "${tv?'첫 꼭지':'1면'} 비워 둔다. 다음 달 말까지."`,`"좋다. 이건 크게 가자. ${tv?'메인뉴스 톱':'1면'} 잡아 둘 테니 핵심 사실은 두 군데서 확인해 와."`]);}
    else if((val>=52||it.excl&&val>=46)&&S.turn-(S.topSlotT??-99)>=3){g='top';txt=pick([`"면 톱으로 하자. 반론 꼭 받아. 다음 달 말까지."`,`"괜찮네. ${tv?'중간 꼭지':'면 톱'} 정도. 숫자 하나만 더 확인해서 다음 달 안에 내."`,`"방향은 좋은데 아직 1면은 아니다. 면 톱으로 가고, 더 나오면 키우자."`]);}
    else{g='brief';txt=pick([`"단신으로 처리해. 이번 달 안에."`,`"짧게 가자. 이번 달 안에 ${tv?'단신 리포트':'단신'} 한 꼭지."`,`"이건 작다. 단신으로 털고 다음 거 찾아."`]);}
    // 데스크의 여러 반응
    if(g&&chance(.35)){const r=Math.random();
      if(r<.16&&g!=='brief'){g=g==='front'?'top':'brief';txt+=pick([` …그런데 ${pick(['경제부','정치부','사회부','산업부'])}에서도 같은 걸 준비 중이란다. "합쳐서 가든지, 한 단계 낮춰." 결국 ${jo2(SLOT[g].n,'으로','로')} 내려갔다.`,` …옆자리 데스크가 "그거 어제 타사에 비슷한 거 나왔어"라고 했다. ${jo2(SLOT[g].n,'으로','로')} 조정.`]);}
      else if(r<.30&&it.adv){g=g==='front'?'top':g;txt+=` …${jo2(bn,'이','가')} 잠시 머뭇거렸다. "광고국 쪽이랑 얽힌 거네. 표현은 조심해."`;}
      else if(r<.46){it.imp=Math.round(it.imp*1.05);txt+=pick([` "각도를 바꿔 봐. 피해자 쪽에서 시작하면 더 세다."`,` "숫자 말고 사람 얘기로 열어."`,` "제목은 내가 다시 볼게. 팩트만 단단히."`]);}
      else if(r<.58&&g==='front'){apply({eval:.6});txt+=` …회의가 끝나자 국장이 직접 와서 물었다. "그거 누가 쓰는 거야?"`;}
      else if(r<.70){txt+=pick([` 옆자리 선배가 슬쩍 쪽지를 줬다. "그쪽 과장, 오전엔 전화 안 받는다."`,` 회의 끝나고 막내가 "선배, 저 그거 자료 좀 찾아 드릴까요?" 했다.`,` 부장이 덧붙였다. "사진부에 미리 얘기해 둬."`]);}
      else if(r<.82&&g!=='front'){g=null;txt=pick([`"좋은데 지금은 아니다. 다음 주에 다시 가져와." 보류됐다. (평가 감점은 없다)`,`"이번 주는 지면이 꽉 찼다. 묵혀 뒀다가 다음 회의 때." 보류.`]);}
      else{txt+=pick([` 회의실 뒤쪽에서 누군가 "또 그 얘기야?" 하고 중얼거렸다.`,` 데스크가 시계를 봤다. "다음."`,` ${bn}: "마감 넘기면 이거 내가 다른 사람 준다."`]);}}
    (S.slotG=S.slotG||{})[g||'kill']=((S.slotG||{})[g||'kill']||0)+1;if(g==='front')S.frontSlotT=S.turn;if(g==='top')S.topSlotT=S.turn;if(g){it.slot={g,due:S.turn+(g==='brief'?3:7)};S.slotN=(S.slotN||0)+1;apply({eval:g==='front'?1.5:g==='top'?.8:.4});if(it.excl&&chance(.12)){it.heat=Math.max(1,it.heat-2);txt+=' …회의가 끝나고, 타사 기자가 비슷한 걸 묻고 다닌다는 말이 들린다.';}}
    log(`발제: 「${it.title}」 — ${g?{front:tv?'첫 꼭지 배정':'1면 배정',top:'면 톱 배정',brief:'단신 배정'}[g]:'킬'}`);
    openModal('회의 결과',`<p class="lede">${txt}</p>${g?`<p class="hint">「${esc(it.title)}」 · ${SLOT[g].n} · 마감 ${g==='brief'?'이번 달 안':'다음 달 말'}</p>`:''}`);return false;}};}).concat([{label:'오늘은 발제하지 않는다',sub:'듣기만 한다',cls:'ghost'}]));
};
const SLOT={front:{n:'1면 톱',m:1.4},top:{n:'면 톱',m:1.15},brief:{n:'단신',m:.9}};

// --- 브리핑 ---
// 같은 달에 같은 일을 반복하면 효과가 줄어든다 (세 번째부터)
function repK(id){const n=(S.mAct&&S.mAct[id])||0;return n<=2?1:Math.pow(.75,n-2);}
function repHint(id){const n=(S.mAct&&S.mAct[id])||0;return n>=2?`<p class="hint">이번 달 ${n+1}번째 — 같은 일을 반복하면 건질 게 줄어든다.</p>`:'';}
const BEAT_SIT=[
 {t:'정례 브리핑',d:'늘 하던 발표. 새 내용은 많지 않다.',m:{}},
 {t:'해명 브리핑',d:'논란이 터진 뒤 열린 브리핑. 대변인이 긴장했다.',m:{grill:.18,back:-.1}},
 {t:'예산·통계 발표',d:'숫자가 잔뜩 든 자료가 배포됐다.',m:{num:.2,doc:.1}},
 {t:'긴급 브리핑',d:'사고 직후라 정보가 엉켜 있다. 다들 급하다.',m:{back:.12,scene:.15,write:-.1}},
 {t:'인사 발표',d:'누가 어디로 가는지에 다들 관심이 쏠렸다.',m:{one:.15,swap:.1}},
 {t:'정책 발표',d:'장밋빛 계획이 쏟아졌다. 재원은 불분명하다.',m:{grill:.1,num:.12}}];
RUN.beat=function(){gain('int',.2);
  const d=S.dept;const ge=govEntFor(cat1(d));if(S.net&&S.net[ge]&&S.net[ge].block){spend(1,3);toast(`${ENT[ge].n} 기자단 풀에서 빠져 있어 질문권을 받지 못했다`);return;}
  const sit=pick(BEAT_SIT);const M=k=>sit.m[k]||0;const rk=()=>repK('beat');
  const res=(t,b,fx)=>{openModal(t,`<p class="lede">${b}</p>${fxLine(apply(fx))}`);return false;};
  const O={
   grill:{label:'날카로운 추궁 질문',sub:'평판↑ · 상대가 불편해한다 · 상식이 높을수록 좋다',fn:()=>{spend(1,5);if(chance((.32+S.st.kno/200+M('grill'))*rk())){const it=makeItem(d,{excl:chance(.12),pre:1});S.items.push(it);if(ge)netUp(ge,-3);return res('답변이 흔들렸다',`대변인이 말을 더듬었다. 다들 받아쳤지만 맥락은 내가 쥐었다. → 「${esc(it.title)}」`,{fame:1,kno:.5});}return res('회피','"그 부분은 확인해서 알려드리겠습니다." 기자들 사이에 웃음이 번졌다.',{kno:.3});}},
   back:{label:'백브리핑까지 따라간다',sub:'시간이 들지만 맥락을 얻는다',fn:()=>{spend(1,8);if(!chance((.52+M('back'))*glut()*rk())){toast('백브리핑은 원론적인 얘기뿐이었다');apply({kno:.4});return;}const it=makeItem(d,{excl:false,pre:R(1,2),mult:.75});S.items.push(it);let x='';if(chance(.35)){const s2=addSource(d);x=` 복도에서 ${s2.name} ${jo2(s2.role,'과','와')} 명함을 바꿨다.`;}return res('백브리핑',`"이건 익명으로만 써주세요." → 「${esc(it.title)}」${x}`,{kno:.6,net:.4});}},
   write:{label:'조용히 받아쓴다',sub:'무난하다 · 보도자료 기반 아이템',fn:()=>{spend(1,3);apply({kno:.4});if(!chance((.42+M('write'))*glut()*rk())){toast('다 아는 내용이라 기사로 쓸 건 없었다');return;}const it=makeItem(d,{excl:false,pre:2,mult:.6});S.items.push(it);toast(`브리핑 정리 → 「${it.title}」`);}},
   num:{label:'발표 숫자의 근거를 묻는다',sub:'검증력↑ · 숫자가 틀렸다면 기삿거리',fn:()=>{spend(1,4);gain('ver',.4);if(chance((.32+S.st.ver/250+M('num'))*rk())){const it=makeItem(d,{excl:chance(.25),pre:1,mult:.9});S.items.push(it);return res('숫자가 안 맞는다',`배포 자료의 합계가 본문과 달랐다. 담당 과장이 "확인해 보겠다"며 자리를 떴다. → 「${esc(it.title)}」`,{ver:.4});}return res('근거는 있었다','담당자가 산출 근거를 차근차근 설명했다. 기사는 안 되지만 공부는 됐다.',{kno:.4});}},
   doc:{label:'원자료를 따로 요청한다',sub:'정보공개 없이 자료 확보 · 관계가 좋을수록 잘 준다',fn:()=>{spend(1,3);const ok=chance((.35+(S.net&&S.net[ge]?S.net[ge].rel/200:0)+M('doc'))*rk());if(ok){const it=makeItem(d,{pre:2,mult:.8});S.items.push(it);return res('자료를 받았다',`공보실이 엑셀 원본을 보내 줬다. 들여다보니 이상한 칸이 있다. → 「${esc(it.title)}」`,{kno:.3});}return res('"공개 대상이 아닙니다"','공보실은 정중하게 거절했다. 정보공개청구로 가야 할 수도 있다.',{});}},
   swap:{label:'타사 기자들과 정보를 맞춰 본다',sub:'안전하게 정리 · 단독은 기대하기 어렵다',fn:()=>{spend(1,3);gain('net',.3);if(chance(.6*rk())){const it=makeItem(d,{excl:false,pre:2,mult:.65});S.items.push(it);return res('기자실 정리',`각자 받아 적은 걸 맞춰 보니 빈칸이 채워졌다. → 「${esc(it.title)}」`,{net:.3});}return res('다들 입을 닫았다','오늘은 다들 뭔가 쥐고 있는 눈치다. 서로 말을 아꼈다.',{});}},
   one:{label:'대변인에게 따로 면담을 청한다',sub:'기관과 관계↑ · 가끔 귀띔을 듣는다',fn:()=>{spend(1,4);if(ge)netUp(ge,4);if(chance((.25+M('one'))*rk())){const it=makeItem(d,{excl:chance(.4),mult:.85,keyConf:true});S.items.push(it);return res('복도 귀띔',`"기사엔 제 이름 빼 주세요." 짧은 귀띔이었다. → 「${esc(it.title)}」`,{net:.5});}return res('차 한잔','대변인과 차를 마셨다. 오늘은 근황만 오갔지만 얼굴은 익혔다.',{net:.4});}},
   scene:{label:'브리핑장 분위기를 스케치한다',sub:'필력↑ · 기자수첩 거리',fn:()=>{spend(1,3);gain('wri',.4);if(chance((.4+M('scene'))*rk())){const it=makeItem(d,{pre:1,mult:.55});S.items.push(it);return res('현장 스케치',`질문이 막히자 대변인이 시계를 봤다. 그 장면을 메모했다. → 「${esc(it.title)}」`,{wri:.3});}return res('밋밋한 하루','특별할 것 없는 브리핑이었다. 문장 연습은 됐다.',{wri:.2});}}};
  const keys=[pick(['grill','back','write'])].concat(shuffle(Object.keys(O).filter(k=>k!==undefined)).filter(k=>!['grill','back','write'].includes(k)||true)).filter((k,i,a)=>a.indexOf(k)===i).slice(0,3);
  openModal(`${DEPTS[d].brief} · ${sit.t}`,`<p class="lede">${DEPTS[d].beat}. ${sit.d} 질문 기회는 한 번이다.</p>${repHint('beat')}`,keys.map(k=>O[k]));
};
// --- 취재원 ---
function srcFameK(){const mo=Math.floor(S.turn/4);if(!S.srcMo||S.srcMo.m!==mo)S.srcMo={m:mo,n:0};S.srcMo.n++;return S.srcMo.n<=2?1:S.srcMo.n<=4?.35:0;}
function srcDine(s){const mc=catOf(S.dept);
    spend(1,5);const own=chance(.25)?R(3,8):R(0,2);const cost=own;S.money-=cost;const again=s.last>=S.turn-1;s.last=S.turn;
    const g=trMul('srel')*((again?3:8)+S.st.net/12+S.st.cha/30-(s.pers==='strict'?3:0));s.trust=clamp(s.trust+g,0,100);gain('net',.5);
    let body=`<p class="lede">${s.name} ${jo2(s.role,'과','와')} 저녁. ${cost>=3?`취재비 한도를 넘겨 ${cost}만 원은 내 돈으로 냈다.`:cost?`밥값은 법인카드, 커피값 ${cost}만 원만 내 돈.`:'밥값은 법인카드로 처리했다.'}${again?' "또 보네요?" 상대가 조금 귀찮아했다.':''}</p>`;
    const th=s.pers==='careful'?50:38;const tp=((.08+s.trust/560)+(s.pers==='talk'?.06:0))*glut()*repK('source')*(S.turn-(s.tipT??-99)<12?.25:1)*(exRecent(4)?.45:1);
    if(s.trust>=th&&chance(tp)&&S.rank>=4){S.co.q+=1.5;body+=`<p>"이건 아직 아무도 몰라요." 받은 정보를 해당 부서에 넘겼다. 편집국 단독으로 이어질 것이다.</p>`;apply({fame:.8*srcFameK(),eval:.6});}
    else if(s.trust>=th&&chance(tp)){const dd=S.rank>=4?s.d:(mc.includes(s.d)?s.d:S.dept);const it=makeItem(dd,{excl:true,mult:1.15,keyConf:s.trust>=55||s.pers==='strict',hoax:s.pers==='talk'&&chance(.25),src:s.name});S.items.push(it);s.tipT=S.turn;
      body+=`<p>헤어지기 직전 한마디: "이거 아직 아무도 몰라요." → 「${esc(it.title)}」${it.facts.find(f=>f.key).conf?' (핵심 사실 1차 확인)':''}</p>`;log(`취재원 ${s.name}에게서 「${it.title}」 제보`);
      s.debt=(s.debt||0)+1;if(s.pers==='ambit'&&chance(.5))S.flags.favor=s.id;}
    else body+=`<p>${pick(['오늘은 서로 근황만.','회사 욕을 한참 들어줬다.','"요즘 위에서 분위기가 이상해요." 그 이상은 말하지 않았다.','자녀 입시 이야기로 두 시간이 갔다.'])} (신뢰 ${Math.round(s.trust)})</p>`;
    if(S.rank>=4){const k=srcFameK();if(k)apply({fame:.6*k});}
    if(S.net&&chance(.15)){const u=ENTS.filter(e=>e[3]===s.d&&S.net[e[0]]&&!S.net[e[0]].known&&e[2]!=='person');if(u.length){const e0=pick(u);S.net[e0[0]].known=true;body+=`<p class="fx">${s.name} 덕분에 ${e0[1]} 쪽에 연줄이 생겼다.</p>`;}}
    openModal('취재원과 식사',body);return false;}
RUN.source=function(){srcGroup();};
// 여러 취재원을 골라 한 번에 챙긴다: 신뢰는 조금씩, 제보는 한 명한테서만 나올 수 있다
// ===== 7.3 취재원·대외 관계 정렬: 후반에 사람이 많아져도 한눈에 =====
const SRC_SORT={rec:['추천'],trust:['신뢰 높은 순'],low:['신뢰 낮은 순'],old:['오래 못 만난 순'],dept:['분야별'],name:['이름순']};
function srcSorted(L,k){const mc=catOf(S.dept);const fr=s=>(s.fresh??-99)>=S.turn-4;const A=L.slice();
  const f={rec:(a,b)=>fr(b)-fr(a)||mc.includes(b.d)-mc.includes(a.d)||b.trust-a.trust,trust:(a,b)=>b.trust-a.trust,low:(a,b)=>a.trust-b.trust,old:(a,b)=>(a.last??-999)-(b.last??-999)||b.trust-a.trust,
    dept:(a,b)=>(mc.includes(b.d)-mc.includes(a.d))||String(DEPTS[a.d]?DEPTS[a.d].n:'').localeCompare(DEPTS[b.d]?DEPTS[b.d].n:'','ko')||b.trust-a.trust,name:(a,b)=>String(a.name).localeCompare(b.name,'ko')}[k]||null;return f?A.sort(f):A;}
const NET_SORT={rec:['추천'],good:['관계 좋은 순'],bad:['관계 나쁜 순'],kind:['종류별'],ad:['광고 큰 순'],name:['이름순']};
const KIND_ORD={gov:0,corp:1,party:2,person:3};
function netSorted(L,k,idOf){idOf=idOf||(x=>x);const mc=catOf(S.dept);const rel=x=>S.net[idOf(x)]?S.net[idOf(x)].rel:0,E=x=>ENT[idOf(x)]||{};const A=L.slice();
  const f={rec:(a,b)=>(mc.includes(E(b).c)-mc.includes(E(a).c))||Math.abs(rel(b))-Math.abs(rel(a)),good:(a,b)=>rel(b)-rel(a),bad:(a,b)=>rel(a)-rel(b),
    kind:(a,b)=>(KIND_ORD[E(a).kind]??9)-(KIND_ORD[E(b).kind]??9)||rel(b)-rel(a),ad:(a,b)=>(E(b).w||0)-(E(a).w||0)||rel(b)-rel(a),name:(a,b)=>String(entName(idOf(a))).localeCompare(entName(idOf(b)),'ko')}[k]||null;return f?A.sort(f):A;}
function sortChips(map,cur,attr){return `<div class="acat" style="margin:6px 0 8px">${Object.keys(map).map(k=>`<button type="button" class="achip" ${attr}="${k}" aria-pressed="${k===cur}" style="--c:var(--sodium)">${map[k][0]}</button>`).join('')}</div>`;}
// 모달 안 정렬 단추: 고른 사람(곳)은 그대로 두고 순서만 바꿔 다시 연다
function grpSortBind(attr,selAttr,list,reopen,key){setTimeout(()=>{document.querySelectorAll(`#mb [${attr}]`).forEach(b=>b.onclick=e=>{e.preventDefault();window.__grpKeep=[...document.querySelectorAll(`#mb input[${selAttr}]:checked`)].map(x=>list[+x.dataset[selAttr.replace('data-','')]]);S[key]=b.getAttribute(attr);reopen();});
  const K=window.__grpKeep;window.__grpKeep=null;if(K&&K.length)document.querySelectorAll(`#mb input[${selAttr}]`).forEach(x=>{if(K.includes(list[+x.dataset[selAttr.replace('data-','')]])){x.checked=true;x.dispatchEvent(new Event('change'));}});},0);}
function srcGroup(){const mc=catOf(S.dept),MAX=4;const sk=SRC_SORT[S.srcSort]?S.srcSort:'rec';const list=srcSorted(S.sources,sk).slice(0,60);const hi=S.rank>=6&&!S.founder;
  const sel=()=>[...document.querySelectorAll('#mb input[data-sg]:checked')].map(x=>list[+x.dataset.sg]).filter(Boolean);
  const run=(kind)=>()=>{const L=sel();if(!L.length){toast('먼저 사람을 골라 주세요');return false;}if(L.length>MAX){toast(`${MAX}명까지 고를 수 있다`);return false;}
    const dine=kind==='dine';if(dine&&L.length===1)return srcDine(L[0]);const gf=GF[L.length];spend(1,dine?8:2);let cost=0;if(dine){cost=L.reduce(a=>a+(chance(.3)?R(2,5):0),0);S.money-=cost;}
    const out=L.map(s=>{const again=s.last>=S.turn-1;s.last=S.turn;const g=trMul('srel')*gf*(dine?(again?3:8)+S.st.net/12+S.st.cha/30-(s.pers==='strict'?3:0):(again?1:3.5)+S.st.net/30);s.trust=clamp(s.trust+Math.max(.5,g),0,100);return `${s.name} ${s.role} · 신뢰 ${Math.round(s.trust)}`;});
    gain('net',dine?.5:.25);let extra='';
    if(dine){const b=L.slice().sort((x,y)=>y.trust-x.trust)[0];const th=b.pers==='careful'?50:38;const tp=((.16+b.trust/330)+(b.pers==='talk'?.1:0))*glut()*repK('source')*.7;
      if(b.trust>=th&&chance(tp)){if(S.rank>=4){S.co.q+=1;extra=`<p>자리가 파할 무렵 ${b.name} ${jo2(b.role,'이','가')} 따로 불렀다. 받은 정보를 해당 부서에 넘겼다.</p>`;apply({fame:.5*srcFameK(),eval:.4});}
        else{const dd=mc.includes(b.d)?b.d:S.dept;const it=makeItem(dd,{excl:true,mult:1.1,keyConf:b.trust>=60,hoax:b.pers==='talk'&&chance(.25),src:b.name});S.items.push(it);extra=`<p>자리가 파할 무렵 ${b.name} ${jo2(b.role,'이','가')} 따로 불렀다. "아까는 말 못 했는데…" → 「${esc(it.title)}」</p>`;log(`취재원 ${b.name}에게서 「${it.title}」 제보`);}}}
    openModal(dine?'합동 저녁':'안부 연락',`<p class="lede">${dine?`${jo2(L.map(s=>s.name).join('·'),'과','와')} 한자리에 모였다. ${cost?`취재비 한도를 넘겨 ${cost}만 원은 내 돈으로 냈다.`:'밥값은 법인카드로 처리했다.'} 여럿이 있으니 깊은 얘기는 덜 나왔다.`:'명절 인사 겸 안부 문자와 전화를 돌렸다.'}</p><ul class="feed">${out.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${extra}`);return false;};
  openModal(hi?'고위층 인맥 관리':'취재원 만나기',`<p>만날 사람을 1~${MAX}명 고른다. 한 명이면 깊은 얘기가 오가고, 여럿이면 한 사람당 신뢰는 덜 오르지만 합치면 더 크다. 단독 제보는 가장 가까운 사람에게서 나온다.</p>${S.sources.length?(S.sources.length>4?sortChips(SRC_SORT,sk,'data-ss'):''):'<p class="hint">아직 취재원이 없다. 새로 뚫어 보자.</p>'}<p class="pcount" id="gsel"></p>${list.map((s,i)=>`<label class="chk"><input type="checkbox" data-sg="${i}"><span><b>${esc(s.name)}</b> · ${esc(s.role)}${(s.fresh??-99)>=S.turn-4?' <span class="tg new">NEW</span>':''}<small>${DEPTS[s.d].n} · 신뢰 ${Math.round(s.trust)} · ${PERS[s.pers].n}${s.last>=S.turn-1?' · 최근에 만났다':s.last!=null&&S.turn-s.last>=24?` · ${Math.floor((S.turn-s.last)/4)}달째 연락 없음`:''}</small></span></label>`).join('')}`,[
   {label:'저녁 자리',sub:'체력↓ · 신뢰↑ · 단독 제보 가능 (한 명이면 1:1 식사)',fn:run('dine')},
   {label:'안부 연락 돌리기',sub:'체력 조금 · 신뢰 조금↑',fn:run('call')},
   {label:'새 취재원 뚫기',sub:`${S.rank>=4?'고위급':DEPTS[S.dept].n} 인맥을 새로 만든다`,fn:()=>{spend(1,5);S.money-=3;
    if(chance(.45+S.st.net/160)){const s=addSource(S.rank>=4?pick(Object.keys(DEPTS)):S.dept,R(10,22));gain('net',.6);openModal('명함 교환',`<p class="lede">${s.name} ${jo2(s.role,'과','와')} 첫 식사. 성격은 ${PERS[s.pers].n} — ${PERS[s.pers].d}.</p>`);log(`새 취재원 ${s.name}(${s.role})`);}
    else{gain('net',.2);openModal('어색한 저녁',`<p class="lede">${pick(['상대는 시계만 봤다. 명함만 남았다.','"기자랑은 밥 안 먹어요." 문전박대.','약속 30분 전에 취소 문자가 왔다.'])}</p>`);}return false;}},
   {label:'취소',cls:'ghost'}]);grpBind('data-sg',MAX,'명');grpSortBind('data-ss','data-sg',list,srcGroup,'srcSort');}
// --- 발굴 ---
RUN.discover=function(){
  const d=S.dept;
  openModal('아이템 발굴 · 어디서 찾을까',`<p>${DEPTS[d].n} 담당: ${DEPTS[d].lede}</p>`,[
    {label:'보도자료·공시 뒤지기',sub:'안전하고 확인도 쉽지만 타사도 다 안다',fn:()=>{spend(1,3);gain('kno',.4);if(!chance(.6*glut())){toast('보도자료 수십 건, 기사가 될 만한 건 없었다');return;}const it=makeItem(d,{excl:false,pre:2,mult:.6});S.items.push(it);itemFound(it,'보도자료를 뒤지다 걸렸다');}},
    {label:'온라인 커뮤니티·SNS 훑기',sub:'단독 가능성은 높지만 허위 제보가 섞여 있다',fn:()=>{spend(1,3);gain('inv',.2);if(!chance((.36+S.st.inv/500)*glut())){toast('글은 많은데 쓸 만한 건 없었다');return;}const it=makeItem(d,{excl:chance(.22),hoax:chance(.3)});S.items.push(it);itemFound(it,'커뮤니티 글 하나가 눈에 걸렸다');}},
    {label:'현장 발로 뛰기',sub:'체력이 들지만 질 좋은 아이템',fn:()=>{spend(1,12);gain('inv',.5);gain('sta',.2);if(!chance((.36+S.st.inv/300)*glut())){toast('발품만 팔았다. 내일 다시 나가 보자');return;}const it=makeItem(d,{excl:chance(.2),pre:1,mult:1.05});S.items.push(it);itemFound(it,'현장을 돌다 냄새를 맡았다');}},
    {label:'공공 데이터 파고들기',sub:'상식이 높을수록 성공. 데이터 사실 하나를 먼저 확인',fn:()=>{spend(1,4);if(chance((.22+S.st.kno/200)*glut())){const it=makeItem(d,{excl:chance(.5),mult:1});const n=it.facts.find(f=>f.k==='n');if(n){fFill(n,'데이터');}S.items.push(it);gain('kno',.6);itemFound(it,'공공 데이터에서 이상치를 찾았다');}else{gain('kno',.3);toast('엑셀만 세 시간. 아무것도 안 나왔다.');}}},
    {label:'취소',cls:'ghost'}]);
};

// --- 취재 세션 ---
RUN.invest=function(){
  if(S.items.length===1){const it=S.items[0];toast(`${freeInv()?'이번 달 첫 취재는 행동력 0 · ':''}「${it.title}」 취재`);return coordThen(it,()=>session(it));}
  openModal('어떤 아이템을 취재할까',`${freeInv()?'<p class="fx"><b>이번 달 첫 취재는 행동력 0</b> — 출입처 정기 취재로 처리된다.</p>':''}<p>취재 한 번에 시간 ${3+(S.st.sta>=60?1:0)+(S.rank>=2?1:0)+(S.rank>=4?1:0)}칸(직급이 오를수록 요령이 늘어 칸이 는다). S·A급 아이템은 확인이 더 어렵고 상대가 빨리 눈치채며, S급은 핵심 사실을 세 경로로 확인해야 한다. 핵심 사실은 서로 다른 두 출처로 교차 확인해야 한다. 단독의 추격 시한은 월말 결산 때만 줄어든다 — 이번 달 안에는 행동을 얼마나 쓰든 그대로다.</p>`,(()=>{const __ab=aiBest(S.items,'invest');return S.items.map(it=>({rec:it===__ab,label:`[${gradeOf(it)}] ${it.title}`,sub:`${DEPTS[it.d].n}${itEntTxt(it)} · 확인 ${it.facts.filter(fOK).length}/${it.facts.length}${it.excl?` · 단독 · 타사 추격까지 ${heatTxt(it.heat)}`:''}${it.slot?` · ${SLOT[it.slot.g].n} 마감 ${heatTxt(it.slot.due-S.turn+1)}`:''}`,fn:()=>{coordThen(it,()=>session(it));return false;}}));})().concat([{label:'취소',cls:'ghost'}]));
};
function target(it,m){const un=it.facts.filter(f=>!fOK(f));if(!un.length)return null;const M=METH[m];const mt=un.filter(f=>M.k.includes(f.k));const pool=mt.length?mt:un;return pool.find(f=>f.key)||pool[0];}
function mChance(it,m,f){
  const M=METH[m];const src=bestSrc(it.d);let p=.32+M.st()/200+src/300+clamp((50-it.imp)/250,-.1,.12);
  if(!M.k.includes(f.k))p*=.35;
  p*=({S:.82,A:.9,B:1,C:1.08}[gradeOf(it)]||1);
  if(it.alert>=60&&['docs','ask','call'].includes(m))p*=.65;
  const er=netRel(it.ent);if(['call','docs','ask'].includes(m))p+=clamp(er,-40,60)/320;if(m==='docs'&&S.net&&S.net[it.ent]&&S.net[it.ent].block)p*=.35;if(m==='data'&&hasF('data'))p+=.08;if(m==='scene'&&S.gear&&S.gear.camera)p+=.1;if(['call','ask'].includes(m)&&S.gear&&S.gear.rec)p+=.04;if(m==='data'&&S.gear&&S.gear.tablet)p+=.05;
  if(M.dept)p+=.06;p+=(medInv().meth||{})[m]||0;if(it.gag&&['call','docs'].includes(m))p*=.85;p+=it.nb||0;
  if(f.key&&f.via.includes(M.n))p*=.55;
  p*=DF().ver;if(it.hoax)p=.03;return clamp(p,.03,.93);
}
// ===================== 6.2 취재 개편: 단서 사슬 · 다른 길 · 상대의 반격 · 부서 기법 =====================
// 부서마다 그 부서 기자만 쓰는 취재 기법이 하나씩 있다
const DEPT_METH={court:'record',case:'night',soc:'night',nat:'night',inv:'stake',pol:'hall',city:'hall',diplo:'wire',int:'wire',eco:'filing',ind:'filing',fin:'filing',stock:'filing',estate:'filing',it:'filing',med:'insider',edu:'insider',cul:'agency',culspo:'agency',ent:'agency',spo:'locker',base:'locker',foot:'locker',sigun:'native',loc:'native'};
Object.assign(METH,{
 record:{n:'공소장·판결문 열람',t:1,k:['d','n'],st:()=>S.st.ver*.5+S.st.kno*.5,al:1,d:'법조 기자의 무기. 재판 기록은 거짓말을 안 한다',dept:1},
 night:{n:'형사과 야간 취재',t:1,k:['w','d'],st:()=>S.st.net*.5+S.st.sta*.3+S.st.inv*.2,al:4,d:'밤 11시 형사과. 당직 형사가 입을 연다',dept:1,hp:3},
 stake:{n:'장기 잠복·추적',t:2,k:['s','d'],st:()=>S.st.inv*.6+S.st.sta*.4,al:-2,d:'며칠을 붙어 있는다. 상대는 모른다',dept:1,hp:8},
 hall:{n:'국회 복도 뻗치기',t:1,k:['w'],st:()=>S.st.net*.4+S.st.cha*.3+S.st.int*.3,al:5,d:'회의장 앞에서 기다렸다가 붙잡는다',dept:1},
 wire:{n:'외교가·현지 통신원',t:1,k:['w','d'],st:()=>(S.st.lng||40)*.5+S.st.net*.5,al:2,d:'대사관 인맥과 현지 통신원에게 묻는다',dept:1},
 filing:{n:'공시·등기부 대조',t:1,k:['n','d'],st:()=>S.st.dat*.6+S.st.kno*.4,al:0,d:'공시·등기부·감사보고서를 맞춰 본다',dept:1},
 insider:{n:'현직자 단체방',t:1,k:['w'],st:()=>S.st.net*.5+S.st.cha*.25+S.st.int*.25,al:3,d:'의사·교사 현직자 단체방에서 증언을 모은다',dept:1},
 agency:{n:'업계 관계자 술자리',t:1,k:['w'],st:()=>S.st.net*.5+S.st.cha*.5,al:3,d:'소속사·제작사 사람들의 뒷이야기',dept:1,money:3},
 locker:{n:'라커룸·에이전트',t:1,k:['w','s'],st:()=>S.st.net*.5+S.st.spd*.5,al:4,d:'경기 뒤 믹스트존과 에이전트 전화',dept:1},
 native:{n:'토박이 인맥',t:1,k:['w','s'],st:()=>S.st.net*.4+S.st.cha*.6,al:2,d:'이장님, 다방 사장님, 동창회장',dept:1}
});
Object.assign(SUCC,{record:'재판 기록에서 확인:',night:'당직 형사에게서 확인:',stake:'잠복 끝에 포착:',hall:'복도에서 붙잡아 확인:',wire:'현지 취재로 확인:',filing:'공시 대조로 확인:',insider:'현직자 증언 확보:',agency:'업계 관계자에게서 확인:',locker:'라커룸에서 확인:',native:'토박이에게서 확인:'});
Object.assign(FAILS,{record:['열람 신청이 반려됐다. 비공개 재판이다.','기록 어디에도 그 이름은 없다.'],night:['"오늘은 안 돼. 위에서 입단속 들어왔어."','당직 형사가 바뀌었다. 처음 보는 얼굴이다.'],stake:['사흘을 기다렸지만 아무도 나타나지 않았다.','들킨 것 같다. 차가 갑자기 방향을 틀었다.'],hall:['의원은 다른 문으로 빠져나갔다.','"기자님, 지금은 말 못 해요." 엘리베이터 문이 닫혔다.'],wire:['통신원이 연락이 닿지 않는다. 현지는 휴일이다.','대사관은 "확인해 줄 수 없다"는 말만 반복했다.'],filing:['공시에는 깨끗하게 정리돼 있다.','등기부상 대표가 이미 바뀌어 있었다.'],insider:['단체방이 조용하다. 누가 캡처를 돌렸다는 소문이 돌았다.','"이거 말하면 저 바로 찍혀요."'],agency:['술만 마시고 들은 건 소문뿐이다.','"그 얘기는 우리 바닥에서 금기예요."'],locker:['믹스트존에서 선수가 고개만 숙이고 지나갔다.','에이전트가 "노코멘트"를 세 번 말했다.'],native:['"외지 기자한테 할 말 없어."','이장님은 그날 읍내에 나가 계셨다.']});
// 단서: 확인한 사실이 다음 길을 연다
const LEAD_T={
 d:[['결재란에 찍힌 이름','결재자를 직접 찾아간다',['w','s'],'결재 문서'],['문건 속 회의록 날짜','그날 참석자를 찾는다',['w'],'회의록'],['첨부된 계약서 번호','계약 당사자를 추적한다',['n','d'],'계약서']],
 w:[['"그날 밤 트럭이 들어왔다"는 말','근처 CCTV를 찾아본다',['s','d'],'목격 증언'],['"나 말고 본 사람이 또 있다"','다른 목격자를 찾아간다',['w'],'첫 증언'],['증언 속 "윗선"이라는 말','윗선을 거슬러 올라간다',['d','w'],'내부 증언']],
 n:[['돈이 흘러간 업체 이름','그 업체의 등기부를 뗀다',['d','n'],'자금 흐름표'],['해마다 튀는 숫자 하나','그해 담당자를 찾는다',['w'],'통계 이상치']],
 s:[['현장에서 마주친 전직 직원','그 사람과 따로 만난다',['w'],'현장 사진'],['현장에 버려진 서류 더미','서류를 주워 대조한다',['d'],'현장 증거']]
};
function leadMake(it,f){if(!f||!LEAD_T[f.k])return null;it.leads=it.leads||[];if(it.leads.length>=2)return null;if(!chance(.36+(f.key?.14:0)))return null;
  const L=pick(LEAD_T[f.k]);if(it.leads.some(x=>x.t===L[0]))return null;const o={id:uid(),t:L[0],act:L[1],k:L[2],ev:L[3]};it.leads.push(o);return o;}
function leadTarget(it,L){const un=it.facts.filter(f=>!fOK(f));if(!un.length)return null;const m=un.filter(f=>L.k.includes(f.k));const pool=m.length?m:un;return pool.find(f=>f.key)||pool[0];}
function leadChance(it){return clamp(.44+S.st.inv/400+({S:-.1,A:-.05,C:.05}[gradeOf(it)]||0)+(it.gag?-.08:0),.25,.9)*(DF().ver||1);}
// 상대의 반격: 경계가 높아지면 상대도 움직인다
const CTR={
 wipe:{n:'증거 인멸 조짐',d:it=>`${esc(it.subj)} 쪽에서 서류를 파쇄하고 하드디스크를 바꿨다는 말이 들린다.`,o:[
   {l:'먼저 손쓴다 — 증거부터 확보',s:'시간 1칸 · 성공하면 피해 없음',need:1,fn:(it,T,f)=>{T.left-=1;if(chance(.55+S.st.inv/400)){T.lines.push({c:'g',t:'한발 앞서 사본을 확보했다. 인멸 전에 막았다.'});return;}if(f){f.need=Math.min(3,f.need+1);T.lines.push({c:'r',t:`늦었다. 「${f.t}」 확인이 더 어려워졌다.`});}}},
   {l:'그대로 취재를 이어 간다',s:'확인이 한 단계 어려워진다',fn:(it,T,f)=>{if(f){f.need=Math.min(3,f.need+1);T.lines.push({c:'r',t:`증거가 사라졌다. 「${f.t}」${jp(f.t,'을','를')} 다른 경로로 한 번 더 확인해야 한다.`});}}}]},
 pr:{n:'선제 해명 보도자료',d:it=>`${jo2(esc(it.subj),'이','가')} 기사도 나오기 전에 "일부 언론의 의혹 제기는 사실과 다르다"는 해명 보도자료를 뿌렸다.`,o:[
   {l:'해명의 허점을 판다',s:'경계↑ · 기사 완성도↑',fn:(it,T)=>{it.alert=clamp(it.alert+5,0,100);it.prR=1;T.lines.push({c:'g',t:'해명 자료에서 앞뒤가 안 맞는 대목을 찾았다. 기사에 쓸 수 있다.'});}},
   {l:'서둘러 쓰기로 한다',s:'타사 추격이 빨라지지만 파급력은 지킨다',fn:(it,T)=>{it.heat=Math.max(1,(it.heat||3)-1);T.lines.push({c:'s',t:'해명이 먼저 나가 타사도 냄새를 맡았다. 서둘러야 한다.'});}},
   {l:'무시한다',s:'파급력↓',fn:(it,T)=>{it.imp=Math.max(10,Math.round(it.imp*.9));T.lines.push({c:'r',t:'해명이 먼저 퍼져 기사의 힘이 빠졌다.'});}}]},
 law:{n:'변호사 내용증명',d:it=>`${esc(sbjN(it.subj))} 측 법무법인에서 "보도 시 민형사상 책임을 묻겠다"는 내용증명이 왔다.`,o:[
   {l:'법무팀 검토를 받는다',s:'소송 위험↓ · 시간 1칸',need:1,fn:(it,T)=>{T.left-=1;it.lawyer=.4;T.lines.push({c:'g',t:'법무팀이 문제 될 표현을 미리 짚어 줬다.'});}},
   {l:'반론을 꼭 받아 두기로 한다',s:'반론을 받으면 소송 위험이 사라진다',fn:(it,T)=>{it.lawyer=1;T.lines.push({c:'s',t:'반론 없이 쓰면 소송이 걸릴 수 있다.'});}}]},
 gag:{n:'취재원 입막음',d:it=>`${esc(it.subj)} 쪽이 내부 직원들에게 "외부 접촉 금지" 공지를 돌렸다. 내 취재원이 겁을 먹었다.`,o:[
   {l:'취재원을 찾아가 안심시킨다',s:'시간 1칸 · 취재원 신뢰 유지',need:1,fn:(it,T)=>{T.left-=1;const s=srcOf(it.d);if(s)s.trust=clamp(s.trust+4,0,100);T.lines.push({c:'g',t:'"기자님 믿을게요." 취재원이 다시 마음을 열었다.'});}},
   {l:'새 취재원을 찾는다',s:'운이 좋으면 새 취재원 · 기존 취재원은 멀어진다',fn:(it,T)=>{it.gag=1;const s=srcOf(it.d);if(s)s.trust=clamp(s.trust-10,0,100);if(chance(.45)){const n=addSource(it.d,R(15,30));T.lines.push({c:'g',t:`새 취재원을 뚫었다: ${n.name} ${n.role}`});}else T.lines.push({c:'r',t:'새 사람도 입을 닫았다.'});}},
   {l:'그냥 둔다',s:'전화·문건 확인이 어려워진다',fn:(it,T)=>{it.gag=1;const s=srcOf(it.d);if(s)s.trust=clamp(s.trust-12,0,100);T.lines.push({c:'r',t:'취재원이 전화를 받지 않는다.'});}}]}
};
function ctrPick(it){const L=[];if(it.facts.some(f=>!fOK(f)&&(f.k==='d'||f.k==='s')))L.push('wipe');L.push('pr');if(!it.lawyer)L.push('law');if(!it.gag&&(S.sources||[]).some(s=>s.d===it.d))L.push('gag');return pick(L);}
function ctrShow(it,T,k,back){const C=CTR[k];const f=it.facts.find(x=>!fOK(x)&&(x.k==='d'||x.k==='s'))||it.facts.find(x=>!fOK(x));
  if(T.auto){C.o[C.o.length-1].fn(it,T,f);return back();}
  openModal(`상대의 반격 · ${C.n}`,`<p class="lede">${C.d(it)}</p><p class="hint">「${esc(it.title)}」 · 상대 경계 ${Math.round(it.alert)}</p>`,C.o.map(o=>({label:o.l,sub:o.s,disabled:!!o.need&&T.left<1,fn:()=>{o.fn(it,T,f);back();return false;}})));}
// 실패해도 길은 있다
const RETRY={
 call:[['집 앞에서 기다린다 (뻗치기)','시간 1칸 · 컨디션↓ · 취재력이 높을수록 잘 된다',1,(it,T,f)=>{S.hp=clamp(S.hp-6,0,100);return chance(.4+S.st.inv/300)?'밤 11시, 퇴근하던 그가 결국 입을 열었다':null;},'뻗치기'],['문자로 질문을 남긴다','다음 확인이 쉬워진다',0,(it)=>{it.nb=(it.nb||0)+.12;return '';}]],
 scene:[['밤에 다시 온다','시간 1칸 · 컨디션↓',1,(it,T,f)=>{S.hp=clamp(S.hp-6,0,100);return chance(.42+S.st.sta/300)?'인적 없는 밤, 셔터를 올리는 순간을 찍었다':null;},'야간 현장'],['근처 가게 CCTV를 부탁한다','운이 좋으면 새 단서',0,(it,T,f)=>{if(chance(.4)){it.leads=it.leads||[];if(it.leads.length<3)it.leads.push({id:uid(),t:'근처 편의점 CCTV 영상',act:'영상 속 차량 번호를 추적한다',k:['s','d'],ev:'CCTV 영상'});return '편의점 사장님이 영상을 보여 줬다. 새 단서가 생겼다.';}return '"경찰 아니면 못 보여 줘요."';}]],
 ask:[['다른 사람을 소개받는다','새 취재원이나 단서가 생길 수 있다',0,(it)=>{if(chance(.45)){const s=addSource(it.d,R(12,25));return `"저 말고 ${s.role} 쪽에 물어봐요." 새 취재원: ${s.name}`;}return '소개받은 사람도 고개를 저었다.';}],['한 번 더 찾아간다','시간 1칸 · 진심이 통할 수도',1,(it)=>chance(.38+S.st.cha/300)?'세 번째 찾아가자 결국 문을 열어 줬다':null,'재방문']],
 docs:[['정보공개청구로 돌린다','시간 없이 청구 · 한 달 안팎 뒤 결과',0,(it)=>{if(S.pending.some(p=>p.type==='foi'&&p.item===it.id))return '이미 청구 중이다.';S.pending.push({type:'foi',item:it.id,due:S.turn+R(2,4)});return '정보공개청구서를 냈다.';}],['다른 부서 사람을 통해 구한다','시간 1칸',1,(it)=>chance(.36+S.st.net/300)?'옆 부서 직원이 조용히 파일을 건넸다':null,'우회 입수']],
 data:[['기준을 맞춰 다시 계산한다','시간 1칸 · 데이터 능력에 달렸다',1,(it)=>chance(.4+S.st.dat/250)?'기준 연도를 맞추자 숫자가 맞아떨어졌다':null,'재분석']]
};
function retryShow(m,it,T,f,back){const L=RETRY[m]||[['한 번 더 파고든다','시간 1칸',1,(it)=>chance(.4+S.st.inv/300)?'끈질기게 파고든 끝에 확인했다':null,'재취재']];
  openModal('다른 길',`<p class="lede">「${esc(f.t)}」 확인이 막혔다. 다른 길이 있을까.</p><p class="hint">남은 시간 ${T.left}칸</p>`,L.map(([l,s,cost,fn,via])=>({label:l,sub:s,disabled:cost>T.left,fn:()=>{T.left-=cost;const r=fn(it,T,f);if(r===null)T.lines.push({c:'r',t:`${f.t} — 이번에도 실패했다.`});else if(via){f.conf++;f.via.push(via);T.lines.push({c:'g',t:`${r}: ${f.t}`});leadMake(it,f);}else if(r)T.lines.push({c:'s',t:r});back();return false;}})).concat([{label:'접는다',cls:'ghost',fn:()=>{back();return false;}}]));}
// 인터뷰 심리전: 경계심(입을 닫는 정도)과 동요(흔들리는 정도). 증거는 꺼내는 타이밍이 중요하다
function ivCards(it){const C=[];it.facts.filter(f=>fOK(f)&&f.k!=='w').slice(0,3).forEach(f=>C.push({id:'f'+it.facts.indexOf(f),n:`[${FK[f.k]}] ${f.t}`,key:f.key}));(it.leads||[]).filter(l=>l.ev).slice(0,2).forEach(l=>C.push({id:'l'+l.id,n:`[단서] ${l.ev}`,key:false}));return C.filter(c=>!(it.usedEv||[]).includes(c.id));}
function interview(it,T,back){
  it.interviewed=1;const tape0=!!it.tape;const recB=S.gear&&S.gear.rec?.08:0;const nOK=it.facts.filter(fOK).length;
  const I={g:clamp(45+it.alert*.35-netRel(it.ent)/6+R(-10,10)-(S.gear&&S.gear.suit?6:0),10,95),s:clamp(12+nOK*7+R(-5,5),5,60),r:0,max:3,lines:[]};
  const slip=()=>{const tg=it.facts.find(f=>f.key&&!fOK(f))||it.facts.find(f=>f.k==='w'&&!fOK(f))||it.facts.find(f=>!fOK(f));if(tg){tg.conf++;tg.via.push('당사자 발언');}const q=pick(IVL.slip);it.tape=1;if(!it.quote)it.quote=q.replace(/^"|"$/g,'');ach('tape');I.lines.push({c:'g',t:q});return tg;};
  const end=(why)=>{T.lines.push({c:'q',t:`인터뷰 종료 — ${why}`});if(it.tape&&!tape0)T.lines.push({c:'g',t:`녹취 확보: "${it.quote||'결정적 발언'}"`});else if(!it.tape)T.lines.push({c:'r',t:'녹취 확보 실패 — 결정적인 한마디는 끌어내지 못했다'});it.alert=clamp(it.alert+10,0,100);back();};
  const meter=(n,v,c)=>`<div class="meter"><span>${n}</span><div class="bar"><i style="width:${v}%;--c:${c}"></i></div><span class="num">${Math.round(v)}</span></div>`;
  const step=()=>{
    if(I.r>=I.max){if(I.max===3&&I.s>=65){I.max=4;I.lines.push({c:'s',t:'상대의 손이 떨린다. 질문 하나를 더 던질 수 있을 것 같다.'});}else return end('질문을 다 했다');}
    const cards=ivCards(it);
    const body=`<p class="lede">${esc(it.subj)} 관계자와 마주 앉았다. ${I.r===0?'녹음기를 켰다.':''}</p>${meter('경계심',I.g,'var(--red)')}${meter('동요',I.s,'var(--siren)')}<ul class="feed">${I.lines.map(l=>`<li class="${l.c}">${esc(l.t)}</li>`).join('')}</ul><p class="hint">질문 ${I.r+1}/${I.max} · 경계심이 높을 때 증거를 먼저 꺼내면 입을 닫는다. 동요가 클수록 증거가 잘 먹힌다.</p>`;
    const go=(k,fn)=>()=>{I.r++;if(k)I.lines.push({c:'',t:'나: '+IVL.q[k]});fn();return false;};
    const C=[
      {label:'부드럽게 라포 쌓기',sub:'경계심↓ · 동요도 조금↓',fn:go('soft',()=>{I.g=clamp(I.g-(12+S.st.cha/10),0,100);I.s=clamp(I.s-4,0,100);gain('int',.15);I.lines.push({c:'q',t:pick(IVL.soften)});if(chance(.08))slip();step();})},
      {label:'모르는 척 떠보기',sub:'동요↑ · 취재력이 높을수록 잘 걸린다',fn:go('probe',()=>{if(chance(.12+recB+S.st.int/280+(50-I.g)/260+I.s/400))slip();else I.lines.push({c:'r',t:pick(IVL.deny)});I.g=clamp(I.g+8,0,100);I.s=clamp(I.s+9,0,100);step();})},
      {label:'침묵하며 기다리기',sub:'경계가 낮으면 상대가 침묵을 못 견딘다',fn:go('silence',()=>{if(I.g<50&&chance(.22+I.s/300))slip();else I.lines.push({c:'q',t:'"..."'});I.g=clamp(I.g-4,0,100);I.s=clamp(I.s+6,0,100);step();})}];
    cards.forEach(cd=>C.push({label:`증거 내밀기 — ${cd.n}`,sub:I.r===0&&I.g>55?'지금 꺼내면 너무 이르다':`성공 ${pct(clamp(.3+I.s/200+(60-I.g)/250+recB+(cd.key?.1:0),.05,.9))}`,risk:I.r===0&&I.g>55,fn:go('press',()=>{(it.usedEv=it.usedEv||[]).push(cd.id);
      if(I.r===1&&I.g>55){I.g=clamp(I.g+20,0,100);I.s=clamp(I.s+5,0,100);I.lines.push({c:'r',t:'너무 일찍 패를 깠다. 상대가 자세를 고쳐 앉는다.'});if(chance(.4)){I.lines.push({c:'r',t:pick(IVL.hang)});return end('상대가 자리를 박차고 나갔다');}return step();}
      if(chance(clamp(.3+I.s/200+(60-I.g)/250+recB+(cd.key?.1:0),.05,.9))){const f=slip();if(f)I.lines.push({c:'g',t:'녹취로 확인: '+f.t});I.s=clamp(I.s+15,0,100);I.g=clamp(I.g+6,0,100);}
      else{I.lines.push({c:'r',t:pick(IVL.deny)});I.s=clamp(I.s+10,0,100);I.g=clamp(I.g+8,0,100);}step();})}));
    if(!cards.length)C.push({label:'증거 없이 몰아붙이기',sub:'증거가 없으면 끊길 수 있다',risk:true,fn:go('press',()=>{I.g=clamp(I.g+25,0,100);I.s=clamp(I.s+5,0,100);I.lines.push({c:'r',t:pick(IVL.deny)});if(I.g>78&&chance(.5)){I.lines.push({c:'r',t:pick(IVL.hang)});return end('상대가 일어났다');}step();})});
    C.push({label:'반론 기회를 주고 마무리',sub:'반론을 확보하고 끝낸다',fn:go('rebut',()=>{it.rebut=I.g<85?'got':'no';I.lines.push({c:'q',t:pick(it.rebut==='got'?IVL.rebutGot:IVL.rebutNo)});end('반론을 듣고 일어났다');})});
    openModal('당사자 인터뷰',body,C);
  };
  step();
}

// 취재 수첩: 확보한 녹취·증언·현장 사진은 기사와 지면에 그대로 쓰인다
function invNote(it,f,m){if(f.k==='s'&&!it.photo)it.photo=f.t;if(f.k==='w'&&!it.wq){const mm=/(.{0,14}?)\s*"([^"]{4,40})"/.exec(f.t);if(mm)it.wq={who:mm[1].trim()||'관계자',q:mm[2]};}}
function invNotebook(it){const L=[];if(it.quote)L.push(`<li><b>녹취</b> "${esc(it.quote)}"</li>`);if(it.wq)L.push(`<li><b>증언</b> ${esc(it.wq.who)} "${esc(it.wq.q)}"</li>`);if(it.photo)L.push(`<li><b>현장 사진</b> ${esc(it.photo)}</li>`);(it.leads||[]).forEach(l=>L.push(`<li><b>남은 단서</b> ${esc(l.t)} → ${esc(l.act)}</li>`));return L.length?`<div class="invnb"><div class="t">취재 수첩</div><ul>${L.join('')}</ul></div>`:'';}
function clipQuote(c){return c.quote?`<p class="cq">“${esc(c.quote)}” <small>— ${esc(c.qsrc||'녹취')}</small></p>`:'';}
function factList(it){return `<ul class="facts">${it.facts.map(f=>`<li class="${fOK(f)?'v':f.conf?'h':''}">${esc(f.t)} <small>[${FK[f.k]}${f.key?' · 핵심':''}] ${f.conf}/${f.need}${f.via.length?' · '+f.via.join(', '):''}</small></li>`).join('')}</ul>`;}
function session(it){
  const fiv=freeInv()&&S._curAct==='invest';if(fiv)S.freeInvM=Math.floor(S.turn/4);
  const rkB=S.founder?1+(S.turn-(S.fStart||0)>=YW*3?1:0):(S.rank>=2?1:0)+(S.rank>=4?1:0);const gr0=gradeOf(it);if(gr0==='S'&&!S.simple)it.facts.forEach(f=>{if(f.key&&f.need<3)f.need=3;});
  const grB=({S:2,A:1}[gr0]||0)+(medInv().slot||0);const T={left:Math.max(2,3+(S.st.sta>=60?1:0)+rkB+grB),max:Math.max(2,3+(S.st.sta>=60?1:0)+rkB+grB),lines:[]};
  spend(fiv?0:1,6);gain('inv',.3);S.scene='field';if(fiv)toast('출입처 정기 취재 — 이번 달 첫 취재는 행동력이 들지 않는다');
  const alertUp=v=>{const b=it.alert;it.alert=clamp(it.alert+v*(it.pos?.25:1)*({S:1.4,A:1.2}[gradeOf(it)]||1),0,100);if(b<60&&it.alert>=60)T.lines.push({c:'r',t:`${String(it.subj||'당국').replace(/ 측$/,'')} 측이 취재 사실을 눈치챘다. 문건 확보와 탐문이 어려워진다.`});
    const mx=S.simple?1:2;if((it.ctrN||0)<mx&&((b<30&&it.alert>=30)||(b<55&&it.alert>=55))&&chance(S.simple?.35:.65))T.ctrQ=ctrPick(it);};
  const FM=m=>['call','docs','scene','ask','data'].includes(m)||!!(METH[m]&&METH[m].dept);
  const finish=()=>{
    if(it.hoax&&it.facts.every(f=>!fOK(f))&&T.max-T.left>=3&&chance(.5)){S.items=S.items.filter(x=>x!==it);log(`「${it.title}」${jp(it.title,'은','는')} 허위 제보로 드러났다`);openModal('허위 제보',`<p class="lede">아무리 파도 근거가 없다. 최초 글쓴이는 계정을 지웠다. 쓰지 않은 게 다행이다.</p>${fxLine(apply({inv:.4,trust:1}))}`);return false;}
    if(it.dud&&!it.dudShown&&it.facts.some(fOK)&&chance(.65)){dudReveal(it);return false;}
    const bribe=!it.bribed&&(it.pos?chance(.12):it.alert>=50&&chance(.3));
    openModal('편집국 복귀',`<p class="lede">「${esc(it.title)}」 취재를 마쳤다.</p><ul class="feed">${T.lines.map(l=>`<li class="${l.c}">${esc(l.t)}</li>`).join('')}</ul>${factList(it)}${invNotebook(it)}<p class="hint">반론: ${it.rebut==='got'?'받음':it.rebut==='no'?'노코멘트(요청 기록 있음)':'아직'} · 전문가 코멘트: ${it.expert?'있음':'없음'} · 녹취: ${it.tape?'있음':'없음'} · 상대 경계: ${Math.round(it.alert)}${it.lawyer?' · 내용증명 받음':''}</p>`,
      bribe?[{label:'계속',fn:()=>{bribeEvent(it);return false;}}]:[{label:'수첩 덮기'}]);
    return false;
  };
  const doM=m=>{
    const M=METH[m];T.left-=M.t;alertUp(M.al);if(M.hp)S.hp=clamp(S.hp-M.hp,0,100);if(M.money)S.money-=M.money;
    if(m==='foi'){S.pending.push({type:'foi',item:it.id,due:S.turn+R(2,4)});T.lines.push({c:'s',t:'정보공개청구서를 냈다. 한 달 안팎 뒤 결과가 나온다.'});gain('kno',.2);return draw();}
    if(m==='expert'){it.expert=1;T.lines.push({c:'g',t:`${pick(['교수','변호사','회계사','전직 감독관'])} 자문: "${pick(['구조적인 문제입니다.','법 위반 소지가 큽니다.','이 정도면 감사가 필요합니다.','통계가 말해주고 있어요.'])}"`});gain('kno',.4);return draw();}
    if(m==='rebut'){it.rebut=chance(it.pos?.85:.55)?'got':'no';T.lines.push({c:'q',t:`${it.subj}: ${pick(it.pos?(it.rebut==='got'?IVL_POS.got:IVL_POS.no):(it.rebut==='got'?IVL.rebutGot:IVL.rebutNo))}`});return draw();}
    if(m==='interview'){interview(it,T,draw);return;}
    const f=target(it,m);if(!f){T.lines.push({c:'',t:'더 확인할 사실이 없다.'});return draw();}
    const p=mChance(it,m,f);it.nb=0;gain({call:'net',docs:'ver',scene:'inv',ask:'cha',data:'dat'}[m]||'inv',.35);gain('ver',.12);
    (T.auto?(g=>g(0)):(g=>moment(m,it,g)))(b=>{const pp=clamp(p+b,.03,.97);
    if(chance(pp)){f.conf++;f.via.push(M.n);T.lines.push({c:'g',t:`${SUCC[m]} ${f.t}${f.key&&f.conf<f.need?' — 단일 출처. 다른 경로로 한 번 더 확인해야 한다':''}`});invNote(it,f,m);const L=leadMake(it,f);if(L)T.lines.push({c:'s',t:`단서 발견 — ${L.t}. "${L.act}" 길이 열렸다.`});twist(it,T);}
    else{T.lines.push({c:'r',t:`${f.t} — ${pick(FAILS[m])}${it.hoax&&S.st.ver>=55&&chance(.4)?' (제보 자체가 수상하다는 느낌이 든다)':''}`});if(!T.auto&&!it.hoax&&chance(.5))return retryShow(m,it,T,f,draw);}
    draw();});
  };
  const useLead=L=>{T.left-=1;alertUp(4);it.leads=(it.leads||[]).filter(x=>x!==L);const f=leadTarget(it,L);if(!f){T.lines.push({c:'',t:'더 확인할 사실이 없다.'});return draw();}gain('inv',.3);
    if(chance(leadChance(it))){f.conf++;f.via.push('단서 추적');T.lines.push({c:'g',t:`단서를 따라가 확인: ${f.t} (${L.t})`});invNote(it,f,'lead');const L2=leadMake(it,f);if(L2)T.lines.push({c:'s',t:`또 다른 단서 — ${L2.t}`});}else T.lines.push({c:'r',t:`단서는 막다른 길이었다: ${L.t}`});draw();};
  const draw=()=>{
    if(T.ctrQ&&T.left>0){const k=T.ctrQ;T.ctrQ=null;it.ctrN=(it.ctrN||0)+1;return ctrShow(it,T,k,draw);}
    if(T.left<=0)return finish();
    const src=srcOf(it.d);
    const body=`<p class="lede">「${esc(it.title)}」</p>${S.outlet&&medInv().h?`<p class="hint">${esc(medInv().h)}</p>`:''}<div class="timer">남은 시간 ${Array.from({length:T.max},(_,i)=>`<i class="${i<T.left?'':'off'}"></i>`).join('')}<span style="margin-left:10px">상대 경계 ${Math.round(it.alert)}</span><span style="margin-left:10px">${entName(it.ent)} 관계 ${Math.round(netRel(it.ent))}${S.net&&S.net[it.ent]&&S.net[it.ent].block?' · 자료 거부 중':''}</span>${it.excl?`<span style="margin-left:10px;color:var(--red)">타사 추격까지 ${heatTxt(it.heat)}</span>`:''}</div>${factList(it)}${T.lines.length?`<ul class="feed" style="margin-top:8px">${T.lines.slice(-4).map(l=>`<li class="${l.c}">${esc(l.t)}</li>`).join('')}</ul>`:''}`;
    const ch=Object.keys(METH).filter(m=>!METH[m].dept||DEPT_METH[S.dept]===m).map(m=>{const M=METH[m];let dis=M.t>T.left,sub=M.d;
      if(FM(m)){const f=target(it,m);if(!f){dis=true;sub='확인할 사실 없음';}else sub=`→ ${f.t} · 성공 ${pct(mChance(it,m,f))}`;}
      if(m==='call'&&!src){dis=true;sub='이 분야 취재원이 없다';}
      if(m==='docs'&&bestSrc(it.d)<40){dis=true;sub='신뢰 40 이상 취재원 필요 (정보공개청구로 대체 가능)';}
      if(m==='foi'&&S.pending.some(p=>p.type==='foi'&&p.item===it.id)){dis=true;sub='이미 청구 중';}
      if(m==='expert'&&it.expert){dis=true;sub='이미 확보';}
      if(m==='rebut'&&it.rebut){dis=true;sub='이미 요청함';}
      if(m==='interview'&&it.interviewed){dis=true;sub='이미 만났다';}
      return{m,label:`${M.dept?'★ ':''}${M.n} (${M.t}칸)`,sub:M.dept&&!dis?`부서 기법 · ${sub}`:sub,disabled:dis,fn:()=>{doM(m);return false;}};});
    (it.leads||[]).slice().reverse().forEach(L=>{const f=leadTarget(it,L);ch.unshift({m:'lead',label:`단서 따라가기 — ${L.act} (1칸)`,sub:f?`${L.t} → ${f.t} · 성공 ${pct(leadChance(it))} · 다른 경로로 인정`:'확인할 사실 없음',disabled:!f||T.left<1,lead:L,fn:()=>{useLead(L);return false;}});});
    try{let best=null,bp=0;ch.forEach(c=>{if(c.disabled)return;if(c.m==='lead'){const p=leadChance(it);if(p>bp){bp=p;best=c;}return;}if(!FM(c.m))return;const f=target(it,c.m);const p=f?mChance(it,c.m,f):0;if(p>bp){bp=p;best=c;}});if(!it.pos&&!it.rebut&&it.facts.filter(fOK).length>=2){const rb=ch.find(c=>c.m==='rebut'&&!c.disabled);if(rb)best=rb;}if(best)best.rec=true;}catch(e){}
    if(T.auto){const b2=ch.find(c=>c.rec&&!c.disabled&&c.m!=='interview');if(b2){if(b2.lead)useLead(b2.lead);else doM(b2.m);}else finish();return;}
    if(T.left>=2&&ch.some(c=>c.rec&&!c.disabled))ch.unshift({label:'추천 기법으로 끝까지',sub:'남은 시간을 성공 확률이 가장 높은 기법에 알아서 쓴다 · 현장 돌발 상황은 건너뛴다',fn:()=>{T.auto=true;draw();return false;}});
    ch.push({label:'편집국으로 복귀',cls:'ghost',fn:()=>{finish();return false;}});
    openModal('취재 중',body,ch);
  };
  draw();
}
// bribeEvent: 1.6에서 src/compat/v43.js의 같은 이름 함수로 대체됨 (예전 정의는 실행되지 않아 지웠다)

// --- 기사 쓰기 ---
RUN.write=function(){
  const its=writable();if(its.length===1){const it=its[0];toast(`「${it.title}」 기사 쓰기`);return ownGate(it,o=>writeAngle(Object.assign({it},o)));}
  openModal(`${actName('write')} · 아이템 선택`,'<p>확인된 사실이 1개 이상인 아이템만 쓸 수 있다.</p>',(()=>{const __ab=aiBest(its,'write');return its.map(it=>({rec:it===__ab,label:it.title,sub:`${DEPTS[it.d].n} · 확인 ${it.facts.filter(fOK).length}/${it.facts.length}${it.excl?' · 단독 가능':''}${it.slot?` · ${SLOT[it.slot.g].n} 배정`:''}${it.rebut||it.pos?'':' · 반론 없음'}${timTxt44(it)}`,fn:()=>{ownGate(it,o=>writeAngle(Object.assign({it},o)));return false;}}));})().concat([{label:'취소',cls:'ghost'}]));
};
function leanOf(it){const L=OUT().lean;if(L==='market')return it.d==='eco'?'cons':'neu';return L;}
function writeSimple(W){const it=W.it,o=OUT();W.angle=it.ideo?(o.lean==='market'?'cons':o.lean):(yamaFeas(it,yamaOf(it))?yamaOf(it):it.facts.filter(fOK).length>=3?'iv':'st');
  const key=it.facts.find(f=>f.key);const best=fOK(key)?key:it.facts.find(fOK);W.lead=best===key?'key':{n:'num',s:'scene',w:'person',d:'key'}[best.k]||'key';W.leadOK=true;W.leadText=best.t;
  W.sel=it.facts.map((f,i)=>fOK(f)?i:-1).filter(i=>i>=0);W.rb=!!it.rebut;W.ex=!!it.expert;writeHead(W);}
const YAMA_N={st:'스트레이트',ex:'해설',re:'르포',iv:'탐사',hu:'휴먼 스토리',da:'데이터 기사',li:'생활 밀착'};
const YAMA_DEPT=[[/정치/,'정치적 셈법 — 누가 얻고 누가 잃나'],[/경제|산업|증권|금융|부동산|유통|재계/,'숫자 뒤의 구조 — 왜 이렇게 됐나'],[/사회|사건|법조|경찰|탐사/,'반복되는 이유 — 제도의 빈틈을 짚는다'],[/국제|외신|특파/,'한국에 미칠 파장 — 국제 정세 해설'],[/스포츠|체육/,'승부를 가른 것 — 기록과 전술 해설'],[/문화|연예|방송|대중/,'왜 지금 이 현상인가 — 흐름 읽기'],[/과학|IT|테크|의학|보건|의료/,'무엇이 달라지나 — 원리와 쟁점 해설'],[/지역|자치|전국|시군|시청|도청/,'주민에게 무슨 의미인가 — 지역 현안 해설']];
const LIFE_D=/경제|사회|생활|복지|보건|의학|의료|부동산|유통|소비|교육|지역|자치|산업|시청|도청/;
function yamaEx(it){if(/의혹|비리|폭언|갑질|횡령|부실|은폐|특혜|비위|유착|사고|참사/.test(it.title))return '왜 반복되나 — 제도의 빈틈과 책임 구조';const n=(DEPTS[it.d]||{}).n||'';const f=YAMA_DEPT.find(x=>x[0].test(n));return f?f[1]:'왜 지금인가 — 배경과 맥락';}
function yamaShort(t,n){t=String(t||'');n=n||24;return t.length>n?t.slice(0,n)+'…':t;}
// 기사마다 '맞는 야마'가 하나 숨어 있다. 사실의 종류(숫자·현장·증언)·규모·단독 여부·부서가 정한다
function yamaOf(it){if(it.yama)return it.yama;const has=k=>it.facts.some(f=>f.k===k);const n=(DEPTS[it.d]||{}).n||'';
  const w={st:1,ex:it.imp>=40?1.6:.9,re:has('s')?2:0,iv:(it.excl?1.6:.6)*(it.facts.length>=4?1.5:.6)*(it.imp>=45?1.3:.7),hu:has('w')?1.7:0,da:has('n')?1.5:0,li:LIFE_D.test(n)?1.4:.2};
  let t=Object.values(w).reduce((a,b)=>a+b,0)*Math.random();for(const k in w){t-=w[k];if(t<=0){it.yama=k;break;}}if(!it.yama)it.yama='st';return it.yama;}
function yamaFeas(it,t){const ok=k=>it.facts.some(f=>f.k===k&&fOK(f));return t==='re'?ok('s'):t==='hu'?ok('w'):t==='da'?ok('n'):t==='iv'?it.facts.filter(fOK).length>=3:true;}
function yamaOpt(it,tag){const ok=k=>it.facts.find(f=>f.k===k&&fOK(f)),any=k=>it.facts.find(f=>f.k===k);const key=it.facts.find(f=>f.key)||it.facts[0]||{t:it.title};const nOK=it.facts.filter(fOK).length;const sj=String(it.subj||'').replace(/ 측$/,'');const sh=yamaShort;
  if(tag==='st')return{l:`「${sh(key.t,28)}」 — 사실만 짧게`,s:fOK(key)?'핵심이 확인돼 있다 · 무난하다':'핵심이 덜 확인됐다 · 짧아도 위험',tag};
  if(tag==='ex')return{l:yamaEx(it),s:`상식이 높을수록 좋다${it.imp>=40?' · 큰 사안이라 해설 수요가 있다':''}`,tag};
  if(tag==='re'){const f=any('s');return{l:f?`「${sh(f.t)}」 — 그 현장에서`:'현장 르포 — 직접 본 것을 쓴다',s:ok('s')?'현장 사실이 확인돼 있다 · 컨디션 -5':'현장 확인이 안 됐다 · 위험',tag};}
  if(tag==='iv')return{l:`${sj?sh(sj,14)+' — ':''}구조와 책임을 파고든다`,s:nOK>=3?`확인 사실 ${nOK}개 · 탐사로 밀 만하다`:`확인 사실 ${nOK}개 · 3개는 있어야 버틴다`,tag};
  if(tag==='hu'){const f=any('w');return{l:f?`사람 이야기 — 「${sh(f.t)}」`:'사람 이야기로 풀어 간다',s:ok('w')?'증언이 확인돼 있다':'증언 확인이 안 됐다 · 약하다',tag};}
  if(tag==='da'){const f=any('n');return{l:f?`숫자가 말한다 — 「${sh(f.t)}」`:'데이터로 보여 준다',s:ok('n')?'수치가 확인돼 있다':'수치 확인이 안 됐다 · 틀리면 정정감',tag};}
  return{l:'그래서 내 삶엔? — 독자 생활에 미칠 영향',s:LIFE_D.test((DEPTS[it.d]||{}).n||'')?'생활 밀착형 사안이다 · 많이 읽힌다':'생활과 거리가 있는 사안이다',tag:'li'};}
function writeAngle(W){if(S.simple)return writeSimple(W);
  const it=W.it,o=OUT();let opts,rec;
  if(it.ideo){const kf=it.facts.find(f=>f.key)||it.facts[0];const sj=kf?`「${yamaShort(kf.t,18)}」 — `:'';opts=[{l:`${sj}성장·안보·재정 건전성 관점으로 짚는다`,tag:'cons'},{l:`${sj}분배·노동·약자 보호 관점으로 짚는다`,tag:'prog'},{l:`${sj}양쪽 입장을 균형 있게 싣는다`,tag:'neu'}];rec=leanOf(it);}
  else{const best=yamaOf(it);const pool=['ex','re','iv','hu','da','li'].filter(t=>t!==best&&(t!=='re'||it.facts.some(f=>f.k==='s'))&&(t!=='hu'||it.facts.some(f=>f.k==='w'))&&(t!=='da'||it.facts.some(f=>f.k==='n')));
    const tags=[...new Set([best,'st',...shuffle(pool).slice(0,2)])].slice(0,4);opts=shuffle(tags).map(t=>yamaOpt(it,t));rec=best;}
  const sense=(S.st.kno||40)*.6+(S.st.wri||40)*.3+S.rank*4+(it.d===S.dept?6:0);const showRec=it.ideo||sense>=58||chance(clamp(sense/100,.1,.6));
  openModal('1단계 · 야마 잡기',`<p class="lede">「${esc(it.title)}」</p><p>${o.n}의 논조: <b>${LEAN[o.lean]}</b>${it.ideo?' — 논조가 갈리는 아이템이다. 데스크가 지켜본다.':''}</p>${it.ideo?'':`<p class="hint">기사마다 맞는 야마가 다르다. ${showRec?'감으로는 「추천」이 이 기사의 야마다.':'이번엔 감이 잘 안 온다. 확인한 사실을 보고 고르자.'}</p>`}`,
    opts.map(x=>({label:x.l,sub:x.s,rec:showRec&&x.tag===rec,risk:!it.ideo&&!yamaFeas(it,x.tag),fn:()=>{W.angle=x.tag;W.angleL=x.l;writeLead(W);return false;}})).concat([{label:'추천대로 쓰기 — 단계 건너뛰기',sub:'야마·리드·팩트·반론을 감에 맞게 자동으로 · 제목만 고른다 · 완성도 조금↓',fn:()=>{W.mq=(W.mq||0)-2;W.auto=1;writeSimple(W);return false;}},{label:'← 이전 단계',cls:'ghost',fn:()=>{RUN.write();return false;}},{label:'쓰기 취소',sub:'행동력은 쓰지 않는다',cls:'ghost'}]));
}
function writeLead(W){
  const it=W.it;const ok=k=>it.facts.find(f=>f.k===k&&fOK(f));const key=it.facts.find(f=>f.key);
  const L=[
    {k:'num',l:'숫자로 연다',f:ok('n'),s:ok('n')?`"${ok('n').t}."`:'확인된 데이터가 없다'},
    {k:'scene',l:'현장 장면으로 연다',f:ok('s'),s:ok('s')?(/현장/.test(ok('s').t)?`"${ok('s').t}. 기자가 직접 가 보니..."`:`"${ok('s').t}. 기자가 찾은 현장은..."`):'현장 확인이 안 됐다'},
    {k:'person',l:'사람 이야기로 연다',f:ok('w'),s:ok('w')?`"${ok('w').t}."`:'확인된 증언이 없다'},
    {k:'key',l:'핵심 의혹으로 곧장 연다',f:fOK(key)?key:null,s:fOK(key)?`"${key.t}."`:'핵심이 덜 확인됐다. 위험하다'}
  ];
  openModal('2단계 · 리드 문장',`<p>첫 문장이 기사의 운명을 정한다. 확인된 사실로 열어야 힘이 실린다.</p>`,L.map(x=>({label:x.l,sub:x.s,rec:x.k===(L.find(y=>y.k==='key'&&y.f)||L.find(y=>y.f)||{}).k,risk:!x.f,fn:()=>{W.lead=x.k;W.leadOK=!!x.f;W.leadText=x.f?x.f.t:key.t;writeFacts(W);return false;}})).concat([{label:'← 이전 단계',cls:'ghost',fn:()=>{writeAngle(W);return false;}},{label:'쓰기 취소',sub:'행동력은 쓰지 않는다',cls:'ghost'}]));
}
function writeFacts(W){
  const it=W.it;
  const body=`<p>어떤 사실을 넣을까? 미확인 사실은 파급력을 키우지만 오보 위험이 생긴다. 핵심 사실이 단일 출처면 위험이 남는다.</p><div class="help-nav"><button type="button" data-wf="ok">확인된 것만 (추천)</button><button type="button" data-wf="all">전부 넣기 (위험)</button></div>${it.facts.map((f,i)=>`<label class="chk"><input type="checkbox" data-f="${i}" ${fOK(f)?'checked':''}><span>${esc(f.t)}${f.key?' <span class="tag so">핵심</span>':''}<small>${fOK(f)?'확인됨 · '+f.via.join(', '):f.conf?'단일 출처 — 교차 확인 안 됨':'미확인 — 넣으면 위험'}</small></span></label>`).join('')}
  <label class="chk"><input type="checkbox" id="wRb" ${it.rebut?'checked':''} ${it.rebut?'':'disabled'}><span>${esc(sbjN(it.subj))} 측 ${it.pos?'코멘트':'반론'}<small>${it.rebut==='got'?'입장을 받았다':it.rebut==='no'?'"노코멘트" — 요청 사실을 적는다':it.pos?'회사 측 코멘트가 없다. 숫자는 공시·자료로만 확인한 상태다':'반론을 받지 않았다. 데스크가 문제 삼고 오보 위험이 커진다'}</small></span></label>
  ${it.expert?'<label class="chk"><input type="checkbox" id="wEx" checked><span>전문가 코멘트<small>기사에 무게가 실린다</small></span></label>':''}`;
  openModal('3단계 · 팩트와 반론',body,[{label:'다음: 제목 달기',fn:()=>{W.sel=[...document.querySelectorAll('#mb input[data-f]')].filter(x=>x.checked).map(x=>+x.dataset.f);if(!W.sel.length){toast('최소 한 개의 사실은 넣어야 한다');return false;}W.rb=!!($('#wRb')&&$('#wRb').checked);W.ex=!!($('#wEx')&&$('#wEx').checked);writeHead(W);return false;}},{label:'← 이전 단계',cls:'ghost',fn:()=>{writeLead(W);return false;}},{label:'쓰기 취소',sub:'행동력은 쓰지 않는다',cls:'ghost'}]);
  document.querySelectorAll('#mb [data-wf]').forEach(b=>b.onclick=()=>{const all=b.dataset.wf==='all';document.querySelectorAll('#mb input[data-f]').forEach(x=>{x.checked=all||fOK(it.facts[+x.dataset.f]);});const rb=$('#wRb');if(rb&&!rb.disabled)rb.checked=true;});
}
// ===== 1.1 4단계: 인용 고르기 + 제목 직접 만들기 =====
function quoteCands(W){const it=W.it,L=[];const sel=new Set(W.sel||[]);
  it.facts.forEach((f,i)=>{if(f.k!=='w'||!sel.has(i))return;const m=f.t.match(/^(.*?)\s*"([^"]+)"/);const who=m?m[1].trim()||'관계자':'관계자',q=m?m[2]:f.t;L.push({kind:'w',who,q,ok:fOK(f),named:!/익명|관계자|지인|측근|직원|업계/.test(who)});});
  if(it.wq&&it.wq.q)L.push({kind:'iv',who:it.wq.who||'인터뷰이',q:it.wq.q,ok:true,named:true});
  if(it.quote)L.push({kind:'tape',who:`${(it.subj||'관계자').replace(/ 측$/,'')} 녹취`,q:it.quote,ok:true,named:true});
  if(W.rb&&it.rebut==='got'){if(!it.rbq)it.rbq=pick(HEAD_R);L.push({kind:'rb',who:`${(it.subj||'당국').replace(/ 측$/,'')} 측`,q:it.rbq,ok:true,named:true});}
  if(W.ex)L.push({kind:'ex',who:'전문가',q:it.exq||(it.exq=pick(['제도적 보완이 시급하다','이번이 처음이 아닐 것','관리 감독 체계를 다시 봐야 한다','책임 소재부터 가려야 한다'])),ok:true,named:true});
  return L;}
const QK_NOTE={w:['증언','사람 이야기가 살아난다 · 조회수↑'],iv:['인터뷰','직접 들은 말이라 무게가 실린다 · 완성도↑'],tape:['녹취','움직일 수 없는 증거다 · 완성도↑ · 조회수↑'],rb:['반론','상대 말을 앞세운다 · 신뢰↑ · 파급력 조금↓'],ex:['전문가','기사에 무게가 실린다 · 완성도 조금↑']};
function headParts(it,W){const pre=it.excl?'[단독] ':'';const C=headCore(it),S0=(it.subj||'당국').replace(/ 측$/,'');const nf=it.facts.find((f,i)=>f.k==='n'&&fOK(f)&&(W.sel||[]).includes(i));let yh='';try{yh=headYama(it,W,'')||'';}catch(e){}
  const qt=W.qt;const front=[{k:'none',l:'없음'}];if(qt)front.push({k:'quote',l:'인용 따옴표'});if(nf)front.push({k:'num',l:'숫자'});
  const body=[{k:'title',l:'사건 그대로',t:it.title}];if(yh&&yh!==it.title)body.push({k:'yama',l:'야마를 살려',t:yh.replace(/^\[단독\] /,'')});
  const tail=[{k:'none',l:'없음'}];if(C.K)tail.push({k:'key',l:'핵심 확인'});if(it.rebut==='got'&&W.rb)tail.push({k:'rb',l:'반론 붙이기'});tail.push({k:'ask',l:'물음표'},{k:'bait',l:'자극'});
  return{pre,C,S0,nf,front,body,tail};}
function headCompose(it,W,c){const P=headParts(it,W);let h='';if(c.tag&&P.pre)h+=P.pre;
  if(c.front==='quote'&&W.qt)h+=`"${yamaShort(W.qt.q,20)}"…`;if(c.front==='num'&&P.nf)h+=`${yamaShort(P.nf.t,22)}…`;
  const b=(P.body.find(x=>x.k===c.body)||P.body[0]).t;h+=b;
  if(c.tail==='key')h+=/"/.test(P.C.K)?`…${P.C.K}`:`…${P.C.K} 확인`;if(c.tail==='rb')h+=`…${P.S0} "${yamaShort(it.rbq||HEAD_R[0],14)}"`;const hk=String(it.id||it.title).split('').reduce((a,ch)=>a+ch.charCodeAt(0),0);if(c.tail==='ask')h+=['…왜?','…누구 책임인가','…이대로 괜찮나'][hk%3];if(c.tail==='bait')h+=['…"충격"','…경악','…"이럴 수가"'][hk%3];
  return h.replace(/(논란|의혹|정황|확인) \1/g,'$1').replace(/…+/g,'…').replace(/\s+/g,' ').trim();}
function headKind(c){return c.tail==='bait'?'bait':c.tail==='ask'?'ask':c.front==='quote'?'quote':c.front==='num'?'num':(!c.tag&&c.front==='none'&&c.tail==='none')?'calm':'honest';}
const HK_NOTE={honest:'정확형 · 신뢰↑',calm:'절제형 · 반응은 약하지만 안전',bait:'자극형 · 조회수↑↑ · 신뢰↓ · 포털 벌점',quote:'따옴표형 · 조회수↑',num:'숫자형 · 완성도↑ · 조회수↑',ask:'의문형 · 조회수↑ · 신뢰 조금↓'};
function writeHead(W){const it=W.it;const on=OUT().type==='online';
  if(S.simple&&!W.craft)return writeHeadList(W,true);
  const Q0=quoteCands(W);if(W.qi==null){const b=Q0.findIndex(x=>x.kind==='tape')>=0?Q0.findIndex(x=>x.kind==='tape'):Q0.findIndex(x=>x.ok&&x.kind!=='rb');W.qi=b;}W.qt=W.qi>=0?Q0[W.qi]:null;
  const c=W.hc||(W.hc={tag:!!it.excl,front:'none',body:'title',tail:it.facts.some(f=>f.key&&fOK(f))?'key':'none'});
  const P=headParts(it,W);if(!P.front.some(x=>x.k===c.front))c.front='none';if(!P.body.some(x=>x.k===c.body))c.body='title';if(!P.tail.some(x=>x.k===c.tail))c.tail='none';
  const row=(name,key,opts)=>`<div class="hb-row"><span class="hb-l">${name}</span><div class="hb-o">${opts.map(o=>`<button type="button" class="hb-b${c[key]===o.k?' on':''}" data-hk="${key}" data-hv="${o.k}">${esc(o.l)}</button>`).join('')}</div></div>`;
  const qHTML=Q0.length?`<div class="hb-q">${Q0.map((x,i)=>`<label class="${W.qi===i?'on':''}"><input type="radio" name="wq" data-qi="${i}" ${W.qi===i?'checked':''}><span>${esc(x.who)} "${esc(yamaShort(x.q,34))}"<small>${QK_NOTE[x.kind][0]}${x.ok?' · 확인됨':' · <span class="w">확인 안 됨</span>'} · ${QK_NOTE[x.kind][1]}</small></span></label>`).join('')}<label class="${W.qi===-1?'on':''}"><input type="radio" name="wq" data-qi="-1" ${W.qi===-1?'checked':''}><span>인용 없이 쓴다</span></label></div>`:'<p class="hint">인용할 발언이 없다. 증언·녹취·인터뷰·반론을 확보하면 고를 수 있다.</p>';
  const h=headCompose(it,W,c),k=headKind(c);
  const body=`<div class="hb-sec"><b>핵심 인용</b> — 기사 맨 앞에 세울 한마디</div>${qHTML}
   <div class="hb-sec"><b>제목 만들기</b></div>${it.excl?row('단독 표시','tag',[{k:true,l:'붙인다'},{k:false,l:'뺀다'}]):''}${row('앞머리','front',P.front)}${row('본문','body',P.body)}${row('꼬리','tail',P.tail)}
   <div class="hb-prev"><small>미리보기</small><b id="hbH">${esc(h)}</b><span id="hbK">${HK_NOTE[k]}${W.qt&&!W.qt.ok&&c.front==='quote'?' · 확인 안 된 말을 제목에 박았다 — 위험':''}</span></div>`;
  openModal('4단계 · 인용과 제목',body,[
   {label:'이 제목으로 간다',sub:'직접 만든 제목 · 완성도 조금↑',fn:()=>{const cc=W.hc;W.head=headKind(cc);W.headY=cc.body==='yama'?1:0;W.headline=headCompose(it,W,cc);W.craft=1;if(W.qt&&!W.qt.ok&&cc.front==='quote')medNote(W,'risk',.03);writeMedium(W);return false;}},
   {label:'추천 제목 목록',cls:'ghost',fn:()=>{writeHeadList(W);return false;}},
   {label:'← 이전 단계',cls:'ghost',fn:()=>{S.simple?RUN.write():writeFacts(W);return false;}},{label:'쓰기 취소',sub:'행동력은 쓰지 않는다',cls:'ghost'}]);
  const upd=()=>{const hh=headCompose(it,W,W.hc),kk=headKind(W.hc);const a=document.getElementById('hbH'),b=document.getElementById('hbK');if(a)a.textContent=hh;if(b)b.textContent=HK_NOTE[kk]+(W.qt&&!W.qt.ok&&W.hc.front==='quote'?' · 확인 안 된 말을 제목에 박았다 — 위험':'');};
  document.querySelectorAll('#mb .hb-b').forEach(bt=>bt.onclick=()=>{const key=bt.dataset.hk;let v=bt.dataset.hv;if(key==='tag')v=v==='true';W.hc[key]=v;document.querySelectorAll(`#mb .hb-b[data-hk="${key}"]`).forEach(x=>x.classList.toggle('on',x===bt));upd();});
  document.querySelectorAll('#mb input[name="wq"]').forEach(r=>r.onchange=()=>{W.qi=+r.dataset.qi;W.qt=W.qi>=0?Q0[W.qi]:null;if(!W.qt&&W.hc.front==='quote')W.hc.front='none';writeHead(W);});}
function writeHeadList(W,simple){const it=W.it;const on=OUT().type==='online';const hs=headOpts(it,on,W);
  if(W.qi==null){const Q0=quoteCands(W);const b=Q0.findIndex(x=>x.ok&&x.kind!=='rb');W.qi=b;W.qt=b>=0?Q0[b]:null;}
  openModal('4단계 · 제목 달기',`<p>독자가 가장 먼저 보는 한 줄이다. 제목 감각(능력치)이 높을수록 어떤 제목이든 효과가 커진다.</p>`,hs.map(x=>({label:x.h,sub:x.s,disabled:!!x.dis,rec:x===(hs.find(y=>y.y&&W.angle===it.yama)||hs.find(y=>y.k==='honest'&&!y.dis)),risk:x.k==='bait',fn:()=>{W.head=x.k;W.headY=x.y?1:0;W.headline=x.h;writeMedium(W);return false;}})).concat([
   {label:'제목과 인용을 직접 고른다',cls:simple?'':'ghost',sub:'앞머리·본문·꼬리를 조립하고 앞세울 한마디를 고른다',fn:()=>{W.craft=1;writeHead(W);return false;}},
   {label:'← 이전 단계',cls:'ghost',fn:()=>{S.simple?RUN.write():writeHead(W);return false;}},{label:'쓰기 취소',sub:'행동력은 쓰지 않는다',cls:'ghost'}]));}
// 기사 미리보기 (5단계 위에 붙는다)
function articlePreview(W){const it=W.it;const inc=(W.sel||[]).map(i=>it.facts[i]).filter(Boolean),ver=inc.filter(fOK),unv=inc.filter(f=>!fOK(f));
  const lead=W.leadText||((it.facts.find(f=>f.key&&fOK(f))||{}).t)||it.title;const qt=W.qt;
  const warn=[];if(unv.length)warn.push(`확인 안 된 사실 ${unv.length}개가 들어갔다 — 기사는 커지지만 신뢰가 깎이고 오보 위험이 남는다`);if(!W.rb)warn.push('반론이 없다');if(qt&&!qt.ok)warn.push('앞세운 말이 확인되지 않았다');
  return `<div class="art-prev"><small>${esc(OUT().n)} · 기사 미리보기</small><h4>${esc(W.headline||it.title)}</h4><p>${esc(lead)}.${ver.length>1?` ${esc(ver.filter(f=>f.t!==lead).slice(0,2).map(f=>f.t).join(', '))}.`:''}</p>${qt?`<blockquote>"${esc(qt.q)}" — ${esc(qt.who)}</blockquote>`:''}<div class="art-meta">확인 ${ver.length}/${inc.length}${W.rb?' · 반론 있음':''}${warn.length?`<span class="w">${esc(warn.join(' · '))}</span>`:''}</div></div>`;}
// 인용의 효과 (writeFinish에서 부른다)
function quoteFx(W){const qt=W.qt;if(!qt)return{q:0,v:1,r:0,t:0,i:1};const k=qt.kind;
  return{q:k==='tape'?4:k==='iv'?3:k==='ex'?2:k==='w'?(qt.ok?2:0):1,v:k==='w'?1.12:k==='tape'?1.15:k==='iv'?1.08:1,r:qt.ok?0:.04,t:k==='rb'?.5:qt.ok?0:-.4,i:k==='rb'?.95:1};}

// ===================== 6.2 매체마다 다른 플레이 =====================
const MED_G=t=>['tv','jp','ch'].includes(t)?'tv':t;
const MED_INV={wire:{slot:0,meth:{call:.06,scene:-.04},h:'통신사 — 전화 취재가 빠르다. 현장은 짧게'},daily:{slot:0,meth:{docs:.03,record:.02},h:'일간지 — 문건과 기록으로 지면을 채운다'},econ:{slot:0,meth:{data:.05,filing:.05},h:'경제지 — 숫자와 공시가 무기다'},local:{slot:0,meth:{ask:.06,native:.05,scene:.03},h:'지역지 — 동네 사람들이 곧 취재원이다'},weekly:{slot:2,meth:{},h:'주간지 — 한 번 나가면 오래 판다 (시간 +2칸)'},tv:{slot:0,meth:{scene:.06,interview:0},h:'방송 — 그림이 있어야 리포트가 된다. 현장 확인을 챙기자'},online:{slot:0,meth:{data:.05,call:.04,scene:-.04},h:'인터넷 — 전화와 데이터로 빨리 친다. 현장은 짧게'},sports:{slot:0,meth:{locker:.06,scene:.03},h:'스포츠지 — 라커룸과 현장이 전부다'},eng:{slot:0,meth:{wire:.06,expert:0},h:'영문지 — 외신과 대사관이 독자다'},trade:{slot:0,meth:{call:.05,filing:.04},h:'전문지 — 업계 사람들이 취재원이자 독자다'}};
function medInv(){return (S&&S.outlet&&MED_INV[MED_G(OUT().type)])||{slot:0,meth:{}};}
function medNote(W,k,v){W.md=W.md||{};if(typeof v==='string'){W.md[k]=W.md[k]?W.md[k]+' '+v:v;return;}W.md[k]=(W.md[k]||0)+v;}
function medCount(k,v){S.mMed=S.mMed||{};S.mMed[k]=(S.mMed[k]||0)+(v==null?1:v);}
function writeMedium(W){
  const t=MED_G(OUT().type),it=W.it;const fin=()=>{writeFinish(W);return false;};const back=[{label:'← 이전 단계',cls:'ghost',fn:()=>{writeHead(W);return false;}},{label:'쓰기 취소',sub:'행동력은 쓰지 않는다',cls:'ghost'}];
  const okK=k=>it.facts.some(f=>f.k===k&&fOK(f));const cov=it.facts.filter(fOK).length/Math.max(1,it.facts.length);
  const O=[];let title='5단계 · 출고 방식',lede='';
  if(t==='tv'){if(!it.photo&&tvFt(it))it.photo='현장 확인 화면';title='5단계 · 리포트 영상';lede='방송 리포트는 그림이 절반이다.'+(it.photo?' 현장 그림을 확보해 뒀다.':' 현장 그림이 없다.');
    O.push({label:'현장 스탠드업 리포트',sub:it.photo?'현장 그림이 살아 있다 · 방송감이 높을수록 완성도↑ · 컨디션↓':'그림이 부족해 효과가 작다 · 컨디션↓',rec:!!it.photo,fn:()=>{W.mq=(it.photo?5:1)+S.st.brd/(it.photo?8:12);gain('brd',.4);S.hp=clamp(S.hp-10,0,100);medCount('rep');if(!it.photo)medNote(W,'note','현장 그림이 부족해 리포트가 밋밋했다.');return fin();}});
    O.push({label:'녹취 화면 띄우기',sub:it2(it.tape,'녹취가 있으면 완성도 +12'),disabled:!it.tape,fn:()=>{W.mq=12;medCount('rep');return fin();}});
    if(it.excl&&S.rank>=1)O.push({label:'중계차 연결 · 생방송 단독',sub:'파급력↑ · 평판↑ · 생방송 실수 위험',risk:true,fn:()=>{W.mq=S.st.brd/6-2;medNote(W,'imp',.15);medNote(W,'fame',1);medNote(W,'risk',.03);medCount('live');medCount('rep');return fin();}});
    O.push({label:'자료화면으로 대체',sub:'빠르지만 완성도 -4',fn:()=>{W.mq=-4;return fin();}});}
  else if(t==='wire'){title='5단계 · 송고 방식';lede='통신사는 1분이 승부다. 언론사 수백 곳이 이 기사를 받아쓴다.';
    O.push({label:'1보 먼저 타전',sub:'파급력 +15% · 완성도 -5 · 단독이면 선점 효과',rec:!!it.excl,fn:()=>{W.speed=1;W.mq=-5;medCount('flash');if(it.excl){const n=R(30,120);medNote(W,'fame',.8);medCount('relay',n);medNote(W,'note',`1보 송고 3분 만에 ${n}개 매체가 받아썼다.`);}return fin();}});
    O.push({label:'1보 뒤 2보·종합으로 이어 쓰기',sub:'파급력↑ · 완성도 조금↑ · 컨디션↓',disabled:S.hp<20,fn:()=>{W.speed=1;W.mq=2;medNote(W,'imp',.05);S.hp=clamp(S.hp-6,0,100);medCount('flash');if(it.excl)medCount('relay',R(40,150));return fin();}});
    O.push({label:'완성본 한 번에 송고',sub:it.excl&&it.heat<=2?'안정적 · 타사가 먼저 칠 수 있다':'안정적',fn:()=>{if(it.excl&&it.heat<=2&&chance(.3)){medNote(W,'imp',-.2);medNote(W,'note','타사 1보가 2분 먼저 떴다. 선점을 놓쳤다.');}return fin();}});}
  else if(t==='daily'){title='5단계 · 지면과 온라인';lede='종이 신문은 내일 아침에 나온다. 온라인에 먼저 풀지, 지면으로 아낄지.';
    if(it.excl)O.push({label:'내일 아침 지면 단독으로 아낀다',sub:'파급력↑ · 밤사이 타사가 먼저 칠 위험',rec:true,fn:()=>{if(chance(.15)){medNote(W,'imp',-.25);medNote(W,'note','밤 11시, 타사가 온라인에 먼저 띄웠다. 아침 지면의 힘이 빠졌다.');}else{medNote(W,'imp',.12);medNote(W,'note','아침 지면이 나오자 다른 매체들이 받아쓰기 시작했다.');medCount('paper');}return fin();}});
    O.push({label:'오늘 밤 온라인 선공개',sub:'조회수↑ · 파급력 조금↓',fn:()=>{W.vm=1.4;medNote(W,'imp',-.04);return fin();}});
    if(OUT().p>=3)O.push({label:'경쟁지 가판 보고 다듬기',sub:'완성도↑ · 컨디션↓ (밤 10시 가판 확인)',fn:()=>{W.mq=4;S.hp=clamp(S.hp-5,0,100);medNote(W,'note','경쟁지 가판을 보고 제목과 리드를 다듬었다.');return fin();}});
    O.push({label:'그대로 넘긴다',sub:'평범',fn:fin});}
  else if(t==='econ'){title='5단계 · 시장과 타이밍';const corp=ENT[it.ent]&&ENT[it.ent].kind==='corp';lede=corp?'기업 기사다. 장중에 나가면 주가가 움직인다.':'경제지 독자는 숫자를 본다.';
    if(corp){O.push({label:'장중 출고',sub:it.pos?'조회수↑ · 평판↑ · 주가가 오르면 기업이 반긴다':'조회수↑ · 평판↑ · 주가가 흔들리면 기업이 반발',risk:!it.pos,fn:()=>{W.vm=1.3;medNote(W,'fame',.8);if(it.pos){if(chance(.4)){const d=R(3,9);medNote(W,'note',`출고 뒤 ${entName(it.ent)} 주가가 ${d}% 올랐다. 홍보실이 기사 링크를 돌렸다.`);netUp(it.ent,3);}}else if(chance(.3)){const d=R(4,12);medNote(W,'note',`출고 20분 만에 ${entName(it.ent)} 주가가 ${d}% 빠졌다. 증권가 메신저에 기사가 돌았다.`);netUp(it.ent,-12);medCount('market');if(chance(.08))S.pending.push({type:'suit',ent:it.ent,due:S.turn+R(3,6),title:it.title});}return fin();}});
      O.push({label:'장 마감 뒤 출고',sub:'안정적 · 완성도 조금↑',fn:()=>{W.mq=2;return fin();}});}
    O.push({label:'시장 데이터 박스 붙이기',sub:okK('n')?'확인된 숫자로 완성도↑':'확인된 숫자가 없다',disabled:!okK('n'),rec:okK('n'),fn:()=>{W.mq=5;return fin();}});
    if(!corp)O.push({label:'정책 해설로 다듬기',sub:'상식이 높을수록 완성도↑',fn:()=>{W.mq=S.st.kno/12;return fin();}});}
  else if(t==='local'){title='5단계 · 지역 밀착';lede='지역 독자는 "우리 동네 이야기"를 읽는다.';
    O.push({label:'주민 목소리를 더 담는다',sub:okK('w')?'증언이 있어 완성도↑ · 신뢰↑ · 컨디션↓':'증언이 부족하다 · 컨디션↓',rec:okK('w'),fn:()=>{W.mq=okK('w')?5:1;if(okK('w'))medNote(W,'trust',.5);S.hp=clamp(S.hp-4,0,100);medCount('local');return fin();}});
    O.push({label:'지역면 톱으로 크게',sub:'파급력↑ · 지역 유지와 관계↓',fn:()=>{medNote(W,'imp',.1);if(it.ent)netUp(it.ent,-6);return fin();}});
    O.push({label:'그대로 출고',sub:'평범',fn:fin});}
  else if(t==='weekly'){title='5단계 · 커버스토리 분량';lede='주간지는 깊이로 승부한다. 확인된 팩트 3개 미만이면 데스크가 반려한다.';
    O.push({label:'8쪽 심층 기사로',sub:'필력이 높을수록 완성도↑',fn:()=>{W.mq=S.st.wri/10;medCount('cover');return fin();}});
    O.push({label:'한 주 더 묵혀 커버스토리로',sub:cov>=.75?'완성도↑↑ · 파급력↑ · 다른 매체가 먼저 칠 위험':'확인된 사실이 4분의 3은 돼야 한다',disabled:cov<.75,rec:cov>=.75,fn:()=>{W.mq=S.st.wri/8+4;S.hp=clamp(S.hp-6,0,100);if(chance(.25)){medNote(W,'imp',-.25);medNote(W,'note','묵히는 사이 일간지가 먼저 썼다. 커버스토리의 힘이 빠졌다.');}else{medNote(W,'imp',.1);medCount('cover');}return fin();}});
    O.push({label:'2쪽 단신으로 줄인다',sub:'파급력 -20%',fn:()=>{W.short=1;return fin();}});}
  else if(t==='online'||t==='sports'){title='5단계 · 송출 전략';lede=t==='online'?'인터넷 매체는 포털 노출이 생명이다.':'스포츠 팬은 경기 직후를 기다린다.';
    O.push({label:t==='online'?'출근 시간 7시에 송출':'경기 직후 바로 송출',sub:'조회수↑',fn:()=>{W.vm=1.3;return fin();}});
    O.push({label:'실시간 업데이트 기사로',sub:'조회수↑↑ · 완성도 조금↑ · 컨디션↓',disabled:S.hp<15,fn:()=>{W.vm=1.5;W.mq=1;S.hp=clamp(S.hp-5,0,100);medCount('live');return fin();}});
    O.push({label:'클릭 부르는 썸네일',sub:'조회수 크게↑ · 신뢰↓ · 포털 벌점 위험',risk:true,fn:()=>{W.vm=1.9;medNote(W,'trust',-.8);if(chance(.3))portalPen(1,'낚시 썸네일');return fin();}});
    if(t==='sports'&&it.tape)O.push({label:'선수 육성 인터뷰 붙이기',sub:'완성도 +8',fn:()=>{W.mq=8;return fin();}});
    O.push({label:'준비되는 대로 바로',sub:'평범',fn:fin});}
  else if(t==='eng'){title='5단계 · 외신 독자';lede='영문 기사는 외신과 주한 대사관이 읽는다.';
    O.push({label:'외신이 받아쓰게 영문 요약 송출',sub:'평판↑ · 조회수 조금↑',rec:!!it.excl,fn:()=>{W.vm=1.2;medNote(W,'fame',.6);medCount('relay',it.excl?R(3,12):0);if(it.excl)medNote(W,'note','외신 몇 곳이 기사를 인용했다.');return fin();}});
    O.push({label:'국내 사정 해설 박스 붙이기',sub:'상식이 높을수록 완성도↑',fn:()=>{W.mq=S.st.kno/12;return fin();}});
    O.push({label:'그대로 출고',sub:'평범',fn:fin});}
  else if(t==='trade'){title='5단계 · 업계 독자';lede='전문지 독자는 그 업계 사람들이다. 틀리면 바로 안다.';
    O.push({label:'업계 관계자 코멘트 보강',sub:okK('w')?'증언이 있어 완성도↑':'증언이 부족하다',rec:okK('w'),fn:()=>{W.mq=okK('w')?5:1;medCount('local');return fin();}});
    O.push({label:'유료 회원에게 먼저 공개',sub:'조회수↓ · 평판·신뢰 조금↑',fn:()=>{W.vm=.8;medNote(W,'fame',.5);medNote(W,'trust',.3);return fin();}});
    O.push({label:'그대로 출고',sub:'평범',fn:fin});}
  else return writeFinish(W);
  openModal(title,`${articlePreview(W)}<p>${lede}</p>`,O.concat(back));
}
function mediaMonth(lines){const M=S.mMed;S.mMed={};if(!M||S.story)return;const t=MED_G(OUT().type);const v=k=>M[k]||0;let x='';
  if(t==='wire'&&v('flash'))x=`이달 1보 ${v('flash')}건${v('relay')?` · 받아쓴 매체 ${v('relay')}곳`:''}`;
  else if(t==='tv'&&v('rep'))x=`이달 리포트 ${v('rep')}건${v('live')?` · 생방송 연결 ${v('live')}번`:''}`;
  else if(t==='daily'&&v('paper'))x=`이달 아침 지면 단독 ${v('paper')}건`;
  else if(t==='econ'&&v('market'))x=`이달 기사로 주가가 움직인 기업 ${v('market')}곳`;
  else if(t==='weekly'&&v('cover'))x=`이달 커버스토리·심층 ${v('cover')}건`;
  else if(t==='local'&&v('local'))x=`이달 주민 목소리 담은 기사 ${v('local')}건`;
  else if(t==='trade'&&v('local'))x=`이달 업계 코멘트를 보강한 기사 ${v('local')}건`;
  else if(t==='eng'&&v('relay'))x=`이달 외신 인용 ${v('relay')}곳`;
  else if((t==='online'||t==='sports')&&v('live'))x=`이달 실시간 업데이트 기사 ${v('live')}건`;
  if(x)lines.push({c:'g',t:x});}

const it2=(c,s)=>c?s:'녹취가 없다';
// 지면: 아침 발제 배정이 있으면 그 배정을 따른다(완성도가 너무 낮으면 데스크가 한 단계 내린다). 배정 없이 쓴 기사는 1면 톱에 오르기 아주 어렵다
function secTop(d){const n=(DEPTS[d]||{}).n||'';if(/주재/.test(n))return '지역면 톱';const b=n.replace(/(부|팀|국)$/,'');return ({사건:'사회',법조:'사회',전국:'전국',시군:'지역',자치행정:'지역',탐사보도:'기획',탐사:'기획'}[b]||b||'종합')+'면 톱';}
function placeOf(q,imp,it){const v=q*imp/100;const tv=isTV();const P=(S&&S.outlet)?OUT().p:3;const rf=S&&S.clips?S.clips.filter(c=>c.turn>S.turn-12&&/1면|첫 꼭지/.test(c.place||'')).length:0;const fT=40+P*2.5+rf*8,oT=28+P*2+rf*4;
  const web=!tv&&S&&S.outlet&&OUT().type==='online';const FR={k:'front',n:tv?'메인뉴스 첫 꼭지':web?'홈페이지 메인 톱':'1면 톱'},ONE={k:'one',n:tv?'메인뉴스':web?'홈페이지 메인':'1면'},TOP={k:'top',n:tv?'메인뉴스 리포트':web?secTop(it&&it.d||S.dept).replace('면 톱',' 섹션 톱'):secTop(it&&it.d||S.dept)},SEC={k:'sec',n:tv?'아침뉴스':web?'섹션 기사':'종합면'},BR={k:'brief',n:tv?'단신 리포트':'단신'},WEB={k:'web',n:'온라인 단신'};
  const sl=it&&it.slot&&it.slot.due>=S.turn?it.slot.g:null;
  if(sl==='front')return q>=45?FR:q>=32?ONE:TOP;
  const ex=!!(it&&it.excl);
  if(sl==='top')return ex&&v>=fT-2&&q>=55?ONE:q>=40?TOP:SEC;
  if(sl==='brief')return (v>=oT-8||(ex&&v>=oT-18&&q>=45))?TOP:v>=20?SEC:BR;
  if(ex&&v>=fT)return FR;if(v>=oT+2)return ONE;if(v>=oT-8||(ex&&v>=oT-16&&q>=45))return TOP;if(v>=12)return SEC;return WEB;}
function comments(q,W,risky){
  const G=['이런 게 기자지','끝까지 추적해 주세요','후속 기대합니다','기레기 소리 듣는 와중에 이런 기사 고맙다','관계 당국은 답하라','이거 우리 동네 얘기네','기자 이름 기억해 둔다'];
  const B=['제목 낚시 그만','제목 보고 들어왔는데 내용이 없네','어그로 그만 끄세요'];
  const Wk=['팩트가 부족한 거 아님?','이걸 기사라고','근거가 뭔데'];
  const L=['또 편파 기사네','한쪽 얘기만 듣냐','이 매체 논조 뻔하지'];
  const out=[];
  if(W.head==='bait')out.push(pick(B));
  if(q<40||risky)out.push(pick(Wk));
  if(W.it.ideo&&W.angle!=='neu')out.push(pick(L));
  if(!W.rb)out.push('반론은 왜 없음?');
  while(out.length<3)out.push(pick(G));
  return shuffle(out).slice(0,3);
}
function writeFinish(W){
  const o=OUT(),it=W.it,st=S.st;
  const inc=W.sel.map(i=>it.facts[i]),ver=inc.filter(fOK),unv=inc.filter(f=>!fOK(f));
  const allW=it.facts.reduce((a,f)=>a+fw(f),0);
  let q=3+st.wri*.5+st.inv*.15+ver.length/Math.max(1,it.facts.length)*22+ver.length+R(-6,6)+(W.mq||0)+(W.ex?5:0)+(W.rb&&it.rebut==='got'?4:0)+(it.tape?4:0)+((it.quote||it.wq)?2+(st.int||30)/25:0)+(it.photo?2:0)+(it.prR?3:0)+(isTV()?(st.brd-40)/6:0);
  q+=W.leadOK?5:-2;q+=trSum('q');if(trSum('writeHp'))S.hp=clamp(S.hp-trSum('writeHp'),0,100);if(W.lead==='key'&&!W.leadOK)q-=3;if(S.peerRev){q+=S.peerRev.b;log(`${jo2(S.peerRev.n,'이','가')} 원고를 봐 줬다 (완성도 +${S.peerRev.b})`);S.peerRev=null;}
  const notes=[];try{exclShare(it,W,notes);}catch(e){}
  if(it.ideo){const L=leanOf(it);
    if(L==='neu'){if(W.angle==='neu'){q+=5;notes.push('데스크: "균형 잘 잡았네."');}else{q-=4;notes.push('데스크: "한쪽으로 기울었어. 반론 보강해."');}}
    else if(W.angle===L){q+=6;notes.push('데스크: "우리 색깔에 딱 맞네."');}
    else if(W.angle==='neu')notes.push('데스크: "무난한데 힘이 없다."');
    else{q-=12;notes.push('데스크: "이거 우리 논조랑 정반대잖아." 기사가 대폭 손질됐다.');}}
  else{if(W.angle==='ex')q+=st.kno*.12-2;if(W.angle==='re'){q+=it.facts.some(f=>f.k==='s'&&fOK(f))?7:-3;S.hp=clamp(S.hp-5,0,100);}if(W.angle==='iv'){q+=ver.length>=3?9:-6;}
    const okK=k=>it.facts.some(f=>f.k===k&&fOK(f));if(W.angle==='hu')q+=okK('w')?6:-3;if(W.angle==='da')q+=okK('n')?5+(st.kno||40)*.03:-5;if(W.angle==='li')q+=LIFE_D.test((DEPTS[it.d]||{}).n||'')?4:-2;
    const best=yamaOf(it);if(W.angle===best){q+=6;W.yamaHit=1;notes.push(pick(['데스크: "야마 제대로 잡았네."','데스크: "이 기사는 이렇게 가는 게 맞지."','데스크: "방향 좋다. 제목도 이 야마로 뽑자."']));}
    else if(it.imp>=40&&chance(.6)){q-=2;notes.push(`데스크: "야마가 아쉬워. 이건 ${ro2(YAMA_N[best])} 갔어야 더 컸어."`);}}
  if(!W.rb){if(it.pos){q-=2;notes.push('데스크: "회사 측 코멘트 하나는 붙이지."');}else{q-=5;notes.push('데스크: "반론 받았어? 없으면 위험해."');}}
  if(o.type==='eng'){q+=st.lng*.3-12;notes.push('영문 기사라 어학이 완성도를 좌우했다.');}
  if(o.type==='weekly'&&ver.length<3&&!W.short){q*=.7;notes.push('데스크: "주간지에 이 정도 팩트로는 부족해."');}
  const QF=quoteFx(W);q+=QF.q+(W.craft&&W.head!=='bait'?2:0);
  if(W.md&&W.md.q)q+=W.md.q;try{q+=trSum('q')+spec2Q(it,W)+rtWriteQ(it,W);if(trSum('writeHp'))S.hp=clamp(S.hp-trSum('writeHp'),0,100);}catch(e){}q=clamp(Math.round(q),5,100);
  const slotM=it.slot&&it.slot.due>=S.turn?SLOT[it.slot.g].m:1;
  let imp=it.imp*(.4+ver.reduce((a,f)=>a+fw(f),0)/allW*.75+unv.length*.12)*(it.excl?1.45:1)*(.7+o.p*.1)*slotM*(W.yamaHit?1.08:1)*(W.angle==='li'&&LIFE_D.test((DEPTS[it.d]||{}).n||'')?1.05:1);
  if(W.speed)imp*=1.08+S.st.spd/600;if(W.short)imp*=.8;if(W.md&&W.md.imp)imp*=1+W.md.imp;if(W.adTone==='soft'){imp*=.72;notes.push('광고주를 의식해 표현을 다듬었다. 기사가 무뎌졌다.');}imp*=QF.i;{let pr=null;try{pr=spPre(it,W,notes);}catch(e){}if(pr){imp*=pr.k||1;if(pr.qc)q=Math.min(q,pr.qc);}}imp=Math.round(clamp(imp,1,130));if(it.dud&&!it.dudShown){imp=Math.max(5,Math.round(imp*.4));notes.push('기사가 나갔는데 반응이 없다. 알고 보니 이미 해명된 일이었다.');}
  const mult=(W.head==='bait'?(o.type==='online'?2.2:1.5):W.head==='calm'?.8:({quote:1.2,num:1.1,ask:1.25}[W.head]||1))*(W.vm||1)*QF.v*valViews()*(1+S.st.hed/180);if(W.head!=='bait')q=Math.min(100,q+Math.round(S.st.hed/15));
  const views=Math.round(q*imp*(o.p+1)*mult*R(8,14)/10*portalMult());if(W.head==='bait')portalPen(1,'자극적 제목');
  const keySingle=inc.some(f=>f.key&&f.conf===1);
  let risk=trMul('risk')*(eraHas('medialaw')?1.15:1)*(hasF('fact')?.8:1)*(1-S.st.ver/250)*(unv.reduce((a,f)=>a+fw(f)*(f.conf?.5:1),0)*.11+(keySingle?.04:0)+(!W.rb?(it.pos?.01:.035):0)+(W.lead==='key'&&!W.leadOK?.04:0)+(it.hoax?.5:0)+((W.md&&W.md.risk)||0))*DF().risk;
  const ph=colBy('photo'),ed=colBy('editor');if(ph&&ph.rel>=40){q=Math.min(100,q+3);notes.push(`${ph.name} ${jo2(colRole(ph),'이','가')} 좋은 ${jo2(isTV()?'그림':'컷','을','를')} 건졌다.`);}if(ed&&ed.rel>=40&&!isTV()){q=Math.min(100,q+2);notes.push(`편집기자 ${jo2(ed.name,'이','가')} 제목을 살려 줬다.`);}
  const place=placeOf(q,imp,it);
  gain('hed',.3);gain('spd',.2);if(isTV())gain('brd',.2);
  const fx={eval:q/34+(it.excl?(imp>=75?3:imp>=58?2:1.2):0)+(place.k==='front'?1.5:place.k==='one'?.6:place.k==='top'?.3:0)-(q<35?2:0),fame:Math.min(imp,100)/55+(it.excl?.8:0)+(place.k==='front'?1.2:0)+((W.md&&W.md.fame)||0),wri:.6,inv:.2};if(W.md&&W.md.trust)fx.trust=(fx.trust||0)+W.md.trust;if(W.md&&W.md.note)notes.push(W.md.note);
  // 5.7 보상 차등: 아이템 급이 클수록 더, 확인한 사실이 많을수록 더 (덜 확인하고 쓰면 보상이 깎인다)
  {const gr=gradeOf(it),cov=ver.reduce((a,f)=>a+fw(f),0)/Math.max(1,allW);fx.eval+=({B:.3,A:.8,S:1.4}[gr]||0)*(it.excl?1.3:1);fx.fame+=({B:.3,A:.8,S:1.6}[gr]||0)*(it.excl?1.3:1);
   fx.eval*=.65+.35*cov;fx.fame*=.6+.4*cov;if(cov<.5)notes.push('데스크: "확인된 게 절반도 안 되잖아. 다음엔 더 파 와."');else if(cov>=.99&&(gr==='A'||gr==='S'))notes.push('데스크: "빈틈이 없다. 이게 기사지."');}
  try{toneFx(it,fx,notes,ver,unv,W);}catch(e){console.error(e);}
  if(it.slot){if(it.slot.due>=S.turn){fx.eval+=1;notes.push(`발제대로 ${SLOT[it.slot.g].n}에 맞춰 출고했다.`);}}
  if(W.head==='bait'){fx.trust=-3;S.flags.bait=(S.flags.bait||0)+1;}else if(W.head==='honest')fx.trust=.8;else if(W.head==='ask')fx.trust=-.6;else if(W.head==='quote'||W.head==='num')fx.trust=.4;if(W.head==='num')q=Math.min(100,q+2);if(W.headY)q=Math.min(100,q+(W.angle===it.yama?4:1));
  if(o.type==='eng')fx.lng=.5;
  if(it.jt){fx.eval*=.85;fx.fame*=.85;notes.push(`${DEPTS[it.jt.d]?DEPTS[it.jt.d].n:'옆 부서'} ${it.jt.who} 기자와 함께 쓴 공동 취재 기사다. 보상은 나눴지만 확인은 탄탄했다.`);try{const mm=(roster()[it.jt.d]||[]).find(x=>x.name===it.jt.who);if(mm){mm.rel=clamp((mm.rel||0)+4,-100,100);mm.skill=clamp((mm.skill||50)+.5,0,95);}}catch(e){}}
  if(QF.t)fx.trust=(fx.trust||0)+QF.t;
  if(unv.length){fx.trust=(fx.trust||0)-(.4+.3*Math.min(3,unv.length));fx.fame=(fx.fame||0)+.3*Math.min(3,unv.length);notes.push(`확인 안 된 사실 ${unv.length}개를 넣었다. 기사는 커졌지만 독자의 신뢰가 깎였다.`);}
  try{valWrite(W,it,ver,unv);}catch(e){}
  spend(1,10);const txt=apply(fx);
  if(it.jt)risk*=.8;
  risk+=QF.r;try{risk*=valRisk()*trMul('risk')*rtRisk();}catch(e){}if(chance(risk))S.pending.push({type:'err',title:W.headline,due:S.turn+R(1,4),why:errWhy(it,W,inc,unv)});
  S.items=S.items.filter(x=>x!==it);
  const rbText=W.rb?(it.rebut==='got'?` ${String(it.subj||'당국').replace(/ 측$/,'')} 측은 "${pick(it.pos?IVL_POS.got:IVL.rebutGot).replace(/"/g,'')}"라고 ${it.pos?'밝혔다':'해명했다'}.`:` ${String(it.subj||'당국').replace(/ 측$/,'')} 측은 답변하지 않았다.`):'';
  if(!W.leadText)W.leadText=((it.facts.find(f=>f.key&&fOK(f))||it.facts.find(fOK)||it.facts[0]||{}).t)||it.title;const restV=ver.filter(f=>f.t!==W.leadText).map(f=>f.t).join(', ');const lead=[W.leadText,restV,unv.length?`일각에선 ${jo2(unv.map(f=>f.t).join(', '),'이라는','라는')} 주장도 나온다`:''].filter(Boolean).join('. ')+'.'+(W.ex?' 전문가는 제도적 보완이 시급하다고 지적했다.':'')+rbText;
  const portal=portalRank(imp,q,it.excl,gradeOf(it),mult,o.p);
  const cm=commentsV2(q,W,unv.length>0,it,imp,place);
  const follow=!it.pos&&imp>=38&&(it.chain||0)<Math.min(3,FOLLOW_MAX)&&!S.items.some(x=>x!==it&&fBase(x.title)===fBase(it.title))&&chance(.65);
  const others=it.excl&&imp>=45?R(2,9):0;
  const clip={ang:W.angle,bait:W.head==='bait',pos:!!it.pos,crit:!it.pos&&CRIT_RE.test(W.headline||it.title||''),fac:(typeof facOf==='function'?facOf(it):null),adv:!!it.adv,iid:it.id,rb:!!(W.rb&&it.rebut==='got'),h:W.headline,o:o.n,d:it.d,q,imp,excl:it.excl,date:dateShort(),turn:S.turn,views,lead,by:S.name,coBy:it.jt?it.jt.who:'',place:place.n,portal,base:it.base,chain:it.chain,quote:W.qt?W.qt.q:(it.quote||(it.wq&&it.wq.q)||''),qsrc:W.qt?W.qt.who:(it.quote?`${it.subj||'관계자'} 녹취`:(it.wq?it.wq.who:'')),photo:it.photo||''};
  if(it.lawyer&&it.rebut!=='got'&&chance(.35*it.lawyer))S.pending.push({type:'suit',ent:it.ent,due:S.turn+R(2,5),title:W.headline});
  S.clips.unshift(clip);if(S.clips.length>60)S.clips.pop();if(S.founder&&S.co){const k=clamp(imp/50,.4,1.8)*(q/60);S.co.bS+=(.003+(it.excl?.006:0))*k;S.co.bT+=(.006+(it.excl?.012:0))*k;S.co.q=clamp(S.co.q+(it.excl?.6:.2),10,100);}try{medCheck(it,clip,unv.length,W);itemFromCredit(it);}catch(e){}try{opPublished(it,clip);}catch(e){}try{afterRecord(it,clip,W,unv.length);}catch(e){}try{spPub(it,clip,place);}catch(e){}try{v12Pub(it,clip,W);oidPub(it,clip);oidPub2(it,clip);if(CRIT_RE.test(it.title||'')){const f=facOf(it);if(f){S.watchHit=S.watchHit||{};S.watchHit[f]=(S.watchHit[f]||0)+1;}}}catch(e){}try{orderCheck(it);}catch(e){}try{flawTag(it,clip,unv,W);if(clip.fl&&(S.medQ||[]).some(m=>m.h===clip.h))clip.flDone=1;}catch(e){}
  S.weekArticles++;S.monthQ.push(q);S.totalArticles=(S.totalArticles||0)+1;if(it.excl)S.scoops++;if(/1면|첫 꼭지/.test(place.n||''))S.frontN=(S.frontN||0)+1;
  ach('first');if(it.excl)ach('scoop');if(place.k==='front')ach('front');if(it.chain>=2)ach('series');if(S.totalArticles>=100)ach('hundred');
  if(it.excl&&S.rival&&it.heat<=2)ach('rival');
  tick(`[${o.n}] ${W.headline}`,1);
  if(others)tick(`타사 ${others}곳, ${o.n} 보도 인용해 후속 보도`);
  log(`출고: ${W.headline} (완성도 ${q}, 파급력 ${imp}, ${place.n})`);
  const entNote=entHit(it,W,imp);
  if(it.story){S.xfile=Math.max(S.xfile||0,it.story);if(it.story<3)S.storyNext={n:it.story+1,due:S.turn+R(10,16)};if(it.story===1&&S.net&&S.net.c4)S.net.c4.cut=16;}
  if(follow&&!it.story)S.items.push(followUp(it,clip));
  const grade=scoopGrade(it,imp,q,ver.length);try{const gb=gradeBonus(grade);if(gb)notes.push(gb);}catch(e){}const react=it.excl?scoopReact(it,imp,grade):'';const sLines=[];try{scoopAfter(grade,it,sLines);}catch(e){}if(sLines.length)notes.push(...sLines);const brk=!it.excl&&W.speed;if(grade==='대특종'){S.bigScoops=(S.bigScoops||0)+1;tick(`[${o.n}] [대특종] ${W.headline.replace('[단독] ','')}`,1);}
  openModal(it.excl?`${grade} 출고!`:brk?'속보 출고!':'출고 완료',`${grade?scoopBanner(grade):brk?scoopBanner('속보'):''}${isTV()&&['front','one'].includes(place.k)?pageHTML(clip,place):(['front','one','top'].includes(place.k)?paperHTML(clip,OUT().type==='online'?'web':place.k==='top'?'sec':'front'):'')+(isTV()?'':(['front','one'].includes(place.k)&&!IMG.paper_front?pageHTML(clip,place):clipHTML(clip)))}${react}<div class="kv"><div><span>지면</span><b style="font-size:14px">${place.n}</b></div><div><span>완성도</span><b>${q}</b></div><div><span>파급력</span><b>${imp}</b></div><div><span>${isTV()?'클립 조회수':'조회수'}</span><b>${views.toLocaleString('ko-KR')}</b></div><div><span>포털 많이 본 뉴스</span><b>${portal>50?'순위권 밖':portal+'위'}</b></div></div>
   ${cmHTML(cm)}
   ${notes.map(n=>`<p style="margin-top:8px">${n}</p>`).join('')}${others?`<p>타사 ${others}곳이 받아썼다.</p>`:''}${entNote?`<p class="warn" style="color:var(--sodium)">${entNote}</p>`:''}${follow?'<p class="fx">후속 취재 아이템이 생겼다.</p>':''}${fxLine(txt)}${risk>.12?'<p class="warn">확인이 덜 된 부분이 있다. 후폭풍이 올 수도 있다.</p>':''}`);cmBind();
}
function scoopReact(it,imp,grade){const cn=(S.comp||[]).map(c=>OUTLETS.find(x=>x.id===c.id).n);const lines=[];
  const n=R(2,6)+(grade==='대특종'?6:grade==='특종'?3:0);lines.push(`${n}개 매체가 "${OUT().n} 보도에 따르면"으로 받아썼다${cn.length?` (${shuffle(cn).slice(0,2).join(', ')} 등)`:''}.`);
  if(imp>=50)lines.push(pick(['포털 메인 화면에 반나절 걸렸다.','실시간 검색어 1위에 올랐다.','방송 저녁 뉴스들이 인용 보도했다.']));
  if(grade!=='단독')lines.push(pick(it.pos?['경쟁사들이 앞다퉈 후속 취재에 나섰다.',`${String(it.subj||'').replace(/ 측$/,'')} 검색량이 하루 새 크게 뛰었다.`,'업계 단체가 기사를 회원사에 돌렸다.']:[`${String(it.subj||'당국').replace(/ 측$/,'')} 측이 긴급 회의를 열었다는 말이 돈다.`,'국회 상임위에서 의원들이 기사를 들고 질의했다.','감독 당국이 실태 조사에 착수했다.','수사기관이 내사에 들어갔다는 소식이다.']));
  if(grade==='대특종')lines.push((S.rank>=6?'기자들이':'편집국장이')+' "이번 달 기자상 후보로 올리자"고 했다. 후속 보도가 이어지면 더 커진다.');
  if(it.excl&&S.st.brd>=50&&!isTV()){apply({fame:.5});lines.push('방송사 시사 프로그램에서 패널 출연 요청이 왔다. (방송감 · 평판↑)');}
  if(S.rival&&grade!=='단독')lines.push(S.rival.pub?`${jo2(rvLabel(),'이','가')} 업계 단톡방에 "축하합니다"라고만 남겼다.`:`라이벌 ${S.rival.name} 기자가 "이번엔 졌다"는 문자를 보냈다.`);
  return `<ul class="feed">${lines.map(l=>`<li class="g">${esc(l)}</li>`).join('')}</ul>`;}
function clipHTML(c,sm){return `<div class="clip${sm?' sm':''}"><div class="mh"><b>${esc(c.o)}</b><span>${DEPTS[c.d].n} · ${c.date}${c.place?' · '+c.place:''}</span></div><h4>${esc(c.h)}</h4><p>${esc(c.lead)}</p>${clipQuote(c)}<div class="by">${esc(byN(c.by||S.name))}${c.coBy?` · ${esc(c.coBy)}`:''} 기자${c.excl?' · 단독':''}${c.coBy?' · 공동 취재':''}</div></div>`;}