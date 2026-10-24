/* 바이라인 1.6 — src/compat/v13a.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.21 호재 기사 · 감시 보도 · 스카우트 · 제자 · 부서 분위기 =====
// --- 확인을 채울 때 출처를 서로 다르게 (같은 출처 두 번은 교차 확인이 아니다) ---
function fFill(f,src){if(!f)return;f.via=f.via||[];f.conf=Math.max(f.conf||0,f.need||1);if(src&&!f.via.includes(src))f.via.push(src);const EX=['자료 대조','관계자 교차 확인','당사자 확인','현장 대조'];let i=0;while(new Set(f.via).size<Math.min(f.need||1,f.conf)&&i<EX.length){if(!f.via.includes(EX[i]))f.via.push(EX[i]);i++;}}
// 오보가 나면 무엇이 문제였는지 실제 원인을 알려 준다
function errWhy(it,W,inc,unv){const L=[];if(it.hoax)L.push('제보 자체가 꾸며진 것이었다');if(unv&&unv.length)L.push(`확인 안 된 사실 「${yamaShort(unv[0].t,18)}」${unv.length>1?` 등 ${unv.length}개`:''}가 사실과 달랐다`);if((inc||[]).some(f=>f.key&&f.conf===1))L.push('핵심 사실이 한 출처뿐이었다');if(!W.rb)L.push(it.pos?'회사 측 확인 없이 숫자를 그대로 옮겼다':'반론을 받지 않아 상대 쪽 사정을 놓쳤다');if(W.lead==='key'&&!W.leadOK)L.push('리드에 확인이 덜 된 핵심을 걸었다');if(W.md&&W.md.risk)L.push('생방송·속보 같은 무리한 출고 방식에서 실수가 나왔다');if(W.head==='bait')L.push('자극적인 제목이 내용보다 앞서 나갔다');if(!L.length)L.push('확인한 사실을 옮겨 적다 표현이 지나쳤다');return L.slice(0,2);}

// --- 기사 성격: 호재(pos) · 비판(crit) · 그 밖(neu) ---
const POS_RE=/신기록|돌파|흥행|수상|우승|사상 최대|역대 최대|역대 최고|출시|1위|선정|호평|흑자|첫선|매진|쾌거|금메달|천만 관객|수주|순항|최고 시청률/;
const POS_NEG=/참사|급감|참패|오류|취소|촌극|내정|어뷰징|과열|갈등|반발|비상|사망|폭락|쇼크|적자|실패|파문|조작|숨져|위기/;
function posT(t){t=String(t||'');return POS_RE.test(t)&&!POS_NEG.test(t)&&!CRIT_RE.test(t);}
function artTone(it){if(!it)return 'neu';if(it.pos)return 'pos';return CRIT_RE.test(it.title||it.h||'')?'crit':'neu';}

// --- 호재 기사 템플릿: 부서(분류)별로 비판 기사의 약 70% ---
// 사실 묶음(종류별): 하나는 핵심(*)
const POS_FK={
 perf:['d:*{S} 실적 공시 원문','n:영업이익 전년 대비 {n}% 증가','w:증권사 애널리스트 "기대 이상"','n:매출 {m}억 원 집계','s:생산 라인 가동 현장 확인','w:{S} 관계자 "다음 분기도 자신 있다"'],
 launch:['n:*출시 첫 주 판매량 공식 집계','d:{S} 판매 현황 자료','w:매장 직원 "문의가 끊이지 않는다"','s:매장 앞 대기 줄 확인','w:소비자 "기다린 보람이 있다"','n:사전 예약 {n}만 건'],
 award:['d:*수상·선정 결과 공식 발표문','w:심사위원 "독보적이었다"','n:후보 {y}곳 가운데 선정','s:시상식 현장 확인','w:{S} 관계자 "함께한 사람들 덕분"'],
 record:['n:*공식 집계 기록 확인','d:집계 기관 자료','w:업계 관계자 "이례적인 기록"','n:이전 최고 기록 대비 {n}% 상회','s:현장 열기 직접 확인','w:관계자 "꾸준히 쌓아 온 결과"'],
 hire:['d:*{S} 채용·투자 계획 문서','n:지난해보다 규모 {n}% 확대','w:취업 준비생 "가뭄에 단비"','w:고용 전문가 "다른 곳으로 번질지 주목"','n:새 일자리 {n}00개'],
 share:['d:*협약서·기부 내역','n:혜택 받는 곳 {n}곳','w:수혜자 "숨통이 트였다"','s:전달식 현장 확인','n:지원 규모 {m}억 원'],
 policy:['d:*{S} 성과 보고서','n:관련 지표 {n}% 개선','w:시민 "확실히 달라졌다"','w:전문가 "다른 곳도 참고할 만하다"','s:현장 운영 직접 확인','n:이용자 {n}만 명'],
 event:['n:*방문객 {n}만 명 공식 집계','s:행사장 인파 직접 확인','w:상인 "매출이 두 배"','d:주최 측 운영 결과 자료','w:관람객 "내년에도 온다"'],
 tech:['d:*연구 결과 논문·인증서','w:외부 전문가 "세계적 수준"','n:성능 {n}% 향상','s:연구소 시연 현장 확인','w:{S} 연구진 "상용화가 머지않았다"'],
 person:['w:*당사자 인터뷰','w:주변 사람들 "늘 그랬던 사람"','s:현장 직접 확인','d:관련 기록 확인','n:함께한 이웃 {n}명'],
 sport:['n:*공식 경기 기록','s:경기장 현장 확인','w:감독 "선수들이 해냈다"','w:팬 "올해는 다르다"','d:연맹 공식 자료','n:이날 관중 {n}00명'],
 contract:['d:*계약서 요약본','n:계약 규모 {m}억 원','w:업계 관계자 "실력을 인정받았다"','w:{S} 관계자 "다음 계약도 협상 중"','s:서명식 현장 확인'],
 pper:['w:*당사자 인터뷰','d:공개 자료 확인','w:지역 주민 "말보다 행동"','w:보좌진 "원래 그런 분"','n:관련 활동 {y}년째'],
 deal:['d:*합의문·법안 의결 기록','w:여야 관계자 "모처럼 한 발씩 물러섰다"','n:찬성 2{n}표','w:시민단체 "환영한다"','d:회의록 원문']};
// [분류, 종류, 제목, 파급력, 주어 목록 키(없으면 반론 상대), 출입처]
const POS_SUBJ={
 eco_co:['{E}','{corp}','{corp} 계열사','중견기업 {org}산업','코스닥 상장사 {org}테크'],eco_gov:['기획재정부','산업통상자원부','중소벤처기업부','KOTRA'],eco_app:['{E}','{corp}','{app}'],
 soc_p:['{place} 주민','60대 택배 기사','{place} 편의점 점주','{univ} 학생','퇴직 교사'],soc_g:['{place} 구청','{city} 보건소','보건복지부'],soc_gp:['관할 경찰서','{city} 경찰서','경찰청'],soc_co:['{E}','{corp}','{org}재단'],soc_h:['{E}','{org}대병원','{univ} 연구팀','{univ} 의대'],
 edu:['{E}','{univ}','{city} 교육청','{place} 초등학교'],court:['대법원','{city} 지방법원','법률구조공단'],case:['관할 경찰서','{city} 경찰서 강력팀','지구대 순찰팀'],med:['{E}','{org}대병원','{city} 의료원'],inv:['시민 감시단','{place} 주민 모임','내부 공익 신고자'],
 pol_d:['여야','국회','{party}'],pol_g:['{E}','대통령실','국무조정실','행정안전부'],pol_p:['{party} 초선 의원','{party} 원내대표','국회의장'],
 cul_i:['국립중앙박물관','{city} 시립미술관','{org}문화재단','{org}아트센터','국립극장'],cul_w:['영화 「{movie}」','다큐멘터리 「{movie}」','애니메이션 「{movie}」','독립영화 「{movie}」'],cul_b:['소설 『{drama}』','에세이 『{drama}』','그림책 『{drama}』'],cul_m:['뮤지컬 「{show}」','연극 「{show}」','창작 오페라 「{show}」'],cul_p:['원로 화가','젊은 피아니스트','신예 작가','무명 연극 배우','국악 명인'],cul_co:['{E}','{corp}','{org}문화재단'],cul_g:['문화체육관광부','{E}','{city} 문화재단'],
 spo_t:['{team}','{corp} 여자 배구단','{univ} 야구부','유소년 축구단','{team} 2군'],spo_p:['에이스 {star}','신인 {star}','국가대표 {star}','은퇴 앞둔 베테랑 {star}','{univ} 출신 {star}'],spo_co:['{E}','{team}','{corp}'],spo_g:['{E}','대한체육회','{city} 체육회'],spo_y:['신인 {star}','{team} 주장','{univ} 에이스 {star}'],base:['{team}'],base_p:['에이스 {star}','{team} 선발 {star}'],foot:['{team}','국가대표 {star}'],
 int_co:['{E}','{corp}','한국 중소기업','K-뷰티 브랜드','K-푸드 브랜드'],int_p:['{country} 교민','한국인 의사','한국인 유학생','현지 한국어 교사','한인 봉사 단체'],int_e:['한인 2세 정치인','한국계 변호사'],int_u:['한국계 학자','한국인 교수'],int_o:['한국인 외교관','한국계 학자'],int_g:['{E}','외교부','주{country} 대사관','KOTRA'],int_n:['{E}','{corp}','한국 NGO'],diplo:['{E}','외교부','국방부','통일부'],
 loc_e:['{city}','{city} 관광재단','{place} 상인회','{city} 문화재단'],loc_g:['{city}','{E}','{city} 시청'],loc_co:['{E}','지역 기업 {org}산업','{city} 농협','{corp} 지역 공장'],loc_p:['{place} 이장','귀농 청년','{city} 마을 활동가','시골 학교 교사','전통시장 상인'],city:['{city}','{E}','{city} 의회'],nat:['{city}','{E}'],
 ent_a:['{group}','{star}','{E} 소속 {group}','{agency} 소속 {star}','신인 그룹 {group}'],ent_c:['드라마 「{drama}」','예능 「{show}」','영화 「{movie}」','웹드라마 「{drama}」'],ent_co:['{E}','{agency}'],ent_p:['배우 {star}','{star}','중견 배우','아역 출신 배우'],
 ind:['{E}','{corp}','중견기업 {org}산업'],fin:['{E}','한빛은행','{org}저축은행'],stock:['{E}','코스닥 상장사 {org}테크','{corp}'],estate:['{E}','{city}','한국토지주택공사'],it:['{E}','{app}','{univ} 연구팀','스타트업 {org}랩']};
const POS_SPEC=`
eco|perf|{S}, 분기 영업이익 시장 예상 웃돌아|44|eco_co
eco|perf|{S} 반기 매출 사상 최대|46|eco_co
eco|perf|{S}, 3년 만에 흑자 전환|42|eco_co
eco|perf|{S} 해외 매출 비중 처음으로 절반 넘어|40|eco_co
eco|perf|{S} 주가 연중 최고…실적 기대감|36|eco_co
eco|perf|{S}, 신용등급 한 단계 올라|38|eco_co
eco|perf|{S} 수출 {n}억 달러 돌파|44|eco_co
eco|launch|{S} 신제품 사전 예약 {n}만 건 몰려|36|eco_app
eco|launch|{S} 새 서비스 출시 한 달 만에 가입자 {n}만 명|34|eco_app
eco|launch|{S} 친환경 신제품, 출시 첫 주 완판|32|eco_app
eco|launch|{S} 한정판 오픈런…새벽부터 줄|30|eco_app
eco|launch|{S} 신제품, 소비자 평가 1위|32|eco_app
eco|award|{S}, 올해의 고객만족 기업 선정|28|eco_co
eco|award|{S} 일하기 좋은 기업 1위|30|eco_co
eco|award|{S} 지배구조 평가 최고 등급|34|eco_co
eco|award|{S} 국제 디자인상 수상|28|eco_co
eco|hire|{S}, 청년 채용 {n}00명 늘린다|34|eco_co
eco|hire|{S} 지방 공장에 {m}억 원 투자|40|eco_co
eco|hire|{S}, 주 4.5일제 시범 도입|32|eco_co
eco|hire|{S} 경력 단절 여성 {n}0명 채용|30|eco_co
eco|hire|{S} 협력사 직원까지 성과급 나눈다|34|eco_co
eco|share|{S} 협력사 상생 기금 {n}억 원 출연|30|eco_co
eco|share|{S}, 납품 단가 연동제 자발 도입|34|eco_co
eco|share|{S} 소상공인 판로 지원 {n}00곳|28|eco_co
eco|share|{S} 임직원 봉사 시간 {n}만 시간 넘어|24|eco_co
eco|tech|{S}, 핵심 기술 국산화 성공|42|eco_co
eco|tech|{S}, 차세대 주력 제품 시제품 공개|40|eco_co
eco|tech|{S} 특허 {n}건 해외 등록|32|eco_co
eco|tech|{S} 탄소 배출 {n}% 줄인 신공정 가동|34|eco_co
eco|record|{S} 앱, 월 이용자 {n}00만 명 돌파|34|eco_app
eco|record|{S} 연간 판매량 신기록|38|eco_app
eco|policy|{S}, 수출 바우처로 중소기업 {n}00곳 지원|30|eco_gov
eco|policy|{S} 규제 샌드박스 1년…신사업 {n}건 출시|32|eco_gov
eco|record|수출 {n}개월 연속 증가…반도체·자동차 쌍끌이|44|산업통상자원부
eco|record|소비자심리지수 반년 만에 반등|34|한국은행
eco|record|청년 고용률 역대 최고 수준|40|고용노동부
eco|record|중소기업 수출 사상 최대|38|중소벤처기업부
eco|record|외국인 직접투자 상반기 최대|40|산업통상자원부
eco|record|전통시장 매출 3년 만에 반등|30|소상공인시장진흥공단
eco|record|물가 상승률 석 달째 둔화|36|통계청
eco|record|스타트업 투자 다시 늘었다|32|중소벤처기업부
eco|tech|{S}, 스마트 공장 전환으로 생산성 {n}% 향상|34|ind|ind
eco|record|{S}, 올해 수주 목표 조기 달성|40|ind|ind
eco|launch|{S}, 친환경 설비 양산 돌입|36|ind|ind
eco|policy|{S}, 서민 금융 상담 {n}만 건 넘어|26|fin|fin
eco|policy|{S} 고령층 전용 창구 호평|24|fin|fin
eco|share|{S}, 소상공인 금리 인하 지원|30|fin|fin
eco|record|{S} 주가 상장 첫날 두 배|38|stock|stock
eco|perf|{S}, 배당 확대·자사주 소각 발표|34|stock|stock
eco|record|{S} 외국인 순매수 1위|30|stock|stock
eco|policy|{S}, 공공임대 입주 만족도 역대 최고|28|estate|estate
eco|record|{S} 역세권 청년 주택 경쟁률 {n}대 1|30|estate|estate
eco|policy|{S}, 노후 단지 재건축 첫 삽|30|estate|estate
eco|tech|{S}, AI 번역 정확도 세계 1위|40|it|it
eco|record|{S} 앱 다운로드 {n}00만 돌파|32|it|it
eco|tech|{S}, 자체 AI 서비스 첫선|36|it|it
eco|event|{S} 개발자 콘퍼런스 성황|26|it|it
soc|person|{S}, 불길 속 이웃 구했다|36|soc_p
soc|person|{S} {y}년째 무료 급식 봉사|26|soc_p
soc|person|{S}, 쓰러진 행인 심폐소생술로 살려|34|soc_p
soc|person|익명 기부 {y}년째…{S}의 선행|28|soc_p
soc|person|{S}, 전 재산 장학금으로 내놔|32|soc_p
soc|person|{S}, 길 잃은 치매 노인 가족 품으로|28|soc_p
soc|person|{S} 손편지 한 장에 동네가 움직였다|24|soc_p
soc|policy|{S}, 응급 돌봄 호출 서비스 호응|30|soc_g
soc|policy|{S} 어린이 보호구역 1년…안전 지표 개선|36|soc_g
soc|policy|{S} 1인 가구 돌봄 서비스 호응|30|soc_g
soc|policy|{S}, 보이스피싱 예방으로 {m}억 원 지켰다|38|soc_gp
soc|policy|{S} 야간 순찰 강화 뒤 범죄 신고 줄었다|34|soc_gp
soc|policy|{S} 치매 안심 센터 이용자 {n}00명 넘어|28|soc_g
soc|policy|{S}, 실종 아동 {n}명 가족 품으로|38|soc_gp
soc|policy|{S} 무료 법률 상담 {n}00건 돌파|26|court
soc|policy|{S}, 고립 청년 {n}00명 다시 사회로|32|soc_g
soc|policy|{S} 폭염 쉼터 이용자 {n}만 명|26|soc_g
soc|share|{S}, 저소득층 아동 {n}0명에 장학금|28|soc_co
soc|share|{S} 독거노인 겨울나기 지원|26|soc_co
soc|share|{S}, 보호 종료 청년 자립 돕는다|30|soc_co
soc|share|{S} 무료 진료 버스 {n}개 마을 순회|28|soc_co
soc|share|{S} 장애인 일자리 {n}0개 만든다|32|soc_co
soc|tech|{S}, 희귀질환 치료법 세계 첫 성공|46|soc_h
soc|record|{S} 로봇 수술 {n}00건 돌파|32|soc_h
soc|award|{S} 연구, 국제 학술지 표지 장식|34|soc_h
soc|record|{S} 소아암 완치율 국내 최고|40|soc_h
soc|award|{S}, 응급의료 평가 최우수|32|soc_h
soc|tech|{S} 신약 후보 물질 임상 진입|38|soc_h
soc|person|{S}, 물에 빠진 아이 뛰어들어 구했다|34|soc_p
soc|person|{S} 동네 어르신 무료 이발 {y}년|22|soc_p
soc|person|{S}, 주운 돈 {m}만 원 주인 찾아 줬다|20|soc_p
soc|person|{S} 골목 청소 모임, 동네 풍경 바꿨다|22|soc_p
soc|person|{S}, 장애 이웃 출근길 {y}년째 동행|26|soc_p
soc|share|{S}, 폭염 속 노동자 쉼터 {n}곳 열어|26|soc_co
soc|share|{S} 미혼 한부모 가정 생활비 지원|26|soc_co
soc|share|{S}, 결식 아동 도시락 {n}만 개 전달|28|soc_co
soc|share|{S} 은퇴자 재취업 교육 {n}00명 수료|26|soc_co
soc|policy|{S}, 전세 계약 무료 검토 서비스 호응|30|soc_g
soc|policy|{S} 고독사 예방 안부 전화 효과|30|soc_g
soc|policy|{S}, 발달장애인 주간 활동 시간 늘렸다|28|soc_g
soc|policy|{S} 아이 돌봄 대기 시간 절반으로|30|soc_g
soc|policy|{S}, 마약 예방 교육 학교 {n}0곳 확대|28|soc_gp
soc|policy|{S} 전화금융사기 전담팀, {m}억 원 되찾아 줘|36|soc_gp
soc|policy|{S}, 스토킹 신고 즉시 보호 체계 정착|32|soc_gp
soc|policy|{S} 교통 단속 대신 계도…주민 호응|24|soc_gp
soc|tech|{S}, 인공 각막 이식 첫 성공|40|soc_h
soc|record|{S} 장기 이식 생존율 세계 최고 수준|38|soc_h
soc|policy|{S}, 지방 환자 원격 진료 시작|30|soc_h
soc|share|{S} 의료진, 해외 오지 무료 수술|30|soc_h
soc|record|{S} 응급실 대기 시간 {n}% 줄여|30|med|med
soc|tech|{S}, 중증 화상 치료 신기술 도입|34|med|med
soc|policy|{S}, 교사 행정 업무 줄였다|28|edu|edu
soc|record|{S} 학교 폭력 신고 3년 새 절반|30|edu|edu
soc|award|{S} 수업 혁신 사례 국제 대회 수상|30|edu|edu
soc|policy|{S}, 판결문 쉬운 말 쓰기 정착|26|court|court
soc|policy|{S} 법정 통역 지원 {n}개 언어로 확대|24|court|court
soc|person|{S}, 20년 미제 사건 해결|40|case|case
soc|person|{S} 몸 던져 흉기 난동 막았다|36|case|case
soc|person|{S}, 공익 신고로 {m}억 원 국고 환수|36|inv|inv
soc|record|{place} 헌혈 참여 사상 최대|26|대한적십자사
soc|record|올해 장기 기증 서약 역대 최다|30|장기조직기증원
soc|record|보이스피싱 신고 포상금 첫 1억 원|28|금융감독원
soc|record|전국 범죄 발생 10년 만에 최저|40|경찰청
soc|record|119 출동 평균 시간 7분대 진입|30|소방청
soc|record|교통 사망자 통계 작성 이후 최저|38|경찰청
soc|record|고교 학업 중단율 역대 최저|30|교육부
soc|record|노인 일자리 만족도 90% 넘어|26|보건복지부
soc|record|국민연금 기금 수익률 역대 최고|40|국민연금공단
soc|policy|{S}, 방과후 무료 돌봄 {n}00명 수용|28|edu|edu
soc|award|{S} 학생들, 국제 과학 올림피아드 금메달|38|edu|edu
soc|policy|{S} 기초학력 지원 1년…성적 올랐다|30|edu|edu
soc|share|{S}, 등록금 동결하고 장학금 늘려|32|edu|edu
soc|policy|{S}, 전자 소송 처리 기간 절반으로|30|court|court
soc|award|{S} 국선 변호 만족도 역대 최고|28|court|court
soc|policy|{S}, 장애인 재판 지원 제도 첫 도입|30|court|court
soc|person|{S}, 잠복 끝에 연쇄 절도범 검거|34|case|case
soc|person|{S}, 시민 제보로 실종 노인 찾았다|28|case|case
soc|person|{S}의 전화 한 통이 보이스피싱 막았다|30|case|case
soc|policy|{S}, 지역 응급 의료 공백 메웠다|34|med|med
soc|policy|{S} 야간 소아 진료 시작…부모들 환영|32|med|med
soc|share|{S} 간호 인력 처우 개선 앞장|28|med|med
soc|person|{S}, 끈질긴 감시로 예산 {m}억 원 아꼈다|36|inv|inv
soc|person|{S}, 10년 싸움 끝에 제도 바꿨다|38|inv|inv
pol|deal|{S}, 민생 법안 {n}건 합의 처리|40|pol_d
pol|deal|{S}, 저출생 대책 특별법 처리|42|pol_d
pol|deal|{S} 협치…예산안 법정 시한 안에 통과|44|pol_d
pol|deal|{S}, 소상공인 지원법 만장일치|36|pol_d
pol|deal|{S} 청년 주거 지원법 처리|34|pol_d
pol|deal|{S}, 지방 소멸 대응법 합의|36|pol_d
pol|deal|{S} 의료 개혁 법안 극적 타결|44|pol_d
pol|deal|{S}, 반도체 지원법 신속 처리|38|pol_d
pol|deal|{S} 장애인 이동권 법안 처리|32|pol_d
pol|deal|{S}, 정쟁 멈추고 재난 지원 합의|36|pol_d
pol|policy|{S}, 규제 {n}건 한꺼번에 풀었다|38|pol_g
pol|policy|{S} 디지털 민원 원스톱 서비스 호응|30|pol_g
pol|award|{S}, 공공기관 채용 투명성 평가 최고|32|pol_g
pol|award|{S} 재난 대응 체계 국제 평가 1위|36|pol_g
pol|policy|{S}, 정책 실명제 도입…시민 의견 {n}00건 반영|30|pol_g
pol|policy|{S}, 공공요금 동결 결정|34|pol_g
pol|award|{S} 탄소 중립 이행 점검 최고 등급|30|pol_g
pol|policy|{S}, 국정과제 이행률 {n}% 공개|28|pol_g
pol|policy|{S} 청년 정책 참여단 출범|26|pol_g
pol|pper|{S}, 세비 일부 반납해 장학금|30|pol_p
pol|pper|{S} 지역구 민원 {n}00건 직접 챙겨|28|pol_p
pol|pper|{S}, 여야 가교 역할 호평|32|pol_p
pol|deal|{S} 대표 발의 법안 본회의 통과|34|pol_p
pol|pper|{S}, 국정감사 우수 의원 선정|30|pol_p
pol|pper|{S} 저서 인세 전액 기부|26|pol_p
pol|pper|{S}, 의정 활동비 공개로 신뢰 얻어|28|pol_p
pol|record|총선 투표율 역대 최고 수준|40|중앙선거관리위원회
pol|deal|{S}, 전세 사기 지원법 처리|38|pol_d
pol|deal|{S} 간호법 합의…현장 "환영"|36|pol_d
pol|deal|{S}, 고준위 방폐장 특별법 처리|38|pol_d
pol|deal|{S} 국회 윤리 강화법 처리|32|pol_d
pol|deal|{S}, 노인 일자리 확대 예산 합의|32|pol_d
pol|policy|{S}, 1인 가구 지원 대책 발표|30|pol_g
pol|policy|{S} 지역 균형 발전 예산 확대|32|pol_g
pol|award|{S}, 전자 정부 평가 세계 1위|36|pol_g
pol|policy|{S} 공공 서비스 앱 하나로 통합|28|pol_g
pol|pper|{S}, 장애인 보좌진 채용 앞장|28|pol_p
pol|pper|{S} 쪽방촌 찾아 겨울 봉사|24|pol_p
pol|pper|{S}, 정치 후원금 내역 전부 공개|28|pol_p
pol|pper|{S} 법안 처리 실적 1위|30|pol_p
pol|record|국회 청원 처리 기간 절반으로|26|국회사무처
pol|record|지방선거 사전 투표율 역대 최고|34|중앙선거관리위원회
pol|record|국회 법안 처리율 20년 만에 최고|36|국회사무처
pol|record|정부 신뢰도 OECD 상위권 진입|38|국무조정실
pol|record|청년 정치 참여 크게 늘었다|28|중앙선거관리위원회
pol|record|국민 청원 답변률 역대 최고|30|대통령실
pol|deal|여야 대표 회동 정례화 합의|32|국회
pol|policy|국회 회의록 전면 공개 시작|26|국회사무처
pol|record|공공기관 정보 공개율 역대 최고|30|행정안전부
int|policy|{S}, 재외국민 {n}00명 무사 귀국 도왔다|40|diplo|diplo
int|contract|{S} 방산 수출 {m}억 달러 계약|44|diplo|diplo
int|policy|{S}, 이산가족 화상 상봉 성사|40|diplo|diplo
int|award|{S} 해외 파병 부대 현지 호평|32|diplo|diplo
int|policy|{S} 비자 면제국 {n}곳 늘려|30|diplo|diplo
int|contract|{S}, 공급망 협정 타결|38|diplo|diplo
int|perf|{S}, {country} 시장 점유율 1위|38|int_co
int|hire|{S} {country}에 첫 공장 착공|40|int_co
int|perf|{S}, 현지 판매 {n}% 늘어|32|int_co
int|contract|{S} 해외 박람회서 {m}억 원 계약|34|int_co
int|launch|{S} 현지 매장 개점 첫날 인파|30|int_co
int|launch|{S}, 할랄 인증 받고 중동 진출|30|int_co
int|contract|{S} 현지 기업과 합작 법인 설립|32|int_co
int|award|{S}, 현지 소비자 만족도 1위|28|int_co
int|perf|{S} 현지 온라인몰 판매 1위|30|int_co
int|contract|{S}, 현지 국영 기업과 장기 공급 계약|38|int_co
int|person|{S}, 현지 재난 현장서 구호 활동|32|int_p
int|award|{S}, 현지 언론 선정 올해의 인물|34|int_p
int|person|{S} 한국 문화 강좌 {y}년째|24|int_p
int|award|{S}, 현지 선거 당선|36|int_e
int|award|{S}, 현지 대학 총장 취임|30|int_u
int|award|{S} 국제기구 고위직 진출|34|int_o
int|award|{S}, 국제 학술상 수상|34|int_p
int|policy|{S}, 교민 안전 대피 신속 지원|36|int_g
int|policy|{S} 현지 한국어 교육 확대 합의|28|int_g
int|contract|{S}, 수출길 연 무역 협정 서명|40|int_g
int|policy|{S} 해외 취업 청년 {n}00명 연결|28|int_g
int|contract|{S}, 에너지 협력 협정 체결|34|int_g
int|contract|{S} 우주 협력 양해각서|32|int_g
int|award|{S}, 기후 기금 의장국 선출|32|int_g
int|share|{S}, {country}에 학교 {n}곳 지어 줬다|28|int_n
int|share|{S} 개발도상국 의료 봉사|28|int_n
int|share|{S}, {country} 식수 지원 사업 완공|26|int_n
int|share|{S} 난민 아동 교육 지원|26|int_n
int|record|{country}에서 한국 드라마 시청 1위|30|현지 방송사
int|record|K-팝 공연 {country} 매진 행렬|32|현지 기획사
int|record|방한 관광객 {country}발 급증|30|한국관광공사
int|record|한국산 농식품 수출 역대 최대|36|농림축산식품부
int|record|한국 여권 파워 세계 2위|30|외교부
int|record|한국 웹툰 북미 매출 첫 1위|32|콘텐츠진흥원
int|record|한국 화장품 {country} 수입 1위|30|KOTRA
int|record|세계 대학 평가 한국 대학 약진|28|교육부
int|record|K-방산 수출국 {n}개국으로|36|방위사업청
int|record|한국 영화 {country} 박스오피스 1위|32|영화진흥위원회
cul|record|{S} 관람객 사상 최대|30|cul_i
cul|event|{S}, 특별전에 {n}만 명 몰려|28|cul_i
cul|record|{S} 기획 공연 전석 매진|28|cul_i
cul|record|{S} 연간 회원 {n}만 명 돌파|24|cul_i
cul|award|{S}, 국제 디자인상 수상|28|cul_i
cul|award|{S} 올해의 문화 기관 선정|26|cul_i
cul|event|{S} 야간 개장 시민 호응|24|cul_i
cul|record|{S}, 어린이 관람객 두 배|24|cul_i
cul|record|{S} 온라인 전시 조회 {n}0만|24|cul_i
cul|record|{S}, 개봉 첫 주 관객 {n}0만|36|cul_w
cul|contract|{S} 해외 {n}개국 판권 계약|34|cul_b
cul|record|{S}, 베스트셀러 1위 역주행|30|cul_b
cul|record|{S}, 개막 첫 달 전석 매진|30|cul_m
cul|award|{S} 해외 초청 공연 기립 박수|30|cul_m
cul|record|{S} 출간 한 달 만에 {n}만 부|28|cul_b
cul|award|{S} 국제 영화제 초청|36|cul_w
cul|record|{S}, 관객 평점 9점대 호평|28|cul_w
cul|record|{S} 천만 관객 돌파|46|cul_w
cul|record|{S}, OTT 글로벌 순위 1위|36|cul_w
cul|record|{S} 원작 웹툰 판매도 껑충|26|cul_w
cul|award|{S}, 칸 영화제 경쟁 부문 진출|42|cul_w
cul|record|{S} 개봉 2주째 예매율 1위|30|cul_w
cul|person|{S}, 국제 무대서 기립 박수|32|cul_p
cul|share|{S}, 수익금 전액 후배 지원|28|cul_p
cul|award|{S} {y}년 만의 복귀작 호평|30|cul_p
cul|award|{S}, 세계 3대 문학상 후보|40|cul_p
cul|award|{S}, 국제 콩쿠르 우승|38|cul_p
cul|record|{S} 첫 개인전 완판|26|cul_p
cul|share|{S}, 청년 예술인 {n}00명 창작 지원|28|cul_co
cul|share|{S} 문화 소외 지역 찾아가는 공연|26|cul_co
cul|share|{S}, 국가유산 복원에 {n}억 원 기부|30|cul_co
cul|policy|{S}, 문화누리카드 이용률 역대 최고|28|cul_g
cul|policy|환수한 문화유산 국내 첫 공개|36|국가유산청
cul|policy|{S}, 지역 서점 살리기 효과|26|cul_g
cul|event|{S} 한글 전시 해외 순회 성황|26|cul_g
cul|event|{S}, 전통시장 문화 공연 호응|24|cul_g
cul|record|{S} 궁궐 무료 개방 첫 달 {n}만 명|28|cul_g
cul|record|국내 출판 시장 3년 만에 반등|28|출판문화협회
cul|record|공연 티켓 판매 역대 최고|30|예술경영지원센터
cul|record|한국 영화 해외 판매 사상 최대|36|영화진흥위원회
cul|record|외국인 관광객 박물관 방문 크게 늘어|26|국립중앙박물관
spo|sport|{S}, 10연승 질주|34|spo_t
spo|sport|{S} 창단 첫 우승|46|spo_t
spo|sport|{S}, 극적 역전승으로 결승행|36|spo_t
spo|record|{S} 홈 관중 {n}만 명 돌파|32|spo_t
spo|sport|{S}, 아시아 정상 등극|44|spo_t
spo|record|{S} 시즌 최다 승 신기록|38|spo_t
spo|sport|{S}, 꼴찌에서 선두로|34|spo_t
spo|record|{S} 홈 개막전 매진|28|spo_t
spo|sport|{S}, 연장 끝 짜릿한 승리|28|spo_t
spo|sport|{S} 전국체전 종합 우승|30|spo_t
spo|award|{S}, 시즌 MVP 수상|38|spo_p
spo|sport|{S} 데뷔 첫 해트트릭|34|spo_p
spo|record|{S}, 세계 신기록 경신|46|spo_p
spo|contract|{S} 해외 리그 진출 확정|40|spo_p
spo|share|{S}, 연봉 일부 유소년에 기부|28|spo_p
spo|sport|{S} 부상 딛고 복귀전 승리|32|spo_p
spo|sport|{S}, 올림픽 금메달|48|spo_p
spo|record|{S}, 통산 기록 새로 썼다|34|spo_p
spo|award|{S} 첫 국가대표 발탁|30|spo_y
spo|award|{S}, 팬 투표 1위|26|spo_p
spo|share|{S}, 유소년 선수 {n}0명에 장학금|26|spo_co
spo|share|{S} 장애인 스포츠단 창단 지원|28|spo_co
spo|share|{S}, 동네 운동장 {n}곳 새 단장|24|spo_co
spo|share|{S} 은퇴 선수 일자리 사업|26|spo_co
spo|share|{S}, 지역 어린이 무료 스포츠 교실|24|spo_co
spo|policy|{S}, 생활 체육 참여율 역대 최고|28|spo_g
spo|policy|{S} 선수 인권 상담 창구 호응|26|spo_g
spo|award|{S}, 국제대회 유치 성공|40|spo_g
spo|award|{S}, 올해의 선수상|36|spo_p
spo|sport|{S} 은퇴 경기 만원 관중|30|spo_p
spo|sport|{S}, 홈 {n}연승 신바람|30|spo_t
spo|record|{S} 시즌권 하루 만에 완판|28|spo_t
spo|record|프로야구 관중 역대 최다 기록|42|프로야구연맹
spo|record|마라톤 참가자 {n}만 명 몰려|26|대회 조직위
spo|record|e스포츠 결승 시청자 {n}00만|32|게임 리그 사무국
spo|record|K리그 평균 관중 최고 기록|34|프로축구연맹
spo|sport|{S}, 노히트노런 달성|44|base_p|base
spo|award|{S}, 투수 3관왕|38|base_p|base
spo|record|{S} 구단 최다 관중 매진 행진|34|base|base
spo|sport|{S}, 한국시리즈 진출|42|base|base
spo|sport|{S}, 리그 무패 행진|36|foot|foot
spo|contract|{S} 유럽 빅클럽 이적|44|foot|foot
spo|sport|{S}, 월드컵 본선행|46|foot|foot
loc|event|{S} 봄꽃 축제 방문객 {n}0만 명|30|loc_e
loc|event|{S}, 야시장 개장 첫 주 인파|26|loc_e
loc|award|{S} 지역 축제, 문화관광축제 선정|30|loc_e
loc|record|{S} 해변 피서객 역대 최다|28|loc_e
loc|event|{S} 불꽃 축제 성황|28|loc_e
loc|event|{S}, 겨울 축제에 외국인 관광객 몰려|28|loc_e
loc|event|{S} 전통 장터 주말마다 북적|24|loc_e
loc|event|{S}, 마라톤 대회로 지역 경제 활기|26|loc_e
loc|policy|{S}, 출생아 수 반등|38|loc_g
loc|policy|{S} 공공 산후조리원 호응|30|loc_g
loc|policy|{S}, 청년 인구 순유입 전환|36|loc_g
loc|policy|{S} 버스 준공영제 만족도 상승|28|loc_g
loc|policy|{S}, 빈집 활용 청년 창업 공간|28|loc_g
loc|policy|{S} 무료 시내버스 1년…이용객 두 배|32|loc_g
loc|award|{S}, 전국 지자체 평가 1위|34|loc_g
loc|hire|{S} 기업 유치로 일자리 {n}00개|38|loc_g
loc|policy|{S}, 교통 혼잡도 {n}% 개선|28|loc_g
loc|policy|{S} 공공 배달앱 가입 {n}만 명|26|loc_g
loc|award|{S}, 탄소 중립 도시 선정|30|loc_g
loc|policy|{S} 어르신 무료 셔틀 호응|24|loc_g
loc|hire|{S}, 지역 인재 {n}00명 채용|30|loc_co
loc|share|{S} 지역 상품권 {m}억 원 구매|24|loc_co
loc|share|{S}, 농가와 상생 계약|26|loc_co
loc|share|{S} 지역 학교에 장학금|22|loc_co
loc|hire|{S}, 지역에 연구소 세운다|32|loc_co
loc|share|{S} 지역 축제 후원|22|loc_co
loc|person|{S}, 폐교 위기 학교 살렸다|32|loc_p
loc|person|{S} 마을 기업으로 매출 {y}억|28|loc_p
loc|share|{S}, 30년 지킨 마을 지도 기증|22|loc_p
loc|person|{S} 홀몸 어르신 안부 살피기 {y}년|24|loc_p
loc|person|{S}, 마을 도서관 손수 지었다|24|loc_p
loc|award|{S} 올해의 농업인 선정|24|loc_p
loc|policy|{S}, 24시간 어린이 병원 문 열었다|32|loc_g
loc|policy|{S} 청년 월세 지원 만족도 90%|26|loc_g
loc|policy|{S}, 시골 버스 하루 {n}회로 늘렸다|24|loc_g
loc|award|{S} 살기 좋은 도시 평가 1위|32|loc_g
loc|policy|{S}, 폐교를 마을 도서관으로|24|loc_g
loc|hire|{S} 귀농 정착 가구 {n}00곳 넘어|28|loc_g
loc|person|{S}, 버려진 논에 체험 농장|24|loc_p
loc|person|{S} 사투리 사전 펴냈다|22|loc_p
loc|share|{S}, 어르신 무료 도시락 {y}년|24|loc_co
loc|hire|{S} 지역 청년 창업 {n}곳 지원|26|loc_co
loc|record|{city} 관광객 사상 최대|30|{city} 관광과
loc|record|지역 특산물 온라인 매출 급증|26|{city} 농업기술센터
loc|record|{city} 신혼부부 정착 늘었다|28|{city} 인구정책과
loc|policy|{S}, 예산 절감 {m}억 원 시민에게 환원|30|city|city
loc|policy|{S} 주민참여예산 사업 호평|26|city|city
loc|award|{S}, 행정 서비스 평가 최우수|28|city|city
loc|policy|{S} 지역 거점 병원 개원|34|nat|nat
loc|policy|{S}, KTX 정차역 유치 성공|36|nat|nat
ent|record|{S}, 음원 차트 1위|32|ent_a
ent|record|{S} 월드 투어 {n}개 도시 매진|38|ent_a
ent|record|{S}, 빌보드 차트 진입|44|ent_a
ent|record|{S} 데뷔 앨범 초동 {n}만 장|36|ent_a
ent|award|{S}, 해외 시상식 수상|42|ent_a
ent|record|{S} 팬미팅 {n}분 만에 매진|28|ent_a
ent|record|{S}, 데뷔 {y}년 만에 첫 1위|30|ent_a
ent|share|{S} 기부 선행 화제|24|ent_a
ent|award|{S}, 음악 방송 {n}관왕|30|ent_a
ent|record|{S} 컴백 첫날 음원 상위권 싹쓸이|32|ent_a
ent|contract|{S}, 글로벌 브랜드 모델 발탁|28|ent_a
ent|record|{S} 뮤직비디오 1억 뷰|30|ent_a
ent|record|{S}, 시청률 {n}% 돌파|34|ent_c
ent|record|{S} 최고 시청률 경신|32|ent_c
ent|record|{S}, OTT 글로벌 순위 1위|38|ent_c
ent|contract|{S} 해외 {n}개국 판매|30|ent_c
ent|record|{S}, 화제성 지수 1위|26|ent_c
ent|contract|{S} 다음 시즌 제작 확정|26|ent_c
ent|award|{S}, 시상식 작품상|32|ent_c
ent|record|{S} 원작 웹툰도 역주행|24|ent_c
ent|event|{S}, 촬영지에 관광객 몰려|26|ent_c
ent|award|{S} 출연진 인생 연기 호평|26|ent_c
ent|contract|{S}, 리메이크 판권 수출|28|ent_c
ent|policy|{S}, 연습생 처우 개선 업계 첫 도입|30|ent_co
ent|perf|{S} 상반기 매출 사상 최대|36|ent_co
ent|policy|{S}, 신인 개발 시스템 호평|26|ent_co
ent|award|{S} 아티스트 정산 투명성 1위|28|ent_co
ent|hire|{S}, 해외 법인 설립|30|ent_co
ent|share|{S} 청소년 음악 교실 후원|24|ent_co
ent|policy|{S}, 아티스트 마음 건강 프로그램 도입|26|ent_co
ent|award|{S}, 국제 영화제 연기상|42|ent_p
ent|award|{S} 연기 변신 호평|26|ent_p
ent|person|{S}, 데뷔 {y}년 차 첫 주연|24|ent_p
ent|award|{S}, 광고계 러브콜 1순위|26|ent_p
ent|share|{S} 남몰래 {y}년째 기부|26|ent_p
ent|award|{S}, 할리우드 진출 확정|38|ent_p
ent|record|음반 판매 역대 최대|34|음반산업협회
ent|record|극장가 여름 관객 회복|30|영화진흥위원회
ent|record|K-팝 해외 공연 매출 최대|34|콘텐츠진흥원`;
// 펼치기: 주어 목록이 있는 줄은 주어마다 하나씩 템플릿이 된다
const POS_FIN=/은행|보험|생명|증권|캐피탈|카드|로펌|법무법인|협회|병원|홈쇼핑|시큐리티|연구원|리서치|조사/;
const POS_GEN=[['corp','perf','{E}, 분기 실적 시장 예상 웃돌아',38],['corp','launch','{E} 신제품, 소비자 평가 1위',30],['corp','hire','{E}, 청년 채용 {n}0명 늘린다',30],['corp','share','{E} 협력사 상생 기금 {n}억 원 출연',28],['corp','share','{E}, 사회공헌 사업 {y}년째 이어 와',24],['gov','policy','{E}, 민원 처리 기간 절반으로 줄였다',28],['gov','policy','{E} 대표 사업 만족도 {n}%로 올라',26],['gov','award','{E}, 국제 평가에서 우수 기관 선정',30],['gov','policy','{E} 정책 효과…관련 지표 {n}% 개선',30],['gov','record','{E}, 디지털 서비스 이용자 {n}만 명 돌파',26]].map(([kd,k,t,imp])=>({c:'gen',kd,k,t,s:'{E}',sk:'',imp,sd:null}));
const POS_TPL=[];(function(){POS_SPEC.trim().split('\n').forEach(l=>{const [c,k,t,imp,sk,sd]=l.split('|');const L=POS_SUBJ[sk];if(L&&t.includes('{S}'))L.forEach(s=>POS_TPL.push({c,k,t:t.replace('{S}',s),raw:t,s,sk,imp:+imp,sd:sd||null}));else POS_TPL.push({c,k,t:t.replace('{S}',sk),s:sk,sk:'',imp:+imp,sd:sd||null});});})();
function posFacts(k,fx){const P=POS_FK[k]||POS_FK.record;const key=P.find(x=>x.includes('*'));const rest=shuffle(P.filter(x=>x!==key)).slice(0,3);return parseFacts(shuffle([key].concat(rest)).join('|'),fx);}
// 호재 기사의 상대: 그 분류의 광고주·기관 (광고를 내는 곳 먼저)
const POS_EK={eco_co:'corp',eco_app:'corp',soc_co:'corp',soc_h:'corp',cul_co:'corp',spo_co:'corp',int_co:'corp',loc_co:'corp',ent_a:'corp',ent_co:'corp',ind:'corp',fin:'corp',stock:'corp',it:'corp',soc_g:'gov',pol_g:'gov',cul_g:'gov',spo_g:'gov',int_g:'gov',loc_g:'gov',loc_e:'gov',diplo:'gov',city:'gov',nat:'gov'};
const posKOK=(sk,k)=>!POS_EK[sk]||POS_EK[sk]===k;
const POS_EN={soc_h:/병원|의료|의대/,med:/병원|의료|보건|복지/,fin:/은행|금융|저축|카드|보험|생명|증권|캐피탈/,nat:/청$|도청|시청|광역|도$/,city:/청$|도청|시청|광역|의회|도$/,loc_g:/청$|도청|시청|광역|도$/,edu:/교육|학교|대학/,ent_co:/엔터|레이블|기획|뮤직|음원/};
function posEnt(cat,force,kk,sk){if(force&&ENT[force])return force;const nre=sk&&POS_EN[sk];const L=ENTS.filter(e=>(e[2]==='corp'||e[2]==='gov')&&(e[4]||0)>0&&(!kk||e[2]===kk)&&(!nre||nre.test(e[1]))&&e[3]===cat&&!/\(/.test(e[1])&&S.net&&S.net[e[0]]);if(!L.length)return null;const W=L.map(e=>(e[4]||.003)*(S.net[e[0]].known?1.6:1)+.004);let r=Math.random()*W.reduce((a,b)=>a+b,0);for(let i=0;i<L.length;i++){r-=W[i];if(r<=0)return L[i][0];}return L[0][0];}
function posRate(d0){if(!S||S.story||S.rank===0)return 0;if(d0==='inv')return .08;let p=.26;const c=catOf(d0);if(c.some(x=>['ent','spo','cul','eco','loc'].includes(x)))p+=.04;try{const k=oidOf();if(['industry','fandom','corp','lord','gov'].includes(k))p+=.1;if(['truth','watch','expert'].includes(k))p-=.06;}catch(e){}if(S.founder)p-=.04;return clamp(p,.05,.45);}
function posItem(d0,o={}){const cats=catOf(d0);let pool=POS_TPL.filter(t=>cats.includes(t.c)&&(!t.sd||t.sd===d0));if(o.forceEnt&&ENT[o.forceEnt]){const c=ENT[o.forceEnt].c;const p2=POS_TPL.filter(t=>t.c===c&&t.s.includes('{E}')&&!t.sd&&posKOK(t.sk,ENT[o.forceEnt].kind));const kd=ENT[o.forceEnt].kind,SAFE=['eco_co','soc_co','cul_co','spo_co','loc_co','int_co','int_n','pol_g','cul_g','spo_g','int_g','loc_g','city','nat','ent_co'];const p3=p2.filter(t=>SAFE.includes(t.sk)&&['perf','hire','share','award','policy','record','event','contract'].includes(t.k)&&!(POS_FIN.test(ENT[o.forceEnt].n)&&['launch','tech','record','event'].includes(t.k)));const g=POS_GEN.filter(t=>t.kd===kd);pool=p3.length&&chance(.6)?p3:g;}if(!pool.length)return null;
  const own=pool.filter(t=>t.sd===d0);const recent=new Set(S.items.map(i=>i.base).concat((S.clips||[]).slice(0,16).map(c=>c.base)));let L=(own.length&&chance(.4)?own:pool).filter(t=>!recent.has(t.t));if(!L.length)L=pool;const t=pick(L);
  let eid=null;if(t.t.includes('{E}')){eid=posEnt(t.c,o.forceEnt,t.kd||POS_EK[t.sk],t.sk);if(eid&&!o.forceEnt&&['tech','launch'].includes(t.k)&&POS_FIN.test(ENT[eid].n))eid=null;}const en=eid?ENT[eid].n:'';const V=vars();V.y=R(3,15);try{const cs=ENTS.filter(e=>e[2]==='corp'&&(e[4]||0)>0&&(e[3]===t.c||e[3]==='eco')&&!/\(|협회|연맹|로펌|병원|대학|플랫폼|시네마|엔터|레이블|회의소|중앙회|홈쇼핑|OTT|포털|항공|택배/.test(e[1])&&!POS_FIN.test(e[1])&&!/^(ag|team)/.test(e[0]));if(cs.length)V.corp=pick(cs)[1];const ag=ENTS.filter(e=>/^ag\d/.test(e[0]));if(ag.length)V.agency=pick(ag)[1];const tm=ENTS.filter(e=>/^team\d/.test(e[0]));if(tm.length)V.team=pick(tm)[1];}catch(e){}const f=filler(V);const fx=s=>f(String(s).replace(/\{E\}/g,en||({eco:'{corp}',ent:'{agency}',spo:'{team}',cul:'{org}문화재단',soc:'{org}재단',loc:'{city}',int:'{corp}',pol:'국회'}[t.c]||'{corp}')));
  let tt=t.t,ts=t.s;if(t.s.includes('{E}')&&!eid&&t.raw){const alt=(POS_SUBJ[t.sk]||[]).filter(x=>!x.includes('{E}'));if(alt.length){ts=pick(alt);tt=t.raw.replace('{S}',ts);}}const title=fx(tt),subj=fx(ts);const base=makeItem(d0,{noPos:1,excl:o.excl??chance(.14),mult:o.mult});const facts=posFacts(t.k,s=>fx(String(s).replace(/\{S\}/g,subj)));const imp=Math.round(t.imp*(o.mult||1)*(.9+Math.random()*.22));const excl=!!base.excl;try{factsFor(facts,gradeOf({imp,excl}),fx,t.c);}catch(e){}
  for(let i=0;i<(o.pre||0);i++){const c=facts.filter(x=>!fOK(x)&&!x.key);if(c.length){const x=pick(c);fFill(x,o.via||'보도자료');}}
  Object.assign(base,{title,base:t.t,subj,facts,imp,d:cats.includes(t.c)?t.c:(t.c==='gen'&&eid&&cats.includes(ENT[eid].c)?ENT[eid].c:base.d),ent:eid||posEntOf(title,subj,t.c),pos:1,ideo:false,adv:false,hoax:false,src:o.src||base.src||'',posK:t.k,co:[]});return base;}
function posEntOf(title,subj,c){const fe=findEnt(title,subj,c);if(fe&&ENT[fe]&&!(title+subj).includes(ENT[fe].n))return null;return fe;}
function posHook(d0,o){if(o.noPos||o.excl===true||o.story||o.ticker||o.anyScale||o.hoax||o.keyConf||o.chain)return null;if(!S||S.phase!=='game'||S.story||!ENTS.length)return null;if(!chance(posRate(d0)))return null;try{return posItem(d0,o);}catch(e){console.error(e);return null;}}

// --- 호재 기사 출고 뒤: 상대와 관계가 좋아진다 (비판 기사는 반대) ---
function posWarm(id){const e=S.net&&S.net[id];return !!(e&&e.warm>S.turn);}
function posEntHit(it,W,imp){const id=it.ent,e=S.net&&S.net[id];if(!e)return '';const E=ENT[id];const wasKnown=e.known;e.known=true;
  const d=Math.min(10,imp/6*(it.excl?1.15:1)*(W.head==='bait'?.6:1)*(W.rb&&it.rebut==='got'?1.15:1)*(W.head==='calm'?.8:1));const r0=e.rel;netUp(id,d);const got=Math.max(1,Math.round(e.rel-r0));
  const out=[`${jo2(entName(id),'과','와')}의 관계 +${got}${wasKnown?'':' (이 기사로 상대가 나를 알게 됐다)'}`];
  if(E&&E.w>0&&(E.kind==='corp'||E.kind==='gov')){S.co.adB=(S.co.adB||0)+Math.min(.01,E.w*.2);e.warm=S.turn+YW/2;
    if(e.cut>0){e.cut=Math.max(0,e.cut-R(2,5));if(!e.cut){e.rel=Math.max(e.rel,-15);out.push(`${E.n} 광고가 다시 들어온다`);}else out.push(`${E.n} 광고 중단이 ${jo2(wkTxt(e.cut),'으로','로')} 줄었다`);}
    else out.push(`${E.n} 홍보실이 고맙다는 연락을 해 왔다 · 반년 동안 ${E.n} 광고 영업이 수월하다`);}
  // 홍보성 꼬리표: 석 달 새 호재 기사가 몰리면 신뢰가 깎인다 (절제형 제목은 덜 센다)
  if(W.head!=='calm'){S.posT=(S.posT||[]).filter(t=>t>S.turn-12);S.posT.push(S.turn);const n=S.posT.length;
    if(n>=3){const pen=+Math.min(2.4,.5*(n-2)).toFixed(1);apply({trust:-pen});try{valN('ind',-1,'호재 기사가 잇따랐다');}catch(x){}out.push(`석 달 새 호재 기사 ${n}건 — 댓글에 "광고 기사냐"는 말이 붙는다 (신뢰 -${pen})`);if(n>=5)portalPen(1,'홍보성 기사 반복');}}
  const vv=it.facts.filter(fOK);if(vv.length&&vv.every(f=>(f.via||[]).every(v=>/보도자료|홍보실/.test(v)))){apply({trust:-.4});out.push('홍보실 자료만으로 썼다 — 받아쓰기라는 눈총 (신뢰 -0.4)');}
  return out.join(' · ');}
// 기사 성격에 따른 보상 차등: 호재는 광고·관계, 확인을 탄탄히 한 비판 기사는 평판·신뢰·제보
function toneFx(it,fx,notes,ver,unv,W){const k=artTone(it);const cov=ver.length/Math.max(1,it.facts.length);
  if(k==='pos'){fx.fame=(fx.fame||0)*.55;fx.eval=(fx.eval||0)*.85;if(fx.trust>0)fx.trust*=.5;notes.push('호재 기사 — 상대와 광고국은 반기지만 업계 평판은 크게 오르지 않는다.');return;}
  if(k!=='crit')return;const E=ENT[it.ent];const pow=!!(E&&((E.kind==='corp'&&E.w>=.03)||E.kind==='person'||(E.kind==='gov'&&['pres','pros','fsc','ftc','moef','police','city'].includes(E.id))||E.kind==='party'));
  const b=(cov>=.8?1:cov>=.5?.6:.25)*(W.adTone==='soft'?.4:1);fx.fame=(fx.fame||0)*(1+.25*b)+.4*b+(pow?.5*b:0);fx.eval=(fx.eval||0)+.5*b;fx.trust=(fx.trust||0)+(cov>=.8&&W.rb?.6:0)+(pow&&cov>=.8?.4:0);
  if(cov>=.8){S.watchN=(S.watchN||0)+1;notes.push(pow?`감시 보도 — 힘 있는 상대(${E.n})를 제대로 짚었다. 업계 평판과 독자 신뢰가 더 오른다.`:'감시 보도 — 확인을 탄탄히 한 비판 기사라 평판과 신뢰가 더 오른다.');
    if(S.items.length<6&&chance(.22+(pow?.13:0))){const ni=makeItem(S.dept,{excl:true,noPos:1});ni.src='독자 제보';S.items.push(ni);notes.push(`기사를 본 내부자가 제보해 왔다 → 「${ni.title}」`);}}}
// 매달: 관계가 좋은 홍보실이 호재 거리를 먼저 보낸다
function posMonth(lines){if(!S||S.story||S.rank<1||S.items.length>=6||!chance(.12))return;const cats=catOf(S.dept);const L=ENTS.filter(e=>(e[2]==='corp'||e[2]==='gov')&&e[4]>0&&cats.includes(e[3])&&S.net[e[0]]&&S.net[e[0]].known&&S.net[e[0]].rel>=35&&!S.net[e[0]].cut);if(!L.length)return;const e=pick(L);const it=posItem(S.dept,{forceEnt:e[0],pre:1,via:'홍보실 자료'});if(!it)return;it.src='홍보실';S.items.push(it);lines.push({c:'g',t:`${e[1]} 홍보실이 자료를 먼저 보내왔다 → 「${it.title}」 (호재 아이템)`});}
// 투자 중 반전: 호재 아이템은 '윗선'이 아니라 숫자가 커진다
function posTwist(it,T){if(chance(.5)){it.imp=Math.min(99,it.imp+R(5,10));T.lines.push({c:'g',t:`반전 — 숫자가 예상보다 크다. 업계가 주목할 이야기다. (파급력 ${it.imp})`});}else T.lines.push({c:'s',t:'홍보실 자료와 현장 이야기가 조금 다르다. 숫자를 한 번 더 확인하자.'});}
const IVL_POS={got:['"좋게 봐 주셔서 감사합니다. 자료는 더 드리겠습니다."','"현장 직원들이 고생한 결과입니다."','"다음 분기에도 기대해 주셔도 좋습니다."','"숫자는 공시 그대로입니다. 과장 없이 써 주세요."'],no:['"공식 입장은 보도자료로 갈음하겠습니다."','"담당자가 출장 중이라 답이 늦어집니다."']};
// 호재 제목
const HEAD_P={honest:['{T}','{T}…{S} 측 "{R}"','{T}, 숫자로 확인해 보니','[취재] {T}','{T}…현장에서 본 비결','{T}…{N}'],calm:['{T}','{T}…업계 "좀 더 지켜봐야"','{T}, 의미와 남은 과제','{T}…반짝 효과일까'],bait:['{T}…"이게 된다고?"','역대급 {T}','{T}…모두가 놀란 이유','난리 난 {T}','{T}…비결은 따로 있었다','"대박 났다" {T}'],ask:['{T}, 비결은 무엇일까','{T}…어떻게 가능했나','{T}, 오래갈까']};
const HEAD_RP=['성원에 감사드린다','기대 이상의 반응이다','다음 목표는 해외 시장','현장 직원들 덕분이다','계속 좋은 모습 보이겠다'];
function headOptsPos(it,on,W){const T=it.title,S0=(it.subj||'').replace(/ 측$/,'');const nf=it.facts.find(f=>f.k==='n'&&fOK(f));const f=s=>subJ(s.replace(/\{T\}/g,T),'{S}',S0).replace(/\{R\}/g,pick(HEAD_RP)).replace(/\{N\}/g,nf?nf.t:'');const pre=it.excl?'[단독] ':'';const C=headCore(it);const hs=[];
  let yh=headYama(it,W,pre);if(yh)yh=yh.replace('왜 반복되나…','어떻게 가능했나…').replace(/ 책임은 어디까지$/,' 성공의 조건').replace('[탐사] ','[심층] ');
  if(yh)hs.push({k:'honest',y:1,h:yh,s:`야마형 — 잡은 야마를 제목에 살린다${W&&W.angle===it.yama?' · 이 기사에 딱 맞다, 완성도↑':''}`});
  if(C.K&&!(yh||'').includes(C.K))hs.push({k:'honest',h:pre+`${T}…${C.K}`,s:'정확형 — 확인한 사실을 박는다 · 신뢰도↑'});
  const hon=HEAD_P.honest.filter(h=>(!h.includes('{N}')||nf)&&(!h.includes('{R}')||it.rebut==='got'));shuffle(hon).slice(0,hs.length>=2?1:2).forEach(h=>hs.push({k:'honest',h:pre+f(h),s:'정확형 — 신뢰도가 조금 오른다'}));
  hs.push({k:'calm',h:f(pick(HEAD_P.calm)),s:'절제형 — 홍보 냄새를 뺀다. 반응은 약하지만 "광고 기사" 눈총을 피한다'});
  hs.push({k:'bait',h:pre+f(pick(HEAD_P.bait)),s:`자극형 — 조회수 ${on?'2배 이상':'1.5배'}, 신뢰도↓ · 포털 벌점`});
  if(C.Wq)hs.push({k:'quote',h:pre+`"${C.Wq}"…${T}`,s:'따옴표형 — 확인한 발언을 살린다. 조회수 +20%'});else hs.push({k:'quote',h:'(인용할 발언이 없다)',s:'증언을 확인해야 쓸 수 있다',dis:1});
  if(nf)hs.push({k:'num',h:pre+f(nf.t+'…{T}'),s:'숫자형 — 확인한 수치를 앞세운다. 완성도 +2, 조회수 +10%'});else hs.push({k:'ask',h:f(pick(HEAD_P.ask)),s:'의문형 — 궁금증을 건다. 조회수 +25%, 신뢰도 조금↓'});
  const seen=new Set();return hs.filter(x=>{x.h=x.h.replace(/(\S+) \1(?=$|…)/g,'$1');if(seen.has(x.h))return false;seen.add(x.h);return true;});}
// 데스크(부장) 초고: 호재 기사는 호재 기사의 문장으로
function deskPosOpen(S0){return pick([`${jo2(S0,'이','가')} 눈에 띄는 성과를 냈다.`,`${S0} 쪽에서 반가운 소식이 나왔다.`,`본지가 ${S0+'의'} 최근 성과를 들여다봤다.`,`${jo2(S0,'을','를')} 향한 관심이 커지고 있다.`]);}
function deskPosClose(S0){return pick(['업계는 이 흐름이 이어질지 주목하고 있다.','관계자들은 다음 목표를 준비하고 있다.',`${S0} 안팎에서는 기대감이 커지고 있다.`,'전문가들은 성과가 오래가려면 꾸준한 투자가 필요하다고 말한다.']);}
function deskPosReply(S0){return chance(.7)?`${jo2(S0+' 측','은','는')} "${pick(HEAD_RP)}"고 밝혔다.`:`${jo2(S0+' 측','은','는')} 구체적인 수치는 자료로 대신하겠다고 했다.`;}
function deskPosFlaws(d,S0,yy){const sp=t=>subJ(t,'{S}',S0);return {
  date:()=>{const b=pick([[2,30],[4,31],[6,31],[9,31],[11,31]]),g=pick([[3,31],[5,31],[8,31],[10,31],[12,31]]);const PT=[(y,m,x)=>`첫 출시는 ${y} ${m}월 ${x}일이었다.`,(y,m,x)=>`이 기록은 ${y} ${m}월 ${x}일 처음 세워졌다.`];const lab=pick(['지난해','재작년']);return {b:{t:pick(PT)(lab,b[0],b[1]),e:`${b[0]}월에는 ${b[1]}일이 없다.`},g:{t:pick(PT)(lab,g[0],g[1])}};},
  calc:()=>{const k=pick(['pct','dbl','sum']);if(k==='pct'){const a=R(4,9)*10,b=a+a/2;return {b:{t:`관객은 지난해 ${a}만 명에서 올해 ${b}만 명으로 ${chance(.5)?a/2:150}% 늘었다.`,e:`${a}만에서 ${b}만이면 50% 증가다.`},g:{t:`관객은 지난해 ${a}만 명에서 올해 ${b}만 명으로 50% 늘었다.`}};}
    if(k==='dbl'){const a=R(3,9)*20;return {b:{t:`매출은 1년 새 ${a}억 원에서 ${a*1.5}억 원으로 두 배가 됐다.`,e:`${a}억에서 ${a*1.5}억은 1.5배다. "두 배"는 과장.`},g:{t:`매출은 1년 새 ${a}억 원에서 ${a*2}억 원으로 두 배가 됐다.`}};}
    const x=R(30,90),y=R(20,70);return {b:{t:`국내 판매 ${x}만 개와 해외 판매 ${y}만 개를 합쳐 모두 ${x+y+R(1,3)*10}만 개가 팔렸다.`,e:`${x}만과 ${y}만을 더하면 ${x+y}만이다. 합계가 틀렸다.`},g:{t:`국내 판매 ${x}만 개와 해외 판매 ${y}만 개를 합쳐 모두 ${x+y}만 개가 팔렸다.`}};},
  hype:()=>{const P=[['이번 성과로 '+S0+'의 업계 1위 자리는 굳어졌다.','근거 없는 단정. 한 번의 성과로 순위를 확정했다.'],['소비자 모두가 이 제품에 열광하고 있다.','몇 명에게 물었는지 없이 "모두"로 일반화했다.'],['전문가들은 한목소리로 '+S0+'의 미래가 밝다고 평가했다.','어떤 전문가가 몇 명인지 없다. 익명의 다수로 뭉뚱그렸다.'],['한국 산업사를 새로 쓴 쾌거다.','기자의 감탄을 사실처럼 썼다. 과장된 평가.']];const G=[`업계 집계를 시작한 이후 가장 높은 수치라고 ${jo2(pick(['업계 협회','집계 기관','시장 조사 업체']),'은','는')} 밝혔다.`,`취재팀이 만난 소비자 ${R(5,12)}명 가운데 대부분이 만족한다고 답했다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};},
  jump:()=>{const P=[[`${jo2(S0,'은','는')} 이 성과로 해외 시장까지 장악하게 될 것이 확실하다.`,'미래를 단정했다. 전망은 출처와 근거를 붙여야 한다.'],[`경쟁사들은 사실상 백기를 든 셈이다.`,'근거 없는 비약. 경쟁사 입장을 확인하지 않았다.']];const G=[`${jo2(S0+' 측','은','는')} "아직 갈 길이 멀다"고 말했다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};},
  spell:()=>{const P=[['관객들은 몇일째 표를 구하려 줄을 섰다.','관객들은 며칠째 표를 구하려 줄을 섰다.','"몇일"은 없는 말. "며칠"이 맞다.'],['대표는 "다음 목표는 더 높은 곳이예요"라고 말했다.','대표는 "다음 목표는 더 높은 곳이에요"라고 말했다.','"곳이예요"가 아니라 "곳이에요"다.'],['팬들은 "기대가 되요"라며 웃었다.','팬들은 "기대가 돼요"라며 웃었다.','"되요"가 아니라 "돼요"다.'],['소식은 금새 업계에 퍼졌다.','소식은 금세 업계에 퍼졌다.','"금새"가 아니라 "금세"다.'],['직원들은 오랫만에 성과급을 받았다.','직원들은 오랜만에 성과급을 받았다.','"오랫만"이 아니라 "오랜만"이다.']];const L=shuffle(P.slice());return {b:{t:L[0][0],e:L[0][2]},g:{t:L[1][1]}};},
  dup:()=>{const P=[['판매량은 약 {X}여만 개로 집계됐다.','판매량은 약 {X}만 개로 집계됐다.','"약"과 "여"를 겹쳐 썼다. 둘 중 하나만.'],['예약은 사전에 미리 받았다.','예약은 미리 받았다.','"사전에 미리"는 겹말.'],['{S} 측은 "향후 앞으로 더 투자하겠다"고 했다.','{S} 측은 "앞으로 더 투자하겠다"고 했다.','"향후"가 곧 "앞으로"다. 겹말.'],['관객 과반수 이상이 다시 보겠다고 답했다.','관객 과반이 다시 보겠다고 답했다.','"과반수 이상"은 겹말.']];const L=shuffle(P.slice());const X=String(R(2,9)*10);const f=t=>sp(t.replace('{X}',X));return {b:{t:f(L[0][0]),e:L[0][2]},g:{t:f(L[1][1])}};},
  expose:()=>{const P=[[`${jo2(S0,'은','는')} 고객 만족을 위한 끝없는 혁신으로 업계 최고의 품질을 자랑한다.`,'보도자료 홍보 문구를 기자의 문장처럼 옮겼다. 출처 없는 자화자찬.'],[`지금 바로 가까운 매장에서 만나 볼 수 있다.`,'광고 문구다. 기사에 구매를 권하는 문장이 들어갔다.']];const G=[`회사 측은 보도자료에서 "품질에 자신이 있다"고 밝혔다.`];const p=pick(P);return {b:{t:sp(p[0]),e:p[1]},g:{t:sp(pick(G))}};}};}

// --- 부서 분위기·제자·팀 ---
function skBump(m,v){if(!m)return;if(v>0)v*=leadK();m.skill=+clamp((m.skill||30)+v,5,95).toFixed(2);}
function dinCost(){return clamp(deptPeople().length*5,30,90);}
const mKey=()=>Math.floor(S.turn/4);
// 내 팀의 직급은 나보다 아래다 (차장 아래는 기자, 부장 아래는 차장·기자)
function fixSub(L,cap){const setY=(m,ny)=>{const o=myrs(m);if(ny===o)return;m.yrs+=ny-o;if(m._dv!=null)m._dv+=skillYrs(o)-skillYrs(ny);};
  L.forEach(m=>{if((m.r||0)>cap)m.r=cap;m.acting=0;if(m.desk)m.desk=0;});const me=myY();
  if(cap>=1){const mids=L.filter(m=>m.r===1).sort((a,b)=>myrs(b)-myrs(a));const maxMid=L.length<=3?0:1+Math.floor(L.length/12);mids.slice(maxMid).forEach(m=>m.r=0);if(!mids.length&&L.length>=4){const c=L.slice().sort((a,b)=>myrs(b)-myrs(a))[0];c.r=1;}
    const mid=L.find(m=>m.r===1);if(mid){const capY=Math.max(10,me-1);if(myrs(mid)>capY)setY(mid,capY);if(myrs(mid)<10)setY(mid,10);}
    const capR=mid?myrs(mid)-1:Math.max(3,me-2);L.filter(m=>!m.r).forEach(m=>{if(myrs(m)>capR)setY(m,Math.max(1,capR));});}
  else{const capR=Math.max(3,me-1);L.forEach(m=>{if(myrs(m)>capR)setY(m,capR);});}}
function myTitle(){if(S.rank>=5)return '국장님';if(S.rank===4)return '부국장님';if(S.rank===3)return OUT().p<=2?'팀장님':'부장님';if(S.rank===2)return '차장님';return '선배';}
function hoLines(mode,t){const sub=S.rank>=2&&t.kind==='부서원';const jun=sub||!!(t.ref&&t.ref.role==='junior');const sen=!!(t.ref&&['boss','senior','cap'].includes(t.ref.role));const T=myTitle();
  if(mode==='order')return ['알겠습니다, 바로 붙겠습니다.',`네, ${T}. 이번 달 안에 확인하겠습니다.`,`${jo2(T,'이','가')} 맡기신 거니까 제대로 해 보겠습니다.`];
  if(jun){if(mode==='co')return [`${jo2(T,'과','와')} 같이 이름 거는 거면 영광이죠.`,'공동 바이라인이요? 더 꼼꼼히 하겠습니다.'];if(mode==='meal')return ['잘 먹겠습니다! 이 아이템도 꼭 살려 보겠습니다.',`밥까지 사 주시고… ${T}, 감사합니다.`];if(mode==='trade')return ['제 출입처 것도 하나 챙겨 드릴게요.'];return ['감사합니다. 잘 써 보겠습니다.','이거 정말 제가 써도 됩니까?','챙겨 주셔서 감사합니다. 꼭 보답하겠습니다.'];}
  if(sen){if(mode==='co')return ['같이 이름 걸자. 확인은 내가 더 봐 줄게.'];return ['그래, 고맙다. 잘 쓸게.','이걸 나한테 넘겨? 빚진 걸로 할게.'];}
  if(mode==='co')return ['같이 이름 걸자. 좋아.','공동 바이라인이면 더 신경 쓸게.'];return ['고마워, 잘 써 볼게.','이거 진짜 나 줘도 돼?','빚졌다. 꼭 갚을게.'];}
// 제자가 따라온다: 부서를 옮기거나 회사를 옮길 때, 관계와 평판이 좋으면 제자가 함께 가고 싶어 한다
function pgAfterMove(kind){const m=S._pgPrev;S._pgPrev=null;if(!m||!S.protege||m.name!==S.protege)return;if(deptPeople().some(x=>x===m||x.name===m.name))return;const rel=m.rel??20;
  const carry=!!S._pgCarry;S._pgCarry=0;
  const join=()=>{m.d=S.dept;m.reg=null;m.r=Math.min(m.r||0,Math.max(0,S.rank-2));m.acting=0;if(S.rank>=2){S.team=S.team||[];if(!S.team.includes(m))S.team.push(m);}mRel(m,6,'함께 옮김');log(`제자 ${jo2(m.name,'이','가')} ${kind==='co'?'회사를':'부서를'} 함께 옮겼다`);};
  if(carry&&kind==='co'){join();Q.push(()=>openModal('제자와 함께',`<p class="lede">조건대로 ${jo2(esc(m.name),'도','도')} 같은 날 첫 출근했다. "선배 덕분에 큰 데 와 보네요."</p>`));return;}
  if(S.rank>=2&&rel>=70&&(S.fame>=40||rel>=90)){Q.push(()=>openModal('제자의 부탁',`<p class="lede">${jo2(esc(m.name),'이','가')} 짐을 싸는 나를 찾아왔다. "${kind==='co'?'저도 데려가 주시면 안 될까요? 선배 밑에서 더 배우고 싶습니다.':'인사팀에 저도 그 부서로 보내 달라고 했어요. 선배만 괜찮으시면요.'}"</p><p class="hint">관계 ${Math.round(rel)} · 실력 ${Math.round(m.skill)}</p>`,[
    {label:kind==='co'?'새 회사에 함께 데려간다':'함께 가자고 한다',sub:`성사 ${pct(clamp((kind==='co'?.5:.7)+S.fame/300,.3,.95))} · 제자 관계 유지`,fn:()=>{if(chance(clamp((kind==='co'?.5:.7)+S.fame/300,.3,.95))){join();toast(`${m.name}: "열심히 하겠습니다!"`);}else{S.protege=null;mRel(m,-3);toast(kind==='co'?'새 회사가 한 명은 어렵다고 했다. 제자와는 여기서 헤어진다':'인사팀이 받아 주지 않았다. 제자는 원래 부서에 남는다');}}},
    {label:'"거기서 자리 잡아라"고 말해 준다',sub:'제자는 남는다 · 관계↑ · 평판 조금↑',fn:()=>{S.protege=null;mRel(m,8,'응원');toast(apply({fame:.3}));}}]));return;}
  S.protege=null;log(`제자 ${jo2(m.name,'과','와')} 떨어져 일하게 됐다`);}
// --- 다른 회사의 스카우트 제안 ---
function scoutMonth(lines){if(!S||S.founder||S.story||S.phase!=='game'||S.rank<1||S.rank>5||S.simple&&!chance(.6))return;if(S.turn-(S.scoutT??-99)<YW||(S.atOutlet||0)<YW)return;
  const rs=(S.clips||[]).filter(c=>!c.staff&&S.turn-(c.turn||0)<=12);const hot=rs.some(c=>c.excl&&c.imp>=55)||(S.watchN||0)>=3&&rs.some(c=>c.crit);
  const p=.012+Math.max(0,S.fame-25)/1000+(hot?.03:0)+(S.styT==='net'?.015:0)+(S.styT==='scoop'?.01:0);if(!chance(p))return;S.scoutT=S.turn;
  const cur=OUT();const L=OUTLETS.filter(o=>o.id!==S.outlet&&!o.closed&&!o.custom&&!o.npc&&Math.abs(o.p-cur.p)<=1&&o.p*12-14<=S.fame+S.eval/3&&xferRank(o,S.rank)>=S.rank);if(!L.length)return;
  const o=pick(L.slice().sort((a,b)=>b.p-a.p).slice(0,6));const f=offerFor(o);f.ok=true;if(f.rank<S.rank)f.rank=xferRank(o,S.rank);if(f.rank<=S.rank&&(S.fame>=50||hot)){const r2=xferRank(o,Math.min(S.rank+1,5));if(r2>f.rank)f.rank=r2;}f.adj=f.rank-S.rank;f.why=f.adj>0?'스카우트 대우':f.adj<0?'큰 회사라 한 단계 낮춰 들어간다':'';
  f.deal=jobDeal(f);if(!f.deal.bonus){const b=Math.round(payOf(cur)*R(2,4)/10)*10;f.deal.bonus=b;f.deal.pros.push(`이적 보너스 ${b.toLocaleString('ko-KR')}만 원`);f.deal.cond.push('2년 안에 나가면 보너스를 돌려준다');f.deal.sum+=` · 보너스 ${b.toLocaleString('ko-KR')}만`;}f.deal.payK=+(f.deal.payK+.05).toFixed(2);
  const who=pick([['tv','jp','ch'].includes(o.type)?'보도국장':'편집국장','부국장','인사 담당 상무','탐사팀장']);const why=hot?'지난번 그 기사, 우리 편집국에서 다들 돌려 봤어요.':S.fame>=50?'업계에서 이름 들은 지 오래됐습니다.':'요즘 쓰시는 기사 잘 보고 있습니다.';
  const pg=S.protege&&(S.team||[]).find(m=>m.name===S.protege);const bs=colBy('boss');
  lines.push({c:'g',t:`${o.n}에서 스카우트 제안이 왔다`});
  Q.push(()=>openModal(`스카우트 제안 · ${o.n}`,`<p class="lede">${esc(o.n)}(${TYPES[o.type].n} · ★${o.p}) ${jo2(who,'이','가')} 저녁 자리를 청했다. "${why} 우리 쪽으로 오시죠. ${rankName(f.rank,o)} 대우에 이적 보너스도 챙겨 드리겠습니다."</p><p class="fx"><b>한 줄 요약</b> — ${esc(f.deal.sum)}</p>${dealHTML(f.deal)}`,[
    {label:'옮긴다',sub:'조건을 자세히 보고 사표를 낸다',fn:()=>{confirmMove(f);return false;}},
    ...(pg&&(pg.rel??20)>=60?[{label:`제자 ${pg.name}도 함께 데려가겠다고 한다`,sub:`받아들여지면 제자가 같이 옮긴다 · 성사 ${pct(clamp(.45+S.fame/250,.3,.9))}`,fn:()=>{if(chance(clamp(.45+S.fame/250,.3,.9))){S._pgCarry=1;S._pgPrev=pg;toast(`"그분도 같이 모시죠." — 조건이 받아들여졌다`);}else toast('"한 분만 모시는 자리입니다." 제자는 두고 가야 한다');confirmMove(f);return false;}}]:[]),
    {label:'연봉 협상 카드로 쓴다',risk:true,sub:'평가가 높으면 회사가 붙잡는다 · 실패하면 윗선 눈 밖',fn:()=>{if(S.eval>=56&&chance(clamp(.5+(S.eval-56)/50,.3,.85))){S.payK=+((S.payK||1)*1.06).toFixed(2);toast('회사가 붙잡았다 — 월급 6% 인상 · '+apply({eval:.5}));log(`${o.n} 스카우트 제안으로 연봉 인상`);}else{if(bs)relUp(bs,-4,'이직 카드');toast('"갈 테면 가라"는 반응이 돌아왔다 · '+apply({eval:-1}));}}},
    {label:'정중히 거절한다',sub:'지금 회사에서 평가 조금↑ · 데스크 관계↑',fn:()=>{if(bs)relUp(bs,3,'회사에 남았다');toast(apply({eval:.6}));log(`${o.n} 스카우트 제안을 거절했다`);}}]));}
// --- 관계가 좋을 때 오는 일 (기관·광고주·인물) ---
function netGood(kind,min,needW){return ENTS.filter(e=>e[2]===kind&&S.net&&S.net[e[0]]&&S.net[e[0]].known&&netRel(e[0])>=min&&!S.net[e[0]].cut&&!S.net[e[0]].block&&(!needW||(e[4]||0)>0));}
NET_EVENTS.push(
 {w:3,c:()=>S.rank>=1&&S.items.length<6&&netGood('corp',45,1).length>0,run:()=>{const e=pick(netGood('corp',45,1));const E=ENT[e[0]];openModal('신제품 발표회 초대',`<p class="lede">${esc(E.n)} 홍보실에서 초대장이 왔다. "기자님은 꼭 와 주셨으면 해서요. 발표 전에 따로 설명도 드릴게요."</p><p class="hint">관계 ${Math.round(netRel(E.id))} · 호재 기사 거리를 먼저 얻는다</p>`,[
   {label:'간다',sub:'호재 아이템(자료 하나 확인된 채) · 관계↑ · 컨디션 조금↓',fn:()=>{S.hp=clamp(S.hp-4,0,100);netUp(E.id,3);const it=posItem(S.dept,{forceEnt:E.id,pre:1,via:'발표회 자료'});if(it){it.src='발표회';S.items.push(it);toast(`→ 「${it.title}」`);}}},
   {label:'자료만 받는다',sub:'관계 그대로',fn:()=>{toast('보도자료가 메일로 왔다');}}]);}},
 {w:2,c:()=>S.rank>=1&&S.items.length<6&&netGood('gov',45).length>0,run:()=>{const e=pick(netGood('gov',45));const E=ENT[e[0]];const it=posItem(S.dept,{forceEnt:E.id,pre:2,via:'사전 설명 자료'})||netItemFor(E,{pre:2});openModal('사전 설명',`<p class="lede">${esc(entName(E.id))} 쪽 담당자가 발표 하루 전 따로 불렀다. "기자님은 내용을 미리 알고 계셔야 제대로 쓰실 것 같아서요." → 「${esc(it.title)}」</p><p class="hint">관계가 좋아 자료가 먼저 온다. 다만 엠바고를 깨면 관계가 크게 깎인다</p>`,[
   {label:'엠바고를 지키고 받는다',sub:'확인된 사실 둘을 쥔 채 시작 · 관계↑',fn:()=>{S.items.push(it);netUp(E.id,3);}},
   {label:'받아서 먼저 쓴다',risk:true,sub:'단독이 된다 · 관계 크게↓ · 출입처에서 눈총',fn:()=>{it.excl=true;S.items.push(it);netUp(E.id,-18);toast(apply({fame:.6,trust:-.6}));}}]);}},
 {w:2,c:()=>S.rank>=1&&netGood('person',55).length>0,run:()=>{const e=pick(netGood('person',55));const E=ENT[e[0]];const it=netItemFor(E,{excl:true,pre:1});it.tape=1;it.quote=pick(['"이제는 말할 때가 된 것 같습니다."','"다른 데서는 이 얘기 안 했어요."','"기자님이니까 하는 얘기입니다."']);openModal('먼저 온 인터뷰',`<p class="lede">${esc(jo2(entName(E.id),'이','가'))} 직접 연락해 왔다. "다른 기자 말고, 기자님하고만 이야기하고 싶습니다."</p><p class="hint">관계 ${Math.round(netRel(E.id))} · 녹취가 있는 단독 인터뷰 아이템</p>`,[
   {label:'단독 인터뷰를 잡는다',sub:'녹취·인용 있는 단독 아이템 · 관계↑',fn:()=>{if(S.items.length<6)S.items.push(it);else toast('쥔 아이템이 너무 많다. 하나는 포기했다');netUp(E.id,2);}},
   {label:'"공정하게 다른 쪽 얘기도 듣겠다"고 답한다',sub:'신뢰↑ · 관계 조금↓',fn:()=>{netUp(E.id,-3);toast(apply({trust:1}));}}]);}},
 {w:2,c:()=>S.rank>=1&&S.items.some(i=>!i.pos&&i.ent&&ENT[i.ent]&&ENT[i.ent].kind==='corp'&&netRel(i.ent)>=50&&CRIT_RE.test(i.title||'')),run:()=>{const it=S.items.find(i=>!i.pos&&i.ent&&ENT[i.ent]&&ENT[i.ent].kind==='corp'&&netRel(i.ent)>=50&&CRIT_RE.test(i.title||''));const E=ENT[it.ent];openModal('좋은 사이의 부탁',`<p class="lede">그동안 사이가 좋던 ${esc(E.n)} 홍보 상무가 조용히 말했다. "「${esc(it.title)}」 건은… 우리 사이에 좀 봐주시면 안 될까요? 다음엔 제가 더 챙기겠습니다."</p><p class="hint">관계가 좋을수록 비판 기사의 대가가 크다. 쓰면 배신감으로 관계가 더 크게 깎인다</p>`,[
   {label:'그래도 쓴다',sub:'신뢰↑ · 관계 크게↓ · 감시 보도',fn:()=>{netUp(E.id,-15);toast(apply({trust:1.2}));S.resist=(S.resist||0)+1;}},
   {label:'표현을 다듬어 쓰겠다고 한다',sub:'관계 유지 · 쓸 때 파급력↓ · 신뢰 조금↓',fn:()=>{it.softAsk=1;it.imp=Math.round(it.imp*.8);netUp(E.id,2);toast(apply({trust:-.4}));}},
   {label:'이번엔 접는다',risk:true,sub:'관계↑ · 신뢰↓ · 들키면 더 크게',fn:()=>{S.items=S.items.filter(x=>x!==it);netUp(E.id,8);try{valN('ind',-4,'친한 광고주 부탁에 기사를 접었다');}catch(x){}toast(apply({trust:-1.5}));if(chance(.15*(DF().risk||1)))S.pending.push({type:'ethic',why:`${E.n} 부탁으로 기사를 접었다`,due:S.turn+R(8,24)});}}]);}},
 {w:2,c:()=>S.rank>=2&&netGood('corp',55,1).length>0,run:()=>{const e=pick(netGood('corp',55,1));const E=ENT[e[0]];const amt=+Math.max(.03,OUT().ad*E.w*R(4,8)/10).toFixed(2);openModal('협찬 제안',`<p class="lede">${esc(E.n)}에서 먼저 연락이 왔다. "올해 저희 사회공헌 포럼을 ${esc(jo2(OUT().n,'과','와'))} 함께하고 싶습니다." 협찬 ${adAmt(amt)}.</p><p class="hint">관계가 좋으면 영업을 뛰지 않아도 협찬이 들어온다. 행사 기사를 쓰면 홍보성 눈총이 붙는다</p>`,[
   {label:'받는다',sub:`협찬 ${adAmt(amt)} · 광고 실적 · 평가↑ · 신뢰 조금↓`,fn:()=>{S.adQ=(S.adQ||0)+amt;S.adTotal=(S.adTotal||0)+amt;S.co.cash+=amt*.8;try{misWin('adsell');}catch(x){}netUp(E.id,4);toast(apply({eval:.8,trust:-.4}));log(`${E.n} 포럼 협찬 ${adAmt(amt)}`);}},
   {label:'편집국과는 선을 긋고 광고국에 넘긴다',sub:'협찬 절반 · 신뢰 그대로',fn:()=>{const a2=+(amt/2).toFixed(2);S.adQ=(S.adQ||0)+a2;S.adTotal=(S.adTotal||0)+a2;S.co.cash+=a2*.8;toast(apply({eval:.3}));}}]);}});

// 관계가 좋은 곳이 먼저 주는 아이템은 그곳 이야기로
function netItemFor(E,o){let first=null;for(let i=0;i<30;i++){const it=makeItem(E.c&&DEPTS[E.c]?E.c:S.dept,Object.assign({noPos:1},o||{}));if(!first)first=it;if(it.ent===E.id)return it;}first.ent=E.id;return first;}

// 타이틀 화면의 이벤트 수: 실제로 뽑히는 이벤트 풀을 모두 센다
function evCount(){let n=0;const L=n=>{try{return (typeof n==='function'?n():n)||[];}catch(e){return [];}};
  [()=>EVENTS,()=>NET_EVENTS,()=>COL_EVENTS,()=>F_EVENTS,()=>CRISES,()=>D_EV,()=>RIVAL_EV,()=>SL,()=>NR_EV,()=>A2].forEach(f=>{n+=L(f).length;});
  try{n+=Object.values(STORY_BEATS).reduce((a,x)=>a+Object.keys(x).length,0);}catch(e){}return n;}
// --- 장면 그림: 수습 라인과 부서에 맞는 그림·자막 ---
const SASU_IMG={sports:'briefing',wire:'newsroom',tv:'crime',econ:'lobby',local:'region',eng:'gov',online:'newsroom',weekly:'newsroom',edu:'region',med:'lobby',tech:'lobby',law:'court',star:'lobby'};
const SASU_CAP={sports:'구장 · 경기 뒤 인터뷰실',wire:'자정 · 야간 속보 당번',tv:'현장 수습 · 카메라 기자와',econ:'여의도 · 증권가',local:'시·군청 · 아침 순회',eng:'대사관 앞 · 외신 라인',online:'밤 10시 · 커뮤니티 모니터링',weekly:'자료실 · 기획 자료 뒤지기',edu:'학교 앞 · 학원가',med:'병원·제약사 로비',tech:'판교 · 테크노밸리',law:'서초동 · 법원 앞',star:'방송사 로비'};
function sceneSub(sc){try{if(sc!=='police')return null;const k=sasuKey();return SASU_IMG[k]?{img:SASU_IMG[k],cap:SASU_CAP[k]}:null;}catch(e){return null;}}
function sceneDept(){const dn=(DEPTS[S.dept]||{}).n||'';return /연예/.test(dn)?'ent':/체육|야구|축구/.test(dn)?'spo':/문화/.test(dn)?'cul':'';}
// ===== 단독·특종 희소성: 자주 뜨면 쾌감이 없다 =====
function exRecent(w){return (S.clips||[]).filter(c=>c.excl&&!c.staff&&S.turn-(c.turn||0)<=w&&String(c.by||'').includes(S.name)).length;}
// 출고할 때 같은 날 타사도 썼을 수 있다 — 단독을 자주 낼수록, 오래 묵힐수록 타사가 따라붙는다
function exclShare(it,W,notes){if(!it.excl||it.story||S.founder&&S.rank<7)return;const n=exRecent(12);let p=.14+.09*n+((it.heat||3)<=2?.18:0)+(it.emb?-.1:0);if(S.simple)p*=.8;p=clamp(p,.05,.55);
  if(!chance(p))return;it.excl=false;it.exShared=1;W.headline=String(W.headline||'').replace(/^\[단독\]\s*/,'');const rv=(S.comp||[])[0];const rn=rv?cName(rv):'경쟁사';notes.push(`같은 날 ${rn}도 같은 내용을 냈다. 단독 타이틀은 달지 못했다.${n>=2?' 요즘 우리 단독이 잦아 타사가 바짝 붙어 있다.':''}`);}
function scoopGrade(it,imp,q,ver){if(!it.excl)return '';const keyOK=it.facts.filter(f=>f.key).every(fOK);const nF=it.facts.length;let g='단독';
  if(imp>=80&&q>=70&&ver>=Math.max(4,nF-1)&&keyOK&&!it.pos)g='대특종';else if(imp>=62&&q>=60&&ver>=3&&keyOK)g='특종';
  const L=S.tkLast||{};if(g==='대특종'&&S.turn-(L.big??-999)<YW)g='특종';if(g==='특종'&&S.turn-(L.tok??-999)<12&&imp<72)g='단독';return g;}
function gradeBonus(g){if(g!=='특종'&&g!=='대특종')return '';S.tkLast=S.tkLast||{};S.tkLast.tok=S.turn;if(g==='대특종')S.tkLast.big=S.turn;const t=apply(g==='대특종'?{fame:2.5,eval:1.5,trust:.6}:{fame:1,eval:.6});return `<b>${g} 보너스</b> · ${t}`;}
// ===== 1.21 이달의 미션 개편: 단독 몰이 대신 고르게 — 감시 보도·호재·관계·분위기·제자 =====
Object.assign(MIS_DEF,{
 watch:{h:'{invest}로 사실을 80% 넘게 확인하고 반론까지 받아 비판 기사 쓰기',v:x=>(S.watchN||0)-x.b},
 posw:{h:'호재 아이템(성과·기록·미담)으로 기사 쓰기 · 상대와 관계↑',v:()=>mClips().filter(c=>c.pos).length},
 bal:{h:'호재 기사와 비판 기사를 한 건씩 — 균형 잡힌 지면',v:()=>{const L=mClips();return Math.min(L.filter(c=>c.pos).length,L.filter(c=>c.crit).length);}},
 entup:{h:'{network}·호재 기사·광고 미팅 — 한 곳을 꾸준히',v:x=>{let m=0;const tb=x.tb||{};for(const id in tb){const e=S.net&&S.net[id];if(e)m=Math.max(m,e.rel-tb[id]);}return Math.floor(m);}},
 moodUp:{h:'부서 사람들과·월급 쓰기 › 생활과 사람의 부서 회식·간식',v:x=>Math.floor(deptStat().mood-x.b)},
 pgUp:{h:'제자에게 요령 가르치기·아이템 넘기기·데스킹',v:x=>{const m=deptPeople().find(y=>y.name===S.protege);return m?Math.floor((m.skill-x.b)*10)/10:0;}},
 fmood:{h:'구성원과 시간 보내기·처우',v:x=>Math.round((S.wMood??60)-x.b)}});
Object.assign(MIS_TAG,{watch:['invest','write'],posw:['write','discover','adsell'],bal:['write'],entup:['network','adsell','write'],moodUp:['deptlife','colleague','life'],pgUp:['deptlife','handoff','desk'],fmood:['deptlife','colleague','paypol','wage']});
function misExtra(r,sim,can,hasIt,P,add){const known=S.net?Object.keys(S.net).filter(id=>S.net[id].known&&ENT[id]&&ENT[id].kind!=='person'):[];const tb={};known.forEach(id=>tb[id]=S.net[id].rel);
  if(S.founder){if(known.length)P(1.2,()=>add('entup',5,'광고주·기관 한 곳과 관계 +5',{x:{tb},h:'호재 기사·광고 영업·대외 관계'}));P(1,()=>add('fmood',3,'구성원 사기 +3',{b:S.wMood??60}));return;}
  if(r===0)return;
  const wr=can('write'),its=S.items||[];
  if(r<=3){if(wr&&its.some(i=>!i.pos&&CRIT_RE.test(i.title||'')))P(sim?.9:1.5,()=>add('watch',1,'감시 보도 1건 — 확인 탄탄한 비판 기사',{b:S.watchN||0}));
    if(wr&&its.some(i=>i.pos))P(1.2,()=>add('posw',1,'호재 기사 1건 출고'));
    if(wr&&!sim&&its.some(i=>i.pos)&&its.some(i=>!i.pos))P(.6,()=>add('bal',1,'호재 기사·비판 기사 한 건씩'));
    if(known.length)P(1,()=>add('entup',sim?4:6,`기관·광고주 한 곳과 관계 +${sim?4:6}`,{x:{tb}}));
    if(deptPeople().length>=2&&deptStat().mood<70)P(.9,()=>add('moodUp',sim?1:2,`부서 분위기 챙기기 ${sim?1:2}번`,{b:S.moodAct||0,x:{m2:1}}));
    if(r>=2&&S.protege){const m=deptPeople().find(y=>y.name===S.protege);if(m)P(1,()=>add('pgUp',1,`제자 ${m.name} 실력 +1`,{b:m.skill}));}}
  else{if(known.length)P(1,()=>add('entup',5,'기관·광고주 한 곳과 관계 +5',{x:{tb}}));if(r<=6&&deptPeople().length>=2&&deptStat().mood<70)P(.8,()=>add('moodUp',1,'부서 분위기 챙기기 1번',{b:S.moodAct||0,x:{m2:1}}));}}
// 회사 특성의 실제 효과를 숫자로 보여 준다
const OTR_KN={fame:'평판',heat:'타사 추격 속도',eval:'사내 평가',legal:'오보·소송 위험',hp:'컨디션 소모',rel:'관계 쌓이는 속도',pick:'승진 심사 통과',pay:'월급',trust:'신뢰',item:'아이템 들어오는 양',grow:'능력치 성장',ten:'승진 필요 연차',subs:'구독',cash:'영업 수입',q:'보도 품질'};
function otrFxTxt(fx){return Object.keys(fx||{}).map(k=>{if(k==='ap')return `매달 행동력 +${fx.ap}`;const n=OTR_KN[k];if(!n)return '';const v=Math.round((fx[k]-1)*100);return v?`${n} ${v>0?'+':''}${v}%`:'';}).filter(Boolean).join(' · ');}
function otrLine(o){return traitsOf(o).map(t=>{const d=otrDef(t);return d?`<b>${esc(d.n)}</b> ${esc(otrFxTxt(d.fx))}`:'';}).filter(Boolean).join(' / ');}
// ===== 1.22 종합 실력 · 연간 결산 · 자산 =====
function mySkill(){const t=S.st||{};return Math.round(((t.inv||0)+(t.wri||0)+(t.ver||0)+(t.net||0))/4);}
function skillCmpHTML(){try{if(S.founder)return '';const me=mySkill();const P=deptPeople();const avg=P.length?Math.round(P.reduce((a,m)=>a+(m.skill||30),0)/P.length):null;const b=colBy('boss');let bs='';
  if(b&&b.st&&S.rank<=5){const v=((b.st.inv||0)+(b.st.wri||0)+(b.st.ver||0)+(b.st.net||0))/4;bs=` · ${esc(colRole(b))} ${esc(b.name)} 추정 ${estRange(v,b.rel||0,b.seed||1,'sk')}`;}
  return `<p class="hint" style="margin:2px 0 6px">종합 실력은 취재력·문장력·검증력·인맥의 평균이다. 동료 기자의 "실력"과 같은 잣대${avg!=null?` · 부서 평균 ${avg}`:''}${bs}</p>`;}catch(e){return '';}}
function netWorth(){return Math.round((S.money||0)+(S.savings||0)+(S.fixed?S.fixed.amt:0)+(S.cheong||0)+(S.pension||0)+(S.etf||0)+(S.stock||0)+(S.coin||0)+(S.lease||0));}
function yrSnap(){return{v:2,turn:S.turn,arts:S.totalArticles||0,ex:S.scoops||0,fr:S.frontN||0,fame:S.fame,eval:S.eval,money:S.money,nw:netWorth(),rank:S.rank,rv:(S.rival&&S.rival.wins)||0,ml:Object.keys(S.miles||{}).length,src:(S.sources||[]).length,aw:S.awards||0,tok:S.tokjong||0};}
function yearRecap(){const a=S.yr0;const b=yrSnap();S.yr0=b;if(!a||S.story)return;const d=k=>(b[k]||0)-(a[k]||0);const yr=2027+Math.floor((S.turn-1)/YW);
  const mineY=(S.clips||[]).filter(c=>c.turn>=a.turn&&String(c.by||'').includes(S.name)&&!c.staff);
  const ex=a.v===2?d('ex'):mineY.filter(c=>c.excl).length,fr=a.v===2?d('fr'):mineY.filter(c=>/1면|첫 꼭지/.test(c.place||'')).length;const nw0=a.nw!=null?a.nw:a.money;
  const prevEx=S.yrPrevEx;S.yrPrevEx=ex;const best=mineY.slice().sort((x,y)=>(y.imp||0)-(x.imp||0))[0];
  const sg=v=>(v>0?'+':'')+Math.round(v);const cmp=(v,p)=>p==null?'':`<small style="display:block;color:var(--mute);font-weight:400">전년 ${p}건 · ${sg(v-p)}</small>`;
  const row=(n,v,sub)=>`<div><span>${n}</span><b>${v}</b>${sub||''}</div>`;const now=(v,dv)=>`${Math.round(v)}<small style="display:block;color:var(--mute);font-weight:400">올해 ${sg(dv)}</small>`;
  const tk=d('tok');
  openModal(`${yr}년 결산`,`<p class="lede">${esc(S.name)} ${rankName()}의 ${yr}년.</p><div class="kv">${row('출고',`${Math.max(0,d('arts'))}건`)}${row('단독',`${Math.max(0,ex)}건`,cmp(Math.max(0,ex),prevEx))}${row('1면',`${Math.max(0,fr)}번`)}${tk>0?row('특종·대특종',`${tk}건`):''}${row('새 취재원',`${Math.max(0,d('src'))}명`)}${row(evalName(),now(S.eval,d('eval')))}${row('평판',now(S.fame,d('fame')))}${row('자산',`${netWorth().toLocaleString('ko-KR')}만<small style="display:block;color:var(--mute);font-weight:400">올해 ${sg(netWorth()-nw0)}만</small>`)}${row('이정표',`${Math.max(0,d('ml'))}개`)}</div><p class="hint" style="margin-top:6px">자산 = ${esc(assetsLine()||'통장 0만')}${S.lease?` · 전세 보증금 ${Math.round(S.lease).toLocaleString('ko-KR')}만`:''}${S.coin?` · 코인 ${Math.round(S.coin).toLocaleString('ko-KR')}만`:''}</p>${best?`<p class="hint" style="margin-top:10px">올해의 기사</p>${clipHTML(best,1)}`:''}${S.rival&&S.rival.name?`<p class="hint">라이벌 ${esc(S.rival.name)}에게 물먹은 횟수 올해 ${Math.max(0,d('rv'))}번</p>`:''}${b.rank>a.rank?`<p class="fx">올해 ${ro2(rankName())} 승진했다.</p>`:''}`,[{label:'새해를 시작한다'}]);}
// ===== 1.22 단독 추격 시한: 행동이 아니라 월말 결산 기준 =====
function heatMonthPre(){(S.items||[]).forEach(i=>{if(i.excl)i._m0=Math.ceil(Math.max(0,i.heat)/4);});}
function heatMonthPost(){const fast=[];(S.items||[]).forEach(i=>{if(i.excl&&(i._m0||0)>=2){const lo=Math.max(1,i._m0-2);if(Math.ceil(i.heat/4)<lo)i.heat=(lo-1)*4+1;if(Math.ceil(i.heat/4)<i._m0-1)fast.push(i);}delete i._m0;});
  fast.forEach(i=>{log(`타사 추격이 빨라졌다: 「${i.title}」 — 이제 ${heatTxt(i.heat)}`);(window.__wq=window.__wq||[]).push(()=>openModal('추격이 빨라졌다',`<p class="lede">타사가 「${esc(i.title)}」 쪽 취재원을 만나고 다닌다. 시한이 한 달 당겨졌다 — 이제 <b>${heatTxt(i.heat)}</b>.</p>`));});}
// ===== 1.23 AI 개선: 한 달 맡기기 · 경쟁사 · 라이벌 · 부서원 =====
function aiMisK(){try{return ((S.mis&&S.mis.list)||[]).filter(x=>!x.done).map(x=>x.k);}catch(e){return [];}}
function aiPosRun(){return (S.posT||[]).filter(t=>t>S.turn-12).length;}
function aiItemScore(it,act,dir){const F=it.facts||[],n=Math.max(1,F.length),ok=F.filter(fOK).length,key=F.find(f=>f.key),kOK=!key||fOK(key),mk=aiMisK(),cov=ok/n;let v=(it.imp||30)/20;
  if(it.slot){const d=it.slot.due-S.turn;v+=d<=0?9:d<=4?4:1;}
  if(it.excl){const m=Math.ceil(Math.max(0,it.heat)/4);v+=m<=1?6:m===2?2.5:1;}
  const pos=!!it.pos,crit=!pos&&artTone(it)==='crit';
  if(act==='write'){v+=cov*4+(kOK?2:-4)+(it.rebut?1:-.5);if(dir==='safe'&&(!kOK||cov<.75))v-=5;if(dir==='scoop'&&it.excl&&kOK)v+=2;
    if(pos){const run=aiPosRun();v+=(dir==='money'?2:-.5)-run*1.5;const e=it.ent&&S.net&&S.net[it.ent];if(e&&e.cut>0)v+=3;if(mk.includes('posw'))v+=3;if(mk.includes('bal'))v+=1;}
    else if(crit){if(cov>=.8)v+=2;if(mk.includes('watch')&&cov>=.8)v+=3;if(mk.includes('bal'))v+=1;}}
  else{const un=n-ok;if(!un)v-=8;else v+=Math.min(un,4)*.6+(kOK?0:2.5);if(pos&&dir!=='money')v-=1;if(it.excl&&dir==='scoop')v+=2;if(crit&&mk.includes('watch'))v+=1.5;}
  return v;}
function aiBest(L,act){if(!S||!S._auto||!L||L.length<2)return null;const dir=S.autoDir||'safe';let b=null,bv=-1e9;L.forEach(i=>{let v=-1e9;try{v=aiItemScore(i,act,dir);}catch(e){}if(v>bv){bv=v;b=i;}});return b;}
// 맡긴 달에도 부서 분위기를 챙긴다: 얼어붙었으면 회식, 처지면 간식
function aiAutoCare(done){try{if(S.founder||S.story||S.rank>6||S.rank<1)return;if(deptPeople().length<2)return;const md=deptStat().mood,mis=aiMisK().includes('moodUp');if(md>=55&&!mis)return;
  if((md<38||mis)&&S.dinM!==mKey()&&S.money>=dinCost()+300){S.money-=dinCost();S.dinM=mKey();deptPeople().forEach(m=>{mRel(m,R(5,8),'부서 회식');skBump(m,1);});['junior','peer'].forEach(r=>relUp(colBy(r),8,'회식'));gain('cha',.6);done.push('부서 회식');log('부서 사람들과 고기를 구웠다');return;}
  if(S.snkM!==mKey()&&S.money>=150){S.money-=20;S.snkM=mKey();deptPeople().forEach(m=>mRel(m,3,'간식'));done.push('간식 돌리기');log('부서에 간식 상자를 돌렸다');}}catch(e){console.error(e);}}
// 라이벌이 내 단독을 가로채는 건 확인이 덜 된 아이템뿐이다. 거의 다 확인한 단독은 추격만 당한다
function aiStealable(i){const F=i.facts||[];return F.filter(fOK).length/Math.max(1,F.length)<.6;}
function aiChase(L,who,lines){const it=L.find(i=>i.excl&&!aiStealable(i));if(!it)return false;it.heat=Math.max(1,it.heat-3);lines.push({c:'r',t:`${who} 「${it.title}」 쪽 취재원을 만나고 다닌다 — 확인을 거의 끝낸 단독이라 가로채진 못했지만 추격이 붙었다`});return true;}
// 라이벌·부서원이 1.21~1.22 시스템(호재 기사·감시 보도·제자·영업)에 반응한다
function aiMonth(lines){if(!S||S.story||S.rank<1)return;
  const rv=S.rival,ro=rv&&OUTLETS.find(o=>o.id===rv.outlet);
  if(rv&&ro&&!rv.pub&&!S.founder&&S.turn-(S.aiRvT??-99)>=12){const run=aiPosRun(),w=S.watchN||0,w0=S._aiW0??w;S._aiW0=w;
    if(run>=3&&chance(.4)){S.aiRvT=S.turn;apply({fame:-.3});lines.push({c:'r',t:`라이벌 ${jo2(rv.name,'이','가')} 술자리에서 내 기사를 "보도자료 받아쓰기"라고 했다는 말이 돈다 (평판 -0.3)`});}
    else if(w>w0&&chance(.35)){S.aiRvT=S.turn;apply({fame:.3});rv.wins=Math.max(0,(rv.wins||0)-1);lines.push({c:'g',t:`라이벌 ${rv.name}(${ro.n})도 내 감시 보도를 받아 썼다. 업계에선 이번 건은 내가 한발 빨랐다고 본다 (평판 +0.3)`});}}
  if(S.founder||S.rank>6||S.turn-(S.aiTmT??-99)<8)return;const L=deptPeople().filter(m=>m&&m.name&&m.name!==S.name);if(!L.length)return;
  const sty=m=>{try{return npcAI(m).y;}catch(e){return '';}};
  const sales=L.filter(m=>['sales','net'].includes(sty(m))),fact=L.filter(m=>sty(m)==='fact'&&(m.rel||0)>=25),scp=L.filter(m=>sty(m)==='scoop'&&(m.rel||0)>=40);
  if(sales.length&&chance(.1)){const cats=catOf(S.dept);const E=ENTS.filter(e=>(e[2]==='corp'||e[2]==='gov')&&e[4]>0&&cats.includes(e[3])&&S.net&&S.net[e[0]]);if(E.length){const m=pick(sales),e=pick(E);S.aiTmT=S.turn;netUp(e[0],R(2,4));S.co.adB=(S.co.adB||0)+.003;lines.push({c:'g',t:`${m.name} 기자가 ${e[1]} 호재 기사를 받아 썼다. ${e[1]} 쪽 분위기가 조금 풀렸다`});return;}}
  if(fact.length&&chance(.08)){const it=(S.items||[]).find(i=>i.facts.some(f=>!fOK(f)&&!f.key));if(it){const m=pick(fact),f=it.facts.find(x=>!fOK(x)&&!x.key);S.aiTmT=S.turn;fFill(f,`${m.name} 기자 교차 확인`);mRel(m,2,'교차 확인');lines.push({c:'g',t:`검증형 ${m.name} 기자가 「${it.title}」 사실 하나를 대신 확인해 줬다`});return;}}
  if(scp.length&&(S.items||[]).length<5&&chance(.04)){const m=pick(scp);S.aiTmT=S.turn;const it=makeItem(S.dept,{excl:true,noPos:1});it.src=`${m.name} 기자 귀띔`;S.items.push(it);mRel(m,2,'단서 공유');lines.push({c:'g',t:`특종형 ${m.name} 기자가 자기는 못 쫓겠다며 단서를 넘겼다 → 「${it.title}」`});}
  if(S.protege){const m=L.find(y=>y.name===S.protege);if(m&&(m.rel||0)>=50&&(S.items||[]).length<5&&chance(.05)&&S.turn-(S.aiPgT??-99)>=YW/2){S.aiPgT=S.turn;const it=makeItem(S.dept,{noPos:1});it.src=`제자 ${m.name} 제보`;S.items.push(it);lines.push({c:'g',t:`제자 ${jo2(m.name,'이','가')} 출입처에서 주운 얘기를 먼저 들고 왔다 → 「${it.title}」`});}}}
// ===== 1.23 능력치 개편: 영업력·리더십 신설, 인터뷰·제목 감각에 실제 쓰임 =====
Object.assign(STAT_FX,{
 int:['입을 열게 하는 기술','인터뷰와 사람을 붙잡는 취재에서 쓰인다',['인터뷰에서 결정적 한마디를 끌어낼 확률↑','주변 탐문·국회 복도 뻗치기·현직자 단체방 확인 성공률↑','녹취·인용이 들어간 기사 완성도가 더 오른다'],'인터뷰 · 탐문'],
 hed:['제목과 편집 감각','읽히느냐 묻히느냐가 갈린다',['제목 효과와 조회수를 키운다','기사 완성도에 더해진다','데스킹에서 후배 초고의 결함을 더 잘 잡는다'],'기사 쓰기 · 데스킹'],
 sal:['계약을 따내는 힘','광고주와 협찬처를 설득한다',['광고·협찬 영업 성공률↑','따낸 계약 금액이 커진다','사장 광고주 영업 효과↑'],'광고·협찬 영업'],
 lead:['사람을 이끄는 힘','차장부터 본격적으로 쓰인다',['부서원과 관계가 오를 때 더 많이 오른다 (차장 이상)','부서원·제자 실력이 더 빨리 큰다 (차장 이상)','타사의 우리 기자 빼 가기를 막는다','채용 때 지원자를 보는 눈↑'],'데스킹 · 기획회의 · 부서 회식 · 동료 챙기기']});
function leadK(){return S&&S.st&&!S.founder&&S.rank>=2?(.9+(S.st.lead||0)/200):1;}
const ST_HOOK={adsell:['sal',.35],adsales:['sal',.4],fsales:['sal',.3],event:['sal',.2],desk:['lead',.3],plan:['lead',.35],meeting:['lead',.25],taskforce:['lead',.35],personnel:['lead',.3],colleague:['lead',.2],deptlife:['lead',.25],hire:['lead',.2],recruit:['sal',.15]};
function statHook(id){if(!S||S.founder||!id||S._stH===S.turn+':'+id)return;const h=ST_HOOK[id];if(!h)return;if(h[1]==='lead'&&S.rank<1)return;S._stH=S.turn+':'+id;gain(h[0],h[1]);}