/* 바이라인 — src/ui/hud-missions.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 결과 카드: "확인" 하나뿐인 팝업은 화면을 막지 않는 카드로 =====
// 중요한 순간(결산·승진·발령·합격·엔딩·징계·퇴직·이직·창간·튜토리얼 등)은 그대로 팝업으로 남긴다
const KICK={retire:['퇴직·송별','#b9a6ff'],board:['광고','#ffb84d'],press:['매체','#77a6ff'],coin:['투자','#ffd166'],pet:['생활','#9be38a'],age:['나이','#c6c6ff'],paper:['지면','#e8dcc0'],scoop:['단독','#ff7b6b'],phone:['제보','#6fd6ff'],siren:['사건','#ff5c6c'],court:['법정','#a7b4c8'],money:['돈','#4fd1a5'],trophy:['성과','#ffcf5a'],mic:['인터뷰','#8ab4ff'],meeting:['회의','#9fb3d9'],run:['행사','#6ee7b7'],hand:['협상','#f6ad7b'],doc:['자료','#cbd5e1'],warn:['경고','#ff9b5c'],city:['관공서','#93c5fd'],people:['사람','#f9a8d4'],cal:['일정','#a5b4fc'],tv:['방송','#c084fc'],pen:['기사','#fcd34d']};
const CARD_KEEP=/이야기 완결|년 결산|권고사직|라이벌|연속 달성|이정표|출고|처음 안내|결산|승진|발령|합격|불합격|엔딩|클리어|튜토리얼|도움말|업데이트|메뉴|저장|개발자|설정|징계|정년|퇴임|퇴직|사표|이직 결심|새 출근|창간|입사|수습 평가|최종|면접|필기|서류|기자상|대특종|폐간|파산|해고|권고사직|은퇴|임기 만료|게임 오버|처음 해 보는 일|정식 발령|1면 대결|이사회/;
const CARD_OK_L=/^(확인|알겠다|좋다|닫기|넘어간다)$/;
function cardOK(title,body,choices){if(!S||S.phase!=='game'||S.cardsOn===false||S.dev&&window.__noCards)return false;if(CARD_KEEP.test(title||''))return false;if(/^편집국 복귀/.test(title||'')&&S.resPop!==false)return false;if(String(body||'').includes('tfig')||String(body||'').includes('<input')||String(body||'').includes('<select'))return false;
  const L=(choices||[]).filter(c=>c&&c.cls!=='ghost');if((choices||[]).some(c=>c&&c.cls==='ghost'))return false;if(L.length>1)return false;if(L.length===1&&!CARD_OK_L.test(String(L[0].label).replace(/<[^>]+>/g,'').trim()))return false;if(L.length===1&&L[0].disabled)return false;return true;}
function cardTxt(h){const d=document.createElement('div');d.innerHTML=h||'';return d.textContent.replace(/\s+/g,' ').trim();}
function showCard(title,body,choices){let b=body||'';try{b=snapInject(b,title);}catch(e){}b=b.replace(/<p class="hint">결과 팝업은[^<]*<\/p>/g,'');const k=illFor(title);const kx=KICK[k]||['소식','#9fb3d9'];
  let box=document.getElementById('cards');if(!box){box=document.createElement('div');box.id='cards';box.setAttribute('aria-live','polite');document.body.appendChild(box);}
  const el=document.createElement('div');el.className='rcard';el.style.setProperty('--k',kx[1]);el.innerHTML=`<div class="rt"><span><i class="rk">${kx[0]}</i>${esc(title)}</span><button class="rx" aria-label="닫기">×</button></div><div class="rb">${b}</div>`;
  box.prepend(el);while(box.children.length>5)box.lastChild.remove();try{const mo=document.querySelector('#modal:not([hidden])');if(mo){el.classList.add('mini');box.classList.add('mini');}else box.classList.remove('mini');el.querySelector('.rt span').onclick=()=>el.classList.toggle('mini');}catch(e){}
  const txt=cardTxt(b);(S.cardLog=S.cardLog||[]).unshift({d:dateShort(),t:title,x:txt.slice(0,600)});if(S.cardLog.length>30)S.cardLog.length=30;
  let left=Math.min(16000,7000+txt.length*30),hov=false,iv=null;const go=()=>{clearInterval(iv);el.classList.add('out');setTimeout(()=>el.remove(),280);};iv=setInterval(()=>{if(!el.isConnected){clearInterval(iv);return;}if(hov||document.hidden||document.querySelector('#modal:not([hidden])')||document.querySelector('#loading:not([hidden])'))return;const i=[...box.children].indexOf(el);if(i>=3)return;left-=250;if(left<=0)go();},250);el.onmouseenter=()=>{hov=true;};el.onmouseleave=()=>{hov=false;};el.ontouchstart=()=>{left=Math.max(left,6000);};el.querySelector('.rx').onclick=go;
  try{sfx(sfxFor(title,b),.02);}catch(e){}
  const c=(choices||[]).find(x=>x&&x.cls!=='ghost');try{if(c&&c.fn)c.fn();}catch(e){console.error(e);}
  // 이어서 진행: 위에서 다른 팝업이 열리지 않았으면 대기열(Q)을 이어 가거나 화면을 갱신한다
  const tk=mTok;setTimeout(()=>{if(mTok===tk&&!document.querySelector('#modal:not([hidden])')){mTok++;MSTACK=[];if(S)S._curAct=null;if(Q.length){Q.shift()();return;}try{if(snapFinish())return;}catch(e){ACT_SNAP=null;}render();saveGame();}else if(mTok===tk)closeModal();},0);}

// ===== 이달의 미션: 이번 달에 뭘 하면 되는지 =====
// 직급에 맞는 구체적인 목표 2~3개. 하나 이룰 때마다 평가가 오르고, 다 이루면 다음 달 행동력 +1
const MIS_SKIP=['life','rest','job','deptreq','gad','wage','paypol','facility','found','newdept','personnel','handoff','fcrisis','fraise','cut','digital','hire','recruit'];
const MIS_ACT={fassign:'기자에게 취재 {g}번 지시하기',assign:'후배에게 취재 {g}번 지시하기',hamyeong:'기획 하명 {g}번',sasu:'사쓰마와리 {g}번 돌기',report:'정보보고 {g}번 올리기',hari:'하리꼬미 {g}번',beat:'출입처 브리핑 {g}번',source:'취재원 {g}번 만나기',discover:'아이템 {g}번 발굴',invest:'취재 {g}번 나가기',pitch:'아침 발제 {g}번',desk:'후배 기사 데스킹 {g}번',plan:'부서 기획회의 열기',colleague:'동료와 시간 보내기',deptlife:'부서 사람들 챙기기',column:'칼럼 {g}편',front:'1면 회의 이끌기',direction:'편집 방향 회의',campaign:'구독 캠페인',adsales:'광고 영업 {g}건',adsell:'광고·협찬 영업 {g}건',meeting:'편집회의 주재',exec:'경영회의 주재',board:'이사회·대주주 보고',portal:'포털 제휴 전략',tour:'편집국 순시',agenda:'어젠다 세팅',taskforce:'특별취재팀 꾸리기',breaking:'속보 지휘',network:'대외 관계 챙기기',special:'부서 특화 업무',fvision:'전략 회의',fsales:'광고·후원 영업 {g}건',fpartner:'콘텐츠 제휴',fbrand:'브랜딩·독자 확대',fhire:'인재 채용',fethics:'윤리강령·독자위원회',fbureau:'지역 주재 챙기기',revenue:'수익 다변화',lgevent:'행사 유치',adrate:'광고 수주',event:'포럼·행사 사업',drink:'선배와 술자리'};
const MIS_W={sasu:3,report:2.5,invest:3,pitch:2.5,beat:2,source:2,discover:1.5,desk:2.5,front:2.5,meeting:2.5,adsell:2,adsales:2,fsales:2.5,fbrand:2,fvision:1.5,column:1.5};
function misIdx(){return Math.floor(S.turn/4);}
function misMetric(k){if(k==='art')return S.totalArticles||0;if(k==='excl')return (S.items||[]).filter(i=>i.excl&&i.born>=S.mis.t0).length+(S.clips||[]).filter(c=>c.excl&&c.turn>=S.mis.t0&&c.by===S.name).length;if(k==='src')return (S.sources||[]).length;if(k==='trust')return Math.max(0,...(S.sources||[]).map(x=>x.trust||0));if(k==='fame')return Math.round(S.fame||0);return (S.mAct&&S.mAct[k])||0;}
// 결과 중심 미션: '버튼 N번'보다 '무엇을 이뤄라'. 지금 상태에서 해낼 수 있는 것만 고른다
const mine=()=>(S.clips||[]).filter(c=>!c.staff&&String(c.by||'').split(/[·,\s/]+/).includes(S.name));
const mClips=()=>mine().filter(c=>c.turn>=S.mis.t0);
const bmNow=()=>(S.beatM&&S.beatM[S.dept])||0;
const MIS_DEF={
 art:{h:'{invest} → {write}',v:()=>mClips().length},
 q60:{h:'확인된 사실을 많이 넣고 단계를 건너뛰지 말자',v:()=>mClips().filter(c=>(c.q||0)>=55).length},
 exw:{h:'쥐고 있는 단독 아이템으로 기사 쓰기',v:()=>mClips().filter(c=>c.excl).length},
 place:{h:'{pitch}로 자리를 받고 기사를 키우자',v:()=>mClips().filter(c=>c.place&&!/온라인/.test(c.place)).length},
 rb:{h:'{invest} 중 "반론 요청"을 받아 두고 기사에 넣기',v:()=>mClips().filter(c=>c.rb).length},
 slot:{h:'{pitch}',v:x=>(S.slotN||0)-x.b},
 excl:{h:'{hari}·{source}·{discover} — 이 미션이 있는 달엔 단독이 더 잘 붙는다',v:x=>{const had=new Set(x.ids||[]);return (S.items||[]).filter(i=>i.excl&&!had.has(i.id)).length+mClips().filter(c=>c.excl&&!had.has(c.iid)).length;}},
 beatm:{h:'{beat}·{source}·기사',v:x=>Math.floor(bmNow()-x.b)},
 trust:{h:'{source} — 같은 사람을 두 번 이상',v:x=>Math.max(0,...(S.sources||[]).map(s=>(s.trust||0)-((x.tb||{})[s.id]??(s.trust||0))))},
 nolost:{h:'단독은 타사 추격이 한 달 남으면 먼저 쓰기',v:x=>(S.lostN||0)>x.b?-99:1,end:1},
 src:{h:'{sasu}·새 취재원 뚫기',v:x=>(S.sources||[]).length-x.b},
 bigrep:{h:'{sasu}로 메모를 2건 이상 모은 뒤 {report}',v:x=>(S.bigRep||0)-x.b},
 caprel:{h:'{drink}·{colleague}',v:x=>{const c=colBy('cap');return c?Math.floor((c.rel||0)-x.b):0;}},
 fw:{h:'{front}에서 경쟁지를 이기기',v:x=>(S.fwWins||0)-x.b},
 mood:{h:'부서 사람들과·임금·처우를 챙기자',v:()=>Math.round(S.wMood??60),end:1},
 profit:{h:'광고 영업·수익 다변화·비용 관리',v:()=>S.co&&S.co.last&&S.co.last.profit>0&&S.co.last.t===S.mis.m?1:0,end:1},
 subs:{h:'구독 캠페인·브랜딩·디지털',v:x=>S.co?Math.round((S.co.subs/x.b-1)*1000)/10:0},
 fnewsx:{h:'품질·편집력을 올리고 기자에게 단독 아이템을 맡기자',v:x=>(S.fNewsX||0)-x.b},
 trustUp:{h:'정정에 솔직하고 확인된 기사로',v:x=>Math.round((S.trust-x.b)*10)/10},
 trustKeep:{h:'오보·낚시 제목·윤리 논란을 피하자 · 월말 확정',v:x=>S.trust>=x.b-.05?1:0,end:1},
 adq:{h:'광고·협찬 영업 (관계 좋은 광고주부터) · 월말 확정',v:()=>S.adqM&&S.mis&&S.adqM.m===S.mis.m&&S.adqM.ok?1:0,end:1},
 dad:{h:'광고 영업 화면의 "부서 광고 할당 현황"에서 부서원 독려 · 월말 확정',v:()=>S.dadM&&S.mis&&S.dadM.m===S.mis.m&&S.dadM.ok?1:0,end:1},
 dtop:{h:'초고함에서 꼼꼼히 데스킹하고 좋은 제목으로 출고',v:x=>((S.deskM&&S.deskM.top)||0)-x.b},
 pers:{h:'인사권 행사 — 실력·연차가 맞는 승진, 실력 낮은 간부 해임',v:x=>(S.persOk||0)-x.b},
 subw:{h:'취재 지시 — 유능한 기자에게 확인된 아이템을 맡기자',v:x=>(S.subDone||0)-x.b}};
function misH(h){return String(h||'').replace(/\{(\w+)\}/g,(m,k)=>{try{if(k==='sasu')return sasuN();if(ACT[k])return actName(k).replace(/\(.*\)/,'');}catch(e){}return m;});}
function subwDue(){const end=(misIdx()+1)*4;return (S.handoffs||[]).some(h=>h.sub&&h.due<end)||(S.fAsg||[]).some(a=>a.due<end);}
function misExclOn(){try{return !!(S&&S.mis&&S.mis.list&&S.mis.list.some(x=>x.k==='excl'&&!x.done));}catch(e){return false;}}
function misMake(){const r=S.rank,sim=!!S.simple,acts=rankActs();const can=id=>acts.includes(id)&&ACT[id]&&(['write','pitch','invest'].includes(id)?(!why(id)||/아이템/.test(why(id))):!why(id));const hasIt=(S.items||[]).length>0,hasEx=(S.items||[]).some(i=>i.excl);const L=[];
  const rel=k=>[...(ACT[k]?[k]:[]),...(MIS_TAG[k]||[])].filter(id=>acts.includes(id));
  const add=(k,g,t,o={})=>{if(L.some(x=>x.k===k))return;const ra=rel(k);if(ra.length&&!ra.some(can))return;const x={k,g,t,h:o.h||(MIS_DEF[k]&&MIS_DEF[k].h)||'',rel:!!o.rel,b:o.b??0,...(o.x||{})};L.push(x);};
  const pool=[];const P=(w,f)=>pool.push([w,f]);if(!S.founder&&r>=2&&r<=5&&can('assign')){P(r===2?1.3:1.7,()=>add('assign',r===2?1:2,`후배에게 취재 ${r===2?1:2}번 지시하기`,{h:'취재 지시'}));if(subwDue())P(1,()=>add('subw',1,'취재 지시한 기사 1건 내보내기',{b:S.subDone||0}));}if(S.op&&!S.founder)P(4,()=>add('editorial',2,'사설 2편 쓰기',{h:'사설 쓰기'}));if(!S.founder&&r===6&&can('hamyeong'))P(1.3,()=>add('hamyeong',1,'부장에게 기획 하명 1번',{h:'기획 하명'}));
  if(S.founder){if(can('write'))P(2,()=>add('art',1,'대표 이름으로 기사 1건 출고',{h:'{discover} → {invest} → {write} (기자에게 맡긴 기사는 제외)'}));P(2.5,()=>add('profit',1,'이번 달 흑자 내기',{rel:true}));if(S.co)P(1.5,()=>add('subs',sim?1:2,`구독자 ${sim?1:2}% 늘리기`,{b:S.co.subs,rel:true}));P(1.2,()=>add('trustUp',1,'신뢰도 1 올리기',{b:S.trust,rel:true}));if(can('fsales'))P(2,()=>add('fsales',1,'광고·후원 영업 1건 따내기',{h:'광고·후원 영업'}));if(can('fassign'))P(2.2,()=>add('fassign',(S.co&&S.co.staff||0)>=6?2:1,`기자에게 취재 ${(S.co&&S.co.staff||0)>=6?2:1}번 지시하기`,{h:'취재 지시'}));if(can('fassign')&&subwDue())P(1.2,()=>add('subw',1,'취재 지시한 기사 1건 내보내기',{b:S.subDone||0}));if((S.co&&S.co.staff||0)>=3)P(.45,()=>add('fnewsx',1,'편집국 단독 1건',{b:S.fNewsX||0}));if(can('exec'))P(1.2,()=>add('exec',1,'경영회의 주재하기',{h:'경영회의 주재'}));}
  else if(r===0){P(3,()=>add('sasu',sim?1:2,`${sasuN()} ${sim?1:2}번`,{h:`${sasuN()} (두 번째부터 "평소처럼 돌기")`}));P(2.5,()=>add('bigrep',1,'메모 2건 이상 모아 정보보고 1번',{b:S.bigRep||0}));P(2,()=>add('src',1,'새 취재원 1명 사귀기',{b:(S.sources||[]).length}));
    const cp=colBy('cap');if(cp&&(cp.rel||0)<70)P(1.5,()=>add('caprel',4,'캡과 관계 +4',{b:cp.rel||0}));}
  else if(r<=3){const BJ=bjDeskOn()&&(S.dq||[]).length>0;if(BJ){const dn=Math.min(2,(S.dq||[]).length);P(3,()=>add('desk',dn,`부서 초고 데스킹 ${dn}번`,{h:'데스킹 (부장 데스크 초고함)'}));}if(can('write')){P(BJ?1.2:3,()=>add('art',r===1&&!sim&&apBase()>=10?2:1,`${isTV()?'리포트':'기사'} ${r===1&&!sim&&apBase()>=10?2:1}건 ${OUT().type==='wire'?'송고':'출고'}`));if(hasIt)P(1.8,()=>add('q60',1,'완성도 55 이상 기사 1건'));if(hasEx)P(.9,()=>add('exw',1,'단독 기사 1건 출고'));if(hasIt&&!sim)P(1.2,()=>add('rb',1,'반론을 받은 기사 1건'));if(hasIt&&OUT().type!=='online')P(1.2,()=>add('place',1,isTV()?'단신이 아닌 정규 뉴스에 리포트 싣기':OUT().type==='wire'?'단신이 아닌 본기사로 송고하기':'온라인 단신이 아닌 지면에 기사 싣기'));}
    if(can('pitch'))P(1.5,()=>add('slot',1,`${jo2(actName('pitch'),'으로','로')} ${isTV()?'뉴스 순서':['wire','online','eng'].includes(OUT().type)?'출고 배정':'지면 배정'} 받기`,{b:S.slotN||0}));P(.35,()=>add('excl',1,'새 단독 아이템 1건 확보',{x:{ids:(S.items||[]).filter(i=>i.excl).map(i=>i.id)}}));if((acts.includes('beat')||acts.includes('source'))&&!S.founder&&S.rank>=1&&S.rank<=2&&bmNow()<88)P(1.3,()=>add('beatm',bmNow()>=60?3:4,`출입처 장악도 +${bmNow()>=60?3:4}`,{b:bmNow()}));
    if((S.sources||[]).length){const tb={};S.sources.forEach(x=>tb[x.id]=x.trust||0);P(1.2,()=>add('trust',8,'취재원 1명과 신뢰 +8',{x:{tb}}));}
    if(hasEx&&!sim)P(.8,()=>add('nolost',1,'이번 달 단독을 하나도 물먹지 않기',{b:S.lostN||0,rel:true}));
    if(r>=2&&can('desk')&&!BJ)P(1.6,()=>add('desk',1,'후배 기사 데스킹 1번',{h:'데스킹'}));if(r===1&&can('hari')&&!sim)P(.7,()=>add('hari',1,'뻗치기 1번',{h:'하리꼬미(뻗치기)'}));
    if(r>=2&&!S.founder&&can('adsell'))P(r>=3?.25:.5,()=>add('adsell',1,'광고·협찬 1건 따내기',{h:'광고·협찬 영업 (관계 좋은 광고주부터)'}));
    if(deptShared()&&quota()>0)P(r>=3?1.2:r===2?.8:.4,()=>add('dad',1,'이번 달 부서 광고 목표 페이스 맞추기',{rel:true}));
    if(BJ)P(1.1,()=>add('dtop',1,'데스킹한 기사 1건 1면·면 톱에 올리기',{b:(S.deskM&&S.deskM.top)||0}));
    if(r===3&&can('plan'))P(.9,()=>add('plan',1,'부서 기획회의 열기',{h:'부서 기획회의'}));}
  else{if(can('front'))P(2.5,()=>add('front',1,'1면 회의 이끌기',{h:'1면 회의'}));if(can('front'))P(1.5,()=>add('fw',1,'1면 대결에서 1승',{b:S.fwWins||0}));if(can('meeting'))P(1.6,()=>add('meeting',1,'편집회의 주재하기',{h:'편집회의 주재'}));
    if(S.co&&r>=5)P(1.4,()=>add('profit',1,'회사 이번 달 흑자',{rel:true}));if(r>=5||S.rank===7)P(1.2,()=>add('mood',60,'편집국 사기 60 이상 지키기',{rel:true}));
    const ad=['adsell','adsales'].find(can);if(ad)P(1.4,()=>add(ad,1,ad==='adsell'?'광고·협찬 1건 따내기':'광고주 영업 1번 나가기',{h:actName(ad)}));if(can('desk'))P(1.2,()=>add('desk',1,'데스킹 1번',{h:'데스킹'}));if(can('taskforce'))P(.8,()=>add('taskforce',1,'특별취재팀 꾸리기',{h:'특별취재팀'}));if(can('column'))P(.9,()=>add('column',1,'칼럼 1편 쓰기',{h:'칼럼 쓰기'}));
    if(r>=4&&r<=6&&quota()>0)P(1,()=>deptShared()?add('dad',1,'이번 달 부서 광고 목표 페이스 맞추기',{rel:true}):add('adq',1,'이번 달 광고 목표 페이스 맞추기',{rel:true}));
    if(r<7)P(.7,()=>add('trustKeep',1,'이번 달 신뢰도 지키기',{b:S.trust}));
    if(can('personnel'))P(1,()=>add('pers',1,'납득할 만한 인사 1건 (승진·해임)',{b:S.persOk||0}));
    if(can('assign'))P(1.3,()=>subwDue()?add('subw',1,'취재 지시한 기사 1건 내보내기',{b:S.subDone||0}):add('assign',1,'기자에게 취재 1번 지시하기',{h:actName('assign')}));
    if(can('tour'))P(.7,()=>add('tour',1,r===7?'현장 경영 나가기':'편집국 순시',{h:actName('tour')}));
    if(r>=5&&can('portal'))P(.7,()=>add('portal',1,'포털 제휴 전략 세우기',{h:'포털 제휴 전략'}));
    if(r>=5&&can('campaign'))P(.7,()=>add('campaign',1,r===5?'구독 캠페인 제안하기':'구독 캠페인 벌이기',{h:actName('campaign')}));
    if(r===7){if(can('exec'))P(1.8,()=>add('exec',1,'경영회의 주재하기',{h:'경영회의 주재'}));if(can('board'))P(1.2,()=>add('board',1,'이사회·대주주 보고하기',{h:'이사회·대주주 보고'}));if(S.co)P(.9,()=>add('subs',1,'구독자 1% 늘리기',{b:S.co.subs,rel:true}));P(.8,()=>add('trustKeep',1,'이번 달 신뢰도 지키기',{b:S.trust}));}}
  try{misExtra(r,sim,can,hasIt,P,add);}catch(e){console.error(e);}
  const want=sim?2:3;let g=0;while(L.length<want&&pool.length&&g++<30){let t=pool.reduce((a,x)=>a+x[0],0)*Math.random();let k=0;for(;k<pool.length;k++){t-=pool[k][0];if(t<=0)break;}const [w,f]=pool.splice(Math.min(k,pool.length-1),1)[0];f();}
  // 같은 것만 몰리지 않게: 첫 미션은 '결과' 미션이 되도록
  L.forEach(x=>{if(ACT[x.k])x.b=MIS_WIN[x.k]?((S.mWin&&S.mWin[x.k])||0):((S.mAct&&S.mAct[x.k])||0);});
  return L.slice(0,want);}
function misEnsure(){if(!S||S.phase!=='game'||S.story)return;const mi=misIdx();if(S.mis&&S.mis.m===mi)return;if(S.mis&&S.mis.list)S.misPrev=S.mis.list.map(x=>x.t+(x.done?':O':':X'));S.mAct={};S.mWin={};S.mis={m:mi,t0:S.turn,list:[],all:false};S.mis.list=misMake();}
// '따내기'처럼 결과가 있어야 하는 행동 미션은 시도가 아니라 성공을 센다
const MIS_WIN={fsales:1,adsell:1};
function misWin(id){misEnsure();S.mWin=S.mWin||{};S.mWin[id]=(S.mWin[id]||0)+1;try{misCheck();}catch(e){}}
function misCount(id){misEnsure();S.mAct=S.mAct||{};S.mAct[id]=(S.mAct[id]||0)+1;}
function misProg(x){const D=MIS_DEF[x.k];if(D){try{const v=D.v(x);return D.end&&!x.endOk?Math.min(v,x.g-1e-9>v?v:x.g-.0001):v;}catch(e){return 0;}}if(ACT[x.k]){if(MIS_WIN[x.k])return ((S.mWin&&S.mWin[x.k])||0)-(x.b||0);return ((S.mAct&&S.mAct[x.k])||0)-(x.b||0);}const v=misMetric(x.k);return x.rel?v:v-x.b;}
function misCheck(fin){if(!S.mis||!S.mis.list||S.story)return;if(fin)S.mis.list.forEach(x=>{if(MIS_DEF[x.k]&&MIS_DEF[x.k].end)x.endOk=1;});let got=0;S.mis.list.forEach(x=>{if(x.done){got++;return;}if(misProg(x)>=x.g){x.done=1;got++;const t=apply(S.founder?{eval:.6}:{eval:.8});toast(`미션 달성 — ${x.t} · ${t}`);log(`이달의 미션 달성: ${x.t}`);}});
  if(!S.mis.all&&S.mis.list.length&&got===S.mis.list.length){S.mis.all=true;S.misAP=1;const st=(S.misLast===S.mis.m-1?(S.misStreak||0):0)+1;S.misStreak=st;S.misLast=S.mis.m;toast(`이달의 미션 모두 달성! 다음 달 행동력 +1${st>=2?` · ${st}달 연속`:''}`);log('이달의 미션 모두 달성');
    if(st>0&&st%3===0){const t=apply({fame:3,eval:1.5});let x='';if(S.rank<=3&&!S.founder){const it=makeItem(S.dept,{excl:true,mult:1.1,keyConf:true});S.items.push(it);x=` · 단독 제보 「${it.title}」`;}log(`미션 ${st}달 연속 달성 보상`);Q.push(()=>openModal(`미션 ${st}달 연속 달성`,`<p class="lede">꾸준함이 소문났다. 데스크와 취재원 모두 나를 다시 본다.</p><p>${fxLine(t)}${x?`<p class="fx">${esc(x.slice(3))}</p>`:''}</p>`,[{label:'좋다'}]));}}}
function misSum(){try{const M=S.mis;if(!M||!M.list||!M.list.length)return '';misCheck();const n=M.list.filter(x=>x.done).length;return `<div class="mis" style="margin-bottom:10px"><div class="mish"><b>이달의 미션 ${n}/${M.list.length}</b><span>${M.all?'모두 달성 · 이번 달 행동력 +1':n?'일부 달성':'다음 달엔 할 일 맨 위 미션부터'}</span></div>${M.list.map(x=>`<div class="misr${x.done?' ok':''}"><i>${x.done?'✓':''}</i><span>${esc(x.t)}</span><em></em></div>`).join('')}</div>`;}catch(e){return '';}}
function misEnd(){/* 새 달이 되면 misEnsure가 새 미션을 만든다 */}
function misHTML(){if(S.story)return '';misEnsure();misCheck();const M=S.mis;if(!M||!M.list.length)return '';const n=M.list.filter(x=>x.done).length;
  return `${arcCard()}<div class="mis"><div class="mish"><b>${ic('trophy')}이달의 미션</b><span><b class="mcnt">${n}/${M.list.length}</b>${M.all?' · 다음 달 행동력 +1':'<span class="mlong"> · 다 하면 다음 달 행동력 +1</span>'}${(S.misStreak||0)>=1&&S.misLast>=M.m-1?` · 연속 ${S.misStreak}달 (3달마다 보상)`:''}</span></div>${M.list.map(x=>{const v=Math.min(x.g,Math.max(0,misProg(x)));const D=MIS_DEF[x.k];const show=x.done?'달성':D&&D.end?'월말 확정':x.rel?`지금 ${Math.max(0,Math.round(misProg(x)*10)/10)}`:`${Math.max(0,Math.floor(Math.min(x.g,misProg(x))))}/${x.g}`;return `<div class="misr${x.done?' ok':''}"${misActAttr(x)}><i>${x.done?'✓':''}</i><span>${esc(x.t)}${x.h&&!x.done?`<small>${esc(misH(x.h))}</small>`:''}</span><em>${show}</em></div>`;}).join('')}${promoLine()}</div>`;}
// 다음 승진까지 무엇이 모자란지 한 줄로
const MIS_TAG={art:['write','invest'],q60:['write','invest'],exw:['write'],place:['pitch','write'],rb:['invest','write'],slot:['pitch'],excl:['invest','discover','source','beat','hari'],beatm:['beat','source'],trust:['source'],nolost:['write','invest'],src:['sasu','source'],bigrep:['sasu','report'],caprel:['drink','colleague'],fw:['front'],adq:['adsell','adsales'],dad:['adsell'],dtop:['desk'],pers:['personnel'],subw:['assign','handoff','fassign'],mood:['deptlife','colleague','paypol','wage'],profit:['adsell','adsales','fsales','revenue','cut'],subs:['campaign','fbrand','digital'],trustUp:['write','fethics'],trustKeep:['write','fethics'],fame:['front','column','network','agenda'],assign:['assign']};
function misTag(id){try{if(S.story)return '';misEnsure();misCheck();const M=S.mis;if(!M)return '';const hit=M.list.some(x=>!x.done&&(x.k===id||(MIS_TAG[x.k]||[]).includes(id)));return hit?'<i class="mtag">미션</i>':'';}catch(e){return '';}}
function promoLine(){try{if(S.founder||S.rank>=7||S.rank===0||nextRank(S.rank)==null)return '';const m=promoMinW(S.rank);const need=[];if(S.inRank<m)need.push(`재직 ${moTxt(m-S.inRank)}`);if(S.eval<promoEv(S.rank))need.push(`평가 ${Math.ceil(promoEv(S.rank)-S.eval)}`);if(S.fame<promoFm(S.rank))need.push(`평판 ${Math.ceil(promoFm(S.rank)-S.fame)}`);
  return `<p class="misp">${rankName(nextRank(S.rank))}까지 ${need.length?need.join(' · ')+' 더':'조건 충족 — 다음 정기 인사를 기다린다'}${need.some(x=>x.startsWith('평가'))?' · 미션 하나 = 평가 +0.8, 기사 1건 = 평가 +2~5':''}</p>`;}catch(e){return '';}}

// ===== 지면 연출: 내 기사가 1면·첫 꼭지에 실리면 내일 자 지면을 보여 준다 =====
// 5.7 출고 지면 일러스트: 남색 제목 띠 위에 실제 제목을 얹는다
const PAPER_BOX={front:[21.4,8.75,83.3,9.7],sec:[19.3,9.6,57.7,7.8],web:[17.2,9.6,73.3,7.8]};
function paperHTML(c,kind){const b=PAPER_BOX[kind];if(!IMG['paper_'+kind])return '';return `<div class="paperv pv-${kind}">${imgTag('paper_'+kind,'pvimg')}<b class="pvh" style="top:${b[0]}%;left:${b[1]}%;width:${b[2]}%;height:${b[3]}%"><span>${esc(c.h||'')}</span></b>${c.quote&&kind==='front'?`<i class="pvq" style="top:${b[0]+b[3]+.8}%;left:${b[1]}%;width:${b[2]}%">“${esc(c.quote)}”</i>`:''}</div>`;}
function pageHTML(c,place){const o=OUT();const tv=isTV();const top=place.k==='front';
  if(tv)return `<div class="tvpage"><div class="tvbar"><b>${esc(o.n)}</b><span>${top?'메인뉴스 첫 꼭지':'메인뉴스'} · ${esc(c.date)}</span></div><div class="tvlow"><i>${c.excl?'단독':'뉴스'}</i><b>${esc(c.h.replace('[단독] ',''))}</b></div><p>${esc(c.lead)}</p><div class="by">${esc(byN(c.by||S.name))} 기자 리포트</div></div>`;
  const no=1000+Math.floor(S.turn*1.75);
  return `<div class="npage${top?' top':''}"><div class="nmast"><span>${dateStr()} · 제${no.toLocaleString('ko-KR')}호</span><b>${esc(o.n)}</b><span>${top?'1면 톱':'1면'}</span></div><div class="nbody"><div class="nmain">${c.excl?'<i class="nx">단독</i>':''}<h3>${esc(c.h.replace('[단독] ',''))}</h3><p class="nlead">${esc(c.lead)}</p><div class="by">${esc(byN(c.by||S.name))} 기자</div><div class="ncol"><i></i><i></i><i></i><i style="width:70%"></i></div></div><div class="nside"><i></i><i></i><i style="width:60%"></i><div class="nimg"></div><i></i><i style="width:80%"></i></div></div></div>`;}
// ===== 수습 공동 바이라인: 굵직한 정보보고가 선배 기사로 이어지면 내 이름도 올라간다 =====
// 같은 부서 명단(같은 부서 탭)에 있는 선배가 쓴다: 부서장은 빼고 3년 차 이상 · 없으면 캡
function rkSenior(){let M=[];try{M=deptMates().filter(m=>(m.r||0)<2&&myrs(m)>=3);}catch(e){}if(M.length){const m=pick(M.sort((a,b)=>(b.rel||0)-(a.rel||0)).slice(0,3));return{name:m.name,t:`${MR[m.r||0]==='기자'?'':MR[m.r||0]+' '}`,m};}const c=colBy('cap');return c?{name:c.name,t:'캡 ',c}:null;}
function rkCoBy(mm){if(S.rank!==0||mm<3||!chance(.18+mm*.04))return;const sr=rkSenior();const it=makeItem(S.dept,{mult:.8});const by=`${sr?sr.name:'선배'}·${S.name}`;if(sr&&sr.m)sr.m.rel=clamp((sr.m.rel||0)+6,-50,100);if(sr&&sr.c)relUp(sr.c,4,'공동 바이라인');
  const clip={h:it.title,o:OUT().n,d:it.d,q:R(55,70),imp:Math.round(it.imp*.8),excl:false,date:dateShort(),turn:S.turn,views:R(8,40)*1000,lead:`${it.subj||'관계 기관'} 쪽에서 확인된 내용이다. 수습기자의 새벽 정보보고가 실마리가 됐다.`,by,place:'사회면',base:it.base,chain:0,co:1};
  S.clips.unshift(clip);S.coBy=(S.coBy||0)+1;const t=apply({eval:2,fame:.6});log(`첫 공동 바이라인: ${it.title}`);
  Q.push(()=>openModal('내 이름이 실렸다',`<p class="lede">같은 ${DEPTS[S.dept].n} ${sr?esc(sr.t+sr.name)+' 선배':'선배'}가 내 정보보고를 바탕으로 기사를 썼다. 바이라인에 내 이름이 같이 올라갔다.</p>${clipHTML(clip)}${fxLine(t)}`,[{label:'기사를 오려 둔다'}]));}
// ===== 진행 중인 이야기: 몇 달에 걸쳐 이어지는 일을 한곳에 =====
function storyThreads(){const L=[];const T=S.turn;
  (S.items||[]).filter(i=>i.excl).slice(0,3).forEach(i=>L.push({c:i.heat<=1?'r':'s',k:'단독',t:i.title,n:i.heat<=1?'타사가 바짝 쫓아온다 — 이번 달 안에 써야 한다':`확인 ${i.facts.filter(fOK).length}/${i.facts.length} · 서두르면 오보, 늦으면 물먹는다`}));
  (S.items||[]).filter(i=>i.chain>=1&&!i.excl).slice(0,2).forEach(i=>L.push({c:'s',k:`후속 ${i.chain}`,t:i.title,n:'지난 기사의 후속. 쓰면 시리즈가 된다'}));
  (S.medQ||[]).slice(0,2).forEach(m=>L.push({c:'r',k:'분쟁',t:m.h,n:`${jo2(m.subj||'당사자','이','가')} 문제를 제기했다 · ${wkTxt(m.due-T)} 뒤 결론`}));
  if(S.arc)Object.keys(S.arc).slice(0,2).forEach(id=>{if(ENT[id])L.push({c:'r',k:'광고주',t:ENT[id].n,n:'비판 보도 뒤 냉랭하다 · 광고가 걸려 있다'});});
  if(S.rival&&S.rival.name){const me=(S.clips||[]).filter(c=>c.excl&&c.by===S.name).length;L.push({c:'',k:'라이벌',t:`${S.rival.name} (${(OUTLETS.find(x=>x.id===S.rival.outlet)||{}).n||'타사'})`,n:`단독 대결 나 ${me} : ${S.rival.wins||0} 상대`});}
  if(S.protege)L.push({c:'',k:'제자',t:S.protege,n:'키우는 후배'});
  return L.slice(0,6);}
function threadsHTML(){const L=storyThreads();if(!L.length)return '';return `<div class="sec">진행 중인 이야기</div><div class="thr">${L.map(x=>`<div class="th ${x.c}"><i>${esc(x.k)}</i><div><b>${esc(x.t)}</b><span>${esc(x.n)}</span></div></div>`).join('')}</div>`;}

// ===== 기록 탭: 달별로 묶고 종류별로 거른다 =====
const LOG_CAT=[
 ['goal','성과','#9be38a',/미션|업적|기자상|목표|수상|달성|엔딩|클리어|대특종/],
 ['trouble','사건','#ff6b6b',/오보|소송|징계|중재|논란|패소|적발|리베이트|해킹|위기|무단|경고|강등|표절|정정/],
 ['art','기사','#ffcf5a',/출고|단독|특종|속보|기사|칼럼|바이라인|1면|시리즈|스크랩|발제|지면|배정|데스킹/],
 ['news','취재','#6fd6ff',/취재원|제보|아이템|정보보고|라인|사쓰마와리|낙종|물먹|브리핑|명함|발굴|하리꼬미|주재|연줄|출입처/],
 ['career','인사','#b9a6ff',/승진|발령|인사|입사|이직|퇴사|정년|명예퇴직|수습|임기|선임|사표|채용|퇴임|은퇴|부서 이동/],
 ['money','돈','#4fd1a5',/월급|통장|광고|매출|투자|자금|성과급|후원|구독|흑자|적자|수익|단가|내 집|대출|부업/],
 ['people','사람','#f9a8d4',/동료|선배|후배|캡|부장|동기|관계|술자리|결혼|제자|멘토|부서원|사진기자|화해/]];
function logCat(t){t=String(t||'').replace(/「[^」]*」/g,'').replace(/\([^)]*완성도[^)]*\)/g,'');for(const c of LOG_CAT)if(c[3].test(t))return c;return ['etc','기타','#9fb3d9',null];}
function logDate(d){const m=/^(\d+)\.(\d+)$/.exec(d||'');return m?`20${m[1]}년 ${+m[2]}월`:(d||'');}
function logTabHTML(){const f=S.logF||'all';const all=(S.log||[]).map(l=>({...l,c:logCat(l.t)}));const cards=(S.cardLog||[]).map(l=>({d:l.d,t:l.t,x:l.x,c:logCat(l.t+' '+l.x),card:1}));
  const L=f==='card'?cards:all.filter(l=>f==='all'||l.c[0]===f);
  const cnt=k=>k==='all'?all.length:k==='card'?cards.length:all.filter(l=>l.c[0]===k).length;
  const keys=['all',...LOG_CAT.map(c=>c[0]).filter(k=>cnt(k)>0),...(cards.length?['card']:[])];const nm=k=>k==='all'?'전체':k==='card'?'결과 카드':LOG_CAT.find(c=>c[0]===k)[1];
  const chips=`<div class="acat lchips">${keys.map(k=>`<button class="achip" data-lf="${k}" aria-pressed="${k===f}">${nm(k)}<small>${cnt(k)}</small></button>`).join('')}</div>`;
  if(!L.length)return chips+'<p class="empty">아직 기록이 없다.</p>';
  let h='',cur=null;L.slice(0,120).forEach(l=>{if(l.d!==cur){if(cur!==null)h+='</ul>';cur=l.d;h+=`<div class="lgm">${esc(logDate(l.d))}</div><ul class="lgl">`;}
    h+=`<li style="--k:${l.c[2]}"><i>${l.c[1]}</i><span>${l.card?`<b>${esc(l.t)}</b>${l.x?` <em>${esc(l.x)}</em>`:''}`:esc(l.t)}</span></li>`;});
  return chips+h+'</ul>';}

// ===== 커리어 이정표: 1년 안팎에 닿을 만한 작은 목표들이 차례로 열린다 =====
const myClips=()=>(S.clips||[]).filter(c=>String(c.by||'').includes(S.name));
const MILES=[
 {id:'m_art1',n:'첫 바이라인',d:'기사 1건 출고',v:()=>S.totalArticles||0,g:1,rw:{eval:1}},
 {id:'m_src5',n:'명함첩',d:'취재원 5명',v:()=>(S.sources||[]).length,g:5,rw:{net:1}},
 {id:'m_ex1',n:'첫 단독',d:'단독 기사 1건',v:()=>myClips().filter(c=>c.excl).length,g:1,rw:{fame:2}},
 {id:'m_art10',n:'열 번째 기사',d:'기사 10건 출고',v:()=>S.totalArticles||0,g:10,rw:{eval:1.5,wri:1}},
 {id:'m_front1',n:'첫 1면',d:'1면(첫 꼭지)에 기사 싣기',v:()=>myClips().filter(c=>/1면|첫 꼭지/.test(c.place||'')).length,g:1,rw:{fame:3}},
 {id:'m_src10',n:'두꺼운 수첩',d:'취재원 10명',v:()=>(S.sources||[]).length,g:10,rw:{net:1.5}},
 {id:'m_trust',n:'믿는 사람',d:'신뢰 60 이상 취재원 1명',v:()=>Math.max(0,...(S.sources||[]).map(x=>x.trust||0)),g:60,rw:{fame:1.5}},
 {id:'m_ex5',n:'단독 사냥꾼',d:'단독 기사 5건',v:()=>myClips().filter(c=>c.excl).length,g:5,rw:{fame:3,eval:1}},
 {id:'m_art30',n:'서른 번째 기사',d:'기사 30건 출고',v:()=>S.totalArticles||0,g:30,rw:{eval:2,wri:1}},
 {id:'m_promo',n:'첫 승진',d:'평기자에서 한 단계 위로',v:()=>S.founder?1:Math.max(0,S.rank-1),g:1,rw:{money:200}},
 {id:'m_front5',n:'1면의 단골',d:'1면 기사 5건',v:()=>myClips().filter(c=>/1면|첫 꼭지/.test(c.place||'')).length,g:5,rw:{fame:4}},
 {id:'m_award',n:'수상 기자',d:'기자상 1회',v:()=>S.awards||0,g:1,rw:{fame:3}},
 {id:'m_ex15',n:'특종 기자',d:'단독 기사 15건',v:()=>myClips().filter(c=>c.excl).length,g:15,rw:{fame:5,eval:2}},
 {id:'m_big',n:'대특종',d:'대특종 1건',v:()=>S.bigScoops||0,g:1,rw:{fame:6}}];
function milesNext(n){S.miles=S.miles||{};return MILES.filter(m=>!S.miles[m.id]).slice(0,n||3);}
function milesTick(){if(!S||S.phase!=='game'||S.story)return;S.miles=S.miles||{};let first=!S.milesInit;S.milesInit=1;
  MILES.forEach(m=>{if(S.miles[m.id])return;let v=0;try{v=m.v();}catch(e){}if(v>=m.g){S.miles[m.id]=dateShort();if(first)return;const t=apply(m.rw);log(`이정표 달성 — ${m.n}`);toast(`이정표 달성: ${m.n} · ${t}`);}});}
function milesHTML(){if(S.story)return '';try{milesTick();}catch(e){}const L=milesNext(3);const done=MILES.filter(m=>(S.miles||{})[m.id]).length;if(!L.length)return '';
  return `<div class="sec">커리어 이정표 ${done}/${MILES.length}</div><div class="mile">${L.map(m=>{let v=0;try{v=m.v();}catch(e){}const p=Math.min(1,v/m.g);return `<div class="ml">${imgTag(p>=.5?'med_silver':'med_bronze','mmed')}<div><b>${esc(m.n)}</b><span>${esc(m.d)} · 보상 ${Object.entries(m.rw).map(([k,x])=>(STN[k]||{eval:'평가',fame:'평판',money:'통장'}[k]||k)+' +'+x+(k==='money'?'만':'')).join(' ')}</span></div><em>${m.g>=20&&m.id==='m_trust'?Math.round(v):Math.min(v,m.g)}/${m.g}</em><i style="--p:${Math.round(p*100)}%"></i></div>`;}).join('')}</div>`;}

// ===== 라이벌이 살아 움직인다: 같은 아이템 추격 · 라이벌 특종 · 기자실 술자리 · 라이벌의 이동 · 인정 =====
const rvOn=()=>S.rival&&S.rival.name&&!S.story&&!S.founder&&S.rank>=1&&S.rank<=3;
const rvN=()=>esc(rvLabel(S.rival));
const myEx=()=>(S.clips||[]).filter(c=>c.excl&&String(c.by||'').includes(S.name)).length;
// 라이벌은 한참 앞서면 느슨해지고, 내가 앞서면 더 바짝 붙는다 (난이도별로 간격이 다르다)
function rvGap(){return S.rival?(S.rival.wins||0)-myEx():0;}
function rvRoom(){const lim=DF()===DIFF.easy?0:DF()===DIFF.hard?3:1;return rvGap()<=lim;}
function rvPress(){if(!S.rival)return 0;const g=rvGap();const d=DF()===DIFF.easy?.7:DF()===DIFF.hard?1.2:1;const r=(S.rival.rel||0)>=20?.8:1;const band=g>=3?.6:g<=-3?1.25:1;return (.04+S.rival.skill/1500)*d*r*band;}
const RIVAL_EV=[
 {w:3,c:()=>rvOn()&&S.items.some(i=>i.excl&&i.heat>=2),run:()=>{const it=S.items.filter(i=>i.excl).sort((a,b)=>b.imp-a.imp)[0];
   openModal('라이벌이 냄새를 맡았다',`<p class="lede">${jo2(rvN(),'이','가')} 「${esc(it.title)}」 쪽을 들쑤시고 다닌다는 얘기가 들린다. 같은 사람에게 전화를 돌렸다고 한다.</p><p class="hint">타사 추격까지 ${heatTxt(it.heat)}. 늦으면 물먹고, 서두르면 확인이 덜 된다.</p>`,[
    {label:'오늘 밤 확인을 끝낸다',sub:'컨디션 -12 · 확인 안 된 사실 하나를 바로 확인할 수 있다',fn:()=>{S.hp=clamp(S.hp-12,0,100);const f=it.facts.find(x=>!fOK(x));if(f&&chance(.65)){f.conf++;f.via.push('밤샘 확인');toast(`밤새 매달렸다 — ${f.t} 확인`);}else toast('밤새 매달렸지만 확인은 내일로 넘어갔다');}},
    {label:'헛다리 정보를 흘려 따돌린다',sub:'성공하면 시간을 번다 · 들키면 업계에 소문',fn:()=>{if(chance(.5)){it.heat+=2;toast(`${jo2(S.rival.name,'이','가')} 엉뚱한 곳을 파고 있다. 시간을 벌었다`);}else{it.heat=Math.max(1,it.heat-1);toast(apply({trust:-1.2,fame:-.5}));}}},
    {label:'내 페이스대로 간다',sub:'아무것도 하지 않는다 · 추격이 빨라진다',fn:()=>{it.heat=Math.max(1,it.heat-1);toast('내 속도대로 가기로 했다');}}]);}},
 {w:2,c:()=>rvOn()&&rvRoom(),run:()=>{const it=makeItem(S.dept,{excl:false,mult:.9,pre:1});S.rival.wins=(S.rival.wins||0)+1;tick(`[${(OUTLETS.find(x=>x.id===S.rival.outlet)||{}).n||'타사'}] [단독] ${it.title}`);
   openModal('라이벌의 단독',`<p class="lede">아침 포털 1위는 ${rvN()}의 단독 「${esc(it.title)}」. ${jo2(bossT(),'이','가')} 기사를 출력해 책상에 올려놓았다.</p><p class="hint">단독 대결 나 ${myEx()} : ${S.rival.wins} 상대</p>`,[
    {label:'후속으로 받아친다',sub:'더 깊은 후속 아이템을 얻는다 · 기사로 써야 만회',fn:()=>{S.items.push(it);toast(`「${it.title}」 후속 취재를 시작한다`);}},
    {label:'"우리도 쥐고 있었다"고 보고한다',sub:`${bossT()} 앞에서 체면은 산다 · 사실이 아니면 들킨다`,fn:()=>{if(S.items.some(i=>i.excl))toast(apply({eval:.5}));else toast(apply({eval:-1.2}));}},
    {label:'깔끔하게 인정하고 축하 문자를 보낸다',sub:'평판 조금↑ · 라이벌과 사이가 나아진다',fn:()=>{S.rival.rel=(S.rival.rel||0)+10;toast(apply({fame:.4,men:.3}));}}]);}},
 {w:2,c:()=>rvOn()&&S.turn%4===0,run:()=>{const good=(S.rival.rel||0)>=10;
   openModal('기자실 술자리',`<p class="lede">마감 뒤 기자실 옆 호프집. ${jo2(rvN(),'이','가')} 맞은편에 앉았다. "${good?'오늘은 내가 살게.':'요즘 잘나가더라?'}"</p>`,[
    {label:'정보를 하나씩 맞바꾼다',sub:good?'관계가 좋아 믿을 만하다':'믿을 수 있을지 모른다',fn:()=>{if(chance(good?.75:.45)){const x=makeItem(S.dept,{pre:1,mult:.85});S.items.push(x);toast(`받은 정보 → 「${x.title}」`);}else{const ex=S.items.find(i=>i.excl);if(ex)ex.heat=Math.max(1,ex.heat-1);toast('내 얘기만 털렸다. 찜찜하다');}S.rival.rel=(S.rival.rel||0)+4;}},
    {label:'업계 소문만 듣는다',sub:'이직·인사 소식을 듣는다 · 상식↑',fn:()=>{gain('kno',.4);toast(`"${pick(['우리 회사 경력 공채 곧 나온대.','너희 부장 다음 인사 때 옮긴다던데?','요즘 포털이 단독 배치를 바꿨대.','○○일보 탐사팀이 사람 찾더라.'])}"`);}},
    {label:'한 잔만 하고 일어선다',sub:'컨디션을 아낀다',fn:()=>{S.hp=clamp(S.hp+4,0,100);toast('한 잔만 하고 먼저 일어났다');}}]);}},
 {w:1,c:()=>rvOn()&&S.turn-(S.rvMoveT||0)>YW*2&&S.turn>YW,run:()=>{S.rvMoveT=S.turn;const big=OUTLETS.filter(x=>!x.closed&&!x.custom&&x.id!==S.outlet&&x.p>=((OUTLETS.find(y=>y.id===S.rival.outlet)||{p:3}).p));const to=pick(big.length?big:OUTLETS.filter(x=>!x.closed&&x.id!==S.outlet));const from=(OUTLETS.find(y=>y.id===S.rival.outlet)||{}).n||'';S.rival.outlet=to.id;S.rival.skill+=3;
   log(`라이벌 ${S.rival.name}, ${from} → ${to.n} 이직`);openModal('라이벌의 이직',`<p class="lede">${esc(S.rival.name)} 기자가 ${esc(from)}에서 <b>${esc(to.n)}</b>로 옮겼다. 축하 문자 끝에 한 줄이 붙어 있었다. "다음엔 더 큰 판에서 보자."</p>`,[{label:'자극을 받는다',sub:'멘탈↑',fn:()=>gain('men',.6)}]);}},
 {w:4,c:()=>rvOn()&&!S.rvBeat&&myEx()>=(S.rival.wins||0)+4,run:()=>{S.rvBeat=1;const t=apply({fame:2.5,eval:1});log(`라이벌 ${jo2(S.rival.name,'이','가')} 인정했다`);
   openModal('라이벌이 인정했다',`<p class="lede">${rvN()}에게서 문자가 왔다. "요즘 네 단독은 진짜 못 따라가겠다. 한 번 밥 살게."</p><p class="hint">단독 대결 나 ${myEx()} : ${S.rival.wins||0} 상대</p>${fxLine(t)}`,[{label:'밥 얻어먹으러 간다',fn:()=>{S.rival.rel=(S.rival.rel||0)+15;}}]);}}];
EVENTS.push(...RIVAL_EV);

// ===== 불쾌함 줄이기: 다음엔 팁 · 미리 경고 · 연속 악재 쉬어 가기 · 자동 저장 · 1년 결산 =====
function tipN(t){return t?`<p class="tipn"><b>다음엔</b>${esc(t)}</p>`:'';}
function calmSet(w){S.calmT=Math.max(S.calmT||0,S.turn+(w||8));}
// 할 일 위 경고 상자: 손해 보기 전에 알려 준다
function warnHTML(){if(!S||S.phase!=='game')return '';const W=[];try{
  (S.items||[]).filter(i=>i.excl&&!i.story&&i.heat<=1).slice(0,2).forEach(i=>W.push(['r',`「${i.title}」 — 이번 달 안에 안 쓰면 타사에 물먹는다`]));
  (S.items||[]).filter(i=>i.slot&&i.slot.due<=S.turn+4).slice(0,2).forEach(i=>W.push(['r',`「${i.title}」 — ${SLOT[i.slot.g].n} 마감이 이번 달이다`]));
  if(S.hp<30)W.push(['s',`컨디션 ${Math.round(S.hp)} — 낮으면 취재 실패·실수가 잦다. 휴식을 고려하자`]);
  if(S.rank>0&&!S.founder&&S.eval<=18)W.push(['r',`${evalName()} ${Math.round(S.eval)} — 바닥이 몇 달 이어지면 권고사직이다. 미션과 기사로 끌어올리자`]);
  if(S.trust<=18)W.push(['r',`신뢰도 ${Math.round(S.trust)} — 오보가 한 번 더 나오면 위험하다. 확인 안 된 사실은 빼고 쓰자`]);
  if(S.money<0)W.push(['s','통장이 마이너스다 — 생활이 쪼들리면 멘탈이 깎인다']);
  if(S.founder&&S.co&&typeof fBankLine==='function'&&S.co.cash<fBankLine()+3)W.push(['r',`회사 자금 ${eok(S.co.cash)} — 파산선에 가깝다. 영업·후원·투자를 챙기자`]);
  try{if(advOn()){const k=qMon(),qq=quota(),got=myQ();if(qq>0&&got<qq){const exp=qq*(k-1)/QM,pace=k>1?got/exp:1,lab=deptShared()?'부서 반기 광고 목표':'반기 광고 목표';
    if(k>=QM-1&&got<qq*(k-1)/QM*.95)W.push([k===QM?'r':'s',`${lab}까지 ${eok(qq-got)} 남았다 (지금 ${Math.round(got/qq*100)}%) — 반기 마감이 ${k===QM?'이번 달':'다음 달'}이다. 광고·협찬 영업을 챙기자`]);
    else if(k>=3&&pace<.75)W.push(['s',`${lab} 페이스가 처졌다 (지금 ${Math.round(got/qq*100)}%) — 사람 탭 › 광고 영업에서 확인하자`]);}}}catch(e){}
  if(!S.founder&&S.rank>=1&&S.rank<=6&&S.turn%24>=20&&nextRank(S.rank)!=null){const ln=promoLine().replace(/<[^>]+>/g,'').trim();if(ln&&!/조건 충족/.test(ln))W.push(['',`다음 달 정기 인사 — ${ln}`]);}
  }catch(e){}
  if(!W.length)return '';return `<div class="warnbox">${W.slice(0,4).map(([c,t])=>`<div class="wb ${c}"><i>${c==='r'?'!':c==='s'?'·':'i'}</i><span>${esc(t)}</span></div>`).join('')}</div>`;}
// 매달 자동 저장 3개 (최근 3달)
const AUTOKEY=i=>'byline-auto-'+i;
function autoSave(){if(!S||S.phase!=='game'||S.dev)return;try{for(let i=2;i>0;i--){const v=localStorage.getItem(AUTOKEY(i-1));if(v)localStorage.setItem(AUTOKEY(i),v);}localStorage.setItem(AUTOKEY(0),JSON.stringify({t:Date.now(),label:`${S.name} · ${OUT().n} ${rankName()} · ${dateStr()}`,S}));}catch(e){}}
function autoInfo(i){try{const v=localStorage.getItem(AUTOKEY(i));return v?JSON.parse(v):null;}catch(e){return null;}}
// 1년 결산: 12월 결산 뒤 한 해를 한 장으로
function yrSnapOld(){return{turn:S.turn,arts:S.totalArticles||0,ex:(S.clips||[]).filter(c=>c.excl&&String(c.by||'').includes(S.name)).length,fr:(S.clips||[]).filter(c=>String(c.by||'').includes(S.name)&&/1면|첫 꼭지/.test(c.place||'')).length,fame:S.fame,eval:S.eval,money:S.money,rank:S.rank,rv:(S.rival&&S.rival.wins)||0,ml:Object.keys(S.miles||{}).length,src:(S.sources||[]).length,aw:S.awards||0};}
function yearRecapOld(){const a=S.yr0;const b=yrSnap();S.yr0=b;if(!a||S.story)return;const d=(k)=>b[k]-a[k];const yr=2027+Math.floor((S.turn-1)/YW);
  const best=(S.clips||[]).filter(c=>c.turn>=a.turn&&String(c.by||'').includes(S.name)).sort((x,y)=>(y.imp||0)-(x.imp||0))[0];
  const row=(n,v,u)=>`<div><span>${n}</span><b>${v}${u||''}</b></div>`;const sg=v=>(v>0?'+':'')+Math.round(v);
  openModal(`${yr}년 결산`,`<p class="lede">${esc(S.name)} ${rankName()}의 ${yr}년.</p><div class="kv">${row('출고',d('arts'),'건')}${row('단독',d('ex'),'건')}${row('1면',d('fr'),'번')}${row('새 취재원',Math.max(0,d('src')),'명')}${row(evalName(),sg(d('eval')))}${row('평판',sg(d('fame')))}${row('통장',sg(d('money')),'만')}${row('이정표',d('ml'),'개')}</div>${best?`<p class="hint" style="margin-top:10px">올해의 기사</p>${clipHTML(best,1)}`:''}${S.rival&&S.rival.name?`<p class="hint">라이벌 ${esc(S.rival.name)}에게 물먹은 횟수 올해 ${d('rv')}번</p>`:''}${b.rank>a.rank?`<p class="fx">올해 ${ro2(rankName())} 승진했다.</p>`:''}`,[{label:'새해를 시작한다'}]);}