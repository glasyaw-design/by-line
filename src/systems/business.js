/* 바이라인 1.6 — src/systems/business.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// --- 간부: 편집회의·순시·특별취재팀·속보 ---
// ===== 사장·대표의 일: 편집회의 대신 경영회의와 이사회 =====
RUN.exec=function(){const c=S.co,l=c.last||{},rv=coRev();const tv=isTV();const mood=Math.round(S.wMood??60);
  const rep2=[`편집${tv?'·보도':''}: 보도 품질 ${Math.round(c.q)} · ${c.q>=65?'"단독이 꾸준히 나옵니다."':c.q>=50?'"평년 수준입니다."':'"인력이 빠져 지면이 얇습니다."'}`,
   `광고·사업: 지난달 광고 ${adAmt(l.ad||OUT().ad)} · 경기 ${ECON_N(econ())}`,`경영지원: 월 손익 ${l.profit!=null?(l.profit>=0?'+':'')+eok(l.profit):'—'} · 자금 ${eok(c.cash)}`,`노무: 편집국 사기 ${mood} · ${mood>=60?'"분위기 괜찮습니다."':mood>=45?'"불만이 조금씩 쌓입니다."':'"이탈 조짐이 있습니다."'}`];
  const go=(fx,fn,msg)=>()=>{spend(1,4);setCd('exec');fn();const t=apply(fx);log(`경영회의: ${msg}`);openModal('경영회의 결론',`<p class="lede">${msg}</p>${fxLine(t)}`);return false;};
  openModal('경영회의 주재',`<p class="lede">부문장들이 차례로 보고했다. 이번 달 회사가 힘을 줄 곳을 하나 정한다.</p><ul class="feed">${rep2.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`,[
   {label:'비용 통제',sub:`자금 +${eok(rv*.04)} · 사기·보도 품질 조금↓`,fn:go({},()=>{c.cash+=rv*.04;S.wMood=clamp((S.wMood??60)-2,0,100);c.q=Math.max(10,c.q-.6);},'출장비·외주비를 묶고 불요불급한 지출을 줄인다.')},
   {label:'광고·사업 드라이브',sub:'다음 몇 달 광고 매출↑ · 신뢰 조금↓',fn:go({trust:-.5},()=>{c.adB+=.04;S.flags.adPush=(S.flags.adPush||0)+1;},'광고국과 사업국에 분기 목표를 다시 내려보냈다.')},
   {label:'보도 품질 투자',sub:`자금 -${eok(rv*.05)} · 보도 품질·평판↑`,fn:go({fame:.5},()=>{c.cash-=rv*.05;c.q=Math.min(100,c.q+1.5);S.wMood=clamp((S.wMood??60)+1,0,100);},'탐사·기획 예산을 늘리고 편집국 인력 공백을 메운다.')},
   {label:'사내 소통·처우 점검',sub:`자금 -${eok(rv*.02)} · 사기↑ · 평가 조금↑`,fn:go({eval:.4},()=>{c.cash-=rv*.02;S.wMood=clamp((S.wMood??60)+3,0,100);},'노조·기수 대표와 간담회를 열고 처우 개선 과제를 정리했다.')},
   {label:'다음에',cls:'ghost'}]);};
RUN.board=function(){const c=S.co,l=c.last||{},pr=l.profit||0,rv=coRev();const K=(S.kpi&&S.kpi.hist)||[];
  const go=fn=>()=>{spend(1,4);setCd('board');return fn();};
  openModal('이사회·대주주 보고',`<p class="lede">분기 이사회. 대주주 측 이사들이 실적 자료를 넘기고 있다.</p><p>월 손익 ${l.profit!=null?(pr>=0?'+':'')+eok(pr):'—'} · 자금 ${eok(c.cash)} · 보도 품질 ${Math.round(c.q)} · 신뢰 ${Math.round(S.trust)}</p><p class="hint">이사회 보고는 연임 심사에 남는다. 숫자를 부풀리면 당장은 좋아 보이지만 들키면 크게 잃는다.</p>`,[
   {label:'있는 그대로 보고한다',sub:pr>=0?'흑자 · 이사회 신임↑':'적자 · 신임 조금↓ 대신 신뢰는 쌓인다',fn:go(()=>{const t=apply(pr>=0?{eval:1.5}:{eval:-.5,trust:.5});S.boardSup=(S.boardSup||0)+(pr>=0?2:1);openModal('보고 끝',`<p class="lede">${pr>=0?'"수고 많으셨습니다." 이사회가 다음 안건으로 넘어갔다.':'"내년 계획을 더 구체적으로 가져오세요." 분위기가 무거웠지만 숫자는 믿겠다고 했다.'}</p>${fxLine(t)}`);return false;})},
   {label:'좋은 숫자 위주로 포장한다',sub:'당장 신임↑ · 30% 확률로 감사위원이 문제 삼는다',risk:true,fn:go(()=>{let t;if(chance(.3)){t=apply({eval:-3,trust:-1});S.boardSup=Math.max(-4,(S.boardSup||0)-4);log('이사회 보고 숫자 포장 — 감사위원 문제 제기');openModal('감사위원의 질문',`<p class="lede">"이 광고 매출, 지난 분기 계약이 당겨진 거 아닙니까?" 회의실이 조용해졌다.</p>${fxLine(t)}`);}else{t=apply({eval:2});S.boardSup=(S.boardSup||0)+2;openModal('보고 끝',`<p class="lede">이사들이 고개를 끄덕였다. 다음 분기에도 이 숫자를 맞춰야 한다.</p>${fxLine(t)}`);}return false;})},
   {label:'증자·투자를 요청한다',sub:`성사되면 자금 +${eok(rv*.6)} · 대주주 부담 · 평가 조금↓`,fn:go(()=>{const ok=chance(clamp(.25+(S.eval-50)/80+(pr>=0?.15:0)+(c.q-55)/150,.08,.85));let t;if(ok){c.cash+=rv*.6;t=apply({eval:-.5});log(`이사회 증자 승인 ${eok(rv*.6)}`);openModal('증자 승인',`<p class="lede">대주주가 ${eok(rv*.6)} 증자에 동의했다. "이번이 마지막입니다."</p>${fxLine(t)}`);}else{t=apply({eval:-1.5});S.boardSup=(S.boardSup||0)-1;openModal('부결',`<p class="lede">"지금 실적으로는 어렵습니다." 증자안이 보류됐다.</p>${fxLine(t)}`);}return false;})},
   {label:'다음에',cls:'ghost'}]);};
RUN.meeting=function(){
  const heads=S.team.length?S.team:[genMember(S.dept)];const area=S.area;const tv=isTV();
  const pool=OUT().depts.filter(d=>S.rank>=6||!area||AREAS[cat1(d)]===area);
  const N=S.rank>=5||S.founder?6:5;
  const P=Array.from({length:N},()=>{const m=pick(heads);const d=pick(pool.length?pool:OUT().depts);const it=makeItem(d,{excl:chance(.4)});return{m,d,it,vr:R(30,100)/100,choice:null};});
  const OPT=[['front',tv?'첫 꼭지':'1면 톱','크게 터지거나 크게 다친다 · 1건만'],['sub',tv?'메인뉴스':'1면 하단','눈에 띄되 위험은 절반 · 2건까지'],['in','안쪽 면','무난하다'],['more','보강 지시','더 단단해져 돌아온다 · 단독은 뺏길 수도'],['kill','킬','기사를 접는다']];
  const LIM={front:1,sub:2};const vw=v=>v>=.8?'탄탄':v>=.6?'대체로 확인':v>=.45?'절반쯤':'아직 약함';
  const board=()=>{const cnt=k=>P.filter(p=>p.choice===k).length;
    openModal(`${tv?'보도국':'편집'} 회의 주재 · 발제 ${N}건`,`<p>데스크들이 오늘 ${tv?'뉴스':'지면'}에 올릴 기사 ${N}건을 가져왔다. 먼저 전부 훑어보고, 기사마다 어떻게 할지 정한 뒤 회의를 마친다.</p>
     <p class="hint">${OPT.map(o=>`<b>${o[1]}</b> ${o[2]}`).join(' · ')}</p>
     ${P.map((p,i)=>`<div class="card mtc${p.choice?' done':''}"><div class="t">${i+1}. 「${esc(p.it.title)}」 ${p.it.excl?'<span class="tg h">단독</span>':''}${p.it.adv?'<span class="tg">광고주 관련</span>':''}${p.it.ideo?'<span class="tg">논조 갈림</span>':''}</div>
       <div class="meta"><span>${esc(p.m.name)} · ${DEPTS[p.d].n} 데스크</span><span>확인 ${pct(p.vr)} (${vw(p.vr)})</span><span>파급력 ${p.it.imp}</span></div>
       <div class="mopt">${OPT.map(([k,n])=>{const full=LIM[k]&&cnt(k)>=LIM[k]&&p.choice!==k;return `<button type="button" class="mob${p.choice===k?' on':''}" data-mi="${i}" data-mk="${k}" ${full?'disabled':''}>${n}</button>`;}).join('')}</div></div>`).join('')}
     <p class="hint" id="mleft">${P.filter(p=>!p.choice).length?`아직 정하지 않은 기사 ${P.filter(p=>!p.choice).length}건 — 회의를 마치면 안쪽 면으로 간다.`:'모두 정했다.'}</p>`,
     [{label:'이대로 회의를 마친다',sub:'행동력을 쓴다',fn:()=>{P.forEach(p=>{if(!p.choice)p.choice='in';});resolve();return false;}},
      {label:'추천대로 정리',sub:'확인·파급력 기준으로 자동 배정 (바꿀 수 있다)',fn:()=>{const o=P.slice().sort((a,b)=>b.it.imp*b.vr-a.it.imp*a.vr);P.forEach(p=>p.choice=null);o.forEach((p,i)=>{p.choice=p.vr<.45?(p.it.imp>=50?'more':'kill'):i===0&&p.vr>=.7?'front':i<=2&&p.vr>=.6?'sub':'in';});board();return false;}},
      {label:'회의를 미룬다',sub:'행동력은 쓰지 않는다',cls:'ghost'}]);
    document.querySelectorAll('#mb [data-mi]').forEach(b=>b.onclick=()=>{const p=P[+b.dataset.mi];p.choice=p.choice===b.dataset.mk?null:b.dataset.mk;const st=$('#modal .mbx').scrollTop;board();$('#modal .mbx').scrollTop=st;});};
  const resolve=()=>{
    spend(1,4);setCd('meeting');const lines=[];const fx={eval:0,fame:0,trust:0};
    P.forEach(p=>{const val=p.it.imp*p.vr*(p.it.excl?1.3:1);
      if(p.choice==='front'||p.choice==='sub'){const h=p.choice==='front'?1:.5;fx.fame+=val/90*h;fx.eval+=(p.vr>=.7?.8:-.8)*h;S.co.q+=p.vr*1.5*h;
        if(p.vr<.6&&chance((1-p.vr)*.32*DF().risk*h)){S.pending.push({type:'err',title:p.it.title,due:S.turn+R(1,3),desk:1});lines.push({c:'r',t:`${p.choice==='front'?(tv?'첫 꼭지':'1면 톱'):(tv?'메인뉴스':'1면 하단')} 「${p.it.title}」 — 확인이 덜 됐다. 찜찜하다.`});}
        else lines.push({c:'g',t:`${p.choice==='front'?(tv?'첫 꼭지':'1면 톱'):(tv?'메인뉴스':'1면 하단')} 「${p.it.title}」 — ${p.vr>=.7?'탄탄하다. 타사들이 받아썼다.':'반응은 있었다.'}`});if(p.choice==='front')tick(`[${OUT().n}] ${p.it.excl?'[단독] ':''}${p.it.title}`,1);}
      else if(p.choice==='in'){fx.eval+=.2;S.co.q+=p.vr*.5;lines.push({c:'',t:`안쪽 면 「${p.it.title}」`});}
      else if(p.choice==='more'){(S.reinforce=S.reinforce||[]).push({title:p.it.title,imp:p.it.imp,excl:p.it.excl,vr:Math.min(1,p.vr+.3),m:p.m.name,due:S.turn+1});p.m.skill=clamp(p.m.skill+.5,0,95);lines.push({c:'s',t:`「${p.it.title}」 보강 지시. ${p.m.name} 팀이 한 달 더 판다.`});}
      else{if(val>=40){fx.eval-=.6;p.m.skill=clamp(p.m.skill-.5,0,95);lines.push({c:'r',t:`「${p.it.title}」 킬. ${p.m.name}의 표정이 굳었다.`});if(p.it.excl&&chance(.4))tick(`[${pick(OUTLETS.filter(o=>o.id!==S.outlet)).n}] [단독] ${p.it.title}`);}else{fx.trust+=.3;lines.push({c:'',t:`「${p.it.title}」 킬. 깔끔한 판단이었다.`});}}
    });
    openModal('회의 결과',`<ul class="feed">${lines.map(l=>`<li class="${l.c}">${esc(l.t)}</li>`).join('')}</ul>${fxLine(apply(fx))}`);
  };
  board();
};
RUN.tour=function(){
  spend(1,4);setCd('tour');
  const m=S.team.length?pick(S.team):genMember(S.dept);const others=S.team.filter(x=>x!==m);const m2=others.length?pick(others):genMember('soc');
  const sc=[
   ()=>openModal(`${ACT.tour.n} · 번아웃`,`<p class="lede">${m.name} 기자가 모니터 앞에서 꾸벅 졸고 있다. 3주째 야근이다.</p>`,[{label:'일주일 휴가를 보낸다',sub:'부서원 보호, 이번 달 성과 조금↓',fn:()=>{m.skill=clamp(m.skill+1,0,95);S.flags.plan=(S.flags.plan||0)-2;toast(apply({trust:1,eval:.3}));}},{label:'"조금만 더 버티자"',sub:'성과↑, 퇴사 위험',fn:()=>{S.flags.plan=(S.flags.plan||0)+2;if(chance(.3)&&S.team.includes(m)){S.team=S.team.filter(x=>x!==m);S.co.staff--;log(`${m.name} 기자 퇴사`);toast(`${m.name} 기자가 사표를 냈다`);}else toast(apply({eval:.6}));}}]),
   ()=>openModal(`${ACT.tour.n} · 부서 갈등`,`<p class="lede">${DEPTS[m.d].n} ${jo2(m.name,'과','와')} ${DEPTS[m2.d].n} ${jo2(m2.name,'이','가')} 같은 아이템을 두고 언성을 높인다. "우리 출입처 얘기잖아!"</p>`,[{label:`${m.name} 쪽에 맡긴다`,fn:()=>{m.skill+=1;m2.skill-=.5;toast(apply({eval:.4}));}},{label:'두 부서 합동 취재로 묶는다',sub:'기사가 커진다',fn:()=>{m.skill+=.5;m2.skill+=.5;S.co.q+=1.5;toast(apply({eval:.8,fame:.4}));}},{label:'둘 다 불러 혼낸다',fn:()=>toast(apply({eval:-.3,trust:-.5}))}]),
   ()=>openModal(`${ACT.tour.n} · 막내의 질문`,`<p class="lede">수습 딱지를 갓 뗀 기자가 쭈뼛거리며 묻는다. "첫 단독은 어떻게 하셨어요?"</p>`,[{label:'커피 사 주며 한 시간 이야기한다',sub:'부서원 실력↑',fn:()=>{S.team.forEach(t=>t.skill=clamp(t.skill+.4,0,95));toast(apply({hp:-3,net:.3}));}},{label:'"발로 뛰어." 한마디만',fn:()=>toast(apply({eval:.2}))}]),
   ()=>openModal(`${ACT.tour.n} · 노조 대의원`,`<p class="lede">노조 대의원이 다가왔다. "주 52시간, 편집국은 예외입니까?"</p>`,[{label:'근무표를 손보겠다고 약속한다',sub:'신뢰↑, 성과 약간↓',fn:()=>{S.flags.plan=(S.flags.plan||0)-1;relUp(colBy('union'),6,'근무표 약속');toast(apply({trust:2}));}},{label:'"언론사는 원래 그래"',fn:()=>{relUp(colBy('union'),-6,'노조 무시');toast(apply({trust:-2,eval:.4}));}}]),
   ()=>openModal(`${ACT.tour.n} · 수상한 초고`,`<p class="lede">${m.name} 기자 화면의 초고. 출처가 "업계 관계자" 하나뿐이다.</p>`,[{label:'옆에 앉아 같이 고친다',sub:'오보 하나를 막는다',fn:()=>{m.skill+=1;toast(apply({trust:1.5,hp:-4}));}},{label:'데스크를 믿고 지나간다',fn:()=>{if(chance(.3*DF().risk))S.pending.push({type:'err',title:`${m.name} 기자의 기사`,due:S.turn+R(1,3),desk:1});}}]),
   ()=>openModal(`${ACT.tour.n} · 야식`,`<p class="lede">마감 직전 편집국. 야식을 쏘기로 했다.</p>`,[{label:'치킨 스무 마리',sub:'통장 -40만',fn:()=>{S.money-=40;S.team.forEach(t=>t.skill+=.2);S.cols.forEach(c=>relUp(c,1));toast(apply({eval:.4}));}},{label:'다음에',cls:'ghost'}]),
   ()=>openModal(`${ACT.tour.n} · 이직 조짐`,`<p class="lede">${m.name} 기자 책상 위에 타사 경력 공고가 출력돼 있다.</p>`,[{label:'불러서 고민을 듣는다',sub:'붙잡을 가능성↑',fn:()=>{if(chance(.7)){m.skill+=1;toast(`${m.name}: "사실 출입처가 너무 안 맞아서요." 부서를 조정해 줬다`);}else{S.team=S.team.filter(x=>x!==m);S.co.staff--;log(`${m.name} 기자 이직`);toast(`${jo2(m.name,'은','는')} 결국 떠났다`);}}},{label:'모른 척한다',fn:()=>{if(chance(.4)&&S.team.includes(m)){S.team=S.team.filter(x=>x!==m);S.co.staff--;log(`${m.name} 기자 이직`);toast(`${jo2(m.name,'이','가')} 사표를 냈다`);}}}])
  ];
  pick(sc)();
};
RUN.taskforce=function(){
  const topics=[0,1,2].map(()=>makeItem(pick(OUT().depts),{excl:true,mult:1.45}));
  const pickTeam=it=>{const best=S.team.slice().sort((a,b)=>b.skill-a.skill);const mid=best[Math.floor(best.length/2)];
    const opts=[{n:'에이스 3명 투입',m:best.slice(0,3),w:R(6,8)},{n:'중견·막내 섞어 육성형',m:[mid,best[best.length-1],best[1]||best[0]].filter((x,i,a)=>x&&a.indexOf(x)===i),w:R(8,10),grow:1},{n:'에이스 2명 단기전',m:best.slice(0,2),w:R(4,6)}];
    openModal('특별취재팀 · 팀 구성',`<p class="lede">「${esc(it.title)}」</p><p>팀원이 빠진 동안 부서 성과가 조금 줄어든다.</p>`,opts.map(o=>({label:o.n,sub:`${o.m.map(x=>`${x.name}(${Math.round(x.skill)})`).join(', ')} · ${wkTxt(o.w)}`,fn:()=>{spend(1,6);setCd('taskforce');S.tf={title:it.title,d:it.d,imp:it.imp,adv:it.adv,sk:avg(o.m.map(x=>x.skill)),due:S.turn+o.w,grow:!!o.grow,ids:o.m.map(x=>x.id),names:o.m.map(x=>x.name)};S.flags.plan=(S.flags.plan||0)-2;log(`특별취재팀 출범: 「${it.title}」`);toast(`특별취재팀 출범 — ${wkTxt(o.w)} 뒤 결과`);}})));};
  openModal('특별취재팀 · 주제 고르기','<p>정예 기자 2~3명을 빼서 몇 주 동안 한 주제만 판다. 성공하면 대형 특종, 실패하면 시간만 날린다.</p>',topics.map(it=>({label:it.title,sub:`${DEPTS[it.d].n} · 예상 파급력 ${it.imp}${it.adv?' · 광고주 관련':''}`,fn:()=>{pickTeam(it);return false;}})).concat([{label:'다음에',cls:'ghost'}]));
};
function tfResult(){
  if(!S.tf)return closeModal();const tf=S.tf;S.tf=null;const p=clamp((.25+tf.sk/150+(S.co.q-50)/250)*DF().ver,.1,.85);const r=Math.random();
  if(tf.grow)S.team.forEach(m=>{if(tf.ids.includes(m.id))m.skill=clamp(m.skill+3,0,95);});
  if(r<p){const imp=clamp(Math.round(tf.imp*1.15),40,100);const clip={h:`[특별취재팀] ${tf.title}`,o:OUT().n,d:tf.d,q:R(72,92),imp,excl:true,date:dateShort(),turn:S.turn,views:imp*R(900,1500),lead:`${OUT().n} 특별취재팀이 ${Math.round((tf.due-S.turn)+8)}주간 추적한 결과다.`,by:tf.names.join('·'),place:isTV()?'메인뉴스 첫 꼭지':'1면 톱',portal:1};
    S.clips.unshift(clip);S.co.q+=5;S.co.bS+=.01;S.co.bT+=.02;if(tf.adv)S.flags.adPush=(S.flags.adPush||0)+1;tick(`[${OUT().n}] [특별취재팀] ${tf.title}`,1);log(`특별취재팀 대특종: ${tf.title}`);
    openModal('특별취재팀 대특종',`${clipHTML(clip)}<p>연속 보도가 이어지고 국회가 움직였다.${tf.adv?' 해당 기업 광고는 끊길 각오를 해야 한다.':''}</p>${fxLine(apply({fame:5,eval:3.5,trust:1}))}`);}
  else if(r<p+.3){openModal('특별취재팀 결과',`<p class="lede">「${esc(tf.title)}」 — 핵심 고리 하나를 끝내 확인하지 못했다. 확인된 부분만 기획 기사로 냈다.</p>${fxLine(apply({fame:1.5,eval:1}))}`);}
  else{openModal('특별취재팀 해산',`<p class="lede">「${esc(tf.title)}」 — 결정적 제보자가 진술을 번복했다. 몇 주의 취재가 서랍으로 들어갔다.</p>${fxLine(apply({eval:-2}))}`);S.co.cash-=.3;}
}
function newBreaking(){const it=makeItem(pick(['soc','soc','int','loc','eco']),{excl:false});const kinds=['대형 화재','열차 탈선','건물 붕괴','대규모 정전','해외 지진','금융 전산 마비','고속도로 연쇄 추돌','유력 인사 긴급 체포'];const k=pick(kinds);S.breaking={title:`[속보] ${pick(PLACES)} ${k}`,due:S.turn+1,rivals:R(3,9)};tick(S.breaking.title);}
RUN.breaking=function(){const b=S.breaking;
  openModal('속보 지휘',`<p class="lede">${esc(b.title)}</p><p>타사 ${b.rivals}곳이 이미 현장에 붙었다. 어떻게 할까?</p>`,[
   {label:'즉시 특보 체제',sub:'빠르다. 확인 안 된 정보가 섞일 수 있다',fn:()=>{spend(1,8);S.breaking=null;if(chance(.28*DF().risk))S.pending.push({type:'err',title:b.title,due:S.turn+1,desk:1});S.co.bT+=.01;toast(apply({fame:2,eval:1.2}));log(`${b.title} — 특보 체제`);}},
   {label:'확인되는 대로 단계적 보도',sub:'느리지만 정확하다',fn:()=>{spend(1,5);S.breaking=null;toast(apply({fame:.8,eval:.8,trust:2}));log(`${b.title} — 단계적 보도`);}},
   {label:'현장 기자 대거 증원 + 단독 노리기',sub:'부서원 소모, 단독 가능성',fn:()=>{spend(1,10);S.breaking=null;S.flags.plan=(S.flags.plan||0)-2;if(chance(.3+avg(S.team.map(t=>t.skill))/260)){toast(apply({fame:3.5,eval:2}));tick(`[${OUT().n}] [단독] ${b.title.replace('[속보] ','')} 결정적 장면 확보`,1);}else toast(apply({eval:.4,fame:.4}));}}]);};

// --- 기관·인물·광고주 관계망 ---
// [id, 이름, 종류(gov 기관 · party 정당 · corp 광고주 · person 인물), 분야, 광고 비중(월 광고 매출 중 몫)]
const ENT_BASE={
 pol:[['pres','대통령실','gov',.05],['ruling','한빛당','party',.008],['opp','새길당','party',.006],['nasec','국회사무처','gov',.01],['pr_rul','한빛당 원내대표','person',0],['pr_opp','새길당 대표','person',0],['pr_spk','대통령실 대변인','person',0]],
 eco:[['moef','기획재정부','gov',.03],['fsc','금융위원회·금감원','gov',.02],['ftc','공정거래위원회','gov',.008],['molit','국토교통부','gov',.02],['bok','한국은행','gov',.008],['c0','대성전자','corp',.08],['c4','태산그룹','corp',.09],['c7','한빛은행','corp',.06],['c9','가람자동차','corp',.06],['c1','한결건설','corp',.05],['c2','미래유통','corp',.05],['c3','동방화학','corp',.03],['c5','누리식품','corp',.04],['c6','가람제약','corp',.04],['c8','누리생명','corp',.04],['c10','미르통신','corp',.05],['pr_chair','태산그룹 회장','person',0],['pr_fss','금감원장','person',0]],
 soc:[['pros','대검찰청','gov',0],['police','경찰청','gov',.015],['court','대법원','gov',.004],['moe','교육부','gov',.01],['mohw','보건복지부','gov',.02],['molab','고용노동부','gov',.01],['law','대형 로펌 한결','corp',.02],['hosp','누리대병원','corp',.02],['pr_pros','검찰총장','person',0],['pr_pol','경찰청장','person',0]],
 cul:[['mcst','문화체육관광부','gov',.03],['heritage','국가유산청','gov',.01],['pub','가람출판그룹','corp',.02],['cinema','누리시네마','corp',.03],['ott','스트림원','corp',.03],['pr_dir','거장 감독','person',0]],
 ent:[['ag0','스타라인엔터','corp',.02],['ag1','블루밍엔터','corp',.02],['ag2','하이노트','corp',.015],['ag3','문라이트엔터','corp',.015],['music','음원 플랫폼 뮤직원','corp',.02],['bcast','방송사 예능국','gov',.01],['pr_ent','대형 기획사 대표','person',0],['pr_star','톱스타','person',0],['pr_pd','스타 예능 PD','person',0]],
 spo:[['sport','체육회','gov',.01],['kbo','프로야구연맹','gov',.02],['kfa','축구협회','gov',.015],['brand','누리스포츠','corp',.02],['pr_kfa','축구협회장','person',0],['pr_coach','국가대표 감독','person',0],['pr_ace','에이스 선수','person',0]],
 int:[['mofa','외교부','gov',.008],['mnd','국방부','gov',.01],['mou','통일부','gov',.008],['kita','무역협회','corp',.02],['c11','바다항공','corp',.03],['pr_min','외교부 장관','person',0],['pr_amb','주한 대사','person',0]],
 loc:[['city','광역시·도청','gov',.03],['lcouncil','지방의회','gov',.01],['ledu','시·도 교육청','gov',.01],['lcon','지역 건설협회','corp',.03],['pr_mayor','광역단체장','person',0]]
};
const REGIONS={nambu:['남부','남부광역시','남해건설','남부은행'],sbn:['남부','남부광역시','남해건설','남부은행'],donghae:['동해','동해도','금강토건','동해은행'],honam:['서남','서남도','영산건설','서남은행'],jungwon:['중원','중원도','충원종합건설','중원저축은행'],gyeongin:['경인','경인도','한강개발','경인신협'],seorak:['설악','설악도','설악토건','설악농협'],tamra:['탐라','탐라특별자치도','탐라개발','탐라은행']};
const TYPE_ENT={tv:[['kcc','방송통신위원회','gov',.008],['pr_kcc','방송통신위원장','person',0]],jp:[['kcc','방송통신위원회','gov',.008]],ch:[['kcc','방송통신위원회','gov',.008]],online:[['portal','누리포털','corp',.18]],econ:[['krx','한국거래소','gov',.02],['sec','누리증권','corp',.06],['ir','상장사협의회','corp',.04]],sports:[['team0','가람 타이거즈','corp',.04],['team1','누리 이글스','corp',.03],['team2','한솔 FC','corp',.02]],wire:[['govsub','정부 구독 계약(문체부)','gov',.1]]};
const ID_ENT={jeonja:[['semi','반도체산업협회','corp',.15]],uiyak:[['pharma','제약바이오협회','corp',.15],['hospa','병원협회','corp',.08]],beopjeong:[['bar','변호사협회','corp',.15]],edujournal:[['kfta','교원단체총연합','corp',.06],['acad','대형 학원 그룹','corp',.12]],techreport:[['portal','누리포털','corp',.12]]};
// 광고 금액 표시: 1억 미만은 만 원 단위로
function adAmt(v){return v>=1?`${f1(v)}억`:`${Math.max(50,Math.round(v*10000/10)*10).toLocaleString('ko-KR')}만 원`;}
// ===== 광고주·기관의 가상 재정: 경기(S.econ)와 업황에 따라 기업 실적과 광고 예산이 움직이고, 기관은 해마다 홍보 예산이 정해진다 =====
const ECON_N=e=>e>=1.07?'호황':e>=1.025?'회복세':e<=.93?'불황':e<=.975?'둔화':'보통';
function efOf(id){S.ef=S.ef||{};if(!S.ef[id]){const h=hashId(id,7);S.ef[id]={f:+(.9+(h%200)/1000).toFixed(3),b:1};}return S.ef[id];}
function entB(id){const E=ENT[id];if(!E||!E.w)return 1;return S.ef&&S.ef[id]?S.ef[id].b:1;}
function econ(){return S.econ||1;}
function efTxt(id){const E=ENT[id];if(!E||!E.w)return '';const x=efOf(id);const b=x.b;const bt=b>=1.15?'광고 예산 늘림':b<=.85?'광고 예산 줄임':'광고 예산 보통';
  if(E.kind==='corp'){const f=x.f;return `${f>=1.15?'실적 호조':f<=.8?'실적 부진':f<=.92?'실적 둔화':'실적 보통'} · ${bt}`;}
  if(E.kind==='gov')return `올해 홍보 예산 ${b>=1.08?'증액':b<=.92?'감액':'동결'} · ${bt}`;return bt;}
function entFinMonth(lines){if(!ENTS.length)return;S.ef=S.ef||{};
  // 경기: 천천히 오르내리고, 가끔 충격이 온다
  let e=S.econ||1;const etg=eraEcon();e=etg+(e-etg)*.94+(Math.random()-.5)*.03;if(chance(.012)){const up=chance(.45);e+=up?.06:-.08;S.econT=S.turn;if(lines)lines.push({c:up?'g':'r',t:up?'경기 반등 — 기업들이 광고 예산을 다시 풀기 시작했다':'경기 침체 신호 — 기업들이 광고·마케팅 예산부터 줄인다'});tick(up?'수출 호조에 경기 반등 기대감':'경기 침체 우려…기업들 광고비 동결');}
  S.econ=+clamp(e,.85,1.15).toFixed(3);const yr=month()===1;const news=[];
  ENTS.forEach(([id,n,kind,c,w])=>{if(!w)return;const x=efOf(id);
    if(kind==='corp'){x.f=+clamp(1+(x.f-1)*.9+(S.econ-1)*.45+(Math.random()-.5)*.08,.4,1.8).toFixed(3);
      if(chance(.01)){const up=chance(.5);x.f=+clamp(x.f+(up?.25:-.3),.4,1.8).toFixed(3);news.push([w,up?`${n}, 사상 최대 실적…마케팅 예산 확대`:`${n}, 실적 쇼크…광고·마케팅비 대폭 삭감`,up,id]);}
      x.b=+clamp(x.b+(clamp(.55+.45*x.f,.4,1.7)*(.7+.3*S.econ/1)-x.b)*.25,.4,1.7).toFixed(3);}
    else if(kind==='gov'){if(yr||x.y==null){x.y=1;x.b=+clamp(1+(Math.random()-.5)*.2+(1-S.econ)*.25,.75,1.3).toFixed(3);}}
    else{if(yr||x.y==null){x.y=1;x.b=+clamp(.85+Math.random()*.4,.6,1.4).toFixed(3);}}});
  // 우리 광고주에게 큰 변화가 생기면 알려 준다
  news.sort((a,b)=>b[0]-a[0]).slice(0,2).forEach(([w,t,up,id])=>{tick(t);const rel=S.net&&S.net[id];if(lines&&w>=.01&&rel&&!rel.cut)lines.push({c:up?'g':'r',t:`광고주 소식: ${t}`});});
  if(yr&&lines)lines.push({c:'',t:`새해 기관 홍보 예산이 정해졌다 · 경기 ${ECON_N(S.econ)}`});}
function adLine(E){if(E.w){const p=entCad(E.id)||1;const w=adShareOf(E.id),k=entAdK(E.id);return `광고 ${AD_CAD[p]} ${adAmt(OUT().ad*w*p*k)} (연 ${adAmt(OUT().ad*w*12*k)} · 우리 광고의 ${(w*100).toFixed(w<.01?1:0)}%)${k<.95?` · 관계·신규 거래로 ${Math.round(k*100)}%만 집행`:''} · 다음 집행 ${entNextTxt(E.id)}${efTxt(E.id)?` · ${efTxt(E.id)}`:''}`;}return {person:'개인 — 광고 없음',party:'선거 때만 광고',gov:'광고 집행 없음 (수사·사법·감독 기관)',corp:'광고 거래 없음'}[E.kind]||'광고 없음';}
function buildEnts(o){
  const cats=new Set(['pol']);o.depts.forEach(d=>catOf(d).forEach(c=>cats.add(c)));
  const out=[];const seen=new Set();const add=(e,c)=>{if(seen.has(e[0]))return;seen.add(e[0]);out.push([e[0],e[1],e[2],c,e[3]]);};
  cats.forEach(c=>{if(c==='loc'&&REGIONS[o.id]){const g=REGIONS[o.id];[['city',`${g[1]}청`,'gov',.08],['lcouncil',`${g[1]}의회`,'gov',.01],['ledu',`${g[1]}교육청`,'gov',.02],['lcon',g[2],'corp',.1],['lbank',g[3],'corp',.07],['luniv',`${g[0]}대학교`,'corp',.03],['lchamber',`${g[0]} 상공회의소`,'corp',.03],['pr_mayor',`${g[1]} 단체장`,'person',0],['pr_mp',`${g[0]} 지역구 의원`,'person',0],['pr_boss',`${g[0]} 상공회의소 회장`,'person',0]].forEach(e=>add(e,'loc'));}
    else (ENT_BASE[c]||[]).forEach(e=>add(e,c));});
  if(!cats.has('eco'))ENT_BASE.eco.filter(e=>e[2]==='corp').slice(0,6).forEach(e=>add(e,'eco'));
  try{deptEntsFor(o).forEach(e=>{if(!seen.has(e[0])){seen.add(e[0]);out.push(e);}});}catch(x){}
  (TYPE_ENT[o.type]||[]).forEach(e=>add(e,o.type==='econ'?'eco':o.type==='sports'?'spo':'pol'));
  (ID_ENT[o.id]||[]).forEach(e=>add(e,catOf(o.depts[0])[0]));
  if(REGIONS[o.id])out.forEach(e=>{if(e[2]==='corp'&&e[3]!=='loc')e[4]=+(e[4]*.4).toFixed(3);});
  return normEnts(out,o);
}
// 이름 있는 기관·광고주를 다 합쳐도 광고 매출의 35% 정도 (나머지는 중소 광고주·지역 상인·온라인 광고망)
// 1.0 광고주가 많은 매체는 이름 있는 광고주 몫의 상한을 완만하게 올려, 큰 광고주 한 곳의 규모가 줄지 않게 한다 (전체 광고 매출은 adNk가 맞춘다)
function normEnts(L,o){const t=L.reduce((a,e)=>a+(e[4]||0),0);const CAP=clamp(.35*Math.pow(Math.max(1,t/1.8),.9),.35,.55);if(t>CAP){const k=CAP/t;L.forEach(e=>{if(e[4])e[4]=Math.max(.001,+(e[4]*k).toFixed(4));});}
  // 광고는 한 곳당 최소 월 50만 원
  const ad=(o&&o.ad)||(S&&S.outlet&&OUT()?OUT().ad:1);const nW=L.filter(e=>e[4]).length||1;const mw=Math.min(.005/Math.max(.05,ad),.1/nW);L.forEach(e=>{if(e[4]&&e[4]<mw)e[4]=+mw.toFixed(4);});
  // 작은 매체는 광고주가 많으면 하한 때문에 합이 부풀 수 있다 → 다시 35% 안으로 (1.0)
  const t2=L.reduce((a,e)=>a+(e[4]||0),0);if(t2>CAP+.03){const k2=(CAP+.01)/t2;L.forEach(e=>{if(e[4])e[4]=Math.max(.0005,+(e[4]*k2).toFixed(4));});}return L;}
let ENTS=[],ENT={};
function setEnts(list){ENTS=list||[];ENT={};ENTS.forEach(([id,n,kind,c,w])=>ENT[id]={id,n,kind,c,w});}
const ENT_INFO={
 pres:['국정 운영의 컨트롤타워. 비판 기사엔 민감하고, 우호 매체엔 단독을 흘리기도 한다','폐쇄적 · 정부 광고 영향력'],
 ruling:['집권 여당(게임 속 가상 정당). 성장·안보를 앞세운다','보수 성향 · 언론 길들이기 시도'],opp:['제1야당(게임 속 가상 정당). 분배·노동을 앞세운다','진보 성향 · 정부 비판 기사를 반긴다'],
 nasec:['국회 행정 지원 조직. 특활비·출장 자료를 쥐고 있다','폐쇄적'],pr_rul:['여당 원내 사령탑. 협상 뒷이야기를 쥐고 있다','언론 친화적'],pr_opp:['야당 대표. 기자회견을 즐긴다','개방적 · 소송을 즐긴다'],pr_spk:['대통령실의 입. 백브리핑의 핵심','신중함'],
 moef:['예산과 세제를 쥔 부처','신중함 · 정부 광고 영향력'],fsc:['금융 감독 당국. 제재 정보가 나온다','폐쇄적'],ftc:['기업 불공정 행위를 조사한다','개방적'],molit:['집값·교통 정책 부처','신중함'],bok:['기준금리를 정한다','매우 폐쇄적'],
 c0:['국내 1위 전자 기업. 최대 광고주 중 하나','광고로 압박 · 소송 잦음'],c1:['대형 건설사','광고로 압박'],c2:['유통 대기업','광고 많음'],c3:['석유화학 기업','소송 잦음'],c4:['재계 서열 상위 그룹. 회장 일가 이슈가 많다','광고로 압박 · 소송 잦음'],c5:['식품 대기업','광고 많음'],c6:['제약사','신중함'],c7:['시중은행','광고 많음'],c8:['생명보험사','광고 많음'],c9:['완성차 업체. 스포츠 구단 모기업','광고로 압박'],c10:['이동통신사','광고 많음'],c11:['국적 항공사','신중함'],
 pr_chair:['그룹 총수. 비자금·승계 의혹의 중심','소송을 즐긴다'],pr_fss:['금융 감독 수장','언론 친화적'],
 pros:['수사 정보의 원천. 단독의 보고지만 흘리는 정보엔 의도가 있다','폐쇄적 · 정보 흘리기'],police:['사건 정보의 1차 원천','개방적'],court:['판결과 재판 일정','매우 폐쇄적'],moe:['입시·학교 정책','신중함'],mohw:['의료·복지 정책','신중함'],molab:['노동·산재 감독','개방적'],law:['대형 로펌. 기업 소송 대리인','소송을 즐긴다'],hosp:['대형 대학병원','신중함'],pr_pros:['검찰 수장','폐쇄적'],pr_pol:['경찰 수장','언론 친화적'],
 mcst:['문화·체육·관광 정책과 정부 광고','정부 광고 영향력'],heritage:['문화재 관리','신중함'],pub:['대형 출판 그룹','광고 적음'],cinema:['멀티플렉스 극장 체인','광고 많음'],ott:['OTT 플랫폼','광고 많음'],pr_dir:['거장 영화감독. 인터뷰가 귀하다','폐쇄적'],
 ag0:['대형 기획사. 소속 스타 단독의 열쇠','개방적 · 협찬 많음'],ag1:['신흥 기획사','개방적'],ag2:['음악 중심 레이블','신중함'],ag3:['배우 중심 기획사','소송 잦음'],music:['음원 플랫폼','광고 많음'],bcast:['방송사 예능국. 섭외·편집 정보','폐쇄적'],pr_ent:['업계 거물 기획사 대표','소송을 즐긴다'],pr_star:['톱스타. 인터뷰 하나로 포털 1위','매우 폐쇄적'],pr_pd:['스타 예능 PD','개방적'],
 sport:['체육 행정 총괄','폐쇄적'],kbo:['프로야구 리그 사무국','신중함'],kfa:['축구협회. 감독 선임 논란이 잦다','폐쇄적'],brand:['스포츠 브랜드','광고 많음'],pr_kfa:['축구협회장','소송을 즐긴다'],pr_coach:['국가대표 감독','신중함'],pr_ace:['에이스 선수. 인터뷰 하나가 기사','폐쇄적'],
 mofa:['외교 정책','신중함'],mnd:['국방 정책','매우 폐쇄적'],mou:['대북 정책','신중함'],kita:['무역 업계 단체','광고 적음'],pr_min:['외교 수장','신중함'],pr_amb:['주한 외국 대사','개방적'],
 city:['광역 지자체. 지역 광고의 큰손','정부 광고 영향력'],lcouncil:['지방의회','개방적'],ledu:['교육청','신중함'],lcon:['지역 건설업계. 지역지 최대 광고주','광고로 압박'],lbank:['지역 금융사','광고 많음'],luniv:['지역 대학','광고 적음'],lchamber:['지역 상공회의소','광고 많음'],pr_mayor:['광역단체장','소송을 즐긴다'],pr_mp:['지역구 국회의원','언론 친화적'],pr_boss:['지역 재계의 좌장','광고로 압박'],
 kcc:['방송 인허가·심의 기관','매우 폐쇄적'],pr_kcc:['방송 규제 수장','신중함'],portal:['국내 최대 포털. 트래픽과 제휴의 열쇠','광고 많음 · 제휴 심사 권한'],krx:['증시 운영 기관','신중함'],sec:['증권사','광고 많음'],ir:['상장사 단체','광고 많음'],
 team0:['프로야구단','광고 적음'],team1:['프로야구단','광고 적음'],team2:['프로축구단','광고 적음'],govsub:['통신사 정부 구독 계약','정부 광고 영향력'],
 semi:['반도체 업계 단체','광고 많음'],pharma:['제약 업계 단체','광고 많음'],hospa:['병원 단체','신중함'],bar:['변호사 단체','소송을 즐긴다'],kfta:['교원 단체','개방적'],acad:['학원 그룹','광고로 압박']
};
function entInfo(id){return ENT_INFO[id]||[ENT[id]?`${ENT[id].n}`:'', '신중함'];}
function entTrait(id){const t=entInfo(id)[1];return{closed:/폐쇄/.test(t),very:/매우 폐쇄/.test(t),open:/개방|친화/.test(t),lit:/소송/.test(t),press:/압박/.test(t)};}
function knowInit(){const mc=catOf(S.dept);ENTS.forEach(([id,n,kind,c])=>{const e=S.net[id];if(!e)return;e.known=false;
  if(kind==='gov'&&mc.includes(c))e.known=true;
  if(S.rank>=1&&kind==='corp'&&mc.includes(c)&&chance(S.rank>=2?.85:.55))e.known=true;
  if(S.rank>=1&&kind==='person'&&mc.includes(c)&&chance(.5))e.known=true;
  if(S.rank>=1&&kind==='party'&&(mc.includes('pol')||mc.includes('loc')))e.known=true;
  if(S.rank>=3&&mc.includes(c)&&kind!=='person')e.known=true;
  if(S.rank>=4&&(kind==='gov'||kind==='party'))e.known=true;
  if(S.rank>=5&&kind==='corp'&&ENT[id].w>=.04)e.known=true;
  if(S.rank>=6)e.known=true;});
  // 광고국을 통해 회사 큰 광고주 두세 곳은 안다
  if(S.rank>=1){ENTS.filter(e=>e[2]==='corp'&&e[4]).sort((a,b)=>b[4]-a[4]).slice(0,S.rank>=2?3:2).forEach(e=>{if(S.net[e[0]])S.net[e[0]].known=true;});}
  const k=ENTS.filter(e=>S.net[e[0]].known);if(!k.length&&ENTS.length){const g=catDefault(mc[0]);if(S.net[g])S.net[g].known=true;}}
function knowMore(){const mc=catOf(S.dept);let n=0;ENTS.forEach(([id,nm,kind,c])=>{const e=S.net[id];if(!e||e.known)return;let ok=false;
  if(kind==='gov'&&mc.includes(c))ok=true;if(S.rank>=1&&kind==='party'&&(mc.includes('pol')||mc.includes('loc')))ok=true;if(S.rank>=1&&(kind==='corp'||kind==='person')&&mc.includes(c)&&(S.rank>=2&&kind==='corp'||hashId(id,5)%100<55))ok=true;if(S.rank>=3&&mc.includes(c)&&kind!=='person')ok=true;if(S.rank>=4&&(kind==='gov'||kind==='party'))ok=true;if(S.rank>=5&&kind==='corp'&&ENT[id].w>=.04)ok=true;if(S.rank>=6)ok=true;
  if(ok){e.known=true;n++;}});if(S.rank>=1)ENTS.filter(e=>e[2]==='corp'&&e[4]).sort((a,b)=>b[4]-a[4]).slice(0,S.rank>=2?3:2).forEach(e=>{const x=S.net[e[0]];if(x&&!x.known){x.known=true;n++;}});return n;}
function knownList(){return ENTS.filter(e=>S.net&&S.net[e[0]]&&S.net[e[0]].known).map(e=>e[0]);}
function meetChance(id){const E=ENT[id],tr=entTrait(id);let p=E.kind==='gov'?.45:E.kind==='party'?.4:E.kind==='corp'?.35:.12;
  p+=S.st.net/250+S.st.cha/400+S.rank*.03;if(E.kind==='person'){const inst=ENTS.find(x=>x[3]===E.c&&x[2]!=='person'&&S.net[x[0]]&&S.net[x[0]].known&&S.net[x[0]].rel>=40);if(inst)p+=.2;if(S.rank>=4)p+=.15;}
  if(tr.closed)p*=.7;if(tr.very)p*=.6;if(tr.open)p*=1.2;return clamp(p,.03,.85);}
function personGate(id){const E=ENT[id];if(E.kind!=='person')return '';if(S.rank>=3)return '';const inst=ENTS.find(x=>x[3]===E.c&&x[2]!=='person'&&S.net[x[0]]&&S.net[x[0]].known&&S.net[x[0]].rel>=40);return inst?'':'부장 이상이거나, 같은 분야 기관과 관계 40 이상일 때 소개받을 수 있다';}
const KIND_N={gov:'정부·기관',party:'정당',corp:'광고주',person:'인물'};
const ENT_KEY=[['기획사','ag0'],['엔터','ag0'],['음원','music'],['예능','bcast'],['오디션','bcast'],['방송사','bcast'],['시상식','bcast'],['OTT','ott'],['극장','cinema'],['스크린','cinema'],['출판','pub'],['베스트셀러','pub'],['로펌','law'],['노동','molab'],['근로자','molab'],['포털','portal'],['거래소','krx'],['상장','krx'],['공모가','krx'],['구단','team0'],['방송통신','kcc'],['병원','hosp'],['학원','acad'],['검찰','pros'],['법원','court'],['판결','court'],['경찰','police'],['유치장','police'],['대통령실','pres'],['비서관','pres'],['한빛당','ruling'],['새길당','opp'],['공정위','ftc'],['담합','ftc'],['금감원','fsc'],['금융','fsc'],['코인','fsc'],['국토','molit'],['전세','molit'],['부동산','molit'],['기재부','moef'],['예산','moef'],['교육','moe'],['수능','moe'],['학교','moe'],['사학','moe'],['복지','mohw'],['요양','mohw'],['응급','mohw'],['산재','mohw'],['근로복지','mohw'],['문화재','mcst'],['미술관','mcst'],['국립극단','mcst'],['축제','mcst'],['외교','mofa'],['교민','mofa'],['비자','mofa'],['정상회담','mofa'],['대북','mnd'],['협회','sport'],['연맹','sport'],['체육회','sport'],['국가대표','sport'],['시청','city'],['시장','city'],['시의','city'],['도청','city'],['군청','city'],['의회','city']];
function catDefault(c){const g=ENTS.find(e=>e[3]===c&&e[2]==='gov')||ENTS.find(e=>e[3]===c)||ENTS.find(e=>e[0]==='pres')||ENTS[0];return g?g[0]:'pres';}
function findEnt(title,subj,d){
  if(!ENTS.length)return 'pres';
  for(const e of ENTS)if((e[2]==='corp'||e[2]==='party')&&(title.includes(e[1])||subj.includes(e[1])))return e[0];
  const ag=AGENCIES.findIndex(a=>title.includes(a)||subj.includes(a));if(ag>=0&&ENT['ag'+ag])return 'ag'+ag;
  const tm=TEAMS.findIndex(a=>title.includes(a)||subj.includes(a));if(tm>=0&&ENT['team'+Math.min(tm,2)])return 'team'+Math.min(tm,2);
  const txt=title+' '+subj;{const tx=txt.replace(/시청률|시청자/g,'');for(const [k,id] of ENT_KEY)if(tx.includes(k)&&ENT[id])return id;}
  return catDefault(d);
}
function initNet(old){
  const o=OUT();const net={};S.ents=buildEnts(o);setEnts(S.ents);
  const lb={cons:{ruling:15,opp:-10,corp:4},prog:{opp:15,ruling:-10,corp:-6,molab:8},market:{corp:10,fsc:5,moef:5},neu:{}}[o.lean]||{};
  ENTS.forEach(([id,n,kind])=>{const tr0=entTrait(id);// 6.8 첫 관계: 매체 규모만큼 대접받고(큰 매체는 기관·기업이 먼저 챙긴다), 인물은 경계한다. 논조·지역 연고가 더해진다
    const base=clamp((tr0.very?-5:0)+R(0,12)+(o.p-3)*3+({gov:4,corp:3,party:1,person:-3}[kind]||0)+(lb[id]||0)+(kind==='corp'?(lb.corp||0):0)+(REGIONS[o.id]&&['city','lcouncil','lcon','lbank','pr_mayor','pr_mp','pr_boss'].includes(id)?10:0),-20,35);const prev=old&&old[id];const same=prev&&prev.who&&prev.nm===n;net[id]={rel:prev?Math.round(base+(prev.rel-base)*.5):base,cut:0,block:0,who:kind==='person'?(same?prev.who:rname()):null,nm:n,known:false};if(same){net[id].tEnd=prev.tEnd;net[id].tN=prev.tN;}});
  S.net=net;knowInit();if(!S.founder&&S.rank>=1)ENTS.forEach(([id])=>{const e=S.net[id];if(e&&e.known&&!(old&&old[id]))e.rel=Math.min(45,e.rel+Math.min(12,S.rank*3));});if(old)ENTS.forEach(([id])=>{if(old[id]&&old[id].known&&ENT[id]&&ENT[id].kind==='person'&&chance(.5))S.net[id].known=true;});
}
const entName=id=>{const e=ENT[id];if(!e)return '관계 기관';const st=S.net&&S.net[id];return e.kind==='person'&&st&&st.who?`${e.n} ${st.who}`:e.n;};
const netRel=id=>(S.net&&S.net[id])?S.net[id].rel:0;
// 5.7 아이템이 어느 기관·업체 이야기인지, 그쪽과 내 관계
function itEnt(it){const id=it&&it.ent;if(!id||!ENT[id])return null;const e=S.net&&S.net[id];return {id,n:entName(id),k:({gov:'정부·기관',party:'정당',corp:'기업',person:'인물'})[ENT[id].kind]||'',rel:e?Math.round(e.rel):0,known:!!(e&&e.known),block:!!(e&&e.block),cut:!!(e&&e.cut),ad:!!ENT[id].w};}
function itEntTxt(it){const x=itEnt(it);if(!x)return '';return ` · 상대 ${x.n} ${x.known?`관계 ${x.rel}`:'연줄 없음'}${x.block?' · 자료 거부':''}`;}
function itEntHTML(it){const x=itEnt(it);if(!x)return '';return `<div class="itent"><span class="ie-l">상대</span><b>${esc(x.n)}</b><small>${esc(x.k)}${x.ad?' · 광고주':''}</small>${x.known?relPill(x.rel)+`<small>${relLabel(x.rel)}</small>`:'<small>연줄 없음 · 대외관계에서 뚫을 수 있다</small>'}${x.block?'<span class="tag">자료 거부 중</span>':''}${x.cut?'<span class="tag">광고 끊음</span>':''}</div>`;}
function netUp(id,v){if(!S.net||!S.net[id])return;const tr=entTrait(id);if(v>0){if(tr.closed)v*=.7;if(tr.open)v*=1.25;const r0=S.net[id].rel;if(r0>50)v*=Math.max(.15,(100-r0)/50);}S.net[id].rel=clamp(S.net[id].rel+v,-100,100);}
const corpId=name=>(ENTS.find(e=>e[2]==='corp'&&e[1]===name)||[])[0];
// 보도 후 관계 변화
function entHit(it,W,imp){
  if(it.pos)return posEntHit(it,W,imp);const id=it.ent,e=S.net&&S.net[id];if(!e)return '';const E=ENT[id];
  let d=Math.min(18,imp/5*(it.excl?1.2:1)*(W.rb&&it.rebut==='got'?.6:1)*(W.head==='bait'?1.3:1)*(W.head==='calm'?.7:1)*(W.adTone==='soft'?.4:W.adTone==='hard'?1.15:1));
  if(!CRIT_RE.test(it.title||''))d*=.5;e.rel=clamp(e.rel-d,-100,100);const wasKnown=e.known;e.known=true;const out=[`${jo2(entName(id),'과','와')}의 관계 -${Math.round(d)}${wasKnown?'':' (이 일로 상대가 나를 알게 됐다)'}`];
  if(id==='c4')netUp('pr_chair',-d*.6);try{arcStart(id,d,W.headline);}catch(x){}
  if(E.kind==='corp'&&e.rel<=-25&&!e.cut){e.cut=R(8,20);out.push(`${E.n} 홍보실이 광고 집행 중단을 통보했다 (${wkTxt(e.cut)}, 월 -${adAmt(OUT().ad*adShareOf(id))})`);log(`${E.n} 광고 중단 통보`);tick(`${E.n}, ${OUT().n}에 광고 집행 중단`);}
  if(E.kind==='gov'&&e.rel<=-45&&!e.block){e.block=R(4,8);out.push(`${jo2(E.n,'이','가')} 우리 매체에 자료 제공을 거부하기 시작했다 (${wkTxt(e.block)})`);log(`${E.n} 자료 제공 거부`);}
  if(E.kind==='gov'&&E.w>0&&e.rel<=-50&&!e.govcut){e.govcut=1;out.push(`${E.n} 정부 광고 배정이 줄었다`);}
  if((E.kind==='person'||entTrait(id).lit)&&e.rel<=-50&&chance(entTrait(id).lit?.6:.35))S.pending.push({type:'suit',ent:id,due:S.turn+R(2,5),title:W.headline});
  return out.join(' · ');
}
function netAdAdj(){
  if(!S.net)return{loss:0,gain:0,list:[]};const o=OUT();let loss=0,gain=0;const list=[];
  ENTS.forEach(([id,n,kind,c,w])=>{if(!w)return;const e=S.net[id];
    if(e.cut>0){loss+=o.ad*w;list.push(`${n} 광고 중단 (${wkTxt(e.cut)} 남음)`);}
    else if(e.rel<=-50){loss+=o.ad*w*.4;list.push(`${n} 광고 축소`);}
    else if(e.rel>=60){const rp=entRamp(id);gain+=o.ad*w*.35*rp;list.push(`${n} 광고 확대${rp<1?' (신설 부서 — 천천히 붙는 중)':''}`);}});
  return{loss,gain,list};
}
function netWeek(lines){
  if(!S.net)return;
  ENTS.forEach(([id,n,kind])=>{const e=S.net[id];
    if(e.cut>0){e.cut--;if(!e.cut){e.rel=Math.max(e.rel,-15);lines.push({c:'g',t:`${n} 광고가 재개됐다.`});}}
    if(e.block>0){e.block--;if(!e.block)lines.push({c:'g',t:`${n} 자료 제공이 정상화됐다.`});}
    e.rel+=(0-e.rel)*.01;});
  if(S.turn%4===0&&S.tkM!==S.turn){S.tkM=S.turn;try{termTick(lines);}catch(x){console.error(x);}}
}
function govEntFor(cat){return catDefault(cat);}
RUN.network=function(){netGroup();};
RUN.networkOld=function(){
  const mc=catOf(S.dept);
  let ids=knownList().sort((a,b)=>(catOf(S.dept).includes(ENT[b].c))-(catOf(S.dept).includes(ENT[a].c))||Math.abs(netRel(b))-Math.abs(netRel(a))).slice(0,9);
  const unknown=ENTS.filter(e=>S.net[e[0]]&&!S.net[e[0]].known).length;
  openModal('대외 관계',`<p>아는 곳 ${knownList().length}곳 · 아직 연줄이 없는 곳 ${unknown}곳. 처음엔 출입처 기관 정도만 안다. 직급이 오르고 연줄을 뚫을수록 넓어진다.</p>`,[{label:'여러 곳 한꺼번에 챙기기 (최대 4곳)',sub:'인사 돌기·간담회 · 한 곳당 효과는 작다',disabled:knownList().length<2,fn:()=>{netGroup();return false;}},{label:'새 연줄 뚫기',sub:`모르는 기관·광고주·인물 ${unknown}곳 중 골라 접촉한다`,disabled:!unknown,fn:()=>{netDiscover();return false;}}].concat(ids.map(id=>{const e=S.net[id],E=ENT[id];return{label:`${entName(id)}`,sub:`${KIND_N[E.kind]} · ${entInfo(id)[1]} · ${relLabel(e.rel)} ${Math.round(e.rel)}${e.cut?` · 광고 중단 ${wkTxt(e.cut)}`:''}${e.block?` · 자료 거부 ${wkTxt(e.block)}`:''}· ${adLine(E)}`,fn:()=>{netTalk(id);return false;}};})).concat([{label:'취소',cls:'ghost'}]));
};
// 여러 기관·광고주·인물을 골라 한 번에 챙긴다: 한 곳당 관계는 1:1보다 덜 오르지만, 간담회에선 소식·광고가 하나쯤 따라올 수 있다
function netGroup(){const mc=catOf(S.dept),MAX=4;const nk=NET_SORT[S.netSort]?S.netSort:'rec';const list=netSorted(knownList(),nk).slice(0,60);const unknown=ENTS.filter(e=>S.net[e[0]]&&!S.net[e[0]].known).length;
  const sel=()=>[...document.querySelectorAll('#mb input[data-ng]:checked')].map(x=>list[+x.dataset.ng]).filter(Boolean);
  const run=kind=>()=>{const L=sel();if(!L.length){toast('먼저 챙길 곳을 골라 주세요');return false;}if(L.length>MAX){toast(`${MAX}곳까지 고를 수 있다`);return false;}
    const big=kind==='meet';spend(1,big?8:3);setCd('network');if(big)S.money-=2*L.length;
    const gf=GF[L.length];const out=L.map(id=>{netUp(id,gf*(big?7+S.st.net/18:3+S.st.net/30));return `${entName(id)} · ${relLabel(S.net[id].rel)} ${Math.round(S.net[id].rel)}`;});gain('net',big?.5:.3);let extra='';
    if(big){const b=L.slice().sort((x,y)=>netRel(y)-netRel(x))[0],E=ENT[b],r=netRel(b);
      if(E.kind==='corp'&&r>=30&&!S.net[b].cut&&S.rank>=2&&chance(.25+r/400)){S.co.adB+=.015;S.co.cash+=OUT().ad*E.w*.3;extra=`<p>${E.n} 홍보 담당: "다음 분기 집행 때 한 번 더 챙겨 보겠습니다."</p>`;}
      else if(E.kind!=='corp'&&r>=35&&chance(.18+r/500)){const it=makeItem(E.c,{excl:chance(.5),pre:1});it.ent=b;if(S.rank<=3){S.items.push(it);extra=`<p>자리가 끝날 무렵 ${entName(b)} 쪽에서 귀띔이 왔다 → 「${esc(it.title)}」</p>`;}else{S.co.q+=1;extra=`<p>${entName(b)} 쪽 귀띔을 해당 부서에 넘겼다.</p>`;}}}
    openModal(big?'간담회':'인사 돌기',`<p class="lede">${big?`${L.map(entName).join('·')} 쪽 사람들과 ${L.length>1?'한자리에 모였다.':'마주 앉았다.'}`:'명절 인사 겸 출입처와 홍보실을 한 바퀴 돌았다.'}</p><ul class="feed">${out.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>${extra}`);return false;};
  openModal('대외 관계',`<p>챙길 곳을 1~${MAX}곳 고른다. 여럿을 함께 챙기면 한 곳당 효과는 줄지만 합치면 더 크다. 한 곳만 고르면 그곳만의 깊은 선택지(인터뷰·광고 부탁 등)가 열린다. 아는 곳 ${knownList().length}곳 · 연줄 없는 곳 ${unknown}곳.</p>${list.length>4?sortChips(NET_SORT,nk,'data-ns'):''}<p class="pcount" id="gsel"></p>${list.map((id,i)=>{const e=S.net[id];return `<label class="chk"><input type="checkbox" data-ng="${i}"><span><b>${esc(entName(id))}</b> · ${KIND_N[ENT[id].kind]}<small>${relLabel(e.rel)} ${Math.round(e.rel)}${e.cut?` · 광고 중단 ${wkTxt(e.cut)}`:''}${e.block?` · 자료 거부 ${wkTxt(e.block)}`:''}</small></span></label>`;}).join('')}`,[
   {label:'1:1로 깊게 만난다',sub:'한 곳만 골랐을 때 · 인터뷰 요청·광고 부탁 같은 그곳만의 선택지',fn:()=>{const L=sel();if(L.length!==1){toast('한 곳만 골라 주세요');return false;}netTalk(L[0]);return false;}},
   {label:'간담회 자리',sub:'체력 -8 · 한 곳당 통장 -2만 · 관계↑ · 소식이나 광고가 따라올 수 있다',fn:run('meet')},
   {label:'인사 돌기',sub:'체력 조금 · 관계 조금↑',fn:run('call')},
   {label:'새 연줄 뚫기',sub:`모르는 기관·광고주·인물 ${unknown}곳 중 골라 접촉한다`,disabled:!unknown,fn:()=>{netDiscover();return false;}},
   {label:'취소',cls:'ghost'}]);grpBind('data-ng',MAX,'곳');grpSortBind('data-ns','data-ng',list,netGroup,'netSort');}
function netDiscover(){const mc=catOf(S.dept);const cand=ENTS.filter(e=>S.net[e[0]]&&!S.net[e[0]].known).sort((a,b)=>(mc.includes(b[3]))-(mc.includes(a[3]))||(b[2]!=='person')-(a[2]!=='person')).slice(0,8);
  openModal('새 연줄 뚫기','<p>소개를 부탁하고 명함을 돌린다. 기관보다 광고주가, 광고주보다 인물이 어렵다. 장관·협회장·회장 같은 거물은 직급과 소개가 있어야 닿는다.</p>',cand.map(([id,n,kind,c])=>{const gate=personGate(id);const p=meetChance(id);return{label:`${n} (${KIND_N[kind]})`,sub:gate||`${DEPTS[c]?DEPTS[c].n:''} · ${entInfo(id)[0]} · 성공 ${pct(p)}`,disabled:!!gate,fn:()=>{spend(1,4);setCd('network');S.money-=5;if(chance(p)){S.net[id].known=true;netUp(id,5);gain('net',.5);log(`새 연줄: ${entName(id)}`);openModal('연줄이 닿았다',`<p class="lede">${entName(id)} 쪽과 처음 마주 앉았다. ${entInfo(id)[0]}.</p><p>성향: ${entInfo(id)[1]}</p>`);}else{gain('net',.2);openModal('닿지 않았다',`<p class="lede">${pick(['비서실에서 "일정이 꽉 찼다"고 했다.','소개해 주기로 한 사람이 연락을 끊었다.','명함만 전하고 돌아섰다.'])}</p>`);}return false;}};}).concat([{label:'뒤로',cls:'ghost',fn:()=>{RUN.network();return false;}}]));}
function netTalk(id){
  const e=S.net[id],E=ENT[id],nm=entName(id);
  const done=(v,fx,line,extra)=>{spend(1,fx.hp?0:3);setCd('network');netUp(id,v);const t=apply(fx);if(extra)extra();openModal(nm,`<p class="lede">${line}</p><p>관계: ${relLabel(S.net[id].rel)} (${Math.round(S.net[id].rel)})</p>${fxLine(t)}`);return false;};
  const opts=[];
  if(E.kind==='gov'||E.kind==='party'){
    opts.push({label:'관계자와 차담',sub:'통장 -3만, 관계↑',fn:()=>done(6+S.st.net/15,{money:-3},pick([`${E.n} 관계자: "요즘 분위기 아시잖아요. 저희도 힘들어요."`,'공식 브리핑에선 안 나오는 맥락을 들었다.','"다음엔 미리 연락 드릴게요."']))});
    opts.push({label:'단독 인터뷰를 요청한다',sub:'관계가 좋을수록 성사',fn:()=>{if(chance(.2+e.rel/150)){const it=makeItem(E.c,{excl:true,keyConf:true});it.ent=id;S.items.push(it);return done(4,{fame:1,eval:.6},`인터뷰가 잡혔다. 녹취 속 한마디가 기사가 된다 → 「${esc(it.title)}」`);}return done(1,{},'"지금은 때가 아닙니다." 정중한 거절.');}});
    if(e.rel<0)opts.push({label:'해명을 끝까지 들어 준다',sub:'관계 크게↑, 신뢰도 조금↓',fn:()=>done(14,{trust:-1},'한 시간 동안 해명을 들었다. 기사로 쓸지는 내가 정한다.')});
  }else if(E.kind==='corp'){
    opts.push({label:'홍보실과 점심',sub:'관계↑',fn:()=>done(8,{money:-3},pick(['"요즘 광고 시장이 말이 아니에요."','"그 기사는 좀 아팠습니다." 웃으며 말했지만 눈은 웃지 않았다.','"신제품 나오면 제일 먼저 알려 드릴게요."']))});
    if(S.rank>=2)opts.push({label:'광고 확대를 부탁한다',sub:'관계 30 이상이면 성사 가능, 신뢰도↓',fn:()=>{if(e.rel>=30&&chance(.35+e.rel/200)){S.co.adB+=.04;S.co.cash+=OUT().ad*E.w*.8;return done(-2,{trust:-1,eval:1},`${E.n}: "이번 분기는 늘려 드리죠. 대신 신제품 기사는 크게 부탁해요."`);}return done(-3,{},`${E.n}: "윗선에서 요즘 언론 광고를 줄이라고 해서요."`);}});
    opts.push({label:'경영진 인터뷰 기사를 제안한다',sub:'관계 크게↑, 신뢰도↓ (띄워주기 논란)',fn:()=>done(15,{trust:-2.5,eval:.4},`${E.n} 경영진 인터뷰가 섹션 한 면을 채웠다. 사진은 그쪽이 고른 것으로 실렸다.`)});
  }else{
    opts.push({label:'식사 자리를 만든다',sub:'체력 -6, 관계↑',fn:()=>done(8,{hp:-6,money:-5},pick([`${nm}: "기자님들은 다 똑같은 줄 알았는데."`,'긴장이 풀리자 사적인 이야기가 나왔다.','"오늘 얘기는 없던 걸로 합시다." 그래도 맥락은 얻었다.']))});
    opts.push({label:'독점 인터뷰를 요청한다',sub:'관계 40 이상이면 성사 가능',fn:()=>{if(e.rel>=40&&chance(.5+e.rel/250)){const it=makeItem(E.c,{excl:true,keyConf:true,mult:1.2});it.ent=id;S.items.push(it);return done(5,{fame:1.5},`${nm} 독점 인터뷰가 잡혔다 → 「${esc(it.title)}」`);}return done(1,{},`${nm} 측: "검토해 보겠습니다." 답이 없다.`);}});
  }
  openModal(nm,`<p class="lede">${KIND_N[E.kind]} · 지금 관계 <b>${relLabel(e.rel)}</b> (${Math.round(e.rel)})</p><p>${entInfo(id)[0]}.<br><span class="hint">성향: ${entInfo(id)[1]}· ${adLine(E)}</span></p>${e.cut?`<p class="warn">광고 집행 중단 중 (${wkTxt(e.cut)} 남음)</p>`:''}${e.block?`<p class="warn">우리 매체에 자료 제공을 거부하는 중 (${wkTxt(e.block)} 남음)</p>`:''}<p class="hint">관계가 좋으면 단독 제보·문건 확보·광고 확대로 돌아오고, 나쁘면 자료 거부·광고 중단·소송으로 돌아온다.</p>`,opts.concat([{label:'다음에',cls:'ghost'}]));
}
const NET_EVENTS=[
 {w:3,c:()=>S.rank>=2&&ENTS.some(e=>e[2]==='corp'&&netRel(e[0])>=55&&!S.net[e[0]].cut),run:()=>{const E=ENT[pick(ENTS.filter(e=>e[2]==='corp'&&netRel(e[0])>=55&&!S.net[e[0]].cut))[0]];openModal('광고 확대 제안',`<p class="lede">${E.n} 홍보 상무: "다음 분기 광고 두 배로 늘리겠습니다. 대신 신제품 출시 기사, 1면 하단에라도 좀 실어 주시죠."</p>`,[{label:'받아들인다',sub:'광고 매출↑, 신뢰도↓',fn:()=>{S.co.adB+=.07;S.co.cash+=OUT().ad*E.w;netUp(E.id,8);toast(apply({trust:-3,eval:1.5}));portalPen(1,'광고성 기사');log(`${E.n} 광고 확대 — 홍보성 기사 게재`);}},{label:'광고만 감사히 받는다',sub:'기사는 따로 판단',fn:()=>{S.co.adB+=.03;netUp(E.id,-4);toast(apply({trust:.5}));}},{label:'거절한다',fn:()=>{netUp(E.id,-10);toast(apply({trust:2}));}}]);}},
 {w:3,c:()=>S.items.some(i=>!i.pos&&ENT[i.ent]&&ENT[i.ent].kind==='corp'),run:()=>{const it=S.items.find(i=>!i.pos&&ENT[i.ent]&&ENT[i.ent].kind==='corp');const E=ENT[it.ent];openModal('조건부 거래',`<p class="lede">${E.n} 쪽에서 「${esc(it.title)}」 취재를 눈치챘다. "그 기사 접어 주시면 올해 광고 예산 따로 챙겨 드리겠습니다."</p>`,[{label:'기사를 접는다',sub:'회사 자금↑, 신뢰도 크게↓',fn:()=>{S.items=S.items.filter(x=>x!==it);S.co.cash+=OUT().ad*E.w*3;netUp(E.id,25);toast(apply({trust:-7,eval:1}));log(`${E.n}의 조건부 광고 제안을 받아들여 기사 포기`);}},{label:'"기사는 기사입니다"',sub:'관계↓, 신뢰↑',fn:()=>{netUp(E.id,-12);it.alert=clamp(it.alert+15,0,100);toast(apply({trust:2.5}));S.resist=(S.resist||0)+1;}}]);}},
 {w:2,c:()=>ENTS.some(e=>e[2]==='gov'&&S.net&&S.net[e[0]].block>0),run:()=>{const E=ENT[pick(ENTS.filter(e=>e[2]==='gov'&&S.net[e[0]].block>0))[0]];openModal('기자단 배제',`<p class="lede">${E.n} 출입기자단이 우리 매체를 공동 취재 풀에서 뺐다. "사전 공지 없이 단독을 냈다"는 이유다.</p>`,[{label:'공개적으로 문제를 제기한다',sub:'평판↑, 관계↓',fn:()=>{netUp(E.id,-8);toast(apply({fame:1.5,trust:1}));}},{label:'물밑에서 관계를 푼다',sub:'관계↑, 신뢰도 조금↓',fn:()=>{netUp(E.id,15);S.net[E.id].block=Math.max(0,S.net[E.id].block-2);toast(apply({trust:-1}));}}]);}},
 {w:2,c:()=>ENTS.some(e=>(e[2]==='gov'||e[2]==='person')&&netRel(e[0])>=50),run:()=>{const E=ENT[pick(ENTS.filter(e=>(e[2]==='gov'||e[2]==='person')&&netRel(e[0])>=50))[0]];const it=netItemFor(E,{excl:true,keyConf:true,pre:1});openModal('먼저 온 전화',`<p class="lede">${entName(E.id)} 쪽에서 먼저 연락이 왔다. "내일 발표 전에 기자님께만 미리 드리는 겁니다." → 「${esc(it.title)}」</p>`,[{label:'받는다',sub:'단독급 아이템',fn:()=>{if(S.rank<=3)S.items.push(it);else{S.co.q+=2;apply({fame:1});}netUp(E.id,2);}},{label:'"공식 발표 때 쓰겠습니다"',sub:'신뢰↑',fn:()=>{toast(apply({trust:1.5}));}}]);}},
 {w:1,c:()=>S.rank>=2&&S.turn-(S.phT??-99)>=YW&&ENTS.some(e=>e[2]==='corp'),run:()=>{S.phT=S.turn;const E=ENT[pick(ENTS.filter(e=>e[2]==='corp'))[0]];openModal('회장님 사진',`<p class="lede">${E.n}: "다음 주 광고와 함께 회장님 사회공헌 행사 사진도 좀 실어 주시죠."</p>`,[{label:'싣는다',fn:()=>{netUp(E.id,8);S.co.cash+=OUT().ad*E.w*.5;toast(apply({trust:-1.5}));}},{label:'광고면에만 싣겠다고 한다',fn:()=>{netUp(E.id,-3);toast(apply({trust:.5}));}}]);}},
 {w:1,c:()=>S.net&&S.rank>=4&&ENTS.some(e=>e[2]==='gov'&&e[4]>0),run:()=>{const lst=ENTS.filter(e=>e[2]==='gov'&&e[4]>0);if(!lst.length)return closeModal();const E=ENT[pick(lst)[0]];const good=netRel(E.id)>=30;openModal(good?'정부 광고 배정':'정부 광고 축소',`<p class="lede">${good?`${jo2(E.n,'이','가')} 올해 캠페인 광고를 우리 매체에 넉넉히 배정했다. 비판 기사를 줄여 달라는 말은 없었지만, 다들 무슨 뜻인지 안다.`:`${E.n}의 올해 캠페인 광고가 우리 매체만 빠졌다. 최근 비판 보도 때문이라는 말이 돈다.`}</p>`,good?[{label:'고맙게 받는다',fn:()=>{S.co.cash+=OUT().ad*E.w*2;toast(apply({trust:-.5}));}},{label:'편집국에 "신경 쓰지 말라"고 공지한다',fn:()=>{S.co.cash+=OUT().ad*E.w*2;toast(apply({trust:1.5}));}}]:[{label:'공개적으로 문제 삼는다',sub:'평판↑',fn:()=>{netUp(E.id,-5);toast(apply({fame:1.5,trust:1}));}},{label:'담당자를 찾아가 관계를 푼다',fn:()=>{netUp(E.id,12);toast(apply({trust:-1}));}}]);}}
];
function suitEvent(p){if(!S.simple&&typeof courtEvent==='function'){courtEvent(p);return;}suitOld(p);}
function suitOld(p){const E=ENT[p.ent]||{n:p.who||entName(p.ent)};openModal('명예훼손 고소',`<p class="lede">${p.who||entName(p.ent)} 측이 「${esc(p.title)}」 보도를 두고 명예훼손 고소장을 냈다. 손해배상 청구액은 ${R(3,30)}억 원.</p>`,[
  {label:'정면 대응한다',sub:'취재 자료가 탄탄하면 이긴다',fn:()=>{S.co.cash-=.3;if(chance(.6+S.trust/300)){toast('무혐의 처분. 보도의 공익성이 인정됐다 · '+apply({trust:3,fame:2}));log(`${E.n} 측 고소 — 무혐의`);}else{toast('일부 패소 · '+apply({trust:-4,eval:-3}));log(`${E.n} 측 소송 일부 패소`);}}},
  {label:'정정보도 협상',sub:'관계 회복, 신뢰도↓',fn:()=>{netUp(p.ent,25);toast(apply({trust:-4,eval:-1}));}}]);}

// --- 광고·협찬 영업 ---
const adCorps=()=>ENTS.filter(e=>e[2]==='corp'&&S.net[e[0]]&&S.net[e[0]].known).sort((a,b)=>b[4]-a[4]).slice(0,10).map(e=>e[1]);
// 내 반기 목표 = 내 몫(직급·회사 규모·부서 배정) + 내 밑 차장 이상 기자들 목표의 절반 (그들 실적의 절반이 내 실적으로도 잡힌다)
function quotaOwn(){if(!S.co||S.founder)return 0;const dk=S.rank<=5&&DEPTS[S.dept]?deptAdQ(S.dept)*.84:1;return [0,.23,.32,.29,.35,.4,.6,0][S.rank]*(SL_PK[OUT().p]||.4)*dk*.5*2*adSizeK()*eraGoal()*(S.rank<=5&&DEPTS[S.dept]?goalK(S.dept):1)*(S.simple?.75:1)*.6;}
function deptShared(){return !S.founder&&!!DEPTS[S.dept]&&((S.rank>=2&&S.rank<=5)||(S.rank===1&&S.turn>=3*YW));}
// 7.1 편집국장은 부서가 없다: 전 부서 광고·협찬 실적 합계가 곧 내 목표다 (내가 직접 딴 실적도 더한다)
function nrAll(){return !!(S&&S.co&&!S.founder&&!S.story&&S.rank===6);}
function nrAdStat(){const out={goal:0,got:0,depts:[]};let per={};try{per=roster();}catch(e){}Object.keys(per).forEach(d=>{if(!DEPTS[d]||isRegD(d)&&!(per[d]||[]).some(slOk))return;const st=deptAdStat(d);if(!st.goal&&!st.got)return;out.goal+=st.goal;out.got+=st.got;out.depts.push({d,goal:st.goal,got:st.got,n:st.rows.length});});
  out.mine=myAdDirect();out.got+=out.mine;return out;}
function myQ(){return nrAll()?nrAdStat().got:deptShared()?deptAdStat(S.dept).got:(S.adQ||0);}
function quota(){if(!S.co||S.founder)return 0;if(nrAll())return Math.round(nrAdStat().goal*10)/10;if(deptShared())return Math.round(deptAdStat(S.dept).goal*10)/10;const own=quotaOwn();
  let tm=0;try{if(S.rank>=2&&S.rank<=6)(S.team||[]).forEach(m=>{tm+=npcQuota(m,m.d||S.dept)*.5;});}catch(e){}return Math.round((own+tm)*10)/10;}
RUN.adsell=function(){
  const corps=shuffle(adCorps()).slice(0,3);if(!corps.length){const u=ENTS.filter(e=>e[2]==='corp');if(u.length){const e0=pick(u);S.net[e0[0]].known=true;corps.push(e0[1]);toast(`광고국 선배가 ${e0[1]} 담당자를 소개해 줬다`);}}
  const q=quota(),qa=myQ();const L=corps.map(c=>{const ci=corpId(c),ce=S.net[ci];const conflict=S.items.some(i=>!i.pos&&i.title.includes(c))||S.clips.slice(0,10).some(x=>!x.pos&&x.h.includes(c));const warm=posWarm(ci);const p=adP(ce.rel,conflict,ci,'ad')*entRamp(ci);return{c,ci,ce,conflict,p,warm};});const best=L.filter(x=>!x.ce.cut).sort((a,b)=>adEV(b)-adEV(a))[0];
  openModal('광고·협찬 영업',`<div class="adq"><div><small>${deptShared()?`${DEPTS[S.dept].n} 반기 실적 (부서 공동)`:'이번 반기 실적'}</small><b>${eok(qa)}</b>${q?`<small> / 목표 ${eok(q)}</small>`:''}</div>${q?bar(Math.min(100,qa/q*100),qa>=q?'var(--good)':'var(--sodium)'):''}<p class="hint" style="margin:4px 0 0">${q?'':'차장은 목표 없이 실적만 쌓인다 · '}실적의 3.5%는 영업 수당 · 회사 자금에는 대행 수수료 20%를 뗀 금액이 들어온다 · 성공률은 인맥·영업력·관계·회사 급으로 정해진다 · 같은 달 여러 번 돌면 떨어지고, 반년 안에 계약한 회사는 예산이 없다</p></div>`,L.map(x=>{if(x.ce.cut)return{label:x.c,tag:'광고 중단',sub:`${wkTxt(x.ce.cut)} 동안 만나 주지 않는다`,disabled:true};return{label:x.c,tag:relLabel(x.ce.rel),rec:x===best&&!x.conflict,risk:x.conflict,sub:`성공 약 ${pct(x.p)} · 광고 ${AD_CAD[entCad(x.ci)||1]} ${adAmt(OUT().ad*ENT[x.ci].w*(entCad(x.ci)||1))}${x.conflict?' · 최근 우리 기사에 나온 회사 — 조건이 붙을 수 있다':''}${x.warm?' · 최근 우리 호재 기사에 나온 회사 — 분위기가 좋다':''}${entRamp(x.ci)<1?' · 새 부서 광고주 — 아직 우리를 잘 모른다':''}`,fn:()=>{adPitch(x.c,x.conflict);return false;}};}).concat(deptShared()?[{label:'부서 광고 할당 현황',sub:'부서원별 실적과 반기 목표 · 부장은 영업 독려',cls:'ghost',fn:()=>{deptAdOpen();return false;}}]:[]).concat([{label:'다음에',cls:'ghost'}]));
};
// 1.0 광고주 규모에 따라 계약 크기가 다르다 (우리 광고주 중간값 대비 · 큰 곳은 더 크게, 작은 곳은 작게, 평균은 그대로)
function adSz(ci){try{const W=ENTS.filter(e=>e[2]==='corp'&&e[4]).map(e=>e[4]).sort((a,b)=>a-b);const med=W[W.length>>1]||.01;const w=(ENT[ci]&&ENT[ci].w)||med;return clamp(Math.sqrt(w/med),.6,1.7);}catch(e){return 1;}}
function adPitch(c,conflict){
  const ci=corpId(c);const rel=netRel(ci);const scale=(SL_PK[OUT().p]||.4)*(1+(S.rank-2)*.2)*adSz(ci);
  const go=(kind,base,fx0,sub)=>{spend(1,6);setCd('adsell');
    let p=adP(rel,conflict,ci,kind)*entRamp(ci);
    if(chance(p)){
      const amt=Math.max(.02,Math.round(base*scale*.68*adDyn43()*(.95+(S.st.sal||0)/1000)*R(70,125)/100*100)/100);
      const fin=()=>{misWin('adsell');S.adHit=S.adHit||{};S.adHit[ci]=S.turn;S.adQ=(S.adQ||0)+amt;S.adTotal=(S.adTotal||0)+amt;S.co.cash+=amt*.8;S.co.adB+=.01;netUp(ci,8);S.flags.adPush=(S.flags.adPush||0)+(kind==='special'?1:0);
        const fee=Math.round(amt*10000*SL_FEE);if(kind==='rebate'){S.co.cash-=amt*.15;S.pending.push({type:'rebate',due:S.turn+R(8,40),title:`${c} 광고 리베이트`,amt});if(chance(.5)){S.money+=Math.round(amt*10000*.05);log(`대행사가 개인 몫 리베이트 ${Math.round(amt*10000*.05)}만 원을 건넸다`);}}const t=apply(Object.assign({eval:Math.min(1,.2+amt*1.6),money:fee,net:.4},fx0));log(`${c} ${sub} ${eok(amt)} 수주`);
        openModal('계약 성사',`<p class="lede">${jo2(c,'과','와')} ${sub} ${eok(amt)} 계약. 영업 수당 ${fee}만 원.</p><p class="hint">회사 자금에는 ${eok(amt*.8)}이 들어온다. 광고대행사 수수료와 집행 비용(약 20%)을 떼고 입금되기 때문이다. 영업 실적은 계약 금액 전체로 잡힌다.</p>${fxLine(t)}`);};
      if(conflict)openModal('조건이 붙었다',`<p class="lede">${c} 홍보 상무: "계약은 하죠. 대신 요즘 쓰시는 그 기사, 후속은 좀 살살 가 주시고요."</p>`,[{label:'조건을 받아들인다',sub:'계약 유지, 신뢰도 크게↓',fn:()=>{fin();apply({trust:-5});S.items=S.items.filter(i=>!i.title.includes(c));return false;}},{label:'"기사는 기사, 광고는 광고입니다"',sub:'계약 금액 절반',fn:()=>{misWin('adsell');const a2=amt/2;S.adQ=(S.adQ||0)+a2;S.adTotal=(S.adTotal||0)+a2;S.co.cash+=a2*.8;toast('계약 절반만 성사 · '+apply({trust:2,eval:.5,money:Math.round(a2*10000*SL_FEE)}));}}]);
      else fin();
    }else{netUp(ci,3);openModal('다음 분기에',`<p class="lede">${c}: "${pick(['올해 예산은 이미 다 잡혀서요.','요즘 다들 유튜브로 가잖아요.','윗선에 보고는 해 볼게요.'])}"</p>`);}
  };
  openModal(`${c} 미팅`,`<p class="lede">${c} 홍보실과 점심 자리. 어떤 제안을 할까?</p>${conflict?'<p class="warn">최근 우리 기사에 등장한 회사다. 조건이 붙을 수 있다.</p>':''}`,[
   ...(()=>{const sc=(SL_PK[OUT().p]||.4)*(1+(S.rank-2)*.2)*entRamp(ci)*adSz(ci);const p0=adP(rel,conflict,ci,'ad')*entRamp(ci);const am=b=>`${adAmt(Math.max(.02,b*sc*.68*.7))}~${adAmt(Math.max(.02,b*sc*.68*1.25))}`;return[
   {label:'지면·온라인 광고 집행 제안',rec:!conflict,sub:`성공 ${pct(p0)} · ${am(.16)} · 무난`,fn:()=>{go('ad',.16,{},'광고');return false;}},
   {label:'포럼·행사 협찬',sub:`성공 ${pct(p0)} · ${am(.18)} · 인맥↑`,fn:()=>{go('forum',.18,{net:.4},'포럼 협찬');return false;}},
   {label:'기획 특집 섹션 협찬',risk:true,sub:`성공 ${pct(p0)} · ${am(.45)} · 신뢰↓ · 나중에 압력`,fn:()=>{go('special',.45,{trust:-1.2},'특집 협찬');return false;}},
   {label:'담당자 리베이트를 끼워 제안',risk:true,sub:`성공 ${pct(adP(rel,conflict,ci,'rebate')*entRamp(ci))} · ${am(.32)} · 담당자에게 15% · 적발되면 큰일`,fn:()=>{S.flags.rebate=1;go('rebate',.32,{trust:-1},'광고(리베이트 조건)');return false;}}];})(),
   {label:'요즘 회사 자랑거리를 묻는다',sub:'호재 기사 아이템을 얻는다 · 관계↑ · 광고 얘기는 다음에',disabled:S.items.length>=6,fn:()=>{spend(1,3);setCd('adsell');netUp(ci,3);const it=posItem(S.dept,{forceEnt:ci,pre:1,via:'홍보실 자료'});if(it){it.src='홍보실';S.items.push(it);toast(`${c} 홍보실: "이건 꼭 한번 다뤄 주세요." → 「${it.title}」`);}else toast(`${jo2(c,'과','와')} 관계가 좋아졌다`);}},
   {label:'그냥 밥만 먹는다',rec:conflict,sub:'관계만 쌓는다 · 다음 영업 성공률↑',fn:()=>{spend(1,3);setCd('adsell');netUp(ci,6);toast(`${jo2(c,'과','와')} 관계가 좋아졌다`);}}]);
}

// --- 월급 쓰기 ---
const COURSES={grad:['야간 대학원(언론학)',900,24,{kno:.3,wri:.2,ver:.2},'주 1회 수업, 체력 소모 · 수료 시 평판 +3'],lang:['어학원',120,12,{lng:.8},''],data:['데이터 저널리즘 과정',150,12,{dat:.7,ver:.1},''],speech:['스피치·방송 아카데미',180,12,{brd:.7,int:.2},''],pt:['헬스 PT',200,12,{sta:.6,men:.2},'매달 컨디션 +16'],therapy:['심리 상담',80,8,{men:.8},'매달 컨디션 +12'],
 craft:['취재 기법 워크숍',160,10,{inv:.6,int:.25},'기자협회·언론재단 연수'],write:['글쓰기·제목 첨삭',140,10,{wri:.6,hed:.35},''],law:['법률·판례 강좌',200,12,{kno:.4,ver:.45},'명예훼손 위험 감각↑']};
const GEAR={rec:['고성능 녹음기',40,'인터뷰에서 결정적 발언 확률↑, 전화·탐문 성공률 +4%'],laptop:['최신 노트북',250,'속도 +5, 기사 쓰기 체력 -3'],camera:['미러리스 카메라',300,'현장 확인 성공률 +10%'],car:['중고차',1500,'사쓰마와리·뻗치기 체력 소모 40%↓ (월 유지비 30만)'],tablet:['태블릿·자료 정리 앱',120,'데이터 +3, 검증 +2, 데이터 분석 성공률 +5%'],suit:['좋은 정장 한 벌',80,'인터뷰·친화력 +3, 첫 만남 경계심↓']};
function housePrice(){return Math.round(50000*Math.pow(1.03,Math.floor(S.turn/YW))*((S.cheongM||0)>=24?.92:1)/100)*100;}
RUN.life=function(){
  const m=S.money;const cur=(S.courses||[]).map(c=>`${COURSES[c.k][0]} ${wkTxt(c.until-S.turn)} 남음`).join(', ');
  const owned=Object.keys(S.gear||{}).map(k=>GEAR[k][0]).join(', ');
  openModal('월급 쓰기',`<p>${assetsLine()}${S.house?` · 내 집 보유(대출 잔액 ${(S.loan||0).toLocaleString('ko-KR')}만)`:S.lease?' · 전세 거주':''}</p>${cur?`<p class="hint">수강 중: ${cur}</p>`:''}${owned?`<p class="hint">장비: ${owned}</p>`:''}`,[
   {label:'자기계발',sub:'대학원·어학원·데이터·스피치·PT·심리 상담',fn:()=>{lifeCourse();return false;}},
   {label:'취재 장비',sub:'녹음기·노트북·카메라·차',fn:()=>{lifeGear();return false;}},
   {label:'생활과 사람',sub:'휴가·부모님 용돈·후배 회식·기부·명절 선물',fn:()=>{lifeLiving();return false;}},
   {label:'내 돈으로',sub:'사비 출장·유료 DB·책 출간·뉴스레터 부업·장학금·봉사·반려동물·코인',fn:()=>{lifeSelf();return false;}},
   {label:'저축과 투자',sub:'자유적금·정기예금·청약·연금저축·ETF·주식',fn:()=>{lifeMoney();return false;}},
   {label:'집',sub:`월세·전세·내 집 (현재 집값 약 ${(housePrice()/10000).toFixed(1)}억)`,fn:()=>{lifeHouse();return false;}},
   {label:'대출 갚기',sub:S.loan||S.leaseLoan?`중도 상환·빨리 갚기${S.loanLate||S.leaseLate?' · 연체 중!':''}`:'갚을 대출이 없다',disabled:!(S.loan||S.leaseLoan),fn:()=>{lifeLoan();return false;}},
   {label:'닫기',cls:'ghost'}]);
};
function buy(cost,fn,msg){if(S.money<cost){toast('통장 잔고가 부족하다');return false;}S.money-=cost;fn&&fn();toast(msg+` · 통장 -${cost}만`);return undefined;}
function lifeCourse(){S.courses=S.courses||[];openModal('자기계발',`<p>동시에 두 과정까지 들을 수 있다. 수강료는 한 번에 낸다.</p><p class="hint">능력치 상승은 다니는 동안 매달 쌓이는 양이다. 이미 높은 능력치일수록 덜 오른다.</p>`,Object.keys(COURSES).map(k=>{const c=COURSES[k];const on=S.courses.some(x=>x.k===k);return{label:`${c[0]} · ${c[1]}만 원 · ${wkTxt(c[2])}`,sub:`${Object.entries(c[3]).map(([s,v])=>`${STN[s]} 매달 +${f1(v*4)}`).join(', ')}${c[4]?' · '+c[4]:''}`,disabled:on||S.courses.length>=2,fn:()=>buy(c[1],()=>{S.courses.push({k,until:S.turn+c[2]});log(`${c[0]} 등록`);},`${c[0]} 등록`)};}).concat([{label:'뒤로',cls:'ghost',fn:()=>{RUN.life();return false;}}]));}
function lifeGear(){S.gear=S.gear||{};openModal('취재 장비',`<p>한 번 사면 계속 쓴다.</p>`,Object.keys(GEAR).map(k=>{const g=GEAR[k];return{label:`${g[0]} · ${g[1].toLocaleString('ko-KR')}만 원`,sub:g[2],disabled:!!S.gear[k],fn:()=>buy(g[1],()=>{S.gear[k]=1;if(k==='laptop')gain('spd',5);if(k==='tablet'){gain('dat',3);gain('ver',2);}if(k==='suit'){gain('int',3);gain('cha',3);}log(`${g[0]} 구입`);},`${g[0]} 구입`)};}).concat([{label:'뒤로',cls:'ghost',fn:()=>{RUN.life();return false;}}]));}
function lifeLiving(){openModal('생활과 사람','',[
  {label:'일주일 휴가 여행 · 200만',sub:'이번 달 남은 행동력을 다 쓰지만 컨디션 100, 멘탈 +3, 체력 +1',fn:()=>buy(200,()=>{S.ap=0;S.hp=100;gain('men',3);gain('sta',1);S.cols&&S.cols.forEach(c=>c.role==='boss'&&relUp(c,-2,'휴가'));},'휴가를 다녀왔다')},
  {label:'부모님 용돈 · 50만',sub:'컨디션 +10, 멘탈 +1.5',fn:()=>buy(50,()=>{S.hp=clamp(S.hp+10,0,100);gain('men',1.5);},'"우리 아들딸 최고"')},
  {label:`부서 회식 쏘기 · ${dinCost()}만`,sub:`부서원 모두와 관계 +5~8 (부서 분위기↑) · 부서원 실력 +1 · 친화력↑${S.dinM===mKey()?' · 이번 달은 이미 쐈다':''}`,disabled:S.dinM===mKey(),fn:()=>buy(dinCost(),()=>{S.dinM=mKey();deptPeople().forEach(m=>{mRel(m,R(5,8),'부서 회식');skBump(m,1);});['junior','peer'].forEach(r=>relUp(colBy(r),8,'회식'));gain('cha',.6);},'부서 사람들과 고기를 구웠다')},
  {label:'간식·커피 돌리기 · 20만',sub:`부서원 모두와 관계 +3 (부서 분위기↑)${S.snkM===mKey()?' · 이번 달은 이미 돌렸다':''}`,disabled:S.snkM===mKey(),fn:()=>buy(20,()=>{S.snkM=mKey();deptPeople().forEach(m=>mRel(m,3,'간식'));},'부서에 간식 상자를 돌렸다')},
  {label:'명절 선물 (청탁금지법 한도 안) · 30만',sub:'취재원 전원 신뢰 +4, 인맥↑',fn:()=>buy(30,()=>{S.sources.forEach(x=>x.trust=clamp(x.trust+4,0,100));gain('net',.5);},'취재원들에게 5만 원 이하 선물을 돌렸다')},
  {label:'기부 · 100만',sub:'신뢰도 +3, 평판 +0.5, 멘탈↑',fn:()=>buy(100,()=>{apply({trust:3,fame:.5});gain('men',.6);},'익명으로 기부했다')},
  {label:'동료 경조사 챙기기 · 20만',sub:'사내 관계 전원 +4',fn:()=>buy(20,()=>S.cols&&S.cols.forEach(c=>relUp(c,4,'경조사')),'경조사를 챙겼다')},
  {label:'뒤로',cls:'ghost',fn:()=>{RUN.life();return false;}}]);}
function assetsLine(){const a=[['통장',S.money],['자유적금',S.savings||0],['정기예금',S.fixed?S.fixed.amt:0],['청약',S.cheong||0],['연금저축',S.pension||0],['지수 ETF',S.etf||0],['개별 주식',S.stock||0]].filter(x=>x[1]);return a.map(([n,v])=>`${n} ${Math.round(v).toLocaleString('ko-KR')}만`).join(' · ');}
function lifeMoney(){const L=living(),buf=S.money+(S.savings||0);const fx=S.fixed;
  openModal('저축과 투자',`<p>${assetsLine()}</p><p class="hint">비상금(통장+자유적금)이 생활비 6개월치(${(L*6).toLocaleString('ko-KR')}만) 이상이면 매달 멘탈·컨디션이 오르고, 2개월치 아래면 돈 걱정에 멘탈이 깎인다. 지금 ${buf>=L*6?'든든하다':buf<L*2?'불안하다':'보통'}.</p>`,[
  ...[100,500].map(v=>({label:`자유적금 ${v}만 넣기`,sub:'월 0.3% · 언제든 찾을 수 있다 · 비상금으로 쳐준다',fn:()=>buy(v,()=>{S.savings=(S.savings||0)+v;},`자유적금 ${v}만`)})),
  {label:`자유적금 전액 찾기 (${(S.savings||0).toLocaleString('ko-KR')}만)`,disabled:!S.savings,fn:()=>{S.money+=S.savings;toast(`적금 ${S.savings}만 해지`);S.savings=0;}},
  {label:fx?`정기예금 만기까지 ${wkTxt(fx.until-S.turn)} (중도 해지하면 이자 없음)`:'정기예금 1년 · 1,000만',sub:fx?`${fx.amt.toLocaleString('ko-KR')}만 · 만기 시 연 4% 이자`:'연 4% · 1년 묶인다 · 만기에 한꺼번에',fn:()=>{if(fx){S.money+=fx.amt;S.fixed=null;toast('정기예금 중도 해지 — 원금만 돌려받았다');return;}return buy(1000,()=>{S.fixed={amt:1000,until:S.turn+YW};},'정기예금 가입');}},
  {label:`주택청약 월 납입 ${S.cheongOn?'중단':'시작'} (월 20만)`,sub:`납입 ${S.cheongM||0}개월 · 24개월 넘기면 집값 8% 할인(청약 당첨)`,fn:()=>{S.cheongOn=!S.cheongOn;toast(S.cheongOn?'청약 자동이체 시작':'청약 납입 중단');}},
  {label:'연금저축 300만 넣기',sub:'연말에 납입액의 13.2%를 세금으로 돌려받는다 · 커리어가 끝날 때까지 못 찾는다',fn:()=>buy(300,()=>{S.pension=(S.pension||0)+300;S.penY=(S.penY||0)+300;},'연금저축 300만')},
  ...[300,1000].map(v=>({label:`지수 ETF ${v}만 매수`,sub:'매달 -4%~+5% · 장기적으로 조금씩 오른다',fn:()=>buy(v,()=>{S.etf=(S.etf||0)+v;},`ETF ${v}만 매수`)})),
  ...[300,1000].map(v=>({label:`개별 주식 ${v}만 매수`,sub:`매달 -12%~+14%${['eco','stock','ind','fin'].includes(S.dept)?' · 경제부 기자의 개별주 보유는 윤리 위반 위험':''}`,fn:()=>buy(v,()=>{S.stock=(S.stock||0)+v;if(['eco','stock','ind','fin'].includes(S.dept))S.flags.insider=1;},`주식 ${v}만 매수`)})),
  {label:`ETF·주식 전량 매도 (${((S.etf||0)+(S.stock||0)).toLocaleString('ko-KR')}만)`,disabled:!S.stock&&!S.etf,fn:()=>{const v=(S.etf||0)+(S.stock||0);S.money+=v;S.etf=0;S.stock=0;toast(`${v}만 매도`);}},
  {label:'뒤로',cls:'ghost',fn:()=>{RUN.life();return false;}}]);}
function lifeHouse(){const hp=housePrice();const dep=Math.round(20000*Math.pow(1.03,Math.floor(S.turn/YW))/100)*100,cash=Math.round(dep*.2);
  openModal('집',`<p>지금 ${S.house?'내 집':S.lease?`전세 (보증금 ${dep.toLocaleString('ko-KR')}만 · 대출 ${(S.leaseLoan||0).toLocaleString('ko-KR')}만)`:'월세 (생활비에 월세 70만 포함)'}. 집값 약 ${(hp/10000).toFixed(1)}억${(S.cheongM||0)>=24?' (청약 할인 적용)':''}.</p>`,[
  {label:`전세 계약 · 현금 ${cash.toLocaleString('ko-KR')}만 + 전세자금대출 80%`,sub:`월세 70만이 사라지고 대출 이자 월 약 ${Math.round((dep-cash)*.0025)}만 · 매달 약 ${70-Math.round((dep-cash)*.0025)}만 이득 · 멘탈↑`,disabled:!!S.lease||!!S.house,fn:()=>buy(cash,()=>{S.lease=cash;S.leaseLoan=dep-cash;gain('men',1);log('전세 계약');},'전세 계약')},
  {label:'전세 빼고 월세로',sub:`보증금 현금 ${(S.lease||0).toLocaleString('ko-KR')}만을 돌려받고 대출을 갚는다`,disabled:!S.lease,fn:()=>{S.money+=S.lease;S.lease=0;S.leaseLoan=0;toast('월세로 옮겼다');}},
  {label:`내 집 마련 · 현금 ${Math.round(hp*.3).toLocaleString('ko-KR')}만`,sub:`전세 보증금은 계약금에 보탠다 · 월세 70만이 사라지고 대출 원리금 매달 · 목표 "내 집 마련"`,disabled:!!S.house,fn:()=>{const down=Math.round(hp*.3)-(S.lease||0);if(S.money<down){toast(`계약금이 ${(down-S.money).toLocaleString('ko-KR')}만 원 모자란다`);return false;}S.money-=down;S.loan=hp-Math.round(hp*.3);S.house=1;S.lease=0;S.leaseLoan=0;gain('men',2);log('내 집 마련');toast('내 집이 생겼다');}},
  {label:'뒤로',cls:'ghost',fn:()=>{RUN.life();return false;}}]);}
// ===== 1.1 대출 갚기: 중도 상환·빨리 갚기, 못 갚으면 연체 → 신용 하락 → 경매 =====
function loanRate(){return .003+(S.loanCr||0)*.001;}
function loanPay(){if(!(S.loan>0))return 0;const base=Math.round(S.loan*(S.loanFast?.012:.006));return Math.max(base,Math.round(S.loan*loanRate())+1);}
function loanMonth(lines){
  if(S.loan>0){const pay=loanPay(),int=Math.round(S.loan*loanRate());
    if(S.money>=pay){S.money-=pay;S.loan=Math.max(0,S.loan-(pay-int));S.loanLate=0;S.loanOk=(S.loanOk||0)+1;
      if(S.loanCr&&S.loanOk>=12){S.loanCr--;S.loanOk=0;lines.push({c:'g',t:'1년 동안 연체 없이 갚아 신용등급이 한 단계 회복됐다. 대출 금리가 내려갔다'});}
      if(S.loan===0){S.loanFast=0;gain('men',3);lines.push({c:'g',t:'주택담보대출을 다 갚았다. 이제 진짜 내 집이다 (멘탈↑)'});log('주택담보대출 완납');}}
    else{S.loanLate=(S.loanLate||0)+1;S.loanOk=0;const fee=Math.round(int*1.5);S.loan+=int+fee;gain('men',-1.5);
      lines.push({c:'r',t:`주택담보대출 연체 ${S.loanLate}개월째 — 이번 달 원리금 ${pay.toLocaleString('ko-KR')}만을 못 냈다. 연체 이자 ${fee.toLocaleString('ko-KR')}만이 붙었다`});
      if(S.loanLate===3){S.loanCr=Math.min(3,(S.loanCr||0)+1);Q.push(()=>openModal('신용등급 하락',`<p class="lede">석 달째 원리금이 밀렸다. 신용등급이 떨어져 대출 금리가 올랐고, 은행 독촉 전화가 회사로 걸려 왔다.</p><p class="hint">석 달 더 밀리면 집이 경매로 넘어간다. '월급 쓰기 → 대출 갚기'에서 상환 속도를 낮추거나 적금을 깨서 메우자.</p>${fxLine(S.founder?apply({fame:-.5}):apply({eval:-1}))}`));const bs=colBy('boss');if(bs&&!S.founder)relUp(bs,-3,'대출 독촉 전화');}
      if(S.loanLate>=6){const v=housePrice(),net=Math.round(v*.85-S.loan);S.money+=net;S.house=0;S.loan=0;S.loanLate=0;S.loanFast=0;gain('men',-8);lines.push({c:'r',t:`원리금이 반년 밀려 집이 경매로 넘어갔다 · 시세보다 싸게 팔려 정산 ${net.toLocaleString('ko-KR')}만 원`});log('대출 연체로 집이 경매에 넘어갔다');
        Q.push(()=>openModal('집이 경매로 넘어갔다',`<p class="lede">법원 경매에서 집이 시세보다 싸게 팔렸다. 남은 돈 ${net.toLocaleString('ko-KR')}만 원을 받고 월세로 옮겼다.</p>`));}}}
  if(S.leaseLoan>0){const int=Math.round(S.leaseLoan*.0025);
    if(S.money>=int){S.money-=int;S.leaseLate=0;}
    else{S.leaseLate=(S.leaseLate||0)+1;S.leaseLoan+=Math.round(int*1.5);gain('men',-1);lines.push({c:'r',t:`전세자금대출 이자 연체 ${S.leaseLate}개월째 — 연체 이자가 원금에 붙었다`});
      if(S.leaseLate>=4){const back=Math.max(0,(S.lease||0)-Math.round(S.leaseLoan*.05));S.money+=back;S.lease=0;S.leaseLoan=0;S.leaseLate=0;gain('men',-4);lines.push({c:'r',t:`이자가 넉 달 밀려 은행이 전세 보증금을 회수했다. 위약금을 떼고 ${back.toLocaleString('ko-KR')}만 원을 돌려받아 월세로 옮겼다`});log('전세대출 연체로 보증금 회수');}}}}
function lifeLoan(){const L=S.loan||0,LL=S.leaseLoan||0,m=S.money;const f=x=>x.toLocaleString('ko-KR');
  const st=[];if(L)st.push(`주택담보대출 ${f(L)}만 · 월 원리금 ${f(loanPay())}만 · 연 ${(loanRate()*1200).toFixed(1)}%${S.loanFast?' · 빨리 갚는 중':''}${S.loanLate?` · <b style="color:var(--red)">연체 ${S.loanLate}개월</b>`:''}`);if(LL)st.push(`전세자금대출 ${f(LL)}만 · 월 이자 ${f(Math.round(LL*.0025))}만${S.leaseLate?` · <b style="color:var(--red)">연체 ${S.leaseLate}개월</b>`:''}`);
  const pre=(amt)=>{const a=Math.min(amt,L),fee=Math.round(a*.01);return{label:`주택담보대출 ${amt>=L?'전액':f(amt)+'만'} 갚기`,sub:`통장 -${f(a+fee)}만 (중도상환수수료 1%) · 월 원리금↓${amt>=L?' · 빚 끝':''}`,disabled:!L||m<a+fee,fn:()=>{S.money-=a+fee;S.loan=L-a;if(S.loan===0){S.loanFast=0;S.loanLate=0;gain('men',3);log('주택담보대출 완납');toast('대출을 다 갚았다. 진짜 내 집이다');}else toast(`원금 ${f(a)}만 상환`);lifeLoan();return false;}};};
  const preL=(amt)=>{const a=Math.min(amt,LL);return{label:`전세자금대출 ${amt>=LL?'전액':f(amt)+'만'} 갚기`,sub:`통장 -${f(a)}만 · 월 이자↓`,disabled:!LL||m<a,fn:()=>{S.money-=a;S.leaseLoan=LL-a;if(!S.leaseLoan)S.leaseLate=0;toast(`전세대출 ${f(a)}만 상환`);lifeLoan();return false;}};};
  openModal('대출 갚기',`<p>${st.length?st.join('<br>'):'갚을 대출이 없다.'}</p><p class="hint">통장 ${f(m)}만. 원리금은 매달 자동으로 빠진다. 통장에 돈이 모자라 못 내면 연체 이자가 붙고, 석 달이면 신용등급이 떨어져 금리가 오르며, 반년이면 집이 경매로 넘어간다. 전세대출 이자를 넉 달 못 내면 은행이 보증금을 회수한다.</p>`,[
   ...(L?[...(L>1000?[pre(1000)]:[]),...(L>3000?[pre(3000)]:[]),pre(L),{label:S.loanFast?'기본 속도로 갚기':'빨리 갚기',sub:S.loanFast?'월 원리금을 원래대로 · 통장에 여유':'월 원리금 두 배 · 원금이 훨씬 빨리 준다 · 통장이 빠듯해진다',fn:()=>{S.loanFast=S.loanFast?0:1;toast(S.loanFast?'월 원리금을 두 배로 올렸다':'기본 속도로 돌렸다');lifeLoan();return false;}}]:[]),
   ...(LL?[...(LL>1000?[preL(1000)]:[]),preL(LL)]:[]),
   {label:'뒤로',cls:'ghost',fn:()=>{RUN.life();return false;}}]);}
function lifeMonth(lines){
  if(S.savings){S.savings+=Math.round(S.savings*.003);}
  if(S.fixed&&S.fixed.until<=S.turn){const g=Math.round(S.fixed.amt*1.04);S.money+=g;lines.push({c:'g',t:`정기예금 만기 · ${g.toLocaleString('ko-KR')}만 원 입금 (이자 ${g-S.fixed.amt}만)`});S.fixed=null;}
  if(S.cheongOn){if(S.money>=20){S.money-=20;S.cheong=(S.cheong||0)+20;S.cheongM=(S.cheongM||0)+1;if(S.cheongM===24)lines.push({c:'g',t:'주택청약 24개월 — 이제 집을 살 때 8% 싸게 살 수 있다'});}}
  let inv=0;if(S.etf){const d=Math.round(S.etf*R(-4,5)/100);S.etf=Math.max(0,S.etf+d);inv+=d;}if(S.stock){const d=Math.round(S.stock*R(-12,14)/100);S.stock=Math.max(0,S.stock+d);inv+=d;}
  if(inv)lines.push({c:inv>0?'g':'r',t:`투자 평가 ${inv>0?'+':''}${inv.toLocaleString('ko-KR')}만 원 (ETF ${(S.etf||0).toLocaleString('ko-KR')}만 · 주식 ${(S.stock||0).toLocaleString('ko-KR')}만)`});
  if(S.penY&&S.turn%YW>=YW-4){const r=Math.round(S.penY*.132);S.money+=r;lines.push({c:'g',t:`연말정산 · 연금저축 세액공제 ${r}만 원 환급`});S.penY=0;}
  const L=living(),buf=S.money+(S.savings||0);if(buf>=L*6){gain('men',.4);S.hp=clamp(S.hp+3,0,100);}else if(buf<L*2){gain('men',-.5);lines.push({c:'r',t:'통장이 바닥이다. 돈 걱정에 잠이 안 온다 (멘탈↓)'});}
  try{loanMonth(lines);}catch(e){console.error(e);}
  if(S.gear&&S.gear.car)S.money-=30;
}
function lifeWeek(){
  (S.courses||[]).forEach(c=>{const C=COURSES[c.k];for(const k in C[3])gain(k,C[3][k]);if(c.k==='pt')S.hp=clamp(S.hp+4,0,100);if(c.k==='therapy')S.hp=clamp(S.hp+3,0,100);if(c.k==='grad')S.hp=clamp(S.hp-1,0,100);});
  const done=(S.courses||[]).filter(c=>c.until<=S.turn);S.courses=(S.courses||[]).filter(c=>c.until>S.turn);done.forEach(c=>{log(`${COURSES[c.k][0]} 수료`);if(c.k==='grad')apply({fame:3});toast(`${COURSES[c.k][0]} 수료`);});
}

// --- 인사권 ---
RUN.personnel=function(){
  const pool=(S.rank>=6?Object.values(roster()).flat():S.team).filter(m=>DEPTS[m.d]&&!/^x_/.test(m.d)).slice().sort((a,b)=>(b.r||0)-(a.r||0)||b.skill-a.skill).slice(0,60);S._pp=pool;
  openModal('인사권 행사',`<p>${S.rank===7?'대표':'편집국장'}으로서 기자들의 승진·부서·보직을 정한다. <b>여러 명을 골라 한꺼번에</b> 처리할 수 있다(몇 명이든 행동력 1). 실력대로 하면 성과가 오르고, 연줄로 하면 사기가 꺾인다.</p>
   <p class="hint">사진·편집·디지털·조판 등 지원 부서 인사는 자동으로 돌아간다. 여기선 취재 부서 기자만 다룬다.</p><div class="help-nav"><button type="button" data-ps="all">전체 선택</button><button type="button" data-ps="none">선택 해제</button><button type="button" data-ps="top">실력 상위 5명</button><button type="button" data-ps="low">실력 하위 간부</button><button type="button" data-ps="due">승진 연차 된 기자</button></div><div class="help-nav" id="pfd"><button type="button" data-pd="" aria-pressed="true">모든 부서</button>${[...new Set(pool.map(m=>m.d))].map(d=>`<button type="button" data-pd="${d}">${DEPTS[d].n}</button>`).join('')}</div><p class="pcount" id="pcnt">선택 0명 · 행동력 0</p>
   ${pool.map((m,i)=>`<label class="chk" data-prow="${m.d}"><input type="checkbox" data-pi="${i}"><span>${esc(m.name)} ${MR[Math.min(3,m.r||0)]} · ${yrsTxt(m)} · ${npcAge(m)}세 · ${DEPTS[m.d]?DEPTS[m.d].n:''}<small>종합 실력 ${Math.round(m.skill)}${(m.r||0)>=1?' · 간부':''}${(m.r||0)<2&&myrs(m)>=[10,15][m.r||0]?' · 승진 연차':''}${m.ai?` · ${npcLine(m)}`:''}</small></span></label>`).join('')}`,
   [{label:'선택한 기자 승진',sub:'실력 55↑·연차 충분하면 납득 → 부서 성과·보도 품질·사기↑ · 아니면 "파격 발탁" 뒷말 · 일반 부서는 차장·부장 각 1자리',fn:()=>personBatch('up')},{label:'선택한 기자 부서 이동',fn:()=>personBatch('move')},{label:'선택한 간부 보직 해임',sub:'실력 50 미만 간부면 납득 → 부서 성과·보도 품질↑ · 아니면 평가↓',fn:()=>personBatch('down')},{label:'선택한 기자 포상',sub:'실력 +1.5 · 사기↑ · 한 명당 회사 돈 200만',fn:()=>personBatch('award')},{label:'닫기',cls:'ghost'}]);
  const set=f=>document.querySelectorAll('#mb input[data-pi]').forEach(x=>x.checked=f(pool[+x.dataset.pi],+x.dataset.pi));
  const cnt=()=>{const n=personSel().length;const el=$('#pcnt');if(el)el.textContent=`선택 ${n}명 · 행동력 ${n?1:0}`;};const vis=x=>!x.closest('label').hidden;
  const set2=f=>{document.querySelectorAll('#mb input[data-pi]').forEach(x=>{if(vis(x))x.checked=f(pool[+x.dataset.pi],+x.dataset.pi);});cnt();};
  document.querySelectorAll('[data-ps]').forEach(b=>b.onclick=()=>{const k=b.dataset.ps;if(k==='all')set2(()=>true);if(k==='none')set(()=>false),cnt();if(k==='top')set2((m,i)=>i<5);if(k==='low')set2(m=>(m.r||0)>=1&&m.skill<50);if(k==='due')set2(m=>(m.r||0)<2&&myrs(m)>=[10,15][m.r||0]&&m.skill>=50);});
  document.querySelectorAll('[data-pd]').forEach(b=>b.onclick=()=>{const d=b.dataset.pd;document.querySelectorAll('[data-pd]').forEach(x=>x.setAttribute('aria-pressed',x===b));document.querySelectorAll('#mb [data-prow]').forEach(l=>{l.hidden=!!d&&l.dataset.prow!==d;});});
  document.querySelectorAll('#mb input[data-pi]').forEach(x=>x.onchange=cnt);
};
function personSel(){return [...document.querySelectorAll('#mb input[data-pi]:checked')].map(x=>S._pp[+x.dataset.pi]).filter(Boolean);}
function personBatch(kind){const sel=personSel();if(!sel.length){toast('먼저 기자를 골라 주세요');return false;}
  const cost=1;if(S.ap<cost){toast(`행동력이 ${cost} 필요하다`);return false;}
  const done=()=>{spend(cost,3);setCd('personnel');};
  if(kind==='move'){openModal('부서 이동',`<p>${sel.length}명을 어디로 보낼까?</p>`,OUT().depts.slice(0,14).map(d=>({label:DEPTS[d].n,fn:()=>{done();sel.forEach(m=>{if(m.d!==d){m.d=d;m.skill=clamp(m.skill+(chance(.5)?2:-2),0,95);if(isRegD(d)&&S.corr){m.reg=pick(corrPlan(OUT()).regs);m.role='주재기자';if(m.r>=2)m.r=1;S.corr.push(m);}else if(m.reg){m.reg=null;if(S.corr)S.corr=S.corr.filter(x=>x!==m);}}});try{rosRelocate();}catch(e){S.ros=null;}log(`인사: ${sel.length}명 ${DEPTS[d].n} 발령`);toast(`${sel.length}명 ${DEPTS[d].n} 발령`);}})).concat([{label:'뒤로',cls:'ghost',fn:()=>{RUN.personnel();return false;}}]));return false;}
  done();let ok=0,bad=0;
  let full=0;const pool=S._pp||[];
  sel.forEach(m=>{if(kind==='up'&&(m.r||0)<2){const tr=(m.r||0)+1;if(!isRegD(m.d)&&pool.some(x=>x!==m&&x.d===m.d&&(x.r||0)===tr&&!sel.includes(x))){full++;return;}m.r=tr;const minY=[0,10,15][tr];if(m.skill>=55&&myrs(m)>=minY-2){ok++;m.skill+=1;}else bad++;if(myrs(m)<minY)m.yrs+=Math.ceil((minY-myrs(m))/3);}
    if(kind==='down'&&(m.r||0)>0){m.r--;if(m.skill<50)ok++;else bad++;}
    if(kind==='award'){m.skill=clamp(m.skill+1.5,0,95);ok++;}});
  if((kind==='up'||kind==='down')&&ok)S.persOk=(S.persOk||0)+ok;
  if(kind==='up'){S.flags.plan=(S.flags.plan||0)+ok*3;if(ok){S.co.q=Math.min(100,S.co.q+.5*ok);S.wMood=clamp((S.wMood??60)+.8*ok,0,100);}if(bad){S.team.forEach(t=>{if(!sel.includes(t))t.skill-=.3*bad;});apply({trust:-.6*bad});}}
  if(kind==='down'){S.flags.plan=(S.flags.plan||0)+ok*2;if(ok)S.co.q=Math.min(100,S.co.q+.4*ok);if(bad)apply({eval:-.8*bad});}
  if(kind==='award'){S.co.cash-=.02*sel.length;S.wMood=clamp((S.wMood??60)+.6*sel.length,0,100);S.flags.plan=(S.flags.plan||0)+sel.length;}
  const nm={up:'승진',down:'보직 해임',award:'포상'}[kind];log(`인사: ${sel.length}명 ${nm}`);
  openModal('인사 발표',`<p class="lede">${sel.map(m=>`${esc(m.name)}(${myrs(m)}년 차 · ${npcAge(m)}세)`).join(', ')} — ${nm}.</p><p>${full?`${full}명은 그 부서에 이미 같은 직급 자리가 차 있어 승진하지 못했다 — 부서장을 바꾸려면 「부서장(팀장) 배치」를 쓴다. `:''}${kind==='award'?'편집국에 박수가 터졌다.':bad?`${bad}명은 "왜 저 사람이?"라는 뒷말이 돈다.${ok?` ${ok}명은 다들 납득했다.`:''}`:'편집국이 고개를 끄덕였다.'}</p>`);return false;}
function personOne(m){
  const go=fn=>()=>{spend(1,3);setCd('personnel');fn();return undefined;};
  openModal(`${m.name} ${MR[m.r||0]}`,`<p class="lede">${DEPTS[m.d]?DEPTS[m.d].n:''} · 실력 ${Math.round(m.skill)}</p>`,[
   {label:`${jo2(MR[Math.min(3,(m.r||0)+1)],'으로','로')} 승진`,disabled:(m.r||0)>=3,sub:m.skill>=55?'실력에 맞는 인사':'실력에 비해 이르다 — 낙하산 논란',fn:go(()=>{m.r=(m.r||0)+1;if(m.skill>=55){S.flags.plan=(S.flags.plan||0)+2;m.skill+=1;S.persOk=(S.persOk||0)+1;toast(`${m.name} ${MR[m.r]} 승진 · 편집국 분위기 좋음`);}else{S.team.forEach(t=>{if(t!==m)t.skill-=.5;});toast(`${m.name} 승진 · "줄 잘 섰네" 뒷말`);apply({trust:-1});}log(`인사: ${m.name} ${MR[m.r]} 승진`);})},
   {label:'다른 부서로 이동',sub:'새 출입처에서 다시 시작',fn:()=>{openModal('부서 이동',`<p>${jo2(m.name,'을','를')} 어디로 보낼까?</p>`,OUT().depts.filter(d=>d!==m.d).slice(0,8).map(d=>({label:DEPTS[d].n,fn:go(()=>{m.d=d;m.skill=clamp(m.skill+(chance(.5)?2:-2),0,95);toast(`${m.name} ${DEPTS[d].n} 발령`);log(`인사: ${m.name} ${DEPTS[d].n} 이동`);})})));return false;}},
   {label:'보직 해임',disabled:!(m.r>0),sub:'성과가 나쁜 간부를 내린다',fn:go(()=>{m.r=Math.max(0,(m.r||0)-1);if(m.skill<50){S.flags.plan=(S.flags.plan||0)+1;S.persOk=(S.persOk||0)+1;toast('편집국이 납득했다');}else{apply({eval:-1});toast('"왜 저 사람을?" 술렁인다');}})},
   {label:'포상한다',sub:'실력↑',fn:go(()=>{m.skill=clamp(m.skill+1.5,0,95);toast(`${m.name}에게 사장상`);})},
   {label:'뒤로',cls:'ghost',fn:()=>{RUN.personnel();return false;}}]);
}

// --- 창간 모드 ---
const FOUND_TYPES=[['online','인터넷 언론','가장 싸게 시작한다. 포털 제휴가 생명줄','pol,eco,soc,ent'],['weekly','시사주간지','깊이로 승부. 구독과 평판으로 큰다','pol,eco,soc,inv'],['econ','경제지','광고 시장이 크다. 기업과의 거리 두기가 숙제','eco,stock,ind,pol'],['local','지역 일간지','지역 광고와 지자체가 든든하다. 시장이 작다','city,eco,soc,culspo'],['trade','전문지','작은 업계를 장악한다. 협회 광고가 크다','ind,it,soc'],['sports','스포츠·연예지','트래픽이 크다. 선정성과의 싸움','base,foot,ent,spo']];
function founderSetup(keep){
  S=newState();if(keep){Object.assign(S,{st:keep.st,fame:keep.fame*.8,trust:keep.trust,sources:keep.sources,name:keep.name,major:keep.major,spec:keep.spec,diff:keep.diff,dev:keep.dev,awards:keep.awards,scoops:keep.scoops});S.carry=keep;}
  S.phase='create';S.founder=1;S.scene='office';S.age0=keep&&keep.age!=null?Math.max(35,keep.age):40;S.ageT0=0;
  founderSetupMenu(keep);
}
function founderSetupMenu(keep){
  openModal('창간 준비 1/4 · 매체 형태',`<p class="lede">어떤 매체를 만들까? 처음엔 작게 시작해 키워 나간다.</p>`,FOUND_TYPES.map(([t,n,d,dp])=>({label:n,sub:d,fn:()=>{founderStep2(t,n,dp.split(','),keep);return false;}})));
}
function founderStep2(type,tn,depts,keep){
  const names={online:['오늘의 진실','팩트라인','뉴스바로'],weekly:['주간 시선','깊은 눈','주간 현장'],econ:['마켓인사이트','경제의 창','머니포커스'],local:['우리고장일보','바다마을신문','고을뉴스'],trade:['업계저널','산업인','테크인'],sports:['스포츠포인트','스타데일리','그라운드']}[type];
  const sug=names.concat(pick([['진실의 창','새벽뉴스','한줄일보'],['우리시대','바른소리','깊은물'],['내일신문','오늘의 기록','뉴스온']]));
  const leans=[['neu','중도','양쪽 독자를 두루. 관계망 충돌이 적다'],['cons','보수','성장·안보 독자층. 여당·기업과 가깝다'],['prog','진보','분배·노동 독자층. 야당·시민단체와 가깝다']].slice(0,type==='econ'?1:3);
  const taken=new Set(OUTLETS.filter(o=>!o.custom).map(o=>o.n));
  const clean=v=>v.replace(/[<>&"'`\\]/g,'').replace(/\s+/g,' ').trim().slice(0,12);
  openModal('창간 준비 2/4 · 제호와 논조',`<p>신문 이름(제호)을 직접 지어 보자. 1~12자. 아래 예시를 눌러 써도 된다.</p>
   <div class="field" style="max-width:none;margin-bottom:8px"><input id="fname" maxlength="12" placeholder="예: ${esc(sug[0])}" autocomplete="off" value="${esc(S.fname||'')}"></div>
   <div class="help-nav">${sug.map(n=>`<button type="button" data-fn="${esc(n)}">${esc(n)}</button>`).join('')}</div>
   <p id="fwarn" class="warn keep" style="min-height:1.2em"></p><p>그다음 논조를 고르면 제호가 확정된다. 논조는 독자층과 관계망에 영향을 준다.</p>`,
   leans.map(([l,ln,d])=>({label:`${ro2(ln)} 창간`,sub:d,fn:()=>{const v=clean(($('#fname')||{}).value||'');if(!v){$('#fwarn').textContent='제호를 입력해 주세요.';$('#fname').focus();return false;}if(taken.has(v)){$('#fwarn').textContent='이미 있는 언론사 이름이다. 다른 제호를 지어 주세요.';toast('이미 있는 언론사 이름이다');return false;}S.fname=v;founderTraitStep(type,tn,depts,v,l,keep);return false;}})).concat([{label:'뒤로 (매체 형태 다시 고르기)',cls:'ghost',fn:()=>{founderSetupMenu(keep);return false;}}]));
  document.querySelectorAll('[data-fn]').forEach(b=>b.onclick=()=>{const i=$('#fname');i.value=b.dataset.fn;i.focus();$('#fwarn').textContent='';});
  setTimeout(()=>{const i=$('#fname');if(i)i.focus();},50);
}
function founderTraitStep(type,tn,depts,nm,lean,keep){const ks=Object.keys(FOTR);
  openModal('창간 준비 3/4 · 회사의 성격',`<p>「${esc(nm)}」${jp(esc(nm),'은','는')} 어떤 회사가 될까? <b>2가지</b>를 고르자. 실제 수치에 반영되고, 나중에 바꿀 수 없다.</p>${ks.map(k=>`<label class="chk"><input type="checkbox" data-ft="${k}"><span><b>${FOTR[k].n}</b><small>${FOTR[k].d}</small></span></label>`).join('')}<p id="ftw" class="warn keep" style="min-height:1.2em"></p>`,[
   {label:'이 성격으로 정한다',sub:'2개를 고르지 않으면 무작위로 정해진다',fn:()=>{let sel=[...document.querySelectorAll('#mb input[data-ft]:checked')].map(x=>x.dataset.ft);if(sel.length>2)sel=sel.slice(0,2);while(sel.length<2){const k=pick(ks.filter(x=>!sel.includes(x)));sel.push(k);}S.fTraits=sel;founderStep3(type,tn,depts,nm,lean,keep);return false;}},
   {label:'뒤로',cls:'ghost',fn:()=>{founderStep2(type,tn,depts,keep);return false;}}]);
  document.querySelectorAll('#mb input[data-ft]').forEach(x=>x.onchange=()=>{const n=document.querySelectorAll('#mb input[data-ft]:checked').length;if(n>2){x.checked=false;try{x.closest('label').classList.remove('on');}catch(e){}toast('성격은 2개까지 — 다른 걸 고르려면 하나를 먼저 해제한다');}});}
function founderStep3(type,tn,depts,nm,lean,keep){
  const cap0={easy:36,normal:20,hard:11}[S.diff||'normal'];const mine=keep?keep.money:2000;const own=Math.floor(mine*.6/10000*10)/10;S.money=Math.max(0,mine-Math.round(own*10000));
  openModal('창간 준비 4/4 · 자본금',`<p>기본 자본 ${cap0}억 원 (지인·크라우드펀딩)${own>0?` + 내 돈 ${eok(own)} (통장의 60%를 넣고 ${S.money.toLocaleString('ko-KR')}만 원은 생활비로 남긴다)`:''}. 발행인 월급은 회사에서 나온다. 투자를 더 받을 수도 있지만 지분만큼 경영 간섭이 따라온다.</p>`,[
   {label:'투자 없이 시작',sub:`자본 ${eok(cap0+own)} · 편집권 온전`,fn:()=>{founderLaunch(type,tn,depts,nm,lean,cap0+own,0);return false;}},
   {label:'지역 기업 투자 유치 (+10억)',sub:'자본↑, 투자사 관련 기사에 압력',fn:()=>{founderLaunch(type,tn,depts,nm,lean,cap0+own+10,1);return false;}},
   {label:'대기업 계열 투자 (+25억)',sub:'자본 크게↑, 편집권 간섭 이벤트 잦음, 신뢰도 -5',fn:()=>{founderLaunch(type,tn,depts,nm,lean,cap0+own+25,2);return false;}}]);
}
function founderLaunch(type,tn,depts,nm,lean,cap,inv){
  const o=mkO('mine',nm,type,lean,'창업자 소유',2,`${jo2(S.name,'이','가')} 세운 ${tn}.`,depts.filter(d=>DEPTS[d]));o.custom=1;o.pay=Math.round(o.pay*.85);o.traits=(S.fTraits&&S.fTraits.length?S.fTraits:shuffle(Object.keys(FOTR)).slice(0,2)).slice(0,2);
  const i=OUTLETS.findIndex(x=>x.id==='mine');if(i>=0)OUTLETS.splice(i,1);OUTLETS.push(o);S.custom=o;
  S.phase='game';S.outlet='mine';S.co=initCo(o);S.co.cash=cap;S.co.staff=8;S.co.subs=o.subs*.1;S.co.tr=Math.round(o.tr*.12);S.co.q=50;S.rank=7;S.inRank=0;S.atOutlet=0;S.dept=o.depts[0];S.history=(S.carry?S.carry.history:[]).concat(['mine']);S.investor=inv;if(inv===2)S.trust=Math.max(0,S.trust-5);
  S.team=Array.from({length:6},()=>genMember(pick(o.depts),28,55));S.cols=founderCols(o,inv);initNet(null);ENTS.forEach(([id,n,kind,c])=>{if(kind==='gov'&&o.depts.some(d=>catOf(d).includes(c)))S.net[id].known=true;});
  initPortal(o);initComp();S.rival=makeFRival(o);S.fMix={rep:0,biz:0,edit:0};S.ap=apBase();S.fTier=1;fstInit();S.equity={0:100,1:85,2:70}[inv]||100;S.fSubs0=S.co.subs;S.fScoop0=S.scoops||0;S.fAward0=S.awards||0;S.goalSet=null;S.goals={};S.fStart=S.turn;S.fSubs0=S.co.subs;S.fAw0=S.awards||0;S.goalSet=null;S.cd={};checkUnlocks();
  log(`${nm} 창간 · 자본금 ${eok(cap)}`);tick(`새 매체 「${nm}」 창간`,1);
  openModal(`「${nm}」 창간`,`<p class="lede">공유오피스 한 칸, 노트북 몇 대. ${tn} 「${nm}」의 문을 열었다. 나는 <b>대표이자 1호 기자</b>다.</p><div class="card"><div class="t">창간 멤버</div><div class="meta">${S.cols.map(c=>`<span>${esc(c.name)} · ${colRole(c)}</span>`).join('')}</div></div><p>${jo2(rvLabel(),'이','가')} 이끄는 ${jo2(OUTLETS.find(x=>x.id===S.rival.outlet).n,'이','가')} 같은 시장의 경쟁자다. 광고주와 기자, 단독을 두고 부딪힌다.</p><p class="hint">매달 <b>직접 취재·기사</b>와 <b>경영</b>을 둘 다 하면 보너스, 하나를 비우면 손해다. 첫 1년 동안 등록·첫 월급·첫 광고·1주년 같은 창업 과정이 이어진다.</p><p>이번 창간의 목표 3가지가 정해졌다(기자 수첩 맨 위). <b>2가지를 이루면 창간 엔딩</b>, 셋 다 이루면 완전 클리어다. ★5 메이저·포털 CP·기자 80명을 모두 이루는 "메이저 언론" 엔딩도 있다. 자금이 바닥(쉬움 -8억 · 보통 -5억 · 어려움 -3억) 아래로 떨어지면 파산이다.</p><p class="hint">발행인은 편집과 경영을 모두 쥔다. 편집회의·1면은 물론, 인사권·연봉 정책·부서 신설·시설 투자·포털 전략·광고 영업까지 직접 한다. 매달 결산에서 성장 점수가 쌓이면 매체 위상이 오른다.</p>`,[{label:'시작',fn:()=>{render();return undefined;}}]);
}
function founderMonth(lines,fin){
  const o=OUT();const sc=S.co.q*.4+S.fame*.3+Math.log10(1+S.co.tr)*12+Math.log10(1+S.co.staff)*10+(S.portal?S.portal.lv*6:0)+Object.keys(S.facil||{}).length*2+fs('vis')*.12+fs('lead')*.04+fNPScore();S.fScore=sc;
  const need=[0,0,55,70,85,100][o.p+1]||999;
  if(o.p<5&&sc>=need&&S.co.staff>=[0,0,12,30,55,80][o.p+1]){o.p++;o.ad=+(o.ad*1.8).toFixed(2);o.subs*=1.4;o.tr=Math.round(o.tr*1.5);o.pay=Math.round(o.pay*1.1);lines.push({c:'g',t:`매체 위상이 ★${jo2(o.p,'으로','로')} 올랐다! 광고 단가와 영입 경쟁력이 오른다.`});log(`매체 위상 ★${o.p}`);tick(`「${o.n}」, 업계 ${['','','군소','중견','유력','메이저'][o.p]} 매체로 성장`,1);}
  else if(o.p>2&&S.fYk!==Math.floor(S.turn/YW)&&(S.fYk=Math.floor(S.turn/YW))&&S.turn-(S.oStT||S.fStart||0)>=YW*2&&sc<([0,0,55,70,85,100][o.p])*.75){starMove(o,-1,lines,true);}
  S.co.staff=Math.max(S.co.staff,S.team.length+2);
}
function founderOtrMonth(lines){const o=OUT();const sb=otr('subs'),ca=otr('cash'),q=otr('q');if(sb!==1)S.co.subs*=1+(sb-1)*.02;if(ca!==1)S.co.cash+=(ca-1)*o.p*.12;if(q!==1)S.co.q=clamp(S.co.q+(q-1)*1.5,10,100);}
function founderGoal(){const o=OUT();return o.p>=5&&S.portal&&S.portal.lv===3&&S.co.staff>=80;}

// --- 스토리 모드 ---
const STORIES=[
 {id:'rookie',n:'물먹은 수습',d:'대한일보 사건팀 수습기자. 수습 평가가 열리는 20주 차 이후, 단독 2건 이상과 평가 55 이상이면 정식 기자로 살아남는다. 24주가 끝이다. 취재하던 단독을 타사에 4번 뺏기면 탈락.',o:'daehan',rank:0,dept:'case',limit:24,minW:20,goal:()=>S.scoops>=2&&S.eval>=55,txt:()=>`단독 ${S.scoops}/2 · 평가 ${Math.round(S.eval)}/55 · 뺏긴 단독 ${S.lostN||0}/4`,fail:()=>(S.lostN||0)>=4},
 {id:'local',n:'지방지의 반란',d:'남부일보 자치행정부 기자. 3년 안에(평가는 9개월 차부터) 지역 토착 비리를 파헤쳐 이달의 기자상·대특종을 합쳐 2건 이상 내고, 회사가 흑자인 상태로 버텨라.',o:'nambu',rank:1,dept:'city',limit:144,minW:36,goal:()=>S.awards+(S.bigScoops||0)>=2&&S.co.last&&S.co.last.profit>0,txt:()=>`기자상+대특종 ${S.awards+(S.bigScoops||0)}/2 · 회사 월 손익 ${S.co.last?f1(S.co.last.profit):'-'}억`},
 {id:'xfile',n:'X파일',d:'주간탐사 탐사보도팀 기자. 2년 안에 태산그룹 회장 비자금 연속 보도 3탄을 완성하라. 소송·광고 압박·회유가 따라온다.',o:'tamsa',rank:1,dept:'inv',limit:96,goal:()=>(S.xfile||0)>=3,txt:()=>`X파일 ${S.xfile||0}/3탄 출고`},
 {id:'pbs',n:'무너진 공영방송',d:'신뢰가 바닥난 KNB 공영방송에 보도국장으로 부임했다. 1년 반 안에 신뢰도 80과 시청률 10% 회복.',o:'knb',rank:6,dept:'pol',limit:72,setup:()=>{S.trust=42;S.co.subs*=.82;S.storyBase=S.co.subs;S.fame=55;S.eval=55;},goal:()=>S.trust>=80&&S.co.subs>=S.storyBase*1.1,txt:()=>`신뢰도 ${Math.round(S.trust)}/80 · 시청률 ${f1(S.co.subs)}/${f1(S.storyBase*1.1)}%`},
 {id:'rescue',n:'적자 매체 살리기',d:'인터넷 매체 뉴스판의 대표가 됐다. 2년 안에 6개월 연속 흑자와 후원 회원 1.4배를 달성하라.',o:'newspan',rank:7,limit:96,setup:()=>{S.co.cash=6;S.storyBase=S.co.subs;S.fame=45;S.eval=60;S.trust=Math.max(S.trust,55);},goal:()=>(S.profitStreak||0)>=6&&S.co.subs>=S.storyBase*1.4,txt:()=>`연속 흑자 ${S.profitStreak||0}/6개월 · 후원 ${f1(S.co.subs)}/${f1(S.storyBase*1.4)}만 명`}
];
const STORY_BEATS={
 rookie:{2:()=>openModal('캡의 숙제',`<p class="lede">${S.capName} 캡: "이번 주 안에 경찰서 다섯 곳 형사 이름 다 외워 와."</p>`,[{label:'밤새 돈다',sub:'체력 -15, 인맥↑',fn:()=>{for(let i=0;i<2;i++)addSource('soc',R(15,25));toast(apply({hp:-15,eval:2,net:.8}));}},{label:'요령껏 넘긴다',fn:()=>toast(apply({eval:-2}))}]),
  8:()=>{const it=makeItem('soc',{excl:true,pre:1,keyConf:true,mult:1.1});it.heat+=3;S.items.push(it);openModal('타사 수습의 단독',`<p class="lede">라이벌 수습 ${jo2(S.rival.name,'이','가')} 단독을 냈다. 캡이 신문을 책상에 던졌다. 그날 밤, 형사 하나가 슬쩍 건넨 한마디 → 「${esc(it.title)}」</p>`);},
  16:()=>openModal('최후통첩',`<p class="lede">${S.capName} 캡: "남은 8주야. 단독 하나 못 가져오면 수습 연장이다."</p>`,[{label:'"가져오겠습니다"',fn:()=>toast(apply({men:1}))}])},
 local:{1:()=>{const it=makeItem('loc',{excl:true,keyConf:true,mult:1.3});it.title=`${REGIONS.nambu[2]}·단체장 측근 특혜 수주`;it.subj=REGIONS.nambu[2];it.ent='lcon';S.items.push(it);openModal('지역의 비밀',`<p class="lede">시청 주차장에서 만난 공무원이 서류 봉투를 건넸다. 「${esc(it.title)}」. ${jo2(REGIONS.nambu[2],'은','는')} 우리 신문 최대 광고주다.</p>`);},
  20:()=>openModal('광고주의 경고',`<p class="lede">${REGIONS.nambu[2]} 회장이 사장실을 찾았다. "계속 쓰면 올해 광고는 없습니다."</p>`,[{label:'편집국을 믿는다',sub:'광고 손실, 신뢰↑',fn:()=>{netUp('lcon',-30);S.co.adB-=.1;S.resist=(S.resist||0)+1;toast(apply({trust:4}));}},{label:'수위를 조절한다',fn:()=>{netUp('lcon',15);toast(apply({trust:-5}));}}]),
  60:()=>{const o=pick(OUTLETS.filter(x=>x.p>=4&&!x.custom));openModal('서울에서 온 전화',`<p class="lede">${o.n}에서 경력 제안이 왔다. "지방에서 썩기 아깝잖아요."</p>`,[{label:'남는다. 아직 할 일이 있다',fn:()=>toast(apply({trust:2,men:1}))},{label:'떠난다 (스토리 실패)',fn:()=>{ending('스토리 중단 · 서울로');return false;}}]);}},
 xfile:{1:()=>{S.items.push(makeStory(1));openModal('X파일',`<p class="lede">전직 비서실 직원이 USB를 내밀었다. "회장님 차명계좌예요. 이걸로 끝까지 가실 수 있어요?"</p><p>1탄 아이템이 생겼다. 1탄을 내면 2탄, 2탄을 내면 3탄 아이템이 이어진다.</p>`);},
  30:()=>openModal('회유',`<p class="lede">태산그룹 홍보실장이 호텔 커피숍으로 불렀다. "기자님 같은 분이 우리 회사에 오시면…" 연봉 두 배 제안이다.</p>`,[{label:'자리를 박차고 나온다',fn:()=>{S.resist=(S.resist||0)+1;toast(apply({trust:3,men:1}));}},{label:'고민해 본다고 말한다',sub:'신뢰도↓',fn:()=>toast(apply({trust:-4}))}]),
  60:()=>openModal('제보자의 전화',`<p class="lede">새벽 3시. 제보자가 떨리는 목소리로 말했다. "누가 집 앞에서 기다려요."</p>`,[{label:'변호사와 신변 보호를 알아본다',sub:'통장 -100만',fn:()=>{S.money-=100;toast(apply({trust:2}));}},{label:'경찰에 신고하라고만 한다',fn:()=>toast(apply({men:-2}))}])},
 pbs:{2:()=>openModal('불신임 투표',`<p class="lede">노조가 "낙하산 보도국장 반대" 피켓을 들었다. 첫 편집회의장이 썰렁하다.</p>`,[{label:'노조와 공개 토론',sub:'신뢰↑',fn:()=>{relUp(colBy('union'),15,'공개 토론');toast(apply({trust:3}));}},{label:'일로 증명하겠다',fn:()=>toast(apply({eval:1}))}]),
  12:()=>openModal('정치권의 전화',`<p class="lede">여당 실세가 전화했다. "그 리포트, 꼭 메인에 넣어야 합니까?"</p>`,[{label:'넣는다',fn:()=>{S.resist=(S.resist||0)+1;netUp('ruling',-15);toast(apply({trust:5}));}},{label:'뺀다',fn:()=>{netUp('ruling',10);toast(apply({trust:-6}));}}]),
  30:()=>openModal('파업 예고',`<p class="lede">기자협회가 경영진 퇴진을 요구하며 파업을 예고했다. 보도국장은 어느 편인가.</p>`,[{label:'기자들 편에 선다',sub:'신뢰↑ 이사회↓',fn:()=>toast(apply({trust:5,eval:-5}))},{label:'방송 사수를 호소한다',fn:()=>toast(apply({eval:3,trust:-2}))}])},
 rescue:{4:()=>openModal('후원 해지 행렬',`<p class="lede">지난주 기사 하나에 후원 회원 수천 명이 해지했다. "변했다"는 댓글이 쏟아진다.</p>`,[{label:'독자 간담회를 연다',sub:'구독↑',fn:()=>{S.co.bS+=.03;toast(apply({trust:2}));}},{label:'흔들리지 않는다',fn:()=>toast(apply({men:1}))}]),
  20:()=>openModal('포털 제휴 위기',`<p class="lede">포털 제휴 재평가에서 퇴출 후보에 올랐다. 낚시성 기사가 너무 많다는 이유다.</p>`,[{label:'낚시성 기사를 전부 정리한다',sub:'트래픽↓ 벌점↓',fn:()=>{S.portal.pen=0;S.co.bT-=.02;toast('정리 완료');}},{label:'버틴다',fn:()=>{S.portal.pen+=3;}}]),
  40:()=>openModal('구원 투자자',`<p class="lede">한 대기업 계열 투자사가 30억 투자를 제안했다. 조건은 이사 한 자리.</p>`,[{label:'받는다',sub:'자금↑, 편집권 우려',fn:()=>{S.co.cash+=30;S.investor=2;toast(apply({trust:-5}));}},{label:'거절한다',fn:()=>{S.resist=(S.resist||0)+1;toast(apply({trust:3}));}}])}
};
function makeStory(n){const T={1:['eco','태산그룹 회장 X파일 1탄 — 차명계좌',80,'a','태산그룹','d:*차명계좌 거래 내역|w:전 비서실 직원 "현금 다발을 옮겼다"|n:차명계좌 {n}개 자금 흐름|w:그룹 "사실무근"'],2:['eco','태산그룹 회장 X파일 2탄 — 해외로 간 비자금',84,'a','태산그룹','d:*해외 페이퍼컴퍼니 등기|n:송금액 {n}백억 원|w:현지 회계사 증언|s:페이퍼컴퍼니 주소지 현장'],3:['eco','태산그룹 회장 X파일 3탄 — 로비 장부',90,'a','태산그룹','d:*로비 장부 사본|w:장부 속 전직 의원 "기억이 안 난다"|n:로비 대상 {n}명|w:검찰 "수사 착수 검토"']}[n];
  const f=filler(vars());const it={id:uid(),ent:ENT.c4?'c4':findEnt(T[1],T[4],'eco'),base:T[1],title:T[1],d:'eco',subj:T[4],facts:parseFacts(T[5],f),imp:T[2],heat:40,excl:true,ideo:false,adv:true,hoax:false,alert:20*n,rebut:null,expert:0,tape:0,slot:null,chain:3,born:S.turn,src:'X파일',story:n};return it;}
function storyDef(){return STORIES.find(x=>x.id===S.story);}
// 스토리마다 주인공의 경력과 능력치가 다르다 (전공·스펙은 절반만 반영)
const STORY_PROFILE={
 rookie:{yrs:0,fame:0,money:300,who:'갓 입사한 수습. 체력과 패기는 있지만 인맥도 요령도 없다',st:{inv:32,ver:28,int:25,wri:30,hed:22,spd:35,net:16,cha:36,sta:58,men:40,kno:42,dat:22,lng:30,brd:15}},
 local:{yrs:5,fame:18,money:2400,src:4,who:'지역에서 5년을 버틴 기자. 동네 사정과 사람은 훤하지만 데이터·어학은 약하다',st:{inv:54,ver:46,int:50,wri:50,hed:40,spd:46,net:64,cha:58,sta:50,men:50,kno:55,dat:32,lng:24,brd:20}},
 xfile:{yrs:8,fame:30,money:3600,src:3,who:'8년 차 탐사기자. 끈질기고 꼼꼼하지만 느리고 사람을 잘 안 믿는다',st:{inv:70,ver:68,int:58,wri:62,hed:48,spd:34,net:50,cha:38,sta:48,men:58,kno:62,dat:60,lng:40,brd:18}},
 pbs:{yrs:22,fame:55,money:26000,src:6,who:'22년 차 방송기자 출신 보도국장. 방송감과 인맥은 최고지만 현장 감각은 녹슬었다',st:{inv:56,ver:64,int:62,wri:64,hed:66,spd:48,net:78,cha:64,sta:38,men:66,kno:76,dat:44,lng:52,brd:76}},
 rescue:{yrs:15,fame:45,money:12000,src:5,who:'15년 차 기자 출신 대표. 기획과 사람 다루는 솜씨는 있지만 돈 계산엔 서툴다',st:{inv:56,ver:54,int:56,wri:58,hed:62,spd:56,net:68,cha:66,sta:44,men:60,kno:62,dat:42,lng:40,brd:46}}};
function applyStoryProfile(st){const P=STORY_PROFILE[st.id];if(!P)return '';const b=bonusOf();Object.keys(STN).forEach(k=>{S.st[k]=clamp((P.st[k]??40)+Math.round((b[k]||0)/2),5,95);});
  S.fame=P.fame;S.money=P.money;if(P.yrs){S.turn=P.yrs*YW;S.atOutlet=Math.min(P.yrs,6)*YW;S.history=[S.outlet];}
  const ks=Object.keys(STN).sort((a,c)=>S.st[c]-S.st[a]);return `<div class="card" style="margin-top:8px"><div class="t">이번 주인공 · ${P.yrs?P.yrs+'년 차':'수습'}</div><p class="meta">${P.who}</p><p class="meta">강점 ${ks.slice(0,3).map(k=>`${STN[k]} ${S.st[k]}`).join(' · ')} / 약점 ${ks.slice(-3).map(k=>`${STN[k]} ${S.st[k]}`).join(' · ')}</p></div>`;}
function storySetup(){const st=storyDef();const o=OUTLETS.find(x=>x.id===st.o);join(o);
  S.rank=st.rank;S.inRank=0;if(o.depts.includes(st.dept))S.dept=st.dept;const prof=applyStoryProfile(st);S.storyStart=S.turn;S.deptT=S.turn;S.age0=26+Math.round(st.rank*4.5);S.ageT0=S.turn;S.lostN=0;S.bigScoops=0;
  if(st.rank>=1){S.items=[];const n=(STORY_PROFILE[st.id]||{}).src||2;for(let i=0;i<n;i++)addSource(S.dept,R(25,50));}
  if(st.rank>=2)S.team=genTeam();if(st.rank>=4){S.area=AREAS[cat1(S.dept)];}
  initNet(null);if(st.setup)st.setup();S.cd={};checkUnlocks();S.ap=apBase();
  openModal(`스토리 · ${st.n}`,`<p class="lede">${st.d}</p>${prof}<p class="hint">제한 ${Math.round(st.limit/4)}개월. 진행 상황은 '기자 수첩' 맨 위에 나온다.</p>`,[{label:'시작',fn:()=>{const b1=STORY_BEATS[S.story]&&STORY_BEATS[S.story][1];if(b1){S.storyB1=1;b1();return false;}render();return undefined;}}]);}
function storyBox(){const st=storyDef();if(!st)return '';const w=S.turn-(S.storyStart||0);return `<div class="card" style="border-color:var(--sodium)"><div class="t">스토리 · ${st.n}</div><p class="meta">${st.d}</p><div class="meta"><span>${st.txt()}</span><span>남은 기간 ${Math.max(0,st.limit-w)}주</span></div></div>`;}
function storyTick(Qx){if(!S.story)return;const st=storyDef();if(!st)return;const w=S.turn-(S.storyStart||0);
  const b=STORY_BEATS[S.story]&&STORY_BEATS[S.story][w];if(b&&!(w===1&&S.storyB1))Qx.push(b);
  if(S.storyNext&&S.storyNext.due<=S.turn){S.items.push(makeStory(S.storyNext.n));const n=S.storyNext.n;S.storyNext=null;Qx.push(()=>openModal(`X파일 ${n}탄의 실마리`,`<p class="lede">앞선 보도를 본 내부자가 연락해 왔다. ${n}탄 아이템이 생겼다.</p>`));}
  if(w>=(st.minW||0)&&st.goal()){Qx.push(()=>{ending(`스토리 클리어 · ${st.n}`);});return;}
  if((st.fail&&st.fail())||w>=st.limit)Qx.push(()=>{ending(`스토리 실패 · ${st.n}`);});}

// --- 목표 ---
function firstP(){const h=(S.history||[])[0];const o=h&&OUTLETS.find(x=>x.id===h);return o?o.p:OUT().p;}
const GOAL_POOL=[
 {id:'major5',g:'c',n:'메이저 입성',d:'★5 메이저 매체에서 차장 이상이 된다',p:()=>`지금 ★${OUT().p} ${rankName()}`,chk:()=>OUT().p>=5&&S.rank>=2},
 {id:'climb2',g:'c',n:'체급 올리기',d:'처음 입사한 회사보다 ★2 이상 큰 매체로 옮긴다',p:()=>`첫 회사 ★${firstP()} → 지금 ★${OUT().p}`,chk:()=>OUT().p-firstP()>=2},
 {id:'smallboss',g:'r',n:'작은 회사의 간판',d:'★2 이하 매체에서 부장 이상이 되고 단독 10건',p:()=>`★${OUT().p} ${rankName()} · 단독 ${S.scoops}/10`,chk:()=>OUT().p<=2&&S.rank>=3&&S.scoops>=10},
 {id:'bigdesk',g:'r',n:'큰 물의 데스크',d:'★4 이상 매체에서 부장 이상이 된다',p:()=>`지금 ★${OUT().p} ${rankName()}`,chk:()=>OUT().p>=4&&S.rank>=3},
 {id:'loyal',g:'l',n:'한 우물',d:'첫 회사에서 이직 없이 버틴다 (★3 이하 7년 · ★4 이상 10년)',p:()=>`${(S.history||[]).length>1?'이미 이직함':years()+'년 차'}`,chk:()=>(S.history||[]).length<=1&&years()>=(firstP()<=3?7:10)},
 // 커리어
 {id:'ceo',g:'c',nf:1,n:'사장실의 주인',d:'사장(대표)이 되어 임기를 마친다',p:()=>`현재 ${rankName()}`,chk:()=>false},
 {id:'chief',g:'c',nf:1,n:'편집국의 사령탑',d:'편집국장(보도국장)에 오른다',p:()=>`현재 ${rankName()}`,chk:()=>S.rank>=6},
 {id:'icon',g:'c',n:'신뢰의 아이콘',d:'부장 이상에서 신뢰도 90·평판 80 이상, 오보 3건 이하',p:()=>`신뢰 ${Math.round(S.trust)}/90 · 평판 ${Math.round(S.fame)}/80 · 오보 ${S.errors}/3`,chk:()=>S.rank>=3&&S.trust>=90&&S.fame>=80&&S.errors<=3},
 {id:'guard',g:'c',n:'편집권의 수호자',d:'편집국장 이상에서 외부 압력을 5번 버틴다',p:()=>`버틴 횟수 ${S.resist||0}/5`,chk:()=>S.rank>=6&&(S.resist||0)>=5},
 {id:'hopper',g:'c',nf:1,n:'저니맨',d:'서로 다른 매체 4곳을 거친다',p:()=>`${new Set(S.history).size}/4곳`,chk:()=>new Set(S.history).size>=4},
 {id:'cp',g:'c',n:'포털의 문을 열다',d:'부국장 이상에서 회사가 포털 콘텐츠 제휴(CP)를 따낸다',p:()=>`포털 ${S.portal?PORTAL[S.portal.lv]:'-'}`,chk:()=>S.rank>=4&&S.portal&&S.portal.lv===3&&S.portalStart!=null&&S.portalStart<3},
 // 취재
 {id:'legend',g:'r',n:'전설의 취재기자',d:'이달의 기자상 4회 + 단독 40건',p:()=>`기자상 ${S.awards}/4 · 단독 ${S.scoops}/40`,chk:()=>S.awards>=4&&S.scoops>=40},
 {id:'scoop25',g:'r',n:'단독 제조기',d:'단독 25건',p:()=>`단독 ${S.scoops}/25`,chk:()=>S.scoops>=25},
 {id:'award2',g:'r',n:'기자상 수상자',d:'이달의 기자상 2회',p:()=>`기자상 ${S.awards}/2`,chk:()=>S.awards>=2},
 {id:'big3',g:'r',n:'대특종 사냥꾼',d:'대특종 3건',p:()=>`대특종 ${S.bigScoops||0}/3`,chk:()=>(S.bigScoops||0)>=3},
 {id:'clean',g:'r',n:'무결점 기자',d:'기사 80건을 쓰는 동안 오보 0건',p:()=>`기사 ${S.totalArticles||0}/80 · 오보 ${S.errors}`,chk:()=>(S.totalArticles||0)>=80&&S.errors===0},
 {id:'desk30',g:'r',nf:1,n:'명데스크',d:'데스킹 30회',p:()=>`데스킹 ${S.flags.desked||0}/30`,chk:()=>(S.flags.desked||0)>=30},
 // 사람·생활
 {id:'home',g:'l',nf:1,n:'내 집 마련',d:'월급을 모아 내 집을 산다',p:()=>`통장 ${S.money.toLocaleString('ko-KR')}만 · 필요 현금 ${Math.round(housePrice()*.3).toLocaleString('ko-KR')}만`,chk:()=>!!S.house},
 {id:'rich',g:'l',n:'억대 통장',d:'통장과 저축을 합쳐 1억 원',p:()=>`${(S.money+(S.savings||0)).toLocaleString('ko-KR')}/10,000만`,chk:()=>S.money+(S.savings||0)>=10000},
 {id:'net8',g:'l',n:'마당발',d:'관계 60 이상인 기관·인물·광고주 8곳',p:()=>`${S.net?Object.values(S.net).filter(e=>e.rel>=60).length:0}/8곳`,chk:()=>S.net&&Object.values(S.net).filter(e=>e.rel>=60).length>=8},
 {id:'loved',g:'l',n:'사내 인기인',d:'동료 5명과 관계 60 이상',p:()=>`${(S.cols||[]).filter(c=>c.rel>=60).length}/5명`,chk:()=>(S.cols||[]).filter(c=>c.rel>=60).length>=5},
 {id:'source10',g:'l',n:'취재원 부자',d:'신뢰 50 이상 취재원 10명',p:()=>`${S.sources.filter(x=>x.trust>=50).length}/10명`,chk:()=>S.sources.filter(x=>x.trust>=50).length>=10}
];
const FOUNDER_GOALS=[
 // 성장
 {id:'f_star4',g:'c',n:'메이저의 반열',d:'매체 위상을 ★4 이상으로 키운다',p:()=>`매체 위상 ★${OUT()?OUT().p:0}/4`,chk:()=>OUT()&&OUT().p>=4},
 {id:'f_staff50',g:'c',n:'40인의 편집국',d:'기자 40명 이상을 거느린다',p:()=>`기자 ${S.co?S.co.staff:0}/40명`,chk:()=>S.co&&S.co.staff>=40},
 {id:'f_dept8',g:'c',n:'종합 언론사',d:'부서를 8개 이상으로 늘린다',p:()=>`부서 ${OUT()?OUT().depts.length:0}/8개`,chk:()=>OUT()&&OUT().depts.length>=8},
 {id:'f_facil6',g:'c',n:'번듯한 사옥',d:'시설·개선 투자 6곳 이상',p:()=>`시설 ${Object.keys(S.facil||{}).length}/6곳`,chk:()=>Object.keys(S.facil||{}).length>=6},
 // 경영
 {id:'f_streak',g:'r',n:'흑자 경영',d:'12개월 연속 흑자',p:()=>`${S.profitStreak||0}/12개월`,chk:()=>(S.profitStreak||0)>=12},
 {id:'f_cash50',g:'r',n:'곳간이 든든하다',d:'회사 자금 50억 원',p:()=>`${S.co?f1(S.co.cash):0}/50억`,chk:()=>S.co&&S.co.cash>=50},
 {id:'f_share20',g:'r',n:'시장의 강자',d:'경쟁 매체 사이 광고 점유율 20% 이상',p:()=>`점유율 ${f1(S.myShare||0)}/20%`,chk:()=>(S.myShare||0)>=20},
 {id:'f_cp',g:'r',n:'포털의 문을 열다',d:'포털 콘텐츠 제휴(CP)를 따낸다',p:()=>`포털 ${S.portal?PORTAL[S.portal.lv]:'-'}`,chk:()=>S.portal&&S.portal.lv===3},
 // 저널리즘
 {id:'f_scoop30',g:'l',n:'작지만 날카롭게',d:'창간 후 단독 30건',p:()=>`단독 ${S.scoops-(S.fScoop0||0)}/30`,chk:()=>S.scoops-(S.fScoop0||0)>=30},
 {id:'f_award',g:'l',n:'신생 매체의 기자상',d:'창간 후 이달의 기자상 수상',p:()=>`기자상 ${S.awards-(S.fAward0||0)}/1`,chk:()=>S.awards-(S.fAward0||0)>=1},
 {id:'f_subs10',g:'l',n:'독자가 키운 매체',d:'구독·후원 독자를 창간 때의 10배로',p:()=>`${S.co&&S.fSubs0?f1(S.co.subs/S.fSubs0):'1'}/10배`,chk:()=>S.co&&S.fSubs0&&S.co.subs>=S.fSubs0*10},
 {id:'f_indep',g:'l',n:'독립 언론의 자존심',d:'외부 투자 없이 신뢰도 85 이상',p:()=>`신뢰 ${Math.round(S.trust)}/85${S.investor?' · 투자 받음(달성 불가)':''}`,chk:()=>!S.investor&&S.trust>=85}
];
function goalSetup(){if(S.founder){const P=FOUNDER_GOALS;S.goalSet=['c','r','l'].map(k=>pick(P.filter(g=>g.g===k)).id);S.portalStart=S.portal?S.portal.lv:null;return;}const ok=g=>(S.founder?g.fo:!g.fo)&&!(S.simple&&['net8','loved','source10','desk30'].includes(g.id));const pickG=k=>{const c=GOAL_POOL.filter(g=>g.g===k&&ok(g)&&!S.goalSet.includes(g.id)&&!(g.id==='loyal'&&S.goalSet.includes('hopper'))&&!(g.id==='hopper'&&S.goalSet.includes('loyal')));return c.length?pick(c).id:null;};
  S.goalSet=[];['c','r','l'].forEach(k=>{const id=pickG(k);if(id)S.goalSet.push(id);});while(S.goalSet.length<3){const c=GOAL_POOL.filter(g=>ok(g)&&!S.goalSet.includes(g.id));if(!c.length)break;S.goalSet.push(pick(c).id);}
  S.portalStart=S.portal?S.portal.lv:null;}
function myGoals(){if(!S.goalSet||!S.goalSet.length||(S.founder&&!S.goalSet[0].startsWith('f_')))goalSetup();return S.goalSet.map(id=>GOAL_POOL.find(g=>g.id===id)||FOUNDER_GOALS.find(g=>g.id===id)).filter(Boolean);}
const GOALS=GOAL_POOL;
function goalCheck(){S.goals=S.goals||{};const out=[];myGoals().forEach(g=>{if(!S.goals[g.id]&&g.chk()){S.goals[g.id]=dateShort();out.push(g);}});return out;}

// --- 이직 ---
// 이직할 때 회사 규모 차이에 따라 직급이 조정된다 (큰 곳으로 가면 내려갈 수 있고, 작은 곳이면 올려 준다)
function offerFor(o){const cur=OUT();const ok=S.fame+S.eval/3+R(-6,6)>=o.p*12-6;const dp=o.p-cur.p;let adj=0;
  if(dp>=2)adj=chance(.2)&&S.rank>=3?-2:chance(.75)?-1:0;else if(dp===1)adj=chance(.4)?-1:0;else if(dp===0)adj=S.fame>=40&&chance(.12)?1:0;else if(dp===-1)adj=chance(.45)?1:0;else adj=chance(.2)?2:chance(.75)?1:0;
  if(adj<=0&&['tv','wire'].includes(o.type)!==['tv','wire'].includes(cur.type)&&chance(.2))adj-=1;
  let r=clamp(S.rank+adj,1,5);r=fitRank(r,o);if(r<1)r=1;let capped=false;if(r>S.rank&&!S.story){const r2=Math.max(S.rank,Math.min(r,ageCapRank(o)));capped=r2<r;r=r2;}const d=r-S.rank;
  return{o,ok,rank:r,adj:d,capped,why:d<0?(dp>0?'큰 회사라 한 단계 낮춰 들어간다':'매체 성격이 달라 경력을 덜 쳐준다'):d>0?(dp<0?'작은 회사라 직급을 올려 모신다':'스카우트 대우'):''};}
RUN.job=function(){
  spend(1,3);setCd('job');const offs=shuffle(OUTLETS.filter(o=>o.id!==S.outlet&&!o.closed)).slice(0,R(6,9)).map(offerFor).sort((a,b)=>b.ok-a.ok||b.o.p-a.o.p);
  openModal('경력기자 채용 공고',`<p>헤드헌터와 전 동료들을 통해 경력기자 공고 ${offs.length}건을 찾았다. 내 평판 <b class="num">${Math.round(S.fame)}</b>. 다음 탐색은 반년 뒤에나 가능하다.</p>`,offs.map(f=>{f.deal=f.deal||jobDeal(f);return f;}).map(f=>({label:`${f.o.n}`,tag:`★${f.o.p} ${TYPES[f.o.type].n}`,rec:f.ok&&f.deal.pros.length>f.deal.cons.length,sub:f.ok?`${rankName(f.rank,f.o)} 대우 · ${f.deal.sum} · 좋은 점 ${f.deal.pros.length} / 아쉬운 점 ${f.deal.cons.length}`:'서류에서 떨어질 것 같다',disabled:!f.ok,fn:()=>{confirmMove(f);return false;}})).concat([{label:'지금 회사에 남는다',cls:'ghost'}]));
};
function confirmMove(f){
  openModal('이직 결심',`<p class="lede">${f.o.n}(${TYPES[f.o.type].n} · ${LEAN[f.o.lean]} · ★${f.o.p})로 옮긴다. ${rankName(f.rank,f.o)} 대우.</p>${f.adj?`<p class="${f.adj<0?'warn':'fx'}">직급 재조정: 지금 ${rankName()} → ${rankName(f.rank,f.o)} — ${f.why}.</p>`:''}${(f.deal=f.deal||jobDeal(f))&&''}<p class="fx"><b>한 줄 요약</b> — ${esc(f.deal.sum)}</p>${dealHTML(f.deal)}<p class="hint">${orgK(f.o).n}</p><p class="hint">회사 특성: ${traitsOf(f.o).map(t=>`<b>${otrDef(t).n}</b> — ${otrDef(t).d} (${otrFxTxt(otrDef(t).fx)})`).join('<br>')}</p><p>${esc(f.o.d)}</p><p>취재원은 데려가지만 진행 중인 아이템과 부서원은 두고 간다.</p>`,[
    {label:'사표를 낸다',sub:f.deal.sum,fn:()=>{if(S.jobBind&&S.turn<S.jobBind.until){S.money-=S.jobBind.amt;log(`의무 근무 위반 — 보너스 ${S.jobBind.amt}만 원 반환`);}S.jobBind=null;transfer(f.o,f.rank);S.payK=f.deal.payK;if(f.deal.bonus){S.money+=f.deal.bonus;S.jobBind={until:S.turn+YW*2,amt:f.deal.bonus};}openModal('새 출근',`<p class="lede">${f.o.n} 편집국에 첫 출근했다. 경력 기자를 보는 눈빛이 날카롭다.</p>`);return false;}},
    {label:'다시 생각해본다',cls:'ghost'}]);
}
// 옮긴 뒤 실제로 받게 될 직급 (매체 규모·연차 상한 반영) — 제안 문구와 실제 직급이 어긋나지 않게
function xferRank(o,r){let k=fitRank(clamp(r,1,7),o);if(k<1)k=1;if(!S.story&&!S.founder&&k>S.rank)k=Math.max(S.rank,Math.min(k,ageCapRank(o)));return k;}
const ARC_CO=['adKill','owner','mna','mega','regime','scandal','fabric'];
// 회사에 묶인 상태는 두고 간다 (광고 단가·비용 절감·임금 인상·특별취재팀·경영 전략·연중 기획·KPI·행사·회사 위기)
function leaveCompany(){S.adRate=1;S.costCut=null;S.payRaise=0;S.payRaiseT=null;S.tf=null;S.coMode=null;S.coModeY=[];S.coPr=[];S.coPwK=1;S.cHit=0;S.myShare00=null;S.myShare0=null;S.myShare=null;S.agenda=null;S.kpi=null;S.adQ=0;S.ceoBad=0;S.ceoTerm=null;S.compDrift=0;S.poachT=null;S.erp=null;
  if(S.lge)S.lge=S.lge.filter(e=>e.done);if(S.arc2&&ARC_CO.includes(S.arc2.id))S.arc2=null;S.mis=null;if(S.flags)S.flags.adPush=0;}
function transfer(o,rank){S.perfK=1;S.disc=0;leaveCompany();
  rank=fitRank(rank,o);if(!S.story&&!S.founder&&rank>S.rank)rank=Math.max(S.rank,Math.min(rank,ageCapRank(o)));
  log(`${OUT().n} → ${o.n} 이직 (${rankName(rank,o)})`);tick(`${S.name} 기자, ${OUT().n}에서 ${o.n}로`,1);S.outlet=o.id;S.rank=rank;S.inRank=0;S.atOutlet=0;S.co=initCo(o);S.items=[];S.eval=55;S.fame=clamp(S.fame+2,0,100);S.reqDept=null;S.cd.job=S.turn+48;
  if(!o.depts.includes(S.dept))S.dept=o.depts.find(d=>catOf(d).includes(cat1(S.dept)))||o.depts[0];if(S.rank>=4)S.area=AREAS[cat1(S.dept)];
  S.team=rank>=2?genTeam():[];initColleagues(false);initNet(S.net);initPortal(o);initComp();S.history.push(o.id);S.scene=baseScene();S.rival=rivalKeep();ach('move');try{pgAfterMove('co');}catch(e){}
}
function makeRival(){const o=pick(OUTLETS.filter(x=>x.id!==S.outlet&&!x.closed&&Math.abs(x.p-OUT().p)<=1));return{name:rname(),outlet:o.id,skill:Math.round(skillYrs(S.turn/YW)+R(2,10)),wins:0};}