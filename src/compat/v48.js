/* 바이라인 1.6 — src/compat/v48.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 창간 모드 인사 바로잡기 + 영입 배치 + 수습 vs 경력 균형 =====
// (1) 창간 매체 위상이 저장·불러오기 뒤 되돌아가던 문제 → patch.py에서 oModApply가 창간 매체를 건드리지 않게
// (2) 영입한 기자의 실력이 연차 기준으로 다시 계산돼 깎이던 문제 → 영입 순간의 실력을 기준점으로 고정
// (3) 창간 모드 명부: 실제 직원만 (가상 인물로 채우지 않는다)
// (4) 창간 모드 부서장 후보: 다른 부서의 우리 기자도 데려와 앉힐 수 있다
// (5) 경력·스타 영입 때 어느 부서에 어떤 직책으로 둘지 고른다
// (6) 수습을 뽑을 이유: 공채 출신은 충성·성장, 경력·스타는 텃세·이탈 위험·처우 요구

function fix48(m){try{if(!m||m.yrs==null)return m;m._fy=m.yrs;m._sk0=m.skill;m._dv=m.skill-skillYrs(m.yrs);}catch(e){}return m;}

// (3) 창간 모드 명부
{const _ro48=roster;roster=function(){const per=_ro48.apply(this,arguments);try{if(S&&S.founder&&per){const keep=new Set([].concat(S.team||[],(typeof corrs==='function'?corrs():[])||[]));Object.keys(per).forEach(d=>{if(!DEPTS[d]||/^x_/.test(d))return;const L=per[d];if(!Array.isArray(L))return;for(let i=L.length-1;i>=0;i--)if(!keep.has(L[i]))L.splice(i,1);});
  // 팀에는 있는데 명부에 빠진 사람 넣기
  (S.team||[]).forEach(m=>{if(!per[m.d])per[m.d]=[];if(!Object.values(per).some(L=>Array.isArray(L)&&L.includes(m)))per[m.d].push(m);});}}catch(e){console.error(e);}return per;};}

// (4) 창간 모드 부서장 후보
{const _oc48=orgCands;orgCands=function(d){let C=_oc48.apply(this,arguments)||[];try{if(S&&S.founder){const per=roster();const L=(per[d]||[]).filter(m=>myrs(m)>=2||(m.skill||0)>=55);
  const out=Object.keys(per).filter(x=>x!==d&&DEPTS[x]&&!isRegD(x)).flatMap(x=>(per[x]||[]).filter(m=>m.rk==null&&(myrs(m)>=4||(m.skill||0)>=60)&&!(lk45(m)&&m.lk45.dem)));
  C=[...new Set(C.concat(L,out.sort((a,b)=>orgScore(b)-orgScore(a)).slice(0,6)))].filter(m=>m.rk==null).sort((a,b)=>orgScore(b)-orgScore(a)).slice(0,9);}}catch(e){}return C;};}

// (5) 영입 배치
function place48(list){list=(list||[]).filter(m=>m&&(S.team||[]).includes(m));if(!list.length)return;const m=list[0],rest=list.slice(1);const D=orgDepts();const per=roster();
  const fit=d=>{const L=(per[d]||[]).filter(x=>x!==m);const h=orgHead(L);return `${L.length}명 · 부서장 ${h?`${esc(h.name)}(실력 ${Math.round(h.skill)})`:'공석'}`;};
  openModal(`${m.name} 배치 — 어느 부서로`,`<p class="lede"><b>${esc(m.name)}</b> · 실력 ${Math.round(m.skill)} · ${myrs(m)}년 차${m.src48==='star'?' · 스타 기자':''}</p><p class="hint">영입한 사람을 어디에 어떤 직책으로 둘지 정한다. 행동력은 들지 않는다. 기존 사람 위에 앉히면 "굴러온 돌" 뒷말이 나온다.</p>`,
   D.map(d=>({label:DEPTS[d].n+(d===m.d?' (희망 부서)':''),sub:fit(d),rec:d===m.d,fn:()=>{place48Role(m,d,rest);return false;}})).concat([{label:'희망 부서에 평기자로 둔다',cls:'ghost',fn:()=>{if(rest.length)Q.push(()=>place48(rest));}}]));}
function place48Role(m,d,rest){const per=roster();Object.keys(per).forEach(x=>{if(Array.isArray(per[x]))per[x]=per[x].filter(y=>y!==m);});m.d=d;(per[d]=per[d]||[]).push(m);const L=per[d];const h=orgHead(L.filter(x=>x!==m));const mids=mids45(L.filter(x=>x!==m)),cap=cap45(d,L);
  const done=(t)=>{log(`배치: ${m.name} → ${DEPTS[d].n} ${t}`);toast(`${m.name} → ${DEPTS[d].n} ${t}`);if(rest.length)Q.push(()=>place48(rest));};
  const O=[{label:'부서장(팀장)',sub:h?`${h.name} 부서장은 차장으로 물러난다 · 기존 부서원 불만↑ · 실력이 확실히 나으면 납득`:'공석을 채운다',fn:()=>{if(h){h.r=1;h.acting=0;h.exHead=S.turn;h.rel=clamp((h.rel??20)-(m.skill-h.skill>=8?6:12),-50,100);}m.r=Math.max(2,m.r||0);m.acting=0;m.headT=S.turn;lock45(m);
      if(h){const gap=orgScore(m)-orgScore(h);S.wMood=clamp((S.wMood??60)+(gap>=8?-.3:-1.5),0,100);L.filter(x=>x!==m&&x!==h).forEach(x=>{x.rel=clamp((x.rel??20)-(gap>=8?1:3),-50,100);});}done('부서장');}},
   {label:'차장',sub:mids>=cap?`차장 정원(${cap})이 찼다 — 정원을 하나 늘린다(인건비↑)`:'부서장을 받치는 자리',fn:()=>{if(mids>=cap){S.midX45=S.midX45||{};S.midX45[d]=(S.midX45[d]||0)+1;S.co.extra=+((S.co.extra||0)+.004*(OUT().p||2)).toFixed(3);}m.r=1;m.acting=0;lock45(m);done('차장');}},
   {label:'평기자',sub:'직책 없이 현장부터 — 기존 부서원 반발 없음',fn:()=>{m.r=0;lock45(m);done('평기자');}}];
  openModal(`${m.name} — ${DEPTS[d].n}에서 맡을 직책`,`<p>${DEPTS[d].n}: ${L.length-1}명 · 부서장 ${h?`${esc(h.name)} (실력 ${Math.round(h.skill)})`:'공석'} · 차장 ${mids}/${cap}</p>`,O);}

// 채용이 끝나면: 영입자 표시 · 실력 고정 · (경력·스타) 배치 · 텃세
{const _hb48=hireBoard;hireBoard=function(kind){const before=new Set(S.team||[]);const r=_hb48.apply(this,arguments);try{
  // 채용 확정은 버튼 클릭 때 일어나므로, 결과 창이 뜰 때 새로 들어온 사람을 찾는다
  S._hb48={kind,before:[...before].map(m=>m.id)};}catch(e){}return r;};}
{const _om48=openModal;openModal=function(t,b,c){try{if(t==='채용 결과'&&S&&S._hb48){const H=S._hb48;S._hb48=null;const old=new Set(H.before);const corrAll=(typeof corrs==='function'?corrs():[])||[];const nw=[].concat(S.team||[],corrAll,...Object.values(S.corrList||{}).filter(Array.isArray)).filter(m=>m&&m.t0===S.turn&&!old.has(m.id)&&!m.src48);
    nw.forEach(m=>{m.src48=H.kind;m.hT48=S.turn;fix48(m);});
    const pro=nw.filter(m=>H.kind!=='new'&&(S.team||[]).includes(m));
    if(H.kind!=='new'&&nw.length){const k=H.kind==='star'?1.2:.4;S.wMood=clamp((S.wMood??60)-k*nw.length,0,100);
      b+=`<p class="hint">${H.kind==='star'?'스타 영입은 회사 얼굴이 되지만, 기존 기자들 사이엔 "우리는 뭐냐"는 말도 돈다':'경력 기자가 들어오면 기존 기자들이 조금 긴장한다'} (편집국 분위기 −${(k*nw.length).toFixed(1)}). 경력·스타는 3년 안에 더 좋은 조건을 찾아 떠날 수도 있다.</p>`;}
    if(H.kind==='new'&&nw.length){S.wMood=clamp((S.wMood??60)+.3*nw.length,0,100);b+=`<p class="hint">공채 기수가 들어왔다 — 편집국에 활기가 돈다. 우리 손으로 키운 기자는 오래 남고 빨리 자란다.</p>`;}
    if(pro.length){c=[{label:'배치를 정한다',rec:true,sub:'어느 부서 · 어떤 직책(부서장·차장·평기자)',fn:()=>{Q.push(()=>place48(pro));}},{label:'희망 부서에 그냥 둔다',cls:'ghost'}];}}}catch(e){console.error(e);}return _om48.call(this,t,b,c);};}

// (6) 매달: 공채 출신 성장 보너스 · 경력·스타 적응/이탈
{const _om48m=orgMonth;orgMonth=function(lines){const r=_om48m.apply(this,arguments);try{if(!S.story){const T=S.team||[];
  T.forEach(m=>{if(m.src48==='new'&&m.rk==null&&S.turn-(m.hT48||0)<YW*5)m.skill=Math.min(88,(m.skill||30)+.12);});
  const out=T.filter(m=>(m.src48==='career'||m.src48==='star')&&S.turn-(m.hT48||0)<YW*3&&S.turn-(m.hT48||0)>=YW/2);
  const mood=S.wMood??60;out.forEach(m=>{const p=(m.src48==='star'?.012:.006)*(mood<45?2:mood>70?.6:1)*((m.rel??20)<0?1.6:1)*((S.payLv||1)<1?1.5:1);
    if(chance(p)){S.team=S.team.filter(x=>x!==m);try{const per=roster();if(per[m.d])per[m.d]=per[m.d].filter(x=>x!==m);}catch(e){}S.co.staff=Math.max(1,(S.co.staff||1)-1);try{S.co.extra=Math.max(0,+((S.co.extra||0)-hireCostD(m.src48,m)).toFixed(3));}catch(e){}
      const dest=(S.comp||[]).length?cName(pick(S.comp)):'경쟁사';lines.push({c:'b',t:`${m.name} ${jo2(m.src48==='star'?'스타 기자':'경력 기자','이','가')} ${dest}의 더 좋은 조건을 받고 떠났다 — 영입 ${Math.round((S.turn-m.hT48)/4)}개월 만`});log(`${m.name} 이직 (영입 기자)`);}});}}catch(e){console.error(e);}return r;};}