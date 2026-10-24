/* 바이라인 1.6 — src/systems/routes.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */

// ===== 기자의 길 하나로: 기자 유형 넷 + 좋은 길 셋 + 어두운 길 다섯 = 열두 갈래 =====
const PATH12=[['scoop','s'],['fact','s'],['net','s'],['buzz','s'],['watch','r'],['voice','r'],['fact','r'],['gov','r'],['gire','r'],['poli','r'],['agit','r'],['hire','r']];
function pathKey(p){return p[1]+':'+p[0];}
function pathDef(p){return p[1]==='s'?STYLE[p[0]]:ROUTE[p[0]];}
function pathKind(p){if(p[1]==='s')return 'type';return ROUTE[p[0]].good?'good':'dark';}
// 길마다 쌓이는 성향: 기자 유형은 기존 성향 점수, 나머지 여덟 길은 내가 일하는 방식에서 쌓인다
function rAffMonth(){if(S.story)return;const A=S.mAct||{},t=S.turn,M=mine().filter(c=>c.turn>t-4),V=valS();const F=S.rAff=S.rAff||{};const add=(k,v)=>{F[k]=Math.max(0,(F[k]||0)+v);};
  add('gov',M.filter(c=>c.fac==='gov'&&!c.crit).length*2+Math.max(0,-V.ind)/25);
  add('gire',M.filter(c=>c.bait||(c.q||60)<45).length*1.5+M.filter(c=>(c.views||0)>=30000).length*.5+Math.max(0,-V.pb)/25);
  add('poli',(oHas(D_POL)?((A.network||0)+(A.drink||0)*.6+(A.source||0)*.3):0)+Math.max(0,-V.ind)/30);
  add('agit',M.filter(c=>c.ang==='cons'||c.ang==='prog').length*1.5+(S.rep?Math.abs((S.rep.cons||0)-(S.rep.prog||0))/40:0));
  add('hire',(A.adsell||0)*1.5+M.filter(c=>c.adv&&!c.crit).length*1.5+Math.max(0,-V.ind)/30);
  add('watch',M.filter(c=>c.crit&&c.fac).length*2+Math.max(0,V.ind)/25);
  add('voice',M.filter(c=>c.ang==='hu'||c.ang==='re').length*1.5+(A.hari||0)*.3+Math.max(0,V.pb)/25);
  add('rfact',M.filter(c=>(c.q||0)>=68&&c.rb).length*1.2+Math.max(0,-V.sp)/25-((S.errT||[]).filter(x=>x>t-4).length)*3);
  for(const k in F)F[k]=+(F[k]*.97).toFixed(2);}
function pathAff(p){if(p[1]==='s')return (S.sty||{})[p[0]]||0;return (S.rAff||{})[p[0]==='fact'?'rfact':p[0]]||0;}
function pathCur(){if(S.route)return ['r',S.route.k];if(S.styT&&!S.founder)return ['s',S.styT];return null;}
// 제안 AI: 내가 일하는 방식을 읽고 가장 가까운 길로 유혹하거나 부른다
function rAffPick(cands){const F=S.rAff||{};const w=cands.map(k=>.6+(F[k==='fact'?'rfact':k]||0)/4);let r=Math.random()*w.reduce((a,b)=>a+b,0);for(let i=0;i<cands.length;i++){r-=w[i];if(r<=0)return cands[i];}return cands[cands.length-1];}
function rAffTop(){const F=S.rAff||{};return Math.max(0,...Object.values(F));}
// 하나로 묶은 기자의 길 카드
function styleHTML(){if(!S||S.story)return '';const P=S.sty||{};const cur=pathCur();const fd=S.founder;
  const L=PATH12.filter(p=>!(fd&&p[1]==='s'));const mx=Math.max(10,...L.map(pathAff));
  const tile=p=>{const D=pathDef(p),kd=pathKind(p),on=cur&&cur[0]===p[1]&&cur[1]===p[0];const c=kd==='type'?(D.c||'#77a6ff'):kd==='good'?'var(--good)':'var(--red)';const a=pathAff(p);
    return `<div class="p12 ${on?'on':''}" style="--pc:${c}"><b>${esc(D.n)}</b><small>${kd==='type'?'유형':kd==='good'?'좋은 길':'어두운 길'}</small><i style="width:${Math.round(Math.min(1,a/mx)*100)}%"></i></div>`;};
  let head='',body='';
  if(cur){const p=[cur[1],cur[0]],D=pathDef(p),kd=pathKind(p);
    if(kd==='type'){head=`<b style="color:${D.c}">${esc(D.n)}</b>`;body=`<p class="hint" style="margin:6px 0 0"><span style="color:var(--good)">이점</span> ${esc(D.up)}<br><span style="color:var(--red)">단점</span> ${esc(D.down)}<br>더 깊이 가려면 좋은 길이나 어두운 길의 부름에 응할 수 있다. 그 길에 들어서면 지금 유형은 잠시 접힌다.</p>`;}
    else{const Rt=S.route;head=`<b style="color:${kd==='good'?'var(--good)':'var(--red)'}">${esc(D.n)}</b> · ${esc(D.lv[Rt.lv-1])}`;
      body=`<div class="mgk" style="margin-top:6px"><span style="flex:0 0 76px;font-size:12.5px">${kd==='good'?(Rt.k==='watch'?'권력의 압박':Rt.k==='voice'?'소진':'고립'):'노출 위험'}</span><div class="mgbar"><i style="width:${Rt.heat}%;background:${kd==='good'?'var(--sodium)':'var(--red)'}"></i></div><span class="mgs" style="font-size:12px">${Math.round(Rt.heat)}</span></div><p class="hint" style="margin:4px 0 6px">업계는 나를 「${esc(D.persona)}」${/[가-힣]/.test(D.persona.slice(-1))&&(D.persona.slice(-1).charCodeAt(0)-44032)%28?'이라':'라'} 부른다 · 고유 업무 「${D.act}」 · ${esc(D.pass)}<br><span style="color:var(--good)">이점</span> ${D.up}<br><span style="color:var(--red)">단점</span> ${D.down}<br>끝까지 가면 「${D.end}」${D.fall?`, ${kd==='good'?'꺾이면':'들키면'} 「${D.fall}」`:''}.</p><button type="button" class="btn" onclick="routeQuit();render();">${kd==='good'?'이 길을 내려놓는다':'손을 씻는다'}</button>`;}}
  else{const top=L.slice().sort((a,b)=>pathAff(b)-pathAff(a))[0];const wait=fd?0:Math.max(0,24-Math.max(S.atOutlet||0,S.turn||0));
    body=`<p class="hint" style="margin:6px 0 0">${pathAff(top)>0?`지금 가장 가까운 길은 「${esc(pathDef(top).n)}」. `:''}${wait>0?`${moTxt(wait)} 더 일하면 유형이 정해진다. `:''}어떻게 일하느냐가 길을 고른다. 단독을 쫓으면 스쿠프 헌터, 권력을 때리면 감시견, 정부 자료를 받아쓰면 어용, 돈 받고 쓰면 청부. 막대가 길수록 그 길의 부름이 먼저 온다.</p>`;}
  return `<div class="card rkc styc"><div class="t">${ic('user')} 기자의 길 · ${head||'아직 색이 없다'}</div><div class="p12g">${L.map(tile).join('')}</div>${body}</div>`;}
// 윗선 AI: 내가 걷는 길을 보고 일을 맡기거나 견제한다 (기자 유형 포함 열두 갈래 모두)
function pathBossAI(lines){if(S.founder||S.story||S.rank<1||S.rank>5||!chance(.1))return;const cur=pathCur();if(!cur)return;const bs=colBy('boss');if(!bs)return;const k=cur[0]+':'+cur[1];const k2=oidOf();
  const say=(t,f)=>{lines.push({c:'',t:`${jo2(bs.name,'이','가')} ${t}`});try{f&&f();}catch(e){}};
  if(k==='s:scoop')say('큰 건을 맡겼다. "이건 네가 해. 단독 감이야."',()=>{const it=makeItem(S.dept,{excl:true,mult:1.1});S.items.push(it);});
  else if(k==='s:fact')say('후배 원고를 봐 달라고 했다. 데스크의 신임이 두텁다',()=>apply({eval:.6}));
  else if(k==='s:net')say('출입처 고위 인사를 소개해 달라고 부탁했다',()=>relUp(bs,3,'인맥 소개'));
  else if(k==='s:buzz')say('"오늘 속보는 네가 받아." 온라인 당번을 맡겼다',()=>{S.hp=clamp(S.hp-3,0,100);apply({fame:.4});});
  else if(k==='r:watch'){if(['gov','corp','lord','industry'].includes(k2))say('따로 불렀다. "회사 사정도 생각해. 너무 세게 가지 마."',()=>{relUp(bs,-2,'감시 보도 견제');if(S.route)S.route.heat+=3;});else say('"뒤는 내가 막을게. 끝까지 가 봐."',()=>{relUp(bs,2,'감시 보도 지지');if(S.route)S.route.heat=Math.max(0,S.route.heat-4);});}
  else if(k==='r:voice'){if(['click','gossip','short'].includes(k2))say('"조회수 안 나오는 건 줄여." 연속 보도 지면을 깎았다',()=>apply({eval:-.4}));else say('연속 보도를 기획 지면으로 키워 줬다',()=>apply({eval:.5}));}
  else if(k==='r:fact')say('사내 검증 회의를 맡겼다. 동료들 눈초리가 따갑다',()=>{apply({eval:.4});if(S.route)S.route.heat+=2;});
  else if(k==='r:gov'||k==='r:hire'){if(['truth','opp','public'].includes(k2))say('"우리 회사 이름 더럽히지 마." 경고를 받았다',()=>{relUp(bs,-4,'길 경고');if(S.route)S.route.heat+=6;});else say('내 실적을 칭찬했다. 무엇 덕분인지는 묻지 않았다',()=>relUp(bs,2,'실적'));}
  else if(k==='r:gire'){if(['click','gossip','short','fandom'].includes(k2))say('"이번 달도 조회수 1등이네." 어깨를 두드렸다',()=>relUp(bs,2,'조회수'));else say('"정정보도가 너무 많다." 경고를 받았다',()=>{relUp(bs,-3,'정정 경고');if(S.route)S.route.heat+=4;});}
  else if(k==='r:agit'){say('"방송은 좋은데, 회사 이름은 빼." 겸업 신고서를 내밀었다',()=>{if(S.route)S.route.heat+=3;});}
  else if(k==='r:poli'){say('"의원실이랑 너무 붙어 다니지 마. 말 나온다."',()=>{if(S.route)S.route.heat+=4;});}}
// 동료 AI: 동료들도 각자의 길을 걷고, 나를 끌어당기거나 도움을 청한다
function colPath(c){if(!c)return null;if(!c.path){const h=otrHash(c.name||'x');c.path=PATH12[h%PATH12.length];}return c.path;}
function pathPeerAI(lines){if(S.founder||S.story||S.rank<1||!chance(.08))return;const L=(S.cols||[]).concat(S.mates||[]).filter(c=>c&&c.name&&c.rel!=null);if(!L.length)return;const c=pick(L);const p=colPath(c),D=pathDef(p),kd=pathKind(p);
  if(kd==='dark'&&!S.route){(S.rAff=S.rAff||{})[p[0]]=((S.rAff||{})[p[0]]||0)+3;Q.push(()=>openModal('동료의 권유',`<p class="lede">${esc(jo2(c.name,'이','가'))} 술자리에서 말했다. "너도 ${esc(ro2(D.n))} 와. 편하게 살자. 다들 그렇게 해."</p><p class="hint">${esc(D.up)}<br>${esc(D.down)}</p>`,[{label:'관심 있다고 한다',sub:`그 길의 부름이 빨리 온다 · ${jo2(c.name,'과','와')} 가까워진다`,fn:()=>{c.rel=clamp(c.rel+5,-50,100);S.routeT=-999;(S.rAff||{})[p[0]]+=6;}},{label:'선을 긋는다',sub:'사이가 조금 멀어진다 · 독립 쪽으로',fn:()=>{c.rel=clamp(c.rel-4,-50,100);valN('ind',2);}}]));}
  else if(kd==='good'&&S.route&&!ROUTE[S.route.k].good){S.route.heat=Math.min(100,S.route.heat+5);lines.push({c:'r',t:`${jo2(D.n,'을','를')} 걷는 ${esc(jo2(c.name,'이','가'))} 내 기사들을 유심히 보고 있다. 노출 위험이 커졌다`});}
  else if(kd==='good'){Q.push(()=>openModal('동료의 부탁',`<p class="lede">${esc(jo2(D.n,'을','를'))} 걷는 ${esc(jo2(c.name,'이','가'))} 도움을 청했다. "이거 혼자서는 못 해. 같이 해 줄래?"</p>`,[{label:'돕는다',sub:'행동력 1 · 관계↑ · 신뢰↑',fn:()=>{spend(1,4);c.rel=clamp(c.rel+6,-50,100);toast(apply({trust:.8}));}},{label:'바쁘다고 한다',cls:'ghost',fn:()=>{c.rel=clamp(c.rel-3,-50,100);}}]));}
  else lines.push({c:'',t:`${esc(jo2(c.name,'이','가'))} 요즘 「${D.n}」 소리를 듣는다`});}

function meProfileBox(){if(S.story)return '';const row=(t,main,sub,det)=>`<div class="prow"><span class="pk">${t}</span><div class="pv"><b>${main}</b>${sub?`<small>${sub}</small>`:''}${det?`<details class="fold sm"><summary>자세히</summary><p class="hint">${det}</p></details>`:''}</div></div>`;const L=[];
  const T=trs();if(T.length)L.push(row('성격',T.map(t=>esc(t.n)).join(' · '),T.map(t=>`<span style="color:var(--good)">${esc(t.up.split(' · ')[0])}</span> / <span style="color:var(--red)">${esc(t.down.split(' · ')[0])}</span>`).join('<br>'),T.map(t=>`<b>${esc(t.n)}</b> — ${esc(t.d)}. ${esc(t.up)} · ${esc(t.down)}`).join('<br>')));
  else L.push(`<div class="prow"><span class="pk">성격</span><div class="pv"><button type="button" class="btn sm" onclick="traitPick(()=>render())">성격 고르기</button></div></div>`);
  if(!S.founder&&S.rank<4&&DEPT_FX[S.dept]){const P=deptPC(S.dept);L.push(row('부서',`${esc(DEPTS[S.dept].n)}${S.deptNew>S.turn?' <span class="tg new">새 눈</span>':''}`,`<span style="color:var(--good)">${esc(P.up[0]||'')}</span> / <span style="color:var(--red)">${esc(P.dn[0]||'')}</span>`,`${deptPCtxt(S.dept)}<br>거친 부서 ${deptBreadth()+1}곳 · 여러 부서를 거칠수록 평가가 잘 오른다`));}
  if(S.spec2){const P=S.spec2,need=[0,8,20,40][P.lv];L.push(row('전문',`${esc(SPEC2[P.k].n)} ${P.lv}단계`,need?`다음 단계까지 ${Math.max(0,need-P.xp)} · 할 일 「${SPEC2[P.k].act}」`:'최고 단계',`${esc(SPEC2[P.k].up)} · 단점: ${esc(SPEC2[P.k].down||'')}`));}
  else if(spec2Can())L.push(`<div class="prow"><span class="pk">전문</span><div class="pv"><button type="button" class="btn sm" onclick="spec2Pick()">전문 분야 고르기</button></div></div>`);
  return `<div class="card"><div class="t">${ic('user')} 나라는 기자</div>${L.join('')}</div>`;}
// ---- 한 달 맡기기: 방향만 고르면 이번 달 할 일을 알아서 하고, 중요한 선택만 묻는다 ----
const AUTO_DIR={
 scoop:{n:'단독 위주',d:'발굴·뻗치기·취재로 단독을 쫓고, 확인되면 바로 쓴다',acts:['write','invest','hari','discover','beat','cfile','fassign','spx','sasu','report','source'],pref:/단독|쓴다|파고|뻗친|출고|송고|끝낸다|밀어붙/},
 safe:{n:'안전하게',d:'확인을 꼼꼼히, 반론을 챙기고, 지치면 쉰다. 위험한 선택은 피한다',acts:['invest','write','beat','discover','fethics','sasu','report','pitch','spx','source'],pref:/확인|반론|기다린|신중|원래|정정|사실만|돌려보낸/},
 promo:{n:'출세',d:'발제·데스킹·회의로 윗선 눈에 띄고 미션을 먼저 챙긴다',acts:['pitch','write','desk','meeting','front','fvision','invest','discover','spx','colleague','drink','deptlife','sasu','report'],pref:/출고|받아들|맡는다|보고|챙긴|올린다/},
 money:{n:'돈',d:'광고·협찬 영업과 실적을 챙긴다. 기사는 무난하게',acts:['adsell','adsales','fsales','revenue','fbrand','portal','write','invest','discover','beat','sasu','report'],pref:/영업|계약|받는다|협찬|따낸/}};
// 사람이 직접 골라야 하는 큰 선택은 멈춘다
const AUTO_STOP=/제안|좋은 사이의 부탁|제자의 부탁|부름|사건 파일이 열렸다|법정 공방|명예훼손|소송|갈림길|회사가 변했다|사람이 변한다|발탁 트랙|스카우트|권유|라이벌의|동료의 몰락|마지막 압박|권력의 보복|회유|협박|정권 교체|인사 발령|승진과 함께|윤리 논란|신세를 갚을|어떤 언론사|어떤 사람|두 번째 성격|전문 분야를 정한다|한 걸음 더|더 깊이|논란|낙인|의혹|몰락|퇴출|연루|적발|유포자|꺾이|이직|창간|엔딩|커리어 마무리|선배의 뒤|청탁|고위 인사의 부탁|기자의 길|입사|사표|퇴사|희망퇴직|명예퇴직|권고사직|징계|선출|선거 운동|표결|주주총회|대주주|자매사|그룹 내 전출|편집국장을 세울|계열사 적자|약속한 자리|편집국장의 반대/;
function autoMonthOpen(){if(!S||S.phase!=='game'||S.story)return;if(!(S.ap>0)){toast('이번 달 행동력을 다 썼다. 다음 달로 넘기자');return;}const last=S.autoDir;
  openModal('한 달 맡기기',`<p class="lede">방향만 정하면 이번 달 남은 할 일을 알아서 한다. 길 제안, 소송, 승진, 정체성 변화 같은 큰 선택이 오면 멈추고 직접 고르게 한다.</p><p class="hint">남은 행동력 ${S.ap} · 끝나면 이번 달 결과를 한 장으로 보여 준다 · 이달의 미션을 먼저 챙긴다</p>`,
   Object.keys(AUTO_DIR).map(k=>({label:AUTO_DIR[k].n,sub:AUTO_DIR[k].d,rec:k===last,fn:()=>{S.autoDir=k;setTimeout(()=>autoMonthRun(k),30);}})).concat([{label:'직접 하겠다',cls:'ghost'}]));}
function autoPickAct(k){const D=AUTO_DIR[k],acts=rankActs();const ban=S._autoBan||new Set(),use=S._autoUse||{};const cap=id=>['write','invest'].includes(id)?4:id==='rest'?3:2;const ok=id=>!ban.has(id)&&(use[id]||0)<cap(id)&&acts.includes(id)&&ACT[id]&&!why(id)&&actCost(id)<=S.ap&&!['job','found','life','rtact','deptreq','gongse','gad','hire','recruit','personnel','paypol','newdept','digital','cut','fraise','fcrisis'].includes(id);
  if(S.hp<(k==='safe'?50:35)&&acts.includes('rest')&&!why('rest')&&(use.rest||0)<3)return 'rest';
  try{const h=nowHint();if(h&&h.id&&ok(h.id)&&h.id!=='rest')return h.id;}catch(e){}let r=null;try{r=recommend();}catch(e){}if(r&&ok(r)&&r!=='rest')return r;
  try{const mt=acts.filter(id=>ok(id)&&misTag(id));const m2=D.acts.find(id=>mt.includes(id));if(m2)return m2;if(k==='promo'&&mt.length)return mt[0];}catch(e){}
  const a=D.acts.find(ok);if(a)return a;return ['write','invest','beat','source','discover','sasu','report','pitch'].find(ok)||null;}
function autoPickBtn(k,tried){const D=AUTO_DIR[k];const bs=[...document.querySelectorAll('#mc button')].filter(b=>!b.disabled&&!(tried&&tried.has((b.innerText||'').split('\n')[0])));if(!bs.length)return null;const main=bs.filter(b=>!b.classList.contains('ghost'));const L=main.length?main:bs;
  const txt=b=>b.innerText||'';const risky=b=>!!b.querySelector('.bdg.rsk');const bad=b=>/그만두|포기|접는다|킬한다|거절|넘긴다|덮는다|취소|닫기|뒤로|나중에/.test(txt(b));
  let c=L.filter(b=>!bad(b));if(!c.length)c=L;if(k==='safe'){const s=c.filter(b=>!risky(b));if(s.length)c=s;}else if(k!=='scoop'){const s=c.filter(b=>!risky(b));if(s.length)c=s;}
  return c.find(b=>b.querySelector('.bdg.rec'))||c.find(b=>D.pref.test(txt(b)))||c[0];}
async function autoMonthRun(k){const sleep=ms=>new Promise(r=>setTimeout(r,ms));const lg0=(S.log||[])[0];const st0={eval:S.eval,fame:S.fame,trust:S.trust,hp:S.hp,money:S.money,art:S.totalArticles||0,sc:S.scoops||0};const done=[];let stop=null;const mg0=S.mgOff;S.mgOff=true;S._auto=1;S._autoBan=new Set();S._autoUse={};try{aiAutoCare(done);}catch(e){}
  try{for(let n=0;n<20&&S.phase==='game'&&S.ap>0&&!stop;n++){const id=autoPickAct(k);if(!id)break;const ap0=S.ap;done.push(actName(id));S._autoUse[id]=(S._autoUse[id]||0)+1;try{doAction(id);}catch(e){console.error(e);break;}
      let sig='',tried=new Set(),stuck=false;
      for(let i=0;i<45;i++){await sleep(20);if(S.phase!=='game'){stop='끝';break;}if($('#modal').hidden){if(Q.length){Q.shift()();sig='';tried=new Set();continue;}break;}const t=$('#mt').textContent||'';if(AUTO_STOP.test(t)){stop=t;break;}
        const sg=t+'|'+[...document.querySelectorAll('#mc button')].map(x=>(x.innerText||'').split('\n')[0]).join('/')+'|'+($('#mb').innerText||'').length;if(sg!==sig){sig=sg;tried=new Set();}
        const b=autoPickBtn(k,tried);if(!b){stuck=true;closeModal();continue;}tried.add((b.innerText||'').split('\n')[0]);b.click();if(i===44){stuck=true;closeModal();}}
      if(stop)break;if(S.ap>=ap0){S._autoBan.add(id);done.pop();}}}finally{S.mgOff=mg0;S._auto=0;S._autoBan=null;S._autoUse=null;}
  const L=[];for(const x of (S.log||[])){if(x===lg0)break;L.push(x.t||x);if(L.length>=10)break;}const d=(a,b)=>{const v=Math.round((a-b)*10)/10;return v?`${v>0?'+':''}${v}`:'0';};
  const sum=`<div class="kv"><div><span>한 일</span><b>${done.length}번</b></div><div><span>기사</span><b>${(S.totalArticles||0)-st0.art}건</b></div><div><span>사내 평가</span><b>${d(S.eval,st0.eval)}</b></div><div><span>평판</span><b>${d(S.fame,st0.fame)}</b></div><div><span>신뢰</span><b>${d(S.trust,st0.trust)}</b></div><div><span>컨디션</span><b>${d(S.hp,st0.hp)}</b></div></div>`;
  const body=`<p class="hint" style="margin:0 0 8px">방향: ${AUTO_DIR[k].n} · ${esc([...new Set(done)].join(' · ')||'할 일이 없었다')}</p>${sum}${L.length?`<ul class="feed" style="margin-top:8px">${L.map(x=>`<li>${esc(String(x))}</li>`).join('')}</ul>`:''}${stop&&stop!=='끝'?`<p class="warn" style="margin-top:8px">「${esc(stop)}」 — 직접 골라야 할 선택이라 여기서 멈췄다.</p>`:''}`;
  if(stop&&stop!=='끝'){Q.unshift(()=>openModal('맡긴 결과 · 여기까지',body,[{label:'확인'}]));toast('큰 선택이 왔다. 직접 골라 주세요');return;}
  if(S.phase!=='game')return;render();openModal('이번 달 맡긴 결과',body,[{label:'다음 달로 넘기기',rec:true,fn:()=>{setTimeout(()=>{try{const b=document.querySelector('[data-go="week"]');if(b)b.click();}catch(e){}},30);}},{label:'남은 건 직접 하겠다',cls:'ghost'}]);}