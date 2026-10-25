/* 바이라인 — src/compat/v28.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.4 고르는 화면 정리: 인사권 행사 · 기자 채용 · 여러 명 고르기 =====
function p28Card(face,name,line,chips,sub){return `<span class="p28c">${face||''}<span class="p28t"><b>${name}</b><em>${line}</em><span class="p28k">${chips}</span>${sub?`<small>${sub}</small>`:''}</span></span>`;}
function p28Bar(v,c){v=clamp(Math.round(v),0,99);return `<i class="p28b" style="--v:${v}%;--c:${c||(v>=60?'#5ad49b':v>=45?'#ffb84d':'#ff8a7a')}"><i></i><b>${v}</b></i>`;}
function p28Skin(t){const bx=document.querySelector('#modal .mbx');if(!bx)return;const mb=$('#mb');const L=[...mb.querySelectorAll('label.chk')].filter(l=>l.querySelector('input[type=checkbox]'));
  bx.classList.toggle('pick28',L.length>=3);if(L.length<3)return;bx.classList.remove('p21grid','hasev');bx.querySelectorAll(':scope>.evimg').forEach(x=>x.remove());
  // 긴 설명은 접는다
  const ps=[...mb.querySelectorAll(':scope>p')];if(ps.length>1&&!mb.querySelector('details.p28d')){const d=document.createElement('details');d.className='p28d';d.innerHTML='<summary>자세한 설명</summary>';ps.slice(1).forEach(p=>d.appendChild(p));ps[0].after(d);}
  if(t==='인사권 행사'&&S._pp){L.forEach(l=>{const inp=l.querySelector('input[data-pi]');const m=inp&&S._pp[+inp.dataset.pi];if(!m||l.dataset.p28)return;l.dataset.p28=1;const r=Math.min(3,m.r||0);const due=(m.r||0)<2&&myrs(m)>=[10,15][m.r||0];
    l.querySelector('span').outerHTML=p28Card(npcFace(m,'p28f'),esc(m.name),`${MR[r]} · ${yrsTxt(m)}`,`<i class="p28d1">${DEPTS[m.d]?DEPTS[m.d].n:''}</i>${r>=1?'<i class="p28g">간부</i>':''}${due?'<i class="p28u">승진 연차</i>':''}${p28Bar(m.skill)}`,m.ai?esc(npcLine(m)):'');});}
  if(S.hb&&/수습기자 공채|경력 기자 영입|스타 기자 스카우트/.test(t)){const C=S.hb.c||[];const txt=[...L].map(l=>l.querySelector('small'));L.forEach((l,i)=>{const inp=l.querySelector('input[data-hc]');const c=inp&&C[+inp.dataset.hc];if(!c||l.dataset.p28)return;l.dataset.p28=1;const sm=l.querySelector('small');const est=(sm&&/추정 실력 ([\d~]+)/.exec(sm.textContent)||[])[1]||'?';const flaw=(sm&&/평판 조회: ([^·<]+)/.exec(sm.textContent)||[])[1];const cost=(sm&&/영입 비용 ([^(]+)/.exec(sm.textContent)||[])[1];const will=(sm&&/이적 의사 (\S+)/.exec(sm.textContent)||[])[1];
    const P=nameG(c.name)==='f'?POOL_F:POOL_M;const fk=`pf_${P[hashS2(c.name)%P.length]}_0`;
    l.querySelector('span').outerHTML=p28Card(imgTag(fk,'face p28f'),esc(c.name),`${c.age}세 · ${c.from?esc(c.from.n)+' '+c.yrs+'년 차':esc(c.major)}`,`<i class="p28s">실력 ${est}</i><i class="p28d1">${c.reg?'주재 · '+esc(c.reg):DEPTS[c.d]?DEPTS[c.d].n:''}</i><i class="p28g">「${esc(c.trait)}」</i>${cost?`<i class="p28m">${esc(cost.trim())}</i>`:''}${will?`<i class="p28w">이적 ${esc(will)}</i>`:''}${flaw?`<i class="p28x">흠: ${esc(flaw.trim())}</i>`:''}`,c.from?'':`대표 스펙 ${esc(c.spec||'')}`);});}
  // 선택지: 짧게, 설명은 말풍선
  document.querySelectorAll('#mc .ch:not(.ghost)').forEach(b=>{const cs=b.querySelector('.chips,.cs');if(cs){b.title=cs.textContent;cs.remove();}const im=b.querySelector('.p21ci');if(im)im.remove();});}
{const _om28=openModal;openModal=function(t,b,c){const r=_om28.call(this,t,b,c);try{if(!$('#modal').hidden)p28Skin(t);}catch(e){console.error(e);}return r;};}
// 체크하면 카드에 표시
document.addEventListener('change',e=>{const l=e.target.closest&&e.target.closest('.pick28 label.chk');if(l)l.classList.toggle('on',e.target.checked);},true);
(function(){const st=document.createElement('style');st.textContent=`
#modal .mbx.pick28{max-width:860px!important;width:min(860px,100%)}
#modal .mbx.pick28 #mb{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-rows:max-content;gap:8px;align-content:start}#modal .mbx.pick28 #mb>*{flex:none;min-height:max-content}
#modal .mbx.pick28 #mb>*:not(label.chk){grid-column:1/-1}
#modal .mbx.pick28 #mb>p{margin:0 0 4px;font-size:14.5px}
.p28d summary{cursor:pointer;color:#aab3cc;font-size:13px}.p28d p{font-size:13px;color:#aab3cc;margin:6px 0}
#modal .mbx.pick28 label.chk{height:auto!important;max-height:none!important;display:flex;align-items:center;gap:8px;margin:0;padding:8px 10px;border-radius:14px;border:1.5px solid rgba(120,140,200,.2);background:#151a2c;cursor:pointer;min-width:0}
#modal .mbx.pick28 label.chk.on,#modal .mbx.pick28 label.chk:has(input:checked){border-color:#ffb84d;background:linear-gradient(180deg,rgba(255,184,77,.12),#171c2e);box-shadow:0 0 0 1px #ffb84d inset}
#modal .mbx.pick28 label.chk input{width:20px;height:20px;accent-color:#ffb84d;flex:none}
.p28c{display:flex;align-items:center;gap:10px;min-width:0;flex:1}
.p28c .p28f{width:46px;height:46px;border-radius:50%;flex:none;box-shadow:0 0 0 2px rgba(255,184,77,.35)}
.p28t{display:flex;flex-direction:column;min-width:0;flex:1;gap:2px}
.p28t b{font-size:15.5px;font-family:var(--f-display)}.p28t em{font-style:normal;font-size:12px;color:#aab3cc}
.p28t small{font-size:11.5px;color:#8f99b6;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.p28k{display:flex;flex-wrap:wrap;gap:4px;align-items:center}
.p28k>i{font-style:normal;font-size:11.5px;border-radius:999px;padding:1px 8px;border:1px solid rgba(150,170,230,.35);color:#cfd6ee}
.p28k .p28g{border-color:rgba(185,140,255,.55);color:#d8c4ff}.p28k .p28u{border-color:rgba(90,212,155,.6);color:#7ee8b4}.p28k .p28s{border-color:rgba(255,184,77,.7);color:#ffd27a;font-weight:700}
.p28k .p28m{border-color:rgba(120,166,255,.5);color:#a9c6ff}.p28k .p28w{color:#aab3cc}.p28k .p28x{border-color:rgba(255,111,97,.7);color:#ff9488}
.p28b{display:inline-flex;align-items:center;gap:5px;font-style:normal;min-width:86px}.p28b>i{display:block;width:56px;height:6px;border-radius:6px;background:rgba(255,255,255,.08);position:relative;overflow:hidden}.p28b>i::after{content:"";position:absolute;inset:0;width:var(--v);background:var(--c);border-radius:inherit}.p28b b{font-size:12px;color:#fff}
#modal .mbx.pick28 .help-nav{display:flex;flex-wrap:wrap;gap:6px}
#modal .mbx.pick28 .help-nav button{border-radius:999px;padding:5px 12px;font-size:13px}
#modal .mbx.pick28 .help-nav button .i18{display:none}
#modal .mbx.pick28 .pcount,#modal .mbx.pick28 #gsel{position:sticky;top:0;z-index:3;background:#1a2034;border-radius:10px;padding:6px 10px;margin:0;color:#ffd27a;font-weight:700}
#modal .mbx.pick28 #mc{position:sticky;bottom:0;z-index:4;background:linear-gradient(180deg,rgba(20,24,39,.85),#141827 30%);padding-top:10px;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px}
#modal .mbx.pick28 #mc>.mfoot{grid-column:1/-1}
#modal .mbx.pick28 #mc .ch:not(.ghost){min-height:0!important;padding:11px 44px 11px 14px!important;display:flex!important}
#modal .mbx.pick28 #mc .ch .cl{font-size:15px}
@media (max-width:640px){#modal .mbx.pick28 #mb{grid-template-columns:1fr}#modal .mbx.pick28 #mc{grid-template-columns:1fr 1fr}#modal .mbx.pick28 #mc .ch .cl{font-size:13.5px}#modal .mbx.pick28 #mc .ch:not(.ghost){padding:10px 30px 10px 10px!important}#modal .mbx.pick28 #mc .ch:not(.ghost)::after{width:24px!important;height:24px!important;font-size:15px!important;right:6px!important}}
`;document.head.appendChild(st);})();
// ===== 인건비: 사람마다 다르게 (수습 600만 · 기자 900만 · 10년 차 이상 1,200만 · 스타 1,500만) =====
function hireCost(kind,c){const base=kind==='star'?.15:kind==='new'?.06:(c&&c.yrs>=10)?.12:.09;return base*(S.founder?.075/.09:1)*(S.payLv||1);}
function hireCostD(kind,c){return hireCost(kind,c)-.09*(S.founder?.075/.09:1)*(S.payLv||1);}
{const _p=p28Skin;p28Skin=function(t){_p(t);try{if(S.hb&&/수습기자 공채|경력 기자 영입|스타 기자 스카우트/.test(t)){const C=S.hb.c||[];document.querySelectorAll('#mb label.chk').forEach(l=>{const inp=l.querySelector('input[data-hc]');const c=inp&&C[+inp.dataset.hc];const k=l.querySelector('.p28k');if(c&&k&&!k.querySelector('.p28pay'))k.insertAdjacentHTML('beforeend',`<i class="p28pay">월 인건비 ${eok(hireCost(S.hb.kind,c))}</i>`);});}}catch(e){}};}
(function(){const st=document.createElement('style');st.textContent=`.p28k .p28pay{border-color:rgba(255,111,97,.45);color:#ffb3aa}`;document.head.appendChild(st);})();
// ===== 1.4 월급·생활비 밸런스: 직급이 오를수록 생활비도 늘어난다 (가정·품위 유지비) =====
{const LV=[140,155,190,220,245,265,290,340];living=function(){let pk=1;try{if(S.outlet&&!S.founder){const o=OUT();pk=clamp(.9+.1*payOf(o)/300,.9,1.1);
  // 지방 매체: 집값·물가가 싸다 (작은 지역지일수록 더).
  if(o.type==='local')pk*=(o.p<=2?.72:.8);}}catch(e){}return Math.round(LV[clamp(S.rank|0,0,7)]*pk*Math.pow(1.015,Math.floor(S.turn/YW)));};}