/* 바이라인 — src/systems/life-events.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 변경점과 맞물린 이벤트 =====
const adMgr=()=>S.founder||S.rank>=4;
const hasLge=()=>(S.lge||[]).some(e=>!e.done);
const recentScoop=g=>(S.clips||[]).some(c=>c.turn>S.turn-8&&c.excl&&(!g||(c.imp||0)>=g));
F_EVENTS.push(
 // --- 광고·영업 ---
 {w:4,c:()=>adMgr()&&S.co&&ENTS.some(e=>e[2]==='corp'),run:()=>adInbound()},
 {w:3,c:()=>adMgr()&&(S.adRate||1)>=1.15,run:()=>{const e=pick(ENTS.filter(x=>x[2]==='corp'))||[null,'대형 광고주'];openModal('광고주 단가 항의',`<p class="lede">${esc(e[1])} 마케팅팀: "작년보다 ${Math.round(((S.adRate||1)-1)*100)}%나 올리셨던데요. 다른 매체는 그대로입니다."</p>`,[
   {label:'그대로 간다',sub:mediaPower()>=1.2?'파워가 있으니 버틸 만하다':'광고주가 빠질 수 있다',fn:()=>{if(chance(clamp(mediaPower()/2,.2,.85))){toast('광고주가 결국 따라왔다');if(e[0])netUp(e[0],-2);}else{S.co.adB-=.05;if(e[0])netUp(e[0],-8);toast('광고주가 물량을 절반으로 줄였다');}}},
   {label:'이 광고주만 할인해 준다',sub:'관계↑ · 다른 광고주 소문 위험',fn:()=>{if(e[0])netUp(e[0],6);if(chance(.35)){S.adRate=+((S.adRate||1)*.96).toFixed(2);toast('할인 소문이 돌아 단가가 조금 내려갔다');}else toast('조용히 넘어갔다');}},
   {label:'단가 대신 지면·영상 패키지로 달랜다',sub:'회사 자금 조금↓',fn:()=>{S.co.cash-=.02*OUT().p;if(e[0])netUp(e[0],4);toast('패키지를 얹어 줬다');}}]);}},
 {w:3,c:()=>adMgr()&&(S.cHit||0)>=.04&&S.comp&&S.comp.length,run:()=>{const c=S.comp.find(x=>x.last==='pricecut')||compPick();openModal('덤핑 공세',`<p class="lede">${jo2(esc(cName(c)),'이','가')} 광고 단가를 후려치고 있다. 우리 광고주들에게 "반값"을 제시했다는 소식이다.</p>`,[
   {label:'맞불 — 단가를 내린다',sub:'단가 10%↓ · 덤핑 피해 해소',fn:()=>{S.adRate=+((S.adRate||1)*.9).toFixed(2);S.cHit=Math.max(0,(S.cHit||0)-.04);c.aggro+=5;toast('맞불을 놨다. 출혈 경쟁이 시작됐다');}},
   {label:'품질로 승부한다는 자료를 돌린다',sub:'신뢰·평판이 높을수록 통한다',fn:()=>{if(chance(clamp((S.trust+S.fame)/160,.2,.8))){S.cHit=Math.max(0,(S.cHit||0)-.03);toast(apply({trust:.6}));}else toast('광고주들은 숫자만 봤다');}},
   {label:'버틴다',cls:'ghost'}]);}},
 {w:2,c:()=>adMgr()&&ENTS.some(e=>e[2]==='gov'),run:()=>{const pw=mediaPower();openModal('정부광고 지표 개편',`<p class="lede">언론진흥재단이 정부광고 집행 지표를 바꿨다. 열독률·포털 제휴·정정보도 건수가 반영된다.</p>`,[{label:'확인',fn:()=>{const d=pw>=1.2?.04:pw<.8?-.04:.01;S.co.adB+=d;S.adGovK=(S.adGovK||1)*(1+d);toast(d>0?'우리 매체 정부광고 배정이 늘었다':d<0?'정부광고 배정이 줄었다':'큰 변화는 없다');}}]);}},
 {w:2,c:()=>adMgr()&&!S.founder&&S.rank>=5,run:()=>openModal('광고대행사의 제안',`<p class="lede">대형 광고대행사 본부장: "물량 몰아 드릴게요. 대신 수수료 일부는 저희 쪽으로 돌려 주시죠."</p>`,[
   {label:'받는다',sub:'광고 매출↑ · 들키면 큰일',fn:()=>{S.co.adB+=.08;if(chance(.25*DF().risk)){S.co.cash-=.3;toast(`리베이트가 기자협회보에 났다 · ${apply({trust:-5,eval:-2})}`);}else toast('광고 물량이 몰렸다');}},
   {label:'정상 수수료만 받는다',sub:'신뢰 조금↑',fn:()=>toast(apply({trust:.6}))}])},
 // --- 매체 창간·폐간 ---
 {w:3,c:()=>(S.closedOut||[]).length>0&&(S.founder||S.rank>=4),run:()=>{const o=OUTLETS.find(x=>x.id===S.closedOut[S.closedOut.length-1]);const m=genMember(pick(OUT().depts),55,78);m.yrs=R(6,15);openModal('폐간 매체 기자의 연락',`<p class="lede">문을 닫은 「${esc(o?o.n:'어느 매체')}」의 ${esc(m.name)} 기자(${m.yrs}년 차)가 일자리를 찾고 있다.</p><p class="hint">폐간 매체 기자는 몸값이 낮지만, 매달 인건비는 똑같이 나간다.</p>`,[
   {label:'받아들인다',sub:'인력 +1 · 보도 품질↑ · 매달 인건비↑',fn:()=>{S.team.push(m);S.co.staff++;S.co.q=clamp(S.co.q+1,10,100);log(`${o?o.n:''} 출신 ${m.name} 기자 합류`);toast(`${m.name} 기자가 합류했다`);}},
   {label:'정중히 거절한다',cls:'ghost'}]);}},
 {w:2,c:()=>(S.closedOut||[]).length>0&&S.co&&(S.founder||S.rank>=5),run:()=>{const o=OUTLETS.find(x=>x.id===S.closedOut[S.closedOut.length-1]);openModal('주인 잃은 독자와 광고주',`<p class="lede">「${esc(o?o.n:'폐간 매체')}」 독자와 광고주들이 갈 곳을 찾고 있다.</p>`,[
   {label:'구독 전환 캠페인을 한다',sub:'회사 자금↓ · 구독↑',fn:()=>{S.co.cash-=.03*OUT().p;S.co.bS+=.012;toast('전환 캠페인을 시작했다');}},
   {label:'광고주를 찾아간다',sub:'광고 매출↑',fn:()=>{S.co.adB+=.05;S.cHit=Math.max(0,(S.cHit||0)-.02);toast('광고주 몇 곳을 데려왔다');}},
   {label:'그냥 둔다',cls:'ghost'}]);}},
 {w:2,c:()=>(S.npcOut||[]).length>0&&S.rank>=1&&S.rank<=4&&!S.founder,run:()=>{const o=pick(S.npcOut);openModal('신생 매체의 러브콜',`<p class="lede">새로 생긴 「${esc(o.n)}」 대표가 술자리에서 말했다. "우리 창간 멤버로 오시죠. 직급은 하나 올려 드릴게."</p>`,[
   {label:'연봉 협상 카드로 쓴다',sub:'평가가 높으면 통한다',fn:()=>{if(S.eval>=55&&chance(.5)){toast(apply({money:150,eval:.5}));}else toast(apply({eval:-1}));}},
   {label:'정중히 거절한다',sub:'',fn:()=>toast(apply({trust:.3}))}]);}},
 {w:2,c:()=>S.founder&&(S.npcOut||[]).length>0,run:()=>{const o=pick(S.npcOut);openModal('후발 주자',`<p class="lede">우리를 따라 한 「${esc(o.n)}」${jp(esc(o.n),'이','가')} 창간했다. 우리 기자 둘에게 연락했다는 소문이다.</p>`,[
   {label:'창간 멤버 처우를 올린다',sub:'회사 자금↓ · 이탈 방지',fn:()=>{S.co.cash-=.1;S.team.forEach(t=>t.skill+=.5);toast('창간 멤버들을 붙잡았다');}},
   {label:'"우리가 원조"라는 기획을 낸다',sub:'평판이 높을수록 효과',fn:()=>toast(apply({fame:S.fame>=20?1.2:.4}))},
   {label:'신경 쓰지 않는다',fn:()=>{if(S.team.length>3&&chance(.4)){const m=pick(S.team);S.team=S.team.filter(x=>x!==m);S.co.staff=Math.max(1,S.co.staff-1);toast(`${m.name} 기자가 「${o.n}」${jp(o.n,'으로','로')} 갔다`);}else toast('다행히 아무도 안 갔다');}}]);}},
 // --- 속보·단독·특종 ---
 {w:3,c:()=>(S.bigScoops||0)>0&&recentScoop(70),run:()=>openModal('대특종의 그림자',`<p class="lede">기사에 나온 쪽 대형 로펌이 내용증명을 보냈다. "법적 대응을 검토 중입니다."</p>`,[
   {label:'추가 증거로 후속을 쓴다',sub:'검증력이 높을수록 안전',fn:()=>{if(chance(clamp(S.st.ver/90,.3,.9)))toast(apply({fame:1,trust:1}));else{toast(apply({trust:-1}));if(typeof lawsuit==='function'&&chance(.3))try{lawsuit();}catch(e){}}}},
   {label:'반론을 충분히 실어 준다',sub:'신뢰↑ · 기세는 조금 꺾인다',fn:()=>toast(apply({trust:1.2,fame:-.3}))}])},
 {w:3,c:()=>recentScoop(55)&&S.rank<=5,run:()=>openModal('방송 출연 요청',`<p class="lede">시사 프로그램 작가: "그 단독 쓰신 기자님, 내일 아침 생방송 출연 가능하세요?"</p>`,[
   {label:'나간다',sub:'평판↑ · 컨디션↓ · 말실수 위험',fn:()=>{const ok=chance(.55+S.st.brd/200+S.st.men/400);toast(ok?apply({fame:1.5,hp:-6}):apply({fame:.3,trust:-1,hp:-6}));}},
   {label:'회사 방침상 사양한다',fn:()=>toast(apply({eval:.4}))}])},
 {w:3,c:()=>recentScoop(40)&&S.comp&&S.comp.length,run:()=>{const c=compPick();openModal('받아쓰기, 출처 없이',`<p class="lede">${jo2(esc(cName(c)),'이','가')} 우리 단독을 거의 그대로 받아쓰면서 출처를 안 밝혔다.</p>`,[
   {label:'공식 항의하고 SNS에 알린다',sub:'평판↑ · 경쟁사 경계↑',fn:()=>{c.aggro+=8;toast(apply({fame:.8}));}},
   {label:'기자협회에 문제를 제기한다',sub:'신뢰↑',fn:()=>{c.pen=(c.pen||0)+1;toast(apply({trust:.6}));}},
   {label:'"다들 그렇지" 하고 넘긴다',cls:'ghost'}]);}},
 {w:2,c:()=>S.rank>=1&&S.rank<=3&&!S.founder&&S.comp&&S.comp.length,run:()=>{const c=compPick();openModal('물먹었다',`<p class="lede">아침 지면을 펼쳤더니 ${jo2(esc(cName(c)),'이','가')} 우리 출입처 단독을 1면에 박았다. 부장 전화가 온다.</p>`,[
   {label:'오늘 안에 반박·추가 취재로 따라잡는다',sub:'컨디션↓ · 성공하면 만회',fn:()=>{if(chance(.45+S.st.inv/250))toast(apply({eval:.8,hp:-8}));else toast(apply({eval:-.8,hp:-8}));}},
   {label:'솔직히 놓쳤다고 보고한다',fn:()=>toast(apply({eval:-.6,trust:.2}))}]);}},
 // --- 지자체 행사 ---
 {w:3,c:()=>hasLge()&&S.comp&&S.comp.length,run:()=>{const e=S.lge.find(x=>!x.done);const c=compPick();openModal('맞불 행사',`<p class="lede">${jo2(esc(cName(c)),'이','가')} 「${esc(e.n)}」${jp(esc(e.n),'과','와')} 같은 주말에 비슷한 대회를 연다고 발표했다.</p>`,[
   {label:'경품·홍보를 키운다',sub:'회사 자금↓ · 참가자 방어',fn:()=>{S.co.cash-=+(e.bud*.05).toFixed(2);e.boost=(e.boost||1)*1.08;toast('홍보를 키웠다');}},
   {label:'협찬사를 먼저 잡는다',sub:'관계망이 좋을수록 유리',fn:()=>{if(chance(.5)){e.spons=(e.spons||1)*1.1;toast('협찬사를 지켰다');}else{e.spons=(e.spons||1)*.85;toast('협찬사 하나가 넘어갔다');}}},
   {label:'신경 쓰지 않는다',fn:()=>{e.fees=(e.fees||1)*.88;toast('참가자가 조금 갈렸다');}}]);}},
 {w:2,c:()=>hasLge(),run:()=>{const e=S.lge.find(x=>!x.done);const cid=cityEnt();openModal('축사 순서 신경전',`<p class="lede">「${esc(e.n)}」 개막식 축사 순서를 두고 단체장 쪽과 의회 쪽이 서로 먼저 하겠다고 한다.</p>`,[
   {label:'단체장을 앞세운다',sub:'지자체 관계↑ · 의회 관계↓',fn:()=>{if(cid)netUp(cid,5);if(ENT.lcouncil&&cid!=='lcouncil')netUp('lcouncil',-5);toast('단체장이 흡족해했다');}},
   {label:'축사를 다 빼고 선수 중심으로 간다',sub:'신뢰↑ · 양쪽 다 서운',fn:()=>{if(cid)netUp(cid,-3);toast(apply({trust:.6}));}}]);}},
 {w:2,c:()=>!S.founder&&S.rank<=3&&(hasLge()||(S.lgeReg||[]).length),run:()=>openModal('행사 지원 차출',`<p class="lede">사업국에서 "기자들도 행사 당일 진행 요원으로 나와 달라"는 공문이 왔다.</p>`,[
   {label:'나간다',sub:'평가↑ · 컨디션↓',fn:()=>toast(apply({eval:.6,hp:-8}))},
   {label:'취재 일정을 핑계로 빠진다',fn:()=>toast(apply({eval:-.4}))}])},
 // --- 직급 시스템 ---
 {w:2,c:()=>!!S.protege&&S.rank>=2,run:()=>openModal('제자의 슬럼프',`<p class="lede">${esc(S.protege)} 기자가 석 달째 기사가 안 풀린다며 그만두고 싶다고 했다.</p>`,[
   {label:'밤새 원고를 같이 고친다',sub:'컨디션↓ · 제자 성장',fn:()=>{const m=deptPeople().find(x=>x.name===S.protege);if(m)m.skill+=2;toast(apply({hp:-8,cha:.3}));}},
   {label:'"원래 그래" 하고 다그친다',sub:'잘 버티면 크게 큰다',fn:()=>{const m=deptPeople().find(x=>x.name===S.protege);if(chance(.5)){if(m)m.skill+=3;toast('독기를 품고 단독을 따 왔다');}else{S.protege=null;toast('제자가 다른 부서로 옮겼다');}}}])},
 {w:2,c:()=>!S.founder&&S.rank>=1&&S.rank<=3&&S.beatM&&(S.beatM[S.dept]||0)>=50,run:()=>openModal('기자단 간사 제안',`<p class="lede">출입처 기자단이 당신을 간사로 추천했다. 브리핑 일정·엠바고 조율을 맡게 된다.</p>`,[
   {label:'맡는다',sub:'인맥↑ · 출입처 장악도↑ · 컨디션↓',fn:()=>{S.beatM[S.dept]=Math.min(100,S.beatM[S.dept]+6);toast(apply({net:.6,hp:-5}));}},
   {label:'사양한다',fn:()=>toast('다른 기자가 간사가 됐다')}])},
 {w:2,c:()=>!S.founder&&S.agenda&&!S.agenda.done,run:()=>openModal('어젠다 역풍',`<p class="lede">연중 기획이 광고주 업계를 정면으로 겨누자 광고국장이 국장실로 찾아왔다.</p>`,[
   {label:'기획을 밀고 간다',sub:'어젠다↑ · 광고 매출↓',fn:()=>{S.agenda.p=Math.min(100,S.agenda.p+6);S.co.adB-=.05;toast(apply({trust:.8}));}},
   {label:'톤을 조금 낮춘다',sub:'광고 유지 · 어젠다 정체',fn:()=>toast(apply({trust:-.5}))}])},
 {w:2,c:()=>!S.founder&&S.rank===7&&S.kpi,run:()=>openModal('이사회의 압박',`<p class="lede">사외이사가 회의 도중 말했다. "KPI 달성률이 이대로면 연임 안건 올리기 어렵습니다."</p>`,[
   {label:'비용 절감안을 낸다',sub:'회사 자금↑ · 보도 품질↓',fn:()=>{S.co.cash+=.05*OUT().p;S.co.q=clamp(S.co.q-2,10,100);toast('절감안이 통과됐다');}},
   {label:'신사업 계획을 설득한다',sub:'평가는 성과로 증명해야',fn:()=>toast(apply({eval:chance(.5)?1:-1}))}])},
 // --- 내 돈 ---
 {w:2,c:()=>(S.coin||0)>0,run:()=>{const up=chance(.5);const v=Math.round(S.coin*(up?R(20,50):-R(20,55))/100);openModal(up?'코인 급등':'코인 급락',`<p class="lede">새벽에 알림이 울렸다. 넣어 둔 코인이 ${up?'폭등':'폭락'}했다. 평가액 ${(S.coin+v).toLocaleString('ko-KR')}만 원.</p>`,[
   {label:'전부 판다',fn:()=>{const t=Math.max(0,S.coin+v);S.coin=0;toast(apply({money:t}));}},
   {label:'계속 들고 간다',fn:()=>{S.coin=Math.max(0,S.coin+v);toast('계속 들고 가기로 했다');}}]);}},
 {w:2,c:()=>!!S.book,run:()=>openModal('북토크 초청',`<p class="lede">동네 서점에서 출간 예정인 책 북토크를 열자고 한다.</p>`,[
   {label:'간다',sub:'평판↑ · 인세↑',fn:()=>{S.book.royalty=Math.round(S.book.royalty*1.2);toast(apply({fame:.6,hp:-3}));}},
   {label:'다음에',cls:'ghost'}])},
 {w:2,c:()=>!!S.sideNL&&!S.founder,run:()=>openModal('겸직 신고',`<p class="lede">인사팀: "개인 유료 뉴스레터, 겸직 신고가 안 돼 있네요."</p>`,[
   {label:'신고하고 계속한다',sub:'평가 조금↓',fn:()=>toast(apply({eval:-.6}))},
   {label:'뉴스레터를 접는다',fn:()=>{S.sideNL=null;toast('뉴스레터를 접었다');}}])},
 {w:1,c:()=>!!S.pet,run:()=>openModal('반려동물 병원비',`<p class="lede">새벽에 반려동물이 아파 동물병원 응급실에 갔다.</p>`,[{label:'치료한다',fn:()=>toast(apply({money:-R(30,120),hp:-3}))}])},
 // --- 수익 사업·포털 ---
 {w:2,c:()=>S.biz&&S.biz.video>0,run:()=>{const big=chance(.4);openModal(big?'영상 조회수 폭발':'영상 저작권 경고',`<p class="lede">${big?'어제 올린 취재 뒷이야기 영상이 100만 회를 넘겼다.':'영상에 쓴 배경음악 때문에 채널 경고를 받았다.'}</p>`,[{label:'확인',fn:()=>{if(big){S.co.bT+=.02;S.co.cash+=.02*OUT().p;toast(apply({fame:.6}));}else{S.co.cash-=.01*OUT().p;toast('영상을 내렸다');}}}]);}},
 {w:2,c:()=>S.biz&&S.biz.forum>0,run:()=>openModal('포럼 기조연설자 노쇼',`<p class="lede">포럼 이틀 전, 기조연설을 맡은 장관이 일정을 취소했다.</p>`,[
   {label:'대체 연사를 급히 섭외한다',sub:'인맥이 넓을수록 유리',fn:()=>{if(chance(.4+S.st.net/200))toast('더 화제가 되는 연사를 잡았다');else{S.co.cash-=.02*OUT().p;toast('협찬사 일부가 빠졌다');}}},
   {label:'토론 세션으로 바꾼다',fn:()=>toast('조용히 지나갔다')}])},
 {w:2,c:()=>S.biz&&S.biz.member>0&&S.trust<45,run:()=>openModal('후원 해지 행렬',`<p class="lede">신뢰도가 떨어지자 후원 회원들의 해지 메일이 쏟아진다.</p>`,[
   {label:'편집국장 명의 사과문을 낸다',sub:'신뢰↑ · 해지 둔화',fn:()=>{S.co.bS+=.004;toast(apply({trust:1}));}},
   {label:'버틴다',fn:()=>{S.co.bS-=.006;toast('회원이 줄었다');}}])},
 {w:2,c:()=>!!S.portal&&S.portal.lv>=1&&adMgr(),run:()=>{const good=S.co.q>=55;openModal('포털 알고리즘 개편',`<p class="lede">포털이 뉴스 배열 알고리즘을 바꿨다. ${good?'원문 품질을 따지는 쪽이다.':'클릭 수를 더 따지는 쪽이다.'}</p>`,[{label:'확인',fn:()=>{S.co.bT+=good?.02:-.01;toast(good?'우리 기사 노출이 늘었다':'트래픽이 조금 빠졌다');}}]);}},
 // --- 창간 초기 ---
 {w:3,c:()=>S.founder&&S.turn-(S.fStart||0)<YW*2,run:()=>openModal('지원사업 공모',`<p class="lede">지역신문발전위원회·언론진흥재단의 기획취재 지원사업 공모가 떴다.</p>`,[
   {label:'기획안을 써서 낸다',sub:'회사 자금↑ (선정되면) · 컨디션↓',fn:()=>{const p=clamp(.35+S.co.q/250+S.trust/300,.3,.8)*(S.diff==='hard'?.8:1);if(chance(p)){const v=+(.08+.04*OUT().p).toFixed(2);S.co.cash+=v;toast(`선정! 지원금 ${eok(v)} · ${apply({hp:-5,fame:.4})}`);}else toast(apply({hp:-5}));}},
   {label:'이번엔 넘긴다',cls:'ghost'}])},
 {w:2,c:()=>S.founder&&S.turn-(S.fStart||0)<YW*3&&S.co.cash<3,run:()=>openModal('엔젤 투자자',`<p class="lede">지역 기업인이 "좋은 언론 하나는 있어야지"라며 투자 의향을 밝혔다.</p>`,[
   {label:'받는다',sub:'회사 자금↑ · 그쪽 비판 기사는 부담',fn:()=>{S.co.cash+=.4;S.angel=1;toast(apply({trust:-.5}));}},
   {label:'편집권 보장 조항을 넣자고 한다',sub:'성사 확률 반반',fn:()=>{if(chance(.5)){S.co.cash+=.3;toast(apply({trust:.6}));}else toast('투자가 무산됐다');}},
   {label:'거절한다',fn:()=>toast(apply({trust:.4}))}])},
 {w:2,c:()=>S.founder&&fEarlyCost()<1&&S.team.length>0,run:()=>{const m=pick(S.team);openModal('박봉의 창간 멤버',`<p class="lede">${esc(m.name)} 기자: "대표님, 이 월급으로는 월세 내기가 빠듯해요."</p>`,[
   {label:'지분이나 성과급을 약속한다',sub:'사기↑',fn:()=>{m.skill+=1;toast('조금만 더 버텨 보자고 했다');}},
   {label:'내 월급을 줄여 보탠다',sub:'통장↓',fn:()=>{m.skill+=1.5;toast(apply({money:-150}));}},
   {label:'"다 같이 힘들다"',fn:()=>{if(chance(.35)){S.team=S.team.filter(x=>x!==m);S.co.staff=Math.max(1,S.co.staff-1);toast(`${m.name} 기자가 떠났다`);}else toast('씁쓸하게 돌아갔다');}}]);}},
 // --- 지역주재 ---
 {w:2,c:()=>(S.corr||[]).length>0&&(S.founder||S.rank>=4),run:()=>{const m=pick(S.corr);openModal('주재기자 유착 의혹',`<p class="lede">${esc(m.reg||'지역')} 주재 ${esc(m.name)} 기자가 지역 업체 광고를 따 오며 기사를 봐줬다는 투서가 왔다.</p>`,[
   {label:'감사한다',sub:'신뢰↑ · 지역 광고↓',fn:()=>{S.co.adB-=.02;toast(apply({trust:1}));}},
   {label:'구두 경고로 끝낸다',sub:'들키면 큰일',fn:()=>{if(chance(.3))toast(apply({trust:-2}));else toast('조용히 넘어갔다');}}]);}},
 // --- 퇴직 바람 ---
 {w:1,c:()=>!S.founder&&S.rank>=3&&S.co&&S.co.cash<1,run:()=>openModal('동기의 명예퇴직',`<p class="lede">입사 동기가 명예퇴직 신청서를 냈다. "남는 게 더 무섭더라."</p>`,[
   {label:'송별회를 챙긴다',sub:'컨디션↓ · 동료들 마음 얻음',fn:()=>toast(apply({hp:-5,cha:.3}))},
   {label:'내 앞날을 생각해 본다',fn:()=>toast(apply({men:.3}))}])}
);

// ===== 나이 · 정년 · 은퇴 =====
// 일반 기자 정년 60세 · 편집국장 이상 임원은 임기로 65세까지 · 창간 대표는 정년이 없고 70세부터 은퇴를 고민한다(최대 78세)
const AGE_RET=60,AGE_EXEC=65,AGE_FND=70,AGE_FMAX=78;
function myAge(){if(S.age0==null){S.age0=S.founder?40:26;S.ageT0=0;}return S.age0+Math.floor((S.turn-(S.ageT0||0))/YW);}
function npcAge(m){if(m.age!=null&&m.t0!=null)return m.age+Math.floor((S.turn-m.t0)/YW);const y=typeof myrs==='function'?myrs(m):(m.yrs||1);let h=0;for(const ch of String(m.name||''))h=(h*31+ch.charCodeAt(0))>>>0;return clamp(26+y+(h%4)-1,24,66);}
function retireAge(){if(S.founder)return S.retExt||AGE_FND;if(S.rank>=6)return S.retExt||AGE_EXEC;return S.retExt||AGE_RET;}
function ageLine(){const a=myAge(),r=retireAge();const left=r-a;return `${a}세${S.story?'':left<=5&&left>0?` · ${S.founder?'은퇴 고민':'정년'}까지 ${left}년`:left<=0?` · ${S.founder?'현역 연장 중':'정년 연장 중'}`:''}`;}
// 시작 나이에 따른 차이: 늦게 들어올수록 상식·친화력이 조금 높고 체력이 조금 낮다
function ageStart(){const a=S.age0||26;if(S.smode==='found'){const d=a-35;gain('net',d*.5);gain('kno',d*.4);gain('sta',-d*.4);S.fame=(S.fame||0)+d*.3;}else{const d=a-23;gain('kno',d*.8);gain('cha',d*.4);gain('sta',-d*.3);}}
function ageCheck(Qx){if(S.story||S.phase!=='game')return;const a=myAge();if(S._ageSeen===a)return;const first=S._ageSeen==null;S._ageSeen=a;if(first)return;
  if(a>=50&&!S.founder)gain('sta',-.3);if(a>=60)gain('sta',-.4);
  const R0=retireAge();
  if(!S.founder&&a===R0-2&&!S.retWarn){S.retWarn=1;if(S.simple){toast(`정년(${R0}세)까지 2년 남았다`);return;}Qx.push(()=>openModal('정년 2년 전',`<p class="lede">인사팀에서 "정년 퇴직 예정자 안내문"이 왔다. ${R0}세가 되는 해에 퇴직한다.</p><p class="hint">퇴직 전에 회사를 나와 창간할 수도 있고, 실적이 좋으면 선임기자로 남을 수도 있다.</p>`,[{label:'알겠다'}]));return;}
  if(!S.founder&&a>=R0){Qx.push(()=>retireCareer());return;}
  if(S.founder&&a>=R0)Qx.push(()=>retireFounder(a));}
function retireCareer(){const a=myAge();const exec=S.rank>=6;const canExt=!S.retExt&&(S.eval>=55||S.fame>=35||S.awards>=1);const pay=typeof payOf==='function'?payOf(OUT()):500;const sev=Math.round(pay*Math.min(36,years())/10)*10;
  openModal(exec?'임기 만료 · 퇴임':'정년퇴직',`<p class="lede">${a}세. ${exec?`${esc(OUT().n)} ${rankName()} 임기가 끝났다. 이사회가 송별사를 준비했다.`:`${years()}년 기자 생활의 마지막 출근이다. 후배들이 꽃다발과 마지막 지면을 액자로 만들어 왔다.`}</p><p>퇴직금 약 <b>${sev.toLocaleString('ko-KR')}만 원</b>.</p>`,[
   {label:exec?'퇴임한다':'정년퇴직한다',sub:'커리어 결산',fn:()=>{S.money+=sev;ending(exec?'임기 만료 퇴임':'정년퇴직');return false;}},
   ...(canExt?[{label:exec?'고문으로 2년 더 남는다':'선임기자로 2년 더 쓴다',sub:exec?'경영 자문 · 권한은 줄어든다':'촉탁 계약 · 월급은 줄고 현장 기자로 복귀',fn:()=>{S.retExt=a+2;if(!exec){S.payK=(S.payK||1)*.7;}toast(apply({eval:-1}));log(`${jo2(exec?'고문':'선임기자','으로','로')} ${a+2}세까지 연장`);}}]:[]),
   {label:'퇴직금으로 창간한다',sub:'창간 대표는 정년이 없다 · 70세 무렵까지 현역',fn:()=>{S.money+=sev;S.retExt=null;RUN.found();return false;}}]);}
function retireFounder(a){const c=S.co;const val=+Math.max(0,(c.cash||0)+OUT().p*1.5+(S.myShare||5)/10).toFixed(1);const last=a>=AGE_FMAX;
  openModal(last?'마지막 결단':'은퇴를 생각할 나이',`<p class="lede">${a}세. ${last?'더는 미룰 수 없다. 주치의도, 가족도 이제 쉬라고 한다.':'창간 대표에게 정년은 없다. 하지만 몸이 예전 같지 않다.'}</p><p class="hint">회사 가치 추정 약 ${eok(val)}.</p>`,[
   ...(!last?[{label:'현역으로 더 뛴다',sub:'1~2년 더 · 체력·컨디션이 해마다 떨어진다',fn:()=>{S.retExt=Math.min(AGE_FMAX,a+R(1,2));S.hp=clamp(S.hp-10,0,100);toast('아직은 내 손으로 신문을 만든다');}}]:[]),
   {label:'후배에게 대표를 물려주고 은퇴한다',sub:'신뢰가 높을수록 좋은 결말',fn:()=>{ending('대표 은퇴 · 승계');return false;}},
   {label:'회사를 매각하고 은퇴한다',sub:`매각 대금 약 ${eok(val*.6)} (지분 기준)`,fn:()=>{S.money+=Math.round(val*.6*10000);ending('매각 후 은퇴');return false;}}]);}
// 나이 선택 칸 (만들기 화면)
function ageGroupHTML(){if(S.smode==='story')return '';const F=S.smode==='found';const L=F?[35,38,40,43,45,48,50,55]:[23,24,25,26,27,28,29];if(S.age0==null||(F&&S.age0<35)||(!F&&(S.age0<23||S.age0>29)))S.age0=F?40:26;
  return `<div class="group"><h4>나이<small>${F?'창간 대표는 35세 이상 · 나이가 많을수록 인맥·상식↑ 체력↓':'수습 입사 23~29세 · 늦게 들어올수록 상식·친화력↑ 체력↓, 정년(60세)까지 남은 시간은 짧다'}</small></h4><div class="agech">${L.map(a=>`<button class="chip agc" data-age="${a}" aria-pressed="${S.age0===a}">${a}세</button>`).join('')}</div></div>`;}

// ===== 월급 보기 · 임금 조정 (편집국장: 편집국 수당 / 사장·창간 대표: 기본급) =====
// 사기(S.wMood 0~100)는 임금이 업계 평균보다 높으면 오르고 낮으면 떨어진다. 깎을 때는 올릴 때보다 두 배 아프다.
function npcRankM(m){if(m.rk!=null)return RANKM[0];if(m.r!=null)return RANKM[[1,2,3,4][clamp(m.r,0,3)]]||1;const r=String(m.role||'');return RANKM[/수습/.test(r)?0:/부국장/.test(r)?4:/부장|팀장|데스크/.test(r)?3:/차장|캡/.test(r)?2:1];}
function npcPay(m){const o=OUT();const y=typeof myrs==='function'&&m.t0!=null?myrs(m):(m.yrs||1);return Math.round(o.pay*otr('pay',o)*npcRankM(m)*(1+.025*y)*DF().pay/5*(S.payLv||1)*(m.payK||1))*5;}
function payTxt(m){try{return `월 ${npcPay(m).toLocaleString('ko-KR')}만`;}catch(e){return '';}}
function payroll(){const o=OUT(),c=S.co;const infl=Math.pow(1.02,Math.floor(S.turn/YW));return c.staff*(S.founder?.066:.09)*(S.payLv||1)*infl;}
function wageMood(){if(S.wMood==null)S.wMood=60;return S.wMood;}
function moodWord(v){return v>=75?'사기 충천':v>=55?'괜찮음':v>=35?'불만이 쌓인다':v>=20?'술렁인다':'폭발 직전';}
function quitBest(n,why){const L=(S.team||[]).slice().sort((a,b)=>b.skill-a.skill);const out=[];for(let i=0;i<n&&L.length>3;i++){const m=chance(.6)?L.shift():L.splice(R(0,L.length-1),1)[0];S.team=S.team.filter(x=>x!==m);S.co.staff=Math.max(1,S.co.staff-1);out.push(m.name);log(`${m.name} 기자 퇴사 — ${why}`);}if(out.length)S.co.q=clamp(S.co.q-out.length,10,100);return out;}
// 임금 바꾸기: 사기·충격·하방 경직
function setPay(nv,src){const old=S.payLv||1;nv=+clamp(nv,.7,1.5).toFixed(3);S.payLv=nv;wageMood();const d=nv-old;const peak=S.payPeak||1;
  if(d>0)S.wMood=clamp(S.wMood+d*120,0,100);
  if(d<0)S.wMood=clamp(S.wMood+d*(nv<peak?300:240),0,100);
  S.payPeak=Math.max(peak,nv);const res=[];
  if(d<=-.09){const q=quitBest(R(1,3),'임금 삭감');if(q.length)res.push(`${q.join('·')} 기자가 사표를 냈다`);apply({trust:-1.5});try{relUp(colBy('union'),-15,'임금 삭감');}catch(e){}if(S.rank===7&&!S.founder)apply({eval:-1});}
  if(d>=.1&&(S.co.last&&S.co.last.profit<0)){res.push(S.founder?'투자자들이 "이 적자에 임금 인상이냐"고 따진다':'이사회가 "적자 속 임금 인상"을 문제 삼았다');if(!S.founder&&S.rank===7)apply({eval:-1.5});S.payWarn=(S.payWarn||0)+1;}
  if(nv!==old)log(`임금 수준 ×${f1(old)} → ×${f1(nv)}${src?` (${src})`:''}`);return res;}
RUN.wage=function(){const o=OUT(),c=S.co;const pr=payroll();const L=c.last||{};const rev=L.rev||0;const ratio=rev>0?pr/rev:0;const lv=S.payLv||1;const exec=S.rank===6&&!S.founder;wageMood();
  const est=k=>{const np=pr*(k/lv);return `인건비 월 ${eok(np)} (${np>=pr?'+':''}${f1(np-pr)})`;};
  const sample=(S.team||[]).slice(0,3).map(m=>`${esc(m.name)} ${payTxt(m)}`).join(' · ');
  const body=`<p>임금 수준 <b>업계 평균의 ${Math.round(lv*100)}%</b> · 구성원 사기 <b>${Math.round(S.wMood)}</b> (${moodWord(S.wMood)})</p><p>인건비 월 <b>${eok(pr)}</b>${rev?` · 매출 대비 <b style="color:${ratio>.85?'var(--red)':ratio>.65?'var(--sodium)':'var(--good)'}">${Math.round(ratio*100)}%</b>`:''} · 회사 자금 ${eok(c.cash)}</p>${sample?`<p class="hint">예: ${sample}</p>`:''}<p class="hint">${exec?'편집국장은 편집국 수당과 성과급만 손댈 수 있고, 사장 결재가 필요하다.':'한 번에 10% 넘게 깎으면 사표가 나오고, 적자인데 크게 올리면 '+(S.founder?'투자자':'이사회')+'가 문제 삼는다. 한 번 올린 임금은 다시 깎기 더 어렵다. 인건비가 매출의 85%를 넘는 달이 이어지면 재정이 무너진다.'}</p>`;
  const ch=exec?[
   {label:'취재 수당 인상 (+5%)',sub:`사기↑ · ${est(lv*1.05)} · 사장 결재`,fn:()=>{spend(1,3);setCd('wage');if(chance(clamp(.3+S.eval/150,.3,.85))){setPay(lv*1.05,'편집국 수당');toast(`결재 통과 · 사기 ${Math.round(S.wMood)}`);}else{apply({eval:-.5});toast('사장이 "지금 그럴 때냐"며 반려했다');}}},
   {label:'특별 성과급 (한 번)',sub:`회사 자금 -${eok(c.staff*.006)} · 사기 크게↑`,fn:()=>{spend(1,3);setCd('wage');c.cash-=+(c.staff*.006).toFixed(2);S.wMood=clamp(S.wMood+12,0,100);toast(`성과급 지급 · 사기 ${Math.round(S.wMood)}`);}},
   {label:'야근·주말 수당 줄이기 (-5%)',sub:`인건비↓ · 사기↓↓`,fn:()=>{spend(1,3);setCd('wage');const r=setPay(lv*.95,'수당 삭감');toast(r.join(' · ')||`사기 ${Math.round(S.wMood)}`);}}
  ]:[
   ...[[.03,'소폭 인상'],[.07,'인상'],[.15,'대폭 인상']].map(([p,n])=>({label:`${n} (+${Math.round(p*100)}%)`,sub:`${est(lv*(1+p))} · 사기↑${p>=.1?' · 적자면 경영진 반발':''}`,disabled:lv>=1.5,fn:()=>{spend(1,3);setCd('wage');const r=setPay(lv*(1+p),n);toast((r.length?r.join(' · ')+' · ':'')+`사기 ${Math.round(S.wMood)}`);}})),
   {label:'동결',sub:c.last&&c.last.profit>0?'흑자인데 동결이면 불만':'사기 조금↓',fn:()=>{spend(1,3);setCd('wage');S.wMood=clamp(S.wMood-(c.last&&c.last.profit>0?6:2),0,100);toast(`임금 동결 · 사기 ${Math.round(S.wMood)}`);}},
   ...[[.05,'삭감'],[.1,'큰 폭 삭감'],[.2,'비상 삭감']].map(([p,n])=>({label:`${n} (-${Math.round(p*100)}%)`,sub:`${est(lv*(1-p))} · 사기↓↓${p>=.1?' · 사표·노조 반발':''}`,disabled:lv<=.7,fn:()=>{spend(1,3);setCd('wage');const r=setPay(lv*(1-p),n);toast((r.length?r.join(' · ')+' · ':'')+`사기 ${Math.round(S.wMood)}`);}})),
   {label:'성과급 (한 번)',sub:`회사 자금 -${eok(c.staff*.008)} · 사기↑ · 기본급은 그대로`,fn:()=>{spend(1,3);setCd('wage');c.cash-=+(c.staff*.008).toFixed(2);S.wMood=clamp(S.wMood+10,0,100);toast(`성과급 지급 · 사기 ${Math.round(S.wMood)}`);}}];
  openModal(exec?'편집국 수당 조정':'임금 조정',body,ch.concat([{label:'닫기',cls:'ghost'}]));};
RUN.paypol=function(){RUN.wage();};
// 매달: 사기는 임금 수준 쪽으로 천천히 움직이고, 낮으면 사람이 나가고, 인건비가 매출을 잡아먹으면 재정이 무너진다
function wageMonth(lines){if(!S.co||!(S.founder||S.rank>=6))return;const c=S.co;wageMood();const lv=S.payLv||1;
  const target=clamp(58+(lv-1)*140,10,95);S.wMood+=(target-S.wMood)*.08;
  if(S.wMood>=75)(S.team||[]).forEach(t=>t.skill+=.08);
  if(S.wMood<35&&chance(.22)){const q=quitBest(1,'처우 불만');if(q.length)lines.push({c:'r',t:`${q[0]} 기자가 처우 불만으로 회사를 떠났다 (사기 ${Math.round(S.wMood)})`});}
  if(S.wMood<20&&chance(.15)){c.q=clamp(c.q-3,10,100);c.adB-=.03;S.trust=Math.max(0,S.trust-1);lines.push({c:'r',t:'노조가 임금 문제로 제작 거부에 들어갔다. 지면이 얇아졌다'});}
  const L=c.last||{};const ratio=L.rev>0?payroll()/L.rev:0;
  if(ratio>.85){S.wageBad=(S.wageBad||0)+1;if(S.wageBad===3)lines.push({c:'r',t:`인건비가 매출의 ${Math.round(ratio*100)}%다. 이대로면 재정이 버티지 못한다`});
    if(S.wageBad>=6&&chance(.3)){S.wageBad=3;if(S.founder){c.cash-=+(c.staff*.01).toFixed(2);lines.push({c:'r',t:'은행이 대출 금리를 올렸다. 인건비 구조가 위험하다는 판단이다'});}else{apply({eval:-2});lines.push({c:'r',t:'이사회가 인건비 구조조정을 요구했다'});}}}else S.wageBad=0;
  if(c.cash<0&&lv>=.9&&chance(.25)){S.wMood=clamp(S.wMood-15,0,100);const q=quitBest(R(1,2),'임금 체불');lines.push({c:'r',t:`월급이 하루 늦게 나갔다. 임금 체불 소문이 돌고 ${q.length?q.join('·')+' 기자가 떠났다':'분위기가 얼어붙었다'}`});}}

// ===== 승진 추가 조건 · 부서 이동 조건 =====
// 직급이 오를수록 평가·평판 말고도 "그 자리에 맞는 실적"을 본다. 작은 회사는 문턱이 낮고, 간소화 모드는 핵심 하나만, 스토리는 예외.
function promoSz(){return ({1:.5,2:.6,3:.8,4:1,5:1.2}[OUT().p]||1);}
function rankArts(){const t0=S.turn-(S.inRank||0);return (S.clips||[]).filter(c=>c.turn>=t0).length;}
function promoReqs(r){if(S.story||S.founder)return [];const z=promoSz(),n=x=>Math.max(1,Math.round(x*z*(S.simple?.5:1)));const L=[];const errN=y=>(S.errT||[]).filter(t=>t>S.turn-YW*y).length;const bm=Math.max(0,...Object.values(S.beatM||{0:0}));
  if(r===1){L.push({t:`이번 직급 기사 ${rankArts()}/${n(14)}`,ok:rankArts()>=n(14)});L.push({t:`최근 1년 오보 ${errN(1)}/2건 이하`,ok:errN(1)<=2});}
  if(r===2){L.push({t:`단독 ${S.scoops||0}/${n(2)}`,ok:(S.scoops||0)>=n(2)});L.push({t:`출입처 장악도 ${Math.round(bm)}/${S.simple?45:55}`,ok:bm>=(S.simple?45:55)});L.push({t:pgReqTxt(),ok:pgReqOk()});L.push({t:`신뢰 ${Math.round(S.trust)}/45`,ok:S.trust>=45});}
  if(r===3){L.push({t:`부서 성적 2위 이내 ${S.deptTop||0}/${n(3)}회`,ok:(S.deptTop||0)>=n(3)});L.push({t:'특종 이상 1건 또는 기자상',ok:(S.tokjong||0)>=1||(S.awards||0)>=1});L.push({t:`신뢰 ${Math.round(S.trust)}/50`,ok:S.trust>=50});}
  if(r===4){L.push({t:`1면 대결 ${S.fwWins||0}/${n(3)}승 또는 특종 ${S.tokjong||0}/2`,ok:(S.fwWins||0)>=n(3)||(S.tokjong||0)>=2});L.push({t:`신뢰 ${Math.round(S.trust)}/52`,ok:S.trust>=52});}
  if(r===5){L.push({t:`1면 대결 ${S.fwWins||0}/${n(5)}승 · 특종 ${S.tokjong||0}/3 · 기자상 중 하나`,ok:(S.fwWins||0)>=n(5)||(S.tokjong||0)>=3||(S.awards||0)>=1});L.push({t:`신뢰 ${Math.round(S.trust)}/55`,ok:S.trust>=55});L.push({t:`최근 2년 오보 ${errN(2)}/1건 이하`,ok:errN(2)<=1});}
  if(r===6){L.push({t:`신뢰 ${Math.round(S.trust)}/55`,ok:S.trust>=55});L.push({t:'어젠다 완수 또는 회사 흑자',ok:(S.agendaDone||0)>=1||!!(S.co&&S.co.last&&S.co.last.profit>0)});}
  const yk=({1:.4,2:.5,3:.75,4:1,5:1.15}[OUT().p]||1)*(S.simple?.8:1)*(DF().ten||1);const tg=Math.max(r+1,nextRank(r)??r+1)-1;const need=yrsNeedFor(tg+1);const Y={t:`연차 ${years()}/${need}년`,ok:years()>=need};
  const dh=new Set([...(S.deptHist||[]),S.dept]).size;const dn=OUT().p>=4?(r>=4?3:r>=2?2:0):OUT().p===3&&r>=3?2:0;if(dn&&!S.simple)L.push({t:`거친 부서 ${dh}/${dn}곳 (순환 보직)`,ok:dh>=dn});
  return [Y].concat(S.simple?L.slice(0,1):L);}
// 승진은 나이가 아니라 연차(입사 기수) 기준. 목표 직급 t(2=차장 … 7=사장)에 필요한 경력 연차
function yrsNeedFor(t,o){o=o||OUT();const yk=({1:.4,2:.5,3:.75,4:1,5:1.15}[o.p]||1)*(S.simple?.8:1)*(DF().ten||1);const base=[0,0,5,9,13,16,19,22][t]||0,floor=[0,0,3,6,9,11,13,15][t]||0;return Math.max(floor,Math.round(base*yk));}
function ageNeedFor(t,o){const small=(o||OUT()).p<=2;return {2:small?28:31,3:small?32:36,4:small?36:40,5:small?38:44,6:small?40:47,7:small?43:51}[t]||0;}
function ageCapRank(o){const y=years();let r=1;for(let t=2;t<=7;t++)if(y>=yrsNeedFor(t,o))r=t;return r;}
function deptHistAdd(d){S.deptHist=S.deptHist||[];if(!S.deptHist.includes(d))S.deptHist.push(d);}
function promoReqHTML(r){return promoReqs(r).map(x=>`<span class="${x.ok?'ok':''}">${esc(x.t)}</span>`).join('');}
// 부서 등급: 인기·특수 부서는 문턱이 높고, 3D·지역 부서는 쉽게 간다
const DEPT_TIER={pol:['A','정치부는 누구나 가고 싶어 한다',{net:45}],court:['A','법조는 검증 실력이 필요하다',{ver:45}],inv:['A','탐사팀은 단독 실적을 본다',{inv:50}],diplo:['A','외교안보는 어학이 필요하다',{lng:45}],
  int:['B','국제부·특파원 코스',{lng:40}],eco:['B','경제부는 경쟁이 붙는다',{kno:40}],fin:['B','금융은 숫자에 밝아야 한다',{dat:35}],it:['B','IT과학은 전문성을 본다',{kno:40}],stock:['B','',{dat:35}],
  case:['D','사건팀은 늘 사람이 모자란다',null],nat:['D','',null],sigun:['D','지역 주재는 지원자가 적다',null],loc:['D','지역 주재는 지원자가 적다',null],city:['D','',null]};
function deptTier(d){return (DEPT_TIER[d]||['C','',null]);}
function deptReq(d){const [t,why,st]=deptTier(d);const L=[];const yrs=years();const stay=S.turn-(S.deptT??0);
  L.push({t:`지금 부서 1년 이상 (${Math.floor(stay/4)}개월)`,ok:stay>=YW||S.rank===0});
  if(t==='A'){L.push({t:`연차 ${yrs}/3년`,ok:yrs>=3});L.push({t:`평가 ${Math.round(S.eval)}/${S.rank>=2?60:55}`,ok:S.eval>=(S.rank>=2?60:55)});if(d==='inv')L.push({t:`단독 ${S.scoops||0}/1`,ok:(S.scoops||0)>=1});}
  if(t==='B'){L.push({t:`연차 ${yrs}/2년`,ok:yrs>=2});L.push({t:`평가 ${Math.round(S.eval)}/50`,ok:S.eval>=50});}
  if(st)for(const k in st)L.push({t:`${STN[k]} ${Math.round(S.st[k]||0)}/${st[k]}`,ok:(S.st[k]||0)>=st[k]});
  if(S.rank===3)L.push({t:`부장 자리: 평가 ${Math.round(S.eval)}/62`,ok:S.eval>=62});
  return S.simple?L.filter((x,i)=>i===0||!x.ok).slice(0,2):L;}
function deptMoveP(d){const [t]=deptTier(d);const bs=colBy('boss');let p=.3+S.eval/250+Math.min(S.inRank,96)/400+(bs?bs.rel/400:0);p+=({A:-.25,B:-.12,C:0,D:.22})[t];if(S.rank>=2)p-=.08;if(S.rank===3)p-=.12;if(catOf(d).includes(MAJORS[S.major].aff))p+=.05;return clamp(p,.05,.95);}

// ===== 오보 · 부실 기사 · 정정 =====
// 기사를 낼 때 흠(미확인 사실·반론 누락·낚시 제목·낮은 완성도·허위 제보)을 기록해 두고, 몇 달 안에 독자·당사자·경쟁지·심의실이 찾아낸다.
// 고치는 방법에 따라 결과가 갈린다: 바로잡습니다(정정) · 반론보도 · 몰래 수정 · 기사 삭제 · 사과문 · 버티기
function flawTag(it,clip,unv,W){const fl={unv:unv.length,key:unv.some(f=>f.key),norb:!(W.rb&&it.rebut==='got'),bait:W.head==='bait',low:clip.q<40,hoax:!!it.hoax,num:unv.some(f=>f.k==='n')};
  const sc=fl.unv+(fl.key?1.5:0)+(fl.norb?.6:0)+(fl.bait?.8:0)+(fl.low?.8:0)+(fl.hoax?4:0);if(sc<.6)return;fl.sc=sc;clip.fl=fl;}
function corrStats(){const L=S.corrLog||[];const y=L.filter(x=>x.t>S.turn-YW);return{all:L.length,y:y.length,cor:L.filter(x=>x.k==='정정').length,rb:L.filter(x=>x.k==='반론').length,hid:L.filter(x=>x.k==='몰래 수정'||x.k==='삭제').length,big:L.filter(x=>x.big).length};}
function corrAdd(clip,k,big){if(big){calmSet(8);if(perfOn()){S.disc=S.turn;log('징계: 견책 — 올해 인사고과 감점');}}(S.corrLog=S.corrLog||[]).push({h:clip.h,k,t:S.turn,big:!!big});if(S.corrLog.length>40)S.corrLog.shift();clip.corr=k;if(big){S.errors++;S.lastError=S.turn;(S.errT=S.errT||[]).push(S.turn);if(S.errT.length>20)S.errT.shift();}}
const honestK=()=>((S.corrLog||[]).filter(x=>x.k==='정정'||x.k==='반론').length>=3&&!(S.corrLog||[]).some(x=>x.k==='몰래 수정'&&x.caught))?.7:1;
const CORR_WHO={reader:['독자 지적','독자가 기사 속 숫자와 사실관계가 틀렸다고 메일을 보냈다.'],subj:['당사자 항의','기사에 나온 쪽이 "우리 입장은 한 줄도 없다"며 반론보도를 요구했다.'],rival:['경쟁지의 반박 보도','경쟁 매체가 우리 기사의 핵심 내용을 반박하는 기사를 냈다.'],media:['미디어 비평','미디어 비평 매체가 우리 기사를 "확인 안 된 받아쓰기"라고 비판했다.'],inside:['사내 심의실 지적','사내 심의실(독자권익위원회)이 이 기사를 부실 기사 사례로 올렸다.']};
function errTick(Qx){if(S.phase!=='game'||S.story==='rookie')return;if((S.calmT||0)>S.turn)return;const D=DF();
  const L=(S.clips||[]).filter(c=>c.fl&&!c.corr&&!c.flDone&&c.turn>S.turn-YW/2&&c.by===S.name);let hit=null;
  if((S.corrCd||0)>S.turn)L.length=0;for(const c of L){const f=c.fl;const p=clamp((f.unv*.05+(f.key?.06:0)+(f.norb?.03:0)+(f.bait?.04:0)+(f.low?.04:0)+(f.hoax?.3:0))*(D.risk||1)*(hasF('fact')?.75:1)*((c.imp||0)>=50?1.3:1)*(S.simple?.7:1),0,.6);if(chance(p)){hit=c;break;}}
  if(hit){const f=hit.fl;const who=f.hoax||f.key&&chance(.5)?(chance(.5)?'rival':'media'):f.norb&&chance(.5)?'subj':OUT().p>=4&&(f.low||f.bait)&&chance(.4)?'inside':'reader';hit.flDone=1;S.corrCd=S.turn+(S.simple?16:8);Qx.push(()=>corrModal(hit,who));return;}
  // 데스크: 부서원 기사의 흠도 내 책임이다
  if(!S.founder&&S.rank>=2&&S.rank<=6&&(S.team||[]).length&&chance(.05*(D.risk||1)*(hasF('fact')?.7:1))){const J=S.team.filter(x=>npcStage(x)==='jr'||x.rk!=null);const m=J.length&&chance(.7)?pick(J):pick(S.team);Qx.push(()=>deskErr(m));}}
function corrModal(c,who){const f=c.fl;const [wt,wd]=CORR_WHO[who];const sev=f.hoax?3:f.key?2:who==='reader'||who==='inside'?.8:1.2;const k=honestK()*(S.simple?.6:1);
  if(S.simple&&sev<2){corrAdd(c,'정정');toast(`${wt} → "바로잡습니다" 처리 · ${apply({trust:-.4})}`);return;}
  const hide=chance(clamp(.25*(DF().risk||1)*(sev>=2?1.5:1),.1,.6));
  const ch=[
   {label:'"바로잡습니다" 정정을 낸다',sub:`틀린 부분을 인정하고 고친다 · 신뢰 조금↓${sev>=2?' · 오보로 기록':''}`,fn:()=>{corrAdd(c,'정정',sev>=2);toast(apply({trust:-.8*sev*k,eval:-(S.founder?0:.5*sev)}));log(`정정: ${c.h}`);}},
   ...(f.norb&&!f.hoax?[{label:'반론보도를 실어 준다',sub:'상대 입장을 덧붙인다 · 가볍게 끝난다',fn:()=>{corrAdd(c,'반론');toast(apply({trust:-.3*k}));}}]:[]),
   {label:'온라인 기사만 슬쩍 고친다',sub:'당장은 조용하다 · 들키면 "몰래 수정" 논란',fn:()=>{corrAdd(c,'몰래 수정');if(hide){S.corrLog[S.corrLog.length-1].caught=1;const t=apply({trust:-2*sev*(S.simple?.6:1),fame:-1});portalPen(1,'기사 무단 수정');openModal('몰래 수정 들통',`<p class="lede">수정 전후 캡처가 커뮤니티에 돌았다. "고쳐 놓고 모른 척했다"는 비판이 쏟아진다.</p>${fxLine(t)}`);return false;}toast('아무도 눈치채지 못했다… 아직은');}},
   {label:'기사를 내린다',sub:'흔적은 남는다 · 삭제 논란 위험',fn:()=>{corrAdd(c,'삭제',sev>=2);if(chance(.3)){toast(apply({trust:-1.2*sev*k}));}else toast(apply({trust:-.4*sev*k}));}},
   ...(sev>=2?[{label:'사과문을 낸다',sub:'크게 숙인다 · 소송 위험이 사라진다 · 평판↓',fn:()=>{corrAdd(c,'사과',true);toast(apply({trust:-1*k,fame:-1,eval:-(S.founder?0:1)}));log(`사과문: ${c.h}`);}}]:[]),
   {label:'"사실이다" 버틴다',sub:f.hoax||f.key?'근거가 약하다 · 중재·소송으로 번질 수 있다':'확인된 부분이 많으면 넘어간다',fn:()=>{const ok=!f.hoax&&chance(f.key?.25:.55);if(ok){toast(`근거를 내밀자 조용해졌다 · ${apply({trust:.3})}`);return;}if(f.hoax||f.key){S.medQ=S.medQ||[];S.medQ.push({h:c.h,subj:'기사 당사자',due:S.turn+R(1,3),unv:Math.max(1,f.unv),rb:!f.norb,q:c.q,excl:c.excl,imp:c.imp});corrAdd(c,'버팀',true);toast(apply({trust:-1*k}));}else{corrAdd(c,'버팀');toast(apply({trust:-.6*k}));}}}];
  openModal(`${wt} · ${f.hoax?'허위 보도':sev>=2?'오보 의혹':'부실 기사'}`,`<p class="lede">「${esc(c.h)}」 — ${wd}</p><p class="hint">문제: ${[f.hoax?'제보 자체가 허위':'',f.unv?`확인 안 된 사실 ${f.unv}개${f.key?'(핵심 포함)':''}`:'',f.norb?'반론 없음':'',f.bait?'낚시 제목':'',f.low?'완성도 낮음':''].filter(Boolean).join(' · ')}${k<1?' · 그동안 정정에 솔직했던 덕에 타격이 줄어든다':''}</p>${tipN([f.key?'핵심 사실은 두 출처로 확인':'',f.norb?'반론은 취재 중 "반론 요청"으로 받아 두기':'',f.bait?'낚시 제목은 조회수 대신 신뢰를 깎는다':'',f.low?'완성도가 낮으면 단계를 건너뛰지 말기':'',f.hoax?'제보는 다른 경로로 한 번 더 확인':'',f.unv&&!f.key?'확인 안 된 사실은 빼고 쓰기':''].filter(Boolean).join(' · ')||'출고 전 확인을 한 번 더')}`,ch);}
function deskErr(m){openModal('부서원 기사 오류',`<p class="lede">${esc(m.name)} 기자 기사에 틀린 숫자가 그대로 나갔다. 데스크를 본 건 나다.</p>`,[
   {label:'정정을 내고 내가 책임진다',sub:'평가 조금↓ · 부서원 관계↑',fn:()=>{(S.corrLog=S.corrLog||[]).push({h:`${m.name} 기자 기사`,k:'정정',t:S.turn});m.rel=(m.rel||0)+6;toast(apply({eval:-.6,trust:-.4}));}},
   {label:'기자에게 경위서를 받는다',sub:'관계↓ · 재발은 줄어든다',fn:()=>{m.rel=(m.rel||0)-8;m.skill+=.5;(S.corrLog=S.corrLog||[]).push({h:`${m.name} 기자 기사`,k:'정정',t:S.turn});toast(apply({trust:-.4}));}},
   {label:'조용히 온라인만 고친다',sub:'들킬 수 있다',fn:()=>{if(chance(.3)){toast(apply({trust:-2,eval:-1}));}else toast('넘어갔다');}}]);}
// 징계: 1년에 큰 오보가 3번이면 징계위원회
function errDisc(Qx){if(S.founder||S.story)return;const n=(S.errT||[]).filter(t=>t>S.turn-YW).length;if(n<3||(S.discT||-999)>S.turn-YW)return;S.discT=S.turn;
  Qx.push(()=>openModal('징계위원회',`<p class="lede">1년 사이 오보가 ${n}건. 인사위원회가 열렸다.</p>`,[{label:'결과를 받아들인다',fn:()=>{const r=pick(['견책','감봉 3개월','출입처 교체']);if(r==='감봉 3개월')apply({money:-Math.round(payOf(OUT())*.3)});if(r==='출입처 교체'&&OUT().depts.length>2){try{doRotate(pick(OUT().depts.filter(d=>d!==S.dept&&deptTier(d)[0]!=='A')));}catch(e){}}toast(`징계: ${r} · ${apply({eval:-3})}`);log(`징계: ${r}`);}}]));}
function corrBox(){const c=corrStats();if(!c.all&&!(S.errors>0))return '';return `<div class="card"><div class="t">정정·오보 기록</div><div class="meta"><span>정정 ${c.cor}</span><span>반론보도 ${c.rb}</span><span>몰래 수정·삭제 ${c.hid}</span><span class="${(S.errT||[]).filter(t=>t>S.turn-YW).length>=2?'tag bad':''}">최근 1년 오보 ${(S.errT||[]).filter(t=>t>S.turn-YW).length}</span></div>${honestK()<1?'<p class="hint" style="margin:4px 0 0">"정정에 솔직한 기자"라는 평 — 다음 정정 때 타격이 줄어든다</p>':''}</div>`;}
// 알맹이 없는 아이템: 파 보니 이미 해명됐거나 단순 착오
const DUD_WHY=['이미 지난해 감사에서 해명된 일이었다.','단순 행정 착오였고 바로 바로잡혔다.','타사가 2년 전에 다 쓴 내용이다.','법적으로도 절차상으로도 문제가 없다.','제보자가 착각한 것이었다. 날짜가 달랐다.','업계에선 다 아는, 기사가 안 되는 관행이었다.'];
function dudReveal(it){it.dudShown=1;it.imp=Math.max(8,Math.round(it.imp*.35));it.excl=false;it.heat=Math.min(it.heat||2,1);
  openModal('알맹이가 없다',`<p class="lede">「${esc(it.title)}」 — 확인해 보니 ${pick(DUD_WHY)}</p><p class="hint">쓸 수는 있지만 단신감이다. 파급력이 크게 줄었다.</p>`,[
   {label:'단신으로라도 쓴다',sub:'아이템을 남긴다 (파급력↓)',fn:()=>toast('단신 아이템으로 남겼다')},
   {label:'접는다',sub:'아이템을 버린다 · 감은 늘었다',fn:()=>{S.items=S.items.filter(x=>x!==it);toast(apply({ver:.3,kno:.2}));}}]);}