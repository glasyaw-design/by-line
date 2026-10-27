// 1.71 · 계정 · 클라우드 저장 · 기록실 동기화
// 예전 파일 v69.js를 순서 그대로 이어 붙였다

// ───── (예전 v69.js) ─────
/* 바이라인 — src/compat/v69.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.71 계정 · 클라우드 저장: 로그인하면 다른 기기에서도 이어 한다 =====
const ACC_K='byline-auth';
function accOn(){try{if(typeof inArtifact==='function'&&inArtifact())return false;return location.protocol==='https:'||/^(localhost|127\.0\.0\.1)$/.test(location.hostname);}catch(e){return false;}}
function accGet(){try{const v=JSON.parse(localStorage.getItem(ACC_K)||'null');return v&&v.tok?v:null;}catch(e){return null;}}
function accSet(v){try{if(v)localStorage.setItem(ACC_K,JSON.stringify(v));else localStorage.removeItem(ACC_K);}catch(e){}}
async function accApi(a,body){const u=accGet();let r;try{r=await fetch('/api/account',{method:'POST',headers:Object.assign({'content-type':'application/json'},u?{authorization:'Bearer '+u.tok}:{}),body:JSON.stringify(Object.assign({a},body||{}))});}catch(e){throw new Error('서버에 닿지 않는다 (인터넷 연결을 확인하자)');}
  let j={};try{j=await r.json();}catch(e){}
  if(r.status===401&&u&&a!=='login'&&a!=='password'&&a!=='delete'){accSet(null);}
  if(!r.ok||!j.ok)throw new Error(j.error||('서버 오류 '+r.status));return j;}
// 저장 파일 줄이기: gzip → base64 (gzip을 못 쓰는 브라우저는 그냥 base64)
function b64e(u8){let s='';for(let i=0;i<u8.length;i+=32768)s+=String.fromCharCode.apply(null,u8.subarray(i,i+32768));return btoa(s);}
function b64d(b){const s=atob(b);const u=new Uint8Array(s.length);for(let i=0;i<s.length;i++)u[i]=s.charCodeAt(i);return u;}
async function accZip(str){const raw=new TextEncoder().encode(str);try{if(typeof CompressionStream==='function'){const st=new Blob([raw]).stream().pipeThrough(new CompressionStream('gzip'));return b64e(new Uint8Array(await new Response(st).arrayBuffer()));}}catch(e){}return b64e(raw);}
async function accUnzip(b){const u=b64d(b);if(u[0]===0x1f&&u[1]===0x8b){const st=new Blob([u]).stream().pipeThrough(new DecompressionStream('gzip'));return await new Response(st).text();}return new TextDecoder().decode(u);}
function accLabel(){try{return `${S.name} · ${OUT().n} ${rankName()} · ${years()}년 차 ${dateStr()}`;}catch(e){return '';}}
const ACC_SLOTN={auto:'자동 백업','1':'클라우드 1','2':'클라우드 2','3':'클라우드 3'};
let ACC_BUSY=0;
async function accPut(slot,quiet){if(!S||(S.phase!=='game'&&S.phase!=='end')||S.dev)return false;const z=await accZip(JSON.stringify(S));await accApi('put',{slot,label:accLabel(),t:Date.now(),z});if(!quiet)toast(`${ACC_SLOTN[slot]}에 올렸다`);return true;}
// ---- 기록실(업적·엔딩·판 기록) 합치기: 숫자는 큰 쪽, 목록은 합집합, 참/거짓은 하나라도 참이면 참 ----
const ACC_LISTCAP={runs:40,heirs:5,legend:12,founded:20};
function accKey(x){return x&&typeof x==='object'?(x.id?'id:'+x.id:x.nm&&(x.h||x.by)?'nm:'+x.nm+'|'+(x.h||x.by||''):JSON.stringify(x)):JSON.stringify(x);}
function accMerge(a,b,key){if(Array.isArray(a)&&Array.isArray(b)){const seen=new Map();[...a,...b].forEach(x=>{const k=accKey(x);if(!seen.has(k))seen.set(k,x);});let out=[...seen.values()];if(key==='runs')out.sort((x,y)=>String(y.id||'').localeCompare(String(x.id||'')));const cap=ACC_LISTCAP[key]||400;return out.length>cap?out.slice(0,cap):out;}
  if(a&&b&&typeof a==='object'&&typeof b==='object'){const o=Object.assign({},a);Object.keys(b).forEach(k=>{o[k]=k in a?accMerge(a[k],b[k],k):b[k];});return o;}
  if(typeof a==='number'&&typeof b==='number')return Math.max(a,b);if(typeof a==='boolean'||typeof b==='boolean')return !!(a||b);return b===undefined||b===null?a:(a===undefined||a===null?b:a);}
let ACC_MT=null,ACC_MSYNC=0;
async function accMetaSync(quiet){if(!accGet()||!accOn())return;try{const r=await accApi('meta-get');let M=META;if(r.z){try{M=accMerge(META,JSON.parse(await accUnzip(r.z)));}catch(e){if(!quiet)toast('서버 기록을 읽지 못했다 — 덮어쓰지 않는다');return;}}
  Object.keys(M).forEach(k=>{META[k]=M[k];});try{localStorage.setItem(META_KEY,JSON.stringify(META));}catch(e){}
  await accApi('meta-put',{z:await accZip(JSON.stringify(META))});ACC_MSYNC=Date.now();if(!quiet)toast('기록실을 합쳤다');}catch(e){if(!quiet)toast(e.message);}}
{const _ms69=metaSave;metaSave=function(){const r=_ms69.apply(this,arguments);try{if(accGet()&&accOn()){clearTimeout(ACC_MT);ACC_MT=setTimeout(()=>{accMetaSync(true);},20000);}}catch(e){}return r;};}
// ---- 자동 백업: 로그인하면 석 달마다(실제로는 2분에 한 번까지) 「자동 백업」 칸에 올린다 ----
let ACC_LAST={turn:-99,t:0};
{const _sg69=saveGame;saveGame=function(){const r=_sg69.apply(this,arguments);try{if(accGet()&&accOn()&&S&&!S.dev&&!ACC_BUSY&&((S.turn<ACC_LAST.turn&&(ACC_LAST={turn:-99,t:0})),true)&&(S.phase==='end'||(S.phase==='game'&&S.turn-ACC_LAST.turn>=12))&&Date.now()-ACC_LAST.t>120000){ACC_LAST={turn:S.turn,t:Date.now()};ACC_BUSY=1;accPut('auto',true).catch(()=>{}).finally(()=>{ACC_BUSY=0;});}}catch(e){}return r;};}
// ---- 계정 창 ----
const ACC_IN='width:100%;margin:4px 0 10px;background:var(--panel2);color:var(--fg);border:1px solid var(--line);border-radius:10px;padding:10px 12px;font-size:15px';
function accVal(id){const e=document.getElementById(id);return e?e.value:'';}
function accErr(t){const e=document.getElementById('accw');if(e)e.textContent=t;}
function accMenu(){
  if(!accOn()){openModal('계정',`<p>계정과 클라우드 저장은 <b>배포된 사이트</b>에서만 쓸 수 있다. 여기서는 저장 파일 내보내기·가져오기로 옮기자.</p>`,[{label:'닫기',cls:'ghost'}]);return;}
  const u=accGet();
  if(!u){openModal('계정 · 로그인',`<p>로그인하면 저장과 기록실(업적·엔딩)이 서버에 남아 <b>다른 기기에서도 이어 할 수 있다.</b> 이메일 같은 개인 정보는 받지 않는다.</p>
   <label class="hint">아이디 (영문 소문자·숫자·_ 4~16자)</label><input id="acci" autocomplete="username" maxlength="16" style="${ACC_IN}">
   <label class="hint">비밀번호 (6자 이상)</label><input id="accp" type="password" autocomplete="current-password" maxlength="64" style="${ACC_IN}">
   <label class="hint">닉네임 (가입할 때만 · 비우면 아이디)</label><input id="accn" maxlength="12" style="${ACC_IN}">
   <p class="hint">비밀번호를 잊으면 되찾을 수 없다. 다른 사이트와 같은 비밀번호는 쓰지 말자.</p><p id="accw" class="warn keep"></p>`,
   [{label:'로그인',fn:()=>{accDo('login');return false;}},{label:'새로 가입',fn:()=>{accDo('register');return false;}},{label:'닫기',cls:'ghost'}]);
   setTimeout(()=>{const e=document.getElementById('acci');if(e)e.focus();const p=document.getElementById('accp');if(p)p.onkeydown=ev=>{if(ev.key==='Enter')accDo('login');};},50);return;}
  openModal('계정',`<p><b>${esc(u.nick||u.id)}</b> <span class="hint">(${esc(u.id)})</span> 로그인 중.</p><p class="hint">석 달마다 「자동 백업」 칸에 저절로 올라가고, 기록실은 바뀔 때마다 합쳐진다.</p>`,
   [{label:'☁ 클라우드 저장·불러오기',fn:()=>{accCloud();return false;}},
    {label:'기록실 지금 합치기',sub:'이 기기와 서버의 업적·엔딩·판 기록을 합친다',fn:()=>{accMetaSync(false);return false;}},
    {label:'비밀번호 바꾸기',fn:()=>{accPwMenu();return false;}},
    {label:'로그아웃',fn:()=>{accApi('logout').catch(()=>{});accSet(null);toast('로그아웃했다');accMenu();return false;}},
    {label:'계정 삭제',sub:'서버의 저장·기록이 모두 지워진다 · 이 기기 저장은 남는다',fn:()=>{accDelMenu();return false;}},
    {label:'닫기',cls:'ghost'}]);}
async function accDo(a){const id=accVal('acci').trim().toLowerCase(),pw=accVal('accp'),nick=accVal('accn').trim();
  if(!/^[a-z0-9_]{4,16}$/.test(id)){accErr('아이디는 영문 소문자·숫자·_ 4~16자다');return;}if(pw.length<6){accErr('비밀번호는 6자 이상');return;}
  accErr(a==='login'?'로그인 중…':'가입 중…');
  try{const r=await accApi(a,{id,pw,nick});accSet({tok:r.token,id:r.user.id,nick:r.user.nick});toast(a==='login'?`${r.user.nick}, 다시 왔다`:`가입했다 — ${r.user.nick}`);await accMetaSync(true);accAfterLogin();}catch(e){accErr(e.message);}}
async function accAfterLogin(){let L=[];try{L=(await accApi('list')).slots.filter(s=>s.t);}catch(e){}
  if(L.length){const best=L.slice().sort((a,b)=>b.t-a.t)[0];openModal('계정',`<p>로그인했다. 서버에 저장이 ${L.length}개 있다. 가장 최근은 <b>${esc(best.label)}</b> (${new Date(best.t).toLocaleString('ko-KR')}).</p>`,[{label:'☁ 클라우드 저장·불러오기',fn:()=>{accCloud();return false;}},{label:'닫기',cls:'ghost'}]);}
  else accMenu();try{render();}catch(e){}}
function accPwMenu(){openModal('비밀번호 바꾸기',`<label class="hint">지금 비밀번호</label><input id="accp" type="password" maxlength="64" style="${ACC_IN}"><label class="hint">새 비밀번호 (6자 이상)</label><input id="accq" type="password" maxlength="64" style="${ACC_IN}"><p class="hint">바꾸면 다른 기기는 모두 로그아웃된다.</p><p id="accw" class="warn keep"></p>`,
  [{label:'바꾼다',fn:()=>{const pw=accVal('accp'),npw=accVal('accq');if(npw.length<6){accErr('새 비밀번호는 6자 이상');return false;}accApi('password',{pw,npw}).then(r=>{const u=accGet();accSet(Object.assign({},u,{tok:r.token}));toast('비밀번호를 바꿨다');accMenu();}).catch(e=>accErr(e.message));return false;}},{label:'취소',cls:'ghost',fn:()=>{accMenu();return false;}}]);}
function accDelMenu(){openModal('계정 삭제',`<p>서버에 있는 <b>클라우드 저장과 기록실이 모두 지워지고</b> 되돌릴 수 없다. 이 기기 브라우저의 저장은 그대로 남는다.</p><label class="hint">비밀번호</label><input id="accp" type="password" maxlength="64" style="${ACC_IN}"><p id="accw" class="warn keep"></p>`,
  [{label:'계정을 지운다',risk:true,fn:()=>{accApi('delete',{pw:accVal('accp')}).then(()=>{accSet(null);toast('계정을 지웠다');closeModal();}).catch(e=>accErr(e.message));return false;}},{label:'취소',cls:'ghost',fn:()=>{accMenu();return false;}}]);}
// ---- 클라우드 저장·불러오기 ----
async function accCloud(){const inGame=S&&(S.phase==='game'||S.phase==='end')&&!S.dev;openModal('클라우드 저장',`<p class="hint">불러오는 중…</p>`,[{label:'닫기',cls:'ghost'}]);
  let L;try{L=(await accApi('list')).slots;}catch(e){openModal('클라우드 저장',`<p class="warn keep">${esc(e.message)}</p>`,[{label:'다시',fn:()=>{accCloud();return false;}},{label:'닫기',cls:'ghost'}]);return;}
  const row=s=>`<div class="card"><div class="t">${ACC_SLOTN[s.slot]}</div><div class="meta"><span>${s.t?esc(s.label)+' · '+new Date(s.t).toLocaleString('ko-KR'):'비어 있음'}</span></div></div>`;
  const up=slot=>async()=>{try{await accPut(slot);}catch(e){toast(e.message);}accCloud();};
  openModal('클라우드 저장',`<p>서버에 저장해 두면 다른 기기에서 로그인해 이어 할 수 있다. 「자동 백업」은 석 달마다 저절로 바뀐다.</p>${L.map(row).join('')}`,
   [...(inGame?['1','2','3'].map(s=>{const x=L.find(y=>y.slot===s);return {label:`지금 게임을 ${ACC_SLOTN[s]}에 올리기${x&&x.t?' (덮어쓰기)':''}`,fn:()=>{up(s)();return false;}};}):[]),
    ...L.filter(s=>s.t).map(s=>({label:`${ACC_SLOTN[s.slot]} 불러오기`,sub:esc(s.label),fn:()=>{accLoad(s.slot);return false;}})),
    {label:'닫기',cls:'ghost'}]);}
async function accLoad(slot){try{toast('내려받는 중…');const r=await accApi('get',{slot});const data=JSON.parse(await accUnzip(r.z));if(!data||!data.phase||!data.outlet)throw new Error('저장 파일이 올바르지 않다');closeModal();loadInto(data);ACC_LAST={turn:S.turn,t:Date.now()};}catch(e){toast(e.message);}}
// ---- 메뉴·저장 창·첫 화면에 「계정」을 단다 ----
{const _om69=openModal;openModal=function(t,b,c){try{if(Array.isArray(c)&&accOn()){const u=accGet();
   if(t==='저장 · 불러오기'){c=[{label:u?`☁ 클라우드 저장·불러오기 (${u.nick||u.id})`:'☁ 로그인하고 클라우드에 저장',sub:u?'다른 기기에서도 이어 한다':'다른 기기에서도 이어 할 수 있다',fn:()=>{u?accCloud():accMenu();return false;}},...c];b=String(b||'').replace('저장은 이 브라우저에만 남는다.',u?'슬롯 저장은 이 브라우저에 남고, 클라우드 저장은 서버에 남는다.':'저장은 이 브라우저에만 남는다 — 로그인하면 서버에도 남길 수 있다.');}
   if(t==='메뉴'){const i=c.findIndex(x=>/저장·불러오기/.test(String(x.label)));c=c.slice();c.splice(i>=0?i+1:1,0,{label:u?`👤 계정 · ${u.nick||u.id}`:'👤 로그인 · 가입',fn:()=>{accMenu();return false;}});}}}catch(e){}return _om69.call(this,t,b,c);};}
function accTitleBtn(){try{if(!S||S.phase!=='title'||!accOn())return;const ld=document.querySelector('[data-go="load"]');if(!ld||document.querySelector('[data-acc69]'))return;const u=accGet();const bt=document.createElement('button');bt.className=ld.className;bt.setAttribute('data-acc69','1');bt.type='button';bt.innerHTML=`<i>${ic('user')}</i><span>${esc(u?(u.nick||u.id):'로그인')}</span>`;bt.title=u?'계정 · 클라우드 저장':'로그인하면 다른 기기에서도 이어 한다';bt.onclick=ev=>{ev.preventDefault();ev.stopPropagation();accMenu();};const hp=document.querySelector('.ttcorner.l [data-go="help"]');(hp||ld).insertAdjacentElement('afterend',bt);}catch(e){}}
{const _rd69=render;render=function(){const r=_rd69.apply(this,arguments);accTitleBtn();return r;};}
// 페이지를 열 때: 로그인이 살아 있는지 확인하고 기록실을 합친다
setTimeout(()=>{try{if(accGet()&&accOn())accApi('me').then(r=>{const u=accGet();if(u)accSet(Object.assign({},u,{nick:r.user.nick}));return accMetaSync(true);}).then(()=>{try{if(S&&S.phase==='title')render();}catch(e){}}).catch(()=>{try{if(S&&S.phase==='title')render();}catch(e){}});}catch(e){}},2500);
// 창을 닫거나 다른 앱으로 갈 때: 진행 중인 판을 한 번 더 올린다
document.addEventListener('visibilitychange',()=>{try{if(document.visibilityState==='hidden'&&accGet()&&accOn()&&S&&S.phase==='game'&&!S.dev&&S.turn!==ACC_LAST.turn&&!ACC_BUSY){ACC_LAST={turn:S.turn,t:Date.now()};ACC_BUSY=1;setTimeout(()=>{ACC_BUSY=0;},15000);accZip(JSON.stringify(S)).then(z=>fetch('/api/account',{method:'POST',keepalive:z.length<60000,headers:{'content-type':'application/json',authorization:'Bearer '+accGet().tok},body:JSON.stringify({a:'put',slot:'auto',label:accLabel(),t:Date.now(),z})})).catch(()=>{});}}catch(e){}});
// 첫 화면 모서리 버튼이 6개가 되어 좁은 화면에선 조금 줄인다
(function(){try{const st=document.createElement('style');st.textContent='@media (max-width:430px){.ttcorner{gap:4px!important}.ttcorner.l{left:8px!important}.ttcorner.r{right:8px!important}.ttcorner .ttc{width:48px!important;min-width:0!important}.ttcorner .ttc span{font-size:10.5px;letter-spacing:-.3px}}';document.head.appendChild(st);}catch(e){}})();
