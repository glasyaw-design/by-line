/* 바이라인 1.6 — src/compat/v42.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.42 콘텐츠 보강 =====
// ① 국장~사장·회장 이벤트 ② 회장 위기·후계 엔딩 ③ 사설 주제 30개·시대 맞춤 ④ 스토리 3편 ⑤ 매체 4곳·방송 이벤트 ⑥ 수습 이벤트 ⑦ 은퇴 뒤 에필로그
function c42(){return S&&S.phase==='game'&&!S.story;}
function sOwnRel(v){try{ownRel(v);}catch(e){}}
function sCash(v){try{if(S.co)S.co.cash+=v;}catch(e){}}
function sQ(v){try{if(S.co)S.co.q=clamp(S.co.q+v,10,100);}catch(e){}}
function sMood(v){try{(S.team||[]).forEach(m=>m.mor=clamp((m.mor??60)+v,0,100));}catch(e){}}
function coSz(k){const c=S.co||{};return +Math.max(.2,(c.staff||40)*k).toFixed(2);}
const EV42=[
 // ---- 국장~편집국장 ----
 {w:1.6,c:()=>c42()&&!S.founder&&S.rank>=5&&S.rank<=6,run:()=>openModal('공정보도위원회',`<p class="lede">노조 공정보도위원회가 성명을 냈다. "지난주 기획 기사가 왜 하루 만에 내려갔는지 편집국장단은 답하라."</p>`,[
   {label:'경위를 공개하고 사과한다',sub:'신뢰↑ · 편집국 분위기↑ · 윗선은 불편해한다',fn:()=>{sMood(4);sOwnRel(-4);toast(apply({trust:1.5,eval:-.5}));}},
   {label:'"편집권은 데스크에 있다"며 일축한다',sub:'윗선 신임↑ · 기자들 반발',fn:()=>{sMood(-6);sOwnRel(3);toast(apply({trust:-1,eval:.8}));}},
   {label:'공보위와 정례 협의회를 만든다',sub:'분위기↑ · 회의가 늘어난다(컨디션↓)',fn:()=>{sMood(6);toast(apply({trust:1,hp:-6}));}}])},
 {w:1.4,c:()=>c42()&&!S.founder&&S.rank>=4&&S.rank<=6,run:()=>{const nm=rname();openModal('인사 청탁',`<p class="lede">대주주 쪽 인사가 조용히 전화했다. "${esc(nm)} 기자, 제 조카인데 정치부로 좀 옮겨 주시죠."</p>`,[
   {label:'들어준다',sub:'대주주 관계↑ · 편집국에 소문이 돈다',fn:()=>{sOwnRel(6);sMood(-5);toast(apply({trust:-.8,eval:.6}));log(`인사 청탁 수용 — ${nm}`);}},
   {label:'정중히 거절한다',sub:'대주주 관계↓ · 원칙을 지켰다',fn:()=>{sOwnRel(-5);toast(apply({trust:.8}));}},
   {label:'인사위원회 공모로 돌린다',sub:'관계 조금↓ · 공정 인사 원칙이 선다',fn:()=>{sOwnRel(-2);sMood(3);toast(apply({trust:.5,eval:.3}));}}]);}},
 {w:1.3,c:()=>c42()&&!S.founder&&S.rank>=5&&S.rank<=6,run:()=>{const d=pick(OUT().depts.filter(x=>DEPTS[x]&&x!==S.dept))||S.dept;openModal('대형 오보의 책임',`<p class="lede">${DEPTS[d]?DEPTS[d].n:'한 부서'}의 1면 기사가 오보로 드러났다. 사장실은 「편집국 책임」을 묻는다.</p>`,[
   {label:'편집국장 명의로 사과문을 싣는다',sub:'신뢰 방어 · 내 평가↓',fn:()=>{toast(apply({trust:1.2,eval:-1.5,fame:-.3}));}},
   {label:'해당 부장을 문책한다',sub:'평가 방어 · 편집국 분위기↓',fn:()=>{sMood(-5);toast(apply({eval:.5,trust:-.3}));}},
   {label:'검증 시스템을 새로 짠다 — 팩트체크 데스크 신설',sub:`회사 자금 -${eok(coSz(.004))} · 보도 품질↑`,fn:()=>{sCash(-coSz(.004));sQ(3);toast(apply({trust:.6}));}}]);}},
 {w:1.2,c:()=>c42()&&!S.founder&&S.rank>=5,run:()=>openModal('기자협회 성명',`<p class="lede">한국기자협회가 우리 보도를 두고 「저널리즘 원칙을 저버렸다」는 성명을 냈다.</p>`,[
   {label:'반박 입장문을 낸다',sub:'윗선은 좋아한다 · 업계 평판↓',fn:()=>{sOwnRel(2);toast(apply({fame:-1,eval:.4}));}},
   {label:'지적을 받아들이고 바로잡는다',sub:'신뢰·평판 회복',fn:()=>{toast(apply({trust:1.2,fame:.6,eval:-.4}));}},
   {label:'편집국 공개 토론회를 연다',sub:'분위기↑ · 시간이 든다',fn:()=>{sMood(4);toast(apply({trust:.8,hp:-5}));}}])},
 {w:1.1,c:()=>c42()&&(S.founder||S.rank>=5),run:()=>openModal('국익과 특종 사이',`<p class="lede">외교 협상 문건을 단독으로 입수했다. 외교부가 "보도되면 협상이 깨진다"며 보도 자제를 요청한다.</p>`,[
   {label:'보도한다 — 국민이 알아야 한다',sub:'평판↑↑ · 정부 관계↓↓ · 국익 논란',risk:true,fn:()=>{S.bigScoops=(S.bigScoops||0)+(chance(.4)?1:0);toast(apply({fame:2.5,trust:chance(.6)?1:-1.5,eval:1}));log('외교 문건 단독 보도');}},
   {label:'협상 뒤로 엠바고를 걸고 기다린다',sub:'신뢰↑ · 단독을 잃을 수 있다',fn:()=>{if(chance(.35))toast('타사가 먼저 썼다 · '+apply({fame:-.5}));else toast('협상이 끝난 날 단독으로 냈다 · '+apply({fame:1.5,trust:1}));}},
   {label:'보도하지 않는다',sub:'정부 관계↑ · 편집국은 실망',fn:()=>{sMood(-4);toast(apply({trust:-.4}));}}])},
 {w:1.2,c:()=>c42()&&!S.founder&&S.rank>=4&&S.rank<=6,run:()=>openModal('부장들의 연판장',`<p class="lede">부장 다섯이 「편집 방향이 독자와 멀어졌다」는 연판장을 돌렸다.</p>`,[
   {label:'부장 회의를 열어 듣는다',sub:'분위기↑ · 내 방침은 조금 물러선다',fn:()=>{sMood(6);toast(apply({eval:-.3,trust:.4}));}},
   {label:'주동자를 인사로 정리한다',sub:'장악력↑ · 편집국 분위기↓↓',risk:true,fn:()=>{sMood(-10);sOwnRel(2);toast(apply({eval:.8,trust:-.6}));}},
   {label:'방향을 손본다 — 독자 조사부터',sub:`회사 자금 -${eok(coSz(.002))} · 보도 품질↑`,fn:()=>{sCash(-coSz(.002));sQ(2);toast(apply({trust:.5}));}}])},
 {w:1.3,c:()=>c42()&&(S.founder||S.rank>=5),run:()=>{const cp=(S.comp&&S.comp.length)?cName(pick(S.comp)):'경쟁사';openModal('대량 스카우트',`<p class="lede">${jo2(esc(cp),'이','가')} 우리 기자 다섯 명에게 한꺼번에 연봉 30% 인상을 제시했다.</p>`,[
   {label:'처우를 올려 붙잡는다',sub:`회사 자금 -${eok(coSz(.006))} · 전력 유지`,fn:()=>{sCash(-coSz(.006));sMood(3);toast('다섯 명 모두 남았다');}},
   {label:'보내고 그 자리를 공채로 채운다',sub:'비용 절감 · 보도 품질 잠깐↓',fn:()=>{sQ(-3);try{S.co.staff=Math.max(3,S.co.staff-2);}catch(e){}toast(apply({eval:-.4}));}},
   {label:'맞불 — 그쪽 에이스를 빼 온다',sub:`회사 자금 -${eok(coSz(.004))} · 보도 품질↑ · 경쟁사와 감정싸움`,risk:true,fn:()=>{sCash(-coSz(.004));sQ(2);toast(apply({fame:.6}));}}]);}},
 {w:1.1,c:()=>c42()&&(S.founder||S.rank>=5)&&!isTV(),run:()=>openModal('포털 노출 급감',`<p class="lede">포털 알고리즘이 바뀐 뒤 우리 기사 노출이 40% 줄었다. 디지털국이 대책을 묻는다.</p>`,[
   {label:'포털에 공식 항의하고 기준 공개를 요구한다',sub:'업계 공동 대응 · 효과는 더디다',fn:()=>{toast(apply({fame:.5}));}},
   {label:'노출이 잘 되는 기사를 늘린다',sub:'트래픽 회복 · 보도 품질↓',fn:()=>{try{S.co.bT+=.02;}catch(e){}sQ(-2);toast(apply({trust:-.4}));}},
   {label:'포털을 떠나 직접 구독으로 간다',sub:'트래픽↓ · 구독 기반↑(길게 보면 이득)',fn:()=>{try{S.co.bT-=.02;S.co.bS+=.015;}catch(e){}toast(apply({trust:.6}));}}])},
 {w:1.1,c:()=>c42()&&(S.founder||S.rank>=5),run:()=>openModal('AI 기사 도입',`<p class="lede">경영기획실이 보고서를 올렸다. "단신·시황·날씨 기사는 AI가 쓰면 인력 15%를 줄일 수 있습니다."</p>`,[
   {label:'전면 도입한다',sub:'비용 절감 · 보도 품질↓ · 노조 반발',risk:true,fn:()=>{sCash(coSz(.01));sQ(-3);sMood(-6);toast(apply({trust:-.6}));}},
   {label:'반복 기사만 쓰고 사람이 검수한다',sub:'비용 조금↓ · 기자는 취재에 더 시간을 쓴다',fn:()=>{sCash(coSz(.004));sQ(1);toast(apply({trust:.2}));}},
   {label:'도입하지 않는다 — 「사람이 쓴 뉴스」를 내건다',sub:'신뢰↑ · 비용은 그대로',fn:()=>{sMood(3);toast(apply({trust:1,fame:.4}));}}])},
 // ---- 사장 ----
 {w:1.4,c:()=>c42()&&S.rank>=7&&!S.chair,run:()=>openModal('노조 총파업',`<p class="lede">노조가 임금 8% 인상과 편집국장 임명동의제를 요구하며 총파업에 들어갔다. 신문이 반쪽으로 나간다.</p>`,[
   {label:'요구를 대부분 받아들인다',sub:`회사 자금 -${eok(coSz(.01))} · 분위기↑↑ · 이사회는 불만`,fn:()=>{sCash(-coSz(.01));sMood(12);sOwnRel(-4);toast(apply({trust:1.2,eval:-.6}));log('파업 타결 — 요구 수용');}},
   {label:'임금은 절반, 임명동의제는 수용',sub:`회사 자금 -${eok(coSz(.005))} · 무난한 타결`,fn:()=>{sCash(-coSz(.005));sMood(5);toast(apply({trust:.6}));log('파업 타결 — 절충');}},
   {label:'대체 인력을 넣고 버틴다',sub:'비용 방어 · 보도 품질↓↓ · 신뢰↓',risk:true,fn:()=>{sQ(-6);sMood(-12);sOwnRel(3);toast(apply({trust:-2,eval:.5}));log('파업 강경 대응');}}])},
 {w:1.1,c:()=>c42()&&S.rank>=7&&!S.founder,run:()=>openModal('대주주 교체설',`<p class="lede">대주주가 지분을 건설 그룹에 넘긴다는 소문이 돈다. 기자들이 사장실 앞에 모였다.</p>`,[
   {label:'매각 반대에 앞장선다',sub:'편집국 신뢰↑↑ · 대주주 관계↓↓ · 해임 위험',risk:true,fn:()=>{sMood(8);sOwnRel(-12);toast(apply({trust:2,fame:1}));}},
   {label:'중립 — 편집권 보장 약속을 받아 낸다',sub:'신뢰↑ · 관계 그대로',fn:()=>{toast(apply({trust:.8}));}},
   {label:'새 대주주와 손잡는다',sub:'자리 보전 · 「사주 바뀌자 줄 섰다」 뒷말',fn:()=>{sOwnRel(6);sMood(-6);toast(apply({trust:-1.2,eval:.8}));}}])},
 {w:1,c:()=>c42()&&S.rank>=7&&!S.founder,run:()=>openModal('해임안 표결',`<p class="lede">2대 주주가 이사회에 사장 해임안을 올렸다. 표결은 다음 달이다.</p>`,[
   {label:'이사들을 한 명씩 만난다',sub:'컨디션↓ · 표결에서 이길 가능성↑',fn:()=>{const ok=chance(.55+S.eval/300);toast(ok?'해임안이 부결됐다 · '+apply({eval:1.5,hp:-10}):'해임안이 부결됐지만 상처가 남았다 · '+apply({eval:-1,hp:-10}));}},
   {label:'2대 주주 몫 이사를 늘려 주고 타협한다',sub:'자리 지킴 · 장악력↓',fn:()=>{sOwnRel(-2);toast(apply({eval:-.4}));}},
   {label:'경영 성과로 정면 돌파한다',sub:'자금·신뢰가 좋으면 이긴다',risk:true,fn:()=>{const ok=(S.co&&S.co.cash>0)&&S.trust>=50;toast(ok?'성과 앞에 해임안이 철회됐다 · '+apply({eval:2,fame:.6}):'해임안은 부결됐지만 경고를 받았다 · '+apply({eval:-1.5}));}}])},
 {w:1,c:()=>c42()&&S.rank>=7&&!S.founder,run:()=>openModal('오너 리스크',`<p class="lede">대주주 회장이 배임 혐의로 검찰 수사를 받는다. 편집국이 사장의 판단을 기다린다.</p>`,[
   {label:'다른 사건처럼 똑같이 보도하게 한다',sub:'신뢰↑↑ · 평판↑ · 대주주 관계↓↓',risk:true,fn:()=>{sOwnRel(-12);toast(apply({trust:2.5,fame:1.5}));log('대주주 수사 정면 보도');}},
   {label:'사실만 짧게 싣는다',sub:'무난 · 「제 식구 감싸기」 뒷말',fn:()=>{toast(apply({trust:-.6}));}},
   {label:'보도하지 않는다',sub:'대주주 관계↑ · 신뢰↓↓',fn:()=>{sOwnRel(6);sMood(-8);toast(apply({trust:-2.5}));}}])},
 {w:1,c:()=>c42()&&(S.rank>=7||S.founder),run:()=>openModal('광고국 리베이트',`<p class="lede">감사팀 보고: 광고국 간부가 대행사에서 리베이트를 받아 왔다.</p>`,[
   {label:'공개 징계하고 경위를 알린다',sub:'신뢰↑ · 광고 거래처 일부 이탈',fn:()=>{try{S.co.adB-=.02;}catch(e){}toast(apply({trust:1.2}));}},
   {label:'조용히 정리한다',sub:'무난 · 들키면 크게 다친다',fn:()=>{if(chance(.25))toast('언론비평지가 터뜨렸다 · '+apply({trust:-2}));else toast('조용히 넘어갔다');}}])},
 {w:.9,c:()=>c42()&&(S.rank>=7||S.founder)&&S.co&&S.co.cash>0,run:()=>{const v=coSz(.03);openModal('사옥 매각 제안',`<p class="lede">부동산 개발사가 우리 사옥을 ${eok(v)}에 사겠다고 한다. 외곽 임대 사옥으로 옮기면 된다.</p>`,[
   {label:'판다 — 현금을 쌓는다',sub:`회사 자금 +${eok(v)} · 기자들 출퇴근·사기↓`,fn:()=>{sCash(v);sMood(-6);log('사옥 매각');toast(`회사 자금 +${eok(v)}`);}},
   {label:'팔지 않는다 — 리모델링한다',sub:`회사 자금 -${eok(v*.1)} · 분위기↑`,fn:()=>{sCash(-v*.1);sMood(4);toast(apply({fame:.3}));}},
   {label:'팔지 않는다',cls:'ghost'}]);}},
 {w:1,c:()=>c42()&&(S.rank>=6||S.founder),run:()=>openModal('정부 광고가 끊겼다',`<p class="lede">비판 보도가 이어지자 부처·공공기관 광고가 한꺼번에 끊겼다. 연 매출의 8%다.</p>`,[
   {label:'버틴다 — 광고와 기사는 별개',sub:'자금↓ · 신뢰↑↑',fn:()=>{sCash(-coSz(.006));toast(apply({trust:2,fame:.8}));}},
   {label:'언론단체와 함께 「광고 탄압」을 공론화한다',sub:'평판↑ · 정부 관계↓↓',risk:true,fn:()=>{toast(apply({fame:1.5,trust:1}));}},
   {label:'정부와 조용히 화해한다',sub:'광고 회복 · 편집국 실망',fn:()=>{sMood(-6);toast(apply({trust:-1.5,eval:.5}));}}])},
 // ---- 회장 ----
 {w:1.4,c:()=>c42()&&S.chair,run:()=>openModal('계열사 비자금 수사',`<p class="lede">검찰이 그룹 계열 건설사를 압수수색했다. 비자금 의혹이다. 그룹 매체들은 어떻게 쓸까.</p>`,[
   {label:'우리 매체가 먼저 제대로 보도한다',sub:'신뢰↑↑ · 평판↑ · 그룹 실적↓',risk:true,fn:()=>{sCash(-coSz(.008));toast(apply({trust:2.5,fame:1.5}));log('계열사 수사 정면 보도');}},
   {label:'대국민 사과하고 경영진을 바꾼다',sub:'신뢰 방어 · 비용',fn:()=>{sCash(-coSz(.004));toast(apply({trust:1,eval:-.5}));}},
   {label:'그룹 매체엔 보도 자제를 요청한다',sub:'그룹 방어 · 「언론 사유화」 비판(신뢰↓↓)',fn:()=>{sMood(-8);toast(apply({trust:-3}));}}])},
 {w:1.1,c:()=>c42()&&S.chair&&!S.founder,run:()=>openModal('형제의 난',`<p class="lede">부회장인 동생이 「회장의 언론 경영은 실패했다」며 이사회 소집을 요구했다.</p>`,[
   {label:'이사회 표 대결로 간다',sub:'이기면 장악력↑↑ · 지면 그룹 내분',risk:true,fn:()=>{const ok=chance(.5+S.eval/250);toast(ok?'표 대결에서 이겼다 · '+apply({eval:2,fame:.5}):'근소하게 이겼지만 그룹이 갈라졌다 · '+apply({eval:-1,trust:-.8}));}},
   {label:'계열사 몇 곳을 떼어 주고 화해한다',sub:'평화 · 그룹 덩치↓',fn:()=>{sCash(-coSz(.01));toast(apply({trust:.4}));}},
   {label:'법정으로 간다',sub:'시간·돈·체면 모두 든다',fn:()=>{sCash(-coSz(.004));toast(apply({hp:-12,fame:-.8}));}}])},
 {w:1,c:()=>c42()&&S.chair,run:()=>openModal('그룹 해체 압박',`<p class="lede">공정위와 국회가 「언론 그룹의 비언론 계열사 분리」 법안을 밀고 있다.</p>`,[
   {label:'자진해서 계열을 분리한다',sub:'신뢰↑↑ · 그룹 수익↓',fn:()=>{sCash(-coSz(.008));toast(apply({trust:2.5,fame:1}));log('비언론 계열 자진 분리');}},
   {label:'국회를 상대로 설득전에 나선다',sub:'시간 벌기 · 「로비」 뒷말',fn:()=>{toast(apply({trust:-.6,eval:.4}));}},
   {label:'헌법소원으로 맞선다',sub:'버틸 수 있다 · 평판↓',risk:true,fn:()=>{toast(apply({fame:-1,eval:.6}));}}])},
 {w:.9,c:()=>c42()&&S.chair&&month()===4,run:()=>openModal('그룹 창립 기념식',`<p class="lede">창립 기념식 연단. 회장의 한마디가 내일 모든 매체 1면에 실린다.</p>`,[
   {label:'「편집권은 기자에게」를 약속한다',sub:'신뢰↑ · 평판↑',fn:()=>{S.chFree=1;toast(apply({trust:1.5,fame:1}));}},
   {label:'「글로벌 미디어 그룹」 비전을 밝힌다',sub:'평가↑ · 투자 기대',fn:()=>{toast(apply({eval:1.2,fame:.5}));}},
   {label:'사회공헌 기금을 발표한다',sub:`회사 자금 -${eok(coSz(.008))} · 평판↑↑`,fn:()=>{sCash(-coSz(.008));toast(apply({fame:2,trust:.8}));}}])},
 {w:1.2,c:()=>c42()&&S.chair&&S.heir==='family',run:()=>openModal('2세 갑질 보도',`<p class="lede">경영 수업 중인 2세가 직원에게 폭언했다는 녹취가 경쟁 매체에 실렸다.</p>`,[
   {label:'경영에서 물러나게 하고 사과한다',sub:'신뢰 방어 · 후계 구도가 흔들린다',fn:()=>{S.heir='board';toast(apply({trust:1,eval:-.5}));log('2세 경영 퇴진 — 후계 재검토');}},
   {label:'감싼다 — 「사적인 일」',sub:'후계 유지 · 신뢰↓↓',fn:()=>{toast(apply({trust:-3}));}}])},
 {w:1,c:()=>c42()&&S.chair&&month()===3&&(S.turn-(S.chairT||0))>=YW,run:()=>{const ok=S.trust>=45&&S.eval>=50;openModal('회장 재신임 이사회',`<p class="lede">그룹 이사회가 해마다 하는 재신임 표결. 신뢰도 ${Math.round(S.trust)} · 사내 평가 ${Math.round(S.eval)}.</p>`,[
   {label:'표결에 맡긴다',sub:ok?'무난히 재신임될 것이다':'불안하다',fn:()=>{if(ok||chance(.4)){toast('재신임 · '+apply({eval:1}));}else{toast('재신임은 됐지만 조건부다 · '+apply({eval:-2,fame:-.5}));}}}]);}},
 // ---- 방송 ----
 {w:1.5,c:()=>c42()&&isTV()&&S.rank>=1,run:()=>openModal('생방송 사고',`<p class="lede">메인뉴스 생방송 중 엉뚱한 자료 화면이 3초간 나갔다. 시청자 게시판이 들끓는다.</p>`,[
   {label:'클로징에서 바로 사과한다',sub:'신뢰 방어 · 평가 조금↓',fn:()=>{toast(apply({trust:.6,eval:-.6}));}},
   {label:'다음 날 공식 사과 + 경위 공개',sub:'신뢰↑ · 담당자 문책 논란',fn:()=>{toast(apply({trust:1,eval:-.3}));}},
   {label:'모른 척 넘어간다',sub:'커지면 방심위 심의',risk:true,fn:()=>{if(chance(.45))toast('방송통신심의위 「주의」 결정 · '+apply({trust:-2,eval:-1}));else toast('조용히 지나갔다');}}])},
 {w:1.3,c:()=>c42()&&isTV()&&S.rank>=4,run:()=>openModal('시청률 전쟁',`<p class="lede">경쟁사 메인뉴스가 시간대를 15분 앞당겼다. 우리 시청률이 1%p 빠졌다.</p>`,[
   {label:'우리도 앞당긴다',sub:'시청률 회복 · 제작진 피로↑',fn:()=>{try{S.co.bS+=.01;}catch(e){}toast(apply({hp:-6,eval:.5}));}},
   {label:'시간은 지키고 탐사 코너를 키운다',sub:'신뢰·평판↑ · 시청률은 천천히',fn:()=>{sQ(2);toast(apply({trust:.8,fame:.6}));}},
   {label:'연성 뉴스를 늘린다',sub:'시청률↑ · 보도 품질↓',fn:()=>{try{S.co.bS+=.015;}catch(e){}sQ(-2);toast(apply({trust:-.5}));}}])},
 {w:1.1,c:()=>c42()&&isTV()&&S.rank>=1&&S.rank<=3&&S.fame>=30,run:()=>openModal('앵커 오디션',`<p class="lede">주말 뉴스 앵커 자리가 빈다. 보도국장이 「한번 해 볼래?」라고 물었다.</p>`,[
   {label:'도전한다',sub:'방송감이 높을수록 붙는다 · 붙으면 평판↑↑',fn:()=>{const ok=chance(clamp(((S.st.brd||40)-30)/50,.15,.85));if(ok){S.anchor=1;log('주말 뉴스 앵커 발탁');tick(`${OUT().n} 주말 뉴스 새 앵커 ${S.name}`,1);toast('앵커 발탁 · '+apply({fame:3,eval:1.5,hp:-5}));}else toast('이번엔 다른 사람이 됐다 · '+apply({brd:.6}));}},
   {label:'현장이 좋다 — 사양한다',sub:'취재력↑',fn:()=>{toast(apply({inv:.5}));}}])},
 {w:1,c:()=>c42()&&isTV()&&(S.rank>=5||S.founder),run:()=>openModal('방송심의 제재',`<p class="lede">방송통신심의위원회가 우리 시사 프로그램에 「경고」를 의결했다. 재허가 심사 감점이다.</p>`,[
   {label:'행정소송으로 다툰다',sub:'평판↑ · 정부 관계↓',risk:true,fn:()=>{toast(apply({fame:1,trust:.5}));}},
   {label:'제작진을 바꾸고 받아들인다',sub:'재허가 방어 · 제작진 반발',fn:()=>{sMood(-5);toast(apply({eval:.6,trust:-.4}));}}])},
 {w:.8,c:()=>c42()&&isTV()&&(S.rank>=6||S.founder)&&(eraHas18?eraHas18('olympic','worldcup'):false),run:()=>{const v=coSz(.02);openModal('중계권 입찰',`<p class="lede">국제 대회 중계권이 나왔다. 입찰가는 ${eok(v)}.</p>`,[
   {label:'산다',sub:`회사 자금 -${eok(v)} · 광고·시청률↑↑`,disabled:(S.co.cash||0)<v,fn:()=>{sCash(-v);try{S.co.adB+=.08;S.co.bS+=.02;}catch(e){}toast(apply({fame:1}));}},
   {label:'포기한다',cls:'ghost'}]);}},
 // ---- 수습 ----
 {w:2.2,c:()=>c42()&&S.rank===0,run:()=>openModal('기자실의 텃세',`<p class="lede">경찰서 기자실 고참이 「수습은 저쪽 끝자리」라며 책상을 가리켰다. 브리핑 자료도 늦게 돈다.</p>`,[
   {label:'커피를 돌리며 넉살 좋게 다가간다',sub:'친화력↑ · 기자실 관계↑',fn:()=>{toast(apply({cha:.6,eval:.5}));}},
   {label:'신경 쓰지 않고 형사들만 판다',sub:'취재력↑ · 기자실에선 외톨이',fn:()=>{toast(apply({inv:.6,men:-.5}));}}])},
 {w:2,c:()=>c42()&&S.rank===0,run:()=>openModal('첫 사망 사고 현장',`<p class="lede">새벽 3시, 교차로 사망 사고. 유족이 오열하는 옆에서 캡이 전화로 묻는다. "사진 받았어?"</p>`,[
   {label:'유족에게 양해를 구하고 기다린다',sub:'신뢰↑ · 기사는 늦다',fn:()=>{toast(apply({trust:.8,eval:-.3,men:-1}));}},
   {label:'멀리서 찍고 바로 보고한다',sub:'평가↑ · 마음이 무겁다',fn:()=>{toast(apply({eval:1,men:-2}));}}])},
 {w:1.8,c:()=>c42()&&S.rank===0,run:()=>{const cp=colBy('cap');openModal('캡의 술자리',`<p class="lede">${jo2(cp?esc(cp.name)+' 캡':'캡','이','가')} 새벽 마와리 끝에 국밥집으로 불렀다. "수습 때 배운 게 평생 간다."</p>`,[
   {label:'끝까지 남아 이야기를 듣는다',sub:'캡과 관계↑ · 컨디션↓',fn:()=>{if(cp)relUp(cp,6,'새벽 국밥');toast(apply({hp:-8,eval:.6}));}},
   {label:'한 잔만 하고 경찰서로 돌아간다',sub:'정보보고 거리↑',fn:()=>{toast(apply({inv:.4}));}}]);}},
 {w:1.6,c:()=>c42()&&S.rank===0,run:()=>{const pe=colBy('peer');openModal('동기의 이탈',`<p class="lede">${jo2(pe?esc(pe.name):'입사 동기','이','가')} 화장실에서 울고 있었다. "나 그만둘까 봐. 이게 사람이 할 짓이야?"</p>`,[
   {label:'붙잡고 같이 버티자고 한다',sub:'동기 관계↑↑ · 멘탈↓',fn:()=>{if(pe)relUp(pe,10,'같이 버티자');toast(apply({men:-1,cha:.4}));}},
   {label:'그 마음 이해한다고 말해 준다',sub:'동기 관계↑',fn:()=>{if(pe)relUp(pe,5,'위로');toast(apply({cha:.3}));}}]);}},
 {w:1.5,c:()=>c42()&&S.rank===0,run:()=>openModal('첫 바이라인 실수',`<p class="lede">처음 이름이 걸린 단신에서 피해자 나이를 잘못 썼다. 데스크가 빨간 펜을 던졌다.</p>`,[
   {label:'정정 요청서를 직접 쓴다',sub:'신뢰↑ · 검증력↑',fn:()=>{toast(apply({ver:.8,trust:.4,eval:-.3}));}},
   {label:'다음부터 두 번 확인하겠다고 한다',sub:'검증력↑',fn:()=>{toast(apply({ver:.5}));}}])},
 {w:1.4,c:()=>c42()&&S.rank===0,run:()=>openModal('형사의 시험',`<p class="lede">강력팀 형사가 수첩을 덮으며 웃었다. "수습, 이거 쓰면 다시는 안 본다. 알지?"</p>`,[
   {label:'약속을 지킨다',sub:'취재원 관계↑ · 나중에 단독이 온다',fn:()=>{try{const s=addSource(S.dept,R(25,40));if(s)s.trust=Math.max(s.trust,45);}catch(e){}toast(apply({trust:.4}));}},
   {label:'캡에게만 보고한다',sub:'평가↑ · 형사가 알면 끝',risk:true,fn:()=>{if(chance(.3))toast('형사가 알아챘다 · '+apply({eval:.5,net:-1}));else toast(apply({eval:1}));}}])}];
try{EV42.forEach(e=>EVENTS.push(e));}catch(e){console.error(e);}
// 회장 은퇴: 고른 후계 구도에 따라 엔딩이 갈린다
try{END_DEX.push(['회장 은퇴 · 가족 승계','retire','그룹 회장으로 은퇴하며 2세에게 물려준다'],['회장 은퇴 · 이사회 승계','retire','그룹 회장으로 은퇴하며 이사회가 뽑은 전문경영인에게 넘긴다'],['회장 은퇴 · 기자 출신 승계','retire','그룹 회장으로 은퇴하며 편집국이 키운 사람에게 넘긴다']);
  Object.assign(END_HOW,{'회장 은퇴 · 가족 승계':'그룹 회장이 되어 후계 구도를 「가족 승계」로 정하고 은퇴한다','회장 은퇴 · 이사회 승계':'그룹 회장이 되어 후계 구도를 「전문경영인」으로 정하고 은퇴한다','회장 은퇴 · 기자 출신 승계':'그룹 회장이 되어 후계 구도를 「기자 출신」으로 정하고 은퇴한다'});
  if(typeof END_ARCH!=='undefined'){const a=END_ARCH.find(x=>x[0]===2);if(a)a[1].push('회장 은퇴 · 가족 승계','회장 은퇴 · 이사회 승계','회장 은퇴 · 기자 출신 승계');}}catch(e){}
// ===== 은퇴 뒤 에필로그 =====
const EPI42={prof:['대학 강단','저널리즘 대학원 석좌교수가 되어 후배들을 가르친다'],tube:['1인 미디어','유튜브 채널을 열어 「기자가 말하지 못한 뒷이야기」를 한다'],run:['정치','고향에서 출마 제안을 받아 선거에 나선다'],book:['회고록','30여 년의 취재 수첩을 묶어 회고록을 낸다'],quiet:['귀촌','도시를 떠나 작은 마을에서 텃밭을 가꾸며 지역 신문에 칼럼을 쓴다'],ngo:['시민단체','언론 감시 시민단체 대표를 맡는다']};
const EPI42_RE=/정년퇴직|임기 만료|은퇴|퇴임|펜을 놓다|주필 · 신문의 목소리|아름다운 퇴장/;
{const _en42=ending;ending=function(kind){try{if(S&&S.chair&&!S.story&&/정년퇴직|임기 만료|은퇴|퇴임/.test(String(kind))&&!/회장 은퇴/.test(String(kind))){kind=S.heir==='family'?'회장 은퇴 · 가족 승계':S.heir==='newsroom'?'회장 은퇴 · 기자 출신 승계':'회장 은퇴 · 이사회 승계';}
  if(S&&!S.story&&!S.epiAsk&&EPI42_RE.test(String(kind))){S.epiAsk=1;const k0=kind;const sc=(S.fame||0)+(S.trust||0)/2;
    openModal('그 뒤의 이야기',`<p class="lede">마지막 출근을 마쳤다. 이제 무엇을 할까.</p><p class="hint">평판·신뢰가 높을수록 고를 수 있는 길이 넓다.</p>`,Object.keys(EPI42).map(k=>{const need=k==='run'?90:k==='prof'?70:k==='tube'?50:0;return {label:EPI42[k][0],sub:EPI42[k][1]+(need&&sc<need?' · 아직은 부르는 곳이 없다':''),disabled:need>0&&sc<need,fn:()=>{S.epi=k;_en42(k0);try{render();}catch(e){}}};}));return;}}catch(e){console.error(e);}
  return _en42.apply(this,arguments);};}
{const _eh42=endHTML;endHTML=function(){let h=_eh42.apply(this,arguments);try{if(S.epi&&EPI42[S.epi]){const E=EPI42[S.epi];const box=`<div class="card" style="border-color:var(--sodium)"><div class="t">그 뒤 · ${esc(E[0])}</div><p class="hint" style="margin:4px 0 0">${esc(S.name)}은(는) ${esc(E[1])}.${S.chair&&S.heir?` 그룹은 ${S.heir==='family'?'2세가':S.heir==='newsroom'?'편집국 출신 후배가':'이사회가 뽑은 전문경영인이'} 이어받았다.`:''}</p></div>`.replace(`${esc(S.name)}은(는)`,jo2(esc(S.name),'은','는'));const i=h.indexOf('</div>',h.indexOf('class="bh"'));h=i>0?h.slice(0,i+6)+box+h.slice(i+6):box+h;}}catch(e){}return h;};}
// ===== 사설 주제 +16 (시대 흐름에 맞는 주제가 먼저 뜬다) =====
const OP_TH42=[
 {k:'birth',n:'저출산 대책 — 출산 지원금 대폭 확대',pro:['prog','neu'],con:['market'],tone:'촉구'},
 {k:'aireg',n:'생성형 AI 규제법',pro:['prog','neu'],con:['market'],tone:'유보',era:['ainews','tech']},
 {k:'climate',n:'탄소세 도입',pro:['prog'],con:['market','cons'],tone:'촉구',era:['climate']},
 {k:'local',n:'지방 소멸 — 수도권 공공기관 2차 이전',pro:['prog','neu'],con:['market'],tone:'촉구'},
 {k:'immig',n:'이민청 신설과 외국 인력 확대',pro:['market','neu'],con:['cons'],tone:'유보'},
 {k:'school',n:'자사고·특목고 폐지',pro:['prog'],con:['cons','market'],tone:'질타'},
 {k:'death',n:'사형제 폐지',pro:['prog'],con:['cons'],tone:'유보'},
 {k:'conscript',n:'모병제 전환',pro:['prog','market'],con:['cons'],tone:'유보'},
 {k:'housing',n:'전세사기 피해자 선구제',pro:['prog','neu'],con:['market'],tone:'촉구',era:['estate']},
 {k:'debt',n:'국가채무 한도를 법으로 묶는 재정준칙',pro:['market','cons'],con:['prog'],tone:'촉구',era:['recession','crash']},
 {k:'portal',n:'포털 뉴스 편집 금지',pro:['cons','neu'],con:['market'],tone:'질타',era:['portal']},
 {k:'pandemic',n:'감염병 방역 영업 제한',pro:['neu','prog'],con:['market'],tone:'유보',era:['pandemic']},
 {k:'safety',n:'중대재해처벌법 강화',pro:['prog'],con:['market','cons'],tone:'촉구',era:['disaster','safety']},
 {k:'chip',n:'반도체 특별법 — 주 52시간 예외',pro:['market','cons'],con:['prog'],tone:'촉구',era:['tech','trade']},
 {k:'elect',n:'선거구제 개편 — 비례대표 확대',pro:['prog','neu'],con:['cons'],tone:'유보',era:['elect_gen','elect_pres']},
 {k:'tv',n:'공영방송 수신료 분리 징수',pro:['cons','market'],con:['prog','neu'],tone:'질타'}];
Object.assign(OP_ARGT,{
 birth:{pro:['합계출산율이 세계 최저 수준이라는 통계청 자료','현금 지원을 늘린 나라에서 출산율이 반등한 사례','양육비 부담이 출산을 미루는 첫째 이유라는 설문'],con:['수십조 원을 써도 출산율이 계속 떨어졌다는 재정 분석','현금보다 주거·일자리·돌봄이 먼저라는 연구','지원금이 일회성 소비로 끝난다는 지적'],mid:['현금 지원을 주거·보육 서비스와 묶는 방안','효과를 따져 매년 사업을 정리하는 성과 평가'],bad:[['반대하는 사람은 아이를 낳지 말자는 것이다','허수아비 공격'],['주변 신혼부부는 다 돈만 주면 낳겠다더라','성급한 일반화'],['이대로면 나라가 사라진다','미끄러운 비탈']]},
 aireg:{pro:['딥페이크 피해 신고가 급증했다는 경찰청 통계','유럽연합이 AI 위험 등급제를 시행한 사례','AI가 만든 허위 정보가 선거에 영향을 준 해외 사례'],con:['규제가 국내 AI 산업만 묶는다는 업계 조사','기술 발전 속도를 법이 따라가기 어렵다는 지적','이미 개인정보·저작권법으로 다룰 수 있다는 법조계 의견'],mid:['고위험 분야만 사전 규제하고 나머지는 자율 규제하는 방안','규제 샌드박스로 실험 뒤 법제화하는 방안'],bad:[['규제 찬성론자는 기술 발전이 싫은 것이다','허수아비 공격'],['AI를 풀어 두면 인간이 지배당한다','미끄러운 비탈'],['한 연구에 따르면 AI가 일자리를 다 없앤다(출처 없음)','출처 불명']]},
 climate:{pro:['탄소세를 도입한 나라에서 배출량이 줄었다는 국제기구 자료','기후 재난 피해액이 해마다 커진다는 통계','유럽의 탄소국경조정제도에 대비해야 한다는 점'],con:['제조업 비중이 큰 우리 산업 구조에 부담이 크다는 분석','에너지 요금 인상이 서민에게 더 무겁다는 지적','기업들이 해외로 생산을 옮길 수 있다는 우려'],mid:['세수를 저소득층 에너지 지원과 기업 전환 투자에 돌려주는 방안','단계적으로 세율을 올리는 로드맵'],bad:[['반대론자는 지구가 망해도 좋다는 것이다','허수아비 공격'],['올여름이 더웠으니 탄소세가 답이다','성급한 일반화'],['우리 아이들의 미래를 빼앗지 말라','감정 호소']]},
 local:{pro:['수도권 인구가 전체의 절반을 넘었다는 통계','1차 이전 뒤 혁신도시 인구·세수가 늘었다는 자료','지방 대학과 일자리가 함께 무너지고 있다는 점'],con:['1차 이전 뒤에도 가족은 수도권에 남은 「나 홀로 이주」 실태','기관 효율이 떨어졌다는 감사 결과','이전보다 지역 산업 육성이 먼저라는 분석'],mid:['기관 이전을 지역 대학·기업 유치와 묶는 패키지','이전 기관 직원의 정주 여건부터 갖추는 방안'],bad:[['반대하는 사람은 지방을 버리자는 것이다','허수아비 공격'],['서울 사람들은 다 반대한다더라','성급한 일반화'],['이대로면 지방은 다 무너진다','미끄러운 비탈']]},
 immig:{pro:['생산가능인구가 빠르게 줄어든다는 통계청 추계','외국 인력 없이 농어촌·조선소가 돌아가지 않는다는 현장 자료','이민 정책을 한곳에서 관리하는 해외 사례'],con:['외국 인력이 늘면 저임금 일자리 임금이 눌린다는 연구','사회 통합 준비 없이 늘리면 갈등이 커진다는 해외 사례','불법 체류 관리부터 해야 한다는 지적'],mid:['업종·지역별로 필요한 만큼 들이고 정착 지원을 함께 하는 방안','이민청을 두되 국회 보고를 의무화하는 방안'],bad:[['반대하는 사람은 다 외국인 혐오자다','허수아비 공격'],['외국인이 늘면 범죄가 늘더라','성급한 일반화'],['문을 열면 나라가 바뀐다','미끄러운 비탈']]},
 school:{pro:['자사고 진학생의 사교육비가 일반고보다 크게 높다는 통계','고교 서열화가 일반고 황폐화를 부른다는 연구','학교 유형보다 학생 배경이 성적을 가른다는 분석'],con:['다양한 교육 수요를 막는다는 학부모 설문','특목고 폐지 뒤 강남 쏠림이 심해질 수 있다는 분석','일반고 경쟁력 강화가 먼저라는 지적'],mid:['선발 방식만 추첨으로 바꾸고 학교는 남기는 방안','일반고 지원을 먼저 늘리고 단계적으로 전환하는 방안'],bad:[['폐지 반대는 특권층 지키기일 뿐이다','허수아비 공격'],['우리 애 친구들은 다 자사고가 좋다더라','성급한 일반화'],['폐지하면 공교육이 끝장난다','미끄러운 비탈']]},
 death:{pro:['오판으로 사형된 뒤 무죄가 밝혀진 해외 사례','사형이 범죄 억지 효과가 뚜렷하지 않다는 연구','실질적 사형 폐지국으로 분류된 지 오래라는 점'],con:['흉악 범죄 피해자 유족의 고통','국민 다수가 사형제 유지를 원한다는 여론조사','가석방 없는 종신형이 없다는 제도 공백'],mid:['사형을 폐지하고 가석방 없는 종신형을 도입하는 방안','집행 중단을 법으로 못 박고 논의를 이어 가는 방안'],bad:[['폐지론자는 살인범 편이다','허수아비 공격'],['흉악범이 나올 때마다 다들 사형하라더라','성급한 일반화'],['유족의 눈물을 보라','감정 호소']]},
 conscript:{pro:['병역 자원이 급감한다는 국방부 추계','첨단 무기 운용엔 숙련 직업군인이 필요하다는 분석','모병제로 바꾼 나라의 전력 유지 사례'],con:['모병제 인건비가 국방 예산을 크게 늘린다는 추계','저소득층만 군에 가게 된다는 우려','북한과 대치한 안보 현실'],mid:['징병제를 유지하되 부사관·전문병을 늘리는 혼합형','병사 복무 기간과 처우를 단계적으로 조정하는 방안'],bad:[['징병 유지론자는 청년을 착취하자는 것이다','허수아비 공격'],['군대 다녀온 친구들은 다 모병제가 맞다더라','성급한 일반화'],['모병제 하면 나라를 지킬 사람이 없다','미끄러운 비탈']]},
 housing:{pro:['전세사기 피해자 다수가 20~30대 사회 초년생이라는 통계','보증 제도의 허점이 피해를 키웠다는 감사 결과','피해 구제가 늦어 극단적 선택까지 이어진 사례'],con:['국가가 먼저 갚으면 다른 사기 피해와 형평이 맞지 않는다는 지적','선구제 비용이 결국 세금이라는 재정 분석','도덕적 해이를 부를 수 있다는 우려'],mid:['경매 우선 매수권과 저리 대출로 돕는 방안','보증 제도를 손보고 피해 판정을 빠르게 하는 방안'],bad:[['반대하는 사람은 청년이 죽어도 된다는 것이다','허수아비 공격'],['세입자들은 다 나라가 갚아 줘야 한다더라','성급한 일반화'],['한 번 갚아 주면 모든 사기를 나라가 책임진다','미끄러운 비탈']]},
 debt:{pro:['국가채무 비율이 빠르게 오른다는 기획재정부 자료','재정준칙을 둔 나라의 위기 대응 여력','고령화로 복지 지출이 저절로 늘어난다는 추계'],con:['경기 침체 때 재정이 손발이 묶인다는 우려','국가채무 비율이 OECD 평균보다 낮다는 비교','준칙보다 지출 효율화가 먼저라는 분석'],mid:['위기 때 예외 조항을 둔 유연한 준칙','법보다 시행령으로 두고 국회 보고를 의무화하는 방안'],bad:[['반대하는 쪽은 나라 곳간을 털자는 것이다','허수아비 공격'],['이대로면 그리스처럼 된다','미끄러운 비탈'],['한 연구에 따르면 곧 국가 부도다(출처 없음)','출처 불명']]},
 portal:{pro:['포털 첫 화면이 여론을 좌우한다는 언론학 연구','포털 알고리즘이 공개되지 않는다는 점','포털이 언론 책임은 지지 않는다는 지적'],con:['언론사 직접 유입이 약해 포털 없이 독자를 잃는다는 업계 자료','편집 금지가 표현의 자유를 침해할 수 있다는 법학계 우려','이미 구독 설정 방식으로 바뀌었다는 점'],mid:['알고리즘 공개와 외부 검증 위원회를 두는 방안','첫 화면 편집만 언론사 구독 방식으로 바꾸는 방안'],bad:[['포털 편들기는 다 돈 받은 것이다','허수아비 공격'],['댓글 보면 포털이 여론 조작하는 게 뻔하다','성급한 일반화'],['포털을 놔두면 민주주의가 끝난다','미끄러운 비탈']]},
 pandemic:{pro:['영업 제한 뒤 확진자 증가세가 꺾였다는 방역 당국 자료','의료 체계가 무너지면 사망자가 급증한다는 해외 사례','고위험군 보호가 우선이라는 감염병 전문가 의견'],con:['자영업자 폐업이 크게 늘었다는 통계','손실 보상이 피해에 비해 턱없이 적다는 분석','제한 효과가 업종마다 다르다는 연구'],mid:['업종별 위험도에 따라 차등 제한하고 손실 보상을 늘리는 방안','시간제한 대신 인원·환기 기준을 두는 방안'],bad:[['방역에 반대하는 사람은 남이 죽어도 된다는 것이다','허수아비 공격'],['우리 동네 식당은 다 망했다더라','성급한 일반화'],['이러다 경제가 다 무너진다','미끄러운 비탈']]},
 safety:{pro:['산업재해 사망률이 OECD 최상위권이라는 통계','경영 책임자 처벌이 안전 투자를 늘렸다는 해외 사례','하청 노동자 사망이 되풀이된다는 고용노동부 자료'],con:['중소기업은 안전 인력을 둘 여력이 없다는 조사','처벌 강화보다 예방 지원이 효과가 크다는 연구','법 시행 뒤에도 사망자가 크게 줄지 않았다는 통계'],mid:['처벌은 유지하되 중소기업 안전 투자를 지원하는 방안','안전 기준 이행 기업은 처벌을 줄이는 인센티브'],bad:[['강화 반대는 노동자 목숨보다 돈이 중요하다는 것이다','허수아비 공격'],['현장 사장님들은 다 법 때문에 공장 문 닫는다더라','성급한 일반화'],['유족의 눈물 앞에 무슨 말이 필요한가','감정 호소']]},
 chip:{pro:['경쟁국 반도체 연구 인력은 근무 시간 제한이 없다는 비교','첨단 공정 연구는 집중 근무가 필요하다는 업계 자료','반도체가 수출의 20%를 차지한다는 통계'],con:['장시간 노동이 연구 생산성을 떨어뜨린다는 연구','예외가 다른 업종으로 번질 수 있다는 노동계 우려','이미 탄력·선택 근무제로 대응할 수 있다는 점'],mid:['연구직 본인 동의와 건강 관리를 조건으로 한 한시적 예외','연구 인력 확충을 먼저 하고 예외는 최소화하는 방안'],bad:[['반대론자는 반도체 산업이 망하길 바란다','허수아비 공격'],['연구원 친구들은 다 더 일하고 싶다더라','성급한 일반화'],['이대로면 반도체 패권을 다 뺏긴다','미끄러운 비탈']]},
 elect:{pro:['득표율과 의석 비율이 크게 어긋난다는 선거 결과 분석','양당 구도가 극단적 대립을 부른다는 연구','비례성이 높은 나라의 연합 정치 사례'],con:['위성정당 사태처럼 제도가 왜곡된 경험','비례대표 공천이 당 지도부 입맛에 좌우된다는 지적','지역 대표성이 약해진다는 우려'],mid:['위성정당 방지 조항을 넣은 연동형 확대','비례대표 공천 과정을 공개하는 방안'],bad:[['반대하는 쪽은 기득권 양당을 지키려는 것이다','허수아비 공격'],['주변 사람들은 다 선거제가 문제라더라','성급한 일반화'],['한 번 바꾸면 정치가 끝없이 쪼개진다','미끄러운 비탈']]},
 tv:{pro:['수신료를 내는지 모르는 국민이 많다는 설문','분리 징수가 선택권을 돌려준다는 점','공영방송 경영 효율이 낮다는 감사 결과'],con:['분리 징수 뒤 징수율이 급감할 수 있다는 추계','재원이 흔들리면 공영방송이 정치권에 더 휘둘린다는 우려','해외 공영방송은 안정적 재원을 보장한다는 비교'],mid:['분리 징수를 하되 공영방송 독립성 강화 장치를 함께 두는 방안','수신료 위원회를 만들어 재원 구조를 다시 짜는 방안'],bad:[['분리 징수 찬성은 공영방송을 죽이려는 것이다','허수아비 공격'],['수신료 아까운 건 다들 마찬가지라더라','성급한 일반화'],['이대로면 공영방송이 문을 닫는다','미끄러운 비탈']]}});
try{OP_TH42.forEach(t=>OP_TH.push(t));}catch(e){}
{const _re42=RUN.editorial;RUN.editorial=function(){const all=OP_TH.slice();try{const ek=(eraNow()||[]).map(x=>x.k);const hot=shuffle(all.filter(t=>t.era&&t.era.some(k=>ek.includes(k))));const rest=shuffle(all.filter(t=>!hot.includes(t)));const pick3=hot.slice(0,1).concat(rest).slice(0,3);OP_TH.length=0;pick3.forEach(t=>OP_TH.push(t));}catch(e){}
  try{return _re42.apply(this,arguments);}finally{OP_TH.length=0;all.forEach(t=>OP_TH.push(t));}};}
// ===== 매체 4곳 (방송·영자·스포츠 보강) =====
try{[mkO('gbs','GBS 경기방송','tv','neu','민영',3,'수도권 민영 방송. 지역 뉴스와 생활 정보가 강하다.'),mkO('ytv','YTV 뉴스24','ch','neu','민영',3,'24시간 보도 전문 채널. 속보 경쟁의 최전선.'),mkO('herald','The Korea Herald Times','eng','neu','민영',2,'외국인 독자와 외교가가 읽는 영자 일간지.'),mkO('sportsk','스포츠코리아','sports','neu','민영',2,'프로야구·축구 현장과 연예가를 함께 다루는 스포츠지.')].forEach(o=>{if(o&&!OUTLETS.some(x=>x.id===o.id))OUTLETS.push(o);});}catch(e){console.error(e);}
// ===== 빠른 시작 2가지 추가: 꼴찌 부서를 맡은 부장 · 방송사 3년 차 기자 =====
try{QS_OPT.push({k:'r3w',n:'꼴찌 부서를 맡은 부장',d:'성적이 바닥인 부서에 새 부장으로 간다',pro:'부서를 일으켜 세우는 재미 · 팀·제자·데스킹이 바로 열린다',con:'부서원 실력이 낮고 분위기가 가라앉아 있다',rank:3,yrs:9,weak:1},
  {k:'tv1',n:'방송사 3년 차 기자',d:'지상파·종편·보도 채널에서 리포트를 만드는 기자로 시작한다',pro:'방송 리포트·생방송·앵커 오디션 같은 방송 이야기가 바로 열린다',con:'방송감이 낮으면 리포트가 약하다 · 수습 시절 이야기가 없다',rank:1,yrs:2,tv:1});}catch(e){console.error(e);}
{const _qp42=qsPick;qsPick=function(q){if(q&&q.tv){const all=OUTLETS.slice();try{const tv=all.filter(o=>['tv','jp','ch'].includes(o.type));OUTLETS.length=0;tv.forEach(o=>OUTLETS.push(o));return _qp42.apply(this,arguments);}finally{OUTLETS.length=0;all.forEach(o=>OUTLETS.push(o));}}return _qp42.apply(this,arguments);};}
{const _qg42b=qsGo;qsGo=function(q,o,dp){const r=_qg42b.apply(this,arguments);try{if(q&&q.weak){(S.team||[]).forEach(m=>{m.skill=Math.max(22,(m.skill||45)-10);m.mor=clamp((m.mor??60)-15,0,100);});try{const per=roster();(per[S.dept]||[]).forEach(m=>{if(!(S.team||[]).includes(m))m.skill=Math.max(22,(m.skill||45)-8);});}catch(e){}
    try{const mb=document.querySelector('#mb');if(mb&&!$('#modal').hidden)mb.insertAdjacentHTML('afterbegin',`<p class="warn">「꼴찌 부서」 — 국장이 말했다. "${esc((DEPTS[S.dept]||{}).n||'이 부서')}가 3년째 꼴찌야. 맡겨 보겠네." 부서원 실력과 분위기가 바닥이다. 데스킹·취재 지시·부서 사람들과·제자 키우기로 끌어올리자 (조직 탭에서 부서 전력 확인).</p>`);}catch(e){}}}catch(e){console.error(e);}return r;};}
// 그림 많은 화면: 새 이벤트 머리 그림 (있는 그림으로 연결 · 새 그림이 오면 바뀐다)
try{if(typeof MODAL_SC!=='undefined'){MODAL_SC.unshift([/앵커 오디션/,IMG.sc_anchor?'sc_anchor':(IMG.sc_studio?'sc_studio':'sc_newsroom')],[/노조 총파업|공정보도위원회|부장들의 연판장/,IMG.sc_strike?'sc_strike':'sc_newsroom'],[/생방송 사고|시청률 전쟁|앵커 오디션|중계권|방송심의/,IMG.sc_studio?'sc_studio':'sc_newsroom'],[/그 뒤의 이야기/,IMG.sc_retire?'sc_retire':'sc_roof'],[/계열사 비자금|형제의 난|그룹 해체|그룹 창립|재신임 이사회|2세 갑질|대주주 교체설|해임안|오너 리스크/,'sc_board'],[/기자실의 텃세|첫 사망 사고|캡의 술자리|형사의 시험/,'sc_crime']);}}catch(e){}