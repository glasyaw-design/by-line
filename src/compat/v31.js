/* 바이라인 — src/compat/v31.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.4 BGM: Suno로 만든 8곡 (bgm/ 폴더의 mp3) · 못 불러오면 예전 합성 음악으로 =====
const BGMF={theme:'밤의 편집국',daily:'편집국의 하루',night:'새벽 라인',deadline:'마감 30분 전',crisis:'속보 대기',power:'국장실의 오후',rise:'도약',ending:'마지막 바이라인'};
const BGM_OLD={title:'theme',exam:'deadline',police:'night',newsroom:'daily',office:'power',tycoon:'rise',drama:'daily',tense:'crisis',ending:'ending'};
const BGM_NEW2OLD={theme:'title',daily:'newsroom',night:'police',deadline:'exam',crisis:'tense',power:'office',rise:'tycoon',ending:'ending'};
const BF={ok:true,key:null,cur:null,ovr:null,pin:null,vol:.9,first:true};
// 상황 → 곡
{const _bm=bgmMood;bgmMood=function(){const now=Date.now();if(BF.pin&&BF.pin.u>now)return BF.pin.k;
  // 게임을 켜면 처음 45초는 메인 테마 (휴대폰은 첫 터치 전엔 소리를 못 내서, 첫 화면에서만 틀면 아무도 못 듣는다)
  if(BF.first===true||(BF.first&&BF.first>now))return 'theme';
  const old=_bm();if(!S||old==='title')return 'theme';if(old==='ending')return 'ending';
  if(BF.ovr&&BF.ovr.u>now)return BF.ovr.k;
  if(old==='exam')return 'theme';if(old==='tense')return 'crisis';
  try{if(S.founder){if(S.co&&S.co.cash<0)return 'crisis';const y=(typeof fYr==='function')?fYr():1;return y<2?'rise':'power';}}catch(e){}
  if(S.rank===0)return 'night';
  if((S.trust||50)<22)return 'crisis';
  if(S.rank>=1&&(S.inRank||0)<4&&S.turn>8)return 'rise';
  return S.rank>=4?'power':'daily';};}
function bfStart(k,fade){const c=AU.ctx;const a=new Audio();a.crossOrigin='anonymous';a.preload='auto';a.src='assets/audio/bgm_'+k+'.mp3';
  const src=c.createMediaElementSource(a);const g=c.createGain();g.gain.value=0;src.connect(g);g.connect(AU.bgmG);const d={a,g,src,k};
  a.addEventListener('error',()=>{if(BF.cur!==d)return;BF.ok=false;BF.cur=null;BF.key=null;bfStop(d,0);bgmUpdate();});
  a.addEventListener('timeupdate',()=>{if(BF.cur===d&&!d.x&&a.duration&&a.currentTime>a.duration-5){d.x=1;bfSwap(k,3);}});
  if(AU.on.bgm&&!document.hidden){const p=a.play();if(p&&p.catch)p.catch(()=>{});}
  const t=c.currentTime;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(BF.vol,t+fade);return d;}
function bfStop(d,fade){if(!d)return;try{const t=AU.ctx.currentTime;d.g.gain.cancelScheduledValues(t);d.g.gain.setValueAtTime(d.g.gain.value,t);d.g.gain.linearRampToValueAtTime(0,t+fade);}catch(e){}
  setTimeout(()=>{try{d.a.pause();d.a.removeAttribute('src');d.a.load();d.src.disconnect();d.g.disconnect();}catch(e){}},fade*1000+250);}
function bfSwap(k,fade){if(BF.first===true&&k==='theme')BF.first=Date.now()+45000;const old=BF.cur;BF.cur=bfStart(k,fade);bfStop(old,fade);}
{const _bu=bgmUpdate;bgmUpdate=function(){if(!AU.ctx)return;const m=bgmMood();const k=BGMF[m]?m:(BGM_OLD[m]||'daily');
  if(!BF.ok){const keep=bgmMood;bgmMood=()=>BGM_NEW2OLD[k];try{_bu();}finally{bgmMood=keep;}return;}
  if(BF.key===k)return;BF.key=k;
  if(AU.bus){const ob=AU.bus;try{ob.gain.setTargetAtTime(0,AU.ctx.currentTime,.3);}catch(e){}setTimeout(()=>{try{ob.disconnect();}catch(e){}},2000);AU.bus=null;}AU.mood=null;
  bfSwap(k,BF.cur?2.5:1.5);const el=$('#sndnow');if(el)el.textContent=BGMF[k];};}
// 소리 끄기·탭 숨김 → 멈춤, 다시 켜면 이어서
function bfSync(){const d=BF.cur;if(!d)return;const want=AU.on.bgm&&!document.hidden;if(want&&d.a.paused){const p=d.a.play();if(p&&p.catch)p.catch(()=>{});}else if(!want&&!d.a.paused)d.a.pause();}
{const _av=auVol;auVol=function(){_av();try{bfSync();}catch(e){}};}
{const _au=auUnlock;auUnlock=function(){_au();try{bfSync();}catch(e){}};}
document.addEventListener('visibilitychange',()=>{try{bfSync();}catch(e){}});
// 팝업 내용에 따라 잠깐 곡을 바꾼다 (최소 45초 유지)
const BF_OVR=[[/기사 쓰기|초고|데스킹|편집 회의|편집회의|발제|1면|마감|필기시험|면접/,'deadline'],[/속보|소송|오보|정정보도|압수수색|위기|파업|해킹|고발|제재|논란|폭로|검찰 수사/,'crisis'],[/새벽|사쓰마와리|하리꼬미|뻗치기|야간/,'night']];
{const _om31=openModal;openModal=function(t,b,c){const r=_om31.apply(this,arguments);try{if(S&&(S.phase==='game'||S.phase==='apply'||S.phase==='create')){const hit=BF_OVR.find(x=>x[0].test(String(t)));if(hit){BF.ovr={k:hit[1],u:Date.now()+45000};bgmUpdate();}}}catch(e){}return r;};}
setInterval(()=>{try{if(AU.ctx)bgmUpdate();}catch(e){}},5000);
// 소리 설정: 새 곡 목록
{const _sm=soundMenu;soundMenu=function(){_sm();try{const el=$('#sndnow');if(el&&BF.ok&&BF.key)el.textContent=BGMF[BF.key];
  const bt=$('#mb .btns');if(bt&&BF.ok)bt.innerHTML=Object.keys(BGMF).map(k=>`<button class="btn sm" data-try31="${k}">${BGMF[k]}</button>`).join('');
  document.querySelectorAll('#mb [data-try31]').forEach(x=>x.onclick=()=>{auUnlock();BF.pin={k:x.dataset.try31,u:Date.now()+90000};bgmUpdate();});
  const h=[...document.querySelectorAll('#mb p.hint')].find(p=>/BGM은/.test(p.textContent));if(h&&BF.ok)h.textContent='BGM은 상황에 따라 바뀐다. 메인 테마·일상·새벽·마감·위기·경영·도약·엔딩 8곡. 곡을 누르면 1분 30초 동안 그 곡을 들려준다.';}catch(e){}};}
// 모바일: 첫 터치(누를 때)엔 브라우저가 소리를 막는다 → 손을 뗄 때·클릭 때마다 멈춰 있는 BGM을 다시 튼다
['pointerup','touchend','click','keydown'].forEach(ev=>document.addEventListener(ev,()=>{try{const c=auInit();if(c&&c.state==='suspended')c.resume().catch(()=>{});if(!BF.key)bgmUpdate();bfSync();}catch(e){}},{capture:true,passive:true}));