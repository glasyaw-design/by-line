/* 바이라인 1.6 — src/compat/v21.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.32 팝업 새 디자인 (GPT 시안): 대사 말풍선 · 바뀐 것 줄 · 결과 타일 · 그림 선택지 · 그림 없는 팝업 머리띠 =====
const P21_STAT={'행동력':'ss_ap','컨디션':'ss_hp','통장':'ss_money','사내 평가':'ss_eval','이사회 신임':'ss_eval','평가':'ss_eval','업계 평판':'ss_rep','평판':'ss_rep','신뢰도':'ss_trust','신뢰':'ss_trust','회사 자금':'ss_cash','보도 품질':'ss_front','구독':'ss_subs','트래픽':'ss_portal','아이템':'ss_excl','취재원':'ai_source','인력':'ss_union','광고 단가':'ss_ad','멘탈':'ss_mental'};
function p21StatImg(n){n=String(n||'').trim();let k=P21_STAT[n];if(!k){try{const sk=Object.keys(STN).find(x=>STN[x]===n);if(sk)k='st_'+sk;}catch(e){}}if(!k&&/관계$/.test(n))k='ai_network';return k&&IMG[k]?k:null;}
const P21_CH=[[/거절|사양|넘긴다|넘어간다|다음에|나중에|미룬다|보류|참는다|그만|접는다|남는다/,'ss_term'],[/소송|고소|법적|변호|법원|중재/,'ss_suit'],[/정정|사과|바로잡/,'ss_fix'],[/단독|특종|먼저 쓴/,'ss_excl'],
 [/돈|만 원|억|비용|수당|후원|투자|사비/,'ss_money'],[/술|회식|한잔|저녁/,'ai_drink'],[/커피|챙긴|챙겨|위로|같이|함께|동료|후배|선배/,'ai_colleague'],[/취재원|제보|만난|만나/,'ai_source'],[/쉰|쉬다|휴식|잠|휴가|병원/,'ai_rest'],
 [/회의|보고|데스크|부장|국장/,'ai_meeting'],[/광고|영업|협찬/,'ai_adsell'],[/경찰|수사|형사|사건/,'ai_sasu'],[/현장|돈다|돌기|간다|나간다|출입처|라인/,'ai_beat'],[/쓴다|보도|기사|출고|싣/,'ai_write'],[/조사|확인|검증|자료|데이터|분석/,'ai_discover'],
 [/신뢰/,'ss_trust'],[/평판|이름/,'ss_rep'],[/평가/,'ss_eval'],[/위험|강경|정면|맞선/,'ss_err'],[/받아들|수락|좋다|한다|시작/,'ss_plus']];
function p21ChImg(t){for(const [re,k] of P21_CH)if(re.test(t)&&IMG[k])return k;return null;}
function p21People(){const L=[];try{(S.cols||[]).forEach(c=>c&&c.name&&L.push({n:c.name,h:()=>face(c.role,c.rel,'say',c.name)}));(S.team||[]).concat(typeof deptMates==='function'?deptMates():[]).forEach(m=>m&&m.name&&L.push({n:m.name,h:()=>npcFace(m,'say')}));(S.sources||[]).forEach(s=>s&&s.name&&L.push({n:s.name,h:()=>face(srcFaceRole(s),s.trust-10,'say',s.name)}));}catch(e){}return L;}
function p21Speaker(tx){const P=p21People();const hit=P.filter(p=>tx.includes(p.n)).sort((a,b)=>tx.indexOf(a.n)-tx.indexOf(b.n))[0];if(hit)return hit.h();
  if(/캡/.test(tx))return face('cap',30,'say',S.capName||'');if(/부장|데스크/.test(tx))return face('boss',30,'say');if(/국장|편집국장/.test(tx))return face('boss',30,'say');if(/사장|회장|대주주/.test(tx))return face('owner',30,'say');if(/선배/.test(tx))return face('senior',30,'say');return '';}
function p21Tiles(L,big){return `<div class="p21tiles${big?' big':''}" style="grid-template-columns:repeat(${Math.min(L.length,big?4:3)},minmax(0,1fr))">${L.slice(0,big?4:6).map(x=>{const k=p21StatImg(x.n);return `<div class="p21t ${x.g?'up':'dn'}">${k?`<img src="${IMG[k]}" alt="">`:''}<small>${esc(x.n)}</small><b><i>${x.g?'▲':'▼'}</i>${esc(String(x.t).replace(/^\+/,'+'))}</b></div>`;}).join('')}</div>`;}
function p21Skin(t){const bx=document.querySelector('#modal .mbx');if(!bx)return;const mb=$('#mb'),mc=$('#mc');if(!mb||!mc)return;
  bx.classList.add('p21');bx.classList.remove('p21res','p21plain','p21grid');
  const btns=[...mc.querySelectorAll('.ch')];const main=btns.filter(b=>!b.classList.contains('ghost'));
  const isRes=main.length<=1&&(!main[0]||/^(확인|넘어간다|좋다|알겠다|닫기|계속|다음)$/.test((main[0].querySelector('.cl')||main[0]).textContent.trim()));
  if(isRes)bx.classList.add('p21res');
  // 대사 말풍선
  const ld=mb.querySelector(':scope>p.lede');if(ld&&!ld.closest('.p21say')&&/["“「]/.test(ld.textContent)&&/["“”]/.test(ld.textContent)){const f=p21Speaker(ld.textContent);if(f){const w=document.createElement('div');w.className='p21say';w.innerHTML=f+'<div class="bub"></div>';ld.parentNode.insertBefore(w,ld);w.querySelector('.bub').appendChild(ld);}}
  // 바뀐 것
  const rd=mb.querySelector('.rdiff');if(rd&&!rd.dataset.p21){rd.dataset.p21=1;const L=[...rd.querySelectorAll('.rd')].map(s=>({n:(s.querySelector('i')||{}).textContent,t:(s.querySelector('b')||{}).textContent,g:s.classList.contains('up')}));
    if(isRes&&L.length){rd.outerHTML=`<div class="p21res-h">결과</div>`+p21Tiles(L,L.length<=4);}else{rd.querySelectorAll('.rd').forEach(s=>{const k=p21StatImg((s.querySelector('i')||{}).textContent);if(k)s.insertAdjacentHTML('afterbegin',`<img src="${IMG[k]}" alt="">`);});}}
  // 결과 문구 (사내 평가 +1.2 · 평판 +0.8)
  if(isRes)mb.querySelectorAll('p.fx, .fx:not(.p21done)').forEach(el=>{if(el.dataset.p21||el.querySelector('*'))return;const tx=el.textContent.trim();const parts=tx.split(/\s*·\s*/);const L=parts.map(x=>{const m=/^(.+?)\s*([+\-−][\d.,]+(?:만|억|%)?)$/.exec(x);return m?{n:m[1],t:m[2].replace('−','-'),g:!/^[-−]/.test(m[2])}:null;});if(L.length&&L.every(Boolean)&&!mb.querySelector('.p21tiles')){el.dataset.p21=1;el.outerHTML=p21Tiles(L,L.length<=4);}});
  // 선택지 그림
  const curK=S&&S._curAct&&IMG['ai_'+S._curAct]?'ai_'+S._curAct:null;
  main.forEach((b,i)=>{const _cl=((b.querySelector('.cl')||{}).textContent||'').trim();if(b.querySelector('.p21ci,img')||isRes||(_cl&&Object.values(DEPTS).some(d=>d&&d.n===_cl)))return;const tx=b.textContent;const k=p21ChImg(tx)||(i===0?curK:null);if(k)b.insertAdjacentHTML('afterbegin',`<img class="p21ci" src="${IMG[k]}" alt="">`);if(b.querySelector('.bdg.rec'))b.classList.add('p21rec');});
  // 짧은 선택지 3~4개는 2열 그림 카드
  if(!isRes&&main.length>=3&&main.length<=4&&main.every(b=>(b.querySelector('.cl')||b).textContent.trim().length<=9&&!b.querySelector('.chips,.cs')&&b.querySelector('.p21ci')))bx.classList.add('p21grid');
  if(isRes&&main[0])main[0].classList.add('p21ok');
  // 그림 없는 팝업: 머리띠 + 둥근 배지
  if(!bx.classList.contains('hasev')&&!/튜토리얼|개발자|업데이트|저장|메뉴|소리 설정|도움말|[1-5]단계 · /.test(t||'')){const mt=$('#mt');const k=p21ChImg(t||'')||curK||'ai_pitch';bx.classList.add('p21plain');if(mt&&!mt.querySelector('.p21b')&&IMG[k])mt.insertAdjacentHTML('afterbegin',`<img class="p21b" src="${IMG[k]}" alt="">`);const bg=IMG.sc_newsroom||IMG['sc_winter'];if(bg)mt.style.setProperty('--p21bg',`url(${bg})`);}else{const mt=$('#mt');if(mt){const b=mt.querySelector('.p21b');if(b)b.remove();}}}
{const _om21=openModal;openModal=function(t,b,c){const r=_om21.call(this,t,b,c);try{if(!$('#modal').hidden&&S&&S.phase==='game')p21Skin(t);}catch(e){console.error(e);}return r;};}
(function(){const st=document.createElement('style');st.textContent=`
body.v19 #modal .mbx.p21{max-width:560px;border-radius:24px;border:1px solid rgba(120,140,200,.22);box-shadow:0 30px 80px rgba(0,0,0,.6),0 0 0 1px rgba(255,184,77,.06) inset;background:linear-gradient(180deg,#1b2136,#131726 60%)}
body.v19 #modal .mbx.p21>.evimg{aspect-ratio:1.85/1!important}
body.v19 #modal .mbx.p21>.evimg::after{content:"";position:absolute;left:0;right:0;bottom:0;height:38%;background:linear-gradient(0deg,#1b2136,transparent)}
body.v19 #modal .mbx.p21>.evimg .mkick{top:14px!important;left:14px!important;bottom:auto!important;z-index:2;background:rgba(14,17,28,.82)!important;color:#ffd38a!important;border:1.5px solid rgba(255,184,77,.7)!important;border-radius:999px!important;padding:6px 15px!important;font-size:14px!important;font-weight:700}
body.v19 #modal .mbx.p21.hasarch>.evimg .mkick{color:#fff!important;background:rgba(170,35,35,.92)!important;border-color:rgba(255,140,130,.7)!important;border-radius:10px!important}
body.v19 #modal .mbx.p21 .mt{font-family:var(--f-display);font-size:clamp(22px,4.6vw,30px)!important;line-height:1.2;border-bottom:0!important;padding-top:14px!important}
body.v19 #modal .mbx.p21.hasev .mt{margin-top:-30px;position:relative;z-index:2;text-shadow:0 2px 10px rgba(0,0,0,.7)}
body.v19 #modal .mbx.p21 .mt::before{width:6px!important;border-radius:4px;background:linear-gradient(180deg,#ffd27a,#ff9a3d)!important;height:1.05em!important}
body.v19 .p21say{display:grid;grid-template-columns:72px minmax(0,1fr);gap:12px;align-items:center;margin:2px 0 12px}
body.v19 .p21say .face{width:72px;height:72px;border-radius:50%;box-shadow:0 0 0 2px rgba(255,184,77,.55),0 6px 16px rgba(0,0,0,.4)}
body.v19 .p21say .bub{position:relative;border:1px solid rgba(120,140,200,.25);background:#1d2440;border-radius:16px;padding:12px 14px}
body.v19 .p21say .bub::before{content:"";position:absolute;left:-7px;top:50%;width:12px;height:12px;background:#1d2440;border-left:1px solid rgba(120,140,200,.25);border-bottom:1px solid rgba(120,140,200,.25);transform:translateY(-50%) rotate(45deg)}
body.v19 .p21say .bub p.lede{margin:0;font-size:15.5px;line-height:1.6}
body.v19 #mb .rdiff{display:flex;flex-wrap:wrap;align-items:center;gap:7px;border:1px solid rgba(120,140,200,.2);background:#151a2c;border-radius:14px;padding:9px 12px;margin:8px 0}
body.v19 #mb .rdiff .rdh{font-weight:700;margin-right:6px;padding-right:12px;border-right:1px solid rgba(120,140,200,.25)}
body.v19 #mb .rdiff .rd{display:inline-flex;align-items:center;gap:5px;border-radius:999px;padding:4px 12px;border:1.5px solid;font-size:13.5px}
body.v19 #mb .rdiff .rd.up{border-color:rgba(90,212,155,.75);color:#7ee8b4;background:rgba(90,212,155,.08)}
body.v19 #mb .rdiff .rd.dn{border-color:rgba(255,111,97,.75);color:#ff9488;background:rgba(255,111,97,.08)}
body.v19 #mb .rdiff .rd img{width:18px;height:18px;border-radius:5px}
body.v19 #mb .rdiff .rd i{font-style:normal}
body.v19 .p21res-h{display:none}
body.v19 .p21tiles{display:grid;grid-template-columns:repeat(auto-fit,minmax(118px,1fr));gap:9px;border:1px solid rgba(255,184,77,.22);border-radius:18px;padding:10px;margin:10px 0 4px;background:linear-gradient(180deg,rgba(255,184,77,.05),transparent)}
body.v19 .p21t{display:flex;flex-direction:column;align-items:center;text-align:center;gap:4px;border:1px solid rgba(120,140,200,.18);background:#161b2d;border-radius:14px;padding:10px 6px 9px}
body.v19 .p21t img{width:58px;height:58px;border-radius:50%;object-fit:cover;box-shadow:0 0 0 2px rgba(255,184,77,.35)}
body.v19 .p21tiles:not(.big) .p21t img{width:38px;height:38px}
body.v19 .p21t small{font-size:13px;color:var(--fg)}
body.v19 .p21t b{font-size:22px;font-family:var(--f-display);display:flex;align-items:center;gap:5px;line-height:1.1}
body.v19 .p21tiles:not(.big) .p21t b{font-size:17px}
body.v19 .p21t b i{font-style:normal;font-size:.62em}
body.v19 .p21t.up b{color:#5ad49b}body.v19 .p21t.dn b{color:#ff6f61}
body.v19 #mc .ch .p21ci{width:62px;height:62px;border-radius:14px;object-fit:cover;flex:none;box-shadow:0 4px 12px rgba(0,0,0,.35)}
body.v19 #mc .ch:has(.p21ci){display:grid!important;grid-template-columns:62px minmax(0,1fr);column-gap:13px;align-items:center;padding:10px 52px 10px 10px!important;min-height:82px}
body.v19 #mc .ch:has(.p21ci)>.p21ci{grid-row:1 / span 2}
body.v19 #mc .ch:has(.p21ci)>:not(.p21ci){grid-column:2}
body.v19 #mc .ch .cl{font-size:17px;font-weight:700;line-height:1.3}
body.v19 #mc .ch:not(.ghost)::after{width:38px!important;height:38px!important;font-size:22px!important;right:12px!important;border-width:2px!important}
body.v19 #mc .ch.p21rec{border-color:#ffb84d!important;box-shadow:0 0 0 1px #ffb84d inset,0 0 22px rgba(255,184,77,.35)!important;background:linear-gradient(180deg,rgba(255,184,77,.12),#191f33)!important}
body.v19 #mc .ch.p21rec::after{background:linear-gradient(135deg,#ffd27a,#ff9a3d);border-color:transparent!important;color:#2a1705!important}
body.v19 #mc .ch .bdg.rec{background:#2e9e6d;color:#fff;border-radius:999px;padding:2px 9px}
body.v19 .mbx.p21grid #mc{display:grid;grid-template-columns:1fr 1fr;gap:10px}
body.v19 .mbx.p21grid #mc>.mfoot{grid-column:1/-1}
body.v19 .mbx.p21grid #mc .ch:not(.ghost){display:flex!important;flex-direction:column;align-items:center;text-align:center;padding:10px!important;min-height:0}
body.v19 .mbx.p21grid #mc .ch:not(.ghost)::after{display:none}
body.v19 .mbx.p21grid #mc .ch .p21ci{width:100%;height:auto;aspect-ratio:1.7/1;border-radius:12px;margin-bottom:8px}
body.v19 #mc .ch.p21ok{justify-content:center;text-align:center;background:linear-gradient(135deg,#ffc561,#ff9a3d)!important;color:#2a1705!important;border:0!important;padding:14px!important;border-radius:18px!important;box-shadow:0 10px 26px rgba(255,154,61,.35)!important}
body.v19 #mc .ch.p21ok .cl{font-size:19px;color:#2a1705;width:100%;justify-content:center}
body.v19 #mc .ch.p21ok::after{display:none}
body.v19 #modal .mbx.p21plain .mt{display:flex;align-items:center;gap:14px;padding:22px 20px 18px 20px!important;margin:0;background:linear-gradient(90deg,rgba(19,23,38,.55),rgba(19,23,38,.85)),var(--p21bg) center 40%/cover;border-bottom:1px solid rgba(120,140,200,.18)!important}
body.v19 #modal .mbx.p21plain .mt::before{display:none}
body.v19 #modal .mbx.p21plain .mt .p21b{width:68px;height:68px;border-radius:50%;object-fit:cover;flex:none;box-shadow:0 0 0 3px #ffb84d,0 8px 20px rgba(0,0,0,.5)}
body.imgoff .p21ci,body.imgoff .p21b,body.imgoff .p21t img,body.imgoff .p21say .face{display:none!important}
@media (max-width:600px){body.v19 .p21say{grid-template-columns:56px minmax(0,1fr)}body.v19 .p21say .face{width:56px;height:56px}body.v19 #mc .ch .p21ci{width:52px;height:52px}body.v19 #mc .ch:has(.p21ci){grid-template-columns:52px minmax(0,1fr);min-height:70px}body.v19 .p21t img{width:46px;height:46px}}
`;document.head.appendChild(st);})();
// ---- 팝업 전용 그림 28장 · 선택지 아이콘 16개 ----
const PP_MAP=[[/돌기|동선|출입처 순회|라인 돌|한 바퀴|출입처 브리핑/,'route'],[/아이템 발굴|어디서 찾을까|좋은 아이템/,'find'],[/사건 파일/,'case'],[/실시간 이슈|속보 경쟁/,'live'],
 [/단독 출고|대형 단독/,'excl'],[/출고 완료|맡긴 기사가 나갔다|단신 송고/,'done'],[/다음 날 아침 지면|가판|조간/,'paper'],[/결산/,'month'],
 [/1면 회의|윤전기가 돈다/,'front'],[/아침 편집 회의|편집 회의|발제 회의|사설 회의|논설 회의/,'meet'],[/경영회의|결재|이사회·대주주 보고|대주주 면담/,'exec'],[/편집국 순시|현장 경영/,'tour'],
 [/동료 챙기기|부서 사람들과|구성원과 시간/,'col'],[/지역 유지/,'local'],[/당사자 인터뷰|인터뷰/,'intv'],[/후배의 발제|취재 지시|하명/,'junior'],
 [/공채|기자 채용|채용/,'hire'],[/포털/,'portal'],[/시설·개선|시설 투자|디지털 투자/,'facility'],[/행사 사업|마라톤|가요제|걷기대회|개최 확정|골프대회/,'event'],
 [/광고 영업|광고 단가|광고주 영업|광고·협찬|기자 영업/,'ad'],[/정기 인사|인사권 행사|인사 발표/,'jinsa'],[/송년회|시무식|회식|환영회/,'party'],[/추석|설 연휴|명절|연휴/,'holiday']];
function ppFor(t){t=String(t||'');for(const [re,k] of PP_MAP)if(re.test(t)&&IMG['pp_'+k])return 'pp_'+k;return null;}
{const _mi=modalImg18;modalImg18=function(t,b){try{if(!S||S.imgOff)return '';const B=String(b||'');if(!(B.includes('class="arch"')&&S.arc2)&&!/시대가 바뀐다/.test(B)){const k=ppFor(t);if(k)return k;}}catch(e){}return _mi(t,b);};}
P21_CH.unshift([/거절|사양|넘긴다|다음에|나중에|미룬다|보류|참는다|접는다|기다린다/,'pi_wait'],[/소송|고소|법적|변호|법원|중재/,'pi_law'],[/단독|특종/,'pi_excl'],[/돈|만 원|억|비용|수당|후원|사비/,'pi_money'],[/위험|강경|정면|맞선|모 아니면 도/,'pi_risk'],
 [/취재원|제보/,'pi_src'],[/부장|국장|데스크|상사|사장/,'pi_boss'],[/부서원|팀원|후배들|다 같이|모두/,'pi_team'],[/관계|화해|챙긴|위로|협력|손잡/,'pi_rel'],[/신뢰|정정|사과|바로잡/,'pi_trust'],[/평판|이름값/,'pi_fame'],[/평가/,'pi_eval'],[/쉰|쉬다|휴식|컨디션/,'pi_hp'],[/시간|며칠|천천히/,'pi_time'],[/바로|당장|지금|즉시|달려/,'pi_now']);
{const _sk=p21Skin;p21Skin=function(t){_sk(t);try{const b=document.querySelector('#mc .ch.p21rec .p21ci');if(b&&IMG.pi_rec&&!b.dataset.rk){b.dataset.rk=1;}}catch(e){}};}
(function(){const st=document.createElement('style');st.textContent=`body.v19 .p21t b{white-space:nowrap}
@media (max-width:480px){body.v19 .p21tiles{grid-template-columns:repeat(2,minmax(0,1fr))!important}body.v19 .p21t b{font-size:19px}}
@media (max-width:340px){body.v19 .p21t b{font-size:16px}body.v19 .p21t img{width:38px!important;height:38px!important}}`;document.head.appendChild(st);})();