/* 바이라인 1.6 — src/ui/scene.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ================= 2D 장면 =================
const cv=$('#scene'),cx=cv.getContext('2d');let FR=0;
function fitCanvas(){const w=cv.clientWidth||1024;const dpr=Math.min(2,window.devicePixelRatio||1);const W=Math.max(512,Math.round(w*dpr));if(cv.width!==W){cv.width=W;cv.height=Math.round(W*96/256);}const k=cv.width/256;cx.setTransform(k,0,0,k,0,0);}
function rr(x,y,w,h,r){cx.beginPath();if(cx.roundRect)cx.roundRect(x,y,w,h,r);else cx.rect(x,y,w,h);}
function rc(x,y,w,h,c){cx.fillStyle=c;const r=Math.min(1.4,w/3,h/3);if(r<.35){cx.fillRect(x,y,w,h);return;}rr(x,y,w,h,r);cx.fill();}
function circ(x,y,r,c){cx.fillStyle=c;cx.beginPath();cx.arc(x,y,r,0,Math.PI*2);cx.fill();}
function grad(y0,y1,stops){const g=cx.createLinearGradient(0,y0,0,y1);stops.forEach(([o,c])=>g.addColorStop(o,c));return g;}
function glow(x,y,r,c){const g=cx.createRadialGradient(x,y,0,x,y,r);g.addColorStop(0,c);g.addColorStop(1,'rgba(0,0,0,0)');cx.fillStyle=g;cx.fillRect(x-r,y-r,r*2,r*2);}
// 사람: (x,y)는 8×14 상자 왼쪽 위
function person(x,y,o,opt={}){const m=x+4,skin=o.s||'#f2c8a4',hair=o.h||'#2a1d16',cl=o.c||'#5d7aa8',pt=o.p||'#2b3048';
  if(!opt.seat){cx.fillStyle='rgba(0,0,0,.25)';cx.beginPath();cx.ellipse(m,y+14.2,4.2,1.1,0,0,Math.PI*2);cx.fill();
    const sw=opt.walk?Math.sin(FR*.9)*1.2:0;rc(m-2.6+sw*.4,y+9.5,2.2,4.6,pt);rc(m+.4-sw*.4,y+9.5,2.2,4.6,pt);rc(m-2.9+sw*.4,y+13.3,2.8,1.1,'#15151b');rc(m+.2-sw*.4,y+13.3,2.8,1.1,'#15151b');}
  // 몸통
  cx.fillStyle=cl;rr(m-3.6,y+5.4,7.2,opt.seat?5:5.6,2.4);cx.fill();
  if(!opt.back){cx.fillStyle='#f4f1e8';cx.beginPath();cx.moveTo(m-1.3,y+5.5);cx.lineTo(m,y+7.3);cx.lineTo(m+1.3,y+5.5);cx.fill();}
  // 팔
  cx.fillStyle=cl;rr(m-4.6,y+6,1.6,4,.8);cx.fill();rr(m+3,y+6,1.6,4,.8);cx.fill();circ(m-3.8,y+10.1,.8,skin);circ(m+3.8,y+10.1,.8,skin);
  // 머리
  circ(m,y+3,2.75,skin);
  cx.fillStyle=hair;cx.beginPath();if(opt.back){cx.arc(m,y+3,2.9,0,Math.PI*2);}else{cx.arc(m,y+2.6,2.9,Math.PI*1.02,Math.PI*1.98);cx.lineTo(m+2.9,y+3.1);cx.quadraticCurveTo(m,y+1.6,m-2.9,y+3.1);}cx.fill();
  if(!opt.back){circ(m-1,y+3.4,.36,'#1b1b22');circ(m+1,y+3.4,.36,'#1b1b22');cx.fillStyle='rgba(255,120,120,.25)';circ(m-1.7,y+4.2,.5,'rgba(255,130,130,.28)');circ(m+1.7,y+4.2,.5,'rgba(255,130,130,.28)');}
}
const ME=()=>({h:'#2a1d16',c:S&&S.rank>=4?'#3b3f5c':S&&S.rank===0?'#c9b48a':'#e6e0d0',p:S&&S.rank>=4?'#23263a':'#2b3048'});
let seed=7;const srand=()=>(seed=(seed*16807)%2147483647)/2147483647;
function skyline(y0,col,lit){seed=11;let x=-4;while(x<260){const w=10+Math.floor(srand()*18),h=10+Math.floor(srand()*30);cx.fillStyle=col;rr(x,y0-h,w,h+2,1.2);cx.fill();for(let yy=y0-h+3;yy<y0-2;yy+=4)for(let xx=x+2;xx<x+w-2;xx+=3)if(srand()<.35)rc(xx,yy,1.3,1.8,lit);x+=w+1;}}
function vignette(){const g=cx.createRadialGradient(128,48,30,128,48,150);g.addColorStop(0,'rgba(0,0,0,0)');g.addColorStop(1,'rgba(0,0,0,.45)');cx.fillStyle=g;cx.fillRect(0,0,256,96);}
function monitor(x,y,on){rc(x,y,16,11,'#1b1d26');cx.fillStyle=on?grad(y,y+10,[[0,'#5c9be0'],[1,'#2d5c95']]):'#2f557f';rr(x+1,y+1,14,8.4,1);cx.fill();rc(x+6.5,y+11,3,2,'#1b1d26');rc(x+4.5,y+12.6,7,.9,'#1b1d26');for(let k=0;k<3;k++)rc(x+2.5,y+2.6+k*2.2,6+((k*5+x)%5),.8,'rgba(255,255,255,.55)');}
function drawNewsroom(){
  cx.fillStyle=grad(0,60,[[0,'#232a44'],[1,'#2d3550']]);cx.fillRect(0,0,256,60);
  for(let x=20;x<256;x+=60){rc(x,3,30,2.2,'#f4ecd2');glow(x+15,6,22,'rgba(255,240,200,.08)');}
  cx.fillStyle='#0b1022';rr(8,10,52,28,2);cx.fill();cx.save();rr(8,10,52,28,2);cx.clip();cx.fillStyle=grad(10,38,[[0,'#101833'],[1,'#253058']]);cx.fillRect(8,10,52,28);skyline(38,'#151b34','#ffd27a');cx.restore();rc(33,10,1.4,28,'#3a405c');
  rc(180,8,64,38,'#0c0d14');cx.fillStyle=grad(10,40,[[0,'#2b5a96'],[1,'#173563']]);rr(182,10,60,30,1.5);cx.fill();person(206,15,{h:'#1a1a1a',c:'#c9473c'},{seat:true});rc(182,33.5,60,6.5,'#c73b33');for(let i=0;i<6;i++)rc(((i*14-FR*2)%64+64)%64+180,35.8,6,1,'rgba(255,255,255,.9)');
  circ(157,19,7,'#efe9da');circ(157,19,6,'#fbf7ee');cx.strokeStyle='#333';cx.lineWidth=.7;cx.beginPath();cx.moveTo(157,19);cx.lineTo(157,14.5);cx.moveTo(157,19);cx.lineTo(160.5,20.5);cx.stroke();
  cx.fillStyle=grad(60,96,[[0,'#4a3c35'],[1,'#30262a']]);cx.fillRect(0,60,256,36);
  for(let i=0;i<5;i++){const x=10+i*50,y=66,me=i===2;
    if(me){glow(x+30,y-20,34,'rgba(255,190,90,.22)');rc(x+27,y-28.5,8,2.2,'#ffb84d');rc(x+30.4,y-26.5,1.2,8,'#666');}
    person(x+6,y-20,me?ME():{h:['#3b2a20','#111','#6b4a2e','#222','#4a3a2a'][i],c:['#5d7aa8','#8c5a7a','','#6a8d6a','#a88a5d'][i]},{seat:true});
    cx.fillStyle=grad(y-10,y-6,[[0,'#94683f'],[1,'#6f4c2f']]);rr(x,y-10,40,4,1.2);cx.fill();rc(x+2,y-6,3,14,'#5a3e28');rc(x+35,y-6,3,14,'#5a3e28');
    monitor(x+20,y-22,(FR+i)%6!==0);rc(x+2,y-12.8,8,2.6,'#f1ecdf');rc(x+3,y-14.6,7,1.8,'#dcd5c4');circ(x+14,y-11.4,1.5,i%2?'#d9534f':'#f4f1e8');}
  if(isTV()&&S.phase==='game'){rc(236,58,8,6,'#222');rc(239,64,2,22,'#444');rc(234,84,12,2,'#444');circ(245.5,60.5,1.6,(FR%4<2)?'#ff6f61':'#551d18');}
  vignette();
}
function drawPolice(){
  cx.fillStyle=grad(0,72,[[0,'#060918'],[.6,'#121a3a'],[1,'#1e2650']]);cx.fillRect(0,0,256,72);
  seed=3;for(let i=0;i<30;i++){const x=srand()*256,y=srand()*40;if((i+FR)%9)circ(x,y,.45,'rgba(220,225,255,.85)');}
  circ(30,14,5,'#f6eecf');circ(32,12.5,4.6,'#121a3a');
  skyline(70,'#0a0d1a','#e6c066');
  const sign=S.scene==='police';
  cx.fillStyle=grad(28,72,[[0,'#525a73'],[1,'#3b4258']]);rr(118,28,96,44,1.5);cx.fill();rc(114,24,104,5,'#2f3446');for(let x=124;x<210;x+=14)for(let y=34;y<62;y+=10)rc(x,y,8,6,(x+y)%3?'#f0d68a':'#2b2f3e');
  if(sign){rc(146,30,40,7,'#1d2d5c');cx.fillStyle='#e9ecf5';cx.font='5px sans-serif';cx.fillText('POLICE',153,35.4);}
  rc(158,56,16,16,'#222633');cx.fillStyle=grad(58,72,[[0,'#ffe7a3'],[1,'#e8c46a']]);rr(160,58,12,14,1);cx.fill();glow(166,66,26,'rgba(255,220,140,.18)');
  cx.fillStyle='#1d1e25';cx.fillRect(0,72,256,24);for(let x=((-FR*3)%24+24)%24-24;x<256;x+=24)rc(x,83,12,1.6,'#d8cd9f');
  if(sign){cx.fillStyle='#eef0f4';rr(22,63,48,11,3);cx.fill();rc(22,67.5,48,2,'#2d4fa0');cx.fillStyle='#c9ccd6';rr(30,59,32,6,2);cx.fill();circ(43,58.2,1.6,FR%2?'#ff5a4e':'#3c78f0');circ(50,58.2,1.6,FR%2?'#3c78f0':'#ff5a4e');glow(46,58,18,FR%2?'rgba(255,80,70,.25)':'rgba(70,120,255,.25)');circ(31,74.5,3,'#111');circ(61,74.5,3,'#111');}
  else{rc(20,50,40,22,'#2b2f3e');rc(24,54,10,6,'#e6cf86');rc(40,54,10,6,'#2b2f3e');rc(22,46,36,4,'#c94a3a');}
  glow(100,32,40,'rgba(255,190,100,.20)');rc(99.3,30,1.4,46,'#5a5d68');rc(95,28,10,2.6,'#777b86');rc(97,30.6,6,1,'#ffd27a');
  person(106,60,ME(),{walk:true});rc(115,66,3.6,4.6,'#f6f2e6');
  cx.fillStyle='rgba(180,200,255,.28)';for(let i=0;i<46;i++){const x=(i*37+FR*3)%256,y=(i*53+FR*7)%96;cx.fillRect(x,y,.5,3);}
  vignette();
}
function drawBriefing(){
  cx.fillStyle=grad(0,58,[[0,'#24305a'],[1,'#1c2546']]);cx.fillRect(0,0,256,58);
  cx.fillStyle='#e9e3cf';rr(96,8,64,16,2);cx.fill();cx.fillStyle='#1f2742';cx.font='6px sans-serif';cx.fillText('정례 브리핑',111,18);
  ['#c94a3a','#3c5aa8','#e8e3d0'].forEach((c,i)=>{rc(40+i*3,6,2,30,'#555');cx.fillStyle=c;rr(42+i*3,6,9,6,1);cx.fill();});
  cx.fillStyle=grad(36,58,[[0,'#7a5236'],[1,'#5a3d2a']]);rr(114,36,28,22,2);cx.fill();rc(118,38,20,3,'#d1aa52');person(124,21,{h:'#3a3a3a',c:'#2f3a55'},{seat:true});
  rc(123.5,29,1,7,'#222');rc(130.5,29,1,7,'#222');circ(124,29,1.2,'#333');circ(131,29,1.2,'#333');
  cx.fillStyle=grad(58,96,[[0,'#2d3242'],[1,'#22262f']]);cx.fillRect(0,58,256,38);
  for(let row=0;row<2;row++)for(let i=0;i<9;i++){const x=10+i*28+(row?14:0),y=62+row*14;const me=row===1&&i===4;person(x,y,me?ME():{h:['#222','#3b2a20','#555','#111'][i%4],c:['#4a5a7a','#6a4a5a','#3a5a4a','#5a5a5a'][i%4]},{back:true,seat:true});rc(x-1,y+8,10,2,'#3a3f52');}
  if(FR%7===0){glow(R(20,230),R(55,80),14,'rgba(255,255,255,.45)');}
  vignette();
}
function drawMeet(){
  cx.fillStyle=grad(0,96,[[0,'#4e2f22'],[1,'#2f1c15']]);cx.fillRect(0,0,256,96);for(let x=0;x<256;x+=32)rc(x,8,1.6,58,'rgba(0,0,0,.18)');
  [30,186].forEach(x=>{cx.fillStyle='#e9d7a8';rr(x,14,40,24,2);cx.fill();cx.fillStyle=grad(16,36,[[0,'#fff1cc'],[1,'#f1dcaa']]);rr(x+2,16,36,20,1.5);cx.fill();rc(x+19.3,16,1.2,20,'#cdb680');});
  rc(124.4,0,1.2,16,'#222');cx.fillStyle='#e8a54d';cx.beginPath();cx.moveTo(116,24);cx.quadraticCurveTo(125,10,134,24);cx.fill();glow(125,30,70,'rgba(255,180,90,.22)');
  person(80,40,ME(),{seat:true});person(164,40,{h:'#55504a',c:'#4b5a7a'},{seat:true});
  cx.fillStyle=grad(58,64,[[0,'#9a6a40'],[1,'#7a4f2e']]);rr(60,57,136,7,2);cx.fill();rc(64,64,4,30,'#6b4428');rc(188,64,4,30,'#6b4428');
  cx.fillStyle='#2b2b2b';rr(114,50,28,8,3);cx.fill();cx.fillStyle='#d24a2f';rr(116,48,24,3,1.5);cx.fill();
  for(let i=0;i<4;i++){const y=44-((FR*2+i*5)%16);circ(121+i*5+((FR+i)%2)*.6,y,.9,'rgba(240,240,240,.45)');}
  rc(96,47,2.6,11,'#2f7d4a');rc(158,49,2.6,9,'#2f7d4a');rc(103,54,6,4,'#f1ecdf');rc(146,54,6,4,'#f1ecdf');
  vignette();
}
function drawOffice(){
  cx.fillStyle='#2c2a33';cx.fillRect(0,0,256,96);cx.save();rr(18,6,220,52,2);cx.clip();cx.fillStyle=grad(6,58,[[0,'#0b1330'],[.7,'#2b2a55'],[1,'#7a4a5a']]);cx.fillRect(18,6,220,52);skyline(58,'#161b33','#ffd47a');cx.restore();for(let x=18;x<240;x+=55)rc(x,6,1.6,52,'#4a4656');
  cx.fillStyle=grad(60,96,[[0,'#4a3830'],[1,'#33261f']]);cx.fillRect(0,60,256,36);
  cx.fillStyle=grad(58,66,[[0,'#5a3a28'],[1,'#432a1c']]);rr(68,57,120,9,2);cx.fill();rc(76,66,104,22,'#3a2519');
  person(124,38,ME(),{seat:true});rc(150,52,14,5,'#f1ecdf');circ(101,55,2.2,'#d1aa52');
  rc(14,62,10,14,'#6b4a33');for(let i=0;i<6;i++){cx.fillStyle=i%2?'#3e7a4a':'#4f9a5d';cx.beginPath();cx.ellipse(12+i*3,56-i%3*3,2,6,(i-2.5)*.25,0,Math.PI*2);cx.fill();}
  cx.fillStyle='#efe8d4';rr(206,64,30,22,1.5);cx.fill();rc(209,67,24,3,'#222');for(let y=72;y<84;y+=3)rc(209,y,24,.8,'#9a9284');
  vignette();
}
function drawPress(){
  cx.fillStyle=grad(0,96,[[0,'#1d1f27'],[1,'#121318']]);cx.fillRect(0,0,256,96);rc(0,70,256,26,'#272830');
  for(let i=0;i<3;i++){const x=40+i*60;cx.fillStyle='#4a4d58';rr(x,16,36,36,4);cx.fill();circ(x+18,34,13,'#2b2d35');for(let k=0;k<4;k++){const a=(FR*.4+k*Math.PI/2);circ(x+18+Math.cos(a)*9,34+Math.sin(a)*9,2.2,'#c9ccd6');}circ(x+18,34,3,'#8a8d98');}
  rc(0,56,256,8,'#efe8d0');for(let x=((-FR*6)%16+16)%16-16;x<256;x+=16){rc(x,58,8,.8,'#7c766a');rc(x+2,60,10,.8,'#7c766a');}
  for(let i=0;i<4;i++){rc(200+i*12,74-i%2*2,10,14,'#e4ddc6');rc(200+i*12,79,10,1,'#b33a33');}
  person(20,58,ME(),{});glow(128,40,120,'rgba(255,184,77,.06)');
  vignette();
}
function drawInterview(){
  cx.fillStyle=grad(0,62,[[0,'#3a4058'],[1,'#30354a']]);cx.fillRect(0,0,256,62);cx.fillStyle='#2b2f3d';cx.fillRect(0,62,256,34);
  cx.fillStyle='#ece6d6';rr(92,6,72,18,2);cx.fill();cx.fillStyle='#23283a';cx.font='6px sans-serif';cx.fillText(S&&S.exam&&S.exam.practice?'상식 퀴즈':'신입 기자 면접',104,17);
  [70,124,178].forEach((x,i)=>person(x,30,{h:['#2a2a2a','#7c7c7c','#3b2a20'][i],c:['#2f3a55','#4a4a4a','#5a3e55'][i]},{seat:true}));
  cx.fillStyle=grad(48,56,[[0,'#7a5338'],[1,'#5a3d2a']]);rr(40,47,176,8,2);cx.fill();rc(40,54,176,14,'#4f3524');[64,118,172].forEach(x=>{rc(x,44,20,3.6,'#f1ecdf');});
  person(124,76,{h:'#2a1d16',c:'#20263b'},{back:true,seat:true});rc(118,86,20,10,'#4a3a2e');glow(128,30,80,'rgba(255,255,255,.05)');
  vignette();
}
const SCENES={newsroom:drawNewsroom,police:drawPolice,field:drawPolice,meet:drawMeet,office:drawOffice,press:drawPress,interview:drawInterview,briefing:drawBriefing};
function capText(){const sc=S?S.scene:'newsroom';const o=S&&S.outlet&&OUT()?OUT().n:'바이라인';
  {const sb=(S&&S.phase==='game'&&typeof sceneSub==='function')?sceneSub(sc):null;if(sb)return sb.cap;}const ik=(typeof sceneImgKey==='function')?sceneImgKey():null;if(S&&S.phase==='game'&&sc==='field'&&typeof sceneDept==='function'){const SD=sceneDept();if(SD==='ent'&&ik==='lobby')return '기획사 앞 · 취재진';if(SD==='spo'&&ik==='briefing')return '경기장 · 인터뷰실';if(SD==='spo'&&ik==='rain')return '경기장 밖 · 비 오는 밤';}const IKN={roof:'옥상 · 잠깐 숨 돌리기',pub:'저녁 · 술자리',chair:S&&S.founder?'대표실':'사장실',exec:'임원 회의실',print:'윤전실 · 내일 자 1면',rain:'취재 현장 · 비 오는 밤',crime:'사건 현장 · 감식 중',court:'법정',gov:'청사 앞 · 취재진',lobby:'기업 본사 로비',airport:'공항 · 출국장',region:'지역 · 주재지',assembly:'국회 본회의장',briefing:'브리핑룸'};if(ik&&IKN[ik])return IKN[ik];
  return {newsroom:`${o} ${isTV()?'보도국':'편집국'}`,police:'새벽 2시 · 경찰서 라인',field:'취재 현장',meet:'저녁 · 취재원과 한 끼',office:S&&S.rank===7?'사장실':'임원 회의실',press:isTV()?'부조정실 · 메인뉴스':'윤전실 · 내일 자 1면',interview:'언론고시 · 면접장',briefing:'브리핑룸'}[sc]||'';}
// 5.7 장면 일러스트: 행동·부서·직급에 맞는 그림을 고른다. 그림이 없는 장면(경찰서·면접장·방송 부조정실)은 기존 그림으로
function sceneImgKey(){if(!S)return null;if(S.phase==='title')return 'title';if(S.phase==='end')return 'roof';if(S.phase!=='game')return null;const sc=S.scene,a=S._curAct,alt=(Math.floor((S.turn||0)/4)&1);const dn=(DEPTS[S.dept]||{}).n||'';
  const G=/법조/.test(dn)?'law':/사건|사회|의료|교육|탐사/.test(dn)?'soc':/정치|외교|자치/.test(dn)?'pol':/경제|산업|금융|증권|부동산|IT/.test(dn)?'eco':/국제/.test(dn)?'int':/전국|지역|시·군|주재/.test(dn)?'loc':'cul';
  if(['rest','life','job','found','deptreq'].includes(a)&&(sc==='newsroom'||sc==='office'))return 'roof';{const sb=sceneSub(sc);if(sb)return sb.img;}const SD=sceneDept();if(sc==='field'&&SD==='ent')return 'lobby';if(sc==='field'&&SD==='spo')return alt?'briefing':'rain';
  if(sc==='newsroom')return (a==='drink'||a==='colleague')?'pub':'newsroom';
  if(sc==='meet')return 'pub';
  if(sc==='office')return (S.rank>=7||S.founder)?'chair':'exec';
  if(sc==='press')return isTV()?null:'print';
  if(sc==='field')return {soc:alt?'rain':'crime',law:'court',pol:'gov',eco:'lobby',int:'airport',loc:'region'}[G]||'rain';
  if(sc==='briefing')return {pol:alt?'assembly':'briefing',law:'court',eco:'lobby',loc:'region'}[G]||'briefing';
  return null;}
function drawScene(){if(!S)return;const st=cv.closest('.stage'),im=$('#sceneImg');const k=sceneImgKey();const u=k&&IMG[k==='title'?'title':'sc_'+k];
  if(u&&im){if(im.dataset.k!==k){im.src=u;im.dataset.k=k;if(k!=='title')try{metaMark('scenes',k);}catch(e){}}if(st&&!st.classList.contains('hasimg'))st.classList.add('hasimg');st&&st.classList.toggle('ttl',k==='title');$('#cap').textContent=k==='title'?'':capText();return;}
  if(st)st.classList.remove('hasimg','ttl');fitCanvas();cx.clearRect(0,0,256,96);try{(SCENES[S.scene]||drawNewsroom)();}catch(e){}$('#cap').textContent=capText();}
const RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
if(!RM)setInterval(()=>{FR++;drawScene();},160);