// 1.76 · 쉬운 화면 · 라이벌의 인생 · 기자상과 몸값 · 저장 실패 알림 · 개인정보 동의 · 만든 사람들
// 예전 파일 v73.js · v74.js를 순서 그대로 이어 붙였다

// ───── (예전 v73.js) ─────
/* 바이라인 — src/compat/v73.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.76 쉬운 화면: 추천 3개 · 단계적 해금 · 세 줄 결산 · 탭 4개 · 이름 통일 =====
// 새로 시작한 판의 첫 2년은 기본으로 켜진다. 메뉴 → 「쉬운 화면」에서 켜고 끌 수 있다(이 기기에 저장).
function ezPref76(){try{const v=localStorage.getItem('byline-ez');return v==='1'?true:v==='0'?false:null;}catch(e){return null;}}
function ez76(){try{if(!S||S.phase!=='game'||S.story)return false;const p=ezPref76();if(p!=null)return p;if(S.ez0==null)return false;return S.turn-S.ez0<YW*2;}catch(e){return false;}}
function ez76m(){return ez76()&&MOB72();}
function ezInit76(){if(S&&S.phase==='game'&&S.ez0==null)S.ez0=S.turn<=8?S.turn:-1e6;}
// ---- 이름 통일: 사내 평가→평가 · 업계 평판→평판 · 신뢰도→신뢰 ----
try{FXN.trust='신뢰';}catch(e){}
const NM76=[[/사내 평가/g,'평가'],[/업계 평판/g,'평판'],[/신뢰도/g,'신뢰']];
function nm76(s){if(typeof s!=='string')return s;for(const [re,t] of NM76)s=s.replace(re,t);return s;}
{const _om76n=openModal;openModal=function(t,b,c){try{b=nm76(b);if(Array.isArray(c))c=c.map(x=>x&&typeof x==='object'?Object.assign({},x,{label:nm76(x.label),sub:nm76(x.sub)}):x);}catch(e){}return _om76n.call(this,t,b,c);};}
{const _to76=toast;toast=function(t){return _to76.call(this,nm76(t));};}
function nmDom76(){try{const root=document.getElementById('app')||document.body;const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);let n;while((n=w.nextNode())){const v=n.nodeValue;if(v&&/사내 평가|업계 평판|신뢰도/.test(v))n.nodeValue=nm76(v);}}catch(e){}}
// ---- 상단 상태 막대의 숫자를 누르면: 이게 뭐고 어떻게 올리나 ----
const STX76={ap:['행동력','한 달에 할 수 있는 일의 수. 다음 달이 되면 다시 찬다. 이달의 미션을 다 하면 다음 달 +1.'],money:['통장','내 돈. 월급이 들어오고 생활비·월세가 나간다. 바닥나면 빚이 생긴다.']};
function stTip76(k){if(STX76[k])return STX76[k];try{const d=evInfoD(k);if(d)return [nm76(d[0]),nm76(d[3].join(' · '))];}catch(e){}return [k,''];}
document.addEventListener('click',ev=>{try{const c=ev.target.closest&&ev.target.closest('#st72 .s');if(!c)return;const k=c.dataset.k;const [n,d]=stTip76(k);openModal(n,`<p class="lede">${esc(n)} <b>${esc(c.querySelector('b').textContent)}</b> — ${esc(d)}</p>`,[{label:'알겠다'},{label:'❓ 도움말에서 더 보기',cls:'ghost',fn:()=>{try{helpCenter('start');}catch(e){}return false;}}]);}catch(e){}});
// ---- 모바일 탭 묶음: 할 일 · 나(아이템 포함) · 사람(취재원 포함) · 회사 ----
function tg76(){if(!ez76m())return null;return [['me','나',['me','items','road','world','clips','log']],['people','사람',['src','cols','mates','team','net','adv']],['company','회사',['co','fin','org']]];}
// ---- 단계적 해금: 평기자 첫해는 핵심 행동만 (미션에 나온 일은 언제나 보인다) ----
const CORE76=['pitch','beat','source','discover','invest','write','rest','colleague','deptlife','special','handoff','drill','report','sasu','drink','hari','breaking','life'];
const CORE76F=['write','discover','invest','source','fassign','fhire','fsales','revenue','exec','front','fvision','rest','colleague','life','breaking'];
function gate76(){try{if(!ez76()||S.dev)return null;if(S.founder)return S.turn-(S.fStart||S.ez0||0)<YW?CORE76F:null;if(S.rank===1&&years()<=1)return CORE76;}catch(e){}return null;}
{const _ra76=rankActs;rankActs=function(){const a=_ra76.apply(this,arguments);try{const C=gate76();if(!C)return a;let mt=new Set();try{(S.mis&&S.mis.list||[]).forEach(x=>{const d=MIS_DEF[x.k];(d&&d.acts||[]).forEach(i=>mt.add(i));});}catch(e){}return a.filter(id=>C.includes(id)||mt.has(id)||(typeof misTag==='function'&&(()=>{try{return !!misTag(id);}catch(e){return false;}})()));}catch(e){return a;}};}
// 새로 열린 일: 처음 보이게 된 행동은 카드 한 장으로 소개
function seen76(){try{if(!ez76()||!S||S.phase!=='game'||S.dev)return;const ids=rankActs();if(!S.ezSeen){S.ezSeen={};ids.forEach(i=>S.ezSeen[i]=1);return;}const nw=ids.filter(i=>!S.ezSeen[i]);if(!nw.length)return;if(!$('#modal').hidden||Q.length)return;const id=nw[0];S.ezSeen[id]=1;
  openModal(`새로 열렸다 · ${actName(id)}`,`<p class="lede">${esc((ACT[id]||{}).d||'')}</p>${TIPS&&TIPS[id]?`<p class="hint">${TIPS[id]}</p>`:''}`);}catch(e){}}
// ---- 할 일 화면: 추천 3개를 크게, 나머지는 「전체 행동 보기」 안에 ----
const WHY76={write:()=>writable().length?'확인된 아이템이 있다 — 기사로 만들 때':'',invest:()=>(S.items||[]).length?'확인 안 된 사실이 남아 있다':'',discover:()=>(S.items||[]).length<2?'아이템이 모자라다':'',source:()=>(S.sources||[]).length<4?'취재원이 아직 적다':'',rest:()=>S.hp<45?`컨디션 ${Math.round(S.hp)} — 쉬어야 할 때`:'',pitch:()=>'아침 발제로 지면을 받는다',beat:()=>'출입처 장악도가 오른다'};
function why76(id){try{if(typeof misTag==='function'&&misTag(id))return '이달의 미션';const f=WHY76[id];const w=f&&f();if(w)return w;if(typeof recommendStat==='function'&&recommendStat()===id)return '지금 가장 효과가 큰 일';}catch(e){}return '';}
let EZALL76=false;
function act76(){try{const box=document.querySelector('.bx-act');if(!box)return;const on=ez76();box.classList.toggle('ez76',on);if(!on)return;
  const cat=S.actCat||'rec';const all=EZALL76||cat!=='rec';box.classList.toggle('ezall',all);
  const acts=box.querySelector('.acts');if(!acts)return;
  if(!all){const B=[...acts.querySelectorAll('.act')].filter(b=>!b.disabled);B.forEach((b,i)=>{b.classList.toggle('ez-top',i<3);if(i<3&&!b.querySelector('.ez-why')){const w=why76(b.dataset.act);if(w)b.insertAdjacentHTML('afterbegin',`<span class="ez-why">${esc(w)}</span>`);}});}
  let tg=box.querySelector('.ez-tg');if(!tg){tg=document.createElement('button');tg.type='button';tg.className='ez-tg';acts.insertAdjacentElement('afterend',tg);}
  const n=rankActs().filter(id=>id!=='breaking'||S.breaking).length;tg.textContent=all?'추천 3개만 보기':`분야별로 전체 보기 · ${n}개`;
  tg.onclick=()=>{EZALL76=!all;if(!EZALL76)S.actCat='rec';render();};}catch(e){}}
(function(){try{const st=document.createElement('style');st.textContent=`
.bx-act.ez76:not(.ezall) .acat,.bx-act.ez76:not(.ezall) .acts+.hint,.bx-act.ez76:not(.ezall) .acts .act:not(.ez-top){display:none!important}
.bx-act.ez76:not(.ezall) .acts{grid-template-columns:minmax(0,1fr)!important}
.bx-act.ez76:not(.ezall) .act.ez-top{min-height:0;padding:14px 16px}
.bx-act.ez76 .ez-why{display:block;font-size:11.5px;font-weight:700;color:var(--sodium,#ffb547);margin-bottom:4px;letter-spacing:-.2px}
.bx-act .ez-tg{display:block;width:100%;margin:10px 0 4px;padding:11px;border-radius:12px;border:1px dashed rgba(255,255,255,.22);background:rgba(255,255,255,.03);color:inherit;font:inherit;font-size:14px;cursor:pointer}
.bx-act:not(.ez76) .ez-tg{display:none}
.ez-sum{display:grid;gap:8px;margin:4px 0 10px}.ez-sum>div{padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.04);border-left:3px solid var(--c);font-size:14px;line-height:1.5}.ez-sum b{display:block;font-size:12px;opacity:.75;margin-bottom:2px}
.ez-more>summary{cursor:pointer;padding:8px 2px;opacity:.8;font-size:13.5px}`;document.head.appendChild(st);}catch(e){}})();
// ---- 월말 결산: 세 줄 요약 + 자세히 ----
let MON76=null;
function monSnap76(){return {eval:+S.eval||0,fame:+S.fame||0,trust:+S.trust||0,hp:+S.hp||0,money:+S.money||0,s:S};}
{const _om76m=openModal;openModal=function(t,b,c){try{if(ez76()&&/^\d+월 결산$/.test(String(t||''))&&typeof b==='string'){const P=new DOMParser().parseFromString('<div>'+b+'</div>','text/html');const li=c=>[...P.querySelectorAll('ul.feed li'+(c?'.'+c:''))].map(x=>x.textContent.trim()).filter(Boolean);
    const cur=monSnap76(),pv=MON76&&MON76.s===S?MON76:null;const up=[],dn=[];const nm={eval:evalName?nm76(evalName()):'평가',fame:'평판',trust:'신뢰',hp:'컨디션'};
    if(pv)['eval','fame','trust','hp'].forEach(k=>{const d=cur[k]-pv[k];if(Math.abs(d)>=.3)(d>0?up:dn).push(`${nm[k]} ${d>0?'+':''}${d.toFixed(1)}`);});
    const short=s=>{if(s.length<=46)return s;const c=s.slice(0,46),k=Math.max(c.lastIndexOf(' · '),c.lastIndexOf(' — '));return (k>18?c.slice(0,k):c.replace(/[\s·—-]*[^\s]*$/,''))+'…';};const OTHER=/^(편집국장|사장|국장|부장|차장|데스크|캡|팀장|회장|[가-힣]{2,4} (기자|선배|부장|캡|데스크|차장|국장))[ ,:]/;const G=li('g').filter(x=>!OTHER.test(x)),Rr=li('r');
    const good=(up.length?up.join(' · '):(G[0]&&short(G[0])))||'크게 달라진 건 없다',bad=[dn.join(' · '),Rr[0]&&short(Rr[0])].filter(Boolean).join(' — ')||'걱정할 일은 없다';
    let nx='';try{const h=nowHint();if(h){const an=h.id?actName(h.id):'';nx=h.t||(h.d&&an&&!String(h.d).includes(an)?an+' — '+h.d:(h.d||an));}}catch(e){}if(!nx)nx='이달의 미션부터 채우자';
    b=`<div class="ez-sum"><div style="--c:#5ad49b"><b>좋아진 것</b>${esc(good)}</div><div style="--c:#ff8b7a"><b>조심할 것</b>${esc(bad)}</div><div style="--c:#ffb547"><b>다음 달</b>${esc(nx)}</div></div><details class="ez-more"><summary>자세히 보기${li().length?` · ${li().length}줄`:''}</summary>${b}</details>`;}}catch(e){}return _om76m.call(this,t,b,c);};}
{const _em76=endMonth;endMonth=function(){try{if(S&&S.phase==='game')MON76=monSnap76();}catch(e){}return _em76.apply(this,arguments);};}
// ---- 메뉴에 「쉬운 화면」 켜고 끄기 ----
{const _om76g=openModal;openModal=function(t,b,c){try{if(t==='메뉴'&&Array.isArray(c)&&S&&S.phase==='game'){const on=ez76();const i=c.findIndex(x=>/도움말/.test(String(x&&x.label)));c=c.slice();c.splice(i>=0?i:c.length-1,0,{label:`🔰 쉬운 화면 · ${on?'켜짐':'꺼짐'}`,sub:on?'끄면 모든 행동·분류·결산 내용이 한 번에 보인다':'추천 3개 · 핵심 행동부터 · 세 줄 결산 · 모바일 탭 4개',fn:()=>{try{localStorage.setItem('byline-ez',on?'0':'1');}catch(e){}EZALL76=false;toast(`쉬운 화면을 ${on?'껐다':'켰다'}`);render();gameMenu();return false;}});}}catch(e){}return _om76g.call(this,t,b,c);};}
// ---- 렌더 뒤 한꺼번에 ----
{const _rd76=render;render=function(){try{ezInit76();}catch(e){}if(window.__MV==='dash'&&ez76m())window.__MV='act';const r=_rd76.apply(this,arguments);try{act76();nmDom76();setTimeout(seen76,400);}catch(e){}return r;};}

// ===== B2 라이벌의 인생: 편집국장에 오르고, 내 사람이 되기도 하고, 은퇴한다 =====
{const _ry76=rivalYear;rivalYear=function(lines){const before=S.rival?S.rival.rk:null;const r=_ry76.apply(this,arguments);try{const rv=S.rival;if(!rv||rv.pub||S.founder||S.story||month()!==1)return r;const ro=OUTLETS.find(o=>o.id===rv.outlet);if(!ro)return r;
  const cy=(S.turn-(rv.t0||0))/YW;
  if(rv.rk>=6&&before!=null&&before<6&&!rv.top76){rv.top76=1;try{const cc=(S.comp||[]).find(x=>x.id===rv.outlet);if(cc)cc.pw*=1.03;}catch(e){}Q.push(()=>openModal('라이벌, 편집국장이 되다',`<p class="lede">${esc(ro.n)} 새 편집국장 — <b>${esc(rv.name)}</b>. 수습 때 같은 경찰서를 돌던 그 얼굴이다.</p><p>${esc(rv.name)}의 첫 지시는 「${esc(OUT().n)}보다 하루 먼저」였다고 한다.</p>`,[{label:'축하 문자를 보낸다',sub:'관계가 부드러워진다',fn:()=>{rv.soft=1;toast(`"고마워. 이제 진짜 승부다." — ${rv.name}`);}},{label:'모른 척한다',sub:'승부욕↑',fn:()=>{try{gain('spd',.3);}catch(e){}}}]));}
  // 내 사람으로: 내가 위에 있고, 상대 회사가 작거나 기울 때
  if(!rv.ask76&&!S.founder&&S.rank>=4&&rv.rk<=S.rank-1&&rv.outlet!==S.outlet&&(rv.skill||0)>=60&&(ro.p<=OUT().p||ro.closed)&&chance(.3)){rv.ask76=1;Q.push(()=>openModal('라이벌을 데려온다?',`<p class="lede">${esc(ro.n)}의 ${esc(rv.name)}. 요즘 그쪽 편집국 분위기가 좋지 않다는 말이 돈다. 지금이면 우리 쪽으로 올 수도 있다.</p><p class="hint">실력 ${Math.round(rv.skill)} · 기자 ${Math.round(cy)}년 차</p>`,[
    {label:'영입한다',sub:'부서에 에이스가 생긴다 · 인건비↑ · 업계엔 새 라이벌이 생긴다',fn:()=>{try{const m=genMember(S.dept,50,70);m.name=rv.name;m.skill=Math.round(rv.skill);m.yrs=Math.round(cy);m.t0=S.turn;m.rel=35;S.team.push(m);if(S.co&&S.co.staff!=null)S.co.staff++;}catch(e){}log(`라이벌 ${rv.name} 영입`);tick(`${OUT().n}, ${ro.n} ${rv.name} 기자 영입`,1);S.rival=makeRival();toast(`${jo2(rv.name,'이','가')} 우리 편이 됐다 · 새 라이벌 — ${S.rival.name}`);}},
    {label:'라이벌은 라이벌로 둔다',sub:'계속 맞붙는다'}]));}
  // 은퇴
  if(cy>=28&&!rv.ret76){rv.ret76=1;Q.push(()=>openModal('라이벌의 은퇴',`<p class="lede">${jo2(esc(rv.name),'이','가')} ${esc(ro.n)}에서 펜을 내려놓는다. 송별회 자리에 나도 초대받았다.</p><p>"너 때문에 여기까지 왔다." 술잔이 오갔다.</p><p class="hint">맞대결 ${rv.wins||0}번 졌다는 걸 그는 기억하고 있었다.</p>`,[{label:'잔을 부딪친다',fn:()=>{try{apply({fame:.5});}catch(e){}const nr=makeRival();S.rival=nr;log(`라이벌 ${rv.name} 은퇴 · 새 라이벌 ${nr.name}`);toast(`업계엔 새 얼굴이 올라온다 — ${nr.name}`);}}]));}
 }catch(e){}return r;};}

// ===== B3 연말 기자상 → 이름값: 수상하면 2년간 제보가 찾아오고, 첫 반년은 행동력 +1, 스카우트 전화가 온다 =====
// (예전 1.76 시험판의 연봉 인상 S.awPay76은 이름값 S.awFx76로 바꿔 읽는다)
function awFx76(){try{if(S&&S.awPay76&&!S.awFx76){const A=S.awPay76;S.awFx76={t:A.until-YW*2,until:A.until,big:A.big?1:0};}delete S.awPay76;const A=S&&S.awFx76;return A&&S.turn<A.until?A:null;}catch(e){return null;}}
{const _aj76=awardJudge66;awardJudge66=function(c){const a0=S.awards||0,b0=S.awBig66||0;const r=_aj76.apply(this,arguments);try{const big=(S.awBig66||0)>b0,won=(S.awards||0)>a0;
  if(won){S.awFx76={t:S.turn,until:S.turn+YW*2,big:big?1:0};setTimeout(()=>{try{toast(`기자상 ${big?'대상':'본상'} — 2년 동안 제보가 찾아오고, 다음 ${jo2(big?'1년':'반년','은','는')} 행동력 +1`);}catch(e){}},600);
    if(!S.founder&&S.rank>=1&&S.rank<=5&&chance(big?.7:.35))S.awScout76=S.turn+R(4,8);}}catch(e){}return r;};}
// 행동력 +1: 본상은 반년, 대상은 1년
{const _ap76=apParts;apParts=function(){const p=_ap76.apply(this,arguments);try{const A=awFx76();if(A&&S.turn-A.t<(A.big?YW:YW/2))p.push([A.big?'기자상 대상':'기자상 수상',1]);}catch(e){}return p;};}
// 제보: 상을 보고 찾아오는 사람들 (본상 25% · 대상 40% · 아이템이 너무 쌓였으면 쉰다)
{const _om76a=orgMonth;orgMonth=function(lines){const r=_om76a.apply(this,arguments);try{if(!S||S.phase!=='game'||S.story)return r;const A=awFx76();
  if(A&&S.items&&S.items.length<9&&chance(A.big?.4:.25)){const it=makeItem(S.dept,{excl:chance(A.big?.6:.4),mult:A.big?1.12:1.05,pre:1});S.items.push(it);const t=`기자상 기사를 보고 찾아온 제보 — 「${it.title}」`;if(Array.isArray(lines))lines.push({c:'g',t});else toast(t);log(t);}
  if(S.awScout76&&S.turn>=S.awScout76&&!S.founder){S.awScout76=null;const want=o=>clamp(S.rank+(o.p<=OUT().p?1:0),1,5);const cand=OUTLETS.filter(o=>o.id!==S.outlet&&!o.closed&&!o.custom&&o.p>=OUT().p&&xferRank(o,want(o))>=S.rank);if(cand.length){const o=pick(cand);const rr=xferRank(o,want(o));
  Q.push(()=>openModal('수상 뒤 걸려온 전화',`<p class="lede">${esc(o.n)} 편집국장이 직접 전화했다. "올해 기자상 봤습니다. ${ro2(rankName(rr,o))} 모시고 싶어요."</p><p class="hint">남으면 회사가 붙잡으려고 기획 하나를 통째로 맡긴다.</p>`,[{label:'옮긴다',sub:`${o.n} ${rankName(rr,o)}`,fn:()=>{transfer(o,rr);}},{label:'남는다 — 대신 하고 싶던 기획을 맡는다',sub:'단독 아이템 · 평가↑',fn:()=>{try{const it=makeItem(S.dept,{excl:true,mult:1.15,keyConf:true,pre:2});S.items.push(it);toast(`${apply({eval:1})} · 기획 「${it.title}」${jp(it.title,'을','를')} 맡았다`);}catch(e){toast(apply({eval:1}));}}}]));}}}catch(e){}return r;};}
// 명예의 전당에 「기자상 대상」 표시
{const _hr76=hallRun70;hallRun70=function(){const r=_hr76.apply(this,arguments);try{if(r)r.big=S.awBig66||0;}catch(e){}return r;};}

// ───── (예전 v74.js) ─────
/* 바이라인 — src/compat/v74.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.76 출시 준비: 저장 실패 알림 · Safari 저장 지키기 · 개인정보 동의 · 만든 사람들 =====
// ---- 저장이 실패하면 알린다 (예전엔 조용히 실패했다) ----
// state.js의 saveGame / hud-missions.js의 autoSave가 실패하면 여기를 부른다.
const SVF76={warned:0,freed:0,busy:0,bad:0};
function svFreeAuto76(){let n=0;try{for(let i=2;i>=1;i--){if(localStorage.getItem(AUTOKEY(i))!=null){localStorage.removeItem(AUTOKEY(i));n++;}}}catch(e){}return n;}
function svAutoFail76(e){try{if(svFreeAuto76())localStorage.setItem(AUTOKEY(0),JSON.stringify({t:Date.now(),label:`${S.name} · ${OUT().n} ${rankName()} · ${dateStr()}`,S}));}catch(e2){}}
function svFail76(e){if(SVF76.busy)return;SVF76.busy=1;try{
  // 오래된 자동 저장(2달 전·3달 전)을 지우고 한 번 더 해 본다
  if(svFreeAuto76()){try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));window.__svOK=1;SVF76.bad=0;if(!SVF76.freed){SVF76.freed=1;setTimeout(()=>{try{toast('저장 공간이 모자라 오래된 자동 저장 2개를 지웠다');}catch(_){}},300);}return;}catch(e2){}}
  SVF76.bad=1;svBar76();}finally{SVF76.busy=0;}}
function svBar76(){try{let el=document.getElementById('svf76');if(!SVF76.bad||!S||S.phase!=='game'){if(el)el.remove();return;}
  if(!el){el=document.createElement('div');el.id='svf76';el.setAttribute('role','alert');document.body.appendChild(el);
    el.innerHTML=`<b>⚠ 저장이 안 되고 있다</b><span>브라우저 저장 공간이 가득 찼거나 막혀 있다(사생활 보호 모드 등). 이대로 닫으면 진행이 사라질 수 있다.</span><div><button type="button" data-k="file">저장 파일 내보내기</button>${(typeof accOn==='function'&&accOn())?'<button type="button" data-k="acc">계정에 올리기</button>':''}<button type="button" data-k="slot">슬롯 정리</button></div>`;
    el.addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;const k=b.dataset.k;
      if(k==='file'){try{const code=saveCode();const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([code],{type:'text/plain'}));a.download=`byline-${S.name}-${years()}년차.txt`;document.body.appendChild(a);a.click();a.remove();toast('저장 파일을 내려받았다 — 나중에 「저장 파일 가져오기」로 이어 할 수 있다');}catch(e){saveMenu();}}
      else if(k==='acc'){try{accMenu();}catch(e){}}else saveMenu();});}
  if(!SVF76.warned){SVF76.warned=1;}}catch(e){}}
// 다음 저장이 성공하면 막대를 내린다
{const _sg76=saveGame;saveGame=function(){window.__svOK=null;const r=_sg76.apply(this,arguments);try{if(window.__svOK===1&&SVF76.bad){SVF76.bad=0;svBar76();toast('저장이 다시 된다');}}catch(e){}return r;};}
(function(){try{const st=document.createElement('style');st.textContent=`
#svf76{position:fixed;left:10px;right:10px;bottom:calc(env(safe-area-inset-bottom) + 76px);z-index:90;display:grid;gap:6px;padding:12px 14px;border-radius:14px;background:#3a1418;border:1px solid #ff6b7a;color:#ffe3e6;font-size:13.5px;line-height:1.45;box-shadow:0 10px 30px rgba(0,0,0,.45);max-width:560px;margin:0 auto}
#svf76 b{font-size:14.5px}#svf76 div{display:flex;flex-wrap:wrap;gap:6px}#svf76 button{flex:1 1 auto;padding:9px 10px;border-radius:10px;border:1px solid rgba(255,255,255,.25);background:rgba(255,255,255,.08);color:inherit;font:inherit;cursor:pointer}
.ag76{display:flex;gap:8px;align-items:flex-start;margin:10px 0 2px;font-size:13px;line-height:1.45;opacity:.92}.ag76 input{margin-top:3px;flex:none;width:17px;height:17px}.ag76 a{color:var(--sodium,#ffb547)}
.ft76{margin:18px 0 6px;text-align:center;font-size:12.5px;opacity:.7}.ft76 a{color:inherit;text-decoration:underline;text-underline-offset:2px;margin:0 6px;cursor:pointer}
.cr76 dl{display:grid;grid-template-columns:auto 1fr;gap:6px 12px;margin:6px 0 10px;font-size:13.5px;line-height:1.5}.cr76 dt{font-weight:700;opacity:.8;white-space:nowrap}.cr76 dd{margin:0}`;document.head.appendChild(st);}catch(e){}})();

// ---- 저장소를 지워지지 않게 요청 (Chrome·Edge·Firefox·Safari 17+) ----
let PST76=0;
function persist76(){if(PST76)return;PST76=1;try{if(navigator.storage&&navigator.storage.persist&&navigator.storage.persisted)navigator.storage.persisted().then(p=>p||navigator.storage.persist()).catch(()=>{});}catch(e){}}
// ---- 아이폰·아이패드 Safari: 7일 동안 안 열면 저장이 지워질 수 있다 → 한 번 알려 준다 ----
function ios76(){try{const u=navigator.userAgent||'';return /iP(hone|ad|od)/.test(u)||(navigator.platform==='MacIntel'&&navigator.maxTouchPoints>1);}catch(e){return false;}}
function standalone76(){try{return !!(navigator.standalone||matchMedia('(display-mode: standalone)').matches);}catch(e){return false;}}
function iosTip76(){try{if(!S||S.phase!=='game'||S.dev||S.story0||S.turn<3||!ios76()||standalone76()||inArtifact())return;if(localStorage.getItem('byline-ios76'))return;if(typeof accGet==='function'&&accGet())return;if(!$('#modal').hidden||Q.length)return;
  localStorage.setItem('byline-ios76','1');const acc=typeof accOn==='function'&&accOn();
  openModal('저장을 지키는 법 (아이폰·아이패드)',`<p class="lede">Safari는 이 사이트를 <b>7일 넘게 열지 않으면</b> 기기에 남은 저장을 지울 수 있다.</p><ul class="feed"><li class="g">${acc?'<b>로그인</b>하면 석 달마다 클라우드에 저절로 올라간다 — 지워져도 되살릴 수 있다':'<b>저장 파일 내보내기</b>로 파일을 받아 두면 언제든 되살릴 수 있다'}</li><li class="g">공유 버튼 → <b>홈 화면에 추가</b>로 열면 앱처럼 따로 저장돼 더 오래 남는다</li></ul>`,
   [...(acc?[{label:'계정 열기',fn:()=>{accMenu();return false;}}]:[{label:'저장 파일 내보내기',fn:()=>{saveMenu();return false;}}]),{label:'알겠다',cls:'ghost'}]);}catch(e){}}

// ---- 가입: 만 14세 이상 확인 + 개인정보처리방침 동의 ----
const PRIV_URL76='privacy.html';
{const _om74=openModal;openModal=function(t,b,c){try{if(t==='계정 · 로그인'&&typeof b==='string'&&b.includes('<p id="accw"')){b=b.replace('<p id="accw"',`<label class="ag76"><input type="checkbox" id="accag"><span><b>가입할 때 필수</b> — 만 14세 이상이며, <a href="${PRIV_URL76}" target="_blank" rel="noopener">개인정보처리방침</a>(아이디·닉네임·게임 저장을 보관하고, 계정을 지우면 바로 없앤다)에 동의한다</span></label><p id="accw"`);}}catch(e){}return _om74.call(this,t,b,c);};}
{const _ad74=accDo;accDo=async function(a){if(a==='register'){const c=document.getElementById('accag');if(!c||!c.checked){accErr('가입하려면 만 14세 이상 확인과 개인정보처리방침 동의에 체크하자');return;}}return _ad74.apply(this,arguments);};}

// ---- 만든 사람들 · 라이선스 · 개인정보처리방침 ----
function credits76(){const web=!inArtifact();
  openModal('만든 사람들 · 라이선스',`<div class="cr76"><p class="lede">바이라인 — 기자 커리어 시뮬레이션 · ${esc(VERSION)}</p><dl>
<dt>그림</dt><dd>AI 이미지 생성(ChatGPT)으로 만들고 게임에 맞게 다듬었다</dd>
<dt>음악</dt><dd>AI 음악 생성(Suno)으로 만든 8곡</dd>
<dt>글꼴</dt><dd>메이플스토리체 ⓒ NEXON Korea (무료 글꼴 · 저작권은 넥슨코리아에 있다)<br>Do Hyeon · Black Han Sans · Noto Sans KR — SIL Open Font License 1.1 (Google Fonts)</dd>
<dt>등장 이름</dt><dd>게임 속 언론사·기업·기관·인물은 모두 지어낸 것이다. 실제와 닮았다면 우연이다</dd></dl>
${web?`<p><a href="${PRIV_URL76}" target="_blank" rel="noopener">개인정보처리방침</a></p>`:''}</div>`,[{label:'닫기',cls:'ghost'}]);}
{const _om74g=openModal;openModal=function(t,b,c){try{if(t==='메뉴'&&Array.isArray(c)){const i=c.findIndex(x=>/타이틀로/.test(String(x&&x.label)));c=c.slice();c.splice(i>=0?i:c.length,0,{label:'📜 만든 사람들 · 개인정보',fn:()=>{credits76();return false;}});}}catch(e){}return _om74g.call(this,t,b,c);};}
// 첫 화면 아래 작은 링크
function foot76(){try{if(!S||S.phase!=='title')return;const app=document.getElementById('app');if(!app||app.querySelector('.ft76'))return;const web=!inArtifact();
  const f=document.createElement('p');f.className='ft76';f.innerHTML=`${web?`<a href="${PRIV_URL76}" target="_blank" rel="noopener">개인정보처리방침</a>·`:''}<a data-cr76>만든 사람들 · 라이선스</a>`;app.appendChild(f);f.querySelector('[data-cr76]').onclick=ev=>{ev.preventDefault();credits76();};}catch(e){}}
{const _rd74=render;render=function(){const r=_rd74.apply(this,arguments);try{foot76();svBar76();if(S&&S.phase==='game'){persist76();setTimeout(iosTip76,900);}}catch(e){}return r;};}
