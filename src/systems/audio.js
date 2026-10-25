/* 바이라인 — src/systems/audio.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ================= 사운드: BGM · 효과음 (Web Audio로 직접 합성) =================
const AU={ctx:null,on:{bgm:true,sfx:true},vol:{bgm:.5,sfx:.7},mood:null,bus:null,step:0,next:0,timer:null,noise:null,mel:null,bar:0};
try{const a=JSON.parse(localStorage.getItem('byline-audio')||'null');if(a){Object.assign(AU.on,a.on||{});Object.assign(AU.vol,a.vol||{});}}catch(e){}
function auSave(){try{localStorage.setItem('byline-audio',JSON.stringify({on:AU.on,vol:AU.vol}));}catch(e){}}
function auInit(){if(AU.ctx)return AU.ctx;const C=window.AudioContext||window.webkitAudioContext;if(!C)return null;
  try{const c=new C();AU.ctx=c;const comp=c.createDynamicsCompressor();comp.threshold.value=-14;comp.ratio.value=4;comp.connect(c.destination);
    AU.master=comp;AU.bgmG=c.createGain();AU.sfxG=c.createGain();AU.bgmG.connect(comp);AU.sfxG.connect(comp);
    const d=c.createDelay(1);d.delayTime.value=.27;const fb=c.createGain();fb.gain.value=.3;const lp=c.createBiquadFilter();lp.type='lowpass';lp.frequency.value=2400;const wet=c.createGain();wet.gain.value=.25;
    d.connect(lp);lp.connect(fb);fb.connect(d);lp.connect(wet);wet.connect(AU.bgmG);AU.echo=d;
    const len=c.sampleRate;const b=c.createBuffer(1,len,c.sampleRate);const ch=b.getChannelData(0);for(let i=0;i<len;i++)ch[i]=Math.random()*2-1;AU.noise=b;
    auVol();}catch(e){AU.ctx=null;}return AU.ctx;}
function auVol(){if(!AU.ctx)return;const t=AU.ctx.currentTime;AU.bgmG.gain.setTargetAtTime(AU.on.bgm?AU.vol.bgm*.55:0,t,.25);AU.sfxG.gain.setTargetAtTime(AU.on.sfx?AU.vol.sfx:0,t,.05);}
const mtof=m=>440*Math.pow(2,(m-69)/12);
// 기본 음원
function vTone(dest,o){const c=AU.ctx;const t=o.t,d=o.d||.3;const os=c.createOscillator();const g=c.createGain();os.type=o.type||'sine';os.frequency.setValueAtTime(o.f,t);
  if(o.f2)os.frequency.exponentialRampToValueAtTime(o.f2,t+(o.gl||d));if(o.det)os.detune.value=o.det;let n=os;
  if(o.fl){const bq=c.createBiquadFilter();bq.type=o.fl.type||'lowpass';bq.frequency.setValueAtTime(o.fl.f,t);if(o.fl.f2)bq.frequency.exponentialRampToValueAtTime(o.fl.f2,t+d);bq.Q.value=o.fl.q||1;os.connect(bq);n=bq;}
  const a=o.a||.005,v=o.v||.2;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+a);if(o.s){g.gain.setValueAtTime(v,t+Math.max(a,d-o.s));}g.gain.exponentialRampToValueAtTime(.0001,t+d);
  n.connect(g);g.connect(dest);if(o.wet&&AU.echo){const w=c.createGain();w.gain.value=o.wet;g.connect(w);w.connect(AU.echo);}os.start(t);os.stop(t+d+.05);}
function vNoise(dest,o){const c=AU.ctx;const t=o.t,d=o.d||.1;const s=c.createBufferSource();s.buffer=AU.noise;const bq=c.createBiquadFilter();bq.type=o.ft||'highpass';bq.frequency.setValueAtTime(o.f||6000,t);if(o.f2)bq.frequency.exponentialRampToValueAtTime(o.f2,t+d);bq.Q.value=o.q||.8;
  const g=c.createGain();const v=o.v||.1;g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(v,t+(o.a||.002));g.gain.exponentialRampToValueAtTime(.0001,t+d);s.connect(bq);bq.connect(g);g.connect(dest);s.start(t,Math.random()*.5);s.stop(t+d+.05);}
// 악기
const INS={
 kick:(B,t,v=1)=>vTone(B,{t,f:130,f2:42,gl:.12,d:.32,v:.55*v,type:'sine'}),
 snare:(B,t,v=1)=>{vNoise(B,{t,d:.16,v:.2*v,ft:'bandpass',f:1900,q:.7});vTone(B,{t,f:190,f2:140,d:.09,v:.12*v,type:'triangle'});},
 rim:(B,t,v=1)=>vTone(B,{t,f:1700,d:.04,v:.08*v,type:'square',fl:{type:'bandpass',f:1800,q:4}}),
 hat:(B,t,v=1)=>vNoise(B,{t,d:.045,v:.06*v,f:7500}),
 ohat:(B,t,v=1)=>vNoise(B,{t,d:.22,v:.05*v,f:7000}),
 brush:(B,t,v=1)=>vNoise(B,{t,d:.12,v:.05*v,ft:'bandpass',f:4200,q:.5,a:.02}),
 tom:(B,t,v=1,m=45)=>vTone(B,{t,f:mtof(m),f2:mtof(m-7),gl:.2,d:.3,v:.3*v}),
 shaker:(B,t,v=1)=>vNoise(B,{t,d:.06,v:.035*v,f:9000,a:.015}),
 bass:(B,t,m,d,v=1)=>{vTone(B,{t,f:mtof(m),d,v:.26*v,type:'triangle',s:d*.5});vTone(B,{t,f:mtof(m),d:d*.8,v:.08*v,type:'sawtooth',fl:{f:600,f2:180}});},
 sub:(B,t,m,d,v=1)=>vTone(B,{t,f:mtof(m),d,v:.3*v,type:'sine',a:.02,s:d*.6}),
 pad:(B,t,ms,d,v=1)=>ms.forEach(m=>{[-8,8].forEach(det=>vTone(B,{t,f:mtof(m),d,v:.035*v,type:'sawtooth',det,a:d*.3,s:d*.5,fl:{f:900,q:.5}}));}),
 keys:(B,t,ms,d,v=1)=>ms.forEach((m,i)=>{vTone(B,{t:t+i*.012,f:mtof(m),d,v:.07*v,type:'sine',wet:.3});vTone(B,{t:t+i*.012,f:mtof(m+12),d:d*.4,v:.02*v,type:'triangle'});}),
 pluck:(B,t,m,d=.25,v=1)=>vTone(B,{t,f:mtof(m),d,v:.1*v,type:'triangle',wet:.35,fl:{f:3200,f2:600}}),
 marimba:(B,t,m,d=.3,v=1)=>{vTone(B,{t,f:mtof(m),d,v:.13*v,type:'sine',wet:.25});vTone(B,{t,f:mtof(m)*4,d:.05,v:.03*v,type:'sine'});},
 bell:(B,t,m,d=1.2,v=1)=>{vTone(B,{t,f:mtof(m),d,v:.08*v,type:'sine',wet:.5});vTone(B,{t,f:mtof(m)*2.76,d:d*.5,v:.03*v,type:'sine'});vTone(B,{t,f:mtof(m)*5.4,d:d*.2,v:.015*v,type:'sine'});},
 lead:(B,t,m,d=.25,v=1)=>vTone(B,{t,f:mtof(m),d,v:.06*v,type:'square',wet:.3,s:d*.4,fl:{f:2200,q:1}}),
 brass:(B,t,ms,d=.4,v=1)=>ms.forEach(m=>vTone(B,{t,f:mtof(m),d,v:.06*v,type:'sawtooth',a:.03,s:d*.5,fl:{f:500,f2:2600,q:1.5}})),
 str:(B,t,m,d=.2,v=1)=>vTone(B,{t,f:mtof(m),d,v:.06*v,type:'sawtooth',a:.01,fl:{f:1500,f2:500,q:2}}),
};
// 곡: 화성 진행(근음 + 코드 구성음), 패턴(16칸), 템포
const C7={M7:[0,4,7,11],m7:[0,3,7,10],d7:[0,4,7,10],M:[0,4,7],m:[0,3,7],m9:[0,3,7,10,14],M9:[0,4,7,11,14],sus:[0,5,7,10],dim:[0,3,6,9],add9:[0,4,7,14]};
const SONGS={
 title:{n:'밤의 편집국',bpm:80,sw:.12,prog:[[53,'M7'],[52,'m7'],[50,'m7'],[48,'M9']],k:'x.....x...x.....',s:'....x.......x...',h:'..x...x...x...x.',bass:'x.....x...x.....',keys:'x.......x.......',arp:0,mel:'keys',pad:1},
 exam:{n:'지원서 접수',bpm:100,sw:.06,prog:[[55,'M'],[52,'m'],[48,'M'],[50,'M']],k:'x.......x.......',s:'....x.......x...',h:'x.x.x.x.x.x.x.x.',bass:'x...x...x...x...',arp:'marimba',arpP:'x.x.x.x.x.x.x.x.',mel:0,pad:0},
 police:{n:'새벽 사쓰마와리',bpm:88,sw:.08,prog:[[57,'m7'],[53,'M7'],[55,'d7'],[52,'m7']],k:'x.........x.....',s:'....x.......x...',h:'..x...x...x...xx',bass:'x..x......x.....',arp:'pluck',arpP:'x...x.x...x...x.',mel:0,pad:1,low:1},
 newsroom:{n:'마감 30분 전',bpm:112,sw:.04,prog:[[48,'add9'],[55,'M'],[57,'m7'],[53,'M7']],k:'x...x...x...x...',s:'....x.......x...',h:'xxxxxxxxxxxxxxxx',bass:'x.xx..x.x.xx..x.',arp:'pluck',arpP:'x.xxx.x.x.xxx.x.',mel:'lead',melD:.5,pad:0},
 office:{n:'국장실의 오후',bpm:78,sw:.18,prog:[[50,'m9'],[55,'d7'],[48,'M9'],[57,'d7']],k:'x.........x.....',s:'',br:'x...x...x...x...',h:'..x..x....x..x..',walk:1,keys:'x.....x...x.....',mel:'keys',pad:0},
 tycoon:{n:'창간 호외',bpm:122,sw:0,prog:[[52,'M'],[57,'M'],[49,'m'],[59,'M']],k:'x...x...x...x...',s:'....x.......x...',h:'..x...x...x...x.',oh:1,bass:'x.x.x.x.x.x.x.x.',brass:'x.....x.........',mel:'lead',melD:.5,pad:0},
 drama:{n:'시한부 취재',bpm:96,sw:.05,prog:[[50,'m'],[46,'M'],[53,'M'],[48,'M']],k:'x.....x...x.....',s:'....x.......x...',h:'x.x.x.x.x.x.x.x.',bass:'x.....x.x.......',arp:'str',arpP:'x.x.x.x.x.x.x.x.',mel:'bell',melD:1,pad:1},
 tense:{n:'속보 대기',bpm:132,sw:0,prog:[[50,'m'],[50,'m'],[46,'M'],[48,'sus']],k:'x..x..x...x..x..',s:'....x.......x..x',h:'xxxxxxxxxxxxxxxx',bass:'xxxxxxxxxxxxxxxx',arp:'str',arpP:'xxxxxxxxxxxxxxxx',tom:'..............xx',mel:0,pad:1},
 ending:{n:'마지막 바이라인',bpm:68,sw:.1,prog:[[48,'M9'],[57,'m7'],[53,'M7'],[55,'sus']],k:'x...............',s:'',h:'',bass:'x.......x.......',keys:'x.......x.......',mel:'bell',melD:1.4,pad:1},
};
function bgmMood(){if(!S)return 'title';if(S.phase==='title')return 'title';if(S.phase==='create'||S.phase==='apply')return 'exam';if(S.phase==='end')return 'ending';
  if(S.breaking)return 'tense';if(S.founder)return 'tycoon';if(S.story)return 'drama';if(S.rank===0)return 'police';if(S.rank>=4)return 'office';return 'newsroom';}
function bgmUpdate(){if(!AU.ctx)return;const m=bgmMood();if(m===AU.mood)return;AU.mood=m;const c=AU.ctx,t=c.currentTime;
  if(AU.bus){const old=AU.bus;old.gain.setTargetAtTime(0,t,.5);setTimeout(()=>{try{old.disconnect();}catch(e){}},3000);}
  const g=c.createGain();g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(1,t+1.5);g.connect(AU.bgmG);AU.bus=g;AU.step=0;AU.bar=0;AU.next=t+.1;AU.mel=null;
  if(!AU.timer)AU.timer=setInterval(bgmTick,30);const el=$('#sndnow');if(el)el.textContent=SONGS[m].n;}
function melPhrase(sg){const L=[];let p=R(0,4);for(let b=0;b<4;b++){const ch=sg.prog[b];const tones=C7[ch[1]].slice(0,4).map(x=>ch[0]+12+x);const row=[];
  for(let i=0;i<16;i++){const on=sg.melD>=1?(i%8===0||(i===12&&chance(.3))):(i%2===0&&chance(i%4===0?.75:.4));if(on){p=clamp(p+R(-2,2),0,tones.length*2-1);row.push(tones[p%tones.length]+12*Math.floor(p/tones.length));}else row.push(null);}L.push(row);}return L;}
function bgmTick(){try{bgmTick0();}catch(e){clearInterval(AU.timer);AU.timer=null;}}
function bgmTick0(){const c=AU.ctx;if(!c||!AU.bus||!AU.mood)return;if(c.state!=='running')return;const sg=SONGS[AU.mood];const sp=60/sg.bpm/4;const B=AU.bus;
  if(AU.next<c.currentTime-.3)AU.next=c.currentTime+.05;
  while(AU.next<c.currentTime+.15){const i=AU.step%16,bar=Math.floor(AU.step/16)%4;const t=AU.next+(i%2?sg.sw*sp:0);const [root,q]=sg.prog[bar];const ch=C7[q];const at=(p)=>p&&p[i]==='x';
    if(i===0&&bar===0&&(!AU.mel||AU.bar%2===0))AU.mel=sg.mel?melPhrase(sg):null;
    if(i===0&&bar===0)AU.bar++;
    if(at(sg.k))INS.kick(B,t,i===0?1:.8);if(at(sg.s))INS.snare(B,t);if(at(sg.br))INS.brush(B,t);if(at(sg.h))INS.hat(B,t,i%4===0?1:.6);if(sg.oh&&i%4===2)INS.ohat(B,t,.6);if(at(sg.tom))INS.tom(B,t,1,i===14?47:43);
    if(sg.walk){if(i%4===0){const w=[0,ch[1],ch[2],ch[1]+2][i/4];INS.bass(B,t,root-12+w,sp*3.6);}}
    else if(at(sg.bass))INS[sg.low?'sub':'bass'](B,t,root-12+(sg.bass==='xxxxxxxxxxxxxxxx'?0:(i===6||i===14?7:0)),sp*(sg.bass.length&&sg.bass[i+1]==='x'?1.6:3));
    if(sg.pad&&i===0)INS.pad(B,t,ch.slice(0,4).map(x=>root+x),sp*16,sg.low?.7:1);
    if(at(sg.keys))INS.keys(B,t,ch.map(x=>root+x),sp*(sg.bpm<85?7:5));
    if(sg.brass&&at(sg.brass))INS.brass(B,t,ch.map(x=>root+12+x),sp*3);
    if(sg.arp&&at(sg.arpP)){const k=Math.floor(i/(sg.arpP==='xxxxxxxxxxxxxxxx'?1:2));const m=root+12+ch[k%ch.length]+(sg.arp==='str'?0:(k%8>=4?12:0));INS[sg.arp](B,t,sg.arp==='str'&&q==='m'&&i%4!==0?root+12:m,sp*1.6,.9);}
    if(AU.mel){const m=AU.mel[bar][i];if(m!=null)INS[sg.mel](B,t,sg.mel==='keys'?[m]:m,sg.mel==='keys'?sp*4:(sg.melD||.5)*sp*4,.9);}
    AU.step++;AU.next+=sp;}}
// 효과음
const SFX={
 click:t=>vTone(AU.sfxG,{t,f:1250,f2:900,gl:.03,d:.05,v:.08,type:'triangle'}),
 deny:t=>{vTone(AU.sfxG,{t,f:180,d:.12,v:.12,type:'square',fl:{f:700}});vTone(AU.sfxG,{t:t+.07,f:150,d:.14,v:.1,type:'square',fl:{f:600}});},
 pop:t=>{vTone(AU.sfxG,{t,f:520,f2:880,gl:.06,d:.12,v:.1,type:'sine'});vNoise(AU.sfxG,{t,d:.08,v:.025,ft:'bandpass',f:2000,f2:5000});},
 blip:t=>vTone(AU.sfxG,{t,f:1560,d:.08,v:.05,type:'sine'}),
 page:t=>{vNoise(AU.sfxG,{t,d:.35,v:.12,ft:'bandpass',f:800,f2:4200,q:.6,a:.06});vTone(AU.sfxG,{t:t+.28,f:90,f2:60,d:.15,v:.18});},
 type:t=>{for(let i=0;i<7;i++){const u=t+i*.07+Math.random()*.02;vNoise(AU.sfxG,{t:u,d:.03,v:.12,ft:'bandpass',f:3000+Math.random()*1500,q:2});vTone(AU.sfxG,{t:u,f:220,d:.02,v:.06,type:'square'});}vTone(AU.sfxG,{t:t+.56,f:2100,d:.6,v:.08});vTone(AU.sfxG,{t:t+.56,f:2100*2.4,d:.25,v:.02});},
 success:t=>[72,76,79,84].forEach((m,i)=>{vTone(AU.sfxG,{t:t+i*.075,f:mtof(m),d:.5,v:.09,type:'triangle'});vTone(AU.sfxG,{t:t+i*.075,f:mtof(m+12),d:.25,v:.025});}),
 scoop:t=>{[67,72,76,79,84,88].forEach((m,i)=>vTone(AU.sfxG,{t:t+i*.06,f:mtof(m),d:.7,v:.08,type:'triangle'}));vNoise(AU.sfxG,{t:t+.3,d:.8,v:.04,f:8000,a:.1});},
 fanfare:t=>{[[60,64,67],[60,64,67],[65,69,72],[67,71,74,79]].forEach((ch,j)=>{const u=t+[0,.16,.32,.5][j];const d=j===3?1.1:.14;ch.forEach(m=>vTone(AU.sfxG,{t:u,f:mtof(m),d,v:.05,type:'sawtooth',a:.02,s:d*.5,fl:{f:900,f2:3200,q:1.2}}));});vTone(AU.sfxG,{t,f:mtof(36),d:1.6,v:.15,type:'triangle'});[0,.5].forEach(o=>vNoise(AU.sfxG,{t:t+o,d:.5,v:.06,f:5000}));},
 fail:t=>{vTone(AU.sfxG,{t,f:mtof(64),d:.25,v:.09,type:'sawtooth',fl:{f:1200}});vTone(AU.sfxG,{t:t+.22,f:mtof(60),f2:mtof(55),gl:.5,d:.6,v:.09,type:'sawtooth',fl:{f:1000,f2:300}});},
 coin:t=>{vTone(AU.sfxG,{t,f:mtof(83),d:.08,v:.07,type:'square',fl:{f:5000}});vTone(AU.sfxG,{t:t+.08,f:mtof(88),d:.35,v:.07,type:'square',fl:{f:5000}});},
 phone:t=>{for(let r=0;r<2;r++)for(let i=0;i<8;i++){const u=t+r*.5+i*.04;vTone(AU.sfxG,{t:u,f:i%2?1400:1100,d:.04,v:.1,type:'sine'});}},
 alarm:t=>{[[76,0],[83,.11],[88,.22]].forEach(([m,o])=>vTone(AU.sfxG,{t:t+o,f:mtof(m),d:.18,v:.07,type:'square',fl:{f:3000}}));vTone(AU.sfxG,{t:t+.36,f:mtof(88),d:.5,v:.06,type:'square',fl:{f:3000,f2:800}});vTone(AU.sfxG,{t,f:mtof(40),d:.8,v:.15,type:'triangle'});},
 camera:t=>{vNoise(AU.sfxG,{t,d:.04,v:.2,f:3000});vNoise(AU.sfxG,{t:t+.09,d:.06,v:.15,f:2000});},
 stamp:t=>{vTone(AU.sfxG,{t,f:120,f2:50,gl:.1,d:.2,v:.35});vNoise(AU.sfxG,{t,d:.08,v:.12,ft:'lowpass',f:1200});},
 chat:t=>[0,.1].forEach((o,i)=>vTone(AU.sfxG,{t:t+o,f:i?1320:990,d:.12,v:.06})),
 start:t=>{[60,67,72,76,79].forEach((m,i)=>vTone(AU.sfxG,{t:t+i*.09,f:mtof(m),d:.9,v:.07,type:'triangle',wet:.4}));vTone(AU.sfxG,{t,f:mtof(36),d:1.4,v:.12});},
};
function sfx(k,delay){if(!AU.ctx||!AU.on.sfx||!SFX[k])return;if(AU.ctx.state!=='running')return;try{SFX[k](AU.ctx.currentTime+(delay||0)+.01);}catch(e){}}
function sfxFor(title,body){const s=title+' '+String(body||'').replace(/<[^>]+>/g,' ').slice(0,200);const T=title;
  if(/불합격|오보|소송|징계|경고장|해고|좌천|물먹|낙종|실패|파산|정정보도|문책|감봉|불발|사과문|탈락|퇴짜/.test(T))return 'fail';
  if(/승진|인사 발령|최종 합격|합격|수상|클리어|창간|입사 확정|엔딩|결산/.test(T))return 'fanfare';
  if(/대특종|특종|단독/.test(T))return 'scoop';
  if(/속보|긴급|사건|사고|재난|비상|위기|폭로|압수수색/.test(T))return 'alarm';
  if(/제보|전화|연락|문자|메시지/.test(T))return 'phone';
  if(/출고|송고|기사|데스킹|원고/.test(T))return 'type';
  if(/광고|매출|월급|투자|계약|수익|자금|돈/.test(T))return 'coin';
  if(/결재|인사|발령|채용/.test(T))return 'stamp';
  if(/사진|현장|포토/.test(T))return 'camera';
  if(/술|회식|만남|대화|동료|선배|후배/.test(T))return 'chat';
  if(/성공|확인|칭찬|1면|포털 메인|호평|축하/.test(s))return 'success';
  return 'pop';}
function auUnlock(){const c=auInit();if(!c)return;if(c.state==='suspended')c.resume().then(()=>bgmUpdate()).catch(()=>{});bgmUpdate();}
['pointerdown','keydown','touchstart'].forEach(ev=>document.addEventListener(ev,auUnlock,{capture:true,passive:true}));
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('button,.opt,.oc,label.chk');if(!b)return;if(b.disabled){sfx('deny');return;}if(b.closest('#mc'))return;sfx('click');},true);
document.addEventListener('visibilitychange',()=>{if(!AU.ctx)return;if(document.hidden)AU.ctx.suspend().catch(()=>{});else AU.ctx.resume().catch(()=>{});});
function bindHud(){const b=$('#hud [data-go="sound"]');if(b)b.onclick=soundMenu;}
function soundChip(){return `<button class="chip snd" data-go="sound" title="소리 설정" aria-label="소리 설정">${AU.on.bgm||AU.on.sfx?'♪':'♪̸'} 소리</button>`;}
function soundMenu(){auUnlock();const row=(k,n)=>`<div class="sndrow"><label class="chk"><input type="checkbox" data-snd="${k}" ${AU.on[k]?'checked':''}><span><b>${n}</b></span></label><input type="range" min="0" max="100" value="${Math.round(AU.vol[k]*100)}" data-sv="${k}" aria-label="${n} 크기"></div>`;
  openModal('소리 설정',`<p>지금 흐르는 곡: <b id="sndnow">${AU.mood?SONGS[AU.mood].n:'—'}</b></p>${row('bgm','배경 음악 (BGM)')}${row('sfx','효과음')}
   <p class="hint">BGM은 상황에 따라 바뀐다. 타이틀·입사 시험·수습 새벽·편집국·국장실·창간·스토리·속보·엔딩까지 9곡. 모두 브라우저에서 바로 합성한다.</p>
   <div class="btns">${Object.keys(SONGS).map(k=>`<button class="btn sm" data-try="${k}">${SONGS[k].n}</button>`).join('')}</div>`,[{label:'효과음 들어 보기',sub:'버튼·특종·승진·오보·속보',fn:()=>{['click','scoop','fanfare','fail','alarm'].forEach((k,i)=>sfx(k,i*.9));return false;}},{label:'닫기',cls:'ghost'}]);
  document.querySelectorAll('#mb [data-snd]').forEach(x=>x.onchange=()=>{AU.on[x.dataset.snd]=x.checked;auVol();auSave();renderHud();});
  document.querySelectorAll('#mb [data-sv]').forEach(x=>x.oninput=()=>{AU.vol[x.dataset.sv]=x.value/100;auVol();auSave();if(x.dataset.sv==='sfx')sfx('blip');});
  document.querySelectorAll('#mb [data-try]').forEach(x=>x.onclick=()=>{auUnlock();AU.mood=null;const keep=bgmMood;bgmMood=()=>x.dataset.try;bgmUpdate();bgmMood=keep;});}