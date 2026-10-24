/* 바이라인 1.6 — src/compat/v44.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.5 신세 장부 · 줄타기 · 시의성 =====
// 아이템과 광고는 넘친다. 그래서 사람·기관과의 관계가 주는 것을 「신세」로 바꿨다 — 쌓아 두었다가 결정적인 순간에 쓴다.
// 동시에 모두와 가까울 수는 없다: 맞수가 있고, 너무 가까우면 유착 의심을 받고, 사람은 뜨고 진다.

// ---------- 공통 ----------
function e44(id){return id&&ENT[id]&&S.net&&S.net[id];}
function fav44(k){S.fav44=S.fav44||{};return S.fav44[k]||(S.fav44[k]={n:0});}
function favAdd44(k,v,cap){const f=fav44(k);f.n=clamp((f.n||0)+v,0,cap||3);return f.n;}
function favName44(k){const [t,id]=[k[0],k.slice(2)];if(t==='e')return entName(id);if(t==='s'){const s=(S.sources||[]).find(x=>String(x.id)===id);return s?`${s.name} ${s.role}`:'취재원';}if(t==='c'){const c=(S.cols||[]).find(x=>x.name===id);return c?`${c.name} ${colRole(c)}`:id;}return id;}

// ---------- 1. 맞수 관계 ----------
function rivalEnt44(id){S._rv44=S._rv44||{};if(S._rv44[id]!==undefined)return S._rv44[id];const E=ENT[id];let r=null;
  try{if(E){const same=ENTS.filter(e=>e[0]!==id&&S.net&&S.net[e[0]]);
    if(E.kind==='corp'){const L=same.filter(e=>e[2]==='corp'&&e[3]===E.c&&(e[4]||0)>0&&!/협회|연합회|상공회의소/.test(e[1]));if(L.length&&!/협회|연합회|상공회의소/.test(E.n)){L.sort((a,b)=>Math.abs((a[4]||0)-(E.w||0))-Math.abs((b[4]||0)-(E.w||0)));r=L[0][0];}}
    else if(E.kind==='party'){const L=same.filter(e=>e[2]==='party').sort((a,b)=>(b[4]||0)-(a[4]||0));r=L[0]?L[0][0]:null;}
    else if(E.kind==='gov'){if(/정부|부$|처$|청$|위원회|대통령실/.test(E.n)){const L=same.filter(e=>e[2]==='party').sort((a,b)=>(b[4]||0)-(a[4]||0));r=L[1]?L[1][0]:L[0]?L[0][0]:null;}}
    else if(E.kind==='person'){const L=same.filter(e=>e[2]==='person'&&e[3]===E.c);r=L.length?L[hashS2(id)%L.length][0]:null;}}}catch(e){}
  S._rv44[id]=r;return r;}
{const _eh44=entHit;entHit=function(it,W,imp){let out=_eh44.apply(this,arguments)||'';try{const id=it&&it.ent,rv=id&&rivalEnt44(id);if(rv&&e44(rv)&&S.net[rv].known){const d=it.pos?-Math.min(4,Math.max(1,imp/15)):Math.min(3,Math.max(1,imp/20));netUp(rv,d);out=(out?out+' · ':'')+(it.pos?`맞수 ${entName(rv)}${jp(entName(rv),'은','는')} 서운해한다(관계 ${Math.round(d)})`:`맞수 ${entName(rv)}${jp(entName(rv),'이','가')} 반긴다(관계 +${Math.round(d)})`);}
    if(it&&it.pos&&id&&e44(id))favAdd44('e:'+id,1,3);}catch(e){}return out;};}

// ---------- 3. 거리 구간 ----------
function zone44(r){r=r??0;return r>=75?['유착 위험','r']:r>=55?['가까움','g']:r>=20?['적정 거리','']:r>=-10?['데면데면','']:['냉랭','r'];}
{const _ie44=itEntHTML;itEntHTML=function(it){let h=_ie44.apply(this,arguments)||'';try{const id=it&&it.ent;if(h&&id&&e44(id)){const z=zone44(S.net[id].rel),rv=rivalEnt44(id),f=(S.fav44||{})['e:'+id];const ps=ENT[id].kind==='person'?pst44(id):null;
    const add=`<div class="meta" style="margin-top:2px">${S.net[id].known?`<span class="tag${z[1]==='r'?' ex':''}">${z[0]}</span>`:''}${f&&f.n?`<span class="tag so">내가 받을 신세 ${f.n}</span>`:''}${ps&&ps!=='flat'?`<span class="tag${ps==='down'?' ex':''}">${ps==='up'?'뜨는 중':'위태로움'}</span>`:''}${rv&&e44(rv)&&S.net[rv].known?`<span>맞수 ${esc(entName(rv))} — ${it.pos?'이 기사엔 서운해한다':'이 기사를 반긴다'}</span>`:''}</div>`;h=h.replace(/<\/div>$/,add+'</div>');}}catch(e){}return h;};}

// ---------- 5. 인물: 뜨고 진다 ----------
function pst44(id){S.pst44=S.pst44||{};if(!S.pst44[id]){const r=Math.random();S.pst44[id]={s:r<.22?'up':r<.36?'down':'flat',t:S.turn};}return S.pst44[id].s;}

// ---------- 매달: 신세 청구 · 유착 · 양다리 · 인물 · 시의성 ----------
function netMonth44(lines){if(!S||S.phase!=='game'||S.story||!S.net)return;const K=Object.keys(S.net).filter(id=>ENT[id]&&S.net[id].known);
  // 취재원: 신뢰 높고 최근에 만난 사람은 신세를 쌓아 둔다
  try{(S.sources||[]).forEach(s=>{if(s.trust>=45&&(s.last??-99)>=S.turn-4&&chance(.5))favAdd44('s:'+s.id,1,2);});}catch(e){}
  // 유착 위험 · 균형
  try{const close=K.filter(id=>S.net[id].rel>=75),mid=K.filter(id=>S.net[id].rel>=20&&S.net[id].rel<75);
    if(close.length){apply({trust:-.25*Math.min(3,close.length)});if(chance(.05*close.length)){const id=pick(close);const cp=(S.comp&&S.comp.length)?cName(pick(S.comp)):'경쟁 매체';Q.push(()=>openModal('유착 의심',`<p class="lede">${jo2(esc(cp),'이','가')} 「${jo2(esc(entName(id)),'과','와')} 유독 가까운 기자들」이라는 기사를 냈다. 내 이름이 이니셜로 나온다.</p>`,[{label:'거리를 두겠다고 밝힌다',sub:`${entName(id)} 관계↓ · 신뢰 덜 깎인다`,fn:()=>{netUp(id,-18);toast(apply({trust:-1}));}},{label:'"취재원 관리일 뿐"이라고 버틴다',risk:true,sub:'관계 유지 · 신뢰↓↓',fn:()=>{toast(apply({trust:-3,fame:-1}));}}]));}}
    else if(mid.length>=6){apply({trust:.15});if(chance(.15))lines.push({c:'g',t:`어느 한쪽에 기울지 않는 기자 — 적정 거리를 지키는 곳 ${mid.length}곳 (신뢰 조금↑)`});}}catch(e){}
  // 2. 신세 청구: 가까운 곳이 부탁을 해 온다
  try{const ask=K.filter(id=>S.net[id].rel>=60&&!((S.fav44||{})['e:'+id]||{}).n);if(ask.length&&chance(.08)){const id=pick(ask);const nm=entName(id);Q.push(()=>openModal('신세를 갚을 때',`<p class="lede">${esc(nm)} 쪽에서 연락이 왔다. "그동안 저희가 많이 도와드렸죠. 이번엔 저희 부탁 하나 들어주세요." ${pick(['다음 주 발표를 크게 써 달라고 한다.','경쟁사 문제를 한번 들여다봐 달라고 한다.','지난 기사 표현을 좀 누그러뜨려 달라고 한다.'])}</p>`,[{label:'들어준다',sub:'관계↑ · 나중에 내가 받을 신세 +1 · 신뢰↓',fn:()=>{netUp(id,6);favAdd44('e:'+id,1,3);toast(apply({trust:-1.5}));log(`${nm}의 부탁을 들어줬다`);}},{label:'선을 긋는다',sub:'신뢰↑ · 관계↓↓ · 자료가 끊길 수 있다',fn:()=>{netUp(id,-12);if(chance(.3)&&S.net[id])S.net[id].block=(S.net[id].block||0)+4;toast(apply({trust:1}));log(`${nm}의 부탁을 거절했다`);}},{label:'반만 들어준다',sub:'관계 조금↓ · 신뢰 조금↓',fn:()=>{netUp(id,-3);toast(apply({trust:-.5}));}}]));}}catch(e){}
  // 4. 양다리: 맞수 둘이 같은 달에 정반대 부탁
  try{const pairs=K.filter(id=>{const rv=rivalEnt44(id);return rv&&e44(rv)&&S.net[rv].known&&S.net[id].rel>=15&&S.net[rv].rel>=15;});if(pairs.length&&chance(.07)){const a=pick(pairs),b=rivalEnt44(a),A=entName(a),B=entName(b);
    Q.push(()=>openModal('양쪽의 부탁',`<p class="lede">같은 날 두 통의 전화. ${esc(A)}: "${esc(B)} 쪽 얘기, 이번엔 크게 써 주시죠." 한 시간 뒤 ${esc(B)}: "그 기사 나가면 곤란합니다. 이번만 넘어가 주세요."</p><p class="hint">맞수 사이다. 한쪽을 들면 다른 쪽이 등을 돌린다.</p>`,[
     {label:`${A} 편을 든다 — 크게 쓴다`,sub:`${A} 관계↑ · ${B} 관계↓↓ · 평판 조금↑`,fn:()=>{netUp(a,8);netUp(b,-12);toast(apply({fame:.6}));}},
     {label:`${B} 편을 든다 — 기사를 미룬다`,sub:`${B} 관계↑ · ${A} 관계↓↓ · 신뢰 조금↓`,fn:()=>{netUp(b,8);netUp(a,-12);toast(apply({trust:-.8}));}},
     {label:'사실만 담담하게 쓴다',sub:'양쪽 다 조금씩 서운 · 신뢰↑',fn:()=>{netUp(a,-2);netUp(b,-2);toast(apply({trust:1}));}},
     {label:'양쪽에 다 좋은 얼굴을 한다',risk:true,sub:'잘 되면 둘 다 관계↑ · 들키면 둘 다 크게 틀어진다',fn:()=>{if(chance(.5)){netUp(a,6);netUp(b,6);toast('둘 다 내 편이라고 믿는다');}else{netUp(a,-15);netUp(b,-15);toast('양쪽에 다른 말을 한 게 들통났다 · '+apply({trust:-2}));}}}]));}}catch(e){}
  // 5. 인물: 해마다 운이 바뀌고, 달마다 발탁·낙마가 일어난다
  try{if(month()===1)S.pst44={};K.filter(id=>ENT[id].kind==='person').forEach(id=>{const s=pst44(id),r=S.net[id].rel,nm=entName(id);
    if(s==='up'&&chance(.04)){S.pst44[id]={s:'flat',t:S.turn};if(r>=50){favAdd44('e:'+id,1,3);const t=apply({fame:1.2,eval:.5});lines.push({c:'g',t:`${nm}, 요직 발탁 — 가까이 지낸 덕에 내 연락을 먼저 받는다 · 받을 신세 +1 · ${t}`});}else if(r<=-10)lines.push({c:'r',t:`${nm}, 요직 발탁 — 껄끄러운 사이라 앞으로 자료 얻기가 어렵겠다`});else lines.push({c:'',t:`${nm}, 요직에 올랐다`});}
    else if(s==='down'&&chance(.04)){S.pst44[id]={s:'flat',t:S.turn};if(r>=50){const t=apply({trust:-2.5,fame:-.5});netUp(id,-20);lines.push({c:'r',t:`${nm} 낙마 — 「측근 기자」로 엮였다 · ${t}`});}else if(r<=0){lines.push({c:'g',t:`${nm} 낙마 — 거리를 둔 덕에 역풍을 피했다 · ${apply({trust:.6})}`});}else lines.push({c:'',t:`${nm}, 자리에서 물러났다`});}});}catch(e){}
  // 시의성
  try{tim44Month(lines);}catch(e){console.error(e);}}
// 월말 결과에 함께 나오도록 매달 정체성 처리(oidMonth) 뒤에 붙인다
{const _om44m=oidMonth;oidMonth=function(lines){const r=_om44m.apply(this,arguments);try{if(S._nm44!==mKey()){S._nm44=mKey();netMonth44(lines||[]);}}catch(e){console.error(e);}return r;};}

// ---------- 신세 쌓기 (동료·대외 관계) ----------
{const _ru44=relUp;relUp=function(c,v,why){const r=_ru44.apply(this,arguments);try{if(c&&v>0&&(c.rel||0)>=30&&chance(.3))favAdd44('c:'+c.name,1,2);}catch(e){}return r;};}
{const _nu44=netUp;netUp=function(id,v){const r=_nu44.apply(this,arguments);try{if(v>=2&&S.net&&S.net[id]&&S.net[id].known&&S.net[id].rel>=30&&chance(.25))favAdd44('e:'+id,1,2);}catch(e){}return r;};}

// ---------- 신세 쓰기 (새 행동) ----------
try{ACT.favor={n:'신세 쓰기',ap:0,sc:'meet',cd:0,d:'그동안 쌓은 신세를 결정적인 순간에 쓴다 — 사실 보증, 소송 방패, 오보 방어, 대신 뛰어 주기'};ACT_IC.favor='heart';ACT_STAT.favor='net';const g=ACT_GROUPS.find(x=>x[0]==='사람과 관계');if(g&&!g[2].includes('favor'))g[2].unshift('favor');}catch(e){}
{const _rk44=rankActs;rankActs=function(){const a=_rk44.apply(this,arguments);try{if(S&&!S.story&&S.rank>=1&&!a.includes('favor'))a.push('favor');}catch(e){}return a;};}
{const _wy44=why;why=function(id){if(id==='favor'){const n=Object.values(S.fav44||{}).filter(f=>f.n>0).length;return n?'':'쌓인 신세가 없다 — 취재원·동료·대외 관계를 챙기고 호재 기사를 쓰면 쌓인다';}return _wy44.apply(this,arguments);};}
function favOpts44(){const O=[];const F=S.fav44||{};const its=S.items||[];
  Object.keys(F).forEach(k=>{const f=F[k];if(!f||f.n<1)return;const t=k[0],id=k.slice(2),nm=favName44(k);const use=(fn)=>()=>{f.n--;fn();return undefined;};
    if(t==='s'){const s=(S.sources||[]).find(x=>String(x.id)===id);if(!s)return;const it=its.find(i=>catOf(s.d).includes(i.d)&&i.facts.some(x=>!fOK(x)))||its.find(i=>i.facts.some(x=>!fOK(x)));
      if(it)O.push({label:`${nm} — 확인 보증`,sub:`「${it.title.slice(0,18)}…」 사실 하나를 바로 확인해 준다`,fn:use(()=>{const x=it.facts.find(y=>!fOK(y)&&y.key)||it.facts.find(y=>!fOK(y));x.conf=x.need;x.via.push(`${s.name} 보증`);toast(`${s.name}: "그건 맞습니다. 제가 책임질게요."`);})});
      O.push({label:`${nm} — 오보 방어 증언`,sub:'다음에 오보 논란이 터지면 이 취재원이 나서서 피해를 크게 줄여 준다',fn:use(()=>{S.errShield44=(S.errShield44||0)+1;toast('든든한 증인이 생겼다');})});}
    if(t==='e'){const E=ENT[id];if(!E)return;const mine=its.filter(i=>i.ent===id||catOf(E.c).includes(i.d));const it=mine.find(i=>!i.rebut)||null;
      if(it)O.push({label:`${nm} — 공식 입장 바로 받기`,sub:`「${it.title.slice(0,18)}…」에 ${jo2(it.pos?'코멘트':'반론','이','가')} 바로 붙는다`,fn:use(()=>{it.rebut='got';toast(`${nm}: "입장문 바로 보내 드리겠습니다."`);})});
      O.push({label:`${nm} — 소송 막아 주기`,sub:'반년 동안 이곳은 내 기사에 소송을 걸지 않는다',fn:use(()=>{S.shield44=S.shield44||{};S.shield44[id]=S.turn+YW/2;toast(`${nm} 법무팀이 한발 물러섰다`);})});
      O.push({label:`${nm} — 발표 일정 미리 귀띔`,sub:'곧 나올 발표를 미리 알려 준다 — 물때가 붙은 아이템, 그때 내면 크게 실린다',fn:use(()=>{const it2=makeItem(catOf(S.dept).includes(E.c)?S.dept:S.dept,{pre:1,noPos:1});it2.peg={t:S.turn+R(3,6),l:`${nm} 발표`,k:'sched'};it2.src=nm;S.items.push(it2);toast(`물때 아이템 — 「${it2.title}」`);})});}
    if(t==='c'){const c=(S.cols||[]).find(x=>x.name===id);if(!c)return;const role=c.role;
      if(role==='boss')O.push({label:`${nm} — 고과 챙겨 주기`,sub:'사내 평가↑↑',fn:use(()=>{toast(apply({eval:2}));})});
      else if(role==='editor')O.push({label:`${nm} — 제목·지면 손봐 주기`,sub:'다음 기사 완성도↑↑',fn:use(()=>{S.peerRev={n:c.name,b:6};toast('다음 기사 제목은 편집기자가 붙어 준다');})});
      else if(role==='photo')O.push({label:`${nm} — 현장 동행 확정`,sub:'아이템 하나의 현장 사실을 바로 확인',fn:use(()=>{const it=its.find(i=>i.facts.some(x=>x.k==='s'&&!fOK(x)))||its.find(i=>i.facts.some(x=>!fOK(x)));if(it){const x=it.facts.find(y=>y.k==='s'&&!fOK(y))||it.facts.find(y=>!fOK(y));x.conf=x.need;x.via.push(`${colRole(c)} 동행`);toast(`「${it.title.slice(0,16)}…」 현장 컷을 건졌다`);}else toast('지금은 확인할 현장이 없다 — 다음 기회로');})});
      else if(role==='union')O.push({label:`${nm} — 위기 때 방패`,sub:'다음 오보·사내 위기 때 노조가 편이 된다(피해 절반)',fn:use(()=>{S.errShield44=(S.errShield44||0)+1;toast('노조가 등을 받쳐 주기로 했다');})});
      else if(['cap','mentor','senior'].includes(role))O.push({label:`${nm} — 노하우 전수`,sub:'취재력·검증력 조금↑',fn:use(()=>{gain('inv',1);gain('ver',1);toast('선배의 수첩을 한 장 넘겨받았다');})});
      O.push({label:`${nm} — 대신 뛰어 주기`,sub:S.favAp44===mKey()?'이번 달엔 이미 부탁했다':'이번 달 행동력 +1',disabled:S.favAp44===mKey(),fn:use(()=>{S.favAp44=mKey();S.ap+=1;toast(`${c.name}: "그건 내가 다녀올게."`);})});}});
  return O;}
RUN.favor=function(){const O=favOpts44();if(!O.length){toast('지금 쓸 수 있는 신세가 없다');return;}
  openModal('신세 쓰기',`<p class="lede">그동안 쌓아 둔 신세. 한 번 쓰면 사라진다 — 아이템이나 광고보다 귀한, 결정적인 순간을 위해.</p><p class="hint">신세는 신뢰 높은 취재원을 꾸준히 만나고, 동료와 가깝게 지내고, 기관·광고주·인물의 호재를 쓰면 쌓인다. 상대가 먼저 신세를 갚으라고 할 때도 있다.</p>`,O.slice(0,14).concat([{label:'닫기',cls:'ghost'}]));};
// 방패 효과
{const _se44=suitEvent;suitEvent=function(p){try{if(p&&p.ent&&S.shield44&&S.shield44[p.ent]>S.turn){toast(`${entName(p.ent)}${jp(entName(p.ent),'은','는')} 소송을 접었다 — 쌓아 둔 신세 덕`);return closeModal();}}catch(e){}return _se44.apply(this,arguments);};}
{const _sc44=scandal;scandal=function(p){try{if(S.errShield44>0){S.errShield44--;S.errors++;S.lastError=S.turn;openModal('오보 논란 — 방패가 있었다',`<p class="lede">「${esc(p&&p.title||'기사')}」에 문제가 제기됐다. 하지만 미리 받아 둔 증언과 사내 지원 덕에 보완 기사 한 건으로 끝났다.</p>${fxLine(apply({trust:-1,eval:-.5}))}`);return;}}catch(e){}return _sc44.apply(this,arguments);};}
// AI: 신세가 쌓였고 쓸 데가 있으면 추천한다
{const _rc44=recommend;recommend=function(){const r=_rc44.apply(this,arguments);try{if(S&&!S.story&&r!=='rest'&&r!=='breaking'){const F=Object.values(S.fav44||{});const tot=F.reduce((a,f)=>a+(f.n||0),0);if(tot>=3&&!why('favor')&&rankActs().includes('favor'))return 'favor';}}catch(e){}return r;};}

// ---------- 시의성: 전개형 · 물때 · 지면 경쟁 ----------
const PEG_CAL44={pol:[[10,'국정감사'],[12,'예산안 처리'],[2,'임시국회']],soc:[[7,'장마철'],[8,'폭염'],[9,'추석 연휴'],[12,'연말 안전 점검']],eco:[[1,'연간 실적 발표'],[4,'1분기 실적'],[7,'상반기 결산'],[10,'3분기 실적']],int:[[9,'유엔 총회'],[11,'정상회의']],cul:[[12,'연말 시상식'],[5,'칸 영화제'],[10,'가을 축제']],ent:[[12,'연말 시상식'],[7,'여름 성수기']],spo:[[3,'시즌 개막'],[10,'포스트시즌'],[7,'올스타전']],loc:[[10,'지역 축제'],[2,'예산 집행 시작'],[6,'단체장 취임 1년']]};
const PEG_SCH44={pol:['국회 표결','정부 발표','당 지도부 선출'],soc:['판결 선고','정부 대책 발표','감사 결과 발표'],eco:['실적 발표','금리 결정','공정위 심의'],int:['정상회담','협상 타결 예정일'],cul:['개봉','수상작 발표'],ent:['컴백','시상식'],spo:['결승전','이적 시장 마감'],loc:['도의회 표결','개발 심의']};
function pegMk44(it){const c=cat1(it.d);const now=month();if(chance(.5)&&PEG_CAL44[c]){const [m,l]=pick(PEG_CAL44[c]);let d=(m-now+12)%12;if(d===0)d=12;if(d>8)return null;return {t:S.turn+d*4,l,k:'cal'};}const L=PEG_SCH44[c]||['발표'];return {t:S.turn+R(3,10),l:pick(L),k:'sched'};}
{const _mi44=makeItem;makeItem=function(d0,o={}){const it=_mi44.apply(this,arguments);try{if(it&&S&&S.phase==='game'&&!o.ticker&&!o.anyScale&&!o.story&&!o.hoax&&!it.story&&!it.peg&&!it.dev){const r=Math.random();if(r<.2){const p=pegMk44(it);if(p)it.peg=p;}else if(r<.36&&!it.pos){it.dev={up:R(25,45)/100,down:R(10,25)/100,n:0};}}}catch(e){}return it;};}
function pegDt44(it){return it&&it.peg?Math.round((it.peg.t-S.turn)):null;}
function timTag44(it){try{let h='';if(it.peg){const dt=pegDt44(it);h+=`<span class="tag so">물때 · ${esc(it.peg.l)} ${dt>2?`${dt}주 남음`:dt>=-1?'지금이 때!':'지났다'}</span>`;}if(it.dev&&it.dev.n<3)h+=`<span class="tag">전개 중 · 다음 달 커질 ${Math.round(it.dev.up*100)}% / 식을 ${Math.round(it.dev.down*100)}%</span>`;return h;}catch(e){return '';}}
function timTxt44(it){try{if(it.peg){const dt=pegDt44(it);return ` · 물때 ${it.peg.l} ${dt>2?dt+'주 뒤':dt>=-1?'지금!':'지남'}`;}if(it.dev&&it.dev.n<3)return ' · 전개 중';return '';}catch(e){return '';}}
function newsLoad44(){try{const m=month();if(S.breaking)return 'flood';const y=2027+Math.floor(S.turn/YW);if((m===4&&y%4===0)||(m===6&&y%4===2)||(m===3&&y%5===0))return 'flood';try{if(typeof eraNow==='function'&&eraNow().some(x=>/disaster|pandemic|crash/.test(x.k)))return 'flood';}catch(e){}if(m===8||m===1||(m===9&&S.turn%4>=2))return 'drought';return 'normal';}catch(e){return 'normal';}}
function tim44Month(lines){const ld=newsLoad44();if(ld!=='normal'&&S._ld44!==mKey()){S._ld44=mKey();lines.push({c:ld==='drought'?'g':'',t:ld==='drought'?'이번 달 지면: 뉴스 가뭄 — 큰 뉴스가 없어 웬만한 기사도 크게 실린다. 아껴 둔 아이템을 낼 때다':'이번 달 지면: 뉴스 홍수 — 큰 뉴스에 묻혀 좋은 기사도 작게 실린다. 급하지 않은 건 묵혀 두자'});}
  (S.items||[]).forEach(it=>{if(it.dev&&it.dev.n<3){const r=Math.random();if(r<it.dev.up){it.dev.n++;it.imp=Math.round(it.imp*1.15);lines.push({c:'g',t:`「${it.title}」 전개 — 새 사실이 나와 판이 커졌다 (파급력 ${it.imp})`});}else if(r<it.dev.up+it.dev.down){it.dev.n=3;it.imp=Math.round(it.imp*.85);lines.push({c:'r',t:`「${it.title}」 관심이 식었다 (파급력 ${it.imp})`});}else it.dev.n++;}
    if(it.peg){const dt=pegDt44(it);if(!it.excl&&dt>-2)it.heat=Math.max(it.heat,dt+2);if(dt>=0&&dt<=4&&!it._pegN){it._pegN=1;lines.push({c:'g',t:`들고 있던 「${it.title}」 — 물때(${it.peg.l})가 다가온다. 지금 내면 크게 실린다`});}}});}
{const _wf44=writeFinish;writeFinish=function(W){try{const it=W&&W.it;if(it&&!W._tim44){W._tim44=1;let m=1;const N=[];if(it.peg){const dt=pegDt44(it);if(dt<=2&&dt>=-1){m*=1.35;N.push(`물때(${it.peg.l})를 맞췄다 — 파급력 +35%`);}else if(dt<-1){m*=.8;N.push(`물때(${it.peg.l})가 지났다 — 받아쓰기 취급`);}else{m*=.95;N.push(`물때(${it.peg.l})보다 ${dt}주 이르다`);}}
    const ld=newsLoad44();if(ld==='drought'){m*=1.15;N.push('뉴스 가뭄 — 크게 실렸다');}else if(ld==='flood'){m*=.85;N.push('뉴스 홍수 — 큰 뉴스에 묻혔다');}
    if(m!==1){it.imp=Math.max(5,Math.round(it.imp*m));setTimeout(()=>{try{toast(N.join(' · '));}catch(e){}},400);}}}catch(e){}return _wf44.apply(this,arguments);};}
// AI: 물때·전개·지면을 읽는다
{const _ai44=aiItemScore;aiItemScore=function(it,act,dir){let v=_ai44.apply(this,arguments);try{if(act==='write'){if(it.peg){const dt=pegDt44(it);if(dt>2&&dt<=8&&!it.excl)v-=3;else if(dt<=2&&dt>=-1)v+=4;else if(dt<-1)v+=1;}if(it.dev&&it.dev.n<3&&!it.excl&&it.dev.up>=.35&&(it.heat||0)>4)v-=1;const ld=newsLoad44();if(ld==='drought')v+=.8;else if(ld==='flood'&&!it.excl&&!(it.slot))v-=1;}}catch(e){}return v;};}