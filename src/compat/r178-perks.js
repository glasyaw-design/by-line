// 1.78 · 특기 해금 · 능력치 쏠림 완화
// 예전 파일 v78.js를 순서 그대로 이어 붙였다

// ───── (예전 v78.js) ─────
/* 바이라인 — src/compat/v78.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.78 특기 해금: 능력치가 50·65·80에 닿을 때마다 특기를 하나 고른다 · 취재력 쏠림 완화 =====
// 능력치마다 특기 4개. 50에서 둘 중 하나, 65에서 새 특기와 고르지 않은 것 중 하나, 80에서 마지막 특기와 남은 것 중 하나.
// 기록: S.pk78 = {own:{능력치:[특기 id...]}, t:{특기 id:얻은 turn}}. 창간(발행인)은 새 특기를 얻지 않는다(얻은 것은 그대로).
const PK_T=[50,65,80];
const PK={
 inv:[['inv_a','현장 감','취재로 건지는 아이템의 질 +6%',{item:.06}],['inv_b','끈질긴 발품','일할 때 컨디션 소모 -8%',{hp:.08}],['inv_c','촉','매달 제보가 들어올 확률 +6%',{tip:.06}],['inv_d','특종 사냥꾼','새 아이템이 단독일 확률 +5%',{excl:.05}]],
 ver:[['ver_a','두 번 확인','오보·실수로 신뢰가 깎일 때 -15%',{neg:{trust:.15}}],['ver_b','냉정한 눈','평가가 깎일 때 -10%',{neg:{eval:.1}}],['ver_c','교차 검증','검증력·데이터 성장 +15%',{g:{ver:.15,dat:.15}}],['ver_d','무결점','신뢰가 깎일 때 -25%',{neg:{trust:.25}}]],
 int:[['int_a','말문 트기','새 취재원이 처음부터 더 믿어 준다 (+4)',{src:4}],['int_b','경청','동료와의 관계가 10% 더 빨리 오른다',{rel:.1}],['int_c','한마디 따기','아이템의 질 +5%',{item:.05}],['int_d','단골 취재원','새 취재원 +6 · 기관 관계 +10%',{src:6,net:.1}]],
 dat:[['dat_a','표 읽기','아이템의 질 +4%',{item:.04}],['dat_b','정보공개청구','매달 제보 확률 +4%',{tip:.04}],['dat_c','숫자 감각','평가가 오를 때 +5%',{pos:{eval:.05}}],['dat_d','데이터 저널리스트','아이템의 질 +8%',{item:.08}]],
 wri:[['wri_a','매끈한 문장','평가가 오를 때 +5%',{pos:{eval:.05}}],['wri_b','빠른 손','컨디션 소모 -6%',{hp:.06}],['wri_c','울림','평판이 오를 때 +8%',{pos:{fame:.08}}],['wri_d','명문장','평판 +12% · 평가 +5% (오를 때)',{pos:{fame:.12,eval:.05}}]],
 hed:[['hed_a','낚지 않는 제목','신뢰가 오를 때 +6%',{pos:{trust:.06}}],['hed_b','클릭 감각','평판이 오를 때 +6%',{pos:{fame:.06}}],['hed_c','1면 감각','평가가 오를 때 +6%',{pos:{eval:.06}}],['hed_d','헤드라인 장인','평판이 오를 때 +10%',{pos:{fame:.1}}]],
 spd:[['spd_a','마감 체질','컨디션 소모 -6%',{hp:.06}],['spd_b','속보 반사신경','매달 제보 확률 +5%',{tip:.05}],['spd_c','한발 앞서','새 아이템이 단독일 확률 +4%',{excl:.04}],['spd_d','번개','한 달 행동력 +1',{ap:1}]],
 kno:[['kno_a','걸어 다니는 사전','평가가 오를 때 +4%',{pos:{eval:.04}}],['kno_b','맥락 짚기','신뢰가 오를 때 +5%',{pos:{trust:.05}}],['kno_c','행간 읽기','아이템의 질 +5%',{item:.05}],['kno_d','박식','문장력·제목·속도·상식 성장 +10%',{g:{wri:.1,hed:.1,spd:.1,kno:.1}}]],
 net:[['net_a','명함첩','기관과의 관계가 10% 더 빨리 오른다',{net:.1}],['net_b','술자리 정보','매달 제보 확률 +5%',{tip:.05}],['net_c','마당발','새 취재원 +5',{src:5}],['net_d','인맥 왕','기관과의 관계 +20%',{net:.2}]],
 cha:[['cha_a','사람 좋은 기자','동료와의 관계 +10%',{rel:.1}],['cha_b','분위기 메이커','컨디션 소모 -5%',{hp:.05}],['cha_c','믿음 가는 얼굴','신뢰가 깎일 때 -10%',{neg:{trust:.1}}],['cha_d','모두의 선배','동료와의 관계 +20%',{rel:.2}]],
 sal:[['sal_a','부수입','매달 통장 +15만',{pay:15}],['sal_b','광고주 다루기','평판이 깎일 때 -10%',{neg:{fame:.1}}],['sal_c','협상가','매달 통장 +25만',{pay:25}],['sal_d','영업통','평가가 오를 때 +6%',{pos:{eval:.06}}]],
 lead:[['lead_a','든든한 선배','동료와의 관계 +10%',{rel:.1}],['lead_b','지시의 기술','평가가 오를 때 +5%',{pos:{eval:.05}}],['lead_c','팀 장악','컨디션 소모 -5%',{hp:.05}],['lead_d','리더','평가 +8% (오를 때) · 신뢰가 깎일 때 -10%',{pos:{eval:.08},neg:{trust:.1}}]],
 sta:[['sta_a','튼튼한 몸','컨디션 소모 -8%',{hp:.08}],['sta_b','회복력','컨디션이 오를 때 +15%',{pos:{hp:.15}}],['sta_c','야근 체질','컨디션 소모 -10%',{hp:.1}],['sta_d','강철 체력','한 달 행동력 +1',{ap:1}]],
 men:[['men_a','멘탈 갑','평가가 깎일 때 -10%',{neg:{eval:.1}}],['men_b','흔들리지 않는다','신뢰가 깎일 때 -10%',{neg:{trust:.1}}],['men_c','버티기','컨디션 소모 -6%',{hp:.06}],['men_d','평정심','평가·평판·신뢰가 깎일 때 -15%',{neg:{eval:.15,fame:.15,trust:.15}}]],
 lng:[['lng_a','외신 읽기','아이템의 질 +4%',{item:.04}],['lng_b','번역 부업','매달 통장 +20만',{pay:20}],['lng_c','해외 취재원','새 취재원 +4',{src:4}],['lng_d','국제통','평판이 오를 때 +10%',{pos:{fame:.1}}]],
 brd:[['brd_a','카메라 체질','평판이 오를 때 +6%',{pos:{fame:.06}}],['brd_b','리포트 감각','평가가 오를 때 +5%',{pos:{eval:.05}}],['brd_c','생방송 강심장','평판이 깎일 때 -10%',{neg:{fame:.1}}],['brd_d','간판 기자','평판이 오를 때 +12%',{pos:{fame:.12}}]]};
const PK_BY={};for(const k in PK)PK[k].forEach(p=>PK_BY[p[0]]=Object.assign({k},{id:p[0],n:p[1],d:p[2],e:p[3]}));
function pkS(){if(!S.pk78||typeof S.pk78!=='object')S.pk78={own:{},t:{}};S.pk78.own=S.pk78.own||{};S.pk78.t=S.pk78.t||{};return S.pk78;}
function pkOwned(){const P=S&&S.pk78;if(!P||!P.own)return [];return Object.values(P.own).flat().map(id=>PK_BY[id]).filter(Boolean);}
// 지금 켜진 특기 효과의 합
let PKE=null,PKV='';
function pkE(){const L=pkOwned();const v=L.map(x=>x.id).join(',');if(PKE&&PKV===v)return PKE;const E={item:0,hp:0,tip:0,excl:0,src:0,rel:0,net:0,pay:0,ap:0,pos:{},neg:{},g:{}};
  L.forEach(p=>{for(const k in p.e){const v2=p.e[k];if(typeof v2==='object'){for(const j in v2)E[k][j]=(E[k][j]||0)+v2[j];}else E[k]+=v2;}});E.hp=Math.min(E.hp,.3);E.item=Math.min(E.item,.2);E.tip=Math.min(E.tip,.15);E.excl=Math.min(E.excl,.1);E.src=Math.min(E.src,12);E.rel=Math.min(E.rel,.35);E.net=Math.min(E.net,.35);E.pay=Math.min(E.pay,45);for(const k in E.pos)E.pos[k]=Math.min(E.pos[k],.3);for(const k in E.neg)E.neg[k]=Math.min(E.neg[k],.35);PKE=E;PKV=v;return E;}
// 어떤 단계가 열려 있나 (고를 수 있는 특기)
function pkPending(){if(!S||S.phase!=='game'||S.founder||S.story)return null;const P=pkS();let best=null;
  for(const k in PK){const v=+(S.st&&S.st[k]||0);const got=(P.own[k]||[]).length;const reach=PK_T.filter(t=>v>=t).length;if(reach>got){const tier=got;if(!best||PK_T[tier]<PK_T[best.tier]||(PK_T[tier]===PK_T[best.tier]&&v>best.v))best={k,tier,v};}}
  return best;}
function pkOffer(k,tier){const own=(pkS().own[k]||[]);const L=PK[k].map(p=>p[0]).filter(id=>!own.includes(id));const ab=L.filter(id=>/_[ab]$/.test(id));
  if(tier===0)return L.filter(id=>/_[ab]$/.test(id)).slice(0,2);if(tier===1)return [L.find(id=>/_c$/.test(id)),...ab].filter(Boolean).slice(0,2);return [L.find(id=>/_d$/.test(id)),...L.filter(id=>!/_d$/.test(id))].filter(Boolean).slice(0,2);}
function pkNext(){if(!S||!S.st)return null;const P=pkS();let best=null;for(const k in PK){const got=(P.own[k]||[]).length;if(got>=3)continue;const t=PK_T[got],v=+(S.st[k]||0);if(v>=t)continue;const gap=t-v;if(!best||gap<best.gap)best={k,t,gap};}return best;}
function pkShow(){const pd=pkPending();if(!pd)return false;const ids=pkOffer(pd.k,pd.tier);if(!ids.length)return false;
  openModal(`특기 해금 · ${STN[pd.k]} ${PK_T[pd.tier]}`,`<p class="lede">${jo2(esc(STN[pd.k]),'이','가')} ${PK_T[pd.tier]}에 닿았다. 몸에 밴 것 하나를 고른다.</p><p class="hint">고른 특기는 이번 판 내내 이어진다. 고르지 않은 쪽은 다음 단계(${PK_T[pd.tier+1]||'—'})에서 다시 고를 수 있다.</p>`,
   [...ids.map(id=>{const p=PK_BY[id];return {label:`◆ ${p.n}`,sub:p.d,fn:()=>{const P=pkS();(P.own[pd.k]=P.own[pd.k]||[]).push(id);P.t[id]=S.turn;PKE=null;log(`특기 — ${p.n} (${STN[pd.k]} ${PK_T[pd.tier]})`);toast(`특기를 얻었다 — ${p.n}`);try{render();}catch(e){}}};}),
    {label:'다음 달에 고르기',cls:'ghost'}]);return true;}
// 달이 끝나면 고를 특기가 있는지 본다 (한 달에 하나)
{const _em78=endMonth;endMonth=function(){const r=_em78.apply(this,arguments);try{if(S&&S.phase==='game'&&pkPending())Q.push(()=>{if(!pkShow())closeModal();});}catch(e){}return r;};}
// ---- 효과 ----
{const _g78=gain;
  // 취재력·문장력 쏠림 완화: 같은 묶음의 다른 능력치보다 8 넘게 앞서면, 오르는 몫의 일부가 그 묶음에서 가장 처진 능력치로 간다
  const SPILL={inv:['ver','int','dat'],ver:['inv','int','dat'],int:['inv','ver','dat'],dat:['inv','ver','int'],wri:['hed','spd','kno'],hed:['wri','spd','kno'],spd:['wri','hed','kno'],kno:['wri','hed','spd']};
  gain=function(k,v){try{if(v>0&&S&&S.st&&S.phase==='game'){const E=pkE();if(E.g[k])v*=1+E.g[k];const O=SPILL[k];
      if(O&&!S.founder){const m=O.reduce((t,j)=>t+(+S.st[j]||0),0)/O.length;const lead=(+S.st[k]||0)-m;if(lead>8){const f=clamp((lead-8)/12,0,1)*.45;const low=O.slice().sort((a,b)=>(S.st[a]||0)-(S.st[b]||0))[0];_g78.call(this,low,v*f*.9);v*=1-f;}}}}catch(e){}
    return _g78.call(this,k,v);};}
{const _ap78=apply;apply=function(o){try{if(o&&typeof o==='object'&&S&&S.phase==='game'){const E=pkE();if(Object.keys(E.pos).length||Object.keys(E.neg).length){o=Object.assign({},o);for(const k of ['eval','fame','trust','hp']){if(typeof o[k]!=='number')continue;if(o[k]>0&&E.pos[k])o[k]*=1+E.pos[k];if(o[k]<0&&E.neg[k])o[k]*=1-Math.min(.5,E.neg[k]);}}}}catch(e){}return _ap78.call(this,o);};}
{const _sp78=spend;spend=function(a,h){try{if(h>0&&S){const E=pkE();if(E.hp)h*=1-E.hp;}}catch(e){}return _sp78.call(this,a,h);};}
{const _mi78=makeItem;makeItem=function(d0,opts){try{if(S&&S.phase==='game'){const E=pkE();if(E.item||E.excl){opts=Object.assign({},opts||{});if(E.item)opts.mult=(opts.mult||1)*(1+E.item);if(E.excl&&!opts.excl&&(S.rank||0)>=1&&!S.story&&chance(E.excl))opts.excl=true;}}}catch(e){}return _mi78.call(this,d0,opts);};}
{const _as78=addSource;addSource=function(d0,trust){try{const E=pkE();if(E.src&&S&&S.phase==='game')trust=(trust??R(8,18))+E.src;}catch(e){}return _as78.call(this,d0,trust);};}
{const _ru78=relUp;relUp=function(c,v,why){try{if(v>0){const E=pkE();if(E.rel)v*=1+E.rel;}}catch(e){}return _ru78.call(this,c,v,why);};}
{const _nu78=netUp;netUp=function(id,v){try{if(v>0){const E=pkE();if(E.net)v*=1+E.net;}}catch(e){}return _nu78.call(this,id,v);};}
{const _apP78=apParts;apParts=function(){const p=_apP78.apply(this,arguments);try{const E=pkE();if(E.ap&&S&&!S.founder)p.push(['특기',Math.min(2,E.ap)]);}catch(e){}return p;};}
{const _om78p=orgMonth;orgMonth=function(lines){const r=_om78p.apply(this,arguments);try{if(!S||S.phase!=='game'||S.story)return r;const E=pkE();
  if(E.pay){S.money+=E.pay;if(Array.isArray(lines))lines.push({c:'g',t:`특기 덕에 들어온 부수입 +${E.pay}만`});}
  if(E.tip&&S.items&&S.items.length<9&&chance(E.tip)){const it=makeItem(S.dept,{pre:1});S.items.push(it);const t=`특기(제보) — 「${it.title}」 제보가 들어왔다`;if(Array.isArray(lines))lines.push({c:'g',t});log(t);}}catch(e){}return r;};}
// ---- 「나」 탭: 특기 목록 · 다음 특기까지 ----
function pkBoxHTML(){const L=pkOwned();const nx=pkNext();const pd=pkPending();
  return `<div class="pk-box"><div class="pk-hd"><b>특기 ${L.length}개</b>${pd?`<button type="button" class="pk-go">◆ 고를 특기가 있다 — ${esc(STN[pd.k])} ${PK_T[pd.tier]}</button>`:nx?`<span>다음 특기까지 — <b>${esc(STN[nx.k])} ${nx.t}</b> (${nx.gap<1?nx.gap.toFixed(1):nx.gap.toFixed(1)} 남음)</span>`:''}</div>${L.length?`<div class="pk-chips">${L.map(p=>`<span class="pk-chip" title="${esc(p.d)}"><b>◆ ${esc(p.n)}</b><small>${esc(STN[p.k])} · ${esc(p.d)}</small></span>`).join('')}</div>`:'<p class="hint" style="margin:4px 0 0">능력치가 50·65·80에 닿으면 특기를 하나씩 고른다.</p>'}</div>`;}
function pkTab(){try{if(!S||S.phase!=='game'||S.founder)return;const a=document.querySelector('.qr-link');if(!a)return;let bx=a.nextElementSibling&&a.nextElementSibling.classList.contains('pk-box')?a.nextElementSibling:null;const h=pkBoxHTML();
  if(!bx){a.insertAdjacentHTML('afterend',h);bx=a.nextElementSibling;}else if(bx.outerHTML!==h){bx.outerHTML=h;bx=a.nextElementSibling;}
  const g=bx&&bx.querySelector('.pk-go');if(g)g.onclick=()=>pkShow();
  // 능력치 칸: 특기 개수 ◆ 표시
  const P=pkS();document.querySelectorAll('.stt[data-stat]').forEach(el=>{const n=(P.own[el.dataset.stat]||[]).length;let m=el.querySelector('.pk-n');if(n){if(!m){m=document.createElement('span');m.className='pk-n';el.appendChild(m);}m.textContent='◆'.repeat(n);}else if(m)m.remove();});}catch(e){}}
{const _rd78=render;render=function(){const r=_rd78.apply(this,arguments);try{pkTab();}catch(e){}return r;};}
// 분기 보고서에 특기 줄
{const _om78q=openModal;openModal=function(t,b,c){try{if(/개인 평가 보고서$/.test(String(t||''))&&typeof b==='string'&&S&&!S.founder){const P=pkS();const t0=S.turn-12;const nw=Object.entries(P.t).filter(([id,tt])=>tt>t0).map(([id])=>PK_BY[id]).filter(Boolean);const nx=pkNext();
    const add=`<p class="qr-h">특기</p><ul class="qr-next">${nw.length?`<li>이번 분기에 얻은 특기 — ${nw.map(p=>`<b>◆ ${esc(p.n)}</b>`).join(' · ')}</li>`:''}<li>지금 특기 ${pkOwned().length}개${nx?` · 다음 특기까지 <b>${esc(STN[nx.k])} ${nx.t}</b> (${nx.gap.toFixed(1)} 남음)`:''}</li></ul>`;
    b=b.replace(/<\/div>\s*$/,add+'</div>');}}catch(e){}return _om78q.call(this,t,b,c);};}
(function(){try{const st=document.createElement('style');st.textContent=`
.pk-box{margin:0 0 10px;padding:10px 12px;border-radius:12px;background:rgba(119,166,255,.07);border:1px solid rgba(119,166,255,.25)}
.pk-hd{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;font-size:14px}.pk-hd span{font-size:13px;opacity:.85}
.pk-go{padding:6px 10px;border-radius:10px;border:1px solid #ffb547;background:rgba(255,181,71,.15);color:#ffb547;font:inherit;font-size:13px;font-weight:700;cursor:pointer;animation:pk78 1.6s ease-in-out infinite}
@keyframes pk78{50%{box-shadow:0 0 0 4px rgba(255,181,71,.18)}}
.pk-chips{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}.pk-chip{display:inline-flex;flex-direction:column;padding:6px 10px;border-radius:10px;background:rgba(255,255,255,.05);font-size:13px;font-weight:700}.pk-chip b{font-weight:700}.pk-chip b{color:#cfe0ff}.pk-chip small{font-weight:400;font-size:11.5px;opacity:.7}
.stt .pk-n{position:absolute;left:8px;top:-7px;font-size:10px;color:#77a6ff;letter-spacing:1px;pointer-events:none}`;document.head.appendChild(st);}catch(e){}})();
