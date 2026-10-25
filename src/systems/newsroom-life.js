/* 바이라인 — src/systems/newsroom-life.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */

// ===== 같은 부서에서 아이템을 받는다 =====
function giverPool(){const L=[];const add=(name,rel,kind,ref)=>{if(name&&name!==S.name&&!L.some(x=>x.name===name))L.push({name,rel:rel||0,kind,ref});};
  (S.cols||[]).filter(c=>['peer','senior','junior','fstaff','cofound','mentor'].includes(c.role)).forEach(c=>add(c.name,c.rel,colRole(c),c));
  if(S.rank<=1&&!S.founder)deptMates().filter(m=>(m.r||0)<2&&!/부장|국장|데스크/.test(m.role||'')).forEach(m=>add(m.name,m.rel||10,m.role||'같은 부서',m));
  if(S.rank>=2)(S.team||[]).slice(0,6).forEach(m=>add(m.name,m.rel||20,'부서원',m));return L;}
function receiveItem(){const P=giverPool();if(!P.length)return closeModal();const g=pick(P);const jr=/부서원|후배|막내/.test(g.kind||'')||(g.ref&&g.ref.role==='junior');const why=pick(jr?[['손이 모자라다','"선배, 이번 달 기획 때문에 도저히 못 쫓겠습니다. 선배가 써 주시면 좋겠어요."'],['자신이 없다','"솔직히 제가 감당할 수 있을지 모르겠어요. 같이 봐 주실래요?"']]:[
   ['출입처가 바뀌었다','"나 다음 달에 출입처 바뀌어. 이거 계속 파 볼 사람 너밖에 없다."'],
   ['손이 모자라다','"이번 달 기획 때문에 도저히 못 쫓겠어. 네가 쓰면 좋겠다."'],
   ['데스크 배정',`"${jo2(bossT(),'이','가')} 이건 네가 맡는 게 낫겠대. 내 취재 메모 줄게."`]]);
  const it=makeItem(S.dept,{excl:chance(.45),pre:R(0,2),mult:.9+Math.random()*.35,hoax:chance(g.rel<0?.35:.08)});it.from=g.name;it.fromKind=g.kind;
  openModal(`${g.name}의 제안 · 아이템 받기`,`<p class="lede">${esc(g.name)} ${esc(g.kind)}: ${why[1]}</p><p>「${esc(it.title)}」 ${it.excl?'· 단독 가능성':''} · 이미 확인된 사실 ${it.facts.filter(fOK).length}개</p><p class="hint">받으면 내 아이템이 된다. 잘 쓰면 ${esc(jo2(g.name,'과','와'))} 사이가 좋아지고, 묵히다 타사에 뺏기면 원망을 듣는다.</p>`,[
   {label:'받는다',sub:'아이템 +1 · 관계↑',fn:()=>{S.items.push(it);if(g.ref&&g.ref.rel!=null)g.ref.rel=clamp(g.ref.rel+5,-50,100);log(`${g.name}에게서 「${it.title}」${jp(it.title,'을','를')} 받았다`);toast('아이템을 넘겨받았다');}},
   {label:'같이 취재하자고 한다',sub:'확인된 사실 +1 · 바이라인 공동 · 평판 보상은 나눠 갖는다',fn:()=>{const f=it.facts.find(x=>!fOK(x));if(f){fFill(f,'공동 취재');}it.co=g.name;S.items.push(it);if(g.ref&&g.ref.rel!=null)g.ref.rel=clamp(g.ref.rel+8,-50,100);toast('공동 취재로 받았다');}},
   {label:'지금은 여력이 없다고 거절한다',sub:'관계 조금↓',fn:()=>{if(g.ref&&g.ref.rel!=null)g.ref.rel=clamp(g.ref.rel-4,-50,100);}}]);}
function itemFromCredit(it,lines){if(!it.from)return;const ref=(S.cols||[]).find(c=>c.name===it.from)||(S.mates||[]).find(m=>m.name===it.from)||(S.team||[]).find(m=>m.name===it.from);
  if(ref&&ref.rel!=null)ref.rel=clamp(ref.rel+(it.excl?10:5),-50,100);if(it.co){S.fame=Math.max(0,S.fame-.5);log(`공동 바이라인: ${it.co}`);}else log(`${jo2(it.from,'이','가')} 넘겨준 아이템을 살렸다`);}

// ===== 매체 특성: 회사마다 2가지 사풍·특징이 있고, 실제 수치에 반영된다 =====
// fx: ap(행동력 +), pay(월급 배율), grow(능력치 성장), eval/fame/trust(오를 때 배율), rel(관계), hp(컨디션 소모), item(아이템 획득), heat(타사 추격), pick(승진 경쟁), ten(승진 기간), legal(중재·소송 위험), subs·cash·q(창간: 구독·영업·품질)
const OTR={
 scoop:{n:'특종 DNA',d:'단독에 목숨 건다. 평판은 잘 오르지만 타사 추격도 거세다',fx:{fame:1.15,heat:1.25}},
 strict:{n:'깐깐한 데스크',d:'데스크가 원고를 세 번 돌려보낸다. 평가는 짜지만 오보·중재 위험이 낮다',fx:{eval:.88,legal:.7}},
 night:{n:'야근 문화',d:'밤늦게까지 편집국 불이 켜져 있다. 할 일은 더 하지만 몸이 상한다',fx:{ap:1,hp:1.25}},
 flat:{n:'수평적 조직',d:'선후배가 편하게 지낸다. 관계가 잘 쌓이고 승진 경쟁이 덜하다',fx:{rel:1.25,pick:1.1}},
 adhvy:{n:'광고 의존',d:'광고국 입김이 세다. 월급은 괜찮지만 신뢰는 잘 안 오른다',fx:{pay:1.06,trust:.85}},
 digital:{n:'디지털 퍼스트',d:'온라인 속보가 먼저다. 아이템이 잘 돌지만 깊이 있는 평가는 덜 받는다',fx:{item:1.15,eval:.95}},
 union:{n:'강한 노조',d:'노조가 버팀목이다. 연봉이 좋고 징계·해고에서 보호받는다',fx:{pay:1.05,trust:1.05}},
 owner:{n:'사주의 입김',d:'윗선 전화가 잦다. 승진은 줄 서기, 신뢰는 깎이기 쉽다',fx:{trust:.85,pick:.9}},
 school:{n:'기자 사관학교',d:'혹독하게 가르친다. 능력치가 빨리 크지만 월급은 박하다',fx:{grow:1.25,pay:.94}},
 local:{n:'지역 밀착',d:'동네 사정을 꿰고 있다. 지역 아이템과 취재원이 잘 나온다',fx:{item:1.1,rel:1.1}},
 beat:{n:'출입처 파워',d:'출입처에서 무시 못 하는 이름값. 평판이 잘 오른다',fx:{fame:1.1,item:1.05}},
 grind:{n:'박봉 고강도',d:'사람이 모자라 한 사람이 두 몫을 한다. 승진은 빠르다',fx:{ap:1,pay:.92,ten:.9}},
 slow:{n:'연공서열',d:'기수가 곧 계급이다. 승진이 느리지만 한번 오르면 안정적이다',fx:{ten:1.12,eval:1.05}},
 pride:{n:'자부심 강한 편집국',d:'기사 하나하나에 자존심을 건다. 평가는 잘 받지만 일이 많다',fx:{eval:1.08,hp:1.1}}
};
// 창간 모드에서 고르는 회사 성격
const FOTR={
 f_fact:{n:'팩트 우선',d:'느려도 정확하게. 신뢰가 잘 쌓이고 중재·소송 위험이 낮다',fx:{trust:1.2,legal:.65,item:.9}},
 f_speed:{n:'속보 우선',d:'먼저 쓰고 고친다. 트래픽·아이템이 많지만 위험도 크다',fx:{item:1.2,legal:1.3,q:.8}},
 f_member:{n:'독자 후원 중심',d:'광고 대신 후원 회원으로 버틴다. 구독은 늘지만 영업 수입이 적다',fx:{subs:1.6,cash:.85,trust:1.1}},
 f_deep:{n:'탐사 전문',d:'한 달에 한 방. 평판이 크게 오르지만 손이 많이 간다',fx:{fame:1.2,hp:1.15,q:1.3}},
 f_local:{n:'지역 밀착',d:'우리 동네 이야기. 지역 아이템과 관계가 잘 쌓인다',fx:{item:1.1,rel:1.2}},
 f_flat:{n:'수평 조직',d:'직급 없이 이름으로 부른다. 창간 멤버 관계가 잘 쌓이고 이탈이 적다',fx:{rel:1.3}},
 f_pay:{n:'고연봉 정책',d:'업계 최고 대우. 좋은 기자가 오지만 돈이 빨리 나간다',fx:{q:1.4,cash:.85}},
 f_sales:{n:'공격적 영업',d:'광고·협찬을 적극적으로. 돈은 벌지만 신뢰는 덜 오른다',fx:{cash:1.3,trust:.85}}
};
function otrDef(t){return OTR[t]||FOTR[t];}
function otrHash(id){let h=7;for(const c of String(id))h=(h*31+c.charCodeAt(0))>>>0;return h;}
function traitsOf(o){if(!o)return [];if(o.traits)return o.traits;const h=otrHash(o.id);const pool=Object.keys(OTR).filter(k=>k!=='local'||['local'].includes(o.type));
  const pref={local:['local'],online:['digital','grind'],wire:['scoop','night'],tv:['pride','union'],jp:['slow','union'],ch:['digital','night'],econ:['adhvy','beat'],daily:['strict','owner','slow','scoop'],weekly:['scoop','flat'],trade:['beat','grind'],sports:['night','digital'],eng:['flat','school']}[o.type]||[];
  const a=(h%3===0&&pref.length)?pref[h%pref.length]:pool[h%pool.length];let b=pool[(h>>>5)%pool.length];if(b===a)b=pool[((h>>>5)+3)%pool.length];
  if((a==='flat'&&b==='owner')||(a==='owner'&&b==='flat'))b='strict';if((a==='grind'&&b==='slow')||(a==='slow'&&b==='grind'))b='pride';
  o.traits=[a,b];return o.traits;}
function otr(k,o){const cur=!o;o=o||(S&&S.outlet?OUT():null);if(!o)return 1;const df=cur?((deptFx()||{})[k]||1):1;return df*traitsOf(o).reduce((m,t)=>{const d=otrDef(t);return m*(d&&d.fx[k]!=null&&k!=='ap'?d.fx[k]:1);},1)*(typeof oidFx==='function'?oidFx(o,k):1);}
function otrAp(o){o=o||OUT();if(!o)return 0;return traitsOf(o).reduce((a,t)=>a+((otrDef(t)||{fx:{}}).fx.ap||0),0);}
function otrTags(o){return (typeof oidTag==='function'?oidTag(o):'')+traitsOf(o).map(t=>{const d=otrDef(t);return d?`<span class="tag ot" title="${esc(d.d)}">${d.n}</span>`:'';}).join('');}
function otrBox(o){o=o||OUT();return `<div class="sec">우리 회사의 특성</div>${typeof oidCard==='function'?oidCard(o):''}${traitsOf(o).map(t=>{const d=otrDef(t);return d?`<div class="card"><div class="t">${d.n}</div><div class="meta"><span>${d.d}</span><span>실제 효과: ${otrFxTxt(d.fx)}</span></div></div>`:'';}).join('')}`;}
// 언론고시: 이번 시즌 채용 공고를 낸 곳만 (유형별로 고르게, 무작위)
function applyPool(){if(S.applyPool&&S.applyPoolR===(S.retries||0))return S.applyPool;const L=[];
  GROUPS.forEach(([g])=>{const os=shuffle(OUTLETS.filter(o=>!o.custom&&!o.closed&&!o.npc&&TYPES[o.type].g===g));L.push(...os.slice(0,Math.max(1,Math.round(os.length*.38))));});
  S.applyPool=L.map(o=>o.id);S.applyPoolR=S.retries||0;S.apply=(S.apply||[]).filter(id=>S.applyPool.includes(id));return S.applyPool;}

// ===== 창간 모드 10년 연대기: 창간 후 주차별 장면 (4주 = 1달, 48주 = 1년) =====
const fYr=()=>Math.floor((S.turn-(S.fStart||0))/YW);
const fN=()=>esc(OUT().n);
const fHit=(o)=>{const t=[];if(o.cash){S.co.cash+=o.cash;t.push(`자금 ${o.cash>0?'+':''}${eok(o.cash)}`);}if(o.q){S.co.q=clamp(S.co.q+o.q,10,100);t.push(`품질 ${o.q>0?'+':''}${o.q}`);}if(o.subs){S.co.subs*=1+o.subs;t.push(`구독 ${o.subs>0?'+':''}${Math.round(o.subs*100)}%`);}if(o.tr){S.co.tr=Math.round(S.co.tr*(1+o.tr));t.push(`트래픽 ${o.tr>0?'+':''}${Math.round(o.tr*100)}%`);}if(o.staff){S.co.staff=Math.max(3,S.co.staff+o.staff);if(o.staff<0){const _dr=S.team.filter(m=>(m.r||0)<2&&!(typeof lk45==='function'&&lk45(m))).sort((a,b)=>(a.skill||0)-(b.skill||0)).slice(0,-o.staff);S.team=S.team.filter(m=>!_dr.includes(m));}else for(let i=0;i<o.staff;i++)S.team.push(genMember(pick(OUT().depts)));t.push(o.staff>0?`기자 ${o.staff}명 충원`:`기자 ${-o.staff}명 이탈`);}
  const ap={};['fame','trust','eval','hp','men','net','money'].forEach(k=>{if(o[k])ap[k]=o[k];});const a=Object.keys(ap).length?apply(ap):'';if(o.rel)relAll(['fstaff','cofound','photo'],o.rel);if(o.pen)portalPen(o.pen,o.penWhy||'');return [t.join(' · '),a].filter(Boolean).join(' · ');};
const fCh=(label,sub,o,after)=>({label,sub,fn:()=>{const r=fHit(o);if(after){const x=after();if(x===false)return false;}if(r)toast(r);}});
Object.assign(F_BEATS,{
 12:()=>openModal('첫 독자 메일',`<p class="lede">"「${fN()}」 기사 보고 처음으로 후원했습니다. 끝까지 버텨 주세요." 편집국 단톡방에 캡처가 돌았다.</p><p class="hint">포털 검색 제휴는 창간 1년이 지나야 신청할 수 있다. 그때까지 자체 취재 기사를 쌓아 두자.</p>`,[fCh('메일을 사무실 벽에 붙인다','사기↑',{rel:4,eval:1}),fCh('후원 독자 이름을 기사 끝에 싣는다','후원↑',{subs:.02})]),
 16:()=>openModal('첫 정정 요청',`<p class="lede">창간 넉 달 만에 첫 정정 요청이 왔다. 기사 속 숫자 하나가 틀렸다.</p>`,[fCh('바로 정정하고 사과문을 단다','신뢰↑ · 작지만 원칙',{trust:2,fame:-.3}),fCh('조용히 고친다','아무도 모를 수도 있다',{},()=>{if(chance(.35))toast(fHit({trust:-3})+' · 커뮤니티에 캡처가 돌았다');})]),
 24:()=>openModal('반년 결산',`<p class="lede">창간 6개월. 통장 잔고는 ${eok(S.co.cash)}. ${S.co.cash>8?'생각보다 버틸 만하다.':'숫자를 볼 때마다 속이 탄다.'}</p>`,[fCh('비용을 줄이고 버틴다','자금↑ · 사기↓',{cash:.3,rel:-3}),fCh('기자 1명을 더 뽑는다','자금↓ · 품질↑',{cash:-.25,staff:1,q:1}),fCh('지금처럼 간다','',{})]),
 28:()=>{const it=makeItem(S.dept,{excl:true,mult:1.25,keyConf:true});S.items.push(it);openModal('첫 단독의 냄새',`<p class="lede">창간 멤버 기자가 밤늦게 전화했다. "대표님, 이거 진짜면 크게 터집니다." → 「${esc(it.title)}」</p><p class="hint">작은 매체의 첫 단독은 이름을 알리는 가장 빠른 길이다. 대표가 직접 데스크를 봐도 된다.</p>`);},
 36:()=>openModal('보도자료 압박',`<p class="lede">지자체 홍보실이 "광고 줄 테니 보도자료를 그대로 실어 달라"고 한다. 작은 매체엔 큰돈이다.</p>`,[fCh('거절한다','신뢰↑',{trust:2},()=>{S.resist=(S.resist||0)+1;}),fCh('광고만 받고 보도자료는 고쳐 싣는다','자금↑',{cash:.15}),fCh('그대로 싣는다','자금↑↑ 신뢰↓ 포털 벌점',{cash:.35,trust:-3,pen:1,penWhy:'보도자료 전재'})]),
 40:()=>{const m=S.team[0];openModal('첫 퇴사자',`<p class="lede">${m?esc(m.name):'창간 멤버'} 기자가 사직서를 냈다. "대기업 언론사에서 연락이 왔어요. 죄송합니다."</p>`,[fCh('축하하며 보낸다','관계는 지킨다 · 기자 -1',{staff:-1,rel:2}),fCh('연봉을 올려 붙잡는다','자금↓',{cash:-.15,rel:3}),fCh('서운하다고 말한다','관계↓ · 기자 -1',{staff:-1,rel:-5})]);},
 44:()=>openModal('첫 연말',`<p class="lede">연말 후원 캠페인 시즌. 독자들에게 편지를 쓸 차례다.</p>`,[fCh('대표가 직접 편지를 쓴다','후원↑ · 컨디션↓',{subs:.05,hp:-6}),fCh('송년 후원 행사를 연다','자금↓ · 평판↑',{cash:-.08,fame:1,subs:.03}),fCh('조용히 넘어간다','',{})]),
 50:()=>openModal('포털 검색 제휴 신청 가능',`<p class="lede">창간 1년이 지났다. 이제 포털 검색 제휴를 신청할 수 있다. 심사는 자체 취재 기사 비율과 기사 수, 벌점을 본다.</p><p class="hint">할 일의 "포털 제휴 전략"에서 신청하면 반년마다 열리는 심사에 올라간다.</p>`,[{label:'자체 기사 비율부터 점검한다',sub:'품질↑',fn:()=>toast(fHit({q:1.5}))},{label:'바로 신청한다',sub:'포털 제휴 전략이 열렸다',fn:()=>{if(S.portal&&S.portal.lv<1)S.portal.apply=1;toast('검색 제휴 심사를 신청했다');}}]),
 60:()=>openModal('벤처캐피털의 미팅 요청',`<p class="lede">미디어 스타트업에 투자하는 VC가 미팅을 잡자고 한다. "성장 곡선이 보이면 10억 정도 생각합니다."</p>`,[fCh('투자를 받는다 (지분 15%)','자금 +10억 · 매달 성장 압박',{cash:10},()=>{S.equity=Math.max(30,(S.equity||100)-15);S.investor=Math.max(S.investor||0,1);if(!colBy('invdir'))S.cols.push(mkCol('invdir',5));}),fCh('지금은 아니라고 한다','편집권 온전',{trust:1})]),
 68:()=>openModal('기자상 후보',`<p class="lede">「${fN()}」 기사가 처음으로 이달의 기자상 후보에 올랐다. 심사위원들이 "작은 매체가 해냈다"고 평했다.</p>`,[fCh('취재 기자를 앞세운다','관계↑ 평판↑',{fame:1.5,rel:6}),fCh('대표 인터뷰로 알린다','평판↑↑ 관계 조금↓',{fame:2.5,rel:-2})]),
 72:()=>openModal('공유오피스 계약 만료',`<p class="lede">공유오피스가 재계약 조건으로 임대료 30% 인상을 내밀었다.</p>`,[fCh('작은 독립 사무실을 얻는다','자금 -0.4억 · 사기↑',{cash:-.4,rel:4,q:1}),fCh('올려 주고 남는다','자금 -0.15억',{cash:-.15}),fCh('원격 근무로 바꾼다','비용↓ · 협업↓',{cash:.1,q:-1.5,rel:-2})]),
 80:()=>openModal('정치인의 고소',`<p class="lede">지역구 국회의원이 우리 기사를 두고 명예훼손 고소장을 냈다. 기사 근거는 탄탄하다.</p>`,[fCh('정면 대응하고 후속 보도를 낸다','변호사비↓ · 평판↑ · 신뢰↑',{cash:-.2,fame:2,trust:2},()=>{S.resist=(S.resist||0)+1;}),fCh('조용히 합의한다','자금↓ 신뢰↓',{cash:-.1,trust:-2})]),
 88:()=>openModal('인수 제안',`<p class="lede">중견 언론 그룹이 「${fN()}」${jp(fN(),'을','를')} 사겠다고 한다. "편집국은 그대로 두겠습니다."</p><p class="hint">팔면 창간 모드가 끝난다.</p>`,[{label:'정중히 거절한다',sub:'계속 간다',fn:()=>toast(fHit({rel:4,fame:.5}))},{label:'판다 (창간 엔딩)',sub:'회사를 넘기고 떠난다',fn:()=>{S.money+=Math.round(Math.max(1,S.co.cash)*1500);ending('창간 엔딩 · 매각');return false;}}]),
 96:()=>openModal('창간 2주년',`<p class="lede">창간 2주년. 기자 ${S.co.staff}명, 구독·후원 ${f1(S.co.subs)}. 처음 노트북 몇 대로 시작한 회사다.</p>`,[fCh('2주년 기획 탐사를 띄운다','단독 아이템 · 컨디션↓',{hp:-8},()=>{S.items.push(makeItem(S.dept,{excl:true,mult:1.35}));}),fCh('구성원에게 성과급을 준다','자금↓ · 관계↑',{cash:-.2,rel:8}),fCh('독자 초청 2주년 행사','후원↑',{cash:-.06,subs:.04,trust:1})]),
 108:()=>openModal('노조를 만들겠다고 한다',`<p class="lede">기자들이 노동조합을 만들겠다고 했다. "대표님을 못 믿어서가 아니라, 회사가 커지니까요."</p>`,[fCh('지지한다고 공개적으로 말한다','신뢰↑ 관계↑ · 인건비 조금↑',{trust:3,rel:8},()=>{S.co.extra=(S.co.extra||0)+.02;}),fCh('대화로 풀자고 한다','',{rel:1}),fCh('시기상조라며 막는다','관계↓↓ · 이탈 위험',{rel:-10,trust:-2})]),
 120:()=>openModal('대형 오보 위기',`<p class="lede">우리 단독 기사 속 핵심 증언자가 "그런 말 한 적 없다"고 나섰다. 녹취는 있지만 맥락이 애매하다.</p>`,[fCh('녹취를 공개하고 검증 과정을 밝힌다','검증력에 달렸다',{},()=>{if(chance(.4+S.st.ver/200))toast(fHit({trust:4,fame:2})+' · 의혹이 걷혔다');else{S.errors++;toast(fHit({trust:-6,fame:-2})+' · 녹취가 오히려 역풍을 맞았다');}}),fCh('기사를 내리고 사과한다','신뢰↓ · 빨리 끝난다',{trust:-3}),fCh('버틴다','소송 위험',{},()=>{S.suitQ=S.suitQ||[];S.suitQ.push({h:'단독 기사',subj:'증언자 측',unv:1,due:S.turn+8,amt:2});})]),
 132:()=>openModal('시리즈 B',`<p class="lede">${S.investor?'기존 투자사가 후속 투자를 하겠다고 한다.':'큰 투자사가 처음으로 관심을 보인다.'} 조건은 이사회 한 자리와 "디지털 매출 목표".</p>`,[fCh('25억을 받는다 (지분 20%)','자금↑↑ · 간섭↑',{cash:25,trust:-1},()=>{S.equity=Math.max(25,(S.equity||100)-20);S.investor=2;if(!colBy('invdir'))S.cols.push(mkCol('invdir',0));}),fCh('후원 회원 크라우드펀딩으로 대신한다','자금↑ · 신뢰↑',{cash:3,trust:2,subs:.05}),fCh('받지 않는다','',{})]),
 144:()=>openModal('창간 3주년',`<p class="lede">3년. 업계에서 「${fN()}」${jp(fN(),'을','를')} "버틴 매체"라고 부르기 시작했다.</p>`,[fCh('편집 원칙을 담은 윤리강령을 발표한다','신뢰↑',{trust:3}),fCh('영상팀을 만든다','자금↓ · 트래픽↑',{cash:-.8,tr:.12},()=>{S.facil=S.facil||{};S.facil.studio=1;}),fCh('지역 주재 기자를 둔다','자금↓ · 지역 아이템↑',{cash:-.3,staff:1})]),
 156:()=>{const c=colBy('cofound');openModal('공동창업자와의 갈등',`<p class="lede">${c?esc(c.name)+' 편집장':'편집장'}이 "회사가 돈만 본다"며 사의를 밝혔다. ${c&&c.rel<30?'요즘 둘 사이가 멀어진 게 사실이다.':''}</p>`,[fCh('편집권 전권을 약속하고 붙잡는다','관계↑ · 대표 영향력↓',{rel:6,trust:1},()=>{if(c)relUp(c,20,'편집권 약속');}),fCh('보내고 새 편집장을 뽑는다','품질↓ 잠시',{q:-3},()=>{if(c){swapCol(c);}}),fCh('내가 편집장을 겸한다','컨디션↓↓ · 품질 유지',{hp:-15})]);},
 168:()=>openModal('콘텐츠 제휴(CP) 심사 기회',`<p class="lede">포털이 콘텐츠 제휴 매체를 추가 선정한다는 공고를 냈다. ${S.portal&&S.portal.lv>=2?'지금 등급이면 도전할 만하다.':'아직 등급이 낮아 쉽지 않다.'}</p>`,[{label:'총력전으로 심사를 준비한다',sub:'자체 기사·벌점 정리 · 컨디션↓',fn:()=>{S.portal.pen=Math.max(0,S.portal.pen-2);S.portal.apply=1;toast(fHit({q:2,hp:-8}));}},fCh('다음 기회를 노린다','',{})]),
 180:()=>openModal('정부 광고 기준 변경',`<p class="lede">정부 광고 집행 기준이 "열독률" 중심으로 바뀐다. 작은 온라인 매체엔 불리하다.</p>`,[fCh('독자 조사에 돈을 쓴다','자금↓ · 광고 회복',{cash:-.2},()=>{S.co.adB=(S.co.adB||0)+.02;}),fCh('정부 광고를 포기하고 후원에 집중한다','자금↓ · 신뢰↑',{cash:-.3,trust:2,subs:.03}),fCh('업계와 함께 문제를 제기한다','평판↑',{fame:1.2})]),
 192:()=>openModal('창간 4주년 · 유료 구독',`<p class="lede">무료 기사만으로는 한계다. 핵심 탐사 기사를 유료로 묶자는 안이 올라왔다.</p>`,[fCh('유료 구독을 시작한다','구독 수입↑ 트래픽↓',{subs:.1,tr:-.08},()=>{S.facil=S.facil||{};S.facil.paywall=1;}),fCh('후원제는 유지한다','신뢰↑',{trust:1.5})]),
 204:()=>openModal('대기업의 전화',`<p class="lede">우리 기사에 나온 대기업 홍보실장: "올해 광고 예산 3억, 그 기사 하나만 내려 주시면."</p>`,[fCh('거절하고 통화 내용을 기사로 쓴다','평판↑↑ 신뢰↑ · 광고 손실',{fame:3,trust:3,cash:-.2},()=>{S.resist=(S.resist||0)+1;}),fCh('거절만 한다','신뢰↑',{trust:1.5}),fCh('기사를 내린다','자금↑↑ 신뢰↓↓',{cash:3,trust:-8,eval:-3})]),
 216:()=>openModal('AI 기사 도입 논란',`<p class="lede">사업 이사가 "증시·날씨·스포츠 결과 기사는 AI로 쓰자"고 제안했다. 기자들은 반발한다.</p>`,[fCh('단순 기사만 AI로, 표시를 단다','트래픽↑ · 관계 조금↓',{tr:.06,rel:-2},()=>{S.facil=S.facil||{};S.facil.ai=1;}),fCh('도입하지 않는다','관계↑',{rel:4}),fCh('전면 도입한다','비용↓ 품질↓ 포털 벌점',{cash:.3,q:-3,rel:-8,pen:1,penWhy:'AI 기사 남발'})]),
 240:()=>openModal('창간 5주년',`<p class="lede">5년. 「${fN()}」${jp(fN(),'은','는')} 이제 업계가 아는 이름이다. 건물주가 "아예 이 층을 사시라"고 한다.</p>`,[fCh('사무실을 매입한다','자금 -3억 · 임대료 걱정 끝',{cash:-3,rel:5},()=>{S.co.extra=Math.max(0,(S.co.extra||0)-.05);}),fCh('5주년 백서를 낸다','평판↑ 신뢰↑',{fame:2,trust:2,cash:-.05}),fCh('5주년 기념 대형 기획','단독 아이템 2개',{hp:-10},()=>{for(let i=0;i<2;i++)S.items.push(makeItem(pick(OUT().depts),{excl:true,mult:1.3}));})]),
 264:()=>openModal('경영권 분쟁',`<p class="lede">${S.investor?'투자사가 이사회에서 "전문 경영인"을 앉히자고 한다.':'외부 자본이 지분을 사 모으고 있다는 소문이 돈다.'}</p>`,[fCh('구성원·독자와 함께 지분을 지킨다','자금↓ · 신뢰↑',{cash:-1,trust:3},()=>{S.equity=Math.min(100,(S.equity||70)+10);}),fCh('경영 일부를 넘기고 편집에 집중한다','자금↑ · 영향력↓',{cash:2,eval:-3})]),
 288:()=>openModal('창간 6주년 · 방송 진출 제안',`<p class="lede">종편 채널이 「${fN()}」 기자들로 시사 프로그램을 만들자고 한다.</p>`,[fCh('참여한다','평판↑↑ · 기자 업무 부담',{fame:3,hp:-6,rel:-2}),fCh('유튜브 채널로 직접 한다','트래픽↑',{cash:-.3,tr:.1}),fCh('거절한다','',{})]),
 312:()=>openModal('다음 세대',`<p class="lede">창간 때 막내였던 기자가 이제 데스크다. 편집국 절반은 「${fN()}」에서 기자를 시작한 사람들이다.</p>`,[fCh('사내 연수 프로그램을 만든다','성장↑ · 자금↓',{cash:-.2,q:2},()=>{S.facil=S.facil||{};S.facil.academy=1;}),fCh('편집장 자리를 후배에게 넘긴다','관계↑ · 사기↑',{rel:10})]),
 336:()=>openModal('창간 7주년 · 한국기자상',`<p class="lede">${S.awards?'또다시':'처음으로'} 한국기자상 본상 후보에 올랐다. 7년간 붙들고 있던 탐사 보도다.</p>`,[fCh('수상 소감을 기자들에게 넘긴다','평판↑↑ 관계↑',{fame:4,rel:6},()=>{S.awards++;}),fCh('대표가 무대에 선다','평판↑↑↑',{fame:5},()=>{S.awards++;})]),
 360:()=>openModal('업계 단체장 제안',`<p class="lede">인터넷신문협회가 「${fN()}」 대표에게 회장을 맡아 달라고 한다.</p>`,[fCh('맡는다','평판↑ · 대외 협상↑ · 바빠진다',{fame:2,hp:-5},()=>{fgain('pr',4);}),fCh('편집국에 집중하겠다고 한다','관계↑',{rel:3})]),
 384:()=>{const rv=S.rival;openModal('창간 8주년 · 경쟁사의 몰락',`<p class="lede">${rv&&rv.pub?esc(rvLabel(rv))+'가 이끌던 매체가':'오랜 경쟁 매체가'} 자금난으로 문을 닫는다. 기자들이 갈 곳을 찾는다.</p>`,[fCh('기자들을 받아들인다','기자 +3 · 인건비↑',{staff:3,q:2,cash:-.3}),fCh('기사 아카이브를 인수한다','트래픽↑',{cash:-.5,tr:.08}),fCh('지켜본다','',{})]);},
 408:()=>openModal('파업',`<p class="lede">노조가 임금 협상 결렬로 파업을 예고했다. ${S.co.cash>10?'회사엔 여력이 있다.':'회사 사정도 넉넉하지 않다.'}</p>`,[fCh('요구를 상당 부분 받아들인다','인건비↑ · 관계↑',{rel:8},()=>{S.co.extra=(S.co.extra||0)+.04;}),fCh('경영 자료를 모두 공개하고 협상한다','신뢰↑ · 절반 합의',{trust:2,rel:2},()=>{S.co.extra=(S.co.extra||0)+.02;}),fCh('파업을 감수한다','품질↓↓ 관계↓↓',{q:-6,rel:-12,trust:-2})]),
 432:()=>openModal('창간 9주년 · 영문판',`<p class="lede">해외 언론이 우리 탐사 기사를 인용하는 일이 잦아졌다. 영문판을 내자는 안이 올라왔다.</p>`,[fCh('영문판을 낸다','평판↑ · 자금↓',{fame:2,cash:-.6,tr:.05}),fCh('외신과 기사 제휴만 한다','자금↑',{cash:.3,fame:1})]),
 456:()=>openModal('정권 교체 이후',`<p class="lede">새 정부 인사들이 "비판 언론"을 공개적으로 지목했다. 세무조사 얘기도 돈다.</p>`,[fCh('흔들리지 않고 보도한다','신뢰↑↑ · 위험',{trust:4,fame:2},()=>{if(chance(.4))S.co.cash-=1;S.resist=(S.resist||0)+1;}),fCh('수위를 조절한다','신뢰↓',{trust:-4})]),
 480:()=>openModal('창간 10주년',`<p class="lede">10년 전 노트북 몇 대로 시작한 「${fN()}」. 기자 ${S.co.staff}명, ★${OUT().p} 매체가 됐다. 첫 기사를 같이 냈던 사람들이 모였다.</p>`,[fCh('다음 10년의 비전을 발표한다','계속 간다',{fame:2,rel:6}),{label:'후배에게 대표 자리를 넘기고 물러난다',sub:'창간 엔딩',fn:()=>{ending('창간 10주년 · 아름다운 퇴장');return false;}}])
});
// 연차별 무작위 창간 이벤트 (창간 후 연수 조건)
F_EVENTS.push(
 {w:2,c:()=>S.founder&&fYr()<2,run:()=>openModal('노트북이 또 고장났다',`<p class="lede">마감 30분 전, 기자 노트북 두 대가 동시에 멈췄다.</p>`,[fCh('새로 산다','자금↓',{cash:-.03}),fCh('내 노트북을 빌려준다','컨디션↓ · 관계↑',{hp:-4,rel:3})])},
 {w:2,c:()=>S.founder&&fYr()<2,run:()=>openModal('후원 독자의 항의',`<p class="lede">고액 후원자가 "기사 방향이 마음에 안 든다. 후원 끊겠다"고 메일을 보냈다.</p>`,[fCh('원칙을 설명하는 답장을 쓴다','신뢰↑',{trust:1}),fCh('그 독자 눈치를 본다','후원 유지 · 신뢰↓',{trust:-2})])},
 {w:2,c:()=>S.founder&&fYr()<3,run:()=>openModal('주말 당번',`<p class="lede">기자가 모자라 주말 당번을 대표가 서야 한다.</p>`,[fCh('직접 선다','컨디션↓ · 관계↑',{hp:-8,rel:4}),fCh('돌아가며 맡긴다','관계↓',{rel:-3})])},
 {w:2,c:()=>S.founder&&fYr()>=1&&fYr()<4,run:()=>openModal('대형 매체 출신 지원자',`<p class="lede">대형 매체 7년 차 기자가 "의미 있는 기사를 쓰고 싶다"며 지원했다. 연봉은 지금 기자의 1.5배.</p>`,[fCh('뽑는다','품질↑ · 인건비↑',{staff:1,q:2,cash:-.1}),fCh('연봉 체계를 지키며 거절한다','',{})])},
 {w:2,c:()=>S.founder&&fYr()>=1,run:()=>openModal('지역 유력자의 초대',`<p class="lede">지역 상공회의소 회장이 골프 약속을 잡자고 한다. 광고주들이 다 모이는 자리다.</p>`,[fCh('간다 — 약속은 안 한다','자금↑ 조금 · 컨디션↓',{cash:.1,hp:-4}),fCh('정중히 거절한다','신뢰↑',{trust:1})])},
 {w:2,c:()=>S.founder&&fYr()>=2,run:()=>openModal('기자 번아웃 확산',`<p class="lede">편집국에 지친 기색이 역력하다. 병가가 늘었다.</p>`,[fCh('주 4.5일제를 도입한다','관계↑↑ · 품질 조금↓',{rel:8,q:-1}),fCh('심리 상담 지원을 시작한다','자금↓ · 관계↑',{cash:-.05,rel:5}),fCh('조금만 더 버티자','관계↓',{rel:-6})])},
 {w:2,c:()=>S.founder&&fYr()>=2,run:()=>openModal('가짜뉴스 낙인',`<p class="lede">우리 보도에 불만인 쪽이 "「${fN()}」${jp(fN(),'은','는')} 가짜뉴스"라는 영상을 퍼뜨린다.</p>`,[fCh('팩트체크 해설로 정면 반박','신뢰↑ 평판↑',{trust:2,fame:1,hp:-4}),fCh('법적 대응한다','자금↓ · 신뢰↑',{cash:-.1,trust:1.5}),fCh('무시한다','',{},()=>{if(chance(.4))toast(fHit({trust:-2,subs:-.02}));})])},
 {w:2,c:()=>S.founder&&fYr()>=2,run:()=>openModal('공동 탐사 제안',`<p class="lede">다른 독립 언론 세 곳이 대형 공동 탐사를 하자고 한다.</p>`,[fCh('참여한다','단독 아이템 · 평판↑',{fame:1},()=>{S.items.push(makeItem(pick(OUT().depts),{excl:true,mult:1.4}));}),fCh('우리 단독으로 간다','',{})])},
 {w:2,c:()=>S.founder&&fYr()>=3,run:()=>openModal('세무조사 통보',`<p class="lede">국세청이 정기 세무조사를 통보했다. 장부는 깨끗하지만 시기가 묘하다.</p>`,[fCh('성실히 받고 결과를 공개한다','신뢰↑ · 자금 조금↓',{trust:2,cash:-.1}),fCh('보복 조사라고 문제를 제기한다','평판↑ · 위험',{fame:1.5},()=>{if(chance(.3))toast(fHit({cash:-.5})+' · 추징금이 나왔다');})])},
 {w:2,c:()=>S.founder&&fYr()>=3,run:()=>openModal('기사 표절 의혹',`<p class="lede">우리 기자가 쓴 해설 기사가 외신 기사와 지나치게 비슷하다는 지적이 나왔다.</p>`,[fCh('조사위원회를 꾸리고 결과를 공개한다','신뢰↑ · 관계↓',{trust:2,rel:-3}),fCh('해당 기사만 내린다','신뢰↓',{trust:-2})])},
 {w:2,c:()=>S.founder&&fYr()>=4,run:()=>openModal('후원 회원 10주년 모임',`<p class="lede">창간 때부터 후원한 독자들이 모임을 열고 대표를 초대했다.</p>`,[fCh('간다','후원↑ 신뢰↑',{subs:.03,trust:1,hp:-3}),fCh('편집국장이 대신 간다','',{subs:.01})])},
 {w:2,c:()=>S.founder&&fYr()>=4,run:()=>openModal('스카우트 전쟁',`<p class="lede">대형 매체들이 우리 에이스 기자들에게 줄줄이 연락하고 있다.</p>`,[fCh('연봉 테이블을 올린다','인건비↑ · 이탈↓',{rel:5},()=>{S.co.extra=(S.co.extra||0)+.03;}),fCh('스톡옵션을 준다','지분↓ · 관계↑↑',{rel:9},()=>{S.equity=Math.max(20,(S.equity||100)-5);}),fCh('막지 않는다','기자 -2',{staff:-2,q:-2})])},
 {w:2,c:()=>S.founder&&fYr()>=5,run:()=>openModal('대학 강연',`<p class="lede">언론학과에서 "독립 언론 창업" 특강을 요청했다.</p>`,[fCh('간다','평판↑ · 채용에 도움',{fame:1}),fCh('바빠서 거절한다','',{})])},
 {w:2,c:()=>S.founder&&fYr()>=5,run:()=>openModal('자회사 설립 제안',`<p class="lede">사업 이사가 데이터 분석·리서치 자회사를 만들자고 한다. 기사와 이해충돌 우려도 있다.</p>`,[fCh('만든다','자금 흐름↑ · 신뢰↓ 조금',{cash:.5,trust:-1}),fCh('하지 않는다','',{trust:.5})])},
 {w:2,c:()=>S.founder&&fYr()>=6,run:()=>openModal('창간 멤버의 독립',`<p class="lede">창간 멤버 기자가 "저도 제 매체를 차려 보고 싶어요"라고 했다.</p>`,[fCh('응원하고 투자도 한다','자금↓ · 평판↑',{cash:-.3,fame:1.5,staff:-1}),fCh('붙잡는다','관계↓',{rel:-4})])},
 {w:2,c:()=>S.founder&&fYr()>=7,run:()=>openModal('언론 진흥 기금',`<p class="lede">정부 언론 진흥 기금 지원 대상이 됐다. 대신 "정부 정책 홍보 협조" 문구가 붙어 있다.</p>`,[fCh('조건 없는 부분만 받는다','자금↑',{cash:.4}),fCh('받지 않는다','신뢰↑',{trust:2})])},
 {w:1,c:()=>S.founder&&fYr()>=8,run:()=>openModal('후계 구도',`<p class="lede">이사회가 "대표님 이후"를 이야기하기 시작했다.</p>`,[fCh('사내에서 키운다','관계↑',{rel:5}),fCh('외부 전문가를 영입한다','품질↑ · 관계↓',{q:2,rel:-3})])}
);

// ===== 같은 부서 사람들: 상호작용 · 부서 규모 효과 · 부서 이벤트 =====
function deptPeople(){if(S.founder||S.rank>=2)return (S.team||[]).slice(0,14);return deptMates().filter(m=>m.name!==S.name);}
function mRel(m,v,why){if(!m)return;if(v>0&&S.st)v*=(0.85+S.st.cha/260)*trMul('rel')*leadK();m.rel=clamp(Math.round((m.rel??20)+v),-50,100);if(why){m.hist=m.hist||[];m.hist.unshift(`${dateShort()} ${why}`);if(m.hist.length>3)m.hist.pop();}}
function mRole(m){if(m.rk!=null)return '수습';if(S.founder)return '기자';if(S.rank>=2)return (MR[m.r||0]||'기자');return m.role||MR[m.r||0]||'기자';}
function myY(){return Math.floor(S.turn/YW);}
function relWord(v){v=v??20;return v>=60?'둘도 없는 사이':v>=35?'가까움':v>=10?'무난':v>=-10?'서먹함':'불편함';}
function deptStat(){const P=deptPeople();const n=P.length+1;const avg=a=>a.length?a.reduce((x,y)=>x+y,0)/a.length:0;
  return{n,yrs:avg(P.map(m=>m.yrs||1)),sk:avg(P.map(m=>m.skill||30)),mood:avg(P.map(m=>m.rel??20)),total:S.co?S.co.staff:OUT().staff};}
// 부서 규모·분위기·회사 규모 효과 (배율) — otr()에 함께 곱해진다
function deptFx(){if(!S||S.phase!=='game'||!S.outlet)return {};if(S._dfx&&S._dfx.t===S.turn&&S._dfx.r===S.rank&&S._dfx.d===S.dept&&S._dfx.s===S.styT)return S._dfx.v;const d=deptStat();const v={ap:0,list:[]};const mul=(k,x)=>{v[k]=(v[k]||1)*x;};
  {const sy=!S.founder&&S.styT&&STYLE[S.styT];if(sy){for(const k in sy.fx)mul(k,sy.fx[k]);v.list.push(['기자 유형 · '+sy.n,sy.up+' · 대가: '+sy.down]);}}
  {const DF0=!S.founder&&S.rank<4&&DEPT_FX[S.dept];if(DF0){for(const k in DF0[2])mul(k,clamp(1+(DF0[2][k]-1)*2,.6,1.5));if(DEPT_SIG_OF[S.dept]==='spo'&&inSeason()){v.ap+=1;mul('hp',1.12);v.list.push(['시즌 중','매주 경기 · 행동력 +1 · 더 지친다']);}v.list.push(['부서 특성 · '+DF0[0],DF0[1]+' · 잘 크는 능력치: '+Object.keys(DF0[3]).map(k=>STN[k]).join('·')]);}}
  if(d.n<=3){v.ap+=1;mul('item',1.08);mul('hp',1.1);v.list.push(['일당백 부서',`${d.n}명뿐이라 혼자 여러 출입처를 맡는다 · 행동력 +1 · 아이템↑ · 몸은 더 힘들다`]);}
  else if(d.n>=10){mul('item',.93);mul('hp',.94);mul('pick',.95);v.list.push(['큰 부서',`${d.n}명 · 출입처가 겹쳐 아이템이 덜 돌지만 서로 대신 뛰어 줄 수 있다 · 승진 경쟁↑`]);}
  else if(d.n>=7){mul('hp',.97);v.list.push(['넉넉한 부서',`${d.n}명 · 급할 때 대신 뛰어 줄 사람이 있다 · 컨디션 소모 조금↓`]);}
  if(d.n<=4&&!S.founder){mul('eval',1.05);v.list.push(['눈에 띄는 자리','사람이 적어 데스크 눈에 잘 띈다 · 평가가 조금 더 오른다']);}
  if(d.mood>=35){mul('rel',1.1);mul('hp',.95);v.list.push(['분위기 좋음',`부서 평균 관계 ${Math.round(d.mood)} · 관계가 더 잘 쌓이고 덜 지친다`]);}
  else if(d.mood<=0){mul('hp',1.08);mul('eval',.95);v.list.push(['분위기 냉랭',`부서 평균 관계 ${Math.round(d.mood)} · 더 지치고 평가도 덜 오른다`]);}
  if(d.sk>=52){mul('grow',1.06);v.list.push(['실력자들 틈',`부서 평균 실력 ${Math.round(d.sk)} · 옆에서 보고 배우는 게 많다 · 성장↑`]);}
  if(d.total>=200){mul('fame',1.06);mul('heat',.95);v.list.push(['큰 간판',`기자 ${d.total}명 회사 · 이름값으로 평판이 더 오르고 취재망이 두텁다`]);}
  else if(d.total<=25){mul('fame',.94);mul('item',1.05);v.list.push(['작은 회사',`기자 ${d.total}명 · 이름값은 약하지만 기회는 많다`]);}
  S._dfx={t:S.turn,r:S.rank,d:S.dept,s:S.styT,v};return v;}
function deptBox(){const d=deptStat(),f=deptFx();return `<div class="card" style="border-color:rgba(119,166,255,.35)"><div class="t">${S.founder?'편집국':DEPTS[S.dept].n} 현황</div><div class="meta"><span>인원 ${d.n}명 (회사 기자 ${d.total}명)</span><span>평균 ${Math.round(d.yrs)}년 차</span><span>평균 실력 ${Math.round(d.sk)}</span><span>분위기 ${relWord(d.mood)} (${Math.round(d.mood)})</span></div>${(f.list||[]).length?`<ul class="pnl" style="margin-top:6px">${f.list.map(([a,b])=>`<li><span class="tg pc">${a}</span>${esc(b)}</li>`).join('')}</ul>`:''}${!S.founder&&S.rank>=2&&S.rank<=3&&(S.team||[]).length<d.n?`<p class="hint" style="margin:6px 0 0">아래는 내가 직접 데스크를 보는 팀원 ${S.team.length}명이다. ${DEPTS[S.dept].n} 전체 ${d.n}명(다른 팀 포함)은 회사 탭 › 조직에서 볼 수 있다.</p>`:''}<p class="hint" style="margin:6px 0 0">할 일의 "부서 사람들과"에서 동료와 밥을 먹고, 노하우를 배우고, 같이 취재할 수 있다.</p></div>`;}
// 행동: 부서 사람들과
RUN.deptlife=function(){const P=deptPeople();if(!P.length){toast('같은 부서에 사람이 없다');return;}
  openModal(S.founder?'구성원과 시간 보내기':'부서 사람들과',`<p>누구와 시간을 보낼까? 관계가 좋을수록 도움을 더 받는다.</p>`,P.slice().sort((a,b)=>(b.rel??20)-(a.rel??20)).map(m=>({label:`${m.name}`,tag:mRole(m),sub:`${relWord(m.rel)} ${Math.round(m.rel??20)} · ${yrsTxt(m)} · ${npcAge(m)}세 · 실력 ${Math.round(m.skill)}${m.hist&&m.hist[0]?' · 최근: '+m.hist[0]:''}`,fn:()=>{deptTalk(m);return false;}})).concat([{label:'취소',cls:'ghost'}]));};
function deptTalk(m){const me=myY(),sen=(m.yrs||1)>me+2,jun=(m.yrs||1)<me-1||S.rank>=2||S.founder;const best=m.st?Object.entries(m.st).sort((a,b)=>b[1]-a[1])[0][0]:'inv';
  const unc=S.items.find(i=>i.facts.some(f=>!fOK(f)));const rel=m.rel??20;const C=[];
  C.push({label:'점심·커피',sub:'관계↑ · 컨디션 조금↑',fn:()=>{spend(1,0);S.hp=clamp(S.hp+3,0,100);mRel(m,R(6,10),'점심');S.money-=1;toast(`${jo2(m.name,'과','와')} 밥을 먹었다 · 관계 ${relWord(m.rel)}`);}});
  if(sen)C.push({label:'노하우를 묻는다',sub:`${m.name}의 장기 「${STN[best]}」${jp(STN[best],'을','를')} 배운다`,fn:()=>{spend(1,3);gain(best,1.2+(rel>=35?.6:0));mRel(m,3,'노하우 전수');toast(`${STN[best]} 감을 조금 익혔다`);}});
  if(jun)C.push({label:'요령을 가르쳐 준다',sub:'상대 실력↑ · 관계↑'+(S.rank>=2?' · 평가 조금↑':''),fn:()=>{spend(1,4);skBump(m,1.5);mRel(m,7,'가르쳐 줌');gain('int',.2);gain('cha',.2);if(S.rank>=2)apply({eval:.4});toast(`${m.name} 실력이 조금 늘었다`);}});
  if(unc)C.push({label:`같이 취재하자고 한다 — 「${unc.title.slice(0,16)}…」`,sub:`실력 ${Math.round(m.skill)} · 성공하면 사실 하나 확인, 바이라인 공동`,fn:()=>{spend(1,5);const f=unc.facts.find(x=>!fOK(x));if(chance(.3+m.skill/150+(rel>=35?.1:0))){fFill(f,`${m.name} 공동 취재`);unc.co=unc.co||m.name;mRel(m,4,'공동 취재');toast(`${m.name} 덕에 「${f.t.slice(0,18)}」 확인`);}else{mRel(m,1,'공동 취재');toast('같이 뛰었지만 이번엔 허탕');}}});
  if(S.rank<=3&&!S.founder)C.push({label:'다음 원고를 봐 달라고 한다',sub:'다음 기사 완성도↑ (상대 실력만큼)',fn:()=>{spend(1,2);S.peerRev={n:m.name,b:clamp(Math.round((m.skill-28)/5),1,8)};mRel(m,2,'원고 검토');toast(`${jo2(m.name,'이','가')} 다음 원고를 봐 주기로 했다`);}});
  C.push({label:'출입처 정보를 나눈다',sub:'관계가 좋을수록 아이템·취재원이 나온다',fn:()=>{spend(1,3);const p=.15+Math.max(0,rel)/220;if(chance(p*glut())){const it=makeItem(S.dept,{excl:chance(.3),pre:1});it.from=m.name;S.items.push(it);mRel(m,2,'정보 교환');toast(`${m.name}: "이거 한번 봐 봐." → 「${it.title}」`);}else if(chance(.35)){const s=addSource(S.dept,R(15,30));mRel(m,2,'취재원 소개');toast(`${jo2(m.name,'이','가')} ${s.name} ${jo2(s.role,'을','를')} 소개해 줬다`);}else{mRel(m,2,'정보 교환');toast('서로 근황만 나눴다');}}});
  if(S.rank>=2&&S.rank<=3&&(m.yrs||1)<me&&S.protege!==m.name)C.push({label:'제자로 삼는다',sub:`${S.protege?`지금 제자 ${S.protege} 대신 · `:''}매달 실력이 크고, 단독을 내면 내 평판도 오른다`,fn:()=>{spend(1,2);S.protege=m.name;mRel(m,10,'제자');toast(`${jo2(m.name,'을','를')} 제자로 삼았다`);}});
  C.push({label:'고민을 들어 준다',sub:'관계↑↑ · 컨디션 조금↓',fn:()=>{spend(1,4);mRel(m,R(10,15),'고민 상담');gain('men',.3);toast(`${jo2(m.name,'이','가')} "고맙다"고 했다`);}});
  C.push({label:'뒤로',cls:'ghost',fn:()=>{RUN.deptlife();return false;}});
  openModal(`${m.name} · ${mRole(m)}`,`<p class="lede">${myrs(m)}년 차 · ${npcAge(m)}세 · 실력 ${Math.round(m.skill)} · 관계 ${relWord(m.rel)} (${Math.round(rel)})</p>${m.hist&&m.hist.length?`<p class="hint">최근: ${m.hist.map(esc).join(' · ')}</p>`:''}`,C);}
// 부서 이벤트
const D_EV=[
 {w:3,c:()=>!S.founder&&S.rank<=3&&deptPeople().length>=2,run:()=>{const m=pick(deptPeople());openModal('동료의 단독',`<p class="lede">${esc(m.name)} ${jo2(mRole(m),'이','가')} 단독을 터뜨렸다. ${S.rank>=3?'국장이 편집회의에서 "다른 부서도 좀 보고 배워"라고 했다':jo2(bossT(),'이','가')+' 회의에서 "다들 좀 보고 배워"라고 했다'}.</p>`,[fCh('먼저 가서 축하한다','관계↑',{},()=>mRel(m,8,'단독 축하')),fCh('비결을 묻는다','취재력↑',{},()=>{gain('inv',.8);mRel(m,3,'비결 묻기');}),fCh('속으로 삭인다','멘탈↓',{men:-.5})]);}},
 {w:2,c:()=>!S.founder&&S.rank<=3&&deptPeople().length>=2,run:()=>{const m=pick(deptPeople());openModal('동료의 실수',`<p class="lede">${esc(m.name)}의 송고된 기사에서 숫자 하나가 틀린 걸 나만 봤다. 아직 아무도 모른다.</p>`,[fCh('조용히 알려 준다','관계↑↑',{},()=>mRel(m,12,'실수 귀띔')),fCh('데스크에 보고한다','평가↑ · 관계↓↓',{eval:1},()=>mRel(m,-15,'보고')),fCh('모른 척한다','',{},()=>{if(chance(.3))toast(fHit({eval:-1})+' · 나중에 "본 사람 없었냐"는 말이 나왔다');})]);}},
 {w:2,c:()=>!S.founder&&S.rank<=3&&deptPeople().length>=2,run:()=>{const m=pick(deptPeople());openModal('대신 출입처를 맡아 줘',`<p class="lede">${jo2(esc(m.name),'이','가')} 독감으로 쓰러졌다. 이번 주 ${esc(m.name)} 출입처를 누군가 대신 돌아야 한다.</p>`,[fCh('내가 맡는다','컨디션↓ · 아이템 · 관계↑',{hp:-8},()=>{S.items.push(makeItem(S.dept,{pre:1}));mRel(m,9,'출입처 대타');}),fCh('바쁘다고 한다','관계↓',{},()=>mRel(m,-5,'대타 거절'))]);}},
 {w:1,c:()=>!S.founder&&S.rank<=3&&deptPeople().length>=3,run:()=>{const m=pick(deptPeople());openModal('퇴사 상담',`<p class="lede">${jo2(esc(m.name),'이','가')} 퇴근길에 말했다. "나 그만둘까 봐. 기업 홍보팀에서 연락 왔어."</p>`,[fCh('말린다','관계↑ · 남을 수도',{},()=>{mRel(m,6,'퇴사 만류');if(chance(.4))swapMate(m,'홍보팀으로 이직');}),fCh('응원한다','관계↑ · 떠난다',{},()=>{mRel(m,4,'응원');swapMate(m,'홍보팀으로 이직');})]);}},
 {w:2,c:()=>!S.founder&&S.rank<=3&&deptPeople().length>=4,run:()=>openModal('부서 회식',`<p class="lede">${S.rank>=3?'부서원들이 "부장님, 오늘 다 같이 저녁 드시죠"라고 했다.':'부장이 "오늘 다 같이 저녁 먹자"고 했다.'} 다들 표정이 반반이다.</p>`,[fCh('끝까지 간다','컨디션↓ · 모두와 관계↑',{hp:-6},()=>deptPeople().forEach(m=>mRel(m,4))),fCh('1차만 하고 빠진다','',{hp:-2},()=>deptPeople().forEach(m=>mRel(m,1))),fCh('약속이 있다고 한다','관계 조금↓',{},()=>deptPeople().forEach(m=>mRel(m,-2)))])},
 {w:2,c:()=>!S.founder&&S.rank<=3&&S.items.length>0&&deptPeople().some(m=>(m.rel??20)<5),run:()=>{const m=deptPeople().find(x=>(x.rel??20)<5);const it=S.items[0];openModal('아이템 신경전',`<p class="lede">${jo2(esc(m.name),'이','가')} 데스크에게 「${esc(it.title)}」 비슷한 걸 자기가 먼저 발제하겠다고 했다.</p>`,[fCh('데스크에게 내 취재 메모를 보여 준다','아이템 지킨다 · 관계↓',{eval:.5},()=>mRel(m,-6,'신경전')),fCh('같이 하자고 제안한다','관계↑↑ · 바이라인 공동',{},()=>{it.co=m.name;mRel(m,14,'공동 제안');}),fCh('넘겨준다','아이템을 잃는다 · 관계↑',{},()=>{S.items=S.items.filter(x=>x!==it);mRel(m,8,'양보');})]);}},
 {w:2,c:()=>!S.founder&&S.rank>=1&&S.rank<=3&&deptPeople().some(m=>(m.yrs||1)<=1),run:()=>{const m=deptPeople().find(x=>(x.yrs||1)<=1);openModal('신입 멘토',`<p class="lede">${bossT()}: "${esc(m.name)} 이번에 들어온 거 알지? 네가 좀 데리고 다녀."</p>`,[fCh('맡는다','컨디션↓ · 신입 실력↑ · 평가↑',{hp:-4,eval:.8},()=>{skBump(m,3);mRel(m,15,'멘토');}),fCh('지금은 여력이 없다고 한다','평가 조금↓',{eval:-.4})]);}},
 {w:2,c:()=>!S.founder&&S.rank<=3&&deptPeople().some(m=>(m.yrs||1)>myY()+4&&(m.rel??20)<10),run:()=>{const m=deptPeople().find(x=>(x.yrs||1)>myY()+4&&(x.rel??20)<10);openModal('선배의 갑질',`<p class="lede">${esc(m.name)} 선배가 또 내 원고를 단톡방에 올려 놓고 "이게 기사냐"고 했다.</p>`,[fCh('참는다','멘탈↓',{men:-.6}),fCh('따로 불러 정중히 항의한다','관계는 일단↓ · 멘탈↑',{men:.5},()=>mRel(m,-4,'항의')),fCh('노조 고충처리에 알린다','신뢰↑ · 관계↓↓',{trust:.5},()=>mRel(m,-12,'고충 신고'))]);}},
 {w:1,c:()=>!S.founder&&S.rank<=3&&S.clips.length>0&&deptPeople().some(m=>(m.rel??20)>=40),run:()=>{const m=deptPeople().find(x=>(x.rel??20)>=40);openModal('같이 받은 상',`<p class="lede">${jo2(esc(m.name),'과','와')} 같이 쓴 기획이 사내 특종상을 받았다.</p>`,[fCh('상금으로 부서에 한턱낸다','평판↑ · 모두와 관계↑',{fame:1,money:-15},()=>deptPeople().forEach(x=>mRel(x,3))),fCh('둘이 나눈다','평판↑',{fame:1},()=>mRel(m,4))]);}},
 {w:1,c:()=>!S.founder&&S.rank<=3&&deptPeople().length>=2,run:()=>{const m=pick(deptPeople());openModal(`${esc(m.name)}의 청첩장`,`<p class="lede">${jo2(esc(m.name),'이','가')} 청첩장을 내밀었다. "꼭 와 줘."</p>`,[fCh('축의금 10만 원 들고 간다','관계↑',{money:-10,hp:-2},()=>mRel(m,8,'결혼식')),fCh('5만 원만 보낸다','',{money:-5},()=>mRel(m,2))]);}},
 {w:2,c:()=>!S.founder&&S.rank<=3&&deptStat().n<=3,run:()=>openModal('일손 부족',`<p class="lede">부서에 사람이 너무 없다. 이번 달 휴가 신청이 반려됐다.</p>`,[fCh('충원을 요청하는 메일을 쓴다','평가 조금↓ · 다음 인사에 반영될 수도',{eval:-.3},()=>{S.reqHire=1;}),fCh('그냥 버틴다','컨디션↓ · 평가↑',{hp:-6,eval:.6})])},
 {w:2,c:()=>!S.founder&&S.rank<=3&&deptStat().n>=9,run:()=>{const a=pick(deptPeople());openModal('같은 기획, 두 명',`<p class="lede">데스크가 나와 ${esc(a.name)}에게 같은 기획을 동시에 맡겼다. 먼저 완성하는 쪽이 지면을 받는다.</p>`,[fCh('경쟁한다','평가↑ 또는↓ · 관계↓',{},()=>{mRel(a,-6,'기획 경쟁');if(chance(.45+S.st.spd/250))toast(fHit({eval:1.5})+' · 내가 이겼다');else toast(fHit({eval:-.8})+' · 졌다');}),fCh('나눠서 같이 하자고 한다','관계↑ · 평가 조금↑',{eval:.5},()=>mRel(a,8,'기획 분담'))]);}},
 {w:2,c:()=>!S.founder&&S.rank<=3&&deptStat().mood<=0&&deptPeople().length>=3,run:()=>openModal('냉랭한 부서',`<p class="lede">요즘 부서 분위기가 얼어붙었다. 단톡방엔 업무 공지만 오간다.</p>`,[fCh('커피를 돌린다','자금↓ · 모두와 관계↑',{money:-8},()=>deptPeople().forEach(m=>mRel(m,4))),fCh('신경 쓰지 않는다','',{men:-.3})])},
 {w:2,c:()=>(S.rank>=2&&S.rank<=3)&&S.team.length>=3,run:()=>{const lo=S.team.slice().sort((a,b)=>a.skill-b.skill)[0];openModal('부서원의 슬럼프',`<p class="lede">${esc(lo.name)} 기자가 석 달째 기사를 못 쓰고 있다.</p>`,[fCh('일대일 코칭을 한다','컨디션↓ · 실력↑ · 관계↑',{hp:-5},()=>{skBump(lo,2);mRel(lo,10,'코칭');}),fCh('출입처를 바꿔 준다','',{},()=>mRel(lo,3,'출입처 변경')),fCh('공개적으로 질책한다','부서 분위기↓',{},()=>{mRel(lo,-12,'질책');S.team.forEach(m=>mRel(m,-2));})]);}},
 {w:2,c:()=>S.founder&&(S.team||[]).length>=4,run:()=>{const m=pick(S.team);openModal('구성원 면담',`<p class="lede">${esc(m.name)} 기자가 면담을 신청했다. "제가 여기서 어떻게 커 갈 수 있을까요?"</p>`,[fCh('성장 계획을 같이 짠다','관계↑ · 실력↑',{},()=>{skBump(m,1.5);mRel(m,10,'면담');}),fCh('연봉 이야기로 끝낸다','자금↓ · 관계↑',{cash:-.02},()=>mRel(m,5))]);}}
];
function swapMate(m,why){const L=S.mates||[];const i=L.indexOf(m);log(`${m.name} ${why}`);if(i>=0){const n=genMember(S.dept);n.r=m.r;n.role=m.role;n.yrs=Math.max(1,(m.yrs||1)-R(0,2));n.rel=R(0,10);fitSk(n);L[i]=n;}else if(S.team){const j=S.team.indexOf(m);if(j>=0)S.team.splice(j,1,fitSk(Object.assign(genMember(S.dept),{yrs:R(1,5)})));}}
F_EVENTS.push(...D_EV);

// ===== 취재의 재미: 아이템 등급 · 현장의 순간 · 반전 =====
// 포털 많이 본 뉴스 순위: 조회수 한 줄이 아니라 뉴스 가치(파급력·단독·등급)·완성도·제목·매체 규모로 정한다. 대특종(S)은 대부분 1~3위
function portalRank(imp,q,excl,gr,mult,p){const gk={S:1.7,A:1.3,B:1.1}[gr]||1;const sc=Math.max(1,(imp||20)*(excl?1.3:1)*gk*(.6+(q||50)/200)*(mult||1)*(.8+(p||3)*.08)*(typeof portalMult==='function'?portalMult():1)*(.85+Math.random()*.3));return clamp(Math.round(44-8.2*Math.log(sc)),1,30);}
function gradeOf(it){const v=(it.imp||0)+(it.excl?12:0)+(it.chain?6:0);return v>=82?'S':v>=66?'A':v>=48?'B':'C';}
const GRADE_N={S:'대특종감',A:'특종감',B:'쓸 만함',C:'단신감'};
function gradeTag(it){const g=gradeOf(it);return IMG['gr_'+g]?`<span class="grb" title="${g}급 · ${GRADE_N[g]}">${imgTag('gr_'+g,'grimg',g+'급')}</span>`:`<span class="gr g${g}" title="${GRADE_N[g]}">${g}</span>`;}
function itemFound(it,how){const g=gradeOf(it);if(g==='S'||g==='A'){sfx(g==='S'?'scoop':'success');Q.unshift?0:0;
   openModal(g==='S'?'대특종의 냄새가 난다':'좋은 아이템을 잡았다',`<div class="fcard g${g}"><div class="fg">${g}</div><div><b>「${esc(it.title)}」</b><p>${esc(how)}</p><p class="meta"><span>${DEPTS[it.d].n}</span><span>파급력 ${it.imp}</span>${it.excl?'<span>단독</span>':''}<span>확인 ${it.facts.filter(fOK).length}/${it.facts.length}</span></p></div></div><p class="hint">${it.excl?`타사가 냄새를 맡기 전에(${heatTxt(it.heat)}) 핵심 사실을 두 경로로 확인하자.`:'공통 아이템이라도 먼저 깊게 파면 기사가 달라진다.'}</p>`);}
  else toast(`${how} → [${g}] 「${it.title}」`);}
// 현장의 순간: 취재 방법을 쓸 때 가끔 고를 일이 생긴다
const MOMENTS={
 call:[['상대가 수화기 너머에서 한참 머뭇거린다.',[['오프더레코드를 약속한다','성공↑ · 기사에 출처를 못 밝힌다',{p:.2}],['기다린다','성공 조금↑',{p:.06}],['"다른 데선 벌써 확인해 줬다"고 떠본다','성공↑↑ · 상대 경계↑ · 신뢰 조금↓',{p:.28,al:10,trust:-.4}]]],
       ['전화를 받은 건 본인이 아니라 비서다.',[['메시지를 남긴다','성공 조금↓ · 경계↓',{p:-.05,al:-4}],['직통 번호를 알아낸다','인맥이 좋을수록 성공↑',{p:()=>S.st.net/250}],['비서에게 넌지시 묻는다','성공↑ · 경계↑',{p:.15,al:6}]]]],
 docs:[['받은 문건의 핵심 쪽이 가려져 있다.',[['원본을 요구한다','성공↑ · 상대 경계↑',{p:.15,al:8}],['가려진 채로 받는다','그대로',{p:0}],['다른 부서 사람을 통해 다시 구한다','성공↑ · 컨디션↓',{p:.12,hp:5}]]],
       ['취재원이 "이건 진짜 마지막"이라며 USB를 내민다.',[['고맙게 받고 출처를 철저히 숨긴다','성공↑',{p:.18}],['출처 노출 위험을 설명하고 사본만 받는다','성공 조금↑ · 취재원 신뢰↑',{p:.08,src:5}]]]],
 scene:[['현장 입구에서 경비원이 막아선다.',[['신분을 밝히고 정중히 부탁한다','성공 조금↑',{p:.05}],['뒷문으로 돌아간다','성공↑ · 경계↑ · 컨디션↓',{p:.2,al:12,hp:5}],['주민인 척 들어간다','성공↑↑ · 신뢰↓ (취재 윤리)',{p:.3,trust:-1.2}]]],
        ['비가 쏟아진다. 현장 사진을 찍기 어렵다.',[['그래도 버틴다','성공↑ · 컨디션↓↓',{p:.15,hp:10}],['비가 그칠 때까지 근처에서 탐문한다','성공 조금↑',{p:.06}]]]],
 ask:[['동네 주민이 기자라는 말에 표정이 굳는다.',[['커피를 사며 천천히 말을 건다','성공↑ · 통장 -1만',{p:.15,money:-1}],['명함부터 건넨다','그대로',{p:0}],['세 번째 찾아간다','성공↑ · 컨디션↓',{p:.2,hp:6}]]],
      ['한 상인이 "그 얘기 아는 사람 따로 있다"며 누군가를 가리킨다.',[['그 사람을 찾아간다','성공↑ · 새 취재원이 생길 수도',{p:.15,newsrc:.4}],['지금 대화에 집중한다','그대로',{p:.03}]]]],
 data:[['숫자가 앞뒤가 안 맞는다.',[['원자료를 다시 요청한다','성공↑',{p:.18}],['통계 전문가에게 물어본다','성공↑ · 전문가 코멘트 확보',{p:.12,expert:1}],['그냥 계산해 본다','데이터 능력에 달렸다',{p:()=>(S.st.dat-45)/200}]]]]
};
function moment(m,it,go){const L=MOMENTS[m];if(!L||!chance(.32)){go(0);return;}const [txt,opts]=pick(L);
  openModal('현장의 순간',`<p class="lede">${txt}</p><p class="hint">「${esc(it.title)}」 취재 중</p>`,opts.map(([l,sub,fx])=>({label:l,sub,fn:()=>{let b=typeof fx.p==='function'?fx.p():(fx.p||0);if(fx.al)it.alert=clamp(it.alert+fx.al,0,100);if(fx.hp)S.hp=clamp(S.hp-fx.hp,0,100);if(fx.trust)apply({trust:fx.trust});if(fx.money)S.money+=fx.money;if(fx.expert)it.expert=1;if(fx.src){const s=srcOf(it.d);if(s)s.trust=clamp(s.trust+fx.src,0,100);}if(fx.newsrc&&chance(fx.newsrc)){const s=addSource(it.d,R(15,30));toast(`새 취재원: ${s.name} ${s.role}`);}go(b);return false;}})));}
// 반전: 사실을 확인할 때 가끔 판이 바뀐다
function twist(it,T){if(it._tw||!chance(.1))return;it._tw=1;if(it.pos){posTwist(it,T);return;}const r=Math.random();
  if(r<.4){it.imp=Math.min(99,it.imp+R(8,15));T.lines.push({c:'g',t:`반전 — 판이 커졌다. 윗선이 연결돼 있다. (파급력 ${it.imp})`});sfx('alarm');}
  else if(r<.7&&(it.chain||0)<FOLLOW_MAX&&!S.items.some(x=>x!==it&&fBase(x.title)===fBase(it.title))){const f=followUp(it);f.excl=true;f.imp=Math.min(99,Math.round(it.imp*1.05));{const k=f.facts.find(x=>x.key&&!fOK(x))||f.facts.find(x=>!fOK(x));if(k)fFill(k,'취재원');}S.items.push(f);T.lines.push({c:'g',t:`새 단서 — 후속 아이템이 생겼다: 「${f.title}」`});}
  else if(it.hoax){T.lines.push({c:'r',t:'이상하다 — 제보 내용 일부가 조작된 흔적이 있다. 허위 제보일 수도 있다.'});it.hoaxHint=1;}
  else{it.heat=Math.max(1,it.heat-1);T.lines.push({c:'r',t:'타사 기자가 같은 사람을 만나고 갔다는 말을 들었다. 서둘러야 한다.'});}}

// ===== 수익 다변화: 광고만으로는 못 버틴다 =====
// [이름, 설명, 시작 비용(억, ★4 기준), 월 수입 공식, 월 유지비 배율, 조건, 부작용]
const BIZ={
 newsletter:['유료 뉴스레터','기자 이름을 건 심층 뉴스레터. 충성 독자가 돈을 낸다',.15,(c,o,l)=>c.subs*o.rate*.05*l+S.fame/600*l,.2,()=>S.fame>=12,'평판이 높을수록 잘 팔린다'],
 video:['영상·유튜브 채널','기사를 영상으로 다시 만든다. 트래픽이 곧 수입',.6,(c,o,l)=>c.tr*.0012*l*(isTV()?1.6:1),.35,()=>true,'트래픽이 클수록 유리 · 방송사는 1.6배'],
 forum:['포럼·콘퍼런스','업계 리더를 모으는 행사 사업. 협찬이 붙는다',.4,(c,o,l)=>o.p*.07*l*(1+S.fame/150),.3,()=>S.fame>=20,'신뢰도가 매달 조금 깎인다 (협찬 의존)'],
 native:['기획 기사·협찬','광고주와 함께 만드는 기사. 돈은 되지만 위험하다',.1,(c,o,l)=>o.ad*.1*l,.15,()=>true,'신뢰도↓ · 포털 벌점 위험'],
 synd:['기사 판매·제휴','다른 매체·외신·기업에 기사를 판다',.2,(c,o,l)=>(c.q/100)*o.p*.06*l,.2,()=>S.co.q>=50,'보도 품질이 높을수록 잘 팔린다'],
 archive:['아카이브·데이터 판매','과거 기사와 데이터를 연구소·기업에 판다',.3,(c,o,l)=>o.p*.035*l*(1+Math.min(1,(S.turn-(S.fStart||0))/480)),.15,()=>true,'회사가 오래될수록 가치가 오른다'],
 academy:['저널리즘 아카데미','기자 지망생 교육 사업',.35,(c,o,l)=>o.p*.05*l*(1+S.fame/200),.25,()=>S.fame>=25,'평판이 높아야 수강생이 모인다'],
 member:['후원 멤버십','독자가 회원이 되어 매달 후원한다',.2,(c,o,l)=>c.subs*o.rate*.12*l*(S.trust/60),.2,()=>S.trust>=45,'신뢰도가 높을수록 수입↑ · 구독 성장↑']
};
function bizSz(){const p=OUT()?OUT().p:3;return {1:.3,2:.45,3:.7,4:1,5:1.4}[p]||1;}
function bizCost(k,l){return +(BIZ[k][2]*bizSz()*Math.pow(1.8,(l||0))).toFixed(2);}
function bizRev(k){const c=S.co,o=OUT();const l=(S.biz||{})[k]||0;if(!l)return 0;return Math.max(0,BIZ[k][3](c,o,l))*mediaPower(o);}
function bizMonth(){if(!S.biz)return {rev:0,cost:0,list:[]};let rev=0,cost=0;const list=[];for(const k in S.biz){const l=S.biz[k];if(!l)continue;const r=bizRev(k)*(.85+Math.random()*.3);const u=BIZ[k][2]*bizSz()*BIZ[k][4]*l*.25;rev+=r;cost+=u;list.push([BIZ[k][0],r,u]);
   if(k==='forum')S.trust=Math.max(0,S.trust-.15*l);if(k==='native'){S.trust=Math.max(0,S.trust-.25*l);if(chance(.08*l))portalPen(1,'협찬 기사');}if(k==='member')S.co.bS+=.002*l;}
  return {rev,cost,list};}
function canBiz(){return S.rank===7||S.founder;}
RUN.revenue=function(){const c=S.co,o=OUT();S.biz=S.biz||{};const L=S.co.last||{};
  openModal('수익 다변화',`<p>광고에만 기대면 경기와 관계망에 휘둘린다. 수익원을 늘려 보자. 사업마다 시작 비용과 매달 유지비가 들고, 단계(최대 3)를 올릴수록 커진다.</p>${revBox()}`,Object.keys(BIZ).map(k=>{const B=BIZ[k],l=S.biz[k]||0,ok=B[5]();const cost=bizCost(k,l);const est=l<3?Math.max(0,B[3](c,o,l+1)):0;
    return{label:`${B[0]} ${l?`· ${l}단계`:''}`,sub:l>=3?`최고 단계 · 월 약 ${eok(bizRev(k))}`:!ok?`조건 미달 · ${B[6]}`:`${l?'키우기':'시작'} ${eok(cost)} → 월 약 ${eok(est)} · ${B[1]} · ${B[6]}`,disabled:l>=3||!ok||c.cash<cost,fn:()=>{spend(1,3);c.cash-=cost;S.biz[k]=l+1;log(`수익 사업: ${B[0]} ${l+1}단계`);tick(`${o.n}, ${B[0]} ${l?'확대':'시작'}`);toast(`${B[0]} ${l+1}단계 · 자금 -${eok(cost)}`);}};}).concat(Object.keys(S.biz).filter(k=>S.biz[k]).length?[{label:'사업 하나를 접는다',sub:'유지비를 줄인다',cls:'ghost',fn:()=>{openModal('어떤 사업을 접을까',``,Object.keys(S.biz).filter(k=>S.biz[k]).map(k=>({label:BIZ[k][0],sub:`월 약 ${eok(bizRev(k))}`,fn:()=>{S.biz[k]=0;toast(`${BIZ[k][0]} 정리`);}})).concat([{label:'취소',cls:'ghost'}]));return false;}}]:[]).concat([{label:'닫기',cls:'ghost'}]));};
function revBox(){const L=S.co&&S.co.last;if(!L)return '';const parts=[['광고',L.ad],['구독·후원',L.subsRev],['트래픽(포털)',L.trRev],['CP 전재료',L.cp],['기자 영업(광고·협찬)',L.salesRev],['수익 사업',L.bizRev],['창업 지원금',L.fsup]].filter(x=>x[1]>0.001);const t=parts.reduce((a,x)=>a+x[1],0)||1;const col=['var(--siren)','var(--good)','var(--sodium)','var(--pink)','#7fb7ff','var(--dev)','#9be36b'];
  return `<div class="sec">지난달 수익 구조 · 월 ${eok(L.rev)} · 경기 ${ECON_N(econ())}</div><div class="tshare" style="height:24px">${parts.map((x,i)=>`<i style="width:${x[1]/t*100}%;background:${col[i]}" title="${x[0]} ${eok(x[1])}">${x[1]/t>=.12?x[0]:''}</i>`).join('')}</div><p class="hint" style="margin:6px 0 0">${parts.map(x=>`${x[0]} ${eok(x[1])}(${Math.round(x[1]/t*100)}%)`).join(' · ')}${L.ad/t>.5?' — 광고 의존이 높다. 관계망이 흔들리면 돈줄도 흔들린다.':''}</p>${L.adList?`<p class="hint" style="margin:4px 0 0">광고 ${eok(L.ad)} = 매달 들어오는 일반 광고 ${eok(L.adBase||0)} + 기관·기업 집행 ${eok(L.adPay||0)}${L.adList.length?` (${L.adList.slice(0,4).map(x=>`${esc(x[0])} ${AD_CAD[x[2]]} ${adAmt(x[1])}${x[3]?`(${x[3]})`:''}`).join(' · ')})`:' — 이번 달은 집행한 곳이 없다'}. 기관·기업 광고는 2개월·분기·반기·연 단위로 몰아서 들어와 달마다 들쭉날쭉하다.</p>`:''}`;}
// 포털·구독 이벤트
F_EVENTS.push(
 {w:2,c:()=>(S.rank>=5||S.founder)&&S.portal&&S.portal.lv>=1,run:()=>{const up=chance(.5);openModal('포털 알고리즘 개편',`<p class="lede">포털이 뉴스 배열 알고리즘을 바꿨다. ${up?'우리 기사 노출이 늘었다.':'우리 기사 노출이 뚝 떨어졌다.'}</p>`,up?[fCh('이 흐름을 탄다','트래픽↑',{tr:.08})]:[fCh('자체 앱·뉴스레터로 독자를 묶는다','구독↑ · 자금↓',{cash:-.1,subs:.02}),fCh('제목을 더 세게 단다','트래픽 회복 · 포털 벌점',{tr:.05,pen:1,penWhy:'자극적 제목'}),fCh('버틴다','트래픽↓',{tr:-.06})]);}},
 {w:2,c:()=>(S.rank>=5||S.founder)&&S.portal&&S.portal.lv===3,run:()=>openModal('CP 전재료 협상',`<p class="lede">포털이 내년 콘텐츠 제휴 전재료 협상을 하자고 한다. "트래픽 기준으로 재산정하겠습니다."</p>`,[fCh('독점 기사를 무기로 인상을 요구한다','자금↑ 또는 관계↓',{},()=>{if(chance(.45+S.co.q/250)){S.cpBoost=(S.cpBoost||1)*1.15;toast('전재료 15% 인상');}else{netUp('portal',-10);toast('포털과 관계가 틀어졌다');}}),fCh('조건을 받아들인다','',{}),fCh('다른 포털과도 제휴를 추진한다','평판↑ · 협상력↑',{fame:.5},()=>{S.cpBoost=(S.cpBoost||1)*1.05;})])},
 {w:2,c:()=>(S.rank>=5||S.founder)&&S.co.subs>0,run:()=>openModal('구독 해지 러시',`<p class="lede">가격 인상 뒤 구독 해지가 평소의 세 배다.</p>`,[fCh('장기 구독 할인을 연다','구독 유지 · 수입↓',{subs:.01,cash:-.1}),fCh('구독자 전용 기사를 늘린다','품질↑ · 구독↑',{q:1,subs:.02,hp:-4}),fCh('가격을 되돌린다','신뢰↑',{trust:1,subs:.01})])},
 {w:2,c:()=>(S.rank>=5||S.founder)&&month()===12,run:()=>openModal('연말 구독 캠페인',`<p class="lede">연말은 구독·후원이 가장 많이 들어오는 시기다.</p>`,[fCh('기자들이 쓴 손편지 캠페인','구독↑↑ · 컨디션↓',{subs:.05,hp:-5}),fCh('할인 이벤트','구독↑ · 수입↓',{subs:.04,cash:-.15}),fCh('평소대로','',{})])},
 {w:1,c:()=>(S.rank>=5||S.founder)&&!(S.biz&&S.biz.video),run:()=>openModal('영상 제작사의 제안',`<p class="lede">외주 영상 제작사가 "기사 영상화 수익을 반씩 나누자"고 한다.</p>`,[fCh('계약한다','영상 사업 1단계 무료 시작',{},()=>{S.biz=S.biz||{};S.biz.video=1;}),fCh('직접 하겠다고 한다','',{})])},
 {w:1,c:()=>(S.rank>=5||S.founder)&&(S.biz&&S.biz.native),run:()=>openModal('협찬 기사 논란',`<p class="lede">우리 협찬 기사에 "광고"라는 표시가 작다는 지적이 나왔다.</p>`,[fCh('표시를 크게 바꾼다','신뢰↑ · 협찬 수입↓',{trust:2},()=>{S.biz.native=Math.max(1,S.biz.native-1);}),fCh('업계 관행이라고 해명한다','신뢰↓ · 포털 벌점',{trust:-2,pen:1,penWhy:'협찬 기사 표시'})])}
);

// ===== 지자체·체육 행사 사업: 마라톤·탁구대회·축제 공동 주최 =====
// 실제 사례 규모 참고: 지역 마라톤 1회 예산 약 4~5억 원(시 보조금 2.5억 + 참가비 2억), 광역·기초 보조금 수천만~1억 원대
// [이름, 기본 예산(억, ★3 지역지 기준), 보조금 비율, 참가비 비율, 협찬 비율, 컨디션 부담, 사고 위험, 평판, 맞는 매체]
const LGE={
 marathon:['마라톤대회',3,.45,.4,.22,15,.1,2.5,'local,sports,daily'],
 pingpong:['전국 탁구대회',1.2,.5,.22,.3,8,.03,1.2,'local,sports'],
 bike:['그란폰도 자전거대회',1.8,.4,.45,.18,12,.09,1.5,'local,sports'],
 walk:['시민 걷기대회',.7,.55,.2,.25,6,.03,1,'local,daily'],
 golf:['아마추어 골프대회',1.5,.1,.5,.42,8,.03,.8,'econ,daily,sports'],
 baduk:['바둑·장기 대회',.6,.5,.2,.3,5,.01,.9,'local,daily'],
 art:['학생 미술대전·백일장',.8,.6,.25,.15,7,.01,1.5,'local,daily,weekly'],
 youth:['청소년 과학경진대회',.7,.62,.12,.26,6,.01,1.3,'local,daily,trade'],
 photo:['사진 공모전',.4,.5,.3,.2,3,.005,.8,'local,online,weekly'],
 song:['트로트 가요제',2,.5,.06,.44,12,.06,1.6,'local,tv,online'],
 festival:['지역 축제 공동 주최',4,.7,.05,.25,18,.1,2,'local'],
 forum:['지역 경제포럼',1,.3,.12,.58,6,.01,1.5,'local,econ,daily']
};
function cityEnt(){return ENT.city?'city':ENT.lcouncil?'lcouncil':null;}
function cityName(){const id=cityEnt();return id?entName(id):'지자체';}
function lgeScale(){const o=OUT();return ({1:.35,2:.55,3:1,4:1.5,5:2}[o.p]||1)*(o.type==='local'?1.1:1);}
function lgeFit(k){return LGE[k][8].split(',').includes(OUT().type);}
function canLge(){return S.phase==='game'&&(S.rank>=5||S.founder);}
RUN.lgevent=function(){S.lge=S.lge||[];const o=OUT();const up=S.lge.filter(e=>!e.done);
  openModal('행사 사업 유치',`<p>${esc(cityName())}·체육회·협회와 손잡고 대회와 행사를 연다. 보조금·참가비·협찬이 들어오고, 「${esc(o.n)}」 이름이 동네방네 알려진다. 대신 준비에 사람과 품이 들고, 사고가 나면 책임도 진다.</p>${up.length?`<p class="hint">준비 중: ${up.map(e=>`${esc(e.n)} (${moTxt(e.due-S.turn)} 뒤)`).join(' · ')}</p>`:''}${(S.lgeReg||[]).length?`<p class="hint">정례 행사: ${S.lgeReg.map(r=>esc(LGE[r.k][0])+' '+r.n+'회').join(' · ')}</p>`:''}`,
   Object.keys(LGE).filter(k=>!up.some(e=>e.k===k)).sort((a,b)=>lgeFit(b)-lgeFit(a)).map(k=>{const L=LGE[k];const bud=+(L[1]*lgeScale()).toFixed(1);
     return{label:`${L[0]}${lgeFit(k)?' · 우리 매체와 잘 맞음':''}`,sub:`예산 약 ${eok(bud)} · 보조금 ${Math.round(L[2]*100)}% · 참가비 ${Math.round(L[3]*100)}% · 협찬 ${Math.round(L[4]*100)}% · 준비 부담 ${L[5]>=12?'큼':L[5]>=7?'보통':'작음'}`,fn:()=>{lgeHow(k,bud);return false;}};}).concat([{label:'닫기',cls:'ghost'}]));};
function lgeHow(k,bud){const L=LGE[k],cid=cityEnt(),rel=cid?netRel(cid):10;
  const pSub=clamp(.35+rel/150+S.fame/250+(lgeFit(k)?.1:0),.1,.92);
  openModal(`${L[0]} · 어떻게 유치할까`,`<p class="lede">예산 약 ${eok(bud)}짜리 사업이다.</p><p>${jo2(esc(cityName()),'과','와')}의 관계 ${Math.round(rel)} · 업계 평판 ${Math.round(S.fame)}</p>`,[
   {label:`${cityName()} 보조금을 신청한다`,sub:`선정 확률 약 ${Math.round(pSub*100)}% · 선정되면 예산의 ${Math.round(L[2]*100)}%를 보조금으로`,fn:()=>{spend(1,4);if(chance(pSub)){lgeScaleStep(k,bud,'sub');}else{openModal('보조금 탈락',`<p class="lede">${esc(cityName())} 심사에서 떨어졌다. "올해는 예산이 빠듯합니다."</p><p class="hint">협찬만으로 열거나, 관계를 다진 뒤 다시 신청할 수 있다.</p>`,[{label:'협찬만으로 연다',sub:'보조금 없이',fn:()=>{lgeScaleStep(k,bud,'self');return false;}},{label:'접는다',cls:'ghost'}]);}return false;}},
   {label:'지자체와 공동 주최로 간다',sub:'보조금 비율↑ · 대신 지자체 이름이 앞에 서고, 시정 비판 기사를 쓰기 어려워진다',disabled:!cid||rel<20,fn:()=>{spend(1,4);lgeScaleStep(k,bud,'co');return false;}},
   {label:'기업 협찬만으로 연다',sub:'보조금 없음 · 협찬 영업 부담↑ · 광고주 관계↑',fn:()=>{spend(1,5);lgeScaleStep(k,bud,'self');return false;}},
   {label:'뒤로',cls:'ghost',fn:()=>{RUN.lgevent();return false;}}]);}
function lgeScaleStep(k,bud,how){const L=LGE[k];
  openModal(`${L[0]} · 규모`,`<p>규모가 클수록 수입과 홍보 효과가 크지만 준비 부담과 사고 위험도 커진다.</p>`,[['작게',.6],['평소대로',1],['크게 (전국 규모)',1.6]].map(([n,m])=>({label:n,sub:`예산 약 ${eok(bud*m)} · 준비 ${m>1?3:2}개월`,fn:()=>{const o=OUT();S.lgeCnt=S.lgeCnt||{};const n0=(S.lgeCnt[k]||0)+1;
    const e={k,n:`제${n0}회 ${o.n}배 ${L[0]}`,bud:+(bud*m).toFixed(2),m,how,due:S.turn+(m>1?12:8),done:false,prep:0};S.lge.push(e);log(`행사 유치: ${e.n} (${how==='sub'?'보조금':how==='co'?'공동 주최':'협찬'})`);tick(`${o.n}, 「${e.n}」 개최 확정`);
    if(how==='co'){S.coHost=(S.coHost||0)+1;}openModal('개최 확정',`<p class="lede">「${esc(e.n)}」 개최가 확정됐다. ${moTxt(e.due-S.turn)} 뒤 열린다.</p><p class="hint">그동안 준비 상황에 따라 이벤트가 생긴다. 사업국·체육부 사람들이 바빠진다.</p>`);return false;}})).concat([{label:'취소',cls:'ghost'}]));}
function lgeTick(Qx){if(!S.lge||!S.lge.length)return;S.lge.filter(e=>!e.done).forEach(e=>{const left=e.due-S.turn;
  if(left===4&&!e.mid){e.mid=1;Qx.push(()=>lgePrep(e));}
  if(left<=0){e.done=true;Qx.push(()=>lgeDay(e));}});
  // 정례 행사: 해마다 같은 달에 자동으로
  (S.lgeReg||[]).forEach(r=>{if(S.turn>=r.next){r.next=S.turn+YW;r.n++;const L=LGE[r.k];const o=OUT();const e={k:r.k,n:`제${r.n}회 ${o.n}배 ${L[0]}`,bud:r.bud,m:1,how:r.how,due:S.turn+4,done:false,reg:1};S.lge.push(e);}});}
function lgePrep(e){const L=LGE[e.k];const ev=pick([
  ['협찬사 이탈',`메인 협찬사가 "올해는 어렵다"며 빠졌다.`,[['다른 협찬사를 급히 찾는다','컨디션↓ · 협찬 일부 회복',()=>{S.hp=clamp(S.hp-8,0,100);e.spons=.7;}],['규모를 줄인다','예산↓',()=>{e.bud*=.8;e.spons=.9;}]]],
  ['교통 통제 민원',`대회 코스 주민들이 "길 막지 말라"며 시청에 민원을 넣었다.`,[['코스를 바꾼다','비용↑ · 민원 해소',()=>{e.cost=(e.cost||0)+.05*e.bud;}],['그대로 간다','민원이 기사화될 수도',()=>{e.risk=(e.risk||0)+.05;}]]],
  ['스타 섭외 제안',`유명인 홍보대사를 섭외할 수 있다. 출연료가 든다.`,[['섭외한다','비용↑ · 흥행↑',()=>{e.cost=(e.cost||0)+.08*e.bud;e.boost=1.25;}],['안 한다','',()=>{}]]],
  ['자원봉사자 부족',`진행 요원이 모자란다.`,[['기자들을 동원한다','관계↓ · 비용 절감',()=>{(S.cols||[]).forEach(c=>c.rel=clamp(c.rel-2,-50,100));if(S.team)S.team.forEach(m=>mRel(m,-3));}],['용역을 쓴다','비용↑',()=>{e.cost=(e.cost||0)+.04*e.bud;}]]],
  ['참가 신청 폭주',`참가 신청이 예상보다 1.5배 많다.`,[['정원을 늘린다','참가비↑ · 안전 부담↑',()=>{e.fees=1.4;e.risk=(e.risk||0)+.04;}],['선착순 마감','',()=>{e.fees=1.1;}]]]]);
  openModal(`${e.n} · 준비 상황`,`<p class="lede">${ev[1]}</p><p class="hint">대회까지 ${moTxt(e.due-S.turn)}</p>`,ev[2].map(([l,s,f])=>({label:l,sub:s,fn:()=>{f();}})));}
function lgeDay(e){const L=LGE[e.k],o=OUT();const weather=Math.random();const acc=chance((L[6]+(e.risk||0))*(e.m||1)*(DF().risk||1));
  const perf=(weather<.12?.7:weather>.85?1.15:1)*(e.boost||1)*(lgeFit(e.k)?1.1:1)*Math.sqrt(mediaPower());
  const subR=e.how==='sub'?L[2]:e.how==='co'?L[2]*1.25:0,spR=L[4]*(e.how==='self'?1.35:1)*(e.spons||1),feeR=L[3]*(e.fees||1)*perf;
  const inc=e.bud*(subR+spR+feeR),cost=e.bud*(S.lgeDesk?.82:.86)+(e.cost||0)+(acc?e.bud*.12:0);const promo=e.bud*.07;const net=inc-cost+promo;
  S.co.cash+=net;S.lgeTotal=(S.lgeTotal||0)+net;const cid=cityEnt();
  const lines=[`날씨: ${weather<.12?'비가 쏟아졌다. 참가자가 줄었다.':weather>.85?'완벽한 날씨. 역대 최다 인파.':'무난했다.'}`,`수입 ${eok(inc)} (보조금 ${f1(e.bud*subR)} · 협찬 ${f1(e.bud*spR)} · 참가비 ${f1(e.bud*feeR)}) · 비용 ${eok(cost)} · 홍보 효과 ${eok(promo)}`];
  if(acc)lines.push(pick(['참가자 한 명이 쓰러져 병원으로 옮겨졌다. 안전 관리 책임 논란이 일었다.','무대 구조물이 기울어 행사가 한 시간 멈췄다.','교통 통제 구간에서 접촉 사고가 났다.']));
  const fx=apply({fame:L[7]*(e.m||1)*(acc?.4:1),trust:acc?-2:0});if(cid)netUp(cid,acc?-6:6);coBump(.004*(e.m||1),.01*(e.m||1));
  log(`${e.n} 개최 · ${net>=0?'순수익':'적자'} ${eok(Math.abs(net))}`);tick(`「${e.n}」 성황리 개최`,1);
  openModal(`${e.n}`,`<p class="lede">${acc?'행사는 끝났지만 뒷말이 남았다.':perf>1.05?'성황리에 끝났다. 지역 방송도 뉴스로 다뤘다.':'무사히 끝났다.'}</p><ul class="feed">${lines.map(l=>`<li>${esc(l)}</li>`).join('')}</ul><p>${net>=0?`순수익 <b>${eok(net)}</b>`:`적자 <b style="color:var(--red)">${eok(-net)}</b>`}</p>${fxLine(fx)}`,
   e.reg?[{label:'확인'}]:[{label:'해마다 여는 정례 행사로 만든다',sub:'내년부터 같은 시기에 자동 개최 · 준비 부담↓',fn:()=>{S.lgeReg=S.lgeReg||[];if(!S.lgeReg.some(r=>r.k===e.k)){S.lgeReg.push({k:e.k,bud:e.bud,how:e.how,n:1,next:S.turn+YW-4});}S.lgeCnt=S.lgeCnt||{};S.lgeCnt[e.k]=1;toast('정례 행사로 등록했다');}},{label:'이번 한 번으로 끝낸다',fn:()=>{S.lgeCnt=S.lgeCnt||{};S.lgeCnt[e.k]=(S.lgeCnt[e.k]||0)+1;}}]);
  if(!e.reg){S.lgeCnt=S.lgeCnt||{};}}
function lgeBox(){const up=(S.lge||[]).filter(e=>!e.done),reg=S.lgeReg||[];if(!up.length&&!reg.length&&!S.lgeTotal)return '';return `<div class="sec">행사 사업</div><p class="hint" style="margin:0">${up.length?`준비 중: ${up.map(e=>`${esc(e.n)} (${moTxt(e.due-S.turn)} 뒤)`).join(' · ')}<br>`:''}${reg.length?`정례 행사: ${reg.map(r=>esc(LGE[r.k][0])).join(' · ')}<br>`:''}지금까지 행사 순수익 ${eok(S.lgeTotal||0)}</p>`;}
// 행사 사업 관련 이벤트
F_EVENTS.push(
 {w:3,c:()=>canLge()&&(S.lgeReg||[]).length>0&&cityEnt(),run:()=>openModal('보조금 감사',`<p class="lede">시의회가 "${jo2(esc(cityName()),'이','가')} 특정 언론사 행사에 보조금을 몰아준다"며 감사를 요구했다.</p>`,[fCh('정산 자료를 전부 공개한다','신뢰↑ · 컨디션↓',{trust:2,hp:-5}),fCh('시청에 맡긴다','',{},()=>{if(chance(.35)){toast(fHit({trust:-3})+' · 타사가 "보조금 특혜" 기사를 냈다');}})])},
 {w:3,c:()=>canLge()&&(S.coHost||0)>0&&cityEnt()&&S.items.some(i=>i.d==='loc'||i.ent===cityEnt()),run:()=>{const it=S.items.find(i=>i.d==='loc'||i.ent===cityEnt())||S.items[0];openModal('보조금과 기사 사이',`<p class="lede">${esc(cityName())} 관계자: "「${esc(it.title)}」 그거, 내년 행사 보조금 심사 앞두고 꼭 내야 합니까?"</p>`,[fCh('쓴다. 행사와 기사는 별개다','신뢰↑ · 지자체 관계↓ · 정례 행사 위기',{trust:3},()=>{netUp(cityEnt(),-15);S.resist=(S.resist||0)+1;if(S.lgeReg&&S.lgeReg.length&&chance(.4)){const r=S.lgeReg.shift();toast(`${LGE[r.k][0]} 보조금이 끊겼다`);}}),fCh('수위를 낮춘다','신뢰↓',{trust:-4},()=>netUp(cityEnt(),6))]);}},
 {w:2,c:()=>canLge()&&(S.lgeReg||[]).length>0&&S.comp&&S.comp.length,run:()=>{const c=compPick();const r=pick(S.lgeReg);openModal('행사 유치 경쟁',`<p class="lede">${jo2(esc(cName(c)),'이','가')} "우리가 더 크게 열겠다"며 ${esc(LGE[r.k][0])} 주관사 자리를 노린다.</p>`,[fCh('예산을 늘려 지킨다','자금↓ · 행사 유지',{cash:-.15*lgeScale()}),fCh('공정하게 공모로 가자고 한다','신뢰↑ · 뺏길 수도',{trust:1},()=>{if(chance(.4)){S.lgeReg=S.lgeReg.filter(x=>x!==r);toast(`${jo2(LGE[r.k][0],'을','를')} 경쟁사에 뺏겼다`);}}),fCh('넘겨준다','',{},()=>{S.lgeReg=S.lgeReg.filter(x=>x!==r);})]);}},
 {w:2,c:()=>canLge()&&!(S.lge||[]).length&&cityEnt()&&netRel(cityEnt())>=25,run:()=>{const k=pick(Object.keys(LGE).filter(lgeFit));if(!k)return closeModal();openModal('지자체의 제안',`<p class="lede">${esc(cityName())} 체육·문화 담당 과장: "올해 ${esc(LGE[k][0])}, 「${esc(OUT().n)}」에서 맡아 주시면 보조금은 저희가 챙기겠습니다."</p>`,[{label:'맡는다',sub:'보조금 확정 · 규모를 고른다',fn:()=>{lgeScaleStep(k,+(LGE[k][1]*lgeScale()).toFixed(1),'sub');return false;}},fCh('정중히 사양한다','',{})]);}},
 {w:1,c:()=>canLge()&&(S.lgeReg||[]).length>=2,run:()=>openModal('행사 사업국 신설',`<p class="lede">정례 행사가 늘면서 기자들이 행사 준비에 동원되는 일이 잦다. 사업국을 따로 만들자는 의견이 나왔다.</p>`,[fCh('사업국을 만든다','인건비↑ · 기자 동원 없음 · 행사 수익↑',{cash:-.3,rel:4},()=>{S.lgeDesk=1;}),fCh('지금처럼 간다','관계 조금↓',{rel:-2})])}
);

// ===== 부서 개성: 부서마다 특수 효과와 잘 크는 능력치 =====
const DEPT_FX={
 pol:['정치부','국회·정당을 도는 부서. 평판은 잘 오르지만 관계망이 크게 출렁이고 늘 바쁘다',{fame:1.1,hp:1.05},{net:1.3,kno:1.15,int:1.1}],
 diplo:['외교안보부','엠바고와 보안의 세계. 아이템은 적지만 하나하나가 무겁다',{item:.9,fame:1.08},{lng:1.25,kno:1.2,ver:1.1}],
 int:['국제부','외신과 특파원. 아이템은 덜 돌지만 어학과 상식이 쑥쑥 큰다',{item:.9,hp:.95},{lng:1.4,kno:1.2}],
 eco:['경제부','부처와 거시 지표. 숫자에 강해지고 광고주 눈치를 본다',{eval:1.03},{dat:1.3,kno:1.15}],
 ind:['산업부','대기업 출입. 광고주와의 관계가 기사만큼 중요하다',{item:1.05,trust:.95},{net:1.2,dat:1.15}],
 fin:['금융부','은행·금융당국. 숫자와 규제에 밝아진다',{},{dat:1.3,ver:1.1}],
 stock:['증권부','장 마감이 곧 마감. 속도가 생명이다',{hp:1.05},{spd:1.3,dat:1.2}],
 estate:['부동산부','독자 관심 1순위. 기사 반응이 크다',{fame:1.05},{dat:1.2,inv:1.1}],
 it:['IT과학부','신기술과 플랫폼. 데이터와 상식이 크게 는다',{hp:.95},{dat:1.25,kno:1.25}],
 soc:['사회부','사건과 민원의 최전선. 아이템은 많지만 몸이 고되다',{item:1.08,hp:1.08},{inv:1.2,sta:1.1,cha:1.1}],
 court:['법조팀','판결문과 영장. 검증력이 크게 늘고 소송 위험은 낮다',{legal:.8},{ver:1.35,kno:1.15}],
 case:['사건팀','경찰서와 현장. 단독이 자주 터지고 타사 추격도 빠르다',{item:1.12,hp:1.12,heat:1.1},{inv:1.25,sta:1.15,spd:1.1}],
 inv:['탐사보도팀','한 달에 한 방. 아이템은 적지만 평판이 크게 오르고 소송도 따라온다',{item:.82,fame:1.22,legal:1.3},{inv:1.25,ver:1.25,dat:1.15}],
 med:['의료팀','병원과 보건 당국. 전문성이 쌓인다',{},{kno:1.25,ver:1.15}],
 edu:['교육팀','학부모의 관심이 쏠린다. 민원과 제보가 많다',{item:1.05},{cha:1.15,kno:1.1}],
 cul:['문화부','공연·전시·출판. 덜 지치고 글이 는다',{hp:.9,fame:.95},{wri:1.3,hed:1.15}],
 ent:['연예부','조회수 전쟁. 트래픽과 평판은 오르지만 신뢰는 덜 오른다',{fame:1.05,trust:.92,item:1.08},{spd:1.2,hed:1.25,cha:1.1}],
 culspo:['문화체육부','문화와 스포츠를 같이 본다. 출입처가 넓다',{item:1.05},{wri:1.15,spd:1.1}],
 spo:['체육부','경기 결과가 곧 마감. 속도와 체력이 붙는다',{hp:1.05},{spd:1.25,sta:1.15}],
 base:['야구팀','시즌엔 매일 경기. 야간 마감이 이어진다',{hp:1.08},{spd:1.25,net:1.1}],
 foot:['축구팀','A매치와 이적 시장. 해외 소식도 챙긴다',{hp:1.05},{spd:1.2,lng:1.15}],
 nat:['전국부','전국의 지역 소식. 주재기자들과 일한다',{rel:1.1},{net:1.2,cha:1.1}],
 city:['자치행정부','시청과 의회. 지역 권력과 부딪힌다',{rel:1.1,legal:1.1},{net:1.2,kno:1.1}],
 sigun:['시·군 주재','혼자 한 지역을 맡는다. 동네 사람 모두가 취재원',{rel:1.2,item:1.05},{net:1.25,cha:1.2}],
 loc:['지역 주재','지역 밀착 취재. 관계가 잘 쌓인다',{rel:1.15},{net:1.2,cha:1.15}]
};
function deptGrow(k){if(!S||S.phase!=='game'||S.rank>=4||S.founder)return 1;const D=DEPT_FX[S.dept];const g=D&&D[3][k]||1;return Math.min(1.8,1+(g-1)*1.6);}
// ===== 사비로 하는 일 =====
function lifeSelf(){const it=S.items.find(i=>i.facts.some(f=>!fOK(f)));const m=S.money;const P=(cost,ok=true)=>!ok||m<cost;
  openModal('내 돈으로',`<p>회사 돈이 아니라 내 통장으로 하는 일들이다. 잘 쓰면 커리어가 크고, 잘못 쓰면 구설에 오른다. 통장 ${m.toLocaleString('ko-KR')}만 원.</p>`,[
   {label:'사비 출장 취재 · 80만',sub:it?`「${it.title.slice(0,16)}…」 현장에 직접 간다 · 확인 확률 높음`:'확인할 아이템이 없다',disabled:P(80,!!it),fn:()=>{buy(80,()=>{const f=it.facts.find(x=>!fOK(x));if(chance(.8)){f.conf++;f.via.push('사비 출장');}gain('inv',.5);S.hp=clamp(S.hp-8,0,100);},'주말에 내 돈으로 현장에 다녀왔다');}},
   {label:'유료 자료·DB 구입 · 30만',sub:it?'판결문·등기·기업 정보 DB · 숫자·문건 사실 확인':'확인할 아이템이 없다',disabled:P(30,!!it),fn:()=>{buy(30,()=>{const f=it.facts.find(x=>!fOK(x)&&(x.k==='n'||x.k==='d'))||it.facts.find(x=>!fOK(x));if(chance(.65)){f.conf++;f.via.push('유료 DB');}gain('dat',.4);},'유료 데이터베이스로 자료를 뒤졌다');}},
   {label:'취재원과 골프 · 70만',sub:'취재원 신뢰 크게↑ · 청탁금지법 위반 소지 (들키면 징계)',disabled:P(70,S.sources.length>0),fn:()=>{const s=S.sources.slice().sort((a,b)=>b.trust-a.trust)[0];buy(70,()=>{s.trust=clamp(s.trust+18,0,100);if(chance(.22)){Q.push(()=>openModal('골프 접대 논란',`<p class="lede">${esc(s.name)} ${esc(s.role)}와의 골프가 회사 감사실에 제보됐다. 비용을 누가 냈는지 따지고 있다.</p>`,[{label:'영수증을 내고 해명한다',sub:'내 돈이었다',fn:()=>toast(apply({eval:-1.5,trust:-1}))},{label:'사과한다',fn:()=>toast(apply({eval:-3,trust:-2}))}]));}},`${jo2(s?s.name:'','과','와')} 라운딩을 했다`);}},
   {label:'사비 탐사 프로젝트 · 500만',sub:'몇 달 모은 내 돈으로 큰 기획을 판다 · 확인이 반쯤 된 단독 아이템 · 반년에 한 번',disabled:P(500,!(S.selfInv>S.turn-24)&&S.rank<=3),fn:()=>{buy(500,()=>{S.selfInv=S.turn;const x=makeItem(S.dept,{excl:true,mult:1.3,pre:2,keyConf:true});S.items.push(x);gain('inv',1);log(`사비 탐사: 「${x.title}」`);},'자료 구입·출장·인터뷰에 내 돈을 썼다. 굵직한 기획이 손에 잡혔다');}},
   {label:'데이터 저널리즘 과정 · 200만',sub:`데이터 +2 · 검증력 +1 · 최대 3번 (지금 ${S.dataC||0}번)`,disabled:P(200,(S.dataC||0)<3),fn:()=>{buy(200,()=>{S.dataC=(S.dataC||0)+1;gain('dat',2);gain('ver',1);},'주말 데이터 과정을 수료했다');}},
   {label:'단기 어학연수 · 400만',sub:'어학 +4 · 국제부·특파원·영문 매체에 유리 · 한 번',disabled:P(400,!S.lngC),fn:()=>{buy(400,()=>{S.lngC=1;gain('lng',4);S.hp=clamp(S.hp-5,0,100);},'휴가를 몰아 어학연수를 다녀왔다');}},
   {label:'언론대학원 · 1,500만',sub:'상식·검증력·필력 +2 · 평가·평판↑ · 이직·승진 때 경력으로 인정 · 3년 차부터',disabled:P(1500,!S.grad&&years()>=3),fn:()=>{buy(1500,()=>{S.grad=dateShort();gain('kno',2);gain('ver',2);gain('wri',2);apply({eval:2,fame:2});log('언론대학원 석사 수료');ach&&0;},'2년 야간 과정을 버텨 석사 학위를 받았다');}},
   {label:'책을 낸다 · 300만',sub:'그동안의 취재를 책으로 · 평판↑ · 몇 달 뒤 인세',disabled:P(300,(S.totalArticles||0)>=20),fn:()=>{buy(300,()=>{S.book={due:S.turn+R(12,24),royalty:R(80,600)};apply({fame:2.5});log('책 출간');tick(`${S.name} 기자, 취재기 출간`);},'책이 나왔다');}},
   {label:'개인 뉴스레터 부업',sub:'매달 몇십만 원 · 회사 겸직 규정에 걸릴 수 있다',disabled:!!S.sideNL,fn:()=>{S.sideNL={t:S.turn};toast('개인 뉴스레터를 시작했다');}},
   {label:'모교 후배 장학금 · 100만',sub:'평판·신뢰 조금↑ · 멘탈↑',disabled:P(100),fn:()=>{buy(100,()=>{apply({fame:.6,trust:.6});gain('men',.6);},'모교에 장학금을 냈다');}},
   {label:'주말 봉사활동',sub:'돈은 안 든다 · 컨디션↓ · 멘탈↑ · 가끔 제보가 생긴다',fn:()=>{S.hp=clamp(S.hp-6,0,100);gain('men',.5);gain('cha',.3);if(chance(.25)){const x=makeItem(S.dept,{pre:1});S.items.push(x);toast(`봉사 현장에서 들은 이야기 → 「${x.title}」`);}else toast('주말 봉사를 다녀왔다');}},
   {label:'반려동물 입양 · 50만 (월 10만)',sub:'멘탈·컨디션 회복↑',disabled:P(50,!S.pet),fn:()=>{buy(50,()=>{S.pet={t:S.turn};gain('men',1);},'반려동물을 들였다');}},
   {label:'코인 투자',sub:'크게 벌거나 크게 잃는다',fn:()=>{lifeCoin();return false;}},
   {label:'뒤로',cls:'ghost',fn:()=>{RUN.life();return false;}}]);}
function lifeCoin(){openModal('코인 투자',`<p>지금 코인 ${(S.coin||0).toLocaleString('ko-KR')}만 원. 평소엔 매달 ±20% 안팎으로 출렁이고, 가끔 반토막 이상 폭락하거나 두 배 가까이 폭등한다. 길게 보면 거의 제자리다.</p>`,[[100,'100만'],[500,'500만'],[1000,'1000만']].map(([v,n])=>({label:`${n} 넣기`,disabled:S.money<v,fn:()=>{S.money-=v;S.coin=(S.coin||0)+v;toast(`코인 ${n} 매수`);}})).concat([{label:'전부 판다',disabled:!S.coin,fn:()=>{S.money+=S.coin;toast(`코인 ${S.coin.toLocaleString('ko-KR')}만 원 매도`);S.coin=0;}},{label:'뒤로',cls:'ghost',fn:()=>{lifeSelf();return false;}}]));}
// 코인: 평소엔 ±20% 안팎으로 출렁이고(평균 +1% 정도), 가끔 폭락(-50~-80%)·폭등(+60~+120%)
function coinPct(){const x=Math.random();return x<.04?-R(50,80):x<.07?R(60,120):R(-20,22);}
function selfMonth(lines){if(S.coin){const d=Math.round(S.coin*coinPct()/100);S.coin=Math.max(0,S.coin+d);lines.push({c:d>=0?'g':'r',t:`코인 ${d>=0?'+':''}${d.toLocaleString('ko-KR')}만 원 (평가 ${S.coin.toLocaleString('ko-KR')}만)`});}
  if(S.pet){S.money-=10;S.hp=clamp(S.hp+3,0,100);}
  if(S.sideNL){const g=R(10,30)+Math.round(S.fame/2);S.money+=g;if(chance(.04)){S.sideNL=null;lines.push({c:'r',t:'회사가 개인 뉴스레터를 겸직 위반으로 문제 삼았다. 접기로 했다.'});apply({eval:-2});}}
  if(S.book&&S.turn>=S.book.due){S.money+=S.book.royalty;lines.push({c:'g',t:`책 인세 ${S.book.royalty}만 원 입금`});if(S.book.royalty>=400)apply({fame:1.5});S.book=null;}}
// ===== 권고사직·희망퇴직 (드물게) =====
function exitCheck(Qx){if(S.founder||S.story||S.rank===0||S.rank>=7||S.offerExit>S.turn)return;const c=S.co,o=OUT();const yrs=years();
  const hard=c&&(c.cash<0||(c.last&&c.last.profit<-o.p*.4));const old=(typeof myAge==='function'?myAge()>=55:yrs>=25)&&S.rank<=4;const stall=S.inRank>=YW*8&&S.rank<=3&&S.eval<50;
  let p=0;if(hard)p+=.02;if(old)p+=.012;if(stall)p+=.008;if(!p||!chance(p*(DF().crisis||1)))return;S.offerExit=S.turn+YW;
  const pay=payOf(o);const bonus=Math.round(pay*(hard?R(12,24):R(18,30))/10)*10;const why=hard?'회사 재정이 어렵다며 희망퇴직 신청을 받는다':old?'정년을 앞둔 고연차에게 명예퇴직을 권한다':'오래 승진이 멈춘 기자들에게 권고사직 면담이 돌았다';
  Qx.push(()=>openModal(hard?'희망퇴직 공고':old?'명예퇴직 권유':'권고사직 면담',`<p class="lede">${jo2(o.n,'이','가')} ${why}. 인사팀이 내게도 면담을 잡았다.</p><p>위로금은 월급 약 ${Math.round(bonus/pay)}개월치, <b>${bonus.toLocaleString('ko-KR')}만 원</b>이다.</p><p class="hint">받아들이면 지금 커리어가 끝난다. 거절해도 당장 불이익은 없지만, 분위기는 차가워진다.</p>`,[
   {label:'받아들인다',sub:`위로금 ${bonus.toLocaleString('ko-KR')}만 원 · 커리어 종료`,fn:()=>{S.money+=bonus;ending(hard?'희망퇴직':old?'명예퇴직':'권고사직');return false;}},
   {label:'위로금을 받고 창간을 준비한다',sub:'위로금 + 퇴직 후 독립 언론 창간',disabled:S.rank<2,fn:()=>{S.money+=bonus;RUN.found();return false;}},
   {label:'거절하고 남는다',sub:'평가 조금↓ · 멘탈↓',fn:()=>{toast(apply({eval:-1,men:-.5}));}}]));}
// ===== 언론사 창간과 폐간 =====
const NEW_NAMES=['뉴스로','오늘의창','팩트온','바른뉴스','한줄신문','시선24','뉴스포인트','데일리온','지역소리','더리포트','뉴스핌K','인사이트K','미디어봄','한빛투데이','파란뉴스','뉴스웨이브','이슈플러스','더팩트체크','시민의소리','데이터뉴스'];
function mediaYear(lines){if(!S.comp||S.turn%YW!==0||S.turn<YW)return;const D=DF();S.npcOut=S.npcOut||[];
  // 폐간: 돈이 바닥나고 점유율이 낮은 경쟁사는 문을 닫는다
  S.comp.slice().forEach(c=>{const weak=(c.cash||0)<-2||((c.share||0)<4&&(c.cash||0)<1)||((c.q||50)<35&&(c.share||0)<7);if(weak&&S.comp.length>3&&chance(.45)){const o=OUTLETS.find(x=>x.id===c.id);S.comp=S.comp.filter(x=>x!==c);if(o){o.closed=1;S.closedOut=S.closedOut||[];S.closedOut.push(o.id);}lines.push({c:'r',t:`경쟁 매체 「${o?o.n:'?'}」 폐간. 기자들이 갈 곳을 찾는다.`});tick(`[속보] ${o?o.n:''} 폐간`,1);if(o&&o.id===((S.rival||{}).outlet))S.rival=null;}});
  // 창간: 해마다 몇 곳이 새로 생긴다 (어려움일수록 공격적인 신생 매체)
  if(chance(.55)&&S.npcOut.length<8){const nm=pick(NEW_NAMES.filter(n=>!OUTLETS.some(o=>o.n===n)));if(nm){const type=pick(['online','online','weekly','econ','trade']);const id='npc'+uid();const o=mkO(id,nm,type,pick(['neu','cons','prog']),'신생 독립 매체',1,`${nm}. 최근 창간한 ${TYPES[type].n}.`,({online:'pol,eco,soc,ent',weekly:'pol,eco,soc,inv',econ:'eco,stock,ind',trade:'eco,ind'}[type]).split(',').filter(d=>DEPTS[d]));o.npc=1;OUTLETS.push(o);S.npcOut.push(o);
    if(S.comp.length<7&&TYPES[type].g===TYPES[OUT().type].g){const st=pick(D===DIFF.hard?['talent','click','price']:Object.keys(C_STRAT));const c=compInit1(o,st);c.pw=6;c.cash=D===DIFF.hard?5:2;c.aggro=D===DIFF.hard?40:15;S.comp.push(c);}
    lines.push({c:'',t:`새 매체 「${nm}」 창간 (${TYPES[type].n})`});tick(`새 매체 「${nm}」 창간`);}}}
function compDiffK(){const D=DF();return D===DIFF.hard?{noise:.2,inc:1.15,agg:1.4,learn:1.3}:D===DIFF.easy?{noise:.8,inc:.88,agg:.6,learn:.7}:{noise:.5,inc:1,agg:1,learn:1};}