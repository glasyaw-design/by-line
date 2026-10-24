/* 바이라인 1.6 — src/compat/v38.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.42 창간 회사 재무 현실화 =====
// 예전: 직원 20명 남짓한 회사가 수익 사업·광고로 1년에 50억 넘게 남겼다 (사업 유지비가 매출의 1~5%뿐, 광고는 끝없이 커졌다).
// 이제: ① 수익 사업은 회사 규모(인원)만큼만 커진다 — 넘치면 덜 붙고, 사업 원가는 매출의 40%
//       ② 광고도 인원 대비 시장 한도를 넘으면 경쟁 매체 견제로 덜 붙는다
//       ③ 흑자엔 법인세(지방세 포함 9.9%/20.9%) · 적자는 이월결손금으로 다음 해 이익에서 먼저 뺀다
function bizCapM(){const st=(S.co&&S.co.staff)||8;return .03*st+.08;}
{const _bm38=bizMonth;bizMonth=function(){const r=_bm38.apply(this,arguments);if(!S||!S.founder||!r||!r.rev){if(S)S._bizSat=0;return r;}
  const cap=bizCapM(),h=cap*.6,R=r.rev;const e=R<=h?R:h+(cap-h)*(1-Math.exp(-(R-h)/(cap-h)));const k=R>0?e/R:1;let cost=0;
  r.list=r.list.map(x=>{const rv=x[1]*k,u=Math.max(x[2],rv*.4);cost+=u;return [x[0],rv,u];});r.rev=e;r.cost=cost;S._bizSat=R>e*1.04?+(1-k).toFixed(2):0;return r;};}
function fAdK38(){return .05*((S.co&&S.co.staff)||8)+.25;}
// 트래픽·CP 전재료도 인원 대비 한도: 넘친 만큼은 30%만 (포털 단가·클릭 경쟁)
function fTrK(x){if(!S||!S.founder||!S.co||!(x>0))return 1;const K=.035*(S.co.staff||8)+.15;return x<=K?1:(K+(x-K)*.3)/x;}
function fAdSoft(a){if(!S||!S.founder||!S.co)return a;const K=fAdK38();return a<=K?a:K+(a-K)*.35;}
function coTax(pr){if(!S||!S.founder||!S.co)return 0;const c=S.co;c.lossC=c.lossC||0;if(pr<=0){c.lossC=Math.min(c.lossC-pr,80);return 0;}
  const off=Math.min(c.lossC,pr);c.lossC-=off;const tb=pr-off;if(tb<=0)return 0;const A=tb*12;const tA=A<=2?A*.099:.198+(A-2)*.209;return +(tA/12).toFixed(4);}
// 달마다 손익 기록 (재정 탭)
function finRec(L){const c=S.co;const rp=L.rp||{ad:L.ad||0,subs:L.subsRev||0,tr:L.trRev||0,cp:L.cp||0,biz:L.bizRev||0,sales:(L.salesRev||0)*(L.seaA||1),fsup:L.fsup||0,sup:L.sup||0,base:0,one:L.one&&L.one.v>0?L.one.v:0};
  return {t:S.turn,mo:L.mo,rev:L.rev||0,cost:L.cost||0,tax:L.tax||0,pf:L.profit||0,cash:c.cash,rp,cb:L.cb||null,oth:0};}
{const _cm38=coMonth;coMonth=function(){const c=S.co;const c0=c?c.cash:0;const r=_cm38.apply(this,arguments);
  try{const H=(c.fin38H=c.fin38H||[]);const pv=H[H.length-1];if(pv&&pv.t<S.turn)pv.oth=+(c0-pv.cash).toFixed(3);H.push(finRec(c.last));if(H.length>36)H.shift();}catch(e){console.error(e);}return r;};}

// ===== 1.42 재정 탭 =====
const FIN_R=[['ad','광고','var(--siren)'],['subs','구독·후원','var(--good)'],['tr','트래픽(포털)','var(--sodium)'],['cp','CP 전재료','var(--pink)'],['sales','기자 영업(광고·협찬)','#7fb7ff'],['biz','수익 사업','var(--dev)'],['fsup','창업 지원금','#9be36b'],['sup','모회사·출자 지원','#c9b27a'],['base','기타 수입(행사·임대 등)','#8a8fa8'],['one','뜻밖의 수입','#d9c46b']];
const FIN_C=[['pers','인건비','var(--red)'],['fee','지면 제작·배송·플랫폼','#e08a5a'],['fac','시설 유지비','#c7799a'],['biz','수익 사업 원가','var(--dev)'],['sales','영업비(접대·수당)','#7fb7ff'],['extra','기타·일회성 비용','#8a8fa8']];
function fin38Sum(A){const z={rev:0,cost:0,tax:0,pf:0,r:{},c:{},cbOK:true,oth:0};A.forEach(x=>{z.rev+=x.rev;z.cost+=x.cost;z.tax+=x.tax;z.pf+=x.pf;z.oth+=x.oth||0;for(const k in x.rp)z.r[k]=(z.r[k]||0)+(x.rp[k]||0);
  if(x.cb){for(const k in x.cb)z.c[k]=(z.c[k]||0)+(x.cb[k]||0);}else z.cbOK=false;});return z;}
function fin38Sgn(v){return (v>=0?'+':'')+eok(v);}
function fin38Row(n,v,tot,col,cls){const w=tot>0?Math.max(0,Math.min(100,v/tot*100)):0;return `<div class="fr38 ${cls||''}"><span class="n"><i style="background:${col}"></i>${n}</span><span class="b"><i style="width:${w.toFixed(1)}%;background:${col}"></i></span><b>${eok(v)}</b><small>${tot>0?Math.round(v/tot*100)+'%':''}</small></div>`;}
function fin38Chart(H){const A=H.slice(-12);if(A.length<2)return '';const W=320,Ht=128,pad=16,bw=(W-8)/A.length;const mx=Math.max(...A.map(x=>Math.max(x.rev,x.cost+x.tax)),.01);const mn=Math.min(0,...A.map(x=>x.pf));const rng=mx-mn;const Y=v=>pad+(mx-v)/rng*(Ht-pad*2);
  let g='';A.forEach((x,i)=>{const x0=4+i*bw;const w=Math.max(2,bw*.36);g+=`<rect x="${(x0+bw*.12).toFixed(1)}" y="${Y(x.rev).toFixed(1)}" width="${w.toFixed(1)}" height="${(Y(0)-Y(x.rev)).toFixed(1)}" fill="var(--siren)" rx="1"><title>${x.mo}월 매출 ${eok(x.rev)}</title></rect><rect x="${(x0+bw*.5).toFixed(1)}" y="${Y(x.cost+x.tax).toFixed(1)}" width="${w.toFixed(1)}" height="${(Y(0)-Y(x.cost+x.tax)).toFixed(1)}" fill="var(--red)" opacity=".8" rx="1"><title>${x.mo}월 비용 ${eok(x.cost+x.tax)}</title></rect><text x="${(x0+bw/2).toFixed(1)}" y="${Ht-2}" font-size="9" fill="var(--mute)" text-anchor="middle">${x.mo}</text>`;});
  const pts=A.map((x,i)=>`${(4+i*bw+bw/2).toFixed(1)},${Y(x.pf).toFixed(1)}`).join(' ');
  g+=`<line x1="0" x2="${W}" y1="${Y(0).toFixed(1)}" y2="${Y(0).toFixed(1)}" stroke="var(--line)" stroke-width="1"/><polyline points="${pts}" fill="none" stroke="var(--good)" stroke-width="2"/>`+A.map((x,i)=>`<circle cx="${(4+i*bw+bw/2).toFixed(1)}" cy="${Y(x.pf).toFixed(1)}" r="2.6" fill="${x.pf>=0?'var(--good)':'var(--red)'}"><title>${x.mo}월 순이익 ${fin38Sgn(x.pf)}</title></circle>`).join('');
  return `<svg class="fch38" viewBox="0 0 ${W} ${Ht}" role="img" aria-label="최근 ${A.length}개월 매출·비용·순이익">${g}</svg><div class="flg38"><span><i style="background:var(--siren)"></i>매출</span><span><i style="background:var(--red)"></i>비용(세금 포함)</span><span><i style="background:var(--good)"></i>순이익</span><span style="margin-left:auto">최고 ${eok(mx)}</span></div>`;}
function fin38Cash(){const h=(S.co.hist||[]).slice(-24);if(h.length<2)return '';const W=320,Ht=70;const mx=Math.max(...h),mn=Math.min(...h,0);const r=(mx-mn)||1;const X=i=>(i/(h.length-1)*(W-4)+2).toFixed(1),Y=v=>(6+(mx-v)/r*(Ht-12)).toFixed(1);
  return `<svg class="spark" viewBox="0 0 ${W} ${Ht}" preserveAspectRatio="none" role="img" aria-label="회사 자금 추이"><line x1="0" x2="${W}" y1="${Y(0)}" y2="${Y(0)}" stroke="var(--line)"/><polyline points="${h.map((v,i)=>X(i)+','+Y(v)).join(' ')}" fill="none" stroke="var(--sodium)" stroke-width="2"/></svg><div class="flg38"><span>${h.length}개월 전 ${eok(h[0])}</span><span>최저 ${eok(Math.min(...h))}</span><span style="margin-left:auto">지금 ${eok(h[h.length-1])}</span></div>`;}
// 재무 담당 AI: 숫자를 읽고 대표·경영진에게 할 일을 짚어 준다
function fin38Advice(H,Y12){const c=S.co,L=c.last||{};const A=[];const a3=H.slice(-3);const avg=a3.length?a3.reduce((s,x)=>s+x.pf,0)/a3.length:0;const rv=Y12.rev||0;
  if(c.cash<0)A.push(['r',`회사 자금이 바닥이다(${eok(c.cash)}). 은행 한도에 닿으면 회사가 넘어간다. 비용 줄이기·투자 유치·사업 정리 중 하나는 이번 달에 해야 한다.`]);
  else if(avg<0){const m=Math.floor(c.cash/-avg);A.push([m<8?'r':'',`최근 석 달 평균 ${eok(-avg)}씩 적자 — 지금 자금으로 약 ${m}개월 버틴다.${m<8?' 비용부터 손봐야 한다.':''}`]);}
  const ad=(Y12.r&&Y12.r.ad)||0;if(rv>0&&ad/rv>.7)A.push(['',`매출의 ${Math.round(ad/rv*100)}%가 광고다. 광고주 한두 곳이 빠지면 바로 흔들린다 — 구독·후원이나 수익 사업을 늘려 두자.`]);
  if(S.founder&&S._bizSat>0)A.push(['',`수익 사업이 회사 덩치보다 크다. 기자 ${c.staff}명으로는 사업 수익이 ${Math.round(S._bizSat*100)}% 덜 붙는다 — 사업을 더 벌이기보다 인원을 늘리거나 품질을 키울 때다.`]);
  if(S.founder&&L.rp&&L.rp.ad!=null){const K=fAdK38();if(L.ad>K*1.02)A.push(['',`광고가 이 규모 매체의 시장 한도(월 약 ${eok(K)})를 넘었다. 경쟁 매체들이 단가를 깎아 견제해 넘친 부분은 35%만 붙는다.`]);}
  if(S.founder&&(c.lossC||0)>.05)A.push(['g',`이월결손금 ${eok(c.lossC)} — 흑자가 나도 이만큼은 법인세 없이 이익에서 먼저 뺀다.`]);
  if(rv>0&&Y12.pf/rv>.25&&c.cash>Math.max(3,rv*.5))A.push(['g',`이익률 ${Math.round(Y12.pf/rv*100)}%에 자금도 넉넉하다. 쌓아 두기보다 인재 채용·처우·탐사에 쓰면 매체가 더 큰다. 이익의 일부는 법인세로 나간다.`]);
  const per=(c.staff||1);if(rv>0&&H.length>=6){const pp=rv/(Math.min(12,H.length))/per;A.push(['',`직원 1명이 한 달에 ${eok(pp)}을 번다 (업계 평균 지역·인터넷 매체 약 800만~1,500만 원).`]);}
  if(!A.length)A.push(['g','큰 걱정거리는 없다. 이대로 가되 광고 비수기(1~2월·7~8월)엔 현금을 넉넉히 두자.']);
  return A.slice(0,5);}
function fin38HTML(){const c=S.co,o=OUT();if(!c)return '<p class="hint">아직 회사 재무 정보가 없다.</p>';
  const H=c.fin38H&&c.fin38H.length?c.fin38H:(c.last?[finRec(c.last)]:[]);const L=c.last;
  if(!H.length)return '<div class="sec">재정</div><p class="hint">한 달이 지나면 회사 손익이 집계된다.</p>';
  const P=S.finP==='y'?'y':'m';const use=P==='y'?H.slice(-12):H.slice(-1);const Z=fin38Sum(use);const Y12=fin38Sum(H.slice(-12));
  let jan=H.length-1;while(jan>0&&H[jan].mo!==1)jan--;const ytd=fin38Sum(H.slice(H[jan].mo===1?jan:0));
  const a3=H.slice(-3);const avg=a3.reduce((s,x)=>s+x.pf,0)/a3.length;
  const h12=(c.hist||[]);const ago=h12.length>12?h12[h12.length-13]:h12[0];
  const run=avg<0?`약 ${Math.max(0,Math.floor(c.cash/-avg))}개월`:'흑자 경영';
  const pc=v=>`style="color:${v>=0?'var(--good)':'var(--red)'}"`;
  let h=`<div class="fin38"><div class="ftop38">
   <div><span>회사 자금</span><b>${eok(c.cash)}</b><small ${pc(c.cash-(ago??c.cash))}>${ago!=null?`${h12.length>12?'1년':h12.length+'개월'} 전보다 ${fin38Sgn(c.cash-ago)}`:''}</small></div>
   <div><span>지난달 순이익</span><b ${pc(L?L.profit:0)}>${L?fin38Sgn(L.profit):'—'}</b><small>매출 ${L?eok(L.rev):'—'}${L&&L.rev>0?` · 이익률 ${Math.round(L.profit/L.rev*100)}%`:''}</small></div>
   <div><span>올해 누적 순이익</span><b ${pc(ytd.pf)}>${fin38Sgn(ytd.pf)}</b><small>${H.length-(H[jan].mo===1?jan:0)}개월 · 매출 ${eok(ytd.rev)}</small></div>
   <div><span>${avg<0?'버틸 수 있는 기간':'최근 석 달'}</span><b ${avg<0?'style="color:var(--red)"':pc(avg)}>${run}</b><small>평균 월 ${fin38Sgn(avg)}</small></div></div>`;
  h+=`<div class="fsw38" role="group" aria-label="기간"><button class="btn sm${P==='m'?'':' ghost'}" data-fin38="m" aria-pressed="${P==='m'}">지난달</button><button class="btn sm${P==='y'?'':' ghost'}" data-fin38="y" aria-pressed="${P==='y'}">최근 ${Math.min(12,H.length)}개월 합계</button></div>`;
  // 손익계산서
  const rt=Z.rev||0;h+=`<div class="sec">손익계산서 · ${P==='m'?(H[H.length-1].mo?H[H.length-1].mo+'월':'지난달'):`최근 ${use.length}개월`}</div><div class="card fpl38"><div class="fh38"><span>매출</span><b>${eok(rt)}</b></div>`;
  FIN_R.forEach(([k,n,col])=>{const v=Z.r[k]||0;if(v>.0005)h+=fin38Row(n,v,rt,col);});
  const ct=Z.cost||0;h+=`<div class="fh38"><span>비용</span><b>${eok(ct)}</b></div>`;
  if(Z.cbOK&&Object.keys(Z.c).length){const sumc=FIN_C.reduce((s,[k])=>s+(Z.c[k]||0),0);const kk=sumc>0?ct/sumc:1;FIN_C.forEach(([k,n,col])=>{const v=(Z.c[k]||0)*kk;if(v>.0005)h+=fin38Row(n,v,ct,col);});}
  else h+=`<p class="hint" style="margin:2px 0 6px">항목별 비용은 다음 달부터 집계된다.</p>`;
  const op=rt-ct;h+=`<div class="fh38 sub"><span>영업이익</span><b ${pc(op)}>${fin38Sgn(op)}</b></div>`;
  if(S.founder)h+=`<div class="fh38 sub"><span>법인세 <small>(지방세 포함 9.9%·20.9%)</small></span><b>${Z.tax>0?'-'+eok(Z.tax):'0원'}</b></div>`;
  h+=`<div class="fh38 tot"><span>순이익</span><b ${pc(Z.pf)}>${fin38Sgn(Z.pf)}</b></div>${rt>0?`<p class="hint" style="margin:4px 0 0">이익률 ${Math.round(Z.pf/rt*100)}% · 인건비 비중 ${Z.cbOK&&Z.c.pers?Math.round(Z.c.pers/(FIN_C.reduce((s,[k])=>s+(Z.c[k]||0),0)||1)*100)+'%':'—'}${S.founder&&(c.lossC||0)>.005?` · 이월결손금 ${eok(c.lossC)}`:''}</p>`:''}</div>`;
  // 추이
  if(H.length>=2)h+=`<div class="sec">최근 ${Math.min(12,H.length)}개월 추이</div><div class="card">${fin38Chart(H)}</div>`;
  // 자금 흐름
  const F=H.slice(-12);const st=F.length?F[0].cash-F[0].pf:c.cash;const othSum=F.slice(0,-1).reduce((s,x)=>s+(x.oth||0),0);
  h+=`<div class="sec">회사 자금 흐름 · 최근 ${F.length}개월</div><div class="card fcf38"><div class="fh38 sub"><span>처음 자금</span><b>${eok(st)}</b></div><div class="fh38 sub"><span>영업으로 번 돈 (순이익)</span><b ${pc(Y12.pf)}>${fin38Sgn(F.reduce((s,x)=>s+x.pf,0))}</b></div><div class="fh38 sub"><span>그 밖의 돈 <small>(시설·사업 투자, 계열사, 투자 유치, 배당, 사건)</small></span><b ${pc(othSum)}>${fin38Sgn(othSum)}</b></div><div class="fh38 tot"><span>지금 자금</span><b>${eok(c.cash)}</b></div>${fin38Cash()}</div>`;
  // 수익 사업
  if(L&&L.biz&&L.biz.length){h+=`<div class="sec">수익 사업 · 지난달</div><div class="card"><div class="ftb38 hd"><span>사업</span><span>매출</span><span>원가</span><span>이익</span></div>${L.biz.map(x=>`<div class="ftb38"><span>${esc(x[0])}</span><span>${eok(x[1])}</span><span>${eok(x[2])}</span><b ${pc(x[1]-x[2])}>${fin38Sgn(x[1]-x[2])}</b></div>`).join('')}${S.founder?`<p class="hint" style="margin:6px 0 0">사업 한도는 회사 규모를 따른다: 기자 ${c.staff}명 → 월 약 ${eok(bizCapM())}${S._bizSat>0?` · <span style="color:var(--red)">지금 ${Math.round(S._bizSat*100)}% 덜 붙는 중</span>`:''}</p>`:''}</div>`;}
  // 계열사
  if((S.sis||[]).length){h+=`<div class="sec">계열사 · 지난달</div><div class="card">${S.sis.map(x=>`<div class="ftb38 two"><span>${esc(x.n)} · ${x.lv}단계</span><b ${pc(x.pl||0)}>${x.pl!=null?fin38Sgn(x.pl):'—'}</b></div>`).join('')}<p class="hint" style="margin:6px 0 0">계열사 손익은 회사 자금에 바로 더해진다 (위 「그 밖의 돈」에 포함).</p></div>`;}
  // 광고주
  if(L&&L.adList&&L.adList.length){h+=`<div class="sec">큰 광고주 · 지난달 집행</div><div class="card">${L.adList.slice(0,6).map(x=>`<div class="ftb38 two"><span>${esc(x[0])}${x[3]?` <small style="color:var(--red)">${esc(x[3])}</small>`:''}</span><b>${eok(x[1])}</b></div>`).join('')}</div>`;}
  // 대표 보수
  if(S.founder){let fp=0;try{fp=founderPay();}catch(e){}const eq=(S.equity??100)/100;const cap=Math.max(.5,(c.staff||8)*.08);const exp=Math.max(0,Math.min((S.fPLy||0)*.3*eq,cap));
    h+=`<div class="sec">대표 보수</div><div class="kv"><div><span>월급</span><b>${fp.toLocaleString('ko-KR')}만</b></div><div><span>내 지분</span><b>${Math.round(eq*100)}%</b></div><div><span>올해 손익 (배당 기준)</span><b ${pc(S.fPLy||0)}>${fin38Sgn(S.fPLy||0)}</b></div><div><span>1월 예상 배당</span><b>${exp>0?Math.round(exp*10000).toLocaleString('ko-KR')+'만':'없음'}</b></div></div><p class="hint">배당 = 연간 이익 × 30% × 지분 · 한도 ${eok(cap)} (직원 × 800만) · 지금까지 받은 배당 ${(S.fDivTot||0).toLocaleString('ko-KR')}만 원</p>`;}
  // 재무 담당 의견
  if(S.founder||S.rank>=4){h+=`<div class="sec">재무 담당 의견</div><div class="card fai38">${fin38Advice(H,Y12).map(([cl,t])=>`<p class="${cl}">${esc(t)}</p>`).join('')}</div>`;}
  return h+'</div>';}
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-fin38]');if(!b)return;S.finP=b.dataset.fin38;try{render();}catch(x){}},true);

// ===== 1.42 회사 탭: 섹션을 접고 펼 수 있게 · 돈 이야기는 재정 탭으로 =====
const CS38_CLOSED={'경쟁사 동향':1,'우리 회사의 특성':1};
function cs38Key(t){return t.replace(/<[^>]+>/g,'').split(/ · | — /)[0].trim();}
function cs38Bal(x){return (x.match(/<div\b/g)||[]).length===(x.match(/<\/div>/g)||[]).length&&(x.match(/<details\b/g)||[]).length===(x.match(/<\/details>/g)||[]).length;}
function cs38Wrap(h){const SEC='<div class="sec">';const i0=h.indexOf(SEC);if(i0<0)return h;const pre=h.slice(0,i0);const parts=h.slice(i0).split(SEC).slice(1);
  const secs=parts.map(p=>{const j=p.indexOf('</div>');return {t:p.slice(0,j),b:p.slice(j+6)};});if(!secs.every(s=>cs38Bal(s.b)))return h;
  const FIN=/^(지난달 수익 구조|재무 · 지난달|회사 자금 추이)/;const st=S.cs38=S.cs38||{};let finDone=false;const L=S.co&&S.co.last;
  const out=secs.map(s=>{const plain=s.t.replace(/<[^>]+>/g,'');if(FIN.test(plain)){if(finDone)return '';finDone=true;
      return `<button class="card fgo38" data-tab="fin"><span><b>재정</b> 지난달 ${L?`매출 ${eok(L.rev)} · 순이익 <em style="color:${L.profit>=0?'var(--good)':'var(--red)'}">${fin38Sgn(L.profit)}</em>`:'집계 전'} · 자금 ${eok(S.co.cash)}</span><small>손익계산서·추이·자금 흐름 보기 ›</small></button>`;}
    const k=cs38Key(s.t);const open=st[k]!=null?st[k]:!CS38_CLOSED[k];
    return `<details class="cs38" data-cs="${esc(k)}"${open?' open':''}><summary>${s.t}</summary><div class="csb38">${s.b}</div></details>`;}).join('');
  const nav=secs.map(s=>cs38Key(s.t)).filter((k,i,a)=>k&&a.indexOf(k)===i&&!FIN.test(k));
  const k0=secs.length?cs38Key(secs[0].t):'';return pre+`<div class="csn38">${nav.map(k=>`<button class="chip" data-csj="${esc(k)}">${k===k0?'개요':esc(k)}</button>`).join('')}</div>`+out;}
document.addEventListener('toggle',e=>{const d=e.target;if(!d||!d.classList||!d.classList.contains('cs38'))return;(S.cs38=S.cs38||{})[d.dataset.cs]=d.open?1:0;},true);
document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-csj]');if(!b)return;const d=[...document.querySelectorAll('details.cs38')].find(x=>x.dataset.cs===b.dataset.csj);if(d){d.open=true;d.scrollIntoView({behavior:'smooth',block:'start'});}},true);
{const _tb38=tabBody;tabBody=function(){if(S&&S.tab==='fin'){try{return fin38HTML();}catch(e){console.error(e);return '<p class="hint">재정 정보를 불러오지 못했다.</p>';}}
  let h=_tb38.apply(this,arguments);try{if(S&&S.tab==='co')h=cs38Wrap(h);}catch(e){console.error(e);}return h;};}
(function(){const st=document.createElement('style');st.textContent=`
.ftop38{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:8px;margin-bottom:10px}
.ftop38>div{background:var(--panel2);border:2px solid var(--line);padding:8px 10px;min-width:0}
.ftop38 span{display:block;font-size:12px;color:var(--mute)}.ftop38 b{display:block;font-family:var(--f-pix);font-weight:400;font-size:18px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ftop38 small{display:block;font-size:11.5px;color:var(--mute);margin-top:2px;line-height:1.35}
.fsw38{display:flex;gap:6px;margin:0 0 4px;flex-wrap:wrap}
.fr38{display:grid;grid-template-columns:minmax(0,1.25fr) minmax(40px,1fr) auto 34px;gap:8px;align-items:center;padding:4px 0;font-size:13px}
.fr38 .n{display:flex;align-items:center;gap:6px;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.fr38 .n i{flex:0 0 9px;height:9px;border-radius:2px}
.fr38 .b{height:8px;background:var(--ink);border-radius:4px;overflow:hidden}.fr38 .b i{display:block;height:100%}
.fr38 b{font-weight:700;white-space:nowrap;text-align:right}.fr38 small{color:var(--mute);text-align:right;font-size:11.5px}
.fh38{display:flex;justify-content:space-between;gap:8px;align-items:baseline;padding:7px 0 4px;border-top:1px solid var(--line);font-weight:700}
.fh38:first-child{border-top:0;padding-top:0}.fh38 span{min-width:0}.fh38 b{white-space:nowrap}.fh38 small{font-weight:400;color:var(--mute);font-size:11px}
.fh38.sub{font-weight:400;font-size:13.5px}.fh38.tot{border-top:2px solid var(--fg);font-size:15.5px;margin-top:2px}
.fch38{width:100%;height:auto;display:block}.flg38{display:flex;flex-wrap:wrap;gap:4px 12px;font-size:11.5px;color:var(--mute);margin-top:4px}.flg38 i{display:inline-block;width:9px;height:9px;border-radius:2px;margin-right:4px;vertical-align:-1px}
.ftb38{display:grid;grid-template-columns:minmax(0,1.6fr) repeat(3,minmax(0,1fr));gap:6px;padding:5px 0;border-top:1px solid var(--line);font-size:13px;align-items:baseline}
.ftb38:first-child{border-top:0}.ftb38.hd{font-size:11.5px;color:var(--mute);padding-top:0}.ftb38>*:not(:first-child){text-align:right;white-space:nowrap}.ftb38>span:first-child{min-width:0;overflow-wrap:anywhere}
.ftb38.two{grid-template-columns:minmax(0,1fr) auto}
.fai38 p{margin:0 0 6px;padding-left:12px;border-left:3px solid var(--line);font-size:13.5px;line-height:1.5}.fai38 p:last-child{margin-bottom:0}.fai38 p.r{border-color:var(--red)}.fai38 p.g{border-color:var(--good)}
.fgo38{display:flex;flex-direction:column;gap:3px;width:100%;text-align:left;cursor:pointer;color:var(--fg);font:inherit;margin:12px 0 8px;border-color:var(--sodium)}
.fgo38 b{color:var(--sodium);margin-right:6px}.fgo38 em{font-style:normal;font-weight:700}.fgo38 small{color:var(--mute);font-size:12px}
.csn38{display:flex;gap:6px;overflow-x:auto;padding:2px 0 8px;margin:8px 0 2px;scrollbar-width:none}.csn38::-webkit-scrollbar{display:none}.csn38 .chip{flex:0 0 auto;white-space:nowrap;font-size:12px;padding:4px 9px}
details.cs38{border-top:1px solid var(--line);margin:0}details.cs38>summary{list-style:none;cursor:pointer;display:flex;align-items:center;gap:8px;font-family:var(--f-pix);font-size:12px;letter-spacing:.14em;color:var(--mute);padding:11px 0 9px;scroll-margin-top:70px}
details.cs38>summary::-webkit-details-marker{display:none}details.cs38>summary::after{content:'＋';margin-left:auto;letter-spacing:0;color:var(--mute)}details.cs38[open]>summary::after{content:'－'}
details.cs38>summary:hover{color:var(--fg)}.csb38{padding-bottom:8px}
@media (max-width:400px){.ftop38 b{font-size:16px}.fr38{grid-template-columns:minmax(0,1.3fr) minmax(28px,.7fr) auto 30px;gap:6px;font-size:12.5px}}
`;document.head.appendChild(st);})();
// ===== 1.42 AI: 새 재무 규칙에 맞춰 판단한다 =====
// 경쟁 매체 AI: 창간 회사 광고가 규모 대비 시장 한도를 넘으면 단가를 깎아 견제한다
{const _cm38b=coMonth;coMonth=function(){const r=_cm38b.apply(this,arguments);try{S._adOver=!!(S.founder&&S.co.last&&S.co.last.ad>fAdK38()*1.02);}catch(e){}return r;};}
{const _cd38=compDecide;compDecide=function(c,ctx){const r=_cd38.apply(this,arguments);try{if(S.founder&&S._adOver&&r!=='pricecut'&&c.cash>.8&&chance(.22+(c.strat==='price'?.25:0)))return 'pricecut';}catch(e){}return r;};}
// 추천·맡기기 AI: 사업이 회사 덩치보다 커지면 사업 확장 대신 채용·영업·기사를, 자금이 말라 가면 큰돈 드는 일 대신 영업을 권한다
function fin38Run(){try{const H=S.co.fin38H||[];const a=H.slice(-3);if(!a.length)return 99;const v=a.reduce((s,x)=>s+x.pf,0)/a.length;return v<0?S.co.cash/-v:99;}catch(e){return 99;}}
{const _rc38=recommend;recommend=function(){const r=_rc38.apply(this,arguments);try{if(!S.founder)return r;const ok=id=>rankActs().includes(id)&&!why(id);
  if(r==='revenue'&&(S._bizSat||0)>.12){const alt=['fhire','fsales','write','invest'].find(ok);if(alt)return alt;}
  if(['facility','revenue','fsister','lgevent'].includes(r)&&(S.co.cash<1||fin38Run()<5)){const alt=['fsales','adrate','write'].find(ok);if(alt)return alt;}}catch(e){}return r;};}
// 수익 다변화 창: 회사 규모 한도를 반영한 「실제로 붙는 돈」과 회수 기간을 보여 주고, 가장 남는 사업을 추천한다
{const _rv38=RUN.revenue;RUN.revenue=function(){if(!S.founder)return _rv38.apply(this,arguments);const om=openModal;
  openModal=function(t,b,ch){openModal=om;try{const cap=bizCapM(),h=cap*.6;const eff=R=>R<=h?R:h+(cap-h)*(1-Math.exp(-(R-h)/(cap-h)));
    const R0=Object.keys(S.biz||{}).reduce((s,k)=>s+bizRev(k),0);let best=null;
    (ch||[]).forEach(x=>{const k=Object.keys(BIZ).find(k=>x.label&&x.label.startsWith(BIZ[k][0]));if(!k||x.disabled)return;const l=(S.biz||{})[k]||0;if(l>=3)return;
      const add=Math.max(0,BIZ[k][3](S.co,OUT(),l+1)*mediaPower(OUT()))-bizRev(k);const g=(eff(R0+add)-eff(R0))*.6;const cost=bizCost(k,l);const pb=g>.001?Math.ceil(cost/g):999;
      x.sub=(x.sub||'')+` · 실제 남는 돈 월 약 ${eok(g)}${pb<200?` · 약 ${pb}개월에 회수`:' · 회수 어려움'}`;if(add>0&&g/(add*.6)<.5)x.risk=true;if(pb<200&&(!best||pb<best.pb))best={x,pb};});
    if(best&&best.pb<=36)best.x.rec=true;
    b=(b||'')+`<p class="hint">수익 사업 한도는 회사 규모를 따른다 — 기자 ${S.co.staff}명 → 월 약 ${eok(cap)}. 지금 사업 매출 월 약 ${eok(R0)}${R0>h?' · <b style="color:var(--red)">한도에 가까워 새 사업은 덜 붙는다</b>':''}. 사업 원가는 매출의 40% 안팎이다.</p>`;}catch(e){console.error(e);}return om.call(this,t,b,ch);};
  try{return _rv38.apply(this,arguments);}finally{openModal=om;}};}