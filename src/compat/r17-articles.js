// 1.7 · 기사·칼럼 소재 은행 · 해설·기획 시리즈·팩트체크 · 칼럼 개편 · 업적·칭호 · 주필 · 전문기자 휘장
// 예전 파일 v67d.js · v67.js · v68img.js · v68.js를 순서 그대로 이어 붙였다

// ───── (예전 v67d.js) ─────
/* 바이라인 — src/compat/v67d.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.7 기사·칼럼 소재 은행 (분야별) =====
// anal 해설·분석 · ser 기획 시리즈(제목>1회>2회>3회) · fc 팩트체크할 주장 · col 칼럼 제목 · ref 대기자·주필이 밀어붙일 제도
const TOPIC67=(()=>{const S_=s=>s.split('|').map(x=>x.trim()).filter(Boolean);const T={
 pol:{anal:'예산안 「증액」 뒤에 숨은 지역구 사업 지도|여야 협치는 왜 회기 마지막 주에만 될까|위성정당 방지법, 이번엔 다를까|국회 상임위 회의록으로 본 「말 없는 의원」|선거구 획정 지연이 매번 반복되는 구조|정당 보조금은 어디에 쓰이나|대통령 거부권 행사 횟수와 그 이후|청문회 낙마 기준은 누가 정하나|지방선거 공천 경쟁률이 말해 주는 것|정치 후원금 소액 기부의 진짜 주인|국정감사 「증인 채택」 거래의 문법|의원 입법 폭주, 품질은 누가 보나',
  ser:'국회의원 300명의 1년>출석과 표결>후원금 장부>지역구 예산의 흐름|공천의 경제학>공천 헌금의 흔적>여론조사 경선의 맹점>낙천자들의 증언|보좌진 리포트>9급의 하루>잦은 교체의 이유>입법을 실제로 쓰는 사람들|청년 정치의 벽>공천 문턱>정치자금의 장벽>당선 이후의 고립',
  fc:'「국회의원 세비는 OECD 최고 수준이다」|「올해 법안 처리율이 역대 최저다」|「야당이 예산을 일방적으로 삭감했다」|「대통령 지지율이 취임 이후 최고다」|「정당 보조금이 매년 두 배씩 늘었다」|「의원 절반이 다주택자다」|「투표율이 20년 만에 최저다」|「특별법만 100건 넘게 계류돼 있다」',
  col:'숫자 대신 표결 기록을 보라|국회의 시간은 왜 늘 연말에 몰리나|협치는 선언이 아니라 절차다|정치 혐오가 이득인 사람들|소수 의견이 사라진 상임위|선거 때만 오는 지역구|공천이 곧 당선인 곳의 민주주의|정당은 누구의 것인가|말의 정치에서 데이터의 정치로|정치 신인이 사라진 이유|반대를 위한 반대의 비용|청원은 쌓이고 답은 없다',
  ref:'정치자금 실시간 공개법|국회 회의록 전면 공개|상임위 출석 의무화|공천 심사 기록 공개|의원 이해충돌 신고 강화|국정감사 증인 채택 기준 법제화|선거구 획정 법정 시한 준수법|정당 보조금 사용 내역 공개'},
 int:{anal:'관세 전쟁 속 한국 수출의 계산서|미중 사이 반도체 공급망, 우리 자리는|방위비 분담금 협상, 숫자 뒤의 셈법|해외 건설 수주 「역대 최대」의 그늘|기후 협약 탈퇴 도미노가 남긴 것|재외국민 보호, 영사 인력은 충분한가|해외 원전 수주의 진짜 이익|이민 정책 전환, 이웃 나라들은 어떻게|국제 곡물값과 우리 식탁|해외 비자금 추적이 어려운 이유|국제기구 분담금은 어디로|한반도 주변 군비 경쟁 지도',
  ser:'공급망 전쟁>희토류의 길>반도체 장비의 국경>우리 기업의 선택|떠나는 사람들>해외 취업 청년>이민 2세의 귀환>두뇌 유출의 숫자|분쟁 지역 리포트>국경의 난민촌>재건 사업의 그늘>우리 교민들|외교의 뒷면>정상회담 의전>통역의 무게>합의문 한 줄의 협상',
  fc:'「한국의 대중 수출 의존도는 30%를 넘는다」|「방위비 분담금이 10년 새 두 배가 됐다」|「재외국민 수가 처음으로 줄었다」|「해외 원전 수주로 수십조 이익이 남는다」|「공적개발원조가 OECD 평균에 못 미친다」|「난민 인정률이 세계 최저 수준이다」|「무역수지가 3년 연속 흑자다」|「해외 체류 국민 사건사고가 급증했다」',
  col:'동맹은 계약서가 아니다|관세의 시대, 중견국의 생존법|난민을 대하는 태도가 국격이다|공급망은 외교다|외교는 국내 정치의 연장이 아니다|기후 외교에서 빠진 한국|해외 동포를 잊은 나라|전쟁 뉴스에 무뎌진 우리|원조는 자선이 아니라 투자다|국경 밖의 우리 기업을 지키는 법|중견국 외교의 상상력|국제 뉴스가 사라진 1면',
  ref:'무기 도입 사업 공개 검증|재외국민 보호법 개정|공적개발원조 성과 공개|해외 비자금 추적 공조 협정|난민 심사 절차 투명화|해외 진출 기업 인권 실사법|통상 협상 국회 사전 보고제|국제기구 분담금 집행 공개'},
 eco:{anal:'기준금리 동결, 대출자 지갑에서 보면|가계부채 「연착륙」은 가능한가|물가는 내렸다는데 장바구니는 왜|자영업 폐업률이 말해 주는 경기|국민연금 고갈 시점, 숫자 읽는 법|청년 고용률의 착시|최저임금 인상, 편의점 사장의 계산|상속세 논쟁의 진짜 쟁점|세수 펑크는 왜 반복되나|플랫폼 수수료가 가격을 올리나|가상자산 과세, 또 미뤄질까|고령층 일자리, 숫자 뒤의 질',
  ser:'월급의 행방>세금과 보험료>대출 이자>남는 돈은 얼마인가|자영업 리포트>창업 1년의 생존율>배달앱 수수료>폐업 이후|연금의 미래>1990년생의 계산서>개혁안의 셈법>해외 연금 개혁에서 배운다|금융 소외>신용 7등급의 삶>대부업 문턱>서민 금융의 빈칸',
  fc:'「가계부채 증가율이 세계 1위다」|「올해 세수가 역대 최대 적자다」|「청년 실업률이 10년 만에 최저다」|「자영업자 비율이 OECD 2위다」|「국민연금 기금이 30년 뒤 바닥난다」|「최저임금이 오르면 고용이 줄어든다」|「물가 상승률이 미국보다 낮다」|「부자 감세로 세수가 줄었다」',
  col:'숫자가 좋아도 체감이 나쁜 이유|빚으로 버티는 경제의 끝|연금 개혁은 세대 간 계약이다|자영업자를 위한 출구 전략|세금은 이야기가 아니라 설계다|성장률 1%대의 상상력|금리보다 무서운 것은 불신|가계부채 대책의 단골 실패|청년에게 경제는 미래가 아니다|플랫폼이 가격을 정하는 시장|중산층은 어디로 갔나|일하는 노인의 나라',
  ref:'하도급 단가 공개제|공시 위반 처벌 강화|가계부채 총량 관리법|소상공인 폐업 지원법|플랫폼 수수료 상한제|연금 개혁 세대별 고지제|대출 금리 산정 공개|세수 추계 공개 검증'},
 ind:{anal:'반도체 보조금 경쟁, 우리 셈법은|조선업 호황의 그늘, 하청 노동|배터리 업계 재고 쌓이는 이유|철강 관세가 우리 공장에 오는 길|유통 공룡의 납품 단가 압박|대기업 사내유보금, 쌓아 두는 이유|탄소 국경세 앞의 제조업|공장 자동화와 사라지는 일자리|중소 협력사의 기술 탈취 분쟁|전기차 충전 인프라의 공백|식품 가격 인상의 진짜 원인|중대재해법 3년, 현장은 바뀌었나',
  ser:'하청의 하청>조선소 물량팀>단가 후려치기>원청의 책임|기술을 빼앗긴 사람들>협력사 설계도>소송의 비용>공정위의 시간|탄소의 청구서>공장의 계산>수출 기업의 준비>중소기업의 공백|공장이 떠난 도시>폐쇄 공장 그 후>남은 사람들>새 산업은 오나',
  fc:'「반도체 수출이 사상 최대다」|「대기업 사내유보금이 1,000조를 넘었다」|「중대재해법 이후 사망 사고가 줄었다」|「조선업 수주가 세계 1위다」|「제조업 일자리가 매년 10만 개씩 준다」|「납품 단가 연동제가 현장에서 작동한다」|「전기차 판매가 꺾였다」|「식품 기업 영업이익이 두 배가 됐다」',
  col:'하청의 사고는 원청의 사고다|보조금 경쟁의 출구|기술 탈취는 범죄다|공장은 숫자가 아니라 마을이다|탄소는 비용이 아니라 시장이다|일자리 대책의 단골 실수|안전은 비용이 아니다|유통 공룡의 갑질 문법|중소기업에 미래가 있어야 한다|수출 1위의 그늘|산업 정책은 몇 년짜리인가|자동화의 이익은 누구에게',
  ref:'원청 안전 책임 강화법|기술 탈취 징벌 배상제|납품 단가 연동제 확대|하청 노동자 임금 공개|중소기업 기술 보호법|공장 폐쇄 사전 고지제|탄소 국경세 대응 지원법|산재 은폐 처벌 강화'},
 estate:{anal:'전세사기 피해, 왜 같은 수법이 반복되나|공시가격 현실화, 누가 더 내나|재건축 초과이익의 셈법|청약 가점 만점자가 늘어난 이유|공사비 급등, 분양가로 넘어오나|지방 미분양이 쌓이는 구조|PF 부실, 시공사 연쇄 위기의 고리|공공임대 입주 대기 줄은 왜 길까|빌라 시장이 무너진 이유|역세권 고밀 개발의 그늘|부동산 세금은 몇 번 바뀌었나|청년 주거비 부담 지도',
  ser:'전세의 종말>깡통 전세 지도>보증보험의 구멍>피해자의 1년|집값의 해부>건축비의 내역>땅값의 내역>분양가의 내역|재개발 리포트>조합의 돈>원주민 재정착률>세입자는 어디로|지방의 빈집>미분양 아파트>빈집 지도>사라지는 마을',
  fc:'「서울 집값이 10년 새 두 배가 됐다」|「전세사기 피해자가 2만 명을 넘었다」|「공공임대 비율이 OECD 평균이다」|「종부세 대상자가 크게 줄었다」|「지방 미분양이 역대 최대다」|「청년 주거비 비중이 30%를 넘는다」|「재건축 규제를 풀면 집값이 오른다」|「공사비가 3년 새 40% 올랐다」',
  col:'집은 자산이기 전에 사는 곳이다|전세사기는 제도의 실패다|분양가에 숨은 비용|재개발에서 세입자의 자리|부동산 대책의 기억 상실|청년에게 집은 꿈인가|지방의 빈집이 말하는 것|공공임대를 늘리지 못하는 이유|세금으로 집값을 잡을 수 있나|PF 부실의 청구서는 누가|임대차 3법 그 후|주거는 복지다',
  ref:'전세보증금 반환 보장제|분양 원가 공개 확대|재개발 세입자 재정착 보장|공공임대 의무 비율 상향|깡통전세 사전 경보제|PF 대출 공시 강화|빈집 정비 특별법|임대인 정보 공개제'},
 it:{anal:'생성형 AI 저작권, 법은 어디까지 왔나|개인정보 유출, 과징금은 왜 늘 작나|플랫폼 알고리즘이 가격을 정한다|망 사용료 분쟁의 셈법|딥페이크 처벌, 실제 기소는 몇 건|반도체 인력 부족의 숫자|데이터센터 전력 수요와 지역 갈등|앱 마켓 수수료 논쟁의 끝|청소년 SNS 규제, 해외는 어떻게|AI 기본법 시행 1년|해킹 사고 신고 지연의 이유|클라우드 국산화의 현실',
  ser:'알고리즘의 손>추천은 중립인가>가격 차별>배달 기사의 평점|내 정보의 값>유출 이후>데이터 브로커>과징금의 실효성|AI와 일자리>번역가의 1년>콜센터의 변화>새로 생긴 일|딥페이크와 싸우는 사람들>피해자의 시간>삭제 요청의 미로>수사의 벽',
  fc:'「개인정보 유출 과징금이 매출의 3%다」|「AI가 일자리 30%를 대체한다」|「딥페이크 범죄가 1년 새 열 배가 됐다」|「데이터센터 전력이 원전 몇 기 분량이다」|「국산 클라우드 점유율이 절반이다」|「청소년 하루 SNS 사용이 5시간이다」|「해킹 피해 신고의 절반이 늦게 접수된다」|「반도체 인력이 매년 3,000명 부족하다」',
  col:'알고리즘에도 책임자가 있어야 한다|개인정보는 공짜가 아니다|AI가 쓴 글의 저작권|딥페이크는 장난이 아니다|플랫폼이 시장일 때 생기는 일|기술 규제의 속도|청소년과 스마트폰, 금지만이 답인가|데이터센터가 오는 마을|일자리 대책 없는 AI 정책|해킹을 숨기는 회사|망은 누구의 것인가|디지털 격차는 복지 문제다',
  ref:'알고리즘 설명 의무화|개인정보 유출 징벌 배상|딥페이크 성범죄 처벌 강화|AI 생성물 표시 의무|플랫폼 수수료 공시제|해킹 사고 즉시 신고 의무|청소년 SNS 보호법|데이터센터 지역 상생법'},
 soc:{anal:'저출생 대책 예산, 어디로 갔나|고독사 통계가 늦게 나오는 이유|외국인 노동자 산재의 숫자|플랫폼 노동자, 노동법 밖의 사람들|돌봄 공백, 맞벌이 가정의 오후 4시|마약 사범 연령이 낮아지는 구조|스토킹 처벌법 이후 달라진 것|노인 빈곤율 1위의 내막|청년 고립 은둔, 숫자로 보면|자살 예방 예산의 현실|보이스피싱 피해 회복률|이주 배경 아동의 교육 공백',
  ser:'혼자 죽는 사람들>고독사 현장 청소부>발견까지 걸린 시간>남겨진 것들|돌봄의 무게>요양보호사의 하루>가족 돌봄 청년>돌봄의 값|이주 노동자 리포트>비닐하우스 숙소>산재와 귀국>사업장 변경의 벽|청년 고립>방 안의 3년>나오는 사람들>지원의 빈칸',
  fc:'「합계출산율이 세계 최저다」|「노인 빈곤율이 OECD 1위다」|「외국인 범죄율이 내국인보다 높다」|「마약 사범 절반이 20대다」|「저출생 예산이 매년 수십조다」|「고독사가 5년 새 두 배가 됐다」|「보이스피싱 피해액이 1조를 넘었다」|「스토킹 신고가 법 시행 뒤 세 배가 됐다」',
  col:'숫자보다 늦게 오는 죽음|아이를 낳지 않는 게 아니라 못 낳는다|돌봄은 가족의 몫인가|이주 노동자 없이 돌아가지 않는 나라|노인 빈곤은 개인의 실패가 아니다|고립된 청년에게 필요한 것|마약은 단속만으로 끝나지 않는다|스토킹은 사랑이 아니다|산재 사망은 통계가 아니다|복지의 문턱이 너무 높다|우리 동네의 고독사|가해자보다 피해자가 숨는 사회',
  ref:'고독사 예방 의무 신고제|이주 노동자 사업장 변경 자유화|가족 돌봄 청년 지원법|스토킹 피해자 보호 강화|플랫폼 노동자 보호법|돌봄 노동자 처우 개선법|청년 고립 실태 조사 의무화|마약 치료 보호 확대'},
 court:{anal:'무죄 판결 뒤 남는 것|검찰 기소율과 무죄율의 상관관계|양형 기준, 같은 죄 다른 형량|전관예우는 숫자로 보일까|재판 지연, 1심만 2년|국선변호인의 사건 수|압수수색 영장 발부율|피해자 진술권, 법정에서|대법원 판례가 바뀐 순간들|소년법 개정 논쟁의 쟁점|형사 공탁 감형의 그늘|법원 판결문 공개 수준',
  ser:'재판의 시간>1심 2년>판사 1인당 사건>지연된 정의|무죄의 기록>10년 만의 재심>수사 기록의 오류>보상받지 못한 날들|법정의 약자>통역 없는 재판>국선변호인의 하루>장애인 피고인|전관의 경제학>퇴임 판사의 개업>선임료의 차이>윤리 규정의 빈칸',
  fc:'「무죄율이 매년 오르고 있다」|「전관 변호사의 승소율이 두 배다」|「1심 재판이 평균 2년 걸린다」|「소년범 재범률이 절반을 넘는다」|「영장 발부율이 90%다」|「형사 공탁으로 감형받은 비율이 늘었다」|「판결문 공개율이 1%도 안 된다」|「성범죄 양형이 해외보다 낮다」',
  col:'늦은 정의는 정의인가|판결문을 국민에게|전관예우를 끊는 법|무죄를 받은 사람의 남은 삶|피해자가 법정 밖에 있다|양형은 여론으로 정하는 게 아니다|검찰 권력의 견제|소년법, 처벌과 교화 사이|국선변호인을 늘려야 하는 이유|공탁금으로 사는 감형|재심의 문턱|법은 누구의 언어인가',
  ref:'판결문 전면 공개법|전관 수임 제한 강화|재판 기간 상한제|국선변호인 확충법|형사 공탁 감형 기준 정비|피해자 진술권 보장법|재심 청구 요건 완화|수사 기록 열람권 확대'},
 med:{anal:'응급실 뺑뺑이, 왜 끝나지 않나|필수의료 수가의 구조|지방 병원 의사 구인난|비대면 진료 시범사업 2년|의대 정원 논쟁, 숫자 다시 보기|소아과 오픈런의 원인|간호 인력 이탈률|실손보험 청구의 진실|희귀질환 약값 부담|정신건강 예산의 현실|요양병원 감염 관리|약국 없는 마을',
  ser:'응급실의 밤>구급차의 1시간>받아 줄 병원>살릴 수 있었던 사람들|지방 의료 리포트>의사 없는 군>원정 진료>공공의료원의 적자|간호사가 떠나는 이유>3교대의 몸>태움의 기록>돌아오는 사람들|약값의 비밀>희귀질환 가족>신약 등재의 시간>해외 직구',
  fc:'「응급실 이송 거부가 1년 새 두 배가 됐다」|「인구 대비 의사 수가 OECD 최하위다」|「소아과 개원보다 폐원이 많다」|「간호사 절반이 5년 안에 떠난다」|「비대면 진료 이용자가 수백만 명이다」|「지방 의대 졸업생 대부분이 수도권으로 간다」|「실손보험 손해율이 130%다」|「정신건강 예산이 보건 예산의 2%다」',
  col:'응급실 앞에서 멈춘 생명|필수의료를 지키는 값|지방에도 의사가 있어야 한다|간호사가 떠나는 병원|의대 정원 숫자 너머|아이가 아플 때 갈 곳|정신건강은 사치가 아니다|약값 때문에 치료를 포기하는 나라|비대면 진료, 편리함과 안전 사이|요양병원의 하루|건강보험의 미래|의료 공백의 청구서',
  ref:'응급환자 이송 책임제|필수의료 수가 정상화|지역 의사제|간호 인력 배치 기준법|소아 진료 지원법|희귀질환 신약 신속 등재|정신건강 예산 확대법|공공의료원 확충법'},
 edu:{anal:'사교육비 역대 최대, 누가 쓰나|늘봄학교 1년, 현장의 목소리|교권 침해 신고 이후|학령인구 감소와 폐교 지도|지방 대학 정원 미달의 도미노|수능 킬러 문항 논쟁 그 후|학교 폭력 처분, 입시에 반영|기초학력 진단의 사각지대|AI 디지털 교과서 논란|교사 이탈률|특수교육 인력 부족|유학생 유치 경쟁의 그늘',
  ser:'사교육 공화국>초등 의대반>학원비 장부>부모의 계산|교실의 위기>교권 침해 1년>그만두는 교사>학부모 민원의 기록|사라지는 학교>마지막 졸업식>통폐합의 셈법>남은 아이들|지방 대학 리포트>정원 미달>유학생으로 메우기>폐교 이후',
  fc:'「사교육비가 역대 최대다」|「교사 이직률이 10년 새 두 배다」|「학교 폭력 신고가 줄었다」|「지방대 절반이 정원을 못 채운다」|「초등 의대반이 수도권에 수백 곳이다」|「늘봄학교 참여율이 80%다」|「폐교가 매년 100곳을 넘는다」|「기초학력 미달 학생이 늘었다」',
  col:'학원이 학교를 이긴 나라|교사가 떠나는 교실|아이가 줄면 학교도 줄어야 하나|지방 대학이 무너지면 지역도|입시는 공정한가|학교 폭력, 처벌과 회복 사이|AI 교과서보다 사람|돌봄은 학교의 일인가|기초학력은 누가 책임지나|특수교육의 빈자리|유학생은 숫자가 아니다|공부 말고 다른 길',
  ref:'학원 심야 교습 제한|교권 보호법 강화|소규모 학교 존치 기준|지방 대학 육성 특별법|학교 폭력 회복 절차 법제화|특수교육 인력 확충법|사교육비 공시제|기초학력 보장법 개정'},
 cul:{anal:'출판 시장 위기, 독서율의 숫자|문화재 수리 예산의 구조|지역 축제 적자의 반복|예술인 고용보험 3년|OTT가 바꾼 영화관|공공 도서관 개관 시간|K-콘텐츠 제작비의 수출|미술품 거래 투명성|문예 지원금 심사의 공정성|지방 공연장의 빈 객석|번역 출판 지원의 성과|웹툰 작가의 계약',
  ser:'예술가의 통장>연봉 500만 원>부업의 기록>지원금의 미로|사라지는 서점>마지막 동네 서점>출판사의 계산>독자는 어디로|문화재의 수난>수리 부실>도굴과 밀거래>지키는 사람들|지역 축제 리포트>적자 축제>초대 가수 예산>주민은 어디에',
  fc:'「성인 독서율이 절반 아래로 떨어졌다」|「지역 축제 대부분이 적자다」|「예술인 평균 연소득이 1,000만 원 미만이다」|「영화관 관객이 코로나 이전을 회복했다」|「문화재 수리 예산이 매년 줄었다」|「웹툰 작가 수익의 절반을 플랫폼이 가져간다」|「공공 도서관 수가 OECD 평균이다」|「K-콘텐츠 수출이 가전을 넘어섰다」',
  col:'책을 읽지 않는 나라의 미래|축제는 누구를 위한 것인가|예술가도 노동자다|문화재는 돈이 아니라 시간이다|동네 서점이 사라진 거리|극장의 의미|지원금이 예술을 망칠 때|K-콘텐츠의 그늘|지방에도 무대가 필요하다|번역은 문화의 다리|도서관은 민주주의다|웹툰 작가의 계약서',
  ref:'예술인 계약 표준화법|문화재 보존 예산 독립|지역 축제 사후 평가제|도서정가제 개편|웹툰 불공정 계약 금지|공공 도서관 확충법|문예 지원 심사 공개|미술품 거래 투명화법'},
 ent:{anal:'아이돌 표준계약서, 현장에선|티켓 암표, 처벌은 왜 안 되나|드라마 제작비 급등의 원인|연습생 정산 구조|방송 출연료 격차|팬덤 앨범 판매의 착시|연예인 악플 고소 결과|K-팝 해외 투어의 수익 배분|예능 PPL 노출 기준|숏폼 시대의 저작권|배우 출연료 상한제 논쟁|기획사 상장 이후',
  ser:'연습생의 계약서>데뷔 전 위약금>정산의 비밀>떠나는 아이들|아이돌의 수익>앨범 판매의 진실>투어의 계산>개인 활동의 몫|드라마 제작 현장>스태프의 노동 시간>제작비의 행방>OTT 계약|팬덤 경제학>앨범 대량 구매>포토카드의 시장>팬의 지갑',
  fc:'「아이돌 연습생 데뷔율이 1%다」|「드라마 회당 제작비가 10억을 넘었다」|「암표 신고가 1년 새 세 배다」|「앨범 판매량 절반이 팬덤 중복 구매다」|「방송 스태프 하루 노동이 15시간이다」|「연예인 악플 고소 대부분이 무혐의다」|「K-팝 해외 매출이 국내를 넘었다」|「배우 출연료가 제작비의 절반이다」',
  col:'연습생도 아이다|팬은 지갑이 아니다|암표는 범죄다|드라마 스태프의 밤|스타의 출연료와 막내의 시급|악플은 표현의 자유가 아니다|K-팝의 그늘|숏폼이 삼킨 창작|PPL이 이야기를 이길 때|기획사의 투명성|은퇴한 아이돌의 삶|대중문화의 공정',
  ref:'연습생 계약 보호법|방송 출연료 공개|암표 처벌 강화법|방송 스태프 노동 시간 상한|악플 방지 실명 확인제|PPL 표시 강화|아이돌 미성년자 보호법|기획사 정산 공개 의무'},
 spo:{anal:'프로 구단 적자 구조|체육계 폭력 신고 이후|비인기 종목 실업팀 해체|스포츠 도박 규모 추정|국가대표 선발 공정성|체육 특기자 입시|샐러리캡 도입 효과|생활체육 예산|e스포츠 선수 보호|은퇴 선수의 진로|스포츠 중계권 가격|경기장 안전 점검',
  ser:'지도자의 손>폭력 신고 이후>재기의 조건>침묵의 문화|사라지는 실업팀>마지막 시즌>비인기 종목의 셈법>올림픽 메달의 뒷면|은퇴 그 후>스물아홉의 은퇴>제2의 직업>지원 제도의 빈칸|불법 도박의 그림자>승부조작 수법>선수에게 오는 유혹>단속의 한계',
  fc:'「프로 구단 대부분이 적자다」|「체육계 폭력 신고가 해마다 늘었다」|「실업팀이 10년 새 절반이 됐다」|「불법 스포츠 도박 규모가 20조다」|「은퇴 선수 절반이 무직이다」|「중계권료가 5년 새 두 배가 됐다」|「생활체육 참여율이 60%다」|「샐러리캡 이후 전력 평준화가 됐다」',
  col:'메달 뒤의 폭력|비인기 종목은 없다|스포츠 도박의 유혹|은퇴 선수에게 두 번째 인생을|국가대표 선발은 공정해야 한다|프로 구단은 지역의 것이다|생활체육이 건강보험이다|e스포츠 선수도 선수다|중계권과 팬의 권리|경기장의 안전|승부조작은 리그를 죽인다|운동만 하던 아이들',
  ref:'체육 지도자 폭력 처벌법|승부조작 영구 제명|실업팀 운영 지원법|은퇴 선수 진로 지원법|스포츠 도박 단속 강화|국가대표 선발 기준 공개|생활체육 시설 확충법|e스포츠 선수 계약 보호'},
 loc:{anal:'지방 소멸 지수, 우리 동네는|메가시티 구상, 실제로 된 것|공공기관 2차 이전의 셈법|지역화폐 예산 논쟁|지방의회 업무추진비|지역 공항 적자|농촌 외국인 계절 근로자|청년 귀농 정착률|지방 공기업 부채|도시 재생 사업 성과|지역 의료원 적자|지역 대학과 지자체 협력',
  ser:'사라지는 마을>마지막 아이>빈집 지도>남은 노인들|지방의회 리포트>업무추진비>해외 연수>조례 발의 0건|지역 공항의 셈법>하루 비행기 두 대>적자 보전>공항을 원하는 사람들|귀농 청년>첫해의 수입>마을과의 갈등>떠나는 사람 남는 사람',
  fc:'「소멸 위험 지역이 절반을 넘었다」|「지역화폐 예산이 소비를 늘렸다」|「지방 공항 대부분이 적자다」|「귀농 청년 절반이 5년 안에 떠난다」|「지방의회 조례 발의가 줄었다」|「공공기관 이전 뒤 지역 인구가 늘었다」|「지방 공기업 부채가 사상 최대다」|「도시 재생 사업 절반이 효과가 없다」',
  col:'수도권만의 나라|마을이 사라지는 속도|지방의회는 무엇을 하는가|공항이 지역을 살리나|지역화폐의 효과|청년이 남는 지방|공공기관 이전, 그 다음|지방 소멸은 예언이 아니라 선택|농촌을 지키는 이주 노동자|지역 언론이 사라지면|메가시티의 꿈과 현실|지방 대학이 지역의 미래다',
  ref:'지방의회 업무추진비 공개|개발 사업 주민투표제|지방 공항 사후 평가제|지역 청년 정착 지원법|공공기관 이전 후속 지원법|지방 공기업 부채 공시|농촌 계절 근로자 보호법|지역 언론 지원법'}};
 const out={};Object.keys(T).forEach(k=>{const t=T[k];out[k]={anal:S_(t.anal),ser:S_(t.ser).map(x=>{const p=x.split('>');return {t:p[0],e:p.slice(1)};}),fc:S_(t.fc),col:S_(t.col),ref:S_(t.ref)};});return out;})();
// 부서 → 소재 은행
const TKEY67={pol:'pol',city:'pol',diplo:'int',int:'int',eco:'eco',fin:'eco',stock:'eco',ind:'ind',estate:'estate',it:'it',soc:'soc',case:'soc',inv:'soc',court:'court',med:'med',edu:'edu',cul:'cul',culspo:'cul',ent:'ent',spo:'spo',base:'spo',foot:'spo',nat:'loc',loc:'loc',sigun:'loc'};
function topic67(d){return TOPIC67[TKEY67[d]||'soc']||TOPIC67.soc;}

// ───── (예전 v67.js) ─────
/* 바이라인 — src/compat/v67.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.7 전문기자의 기사: 해설·분석 · 기획 시리즈 · 팩트체크 + 칼럼 소재 + 분야 밖 아이템 정리 + 업적·칭호 =====
function fieldOK67(it){try{const s=S.spec63;if(!s)return true;const cs=catOf(s.d);return cs.includes(it.d)||it.d===s.d||catOf(it.d).some(c=>cs.includes(c));}catch(e){return true;}}
function spClip67(h,imp,q,lead,o){const s=S.spec63;const d=DEPTS[s&&s.d]?s.d:S.dept;const c=Object.assign({h,o:OUT().n,d,q:Math.round(clamp(q,20,98)),imp:Math.round(clamp(imp,10,99)),excl:false,date:dateShort(),turn:S.turn,views:Math.round((OUT().p+1)*R(40,90)*1000*imp/60),lead,by:S.name,place:imp>=72?'1면':imp>=55?'종합면':'분야면',portal:''},o||{});S.clips.unshift(c);if(S.clips.length>60)S.clips.pop();S.totalArticles=(S.totalArticles||0)+1;return c;}
function pickN67(L,n,usedKey){const U=(S.used67=S.used67||{})[usedKey]=(S.used67[usedKey]||[]);let C=L.filter(x=>!U.includes(x));if(C.length<n){U.length=0;C=L.slice();}return shuffle(C.slice()).slice(0,n);}
function markUsed67(k,x){const U=(S.used67=S.used67||{})[k]=(S.used67[k]||[]);U.push(x);if(U.length>40)U.shift();}
try{
  ACT.anal67={n:'해설·분석 기사',ap:1,sc:'office',cd:0,d:'단독이 아니어도 된다 — 전문성만큼 파급력이 붙는다'};
  ACT.ser67={n:'기획 시리즈',ap:2,sc:'office',cd:4,d:'3회 연재 — 회차마다 파급력이 커지고, 끝나면 기자상 출품작'};
  ACT.fc67={n:'팩트체크',ap:1,sc:'office',cd:4,d:'떠도는 주장을 검증한다 — 맞히면 신뢰↑, 틀리면 역풍'};
  ACT_IC.anal67='book';ACT_IC.ser67='doc';ACT_IC.fc67='search';['anal67','ser67','fc67'].forEach(id=>{ACT_STAT[id]=ACT_STAT.write||'wri';});
  const g=ACT_GROUPS.find(x=>x[0]==='기사와 지면');if(g)['fc67','ser67','anal67'].forEach(id=>{if(!g[2].includes(id))g[2].unshift(id);});
  TIPS.anal67='전문기자 전용. 분야의 흐름을 짚는 해설 기사. 단독이 아니어도 전문성이 높을수록 파급력이 커진다.';TIPS.ser67='전문기자 전용. 3회짜리 연재. 회차마다 파급력이 오르고, 다 쓰면 연말 기자상 출품작 후보가 된다.';TIPS.fc67='전문기자 전용. 떠도는 주장을 단서 두 개로 판정한다. 전문성이 높을수록 단서가 정확하다.';
}catch(e){console.error(e);}
{const _rk67=rankActs;rankActs=function(){let a=_rk67.apply(this,arguments);try{if(isSpec()){['fc67','ser67','anal67'].forEach(id=>{if(!a.includes(id))a.splice(Math.max(0,a.indexOf('write')),0,id);});}}catch(e){}return a;};}
{const _wy67=why;why=function(id){if(['anal67','ser67','fc67'].includes(id)&&!isSpec())return '전문기자만';return _wy67.apply(this,arguments);};}
// 해설·분석
RUN.anal67=function(){const s=S.spec63;const T=topic67(s.d);const L=pickN67(T.anal,3,'anal');
  openModal('해설·분석 기사',`<p class="lede">이번 주 ${esc(specField())} 해설. 무엇을 풀어 줄까.</p><p class="hint">전문성 ${Math.round(s.ex)} — 높을수록 파급력이 크다.</p>`,L.map(t=>({label:t,fn:()=>{spend(1,4);setCd('anal67');markUsed67('anal',t);const imp=32+s.ex*.45+R(-4,6),q=55+(S.st.wri||40)*.2+s.ex*.15+R(-4,4);const c=spClip67(`[해설] ${t}`,imp,q,`${t} — ${jo2(specTitle(),'이','가')} 짚었다.`);s.ex=Math.min(100,s.ex+1.5);s.an=(s.an||0)+1;
    openModal('해설 출고',`${clipHTML(c)}${fxLine(apply({fame:.4+s.ex/200,eval:.3,trust:.3}))}`,[{label:'좋다'}]);return false;}})).concat([{label:'닫기',cls:'ghost'}]));};
// 기획 시리즈
RUN.ser67=function(){const s=S.spec63;const T=topic67(s.d);let Z=S.ser67;
  if(!Z){const L=pickN67(T.ser.map(x=>x.t),2,'ser');openModal('기획 시리즈',`<p class="lede">3회짜리 연재를 기획한다. 한 번 시작하면 끝까지 간다.</p>`,L.map(t=>{const x=T.ser.find(y=>y.t===t);return {label:`「${t}」`,sub:x.e.map((e,i)=>`${i+1}회 ${e}`).join(' · '),fn:()=>{markUsed67('ser',t);S.ser67={t,e:x.e,i:0,t0:S.turn};RUN.ser67();return false;}};}).concat([{label:'닫기',cls:'ghost'}]));return false;}
  spend(2,6);setCd('ser67');const i=Z.i;const imp=40+i*14+s.ex*.25+R(-3,5),q=58+(S.st.wri||40)*.2+s.ex*.12+i*3;const last=i>=Z.e.length-1;
  const c=spClip67(`[기획 ${Z.t} ${i+1}] ${Z.e[i]}`,imp,q,`${specTitle()}의 연속 기획 「${Z.t}」 ${i+1}회.`,last?{crit:true,series67:1}:{});Z.i++;s.ex=Math.min(100,s.ex+1);
  if(last){S.ser67=null;s.serDone=(s.serDone||0)+1;tick(`[${OUT().n}] 연속 기획 「${Z.t}」 완결`,1);openModal('기획 완결',`${clipHTML(c)}<p>3회 연재가 끝났다. 연말 기자상 출품작 후보다.</p>${fxLine(apply({fame:2,eval:1,trust:.5}))}`,[{label:'다음 기획을 구상한다'}]);return false;}
  openModal(`기획 ${i+1}회`,`${clipHTML(c)}<p class="hint">다음 회 「${esc(Z.e[i+1])}」 — 다음 달 「기획 시리즈」로 잇는다.</p>${fxLine(apply({fame:.6+i*.3}))}`,[{label:'다음 회를 준비한다'}]);return false;};
// 팩트체크
const FCV67=['사실','절반의 사실','사실 아님'];
const FCH67={'사실':['공식 통계 원자료와 숫자가 맞는다','발표 기관의 보도자료와 계산이 일치한다','해외 비교 자료도 같은 방향이다'],'절반의 사실':['숫자는 맞지만 기준 연도가 다르다','일부 항목만 떼어 낸 비교다','추세는 맞지만 크기가 부풀려졌다'],'사실 아님':['원자료 어디에도 그런 숫자가 없다','인용된 보고서가 정반대 결론이다','출처로 든 기관이 그런 발표를 한 적이 없다']};
RUN.fc67=function(){const s=S.spec63;const T=topic67(s.d);const claim=pickN67(T.fc,1,'fc')[0];markUsed67('fc',claim);const truth=pick(['사실','절반의 사실','절반의 사실','사실 아님','사실 아님']);
  const acc=.55+s.ex/250;const hint=()=>{const v=chance(acc)?truth:pick(FCV67.filter(x=>x!==truth));return pick(FCH67[v]);};const h1=hint(),h2=hint();spend(1,4);setCd('fc67');
  openModal('팩트체크',`<p class="lede">떠도는 주장: <b>${esc(claim)}</b></p><ul class="pnl"><li>단서 1 — ${esc(h1)}</li><li>단서 2 — ${esc(h2)}</li></ul><p class="hint">전문성 ${Math.round(s.ex)} — 단서가 맞을 확률 약 ${Math.round(acc*100)}%. 판정을 고르면 바로 출고한다.</p>`,
    FCV67.map(v=>({label:`「${v}」${jp(v,'으로','로')} 판정`,fn:()=>{const ok=v===truth;const c=spClip67(`[팩트체크] ${claim.replace(/[「」]/g,'')} — ${v}`,42+s.ex*.3+R(-3,5),60+s.ex*.15,`${jo2(specTitle(),'이','가')} 원자료를 확인했다.`);
      if(ok){s.fcOk=(s.fcOk||0)+1;s.ex=Math.min(100,s.ex+1);let hit='';try{const cc=pick(S.comp||[]);if(cc&&chance(.4)){cc.pw*=.99;hit=` ${jo2(cName(cc),'이','가')} 같은 주장을 그대로 실었다가 머쓱해졌다.`;}}catch(e){}openModal('판정 적중',`${clipHTML(c)}<p>정답: ${truth}.${hit}</p>${fxLine(apply({trust:1.2,fame:.8}))}`,[{label:'좋다'}]);}
      else{openModal('판정 역풍',`${clipHTML(c)}<p>실제로는 「${truth}」였다. 반박 기사가 나왔다. 우리 팩트체크를 다시 팩트체크한 셈이다.</p>${fxLine(apply({trust:-1.5,fame:-.5}))}`,[{label:'받아들인다'}]);}return false;}})));return false;};
// 대기자 칼럼: 소재 은행 + 「취재로 쓴다」 — 최근 분야 기사·추적이 많을수록 게이지가 크게 찬다
RUN.col63=function(){const s=S.spec63;spend(1,4);setCd('col63');const T=topic67(s.d);s.ref=s.ref||0;const tgt=T.ref[s.ref%T.ref.length];const title=pickN67(T.col,1,'col63')[0];markUsed67('col63',title);
  const recent=(S.clips||[]).filter(c=>c.turn>S.turn-12&&!c.staff&&fieldOK67(c)).length;const fuel=.35+Math.min(1,recent/5)*.65+(S.hunt63?.15:0);const g=Math.round((10+S.fame/8+s.ex/12+R(0,6))*fuel);s.op=Math.min(100,(s.op||0)+g);const fx=apply({fame:.6,trust:.3});
  if(s.op>=100){s.op=0;s.ref++;log(`대기자 칼럼이 이끈 제도 변화: ${tgt}`);tick(`「${tgt}」 통과 — ${OUT().n} ${S.name} 대기자 연속 칼럼`,1);
    openModal('제도가 바뀌었다',`<p class="lede">1년 가까이 쓴 칼럼이 결국 국회를 움직였다. <b>「${esc(tgt)}」</b> 통과. 표결 직후 발의 의원이 기자회견에서 우리 칼럼을 인용했다.</p>${fxLine(apply({fame:5,trust:3,eval:2}))}`,[{label:'다음 의제로'}]);return false;}
  openModal('대기자 칼럼',`<p class="lede">이번 주 칼럼: 「${esc(title)}」</p><p>밀고 있는 의제: <b>${esc(tgt)}</b></p>${bar(s.op,'var(--sodium)')}<p class="hint">여론 게이지 ${s.op}/100 (+${g}) — 칼럼은 취재로 쓴다: 최근 3개월 분야 기사 ${recent}건${S.hunt63?' · 추적 중':''}. 기사가 없으면 게이지가 잘 안 찬다.</p>${fxLine(fx)}`);return false;};
// 일반 칼럼(국장 이상)도 칼럼 소재 은행에서
RUN.column=function(){const ds=[...new Set([S.dept].concat((OUT().depts||[]).slice(0,8)))].filter(d=>DEPTS[d]);const L=shuffle(ds.slice()).slice(0,3).map(d=>({d,t:pickN67(topic67(d).col,1,'col_'+(TKEY67[d]||'soc'))[0]}));
  openModal('칼럼 주제','<p>기명 칼럼은 평판과 매체의 얼굴이 된다.</p>',L.map(x=>({label:`「${x.t}」`,sub:DEPTS[x.d].n,fn:()=>{markUsed67('col_'+(TKEY67[x.d]||'soc'),x.t);
    openModal('칼럼 논조',`<p class="lede">「${esc(x.t)}」</p>`,[
      {label:'날카롭게 비판한다',sub:'평판↑, 반발도 크다',fn:()=>{spend(1,5);setCd('column');const t=apply({fame:.8+S.st.wri/120,eval:.5,trust:chance(.5)?1:-2,wri:.4});S.co.q+=1;S.co.bT+=.004;toast('칼럼 게재 · '+t);}},
      {label:'균형 잡힌 분석',sub:'신뢰도↑',fn:()=>{spend(1,5);setCd('column');toast('칼럼 게재 · '+apply({fame:.6,eval:.5,trust:1.5,kno:.4}));S.co.q+=1;}},
      {label:'현장 경험을 담은 에세이',sub:'독자 반응↑',fn:()=>{spend(1,5);setCd('column');toast('칼럼 게재 · '+apply({fame:.8,eval:.5,wri:.5}));S.co.bS+=.003;}}]);return false;}})).concat([{label:'취소',cls:'ghost'}]));};
// 분야 밖 아이템은 해당 부서로 넘긴다
function fieldTrim67(lines){if(!isSpec()||!Array.isArray(S.items))return;const out=S.items.filter(i=>!fieldOK67(i));if(!out.length)return;S.items=S.items.filter(fieldOK67);if(lines)lines.push({c:'',t:`분야 밖 아이템 ${out.length}건은 해당 부서로 넘겼다 — ${jo2(specTitle(),'은','는')} ${specField()}만 쓴다`});}
{const _em67=endMonth;endMonth=function(){const r=_em67.apply(this,arguments);try{if(isSpec()){const L=[];fieldTrim67(L);L.forEach(x=>log(x.t));}}catch(e){}return r;};}
{const _se67=specEnter63;specEnter63=function(){const r=_se67.apply(this,arguments);try{fieldTrim67(null);}catch(e){}return r;};}
// 광고·영업 이벤트는 전문기자에게 오지 않는다
try{EVENTS.forEach(e=>{const s=String(e.run);if(/영업|광고 목표|adQ|quota\(\)|협찬 영업/.test(s)&&typeof e.c==='function'){const c0=e.c;e.c=()=>c0()&&!isSpec();}});}catch(e){}

// ---------- 업적 · 칭호 · 도전 ----------
try{Object.assign(ACH,{spec63:['한 우물','전문기자가 된다'],sen63:['선임 전문기자','선임 전문기자에 오른다'],boss63:['대기자','대기자에 오른다'],hunt1:['끝까지 쫓다','대형 추적을 성공시킨다'],hunt3:['추적자','대형 추적 3번 성공'],last63:['마지막 한 방','정년 전 마지막 대형 추적 성공'],
  ref1:['펜이 법을 바꾸다','대기자 칼럼으로 제도를 바꾼다'],ref3:['시대의 목소리','대기자 칼럼으로 제도를 세 번 바꾼다'],book63:['저자','책을 낸다'],fc10:['팩트체커','팩트체크 10번 맞힌다'],ser63:['연재의 힘','기획 시리즈를 완주한다'],an30:['해설의 달인','해설·분석 기사 30건'],
  edtr63:['전문 에디터','선임 전문기자에서 전문 에디터로'],mged63:['명망가 편집국장','대기자에서 편집국장으로 직행'],jupil63:['대기자 출신 주필','대기자에서 주필로 직행'],ceo63:['언론인 출신 사장','대기자에서 사장으로'],
  jref68:['시대 의제','주필 칼럼으로 의제를 현실로'],shield68:['편집권의 방패','주필로 압력을 다섯 번 막는다'],race63:['레이스 승리','승진 레이스에서 이긴다'],heir6:['후계자','후계자를 끝까지 키운다'],aw88:['올해의 대상','연말 기자상 대상'],merge66:['합병','경쟁사를 흡수 합병한다'],scout63:['몸값','스카우트 제안을 받는다']});}catch(e){console.error(e);}
try{CHAL.push({id:'boss63',n:'대기자',d:'전문기자로 시작해 대기자에 오른다',ok:()=>!!(S.spec63&&(S.spec63.lv||0)>=2)},{id:'hunt63c',n:'추적자',d:'대형 추적을 세 번 성공시킨다',ok:()=>!!(S.spec63&&(S.spec63.ok||0)>=3)},{id:'ref63c',n:'펜이 법을 바꾸다',d:'칼럼으로 제도를 한 번 이상 바꾼다',ok:()=>!!((S.spec63&&(S.spec63.ref||0)>=1)||(S.op&&(S.op.ag68n||0)>=1))});}catch(e){}
function achCheck67(){try{const s=S.spec63;const A=(k,t)=>{if(ACH[k]&&!S.ach[k]){ach(k);if(t)try{metaMark('titles',t);}catch(e){}}};
  if(s){A('spec63',`${specField()} 전문기자`);if((s.lv||0)>=1)A('sen63');if((s.lv||0)>=2)A('boss63','대기자');if((s.ok||0)>=1)A('hunt1');if((s.ok||0)>=3)A('hunt3','추적자');if(s.lastDone)A('last63','마지막 한 방');if((s.ref||0)>=1)A('ref1');if((s.ref||0)>=3)A('ref3','시대의 목소리');if((s.books||0)>=1)A('book63');if((s.fcOk||0)>=10)A('fc10','팩트체커');if((s.serDone||0)>=1)A('ser63');if((s.an||0)>=30)A('an30');if(S.scT63!=null)A('scout63');}
  if(S.raceW63)A('race63');if(S.heir66&&S.heir66.lv>=6)A('heir6');if(S.merged66)A('merge66');if(S.awBig66)A('aw88','올해의 기자상');}catch(e){}}
{const _om67=orgMonth;orgMonth=function(lines){const r=_om67.apply(this,arguments);achCheck67();return r;};}
{const _cl67=closeModal;closeModal=function(){const r=_cl67.apply(this,arguments);try{if(S&&S.phase==='game')achCheck67();}catch(e){}return r;};}
// ---------- 맡기기 AI: 전문기자는 해설·시리즈·팩트체크도 섞어 쓴다 · 주필은 주필 칼럼을 챙긴다 ----------
{const _rc67=recommend;recommend=function(){const r=_rc67.apply(this,arguments);try{if(!S||S.story||r==='rest'||r==='breaking')return r;
  if(typeof jupil68==='function'&&jupil68()&&!why('jcol68')&&chance(.6))return 'jcol68';
  if(!isSpec()||r==='hunt63'||r==='col63')return r;
  if(S.ser67&&!why('ser67'))return 'ser67';
  if(['write','invest','discover','beat','source','pitch','spx','report'].includes(r)){if(!why('fc67')&&chance(.25))return 'fc67';if(!why('anal67')&&chance(.35))return 'anal67';if(!S.ser67&&!why('ser67')&&chance(.2))return 'ser67';}}catch(e){}return r;};}
try{['scoop','safe','promo'].forEach(k=>{const A=AUTO_DIR[k].acts;['anal67','fc67','ser67'].forEach(id=>{if(!A.includes(id))A.push(id);});});AUTO_DIR.promo.acts.unshift('jcol68');}catch(e){}

// ───── (예전 v68img.js) ─────
/* 바이라인 — src/compat/v68img.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// 1.7 전문기자 트랙 휘장
try{Object.assign(IMG,{"rank_sp0": "assets/images/rank_sp0.webp", "rank_sp1": "assets/images/rank_sp1.webp", "rank_sp2": "assets/images/rank_sp2.webp", "rank_jp": "assets/images/rank_jp.webp"});}catch(e){}

// ───── (예전 v68.js) ─────
/* 바이라인 — src/compat/v68.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.7 주필: 해야 할 이유 =====
// 예전 주필은 논설회의를 이끄는 것 말고는 실장과 다를 게 없었다.
// 이제: ① 1면 기명 「주필 칼럼」 — 시대 의제 게이지가 차면 제도가 바뀌고 회사 위상이 오른다
//       ② 「편집권 방패」 — 대주주·광고주·정부의 압력이 오면 주필이 영향력을 써서 막는다
//       ③ 임원 대우(월급 ×1.35) · 정년 +5년 · 대기자 출신이면 시작 영향력↑
function jupil68(){return !!(S&&S.op&&S.op.pos===3);}
{const _po68=payOf;payOf=function(o,rank){const v=_po68.apply(this,arguments);try{if(jupil68()&&(rank===undefined||rank===S.rank))return Math.round(v*1.35/5)*5;}catch(e){}return v;};}
{const _ra68=retireAge;retireAge=function(){const v=_ra68.apply(this,arguments);return jupil68()&&!(S.spec63)?v+5:v;};}
try{ACT.jcol68={n:'주필 칼럼',ap:1,sc:'office',cd:4,d:'1면 기명 칼럼 — 시대 의제를 밀어붙인다. 게이지가 차면 제도가 바뀐다'};ACT_IC.jcol68='doc';ACT_STAT.jcol68=ACT_STAT.write||'wri';const g=ACT_GROUPS.find(x=>x[0]==='기사와 지면');if(g&&!g[2].includes('jcol68'))g[2].unshift('jcol68');TIPS.jcol68='주필만 쓰는 1면 기명 칼럼. 영향력·평판이 높을수록 시대 의제 게이지가 크게 찬다. 다 차면 제도가 바뀌고 회사 위상이 오른다.';}catch(e){}
{const _rk68=rankActs;rankActs=function(){const a=_rk68.apply(this,arguments);try{if(jupil68()&&!a.includes('jcol68'))a.unshift('jcol68');}catch(e){}return a;};}
{const _wy68=why;why=function(id){if(id==='jcol68'&&!jupil68())return '주필만';return _wy68.apply(this,arguments);};}
RUN.jcol68=function(){const O=S.op;spend(1,4);setCd('jcol68');O.agenda68=O.agenda68||0;O.ag68n=O.ag68n||0;const B=(typeof TOPIC67==='object')?TOPIC67:null;
  const keys=['pol','eco','soc','int','loc','edu','med'];const k=keys[O.ag68n%keys.length];const L=(B&&B[k]&&B[k].ref)||['언론 자유 보장법','정보공개법 전면 개정'];const tgt=L[(O.ag68n*3)%L.length];
  const g=Math.round(12+(O.inf||30)/6+S.fame/10+R(0,6));O.agenda68=Math.min(100,O.agenda68+g);O.inf=Math.min(100,(O.inf||30)+1.5);const fx=apply({fame:.8,trust:.4});
  if(O.agenda68>=100){O.agenda68=0;O.ag68n++;try{S.co.q=Math.min(100,S.co.q+4);}catch(e){}log(`주필 칼럼이 이끈 변화: ${tgt}`);tick(`「${tgt}」 현실로 — ${OUT().n} ${S.name} 주필 1년 연속 칼럼`,1);try{ach('jref68');}catch(e){}
    openModal('시대 의제가 현실이 됐다',`<p class="lede">1면 주필 칼럼으로 1년 가까이 밀어붙인 <b>「${esc(tgt)}」</b>이 현실이 됐다. 다른 신문들도 사설로 뒤따랐다.</p>${fxLine(apply({fame:5,trust:3}))}<p class="hint">회사 위상(보도 품질) +4</p>`,[{label:'다음 의제를 고른다'}]);return false;}
  openModal('주필 칼럼',`<p class="lede">1면 하단, 주필 기명 칼럼: 「${esc(tgt)}, 이제는 결단할 때」</p>${bar(O.agenda68,'var(--sodium)')}<p class="hint">시대 의제 ${O.agenda68}/100 (+${g}) — 영향력·평판이 높을수록 많이 찬다 · 영향력 ${Math.round(O.inf)}</p>${fxLine(fx)}`);return false;};
// 편집권 방패
const SHIELD68=/^(대주주의 전화|대주주 쪽 전화|광고주 압력|광고주 대이탈|정부 광고 축소|회장님 사진|광고주의 조건|조건부 거래|편집국장의 반대|사장실 호출|오너 리스크|대주주 교체설)$/;
{const _om68=openModal;openModal=function(t,b,c){try{if(jupil68()&&SHIELD68.test(String(t))&&Array.isArray(c)&&(S.op.inf||0)>=15&&!c.some(x=>x&&x.sh68)){const i=c.findIndex(x=>x&&x.cls==='ghost');const sh={label:'주필이 막는다 — 편집권 방패',sub:`영향력 -10 · 신뢰↑ · 압력이 물러난다 (지금 영향력 ${Math.round(S.op.inf)})`,rec:true,sh68:1,fn:()=>{S.op.inf=Math.max(0,S.op.inf-10);S.op.sh68=(S.op.sh68||0)+1;log(`편집권 방패: ${t}`);if(S.op.sh68>=5)try{ach('shield68');}catch(e){}toast('주필이 나섰다 · '+apply({trust:1.5}));}};
    c=i>=0?c.slice(0,i).concat([sh],c.slice(i)):[sh].concat(c);}}catch(e){}return _om68.call(this,t,b,c);};}

// ---- 전문기자 트랙 아이콘·휘장 ----
try{Object.assign(ICP,{
 hunt:'<circle cx="10" cy="10" r="6"/><circle cx="10" cy="10" r="2.5"/><path d="M14.5 14.5L20 20"/>',
 anal:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M8 17v-3M11 17v-6M14 17v-4M8 7h8"/>',
 series:'<rect x="8" y="3" width="12" height="14" rx="1.5"/><path d="M5 6v13a2 2 0 0 0 2 2h10M11 8h6M11 11h6"/>',
 factck:'<circle cx="10" cy="10" r="6.5"/><path d="M7.3 10.2l2 2 3.6-4M15 15l5 5"/>',
 nib:'<path d="M12 3l6 7-6 11-6-11z"/><path d="M12 10v5M9 21h6"/><circle cx="12" cy="10" r="1.3"/>'});
 ACT_IC.hunt63='hunt';ACT_IC.anal67='anal';ACT_IC.ser67='series';ACT_IC.fc67='factck';ACT_IC.jcol68='nib';ACT_IC.col63='pen';
}catch(e){}
// 휘장: 이미지가 있으면 트랙 휘장, 없으면 기존 직급 휘장
const SPB68=['rank_sp0','rank_sp1','rank_sp2','rank_jp'];
function spBadgeKey68(){try{if(typeof jupil68==='function'&&jupil68())return 'rank_jp';if(isSpec()&&S.spec63)return SPB68[clamp(S.spec63.lv|0,0,2)];}catch(e){}return '';}
{const _rb68=rankBadge;rankBadge=function(r,cls){try{const k=spBadgeKey68();if(k&&(r===undefined||r===S.rank)){const src=(typeof IMG!=='undefined'&&IMG[k])||'';if(src)return `<img class="rbadge${cls?' '+cls:''}" src="${src}" alt="${esc(rankName())} 휘장" draggable="false">`;}}catch(e){}return _rb68.apply(this,arguments);};}
// ---- 전문기자 트랙: 「다음 직급 부국장」 대신 트랙 진행도를 보여 준다 ----
function specProg68(){const s=S.spec63;if(!s)return null;const lv=s.lv|0,ex=s.ex||0,y=years();
  if(lv===0)return {pl:`다음 단계 <b>선임 전문기자</b>`,prog:Math.min(1,ex/55),reqs:`<span class="${ex>=55?'ok':''}">전문성 ${Math.round(ex)}/55</span><span class="${(typeof spSenN64!=='function'||spSenN64()<SPCAP64.sen)?'ok':''}">선임 정원 ${typeof spSenN64==='function'?spSenN64():0}/${SPCAP64.sen}</span>${specOutletOK()?'':'<span>★3 이상 매체에서만</span>'}`};
  if(lv===1){const tk=typeof spBoss64==='function'&&!!spBoss64();const cond=y>=15||(s.ok||0)>=1;return {pl:`다음 단계 <b>대기자</b>`,prog:Math.min(1,(Math.min(1,ex/85)*2+(cond?1:Math.min(1,y/15)))/3),reqs:`<span class="${ex>=85?'ok':''}">전문성 ${Math.round(ex)}/85</span><span class="${cond?'ok':''}">${y}/15년 차 또는 추적 성공 ${s.ok||0}/1</span><span class="${S.turn-(s.t1??S.turn)>=YW*3?'ok':''}">선임 ${moTxt(S.turn-(s.t1??S.turn))}/3년</span><span class="${tk?'':'ok'}">대기자 자리 ${tk?'참':'빔'}</span>`};}
  return {pl:`다음 자리 <b>편집국장 · 주필 · 사장</b>`,prog:Math.min(1,ex/100),reqs:`<span class="${ex>=90?'ok':''}">전문성 ${Math.round(ex)}</span><span>정기 인사 때 「다음 자리」를 고른다</span><span>정기 인사까지 ${moTxt(24-S.turn%24)}</span>`};}
{const _vp68=v19Prog;v19Prog=function(){try{if(isSpec()){const p=specProg68();if(p)return p.prog;}}catch(e){}return _vp68.apply(this,arguments);};}
function specProgDom68(){try{if(!S||S.phase!=='game'||!isSpec())return;const p=specProg68();if(!p)return;const pc=Math.round(p.prog*100);
  document.querySelectorAll('.dcard .prog').forEach(el=>{const a=el.querySelector('.pl span:first-child'),n=el.querySelector('.pl .num'),r=el.querySelector('.reqs'),b=el.querySelector('.bar i,.bar>div');if(a)a.innerHTML=p.pl;if(n)n.textContent=pc+'%';if(r)r.innerHTML=p.reqs;if(b)b.style.width=pc+'%';});
  document.querySelectorAll('.mehero .mhp small').forEach(el=>{el.innerHTML=p.pl;});
  document.querySelectorAll('.v19next,.nextrow').forEach(el=>{el.querySelectorAll('b').forEach(x=>{if(/^(부국장|국장|부장|차장|편집국장)$/.test(x.textContent.trim()))x.textContent=p.pl.replace(/<[^>]+>/g,'').replace(/^다음 (단계|자리) /,'');});});
}catch(e){}}
{const _rd68=render;render=function(){const r=_rd68.apply(this,arguments);specProgDom68();return r;};}
// ---- 맡기기 AI: 커리어를 끝내는 선택(길의 끝 엔딩·은퇴 수락)은 스스로 고르지 않는다 ----
{const _ab68=aiBtnScore61;aiBtnScore61=function(k,b,i){let s=_ab68.apply(this,arguments);try{const t=b.innerText||'';if(/커리어 마무리|엔딩|펜을 내려놓|은퇴한다|사표를 낸다|회사를 떠난다/.test(t))s-=20;if(/아직|남는다|더 쓴다|쓸 기사가 남/.test(t))s+=1;}catch(e){}return s;};}
{const _ap68=autoPickBtn;autoPickBtn=function(){const c=_ap68.apply(this,arguments);try{if(c&&/커리어 마무리|엔딩/.test(c.innerText||'')){const alt=[...document.querySelectorAll('#mc button')].find(x=>!x.disabled&&x!==c&&!/커리어 마무리|엔딩/.test(x.innerText||''));if(alt)return alt;}}catch(e){}return c;};}
