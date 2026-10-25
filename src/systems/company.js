/* 바이라인 — src/systems/company.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */

// ===== 매체 위상: 별점은 출발점일 뿐 — 성적에 따라 회사가 크거나 줄어든다 =====
function oBase(o){if(!o._b)o._b={p:o.p,ad:o.ad,subs:o.subs,tr:o.tr,staff:o.staff,pay:o.pay};if(o.p0==null)o.p0=o.p;return o._b;}
function oModSave(o){S.oMod=S.oMod||{};S.oMod[o.id]={p:o.p,p0:o.p0,ad:o.ad,subs:o.subs,tr:o.tr,staff:o.staff,pay:o.pay,b:o._b};}
function oReset(){OUTLETS.forEach(o=>{if(o._b&&!o.custom){Object.assign(o,{p:o._b.p,ad:o._b.ad,subs:o._b.subs,tr:o._b.tr,staff:o._b.staff,pay:o._b.pay});}});}
function oModApply(s){const M=s&&s.oMod;if(!M)return;Object.keys(M).forEach(id=>{const o=OUTLETS.find(x=>x.id===id);const v=M[id];if(!o||!v||o.custom)return;if(!o._b)o._b=v.b||{p:o.p,ad:o.ad,subs:o.subs,tr:o.tr,staff:o.staff,pay:o.pay};Object.assign(o,{p:v.p,p0:v.p0,ad:v.ad,subs:v.subs,tr:v.tr,staff:v.staff,pay:v.pay});});}
// ===== 6.1 경영진 AI: 내가 사장이 아니면 회사는 분기마다 상황을 읽고 전략을 바꾼다 =====
const CO_MODE={defend:'보도 품질 방어',digital:'디지털 전환',adpush:'광고 영업 강화',cost:'비용 절감',steady:'내실 다지기',retain:'인재 지키기'};
function coAI(lines,c,l,pr){const cq=S.comp.reduce((a,x)=>a+(x.q||50),0)/S.comp.length;const gap=cq-c.q;const base=S.myShare00||S.myShare||1;const slip=(base-(S.myShare||base))/base;
  const hist=(S.coPr=(S.coPr||[]).concat([pr]).slice(-3));const mPr=hist.reduce((a,b)=>a+b,0)/hist.length;const cashM=c.cash/Math.max(.1,l.rev);
  S.coPwK=Math.max(1,(S.coPwK||1)-.002);if(cashM>3&&gap>0)c.q=Math.min(90,c.q+gap*.04);
  const poached=(S.comp||[]).some(x=>x.last==='poach'&&(x.aggro||0)>=30);const urgent=c.cash<0&&S.coMode!=='cost';
  if(!S.coMode||S.turn%12===11||urgent){let m='steady';
    if(mPr<-.03&&cashM<8)m='cost';else if(gap>2||slip>.05)m=gap>=slip*40?'defend':'adpush';else if((S.cHit||0)>.02)m='adpush';else if(poached&&(S.wMood??60)<55)m='retain';else if(c.tr<OUT().tr*1.05&&chance(.5))m='digital';else if(gap>0&&chance(.5))m='defend';
    if(c.cash<0)m='cost';
    if(m!=='cost'&&cashM<2.5)m='steady';
    m=eraCoBias(m,cashM);
    S.coMode=m;(S.coModeY=S.coModeY||[]).push(m);if(lines&&m!=='steady')lines.push({c:'',t:`경영진 분기 전략: ${CO_MODE[m]} (회사 품질 ${Math.round(c.q)} · 경쟁사 평균 ${Math.round(cq)} · 점유율 ${f1(S.myShare||0)}%)`});}
  const m=S.coMode;
  if(m==='defend'&&c.q<cq+3){c.q=Math.min(90,c.q+.6+Math.max(0,gap)*.2);c.extra+=l.rev*.03;}
  if(m==='digital'){S.coPwK=Math.min(1.1,(S.coPwK||1)+.006);c.bT+=.003;c.extra+=l.rev*.02;}
  if(m==='adpush'){S.cHit=(S.cHit||0)*.6;c.adB+=.02;S.coPwK=Math.min(1.1,(S.coPwK||1)+.003);c.extra+=l.rev*.015;}
  if(m==='cost'){c.extra-=l.rev*.03;c.q=Math.max(30,c.q-.15);}
  if(m==='retain'){S.wMood=clamp((S.wMood??60)+1.5,0,100);c.extra+=l.rev*.02;}
  // 경영진도 수익 사업을 벌인다: 자금 여유가 있으면 반년마다 수익성 좋은 사업을 시작·확대한다 (신뢰를 깎는 사업은 신뢰가 넉넉할 때만)
  const bizLv=Object.values(S.biz||{}).reduce((x,v)=>x+(v||0),0);
  if(S.turn-(S.coBizT??-99)>=24&&cashM>3&&c.cash>0&&bizLv<4){S.biz=S.biz||{};const o=OUT();let best=null;
    for(const k in BIZ){const B=BIZ[k],lv=S.biz[k]||0;if(lv>=3)continue;let ok=false;try{ok=B[5]();}catch(e){}if(!ok)continue;if((k==='native'||k==='forum')&&S.trust<55)continue;if(k==='native'&&m!=='adpush')continue;
      const cost=bizCost(k,lv);if(cost>c.cash*.15)continue;const gain=Math.max(0,B[3](c,o,lv+1)-B[3](c,o,lv))*mediaPower(o)-B[2]*bizSz()*B[4]*.25;const sc=gain*12-cost;if(sc>0&&(!best||sc>best.sc))best={k,lv,cost,sc};}
    if(best){S.coBizT=S.turn;c.cash-=best.cost;S.biz[best.k]=best.lv+1;log(`경영진 수익 사업: ${BIZ[best.k][0]} ${best.lv+1}단계`);if(lines)lines.push({c:'g',t:`경영진이 ${BIZ[best.k][0]} 사업을 ${best.lv?'키웠다':'시작했다'} (${best.lv+1}단계 · 투자 ${eok(best.cost)})`});tick(`${o.n}, ${BIZ[best.k][0]} ${best.lv?'확대':'시작'}`);}
    else S.coBizT=S.turn-12;}
  if(month()===12&&S.coModeY&&S.coModeY.length){const cnt={};S.coModeY.forEach(x=>cnt[x]=(cnt[x]||0)+1);if(lines)lines.push({c:'',t:`경영진 올해 전략 결산 — ${Object.entries(cnt).map(([k,v])=>`${CO_MODE[k]} ${v}분기`).join(' · ')} · 광고 점유율 ${f1(S.myShare||0)}%`});S.coModeY=[];}}
function standMonth(lines){if(S.story||!S.co||S.phase!=='game')return;const o=OUT();if(!o)return;const b=oBase(o);const c=S.co,l=c.last;
  if(S.oMomId!==o.id){S.oMomId=o.id;S.oMom=0;S.myShare00=null;}if(S.myShare00==null&&S.myShare)S.myShare00=S.myShare;
  if(S.founder){oModSave(o);return;}
  const pr=l&&l.rev?clamp(l.profit/l.rev,-.5,.5):0;
  // 경영진(AI)도 경쟁에 대응한다: 경쟁사 품질이 앞서거나 점유율이 밀리면 취재비·인력·디지털에 투자해 품질을 지킨다 (내가 사장이면 내가 정한다)
  if(S.rank<7&&S.comp&&S.comp.length&&l&&l.rev)coAI(lines,c,l,pr);
  const g=clamp(.5*(o.subs>0?c.subs/o.subs-1:0)+.35*(o.tr>0?c.tr/o.tr-1:0)+pr*.8+(S.myShare00?clamp(S.myShare/S.myShare00-1,-.5,.5)*.25:0)+(c.q-55)/110+((S.trust??50)-55)/220,-1,1);
  S.oMom=(S.oMom||0)*.88+g*.12;
  if(o.subs>0)o.subs=clamp(o.subs+(c.subs-o.subs)*.03,b.subs*.35,b.subs*1.6);if(o.tr>0)o.tr=clamp(o.tr+(c.tr-o.tr)*.03,b.tr*.35,b.tr*2);
  o.ad=+clamp(o.ad*(1+S.oMom*.006),b.ad*.4,b.ad*1.55).toFixed(3);
  // 경영권 밖이면 회사가 알아서 뽑고 줄인다 (해마다 1월)
  const yk=Math.floor(S.turn/YW);if(S.rank<6&&month()===1&&S.oStaffY!==yk){S.oStaffY=yk;const yrRev=(l&&l.rev||0)*12;
    // 적자가 이어져 현금이 바닥나면 구조조정, 돈을 쌓아 두기만 하면 채용을 늘린다
    const rich=c.cash>yrRev*.8&&pr>=0;let k=clamp(S.oMom*.25,rich?-.02:-.06,.06)+(c.cash<0?-.07:c.cash<yrRev*.25&&pr<0?-.035:0)+(pr>.15&&c.cash>yrRev*1.5?.05:0);k=clamp(k,-.12,.1);
    let n=Math.round(c.staff*(1+k));if(n===c.staff&&Math.abs(k)>=.02)n+=Math.sign(k);n=Math.round(clamp(n,Math.max(2,b.staff*.5),b.staff*2.4));
    if(n!==c.staff&&lines){const dn=c.staff-n;lines.push({c:dn>0?'r':'g',t:dn>0?`회사가 ${c.cash<0?'적자 누적으로 구조조정을 했다':'인력을 줄였다'} — 기자 ${dn}명 감원 (${n}명)`:`회사가 기자 ${-dn}명을 새로 뽑았다 (${n}명)`});}c.staff=n;}
  o.staff=Math.max(1,Math.round(o.staff+(c.staff-o.staff)*.05));oModSave(o);}
function standYear(lines){if(S.story||!S.co)return;const yk=Math.floor(S.turn/YW);if(S.oYk==null)S.oYk=yk;if(yk===S.oYk)return;S.oYk=yk;const o=OUT();if(!o)return;const b=oBase(o);
  const rt=(x,y)=>y>0&&x>0?x/y:1;const ix=Math.pow(rt(o.ad,b.ad)*rt(S.co.subs,b.subs)*rt(S.co.tr,b.tr),1/3);S.oIx=ix;
  const cool=S.turn-(S.oStT??-999)>=YW*2;const lo=o.npc?1:2;
  if(!S.founder&&cool){if(o.p<5&&ix>=1.35&&(S.oMom||0)>.03)starMove(o,1,lines,true);else if(o.p>lo&&ix<=.72&&(S.oMom||0)<-.03)starMove(o,-1,lines,true);}
  const rOf=c=>{const x=OUTLETS.find(y=>y.id===c.id);return x?c.pw/(Math.max(1,x.p)*12):1;};const rAv=(S.comp||[]).reduce((a,c)=>a+rOf(c),0)/Math.max(1,(S.comp||[]).length);
  (S.comp||[]).forEach(c=>{const x=OUTLETS.find(y=>y.id===c.id);if(!x||x.id===o.id)return;oBase(x);if(S.turn-(x._st??-999)<YW*2)return;const r=rOf(c)/Math.max(.5,rAv);c.stk=r>=1.18?Math.max(0,c.stk||0)+1:r<=.82?Math.min(0,c.stk||0)-1:0;if(c.stk>=2&&x.p<5){starMove(x,1,lines);c.stk=0;}else if(c.stk<=-2&&x.p>(x.npc?1:2)){starMove(x,-1,lines);c.stk=0;}});
  OUTLETS.forEach(x=>{if(x.closed||x.custom||x.id===o.id||(S.comp||[]).some(c=>c.id===x.id))return;const up=({online:.03,tv:.012,wire:.01}[x.type]||.012)*.6,dn=({daily:.03,local:.03,sports:.025,weekly:.02}[x.type]||.012)*.6;oBase(x);if(S.turn-(x._st??-999)<YW*3)return;if(x.p<5&&chance(up))starMove(x,1,null);else if(x.p>(x.npc?1:2)&&chance(dn))starMove(x,-1,null);});}
function starMove(x,d,lines,mine){oBase(x);x.p=clamp(x.p+d,1,5);x._st=S.turn;x.ad=+(x.ad*(d>0?1.25:.8)).toFixed(2);x.subs=+(x.subs*(d>0?1.15:.87)).toFixed(2);x.tr=Math.round(x.tr*(d>0?1.15:.87));x.pay=Math.round(x.pay*(d>0?1.06:.95)/5)*5;
  if(mine){S.oStT=S.turn;S.oMom=0;if(!S.founder&&S.co)S.co.staff=Math.round(S.co.staff*(d>0?1.06:.94));}oModSave(x);
  const lvN=['','신생','군소','중견','유력','메이저'][x.p];
  if(mine){if(lines)lines.push({c:d>0?'g':'r',t:d>0?`우리 회사 위상이 ★${x.p}(${lvN} 매체)로 올랐다! 광고 단가·연봉·영입 경쟁력이 오른다.`:`우리 회사 위상이 ★${x.p}(${lvN} 매체)로 떨어졌다. 광고 단가와 연봉이 줄고 인력도 준다.`});log(`회사 위상 ★${x.p}`);tick(`「${x.n}」 ${d>0?`업계 ${lvN} 매체로 성장`:`위상 하락… ${lvN} 매체로`}`,1);}
  else{tick(`「${x.n}」 ${d>0?'급성장':'위상 하락'} — ★${x.p}`);if(lines&&(S.comp||[]).some(c=>c.id===x.id))lines.push({c:'',t:`경쟁 매체 「${x.n}」 ${d>0?'위상 상승':'위상 하락'} (★${x.p})`});}}
function standBox(){if(S.founder||S.story)return '';const o=OUT();const b=oBase(o);const m=S.oMom||0;
  return `<div class="sec">회사 위상</div><p class="hint">★${o.p}${o.p0!=null&&o.p0!==o.p?` (원래 ★${o.p0})`:''} · 흐름 ${m>.03?'<b style="color:var(--good)">성장세 ↑</b>':m<-.03?'<b style="color:var(--red)">하락세 ↓</b>':'보합 →'} · 광고 규모 ${Math.round(o.ad/Math.max(.01,b.ad)*100)}% · 기자 ${S.co.staff}명 (원래 ${b.staff}명)<br>구독·방문자·수익·점유율·보도 품질·신뢰가 좋으면 회사가 커지고 해마다 위상이 오를 수 있다. 반대면 줄고 떨어진다.</p>`;}

// ===== 재직 연차: 경력 연차와 별개로 지금 회사에 몇 년째인지 =====
// 대부분은 이 회사에서 시작했지만, 넷 중 하나쯤은 다른 매체에서 옮겨 온 경력 기자다
function coYrs(m){if(!m)return 1;if(m.cy==null){const y=myrs(m);let h=0;for(const ch of String(m.name||'')+String(m.id||''))h=(h*31+ch.charCodeAt(0))>>>0;m.cy=(h%100)<72||y<=2?y:1+(h>>>7)%Math.max(1,y-1);m.ct=S.turn;}return Math.min(myrs(m),m.cy+Math.floor((S.turn-(m.ct??S.turn))/YW));}
function yrsTxt(m){const y=myrs(m);
  // 창간 모드: 우리 회사는 창간한 날부터 있었다 — 재직 기간이 회사 나이보다 길 수 없다
  if(S&&S.founder){const f0=S.fStart||0;if(m.fj==null)m.fj=Math.max(f0,m.t0!=null?m.t0:S.turn);const c=Math.min(y,1+Math.floor((S.turn-m.fj)/YW));const og=m.fj-f0<YW/4;
    return c<y?`경력 ${y}년 차 · 합류 ${c}년 차${og?' (창간 멤버)':''}`:`${y}년 차${og?' (창간 멤버)':' (첫 직장)'}`;}
  const c=coYrs(m);return c<y?`경력 ${y}년 차 · 재직 ${c}년 차`:`${y}년 차 (입사 후 줄곧)`;}
// ===== 임기제 인물: 선거·임기에 맞춰 바뀐다 =====
// 지방선거(6월, 4년마다·7월 취임) · 총선(4월, 4년마다·6월 임기 시작) · 대선(6월, 5년마다) · 임명직은 각자 임기(2~4년)가 끝날 때 · 임기가 없는 사람은 드물게
const TERM_RULES=[
 [/단체장|도지사|구청장|군수|교육감/,'local',4],[/지역구 의원/,'nat',4],[/국회의장/,'spk',2],[/원내대표/,'whip',1],[/당 대표|당대표/,'party',2],
 [/대통령실|안보실장|장관/,'pres',5],[/금융위원장|금감원장|방송통신위원장|상공회의소 회장|조합장|대사/,'app',3],[/검찰총장|경찰청장|법원행정처장|심판위원장|노조 위원장|강력계 반장/,'app',2],[/축구협회장|국가대표 감독/,'app',4],[/전공의 대표|특파원 클럽 회장/,'app',1]];
function termKind(id){const e=ENT[id];const n=e?e.n:'';for(const [re,k,y] of TERM_RULES)if(re.test(n))return[k,y];return['free',0];}
const gYear=(t=S.turn)=>2027+Math.floor(t/YW);
function termNext(id,t){const [k,y]=termKind(id);t=t??S.turn;const Y=gYear(t),M=month(t);const at=(yr,mo)=>(yr-2027)*YW+(mo-1)*4;
  const nextYr=(mod,base,mo)=>{let yr=Y;while(((yr-base)%mod+mod)%mod!==0||at(yr,mo)<=t)yr++;return at(yr,mo);};
  if(k==='local')return nextYr(4,2030,7);if(k==='nat')return nextYr(4,2028,6);if(k==='spk')return nextYr(2,2028,6);if(k==='whip')return nextYr(1,2027,5);if(k==='party')return nextYr(2,2028,8);if(k==='pres')return nextYr(5,2030,6);
  if(k==='app')return t+R(1,y*12)*4;return null;}
function termTxt(id){const x=S.net[id];if(!x)return '';const [k]=termKind(id);if(k==='free')return '임기 없음';if(x.tEnd==null)x.tEnd=termNext(id);const lab={local:'지방선거',nat:'총선',spk:'의장 선출',whip:'원내대표 경선',party:'전당대회',pres:'정권 교체기',app:'임기 만료'}[k];return `${lab} ${gYear(x.tEnd)}.${String(month(x.tEnd)).padStart(2,'0')}${x.tN>1?` · ${x.tN}선·연임째`:''}`;}
function termTick(lines){if(!S.net)return;const news=[];
  ENTS.forEach(([id,n,kind])=>{if(kind!=='person')return;const x=S.net[id];if(!x)return;const [k,y]=termKind(id);if(x.tN==null)x.tN=1;
    const change=why=>{const old=x.who;x.who=rname();x.rel=Math.round(x.rel*.3);x.tN=1;if(x.known)news.push({c:'',t:`${n} 교체(${why}): ${old} → ${x.who}. 관계를 새로 쌓아야 한다.`});};
    if(k==='free'){if(chance(.003))change(pick(['은퇴','자리 이동','세대교체']));return;}
    if(x.tEnd==null){x.tEnd=termNext(id);return;}
    if(S.turn<x.tEnd){if(k==='app'&&chance(.004)){change('중도 경질');x.tEnd=S.turn+y*YW;}else if(k==='pres'&&chance(.006)){change('개각');}return;}
    // 임기 끝: 선거·재신임
    const stay=k==='local'?(x.tN<3&&chance(.55)):k==='nat'?chance(.5):k==='spk'||k==='pres'?false:k==='whip'?chance(.25):k==='party'?chance(.35):chance(.25);
    if(stay){x.tN++;if(x.known)news.push({c:'g',t:`${n} ${x.who} ${k==='local'||k==='nat'?`재선 성공 (${x.tN}선)`:'연임'} — 관계가 이어진다.`});}
    else change(k==='local'?'지방선거':k==='nat'?'총선':k==='pres'?'정권 교체':k==='spk'?'의장단 교체':k==='whip'?'원내대표 경선':k==='party'?'전당대회':'임기 만료');
    x.tEnd=k==='app'?S.turn+y*YW:termNext(id,S.turn);});
  news.slice(0,4).forEach(l=>lines.push(l));if(news.length>4)lines.push({c:'',t:`그 밖에 인물 ${news.length-4}명이 바뀌었다.`});}