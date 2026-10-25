/* 바이라인 — src/dev/devmode.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ================= 개발자 모드 =================
function devPanel(){
  return `<section class="box devp"><div class="bh"><h3>개발자 모드</h3><button class="btn sm" data-dev="close">닫기</button></div><div class="bb">
  <div class="sec">시간</div><div class="devg"><button data-dev="w1">+1주</button><button data-dev="w4">+4주(이벤트 생략)</button><button data-dev="w24">+24주(이벤트 생략)</button><button data-dev="ap">행동력 +10</button><button data-dev="hp">컨디션 100</button><button data-dev="cd">쿨다운 초기화</button></div>
  <div class="sec">캐릭터</div><div class="devg"><button data-dev="st">능력치 90</button><button data-dev="ev">평가·평판·신뢰 90</button><button data-dev="lo">평가 5 (해고 테스트)</button><button data-dev="money">통장 +1000만</button><button data-dev="cash">회사 자금 +100억</button></div>
  <div class="sec">직급·부서·난이도</div><div class="devg"><select id="dvR">${RANKS.map((r,i)=>`<option value="${i}" ${i===S.rank?'selected':''}>${r.n}</option>`).join('')}</select><button data-dev="rank">직급 적용</button><button data-dev="promo">정기 인사 실행</button>
   <select id="dvD">${OUT().depts.map(d=>`<option value="${d}" ${d===S.dept?'selected':''}>${DEPTS[d].n}</option>`).join('')}</select><button data-dev="dept">부서 적용</button>
   <select id="dvF">${Object.keys(DIFF).map(k=>`<option value="${k}" ${k===S.diff?'selected':''}>${DIFF[k].n}</option>`).join('')}</select><button data-dev="diff">난이도 적용</button>
   <select id="dvO">${OUTLETS.map(o=>`<option value="${o.id}" ${o.id===S.outlet?'selected':''}>${o.n}</option>`).join('')}</select><button data-dev="outlet">매체 이동</button></div>
  <div class="sec">콘텐츠</div><div class="devg"><button data-dev="item">아이템 추가</button><button data-dev="itemx">단독 아이템 추가</button><button data-dev="conf">모든 사실 확인</button><button data-dev="src">취재원 추가(신뢰 70)</button><button data-dev="event">랜덤 이벤트</button><button data-dev="season">이달 계절 이벤트</button><button data-dev="err">오보 논란 발생</button><button data-dev="award">기자상 받기</button><button data-dev="end">엔딩 보기</button></div>
  <p class="hint">개발·테스트용입니다. 개발자 모드를 쓴 커리어는 결산 화면에 표시됩니다.</p></div></section>`;
}
function devDo(k){
  S.devUsed=1;const T={
   close:()=>{S.devOpen=false;},
   w1:()=>{endWeek();},
   w4:()=>skipWeeks(4),w24:()=>skipWeeks(24),
   ap:()=>{S.ap+=10;},hp:()=>{S.hp=100;},cd:()=>{S.cd={};},
   st:()=>{for(const k in S.st)S.st[k]=90;},ev:()=>{S.eval=90;S.fame=90;S.trust=90;},lo:()=>{S.eval=5;},
   money:()=>{S.money+=1000;},cash:()=>{S.co.cash+=100;},
   rank:()=>{const r=+$('#dvR').value;S.rank=r;S.inRank=0;if(r>=2&&!S.team.length)S.team=genTeam();S.scene=baseScene();},
   promo:()=>{S.inRank=999;jinsa();},
   dept:()=>{S.dept=$('#dvD').value;},
   diff:()=>{S.diff=$('#dvF').value;},
   outlet:()=>{const o=OUTLETS.find(x=>x.id===$('#dvO').value);transfer(o,Math.max(1,S.rank));},
   item:()=>{S.items.push(makeItem(S.dept));},itemx:()=>{S.items.push(makeItem(S.dept,{excl:true,mult:1.3}));},
   conf:()=>{S.items.forEach(i=>i.facts.forEach(f=>{f.conf=f.need;if(!f.via.length)f.via.push('개발자');}));},
   src:()=>{addSource(S.dept,70);},
   event:()=>{const e=pickEvent();if(e)e.run();},
   season:()=>{const e=seasonEvent();if(e)e();else toast('이달에는 계절 이벤트가 없다');},
   err:()=>{scandal({title:'개발자 테스트 기사'});},
   award:()=>{if(!S.clips.length)toast('기사가 먼저 있어야 한다');else{const c=S.clips[0];c.imp=Math.max(c.imp,66);c.awarded=0;c.turn=S.turn;c.q=Math.max(c.q,60);S.nextAward=0;EVENTS[8].run();}},
   end:()=>{ending('개발자 종료');}
  };
  if(T[k])T[k]();if($('#modal').hidden&&S.phase==='game'){render();saveGame();}
}
function skipWeeks(n){window.__skip=1;try{for(let i=0;i<n&&S.phase==='game';i++)endWeekQuiet();}finally{window.__skip=0;}$('#modal').hidden=true;mTok++;toast(`${n}주를 건너뛰었다`);}
function endWeekQuiet(){Q.length=0;$('#modal').hidden=true;endWeek();let g=0;while(Q.length&&g++<20){const f=Q.shift();try{f();}catch(e){console.error(e);}}$('#modal').hidden=true;mTok++;}

// ================= 개발자 콘솔 (Claude 아티팩트에서만) =================
function devOK(){return inArtifact()||!!window.__devTest;}
const DEVSEC=[['quick','빠른 시작'],['char','캐릭터·시간'],['world','직급·매체·모드'],['events','이벤트 브라우저'],['systems','시스템 미리보기'],['data','숨은 데이터'],['av','소리·화면']];
function evTitle(e){const m=String(e.run||'').match(/openModal\(\s*[`'"]([^`'"$]{1,40})/);return m?m[1]:'(제목 없음)';}
function evCond(e){try{return !!e.c();}catch(x){return false;}}
function devPools(){const P=[['일반',EVENTS],['창간·경쟁·아이템',typeof F_EVENTS!=='undefined'?F_EVENTS:[]],['동료',COL_EVENTS],['관계망',NET_EVENTS],['위기',CRISES]];return P;}
function devNeedGame(){if(S.phase!=='game'){toast('게임 중에만 실행할 수 있다 — 빠른 시작으로 들어가자');return true;}return false;}
function devRun(fn){Q.length=0;$('#modal').hidden=true;mTok++;S.devUsed=1;try{fn();}catch(e){console.error(e);$('#modal').hidden=true;toast('지금 상황에선 이 이벤트에 필요한 대상(기사·동료·아이템 등)이 없어 실행할 수 없다');}if($('#modal').hidden){render();saveGame();}}
function devConsole(sec){if(!devOK())return;sec=sec||S.devSec||'quick';S.devSec=sec;
  const nav=`<div class="acat">${DEVSEC.map(([k,n])=>`<button class="achip" data-dsec="${k}" aria-pressed="${k===sec}" style="--c:var(--dev)">${n}</button>`).join('')}</div>`;
  openModal('개발자 콘솔',nav+`<div id="dvb">${devSecHTML(sec)}</div><p class="hint" style="margin-top:12px">Claude 아티팩트에서만 열린다. 웹 배포판(Vercel)에는 나타나지 않는다. 개발자 기능을 쓴 커리어는 결산에 표시된다.</p>`,[{label:'닫기',cls:'ghost'}]);
  document.querySelectorAll('#mb [data-dsec]').forEach(b=>b.onclick=()=>devConsole(b.dataset.dsec));devBind();}
const dvBtn=(k,n,arg)=>`<button class="btn sm" data-dv="${k}"${arg!=null?` data-arg="${esc(String(arg))}"`:''}>${n}</button>`;
function devSecHTML(sec){const g=S.phase==='game';const o=g?OUT():null;
  if(sec==='quick')return `<p>원하는 상황으로 바로 들어간다. 지금 진행 중인 게임은 덮어쓴다(슬롯 저장은 그대로).</p>
   <div class="devf"><label>모드<select id="dqM"><option value="career">일반 커리어</option><option value="simple">간소화 커리어</option><option value="found">창간</option><option value="story">스토리</option></select></label>
   <label>난이도<select id="dqD">${Object.keys(DIFF).map(k=>`<option value="${k}" ${k==='normal'?'selected':''}>${DIFF[k].n}</option>`).join('')}</select></label>
   <label>매체(일반)<select id="dqO">${OUTLETS.filter(x=>!x.custom).map(x=>`<option value="${x.id}">${esc(x.n)} ★${x.p}</option>`).join('')}</select></label>
   <label>직급(일반)<select id="dqR">${RANKS.map((r,i)=>`<option value="${i}">${r.n}</option>`).join('')}</select></label>
   <label>연차<input id="dqY" type="number" min="0" max="30" value="0"></label>
   <label>스토리<select id="dqS">${STORIES.map(s=>`<option value="${s.id}">${esc(s.n)}</option>`).join('')}</select></label>
   <label>창간 형태<select id="dqF">${FOUND_TYPES.map(f=>`<option value="${f[0]}">${f[1]}</option>`).join('')}</select></label></div>
   <div class="btns" style="margin-top:10px">${dvBtn('qstart','이 설정으로 시작')}${dvBtn('qrandom','무작위로 시작')}</div>`;
  if(!g&&sec!=='av'&&sec!=='events'&&sec!=='data')return '<p class="empty">게임을 시작해야 쓸 수 있다. "빠른 시작"으로 들어가자.</p>';
  if(sec==='char')return `<div class="sec">시간</div><div class="btns">${dvBtn('m1','+1달 (이벤트 보기)')}${dvBtn('skip',' +6개월',24)}${dvBtn('skip','+1년',48)}${dvBtn('skip','+5년',240)}${dvBtn('ap','행동력 가득')}${dvBtn('hp','컨디션 100')}${dvBtn('cd','쿨다운 초기화')}${dvBtn('unl',S.devUnlock?'잠금 해제 끄기':'모든 할 일·탭 열기')}</div>
   <div class="sec">능력치</div><div class="devf">${Object.keys(STN).map(k=>`<label>${STN[k]}<input type="number" min="0" max="99" data-dst="${k}" value="${Math.round(S.st[k])}"></label>`).join('')}</div><div class="btns" style="margin-top:6px">${dvBtn('stset','능력치 적용')}${dvBtn('stall','전부',90)}${dvBtn('stall','전부',30)}</div>
   <div class="sec">평가·돈</div><div class="devf">${[['eval','평가'],['fame','평판'],['trust','신뢰'],['hp','컨디션'],['money','통장(만)']].map(([k,n])=>`<label>${n}<input type="number" data-dvl="${k}" value="${Math.round(S[k])}"></label>`).join('')}${S.co?`<label>회사 자금(억)<input type="number" step="0.1" data-dvl="co.cash" value="${f1(S.co.cash)}"></label><label>보도 품질<input type="number" data-dvl="co.q" value="${Math.round(S.co.q)}"></label>`:''}</div><div class="btns" style="margin-top:6px">${dvBtn('valset','값 적용')}</div>`;
  if(sec==='world')return `<div class="devf"><label>직급<select id="dvR">${RANKS.map((r,i)=>`<option value="${i}" ${i===S.rank?'selected':''}>${r.n}</option>`).join('')}</select></label>
   <label>부서<select id="dvD">${o.depts.map(d=>`<option value="${d}" ${d===S.dept?'selected':''}>${DEPTS[d].n}</option>`).join('')}</select></label>
   <label>난이도<select id="dvF">${Object.keys(DIFF).map(k=>`<option value="${k}" ${k===S.diff?'selected':''}>${DIFF[k].n}</option>`).join('')}</select></label>
   <label>매체<select id="dvO">${OUTLETS.map(x=>`<option value="${x.id}" ${x.id===S.outlet?'selected':''}>${esc(x.n)} ★${x.p}</option>`).join('')}</select></label></div>
   <div class="btns" style="margin-top:8px">${dvBtn('rank','직급 적용')}${dvBtn('dept','부서 적용')}${dvBtn('diff','난이도 적용')}${dvBtn('outlet','매체 이동(이직)')}${dvBtn('promo','정기 인사 실행')}${dvBtn('simple',S.simple?'정통 모드로':'간소화 모드로')}</div>
   <div class="sec">아이템·취재원</div><div class="btns">${dvBtn('item','아이템')}${dvBtn('itemx','단독 아이템')}${dvBtn('hoax','가짜 제보 아이템')}${dvBtn('conf','모든 사실 확인')}${dvBtn('src','취재원(신뢰 70)')}${dvBtn('src5','취재원 5명')}</div>
   <div class="sec">끝내기</div><div class="btns">${['개발자 종료','임기 만료 · 사장실의 주인','창간 성공 · 메이저 언론','창간 실패 · 파산','퇴사'].map(k=>dvBtn('end',k,k)).join('')}${dvBtn('fire','해고 테스트')}</div>`;
  if(sec==='events'){const P=devPools();return `<div class="devf"><label style="flex:1 1 100%">검색<input id="dvq" placeholder="제목으로 찾기" value="${esc(S.devQ||'')}"></label></div><label class="chk" style="margin:6px 0"><input type="checkbox" id="dvc" ${S.devCond?'checked':''}><span>지금 조건이 맞는 것만</span></label>
   ${P.map(([pn,L],pi)=>{const rows=L.map((e,i)=>({e,i,t:evTitle(e),ok:g&&evCond(e)})).filter(r=>(!S.devQ||r.t.includes(S.devQ))&&(!S.devCond||r.ok));return rows.length?`<div class="sec">${pn} <small>${rows.length}개</small></div><div class="devlist">${rows.map(r=>`<button class="dvev${r.ok?' ok':''}" data-dv="ev" data-arg="${pi}:${r.i}" title="${r.ok?'지금 조건 충족':'조건 무시하고 실행'}">${esc(r.t)}</button>`).join('')}</div>`:'';}).join('')}
   <div class="sec">스토리 장면</div><div class="devlist">${Object.entries(STORY_BEATS).flatMap(([sid,B])=>Object.keys(B).map(w=>`<button class="dvev" data-dv="beat" data-arg="${sid}:${w}">${esc((STORIES.find(x=>x.id===sid)||{}).n||sid)} · ${w}주</button>`)).join('')}</div>
   <div class="sec">창업 과정</div><div class="devlist">${Object.keys(F_BEATS).map(w=>`<button class="dvev" data-dv="fbeat" data-arg="${w}">${w}주 차 · ${esc(evTitle({run:F_BEATS[w]}))}</button>`).join('')}</div>
   <p class="hint">초록 테두리는 지금 조건이 맞는 이벤트. 나머지는 조건을 무시하고 실행하므로 상황에 따라 어색하거나 오류가 날 수 있다.</p>`;}
  if(sec==='systems')return `<div class="sec">언론중재·소송</div><div class="btns">${dvBtn('med','언론중재위 조정 신청')}${dvBtn('suit','명예훼손 소송')}</div>
   <div class="sec">사람</div><div class="btns">${dvBtn('recv','아이템 받기 제안')}${dvBtn('handoff','아이템 넘기기')}${dvBtn('hire','공채 게시판','new')}${dvBtn('hire','경력 영입','career')}${dvBtn('hire','스타 스카우트','star')}${dvBtn('rot','순환보직')}${dvBtn('resh','NPC 인사 이동')}</div>
   <div class="sec">회사·경쟁</div><div class="btns">${dvBtn('comp','경쟁사 한 달 진행')}${dvBtn('compagg','경쟁사 전부 우리를 노림')}${dvBtn('crisis','위기 하나')}${dvBtn('season','계절 이벤트')}${dvBtn('scandal','오보 사태')}${dvBtn('award','기자상 심사')}</div>
   <div class="sec">화면</div><div class="btns">${dvBtn('tut','튜토리얼')}${dvBtn('patch','업데이트 내역')}${dvBtn('goals','목표 다시 뽑기')}${dvBtn('promoM','승진 발령 화면')}${dvBtn('fsetup','창간 준비 화면')}${dvBtn('job','이직 공고')}</div>`;
  if(sec==='data'){if(!g)return `<div class="sec">매체 특성 (전체)</div>${devOutletTable()}`;
   const it=S.items.map(i=>`<div class="card"><div class="t">${esc(i.title)} ${i.excl?'<span class="tg h">단독</span>':''}${i.hoax?'<span class="tg new">가짜 제보</span>':''}${i.from?`<span class="tg">${esc(i.from)}에게 받음</span>`:''}</div><div class="meta"><span>추격까지 ${heatTxt(i.heat).split(' · ')[0]}</span><span>파급 ${i.imp}</span>${i.ent?`<span>대상 ${esc((ENT[i.ent]||{}).n||i.ent)}</span>`:''}</div><ul class="facts">${i.facts.map(f=>`<li class="${fOK(f)?'v':f.key?'h':''}">${esc(f.t)} · ${f.conf}/${f.need}${f.via.length?' ('+f.via.join(',')+')':''}</li>`).join('')}</ul></div>`).join('')||'<p class="empty">아이템 없음</p>';
   const cp=(S.comp||[]).map(c=>`<div class="card"><div class="t">${esc(cName(c))} · ${(C_STRAT[c.strat]||[''])[0]}</div><div class="meta"><span>점유율 ${f1(c.share||0)}%</span><span>품질 ${Math.round(c.q)}</span><span>자금 ${eok(c.cash||0)}</span><span>경계심 ${Math.round(c.aggro||0)}</span><span>벌점 ${c.pen||0}</span></div><p class="hint" style="margin:4px 0 0">학습 가중치: ${Object.entries(c.w||{}).map(([k,v])=>`${C_MOVES[k].n} ${v.toFixed(1)}`).join(' · ')}</p></div>`).join('');
   const mult=['pay','grow','eval','fame','trust','rel','hp','item','heat','pick','ten','legal'].map(k=>`${k} ×${otr(k).toFixed(2)}`).join(' · ');const ok=orgK();
   return `<div class="sec">지금 적용 중인 수치</div><p class="hint">행동력 ${apBase()} = ${apParts().map(x=>x[0]+(x[1]>0?'+':'')+x[1]).join(', ')}<br>회사 특성(${traitsOf(o).map(t=>otrDef(t).n).join(', ')}): ${mult}<br>규모 보정: 기간 ×${ok.ten.toFixed(2)} · 평가 ${ok.ev>=0?'+':''}${ok.ev} · 평판 ${ok.fm>=0?'+':''}${ok.fm} · 승진 확률 ${Math.round(ok.pick*100)}%${S.rank>=1&&S.rank<=6?` · 다음 승진 조건 재직 ${moTxt(promoMinW(S.rank))} · 평가 ${promoEv(S.rank)} · 평판 ${promoFm(S.rank)}`:''}<br>난이도 ${DF().n}: 페널티 ×${DF().pen} · 위기 ×${DF().crisis} · 소송 ×${DF().legal} · 타사 추격 위협 ${(compThreat()*100).toFixed(1)}%/주 · 아이템 포화 ×${glut().toFixed(2)}</p>
    <div class="sec">대기 중</div><p class="hint">중재 ${(S.medQ||[]).length}건 · 소송 ${(S.suitQ||[]).length}건 · 넘긴 아이템 ${(S.handoffs||[]).length}건 · 오보 ${S.errors} · 단독 ${S.scoops}</p>
    <div class="sec">목표</div>${(S.goalSet||[]).map(id=>{const gl=GOAL_POOL.find(x=>x.id===id)||FOUNDER_GOALS.find(x=>x.id===id);return gl?`<p class="hint" style="margin:0 0 4px"><b>${esc(gl.n)}</b> — ${esc(gl.d)} · ${esc(gl.p())} ${gl.chk()?'✓':''}</p>`:'';}).join('')}
    <div class="sec">아이템 속사정</div>${it}<div class="sec">경쟁사 AI 속사정</div>${cp}
    <div class="sec">매체 특성 (전체)</div>${devOutletTable()}
    <div class="sec">게임 상태 (JSON)</div><textarea readonly style="width:100%;height:120px;background:var(--panel2);color:var(--fg);border:1px solid var(--line);border-radius:10px;padding:8px;font-size:11px">${esc(JSON.stringify(S).slice(0,20000))}</textarea>`;}
  if(sec==='av')return `<div class="sec">BGM</div><div class="btns">${Object.keys(SONGS).map(k=>dvBtn('song',SONGS[k].n,k)).join('')}</div><div class="sec">효과음</div><div class="btns">${Object.keys(SFX).map(k=>dvBtn('sfx',k,k)).join('')}</div><div class="sec">화면</div><div class="btns">${dvBtn('loader','로딩 화면')}${dvBtn('toast','토스트')}${dvBtn('scene','장면 순환')}</div>`;
  return '';}
function devOutletTable(){return `<div class="devlist">${OUTLETS.filter(x=>!x.custom||x.id==='mine').map(x=>`<span class="dvev" style="cursor:default">${esc(x.n)} ★${x.p} · ${traitsOf(x).map(t=>(otrDef(t)||{n:t}).n).join(' / ')}</span>`).join('')}</div>`;}
function devBind(){
  const q=$('#dvq');if(q)q.oninput=()=>{S.devQ=q.value.trim();const p=q.selectionStart;$('#dvb').innerHTML=devSecHTML('events');devBind();const n=$('#dvq');n.focus();try{n.setSelectionRange(p,p);}catch(e){}};
  const c=$('#dvc');if(c)c.onchange=()=>{S.devCond=c.checked;$('#dvb').innerHTML=devSecHTML('events');devBind();};
  document.querySelectorAll('#mb [data-dv]').forEach(b=>b.onclick=()=>devAct(b.dataset.dv,b.dataset.arg));}
function devQuick(cfg){const nm=(S&&S.name)||lastName()||'개발기자';S=newState();S.dev=true;S.devUsed=1;S.name=nm;S.diff=cfg.diff||'normal';S.simple=cfg.mode==='simple';Q.length=0;
  const ci=OUTLETS.findIndex(x=>x.id==='mine');if(ci>=0)OUTLETS.splice(ci,1);
  if(cfg.mode==='story'){S.smode='story';S.story=cfg.story;storySetup();return;}
  if(cfg.mode==='found'){const ft=FOUND_TYPES.find(f=>f[0]===cfg.ftype)||FOUND_TYPES[0];S.founder=1;S.phase='create';for(const k in S.st)S.st[k]=clamp(S.st[k]+14,0,95);S.fame=22;S.money=15000;S.fTraits=shuffle(Object.keys(FOTR)).slice(0,2);founderLaunch(ft[0],ft[1],ft[3].split(','),'개발일보','neu',15,0);return;}
  const o=OUTLETS.find(x=>x.id===cfg.outlet)||pick(OUTLETS.filter(x=>!x.custom));S.smode='smb';join(o);Q.length=0;
  const r=fitRank(+cfg.rank||0,o);if(r>0){S.rank=r;S.inRank=0;S.eval=60;{const pool=o.depts.filter(x=>x!==S.dept&&!isRegD(x)&&DEPTS[x]&&!(typeof SUPPORT!=='undefined'&&SUPPORT[x]));const n=r>=4?2:r>=2?1:0;S.deptHist=[...new Set([...(S.deptHist||[]),...pool.sort(()=>Math.random()-.5).slice(0,n)])];}S.fame=Math.max(S.fame,r*8);if(r>=2)S.team=genTeam();if(r>=2&&!colBy('junior'))S.cols.push(mkCol('junior',20));}
  const y=+cfg.yrs||0;if(y){S.turn=y*YW;S.atOutlet=y*YW;const up=skillYrs(y)-skillYrs(0);for(const k in S.st)S.st[k]=clamp(Math.round(S.st[k]+up+R(-5,5)),5,90);S.ros=null;S.mates=null;}S.scene=baseScene();S.ap=apBase();try{checkUnlocks();}catch(e){}
  $('#modal').hidden=true;mTok++;render();saveGame();toast(`${o.n} ${ro2(rankName())} 시작`);}
function devAct(k,arg){const T={
  qstart:()=>{const cfg={mode:$('#dqM').value,diff:$('#dqD').value,outlet:$('#dqO').value,rank:$('#dqR').value,yrs:$('#dqY').value,story:$('#dqS').value,ftype:$('#dqF').value};$('#modal').hidden=true;mTok++;devQuick(cfg);},
  qrandom:()=>{$('#modal').hidden=true;mTok++;devQuick({mode:pick(['career','career','simple','found','story']),diff:pick(Object.keys(DIFF)),outlet:pick(OUTLETS.filter(x=>!x.custom)).id,rank:R(0,6),yrs:R(0,10),story:pick(STORIES).id,ftype:pick(FOUND_TYPES)[0]});},
  m1:()=>{if(devNeedGame())return;$('#modal').hidden=true;mTok++;endMonth();},
  skip:()=>{if(devNeedGame())return;devRun(()=>skipWeeks(+arg));},
  ap:()=>{S.ap=Math.max(S.ap,apBase()+10);devConsole('char');},hp:()=>{S.hp=100;devConsole('char');},cd:()=>{S.cd={};devConsole('char');},
  unl:()=>{S.devUnlock=!S.devUnlock;toast(S.devUnlock?'모든 할 일·탭 잠금 해제':'잠금 해제 끔');devConsole('char');},
  stset:()=>{document.querySelectorAll('#mb [data-dst]').forEach(x=>S.st[x.dataset.dst]=clamp(+x.value||0,0,99));toast('능력치 적용');devConsole('char');},
  stall:()=>{for(const k in S.st)S.st[k]=+arg;devConsole('char');},
  valset:()=>{document.querySelectorAll('#mb [data-dvl]').forEach(x=>{const v=+x.value;if(isNaN(v))return;const p=x.dataset.dvl.split('.');if(p.length===2){if(S.co)S.co[p[1]]=v;}else S[p[0]]=v;});toast('값 적용');devConsole('char');},
  rank:()=>{const r=+$('#dvR').value;S.rank=r;S.inRank=0;if(r>=2&&!S.team.length)S.team=genTeam();S.scene=baseScene();toast(rankName()+' 적용');devConsole('world');},
  dept:()=>{S.dept=$('#dvD').value;S.mates=null;devConsole('world');},diff:()=>{S.diff=$('#dvF').value;devConsole('world');},
  outlet:()=>{const o=OUTLETS.find(x=>x.id===$('#dvO').value);devRun(()=>transfer(o,Math.max(1,S.rank)));},
  promo:()=>devRun(()=>{S.inRank=999;jinsa();}),simple:()=>{S.simple=!S.simple;S.modeT=S.turn;devConsole('world');},
  item:()=>{S.items.push(makeItem(S.dept));toast('아이템 추가');},itemx:()=>{S.items.push(makeItem(S.dept,{excl:true,mult:1.3}));toast('단독 아이템 추가');},hoax:()=>{S.items.push(makeItem(S.dept,{excl:true,hoax:true}));toast('가짜 제보 아이템 추가');},
  conf:()=>{S.items.forEach(i=>i.facts.forEach(f=>{f.conf=f.need;if(!f.via.length)f.via.push('개발자');}));toast('모든 사실 확인');},
  src:()=>{addSource(S.dept,70);toast('취재원 추가');},src5:()=>{for(let i=0;i<5;i++)addSource(S.dept,R(5,60));toast('취재원 5명');},
  end:()=>{if(devNeedGame())return;ending(arg);render();},fire:()=>{if(devNeedGame())return;devRun(()=>fired('개발자 해고 테스트.'));},
  ev:()=>{if(devNeedGame())return;const [pi,i]=arg.split(':').map(Number);const e=devPools()[pi][1][i];devRun(()=>e.run());},
  beat:()=>{if(devNeedGame())return;const [sid,w]=arg.split(':');devRun(()=>STORY_BEATS[sid][w]());},
  fbeat:()=>{if(devNeedGame())return;devRun(()=>F_BEATS[arg]());},
  med:()=>{if(devNeedGame())return;devRun(()=>mediation({h:(S.clips[0]||{}).h||'개발자 테스트 기사',subj:'테스트 기업',unv:R(0,2),rb:chance(.5),q:55,excl:true,imp:40}));},
  suit:()=>{if(devNeedGame())return;devRun(()=>lawsuit({h:(S.clips[0]||{}).h||'개발자 테스트 기사',subj:'테스트 기업',unv:1,amt:3}));},
  recv:()=>{if(devNeedGame())return;devRun(()=>receiveItem());},
  handoff:()=>{if(devNeedGame())return;if(!S.items.length)S.items.push(makeItem(S.dept));devRun(()=>RUN.handoff());},
  hire:()=>{if(devNeedGame())return;devRun(()=>hireBoard(arg));},
  rot:()=>{if(devNeedGame())return;devRun(()=>{const r=rotation();openModal('순환보직',r||'<p>이번엔 대상이 아니다.</p>');});},
  resh:()=>{if(devNeedGame())return;devRun(()=>{const r=npcReshuffle();openModal('NPC 인사 이동',r||'<p>변동 없음.</p>');});},
  comp:()=>{if(devNeedGame())return;const L=[];compMonth(L);devRun(()=>openModal('경쟁사 한 달',L.length?L.map(x=>`<p>${esc(x.t)}</p>`).join(''):'<p>눈에 띄는 움직임은 없었다. (속사정은 숨은 데이터에서)</p>'));},
  compagg:()=>{(S.comp||[]).forEach(c=>c.aggro=90);toast('경쟁사 경계심 90');},
  crisis:()=>{if(devNeedGame())return;devRun(()=>{const Qx=[];const keep=Math.random;crisisMonth(Qx);if(Qx.length)Qx[0]();else{const e=pick(CRISES.filter(evCond));if(e)e.run();else toast('조건 맞는 위기가 없다');}});},
  season:()=>{if(devNeedGame())return;devRun(()=>{const e=seasonEvent();if(e)e();else toast('이달에는 계절 이벤트가 없다');});},
  scandal:()=>{if(devNeedGame())return;devRun(()=>scandal({title:'개발자 테스트 기사'}));},
  award:()=>{if(devNeedGame())return;if(!S.clips.length){toast('기사가 먼저 있어야 한다');return;}const c=S.clips[0];c.imp=Math.max(c.imp,66);c.awarded=0;c.turn=S.turn;c.q=Math.max(c.q,60);S.nextAward=0;const e=EVENTS.find(x=>/기자상/.test(evTitle(x)));if(e)devRun(()=>e.run());},
  tut:()=>{$('#modal').hidden=true;mTok++;tutorial(0);},patch:()=>{$('#modal').hidden=true;mTok++;patchNotes();},
  goals:()=>{if(devNeedGame())return;S.goalSet=null;S.goals={};goalSetup();toast('목표 다시 뽑음');devConsole('data');},
  promoM:()=>{if(devNeedGame())return;if(nextRank(S.rank)==null){toast('최고 직급');return;}devRun(()=>promote());},
  fsetup:()=>{toast('창간 준비 화면은 새 창간 게임으로 열린다 — 빠른 시작이 아니라 메인의 창간 모드를 쓰자');},
  job:()=>{if(devNeedGame())return;S.cd.job=0;devRun(()=>RUN.job());},
  song:()=>{auUnlock();AU.mood=null;const keep=bgmMood;bgmMood=()=>arg;bgmUpdate();bgmMood=keep;},
  sfx:()=>{auUnlock();sfx(arg);},loader:()=>flashLoad('개발자 테스트 로딩…',1600),toast:()=>toast('토스트 테스트 · 이렇게 뜬다'),
  scene:()=>{const ks=Object.keys(SCENES);const i=(ks.indexOf(S.scene)+1)%ks.length;S.scene=ks[i];drawScene();toast('장면: '+ks[i]);}
 };if(T[k])T[k]();}