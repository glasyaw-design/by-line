/* 바이라인 1.6 — src/compat/v40.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.42 간결한 화면 (기본) =====
// 1.4에서 선택지·팝업 머리·할 일 카드에 그림을 넣었더니, 휴대폰에선 선택지가 커져 성공 확률·설명이 가려지고 한 화면에 몇 개 안 보였다.
// 이제 기본은 그림 없는 간결한 화면. 설정에서 「그림 많은 화면」으로 바꿀 수 있다 (사람 얼굴·매체 그림·대화 얼굴은 그대로).
function picsOn(){try{return localStorage.getItem('byline-pics')==='1';}catch(e){return false;}}
function picsApply(){try{document.body.classList.toggle('cmp42',!picsOn());}catch(e){}}
function picsSet(v){try{localStorage.setItem('byline-pics',v?'1':'0');}catch(e){}picsApply();toast(v?'그림 많은 화면으로 바꿨다':'간결한 화면으로 바꿨다');}
picsApply();document.addEventListener('DOMContentLoaded',picsApply);
{const _r40=render;render=function(){const r=_r40.apply(this,arguments);try{if(document.body.classList.contains('cmp42')===picsOn())picsApply();}catch(e){}return r;};}
(function(){const st=document.createElement('style');st.textContent=`
body.cmp42 #mc .ch .p21ci,body.cmp42 #modal .mt .p21b,body.cmp42 #modal .mbx.p21.hasev .mt{margin-top:0!important;text-shadow:none!important}body.cmp42 #mc .ch .p21ci{display:none!important}.ap42{display:none}body.cmp42 .act .afx .ap42{display:inline-block!important;order:-1;font-size:11.5px;font-weight:700;padding:1px 7px;border-radius:999px;background:rgba(255,184,77,.14);color:var(--sodium);white-space:nowrap}body.cmp42 .act .afx .ap42.hi{background:rgba(255,111,97,.16);color:#ff8a7a}body.cmp42 #mb .rdiff .rd img,body.cmp42 .i18.xs,body.cmp42 .stt>.i18,body.cmp42 .er18,body.cmp42 .ev18,body.cmp42 .mis .misr .mimg{display:none!important}
body.cmp42 #mc .ch:has(.p21ci){display:flex!important;flex-direction:column;min-height:0!important;padding:9px 40px 9px 13px!important}
body.cmp42 #mc .ch{min-height:46px!important;padding:9px 40px 9px 13px!important;border-radius:12px!important;gap:3px}
body.cmp42 #mc .ch.ghost{padding:9px 13px!important}
body.cmp42 #mc .ch .cl{font-size:15px!important;line-height:1.35!important}
body.cmp42 #mc .ch:not(.ghost)::after{width:24px!important;height:24px!important;font-size:16px!important;right:10px!important;border-width:1.5px!important}
body.cmp42 #mc .ch .chips{margin-top:2px;gap:4px;display:flex;flex-wrap:wrap}
body.cmp42 #mc .ch .chips .cp{font-size:12px!important;padding:1px 7px!important;white-space:normal}
body.cmp42 #mc .ch .chips .cp.pct{font-weight:700;order:-1}
body.cmp42 #mc .ch.p21ok{padding:11px!important;min-height:0!important}
body.cmp42 #modal .choices{max-height:62dvh!important;padding-top:6px}
body.cmp42 #mc{gap:6px!important}
body.cmp42 #modal .mbx.p21plain .mt{background:var(--panel)!important;min-height:0!important;padding-top:12px!important;padding-bottom:10px!important}
body.cmp42 #modal .mbx.p21plain .mt::after{display:none!important}
body.cmp42 #mb .rdiff{padding:6px 9px!important;gap:5px!important;margin:6px 0!important}
body.cmp42 #mb .rdiff .rd{padding:2px 9px!important;font-size:12.5px!important}
body.cmp42 .mbx.p21grid #mc .ch:not(.ghost){padding:9px!important}
body.cmp42 #modal .mbx.mn26 #mc .ch .p21ci{display:none!important}
body.cmp42 #modal .mbx.mn26 #mc .ch:not(.mncont):not(.mnout){padding:12px!important}
body.cmp42 .act.hasic .aic:has(.aimg){display:none!important}
body.cmp42 .act.hasic{display:flex!important;flex-direction:column!important;align-items:flex-start!important;justify-content:flex-start!important;gap:3px!important;padding:10px 12px!important;min-height:76px!important;height:auto!important;aspect-ratio:auto!important;text-align:left!important;overflow:hidden!important;background:linear-gradient(180deg,#1d2338,#171c2e)!important}
body.cmp42 .act.hasic>*{position:static!important;transform:none!important;inset:auto!important;width:auto!important;max-width:100%!important;margin:0!important}
body.cmp42 .act.hasic .bdgs{display:flex!important;gap:4px;order:-1}body.cmp42 .act.hasic .bdgs:empty{display:none!important}
body.cmp42 .act.hasic .an,body.cmp42 .act.hasic .anm{font-size:15px!important;font-weight:700!important;line-height:1.3!important;color:var(--fg)!important;text-shadow:none!important;background:none!important;padding:0!important;white-space:normal!important}
body.cmp42 .act.hasic .ad{display:-webkit-box!important;-webkit-line-clamp:2!important;-webkit-box-orient:vertical!important;overflow:hidden!important;max-height:2.8em!important;padding:0!important;font-size:12px!important;line-height:1.4!important;color:var(--mute)!important;opacity:1!important}
body.cmp42 .act.hasic .afx{display:flex!important;flex-wrap:wrap;gap:4px;font-size:11.5px!important}
body.cmp42 .act.hasic .atg{display:none!important}
body.cmp42 .act.hasic[disabled]{opacity:.5}
body.cmp42 .co26{min-height:0!important;padding:10px 12px!important;background:var(--panel2)!important}
body.cmp42 .co26::before,body.cmp42 .co26::after{display:none!important}
`;document.head.appendChild(st);})();
(function(){const st=document.createElement('style');st.textContent=`body.cmp42 .mbx:not(.p21grid):not(.mn26):not(.pick28) #mc .ch:not(.p21ok){align-items:flex-start!important;text-align:left!important}body.cmp42 .mbx:not(.p21grid):not(.mn26) #mc .ch:not(.p21ok) .cl{justify-content:flex-start!important;text-align:left!important}`;document.head.appendChild(st);})();
// 성공 확률은 선택지 이름 줄 오른쪽에 바로 · 취재 중엔 쓸 수 있는 기법이 먼저, 막힌 기법은 아래로
{const _om40=openModal;openModal=function(t,b,c){try{if(String(t)==='취재 중'&&Array.isArray(c)&&!picsOn()){const head=c.slice(0,1),rest=c.slice(1);const g=x=>x.cls&&/ghost/.test(x.cls)?3:x.disabled?2:/성공/.test(x.sub||'')?0:1;c=head.concat(rest.map((x,i)=>[x,i]).sort((a,b)=>g(a[0])-g(b[0])||a[1]-b[1]).map(x=>x[0]));}}catch(e){}
  const r=_om40.call(this,t,b,c);try{if(document.body.classList.contains('cmp42'))document.querySelectorAll('#mc .ch').forEach(ch=>{const p=ch.querySelector('.chips .cp.pct');const cl=ch.querySelector('.cl');if(p&&cl&&!cl.querySelector('.pct42')&&/^성공 \d+%$/.test(p.textContent.trim())){cl.insertAdjacentHTML('beforeend',` <b class="pct42">${p.textContent.trim()}</b>`);p.remove();}});}catch(e){}return r;};}
(function(){const st=document.createElement('style');st.textContent=`body.cmp42 #mc .ch .cl .pct42{display:inline-block;margin-left:6px;padding:1px 8px;border-radius:999px;background:rgba(119,166,255,.18);color:#a9c6ff;font-size:12.5px;font-weight:700;white-space:nowrap;vertical-align:1px}
body.cmp42 #mc .ch{padding:7px 38px 7px 12px!important;min-height:44px!important}body.cmp42 #mc .ch .chips:empty{display:none}`;document.head.appendChild(st);})();
// 능력치 이름은 줄이지 않는다 (휴대폰에서 「취…」처럼 잘리던 문제)
(function(){const st=document.createElement('style');st.textContent=`
body.v19 .stgp .stt>span,body .stgp .stt>span{white-space:normal!important;overflow:visible!important;text-overflow:clip!important;word-break:keep-all!important;line-height:1.25!important;min-width:0}
body.cmp42.v19 .stgp .stt{grid-template-columns:minmax(0,1fr) auto!important;column-gap:6px!important}
body.cmp42.v19 .stgp .stt>span{font-size:13px!important}
body.cmp42.v19 .stgp .stt>:not(span):not(b):not(.i18){grid-column:1/-1!important}
@media (max-width:380px){body.v19 .stgp .stt>span{font-size:12.5px!important}body.v19 .stgp .stt>b{font-size:13.5px!important}}`;document.head.appendChild(st);})();
// 조사: 「서울로」「일곱 명으로」처럼 ㄹ받침·숫자도 맞게
jo2=function(w,a,b){const s=String(w==null?'':w);const c=s.trim().slice(-1);const k=c.charCodeAt(0);const ro=a==='으로';
  if(k>=44032&&k<=55203){const f=(k-44032)%28;if(!f)return s+b;if(ro&&f===8)return s+b;return s+a;}
  if(/[0-9]/.test(c)){const nb='2459'.includes(c);if(ro&&'178'.includes(c))return s+b;return s+(nb?b:a);}
  if(/[a-zA-Z]/.test(c))return s+(/[lmnr]$/i.test(c)&&!ro?a:b);return s+b;};
// 밸런스: 작은 매체 간부는 월급이 생활비에 거의 다 들어가던 문제 → 생활비는 월급의 85%를 넘지 않는다 (생활 수준은 버는 만큼)
{const _lv40=living;living=function(){const v=_lv40.apply(this,arguments);try{if(S&&!S.founder&&S.outlet&&S.phase==='game'){const p=payOf(OUT());if(p>0)return Math.min(v,Math.round(p*.85));}}catch(e){}return v;};}
// 밸런스: 간편 모드 + 쉬움 + 작은 회사가 겹치면 차장→부장이 석 달 만에 되던 문제 → 승진 연차 배율은 0.5 밑으로 안 내려가고, 직급마다 최소 반년
promoMinW=function(r){const k=Math.max(.5,DF().ten*orgK().ten*(S&&S.simple?.75:1));const w=Math.round(rankMin(r)*k);return r>=1?Math.max(24,w):w;};
// 휴대폰: 맨 위 정보줄을 한 줄로 (로고 숨김 · 칩 촘촘히 · 큰 돈은 억 단위)
function moneyHud(){const v=Math.round(S.money||0);if(Math.abs(v)>=10000)return `<b class="eok42">${(v/10000).toFixed(Math.abs(v)>=1000000?0:1)}</b>억`;return `<b>${v.toLocaleString('ko-KR')}</b>만`;}
(function(){const st=document.createElement('style');st.textContent=`
@media (max-width:480px){
 header.mast .brand{display:none!important}
 header.mast #hud{flex-wrap:nowrap!important;gap:4px!important;width:100%!important;max-width:100%!important;left:auto!important;margin:0!important;justify-content:space-between!important;overflow:hidden}
 header.mast #hud .chip{padding:0 8px!important;height:38px!important;min-height:38px!important;flex:0 1 auto;min-width:0;gap:5px!important;font-size:13px!important}
 header.mast #hud .chip small{display:none!important}
 header.mast #hud .chip .ic{width:15px!important;height:15px!important;flex:none}
 header.mast #hud .chip b{white-space:nowrap}
 header.mast #hud .chip>span{white-space:nowrap;min-width:0}
 header.mast #hud .chip.snd,header.mast #hud .chip.h-menu{width:34px!important;padding:0!important;flex:none;justify-content:center}
 header.mast #hud .chip.h-me{padding:0 2px!important;flex:none}
}
body.v19 #hud .h-money b.eok42::after{content:'억'!important}
@media (max-width:350px){header.mast #hud .chip.h-date .ic,header.mast #hud .chip.h-money .ic{display:none!important}header.mast #hud .chip{padding:0 6px!important}}`;document.head.appendChild(st);})();
// 조직: 실제로 뽑은 수습기자를 센다 (창간 모드에서 수습이 있는데도 0명으로 나오던 문제)
{const _oc40=orgCounts;orgCounts=function(){const rows=_oc40.apply(this,arguments);try{const per=roster();const seen=new Set();let real=0;
  Object.values(per).forEach(L=>L.forEach(m=>{if(m&&m.rk!=null&&!seen.has(m.name)){seen.add(m.name);real++;}}));
  (S.team||[]).forEach(m=>{if(m&&m.rk!=null&&!seen.has(m.name)){seen.add(m.name);real++;}});
  const rj=rows.find(r=>r[0]==='기자'),rt=rows.find(r=>r[0]==='수습기자');if(rj&&rt){const tot=rj[1]+rt[1];const est=S.founder?0:rt[1];const tr=Math.max(real,est);rt[1]=tr;rj[1]=Math.max(0,tot-tr);if(real)rt[2]=`실제 수습 ${real}명 · ${rookieWeeks()/4}개월 뒤 정식 발령`;}}catch(e){console.error(e);}return rows;};}
// 조사: 「제목」 뒤 조사를 제목 끝 글자 받침에 맞춘다 · 바이라인 「기자 기자」 중복 방지
function jp(w,a,b){const s=String(w==null?'':w).replace(/[\s"'”’」)\]]+$/,'');return jo2(s,a,b).slice(s.length);}
function byN(s){return String(s||'').replace(/\s*기자$/,'');}
(function(){const st=document.createElement('style');st.textContent=`.ld{max-width:100vw!important;box-sizing:border-box!important;overflow:hidden}`;document.head.appendChild(st);})();
// ===== 나이 정리: 빠른 시작(3년 차·부장·국장·편집국장)에서 옛 캡·윗선이 나보다 어리거나, 시작부터 정년(60)을 넘긴 동료가 있던 문제 =====
// · 옛 캡은 나보다 9~13년 선배, 윗선(부장·국장·사장)은 3~9년 선배로 맞춘다 (정년 전까지)
// · 동료(캡·선배·사진·편집·노조 등)도 60세가 되면 정년퇴직(관계는 남는다) · 윗선이 정년이면 후임이 온다
{const _cy42=colYrs;colYrs=function(c){const fresh=c&&c.yrs==null;const v=_cy42.apply(this,arguments);try{if(fresh&&c){const me=years();let y=c.yrs;
  if(c.role==='cap')y=Math.max(y,me+R(9,13));if(c.role==='boss')y=Math.max(y,me+R(3,9));if(c.role==='senior')y=Math.max(y,me+R(3,6));
  const cap=c.role==='boss'&&S.rank>=6?37:33;if(['cap','boss','senior'].includes(c.role))y=Math.min(y,cap);c.yrs=y;c.t0=S.turn;return y;}
  // 원래 식은 t0가 0(게임 첫 턴)이면 나이를 안 먹었다 → 첫 턴에 만난 동료도 해마다 한 살씩
  if(c&&c.yrs!=null)return c.yrs+Math.floor((S.turn-(c.t0==null?S.turn:c.t0))/YW);}catch(e){}return v;};}
function ageFixNpc(m,maxA){try{const a=npcAge(m);if(a>=maxA){const d=a-R(maxA-8,maxA-2);if(m.age!=null)m.age-=d;else m.yrs=Math.max(1,(m.yrs||1)-d);}}catch(e){}}
function ageSanitize(){if(!S||S.founder&&!S.cols)return;const me=years();
  (S.cols||[]).forEach(c=>{if(c.ret)return;const y=colYrs(c);
    if(c.role==='cap'&&y<me+6){c.yrs+=Math.min(33,me+R(9,12))-y;}
    if(c.role==='boss'&&!S.founder&&y<me+2){c.yrs+=Math.min(S.rank>=6?37:33,me+R(3,8))-y;}
    if((c.role==='peer'||c.role==='rivalpeer')&&Math.abs(y-me)>2){c.yrs+=me-y;}
    {const lim=(c.role==='boss'&&S.rank>=6?64:59)-26;const y2=colYrs(c);if(y2>lim)c.yrs-=y2-(lim-R(1,4));}});
  (S.team||[]).forEach(m=>ageFixNpc(m,60));(S.mates||[]).forEach(m=>ageFixNpc(m,60));(S.corr||[]).forEach(m=>ageFixNpc(m,60));
  try{if(S.ros&&S.ros.per)Object.values(S.ros.per).forEach(L=>(L||[]).forEach(m=>m&&ageFixNpc(m,60)));}catch(e){}}
{const _qg42=qsGo;qsGo=function(){const r=_qg42.apply(this,arguments);try{ageSanitize();S.age42=1;render();}catch(e){console.error(e);}return r;};}
{const _r42=render;render=function(){try{if(S&&S.phase==='game'&&!S.age42){S.age42=1;ageSanitize();}}catch(e){}return _r42.apply(this,arguments);};}
// 동료의 정년퇴직 · 윗선 교체 (매달 확인)
function colRetire(lines){if(!S||!S.cols||S.story)return;S.cols.forEach((c,i)=>{if(c.ret)return;const a=26+colYrs(c);
   if(c.role==='boss'){if(S.founder)return;const lim=S.rank>=6?65:60;if(a>=lim){const old=c.name,role=colRole(c);const n=mkCol('boss',R(0,12));n.yrs=Math.min(S.rank>=6?37:33,years()+R(3,8));n.t0=S.turn;S.cols[i]=n;lines.push({c:'',t:`${role} ${old} 정년퇴직 — 후임 ${n.name}. 관계를 새로 쌓아야 한다`});log(`${role} 교체: ${old} 정년퇴직 → ${n.name}`);}return;}
   if(['cap','senior','photo','editor','union','mentor','peer','rivalpeer','junior'].includes(c.role)&&a>=60){c.ret=1;lines.push({c:'',t:`${colRole(c)} ${c.name} 정년퇴직 — 연락은 이어진다`});log(`${c.name} 정년퇴직`);}});}
{const _cr42=colRole;colRole=function(c){const r=_cr42.apply(this,arguments);return c&&c.ret?`퇴직 · ${r}`:r;};}
{const _em42=endMonth;endMonth=function(){const r=_em42.apply(this,arguments);try{if(S&&S.phase==='game'){const L=[];colRetire(L);if(L.length){L.forEach(x=>{try{const fd=document.querySelector('#mb .feed');if(fd&&!$('#modal').hidden)fd.insertAdjacentHTML('beforeend',`<li>${esc(x.t)}</li>`);}catch(e){}});}}}catch(e){console.error(e);}return r;};}
// ===== 개발자 콘솔: 그룹 회장 (빠른 시작·직급 선택에 「그룹 회장」) =====
function devChair(){if(S.founder){S.sis=S.sis||[];while(S.sis.length<3){const ks=Object.keys(SIS_T).filter(k=>!S.sis.some(x=>x.k===k));if(!ks.length)break;const k=ks[0],T=SIS_T[k];S.sis.push({k,n:`${OUT().n} ${T.n.replace(/ \(.*\)/,'')}`,lv:1,t0:S.turn,pl:null,pl3:0});}
    S.chair=1;S.chairT=S.turn;S.grpName=S.grpName||`${OUT().n}미디어그룹`;log(`${S.grpName} 출범`);toast(`${S.grpName} 회장 · 계열사 ${S.sis.length}곳`);return;}
  if(!grpOf()){const keep={diff:S.diff};devQuick({rank:7,outlet:'daehan',diff:keep.diff});}
  if(S.rank<7){S.rank=7;S.inRank=0;}const st=seatEnsure();
  S.chair=1;S.chairT=S.turn;S.retExt=Math.max(S.retExt||0,retireAge()+5);setChair({n:S.name,me:1,end:1e9,k:st&&st.chair?st.chair.k:'board'});
  log('그룹 회장 취임');tick(`${MGRP[grpOf()].n} 회장에 ${S.name}`,1);toast(`${MGRP[grpOf()].n} 회장`);}
{const _ds42=devSecHTML;devSecHTML=function(sec){let h=_ds42.apply(this,arguments);try{
  if(sec==='quick')h=h.replace(/(<select id="dqR">[\s\S]*?)(<\/select>)/,'$1<option value="8">그룹 회장</option>$2');
  if(sec==='world')h=h.replace(/(<select id="dvR">[\s\S]*?)(<\/select>)/,`$1<option value="8" ${S.chair?'selected':''}>그룹 회장</option>$2`);}catch(e){}return h;};}
{const _da42=devAct;devAct=function(k,arg){try{
  if(k==='qstart'&&$('#dqR')&&$('#dqR').value==='8'&&$('#dqM').value!=='story'){const m=$('#dqM').value;const cfg={mode:m,diff:$('#dqD').value,outlet:$('#dqO').value,rank:7,yrs:$('#dqY').value,ftype:$('#dqF').value};if(m!=='found'&&!grpOf(cfg.outlet))cfg.outlet='daehan';$('#modal').hidden=true;mTok++;devQuick(cfg);Q.length=0;closeModal();devChair();render();return;}
  if(k==='rank'&&$('#dvR')&&$('#dvR').value==='8'){devRun(()=>devChair());return;}}catch(e){console.error(e);toast('실행 못 함: '+e.message);return;}
  return _da42.apply(this,arguments);};}