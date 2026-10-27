// 1.74 · 데스킹 문장을 기사 주제로 · 모바일 상태 막대·변화 표시·알림창
// 예전 파일 v71.js · v72.js를 순서 그대로 이어 붙였다

// ───── (예전 v71.js) ─────
/* 바이라인 — src/compat/v71.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.74 데스킹 다시 짓기: 초고의 모든 문장이 그 기사 이야기다 (엉뚱한 문장으로 정답이 티 나지 않게) =====
// 예전: 문제 문장·함정 문장이 아무 기사에나 들어가는 공용 문장이라 「주제와 상관없는 문장 = 정답」으로 찍을 수 있었다.
// 지금: 대상 이름·메모의 발언자·기사 주제로 문장을 짓고, 민감한 유형(미성년 실명·낙인 표현·사망자 단위)은 그 주제일 때만 나온다.
function dk71Ctx(d){const T=String(d.t||'')+' '+(d.fx||[]).map(f=>f.t).join(' ');const S0=d.subj||'해당 기관';const dn=(DEPTS[d.d]||{}).n||'';
  const t=re=>re.test(T);
  return {T,S0,pos:!!d.pos,dn,
    minor:t(/학생|청소년|학교|아동|소년|촉법|미성년|초등|중학|고교/),migrant:t(/이주|외국인|노동자|난민/),school:t(/학교|교사|교육|학부모|교실/),
    acc:t(/사고|화재|참사|붕괴|폭발|추락|침수|누출|경보기|안전/),death:t(/숨|사망|참사|유족|변사/),crime:t(/경찰|검찰|수사|혐의|피의|가해|폭행|범죄|사기|난동|절도|살인|촉법/)||/사건|법조|경찰/.test(dn),
    money:t(/예산|매출|수출|투자|보조금|횡령|피해액|억 원|만 원|억원|비용|요금|가격|배임|탈세/),product:t(/출시|제품|매출|판매|브랜드|신제품|앱|서비스/)||/경제|산업|IT|유통|재계/.test(dn),
    fest:t(/관객|공연|축제|흥행|팬|전시|관람/),health:t(/병원|환자|의료|보건|진료|백신/)};}
function dk71Who(d){const m=(d.fx||[]).map(f=>/^(.{1,16}?)\s*"/.exec(String(f.t))).find(Boolean);return m?m[1].trim():'한 관계자';}
// 대상 이름과 헷갈리기 쉬운 다른 이름 (엉뚱한 기관이 아니라 「비슷한 이름」으로 틀린다)
const NEAR71=[['시청','구청'],['구청','시청'],['군청','시청'],['경찰서','지구대'],['지구대','경찰서'],['공사','공단'],['공단','공사'],['교육지원청','교육청'],['교육청','교육지원청'],['보건소','보건지소'],['병원','의원'],['대학교병원','대학병원'],['소방서','119안전센터'],['재단','협회'],['협회','연합회'],['연합회','협회'],['센터','본부'],['본부','센터'],['위원회','협의회'],['그룹','홀딩스'],['전자','전기'],['건설','개발'],['은행','저축은행'],['구단','재단'],['조합','연합']];
function dk71Near(S0){const c=(CITIES||[]).find(x=>S0.includes(x));if(c){const o=pick(CITIES.filter(x=>x!==c));return S0.replace(c,o);}
  for(const [a,b] of NEAR71)if(S0.endsWith(a)||S0.includes(a+' '))return S0.replace(a,b);
  const w=S0.split(' ');if(w.length>=2&&CITIES&&CITIES.length)return pick(CITIES)+' '+w.slice(1).join(' ');return null;}
function dk71Flaws(d,S0,yy){const X=dk71Ctx(d),pos=X.pos,who=dk71Who(d);const sp=t=>subJ(t,'{S}',S0);const Sj=(w,a,b)=>jo2(w,a,b);
  const cm=month(),lp=y=>y%4===0&&(y%100!==0||y%400===0);const C={};
  // 1) 비슷한 이름의 다른 기관
  {const nr=dk71Near(S0);if(nr&&nr!==S0)C.org=()=>({b:{t:`${Sj(nr+' 측','은','는')} "${pos?'앞으로도 계속 노력하겠다':'사실관계를 확인 중'}"이라고 밝혔다.`,e:`취재 대상은 ${Sj(S0,'이다','다')}. 이름이 비슷한 다른 곳(${nr})을 적었다.`},g:{t:`${Sj(S0+' 측','은','는')} "${pos?'앞으로도 계속 노력하겠다':'사실관계를 확인 중'}"이라고 밝혔다.`}});}
  // 2) 있을 수 없는 날짜 — 그 기사 이야기로
  C.date=()=>{const BD=[[2,30],[2,31],[4,31],[6,31],[9,31],[11,31],[2,29]],GD=[[2,28],[1,31],[3,31],[5,31],[8,31],[10,31],[12,31],[4,30],[6,30],[9,30],[11,30],[2,29]];
    const past=pos?[(y,m,x)=>`${Sj(S0,'이','가')} 이 일을 처음 시작한 건 ${y} ${m}월 ${x}일이다.`,(y,m,x)=>`${S0}의 이 기록은 ${y} ${m}월 ${x}일 처음 세워졌다.`].concat(X.product?[(y,m,x)=>`첫 출시는 ${y} ${m}월 ${x}일이었다.`]:[])
      :[(y,m,x)=>`${S0} 관련 첫 민원은 ${y} ${m}월 ${x}일 접수됐다.`,(y,m,x)=>`${S0}에 대한 내부 감사는 ${y} ${m}월 ${x}일 시작됐다.`,(y,m,x)=>`문제가 된 ${S0}의 결재는 ${y} ${m}월 ${x}일 이뤄졌다.`];
    const fut=pos?[(y,m,x)=>`${Sj(S0,'은','는')} ${y} ${m}월 ${x}일 관련 행사를 연다.`]:[(y,m,x)=>`${Sj(S0+' 측','은','는')} ${y} ${m}월 ${x}일까지 해명 자료를 내기로 했다.`,(y,m,x)=>`${S0}에 대한 감사 결과는 ${y} ${m}월 ${x}일 발표될 예정이다.`];
    const when=md=>{if(chance(.55)){const b=pick([1,2]);return {y:yy-b,lab:b===1?'지난해':'재작년',T:past};}return md[0]>cm?{y:yy,lab:'올해',T:fut}:{y:yy+1,lab:'내년',T:fut};};
    let b,w,i=0;do{b=pick(BD);w=when(b);}while(b[0]===2&&b[1]===29&&lp(w.y)&&i++<20);let g,v,j=0;do{g=pick(GD);v=when(g);}while(g[0]===2&&g[1]===29&&!lp(v.y)&&j++<20);
    return {b:{t:pick(w.T)(w.lab,b[0],b[1]),e:b[0]===2&&b[1]===29?`${w.lab}(${w.y}년)는 윤년이 아니다. 2월 29일이 없다.`:`${b[0]}월에는 ${b[1]}일이 없다.`},g:{t:pick(v.T)(v.lab,g[0],g[1])}};};
  // 3) 틀린 계산 — 그 기사에 맞는 숫자로
  C.calc=()=>{const nn=pos?(X.fest?['관객','만 명']:X.product?['매출','억 원']:X.health?['이용 환자','명']:['이용자','명']):(X.crime?['관련 신고','건']:X.acc?['관련 사고','건']:X.money?['관련 예산 집행 오류','건']:['관련 민원','건']);
    const [nm,u]=nn;const k=pick(['pct','dbl','sum','half']);const subj=`${S0} ${nm}`;
    if(k==='pct'){const a=R(4,9)*10,b=a+a/2;return {b:{t:`${Sj(subj,'은','는')} 지난해 ${a}${u}에서 올해 ${b}${jo2(u,'으로','로')} ${chance(.5)?a/2:150}% 늘었다.`,e:`${a}에서 ${b}면 50% 증가다.`},g:{t:`${Sj(subj,'은','는')} 지난해 ${a}${u}에서 올해 ${b}${jo2(u,'으로','로')} 50% 늘었다.`}};}
    if(k==='dbl'){const a=R(3,9)*20;return {b:{t:`${Sj(subj,'은','는')} 1년 새 ${a}${u}에서 ${a*1.5}${jo2(u,'으로','로')} 두 배가 됐다.`,e:`${a}에서 ${jo2(a*1.5,'은','는')} 1.5배다. "두 배"는 과장.`},g:{t:`${Sj(subj,'은','는')} 1년 새 ${a}${u}에서 ${a*2}${jo2(u,'으로','로')} 두 배가 됐다.`}};}
    if(k==='sum'){const x=R(30,90),y=R(20,70);const [p,q]=pos?['상반기','하반기']:['본사','지점'];return {b:{t:`${Sj(subj,'은','는')} ${p} ${x}${u}, ${q} ${y}${jo2(u,'으로','로')} 모두 ${x+y+R(1,3)*10}${u}이다.`,e:`${x}${jo2(String(x),'과','와').slice(String(x).length)} ${y}${jo2(String(y),'을','를').slice(String(y).length)} 더하면 ${x+y}다. 합계가 틀렸다.`},g:{t:`${Sj(subj,'은','는')} ${p} ${x}${u}, ${q} ${y}${jo2(u,'으로','로')} 모두 ${x+y}${u}이다.`}};}
    const a=R(5,12)*20;return {b:{t:`${Sj(subj,'은','는')} 3년 전 ${a}${u}에서 올해 ${Math.round(a*.7)}${jo2(u,'으로','로')} 절반이 됐다.`,e:`${a}에서 ${Math.round(a*.7)}이면 30% 줄어든 것이다. "절반"은 과장.`},g:{t:`${Sj(subj,'은','는')} 3년 전 ${a}${u}에서 올해 ${a/2}${jo2(u,'으로','로')} 절반이 됐다.`}};};
  // 4) 근거 없는 과장 — 그 기사에 대해
  C.hype=()=>{const P=pos?[[`이번 일로 ${S0}의 이름은 전국에 알려지게 됐다.`,'확인되지 않은 파급을 단정했다.'],[`${jo2(S0,'을','를')} 아는 사람 모두가 이번 일을 반기고 있다.`,'몇 명에게 물었는지 없이 "모두"로 일반화했다.'],[`전문가들은 한목소리로 ${S0}의 사례를 극찬했다.`,'어떤 전문가가 몇 명인지 없다. 익명의 다수로 뭉뚱그렸다.']]
      :[[`이번 ${S0} 사태는 사상 최악의 일로 기록될 전망이다.`,'무엇과 비교한 "사상 최악"인지 근거가 없다.'],[`${S0} 주변 사람 모두가 분노하고 있다.`,'몇 명을 만났는지 없이 "모두"로 일반화했다.'],[`전문가들은 한목소리로 ${S0}의 책임을 지적했다.`,'어떤 전문가가 몇 명인지 없다.'],[`${S0}에서 벌어진 일은 전국 어디서나 벌어지고 있다.`,'다른 지역 사례를 하나도 확인하지 않은 일반화.']];
    const G=pos?[`취재팀이 만난 ${S0} 주변 사람 ${R(5,12)}명 가운데 대부분이 반가워했다.`,`${pick(['사회학','행정학','경영학'])} 교수 두 명은 "${S0}의 사례는 눈여겨볼 만하다"고 말했다.`]
      :[`${S0} 관련 신고는 집계를 시작한 2015년 이후 가장 많다고 ${Sj(pick(['관계 당국','감독 당국']),'은','는')} 밝혔다.`,`취재팀이 만난 ${S0} 관계자 ${R(5,12)}명 가운데 대부분이 같은 문제를 지적했다.`,`${pick(['법학','행정학','회계학'])} 교수 두 명은 "${S0}의 관리 체계를 다시 봐야 한다"고 입을 모았다.`];
    const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};};
  // 5) 비약·단정
  C.jump=()=>{const P=pos?[[`${Sj(S0,'은','는')} 이번 일로 앞으로 더 큰 성과를 낼 것이 확실하다.`,'미래를 단정했다. 전망은 근거와 출처를 붙여야 한다.'],[`다른 곳들도 결국 ${S0}의 방식을 따라 할 수밖에 없다.`,'확인하지 않은 비약.']]
      :[[`${Sj(S0+' 측','은','는')} 공식적으로 침묵하고 있지만 사실상 의혹을 인정한 것이다.`,'침묵을 인정으로 해석했다. 기자의 비약.'],[`${S0} 측의 해명은 거짓말로 보인다.`,'기자의 판단을 사실처럼 썼다.'],[`${S0} 측이 답을 피한 것 자체가 의혹을 뒷받침한다.`,'답변 회피를 증거로 삼았다. 논리 비약.']].concat(X.crime?[[`조사를 받은 ${S0} 담당자 이모(${R(41,58)})씨가 사실상 이번 일의 주범이다.`,'수사 단계에서 유죄를 단정했다. 무죄 추정 원칙 위반.']]:[]);
    const G=pos?[`${Sj(S0+' 측','은','는')} "아직 갈 길이 멀다"고 말했다.`,`${S0}의 방식이 다른 곳에서도 통할지는 지켜봐야 한다는 의견도 있다.`]
      :[`${Sj(S0+' 측','은','는')} "사실과 다르다"며 법적 대응을 검토하겠다고 밝혔다.`,`${Sj(S0+' 측','은','는')} 본지의 질의에 답하지 않았다.`].concat(X.crime?[`경찰은 ${S0} 담당자 이모(${R(41,58)})씨를 불러 사실관계를 조사하고 있다.`]:[]);
    const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};};
  // 6) 제보자 노출 (비판 기사만)
  if(!pos)C.expose=()=>{const P=[[`제보자 D씨는 ${S0}에서 3년째 ${pick(['총무 일을','회계 일을','시설 관리를','실무를'])} 맡고 있다.`,'근무 기간과 업무로 제보자가 특정된다.'],[`제보자는 ${S0} ${pick(['총무팀','회계팀','민원팀'])}의 유일한 ${R(2,5)}년 차 직원이다.`,'"유일한 ○년 차"면 누군지 다 안다. 제보자 노출.'],[`제보 문자는 ${S0} 내부 메신저 계정으로 발송됐다.`,'발송 경로가 드러나면 제보자를 역추적할 수 있다.']];
    const G=[`제보자 A씨는 신원 노출을 우려해 익명을 요청했다.`,`본지는 제보자 보호를 위해 ${S0} 내부 사정 일부를 바꿔 적었다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};};
  // 7) 맞춤법 — 그 기사 문장 속에서
  {const SP=pos?[[`${S0} 직원들은 오랫만에 활짝 웃었다.`,`${S0} 직원들은 오랜만에 활짝 웃었다.`,'"오랫만"이 아니라 "오랜만"이다.'],[`${jo2(who,'은','는')} "앞으로가 더 기대가 되요"라고 말했다.`,`${jo2(who,'은','는')} "앞으로가 더 기대가 돼요"라고 말했다.`,'"되요"가 아니라 "돼요"다.'],[`소식은 금새 ${S0} 주변에 퍼졌다.`,`소식은 금세 ${S0} 주변에 퍼졌다.`,'"금새"가 아니라 "금세"다.'],[`몇일째 ${S0}에 문의가 이어졌다.`,`며칠째 ${S0}에 문의가 이어졌다.`,'"몇일"은 없는 말. "며칠"이 맞다.'],[`${Sj(S0,'이','가')} 제 역활을 톡톡히 했다는 평가다.`,`${Sj(S0,'이','가')} 제 역할을 톡톡히 했다는 평가다.`,'"역활"이 아니라 "역할"이다.']]
      :[[`${jo2(who,'은','는')} "이제 어떻해요"라며 한숨을 쉬었다.`,`${jo2(who,'은','는')} "이제 어떡해요"라며 한숨을 쉬었다.`,'"어떻해요"는 틀린 표기. "어떡해요"가 맞다.'],[`관계자들은 몇일째 ${S0} 측의 답을 기다리고 있다.`,`관계자들은 며칠째 ${S0} 측의 답을 기다리고 있다.`,'"몇일"은 없는 말. "며칠"이 맞다.'],[`${S0} 안팎에선 소문이 금새 퍼졌다.`,`${S0} 안팎에선 소문이 금세 퍼졌다.`,'"금새"가 아니라 "금세"다.'],[`${S0} 담당자가 서류를 일일히 다시 확인했다.`,`${S0} 담당자가 서류를 일일이 다시 확인했다.`,'"일일히"가 아니라 "일일이"다.'],[`${Sj(S0,'이','가')} 제 역활을 하지 못했다는 지적이다.`,`${Sj(S0,'이','가')} 제 역할을 하지 못했다는 지적이다.`,'"역활"이 아니라 "역할"이다.'],[`${S0} 측은 "서류만 내면 되요"라고 안내했다.`,`${S0} 측은 "서류만 내면 돼요"라고 안내했다.`,'"되요"가 아니라 "돼요"(되어요)다.'],[`${S0} 주변 주민들의 바램은 하나였다.`,`${S0} 주변 주민들의 바람은 하나였다.`,'"바램"은 색이 바래는 것. 소망은 "바람"이다.'],[`${jo2(who,'은','는')} "어의가 없다"고 했다.`,`${jo2(who,'은','는')} "어이가 없다"고 했다.`,'"어의"는 임금의 의사다. "어이없다"가 맞다.']];
    C.spell=()=>{const L=shuffle(SP.slice());return {b:{t:L[0][0],e:L[0][2]},g:{t:L[1][1]}};};}
  // 8) 겹말 — 그 기사 문장 속에서
  {const X0=String(R(2,9)*10);const DP=pos?[[`${S0}의 올해 매출은 약 ${X0}여억 원으로 집계됐다.`,`${S0}의 올해 매출은 약 ${X0}억 원으로 집계됐다.`,'"약"과 "여"를 겹쳐 썼다.'],[`${S0} 측은 행사를 사전에 미리 알렸다.`,`${S0} 측은 행사를 미리 알렸다.`,'"사전에 미리"는 겹말.'],[`${S0} 측은 "향후 앞으로 더 투자하겠다"고 했다.`,`${S0} 측은 "앞으로 더 투자하겠다"고 했다.`,'"향후"가 곧 "앞으로"다.'],[`${S0} 이용자 과반수 이상이 다시 찾겠다고 답했다.`,`${S0} 이용자 과반이 다시 찾겠다고 답했다.`,'"과반수 이상"은 겹말.']]
      :[[`${S0} 관련 피해액은 약 ${X0}여억 원으로 추산된다.`,`${S0} 관련 피해액은 약 ${X0}억 원으로 추산된다.`,'"약"과 "여"를 겹쳐 썼다.'],[`${S0}에서 같은 문제가 다시 재발할 우려가 크다.`,`${S0}에서 같은 문제가 재발할 우려가 크다.`,'"다시 재발"은 겹말.'],[`${S0} 측은 일정을 사전에 미리 공지하지 않았다.`,`${S0} 측은 일정을 미리 공지하지 않았다.`,'"사전에 미리"는 겹말.'],[`${S0} 측은 "향후 앞으로 개선하겠다"고 했다.`,`${S0} 측은 "앞으로 개선하겠다"고 했다.`,'"향후"가 곧 "앞으로"다.']];
    C.dup=()=>{const L=shuffle(DP.slice());return {b:{t:L[0][0],e:L[0][2]},g:{t:L[1][1]}};};}
  // 9) 조간 시제
  C.tense=()=>{const dd=R(2,27);const P=(X.acc&&!pos)?[['사고는 오늘 새벽 4시쯤 일어났다.','조간은 다음 날 아침에 읽힌다. "오늘"이 아니라 날짜로 써야 한다.',`사고는 ${dd}일 새벽 4시쯤 일어났다.`]]:[];P.push([`${Sj(S0,'은','는')} 내일 오전 공식 입장을 낸다.`,'지면이 나가는 날 기준으로 "내일"은 틀린다. 날짜로 쓴다.',`${Sj(S0,'은','는')} ${dd}일 오전 공식 입장을 낸다.`]);const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:p[2]}};};
  // 10) 신상 노출 — 미성년·사망·피해자 기사일 때만
  if(!pos&&(X.minor||X.death||X.crime||X.acc))C.anon=()=>{const n=rname(),a=R(13,17);const P=[];
    if(X.minor)P.push([`${X.crime?'가해':'피해'} 학생 ${n}(${a})${jo2(chance(.5)?'군':'양','은','는')} ${X.crime?'경찰 조사에서 혐의를 부인했다':'아직 충격에서 벗어나지 못했다'}.`,`미성년자의 실명을 썼다. 소년법·보도 준칙 위반.`,`${X.crime?'가해':'피해'} 학생 A(${a})${jo2(chance(.5)?'군':'양','은','는')} ${X.crime?'경찰 조사에서 혐의를 부인했다':'아직 충격에서 벗어나지 못했다'}.`]);
    if(X.death)P.push([`숨진 ${n}(${R(20,60)})씨의 유족은 오열했다.`,'유족 동의 없이 사망자 실명을 썼다.',`숨진 B씨의 유족은 "다시는 이런 일이 없길 바란다"고 말했다.`]);
    if(X.crime||X.acc)P.push([`피해자 ${n.slice(0,1)}모(${R(30,60)})씨가 사는 ${pick(CITIES)} ${pick(['한빛','누리','가람'])}아파트 ${R(101,112)}동 주민들은 불안해했다.`,'동 단위로 피해자 거주지가 특정된다.',`피해자 B씨는 "다시는 이런 일이 없길 바란다"고 말했다.`]);
    const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:p[2]}};};
  // 11) 낙인 표현 — 그 주제일 때만
  {const P=[];if(X.minor||X.school)P.push(['피해 아동은 결손가정에서 자랐다.','"결손가정"은 낙인 표현. "한부모 가정" 등으로 쓴다.','피해 아동은 한부모 가정에서 자랐다.']);if(X.migrant)P.push(['불법체류자 김모씨는 단속을 피해 달아났다.','"불법체류자"는 낙인 표현. "미등록 이주민"으로 쓴다.','미등록 이주민 김모씨는 단속을 피해 달아났다.']);if(X.school)P.push([`${S0} 여교사 박모씨는 학부모들에게 사과했다.`,'성별을 붙일 이유가 없다. "교사"로 충분하다.',`${S0} 교사 박모씨는 학부모들에게 사과했다.`]);if(X.crime&&!pos)P.push(['범인은 평소 정신병자처럼 행동했다는 증언이 나왔다.','정신질환 혐오 표현. 기사에 쓸 수 없다.','범인은 평소 주변과 자주 다퉜다는 증언이 나왔다.']);
    if(P.length)C.label=()=>{const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:p[2]}};};}
  // 12) 단위 — 돈·인명 기사일 때만
  if(X.money||X.death||(pos&&(X.fest||X.product))){C.unit=()=>{const a=R(12,95);const P=[];
    if(!pos&&X.death&&X.acc)P.push([`이번 사고로 ${a}만 명이 숨졌다.`,`메모에는 사망자 수가 ${a}명이다. "만"이 붙었다.`,`이번 사고로 ${a}명이 숨졌다.`]);
    if(!pos&&X.money&&!/정부|국가|그룹|부처|청와대/.test(S0))P.push([`${S0} 관련 피해액은 ${a}조 원으로 추산된다.`,`${S0} 규모에서 피해액이 ${a}조 원일 수 없다. 억과 조를 헷갈렸다.`,`${S0} 관련 피해액은 ${a}억 원으로 추산된다.`]);
    if(pos&&X.fest)P.push([`행사에는 ${a}만 명이 몰렸고, 객석 ${a*10}석은 모두 찼다.`,`${a}만 명과 객석 ${a*10}석이 맞지 않는다. 단위가 틀렸다.`,`행사에는 ${a*10}명이 몰렸고, 객석 ${a*10}석은 모두 찼다.`]);
    if(pos&&X.product)P.push([`${S0}의 올해 수출액은 ${a}조 달러로 집계됐다.`,`${a}조 달러는 나라 전체 수출보다 크다. "억 달러"를 잘못 적었다.`,`${S0}의 올해 수출액은 ${a}억 달러로 집계됐다.`]);
    if(!P.length)P.push([`${S0} 관련 예산은 ${a}조 원 규모다.`,`${S0} 한 곳의 예산이 ${a}조 원일 수 없다. 억과 조를 헷갈렸다.`,`${S0} 관련 예산은 ${a}억 원 규모다.`]);const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:p[2]}};};}
  // 13) 반론 없이 결론 (비판 기사)
  if(!pos)C.oneside=()=>{const P=[[`${S0} 측의 해명은 듣지 않았지만 의혹은 사실로 보인다.`,'반론을 받지 않고 결론을 냈다.'],[`익명 게시판의 글 ${R(3,9)}건을 보면 ${S0}의 문제는 분명하다.`,'확인할 수 없는 게시글을 근거로 단정했다.']];const G=[`본지는 ${S0} 측에 사흘에 걸쳐 세 차례 해명을 요청했다.`,`${Sj(S0+' 측','은','는')} 서면 답변에서 "내부 규정에 따랐다"고 밝혔다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};};
  // 14) 호재 기사: 보도자료 베끼기 · 불리한 사실 빼기
  const orgish=X.product||X.fest||/(재단|병원|센터|그룹|회사|기업|전자|은행|협회|구단|시청|구청|군청|공사|공단|학교|대학|극장|박물관|미술관|도서관|시장|조합|사|원)$/.test(S0);
  if(pos&&orgish){C.copy=()=>{const P=[[`${Sj(S0,'은','는')} 업계 최고 수준의 혁신으로 고객 만족을 극대화했다.`,'보도자료 문구를 그대로 옮겼다. 검증되지 않은 회사 주장.'],[`지금 바로 ${jo2(S0,'을','를')} 찾아 혜택을 누려 보자.`,'기사에 판촉 문구가 들어갔다.']];const G=[`${Sj(S0,'은','는')} 이 방식으로 비용을 ${R(5,18)}% 줄였다고 밝혔다.`,`다만 "효과를 판단하기엔 이르다"는 신중론도 나온다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};};
  }if(pos){C.omit=()=>{const P=[[`${S0}의 성과는 모든 분야에서 고르게 좋아졌다.`,'메모에는 부진한 부분도 있다. 불리한 사실을 빼고 "모든 분야"로 썼다.'],[`${S0}의 이번 일에 대한 우려의 목소리는 찾아볼 수 없다.`,'반대 의견을 확인하지 않고 "없다"고 단정했다.']];const G=[`다만 ${S0}의 일부 사업은 ${R(3,12)}% 뒷걸음질했다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};};}
  return C;}
// 원래 deskFlaws의 흐름(메모 숫자·인용 바꾸기 + 고르기)은 그대로, 문장 풀만 새로
{const _df71=deskFlaws;deskFlaws=function(d,nb,ndec){try{const S0=d.subj||'해당 기관';const fx=d.fx||[];const yy=2027+Math.floor((S&&S.turn||0)/YW);const B=[],D=[];
  const NRE=/\d+(?![\d,.])(?!\s*대)/;const nf=fx.find(f=>f.k==='n'&&NRE.test(f.t));
  const wq=fx.map(f=>{const m=/^(.{0,16}?)\s*"([^"]{2,40})"\s*$/.exec(String(f.t).replace(/\s*(확인|입수|존재|확보)$/,''));return m?{f,who:m[1].trim()||'한 관계자',q:m[2]}:null;}).find(Boolean);
  const C=dk71Flaws(d,S0,yy);
  if(nf)C.num=()=>{const tm=/\d+\s*(개월|년|일|세|시간|주|분|차|회)/.test(nf.t);const bad=nf.t.replace(NRE,m=>String(tm?(+m+R(2,9)):pick([+m*10,Math.max(1,Math.round(+m/10))||+m+R(3,9)])));return {b:{t:deskFactSent({t:bad,k:'n'}),e:`취재 메모에는 "${nf.t}"${ro2(nf.t).slice(nf.t.length)} 적혀 있다. 숫자를 옮겨 적다 틀렸다.`,src:nf.t},g:null};};
  if(wq)C.quote=()=>{if(chance(.5)){const o=pick(DESK_WHO.filter(x=>x!==wq.who));return {b:{t:deskFactSent({t:`${o} "${wq.q}"`,k:'w'}),e:`메모상 이 말을 한 사람은 ${jo2(wq.who,'이다','다')}. 발언자를 바꿔 적었다.`,src:wq.f.t},g:null};}
    const alt=pick((HEAD_Q[d.d]||HEAD_Q.soc).filter(x=>x!==wq.q));return {b:{t:deskFactSent({t:`${wq.who} "${alt}"`,k:'w'}),e:`메모에 적힌 발언은 따로 있다 — "${wq.q}". 직접 인용은 한 글자도 바꾸면 안 된다.`,src:wq.f.t},g:null};};
  const ks=shuffle(Object.keys(C));if(nf&&chance(.35)){ks.splice(ks.indexOf('num'),1);ks.unshift('num');}
  const used=ks.slice(0,nb);used.forEach(k=>{B.push(C[k]().b);});
  // 함정(틀려 보이지만 맞는 문장): 문제로 쓴 유형의 「맞는 짝」을 먼저 — 같은 유형끼리 비교하게 한다
  const dk=used.filter(k=>k!=='num'&&k!=='quote').concat(shuffle(ks.slice(nb))).filter(k=>k!=='num'&&k!=='quote');
  for(const k of dk){if(D.length>=Math.max(ndec,Math.min(2,nb)))break;const r=C[k]();if(r.g&&!B.some(x=>x.t===r.g.t)&&!D.some(x=>x.t===r.g.t))D.push(r.g);}
  return {B,D};}catch(e){console.error(e);return _df71.apply(this,arguments);}};}
// 제목: 넷 다 그 기사에 붙을 법한 제목으로 (「세계 1위 눈앞」 같은 엉뚱한 보기 없이)
{const _dh71=deskHeads;deskHeads=function(d){const r=_dh71.apply(this,arguments);try{const S0=(d.subj||'당국').replace(/ 측$/,'');const T=d.t;
  const H=d.pos?{hype:['{T}…모두가 놀란 이유','{T}, 그 뒤에 숨은 이야기','"이런 곳이 있었다니" {T}','{T}…비결은?'],dull:['{T}…관계자 "꾸준히 하겠다"','{S}, {T} 화제','{T} 소식'],over:['{T}…업계 판도 바꿨다','{T}…경쟁 상대 모두 제쳤다','{T}…"새 기준" 됐다','{T}…전국으로 퍼질 듯']}
    :{hype:['{T}…알고 보니','{T}, 이대로 괜찮나','"설마 했는데" {T}','{T}…무슨 일이','{T}…불똥 어디로'],dull:['{T} 관련 의혹 제기','{T}…사실관계 확인 중','{T} 지적…개선 과제로','{T}…관계 당국 "검토"'],over:['{T}…결국 사실로 판명','{T}…책임자 처벌 불가피','{T}…"윗선 지시" 확인','{T}…{S} 조직적 은폐']};
  const f=x=>subJ(x.replace(/\{T\}/g,T),'{S}',S0).replace(/\{S\}/g,S0);H.dull=H.dull.filter(x=>!(x.includes('{S}')&&T.includes(S0)));r.hype=f(pick(H.hype));r.dull=f(pick(H.dull));r.over=f(pick(H.over));if(r.dull===r.good)r.dull=f(H.dull[0]);}catch(e){}return r;};}

// ───── (예전 v72.js) ─────
/* 바이라인 — src/compat/v72.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.74 모바일: 상태가 늘 보이고, 고른 결과가 숫자로 와닿게 · 알림창은 짧게, 탭하면 닫힌다 =====
const MOB72=()=>{try{return matchMedia('(max-width:720px)').matches;}catch(e){return false;}};
(function(){try{const st=document.createElement('style');st.textContent=`
#st72{display:none}
@media (max-width:720px){
 body.st72on #st72{display:flex;position:fixed;left:0;right:0;top:0;z-index:58;gap:4px;justify-content:space-between;align-items:stretch;padding:calc(env(safe-area-inset-top) + 4px) 8px 4px;background:linear-gradient(180deg,rgba(10,14,22,.97),rgba(10,14,22,.9));backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);border-bottom:1px solid rgba(255,255,255,.08)}
 body.st72on .wrap{padding-top:44px}
 #st72 .s{flex:1;min-width:0;position:relative;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:2px 0;border-radius:9px;background:rgba(255,255,255,.04)}
 #st72 .s i{font-style:normal;font-size:10px;opacity:.65;line-height:1.1;white-space:nowrap}
 #st72 .s b{font-size:14px;line-height:1.15;font-variant-numeric:tabular-nums;white-space:nowrap}
 #st72 .s.up{animation:up72 1.4s ease}#st72 .s.dn{animation:dn72 1.4s ease}
 #st72 .s em{position:absolute;right:2px;top:-2px;font-style:normal;font-size:10.5px;font-weight:700;padding:0 4px;border-radius:7px;opacity:0;transform:translateY(4px);transition:opacity .2s,transform .2s;pointer-events:none}
 #st72 .s em.on{opacity:1;transform:translateY(0)}#st72 .s em.p{background:#1f6b4a;color:#c9ffe4}#st72 .s em.m{background:#7a2730;color:#ffd6db}
 #toast{top:auto!important;bottom:calc(env(safe-area-inset-bottom) + 132px)!important;left:10px!important;right:10px!important;width:auto!important;max-width:none!important;transform:none!important;font-size:13.5px!important;line-height:1.4!important;padding:9px 12px!important;pointer-events:none;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
 body.st72on #cards{top:calc(env(safe-area-inset-top) + 48px)!important}
 #cards .rcard{max-height:132px!important}#cards .rcard .rb{display:-webkit-box;-webkit-line-clamp:4;-webkit-box-orient:vertical;overflow:hidden}
 #cards .rcard:nth-child(n+2){display:none!important}
 .mis.c72>:not(.mish){display:none!important}.mis .mish{cursor:pointer}.mis .mish:after{content:'▾';margin-left:6px;opacity:.6}.mis.c72 .mish:after{content:'▸'}
}
@keyframes up72{0%{background:rgba(90,212,155,.45)}100%{background:rgba(255,255,255,.04)}}
@keyframes dn72{0%{background:rgba(255,107,122,.45)}100%{background:rgba(255,255,255,.04)}}
.rings>div{position:relative}.rings em.d72{position:absolute;top:-6px;right:-4px;font-style:normal;font-size:11px;font-weight:700;padding:1px 5px;border-radius:8px;pointer-events:none;animation:pop72 1.8s ease forwards}
.rings em.d72.p{background:#1f6b4a;color:#c9ffe4}.rings em.d72.m{background:#7a2730;color:#ffd6db}
@keyframes pop72{0%{opacity:0;transform:translateY(6px)}12%{opacity:1;transform:translateY(0)}80%{opacity:1}100%{opacity:0;transform:translateY(-6px)}}`;document.head.appendChild(st);}catch(e){}})();
// ---- 상단 상태 막대 ----
const ST72=[['eval',()=>S.founder?(S.investor?'투자자':'구성원'):S.rank===7?'이사회':'평가',v=>Math.round(v)],['fame',()=>'평판',v=>Math.round(v)],['trust',()=>'신뢰',v=>Math.round(v)],['hp',()=>'컨디션',v=>Math.round(v)],['ap',()=>'행동력',v=>Math.round(v)],['money',()=>'통장',v=>Math.abs(v)>=10000?(v/10000).toFixed(1)+'억':Math.round(v)+'만']];
let ST72P=null;
function st72El(){let el=document.getElementById('st72');if(!el){el=document.createElement('div');el.id='st72';el.setAttribute('aria-label','내 상태');el.innerHTML=ST72.map(([k])=>`<div class="s" data-k="${k}"><i></i><b></b><em></em></div>`).join('');document.body.appendChild(el);}return el;}
function st72(){try{const on=!!(S&&S.phase==='game'&&!S.story0);document.body.classList.toggle('st72on',on);if(!on){ST72P=null;return;}const el=st72El();const cur={};
  ST72.forEach(([k,lab,fmt])=>{const v=+S[k]||0;cur[k]=v;const c=el.querySelector(`[data-k="${k}"]`);if(!c)return;c.querySelector('i').textContent=lab();c.querySelector('b').textContent=fmt(v);
    if(ST72P&&ST72P.s===S){const d=v-ST72P[k];const th=k==='money'?1:k==='ap'?.5:.05;
      if(Math.abs(d)>=th&&!(k==='ap'&&ST72P.turn!==S.turn)){const em=c.querySelector('em');const up=d>0;em.className=(up?'p':'m')+' on';em.textContent=(up?'+':'−')+(k==='money'?(Math.abs(d)>=10000?(Math.abs(d)/10000).toFixed(1)+'억':Math.round(Math.abs(d))):k==='ap'?Math.round(Math.abs(d)):Math.abs(d)>=9.95?Math.round(Math.abs(d)):Math.abs(d).toFixed(1));
        c.classList.remove('up','dn');void c.offsetWidth;c.classList.add(up?'up':'dn');clearTimeout(em._t);em._t=setTimeout(()=>{em.classList.remove('on');},1900);ringPop72(k,d);}}});
  cur.turn=S.turn;cur.s=S;ST72P=cur;}catch(e){}}
// 넓은 화면: 상황판 고리에 같은 변화 표시
function ringPop72(k,d){try{if(MOB72()||!['eval','fame','trust','hp'].includes(k))return;const r=document.querySelector(`.rings [data-ev="${k}"]`);if(!r)return;const em=document.createElement('em');em.className='d72 '+(d>0?'p':'m');em.textContent=(d>0?'+':'−')+(Math.abs(d)>=10?Math.round(Math.abs(d)):Math.abs(d).toFixed(1));r.appendChild(em);setTimeout(()=>em.remove(),1900);}catch(e){}}
let ST72R=0;function st72Soon(){if(ST72R)return;ST72R=requestAnimationFrame(()=>{ST72R=0;st72();mis72();});}
{const _rd72=render;render=function(){const r=_rd72.apply(this,arguments);st72Soon();return r;};}
{const _om72=openModal;openModal=function(){const r=_om72.apply(this,arguments);st72Soon();try{if(MOB72()){const t=document.getElementById('toast');if(t&&!t.hidden&&performance.now()-(T72.t||0)>350)t.hidden=true;}}catch(e){}return r;};}
// ---- 알림창: 짧게 · 아무 데나 탭하면 닫힌다 (모바일은 위쪽 한 줄 띠로) ----
const T72={t:0};
{const _to72=toast;toast=function(t){const r=_to72.apply(this,arguments);try{T72.t=performance.now();st72Soon();const el=document.getElementById('toast');if(el&&!el.hidden){clearTimeout(toastT);const n=String(t||'').length;toastT=setTimeout(()=>{el.hidden=true;},MOB72()?Math.min(2800,1300+n*18):Math.min(3800,1800+n*22));}}catch(e){}return r;};}
document.addEventListener('pointerdown',()=>{try{const el=document.getElementById('toast');if(el&&!el.hidden&&performance.now()-T72.t>250){el.hidden=true;clearTimeout(toastT);}}catch(e){}},true);
// ---- 이달의 미션: 모바일에선 접어 둔다 (처음 석 달은 펼쳐 둠 · 머리를 탭하면 펼침/접힘) ----
function mis72Pref(){try{const v=localStorage.getItem('byline-mis72');return v==null?null:v==='1';}catch(e){return null;}}
function mis72(){try{if(!MOB72()||!S||S.phase!=='game')return;const pref=mis72Pref();const col=pref==null?S.turn>=12:pref;
  document.querySelectorAll('.mis').forEach(m=>{m.classList.toggle('c72',col);const h=m.querySelector('.mish');if(h&&!h._c72){h._c72=1;h.addEventListener('click',ev=>{if(ev.target.closest('button,a'))return;const now=!m.classList.contains('c72');try{localStorage.setItem('byline-mis72',now?'1':'0');}catch(e){}document.querySelectorAll('.mis').forEach(x=>x.classList.toggle('c72',now));});}});}catch(e){}}
addEventListener('resize',()=>{st72Soon();});

// ---- 결과 카드: 모바일에선 한 장만 · 3~5초 뒤 저절로 · 카드나 화면 아무 데나 탭하면 닫힌다 ----
function card72Go(el){if(!el||!el.isConnected||el.classList.contains('out'))return;el.classList.add('out');setTimeout(()=>{try{el.remove();}catch(e){}},260);}
{const _sc72=showCard;showCard=function(t,b,c){const r=_sc72.apply(this,arguments);try{if(MOB72()){const box=document.getElementById('cards');const el=box&&box.firstElementChild;if(el){el._t72=performance.now();[...box.children].slice(1).forEach(card72Go);const n=(el.textContent||'').length;clearTimeout(el._k72);el._k72=setTimeout(()=>card72Go(el),Math.min(5200,2800+n*10));el.addEventListener('click',ev=>{if(ev.target.closest('button:not(.rx),a,input'))return;card72Go(el);});}}}catch(e){}return r;};}
document.addEventListener('pointerdown',ev=>{try{if(!MOB72())return;const box=document.getElementById('cards');if(!box||!box.children.length)return;if(ev.target.closest&&ev.target.closest('#cards'))return;[...box.children].forEach(el=>{if(performance.now()-(el._t72||0)>500)card72Go(el);});}catch(e){}},true);
