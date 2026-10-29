// 1.78 · 시즌 사건(여섯 달 탐사) · 맡기기 AI 개선
// 예전 파일 v80.js를 순서 그대로 이어 붙였다

// ───── (예전 v80.js) ─────
/* 바이라인 — src/compat/v80.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.78 시즌 사건: 1~2년에 한 번, 여섯 달에 걸친 대형 탐사 — 증거·위험·라이벌 경주 =====
// 매달 한 번 갈림길. 증거를 모으면 위험도 쌓인다. 라이벌도 같은 사건을 쫓는다(라이벌이 100에 닿으면 먼저 터뜨린다).
// 4단계부터는 언제든 터뜨릴 수 있다. 결과는 증거와 위험으로 정해진다. 기록: S.ss80(진행 중) · S.ssDone(끝낸 사건 id) · S.ssLast(마지막 turn)
const SS_PRE=['한빛','누리','대성','청명','미래','동방','세진','가람','태평','금강','동해','한결','다온','서림'];
const SS=[
 {id:'money',n:'검은 돈의 지도',kw:'정치 자금',
  setup:v=>{v.co=pick(SS_PRE)+'건설';v.mp=rname();v.aide=rname();},
  st:[
   {t:'{co} 하청업체 사장이 술자리에서 흘렸다. "{mp} 의원 쪽에 들어간 돈이 장부에 다 있어." 다음 날 그는 전화를 받지 않는다.',o:[
     ['바로 파고든다','증거↑ · 위험↑ · 컨디션↓',{ev:14,risk:6,hp:-6}],['데스크에 보고하고 시간을 받는다','증거 조금↑ · 평가↑',{ev:8,eval:.5}],['하청업체 사장부터 다시 설득한다','증거 조금↑ · 위험↓',{ev:6,risk:-6}]]},
   {t:'후원금 명부를 대조하자 {co} 직원 서른 명이 같은 날 같은 금액을 냈다. 쪼개기다. 이걸 뒷받침할 내부 자료가 필요하다.',o:[
     ['경리 직원에게서 장부 사본을 몰래 받는다','증거 크게↑ · 위험 크게↑',{ev:20,risk:15}],['선관위 공개 자료로 차근차근 맞춘다','증거↑ · 위험↓ · 라이벌에게 시간을 준다',{ev:11,risk:-3,rv:6}],['직원 몇 명을 직접 찾아간다','증거↑ · 컨디션↓',{ev:14,risk:4,hp:-8}]]},
   {t:'{mp} 의원 보좌관 {aide} 씨가 편집국으로 전화했다. "그 취재, 회사 광고 담당한테도 얘기가 갔어요." 국장 표정이 굳었다.',o:[
     ['흔들리지 않고 계속한다','위험↑ · 신뢰↑ · 평가↓',{risk:10,trust:1,eval:-1}],['국장 뒤에 숨어 잠시 숨을 고른다','위험↓ · 라이벌에게 시간을 준다',{risk:-8,rv:8}],['보좌관과 만나 이야기를 들어 본다','증거 조금↑ · 위험 크게↑ · 신뢰↓',{ev:7,risk:18,trust:-1}]]},
   {t:'라이벌 {rival} 기자가 {co} 본사 앞에서 목격됐다. 같은 걸 쫓고 있다.',o:[
     ['밤을 새워 남은 고리를 잇는다','증거 크게↑ · 컨디션 크게↓',{ev:16,hp:-12}],['회계 전문가에게 검증을 맡긴다','증거↑ · 위험↓ · 돈↓',{ev:10,risk:-10,money:-30}],['라이벌에게 일부러 엉뚱한 정보를 흘린다','라이벌↓ · 위험↑ · 신뢰↓',{rv:-18,risk:10,trust:-1}]]},
   {t:'마지막 퍼즐. 돈이 {mp} 의원 지역 사무소 리모델링 비용으로 흘러간 정황이 보인다.',o:[
     ['{mp} 의원에게 정면으로 반론을 묻는다','증거↑ · 위험 크게↓',{ev:8,risk:-14}],['사무소 공사업체 계좌 자료를 구한다','증거 크게↑ · 위험↑',{ev:18,risk:12}],['변호사 검토부터 받는다','위험 크게↓ · 라이벌에게 시간을 준다',{risk:-16,rv:10}]]}],
  head:'[단독] {co} 직원 30명 같은 날 같은 돈…{mp} 의원 후원금 쪼개기'},
 {id:'kids',n:'사라진 아이들',kw:'복지시설',
  setup:v=>{v.co=pick(SS_PRE)+'복지재단';v.boss=rname();v.place=pick(['청주','원주','김해','군산','아산','진주']);},
  st:[
   {t:'{place}의 {co} 보육시설을 나온 청년이 찾아왔다. "거기 있던 동생 둘이 서류에서 사라졌어요. 아무도 어디 갔는지 몰라요."',o:[
     ['청년의 이야기를 끝까지 듣고 기록한다','증거↑ · 위험↓',{ev:10,risk:-4}],['곧장 시설로 찾아간다','증거↑ · 위험↑',{ev:13,risk:8}],['데스크에 보고하고 팀을 꾸린다','증거 조금↑ · 평가↑',{ev:7,eval:.5}]]},
   {t:'시청 보조금 자료에는 아이들이 아직 시설에 있는 것으로 돼 있다. 없는 아이 몫의 보조금이 계속 나가고 있다.',o:[
     ['정보공개청구로 3년 치 자료를 받는다','증거↑ · 위험↓ · 라이벌에게 시간을 준다',{ev:12,risk:-3,rv:6}],['전직 생활지도원을 설득한다','증거 크게↑ · 컨디션↓',{ev:17,risk:6,hp:-8}],['시청 담당자에게 슬쩍 떠본다','증거 조금↑ · 위험 크게↑',{ev:8,risk:16}]]},
   {t:'{co} 이사장 {boss} 씨가 변호사를 통해 내용증명을 보냈다. "근거 없는 보도 시 법적 대응."',o:[
     ['내용증명은 내용증명일 뿐, 계속한다','위험↑ · 신뢰↑',{risk:10,trust:1}],['법무팀과 함께 표현을 다듬는다','위험↓ · 라이벌에게 시간을 준다',{risk:-10,rv:6}],['이사장을 직접 만나 해명을 듣는다','증거↑ · 위험↑',{ev:8,risk:8}]]},
   {t:'사라진 아이 하나의 행방이 잡혔다. 다른 지역 시설로 서류 없이 옮겨져 있었다. 라이벌 {rival} 기자도 이 시설을 수소문하고 있다.',o:[
     ['그 시설로 당장 내려간다','증거 크게↑ · 컨디션 크게↓',{ev:17,hp:-12}],['아동보호 전문기관과 함께 확인한다','증거↑ · 위험 크게↓',{ev:10,risk:-12}],['청년과 함께 가서 아이를 만난다','증거↑ · 평판↑ · 위험↑',{ev:12,fame:1,risk:6}]]},
   {t:'마지막 퍼즐. 보조금이 이사장 가족 회사 운영비로 흘러간 흔적이 있다.',o:[
     ['이사장 가족 회사 등기를 뒤진다','증거 크게↑ · 위험↑',{ev:17,risk:10}],['이사장에게 반론을 듣는다','증거↑ · 위험 크게↓',{ev:7,risk:-14}],['피해 아동 보호 방안부터 챙긴다','위험↓ · 신뢰↑ · 라이벌에게 시간을 준다',{risk:-8,trust:1,rv:8}]]}],
  head:'[단독] 서류 속에만 있는 아이들…{co}, 사라진 아이 몫 보조금 수년간 타 갔다'},
 {id:'plant',n:'공장의 비밀',kw:'산업재해',
  setup:v=>{v.co=pick(SS_PRE)+'반도체';v.place=pick(['평택','구미','당진','여수','천안','광양']);v.doc=rname();},
  st:[
   {t:'{place} {co} 공장 출신 노동자 셋이 같은 혈액암 진단을 받았다. 가족 모임 대표가 연락해 왔다. "회사는 개인 질병이래요."',o:[
     ['세 가족을 모두 만난다','증거↑ · 컨디션↓',{ev:13,hp:-6}],['산업보건 전문가 {doc}에게 먼저 묻는다','증거↑ · 위험↓',{ev:9,risk:-5}],['데스크에 보고하고 팀을 꾸린다','증거 조금↑ · 평가↑',{ev:7,eval:.5}]]},
   {t:'공장에서 쓰는 화학물질 목록이 필요하다. 회사는 「영업비밀」이라며 공개하지 않는다.',o:[
     ['퇴직자에게서 내부 물질 목록을 받는다','증거 크게↑ · 위험 크게↑',{ev:20,risk:14}],['노동청 작업환경측정 자료를 청구한다','증거↑ · 위험↓ · 라이벌에게 시간을 준다',{ev:11,risk:-3,rv:6}],['해외 같은 공정 사례를 찾는다','증거↑ · 어학이 있으면 유리',{ev:12,risk:0,lng:1}]]},
   {t:'{co}가 신문 1면 광고를 석 달 치 미리 사겠다고 회사에 제안했다. 광고국장이 편집국을 찾아왔다.',o:[
     ['기사와 광고는 별개라고 버틴다','위험↑ · 신뢰↑ · 평가↓',{risk:10,trust:1.5,eval:-1}],['국장에게 판단을 넘긴다','위험↓ · 라이벌에게 시간을 준다',{risk:-6,rv:8}],['광고 조건으로 시간을 번다','증거 조금↑ · 신뢰 크게↓',{ev:6,trust:-3}]]},
   {t:'라이벌 {rival} 기자가 피해 가족 모임에 연락했다는 소식이다.',o:[
     ['역학조사 결과를 밤새 분석한다','증거 크게↑ · 컨디션 크게↓',{ev:16,hp:-12}],['{doc}에게 공식 의견서를 받는다','증거↑ · 위험 크게↓ · 돈↓',{ev:10,risk:-12,money:-30}],['가족 모임과 독점 인터뷰 약속을 받는다','라이벌↓ · 증거↑',{rv:-14,ev:8}]]},
   {t:'마지막 퍼즐. 회사가 3년 전 자체 조사에서 같은 위험을 알고도 덮었다는 내부 보고서가 있다고 한다.',o:[
     ['보고서를 가진 사람을 끝까지 설득한다','증거 크게↑ · 위험↑ · 컨디션↓',{ev:18,risk:10,hp:-6}],['{co}에 공식 질의서를 보낸다','증거↑ · 위험 크게↓',{ev:7,risk:-14}],['가족들의 산재 신청을 돕는다','신뢰↑ · 위험↓ · 라이벌에게 시간을 준다',{trust:1,risk:-6,rv:8}]]}],
  head:'[단독] {co}, 노동자 혈액암 위험 3년 전 알고도 덮었다'}, {id:'med',n:'수술실의 침묵',kw:'의료 사고',
  setup:v=>{v.co=pick(['한빛','새봄','청명','다온','서림'])+'대학병원';v.doc=rname();v.fam=rname();},
  st:[
   {t:'{co}에서 간단한 수술을 받은 환자가 깨어나지 못했다. 유족 대표 {fam} 씨가 말했다. "병원은 체질 탓이래요. 그런데 수술 기록이 이상해요."',o:[
     ['유족이 받은 진료 기록부터 꼼꼼히 본다','증거↑ · 위험↓',{ev:10,risk:-4}],['병원 홍보실에 바로 묻는다','증거 조금↑ · 위험↑',{ev:7,risk:10}],['데스크에 보고하고 팀을 꾸린다','증거 조금↑ · 평가↑',{ev:7,eval:.5}]]},
   {t:'수술 기록상 집도의는 {doc} 교수인데, 그날 {doc} 교수는 학회 일정이 잡혀 있었다.',o:[
     ['학회 참석자 명단을 구한다','증거↑ · 위험↓ · 라이벌에게 시간을 준다',{ev:12,risk:-3,rv:6}],['수술실 간호사를 퇴근길에 만난다','증거 크게↑ · 위험↑ · 컨디션↓',{ev:18,risk:10,hp:-8}],['다른 의사에게 기록을 보여 자문한다','증거↑',{ev:11}]]},
   {t:'병원 법무팀이 유족에게 합의금을 제시했다. 조건은 「언론 접촉 금지」다. 유족이 흔들린다.',o:[
     ['유족 곁을 지키며 결정을 기다린다','신뢰↑ · 라이벌에게 시간을 준다',{trust:1.5,rv:8}],['합의 전에 기사를 서두른다','증거↑ · 위험 크게↑ · 신뢰↓',{ev:8,risk:16,trust:-1}],['변호사를 소개해 유족을 돕는다','위험↓ · 돈↓',{risk:-8,money:-20}]]},
   {t:'라이벌 {rival} 기자가 같은 병원의 다른 사고를 캐고 있다는 소식이다.',o:[
     ['같은 수술 기록 5년 치를 밤새 분석한다','증거 크게↑ · 컨디션 크게↓',{ev:16,hp:-12}],['의료사고 전문 변호사에게 검증받는다','증거↑ · 위험 크게↓ · 돈↓',{ev:10,risk:-12,money:-30}],['라이벌에게 정보를 나누고 공동 취재를 제안한다','라이벌↓ · 평판↑',{rv:-20,fame:.5}]]},
   {t:'마지막 퍼즐. 병원이 「대리 수술」을 숨기려 기록을 고친 흔적이 전산 로그에 남아 있다고 한다.',o:[
     ['전산 담당자를 끝까지 설득한다','증거 크게↑ · 위험↑',{ev:18,risk:10}],['{doc} 교수에게 정면으로 반론을 묻는다','증거↑ · 위험 크게↓',{ev:7,risk:-14}],['보건 당국에 조사 의뢰 여부부터 확인한다','위험↓ · 라이벌에게 시간을 준다',{risk:-8,rv:8}]]}],
  head:'[단독] {co}, 집도의는 학회에…수술 기록 고쳐 대리 수술 숨겼다'},
 {id:'match',n:'조작된 경기',kw:'승부 조작',
  setup:v=>{v.co=pick(['한빛','동해','금강','태평','누리'])+' '+pick(['파이터스','블레이즈','유나이티드','웨이브스']);v.pl=rname();v.br=rname();},
  st:[
   {t:'{co} 경기의 마지막 이닝, 베테랑 {pl} 선수의 이해할 수 없는 실책. 그 경기에만 해외 불법 베팅 사이트에 수십억이 몰렸다는 제보다.',o:[
     ['베팅 흐름 자료부터 확보한다','증거↑ · 위험↓',{ev:11,risk:-3}],['{pl} 선수 주변을 탐문한다','증거↑ · 위험↑',{ev:13,risk:8}],['데스크에 보고하고 팀을 꾸린다','증거 조금↑ · 평가↑',{ev:7,eval:.5}]]},
   {t:'{pl} 선수 계좌로 의문의 돈이 들어왔다는 소문. 연결고리로 브로커 {br} 씨의 이름이 나온다.',o:[
     ['브로커가 드나드는 술집에서 잠복한다','증거 크게↑ · 컨디션 크게↓',{ev:18,risk:8,hp:-12}],['다른 선수들을 조용히 만난다','증거↑ · 위험↑',{ev:13,risk:8}],['구단 경기 영상을 프레임 단위로 분석한다','증거↑ · 위험↓ · 라이벌에게 시간을 준다',{ev:11,risk:-2,rv:6}]]},
   {t:'구단 단장이 신문사 사주와 골프를 쳤다는 말이 들린다. 편집국장이 "확실한 것만 써"라고 했다.',o:[
     ['확실한 것만 쓰되 멈추지 않는다','위험↓ · 평가↑',{risk:-4,eval:.5}],['사주 쪽 압력이라면 정면으로 버틴다','위험↑ · 신뢰↑ · 평가↓',{risk:10,trust:1.5,eval:-1}],['구단 단장을 직접 만난다','증거↑ · 위험 크게↑',{ev:8,risk:16}]]},
   {t:'라이벌 {rival} 기자가 {co} 숙소 앞에서 보였다.',o:[
     ['브로커 {br}의 통화 기록을 구한다','증거 크게↑ · 위험 크게↑',{ev:20,risk:15}],['수사기관에 수사 착수 여부를 확인한다','증거↑ · 위험 크게↓',{ev:9,risk:-12}],['{pl} 선수 가족에게 연락한다','증거↑ · 신뢰↓',{ev:12,trust:-1}]]},
   {t:'마지막 퍼즐. {pl} 선수가 직접 말하겠다며 연락해 왔다. 조건은 익명이다.',o:[
     ['익명을 약속하고 증언을 받는다','증거 크게↑ · 위험↑',{ev:18,risk:8}],['구단과 리그 사무국에 반론을 요청한다','증거↑ · 위험 크게↓',{ev:6,risk:-14}],['선수에게 자수를 권한다','신뢰↑ · 위험↓ · 라이벌에게 시간을 준다',{trust:1.5,risk:-6,rv:10}]]}],
  head:'[단독] {co} 경기에 불법 베팅 수십억…브로커와 선수 사이 「검은 돈」'},
 {id:'redev',n:'재개발의 그림자',kw:'재개발 비리',
  setup:v=>{v.co=pick(['한빛','대성','금강','서림','태평'])+'건설';v.place=pick(['수원','인천','부천','대구','광주','대전'])+' '+pick(['3구역','7구역','중앙구역','역세권 구역']);v.ch=rname();},
  st:[
   {t:'{place} 재개발 조합원들이 찾아왔다. "조합장 {ch} 씨가 시공사 {co}랑 짜고 분담금을 부풀렸어요."',o:[
     ['조합 총회 자료를 모은다','증거↑ · 위험↓',{ev:11,risk:-3}],['조합장 사무실을 찾아간다','증거↑ · 위험↑',{ev:12,risk:9}],['데스크에 보고하고 팀을 꾸린다','증거 조금↑ · 평가↑',{ev:7,eval:.5}]]},
   {t:'공사비가 계약 뒤 두 번이나 올랐다. 그때마다 총회는 위임장으로 통과됐다. 위임장 일부는 같은 필체다.',o:[
     ['위임장 사본을 구해 필적을 감정한다','증거 크게↑ · 돈↓',{ev:17,money:-25}],['위임장에 이름이 오른 조합원을 하나하나 만난다','증거↑ · 컨디션↓',{ev:14,hp:-8}],['구청에 인가 서류를 청구한다','증거↑ · 위험↓ · 라이벌에게 시간을 준다',{ev:10,risk:-3,rv:6}]]},
   {t:'{co} 쪽에서 "이 동네 광고 다 끊긴다"는 말이 돌았다. 지역 광고 담당이 걱정스레 편집국을 찾았다.',o:[
     ['광고와 기사는 별개라고 버틴다','위험↑ · 신뢰↑ · 평가↓',{risk:9,trust:1.5,eval:-1}],['국장에게 판단을 넘긴다','위험↓ · 라이벌에게 시간을 준다',{risk:-6,rv:8}],['{co} 홍보팀과 비공식으로 만난다','증거 조금↑ · 위험 크게↑',{ev:6,risk:16}]]},
   {t:'라이벌 {rival} 기자가 조합 사무실을 다녀갔다.',o:[
     ['조합장 가족 회사와 {co} 하청 관계를 추적한다','증거 크게↑ · 컨디션 크게↓',{ev:17,hp:-12}],['회계사에게 분담금 산정을 검증받는다','증거↑ · 위험 크게↓ · 돈↓',{ev:10,risk:-12,money:-30}],['조합원 비상대책위와 독점 인터뷰를 약속받는다','라이벌↓ · 증거↑',{rv:-15,ev:8}]]},
   {t:'마지막 퍼즐. 조합장이 {co}에서 받은 돈이 차명 계좌로 들어갔다는 내부 장부가 있다고 한다.',o:[
     ['장부를 가진 전 조합 직원을 설득한다','증거 크게↑ · 위험↑',{ev:18,risk:10}],['조합장에게 정면으로 반론을 묻는다','증거↑ · 위험 크게↓',{ev:7,risk:-14}],['피해 조합원 구제 방안부터 챙긴다','신뢰↑ · 위험↓ · 라이벌에게 시간을 준다',{trust:1,risk:-6,rv:8}]]}],
  head:'[단독] {place} 재개발, 같은 필체 위임장으로 공사비 올렸다…조합장에 흘러간 돈'},
 {id:'fund',n:'사라진 노후 자금',kw:'투자 사기',
  setup:v=>{v.co=pick(['한빛','새봄','미래','동방','유성'])+'인베스트';v.ceo=rname();v.vic=rname();},
  st:[
   {t:'일흔 넘은 {vic} 씨가 편집국 앞에서 기다리고 있었다. "{co}에 퇴직금을 다 넣었는데, 지난달부터 이자가 안 나와요."',o:[
     ['피해자 이야기를 모은다','증거↑ · 위험↓',{ev:10,risk:-4}],['{co} 사무실로 바로 가 본다','증거↑ · 위험↑',{ev:12,risk:9}],['데스크에 보고하고 팀을 꾸린다','증거 조금↑ · 평가↑',{ev:7,eval:.5}]]},
   {t:'{co}는 「해외 부동산 연 15% 보장」을 내세웠다. 투자자만 수천 명. 그런데 해외 부동산 등기가 확인되지 않는다.',o:[
     ['해외 등기를 현지 통신원에게 확인한다','증거 크게↑ · 돈↓ · 어학이 있으면 유리',{ev:15,money:-20,lng:1}],['전직 영업 직원을 설득한다','증거 크게↑ · 위험↑ · 컨디션↓',{ev:17,risk:9,hp:-8}],['금융당국 공시 자료를 뒤진다','증거↑ · 위험↓ · 라이벌에게 시간을 준다',{ev:10,risk:-3,rv:6}]]},
   {t:'{co} 대표 {ceo} 씨가 유명 연예인과 찍은 광고가 다음 주 우리 신문에 실린다고 한다.',o:[
     ['광고 게재 중단을 회사에 요청한다','위험↑ · 신뢰↑ · 평가↓',{risk:8,trust:2,eval:-1}],['광고는 광고, 기사는 기사로 간다','위험↓ · 신뢰 조금↓',{risk:-4,trust:-.5}],['광고 게재를 기사 거리로 삼는다','증거 조금↑ · 평판↑ · 위험↑',{ev:6,fame:1,risk:8}]]},
   {t:'라이벌 {rival} 기자가 피해자 모임에 연락했다는 소식이다. 대표 {ceo}의 출국 소문도 돈다.',o:[
     ['돈의 흐름을 밤새 추적한다','증거 크게↑ · 컨디션 크게↓',{ev:16,hp:-12}],['수사기관에 출국 금지 여부를 확인한다','증거↑ · 위험 크게↓',{ev:9,risk:-12}],['대표의 출국 장면을 잡으러 공항에 간다','라이벌↓ · 증거↑ · 컨디션↓',{rv:-14,ev:10,hp:-8}]]},
   {t:'마지막 퍼즐. 새 투자금으로 옛 투자자 이자를 막아 온 「돌려막기」 장부가 있다고 한다.',o:[
     ['장부를 가진 회계 직원을 설득한다','증거 크게↑ · 위험↑',{ev:18,risk:10}],['{ceo} 대표에게 정면으로 반론을 묻는다','증거↑ · 위험 크게↓',{ev:7,risk:-14}],['피해자들이 고소장을 내도록 돕는다','신뢰↑ · 위험↓ · 라이벌에게 시간을 준다',{trust:1.5,risk:-6,rv:8}]]}],
  head:'[단독] 「연 15% 보장」 {co}, 해외 부동산은 없었다…수천 명 노후 자금 돌려막기'}];
const SS_BY=Object.fromEntries(SS.map(x=>[x.id,x]));
function ssFill(t,a){return String(t).replace(/\{(\w+)\}/g,(m,k)=>a.v&&a.v[k]!=null?a.v[k]:k==='rival'?((S.rival&&S.rival.name)||'타사 기자'):m);}
function ssOK(){return !!(S&&S.phase==='game'&&!S.story&&!S.founder&&(S.rank||0)>=1&&(S.rank||0)<=5&&!S.dev);}
function ssSeen(){try{return JSON.parse(localStorage.getItem('byline-ss-seen')||'[]');}catch(e){return [];}}
function ssStart(){const done=S.ssDone||[];const L=SS.filter(x=>!done.includes(x.id));const seen=ssSeen();const L2=L.filter(x=>!seen.includes(x.id));const x=L2.length?pick(L2):L.length?pick(L):pick(SS);try{const sn=seen.filter(i=>i!==x.id).concat([x.id]);localStorage.setItem('byline-ss-seen',JSON.stringify(sn.length>=SS.length?[x.id]:sn));}catch(e){}const v={};x.setup(v);
  S.ss80={id:x.id,v,stage:0,ev:0,risk:10,rv:R(0,12),t0:S.turn,log:[]};log(`시즌 사건 — 「${x.n}」 시작`);}
function ssBar(n,v,col){v=clamp(Math.round(v),0,100);return `<div class="ss-bar"><span>${n}</span><i><b style="width:${v}%;background:${col}"></b></i><em>${v}</em></div>`;}
function ssGauges(a){return `<div class="ss-g">${ssBar('증거',a.ev,'#5ad49b')}${ssBar('위험',a.risk,'#ff8b7a')}${ssBar('라이벌',a.rv,'#c49bff')}</div>`;}
function ssOutlook(a){const q=a.ev-a.risk*.5;return q>=50?'지금 터뜨려도 버틸 만하다':q>=30?'반쯤은 맞힐 수 있다 — 반박이 걱정된다':'아직 터뜨리기엔 이르다';}
// 결판
function ssPublish(early){const a=S.ss80;if(!a)return;const x=SS_BY[a.id];const late=a.rv>=100;let q=a.ev-a.risk*.5+R(-6,6);
  try{if(typeof pkE==='function'){const E=pkE();q+=E.item*40+E.excl*60;}}catch(e){}
  const head=ssFill(x.head,a);let res,fx,title,body;
  if(q>=50){res='win';fx={fame:late?5:11,eval:late?2.5:5,trust:3};title=late?'후속 보도로도 판을 흔들었다':'대특종';body=late?'라이벌이 먼저 냈지만, 내 기사가 더 깊었다. 업계는 두 기사를 나란히 놓고 읽었다.':'시리즈가 나간 다음 날 검찰이 움직였다. 편집국에 박수가 터졌다.';}
  else if(q>=30){res='half';fx={fame:late?2:5,eval:late?1:2.5,trust:1};title='절반의 성공';body='핵심은 맞았지만 빈틈도 보였다. 상대는 「일부 사실과 다르다」며 버텼다.';}
  else{res='fail';fx={trust:-6,eval:-3,fame:-2};title='반박에 무너졌다';body='증거가 버티지 못했다. 정정 요구와 소송 예고가 날아왔다.';}
  const t=apply(fx);
  if(res!=='fail'){try{S.scoops=(S.scoops||0)+(late?0:1);const o=OUT();const imp=res==='win'?(late?70:96):58;S.clips.unshift({h:late?head.replace('[단독] ',''):head,o:o.n,d:cat1(S.dept),q:res==='win'?92:70,imp,excl:!late,date:dateShort(),turn:S.turn,views:Math.round(imp*R(900,1400)),lead:x.n,by:S.name,place:isTV()?'메인뉴스':'1면',portal:1,ss80:1});if(S.clips.length>60)S.clips.pop();S.totalArticles=(S.totalArticles||0)+1;}catch(e){}}
  else{try{S.errors=(S.errors||0)+1;S.lastError=S.turn;(S.errT=S.errT||[]).push(S.turn);}catch(e){}}
  S.ssDone=(S.ssDone||[]).concat([a.id]);S.ssLast=S.turn;S.ssWin=(S.ssWin||0)+(res==='win'?1:0);S.ss80=null;log(`시즌 사건 「${x.n}」 — ${title}`);
  openModal(`시즌 사건 · ${x.n} — ${title}`,`<p class="lede">${esc(body)}</p><p class="ss-head">「${esc(late&&res!=='fail'?head.replace('[단독] ',''):head)}」</p>${ssGauges(Object.assign({},a,{rv:Math.min(a.rv,100)}))}<p class="fx">${t}</p>`,[{label:'확인',cls:'rec'},{label:'내 기사 스크랩 보기',cls:'ghost',fn:()=>{try{S.tab='clips';window.__MV='tab';render();}catch(e){}}}]);}
function ssDrop(){const a=S.ss80;if(!a)return;const x=SS_BY[a.id];S.ssDone=(S.ssDone||[]).concat([a.id]);S.ssLast=S.turn;S.ss80=null;const t=apply({hp:8,trust:-.5});log(`시즌 사건 「${x.n}」 — 접었다`);
  openModal(`시즌 사건 · ${x.n} — 접었다`,`<p class="lede">사건 파일을 서랍에 넣었다. 몇 달 뒤, 그 이름이 다른 신문 1면에 걸렸다.</p><p class="fx">${t}</p>`,[{label:'확인',cls:'rec'},{label:'닫기',cls:'ghost'}]);}
function ssStage(){const a=S.ss80;if(!a)return closeModal();const x=SS_BY[a.id];if(!x){S.ss80=null;return closeModal();}
  if(a.rv>=100&&!a.rvDone){a.rvDone=1;const rn=(S.rival&&S.rival.name)||'타사';openModal(`시즌 사건 · ${x.n} — 라이벌이 먼저 터뜨렸다`,`<p class="lede">${esc(rn)}의 기사가 먼저 나갔다. 단독은 놓쳤다.</p>${ssGauges(a)}<p class="hint">그래도 내가 쥔 증거가 더 깊다면 후속 보도로 판을 흔들 수 있다.</p>`,[{label:'후속 보도로 낸다',sub:ssOutlook(a),cls:'rec',fn:()=>{ssPublish();return false;}},{label:'접는다',cls:'ghost',fn:()=>{ssDrop();return false;}}]);return;}
  const n=a.stage;const fin=n>=x.st.length;
  if(fin){openModal(`시즌 사건 · ${x.n} (6/6) 결판`,`<p class="lede">여섯 달을 쫓았다. 이제 낼지 말지 정할 때다.</p>${ssGauges(a)}<p class="hint">전망: ${ssOutlook(a)}</p>`,[{label:'시리즈로 터뜨린다',sub:ssOutlook(a),cls:'rec',fn:()=>{ssPublish();return false;}},{label:'한 달만 더 확인한다',sub:'증거↑ · 위험↓ · 라이벌에게 시간을 준다',fn:()=>{a.ev=clamp(a.ev+8,0,100);a.risk=clamp(a.risk-6,0,100);a.rv=clamp(a.rv+22,0,100);a.extra=(a.extra||0)+1;if(a.extra>=2){ssPublish();return false;}toast('한 달 더 — 라이벌이 다가온다');}},{label:'접는다',cls:'ghost',fn:()=>{ssDrop();return false;}}]);return;}
  const st=x.st[n];
  openModal(`시즌 사건 · ${x.n} (${n+1}/6)`,`<p class="ss-kw">${esc(x.kw)} · 여섯 달 탐사</p><p class="lede">${esc(ssFill(st.t,a))}</p>${ssGauges(a)}${n>=3?`<p class="hint">4단계부터는 지금 바로 터뜨릴 수도 있다 — ${ssOutlook(a)}</p>`:''}`,
   [...st.o.map(([l,sub,e])=>({label:ssFill(l,a),sub,fn:()=>{const fx={};let ev=e.ev||0;
      // 능력치가 받쳐 주면 증거가 더 잘 모인다
      ev*=1+clamp(((S.st.inv||40)+(S.st.ver||40))/2-45,-15,30)/100;if(e.lng)ev+=clamp((S.st.lng||20)-30,0,30)/5;
      a.ev=clamp(a.ev+ev,0,100);a.risk=clamp(a.risk+(e.risk||0),0,100);a.rv=clamp(a.rv+(e.rv||0),0,100);
      ['hp','eval','trust','fame'].forEach(k=>{if(e[k])fx[k]=e[k];});if(e.money)S.money+=e.money;a.stage++;a.log.push(n);
      const t=Object.keys(fx).length?apply(fx):'';toast(`증거 ${Math.round(a.ev)} · 위험 ${Math.round(a.risk)}${t?' · '+t:''}`);}})),
    ...(n>=3?[{label:'지금 터뜨린다',sub:ssOutlook(a),fn:()=>{ssPublish(true);return false;}}]:[])]);}
{const _om80i=openModal;openModal=function(t){const r=_om80i.apply(this,arguments);try{if(/^시즌 사건 · .*\((?:[2-6])\/6\)|^시즌 사건 · .* — /.test(String(t||''))){const bx=document.querySelector('#modal .mbx');if(bx){bx.querySelectorAll(':scope>.evimg').forEach(x=>x.remove());bx.classList.remove('hasev');}}}catch(e){}return r;};}
// 매달: 시작하거나 다음 단계 (라이벌은 매달 다가온다)
{const _em80=endMonth;endMonth=function(){const r=_em80.apply(this,arguments);try{if(!ssOK()){if(S&&S.ss80&&(S.founder||S.story||S.rank>5||S.rank<1)){S.ss80=null;}return r;}
  if(S.ss80){const a=S.ss80;if(a.stage>0||a.started)a.rv=clamp(a.rv+R(12,19)*(S.rival?1:.8),0,100);a.started=1;Q.push(()=>ssStage());}
  else if(!S.arc2&&S.turn>=YW*.75&&S.turn-(S.ssLast??-999)>=YW*2&&(S.ssDone||[]).length<4&&chance(.18)){ssStart();Q.push(()=>ssStage());}}catch(e){}return r;};}
// 할 일 화면 위쪽에 진행 중인 사건 띠
function ssBand(){try{const box=document.querySelector('.bx-act');if(!box)return;let el=box.querySelector('.ss-band');const a=S&&S.phase==='game'?S.ss80:null;if(!a){if(el)el.remove();return;}const x=SS_BY[a.id];if(!x)return;
  const h=`<div class="ss-band"><b>🗂 시즌 사건 · ${esc(x.n)}</b><span>${Math.min(a.stage+1,6)}/6단계 · 다음 갈림길은 월말<i class="ss-mini"> · 증거 ${Math.round(a.ev)} · 위험 ${Math.round(a.risk)} · 라이벌 ${Math.round(a.rv)}</i></span>${ssGauges(a)}</div>`;
  if(!el){box.insertAdjacentHTML('afterbegin',h);}else if(el.outerHTML!==h)el.outerHTML=h;}catch(e){}}
{const _rd80=render;render=function(){const r=_rd80.apply(this,arguments);try{ssBand();}catch(e){}return r;};}
// ===== AI(맡기기) 개선: 새 시스템을 읽는다 =====
{const _ab78=aiBtnScore61;aiBtnScore61=function(k,b,i){let s=_ab78.apply(this,arguments);try{const t=b.innerText||'';const mt=($('#mt')||{}).textContent||'';
  // 특기: 맡긴 방향에 맞는 특기를 고른다
  if(/^특기 해금/.test(mt)){if(/다음 달에/.test(t))s-=5;const W={scoop:/아이템|단독|제보/,safe:/신뢰|깎일|컨디션 소모/,promo:/평가|관계/,money:/통장|부수입|평가/}[k]||/행동력/;if(W.test(t))s+=2;if(/행동력 \+1/.test(t))s+=3;if(S.hp<45&&/컨디션/.test(t))s+=1;}
  // 시즌 사건: 증거가 모자라면 터뜨리지 않고, 위험이 높으면 줄이는 쪽, 라이벌이 가까우면 서두른다
  if(/^시즌 사건 · /.test(mt)&&S.ss80){const a=S.ss80,q=a.ev-a.risk*.5;
    if(/터뜨린다|후속 보도/.test(t))s+=q>=50?4:q>=35&&a.rv>=80?2.5:-4;
    if(/접는다/.test(t))s+=q<20&&a.rv>=90?1:-4;
    if(/한 달만 더/.test(t))s+=q<50&&a.rv<70?2:-2;
    if(/위험 크게↓|위험↓/.test(t))s+=a.risk>=45?2:k==='safe'?1:.2;
    if(/위험 크게↑/.test(t))s-=a.risk>=40?2.5:k==='scoop'?.2:1;
    if(/증거 크게↑/.test(t))s+=k==='scoop'?1.6:1;
    if(/라이벌에게 시간을/.test(t))s-=a.rv>=60?2:.4;if(/라이벌↓/.test(t))s+=a.rv>=55?1.5:.2;
    if(/컨디션 크게↓/.test(t)&&S.hp<40)s-=2;if(/돈↓/.test(t)&&S.money<60)s-=1.5;if(/신뢰 크게↓/.test(t))s-=2.5;}
}catch(e){}return s;};}
(function(){try{const st=document.createElement('style');st.textContent=`
.ss-g{display:grid;gap:5px;margin:10px 0}.ss-bar{display:grid;grid-template-columns:3.6em 1fr 2.4em;align-items:center;gap:8px;font-size:13px}.ss-bar i{height:9px;border-radius:5px;background:rgba(255,255,255,.08);overflow:hidden}.ss-bar b{display:block;height:100%;border-radius:5px}.ss-bar em{font-style:normal;text-align:right;font-variant-numeric:tabular-nums;opacity:.8}
.ss-kw{font-size:12.5px;opacity:.7;margin:0 0 4px}.ss-head{font-weight:700;font-size:16px;padding:10px 12px;border-left:3px solid #ffb547;background:rgba(255,181,71,.08);border-radius:8px}
.ss-band{margin:0 0 10px;padding:10px 12px;border-radius:12px;border:1px solid rgba(196,155,255,.4);background:rgba(196,155,255,.08)}.ss-band>b{display:block;font-size:14.5px}.ss-band>span{font-size:12.5px;opacity:.75}.ss-band .ss-g{margin:6px 0 0}.ss-mini{font-style:normal;display:none}@media (max-width:720px){.ss-band .ss-g{display:none}.ss-mini{display:inline}.ss-band{padding:8px 12px}}`;document.head.appendChild(st);}catch(e){}})();
