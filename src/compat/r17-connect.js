// 1.72 · 전문 분야↔전문기자 · 지난 판의 나 · 시대와 분야 수요 · 출세한 취재원 · 명예의 전당 · 다른 세계의 기자
// 예전 파일 v70.js를 순서 그대로 이어 붙였다

// ───── (예전 v70.js) ─────
/* 바이라인 — src/compat/v70.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.72 연결: 전문 분야↔전문기자 · 지난 판의 나 · 시대와 분야 수요 · 취재원 인생의 끝 · 명예의 전당 · 다른 세계의 기자 =====
function c70(){return !!(S&&S.phase==='game'&&!S.story);}

// ---------- 1) 예전 「전문 분야」와 전문기자 트랙을 잇는다 ----------
const SP2FX70={data:{t:'[해설]',n:'해설·분석이 강해진다'},inv:{t:null,n:'대형 추적의 결정적 증거가 쉬워진다'},anchor:{t:null,n:'방송 출연료·평판이 오른다'},col:{t:null,n:'칼럼의 여론 게이지가 빨리 찬다'},repo:{t:'[기획',n:'기획 시리즈가 강해진다'}};
function sp2Of70(){const P=S&&S.spec2;return P&&SPEC2[P.k]?P:null;}
function sp2Line70(){const P=sp2Of70();if(!P)return '';return `${SPEC2[P.k].n} ${P.lv}단계 → 시작 전문성 +${P.lv*4} · ${SP2FX70[P.k].n}`;}
{const _se70=specEnter63;specEnter63=function(){const r=_se70.apply(this,arguments);try{const P=sp2Of70();if(P&&S.spec63){S.spec63.ex=Math.min(70,S.spec63.ex+P.lv*4);S.spec63.sp2=P.k;log(`전문 분야가 이어졌다 — ${sp2Line70()}`);}}catch(e){}return r;};}
// 제안 창에 「전문 분야를 이어받는다」를 보여 준다
{const _om70a=openModal;openModal=function(t,b,c){try{if(/전문기자/.test(String(t||''))&&/제안|트랙/.test(String(t||''))&&sp2Of70()&&!isSpec())b=String(b||'')+`<p class="hint">내 전문 분야 — ${esc(sp2Line70())}</p>`;}catch(e){}return _om70a.call(this,t,b,c);};}
// 분야 기사: 맞는 전문 분야면 더 세다 · 전문 분야 경험치도 쌓인다
{const _sc70=spClip67;spClip67=function(h,imp,q,lead,o){const P=sp2Of70();let k=1,kq=0;try{if(P){const f=SP2FX70[P.k];if(f.t&&String(h).startsWith(f.t)){k=1+.03*P.lv;kq=P.lv;}}const dm=dem70();if(dm>1)k*=1+(dm-1)*.6;}catch(e){}
  const c=_sc70.call(this,h,imp*k,q+kq,lead,o);try{if(P)spec2XP(kq?1.2:.5);if(dem70()>1.15)c.hot70=1;}catch(e){}return c;};}
{const _he70=huntEnd63;huntEnd63=function(){try{const P=sp2Of70();if(P&&P.k==='inv'&&S.hunt63)S.hunt63.ev+=3+P.lv*2;}catch(e){}return _he70.apply(this,arguments);};}
{const _om70b=orgMonth;orgMonth=function(lines){const r=_om70b.apply(this,arguments);try{if(c70()&&isSpec()&&S.m70!==Math.floor(S.turn/4)){S.m70=Math.floor(S.turn/4);month70(lines);}}catch(e){console.error(e);}return r;};}
function month70(lines){const s=S.spec63,P=sp2Of70();
  if(P&&P.k==='anchor')S.fame=clamp((S.fame||0)+.04*P.lv,0,100);
  if(P&&P.k==='col'&&s&&(s.op||0)>0&&(s.op||0)<100)s.op=Math.min(100,s.op+P.lv*.6);
  // 두 개의 이름: 전문 분야 끝 단계 + 대기자
  if(P&&P.lv>=4&&(s.lv||0)>=2&&!S.ach70a){S.ach70a=1;try{ach('twoName70');}catch(e){}lines.push({c:'g',t:`「${SPEC2[P.k].n}」의 대기자 — 업계는 이제 분야와 이름을 함께 부른다`});}
  demMonth70(lines);}
try{Object.assign(ACH,{twoName70:['두 개의 이름','전문 분야 4단계에 대기자까지'],hot70:['때를 만난 펜','시대가 내 분야를 찾을 때 대형 기사'],heirSasu70:['대물림','지난 판의 후계자가 이번 판의 사수'],meet70:['그때의 나','지난 판의 나를 만난다'],src70:['출세한 취재원','오래 키운 취재원이 높은 자리에 오른다'],watch70:['친구라도 쓴다','출세한 취재원의 비리를 쓴다'],legend70:['전설을 넘어서','다른 세계에서 온 전설과의 승부에서 이긴다']});}catch(e){}

// ---------- 3) 시대 흐름과 분야 수요 ----------
function dem70(d){try{d=d||(S.spec63&&S.spec63.d)||S.dept;const C=[d,...catOf(d)];let best=1;eraNow().forEach(x=>{const im=ERA_DEF[x.k].imp||{};C.forEach(k=>{if(im[k]&&im[k]>best)best=im[k];});});return best;}catch(e){return 1;}}
function demEra70(d){try{const C=[d,...catOf(d)];const x=eraNow().find(x=>{const im=ERA_DEF[x.k].imp||{};return C.some(k=>(im[k]||1)>=1.25);});return x?ERA_DEF[x.k].n:'';}catch(e){return '';}}
function demMonth70(lines){const s=S.spec63;if(!s)return;const dm=dem70(),en=demEra70(s.d);
  if(dm>=1.25&&en&&S.dem70!==en){S.dem70=en;lines.push({c:'g',t:`${en} — ${specTitle()}의 시간이다. 방송·원고 청탁이 몰리고 분야 기사의 파급력이 커진다`});}
  if(dm<1.1&&S.dem70){lines.push({c:'',t:`${S.dem70} 바람이 잦아들었다. ${specTitle()}의 기사는 다시 평소의 무게로`});S.dem70=null;}
  if(dm>=1.25){s.ex=Math.min(100,(s.ex||0)+.3);if(chance(.25)){const fee=Math.round((60+(s.lv||0)*60)*dm);S.money+=fee;lines.push({c:'g',t:`${en||'시대'} 특집 원고·출연 청탁 — ${fee}만 원`});}}}
{const _po70=payOf;payOf=function(o,rank){const v=_po70.apply(this,arguments);try{if(isSpec()&&(rank===undefined||rank===S.rank)){const dm=dem70();if(dm>1.05)return Math.round(v*(1+(dm-1)*.35)/5)*5;}}catch(e){}return v;};}
// 전문기자 제안 때 「지금 뜨는 분야」 안내
{const _om70c=openModal;openModal=function(t,b,c){try{if(/전문기자/.test(String(t||''))&&/제안|트랙/.test(String(t||''))&&!isSpec()){const d=S.dept,dm=dem70(d),en=demEra70(d);if(dm>=1.2&&en)b=String(b||'')+`<p class="hint">지금은 ${esc(en)} — ${esc(DEPTS[d]?DEPTS[d].n.replace(/부$/,''):'')} 전문기자의 몸값이 오른다 (월급·기사 파급력↑)</p>`;}}catch(e){}return _om70c.call(this,t,b,c);};}
{const _ach70=achCheck67;achCheck67=function(){const r=_ach70.apply(this,arguments);try{if(S&&S.spec63&&(S.clips||[]).some(c=>c.hot70&&c.imp>=80))ach('hot70');}catch(e){}return r;};}

// ---------- 2) 지난 판의 내가 이번 판에 나온다 · 후계자는 사수가 된다 ----------
function lastRun70(){try{const R=(typeof META==='object'&&META&&META.runs)||[];return R.find(r=>r&&r.nm&&r.nm!==S.name&&r.yrs>=3)||null;}catch(e){return null;}}
{const _om70d=orgMonth;orgMonth=function(lines){const r=_om70d.apply(this,arguments);try{if(!c70()||S.dev)return r;
  // 후계자 사수: v66이 선배 이름을 바꿔 둔다 → 첫 해 동안 더 잘 가르친다
  if(S.heirMet66&&!S.heirSasu70){const h=(META.heirs||[])[0];const c=h&&colBy(S.founder?'mentor':'senior');if(c&&c.name===h.nm){S.heirSasu70=S.turn;c.rel=Math.max(c.rel||0,50);try{ach('heirSasu70');}catch(e){}}}
  if(S.heirSasu70&&S.turn-S.heirSasu70<YW&&S.m70h!==Math.floor(S.turn/4)){S.m70h=Math.floor(S.turn/4);try{gain(pick(['inv','wri','ver']),.25);}catch(e){}}
  // 지난 판의 나: 1년 차 봄 이후, 한 번
  if(!S.meet70&&S.meet70q!==S.turn&&S.turn>=10&&chance(.2)){const L=lastRun70();if(!L)S.meet70=1;else{S.meet70q=S.turn;Q.push(()=>meet70(L));}}}catch(e){}return r;};}
function meet70(L){S.meet70=1;const o=OUTLETS.find(x=>x.id===L.oid);const here=o&&o.id===S.outlet;const ret=/퇴임|정년|은퇴|명예/.test(String(L.end))||L.yrs>=20;
  const who=`${esc(L.o)} ${here?'':'출신 '}${esc(L.rn)} ${esc(L.nm)}`;
  openModal('명함 한 장',`<p class="lede">점심 자리에 낯선 손님이 끼었다. 명함에는 <b>${who}</b>. 기자 생활 ${L.yrs}년을 마친 사람이다${L.end?` (${esc(L.end)})`:''}.</p><p>"자네 기사 봤어. 나도 그 나이 때 그렇게 썼지."${L.best?` 그의 대표작은 「${esc(L.best.h)}」 — 기자들 사이에선 아직도 회자된다.`:''}</p><p class="hint">지난 판의 당신이다.</p>`,[
   {label:'밥을 사고 취재원으로 모신다',sub:'오래 가는 취재원 · 가끔 큰 귀띔',fn:()=>{const s={id:uid(),name:L.nm,role:`${L.o} ${ret?'전 ':''}${L.rn}`,d:S.dept,trust:60,pers:pick(Object.keys(PERS)),last:-9,fresh:S.turn,me70:1};S.sources.push(s);log(`취재원: ${L.nm} — 지난 판의 나`);try{ach('meet70');}catch(e){}toast(`${jo2(L.nm,'이','가')} 취재원이 됐다`);}},
   {label:'대표작을 어떻게 썼는지 묻는다',sub:'취재력·필력 성장',fn:()=>{try{gain('inv',.9);gain('wri',.9);}catch(e){}try{ach('meet70');}catch(e){}toast(`"확인은 두 군데, 리드는 한 문장." — ${L.nm}`);}}]);}
// 지난 판의 나(취재원)는 1년에 한 번 큰 귀띔을 준다
{const _om70e=orgMonth;orgMonth=function(lines){const r=_om70e.apply(this,arguments);try{if(c70()&&month()===6&&S.me70Y!==Math.floor(S.turn/YW)){const s=(S.sources||[]).find(x=>x.me70);if(s&&(S.items||[]).length<6){S.me70Y=Math.floor(S.turn/YW);const it=makeItem(S.dept,{excl:true,anyScale:true,mult:1.15});S.items.push(it);lines.push({c:'g',t:`${s.name}의 전화 — "이건 자네가 써야 해." 「${it.title}」`});}}}catch(e){}return r;};}

// ---------- 4) 취재원 인생의 끝: 출세한 취재원 ----------
const TOP70={pol:['국회의원','장관','청와대 수석'],eco:['금융위원장','그룹 부회장','경제부총리'],ind:['그룹 부회장','협회장'],soc:['검찰총장','경찰청장','장관'],case:['검찰총장','경찰청장'],court:['대법관','법원장','검사장'],med:['보건복지부 장관','대학병원장'],edu:['교육감','총장'],cul:['문화체육관광부 장관','국립극장장'],ent:['대형 기획사 대표'],spo:['체육회장','구단 사장'],loc:['도지사','시장'],int:['대사','외교부 차관']};
function topRole70(d){const k=Object.keys(TOP70).find(k=>k===d||(catOf(d)||[]).includes(k))||'soc';return pick(TOP70[k]);}
{const _sl70=srcLife66;srcLife66=function(lines){const before=S.sl66Y;S.top70Y=0;const keep=(S.sources||[]).filter(x=>x&&x.me70);if(keep.length)S.sources=S.sources.filter(x=>!x.me70);let r;try{r=_sl70.apply(this,arguments);}finally{if(keep.length)S.sources=keep.concat(S.sources);}try{if(S.sl66Y===before)return r;
  (S.sources||[]).forEach(s=>{if(!s||s.top70)return;const ran=/\(출마\)/.test(String(s.role||''));
    if((((s.up66||0)>=1||(s.trust||0)>=60)&&(s.trust||0)>=50&&S.turn-(s.fresh||0)>=YW*3&&!S.top70Y&&chance((s.up66||0)>=1?.4:.15))||(ran&&chance(.5))){const base=String(s.role||'').replace(/\s*\([^)]*\)/g,'').trim();const top=ran?'국회의원':topRole70(s.d||S.dept);s.top70={r:top,t:S.turn};S.top70Y=1;s.role=top+` (전 ${base})`;s.trust=Math.min(100,(s.trust||0)+5);lines.push({c:'g',t:`취재원 ${s.name} — ${top}${jp(top,'이','가')} 됐다. 오래 알고 지낸 사이다`});try{ach('src70');}catch(e){}}});}catch(e){}return r;};}
{const _om70f=orgMonth;orgMonth=function(lines){const r=_om70f.apply(this,arguments);try{if(c70()&&(month()===9||month()===11)&&S.top70M!==Math.floor(S.turn/4)){S.top70M=Math.floor(S.turn/4);const L=(S.sources||[]).filter(s=>s&&s.top70&&S.turn-s.top70.t>=6);const s=pick(L);if(s){if(chance(.55))topTip70(s,lines);else Q.push(()=>topWatch70(s));}}}catch(e){}return r;};}
function topTip70(s,lines){if((S.items||[]).length>=6)return;const it=makeItem(s.d||S.dept,{excl:true,anyScale:true,mult:1.25});it.src=`${s.name} ${s.top70.r}`;S.items.push(it);lines.push({c:'g',t:`${s.top70.r} ${s.name} — 저녁 자리에서 흘린 한마디가 큰 기사가 됐다 「${it.title}」`});}
function topWatch70(s){const nm=esc(s.name),r=esc(s.top70.r);const d=s.d||S.dept;
  openModal('감시해야 할 사람',`<p class="lede">제보가 들어왔다. ${r} <b>${nm}</b> 주변의 수상한 돈 흐름. 신입 때부터 밥을 사 주던 사람이다.</p><p>"기자는 친구를 고를 수 없다." 선배들이 하던 말이 떠오른다.</p>`,[
   {label:'쓴다 — 반론을 충분히 받고',sub:'단독 · 신뢰↑ · 평판↑ · 그 취재원은 잃는다',fn:()=>{try{const it=makeItem(d,{excl:true,anyScale:true,mult:1.3,keyConf:true});it.title=`[단독] ${s.top70.r} ${s.name} 측근 계좌로 흘러간 돈`;it.crit=1;if((S.items||[]).length<7)S.items.push(it);}catch(e){}S.sources=S.sources.filter(x=>x!==s);try{ach('watch70');}catch(e){}toast(apply({trust:2,fame:1.5}));}},
   {label:'모른 척한다',sub:'취재원 신뢰↑ · 들키면 유착 논란',risk:true,fn:()=>{s.trust=Math.min(100,(s.trust||0)+10);S.pending=S.pending||[];if(chance(.35))S.pending.push({type:'err',title:`${s.top70.r} 의혹을 알고도 덮었다는 보도`,due:S.turn+R(6,14),why:['유착 의혹']});toast(apply({trust:-1}));}},
   {label:'본인에게 먼저 묻는다',sub:'해명을 듣는다 · 반은 맞고 반은 틀릴 수 있다',fn:()=>{if(chance(.5)){toast(`${s.name}: "오해야. 자료 다 줄게." — 의혹이 풀렸다`);s.trust=Math.min(100,(s.trust||0)+4);apply({trust:.5});}else{toast(`${s.name}${jp(s.name,'은','는')} 전화를 받지 않는다. 다음 날 해명 자료가 먼저 나왔다`);s.trust=Math.max(0,(s.trust||0)-20);apply({eval:-.5});}}}]);}

// ---------- 5) 명예의 전당 (모든 플레이어) · 7) 다른 세계의 기자 ----------
function hallRun70(){try{const r=META.runs[0];if(!r)return null;return {id:r.id,nm:r.nm,rn:r.rn,o:r.o,oid:r.oid,end:String(r.end||''),yrs:r.yrs,age:r.age,sc:r.sc,aw:r.aw,ex:r.ex,f:r.f,best:r.best?r.best.h:'',dept:r.dept||'',sty:r.sty||'',d:r.d};}catch(e){return null;}}
function hallSend70(){try{if(!S||S.phase!=='end'||!S.metaDone||S.hall70||S.dev||S.devUsed||S.story||!accOn()||!accGet())return;if(S.hall70f&&(S.hall70f.n>=3||Date.now()-S.hall70f.t<60000))return;const r0=META&&META.runs&&META.runs[0];if(!r0||r0.nm!==S.name||r0.yrs!==years())return;S.hall70=1;const run=hallRun70();if(run&&run.yrs>=1)accApi('hall-put',{run}).then(x=>{try{toast(x.best?'명예의 전당에 이름을 올렸다':'명예의 전당 — 내 최고 기록은 그대로다');}catch(e){}}).catch(()=>{S.hall70=0;S.hall70f={t:Date.now(),n:((S.hall70f&&S.hall70f.n)||0)+1};});}catch(e){}}
{const _rd70=render;render=function(){const r=_rd70.apply(this,arguments);hallSend70();return r;};}
async function hallTop70(scope){const r=await fetch('/api/account',{method:'POST',headers:Object.assign({'content-type':'application/json'},accGet()?{authorization:'Bearer '+accGet().tok}:{}),body:JSON.stringify({a:'hall-top',scope})});const j=await r.json();if(!j.ok)throw new Error(j.error||'불러오지 못했다');return j.list||[];}
async function hallWorld70(scope){scope=scope||'all';const nav=`<div class="acat">${[['all','역대'],['month','이번 달']].map(([k,n])=>`<button class="achip" data-hw="${k}" aria-pressed="${k===scope}" style="--c:var(--sodium)">${n}</button>`).join('')}<button class="achip" data-hl="runs" style="--c:var(--mute)">← 내 기록실</button></div>`;
  if(!accOn()){openModal('전체 순위',nav+'<p class="empty">전체 순위는 배포된 사이트에서만 볼 수 있다.</p>',[{label:'닫기',cls:'ghost'}]);bindHall70();return;}
  openModal('전체 순위',nav+'<p class="hint">불러오는 중…</p>',[{label:'닫기',cls:'ghost'}]);bindHall70();
  let L;try{L=await hallTop70(scope);}catch(e){openModal('전체 순위',nav+`<p class="warn keep">${esc(e.message)}</p>`,[{label:'닫기',cls:'ghost'}]);bindHall70();return;}
  const me=accGet();const rows=L.map((r,i)=>`<div class="card hrun${r.mine?' mine70':''}"><div class="t">${i+1}. ${esc(r.nm)} · ${esc(r.rn)} <small>${esc(r.o)}</small>${r.mine?' <span class="tag ok">나</span>':''}</div><div class="meta"><span>점수 ${r.sc}</span><span>${r.yrs}년</span><span>단독 ${r.ex}</span><span>기자상 ${r.aw}</span><span>${esc(r.end)}</span>${r.nick?`<span>플레이어 ${esc(r.nick)}</span>`:''}</div>${r.best?`<p class="hint" style="margin:4px 0 0">대표작 「${esc(r.best)}」</p>`:''}</div>`).join('');
  openModal('전체 순위',nav+`<p class="hint">로그인한 플레이어가 끝낸 판이 올라온다. 한 사람은 가장 높은 판 하나만.${me?'':' 로그인하면 내 판도 올라간다.'}</p>`+(rows||'<p class="empty">아직 올라온 판이 없다. 첫 이름이 되어 보자.</p>'),[...(me?[]:[{label:'로그인하고 내 판 올리기',fn:()=>{accMenu();return false;}}]),{label:'닫기',cls:'ghost'}]);bindHall70();}
function bindHall70(){document.querySelectorAll('#mb [data-hw]').forEach(b=>b.onclick=()=>hallWorld70(b.dataset.hw));document.querySelectorAll('#mb [data-hl]').forEach(b=>b.onclick=()=>hallOpen(b.dataset.hl));}
// 기록실에 「전체 순위」 탭을 단다 (hallOpen은 뒤 파일에 있어 감싸지 않고 창이 열릴 때 덧붙인다)
{const _om70g=openModal;openModal=function(t,b,c){const r=_om70g.call(this,t,b,c);try{if(t==='기록실'){const nav=document.querySelector('#mb .acat');if(nav&&!nav.querySelector('[data-hw]')){const bt=document.createElement('button');bt.className='achip';bt.type='button';bt.dataset.hw='all';bt.style.setProperty('--c','var(--sodium)');bt.textContent='🏆 전체 순위';bt.onclick=()=>hallWorld70('all');nav.appendChild(bt);}}}catch(e){}return r;};}
// 다른 세계의 기자: 다른 플레이어가 끝낸 판의 주인공이 업계의 전설로 나온다
const GH_K='byline-ghosts';
function ghostsGet70(){try{const v=JSON.parse(localStorage.getItem(GH_K)||'null');return v&&Array.isArray(v.L)?v:null;}catch(e){return null;}}
async function ghostsFetch70(){if(!accOn())return;const c=ghostsGet70();if(c&&Date.now()-c.t<6*3600e3)return;try{const r=await fetch('/api/account',{method:'POST',headers:Object.assign({'content-type':'application/json'},accGet()?{authorization:'Bearer '+accGet().tok}:{}),body:JSON.stringify({a:'ghosts'})});const j=await r.json();if(j.ok)localStorage.setItem(GH_K,JSON.stringify({t:Date.now(),L:j.list||[]}));}catch(e){}}
setTimeout(()=>{ghostsFetch70();},4000);
function ghostPick70(){const c=ghostsGet70();if(!c||!c.L.length)return null;const me=accGet();const L=c.L.filter(g=>g&&g.nm&&g.nm!==S.name);return L.length?pick(L):null;}
{const _om70h=orgMonth;orgMonth=function(lines){const r=_om70h.apply(this,arguments);try{if(!c70()||S.dev)return r;
  if(!S.gh70&&!S.gh70no&&S.turn>=16&&chance(.12)){const g=ghostPick70();if(!g){if(S.turn>YW*3)S.gh70no=1;return r;}
    const L=OUTLETS.filter(x=>x.id!==S.outlet&&!x.closed&&!x.custom&&!x.npc);const o=L.find(x=>x.n===g.o)||pick(L.filter(x=>Math.abs(x.p-OUT().p)<=1))||pick(L);if(!o)return r;
    S.gh70={nm:g.nm,o:o.id,rn:g.rn,best:g.best,end:g.end,sk:clamp(48+(g.sc||100)/12,52,74),w:0,l:0,t0:S.turn,q:S.turn};Q.push(()=>ghostMeet70());}
  if(S.gh70&&!S.gh70.ok&&S.gh70.q!==S.turn){S.gh70.q=S.turn;Q.push(()=>ghostMeet70());}
  if(S.gh70&&S.gh70.ok&&S.m70g!==Math.floor(S.turn/4)){S.m70g=Math.floor(S.turn/4);ghostMonth70(lines);}}catch(e){}return r;};}
function ghostOut70(){const G=S.gh70;const o=G&&OUTLETS.find(x=>x.id===G.o);return o?o.n:'경쟁사';}
function ghostMeet70(){const G=S.gh70;if(!G||G.ok)return;openModal('업계의 전설',`<p class="lede">${esc(ghostOut70())}의 <b>${esc(G.nm)}</b>. 기자실에 들어서자 공기가 달라졌다.${G.best?` 그의 「${esc(G.best)}」${jp(esc(G.best),'은','는')} 교재처럼 돌려 읽힌다.`:''}</p><p class="hint">다른 플레이어가 끝낸 판의 주인공이 이 세계의 전설로 왔다.</p>`,[
   {label:'넘어서겠다고 다짐한다',sub:'몇 년간 같은 기사를 두고 다툰다 · 이기면 평판↑↑',fn:()=>{G.ok=1;G.mode='riv';log(`전설과의 승부: ${G.nm}`);}},
   {label:'찾아가 배운다',sub:'취재력·필력 성장 · 가끔 조언',fn:()=>{G.ok=1;G.mode='learn';try{gain('inv',.8);gain('wri',.8);}catch(e){}toast(`"단독은 발로 쓰는 거야." — ${G.nm}`);}},
   {label:'신경 쓰지 않는다',cls:'ghost',fn:()=>{G.ok=1;G.mode='none';}}]);}
function ghostMonth70(lines){const G=S.gh70;if(G.mode==='none'||S.turn-G.t0>YW*6||G.won||G.gone)return;if(G.mode==='riv'&&G.l>=8){G.gone=1;lines.push({c:'',t:`${G.nm}${jp(G.nm,'이','가')} 은퇴했다. 마지막 인터뷰에서 "요즘 후배들 중엔 ${S.name}${jp(S.name,'이','가')} 제일 무섭다"고 했다 (${G.w}승 ${G.l}패)`});apply({fame:.5});return;}
  if(G.mode==='learn'){if(chance(.15)){try{gain(pick(['inv','wri','ver']),.3);}catch(e){}lines.push({c:'g',t:`${G.nm}의 한마디 — "${pick(['제목에 형용사를 빼.','반론 없는 단독은 단독이 아니야.','현장 사진 한 장이 기사 열 줄이야.','취재원은 밥으로 사는 게 아니라 정확함으로 사.'])}"`});}return;}
  // 승부: 내 이번 달 단독과 그의 단독이 맞붙는다
  const mine=(S.clips||[]).filter(c=>c.turn>=S.turn-4&&c.turn<S.turn&&!c.staff&&(!c.by||c.by===S.name)&&(c.excl||(c.imp||0)>=60));const him=G.sk+R(-12,12)+Math.min(6,(S.turn-G.t0)/YW);
  if(mine.length){const best=Math.max(...mine.map(c=>(c.imp||0)*.6+(c.q||0)*.4+(c.excl?8:0)))+(S.fame||0)/20;if(best>=him){G.w++;lines.push({c:'g',t:`${G.nm}보다 한발 앞섰다 — 업계가 내 단독을 먼저 인용한다 (${G.w}승 ${G.l}패)`});apply({fame:.6});if(G.w>=3&&!G.won){G.won=1;try{ach('legend70');}catch(e){}tick(`${OUT().n} ${S.name}, 「전설」 ${jo2(G.nm,'을','를')} 넘어서다`,1);Q.push(()=>openModal('전설을 넘어서',`<p class="lede">${esc(G.nm)}${jp(G.nm,'이','가')} 먼저 전화를 걸어왔다. "이번 건, 내가 졌네. 밥은 내가 사지."</p>${fxLine(apply({fame:3,eval:1.5}))}`,[{label:'좋다'}]));}}
    else{G.l++;lines.push({c:'',t:`${G.nm}의 기사가 더 컸다 — 같은 날 나온 내 단독이 묻혔다 (${G.w}승 ${G.l}패)`});apply({fame:-.2});}}
  else if(chance(.08)){G.l++;lines.push({c:'',t:`${ghostOut70()} ${G.nm}의 대형 단독 — 우리 데스크가 "우리는 뭐 했냐"고 묻는다 (${G.w}승 ${G.l}패)`});apply({eval:-.3});}}

// 전문기자 트랙 창에 「협상(돈봉투)」 그림이 붙던 것 → 회의 그림
try{ILL_MAP.unshift([/^(전문기자 제안|전문기자의 일|정기 인사 · 다음 자리)$/,'meeting']);}catch(e){}
