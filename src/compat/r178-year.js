// 1.78 · 연말 결산 「올해의 나」 카드
// 예전 파일 v79.js를 순서 그대로 이어 붙였다

// ───── (예전 v79.js) ─────
/* 바이라인 — src/compat/v79.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.78 연말 결산: 「올해의 나」 카드 — 한 해를 한 장으로, 이미지로 저장·공유 =====
// 기록: S.yr79(올해 시작 상태) · S.yrH(지난해들 요약, 최대 10개)
function yrIdx(t){return Math.floor((t==null?S.turn:t)/YW);}
function yrSnap(){const st={};for(const k in STN)st[k]=+(S.st&&S.st[k]||0);let sk=0;try{sk=+mySkill()||0;}catch(e){}
  return {y:yrIdx(),t:S.turn,st,sk,arts:S.totalArticles||0,sc:S.scoops||0,er:S.errors||0,aw:S.awards||0,rv:S.rival?(S.rival.wins||0):0,rvN:S.rival?S.rival.name:'',eval:+S.eval||0,fame:+S.fame||0,trust:+S.trust||0,money:+S.money||0,rank:S.rank,rn:(()=>{try{return rankName();}catch(e){return '';}})(),o:(()=>{try{return OUT().n;}catch(e){return '';}})(),founder:!!S.founder,awM:S.awMain||0,
    fs:S.founder&&S.fst?Object.fromEntries(Object.keys(FSTN).map(k=>[k,+(S.fst[k]||0)])):null,co:S.co?{subs:+(S.co.subs||0),cash:+(S.co.cash||0),staff:+(S.co.staff||0),q:+(S.co.q||0)}:null};}
function yrEnsure(){try{if(S&&S.phase==='game'&&(!S.yr79||S.yr79.y==null))S.yr79=yrSnap();}catch(e){}}
function yrTitle(R){const p=R.p;if(R.fd){const c=p.co||{};const a=R.a.co||{},b=R.b.co||{};const sr=a.subs>0?c.subs/a.subs:0;
    if(a.cash<0&&b.cash>=0)return '흑자 전환의 해';if(sr>=.6)return '구독자가 몰린 해';if(c.cash<=-3)return '버티기의 해';if(p.awM>0)return '이름을 알린 해';if(c.staff>=3)return '사람을 모은 해';if(c.q>=5)return '기사가 단단해진 해';if(c.cash>=2)return '곳간이 찬 해';if(sr>=.25)return '독자가 늘어난 해';if(p.sc>=3)return '특종을 낸 해';return '한 걸음 더 나아간 해';}
  if(p.rank>0)return '도약의 해';if(p.awM>0)return '이름을 알린 해';if(p.er>=2)return '흔들린 해';if(p.sc>=5)return '단독 제조기';if(R.sum>=40)return '폭풍 성장';if(p.fame>=12)return '이름이 퍼진 해';
  const TT={inv:'발로 뛴 해',ver:'꼼꼼해진 해',int:'말문을 연 해',dat:'숫자를 읽은 해',wri:'문장이 깊어진 해',hed:'제목이 살아난 해',spd:'빨라진 해',kno:'아는 게 많아진 해',net:'발이 넓어진 해',cha:'사람을 얻은 해',sal:'영업을 배운 해',lead:'후배를 이끈 해',men:'단단해진 해',sta:'몸을 만든 해',lng:'세계를 본 해',brd:'카메라 앞에 선 해'};
  if(R.top.length&&R.D[R.top[0]]>=3&&TT[R.top[0]])return TT[R.top[0]];if(p.sc>=3)return '특종을 쫓은 해';if(p.trust>=6)return '믿음을 쌓은 해';return '버텨 낸 해';}
function yrBuild(a,b){const fd=!!(b.founder&&b.fs&&a.fs);const N=fd?FSTN:STN,src=fd?'fs':'st';const D={};let sum=0;for(const k in N){const d=+(((b[src]||{})[k]||0)-((a[src]||{})[k]||0)).toFixed(1);D[k]=d;sum+=d;}
  const top=Object.keys(D).filter(k=>D[k]>=.5).sort((x,y)=>D[y]-D[x]).slice(0,3);
  const co=a.co&&b.co?{subs:b.co.subs-a.co.subs,cash:b.co.cash-a.co.cash,staff:b.co.staff-a.co.staff,q:b.co.q-a.co.q}:null;
  const p={co,awM:(b.awM||0)-(a.awM||0),arts:b.arts-a.arts,sc:b.sc-a.sc,er:b.er-a.er,aw:b.aw-a.aw,rv:Math.max(0,b.rv-a.rv),eval:b.eval-a.eval,fame:b.fame-a.fame,trust:b.trust-a.trust,money:b.money-a.money,sk:b.sk-a.sk,rank:b.rank-a.rank};
  const clip=(S.clips||[]).filter(c=>c&&(fd||(!c.staff&&c.by===S.name))&&c.turn>=a.t&&c.turn<b.t+1).sort((x,y)=>(y.imp||0)*(y.excl?1.3:1)-(x.imp||0)*(x.excl?1.3:1))[0]||null;
  const qs=(S.qrH||[]).filter(x=>Math.floor(x.k/4)===a.y).map(x=>x.g);
  const pk=(typeof PK_BY!=='undefined'&&S.pk78&&S.pk78.t)?Object.entries(S.pk78.t).filter(([id,t])=>t>=a.t&&t<=b.t).map(([id])=>PK_BY[id]).filter(Boolean):[];
  const R={a,b,D,sum,top,p,clip,qs,pk,fd,N,src};R.title=yrTitle(R);return R;}
function yrDraw(R){const W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');const {a,b,p}=R;
  const F="'Maplestory','Noto Sans KR','Apple SD Gothic Neo',sans-serif";
  const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#1a2233');g.addColorStop(1,'#0b1019');x.fillStyle=g;x.fillRect(0,0,W,H);
  const T=(t,px,y,col,w,al)=>{x.font=`${w||700} ${px}px ${F}`;x.fillStyle=col||'#f4efe6';x.textAlign=al||'left';x.fillText(String(t),al==='right'?W-70:al==='center'?W/2:70,y);};
  const wrap=(t,px,y,maxW,lh,max,col,w)=>{x.font=`${w||700} ${px}px ${F}`;x.fillStyle=col||'#f4efe6';x.textAlign='left';const out=[];let line='';for(const ch of String(t)){const tt=line+ch;if(x.measureText(tt).width>maxW&&line){out.push(line);line=ch;}else line=tt;}if(line)out.push(line);out.slice(0,max).forEach((l,i)=>x.fillText(l,70,y+i*lh));return y+Math.min(out.length,max)*lh;};
  // 로고
  x.fillStyle='#ffb547';x.beginPath();x.roundRect?x.roundRect(70,62,46,46,12):x.rect(70,62,46,46);x.fill();x.fillStyle='#fff8ec';x.fillRect(84,72,18,26);
  x.textAlign='left';x.font=`700 34px ${F}`;x.fillStyle='#f4efe6';x.fillText('바이라인',132,98);const lw=x.measureText('바이라인').width;x.font=`400 18px ${F}`;x.fillStyle='rgba(244,239,230,.55)';x.fillText('BYLINE · 올해의 나',132+lw+18,96);
  T(`${2027+a.y}년`,40,190,'#ffb547',700);T(R.title,76,272,'#f4efe6',700);
  T(`${S.name} · ${b.o} ${b.rn}`,28,322,'rgba(244,239,230,.75)',400);
  // 올해의 기사
  let y=386;x.fillStyle='rgba(255,255,255,.06)';x.fillRect(70,y,W-140,200);T(R.fd?'올해 우리 회사의 기사':'올해의 기사',22,y+42,'#ffb547',700);
  wrap(R.clip?String(R.clip.h).replace(/^\[단독\]\s*/,(R.clip.excl?'[단독] ':'')):(R.fd?'올해는 1면을 흔든 기사가 없었다':'아직 내 이름이 걸린 기사가 없다'),36,y+96,W-180,48,2,'#f4efe6',700);
  if(R.clip){x.font=`400 20px ${F}`;x.fillStyle='rgba(244,239,230,.6)';x.textAlign='left';x.fillText(`${R.clip.place||''} · ${R.clip.date||''}`,70,y+184);}
  // 숫자 타일
  const sg=v=>(v>0?'+':v<0?'−':'±')+(Math.abs(v)>=10?Math.round(Math.abs(v)):Math.abs(v).toFixed(1));
  y=610;const subN=v=>Math.abs(v)<1?`${Math.round(v*10000).toLocaleString('ko-KR')}명`:`${f1(v)}만`;const tiles=R.fd&&b.co?[['구독·후원',subN(b.co.subs),(p.co.subs>=0?'+':'−')+subN(Math.abs(p.co.subs))],['회사 자금',eok(b.co.cash),sg(p.co.cash)],['기자 수',`${Math.round(b.co.staff)}명`,sg(p.co.staff)],['보도 품질',`${Math.round(b.co.q)}`,sg(p.co.q)]]:[['기사',`${p.arts}건`],['단독',`${p.sc}건`],['오보',`${p.er}건`],['기자상',`${p.awM}회`]];const tw=(W-140-3*16)/4;
  tiles.forEach(([n,v],i)=>{const tx=70+i*(tw+16);x.fillStyle='rgba(255,255,255,.06)';x.fillRect(tx,y,tw,120);x.textAlign='center';x.font=`400 20px ${F}`;x.fillStyle='rgba(244,239,230,.65)';x.fillText(n,tx+tw/2,y+40);x.font=`700 40px ${F}`;x.fillStyle=n==='오보'&&p.er>0?'#ff8b7a':n==='단독'&&p.sc>0?'#5ad49b':'#f4efe6';x.fillText(v,tx+tw/2,y+94);});
  if(R.fd)tiles.forEach((t3,i)=>{if(!t3[2])return;const tx=70+i*(tw+16);x.textAlign='center';x.font=`400 18px ${F}`;x.fillStyle=/^\+/.test(t3[2])?'#5ad49b':/^−/.test(t3[2])?'#ff8b7a':'rgba(244,239,230,.5)';x.fillText(t3[2],tx+tw/2,y+116);});
  // 라이벌
  y=770;if(R.fd){T('편집국',22,y,'#ffb547',700);T(`기사 ${p.arts}건 · 단독 ${p.sc}건 · 오보 ${p.er}건`,30,y+44,'#f4efe6',700);T(p.awM>0?'올해 기자상까지 받았다':'발행인으로 버틴 또 한 해',22,y+80,'rgba(244,239,230,.65)',400);}else if(a.rvN||b.rv){T(`라이벌 ${a.rvN||''}`,22,y,'#ffb547',700);T(`단독 맞대결 — 나 ${p.sc} : ${p.rv} 라이벌`,30,y+44,'#f4efe6',700);T(p.sc>p.rv?'올해는 내가 이겼다':p.sc<p.rv?'올해는 라이벌이 앞섰다':'팽팽했다',22,y+80,'rgba(244,239,230,.65)',400);}
  // 성장
  y=890;T(R.fd?'가장 많이 자란 발행인 역량':'가장 많이 자란 능력치',22,y,'#ffb547',700);const NN=R.N,SB=b[R.src]||{},SA=a[R.src]||{};
  (R.top.length?R.top:[]).forEach((k,i)=>{const yy=y+22+i*54;x.textAlign='left';x.font=`700 28px ${F}`;x.fillStyle='#f4efe6';x.fillText(NN[k],70,yy+30);const bx=300,bw=W-140-230-120,v=clamp(SB[k]||0,0,99),v0=clamp(SA[k]||0,0,99);x.fillStyle='rgba(255,255,255,.08)';x.fillRect(bx,yy+12,bw,20);x.fillStyle='#5f7fbf';x.fillRect(bx,yy+12,bw*v0/100,20);x.fillStyle='#5ad49b';x.fillRect(bx+bw*v0/100,yy+12,bw*Math.max(0,v-v0)/100,20);x.textAlign='right';x.font=`700 28px ${F}`;x.fillStyle='#5ad49b';x.fillText(`+${R.D[k].toFixed(1)}`,W-70,yy+30);});
  if(!R.top.length)T('올해는 제자리였다',26,y+60,'rgba(244,239,230,.7)',400);
  // 분기 등급
  y=1100;T(R.qs.length?'분기 평가':'한 해 정리',22,y,'#ffb547',700);const GC={S:'#ffb547',A:'#5ad49b',B:'#77a6ff',C:'#8a93a8',D:'#ff6b7a'};
  R.qs.slice(0,4).forEach((gr,i)=>{const gx=70+i*92;x.fillStyle=GC[gr]||'rgba(255,255,255,.1)';x.fillRect(gx,y+20,76,76);x.textAlign='center';x.font=`700 44px ${F}`;x.fillStyle='#11141c';x.fillText(gr,gx+38,y+74);});
  x.textAlign='left';x.font=`400 24px ${F}`;x.fillStyle='rgba(244,239,230,.8)';const fa=R.fd?Object.keys(FSTN).reduce((t,k)=>t+((a.fs||{})[k]||0),0)/Object.keys(FSTN).length:a.sk,fb=R.fd?Object.keys(FSTN).reduce((t,k)=>t+((b.fs||{})[k]||0),0)/Object.keys(FSTN).length:b.sk;x.fillText(`${R.fd?'발행인 역량':'종합 실력'} ${Math.round(fa)} → ${Math.round(fb)}${R.pk.length?` · 새 특기 ${R.pk.length}개`:''}`,R.qs.length?70+Math.min(4,R.qs.length)*92+16:70,y+68);
  x.fillStyle='rgba(255,255,255,.15)';x.fillRect(70,H-82,W-140,1.5);x.font=`400 20px ${F}`;x.fillStyle='rgba(244,239,230,.55)';x.textAlign='left';x.fillText('바이라인 BYLINE · 기자 커리어 시뮬레이션',70,H-44);x.textAlign='right';x.fillText(`${b.o}`,W-70,H-44);
  return cv;}
function yrShow(rep){if(!rep)return;const R=yrBuild(rep.a,rep.b);let cv=null,url='';try{cv=yrDraw(R);url=cv.toDataURL('image/png');}catch(e){}
  const p=R.p;const lines=[R.fd&&rep.b.co?`구독·후원 ${Math.abs(rep.b.co.subs)<1?Math.round(rep.b.co.subs*10000).toLocaleString('ko-KR')+'명':f1(rep.b.co.subs)+'만 명'} · 회사 자금 ${eok(rep.b.co.cash)} · 기자 ${Math.round(rep.b.co.staff)}명`:'',`기사 ${p.arts}건 · 단독 ${p.sc}건 · 오보 ${p.er}건${p.awM?` · 기자상 ${p.awM}회`:''}${p.aw>p.awM?` · 이달의 기자상 ${p.aw-p.awM}회`:''}`,R.top.length?`가장 많이 자란 것 — ${R.top.map(k=>`${R.N[k]} +${R.D[k].toFixed(1)}`).join(' · ')}`:'',R.pk.length?`올해 얻은 특기 — ${R.pk.map(x=>x.n).join(' · ')}`:''].filter(Boolean);
  openModal(`${2027+rep.a.y}년 · 올해의 나`,`${url?`<img src="${url}" alt="올해의 나 카드" class="yr-img">`:''}<p class="lede">올해의 키워드 — <b>${esc(R.title)}</b></p><ul class="qr-next">${lines.map(l=>`<li>${esc(l)}</li>`).join('')}</ul><p class="hint">이미지를 길게 누르거나 저장 단추로 내려받아 공유해 보자.</p>`,
   [{label:'확인',cls:'rec'},...(url?[{label:'이미지 저장',fn:()=>{try{const a=document.createElement('a');a.href=url;a.download=`byline_${S.name}_${2027+rep.a.y}.png`;document.body.appendChild(a);a.click();a.remove();}catch(e){toast('이 화면에선 저장할 수 없다. 이미지를 길게 눌러 저장하자');}return false;}}]:[]),
    ...(cv&&navigator.share?[{label:'공유하기',fn:()=>{cv.toBlob(bl=>{try{navigator.share({files:[new File([bl],'byline_year.png',{type:'image/png'})],title:'바이라인 · 올해의 나'}).catch(()=>{});}catch(e){toast('공유를 지원하지 않는 기기다');}});return false;}}]:[])]);}
{const _em79=endMonth;endMonth=function(){yrEnsure();const y0=S&&S.yr79?S.yr79.y:null;const r=_em79.apply(this,arguments);
  try{if(S&&S.phase==='game'&&y0!=null&&yrIdx()!==y0){const a=S.yr79,b=yrSnap();const R=yrBuild(a,b);const rep={a,b};
    S.yrH=(S.yrH||[]).concat([{y:a.y,title:R.title,sc:R.p.sc,sum:+R.sum.toFixed(1),rep}]).slice(-10);S.yrH.forEach((x,i)=>{if(i<S.yrH.length-3)delete x.rep;});
    S.yr79=yrSnap();if(!S.story0)Q.push(()=>yrShow(rep));}}catch(e){}return r;};}
// 성장 기록 화면에 지난해 카드
{const _om79=openModal;openModal=function(t,b,c){try{if(t==='성장 기록 · 분기별'&&Array.isArray(c)&&(S.yrH||[]).length){c=c.slice();c.splice(1,0,...S.yrH.filter(x=>x.rep).slice().reverse().map(x=>({label:`🗓 ${2027+x.y}년 · ${x.title}`,sub:'올해의 나 카드 다시 보기',fn:()=>{yrShow(x.rep);return false;}})));}}catch(e){}return _om79.call(this,t,b,c);};}
(function(){try{const st=document.createElement('style');st.textContent=`.yr-img{display:block;width:100%;max-width:420px;margin:0 auto 10px;border-radius:14px;box-shadow:0 10px 30px rgba(0,0,0,.4)}`;document.head.appendChild(st);}catch(e){}})();
