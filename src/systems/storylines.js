/* 바이라인 — src/systems/storylines.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */

// ===== 5.7 스토리라인 30편: 평소 플레이 중에 시작돼 몇 달에 걸쳐 이어지는 이야기. 끝까지 가면 칭호가 남는다 =====
const SLG={item:o=>{const it=makeItem(S.dept,Object.assign({excl:true,pre:1},o||{}));S.items.push(it);return `→ 「${it.title}」`;},rel:(r,v)=>{const c=colBy(r);if(c)relUp(c,v,'이야기');},money:v=>{S.money+=v;},co:(k,v)=>{if(S.co)S.co[k]=(S.co[k]||0)+v;}};
const slRk=(a,b)=>!S.founder&&S.rank>=a&&S.rank<=b,slCat=(...c)=>catOf(S.dept).some(x=>c.includes(x));
const SL=[
 {id:'whistle',n:'제보자를 지켜라',b:'제보자의 방패',c:()=>slRk(1,3),st:[
  {t:'익명의 전화. "회사 내부 자료가 있어요. 대신 제 이름은 절대…" 떨리는 목소리였다.',o:[{l:'신원 보호를 약속하고 만난다',fx:{trust:1},go:1},{l:'자료만 받고 바로 쓴다',fx:{fame:1,trust:-2},end:'제보자는 다시 연락하지 않았다.'}]},
  {t:'회사 측이 "기사 출처를 밝히라"며 편집국에 압박을 넣었다. 제보자가 불안해한다.',o:[{l:'끝까지 출처를 숨긴다',fx:{trust:2,eval:-.5},go:1},{l:'데스크에만 귀띔한다',fx:{eval:.5},go:1,fn:()=>SLG.rel('boss',3)}]},
  {t:'보도가 나갔다. 제보자가 문자를 보냈다. "덕분에 바뀌었어요. 고맙습니다."',o:[{l:'후속 보도를 준비한다',fx:{fame:2},fn:()=>SLG.item({mult:1.2})},{l:'조용히 답장만 한다',fx:{men:2,trust:1}}]}],rw:{trust:3,fame:2}},
 {id:'mentor',n:'선배의 마지막 기사',b:'바통을 받은 기자',c:()=>slRk(1,3)&&years()>=2,st:[
  {t:'정년을 석 달 앞둔 선배가 낡은 취재 수첩을 내밀었다. "끝내지 못한 기획이야. 네가 마무리해 줄래?"',o:[{l:'받는다',fx:{kno:.5},go:1},{l:'"제가 감당할 수 있을까요"',fx:{men:-1},go:1}]},
  {t:'수첩 속 이름들을 하나씩 찾아갔다. 20년 전 증언과 지금 증언이 맞아떨어진다.',o:[{l:'선배 이름을 공동 바이라인에 넣자고 한다',fx:{eval:.5},go:1,fn:()=>SLG.rel('senior',6)},{l:'내 이름으로 낸다',fx:{fame:1},go:1}]},
  {t:'송별회 날, 선배가 1면에 실린 기사를 액자에 넣어 왔다. "이제 네 거다."',o:[{l:'술잔을 채운다',fx:{men:2}}]}],rw:{fame:3,eval:1},it:1},
 {id:'rivalteam',n:'라이벌과 한 팀',b:'적과의 동맹',c:()=>slRk(1,4)&&S.rival,st:[
  {t:()=>`라이벌 ${jo2(S.rival.name,'이','가')} 먼저 연락해 왔다. "이건 혼자 못 파. 같이 하자."`,o:[{l:'공동 취재에 응한다',fx:{net:.5},go:1},{l:'"내가 먼저 쓴다"',fx:{fame:1},end:'경쟁은 계속된다.'}]},
  {t:'함께 밤을 새웠다. 서로의 취재원을 처음으로 소개했다.',o:[{l:'내 핵심 취재원도 보여 준다',fx:{trust:1,net:.6},go:1},{l:'핵심은 숨긴다',fx:{inv:.4},go:1}]},
  {t:'두 매체가 같은 날 아침 동시에 보도했다. 업계에서 "드문 협업"이라는 말이 돌았다.',o:[{l:'다음엔 다시 경쟁이다',fx:{fame:2}}]}],rw:{fame:3,net:1}},
 {id:'headline',n:'제목 한 줄의 무게',b:'고개 숙일 줄 아는 기자',c:()=>slRk(1,3)&&(S.totalArticles||0)>=10,st:[
  {t:'내 기사 제목이 피해자를 조롱하는 것처럼 읽힌다며 항의가 쏟아졌다.',o:[{l:'즉시 제목을 고치고 사과문을 쓴다',fx:{trust:1,eval:-.5},go:1},{l:'"의도는 아니었다"며 버틴다',fx:{trust:-2},go:1}]},
  {t:'피해자 가족이 편집국을 찾아왔다.',o:[{l:'직접 만나 사과한다',fx:{men:-1,trust:2},go:1},{l:'데스크에 맡긴다',fx:{},go:1,fn:()=>SLG.rel('boss',-2)}]},
  {t:'한 달 뒤 손편지가 왔다. "그날 사과해 줘서 고마웠습니다."',o:[{l:'책상 앞에 붙여 둔다',fx:{men:2,wri:.4}}]}],rw:{trust:3}},
 {id:'fire',n:'새벽 3시의 화재',b:'현장의 기자',c:()=>slRk(1,3)&&slCat('soc','loc'),st:[
  {t:'새벽 3시, 휴대전화가 울렸다. 대형 물류창고 화재. 사망자가 나올 것 같다.',o:[{l:'택시를 잡는다',fx:{hp:-8},go:1},{l:'전화로만 확인한다',fx:{},end:'타사가 현장 사진으로 1면을 덮었다.'}]},
  {t:'현장에서 비상구가 잠겨 있었다는 증언을 들었다.',o:[{l:'잠긴 비상구를 끝까지 추적한다',fx:{inv:.6},go:1,fn:()=>SLG.item({mult:1.2})},{l:'속보 위주로 쓴다',fx:{spd:.5},go:1}]},
  {t:'비상구 관리 기준이 바뀌었다. 유족 대표가 고맙다며 고개를 숙였다.',o:[{l:'유족 인터뷰를 정리한다',fx:{wri:.4}}]}],rw:{fame:3,eval:1}},
 {id:'retrial',n:'무죄의 기록',b:'진실을 다시 쓴 기자',c:()=>slRk(1,4)&&slCat('soc','court','case','inv'),st:[
  {t:'20년 전 살인 사건으로 복역한 남자가 편지를 보냈다. "저는 하지 않았습니다."',o:[{l:'사건 기록을 다시 연다',fx:{kno:.5},go:1},{l:'흔한 편지라 넘긴다',fx:{},end:'편지는 서랍 속에 남았다.'}]},
  {t:'당시 수사 기록에서 앞뒤가 맞지 않는 진술을 찾았다.',o:[{l:'당시 형사를 찾아간다',fx:{inv:.5,hp:-4},go:1},{l:'법의학 전문가에게 감정을 맡긴다',fx:{ver:.5,money:-30},go:1}]},
  {t:'재심이 열렸다. 법정에서 무죄가 선고되는 순간, 그가 내 쪽을 돌아봤다.',o:[{l:'기사를 쓴다',fx:{fame:3}}]}],rw:{fame:4,trust:2}},
 {id:'excel',n:'엑셀 속의 비리',b:'숫자를 읽는 기자',c:()=>slRk(1,4)&&(S.st.dat||0)>=20,st:[
  {t:'공공데이터 포털에서 받은 계약 내역. 같은 업체가 3년간 수의계약 87건을 따냈다.',o:[{l:'밤새 데이터를 정리한다',fx:{dat:.6,hp:-5},go:1},{l:'일단 쓰고 본다',fx:{},end:'근거가 약해 데스크에서 킬됐다.'}]},
  {t:'업체 대표가 구청장의 사촌이라는 등기부를 찾았다.',o:[{l:'정보공개청구를 추가로 넣는다',fx:{ver:.5},go:1},{l:'구청에 바로 묻는다',fx:{},go:1}]},
  {t:'3회 시리즈가 나가고 감사원 감사가 시작됐다.',o:[{l:'데이터를 독자에게 공개한다',fx:{trust:2}}]}],rw:{fame:3,dat:1},it:1},
 {id:'landfill',n:'작은 마을의 큰 싸움',b:'지역의 목소리',c:()=>slRk(1,4)&&(slCat('loc')||['local'].includes(OUT().type)),st:[
  {t:'인구 800명 마을에 대형 매립장이 들어선다. 할머니들이 군청 앞에 돗자리를 깔았다.',o:[{l:'마을에 사흘 머문다',fx:{hp:-6},go:1},{l:'보도자료로 정리한다',fx:{},end:'기사는 단신으로 묻혔다.'}]},
  {t:'환경영향평가서 일부가 다른 지역 것을 베낀 흔적이 보인다.',o:[{l:'원본과 대조한다',fx:{ver:.6},go:1,fn:()=>SLG.item({})},{l:'주민 목소리 위주로 간다',fx:{wri:.4},go:1}]},
  {t:'계획이 백지화됐다. 마을 회관에서 할머니가 삶은 감자를 내밀었다.',o:[{l:'감사히 먹는다',fx:{men:3}}]}],rw:{fame:2,trust:2}},
 {id:'matchfix',n:'승부조작의 그림자',b:'그라운드의 감시자',c:()=>slRk(1,4)&&slCat('spo'),st:[
  {t:'2군 선수가 술자리에서 흘렸다. "요즘 이상한 돈이 돈다."',o:[{l:'조용히 파 본다',fx:{inv:.4},go:1},{l:'구단에 바로 묻는다',fx:{},end:'선수는 입을 닫았다.'}]},
  {t:'불법 도박 사이트 배당 흐름이 특정 경기와 겹친다.',o:[{l:'경기 영상을 한 프레임씩 본다',fx:{dat:.5,hp:-5},go:1},{l:'브로커를 만난다',fx:{trust:-1,inv:.6},go:1}]},
  {t:'리그 사무국이 조사에 착수했다. 팬 커뮤니티에 내 기사가 고정 글로 걸렸다.',o:[{l:'후속을 준비한다',fx:{fame:2},fn:()=>SLG.item({})}]}],rw:{fame:3}},
 {id:'ponzi',n:'사라진 투자금',b:'돈의 흐름을 쫓는 기자',c:()=>slRk(1,4)&&slCat('eco','fin','ind','stock'),st:[
  {t:'"월 5% 확정 수익" 광고를 낸 업체에 투자자 수천 명이 몰렸다. 피해자 카페가 생겼다.',o:[{l:'피해자들을 만난다',fx:{net:.4},go:1},{l:'금융당국 입장만 받는다',fx:{},end:'다음 달, 업체 대표가 잠적했다.'}]},
  {t:'신규 투자금으로 기존 투자자 이자를 막는 구조, 전형적인 폰지다.',o:[{l:'자금 흐름도를 그린다',fx:{dat:.6},go:1},{l:'대표를 직접 찾아간다',fx:{hp:-5,inv:.5},go:1}]},
  {t:'보도 다음 날 경찰이 압수수색에 들어갔다. 피해 확산이 멈췄다.',o:[{l:'피해 회복 방안까지 쓴다',fx:{trust:2}}]}],rw:{fame:3,eval:1}},
 {id:'aide',n:'보좌관의 수첩',b:'여의도의 기록자',c:()=>slRk(1,4)&&slCat('pol'),st:[
  {t:'해고된 보좌관이 수첩 한 권을 보여 줬다. 후원금 명단이 빼곡하다.',o:[{l:'수첩을 받는다',fx:{},go:1},{l:'의도를 의심하고 거절한다',fx:{ver:.3},end:'수첩은 다른 매체로 갔다.'}]},
  {t:'명단 속 기업들이 같은 날 같은 금액을 쪼개 넣었다.',o:[{l:'기업들에 하나씩 확인한다',fx:{ver:.6,hp:-4},go:1},{l:'의원실 반론부터 받는다',fx:{trust:1},go:1}]},
  {t:'선관위가 고발했다. 국회 기자실에서 타사 기자들이 내 자리로 몰려왔다.',o:[{l:'담담하게 커피를 마신다',fx:{fame:2}}]}],rw:{fame:3,net:1},it:1},
 {id:'trainee',n:'연습생의 계약서',b:'무대 뒤를 비춘 기자',c:()=>slRk(1,4)&&slCat('ent','cul'),st:[
  {t:'데뷔를 앞둔 연습생 부모가 계약서 사진을 보냈다. 위약금이 20억이다.',o:[{l:'변호사 자문을 받는다',fx:{kno:.5,money:-20},go:1},{l:'기획사에 먼저 묻는다',fx:{},go:1}]},
  {t:'같은 기획사 출신들이 하나둘 입을 열었다.',o:[{l:'익명 인터뷰로 엮는다',fx:{wri:.5},go:1},{l:'실명 증언을 설득한다',fx:{trust:1,hp:-4},go:1}]},
  {t:'공정위가 표준계약서 개정을 발표했다. 그 연습생은 무사히 데뷔했다.',o:[{l:'데뷔 무대를 보러 간다',fx:{men:3}}]}],rw:{fame:3,trust:1}},
 {id:'corresp',n:'특파원의 꿈',b:'세계를 본 기자',c:()=>slRk(1,3)&&(S.st.lng||0)>=35&&!['local','trade'].includes(OUT().type),st:[
  {t:'사내 특파원 공모가 떴다. 경쟁자는 다섯 명.',o:[{l:'지원서를 낸다',fx:{lng:.5},go:1},{l:'이번엔 넘긴다',fx:{},end:'다음 공모는 3년 뒤다.'}]},
  {t:'최종 면접. "현지에서 무엇을 쓰겠습니까?"',o:[{l:'한국 기업의 현지 노동 문제',fx:{kno:.5},go:1},{l:'그 나라 사람들의 삶',fx:{wri:.5},go:1}]},
  {t:'합격 통보가 왔다. 공항에서 부모님이 손을 흔들었다. 첫 현지발 기사가 국제면 톱에 실렸다.',o:[{l:'현지 취재원을 늘려 간다',fx:{net:.6,lng:1}}]}],rw:{fame:4,lng:2}},
 {id:'award',n:'기자상 도전',b:'수상 기자',c:()=>slRk(1,5)&&(S.scoops||0)>=3,st:[
  {t:'데스크가 말했다. "그 시리즈, 기자협회 상에 내 보자."',o:[{l:'응모서를 쓴다',fx:{wri:.4},go:1},{l:'"아직 부족합니다"',fx:{},end:'다음 해를 기약했다.'}]},
  {t:'1차 심사 통과. 심사위원 질의에 답해야 한다.',o:[{l:'취재 과정을 솔직하게 쓴다',fx:{trust:1},go:1},{l:'성과를 강조한다',fx:{fame:.5},go:1}]},
  {t:'시상식. 이름이 불렸다. 무대에서 내려와 가장 먼저 제보자에게 문자를 보냈다.',o:[{l:'상패를 편집국에 둔다',fx:{eval:1}}]}],rw:{fame:5,eval:2},aw:1},
 {id:'book',n:'첫 책',b:'저자',c:()=>!S.founder&&years()>=5&&(S.totalArticles||0)>=40,st:[
  {t:'출판사에서 연락이 왔다. "그동안 쓰신 기사로 책을 내고 싶습니다."',o:[{l:'계약한다',fx:{},go:1},{l:'시간이 없다',fx:{},end:'메일함에 계약서가 남았다.'}]},
  {t:'주말마다 원고를 썼다. 기사에는 못 쓴 뒷이야기가 쏟아졌다.',o:[{l:'끝까지 쓴다',fx:{hp:-6,wri:.8},go:1},{l:'편집자 도움을 받는다',fx:{wri:.4},go:1}]},
  {t:'서점 매대에 내 이름이 박힌 책이 놓였다. 북토크에 독자 40명이 왔다.',o:[{l:'사인을 한다',fx:{men:3}}]}],rw:{fame:4,money:300}},
 {id:'junior',n:'후배의 첫 단독',b:'키우는 선배',c:()=>slRk(2,4),st:[
  {t:'막내가 머뭇거리며 말했다. "선배, 이거 기사가 될까요?" 손에 든 메모가 떨린다.',o:[{l:'같이 확인해 준다',fx:{hp:-3},go:1,fn:()=>SLG.rel('junior',6)},{l:'"혼자 해 봐"',fx:{},go:1}]},
  {t:'후배가 반론을 받다 막혔다. 상대가 소송을 운운한다.',o:[{l:'반론 받는 법을 알려 준다',fx:{eval:.5},go:1},{l:'내가 대신 통화한다',fx:{},go:1}]},
  {t:'후배의 첫 단독이 나갔다. 회식에서 후배가 잔을 들고 왔다. "선배 덕분입니다."',o:[{l:'"네가 한 거야"',fx:{men:2},fn:()=>SLG.rel('junior',8)}]}],rw:{eval:2,fame:1}},
 {id:'deptlast',n:'꼴찌 부서의 반란',b:'부서를 일으킨 부장',c:()=>!S.founder&&S.rank===3,st:[
  {t:'부서 성적표가 나왔다. 꼴찌. 국장이 지나가며 한마디 했다. "부장, 분발해."',o:[{l:'기획 회의를 소집한다',fx:{},go:1},{l:'부서원들을 하나씩 만난다',fx:{cha:.4},go:1}]},
  {t:'한 부서원이 묵혀 둔 아이템을 꺼냈다. 크다.',o:[{l:'부서 전체를 붙인다',fx:{hp:-5},go:1,fn:()=>SLG.item({mult:1.3})},{l:'그 기자에게 전권을 준다',fx:{},go:1}]},
  {t:'분기 성적표 맨 위에 우리 부서 이름이 올라갔다.',o:[{l:'부서원들에게 저녁을 산다',fx:{money:-30,men:3}}]}],rw:{eval:3,fame:2}},
 {id:'union',n:'노조의 부름',b:'동료의 대표',c:()=>slRk(1,3)&&years()>=4&&colBy('union'),st:[
  {t:'노조 위원장이 찾아왔다. "다음 집행부에 들어와 줘. 기자들이 너를 믿는다."',o:[{l:'수락한다',fx:{},go:1},{l:'취재에 집중하겠다',fx:{},end:'위원장은 아쉬워하며 돌아갔다.'}]},
  {t:'임금 협상이 결렬 직전이다. 회사는 "적자"를, 노조는 "3년 동결"을 말한다.',o:[{l:'회사 재무제표를 직접 분석한다',fx:{dat:.6},go:1},{l:'파업 찬반 투표를 준비한다',fx:{eval:-1},go:1}]},
  {t:'잠정 합의. 동료들이 "고생했다"며 어깨를 두드렸다.',o:[{l:'다시 취재 현장으로',fx:{men:2},fn:()=>SLG.rel('union',10)}]}],rw:{trust:1,men:2}},
 {id:'burnout',n:'번아웃',b:'다시 일어선 기자',c:()=>!S.founder&&S.hp<40,st:[
  {t:'아침에 눈을 떴는데 노트북을 열 수가 없었다. 손이 떨린다.',o:[{l:'휴가를 낸다',fx:{hp:15,eval:-1},go:1},{l:'커피로 버틴다',fx:{hp:-5},go:1}]},
  {t:'상담 선생님이 말했다. "기사는 내일도 있어요. 당신은 하나뿐이고요."',o:[{l:'매일 한 시간 걷는다',fx:{hp:8,men:2},go:1},{l:'취미를 하나 만든다',fx:{men:3},go:1}]},
  {t:'다시 편집국에 앉았다. 같은 자리인데 공기가 다르게 느껴진다.',o:[{l:'천천히 시작한다',fx:{hp:10}}]}],rw:{men:4,hp:10}},
 {id:'parents',n:'부모님의 스크랩북',b:'자랑스러운 자식',c:()=>!S.founder&&(S.totalArticles||0)>=20,st:[
  {t:'명절에 고향에 갔다. 아버지가 장롱에서 두꺼운 스크랩북을 꺼냈다. 내 기사가 전부 오려져 있다.',o:[{l:'한 장씩 넘겨 본다',fx:{men:3},go:1}]},
  {t:'어머니가 물었다. "이 기사 쓰고 혼나진 않았니?" 처음 쓴 단신까지 붙어 있다.',o:[{l:'취재 뒷이야기를 들려준다',fx:{men:2},go:1},{l:'"괜찮았어요"라며 웃는다',fx:{men:1},go:1}]},
  {t:'서울로 돌아오는 기차. 아버지에게 문자가 왔다. "다음 기사도 기다린다."',o:[{l:'답장을 쓴다',fx:{men:3}}]}],rw:{men:5}},
 {id:'lawsuit',n:'소송의 계절',b:'법정에서 이긴 기자',c:()=>slRk(1,5)&&(S.totalArticles||0)>=15,st:[
  {t:'법원 등기가 왔다. 내 기사에 대한 10억 원 손해배상 청구.',o:[{l:'취재 자료를 정리한다',fx:{ver:.4},go:1},{l:'회사 법무팀에만 맡긴다',fx:{},go:1}]},
  {t:'변론 기일. 상대 변호사가 녹취의 앞뒤 맥락을 문제 삼는다.',o:[{l:'원본 녹취 전체를 제출한다',fx:{trust:1},go:1},{l:'취재원을 증인으로 부른다',fx:{net:-.5},go:1,fn:()=>{}}]},
  {t:'원고 청구 기각. 판결문에 "공익을 위한 보도"라는 문장이 있었다.',o:[{l:'판결문을 출력해 둔다',fx:{eval:1}}]}],rw:{trust:3,fame:2}},
 {id:'adcall',n:'광고주의 전화',b:'편집권의 수호자',c:()=>!S.founder&&S.rank>=4&&S.rank<=6,st:[
  {t:'최대 광고주 회장실에서 직접 전화가 왔다. "그 시리즈, 내일 3탄은 안 나가는 걸로 알겠습니다."',o:[{l:'"편집국이 판단합니다"',fx:{trust:2},go:1},{l:'일단 하루 미룬다',fx:{trust:-1},go:1}]},
  {t:'사장실 호출. "광고 연간 계약이 걸렸어. 알지?"',o:[{l:'3탄을 그대로 낸다',fx:{trust:3,eval:-2},go:1,fn:()=>SLG.co('cash',-1)},{l:'표현만 다듬어 낸다',fx:{trust:1},go:1}]},
  {t:()=>`후배 기자들이 사내 게시판에 글을 올렸다. "우리 ${rankName()}님이 자랑스럽다."`,o:[{l:'게시판을 조용히 닫는다',fx:{fame:2}}]}],rw:{trust:4,fame:2}},
 {id:'digital',n:'편집국 디지털 전환',b:'변화를 이끈 간부',c:()=>!S.founder&&S.rank>=4,st:[
  {t:()=>S.rank>=7?'"종이 신문 독자가 매년 7%씩 준다." 이사회가 디지털 전환을 서두르라고 한다.':'"종이 신문 독자가 매년 7%씩 준다." 사장이 디지털 전환 TF를 맡겼다.',o:[{l:'젊은 기자들로 TF를 꾸린다',fx:{},go:1},{l:'외부 전문가를 영입한다',fx:{},go:1,fn:()=>SLG.co('cash',-.5)}]},
  {t:'고참 기자들이 반발한다. "기자가 무슨 영상을 찍어."',o:[{l:'고참들과 일대일로 만난다',fx:{cha:.5,hp:-4},go:1},{l:'성과로 보여 준다',fx:{},go:1}]},
  {t:'디지털 구독자가 처음으로 종이 구독자를 넘었다.',o:[{l:'TF를 정식 부서로 만든다',fx:{eval:1},fn:()=>{SLG.co('bT',.03);SLG.co('bS',.02);}}]}],rw:{eval:3,fame:2}},
 {id:'bigscoop',n:'대특종의 밤',b:'역사를 쓴 데스크',c:()=>!S.founder&&S.rank>=5,st:[
  {t:'밤 10시. 탐사팀이 정권 핵심의 비자금 장부를 확보했다. 판단은 내 몫이다.',o:[{l:'내일 1면으로 간다',fx:{hp:-5},go:1},{l:'한 주 더 검증한다',fx:{ver:.5},go:1}]},
  {t:'청와대·대통령실에서 전화가 빗발친다. 사장도 "신중하라"고 한다.',o:[{l:'윤전기를 돌린다',fx:{trust:2},go:1},{l:'변호사와 문장을 한 줄씩 본다',fx:{trust:1},go:1}]},
  {t:'다음 날 아침, 모든 방송이 우리 1면을 인용했다. 편집국에 박수가 터졌다.',o:[{l:'기자들을 한 명씩 안아 준다',fx:{men:3}}]}],rw:{fame:6,eval:3}},
 {id:'board',n:'이사회의 반란',b:'흔들리지 않은 사장',c:()=>!S.founder&&S.rank===7,st:[
  {t:'대주주 측 이사들이 "편집 방향을 바꾸라"며 해임안을 준비한다는 소문이 돈다.',o:[{l:'이사들을 한 명씩 만난다',fx:{net:.5},go:1},{l:'편집국과 먼저 상의한다',fx:{trust:1},go:1}]},
  {t:'이사회 당일. 표결이 3대 3으로 갈렸다.',o:[{l:'경영 성과로 설득한다',fx:{eval:1},go:1},{l:'편집권 독립을 정관에 넣자고 한다',fx:{trust:2},go:1}]},
  {t:'해임안 부결. 편집국 기자들이 사장실 앞에 꽃다발을 두고 갔다.',o:[{l:'꽃을 편집국에 돌려보낸다',fx:{fame:2}}]}],rw:{eval:4,trust:2}},
 {id:'f1000',n:'첫 유료 독자 1,000명',b:'독자가 키운 매체',c:()=>S.founder,st:[
  {t:'유료 후원자 999명. 한 명만 더 오면 1,000명이다. 편집국이 새로고침만 누른다.',o:[{l:'후원 독자 감사 편지를 쓴다',fx:{trust:1},go:1},{l:'구독 캠페인을 연다',fx:{},go:1,fn:()=>SLG.co('bS',.01)}]},
  {t:'1,000번째 후원자는 지방의 한 고등학교 선생님이었다. "학생들과 기사를 함께 읽어요."',o:[{l:'학교를 찾아간다',fx:{hp:-4,men:3},go:1},{l:'감사 영상을 찍는다',fx:{},go:1,fn:()=>SLG.co('bT',.01)}]},
  {t:'창간 멤버들과 작은 케이크를 잘랐다. 촛불은 1,000개 대신 1개.',o:[{l:'다음 목표는 1만 명',fx:{men:2},fn:()=>SLG.co('bS',.01)}]}],rw:{fame:3,trust:2}},
 {id:'fvc',n:'투자 제안',b:'흔들리지 않은 발행인',c:()=>S.founder&&S.turn-(S.fStart||0)>=24,st:[
  {t:'벤처캐피털이 30억 투자를 제안했다. 조건은 "클릭이 나오는 콘텐츠".',o:[{l:'협상 테이블에 앉는다',fx:{},go:1},{l:'단칼에 거절한다',fx:{trust:2},end:'투자자는 경쟁 매체로 갔다.'}]},
  {t:'계약서에 "편집 방향 협의" 조항이 숨어 있다.',o:[{l:'조항을 빼면 받는다',fx:{trust:1},go:1,fn:()=>SLG.co('cash',8)},{l:'그대로 받는다',fx:{trust:-3},go:1,fn:()=>SLG.co('cash',15)}]},
  {t:'투자금으로 기자 다섯 명을 더 뽑았다. 편집국 책상이 모자라 새 사무실로 옮겼다.',o:[{l:'새 사무실에 첫 출근',fx:{men:2},fn:()=>SLG.co('staff',3)}]}],rw:{fame:2}},
 {id:'fcrew',n:'창간 멤버의 고백',b:'함께 버틴 동료',c:()=>S.founder&&colBy('cofound'),st:[
  {t:()=>`공동창업자 ${jo2(colBy('cofound').name,'이','가')} 술자리에서 말했다. "솔직히 요즘 그만두고 싶어."`,o:[{l:'끝까지 이야기를 듣는다',fx:{men:1},go:1,fn:()=>SLG.rel('cofound',5)},{l:'"힘든 건 다 똑같아"',fx:{},go:1,fn:()=>SLG.rel('cofound',-5)}]},
  {t:'월급을 석 달째 깎아 왔다. 가족이 걱정한다고 했다.',o:[{l:'내 몫을 줄여 동료 월급을 올린다',fx:{money:-200},go:1,fn:()=>SLG.rel('cofound',10)},{l:'지분을 더 나눈다',fx:{},go:1,fn:()=>SLG.rel('cofound',8)}]},
  {t:'다음 날 아침, 동료가 평소보다 일찍 출근해 있었다. "커피 사 왔어."',o:[{l:'함께 마신다',fx:{men:3}}]}],rw:{men:3,trust:1}},
 {id:'reader',n:'독자의 편지',b:'누군가의 삶을 바꾼 기자',c:()=>(S.totalArticles||0)>=8,st:[
  {t:'편집국으로 손편지가 왔다. "기자님 기사를 보고 체불 임금을 받았습니다."',o:[{l:'편지의 주인을 찾아간다',fx:{hp:-3},go:1},{l:'답장을 쓴다',fx:{men:1},go:1}]},
  {t:'그는 같은 처지의 동료 20명을 모아 함께 진정을 냈다고 했다.',o:[{l:'후속 기사로 쓴다',fx:{},go:1,fn:()=>SLG.item({excl:false,pre:2})},{l:'조용히 응원만 한다',fx:{men:1},go:1}]},
  {t:'노동청이 사업장 전체를 근로감독했다. 편지 한 통이 여기까지 왔다.',o:[{l:'편지를 수첩에 끼워 둔다',fx:{men:3}}]}],rw:{trust:2,men:2}},
 {id:'ten',n:'10년 차의 질문',b:'흔들리지 않는 기자',c:()=>!S.founder&&years()>=10&&S.rank<=3,st:[
  {t:'대기업 홍보실에서 연봉 두 배 제안이 왔다. "기자 경력, 저희가 제일 잘 압니다."',o:[{l:'일단 만나 본다',fx:{},go:1},{l:'정중히 거절한다',fx:{trust:1},go:1}]},
  {t:'신입 시절 쓴 첫 기사를 다시 꺼내 읽었다. 서툴지만 뜨겁다.',o:[{l:'"나는 아직 기자다"',fx:{men:3},go:1},{l:'고민을 더 해 본다',fx:{},go:1}]},
  {t:'다음 날 아침, 다시 출입처로 향했다. 제보 전화가 울린다.',o:[{l:'받는다',fx:{fame:1},fn:()=>SLG.item({})}]}],rw:{men:4,trust:2}}
];
const SL_MAP=Object.fromEntries(SL.map(x=>[x.id,x]));
function slTxt(v){return typeof v==='function'?v():v;}
// 달마다: 진행 중인 이야기를 잇거나, 조건이 맞는 새 이야기를 연다 (한 번에 하나)
function slTick(){if(S.story||S.phase!=='game')return;S.sl=S.sl||{};const act=Object.keys(S.sl).find(k=>S.sl[k]&&!S.sl[k].done&&SL_MAP[k]);
  if(act){const a=S.sl[act];if(S.turn>=a.due)(window.__wq=window.__wq||[]).push(()=>slStage(act));return;}
  if(S.turn-(S.slLast??-99)<8||!chance(S.simple?.16:.24))return;const pool=SL.filter(x=>!S.sl[x.id]&&(()=>{try{return x.c();}catch(e){return false;}})());if(!pool.length)return;
  const x=pick(pool);S.sl[x.id]={st:0,due:S.turn,t:S.turn};S.slLast=S.turn;(window.__wq=window.__wq||[]).push(()=>slStage(x.id));}
function slStage(id){const x=SL_MAP[id],a=S.sl&&S.sl[id];if(!x||!a||a.done)return closeModal();const st=x.st[a.st];const n=x.st.length;
  openModal(`이야기 · ${x.n} (${a.st+1}/${n})`,`<div class="slhd">${bdImg(x.id,'',true)}<p class="hint" style="margin:0">진행 중인 이야기 · 끝까지 가면 칭호 「${esc(x.b)}」</p></div><p class="lede">${esc(slTxt(st.t))}</p>`,st.o.map(o=>({label:o.l,sub:o.end?'이야기가 여기서 끝난다':fxPreview(o.fx),fn:()=>{const t=apply(o.fx||{});let extra='';try{const r=o.fn&&o.fn();if(typeof r==='string')extra=r;}catch(e){}
    if(o.end){a.done=1;a.fail=1;log(`이야기 「${x.n}」 — ${o.end}`);toast(`${o.end}${t?' · '+t:''}`);return;}
    a.st++;a.t=S.turn;if(a.st>=n){a.done=1;a.ok=dateShort();S.slDone=(S.slDone||0)+1;try{metaMark('stories',x.id);metaMark('titles',x.b);}catch(e){}const rt=apply(x.rw||{});if(x.aw)S.awards=(S.awards||0)+1;if(x.it)extra+=' '+SLG.item({mult:1.1});log(`이야기 완결: 「${x.n}」 · 칭호 「${x.b}」`);
      openModal(`이야기 완결 · ${x.n}`,`<div class="promo"><div class="pconf" aria-hidden="true"></div><small>나의 이야기 ${S.slDone}/${SL.length}</small>${bdImg(x.id,'lg')}<div class="prk" style="font-size:26px">${esc(x.b)}</div><p class="pl">「${esc(x.n)}」${jp(esc(x.n),'을','를')} 끝까지 걸어왔다. 수첩에 칭호가 새겨졌다.</p></div>${fxLine([t,rt].filter(Boolean).join(' · '))}${extra?`<p class="fx">${esc(extra)}</p>`:''}`,[{label:'수첩에 적는다'}]);return false;}
    a.due=S.turn+4*R(1,2);toast(`이야기 「${x.n}」 · 다음 장은 한두 달 뒤${t?' · '+t:''}${extra?' '+extra:''}`);}})));}
function fxPreview(fx){if(!fx)return '';const N={trust:'신뢰',fame:'평판',eval:'평가',hp:'컨디션',men:'멘탈',money:'통장'};const L=Object.entries(fx).filter(([k,v])=>v&&N[k]).map(([k,v])=>`${N[k]}${v>0?'↑':'↓'}`);return L.join(' · ');}
function slHTML(){if(S.story)return '';const M=S.sl||{};const done=SL.filter(x=>M[x.id]&&M[x.id].ok);const act=SL.find(x=>M[x.id]&&!M[x.id].done);
  return `<div class="sec">나의 이야기 ${done.length}/${SL.length}</div>${act?`<div class="card"><div class="t">진행 중 · ${esc(act.n)} <span class="tg">${M[act.id].st+1}/${act.st.length}장</span></div><p class="hint" style="margin:4px 0 0">다음 장은 ${Math.max(0,Math.ceil((M[act.id].due-S.turn)/4))}개월 안에 · 끝까지 가면 칭호 「${esc(act.b)}」</p></div>`:''}${done.length?`<div class="chips" style="margin-top:6px">${done.map(x=>`<span class="cp" title="${esc(x.n)} · ${esc(M[x.id].ok)}">🏅 ${esc(x.b)}</span>`).join('')}</div>`:`<p class="hint">평소처럼 일하다 보면 이야기가 찾아온다. 상황(직급·부서·경력)에 맞는 이야기 ${SL.length}편이 있다.</p>`}`;}

// ===================== 6.1 위기 아크: 몇 달에 걸쳐 이어지는 위기. 초반·중반 위기와 후반 대위기, 창간 위기 =====================
// 간소화 모드: 중간 단계를 건너뛰고 손해가 작으며 해임까지는 가지 않는다
function arcK(){return S.simple?.6:1;}
function arcFx(fx){const k=arcK();const o={};for(const x in fx)o[x]=fx[x]<0?fx[x]*k:fx[x];return apply(o);}
function arcFire(reason){if(S.simple){arcFx({eval:-6});log('위기 끝 문책 — 자리는 지켰다');toast('문책을 받았지만 자리는 지켰다');return;}fired(reason);}
function arcCash(v){if(S.co)S.co.cash+=v*(v<0?arcK():1);}
function arcRev(){return (S.co&&S.co.last&&S.co.last.rev)||(OUT().p*1.5);}
function arcEnd(win,title){const a=S.arc2;if(!a)return;S.arc2=null;const BG=!!(A2.find(x=>x.id===a.id)||{}).big;S.arcCool=S.turn+(BG?144:win==null?56:64);S.arcDone=(S.arcDone||[]).concat([a.id]);if(win&&title){log(`위기 극복: ${title}`);try{metaMark('titles',title);}catch(e){}}if(A2.find(x=>x.id===a.id)?.big)S.bigCrisis=(S.bigCrisis||0)+1;}
const A2=[
 // ── 초반 ──
 {id:'steal',n:'가로채인 단독',tier:0,c:()=>!S.founder&&S.rank<=1&&S.items.some(i=>i.excl)&&!!colBy('senior'),st:[
   ()=>{const sr=colBy('senior');return {t:'가로채인 단독',d:`<p class="lede">내가 석 달 공들인 단독을 ${esc(sr.name)} 선배가 자기 이름으로 데스크에 올렸다. "네가 정리를 못 하길래 내가 다듬었어."</p>`,o:[
     {l:`${bossT()}에게 정식으로 항의한다`,s:'원칙대로 · 선배와 척진다',fn:()=>{S.arc2.f.prot=1;relUp(colBy('senior'),-12,'단독 항의');return {wait:6};}},
     {l:'공동 바이라인을 제안한다',s:'타협 · 관계를 지킨다',fn:()=>{S.arc2.f.joint=1;relUp(colBy('senior'),6,'공동 바이라인');return {wait:6};}},
     {l:'참는다',s:'이번엔 넘긴다 · 빚을 남긴다',fn:()=>{S.arc2.f.swallow=1;return {wait:6};}}]};},
   ()=>{const f=S.arc2.f,sr=colBy('senior');if(f.prot){if(chance(.55)){return {t:'단독의 주인',d:`<p class="lede">부장이 취재 메모와 통화 기록을 확인했다. 바이라인이 내 이름으로 바뀌었다. 편집국에 소문이 돌았다. "그 수습, 만만치 않네."</p>${fxLine(arcFx({fame:2,eval:1.5,men:2}))}`,end:1,ti:'만만치 않은 신입'};}return {t:'팀워크 문제',d:`<p class="lede">${esc(sr?sr.name:'선배')} 선배가 먼저 손을 썼다. 부장이 "후배가 선배 기사에 시비를 건다"며 나를 불렀다.</p>${fxLine(arcFx({eval:-1.5,men:-2}))}`,end:0};}
     if(f.joint)return {t:'공동 바이라인',d:`<p class="lede">기사는 둘의 이름으로 나갔다. 선배가 술자리에서 어깨를 쳤다. "다음엔 네 이름만 나가게 밀어 줄게."</p>${fxLine(arcFx({eval:.6,cha:.4}))}`,end:1};
     const it=makeItem(S.dept,{excl:true,keyConf:true});S.items.push(it);return {t:'갚은 빚',d:`<p class="lede">선배가 조용히 메모 한 장을 건넸다. "지난번 건, 미안했다. 이건 네 거야." → 「${esc(it.title)}」</p>`,end:1};}]},
 {id:'srcThreat',n:'위협받는 취재원',tier:0,c:()=>!S.founder&&S.rank<=2&&(S.sources||[]).length>=2,st:[
   ()=>{const s=(S.sources||[]).slice().sort((a,b)=>b.trust-a.trust)[0]||{id:0,name:'제보자',role:'내부 직원',trust:50};S.arc2.f.sid=s.id;return {t:'위협받는 취재원',d:`<p class="lede">새벽 1시, ${esc(s.name)}(${esc(s.role)})에게서 전화가 왔다. "회사가 제보자를 찾고 있어요. 차에 누가 따라붙었어요."</p>`,o:[
     {l:'기사를 미루고 취재원부터 지킨다',s:'사비 100만 원 · 기사 보류',fn:()=>{S.money-=100;S.arc2.f.guard=1;return {wait:5};}},
     {l:'기사를 바로 낸다',s:'단독은 지킨다 · 취재원은 위험',fn:()=>{S.arc2.f.rush=1;return {wait:3};}},
     {l:'경찰에 신고하고 공론화한다',s:'회사 법무팀 도움 · 노출 위험',fn:()=>{S.arc2.f.pub=1;return {wait:4};}}]};},
   ()=>{const f=S.arc2.f,s=(S.sources||[]).find(x=>x.id===f.sid);if(f.guard){if(s)s.trust=clamp(s.trust+30,0,100);const it=makeItem(S.dept,{excl:true,keyConf:true,pre:1,mult:1.15});S.items.push(it);return {t:'지켜 준 사람',d:`<p class="lede">${jo2(esc(s?s.name:'그 사람'),'이','가')} 보름 만에 연락해 왔다. "기자님만 믿어요." 결정적인 문건을 넘겼다. → 「${esc(it.title)}」</p>${fxLine(arcFx({trust:1.5}))}`,end:1,ti:'제보자의 방패'};}
     if(f.rush){if(s)S.sources=S.sources.filter(x=>x!==s);return {t:'잃은 사람',d:`<p class="lede">기사는 1면에 걸렸다. 그리고 ${jo2(esc(s?s.name:'그 사람'),'은','는')} 회사에서 쫓겨났다. 연락이 끊겼다.</p>${fxLine(arcFx({fame:2.5,trust:-3,men:-3}))}`,end:0};}
     return {t:'공론화',d:`<p class="lede">경찰 수사가 시작되자 미행은 멈췄다. 언론단체가 "제보자 보호" 성명을 냈다.</p>${fxLine(arcFx({trust:2.5,fame:1}))}`,end:1};}]},
 {id:'firstErr',n:'첫 오보 논란',tier:0,c:()=>!S.founder&&S.rank<=1&&(S.clips||[]).filter(c=>!c.staff).length>=3,st:[
   ()=>{const c=mine()[0]||{h:'내 기사'};S.arc2.f.h=c.h;return {t:'"명백한 허위"',d:`<p class="lede">「${esc(c.h)}」 속 당사자가 SNS에 "명백한 허위 기사"라며 내 실명을 올렸다. 댓글이 수천 개다.</p>`,o:[
     {l:'틀린 부분이 있는지 다시 확인하고 정정한다',s:'안전 · 평가 조금↓',fn:()=>{S.arc2.f.fix=1;return {wait:2};}},
     {l:'녹취를 공개하며 반박한다',s:'모 아니면 도',fn:()=>{S.arc2.f.fight=1;return {wait:3};}},
     {l:'데스크에 맡기고 입을 닫는다',s:'책임을 떠넘긴다',fn:()=>{S.arc2.f.hide=1;return {wait:2};}}]};},
   ()=>{const f=S.arc2.f;if(f.fix)return {t:'정정 보도',d:`<p class="lede">숫자 하나가 틀려 있었다. 정정문을 냈다. 캡이 말했다. "틀릴 순 있어. 숨기면 끝이야."</p>${fxLine(arcFx({eval:-.8,trust:1.2}))}`,end:1};
     if(f.fight){if(chance(.5+(S.st.ver||40)/250))return {t:'진실의 녹취',d:`<p class="lede">녹취 속 당사자 목소리가 공개되자 여론이 뒤집혔다. "기자가 맞았네."</p>${fxLine(arcFx({fame:3,trust:2}))}`,end:1,ti:'녹취의 승리'};return {t:'맥락 논란',d:`<p class="lede">녹취 앞뒤가 잘렸다는 반박이 나왔다. 언론중재위에 제소됐다.</p>${fxLine(arcFx({trust:-4,eval:-2}))}`,end:0};}
     const cp=colBy('cap');if(cp)relUp(cp,-8,'책임 회피');return {t:'떠넘긴 책임',d:`<p class="lede">데스크가 "기자 개인의 판단"이라고 선을 그었다. 이름만 남았다.</p>${fxLine(arcFx({eval:-2,men:-2}))}`,end:0};}]},
 // ── 중반 ──
 {id:'fabric',n:'조작된 인용',tier:1,c:()=>!S.founder&&S.rank>=2&&S.rank<=3&&(S.team||[]).length>=2,st:[
   ()=>{const m=pick(S.team);S.arc2.f.w=m.name;return {t:'존재하지 않는 사람',d:`<p class="lede">우리 부서 ${esc(m.name)} 기자 기사에 인용된 "익명의 학부모"가 실존하지 않는다는 제보가 왔다. 내가 데스킹한 기사다.</p>`,o:[
     {l:'즉시 내부 조사를 연다',s:'정공법',fn:()=>{S.arc2.f.probe=1;return {wait:3};}},
     {l:'기사를 조용히 내린다',s:'당장은 조용하다',fn:()=>{S.arc2.f.del=1;return {wait:4};}},
     {l:'기자를 믿고 감싼다',s:'의리 · 사실이면 함께 무너진다',fn:()=>{S.arc2.f.cover=1;return {wait:4};}}]};},
   ()=>{const f=S.arc2.f;if(f.probe){S.team=S.team.filter(x=>x.name!==f.w);return {t:'공개 사과',d:`<p class="lede">조사 결과 인용은 지어낸 것이었다. ${esc(f.w)} 기자는 징계를 받았고, 지면에 사과문이 실렸다. 업계는 "그래도 정직했다"고 평했다.</p>${fxLine(arcFx({trust:2.5,eval:-1}))}`,end:1,ti:'정직한 데스크'};}
     if(f.del){if(chance(.6)){S.disc=S.turn;return {t:'"몰래 삭제"',d:`<p class="lede">미디어 비평지가 "기사 몰래 삭제" 사실을 보도했다. 데스크인 내 이름이 나왔다.</p>${fxLine(arcFx({trust:-6,eval:-3}))}`,end:0};}return {t:'묻힌 일',d:'<p class="lede">아무도 모른 채 지나갔다. 마음 한구석이 무겁다.</p>',end:null};}
     if(chance(.8))return {t:'함께 무너지다',d:`<p class="lede">인용은 지어낸 것이었다. "데스크가 알고도 감쌌다"는 기사가 났다. 국장실로 불려 갔다.</p>${fxLine(arcFx({trust:-7,eval:-4}))}`,next:1};return {t:'믿음의 보답',d:`<p class="lede">취재원이 직접 나섰다. 인용은 사실이었다. ${esc(f.w)} 기자가 고개를 숙였다. "끝까지 믿어 주셔서…"</p>${fxLine(arcFx({eval:1,cha:.5}))}`,end:1};},
   ()=>({t:'국장실',d:'<p class="lede">국장: "책임질 사람이 필요해. 자네가 물러나든지, 버티든지."</p>',o:[{l:'보직을 내려놓고 사과한다',s:'평가 크게↓ · 자리는 남는다',fn:()=>{arcFx({eval:-5,trust:2});return {end:0,msg:'보직을 내려놓았다. 다시 기자로 돌아간다.'};}},{l:'버틴다',s:'절반의 확률로 권고사직',fn:()=>{if(chance(.5)){arcEnd(false);arcFire('조작 기사를 감싼 책임으로');return {stop:1};}arcFx({eval:-3});return {end:0,msg:'버텼다. 하지만 편집국의 눈빛이 달라졌다.'};}}]})]},
 {id:'adKill',n:'광고주의 삭제 요구',tier:1,c:()=>!S.founder&&S.rank>=2&&S.rank<=4,st:[
   ()=>{const big=pick(ENTS.filter(e=>e[2]==='corp'&&e[4]))||['c0','대형 광고주'];S.arc2.f.e=big[0];S.arc2.f.n=big[1];return {t:'삭제 요구',d:`<p class="lede">${jo2(esc(big[1]),'이','가')} 우리 부서 기사를 내리지 않으면 연간 광고를 끊겠다고 한다. 국장이 직접 전화했다. "적당히 하자."</p>`,o:[
     {l:'거부한다',s:'광고 손실 · 신뢰↑',fn:()=>{S.arc2.f.no=1;return {wait:4};}},{l:'표현만 다듬는다',s:'타협',fn:()=>{S.arc2.f.mid=1;return {wait:3};}},{l:'기사를 내린다',s:'회사 지키기 · 들키면 큰일',fn:()=>{S.arc2.f.kill=1;return {wait:4};}}]};},
   ()=>{const f=S.arc2.f;if(f.no){arcCash(-arcRev()*.8);if(S.net&&S.net[f.e])S.net[f.e].cut=(S.net[f.e].cut||0)+12;const sup=chance(.45);return {t:sup?'업계의 지지':'광고가 끊겼다',d:`<p class="lede">${esc(f.n)} 광고가 끊겼다.${sup?' 기자협회와 시민단체가 "광고로 기사를 사려 한다"는 성명을 냈다. 독자 후원이 몰렸다.':' 국장의 눈빛이 차갑다.'}</p>${fxLine(arcFx(sup?{trust:4,fame:3}:{trust:3,eval:-2}))}`,end:1,ti:sup?'광고에 굴하지 않은 데스크':''};}
     if(f.mid)return {t:'다듬어진 기사',d:'<p class="lede">기사는 살았고 광고도 살았다. 다만 날은 조금 무뎌졌다.</p>'+fxLine(arcFx({trust:-.5})),end:null};
     if(chance(.5))return {t:'내부 고발',d:`<p class="lede">노조가 "광고주 요구로 기사 삭제"라는 성명을 냈다. 기사 원문이 커뮤니티에 돌았다.</p>${fxLine(arcFx({trust:-6,eval:-2}))}`,end:0};return {t:'조용한 삭제',d:'<p class="lede">기사는 사라졌다. 광고는 남았다.</p>'+fxLine(arcFx({eval:1,trust:-1})),end:null};}]},
 {id:'burnout',n:'번아웃',tier:1,c:()=>!S.founder&&S.rank>=1&&S.hp<40,st:[
   ()=>({t:'쓰러지다',d:'<p class="lede">마감 직후 편집국에서 쓰러졌다. 응급실 의사가 말했다. "이렇게 일하시면 큰일 납니다."</p>',o:[
     {l:'2주 입원한다',s:'컨디션 회복 · 다음 달 행동력↓',fn:()=>{S.hp=90;S.sick=S.turn+2;return {end:1,msg:'푹 쉬었다. 몸이 돌아왔다.'};}},
     {l:'진통제로 버틴다',s:'당장은 일한다 · 재발 위험',fn:()=>{S.hp=Math.min(100,S.hp+12);return {wait:6};}},
     {l:'한 달 휴직한다',s:'완전히 회복 · 평가 조금↓ · 아이템 일부를 넘긴다',fn:()=>{S.hp=100;S.items=S.items.slice(0,1);arcFx({eval:-1});return {end:1,msg:'한 달을 쉬었다. 돌아와 보니 세상은 그대로였다.'};}}]}),
   ()=>{if(chance(.6)){S.hp=20;S.sick=S.turn+4;return {t:'재발',d:`<p class="lede">다시 쓰러졌다. 이번엔 한 달 병가를 받았다.</p>${fxLine(arcFx({eval:-1.5,men:-3}))}`,end:0};}return {t:'버텨 냈다',d:'<p class="lede">어떻게든 버텼다. 하지만 이게 언제까지 될까.</p>',end:null};}]},
 // ── 후반 대위기 ──
 {id:'regime',n:'정권의 언론 탄압',tier:2,big:1,sk:1,c:()=>!S.founder&&S.rank>=4,st:[
   ()=>({t:'대위기 · 세무조사 통보',d:`<p class="lede">정권 실세 비리 연속 보도 이후 국세청이 ${esc(OUT().n)}에 대한 특별 세무조사를 통보했다. 업계는 "보복"이라고 수군댄다.</p>`,o:[
     {l:'"세무조사는 보복" 정면 보도',s:'강경 · 다음 압박이 온다',fn:()=>{S.arc2.f.stand=(S.arc2.f.stand||0)+1;return {wait:6};}},{l:'조용히 법적 대응',s:'신중',fn:()=>{S.arc2.f.quiet=1;return {wait:6};}},{l:'비판 수위를 조절하겠다고 약속',s:'굴복의 첫걸음',fn:()=>{S.arc2.f.bow=(S.arc2.f.bow||0)+1;return {wait:6};}}]}),
   ()=>{arcCash(-arcRev()*1.2);return {t:'대위기 · 광고 중단과 압수수색',d:'<p class="lede">정부 광고가 끊겼고, 검찰이 편집국 압수수색 영장을 들고 왔다. 기자들이 사옥 로비에 모였다.</p>',o:[
     {l:'1면을 백지로 내고 독자에게 호소한다',s:'평판·신뢰 크게↑ · 회사 손실',fn:()=>{S.arc2.f.stand=(S.arc2.f.stand||0)+1;arcCash(arcRev()*.6);return {wait:4};}},{l:'변호인단을 꾸려 법정 싸움',s:'비용↑',fn:()=>{S.arc2.f.stand=(S.arc2.f.stand||0)+.5;arcCash(-arcRev()*.3);return {wait:4};}},{l:'사과문을 싣는다',s:'압박은 멈춘다 · 기자들이 등을 돌린다',fn:()=>{S.arc2.f.bow=(S.arc2.f.bow||0)+2;return {wait:4};}}]};},
   ()=>{const f=S.arc2.f;if((f.stand||0)>=(S.simple?1:1.5)){S.awards=(S.awards||0)+1;return {t:'편집권의 수호자',d:`<p class="lede">버텼다. 세무조사는 아무것도 찾지 못했고, 압수수색 영장 남발이 국정감사에서 도마에 올랐다. ${esc(OUT().n)}의 백지 1면은 언론사(史)에 남았다. 한국기자상 특별상.</p>${fxLine(arcFx({fame:8,trust:8,eval:3}))}`,end:1,ti:'편집권의 수호자'};}
     if((f.bow||0)>=(S.simple?1:2)){if(S.rank>=6&&chance(.5)){return {t:'굴복의 대가',d:'<p class="lede">기자 200명이 "편집국장 퇴진" 성명에 이름을 올렸다. 이사회가 움직였다.</p>',fire:'정권에 굴복했다는 비판 속에'};}return {t:'굴복의 대가',d:`<p class="lede">압박은 멈췄다. 하지만 후배들이 인사를 하지 않는다. "그때 우리를 팔았잖아요."</p>${fxLine(arcFx({trust:-10,eval:-3,men:-4}))}`,end:0};}
     return {t:'애매한 끝',d:`<p class="lede">세무조사는 추징금 조금으로 끝났다. 싸우지도, 굴복하지도 않았다.</p>${fxLine(arcFx({trust:1}))}`,end:null};}]},
 {id:'owner',n:'사주 일가의 비리',tier:2,big:1,c:()=>!S.founder&&S.rank>=4&&S.rank<7,st:[
   ()=>({t:'대위기 · 사주 일가 제보',d:`<p class="lede">내부 제보가 왔다. 사주 아들 회사로 ${esc(OUT().n)} 인쇄·광고 일감 수백억이 몰렸다는 회계 자료다. 진짜다.</p>`,o:[
     {l:'우리 회사 비리를 보도한다',s:'언론의 원칙 · 자리를 건다',fn:()=>{S.arc2.f.run=1;return {wait:4};}},{l:'감사실에 넘긴다',s:'절차대로',fn:()=>{S.arc2.f.audit=1;return {wait:5};}},{l:'묻는다',s:'회사를 지킨다 · 언젠가 터진다',fn:()=>{S.arc2.f.bury=1;return {wait:24};}}]}),
   ()=>{const f=S.arc2.f;if(f.run){if(S.rank>=6&&chance(.45))return {t:'사주의 분노',d:'<p class="lede">기사가 나간 날 저녁, 사주가 이사회를 소집했다. "배은망덕한 놈."</p>',fire:'사주 일가 비리를 보도한 뒤'};S.awards=(S.awards||0)+1;return {t:'제 살을 깎은 기사',d:`<p class="lede">자사 사주 비리를 스스로 보도한 기사는 업계를 흔들었다. 사주가 사과문을 냈고, 기자상을 받았다. 대신 다음 인사에서 한직으로 밀려날 각오는 해야 한다.</p>${fxLine(arcFx({trust:10,fame:6,eval:-4}))}`,end:1,ti:'제 살을 깎은 기자'};}
     if(f.audit){if(chance(.35))return {t:'형식적 감사',d:`<p class="lede">감사는 "문제없음"으로 끝났고, 제보 자료가 다른 매체에 흘러갔다.</p>${fxLine(arcFx({trust:-3,eval:-1}))}`,end:0};return {t:'조용한 정리',d:`<p class="lede">감사실이 계약을 정리했다. 밖으로 새지 않았다.</p>${fxLine(arcFx({eval:1}))}`,end:null};}
     if(chance(.75)){if(chance(.3)&&S.rank>=5)return {t:'2년 뒤의 폭로',d:'<p class="lede">경쟁지가 사주 일가 일감 몰아주기를 보도했다. "편집국 간부들은 알고도 묻었다." 내 이름이 나왔다.</p>',fire:'알고도 묻었다는 보도가 나온 뒤'};return {t:'2년 뒤의 폭로',d:`<p class="lede">경쟁지가 사주 일가 비리를 터뜨렸다. "${esc(OUT().n)} 간부들은 알고도 묻었다."</p>${fxLine(arcFx({trust:-12,eval:-5}))}`,end:0};}return {t:'묻힌 채로',d:'<p class="lede">아무 일도 없었다. 아직은.</p>',end:null};}]},
 {id:'scandal',n:'간판 특종 조작 의혹',tier:2,big:1,c:()=>!S.founder&&S.rank>=4,st:[
   ()=>({t:'대위기 · 조작 의혹',d:`<p class="lede">${jo2(esc(OUT().n),'이','가')} 지난해 터뜨린 간판 특종의 핵심 증언자가 "기자가 시킨 대로 말했다"고 폭로했다. 편집국 전체가 얼어붙었다.</p>`,o:[
     {l:'외부 진상조사위를 꾸린다',s:'투명하게 · 무엇이 나올지 모른다',fn:()=>{S.arc2.f.ext=1;return {wait:6};}},{l:'내부 감사로 조용히 확인',s:'시간을 번다',fn:()=>{S.arc2.f.int=1;return {wait:5};}},{l:'기자를 공개적으로 옹호한다',s:'편집국을 지킨다 · 틀리면 끝',fn:()=>{S.arc2.f.def=1;return {wait:5};}}]}),
   ()=>{const f=S.arc2.f;const fake=chance(.6);if(f.ext)return fake?{t:'진상조사 보고서',d:`<p class="lede">조사위는 증언 일부가 유도됐다고 결론 냈다. 지면 2개 면에 걸쳐 진상 보고서와 사과문을 실었다. 뼈아프지만 업계는 "정면 돌파"라고 평했다.</p>${fxLine(arcFx({trust:3,eval:-2,fame:1}))}`,end:1,ti:'정면 돌파'}:{t:'무혐의',d:`<p class="lede">조사위는 기사가 사실에 근거했다고 밝혔다. 증언자는 회사에서 압박을 받았다고 털어놨다.</p>${fxLine(arcFx({trust:5,fame:4}))}`,end:1,ti:'흔들리지 않은 특종'};
     if(f.int)return fake?{t:'커지는 의혹',d:`<p class="lede">"${jo2(esc(OUT().n),'이','가')} 덮으려 한다"는 보도가 이어졌다.</p>${fxLine(arcFx({trust:-6,eval:-2}))}`,end:0}:{t:'잠잠해진 의혹',d:'<p class="lede">조용히 확인했고, 조용히 지나갔다.</p>',end:null};
     if(fake){if(S.rank>=5&&chance(.5))return {t:'책임론',d:'<p class="lede">조작이 확인됐다. "끝까지 옹호한 간부"에게 책임론이 쏠렸다.</p>',fire:'조작 보도를 옹호한 책임으로'};return {t:'책임론',d:`<p class="lede">조작이 확인됐다. 옹호 발언이 두고두고 회자됐다.</p>${fxLine(arcFx({trust:-8,eval:-6}))}`,end:0};}
     return {t:'지켜 낸 기자',d:`<p class="lede">증언자의 폭로는 거짓이었다. 끝까지 기자를 믿은 간부로 이름이 남았다.</p>${fxLine(arcFx({trust:4,fame:4,eval:2}))}`,end:1,ti:'기자를 지킨 간부'};}]},
 {id:'mna',n:'적대적 인수',tier:2,big:1,c:()=>!S.founder&&S.rank>=5&&S.rank<7&&OUT().p>=3,st:[
   ()=>({t:'대위기 · 사모펀드의 인수 시도',d:`<p class="lede">사모펀드가 ${esc(OUT().n)} 지분을 사들이고 있다. 인수 뒤 "수익성 없는 부서 정리"가 계획서에 적혀 있다.</p>`,o:[
     {l:'기자 총회를 열고 반대 성명을 주도한다',s:'편집국을 지킨다 · 눈엣가시가 된다',fn:()=>{S.arc2.f.fight=1;return {wait:8};}},{l:'편집권 독립 조항을 협상한다',s:'실리',fn:()=>{S.arc2.f.deal=1;return {wait:8};}},{l:'새 주인을 환영한다',s:'자리는 지킨다',fn:()=>{S.arc2.f.wel=1;return {wait:8};}}]}),
   ()=>{const f=S.arc2.f,c=S.co;if(f.fight){if(chance(.6))return {t:'인수 무산',d:`<p class="lede">독자 모금과 기자 총회 성명이 여론을 움직였다. 사모펀드가 손을 뗐다.</p>${fxLine(arcFx({fame:4,trust:4,eval:2}))}`,end:1,ti:'편집국을 지킨 사람'};if(c){c.staff=Math.max(5,Math.round(c.staff*.88));c.q-=4;}return {t:'인수 완료',d:`<p class="lede">인수는 성사됐다. 새 경영진의 첫 인사 명단에 내 이름이 "검토 대상"으로 올랐다.</p>${fxLine(arcFx({eval:-5}))}`,end:0};}
     if(f.deal)return {t:'독립 조항',d:`<p class="lede">인수는 됐지만 편집권 독립 조항과 편집국장 임명동의제를 지켜 냈다.</p>${fxLine(arcFx({trust:2,eval:1}))}`,end:1};
     if(c){c.staff=Math.max(5,Math.round(c.staff*.85));c.q-=5;}S.money+=2000;return {t:'구조조정',d:`<p class="lede">새 주인은 기자 15%를 내보냈다. 남은 간부에겐 스톡옵션 2,000만 원. 편집국은 조용해졌다.</p>${fxLine(arcFx({eval:3,trust:-5}))}`,end:null};}]},
 {id:'mega',n:'1000억 소송',tier:2,big:1,c:()=>!S.founder&&S.rank>=4,st:[
   ()=>{const big=pick(ENTS.filter(e=>e[2]==='corp'))||['c0','대기업'];S.arc2.f.n=big[1];return {t:'대위기 · 1000억 손해배상',d:`<p class="lede">${jo2(esc(big[1]),'이','가')} 우리 연속 보도에 1000억 원 손해배상을 청구했다. 사상 최대다. ${S.rank>=7?'이사회가':'사장이'} "어떻게 할 거냐"고 묻는다.</p>`,o:[
     {l:'끝까지 간다',s:'1년 뒤 판결 · 승패에 커리어가 걸린다',fn:()=>{S.arc2.f.go=1;arcCash(-arcRev()*.3);return {wait:16};}},{l:'정정 보도로 합의한다',s:'신뢰↓ · 끝',fn:()=>{arcFx({trust:-4,eval:1});return {end:0,msg:'합의했다. 기사 일부가 정정됐다.'};}},{l:'기사를 내린다',s:'소송은 취하 · 후배들이 등을 돌린다',fn:()=>{arcFx({trust:-7,men:-3});return {end:0,msg:'기사를 내렸다. 편집국이 술렁였다.'};}}]};},
   ()=>{const f=S.arc2.f;if(chance(.55+(S.trust-50)/200)){S.awards=(S.awards||0)+1;return {t:'승소',d:`<p class="lede">법원은 "공익을 위한 보도로 상당한 이유가 있었다"며 ${esc(f.n)}의 청구를 기각했다. 언론자유 판례로 남았다.</p>${fxLine(arcFx({fame:6,trust:6,eval:3}))}`,end:1,ti:'1000억을 이긴 기자'};}
     arcCash(-arcRev()*2.5);return {t:'패소',d:'<p class="lede">일부 패소. 배상액은 줄었지만 회사가 휘청였다. 책임론이 나왔다.</p>'+fxLine(arcFx({eval:-4,trust:-3})),end:0};}]},
 // ── 창간 ──
 {id:'fInvest',n:'투자사의 경영권 압박',tier:3,big:1,c:()=>S.founder&&S.investor,st:[
   ()=>({t:'창간 위기 · 경영권 압박',d:'<p class="lede">투자사가 "편집 방향을 바꾸든지 이사 두 자리를 내놓으라"고 통보했다.</p>',o:[
     {l:'우호 투자자를 찾아 맞선다',s:'회사 자금 -2억 · 독립',fn:()=>{arcCash(-2);S.arc2.f.fight=1;return {wait:6};}},{l:'이사 한 자리를 내준다',s:'지분 -5%',fn:()=>{S.equity=Math.max(10,(S.equity||100)-5);return {end:null,msg:'이사회에 투자사 사람이 앉았다.'};}},{l:'요구를 받아들인다',s:'트래픽 기사 늘리기 · 신뢰↓',fn:()=>{arcFx({trust:-5});S.co.bT+=.03;return {end:0,msg:'편집 방향이 바뀌었다. 창간 멤버들이 술렁인다.'};}}]}),
   ()=>{if(chance(.55+fs('pr')/300))return {t:'독립을 지키다',d:`<p class="lede">우호 투자자가 지분을 사들였다. 투자사가 손을 뗐다.</p>${fxLine(arcFx({trust:4,fame:2}))}`,end:1,ti:'독립 언론의 대표'};if(!S.simple&&chance(.4))return {t:'이사회 표 대결',d:'<p class="lede">이사회 표 대결에서 한 표 차로 졌다.</p>',fend:'이사회 해임'};arcCash(-1);return {t:'상처뿐인 방어',d:`<p class="lede">겨우 막았지만 돈과 사람을 많이 잃었다.</p>${fxLine(arcFx({trust:1}))}`,end:null};}]},
 {id:'fSuit',n:'창간 매체 소송 폭탄',tier:3,c:()=>S.founder&&(S.scoops||0)>=1,st:[
   ()=>{const big=pick(ENTS.filter(e=>e[2]==='corp'))||['c0','대기업'];S.arc2.f.n=big[1];return {t:'창간 위기 · 100억 소송',d:`<p class="lede">${jo2(esc(big[1]),'이','가')} 우리 보도에 100억 원 소송을 걸었다. 작은 매체를 말려 죽이려는 소송이다.</p>`,o:[
     {l:'끝까지 싸운다',s:'변호 비용 · 1년 뒤 판결',fn:()=>{arcCash(-.8);return {wait:16};}},{l:'독자 소송 후원을 모은다',s:'후원 · 싸운다',fn:()=>{arcCash(.6);S.arc2.f.fund=1;return {wait:16};}},{l:'정정하고 합의한다',s:'끝 · 신뢰↓',fn:()=>{arcFx({trust:-5});return {end:0,msg:'합의했다.'};}}]};},
   ()=>{if(chance(.55+(S.arc2.f.fund?.1:0)))return {t:'승소',d:`<p class="lede">청구 기각. "작은 매체가 대기업을 이겼다"는 기사가 쏟아졌다. 후원 회원이 늘었다.</p>${fxLine(arcFx({fame:5,trust:5}))}`,end:1,ti:'다윗의 대표'};arcCash(-3);return {t:'패소',d:'<p class="lede">일부 패소. 배상금 3억. 통장이 바닥을 보인다.</p>',end:0};}]},
 {id:'fExodus',n:'핵심 기자 집단 이탈',tier:3,c:()=>S.founder&&S.co&&S.co.staff>=8,st:[
   ()=>({t:'창간 위기 · 집단 이탈',d:'<p class="lede">에이스 기자 셋이 대형 매체로 한꺼번에 옮기겠다고 통보했다. "대표님 비전은 좋은데, 월급이…"</p>',o:[
     {l:'임금을 올려 붙잡는다',s:'임금 수준↑ · 비용↑',fn:()=>{S.payLv=+((S.payLv||1)+.08).toFixed(2);return {end:1,msg:'붙잡았다. 대신 인건비가 늘었다.'};}},{l:'지분을 나눠 준다',s:'지분 -6% · 충성도↑',fn:()=>{S.equity=Math.max(10,(S.equity||100)-6);S.co.q+=2;return {end:1,msg:'"우리 회사"가 됐다. 셋 다 남았다.'};}},{l:'보낸다',s:'품질↓ · 새 사람을 뽑는다',fn:()=>{S.co.staff=Math.max(2,S.co.staff-3);S.co.q-=5;return {end:0,msg:'셋이 떠났다. 편집국이 텅 빈 것 같다.'};}}]})]},
 {id:'fPlatform',n:'포털 알고리즘 변경',tier:3,c:()=>S.founder&&S.co&&S.co.tr>0,st:[
   ()=>{S.co.tr*=.6;return {t:'창간 위기 · 트래픽 반토막',d:'<p class="lede">포털이 뉴스 알고리즘을 바꿨다. 하루아침에 트래픽이 40% 날아갔다.</p>',o:[
     {l:'구독 전환에 투자한다',s:'자금 -1.5억 · 장기적으로 구독↑',fn:()=>{arcCash(-1.5);S.co.bS+=.04;return {wait:8};}},{l:'포털에 로비한다',s:'관계망 의존',fn:()=>{S.arc2.f.lobby=1;return {wait:6};}},{l:'버틴다',s:'아무것도 안 한다',fn:()=>{return {wait:8};}}]};},
   ()=>{const f=S.arc2.f;if(f.lobby&&chance(.5)){S.co.tr*=1.35;return {t:'원상 복구',d:'<p class="lede">포털이 일부 매체 노출을 되돌렸다. 우리도 포함됐다.</p>',end:1};}if(S.co.bS>0){S.co.subs*=1.15;return {t:'구독의 힘',d:'<p class="lede">포털에 기대지 않는 독자가 늘었다. 트래픽은 덜해도 수입은 더 단단하다.</p>'+fxLine(arcFx({trust:2})),end:1,ti:'포털에 기대지 않는 매체'};}return {t:'줄어든 판',d:'<p class="lede">트래픽은 돌아오지 않았다. 새 판에 적응해야 한다.</p>',end:0};}]}
];
function arcPick(){const late=!S.founder&&(S.rank>=4||years()>=15);const tier=S.founder?3:late?2:S.rank>=2?1:0;const done=S.arcDone||[];
  const el=A2.filter(a=>(a.tier===tier||(tier===2&&a.tier===1&&chance(.25)))&&!done.includes(a.id)&&(()=>{try{return a.c();}catch(e){return false;}})());return el.length?pick(el):null;}
function crisisTick(lines){if(!S||S.phase!=='game'||S.story)return;const a=S.arc2;
  if(a){if(S.turn>=a.due)Q.push(()=>arcShow());return;}
  if((S.arcCool||0)>S.turn||(S.calmT||0)>S.turn)return;const late=!S.founder&&(S.rank>=4||years()>=15);
  const bc=S.bigCrisis||0;let p=S.founder?.035:late?(bc>=2?.004:bc?(S.simple?.004:.012):(years()>=18?(S.simple?.05:.08):.03)):S.rank>=2?.045:S.rank>=1?.035:0;if(S.simple)p*=.6;p*=(DF().crisis||1);if(!chance(p))return;
  const x=arcPick();if(!x)return;S.arc2={id:x.id,st:0,due:S.turn,f:{}};calmSet(4);Q.push(()=>arcShow());}
function arcShow(){const a=S.arc2;if(!a)return closeModal();const X=A2.find(x=>x.id===a.id);if(!X){S.arc2=null;return closeModal();}
  let si=a.st;if(S.simple&&X.sk&&si>0&&si<X.st.length-1)si=X.st.length-1;const r=X.st[si]();const N=X.st.length;
  const head=`<div class="arch"><b>${X.big?'대위기':'위기'} · ${esc(X.n)}</b><span>${si+1}/${N}단계</span></div>`;
  const fin=(res)=>{if(!res)return;if(res.stop)return;if(res.end!==undefined){arcEnd(res.end,res.ti||null);if(res.msg)toast(res.msg);return;}if(res.fire){arcEnd(false);arcFire(res.fire);return;}a.st=si+1;a.due=S.turn+(res.wait||4);};
  if(r.o){openModal(r.t,head+r.d,r.o.map(o=>({label:o.l,sub:o.s,fn:()=>{const res=o.fn();fin(res);if(res&&res.stop)return false;}})));return;}
  if(r.fire){openModal(r.t,head+r.d,[{label:'받아들인다',fn:()=>{arcEnd(false);arcFire(r.fire);return false;}}]);return;}
  if(r.fend){openModal(r.t,head+r.d,[{label:'결과 보기',fn:()=>{arcEnd(false);ending(r.fend);render();return false;}}]);return;}
  if(r.next){a.st=si+1;a.due=S.turn+2;openModal(r.t,head+r.d,[{label:'다음',cls:'ghost'}]);return;}
  arcEnd(r.end,r.ti);openModal(r.t,head+r.d+(r.ti&&r.end?`<p class="fx">칭호 「${esc(r.ti)}」</p>`:''),[{label:'넘어간다'}]);}
function arcCard(){const a=S&&S.arc2;if(!a)return '';const X=A2.find(x=>x.id===a.id);if(!X)return '';const left=Math.max(0,a.due-S.turn);return `<div class="arcc${X.big?' big':''}"><b>${ic('fire')} ${X.big?'대위기':'위기'} 진행 중 · ${esc(X.n)}</b><span>${a.st+1}/${X.st.length}단계 · 다음 고비까지 ${left?heatTxt(left):'곧'}</span></div>`;}

// ===================== 6.0 기자의 길: 어떻게 일하느냐가 커리어를 바꾼다 =====================
// 매달 내 행동과 기사로 네 갈래 성향이 쌓인다. 1년이 지나 한 갈래가 뚜렷하면 '유형'이 정해지고, 확실한 장점과 대가가 붙는다
const STYLE={
 scoop:{n:'스쿠프 헌터',c:'#ff8f6b',d:'단독을 쫓는 기자',up:'아이템이 더 많이 들어오고(+15%) 평판이 잘 오른다(+12%)',down:'소송 위험 +30% · 신뢰는 덜 오른다(-10%)',fx:{item:1.15,fame:1.12,legal:1.3,trust:.9}},
 fact:{n:'팩트의 수호자',c:'#5ad49b',d:'두 번 확인하는 기자',up:'신뢰가 크게 오르고(+25%) 소송 위험 -35% · 사내 평가 +6%',down:'평판은 천천히 오른다(-12%) · 아이템이 조금 덜 돈다(-8%)',fx:{trust:1.25,legal:.65,eval:1.06,fame:.88,item:.92}},
 net:{n:'마당발',c:'#77a6ff',d:'사람으로 취재하는 기자',up:'관계가 훨씬 잘 쌓이고(+30%) 제보가 잦다(아이템 +8%) · 승진 경쟁에서 인맥 가산 · 광고 영업 성공률 +8%p · 스카우트 제안이 잦고 조건이 좋다',down:'청탁·유착 유혹이 따라온다 · 신뢰 -6%',fx:{rel:1.3,item:1.08,trust:.94}},
 buzz:{n:'속보 장인',c:'#ffb84d',d:'가장 빨리 쓰는 기자',up:'평판이 빨리 오르고(+18%) 속보 대응이 강하다',down:'신뢰가 덜 오르고(-15%) 몸이 더 지친다(+6%)',fx:{fame:1.18,trust:.85,hp:1.06}}};
function styleOf(){if(!S||S.founder||!S.sty||S.route)return null;return S.styT||null;}
function styleMonth(lines){if(!S||S.founder||S.story||S.phase!=='game')return;const A=S.mAct||{},t=S.turn,M=mine().filter(c=>c.turn>t-4);const P=S.sty=S.sty||{scoop:0,fact:0,net:0,buzz:0};
  const err=(S.errT||[]).filter(x=>x>t-4).length;
  P.scoop+=M.filter(c=>c.excl).length*2.5+(A.hari||0)+(A.discover||0)*.5+(A.special||0)*.4;
  P.fact+=M.filter(c=>(c.q||0)>=68).length*1.5+M.filter(c=>c.rb).length+(A.invest||0)*.35+(A.report||0)*.3-err*3;
  P.net+=(A.source||0)*1+(A.network||0)*1.2+(A.drink||0)+(A.colleague||0)*.5+(A.beat||0)*.3;
  P.buzz+=M.filter(c=>/온라인|속보/.test(c.place||'')).length*1+M.filter(c=>(c.views||0)>=30000).length+(A.breaking||0)*1.5+(A.sasu||0)*.3;
  for(const k in P)P[k]=Math.max(0,+(P[k]*.97).toFixed(2));
  const ks=Object.keys(P).sort((a,b)=>P[b]-P[a]);const top=ks[0],sec=ks[1];const prev=S.styT;
  if((S.atOutlet||0)>=24||t>=24){if(P[top]>=8&&P[top]>=P[sec]*1.2)S.styT=top;else if(prev&&P[prev]<P[top]*.7)S.styT=null;}
  if(S.styT&&S.styT!==prev){const st=STYLE[S.styT];lines.push({c:'g',t:`기자의 길 — 업계가 나를 「${st.n}」(${st.d})로 부르기 시작했다. 장점: ${st.up} · 대가: ${st.down}`});log(`기자 유형: ${st.n}`);}
  else if(prev&&!S.styT)lines.push({c:'',t:`기자의 길 — 「${STYLE[prev].n}」 색이 옅어졌다. 다시 방향을 잡을 때다`});
  // 유형별 고유 사건
  const s=S.styT;if(!s||S.simple||!chance(.14))return;
  if(s==='scoop')Q.push(()=>openModal('단독 경쟁',`<p class="lede">타사 ${jo2(pick(['캡','데스크','기자']),'이','가')} 같은 사안을 파고 있다는 첩보가 왔다. 먼저 쓰면 단독, 늦으면 물먹는다.</p>`,[{label:'오늘 밤 안에 끝낸다',sub:'확인이 반쯤 된 단독 아이템 · 컨디션↓ · 오보 위험',fn:()=>{const it=makeItem(S.dept,{excl:true,pre:1,mult:1.15});it.heat=Math.min(it.heat,2);S.items.push(it);S.hp=clamp(S.hp-8,0,100);toast(`「${it.title}」 · 추격까지 짧다`);}},{label:'확인될 때까지 기다린다',sub:'신뢰↑ · 단독은 놓칠 수 있다',fn:()=>{toast(apply({trust:1}));}}]));
  if(s==='fact')Q.push(()=>openModal('팩트체크 협업 제안',`<p class="lede">언론학회와 팩트체크 센터가 공동 검증 프로젝트에 이름을 올려 달라고 한다.</p>`,[{label:'참여한다',sub:'신뢰·사내 평가↑ · 행동력 1',fn:()=>{spend(1,3);toast(apply({trust:2,eval:1,ver:.5}));}},{label:'바빠서 사양한다',cls:'ghost'}]));
  if(s==='net')Q.push(()=>openModal('고위 인사의 부탁',`<p class="lede">오래 공들인 고위 인사가 조용히 불렀다. "자네한테만 주는 거야. 대신 내 쪽 얘기는 좀 빼 주고."</p>`,[{label:'정보만 받고 약속은 안 한다',sub:'단독 아이템 · 관계↓',fn:()=>{const it=makeItem(S.dept,{excl:true,keyConf:true});S.items.push(it);const so=(S.sources||[]).slice().sort((a,b)=>b.trust-a.trust)[0];if(so)so.trust=clamp(so.trust-10,0,100);toast(`「${it.title}」 · 그는 서운해했다`);}},{label:'거래한다',sub:'대형 단독 · 신뢰 크게↓ · 들키면 징계',fn:()=>{const it=makeItem(S.dept,{excl:true,keyConf:true,mult:1.25});S.items.push(it);apply({trust:-4});if(chance(.3)){S.disc=S.turn;log('징계: 견책 — 취재원과의 거래가 드러났다');}toast(`「${it.title}」`);}},{label:'거절한다',sub:'신뢰↑',fn:()=>toast(apply({trust:1.5}))}]));
  if(s==='buzz')Q.push(()=>openModal('포털 메인 고정 제안',`<p class="lede">포털 편집팀이 내 속보를 오전 내내 메인에 걸어 주겠다고 한다. 조건은 제목을 더 세게.</p>`,[{label:'제목을 세게 바꾼다',sub:'평판↑ · 신뢰↓',fn:()=>toast(apply({fame:2,trust:-1.5}))},{label:'원래 제목으로 간다',sub:'신뢰↑',fn:()=>toast(apply({trust:1}))}]));}
EVENTS.push({w:2,c:()=>S.styT==='net'&&!S.founder&&!S.story&&S.rank>=1&&S.rank<=5&&(S.atOutlet||0)>=36&&(S.scoutT??-99)<S.turn-24,run:()=>{S.scoutT=S.turn;const cand=OUTLETS.filter(o=>o.id!==S.outlet&&!o.closed&&!o.custom&&o.p>=OUT().p&&xferRank(o,clamp(S.rank+1,1,5))>S.rank);if(!cand.length)return closeModal();const o=pick(cand);const r=xferRank(o,clamp(S.rank+1,1,5));const bonus=R(30,60)*10;
  openModal('마당발에게 온 스카우트',`<p class="lede">아는 사람이 많으니 소문도 빠르다. ${esc(o.n)}(${TYPES[o.type].n}) 국장이 직접 연락했다. "${rankName(r,o)} 자리 비워 뒀습니다. 입사 축하금 ${bonus}만 원 드리죠."</p><p>${esc(o.d)}</p>`,[{label:'옮긴다',sub:`${rankName(r,o)} · 축하금 ${bonus}만 원`,fn:()=>{S.money+=bonus;transfer(o,r);}},{label:'남는다',sub:'회사가 붙잡는다 · 사내 평가↑',fn:()=>toast(apply({eval:2}))}]);}});
function styleHTMLOld(){if(!S||S.founder||S.story)return '';const P=S.sty||{scoop:0,fact:0,net:0,buzz:0};const mx=Math.max(10,...Object.values(P));const s=S.styT;
  return `<div class="card rkc styc"><div class="t">${ic('user')} 기자의 길${s?` · <b style="color:${STYLE[s].c}">${esc(STYLE[s].n)}</b>`:' · 아직 색이 없다'}</div>${Object.keys(STYLE).map(k=>`<div class="sbar"><span>${esc(STYLE[k].n)}</span><i style="--p:${Math.round(P[k]/mx*100)}%;--c:${STYLE[k].c}"></i></div>`).join('')}<p class="hint" style="margin:4px 0 0">${s?`장점: ${esc(STYLE[s].up)} · 대가: ${esc(STYLE[s].down)}`:`${(()=>{const ks=Object.keys(P).sort((a,b)=>P[b]-P[a]);const top=ks[0],sec=ks[1];const wait=Math.max(0,24-Math.max(S.atOutlet||0,S.turn||0));return P[top]>0?`지금 가장 강한 성향은 「${STYLE[top].n}」(${Math.round(P[top])}). ${wait>0?`${moTxt(wait)} 더 일하면 판정한다. `:''}${P[top]<8?'조금 더 쌓여야 한다. ':P[top]<P[sec]*1.2?`「${STYLE[sec].n}」${jo2(STYLE[sec].n,'과','와').slice(-1)} 비슷해서 아직 색이 갈리지 않는다. `:''}`:'';})()}`+'단독을 쫓을지, 두 번 확인할지, 사람을 만날지, 가장 빨리 쓸지. 반년쯤 한 방향으로 일하면 유형이 정해지고 확실한 장점과 대가가 붙는다.'}</p>${typeof pathsHTML==='function'?pathsHTML():''}</div>`;}

// ===================== 6.0 다회차: 기록실·도감·세계 연결·유산·도전·다음 판 =====================
const META_KEY='byline-meta';
function realDate(){try{const d=new Date();return `${d.getFullYear()}.${String(d.getMonth()+1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;}catch(e){return '';}}
function metaGet(){try{const m=JSON.parse(localStorage.getItem(META_KEY)||'null');if(m&&m.v===1)return m;}catch(e){}return {v:1,runs:[],endings:{},stories:{},titles:{},outlets:{},depts:{},scenes:{},legend:[],npcs:[],founded:[],chal:{}};}
let META=metaGet();
function metaSave(){try{localStorage.setItem(META_KEY,JSON.stringify(META));}catch(e){}}
function metaOn(){return !!(S&&!S.dev&&!S.devUsed&&!S.story);}
function metaMark(k,id){if(!metaOn()||id==null)return;META[k]=META[k]||{};if(!META[k][id]){META[k][id]=realDate()||1;metaSave();}}
// 엔딩 도감: 이름 · 갈래 · 힌트
const END_DEX=[
 ['정년퇴직','retire','기자로 끝까지 버텨 정년을 맞는다'],['임기 만료 퇴임','retire','간부 자리에서 임기를 채우고 물러난다'],['임기 만료 · 사장실의 주인','retire','사장 임기를 끝까지 채운다'],
 ['명예퇴직','fired','오래 일한 뒤 회사의 권유를 받아들인다'],['희망퇴직','fired','어려운 회사에서 희망퇴직 대상이 된다'],['권고사직','fired','평가가 바닥을 치면 회사가 나가 달라고 한다'],
 ['퇴사','fired','스스로 펜을 내려놓는다'],['자진 퇴사','fired','더는 못 버티겠다고 사표를 낸다'],['이사회 해임','fired','사장이 되어 이사회와 맞서다 밀려난다'],
 ['창간 성공 · 메이저 언론','found','내가 세운 매체를 ★5 메이저로 키운다'],['창간 엔딩 · 매각','found','키운 매체를 좋은 값에 판다'],['매각 후 은퇴','found','매체를 넘기고 조용히 물러난다'],
 ['대표 은퇴 · 승계','found','후배에게 대표 자리를 물려준다'],['창간 10주년 · 아름다운 퇴장','found','창간 10년을 채우고 박수 속에 떠난다'],['창간 완전 클리어','found','창간 목표 셋을 모두 이룬다'],['창간 실패 · 파산','fired','통장이 바닥나 문을 닫는다'],
 ['정권의 입 · 대변인','retire','어용의 길 끝에서 대통령실 대변인이 된다'],['기자 출신 국회의원','retire','유착의 길 끝에서 금배지를 단다'],['클릭 공장장','retire','기레기의 길 끝에서 클릭의 제왕으로 물러난다'],
 ['어용 기자의 몰락','fired','어용의 길에서 정권과 함께 무너진다'],['게이트 연루','fired','유착의 길에서 검찰 수사에 휘말린다'],['언론계 퇴출','fired','기레기의 길에서 업계에서 쫓겨난다'],
 ['데이터 저널리즘의 개척자','retire','데이터 전문 분야를 끝까지 키운다'],['탐사보도의 전설','retire','탐사 전문 분야로 사건 파일을 여럿 해결한다'],['간판 앵커','retire','방송 전문 분야를 끝까지 키운다'],['시대의 논객','retire','칼럼 전문 분야를 끝까지 키운다'],['르포 문학의 거장','retire','르포 전문 분야를 끝까지 키운다'],
 ['권력 감시의 상징','retire','감시견의 길 끝에서 언론자유상을 받는다'],['약자의 펜','retire','약자의 목소리 끝에서 인권보도상을 받는다'],['팩트체크의 대명사','retire','검증의 길 끝에서 업계의 기준이 된다'],['펜이 꺾이다','fired','감시견의 길에서 권력의 보복에 밀려난다'],
 ['광장의 스타 유튜버','retire','선동가의 길 끝에서 회사를 나와 내 채널로 간다'],['홍보대행사 대표','retire','청부 기사의 길 끝에서 기사를 사는 쪽으로 간다'],['가짜뉴스 유포자','fired','선동가의 길에서 거짓이 드러나 쫓겨난다'],['기사 거래 적발','fired','청부 기사의 길에서 장부가 드러난다']];
function endDexKey(k){k=String(k||'');const e=END_DEX.find(x=>k===x[0]||k.startsWith(x[0]));return e?e[0]:null;}
// 도전 과제
const CHAL=[
 {id:'clean',n:'무결점 기자',d:'오보 0건으로 10년 이상 일하고 끝낸다',ok:()=>years()>=10&&!S.errors&&!S.founder},
 {id:'fast',n:'초고속 승진',d:'입사 10년 안에 부장(팀장)에 오른다',ok:()=>(S.promoHist||[]).some(h=>h.r>=3&&h.y<=10)},
 {id:'scoop',n:'단독 제조기',d:'단독 30건 이상으로 커리어를 마친다',ok:()=>(S.scoops||0)>=30},
 {id:'local',n:'지역의 별',d:'지역 일간지에서 편집국장까지 오른다',ok:()=>OUT().type==='local'&&S.rank>=6&&!S.founder},
 {id:'tv',n:'보도국의 주인',d:'방송사에서 보도국장 이상에 오른다',ok:()=>isTV()&&S.rank>=6&&!S.founder},
 {id:'award',n:'기자상 3관왕',d:'한국기자상을 세 번 받는다',ok:()=>(S.awards||0)>=3},
 {id:'iron',n:'강철 멘탈',d:'어려움 난이도로 정년퇴직·임기 만료를 맞는다',ok:()=>S.diff==='hard'&&/정년|임기 만료/.test(S.endKind||'')},
 {id:'major',n:'메이저 창간',d:'창간 모드에서 ★5 메이저 언론을 만든다',ok:()=>S.founder&&/메이저|완전 클리어/.test(S.endKind||'')},
 {id:'nomad',n:'저니맨의 끝',d:'네 곳 이상의 회사를 거쳐 국장 이상으로 마친다',ok:()=>new Set(S.history||[]).size>=4&&S.rank>=5}];
// 유산 보너스: 일부러 작게. 어려움에선 못 쓴다
const LEGACY=[
 {id:'card',n:'선배의 명함첩',d:'시작할 때 믿을 만한 취재원 1명 (신뢰 30)',un:'지난 판에서 차장 이상 오르기',ok:()=>META.runs.some(r=>r.rank>=2),fx:()=>{addSource(S.dept,30);}},
 {id:'study',n:'언론고시 우등생',d:'상식·검증력 +2',un:'세 판 이상 끝내기',ok:()=>META.runs.length>=3,fx:()=>{gain('kno',2);gain('ver',2);}},
 {id:'award',n:'기자상 선배의 후배',d:'업계 평판 +3',un:'한 판에서 기자상 받기',ok:()=>META.runs.some(r=>r.aw>=1),fx:()=>{S.fame=(S.fame||0)+3;}},
 {id:'heir',n:'2세 기자',d:'아는 기관 3곳과 관계 +6',un:'국장 이상으로 한 판 끝내기',ok:()=>META.runs.some(r=>r.rank>=5),fx:()=>{if(S.net)Object.keys(S.net).filter(k=>S.net[k].known).slice(0,3).forEach(k=>netUp(k,6));}},
 {id:'seed',n:'창간 경험',d:'통장 +500만 원',un:'창간 모드로 3년 이상 버티기',ok:()=>META.runs.some(r=>r.f&&r.yrs>=3),fx:()=>{S.money+=500;}},
 {id:'friends',n:'발 넓은 동기',d:'동료들과 관계 +10으로 시작',un:'도감 점수 8',ok:()=>dexPts()>=8,fx:()=>{(S.cols||[]).forEach(c=>{c.rel=clamp((c.rel||0)+10,-100,100);});}},
 {id:'regular',n:'단골 제보자',d:'신뢰가 쌓인 취재원 2명과 시작',un:'도감 점수 12',ok:()=>dexPts()>=12,fx:()=>{addSource(S.dept,32);addSource(S.dept,28);}},
 {id:'deskeye',n:'데스크의 눈',d:'검증력·문장력 +2로 시작',un:'도감 점수 18',ok:()=>dexPts()>=18,fx:()=>{gain('ver',2);gain('wri',2);}},
 {id:'senior',n:'전설의 선배',d:'업계 평판 +6 · 사내 평가 +3으로 시작',un:'도감 점수 26',ok:()=>dexPts()>=26,fx:()=>{S.fame=(S.fame||0)+6;S.eval=(S.eval||0)+3;}},
 {id:'note',n:'전설의 취재 수첩',d:'확인이 반쯤 된 단독 아이템 1건으로 시작',un:'엔딩 5종 보기',ok:()=>Object.keys(META.endings||{}).length>=5,fx:()=>{const it=makeItem(S.dept,{excl:true,pre:1});it.src='취재 수첩';S.items.push(it);}}];
// ===== 7.3 첫 달 오프닝 특종: 수습 첫 달, 두 번째 할 일을 마치면 단독의 냄새가 찾아온다 =====
function opScoopEv(){if(S.phase!=='game'||S.opScoop!==2)return closeModal();const cap=(colBy('cap')||{}).name||S.capName||'캡';const dd=catOf(S.dept).includes('case')||S.dept==='soc'?'case':S.dept;const it=makeItem(dd,{excl:true,mult:1.15});it.op=1;window.__opIt=it;
  openModal('새벽 경찰서, 흘린 한마디',`<p class="lede">새벽 두 시. 형사계 당직 형사가 자판기 커피를 뽑다 혼잣말처럼 흘렸다. "${esc(it.title)}… 그거 그냥 넘어갈 일이 아니야. 기자들은 아직 아무도 몰라."</p><p class="hint">수습기자에게 처음 찾아온 단독의 냄새다. 어떻게 할까?</p>`,[
   {label:'현장으로 달려간다',sub:'체력↓ · 현장에서 사실 하나를 바로 확인',fn:()=>opGive('scene',cap)},
   {label:'형사에게 한 번 더 캐묻는다',sub:'취재원 생김 · 친화력이 높을수록 더 가까워진다',fn:()=>opGive('cop',cap)},
   {label:`${cap} 선배에게 바로 보고한다`,sub:'사내 평가↑ · 캡 관계↑ · 핵심을 짚어 준다',fn:()=>opGive('cap',cap)}]);}
function opGive(how,cap){S.opScoop=3;const it=window.__opIt||makeItem(S.dept,{excl:true,mult:1.15});window.__opIt=null;it.op=1;if(how==='cop')it.src='당직 형사';
  const f=it.facts.filter(f=>!fOK(f)).sort((a,b)=>(how==='cap'?(b.key?1:0)-(a.key?1:0):(a.key?1:0)-(b.key?1:0)))[0];if(f)f.conf=f.need;
  if(how==='scene'){S.hp=clamp(S.hp-10,0,100);gain('ver',.3);}
  if(how==='cop')addSource(S.dept,25+Math.round((S.st.cha||30)/5));
  if(how==='cap'){apply({eval:1.5});const c=colBy('cap');if(c)c.rel=clamp((c.rel||0)+4,-100,100);}
  S.items.unshift(it);S.opDue=S.turn+8;log(`첫 단독의 냄새: 「${it.title}」`);
  Q.push(()=>openModal('첫 단독을 쥐었다',`<p class="lede">「${esc(it.title)}」</p><p>남은 사실을 <b>취재 나가기</b>로 확인하고 <b>기사 쓰기</b>로 내보내자. 다른 회사가 냄새를 맡기 전에, <b>두 달 안에</b> 내면 단독이다.</p><p class="hint">${how==='cap'?`${esc(cap)}: "핵심부터 확인해. 확인 안 된 건 한 줄도 쓰지 마."`:'핵심 사실(★)이 확인돼야 기사로 낼 수 있다.'}</p>`));}
// 첫 단독을 내면: 캡의 칭찬과 함께 크게 남는다. 늦으면 타사가 먼저 쓴다
function opPublished(it,clip){if(!it||!it.op||S.opDone)return;S.opDone=1;S.opDue=null;const cap=(colBy('cap')||{}).name||S.capName||'캡';const c=colBy('cap');if(c)c.rel=clamp((c.rel||0)+6,-100,100);const tx=apply({eval:3,fame:1});
  Q.push(()=>openModal('첫 단독',`<p class="lede">아침 회의에서 ${esc(cap)} 선배가 내 기사를 들고 왔다. "수습이 이걸 물어 왔다고? …잘했다. 오늘 점심은 내가 산다."</p><p>「${esc(clip.h)}」${jp(esc(clip.h),'이','가')} ${esc(clip.place||'지면')}에 실렸다. 동기들 단톡방이 조용하다.</p><p class="hint">${tx}</p>`,[{label:'다음 단독을 찾으러 간다'}]));log('첫 단독 — 캡에게 칭찬을 들었다');}
function opTick(lines){if(!S.opDue||S.opDone||S.turn<S.opDue)return;const it=S.items.find(x=>x.op);S.opDue=null;S.opDone=1;if(!it)return;S.items=S.items.filter(x=>x!==it);
  const rv=(S.rival&&S.rival.name)||'타사 동기';lines.push({c:'r',t:`${jo2(rv,'이','가')} 「${it.title}」${jo2(it.title,'을','를').slice(-1)} 먼저 썼다. 첫 단독이 물먹었다 — 다음엔 더 빨리.`});apply({eval:-.5});}

// ===== 7.3 도감 보상: 엔딩·도전·부서·이야기를 모을수록 다음 판이 넓어진다 =====
function dexPts(){const M=META||metaGet();return Object.keys(M.endings||{}).length*2+Object.keys(M.chal||{}).length*2+Object.keys(M.depts||{}).length+Object.keys(M.stories||{}).length+(M.goalsOk||0)*2;}
const DEX_MS=[[4,'유산 두 개','새 판을 시작할 때 유산을 두 개까지 고른다'],[8,'새 유산 · 발 넓은 동기','동료들과 처음부터 가까운 사이로 시작한다'],[12,'새 유산 · 단골 제보자','신뢰가 쌓인 취재원 두 명과 시작한다'],[18,'새 유산 · 데스크의 눈','검증력·문장력이 높은 채로 시작한다'],[26,'새 유산 · 전설의 선배','업계 평판과 사내 평가를 안고 시작한다']];
function dexMsHTML(){const p=dexPts();const nx=DEX_MS.find(m=>p<m[0]);return `<div class="sec">도감 보상 · 도감 점수 ${p}</div><p class="hint" style="margin:0 0 6px">엔딩·도전 과제는 2점, 거친 부서·이야기는 1점, 걸어 둔 목표 엔딩을 이루면 2점. ${nx?`다음 보상까지 ${nx[0]-p}점.`:'모든 보상을 열었다.'}</p>${DEX_MS.map(m=>`<div class="card${p>=m[0]?'':' dim'}"><div class="t">${p>=m[0]?'✓ ':'🔒 '}${esc(m[1])} <small style="color:var(--mute)">${m[0]}점</small></div><p class="hint" style="margin:2px 0 0">${esc(m[2])}</p></div>`).join('')}`;}
// 이번 판 목표 엔딩: 못 본 엔딩 하나를 걸어 두면 수첩에 가는 길이 보이고, 이루면 도감 점수가 더 붙는다
const END_HOW={'정년퇴직':'직급에 상관없이 오래 버틴다. 체력과 평가를 바닥내지 말 것','임기 만료 퇴임':'부국장 이상 간부로 올라 임기를 다 채운다','임기 만료 · 사장실의 주인':'사장에 올라 이사회 신임을 지키며 임기를 마친다','명예퇴직':'오래 일한 뒤 회사가 권하는 명예퇴직을 받아들인다','희망퇴직':'적자에 빠진 회사에서 구조조정 대상이 된다','권고사직':'사내 평가가 바닥을 오래 기면 회사가 나서 달라고 한다','퇴사':'메뉴 → 커리어 관리에서 스스로 그만둔다','자진 퇴사':'컨디션과 사기가 무너질 때 사표를 낸다','이사회 해임':'사장이 되어 이사회와 계속 맞선다'};
function endGoalPick(done){if(!S||S.dev||S.story){if(done)done();return;}const seen=Object.keys((META||metaGet()).endings||{});const pool=END_DEX.filter(e=>!seen.includes(e[0])&&(S.founder?e[1]==='found'||/파산/.test(e[0]):e[1]!=='found'&&!/창간/.test(e[0]))&&endOK43(e));
  if(!pool.length){if(done)done();return;}const L=shuffle(pool).slice(0,4);
  openModal('이번 판 목표 엔딩',`<p>아직 못 본 엔딩 하나를 목표로 걸어 둘 수 있다. 수첩에 가는 길이 보이고, 이루면 도감 점수가 더 붙는다. 걸지 않아도 된다.</p>`,L.map(e=>({label:e[0],sub:e[2],fn:()=>{S.endGoal=e[0];log(`이번 판 목표 엔딩: ${e[0]}`);toast(`목표 엔딩: ${e[0]}`);if(done)done();}})).concat([{label:'목표 없이 시작',cls:'ghost',fn:()=>{if(done)done();}}]));}
function endGoalBox(){if(!S.endGoal)return '';const e=END_DEX.find(x=>x[0]===S.endGoal);if(!e)return '';return `<div class="card"><div class="t">${ic('flag')} 이번 판 목표 엔딩 · ${esc(e[0])}</div><p class="hint" style="margin:4px 0 0">${esc(END_HOW[e[0]]||e[2])}</p></div>`;}