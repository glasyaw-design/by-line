/* 바이라인 1.6 — src/systems/onboarding.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ================= 입사 =================
function lastName(){try{return localStorage.getItem('byline-name')||'';}catch(e){return '';}}
function nameErr(nm){if(!nm)return '메인 화면에서 기자 이름을 먼저 정해주세요';if(!/^[가-힣a-zA-Z ]+$/.test(nm))return '이름은 한글과 영어로만 지을 수 있다 (숫자·기호·자음만 쓰기 불가)';if(nm.replace(/ /g,'').length<2)return '이름은 두 글자 이상으로';return '';}
function nameLine(nm){nm=(nm||'').trim();const e=nm&&nameErr(nm);return nm&&!e?`기사 끝에 이렇게 찍힌다 → <b>${esc(nm)} 기자</b>`:nm?`<span style="color:var(--red)">${e}</span>`:'이름을 정하면 모든 기사에 바이라인으로 찍힌다';}
function takeName(){const el=$('#tnm');const nm=((el?el.value:(S&&S.name)||lastName())||'').trim().replace(/\s+/g,' ').slice(0,8);const e=nameErr(nm);
  if(e){toast(e);if(el){el.focus();const c=$('#ncard');c.classList.add('bad','shake');setTimeout(()=>c.classList.remove('shake'),450);}return null;}try{localStorage.setItem('byline-name',nm);}catch(x){}return nm;}
function startCreate(){const nm=takeName();if(!nm){if(!$('#tnm')){const dv=S&&S.dev;S=newState();S.dev=dv;render();setTimeout(()=>{const el=$('#tnm');if(el)el.focus();},50);}return false;}
  try{window.__presence&&window.__presence('start');}catch(e){}const ci=OUTLETS.findIndex(x=>x.id==='mine');if(ci>=0)OUTLETS.splice(ci,1);const keepDev=S&&S.dev;S=newState();S.dev=!!keepDev;S.name=nm;S.phase='create';S.scene='interview';sfx('start');render();window.scrollTo&&window.scrollTo(0,0);return true;}
function bonusOf(){const b={...MAJORS[S.major].b};const sp=SPECS[S.spec]||SPECS[0];for(const k in sp.b)b[k]=(b[k]||0)+sp.b[k];return b;}

// 능력치마다 맡은 역할과 실제 효과 (마우스를 올리거나 눌러서 본다)
const STAT_FX={
 inv:['취재의 기본기','발로 뛰어 단서를 캐내는 힘',['현장 확인·주변 탐문·취재원 전화의 확인 성공률↑','발굴·사쓰마와리·뻗치기에서 아이템이 나올 확률↑','기사 완성도에 조금 더해진다'],'취재 나가기 · 발굴 · 사쓰마와리'],
 ver:['오보를 막는 방패','입수한 자료가 진짜인지 가려낸다',['문건·자료 입수, 취재원 전화 확인 성공률↑','판결문·공시 같은 서류 사실 확인↑','명예훼손 조정·소송에서 이길 확률↑'],'문건 확인 · 데스킹'],
 int:['입을 열게 하는 기술','인터뷰 자리에서 쓰인다',['인터뷰에서 결정적 한마디를 끌어낼 확률↑','증거로 압박할 때 성공률↑','인터뷰형 빠른 기사 완성도↑'],'인터뷰'],
 wri:['기사의 완성도','가장 크게 들어가는 글 능력',['기사 완성도의 절반이 문장력에서 나온다','완성도가 높으면 1면·포털 메인·기자상 확률↑','입사 필기시험 점수에도 들어간다'],'기사 쓰기 · 칼럼'],
 hed:['제목 한 줄','읽히느냐 묻히느냐가 갈린다',['고른 제목의 효과를 키운다 (완성도 배수 보너스)','자극적이지 않은 제목으로도 반응을 끌어낸다'],'기사 쓰기 · 데스킹'],
 spd:['마감과 속보','남보다 빨리 쓰는 힘',['70 이상이면 한 달 행동력 +1','경제·스포츠·후속 같은 빠른 기사 완성도↑'],'속보 · 출입처 브리핑'],
 net:['연줄','아는 사람이 곧 정보다',['취재원 전화·문건 입수 성공률이 크게↑','새 취재원을 뚫을 확률↑, 만날 때마다 신뢰가 더 쌓인다','기관·인물과의 관계가 더 빨리 좋아진다'],'취재원 만나기 · 대외 관계'],
 cha:['사람 마음을 얻는 힘','동료·취재원·인터뷰이와의 관계',['동료·취재원 관계가 오를 때 더 많이 오른다','주변 탐문 성공률↑, 인터뷰 경계심을 빨리 낮춘다','채용 때 지원자를 보는 눈↑'],'동료 챙기기 · 술자리 · 인터뷰'],
 sta:['버티는 몸','현장을 오래 뛰는 힘',['높을수록 컨디션이 빨리 회복된다 (매달 저절로 차는 양↑)','65 이상이면 한 달 행동력 +1','현장 확인 성공률↑, 60 이상이면 취재 한 번에 시간 1칸 더','뻗치기·밤샘 취재 성공률↑'],'휴식 · 현장 취재'],
 men:['흔들리지 않는 마음','압박과 실패를 견딘다',['행동할 때 컨디션이 덜 깎인다 (40을 넘는 만큼)','평가가 깎일 때 덜 깎인다'],'휴식 · 위기를 버틴 경험'],
 kno:['세상 돌아가는 맥락','언론고시와 해설 기사의 바탕',['입사 필기시험 점수↑','데이터 분석·사전 확인 성공률↑','IT·과학 같은 해설형 기사 완성도↑'],'상식 퀴즈 · 칼럼'],
 dat:['숫자로 증명','통계·공시·판결문을 읽는다',['데이터 분석 확인 성공률이 크게↑','판결문·숫자 사실 확인↑','경제·탐사 부서에서 특히 유리'],'데이터 분석'],
 lng:['해외 취재','외신과 외국어 자료',['40 이상이면 국제·외교 아이템이 한 단계 더 확인된 채로 나온다','해외 연수·특파원 공모 합격↑','통신사·영자지 면접에서 유리'],'국제부 업무'],
 brd:['카메라 앞에서','방송 리포트와 출연',['방송 매체에선 리포트 완성도↑ (40을 넘는 만큼)','스탠드업 촬영 완성도↑','50 이상이면 단독·특종 때 방송 패널 섭외로 평판↑'],'리포트 제작 · 스탠드업']
};
function statTitle(k){const f=STAT_FX[k];return f?`${STN[k]} — ${f[0]}: ${f[2].join(' / ')}`:STN[k];}
// 7.0 평가 지표 설명: 사내 평가·업계 평판·신뢰도·컨디션
function evInfoD(k){const hpM=Math.round(((S.simple?8:6)+(S.st.sta||40)/20)*4);return ({
  eval:[S.founder?(S.investor?'투자자 신뢰':'구성원 신뢰'):S.rank===7?'이사회 신임':evalName(),S.eval,'회사 안에서 나를 어떻게 보는가',['승진 조건 — 직급마다 넘어야 할 평가 기준이 있다','연말 인사고과 등급과 성과급이 이걸로 정해진다','바닥(18 이하)이 몇 달 이어지면 권고사직 위험','상사 성향에 맞는 일을 하면 오르고, 싫어하는 일을 하면 깎인다'],'기사 출고·단독·미션 달성·광고 목표 달성으로 오른다. 물먹기·오보·마감 펑크로 깎인다. 높을수록 오르는 폭이 줄어든다'],
  fame:['업계 평판',S.fame,'업계가 나를 얼마나 아는가',['승진 조건 — 높은 직급일수록 평판 기준이 높다','이직·스카우트 제안이 더 좋은 자리로 온다','기자상 후보에 오르기 쉽다','취재원·인물이 나를 만나 주기 쉽다'],'단독·1면·대특종·칼럼·수상으로 오른다. 해마다 조금씩 저절로 식는다'],
  trust:['신뢰도',S.trust,'독자와 업계가 내 기사를 믿는 정도',['높으면 소송·분쟁에서 이기기 쉽고, 구독·후원·포털 평가에 유리하다','높은 신뢰가 필요한 직급·엔딩·업적 조건이 있다','낮으면(40 아래) 오보 위기·사내 위기가 잦아진다','바닥(18 이하)이면 오보 한 번에 크게 흔들리고, 아주 낮으면 해고 사유가 된다'],'확인된 사실로 쓰기·반론 받기·정정에 솔직하기·광고 압력 버티기로 오른다. 오보·광고성 기사·리베이트로 깎인다. 높을수록 오르기 어렵다'],
  hp:['컨디션',S.hp,'지금 몸과 마음의 여력',[`매달 저절로 약 ${hpM}씩 찬다 (체력이 높을수록 더 많이)`,'65 이상이면 다음 달 행동력 +1, 30 아래면 -1','낮으면 취재 실패·실수가 잦고, 바닥이면 쓰러져 행동력이 반으로 준다','휴식·휴가·헬스 PT·심리 상담으로 회복된다'],'일할수록 깎이고 쉬면 찬다. 멘탈이 높으면 덜 깎인다']}[k]);}
function evInfo(k){const d=evInfoD(k);if(!d)return;openModal(d[0],`<div class="statrow" style="margin:0 0 10px"><span>지금</span>${bar(d[1])}<span class="num">${Math.round(d[1])}</span></div><p class="lede">${d[2]}.</p><div class="sec">이게 높으면·낮으면</div><ul class="tpts">${d[3].map(x=>`<li>${x}</li>`).join('')}</ul><div class="sec">이렇게 움직인다</div><p class="hint" style="margin:0">${d[4]}</p>`);}
function evTip(k){const d=evInfoD(k);return d?`${d[0]} — ${d[3].join(' / ')}`:'';}
function statTier(v){return v>=80?'최상급':v>=65?'뛰어남':v>=50?'쓸 만함':v>=35?'보통 이하':'약점';}
function statInfo(k){const f=STAT_FX[k];if(!f)return;const v=Math.round(S.st[k]);
  openModal(`${STN[k]} · ${f[0]}`,`<div class="statrow" style="margin:0 0 10px"><span>지금</span>${bar(v)}<span class="num">${v}</span></div><p class="lede">${f[1]}. 지금은 <b>${statTier(v)}</b>.</p><div class="sec">오르면 이렇게 된다</div><ul class="tpts">${f[2].map(x=>`<li>${x}</li>`).join('')}</ul><div class="sec">이렇게 키운다</div><p class="hint" style="margin:0">${f[3]} 같은 일을 할수록 오른다. 매년 연차가 쌓여도 조금씩 오른다.</p>`);}
function statPreview(){const b=bonusOf();return `<div class="kv" style="grid-template-columns:repeat(auto-fill,minmax(110px,1fr))">${Object.keys(STN).map(k=>{const v=ST0[k]+(b[k]||0);const d=b[k]||0;return `<div title="${esc(statTitle(k))}"><span>${STN[k]} · ${STAT_FX[k]?STAT_FX[k][0]:''}</span><b>${v}</b> <span style="display:inline;color:${d>0?'var(--good)':d<0?'var(--red)':'var(--mute)'}">${d>0?'+'+d:d<0?d:''}</span></div>`;}).join('')}</div>`;}
function finishCreate(){
  const nm=(S.name||'').trim();const ne=nameErr(nm);if(ne){toast(ne);return;}
  S.name=nm.slice(0,8);flashLoad(S.smode==='story'?'시나리오 불러오는 중…':S.smode==='found'?'창간 서류 접수 중…':'지원서 접수하는 중…',650);const b=bonusOf();for(const k in b)gain(k,b[k]);
  S.money=DF().start;S.apply=[];if(S.smode!=='story'){if(S.age0==null)S.age0=S.smode==='found'?40:26;S.ageT0=0;try{ageStart();}catch(e){}}
  if(S.smode==='quick'){qsStart();return;}if(S.smode==='smb'){smbOffers();return;}
  if(S.smode==='story'&&!S.devUnlock&&!window.__devTest)S.smode='exam';
  if(S.smode==='story'){openModal('스토리 고르기','<p>각 스토리는 매체·직급·부서가 정해져 있고, 제한 시간 안에 목표를 이루면 클리어다.</p>',STORIES.map(st=>({label:st.n,sub:st.d,fn:()=>{S.story=st.id;storySetup();return false;}})).concat([{label:'뒤로',cls:'ghost'}]));return;}
  if(S.smode==='found'){for(const k in S.st)gain(k,14);S.fame=22+Math.max(0,((S.age0||40)-35)*.3);S.money=Math.max(S.money,15000);founderSetup({age:S.age0,st:{...S.st},fame:S.fame||22,trust:52,sources:[],name:S.name,major:S.major,spec:S.spec,diff:S.diff,money:S.money,dev:S.dev,turn:0,awards:0,scoops:0,history:[]});return;}
  S.phase='apply';render();
}
function quickStart(){S.smode='exam';finishCreate.quick=1;const nm=(S.name||'').trim();if(nameErr(nm)){toast(nameErr(nm));return;}
  S.name=nm.slice(0,8);const b=bonusOf();for(const k in b)gain(k,b[k]);S.money=DF().start;S.apply=[];if(S.age0==null)S.age0=26;S.ageT0=0;try{ageStart();}catch(e){}
  const pool=OUTLETS.filter(o=>!o.custom&&!o.npc&&!o.closed);const pk=p=>shuffle(pool.filter(o=>o.p===p))[0];const L=[pk(4)||pk(5),pk(3),pk(2)||pk(3)].filter(Boolean);
  S.scene='interview';drawScene();
  openModal('빠른 시작 · 어디서 시작할까',`<p class="lede">언론고시 없이 수시 채용으로 바로 수습기자가 된다.</p><p class="hint">큰 곳은 월급과 위상이 좋지만 경쟁이 세고, 작은 곳은 일찍 단독을 쥘 기회가 많다. 어디든 경력을 쌓아 이직할 수 있다.</p>`,L.map(o=>({label:`${o.n} 입사`,sub:`${TYPES[o.type].n} · ${'★'.repeat(o.p)} · 수습 월 ${payOf(o,0)}만 원 · 부서 ${o.depts.length}개`,rec:o.p===3,fn:()=>{join(o);return false;}})).concat([{label:'뒤로',cls:'ghost'}]));}
function smbOffers(){
  const pool=shuffle(OUTLETS.filter(o=>o.p<=3));const picks=[];const seen=new Set();for(const o of pool){if(picks.length>=5)break;if(seen.has(o.type)&&chance(.6))continue;seen.add(o.type);picks.push(o);}
  S.scene='interview';drawScene();
  openModal('수시 채용 합격',`<p class="lede">중소·중견 매체 ${picks.length}곳에서 "바로 출근할 수 있느냐"는 연락이 왔다.</p><p>작은 곳일수록 일은 많고 월급은 적지만, 일찍 단독을 쥘 기회도 있다. 입사 1년 뒤부터 이직할 수 있다.</p>`,picks.sort((a,b)=>b.p-a.p).map(o=>({label:`${o.n} 입사`,sub:`${TYPES[o.type].n} · ${LEAN[o.lean]} · ${'★'.repeat(o.p)} · 수습 실수령 월 ${payOf(o,0)}만 원 · 부서 ${o.depts.length}개`,fn:()=>{join(o);return false;}})).concat([{label:'다시 고른다',cls:'ghost',fn:()=>{S.phase='create';}}]));
}
function startExam(){
  const ap=S.apply.map(id=>OUTLETS.find(o=>o.id===id));const sum=Object.values(S.st).reduce((a,b)=>a+b,0);
  const res=ap.map(o=>({id:o.id,doc:chance(clamp(.97-o.p*.11+sum/700-DF().need/100,.15,.95))}));
  S.exam={res,quiz:0,right:0,qs:drawQuiz(S.simple?3:5),iv:[]};
  S.scene='interview';drawScene();
  const pass=res.filter(r=>r.doc);
  openModal('서류 전형 결과',`<ul class="feed">${res.map(r=>{const o=OUTLETS.find(x=>x.id===r.id);return `<li class="${r.doc?'g':'r'}">${o.n} — ${r.doc?'서류 합격':'불합격'}</li>`;}).join('')}</ul>`,
    pass.length?[{label:'필기시험 보러 가기',sub:'상식 5문제 · 면접 3문항',fn:()=>{quizStep(0);return false;}}]:[{label:'수시 채용 제안을 받는다',sub:'중소·중견 매체에 바로 입사',rec:true,fn:()=>{smbOffers();return false;}},{label:'다시 지원서를 쓴다',fn:()=>{S.retries++;for(const k of ['kno','wri'])gain(k,4);S.apply=[];}}]);
}
function quizStep(i,last){
  const E=S.exam;const n=E.qs.length;
  if(i>=n){if(E.practice)return practiceEnd();return ivStep(0);}
  const q=E.qs[i];
  openModal(`${E.practice?'상식 퀴즈 연습':'필기시험'} · ${q.c} ${i+1}/${n}`,`${last?`<p class="${last.ok?'fx':'warn'}">${last.ok?'정답!':`오답 — 정답은 "${esc(last.a)}"`}</p>`:''}<p class="hint" style="margin:0 0 6px">정답 ${E.right}/${i}</p><p class="lede">${esc(q.q)}</p>`,q.o.map(o=>({label:esc(o),fn:()=>{const ok=o===q.a;if(ok){E.quiz+=100/n;E.right++;}quizStep(i+1,{ok,a:q.a});return false;}})));
}
function practiceStart(){S.exam={practice:true,quiz:0,right:0,qs:drawQuiz(10)};S.scene='interview';drawScene();quizStep(0);}
function practiceEnd(){
  const r=S.exam.right;const g=r>=9?'수석 합격권':r>=7?'합격권':r>=5?'아슬아슬':'1년 더 준비';
  S.best=Math.max(S.best||0,r);try{localStorage.setItem('byline-quiz-best',String(Math.max(r,+(localStorage.getItem('byline-quiz-best')||0))));}catch(e){}
  openModal('상식 퀴즈 결과',`<p class="lede">10문제 중 <b>${r}</b>개 정답 — ${g}</p><p class="hint">문제 은행 ${QB.length}문항 · 언론·경제·한국사·국어·과학·지리·세계·문화·스포츠·사회에서 골고루 나온다.</p>`,[{label:'한 번 더 풀기',fn:()=>{practiceStart();return false;}},{label:'닫기',cls:'ghost'}]);
}
// 면접 질문 은행 — 매 시험마다 공통 2 + 매체 유형 1 + 랜덤 2 = 5문항
// 답변 태그: 매체 성격에 따라 점수가 달라진다 (ivTag)
const IVQ_COMMON=[
 ['왜 언론사, 그중에서도 우리 회사입니까?',[['이 매체만의 보도 방식이 좋아서','type'],['안정적인 직장이라서','money'],['꼭 가고 싶은 부서가 있어서','aff'],['다른 데 다 떨어져서요','bad']]],
 ['우리 회사 논조와 본인 생각이 다르면 어떻게 하겠습니까?',[['회사 방향을 존중하고 그 안에서 최선을 다하겠습니다','fit'],['사실 앞에서는 소신을 지키겠습니다','integ'],['데스크와 토론해 접점을 찾겠습니다','bal']]],
 ['기자에게 가장 중요한 자질 하나를 꼽는다면?',[['끈기','grit'],['정확성','check'],['공감 능력','story'],['인맥','net']]],
 ['최근 읽은 기사 중 가장 좋았던 기사와 이유를 말해 보세요.',[['탐사 보도 — 끝까지 판 집요함','integ'],['데이터 기사 — 숫자로 구조를 보여 줘서','data'],['인터뷰 기사 — 사람이 보여서','story'],['딱히 기억나는 건 없습니다','bad']]],
 ['본인을 한 단어로 표현한다면?',[['체력','speed'],['꼼꼼함','check'],['호기심','grit'],['성실함','cliche']]]
];
const IVQ_POOL=[
 ['새벽 3시, 단독 제보 전화가 왔습니다. 어떻게 하겠습니까?',[['일단 현장으로 달려간다','speed'],['제보자 신원과 근거부터 확인한다','check'],['선배에게 먼저 보고한다','report']]],
 ['취재원이 기사를 빼 달라며 울면서 부탁합니다.',[['사정을 듣되 공익성이 크면 쓴다','integ'],['데스크와 상의한다','report'],['인간적으로 빼 준다','bad']]],
 ['광고주 비판 기사를 회사가 막으면?',[['사실관계를 보강해 다시 설득한다','integ'],['회사 판단을 따른다','fit'],['다른 매체에 제보한다','bad']]],
 ['오보를 냈다는 걸 알게 됐습니다. 첫 행동은?',[['즉시 데스크에 알리고 정정한다','ethic'],['조용히 기사를 수정한다','bad'],['반론을 추가로 취재한다','check']]],
 ['선배가 보도자료를 그대로 베껴 쓰라고 하면?',[['최소한 핵심 수치는 확인하겠다','check'],['시키는 대로 한다','fit'],['거절하고 따로 취재한다','integ']]],
 ['동기와 같은 아이템을 쫓게 됐습니다.',[['정보를 나눠 함께 크게 키운다','team'],['먼저 쓰는 사람이 이긴다','speed'],['선배에게 조율을 부탁한다','report']]],
 ['SNS에서 떠도는 영상을 기사로 써 달라는 지시를 받았다면?',[['원본 출처와 촬영 시점부터 확인한다','check'],['조회수가 급하니 바로 쓴다','speed'],['기사 가치가 없다고 말한다','integ']]],
 ['정치인이 오프더레코드로 중요한 사실을 말했습니다.',[['다른 경로로 사실을 확인해 쓴다','check'],['약속을 지키고 쓰지 않는다','ethic'],['그냥 쓴다','bad']]],
 ['데이터를 다룰 줄 압니까?',[['엑셀·통계 분석은 자신 있습니다','data'],['배우면 금방 합니다','grit'],['기자에게 꼭 필요할까요?','bad']]],
 ['외국어로 취재할 수 있습니까?',[['영어 인터뷰가 가능합니다','lang'],['통역을 쓰면 됩니다','cliche'],['못 하지만 현장 감각은 자신 있습니다','speed']]],
 ['지역에 발령 나면 어떻게 하겠습니까?',[['지역에도 기사는 있습니다. 기꺼이 갑니다','local'],['서울로 돌아올 방법부터 찾겠습니다','bad'],['회사 결정을 따르겠습니다','fit']]],
 ['디지털 시대, 신문·방송의 미래를 어떻게 봅니까?',[['형식은 바뀌어도 검증된 정보의 가치는 오른다','digital'],['종이는 끝났다','bad'],['영상과 데이터로 확장해야 한다','digital']]],
 ['기자가 받아도 되는 선물의 기준은?',[['청탁금지법 한도 안에서, 그래도 웬만하면 거절','ethic'],['관행대로 받는다','bad'],['회사 규정을 따른다','fit']]],
 ['기사 한 줄 때문에 고소당하면?',[['취재 기록을 정리해 법무팀과 대응한다','check'],['기사를 내린다','bad'],['더 강한 후속을 쓴다','integ']]],
 ['밤샘 취재가 일주일째입니다. 버틸 수 있습니까?',[['체력 하나는 자신 있습니다','speed'],['효율적으로 일하는 방법을 찾겠습니다','team'],['솔직히 힘들 것 같습니다','cliche']]],
 ['사건 피해자 유족을 인터뷰해야 합니다.',[['동의를 먼저 구하고, 원하지 않으면 물러선다','ethic'],['어떻게든 한마디를 받아낸다','speed'],['선배에게 맡긴다','report']]],
 ['인공지능이 기사를 쓰는 시대, 기자는 무엇을 해야 합니까?',[['현장과 검증, 사람을 만나는 일','integ'],['AI를 도구로 잘 쓰는 일','digital'],['기자는 사라질 겁니다','bad']]],
 ['정부 정책 기사를 쓸 때 가장 먼저 볼 것은?',[['예산과 수혜 대상의 숫자','data'],['정부 보도자료','fit'],['현장 당사자의 목소리','story']]],
 ['존경하는 기자가 있습니까?',[['진실을 끝까지 추적한 탐사 기자','integ'],['현장을 지킨 선배들','story'],['특별히 없습니다','cliche']]],
 ['단독과 정확성 중 하나만 고르라면?',[['정확성','check'],['단독','speed'],['둘 다 놓치지 않겠다','cliche']]],
 ['상사의 부당한 지시를 받았다면?',[['근거를 들어 정중히 이의를 제기한다','integ'],['일단 따르고 나중에 말한다','fit'],['노조에 알린다','team']]],
 ['우리 회사 기사 중 아쉬웠던 기사를 말해 보세요.',[['구체적 기사와 개선점을 말한다','type'],['다 훌륭했습니다','cliche'],['잘 모르겠습니다','bad']]],
 ['5년 뒤 본인의 모습은?',[['한 분야에서 믿고 찾는 기자','aff'],['데스크','cliche'],['아마 다른 일을 하고 있을 겁니다','bad']]],
 ['연예인 열애설 제보가 들어왔습니다.',[['공익성과 사생활 침해 여부부터 따진다','ethic'],['조회수가 보장되니 쓴다','speed'],['소속사 확인을 거쳐 쓴다','check']]],
 ['경쟁사가 우리 단독을 출처 없이 베꼈습니다.',[['공식 항의하고 기록을 남긴다','integ'],['더 좋은 후속으로 이긴다','grit'],['신경 쓰지 않는다','cliche']]],
 ['갈등이 심한 이슈에서 균형은 어떻게 잡습니까?',[['양측 근거를 같은 무게로 확인한다','bal'],['사실이 가리키는 쪽을 쓴다','integ'],['회사 논조를 따른다','fit']]]
];
const IVQ_TYPE={
 tv:[['카메라 앞에서 말실수를 했다면?',[['바로 정정하고 침착하게 이어간다','speed'],['편집으로 넘긴다','cliche'],['당황해서 멈출 것 같습니다','bad']]],['리포트는 그림이 절반입니다. 그림이 없으면?',[['그래픽과 현장 스탠드업으로 채운다','digital'],['자료화면을 쓴다','cliche'],['리포트를 포기한다','bad']]]],
 jp:[['종편 시사 프로그램 패널 섭외를 맡는다면?',[['양쪽 패널을 균형 있게','bal'],['시청률 나오는 사람','speed'],['우리 논조에 맞는 사람','fit']]]],
 ch:[['24시간 뉴스 채널에서 가장 중요한 것은?',[['속보의 속도와 정확성','speed'],['깊이 있는 해설','check'],['잘 모르겠습니다','bad']]]],
 wire:[['통신사 기자에게 1분은 어떤 의미입니까?',[['수백 매체가 받아쓰는 1분, 빠르되 틀리면 안 된다','check'],['무조건 먼저','speed'],['별 의미 없다','bad']]]],
 daily:[['종이 신문 1면은 무엇으로 정해야 합니까?',[['독자에게 가장 중요한 사실','integ'],['가장 많이 클릭된 기사','digital'],['광고주가 원하는 기사','bad']]]],
 econ:[['기업 실적 기사에서 가장 조심할 것은?',[['미공개 정보와 투자 권유','ethic'],['숫자 오타','check'],['기업 홍보팀 기분','bad']]],['재무제표를 읽을 수 있습니까?',[['손익계산서와 현금흐름표는 볼 줄 압니다','data'],['배우겠습니다','grit'],['못 읽습니다','bad']]]],
 sports:[['응원하는 팀이 있습니까? 기사에 영향을 줍니까?',[['있지만 기사는 기록으로 씁니다','check'],['없습니다','cliche'],['당연히 영향을 줍니다','bad']]]],
 local:[['지역 유지와의 관계를 어떻게 하겠습니까?',[['가깝되 선은 지킨다','ethic'],['지역에서 살아남으려면 친해져야','net'],['아예 안 만난다','cliche']]],['우리 지역의 가장 큰 문제는?',[['인구 감소와 일자리','local'],['잘 모르겠습니다','bad'],['서울과의 격차','local']]]],
 online:[['포털 실시간 이슈를 따라 기사를 쓰라면?',[['확인된 것만 빠르게','check'],['제목만 바꿔 여러 번','bad'],['독자에게 필요한 맥락을 붙여서','digital']]]],
 weekly:[['주간지 커버스토리는 무엇이 달라야 합니까?',[['일간지가 못 본 깊이와 구조','integ'],['더 자극적인 제목','bad'],['좋은 사진','story']]]],
 eng:[['영어로 한국을 소개하는 기사에서 조심할 것은?',[['외국 독자가 모르는 맥락 설명','lang'],['직역','cliche'],['아무거나','bad']]]],
 trade:[['업계 전문지 기자는 업계와 얼마나 가까워야 합니까?',[['전문성은 깊게, 거리는 두고','ethic'],['업계 편이어야 한다','fit'],['멀수록 좋다','cliche']]]]
};
function drawIV(o){const t=IVQ_TYPE[o.type]||IVQ_TYPE.daily;return [pick(IVQ_COMMON.slice(0,2)),pick(IVQ_COMMON.slice(2)),pick(t)].concat(shuffle(IVQ_POOL).slice(0,2));}
function ivTag(k,o){const fast=['wire','ch','online','sports','tv'].includes(o.type),deep=['daily','weekly','eng','econ','jp'].includes(o.type);
  switch(k){case 'fit':return o.lean!=='neu'?10:3;case 'bal':return o.lean==='neu'?10:5;case 'integ':return deep?9:7;case 'speed':return (fast?10:4)+S.st.sta/12;case 'check':return deep?10:6;case 'report':return 6;
   case 'type':return 9;case 'money':return 2;case 'aff':return o.depts.some(d=>catOf(d).includes(MAJORS[S.major].aff))?9:4;case 'ethic':return 8;case 'team':return 7;case 'grit':return 7;case 'story':return 6+S.st.wri/15;
   case 'data':return 4+(S.st.dat||40)/10;case 'lang':return (['eng','wire'].includes(o.type)||o.depts.includes('int')?6:3)+S.st.lng/12;case 'local':return o.type==='local'?11:5;case 'digital':return ['online','ch','tv'].includes(o.type)?10:6;case 'net':return 5+S.st.net/15;case 'cliche':return 3;case 'bad':return 0;}return 5;}

function ivStep(i){
  const E=S.exam;if(!E.iv)E.iv=[];
  if(!E.ivq){const ap=(S.apply||[]).map(id=>OUTLETS.find(o=>o.id===id)).filter(Boolean);E.ivq=drawIV(ap.length?pick(ap):OUT()||OUTLETS[0]);E.ivq=E.ivq.slice(0,S.simple?2:3);}
  if(i>=E.ivq.length)return examResult();
  const q=E.ivq[i];
  openModal(`면접 · 질문 ${i+1}/${E.ivq.length}`,`<p class="lede">면접관: "${esc(q[0])}"</p><p class="hint">정답은 없다. 지원한 매체의 성격(속보형·심층형·논조·지역)에 따라 좋게 보는 답이 다르다.</p>`,shuffle(q[1]).map(([l,k])=>({label:l,fn:()=>{E.iv[i]=k;ivStep(i+1);return false;}})));
}
function ivScore(o){const iv=S.exam.iv||[];if(!iv.length)return 15;let s=iv.reduce((a,k)=>a+ivTag(k,o),0)*3/iv.length;
  if(o.type==='eng')s+=S.st.lng/6-6;return s;}
function examResult(){
  const E=S.exam;const pass=E.res.filter(r=>r.doc).map(r=>{const o=OUTLETS.find(x=>x.id===r.id);const sc=E.quiz*.35+S.st.wri*.3+S.st.kno*.2+ivScore(o)+R(-6,6);return{o,sc,ok:sc>=41+o.p*7+DF().need};});
  if(E.iv[0]==='integ')apply({trust:5});
  const ok=pass.filter(p=>p.ok);
  openModal('최종 합격 발표',`<p>필기 점수 ${E.quiz}점.</p><ul class="feed">${pass.map(p=>`<li class="${p.ok?'g':'r'}">${p.o.n} (${TYPES[p.o.type].n}) — ${p.ok?'최종 합격':'불합격'}</li>`).join('')}</ul>${ok.length?'<p>어디로 갈까?</p>':'<p>전원 불합격. 1년 더 준비하기로 한다. (상식·필력 상승)</p>'}`,
    ok.length?ok.map(p=>({label:`${p.o.n} 입사`,sub:`${TYPES[p.o.type].n} · ${LEAN[p.o.lean]} · 수습 실수령 월 ${payOf(p.o,0)}만 원`,fn:()=>{join(p.o);return false;}})):[{label:'수시 채용 제안을 받는다',sub:'중소·중견 매체에 바로 입사 · 경력을 쌓아 이직할 수 있다',rec:true,fn:()=>{smbOffers();return false;}},{label:'1년 더 준비해 다시 도전한다',sub:'상식·필력 상승',fn:()=>{S.retries++;gain('kno',6);gain('wri',4);S.apply=[];}}]);
}
function join(o){
  S.outlet=o.id;S.co=initCo(o);S.dept=o.depts.find(d=>d==='case')||o.depts.find(d=>catOf(d).includes('spo')&&o.type==='sports')||o.depts.find(d=>cat1(d)==='soc')||o.depts[0];S.phase='game';S.rank=0;S.inRank=0;S.atOutlet=0;S.history=[o.id];S.scene='police';S.rival=makeRival();
  initColleagues(true);initNet(null);initPortal(o);initComp();S.ap=apBase();log(`${o.n} ${TYPES[o.type].n} 입사. 수습 생활 시작`);tick(`${o.n}, 수습기자 입사식`,1);
  const rv=S.rival;
  openModal('수습기자 첫날',`<p class="lede">${o.n} ${['tv','jp','ch'].includes(o.type)?'보도국':'편집국'}. ${S.capName} 캡이 휴대폰 번호를 찍어 주며 말했다. "${rkCapLine()}"</p><p><b>${DEPTS[S.dept].n} 수습 ${rookieWeeks()/4}개월.</b> ${esc(sasuCfg().d)}. 거기서 단서와 취재원을 찾고 정보보고로 평가를 쌓자.</p><p class="hint">수습을 마치려면: ${rookieReqs().map(x=>x.t.replace(/ \d+\//,' ').replace(/\s*\(.*\)/,'')).join(' · ')}</p><p>같은 라인을 도는 ${OUTLETS.find(x=>x.id===rv.outlet).n} 수습 ${jo2(rv.name,'이','가')} 인사를 건넨다. 앞으로 계속 마주칠 얼굴이다.</p><p class="hint">한 턴은 한 달. 이번 달 행동력은 ${apBase()}이고, 다 쓰면 '다음 달로 넘기기'. 난이도: ${DF().n}. 할 수 있는 일은 몇 달에 걸쳐 하나씩 열린다.</p>`,[{label:'30초 안내 보고 시작',sub:'3쪽 · 한 달 흐름 · 미션 · 취재와 기사',rec:true,fn:()=>{checkUnlocks();tutShort(0);return false;}},{label:'바로 시작',fn:()=>{checkUnlocks();}}]);
}