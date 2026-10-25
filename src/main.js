/* 바이라인 — src/main.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ================= 로딩 화면 =================
const LD_STEPS=['윤전기 예열하는 중…','전국 언론사 명단 불러오는 중…','취재원 수첩 넘기는 중…','오늘 자 1면 짜는 중…','편집국 불 켜는 중…'];
const LD_TIPS=['핵심 사실은 두 출처로 확인해야 기사가 된다.','반론 없는 기사는 소송의 지름길이다.','취재원 관계는 한 번 깨지면 다시 쌓기 어렵다.','수습 때는 사쓰마와리로 경찰서를 돌며 정보를 모은다.','단독은 늦으면 물먹는다. 그렇다고 서두르면 오보가 난다.','데스크가 되면 남의 기사를 고치고 책임도 진다.','창간 모드에선 돈이 떨어지면 끝이다.','소리 설정은 위쪽 ♪ 버튼에서 바꿀 수 있다.'];
let LD={t0:performance.now(),iv:null,step:0};
function loaderRun(msg){const el=$('#loader');if(!el)return;LD.gen=(LD.gen||0)+1;const g=LD.gen;clearTimeout(LD.safe);LD.safe=setTimeout(()=>{if(LD.gen===g){clearInterval(LD.iv);el.classList.add('done');}},4000);el.classList.remove('done');const p=$('#ldp'),tx=$('#ldt'),tp=$('#ldtip');tp.textContent='팁: '+pick(LD_TIPS);LD.step=0;LD.t0=performance.now();p.style.width='8%';
  clearInterval(LD.iv);LD.iv=setInterval(()=>{LD.step++;const k=Math.min(LD.step,LD_STEPS.length-1);tx.textContent=msg&&LD.step<2?msg:LD_STEPS[k];p.style.width=Math.min(92,8+LD.step*18)+'%';if(LD.step===3)tp.textContent='팁: '+pick(LD_TIPS);},240);if(msg)tx.textContent=msg;}
function loaderDone(min){const el=$('#loader');if(!el)return;const g=LD.gen||0;const wait=Math.max(0,(min??1100)-(performance.now()-LD.t0));setTimeout(()=>{if((LD.gen||0)!==g)return;clearInterval(LD.iv);$('#ldp').style.width='100%';$('#ldt').textContent='준비 완료';setTimeout(()=>{if((LD.gen||0)===g)el.classList.add('done');},220);},wait);}
function flashLoad(msg,ms){loaderRun(msg);loaderDone(ms||750);}

// ================= 시작 =================
/* [옮김] function migrate → src/compat/_hoisted.js (원래 이 자리. 함수 선언은 끌어올려지므로 앞 파일에 둬야 원본과 같다) */
// 스토리 모드를 닫았다: 진행 중이던 스토리 저장(이어하기·슬롯·자동 저장)을 지운다
function purgeStory(){try{const keys=[SAVE_KEY,...[1,2,3,4,5,6].map(SAVESLOT),...[0,1,2,3,4].map(AUTOKEY)];let n=0;keys.forEach(k=>{const v=localStorage.getItem(k);if(!v)return;let o=null;try{o=JSON.parse(v);}catch(e){return;}const st=o&&(o.S||o);if(st&&st.story){localStorage.removeItem(k);n++;}});return n;}catch(e){return 0;}}
function knowFix(){try{if(S&&S.phase==='game'&&S.net&&!S.know2&&!S.founder){S.know2=1;knowMore();if(S.rank>=1)ENTS.filter(e=>e[2]==='corp'&&e[4]).sort((a,b)=>b[4]-a[4]).slice(0,S.rank>=2?3:2).forEach(e=>{if(S.net[e[0]])S.net[e[0]].known=true;});}}catch(e){}}
function start(data){
  let purged=0;if(!window.__devTest){purged=purgeStory();if(data&&data.S&&data.S.story)data={};}
  let dev=false;try{dev=localStorage.getItem('byline-dev')==='1';}catch(e){}
  S=(data&&data.S)?migrate(data.S):newState();S.dev=devOK()&&(S.dev||dev);
  if(S.phase!=='game'&&S.phase!=='end'){S.phase='title';}
  try{metaInjectOutlets();}catch(e){}knowFix();followFixTitles();S.scene=baseScene();render();presenceStart();loaderDone(1300);if(purged)setTimeout(()=>{try{toast('스토리 모드를 손보는 동안 닫았다 · 진행 중이던 스토리 저장을 정리했다');}catch(e){}},1600);
}
try{window.claude?.hot?.snapshot?.(()=>({S}));}catch(e){}
window.claude?.hot?.ready?window.claude.hot.ready(start):start(window.claude?.hot?.data??{});
