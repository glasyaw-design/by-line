/* 바이라인 1.6 — src/compat/v36.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.4 줄바꿈 정리 =====
(function(){const st=document.createElement('style');st.textContent=`
@media (max-width:560px){#modal .mbx:not(.mn26):not(.pick28):not(.p21grid) #mc.grid2{grid-template-columns:minmax(0,1fr)!important}#modal .mbx:not(.mn26):not(.pick28) #mc.grid2 .ch{min-height:0!important}}
.stt>b,.stg .stt b,.ring b,.dring b{white-space:nowrap}
.nrow summary .nn{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;flex:1 1 auto}
#mc .ch .cl{word-break:keep-all;overflow-wrap:break-word}
`;document.head.appendChild(st);})();
// ===== 1.4 능력치: 리더십·영업력이 너무 안 오르던 문제 · 창간 대표도 오른다 =====
try{Object.keys(ST_HOOK).forEach(k=>{ST_HOOK[k]=[ST_HOOK[k][0],+(ST_HOOK[k][1]*1.5).toFixed(2)];});Object.assign(ST_HOOK,{fvision:['lead',.4],fhire:['lead',.3],fassign:['lead',.3],fsales:['sal',.45],fpartner:['sal',.3],fraise:['sal',.3],exec:['lead',.35],board:['lead',.3],front:['lead',.25],column:['wri',.2]});}catch(e){}
statHook=function(id){if(!S||!id||S._stH===S.turn+':'+id)return;const h=ST_HOOK[id];if(!h)return;if(h[0]==='lead'&&S.rank<1&&!S.founder)return;S._stH=S.turn+':'+id;gain(h[0],h[1]);};
(function(){const st=document.createElement('style');st.textContent=`.tag,.tag.bl,span.tag{white-space:nowrap}.meta>span{word-break:keep-all}`;document.head.appendChild(st);})();
// 짧은 굵은 글씨(금액·이름·숫자)는 중간에서 끊지 않는다
function nbFix(root){try{(root||document).querySelectorAll('b,strong,.num').forEach(b=>{if(b.dataset.nb)return;const t=b.textContent.trim();if(t.length&&t.length<=14&&!b.children.length){b.style.whiteSpace='nowrap';}b.dataset.nb=1;});}catch(e){}}
{const _om36=openModal;openModal=function(){const r=_om36.apply(this,arguments);nbFix(document.getElementById('modal'));return r;};}
{const _rd36=render;render=function(){const r=_rd36.apply(this,arguments);nbFix(document.getElementById('app')||document.body);return r;};}
// ===== 개발자 모드: 아티팩트에서만, 첫 화면 왼쪽 위에 다시 =====
{const _tt36=titleHTML;titleHTML=function(){let h=_tt36.apply(this,arguments);try{if(devOK()&&!window.__devTest){const b=`<button class="ttc ttdev" data-go="devtoggle"><i><em>⚙</em></i><span>${S&&S.dev?'개발자 끄기':'개발자 모드'}</span></button>${S&&S.dev?`<button class="ttc ttdev" data-go="devc"><i><em>▶</em></i><span>개발자 콘솔</span></button>`:''}`;h=h.replace(/(<div class="ttcorner l">)/,'$1'+b);}}catch(e){}return h;};}
(function(){const st=document.createElement('style');st.textContent=`.ttc.ttdev{border-color:rgba(185,140,255,.6)!important}.ttc.ttdev span{color:#d8c4ff}`;document.head.appendChild(st);})();