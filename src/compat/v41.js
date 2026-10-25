/* 바이라인 — src/compat/v41.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.42 논설위원실 다시 세우기 =====
// ① 논거: 주제·논지마다 진짜 근거가 나온다 (예전엔 주제와 상관없는 「정부 통계와 국책연구원 보고서」 같은 문구와 엉뚱한 궤변만 떴다)
// ② 논설위원만의 길: 「논객 · 원칙 · 실세」 세 방향 · 책상 업무라 컨디션 회복 · 집필 수당 · 영향력이 쌓이면 사회를 움직인다
// ③ 대외 관계 비중은 줄인다 (미션·추천·관계망 이벤트)
const OP_ARGT={
 re:{pro:['보유세 실효세율이 OECD 평균의 절반 수준이라는 통계','다주택자 보유 비중이 늘던 시기에 집값이 함께 뛴 국토부·한국은행 자료','보유세를 올린 해외 도시에서 투기성 매수가 줄어든 사례'],
  con:['세 부담이 전·월세로 넘어가 세입자 부담이 커진 사례','소득 없는 은퇴 1주택자의 세 부담이 몇 해 만에 몇 배로 뛴 통계','거래세는 그대로 두고 보유세만 올려 매물이 묶인 엇박자'],
  mid:['실거주 1주택자는 덜고 다주택자는 더 무겁게 하는 차등 과세안','늘어난 세수를 공공임대 공급에 묶는 방안'],
  bad:[['세금을 올리자는 쪽은 결국 집 가진 사람이 싫은 것이다','허수아비 공격'],['내 주변 집주인들은 다 세금 때문에 죽겠다더라','성급한 일반화'],['이러다 나라 경제가 통째로 무너진다','미끄러운 비탈']]},
 chaebol:{pro:['총수 일가 지분은 한 자릿수인데 그룹 전체를 좌우하는 순환출자 구조','일감 몰아주기 과징금이 해마다 되풀이된다는 공정위 자료','지배구조가 투명한 기업일수록 주가가 덜 저평가된다는 연구'],
  con:['경영권 방어 수단 없이 해외 투기 자본에 노출된 사례','지배구조 규제가 투자·고용 결정을 늦춘다는 상공회의소 조사','이미 공시·사외이사 제도가 강화돼 실효성이 크지 않다는 분석'],
  mid:['소액주주 권한을 키우되 경영권 방어 장치를 함께 주는 방안','일정 기간 유예를 두고 단계적으로 시행하는 방안'],
  bad:[['재벌 편을 드는 사람은 모두 돈 받은 사람이다','허수아비 공격'],['아는 대기업 직원도 회사가 이상하다고 하더라','성급한 일반화'],['한 연구에 따르면 지배구조가 나라를 망친다(출처 없음)','출처 불명']]},
 nk:{pro:['영유아 영양 상태가 악화됐다는 유엔 기구 보고서','정치 상황과 별개로 인도적 지원을 이어 간 해외 사례','지원을 끊은 동안 오히려 남북 대화 창구가 사라졌다는 점'],
  con:['지원 물자가 군으로 흘러갔다는 탈북민 증언과 정부 조사','분배 감시가 보장되지 않은 채 재개하면 되풀이된다는 지적','도발이 이어지는 와중의 지원은 잘못된 신호라는 안보 전문가 의견'],
  mid:['국제기구를 거쳐 분배 모니터링을 조건으로 거는 방안','식량·의약품 같은 최소 품목부터 시작하는 단계적 지원'],
  bad:[['지원에 반대하는 사람은 북한 아이들이 굶어도 된다는 것이다','허수아비 공격'],['퍼주기 하면 결국 통일이 물 건너간다','미끄러운 비탈'],['북녘 아이들의 눈물을 보라','감정 호소']]},
 labor:{pro:['파업 한 번에 수백억 손해배상이 청구돼 노조가 무너진 사례','손해배상 청구가 사실상 노조 활동을 막는 수단으로 쓰인다는 노동연구원 자료','쟁의 행위에 대한 개인 배상을 제한하는 유럽 여러 나라의 제도'],
  con:['불법 점거로 생산 라인이 멈춰 협력업체까지 피해를 본 사례','배상 책임이 줄면 불법 파업이 늘 수 있다는 경영계 분석','합법 파업은 이미 면책되므로 제한이 필요 없다는 법조계 의견'],
  mid:['개인에게는 상한을 두되 노조의 불법 행위 책임은 남기는 방안','손해 산정 기준을 법원이 엄격하게 따지도록 하는 방안'],
  bad:[['반대하는 쪽은 노동자는 다 굶어 죽으라는 것이다','허수아비 공격'],['우리 동네 공장도 파업 때문에 망했다더라','성급한 일반화'],['이 법이 통과되면 나라가 파업 공화국이 된다','미끄러운 비탈']]},
 prosec:{pro:['수사와 기소를 한 기관이 모두 쥔 나라가 드물다는 비교 연구','검찰 수사가 정권 따라 방향이 바뀐 사례','경찰·공수처와 수사권을 나눈 뒤 사건 처리 기간이 줄었다는 통계'],
  con:['수사권 조정 뒤 사건 처리가 오히려 길어졌다는 법원 자료','부패·경제 범죄 수사 역량이 흩어졌다는 일선 수사관 증언','권력형 비리를 수사할 기관이 약해진다는 법학계 우려'],
  mid:['수사권은 나누되 중대 부패 사건은 검찰이 맡는 방안','시행 결과를 일정 기간 평가한 뒤 다시 조정하는 일몰 조항'],
  bad:[['검찰 개혁에 반대하는 사람은 다 기득권이다','허수아비 공격'],['검사 친구가 그러는데 다들 반대한다더라','성급한 일반화'],['이대로면 범죄자 천국이 된다','미끄러운 비탈']]},
 nuke:{pro:['원전의 발전 단가가 가스·석탄보다 낮다는 전력거래소 자료','탄소 배출이 거의 없어 탄소중립 목표에 유리하다는 국제에너지기구 보고서','전력 수요가 급증하는 반도체·데이터센터 산업'],
  con:['사용후핵연료를 둘 영구 처분장이 아직 없다는 점','사고가 났을 때 피해 범위와 비용이 천문학적이라는 해외 사례','재생에너지 단가가 빠르게 떨어지고 있다는 국제 통계'],
  mid:['계속 운전은 안전성 검증을 거쳐 허용하고 신규 건설은 처분장 확보와 묶는 방안','원전과 재생에너지 비중을 함께 늘리는 에너지 믹스'],
  bad:[['원전 반대론자는 전기를 쓰지 말자는 것이다','허수아비 공격'],['원전 하나 더 지으면 언젠가 반드시 터진다','미끄러운 비탈'],['우리 아이들의 미래를 생각하라','감정 호소']]},
 basic:{pro:['기존 복지의 사각지대가 넓다는 보건사회연구원 자료','기본소득 실험에서 근로 의욕이 크게 줄지 않았다는 해외 실험 결과','일자리 자동화로 고용 불안이 커진다는 전망'],
  con:['전 국민에게 주려면 수십조 원 재원이 필요하다는 재정 추계','같은 돈을 취약계층에 몰아주는 쪽이 빈곤 감소 효과가 크다는 분석','실험 규모가 작아 전국 시행 결과를 장담할 수 없다는 점'],
  mid:['청년·농어민 등 일부 계층부터 시범 도입해 효과를 보는 방안','기존 수당을 정리해 재원을 맞추는 단계적 통합'],
  bad:[['기본소득 반대는 서민은 굶으라는 소리다','허수아비 공격'],['돈을 주면 다들 일을 그만둔다더라','성급한 일반화'],['한 번 주기 시작하면 나라 곳간이 거덜 난다','미끄러운 비탈']]},
 platform:{pro:['검색·앱 시장 점유율이 한 기업에 쏠렸다는 공정위 시장 분석','입점 업체에 자사 상품을 먼저 보여 준 사례로 받은 과징금','유럽이 디지털시장법으로 자사 우대를 금지한 사례'],
  con:['규제가 국내 기업만 묶고 해외 거대 플랫폼은 피해 간다는 지적','혁신 서비스 출시가 늦어질 수 있다는 업계 조사','이미 공정거래법으로 사후 제재가 가능하다는 법조계 의견'],
  mid:['자사 우대 등 핵심 행위만 사전 금지하고 나머지는 사후 규제하는 방안','국내외 기업에 같은 기준을 적용할 장치를 함께 두는 방안'],
  bad:[['플랫폼을 감싸는 사람은 모두 그 회사 주주다','허수아비 공격'],['내가 써 보니 수수료가 너무 비싸더라','성급한 일반화'],['규제 한 번이면 IT 산업이 끝장난다','미끄러운 비탈']]},
 pension:{pro:['지금 구조로는 기금이 수십 년 안에 바닥난다는 재정 추계','보험료율이 다른 나라 평균보다 크게 낮다는 비교 통계','늦출수록 미래 세대 부담이 몇 배로 커진다는 연구'],
  con:['노인 빈곤율이 OECD 최고 수준이라 지급액을 줄이면 안 된다는 통계','보험료 인상이 저소득 가입자에게 더 무겁다는 분석','기금 운용 수익률을 높이는 길도 있다는 지적'],
  mid:['보험료는 올리되 저소득층 보험료를 지원하는 방안','지급 개시 나이를 늦추면서 기초연금으로 노후 빈곤을 메우는 방안'],
  bad:[['개혁에 반대하는 쪽은 청년은 망해도 된다는 것이다','허수아비 공격'],['주변 어르신들은 다 연금이 쥐꼬리라더라','성급한 일반화'],['연금은 이미 끝났다(출처 없음)','출처 불명']]},
 wage:{pro:['최저임금 근로자 가구의 생계비가 부족하다는 실태조사','임금이 오르면 소비가 늘어 내수가 산다는 연구','최저임금을 크게 올린 뒤 고용이 크게 줄지 않은 해외 사례'],
  con:['급격한 인상 뒤 소상공인 고용이 줄었다는 통계청 자료','인건비 부담으로 키오스크·무인 매장이 늘었다는 업계 조사','업종·지역별 사정이 달라 한 번에 크게 올리기 어렵다는 분석'],
  mid:['인상 폭은 물가·생산성에 맞추고 소상공인 지원을 늘리는 방안','업종별 구분 적용을 검토하는 방안'],
  bad:[['인상에 반대하는 사람은 알바생 착취를 하자는 것이다','허수아비 공격'],['아는 사장님은 다 문 닫는다더라','성급한 일반화'],['이러다 자영업이 전멸한다','미끄러운 비탈']]},
 med:{pro:['인구 1천 명당 의사 수가 OECD 최하위권이라는 통계','지방·필수의료 과목의 인력 공백 실태','고령화로 의료 수요가 빠르게 늘어난다는 추계'],
  con:['정원을 늘려도 필수과·지방으로 가지 않으면 소용없다는 분석','교육 여건 없이 늘리면 의학 교육의 질이 떨어진다는 지적','의료 수가 구조부터 손봐야 한다는 의료계 의견'],
  mid:['증원과 함께 지역·필수의료 의무 근무와 수가 개편을 묶는 방안','증원 규모를 해마다 수요 조사로 조정하는 방안'],
  bad:[['증원 반대는 의사들 밥그릇 지키기일 뿐이다','허수아비 공격'],['병원 가면 의사 선생님들은 다 반대하더라','성급한 일반화'],['의사가 늘면 동네 병원이 전부 망한다','미끄러운 비탈']]},
 press:{pro:['허위 보도 피해자가 구제받기까지 몇 년이 걸린다는 언론중재위 통계','가짜뉴스로 인한 피해가 갈수록 커진다는 조사','해외 여러 나라의 언론 손해배상 제도'],
  con:['권력자가 비판 보도를 막는 데 쓸 수 있다는 언론단체 우려','고의·중과실 판단 기준이 모호하다는 법조계 지적','이미 정정보도·민사소송 제도가 있다는 점'],
  mid:['공인·권력자는 청구 대상에서 빼고 일반인 피해 구제를 넓히는 방안','언론 스스로 정정·반론 제도를 강화하는 자율 규제'],
  bad:[['찬성하는 쪽은 언론을 길들이려는 것이다','허수아비 공격'],['이 법이 통과되면 비판 기사는 영영 사라진다','미끄러운 비탈'],['기자들 주변에선 다 반대하더라','성급한 일반화']]},
 dev:{pro:['인구가 줄어드는 지역은 경제성 평가로는 사업이 영영 통과하지 못한다는 점','지역 균형 발전을 위해 예외를 둔 과거 사례','교통망이 들어선 뒤 지역 경제가 살아난 사례'],
  con:['예타 면제 사업의 상당수가 적자로 운영된다는 감사원 자료','선거를 앞두고 면제가 몰린다는 분석','재정 낭비 부담이 결국 지역 주민에게 돌아온다는 점'],
  mid:['면제하더라도 사후 평가를 의무화하는 방안','예타 기준에 지역 균형 가중치를 넣는 방안'],
  bad:[['반대하는 사람은 지방은 망해도 된다는 것이다','허수아비 공격'],['우리 고향 사람들은 다 찬성하더라','성급한 일반화'],['한 번 면제하면 모든 사업이 다 면제된다','미끄러운 비탈']]},
 tax:{pro:['법인세 최고세율이 경쟁국보다 높다는 비교 통계','세율을 낮춘 나라로 기업 투자가 옮겨 간 사례','기업 투자가 늘면 일자리와 세수가 함께 는다는 연구'],
  con:['법인세를 낮춘 뒤 투자보다 배당·유보가 늘었다는 분석','세수 감소로 재정 적자가 커진다는 기획재정부 추계','혜택이 대기업에 쏠린다는 조세 전문가 지적'],
  mid:['세율 인하 대신 투자·고용 세액공제를 늘리는 방안','중소기업 구간부터 낮추는 방안'],
  bad:[['감세에 반대하는 쪽은 기업이 다 망하길 바란다','허수아비 공격'],['사장님들은 다 세금이 너무 많다더라','성급한 일반화'],['이대로면 기업들이 전부 해외로 떠난다','미끄러운 비탈']]}};
// 논거 고르기: 내 논지를 받치는 강한 근거 2 · 보통 1 · 반대쪽 근거 1(논지와 거꾸로) · 그럴듯한 궤변 2
opArgs=function(th,s,flip){const D=OP_ARGT[th.k];if(!D)return;const side=s==='mid'?null:D[s],other=s==='pro'?D.con:s==='con'?D.pro:null;
  let G,X=null;if(s==='mid'){G=shuffle(D.mid.slice()).slice(0,2);}else{G=shuffle(side.slice()).slice(0,2);X=pick(other);}
  const M=s==='mid'?[pick(D.pro),pick(D.con)]:[pick(D.mid)];
  const B=shuffle(D.bad.slice()).slice(0,2);
  const A=shuffle([...G.map(t=>({t,q:2,w:s==='mid'?'절충안':'논지를 받치는 근거'})),...M.map(t=>({t,q:1,w:s==='mid'?'한쪽 근거':'보완책'})),...(X?[{t:X,q:-1,w:'논지와 거꾸로 가는 근거'}]:[]),...B.map(b=>({t:b[0],q:-2,w:b[1]}))]);
  const eye=((S.st.kno||40)+(S.st.int||40))/2;const hint=eye>=62?3:eye>=48?2:1;let shown=0;
  openModal('사설 2/3 · 논거 두 개',`<p class="lede">「${esc(th.n)}」 — ${s==='pro'?'찬성':s==='con'?'반대':'절충'}</p><p>사설을 받칠 논거 두 개를 고른다. ${s==='mid'?'절충 사설은 양쪽을 아우르는 해법이 힘이 세다.':'내 논지를 받치는 구체적인 근거(통계·사례·연구)가 힘이 세다.'} 그럴듯한 궤변과 논지와 거꾸로 가는 근거가 섞여 있다.</p><p class="hint">상식·지능이 높을수록 수상한 것이 더 잘 보인다 (지금 ${hint}개까지)</p>${A.map((a,i)=>{let h='';if(a.q<0&&shown<hint){shown++;h=` <small class="r">— ${esc(a.w)}?</small>`;}return `<label class="chk"><input type="checkbox" data-op="${i}"><span><b>${esc(a.t)}</b>${h}</span></label>`;}).join('')}`,
   [{label:'다음: 맺음말',fn:()=>{const sel=[...document.querySelectorAll('#mb input[data-op]:checked')].map(x=>A[+x.dataset.op]);if(sel.length!==2){toast('논거를 두 개 골라 주세요');return false;}opTone(th,s,flip,sel);return false;}}]);
  const up=()=>{const c=[...document.querySelectorAll('#mb input[data-op]')];const n=c.filter(x=>x.checked).length;c.forEach(x=>{x.disabled=!x.checked&&n>=2;});};document.querySelectorAll('#mb input[data-op]').forEach(x=>x.onchange=up);};
// 사설이 나간 뒤: 어떤 논거가 왜 좋았는지·나빴는지
{const _op41=opPublish;opPublish=function(th,s,flip,sel,tone){const O=S.op;const i0=O?O.inf:0,c0=O?O.cons:0;const r=_op41.apply(this,arguments);
  try{if(!O)return r;const dir=O.dir;let di=O.inf-i0,dc=O.cons-c0;let extra=[];const q=(S.clips[0]&&S.clips[0].ed)?S.clips[0].q:50;
    if(dir==='voice'){O.inf=clamp(i0+di*1.35,0,100);if(dc<0)O.cons=clamp(c0+dc*1.3,0,100);if(q>=65&&s!=='mid'&&chance(.3)){O.inf=clamp(O.inf+2,0,100);extra.push('날 선 사설이 화제가 됐다 (영향력↑)');}}
    if(dir==='principle'){O.inf=clamp(i0+di*.9,0,100);O.cons=clamp(c0+(dc>0?dc*2:dc*.7),0,100);if(q>=55&&!sel.some(x=>x.q<0)){apply({trust:.4});extra.push('근거가 탄탄하다는 평 (신뢰↑)');}}
    if(dir==='insider'){const lk=opLeanK(th,s);if(lk>0){O.inf=clamp(O.inf+1.5,0,100);apply({eval:.4});extra.push('회사 논조를 잘 살렸다는 평 (사내 평가↑)');}if(opOwnK(th,s)>0){try{ownRel(2);}catch(e){}}}
    const mb=document.querySelector('#mb');if(mb&&/사설이 나갔다/.test($('#mt').textContent)){mb.querySelectorAll('p.hint').forEach(p=>{if(/영향력 \d+ · 논조 일관성/.test(p.textContent))p.textContent=`영향력 ${Math.round(O.inf)} · 논조 일관성 ${Math.round(O.cons)}${O.dir?` · 방향 ${OP_DIR[O.dir].n}`:''}`;});
      const why=sel.map(x=>`<li class="${x.q>0?'g':'r'}">${esc(x.t)} — ${x.q===2?'강한 근거':x.q===1?'쓸 만한 근거':x.q===-1?'논지와 거꾸로 가는 근거':esc(x.w)+'(궤변)'}</li>`).join('');
      mb.insertAdjacentHTML('beforeend',`<ul class="feed">${why}${extra.map(t=>`<li class="g">${esc(t)}</li>`).join('')}</ul>`);}}catch(e){console.error(e);}return r;};}
// ===== 논설위원의 길: 세 방향 =====
const OP_DIR={voice:{n:'논객',d:'날 선 사설로 여론을 흔든다',pro:'영향력이 1.35배로 쌓이고 잘 쓴 사설이 자주 화제가 된다',con:'말을 바꾸면 더 크게 깎인다'},
  principle:{n:'원칙',d:'근거와 일관성으로 신뢰를 쌓는다',pro:'논조 일관성이 두 배로 쌓이고 궤변 없는 사설마다 신뢰가 오른다',con:'영향력은 조금 느리게 쌓인다'},
  insider:{n:'실세',d:'회사 논조와 대주주를 등에 업고 위로 간다',pro:'논조에 맞는 사설마다 사내 평가·영향력이 더 오르고 실장·주필 문턱이 낮다',con:'논조를 거스르면 득이 없다 · 신뢰는 따로 챙겨야 한다'}};
function opDirPick(first){const O=S.op;if(!O)return;openModal(first?'논설위원의 길':'논설 방향 바꾸기',`<p class="lede">${first?'논설위원실에서 어떤 목소리가 될까.':'방향을 바꾸면 쌓아 온 색깔이 흐려진다.'}</p><p class="hint">공통으로 좋은 점: 현장 대신 책상이라 컨디션이 매달 더 회복되고, 집필 수당이 붙고, 영향력이 높을수록 매달 평판·신뢰가 오르고 사설이 정책·여론을 움직인다. 대신 단독·출입처·광고 영업에선 멀어진다.</p>`,
  Object.keys(OP_DIR).map(k=>({label:`${OP_DIR[k].n} — ${OP_DIR[k].d}`,rec:first&&k==='principle',sub:`${OP_DIR[k].pro} · ${OP_DIR[k].con}`,fn:()=>{if(!first&&O.dir&&O.dir!==k){O.cons=clamp(O.cons-4,0,100);}O.dir=k;log(`논설 방향: ${OP_DIR[k].n}`);toast(`논설 방향 — ${OP_DIR[k].n}`);}})).concat(first?[]:[{label:'그대로 간다',cls:'ghost'}]));}
{const _oe41=opEnter;opEnter=function(){const r=_oe41.apply(this,arguments);try{Q.push(()=>opDirPick(true));}catch(e){}return r;};}
try{ACT.opdir={n:'논설 방향 바꾸기',ap:0,sc:'office',cd:48,d:'논객·원칙·실세 가운데 방향을 바꾼다 (1년에 한 번)'};ACT_IC.opdir='flag';RUN.opdir=function(){opDirPick(false);};}catch(e){}
// 실세: 실장·주필 문턱이 낮다 (영향력 -10으로 본다)
{const _oj41=opJinsa;opJinsa=function(){const O=S.op;const b=O&&O.dir==='insider'?10:0;if(b)O.inf+=b;try{return _oj41.apply(this,arguments);}finally{if(b&&S.op)S.op.inf=clamp(S.op.inf-b,0,100);}};}
// 매달: 논설위원만의 메리트
{const _om41=opMonth;opMonth=function(lines){const r=_om41.apply(this,arguments);try{const O=S.op;if(!O)return r;
  if(!O.dir&&!Q.some(f=>String(f).includes('opDirPick')))Q.push(()=>opDirPick(true));
  S.hp=clamp(S.hp+6,0,100);
  const pay=Math.round(payOf(OUT())*[0,.06,.09,.12][O.pos]/5)*5;if(pay>0){S.money+=pay;O.payT=(O.payT||0)+pay;}
  if(O.inf>=40){apply({fame:.15+(O.inf-40)/400,trust:O.dir==='principle'?.2:.1});}
  if(O.inf>=70&&chance(.08)){const T=Object.keys(O.st);const k=T.length?pick(T):null;const th=k?OP_TH.find(x=>x.k===k):pick(OP_TH);const st=O.st[th.k];
    const what=st?(st.s==='pro'?'우리가 촉구한 방향':st.s==='con'?'우리가 경고한 문제':'우리가 내놓은 절충안'):'우리 사설의 제안';
    lines.push({c:'g',t:`사설이 세상을 움직였다 — 「${th.n}」, ${jo2(what,'이','가')} 정부 대책에 반영됐다 · ${apply({fame:1.2,trust:.5})}`});log(`사설 반영: ${th.n}`);O.inf=clamp(O.inf+3,0,100);}
  }catch(e){console.error(e);}return r;};}
// 수첩·회사 탭의 논설위원실 카드: 방향과 메리트를 보여 준다
{const _ob41=opBox;opBox=function(){let h=_ob41.apply(this,arguments);try{const O=S.op;if(!O)return h;const D=O.dir?OP_DIR[O.dir]:null;
  h+=`<div class="card"><div class="t">${D?`방향 · ${D.n}`:'방향을 아직 정하지 않았다'}</div><p class="hint" style="margin:3px 0 0">${D?`${esc(D.d)} — ${esc(D.pro)}`:'다음 달 「논설위원의 길」에서 고른다'}</p><p class="hint" style="margin:3px 0 0">논설위원실의 이점: 컨디션 매달 +6 · 집필 수당 월 ${Math.round(payOf(OUT())*[0,.06,.09,.12][O.pos]/5)*5}만 원 · 영향력 40 이상이면 매달 평판·신뢰↑ · 70 이상이면 사설이 정책에 반영되기도 한다${O.payT?` · 지금까지 받은 수당 ${O.payT.toLocaleString('ko-KR')}만 원`:''}</p></div>`;}catch(e){}return h;};}
// ===== 대외 관계 비중 줄이기 (논설위원실) =====
try{const i=OP_ACTS.indexOf('network');if(i>=0){OP_ACTS.splice(i,1);OP_ACTS.splice(OP_ACTS.indexOf('life'),0,'network');}if(!OP_ACTS.includes('opdir'))OP_ACTS.splice(OP_ACTS.indexOf('opleave'),0,'opdir');}catch(e){}
{const _mm41=misMake;misMake=function(){const L=_mm41.apply(this,arguments);try{if(S&&S.op&&Array.isArray(L)){const out=L.filter(x=>!['entup','fame','posw','bal','watch'].includes(x.k));
    const has=k=>out.some(x=>x.k===k);if(!has('editorial'))out.unshift({k:'editorial',g:2,t:'사설 2편 쓰기',h:'사설 쓰기',rel:false,b:0});
    if(out.length<3&&!has('opmeet')&&rankActs().includes('opmeet'))out.push({k:'opmeet',g:1,t:'논설회의 1번',h:'논설회의',rel:false,b:0});
    return out.slice(0,3);}}catch(e){console.error(e);}return L;};}
{const _rc41=recommend;recommend=function(){const r=_rc41.apply(this,arguments);try{if(S&&S.op&&(r==='network'||!r)){const ok=id=>rankActs().includes(id)&&!why(id);return ['editorial','opmeet','column','opguest'].find(ok)||r;}}catch(e){}return r;};}
{const _ap41=autoPickAct;autoPickAct=function(k){const r=_ap41.apply(this,arguments);try{if(S&&S.op&&r==='network'&&((S._autoUse||{}).network||0)>=0){const ok=id=>rankActs().includes(id)&&!why(id)&&actCost(id)<=S.ap&&((S._autoUse||{})[id]||0)<2;return ['editorial','opmeet','column'].find(ok)||r;}}catch(e){}return r;};}
try{NET_EVENTS.forEach(e=>{if(e._op41)return;const c0=e.c;e._op41=1;e.c=function(){if(S&&S.op&&Math.random()<.6)return false;return c0.apply(this,arguments);};});}catch(e){}
// ===== 1.42 그룹 회장의 일: 1면 회의 대신 회장다운 결정 =====
// 회장은 지면을 고르지 않는다. 그룹의 방향·사람·돈·편집권·후계를 정한다.
function chCost(k){const c=S.co||{};return +Math.max(.3,(c.staff||40)*k).toFixed(1);}
function chFx(o){try{if(o.cash)S.co.cash+=o.cash;if(o.q)S.co.q=clamp(S.co.q+o.q,10,100);if(o.adB)S.co.adB=(S.co.adB||0)+o.adB;}catch(e){}const t=apply({fame:o.fame||0,trust:o.trust||0,eval:o.eval||0});return t;}
const CH_ACTS={
 chstrat:{n:'그룹 전략 회의',ap:1,sc:'office',cd:24,d:'자매 언론사·계열사 사장들을 모아 그룹이 갈 길을 정한다'},
 chceo:{n:'계열사 사장단 인사',ap:1,sc:'office',cd:48,d:'자매사·계열사 사장 자리에 누구를 앉힐지 정한다'},
 chsummit:{n:'정·재계 회동',ap:1,sc:'office',cd:12,d:'권력과 돈의 꼭대기 사람들과 마주 앉는다. 얻는 만큼 편집권 시비도 따라온다'},
 chfree:{n:'편집권 원칙',ap:1,sc:'office',cd:48,d:'회장이 기사에 손을 댈지, 대지 않을지 그룹 전체에 밝힌다'},
 chfound:{n:'문화재단·사회공헌',ap:1,sc:'office',cd:24,d:'재단에 돈을 넣어 그룹의 얼굴을 만든다'},
 chheir:{n:'후계 구도',ap:1,sc:'office',cd:96,d:'내 다음 회장을 누구로 할지 판을 짠다'}};
try{Object.assign(ACT,CH_ACTS);Object.assign(ACT_IC,{chstrat:'bld',chceo:'users',chsummit:'link',chfree:'shield',chfound:'heart',chheir:'user'});Object.assign(ACT_STAT,{chstrat:'lead',chceo:'lead',chsummit:'net',chfree:'lead',chfound:'cha',chheir:'lead'});}catch(e){}
function chGrp(){return S.founder?(S.grpName||`${OUT().n}미디어그룹`):(MGRP[grpOf()]?MGRP[grpOf()].n:`${OUT().n} 그룹`);}
RUN.chstrat=function(){const G=chGrp(),cost=chCost(.02);spend(1,3);setCd('chstrat');
  openModal('그룹 전략 회의',`<p class="lede">${esc(G)} 사장단이 회장실에 모였다. 올해 그룹이 갈 길을 정한다.</p>`,[
   {label:'미디어 통합 — 자매사 콘텐츠·광고를 하나로 묶는다',rec:S.co.cash<cost*2,sub:'광고 영업↑ · 비용 절감 · 편집국은 「자율이 줄었다」고 본다(신뢰 조금↓)',fn:()=>{toast(chFx({adB:.06,cash:cost*.5,trust:-.4,eval:.5}));S.chStrat='merge';log(`${G} 전략: 미디어 통합`);}},
   {label:'저널리즘 투자 — 그룹 차원 탐사팀·팩트체크센터',rec:S.co.cash>=cost*2&&S.trust<60,sub:`회사 자금 -${eok(cost)} · 보도 품질↑ · 평판↑`,disabled:S.co.cash<cost,fn:()=>{toast(chFx({cash:-cost,q:4,fame:1.2,trust:.5}));S.chStrat='journal';log(`${G} 전략: 저널리즘 투자`);}},
   {label:'수익 다변화 — 비언론 계열사를 키운다',sub:'회사 자금↑ · 계열사 확장 · 「언론이 장사한다」는 눈총(신뢰↓)',fn:()=>{if(S.founder&&(S.sis||[]).length){const x=pick(S.sis.filter(y=>y.lv<3))||null;if(x){x.lv++;log(`${x.n} ${x.lv}단계로`);}}toast(chFx({cash:cost*1.2,trust:-.6}));S.chStrat='biz';log(`${G} 전략: 수익 다변화`);}},
   {label:'디지털 전환 — 그룹 통합 앱·구독',rec:S.co.cash>=cost*2&&S.trust>=60,sub:`회사 자금 -${eok(cost*.8)} · 트래픽·구독↑`,disabled:S.co.cash<cost*.8,fn:()=>{try{S.co.bT+=.02;S.co.bS+=.01;}catch(e){}toast(chFx({cash:-cost*.8,fame:.5}));S.chStrat='digital';log(`${G} 전략: 디지털 전환`);}}]);};
RUN.chceo=function(){const G=chGrp(),sis=S.founder?(S.sis||[]).map(x=>x.n):sisList().map(id=>(OUTLETS.find(o=>o.id===id)||{}).n).filter(Boolean);const tgt=pick(sis.length?sis:[`${OUT().n} 계열사`]);spend(1,3);setCd('chceo');const cost=chCost(.008);
  openModal('계열사 사장단 인사',`<p class="lede">「${esc(tgt)}」 사장 자리가 빈다. 회장의 인사는 그룹 전체가 본다.</p>`,[
   {label:'오랜 측근을 앉힌다',sub:'그룹 장악력↑(사내 평가↑) · 실력은 보통 · 「회장 사람」 뒷말',fn:()=>{toast(chFx({eval:1.5,q:-1,trust:-.4}));log(`${tgt} 사장: 회장 측근`);}},
   {label:'외부 전문경영인을 영입한다',rec:S.co.cash>=cost*3,sub:`영입 비용 ${eok(cost)} · 실적↑(광고·수익) · 조직은 낯설어한다`,disabled:S.co.cash<cost,fn:()=>{toast(chFx({cash:-cost,adB:.03,eval:.5}));log(`${tgt} 사장: 전문경영인 영입`);}},
   {label:'기자 출신을 발탁한다',rec:S.co.cash<cost*3,sub:'편집국 사기↑ · 보도 품질↑ · 경영 실적은 장담 못 한다',fn:()=>{toast(chFx({q:2,trust:.6,fame:.4}));log(`${tgt} 사장: 기자 출신 발탁`);}}]);};
RUN.chsummit=function(){spend(1,3);setCd('chsummit');const gov=ENTS.filter(e=>e[2]==='gov'&&S.net&&S.net[e[0]]).sort((a,b)=>(b[4]||0)-(a[4]||0))[0],corp=ENTS.filter(e=>e[2]==='corp'&&S.net&&S.net[e[0]]).sort((a,b)=>(b[4]||0)-(a[4]||0))[0];
  openModal('정·재계 회동',`<p class="lede">초대장이 두 장 왔다. 회장의 한 끼는 그룹 전체의 신호가 된다.</p>`,[
   ...(gov?[{label:`${gov[1]} 고위 인사와 비공개 오찬`,sub:'그 기관과 관계↑↑ · 정부 광고·정보↑ · 「권언유착」 보도가 나올 수 있다',risk:true,fn:()=>{netUp(gov[0],12);if(chance(.25)){toast('오찬 사진이 찍혔다 — 「권언유착」 비판 · '+apply({trust:-2}));}else toast(chFx({eval:.6,adB:.02}));}}]:[]),
   ...(corp?[{label:`재계 총수 모임 — ${corp[1]} 등`,sub:'큰 광고주 관계↑↑ · 광고↑ · 비판 기사 때 압박이 세진다',risk:true,fn:()=>{netUp(corp[0],12);if(chance(.2)){toast('「광고주 앞에 고개 숙인 언론」 칼럼이 돌았다 · '+apply({trust:-1.5}));}else toast(chFx({adB:.04}));}}]:[]),
   {label:'둘 다 사양한다 — 회장은 거리를 둔다',rec:S.trust<50,sub:'신뢰↑ · 평판 조금↑ · 정·재계는 서운해한다',fn:()=>{if(gov)netUp(gov[0],-3);if(corp)netUp(corp[0],-3);toast(chFx({trust:1,fame:.4}));}}]);};
RUN.chfree=function(){spend(1,3);setCd('chfree');
  openModal('편집권 원칙',`<p class="lede">계열사 비판 기사가 그룹 매체에 실릴 참이다. 편집국은 회장의 답을 기다린다.</p>`,[
   (S.chFree===1?{label:'편집권 독립 원칙을 다시 확인한다',rec:true,sub:'이미 선언한 원칙 — 신뢰 조금↑ · 광고 아주 조금↓',fn:()=>{toast(chFx({trust:.8,fame:.3,adB:-.01}));log('회장 편집권 원칙 재확인');}}:{label:'「회장은 기사에 손대지 않는다」 — 편집권 독립 선언',rec:true,sub:'신뢰↑↑ · 평판↑ · 계열사·광고주 압박을 막아 줄 수 없다(광고 조금↓)',fn:()=>{S.chFree=1;toast(chFx({trust:2.5,fame:1.5,adB:-.03}));log('회장 편집권 독립 선언');tick(`${chGrp()} 회장 "기사에 손대지 않겠다"`,1);}}),
   {label:'계열사 기사만은 사전 보고를 받는다',sub:'그룹 리스크↓ · 기자들 반발(신뢰↓)',fn:()=>{S.chFree=0;toast(chFx({trust:-1.5,eval:.5}));log('계열사 기사 사전 보고 지시');}},
   {label:'말없이 지켜본다',sub:'아무것도 정하지 않는다',fn:()=>{}}]);};
RUN.chfound=function(){const cost=chCost(.015);spend(1,3);setCd('chfound');
  openModal('문화재단·사회공헌',`<p class="lede">${esc(chGrp())} 문화재단 이사회. 올해 어디에 돈을 쓸까.</p>`,[
   {label:'언론인 장학·연수 기금',rec:S.co.cash>=cost*2,sub:`회사 자금 -${eok(cost)} · 평판↑ · 후배 기자들이 큰다(보도 품질↑)`,disabled:S.co.cash<cost,fn:()=>{try{(S.team||[]).forEach(m=>{m.skill=Math.min(95,(m.skill||40)+1);});}catch(e){}toast(chFx({cash:-cost,fame:1.5,q:1}));}},
   {label:'지역 문화·공익 사업',sub:`회사 자금 -${eok(cost)} · 신뢰↑ · 지역 관계↑`,disabled:S.co.cash<cost,fn:()=>{toast(chFx({cash:-cost,trust:1.5,fame:.8}));}},
   {label:'회장 이름을 건 언론상 제정',sub:`회사 자금 -${eok(cost*.6)} · 평판↑↑ · 「회장 띄우기」라는 뒷말`,disabled:S.co.cash<cost*.6,fn:()=>{toast(chFx({cash:-cost*.6,fame:2.5,trust:-.3}));}}]);};
RUN.chheir=function(){spend(1,3);setCd('chheir');
  openModal('후계 구도의 갈림길',`<p class="lede">이사회가 조용히 묻는다. "회장님 다음은 누굽니까."</p>`,[
   {label:'가족 승계 — 2세에게 경영 수업을 시킨다',sub:'그룹 장악력 유지 · 「세습 언론」 비판(신뢰↓)',fn:()=>{S.heir='family';toast(chFx({trust:-1.2,eval:.8}));log('후계: 가족 승계 준비');}},
   {label:'전문경영인 승계 — 이사회가 뽑는다',sub:'신뢰↑ · 지배력은 줄어든다',fn:()=>{S.heir='board';toast(chFx({trust:1,eval:-.3}));log('후계: 이사회 선임');}},
   {label:'기자 출신 승계 — 편집국이 키운 사람에게',sub:'편집국 사기·평판↑ · 경영 감각은 숙제',fn:()=>{S.heir='newsroom';toast(chFx({trust:.8,fame:1,q:1}));log('후계: 기자 출신 승계');}}]);};
{const _rk41=rankActs;rankActs=function(){const a=_rk41.apply(this,arguments);try{if(S&&S.chair&&!S.op&&!S.story){const L=a.filter(id=>id!=='front');const add=Object.keys(CH_ACTS).filter(id=>!L.includes(id));return add.concat(L);}}catch(e){}return a;};}
try{const g=ACT_GROUPS.find(x=>x[0]==='영업과 경영');if(g)Object.keys(CH_ACTS).reverse().forEach(id=>{if(!g[2].includes(id))g[2].unshift(id);});const g2=ACT_GROUPS.find(x=>x[0]==='기사와 지면');if(g2&&!g2[2].includes('editorial'))g2[2].unshift('editorial','opmeet','opguest');}catch(e){}
try{const g=ACT_GROUPS.find(x=>x[0]==='기타')||ACT_GROUPS[ACT_GROUPS.length-1];if(g&&!g[2].includes('opdir'))g[2].push('opdir');}catch(e){}

// ===== 1.5 AI: 회장은 회장의 일을 추천받는다 =====
{const _rc43=recommend;recommend=function(){const r=_rc43.apply(this,arguments);try{if(S&&S.chair&&!S.op&&!S.story){if(r&&CH_ACTS[r])return r;const acts=rankActs();const ok=id=>acts.includes(id)&&!why(id);const o=[];const c=S.co||{};if(S.trust<45)o.push('chfree','chfound');if((c.cash||0)<0)o.push('chstrat');if(!S.heir&&(S.turn-(S.chairT||0))>=YW*2)o.push('chheir');o.push('chstrat','chceo','chfound','chsummit');const x=o.find(ok);if(x&&r!=='rest')return x;}}catch(e){}return r;};}
{const _ap43=autoPickAct;autoPickAct=function(){let b=null,had=true;try{if(S&&S.chair){b=S._autoBan||(S._autoBan=new Set());had=b.has('chheir');b.add('chheir');}}catch(e){}try{return _ap43.apply(this,arguments);}finally{try{if(b&&!had)b.delete('chheir');}catch(e){}}};}