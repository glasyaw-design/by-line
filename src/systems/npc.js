/* 바이라인 — src/systems/npc.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */

// ===== 편집국의 다른 기자들도 매달 기사를 쓰고, 데스크가 거른다: 단독은 회사 품질·독자를, 오보는 신뢰를 움직인다 =====
// ===== AI 기자의 한 달: 기자마다 행동력·컨디션·사내 평가·취재원·스타일이 있고, 플레이어처럼 취재·출고·데스킹·영업·휴식에 시간을 나눈다 =====
// 회사 전체의 단독·오보·영업 총량은 기존 기대치에 맞춰 두고(밸런스 유지), 그 몫을 누가 가져가는지만 각자의 판단과 컨디션으로 갈린다
const NPC_STY={scoop:'특종형',fact:'검증형',net:'마당발',buzz:'속보형',sales:'영업형'};
function npcAI(m){if(!m.ai){let h=0;for(const ch of String(m.id||m.name||''))h=(h*31+ch.charCodeAt(0))>>>0;m.ai={h:70+h%25,e:45+h%15,s:1+h%4,y:Object.keys(NPC_STY)[(h>>>3)%5],ar:0,sc:0,er:0,sl:0,bo:0};}return m.ai;}
function npcGrade(e){return e>=68?'A':e>=55?'B':e>=42?'C':'D';}
function npcLine(m){const a=m.ai;if(!a)return '';const hp=(m.r||0)>=2?` · 부서 방향: ${BPREF[npcPref(m,m.d)].n}`:'';const ly=!a.ar&&a.ly;const R0=ly?a.ly:a;return `${NPC_STY[a.y]} · ${ly?'지난해':'올해'} 기사 ${R0.ar} · 단독 ${R0.sc}${R0.er?` · 오보 ${R0.er}`:''}${R0.sl>=.005?` · 영업 ${eok(R0.sl)}`:''}${(m.r||0)>=1&&a.qr!=null?` · 지난 반기 할당 ${Math.round(a.qr*100)}%`:''} · 평가 ${npcGrade(a.e)}${a.bo?' · 번아웃 휴직':''}${hp}`;}
function newsroomMonth(lines){if(!S.co||S.story||S.founder)return;let per;try{per=roster();}catch(e){return;}const T=S.team||[];const o=OUT();const push=salesPush();const dk=DF().risk||1;
  const W=[];let Esc=0,Eer=0,SB=0,SA=0;
  Object.keys(per).forEach(d=>{if(/^x_/.test(d)||!DEPTS[d])return;const L=per[d].filter(m=>m&&!T.includes(m));if(!L.length)return;
    // 1) 행동력 나누기: 데스크는 데스킹, 차장 이상은 영업, 나머지는 취재·기사. 컨디션이 바닥이면 쉰다
    const qk=qMon(),dGoal=L.reduce((x,m)=>x+npcQuota(m,d),0),dGot=L.reduce((x,m)=>x+((m.ai&&m.ai.q)||0),0);const hd0=L.filter(m=>(m.r||0)>=2).sort((a,b)=>(b.r||0)-(a.r||0))[0];
    const dPush=(d===S.dept&&S.deptPush!=null&&S.turn-S.deptPush<4)||(S.nrPush!=null&&S.turn-S.nrPush<4&&chance(.8))||(hd0&&qk>1&&dGoal>0&&dGot<dGoal*(qk-1)/QM*.85&&(npcPref(hd0,d)==='sales'||chance(.5)));
    let deskPow=0;const plans=L.map(m=>{const a=npcAI(m);const r=m.r||0;let ap=r>=2?6:r===1?7:8,rest=0,desk=0,sale=0,b0v=0;
      if(a.bo>0){a.bo--;a.h=Math.min(100,a.h+30);return {m,a,rep:0,desk:0,sale:0,off:1};}
      if(a.h<30){rest=3;ap-=3;}
      if(r>=2){desk=Math.min(ap,3+(L.length>8?1:0));ap-=desk;}
      if(slOk(m)){const b0=b0v=Math.min(ap,Math.round(((push>=1.5?2:push>=1?1:0)*(deptAd(d)>=1.3?1.5:deptAd(d)<=.5?.5:1)+(a.y==='sales'?1:0))*(r>=1?1:.5)));let add=0;const g=npcQuota(m,d)*npcAbil(m,a);
        // 자기 분기 할당 대비 페이스를 보고 영업 시간을 늘리거나 줄인다. 분기 마지막 달엔 몰아치고, 부장이 독려하면 더 뛴다
        if(g>0&&push>.5){const pace=qk>1?(a.q||0)/(g*(qk-1)/QM):(a.qr??1);const dBehind=qk>1&&dGoal>0&&dGot<dGoal*(qk-1)/QM*.95;if(pace<.7)add=2;else if(pace<.95)add=1;else if(pace>1.35)add=dBehind?0:-2;else if(pace>1.12)add=dBehind?0:-1;if(dBehind&&pace>=.95&&chance(.4))add++;if(qk>=QM-1&&(a.q||0)<g*(qk-1)/QM*.9)add++;if(dPush&&chance(.6))add++;if(a.h<35)add=Math.min(add,0);}
        sale=clamp(b0+add,0,Math.max(0,ap-1));SB+=b0;SA+=sale;ap-=sale;}
      deskPow+=desk*(m.skill||50)/55;return {m,a,rep:ap,desk,sale,rest,b0:b0v};});
    const dq=clamp(deskPow/Math.max(1,L.length*.6),0,1);const hd=L.filter(m=>(m.r||0)>=2).sort((a,b)=>(b.r||0)-(a.r||0))[0];const dp=hd?npcPref(hd,d):null;
    const DPK={scoop:[1.25,1.1,1,1],inv:[1.2,.95,.8,1],speed:[.95,1.25,1.2,1],fact:[.95,.65,.95,1],sales:[.9,1.1,1,1.4],people:[1,1,1,1]}[dp]||[1,1,1,1];
    const desk0=L.filter(m=>(m.r||0)>=2).reduce((x,m)=>Math.max(x,m.skill||50),45);
    // 7.1 AI 부장의 취재 지시: 부서장이 컨디션 좋은 유능한 기자 한 명에게 큰 건을 맡긴다 (단독·탐사 위주 부장일수록 자주)
    if(hd&&L.length>=3&&chance(.45+(dp==='scoop'||dp==='inv'?.2:0))){const cand=plans.filter(p=>!p.off&&(p.m.r||0)<=1&&p.a.h>=40&&p.rep>=3);if(cand.length){const t=cand.sort((x,y)=>(y.m.skill||50)*(1+y.a.s/10)-(x.m.skill||50)*(1+x.a.s/10))[0];t.asg=hd;}}
    plans.forEach(p=>{const m=p.m,a=p.a,sk=m.skill||50;
      // 기존 기대치(밸런스 기준)
      Esc+=.012*Math.pow(sk/55,2);Eer+=.0016*dk*clamp((70-sk)/30+1,.4,2)*clamp((105-desk0)/55,.4,1.4);
      if(p.off){W.push({m,d,a,scS:0,erS:0,slS:0,arts:0});return;}
      const arts=Math.max(0,Math.round(p.rep/3*(.6+Math.random()*.8)*clamp(a.h/70,.5,1.1)*DPK[2])+(a.y==='buzz'&&chance(.7)?1:0));
      const scS=Math.sqrt(eraImpD(d))*(p.asg?1.45:1)*DPK[0]*p.rep*Math.pow(sk/55,2)*(1+a.s/10)*({scoop:1.4,net:1.2,buzz:.9,fact:.9,sales:.7}[a.y])*clamp(a.h/80,.4,1.1);
      const erS=DPK[1]*arts*clamp((72-sk)/30+.5,.3,2)*({buzz:1.8,fact:.5,scoop:1.1,net:1,sales:1.2}[a.y])*(1.2-dq*.7)*(a.h<35?1.4:1);
      const slS=DPK[3]*p.sale*(sk/55)*(1+(m.r||0)*.15)*deptAd(d)*(.7+Math.random()*.6);
      // 2) 몸과 마음: 많이 뛰면 지치고, 쉬면 돌아온다. 바닥까지 가면 한 달 번아웃 휴직
      a.h=clamp(a.h-(p.rep*2.2+p.desk*1.6+p.sale*1.6)+16+(p.rest?18:0),0,100);if(a.h<12&&chance(.5)){a.bo=1;S.nrBurn=(S.nrBurn||0)+1;}
      if(chance(.08+(a.y==='net'?.08:0)))a.s=Math.min(12,a.s+1);a.ar+=arts;
      W.push({m,d,a,scS,erS,slS,arts,asg:p.asg,sale:p.sale,b0:p.b0});});});
  if(!W.length)return;
  // 3) 결과: 총량은 기대치 그대로, 몫은 각자의 노력·실력·스타일대로
  const sumS=W.reduce((x,w)=>x+w.scS,0)||1,sumE=W.reduce((x,w)=>x+w.erS,0)||1,sumL=W.reduce((x,w)=>x+w.slS,0)||1;
  // 부서별 실적 몫: 부서원 목표의 한 달 치에 노력(영업 시간)·경기 운이 곱해져 나오고, 각자 뛴 만큼 나눠 가진 다 (회사 손익은 npcSales 기준 그대로)
  const dPool={};const effK=clamp(1+((SA/(SB||1))-1)*.25,.92,1.1);W.forEach(w=>{if(!w.slS)return;const P=dPool[w.d]=dPool[w.d]||{p:0,s:0,n:0};P.s+=w.slS;});Object.keys(dPool).forEach(d=>{dPool[d].p=W.filter(w=>w.d===d).reduce((x,w)=>x+npcQuota0(w.m,d)/QM,0)*effK*(.9+Math.random()*.2);});
  let sc=[],er=[];const salesTot=(()=>{try{const L=W.filter(w=>(w.m.r||0)>=1);const k=o.ad*.0042*push*(1+(econ()-1)*.5);return L.reduce((x,w)=>x+k*clamp((w.m.skill||50)/62,.6,1.4)*(1+(w.m.r||1)*.15)*deptAd(w.d)/1.05,0)*clamp(1+((SA/(SB||1))-1)*.25,.92,1.1);}catch(e){return 0;}})();
  W.forEach(w=>{const a=w.a;if(w.scS&&chance(Math.min(.6,Esc*w.scS/sumS)))sc.push(w);if(w.erS&&chance(Math.min(.5,Eer*w.erS/sumE)))er.push(w);if(w.slS){/* 7.1 한 사람 실적은 자기 몫 × 이번 달 영업에 쓴 시간(평소 대비) × 실력·운: 많이 뛴 사람이 더 따 오고, 앞선 사람은 손을 늦춘다 */const ef=Math.max((w.m.r||0)>=2?.75:0,Math.pow(clamp((w.sale||0)/Math.max(1,w.b0||1),.3,1.8),.65));const ab=npcAbil(w.m,a),gA=npcQuota(w.m,w.d)*ab;let v=npcQuota(w.m,w.d)/QM*ef*1.13*Math.pow(ab,1.5)*(.85+Math.random()*.3)*(push<.5?.4:1);if((a.q||0)>=gA*1.05)v*=.35;a.sl+=v;a.q=(a.q||0)+v;}
    // 4) 사내 평가: 기사·단독·영업은 올리고, 오보와 번아웃은 깎는다
    a.e=clamp(a.e+(w.arts*.5+(w.slS?.9:0)-1.15-(a.h<30?1:0)-(a.bo?2:0))*.6+(52-a.e)*.03,5,95);});
  sc=sc.slice(0,6);er=er.slice(0,2);{const x=sc.find(w=>w.asg);if(x){x.a.e=Math.min(95,x.a.e+2);if(x.asg.ai)x.asg.ai.e=Math.min(95,x.asg.ai.e+1.5);if(lines&&(x.d===S.dept||S.rank>=4)&&chance(.7))lines.push({c:'',t:`${DEPTS[x.d].n} ${x.asg.name} ${MR[Math.min(3,x.asg.r||2)]}의 지시로 ${x.m.name} 기자가 단독을 냈다`});}}sc.forEach(w=>{w.a.sc++;w.a.e=Math.min(95,w.a.e+6);w.m.skill=Math.min(85,(w.m.skill||50)+.3);});er.forEach(w=>{w.a.er++;w.a.e=Math.max(5,w.a.e-8);});
  S.nrLast={sc:sc.map(x=>({n:x.m.name,d:x.d,sk:x.m.skill})),t:S.turn};
  sc.forEach(()=>{S.co.q=Math.min(100,S.co.q+.05*Math.max(0,(80-S.co.q)/25));coBump(.0005,.002);});
  // 간부라면 다른 기자의 오보 한 건은 직접 처리한다 (이벤트)
  let erEv=null;if(S.rank>=4&&er.length&&chance(.6)&&!S.simple){erEv=er.shift();}
  er.forEach(()=>{S.co.q=Math.max(10,S.co.q-.4);S.trust=clamp(S.trust-(S.rank>=4?.35:.12),0,100);});
  if(erEv){const t0=nrTitle(erEv.d);Q.push(()=>nrErrEvent(erEv,t0));}
  if(S.rank>=4&&sc.length&&chance(.3)&&!S.simple){const x=sc.slice().sort((a,b)=>(b.m.skill||0)-(a.m.skill||0))[0];Q.push(()=>nrScoopEvent(x));}
  if(sc.length){const x=sc.slice().sort((a,b)=>(b.m.skill||0)-(a.m.skill||0))[0];tick(`[${o.n}] [단독] ${nrTitle(x.d)} — ${x.m.name} 기자`);S.coScoopY=(S.coScoopY||0)+sc.length;}
  if(er.length){const x=er[0];if(lines)lines.push({c:'r',t:`정정보도: ${DEPTS[x.d].n} ${x.m.name} 기자의 「${nrTitle(x.d)}」${S.rank>=4?' — 편집국 책임자로서 신뢰도 타격을 함께 받았다':''}`});log(`정정보도(${DEPTS[x.d].n} ${x.m.name})`);S.coErrY=(S.coErrY||0)+er.length;}
  if(lines&&S.rank>=4&&month()%3===0){const act=W.filter(w=>w.a.ar);const mvp=act.slice().sort((a,b)=>(b.a.sc*10+b.a.ar*.3+b.a.e*.1)-(a.a.sc*10+a.a.ar*.3+a.a.e*.1))[0];const sk=W.filter(w=>w.a.sl>0).sort((a,b)=>b.a.sl-a.a.sl)[0];
    lines.push({c:'',t:`편집국 성적(최근 분기): 다른 기자들의 단독 ${S.coScoopY||0}건 · 정정보도 ${S.coErrY||0}건${mvp?` · MVP ${DEPTS[mvp.d].n} ${mvp.m.name}(${NPC_STY[mvp.a.y]}, 올해 단독 ${mvp.a.sc})`:''}${sk?` · 영업왕 ${sk.m.name}(${eok(sk.a.sl)})`:''}${S.nrBurn?` · 번아웃 휴직 ${S.nrBurn}명`:''}`});S.nrBurn=0;}
  if(month()%3===0){S.coScoopY=0;S.coErrY=0;}
  // 5) 연말: 일한 만큼 실력이 늘고(고참은 덜), 한 해 기록은 새로 시작
  if(month()===12)W.forEach(w=>{const m=w.m,a=w.a;const g=(a.ar>=15?1.2:a.ar>=8?.8:.4)*((m.r||0)>=2?.5:1)+(a.sc?.5:0);if((m.skill||50)<85)m.skill=Math.min(85,(m.skill||50)+R(0,2)*g);a.ly={ar:a.ar,sc:a.sc,er:a.er,sl:+a.sl.toFixed(3)};a.ar=0;a.sc=0;a.er=0;a.sl=0;});}
// ===== 다른 기자들의 일이 나에게 오는 순간 (간부·평기자) =====
function nrPool(f){let L=[];try{L=Object.values(roster()).flat();}catch(e){}const T=S.team||[];return L.filter(m=>m&&m.name&&DEPTS[m.d]&&!/^x_/.test(m.d)&&!T.includes(m)&&(!f||f(m)));}
function nrTitle(d){try{return makeItem(d,{anyScale:true}).title;}catch(e){return (DEPTS[d]?DEPTS[d].n:'')+' 기획';}}
function nrErrEvent(x,t){const m=x.m,dn=DEPTS[x.d].n;
  openModal('편집국 오보 · 처리 결정',`<p class="lede">${dn} ${esc(m.name)} 기자의 「${esc(t)}」에 사실과 다른 대목이 있다는 항의가 들어왔다. 데스크도 놓쳤다. ${rankName()}의 판단을 기다린다.</p>`,[
   {label:'즉시 정정보도를 낸다',sub:'신뢰 조금↓ · 빨리 털고 간다',rec:true,fn:()=>{S.co.q=Math.max(10,S.co.q-.3);toast(apply({trust:-.6}));log(`정정보도(${dn} ${m.name})`);}},
   {label:'버틴다 — "취재는 충분했다"',sub:'맞으면 넘어가고, 틀리면 소송·신뢰 크게↓',risk:true,fn:()=>{if(chance(.45)){toast('항의가 잦아들었다');}else{S.co.cash-=.3*(OUT().p/3);S.co.q=Math.max(10,S.co.q-.8);toast(apply({trust:-2.5,eval:-1}));log(`오보 버티다 패소(${m.name})`);}}},
   {label:'정정하고 담당 기자를 징계한다',sub:'신뢰 그대로 · 편집국 사기↓ · 기강↑',fn:()=>{S.wMood=clamp((S.wMood??60)-4,0,100);m.skill=Math.max(20,(m.skill||50)-1);S.co.q=Math.min(100,S.co.q+.2);toast(apply({trust:-.2,eval:.5}));log(`${m.name} 기자 징계`);}}]);}
function nrScoopEvent(x){const m=x.m,dn=DEPTS[x.d].n,t=nrTitle(x.d);const adv=chance(.25);
  openModal('편집국 대형 단독',`<p class="lede">${dn} ${esc(m.name)} 기자가 「${esc(t)}」 단독을 들고 왔다.${adv?' 큰 광고주와 얽혀 있다.':''} 내일 자를 어떻게 할까?</p>`,[
   {label:`${isTV()?'메인뉴스 첫 꼭지로':'1면 톱으로'} 키운다`,sub:'회사 품질·평판↑ · 확인이 덜 됐으면 위험',rec:!adv,fn:()=>{S.co.q=Math.min(100,S.co.q+.8);coBump(.003,.01);m.skill=Math.min(85,(m.skill||50)+1);const ok=chance(.85);if(ok)toast(apply({fame:.8,eval:.8}));else{S.co.q-=1;toast(apply({trust:-1.5}));}tick(`[${OUT().n}] [단독] ${t} — ${m.name} 기자`,1);}},
   {label:'하루 더 보강시킨다',sub:'더 단단해지지만 타사에 뺏길 수도',fn:()=>{if(chance(.7)){S.co.q=Math.min(100,S.co.q+1);toast(apply({fame:.5,trust:.3}));}else{toast('하루 사이 타사가 먼저 썼다');apply({eval:-.4});}}},
   ...(adv?[{label:'광고주 관련이니 접는다',sub:'광고↑ · 신뢰·편집국 사기↓',fn:()=>{S.co.adB+=.04;S.wMood=clamp((S.wMood??60)-5,0,100);toast(apply({trust:-1.5}));log(`${m.name} 기자 단독 킬(광고주)`);}}]:[])]);}
const NR_EV=[
 // 7.0 반기 마감 영업 SOS: 부서 광고 목표가 처지면 AI 차장이 큰 건을 같이 가자고 한다
 {w:5,c:()=>!S.story&&advOn()&&deptShared()&&qMon()>=QM-1&&quota()>0&&myQ()<quota()*(qMon()-1)/QM*.95&&deptMembers(S.dept).some(m=>m.ai&&(m.r||0)>=1)&&(S.sosT??-99)<S.turn-12,run:()=>{S.sosT=S.turn;const m=pick(deptMembers(S.dept).filter(x=>x.ai&&(x.r||0)>=1));const corp=pick(ENTS.filter(e=>e[2]==='corp'&&e[4]))||[null,'대기업'];const qq=quota(),v=+(qq*R(6,10)/100).toFixed(2);const cr=x=>{npcAI(m).q=(npcAI(m).q||0)+x;};
   openModal('반기 마감 영업 SOS',`<p class="lede">${esc(m.name)} ${MR[Math.min(3,m.r||0)]}: "${esc(corp[1])} 협찬 건이 막판에 걸렸어요. ${S.rank>=3?'부장님이':'선배가'} 같이 가 주시면 됩니다."</p><p class="hint">부서 반기 광고 목표 ${Math.round(myQ()/qq*100)}% · 마감까지 ${QM-qMon()+1}달</p>`,[
    {label:'같이 간다',sub:`행동력 1 · 부서 실적 +${eok(v)} · 관계↑ · 신뢰 조금↓`,disabled:S.ap<1,fn:()=>{spend(1,4);cr(v);m.rel=clamp((m.rel||20)+4,-50,100);toast(apply({trust:-.3,eval:.4}));log(`${jo2(m.name,'과','와')} ${corp[1]} 협찬 동행 — 부서 실적 +${eok(v)}`);}},
    {label:'"알아서 마무리해"',sub:`부서 실적 +${eok(v*.5)} · 성사가 불확실하다`,fn:()=>{if(chance(.6)){cr(v*.5);toast(`${jo2(m.name,'이','가')} 혼자 성사시켰다 · 부서 실적 +${eok(v*.5)}`);}else toast(`${corp[1]}: "이번엔 어렵겠습니다."`);}},
    {label:'"기사랑 엮이는 건 안 된다"',sub:'신뢰↑ · 실적은 그대로',fn:()=>toast(apply({trust:.8}))}]);}},
 // 7.0 막힌 후배의 조언 요청: 같은 부서 AI 기자가 취재가 막혔다며 찾아온다
 {w:3,c:()=>!S.story&&!S.founder&&S.rank>=2&&S.co&&deptMembers(S.dept).concat((()=>{try{return (roster()[S.dept]||[]).filter(x=>(x.r||0)===0);}catch(e){return [];}})()).some(m=>(m.r||0)===0&&!(S.team||[]).includes(m)),run:()=>{let L=[];try{L=(roster()[S.dept]||[]).filter(x=>(x.r||0)===0&&!(S.team||[]).includes(x));}catch(e){}const m=pick(L);if(!m)return closeModal();const t=nrTitle(S.dept);
   openModal('막힌 후배',`<p class="lede">${esc(m.name)} 기자가 쭈뼛거리며 왔다. "「${esc(t)}」 취재가 막혔어요. 핵심 증언을 아무도 안 해 줘요."</p>`,[
    {label:'내 취재원을 연결해 준다',sub:'후배 실력↑ · 관계↑ · 부서 성과↑',fn:()=>{m.skill=clamp((m.skill||45)+1.5,0,95);m.rel=clamp((m.rel||20)+6,-50,100);S.flags.plan=(S.flags.plan||0)+1;if(m.ai)npcAI(m).e=Math.min(95,npcAI(m).e+2);toast(apply({eval:.3}));log(`${m.name} 기자에게 취재원 연결`);}},
    {label:'방향만 잡아 준다',sub:'후배 실력 조금↑',fn:()=>{m.skill=clamp((m.skill||45)+.6,0,95);toast(`${m.name}: "다시 해 보겠습니다."`);}},
    {label:'"그 아이템, 내가 받아 갈게"',sub:'아이템을 얻는다 · 후배 관계↓',fn:()=>{const it=makeItem(S.dept,{pre:1});it.title=t;it.from=m.name;S.items.push(it);m.rel=clamp((m.rel||20)-5,-50,100);toast(`「${t}」${jp(t,'을','를')} 넘겨받았다`);}}]);}},
 // 7.0 취재 지시 중간 보고: 맡긴 기자가 막혔다고 보고한다
 {w:5,c:()=>!S.story&&(S.handoffs||[]).some(h=>h.sub&&h.due>S.turn+1&&!h.mid),run:()=>{const h=pick(S.handoffs.filter(x=>x.sub&&x.due>S.turn+1&&!x.mid));h.mid=1;
   openModal('취재 중간 보고',`<p class="lede">${esc(h.who)} 기자: "「${esc(h.title)}」 핵심 사실 확인이 막혔습니다. 어떻게 할까요?"</p>`,[
    {label:'내 취재원을 붙여 준다',sub:'성공 가능성↑↑',fn:()=>{h.sk+=12;toast(`${h.who}: "연락 닿았습니다!"`);}},
    {label:'기한을 더 준다',sub:'성공 가능성↑ · 결과는 늦어진다',fn:()=>{h.sk+=7;h.due+=4;toast('한 달 더 주기로 했다');}},
    {label:'"있는 것만으로 써"',sub:'빨리 나온다 · 오보 위험',fn:()=>{h.due=S.turn+1;h.sk-=6;}}]);}},
 // 7.0 다른 부서 기자의 아이템 교환 제안
 {w:3,c:()=>!S.story&&!S.founder&&S.rank>=1&&S.rank<=5&&S.co&&nrPool(x=>x.d!==S.dept&&(x.skill||0)>=45).length>0&&S.items.length<6,run:()=>{const m=pick(nrPool(x=>x.d!==S.dept&&(x.skill||0)>=45));const it=makeItem(S.dept,{pre:1,excl:chance(.35)});it.from=m.name;
   openModal('옆 부서의 귀띔',`<p class="lede">${DEPTS[m.d].n} ${esc(m.name)} 기자: "이거 우리 쪽보다 그쪽 출입처 얘기 같아요." → 「${esc(it.title)}」</p>`,[
    {label:'고맙게 받는다',sub:'아이템을 얻는다 · 나중에 갚을 빚',fn:()=>{S.items.push(it);m.owe=(m.owe||0)-1;toast(`「${it.title}」 메모해 뒀다`);}},
    {label:'내 아이템 하나와 맞바꾼다',sub:'쥔 아이템 하나를 넘기고 받는다',disabled:!S.items.length,fn:()=>{const g=S.items.slice().sort((a,b)=>a.imp-b.imp)[0];S.items=S.items.filter(x=>x!==g);S.items.push(it);toast(`「${g.title}」 ↔ 「${it.title}」`);}},
    {label:'"우리 쪽은 바빠서요"',fn:()=>{}}]);}},
 // 다른 기자 기사로 소송 (간부)
 {w:2,c:()=>!S.story&&!S.founder&&S.rank>=4&&S.co&&nrPool().length>5,run:()=>{const m=pick(nrPool(x=>!(x.r>=2)));const t=nrTitle(m.d);const big=chance(.3);const amt=+((big?1.2:.4)*OUT().p/3).toFixed(1);
   openModal('편집국 기사 소송',`<p class="lede">${DEPTS[m.d].n} ${esc(m.name)} 기자의 「${esc(t)}」${jp(esc(t),'을','를')} 두고 ${jo2(big?'대기업':'당사자','이','가')} ${eok(amt)} 손해배상 소송을 걸었다.</p>`,[
    {label:'법무팀과 끝까지 다툰다',sub:`비용 들고 시간 걸림 · 이기면 신뢰↑${hasF('legal')?' · 사내 법무팀이 있다':''}`,fn:()=>{S.co.cash-=+(amt*.15).toFixed(2);if(chance(hasF('legal')?.7:.55)){toast(apply({trust:1.2,fame:.5}));log(`${m.name} 기자 기사 소송 승소`);}else{S.co.cash-=amt;toast(apply({trust:-1.5}));log(`${m.name} 기자 기사 소송 패소`);}}},
    {label:'합의한다',sub:`회사 자금 -${eok(amt*.5)} · 조용히 끝난다`,fn:()=>{S.co.cash-=+(amt*.5).toFixed(2);toast(apply({trust:-.3}));}},
    {label:'반론보도를 내 주고 끝낸다',sub:'돈은 안 든다 · 신뢰 조금↓ · 기자 사기↓',fn:()=>{S.wMood=clamp((S.wMood??60)-2,0,100);toast(apply({trust:-.8}));}}]);}},
 // 다른 기자의 기자상 (모든 직급)
 {w:2,c:()=>!S.story&&!S.founder&&S.rank>=1&&S.co&&nrPool(x=>(x.skill||0)>=60).length>0&&(S.nrAwT??-99)<S.turn-24,run:()=>{S.nrAwT=S.turn;const m=pick(nrPool(x=>(x.skill||0)>=60));const t=nrTitle(m.d);S.co.q=Math.min(100,S.co.q+.5);
   if(S.rank>=4){openModal('편집국의 기자상',`<p class="lede">${DEPTS[m.d].n} ${esc(m.name)} 기자가 「${esc(t)}」${jp(esc(t),'으로','로')} 이달의 기자상을 받았다. 회사 이름이 업계에 돌았다.</p>`,[{label:'편집국 전체에 포상한다',sub:'회사 자금 조금↓ · 사기↑',fn:()=>{S.co.cash-=.05;S.wMood=clamp((S.wMood??60)+4,0,100);toast(apply({fame:.6,eval:.5}));}},{label:'축하 메시지만 보낸다',fn:()=>toast(apply({fame:.3}))}]);}
   else{openModal('옆 부서의 기자상',`<p class="lede">${DEPTS[m.d].n} ${esc(m.name)} 선배가 「${esc(t)}」${jp(esc(t),'으로','로')} 이달의 기자상을 받았다. 편집국에서 박수가 터졌다.</p>`,[{label:'찾아가 취재 노하우를 묻는다',sub:'능력치 조금↑ · 사내 인맥↑',fn:()=>{gain(pick(['inv','ver','wri']),.5);toast(apply({net:.3}));}},{label:'축하하고 내 일에 집중한다',sub:'멘탈↑',fn:()=>gain('men',.3)},{label:'"나도 언젠간" 하고 아이템을 다시 판다',sub:'컨디션↓ · 단독 아이템',fn:()=>{S.hp=clamp(S.hp-8,0,100);const it=makeItem(S.dept,{excl:true});S.items.push(it);toast(`「${it.title}」 다시 파 보기로 했다`);}}]);}}},
 // 영업과 기사 사이 (간부)
 {w:2,c:()=>!S.story&&!S.founder&&S.rank>=4&&salesPush()>=1&&nrPool(x=>(x.r||0)>=1).length>0,run:()=>{const m=pick(nrPool(x=>(x.r||0)>=1));const corp=pick(ENTS.filter(e=>e[2]==='corp'&&e[4]));if(!corp)return closeModal();
   openModal('영업과 기사 사이',`<p class="lede">${DEPTS[m.d].n} ${esc(m.name)} ${jo2(MR[m.r||0],'이','가')} 이번 반기 영업 1등이다. 그런데 ${esc(corp[1])} 광고를 따 오면서 "신제품 기사 하나 크게 써 주기로" 약속했다고 한다.</p>`,[
    {label:'약속은 지켜 준다',sub:'광고↑ · 신뢰↓ · 포털 벌점 위험',fn:()=>{S.co.adB+=.03;netUp(corp[0],6);toast(apply({trust:-1.2}));if(chance(.3))portalPen(1,'광고성 기사');}},
    {label:'광고는 받고 기사는 편집국이 판단한다',sub:'광고주 관계↓ · 편집권 지킴',rec:true,fn:()=>{netUp(corp[0],-4);toast(apply({trust:.6}));}},
    {label:'기자 영업 방침을 다시 정한다',sub:'광고 단가와 수주 메뉴의 영업 방침',fn:()=>{salesPolicy();return false;}}]);}},
 // 에이스의 이직 통보 (국장 이상)
 {w:2,c:()=>!S.story&&!S.founder&&S.rank>=5&&(S.comp||[]).length&&nrPool(x=>(x.skill||0)>=65&&!(x.r>=2)).length>0,run:()=>{const m=nrPool(x=>(x.skill||0)>=65&&!(x.r>=2)).sort((a,b)=>b.skill-a.skill)[0];const cp=pick(S.comp);
   openModal('에이스의 이직 통보',`<p class="lede">${DEPTS[m.d].n} 에이스 ${esc(m.name)} 기자(실력 ${Math.round(m.skill)})가 ${esc(cName(cp))}에서 연봉 30% 인상 제안을 받았다고 털어놨다.</p>`,[
    {label:'처우를 맞춰 붙잡는다',sub:'회사 자금 조금↓ · 사기↑',fn:()=>{S.co.cash-=.06*(OUT().p/3);S.wMood=clamp((S.wMood??60)+2,0,100);m.skill=Math.min(85,m.skill+1);toast(`${m.name} 기자가 남기로 했다`);}},
    {label:'원하는 부서로 보내 주고 붙잡는다',sub:'돈은 안 든다 · 그 부서가 강해진다',fn:()=>{const per=roster();const keys=Object.keys(per).filter(d=>DEPTS[d]&&!/^x_/.test(d)&&!isRegD(d)&&d!==m.d);const to=pick(keys);if(to){per[m.d]=per[m.d].filter(x=>x!==m);m.d=to;per[to].push(m);}toast(`${m.name} 기자를 ${jo2(DEPTS[m.d].n,'으로','로')} 보냈다`);}},
    {label:'보내 준다',sub:'보도 품질 조금↓ · 경쟁사가 강해진다',fn:()=>{const per=roster();per[m.d]=per[m.d].filter(x=>x!==m);const n=genMember(m.d,30,48);n.yrs=R(1,3);n.t0=S.turn;per[m.d].push(n);S.co.q=Math.max(10,S.co.q-1);cp.q=Math.min(90,(cp.q||50)+1.5);log(`${m.name} 기자 → ${cName(cp)}`);tick(`${cName(cp)}, ${OUT().n} ${m.name} 기자 영입`);}}]);}},
 // 부서 이동 요청 (국장 이상)
 {w:1,c:()=>!S.story&&!S.founder&&S.rank>=5&&nrPool(x=>!(x.r>=2)).length>3,run:()=>{const m=pick(nrPool(x=>!(x.r>=2)&&!isRegD(x.d)));if(!m)return closeModal();const per=roster();const keys=Object.keys(per).filter(d=>DEPTS[d]&&!/^x_/.test(d)&&!isRegD(d)&&d!==m.d);const to=pick(keys);if(!to)return closeModal();
   openModal('부서 이동 요청',`<p class="lede">${DEPTS[m.d].n} ${esc(m.name)} 기자가 면담을 청했다. "${DEPTS[to].n}에서 일해 보고 싶습니다. ${pick(['지금 출입처에서 더 배울 게 없습니다.','부장과 도저히 안 맞습니다.','오래 준비한 분야입니다.'])}"</p>`,[
    {label:'보내 준다',sub:'사기↑ · 원래 부서 공백',fn:()=>{per[m.d]=per[m.d].filter(x=>x!==m);m.d=to;per[to].push(m);S.wMood=clamp((S.wMood??60)+1.5,0,100);m.skill=Math.min(85,(m.skill||50)+.5);toast(`${m.name} 기자를 ${jo2(DEPTS[to].n,'으로','로')} 보냈다`);}},
    {label:'다음 정기 인사까지 기다리라고 한다',sub:'사기 조금↓',fn:()=>{S.wMood=clamp((S.wMood??60)-1,0,100);}}]);}},
 // 영업 동행 요청 (평기자~차장)
 {w:2,c:()=>!S.story&&!S.founder&&S.rank>=1&&S.rank<=2&&salesPush()>=1&&nrPool(x=>(x.r||0)>=1&&x.d===S.dept).length>0,run:()=>{const m=pick(nrPool(x=>(x.r||0)>=1&&x.d===S.dept));const corp=pick(ENTS.filter(e=>e[2]==='corp'&&e[4]));if(!corp)return closeModal();
   openModal('영업 동행',`<p class="lede">${esc(m.name)} ${MR[m.r||0]}: "오늘 ${esc(corp[1])} 홍보실 미팅 같이 가자. 네 출입처잖아. 반기 광고 실적이 모자라서 그래."</p>`,[
    {label:'따라간다',sub:'사내 평가↑ · 광고주 관계↑ · 신뢰 조금↓',fn:()=>{netUp(corp[0],4);S.adQ=+((S.adQ||0)+OUT().ad*.004).toFixed(3);toast(apply({eval:.8,trust:-.5,hp:-4}));}},
    {label:'"취재 일정이 있어서요" 하고 빠진다',sub:'선배와 사이 조금↓',fn:()=>{toast(apply({eval:-.3,trust:.2}));}}]);}}];
// ===== 취재원이 먼저 전화한다: 신뢰를 쌓은 취재원은 가끔 알아서 아이템을 물어다 준다. 오래 연락이 없으면 관계가 조금씩 식는다 =====
function srcMonth(){if(S.story||!S.sources||!S.sources.length||S.phase!=='game')return;
  S.sources.forEach(s=>{if((S.turn-(s.last??-99))>24&&s.trust>15)s.trust=Math.max(15,s.trust-.8);});
  if(S.rank>=4&&!S.founder)return;const hot=S.sources.filter(s=>s.trust>=48&&(S.turn-(s.callT??-99))>=16);if(!hot.length)return;
  const s=hot.sort((a,b)=>b.trust-a.trust)[Math.floor(Math.random()*Math.min(3,hot.length))];const p=Math.min(.3,.09+(s.trust-48)/200+Math.min(.08,(hot.length-1)*.03))*(S.rank===0?.7:1);if(!chance(p))return;s.callT=S.turn;
  const mc=catOf(S.dept);const dd=mc.includes(s.d)?s.d:S.dept;const it=makeItem(dd,{excl:true,mult:1.12,keyConf:s.trust>=70,hoax:s.pers==='talk'&&chance(.2),src:s.name});
  Q.push(()=>openModal('취재원의 전화',`<p class="lede">${esc(s.name)} ${esc(s.role)}에게서 먼저 전화가 왔다. "${pick(['기자님, 이건 기자님한테만 드리는 거예요.','시간 되시면 잠깐 볼까요? 전화로는 좀 그래서.','아직 아무도 몰라요. 늦으면 다른 데서 냄새 맡을 거예요.'])}"</p><p class="hint">${PERS[s.pers]?PERS[s.pers].n:''} · 신뢰 ${Math.round(s.trust)} · 「${esc(it.title)}」</p>`,[
    {label:'바로 만난다',sub:'행동력 1 · 단독 아이템 · 핵심 사실을 한 번 더 확인 · 신뢰↑',rec:true,disabled:S.ap<1,fn:()=>{spend(1,3);const k=it.facts.find(f=>f.key);if(k&&!fOK(k)){k.conf++;k.via.push('취재원 대면');}S.items.push(it);s.trust=clamp(s.trust+3,0,100);s.last=S.turn;log(`취재원 ${jo2(s.name,'이','가')} 먼저 「${it.title}」${jp(it.title,'을','를')} 물어 왔다`);toast(`「${it.title}」 아이템을 받았다`);}},
    {label:'전화로만 듣는다',sub:'행동력 없이 아이템만 · 신뢰 그대로',fn:()=>{S.items.push(it);s.last=S.turn;log(`취재원 ${s.name} 전화 제보 「${it.title}」`);toast(`「${it.title}」 메모해 뒀다`);}},
    {label:'"지금은 바빠서요"',sub:'아이템을 놓친다 · 신뢰 조금↓',cls:'ghost',fn:()=>{s.trust=Math.max(0,s.trust-3);}}]));}
function salesMonth(lines,fin){if(!S.co||S.story)return;const o=OUT();const sl=npcSales(o,1);const p=salesPush();try{salesMonth0(lines,fin,o,sl,p);}finally{salesQClose(lines);}}
function salesQClose(lines){/* 6.8: 분기 마감은 quarterClose에서 (부서 AI 실적까지 다 들어온 뒤) */}
function salesMonth0(lines,fin,o,sl,p){
  // 내 부서원(차장 이상)의 실적은 내 분기 광고 목표에도 들어간다
  // 내 부서원도 자기 할당 페이스를 보고 더 뛰거나 덜 뛴다 (부장이 독려하면 더)
  const qk=qMon();sl.mine.forEach(x=>{const m=x[0],g=npcQuota(m,m.d||S.dept);let e=.7+Math.random()*.6;if(g>0){const pace=qk>1?(m.qS||0)/(g*(qk-1)/QM):(m.qr??1);e*=pace<.7?1.25:pace<.95?1.12:pace>1.35?.9:1;if(qk>=QM-1&&(m.qS||0)<g*(qk-1)/QM*.9)e+=.1;if(S.deptPush!=null&&S.turn-S.deptPush<4)e+=.12;}x[1]=(g>0?g/QM:x[1]*SL_G)*e;m.qS=(m.qS||0)+x[1];});
  if(S.rank>=2&&S.rank<=6&&sl.mine.length){const v=sl.mine.reduce((a,x)=>a+x[1],0)*.5;if(!deptShared()){S.adQ=+((S.adQ||0)+v).toFixed(3);S.adQT=+((S.adQT||0)+v).toFixed(3);}const top=sl.mine.slice().sort((a,b)=>b[1]-a[1])[0];if(lines&&month()%3===0)lines.push({c:'',t:`부서 영업: 차장 이상 ${sl.mine.length}명이 출입처 광고·협찬 ${eok(v*2)}을 따 왔다 (이번 반기 최다 ${top[0].name})`});}
  if(fin&&lines&&month()%3===0&&(S.rank>=4||S.founder))lines.push({c:'',t:`기자 영업 실적: 차장 이상 ${sl.n}명 · 월 ${eok(sl.tot)} (${SALES_P[p]||'보통'})`});
  // 영업 압박이 세면 신뢰·사기·보도 품질이 깎이고, 영업을 광고국에 맡기면 반대
  let hs=0,hp=0;try{Object.entries(roster()).forEach(([d,L])=>{const h=L.find(m=>(m.r||0)>=2);if(!h)return;const q=npcPref(h,d);if(q==='sales')hs++;if(q==='fact'||q==='inv')hp++;});}catch(e){}const hk=(hs+hp)?(hp-hs)/(hs+hp):0;
  if(p>1){S.trust=clamp(S.trust-.12,0,100);S.wMood=clamp((S.wMood??60)-.8-.4*hk,0,100);S.co.q=Math.max(10,S.co.q-.08);if(chance(.12)&&lines)lines.push({c:'r',t:pick(['"단독보다 매출부터 챙기라"는 말이 편집국에 돈다.','출입처 기업 홍보실에서 "기자님이 광고 얘기를 너무 자주 하신다"는 볼멘소리가 들려왔다.','젊은 기자 하나가 "포럼 협찬 섭외하다 기사 쓸 시간이 없다"며 사표를 고민한다.'])});}
  else if(p<1){S.trust=clamp(S.trust+.04,0,100);S.wMood=clamp((S.wMood??60)+.3,0,100);}}
// 6.8 회사 돈의 계절: 광고는 연초·한여름에 비고 봄·가을·연말에 몰린다. 연말엔 성과급, 연초엔 연봉 조정이 나간다. 가끔 뜻밖의 수입·지출도 생긴다 (한 해 평균은 그대로)
const AD_SEAS=[.86,.84,.98,1.06,1.08,1,.94,.9,1.02,1.08,1.1,1.14],COST_SEAS=[1.05,.977,.977,.977,.977,.977,.977,.977,.977,.977,.977,1.3];
const CO_ONE=[['저작권료 정산이 한꺼번에 들어왔다',1],['정부 공익광고가 한 달에 몰려 집행됐다',1],['지난 행사 협찬금 미수금이 들어왔다',1],['보도 사진·영상 판매가 대박이 났다',1],['사옥 공조 설비가 고장 나 교체했다',-1],['패소한 손해배상금을 물었다',-1],['전산 시스템 장애로 긴급 복구비가 나갔다',-1],['인쇄·송출 장비 수리비가 나갔다',-1]];
function coMonth(){
  const c=S.co,o=OUT();const decay={daily:.004,econ:.003,sports:.006,local:.005,eng:.003,weekly:.005,tv:.002,jp:.001,ch:.001,wire:0,online:-.002}[o.type]||0;
  c.q=clamp(c.q,10,100);
  let gs=(c.q-55)/3000+c.bS+(S.founder&&c.subs<o.subs*1.5?.012*(S.trust/60)*(1+S.fame/100):0);const capS=S.founder?2.5:2,capT=S.founder?3:2;const cb=coCapB();if(gs>0)gs*=Math.max(0,1-c.subs/(cb.s*capS));let gt=(c.q-50)/2000+c.bT+eraTrG()+(S.flags.bait||0)*.004+(S.founder&&c.tr<o.tr*2?.02*(1+S.fame/100):0);if(gt>0)gt*=Math.max(0,1-c.tr/(cb.t*capT));c.subs=Math.max(o.subs*.2,c.subs*(1+gs-decay));c.tr=Math.max(o.tr*.2,c.tr*(1+gt));
  c.bS*=.5;c.bT*=.6;c.adB*=.85;S.flags.bait=0;if(S.adRate&&S.adRate>1)S.adRate=+(1+(S.adRate-1)*.985).toFixed(3);
  const infl=Math.pow(1.02,Math.floor(S.turn/YW));
  const na=netAdAdj();const adF=(.6+.25*c.subs/o.subs+.15*c.tr/o.tr)*(1+c.adB)*shareMult()*infl*(S.erp?1.04:1)*([.88,1,1.05,1.1][S.portal?S.portal.lv:1]||1)*(S.adRate||1)*adDemand()*(S.founder?fNPAdK():1);const am=adMonth(o,adF);const mo=month()-1,seaA=AD_SEAS[mo]*(.95+Math.random()*.1);const ad=Math.max(o.ad*.2,(am.base+am.pay)*seaA*eraAd());{const a0=(am.base+am.pay)*(S.founder?1:(c.rk||1));c.adEma=c.adEma?c.adEma*.9+a0*.1:a0;if(!c.adEma0)c.adEma0=c.adEma;}
  if(hasF('app'))c.bT+=.004;if(hasF('paywall'))c.bS+=.004;if(hasF('reader'))c.bS+=.002;
  const cp=S.portal&&S.portal.lv===3?c.tr*.004*(S.cpBoost||1):0;const fac=facUpkeep();const bz=bizMonth();bz.rev*=eraBiz();
  let subsRev=c.subs*o.rate*(hasF('paywall')?1.25:1)*infl,trRev=c.tr*.01*portalMult()*infl*eraTr();
  const sup=S.founder?0:ownSupM(infl);if(!S.founder){if(c.rk==null||c.rkV!==3){const r0=subsRev+trRev+o.ad*adF+cp,c0=c.staff*.09*(S.payLv||1)*infl+fac;const sp0=ownSup0(infl);const tg=clamp(r0+sp0,c0*1.06,c0*1.18);c.rk=r0>0?+clamp((tg-sp0)/r0,.3,1.8).toFixed(3):1;c.rkV=3;}subsRev*=c.rk;trRev*=c.rk;}const adK=S.founder?1:(c.rk||1);const _trk=fTrK(trRev+cp);trRev*=_trk;const fsup=S.founder?fSupport():0;const sl=npcSales(o,infl);const rev0=sup+subsRev+trRev+fAdSoft(ad)*adK+cp*adK*_trk+bz.rev*(.9+.2*AD_SEAS[mo]-.1)+fsup+sl.tot*seaA+(S.founder?.04*o.p+.03:0);let one=null;if(chance(.14)){const x=pick(CO_ONE);one={t:x[0],v:+(x[1]*rev0*(.04+Math.random()*.1)).toFixed(2)};}const rev=rev0+(one&&one.v>0?one.v:0),_pers=(c.staff*(S.founder?.066:.09)*(S.payLv||1))*infl,_ext=c.extra,_facn=fac-(hasF('press')?.3*facSize():0),cost=bz.cost+_pers+_ext+_facn;c.extra=0;
  let costX=COST_SEAS[mo]*(S.founder?fEarlyCost():1)*cost*(S.costCut&&S.costCut.due>S.turn?1-S.costCut.r:1)*(S.payRaise?Math.pow(1+S.payRaise,(S.turn-(S.payRaiseT||S.turn))/YW):1)*(S.founder?1-(fs('biz')-40)/800:1);const _m=cost?costX/cost:1;const _fee=S.founder?rev*({2:.08,3:.22,4:.32,5:.38}[o.p]||.3):0;costX+=_fee;
  // 기자 영업에도 돈이 든다: 접대·협찬 행사·영업 수당 (영업 매출의 절반 남짓)
  const slCost=sl.tot*seaA*.55+(one&&one.v<0?-one.v:0);
  const _tax=coTax(rev-costX-slCost);c.cash+=rev-costX-slCost-_tax;if(!S.founder&&rev>0&&c.cash>rev*15){const out=+((c.cash-rev*15)*.04).toFixed(2);c.cash-=out;c.divY=(c.divY||0)+out;}c.last={sup,rev,cost:costX+slCost,tax:_tax,profit:rev-costX-slCost-_tax,rp:{ad:fAdSoft(ad)*adK,subs:subsRev,tr:trRev,cp:cp*adK*_trk,biz:bz.rev*(.9+.2*AD_SEAS[mo]-.1),sales:sl.tot*seaA,fsup,sup,base:(S.founder?.04*o.p+.03:0),one:one&&one.v>0?one.v:0},cb:{pers:_pers*_m,fee:_fee,fac:_facn*_m,biz:bz.cost*_m,sales:sl.tot*seaA*.55,extra:_ext*_m+(one&&one.v<0?-one.v:0)},salesRev:sl.tot,salesN:sl.n,ad:fAdSoft(ad)*adK,adBase:am.base,adPay:am.pay,adList:am.list,cp,netLoss:na.loss,netGain:na.gain,subsRev,trRev,bizRev:bz.rev,biz:bz.list,fsup,one,seaA:+seaA.toFixed(2),mo:mo+1};if(one&&(S.rank>=4||S.founder))log(`회사 ${one.v>0?'뜻밖의 수입':'뜻밖의 지출'}: ${one.t} (${one.v>0?'+':''}${eok(one.v)})`);c.hist.push(Math.round(c.cash*10)/10);if(c.hist.length>48)c.hist.shift();
  return c.last;
}
const Q2=[];
function endWeek(){
  if(!$('#modal').hidden)return;Q2.length=0;Q.length=0;
  const o=OUT(),D=DF(),lines=[];const t=S.turn;
  S.hp=clamp(S.hp+hpWeek(),0,100);
  // 아이템 수명·라이벌
  const lost=[],keep=[];
  const cth=compThreat()*(S.outlet?otr('heat'):1);S.items.forEach(i=>{if((i.burnM||0)>0)i.burnM--;else if(!(i.track&&S.turn%3===0))i.heat--;if(S.turn%4===3){i.burnM=0;}if(i.excl&&S.rival&&chance(rvPress()))i.heat--;if(i.excl&&S.rank>=1&&chance(cth))i.heat--;});
  let stale=0;S.items.forEach(i=>{if(i.excl&&i.heat<=0&&(i._m0||1)>=2)i.heat=1;if(i.excl&&i.heat<=0)lost.push(i);else if(!i.excl&&!i.slot&&!i.story&&i.heat<=-1){stale++;}else keep.push(i);});S.items=keep;if(stale)lines.push({c:'',t:`철 지난 공통 아이템 ${stale}건은 다른 매체들이 다 써 버려 접었다.`});
  if(S.items.length>6){const drop=S.items.filter(i=>!i.slot&&!i.story).sort((a,b)=>(a.excl-b.excl)||(a.imp-b.imp)).slice(0,S.items.length-6);if(drop.length){S.items=S.items.filter(i=>!drop.includes(i));lines.push({c:'',t:`손이 모자라 묵은 아이템 ${drop.length}건을 접었다 (최대 6건까지 쥘 수 있다).`});}}
  S.lostN=(S.lostN||0)+lost.filter(i=>i.facts.some(f=>f.conf>0&&f.via.some(v=>v!=='보도자료'))).length;
  lost.forEach(i=>{if(i.from){const g=(S.cols||[]).find(c=>c.name===i.from)||(S.mates||[]).find(m=>m.name===i.from);if(g&&g.rel!=null)g.rel=clamp(g.rel-6,-50,100);log(`${i.from}: "내가 준 거 묵히다 뺏겼네"`);}if(S.rank>3)return;if(S.rank===0)apply({eval:-.8,fame:-.2});else apply({eval:-2.5,fame:-.8});if(i.facts.some(fOK))Q2.push(i);const _rx=(typeof rvOther==='function')?rvOther():S.rival;const rv=_rx?`${_rx.name} 기자(${OUTLETS.find(x=>x.id===_rx.outlet).n})`:'타사';const _eul=jo2(i.title,'을','를').slice(i.title.length);if(_rx&&i.facts.some(f=>f.conf>0))_rx.wins++;log(`낙종: ${jo2(rv,'이','가')} 「${i.title}」${_eul} 먼저 보도`);tick(`[${_rx?OUTLETS.find(x=>x.id===_rx.outlet).n:'타사'}] [단독] ${i.title}`);lines.push({c:'r',t:`물먹었다 — ${jo2(rv,'이','가')} 「${i.title}」${_eul} 먼저 썼다`});});
  if(lost.length)lines.push({c:'',t:'다음엔: 단독은 "타사 추격까지"가 한 달 남으면 확인이 덜 됐어도 먼저 쓰자. 할 일의 경고 상자가 미리 알려 준다.'});
  S.items.forEach(i=>{if(i.slot&&i.slot.due<=t&&S.rank<=3){lines.push({c:'r',t:`「${i.title}」 ${SLOT[i.slot.g].n} 마감을 넘겼다. ${bossT()}: "지면 비웠잖아!"`});apply({eval:-2.5});i.slot=null;}});
  // 정보공개청구·오보·뇌물
  const due=S.pending.filter(p=>p.due<=t);S.pending=S.pending.filter(p=>p.due>t);
  const scandals=[];
  due.forEach(p=>{
    if(p.type==='foi'){const it=S.items.find(i=>i.id===p.item);if(!it)return;const f=it.facts.find(x=>x.k==='d'&&!fOK(x))||it.facts.find(x=>!fOK(x));
      if(f&&chance(.62*D.ver)){f.conf++;f.via.push('정보공개');lines.push({c:'g',t:`정보공개청구 결과 공개: 「${it.title}」 — ${f.t}`});ach('foi');}
      else lines.push({c:'r',t:`정보공개청구 비공개 결정: 「${it.title}」 "업무상 비밀"`});}
    else scandals.push(p);
  });
  // 평가 흐름
  if(S.founder&&S.rank===7)S.eval+=(50-S.eval)*.05;
  if(S.rank<7){S.eval+=(48-S.eval)*(S.simple?.035:.02);apply({eval:-.06*D.drift});}
  if(S.rank>=1&&S.rank<=3&&(S._bw==null||S._bw===3)){S.dry=S.weekArticles?0:S.dry+1;if(S.dry>=(S._bw==null?3:2)){apply({eval:-1*D.drift*(S._bw==null?1:2)});if(S.dry===(S._bw==null?3:2))lines.push({c:'r',t:S._bw==null?`3주째 기사가 없다. ${jo2(bossT(),'이','가')} 자리로 불렀다.`:`두 달째 기사가 없다. ${jo2(bossT(),'이','가')} 자리로 불렀다.`});}}
  S.fame=Math.max(0,S.fame*(1-(S.simple?.014:.008)));
  if(S.rival)S.rival.skill=Math.min(88,S.rival.skill+.04);
  if(S.flags.ban)S.flags.ban--;
  netWeek(lines);lifeWeek();
  // 보강 지시 결과
  S.items.forEach(it=>{if(it.track){const f=it.facts.find(x=>!fOK(x)&&!x.via.includes('장기 추적'))||it.facts.find(x=>!fOK(x));if(!f)it.track=0;else if(chance(.45*DF().ver)){f.conf++;if(!f.via.includes('장기 추적'))f.via.push('장기 추적');const ok=fOK(f),rest=it.facts.filter(x=>!fOK(x)).length;lines.push({c:'g',t:`장기 추적 「${it.title}」 — ${f.t} ${ok?'확인':`정황 확보 (${f.conf}/${f.need})`}${ok&&!rest?' · 사실 확인 끝, 추적 종료':''}`});if(!rest)it.track=0;}}});
  if(S.reinforce&&S.reinforce.length){const due2=S.reinforce.filter(x=>x.due<=t);S.reinforce=S.reinforce.filter(x=>x.due>t);due2.forEach(x=>{if(x.excl&&chance(.25)){lines.push({c:'r',t:`보강하던 「${x.title}」${jp(x.title,'을','를')} 타사가 먼저 썼다.`});apply({eval:-1});}else{lines.push({c:'g',t:`${x.m} 팀이 보강한 「${x.title}」 — 탄탄해져서 출고됐다.`});apply({fame:x.imp*x.vr/90,eval:.8});S.co.q+=1;}});}
  // 속보 만료·발생
  if(S.breaking&&S.breaking.due<=t){lines.push({c:'r',t:`${S.breaking.title} — 지휘가 늦었다. 타사 속보에 밀렸다.`});apply({eval:-1.5});S.breaking=null;}
  if(S.rank>=4&&S.rank<=6&&!S.breaking&&chance(.13))newBreaking();
  // 동료 관계 → 월 평가
  if(t%4===3&&S.rank>=1&&S.rank<=3){const bs=colBy('boss');if(bs)apply({eval:(bs.rel-25)/60});const jr=colBy('junior');if(jr&&jr.rel>=40)S.flags.plan=(S.flags.plan||0)+2;}
  // 광고 목표 (분기)
  if(S._bw==null||S._bw===3)S.weekArticles=0;
  // 월말
  const CQ=[];crisisWeek(lines,CQ);
  const monthEnd=t%4===3;let fin=null,perf=null,fin_pay=null;
  if(monthEnd)crisisMonth(CQ);
  if(monthEnd){
    const pay=Math.round(payOf(o)*(S.payCut>S.turn?.9:1)*(S.fNoPay>S.turn?0:1)),live=Math.max(40,living()-(S.lease||S.house?45:0));lifeMonth(lines);try{selfMonth(lines);}catch(e){}S.money+=pay-live;fin_pay={pay,live,bonus:0};
    if(S.mis&&S.mis.all)(S.misAllY=S.misAllY||[]).push(t);if(S.deskM&&S.rank>=2)S.deskY=(S.deskY||0)+(S.deskM.n>=3?1:0);
    try{const al=monthAllow(pay);if(al){fin_pay.allow=al;if(al.sum){S.money+=al.sum;}if(al.lost)lines.push({c:'r',t:al.lost});}}catch(e){console.error(e);}
    if(month(t)===12&&S.rank<7){if(perfOn()){const A=yearAppraise(pay);if(A){fin_pay.appr=A;if(A.bonus){S.money+=A.bonus;fin_pay.bonus=A.bonus;}lines.push({c:A.g==='S'||A.g==='A'?'g':A.g==='D'?'r':'',t:`연말 인사고과 ${A.g}등급 — ${APPR_LINE[A.g]}${A.bonus?` 성과급 ${A.bonus}만 원${A.loss?'(회사 적자로 절반)':''}`:''}${A.step?` · 내년 호봉 +${Math.round(A.step*100)}%`:''}`});if(A.g==='D')apply({eval:-1});}}
      else{const b=S.co.last&&S.co.last.profit<0?0:Math.round(pay*clamp((S.eval-50)/40,0,1.5)/10)*10;if(b){S.money+=b;fin_pay.bonus=b;}}}
    if(S.rank>=2&&S.team.length){perf=avg(S.team.map(m=>m.skill+R(-8,8)))+(S.flags.plan||0);S.team.forEach(m=>m.skill=clamp(m.skill+.3+(S.flags.desked?.3:0),0,95));S.flags.desked=0;if(S.flags.plan)S.flags.plan=Math.max(0,S.flags.plan-3);
      if(S.rank<7)apply({eval:(perf-56)/12});}
    const vals=[];if(S.monthQ.length)vals.push(avg(S.monthQ));if(perf!==null)vals.push(perf);
    S.co.q=S.co.q*.75+(vals.length?avg(vals):50+R(-5,5))*.25;S._mqA=S.monthQ.slice();S.monthQ=[];
    try{entFinMonth(lines);}catch(e){console.error(e);}try{srcMonth();}catch(e){console.error(e);}fin=coMonth();try{salesMonth(lines,fin);}catch(e){console.error(e);}try{newsroomMonth(lines);}catch(e){console.error(e);}try{chiefSales(lines);}catch(e){console.error(e);}try{opTick(lines);}catch(e){}try{eraEnsure();figEnsure();eraMonth(lines);afterMonth(lines);figMonth(lines);figCoverMonth(lines);coRaceMonth(lines);}catch(e){console.error(e);}try{ftMonth(lines);spmMonth(lines);valMonth(lines);}catch(e){console.error(e);}try{pressMonth(lines);orderMonthEnd();}catch(e){console.error(e);}if(!S.story){try{worldMonth(lines);}catch(e){console.error(e);}try{traitMonth(lines);}catch(e){console.error(e);}try{caseMonth(lines);}catch(e){console.error(e);}try{routeMonth(lines);}catch(e){console.error(e);}try{debtMonth(lines);}catch(e){console.error(e);}try{rivalAI(lines);}catch(e){console.error(e);}try{spec2Month(lines);}catch(e){console.error(e);}try{oidMonth(lines);oidMonth2(lines);oidRivals(lines);}catch(e){console.error(e);}try{trMonth(lines);oidShift(lines);}catch(e){console.error(e);}try{deptLure(lines);}catch(e){console.error(e);}try{posMonth(lines);}catch(e){console.error(e);}try{scoutMonth(lines);}catch(e){console.error(e);}try{aiMonth(lines);}catch(e){console.error(e);}try{ownMonth(lines);}catch(e){console.error(e);}try{eraMonthX(lines);rivalYear(lines);}catch(e){console.error(e);}try{v16Month(lines);}catch(e){console.error(e);}try{rivalRoute(lines);}catch(e){console.error(e);}try{rAffMonth();pathBossAI(lines);pathPeerAI(lines);}catch(e){console.error(e);}try{if(!S.ft&&ftCan()&&chance(.4))Q.unshift(ftOffer);}catch(e){console.error(e);}try{v12AchMonth(lines);}catch(e){console.error(e);}}try{quarterClose(lines);}catch(e){console.error(e);}compMonth(lines);try{if(S.founder){fNewsroom(lines);fNPMonth(lines);}}catch(e){console.error(e);}try{slTick();}catch(e){console.error(e);}try{mediaYear(lines);}catch(e){console.error(e);}try{standMonth(lines);standYear(lines);}catch(e){console.error(e);}try{rankMonth(lines);}catch(e){console.error(e);}try{deptSigMonth(lines);styleMonth(lines);metaMonth();legendTick(lines);crisisTick(lines);mediaMonth(lines);}catch(e){console.error(e);}if(S.portal&&S.portal.demote>0)S.portal.demote=Math.max(0,S.portal.demote-4);S.profitStreak=fin.profit>0?(S.profitStreak||0)+1:0;
    if(t%24===23)portalReview(lines);
    if(S.founder){founderStatMonth(lines);founderMonth(lines,fin);try{fAdMonth(lines);}catch(e){console.error(e);}fMixMonth(lines);founderOtrMonth(lines);}gadMonth(lines);try{wageMonth(lines);npcLife(lines);rkMonth(lines);traineeMonth(lines);alumniMonth(lines);staffBalance(lines);owePay(lines);}catch(e){console.error(e);}corrMonth(lines);
    if(S.rank>=6)S.trust=clamp(S.trust+(S.co.q-55)/25+(55-S.trust)*.03,0,100);
    if(S.rank===7)apply({eval:fin.profit>0?1.5:-2.5});
    if(S.rank>=4&&S.rank<7){if(perf!==null)apply({fame:(perf-55)/25});apply({eval:(S.co.q-52)/8+(fin.profit>0?.8:-.4)});}
  }
  try{atkWeek();}catch(e){console.error(e);}
  S.turn++;S.inRank++;S.atOutlet++;
  if(S.turn%YW===0&&S.errors===0&&S.turn>=YW*3)ach('clean');
  if(S.turn%YW===0&&S.turn>0){['inv','ver','int','wri','hed','spd','net','kno'].forEach(k=>gain(k,.6));if(S.rival)S.rival.skill=Math.min(90,S.rival.skill+1);lines.push({c:'g',t:`${years()}년 차가 됐다. 연차만큼 감이 늘었다 (주요 능력치 +0.6). 물가가 올라 생활비도 늘었다.`});}
  S.ap=apBase();S.scene=baseScene();if(OUT().p<=2)S.hp=clamp(S.hp-3,0,100);
  worldTick();
  const _hq=Q.splice(0);CQ.forEach(f=>Q.push(f));(window.__wq||[]).forEach(f=>Q.push(f));window.__wq=[];_hq.slice(0,3).forEach(f=>Q.push(f));
  if(S._bw!=null&&!monthEnd){S._ml.push(...lines);lines.length=0;}else if(S._bw!=null){lines.unshift(...S._ml);S._ml=[];}
  if(monthEnd){const mt=month(t);const gl=monthGlance();
    if(S.monthSumOff){toast(`${mt}월 결산 — ${gl.txt}`);lines.forEach(l=>{try{if(l&&l.t)log(`${mt}월 결산: ${l.t}`);}catch(e){}});}
    else Q.push(()=>openModal(`${mt}월 결산`,gl.html+`${misSum()}${lines.length?`<ul class="feed">${lines.map(l=>`<li class="${l.c}">${esc(l.t)}</li>`).join('')}</ul>`:''}<div class="kv"><div><span>월급(실수령)</span><b>${fin_pay.pay}만</b></div><div><span>생활비·월세</span><b>-${fin_pay.live}만</b></div>${fin_pay.allow&&fin_pay.allow.sum?`<div><span>수당 (${fin_pay.allow.L.filter(x=>x[1]>0).map(x=>x[0].replace(' 수당','')).join('·')})</span><b>+${fin_pay.allow.sum}만</b></div>`:''}${fin_pay.appr?`<div><span>인사고과</span><b>${fin_pay.appr.g}등급</b></div>`:''}${fin_pay.bonus?`<div><span>연말 성과급</span><b>+${fin_pay.bonus}만</b></div>`:''}<div><span>${TYPES[o.type].sub}</span><b>${f1(S.co.subs)}${TYPES[o.type].unit}</b></div><div><span>회사 월 손익</span><b style="color:${fin.profit>=0?'var(--good)':'var(--red)'}">${fin.profit>=0?'+':''}${eok(fin.profit)}</b></div>${perf!==null?`<div><span>${S.rank>=4?'편집국':'부서'} 성과</span><b>${Math.round(perf)}</b></div>`:''}<div><span>${evalName()}</span><b>${Math.round(S.eval)}</b></div><div><span>업계 평판</span><b>${Math.round(S.fame)}</b></div></div>`,[{label:'확인'},{label:'다음부터 결산 창 끄기',sub:'메뉴 → 설정에서 다시 켤 수 있다',cls:'ghost',fn:()=>{S.monthSumOff=true;toast('월말 결산 창을 껐다 · 설정에서 다시 켤 수 있다');}}]));}
  if(monthEnd&&month(t)===12&&!S.story)Q.push(()=>{try{if(S.yr0)return yearRecap();S.yr0=yrSnap();}catch(e){console.error(e);}closeModal();});
  else if(lines.length&&S._bw==null)Q.push(()=>openModal(`${dateStr(t)} 주간 정리`,`<ul class="feed">${lines.map(l=>`<li class="${l.c}">${esc(l.t)}</li>`).join('')}</ul>`));
  Q2.slice(0,1).forEach(i=>Q.push(()=>openModal('물먹은 다음 날',`<p class="lede">「${esc(i.title)}」${jp(esc(i.title),'을','를')} 타사가 먼저 썼다. ${bossT()}: "어떻게 할 거야?"</p>`,[{label:'따라가기 기사를 쓴다',sub:'빠르게 체면치레. 평가 하락을 조금 메운다',fn:()=>{const fx=quickClip(`${i.title.replace(/^\[후속\d*\] /,'')}…추가 확인 결과`,S.st.wri*.4+S.st.spd*.4+20,R(10,22));toast('따라가기 기사 · '+fx);}},{label:'더 깊게 파서 반격한다',sub:'아이템을 되살린다 (공통 아이템, 파급력↑)',fn:()=>{i.excl=false;i.heat=6;i.imp=Math.round(i.imp*1.2);i.title='[반격] '+i.title;S.items.push(i);toast('반격 취재에 들어간다');}},{label:'깨끗이 인정하고 넘어간다',fn:()=>toast(apply({men:.5}))}])));
  scandals.forEach(p=>Q.push(()=>p.type==='ethic'?ethicOut(p):p.type==='bribe'?bribeOut(p):p.type==='suit'?suitEvent(p):p.type==='rebate'?rebateOut(p):scandal(p)));
  let seasonal=false;
  if(S.turn%4===0){const se=seasonEvent();if(se){Q.push(se);seasonal=true;}}
  if(S.rank===0&&S.inRank>=(S.story?Math.round(RANKS[0].min*D.ten):rookieWeeks()))Q.push(graduateCheck);
  else if(S.rank>=1&&S.rank<7&&S.turn%24===0)Q.push(()=>jinsa());
  if(S.tf&&S.tf.due<=S.turn)Q.push(tfResult);
  const fresh=checkUnlocks();if(fresh.length)Q.push(()=>openModal('새로 열린 일',fresh.map(id=>`<p><b>${actName(id)}</b><br><span style="color:var(--mute);font-size:13.5px">${TIPS[id]||ACT[id].d}</span></p>`).join('')));
  const evK=S._bw!=null?.5:1;
  if(!seasonal&&evCap()&&chance((S.simple?.1:.2)*evK)){const ev=pickEvent();if(ev)S.evN++;if(ev)Q.push(()=>{let ok=true;try{ok=ev.c();}catch(e){ok=false;}if(ok)return ev.run();closeModal();});}
  if(S.cols&&colCap()&&chance((S.simple?.08:S.rank===0?.22:.16)*evK)){const ce=pickColEvent();if(ce){S.evCN++;Q.push(safeRun(ce));}}
  if(S.net&&S.rank>=1&&evCap()&&chance((S.simple?.05:.14)*evK)){const el=NET_EVENTS.filter(e=>{try{return e.c();}catch(x){return false;}});if(el.length){S.evN++;Q.push(safeRun(pick(el)));}}
  if(S.flags.colOffer&&(S.founder||S.story))S.flags.colOffer=0;
  if(S.flags.colOffer){S.flags.colOffer=0;if(S.rank<=5)Q.push(()=>{const L=shuffle(OUTLETS.filter(x=>x.id!==S.outlet&&!x.closed&&!x.custom&&x.p>=OUT().p-1)).map(offerFor);const f=L.find(x=>x.rank>=S.rank)||L[0];if(!f)return closeModal();f.ok=true;const o=f.o;openModal('먼저 떠난 동료의 제안',`<p class="lede">먼저 옮긴 동료가 연락해 왔다. "${o.n}에 ${rankName(f.rank,f.o)} 자리 하나 있는데, 올래?"</p>`,[{label:'이야기를 들어 본다',fn:()=>{confirmMove(f);return false;}},{label:'지금 회사에 남는다',cls:'ghost'}]);});}
  if(S.flags.favor&&chance(.5)){const id=S.flags.favor;S.flags.favor=null;Q.push(()=>favorEvent(id));}
  if(!S.story){goalCheck().forEach(g=>Q.push(()=>{const G=myGoals(),n=G.filter(x=>S.goals[x.id]).length,all=n>=G.length;
    if(S.founder){const can=n>=2;openModal('창간 목표 달성!',`<p class="lede"><b>${g.n}</b> — ${g.d}</p><p>창간 목표 ${n}/${G.length} 달성.${can?(all?' 세 가지를 모두 이뤘다 — 완전 클리어!':' 두 가지를 이뤄 창간 엔딩을 볼 수 있다. 하나 더 이루면 완전 클리어.'):' 하나 더 이루면 창간 엔딩을 볼 수 있다.'}</p>`,[{label:'계속 키운다'},...(can?[{label:all?'완전 클리어 엔딩 보기':'창간 엔딩 보기',fn:()=>{ending(all?`창간 완전 클리어 · 「${OUT().n}」 목표 3관왕`:`창간 성공 · 「${OUT().n}」 목표 ${n}/3`);return false;}}]:[])]);return;}
    openModal('목표 달성!',`<p class="lede"><b>${g.n}</b> — ${g.d}</p><p>이번 판의 목표를 하나 이뤘다. 여기서 엔딩을 볼 수도, 계속 갈 수도 있다.</p>${all?'<p class="fx">이번 판의 목표 3가지를 모두 이뤘다 — 완전 클리어!</p>':''}`,[{label:'계속한다'},{label:'여기서 엔딩 보기',fn:()=>{ending(all?'완전 클리어 · 목표 3관왕':`목표 달성 · ${g.n}`);return false;}}]);}));}
  handoffTick(Q);storyTick(Q);founderTick(Q);medTick(Q);if(S.turn%4===0)try{exitCheck(Q);}catch(e){}try{ageCheck(Q);}catch(e){console.error(e);}if(S.turn%4===0)try{errTick(Q);errDisc(Q);arcTick(Q);traineeTick(Q);}catch(e){console.error(e);}try{lgeTick(Q);}catch(e){console.error(e);}
  if(S.founder&&founderGoal()&&!S.goals?.major){S.goals=S.goals||{};S.goals.major=dateShort();Q.push(()=>openModal('메이저 언론 달성!',`<p class="lede">「${esc(OUT().n)}」${jp(esc(OUT().n),'이','가')} ★5 메이저 매체, 포털 CP, 기자 ${S.co.staff}명을 갖췄다.</p>`,[{label:'계속 키운다'},{label:'엔딩 보기',fn:()=>{ending('창간 성공 · 메이저 언론');return false;}}]));}
  const fail=failCheck(monthEnd);if(fail)Q.push(fail);
  if(S._bw!=null){S._mq.push(...Q);Q.length=0;return;}
  if(Q.length){Q.shift()();}else{toast(`${dateStr()} — 새로운 한 주`);render();saveGame();}
}
// 한 턴 = 한 달: 안에서는 4주를 차례로 흘려보내고, 결과는 한 번에 보여 준다
// 행동력이 남았는데 다음 달로 넘기려 하면 한 번 확인한다 (메뉴 없이도 '다음부터 묻지 않기'로 끌 수 있다)
function tryEndMonth(){try{if(S&&S.phase==='game'&&S.ap>0&&S.warnNext!==false){const can=rankActs().filter(id=>ACT[id]&&!why(id)&&actCost(id)<=S.ap&&actCost(id)>0&&!['life','rest','job','deptreq','gad'].includes(id));
    if(can.length){const left=(S.mis&&S.mis.list||[]).filter(x=>!x.done);
      openModal('행동력이 남았다',`<p class="lede">이번 달 행동력이 <b class="num" style="color:var(--sodium)">${S.ap}</b> 남았다. 남은 행동력은 다음 달로 넘어가지 않는다.</p>${left.length?`<p class="hint">아직 못 한 이달의 미션: ${left.map(x=>esc(x.t)).join(' · ')}${S.mis&&!S.mis.all?' — 다 하면 다음 달 행동력 +1':''}</p>`:''}<p class="hint">지금 할 수 있는 일: ${can.slice(0,5).map(id=>actName(id)).join(' · ')}${can.length>5?` 외 ${can.length-5}개`:''}</p>`,
        [{label:'돌아가서 더 한다',sub:'행동력을 마저 쓴다',rec:true},{label:'그래도 다음 달로 넘긴다',sub:`행동력 ${S.ap} 버림`,fn:()=>{setTimeout(endMonth,0);}},{label:'다음부터 묻지 않기',cls:'ghost',fn:()=>{S.warnNext=false;setTimeout(endMonth,0);}}]);return;}}}catch(e){console.error(e);}
  endMonth();}
// 월말 결산 한눈에: 이번 달 시작 대비 바뀐 것
function monthGlance(){const m0=S._ms||{};const d=(k,v)=>{const x=v-(m0[k]??v);return Math.abs(x)<.05?'':` <i class="${x>0?'up':'dn'}">${x>0?'+':''}${Math.abs(x)>=10?Math.round(x):f1(x)}</i>`;};
  const C=[[evalName(),Math.round(S.eval),d('eval',S.eval)],['평판',Math.round(S.fame),d('fame',S.fame)],['신뢰',Math.round(S.trust),d('trust',S.trust)],['통장',`${Math.round(S.money).toLocaleString('ko-KR')}만`,(()=>{const x=S.money-(m0.money??S.money);return x?` <i class="${x>0?'up':'dn'}">${x>0?'+':''}${Math.round(x).toLocaleString('ko-KR')}만</i>`:'';})()]];
  const M=S.mis&&S.mis.list?[`미션 ${S.mis.list.filter(x=>x.done).length}/${S.mis.list.length}`]:[];let ad='';try{if(advOn()){const qq=quota(),got=myQ();if(qq)ad=`광고 ${Math.round(got/qq*100)}%`;}}catch(e){}
  const co=(S.rank>=4||S.founder)&&S.co&&S.co.last?`회사 ${S.co.last.profit>=0?'+':''}${eok(S.co.last.profit)}`:'';
  const arts=(S.clips||[]).filter(c=>c.turn>(m0.turn??S.turn-4)-1&&!c.staff).length;
  const html=`<div class="mglance">${C.map(([n,v,x])=>`<div><span>${n}</span><b>${v}${x}</b></div>`).join('')}</div><p class="hint" style="margin:4px 0 8px">${[`기사 ${arts}건`,...M,ad,co].filter(Boolean).join(' · ')}</p>`;
  const txt=`${evalName()} ${Math.round(S.eval)}${(()=>{const x=S.eval-(m0.eval??S.eval);return Math.abs(x)>=.05?`(${x>0?'+':''}${f1(x)})`:''})()} · ${[...M,ad,co].filter(Boolean).join(' · ')}`;return {html,txt};}
function endMonth(){if(!$('#modal').hidden)return;if(!S._ms)S._ms={eval:S.eval,fame:S.fame,trust:S.trust,money:S.money,turn:S.turn-4};ACT_SNAP=null;sfx('page');S._curAct=null;S._sur=false;S._mq=[];S._ml=[];let k=0;
  try{heatMonthPre();}catch(e){}do{S._bw=S.turn%4;endWeek();k++;if(S.phase!=='game')break;}while(S.turn%4!==0&&k<4);try{heatMonthPost();}catch(e){}
  S._bw=null;try{if(S.co&&S.co.last)S.co.last.t=S.mis?S.mis.m:-1;misCheck(true);}catch(e){}try{milesTick();}catch(e){}if(!S.yr0)try{S.yr0=yrSnap();}catch(e){}if(S.misAP)S.misAPm=Math.floor(S.turn/4);S.ap=apBase()+(S.misAP||0);S.misAP=0;try{misEnd();}catch(e){}
  S._ms={eval:S.eval,fame:S.fame,trust:S.trust,money:S.money,turn:S.turn};
  const q=[...new Set(S._mq)];S._mq=[];q.forEach(f=>Q.push(f));try{autoSave();}catch(e){}
  if(Q.length){Q.shift()();}else{toast(`${dateStr()} — 새로운 한 달`);render();saveGame();}
}
function worldTick(){
  if(chance(.6)){const it=makeItem(pick(Object.keys(DEPTS)),{anyScale:1,ticker:1});const o=pick(OUTLETS.filter(x=>x.id!==S.outlet));tick(`[${o.n}] ${chance(.3)?'[단독] ':''}${it.title}`);}
}
function scandal(p){calmSet(8);
  S.errors++;S.lastError=S.turn;(S.errT=S.errT||[]).push(S.turn);if(S.errT.length>20)S.errT.shift();
  const who=p.desk?'데스크로서 놓친 기사':'내 기사';try{const c0=(S.clips||[]).find(x=>x.h===p.title);if(c0){c0.flDone=1;c0.corr=c0.corr||'정정보도';}}catch(e){}
  openModal('오보 논란',`<p class="lede">${who} 「${esc(p.title)}」에 대해 당사자가 언론중재위원회에 정정보도를 청구했다. ${p.why&&p.why.length?'문제가 된 부분: '+esc(p.why.join(' · '))+'.':(p.desk?'확인이 덜 된 부분이 결재를 그대로 통과했다.':'기사 속 확인이 덜 된 내용이 사실과 달랐다.')}</p>${tipN('핵심 사실은 두 출처로 확인하고, 확인이 덜 된 사실은 기사에서 빼자. 출고 전 "팩트와 반론" 단계에서 고를 수 있다.')}`,[
    {label:'즉시 정정보도를 낸다',sub:'빨리 털고 간다',fn:()=>{const k=(p.desk?.5:1)*honestK()*(S.simple?.7:1);(S.corrLog=S.corrLog||[]).push({h:p.title,k:'정정',t:S.turn,big:1});toast(apply({trust:-3*k,eval:-2*k,fame:-1.5*k}));log(`정정보도: ${p.title}`);}},
    {label:'버틴다',risk:true,sub:'넘어갈 수도, 소송으로 커질 수도',fn:()=>{if(chance(.4)){toast('흐지부지 넘어갔다');log(`오보 논란 무마: ${p.title}`);}else{const kk=(p.desk?.5:1)*(S.simple?.7:1);const t=apply({trust:-10*kk,eval:-7*kk,fame:-4*kk});S.co.cash-=.5;openModal('손해배상 소송',`<p class="lede">법원은 정정보도와 함께 손해배상을 명령했다. 회사가 배상금을 냈고, 사내 징계위원회가 열렸다.</p>${fxLine(t)}`);log(`오보 소송 패소: ${p.title}`);return false;}}}]);
}
function rebateOut(p){if(!chance(.35)){return closeModal();}openModal('리베이트 적발',`<p class="lede">감사실이 「${esc(p.title)}」 건을 들여다보고 있다. 광고주 담당자에게 흘러간 돈이 문제가 됐다.</p>`,[{label:'관행이었다고 해명한다',fn:()=>{toast(apply({trust:-8,eval:-6}));log('광고 리베이트 적발 — 징계');}},{label:'책임을 지고 받은 돈을 반납한다',fn:()=>{S.money-=Math.round((p.amt||.25)*10000*.05);toast(apply({trust:-4,eval:-4}));}}]);}
// bribeOut: 1.6에서 src/compat/v43.js의 같은 이름 함수로 대체됨 (예전 정의는 실행되지 않아 지웠다)
function favorEvent(id){const s=S.sources.find(x=>x.id===id);if(!s)return closeModal();
  openModal('취재원의 부탁',`<p class="lede">${s.name} ${s.role}: "지난번 그거 제가 드렸잖아요. 이번엔 저희 쪽 보도자료 좀 크게 써주세요."</p>`,[
    {label:'써준다',sub:'취재원 신뢰↑, 내 신뢰도↓',fn:()=>{s.trust=clamp(s.trust+15,0,100);toast(apply({trust:-4}));log(`${s.name}의 부탁으로 홍보성 기사`);}},
    {label:'정중히 거절한다',sub:'취재원 신뢰↓',fn:()=>{s.trust=clamp(s.trust-15,0,100);toast(apply({trust:2}));}}]);}
function graduateCheck(){
  if(S.story){if(S.eval<38+DF().need/2){S.inRank-=8;log('수습 기간 연장');return openModal('수습 연장',`<p class="lede">${S.capName} 캡: "아직 멀었다. 두 달 더 굴러." (평가 ${Math.round(38+DF().need/2)} 이상 필요)</p>`);}return graduate();}
  const L=rookieReqs();const miss=L.filter(x=>!x.ok);S.rkExt=S.rkExt||0;
  if(miss.length&&S.rkExt<2){S.rkExt++;S.inRank-=4;log('수습 기간 연장');return openModal('수습 연장',`<p class="lede">${S.capName} 캡: "아직 멀었다. 한 달 더 굴러."</p><ul class="pnl">${L.map(x=>`<li>${x.ok?'✓':'✗'} ${esc(x.t)}</li>`).join('')}</ul><p class="hint">연장은 두 번까지. 그 뒤엔 평가가 깎인 채 발령된다.</p>`);}
  if(miss.length)apply({eval:-2});
  graduate();
}
function graduate(){
  const o=OUT();const aff=MAJORS[S.major].aff;
  if(window.__skip){S.rank=1;S.inRank=0;S.dept=o.depts.find(d=>catOf(d).includes(aff))||o.depts[0];S.eval=55;addSource(S.dept);log(`수습 종료, ${DEPTS[S.dept].n} 배치`);return;}
  
  // 8할은 회사가 알아서 배치한다. 인기 부서(정치·법조·탐사·외교)는 신입에게 잘 안 준다
  const TW={A:.25,B:.6,C:1,D:1.6};
  const autoPick=()=>{const w=o.depts.map(d=>{const t=deptTier(d)[0];let x=TW[t]||1;if(catOf(d).includes(aff))x*=1.3;if((t==='A'||t==='B')&&S.eval>=65)x*=1.6;return x;});let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<w.length;i++){r-=w[i];if(r<=0)return o.depts[i];}return o.depts[o.depts.length-1];};
  const place=(got,d)=>{
    S.rank=1;S.inRank=0;S.dept=got;S.eval=52+(S.eval-50)*.4;S.items=S.items.filter(i=>catOf(got).includes(i.d));
    // 수습용 미션·캡 미션을 비우고 기자 미션으로 새로 시작
    S.mission=null;S.rkExt=0;S.mis=null;S.mAct={};S.mWin={};try{misEnsure();}catch(e){}
    for(let i=0;i<2;i++)addSource(got);
    log(`수습 종료, ${DEPTS[got].n} 배치`);if(S.net)knowMore();
    const head=d==null?`회사 인사로 <b>${DEPTS[got].n}</b>`:`${got===d?'희망대로':'희망과 달리'} <b>${DEPTS[got].n}</b>`;
    const t=deptTier(got)[0];const note=d==null?(t==='A'?' 신입이 바로 가기 어려운 부서다. 동기들이 부러워했다.':t==='D'?' 신입은 대개 여기서 굴러 본다.':''):'';
    if(d!==undefined){(S.promoHist=S.promoHist||[]).push({r:1,d:dateShort(),y:years(),o:OUT().n,arts:S.totalArticles||0,ex:S.scoops||0,fast:false});S.pSnap=promoSnap();}
    openModal('정식 발령',`<div class="promo"><div class="pconf" aria-hidden="true"></div><small>${esc(OUT().n)} 수습 수료</small><div class="prk">${esc(rankName(1))}</div><p class="pl">${esc(PROMO_LINE[1][S.turn%2])}</p></div><p class="lede">${head}${cat1(got)==='loc'?` (${pick(CITIES)} 주재)`:''} 발령.${note}</p><p>출입처: ${DEPTS[got].beat}. 선배가 취재원 두 명을 넘겨줬다. 매주 아침 발제로 지면을 받고, 취재 나가기로 사실을 모으자.</p>${d==null?'<p class="hint">이번엔 희망 부서를 받지 않았다. 나중에 부서 이동 신청을 할 수 있다.</p>':''}`);return false;};
  if(o.depts.length<2||chance(.8)){const got=autoPick();return openModal('수습 종료 · 부서 배치',`<p class="lede">${S.capName} 캡: "그동안 고생했다. 인사 났다. 가서 잘해라."</p><p>올해는 희망 부서를 받지 않고 회사가 배치했다.</p>`,[{label:'발령장을 받는다',fn:()=>place(got,null)}]);}
  openModal('수습 종료 · 부서 배치 희망',`<p class="lede">${S.capName} 캡: "그동안 고생했다. 어디 가고 싶냐."</p><p>올해는 희망 부서를 받는다. 평가가 높을수록 희망대로 될 가능성이 크지만, 정치·법조 같은 인기 부서는 경쟁이 세다. (현재 ${Math.round(S.eval)}) 나중에 부서 이동 신청도 할 수 있다.</p>`,o.depts.map(d=>{const t=deptTier(d)[0];return {label:DEPTS[d].n,sub:`${DEPTS[d].lede}${catOf(d).includes(aff)?' · 전공 적합':''}${t==='A'?' · 인기 부서(경쟁↑)':t==='D'?' · 지원자 적음':''}`,fn:()=>{
    const pen={A:-.25,B:-.1,C:0,D:.12}[t]||0;
    const got=chance(.4+S.eval/230+pen+(catOf(d).includes(aff)?(t==='A'?.05:.1):0)+((colBy('boss')||{rel:0}).rel)/500)?d:autoPick();
    return place(got,d);}};}));
}
// 순환 보직: 한 부서에 2~3년 있으면 원하지 않아도 옮긴다. 큰 회사일수록 잦고, 작은 회사는 부서가 적어 드물다. 평가가 바닥이면 문책성 인사
function rotation(){const o=OUT();if(S.deptT==null)S.deptT=Math.max(0,S.turn-48);const ten=S.turn-S.deptT;const big=o.p>=4?1:o.p===3?.8:.45;
  let p=clamp((ten-72)/96,0,.75)*big;const bad=S.eval<45&&S.inRank>=24&&chance(.25);if(bad)p=Math.max(p,.6);if(S.simple)p*=.6;
  if(!chance(p)||o.depts.length<3)return null;
  const area=AREAS[cat1(S.dept)];const pool=o.depts.filter(d=>d!==S.dept&&(deptTier(d)[0]!=='A'||S.eval>=55)&&(deptTier(d)[0]!=='B'||S.eval>=48));const reg=pool.filter(d=>isRegD(d));
  const near=pool.filter(d=>!isRegD(d)&&AREAS[cat1(d)]===area),far=pool.filter(d=>!isRegD(d)&&AREAS[cat1(d)]!==area);
  const nd=bad&&reg.length&&chance(.4)?pick(reg):reg.length&&chance(.1)?pick(reg):near.length&&chance(.5)?pick(near):pick(far.length?far:pool);if(!nd)return null;
  const why=bad?'평가가 좋지 않아 사실상 문책성 인사라는 말이 돈다.':ten>=120?`${DEPTS[S.dept].n}에서만 ${Math.floor(ten/48)}년 넘게 있었다. 회사는 "시야를 넓히라"고 했다.`:'정기 순환 보직이다. 한 부서에 오래 두지 않는 게 회사 방침이다.';
  S.rotPend={nd,why};
  Q.unshift(()=>openModal('인사 발령',`<p class="lede"><b>${DEPTS[S.dept].n}</b> → <b>${DEPTS[nd].n}</b> 발령.</p><p>${why}</p><p class="hint">새 출입처: ${DEPTS[nd].beat}. 가진 아이템은 대부분 두고 가지만 취재원은 데려간다.<br>${deptPCtxt(nd)}</p>`,[
    {label:'받아들인다',sub:'새 부서에서 새로 시작한다 · 상식 +1',fn:()=>{doRotate(nd);gain('kno',1);}},
    {label:`${bossT()}에게 재고를 요청한다`,sub:'가끔 받아들여진다 · 부장 관계↓',fn:()=>{const bs=colBy('boss');if(chance(.2+(bs?bs.rel/250:0))){relUp(bs,-4,'인사 재고 요청');S.deptT=S.turn-48;toast('이번엔 남게 됐다. 다음 인사 땐 어렵다');}else{relUp(bs,-8,'인사 불만');doRotate(nd);toast('"이미 결정된 거야." 결국 짐을 쌌다 · '+apply({men:-1}));}}}]));
  return `<p>${DEPTS[S.dept].n}에도 인사 바람이 분다.</p>`;}
function doRotate(nd){const from=S.dept;deptHistAdd(from);deptHistAdd(nd);S.dept=nd;S.items=S.items.filter(i=>catOf(nd).includes(i.d));if(S.rank>=2)S.team=genTeam();addSource(nd);S.deptT=S.turn;S.rotPend=null;log(`인사: ${DEPTS[from].n} → ${DEPTS[nd].n}`);ach('deptmove');try{deptArrive(nd);}catch(e){}if(S.net)knowMore();render();}
// 동료들의 정기 인사: 본사↔지역 주재, 부서 간 순환이 현실처럼 잦다 (내 발령만 드물게)
function npcReshuffle(){if(S.founder&&!Object.keys(S.posts||{}).length)return '';const o=OUT();const per=roster();const regD=o.depts.find(x=>isRegD(x));const C=corrs();
  const hq=Object.keys(per).filter(d=>DEPTS[d]&&!isRegD(d));const movable=d=>per[d].filter(m=>!S.team.includes(m)&&!(m.r>=2)&&!m.acting&&!m.desk);
  let toReg=0,fromReg=0,swap=0;const regs=C.length?[...new Set(C.map(m=>m.reg))]:[];
  if(regD&&C.length&&!S.founder){const n=Math.max(chance(.25)?0:1,Math.round(C.length*R(6,18)/100));for(let i=0;i<n;i++){const d=pick(hq);const cand=movable(d).filter(m=>!m.r);const back=C.filter(m=>!m.r&&!S.team.includes(m));if(!cand.length||!back.length)continue;
    const a=pick(cand),b=pick(back);per[d]=per[d].filter(x=>x!==a);a.d=regD;a.reg=b.reg;a.role='주재기자';a.r=0;S.corr.push(a);per[regD].push(a);
    S.corr=S.corr.filter(x=>x!==b);per[regD]=per[regD].filter(x=>x!==b);b.reg=null;b.role=null;b.d=d;per[d].push(b);toReg++;fromReg++;}}
  const k=Math.max(chance(.2)?0:1,Math.round(o.staff*R(2,8)/100));for(let i=0;i<k&&hq.length>1;i++){const d1=pick(hq),d2=pick(hq.filter(x=>x!==d1));const a=pick(movable(d1)),b=pick(movable(d2));if(!a||!b)continue;
    per[d1]=per[d1].filter(x=>x!==a);per[d2]=per[d2].filter(x=>x!==b);a.d=d2;b.d=d1;per[d2].push(a);per[d1].push(b);swap++;}
  Object.keys(per).forEach(d=>fixDept(per[d],d));S.mates=null;
  let mine='';if(S.rank>=2&&S.rank<=3&&S.team.length>2&&chance(.4)){const out=pick(S.team);const inn=genMember(S.dept,35,68);inn.yrs=R(3,9);S.team=S.team.filter(x=>x!==out);S.team.push(inn);mine=` 우리 부서에서는 ${out.name} 기자가 나가고 ${inn.name} 기자가 들어왔다.`;}
  if(!toReg&&!swap&&!mine)return '';
  return `<p class="hint">이번 인사로 본사 기자 ${toReg}명이 지역 주재로 나가고 주재기자 ${fromReg}명이 본사로 돌아왔다. 부서를 맞바꾼 기자도 ${swap*2}명.${mine}</p>`;}
function jinsa(){
  const D=DF();const parts=[];try{const np=npcReshuffle();if(np)parts.push(np);}catch(e){}try{const nj=npcJinsa();if(nj)parts.push(nj);}catch(e){console.error(e);}
  // 부서 이동
  if(S.reqDept&&S.rank<=3){const rq=deptReq(S.reqDept).filter(x=>!x.ok);const p=rq.length?0:deptMoveP(S.reqDept);
    if(rq.length)parts.push(`<p>${DEPTS[S.reqDept].n} 이동 조건이 모자라다: ${rq.map(x=>x.t).join(', ')}</p>`);
    if(chance(p)){const from=S.dept;deptHistAdd(from);S.dept=S.reqDept;S.deptT=S.turn;deptHistAdd(S.dept);S.items=S.items.filter(i=>catOf(S.dept).includes(i.d));if(S.rank>=2)S.team=genTeam();addSource(S.dept);parts.push(`<p class="lede">${DEPTS[from].n}에서 <b>${ro2(DEPTS[S.dept].n)}</b> 발령. 새 출입처는 ${DEPTS[S.dept].beat}.</p>`);log(`${ro2(DEPTS[S.dept].n)} 부서 이동`);ach('deptmove');knowMore();try{deptArrive(S.dept);}catch(e){}}
    else if(!rq.length)parts.push(`<p>${DEPTS[S.reqDept].n} 이동 신청은 이번 인사에 반영되지 않았다.${deptTier(S.reqDept)[0]==='A'?' 인기 부서라 지원자가 몰렸다.':''}</p>`);
    S.reqDept=null;}
  else if(S.rank>=1&&S.rank<=3&&!S.story&&!S.founder){const r0=rotation();if(r0)parts.push(r0);}
  const need=RANKS[S.rank];const minW=promoMinW(S.rank);if(nextRank(S.rank)===null){openModal('정기 인사 발표',parts.join('')||'<p>변동 없음.</p>');return;}try{if(elJinsa(parts))return;}catch(e){console.error(e);}
  if(S.ft){let pr=false;try{pr=ftJinsa(parts);}catch(e){console.error(e);}if(pr){if(parts.length)Q.unshift(()=>openModal('정기 인사',parts.join('')));return;}}
  if(S.inRank>=minW){
    const ev=promoEv(S.rank),fm=promoFm(S.rank);const lack=[];
    if(S.eval<ev)lack.push(`${evalName()} ${Math.round(S.eval)}/${ev}`);if(S.fame<fm)lack.push(`평판 ${Math.round(S.fame)}/${fm}`);try{promoReqs(S.rank).filter(x=>!x.ok).forEach(x=>lack.push(x.t));}catch(e){}
    const comp=Math.min(.97,orgK().pick+(S.styT==='net'?.15:0));if(!lack.length&&!chance(comp)&&S.rank<6){parts.push(`<p>조건은 채웠지만 이번엔 동기 ${pick(['두','세','네'])} 명과의 경쟁에서 밀렸다. 큰 회사는 자리가 적다. 다음 인사를 노리자.</p>`);apply({eval:.5});openModal('정기 인사 발표',parts.join(''));return;}
    if(!lack.length&&!(S.rank===6&&!chance(.6))){promote();if(parts.length)Q.unshift(()=>openModal('정기 인사',parts.join('')));return;}
    parts.push(`<p>이번 승진 명단에 이름이 없다.${lack.length?' 부족: '+lack.join(', '):' 이사회가 한 번 더 지켜보겠다고 한다.'}</p>`);
  }else parts.push(`<p>${rankName(nextRank(S.rank))} 승진까지 재직 ${moTxt(S.inRank)}/${moTxt(minW)}.</p>`);
  openModal('정기 인사 발표',parts.join(''));
}
function promote(){
  const prev=S.rank,inR=S.inRank,minW0=promoMinW(S.rank);S.rank=nextRank(S.rank)??S.rank;S.inRank=0;S.eval=55+(S.eval-55)*.4;const r=S.rank;
  if(r>=2&&!S.team.length)S.team=genTeam();
  if(r===2&&!S.team.length)S.team=genTeam();
  if(r===2&&S.cols&&!colBy('junior'))S.cols.push(mkCol('junior',20));
  if(r===4){S.area=AREAS[cat1(S.dept)];S.items=[];for(let i=0;i<3;i++)S.team.push(genMember(pick(OUT().depts),45,70));}
  if((r===2||r===3)&&!S.story&&!S.founder&&OUT().depts.length>=4&&chance(.35)){const area=AREAS[cat1(S.dept)];const c=OUT().depts.filter(d=>d!==S.dept&&!isRegD(d)&&AREAS[cat1(d)]===area);if(c.length){const nd=pick(c);Q.push(()=>openModal('승진과 함께 발령',`<p class="lede">${rankName(r)} 승진과 함께 <b>${DEPTS[nd].n}</b> 데스크로 간다.</p><p>승진하면 다른 부서로 보내는 게 이 회사 관행이다.</p><p class="hint">${deptPCtxt(nd)}</p>`,[{label:'새 부서로',fn:()=>doRotate(nd)}]));}}
  if(r>=2)ach('desk');if(r===3)ach('boss3');if(r===4)ach('exec4');if(r===5)ach('chief5');if(r===6)ach('chief');if(r===7)ach('ceo');const fast=inR<=minW0*1.15;if(fast)ach('fast');
  const unlock={2:'데스킹이 열렸다. 부서원 4명의 기사를 봐줘야 한다.',3:'부서 기획회의와 기자 영입을 할 수 있다.',4:'1면 회의와 칼럼이 열렸다. 이제 편집국 전체를 본다.',5:'구독 캠페인을 경영진에 제안할 수 있다.',6:'매체의 편집 방향을 정한다.',7:'경영을 맡는다. 구독·광고·인력·투자를 결정하고 이사회 신임을 지켜야 한다. 임기는 1년.'}[r]||'';
  checkUnlocks();Q.unshift(()=>{const ids=RANK_ACTS[r].filter(id=>id!=='breaking'&&!RANK_ACTS[prev].includes(id));if(!ids.length)return closeModal();openModal(`${rankName(r)}의 일`,ids.map(id=>`<p><b>${actName(id)}</b>${lockReason(id)?` <span class="tag">${lockReason(id)}</span>`:''}<br><span style="color:var(--mute);font-size:13.5px">${TIPS[id]||ACT[id].d}</span></p>`).join(''));});
  {const nk=knowMore();if(nk)log(`직급이 오르며 새로 닿은 기관·인물 ${nk}곳`);}
  log(`${rankName(r)} 승진`);tick(`${OUT().n} 인사 — ${S.name} ${rankName(r)}`,1);S.scene=baseScene();
  const bonus=S.founder?0:Math.round(payOf(OUT())*.5/10)*10;if(bonus)S.money+=bonus;
  openModal(`${rankName(r)} 승진`,promoCard(prev,r,inR,fast)+`${prev+1!==r?`<p class="hint">작은 회사라 중간 직급 없이 바로 올라간다.</p>`:''}<p>${unlock}</p>${fxLine(apply({fame:3,men:1})+(bonus?` · 승진 축하금 +${bonus}만`:''))}`,[{label:'자리에 앉는다'}]);
}