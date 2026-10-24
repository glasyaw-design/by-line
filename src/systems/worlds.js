/* 바이라인 1.6 — src/systems/worlds.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===================== 1.2 판마다 다른 사람, 다른 세계 =====================
// ---- 성격·약점 특성 ----
const PTRAITS={
 drinker:{n:'술고래',d:'술자리에서 관계가 잘 쌓인다',up:'동료·취재원 관계 쌓이는 속도 +30%',down:'매달 컨디션 -3',rel:1.3,srel:1.3,hpM:-3},
 sober:{n:'술 못 마심',d:'회식 대신 커피 약속',up:'매달 컨디션 +4 · 멘탈 성장 +20%',down:'인맥 성장 -25% · 취재원 관계 -10%',hpM:4,srel:.9,grow:{net:.75,men:1.2}},
 perfect:{n:'완벽주의',d:'한 줄도 그냥 못 넘긴다',up:'완성도 +4 · 오보 위험 -20%',down:'기사 쓸 때마다 컨디션 -3',q:4,risk:.8,writeHp:3},
 talker:{n:'말빨',d:'누구와도 말이 통한다',up:'인터뷰·친화력·영업력 성장 +40%',down:'문장력 성장 -20%',grow:{int:1.4,cha:1.4,sal:1.4,wri:.8}},
 analog:{n:'기계치',d:'엑셀만 열면 머리가 아프다',up:'취재력·체력 성장 +30% · 취재원 관계 +10%',down:'데이터·속도 성장 -40%',grow:{inv:1.3,sta:1.3,dat:.6,spd:.6},srel:1.1},
 justice:{n:'정의감 과잉',d:'불의를 보면 못 참는다',up:'평판·신뢰 +10%',down:'윗선과 자주 부딪힌다',fame:1.1,trust:1.1,clash:1},
 timid:{n:'겁이 많음',d:'위험한 현장은 피하고 싶다',up:'검증력 성장 +40% · 오보 위험 -15%',down:'단독 아이템이 덜 붙는다',grow:{ver:1.4},risk:.85,excl:.88},
 workaholic:{n:'워커홀릭',d:'일이 곧 삶이다',up:'행동력 +1',down:'매달 컨디션 -6 · 멘탈 성장 -20%',ap:1,hpM:-6,grow:{men:.8}},
 social:{n:'인싸',d:'어딜 가나 친구가 생긴다',up:'동료·취재원 관계 쌓이는 속도 +30% · 친화력 성장 +20%',down:'상식·데이터 성장 -20%',rel:1.3,srel:1.25,grow:{kno:.8,dat:.8,cha:1.2}},
 lone:{n:'독고다이',d:'혼자 일하는 게 편하다',up:'단독 아이템이 잘 붙는다 · 취재력 성장 +20%',down:'동료·취재원 관계 -25% · 리더십 성장 -30%',rel:.75,srel:.8,grow:{inv:1.2,lead:.7},excl:1.15},
 memory:{n:'기억력 천재',d:'한 번 본 건 잊지 않는다',up:'상식·검증력 성장 +30%',down:'체력 성장 -30%',grow:{kno:1.3,ver:1.3,sta:.7}},
 writer:{n:'글쟁이',d:'문장 하나에 목숨 건다',up:'문장력·제목 감각 성장 +30% · 완성도 +2',down:'속도·영업력 성장 -30%',grow:{wri:1.3,hed:1.3,spd:.7,sal:.7},q:2},
 seller:{n:'영업통',d:'사람 만나 계약 따내는 게 즐겁다',up:'영업력 성장 +50% · 광고 영업 성공률 +6%p',down:'신뢰 오르는 폭 -10%',grow:{sal:1.5},adP:.06,trust:.9},
 leader:{n:'골목대장',d:'사람을 모으고 이끄는 게 편하다',up:'리더십·친화력 성장 +40%',down:'취재력·데이터 성장 -20%',grow:{lead:1.4,cha:1.4,inv:.8,dat:.8}}};
function trs(){return (S&&S.traits||[]).map(k=>PTRAITS[k]).filter(Boolean);}
function trGrow(k){let m=1;trs().forEach(t=>{if(t.grow&&t.grow[k])m*=t.grow[k];});return m;}
function trMul(f){let m=1;trs().forEach(t=>{if(t[f])m*=t[f];});return m;}
function trSum(f){return trs().reduce((a,t)=>a+(t[f]||0),0);}
function traitPick(next){const pool=shuffle(Object.keys(PTRAITS)).slice(0,6);const sel=[];
  const show=()=>openModal(sel.length?'두 번째 성격':'나는 어떤 사람인가',`<p class="lede">${sel.length?`첫째는 「${PTRAITS[sel[0]].n}」. 하나 더 고른다.`:'성격 두 가지를 고른다. 장점과 약점이 함께 온다.'}</p>`,pool.filter(k=>!sel.includes(k)).map(k=>({label:PTRAITS[k].n,sub:`${PTRAITS[k].up} · ${PTRAITS[k].down}`,fn:()=>{if(sel.length>=2||sel.includes(k))return false;sel.push(k);if(sel.length>=2){S.traits=sel.slice(0,2);log(`성격: ${sel.map(x=>PTRAITS[x].n).join(' · ')}`);closeModal();next&&next();return false;}show();return false;}})).concat([{label:'무작위로 둘',cls:'ghost',fn:()=>{if(sel.length>=2)return false;sel.push('x','x');S.traits=shuffle(pool).slice(0,2);log(`성격: ${S.traits.map(x=>PTRAITS[x].n).join(' · ')}`);toast(`성격: ${S.traits.map(x=>PTRAITS[x].n).join(' · ')}`);closeModal();next&&next();return false;}}]));
  show();}
function traitMonth(lines){if(!S.traits||!S.traits.length)return;const h=trSum('hpM');if(h)S.hp=clamp(S.hp+h,0,100);
  if(S.traits.includes('justice')&&!S.founder&&S.rank>=1&&S.rank<=5&&chance(.1)){const bs=colBy('boss');if(bs){relUp(bs,-2,'정의감 충돌');lines.push({c:'',t:`정의감 과잉 — 회의에서 ${jo2(bs.name,'과','와')} 또 부딪혔다. 동료들은 속이 시원하다는 눈치다`});valN('ind',1);}}
  if(S.traits.includes('workaholic')&&S.hp<25&&chance(.25)){lines.push({c:'r',t:'워커홀릭 — 몸이 먼저 신호를 보냈다. 이틀을 앓아누웠다'});S.ap=Math.max(1,S.ap-2);}}
function traitBox(){const T=trs();if(!T.length)return S.story?'':`<div class="card"><div class="t">${ic('user')} 성격</div><p class="hint" style="margin:4px 0 6px">아직 정하지 않았다.</p><button type="button" class="btn" onclick="traitPick(()=>render())">성격 고르기</button></div>`;
  return `<div class="card"><div class="t">${ic('user')} 성격 · ${T.map(t=>esc(t.n)).join(' · ')}</div>${T.map(t=>`<p class="hint" style="margin:3px 0 0"><b style="color:var(--fg)">${esc(t.n)}</b> — ${esc(t.d)}. <span style="color:var(--good)">${esc(t.up)}</span> · <span style="color:var(--red)">${esc(t.down)}</span></p>`).join('')}</div>`;}

// ---- 이번 판의 세계: 세력 균형 · 진영별 평판 ----
const FAC={gov:['정부·여당','#77a6ff'],opp:['야당','#ff8fb1'],chae:['재벌','#ffb84d'],pros:['검찰','#b98cff'],civ:['시민사회','#5ad49b']};
const CAMP={cons:'보수 진영',prog:'진보 진영',ind:'언론계',read:'독자'};
function ensure12(){if(!S||S.phase!=='game')return;if(!S.world){S.world={ruling:pick(['cons','prog']),t0:S.turn,chg:0};S.fac={gov:R(48,64),opp:R(36,52),chae:R(50,70),pros:R(46,64),civ:R(32,50)};S.rep={cons:0,prog:0,ind:0,read:0};const l=(OUT()||{}).lean;if(l==='cons')S.rep.cons=8;if(l==='prog')S.rep.prog=8;if(l==='market')S.rep.cons=4;}
  if(!S.heirDone&&S.turn<=8&&META&&META.heir){S.heirDone=1;try{heirApply();}catch(e){console.error(e);}}if(!S.giftDone&&S.turn-(S.qsT||0)<=8&&!S.story&&META&&META.gift){S.giftDone=1;try{giftApply();}catch(e){console.error(e);}}}
function repN(k,v){if(!S.rep)return;S.rep[k]=clamp(+(S.rep[k]+v).toFixed(1),-100,100);}
function facN(k,v){if(!S.fac)return;S.fac[k]=clamp(+(S.fac[k]+v).toFixed(1),5,95);}
function facOf(it){const t=(it.title||'')+' '+(it.subj||'');const E=ENT[it.ent];if(/검찰|검사|수사 무마|특수부|기소/.test(t))return 'pros';if(/의원|국회|정당|야당|대표 측|당 대표/.test(t))return 'opp';if(/대통령실|장관|정부|청와대|부처|총리|여당/.test(t)||E&&E.kind==='gov')return 'gov';if(E&&E.kind==='corp'||CORPS.some(c=>t.includes(c))||/그룹|재벌|회장/.test(t))return 'chae';if(/시민단체|노조/.test(t))return 'civ';return null;}
function v12Pub(it,clip,W){ensure12();const crit=CRIT_RE.test(it.title||'');const imp=clip?clip.imp:30;const f=facOf(it);
  if(f&&crit){const d=Math.min(4,imp/22);facN(f,-d);if(f==='gov')facN('opp',d*.5);if(f==='opp')facN('gov',d*.4);if(f==='chae'||f==='pros')facN('civ',d*.3);
    const R0=S.world.ruling;if(f==='gov'){repN(R0==='cons'?'prog':'cons',d*.8);repN(R0,-d*.5);}if(f==='opp'){repN(R0,d*.6);repN(R0==='cons'?'prog':'cons',-d*.4);}}
  if(W&&W.angle==='cons'){repN('cons',2);repN('prog',-1);}if(W&&W.angle==='prog'){repN('prog',2);repN('cons',-1);}
  if(clip){repN('read',(clip.q-55)/40-(W&&W.head==='bait'?1.5:0));if(it.excl)repN('ind',imp/40);}}
function worldMonth(lines){ensure12();const F=S.fac,y=2027+Math.floor(S.turn/YW),m=month();for(const k in F)F[k]=+(F[k]+(50-F[k])*.02+R(-10,10)/10).toFixed(1);for(const k in S.rep)S.rep[k]=+(S.rep[k]*.99).toFixed(1);
  if(m===3&&y%5===0&&!(S.world.lastY===y)){S.world.lastY=y;const flip=F.gov<45||chance(clamp((55-F.gov)/40,.15,.6));if(flip){const old=S.world.ruling;S.world.ruling=old==='cons'?'prog':'cons';S.world.chg++;S.world.chgT=S.turn;F.gov=R(55,65);F.opp=R(35,45);lines.push({c:'g',t:`대선 — 정권이 바뀌었다. ${jo2(CAMP[S.world.ruling],'이','가')} 정부를 잡았다. 출입처 분위기가 하루아침에 달라졌다`});try{routeRegime(old);}catch(e){}try{oidRegime();}catch(e){}}else lines.push({c:'',t:`대선 — 정권이 재창출됐다. ${CAMP[S.world.ruling]}의 시대가 이어진다`});}
  if(F.chae<28&&!S.world.chaeEv){S.world.chaeEv=1;lines.push({c:'g',t:'재벌 개혁 — 순환출자 규제와 총수 일가 처벌이 이어진다. 대기업 광고 예산이 줄고, 기업 비판 기사에 대한 압박도 약해졌다'});}
  if(F.chae>72&&!S.world.chaeHi){S.world.chaeHi=1;lines.push({c:'r',t:'재벌의 시대 — 대기업 광고가 언론을 쥐락펴락한다. 광고주 압박이 거세진다'});}
  if(F.pros>76&&chance(.08)&&S.rank>=1&&oHas(D_NEWS)){lines.push({c:'r',t:'검찰 공화국 — 검찰이 언론사 압수수색에 나섰다. 기자들의 통화 기록을 들여다본다는 말이 돈다'});S.pending.push({type:'suit',ent:null,who:'검찰',due:S.turn+R(2,6),title:(mine()[0]||{}).h||'최근 보도'});}
  if(F.pros<28&&!S.world.prosEv){S.world.prosEv=1;lines.push({c:'g',t:'검찰 개혁 — 수사권이 쪼개졌다. 언론을 향한 고소·압수수색이 줄었다'});}
  if(F.civ>72&&!S.world.civEv){S.world.civEv=1;lines.push({c:'g',t:'시민 감시의 시대 — 낚시 제목과 광고성 기사에 대한 비판이 거세다. 신뢰가 더 무겁게 쌓인다'});}
  // 진영 평판이 갈리면 그 진영에서 제보가 오고, 반대 진영은 등을 돌린다
  const top=['cons','prog'].sort((a,b)=>S.rep[b]-S.rep[a])[0];if(S.rep[top]>=30&&chance(.12)&&S.rank>=1){const it=makeItem(S.dept,{excl:true,pre:1});it.src=CAMP[top];S.items.push(it);lines.push({c:'g',t:`${CAMP[top]}에서 나를 믿고 제보가 왔다 → 「${it.title}」`});}
  ['cons','prog'].forEach(k=>{if(S.rep[k]<=-30&&chance(.08)&&S.rank>=1){lines.push({c:'r',t:`${jo2(CAMP[k],'이','가')} 나를 적으로 본다 — 출입처 몇 곳이 취재에 응하지 않는다`});S.hp=clamp(S.hp-3,0,100);}});}
function facK(){const F=S&&S.fac;if(!F)return{ad:1,legal:1,trust:1};return{ad:clamp(F.chae/55,.6,1.4),legal:clamp(F.pros/55,.6,1.5),trust:F.civ>70?1.12:1};}
function worldBox(){ensure12();const F=S.fac,P=S.rep;const bar=(v,c)=>`<div class="mgbar" style="flex:1"><i style="width:${v}%;background:${c}"></i></div>`;
  return `<div class="card"><div class="t">${ic('flag')} 이번 판의 세계 · ${CAMP[S.world.ruling]} 집권${S.world.chg?` · 정권 교체 ${S.world.chg}번`:''}</div>${Object.keys(FAC).map(k=>`<div class="mgk"><span style="flex:0 0 68px;font-size:12.5px">${FAC[k][0]}</span>${bar(F[k],FAC[k][1])}<span class="mgs" style="font-size:12px">${Math.round(F[k])}</span></div>`).join('')}<p class="hint" style="margin:6px 0 2px">내 기사가 힘의 균형을 바꾼다. 재벌이 세면 광고 압박이, 검찰이 세면 소송이, 시민사회가 세면 신뢰의 무게가 커진다.</p><div class="sec" style="margin-top:6px">진영별 평판</div>${Object.keys(CAMP).map(k=>{const v=Math.round(P[k]);return `<div class="vb-row"><span class="vb-l" style="flex:0 0 64px;text-align:left;color:var(--mute)">${CAMP[k]}</span><div class="vb-bar"><i style="${v<0?`right:50%;width:${-v/2}%;background:var(--red)`:`left:50%;width:${v/2}%;background:var(--good)`}"></i><b></b></div><span class="mgs" style="flex:0 0 30px;text-align:right;font-size:12px">${v>0?'+':''}${v}</span></div>`;}).join('')}</div>`;}

// ---- 계보 이어 하기 ----
function heirSave(){try{if(!S||S.phase!=='end')return;const src=(S.sources||[]).slice().sort((a,b)=>b.trust-a.trust).slice(0,3).map(x=>({name:x.name,role:x.role,d:x.d,trust:x.trust,pers:x.pers}));const gr=Object.keys(S.net||{}).filter(k=>S.net[k].rel<=-25).slice(0,4);
  META.heir={from:S.name,rank:rankName(),fame:S.fame||0,money:Math.max(0,S.money||0),src,gr,rep:S.rep||null,t:Date.now()};metaSave();}catch(e){console.error(e);}}
function heirApply(){const H=META.heir;if(!H)return;META.heir=null;metaSave();S.heirFrom=H.from;
  (H.src||[]).forEach(x=>{const s={id:uid(),name:x.name,role:x.role,d:catOf(S.dept).includes(x.d)?x.d:pick(catOf(S.dept)),trust:Math.round(x.trust*.6),pers:x.pers||pick(Object.keys(PERS)),last:-9,fresh:S.turn};S.sources.push(s);});
  S.fame=(S.fame||0)+Math.min(8,Math.round(H.fame*.15));S.money+=Math.min(3000,Math.round(H.money*.3));(H.gr||[]).forEach(k=>{if(S.net&&S.net[k])S.net[k].rel=clamp(S.net[k].rel-15,-100,100);});if(H.rep&&S.rep)for(const k in S.rep)S.rep[k]=Math.round((H.rep[k]||0)*.3);
  log(`${H.from} ${H.rank}의 뒤를 잇는다 — 취재원 ${(H.src||[]).length}명과 이름값, 그리고 원한도 물려받았다`);Q.push(()=>openModal('선배의 뒤를 잇는다',`<p class="lede">${esc(H.from)} ${esc(jo2(H.rank,'이','가'))} 남긴 명함첩을 받았다. 믿을 만한 취재원 ${(H.src||[]).length}명, 업계에 남은 이름값${H.gr&&H.gr.length?`, 그리고 선배를 미워하던 ${H.gr.length}곳의 원한까지`:''}.</p><p class="hint">"그 사람 후배야? 그럼 얘기가 다르지."</p>`));}

// ---- 판마다 진실이 바뀌는 장기 사건 ----
const CASE_DEF=[
 {k:'slush',t:'{corp} 비자금 의혹',subj:'{corp}',S:['회장','재무담당 부사장','회장 장남','외부 브로커'],C:{doc:['해외 법인 송금 내역에 {s}의 결재 서명','이사회 회의록에 {s}의 지시 발언'],wit:['전직 비서 "{s}가 직접 챙겼다"','퇴사한 회계팀장 "{s} 쪽으로 돈이 갔다"'],money:['차명 계좌 출금이 {s} 일정과 겹친다','페이퍼컴퍼니 대표가 {s}의 지인'],site:['{s} 별장에서 서류 상자가 실려 나갔다','{s} 사무실 파쇄기가 밤새 돌았다']}},
 {k:'court',t:'재판 거래 의혹',subj:'법원',S:['고법 부장판사','대형 로펌 대표','법원행정처 간부','브로커 변호사'],C:{doc:['판결문 초안이 선고 전에 {s} 쪽으로 넘어간 흔적','법원 내부 문건에 {s}의 메모'],wit:['재판연구원 "{s}가 결론을 정해 왔다"','사무장 "{s} 이름이 자주 나왔다"'],money:['{s} 가족 계좌로 자문료가 들어갔다','골프장 예약 기록에 {s}가 반복된다'],site:['{s}와 로펌 관계자가 같은 식당에서 나왔다','{s} 차량이 밤늦게 로펌 주차장에 섰다']}},
 {k:'donate',t:'불법 정치후원금 의혹',subj:'국회',S:['여당 중진 의원','의원 보좌관','건설사 회장','후원회장'],C:{doc:['후원금 쪼개기 명단을 {s}가 관리했다','공천 직전 {s} 명의의 차용증'],wit:['전직 비서관 "{s}가 현금을 받았다"','운전기사 "{s}를 태우고 돈가방을 날랐다"'],money:['쪼개기 후원 계좌가 {s} 쪽으로 모인다','{s} 관련 법인의 수상한 용역비'],site:['{s} 사무실에서 쇼핑백이 오갔다','{s} 지역구 행사장에 같은 업체 차량']}},
 {k:'labor',t:'공장 산재 은폐 의혹',subj:'공장',S:['공장장','원청 안전팀장','하청 대표','노동청 감독관'],C:{doc:['사고 보고서 원본에 {s}의 수정 지시','점검표 서명이 {s} 필체로 바뀌었다'],wit:['동료 노동자 "{s}가 입단속을 시켰다"','구급대원 "{s}가 신고를 늦췄다"'],money:['유족 합의금이 {s} 쪽 계좌에서 나갔다','{s}에게 간 상품권 묶음'],site:['사고 현장 CCTV가 {s} 지시로 꺼졌다','{s}가 사고 직후 현장을 치웠다']}}];
const D_POL=['pol','diplo','city'],D_ECO=['eco','ind','fin','stock','estate','it'],D_NEWS=['pol','soc','court','case','inv','eco','ind','nat','city','loc','sigun'];
function oDepts(o){o=o||OUT();return (o&&o.depts)||[];}
function oHas(ds,o){return oDepts(o).some(d=>ds.includes(d));}
// 내가 정치권과 닿는 자리인가: 매체에 정치 부서가 있고, 내가 그쪽 부서이거나 데스크급이거나 대표
function polOK(){if(!oHas(D_POL))return false;return S.founder||S.rank>=3||D_POL.concat(['soc','court','nat','eco']).includes(S.dept);}
CASE_DEF.forEach(d=>{d.ds={slush:D_ECO.concat(['soc','inv','court']),court:['court','soc','pol','inv','case'],donate:['pol','city','inv'],labor:['soc','ind','loc','nat','sigun','city','inv','case']}[d.k];});
CASE_DEF.push(
 {k:'entpay',ds:['ent','cul','culspo'],t:'대형 기획사 정산 비리 의혹',subj:'기획사',S:['기획사 대표','대표의 친척 이사','매니지먼트 본부장','외부 투자사 대표'],C:{doc:['정산서 원본에 {s}의 수정 지시','계약서 부속 조항에 {s}의 서명'],wit:['전 소속 가수 "{s}가 정산을 막았다"','전 매니저 "{s}에게 현금이 갔다"'],money:['해외 공연 수익이 {s} 쪽 법인으로 빠졌다','{s} 가족 회사로 용역비가 나갔다'],site:['{s} 사무실에서 장부 상자가 실려 나갔다','{s}가 새벽에 회계사를 만났다']}},
 {k:'fix',ds:['spo','base','foot','culspo'],t:'프로 경기 승부조작 의혹',subj:'구단',S:['구단 단장','감독','에이전트','불법 도박 사이트 운영자'],C:{doc:['경기 전날 메신저 기록에 {s}의 지시','선수 계약 부속 문서에 {s}의 이름'],wit:['2군 선수 "{s}가 져 달라고 했다"','전 코치 "{s} 쪽에서 돈이 왔다"'],money:['도박 사이트 수익이 {s} 지인 계좌로 들어갔다','{s} 명의 차명 계좌에 경기 당일 입금'],site:['{s}가 경기 전날 호텔에서 낯선 사람을 만났다','{s} 차량이 도박장 주차장에 섰다']}},
 {k:'exam',ds:['edu'],t:'입시 비리 의혹',subj:'대학',S:['사립대 총장','입학처장','재단 이사장','입시 브로커'],C:{doc:['면접 점수표에 {s}의 수정 흔적','합격자 명단 메모에 {s}의 필체'],wit:['면접위원 "{s}가 특정 학생을 챙기라 했다"','탈락 학부모 "{s} 쪽에 돈을 냈다는 말을 들었다"'],money:['발전기금 입금이 {s} 쪽 법인과 겹친다','{s}에게 간 상품권 묶음'],site:['{s}가 입시 기간에 학부모를 따로 만났다','{s} 사무실 파쇄기가 밤새 돌았다']}},
 {k:'trial',ds:['med'],t:'임상시험 데이터 조작 의혹',subj:'제약사',S:['제약사 연구소장','대학병원 교수','임상대행사 대표','심사 공무원'],C:{doc:['임상 원자료에 {s}의 수정 지시','심사 보고서 초안에 {s}의 메모'],wit:['연구원 "{s}가 부작용 사례를 빼라 했다"','간호사 "{s}가 환자 기록을 바꿨다"'],money:['연구비가 {s} 가족 회사로 흘렀다','{s}에게 간 자문료가 수상하다'],site:['{s}가 심사 직전 제약사 임원과 식사했다','{s} 연구실 서버가 밤에 꺼졌다']}});
function caseDefs(){const own=[S.dept];const mine=CASE_DEF.filter(d=>d.ds.some(x=>own.includes(x)));if(mine.length)return mine;return CASE_DEF.filter(d=>d.ds.some(x=>oDepts().includes(x)));}
const LEADS={doc:['문서 추적','내부 문건을 찾는다 · 믿을 만하다 · 컨디션↓',.8,5],wit:['증인 접촉','사람을 만난다 · 엇갈린 말이 섞인다',.6,4],money:['돈 흐름 추적','계좌와 법인을 판다 · 데이터 능력이 높을수록 정확',.85,4],site:['현장 잠입','직접 본다 · 들킬 수 있다 · 컨디션↓↓',.75,10]};
function caseNew(){const D=pick(caseDefs().length?caseDefs():CASE_DEF);const f=filler(vars());const corp=f('{corp}');const S0=shuffle(D.S.slice()).map(n=>({n:rname().slice(0,3),r:n,cul:0,her:0,w:0}));S0[0].cul=1;S0[1].her=1;const sus=shuffle(S0);
  return{k:D.k,title:D.t.replace('{corp}',corp),subj:D.subj.replace('{corp}',corp),sus,clues:[],heat:R(5,20),t0:S.turn,n:0,fake:0};}
function caseCan(){return !S.story&&caseDefs().length>0&&(S.founder||S.rank>=1&&S.rank<=5)&&!S.cs&&S.turn-(S.csT??-999)>=YW*1.5&&(S.turn>=YW*.5||years()>=2);}
function caseOffer(){const C=caseNew();openModal('사건 파일이 열렸다',`<p class="lede">익명의 우편물이 왔다. 「${esc(C.title)}」. 안에는 이름 넷이 적힌 메모 한 장.</p><p class="keep">${C.sus.map(s=>`<b>${esc(s.n)}</b> ${esc(s.r)}`).join(' · ')}</p><p class="hint">이 가운데 진짜 몸통이 있다. 판마다 진실이 다르다. 단서를 모아 몸통을 지목해 터뜨리면 대특종, 틀리면 대형 소송이다. 경쟁사도 냄새를 맡았다.</p>`,[
   {label:'사건을 맡는다',sub:'몇 달짜리 추적 · 사건 파일 업무가 열린다',fn:()=>{S.cs=C;log(`사건 파일: ${C.title}`);toast('사건 파일을 열었다');}},
   {label:'넘긴다',sub:'다른 기자에게 간다',fn:()=>{S.csT=S.turn;toast('우편물을 탐사팀에 넘겼다');}}]);}
function caseSusW(i){const C=S.cs;return C.clues.filter(c=>c.who===i).reduce((a,c)=>a+c.rel,0);}
function caseAct(){const C=S.cs;if(!C){openModal('사건 파일','<p>지금 쫓는 사건이 없다.</p>');return;}const D=CASE_DEF.find(x=>x.k===C.k);
  const sus=C.sus.map((s,i)=>{const w=caseSusW(i);return `<div class="mgk"><span style="flex:0 0 150px"><b>${esc(s.n)}</b> <small style="color:var(--mute)">${esc(s.r)}</small></span><div class="mgbar"><i style="width:${Math.min(100,w*22)}%;background:var(--sodium)"></i></div><span class="mgs" style="font-size:12px">${C.clues.filter(c=>c.who===i).length}</span></div>`;}).join('');
  const cl=C.clues.slice(-5).reverse().map(c=>`<li class="${c.rel>=.75?'g':''}">${esc(c.t)} <small style="color:var(--mute)">(${c.src} · 믿을 만함 ${Math.round(c.rel*100)}%)</small></li>`).join('');
  openModal(`사건 파일 · ${C.title}`,`<p class="hint">경쟁사 추격 ${Math.round(C.heat)}/100 · 단서 ${C.clues.length}개 · 100이 되면 경쟁사가 먼저 쓴다</p>${sus}${cl?`<ul class="feed" style="margin-top:8px">${cl}</ul>`:''}`,
   Object.keys(LEADS).map(k=>({label:LEADS[k][0],sub:LEADS[k][1],fn:()=>{spend(1,LEADS[k][3]);caseLead(k,D);return false;}}))
   .concat([{label:'몸통을 지목해 터뜨린다',risk:true,sub:C.clues.length<3?'단서가 너무 적다 · 위험':'맞으면 대특종 · 틀리면 대형 소송',fn:()=>{casePub();return false;}},{label:'사건을 접는다',cls:'ghost',fn:()=>{S.cs=null;S.csT=S.turn;toast('사건 파일을 덮었다');}}]));}
function caseLead(k,D){const C=S.cs;C.n++;C.heat=Math.min(100,C.heat+R(2,5));const cul=C.sus.findIndex(s=>s.cul),her=C.sus.findIndex(s=>s.her);
  let rel=LEADS[k][2];if(k==='money')rel=clamp(rel-.15+S.st.dat/300,.5,.92);if(k==='wit')rel=clamp(rel+S.st.int/400,.5,.75);if(k==='doc')rel=clamp(rel+S.st.inv/500,.6,.9);
  const truth=chance(rel);let who=truth?cul:(chance(k==='wit'?.6:.45)?her:pick([0,1,2,3].filter(i=>i!==cul)));
  if(C.fake>0&&chance(.5)){C.fake--;who=her;rel=Math.min(.9,rel+.05);}// 몸통이 흘린 역정보 — 믿을 만해 보인다
  const nm=`${C.sus[who].n} ${C.sus[who].r}`;const t=pick(D.C[k]).replace('{s}가',jo2(nm,'이','가')).replace('{s}를',jo2(nm,'을','를')).replace('{s}와',jo2(nm,'과','와')).replace('{s}는',jo2(nm,'은','는')).replace('{s}',nm);C.clues.push({t,who,rel:+rel.toFixed(2),src:LEADS[k][0]});
  if(k==='site'&&chance(.2)){C.heat=Math.min(100,C.heat+10);toast('잠입하다 들킬 뻔했다. 상대가 경계하기 시작했다');}
  caseCounter();caseAct();}
// 몸통의 반격 (AI): 의심이 자기에게 쏠리면 회유·협박·광고 압박·역정보로 맞선다
function caseCounter(){const C=S.cs;if(!C)return;const cul=C.sus.findIndex(s=>s.cul);const w=caseSusW(cul),tot=C.sus.reduce((a,s,i)=>a+caseSusW(i),0)||1;if(w/tot<.4||C.cnt>=(S.simple?2:3)||!chance(S.simple?.25:.35))return;C.cnt=(C.cnt||0)+1;const s=C.sus[cul];const kind=pick(['bribe','threat','ad','fake']);
  Q.push(()=>{if(S.cs!==C){closeModal();return;}if(kind==='fake'){C.fake=(C.fake||0)+2;openModal('누군가 흘린 정보',`<p class="lede">출처가 불분명한 자료가 들어왔다. 다른 사람을 가리키는, 지나치게 깔끔한 자료다.</p><p class="hint">몸통이 역정보를 흘리고 있을 수 있다. 다음 단서 몇 개는 의심해 보자.</p>`);return;}
   if(kind==='bribe')openModal('회유',`<p class="lede">${esc(s.n)} ${esc(s.r)} 측근이 찾아왔다. "기자님, 이 정도면 되겠습니까." 봉투가 두툼하다.</p>`,[{label:'받고 덮는다',risk:true,sub:'돈↑ · 사건 끝 · 타협 쪽으로 · 새어 나가면 윤리 논란',fn:()=>{S.money+=300;valN('ind',-10,'사건을 덮는 대가로 돈을 받았다');S.pending.push({type:'ethic',why:'취재 대상에게 돈을 받고 기사를 덮었다는 의혹',title:C.title,due:S.turn+R(8,24)});S.cs=null;S.csT=S.turn;}},{label:'돌려보낸다',sub:'독립 쪽으로 · 상대가 누군지 감이 왔다',fn:()=>{valN('ind',4,'회유를 거절했다');C.clues.push({t:`${s.n} ${s.r} 측이 회유하러 왔다`,who:cul,rel:.7,src:'회유 시도'});}}]);
   if(kind==='threat')openModal('협박',`<p class="lede">밤늦게 모르는 번호로 문자가 왔다. "가족 생각도 하셔야죠."</p>`,[{label:'멈추지 않는다',sub:'멘탈↓ · 컨디션↓',fn:()=>{gain('men',-2);S.hp=clamp(S.hp-8,0,100);toast('잠이 오지 않는다');}},{label:'경찰에 신고하고 기사에 넣는다',sub:'단서 하나 · 상대도 바짝 긴장한다',fn:()=>{C.clues.push({t:`협박 문자 발신지가 ${s.n} ${s.r} 주변으로 좁혀진다`,who:cul,rel:.65,src:'협박 추적'});C.heat=Math.min(100,C.heat+8);}}]);
   if(kind==='ad')openModal('윗선의 호출',`<p class="lede">${S.founder?'광고국장':'국장'}이 불렀다. "그 건, ${esc(C.subj)} 쪽에서 광고 얘기가 나왔어. 무리하지 마."</p>`,[{label:'계속 판다',sub:S.founder?'광고 일부 잃음':'윗선 관계↓',fn:()=>{const bs=colBy('boss');if(bs&&!S.founder)relUp(bs,-4,'사건 강행');if(S.founder)try{S.co.cash-=.1;}catch(e){}}},{label:'속도를 늦춘다',sub:'경쟁사 추격↑',fn:()=>{C.heat=Math.min(100,C.heat+15);}}]);});}
function casePub(){const C=S.cs;openModal('누가 몸통인가',`<p class="lede">「${esc(C.title)}」. 한 사람을 지목해 1면에 올린다. 되돌릴 수 없다.</p>`,C.sus.map((s,i)=>({label:`${s.n} ${s.r}`,sub:`단서 ${C.clues.filter(c=>c.who===i).length}개 · 무게 ${caseSusW(i).toFixed(1)}`,fn:()=>{caseEnd(i);return false;}})).concat([{label:'더 판다',cls:'ghost',fn:()=>{caseAct();return false;}}]));}
function caseEnd(i){const C=S.cs;const s=C.sus[i];const cul=C.sus.find(x=>x.cul);S.cs=null;S.csT=S.turn;
  const clip={h:`[단독] ${C.title}…몸통은 ${s.n} ${s.r}`,o:OUT().n,d:cat1(S.dept),q:Math.round(55+Math.min(30,C.clues.length*4)),imp:s.cul?92:60,excl:true,date:dateShort(),turn:S.turn,views:Math.round((OUT().p+1)*R(60,120)*1000),lead:`${C.title}의 몸통이 ${s.n} ${s.r}인 것으로 드러났다.`,by:S.name,place:'1면 톱',portal:''};S.clips.unshift(clip);S.totalArticles=(S.totalArticles||0)+1;tick(`[${OUT().n}] ${clip.h}`,1);
  if(s.cul){S.scoops=(S.scoops||0)+1;S.bigScoops=(S.bigScoops||0)+1;S.tokjong=(S.tokjong||0)+1;ach('scoop');log(`사건 파일 해결 — ${C.title}, 몸통 ${s.n} ${s.r}`);S.caseWin=(S.caseWin||0)+1;S.caseWinT=S.turn;trAfter('caseWin');
    mgFinOrOpen('대특종 — 진실을 맞혔다',`${scoopBanner('대특종')}<p class="lede">몸통은 ${esc(s.n)} ${esc(s.r)}였다. 검찰이 수사에 착수했고, 국회가 청문회를 열겠다고 한다.</p>${fxLine(S.founder?apply({fame:6,trust:3}):apply({fame:6,eval:4,trust:3}))}`);}
  else{const her=s.her;ach('caseMiss');trAfter('caseMiss');S.pending.push({type:'suit',ent:null,who:`${s.n} ${s.r}`,due:S.turn+R(1,3),title:clip.h,wrong:1});log(`사건 파일 오판 — ${s.n} ${jo2(s.r,'을','를')} 지목했다. 진짜 몸통은 ${cul.n} ${cul.r}`);
    mgFinOrOpen('엉뚱한 사람을 지목했다',`<p class="lede">${esc(s.n)} ${jo2(esc(s.r),'은','는')} 몸통이 아니었다.${her?' 누군가 흘린 미끼에 걸렸다.':''} 진짜 몸통은 ${esc(cul.n)} ${esc(cul.r)}. 명예훼손 소송이 날아온다.</p>${fxLine(S.founder?apply({fame:-3,trust:-6}):apply({fame:-3,eval:-4,trust:-6}))}`);}}
function mgFinOrOpen(t,h){Q.unshift(()=>openModal(t,h));closeModal();}
function caseMonth(lines){if(S.cs){const C=S.cs;C.heat=Math.min(100,C.heat+R(5,10)*dk('case'));if(C.heat>=100){lines.push({c:'r',t:`「${C.title}」 — 경쟁사가 먼저 터뜨렸다. 몇 달 동안 쫓던 사건을 놓쳤다`});S.cs=null;S.csT=S.turn;apply(S.founder?{fame:-1}:{eval:-1.5});}else if(S.turn-C.t0>YW&&chance(.3)){lines.push({c:'r',t:`「${C.title}」 — 1년이 넘었다. 데스크가 "언제 쓰냐"고 묻는다`});}return;}
  if(caseCan()&&chance(.18))Q.push(caseOffer);}
function caseBox(){const C=S.cs;if(!C)return '';return `<div class="card"><div class="t">${ic('search')} 사건 파일 · ${esc(C.title)}</div><p class="hint" style="margin:4px 0 0">용의자 ${C.sus.length}명 · 단서 ${C.clues.length}개 · 경쟁사 추격 ${Math.round(C.heat)}/100 · 할 일의 「사건 파일」에서 추적한다</p></div>`;}

// ---- 어두운 길: 어용·기레기·정치 유착 ----
const ROUTE={gov:{up:'정부 단독 자료가 매달 들어온다 · 집권 진영 매체면 평가가 쑥쑥 오른다',down:'신뢰가 깎이고 독립성이 무너진다 · 정권이 바뀌면 끈 떨어진 연이 된다',n:'어용의 길',who:'권력의 나팔수',lv:['출입처의 귀빈','정부의 스피커','정권의 입'],end:'정권의 입 · 대변인',fall:'어용 기자의 몰락'},
 gire:{up:'조회수와 출고량이 폭발한다 · 매체 지표가 쉽게 채워진다',down:'신뢰가 가장 빨리 깎인다 · 포털 제재와 정정보도가 따라온다',n:'기레기의 길',who:'클릭 장사꾼',lv:['실검 사냥꾼','어뷰징 공장장','클릭의 제왕'],end:'클릭 공장장',fall:'언론계 퇴출'},
 poli:{up:'매달 뒷돈과 정치권 단독이 들어온다 · 끝까지 가면 국회의원',down:'노출 위험이 가장 빨리 쌓인다 · 들키면 검찰 수사',n:'유착의 길',who:'정치권의 그림자',lv:['의원실 단골','캠프의 펜','공천 대기'],end:'기자 출신 국회의원',fall:'게이트 연루'}};
function routeOffer(lines){if(S.route||S.story||S.rank<1||S.turn-(S.routeT??-999)<YW||!chance(.12+Math.min(.25,rAffTop()/80)))return;{const F=S.rAff||{};const g=goodOfferW()+((F.watch||0)+(F.voice||0)+(F.rfact||0))/10,d=darkOfferW()+((F.gov||0)+(F.gire||0)+(F.poli||0)+(F.agit||0)+(F.hire||0))/10;if(chance(g/(g+d))){goodOffer();return;}}const V=valS();const o=OUT();const w=S.world||{ruling:'cons'};
  const c=[];const pk=polOK();if(pk&&(V.ind<=-5||o.lean===w.ruling||oidOf()==='gov'||chance(.35)))c.push('gov');if(V.pb<=-5||['online','sports','ent'].includes(o.type)||oidOf()==='click'||o.p<=2||chance(.35))c.push('gire');if(pk&&(V.ind<=-5||S.rank>=2||chance(.35)))c.push('poli');if((oHas(D_POL)||S.spec2&&S.spec2.k==='col')&&(V.pb<=-5||V.ind<=-5||chance(.3)))c.push('agit');if(V.ind<=-5||['corp','industry','fandom','lord'].includes(oidOf())||chance(.3))c.push('hire');if(!c.length)c.push(pk?pick(['gov','gire','poli']):'gire');const k=rAffPick(c);
  const msg={gov:`대통령실 홍보라인에서 연락이 왔다. "정부 자료는 기자님께 먼저 드리겠습니다. 대신 기사 방향은 저희와 맞춰 주시죠."`,gire:`디지털국장이 불렀다. "실검 대응팀 맡아. 하루 스무 꼭지, 확인은 나중에. 조회수만 나오면 다 덮어 줄게."`,poli:`${pick(['여당','야당'])} 중진 의원실 보좌관이 저녁을 샀다. "의원님이 기자님을 좋게 보세요. 서로 도우면 좋잖아요."`,agit:`유튜브 시사 채널 PD가 연락해 왔다. "기자님 기사, 우리 시청자들이 열광해요. 매주 생방송 한 번만 나와 주세요. 후원금은 나눠 드립니다."`,hire:`홍보대행사 실장이 커피를 샀다. "기사 한 건에 이 정도 드립니다. 광고국에도 실적으로 잡히게 해 드릴게요."`}[k];
  S.routeT=S.turn;Q.push(()=>openModal(`${ROUTE[k].n} — 제안`,`<p class="lede">${esc(msg)}</p><p class="hint"><span style="color:var(--good)">이점</span> ${ROUTE[k].up}<br><span style="color:var(--red)">단점</span> ${ROUTE[k].down}<br>끝까지 가면 「${ROUTE[k].end}」, 들키면 「${ROUTE[k].fall}」.</p>`,[
   {label:'손을 잡는다',risk:true,sub:`${ROUTE[k].lv[0]} · 특혜↑ · 신뢰↓ · 노출 위험`,fn:()=>{S.route={k,lv:1,heat:10,t0:S.turn,up:S.turn+YW/2};if(k==='agit'){const l=OUT().lean;S.route.camp=l==='prog'?'prog':l==='cons'||l==='market'?'cons':((S.rep&&S.rep.prog>S.rep.cons)?'prog':'cons');}valN(k==='gire'||k==='agit'?'pb':'ind',-6,`${ROUTE[k].n}에 들어섰다`);log(`${ROUTE[k].n} — ${ROUTE[k].lv[0]}`);toast(`${jo2(ROUTE[k].lv[0],'이','가')} 됐다`);}},
   {label:'거절한다',sub:k==='gire'?'공익 쪽으로':'독립 쪽으로',fn:()=>{valN(k==='gire'?'pb':'ind',4,`${ROUTE[k].n} 제안을 거절했다`);toast('"아쉽네요."');}}]));}
function routeMonth(lines){const Rt=S.route;if(!Rt){routeOffer(lines);if(S.routeHeat>0)S.routeHeat=Math.max(0,S.routeHeat-5);return;}if(ROUTE[Rt.k]&&ROUTE[Rt.k].good){goodMonth(lines);return;}Rt._h0=Rt.heat;const L=Rt.lv,o=OUT(),w=S.world||{ruling:'cons'};
  if(Rt.k==='gov'){const it=makeItem(S.dept,{excl:true,pre:2,mult:.9+.1*L});it.src='정부 관계자';S.items.push(it);const fit=o.lean===w.ruling?1:.4;lines.push({c:'',t:`어용의 길 — 정부가 자료를 먼저 줬다 → 「${it.title}」 · ${apply(S.founder?{trust:-.6*L}:{eval:.6*L*fit,trust:-.6*L})}`});Rt.heat+=3*L;valN('ind',-1.5);}
  if(Rt.k==='gire'){const v=Math.round((o.p+1)*R(20,40)*1000*L);const K=km();K.pv=(K.pv||0)+v;K.pub=(K.pub||0)+L;try{if(chance(.3))portalPen(1,'어뷰징');}catch(e){}lines.push({c:'',t:`기레기의 길 — 받아쓰기 ${L*8}꼭지, 조회수 ${v.toLocaleString('ko-KR')} · ${apply(S.founder?{fame:.4*L,trust:-.9*L}:{eval:.7*L,trust:-.9*L})}`});Rt.heat+=4*L;valN('pb',-2);}
  if(Rt.k==='poli'){S.money+=15*L;const it=chance(.5)?makeItem(S.dept,{excl:true,pre:1}):null;if(it){it.src='의원실';S.items.push(it);}lines.push({c:'',t:`유착의 길 — 의원실이 챙겨 줬다 · 돈 +${15*L}만${it?` · 「${it.title}」`:''} · ${apply({trust:-.6*L})}`});Rt.heat+=4*L;valN('ind',-2);}
  if(Rt.k==='agit'){const c=Rt.camp||'cons';repN(c,1.5*L);repN(c==='cons'?'prog':'cons',-1.5*L);S.money+=8*L;lines.push({c:'',t:`선동가의 길 — ${CAMP[c]} 시청자들이 후원금을 보냈다 · 돈 +${8*L}만 · ${apply({fame:.4*L,trust:-.7*L})}`});Rt.heat+=4*L;valN('pb',-1.5);}
  if(Rt.k==='hire'){S.money+=20*L;try{if(S.co){S.adQ=(S.adQ||0)+.03*L;S.adTotal=(S.adTotal||0)+.03*L;}}catch(e){}const bs=!S.founder&&S.rank<=5?colBy('boss'):null;if(bs&&chance(.3))relUp(bs,1,'광고 실적');lines.push({c:'',t:`청부 기사의 길 — 협찬 기사 ${L*2}건 · 돈 +${20*L}만 · ${apply({trust:-.8*L})}`});Rt.heat+=4*L;valN('ind',-2);}
  if(oidOf()==='truth')Rt.heat+=2*L;if(Rt._h0!=null&&Rt.heat>Rt._h0)Rt.heat=Rt._h0+(Rt.heat-Rt._h0)*dk('route');Rt.heat=Math.min(100,Rt.heat);
  if(Rt.heat>=55&&chance((Rt.heat-45)/120)){const what=ROUTE[Rt.k].ex;Rt.heat=Math.max(30,Rt.heat-20);
    Q.push(()=>openModal(what,`<p class="lede">${ROUTE[Rt.k].exL}</p>`,[
     {label:'버틴다',sub:'신뢰↓↓ · 길은 이어진다',fn:()=>{toast(apply({trust:-6,fame:-2}));}},
     {label:'손을 씻는다',sub:'길이 끝난다 · 신뢰 조금 회복',fn:()=>{routeQuit();toast(apply({trust:-3}));}}]));}
  if(Rt.heat>=95&&chance(.35)){const k=Rt.k;Q.push(()=>openModal(ROUTE[k].fall,`<p class="lede">${ROUTE[k].fallL}</p>`,[{label:'받아들인다',fn:()=>{ending(ROUTE[k].fall);return false;}}]));return;}
  if(S.turn>=Rt.up&&L<3){Q.push(()=>openModal(`${ROUTE[Rt.k].n} — 더 깊이`,`<p class="lede">${esc(jo2(ROUTE[Rt.k].lv[L],'이','가'))} 될 기회다. 특혜는 커지고, 노출 위험도 커진다.</p>`,[{label:'더 깊이 간다',risk:true,sub:`${ROUTE[Rt.k].lv[L]}`,fn:()=>{Rt.lv++;Rt.up=S.turn+YW/2;Rt.heat+=8;if(Rt.lv>=3)trAfter('routeTop');log(`${ROUTE[Rt.k].n} — ${ROUTE[Rt.k].lv[Rt.lv-1]}`);}},{label:'여기서 멈춘다',sub:'지금 단계 유지',fn:()=>{Rt.up=S.turn+YW;}},{label:'손을 씻는다',cls:'ghost',fn:()=>{routeQuit();}}]));}
  if(L>=3&&Rt.heat<80&&chance(.12)&&(S.founder||S.rank>=2)){const k=Rt.k;Q.push(()=>openModal(ROUTE[k].end,`<p class="lede">${ROUTE[k].endL}</p>`,[{label:'받아들인다 (커리어 마무리)',sub:'이 길의 끝 엔딩',fn:()=>{ending(ROUTE[k].end);return false;}},{label:'아직은 기자로 남는다',cls:'ghost'}]));}}
function routeQuit(){if(!S.route)return;if(S.route.good){log(`${jo2(ROUTE[S.route.k].n,'을','를')} 내려놓았다`);S.route=null;S.routeT=S.turn;return;}S.routeHeat=S.route.heat;log(`${ROUTE[S.route.k].n}에서 손을 씻었다`);ach('routeOut');trAfter('routeQuit');S.route=null;S.routeT=S.turn;}
function routeRegime(old){const Rt=S.route;try{oidRegime2();}catch(e){}if(Rt&&Rt.k==='watch'){Rt.heat=Math.max(0,Rt.heat-20);return;}if(!Rt||Rt.k!=='gov')return;Q.push(()=>openModal('정권이 바뀌었다',`<p class="lede">어제까지 자료를 주던 사람들이 하루아침에 사라졌다. 새 정부는 나를 "전 정권의 스피커"로 기억한다.</p>`,[
   {label:'새 정권에 줄을 선다',risk:true,sub:'길은 이어진다 · 노출 위험↑↑ · 신뢰↓',fn:()=>{Rt.heat=Math.min(100,Rt.heat+30);apply({trust:-4});}},
   {label:'손을 씻고 비판 기사를 쓴다',sub:'길이 끝난다 · 독립 쪽으로',fn:()=>{routeQuit();valN('ind',6,'정권이 바뀌자 비판 기자로 돌아섰다');apply(S.founder?{fame:-1}:{eval:-2});}}]));}
function routeBox(){const Rt=S.route;if(!Rt)return '';const D=ROUTE[Rt.k],G=!!D.good;return `<div class="card" style="border-color:${G?'rgba(90,212,155,.4)':'rgba(255,111,97,.35)'}"><div class="t">${rtImg(Rt.k,'xs')||ic(G?'flag':'moon')} ${D.n} · ${esc(D.lv[Rt.lv-1])}</div><div class="mgk"><span style="flex:0 0 70px;font-size:12.5px">${G?(Rt.k==='watch'?'권력의 압박':Rt.k==='voice'?'소진':'고립'):'노출 위험'}</span><div class="mgbar"><i style="width:${Rt.heat}%;background:${G?'var(--sodium)':'var(--red)'}"></i></div><span class="mgs" style="font-size:12px">${Math.round(Rt.heat)}</span></div><p class="hint" style="margin:4px 0 6px"><span style="color:var(--good)">이점</span> ${D.up}<br><span style="color:var(--red)">단점</span> ${D.down}<br>끝까지 가면 「${D.end}」${D.fall?`, ${G?'꺾이면':'들키면'} 「${D.fall}」`:''}.</p><button type="button" class="btn" onclick="routeQuit();render();">${G?'이 길을 내려놓는다':'손을 씻는다'}</button></div>`;}

// ---- 신세 경제: 정보에는 빚이 따른다 ----
function debtMonth(lines){if(S.simple&&!chance(.4))return;const L=(S.sources||[]).filter(s=>(s.debt||0)>=2);if(!L.length||!chance(.22))return;const s=pick(L);
  const ask=pick([['기사에서 우리 쪽 얘기는 좀 빼 주세요','관련 기사에서 그쪽 이름을 뺀다'],['조카가 이번에 입사 지원했는데, 한마디만…','인사 청탁을 전한다'],['우리 행사 좀 크게 써 주세요','홍보성 기사를 쓴다'],['경쟁 회사 약점 좀 써 주시면 자료 더 드릴게요','청탁받은 비판 기사를 쓴다']]);
  Q.push(()=>openModal('신세를 갚을 때',`<p class="lede">${esc(s.name)} ${esc(s.role)}: "그동안 드린 게 좀 되죠? ${esc(ask[0])}."</p><p class="hint">이 사람에게 진 신세 ${s.debt}. 빚이 많을수록 거절하기 어렵다.</p>`,[
   {label:'들어준다',sub:`${ask[1]} · 신세 정리 · 취재원 신뢰↑ · 신뢰↓ · 새어 나가면 윤리 논란`,fn:()=>{s.debt=0;s.trust=clamp(s.trust+10,0,100);valN('ind',-4,'취재원 청탁을 들어줬다');apply({trust:-1.5});if(chance(.15))S.pending.push({type:'ethic',why:'취재원 청탁을 들어줬다는 의혹',title:ask[1],due:S.turn+R(6,18)});toast('신세를 갚았다. 마음이 무겁다');}},
   {label:'거절한다',sub:'신세는 반만 줄고 취재원 신뢰↓ · 독립 쪽으로',fn:()=>{s.debt=Math.floor(s.debt/2);s.trust=clamp(s.trust-15,0,100);valN('ind',3,'취재원 청탁을 거절했다');ach('debt');if(s.trust<10){S.sources=S.sources.filter(x=>x!==s);toast(`${s.name}와의 연락이 끊겼다`);}else toast('"섭섭하네요."');}}]));}
function debtTot(){return (S.sources||[]).reduce((a,s)=>a+(s.debt||0),0);}

// ---- 법정 공방: 소송은 세 번의 수 싸움 ----
function courtEvent(p){const E=ENT[p.ent]||{n:p.who||entName(p.ent),w:.1,kind:'person'};const who=p.who||E.n;const clip=(S.clips||[]).find(c=>c.h===p.title)||{q:55,imp:40};
  const fk=(typeof facK==='function')?facK():{legal:1};const isPros=who==='검찰';
  const C={me:0,op:0,r:0,who,ev:clip.q,amt:R(3,30),pow:clamp((E.w||.1)*2+(E.kind==='corp'?.4:E.kind==='gov'?.5:.2),.2,1.4)*fk.legal*dk('court')*(isPros?1.2:1),used:{},log:[]};
  if(p.wrong){C.ev=28;C.pow+=.6;}S.court=C;courtRound(p);}
const COURT_ME={doc:['취재 자료를 낸다','녹취·문건 · 기사 완성도가 높을수록 세다'],wit:['증인을 세운다','취재원이 법정에 선다 · 취재원 신뢰가 높을수록 세다 · 그 취재원은 노출된다'],pr:['여론전을 편다','보도의 공익성을 알린다 · 이름값이 클수록 세다 · 역풍을 맞을 수 있다'],deal:['합의한다','정정보도와 합의금 · 여기서 끝난다']};
const COURT_OP=[['대형 로펌을 붙였다','law'],['기사 속 사실 하나를 반박했다','rebut'],['광고를 끊겠다고 압박했다','ad'],['내 과거 기사의 흠을 들췄다','dirt'],['역고소 카드를 꺼냈다','counter']];
function courtOp(){const C=S.court;// AI: 지고 있으면 판을 흔들고, 이기고 있으면 굳힌다
  let pool=COURT_OP.slice();if(C.me>C.op)pool=pool.filter(x=>x[1]!=='law');else pool=pool.filter(x=>x[1]!=='dirt');if(S.founder||S.rank===0)pool=pool.filter(x=>x[1]!=='ad');if(!(S.clips||[]).some(c=>c.fl))pool=pool.filter(x=>x[1]!=='dirt');
  const o=pick(pool);let v=R(14,26)*C.pow;if(o[1]==='law')v*=1.25;if(o[1]==='rebut'&&C.ev<55)v*=1.3;if(o[1]==='dirt')v*=1.2;return{n:o[0],k:o[1],v:Math.round(v)};}
function courtRound(p){const C=S.court;C.r++;const op=courtOp();C.op+=op.v;C.log.push(`상대 — ${op.n} (${op.v})`);
  if(op.k==='ad'){const bs=colBy('boss');if(bs)relUp(bs,-2,'소송 상대의 광고 압박');}
  const src=(S.sources||[]).slice().sort((a,b)=>b.trust-a.trust)[0];
  const ch=[{k:'doc',v:Math.round((C.ev-30)*.7+R(-6,6))},{k:'wit',v:src?Math.round(src.trust*.45+R(-5,8)):0,dis:!src||C.used.wit},{k:'pr',v:Math.round(10+(S.fame||0)*.35+R(-8,8)),dis:C.used.pr},{k:'deal'}];
  openModal(`법정 공방 · ${C.r}라운드`,`<p class="lede">${C.r===1?`${esc(C.who)} 측이 「${esc(p.title)}」 보도로 ${C.amt}억 원 손해배상 소송을 냈다.${S.fac&&S.fac.pros>70?' 검찰 힘이 센 시기라 상대가 기세등등하다.':''}`:`공방이 이어진다.`}</p><p>${C.log.slice(-3).map(esc).join('<br>')}</p><div class="mgk"><span style="flex:0 0 40px;font-size:12.5px">나</span><div class="mgbar"><i style="width:${Math.min(100,C.me)}%;background:var(--good)"></i></div><span class="mgs">${C.me}</span></div><div class="mgk"><span style="flex:0 0 40px;font-size:12.5px">상대</span><div class="mgbar"><i style="width:${Math.min(100,C.op)}%;background:var(--red)"></i></div><span class="mgs">${C.op}</span></div><p class="hint">세 라운드가 끝났을 때 내 점수가 높으면 이긴다. 같은 카드는 증인·여론전만 한 번씩.</p>`,
   ch.map(c=>({label:COURT_ME[c.k][0],sub:COURT_ME[c.k][1],disabled:!!c.dis,risk:c.k==='pr',fn:()=>{courtPlay(p,c,src);return false;}})));}
function courtPlay(p,c,src){const C=S.court;if(c.k==='deal'){courtEnd(p,'deal');return;}
  let v=Math.max(0,c.v);if(c.k==='wit'){C.used.wit=1;if(src){src.trust=clamp(src.trust-12,0,100);src.debt=(src.debt||0)+2;}}if(c.k==='pr'){C.used.pr=1;if(chance(.3)){v=Math.round(v*.4);C.log.push('나 — 여론전이 역풍을 맞았다');}repN&&repN('read',1);}
  C.me+=v;C.log.push(`나 — ${COURT_ME[c.k][0]} (${v})`);if(C.r>=3)courtEnd(p,C.me>=C.op?'win':'lose');else courtRound(p);}
function courtEnd(p,res){const C=S.court;S.court=null;const n=C.who;let h='',fx;
  if(res==='win'){fx=apply({trust:3,fame:2});h=`<p class="lede">재판부가 보도의 공익성과 진실성을 인정했다. ${esc(n)} 측 청구 기각.</p>`;log(`${n} 측 소송 — 승소`);S.courtWin=(S.courtWin||0)+1;try{const f=facOf({title:p.title});if(f)facN(f,-2);}catch(e){}}
  else if(res==='lose'){S.co.cash-=.3;fx=apply(S.founder?{trust:-4,fame:-2}:{trust:-4,eval:-3});h=`<p class="lede">일부 패소. 손해배상 일부와 정정보도 판결이 나왔다.</p>`;log(`${n} 측 소송 — 일부 패소`);trAfter('courtLose');}
  else{S.co.cash-=.1;if(p.ent)netUp(p.ent,25);fx=apply(S.founder?{trust:-3}:{trust:-3,eval:-1});h=`<p class="lede">정정보도문을 싣고 합의했다. 싸움은 끝났지만 기자들 사이에서 말이 돈다.</p>`;log(`${n} 측 소송 — 합의`);}
  Q.unshift(()=>openModal(res==='win'?'승소':res==='lose'?'패소':'합의',`${h}<p>${C.log.map(esc).join('<br>')}</p>${fxLine(fx)}`));closeModal();}

// ---- 전문성 트리 ----
const SPEC2={data:{n:'데이터 저널리즘',act:'데이터 분석',d:'공공데이터를 긁어 숫자 속 기사를 찾는다',up:'데이터 각도 기사 완성도↑ · 확인된 사실이 붙은 아이템'},
 inv:{n:'탐사보도',act:'장기 탐사',d:'몇 달짜리 사건을 판다',up:'사건 파일이 자주 열리고 단서가 정확해진다'},
 anchor:{n:'방송·앵커',act:'방송 출연',d:'패널·앵커로 얼굴을 알린다',up:'이름값↑ · 여론전에 강해진다'},
 col:{n:'칼럼니스트',act:'기명 칼럼',d:'내 이름을 건 논평을 쓴다',up:'진영 평판을 움직인다 · 이름값↑'},
 repo:{n:'르포',act:'현장 르포',d:'현장에서 며칠씩 머문다',up:'임팩트 큰 현장 아이템 · 완성도↑'}};
function spec2Lv(){return S.spec2?S.spec2.lv:0;}
function spec2XP(v){const P=S.spec2;if(!P)return;if(D_SPEC[P.k].includes(S.dept))v*=1.5;P.xp+=v;const need=[0,8,20,40][P.lv];if(P.lv<4&&need&&P.xp>=need){P.lv++;log(`전문성 — ${SPEC2[P.k].n} ${P.lv}단계`);toast(`${SPEC2[P.k].n} ${P.lv}단계`);}}
function spec2Month(lines){if(S.spec2||S.specAsk||!spec2Can())return;S.specAsk=1;Q.push(()=>spec2Pick());}
function spec2Can(){return !S.story&&!S.spec2&&(S.founder||S.rank>=1)&&(years()>=2||S.rank>=2);}
function spec2Pick(){openModal('전문 분야를 정한다','<p class="lede">기자 생활 몇 해, 이제 나만의 무기가 필요하다. 하나를 고르면 그 길로 깊어진다.</p>',Object.keys(SPEC2).map(k=>({label:SPEC2[k].n,sub:`${SPEC2[k].d} · 이점: ${SPEC2[k].up} · 단점: ${SPEC2[k].down}`,fn:()=>{S.spec2={k,xp:0,lv:1,t0:S.turn};log(`전문 분야: ${SPEC2[k].n}`);render();}})).concat([{label:'나중에',cls:'ghost'}]));}
function spec2Act(){const P=S.spec2;if(!P){spec2Pick();return;}const L=P.lv;
  if(P.k==='data'){spend(1,4);gain('dat',.8);const it=makeItem(S.dept,{pre:L>=3?2:1,mult:1+.04*L,excl:chance(.12+.06*L)});it.src='공공데이터';it.data=1;S.items.push(it);spec2XP(2);openModal('데이터 분석',`<p class="lede">공공데이터 수십만 줄을 돌렸다. 숫자 하나가 튀었다 → 「${esc(it.title)}」</p><p class="hint">확인된 사실 ${L>=3?'두':'한'} 개가 붙은 채로 시작한다. 데이터 각도로 쓰면 완성도가 더 오른다.</p>`);}
  else if(P.k==='inv'){spend(1,5);gain('inv',.8);spec2XP(2);if(!S.cs&&L>=2&&caseDefs().length&&chance(.35+.1*L)){S.csT=-999;caseOffer();return;}if(S.cs){S.cs.heat=Math.max(0,S.cs.heat-6-2*L);openModal('장기 탐사',`<p class="lede">사건 파일을 다시 정리했다. 경쟁사보다 한발 앞섰다 (추격 ${Math.round(S.cs.heat)}).</p>`);return;}const it=makeItem(S.dept,{excl:true,mult:1.1+.05*L});it.src='탐사';S.items.push(it);openModal('장기 탐사',`<p class="lede">몇 주를 파고든 끝에 → 「${esc(it.title)}」</p>`);}
  else if(P.k==='anchor'){spend(1,6);gain('cha',.6);spec2XP(2);const fx=apply({fame:.3+.12*L});openModal('방송 출연',`<p class="lede">${isTV()?'메인뉴스 앵커석 옆자리에 앉았다.':'시사 프로그램 패널로 나갔다.'} 시청자 게시판에 내 이름이 오른다.</p>${fxLine(fx)}`);}
  else if(P.k==='col'){spend(1,3);gain('wri',.6);spec2XP(2);const w=S.world||{ruling:'cons'};if(!oHas(D_POL)){openModal('기명 칼럼','<p class="lede">이번 주 칼럼은 어떤 목소리로 쓸까.</p>',[{label:'업계의 관행을 꼬집는다',sub:'독자·언론계 평판↑ · 독립 쪽으로',fn:()=>{repN('read',1+L);repN('ind',1);valN('ind',2);toast(apply({fame:.2+.1*L}));}},{label:'업계 편에 선다',sub:'출입처 관계↑ · 타협 쪽으로',fn:()=>{valN('ind',-2);try{S.sources.forEach(x=>x.trust=clamp(x.trust+2,0,100));}catch(e){}toast(apply({fame:.15+.05*L}));}},{label:'독자의 눈으로 쓴다',sub:'독자 평판↑ · 이름값은 조금',fn:()=>{repN('read',1+L);toast(apply({fame:.15+.05*L,trust:.4}));}}]);return;}openModal('기명 칼럼','<p class="lede">이번 주 칼럼은 어떤 목소리로 쓸까.</p>',[
    {label:'정부를 비판한다',sub:`${CAMP[w.ruling==='cons'?'prog':'cons']} 평판↑ · ${CAMP[w.ruling]} 평판↓ · 독립 쪽으로`,fn:()=>{repN(w.ruling==='cons'?'prog':'cons',2+L);repN(w.ruling,-(1+L));valN('ind',2);toast(apply({fame:.25+.1*L}));}},
    {label:'정부를 옹호한다',sub:`${CAMP[w.ruling]} 평판↑ · 반대 진영 평판↓ · 타협 쪽으로`,fn:()=>{repN(w.ruling,2+L);repN(w.ruling==='cons'?'prog':'cons',-(1+L));valN('ind',-2);toast(apply({fame:.25+.1*L}));}},
    {label:'양쪽 다 꼬집는다',sub:'독자 평판↑ · 이름값은 조금',fn:()=>{repN('read',1+L);repN('ind',1);toast(apply({fame:.15+.05*L,trust:.4}));}}]);}
  else if(P.k==='repo'){spend(2,10);gain('int',.6);gain('sta',.4);spec2XP(3);const it=makeItem(S.dept,{mult:1.2+.08*L,excl:chance(.3+.1*L),keyConf:L>=2});it.src='현장';it.repo=1;S.items.push(it);openModal('현장 르포',`<p class="lede">사흘을 현장에서 먹고 잤다. 사람들이 입을 열었다 → 「${esc(it.title)}」</p>`);}}
function spec2Q(it,W){const P=S.spec2;if(!P)return 0;const L=P.lv;if(P.k==='data')return (W&&W.angle==='da'?2:.5)*L;if(P.k==='repo')return (it.repo||W&&(W.angle==='re'||W.angle==='hu')?1.6:.4)*L;if(P.k==='inv')return it.excl?1.4*L:L*.3;if(P.k==='col')return L*.6;if(P.k==='anchor')return isTV()?2*L:L*.5;return 0;}
function spec2Box(){const P=S.spec2;if(!P)return spec2Can()?`<div class="card"><div class="t">${ic('star')} 전문 분야</div><p class="hint" style="margin:4px 0 6px">이제 나만의 전문 분야를 정할 수 있다.</p><button type="button" class="btn" onclick="spec2Pick()">전문 분야 고르기</button></div>`:'';const need=[0,8,20,40][P.lv];
  return `<div class="card"><div class="t">${ic('star')} 전문 분야 · ${SPEC2[P.k].n} ${P.lv}단계</div><p class="hint" style="margin:3px 0 0">${esc(SPEC2[P.k].up)} · 할 일의 「${SPEC2[P.k].act}」${jp(SPEC2[P.k].act,'으로','로')} 키운다${need?` · 다음 단계까지 ${Math.max(0,need-P.xp)}`:' · 최고 단계'}</p></div>`;}

// ---- 경쟁 기자 AI: 정권·길·사건에 따라 움직인다 ----
function rivalAI(lines){if(!S.world||S.rank<1||S.story)return;const w=S.world;
  if(chance(.07*dk('rival'))){const kind=pick(oHas(D_POL)?['gov','gire','inv']:['gire','inv']);const nm=rname();
    if(kind==='gov'){const my0=(S.items||[]).filter(i=>i.excl&&facOf(i)==='gov'),my=my0.filter(aiStealable);if(!my.length&&aiChase(my0,`경쟁사 ${nm} 기자가`,lines)){}else if(my.length){const it=pick(my);it.excl=false;it.exclLost=1;lines.push({c:'r',t:`경쟁사 ${nm} 기자가 ${CAMP[w.ruling]} 정부에서 자료를 받아 먼저 썼다 — 「${it.title}」 단독이 깨졌다`});}else lines.push({c:'',t:`경쟁사 ${nm} 기자가 정부 브리핑을 그대로 받아 단독을 달았다. 업계에선 "어용"이라 수군댄다`});}
    if(kind==='gire'){lines.push({c:'',t:`경쟁사가 실검 기사를 하루 수십 건씩 쏟아낸다. 조회수 경쟁이 거세졌다`});try{const K=km();if(K.pv)K.pv=Math.round(K.pv*.95);}catch(e){}}
    if(kind==='inv'&&S.cs){S.cs.heat=Math.min(100,S.cs.heat+8);lines.push({c:'r',t:`경쟁사 탐사팀이 「${S.cs.title}」 냄새를 맡았다. 서둘러야 한다`});}}
  // 권력 AI: 집권 세력이 나를 적으로 보면 보복한다
  const foe=w.ruling,isOpp=oidOf()==='opp';if(oHas(D_POL)&&S.rep&&S.rep[foe]<=(isOpp?-12:-25)&&S.fac&&S.fac.gov>=(isOpp?50:58)&&chance(isOpp?.12:.08)){
    if(S.founder){try{S.co.cash-=.2;}catch(e){}lines.push({c:'r',t:'정부가 우리 회사에 세무조사를 통보했다. 비판 기사에 대한 보복이라는 말이 돈다'});}
    else{lines.push({c:'r',t:'정부 부처들이 내 취재 요청만 골라 거절한다. 출입처 기자단에서 나를 빼자는 말까지 나왔다'});S.hp=clamp(S.hp-4,0,100);valN('ind',1);}}
  // 동료 AI: 동료 기자도 어두운 길을 걷다 무너진다
  if(!S.founder&&!S.simple&&S.rank>=1&&chance(.03)){const nm=rname();const k=pick(oHas(D_POL)?['gov','gire','poli']:['gire']);Q.push(()=>openModal('동료의 몰락',`<p class="lede">옆 부서 ${esc(nm)} 기자가 ${jo2(ROUTE[k].n,'을','를')} 걷다 ${{gov:'정권 실세 비리에 이름이 올랐다',gire:'정정보도 열 건이 한꺼번에 터졌다',poli:'의원실 압수수색 장부에서 이름이 나왔다'}[k]}. 다들 알고 있던 일이다.</p>`,[
    {label:'내가 쓴다',sub:'신뢰↑ · 독립 쪽으로 · 사내 관계↓',fn:()=>{toast(apply({trust:1.5,fame:.5}));valN('ind',3,'동료의 비리를 썼다');const c=colBy('boss');if(c)relUp(c,-2,'동료 비리 보도');}},
    {label:'모른 척한다',sub:'사내 관계 유지 · 타협 쪽으로',fn:()=>{valN('ind',-2,'동료의 비리를 덮었다');}}]));}}

// ---- 1.2 업적·엔딩 ----
Object.assign(ACH,{trait:['나라는 사람','성격 두 가지를 정한다'],case1:['진실을 맞혔다','사건 파일의 몸통을 맞혀 대특종'],case3:['명탐정','사건 파일 세 건 해결'],caseMiss:['미끼를 물다','엉뚱한 사람을 몸통으로 지목'],court:['법정의 기자','법정 공방에서 승소'],court3:['소송 불패','법정 공방 3번 승소'],
 routeIn:['선을 넘다','어두운 길에 처음 발을 들인다'],routeOut:['손을 씻다','어두운 길에서 스스로 빠져나온다'],routeTop:['그 길의 끝','어두운 길의 마지막 단계에 오른다'],regime:['정권은 짧고','정권 교체를 겪는다'],
 spec:['나만의 무기','전문 분야를 정한다'],specMax:['일가를 이루다','전문 분야 최고 단계'],camp:['진영의 스타','한 진영 평판 50'],enemy:['양쪽의 적','보수·진보 평판이 모두 -20 아래'],heir:['선배의 뒤를 잇다','후배로 이어 하기'],scout:['스카우트','다른 부서의 러브콜을 받아 옮긴다'],goodIn:['좋은 기자','감시견·약자의 목소리·검증의 길 가운데 한 길을 걷는다'],goodTop:['길을 끝까지','좋은 길의 마지막 단계에 오른다'],unbroken:['꺾이지 않는 펜','권력의 마지막 압박을 버텨 낸다'],breadth:['순환 근무','부서 네 곳을 거친다'],oidChg:['회사가 변했다','회사의 정체성이 바뀐다'],change:['사람은 변한다','큰일을 겪고 성격이 바뀐다'],debt:['신세는 갚지 않는다','취재원 청탁을 거절한다']});
Object.assign(SPEC2.data,{down:'현장 아이템은 약하다'});Object.assign(SPEC2.inv,{down:'사건이 길어지면 데스크 눈총'});Object.assign(SPEC2.anchor,{down:'출연마다 컨디션 소모가 크다'});Object.assign(SPEC2.col,{down:'한쪽 편을 들면 반대 진영이 등을 돌린다'});Object.assign(SPEC2.repo,{down:'행동력 2 · 컨디션을 크게 쓴다'});
const SPEC_END={data:'데이터 저널리즘의 개척자',inv:'탐사보도의 전설',anchor:'간판 앵커',col:'시대의 논객',repo:'르포 문학의 거장'};
function v12AchMonth(lines){try{if(S.traits&&S.traits.length)ach('trait');if(S.spec2){ach('spec');if(S.spec2.lv>=4)ach('specMax');}if(S.route&&!S.route.good){ach('routeIn');if(S.route.lv>=3)ach('routeTop');}if(S.world&&S.world.chg)ach('regime');if(S.rep){if(S.rep.cons>=50||S.rep.prog>=50)ach('camp');if(S.rep.cons<=-20&&S.rep.prog<=-20)ach('enemy');}if(S.heirFrom)ach('heir');if((S.deptHist||[]).length>=4)ach('breadth');if((S.caseWin||0)>=1)ach('case1');if((S.caseWin||0)>=3)ach('case3');if((S.courtWin||0)>=1)ach('court');if((S.courtWin||0)>=3)ach('court3');}catch(e){}
  // 전문 분야 엔딩: 최고 단계 + 10년 차 이상 + 이름값
  try{const P=S.spec2;if(P&&P.lv>=4&&years()>=10&&S.turn-(P.t0??S.turn)>=YW*4&&(S.fame||0)>=55&&!S.route&&!S.specEndAsk&&chance(.15)&&(P.k!=='inv'||(S.caseWin||0)>=2)){S.specEndAsk=1;const n=SPEC_END[P.k];Q.push(()=>openModal(n,`<p class="lede">${{data:'내가 만든 데이터팀 방식이 업계 표준이 됐다. 대학에서 강의 요청이 쏟아진다.',inv:'내가 터뜨린 사건들이 교과서에 실린다. 후배들이 "그 선배처럼"을 입에 달고 산다.',anchor:'저녁 8시, 시청자들은 내 얼굴을 보고 하루를 정리한다.',col:'내 칼럼이 실리는 날이면 정치권이 아침부터 술렁인다.',repo:'현장 기록을 묶은 책이 베스트셀러가 됐다. 문학상 후보에도 올랐다.'}[P.k]}</p><p class="hint">여기서 펜을 내려놓으면 전설로 남는다.</p>`,[{label:'전설로 남는다 (커리어 마무리)',sub:'전문 분야 엔딩',fn:()=>{ending(n);return false;}},{label:'아직은 현역이다',cls:'ghost'}]));}}catch(e){}}

// ---- 언론사 정체성: 어용 언론 · 진실의 수호자 · 클릭 공장 · 야성의 언론 · 재벌의 친구 · 정론지 ----
const OID={
 gov:{n:'어용 언론',c:'#77a6ff',d:'누가 집권하든 권력의 편에 선다',up:['정부 단독 자료가 자주 들어온다','집권 진영의 평판을 안고 시작한다','정부 광고가 넉넉하다'],down:['신뢰가 잘 오르지 않는다','정부 비판 기사를 쓰면 윗선이 막는다','정권이 바뀌면 신뢰와 평판이 크게 깎인다'],fx:{trust:.8,item:1.08}},
 truth:{n:'진실의 수호자',c:'#5ad49b',d:'권력도 광고주도 가리지 않는다',up:['신뢰와 평판이 잘 오른다','단독 아이템이 잘 붙는다','데스크가 광고주 압박을 막아 준다'],down:['월급과 광고 수입이 적다','소송과 권력의 보복이 잦다','어두운 길의 유혹은 거의 없지만, 걸으면 더 빨리 들킨다'],fx:{trust:1.2,fame:1.1,pay:.95,legal:1.2}},
 click:{n:'클릭 공장',c:'#ffb84d',d:'조회수가 곧 정의다',up:['아이템이 많이 들어온다','조회수와 출고량으로 평가받기 쉽다','기레기의 길 제안이 잦다'],down:['신뢰가 가장 안 오른다','포털 제재를 자주 받는다','독자 평판이 매달 조금씩 깎인다'],fx:{trust:.75,item:1.2,eval:1.05}},
 opp:{n:'야성의 언론',c:'#ff8fb1',d:'어느 정권이든 권력을 물어뜯는다',up:['정부 비판 기사로 평판이 크게 오른다','시민사회와 반대 진영의 제보가 온다','정권이 바뀌어도 이점이 그대로다'],down:['정부의 보복과 세무조사가 잦다','정부 광고가 없다','집권 진영의 평판이 계속 깎인다'],fx:{fame:1.12,legal:1.1}},
 corp:{n:'재벌의 친구',c:'#b98cff',d:'광고주가 곧 고객이다',up:['월급과 광고 수입이 넉넉하다','기업에서 자료와 협찬이 들어온다','재벌 세력이 클수록 회사가 편하다'],down:['기업 비판 기사는 광고국이 막는다','신뢰가 덜 오른다','재벌 개혁 시대에는 회사가 흔들린다'],fx:{pay:1.08,trust:.85}},
 neu:{n:'정론지',c:'#9aa2bb',d:'균형과 원칙을 지킨다',up:['신뢰와 평가가 조금씩 더 오른다','독자 평판이 서서히 쌓인다','어느 진영에서도 크게 미움받지 않는다'],down:['뚜렷한 특혜가 없다','큰 단독은 스스로 찾아야 한다'],fx:{trust:1.05,eval:1.03}}};
const OID_MAP={hanbit:'neu',nuritong:'neu',marketwire:'corp',knb:'neu',nbs:'neu',newsair:'gov',daehantv:'gov',mbx:'corp',bizplus:'corp',jungang:'corp',saebyeok:'truth',hangyeol:'neu',seoulsibo:'gov',kyungje:'corp',sijang:'corp',moneydaily:'click',dailystar:'click',issueinsight:'click',dailyfact:'click',newspan:'opp',factk:'truth',tamsa:'truth',sisanuri:'opp',econweekly:'corp',hangaram:'opp',
 gukjeong:'gov',yaseong:'opp',jinsil:'truth',clicknow:'click',jaegye:'corp',ktn:'gov'};
[mkO('gukjeong','국정일보','daily','neu','정부 광고 의존',3,'정부 광고와 보도자료로 크는 일간지. 정권이 바뀌어도 늘 집권 세력 편이다.'),
 mkO('yaseong','야성일보','daily','neu','독자 주주',2,'어느 정권이든 권력을 물어뜯는 비판 일간지. 정부 광고는 한 줄도 없다.'),
 mkO('jaegye','재계일보','econ','market','대기업 출자',3,'대기업들이 출자한 경제지. 기업 광고가 넉넉하다.'),
 mkO('ktn','정책방송 KTN','ch','neu','정부 출자',2,'정부가 출자한 정책 전문 채널. 브리핑 생중계가 많다.',['pol','soc','eco','nat']),
 mkO('jinsil','진실탐사','online','neu','비영리',2,'광고도 권력도 받지 않는 독립 탐사 매체. 소송이 끊이지 않는다.',['inv','soc','pol','court'].filter(d=>DEPTS[d])),
 mkO('clicknow','클릭나우','online','neu','독립',2,'실검과 포털 유입으로 먹고사는 인터넷 매체. 하루 기사가 수백 건이다.',['soc','ent','pol'].filter(d=>DEPTS[d]))].forEach(o=>{if(!OUTLETS.some(x=>x.id===o.id))OUTLETS.splice(OUTLETS.length,0,o);});
OUTLETS.forEach(o=>{if(!o.oid&&OID_MAP[o.id])o.oid=OID_MAP[o.id];});
function oidAllowed(o,k){const d=OID[k];if(!d||!o)return k==='neu';return !d.ok||!!d.ok(o);}
function oidOf(o){const k=oidOf0(o);o=o||(S&&S.outlet?OUT():null);return o&&!oidAllowed(o,k)?'neu':k;}
function oidOf0(o){o=o||(S&&S.outlet?OUT():null);if(!o)return 'neu';if(S&&S.oidOver&&S.oidOver[o.id]&&!o.custom)return S.oidOver[o.id];if(o.custom||S&&S.founder&&o.id===S.outlet)return (S&&S.oid)||'neu';if(o.oid)return o.oid;if(String(o.id).startsWith('npc')||String(o.id).startsWith('lg')){const L=['neu','click','truth','opp','gov','corp'];return L[otrHash(o.id)%L.length];}return 'neu';}
function oidFx(o,k){const d=OID[oidOf(o)];return d&&d.fx[k]!=null?d.fx[k]:1;}
function oidTag(o){const d=OID[oidOf(o)];return d?`<span class="tag" style="border-color:${d.c};color:${d.c}" title="${esc(d.d)}">${d.n}</span>`:'';}
function oidCard(o){const d=OID[oidOf(o)];if(!d)return '';return `<div class="card" style="border-color:${d.c}55"><div class="t" style="color:${d.c}">${ic('flag')} 정체성 · ${d.n}</div><p class="hint" style="margin:3px 0 4px">${esc(d.d)}</p>${d.up.map(x=>`<p class="hint" style="margin:2px 0"><span style="color:var(--good)">이점</span> ${esc(x)}</p>`).join('')}${d.down.map(x=>`<p class="hint" style="margin:2px 0"><span style="color:var(--red)">단점</span> ${esc(x)}</p>`).join('')}</div>`;}
function oidPick(next){openModal('어떤 언론사를 세울까','<p class="lede">회사의 정체성을 정한다. 이점과 단점이 함께 오고, 판 내내 바뀌지 않는다. 우리 회사 부서에 맞는 것만 고를 수 있다.</p>',Object.keys(OID).filter(k=>oidAllowed(OUT(),k)).map(k=>({label:OID[k].n,sub:`${OID[k].d} · 이점: ${OID[k].up[0]} · 단점: ${OID[k].down[0]}`,fn:()=>{S.oid=k;log(`회사 정체성: ${OID[k].n}`);try{const r=S.rep;if(r)oidRep();}catch(e){}closeModal();next&&next();return false;}})));}
function oidRep(){const k=oidOf(),R0=S.rep,w=S.world;if(!R0||!w||S.oidRepDone===S.outlet)return;S.oidRepDone=S.outlet;const opp=w.ruling==='cons'?'prog':'cons';
  if(k==='gov')R0[w.ruling]+=10;if(k==='opp'){R0[opp]+=8;R0.ind+=4;}if(k==='truth'){R0.read+=8;R0.ind+=6;}if(k==='click')R0.read-=6;}
// 매달: 정체성에 따른 이득과 대가
function oidMonth(lines){if(S.story||S.phase!=='game')return;ensure12();oidRep();const k=oidOf(),o=OUT(),w=S.world,emp=!S.founder&&S.rank>=1;const cs=x=>{if(S.founder&&S.co)S.co.cash=+(S.co.cash+x).toFixed(2);};
  if(k==='gov'){if(S.rank>=1&&chance(.3)){const it=makeItem(S.dept,{excl:true,pre:1});it.src='정부 관계자';S.items.push(it);lines.push({c:'g',t:`어용 언론 — 정부가 자료를 먼저 흘려 줬다 → 「${it.title}」`});}cs(.03*o.p);}
  if(k==='truth'){repN('read',.4);cs(-.015*o.p);if(chance(.05)&&S.rank>=1){S.pending.push({type:'suit',ent:null,who:pick(['대형 로펌','재벌 그룹 법무팀','정부 부처']),due:S.turn+R(2,6),title:(mine()[0]||{}).h||'최근 보도'});lines.push({c:'r',t:'진실의 수호자 — 우리 보도에 또 소송이 걸릴 모양이다. 법무팀이 바빠진다'});}}
  if(k==='click'){repN('read',-.4);try{if(chance(.07))portalPen(1,'어뷰징');}catch(e){}if(chance(.25)&&S.rank>=1){const it=makeItem(S.dept,{});S.items.push(it);}cs(.02*o.p);}
  if(k==='opp'){const R0=w.ruling;repN(R0,-.5);cs(-.01*o.p);if(chance(.12)&&S.rank>=1){const it=makeItem(S.dept,{excl:true});it.src='내부 고발자';S.items.push(it);lines.push({c:'g',t:`야성의 언론 — 권력 내부에서 고발 메일이 왔다 → 「${it.title}」`});}}
  if(k==='corp'){cs(.03*o.p*(S.fac?facK().ad:1));if(S.world&&S.world.chaeEv&&chance(.1)){cs(-.1*o.p);lines.push({c:'r',t:'재벌의 친구 — 재벌 개혁 바람에 출자 기업들이 광고를 줄였다'});}}
  if(k==='neu'){repN('read',.2);}}
// 정권 교체 때
function oidRegime(){const k=oidOf();if(k==='gov'){const fx=apply({trust:-5,fame:-3});Q.push(()=>openModal('정권 교체 · 어용 언론의 시련',`<p class="lede">"전 정권 나팔수"라는 말이 우리 회사 이름 앞에 붙었다. 새 정부에 줄을 대느라 편집국이 분주하다.</p>${fxLine(fx)}`));}
  if(k==='opp'){const fx=apply({fame:1.5});Q.push(()=>openModal('정권 교체 · 야성의 언론',`<p class="lede">어제의 야당이 오늘의 정부다. 우리는 새 권력을 똑같이 물어뜯는다. 독자들이 "역시"라고 한다.</p>${fxLine(fx)}`));}}
// 기사를 낼 때
function oidPub(it,clip){const k=oidOf();const f=facOf(it);const crit=CRIT_RE.test(it.title||'');if(!clip)return;
  if(k==='gov'&&f==='gov'&&crit&&!S.founder&&S.rank<=5){const bs=colBy('boss');if(bs)relUp(bs,-3,'정부 비판 기사');S.eval=clamp((S.eval||0)-1,0,100);log('어용 언론 — 정부 비판 기사에 윗선이 불쾌해했다');}
  if(k==='opp'&&f==='gov'&&crit){apply({fame:Math.min(2,clip.imp/40)});}
  if(k==='corp'&&f==='chae'&&crit&&!S.founder&&S.rank<=5){const bs=colBy('boss');if(bs)relUp(bs,-2,'기업 비판 기사');}
  if(k==='truth'&&it.excl)repN('ind',.5);}
// 경쟁 매체 AI: 정체성대로 움직인다
function oidRivals(lines){if(!chance(.1)||S.rank<1)return;const me=S.outlet;const g0=(TYPES[OUT().type]||{}).g;const pool=OUTLETS.filter(o=>o.id!==me&&!o.closed&&!o.custom&&((TYPES[o.type]||{}).g===g0||oDepts(o).some(d=>oDepts().includes(d))));const ks=Object.keys(OID).filter(x=>x!=='neu'&&(!['gov','opp'].includes(x)||oHas(D_POL)));const k=pick(ks);const L=pool.filter(o=>oidOf(o)===k);if(!L.length)return;const r=pick(L),w=S.world||{ruling:'cons'};
  if(k==='gov'){facN('gov',1);lines.push({c:'',t:`어용 언론 ${jo2(r.n,'이','가')} 정부 성과를 대서특필했다. 집권 세력이 조금 힘을 얻었다`});}
  if(k==='truth'){const f=pick(['gov','chae','pros']);facN(f,-1.5);facN('civ',1);lines.push({c:'',t:`진실의 수호자 ${jo2(r.n,'이','가')} ${FAC[f][0]} 비리를 터뜨렸다. 업계가 술렁인다`});if(S.cs&&chance(.5)){S.cs.heat=Math.min(100,S.cs.heat+6);lines.push({c:'r',t:`${r.n}도 「${S.cs.title}」 사건을 쫓고 있다는 소문이다`});}}
  if(k==='click'){lines.push({c:'',t:`클릭 공장 ${jo2(r.n,'이','가')} 같은 기사를 제목만 바꿔 수십 건 올렸다. 포털 순위가 어지럽다`});}
  if(k==='opp'){facN('gov',-1);facN('opp',.5);lines.push({c:'',t:`야성의 언론 ${jo2(r.n,'이','가')} 정부를 연일 두들긴다. 집권 세력이 흔들린다`});}
  if(k==='corp'){facN('chae',1);lines.push({c:'',t:`재벌의 친구 ${jo2(r.n,'이','가')} 대기업 총수 인터뷰를 1면에 실었다`});}
  const ln=oidRivalLine(k,r);if(ln)lines.push({c:'',t:ln});}

// ---- 정체성은 바뀐다: 큰 사건과 결정이 기자의 성격과 회사의 정체성을 바꾼다 ----
// 기자의 성격 변화
function trChange(add,rem,title,why){S.traits=S.traits||[];if(add&&S.traits.includes(add))add=null;if(rem&&!S.traits.includes(rem))rem=null;if(!add&&!rem)return;if(S.trCd>S.turn)return;S.trCd=S.turn+YW;
  const A=add?PTRAITS[add]:null,Rm=rem?PTRAITS[rem]:null;const out=rem||(S.traits.length>=2&&add?S.traits.find(k=>k!==add):null);const O=out?PTRAITS[out]:null;
  Q.push(()=>openModal(`사람이 변한다 · ${title}`,`<p class="lede">${esc(why)}</p><p class="hint">${A?`새 성격 「${A.n}」 — <span style="color:var(--good)">${esc(A.up)}</span> · <span style="color:var(--red)">${esc(A.down)}</span>`:''}${A&&O?'<br>':''}${O?`「${O.n}」 성격은 사라진다`:''}</p>`,[
   {label:A?`${O?`「${O.n}」 대신 `:''}${ro2(`「${A.n}」`.slice(1,-1))} 변한다`:`${jo2(O.n,'을','를')} 버린다`,fn:()=>{if(out)S.traits=S.traits.filter(k=>k!==out);if(add)S.traits.push(add);S.traits=S.traits.slice(-2);ach('change');log(`성격 변화: ${S.traits.map(k=>PTRAITS[k].n).join(' · ')}`);toast('성격이 바뀌었다');}},
   {label:'나는 나대로 간다',cls:'ghost',sub:'성격 그대로'}]));}
function trMonth(lines){if(!S.traits||S.story)return;const T=S.traits;
  if(T.includes('workaholic')&&S.hp<12&&chance(.4))trChange('sober','workaholic','번아웃','응급실에서 링거를 맞으며 생각했다. 이렇게 살다간 기사보다 내가 먼저 끝나겠다.');
  else if(T.includes('drinker')&&S.hp<15&&chance(.25))trChange('sober','drinker','건강검진','간 수치가 빨간색이다. 의사가 "술은 이제 끝"이라고 했다.');
  else if(!T.includes('workaholic')&&(S.fame||0)>=60&&S.hp>60&&chance(.03))trChange('workaholic',null,'이름값','내 이름을 찾는 곳이 늘었다. 쉬는 날에도 노트북을 연다.');
  else if(T.includes('social')&&S.rep&&(S.rep.cons<=-30||S.rep.prog<=-30)&&chance(.1))trChange('lone','social','외톨이','한쪽 진영이 나를 적으로 본다. 술자리 연락이 끊겼다.');}
// 큰 사건 뒤에 부르는 훅
function trAfter(kind){try{if(!S.traits)return;const T=S.traits;
  if(kind==='caseWin'){if(T.includes('timid'))trChange('justice','timid','두려움을 넘다','몸통을 지목해 이겼다. 다음엔 덜 무서울 것 같다.');else if(chance(.35))trChange('justice',null,'대특종 이후','진실을 터뜨린 밤, 세상이 조금 다르게 보였다.');}
  if(kind==='caseMiss'||kind==='courtLose'){if(T.includes('justice')&&chance(.5))trChange('timid','justice','쓴맛','엉뚱한 사람을 지목했고, 법정에서 졌다. 이제 확인이 두렵다.');else if(chance(.4))trChange('perfect',null,'다시는','다시는 이런 실수를 하지 않겠다. 원고를 열 번씩 고친다.');}
  if(kind==='routeQuit')trChange('justice',T.includes('social')?'social':null,'손을 씻다','더러운 길에서 빠져나왔다. 이제야 기자로 돌아온 것 같다.');
  if(kind==='routeTop'&&T.includes('justice'))trChange('social','justice','변절','어느새 그 사람들과 웃으며 술잔을 부딪치고 있다.');}catch(e){}}
// 회사의 정체성 변화
function oidSet(k,why){const o=OUT();if(!o||!OID[k]||!oidAllowed(o,k))return;const old=oidOf();if(old===k)return;if(S.founder)S.oid=k;else{S.oidOver=S.oidOver||{};S.oidOver[o.id]=k;}S.oidT=S.turn;ach('oidChg');log(`회사 정체성: ${OID[old].n} → ${OID[k].n} (${why})`);S.oidRepDone=null;}
function oidShift(lines){if(S.story||S.rank<1||S.turn-(S.oidT??-999)<YW*2)return;const o=OUT(),k=oidOf(),boss=S.founder||S.rank>=4;const w=S.world||{};
  const cand=(t,why,opts)=>{const ok=opts.filter(x=>oidAllowed(o,x)&&x!==k);if(!ok.length)return false;S.oidT=S.turn;
    if(boss){Q.push(()=>openModal(`회사의 갈림길 · ${t}`,`<p class="lede">${esc(why)}</p><p class="hint">지금 정체성: ${OID[k].n}. 바꾸면 이점과 단점이 함께 바뀐다.</p>`,ok.map(x=>({label:`${ro2(OID[x].n)} 간다`,sub:`이점: ${OID[x].up[0]} · 단점: ${OID[x].down[0]}`,fn:()=>{oidSet(x,t);toast(`회사가 ${ro2(OID[x].n)} 방향을 틀었다`);}})).concat([{label:`${ro2(OID[k].n)} 남는다`,cls:'ghost'}])));}
    else{const x=pick(ok);oidSet(x,t);Q.push(()=>openModal(`회사가 변했다 · ${t}`,`<p class="lede">${esc(why)} 경영진이 회사의 방향을 바꿨다. 오늘부터 우리 회사는 「${OID[x].n}」의 길을 간다.</p><p class="hint">이점: ${OID[x].up.join(' · ')}<br>단점: ${OID[x].down.join(' · ')}</p>`,[
      {label:'받아들인다',sub:'타협 쪽으로',fn:()=>{valN('ind',-1);}},{label:'반대 성명에 이름을 올린다',sub:'독립 쪽으로 · 윗선 관계↓',fn:()=>{valN('ind',3,'회사 방향 전환에 반대했다');const bs=colBy('boss');if(bs)relUp(bs,-4,'반대 성명');}}]));}
    return true;};
  // 내 회사의 상황이 정체성을 흔든다
  if(k==='gossip'&&(S.trust??50)<20&&chance(.3))return cand('신뢰 바닥','그건 기사도 아니라는 말이 업계에 돈다. 광고주들도 이름을 빼 달라고 한다.',['neu','expert','fandom']);
  if(k==='lord'&&w.chgT>S.turn-YW&&chance(.3))return cand('사주의 몰락','사주와 가까웠던 단체장이 낙선했다. 사주가 회사에서 손을 뗀다.',['local','neu']);
  if(k==='gov'&&(S.trust??50)<25&&chance(.3))return cand('신뢰 추락','"정부 기관지"라는 조롱이 독자 게시판을 덮었다. 구독 해지가 줄을 잇는다.',['neu','truth']);
  if(k==='click'&&S.portal&&S.portal.pen>=3&&chance(.3))return cand('포털 퇴출 위기','포털이 우리 매체를 검색 제휴에서 빼겠다고 경고했다.',['neu']);
  if((k==='truth'||k==='opp')&&S.founder&&S.co&&S.co.cash<4&&chance(.3))return cand('돈이 마른다','통장이 바닥을 보인다. 대기업 광고 제안과 정부 광고 제안이 동시에 들어왔다.',['corp','gov','neu']);
  if(k==='corp'&&w.chaeEv&&chance(.25))return cand('재벌 개혁','재벌 개혁 바람에 출자 기업들이 하나둘 빠져나갔다.',['neu','truth']);
  if(k==='neu'&&(S.caseWin||0)>=1&&S.caseWinT>S.turn-YW&&chance(.3))return cand('대특종 이후','우리 대특종 이후 후원 문의가 쏟아진다. "이 매체는 끝까지 판다"는 평이 붙었다.',['truth']);
  if(k==='gov'&&w.chgT>S.turn-YW&&chance(.4))return cand('정권 교체','어제의 권력이 오늘의 피의자다. 편집국에서 "이제는 달라져야 한다"는 목소리가 커졌다.',['opp','neu','gov'].filter(x=>x!=='gov'));
  // 경영진 AI의 큰 결정
  if(chance(.012)){const ev=pick([['대기업 인수','대기업 그룹이 우리 회사 지분을 사들였다.',['corp']],['낙하산 사장','정권과 가까운 인사가 새 사장으로 왔다.',['gov']],['편집국 쇄신','편집국장 직선제가 도입됐다. 기자들이 편집 방향을 다시 정했다.',['truth','neu']],['디지털 생존','종이 신문이 무너진다. 경영진이 "조회수가 살길"이라고 선언했다.',['click']],['해직 기자 복귀','오래전 해직된 선배들이 돌아와 편집국을 이끈다.',['opp','truth']],['팬덤 사업','대형 기획사가 회사 지분을 사들였다.',['fandom']],['협회 출자','업계 협회가 회사에 출자했다.',['industry']],['지역 유지 인수','지역 건설사 회장이 회사를 인수했다.',['lord']],['주민 출자','주민들이 십시일반 모은 돈으로 회사 지분을 샀다.',['local']],['데이터팀 신설','경영진이 데이터 저널리즘에 회사의 미래를 걸었다.',['datalab']],['숏폼 전환','종이와 긴 기사가 무너진다. 경영진이 1분 영상으로 승부한다고 선언했다.',['short']],['전문지 선언','경영진이 업계가 교과서처럼 읽는 매체를 목표로 내걸었다.',['expert']],['황색 전환','부수가 급감하자 경영진이 스캔들 기사로 방향을 틀었다.',['gossip']],['해외판 창간','경영진이 해외 독자를 노린 영문판을 키운다.',['global']]]);return cand(ev[0],ev[1],ev[2]);}
  return false;}

// ---- 부서를 옮길 이유: 부서마다 이점·단점, 옮길 때의 보상, 데려가려는 유혹 ----
const DFX_TXT={fame:['평판이 잘 오른다','평판이 덜 오른다'],trust:['신뢰가 잘 오른다','신뢰가 덜 오른다'],item:['아이템이 많이 돈다','아이템이 적다'],eval:['평가를 잘 받는다','평가가 짜다'],rel:['관계가 잘 쌓인다','관계가 잘 안 쌓인다'],legal:['소송 위험이 높다','소송 위험이 낮다'],heat:['타사 추격이 빠르다',null],hp:['몸이 고되다','덜 지친다']};
const D_SPEC={data:['eco','fin','stock','estate','it','ind'],inv:['inv','case','court','soc'],anchor:['pol','soc','ent','spo'],col:['pol','cul','diplo','int','edu'],repo:['soc','case','nat','loc','sigun','med','ind']};
function deptPC(d){const D=DEPT_FX[d];const up=[],dn=[];if(!D)return{up,dn};const fx=D[2]||{},gr=D[3]||{};
  for(const k in fx){const T=DFX_TXT[k];if(!T)continue;const v=fx[k];const good=(k==='legal'||k==='heat'||k==='hp')?v<1:v>1;const txt=(k==='legal'||k==='heat'||k==='hp')?(v>1?T[0]:T[1]):(v>1?T[0]:T[1]);if(!txt)continue;(good?up:dn).push(txt);}
  const g=Object.keys(gr).filter(k=>gr[k]>1).sort((a,b)=>gr[b]-gr[a]).slice(0,2).map(k=>STN[k]);if(g.length)up.push(`${g.join('·')} 성장↑`);
  const [t]=deptTier(d);if(t==='A')dn.push('들어가기 어렵고 경쟁이 세다');if(t==='D')up.push('지원자가 적어 잘 받아 준다');
  try{if(CASE_DEF.some(c=>c.ds.includes(d)))up.push('사건 파일이 열린다');if(D_POL.includes(d))dn.push('권력의 유혹(어두운 길)에 가깝다');if(S.spec2&&D_SPEC[S.spec2.k].includes(d))up.push(`전문 분야(${SPEC2[S.spec2.k].n})와 잘 맞는다`);}catch(e){}
  if(!dn.length)dn.push('뚜렷한 약점은 없지만 출입처를 처음부터 다시 다져야 한다');return{up,dn};}
function deptPCtxt(d,short){const P=deptPC(d);return short?`이점: ${P.up.slice(0,2).join(', ')} · 단점: ${P.dn.slice(0,1).join(', ')}`:`<span style="color:var(--good)">이점</span> ${P.up.join(' · ')}<br><span style="color:var(--red)">단점</span> ${P.dn.join(' · ')}`;}
// 여러 부서를 거친 기자가 데스크가 된다: 거친 부서 수만큼 평가가 잘 오른다
function deptBreadth(){return Math.max(0,((S&&S.deptHist)||[]).length-1);}
function deptBreadthK(){return 1+Math.min(.12,deptBreadth()*.03);}
// 새 부서에 오면: 인수인계 아이템, 새 취재원, 몇 달 동안 '새 눈' 효과
function deptArrive(nd){try{pgAfterMove('dept');}catch(e){}try{if(S.founder||S.rank>=4)return;const it=makeItem(nd,{pre:1,excl:chance(.4)});it.src='인수인계';S.items.push(it);addSource(nd);S.deptNew=S.turn+12;
  const n=deptBreadth();Q.push(()=>openModal(`${DEPTS[nd].n} 첫 출근`,`<p class="lede">전임자가 인수인계 파일을 넘겨줬다 → 「${esc(it.title)}」. 출입처 사람 한 명도 소개받았다.</p><p class="hint">${deptPCtxt(nd)}<br><span style="color:var(--sodium)">새 눈</span> 석 달 동안 단독 아이템이 잘 붙는다${n?` · 지금까지 거친 부서 ${n+1}곳 — 여러 부서를 거칠수록 평가가 잘 오른다`:''}</p>`));}catch(e){console.error(e);}}
// 다른 부서가 나를 데려가려 한다
function deptLure(lines){if(S.founder||S.story||S.rank<1||S.rank>3||S.turn-(S.deptT??0)<YW||S.turn-(S.lureT??-999)<YW||!chance(.06))return;const o=OUT();
  const pool=o.depts.filter(d=>d!==S.dept&&DEPT_FX[d]&&!isRegD(d));if(!pool.length)return;
  const sc=d=>{let v=Math.random();const gr=DEPT_FX[d][3]||{};const top=Object.keys(S.st).sort((a,b)=>S.st[b]-S.st[a]).slice(0,3);top.forEach(k=>{if(gr[k]>1)v+=.6;});if(S.spec2&&D_SPEC[S.spec2.k].includes(d))v+=1;if(!(S.deptHist||[]).includes(d))v+=.4;return v;};
  const d=pool.sort((a,b)=>sc(b)-sc(a))[0];S.lureT=S.turn;const who=rname();const [t]=deptTier(d);
  const perk=pick([['eval','"오면 첫 인사 고과는 내가 챙긴다."'],['excl','"우리 팀에 묵혀 둔 단독이 하나 있어. 네가 써."'],['spec','"네 전문 분야, 우리 팀에서 제대로 키워 줄게."'],['src','"내 취재원 둘 넘겨줄게."']]);
  Q.push(()=>openModal(`스카우트 · ${DEPTS[d].n}`,`<p class="lede">${esc(who)} ${DEPTS[d].n} 부장이 커피를 사며 말했다. "너 같은 사람이 우리 팀에 필요해. 정기 인사 기다릴 거 없이 바로 데려갈게." ${perk[1]}</p><p class="hint">${deptPCtxt(d)}</p>`,[
   {label:`${ro2(DEPTS[d].n)} 옮긴다`,sub:'바로 발령 · 지금 부장 관계↓ · 새 부서 보너스',fn:()=>{const bs=colBy('boss');if(bs)relUp(bs,-5,'다른 부서로 떠남');doRotate(d);ach('scout');
      if(perk[0]==='eval')apply({eval:1.5});if(perk[0]==='excl'){const it=makeItem(d,{excl:true,pre:1,mult:1.15});it.src='팀 선물';S.items.push(it);}if(perk[0]==='spec'&&S.spec2)spec2XP(4);if(perk[0]==='src'){addSource(d,30);addSource(d,30);}toast(`${ro2(DEPTS[d].n)} 옮겼다`);}},
   {label:'지금 부서에 남는다',sub:'지금 부장 관계↑ · "의리 있네"',fn:()=>{const bs=colBy('boss');if(bs)relUp(bs,4,'스카우트 거절');}}]));}
function deptPCBox(){if(S.founder||S.story||S.rank>=4||!DEPT_FX[S.dept])return '';const n=deptBreadth();return `<div class="card"><div class="t">${ic('users')} 지금 부서 · ${DEPTS[S.dept].n}</div><p class="hint" style="margin:3px 0 0">${deptPCtxt(S.dept)}${S.deptNew>S.turn?'<br><span style="color:var(--sodium)">새 눈</span> 새 부서라 단독 아이템이 잘 붙는다':''}<br>거친 부서 ${n+1}곳${n?` · 평가가 더 잘 오른다`:''} · 여러 부서를 거칠수록 평가가 잘 오른다</p></div>`;}

// ---- 정체성 더하기: 특수 매체·지역·방송·디지털 ----
const OHAS=(o,L)=>((o&&o.depts)||[]).some(d=>L.includes(d));
Object.assign(OID,{
 fandom:{n:'팬덤 매체',c:'#ff8fb1',d:'스타와 구단, 그리고 팬과 함께 산다',up:['소속사·구단이 단독을 먼저 준다','팬들의 제보가 쏟아진다','조회수가 잘 나온다'],down:['스타나 구단을 비판하면 팬덤이 들고일어난다','신뢰가 덜 오른다','취재원이 홍보팀뿐이라는 말을 듣는다'],fx:{item:1.12,trust:.88,fame:1.05},ok:o=>OHAS(o,['ent','spo','base','foot','culspo'])},
 gossip:{n:'황색 매체',c:'#ffd166',d:'사생활과 스캔들이 1면이다',up:['이름값이 빨리 오른다','자극적인 아이템이 끝없이 들어온다'],down:['신뢰가 거의 오르지 않는다','소송이 끊이지 않는다','업계에서 기자 대접을 못 받는다'],fx:{fame:1.12,item:1.15,trust:.7,legal:1.35},ok:o=>OHAS(o,['ent','spo','soc','culspo'])||['online','sports','weekly'].includes(o.type)},
 expert:{n:'전문가 저널',c:'#7fd1ff',d:'업계가 교과서처럼 읽는다',up:['검증력·상식이 빨리 큰다','오보 위험이 낮다','업계 취재원이 깊게 믿어 준다'],down:['독자가 적어 이름값이 천천히 오른다','큰 단독은 드물다'],fx:{trust:1.12,fame:.92,legal:.8},ok:o=>['trade','eng'].includes(o.type)||OHAS(o,['med','edu','court','it','fin'])},
 industry:{n:'업계 대변지',c:'#c9a0ff',d:'협회와 업계의 목소리를 전한다',up:['협회·기업 광고와 협찬이 넉넉하다','업계 자료가 먼저 온다'],down:['업계 비판 기사는 위에서 막는다','신뢰가 덜 오른다','업계 비리가 터지면 함께 흔들린다'],fx:{pay:1.05,trust:.85,item:1.05},ok:o=>['trade','econ'].includes(o.type)||OHAS(o,['ind','it','med','estate'])},
 local:{n:'풀뿌리 언론',c:'#9be36b',d:'우리 동네의 감시자이자 이웃',up:['주민 제보와 관계가 잘 쌓인다','지역 취재원이 오래 남는다'],down:['월급이 적다','지역 유지들이 광고로 압박한다'],fx:{rel:1.2,pay:.95,item:1.05},ok:o=>o.type==='local'||OHAS(o,['loc','sigun','city'])},
 lord:{n:'토호 언론',c:'#d4a373',d:'지역 유지와 한 몸이다',up:['지역 기업·단체 광고가 끊이지 않는다','시청·의회 자료가 먼저 온다'],down:['신뢰가 덜 오른다','지역 권력을 비판하면 사주가 막는다','지방선거 때마다 회사가 흔들린다'],fx:{pay:1.04,trust:.82,rel:1.1},ok:o=>o.type==='local'||OHAS(o,['city','sigun'])},
 public:{n:'공영 언론',c:'#5ad49b',d:'수신료와 공공의 신뢰로 선다',up:['신뢰가 잘 오른다','재난·선거 보도에서 존재감이 크다','시민사회가 편이 된다'],down:['정권이 바뀔 때마다 사장 교체 압박이 온다','승진과 결정이 느리다'],fx:{trust:1.15,eval:1.02,ten:1.05},ok:o=>['tv','ch'].includes(o.type)&&OHAS(o,['pol','soc'])},
 short:{n:'숏폼 뉴스',c:'#ff9a3d',d:'1분 영상으로 세상을 요약한다',up:['젊은 독자가 몰린다 · 조회수가 잘 나온다','아이템이 빨리 돈다'],down:['깊이 없다는 평에 평가가 짜다','신뢰가 덜 오른다'],fx:{item:1.15,eval:.95,trust:.9,fame:1.05},ok:o=>['online','ch','sports'].includes(o.type)},
 datalab:{n:'데이터 저널리즘 랩',c:'#77a6ff',d:'숫자로 증명한다',up:['데이터가 빨리 큰다','숫자로 만든 단독이 나온다','오보 위험이 낮다'],down:['아이템이 적다','사람 이야기가 약하다는 말을 듣는다'],fx:{item:.92,trust:1.08,legal:.85},ok:o=>OHAS(o,['eco','fin','stock','it','estate'])||['online','econ'].includes(o.type)},
 global:{n:'글로벌 창',c:'#a3c4ff',d:'세계의 눈으로 한국을 본다',up:['어학과 상식이 빨리 큰다','외신이 우리 기사를 인용한다'],down:['국내 독자 반응이 약하다','국내 출입처에서는 힘이 약하다'],fx:{fame:.95,trust:1.05},ok:o=>o.type==='eng'||OHAS(o,['int','diplo'])}});
// 기존 정체성의 허용 규칙
Object.assign(OID.gov,{ok:o=>OHAS(o,['pol','diplo','city'])});Object.assign(OID.opp,{ok:o=>OHAS(o,['pol','diplo','city'])});
Object.assign(OID.corp,{ok:o=>OHAS(o,['eco','ind','fin','stock','estate','it'])||['econ','trade'].includes(o.type)});
Object.assign(OID.truth,{ok:o=>OHAS(o,['pol','soc','court','case','inv','eco','ind','med','edu','nat','city','loc','sigun','it'])});
Object.assign(OID_MAP,{dailystar:'gossip',skysports:'fandom',sportsnuri:'fandom',starlounge:'fandom',uiyak:'industry',jeonja:'industry',beopjeong:'expert',edujournal:'expert',fintimes:'expert',techreport:'datalab',ledger:'global',observer:'global',nambu:'local',honam:'local',seorak:'local',tamra:'local',donghae:'lord',gyeongin:'lord',knb:'public',on24:'short',issueinsight:'short'});
OUTLETS.forEach(o=>{if(OID_MAP[o.id])o.oid=OID_MAP[o.id];});
// 새 정체성의 매달 효과
function oidMonth2(lines){const k=oidOf(),o=OUT();const cs=x=>{if(S.founder&&S.co)S.co.cash=+(S.co.cash+x).toFixed(2);};const g=x=>{try{gain(x,.25);}catch(e){}};
  if(k==='fandom'){if(chance(.3)&&S.rank>=1){const it=makeItem(S.dept,{excl:true});it.src='소속사·구단';S.items.push(it);lines.push({c:'g',t:`팬덤 매체 — 홍보팀이 먼저 알려 줬다 → 「${it.title}」`});}cs(.02*o.p);}
  if(k==='gossip'){repN('read',-.5);repN('ind',-.3);if(chance(.07)&&S.rank>=1)S.pending.push({type:'suit',ent:null,who:pick(['연예인 소속사','유명 운동선수 측','재벌 2세 측']),due:S.turn+R(2,6),title:(mine()[0]||{}).h||'최근 보도'});cs(.025*o.p);}
  if(k==='expert'){g('ver');g('kno');repN('ind',.3);cs(-.005*o.p);}
  if(k==='industry'){cs(.03*o.p);if(chance(.2)&&S.rank>=1){const it=makeItem(S.dept,{pre:2});it.src='협회';S.items.push(it);}}
  if(k==='local'){try{(S.sources||[]).forEach(s=>s.trust=clamp(s.trust+.3,0,100));}catch(e){}repN('read',.3);cs(-.01*o.p);}
  if(k==='lord'){cs(.03*o.p);if(chance(.15)&&S.rank>=1){const it=makeItem(S.dept,{pre:1});it.src='시청';S.items.push(it);}}
  if(k==='public'){facN('civ',.1);repN('read',.3);}
  if(k==='short'){repN('read',.2);try{const K=km();if(K.pv)K.pv=Math.round(K.pv*1.1);}catch(e){}}
  if(k==='datalab'){g('dat');}
  if(k==='global'){g('lng');g('kno');}}
// 비판 기사를 쓸 때: 정체성마다 다른 반응 (경영진·팬덤 AI)
function oidPub2(it,clip){const k=oidOf();if(!clip||S.founder)return;const crit=CRIT_RE.test(it.title||'');if(!crit)return;const bs=S.rank<=5?colBy('boss'):null;const E=ENT[it.ent];
  if(k==='fandom'&&['ent','spo','base','foot','culspo'].includes(it.d)){if(chance(.5)){S.hp=clamp(S.hp-4,0,100);log('팬덤 매체 — 비판 기사에 팬들의 항의 메일이 쏟아졌다');if(bs)relUp(bs,-1,'팬덤 항의');}}
  if(k==='industry'&&E&&E.kind==='corp'&&bs){relUp(bs,-2,'업계 비판 기사');}
  if(k==='lord'&&['city','sigun','loc','nat'].includes(it.d)&&bs){relUp(bs,-2,'지역 권력 비판');}}
// 정권 교체 때 공영 언론
function oidRegime2(){if(oidOf()!=='public')return;Q.push(()=>openModal('정권 교체 · 공영 언론의 시련',`<p class="lede">새 정부가 사장 교체를 밀어붙인다. 편집국이 둘로 갈렸다.</p>`,[{label:'편집권 독립 성명에 이름을 올린다',sub:'독립 쪽으로 · 신뢰↑ · 윗선 관계↓',fn:()=>{valN('ind',4,'공영 언론 독립 성명');toast(apply({trust:1.5}));const bs=colBy('boss');if(bs)relUp(bs,-3,'독립 성명');}},{label:'새 사장을 받아들인다',sub:'타협 쪽으로',fn:()=>{valN('ind',-3);}}]));}
// 경쟁 매체 AI 대사
function oidRivalLine(k,r){return {fandom:`팬덤 매체 ${jo2(r.n,'이','가')} 단독 화보를 먼저 풀었다. 팬 커뮤니티가 그쪽 기사로 도배됐다`,gossip:`황색 매체 ${jo2(r.n,'이','가')} 스타의 사생활을 터뜨렸다. 업계가 혀를 찬다`,expert:`전문가 저널 ${jo2(r.n,'이','가')} 업계 보고서를 냈다. 출입처가 그쪽을 먼저 찾는다`,industry:`업계 대변지 ${jo2(r.n,'이','가')} 협회 입장을 그대로 실었다`,local:`풀뿌리 언론 ${jo2(r.n,'이','가')} 동네 비리를 파헤쳤다. 주민들이 그쪽에 제보한다`,lord:`토호 언론 ${jo2(r.n,'이','가')} 단체장 치적을 1면에 실었다`,public:`공영 언론 ${jo2(r.n,'이','가')} 재난 특보로 시청자를 붙잡았다`,short:`숏폼 뉴스 ${jo2(r.n,'이','가')} 1분 영상으로 조회수를 휩쓸었다`,datalab:`데이터 랩 ${jo2(r.n,'이','가')} 공공데이터로 단독을 냈다`,global:`글로벌 매체 ${jo2(r.n,'이','가')} 외신 단독 인터뷰를 따냈다`}[k];}

// ---- 좋은 길: 권력 감시견 · 약자의 목소리 · 팩트의 파수꾼 ----
Object.assign(ROUTE,{
 watch:{good:1,n:'감시견의 길',who:'권력의 감시견',lv:['출입처의 가시','권력의 저격수','권력 감시의 상징'],end:'권력 감시의 상징',fall:'펜이 꺾이다',
   up:'내부 고발이 나에게 모인다 · 신뢰와 평판이 오른다 · 시민사회가 편이 된다',down:'권력이 보복한다 — 소송·세무조사·광고 중단·통신 조회 · 압박이 끝까지 쌓이면 펜이 꺾인다'},
 voice:{good:1,n:'약자의 목소리',who:'약자의 펜',lv:['현장의 기자','약자의 대변인','약자의 펜'],end:'약자의 펜',fall:null,
   up:'피해자와 현장의 제보가 온다 · 신뢰와 독자 평판이 오른다',down:'조회수가 안 나온다며 데스크가 눈치를 준다 · 몸과 마음이 빨리 지친다'},
 fact:{good:1,n:'팩트의 파수꾼',who:'팩트의 파수꾼',lv:['깐깐한 기자','사내 검증 담당','팩트체크의 대명사'],end:'팩트체크의 대명사',fall:null,
   up:'오보 위험이 크게 준다 · 신뢰가 오르고 언론계가 인정한다',down:'느려서 단독을 놓친다 · 동료 기사의 오류를 짚으면 사이가 틀어진다'}});
const PRESS_N='압박';
function goodFit(k){const d=S.dept;if(k==='watch')return (oHas(D_POL)||oHas(D_ECO))&&(S.founder||S.rank>=3||['pol','diplo','city','court','eco','ind','fin','inv','soc','case','nat'].includes(d));return true;}
function voiceWho(){const c=cat1?cat1(S.dept):'';return {ent:'연습생과 스태프',spo:'학생 선수와 비인기 종목 선수',edu:'학생과 학부모',med:'환자와 보호자',loc:'동네 주민',it:'플랫폼 노동자'}[S.dept]||({ent:'연습생과 스태프',spo:'학생 선수',edu:'학생과 학부모'}[c])||'노동자와 피해자';}
// 길 제안 AI: 가치·정체성·부서를 보고 좋은 길과 어두운 길 가운데 고른다
function goodOfferW(){const V=valS(),k=oidOf();let w=1+Math.max(0,V.ind)/10+Math.max(0,V.pb)/10+Math.max(0,-V.sp)/12;if(['truth','opp','public','expert','local'].includes(k))w+=1;if(['gov','click','gossip','lord','corp','industry'].includes(k))w*=.6;if(S.traits&&S.traits.includes('justice'))w+=.6;return w;}
function darkOfferW(){const V=valS(),k=oidOf();let w=1+Math.max(0,-V.ind)/10+Math.max(0,-V.pb)/10;if(['gov','click','gossip','lord','corp','industry'].includes(k))w+=1;if(['truth','public','expert'].includes(k))w*=.4;return w;}
function goodOffer(){const V=valS();const c=[];if(goodFit('watch')&&(V.ind>=0||chance(.4)))c.push('watch');if(V.pb>=0||chance(.5))c.push('voice');if(V.sp<=0||chance(.5))c.push('fact');if(!c.length)c.push('fact');const k=rAffPick(c);const D=ROUTE[k];
  const msg={watch:`${jo2(pick(['시민단체 활동가','퇴직 공무원','대기업 내부자']),'이','가')} 조용히 찾아왔다. "기자님 기사 계속 봤어요. 이걸 끝까지 쓸 사람은 기자님뿐입니다." 서류 봉투가 묵직하다.`,voice:`${voiceWho()} 몇 사람이 편집국 로비에서 기다리고 있었다. "아무도 우리 얘기를 안 써 줘요."`,fact:`오보 정정이 이어지자 ${S.rank>=6?'사장이':S.rank===5?'편집국장이':'편집국장이'} 불렀다. "자네처럼 깐깐한 사람이 사내 검증을 맡아 줘야겠어."`}[k];
  S.routeT=S.turn;Q.push(()=>openModal(`${D.n} — 부름`,`<p class="lede">${esc(msg)}</p><p class="hint"><span style="color:var(--good)">이점</span> ${D.up}<br><span style="color:var(--red)">단점</span> ${D.down}<br>끝까지 가면 「${D.end}」${D.fall?`, 압박에 무너지면 「${D.fall}」`:''}.</p>`,[
   {label:'이 길을 걷는다',sub:`${D.lv[0]} · 매달 이점과 대가가 함께 온다`,fn:()=>{S.route={k,lv:1,heat:5,t0:S.turn,up:S.turn+YW,good:1};valN(k==='voice'?'pb':k==='fact'?'sp':'ind',k==='fact'?-6:6,`${D.n}에 들어섰다`);log(`${D.n} — ${D.lv[0]}`);ach('goodIn');}},
   {label:'아직은 아니다',cls:'ghost',sub:'지금처럼 일한다'}]));}
// 매달: 이점, 대가, 그리고 AI의 반응
function goodMonth(lines){const Rt=S.route,L=Rt.lv,k=oidOf(),D=ROUTE[Rt.k];const bs=!S.founder&&S.rank<=5?colBy('boss'):null;
  // 경영진 AI: 회사 정체성에 따라 감싸거나 견제한다
  const backs=['truth','opp','public','expert','local','neu'].includes(k),blocks=['gov','corp','lord','industry','click','gossip'].includes(k);
  let pk=Rt.k==='watch'?4*L:Rt.k==='voice'?1.5*L:1.2*L;pk*=backs?.75:blocks?1.5:1;
  if(Rt.k==='watch'){const tgt=watchTarget();if(chance(.3+.05*L)&&S.rank>=1){let it=null;for(let i=0;i<6;i++){const c=makeItem(S.dept,{excl:true,mult:1.08+.05*L,keyConf:L>=2});if(!it||facOf(c)===tgt)it=c;if(facOf(c)===tgt)break;}it.src='내부 고발자';it.wb=1;S.items.push(it);const ft=facOf(it);lines.push({c:'g',t:`감시견의 길 — ${ft?FAC[ft][0]+' 내부에서':'익명의 내부자에게서'} 고발 메일이 왔다 → 「${it.title}」`});}
    lines.push({c:'',t:`감시견의 길 — ${apply({trust:.25*L,fame:.15*L})}`});facN('civ',.3*L);valN('ind',1.5);
    // 권력 AI: 내가 많이 때린 세력이, 힘이 셀수록 세게 반격한다
    pk*=clamp((S.fac?S.fac[tgt]:55)/55,.6,1.6);if(S.fac&&S.fac.civ>60)pk*=.8;
    if(Rt.heat>=45&&chance((Rt.heat-35)/110))Q.push(()=>watchHit(tgt));
    // 동맹 AI: 진실의 수호자·야성의 언론 기자가 공동 취재를 제안한다
    if(chance(.08)){const al=OUTLETS.find(o=>o.id!==S.outlet&&!o.closed&&!o.custom&&['truth','opp'].includes(oidOf(o)));if(al)Q.push(()=>openModal('연대의 손길',`<p class="lede">${esc(al.n)} 기자가 연락해 왔다. "그 건, 우리도 쫓고 있어요. 같이 쓰면 저쪽도 함부로 못 합니다."</p>`,[{label:'공동 취재한다',sub:`${PRESS_N}↓ · 단독은 나눠 갖는다`,fn:()=>{Rt.heat=Math.max(0,Rt.heat-15);const it=makeItem(S.dept,{excl:false,mult:1.2,pre:1});it.src=al.n+' 공동 취재';S.items.push(it);toast('공동 취재 팀이 꾸려졌다');}},{label:'우리 힘으로 간다',cls:'ghost',sub:'단독은 지키지만 압박은 혼자 진다'}]));}
    // 어용 매체 AI: 나를 "가짜뉴스"로 몰아간다
    if(chance(.06)){const g=OUTLETS.find(o=>o.id!==S.outlet&&!o.closed&&oidOf(o)==='gov');if(g){Rt.heat+=4;repN(S.world?S.world.ruling:'cons',-2);lines.push({c:'r',t:`어용 언론 ${jo2(g.n,'이','가')} 나를 "가짜뉴스 생산자"로 몰아세웠다. 집권 진영 평판이 깎였다`});}}}
  if(Rt.k==='voice'){if(chance(.4)&&S.rank>=1){const it=makeItem(S.dept,{mult:1.05+.04*L,keyConf:true});it.src=voiceWho();S.items.push(it);lines.push({c:'g',t:`약자의 목소리 — ${voiceWho()}에게서 제보가 왔다 → 「${it.title}」`});}
    repN('read',.5*L);lines.push({c:'',t:`약자의 목소리 — ${apply({trust:.3*L})}`});S.hp=clamp(S.hp-1.5*L,0,100);valN('pb',1.5);
    if(blocks&&bs&&chance(.2)){relUp(bs,-2,'돈 안 되는 기사');lines.push({c:'r',t:`${jo2(bs.name,'이','가')} 한숨을 쉬었다. "그런 기사 누가 읽어. 조회수 좀 생각해."`});}
    if(backs&&chance(.15)){apply(S.founder?{fame:.5}:{eval:.6});lines.push({c:'g',t:'회사가 내 연속 보도를 기획으로 키워 줬다'});}
    if(S.hp<15&&chance(.35)){lines.push({c:'r',t:'약자의 목소리 — 남의 아픔을 너무 오래 들었다. 마음이 바닥났다'});gain('men',-2);Rt.heat+=10;}}
  if(Rt.k==='fact'){repN('ind',.5*L);lines.push({c:'',t:`검증의 길 — ${apply({trust:.25*L})}`});valN('sp',-1.5);
    if(chance(.25)){const c=pick((S.cols||[]).concat(S.mates||[]).filter(x=>x&&x.name&&x.rel!=null))||null;if(c)Q.push(()=>openModal('동료 기사의 오류',`<p class="lede">${esc(c.name)}의 출고 기사에서 숫자 하나가 틀린 걸 찾았다. 아직 아무도 모른다.</p>`,[
      {label:'정정을 요청한다',sub:'신뢰↑ · 그 사람과 사이↓ · 언론계 평판↑',fn:()=>{c.rel=clamp(c.rel-8,-50,100);repN('ind',1);toast(apply({trust:.8}));Rt.heat+=3;}},
      {label:'조용히 귀띔만 한다',sub:'사이↑ · 신뢰는 조금',fn:()=>{c.rel=clamp(c.rel+5,-50,100);toast(apply({trust:.2}));}}]));}
    // 경쟁사 AI: 느린 나를 앞질러 간다
    const ex=(S.items||[]).filter(i=>i.excl);if(ex.length&&chance(.12)){const it=pick(ex);it.excl=false;it.exclLost=1;lines.push({c:'r',t:`확인에 시간을 들이는 사이 경쟁사가 「${it.title}」${jp(it.title,'을','를')} 먼저 썼다`});}}
  Rt.heat=clamp(Rt.heat+pk*dk('route')-(Rt.k==='watch'?0:2),0,100);
  // 단계 오르기
  if(S.turn>=Rt.up&&L<3)Q.push(()=>openModal(`${D.n} — 한 걸음 더`,`<p class="lede">${esc(jo2(D.lv[L],'이','가'))} 될 수 있다. 이점이 커지는 만큼 ${Rt.k==='watch'?'권력의 압박':'대가'}도 커진다.</p>`,[{label:'더 나아간다',sub:D.lv[L],fn:()=>{Rt.lv++;Rt.up=S.turn+YW;if(Rt.lv>=3)ach('goodTop');log(`${D.n} — ${D.lv[Rt.lv-1]}`);}},{label:'지금 자리에서',cls:'ghost',fn:()=>{Rt.up=S.turn+YW;}}]));
  // 끝: 명예로운 마무리
  if(L>=3&&Rt.heat<75&&years()>=6&&(S.fame||0)>=45&&chance(.1))Q.push(()=>openModal(D.end,`<p class="lede">${{watch:'언론자유상 시상식. 내가 쓴 기사로 물러난 사람들의 이름이 화면에 지나간다. "이 사람이 있어서 권력이 조심했다."',voice:'인권보도상을 받는 날, 내가 썼던 사람들이 객석에 앉아 있었다.',fact:'업계가 나를 "팩트체크의 대명사"라 부른다. 대학과 언론재단이 검증 교육을 맡아 달라고 한다.'}[Rt.k]}</p><p class="hint">여기서 펜을 내려놓으면 이 길의 끝으로 남는다.</p>`,[{label:'명예롭게 마무리한다 (커리어 마무리)',sub:'이 길의 끝 엔딩',fn:()=>{ending(D.end);return false;}},{label:'아직 쓸 기사가 남았다',cls:'ghost'}]));
  // 압박이 한계에 이르면
  if(Rt.k==='watch'&&Rt.heat>=95&&chance(.4))Q.push(()=>openModal('마지막 압박',`<p class="lede">${S.founder?'광고주가 모두 빠져나갔고, 세무조사가 석 달째다.':'사장실에서 "이번이 마지막 경고"라는 말이 나왔다. 해고 사유서 초안이 돌고 있다.'}</p>`,[
    {label:'끝까지 쓴다',risk:true,sub:'펜이 꺾일 수 있다',fn:()=>{if(chance(.45+(S.fac&&S.fac.civ>60?.2:0))){Rt.heat=55;ach('unbroken');toast(apply({fame:3,trust:2}));log('압박을 버텨 냈다');}else{ending(D.fall);return false;}}},
    {label:'한발 물러선다',sub:'길이 끝난다 · 타협 쪽으로',fn:()=>{valN('ind',-6,'압박에 물러섰다');routeQuit();}}]));
  if(Rt.k==='voice'&&Rt.heat>=90){lines.push({c:'r',t:'약자의 목소리 — 더는 버틸 수 없었다. 잠시 이 길을 내려놓는다'});routeQuit();try{trChange('timid',null,'소진','남의 아픔을 너무 오래 들었다. 이제는 조금 무섭다.');}catch(e){}}
  if(Rt.k==='fact'&&Rt.heat>=90){lines.push({c:'r',t:'검증의 길 — 편집국에서 외톨이가 됐다. 검증 담당을 내려놓는다'});routeQuit();}}
// 권력의 보복: 대상 세력마다 다른 방식
function watchTarget(){const W=S.watchHit||{};const ks=Object.keys(W).filter(k=>FAC[k]);return ks.length?ks.sort((a,b)=>W[b]-W[a])[0]:(oHas(D_POL)?'gov':'chae');}
function watchHit(f){const Rt=S.route;if(!Rt||Rt.k!=='watch')return closeModal();const how={gov:['세무조사','정부가 우리 회사에 세무조사를 통보했다. 출입 기자단에서도 나를 빼자는 말이 돈다.'],opp:['고소','야당 의원실이 나를 명예훼손으로 고소했다.'],chae:['광고 중단','그룹 계열사 광고가 일제히 끊겼다. 광고국이 편집국에 항의 전화를 했다.'],pros:['통신 조회','검찰이 내 통화 기록을 조회했다는 통지서가 왔다.'],civ:['낙인','시민단체 일부가 내 기사를 "편향"이라며 성명을 냈다.']}[f]||['압박','어디선가 압박이 들어온다.'];
  openModal(`권력의 보복 · ${how[0]}`,`<p class="lede">${how[1]}</p><p class="hint">${PRESS_N} ${Math.round(Rt.heat)}/100 · 끝까지 쌓이면 펜이 꺾일 수 있다</p>`,[
   {label:'버틴다',sub:'압박 그대로 · 이름값↑',fn:()=>{toast(apply({fame:.8}));if(f==='chae'&&S.founder&&S.co)S.co.cash-=.2;if(f==='opp'||f==='pros')S.pending.push({type:'suit',ent:null,who:FAC[f][0],due:S.turn+R(2,5),title:(mine()[0]||{}).h||'최근 보도'});}},
   {label:'시민사회에 연대를 요청한다',sub:S.fac&&S.fac.civ>=50?'시민사회가 힘이 있다 · 압박↓↓':'시민사회 힘이 약하다 · 효과 적음',fn:()=>{Rt.heat=Math.max(0,Rt.heat-(S.fac&&S.fac.civ>=50?30:10));facN('civ',1);toast('연대 성명이 나왔다');}},
   {label:'한발 물러선다',sub:'압박↓ · 타협 쪽으로',fn:()=>{Rt.heat=Math.max(0,Rt.heat-20);valN('ind',-3,'보복에 물러섰다');}}]);}

// ---- 기자의 길 확장: 어두운 길 다섯 · 좋은 길 셋 · 길마다 고유 업무와 개성 ----
Object.assign(ROUTE.gov,{ex:'어용 논란',exL:'"정부 보도자료를 토씨 하나 안 바꿨다" — 미디어 비평지가 내 기사 열 건을 나란히 비교했다.',fallL:'정권 실세의 비리가 터지면서 그 스피커였던 내 이름이 맨 앞에 올랐다.',endL:'대통령실에서 대변인 자리를 제안했다. 펜을 내려놓고 마이크를 잡을 때다.',persona:'권력의 나팔수',act:'정부 대변 기사',actD:'정부 입장을 앞세운 기사를 바로 낸다. 평가↑ · 신뢰↓ · 노출 위험↑',pass:'정부 우호 기사는 완성도가 오르고, 정부 비판 기사는 스스로 무뎌진다'});
Object.assign(ROUTE.gire,{ex:'기레기 낙인',exL:'"이 기자 기사 절반이 정정보도" — 커뮤니티에 내 이름이 박힌 캡처가 돈다.',fallL:'언론중재위원회와 법원이 같은 이름을 반복해서 부른다. 회사가 더는 감싸지 않는다.',endL:'포털이 우리 매체를 클릭 1위로 발표했다. 업계는 나를 "클릭의 제왕"이라 부른다. 이대로 은퇴하면 전설로 남는다.',persona:'클릭 장사꾼',act:'받아쓰기 폭격',actD:'실검 기사 수십 꼭지를 한꺼번에 낸다. 조회수·출고량↑ · 신뢰↓',pass:'기사가 빨라지고 제목이 세지지만 오보 위험이 커진다'});
Object.assign(ROUTE.poli,{ex:'정치권 유착 의혹',exL:'"○○ 의원과 기자의 수상한 관계" — 경쟁지가 내 이름을 실었다.',fallL:'검찰이 의원실을 압수수색했다. 장부에 내 이름이 있었다.',endL:'당에서 비례대표 공천을 제안했다. 기자 출신 국회의원이 될 기회다.',persona:'정치권의 그림자',act:'의원실 저녁',actD:'의원실과 저녁을 먹는다. 돈·정치권 단독 · 노출 위험↑',pass:'정치권 취재원이 늘 곁에 있다'});
Object.assign(ROUTE,{
 agit:{n:'선동가의 길',who:'진영의 확성기',lv:['진영의 스피커','광장의 스타','진영의 아이콘'],end:'광장의 스타 유튜버',fall:'가짜뉴스 유포자',
   up:'한 진영의 스타가 된다 · 이름값과 후원금이 쏟아진다',down:'반대 진영이 적이 된다 · 신뢰가 깎이고 오보·소송 위험이 커진다',
   ex:'선동 논란',exL:'"사실보다 분노를 판다" — 팩트체크 센터가 내 방송 발언 열 개를 검증했다. 절반이 틀렸다.',fallL:'내가 퍼뜨린 의혹이 완전히 거짓으로 드러났다. 법원이 손해배상을 명령했고 회사가 나를 내보낸다.',endL:'유튜브 구독자가 회사 독자보다 많아졌다. 회사를 나와 내 채널로 가자는 제안이 쏟아진다.',
   persona:'진영의 확성기',act:'유튜브 생방송',actD:'우리 진영을 위한 생방송을 한다. 이름값·후원↑ · 반대 진영 평판↓ · 오보 위험',pass:'우리 진영 논조로 쓴 기사는 완성도가 오르지만 오보 위험도 커진다'},
 hire:{n:'청부 기사의 길',who:'기사 브로커',lv:['협찬 기사 담당','기사 영업왕','기사 브로커'],end:'홍보대행사 대표',fall:'기사 거래 적발',
   up:'기사를 팔아 돈과 광고 실적이 쌓인다 · 회사가 반긴다',down:'신뢰가 깎이고 윤리 논란이 따라온다 · 독자가 등을 돌린다',
   ex:'기사형 광고 논란',exL:'"기사인 줄 알았는데 광고였다" — 언론 감시 단체가 내 이름이 박힌 기사 목록을 공개했다.',fallL:'검찰이 기사 거래 장부를 압수했다. 기사 한 건에 얼마를 받았는지 다 적혀 있었다.',endL:'홍보대행사가 대표 자리를 제안했다. 이제 기사를 쓰는 대신 기사를 사는 쪽으로 간다.',
   persona:'기사 브로커',act:'청부 기사 쓰기',actD:'돈을 받고 기업·기관 홍보 기사를 쓴다. 돈·광고 실적↑ · 신뢰↓ · 윤리 논란 위험',pass:'광고주 기사는 완성도가 오르고 광고국이 나를 아낀다'}});
Object.assign(ROUTE.watch,{persona:'권력의 감시견',act:'권력 감시 보도',actD:'감시하던 세력을 겨눈 기사를 준비한다. 단독 아이템 · 권력의 압박↑',pass:'비판 기사의 완성도가 오른다'});
Object.assign(ROUTE.voice,{persona:'약자의 펜',act:'현장 연속 보도',actD:'현장에 며칠 머문다. 확인된 아이템 · 신뢰↑ · 컨디션↓',pass:'사람 이야기·현장 각도의 기사가 깊어진다'});
Object.assign(ROUTE.fact,{n:'검증의 길',persona:'팩트의 파수꾼',act:'내 기사 재검증',actD:'지난 기사를 다시 검증한다. 숨은 오보를 미리 찾아 정정할 수 있다 · 신뢰↑',pass:'오보 위험이 크게 준다'});
const DARK_K=['gov','gire','poli','agit','hire'],GOOD_K=['watch','voice','fact'];
// 길 고유 업무
function rtAct(){const Rt=S.route;if(!Rt)return;const k=Rt.k,L=Rt.lv,D=ROUTE[k],w=S.world||{ruling:'cons'};let h='',fx='';
  if(k==='gov'){spend(1,3);facN('gov',1);repN(w.ruling,2);Rt.heat+=4;fx=apply(S.founder?{fame:.4,trust:-1}:{eval:.8+.3*L,trust:-1});h='정부 입장을 그대로 담은 기사가 나갔다. 대통령실에서 고맙다는 문자가 왔다.';}
  if(k==='gire'){spend(1,2);const v=Math.round((OUT().p+1)*R(15,30)*1000*L);const K=km();K.pv=(K.pv||0)+v;K.pub=(K.pub||0)+2;Rt.heat+=4;try{if(chance(.2))portalPen(1,'어뷰징');}catch(e){}fx=apply(S.founder?{fame:.5,trust:-1.2}:{eval:.6+.2*L,trust:-1.2});h=`실검 기사 ${8+L*4}꼭지를 쏟아냈다. 조회수 ${v.toLocaleString('ko-KR')}.`;}
  if(k==='poli'){spend(1,3);S.money+=20*L;const it=makeItem(S.dept,{excl:true,pre:1});it.src='의원실';S.items.push(it);Rt.heat+=5;fx=apply({trust:-.5});h=`의원실 저녁. 봉투와 함께 단독 하나 → 「${esc(it.title)}」 · 돈 +${20*L}만`;}
  if(k==='agit'){spend(1,5);const c=Rt.camp||'cons',o2=c==='cons'?'prog':'cons';repN(c,3+L);repN(o2,-(3+L));S.money+=10*L;Rt.heat+=4;if(chance(.12))S.pending.push({type:'err',title:'유튜브 생방송 발언',due:S.turn+R(2,6)});fx=apply({fame:.8+.3*L,trust:-1});h=`${jo2(CAMP[c],'을','를')} 위한 생방송. 동시 접속자가 기록을 깼고 후원금이 쏟아졌다 · 후원 +${10*L}만`;}
  if(k==='hire'){spend(1,2);S.money+=30*L;Rt.heat+=5;try{if(S.co){S.adQ=(S.adQ||0)+.05*L;S.adTotal=(S.adTotal||0)+.05*L;S.co.cash+=.04*L;}}catch(e){}if(chance(.1))S.pending.push({type:'ethic',why:'돈을 받고 기사를 썼다는 의혹',title:'청부 기사',due:S.turn+R(4,12)});fx=apply({trust:-1.5});h=`기업 홍보 기사를 써 줬다. 봉투 +${30*L}만 · 광고국이 웃는다.`;}
  if(k==='watch'){spend(1,4);const f=watchTarget();let it=null;for(let i=0;i<6;i++){const c=makeItem(S.dept,{excl:true,mult:1.1+.05*L});if(!it||facOf(c)===f)it=c;if(facOf(c)===f)break;}it.src='감시 보도';S.items.push(it);Rt.heat+=5;h=`${FAC[f][0]}의 약한 고리를 짚었다 → 「${esc(it.title)}」`;}
  if(k==='voice'){spend(1,7);const it=makeItem(S.dept,{keyConf:true,pre:1,mult:1.05+.05*L});it.src='현장';S.items.push(it);fx=apply({trust:.5+.15*L});h=`사흘을 현장에 머물렀다. ${jo2(voiceWho(),'이','가')} 입을 열었다 → 「${esc(it.title)}」`;}
  if(k==='fact'){spend(1,3);const e=(S.pending||[]).find(p=>p.type==='err');if(e&&chance(.5+.15*L)){S.pending=S.pending.filter(p=>p!==e);fx=apply({trust:.8});h=`지난 기사 「${esc(e.title)}」에서 틀린 곳을 찾아 먼저 정정했다. 오보가 될 뻔했다.`;}else{fx=apply({trust:.4});repN('ind',.5);h='지난 기사들을 다시 확인했다. 다행히 이번엔 문제가 없었다.';}}
  Rt.heat=Math.min(100,Rt.heat);setCd('rtact');openModal(D.act,`<p class="lede">${h}</p>${fx?fxLine(fx):''}<p class="hint">${D.n} · ${esc(D.lv[L-1])} · ${D.good?'압박':'노출 위험'} ${Math.round(Rt.heat)}/100</p>`);}
// 길이 기사에 남기는 개성
function rtWriteQ(it,W){const Rt=S.route;if(!Rt)return 0;const k=Rt.k,L=Rt.lv;const crit=CRIT_RE.test(it.title||'');const f=facOf(it);
  if(k==='gov')return f==='gov'?(crit?-6:2+L):0;if(k==='gire')return 2+L;if(k==='agit')return W&&W.angle===Rt.camp?3+L*1.5:0;if(k==='hire')return it.adv||(ENT[it.ent]&&ENT[it.ent].kind==='corp'&&!crit)?2+L*1.5:0;
  if(k==='watch')return crit?1.5+L:0;if(k==='voice')return W&&(W.angle==='hu'||W.angle==='re')?1.5+L:0;return 0;}
function rtRisk(){const Rt=S.route;if(!Rt)return 1;return {gire:1.15,agit:1.2,fact:1-.12*Rt.lv}[Rt.k]||1;}
// 기자의 길 카드 안의 길 목록
function pathsHTML(){const Rt=S.route;const row=k=>{const D=ROUTE[k],on=Rt&&Rt.k===k;return `<div class="pth ${on?'on':''} ${D.good?'gd':'dk'}">${rtImg(k,'pi',!on)}<b>${D.n}</b>${on?` · ${esc(D.lv[Rt.lv-1])}`:''}<small>${on?`업계는 나를 「${esc(D.persona)}」${/[가-힣]/.test(D.persona.slice(-1))&&(D.persona.slice(-1).charCodeAt(0)-44032)%28?'이라':'라'} 부른다 · 고유 업무 「${D.act}」 · ${esc(D.pass)}`:`${esc(D.up.split(' · ')[0])} / ${esc(D.down.split(' · ')[0])}`}</small></div>`;};
  return `<div class="sec" style="margin-top:8px">걸을 수 있는 길 <small style="font-weight:400;color:var(--mute)">제안이 오면 걷는다 · 한 번에 하나</small></div>${Rt?routeBox():''}<div class="pths">${GOOD_K.map(row).join('')}${DARK_K.map(row).join('')}</div>`;}
// 경쟁 기자 AI: 라이벌도 자기 길을 걷는다
const RV_ROUTE={gov:'gov',click:'gire',gossip:'gire',fandom:'gire',lord:'poli',corp:'hire',industry:'hire',truth:'watch',opp:'watch',public:'voice',local:'voice',expert:'fact',datalab:'fact',short:'gire',global:'fact'};
function rivalRoute(lines){const rv=S.rival;if(!rv||rv.pub||S.story||S.founder||S.rank<1)return;const ro=OUTLETS.find(o=>o.id===rv.outlet);if(!ro)return;
  if(!rv.route){const k=RV_ROUTE[oidOf(ro)]||pick(['fact','voice','gire','agit']);rv.route={k,lv:1,heat:10,t:S.turn};if(k==='agit')rv.route.camp=ro.lean==='prog'?'prog':'cons';return;}
  const R0=rv.route,D=ROUTE[R0.k];if(R0.done)return;if(S.turn-R0.t>=YW&&R0.lv<3&&chance(.3)){R0.lv++;R0.t=S.turn;lines.push({c:'',t:`라이벌 ${rv.name}(${ro.n}) — ${D.n}에서 「${D.lv[R0.lv-1]}」 소리를 듣는다`});}
  if(!D.good){R0.heat=Math.min(100,R0.heat+R(2,5));if(R0.heat>=100&&chance(.3)){R0.done=1;lines.push({c:'g',t:`라이벌 ${rv.name} — 「${D.fall}」. ${D.n}의 끝은 결국 몰락이었다. 업계가 내 이름을 다시 보기 시작했다`});apply({fame:1.5});return;}}
  if(!chance(.1*dk('rival')))return;const me=S.route;
  if(R0.k==='gov'){const ex0=(S.items||[]).filter(i=>i.excl&&facOf(i)==='gov'),ex=ex0.filter(aiStealable);if(!ex.length)aiChase(ex0,`라이벌 ${jo2(rv.name,'이','가')}`,lines);else if(ex.length){const it=pick(ex);it.excl=false;it.exclLost=1;rv.wins++;lines.push({c:'r',t:`라이벌 ${jo2(rv.name,'이','가')} 정부 자료를 받아 「${it.title}」${jp(it.title,'을','를')} 먼저 썼다`});}}
  else if(R0.k==='gire'){try{const K=km();if(K.pv)K.pv=Math.round(K.pv*.93);}catch(e){}lines.push({c:'',t:`라이벌 ${jo2(rv.name,'이','가')} 같은 사건 기사를 하루 서른 건 쏟아냈다. 내 기사 조회수가 밀린다`});}
  else if(R0.k==='agit'){repN(R0.camp==='cons'?'prog':'cons',-1);lines.push({c:'r',t:`라이벌 ${jo2(rv.name,'이','가')} 유튜브 생방송에서 내 기사를 "편파 보도"라고 몰아세웠다`});}
  else if(R0.k==='poli'||R0.k==='hire'){if(me&&me.k==='watch'){Q.push(()=>openModal('라이벌의 약점',`<p class="lede">라이벌 ${jo2(esc(rv.name),'이','가')} ${R0.k==='poli'?'의원실에서 돈을 받은':'돈을 받고 기사를 써 준'} 정황이 내 손에 들어왔다.</p>`,[{label:'기사로 쓴다',sub:'대형 단독 · 라이벌 몰락 · 업계가 술렁인다',fn:()=>{R0.done=1;const it=makeItem(S.dept,{excl:true,keyConf:true,mult:1.3});it.title=`[단독] ${ro.n} 기자, ${R0.k==='poli'?'의원실 금품 수수 의혹':'기사 거래 의혹'}`;it.src='감시 보도';S.items.push(it);toast('라이벌을 겨눈 기사를 준비한다');}},{label:'덮어 둔다',sub:'라이벌이 빚을 진다',fn:()=>{rv.owe=1;toast('언젠가 갚을 날이 오겠지');}}]));}else lines.push({c:'',t:`라이벌 ${jo2(rv.name,'이','가')} 요즘 씀씀이가 커졌다는 소문이 돈다`});}
  else if(R0.k==='watch'){if(me&&DARK_K.includes(me.k)){me.heat=Math.min(100,me.heat+12);lines.push({c:'r',t:`라이벌 ${jo2(rv.name,'이','가')} 내 ${ROUTE[me.k].n} 행적을 캐고 있다. 노출 위험이 커졌다`});}else if(me&&me.good&&S.turn-(rv.offT??-999)>=YW*(rv.ally?2:1)&&(rv.offT=S.turn,true))Q.push(()=>openModal('라이벌의 제안',`<p class="lede">라이벌 ${jo2(esc(rv.name),'이','가')} 연락해 왔다. "이번 건은 같이 하자. 혼자서는 못 버텨."</p>`,[{label:'손을 잡는다',sub:'공동 취재 아이템 · 압박↓ · 라이벌과 화해',fn:()=>{me.heat=Math.max(0,me.heat-15);const it=makeItem(S.dept,{mult:1.2,pre:1});it.src=`${ro.n} 공동 취재`;S.items.push(it);rv.ally=1;toast('라이벌과 손잡았다');}},{label:'혼자 간다',cls:'ghost'}]));else{rv.wins++;lines.push({c:'r',t:`라이벌 ${jo2(rv.name,'이','가')} 권력 비리를 터뜨렸다. 이번엔 그쪽이 먼저였다`});}}
  else if(R0.k==='fact'){const e=(S.pending||[]).find(p=>p.type==='err');if(e&&me&&['gire','agit'].includes(me.k)){e.due=Math.min(e.due,S.turn+1);lines.push({c:'r',t:`라이벌 ${jo2(rv.name,'이','가')} 내 기사 「${e.title}」${jp(e.title,'을','를')} 검증하고 있다. 곧 문제가 드러날 것 같다`});}}
  else if(R0.k==='voice'){lines.push({c:'',t:`라이벌 ${rv.name}의 현장 연속 보도가 화제다. 독자들이 비교한다`});repN('read',-.3);}}

RUN.rtact=()=>rtAct();