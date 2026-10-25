/* 바이라인 — src/compat/v23.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.32 데스킹 보강: 새 문제 유형 · 헷갈리는 정답 문장 · 데스크에서 생기는 일 =====
function deskExtraFlaws(d,S0,yy){const pos=!!d.pos;const nm=()=>rname();const age=()=>R(13,17);const P={
 // 실명·신상 노출
 anon:pos?null:()=>{const n=nm(),a=age();const P=[[`가해 학생 ${n}(${a})군은 경찰 조사에서 혐의를 부인했다.`,'미성년 피의자의 실명을 썼다. 소년법·보도 준칙 위반.'],[`피해자 ${n.slice(0,1)}모(${R(30,60)})씨가 사는 ${pick(CITIES)} ${pick(['한빛','누리','가람'])}아파트 ${R(101,112)}동 주민들은 불안해했다.`,'동·호수 수준으로 피해자 거주지가 특정된다.'],[`숨진 ${n}(${R(20,40)})씨의 유족은 오열했다.`,'유족 동의 없이 사망자 실명을 썼다.']];const G=[`가해 학생 A(${a})군은 경찰 조사에서 혐의를 부인했다.`,`피해자 B씨는 "다시는 이런 일이 없길 바란다"고 말했다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};},
 // 낙인·차별 표현
 label:pos?null:()=>{const P=[['피해 아동은 결손가정에서 자랐다.','"결손가정"은 낙인 표현. "한부모 가정" 등으로 쓴다.'],['불법체류자 김모씨는 단속을 피해 달아났다.','"불법체류자"는 낙인 표현. "미등록 이주민"으로 쓴다.'],['범인은 평소 정신병자처럼 행동했다는 증언이 나왔다.','정신질환에 대한 혐오 표현. 기사에 쓸 수 없다.'],['여교사 박모씨는 학부모들에게 사과했다.','성별을 붙일 이유가 없다. "교사"로 충분하다.']];const G=['피해 아동은 한부모 가정에서 자랐다.','미등록 이주민 김모씨는 단속을 피해 달아났다.'];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};},
 // 반론 없이 결론
 oneside:pos?null:()=>{const P=[[`${S0} 측의 해명은 듣지 않았지만 의혹은 사실로 보인다.`,'반론을 받지 않고 결론을 냈다. 반론권 침해.'],[`익명 게시판의 글 ${R(3,9)}건을 보면 ${S0}의 문제는 분명하다.`,'출처를 확인할 수 없는 게시글을 근거로 단정했다.']];const G=[`본지는 ${S0} 측에 사흘에 걸쳐 세 차례 해명을 요청했다.`,`${jo2(S0+' 측','은','는')} 서면 답변에서 "내부 규정에 따랐다"고 밝혔다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};},
 // 조간 시제
 tense:()=>{const P=[['사고는 오늘 새벽 4시쯤 일어났다.','조간은 다음 날 아침에 읽힌다. "오늘"이 아니라 날짜로 써야 한다.'],[`${jo2(S0,'은','는')} 내일 오전 공식 입장을 낸다.`,'지면이 나가는 날 기준으로 "내일"은 틀린다. 날짜로 쓴다.']];const dd=R(2,27);const G=[`사고는 ${dd}일 새벽 4시쯤 일어났다.`,`${jo2(S0,'은','는')} ${dd}일 오전 공식 입장을 낸다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};},
 // 단위
 unit:()=>{const a=R(12,95);const P=pos?[[`올해 수출액은 ${a}조 달러로 집계됐다.`,`국내 기업 한 곳의 수출이 ${a}조 달러일 수 없다. "억 달러"를 "조 달러"로 잘못 적었다.`],[`행사에는 ${a}만 명의 관객이 몰렸고, 객석 ${a*10}석은 모두 찼다.`,`${a}만 명과 객석 ${a*10}석이 맞지 않는다. 단위가 틀렸다.`]]:[[`이번 사고로 ${a}만 명이 숨졌다.`,`메모에는 사망자 수가 ${a}명이다. "만"이 붙었다.`],[`피해액은 ${a}조 원으로 추산된다.`,`작은 기관의 피해액이 ${a}조 원일 수 없다. 억과 조를 헷갈렸다.`]];const G=[`관련 예산은 1조 2000억 원 규모다.`,`누적 관람객은 ${a}만 명을 넘었다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};},
 // 호재 기사 전용: 보도자료 베끼기 · 광고 문구
 copy:pos?()=>{const P=[[`${jo2(S0,'은','는')} 업계 최고 수준의 혁신 기술로 고객 만족을 극대화했다.`,'보도자료 문구를 그대로 옮겼다. "최고 수준" "극대화"는 회사 주장일 뿐 검증되지 않았다.'],['지금 바로 가까운 매장을 방문해 혜택을 누려 보자.','기사에 판촉 문구가 들어갔다. 광고와 기사를 구분해야 한다.'],[`${S0} 제품은 써 본 사람 누구나 만족하는 명품이다.`,'기자의 평가를 사실처럼 썼다. 광고성 표현.']];const G=[`${jo2(S0,'은','는')} 이 기술로 생산 단가를 ${R(5,18)}% 낮췄다고 밝혔다.`,`다만 업계에서는 "효과를 판단하기엔 이르다"는 신중론도 나온다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};}:null,
 // 호재 기사 전용: 불리한 사실 빼기
 omit:pos?()=>{const P=[[`${S0} 실적은 모든 분야에서 고르게 좋아졌다.`,'메모에는 일부 사업 부진도 있다. 불리한 사실을 빼고 "모든 분야"로 썼다.'],['이번 성과에 대한 우려의 목소리는 찾아볼 수 없다.','반대 의견을 확인하지 않고 "없다"고 단정했다.']];const G=[`다만 해외 사업 부문은 ${R(3,12)}% 역성장했다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};}:null};
 for(const k in P)if(!P[k])delete P[k];return P;}
// 데스크에서 생기는 일: 꼼꼼히 볼 때 가끔 끼어든다
const DESK_EV=[
 {id:'embargo',c:d=>d.pos||chance(.5),f:(d,go)=>openModal(`데스킹 · 엠바고 요청`,`<p class="lede">「${esc(d.t)}」의 당사자인 ${esc(d.subj||'기관')} 측이 "오후 6시까지 보도를 미뤄 달라"는 엠바고를 걸었다. 다른 매체도 같은 자료를 받았다.</p>`,[
   {label:'엠바고를 지킨다',sub:'신뢰↑ · 출입처 관계↑ · 마감이 늦어진다',fn:()=>{d.due=Math.max(d.due,S.turn+1);if(d.ent&&S.net&&S.net[d.ent])netUp(d.ent,3);apply({trust:.4});go();return false;}},
   {label:'먼저 내보낸다',sub:'평판↑ · 출입처가 등을 돌린다 · 출입 정지 위험',risk:1,fn:()=>{d.q=clamp(d.q+3,15,95);if(d.ent&&S.net&&S.net[d.ent])netUp(d.ent,-8);apply({fame:.6,trust:-.6});go();return false;}}])},
 {id:'adv',c:d=>!d.pos,f:(d,go)=>openModal('데스킹 · 광고국의 전화',`<p class="lede">광고국장이 직접 전화했다. "「${esc(d.t)}」에 나오는 곳이 우리 큰 광고주야. 표현만 좀 부드럽게 해 줄 수 없나?"</p>`,[
   {label:'원래대로 간다',sub:'신뢰↑ · 광고국과 껄끄러워진다',fn:()=>{apply({trust:.6,eval:-.2});go();return false;}},
   {label:'표현만 순화한다',sub:'완성도 조금↓ · 광고 영업에 도움',fn:()=>{d.q=clamp(d.q-4,15,95);try{S.co.adB=(S.co.adB||0)+.002;}catch(e){}apply({trust:-.4,eval:.2});go();return false;}},
   {label:'국장에게 보고하고 판단을 넘긴다',sub:'책임을 나눈다 · 평가 조금↓',fn:()=>{apply({eval:-.2});go();return false;}}])},
 {id:'rebut',c:()=>true,f:(d,go)=>openModal('데스킹 · 마감 직전 반론',`<p class="lede">마감 30분 전, ${esc(d.subj||'당사자')} 측이 A4 두 장짜리 반론을 보내왔다. 반영하려면 기사를 다시 짜야 한다.</p>`,[
   {label:'반론을 넣고 다시 짠다',sub:'완성도↑ · 오보 위험↓ · 행동력은 그대로',fn:()=>{d.q=clamp(d.q+5,15,95);d.fl=Math.max(1,d.fl);apply({trust:.4});go();return false;}},
   {label:'"추가 입장은 다음 기사에"',sub:'그대로 간다 · 반론 보도 청구 위험',risk:1,fn:()=>{d.rebutSkip=1;go();return false;}}])},
 {id:'junior',c:d=>(d.rel??20)<40,f:(d,go)=>openModal('데스킹 · 후배의 고집',`<p class="lede">${esc(d.w)} 기자가 데스크 앞에 섰다. "부장님, 이번 건은 제 문장 그대로 내주시면 안 될까요? 현장에서 직접 본 거라서요."</p>`,[
   {label:'"같이 보자"며 옆에 앉힌다',sub:'후배 관계↑ · 후배 실력↑',fn:()=>{const m=bjMember(d);if(m){m.rel=clamp((m.rel||0)+4,-50,100);m.skill=clamp(m.skill+.6,0,95);}go();return false;}},
   {label:'"데스크는 내가 본다"',sub:'원칙대로 · 후배 관계↓',fn:()=>{const m=bjMember(d);if(m)m.rel=clamp((m.rel||0)-3,-50,100);go();return false;}}])},
 {id:'copycat',c:d=>!!d.pos,f:(d,go)=>openModal('데스킹 · 다들 쓰는 기사',`<p class="lede">「${esc(d.t)}」${jp(esc(d.t),'은','는')} 보도자료 기사다. 타사 온라인판에 벌써 같은 기사가 다섯 개 올라왔다.</p>`,[
   {label:'차별화 취재를 지시한다',sub:'완성도↑↑ · 마감이 늦어진다',fn:()=>{d.q=clamp(d.q+8,15,95);d.due=Math.max(d.due,S.turn+1);go();return false;}},
   {label:'짧게 받아서 낸다',sub:'완성도↓ · 빨리 끝난다',fn:()=>{d.q=clamp(d.q-3,15,95);go();return false;}}])}];
{const _bf=bjDeskFull;bjDeskFull=function(d){if(!d.evDone&&!S.simple&&chance(.3)){const L=DESK_EV.filter(e=>{try{return e.c(d);}catch(x){return false;}});if(L.length){d.evDone=1;const e=pick(L);e.f(d,()=>_bf(d));return;}}return _bf(d);};}
// 반론을 건너뛰고 낸 기사는 가끔 반론 보도 청구
{const _dc=deskClip;deskClip=function(d,q,head,place){const c=_dc(d,q,head,place);try{if(d&&d.rebutSkip&&chance(.35*DF().risk))S.pending.push({type:'err',title:`${d.w} 기자의 「${d.t}」 (반론 누락)`,due:S.turn+R(1,3),desk:1});}catch(e){}return c;};}