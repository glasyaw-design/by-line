/* 바이라인 1.6 — src/systems/era-front.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


RUN.cfile=()=>caseAct();function v12Road(){if(S.story)return '';let h='';try{h+=caseBox()+meProfileBox();}catch(e){console.error(e);}return h;}
function v12World(){if(S.story||S.phase!=='game')return '';try{return oidCard()+worldBox();}catch(e){console.error(e);return '';}}
RUN.spec=()=>spec2Act();
function figBox(){if(!S.figs||!S.figs.length)return '';return `<div class="card"><div class="t">${ic('users')} 함께 늙어 가는 사람들</div>${S.figs.map(f=>{const s=figSrc(f),F=FIG_DEF[f.k];const steps=F.path.length;const p=f.top?steps:f.st;return `<div class="meta" style="display:flex;justify-content:space-between;gap:8px;margin-top:6px"><span><b style="color:var(--fg)">${esc(f.name)}</b> · ${esc(s?s.role:F.path[f.st])}${f.fall?' · 끝난 인연':''}</span><span>${'●'.repeat(p)}${'○'.repeat(Math.max(0,steps-p))}${s?` · 신뢰 ${Math.round(s.trust)}`:''}</span></div>`;}).join('')}<p class="hint" style="margin:6px 0 0">${esc((S.figs[0]&&S.figs[0].intro)||'오래 알고 지낸')} 사람들이 커리어 내내 함께 자란다. 가까울수록 오를 때마다 먼저 귀띔해 준다.</p></div>`;}

// ----- 5) 시대: 판마다 다른 흐름. 경기 순환·선거 달력·감염병·미디어 변화·참사가 원인과 결과로 맞물린다 -----
// 효과: 경기(광고주 예산), 광고 매출, 실적 목표, 사업 매출, 트래픽·포털, 부서별 기사의 무게, 경영진 전략, AI 기자의 단독 몫
const ERA_DEF={
 boom:{n:'호황',g:'경기',d:'기업들이 투자·광고를 늘린다',econ:1.06,ad:1.04,goal:1.04,biz:1.08,imp:{eco:1.05,stock:1.1,estate:1.08},next:'호황이 길어지면 집값·주가에 거품이 낀다',tip:'광고 단가를 올리고 사업을 넓힐 때',desk:''},
 bubble:{n:'자산 거품',g:'경기',d:'집값·주가가 들썩이고 광고가 넘친다',econ:1.08,ad:1.06,goal:1.06,biz:1.05,imp:{estate:1.3,stock:1.3,fin:1.15},next:'거품은 언젠가 꺼진다 — 금융·부동산 기사를 쥐고 있자',tip:'벌 때 현금을 쌓아 둘 때',desk:'편집국: 부동산·증권 담당을 늘렸다'},
 crash:{n:'금융 위기',g:'경기',d:'거품이 꺼졌다. 기업들이 광고·협찬부터 끊는다',econ:.86,ad:.9,goal:.88,biz:.85,imp:{fin:1.4,stock:1.35,eco:1.3,estate:1.2},co:'cost',next:'위기는 대개 긴 불황으로 번진다',tip:'비용을 줄이고 금융·경제 단독을 노릴 때',desk:'편집국: 경제·금융부에 인력을 몰아 위기 진단 기획에 들어갔다'},
 recession:{n:'장기 불황',g:'경기',d:'소비가 얼어붙고 구조조정 소식이 이어진다',econ:.92,ad:.95,goal:.93,biz:.9,imp:{eco:1.15,labor:1.2,soc:1.1,ind:1.1},co:'cost',next:'바닥을 지나면 회복기가 온다',tip:'인건비·시설 투자를 아끼고 버틸 때',desk:'편집국: 서민 경제·일자리 기획을 늘렸다'},
 recovery:{n:'회복기',g:'경기',d:'바닥을 지나 지표가 하나둘 돌아선다',econ:1,ad:1.01,goal:1,imp:{eco:1.05,ind:1.05},next:'회복이 이어지면 다시 호황이 온다',tip:'줄였던 투자를 다시 시작할 때',desk:''},
 trade:{n:'무역 분쟁',g:'경기',d:'관세 전쟁에 수출 기업들이 움츠러든다',econ:.97,ad:.98,goal:.98,imp:{diplo:1.25,ind:1.2,eco:1.1},tip:'외교·산업 기사가 뜰 때',desk:''},
 tech:{n:'기술 붐',g:'경기',d:'IT·플랫폼 기업이 쏟아지고 광고를 늘린다',ad:1.03,goal:1.02,imp:{it:1.3,ind:1.1},tip:'IT 광고주와 손잡을 때',desk:''},
 estate:{n:'부동산 폭등',g:'경기',d:'집값이 매주 신고가를 쓴다',ad:1.02,imp:{estate:1.35},tip:'건설·분양 광고가 붙을 때',desk:''},
 pandemic:{n:'감염병 유행',g:'보건',d:'행사·포럼이 줄줄이 취소되고 의료 기사가 쏟아진다',econ:.95,ad:.97,goal:.95,biz:.6,trG:.006,imp:{med:1.45,soc:1.15,edu:1.15},co:'digital',next:'유행이 길어지면 비대면이 일상이 된다',tip:'오프라인 사업 대신 디지털로 버틸 때',desk:'편집국: 의료·사회부 중심 비상 취재 체제로 바꿨다'},
 contactless:{n:'비대면 전환',g:'보건',d:'일도 공부도 화면 앞에서. 온라인 트래픽이 늘어난다',tr:1.08,trG:.004,biz:.85,imp:{it:1.15,edu:1.1},co:'digital',next:'유행이 잦아들면 일상 회복이 온다',tip:'구독·앱·뉴스레터를 키울 때',desk:''},
 reopen:{n:'일상 회복',g:'보건',d:'멈췄던 행사와 공연이 한꺼번에 돌아온다',biz:1.15,ad:1.02,imp:{cul:1.15,spo:1.1,ent:1.1},tip:'포럼·행사 사업을 다시 열 때',desk:''},
 elect_pres:{n:'대선 정국',g:'정치',d:'대선이 다가온다. 정치 기사와 트래픽이 치솟는다',ad:1.03,tr:1.06,imp:{pol:1.4,city:1.1},next:'선거가 끝나면 새 정부가 출범한다',tip:'정치부 단독이 가장 비쌀 때',desk:'편집국: 대선 취재단을 꾸렸다'},
 elect_gen:{n:'총선 정국',g:'정치',d:'국회의원 선거가 다가온다',ad:1.02,tr:1.03,imp:{pol:1.3},tip:'정당·후보 관계가 출렁일 때',desk:''},
 elect_local:{n:'지방선거',g:'정치',d:'시장·도지사·의원 선거. 지역 기사의 무게가 커진다',ad:1.02,adLocal:1.06,imp:{city:1.35,loc:1.3,nat:1.2,pol:1.1},tip:'지역 매체가 빛날 때',desk:''},
 honeymoon:{n:'새 정부 출범',g:'정치',d:'정책 발표가 쏟아지고 정부 광고가 붙는다',ad:1.02,imp:{pol:1.1,eco:1.05,soc:1.05},next:'임기 중반엔 권력형 비리가 터지곤 한다',tip:'정책 검증 기사를 쌓을 때',desk:''},
 gate:{n:'권력형 게이트',g:'정치',d:'정권 핵심을 둘러싼 의혹이 꼬리를 문다',tr:1.05,imp:{pol:1.35,inv:1.3,court:1.25},next:'민심이 들끓으면 거리로 번진다',tip:'탐사 단독 하나가 회사를 바꿀 때',desk:'편집국: 정치·탐사 합동 취재팀을 꾸렸다'},
 protest:{n:'광장의 계절',g:'정치',d:'주말마다 광장이 가득 찬다',tr:1.08,imp:{pol:1.3,soc:1.25},tip:'현장 기사와 신뢰가 함께 오를 때',desk:''},
 portal:{n:'포털 개편',g:'미디어',d:'포털이 뉴스 배치를 바꿨다. 트래픽이 뚝 떨어진다',portal:.85,tr:.9,co:'digital',next:'플랫폼이 흔들리면 영상의 시대가 온다',tip:'직접 독자(구독·앱)를 늘릴 때',desk:''},
 video:{n:'영상·숏폼 시대',g:'미디어',d:'독자들이 글 대신 영상으로 뉴스를 본다',portal:.95,trTV:1.1,tr:.95,imp:{ent:1.1},co:'digital',next:'그다음은 AI가 뉴스를 요약하는 시대다',tip:'방송감 있는 기자와 영상 팀이 빛날 때',desk:''},
 ainews:{n:'AI 뉴스 시대',g:'미디어',d:'단신은 AI가 요약하고, 사람 기자의 단독·탐사만 남는다',portal:.92,tr:.95,imp:{inv:1.25,court:1.1},co:'defend',tip:'받아쓰기 대신 단독·탐사로 승부할 때',desk:''},
 disaster:{n:'대형 참사',g:'재난',d:'전국이 슬픔에 잠겼다. 광고도 자제한다',ad:.97,imp:{soc:1.3,case:1.35,nat:1.15},next:'참사 뒤엔 안전 점검 정국이 이어진다',tip:'현장을 지킨 기사가 오래 남을 때',desk:'편집국: 사회부 전원이 현장으로 갔다'},
 safety:{n:'안전 점검 정국',g:'재난',d:'참사 뒤 책임 규명과 안전 점검이 이어진다',imp:{soc:1.15,case:1.15,ind:1.1},tip:'책임을 끝까지 묻는 기사가 통할 때',desk:''},
 climate:{n:'기후 재난의 여름',g:'재난',d:'폭우·폭염이 번갈아 덮친다',imp:{soc:1.2,nat:1.2,loc:1.1},tip:'지역 현장 기사가 뜰 때',desk:''},
 olympic:{n:'올림픽',g:'스포츠',d:'메달 소식에 스포츠 기사와 광고가 뜬다',ad:1.02,tr:1.04,imp:{spo:1.35,base:1.05,foot:1.1},tip:'',desk:''},
 worldcup:{n:'월드컵',g:'스포츠',d:'온 나라가 축구 이야기뿐이다',ad:1.02,tr:1.05,imp:{spo:1.3,foot:1.4},tip:'',desk:''}};
/* [옮김] function eraGen → src/compat/_hoisted.js (원래 이 자리. 함수 선언은 끌어올려지므로 앞 파일에 둬야 원본과 같다) */
function eraEnsure(){if(!S||S.story||S.phase!=='game')return;try{eraX();}catch(e){}if(S.eras&&S.eraV===2&&S.eras.every(x=>ERA_DEF[x.k]))return;S.eras=eraGen();S.eraV=2;S.eraSeen={};}
function eraNow(){if(!S||!S.eras||S.eraV!==2)return [];return S.eras.filter(x=>ERA_DEF[x.k]&&S.turn>=x.s&&S.turn<x.e);}
function eraHas(k){return eraNow().some(x=>x.k===k);}
function eraMul(f,dflt=1){return eraNow().reduce((a,x)=>a*((ERA_DEF[x.k][f])??dflt),1);}
function eraEcon(){return clamp(eraMul('econ'),.82,1.12);}
// 출입처(세부 부서) 효과는 상위 분류 기사에도 절반쯤 번진다
function eraImp(cat){return clamp(eraNow().reduce((a,x)=>{const M=ERA_DEF[x.k].imp||{};let v=M[cat]||1;if(v===1)for(const k in M){if(DEPTS[k]&&(DEPTS[k].c||[k])[0]===cat)v=Math.max(v,1+(M[k]-1)*.5);}return a*v;},1),.8,1.55);}
function eraImpT(t){try{return Math.max(eraImp(t[0]),t[6]?eraImp(t[6]):1);}catch(e){return 1;}}
function eraImpD(d){try{return Math.max(eraImp(d),...catOf(d).map(eraImp));}catch(e){return 1;}}
function eraBiz(){return clamp(eraMul('biz'),.5,1.3);}
function eraTr(){let k=eraMul('tr');try{if(isTV())k*=eraMul('trTV');}catch(e){}if(eraNow().some(x=>ERA_DEF[x.k].g==='미디어')&&(hasF('app')||S.coMode==='digital'))k=Math.min(1.1,k*1.08);return clamp(k,.75,1.25);}
function eraTrG(){return eraNow().reduce((a,x)=>a+(ERA_DEF[x.k].trG||0),0);}
function eraAd(){let k=eraMul('ad');try{if(OUT().type==='local')k*=eraMul('adLocal');}catch(e){}return clamp(k,.82,1.15);}
function eraGoal(){return clamp(eraMul('goal'),.85,1.1);}
function eraPortal(){return clamp(eraMul('portal'),.75,1.05);}
// 경영진 AI: 시대를 읽고 전략을 고른다 (위기·불황엔 비용, 감염병·플랫폼 변화엔 디지털, AI 뉴스 시대엔 보도 품질)
function eraCoBias(m,cashM){const L=eraNow().map(x=>ERA_DEF[x.k].co).filter(Boolean);if(!L.length||m==='cost')return m;
  if(L.includes('cost')&&cashM<6)return 'cost';if(L.includes('digital')&&m==='steady'&&cashM>=2.5)return 'digital';if(L.includes('defend')&&m==='steady'&&chance(.5))return 'defend';return m;}
function eraMonth(lines){if(!S.eras||S.eraV!==2)return;S.eraSeen=S.eraSeen||{};const big=k=>!['olympic','worldcup','elect_gen','elect_local'].includes(k);
  S.eras.forEach((x,i)=>{const D=ERA_DEF[x.k];if(!D)return;const key=i+'';
    if(S.turn>=x.s&&S.turn<x.e&&!S.eraSeen[key]){S.eraSeen[key]=1;const good=['boom','bubble','recovery','reopen','tech','honeymoon','olympic','worldcup'].includes(x.k);
      lines.push({c:good?'g':big(x.k)?'r':'',t:`${big(x.k)?'시대가 바뀐다 · ':'시대 · '}${D.n} — ${x.why?x.why+' ':''}${D.d}`});if(big(x.k))tick(`${D.n}: ${x.why||D.d}`,1);
      if(D.desk&&!S.founder&&S.rank<=6)lines.push({c:'',t:D.desk});
      if(D.co&&S.co&&!S.founder&&S.rank<7)lines.push({c:'',t:`경영진: ${D.co==='cost'?'비상 경영 — 비용부터 줄이자는 지시가 내려왔다':D.co==='digital'?'디지털 전환에 예산을 더 붙인다':'받아쓰기보다 단독·탐사에 힘을 싣는다'}`});}
    if(S.turn>=x.e&&S.eraSeen[key]===1){S.eraSeen[key]=2;if(big(x.k))lines.push({c:'',t:`${D.n}의 시기가 지나갔다${D.next?` — ${D.next}`:''}`});}});}
function eraFx(D){const L=[];const pc=v=>`${v>1?'+':''}${Math.round((v-1)*100)}%`;if(D.ad&&D.ad!==1)L.push(`광고 ${pc(D.ad)}`);if(D.goal&&D.goal!==1)L.push(`광고 목표 ${pc(D.goal)}`);if(D.biz&&D.biz!==1)L.push(`사업 ${pc(D.biz)}`);if(D.tr&&D.tr!==1)L.push(`트래픽 ${pc(D.tr)}`);if(D.portal&&D.portal!==1)L.push(`포털 ${pc(D.portal)}`);
  const im=Object.entries(D.imp||{}).filter(([k,v])=>DEPTS[k]&&v>=1.15).slice(0,3).map(([k])=>DEPTS[k].n);if(im.length)L.push(`${im.join('·')} 기사↑`);return L.join(' · ');}
/* [옮김] function eraBox → src/compat/_hoisted.js (원래 이 자리. 함수 선언은 끌어올려지므로 앞 파일에 둬야 원본과 같다) */

// ----- 6) 커리어 1면: 판이 끝나면 내 대표 기사들로 신문 1면 한 장을 만든다 (이미지로 저장·공유) -----
function frontTops(){return (S.clips||[]).filter(c=>!c.staff&&c.by===S.name).slice().sort((a,b)=>(b.imp||0)*(b.excl?1.3:1)-(a.imp||0)*(a.excl?1.3:1)).slice(0,4).map(c=>({h:c.h,p:c.place||'',d:c.date||'',o:c.o||''}));}
function frontDraw(run){const W=1080,H=1350,cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');const tops=run.tops||[];
  const serif="'Noto Serif KR','Nanum Myeongjo','Batang',serif",sans="'IBM Plex Sans KR','Noto Sans KR',sans-serif";
  x.fillStyle='#f3eee2';x.fillRect(0,0,W,H);x.fillStyle='rgba(120,100,60,.06)';for(let i=0;i<220;i++)x.fillRect(Math.random()*W,Math.random()*H,2,2);
  x.fillStyle='#1c1a16';x.textAlign='center';x.font=`900 92px ${serif}`;x.fillText(run.o||'바이라인 일보',W/2,140);
  x.fillRect(60,170,W-120,4);x.fillRect(60,180,W-120,1.5);x.font=`500 22px ${sans}`;x.textAlign='left';x.fillText(`${run.d||''}`,64,214);x.textAlign='right';x.fillText(`기자 ${run.nm} 특별판`,W-64,214);
  x.fillRect(60,232,W-120,1.5);
  const wrap=(t,font,maxW,lh,y0,max)=>{x.font=font;const out=[];let line='';for(const ch of String(t)){const tt=line+ch;if(x.measureText(tt).width>maxW&&line){out.push(line);line=ch;}else line=tt;}if(line)out.push(line);out.slice(0,max).forEach((l,i)=>x.fillText(l,64,y0+i*lh));return y0+Math.min(out.length,max)*lh;};
  x.textAlign='left';x.fillStyle='#b3261e';x.font=`800 24px ${sans}`;x.fillText(tops[0]&&/^\[단독\]/.test(tops[0].h)?'단독':'톱',64,290);x.fillStyle='#1c1a16';
  let y=wrap(tops[0]?tops[0].h.replace(/^\[단독\] /,''):'아직 대표 기사가 없다',`900 66px ${serif}`,W-128,82,346,3);
  x.font=`500 24px ${sans}`;x.fillStyle='#57524a';x.fillText(`${run.nm} 기자 · ${tops[0]?tops[0].p+' · '+tops[0].d:''}`,64,y+8);y+=40;
  const ph={x:64,y,w:W-128,h:330};x.fillStyle='#d9d1bf';x.fillRect(ph.x,ph.y,ph.w,ph.h);cv._ph=ph;x.fillStyle='#57524a';x.font=`500 19px ${sans}`;x.fillText(`▲ ${run.o} 편집국. ${run.nm} 기자가 ${run.yrs}년을 보낸 곳이다.`,64,y+ph.h+28);y+=ph.h+52;
  x.fillStyle='#1c1a16';x.fillRect(60,y,W-120,2);y+=40;const colW=(W-128-40)/3;
  tops.slice(1,4).forEach((t,i)=>{const cx=64+i*(colW+20);x.save();x.translate(cx-64,0);x.fillStyle='#1c1a16';const yy=wrap(t.h.replace(/^\[단독\] /,''),`800 30px ${serif}`,colW,40,y+10,4);x.font=`500 19px ${sans}`;x.fillStyle='#6a6458';x.fillText(`${t.p} · ${t.d}`,64,yy+6);x.restore();});
  {const bx=[['최종 직급',run.rn],['기자 생활',`${run.yrs}년`],['단독',`${run.ex}건`],['기자상',`${run.aw}회`]];const by=H-250,bw=(W-128-30)/4;bx.forEach((b,i)=>{const bx0=64+i*(bw+10);x.fillStyle='#e6dfcf';x.fillRect(bx0,by,bw,110);x.fillStyle='#6a6458';x.font=`600 19px ${sans}`;x.textAlign='center';x.fillText(b[0],bx0+bw/2,by+38);x.fillStyle='#1c1a16';x.font=`800 30px ${serif}`;x.fillText(String(b[1]),bx0+bw/2,by+82);});x.textAlign='left';x.fillStyle='#57524a';x.font=`500 20px ${sans}`;x.fillText(`엔딩 「${run.end}」`,64,by-18);}
  x.fillStyle='#1c1a16';x.fillRect(60,H-110,W-120,1.5);x.font=`700 22px ${sans}`;x.textAlign='left';x.fillText('바이라인 BYLINE · 기자 커리어 시뮬레이션',64,H-70);x.textAlign='right';x.font=`500 20px ${sans}`;x.fillText(`점수 ${run.sc}`,W-64,H-70);
  return cv;}
function frontOpen(run){run=run||S.runRec;if(!run)return;if(!run.tops||!run.tops.length)run.tops=frontTops();const cv=frontDraw(run);let url=cv.toDataURL('image/png');
  // 사진 자리에 편집국 장면을 앉힌다
  try{const src=IMG.sc_newsroom||IMG.paper_front;if(src){const im=new Image();im.onload=()=>{const p=cv._ph,x=cv.getContext('2d');const r=Math.max(p.w/im.width,p.h/im.height),sw=p.w/r,sh=p.h/r;x.drawImage(im,(im.width-sw)/2,(im.height-sh)/2,sw,sh,p.x,p.y,p.w,p.h);x.globalAlpha=.12;x.fillStyle='#a08350';x.fillRect(p.x,p.y,p.w,p.h);x.globalAlpha=1;url=cv.toDataURL('image/png');const el=document.getElementById('frontImg');if(el)el.src=url;};im.src=src;}}catch(e){}
  openModal('내 커리어 1면',`<img id="frontImg" src="${url}" alt="커리어 1면" style="width:100%;border-radius:10px;display:block"><p class="hint" style="margin:8px 0 0">이미지를 길게 누르거나 저장 단추로 내려받아 친구에게 보내 보자.</p>`,[
   {label:'이미지 저장',fn:()=>{try{const a=document.createElement('a');a.href=url;a.download=`byline_${run.nm||'career'}.png`;document.body.appendChild(a);a.click();a.remove();}catch(e){toast('저장할 수 없는 화면이다. 이미지를 길게 눌러 저장해 주세요');}return false;}},
   ...(navigator.share?[{label:'공유하기',fn:()=>{cv.toBlob(b=>{try{const f=new File([b],'byline.png',{type:'image/png'});navigator.share({files:[f],title:'바이라인 · 내 커리어 1면'}).catch(()=>{});}catch(e){toast('공유를 지원하지 않는 기기다');}});return false;}}]:[]),
   {label:'닫기',cls:'ghost'}]);}

function legacyAvail(){return LEGACY.filter(l=>l.ok());}
// 판 시작: 유산·도전 고르기
function runSetup(){if(!S||S.phase!=='game'||S.dev||S.story)return;try{ensure12();}catch(e){}if(S.simple&&S.mgOff==null)S.mgOff=true;if(S.founder&&!S.oid){oidPick(()=>runSetup());return;}if(!S.traits){traitPick(()=>runSetup0());return;}runSetup0();}
function runSetup0(){if(!S||S.phase!=='game'||S.dev||S.story)return;const L=legacyAvail(),hard=S.diff==='hard';const C=CHAL.filter(c=>(S.founder?['major','award','scoop','mgroup'].includes(c.id):!['major','mgroup'].includes(c.id))&&chalOK43(c));
  const pickChal=()=>openModal('이번 판의 도전',`<p>도전 과제를 하나 걸면, 해냈을 때 기록실에 칭호가 남는다. 걸지 않아도 된다.</p>`,C.map(c=>({label:chImg(c.id,'cs')+c.n+((META.chal||{})[c.id]?' ✓':''),sub:c.d,fn:()=>{S.chal=c.id;log(`도전 과제: ${c.n}`);toast(`도전: ${c.n}`);endGoalPick();return false;}})).concat([{label:'도전 없이 시작',cls:'ghost',fn:()=>{endGoalPick();return false;}}]));
  if(!S.founder&&S.rank===0&&!S.opScoop)S.opScoop=1;
  if(L.length&&!hard){openModal('지난 판이 남긴 것',`<p class="lede">지난 판의 내가 길을 닦아 뒀다. ${dexPts()>=4?'두 개까지':'하나만'} 고를 수 있다.</p><p class="hint">유산은 작은 보너스다. 어려움 난이도에선 쓸 수 없다.</p>`,L.map(l=>({label:l.n,sub:l.d,fn:()=>{try{l.fx();}catch(e){}S.legacy=l.id;log(`유산: ${l.n}`);const L2=L.filter(x=>x!==l);if(dexPts()>=4&&L2.length){openModal('유산 하나 더',`<p class="lede">도감 보상으로 유산을 하나 더 고를 수 있다.</p>`,L2.map(x=>({label:x.n,sub:x.d,fn:()=>{try{x.fx();}catch(e){}S.legacy2=x.id;log(`유산: ${x.n}`);pickChal();return false;}})).concat([{label:'하나만 쓴다',cls:'ghost',fn:()=>{pickChal();return false;}}]));return false;}pickChal();return false;}})).concat([{label:'유산 없이 시작',cls:'ghost',fn:()=>{pickChal();return false;}}]));}
  else pickChal();}
// 판 끝: 기록 남기기
function runScore(){return Math.round(S.rank*14+(S.fame||0)*.6+(S.trust||0)*.4+(S.scoops||0)*2+(S.awards||0)*6-(S.errors||0)*4);}
function metaEnd(kind){if(!metaOn()||S.metaDone)return;S.metaDone=1;META=metaGet();try{META.gift=giftFor(kind);}catch(e){}const o=OUT();const best=(S.clips||[]).filter(c=>!c.staff).slice().sort((a,b)=>(b.imp||0)-(a.imp||0))[0];
  const ek=endDexKey(kind);if(ek){META.endings[ek]=META.endings[ek]||{n:0,d:realDate()};META.endings[ek].n++;}
  const goalOk=!!(S.endGoal&&ek===S.endGoal);if(goalOk)META.goalsOk=(META.goalsOk||0)+1;
  const ch=S.chal&&CHAL.find(c=>c.id===S.chal);let chOk=false;try{chOk=!!(ch&&ch.ok());}catch(e){}if(chOk)META.chal[ch.id]=realDate();
  const run={id:uid(),nm:S.name,rank:S.rank,rn:rankName(),o:o.n,oid:o.id,ot:o.type,end:kind,yrs:years(),age:myAge(),sc:runScore(),aw:S.awards||0,ex:S.scoops||0,f:S.founder?1:0,d:realDate(),best:best?{h:best.h,p:best.place||''}:null,chal:ch?ch.n:'',chOk,goal:S.endGoal||'',goalOk,tops:frontTops(),sty:S.styT&&STYLE[S.styT]?STYLE[S.styT].n:'',dept:DEPTS[S.dept]?DEPTS[S.dept].n:''};
  META.runs.unshift(run);if(META.runs.length>40)META.runs.length=40;
  if(best&&(best.imp||0)>=55){META.legend.unshift({h:best.h,nm:S.name,o:o.n,y:years()});if(META.legend.length>12)META.legend.length=12;}
  if(!S.founder&&S.rank>=3){META.npcs.unshift({nm:S.name,oid:o.id,o:o.n,rank:S.rank,rn:rankName()});if(META.npcs.length>12)META.npcs.length=12;}
  if(S.founder&&!/파산/.test(kind)&&S.custom){const c=S.custom;if(!META.founded.some(f=>f.n===c.n)){META.founded.unshift({n:c.n,type:c.type,lean:c.lean||'neu',p:clamp(o.p||2,2,4),by:S.name,depts:(o.depts||[]).slice(0,10).join(',')});if(META.founded.length>3)META.founded.length=3;}}
  metaSave();S.runRec=run;}
function metaMonth(){if(!metaOn())return;metaMark('outlets',S.outlet);metaMark('depts',S.dept);}
// 세계 연결: 내가 세운 매체가 다음 판에도 남는다
function metaInjectOutlets(){try{(META.founded||[]).forEach((f,i)=>{const id='lg'+i;if(OUTLETS.some(x=>x.id===id||x.n===f.n))return;const o=mkO(id,f.n,f.type,f.lean,'전 회차 창간 매체',f.p,`${jo2(f.by,'이','가')} 세운 ${TYPES[f.type]?TYPES[f.type].n:'매체'}. 지난 판의 내가 키운 회사다.`,f.depts?f.depts.split(',').filter(d=>DEPTS[d]):undefined);o.legacy=1;OUTLETS.push(o);});}catch(e){console.error(e);}}
// 지난 판 주인공이 이 회사 간부로
function legacyLeader(L){try{const o=OUT();const n=(META.npcs||[]).find(x=>x.oid===o.id&&x.nm!==S.name);if(n&&!S.metaLeadDone){S.metaLeadDone=1;if(n.rank>=6)L.ceo=n.nm;else L.chief=n.nm;S.legLead=n;}}catch(e){}}
// 편집국 전설: 지난 판 대표 특종이 회자된다
function legendTick(lines){if(!metaOn()||!META.legend.length||S.founder||!chance(.06))return;const g=pick(META.legend);if(g.nm===S.name)return;const fx=apply({kno:.3,men:1});lines.push({c:'g',t:`편집국 전설 — 선배들이 ${g.nm} 기자(${g.o})의 「${g.h}」 이야기를 한다. "그때 그 기사 하나로 판이 바뀌었지." (${fx})`});}
// 판 끝 결산: 다음 판 미리보기
function nextRunHTML(){if(S.dev||S.story)return '';META=metaGet();const eSeen=Object.keys(META.endings||{});const eLeft=END_DEX.filter(e=>!eSeen.includes(e[0]));
  const dSeen=Object.keys(META.depts||{});const dLeft=Object.keys(DEPT_SIG_OF).filter(d=>!dSeen.includes(d)&&DEPTS[d]);const sDone=Object.keys(META.stories||{}).length,cDone=Object.keys(META.chal||{}).length;
  const fam=pick([...new Set(dLeft.map(d=>DEPT_SIG_OF[d]))].filter(Boolean))||pick(Object.keys(DEPT_SIG));const F=DEPT_SIG[fam];
  const types={pol:'중앙 종합일간지',eco:'경제지',soc:'중앙 종합일간지',court:'중앙 종합일간지',inv:'중앙 종합일간지',intl:'통신사나 지상파 방송',cul:'중앙 종합일간지',spo:'스포츠지',loc:'지역 일간지'};
  const r=S.runRec;return `<div class="sec">기록실에 남았다</div>${r?`<p class="hint">${esc(r.nm)} · ${esc(r.rn)} · ${esc(r.o)} · ${r.yrs}년 · 점수 ${r.sc}${r.chal?` · 도전 「${esc(r.chal)}」 ${r.chOk?'<b style="color:var(--good)">성공</b>':'실패'}`:''}${r.goal?` · 목표 엔딩 「${esc(r.goal)}」 ${r.goalOk?'<b style="color:var(--good)">달성 · 도감 +2</b>':'다음 기회에'}`:''}</p>`:''}
   <div class="sec">아직 못 본 것</div><div class="kv nrk"><div><span>엔딩</span><b>${eLeft.length}/${END_DEX.length}</b></div><div><span>안 가 본 부서</span><b>${dLeft.length}곳</b></div><div><span>이야기</span><b>${sDone}/${SL.length}</b></div><div><span>도전 과제</span><b>${cDone}/${CHAL.length}</b></div></div>
   ${eLeft.length?`<p class="hint">못 본 엔딩 힌트 — ${eLeft.slice(0,2).map(e=>`「${esc(e[2])}」`).join(' · ')}</p>`:''}
   ${r?`<button type="button" class="btn pri" id="frontBtn" style="margin:10px 0">📰 내 커리어 1면 보기</button>`:''}
   ${F?`<div class="card nxt"><div class="t">${ic('flag')} 다음 판 추천 · ${esc(F[0])}</div><p class="hint" style="margin:4px 0 0">${esc(F[1])} ${types[fam]?`${jo2(types[fam],'으로','로')} 시작해 보자.`:''}</p></div>`:''}`;}
// 기록실
function hallOpen(tab){META=metaGet();tab=tab||'runs';const T=[['runs','명예의 전당'],['end','엔딩 도감'],['col','수집'],['chal','도전·유산']];const nav=`<div class="acat">${T.map(([k,n])=>`<button class="achip" data-hl="${k}" aria-pressed="${k===tab}" style="--c:var(--sodium)">${n}</button>`).join('')}</div>`;let body='';
  if(tab==='runs'){const R=META.runs.slice();const top=R.slice().sort((a,b)=>b.sc-a.sc).slice(0,5);body=R.length?`<div class="sec">최고 기록</div>${top.map((r,i)=>`<div class="card hrun"><div class="t">${i+1}. ${esc(r.nm)} · ${esc(r.rn)} <small>${esc(r.o)}</small></div><div class="meta"><span>점수 ${r.sc}</span><span>${r.yrs}년</span><span>단독 ${r.ex}</span><span>기자상 ${r.aw}</span><span>${esc(r.end)}</span>${r.chOk?`<span class="tag ok">${esc(r.chal)}</span>`:''}</div>${r.best?`<p class="hint" style="margin:4px 0 0">대표작 「${esc(r.best.h)}」</p>`:''}${r.tops&&r.tops.length?`<button type="button" class="achip" data-fr="${esc(r.id)}" style="--c:var(--sodium);margin-top:6px">📰 커리어 1면</button>`:''}</div>`).join('')}<div class="sec">최근 ${Math.min(10,R.length)}판</div>${R.slice(0,10).map(r=>`<p class="hint" style="margin:2px 0">${esc(r.d)} · ${esc(r.nm)} ${esc(r.rn)} (${esc(r.o)}) — ${esc(r.end)}</p>`).join('')}`:'<p class="empty">아직 끝낸 판이 없다. 한 판을 끝까지 가면 여기에 이름이 남는다.</p>';}
  if(tab==='end'){const E=META.endings||{};const im={retire:'end_retire',found:'end_found',fired:'end_fired'};body=`<p class="hint">본 엔딩 ${Object.keys(E).length}/${END_DEX.length}</p><div class="dex">${END_DEX.map(e=>{const s=E[e[0]];return `<div class="dx${s?'':' lock'}">${imgTag((typeof endArchKey==='function'&&endArchKey(e[0]))||im[e[1]],'dximg')}<b>${s?esc(e[0]):'???'}</b><small>${s?`${s.n}번 · 처음 ${esc(s.d)}`:esc(e[2])+(dexPts()>=4&&END_HOW[e[0]]?` — ${esc(END_HOW[e[0]])}`:'')}</small></div>`;}).join('')}</div>`;}
  if(tab==='col'){const st=META.stories||{},tt=Object.keys(META.titles||{}),ou=META.outlets||{},de=META.depts||{},sc=META.scenes||{};const SCN=['newsroom','briefing','exec','print','assembly','court','lobby','pub','rain','region','crime','airport','gov','roof','chair'];
    body=`<div class="kv"><div><span>이야기</span><b>${Object.keys(st).length}/${SL.length}</b></div><div><span>칭호</span><b>${tt.length}</b></div><div><span>다녀 본 회사</span><b>${Object.keys(ou).length}/${OUTLETS.filter(o=>!o.custom&&!String(o.id).startsWith('npc')).length}</b></div><div><span>거친 부서</span><b>${Object.keys(de).length}/${Object.keys(DEPT_SIG_OF).length}</b></div><div><span>본 장면</span><b>${SCN.filter(k=>sc[k]).length}/${SCN.length}</b></div></div>
     ${tt.length?`<div class="sec">칭호</div><div class="meta">${tt.map(t=>`<span class="tag so">${esc(t)}</span>`).join('')}</div>`:''}
     <div class="sec">장면 갤러리</div><div class="gal">${SCN.map(k=>sc[k]?imgTag('sc_'+k,'galimg'):'<div class="galimg lock"></div>').join('')}</div>
     <div class="sec">부서 도감</div><div class="meta">${Object.keys(DEPT_SIG_OF).filter(d=>DEPTS[d]).map(d=>`<span class="${de[d]?'tag ok':'tag'}">${de[d]?esc(DEPTS[d].n):'???'}</span>`).join('')}</div>`;}
  if(tab==='chal'){const C=META.chal||{};body=`${dexMsHTML()}<div class="sec">도전 과제 ${Object.keys(C).length}/${CHAL.length}</div>${CHAL.map(c=>`<div class="card chc">${chImg(c.id,'',!C[c.id])}<div class="t">${C[c.id]?'✓ ':''}${esc(c.n)}</div><p class="hint" style="margin:2px 0 0">${esc(c.d)}${C[c.id]?` · 달성 ${esc(C[c.id])}`:''}</p></div>`).join('')}<div class="sec">유산 (새 판 시작 때 1개 선택)</div>${LEGACY.map(l=>{const u=l.ok();return `<div class="card${u?'':' dim'}"><div class="t">${u?'':'🔒 '}${esc(l.n)}</div><p class="hint" style="margin:2px 0 0">${esc(l.d)} · ${u?'열림':'여는 법: '+esc(l.un)}</p></div>`;}).join('')}${(META.founded||[]).length?`<div class="sec">내가 세운 매체 (다음 판 회사 목록에 남는다)</div>${META.founded.map(f=>`<p class="hint">「${esc(f.n)}」 · ${esc(f.by)} 창간</p>`).join('')}`:''}`;}
  openModal('기록실',nav+body,[{label:'닫기',cls:'ghost'}]);document.querySelectorAll('#mb [data-hl]').forEach(b=>b.onclick=()=>hallOpen(b.dataset.hl));document.querySelectorAll('#mb [data-fr]').forEach(b=>b.onclick=()=>{const r=META.runs.find(x=>x.id===b.dataset.fr);if(r)frontOpen(r);});}