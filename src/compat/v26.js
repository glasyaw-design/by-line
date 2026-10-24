/* 바이라인 1.6 — src/compat/v26.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.4 남은 화면: 장면 배너 18 · 언론고시 · 시험 · 기록실 · 메뉴 · 회사 탭 =====
// 장면: 지원·시험 단계는 면접장, 새벽 경찰서
{const _sk=sceneImgKey;sceneImgKey=function(){try{if(S&&(S.phase==='create'||S.phase==='apply')&&IMG.sc_interview)return 'interview';const k=_sk();if(S&&S.phase==='game'&&S.scene==='police'&&S.rank===0&&IMG.sc_police&&!(S.turn%3))return 'police';return k;}catch(e){return _sk();}};}
try{Object.assign(IKN18,{interview:'언론고시 · 면접장',police:'새벽 2시 · 경찰서 라인',exam:'필기시험장'});}catch(e){}
MODAL_SC.unshift([/필기시험|상식 퀴즈/,'ui_exam'],[/서류 전형|면접|합격|불합격|최종 결과/,'sc_interview'],[/기록실/,'ui_hall']);
// 메뉴: 그림 타일
P21_CH.unshift([/저장·불러오기/,'mn_save'],[/도움말/,'mn_help'],[/튜토리얼/,'mn_tut'],[/업데이트 내역/,'mn_patch'],[/^.?\s*설정/,'mn_set'],[/커리어 관리/,'mn_career']);
{const _sk2=p21Skin;p21Skin=function(t){_sk2(t);try{const bx=document.querySelector('#modal .mbx');if(t==='메뉴'&&bx){bx.classList.add('mn26');const f=v19Face('mnface');const p=$('#mb p');if(p&&!$('#mb .mncard'))p.outerHTML=`<div class="mncard"${IMG.sc_newsroom?` style="--bg:url(${IMG.sc_newsroom})"`:''}>${f}<div><b>${esc(S.name)}</b><span>${deptName()} ${rankName()}</span><small>${esc(OUT().n)} · ${years()}년 차</small></div><em>☁ 자동 저장됨</em></div>`;
  document.querySelectorAll('#mc .ch').forEach(b=>{const cl=b.querySelector('.cl');if(cl)cl.innerHTML=cl.innerHTML.replace(/^[^\w가-힣]+\s*/,'');if(/계속하기/.test(b.textContent))b.classList.add('p21ok','mncont');if(/타이틀로/.test(b.textContent))b.classList.add('mnout');});}}catch(e){}};}
// 언론고시 지원: 매체 카드에 건물 그림
{const _ah=applyHTML;applyHTML=function(){let h=_ah();try{h=h.replace(/<button class="oc" data-apply="([^"]+)"/g,(m,id)=>{const o=OUTLETS.find(x=>x.id===id);const k=o&&(IMG['mdw_'+o.type]||IMG['md_'+o.type]);return k?`${m} style="--oimg:url(${k})"`:m;});
  const n=S.apply.length;h=h.replace('<div class="bb">',`<div class="bb"><div class="ap26" style="--bg:url(${IMG.sc_interview||''})"><b>지원할 매체 고르기</b><span>지원 <em>${n}</em>/4</span>${S.apply.map(id=>{const o=OUTLETS.find(x=>x.id===id);return o?`<i>${esc(o.n)}</i>`:'';}).join('')}</div>`);}catch(e){}return h;};}
// 회사 탭: 본사 머리 그림
{const _tb=tabBody;tabBody=function(){let h=_tb();try{if(S.tab==='co'&&IMG.ui_cohq&&S.co){const o=OUT();h=`<div class="co26" style="--bg:url(${IMG.ui_cohq})"><b>${esc(o.n)}</b><span>${'★'.repeat(o.p)}${'☆'.repeat(5-o.p)} · ${TYPES[o.type].n}</span></div>`+h;}}catch(e){}return h;};}
(function(){const st=document.createElement('style');st.textContent=`
#modal .mbx.mn26 #mc{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px}
#modal .mbx.mn26 #mc>.mfoot{grid-column:1/-1}
#modal .mbx.mn26 #mc .ch.mncont{grid-column:1/-1}
#modal .mbx.mn26 #mc .ch.mnout{grid-column:1/-1;background:transparent!important;min-height:0!important;padding:10px!important;justify-content:center}
#modal .mbx.mn26 #mc .ch:not(.mncont):not(.mnout){display:flex!important;flex-direction:column;padding:0 0 10px!important;min-height:0;overflow:hidden;text-align:center}
#modal .mbx.mn26 #mc .ch:not(.mncont):not(.mnout)::after{display:none}
#modal .mbx.mn26 #mc .ch .p21ci{width:100%;height:auto;aspect-ratio:1.3/1;border-radius:0;margin-bottom:8px;box-shadow:none}
#modal .mbx.mn26 #mc .ch .cl{justify-content:center;font-size:15px}
.mncard{position:relative;display:grid;grid-template-columns:76px minmax(0,1fr);gap:12px;align-items:center;border-radius:16px;overflow:hidden;padding:12px;border:1px solid rgba(120,140,200,.25);background:linear-gradient(90deg,rgba(14,17,28,.92),rgba(14,17,28,.55)),var(--bg) center/cover;margin-bottom:6px}
.mncard .mnface{width:76px;height:76px;border-radius:50%;box-shadow:0 0 0 3px #ffb84d}
.mncard b{display:block;font-size:22px;font-family:var(--f-display)}.mncard span{display:block;color:#ffcf7a;font-weight:700}.mncard small{color:#aab3cc}
.mncard em{position:absolute;right:10px;bottom:8px;font-style:normal;font-size:12px;color:#7ee8b4;border:1px solid rgba(90,212,155,.5);border-radius:999px;padding:2px 10px;background:rgba(10,14,24,.7)}
.ap26{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;border-radius:16px;padding:22px 16px 14px;margin:0 0 14px;background:linear-gradient(180deg,rgba(14,17,28,.2),rgba(14,17,28,.92)),var(--bg) center 35%/cover;min-height:110px;align-content:flex-end}
.ap26 b{font-family:var(--f-display);font-size:24px;flex:1 1 100%}.ap26 span{font-size:15px}.ap26 em{font-style:normal;color:#ffb84d;font-size:22px;font-weight:700}
.ap26 i{font-style:normal;border:1px solid rgba(255,184,77,.6);border-radius:999px;padding:3px 12px;background:rgba(14,17,28,.8);font-size:13px}
body.v19 .oc[data-apply]{position:relative;padding-top:0!important;overflow:hidden;border-radius:16px!important}
body.v19 .oc[data-apply]::before{content:"";display:block;margin:0 -12px 10px;height:96px;background:var(--oimg) center/cover;border-bottom:1px solid rgba(120,140,200,.2)}
body.v19 .oc[data-apply][aria-pressed="true"]{border-color:#ffb84d!important;box-shadow:0 0 0 1px #ffb84d inset,0 0 20px rgba(255,184,77,.35)}
body.v19 .oc[data-apply][aria-pressed="true"]::after{content:"✓";position:absolute;top:8px;right:8px;width:32px;height:32px;border-radius:50%;display:grid;place-items:center;background:#ffb84d;color:#2a1705;font-weight:900}
body.v19 .oc[data-apply] .od{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden}
.co26{border-radius:16px;min-height:150px;padding:14px;margin:0 0 12px;display:flex;flex-direction:column;justify-content:flex-end;background:linear-gradient(180deg,rgba(14,17,28,0) 30%,rgba(14,17,28,.92)),var(--bg) center 30%/cover}
.co26 b{font-family:var(--f-display);font-size:30px;text-shadow:0 2px 8px #000}.co26 span{color:#ffcf7a}
@media (max-width:600px){#modal .mbx.mn26 #mc{grid-template-columns:repeat(2,minmax(0,1fr))}}
`;document.head.appendChild(st);})();