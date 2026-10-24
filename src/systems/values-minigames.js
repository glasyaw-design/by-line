/* 바이라인 1.6 — src/systems/values-minigames.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.1 기자의 가치: 선택이 쌓여 어떤 기자인지 정해지고, 그에 따라 이야기가 갈린다 =====
// sp: +속도 / -검증 · pb: +공익 / -흥행 · ind: +독립 / -타협
const VAL_AX={sp:['속도','검증','#ffb84d','#5ad49b'],pb:['공익','흥행','#77a6ff','#ff8fb1'],ind:['독립','타협','#b98cff','#9aa3b2']};
const VAL_P={sp:[['속보형','누구보다 먼저 쓴다. 이름은 빨리 알려지지만 실수도 빨리 퍼진다'],['검증형','확인될 때까지 쓰지 않는다. 늦지만 무너지지 않는다']],
 pb:[['공익형','읽히는 기사보다 필요한 기사를 쓴다. 독자와 제보자가 따라온다'],['흥행형','숫자가 말해 준다. 조회수는 오르지만 신뢰는 얇아진다']],
 ind:[['독립형','광고도 권력도 눈치 보지 않는다. 적이 많아지고 이름도 남는다'],['타협형','회사 사정도 생각한다. 일이 편해지는 만큼 약점도 쌓인다']]};
function valS(){if(!S.val)S.val={sp:0,pb:0,ind:0};return S.val;}
function valN(k,v,why){if(!S||S.story)return;const V=valS();const old=V[k];V[k]=clamp(+(V[k]+v).toFixed(1),-100,100);
  if(why){S.valLog=S.valLog||[];S.valLog.unshift({t:S.turn,k,v:+v.toFixed(1),why});S.valLog=S.valLog.slice(0,24);}
  const th=35;[[th,0],[-th,1]].forEach(([b,i])=>{if((b>0&&old<b&&V[k]>=b)||(b<0&&old>b&&V[k]<=b)){const P=VAL_P[k][i];try{log(`기자의 가치 — 「${P[0]}」 쪽으로 기울었다`);toast(`당신은 점점 「${P[0]}」 기자가 되어 간다`);}catch(e){}}});}
function valTags(){const V=valS(),L=[];for(const k in VAL_P){if(V[k]>=30)L.push(VAL_P[k][0][0]);else if(V[k]<=-30)L.push(VAL_P[k][1][0]);}return L;}
function valMulFame(){const V=S&&S.val;if(!V)return 1;return (V.sp>=30?1.06:1)*(V.ind>=30?1.04:1);}
function valMulTrust(){const V=S&&S.val;if(!V)return 1;return (V.pb>=30?1.08:1)*(V.pb<=-30?.92:1)*(V.ind<=-30?.9:1)*(V.sp<=-30?1.05:1);}
function valRisk(){const V=S&&S.val;if(!V)return 1;return V.sp<=-30?.85:V.sp>=30?1.12:1;}
function valViews(){const V=S&&S.val;if(!V)return 1;return V.pb<=-30?1.12:V.pb>=30?.96:1;}
// 기사를 낼 때 쌓이는 가치
function valWrite(W,it,ver,unv){const inc=ver.length+unv.length;
  if(unv.length)valN('sp',2.5*Math.min(3,unv.length),`확인 안 된 사실 ${unv.length}개를 넣고 출고`);else if(ver.length>=3&&inc===ver.length)valN('sp',-2,'확인된 사실로만 기사를 채웠다');
  if(W.speed)valN('sp',2,'남보다 먼저 내보냈다');if(!W.rb)valN('sp',1);else if(it.rebut==='got')valN('sp',-1);
  if(W.head==='bait')valN('pb',-4,'자극적인 제목을 달았다');else if(W.head==='honest'||W.head==='calm')valN('pb',1.2);else if(W.head==='ask')valN('pb',-1);
  if((W.vm||1)>=1.8)valN('pb',-3,'클릭을 부르는 썸네일을 붙였다');
  if(W.adTone==='soft')valN('ind',-4,'광고주를 의식해 표현을 누그러뜨렸다');else if(W.adTone==='hard')valN('ind',4,'광고주 기사를 그대로 냈다');
  if(it.imp>=50&&/의혹|비리|부실|은폐|특혜|유착|횡령|갑질/.test(it.title))valN('pb',1.5);}
function valBox(){const V=valS();const tags=valTags();const bar=k=>{const v=V[k],A=VAL_AX[k];const w=Math.abs(v)/2;return `<div class="vb-row"><span class="vb-l" style="color:${A[3]}">${A[1]}</span><div class="vb-bar"><i style="${v<0?`right:50%;width:${w}%;background:${A[3]}`:`left:50%;width:${w}%;background:${A[2]}`}"></i><b></b></div><span class="vb-l" style="color:${A[2]}">${A[0]}</span></div>`;};
  const last=(S.valLog||[]).filter(x=>x.why).slice(0,3);
  return `<div class="card"><div class="t">${ic('heart')} 나는 어떤 기자인가</div>${bar('sp')}${bar('pb')}${bar('ind')}<p class="hint" style="margin:6px 0 0">${tags.length?`동료들은 나를 <b>${tags.join(' · ')}</b> 기자로 본다. ${tags.map(t=>{for(const k in VAL_P)for(const p of VAL_P[k])if(p[0]===t)return p[1];return '';}).join(' / ')}`:'아직 색깔이 뚜렷하지 않다. 무엇을 앞세울지는 선택이 정한다.'}</p>${last.length?`<p class="hint" style="margin:4px 0 0">최근: ${last.map(x=>esc(x.why)).join(' · ')}</p>`:''}</div>`;}
// 가치가 뚜렷해지면 그에 맞는 일이 찾아온다
function valMonth(lines){if(!S||S.story||S.phase!=='game'||S.rank===0)return;const V=valS();S.valEv=S.valEv||{};const due=k=>(S.valEv[k]||-999)<S.turn-YW;
  // 매달 아주 조금씩 가운데로 돌아온다 (한때의 선택보다 꾸준한 선택이 남는다)
  for(const k in V)V[k]=+(V[k]*.985).toFixed(1);
  if(S.turn%12!==11)return;
  const pickK=['sp','pb','ind'].filter(k=>Math.abs(V[k])>=35).sort((a,b)=>Math.abs(V[b])-Math.abs(V[a]))[0];if(!pickK)return;const side=V[pickK]>0?0:1;const key=pickK+side;if(!due(key))return;if((S.founder||S.rank>=4)&&['sp0','sp1','pb1'].includes(key))return;S.valEv[key]=S.turn;
  const E={
   sp0:()=>openModal('속보 담당으로 차출',`<p class="lede">"제일 빨리 치는 사람 누구야?" 데스크가 당신 이름을 불렀다. 큰 사건이 터지면 당신이 1보를 맡는다.</p><p>대신 데스크가 당신 기사만 따로 한 번 더 본다. "빠른 건 좋은데, 저번처럼 틀리면 안 돼."</p>`,[
     {label:'맡는다',sub:'단독 기회 · 평판↑ · 실수하면 크게 번진다',fn:()=>{const it=makeItem(S.dept,{excl:true,mult:1.1});S.items.push(it);valN('sp',2);toast(`속보 라인을 받았다 → 「${it.title}」 · `+apply({fame:1}));}},
     {label:'이번엔 천천히 가겠다고 한다',sub:'검증 쪽으로 · 평가 조금↓',fn:()=>{valN('sp',-8,'속보 차출을 고사했다');toast(apply({eval:-.5}));}}]),
   sp1:()=>openModal('탐사팀이 부른다',`<p class="lede">탐사보도팀장이 커피를 사며 말했다. "당신 기사는 반박이 안 들어와. 우리 팀에 올 생각 없어?"</p><p>당신이 확인해 둔 사람들 사이에서도 평이 좋다. 취재원들이 먼저 연락해 온다.</p>`,[
     {label:'탐사팀 이동을 신청한다',sub:OUT().depts.includes('inv')&&S.rank<=3?'다음 인사 때 탐사보도팀으로 · 단독 아이템':'이 회사엔 탐사팀이 없다 — 대신 단독 아이템',fn:()=>{if(OUT().depts.includes('inv')&&S.rank<=3&&S.dept!=='inv')S.reqDept='inv';const it=makeItem(S.dept,{excl:true,pre:1,mult:1.15});S.items.push(it);(S.sources||[]).forEach(x=>x.trust=clamp((x.trust||0)+3,0,100));toast(`→ 「${it.title}」 · 취재원 신뢰↑`);}},
     {label:'지금 자리에서 계속 판다',sub:'평판↑ · 취재원 신뢰↑',fn:()=>{(S.sources||[]).forEach(x=>x.trust=clamp((x.trust||0)+4,0,100));toast(apply({fame:1.2}));}}]),
   pb0:()=>{const it=makeItem(S.dept,{excl:true,pre:1,mult:1.05});it.src='독자 제보';S.items.push(it);openModal('제보가 몰린다',`<p class="lede">"이 기자라면 제대로 써 줄 것 같아서요." 시민단체와 독자들이 당신에게 제보를 보낸다.</p><p>→ 「${esc(it.title)}」</p>${fxLine(apply({trust:1}))}`);},
   pb1:()=>openModal('조회수 효자',`<p class="lede">광고국장이 편집국까지 내려와 당신 이름을 불렀다. "이번 달 페이지뷰 1등이 누구야? 고마워."</p><p>같은 날 독자 게시판엔 "요즘 이 매체 기사가 왜 이래요?"라는 글이 올라왔다.</p>`,[
     {label:'그래도 숫자가 답이다',sub:'평가↑ · 신뢰↓',fn:()=>{valN('pb',-3);toast(apply({eval:1.5,trust:-1.5}));}},
     {label:'다음 기사는 무겁게 간다',sub:'공익 쪽으로 · 신뢰 조금↑',fn:()=>{valN('pb',8,'흥행 대신 무거운 기사로 돌아섰다');toast(apply({trust:.8}));}}]),
   ind0:()=>openModal('권력의 견제',`<p class="lede">당신 기사를 불편해하는 곳이 늘었다. 출입처 한 곳이 "앞으로 자료는 공식 경로로만"이라고 통보했고, 한 광고주는 법무팀을 꾸렸다고 한다.</p><p>업계에선 당신을 두고 "그 기자는 못 건드린다"는 말이 돈다.</p>`,[
     {label:'굽히지 않는다',sub:'평판↑ · 신뢰↑ · 소송이 걸릴 수 있다',fn:()=>{if(chance(.35))S.pending.push({type:'suit',ent:null,who:'보도 대상 기업',due:S.turn+R(3,8),title:(mine()[0]||{}).h||'최근 보도'});toast(apply({fame:2,trust:1}));}},
     {label:'당분간 조용히 간다',sub:'타협 쪽으로 · 관계 회복',fn:()=>{valN('ind',-8,'압박에 한발 물러섰다');Object.values(S.net||{}).forEach(e=>{if(e.rel<0)e.rel+=5;});toast('출입처 분위기가 조금 풀렸다');}}]),
   ind1:()=>{const E0=ENTS.filter(e=>e[4]&&(e[2]==='corp'||e[2]==='gov')).sort((a,b)=>b[4]-a[4])[0];const nm=E0?E0[1]:'큰 광고주';openModal('우리 편 기자',`<p class="lede">${esc(nm)} 홍보실장이 저녁을 샀다. "기자님은 저희 사정을 잘 아시잖아요." 다음 달 신제품 기사 '원고'를 미리 보내 주겠다고 한다.</p>`,[
     {label:'원고를 받아 다듬어 쓴다',sub:'평가↑ · 돈↑ · 신뢰↓ · 나중에 문제가 될 수 있다',risk:true,fn:()=>{S.money+=20;valN('ind',-4);if(chance(.2))S.pending.push({type:'ethic',why:'광고주 홍보 원고를 받아썼다는 의혹',title:`${nm} 신제품 기사`,due:S.turn+R(8,20)});toast(apply({eval:1.2,trust:-2}));}},
     {label:'정중히 거절한다',sub:'독립 쪽으로 · 관계 조금↓',fn:()=>{valN('ind',8,'홍보 원고를 거절했다');if(E0)netUp(E0[0],-4);toast('"그럼 그냥 자료로만 드릴게요." 실장 표정이 굳었다');}}]);}};
  const f=E[key];if(f)Q.push(f);}
function valEndLine(){const t=valTags();return t.length?`동료들은 ${t.join(' · ')} 기자로 기억한다. `:'';}

// ===== 1.1 편집권 압력: 광고주·기관 때문에 기사가 죽고, 줄고, 묵힌다. 반대로 조지기도 한다 =====
function ethicOut(p){openModal('윤리 논란',`<p class="lede">${esc(p.why||'기자 윤리 문제가 불거졌다')}: 「${esc(p.title)}」</p><p>업계 매체와 시민단체가 문제를 제기했다. 기자협회 윤리위원회가 경위를 묻는다.</p>`,[
  {label:'사실대로 해명하고 사과한다',sub:'신뢰↓ · 평가↓ · 빨리 끝난다',fn:()=>{valN('ind',3,'윤리 논란에 사과했다');toast(apply({trust:-2,eval:-1.5}));log(`윤리 논란 사과: ${p.title}`);}},
  {label:'버틴다',risk:true,sub:'넘어갈 수도, 크게 번질 수도',fn:()=>{if(chance(.55)){toast('흐지부지 넘어갔다');}else{toast('기사가 줄줄이 나왔다. 회사가 경위서를 받았다 · '+apply({trust:-5,eval:-4,fame:-2}));log(`윤리 논란 확산: ${p.title}`);}}}]);}
const crit=(t)=>CRIT_RE.test(t||'');
// --- 내가 기자일 때: AI 데스크가 내 기사를 죽이거나 줄이거나 묵힌다 ---
function bossCall(it,E,id,sh,heavy,go,bs){const bn=bs?bs.name:'부장';const r=Math.random();const kind=heavy&&r<.4||r<.18?'kill':r<.62?'short':'hold';
  const line={kill:`"${jo(E.n,'은','는')} 안 돼. 이번 건은 접어. 위에서 내려온 얘기야."`,short:`"쓰긴 쓰는데 단신으로 줄여. 회사 이름은 빼고."`,hold:`"지금은 때가 아니야. 몇 주 묵혀 두자. 광고 계약 끝나고 보자고."`}[kind];
  const what={kill:'기사를 킬했다',short:'단신 처리를 지시했다',hold:'기사를 묵혀 두라고 했다'}[kind];
  const accept=()=>{if(kind==='kill'){S.items=S.items.filter(x=>x!==it);netUp(id,4);log(`${bn} 부장이 「${it.title}」 기사를 킬했다 (${E.n} 광고)`);valN('ind',-2,'광고주 기사가 킬당하는 걸 받아들였다');toast('기사가 죽었다. 취재 메모만 남았다');}
    else if(kind==='short'){valN('ind',-1);go({adTone:'soft',short:1});return false;}
    else{it.hold=S.turn+R(4,10);it.holdBy=bn;valN('ind',-1,'광고주 기사를 묵혀 두라는 지시를 따랐다');toast(`「${yamaShort(it.title,20)}」${jp(yamaShort(it.title,20),'은','는')} ${moTxt(it.hold-S.turn)} 동안 묵힌다`);}};
  S.press=S.press||{n:0};S.press.n++;
  openModal('데스크의 결정',`<p class="lede">「${esc(it.title)}」${jp(esc(it.title),'은','는')} <b>${esc(E.n)}</b> 이야기다. 우리 광고의 ${(sh*100).toFixed(1)}%를 내는 곳이다.</p><p>${esc(bn)} 부장이 ${what}. ${esc(line)}</p><p class="hint">기자에게 결정권은 없다. 받아들이거나, 맞서거나.</p>`,[
   {label:'받아들인다',sub:kind==='kill'?'아이템을 잃는다 · 데스크 관계↑':kind==='short'?'파급력↓ · 그래도 기사는 나간다':'몇 주 뒤에 다시 쓸 수 있다 · 그사이 타사가 쓸 수도',fn:()=>{if(bs)relUp(bs,1,'지시를 따랐다');return accept();}},
   {label:'맞선다',risk:true,sub:'평가·관계가 좋을수록 통한다 · 실패하면 관계↓',fn:()=>{const p=clamp(.25+(S.eval-50)/200+(bs?bs.rel:0)/300+(S.fame/400),.1,.7);
     if(chance(p)){if(bs)relUp(bs,-2,'광고주 기사를 밀어붙였다');valN('ind',4,'광고주 기사를 지켜 냈다');toast(`${bn} 부장: "...알았어. 대신 반론 확실히 받아." 기사를 지켜 냈다`);go({adTone:'hard'});return false;}
     if(bs)relUp(bs,-5,'광고주 기사로 대들었다');valN('ind',2);toast(`"고집 부리지 마." 결정은 그대로다`);return accept();}},
   ...(kind!=='short'?[{label:'다른 매체 기자에게 넘긴다',risk:true,sub:'기사는 세상에 나간다 · 들키면 징계',fn:()=>{S.items=S.items.filter(x=>x!==it);valN('ind',4,'죽은 기사를 다른 매체에 넘겼다');valN('pb',2);if(chance(.25)){if(bs)relUp(bs,-15,'기사 유출');toast('들켰다. 경위서를 쓰고 감봉 처분을 받았다 · '+apply({eval:-6,money:-60}));log(`기사 유출로 징계: ${it.title}`);}else{const rv=(S.comp||[])[0];const rn=rv?(OUTLETS.find(x=>x.id===rv.id)||{}).n:'다른 매체';tick(`[${rn}] ${it.title}`,1);toast(`${rn}에 기사가 실렸다. 아무도 출처를 모른다`);}}}]:[])]);}
// 묵혀 둔 아이템 풀기
function holdMonth(lines){S.items.forEach(it=>{if(it.hold&&it.hold<=S.turn&&!it.holdDone){it.holdDone=1;if(it.excl&&chance(.4)){it.excl=false;lines.push({c:'r',t:`묵혀 둔 「${it.title}」 — 그사이 타사가 먼저 썼다. 단독이 아니게 됐다`});}else lines.push({c:'',t:`묵혀 둔 「${it.title}」 — 이제 써도 된다는 말이 내려왔다`});}});}
// --- 내가 상사일 때: 부서원 기사를 내가 결정한다 ---
const PRESS_T={corp:['{n} 하청 단가 후려치기 의혹','{n} 안전 점검 결과 축소 정황','{n} 고객 정보 관리 부실','{n} 회계 처리 논란','{n} 갑질 내부 고발','{n} 제품 결함 은폐 의혹'],gov:['{n} 예산 집행 부적정 정황','{n} 감사 결과 은폐 의혹','{n} 특정 업체 특혜 논란','{n} 인사 청탁 정황']};
function pressPick(){const L=ENTS.filter(e=>e[4]>0&&(e[2]==='corp'||e[2]==='gov')&&!(S.net&&S.net[e[0]]&&S.net[e[0]].cut>0));if(!L.length)return null;const tot=L.reduce((a,e)=>a+e[4],0);let r=Math.random()*tot;for(const e of L){r-=e[4];if(r<=0)return e;}return L[0];}
function pressMonth(lines){if(!S||S.story||S.phase!=='game')return;holdMonth(lines);atkMonth(lines);orderMonth(lines);
  const boss=S.founder||S.rank>=2&&S.rank<=6;if(!boss)return;S.press=S.press||{n:0};
  // 묵혀 둔 부서원 기사
  const H=(S.press.hold||[]).filter(h=>h.due<=S.turn);if(H.length){S.press.hold=(S.press.hold||[]).filter(h=>h.due>S.turn);const h=H[0];Q.push(()=>pressDecide(h,true));return;}
  const base=(S.simple?.08:.14)+(['econ','local'].includes(OUT().type)?.05:0);if(!chance(base))return;const e=pressPick();if(!e)return;
  const id=e[0],nm=e[1],kind=e[2];const tm=(S.team||[]).length?pick(S.team):null;const who=tm?tm.name:rname();const T=pick(atkTitles(id)).replace('{n}',nm);
  Q.push(()=>pressDecide({id,nm,kind,who,title:T,mem:tm?tm.id:null},false));}
function pressDecide(h,again){const sh=adShareOf(h.id),heavy=sh>=.025,yr=OUT().ad*sh*12;const me=S.founder?'대표':S.rank>=6?'편집국장':S.rank>=4?'국장단':'부장';const tm=(S.team||[]).find(m=>m.id===h.mem);
  const ad=S.founder||S.rank>=5?`광고국장: "${jo(h.nm,'은','는')} 연 ${jo2(adAmt(yr),'을','를')} 내는 곳입니다. 이게 나가면 광고가 끊길 수 있어요."`:`광고국에서 벌써 전화가 왔다. "${jo(h.nm,'은','는')} 우리 큰 광고주예요."`;
  const fx0=(k)=>{if(tm){tm.mor=clamp((tm.mor??60)+k,0,100);}};
  const opts=[
   {label:'그대로 내보낸다',sub:`신뢰↑ · 부서 사기↑ · ${h.nm} 관계↓↓${heavy?' · 광고가 끊길 수 있다':''}`,fn:()=>{fx0(8);valN('ind',4,'광고주 비판 기사를 그대로 냈다');netUp(h.id,-10);try{arcStart(h.id,10,h.title);}catch(e){}tick(`[${OUT().n}] ${h.title}`,1);const t=apply({trust:1.2,fame:.6,...(heavy&&!S.founder?{eval:-.6}:{})});lines0(`${h.who} 기자의 「${h.title}」 그대로 출고`);toast(`기사가 나갔다. ${h.who} 기자가 고개를 숙였다 · ${t}`);}},
   {label:'단신으로 줄인다',sub:'광고주 반발 줄어듦 · 신뢰 조금↓ · 부서 사기 조금↓',fn:()=>{fx0(-3);valN('ind',-1);netUp(h.id,-2);tick(`[${OUT().n}] ${h.title.replace(/ 의혹| 정황| 논란/,'')}`,1);toast(apply({trust:-.3}));}},
   {label:'묵혀 둔다',sub:'결정을 미룬다 · 그사이 기자가 기사를 들고 나갈 수 있다',fn:()=>{fx0(-4);valN('ind',-2,'광고주 기사를 묵혀 두라고 했다');S.press.hold=S.press.hold||[];S.press.hold.push({...h,due:S.turn+R(8,16)});toast('"좀 더 보자." 기사는 서랍으로 들어갔다');}},
   {label:'킬한다',risk:true,sub:`광고 지킴 · ${h.nm} 관계↑ · 신뢰↓ · 부서 사기↓↓ · 새어 나가면 윤리 논란`,fn:()=>{fx0(-12);valN('ind',-6,'부서원의 광고주 비판 기사를 킬했다');netUp(h.id,6);if(S.founder)try{S.co.cash+=OUT().ad*sh*.5;}catch(e){}if(chance(.18*(DF().risk||1)))S.pending.push({type:'ethic',why:`${h.nm} 광고를 의식해 기사를 뺐다는 의혹`,title:h.title,due:S.turn+R(6,20)});toast(apply({trust:-1.2,...(S.founder?{}:{eval:.4})}));log(`${h.nm} 광고를 의식해 「${h.title}」${jp(h.title,'을','를')} 킬`);}}];
  if(again)opts.splice(1,2);
  if((S.founder||S.rank>=3)&&!S.atk&&!((S.atkCd||0)>S.turn))opts.push({label:'이참에 대대적으로 조진다',risk:true,sub:'연속 기획 공세 · 파급력↑↑ · 관계 파탄 · 소송·광고 철회 각오',fn:()=>{fx0(10);atkStart(h.id,h.nm,'press');}});
  if(again&&chance(.25)){const rv=(S.comp||[])[0];const rn=rv?(OUTLETS.find(x=>x.id===rv.id)||{}).n:'다른 매체';tick(`[${rn}] ${h.title}`,1);openModal('기사가 새어 나갔다',`<p class="lede">서랍에 넣어 둔 「${esc(h.title)}」${jp(esc(h.title),'이','가')} ${esc(rn)}에 먼저 실렸다. ${esc(h.who)} 기자는 모르는 일이라고 한다.</p>`,[{label:'어쩔 수 없다',fn:()=>{valN('ind',-2);toast(apply({trust:-2,...(S.founder?{}:{eval:-1})}));}}]);return;}
  openModal(again?'묵혀 둔 기사':S.founder?'대표 결재 · 광고주 기사':'결재 · 광고주 기사',`<p class="lede">${esc(h.who)} 기자가 올린 「${esc(h.title)}」.${again?' 서랍에 넣어 둔 지 몇 달이 지났다. 기자가 다시 묻는다.':''}</p><p>${esc(ad)}</p><p class="hint">이제 결정은 ${me}인 내가 한다. 결정은 부서 분위기와 신뢰, 광고 모두에 남는다.</p>`,opts);}
function lines0(t){try{log(t);}catch(e){}}
// --- 공세: 연속 기획으로 조진다 ---
function atkStart(id,nm,why){S.atk={id,nm,why,n:0,t0:S.turn,pr:0,deal:0};valN('pb',why==='ad'?-6:2,why==='ad'?'광고를 안 주는 곳을 조지기 시작했다':'연속 기획 공세를 시작했다');if(why==='ad')valN('ind',-6);
  log(`${nm} 상대 연속 보도 공세 시작`);tick(`[${OUT().n}] [연속 기획] ${jo2(nm,'을','를')} 파헤친다`,1);toast(`${nm} 연속 기획이 시작됐다. 매주 한 꼭지씩 나간다`);}
function atkWeek(){const A=S.atk;if(!A)return;if(S.turn-A.t0>16){atkEnd('기획이 동력을 잃고 끝났다');return;}A.n++;const T=pick(atkTitles(A.id)).replace('{n}',A.nm);
  const q=40+(S.st.inv+S.st.wri)/5,imp=Math.round((30+A.n*4)*atkK(A.id));const clip={h:`[연속 기획 ${A.n}] ${T}`,o:OUT().n,d:cat1(atkDept(A.id)),q:Math.round(q),imp,excl:true,date:dateShort(),turn:S.turn,views:Math.round(q*imp*(OUT().p+1)*1.2),lead:`${T}. 본지 연속 기획 ${A.n}번째 보도.`,by:S.name,place:atkPlace(A.n),portal:''};S.clips.unshift(clip);if(S.clips.length>60)S.clips.pop();
  A.pr+=imp;netUp(A.id,-6);S.hp=clamp(S.hp-2,0,100);tick(`[${OUT().n}] ${clip.h}`,1);}
function atkMonth(lines){const A=S.atk;if(!A||A.n<3)return;const E=ENT[A.id]||{w:0};const power=(E.w||0)*3000+(E.kind==='gov'?110:80)+(S.net&&S.net[A.id]?Math.max(0,S.net[A.id].rel):0);const roll=A.pr/(A.pr+power)+R(-12,12)/100;
  if(roll>.62){lines.push({c:'g',t:`${A.nm}, 공식 사과와 개선책 발표 — 연속 기획이 이겼다 · ${S.founder?apply({fame:2,trust:1.5}):apply({fame:2,trust:1.5,eval:1.2})}`});ach('scoop');atkEnd(null);return;}
  if(roll>.42&&!A.deal){A.deal=1;Q.push(()=>openModal('뒷문으로 온 제안',`<p class="lede">${esc(A.nm)} 쪽에서 연락이 왔다. "광고를 두 배로 늘리겠습니다. 연속 기획은 이쯤에서 멈춰 주시죠."</p>`,[
     {label:'받는다',risk:true,sub:'회사 매출↑ · 신뢰↓↓ · 새어 나가면 윤리 논란',fn:()=>{try{S.co.cash+=OUT().ad*(E.w||.01)*6;S.co.adB=(S.co.adB||0)+.02;}catch(e){}netUp(A.id,20);valN('ind',-8,'광고를 받고 공세를 멈췄다');valN('pb',-4);if(chance(.3))S.pending.push({type:'ethic',why:`${A.nm} 광고를 받고 연속 보도를 멈췄다는 의혹`,title:`${A.nm} 연속 기획 중단`,due:S.turn+R(6,18)});toast('공세가 조용히 멈췄다. 광고국은 웃는다 · '+apply({trust:-2,...(S.founder?{}:{eval:1})}));atkEnd(null);}},
     {label:'거절하고 계속 쓴다',sub:'신뢰↑ · 독립 쪽으로',fn:()=>{valN('ind',5,'광고 제안을 거절하고 계속 썼다');toast('"그런 제안은 받지 않습니다." · '+apply({trust:1}));}}]));return;}
  if(roll<.3&&A.n>=4){if(chance(.5)){S.pending.push({type:'suit',ent:A.id,due:S.turn+R(1,3),title:`${A.nm} 연속 기획`});lines.push({c:'r',t:`${jo2(A.nm,'이','가')} 연속 기획을 명예훼손으로 고소하겠다고 밝혔다`});}else{netUp(A.id,-15);try{arcStart(A.id,20,`${A.nm} 연속 기획`);}catch(e){}lines.push({c:'r',t:`${jo2(A.nm,'이','가')} 광고·협찬을 전면 중단했다. 회사 매출이 흔들린다`});}atkEnd(null);}}
function atkEnd(why){if(why)log(why);S.atk=null;S.atkCd=S.turn+24;}
function atkAct(){const A=S.atk;if(A){openModal('공세 보도',`<p class="lede">${esc(A.nm)} 연속 기획 ${A.n}회째 진행 중.</p>`,[
   {label:'광고 압박을 넣는다',risk:true,sub:'"광고를 주면 멈추겠다" · 돈↑ · 신뢰↓↓ · 공갈 논란 위험',fn:()=>{valN('ind',-10,'기사를 무기로 광고를 압박했다');valN('pb',-6);const p=clamp(.3+A.pr/300,.3,.8);if(chance(p)){try{S.co.cash+=OUT().ad*((ENT[A.id]||{}).w||.01)*5;}catch(e){}netUp(A.id,10);if(chance(.35))S.pending.push({type:'ethic',why:`기사를 무기로 ${A.nm}에 광고를 요구했다는 의혹`,title:`${A.nm} 광고 압박`,due:S.turn+R(4,14)});toast(`${jo2(A.nm,'이','가')} 광고 계약서를 보내왔다. 공세는 멈춘다 · `+apply({trust:-3,...(S.founder?{}:{eval:1})}));atkEnd(null);}else{netUp(A.id,-10);S.pending.push({type:'ethic',why:`${jo2(A.nm,'이','가')} "광고를 요구받았다"고 폭로했다`,title:`${A.nm} 광고 압박`,due:S.turn+R(1,4)});toast(`${jo2(A.nm,'이','가')} 녹취를 공개하겠다고 맞섰다`);}}},
   {label:'공세를 멈춘다',sub:'관계 회복 시작',fn:()=>{netUp(A.id,5);atkEnd('공세를 멈췄다');toast('연속 기획을 접었다');}},{label:'그대로 간다',cls:'ghost'}]);return;}
  if((S.atkCd||0)>S.turn){openModal('공세 보도',`<p class="lede">지난 공세의 뒷수습이 끝나지 않았다. 다음 공세는 ${moTxt(S.atkCd-S.turn)} 뒤에 가능하다.</p>`);return;}
  const L=atkTargets();
  openModal('공세 보도 — 누구를 파헤칠까',`<p class="lede">연속 기획으로 한 곳을 몇 주 동안 집중적으로 판다. 이기면 판이 바뀌고, 지면 소송과 광고 철회가 온다.</p>`,L.map(e=>({label:e[1],sub:atkSub(e),rec:e===L.slice().sort((x,y)=>atkWin(y)*x._r[0]-atkWin(x)*y._r[0]).find(x=>x._r[0]>=2)&&atkWin(e)>=.55,risk:atkWin(e)<.45,fn:()=>{
     openModal('왜 조지나',`<p class="lede">${jo2(esc(e[1]),'을','를')} 파헤친다. 이유가 무엇인가?</p>`,[{label:'공익 — 드러나야 할 문제가 있다',sub:'공익 쪽으로',fn:()=>{spend(1,5);setCd('gongse');atkStart(e[0],e[1],'pub');}},{label:'광고를 안 주니 버릇을 고친다',risk:true,sub:'흥행·타협 쪽으로 · 광고 압박이 쉬워진다',fn:()=>{spend(1,5);setCd('gongse');atkStart(e[0],e[1],'ad');S.atk.pr+=20;}},{label:'← 다시 고른다',cls:'ghost',fn:()=>{atkAct();return false;}}]);return false;}})).concat([{label:'나중에',cls:'ghost'}]));}
// --- AI 윗선의 공세 지시 (내가 평기자~부장일 때) ---
function orderMonth(lines){if(S.founder||S.rank<1||S.rank>3||S.order||!chance(S.simple?.03:.05))return;const e=pressPick();if(!e)return;const bs=colBy('boss');const why=chance(.4)?'ad':'pub';
  const it=spItem(S.dept,[pick(atkTitles(e[0])).replace('{n}',e[1]),52,e[1],'d:*내부 문건|w:전 직원 "위에서 시켰다"|n:관련 금액 {m}억 원|w:'+e[1]+' "사실무근"'],{excl:true,pre:1,src:'윗선 지시'});it.ent=e[0];it.order=1;
  S.order={iid:it.id,due:S.turn+8,nm:e[1],why};Q.push(()=>openModal('윗선의 지시',`<p class="lede">${jo2(esc(bs?bs.name+' '+colRole(bs):'국장'),'이','가')} 불렀다. "${esc(e[1])} 좀 파 봐. ${why==='ad'?'요즘 광고 협조가 영 시원찮아.':'냄새가 나. 제대로 털어 봐.'}"</p><p>자료 뭉치를 건넸다 → 「${esc(it.title)}」</p><p class="hint">두 달 안에 쓰면 윗선이 좋아한다. ${why==='ad'?'하지만 이건 광고를 노린 공세다.':''}</p>`,[
   {label:'맡는다',sub:'아이템 확보 · 두 달 안에 출고하면 평가↑',fn:()=>{S.items.push(it);if(why==='ad')valN('ind',-3,'광고 압박용 기사 지시를 맡았다');toast('자료를 챙겼다');}},
   {label:'거절한다',sub:why==='ad'?'독립 쪽으로 · 평가↓ · 윗선 관계↓':'평가↓ · 윗선 관계↓',fn:()=>{S.order=null;if(bs)relUp(bs,-6,'지시 거절');valN('ind',why==='ad'?6:1,why==='ad'?'광고 압박용 기사 지시를 거절했다':'윗선 지시를 거절했다');toast(apply({eval:-1.5}));}}]));}
function orderCheck(it){const O=S.order;if(!O)return;if(it.id===O.iid){S.order=null;const bs=colBy('boss');if(bs)relUp(bs,5,'지시한 기사를 냈다');toast(`윗선이 만족했다 · `+apply({eval:2}));}}
function orderMonthEnd(){const O=S.order;if(O&&S.turn>O.due){S.order=null;S.items=S.items.filter(x=>x.id!==O.iid);const bs=colBy('boss');if(bs)relUp(bs,-4,'지시한 기사를 안 냈다');apply({eval:-1});}}

// ===== 1.1 미니게임 (설정에서 끌 수 있다. 끄면 일반 선택으로 처리된다) =====
const MGX='<span class="tfig" style="display:none"></span>';
function mgTimed(){return ddMode()==='on';}
function mgT(s){return Math.round(s*(S.simple?1.4:1));}
function mgRun(sec,tick,end){const tk=mTok;let left=sec;const iv=setInterval(()=>{if(mTok!==tk){clearInterval(iv);return;}left--;try{tick&&tick(left);}catch(e){}if(left<=0){clearInterval(iv);end();}},1000);return{stop:()=>clearInterval(iv)};}
function mgOpen(title,html,choices){MSTACK=[];openModal(title,MGX+html,choices);}
function mgFin(title,html){Q.unshift(()=>openModal(title,html));closeModal();}
function mgBar(id,sec){return `<div class="ddt"><b id="${id}T">${sec}</b>초<div class="ddbar"><i id="${id}B" style="width:100%"></i></div></div>`;}
function mgBarSet(id,left,sec){const e=document.getElementById(id+'T'),b=document.getElementById(id+'B');if(e)e.textContent=Math.max(0,left);if(b)b.style.width=Math.max(0,left/sec*100)+'%';}
function mgPay(sc){const fx={};if(S.founder){fx.fame=sc*1.1;fx.trust=sc*.7;try{S.co.q=clamp(S.co.q+sc*1.4,10,100);}catch(e){}}else{fx.eval=sc*1.6;fx.fame=sc>0?sc:sc*.5;}spmV(sc*6);return apply(fx);}
function mgRival(){const L=(S.comp||[]).map(c=>({c,o:OUTLETS.find(x=>x.id===c.id)})).filter(x=>x.o);if(!L.length)return{n:'경쟁사',q:55,st:'scoop',c:null};const x=pick(L.sort((a,b)=>b.c.q-a.c.q).slice(0,3));return{n:x.o.n,q:x.c.q||55,st:x.c.strat,c:x.c};}
function mgRivalHit(rv,win){if(rv&&rv.c)rv.c.buzz=(rv.c.buzz||0)+(win?-1:1);}
function mgBind(sel,fn){document.querySelectorAll('#mb '+sel).forEach(b=>b.onclick=()=>fn(b));}

// 통신사 — 속보 송고 경쟁
const WIRE_EV=[{t:'{city} 아파트 화재',ok:['소방본부 "주민 {n}명 대피"','현장 확인: 고층부에서 불길','경찰 "인명 피해 집계 중"','소방 대응 2단계 발령'],no:['커뮤니티 "사망자 다수" 주장','SNS 영상 속 "방화 추정" 글','미확인 목격담 "폭발음 세 번"']},
 {t:'고속도로 다중 추돌',ok:['도로공사 "차량 {n}대 연쇄 추돌"','현장 확인: 상행선 전면 통제','경찰 "부상자 병원 이송"'],no:['운전자 커뮤니티 "졸음운전 버스" 주장','"사망자 10명 넘어" 미확인 글','SNS "블랙아이스 때문" 추정']},
 {t:'지하철 운행 중단',ok:['운영사 "신호 장애로 운행 중단"','현장 확인: 승객 역사 밖 대피','운영사 "복구까지 1시간"'],no:['"테러 의심" SNS 글','"탈선 사고" 미확인 제보','커뮤니티 "열차 화재" 주장']},
 {t:'{corp} 공장 폭발',ok:['소방 "공장 내부 폭발, 진화 중"','회사 "직원 {n}명 대피 완료"','현장 확인: 검은 연기 치솟아'],no:['"유독가스 누출" SNS 글','미확인 "사망 3명" 제보','커뮤니티 "작년에도 사고" 주장']},
 {t:'{city} 규모 4.1 지진',ok:['기상청 "규모 4.1 지진 발생"','기상청 "진앙 {city} 남쪽 {n}km"','소방 "피해 신고 접수 중"'],no:['"여진이 더 크게 온다" SNS 글','"건물 붕괴" 미확인 영상','커뮤니티 "원전 이상" 주장']}];
function mgWire(){const f=filler(vars());const E=pick(WIRE_EV);const L=shuffle(E.ok.slice(0,3).map(t=>({t:f(t),ok:1})).concat(shuffle(E.no.slice()).slice(0,S.simple?2:3).map(t=>({t:f(t),ok:0}))));
  const rv=mgRival();const rT=Math.round(clamp(17-(rv.q-50)/6+R(-2,2),9,20)*(S.simple?1.4:1));const timed=mgTimed(),T=mgT(24);const t0=Date.now();let done=false,clicks=0,run=null;const sel=new Set();
  const send=()=>{if(done)return;done=true;run&&run.stop();const el=timed?Math.round((Date.now()-t0)/1000):4+clicks*2;const P=[...sel].map(i=>L[i]);const bad=P.filter(x=>!x.ok).length,good=P.filter(x=>x.ok).length;
    let sc,txt,clip='';if(!good){sc=-.3;txt='알맹이 없는 1보였다. 데스크가 바로 내렸다.';}
    else if(bad){sc=-.8;valN('sp',3,'확인 안 된 줄을 1보에 섞었다');txt='확인 안 된 내용이 1보에 섞였다. 받아 쓴 매체 수십 곳이 정정했다.';apply({trust:-2});}
    else{const first=el<rT;sc=(first?.55:.1)+good*.12;txt=first?`${el}초 만에 송고. ${rv.n}보다 ${rT-el}초 빨랐다. 포털 속보 창 맨 위에 우리 이름이 떴다.`:`${el}초. ${jo2(rv.n,'이','가')} ${el-rT}초 먼저 쳤다. 2보로 밀렸다.`;clip=quickClip(`[1보] ${f(E.t)}`,50+good*6+(first?8:0),R(26,40));const K=km();K.pick=(K.pick||0)+(first?R(40,120):R(5,20));if(good===3)valN('sp',-1);}
    mgRivalHit(rv,sc>.3);const fx=mgPay(sc);mgFin('송고 결과',`<p class="lede">${txt}</p>${fxLine([clip,fx].filter(Boolean).join(' · '))}`);};
  const lose=()=>{if(done)return;done=true;const fx=mgPay(-.3);mgFin('송고 결과',`<p class="lede">시간이 다 갔다. ${esc(rv.n)} 1보가 전 매체에 깔렸다.</p>${fxLine(fx)}`);};
  mgOpen('속보 송고 · '+f(E.t),`<p class="lede">단말기에 속보 줄이 쏟아진다. 확인된 것만 골라 1보를 친다. ${esc(rv.n)}도 같은 걸 보고 있다.</p>${timed?mgBar('wf',T):'<p class="hint">타이머 없이 — 고른 줄이 많을수록 송고가 늦어진다</p>'}<div class="mgl">${L.map((x,i)=>`<button type="button" class="mgi" data-i="${i}">${esc(x.t)}</button>`).join('')}</div>`,[{label:'1보 송고',sub:'고른 줄로 바로 송고',fn:()=>{send();return false;}},{label:'그만둔다',cls:'ghost',sub:'행동력은 돌아오지 않는다',fn:()=>{done=true;run&&run.stop();}}]);
  mgBind('.mgi',b=>{const i=+b.dataset.i;clicks++;if(sel.has(i)){sel.delete(i);b.classList.remove('on');}else{sel.add(i);b.classList.add('on');}});
  if(timed)run=mgRun(T,l=>mgBarSet('wf',l,T),lose);}

// 지상파·종편 — 메인뉴스 큐시트
const TV_POOL=[['{city} 아파트 화재 대피 소동','h',4],['국회 예산안 처리 무산','h',3],['{corp} 대규모 구조조정','h',4],['물가 넉 달째 상승','h',3],['{team} 극적 역전승','s',2],['벚꽃 개화 앞당겨져','s',2],['{star} 깜짝 결혼 발표','s',3],['전세사기 피해 확산','h',4],['기습 폭우 피해','h',5],['대통령실 개편안 발표','h',3],['반려견 놀이터 논란','s',1],['주말 나들이 인파','s',1]];
function mgTV(){const f=filler(vars());const isJp=OUT().type==='jp';const P=shuffle(TV_POOL.slice()).slice(0,6).map(x=>({t:f(x[0]),k:x[1],p:clamp(x[2]+R(0,1),1,5),d:x[1]==='h'?2+R(0,3)*.5:1.5+R(0,2)*.5}));if(isJp)P.push({t:'[시사 토크] 정치권 공방',k:'t',p:4,d:3.5});
  const B=S.simple?11:10;const ord=[];const rv=mgRival();
  const draw=()=>{const used=ord.reduce((a,i)=>a+P[i].d,0);const box=document.getElementById('cueL');if(box)box.innerHTML=ord.length?ord.map((i,n)=>`<div>${n+1}. ${esc(P[i].t)} <small>${P[i].d}분</small></div>`).join(''):'<small>위에서 순서대로 누른다. 첫 번째가 톱이다</small>';const u=document.getElementById('cueU');if(u)u.textContent=`${used}/${B}분`;document.querySelectorAll('#mb .mgi').forEach(b=>{const i=+b.dataset.i;b.classList.toggle('on',ord.includes(i));});};
  const air=()=>{const W=[1.6,1.25,1,.85,.7,.6];let used=0,rate=0,cut=0;ord.forEach((i,n)=>{if(used+P[i].d>B+.01){cut++;return;}used+=P[i].d;rate+=P[i].p*(W[n]||.5);});
    const top=P[ord[0]];const bigH=Math.max(...P.filter(x=>x.k==='h').map(x=>x.p));let note='';
    if(top&&top.k!=='h'&&bigH>=4){rate-=2.2;note='큰 뉴스를 두고 가벼운 꼭지를 톱으로 올렸다. 시청자 항의 전화가 이어졌다.';}else if(top&&top.k==='h'&&top.p===bigH){rate+=1;note='오늘 가장 큰 뉴스로 문을 열었다.';}
    if(cut){rate-=1.2*cut;note+=` 시간이 넘쳐 뒷꼭지 ${cut}개가 잘렸다.`;}if(ord.some(i=>P[i].k==='t'))apply({trust:-.6});
    const rr=14+(rv.q-50)/6+R(-2,2);const sc=clamp((rate-rr)/6,-1,1);const ours=(rate*.55).toFixed(1),theirs=(rr*.55).toFixed(1);mgRivalHit(rv,sc>0);
    const K=km();if(sc>0)K.ft=(K.ft||0)+.5;const fx=mgPay(sc);mgFin('방송 결과',`<p class="lede">메인뉴스 시청률 ${ours}% · ${esc(rv.n)} ${theirs}%</p><p>${esc(note.trim()||'무난한 편성이었다.')}</p>${fxLine(fx)}`);};
  mgOpen('메인뉴스 큐시트',`<p class="lede">오늘 메인뉴스 순서를 짠다. 첫 꼭지가 톱이다. 시간은 ${B}분.</p><div class="mgl">${P.map((x,i)=>`<button type="button" class="mgi" data-i="${i}">${esc(x.t)}<small>${x.k==='h'?'경성':'연성'} 뉴스 · 화제성 ${'●'.repeat(x.p)}${'○'.repeat(5-x.p)} · ${x.d}분${x.k==='t'?' · 시청률은 나오지만 신뢰↓':''}</small></button>`).join('')}</div><div class="hb-prev"><small>큐시트 <span id="cueU">0/${B}분</span></small><div id="cueL"></div></div>`,[{label:'이대로 방송한다',fn:()=>{if(!ord.length){toast('꼭지를 하나 이상 고르자');return false;}air();return false;}},{label:'다시 짠다',cls:'ghost',fn:()=>{ord.length=0;draw();return false;}},{label:'그만둔다',cls:'ghost'}]);
  mgBind('.mgi',b=>{const i=+b.dataset.i;const k=ord.indexOf(i);if(k>=0)ord.splice(k,1);else if(ord.length<6)ord.push(i);draw();});draw();}

// 보도전문채널 — 생중계 진행
const CH_R=[['앵커: "현장 연결합니다. 지금 상황 어떻습니까?"',['현장 확인: 소방차 여러 대가 진입했다','"인명 피해가 크다는 말이 돈다"','"잠시 정리해서 다시 전하겠습니다"']],['앵커: "원인은 나왔습니까?"',['당국 "원인은 조사 중"이라고만 밝혔다','"누전이라는 얘기가 현장에 돈다"','"화면 먼저 보시겠습니다"']],['앵커: "피해 규모는요?"',['소방 집계 "대피 인원 확인 중"','"수십 명이 다쳤다는 주민 말이 있다"','"정확한 숫자는 다음 연결에서"']],['앵커: "주민들 반응은 어떻습니까?"',['주민 인터뷰: "새벽에 연기 냄새가 났다"','"부실 공사 때문이라는 주민 주장이 많다"','"잠시 후 다시 연결하겠습니다"']],['앵커: "앞으로 어떻게 됩니까?"',['당국 "오후 3시 공식 브리핑 예정"','"책임자 문책이 있을 거라는 관측"','"현장 상황 계속 지켜보겠습니다"']]];
function mgCH(it,where){const timed=mgTimed(),T=mgT(7);let r=0,score=0,bad=0,vamp=0,run=null,done=false;const rv=mgRival();
  const end=()=>{if(done)return;done=true;run&&run.stop();const K=km();if(bad){K.bad=(K.bad||0)+1;valN('sp',2,'생방송에서 확인 안 된 말을 했다');}else K.live=(K.live||0)+1;const sc=clamp(score/8-(bad?.6:0),-1,1);mgRivalHit(rv,sc>.2);
    const fx=mgPay(sc);mgFin('생중계 끝',`<p class="lede">${bad?'확인 안 된 말이 전파를 탔다. 자막으로 정정했다.':score>=6?'흔들림 없이 끝까지 끌고 갔다. 보도국장이 엄지를 들었다.':'무난하게 넘겼다.'}</p>${fxLine(fx)}`);};
  const step=()=>{run&&run.stop();if(done)return;if(r>=CH_R.length){end();return;}const R0=CH_R[r];const ops=shuffle([0,1,2]);
    const q=document.getElementById('chQ');if(!q)return;q.textContent=R0[0];document.getElementById('chO').innerHTML=ops.map(i=>`<button type="button" class="mgi" data-c="${i}">${esc(R0[1][i])}</button>`).join('');document.getElementById('chN').textContent=`${r+1}/${CH_R.length}`;
    mgBind('.mgi[data-c]',b=>{if(done)return;const c=+b.dataset.c;if(c===0){score+=2;vamp=0;}else if(c===1){if(chance(.45))score+=3;else{bad++;score-=3;}vamp=0;}else{vamp++;score+=vamp>=2?-1:.5;}r++;step();});
    if(timed){mgBarSet('ch',T,T);run=mgRun(T,l=>mgBarSet('ch',l,T),()=>{score-=3;toast('말이 끊겼다. 방송 사고 직전');r++;step();});}};
  mgOpen('생중계 · '+where,`<p class="lede">카메라 빨간불이 켜졌다. 몇 초 안에 답해야 한다. 말이 끊기면 방송 사고다.</p>${timed?mgBar('ch',T):''}<p class="hint">질문 <span id="chN"></span></p><p id="chQ" style="font-weight:700"></p><div class="mgl" id="chO"></div>`,[{label:'연결을 끊는다',cls:'ghost',sub:'행동력은 돌아오지 않는다',fn:()=>{done=true;run&&run.stop();}}]);
  step();}

// 종합일간지 — 경쟁지 가판 전쟁
function mgDaily(){const rvs=[mgRival(),mgRival()];const sec=({soc:'사회면',pol:'정치면',eco:'경제면',cul:'문화면',spo:'스포츠면',int:'국제면',loc:'지역면',ent:'연예면'})[cat1(S.dept)]||'사회면';const big=['1면 톱','1면',sec+' 톱',sec];
  const H=[0,1,2].map(i=>{const rv=rvs[i%2];const strong=rv.st==='scoop'||rv.st==='quality';const have=chance(strong?.35:.55);const rum=!have&&chance(rv.st==='click'?.45:.2);const it=makeItem(S.dept,{excl:false,pre:1});return{rv,it,have,rum,sz:pick(big),src:rum?'익명 관계자발':'문건·당국 확인'};});
  let tok=2;const pick2=new Set();
  const draw=()=>{document.querySelectorAll('#mb .mgi').forEach(b=>{const i=+b.dataset.i;b.classList.toggle('on',pick2.has(i));});const t=document.getElementById('gpT');if(t)t.textContent=tok-pick2.size;};
  mgOpen('경쟁지 가판 전쟁',`<p class="lede">밤 9시, 경쟁지 가판이 들어왔다. 다음 판까지 두 시간. 따라붙을 기사를 고른다 (남은 기자 <b id="gpT">2</b>명).</p><div class="mgl">${H.map((h,i)=>`<button type="button" class="mgi" data-i="${i}" ${h.have?'disabled':''}>[${esc(h.rv.n)} · ${h.sz}] ${esc(h.it.title)}<small>${h.have?'우리도 있다':'우리에게 없다 · 출처: '+h.src}</small></button>`).join('')}</div>`,[
   {label:'다음 판 마감',fn:()=>{let got=0,miss=0,waste=0,lines=[];H.forEach((h,i)=>{if(h.have)return;const w=/1면/.test(h.sz)?1:/톱/.test(h.sz)?.7:.5;if(pick2.has(i)){if(h.rum){waste++;lines.push(`「${yamaShort(h.it.title,20)}」 — 확인해 보니 뜬소문이었다. ${jo2(h.rv.n,'이','가')} 다음 날 정정했다.`);mgRivalHit(h.rv,true);}else if(chance(.5+S.st.spd/300+S.st.net/400)){got+=w;lines.push(`「${yamaShort(h.it.title,20)}」 — 다음 판에 따라붙었다.`);}else{miss+=w;lines.push(`「${yamaShort(h.it.title,20)}」 — 끝내 못 따라잡았다.`);}}else if(!h.rum){miss+=w;lines.push(`「${yamaShort(h.it.title,20)}」 — 물먹었다.`);mgRivalHit(h.rv,false);}else lines.push(`「${yamaShort(h.it.title,20)}」 — 안 쫓길 잘했다. 뜬소문이었다.`);});
     S.hp=clamp(S.hp-pick2.size*3,0,100);const sc=clamp(got*.5-miss*.45-waste*.2+.2,-1,1);const K=km();K.sc=(K.sc||0)+Math.max(0,got);const fx=mgPay(sc);mgFin('다음 날 아침 지면',`<ul class="feed">${lines.map(l=>`<li>${esc(l)}</li>`).join('')}</ul>${fxLine(fx)}`);return false;}},
   {label:'그만둔다',cls:'ghost'}]);
  mgBind('.mgi',b=>{const i=+b.dataset.i;if(pick2.has(i))pick2.delete(i);else if(pick2.size<tok)pick2.add(i);draw();});}

// 경제지 — 장 마감 공시 해독
const ECON_DUD=['자기주식 취득 결정 (자사주 {n}만 주)','현금 배당 결정 (주당 {n}0원)','단일판매·공급계약 체결 (매출액 대비 {n}%)','기업설명회(IR) 개최 안내','정기 주주총회 소집 결의','타법인 주식 취득 — 해외 법인 설립','특허권 취득 (이차전지 소재)','최대주주 등 소유주식 변동 신고 (0.1%)'];
function mgEcon(){const f=filler(vars());const b=pick(ECON_BOMB);const corps=shuffle(CORPS.slice()).slice(0,5);const L=shuffle([{t:b[0],bomb:1,c:corps[0]}].concat(shuffle(ECON_DUD.slice()).slice(0,4).map((t,i)=>({t:f(t),c:corps[i+1]}))));
  const timed=mgTimed(),T=mgT(30);let done=false,run=null;
  const fin=(i)=>{if(done)return;done=true;run&&run.stop();const x=i>=0?L[i]:null;let fx,txt;
    if(x&&x.bomb){const it=spItem(S.dept,[b[1],b[2],x.c,`d:*공시 원문|n:관련 금액|w:증권사 애널리스트 "시장이 놓쳤다"|w:${x.c} "정상적인 절차"`],{excl:true,pre:1,v:{corp:x.c},via:'공시',src:'공시 해독'});S.items.push(it);fx=mgPay(.6);txt=`${x.c} 공시에 악재가 숨어 있었다. 장 마감 뒤 시장이 술렁인다 → 「${it.title}」`;}
    else if(x){fx=mgPay(-.15);txt=`${x.c} 공시는 평범했다. 진짜 악재는 다른 데 있었다.`;}else{fx=mgPay(-.2);txt='장이 닫혔다. 다음 날 아침 타사가 악재를 먼저 썼다.';}
    mgFin('공시 해독 결과',`<p class="lede">${esc(txt)}</p>${fxLine(fx)}`);};
  mgOpen('장 마감 10분 전 · 공시 해독',`<p class="lede">방금 올라온 공시 다섯 줄. 이 가운데 하나에 시장이 아직 모르는 악재가 숨어 있다.</p>${timed?mgBar('ec',T):''}<div class="mgl">${L.map((x,i)=>`<button type="button" class="mgi" data-i="${i}">[${esc(x.c)}] ${esc(x.t)}</button>`).join('')}</div>`,[{label:'그만둔다',cls:'ghost'}]);
  mgBind('.mgi',b=>fin(+b.dataset.i));if(timed)run=mgRun(T,l=>mgBarSet('ec',l,T),()=>fin(-1));}

// 영자지 — 외교 발언 번역 감수
const ENG_Q=[['유감스럽게 생각한다',['expressed regret','apologized','felt sorry for'],'유감은 사과가 아니다'],['검토하겠다',['will review','will approve','has rejected'],'검토는 승인이 아니다'],['예의 주시하고 있다',['is closely monitoring','is deeply concerned','has condemned'],'주시는 우려나 규탄과 다르다'],['강력히 규탄한다',['strongly condemns','is disappointed by','regrets'],'규탄의 강도를 낮추면 안 된다'],['사실무근이다',['is groundless','is under investigation','was partly true'],'부인과 조사 중은 다르다'],['합의에 근접했다',['are close to a deal','have reached a deal','have walked away'],'근접과 타결은 다르다'],['신중하게 접근하겠다',['will take a cautious approach','will not proceed','will move quickly'],'신중은 중단이 아니다'],['일정 부분 책임을 느낀다',['feels partly responsible','admitted full responsibility','denied responsibility'],'부분 책임과 전면 인정은 다르다']];
function mgEng(){const Qs=shuffle(ENG_Q.slice()).slice(0,3);let r=0,ok=0,run=null,done=false;const timed=mgTimed(),T=mgT(15);const who=pick(['외교부 대변인','대통령실 관계자','국방부 장관','통상교섭본부장']);
  const end=()=>{if(done)return;done=true;run&&run.stop();gain('lng',.4+ok*.2);const sc=ok===3?.7:ok===2?.15:-.6;if(ok===3){const K=km();K.cite=(K.cite||0)+1;}const fx=mgPay(sc);
    mgFin('번역 감수 결과',`<p class="lede">${ok===3?'세 문장 모두 정확했다. 외신들이 우리 영문 기사를 그대로 인용했다.':ok===2?'한 문장이 미묘하게 틀렸다. 다행히 큰 문제는 없었다.':'오역이 나갔다. 해당 대사관이 "발언이 왜곡됐다"고 항의했다.'}</p>${fxLine(fx)}`);};
  const step=()=>{run&&run.stop();if(done)return;if(r>=Qs.length){end();return;}const q=Qs[r];const ops=shuffle([0,1,2]);const el=document.getElementById('enQ');if(!el)return;
    el.innerHTML=`${esc(who)}: "…${esc(q[0])}."`;document.getElementById('enN').textContent=`${r+1}/3`;document.getElementById('enO').innerHTML=ops.map(i=>`<button type="button" class="mgi" data-c="${i}">${esc(q[1][i])}</button>`).join('');
    mgBind('.mgi[data-c]',b=>{if(done)return;const c=+b.dataset.c;if(c===0)ok++;else toast(`틀렸다 — ${q[2]}`);r++;step();});
    if(timed){mgBarSet('en',T,T);run=mgRun(T,l=>mgBarSet('en',l,T),()=>{toast(`시간이 다 갔다 — ${q[2]}`);r++;step();});}};
  mgOpen('번역 감수',`<p class="lede">마감 직전 영문 기사. 발언 세 개의 번역을 고른다. 한 단어가 외교 문제가 된다.</p>${timed?mgBar('en',T):''}<p class="hint">문장 <span id="enN"></span></p><p id="enQ" style="font-weight:700"></p><div class="mgl" id="enO"></div>`,[{label:'그만둔다',cls:'ghost',fn:()=>{done=true;run&&run.stop();}}]);
  step();}

// 인터넷 — 실시간 검색어 타기
function mgOnline(){const K0=shuffle(ONL_KW.slice()).slice(0,5).map(k=>({t:k[0],real:k[1],h:R(10,40),dir:R(-1,2),peak:R(5,16),sat:0,shot:0}));const rv=mgRival();const fast=rv.st==='click'?1.6:1;
  const timed=mgTimed(),T=mgT(20);let t=0,shots=2,tot=0,run=null,done=false;const res=[];
  const tickW=()=>{t++;K0.forEach(k=>{const tgt=t<k.peak?k.h+R(2,9):k.h-R(3,10);k.h=clamp(tgt+R(-3,3),0,100);if(k.h>45&&chance(.35*fast))k.sat++;});draw();};
  const draw=()=>{const box=document.getElementById('olK');if(!box)return;box.innerHTML=K0.map((k,i)=>`<div class="mgk"><span style="flex:0 0 150px">${esc(k.t)}</span><div class="mgbar"><i style="width:${k.h}%"></i></div><span class="mgs">${Math.round(k.h)}</span><button type="button" class="hb-b" data-i="${i}" ${k.shot||!shots?'disabled':''}>출고</button></div><small style="display:block;margin:-2px 0 4px 6px;color:var(--mute)">타사 기사 ${k.sat}건</small>`).join('');const s=document.getElementById('olS');if(s)s.textContent=shots;
    mgBind('.hb-b[data-i]',b=>{const k=K0[+b.dataset.i];if(k.shot||!shots)return;k.shot=1;shots--;const pay=Math.round(k.h*(1-Math.min(.8,k.sat/8)));tot+=pay;res.push([k,pay]);draw();if(!shots)fin();});};
  const fin=()=>{if(done)return;done=true;run&&run.stop();let txt=[];let trustHit=0;res.forEach(([k,p])=>{const v=Math.round(p*(OUT().p+1)*R(250,400));const K=km();K.pv=(K.pv||0)+v;txt.push(`「${k.t}」 조회수 ${v.toLocaleString('ko-KR')}${k.real?'':' — 알고 보니 루머였다. 정정 기사를 냈다'}`);if(!k.real)trustHit++;});
    if(trustHit){apply({trust:-1.5*trustHit});valN('sp',2*trustHit,'루머 키워드를 받아 썼다');}const sc=clamp((tot-50)/70,-1,1)-(trustHit*.3);mgRivalHit(rv,sc>0);const fx=mgPay(clamp(sc,-1,1));
    mgFin('실시간 검색어 결과',`<ul class="feed">${txt.map(x=>`<li>${esc(x)}</li>`).join('')||'<li>아무것도 내지 못했다</li>'}</ul>${fxLine(fx)}`);};
  mgOpen('실시간 검색어 타기',`<p class="lede">검색어가 오르내린다. 정점에서 출고하면 조회수가 터진다. 타사 기사가 쌓일수록 몫은 줄어든다. 출고는 <b id="olS">2</b>번.</p>${timed?mgBar('ol',T):''}<div id="olK"></div><p class="hint">루머가 섞여 있다. 출처가 불분명한 키워드는 조심하자.</p>`,timed?[{label:'그만둔다',cls:'ghost',fn:()=>{done=true;run&&run.stop();}}]:[{label:'시간을 넘긴다',sub:'2초 뒤로',fn:()=>{tickW();tickW();if(t>=20)fin();return false;}},{label:'그만둔다',cls:'ghost'}]);
  draw();if(timed)run=mgRun(T,l=>{mgBarSet('ol',l,T);tickW();},fin);}

// 주간지 — 커버 회의 설득
const WK_ED=[['sales','요즘 판매 부수 그래프만 본다','광고국장과 점심을 자주 먹는다'],['impact','작년 기자상 받은 기획 얘기를 아직도 한다','"세상이 바뀌는 기사"가 입버릇이다'],['safe','지난달 소송에 시달려 예민하다','법무팀 메일을 출력해 들고 다닌다'],['fresh','"남들 다 쓴 건 싫다"고 한다','타사 표지를 매주 오려 모은다']];
const WK_ARG={sales:'포털 검색량이 이번 주 1위입니다',impact:'국회가 움직일 사안입니다',safe:'문서 세 건으로 교차 확인했고 반론도 받았습니다',fresh:'아무도 모르는 각도입니다'};
function mgWeekly(it,go){const eds=shuffle(WK_ED.slice()).slice(0,3).map(e=>({k:e[0],n:rname(),hint:pick([e[1],e[2]]),pick:null}));
  const body=`<p class="lede">「${esc(it.title)}」${jp(esc(it.title),'을','를')} 이번 호 커버로 밀어야 한다. 편집위원 세 명 가운데 둘을 설득하면 된다. 사람마다 듣고 싶은 말이 다르다.</p>${eds.map((e,i)=>`<div class="hb-sec"><b>${esc(e.n)} 위원</b> — ${esc(e.hint)}</div><div class="hb-o g2">${Object.keys(WK_ARG).map(k=>`<button type="button" class="hb-b" data-e="${i}" data-k="${k}">${esc(WK_ARG[k])}</button>`).join('')}</div>`).join('')}`;
  mgOpen('커버 회의',body,[{label:'표결에 부친다',fn:()=>{if(eds.some(e=>!e.pick)){toast('세 위원 모두에게 할 말을 고르자');return false;}let yes=eds.filter(e=>e.pick===e.k).length;
     const safeOK=it.facts.filter(fOK).length>=3;eds.forEach(e=>{if(e.pick==='safe'&&!safeOK&&e.k==='safe')yes--;});const ok=yes>=2;mgPay(ok?.4:-.2);Q.unshift(()=>openModal('표결 결과',`<p class="lede">찬성 ${Math.max(0,yes)} · 반대 ${3-Math.max(0,yes)}. ${ok?'커버로 확정됐다.':'커버에서 밀렸다.'}</p>${eds.map(e=>`<p class="hint">${esc(e.n)} 위원 — ${e.pick===e.k?'고개를 끄덕였다':'시큰둥했다'}</p>`).join('')}`,[{label:'확인',fn:()=>{go(ok);}}]));closeModal();return false;}},{label:'그만둔다',cls:'ghost'}]);
  mgBind('.hb-b[data-e]',b=>{const e=eds[+b.dataset.e];e.pick=b.dataset.k;document.querySelectorAll(`#mb .hb-b[data-e="${b.dataset.e}"]`).forEach(x=>x.classList.toggle('on',x===b));});}

// 교육저널 — 학부모 단톡방 팩트체크
const EDU_R=[['내일 폭설로 {city} 전 학교 휴업','교육청 공지 링크','"아는 엄마가 그러는데"'],['수능 시험장 일부가 바뀐다','교육부 보도자료 캡처','출처 없는 이미지 한 장'],['내년부터 고교 내신 절대평가 전면 도입','국가교육위원회 회의록','"학원 원장님 말로는"'],['학교 급식 납품 업체가 바뀐다','학교 가정통신문','"맘카페에 올라온 글"'],['독감으로 3학년 전체 원격 수업','학교 홈페이지 공지','"우리 반 단톡방에서 봤어요"'],['특목고 정원이 절반으로 줄어든다','시도교육청 고시','유튜브 쇼츠 영상']];
function mgEdu(){const L=shuffle(EDU_R.slice()).slice(0,5).map(x=>{const real=chance(.5);return{t:filler(vars())(x[0]),src:real?x[1]:x[2],real};});let i=0,ok=0,run=null,done=false;const timed=mgTimed(),T=mgT(5);
  const end=()=>{if(done)return;done=true;run&&run.stop();const sc=ok>=5?.6:ok>=4?.3:ok>=3?0:-.4;if(ok>=4)spmV(4);const fx=mgPay(sc);const c=ok>=3?quickClip('[팩트체크] 학부모 단톡방에 도는 말, 사실은?',35+ok*8,R(14,24)):'';
    mgFin('팩트체크 결과',`<p class="lede">다섯 개 가운데 ${ok}개를 맞혔다. ${ok>=4?'학부모 커뮤니티에 "여기 말이 제일 정확하다"는 글이 돌았다.':ok>=3?'정정할 건 정정했다.':'헛소문을 사실이라고 했다가 정정했다.'}</p>${fxLine([c,fx].filter(Boolean).join(' · '))}`);};
  const step=()=>{run&&run.stop();if(done)return;if(i>=L.length){end();return;}const x=L[i];const el=document.getElementById('edQ');if(!el)return;el.innerHTML=`<b>${esc(x.t)}</b><br><small>출처: ${esc(x.src)}</small>`;document.getElementById('edN').textContent=`${i+1}/${L.length}`;
    if(timed){mgBarSet('ed',T,T);run=mgRun(T,l=>mgBarSet('ed',l,T),()=>{i++;step();});}};
  mgOpen('단톡방 팩트체크',`<p class="lede">학부모 단톡방에 소문이 쏟아진다. 하나씩 사실인지 루머인지 빨리 가른다.</p>${timed?mgBar('ed',T):''}<p class="hint">소문 <span id="edN"></span></p><p id="edQ"></p><div class="hb-o"><button type="button" class="hb-b" data-a="1">사실</button><button type="button" class="hb-b" data-a="0">루머</button></div>`,[{label:'그만둔다',cls:'ghost',fn:()=>{done=true;run&&run.stop();}}]);
  mgBind('.hb-b[data-a]',b=>{if(done||i>=L.length)return;if((b.dataset.a==='1')===L[i].real)ok++;i++;step();});step();}

// 의약신보 — 임상 데이터 판독
function mgMed(){const co=pick(MED_CO);const flaw=pick(['drop','p','end','sub']);const n=R(180,420),nc=R(170,410);
  const dropA=flaw==='drop'?R(16,22):R(4,8),dropB=flaw==='drop'?R(3,6):R(4,8);const pv=flaw==='p'?(R(6,9)/100).toFixed(2):(R(1,3)/100).toFixed(2);const ep1='전체 생존 기간',ep2=flaw==='end'?'무진행 생존 기간':'전체 생존 기간';const grp=flaw==='sub'?'65세 이상 환자군(전체 환자군 결과는 공개하지 않음)':'전체 환자군';
  const C=[['drop','중도 탈락이 시험군에만 몰려 있다'],['p','p값이 0.05를 넘는데 "유의한 개선"이라고 썼다'],['end','주평가변수가 등록 당시와 바뀌었다'],['sub','일부 환자군 결과만 골라 발표했다']];
  mgOpen('임상 데이터 판독',`<p class="lede">${jo2(esc(co),'이','가')} 낸 3상 결과 자료. 보도자료는 "획기적 효과"라고 썼다. 숫자 하나가 이상하다.</p><div class="hb-prev"><small>결과 요약</small><span>시험군 ${n}명 (중도 탈락 ${dropA}%) · 대조군 ${nc}명 (중도 탈락 ${dropB}%)</span><span>임상 등록 때 주평가변수: ${ep1} · 발표한 주평가변수: ${ep2}</span><span>분석 대상: ${grp}</span><span>주평가변수 개선 p = ${pv} · 회사 발표: "통계적으로 유의한 개선"</span></div><p>무엇이 문제인가?</p>`,shuffle(C.slice()).map(([k,l])=>({label:l,fn:()=>{if(k===flaw){const it=spItem(S.dept,[`${co} 3상 "획기적 효과" 발표, 데이터는 달랐다`,66,co,'d:*임상 결과 원자료|w:통계 전문가 "결과가 과장됐다"|n:문제가 된 수치|w:'+co+' "해석의 차이"'],{excl:true,pre:1,src:'데이터 판독'});S.items.push(it);toast(`맞혔다 → 「${it.title}」 · `+mgPay(.6));}else toast(`${co} 홍보팀: "그건 문제가 아닙니다." 반박에 머쓱해졌다 · `+mgPay(-.2));}})).concat([{label:'그만둔다',cls:'ghost'}]));}

// 전자일보 — 유출 사양 판별
function mgTech(){const P=spmS();const C=P.ch||spTechNew();const spec={'배터리':R(40,55)*100+'mAh','화면':`${R(60,72)/10}인치`,'칩 공정':`${pick([2,3,4])}나노`,'출시':`${R(1,12)}월`};const keys=Object.keys(spec);const fake=pick(keys);const fakeV={'배터리':(parseInt(spec['배터리'])+R(5,10)*100)+'mAh','화면':`${(parseFloat(spec['화면'])+.4).toFixed(1)}인치`,'칩 공정':`${pick([1,5])}나노`,'출시':`${((parseInt(spec['출시'])+R(2,6)-1)%12)+1}월`}[fake];
  const know=[];C.got.forEach((g,i)=>{if(g){const k=['화면','배터리','칩 공정'][i];know.push(`${k} ${spec[k]} (${TECH_LINK[i][0]} 확인)`);}});
  mgOpen('유출 사양 판별',`<p class="lede">커뮤니티에 ${esc(C.corp)} ${esc(C.prod)} 유출 사양이 돌았다. 네 줄 가운데 하나는 가짜다.</p><div class="hb-prev"><small>유출 사양</small>${keys.map(k=>`<span>${k}: ${k===fake?fakeV:spec[k]}</span>`).join('')}</div><p class="hint">${know.length?'내가 협력사에서 확인한 것: '+know.join(' · '):'협력사 라인에서 확인한 게 없다. 감으로 골라야 한다.'}</p><p>가짜는?</p>`,keys.map(k=>({label:`${k}`,fn:()=>{if(k===fake){const it=spItem(S.dept,[`${C.corp} ${C.prod} 유출 사양, ${jo2(k,'은','는')} 가짜였다`,54,C.corp,`d:*협력사 사양 자료|w:협력사 관계자 "그 숫자는 틀렸다"|n:실제 ${k}|w:${C.corp} "확인해 줄 수 없다"`],{excl:true,pre:1,src:'사양 판별'});S.items.push(it);toast(`맞혔다 → 「${it.title}」 · `+mgPay(.5));}else{valN('sp',1);toast(`틀렸다. 가짜 사양을 받아 쓴 기사가 나갔다 · `+mgPay(-.5)+' · '+apply({trust:-1}));}}})).concat([{label:'그만둔다',cls:'ghost'}]));}

// 법정신문 — 법정 방청 (모순 찾기)
const LAW_CASE=[{c:'{corp} 회장 배임 재판',w:'전 재무이사',T:['회장에게 보고한 적이 없다','그날 밤엔 회사에 없었다','계약서는 실무진이 만들었다','회의는 한 번뿐이었다'],E:['메신저 기록: "회장님께 보고드렸습니다"','출입 기록: 그날 밤 9시 사옥 출입','회의록 세 건'],m:[[0,0],[1,1],[3,2]]},
 {c:'{city} 시장 뇌물 재판',w:'건설업체 대표',T:['시장을 따로 만난 적이 없다','현금을 준 적이 없다','공사는 정상 입찰로 땄다','그 식당엔 간 적이 없다'],E:['식당 카드 결제 내역','은행 출금 기록과 같은 날 쇼핑백 CCTV','입찰 직전 단독 면담 일정표'],m:[[3,0],[1,1],[0,2]]},
 {c:'공장 산재 은폐 재판',w:'공장장',T:['사고 당일 안전 점검을 했다','119 신고는 즉시 했다','피해자는 교육을 받았다','작업 중지 명령은 없었다'],E:['점검표 서명 날짜가 사고 다음 날','신고 시각이 사고 40분 뒤','노동청 작업 중지 공문'],m:[[0,0],[1,1],[3,2]]},
 {c:'아동학대 은폐 재판',w:'어린이집 원장',T:['CCTV는 고장이었다','학부모에게 바로 알렸다','교사는 바로 업무에서 뺐다','그 교사는 처음 문제를 일으켰다'],E:['같은 날 다른 방 CCTV 정상 녹화','학부모 연락 기록: 사흘 뒤','같은 교사 이전 민원 두 건'],m:[[0,0],[1,1],[3,2]]}];
function mgLaw(){const K=pick(LAW_CASE);const f=filler(vars());const cs=f(K.c);let ti=-1,ei=-1,tries=2;
  const body=`<p class="lede">${esc(cs)} 공판. 증인 ${jo2(esc(K.w),'이','가')} 증언대에 섰다. 증언과 증거가 어긋나는 곳을 찾는다.</p><div class="hb-sec"><b>증언</b></div><div class="mgl">${K.T.map((t,i)=>`<button type="button" class="mgi" data-t="${i}">"${esc(t)}"</button>`).join('')}</div><div class="hb-sec"><b>증거</b></div><div class="mgl">${K.E.map((t,i)=>`<button type="button" class="mgi" data-e="${i}">${esc(t)}</button>`).join('')}</div>`;
  mgOpen('법정 방청',body,[{label:'이 둘이 어긋난다',sub:'기회 두 번',fn:()=>{if(ti<0||ei<0){toast('증언 하나와 증거 하나를 고르자');return false;}if(K.m.some(([a,b])=>a===ti&&b===ei)){const it=spItem(S.dept,[`${cs}, 증인 "${K.T[ti]}"…기록은 달랐다`,60,K.w,`d:*${K.E[ei]}|w:방청한 변호사 "위증 소지가 있다"|d:공판 조서|w:${K.w} 측 "기억이 틀렸을 뿐"`],{excl:true,pre:1,via:'법정 방청',src:'법정 방청'});S.items.push(it);spmV(4);mgFin('찾았다',`<p class="lede">증언과 기록이 어긋난다 → 「${esc(it.title)}」</p>${fxLine(mgPay(.55))}`);return false;}
     tries--;if(tries<=0){mgFin('놓쳤다',`<p class="lede">어긋나는 곳을 끝내 못 찾았다. 다른 매체가 다음 날 위증 의혹을 썼다.</p>${fxLine(mgPay(-.2))}`);return false;}toast('맞지 않는다. 한 번 더');return false;}},{label:'그만둔다',cls:'ghost'}]);
  mgBind('.mgi[data-t]',b=>{ti=+b.dataset.t;document.querySelectorAll('#mb .mgi[data-t]').forEach(x=>x.classList.toggle('on',x===b));});mgBind('.mgi[data-e]',b=>{ei=+b.dataset.e;document.querySelectorAll('#mb .mgi[data-e]').forEach(x=>x.classList.toggle('on',x===b));});}

// 스포츠지 — 경기 막판 문자중계 마감
function mgSports(){const sea=spSeason(month());if(sea==='스토브리그'){toast('비시즌이라 경기가 없다');mgPay(0);return;}const f=filler(vars());const A=f('{team}');let B=f('{team}');if(B===A)B=pick(TEAMS.filter(x=>x!==A));
  let us=R(3,6),them=us-R(1,3),inn=0,sent=null,prep=false,done=false,run=null;const flip=chance(.3);const rv=mgRival();const rTick=rv.st==='click'||rv.st==='scoop'?3:rv.st==='digital'?5:7;const timed=mgTimed(),T=mgT(2);
  const EV=['선두 타자 삼진','2루타 허용','볼넷으로 주자 1·2루','투수 교체','2사 만루','적시타 — 한 점 차','홈런!'];
  const final=()=>{const win=!flip;return win?`${A} ${us}-${them} 승`:`${B} 역전승`;};
  const logL=[];const draw=()=>{const b=document.getElementById('spL');if(b)b.innerHTML=logL.map(x=>`<div>${esc(x)}</div>`).join('');const s=document.getElementById('spS');if(s)s.textContent=`${A} ${us} : ${them} ${B}`;};
  const tick=()=>{if(done)return;inn++;if(inn<=5){const ev=flip&&inn===5?'역전 끝내기 홈런!':pick(EV);if(flip&&inn===5)them=us+1;else if(/한 점 차/.test(ev))them=Math.min(us-1,them+1);logL.push(`9회말 ${inn}구째 — ${ev}`);draw();}if(inn>=6){logL.push('경기 종료');draw();if(sent==null)send('final');}};
  const send=(when)=>{if(done)return;done=true;run&&run.stop();const early=when==='early';let sc,txt;
    if(early){if(flip){sc=-1;valN('sp',3,'경기가 끝나기 전에 결과 기사를 냈다');apply({trust:-3});txt=`경기가 끝나기 전에 "${A} 승리" 기사를 냈다. 9회말 역전. 오보다.`;}else{sc=.75;valN('sp',2);txt=`경기 종료 전 미리 송고. 결과가 맞았다. 가장 빨랐다.`;}}
    else{const rvEarly=rTick<6;if(flip&&rvEarly){sc=prep?.65:.45;txt=`${final()}. ${jo2(rv.n,'은','는')} 경기가 끝나기 전에 "${A} 승리"를 쳤다가 오보를 냈다. ${prep?'우리는 예약 기사로 1초 만에 맞는 결과를 냈다.':'우리는 끝까지 기다렸다.'}`;}else if(prep){sc=rvEarly?.35:.55;txt=`예약 기사 두 개 중 맞는 걸 바로 냈다. ${final()}.${rvEarly?` ${jo2(rv.n,'이','가')} 미리 친 기사가 맞아 선점은 놓쳤다.`:' 가장 빨랐다.'}`;}else{sc=rvEarly?.05:.3;txt=`${final()}. ${rvEarly?`${jo2(rv.n,'이','가')} 먼저 쳤다.`:'제때 냈다.'}`;}}
    const c=sc>-1?quickClip(`[경기] ${final()}`,45+S.st.spd*.3,R(22,36)):'';mgRivalHit(rv,sc>.3);const fx=mgPay(sc);mgFin('경기 결과 송고',`<p class="lede">${esc(txt)}</p>${fxLine([c,fx].filter(Boolean).join(' · '))}`);};
  mgOpen(`${A} 대 ${B} · 9회말`,`<p class="lede">9회말, ${jo2(esc(A),'이','가')} 앞서 있다. 결과 기사를 언제 낼까. 일찍 내면 가장 빠르지만 뒤집히면 오보다.</p><p id="spS" style="font-weight:800;font-size:18px"></p><div class="hb-prev" id="spL"></div>`,[
    {label:'지금 결과 기사를 낸다',risk:true,sub:'가장 빠르다 · 뒤집히면 오보',fn:()=>{send('early');return false;}},
    {label:'승·패 예약 기사를 둘 다 써 둔다',sub:'컨디션↓ · 끝나는 순간 바로 낸다',fn:()=>{if(!prep){prep=true;S.hp=clamp(S.hp-4,0,100);toast('예약 기사 두 개를 걸어 뒀다');}return false;}},
    ...(timed?[]:[{label:'다음 상황',sub:'한 구씩 넘긴다',fn:()=>{tick();return false;}}]),
    {label:'그만둔다',cls:'ghost'}]);
  draw();if(timed){const iv=()=>{run=mgRun(T,null,()=>{tick();if(!done)iv();});};iv();}}

// 연예지 — 잠복 셔터 타이밍
const STAR_EV=['편의점 앞에 배달 오토바이가 선다','경비원이 순찰을 돈다','현관 불이 켜진다','매니저 차량이 들어온다','고양이가 담을 넘는다','택시가 잠깐 섰다 간다'];
function mgShutter(onHit){const N=8,hitAt=R(4,7);const seq=[];for(let i=0;i<N;i++)seq.push(i===hitAt?'두 사람이 함께 현관을 나선다':pick(STAR_EV));let i=-1,done=false,run=null;const timed=mgTimed(),T=mgT(2);
  const shot=()=>{if(done)return;done=true;run&&run.stop();const cur=seq[i]||'';if(i===hitAt){toast('찍었다!');Q.unshift(onHit);closeModal();return;}if(/경비원/.test(cur)){spmV(-5);mgFin('들켰다',`<p class="lede">경비원이 다가왔다. "어디서 왔어요?" 카메라를 내려놓고 철수했다.</p>${fxLine(apply({hp:-3}))}`);return;}mgFin('놓쳤다',`<p class="lede">셔터를 눌렀지만 엉뚱한 장면이었다. 두 사람은 끝내 나오지 않았다… 아니, 이미 지나갔는지도 모른다.</p>`);};
  const next=()=>{if(done)return;i++;if(i>=N){done=true;mgFin('허탕',`<p class="lede">새벽 다섯 시. 결정적인 순간을 놓쳤다.</p>`);return;}const e=document.getElementById('stE');if(e)e.textContent=`${i+1}/${N} · ${seq[i]}`;};
  mgOpen('잠복 · 셔터',`<p class="lede">차 안에서 현관을 지켜본다. 결정적인 순간에만 셔터를 누른다. 엉뚱할 때 누르면 들킬 수 있다.</p><p id="stE" style="font-weight:700;font-size:16px;min-height:24px">대기 중…</p>`,[{label:'셔터!',fn:()=>{shot();return false;}},...(timed?[]:[{label:'계속 지켜본다',sub:'다음 장면',fn:()=>{next();return false;}}]),{label:'철수한다',cls:'ghost'}]);
  if(timed){next();const iv=()=>{run=mgRun(T,null,()=>{next();if(!done)iv();});};iv();}else next();}