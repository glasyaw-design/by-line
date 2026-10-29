// 1.7 · 반복 사건의 기억 · 부서별 사건 · 오보 복기 · 지분 인수 2단계 · 후계자 · 연말 기자상 · 취재원 인생 · 대표 통장 · 맡기기 「관계」
// 예전 파일 v65.js · v66.js를 순서 그대로 이어 붙였다

// ───── (예전 v65.js) ─────
/* 바이라인 — src/compat/v65.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.7 이야기가 이어지게: 반복 이벤트의 기억 · 부서별 사건 · 오보 복기 =====

// ---------- 1) 반복 이벤트는 지난번 내 선택을 기억한다 ----------
// 사람마다 다른 한 줄: 같은 사건이 두 번째부터는 「지난번엔 이렇게 했다」로 이어진다
const MEM65={
 '오보 논란':{'즉시 정정보도를 낸다':'지난번엔 바로 정정했다. 편집국은 이번에도 같은 판단을 기대하는 눈치다.','버틴다':'지난번엔 버텼다. 이번엔 상대 쪽 변호사가 그때 기사부터 꺼내 들었다.'},
 '회장님 사진':{'싣는다':'"지난번에도 실어 주셨잖아요." 홍보실은 이제 당연하다는 투다.','광고면에만 싣겠다고 한다':'지난번에 광고면으로 돌렸던 걸 기억하는지, 홍보실이 이번엔 조심스럽게 운을 뗐다.'},
 '보복':{'*':'이번이 처음이 아니다. 저쪽은 우리 대응 방식을 이미 알고 있다.'},
 '광고주의 조건':{'거절한다':'지난번에 거절당한 걸 아는지, 조건이 더 교묘해졌다.','써 준다':'"지난번처럼만 해 주시면 됩니다." 이제 부탁도 아니다.'},
 '조건부 거래':{'기사를 접는다':'지난번에 기사를 접어 준 걸 그쪽은 잊지 않았다. 이번엔 제안 금액이 더 낮다.','"기사는 기사입니다"':'지난번에 거절당한 쪽이 이번엔 더 큰 예산을 들고 왔다.'},
 '정부 광고 축소':{'*':'또다시 우리만 빠졌다. 이번엔 우연이라고 보기 어렵다.'},
 '광고주 대이탈':{'편집 방향을 지킨다':'한 번 버텨 본 경험이 있다. 독자들도 그때를 기억한다.','논조를 조절한다':'지난번에 물러선 걸 광고주들이 기억한다. 이번엔 요구가 더 세다.'},
 '고위 인사의 부탁':{'거래한다':'"그때처럼." 그는 웃으며 잔을 채웠다.','거절한다':'그는 지난번 거절을 기억했다. 이번엔 조건을 바꿔 왔다.'},
 '대주주의 전화':{'*':'대주주의 전화는 이번이 처음이 아니다. 편집국이 숨을 죽이고 지켜본다.'},
 '압수수색':{'편집국 앞을 막아선다':'지난번처럼 기자들이 먼저 문 앞에 섰다.','협조한다':'지난번 협조 이후 취재원 몇이 연락을 끊었다. 이번엔 기자들 표정이 다르다.'}};
function memPick65(t,c){const M=MEM65[t];const last=(S.mem65||{})[t];if(!M||!last)return null;const ago=Math.max(1,Math.round((S.turn-last.t)/4));const line=M[last.l]||M['*'];return line?`<p class="hint mem65">${ago}개월 전 「${esc(last.l)}」 — ${esc(line)}</p>`:null;}
{const _om65=openModal;openModal=function(t,b,c){try{if(S&&S.phase==='game'&&MEM65[t]&&Array.isArray(c)){const m=memPick65(t,c);if(m&&typeof b==='string')b=b.replace(/(<\/p>)/,'$1'+m);
    c=c.map(x=>{if(!x||typeof x!=='object'||x.cls==='ghost')return x;const f=x.fn;return Object.assign({},x,{fn:function(){try{S.mem65=S.mem65||{};S.mem65[t]={l:x.label,t:S.turn};}catch(e){}return f?f.apply(this,arguments):undefined;}});});}}catch(e){}return _om65.call(this,t,b,c);};}

// ---------- 2) 부서마다 그 부서다운 사건 ----------
const dk65=()=>S&&S.dept;const isD=(...L)=>L.includes(dk65());const r03=()=>S.rank>=1&&S.rank<=3&&!S.founder&&!S.story&&!(typeof isSpec==='function'&&isSpec()&&false);
const DEV65=[
 // 스포츠
 {w:1.4,c:()=>r03()&&isD('spo','base','foot','culspo'),run:()=>openModal('승부조작 제보',`<p class="lede">불법 도박 사이트 운영자라는 사람이 문자를 보냈다. "다음 주 경기, 3회에 볼넷 두 개. 보시면 압니다."</p>`,[
   {label:'경기를 직접 지켜보고 확인한다',sub:'맞으면 대형 단독 · 시간이 든다',fn:()=>{S.ap=Math.max(0,S.ap-1);if(chance(.55)){const it=makeItem(S.dept,{excl:true,mult:1.3,keyConf:true});it.title=`[단독] 프로경기 승부조작 정황…특정 이닝 볼넷 「사전 예고」`;S.items.push(it);toast('예고대로 됐다 · 단독 아이템');}else toast('아무 일도 없었다. 장난이었을까');}},
   {label:'구단과 연맹에 먼저 알린다',sub:'신뢰↑ · 단독은 놓친다',fn:()=>toast(apply({trust:1.5,net:.4}))},
   {label:'무시한다',cls:'ghost'}])},
 {w:1.2,c:()=>r03()&&isD('spo','base','foot'),run:()=>openModal('감독의 오프더레코드',`<p class="lede">경기 뒤 감독이 녹음기를 끄라고 했다. "에이스, 사실 팔꿈치가 끝났어. 시즌 아웃이야."</p>`,[
   {label:'약속을 지키고 공식 발표를 기다린다',sub:'감독 관계↑↑ · 나중에 단독 인터뷰',fn:()=>{S.flags.coachOff65=S.turn;toast(apply({net:.8,trust:.5}));}},
   {label:'다른 경로로 확인해 쓴다',sub:'단독 · 감독과 틀어진다',risk:true,fn:()=>{const it=makeItem(S.dept,{excl:true,keyConf:true});it.title=`[단독] 에이스 팔꿈치 부상…사실상 시즌 아웃`;S.items.push(it);toast(apply({net:-.6}));}}])},
 {w:1,c:()=>r03()&&isD('spo','base','foot','culspo'),run:()=>openModal('국가대표 선발 잡음',`<p class="lede">대표팀 명단 발표 하루 전, 협회 관계자가 귀띔했다. "실력 말고 줄 대로 뽑았어요."</p>`,[
   {label:'선발 기록을 전수 대조한다',sub:'비판 기사 아이템 · 협회와 척',fn:()=>{const it=makeItem(S.dept,{excl:true});it.title=`국가대표 선발, 기록 하위 선수가 상위 제쳐…협회 「감독 재량」`;S.items.push(it);toast('아이템 확보');}},
   {label:'명단 발표 스케치만 쓴다',sub:'무난',fn:()=>toast(apply({eval:.3}))}])},
 // 연예
 {w:1.4,c:()=>r03()&&isD('ent'),run:()=>openModal('열애 사진',`<p class="lede">파파라치 업체가 톱스타 열애 사진을 팔겠다고 한다. "단독으로 드립니다. 300만 원."</p>`,[
   {label:'산다',sub:'조회수 폭발 · 사생활 보도 논란 · 통장 -300만',risk:true,disabled:S.money<300,fn:()=>{S.money-=300;toast(apply({fame:2.5,trust:-2}));log('열애 사진 단독 — 조회수 1위');}},
   {label:'안 산다 — 연습생 계약 문제를 판다',sub:'신뢰↑ · 비판 아이템',fn:()=>{const it=makeItem('ent',{excl:true});it.title=`대형 기획사 연습생 계약서 입수…「위약금 데뷔 전 10배」`;S.items.push(it);toast(apply({trust:1}));}}])},
 {w:1.1,c:()=>r03()&&isD('ent'),run:()=>openModal('시청률 조작 의혹',`<p class="lede">외주 제작사 PD가 메일을 보냈다. "방송사가 협찬사 요구로 출연자 분량을 바꿨습니다. 편집본 원본 있습니다."</p>`,[
   {label:'원본을 받아 확인한다',sub:'단독 아이템 · 방송사와 척',fn:()=>{const it=makeItem('ent',{excl:true,keyConf:true});it.title=`[단독] 예능 출연 분량, 협찬사 요구로 편집…제작사 원본 입수`;S.items.push(it);toast('아이템 확보');}},
   {label:'방송사 입장부터 듣는다',sub:'반론 확보 · 늦을 수 있다',fn:()=>toast(apply({trust:.8}))}])},
 // 경제
 {w:1.3,c:()=>r03()&&isD('eco','ind','fin','stock','estate','it'),run:()=>openModal('공시 전날의 전화',`<p class="lede">상장사 재무팀장이 전화했다. "내일 장 끝나고 유상증자 공시 나갑니다. 기자님만 아세요."</p>`,[
   {label:'공시 시간에 맞춰 바로 쓴다',sub:'속보 · 신뢰 그대로',fn:()=>toast(apply({fame:.8,eval:.5}))},
   {label:'왜 나한테 흘렸는지 캔다',sub:'주가 띄우기 의심 · 비판 아이템',fn:()=>{const it=makeItem(S.dept,{excl:true});it.title=`공시 전 「기자 귀띔」…상장사의 주가 관리 수법`;S.items.push(it);toast('아이템 확보');}},
   {label:'주식 앱을 연다',sub:'돈↑ · 걸리면 끝',risk:true,fn:()=>{S.money+=R(200,600);S.flags.insider=1;if(chance(.35))S.pending.push({type:'ethic',why:'미공개 정보로 주식을 샀다',due:S.turn+R(8,24)});toast('…');}}])},
 {w:1.1,c:()=>r03()&&isD('estate','eco','city','loc'),run:()=>openModal('재개발 조합의 초대',`<p class="lede">재개발 조합장이 「조합원 설명회」에 초대했다. 기념품 봉투가 두툼하다.</p>`,[
   {label:'봉투는 두고 설명회만 본다',sub:'현장 취재 · 신뢰↑',fn:()=>{const it=makeItem(S.dept);it.title=`재개발 조합 「설명회」서 시공사 홍보…조합원 동의서 대리 서명 의혹`;S.items.push(it);toast(apply({trust:.6}));}},
   {label:'가지 않는다',cls:'ghost'}])},
 // 지역
 {w:1.4,c:()=>r03()&&isD('loc','nat','city','sigun'),run:()=>openModal('군수 선거',`<p class="lede">군수 선거가 석 달 남았다. 현직 군수 측이 「지역 언론 상생 협약」을 맺자고 한다. 광고 1년치다.</p>`,[
   {label:'협약은 거절, 공약 검증을 연재한다',sub:'신뢰↑↑ · 군청 광고↓',fn:()=>{try{S.co.adB-=.02;}catch(e){}toast(apply({trust:2.5,fame:1}));log('군수 선거 공약 검증 연재');}},
   {label:'협약을 맺는다',sub:'자금↑ · 신뢰↓',fn:()=>{try{S.co.cash+=.3;}catch(e){}toast(apply({trust:-2}));}},
   {label:'양쪽 후보 모두에게 같은 지면을 준다',sub:'무난 · 신뢰 조금↑',fn:()=>toast(apply({trust:.8}))}])},
 {w:1.1,c:()=>r03()&&isD('loc','nat','sigun','city'),run:()=>openModal('마을 이장의 제보',`<p class="lede">이장님이 페트병에 담긴 개울물을 들고 왔다. "공장 들어오고 나서 물고기가 다 죽었어요. 아무도 안 와 줘요."</p>`,[
   {label:'시료를 맡겨 검사한다',sub:'단독 아이템 · 지역 평판↑',fn:()=>{S.ap=Math.max(0,S.ap-1);const it=makeItem(S.dept,{excl:true,keyConf:true});it.title=`[단독] 공장 폐수 의심…하천 시료서 기준치 넘는 중금속`;S.items.push(it);toast(apply({fame:.6}));}},
   {label:'다음에 보자고 한다',cls:'ghost'}])},
 // 문화
 {w:1.2,c:()=>r03()&&isD('cul','culspo'),run:()=>openModal('표절 의혹 원고',`<p class="lede">무명 작가가 원고 두 묶음을 보냈다. "올해 문학상 수상작이 제 미발표 원고와 똑같습니다."</p>`,[
   {label:'두 원고를 문장 단위로 대조한다',sub:'단독 아이템 · 시간이 든다',fn:()=>{S.ap=Math.max(0,S.ap-1);const it=makeItem('cul',{excl:true});it.title=`문학상 수상작, 미발표 원고와 문장 30여 곳 일치`;S.items.push(it);toast('아이템 확보');}},
   {label:'수상작 출판사에 확인만 한다',sub:'무난',fn:()=>toast(apply({trust:.3}))}])},
 // 정치
 {w:1.2,c:()=>r03()&&isD('pol','city','court'),run:()=>openModal('국감 자료의 출처',`<p class="lede">의원실이 국정감사 자료를 단독으로 주겠다고 한다. 조건은 「의원 이름을 제목에」.</p>`,[
   {label:'자료만 받고 제목은 우리가 정한다',sub:'단독 · 의원실 관계↓',fn:()=>{const it=makeItem('pol',{excl:true});S.items.push(it);toast(apply({net:-.3}));}},
   {label:'조건을 받아들인다',sub:'단독 · 「받아쓰기」 눈총',fn:()=>{const it=makeItem('pol',{excl:true,keyConf:true});S.items.push(it);toast(apply({trust:-.6}));}},
   {label:'거절한다',cls:'ghost'}])},
 // 국제
 {w:1,c:()=>r03()&&isD('int','diplo'),run:()=>openModal('외신의 오역',`<p class="lede">다른 매체들이 받아쓴 외신 기사, 원문을 보니 핵심 문장이 거꾸로 번역됐다.</p>`,[
   {label:'원문 대조 기사를 쓴다',sub:'신뢰↑ · 다른 매체 머쓱',fn:()=>toast(apply({trust:1.5,fame:.6}))},
   {label:'조용히 넘어간다',cls:'ghost'}])},
 // 사회·사건
 {w:1.2,c:()=>r03()&&isD('soc','case','court'),run:()=>openModal('유족의 부탁',`<p class="lede">사건 유족이 기자실 앞에서 기다리고 있었다. "우리 애 이름은 쓰지 말아 주세요. 대신 경찰이 뭘 놓쳤는지는 꼭 써 주세요."</p>`,[
   {label:'익명으로, 수사 부실을 판다',sub:'신뢰↑ · 비판 아이템',fn:()=>{const it=makeItem(S.dept,{excl:true});it.title=`신고 세 번 묵살…경찰 초동 대응 기록 입수`;S.items.push(it);toast(apply({trust:1}));}},
   {label:'위로만 전한다',sub:'컨디션↓',fn:()=>toast(apply({hp:-3}))}])},
 // 의료·교육
 {w:1,c:()=>r03()&&isD('med','edu'),run:()=>openModal('내부 고발 문자',`<p class="lede">${isD('med')?'간호사라는 사람이 보낸 문자: "대리 수술 아직도 합니다. 수술실 CCTV 꺼 두고요."':'교사라는 사람이 보낸 문자: "시험 문제가 특정 학원에 미리 갔습니다."'}</p>`,[
   {label:'만나서 증거를 받는다',sub:'단독 아이템 · 제보자 보호가 관건',fn:()=>{const it=makeItem(S.dept,{excl:true,keyConf:true});it.title=isD('med')?'[단독] 수술실 CCTV 끄고 대리 수술…간호사 증언':'[단독] 내신 시험 문제, 시험 전 특정 학원에…교사 증언';S.items.push(it);toast('아이템 확보');}},
   {label:'기관에 먼저 사실 확인',sub:'안전 · 단독은 흐려진다',fn:()=>toast(apply({trust:.5}))}])}];
try{DEV65.forEach(e=>EVENTS.push(e));}catch(e){console.error(e);}

// ---------- 3) 오보 복기: 무엇이 틀렸는지 보고, 복기 노트로 다음 기사를 지킨다 ----------
const ERRK65=[['제보 자체가 꾸며진','조작된 제보'],['확인 안 된 사실','미확인 사실'],['한 출처뿐','단일 출처'],['반론','반론 누락'],['리드','리드 과장'],['숫자','숫자 그대로'],['결재','데스크 통과'],['증거 없이','증거 부족']];
function errKinds65(p){const W=(p.why||[]).join(' ');const k=ERRK65.filter(([re])=>W.includes(re)).map(x=>x[1]);if(!k.length)k.push(p.desk?'데스크 통과':'미확인 사실');return k;}
{const _sc65=scandal;scandal=function(p){S._err65=p;return _sc65.apply(this,arguments);};}
{const _om65e=openModal;openModal=function(t,b,c){try{if(t==='오보 논란'&&S&&S._err65&&typeof b==='string'){const p=S._err65;S._err65=null;const K=errKinds65(p);const E=S.errK65=S.errK65||{};K.forEach(k=>E[k]=(E[k]||0)+1);
    const top=Object.entries(E).sort((a,b)=>b[1]-a[1])[0];const clip=(S.clips||[]).find(x=>x.h===p.title);
    const card=`<div class="card" style="margin-top:8px"><div class="t">오보 복기</div><ul class="pnl">${K.map(k=>`<li><span class="tg pc">✗</span>${esc(k)} — ${E[k]>1?`<b style="color:var(--red)">같은 실수 ${E[k]}번째</b>`:'처음'}</li>`).join('')}</ul>${clip?`<p class="hint" style="margin:4px 0 0">기사: 「${esc(clip.h)}」 · 완성도 ${clip.q} · ${esc(clip.place||'')}</p>`:''}<p class="hint" style="margin:4px 0 0">어느 쪽을 골라도 <b>복기 노트</b>가 남는다 — 다음 기사 3건은 출고 전 한 번 더 본다(오보 위험↓). 가장 잦은 실수: ${esc(top[0])} ${top[1]}번.</p></div>`;
    b=b+card;S.recheck65=3;}}catch(e){console.error(e);}return _om65e.call(this,t,b,c);};}
{const _rr65=rtRisk;rtRisk=function(){let v=_rr65.apply(this,arguments);try{if(S&&(S.recheck65||0)>0){S.recheck65--;v*=.65;}}catch(e){}return v;};}

// ───── (예전 v66.js) ─────
/* 바이라인 — src/compat/v66.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.7 지분 인수 2단계 · 후계자 · 연말 기자상 · 취재원 인생 · 대표 통장 · 맡기기 「관계」 =====

// ---------- 1) 경쟁사 지분 인수 2단계: 자회사 편집국장 · 공동 취재 · 합병 ----------
const SUBED66={ours:['우리 쪽 사람','배당↑ · 그쪽 기사 품질↓ · 「장악」 비판(신뢰↓)'],inside:['내부 승진','그쪽 품질↑ · 독립성 · 배당 그대로'],star:['외부 명망가 영입','2억 · 그쪽 위상↑↑ · 품질↑']};
{const _mo66=mnaOne60;mnaOne60=function(c){const x=(S.mna60||{})[c.id];if(!x||x.p<51)return _mo66.apply(this,arguments);const n=cName(c),v=mnaVal60(c);const owned=S.turn-(x.own||x.t0||S.turn);
  const jOK=S.turn-(x.jT??-999)>=YW/2;const mOK=owned>=YW;const mc=+(v*.15).toFixed(1);
  openModal(`${n} · 자회사`,`<p class="lede">지분 <b>${x.p}%</b> · 기업가치 약 ${eok(v)}${x.ed?` · 편집국장: ${SUBED66[x.ed][0]}`:''}</p><p class="hint">자회사는 자매사로 서로 기사를 받아 준다. 1년이 지나면 합병할 수 있다.</p>`,[
   {label:'자회사 편집국장 임명',sub:x.ed?`지금: ${SUBED66[x.ed][0]} — 바꿀 수 있다`:'누구에게 편집국을 맡길까',fn:()=>{openModal(`${n} 편집국장`,'<p>자회사 편집국장을 누구로 할까. 배당·품질·우리 신뢰가 갈린다.</p>',Object.keys(SUBED66).map(k=>({label:SUBED66[k][0],sub:SUBED66[k][1],disabled:k==='star'&&S.co.cash<2,fn:()=>{x.ed=k;if(k==='ours'){c.q=Math.max(30,(c.q||55)-3);toast(apply({trust:-1}));}if(k==='inside'){c.q=Math.min(90,(c.q||55)+3);}if(k==='star'){S.co.cash-=2;c.q=Math.min(90,(c.q||55)+5);c.pw=(c.pw||10)*1.08;}log(`${n} 편집국장: ${SUBED66[k][0]}`);mnaOne60(c);return false;}})).concat([{label:'뒤로',cls:'ghost',fn:()=>{mnaOne60(c);return false;}}]));return false;}},
   {label:'그룹 공동 취재',sub:jOK?'행동력 1 · 단독 아이템 · 그쪽 위상 조금↑':'반년에 한 번',disabled:!jOK||S.ap<1,fn:()=>{spend(1,3);x.jT=S.turn;const it=makeItem(S.founder?cat1(S.dept):S.dept,{excl:true,mult:1.25});S.items.push(it);c.pw=(c.pw||10)*1.03;log(`${jo2(n,'과','와')} 공동 취재: ${it.title}`);toast(`공동 취재 아이템 「${it.title}」`);}},
   {label:`합병한다 · 통합 비용 ${eok(mc)}`,sub:mOK?'경쟁사 하나가 사라진다 · 인력·독자를 흡수 · 중복 인력 문제':'자회사로 1년 지나야 한다',risk:true,disabled:!mOK||S.co.cash<mc,fn:()=>{mnaMerge66(c,x,mc);return false;}},
   {label:'뒤로',cls:'ghost',fn:()=>{RUN.mna60();return false;}}]);};}
function mnaMerge66(c,x,mc){const n=cName(c);S.co.cash-=mc;const add=Math.max(2,Math.round((c.pw||10)/2));const cash=Math.max(0,c.cash||0)*.5;S.co.cash+=cash;S.co.staff=(S.co.staff||1)+add;try{S.co.subs=(S.co.subs||0)*1.06;}catch(e){}S.co.q=clamp((S.co.q*3+(c.q||55))/4,10,100);
  S.comp=(S.comp||[]).filter(y=>y!==c);delete S.mna60[c.id];try{const o=OUTLETS.find(y=>y.id===c.id);if(o)o.closed=1;(S.closedOut=S.closedOut||[]).push(c.id);}catch(e){}
  log(`${n} 흡수 합병`);tick(`${OUT().n}, ${n} 흡수 합병 — 기자 ${add}명 합류`,2);S.merged66=(S.merged66||0)+1;
  openModal('합병 — 중복 인력',`<p class="lede">${esc(n)} 편집국이 우리 건물로 들어왔다. 같은 출입처에 기자가 둘씩이다. 노조가 면담을 요청했다.</p>`,[
   {label:'전원 고용 승계',sub:'사기↑ · 매달 인건비↑',fn:()=>{S.co.extra=(S.co.extra||0)+add*.004;S.wMood=clamp((S.wMood??60)+4,0,100);toast(apply({trust:.8}));}},
   {label:'희망퇴직을 받는다',sub:'인건비 절감 · 사기↓ · 「합병 구조조정」 기사',fn:()=>{S.co.staff=Math.max(2,S.co.staff-Math.round(add*.4));S.co.cash-=add*.02;S.wMood=clamp((S.wMood??60)-6,0,100);toast(apply({trust:-1}));}},
   {label:'두 편집국을 섞어 새 부서를 만든다',sub:'품질↑ · 한동안 혼란(사기 조금↓)',fn:()=>{S.co.q=Math.min(100,S.co.q+3);S.wMood=clamp((S.wMood??60)-2,0,100);toast('새 편집국 출범');}}]);}
// 자회사 편집국장이 「우리 쪽 사람」이면 배당이 30% 더 들어온다
{const _cm66=compMonth;compMonth=function(lines){const c0=S&&S.co?S.co.cash:0;const r=_cm66.apply(this,arguments);try{if(S.mna60&&S.co&&S.co.cash>c0){const ours=Object.entries(S.mna60).filter(([id,x])=>x.ed==='ours'&&x.p>=51).length;if(ours&&S.mnaY60===S.turn){const add=+((S.co.cash-c0)*.3).toFixed(2);S.co.cash+=add;}}}catch(e){}return r;};}

// ---------- 2) 나의 후계자 ----------
try{ACT.heir66={n:'후계자 키우기',ap:1,sc:'office',cd:4,d:'한 사람을 골라 끝까지 키운다 — 엔딩 뒤 「그 후 10년」에 그 사람이 나온다'};ACT_IC.heir66='user';ACT_STAT.heir66=ACT_STAT.colleague||'cha';const g=ACT_GROUPS.find(x=>x[0]==='사람과 관계');if(g&&!g[2].includes('heir66'))g[2].push('heir66');}catch(e){}
function heirOk66(){return !!(S&&!S.story&&(S.founder||S.rank>=5||(S.spec63&&(S.spec63.lv||0)>=2)));}
{const _rk66=rankActs;rankActs=function(){const a=_rk66.apply(this,arguments);try{if(heirOk66()&&!a.includes('heir66'))a.push('heir66');}catch(e){}return a;};}
{const _wy66=why;why=function(id){if(id==='heir66'&&!heirOk66())return '국장·편집국장·대기자·대표부터';return _wy66.apply(this,arguments);};}
function heirPool66(){let L=[];try{L=(S.team||[]).concat(Object.values(roster()).flat());}catch(e){L=(S.team||[]).slice();}const seen=new Set();return L.filter(m=>m&&m.name&&!seen.has(m.name)&&seen.add(m.name)&&myrs(m)>=3&&myrs(m)<=18).sort((a,b)=>(b.skill||0)-(a.skill||0)).slice(0,4);}
RUN.heir66=function(){const H=S.heir66;
  if(!H){const L=heirPool66();if(!L.length){toast('키울 만한 후배가 안 보인다');return;}
    openModal('후계자 키우기',`<p class="lede">언젠가 이 자리를 넘겨줄 사람. 한 명만 고른다.</p><p class="hint">고른 뒤엔 「후계자 키우기」마다 함께 현장을 돌고, 회의에 데려가고, 실수를 대신 막아 준다. 끝까지 키우면 엔딩 뒤 그 사람의 10년이 나온다. 다음 판에 선배로 다시 만날 수도 있다.</p>`,
      L.map(m=>({label:`${m.name} — ${DEPTS[m.d]?DEPTS[m.d].n:''} ${myrs(m)}년 차`,sub:`실력 ${Math.round(m.skill)} · 관계 ${Math.round(m.rel??20)}`,fn:()=>{spend(1,2);setCd('heir66');S.heir66={nm:m.name,sk:m.skill||50,lv:0,t0:S.turn,d:m.d};m.rel=clamp((m.rel??20)+10,-50,100);log(`후계자: ${m.name}`);toast(`${jo2(m.name,'을','를')} 키우기로 했다`);}})).concat([{label:'아직 아니다',cls:'ghost'}]));return false;}
  spend(1,3);setCd('heir66');H.lv=Math.min(6,H.lv+1);H.sk=Math.min(92,H.sk+R(2,4));const lines=['출입처에 데려가 인사를 시켰다.','간부회의 뒷자리에 앉혔다. 회의가 끝나고 「왜 그 결정을 했는지」 한 시간을 설명했다.','첫 대형 기사 초고를 밤새 같이 고쳤다.','그가 낸 실수를 내 이름으로 막았다. 그는 아무 말도 못 했다.','다른 회사 제안을 받았다는 그를 붙잡았다. "여기서 네가 할 일이 있다."','이제 회의에서 그가 먼저 말한다.'];
  openModal('후계자',`<p class="lede">${esc(H.nm)} — ${esc(lines[Math.min(lines.length-1,H.lv-1)])}</p>${bar(H.lv/6*100,'var(--good)')}<p class="hint">성장 ${H.lv}/6 · 실력 ${Math.round(H.sk)}</p>`);return false;};
function heirFate66(){const H=S.heir66;if(!H)return '';const top=S.founder?'대표':'편집국장';const f=H.lv>=5?`${jo2(top,'이','가')} 됐다. 취임사 첫 문장에 당신의 이름이 있었다.`:H.lv>=3?'부장으로 회사의 허리를 지켰다. 후배들에게 당신 얘기를 자주 했다.':H.lv>=1?'몇 해 뒤 다른 회사로 옮겼다. 명함에는 여전히 「기자」.':'끝내 가까워지지 못했다.';return `<div class="card" style="margin-top:12px"><div class="t">그 후 10년 — ${esc(H.nm)}</div><p>${esc(f)}</p></div>`;}
{const _eh66=endHTML;endHTML=function(){let h=_eh66.apply(this,arguments);try{if(S.heir66)h=h.replace(/(<\/div>\s*)$/,heirFate66()+'$1');}catch(e){}return h;};}
{const _en66=ending;ending=function(kind){try{if(S&&!S.metaDone&&typeof metaOn==='function'&&metaOn()&&S.heir66&&S.heir66.lv>=3){META=metaGet();META.heirs=META.heirs||[];META.heirs.unshift({nm:S.heir66.nm,by:S.name,o:OUT().n,lv:S.heir66.lv});META.heirs=META.heirs.slice(0,5);metaSave();}}catch(e){}return _en66.apply(this,arguments);};}
// 다음 판: 지난 판의 후계자가 선배로
{const _om66h=orgMonth;orgMonth=function(lines){const r=_om66h.apply(this,arguments);try{if(S&&!S.story&&!S.heirMet66&&S.cols&&typeof META==='object'){S.heirMet66=1;const h=(META.heirs||[])[0];const c=colBy(S.founder?'mentor':'senior');if(h&&c&&!S.dev){c.name=h.nm;c.rel=Math.max(c.rel||0,30);lines.push({c:'g',t:`선배 ${h.nm} — ${h.o}에서 ${h.by}에게 배운 사람이다. "당신 얘기 많이 들었어."`});}}if(S&&S.heir66){S.heir66.sk=Math.min(92,S.heir66.sk+.08);}}catch(e){}return r;};}

// ---------- 3) 연말 기자상 시상식: 출품작을 내가 고른다 ----------
function awardYear66(lines){if(S.story||month()!==12||S.aw66Y===Math.floor(S.turn/YW))return;const y0=S.turn-YW;const L=(S.clips||[]).filter(c=>c.turn>y0&&!c.staff&&!c.pos&&(c.by===S.name||String(c.by||'').includes(S.name))).sort((a,b)=>(b.imp*b.q)-(a.imp*a.q)).slice(0,3);if(!L.length)return;S.aw66Y=Math.floor(S.turn/YW);
  Q.push(()=>openModal('연말 기자상 · 출품',`<p class="lede">기자협회가 올해의 기자상 출품을 받는다. 한 편만 낼 수 있다.</p>`,L.map(c=>({label:`「${c.h.length>34?c.h.slice(0,34)+'…':c.h}」`,sub:`파급력 ${c.imp} · 완성도 ${c.q}${c.excl?' · 단독':''}${c.flDone||c.corr?' · 정정 이력(감점)':''}`,fn:()=>{awardJudge66(c);return false;}})).concat([{label:'올해는 내지 않는다',cls:'ghost'}])));}
function awardJudge66(c){const sp=S.spec63?(S.spec63.lv||0)*3:0;const sc=c.imp*.5+c.q*.4+(c.excl?8:0)+(c.crit?4:0)+sp-(c.flDone||c.corr?20:0)+R(-10,10)-(S.awT66!=null&&S.turn-S.awT66<YW*2?8:0);
  const why=[c.excl?'끝까지 혼자 파고든 집요함':'',c.imp>=80?'사회에 던진 파장':'',c.q>=75?'문장과 구성의 완성도':'',c.flDone||c.corr?'다만 정정 이력이 아쉬웠다':''].filter(Boolean).join(', ')||'성실한 취재';
  let t,fx;if(sc>=96){t='대상';fx={fame:6,eval:3};S.awBig66=(S.awBig66||0)+1;S.awards=(S.awards||0)+1;S.awMain=(S.awMain||0)+1;S.awT66=S.turn;S.money+=500;}else if(sc>=86){t='본상';fx={fame:4,eval:2};S.awards=(S.awards||0)+1;S.awMain=(S.awMain||0)+1;S.awT66=S.turn;S.money+=200;}else if(sc>=72){t='입선';fx={fame:1.5};}else{t='낙선';fx={eval:-.3};}
  if(t!=='낙선'){c.awarded=1;tick(`올해의 기자상 ${t} — ${OUT().n} ${S.name} 「${c.h}」`,1);log(`기자상 ${t}: ${c.h}`);}
  openModal(`기자상 ${t}`,`<p class="lede">「${esc(c.h)}」 — <b>${t}</b>${t==='대상'?'. 시상식장 맨 앞줄에 앉았다.':t==='낙선'?'. 다른 매체의 탐사 보도가 상을 가져갔다.':''}</p><p class="hint">심사평: ${esc(why)}.</p>${fxLine(apply(fx))}${t==='대상'?'<p>상금 500만 원.</p>':t==='본상'?'<p>상금 200만 원.</p>':''}`);}

// ---------- 4) 취재원 인생: 승진 · 좌천 · 퇴직 · 정치 입문 ----------
function srcLife66(lines){if(S.story||month()!==3||S.sl66Y===Math.floor(S.turn/YW))return;S.sl66Y=Math.floor(S.turn/YW);const L=(S.sources||[]).filter(s=>s&&(s.trust||0)>=30&&S.turn-(s.fresh||0)>=YW).slice().sort(()=>Math.random()-.5).slice(0,2);
  L.forEach(s=>{const x=Math.random();const base=String(s.role||'').replace(/\s*\((승진|좌천)[^)]*\)$/,'');
    if(x<.4){s.role=base+' (승진)';s.trust=Math.min(100,s.trust+5);s.up66=(s.up66||0)+1;lines.push({c:'g',t:`취재원 ${s.name} — 승진했다. 축하 전화에 "이제 더 많이 알게 될 거야"라고 했다`});if(chance(.35)&&(S.items||[]).length<6){try{const it=makeItem(s.d||S.dept,{excl:true});S.items.push(it);lines.push({c:'g',t:`${jo2(s.name,'이','가')} 새 자리에서 첫 귀띔을 줬다 — 「${it.title}」`});}catch(e){}}}
    else if(x<.6){s.role=base+' (좌천)';lines.push({c:'',t:`취재원 ${s.name} — 지방으로 좌천됐다. 술자리에서 "다 말해 줄 수도 있어"라고 했다`});try{const it=makeItem(s.d||S.dept,{excl:true,keyConf:true});it.title=`[단독] 내부 문건 입수…「${(DEPTS[s.d]||DEPTS[S.dept]).lede.split('·')[0]}」 보고 라인의 은폐`;if((S.items||[]).length<6)S.items.push(it);}catch(e){}}
    else if(x<.8){S.sources=S.sources.filter(y=>y!==s);lines.push({c:'',t:`취재원 ${s.name} — 정년퇴직했다. 마지막 날 "그동안 고마웠다"며 명함첩을 건넸다`});try{if(chance(.5))addSource(s.d||S.dept,R(20,30));}catch(e){}}
    else{const nm=s.name;Q.push(()=>openModal('취재원의 출마',`<p class="lede">오래 알고 지낸 취재원 ${jo2(esc(nm),'이','가')} 총선 출마를 선언했다. 첫 통화: "자네가 나 좀 잘 써 줘."</p>`,[
      {label:'선을 긋는다',sub:'취재원 관계↓ · 신뢰↑',fn:()=>{s.trust=Math.max(0,s.trust-15);toast(apply({trust:1}));}},
      {label:'공정하게 쓰되 연락은 이어 간다',sub:'정치권 정보↑ · 유착 의심 조금',fn:()=>{s.role=base+' (출마)';s.trust=Math.min(100,s.trust+5);toast(apply({net:.6,trust:-.3}));}}]));}});}

// ---------- 5) 대표 통장: 배당은 회사 규모의 3%·이익의 15%까지 · 내 돈으로 증자 ----------
fDivMonth=function(lines){if(!S.founder||!S.co||!S.co.last)return;S.fPLy=(S.fPLy||0)+(S.co.last.profit||0);S.fPLn=(S.fPLn||0)+1;
  if(month()!==1||S.fPLn<6)return;const pl=S.fPLy,eq=(S.equity??100)/100;S.fPLy=0;S.fPLn=0;
  if(pl<=0){lines.push({c:'r',t:`지난해 회사가 ${eok(-pl)} 적자 — 대표 배당은 없다`});return;}
  const cap=Math.max(.3,((S.co.staff||8)*.03));const raw=pl*.15*eq;const div=+Math.min(raw,cap).toFixed(2);const man=Math.round(div*10000);S.co.cash-=div;S.money+=man;S.fDivTot=(S.fDivTot||0)+man;log(`연말 배당 ${man.toLocaleString('ko-KR')}만 원`);
  Q.push(()=>openModal('연말 배당',`<p class="lede">지난해 회사가 <b>${eok(pl)}</b> 흑자를 냈다. 이사회가 이익의 15%를 배당하기로 했다.</p><p>내 지분 ${Math.round(eq*100)}% → <b>${man.toLocaleString('ko-KR')}만 원</b>이 통장에 들어왔다.</p>${raw>cap?`<p class="hint">이익이 커도 배당은 회사 규모만큼만 — 한도 ${eok(cap)} (직원 ${S.co.staff}명 × 300만). 나머지는 회사에 남겨 재투자한다.</p>`:''}<p class="hint">지금까지 받은 배당 ${(S.fDivTot).toLocaleString('ko-KR')}만 원. 통장 돈은 「투자 유치 → 내 돈으로 증자」로 회사에 다시 넣을 수 있다.</p>`));};
{const _om66=openModal;openModal=function(t,b,c){try{if(t==='투자 유치'&&Array.isArray(c)&&S&&S.founder&&S.co){const mk=(man,eqUp)=>({label:`내 돈으로 증자 · ${(man/10000).toFixed(man>=10000?0:1)}억`,sub:`통장 -${man.toLocaleString('ko-KR')}만 · 회사 자금 +${eok(man/10000)} · 내 지분 +${eqUp}%p (100%까지)`,disabled:S.money<man,fn:()=>{S.money-=man;S.co.cash+=man/10000;S.equity=Math.min(100,(S.equity??100)+eqUp);log(`대표 증자 ${eok(man/10000)}`);toast(`증자 · 회사 자금 +${eok(man/10000)}`);}});
    const i=c.findIndex(x=>x&&x.cls==='ghost');const add=[mk(5000,1),mk(20000,4)];if(i>=0)c=c.slice(0,i).concat(add,c.slice(i));else c=c.concat(add);}}catch(e){}return _om66.call(this,t,b,c);};}

// ---------- 6) 맡기기: 「관계」 방향 ----------
try{AUTO_DIR.rel={n:'관계',d:'취재원·동료·기관을 챙기고 신세를 쌓는다. 기사는 무난하게',acts:['source','network','colleague','drink','deptlife','favor','heir66','beat','write','invest','discover','sasu','report'],pref:/관계|챙긴|만난|돕는다|들어준다|화해|오해를 푼다|선을 긋/};}catch(e){}

// ---------- 매달 묶음 ----------
{const _om66m=orgMonth;orgMonth=function(lines){const r=_om66m.apply(this,arguments);try{if(S&&S.phase==='game'&&S.m66!==Math.floor(S.turn/4)){S.m66=Math.floor(S.turn/4);awardYear66(lines);srcLife66(lines);}}catch(e){console.error(e);}return r;};}
