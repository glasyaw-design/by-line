/* 바이라인 — src/systems/market.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */

// ===== 경쟁사 AI: 매체마다 전략·자금·인력·기억을 갖고 매달 판단한다 =====
const C_STRAT={scoop:['특종형','탐사·단독에 돈을 쓴다'],click:['트래픽형','속보·어뷰징으로 조회수를 끌어모은다'],quality:['품질형','기자 교육·팩트체크로 신뢰를 쌓는다'],price:['영업형','광고 단가를 깎아 광고주를 빼앗는다'],digital:['디지털형','앱·영상·구독에 투자한다'],talent:['인재형','타사 기자를 돈으로 데려온다']};
const C_MOVES={
 invest:{n:'기자 충원·교육',cost:.6},scoop:{n:'탐사팀 투입',cost:.5},abuse:{n:'트래픽 기사 폭탄',cost:.1},pricecut:{n:'광고 단가 인하',cost:.3},lgebid:{n:'행사 맞불',cost:.2},
 digital:{n:'디지털 투자',cost:.8},poach:{n:'타사 기자 영입',cost:.5},follow:{n:'받아쓰기·후속 공세',cost:.1},editorial:{n:'사설 공세',cost:0},cut:{n:'구조조정',cost:-.6},hold:{n:'관망',cost:0}};
function cName(c){const o=OUTLETS.find(x=>x.id===c.id);return o?o.n:'경쟁사';}
function compInit1(x,st){st=st||pick(Object.keys(C_STRAT));const w={};Object.keys(C_MOVES).forEach(k=>w[k]=1);
  ({scoop:['scoop','follow'],click:['abuse','follow'],quality:['invest'],price:['pricecut'],digital:['digital'],talent:['poach','invest']})[st].forEach(k=>w[k]=2.2);
  return{base:Object.assign({},w),id:x.id,pw:x.p*12+R(-4,4),q:50+R(-8,8),strat:st,cash:x.p*3+R(0,4),aggro:R(5,25),w,mom:0,pen:0,last:null,hist:[],buzz:0,dig:0};}
const C_FAV={scoop:['scoop','follow'],click:['abuse','follow'],quality:['invest'],price:['pricecut'],digital:['digital'],talent:['poach','invest']};
function compBase(st){const w={};Object.keys(C_MOVES).forEach(k=>w[k]=1);(({scoop:['scoop','follow'],click:['abuse','follow'],quality:['invest'],price:['pricecut'],digital:['digital'],talent:['poach','invest']})[st]||[]).forEach(k=>w[k]=2.2);return w;}
function compFix(c){if(c.strat){if(!c.base)c.base=compBase(c.strat);return c;}const o=OUTLETS.find(x=>x.id===c.id)||{p:3};return Object.assign(compInit1(o),{pw:c.pw,q:c.q});}
// 한 매체의 판단: 상황을 보고 행동마다 점수를 매겨 고른다
function compDecide(c,ctx){const sc={};const lead=ctx.leader===c;const behindMe=ctx.myShare>c.share;const rising=ctx.myDelta>.4;
  const KD=compDiffK();for(const k in C_MOVES){let v=c.w[k]*(1-KD.noise/2+Math.random()*KD.noise);const m=C_MOVES[k];
    if(m.cost>0&&c.cash<m.cost)v=-9;
    if(k==='invest')v+=(c.strat==='quality'?(75-c.q)/15:(60-c.q)/12)+(ctx.fresh?.5:0);
    if(k==='scoop')v+=Math.min(.8,(c.q-50)/20)+(ctx.myScoop?1:0)+(ctx.myBig?.8:0)-(c.strat!=='scoop'&&(c.rep||1)>=2&&c.last==='scoop'?.4:0);
    if(k==='abuse')v+=(c.pen>=3?-3:0)+(c.share<ctx.avg?1:0);
    if(k==='pricecut')v+=(ctx.myPosRun>=2?.3:0)+(behindMe?1.2:0)+(c.cash>4?.5:-1)+((S.adRate||1)-1)*5;
    if(k==='lgebid')v=(ctx.lge&&c.aggro>20&&c.cash>.5)?.8+c.aggro/50:-9;
    if(k==='digital')v+=(c.dig<3?.6:-.6)+(c.cash>5?.6:-1);
    if(k==='poach')v+=(ctx.myQ>c.q+5?1:0)+(c.aggro/40)+(rising?1:0)+(DF()===DIFF.hard&&(S.team||[]).length>6?.5:0)+((S.founder||S.rank>=6)&&(S.wMood??60)<40?1.2:0)+(((S.payLv||1)<.95)?.6:0)+((S.team||[]).length>teamSize()+1?.5:0)+((S.team||[]).filter(m=>m.own!=null&&S.turn-m.own<YW*2).length>=2?.3:0);
    if(k==='follow')v+=ctx.myScoop?2.2:-1;if(sisOf(c.id)){if(['poach','editorial','pricecut','lgebid','abuse'].includes(k))v-=3;if(k==='follow')v+=.5;}
    if(k==='editorial')v+=(ctx.myPosRun>=3?.9:0)+(c.aggro>45?1.5:-.5)+(ctx.myScoop?.6:0)+(ctx.myBig?1:0)+(DF()===DIFF.hard&&S.trust<45?.8:0);
    if(k==='cut')v=c.cash<0?4:-9;
    if(k==='hold')v=.3+(c.cash<1?1:0);
    if(lead&&['pricecut','poach'].includes(k))v-=.4;
    // 같은 수를 계속 두면 효과도 점수도 떨어진다 (한 가지 수만 반복하지 않게)
    // 매체마다 고유 전략이 있다: 주력 수에 가산점, 영업형이 아니면 덤핑은 꺼린다
    if(C_FAV[c.strat]&&C_FAV[c.strat].includes(k))v+=1;if(k==='pricecut'&&c.strat!=='price')v-=.5;
    if(c.last===k&&k!=='hold')v-=.45*(c.rep||1);
    if(k==='pricecut')v-=(c.pcN||0)*.35+(c.q>=62&&c.strat!=='price'?.6:0);
    // 돈이 남는 회사는 품질·디지털·탐사에 투자하고, 밀리는 회사는 승부수를 둔다
    if(c.cash>15&&['invest','digital','scoop'].includes(k))v+=Math.min(1.2,(c.cash-15)/12);
    if(c.share!=null&&c.share<ctx.avg*.7&&['scoop','digital','poach'].includes(k))v+=.6;
    // 내 매체의 약점을 노린다: 신뢰가 흔들리면 사설, 사기가 낮으면 영입, 단독이 잦으면 받아쓰기
    if(k==='editorial'&&S.trust<40&&S.trust>=20)v+=.6;if(k==='editorial'&&S.turn-(c.edT??-99)<24)v-=1;
    sc[k]=v;}
  return Object.entries(sc).sort((a,b)=>b[1]-a[1])[0][0];}
function compMonth(lines){if(!S.comp)initComp();S.comp=S.comp.map(compFix);const o=OUT();
  const famE=S.founder||S.rank>=4?S.fame:30+((S.fame||0)-30)*[.2,.25,.3,.4][S.rank||0];const my=o.p*12*(.7+S.co.q/170)*(.8+famE/250)*portalMult()*(1-(S.cHit||0))*(S.coPwK||1);if(S.myPw0==null)S.myPw0=my;
  const prevShare=S.myShare||0;const recent=(S.clips||[]).filter(c=>c.turn>S.turn-4);const myScoop=recent.some(c=>c.excl&&(c.imp||0)>=30&&!c.pos);
  const myBig=(S.bigScoops||0)>(S._bs0||0);S._bs0=S.bigScoops||0;const ctx={myBig,lge:(S.lge||[]).some(e=>!e.done),fresh:(S.closedOut||[]).length>(S._co0||0),myShare:prevShare,myDelta:prevShare-(S.myShare0??prevShare),myQ:S.co.q,myScoop,myPosRun:aiPosRun(),avg:100/(S.comp.length+1),leader:S.comp.slice().sort((a,b)=>b.pw-a.pw)[0]};
  S._co0=(S.closedOut||[]).length;S.myShare0=prevShare;S.cHit=Math.max(0,(S.cHit||0)*.6);const news=[];
  ctx.drift=S.compDrift||0;S.comp.forEach(c=>{compFix(c);const pw0=c.pw;c._pw0=pw0;const k=compDecide(c,ctx);const m=C_MOVES[k];c.cash-=Math.max(0,m.cost);if(m.cost<0)c.cash-=m.cost;c.rep=c.last===k?(c.rep||1)+1:1;c.last=k;const n=cName(c);
    if(k==='invest'){c.q=clamp(c.q+R(2,4)*clamp((92-c.q)/30,.15,1),30,90);}
    if(k==='scoop'){if(chance(.25+c.q/250)){c.pw*=1.07;c.buzz=3;news.push([c,`[${n}] 대형 단독으로 포털 1위`,1]);if(S.items.some(i=>i.excl))S.items.filter(i=>i.excl).slice(0,1).forEach(i=>i.heat-=1);}else c.q+=1;}
    if(k==='abuse'){c.pw*=1.04;c.pen+=1;c.q-=1;if(c.pen>=4&&chance(.5)){c.pw*=.8;c.pen=0;news.push([c,`${n}, 포털 제휴 등급 강등`,0]);}}
    if(k==='lgebid'){const e=(S.lge||[]).find(x=>!x.done&&!x.rv);if(e){e.rv=c.id;e.fees=(e.fees||1)*.9;e.spons=(e.spons||1)*.92;news.push([c,`${n}, 우리 「${e.n}」${jp(e.n,'과','와')} 같은 시기에 맞불 행사`,1]);}}
    if(k==='pricecut'){const tgt=ENTS.find(e=>e[2]==='corp'&&S.net&&S.net[e[0]]&&(S.net[e[0]].cut>0||(S.arc&&S.arc[e[0]]))&&!posWarm(e[0]));if(tgt&&chance(.5)){S.net[tgt[0]].cut=(S.net[tgt[0]].cut||0)+6;netUp(tgt[0],-4);news.push([c,`${n}, 우리와 틀어진 ${tgt[1]} 광고를 낚아챘다`,2]);}const pc=c.pcN||0;c.pcN=pc+1;c.cash-=.15*pc;c.pw*=1+.05/(1+pc*.6);S.cHit=Math.min(.08,(S.cHit||0)+.008*(1+Math.max(0,(S.adRate||1)-1)*2)/(1+pc*.4));if(pc===0&&S.turn-(c.pcNT??-99)>=24){c.pcNT=S.turn;news.push([c,`${n}, 광고 단가 30% 인하 공세`,1]);}else if(pc>0&&pc%12===0)news.push([c,`${n}, 광고 단가 덤핑 ${Math.round(pc)}개월째`,1]);c.aggro+=pc?1:4;}
    if(k!=='pricecut')c.pcN=0;
    if(k==='digital'){c.dig++;c.pw*=1.03;if(c.dig===3)news.push([c,`${n}, 디지털 구독 전환 성공`,0]);}
    if(k==='poach'){c.q+=2*clamp((92-c.q)/30,.15,1);if(S.team&&S.team.length>4&&S.rank>=2&&S.turn-(S.poachT??-99)>=12&&S.turn-(c.poachT??-99)>=24&&chance((DF()===DIFF.easy?.6:DF()===DIFF.hard?1.15:1)*clamp(.35*(1.15-(S.st.lead||0)/300)*(1+(60-(S.wMood??60))/80)*clamp((c.pay||1)/(S.payLv||1),.7,1.4),.08,.8))){const t=poachPick();S.poachT=S.turn;c.poachT=S.turn;S.team=S.team.filter(x=>x!==t);if(S.co)S.co.staff=Math.max(1,S.co.staff-1);S.co.q-=1;news.push([c,`${n}, 우리 ${t.name} 기자 영입`,2]);log(`${t.name} 기자, ${jo2(n,'으로','로')} 이적${t.name===S.protege?' — 키우던 제자였다':''}`);}else news.push([c,`${n}, 경력기자 대거 영입`,0]);}
    if(k==='follow'&&myScoop){if(sisOf(c.id)){c.pw*=1.01;S.cHit=Math.max(0,(S.cHit||0)-.004);news.push([c,`자매사 ${n}, 우리 단독을 받아 키웠다 — 그룹 시너지`,0]);}else{c.pw*=1.02;S.cHit=Math.min(.06,(S.cHit||0)+.006);news.push([c,`${n}, 우리 단독 받아쓰기 + 후속 공세`,1]);}}
    if(k==='editorial'){c.aggro+=6;const caught=(S.corrLog||[]).some(x=>x.caught&&x.t>S.turn-YW);if(S.turn-(c.edT??-99)>=24&&chance(caught?.7:.4)){c.edT=S.turn;S.trust=Math.max(0,S.trust-(caught?1.2:.6)*(S.trust<25?.5:1));news.push([c,caught?`${n}, 우리 「몰래 수정」 논란을 사설로 저격`:ctx.myPosRun>=3?`${n} 사설, 우리 지면을 「기업 홍보지」라고 저격`:`${n} 사설, 우리 보도를 정면 비판`,2]);}}
    if(k==='cut'){c.q-=4;c.pw*=.94;news.push([c,`${n}, 희망퇴직 단행 — 빈자리만큼 우리 독자가 늘었다`,1]);if(!S.founder||S.co)coBump(.006,.01);}
    // 오래 적자를 못 벗어난 매체는 새 대주주에게 넘어가 전략을 바꾼다
    c.bad=c.cash<0?(c.bad||0)+1:0;if(c.bad>=6){c.bad=0;const ns=pick(Object.keys(C_STRAT).filter(x=>x!==c.strat));c.strat=ns;c.base=compBase(ns);c.w=Object.assign({},c.base);c.cash=Math.max(4,c.pw/8);c.q=Math.max(c.q,52);c.pcN=0;c.aggro=30;news.push([c,`${n}, 새 대주주 인수 — ${C_STRAT[ns][0]} 전략으로 전환`,1]);}
    c.q=clamp(c.q+R(-2,2)+(55-c.q)*.04,30,90);c.pw=Math.max(5,c.pw*(1+(c.q-55)/700)+R(-1,1));{const xo=OUTLETS.find(y=>y.id===c.id);if(xo){const T0=Math.max(1,xo.p)*12,T=T0*(.7+c.q/170)*.78;c.pw+=(T-c.pw)*.15;c.pw=clamp(c.pw,T0*.5,T0*1.6);}}if(c.buzz>0){c.buzz--;}
    // 수입: 점유율만큼 돈이 들어온다
    if(month()===1&&S.turn%4===0&&c.rkY!==S.turn){c.rkY=S.turn;c.rk=R(1,3)+(c.strat==='talent'?2:0);c.q-=1;c.rkT=S.turn+16;}if(c.rkT&&S.turn>=c.rkT){const stay=Math.round((c.rk||0)*.6);c.q+=Math.min(3,stay)*.6;if((c.rk||0)-stay>0&&chance(.3))news.push([c,`${n} 수습 ${(c.rk||0)-stay}명 중도 퇴사`,0]);c.rkT=null;}
    c.pay=clamp((c.pay||1)+(c.strat==='talent'?.004:0)+(c.cash<0?-.01:c.cash>8?.004:0)+R(-1,1)/400,.8,1.4);
    if((c.pen||0)>=3&&chance(.25)){c.pen--;c.pw*=.98;news.push([c,`${n}, 낚시 기사 무더기 정정·삭제`,0]);}
    c.cash+=((c.share||ctx.avg)/100*o.p*2.6*(1+(econ()-1)*.6))*compDiffK().inc-(.2+o.p*.13)*(c.pay||1);c.cash=Math.min(c.cash,40);
    // 학습: 효과가 좋았던 수는 더 자주 쓴다
    const gain=(c.pw-pw0)/Math.max(1,pw0)-(ctx.drift||0)-Math.max(0,m.cost)/Math.max(4,c.cash+4)*.02;c.w[k]=clamp(c.w[k]+gain*6*compDiffK().learn,.3,4);
    // 배운 것도 조금씩 잊고 원래 성향으로 돌아간다 (전략 색깔 유지)
    if(c.base)for(const q in c.w)c.w[q]+=(c.base[q]-c.w[q])*.03;
    // 내가 커지면 경계심이 오른다
    c.aggro=clamp(c.aggro+((ctx.myDelta>.3?3:-1)+(myScoop?2:0))*compDiffK().agg+(25-c.aggro)*.04,0,100);
    c.hist.unshift(`${dateShort()} ${m.n}`);if(c.hist.length>4)c.hist.pop();});
  S.compDrift=+(S.comp.reduce((a,c)=>a+(c.pw-(c._pw0||c.pw))/Math.max(1,c._pw0||c.pw),0)/S.comp.length).toFixed(4);
  S.myPw=my;const tot=my+S.comp.reduce((a,c)=>a+c.pw,0);S.myShare=my/tot*100;S.comp.forEach(c=>c.share=c.pw/tot*100);
  news.sort((a,b)=>b[2]-a[2]);news.slice(0,2).forEach(([c,t,lv])=>{tick(t);if(lv>=1&&lines)lines.push({c:lv>=2?'r':'',t:`경쟁사 동향: ${t}`});});
}
function compBox(){if(!S.comp)return '';return `<div class="sec">경쟁사 동향</div>${S.comp.slice().sort((a,b)=>(b.share||0)-(a.share||0)).map(c=>{const st=C_STRAT[c.strat]||['',''];return `<div class="card"><div class="t">${esc(cName(c))} <span class="tg">${st[0]}</span>${c.aggro>=50?' <span class="tg new">우리를 노린다</span>':''}</div><div class="meta"><span>점유율 ${f1(c.share||0)}%</span><span>품질 ${Math.round(c.q)}</span><span>최근: ${c.last?C_MOVES[c.last].n:'-'}</span></div><p class="hint" style="margin:4px 0 0">${st[1]}${c.hist&&c.hist.length?' · '+c.hist.slice(1,3).join(' · '):''}</p></div>`;}).join('')}`;}

function compPick(){const L=S.comp||[];let t=L.reduce((a,c)=>a+5+(c.aggro||0),0)*Math.random();for(const c of L){t-=5+(c.aggro||0);if(t<=0)return c;}return L[0];}
function compThreat(){if(!S.comp||!S.comp.length)return 0;return clamp(Math.max(...S.comp.map(c=>((c.q||50)-50)/1500+(c.strat==='scoop'?.012:0)+(c.buzz>0?.01:0)+((c.aggro||0)>=50?.01:0))),0,.035);}
function shareMult(){return S.myPw0?clamp(S.myPw/S.myPw0,.7,1.35):1;}
// 시설·개선 (사장·창간 모드)
// 시설·개선: [이름, 기준 비용(억, ★4 매체 기준), 효과, 월 유지비(억)] — 매체 규모에 따라 비용이 달라진다
// 참고: 특파원 1명 연 2~3억(기자협회보), 신형 윤전기 500억·윤전공장 인수 135억(한경) 등 실제 규모를 게임 단위로 줄였다
const FACIL={
 studio:['영상 스튜디오',3,'영상·방송 리포트 완성도↑, 트래픽↑',.05],data:['데이터저널리즘팀',1.5,'데이터 분석 성공률↑, 보도 품질↑',.1],fact:['팩트체크센터',1,'오보 위험↓, 포털 심사 가점',.08],
 legal:['사내 법무팀',1,'소송·언론중재 대응↑',.1],app:['뉴스 앱 개편',2,'트래픽 성장↑',.03],paywall:['디지털 유료 구독',1.5,'구독 매출↑ (트래픽 조금↓)',.02],
 bureau:['지역 취재본부',2,'지역 아이템·지역 광고↑',.08],corr:['해외 특파원',1,'국제 기사 품질↑, 평판↑ (체재비가 매달 든다)',.2],ai:['AI 편집 보조 시스템',.8,'기자 행동력 여유↑',.04],
 hq:['사옥 이전',15,'채용 경쟁력·사기↑, 평판↑',.1],press:['윤전기·송출 장비 교체',12,'제작 비용 매달 0.3억↓ (규모 비례)',.02],reader:['독자센터·커뮤니티',.5,'구독 이탈↓, 신뢰↑',.02],
 academy:['사내 연수원',1,'부서원 실력 성장↑',.03],welfare:['복지 개선(식당·어린이집)',1.5,'이직 이벤트↓, 사내 관계↑',.06]
};
function facSize(){const p=OUT()?OUT().p:3;return {1:.3,2:.4,3:.7,4:1,5:1.4}[p]||1;}
function facInfl(){return Math.pow(1.02,Math.floor(S.turn/YW));}
function facCost(k){return Math.round(FACIL[k][1]*facSize()*facInfl()*10)/10;}
function facUpkeep(){return Object.keys(S.facil||{}).reduce((a,k)=>a+(FACIL[k]?FACIL[k][3]*((S.facSz&&S.facSz[k])||facSize()):0),0);}
function hasF(k){return !!(S.facil&&S.facil[k]);}
// 창간 초기 숨통: 언론 창업 지원금·지자체 지원사업(2년간 점점 줄어든다), 첫해 창간 멤버 박봉, 난이도별로 다르다
function fSupport(){const m=(S.turn-(S.fStart||0))/4;if(m>=24)return 0;const base={easy:.28,normal:.14,hard:.05}[S.diff||'normal'];return +(base*(1-m/24)*(OUT().p<=2?1:.6)).toFixed(3);}
function fEarlyCost(){const m=(S.turn-(S.fStart||0))/4;if(m>=12)return 1;return {easy:.78,normal:.88,hard:.96}[S.diff||'normal'];}
function fBankLine(){return {easy:-8,normal:-5,hard:-3}[S.diff||'normal'];}

// ===== 광고 단가·수주 (국장 이상·사장·창간 대표) =====
function adDemand(){const r=S.adRate||1;const pw=mediaPower();return clamp(1-(r-1)*1.25/pw,.55,1.25);}
RUN.adrate=function(){const o=OUT();const r=S.adRate||1;const pw=mediaPower();const corps=ENTS.filter(e=>e[2]==='corp'&&e[4]&&S.net[e[0]]&&!S.net[e[0]].cut).sort((a,b)=>b[4]-a[4]).slice(0,4);
  openModal('광고 단가와 수주',`<p>지금 광고 단가 <b>${Math.round(r*100)}%</b> (기준 100%) · 광고 수요 ${Math.round(adDemand()*100)}% · 매체 파워 ${pw.toFixed(2)}</p><p class="hint">단가를 올리면 광고 한 건 값은 오르지만 광고주가 빠질 수 있다. 매체 파워(급·포털 제휴·평판·트래픽)가 높을수록 비싸게 받아도 버틴다.</p>`,[
   {label:'단가를 10% 올린다',rec:pw>=1.2&&r<1.3,risk:pw<1,sub:r>=1.3?'이미 업계 최고 수준 단가다':pw>=1.2?'파워가 충분하다. 대부분 따라온다':'파워가 약하면 광고주가 빠진다',disabled:r>=1.3,fn:()=>{spend(1,3);setCd('adrate');S.adRate=+(r*1.1).toFixed(2);if(pw<1&&chance(.5)){const e=pick(corps);if(e){S.net[e[0]].rel-=8;toast(`${jo2(e[1],'이','가')} "그 값이면 다른 데 하겠다"고 했다`);}}else toast('단가 인상 공문을 돌렸다');}},
   ...(S.founder?[{label:'부서별 광고·사업 목표 정하기',sub:'자동·수동 · 영업 수당 · 편집·영업 분리',fn:()=>{fAdOpen();return false;}}]:[{label:'기자 영업 방침 정하기',sub:`지금: ${SALES_P[salesPush()]||'보통'} · 차장 이상 기자들의 출입처 광고·협찬 영업`,fn:()=>{salesPolicy();return false;}}]),
   {label:'패키지 할인으로 물량을 늘린다',rec:pw<1||(S.cHit||0)>=.05,sub:'단가 8%↓ · 광고 물량↑',disabled:r<=.7,fn:()=>{spend(1,3);setCd('adrate');S.adRate=+(r*.92).toFixed(2);S.co.adB+=.04;toast('패키지 할인을 시작했다');}},
   ...corps.map(e=>({label:`${e[1]} 연간 광고 계약`,sub:`월 ${adAmt(o.ad*e[4])} 규모 · 관계 ${Math.round(S.net[e[0]].rel)} · 조건이 붙을 수 있다`,fn:()=>{adDeal(e);return false;}})),
   {label:'닫기',cls:'ghost'}]);};
function adDeal(e){const o=OUT(),id=e[0],rel=S.net[id].rel;const amt=+(o.ad*e[4]*12*(.6+Math.random()*.3)*(S.adRate||1)*entB(id)).toFixed(2);const cond=chance(.4+(e[4]>.02?.15:0));
  openModal(`${e[1]} 연간 계약`,`<p class="lede">${e[1]} 마케팅 본부장: "1년치 ${eok(amt)} 집행하겠습니다.${cond?' 대신 저희 신제품 기획 기사 두 건 부탁드려요.':''}"</p>`,[
   {label:'계약한다',sub:`자금 +${eok(amt*.3)} 선입금 · 남은 돈은 매달 광고로${cond?' · 기획 기사 조건 (신뢰↓)':''}`,fn:()=>{spend(1,4);setCd('adrate');S.co.cash+=+(amt*.3).toFixed(2);S.co.adB+=.03;netUp(id,6);if(cond){toast(apply({trust:-2}));portalPen(chance(.4)?1:0,'광고성 기사');}else toast('연간 광고 계약 체결');log(`${e[1]} 연간 광고 계약 ${eok(amt)}`);}},
   ...(cond?[{label:'광고만 받고 기사 조건은 뺀다',sub:`협상력에 따라 · 성공하면 자금 +${eok(amt*.22)}`,fn:()=>{spend(1,4);setCd('adrate');if(chance(.35+rel/200+mediaPower()/5)){S.co.cash+=+(amt*.22).toFixed(2);netUp(id,2);toast('조건 없이 계약했다');}else{netUp(id,-4);toast('협상이 깨졌다');}}}]:[]),
   {label:'거절한다',sub:'',cls:'ghost'}]);}
// 구독·트래픽 성장 상한 기준: 경력 모드는 매체 원래 규모(위상이 오르면 함께 오른다), 창간은 지금 규모
function coCapB(){const o=OUT();if(S.founder||!o)return {s:o?o.subs:1,t:o?o.tr:1};const b=oBase(o),sf=Math.pow(1.15,(o.p||b.p)-b.p);return {s:b.subs*sf,t:b.tr*sf};}
// 기사·특종으로 늘어나는 구독·트래픽도 상한에 가까울수록 덜 는다
function coBump(ps,pt){const c=S.co;if(!c)return;const cb=coCapB(),k=S.founder?[2.5,3]:[2,2];if(ps&&c.subs)c.subs*=1+ps*(ps>0?Math.max(0,1-c.subs/(cb.s*k[0])):1);if(pt&&c.tr)c.tr=Math.round(c.tr*(1+pt*(pt>0?Math.max(0,1-c.tr/(cb.t*k[1])):1)));}
// ===== 기자 광고·협찬 영업: 차장 이상 기자들은 출입처 기업·기관을 돌며 광고·협찬·포럼 후원을 따 온다 =====
// (실제 관행: 출입기자 광고 동행, 포럼·행사 협찬 섭외, 부서별 실적 경쟁 — 기자협회보 보도 참고) · 회사 방침(S.salesPush)에 따라 세기가 다르다
const SALES_P={.35:'영업은 광고국에 맡긴다',1:'기자도 출입처 영업을 거든다',1.6:'차장 이상 광고 할당제'};
function salesPush(){return S&&S.founder?1:(S.salesPush||1);}
// 부서마다 광고·협찬 배정이 다르다: 경제·산업·금융·증권·부동산은 출입처가 곧 광고주라 가장 무겁고(특집 섹션·포럼 협찬), 지역 주재는 지자체·지역 기업 광고,
// 문화·연예·스포츠는 행사·공연 협찬, IT·의료·교육은 업계 광고, 정치·외교·사회·사건·법조·탐사는 가볍다 (편집권과 거리가 먼 부서일수록 영업이 적다)
const DEPT_AD={eco:1.6,ind:1.7,fin:1.6,stock:1.4,estate:1.5,it:1.3,med:1.1,edu:.9,cul:1,ent:1,culspo:1,spo:.9,base:.9,foot:.9,nat:.9,city:1.1,sigun:1.3,loc:1.3,pol:.5,diplo:.3,int:.4,soc:.6,court:.4,case:.3,inv:.2};
function deptAd(d){return DEPT_AD[d]??.8;}
// 7.2 광고 목표 배정용 부서 가중치: 광고 많은 부서가 더 지되, 부서 간 차이는 통상 수준으로 (작은 연예·문화·체육부에 몰리던 쏠림 완화)
function deptAdQ(d){return Math.pow(deptAd(d),.4);}
// ===== 7.1 창간 모드 기사력: 좋은 기사와 좋은 기자가 광고·평판·회사 위신을 끌어올린다 =====
// 부서마다 기자 실력과 이번 달 기사(완성도·단독·파급력)로 '기사력'이 쌓인다(천천히 오르내림).
// 기사력이 높은 부서는 광고주가 먼저 찾아와 영업 역량이 커지고, 회사 전체 기사력은 광고 매출·대표 평판·성장 점수(매체 위상)를 올린다.
function fNPd(d){return (S.fNP&&S.fNP[d])||0;}
function fNPAll(){return (S.fNP&&S.fNP._all)||0;}
function fNPk(d){return clamp(1+fNPd(d)/40,.8,1.5);}
function fStars(){return (S.team||[]).filter(m=>m&&m.name&&(m.skill||0)>=70);}
function fNPTxt(v){return v>=14?['기사력 강함','g']:v>=5?['기사력 좋음','g']:v>-3?['기사력 보통','']:['기사력 약함','r'];}
function fNPMonth(lines){if(!fAdOn())return;const P=S.fNP=S.fNP||{};const T=(S.team||[]).filter(m=>m&&m.name);const ds=fAdDepts();const by={};
  (S.clips||[]).filter(c=>c.turn!=null&&c.turn>S.turn-4).forEach(c=>{const nm=String(c.by||'').replace(/ 기자$/,'');const m=T.find(x=>x.name===nm);const d=m?(m.d||S.dept):'_me';
    const v=Math.max(0,((c.q||50)-55)/15)+(c.excl?1.5:0)+(c.imp||0)/60*((c.q||50)>=60?1:.3)-((c.q||50)<40?1:0);by[d]=(by[d]||0)+v;});
  let sum=0,wt=0;ds.forEach(d=>{const M=T.filter(m=>(m.d||S.dept)===d);const sk=M.length?M.reduce((a,m)=>a+(m.skill||45),0)/M.length:47;const st=M.filter(m=>(m.skill||0)>=70).length;
    const sc=(sk-46)/2+st*2+Math.min(12,(by[d]||0)*2.5);P[d]=+((P[d]||0)*.8+sc*.2).toFixed(2);const w=Math.max(1,fAdHead(d));sum+=P[d]*w;wt+=w;});
  const me=Math.min(10,(by._me||0)*2.5);P._all=+(((P._all||0)*.8+((wt?sum/wt:0)+me*.3)*.2)).toFixed(2);const A=P._all;
  // 평판: 기사력이 좋은 매체의 대표는 업계에서 이름이 난다 (나쁘면 조금씩 깎인다)
  if(A>6)S.fame=clamp(S.fame+Math.min(.35,(A-6)*.04),0,100);else if(A<-4)S.fame=clamp(S.fame-.1,0,100);
  if(A>8)S.co.q=clamp(S.co.q+Math.min(.3,(A-8)*.03),10,100);
  const top=ds.slice().sort((a,b)=>fNPd(b)-fNPd(a))[0];if(top&&month()%3===0&&fNPd(top)>=8)lines.push({c:'g',t:`${DEPTS[top].n} 기사가 업계에서 회자된다 — 광고주들이 먼저 연락해 온다 (기사력 ${fNPTxt(fNPd(top))[0].replace('기사력 ','')})`});}
// 성장 점수(매체 위상)에 더하는 몫: 기사력과 스타 기자
function fNPScore(){return clamp(fNPAll()*.5,-6,12)+Math.min(8,fStars().length*1.5);}
// 회사 광고 매출에 곱하는 몫: 기사력 + 스타 기자(광고주가 그 이름을 보고 붙는다)
function fNPAdK(){return clamp(1+fNPAll()/80+Math.min(.08,fStars().length*.015),.9,1.3);}
// ===== 7.1 창간 모드 부서별 광고·사업 목표: 대표가 부서마다 자동/수동으로 반기 목표를 정한다 =====
// 역량(영업 가능한 기자 수·실력·부서 광고 체질)에 맞춰 AI 기자들이 광고와 사업(포럼 후원·행사·용역)을 따 온다.
// 페이스가 처지면 더 뛰고, 목표를 넘기면 손을 늦춰 기사에 돌아간다. 역량보다 터무니없이 높은 목표는 사기·신뢰·보도 품질을 깎고 사고를 부른다.
const FAD_LV=[[.7,'여유','g'],[1,'적정',''],[1.25,'도전',''],[1.5,'높음','r'],[2,'과도','r'],[3,'터무니없음','r']];
function fAdOn(){return !!(S&&S.founder&&S.co&&!S.story);}
function fAdDepts(){try{return OUT().depts.filter(d=>DEPTS[d]);}catch(e){return [];}}
function fAdHK(t=S.turn){return Math.floor(t/(4*QM));}
function fAdA(){const o=OUT(),c=S.co;return eraGoal()*Math.max(o.ad,c&&c.adEma||o.ad)*(1+(econ()-1)*.5);}
function fAdPer(m,d){return fAdA()*.0055*clamp((m.skill||48)/55,.6,1.4)*[1,1.1,.85,.75][Math.min(3,m.r||0)]*deptAdQ(d)*.84*fNPk(d);}
function fAdUnnamed(){const ds=fAdDepts();const T=(S.team||[]).filter(m=>m&&m.name);return ds.length?Math.max(0,((S.co.staff||1)-1-T.length))/ds.length*.5:0;}
function fAdElig(d){return (S.team||[]).filter(m=>m&&m.name&&(m.d||S.dept)===d&&slOk(m));}
function fAdHead(d){return fAdElig(d).length+fAdUnnamed();}
function fAdCapM(d){return fAdElig(d).reduce((a,m)=>a+fAdPer(m,d),0)+fAdUnnamed()*fAdPer({skill:48,r:0},d);}
function fAdCapH(d){return fAdCapM(d)*QM*SL_G;}
function fAdGoalOf(d){const F=S.fAd,v=F.mode[d]??'auto';const cap=fAdCapH(d);return v==='auto'?cap*.95*(F.gk[d]||1):cap*v;}
function fAdEnsure(){if(!fAdOn())return null;const F=S.fAd=S.fAd||{mode:{},goal:{},got:{},gk:{},e:{},hist:[],bonus:0,wall:0};['mode','goal','got','gk','e'].forEach(k=>F[k]=F[k]||{});F.hist=F.hist||[];
  const hk=fAdHK();if(F.hk!==hk){F.hk=hk;F.got={};F.goal={};F.pts=[];}fAdDepts().forEach(d=>{if(F.goal[d]==null)F.goal[d]=+fAdGoalOf(d).toFixed(3);if(F.got[d]==null)F.got[d]=0;});
  // 자동 목표는 회사가 커지거나 줄면 반기 중에도 따라 움직인다 (한 달에 크게는 못 움직인다)
  if(F.gT!==S.turn){F.gT=S.turn;fAdDepts().forEach(d=>{if((F.mode[d]??'auto')!=='auto')return;const n=fAdGoalOf(d),o=F.goal[d];F.goal[d]=+clamp(n,o*.95,o*1.06).toFixed(3);});}return F;}
function fAdPress(d){const F=S.fAd,cap=fAdCapH(d);return cap>0?F.goal[d]/cap:0;}
function fAdLvTxt(r){return r<.85?['여유','g']:r<1.12?['적정','']:r<1.35?['빠듯','']:r<1.75?['무리','r']:['터무니없음','r'];}
function fAdEmax(){const F=S.fAd;return 1.3+(F.bonus?.15:0)-(F.wall?.25:0);}
// 부서 능력: 영업할 기자들의 실력과 기사력. 능력 좋은 부서는 목표를 조금 넘기고, 약한 부서는 조금 못 채운다
function fAdAbil(d){const M=fAdElig(d);const sk=M.length?M.reduce((a,m)=>a+(m.skill||48),0)/M.length:48;return clamp(.98+(sk-48)/110+fNPd(d)/90,.82,1.15);}
function fAdEffort(){const F=S.fAd,k=qMon();F.eT=S.turn;fAdDepts().forEach(d=>{const g=(F.goal[d]||0)*fAdAbil(d),got=F.got[d]||0,r=fAdPress(d);let e=.85+Math.random()*.3;if(F.wall)e*=.85;
  if(g>0){const pace=k>1?got/(g*(k-1)/QM):1;e*=pace<.7?1.3:pace<.95?1.12:pace>1.25?.6:pace>1.08?.8:1;if(k>=QM-1&&got<g*(k-1)/QM*.95)e+=.15;
    // 남은 몫만큼만 뛴다: 이번 달에 채워야 할 몫보다 한참 앞서면 손을 늦추고, 목표를 채우면 기사로 돌아간다
    const left=Math.max(0,g-got),mLeft=QM-k+1,need=left/mLeft/Math.max(1e-6,fAdCapM(d)*SL_G);if(got>=g)e=.3;else e=Math.min(e,Math.max(.4,need*1.15));}
  if(r>1.1&&got<g)e+=Math.min(.4,(r-1.1)*.6);F.e[d]=+clamp(e,.3,fAdEmax()).toFixed(3);});}
// 회사 손익(coMonth)이 쓰는 기자 영업 매출: 창간 모드는 부서 목표와 AI 노력에서 나온다
function fAdSales(){const F=fAdEnsure();if(!F)return {tot:0,n:0,mine:[]};if(F.eT!==S.turn)fAdEffort();let tot=0,n=0;fAdDepts().forEach(d=>{tot+=fAdCapM(d)*(F.e[d]||1);n+=fAdHead(d);});return {tot,n:Math.round(n),mine:[]};}
function fAdMonth(lines){const F=fAdEnsure();if(!F)return;const c=S.co,sea=(c.last&&c.last.seaA)||1,ds=fAdDepts();const k=qMon(),end=(S.turn+1)%(4*QM)===0;
  const H=ds.reduce((a,d)=>a+fAdHead(d),0)||1;let net=0,mood=0,tr=0,q=0;const ents=ENTS.filter(e=>e[2]==='corp');
  ds.forEach(d=>{const cm=fAdCapM(d),e=F.e[d]||1,v=cm*e*sea;net+=v;F.got[d]=+((F.got[d]||0)+v*SL_G).toFixed(3);const w=fAdHead(d)/H,r=fAdPress(d),g=F.goal[d]||0;
    // AI 기자가 사업(포럼 후원·행사·용역)을 물어 온다: 페이스가 처질 때, 실력 있는 기자가 있을수록
    const ace=fAdElig(d).sort((a,b)=>(b.skill||0)-(a.skill||0))[0];if(g>0&&F.got[d]<g*fAdAbil(d)*k/QM*.95&&chance(.1*e*(ace&&(ace.skill||0)>=55?1.4:.7))){const amt=+Math.min(cm*SL_G*R(15,35)/10,Math.max(cm*SL_G*.8,g-F.got[d])).toFixed(2);F.got[d]=+(F.got[d]+amt).toFixed(3);c.cash+=+(amt/SL_G*.5).toFixed(3);const en=pick(ents);
      lines.push({c:'g',t:`${DEPTS[d].n} ${jo2(ace?ace.name+' 기자':'기자들','이','가')} ${en?en[1]+' ':''}${pick(['포럼 후원','기획 행사 협찬','교육·용역 사업','연간 광고 패키지'])} ${eok(amt)}을 따 왔다 (사업)`});}
    // 영업에 시간을 쏟을수록 기사가 약해진다 (부서 기사력↓), 분리 원칙은 조금 지켜 준다
    if(S.fNP){const dn=Math.max(0,e-1)*.6+(r>1.25?(r-1.25)*.8:0)-(F.wall?.3:0);if(dn)S.fNP[d]=+((S.fNP[d]||0)-dn).toFixed(2);}
    if(r>1.25){const s=r-1.25;mood+=s*1.8*w*(F.bonus?.5:1);tr+=s*.25*w*(F.wall?.3:1);q+=s*.3*w;
      if(r>=1.7&&chance(.06*(r-1.4))){const vic=fAdElig(d).filter(m=>!m.cofounder);if(vic.length&&chance(.5)){const m=pick(vic);S.team=S.team.filter(x=>x!==m);c.staff=Math.max(2,c.staff-1);lines.push({c:'r',t:`${DEPTS[d].n} ${m.name} 기자가 "기자가 아니라 영업사원이 됐다"며 사표를 냈다 (광고 목표 압박)`});log(`${m.name} 기자 퇴사 — ${DEPTS[d].n} 광고 목표 압박`);}
       else if(!F.wall){S.trust=clamp(S.trust-1.5,0,100);portalPen(chance(.3)?1:0,'광고 강매');lines.push({c:'r',t:`${DEPTS[d].n} 기자들이 출입처에 광고를 강요했다는 말이 돈다 — "기사 빼 줄 테니 광고 달라" (신뢰↓)`});}}
      else if(chance(.25))lines.push({c:'r',t:`${DEPTS[d].n}: "이 목표는 사람 수로는 못 채운다"는 말이 나온다 (목표 ${fAdLvTxt(r)[0]})`});}
    else if(r<.8)mood-=.15*w;});
  if(F.bonus){const pay=+(net*.12).toFixed(3);c.cash-=pay;F.bonusPaid=(F.bonusPaid||0)+pay;}
  if(F.wall)S.trust=clamp(S.trust+.03,0,100);
  S.wMood=clamp((S.wMood??60)-mood,0,100);if(tr)S.trust=clamp(S.trust-tr,0,100);if(q)c.q=Math.max(10,c.q-q);
  F.pts=F.pts||[];F.pts[k-1]=ds.reduce((a,d)=>a+F.got[d],0);
  if(month()%3===0||end){const G=ds.reduce((a,d)=>a+(F.goal[d]||0),0),Got=ds.reduce((a,d)=>a+F.got[d],0);lines.push({c:'',t:`부서 광고·사업 실적: 반기 목표 ${eok(G)} 중 ${eok(Got)} (${G?Math.round(Got/G*100):0}%)`});}
  if(!end)return;
  // 반기 마감: 자동 목표는 지난 실적을 보고 완만하게 오르내린다
  const half=`${2027+Math.floor(S.turn/YW)}년 ${S.turn%YW<4*QM?'상반기':'하반기'}`;const rec={h:half,d:{}};
  ds.forEach(d=>{const g=F.goal[d]||0,got=F.got[d]||0,rate=g?got/g:0,r=fAdPress(d),w=fAdHead(d)/H;rec.d[d]=[+got.toFixed(2),+g.toFixed(2)];
    if((F.mode[d]??'auto')==='auto'){const gk=F.gk[d]||1;F.gk[d]=+clamp(rate>1.08?gk*1.04:rate<.85?gk*.95:gk,.85,1.15).toFixed(3);}
    if(rate>=1){S.wMood=clamp((S.wMood??60)+(F.bonus?3:1.5)*w,0,100);}
    else if(rate<.8&&r>1.3){S.wMood=clamp((S.wMood??60)-2.5*w,0,100);fAdElig(d).forEach(m=>{if(m.rel!=null)m.rel=clamp(m.rel-3,-100,100);});lines.push({c:'r',t:`${DEPTS[d].n}: 반기 목표 ${Math.round(rate*100)}% — 애초에 역량보다 너무 높은 목표였다는 불만이 나온다`});}});
  F.hist.unshift(rec);if(F.hist.length>6)F.hist.pop();const G=ds.reduce((a,d)=>a+(F.goal[d]||0),0),Got=ds.reduce((a,d)=>a+(F.got[d]||0),0);
  lines.push({c:Got>=G?'g':'',t:`${half} 광고·사업 마감: 목표 ${eok(G)} 중 ${eok(Got)} (${G?Math.round(Got/G*100):0}%)${F.bonus&&F.bonusPaid?` · 영업 수당 ${eok(F.bonusPaid)} 지급`:''}`});F.bonusPaid=0;}
function fAdSet(d,v){const F=fAdEnsure();const old=F.goal[d]||0;F.mode[d]=v;F.goal[d]=+fAdGoalOf(d).toFixed(3);if(qMon()>=2&&F.goal[d]>old*1.1)S.wMood=clamp((S.wMood??60)-.6,0,100);F.eT=null;}
function fAdOpen(){const F=fAdEnsure();if(!F)return;const ds=fAdDepts();
  openModal('부서별 광고·사업 목표',`<p>부서마다 반기 광고·사업 목표를 정한다. <b>자동</b>은 영업할 수 있는 기자 수와 실력, 부서 광고 체질에 맞춰 회사가 정하고, 지난 반기 실적에 따라 완만하게 오르내린다.</p><p class="hint">목표가 역량보다 높으면 기자들이 영업에 매달려 사기·신뢰·보도 품질이 떨어지고, 지나치면 퇴사나 광고 강매 논란이 생긴다. 낮으면 편하지만 매출이 덜 들어온다.</p>`,
   [...ds.map(d=>{const v=F.mode[d]??'auto',r=fAdPress(d),lv=fAdLvTxt(r);return {label:`${DEPTS[d].n} · ${v==='auto'?'자동':'수동 '+(FAD_LV.find(x=>x[0]===v)||[0,'?'])[1]}`,risk:r>=1.35,sub:`목표 ${eok(F.goal[d])} · 지금 ${eok(F.got[d])} · 영업 ${Math.round(fAdHead(d))}명 · ${lv[0]}`,fn:()=>{fAdDept(d);return false;}};}),
    {label:'모든 부서를 자동으로',sub:'역량에 맞춘 목표로 되돌린다',disabled:ds.every(d=>(F.mode[d]??'auto')==='auto'),fn:()=>{ds.forEach(d=>fAdSet(d,'auto'));toast('모든 부서 목표를 자동으로 돌렸다');render();}},
    {label:F.bonus?'영업 수당을 멈춘다':'영업 수당을 준다',sub:F.bonus?'비용↓ · 영업 의욕↓':'영업 매출 일부를 수당으로 · 더 뛰고, 압박 불만이 줄고, 목표를 채우면 사기↑',fn:()=>{F.bonus=F.bonus?0:1;F.eT=null;log(F.bonus?'영업 수당 도입':'영업 수당 중단');toast(F.bonus?'영업 수당을 걸었다':'영업 수당을 멈췄다');render();}},
    {label:F.wall?'편집·영업 분리 원칙을 푼다':'편집·영업 분리 원칙을 세운다',sub:F.wall?'영업 한도↑ · 신뢰 보너스 사라짐':'기자 영업 한도↓ · 신뢰 매달 조금씩↑ · 광고 강매 논란이 안 생긴다',fn:()=>{F.wall=F.wall?0:1;F.eT=null;log(F.wall?'편집·영업 분리 원칙 선언':'편집·영업 분리 원칙 철회');toast(F.wall?'기사와 광고를 분리하겠다고 선언했다':'분리 원칙을 풀었다');render();}},
    {label:'닫기',cls:'ghost'}]);}
function fAdDept(d){const F=fAdEnsure(),cap=fAdCapH(d),cur=F.mode[d]??'auto';
  openModal(`${DEPTS[d].n} 광고·사업 목표`,`<p>영업할 수 있는 기자 ${Math.round(fAdHead(d))}명 · ${fNPTxt(fNPd(d))[0]} · 역량으로 반기 ${eok(cap)} 안팎을 채울 수 있다. 지금 ${eok(F.got[d])} 채웠다.</p><p class="hint">기사력이 오르면 같은 사람으로도 더 많이 따 온다. 영업을 몰아붙이면 기사가 약해져 기사력이 떨어질 수 있다.</p>`,
   [{label:'자동 (역량에 맞춘다)',rec:cur!=='auto',sub:`목표 ${eok(cap*.95*(F.gk[d]||1))} · 실적 따라 완만하게 조정`,disabled:cur==='auto',fn:()=>{fAdSet(d,'auto');toast(`${DEPTS[d].n} 목표: 자동`);render();}},
    ...FAD_LV.map(([v,n,c])=>({label:`수동 · ${n}`,risk:v>=1.5,disabled:cur===v,sub:`목표 ${eok(cap*v)} · ${v<1?'편하지만 매출↓':v===1?'역량 그대로':v<1.5?'조금 더 뛴다':v<2?'사기·신뢰·품질이 깎인다':v<3?'퇴사·광고 강매 논란 위험':'채울 수 없는 목표 · 큰 반발'}`,fn:()=>{fAdSet(d,v);toast(`${DEPTS[d].n} 목표: ${n} (${eok(F.goal[d])})`);render();}})),
    {label:'← 뒤로',cls:'ghost',fn:()=>{fAdOpen();return false;}}]);}
function fAdTabHTML(){const F=fAdEnsure();if(!F)return '';const ds=fAdDepts(),k=qMon();const half=`${2027+Math.floor(S.turn/YW)}년 ${S.turn%YW<4*QM?'상반기':'하반기'}`;
  const G=ds.reduce((a,d)=>a+(F.goal[d]||0),0),Got=ds.reduce((a,d)=>a+(F.got[d]||0),0),exp=k/QM;
  const row=d=>{const g=F.goal[d]||0,got=F.got[d]||0,rate=g?got/g:0,r=fAdPress(d),lv=fAdLvTxt(r),v=F.mode[d]??'auto';const col=rate>=1?'var(--good)':rate>=exp*.85?'var(--sodium)':'var(--red)';
    return `<div class="card" style="display:block;padding:10px 12px;margin:6px 0"><div style="display:flex;justify-content:space-between;gap:8px;align-items:baseline;flex-wrap:wrap"><b>${DEPTS[d].n}</b><span class="hint" style="margin:0">${v==='auto'?'자동':'수동'} · 영업 ${Math.round(fAdHead(d))}명 · <span style="color:${fNPTxt(fNPd(d))[1]==='g'?'var(--good)':fNPTxt(fNPd(d))[1]==='r'?'var(--red)':'inherit'}">${fNPTxt(fNPd(d))[0]}</span> · <span style="color:${lv[1]==='r'?'var(--red)':lv[1]==='g'?'var(--good)':'var(--fg)'}">${lv[0]}</span></span></div>
     <div style="position:relative;height:8px;background:var(--line);border-radius:4px;margin:7px 0 5px;overflow:hidden"><div style="position:absolute;left:0;top:0;bottom:0;width:${Math.min(100,rate*100)}%;background:${col}"></div><div style="position:absolute;top:0;bottom:0;left:${Math.min(100,exp*100)}%;width:2px;background:var(--fg);opacity:.5"></div></div>
     <div class="hint" style="margin:0">${eok(got)} / ${eok(g)} (${Math.round(rate*100)}%)${(F.e[d]||1)>=fAdEmax()-.01&&got<g?' · 전력으로 뛰는 중':got>=g*1.05?' · 목표 달성, 기사에 집중':''}</div></div>`;};
  const H2=(F.hist||[]).slice(0,3).map(h=>{const g=Object.values(h.d).reduce((a,x)=>a+x[1],0),t=Object.values(h.d).reduce((a,x)=>a+x[0],0);return `<li>${h.h}: ${eok(t)} / ${eok(g)} (${g?Math.round(t/g*100):0}%)</li>`;}).join('');
  return `<p class="lede" style="margin:0 0 6px">${half} ${k}개월째 · 부서 광고·사업 목표 <b>${eok(G)}</b> 중 <b>${eok(Got)}</b> (${G?Math.round(Got/G*100):0}%)</p>
   <p class="hint" style="margin:0 0 6px">회사 기사력 <b>${fNPTxt(fNPAll())[0].replace('기사력 ','')}</b>${fStars().length?` · 스타 기자 ${fStars().length}명`:''} — 좋은 기사와 실력 있는 기자가 많을수록 광고주가 먼저 찾아오고(영업 역량·광고 매출↑), 대표 평판과 매체 위상도 오른다.</p>
   <p class="hint" style="margin:0 0 6px">세로선은 지금쯤 채워야 할 몫. ${F.bonus?'영업 수당 지급 중 · ':''}${F.wall?'편집·영업 분리 원칙 · ':''}목표는 계약 총액 기준이고, 회사 매출에는 순수익만 들어간다.</p>
   ${ds.map(row).join('')}
   <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><button type="button" class="ch" id="fAdBtn" style="flex:1;min-width:140px"><span class="cl">부서별 목표 정하기</span><span class="cs">자동·수동 · 영업 수당 · 편집·영업 분리</span></button>${ACT.fsales?`<button type="button" class="ch ghost" data-act="fsales" ${why('fsales')?'disabled':''} style="flex:1;min-width:140px"><span class="cl">대표가 직접 영업</span>${why('fsales')?`<span class="cs">${esc(why('fsales'))}</span>`:''}</button>`:''}</div>
   ${H2?`<p class="hint" style="margin:10px 0 2px">지난 반기</p><ul class="feed">${H2}</ul>`:''}`;}
function npcSales(o,infl){if(S.founder&&S.co&&!S.story)return fAdSales();let L=[];try{if(!S.founder&&S.co)L=Object.values(roster()).flat();}catch(e){L=[];}
  const T=S.team||[];const pool=(L.length?L:T).filter(m=>m&&(m.r||0)>=1);const jr=L.length?L.filter(m=>m&&(m.r||0)<1&&slOk(m)&&!T.includes(m)):[];const extra=L.length?0:Math.round((S.co.staff||0)*.25)-pool.length;
  const k=o.ad*.0042*salesPush()*(infl||1)*(S.founder?.8:1)*(1+(econ()-1)*.5);let tot=0;const mine=[];
  pool.forEach(m=>{const v=k*clamp((m.skill||50)/62,.6,1.4)*(1+(m.r||1)*.15)*deptAd(m.d)/1.05;tot+=v;if(T.includes(m))mine.push([m,v]);});T.forEach(m=>{if(m&&(m.r||0)<1&&slOk(m))mine.push([m,k*clamp((m.skill||50)/62,.6,1.4)*1.15*deptAd(m.d||S.dept)/1.05*.5]);});
  jr.forEach(m=>{tot+=k*clamp((m.skill||50)/62,.6,1.4)*1.15*deptAd(m.d)/1.05*.5;});if(extra>0)tot+=extra*k;return {tot,n:pool.length+jr.length+Math.max(0,extra),mine};}
// 6.8 부서 광고 할당: 회사가 반기마다 부서별 광고·협찬 목표를 내리고, 차장 이상 기자는 각자 몫을 채우려 뛴다
// 7.0 회사가 커지면(광고 매출이 늘면) 반기 광고 목표도 따라 커진다. 대신 완만하게 (매출 두 배 → 목표 약 1.5배)
function adSizeK(){try{const o=OUT(),c=S.co;if(!c||!o.ad)return 1;if(!c.adEma||!c.adEma0)return 1;return clamp(Math.pow(c.adEma/c.adEma0,.6),.6,1.7);}catch(e){return 1;}}
function npcSaleV(m,d,o){o=o||OUT();const k=o.ad*.0042*salesPush()*(1+(econ()-1)*.5)*adSizeK()*eraGoal();return k*clamp((m.skill||50)/62,.6,1.4)*(1+Math.max(1,m.r||0)*.15)*deptAdQ(d)*.84;}
// 실적은 계약 총액(광고·협찬·포럼 후원) 기준으로 잡는다. 이 가운데 광고국 몫과 겹치지 않는 순증분만 회사 매출에 더해진다 (회사 손익은 그대로)
const SL_FEE=.035,SL_G=5,SL_PK={5:1.5,4:1.15,3:.7,2:.4,1:.3};
// 영업 대상: 차장 이상 + 입사 3년 이상 평기자 (3년 차 미만은 영업하지 않는다)
function slOk(m){return !!m&&((m.r||0)>=1||myrs(m)>=3);}
// 7.1 한 사람 몫: 연차 쌓인 평기자와 차장이 영업의 중심, 데스크를 보는 부장 이상은 가볍게
function npcQuota0(m,d){return slOk(m)?npcSaleV(m,d)*QM*SL_G*[.46,.48,.32,.27][Math.min(3,m.r||0)]:0;}
// 부서 목표는 해마다 고정이 아니다: 지난 반기에 넘치게 채운 부서는 목표가 오르고, 크게 못 채운 부서는 내려간다 (경기는 영업 기대치에 이미 반영)
function goalK(d){return (S.adGK&&S.adGK[d])||1;}
function npcQuota(m,d){return npcQuota0(m,d)*goalK(d);}
// 광고 목표는 반기(6개월) 단위: 상반기 1~6월 · 하반기 7~12월
const QM=6;function qMon(t=S.turn){return Math.floor((t%(4*QM))/4)+1;}
// 7.1 능력만큼 채운다: 목표를 무조건 맞추지 않고, 실력·영업 성향·컨디션에 따라 대략 80~115% 사이에서 자기 수준을 찾는다
function npcAbil(m,a){a=a||m.ai||{};const sk=m.skill||50;let h=0;for(const ch of String(m.id||m.name||''))h=(h*31+ch.charCodeAt(0))>>>0;
  return clamp(.95+(sk-55)/130+(a.y==='sales'?.07:a.y==='fact'?-.03:0)+((a.e??50)-50)/500+((h%9)-4)/100,.8,1.15);}
function npcQGot(m){return (S.team||[]).includes(m)?(m.qS||0):((m.ai&&m.ai.q)||0);}
function deptMembers(d){let L=[];try{L=(roster()[d]||[]).slice();}catch(e){}if(d===S.dept)(S.team||[]).forEach(m=>{if(m&&!L.includes(m)&&(m.d===d||!m.d))L.push(m);});return L.filter(slOk);}
function myAdDirect(){return Math.max(0,(S.adQ||0)-(S.adQT||0));}
// 반기 마감: 부서 AI 실적까지 다 들어온 뒤 한꺼번에. 차장·부장은 부서 목표를 함께 진다
function quarterClose(lines){if(!S.co||S.story||S.founder)return;const k=qMon(),end=(S.turn+1)%(4*QM)===0;
  try{const qq=quota(),got=myQ();S.adqM={m:misIdx(),ok:qq>0&&got>=qq*k/QM*.95};S.dadM=S.adqM;const hk=Math.floor(S.turn/(4*QM));if(!S.adPts||S.adPts.hk!==hk)S.adPts={hk,pts:[]};S.adPts.pts[k-1]={got:+got.toFixed(3),goal:+qq.toFixed(3)};}catch(e){}
  if(!end)return;
  try{const lab=`${2027+Math.floor(S.turn/YW)}년 ${S.turn%YW<4*QM?'상반기':'하반기'}`;const qq=quota(),got=myQ();if(qq>0){S.adHalf=(S.adHalf||[]);S.adHalf.unshift({lab,got:+got.toFixed(2),goal:+qq.toFixed(2),d:nrAll()?'_all':deptShared()?S.dept:null});S.adHalf=S.adHalf.slice(0,8);}
    S.adGK=S.adGK||{};S.adGKn={};Object.entries(roster()).forEach(([d,Lm])=>{if(!DEPTS[d])return;const L=(Lm||[]).filter(slOk);let g=L.reduce((x,m)=>x+npcQuota(m,d),0),gt=L.reduce((x,m)=>x+((m.ai&&m.ai.q)||(S.team||[]).includes(m)&&m.qS||0),0);if(d===S.dept&&deptShared()){g+=quotaOwn();gt+=myAdDirect();}if(!g)return;
      const rt=gt/g,k0=goalK(d);let adj=rt>=1.15?1.06:rt>=1?1.03:rt<.7?.93:rt<.9?.97:1;const k1=clamp(1+(k0*adj-1)*.92,.85,1.2);S.adGK[d]=+k1.toFixed(3);S.adGKn[d]={rt:+rt.toFixed(2),ch:+(k1/k0-1).toFixed(3)};});
    if(deptShared()&&S.adGKn[S.dept]&&lines){const x=S.adGKn[S.dept];if(Math.abs(x.ch)>=.02)lines.push({c:x.ch>0?'':'g',t:`다음 반기 ${DEPTS[S.dept].n} 광고 목표 ${x.ch>0?'상향':'하향'} — 지난 반기 ${Math.round(x.rt*100)}% 달성`});}}catch(e){console.error(e);}
  if((S.rank>=2&&S.rank<=6||deptShared())&&lines){const qq=quota(),got=myQ(),dn=`${S.turn%48<24?'상반기':'하반기'} ${nrAll()?'편집국 전체 ':deptShared()?DEPTS[S.dept].n+' ':''}광고 목표`;if(qq){if(got>=qq){apply({eval:3});lines.push({c:'g',t:`${dn} 달성 (${eok(got)}/${eok(qq)})`});}else if(got<qq*.5){apply({eval:-3});lines.push({c:'r',t:`${dn} 미달 (${eok(got)}/${eok(qq)}). 경영지원실이 ${nrAll()?'편집국장 이름을':deptShared()?'부서 이름을':'이름을'} 적어 갔다.`});}else{lines.push({c:'',t:`${dn} ${eok(got)}/${eok(qq)} — 아슬아슬하게 넘어갔다.`});}}else if(got)lines.push({c:'g',t:`반기 광고·협찬 실적 ${eok(got)}`});}
  S.adQ=0;S.adQT=0;(S.team||[]).forEach(m=>{const g=npcQuota(m,m.d||S.dept);if(g>0)m.qr=(m.qS||0)/g;m.qS=0;});
  let hit=0,miss=0;try{Object.entries(roster()).forEach(([d,Lm])=>{if(!DEPTS[d])return;(Lm||[]).forEach(m=>{const a=m&&m.ai;if(!a)return;const g=npcQuota(m,d);if(g>0){const rr=(a.q||0)/g;a.qr=rr;if(rr>=1){a.e=Math.min(95,a.e+3);hit++;}else if(rr<.5){a.e=Math.max(5,a.e-3);miss++;}}a.q=0;});});}catch(e){}S.nrQ={hit,miss,t:S.turn};}
function deptAdStat(d){const L=deptMembers(d);const rows=L.map(m=>({m,got:npcQGot(m),goal:npcQuota(m,d)}));const me=S.dept===d&&deptShared();const myGoal=me?quotaOwn():0;
  const goal=rows.reduce((a,x)=>a+x.goal,0)+myGoal,got=rows.reduce((a,x)=>a+x.got,0)+(me?myAdDirect():0);return {rows,goal,got,me,myGoal};}
function deptAdBox(){if(!deptShared())return '';const d=S.dept,st=deptAdStat(d);if(!st.rows.length&&!st.myGoal)return '';const k=qMon(),pace=k>1&&st.goal?st.got/(st.goal*(k-1)/QM):1;
  const bar2=(g,q)=>q?bar(Math.min(100,g/q*100),g>=q?'var(--good)':g>=q*(k-1)/QM*.85?'var(--sodium)':'var(--red)'):'';
  const row=(n,sub,g,q)=>`<div style="margin:5px 0"><div class="meta" style="display:flex;justify-content:space-between;gap:8px"><span><b style="color:var(--fg)">${esc(n)}</b> ${esc(sub)}</span><span>${eok(g)}${q?` / ${eok(q)}`:''}</span></div>${bar2(g,q)}</div>`;
  return `<div class="sec">부서 광고·협찬 할당 — ${DEPTS[d].n}</div><p class="hint" style="margin:0 0 4px">광고 배정 ${deptAd(d)>=1.3?'많은':deptAd(d)<=.5?'적은':'보통'} 부서 · ${S.turn%48<24?'상반기':'하반기'} ${k}개월째 · 회사 방침: ${SALES_P[salesPush()]||'보통'}</p>
   ${row('부서 전체','',st.got,st.goal)}<p class="hint" style="margin:0 0 6px">${k===1&&!st.got?'반기가 막 시작됐다. 여섯 달 안에 채우면 된다.':pace>=1?'목표 페이스보다 앞서 있다.':pace>=.85?'목표 페이스를 따라가는 중.':'목표 페이스보다 뒤처졌다. 반기 마감 전에 몰아쳐야 한다.'}</p>
   ${st.me?row(S.name+' (나)',`${rankName()} · 직접 딴 실적 / 내 몫`,myAdDirect(),st.myGoal):''}${st.me?`<p class="hint" style="margin:0 0 6px">부서원(연차 쌓인 기자부터 부장·부국장·국장까지)의 광고 실적은 부서 목표로 함께 잡힌다. 내 몫은 참고용 — 반기 평가는 부서 전체 달성률로 받는다.</p>`:''}
   ${st.rows.sort((a,b)=>b.goal-a.goal).map(x=>{const a=x.m.ai;return row(x.m.name,`${MR[Math.min(3,x.m.r||0)]} · 영업력 ${npcSal43(x.m)}${a&&a.y?` · ${NPC_STY[a.y]}`:''}${a&&a.qr!=null?` · 지난 반기 ${Math.round(a.qr*100)}%`:x.m.qr!=null?` · 지난 반기 ${Math.round(x.m.qr*100)}%`:''}`,x.got,x.goal);}).join('')}`;}
// 사람 탭 첫 화면 요약: 가까운 사람 · 주의할 곳 · 광고 영업 진행률
function peopleSum(){try{const C=(S.cols||[]).slice().sort((a,b)=>b.rel-a.rel);const top=C.slice(0,2);const badC=C.filter(c=>c.rel<=-10).slice(-1);const K=S.net?ENTS.filter(e=>S.net[e[0]]&&S.net[e[0]].known):[];
  const badN=K.filter(e=>{const x=S.net[e[0]];return x.cut>0||x.block>0||x.rel<=-30;}).sort((a,b)=>S.net[a[0]].rel-S.net[b[0]].rel).slice(0,2);const goodN=K.slice().sort((a,b)=>S.net[b[0]].rel-S.net[a[0]].rel).slice(0,1).filter(e=>S.net[e[0]].rel>=30);
  const chip=(t,r,bad)=>`<span class="tag ${bad?'ex':'ok'}">${esc(t)} ${Math.round(r)}</span>`;
  const near=top.map(c=>chip(`${c.name} ${colRole(c)}`,c.rel)).concat(goodN.map(e=>chip(entName(e[0]),S.net[e[0]].rel))).join('')||'<span class="hint">아직 가까운 사람이 없다</span>';
  const warn=badC.map(c=>chip(`${c.name} ${colRole(c)}`,c.rel,1)).concat(badN.map(e=>{const x=S.net[e[0]];return `<span class="tag ex">${esc(entName(e[0]))}${x.cut>0?' · 광고 중단':x.block>0?' · 자료 거부':''} ${Math.round(x.rel)}</span>`;})).join('')||'<span class="hint">지금은 없다</span>';
  let ad='';if(advOn()){const k=qMon(),qq=quota(),got=myQ();if(qq>0){const r=got/qq;ad=`<div class="pr"><b class="l">광고 영업</b><span>${deptShared()?'부서 ':''}${Math.round(r*100)}% · ${k}/${QM}개월째</span><span style="flex:1;min-width:80px">${bar(Math.min(100,r*100),r>=1?'var(--good)':k>1&&got<qq*(k-1)/QM*.85?'var(--red)':'var(--sodium)')}</span></div>`;}}
  return `<div class="card psum"><div class="pr"><b class="l">가까운 사람</b>${near}</div><div class="pr"><b class="l">주의</b>${warn}</div>${ad}</div>`;}catch(e){return '';}}
function advOn(){if(fAdOn())return true;return !!(S&&S.co&&!S.founder&&!S.story&&(deptShared()||(S.rank>=4&&S.rank<=6)));}
// 사람 탭 · 광고 영업: 반기 목표 대비 누적 실적을 그래프와 글로 보여 준다
function advTabHTML(){if(fAdOn())return fAdTabHTML();if(!advOn())return '<p class="empty">광고 영업은 입사 3년 차부터 한다.</p>';const k=qMon(),qq=quota(),sh=deptShared();let got=myQ();const half=`${2027+Math.floor(S.turn/YW)}년 ${S.turn%YW<4*QM?'상반기':'하반기'}`;
  const P=(S.adPts&&S.adPts.hk===Math.floor(S.turn/(4*QM)))?S.adPts.pts.slice():[];const lastG=P.filter(Boolean).reduce((x,p)=>Math.max(x,p.got),0);got=Math.max(got,lastG);P[k-1]={got,goal:qq,live:1};
  const rate=qq?got/qq:0,exp=qq*(k-1)/QM,left=QM-k+1,need=Math.max(0,qq-got);const pace=k>1&&qq?got/exp:1;
  const W=320,H=150,pl=34,pr=8,pt=10,pb=22;const ymax=Math.max(qq,got,...P.filter(Boolean).map(x=>x.got))*1.12||1;const X=i=>pl+(W-pl-pr)*i/QM,Y=v=>pt+(H-pt-pb)*(1-v/ymax);
  const pts=[[0,0]].concat(P.map((x,i)=>x?[i+1,x.got]:null).filter(Boolean));
  const svg=`<svg viewBox="0 0 ${W} ${H}" class="advg" role="img" aria-label="반기 광고 실적 그래프" style="width:100%;max-width:520px;display:block;margin:6px 0">
   ${[0,.5,1].map(f=>`<line x1="${pl}" x2="${W-pr}" y1="${Y(ymax*f/1.12)}" y2="${Y(ymax*f/1.12)}" stroke="var(--line)" stroke-width="1"/><text x="${pl-4}" y="${Y(ymax*f/1.12)+3}" text-anchor="end" font-size="9" fill="var(--mute)">${eok(ymax*f/1.12).replace(' 원','')}</text>`).join('')}
   <line x1="${X(0)}" y1="${Y(0)}" x2="${X(QM)}" y2="${Y(qq)}" stroke="var(--mute)" stroke-dasharray="3 3" stroke-width="1.2"/>
   <line x1="${pl}" x2="${W-pr}" y1="${Y(qq)}" y2="${Y(qq)}" stroke="var(--sodium)" stroke-dasharray="5 3" stroke-width="1.4"/><text x="${W-pr}" y="${Y(qq)-4}" text-anchor="end" font-size="10" fill="var(--sodium)">목표 ${eok(qq)}</text>
   <polyline points="${pts.map(([i,v])=>`${X(i)},${Y(v)}`).join(' ')}" fill="none" stroke="${rate>=1?'var(--good)':pace>=.85?'var(--sodium)':'var(--red)'}" stroke-width="2.4"/>
   ${pts.slice(1).map(([i,v])=>`<circle cx="${X(i)}" cy="${Y(v)}" r="3" fill="${rate>=1?'var(--good)':'var(--fg)'}"/>`).join('')}
   ${Array.from({length:QM},(_,i)=>`<text x="${X(i+1)}" y="${H-6}" text-anchor="middle" font-size="9" fill="${i+1===k?'var(--fg)':'var(--mute)'}">${(S.turn%YW<4*QM?0:6)+i+1}월</text>`).join('')}
  </svg>`;
  const gn=sh&&S.adGKn&&S.adGKn[S.dept];const NA=nrAll();const H2=(S.adHalf||[]).filter(x=>NA?x.d==='_all':sh?x.d===S.dept:!x.d).slice(0,4);
  const txt=`${half} ${k}개월째 · ${NA?'편집국 전체 목표(전 부서 합산)':sh?`${DEPTS[S.dept].n} 부서 목표(부서원 공동)`:'내 반기 목표'} <b>${eok(qq)}</b> 중 <b>${eok(got)}</b> (${Math.round(rate*100)}%)`;
  const judge=rate>=1?'이미 목표를 넘겼다. 남은 달은 덤이다.':k===1&&!got?'반기가 막 시작됐다.':pace>=1?'목표 페이스보다 앞서 있다.':pace>=.85?'목표 페이스를 따라가는 중이다.':'페이스보다 뒤처졌다.';
  return `<div class="card"><div class="t">광고·협찬 영업 — ${esc(half)}</div><p class="meta" style="display:block">${txt}</p>${svg}<p class="hint" style="margin:0">회색 점선은 목표 페이스, 주황 점선은 반기 목표다. ${judge}${rate<1?` 남은 ${left}달 동안 월 ${eok(need/left)}씩 더 채워야 한다.`:''}</p>
   ${gn&&Math.abs(gn.ch)>=.02?`<p class="hint" style="margin:6px 0 0">이번 반기 목표는 지난 반기 ${Math.round(gn.rt*100)}% 달성에 맞춰 ${gn.ch>0?'올라갔다':'내려갔다'}. 넘치게 채우면 다음 목표가 오르고, 크게 못 채우면 내려간다.</p>`:`<p class="hint" style="margin:6px 0 0">목표는 반기마다 달라진다. 넘치게 채우면 다음 목표가 오르고, 크게 못 채우면 내려간다.</p>`}
   <div style="display:flex;gap:6px;flex-wrap:wrap;margin-top:8px"><button type="button" class="ch" data-act="adsell" ${why('adsell')?'disabled':''} style="flex:1;min-width:140px"><span class="cl">광고·협찬 영업 나가기</span>${why('adsell')?`<span class="cs">${esc(why('adsell'))}</span>`:''}</button>${S.rank>=3&&S.rank<=5&&sh?`<button type="button" class="ch ghost" id="advPush" style="flex:1;min-width:140px"><span class="cl">부서원 영업 독려</span></button>`:''}${NA?`<button type="button" class="ch ghost" id="nrPush" style="flex:1;min-width:140px"><span class="cl">전 부서 영업 독려</span>${S.nrPush!=null&&S.turn-S.nrPush<8?'<span class="cs">최근에 이미 독려했다</span>':''}</button>`:''}</div></div>
   ${sh?`<div class="card">${deptAdBox()}</div>`:''}${NA?`<div class="card">${nrAdBox()}</div>`:''}
   ${H2.length?`<div class="card"><div class="t">지난 반기</div>${H2.map(x=>`<div style="margin:5px 0"><div class="meta" style="display:flex;justify-content:space-between"><span>${esc(x.lab)}</span><span>${eok(x.got)} / ${eok(x.goal)} · ${Math.round(x.got/x.goal*100)}%</span></div>${bar(Math.min(100,x.got/x.goal*100),x.got>=x.goal?'var(--good)':x.got>=x.goal*.5?'var(--sodium)':'var(--red)')}</div>`).join('')}</div>`:''}`;}
function nrAdBox(){const st=nrAdStat(),k=qMon();const bar2=(g,q)=>q?bar(Math.min(100,g/q*100),g>=q?'var(--good)':g>=q*(k-1)/QM*.85?'var(--sodium)':'var(--red)'):'';
  const L=st.depts.slice().sort((a,b)=>(a.goal?a.got/a.goal:9)-(b.goal?b.got/b.goal:9));
  return `<div class="t">부서별 실적 — 편집국 전체 ${eok(st.got)} / ${eok(st.goal)}</div><p class="hint" style="margin:0 0 6px">편집국장은 부서가 없어 전 부서 실적 합계가 목표다. 처지는 부서가 위에 온다.${st.mine?` 내가 직접 딴 실적 ${eok(st.mine)} 포함.`:''}</p>${L.map(x=>`<div style="margin:5px 0"><div class="meta" style="display:flex;justify-content:space-between;gap:8px"><span><b style="color:var(--fg)">${esc(DEPTS[x.d].n)}</b> ${x.n}명</span><span>${eok(x.got)} / ${eok(x.goal)}</span></div>${bar2(x.got,x.goal)}</div>`).join('')}`;}
// 7.1 AI 편집국장도 광고를 챙긴다: 편집국 전체 페이스가 처지면 부장단을 독려하고, 직접 큰 광고·협찬을 따 와 가장 처지는 부서 실적에 얹는다
function chiefSales(lines){if(!S.co||S.founder||S.story||S.rank===6||salesPush()<.5)return;const per=(()=>{try{return roster();}catch(e){return null;}})();if(!per)return;
  const k=qMon(),st=nrAdStat();if(!st.goal)return;const nm=(leaders()||{}).chief||'편집국장';let h=0;for(const ch of String(nm))h=(h*31+ch.charCodeAt(0))>>>0;const cab=.9+(h%21)/100;/* 편집국장마다 영업 수완이 다르다 */const exp=st.goal*k/QM*cab,behind=st.got<exp*.92;const C=S.chiefAd=S.chiefAd||{};
  if(k>=2&&behind&&(S.nrPush==null||S.turn-S.nrPush>=8)&&chance(.55)){S.nrPush=S.turn;S.wMood=clamp((S.wMood??60)-1,0,100);C.push=(C.push||0)+1;
    lines.push({c:'',t:`편집국장 ${nm}: "반기 숫자가 처집니다. 부서장들이 책임지고 맞춥시다." — 이번 달 전 부서가 영업에 더 뛴다`});}
  if(st.got>=exp*1.02||!chance((behind?.4:.18)*(cab+.1)))return;
  const L=st.depts.filter(x=>x.goal>0).sort((a,b)=>a.got/a.goal-b.got/b.goal);const tgt=L[0];if(!tgt)return;const gap=tgt.goal*Math.min(1,(k+1)/QM)-tgt.got;if(gap<=tgt.goal*.04)return;
  const amt=+Math.min(st.goal*R(2,5)/100,Math.max(st.goal*.015,exp-st.got),gap*R(70,110)/100).toFixed(2);const M=(per[tgt.d]||[]).filter(m=>m&&m.ai&&slOk(m));
  if(M.length){const sh=amt/M.length;M.forEach(m=>{m.ai.q=(m.ai.q||0)+sh;});}else return;
  S.co.cash+=+(amt/SL_G*.45).toFixed(3);C.n=(C.n||0)+1;C.sum=+((C.sum||0)+amt).toFixed(2);const corp=pick(ENTS.filter(e=>e[2]==='corp'))||['','대기업'];
  lines.push({c:'g',t:`편집국장 ${nm}, ${corp[1]} ${pick(['연간 협찬','포럼 메인 후원','기획 시리즈 광고','창간 기념 특집 광고'])} ${eok(amt)} 수주 — 처지던 ${DEPTS[tgt.d].n} 실적에 얹었다`});}
function nrPushOpen(){const cd=S.nrPush!=null&&S.turn-S.nrPush<8;openModal('전 부서 광고 실적',nrAdBox(),[{label:'전 부서 영업을 독려한다',sub:cd?'최근에 이미 독려했다':'행동력 1 · 다음 한 달 모든 부서가 영업에 더 뛴다 · 편집국 사기↓',disabled:cd||S.ap<1,fn:()=>{spend(1,2);S.nrPush=S.turn;S.wMood=clamp((S.wMood??60)-2,0,100);log('편집국장, 전 부서 광고 영업 독려');toast('"반기 숫자, 부서장들이 책임지고 맞춥시다." 부장단 회의에서 할당을 짚었다');}},{label:'닫기',cls:'ghost'}]);}
function deptAdOpen(){const on=S.rank>=3&&S.rank<=5&&!S.founder;const cd=S.deptPush!=null&&S.turn-S.deptPush<8;
  openModal('부서 광고 할당 현황',deptAdBox()||'<p>부서 할당이 없다.</p>',[{label:'부서원 영업을 독려한다',sub:on?(cd?'최근에 이미 독려했다':'행동력 1 · 다음 한 달 차장 이상이 영업에 더 뛴다 · 부서 사기 조금↓'):'부장만 할 수 있다',disabled:!on||cd||S.ap<1,fn:()=>{spend(1,2);S.deptPush=S.turn;S.wMood=clamp((S.wMood??60)-1.5,0,100);(S.team||[]).forEach(m=>{if((m.r||0)>=1)m.rel=clamp((m.rel||0)-1,-50,100);});log(`${DEPTS[S.dept].n} 부서원 광고 영업 독려`);toast('"이번 반기 숫자 맞춰 봅시다." 부서 회의에서 할당을 다시 짚었다');}},{label:'닫기',cls:'ghost'}]);}
function salesPolicy(){const p=salesPush();const o=OUT();const sl=npcSales(o,1);
  openModal('기자 영업 방침',`<p class="lede">차장 이상 기자 ${sl.n}명이 출입처 기업·기관을 돌며 광고·협찬·포럼 후원을 따 온다. 지금 월 ${eok(sl.tot)}.</p><p class="hint">영업을 세게 밀면 매출은 오르지만 "단독보다 매출"이라는 말이 돌고 신뢰·사기·보도 품질이 깎인다. 광고국에 맡기면 매출은 줄지만 편집국이 기사에 집중한다.</p>`,[
   {label:'광고국에 맡긴다',sub:'기자 영업 매출↓↓ · 신뢰·사기 조금씩↑',disabled:p===.35,fn:()=>{S.salesPush=.35;log('기자 영업 방침: 광고국 전담');toast('기자들은 취재에 집중한다');}},
   {label:'출입처 영업을 거들게 한다',sub:'기본 · 매출과 편집국의 균형',disabled:p===1,rec:p!==1,fn:()=>{S.salesPush=1;log('기자 영업 방침: 보통');toast('기본 방침으로 돌렸다');}},
   {label:'차장 이상 광고 할당제',sub:'기자 영업 매출↑↑ · 신뢰·사기·품질 매달 조금씩↓',risk:true,disabled:p===1.6,fn:()=>{S.salesPush=1.6;log('기자 영업 방침: 광고 할당제');toast('차장 이상에게 반기 광고 할당이 떨어졌다');}},
   {label:'닫기',cls:'ghost'}]);}