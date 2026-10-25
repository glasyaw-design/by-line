/* 바이라인 — src/compat/v19.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.32 새 화면: GPT 시안 반영 (상단 바 · 큰 장면 · 그림 카드 · 하단 내 카드 · 팝업 · 나 탭 · 엔딩) =====
document.body.classList.add('v19');
const V19_WIDE=()=>matchMedia('(min-width:1280px) and (min-height:640px)').matches;
function v19Prog(){try{const o=OUT();const nx=nextRank(S.rank);
  if(S.rank===0){const m=S.story?Math.round(RANKS[0].min*DF().ten):rookieWeeks();return clamp(S.inRank/m,0,1);}
  if(S.rank===7){if(S.founder){const need=[0,0,55,70,85,100][o.p+1]||100;return clamp((S.fScore||0)/need,0,1);}return clamp(S.inRank/ceoTermW(),0,1);}
  if(nx==null)return 1;const m=promoMinW(S.rank);const pr=[Math.min(1,S.inRank/m),Math.min(1,Math.max(0,S.eval)/promoEv(S.rank)),Math.min(1,Math.max(0,S.fame)/promoFm(S.rank))];try{const L=promoReqs(S.rank);if(L.length)pr.push(L.filter(x=>x.ok).length/L.length);}catch(e){}return clamp(pr.reduce((a,b)=>a+b,0)/pr.length,0,1);}catch(e){return 0;}}
function v19Face(cls){const k=meFaceKey();return IMG[k]?`<img class="${cls||''}" src="${IMG[k]}" alt="내 얼굴" draggable="false">`:'';}
// ---- 상단 바 ----
{const _rh0=renderHud;renderHud=function(){const h=$('#hud');if(!S||S.phase!=='game')return _rh0();try{const o=OUT();const mk='md_'+o.type;const pg=Math.round(v19Prog()*100);const hp=Math.round(S.hp);
  h.innerHTML=`<span class="chip ci h-date">${ic('cal')}<span><b>${dateStr()}</b><small>${years()}년 차 · ${myAge()}세</small></span></span>`+
  `<span class="chip ci h-co" title="${esc(o.n)} · ${TYPES[o.type].n}">${IMG[mk]?`<img src="${IMG[mk]}" alt="">`:ic('bld')}<span><b>${esc(o.n)}</b><small>${TYPES[o.type].n}</small></span></span>`+
  `<span class="chip ci h-me">${v19Face('me18')||ic('user')}<span><b>${deptName()} ${rankName()}</b><i class="hbar" title="다음 직급까지 ${pg}%"><i style="width:${pg}%"></i></i></span></span>`+
  `<span class="chip ci h-hp${hp<30?' low':''}">${ic('heart')}<span>컨디션 <b>${hp}</b><i class="hbar hpb"><i style="width:${hp}%"></i></i></span></span>`+
  `<span class="chip ci h-money">${ic('coins')}<span>통장 ${moneyHud()}</span></span>`+
  `<span class="chip ci h-df">${ic('gauge')}<span>${DF().n}</span></span>`+
  `${S.dev&&devOK()?`<button class="chip dv" data-go="devc">개발자 콘솔</button>`:''}${soundChip()}<button class="chip ci h-menu" data-go="menu" aria-label="메뉴 · 새 게임">${ic('menu')}<span>메뉴</span></button>`;
  bindHud();const im=h.querySelector('.me18');if(im){im.title='누르면 얼굴을 바꾼다 (남·여)';im.style.cursor='pointer';im.onclick=e=>{e.stopPropagation();S.meG=meG()==='m'?'f':'m';render();saveGame();};}}catch(e){console.error(e);_rh0();}};}
// ---- 화면 배치 다시 짜기 (PC 넓은 화면) ----
function v19Layout(){if(!S||S.phase!=='game')return;const app=$('#app');const grid=app&&app.querySelector('.grid');if(!grid)return;const bxa=grid.querySelector('.bx-act');const bb=bxa&&bxa.querySelector('.bb');if(!bb)return;
  // 할 일 카드에 설명은 말풍선으로
  bb.querySelectorAll('.act').forEach(b=>{const d=b.querySelector('.ad');if(d&&!b.title)b.title=d.textContent;});
  // 미션 줄에 그림
  bb.querySelectorAll('.mis .misr').forEach(r=>{if(r.querySelector('.mimg'))return;const id=r.dataset.act||(r.getAttribute('data-act'));let k=id&&IMG['ai_'+id]?'ai_'+id:null;if(!k){const t=r.textContent;const g=/기사|출고/.test(t)?'write':/발제/.test(t)?'pitch':/단독/.test(t)?'invest':/취재원|관계/.test(t)?'source':/데스킹/.test(t)?'desk':/광고|영업/.test(t)?'adsell':/분위기|사기/.test(t)?'deptlife':/미션|평판/.test(t)?'front':null;if(g&&IMG['ai_'+g])k='ai_'+g;}if(k)r.insertAdjacentHTML('beforeend',`<img class="mimg" src="${IMG[k]}" alt="">`);});
  // 내 카드: 얼굴 그림 · 게이지 안 아이콘
  const ava=app.querySelector('.dash .ava');if(ava&&!ava.querySelector('.meface')){const f=v19Face('meface');if(f){ava.classList.add('hasface');ava.insertAdjacentHTML('afterbegin',f);}}
  app.querySelectorAll('.dash .rings>[data-ev]').forEach(d=>{const r=d.querySelector('.ring');const k=EV18[d.dataset.ev];if(r&&k&&IMG[k]&&!r.querySelector('.ri')){r.insertAdjacentHTML('afterbegin',`<img class="ri" src="${IMG[k]}" alt="">`);}});
  if(!V19_WIDE())return;
  const box=document.createElement('section');box.className='box v19acts';box.setAttribute('aria-label','할 일 고르기');
  const kids=[...bb.children];const mv=kids.filter((el,i)=>el.matches('.acat,.acts,details.more:not(.aphelp)')||(el.matches('p.hint')&&kids[i-1]&&kids[i-1].matches('.acts')));
  if(!mv.length)return;mv.forEach(el=>box.appendChild(el));grid.appendChild(box);
  const nr=bb.querySelector('.nextrow');if(nr){const nx=document.createElement('div');nx.className='v19next';nx.appendChild(nr);grid.appendChild(nx);}
  document.body.classList.add('v19w');}
{const _rd19=render;render=function(){document.body.classList.remove('v19w');const r=_rd19.apply(this,arguments);try{v19Layout();}catch(e){console.error(e);}try{v19Me();}catch(e){console.error(e);}try{v19End();}catch(e){console.error(e);}return r;};}
{let t=null,w=V19_WIDE();addEventListener('resize',()=>{clearTimeout(t);t=setTimeout(()=>{const n=V19_WIDE();if(n!==w){w=n;try{if(S&&S.phase==='game')render();}catch(e){}}},180);});}
// ---- 나 탭: 캐릭터 시트 머리 + 능력치 묶음 ----
function v19Me(){if(!S||S.phase!=='game'||S.tab!=='me')return;const tb=document.querySelector('.bx-tab .tb');if(!tb||tb.querySelector('.mehero'))return;
  const o=OUT();const pg=Math.round(v19Prog()*100);const nx=nextRank(S.rank);const bg=IMG['sc_'+(sceneImgKey()||'newsroom')]||IMG.sc_newsroom||'';
  const nxt=S.rank===7?(S.founder?'매체 위상':'사장 임기'):nx==null?'최고 직급':`다음 직급 <b>${rankName(nx)}</b>`;
  tb.insertAdjacentHTML('afterbegin',`<div class="mehero"${bg?` style="--bg:url(${bg})"`:''}><div class="mhf">${v19Face('mhface')}</div><div class="mht"><h3>${esc(S.name)}</h3><b>${deptName()} ${rankName()}</b><span>${IMG['md_'+o.type]?`<img src="${IMG['md_'+o.type]}" alt="">`:''}${esc(o.n)}</span><div class="mhp"><small>${nxt}</small><i class="hbar"><i style="width:${pg}%"></i></i><em>${pg}%</em></div></div></div>`);
  const stg=tb.querySelector('.stg:not(.stg4)');if(stg&&!stg.classList.contains('v19g')){const L=[...tb.querySelectorAll('.stl span')].map(s=>s.textContent);const C=['#77a6ff','#ffb84d','#ff8fb1','#5ad49b','#b98cff'];const wrap=document.createElement('div');wrap.className='stgw';
    STG.forEach(([g,ks],gi)=>{const p=document.createElement('div');p.className='stgp';p.style.setProperty('--gc',C[gi]);p.innerHTML=`<div class="stgh">${esc(L[gi]||g)}</div><div class="stgi"></div>`;const inn=p.querySelector('.stgi');ks.forEach(k=>{const b=stg.querySelector(`.stt[data-stat="${k}"]`);if(b)inn.appendChild(b);});wrap.appendChild(p);});
    stg.replaceWith(wrap);const sl=tb.querySelector('.stl');if(sl)sl.remove();}}
// ---- 엔딩 ----
function v19End(){if(!S||S.phase!=='end')return;const h=document.querySelector('.endhero');if(!h||h.classList.contains('v19e'))return;h.classList.add('v19e');
  const t=document.createElement('div');t.className='endttl';t.innerHTML=`<span class="lau">❦</span><b>${esc(S.endKind||'')}</b><span class="lau r">❦</span>`;const tx=h.querySelector('div');if(tx)tx.prepend(t);
  const kv=document.querySelector('#app .kv');if(kv){kv.classList.add('endkv');const IC={'출고 기사':'ss_front','단독':'ss_excl','수상':'ss_award','오보':'ss_err','업계 평판':'ss_rep','신뢰도':'ss_trust','업적':'ss_scoop'};kv.querySelectorAll(':scope>div').forEach(d=>{const s=d.querySelector('span');const k=s&&IC[s.textContent.trim()];if(k&&IMG[k]&&!d.querySelector('img'))d.insertAdjacentHTML('afterbegin',`<img src="${IMG[k]}" alt="">`);});}}
// ---- 팝업: 그림을 맨 위로, 제목 아래 ----
{const _om19=openModal;openModal=function(t,b,c){const r=_om19.call(this,t,b,c);try{const bx=document.querySelector('#modal .mbx');if(bx){bx.querySelectorAll(':scope>.evimg').forEach(x=>x.remove());const mb=$('#mb');const ev=mb&&mb.firstElementChild&&mb.firstElementChild.classList.contains('evimg')?mb.firstElementChild:null;bx.classList.toggle('hasev',!!ev);if(ev){bx.insertBefore(ev,bx.firstChild);}const ah=mb&&mb.querySelector(':scope>.arch');bx.classList.toggle('hasarch',!!ah);}}catch(e){}return r;};}
(function(){const st=document.createElement('style');st.textContent=`
body.v19{--gold:#ffb84d;--gold2:#ff9a3d;--card:#171c2e;--card2:#1d2338;--edge:rgba(120,140,200,.16)}
/* 상단 바 */
body.v19 #hud{gap:8px}
body.v19 #hud .chip{border-radius:14px;padding:6px 12px;background:linear-gradient(180deg,#1b2136,#151a2b);border:1px solid var(--edge);display:inline-flex;align-items:center;gap:8px;line-height:1.15}
body.v19 #hud .chip small{display:block;font-size:11px;color:var(--mute);font-weight:400}
body.v19 #hud :is(.h-date,.h-co,.h-me)>span>b{display:block;white-space:nowrap}
body.v19 #hud .h-co{padding:3px 12px 3px 3px}
body.v19 #hud .h-co img{width:38px;height:38px;border-radius:10px;object-fit:cover;display:block}
body.v19 #hud .h-me{padding:3px 14px 3px 3px}
body.v19 #hud .h-me .me18{width:40px;height:40px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 2px var(--gold),0 4px 14px rgba(255,184,77,.25)}
body.v19 .hbar{display:block;height:6px;border-radius:9px;background:rgba(255,255,255,.08);overflow:hidden;margin-top:5px;min-width:86px}
body.v19 .hbar>i{display:block;height:100%;border-radius:inherit;background:linear-gradient(90deg,var(--gold2),var(--gold))}
body.v19 .hbar.hpb>i{background:linear-gradient(90deg,#ff6f61,#ffb84d 45%,#5ad49b 75%,#77a6ff)}
body.v19 #hud .h-hp.low{border-color:rgba(255,111,97,.6)}
body.v19 #hud .h-menu{border-radius:50%;padding:0;width:44px;height:44px;justify-content:center}
body.v19 #hud .h-menu span{position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0 0 0 0)}
body.v19 #hud .chip{white-space:nowrap}
body.v19 .rings small .i18{display:none}
/* 장면 */
body.v19 .stage{border-radius:18px;border:1px solid var(--edge);box-shadow:0 18px 44px rgba(0,0,0,.45)}
body.v19 #tick{background:linear-gradient(90deg,rgba(10,13,24,.95),rgba(20,25,42,.9))}
body.v19 #tick b{border-radius:9px;background:#ff5a4f;padding:3px 12px}
/* 할 일 카드: 그림이 주인공 */
body.v19 .acts{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))!important;gap:10px!important}
body.v19 .act.hasic{display:flex!important;flex-direction:column;padding:0!important;overflow:hidden;border-radius:16px!important;position:relative;background:linear-gradient(180deg,#1b2136,#141829)!important;border:1px solid var(--edge)!important;gap:0!important;min-height:0}
body.v19 .act.hasic:not([disabled]):hover{border-color:rgba(255,184,77,.65)!important;transform:translateY(-2px)}
body.v19 .act.hasic .aic,body.v19 .act.hasic .aic:has(.aimg){width:100%!important;height:auto!important;aspect-ratio:1.3/1;border-radius:0!important;display:block;margin:0!important;background:#0f1322!important}
body.v19 .act.hasic .aic .aimg{width:100%;height:100%;object-fit:cover}
body.v19 .act.hasic .aic>svg{width:44%;height:44%;margin:14% auto 0;display:block;color:var(--gc)}
body.v19 .act.hasic .an{padding:8px 10px 2px;text-align:center}
body.v19 .act.hasic .anm{font-family:var(--f-display);font-size:16px;line-height:1.2}
body.v19 .act.hasic .atg{position:absolute;top:7px;right:7px;display:flex;gap:4px;align-items:center;background:rgba(10,13,24,.78);border-radius:999px;padding:3px 7px}
body.v19 .act.hasic .bdgs{position:absolute;top:7px;left:7px;z-index:2}
body.v19 .act.hasic .ad,body.v19 .act.hasic .afx{display:none!important}
body.v19 .act.hasic .why{padding:0 10px 8px;text-align:center;font-size:11.5px}
body.v19 .act.hasic>*:last-child{padding-bottom:9px}
body.v19 .act.rec{box-shadow:0 0 0 2px rgba(255,184,77,.75),0 8px 22px rgba(255,154,61,.22)!important}
/* 미션 */
body.v19 .mis{border-radius:16px;border:1px solid rgba(255,184,77,.32);background:linear-gradient(180deg,rgba(255,184,77,.07),rgba(255,184,77,.02))}
body.v19 .mis .misr{position:relative;align-items:center}
body.v19 .mis .misr:has(.mimg){padding-right:62px}body.v19 .mis .misr .mimg{position:absolute;right:8px;top:50%;transform:translateY(-50%);width:44px;height:32px;border-radius:8px;object-fit:cover;opacity:.9}body.v19 .mis .misr:has(.mimg) em{margin-right:4px}
/* 다음 달로 */
body.v19 .next{border-radius:18px!important;font-size:20px!important;letter-spacing:.02em;background:linear-gradient(135deg,#ffc561,#ff9a3d)!important;box-shadow:0 0 0 1px rgba(255,220,150,.5) inset,0 12px 30px rgba(255,154,61,.35)!important;position:relative;overflow:hidden}
body.v19 .next::after{content:"";position:absolute;left:0;right:0;bottom:0;height:45%;background:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 40' preserveAspectRatio='none'%3E%3Cpath d='M0 40V26h14v-8h10v12h8V14h12v10h10V20h8v-9h6v9h10v8h12V16h14v14h8V8h4V4h4v4h4v22h12V22h10v8h14V18h8v-6h10v6h6v12h16V24h10V12h12v18h8V20h12v10h14V14h6V6h6v8h8v16h10V22h12v8h10V16h14v14h8V24h12v6h12V20h10v20z' fill='%23b4581a' fill-opacity='.35'/%3E%3C/svg%3E") bottom/100% 100% no-repeat;pointer-events:none}
/* 내 카드 · 게이지 */
body.v19 .dash .ava.hasface{background:none!important;overflow:visible;position:relative}
body.v19 .dash .ava.hasface>i{display:none}
body.v19 .dash .ava .meface{width:100%;height:100%;border-radius:50%;object-fit:cover;box-shadow:0 0 0 3px var(--gold),0 8px 22px rgba(255,184,77,.25)}
body.v19 .dash .ava .rbadge{position:absolute;right:-6px;bottom:-6px;width:28px;height:28px}
body.v19 .ring .ri{width:42%;height:42%;object-fit:cover;border-radius:8px;position:absolute;top:16%;left:29%}
body.v19 .ring:has(.ri) b{position:absolute;bottom:14%;font-size:15px}
body.v19 .ring::before{background:var(--card)!important}
/* 팝업 */
body.v19 #modal .mbx{border-radius:22px;border:1px solid var(--edge);background:linear-gradient(180deg,#1a2034,#141827);overflow-x:hidden;overflow-y:auto;overscroll-behavior:contain}
body.v19 #modal .mbx.hasev>.evimg{margin:0;border-radius:0;max-height:none;aspect-ratio:2.2/1;width:100%}
body.v19 #modal .mbx.hasev>.evimg .mkick{left:14px;top:14px;bottom:auto;font-size:14px;padding:5px 13px;border-radius:10px;background:rgba(160,30,30,.92)!important;color:#fff;border:1px solid rgba(255,140,130,.6)}
body.v19 #modal .mt{position:relative;padding-left:32px!important}
body.v19 #modal .mt::before{content:"";position:absolute;left:18px;top:50%;transform:translateY(-50%);height:1.15em;width:4px;border-radius:3px;background:var(--gold)}
body.v19 #modal .mbx.hasarch .mt::before{background:#ff5a4f}
body.v19 #mb .arch{display:flex;justify-content:space-between;align-items:center;gap:8px}
body.v19 #mb .arch span{border:1px solid var(--edge);border-radius:999px;padding:3px 12px;background:#1e2540;font-size:13px}
body.v19 #mc .ch{border-radius:16px;position:relative;padding-right:46px!important;border:1px solid var(--edge);background:linear-gradient(180deg,#1d2338,#171c2e)}
body.v19 #mc .ch:not(.ghost)::after{content:"›";position:absolute;right:12px;top:50%;transform:translateY(-50%);width:26px;height:26px;border-radius:50%;border:1.5px solid rgba(119,166,255,.7);color:#9ec0ff;display:grid;place-items:center;font-size:18px;line-height:1}
body.v19 #mc .ch:not(.ghost):hover,body.v19 #mc .ch:not(.ghost):focus-visible{border-color:var(--gold);box-shadow:0 0 0 1px var(--gold) inset}
body.v19 #mc .ch:not(.ghost):hover::after{border-color:var(--gold);color:var(--gold)}
/* 나 탭 */
body.v19 .mehero{position:relative;display:grid;grid-template-columns:auto minmax(0,1fr);gap:16px;align-items:center;padding:16px;margin:0 0 12px;border-radius:18px;overflow:hidden;border:1px solid var(--edge);background:#141a2c}
body.v19 .mehero::before{content:"";position:absolute;inset:0;background:var(--bg) center/cover;opacity:.42}
body.v19 .mehero::after{content:"";position:absolute;inset:0;background:linear-gradient(90deg,rgba(14,18,32,.55),rgba(14,18,32,.92) 55%)}
body.v19 .mehero>*{position:relative;z-index:1}
body.v19 .mhface{width:96px;height:96px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 3px var(--gold),0 10px 26px rgba(0,0,0,.5);display:block}
body.v19 .mht h3{margin:0;font-family:var(--f-display);font-size:28px;line-height:1.1}
body.v19 .mht>b{display:block;font-size:16px;margin-top:4px}
body.v19 .mht>span{display:flex;align-items:center;gap:6px;color:var(--mute);margin-top:4px;font-size:13.5px}
body.v19 .mht>span img{width:22px;height:22px;border-radius:6px}
body.v19 .mhp{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:2px 10px;align-items:center;margin-top:10px}
body.v19 .mhp small{grid-column:1/-1;color:var(--mute);font-size:12.5px}
body.v19 .mhp .hbar{margin:0;height:8px}
body.v19 .mhp em{font-style:normal;font-size:12.5px;border:1px solid var(--edge);border-radius:999px;padding:1px 9px}
body.v19 .stgw{display:grid;grid-template-columns:repeat(auto-fill,minmax(250px,1fr));gap:10px}
body.v19 .stgp{border:1px solid color-mix(in srgb,var(--gc) 45%,transparent);background:linear-gradient(180deg,color-mix(in srgb,var(--gc) 12%,transparent),transparent);border-radius:16px;padding:10px}
body.v19 .stgh{font-family:var(--f-display);font-size:17px;color:var(--gc);margin:0 0 8px 2px}
body.v19 .stgi{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:7px}
body.v19 .stgp .stt{display:grid!important;grid-template-columns:44px minmax(0,1fr) auto;grid-template-rows:auto auto;column-gap:8px;align-items:center;padding:7px!important;border-radius:12px;background:rgba(12,16,28,.55)!important;border:1px solid var(--edge)!important;text-align:left;min-height:0}
body.v19 .stgp .stt>.i18{position:static!important;grid-row:1/3;width:44px!important;height:44px!important;border-radius:10px;opacity:1}
body.v19 .stgp .stt>span{font-size:13.5px}
body.v19 .stgp .stt>b{font-size:15px;grid-column:3;grid-row:1}
body.v19 .stgp .stt>i{position:static!important;grid-column:2/4;grid-row:2;height:5px!important;border-radius:5px;background:var(--gc)!important;max-width:100%;display:block}
/* 엔딩 */
body.v19 .endhero.v19e{grid-template-columns:minmax(220px,340px) minmax(0,1fr)!important;gap:26px;align-items:start}
body.v19 .endhero.v19e .endimg{aspect-ratio:3/4;border-radius:18px;box-shadow:0 0 0 1px rgba(255,184,77,.35),0 20px 50px rgba(0,0,0,.55)}
body.v19 .endttl{display:flex;align-items:center;justify-content:center;gap:14px;margin:4px 0 6px}
body.v19 .endttl b{font-family:var(--f-display);font-size:clamp(28px,4vw,46px);background:linear-gradient(180deg,#fff1cf,#ffb84d);-webkit-background-clip:text;background-clip:text;color:transparent;text-align:center;line-height:1.15}
body.v19 .endttl .lau{color:#c99a45;font-size:30px}.endttl .lau.r{transform:scaleX(-1)}
body.v19 .endhero.v19e h1{text-align:center;font-size:clamp(20px,2.6vw,28px)!important;display:table;margin:6px auto 12px;padding:6px 22px;border-radius:999px;border:1px solid rgba(255,184,77,.55);background:radial-gradient(circle at 50% 0,rgba(255,184,77,.25),rgba(255,184,77,.05));color:#ffe0a3}
body.v19 .kv.endkv{grid-template-columns:repeat(auto-fill,minmax(140px,1fr))}
body.v19 .kv.endkv>div{display:grid;grid-template-columns:auto 1fr;grid-template-rows:auto auto;column-gap:8px;align-items:center;border-radius:14px;border:1px solid var(--edge);background:#161b2c;padding:9px 10px}
body.v19 .kv.endkv>div img{grid-row:1/3;width:34px;height:34px;border-radius:9px}
body.v19 .kv.endkv>div b{font-size:22px}
@media (max-width:760px){body.v19 .endhero.v19e{grid-template-columns:1fr!important}body.v19 .endhero.v19e .endimg{max-height:420px;width:auto;margin:0 auto;display:block}}
/* ===== PC 넓은 화면: 장면 띠를 가로 전체, 아래 줄에 내 카드와 다음 달 ===== */
@media (min-width:1280px) and (min-height:640px){
 body.v19.v19w:has(.dash) .wrap{grid-template-columns:minmax(300px,.82fr) minmax(0,1.3fr) minmax(360px,1fr);grid-template-rows:auto auto minmax(0,1fr) auto;grid-template-areas:"mast mast mast" "stage stage stage" "act acts tabs" "dash dash next";gap:12px}
 body.v19.v19w:has(.dash) #scene,body.v19.v19w:has(.dash) .scw{height:clamp(120px,21vh,230px)!important;max-height:none!important;aspect-ratio:auto!important;width:100%}
 body.v19.v19w .v19acts{grid-area:acts;min-height:0;overflow:auto;padding:12px;scrollbar-width:thin;border-radius:18px;border:1px solid var(--edge);background:linear-gradient(180deg,#171c2e,#131726)}
 body.v19.v19w .v19acts .acat{margin-bottom:10px}
 body.v19.v19w .v19acts .acts{grid-template-columns:repeat(3,minmax(0,1fr))!important}
 body.v19.v19w .v19next{grid-area:next;display:flex;align-items:stretch}
 body.v19.v19w .v19next .nextrow{flex:1;align-items:stretch}
 body.v19.v19w .v19next .next{margin:0;position:relative!important;height:100%;min-height:76px;font-size:24px!important}
 body.v19.v19w .v19next .autob{margin:0;border-radius:18px;min-width:84px}
 body.v19.v19w .dash{grid-template-columns:minmax(0,1.15fr) minmax(0,1fr)!important;overflow:visible!important;gap:12px!important}
 body.v19.v19w .dash>.dcard:first-child{grid-column:auto!important}
 body.v19.v19w .dash>.dcard:nth-child(3),body.v19.v19w .dash .nudge{display:none}
 body.v19.v19w .dash .dcard{border-radius:18px;border:1px solid var(--edge);background:linear-gradient(180deg,#1a2034,#141827);padding:12px 14px}
 body.v19.v19w .dash .dcard:first-child{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:14px;align-items:center}
 body.v19.v19w .dash .dcard:first-child .reqs{display:none}
 body.v19.v19w .dash .ava{width:74px;height:74px}
 body.v19.v19w .dash .who p+p{display:none}
 body.v19.v19w .dash .who h2{font-size:20px}
 body.v19.v19w .dash .rings .ring{max-width:72px}
 body.v19.v19w .bx-act .bb>.acat{display:none}
}
@media (min-width:601px) and (max-width:1279px),(min-width:1280px) and (max-height:639px){body.v19 #scene,body.v19 .scw{height:clamp(130px,24vh,250px)!important;max-height:none!important;aspect-ratio:auto!important;width:100%}}
/* ===== 휴대폰 ===== */
@media (max-width:600px){
 body.v19 .mast .brand small{display:none}
 body.v19.mvon .mast{flex-direction:row!important;align-items:center}
 body.v19.mvon .mast .brand{font-size:0;flex:none}
 body.v19.mvon .mast .brand i{margin:0}
 body.v19 #hud .h-date svg{display:none}
 body.v19 #hud .h-date small,body.v19 #hud .h-co,body.v19 #hud .h-df,body.v19 #hud .h-me>span{display:none}
 body.v19 #hud .h-me{padding:2px;border-radius:50%}
 body.v19 #hud{gap:6px}body.v19 #hud .chip{padding:5px 9px}body.v19 #hud .hbar{min-width:54px}body.v19 #hud .h-money>span{font-size:0}body.v19 #hud .h-money b{font-size:13px}body.v19 #hud .h-money b::after{content:'만';font-weight:400}body.v19 #hud .h-hp>span{font-size:0}body.v19 #hud .h-hp b{font-size:13px}
 body.v19.mv-act .stage{display:block!important;border-radius:16px}
 body.v19.mv-act .stage #cap,body.v19.mv-act .stage #tick{display:none}
 body.v19.mv-act #scene{max-height:none;height:118px}
 body.v19 .acts{grid-template-columns:repeat(2,minmax(0,1fr))!important}
 body.v19 .act.hasic .aic,body.v19 .act.hasic .aic:has(.aimg){aspect-ratio:1.75/1}
 body.v19 .act.hasic .an{position:absolute;left:0;right:0;bottom:0;padding:22px 10px 8px;text-align:left;background:linear-gradient(0deg,rgba(9,11,20,.95),rgba(9,11,20,.6) 60%,transparent)}
 body.v19 .act.hasic .anm{font-size:15.5px;text-shadow:0 1px 3px #000}
 body.v19 .act.hasic .why{display:none}
 body.v19 .mis .misr .mimg{display:none}
 body.v19 .stgi{grid-template-columns:1fr 1fr}
 body.v19 .mhface{width:78px;height:78px}
}`;document.head.appendChild(st);})();
// ---- 좁은 화면에서도 글자가 잘리지 않게 ----
(function(){const st=document.createElement('style');st.textContent=`
body.v19{word-break:keep-all;overflow-wrap:anywhere}
body.v19 #hud{flex-wrap:wrap!important;overflow:visible!important;justify-content:flex-end;row-gap:6px}
body.v19 #hud .chip{flex:0 0 auto;max-width:100%}
body.v19 .mish{flex-wrap:wrap!important;row-gap:2px}
body.v19 .mish>b{white-space:nowrap}
body.v19 .mish>span{margin-left:auto;font-size:12px}
body.v19 .dash h2{line-height:1.2}
/* PC 1280~1599: 상단 바를 한 줄로 */
@media (min-width:1280px) and (max-width:1599px){
 body.v19 .mast .brand small,body.v19 #hud .h-df,body.v19 #hud .h-date small,body.v19 #hud .h-co small{display:none}
 body.v19 #hud{flex-wrap:nowrap!important}
 body.v19 #hud .chip{padding:5px 9px}
 body.v19 #hud .snd{font-size:0;width:40px;justify-content:center}body.v19 #hud .snd::first-letter{font-size:15px}
 body.v19.v19w:has(.dash) .wrap{grid-template-columns:minmax(300px,.9fr) minmax(0,1.25fr) minmax(330px,.95fr)!important}
 body.v19.v19w .v19acts .acts{grid-template-columns:repeat(auto-fill,minmax(130px,1fr))!important}
 body.v19.v19w .dash .dcard:first-child{grid-template-columns:minmax(0,1.3fr) minmax(0,1fr)}
 body.v19.v19w .dash .who h2{font-size:18px}
}
/* 태블릿 601~1279: 상단 바를 여러 줄로 */
@media (min-width:601px) and (max-width:1279px){
 body.v19 .mast{flex-wrap:wrap}
 body.v19 #hud{justify-content:flex-start;width:100%}
 body.v19 .dash{grid-template-columns:repeat(auto-fit,minmax(260px,1fr))}
}
/* 휴대폰: 상단 바는 필요한 것만, 두 줄까지 */
@media (max-width:600px){
 body.v19 #hud{justify-content:flex-start;gap:5px!important}
 body.v19 #hud .snd{font-size:0;padding:0;width:34px;height:34px;justify-content:center;border-radius:50%}body.v19 #hud .snd::first-letter{font-size:15px}
 body.v19 #hud .h-menu{width:34px;height:34px}
 body.v19 #hud .h-date b{font-size:12.5px}
 body.v19 #hud .h-me .me18{width:32px;height:32px}
 body.v19 .acat{flex-wrap:wrap!important;overflow:visible!important}
 body.v19 .achip{padding:5px 9px;font-size:13px}
 body.v19 .mis .misr small{white-space:normal!important;text-overflow:clip!important;overflow:visible!important}
 body.v19 .bh h3{font-size:17px}
}
@media (max-width:360px){
 body.v19 #hud .hbar{display:none}
 body.v19 .acts{grid-template-columns:1fr 1fr!important;gap:7px!important}
 body.v19 .act.hasic .anm{font-size:14px}
}`;document.head.appendChild(st);})();