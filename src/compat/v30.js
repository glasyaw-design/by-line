/* 바이라인 — src/compat/v30.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.4 수습 기간 3개월로 통일 (간소화 2개월) =====
try{RANKS[0].min=12;}catch(e){}
rookieWeeks=function(o){return S&&S.simple?8:12;};
// 기간이 짧아진 만큼 평가 문턱을 조금 낮춘다 (큰 곳일수록 여전히 높다)
rookieEv=function(o){o=o||OUT();return Math.round(({1:38,2:40,3:42,4:45,5:48}[o.p]||42)+(DF().need||0)/2);};
// ===== 수습 인건비 바로잡기 =====
// 예전: 수습이 있는 달마다 인건비 할인이 누적돼, 회사 고정비가 영영 줄어들었다.
// 이제: 수습 기간엔 채용 때 잡힌 할인(약 600만)만 적용, 정식 발령·탈락 때 정상 인건비로 되돌린다.
// AI 멘토링: 같은 부서에 실력 65 이상 선배가 있으면 수습이 더 빨리 크고 덜 떨어진다.
{const _rk=rkMonth;rkMonth=function(lines){const c=S.co;const e0=c?(c.extra||0):0;const before=rkActive();
  // 멘토 효과 (졸업 판정 전에)
  before.forEach(m=>{const men=(S.team||[]).find(x=>x!==m&&x.rk==null&&x.d===m.d&&(x.skill||0)>=65);if(men){m.skill=(m.skill||20)+.6;m._men=men.name;if(!m._menT&&lines){m._menT=1;lines.push({c:'g',t:`${men.name} 선배가 ${m.name} 수습을 붙잡고 가르친다 — 수습이 빨리 큰다`});}}});
  _rk(lines);
  if(!c)return;c.extra=e0;
  const back=-hireCostD('new',{yrs:0});const gone=before.filter(m=>m.rk==null||!(S.team||[]).includes(m));
  if(gone.length&&back>0)c.extra=+(e0+back*gone.length).toFixed(3);};}
// ===== AI 캡 코칭: 수습 기간에 남은 시간 대비 모자란 기준을 콕 집어 준다 =====
function capCoach(){if(S.rank!==0||S.story||S.founder||S.phase!=='game')return null;const wk=rookieWeeks();const left=wk-S.inRank;if(left<=0||left>wk-2)return null;
  const L=rookieReqs();const miss=L.filter(x=>!x.ok);if(!miss.length)return {c:'g',t:`${S.capName||'캡'} 캡: "기준은 다 채웠다. 남은 ${jo2(moTxt(left),'은','는')} 단서나 더 물어 와."`};
  const frac=S.inRank/wk;const lag=miss.map(x=>{const m=/(\d+)\/(\d+)/.exec(x.t);const r=m?(+m[1])/Math.max(1,+m[2]):0;return {x,r};}).sort((a,b)=>a.r-b.r)[0];
  if(!lag||lag.r>=frac)return null;const nm=lag.x.t.replace(/\s*[\d.]+\/[\d.]+.*$/,'').replace(/\(.*\)/,'').trim();
  const tip=/정보보고/.test(nm)?'정보보고를 더 올려':/평가/.test(nm)?'단독 단서 하나라도 물어 와':/캡과의 관계/.test(nm)?'술자리라도 한번 같이 가자':/캡 미션/.test(nm)?'이번 달 미션은 꼭 채워':/속도/.test(nm)?'1보부터 빨리 쳐':/방송감/.test(nm)?'스탠딩 연습 더 해':'현장을 더 돌아';
  return {c:'r',t:`${S.capName||'캡'} 캡: "${nm} 모자라다. 남은 ${moTxt(left)} — ${tip}."`};}
{const _rk2=rkMonth;rkMonth=function(lines){_rk2(lines);try{const t=capCoach();if(t&&lines)lines.push(t);}catch(e){}};}
// ===== 수습 첫날 캡의 한마디: 도는 현장에 맞게 =====
function rkCapLine(){const k=(typeof sasuKey==='function')?sasuKey():'police';const n=rookieWeeks()/4;const m=['','한','두','석','넉'][n]||n;
  const L={police:`딱 ${m} 달이다. 오늘부터 너는 경찰서에서 산다. 보고는 하루 세 번, 전화는 신호 두 번 안에 받아.`,
   sports:`${m} 달 동안 너는 구장에서 산다. 경기 전 브리핑 하나도 놓치지 말고, 보고는 하루 세 번.`,
   wire:`${m} 달 동안 밤은 네 거다. 상황실 전화 돌리고, 뭐든 터지면 1보부터 쳐.`,
   tv:`${m} 달 동안 중계차가 네 집이다. 카메라 따라 현장 뛰고, 스탠딩 한 줄이라도 매일 연습해.`,
   econ:`${m} 달 동안 너는 여의도에서 산다. 장 열리기 전에 증권가 한 바퀴, 보고는 하루 세 번.`,
   local:`${m} 달 동안 군청 기자실이 네 자리다. 읍사무소·군의회·장터까지 발로 돌고, 보고는 하루 세 번.`,
   eng:`${m} 달 동안 외신 기자클럽과 대사관 거리를 돈다. 브리핑은 원문으로 받아 와.`,
   online:`${m} 달 동안 커뮤니티가 네 출입처다. 뜨는 글 보이면 먼저 확인하고, 그다음에 보고해.`,
   weekly:`${m} 달 동안 자료실과 판결문 열람실에서 산다. 남들이 안 읽는 걸 읽어 와.`,
   edu:`${m} 달 동안 교육청과 학원가를 돈다. 학부모 단톡방 얘기까지 귀 열어 둬.`,
   med:`${m} 달 동안 병원과 제약사를 돈다. 응급실 당직 의사랑 먼저 친해져.`,
   tech:`${m} 달 동안 판교와 전자상가를 돈다. 협력사 사람들이 제일 먼저 안다.`,
   law:`${m} 달 동안 서초동에서 산다. 법정 방청석 맨 앞이 네 자리다.`,
   star:`${m} 달 동안 방송가를 돈다. 공항 출국장과 시사회장, 하나도 빼먹지 마.`};
  return L[k]||L.police;}