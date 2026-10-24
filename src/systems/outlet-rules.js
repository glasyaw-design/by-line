/* 바이라인 1.6 — src/systems/outlet-rules.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 정식 1.0 특수 매체: 전문지·스포츠지·연예지는 저마다 다른 규칙으로 일한다 =====
const SPM_OF={edujournal:'edu',uiyak:'med',jeonja:'tech',beopjeong:'law',skysports:'sports',sportsnuri:'sports',dailystar:'star',starlounge:'star'};
const SPM={
 edu:{n:'입시 달력',meter:'학부모 신뢰',act:'학부모 메일함',ic:'book',d:'학부모 편지에 답하고 입시 달력에 맞춰 판다',
  rule:'일 년이 입시 달력대로 돈다. 3월 새 학기, 6월 모의평가, 9월 수시 원서, 11월 수능, 2월 합격 발표. 학부모 신뢰가 곧 평가다. 학원 광고는 달콤하지만 신뢰를 갉아먹는다.'},
 med:{n:'엠바고',meter:'업계 접근권',act:'엠바고 자료 받기',ic:'shield',d:'제약사·학회의 엠바고 자료를 받는다. 지킬지 깰지는 내 몫',
  rule:'제약사와 학회는 결과를 엠바고(보도 유예)로 미리 준다. 지키면 해제일에 모든 매체가 같이 쓰지만 접근권이 쌓이고, 깨면 단독이지만 그 회사는 1년 동안 자료를 끊는다. 봄·가을엔 학회 시즌이 온다.'},
 tech:{n:'공급망 지도',meter:'업계 신뢰',act:'협력사 라인 타기',ic:'link',d:'소재·부품·모듈 협력사를 돌아 신제품의 퍼즐을 맞춘다',
  rule:'세트 업체는 입을 닫는다. 대신 소재사·부품사·모듈사 세 고리를 다 맞추면 신제품 사양 단독이 나온다. 출시가 먼저 되면 퍼즐은 날아간다. 1월·3월·9월엔 해외 전시회, 분기마다 실적 시즌이 온다.'},
 law:{n:'판결문 서고',meter:'법조계 평판',act:'판결문 서고 뒤지기',ic:'gov',d:'하루 수백 건의 판결문 속에서 판례가 바뀌는 한 건을 찾아낸다',
  rule:'독자는 판사·검사·변호사다. 평범한 판결과 판례를 바꾸는 판결을 가려내는 눈이 실력이다. 2월·8월엔 법원·검찰 정기 인사, 연말엔 올해의 판결을 뽑는다. 로펌 기고 청탁은 광고와 평판 사이의 줄타기다.'},
 sports:{n:'시즌과 이적 시장',meter:'구단 출입',act:'에이전트 전화 돌리기',ic:'trophy',d:'에이전트 라인에서 이적설을 받는다. 터뜨릴지 묵힐지',
  rule:'달력이 시즌대로 돈다. 3월 개막, 7월 올스타와 여름 이적 시장, 10월 포스트시즌, 11월부터 스토브리그. 이적설은 맞으면 대박, 틀리면 구단 출입이 막힌다.'},
 star:{n:'커버와 잠복',meter:'기획사 관계',act:'잠복 취재',ic:'camera',d:'스타의 동선을 쫓는다. 찍은 걸 낼지, 기획사와 거래할지',
  rule:'매달 커버(화보) 스타를 고른다. 톱스타는 기획사 관계가 있어야 잡히고, 신인은 싸지만 언젠가 크게 뜰 수 있고, 논란 스타는 잘 팔리지만 신뢰가 깎인다. 잠복 취재로 찍은 사진은 단독이 될 수도, 기획사와의 거래 카드가 될 수도 있다.'}
};
function spmV(dv){const P=spmS();if(!P)return;P.v=clamp(P.v+dv,0,100);if(P.v>=80)ach('spm');}
function spmLbl(){const P=spmS();if(!P)return '';const v=Math.round(P.v);return `${SPM[P.m].meter} ${v}`;}
// 특수 매체 전용 아이템: 제목과 확인할 사실이 그 매체의 일에 맞게 나온다
function spItem(d0,t,o={}){const it=makeItem(d0,{excl:!!o.excl});const f=filler(vars());const fx=s=>f(String(s).replace(/\{(\w+)\}/g,(x,k)=>o.v&&o.v[k]!=null?o.v[k]:x));
  const ti=fx(t[0]),sj=fx(t[2]);const facts=parseFacts(t[3],fx);const imp=Math.round(t[1]*(o.mult||1)*(.92+Math.random()*.16));try{factsFor(facts,gradeOf({imp,excl:!!o.excl}),fx,it.d);}catch(e){}
  for(let i=0;i<(o.pre||0);i++){const c=facts.filter(x=>!fOK(x)&&!x.key);if(c.length){const x=pick(c);x.conf=x.need;x.via.push(o.via||'자료');}}
  Object.assign(it,{title:ti,base:t[0],subj:sj,facts,imp,excl:!!o.excl,exclLost:0,hoax:!!o.hoax,dud:false,src:o.src||'',co:[]});try{it.ent=findEnt(ti,sj,it.d);}catch(e){}return it;}
function spAdd(it,how){S.items.push(it);try{itemFound(it,how);}catch(e){toast(how+' → 「'+it.title+'」');}}
function spOnce(k){const P=spmS();const key=k+':'+years();if(P.ev[key])return false;P.ev[key]=1;return true;}

// ---- 교육저널: 학부모 메일함 ----
const EDU_TIP=[['「우리 아이 학교 시험지가 미리 돌았대요」','{univ} 부속고 내신 시험지 사전 유출 의혹',64,'{univ} 부속고','w:*학부모 "시험 전날 답이 돌았다"|d:학교 시험 관리 대장|n:만점자 {n}명 몰려|w:교사 "인쇄실 관리가 허술했다"'],
 ['「학원 강사가 출제 교사래요」','현직 교사, 학원 문제집 몰래 집필 정황',60,'교육청','d:*출판 계약서 사본|w:학원 관계자 "선생님이 직접 썼다"|n:같은 문항 {n}개 겹쳐|s:학원가 현장 확인'],
 ['「돌봄교실이 갑자기 없어졌어요」','초등 돌봄교실 예고 없이 축소',42,'{city} 교육지원청','d:*교육청 공문|w:학부모 "맞벌이는 어쩌라고"|n:대기 아동 {n}명|s:학교 현장 확인'],
 ['「특목고 입시에 이상한 가산점이 있어요」','{city} 자사고 입학 전형 숨은 가산점 논란',58,'{city} 교육청','d:*전형 세부 기준표|n:가산점 받은 합격자 {n}명|w:탈락 학부모 "기준이 바뀌었다"|w:학교 "규정대로"']];
const EDU_Q=['수시 원서 여섯 장, 어떻게 나눠 써야 하나요?','고교학점제, 우리 아이는 뭘 골라야 하죠?','정시 확대, 내신은 이제 버려도 되나요?','의대 증원, 지금 고1에게 무슨 뜻인가요?','학원 안 보내면 정말 뒤처지나요?','자사고와 일반고, 대입에서 얼마나 차이 나나요?'];
const EDU_AD=['○○ 입시학원','△△ 에듀','대치 □□ 학원','◇◇ 러닝','☆☆ 컨설팅'];
function spEdu(){const P=spmS();const tip=pick(EDU_TIP),q=pick(EDU_Q),ad=pick(EDU_AD);
  openModal('학부모 메일함',`<p class="lede">오늘 아침 메일함. 답장할 수 있는 건 하나뿐이다.</p><p class="hint">학부모 신뢰 ${Math.round(P.v)} · 학원 광고 의존 ${Math.round(P.ac)}</p>`,[
   {label:`제보 메일 ${tip[0]}`,sub:'학교 비리 제보 · 단독 가능성 · 확인이 필요하다',fn:()=>{spend(1,4);setCd('spx');if(chance(.55+P.v/250)){const it=spItem(S.dept,tip.slice(1),{excl:chance(.45+P.v/300),pre:1,via:'학부모 제보',src:'학부모 제보'});spAdd(it,'학부모 메일 한 통이 걸렸다');spmV(2);}else{toast('보낸 사람과 연락이 끊겼다. 다음 메일을 기다리자');spmV(.5);}}},
   {label:`질문 메일 「${q}」`,sub:'해설 기사로 답한다 · 학부모 신뢰↑ · 조회수',fn:()=>{spend(1,3);setCd('spx');gain('kno',.4);const fx=quickClip(`[입시 Q&A] ${q.replace(/\?$/,'')}…전문가에게 물었다`,S.st.wri*.4+S.st.kno*.4+18,R(16,30));spmV(4);toast('해설 기사가 학부모 커뮤니티에 퍼졌다 · '+fx);}},
   {label:`${ad} 「설명회 기사 좀 내 주세요」`,sub:'광고 집행 약속 · 평가↑ · 학부모 신뢰↓ · 광고 의존↑',fn:()=>{spend(1,2);setCd('spx');valN('ind',-3,'학원 홍보 기사를 써 줬다');P.ac=clamp(P.ac+12,0,100);spmV(-5);toast(`광고국이 반겼다. 독자 게시판엔 "이거 광고죠?" · `+apply({eval:1.4,trust:-.8}));}},
   {label:'닫는다',cls:'ghost'}]);}
function spEduMonth(lines){const P=spmS(),m=month();if(P.ac>0){P.ac=Math.max(0,P.ac-2);if(P.ac>=30)spmV(-P.ac/40);}
  if(m===3&&spOnce('edu3'))Q.push(()=>openModal('새 학기 · 교실 현장',`<p class="lede">3월. 학부모들이 가장 많이 검색하는 달이다. 어디서 첫 기획을 시작할까.</p>`,[
   {label:'교사 열 명 심층 인터뷰',sub:'체력↓ · 학부모 신뢰↑ · 아이템',fn:()=>{spend(0,8);spmV(5);const it=makeItem(S.dept,{pre:1,mult:1.05});spAdd(it,'교사들의 이야기에서 기사가 나왔다');}},
   {label:'교육청 보도자료로 빠르게',sub:'안전 · 확인된 사실 둘',fn:()=>{const it=makeItem(S.dept,{pre:2,mult:.8,excl:false});spAdd(it,'보도자료에서 골랐다');}}]));
  if(m===6&&spOnce('edu6'))Q.push(()=>openModal('6월 모의평가 분석',`<p class="lede">모의평가가 끝났다. 학원들이 벌써 분석 자료를 뿌리고 있다.</p>`,[
   {label:'학원 분석 받아 빠르게 쓴다',sub:'조회수 · 평가↑ · 틀리면 신뢰↓',fn:()=>{const ok=chance(.6);const fx=quickClip('6월 모평 난이도 분석…"작년 수능보다 어려웠다"',S.st.spd*.5+30,R(20,32));spmV(ok?1:-6);toast(ok?'빠르게 나갔고 크게 틀리지 않았다 · '+fx:'학원 추정치가 빗나갔다. 정정 요청 메일이 쏟아졌다 · '+fx);}},
   {label:'입시 전문가 좌담으로 천천히',sub:'체력↓ · 학부모 신뢰↑↑',fn:()=>{spend(0,6);spmV(6);toast('늦었지만 "여기 분석이 제일 정확하다"는 댓글이 달렸다 · '+apply({eval:.8}));}}]));
  if(m===9&&spOnce('edu9'))Q.push(()=>openModal('수시 원서 접수 시즌',`<p class="lede">학원 연합이 "공동 입시 설명회"를 같이 열자고 한다. 광고비가 크다.</p>`,[
   {label:'공동 설명회를 연다',sub:'평가↑↑ · 광고 의존↑↑ · 학부모 신뢰↓',fn:()=>{P.ac=clamp(P.ac+18,0,100);spmV(-5);toast('강당이 꽉 찼다. 광고국은 웃었다 · '+apply({eval:2.2}));}},
   {label:'학부모 무료 설명회를 따로 연다',sub:'체력↓↓ · 학부모 신뢰↑↑ · 평판↑',fn:()=>{spend(0,10);spmV(8);toast('주말 내내 질문을 받았다 · '+apply({fame:1.2}));}}]));
  if(m===11&&spOnce('edu11'))Q.push(()=>openModal('수능 특별판 · 등급컷 예측',`<p class="lede">수능이 끝났다. 오늘 밤 가장 많이 검색될 단어는 "등급컷"이다. 누구 숫자를 믿을까.</p>`,[
   {label:'대형 학원 추정치를 받아 쓴다',sub:'빠르고 쉽다 · 빗나가면 신뢰↓',fn:()=>{const ok=chance(.62);const fx=quickClip('[수능] 국어 1등급 컷 예상…대형 학원 추정치 공개',40+S.st.spd*.3,R(30,45));spmV(ok?1:-8);toast((ok?'큰 차이 없이 맞았다 · ':'실제 컷과 크게 달랐다. 학부모 항의가 빗발쳤다 · ')+fx);}},
   {label:'가채점 데이터로 직접 분석한다',sub:'체력↓↓ · 상식·데이터가 높을수록 정확 · 맞으면 크게 인용된다',risk:true,fn:()=>{spend(0,12);const p=clamp(.35+(S.st.kno+S.st.dat)/250+P.v/400,.3,.9);if(chance(p)){spmV(10);const fx=quickClip('[수능] 자체 가채점 분석…"국어 1등급 컷, 학원 예상보다 높다"',55+S.st.dat*.3,R(40,55));toast('발표된 실제 컷과 거의 같았다. 방송사들이 우리 분석을 인용했다 · '+fx+' · '+apply({fame:2.5,eval:1.5}));}else{spmV(-6);toast('분석이 빗나갔다. "전문지가 이 정도냐"는 댓글 · '+apply({eval:-1}));}}},
   {label:'예측은 하지 않고 해설만 쓴다',sub:'안전 · 학부모 신뢰 조금↑',fn:()=>{spmV(3);toast(quickClip('수능 이후 2주, 꼭 챙길 일정 다섯 가지',S.st.wri*.4+30,R(18,26)));}}]));
  if(m===2&&spOnce('edu2')&&chance(.5+P.v/200))Q.push(()=>openModal('합격자 발표 · 추가 합격',`<p class="lede">추가 합격 시즌. 신뢰가 쌓인 학부모들이 이상한 합격 사례를 제보해 왔다.</p>`,[{label:'제보를 받는다',sub:'입시 비리 단독 아이템',fn:()=>{const it=spItem(S.dept,['{univ} 추가 합격자 명단 뒤바뀐 정황',66,'{univ}','d:*합격자 명단 원본|w:탈락 수험생 "순위가 바뀌었다"|n:순위 바뀐 지원자 {n}명|w:대학 "단순 전산 오류"'],{excl:true,pre:1,via:'학부모 제보',src:'학부모 제보'});spAdd(it,'학부모 제보가 단독이 됐다');}}]));}

// ---- 의약신보: 엠바고 ----
const MED_CO=['한결제약','누리바이오','가람약품','새벽파마','대한바이오로직스','동녘제약','해올헬스케어'];
const MED_EMB=[['{co} 신약 3상 결과 "사망 위험 {n}% 낮춰"',58,'{co}','d:*3상 톱라인 결과 자료|n:환자 {m}명 대상|w:연구 책임자 "의미 있는 결과"|d:학회 발표 초록'],
 ['{co} 비만 치료제 국내 허가 임박',54,'{co}','d:*식약처 심사 진행 자료|n:체중 감소율 {n}%|w:회사 관계자 "연내 출시 목표"|n:예상 약가'],
 ['{co} 기술수출 계약 규모 {m}억 원',62,'{co}','d:*계약 조건 요약본|n:계약금 비중|w:업계 관계자 "역대 최대급"|d:공시 예정 문건'],
 ['{co} 항암제 부작용 보고 {n}건 늘어',60,'{co}','d:*부작용 보고 집계|w:의사 "현장에서 체감한다"|n:보고 증가율|d:식약처 안전성 서한 초안']];
function spMed(){const P=spmS();const ok=MED_CO.filter(c=>!(P.bl[c]>S.turn));if(!ok.length){openModal('엠바고 자료 받기','<p>엠바고를 깬 회사들이 모두 자료를 끊었다. 당분간은 발로 뛰어야 한다.</p>');return;}
  const co=pick(ok),t=pick(MED_EMB),wk=4*R(1,2);
  openModal('엠바고 자료',`<p class="lede">${co} 홍보팀: "기자님께만 먼저 드립니다. 대신 ${wk/4}개월 뒤 해제일 전까진 보도하지 마세요."</p><p class="hint">업계 접근권 ${Math.round(P.v)} · 지키면 해제일에 모든 매체가 같이 쓴다(단독 아님) · 깨면 지금은 단독이지만 ${jo2(co,'은','는')} 1년 동안 자료를 끊고 접근권이 크게 깎인다</p>`,[
   {label:'엠바고를 약속하고 받는다',sub:'확인된 사실 둘을 쥔 채 시작 · 아이템은 해제 전까지 단독 표시',fn:()=>{spend(1,2);setCd('spx');const it=spItem(S.dept,t,{excl:true,pre:2,via:'엠바고 자료',src:co+' 엠바고',v:{co},mult:1+P.v/400});it.emb={co,until:S.turn+wk};P.emb.push({iid:it.id,co,until:it.emb.until,h:it.title});spAdd(it,`${co} 엠바고 자료를 받았다`);spmV(2);}},
   {label:'엠바고는 거절하고 독자 취재한다',sub:'단독 가능 · 확인은 처음부터 · 접근권 조금↓',fn:()=>{spend(1,6);setCd('spx');const it=spItem(S.dept,t,{excl:true,pre:0,src:'독자 취재',v:{co}});spAdd(it,'엠바고 없이 직접 파기로 했다');spmV(-2);}},
   {label:'됐다',cls:'ghost'}]);}
function spMedPub(it){const P=spmS();if(!it.emb)return;P.emb=P.emb.filter(e=>e.iid!==it.id);
  if(S.turn<it.emb.until){P.bl[it.emb.co]=S.turn+YW;spmV(-22);valN('sp',2,'엠바고를 깨고 먼저 썼다');log(`엠바고 파기 — ${it.emb.co}`);Q.push(()=>openModal('엠바고를 깼다',`<p class="lede">「${esc(it.title)}」${jp(esc(it.title),'이','가')} 단독으로 나가자 ${esc(it.emb.co)} 홍보팀 전화가 불이 났다.</p><p>"앞으로 우리 자료는 없습니다." 다른 제약사들도 이 일을 안다. 업계 접근권이 크게 떨어졌다.</p>`));}
  else{spmV(6);toast(`약속을 지켰다. ${jo2(it.emb.co,'이','가')} 다음 자료도 먼저 주겠다고 한다`);}}
function spMedMonth(lines){const P=spmS(),m=month();
  P.emb.forEach(e=>{if(e.until<=S.turn&&!e.lift){e.lift=1;const it=S.items.find(x=>x.id===e.iid);if(it){it.excl=false;it.heat=Math.max(it.heat||0,4);}lines.push({c:'',t:`엠바고 해제 — 「${e.h}」 이제 모든 매체가 같이 쓴다`});}});P.emb=P.emb.filter(e=>S.items.some(x=>x.id===e.iid));
  if((m===4||m===10)&&spOnce('med'+m))Q.push(()=>openModal(`${m===4?'춘계':'추계'} 학회 시즌`,`<p class="lede">학회장이 제약사 부스로 꽉 찼다. 하루를 어디에 쓸까.</p>`,[
   {label:'제약사 부스를 돈다',sub:'광고 영업 협조 · 평가↑ · 접근권↑',fn:()=>{spend(0,6);spmV(4);toast('명함 서른 장 · '+apply({eval:1.4}));}},
   {label:'발표 논문을 하나씩 검증한다',sub:'체력↓↓ · 검증력이 높을수록 결함을 찾는다',risk:true,fn:()=>{spend(0,10);if(chance(.3+S.st.ver/200)){const co=pick(MED_CO);const it=spItem(S.dept,['{co} 학회 발표 데이터, 대조군 빼고 계산',68,'{co}','d:*발표 슬라이드 원본|w:통계 전문가 "결과가 과장됐다"|n:빠진 환자 {n}명|d:논문 초록 수정 이력'],{excl:true,pre:1,v:{co},src:'학회 검증'});spAdd(it,'숫자 하나가 맞지 않았다');spmV(-3);}else{gain('ver',.5);toast('밤새 읽었지만 이상한 건 없었다');}}}]));
  if(m===12&&spOnce('med12'))Q.push(()=>openModal('제약사 송년회',`<p class="lede">${pick(MED_CO)} 송년회. 돌아가는 길에 봉투가 하나 내밀어졌다. "거마비입니다."</p>`,[
   {label:'받는다',sub:'돈↑ · 신뢰↓ · 접근권↑',fn:()=>{S.money+=30;spmV(5);valN('ind',-6,'제약사 봉투를 받았다');toast('주머니가 두둑해졌다 · '+apply({trust:-3}));}},
   {label:'돌려준다',sub:'신뢰↑ · 접근권 조금↓',fn:()=>{spmV(-2);valN('ind',3,'봉투를 돌려줬다');toast('"역시 깐깐하시네." · '+apply({trust:1.5}));}}]));}

// ---- 전자일보: 공급망 지도 ----
const TECH_PROD=['폴더블폰','AR 글라스','AI 노트북','전기차 배터리 팩','HBM 메모리','스마트워치','태블릿','로봇청소기'];
const TECH_LINK=[['소재사','패널·소재 발주량'],['부품사','부품 사양서'],['모듈사','모듈 양산 일정']];
function spTechNew(){const P=spmS();P.ch={corp:pick(CORPS),prod:pick(TECH_PROD),got:[0,0,0],due:S.turn+YW/2};return P.ch;}
function spTech(){const P=spmS();const C=P.ch&&P.ch.due>S.turn?P.ch:spTechNew();
  const st=C.got.map((g,i)=>`${g?'●':'○'} ${TECH_LINK[i][0]}`).join(' · ');
  openModal('협력사 라인 타기',`<p class="lede">${esc(C.corp)} 차기 ${esc(C.prod)}. 본사는 입을 닫았다. 협력사 세 곳을 맞추면 사양이 나온다.</p><p><b>${st}</b></p><p class="hint">출시까지 ${moTxt(C.due-S.turn)} · 업계 신뢰 ${Math.round(P.v)} · 인맥과 업계 신뢰가 높을수록 입을 연다</p>`,
   TECH_LINK.map(([n,what],i)=>({label:`${jo2(n,'을','를')} 찾아간다`,sub:C.got[i]?'이미 맞췄다':`${jo2(what,'을','를')} 노린다 · 체력↓`,disabled:!!C.got[i],fn:()=>{spend(1,6);setCd('spx');gain('net',.3);
     if(chance(.42+S.st.net/300+P.v/350)){C.got[i]=1;spmV(2);if(C.got.every(Boolean)){const it=spItem(S.dept,[`${C.corp} 차기 ${C.prod} 사양·출시 시점 단독 확인`,70,C.corp,`d:*${TECH_LINK[0][1]}|d:${TECH_LINK[1][1]}|d:${TECH_LINK[2][1]}|w:${C.corp} "확인해 줄 수 없다"`],{excl:true,pre:2,via:'협력사',src:'공급망'});spAdd(it,'세 고리가 맞았다. 퍼즐이 완성됐다');spmV(4);P.ch=null;}else toast(`${n} 쪽에서 ${jo2(what,'을','를')} 들었다 · 고리 하나 맞춤 (${C.got.filter(Boolean).length}/3)`);}
     else{spmV(-.5);toast(`${n} 담당자: "그건 저희도 몰라요." 다음에 다시`);}}})).concat([{label:'나중에',cls:'ghost'}]));}
function spTechMonth(lines){const P=spmS(),m=month();if(P.ch&&P.ch.due<=S.turn){lines.push({c:'r',t:`${P.ch.corp} ${jo2(P.ch.prod,'이','가')} 먼저 공개됐다. 맞추던 공급망 퍼즐은 날아갔다`});P.ch=null;}
  const EX={1:['CES','라스베이거스'],3:['MWC','바르셀로나'],9:['IFA','베를린']}[m];
  if(EX&&spOnce('tech'+m))Q.push(()=>openModal(`${EX[0]} 출장`,`<p class="lede">${EX[1]}에서 ${jo2(EX[0],'이','가')} 열린다. 회사가 출장을 보내 주겠다고 한다.</p>`,[
   {label:'간다',sub:'체력↓↓ · 현장 단독 기회 · 업계 신뢰↑',fn:()=>{spend(0,12);spmV(4);gain('lng',.3);if(chance(.45+S.st.net/300)){const corp=pick(CORPS);const it=spItem(S.dept,[`[${EX[0]}] ${corp} 비공개 부스서 차세대 제품 공개`,56,corp,'s:*비공개 부스 직접 확인|w:관계자 "내년 상반기 양산"|d:바이어 상담 자료|n:시제품 사양'],{excl:true,pre:1,src:EX[0]+' 현장'});spAdd(it,'비공개 부스에 들어갔다');}else toast(quickClip(`[${EX[0]}] 올해 키워드는 AI…현장에서 본 다섯 장면`,S.st.wri*.4+35,R(20,30)));}},
   {label:'외신으로 받아 쓴다',sub:'안전 · 체력 아낌',fn:()=>toast(quickClip(`${EX[0]} 개막…주요 기업 신제품 총정리`,S.st.wri*.3+28,R(14,22)))}]));
  if([1,4,7,10].includes(m)&&spOnce('techQ'+m)){const corp=pick(CORPS);Q.push(()=>openModal('실적 시즌 · 잠정 실적 미리 쓰기',`<p class="lede">${esc(corp)} 잠정 실적 발표가 다음 주다. 미리 숫자를 쓸까.</p>`,[
   {label:'증권가 컨센서스대로 쓴다',sub:'안전 · 남들과 같은 기사',fn:()=>toast(quickClip(`${corp} 영업이익 시장 기대치 부합 전망`,32+S.st.dat*.2,R(14,22)))},
   {label:'협력사 발주량으로 직접 추정한다',sub:'데이터·업계 신뢰가 높을수록 정확 · 맞으면 업계 인용',risk:true,fn:()=>{spend(0,6);if(chance(clamp(.3+S.st.dat/220+P.v/300,.25,.85))){spmV(6);toast(`발표 숫자가 우리 추정과 거의 같았다. 증권사 리포트가 우리 기사를 인용했다 · `+quickClip(`${corp} 영업이익 컨센서스 크게 밑돌 듯…협력사 발주 급감`,55+S.st.dat*.3,R(34,46))+' · '+apply({fame:1.5}));}else{spmV(-5);toast('추정이 빗나갔다. 증권가에서 "전문지가 숫자도 틀린다"는 말이 돌았다 · '+apply({eval:-.8}));}}}]));}}

// ---- 법정신문: 판결문 서고 ----
const LAW_REAL=[['전원합의체','종전 판례를 변경','{n}년 만에 판례 뒤집혀'],['파기환송','하급심 판단을 처음으로 뒤집어','첫 판단'],['최초 인정','법원이 처음으로 인정','국내 첫 판결'],['위헌 제청','법원이 직권으로 헌재에 물어','위헌 심판대에']];
const LAW_TOPIC=['플랫폼 노동자의 근로자성','AI가 만든 그림의 저작권','반려동물 치료비 위자료','전세사기 공범의 범위','딥페이크 합성물 소지죄','층간소음 손해배상','기후 소송의 원고 적격','가상자산 횡령죄'];
const LAW_FAKE=['사회적 관심이 컸던 사건이지만 원심을 그대로 유지','언론 보도가 많았지만 상고를 기각','유명인 사건이지만 항소를 기각하고 형량도 그대로','쟁점이 많았지만 기존 판례대로 판단'];
function spLaw(){const P=spmS();const tp=shuffle(LAW_TOPIC.slice()).slice(0,3),ri=R(0,2),re=pick(LAW_REAL);const sense=S.st.kno>=55||P.v>=65;
  const cards=tp.map((t,i)=>i===ri?{t,txt:`${t} 사건 — ${re[1]}`,real:1}:{t,txt:`${t} 사건 — ${pick(LAW_FAKE)}`,real:0});
  openModal('판결문 서고',`<p class="lede">오늘 올라온 판결문 수백 건. 그중 셋을 골라 왔다. 판례가 바뀌는 건 하나뿐이다.</p><p class="hint">법조계 평판 ${Math.round(P.v)}${sense?' · 상식이 쌓여 감이 온다':''}</p>`,
   cards.map(c=>({label:c.txt,sub:sense&&c.real?'뭔가 다르다':'판결 요지',fn:()=>{spend(1,3);setCd('spx');gain('kno',.4);
     if(c.real){const it=spItem(S.dept,[`대법원, ${c.t} ${re[2]}`,64,'대법원',`d:*판결문 전문|w:법학 교수 "실무가 바뀐다"|n:같은 쟁점 계류 사건 {n}건|w:원고 측 변호인 "${re[0]} 판단을 환영한다"`],{excl:true,pre:1,via:'판결문',src:'판결문 서고'});spAdd(it,'판례가 바뀌는 판결을 찾았다');spmV(5);}
     else{spmV(.5);toast(`평범한 판결이었다. "${c.t}" 쟁점은 그대로다`);}}})).concat([{label:'오늘은 덮는다',cls:'ghost'}]));}
function spLawMonth(lines){const P=spmS(),m=month();
  if((m===2||m===8)&&spOnce('law'+m))Q.push(()=>openModal(`${m===2?'법원':'검찰'} 정기 인사`,`<p class="lede">인사 명단 초안이 손에 들어왔다. 발표는 사흘 뒤다.</p>`,[
   {label:'명단을 먼저 쓴다',sub:'단독 · 평판↑ · 법조계 평판↓ (항의)',risk:true,fn:()=>{spmV(-6);valN('sp',2);toast(quickClip(`[단독] ${m===2?'대법원':'법무부'} 정기 인사 명단 입수…요직 대거 교체`,50+S.st.spd*.3,R(36,48))+' · '+apply({fame:2}));}},
   {label:'발표 뒤 인사 분석을 쓴다',sub:'법조계 평판↑',fn:()=>{spmV(4);toast(quickClip(`${m===2?'법원':'검찰'} 인사로 본 올해 사법부 흐름`,S.st.kno*.4+30,R(20,30)));}}]));
  if((m===5||m===11)&&spOnce('law'+m)){const firm=pick(['한결','누리','가람','새벽','해올'])+' 법무법인';Q.push(()=>openModal('판례 평석 청탁',`<p class="lede">${jo2(firm,'이','가')} 자기네가 이긴 사건의 평석 기고를 실어 달라고 한다. 광고도 함께다.</p>`,[
   {label:'싣는다',sub:'평가↑ · 법조계 평판↓',fn:()=>{spmV(-5);valN('ind',-3,'로펌 청탁 평석을 실었다');toast(apply({eval:1.5}));}},
   {label:'다른 시각 평석과 함께 싣자고 한다',sub:'인터뷰력이 높을수록 성사 · 법조계 평판↑',fn:()=>{if(chance(.4+S.st.int/200)){spmV(5);toast('양쪽 평석이 나란히 실렸다. 판사들이 돌려 읽었다 · '+apply({eval:.8,fame:.6}));}else{spmV(1);toast('로펌이 원고를 거둬 갔다');}}},
   {label:'거절한다',sub:'법조계 평판↑',fn:()=>{spmV(3);toast('"원칙적이시네요."');}}]));}
  if(m===12&&spOnce('law12')){const g=P.v>=60;lines.push({c:g?'g':'',t:g?'올해의 판결 선정 — 법조계가 우리 선정을 그대로 인용했다':'올해의 판결 선정 — 반응이 미지근했다'});if(g)apply({fame:2,eval:1});}}

// ---- 스포츠지: 시즌과 이적설 ----
const SPO_SIG=[['커뮤니티발 소문',.25],['선수 측근 "가능성 열려 있다"',.45],['구단 고위 관계자 "협상 중"',.65],['양측 에이전트 동시 확인',.8]];
function spSeason(m){return m>=11||m<=2?'스토브리그':m===7?'여름 이적 시장':m===10?'포스트시즌':'정규 시즌';}
function spRumDue(){const m=month();const left=m>=11?(14-m):m<=2?(2-m+1):m<=7?(7-m+1):(14-m);return S.turn+4*Math.max(1,left);}
function spSports(){const P=spmS();const m=month(),sea=spSeason(m);const open=sea==='스토브리그'||sea==='여름 이적 시장';const f=filler(vars());
  const team=f('{team}'),who=rname().slice(0,3);const sg=pick(SPO_SIG);const p=clamp(sg[1]+R(-10,10)/100,.1,.9);
  if(!open&&chance(.5)){openModal('에이전트 전화',`<p class="lede">${sea}. 이적 시장이 닫혀 있어 에이전트들 말이 짧다.</p>`,[{label:'부상·연봉 협상 얘기라도 듣는다',sub:'아이템',fn:()=>{spend(1,3);setCd('spx');const it=makeItem(S.dept,{pre:1});spAdd(it,'에이전트가 흘린 한마디');spmV(1);}},{label:'끊는다',cls:'ghost'}]);return;}
  const rm={who,team,p,sig:sg[0],due:spRumDue(),pub:0,id:uid()};
  openModal('에이전트 전화',`<p class="lede">"${esc(who)} 선수, ${jo2(esc(team),'으로','로')} 갑니다. 아직 아무도 몰라요."</p><p>근거: <b>${esc(sg[0])}</b></p><p class="hint">${sea} · 구단 출입 ${Math.round(P.v)} · 이적 시장이 닫힐 때 맞는지 판가름 난다. 맞으면 평판·평가가 크게 오르고, 틀리면 신뢰가 깎이고 구단 출입이 막힌다</p>`,[
   {label:'단독으로 터뜨린다',sub:'지금 조회수↑ · 판가름은 시장이 닫힐 때',risk:true,fn:()=>{spend(1,3);setCd('spx');rm.pub=1;valN('sp',3,'확인 덜 된 이적설을 터뜨렸다');P.rum.push(rm);toast(quickClip(`[단독] ${who}, ${team} 이적 임박`,40+S.st.spd*.3,R(30,42)));}},
   {label:'한 번 더 확인한다',sub:'체력↓ · 맞을지 감이 온다 · 터뜨릴지는 다시 정한다',fn:()=>{spend(1,6);setCd('spx');const est=p>=.6?'꽤 확실하다':p>=.4?'반반이다':'아닐 가능성이 크다';rm.chk=1;
     openModal('확인 결과',`<p class="lede">구단 쪽 지인 두 명에게 더 물었다. 느낌상 <b>${est}</b>.</p>`,[{label:'터뜨린다',risk:true,fn:()=>{rm.pub=1;P.rum.push(rm);toast(quickClip(`[단독] ${who}, ${team} 이적 협상 막바지`,46+S.st.spd*.3,R(30,42)));}},{label:'묻어 둔다',sub:'구단 출입↑',fn:()=>{spmV(3);toast(`구단 홍보팀: "신중하게 써 주셔서 고맙습니다."`);}}]);return false;}},
   {label:'묻어 둔다',sub:'구단 출입↑',fn:()=>{spend(1,1);setCd('spx');spmV(3);toast('기록만 해 두고 넘겼다');}}]);}
function spSportsMonth(lines){const P=spmS(),m=month();
  P.rum.filter(r=>r.pub&&!r.done&&r.due<=S.turn).forEach(r=>{r.done=1;const hit=chance(r.p);
    if(hit){spmV(5);lines.push({c:'g',t:`이적설 적중 — ${r.who}, 정말 ${r.team} 유니폼을 입었다. "${jo2(OUT().n,'이','가')} 먼저 썼다" · ${apply({fame:3.5,eval:2.5})}`});ach('scoop');}
    else{spmV(-9);lines.push({c:'r',t:`이적설 불발 — ${jo2(r.who,'은','는')} ${r.team}에 가지 않았다. 구단이 출입 정지를 통보했다 · ${apply({trust:-4,eval:-2})}`});}});
  P.rum=P.rum.filter(r=>!r.done).slice(-6);
  if(m===3&&spOnce('spo3'))lines.push({c:'',t:'개막 — 시즌이 시작됐다. 이적 시장은 7월까지 닫힌다'});
  if(m===10&&spOnce('spo10')&&typeof ddEvent==='function'&&ddMode()!=='off')Q.push(()=>{spmV(1);ddEvent();});
  if(m===11&&spOnce('spo11'))lines.push({c:'g',t:'스토브리그 개장 — 에이전트들 전화가 다시 바빠진다'});
  if(m===7&&spOnce('spo7'))Q.push(()=>openModal('올스타 팬 투표',`<p class="lede">올스타 팬 투표 중간 집계가 나왔다. 어떻게 쓸까.</p>`,[
   {label:'팬덤 순위 경쟁으로 쓴다',sub:'조회수↑ · 구단 출입 조금↓',fn:()=>{spmV(-1);toast(quickClip('올스타 팬 투표 1위 접전…팬덤 총력전',30+S.st.hed*.3,R(22,34)));}},
   {label:'투표 조직표 의혹을 판다',sub:'아이템 · 구단 출입↓',fn:()=>{spmV(-3);const it=spItem(S.dept,['올스타 팬 투표 매크로 조직표 정황',50,'연맹','n:*같은 IP 투표 {m}만 건|w:팬 "단체 대화방에서 돌았다"|d:연맹 투표 시스템 로그|w:연맹 "확인해 보겠다"'],{excl:true,pre:1,src:'팬 제보'});spAdd(it,'숫자가 이상했다');}}]));}

// ---- 연예지: 커버와 잠복 ----
function spStarCands(){const f=filler(vars());return [{k:'top',n:f('{star}'),t:'톱스타'},{k:'rise',n:rname().slice(0,3),t:'라이징 신인'},{k:'scan',n:f('{star}'),t:'논란 뒤 복귀하는 스타'}];}
function spStarCover(){const P=spmS();const C=spStarCands();const mag=OUT().type==='weekly';const what=mag?'이달의 커버':'주말 화보 인터뷰';
  openModal(what,`<p class="lede">${jo2(what,'을','를')} 정할 때다. 판매가 걸려 있다.</p><p class="hint">기획사 관계 ${Math.round(P.v)}</p>`,[
   {label:`${C[0].t} ${C[0].n}`,sub:P.v>=55||P.vip?'섭외 가능 · 판매↑↑ · 평가↑':'기획사 관계가 낮으면 거절당할 수 있다',fn:()=>{if(P.vip||P.v>=55||chance(.35+P.v/150)){P.vip=0;spmV(2);toast(`${C[0].n} ${mag?'커버호가 매진됐다':'화보가 포털 메인에 걸렸다'} · `+apply({eval:2,fame:1.5}));}else{spmV(-1);toast(`${C[0].n} 쪽: "이번엔 어렵겠습니다." 급히 다른 화보로 메웠다 · `+apply({eval:-.5}));}}},
   {label:`${C[1].t} ${C[1].n}`,sub:'섭외 쉬움 · 지금은 조금 · 언젠가 크게 뜰 수도',fn:()=>{P.ris.push({n:C[1].n,t:S.turn,up:S.turn+R(24,72)});P.ris=P.ris.slice(-6);spmV(1);toast(`${C[1].n}. "누구야?" 소리를 들었지만 사진은 좋았다 · `+apply({eval:.7}));}},
   {label:`${C[2].t} ${C[2].n}`,sub:'판매↑↑ · 신뢰↓ · 기획사 관계 조금↓',fn:()=>{spmV(-1);toast(`복귀 인터뷰가 화제가 됐다. 댓글은 반반 · `+apply({eval:2.4,trust:-2.5}));}}]);}
function spStar(){const P=spmS();
  openModal('잠복 취재',`<p class="lede">제보로 받은 동선. 밤새 차 안에서 기다린다.</p><p class="hint">기획사 관계 ${Math.round(P.v)} · 체력이 많이 든다</p>`,[
   {label:'기다린다',sub:mgOn()?'체력↓↓ · 결정적인 순간에 셔터를 누른다':'체력↓↓ · 취재력이 높을수록 건진다',risk:true,fn:()=>{spend(1,14);setCd('spx');gain('inv',.4);const hit=()=>{const f=filler(vars());const st=f('{star}'),st2=f('{star}');
     openModal('찍혔다',`<p class="lede">${esc(jo2(st,'과','와'))} ${esc(st2===st?rname().slice(0,3):st2)}, 두 사람이 같은 차에 탔다. 셔터를 눌렀다.</p><p>사진을 어떻게 할까.</p>`,[
      {label:'단독으로 낸다',sub:'평판↑↑ · 평가↑ · 기획사 관계↓↓ · 신뢰↓',risk:true,fn:()=>{spmV(-14);valN('pb',-4,'열애 사진을 단독으로 냈다');toast(quickClip(`[단독] ${st}, 열애 현장 포착`,48+S.st.hed*.3,R(40,55))+' · '+apply({fame:2.5,trust:-2}));if(chance(.25))S.pending.push({type:'suit',ent:null,who:`${st} 소속사`,due:S.turn+R(2,5),title:`${st} 열애 현장 포착`});}},
      {label:'기획사와 거래한다',sub:'사진을 묻는 대신 다음 톱스타 커버 약속 · 기획사 관계↑↑',fn:()=>{spmV(9);valN('ind',-3,'사진을 거래 카드로 썼다');P.vip=1;toast('기획사 실장: "다음 커버는 저희가 꼭 하겠습니다."');}},
      {label:'지운다',sub:'사생활은 남겨 둔다 · 신뢰↑ · 기획사 관계↑',fn:()=>{spmV(4);valN('pb',3,'사생활 사진을 지웠다');toast('메모리 카드를 비웠다 · '+apply({trust:1.2}));}}]);};if(mgOn()){mgShutter(hit);return false;}if(!chance(.4+S.st.inv/300)){toast('새벽 다섯 시. 아무도 나오지 않았다');return;}hit();return false;}},
   {label:'그만둔다',cls:'ghost'}]);}
function spStarMonth(lines){const P=spmS(),m=month();
  P.ris.forEach(r=>{if(!r.done&&S.turn>=r.up){r.done=1;if(chance(.45)){spmV(4);lines.push({c:'g',t:`${r.n}, 대세가 됐다. ${moTxt(S.turn-r.t)} 전 무명일 때 커버를 준 게 우리였다 · ${apply({fame:2.5,eval:1})}`});}}});
  if(spOnce('cover'+m))Q.push(spStarCover);
  if(m===12&&spOnce('star12')&&P.v>=50)Q.push(()=>openModal('연말 시상식',`<p class="lede">기획사 관계 덕에 시상식 백스테이지 출입증이 나왔다.</p>`,[{label:'백스테이지로',sub:'단독 아이템',fn:()=>{const it=makeItem(S.dept,{excl:true,pre:1,mult:1.1});spAdd(it,'백스테이지에서 들은 한마디');}}]));}

// ---- 공통 ----
// ===== 1.1 매체별 근본 규칙: 무엇으로 평가받는지, 기사를 어떻게 만드는지가 매체마다 다르다 =====
Object.assign(SPM,{
 wire:{n:'송고 경쟁',meter:'전재 매체 신뢰',act:'단신 송고',ic:'bolt',d:'확인된 사실 하나면 바로 단신으로 송고한다',main:1,
  rule:'통신사는 뉴스 도매상이다. 크게 한 방보다 빨리, 많이, 정확하게. 확인된 사실 하나만 있어도 단신으로 바로 송고할 수 있고, 매달 송고 건수와 다른 매체가 받아 쓴 채택 수로 평가받는다. 두 주가 지난 아이템은 김이 빠진다.'},
 tv:{n:'그림과 리포트',meter:'시청자 신뢰',act:'촬영 나가기',ic:'camera',d:'카메라 기자와 나가 리포트에 쓸 그림을 찍는다',main:1,
  rule:'방송은 그림이 없으면 리포트가 아니다. 현장을 확인했거나 촬영을 다녀온 아이템만 제대로 된 리포트가 되고, 그림 없는 기사는 앵커 단신으로 짧게 나간다. 매달 그림 있는 리포트를 몇 꼭지 냈는지로 평가받는다.'},
 ch:{n:'생중계',meter:'생방송 감',act:'생중계 연결',ic:'mic',d:'중계차를 타고 현장에서 생방송으로 연결한다',main:1,
  rule:'보도전문채널은 24시간 생방송이다. 기사보다 현장 연결이 먼저다. 매달 생중계 연결 횟수와 방송 사고 없이 버틴 기록으로 평가받는다. 확인 안 된 말 한마디가 방송 사고가 된다.'},
 daily:{n:'지면 전쟁',meter:'지면 장악력',act:'경쟁지 가판 점검',ic:'paper',d:'밤 9시 경쟁지 가판을 보고 물먹은 기사를 쫓는다',main:1,
  rule:'종합일간지는 다음 날 아침 지면으로 승부한다. 1면과 면 톱에 몇 번 올랐는지가 평가다. 밤마다 경쟁지 가판이 나오고, 물먹은 기사는 다음 판에서 따라잡아야 한다.'},
 econ:{n:'시장 반응',meter:'시장 신뢰',act:'증권가 정보 확인',ic:'chart',d:'여의도에 도는 정보와 공시를 확인해 기사로 만든다',main:1,
  rule:'경제지 기사는 주가를 움직인다. 기업 기사를 내면 그 회사 주가가 반응하고, 시장을 크게 움직인 만큼 평가받는다. 대신 취재 대상이 곧 광고주라 압박도 가장 세다.'},
 local:{n:'지역 유지 지도',meter:'지역 장악력',act:'지역 유지 만나기',ic:'map',d:'단체장·의원·건설업자·상공인과의 관계를 관리한다',main:1,
  rule:'지역지는 작은 바닥이다. 단체장, 지방의원, 건설업체 대표, 상공회의소 회장 네 사람이 광고와 정보를 쥐고 있고 서로 얽혀 있다. 한 사람을 쓰면 다른 사람이 웃는다. 관계를 쌓으면 제보가 오고, 틀어지면 광고가 끊긴다. 4년마다 지방선거가 판을 흔든다.'},
 eng:{n:'외신 인용',meter:'외교가 신뢰',act:'외신 기자클럽',ic:'quote',d:'외신 기자·대사관 사람들과 정보를 나눈다',main:1,
  rule:'영자지는 어학이 곧 기사 품질이다. 잘 쓴 기사는 외신이 인용해 가고, 그 인용 수가 평가가 된다. 번역 한 단어가 외교 문제가 되기도 한다.'},
 online:{n:'트래픽',meter:'트래픽 감',act:'실시간 이슈 기사',ic:'fire',d:'지금 뜨는 이슈를 빠르게 받아 쓴다',main:1,
  rule:'인터넷 언론은 조회수가 월급이다. 매달 조회수 목표로 평가받는다. 아이템을 찾은 그 주에 바로 쓰면 조회수가 더 붙고, 자극적인 제목은 트래픽을 부르지만 신뢰와 포털 점수를 깎는다.'},
 weekly:{n:'이번 호 커버',meter:'독자 충성도',act:'커버 기획회의',ic:'book',d:'이번 호 커버스토리를 정한다',main:1,
  rule:'주간지는 한 달에 한 번 커버스토리로 승부한다. 커버로 정한 기사는 파급력과 판매가 크게 붙고, 나머지 기사는 덜 주목받는다. 커버를 정해 놓고 그달 안에 못 내면 펑크다.'}
});
function spmId(){if(!S||S.story)return null;return outMode();}
function outModeOf(o){if(!o)return null;if(SPM_OF[o.id])return SPM_OF[o.id];const d=o.depts||[];if(o.type==='trade')return d.includes('med')?'med':d.includes('edu')?'edu':d.includes('court')?'law':'tech';if(o.type==='sports')return 'sports';return ({wire:'wire',tv:'tv',jp:'tv',ch:'ch',daily:'daily',econ:'econ',local:'local',eng:'eng',online:'online',weekly:'weekly'})[o.type]||null;}
function spmS(){const m=spmId();if(!m)return null;if(!S.spm||S.spm.m!==m)S.spm={m,v:40,ac:0,ev:{},bl:{},emb:[],rum:[],ch:null,ris:[],t0:S.turn,lords:null,cov:null};return S.spm;}
function spmTag(o){const m=outModeOf(o);return m&&SPM[m]?`<span class="tag ok">고유 규칙 · ${SPM[m].n}</span>`:'';}
function mgOn(){return !(S&&S.mgOff);}

// ---- 이달의 성과 지표 ----
const KPI_DEF={
 wire:{t:[['pub','송고',4],['pick','채택 매체',20]]},
 tv:{t:[['ft','그림 있는 리포트',1]]},
 ch:{t:[['live','생중계 연결',1.5]]},
 daily:{t:[['sc','지면 점수',1.5]]},
 econ:{t:[['mk','시장 반응',4]]},
 local:{t:[['pub','지역 기사',2],['lord','지역 유지 관계',50]]},
 eng:{t:[['pub','기사',2],['cite','외신 인용',1]]},
 online:{t:[['pv','조회수',0]]},
 weekly:{t:[['cover','커버스토리',1],['pub','기사',1]]},
 edu:{t:[['pub','기사',2]]},med:{t:[['pub','기사',2]]},tech:{t:[['pub','기사',2]]},law:{t:[['pub','기사',2]]},sports:{t:[['pub','기사',2]]},star:{t:[['pub','기사',2]]}};
function kpiRk(){if(S.founder)return .5;return [0,1,.8,.6][S.rank]||0;}
function km(){if(!S.km)S.km={};return S.km;}
function kpiTarget(k,base){const o=OUT();let t=base;if(k==='pv')t=3500*(o.p+1);if(k==='lord')return 50;return Math.max(1,Math.round(t*kpiRk()*(S.simple?.7:1)*dk('kpi')*2)/2);}
function kpiVal(k){const K=km();if(k==='lord'){const L=(spmS()||{}).lords;return L?Math.round(avg(L.map(x=>x.rel))):50;}if(k==='live')return Math.max(0,(K.live||0)-(K.bad||0));return Math.round((K[k]||0)*10)/10;}
function kpiRows(){const m=spmId();const D=KPI_DEF[m];if(!D||!kpiRk())return [];return D.t.map(([k,n,b])=>{const tg=kpiTarget(k,b),v=kpiVal(k);return{k,n,v,tg,r:k==='lord'?v/tg:v/tg};});}
function kpiMonth(lines){const P=spmS();if(!P||!kpiRk()){S.km={};return;}const rows=kpiRows();if(!rows.length){S.km={};return;}
  const ratio=avg(rows.map(x=>Math.min(2,x.r)));try{if(window.__devTest)(window.__kpiLog=window.__kpiLog||[]).push({m:P.m,r:+ratio.toFixed(2),rk:S.rank,rows:rows.map(x=>x.k+':'+x.v+'/'+x.tg).join(' ')});}catch(e){}const main=!!SPM[P.m].main;const w=S.founder?1:S.rank<=1?1:S.rank<=3?.7:S.rank<=5?.45:.3;
  const k=(ratio>=1?Math.min(1,ratio-1)*1.1+.25:(ratio-1)*.55*(S.simple?.5:1))*w*(main?1:.6);const fmt=x=>x.k==='pv'?`${Math.round(x.v).toLocaleString('ko-KR')}/${Math.round(x.tg).toLocaleString('ko-KR')}`:`${x.v}/${x.tg}`;
  const txt=rows.map(x=>`${x.n} ${fmt(x)}`).join(' · ');let fx='';
  if(Math.abs(k)>=.08){if(S.founder){try{S.co.q=clamp(S.co.q+k*1.5,10,100);}catch(e){}fx=apply({fame:k*.8});}else fx=apply({eval:k,fame:k>0?k*.25:0});}
  if(main)P.v=clamp(P.v+clamp(ratio-1,-1,1)*8,0,100);
  lines.push({c:ratio>=1?'g':ratio<.5?'r':'',t:`이달 ${SPM[P.m].n} 성과 — ${txt}${ratio>=1?' · 목표 달성':ratio<.5?' · 목표에 크게 못 미쳤다':''}${fx?' · '+fx:''}`});S.km={};}

// ---- 기사를 낼 때: 출고 전 보정과 출고 뒤 반응 ----
function tvFt(it){return !!(it.ft||it.photo||it.facts.some(f=>f.k==='s'&&fOK(f)));}
function spPre(it,W,notes){const m=spmId();if(!m)return null;
  if(m==='tv'&&!tvFt(it)){notes.push('그림이 없어 앵커 단신으로 짧게 나갔다. 촬영을 다녀왔거나 현장을 확인한 아이템이라야 리포트가 된다.');return{k:.6,qc:62};}
  if(m==='weekly'){if(it.cover){notes.push('이번 호 커버스토리다. 표지에 걸렸다.');return{k:1.35};}return{k:.9};}
  return null;}
function spPub(it,clip,place){const m=spmId();if(!m)return;const K=km();K.pub=(K.pub||0)+1;const o=OUT(),q=clip?clip.q:50,imp=clip?clip.imp:30;
  if(m==='med')spMedPub(it);
  if(m==='wire'){const pk=Math.max(0,Math.round(imp*q/220*(o.p/3+.4)*R(70,130)/100));K.pick=(K.pick||0)+pk;if(clip)clip.pick=pk;if(pk)tick(`전재 매체 ${pk}곳이 「${yamaShort(clip?clip.h:it.title,24)}」${jp(yamaShort(clip?clip.h:it.title,24),'을','를')} 받아 썼다`);}
  if(m==='tv'&&tvFt(it))K.ft=(K.ft||0)+1;
  if(m==='daily'&&place)K.sc=(K.sc||0)+({front:3,one:2,top:2}[place.k]||.6);
  if(m==='econ'){const corp=(ENT[it.ent]&&ENT[it.ent].kind==='corp')?ENT[it.ent].n:CORPS.find(c=>it.title.includes(c));if(corp){const crit=CRIT_RE.test(it.title);const mv=+(clamp(imp/9,1,16)*(crit?-1:.6)*R(70,130)/100).toFixed(1);K.mk=(K.mk||0)+Math.abs(mv);if(clip)clip.mk=mv;toast(`${corp} 주가 ${mv>0?'+':''}${mv}% — 시장이 기사에 반응했다`);if(Math.abs(mv)>=6){spmV(3);apply({fame:.6});}}}
  if(m==='local')lordPub(it);
  if(m==='eng'&&q>=58&&imp>=30&&chance(clamp((q-50)/60+S.st.lng/300,0,.8))){K.cite=(K.cite||0)+1;if(clip)clip.cite=1;toast(pick(['외신 두 곳이 기사를 인용했다','주한 외신 특파원들이 기사를 받아 썼다','해외 통신사가 "현지 영자지에 따르면"으로 인용했다']));apply({fame:.5});}
  if(m==='online'&&clip){if(S.turn-(it.born??S.turn)<=2){clip.views=Math.round(clip.views*1.35);toast('찾자마자 썼다. 실시간으로 조회수가 붙었다');}K.pv=(K.pv||0)+(clip.views||0);}
  if(m==='weekly'&&it.cover){K.cover=(K.cover||0)+1;const P=spmS();if(P)P.cov=null;spmV(4);}}
function spQuick(clip){const m=spmId();if(!m||!clip)return;const K=km();K.pub=(K.pub||0)+1;if(m==='online')K.pv=(K.pv||0)+(clip.views||0);if(m==='daily')K.sc=(K.sc||0)+.3;}

// ---- 통신사: 단신 송고 ----
function spWire(){const P=spmS();const L=S.items.filter(i=>i.facts.some(fOK)&&!(i.hold>S.turn));
  const opts=L.slice(0,5).map(it=>{const cov=it.facts.filter(fOK).length/it.facts.length,kOK=it.facts.some(f=>f.key&&fOK(f));return{label:`「${yamaShort(it.title,30)}」`,sub:`확인 ${it.facts.filter(fOK).length}/${it.facts.length}${kOK?'':' · 핵심이 덜 확인됐다 — 틀리면 정정'} · 바로 송고`,risk:!kOK,fn:()=>{spend(1,3);setCd('spx');const q=28+S.st.wri*.2+S.st.spd*.3+cov*25,imp=it.imp*(.5+cov*.35);S.items=S.items.filter(x=>x!==it);const fx=quickClip(`[속보] ${it.title}`,q,imp);const c=S.clips[0];const o=OUT();const pk=Math.max(0,Math.round(c.imp*c.q/220*(o.p/3+.4)*R(70,130)/100));c.pick=pk;const K=km();K.pick=(K.pick||0)+pk;if(!kOK&&chance(.14))S.pending.push({type:'err',title:c.h,due:S.turn+R(1,3)});if(!kOK)valN('sp',2,'핵심이 덜 확인된 채 단신을 쳤다');spmV(1);toast(`송고 — 전재 매체 ${pk}곳이 받아 썼다 · ${fx}`);}};});
  const extra=mgOn()&&typeof mgWire==='function'?[{label:'속보 경쟁 — 단말기 앞에서 1보 치기',sub:'미니게임 · 확인된 줄만 골라 경쟁 통신사보다 먼저',fn:()=>{spend(1,4);setCd('spx');mgWire();return false;}}]:[];
  openModal('단신 송고',`<p class="lede">통신사는 확인된 사실 하나면 기사가 된다. 5단계를 다 거치지 않고 단신으로 바로 친다.</p><p class="hint">이달 송고 ${kpiVal('pub')}/${kpiTarget('pub',4)} · 채택 ${kpiVal('pick')}/${kpiTarget('pick',20)}</p>`,(opts.length?opts:[{label:'송고할 아이템이 없다',sub:'확인된 사실이 하나라도 있는 아이템이 필요하다',disabled:true}]).concat(extra,[{label:'나중에',cls:'ghost'}]));}
function spWireMonth(lines){let n=0;S.items.forEach(it=>{if(S.turn-(it.born||0)>=8&&!it.aged){it.aged=1;it.imp=Math.round(it.imp*.85);if(it.excl){it.excl=false;n++;}}});if(n)lines.push({c:'r',t:`두 주 넘게 묵힌 아이템 ${n}건의 단독 가치가 사라졌다. 통신은 늦으면 기사가 아니다`});}

// ---- 지상파·종편: 촬영 ----
function spTV(){const P=spmS();const L=S.items.filter(it=>!tvFt(it));const isJp=OUT().type==='jp';
  const opts=L.slice(0,5).map(it=>({label:`「${yamaShort(it.title,30)}」 촬영`,sub:'카메라 기자와 현장에 나간다 · 방송감이 높을수록 잘 찍는다 · 컨디션↓',fn:()=>{spend(1,6);setCd('spx');gain('brd',.3);if(chance(.62+S.st.brd/300)){it.ft=1;if(!it.photo)it.photo='현장 화면';spmV(1);toast(`그림을 땄다 — 「${yamaShort(it.title,20)}」${jp(yamaShort(it.title,20),'은','는')} 이제 리포트가 된다`);}else toast('현장은 이미 정리돼 있었다. 쓸 만한 그림이 없다');}}));
  if(isJp)opts.push({label:'시사 토크 패널로 출연한다',sub:'평판↑ · 방송감↑ · 말 한마디가 논란이 될 수 있다',risk:true,fn:()=>{spend(1,5);setCd('spx');gain('brd',.5);if(chance(.2)){valN('pb',-2,'토크쇼에서 센 말을 했다');toast('한마디가 클립으로 돌았다. 댓글창이 불탔다 · '+apply({fame:1.5,trust:-1.5}));}else toast('차분하게 짚었다 · '+apply({fame:1,eval:.5}));}});
  if(mgOn()&&typeof mgTV==='function'&&S.rank>=2)opts.push({label:'메인뉴스 큐시트 회의',sub:'미니게임 · 오늘 메인뉴스 순서를 직접 짠다',fn:()=>{spend(1,3);setCd('spx');mgTV();return false;}});
  openModal('촬영 나가기',`<p class="lede">방송은 그림이 절반이다. 그림 없는 아이템은 리포트가 아니라 앵커 단신으로 짧게 나간다.</p><p class="hint">이달 그림 있는 리포트 ${kpiVal('ft')}/${kpiTarget('ft',1)} · 현장을 확인한 아이템은 이미 그림이 있다</p>`,(opts.length?opts:[{label:'그림이 필요한 아이템이 없다',sub:'가진 아이템은 모두 그림이 있다',disabled:true}]).concat([{label:'나중에',cls:'ghost'}]));}

// ---- 보도전문채널: 생중계 ----
function spCH(){const it=S.items.slice().sort((a,b)=>b.imp-a.imp)[0];const where=it?yamaShort(it.title,26):pick(['도심 집회 현장','화재 현장','폭우 피해 현장','법원 앞']);
  const opts=[{label:`${where} — 생중계 연결`,sub:'방송감이 높을수록 잘 버틴다 · 확인 안 된 말은 방송 사고',risk:true,fn:()=>{spend(1,8);setCd('spx');liveHit(it,where);}}];
  if(mgOn()&&typeof mgCH==='function')opts.push({label:`${where} — 직접 진행한다`,sub:'미니게임 · 몇 초마다 무슨 말을 할지 고른다',fn:()=>{spend(1,8);setCd('spx');mgCH(it,where);return false;}});
  openModal('생중계 연결',`<p class="lede">중계차가 출발했다. 앵커가 곧 당신 이름을 부른다.</p><p class="hint">이달 생중계 ${kpiVal('live')}/${kpiTarget('live',1.5)} · 방송 사고는 횟수에서 빠진다</p>`,opts.concat([{label:'나중에',cls:'ghost'}]));}
function liveHit(it,where){const K=km();gain('brd',.4);const ok=chance(.5+S.st.brd/220+S.st.ver/600);
  if(ok){K.live=(K.live||0)+1;spmV(2);toast(quickClip(`[생중계] ${where}`,40+S.st.brd*.4,Math.max(20,(it?it.imp:30)*.8))+' · '+apply({fame:.6}));}
  else if(chance(clamp(.3-S.st.brd/400,.06,.3))){K.bad=(K.bad||0)+1;spmV(-6);valN('sp',2,'생방송에서 확인 안 된 말을 했다');toast('확인 안 된 말이 전파를 탔다. 방송 사고다 · '+apply({trust:-2,eval:-1}));}
  else{K.live=(K.live||0)+1;toast('밋밋했지만 무사히 넘겼다 · '+apply({eval:.3}));}}

// ---- 종합일간지: 경쟁지 가판 ----
function spDaily(){const comp=(S.comp||[]).map(c=>({c,o:OUTLETS.find(x=>x.id===c.id)})).filter(x=>x.o);const rv=comp.length?pick(comp):null;const rn=rv?rv.o.n:'경쟁지';
  if(mgOn()&&typeof mgDaily==='function'){spend(1,4);setCd('spx');mgDaily();return;}
  spend(1,4);setCd('spx');const strong=rv&&(rv.c.strat==='scoop'||rv.c.strat==='quality');const miss=chance(strong?.6:.4);
  if(!miss){spmV(2);toast(`${rn} 가판엔 우리가 안 가진 기사가 없다. 오히려 우리 1면이 더 세다 · `+apply({eval:.6}));return;}
  const it=makeItem(S.dept,{excl:false,pre:1});openModal('물먹었다 — 경쟁지 가판',`<p class="lede">밤 9시, ${esc(rn)} 가판 1면에 우리가 없는 기사가 실렸다: 「${esc(it.title)}」</p><p>다음 판까지 두 시간. 따라붙을까?</p>`,[
   {label:'다음 판에 따라붙는다',sub:'속도·인맥이 높을수록 성공 · 컨디션↓',fn:()=>{S.hp=clamp(S.hp-6,0,100);if(chance(.45+S.st.spd/300+S.st.net/400)){toast('다음 판에 실었다. 체면은 지켰다 · '+quickClip(it.title.replace(/^\[단독\] /,''),40+S.st.wri*.3,it.imp*.6));}else{toast('못 따라잡았다. 아침 회의가 무겁다 · '+apply({eval:-1}));}}},
   {label:'더 파서 내일 반격한다',sub:'아이템으로 가져간다',fn:()=>{it.heat=5;S.items.push(it);toast('반격 아이템으로 챙겼다');}},
   {label:'넘긴다',sub:'평가 조금↓',fn:()=>toast(apply({eval:-.5}))}]);}

// ---- 경제지: 증권가 정보 ----
function spEcon(){const opts=[{label:'증권가 메신저 지라시를 확인한다',sub:'단독 가능 · 가짜가 많다',risk:true,fn:()=>{spend(1,3);setCd('spx');const it=makeItem(S.dept,{excl:true,hoax:chance(.35)});it.src='증권가 지라시';S.items.push(it);itemFound(it,'메신저에 도는 한 줄이 걸렸다');}},
   {label:'장 마감 공시를 뒤진다',sub:'데이터 능력이 높을수록 숨은 악재를 찾는다',fn:()=>{spend(1,4);setCd('spx');if(chance(.3+S.st.dat/250)){const b=pick(ECON_BOMB),corp=pick(CORPS);const it=spItem(S.dept,[b[1],b[2],corp,`d:*공시 원문|n:관련 금액|w:증권사 애널리스트 "시장이 놓쳤다"|w:${corp} "정상적인 절차"`],{excl:true,pre:1,v:{corp},via:'공시',src:'공시'});spAdd(it,'평범해 보이는 공시 한 줄에 악재가 숨어 있었다');}else{gain('dat',.3);toast('공시 수십 건, 다 평범했다');}}}];
  if(mgOn()&&typeof mgEcon==='function')opts.push({label:'장 마감 10분 전 — 공시 해독',sub:'미니게임 · 다섯 줄 가운데 진짜 악재를 찾는다',fn:()=>{spend(1,4);setCd('spx');mgEcon();return false;}});
  openModal('증권가 정보 확인',`<p class="lede">여의도엔 하루에도 정보 수백 개가 돈다. 진짜는 몇 개 안 된다.</p><p class="hint">이달 시장 반응 ${kpiVal('mk')}/${kpiTarget('mk',4)} (기업 기사가 움직인 주가 폭의 합)</p>`,opts.concat([{label:'나중에',cls:'ghost'}]));}
const ECON_BOMB=[['감사보고서 — 계속기업 존속 능력에 중요한 불확실성','{corp} 감사인 "계속기업 불확실성"…상장폐지 우려',68],['최대주주 보유 주식 전량 담보 제공 계약','{corp} 최대주주 지분 전량 담보로…반대매매 우려',58],['전환사채 발행 — 전환가액 시가보다 30% 낮게','{corp} 헐값 전환사채…소액주주 지분 희석 우려',56],['단일판매·공급계약 해지 (매출액 대비 41%)','{corp} 매출 41% 계약 해지…실적 충격',62],['횡령·배임 혐의 발생 — 전 대표이사, 자기자본 대비 12%','{corp} 전 대표 횡령 혐의…거래 정지 가능성',70]];

// ---- 지역지: 지역 유지 지도 ----
const LORD_DEF=[{k:'head',r:'단체장',re:/군청|시청|군수|시장 |행정|예산|공무원|청사|공약/},{k:'cou',r:'지방의원',re:/의회|의원|조례|예산|보조금/},{k:'bld',r:'건설업체 대표',re:/건설|공사|재개발|아파트|시공|하천|도로|부지|개발/},{k:'cham',r:'상공회의소 회장',re:/상공|상권|상인|축제|관광|소상공|시장 상|유통|점포/}];
function lordsInit(){const P=spmS();if(P.lords)return P.lords;const city=pick(CITIES);P.lcity=city;const head=/군$/.test(city)?'군수':'시장';P.lords=LORD_DEF.map(d=>({k:d.k,n:rname(),r:d.k==='head'?`${city} ${head}`:d.k==='cou'?`${city} 의원`:d.r,rel:R(42,58),ad:d.k==='bld'||d.k==='cham'?2:1}));return P.lords;}
function lordOf(it){const L=lordsInit();const d=LORD_DEF.find(x=>x.re.test(it.title+' '+(it.subj||'')));return d?L.find(x=>x.k===d.k):null;}
function lordPub(it){const L=lordsInit();const lo=lordOf(it);if(!lo)return;const crit=CRIT_RE.test(it.title);
  if(crit){lo.rel=clamp(lo.rel-12,0,100);const other=pick(L.filter(x=>x!==lo));other.rel=clamp(other.rel+4,0,100);toast(`${lo.n} ${lo.r} 쪽 표정이 굳었다. ${other.n} ${other.r} 쪽은 웃는다`);}
  else{lo.rel=clamp(lo.rel+3,0,100);}}
function spLocal(){const L=lordsInit();
  const body=`<p class="lede">이 바닥은 네 사람이 움직인다. 누구와 밥을 먹을까.</p><div class="mgl">${L.map(x=>`<div class="mgk"><span style="flex:0 0 132px">${esc(x.n)} <small style="color:var(--mute)">${esc(x.r)}</small></span><div class="mgbar"><i style="width:${x.rel}%;background:${x.rel>=60?'var(--good)':x.rel>=35?'var(--sodium)':'var(--red)'}"></i></div><span class="mgs">${Math.round(x.rel)}</span></div>`).join('')}</div><p class="hint">관계가 높으면 제보와 광고가 오고, 낮으면 광고가 끊긴다. 한 사람을 비판하면 맞수가 웃는다.</p>`;
  openModal('지역 유지 만나기',body,L.map(x=>({label:`${x.n} ${jo2(x.r,'과','와')} 저녁`,sub:'관계↑ · 식사비 10만 · 맞수 이야기를 흘릴 수 있다',fn:()=>{spend(1,4);setCd('spx');S.money-=10;x.rel=clamp(x.rel+6,0,100);
     if(chance(.25+x.rel/300)){const tgt=pick(L.filter(y=>y!==x));const T={head:['{city} 군청 특정 업체 수의계약 몰아주기 의혹',60],cou:['{city} 의원 지역구 예산 끼워 넣기 정황',56],bld:['{city} 공사 현장 안전 관리 부실 정황',58],cham:['{city} 지역 축제 보조금 셀프 집행 의혹',52]}[tgt.k];
       const it=spItem(S.dept,[T[0],T[1],tgt.r,`w:*${x.r} 측근 "다 아는 얘기"|d:관련 서류|n:관련 금액 {m}억 원|w:${tgt.r} 측 "사실무근"`],{excl:true,pre:1,src:`${x.r} 측`,v:{city:(spmS()||{}).lcity||pick(CITIES)}});spAdd(it,`${x.n} ${jo2(x.r,'이','가')} 맞수 ${tgt.n} ${tgt.r} 얘기를 흘렸다`);}
     else if(chance(.3)){openModal('부탁',`<p class="lede">${esc(x.n)} ${esc(x.r)}: "이번에 우리 쪽 행사 좀 크게 써 주세요."</p>`,[{label:'써 준다',sub:'관계↑↑ · 신뢰↓ · 타협 쪽으로',fn:()=>{x.rel=clamp(x.rel+10,0,100);valN('ind',-3,'지역 유지 부탁으로 홍보 기사를 썼다');toast(quickClip(`${x.r} 주최 행사 성황`,30,12)+' · '+apply({trust:-1}));}},{label:'거절한다',sub:'관계 조금↓ · 독립 쪽으로',fn:()=>{x.rel=clamp(x.rel-3,0,100);valN('ind',2,'지역 유지 부탁을 거절했다');toast('"섭섭하네요."');}}]);return false;}
     else toast(`${x.n} ${jo2(x.r,'과','와')} 소주 한잔. 관계가 조금 가까워졌다`);}})).concat([{label:'나중에',cls:'ghost'}]));}
function spLocalMonth(lines){const L=lordsInit();const m=month(),y=2027+Math.floor(S.turn/YW);
  L.forEach(x=>{x.rel=clamp(x.rel+(50-x.rel)*.03,0,100);if(x.rel<25&&chance(.3)){lines.push({c:'r',t:`${x.n} ${x.r} 쪽이 광고·협찬을 끊었다. 광고국이 편집국을 원망한다`});if(!S.founder)apply({eval:-.6*x.ad});else try{S.co.cash-=.05*x.ad;}catch(e){}}
    else if(x.rel>=72&&chance(.22)&&S.rank>=1){const it=makeItem(S.dept,{excl:true,pre:1});it.src=`${x.r} 측`;S.items.push(it);lines.push({c:'g',t:`${x.n} ${jo2(x.r,'이','가')} 먼저 정보를 줬다 → 「${it.title}」`});}});
  if(m===5&&y%4===2&&spOnce('elect'))Q.push(()=>{const hd=L.find(x=>x.k==='head');openModal('지방선거',`<p class="lede">지방선거가 한 달 남았다. 현직 ${esc(hd.n)} ${esc(jo2(hd.r,'이','가'))} 재선에 나섰고, ${esc(L.find(x=>x.k==='cou').n)} 의원이 도전장을 냈다. 지역지의 사설 한 줄이 판을 흔든다.</p>`,[
    {label:'현직 지지 사설',sub:'단체장 관계↑↑ · 도전자 관계↓↓ · 신뢰↓',fn:()=>{hd.rel=clamp(hd.rel+20,0,100);L.find(x=>x.k==='cou').rel=clamp(L.find(x=>x.k==='cou').rel-20,0,100);valN('ind',-4,'선거에서 현직을 밀었다');toast(apply({trust:-2}));}},
    {label:'후보 검증 기획을 똑같이',sub:'신뢰↑ · 둘 다 조금 서운해한다',fn:()=>{L.forEach(x=>x.rel=clamp(x.rel-3,0,100));valN('ind',4,'선거를 공정하게 검증했다');const it=makeItem(S.dept,{excl:true,pre:1,mult:1.1});S.items.push(it);toast(`검증 기획 → 「${it.title}」 · `+apply({trust:2}));}},
    {label:'도전자 인터뷰를 크게',sub:'지방의원 관계↑↑ · 단체장 관계↓↓',fn:()=>{hd.rel=clamp(hd.rel-20,0,100);L.find(x=>x.k==='cou').rel=clamp(L.find(x=>x.k==='cou').rel+20,0,100);valN('ind',-2);toast(apply({fame:1}));}}]);});}

// ---- 영자지: 외신 기자클럽 ----
function spEng(){const opts=[{label:'외신 기자들과 정보를 나눈다',sub:'어학↑ · 단독 아이템이 나올 수 있다',fn:()=>{spend(1,3);setCd('spx');gain('lng',.5);if(chance(.3+S.st.lng/250)){const it=makeItem(S.dept,{excl:chance(.4),pre:1});it.src='외신 기자';S.items.push(it);itemFound(it,'외신 특파원이 흘린 한마디');}else toast('영어로 한참 떠들었다. 쓸 건 없었다');}},
   {label:'대사관 리셉션에 간다',sub:'외교가 신뢰↑ · 평판 조금↑',fn:()=>{spend(1,4);setCd('spx');spmV(4);toast('명함 열 장 · '+apply({fame:.5}));}}];
  if(mgOn()&&typeof mgEng==='function')opts.push({label:'외교 발언 번역 감수',sub:'미니게임 · 한 단어가 외교 문제가 된다',fn:()=>{spend(1,3);setCd('spx');mgEng();return false;}});
  openModal('외신 기자클럽',`<p class="lede">외신이 우리 기사를 인용하면 그게 평가다.</p><p class="hint">이달 외신 인용 ${kpiVal('cite')}/${kpiTarget('cite',1)} · 완성도가 높고 어학이 좋을수록 인용된다</p>`,opts.concat([{label:'나중에',cls:'ghost'}]));}

// ---- 인터넷: 실시간 이슈 ----
function spOnline(){const opts=[{label:'지금 뜨는 이슈를 받아 쓴다',sub:'조회수↑ · 확인이 얕아 틀릴 수 있다',risk:true,fn:()=>{spend(1,3);setCd('spx');const kw=pick(ONL_KW);const fx=quickClip(`${kw[0]}…온라인 시끌`,30+S.st.spd*.3,R(18,34)*(kw[1]?1:.7));if(!kw[1]&&chance(.5)){valN('sp',2,'확인 안 된 실시간 이슈를 받아 썼다');toast(`알고 보니 루머였다. 정정 기사를 냈다 · ${fx} · `+apply({trust:-1.5}));}else toast(`실시간 이슈 기사 · ${fx}`);}},
   {label:'뜨는 이슈를 팩트체크한다',sub:'느리지만 신뢰↑ · 조회수는 덜',fn:()=>{spend(1,5);setCd('spx');const kw=pick(ONL_KW);valN('sp',-2,'뜨는 이슈를 팩트체크했다');toast(quickClip(`[팩트체크] ${kw[0]}, 사실은?`,50+S.st.ver*.3,R(14,26))+' · '+apply({trust:.8}));}}];
  if(mgOn()&&typeof mgOnline==='function')opts.push({label:'실시간 검색어 타기',sub:'미니게임 · 뜨는 순간을 잡아 출고한다',fn:()=>{spend(1,3);setCd('spx');mgOnline();return false;}});
  openModal('실시간 이슈 기사',`<p class="lede">조회수가 월급이다. 하지만 틀리면 다 날아간다.</p><p class="hint">이달 조회수 ${kpiVal('pv').toLocaleString('ko-KR')}/${Math.round(kpiTarget('pv',0)).toLocaleString('ko-KR')}</p>`,opts.concat([{label:'나중에',cls:'ghost'}]));}
const ONL_KW=[['유명 맛집 위생 논란',1],['아이돌 콘서트 티켓 사기',1],['지하철 2호선 운행 지연',1],['"내일 휴교" 단톡방 캡처',0],['편의점 신상 품절 대란',1],['연예인 열애설 사진',0],['폭설 예보에 사재기',1],['"이 앱 쓰면 개인정보 털린다"',0],['고속도로 귀성길 정체',1],['유명 유튜버 사기 폭로',0]];

// ---- 주간지: 커버 기획회의 ----
function spWeekly(){const P=spmS();const L=S.items.filter(i=>i.facts.length>=3);const cur=S.items.find(i=>i.cover);
  const opts=L.slice(0,4).map(it=>({label:`「${yamaShort(it.title,28)}」${jp(yamaShort(it.title,28),'을','를')} 커버로`,sub:`${gradeOf(it)}급 · 확인 ${it.facts.filter(fOK).length}/${it.facts.length} · 이번 달 안에 내야 한다`,fn:()=>{spend(1,3);setCd('spx');
     const go=ok=>{if(ok){S.items.forEach(x=>x.cover=0);it.cover=1;P.cov={iid:it.id,t:S.turn};spmV(2);toast('커버로 확정됐다. 표지 시안이 나온다');}else toast('편집회의에서 밀렸다. "이걸로 표지가 되겠어?"');};
     if(mgOn()&&typeof mgWeekly==='function'){mgWeekly(it,go);return false;}go(chance(.45+S.eval/250+({S:.25,A:.15,B:.05}[gradeOf(it)]||0)));}}));
  openModal('커버 기획회의',`<p class="lede">이번 호 표지를 정하는 회의다.${cur?` 지금 커버: 「${esc(yamaShort(cur.title,26))}」`:' 아직 커버가 없다.'}</p><p class="hint">커버 기사는 파급력이 크게 붙고, 나머지 기사는 덜 주목받는다. 정해 놓고 그달 안에 못 내면 펑크다.</p>`,(opts.length?opts:[{label:'커버감이 없다',sub:'확인할 사실이 셋 이상인 아이템이 필요하다',disabled:true}]).concat([{label:'나중에',cls:'ghost'}]));}
function spWeeklyMonth(lines){const P=spmS();if(P.cov&&S.turn-P.cov.t>=4){const it=S.items.find(x=>x.id===P.cov.iid);if(it)it.cover=0;P.cov=null;spmV(-6);lines.push({c:'r',t:'커버 펑크 — 정해 둔 커버스토리를 그달 안에 못 냈다. 급히 다른 기사로 표지를 메웠다 · '+(S.founder?apply({fame:-.5}):apply({eval:-1}))});}}

// ---- 공통 진입 ----
RUN.gongse=function(){atkAct();};
RUN.spx=function(){const m=spmId();if(!m){toast('이 매체엔 고유 업무가 없다');return;}
  const F={edu:spEdu,med:spMed,tech:spTech,law:spLaw,sports:spSports,star:spStar,wire:spWire,tv:spTV,ch:spCH,daily:spDaily,econ:spEcon,local:spLocal,eng:spEng,online:spOnline,weekly:spWeekly}[m];
  const MG2={edu:['단톡방 팩트체크','mgEdu'],med:['임상 데이터 판독','mgMed'],tech:['유출 사양 판별','mgTech'],law:['법정 방청','mgLaw'],sports:['문자중계 마감','mgSports']}[m];
  if(MG2&&mgOn()&&typeof window[MG2[1]]==='function'){openModal(SPM[m].act,`<p class="lede">${esc(SPM[m].d)}</p>`,[{label:SPM[m].act,sub:'이 매체의 기본 업무',fn:()=>{F();return false;}},{label:MG2[0],sub:'미니게임',fn:()=>{spend(1,4);setCd('spx');window[MG2[1]]();return false;}},{label:'나중에',cls:'ghost'}]);return;}
  F();};
function spmMonth(lines){const P=spmS();if(!P){S.km={};return;}
  if(!P.intro&&(S.rank>=1||S.founder)){P.intro=1;const D=SPM[P.m];Q.push(()=>openModal(`${OUT().n}에서 일한다는 것 · ${D.n}`,`<p class="lede">${D.rule}</p><p>이 매체만의 일: <b>${D.act}</b>. 핵심 지표는 <b>${D.meter}</b>다.${D.main?' 매달 이 매체의 성과 기준으로 평가가 오르내린다.':' 높을수록 매달 평가가 오르고, 낮으면 깎인다.'}</p>`,[{label:'알겠다'}]));}
  if(S.rank>=1||S.founder)try{({edu:spEduMonth,med:spMedMonth,tech:spTechMonth,law:spLawMonth,sports:spSportsMonth,star:spStarMonth,wire:spWireMonth,local:spLocalMonth,weekly:spWeeklyMonth})[P.m]?.(lines);}catch(e){console.error(e);}
  try{kpiMonth(lines);}catch(e){console.error(e);S.km={};}
  P.v=clamp(P.v+(40-P.v)*.03,0,100);
  if(!SPM[P.m].main&&S.rank>=1&&S.rank<7){const k=(P.v-45)/45;if(Math.abs(k)>=.12){const fx=S.founder?apply({fame:k*.5}):apply({eval:k*(S.rank>=4?.6:1),fame:k>0?k*.3:0});if(fx)lines.push({c:k>0?'g':'r',t:`${SPM[P.m].meter} ${Math.round(P.v)} — ${k>0?'업계가 우리를 믿는다':'업계의 시선이 차갑다'} · ${fx}`});}}}
function spmBox(){const P=spmS();if(!P)return '';const D=SPM[P.m],v=Math.round(P.v);let ex='';
  if(P.m==='edu')ex=`학원 광고 의존 ${Math.round(P.ac)} · 이달: ${({3:'새 학기',6:'6월 모의평가',9:'수시 원서',11:'수능',12:'정시',1:'정시',2:'합격 발표'})[month()]||'입시 준비'}`;
  if(P.m==='med'){const E=P.emb.filter(e=>!e.lift);ex=E.length?`엠바고 중: ${E.map(e=>`「${esc(e.h)}」 해제까지 ${moTxt(Math.max(0,e.until-S.turn))}`).join(' · ')}`:'쥐고 있는 엠바고 없음';}
  if(P.m==='tech')ex=P.ch?`${esc(P.ch.corp)} ${esc(P.ch.prod)} 퍼즐 ${P.ch.got.filter(Boolean).length}/3 · 출시까지 ${moTxt(Math.max(0,P.ch.due-S.turn))}`:'맞추는 퍼즐 없음';
  if(P.m==='sports'){const pr=P.rum.filter(r=>r.pub&&!r.done);ex=`${spSeason(month())}${pr.length?` · 터뜨린 이적설: ${pr.map(r=>`${esc(r.who)}→${esc(r.team)}`).join(', ')}`:''}`;}
  if(P.m==='star')ex=`${P.vip?'다음 톱스타 커버 약속 있음 · ':''}지켜보는 신인 ${P.ris.filter(r=>!r.done).length}명`;
  if(P.m==='law')ex='판례가 바뀌는 판결을 찾아내는 눈이 실력이다';
  if(P.m==='tv')ex=`그림 없는 아이템 ${S.items.filter(i=>!tvFt(i)).length}건`;
  if(P.m==='weekly'){const c=S.items.find(i=>i.cover);ex=c?`이번 호 커버: 「${esc(yamaShort(c.title,26))}」`:'이번 호 커버를 아직 정하지 않았다';}
  if(P.m==='local'&&P.lords)ex=P.lords.map(x=>`${esc(x.r)} ${Math.round(x.rel)}`).join(' · ');
  if(P.m==='wire')ex='두 주 넘게 묵힌 아이템은 단독 가치가 사라진다';
  const K=kpiRows();const kt=K.length?`<p class="hint" style="margin:4px 0 0">이달 성과: ${K.map(x=>`${x.n} ${x.k==='pv'?Math.round(x.v).toLocaleString('ko-KR'):x.v}/${x.k==='pv'?Math.round(x.tg).toLocaleString('ko-KR'):x.tg}`).join(' · ')}</p>`:'';
  return `<div class="card"><div class="t">${ic(D.ic)} ${D.n} · ${esc(OUT().n)}만의 규칙</div><div style="display:flex;align-items:center;gap:10px;margin:4px 0"><span style="font-size:13px;color:var(--mute);white-space:nowrap">${D.meter}</span><div style="flex:1;height:8px;border-radius:4px;background:var(--line,rgba(255,255,255,.12));overflow:hidden"><div style="width:${v}%;height:100%;background:${v>=55?'var(--good)':v>=35?'var(--sodium,#ffb84d)':'var(--red)'}"></div></div><b style="font-variant-numeric:tabular-nums">${v}</b></div>${ex?`<p class="hint" style="margin:4px 0 0">${ex}</p>`:''}${kt}</div>`;}

// 매체 유형별 모드 (특수 매체는 고유 모드)
function outMode(){if(!S||!S.outlet)return null;let o;try{o=OUT();}catch(e){return null;}if(!o)return null;if(SPM_OF[o.id])return SPM_OF[o.id];const d=o.depts||[];
  if(o.type==='trade')return d.includes('med')?'med':d.includes('edu')?'edu':d.includes('court')?'law':'tech';
  if(o.type==='sports')return 'sports';
  return ({wire:'wire',tv:'tv',jp:'tv',ch:'ch',daily:'daily',econ:'econ',local:'local',eng:'eng',online:'online',weekly:'weekly'})[o.type]||null;}
// ===== 1.1 매체마다 다른 수습 순회 (사쓰마와리 자리) =====
const SASU_CFG={
 police:{n:'사쓰마와리',d:'새벽 경찰서·응급실·소방서를 돌며 사건을 챙긴다',
  tip:'새벽 경찰서·응급실·소방서를 세 곳 골라 돈다. 단서는 아이템이 되고, 안면을 튼 형사는 취재원이 된다. 마지막에 캡에게 어떻게 보고할지 고른다.',
  open:'새벽 1시 40분. {cap} 캡: "라인 다 돌고 3시까지 보고해."',end:'새벽 3시. {cap} 캡에게 보고할 시간이다.',RN:['강력 라인','야간 사고 라인','생활 사건 라인'],
  L:[{n:'중부경찰서 형사과',s:'강력 사건 담당',k:1.1},{n:'남부경찰서 당직실',s:'밤새 들어온 신고',k:1},{n:'동부경찰서 여성청소년계',s:'민감한 사건이 많다',k:1.1},{n:'대학병원 응급실',s:'사고 환자가 실려 온다',k:1},{n:'소방서 상황실',s:'화재·구조 출동 기록',k:.9},{n:'역전 지구대',s:'취객과 시비, 가끔 큰 건',k:.8},{n:'구치소 접견실 앞',s:'변호사들이 드나든다',k:1.1}],
  cold:['"기자 양반, 오늘은 없어."','당직 형사가 눈길도 주지 않는다.','"수습이야? 커피나 한 잔 하고 가."','조용한 밤. 사건 일지는 텅 비었다.'],
  memo:['밤사이 접수된 절도 신고 3건 메모','교통사고 경위 한 줄 확인','실종 신고 접수, 아침에 귀가','주취 폭행 현행범 1명 입건','응급실 이송 환자 2명 상태 확인','소방 출동 기록: 주택 화재 1건, 인명 피해 없음','지구대장 "이번 주 보이스피싱 신고가 늘었다"'],
  big:['형사들이 수군거리는 큰 사건 냄새 — 선배에게 넘길 정보다','관할 간부가 흘린 「다음 주 대대적 단속」 정보','같은 수법 절도가 이어진다는 형사 귀띔'],
  miss:['밤사이 난 사고를','지구대 폭행 사건을','응급실 이송 건을'],roles:null},
 sports:{n:'구장 돌기',d:'구장·훈련장·협회를 돌며 선수단 소식을 챙긴다',
  tip:'구장·훈련장·협회 사무국을 세 곳 골라 돈다. 들은 이야기는 정보보고 거리가 되고, 안면을 튼 사람은 취재원이 된다. 마지막에 캡에게 어떻게 보고할지 고른다.',
  open:'오후 3시. {cap} 캡: "경기 전에 세 군데 다 돌고 와."',end:'경기 시작 30분 전. {cap} 캡에게 보고할 시간이다.',RN:['경기장 라인','훈련장 라인','사무국 라인'],
  L:[{n:'가람 구장 기자실',s:'경기 전 감독 브리핑',k:1},{n:'누리 이글스 훈련장',s:'선수들 출근길',k:1},{n:'협회 사무국',s:'징계위원회 소문',k:1.2},{n:'대학병원 재활센터',s:'부상 선수 정보',k:1.1},{n:'에이전트 사무실',s:'이적 시장 동향',k:1.2},{n:'선수촌 정문',s:'국가대표 소집',k:1}],
  cold:['"오늘은 훈련만 해요." 홍보팀이 막아섰다.','라커룸 문은 굳게 닫혀 있었다.','감독은 질문 두 개만 받고 들어갔다.','비가 와서 훈련이 취소됐다.'],
  memo:['선발 로테이션이 바뀐다는 얘기','부상 선수 재활이 2주 더 걸린다','유망주 1군 콜업 검토 중','훈련장에서 코치진 언쟁 목격','에이전트 "해외 구단이 관심 보인다"','협회 "다음 주 징계위 연다"'],
  big:['구단 프런트가 긴급 회의 중이다 — 큰 건 냄새','트레이드 소문이 선수단에 돈다','협회 징계위에 거물 이름이 올랐다는 귀띔'],
  miss:['선발 교체 소식을','부상 소식을','징계 소식을'],roles:'spo'},
 wire:{n:'야간 속보 당번',d:'경찰·소방 상황실과 공항·기상청에 밤새 전화를 돌린다',
  tip:'밤새 상황실 세 곳에 전화를 돌린다. 통신사는 1보가 생명이라 들은 걸 곧장 당번 일지에 적는다. 안면을 튼 당직자는 취재원이 된다. 마지막에 야간 데스크에 어떻게 넘길지 고른다.',
  open:'밤 11시 반. {cap} 캡: "상황실 다 돌려. 뭐라도 나오면 바로 불러."',end:'새벽 4시. {cap} 캡에게 당번 일지를 넘길 시간이다.',RN:['치안 라인','재난 라인','교통 라인'],
  L:[{n:'경찰청 상황실',s:'밤새 들어온 112 신고',k:1,r:'상황실 당직 경찰'},{n:'소방본부 종합상황실',s:'화재·구조 출동',k:1,r:'소방 상황 요원'},{n:'공항 운영 상황실',s:'항공기 지연·회항',k:.9,r:'공항 운영 직원'},{n:'기상청 예보 상황실',s:'특보 발령',k:.8,r:'기상청 예보관'},{n:'해양경찰 상황실',s:'선박 사고',k:1.1,r:'해경 상황 요원'},{n:'전력 공급 상황실',s:'정전 신고',k:.9,r:'전력 상황실 직원'}],
  cold:['"특이사항 없습니다." 전화가 끊겼다.', '당직자가 전화를 받지 않는다.', '"아까 다른 통신사에도 말했어요. 별거 없어요."', '신호음만 길게 갔다. 쓸 만한 건 없었다.'],
  memo:['새벽 정전 신고가 몰린다 — 원인 확인 중','항공편 세 편이 기상 악화로 회항','어선 한 척 기관 고장, 해경이 예인 중','강풍 주의보 발령 예정','고속도로 3중 추돌, 인명 피해 없음'],
  big:['상황실 분위기가 심상치 않다 — 대형 사고 냄새','"곧 브리핑 있을 겁니다" 당직 간부의 귀띔','같은 지역 신고가 한꺼번에 몰린다'],
  miss:['새벽 사고 1보를','정전 속보를','회항 소식을'],roles:['상황실 당직 경찰','소방 상황 요원','공항 운영 직원','기상청 예보관','해경 상황 요원']},
 tv:{n:'현장 수습',d:'카메라 기자와 중계차를 따라 사건 현장을 돈다',
  tip:'카메라 기자와 중계차를 따라 현장 세 곳을 돈다. 방송은 그림이 절반이라 현장에서 방송감이 는다. 안면을 튼 사람은 취재원이 된다. 마지막에 야간 데스크에 어떻게 보고할지 고른다.',
  open:'밤 9시. {cap} 캡: "중계차 따라가. 그림 되는 거 있으면 바로 연락해."',end:'밤 12시. {cap} 캡에게 현장 상황을 보고할 시간이다.',RN:['사건 현장 라인','병원·법원 라인','편집실 라인'],
  L:[{n:'경찰서 앞 중계차',s:'야간 사건 대기',k:1,r:'강력팀 형사'},{n:'대학병원 응급실 앞',s:'사고 환자 이송',k:1,r:'병원 홍보 담당'},{n:'화재 현장 통제선',s:'소방 브리핑',k:1.1,r:'현장 소방관'},{n:'보도국 편집실',s:'선배 리포트 편집 보조',k:.8,r:'보도국 편집기자'},{n:'헬기 계류장',s:'항공 촬영 대기',k:.9,r:'항공 촬영 기사'},{n:'법원 앞 포토라인',s:'출석 피의자 대기',k:1.1,r:'법원 경위'}],
  cold:['카메라 기자 선배: "오늘은 그림이 없네. 철수하자."', '세 시간을 서 있기만 했다.', '"수습, 스탠드업 연습이나 해 둬."', '조용했다. 카메라만 돌았다.'],
  memo:['소방관 인터뷰 한 컷', '보호자 반응 스케치', '선배 리포트 자막 손봄', '야간 현장 그림 확보', '질문 하나 던져 봄'],
  big:['현장 형사들이 카메라를 피한다 — 뭔가 있다','소방 관계자가 "내일 큰 발표"를 흘렸다','중계차 PD가 "이거 메인 감이다"라고 했다'],
  miss:['화재 현장 그림을','포토라인 장면을','응급실 이송 장면을'],roles:['현장 소방관','강력팀 형사','병원 홍보 담당','중계차 PD','법원 경위']},
 econ:{n:'여의도 돌기',d:'증권사·거래소·은행·금융당국을 돌며 시장 동향을 챙긴다',
  tip:'증권사·거래소·은행 세 곳을 골라 돈다. 들은 동향은 정보보고 거리가 되고, 안면을 튼 사람은 취재원이 된다. 마지막에 캡에게 어떻게 보고할지 고른다.',
  open:'오전 7시 반. {cap} 캡: "장 열리기 전에 한 바퀴 돌고, 마감 전에 보고해."',end:'오후 4시. {cap} 캡에게 여의도 동향을 보고할 시간이다.',RN:['증권가 라인','금융권 라인','기업 라인'],
  L:[{n:'증권사 리서치센터',s:'애널리스트 리포트',k:1,r:'증권사 애널리스트'},{n:'거래소 공시실',s:'장중 공시',k:1.1,r:'거래소 공시 담당'},{n:'은행 본점 홍보실',s:'대출·금리',k:.9,r:'은행 홍보팀 과장'},{n:'금융감독원 기자실',s:'제재·조사',k:1.2,r:'금감원 직원'},{n:'대기업 IR팀',s:'실적 발표',k:1,r:'기업 IR 담당'},{n:'사모펀드 사무실',s:'인수합병 소문',k:1.1,r:'사모펀드 심사역'}],
  cold:['"오늘은 조용합니다." 담당자는 바빴다.', '담당자가 고개만 저었다.', '"그건 공식 자료 보세요."', '한 시간 기다렸지만 건진 건 커피뿐이다.'],
  memo:['장 마감 후 공시 세 건 정리', '목표주가를 내린 증권사 리포트', '대출 금리가 오른다는 은행권 얘기', '외국인 순매도가 이어진다는 시황', '"실적 발표를 앞당긴다"는 IR 쪽 얘기'],
  big:['애널리스트가 "그 회사 곧 터진다"고 흘렸다','공시실 분위기가 이상하다 — 대형 공시 대기','금감원 쪽에서 "조사 들어간다"는 귀띔'],
  miss:['장 마감 공시를','실적 정정 공시를','금리 인상 소식을'],roles:['증권사 애널리스트','거래소 공시 담당','은행 홍보팀 과장','기업 IR 담당','금감원 직원']},
 local:{n:'시·군청 돌기',d:'군청·읍사무소·군의회·장터를 돌며 지역 소식을 챙긴다',
  tip:'군청·읍사무소·군의회·장터 가운데 세 곳을 돈다. 지역지는 사람이 곧 취재원이라 안면 트기가 가장 중요하다. 마지막에 지역 데스크에 어떻게 보고할지 고른다.',
  open:'오전 9시. {cap} 캡: "군청 한 바퀴 돌고, 장터도 들러. 오후에 보고해."',end:'오후 5시. {cap} 캡에게 하루 동향을 보고할 시간이다.',RN:['군청 라인','의회 라인','장터 라인'],
  L:[{n:'군청 기획실',s:'예산·사업 결재',k:1,r:'군청 계장'},{n:'읍사무소 민원실',s:'주민 민원',k:.9,r:'읍장'},{n:'군의회 사무국',s:'임시회·조례',k:1.1,r:'군의회 사무국 직원'},{n:'농협 지점',s:'수매가·대출',k:.9,r:'농협 지점장'},{n:'5일장',s:'상인 이야기',k:.8,r:'장터 상인회장'},{n:'파출소',s:'농기계 도난·사고',k:1,r:'파출소 경위'}],
  cold:['"기자님, 오늘은 조용해요." 담당자가 웃었다.', '사람들만 북적였다.', '"그건 윗선 결재 나야 말씀드려요."', '어르신들 이야기만 한 시간 들었다.'],
  memo:['마을회관 보수 공사 예산 확정','군의회 임시회 일정 공고','농협 수매가 인상 검토','장터 상인 "손님이 줄었다"','파출소 "농기계 도난이 늘었다"'],
  big:['군청 계장이 "이거 쓰면 난리 난다"고 흘렸다','군의원들 사이에 이상한 말이 돈다','건설업체 사장이 군수실을 자주 드나든다'],
  miss:['군의회 소식을','장터 화재 소식을','예산 삭감 소식을'],roles:['군청 계장','읍장','군의회 사무국 직원','농협 지점장','파출소 경위']},
 eng:{n:'외신·대사관 돌기',d:'외신 기자클럽·대사관·외교부를 돌며 소식을 챙긴다',
  tip:'외신 기자클럽·대사관·외교부 가운데 세 곳을 돈다. 어학이 늘고, 안면을 튼 외교가 사람들은 취재원이 된다. 마지막에 데스크에 영문 메모를 어떻게 보낼지 고른다.',
  open:'오후 6시. {cap} 캡: "리셉션 두 곳 들르고, 외교부 백브리핑도 챙겨."',end:'밤 10시. {cap} 캡에게 영문 메모를 보낼 시간이다.',RN:['외교 라인','외신 라인','경제·관광 라인'],
  L:[{n:'외신 기자클럽',s:'특파원들 동향',k:1,r:'외신 특파원'},{n:'대사관 리셉션',s:'외교관들과 잡담',k:1.1,r:'대사관 공보관'},{n:'외교부 기자실',s:'백브리핑',k:1.1,r:'외교부 당국자'},{n:'관광공사 해외팀',s:'외국인 관광 통계',k:.8,r:'관광공사 해외팀장'},{n:'외국계 기업 홍보팀',s:'한국 지사 소식',k:.9,r:'외국계 기업 홍보 이사'},{n:'외국인 지원센터',s:'외국인 노동자 상담',k:1,r:'외국인 지원센터 상담사'}],
  cold:['"Nothing new today." 상대가 어깨를 으쓱했다.', '인사만 나누고 끝났다.', '"엠바고 걸린 것뿐이에요."', '영어로 한 시간 떠들었지만 건진 건 없다.'],
  memo:['대사관 다음 달 행사 일정', '외국인 관광객 회복세 통계', '외신이 주목하는 한국 이슈 정리', '외국계 기업 한국 지사 인사', '외국인 노동자 상담이 급증했다는 얘기'],
  big:['한 대사관 관계자가 "곧 큰 발표가 있다"고 흘렸다','외신 기자들이 같은 사건을 쫓고 있다','외교부 분위기가 심상치 않다'],
  miss:['대사관 발표를','외신발 속보를','외교부 브리핑 내용을'],roles:['외신 특파원','대사관 공보관','외교부 당국자','관광공사 해외팀장','외국계 기업 홍보 이사']},
 online:{n:'커뮤니티 모니터링',d:'커뮤니티·SNS·라이브 방송을 훑으며 뜨는 이슈를 챙긴다',
  tip:'커뮤니티·SNS·라이브 방송 가운데 세 곳을 훑는다. 뜨는 이슈는 정보보고 거리가 되고, 연락이 닿은 제보자는 취재원이 된다. 가짜 글이 섞여 있으니 보고할 때 조심하자.',
  open:'밤 10시. {cap} 캡: "커뮤니티 세 군데 훑고, 뜨는 거 있으면 바로 보고해."',end:'새벽 1시. {cap} 캡에게 오늘의 이슈를 보고할 시간이다.',RN:['커뮤니티 라인','SNS 라인','영상 라인'],
  L:[{n:'대형 커뮤니티 게시판',s:'인기 글·폭로 글',k:1,r:'커뮤니티 운영자'},{n:'SNS 실시간 트렌드',s:'급상승 키워드',k:1,r:'SNS 계정 운영자'},{n:'유튜브 라이브',s:'실시간 방송',k:.9,r:'유튜버'},{n:'포털 댓글 창',s:'여론 흐름',k:.8,r:'포털 댓글 모니터 요원'},{n:'지역 맘카페',s:'동네 제보',k:1.1,r:'지역 맘카페 운영진'},{n:'익명 직장인 앱',s:'회사 내부 글',k:1.2,r:'익명 앱 제보자'}],
  cold:['같은 짤만 계속 돈다.', '올라오는 건 연예인 생일 축하뿐이다.', '광고 글만 넘쳤다.', '싸움만 오가고 기사거리는 없다.'],
  memo:['커뮤니티 인기 글: 동네 식당 바가지 논란','SNS 급상승: 지하철 고장 제보','맘카페 "학교 급식이 이상하다"는 글','유튜버 폭로 예고 영상','직장인 앱 "구조조정 명단이 돈다"(확인 필요)'],
  big:['같은 제보가 여러 커뮤니티에 동시에 올라온다','내부자라는 사람이 메시지를 보내왔다','삭제된 글 캡처가 돌기 시작했다'],
  miss:['커뮤니티발 이슈를','실시간 트렌드 1위를','유튜버 폭로를'],roles:['커뮤니티 운영자','제보자','지역 맘카페 운영진','유튜버','익명 앱 제보자']},
 weekly:{n:'자료실·인터뷰 수습',d:'도서관·판결문 열람실·연구실을 돌며 기획 자료를 모은다',
  tip:'자료실·열람실·연구실 가운데 세 곳을 돈다. 주간지는 깊이로 승부해서, 모은 자료가 선배 기획의 뼈대가 된다. 안면을 튼 사람은 취재원이 된다.',
  open:'오전 10시. {cap} 캡: "자료 세 군데 뒤져 와. 저녁에 메모 넘겨."',end:'밤 9시. {cap} 캡에게 취재 메모를 넘길 시간이다.',RN:['기록 라인','전문가 라인','시민사회 라인'],
  L:[{n:'국회도서관',s:'오래된 보고서',k:.9,r:'국회도서관 사서'},{n:'판결문 열람실',s:'판결문 대조',k:1.1,r:'법원 기록계 직원'},{n:'정보공개청구 창구',s:'공개·비공개 결정',k:1,r:'정보공개 담당 공무원'},{n:'대학 연구실',s:'전문가 인터뷰',k:.9,r:'대학 교수'},{n:'시민단체 사무실',s:'피해 사례',k:1.1,r:'시민단체 활동가'},{n:'퇴직 공무원 모임',s:'옛날 이야기',k:1.2,r:'퇴직 공무원'}],
  cold:['하루를 보냈지만 헛걸음이다.', '"자료 보세요"라는 말만 돌아왔다.', '"비공개"라는 답만 받았다.', '만나려던 사람이 자리를 비웠다.'],
  memo:['10년 치 감사 보고서 목록 정리','판결문 다섯 건에서 같은 업체 이름 발견','정보공개 청구 결과 일부 공개','연구실에서 관련 논문 세 편 입수','퇴직 공무원 "그때도 같은 일이 있었다"'],
  big:['오래된 문서에서 같은 이름이 반복된다','퇴직 공무원이 "다 말하겠다"고 했다','비공개 처리된 부분이 수상하다'],
  miss:['같은 판결문 기사를','시민단체 보고서 기사를','정보공개 결과 기사를'],roles:['국회도서관 사서','법원 기록계 직원','대학 교수','시민단체 활동가','퇴직 공무원']},
 edu:{n:'학교·학원가 돌기',d:'교육청·학원가·교무실을 돌며 교육 현장 소식을 챙긴다',
  tip:'교육청·학원가·교무실 가운데 세 곳을 돈다. 교육 기사는 학부모가 읽는다. 들은 이야기는 정보보고 거리가 되고, 안면을 튼 사람은 취재원이 된다.',
  open:'오전 9시. {cap} 캡: "교육청 들렀다가 학원가도 돌아. 오후에 보고해."',end:'오후 6시. {cap} 캡에게 교육 현장 동향을 보고할 시간이다.',RN:['행정 라인','학교 라인','학원가 라인'],
  L:[{n:'교육청 장학사실',s:'정책·감사',k:1,r:'장학사'},{n:'대치동 학원가',s:'입시 동향',k:1,r:'학원 상담실장'},{n:'고교 교무실',s:'현장 교사',k:1,r:'현직 교사'},{n:'학부모 설명회장',s:'학부모 걱정',k:.9,r:'학부모 대표'},{n:'대학 입학처',s:'전형 변경',k:1.1,r:'입학사정관'},{n:'교원단체 사무실',s:'교권 문제',k:1.1,r:'교원단체 간사'}],
  cold:['"오늘은 드릴 말씀이 없네요."', '담당자가 회의 중이라 만나지 못했다.', '"그건 공식 발표 때 보세요."', '한 시간 기다렸지만 헛걸음이다.'],
  memo:['교육청 감사 일정이 잡혔다는 얘기', '"의대 반이 두 배로 늘었다"는 학원가 얘기', '"고교학점제 시간표가 엉망"이라는 교사 불만', '"돌봄교실이 줄었다"는 학부모 하소연', '대입 전형 일부가 바뀐다는 얘기'],
  big:['장학사가 "감사에서 큰 게 나왔다"고 흘렸다','학원가에 시험지 유출 소문이 돈다','교원단체가 내부 문건을 갖고 있다'],
  miss:['감사 결과를','전형 변경 소식을','교권 사건을'],roles:['장학사','학원 상담실장','현직 교사','학부모 대표','입학사정관']},
 med:{n:'병원·제약사 돌기',d:'대학병원·응급실·제약사·학회를 돌며 의료 소식을 챙긴다',
  tip:'대학병원·응급실·제약사 가운데 세 곳을 돈다. 의료 기사는 틀리면 바로 티가 난다. 들은 이야기는 정보보고 거리가 되고, 안면을 튼 의료인은 취재원이 된다.',
  open:'오전 8시. {cap} 캡: "병원 두 곳이랑 제약사 한 곳 돌고 와."',end:'오후 5시. {cap} 캡에게 의료 동향을 보고할 시간이다.',RN:['병원 라인','제약 라인','정책 라인'],
  L:[{n:'대학병원 홍보실',s:'병원 소식',k:.9,r:'병원 홍보팀장'},{n:'응급실',s:'환자 이송·병상',k:1.1,r:'응급실 간호사'},{n:'제약사 영업소',s:'신약·영업',k:1,r:'제약사 영업사원'},{n:'학회 사무국',s:'학회 발표',k:1,r:'학회 관계자'},{n:'보건소',s:'감염병·예방접종',k:1,r:'보건소 직원'},{n:'약국 거리',s:'품절 약',k:.9,r:'약사'}],
  cold:['"보도자료 보세요." 짧은 답만 돌아왔다.', '다들 너무 바빠 말 붙일 틈이 없었다.', '담당자가 자리에 없었다.', '"다음 주에 다시 오세요."'],
  memo:['응급실 병상이 밤마다 꽉 찬다는 얘기', '"신약 허가 신청을 냈다"는 제약사 얘기', '독감 환자가 늘었다는 보건소 집계', '감기약 일부가 품절이라는 약국가 얘기', '다음 달 새 진료 지침이 나온다는 학회 얘기'],
  big:['전공의가 "병원이 숨기는 게 있다"고 했다','제약사 영업사원이 리베이트 얘기를 흘렸다','보건소 쪽에서 집단 감염 냄새가 난다'],
  miss:['병상 부족 소식을','품절 약 소식을','신약 허가 소식을'],roles:['전공의','응급실 간호사','제약사 영업사원','학회 관계자','보건소 직원']},
 tech:{n:'판교·전자상가 돌기',d:'판교·전자상가·협력사 공단을 돌며 업계 소식을 챙긴다',
  tip:'판교·전자상가·협력사 공단 가운데 세 곳을 돈다. 전문지 독자는 업계 사람들이라 정확해야 한다. 들은 이야기는 정보보고 거리가 되고, 안면을 튼 사람은 취재원이 된다.',
  open:'오전 10시. {cap} 캡: "판교 한 바퀴 돌고, 협력사도 들러."',end:'오후 6시. {cap} 캡에게 업계 동향을 보고할 시간이다.',RN:['판교 라인','유통 라인','협력사 라인'],
  L:[{n:'판교 스타트업 거리',s:'투자·채용',k:1,r:'스타트업 대표'},{n:'용산 전자상가',s:'제품 가격·재고',k:.8,r:'상가 사장'},{n:'협력사 공단',s:'부품 발주',k:1.2,r:'협력사 공장장'},{n:'전시장',s:'신제품 공개',k:1,r:'전시 기획자'},{n:'대기업 R&D센터 앞',s:'연구원 이야기',k:1.1,r:'연구원'},{n:'개발자 모임',s:'서비스 장애·보안',k:1,r:'개발자'}],
  cold:['담당자는 미팅 중이었다.', '"요즘 조용해요"라는 말뿐이었다.', '경비원이 출입을 막았다.', '명함만 나누고 끝났다.'],
  memo:['"다음 달 감원한다"는 스타트업 얘기', '새 그래픽카드 재고가 없다는 상가 얘기', '"발주량이 30% 줄었다"는 협력사 얘기', '신제품 시제품을 봤다는 목격담', '"어제 서비스 장애, 원인은 따로 있다"는 개발자 얘기'],
  big:['협력사 공장장이 "본사 신제품이 미뤄졌다"고 흘렸다','연구원들이 대거 이직한다는 소문','보안 담당자가 "해킹당했다"고 귀띔했다'],
  miss:['감원 소식을','발주 감소 소식을','서비스 장애 원인을'],roles:['스타트업 대표','상가 사장','협력사 공장장','연구원','개발자']},
 law:{n:'서초동 돌기',d:'법원·검찰청·로펌 거리를 돌며 법조 소식을 챙긴다',
  tip:'법원·검찰청·로펌 거리 가운데 세 곳을 돈다. 법조 기사는 단어 하나가 소송이 된다. 들은 이야기는 정보보고 거리가 되고, 안면을 튼 법조인은 취재원이 된다.',
  open:'오전 9시. {cap} 캡: "법원 게시판부터 보고, 검찰청 들렀다 와."',end:'오후 6시. {cap} 캡에게 서초동 동향을 보고할 시간이다.',RN:['법원 라인','검찰 라인','로펌 라인'],
  L:[{n:'법원 기자실',s:'선고 일정',k:1,r:'공보판사'},{n:'검찰청 민원실',s:'고소·고발',k:1.1,r:'검찰 수사관'},{n:'로펌 거리',s:'대형 사건 수임',k:1,r:'로펌 변호사'},{n:'법원 게시판',s:'공고·송달',k:.8,r:'법원 직원'},{n:'변호사회관',s:'변호사들 이야기',k:.9,r:'변호사회 간사'},{n:'구치소 접견실 앞',s:'변호인 접견',k:1.1,r:'접견 변호사'}],
  cold:['"다음 주에 보세요." 짧은 답만 돌아왔다.', '줄만 길었다.', '"의뢰인 비밀이라서요."', '공고문엔 쓸 만한 게 없었다.'],
  memo:['다음 주 대형 사건 선고 일정', '고발장이 접수됐다는 소식', '대형 로펌이 거물 사건을 맡았다는 얘기', '송달 공고에 낯익은 회사 이름', '"그 사건 증인이 말을 바꿨다"는 변호사 얘기'],
  big:['검찰 쪽에서 "곧 압수수색"이라는 귀띔','공보판사 표정이 심상치 않다 — 판례가 바뀔 수도','접견 온 변호사가 "의뢰인이 다 털어놓겠대"라고 했다'],
  miss:['선고 결과를','압수수색 소식을','고발장 접수 소식을'],roles:['공보판사','검찰 수사관','로펌 변호사','법원 직원','변호사회 간사']},
 star:{n:'방송가 돌기',d:'방송국·기획사·시사회·공항을 돌며 연예계 소식을 챙긴다',
  tip:'방송국·기획사 앞·시사회 가운데 세 곳을 돈다. 연예 기사는 사진 한 장이 승부다. 들은 이야기는 정보보고 거리가 되고, 안면을 튼 매니저는 취재원이 된다.',
  open:'오후 2시. {cap} 캡: "음악방송 출근길 찍고, 시사회도 들러."',end:'밤 11시. {cap} 캡에게 방송가 동향을 보고할 시간이다.',RN:['방송국 라인','기획사 라인','행사 라인'],
  L:[{n:'방송국 대기실',s:'출연진 동향',k:1,r:'방송국 PD'},{n:'기획사 사옥 앞',s:'연습생·매니저',k:1.1,r:'기획사 홍보팀'},{n:'시사회장',s:'배우 인터뷰',k:.9,r:'배급사 홍보 담당'},{n:'공항 출국장',s:'해외 일정',k:1,r:'로드 매니저'},{n:'드라마 촬영장',s:'촬영 현장',k:1.1,r:'드라마 스태프'},{n:'음악방송 출근길',s:'팬덤 반응',k:.8,r:'팬클럽 운영진'}],
  cold:['매니저가 "오늘은 안 됩니다"라며 막았다.', '팬들만 가득했다.', '사진 몇 장 찍고 끝났다.', '스태프가 휴대폰을 막아섰다.'],
  memo:['음악방송 출연 순서가 바뀌었다는 얘기', '드라마 촬영이 일주일 밀렸다는 얘기', '연습생 데뷔 일정', '해외 공연이 확정됐다는 얘기', '캐스팅 소문 하나'],
  big:['매니저가 "곧 큰 발표 있어요"라고 흘렸다','기획사 앞에 법무팀 차가 섰다','촬영장 분위기가 험악하다 — 하차 소문'],
  miss:['캐스팅 소식을','해외 공연 소식을','하차 소문을'],roles:['로드 매니저','기획사 홍보팀','방송국 PD','드라마 스태프','팬클럽 운영진']}
};
function sasuKey(){if(!S||!S.outlet)return 'police';if(cat1(S.dept)==='spo')return 'sports';const m=outMode();if(!m)return 'police';
  if(m==='daily'||m==='sports')return m==='sports'?'sports':'police';if(m==='ch')return 'tv';return SASU_CFG[m]?m:'police';}
function sasuCfg(){return SASU_CFG[sasuKey()]||SASU_CFG.police;}
function sasuN(){try{return sasuCfg().n;}catch(e){return '사쓰마와리';}}
function sasuRole(l,SC){if(l.r)return l.r;if(SC.roles==='spo')return pick(ROLES.spo);if(Array.isArray(SC.roles))return pick(SC.roles);return l.n.includes('경찰서')?'강력팀 형사':pick(ROLES.soc);}