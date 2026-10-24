/* 바이라인 1.6 — src/compat/v47.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 지역 TO — AI 개선과 밸런스 =====
// 1) 순환: 지역 책임자도 3년쯤 지나면 본사 빈자리로 돌아온다 → 지역 TO가 다시 열려 적체 해소가 한 번으로 끝나지 않는다
// 2) 방치 비용: 인사권자가 적체를 오래 두면 분위기가 처지고 막힌 사람이 떠난다
// 3) 지역 책임자의 힘: 책임자가 강한 지역은 주재기자가 자라고 제보가 늘어난다 / 내가 책임자면 그 제보가 내 몫
// 4) TO 신설 상한, 공모 조건(사내 평가), 공모 추천은 내 승진 가능성을 보고 판단

// ---------- 1) 순환 복귀 ----------
function back47(lines){try{if(S.founder||!Array.isArray(S.corr)||!S.corr.length)return;const per=roster();const rd=regD46();if(!rd)return;const D=orgDepts().filter(d=>!isRegD(d));const T=new Set(S.team||[]);let n=0;
  S.corr.filter(m=>(m.r||0)>=1&&(m.r||0)<=2&&S.turn-(m.hqIn??m.t0??0)>=YW*3&&!T.has(m)&&npcAge(m)<56).sort((a,b)=>orgScore(b)-orgScore(a)).forEach(m=>{if(n>=2||!chance(.45))return;const rk=m.r||0;
    // 같은 직급 빈자리가 있는 본사 부서
    const d=(m.hqFrom46&&D.includes(m.hqFrom46)?[m.hqFrom46]:[]).concat(shuffle(D.slice())).find(d=>{const L=per[d]||[];return rk===2?!orgHead(L):mids45(L)<cap45(d,L);});if(!d)return;
    S.corr=S.corr.filter(x=>x!==m);per[rd]=(per[rd]||[]).filter(x=>x!==m);const from=m.reg;m.d=d;m.reg=null;m.role=null;m.acting=0;m.hqIn=null;m.back47=S.turn;(per[d]=per[d]||[]).push(m);try{lock45(m);}catch(e){}
    n++;const t=`${m.name} ${from} ${corrTitle(rk)} → 본사 ${DEPTS[d]?DEPTS[d].n:''} ${MR[rk]} 복귀 — ${from} 자리가 다시 열렸다`;log(t);if(lines)lines.push({c:'',t});});}catch(e){console.error(e);}}

// ---------- 2) 방치 비용 · 3) 지역 책임자의 힘 ----------
{const _om47=orgMonth;orgMonth=function(lines){const r=_om47.apply(this,arguments);try{
  if(!S.founder&&!S.story&&regD46()){
    // 순환은 반기마다
    if((S.bk47??-99)<=S.turn-YW/2){S.bk47=S.turn;back47(lines);}
    const T=to46();const w=(T.wait[1]||[]).length+(T.wait[2]||[]).length;
    if(orgCanRun()){S.jam47=w>=4&&T.vac.length?(S.jam47||0)+1:0;
      if(S.jam47>=6){S.wMood=clamp((S.wMood??60)-.35,0,100);
        if(S.jam47%6===0){const W=[].concat(T.wait[2]||[],T.wait[1]||[]).filter(m=>!(S.team||[]).includes(m));const m=W.length?pick(W):null;
          if(m&&chance(.5)){const per=roster();per[m.d]=(per[m.d]||[]).filter(x=>x!==m);const dest=pick(['경쟁사 경력 채용','대기업 홍보실','지역 방송사 보도국장','공기관 대변인실']);
            lines.push({c:'b',t:`승진 적체: ${m.name} ${MR[m.r||0]}(${DEPTS[m.d]?DEPTS[m.d].n:''}) → ${dest}. "자리가 안 날 거면 나가겠다" — 지역 책임자 자리 ${T.vac.length}곳은 아직 비어 있다`});log(`${m.name} 적체로 퇴사`);}
          else lines.push({c:'b',t:`승진 적체가 반년째다 — 편집국 분위기가 처진다(승진 대기 ${w}명 · 지역 빈 자리 ${T.vac.length}곳)`});}}}
    // 지역 책임자가 강한 지역: 주재기자가 자란다
    const C=(typeof corrs==='function'?corrs():[])||[];[...new Set(C.map(m=>m.reg).filter(Boolean))].forEach(rg=>{const L=C.filter(m=>m.reg===rg);const top=L.filter(m=>(m.r||0)>=1).sort((a,b)=>(b.skill||0)-(a.skill||0))[0];
      if(top&&(top.skill||0)>=55)L.filter(m=>!(m.r||0)).forEach(m=>{m.skill=Math.min(85,(m.skill||40)+.06*((top.skill-50)/10));});});
    // 내가 지역 책임자면 주재기자 제보가 내 몫
    if(S.lead46&&isRegD(S.dept)&&chance(.35)){const rg=S.lead46.reg;const L=C.filter(m=>m.reg===rg&&m!==undefined&&!(m.r||0));const by=L.length?pick(L):null;const it=makeItem('loc',{excl:chance(.4)});it.reg=rg;if(by){it.coord='co';it.coBy=by.name;}S.items.push(it);
      lines.push({c:'g',t:`${by?`${by.name} 주재기자`:`${rg} 주재팀`}가 책임자에게 제보를 올렸다 → 「${it.title}」`});}}}catch(e){console.error(e);}return r;};}

// ---------- 4) TO 신설 상한 ----------
function newCap47(){const regs=[...new Set((S.corr||[]).map(m=>m.reg))];return Math.max(2,Math.ceil(regs.length/2));}
function newUsed47(){return Object.values(S.corrX46||{}).reduce((a,x)=>a+(x||[]).length,0);}
{const _ts47=toSend46;toSend46=function(m,rk,reg){if(!reg){if(newUsed47()>=newCap47()){toast(`지역 TO 신설은 ${newCap47()}자리까지 — 빈 자리가 날 때를 기다린다`);return;}if(rk>=3&&(OUT().p||0)<4){toast('국장급 지역 자리 신설은 ★4 이상 매체만');return;}
    if(S.co&&S.co.cash<.3){toast('회사 돈이 모자라 자리를 새로 만들 수 없다');return;}}
  return _ts47.apply(this,arguments);};}
// 발령 목록: 새 자리는 상한 안내, 사람 추천은 실력·지역 적합도로
{const _to47=toOpen46;toOpen46=function(){_to47.apply(this,arguments);try{const mc=$('#mc');const lede=mc&&mc.parentElement&&mc.parentElement.querySelector('.hint');const left=newCap47()-newUsed47();
  if(lede&&!lede.dataset.n47){lede.dataset.n47=1;lede.innerHTML+=` 새 지역 TO는 ${Math.max(0,left)}자리 더 만들 수 있다. 실력 55 이상을 책임자로 보내면 그 지역 주재기자들이 함께 자란다. 지역 책임자는 3년쯤 뒤 본사 빈자리로 돌아온다.`;}
  const bs=[...mc.querySelectorAll('button.ch')];let best=null,bv=-1;bs.forEach(b=>{const t=b.textContent;const m=t.match(/실력 (\d+)/);if(m&&!/새 자리/.test(t)&&+m[1]>bv){bv=+m[1];best=b;}});if(best&&!best.querySelector('.rec47')){const i=document.createElement('i');i.className='cp rec47';i.style.color='var(--good)';i.textContent='추천';(best.querySelector('.chips')||best).appendChild(i);}}catch(e){}};}

// ---------- 공모: 조건과 AI 추천 ----------
// 사내 평가가 바닥이면 공모가 오지 않는다. 승진 직전(평가 높음)이면 「버틴다」를, 오래 막혔으면 「간다」를 추천
// 지역 책임자의 복귀 때: 지역 평가가 좋았으면 사내 평가 보너스
{const _rot47=doRotate;doRotate=function(nd){const L=S&&S.lead46;const r=_rot47.apply(this,arguments);try{if(L&&!L.done47&&!isRegD(S.dept)){L.done47=1;const E=regEval43().find(x=>x.r===L.reg);const g=E&&E.g;if(g==='S'||g==='A'){toast(apply({eval:3,fame:.5}));log(`${L.reg} 책임자 성과 인정 — 사내 평가↑`);}}}catch(e){}return r;};}
// AI: 승진 대기자를 3명 이상 두고 반년 넘게 방치하면 조직 운영 추천을 더 자주
{const _rc47=recommend;recommend=function(){const r=_rc47.apply(this,arguments);try{if(S&&(S.jam47||0)>=4&&orgCanRun()&&r!=='rest'&&r!=='breaking'&&rankActs().includes('personnel')&&!why('personnel')&&(S.toR47??-99)<S.turn-4){S.toR47=S.turn;return 'personnel';}}catch(e){}return r;};}