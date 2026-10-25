// 1.7 · 삭제 요청 상대 · 내 지갑 · 봉투 팝업 · 개인 투자 · 기자 충성 · 크라우드펀딩 한도 · 경쟁사 지분 인수 · AI 선택 점수 · 회사 금고 · 광고 목표 일할
// 예전 파일 v57.js · v58.js · v59.js · v60.js · v61.js · v62.js를 순서 그대로 이어 붙였다

// ───── (예전 v57.js) ─────
/* 바이라인 — src/compat/v57.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 기사 삭제 요청: 기사 내용과 맞는 사람이 찾아오게 =====
// 예전엔 부서만 보고 골라서, 문화부의 「작은도서관 휴관」 기사에 연예인 소속사가 찾아왔다
// → 연예인·무죄·피해자 요청은 제목에 그런 내용이 있을 때만. 그 밖의 비판 기사엔 「기관·단체의 삭제 요청」
try{DEL_T.org={n:'기관·단체의 삭제 요청',who:'기사 속 기관 관계자',ask:'"지적하신 건 이미 바로잡았습니다. 그런데 기사가 계속 검색되니 후원과 이용이 끊겨 갑니다. 내려 주시거나 고친 내용을 실어 주세요."',best:['follow'],c:['cul','ent','spo','culspo','soc','loc','sigun','edu','wel','nat','int','sci','it','env']};}catch(e){}
const DELRE57={
 star:/연예인|배우|가수|아이돌|걸그룹|보이그룹|열애|결혼|이혼|스캔들|사생활|소속사|예능|드라마|영화배우|스타|방송인|유튜버|인플루언서/,
 acq:/기소|구속|혐의|재판|수사|피의자|체포|검찰|경찰|송치|입건|고소|고발|영장/,
 victim:/사건|사고|피해자|피해 가족|유족|범죄|폭행|숨져|숨진|사망|화재|참사|학대|성범죄|스토킹|실종|살인|중상|부상/,
 old:/[가-힣]{2,4} ?씨|주민|시민|학부모|상인|세입자|직원|노동자|운전자|학생/};
{const _dk57=delKind;delKind=function(c){try{if(!c)return null;const t=String(c.h||'');const k=cat1(c.d||'soc');const age=S.turn-c.turn;
  const L=Object.keys(DEL_T).filter(x=>{const T=DEL_T[x];if(!T.c.includes(k)&&!T.c.includes(c.d))return false;
    if(x==='old'&&(age<YW*2||!DELRE57.old.test(t)))return false;
    if(x==='acq'&&(c.pos||!DELRE57.acq.test(t)))return false;
    if(x==='victim'&&!DELRE57.victim.test(t))return false;
    if(x==='star'&&!DELRE57.star.test(t)&&k!=='ent'&&c.d!=='ent')return false;
    if((x==='corp'||x==='pol'||x==='org')&&c.pos)return false;
    if(x==='org'&&(DELRE57.star.test(t)||DELRE57.acq.test(t)||DELRE57.victim.test(t)))return false;
    return true;});
  return L.length?pick(L):null;}catch(e){return _dk57.apply(this,arguments);}};}

// ───── (예전 v58.js) ─────
/* 바이라인 — src/compat/v58.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 「나」 탭에 내 지갑: 넓은 화면에선 월급·생활비 상자가 숨겨져 있어 볼 곳이 없었다 =====
(function(){const st=document.createElement('style');st.textContent=`
.wal58{display:grid;grid-template-columns:repeat(auto-fit,minmax(92px,1fr));gap:6px;margin:8px 0 10px}
.wal58>div{background:rgba(255,255,255,.04);border:1px solid var(--edge,rgba(120,140,200,.16));border-radius:12px;padding:7px 10px}
.wal58 span{display:block;font-size:11.5px;color:var(--mute)}.wal58 b{font-size:14.5px}
`;document.head.appendChild(st);})();
function wal58HTML(){try{const C=[];const won=v=>Math.round(v).toLocaleString('ko-KR')+'만';
  C.push(['통장',won(S.money||0)]);
  if(!S.founder){try{C.push(['월급 (실수령)',`<span style="display:inline;color:var(--good);font-size:inherit">${won(payOf(OUT()))}</span>`]);}catch(e){}}
  try{C.push(['한 달 생활비',won(living())]);}catch(e){}
  if(S.co&&(S.rank>=5||S.founder))C.push(['회사 자금',f1(S.co.cash)+'억']);
  return `<div class="wal58">${C.map(([a,b])=>`<div><span>${a}</span><b>${b}</b></div>`).join('')}</div>`;}catch(e){return '';}}
{const _me58=v19Me;v19Me=function(){const had=!!document.querySelector('.bx-tab .tb .mehero');const r=_me58.apply(this,arguments);
  try{if(S&&S.phase==='game'&&S.tab==='me'){const tb=document.querySelector('.bx-tab .tb');if(tb&&!tb.querySelector('.wal58')){const h=tb.querySelector('.mehero');if(h)h.insertAdjacentHTML('afterend',wal58HTML());else tb.insertAdjacentHTML('afterbegin',wal58HTML());}}}catch(e){}return r;};}

// ───── (예전 v59.js) ─────
/* 바이라인 — src/compat/v59.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 봉투 팝업 바로잡기 =====
// ① 취재 결과의 「바뀐 것」(행동력·컨디션·능력치)이 이어서 뜨는 봉투 팝업에 붙어, 봉투 때문에 바뀐 것처럼 보였다 → 봉투 팝업엔 붙이지 않는다 (결과는 원래대로 따로 보여 준다)
{const _si59=snapInject;snapInject=function(body,title){if(/^(봉투|고맙다는 인사)$/.test(String(title||'')))return body;return _si59.apply(this,arguments);};}
// ② 독립영화·동네 가게·시민단체처럼 작은 곳이 홍보 기사에 수십만 원 봉투를 내미는 건 어색하다 → 작은 곳은 봉투 대신 고맙다는 인사로 끝난다
const SMALL59=/독립|동네|작은|소규모|마을|시민단체|비영리|청년|학생|소상공인|1인|자원봉사|봉사단|동아리|협동조합|사회적|풀뿌리|공부방|야학|복지관|도서관/;
{const _be59=bribeEvent;bribeEvent=function(it){try{if(it&&it.pos&&SMALL59.test(String(it.title||'')+' '+String(it.subj||''))){it.bribed=1;const who=esc(sbjN(it.subj));
    openModal('고맙다는 인사',`<p class="lede">${who} 쪽 담당자가 몇 번이고 고개를 숙였다. "저희 같은 데를 다 써 주시고… 정말 고맙습니다." 손에 쥐여 준 건 직접 만든 소식지 한 부였다.</p>`,[{label:'기사로 보답하자',sub:'취재원 관계↑',fn:()=>{if(it.ent&&S.net&&S.net[it.ent])netUp(it.ent,3);}}]);return;}}catch(e){}
  return _be59.apply(this,arguments);};}

// ───── (예전 v60.js) ─────
/* 바이라인 — src/compat/v60.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 피드백: 개인 투자 · 호감도 높은 기자의 이탈 · 크라우드펀딩 한도 · 경쟁사 지분 인수 =====

// ---------- 1) 개인 투자: 정수 난수 탓에 손실 달이 잦고 체감상 까먹기만 했다 ----------
// ETF 월 평균 +0.7%(변동 3%) · 개별주 +0.9%(변동 7%) · 코인 +0.8%(변동 12%, 가끔 폭락·폭등). 경기가 좋으면 더 오른다
function gs60(){let u=0;while(!u)u=Math.random();return Math.sqrt(-2*Math.log(u))*Math.cos(2*Math.PI*Math.random());}
function ec60(){try{return clamp((econ()||1)-1,-.3,.3);}catch(e){return 0;}}
coinPct=function(){const x=Math.random();return Math.round(x<.025?-R(35,55):x<.06?R(35,80):.8+12*gs60()+ec60()*10);};
{const _lm60=lifeMonth;lifeMonth=function(lines){const e=S.etf||0,s=S.stock||0;S.etf=0;S.stock=0;let r;try{r=_lm60.apply(this,arguments);}finally{S.etf=e;S.stock=s;}
  try{let inv=0;if(S.etf){const d=Math.round(S.etf*Math.max(-15,.7+2.8*gs60()+ec60()*3)/100);S.etf=Math.max(0,S.etf+d);inv+=d;}
    if(S.stock){const d=Math.round(S.stock*Math.max(-35,.9+7*gs60()+ec60()*8)/100);S.stock=Math.max(0,S.stock+d);inv+=d;}
    if(inv){const B=S.invB60||{};const base=(B.etf||0)+(B.stock||0);const now=(S.etf||0)+(S.stock||0);const tot=base?` · 원금 대비 ${now-base>=0?'+':''}${Math.round((now-base)/base*100)}%`:'';
      lines.push({c:inv>0?'g':'r',t:`투자 평가 ${inv>0?'+':''}${inv.toLocaleString('ko-KR')}만 원 (ETF ${(S.etf||0).toLocaleString('ko-KR')}만 · 주식 ${(S.stock||0).toLocaleString('ko-KR')}만${tot})`});}}catch(e){console.error(e);}
  return r;};}
// 원금 기록: 사면 더하고, 전부 팔면 0으로
function invSnap60(){return {etf:S.etf||0,stock:S.stock||0,coin:S.coin||0};}
function invNote60(){try{const B=S.invB60||{};const row=(n,k)=>{const v=S[k]||0,b=B[k]||0;if(!v&&!b)return '';const p=b?Math.round((v-b)/b*100):0;return `${n} 원금 ${b.toLocaleString('ko-KR')}만 → 지금 <b style="color:${v>=b?'var(--good)':'var(--red)'}">${v.toLocaleString('ko-KR')}만 (${p>=0?'+':''}${p}%)</b>`;};
  const L=[row('ETF','etf'),row('주식','stock'),row('코인','coin')].filter(Boolean);return L.length?`<p class="hint">${L.join(' · ')}</p>`:'';}catch(e){return '';}}
{const _om60=openModal;openModal=function(t,b,c){try{if((t==='저축과 투자'||t==='코인 투자')&&S&&S.phase==='game'){S.invB60=S.invB60||{};b=String(b||'')+invNote60();
    if(t==='저축과 투자'&&typeof b==='string')b=b.replace('매달 -4%~+5% · 장기적으로 조금씩 오른다','');
    if(Array.isArray(c))c=c.map(x=>{if(!x||typeof x!=='object'||typeof x.fn!=='function')return x;const fn=x.fn;let sub=x.sub;
      if(/지수 ETF/.test(x.label||''))sub='매달 평균 +0.7% 안팎 · 잔잔하게 오래 오른다 · 경기가 좋으면 더';
      if(/개별 주식 .*매수/.test(x.label||''))sub=String(x.sub||'').replace(/매달 -12%~\+14%/,'매달 평균 +0.9% · 출렁임이 크다');
      return Object.assign({},x,{sub,fn:function(){const a=invSnap60();const r=fn.apply(this,arguments);try{const z=invSnap60(),B=S.invB60=S.invB60||{};['etf','stock','coin'].forEach(k=>{if(z[k]>a[k])B[k]=(B[k]||0)+(z[k]-a[k]);if(!z[k])B[k]=0;});}catch(e){}return r;}});});
    if(t==='코인 투자')b=b.replace('길게 보면 거의 제자리다.','길게 보면 조금 오르지만, 셋 중 하나는 손해를 본다.');}}catch(e){}
  return _om60.call(this,t,b,c);};}
// 코인 급등·급락 이벤트도 위아래가 같게
try{const ev=EVENTS.find(e=>String(e.run).includes('코인 급등'));if(ev){ev.run=()=>{const up=chance(.5);const v=Math.round(S.coin*(up?R(20,50):-R(20,45))/100);openModal(up?'코인 급등':'코인 급락',`<p class="lede">새벽에 알림이 울렸다. 넣어 둔 코인이 ${up?'폭등':'폭락'}했다. 지금 평가 ${(S.coin+v).toLocaleString('ko-KR')}만 원 (${v>=0?'+':''}${v.toLocaleString('ko-KR')}만).</p>`,[{label:'전부 판다',fn:()=>{const t=Math.max(0,S.coin+v);S.coin=0;try{(S.invB60=S.invB60||{}).coin=0;}catch(e){}toast(apply({money:t}));}},{label:'계속 들고 간다',fn:()=>{S.coin=Math.max(0,S.coin+v);toast('계속 들고 가기로 했다');}}]);};}}catch(e){}

// ---------- 2) 호감도가 높은 기자는 쉽게 떠나지 않는다 ----------
// 예전: 타사 영입·처우 불만 퇴사·주니어 이탈이 관계를 전혀 보지 않았다
function loy60(m){const r=(m&&m.rel)??20;return r>=90?.1:r>=75?.25:r>=55?.55:1;}
poachPick=function(){const T=S.team||[];const w=T.map(m=>{const st=npcStage(m);return (st==='mid'?3:st==='jr'?1.2:st==='sr'?.8:.2)*(1+Math.max(0,m.skill-50)/25)*(m.name===S.protege?((m.rel??20)>=60?.08:.5):1)*loy60(m);});let t=w.reduce((a,b)=>a+b,0)*Math.random();for(let i=0;i<T.length;i++){t-=w[i];if(t<=0)return T[i];}return T[0];};
quitBest=function(n,why){const out=[];for(let i=0;i<n&&(S.team||[]).length>3;i++){const L=S.team;const w=L.map(m=>(1+Math.max(0,(m.skill||40)-45)/15)*loy60(m));let t=w.reduce((a,b)=>a+b,0)*Math.random(),k=0;for(;k<L.length-1;k++){t-=w[k];if(t<=0)break;}const m=L[k];S.team=S.team.filter(x=>x!==m);S.co.staff=Math.max(1,S.co.staff-1);out.push(m.name);log(`${m.name} 기자 퇴사 — ${why}`);}if(out.length)S.co.q=clamp(S.co.q-out.length,10,100);return out;};
{const _nl60=npcLife;npcLife=function(lines){const keep=[];try{(S.team||[]).forEach(m=>{if(m&&loy60(m)<1&&chance(1-loy60(m))){keep.push([m,m.own]);m.own=S.turn;}});}catch(e){}
  try{return _nl60.apply(this,arguments);}finally{keep.forEach(([m,o])=>{if(o===undefined)delete m.own;else m.own=o;});}};}

// ---------- 3) 크라우드펀딩·엔젤 투자: 회사가 커지면 못 쓴다 ----------
const CF_CAP60=50,ANGEL_CAP60=200;
function cfBig60(){return !!(S&&S.co&&(S.co.cash>=CF_CAP60));}
{const _om60b=openModal;openModal=function(t,b,c){try{if(t==='투자 유치'&&Array.isArray(c)){const cash=S.co?S.co.cash:0;c=c.map(x=>{if(!x||typeof x!=='object')return x;
    if(x.label==='크라우드펀딩'&&cash>=CF_CAP60)return Object.assign({},x,{disabled:true,sub:`회사 자금 ${CF_CAP60}억 이상이면 독자에게 손을 벌릴 명분이 없다 (지금 ${eok(cash)})`});
    if(x.label==='엔젤 투자'&&cash>=ANGEL_CAP60)return Object.assign({},x,{disabled:true,sub:`이 정도 회사엔 엔젤 투자가 의미가 없다 (회사 자금 ${ANGEL_CAP60}억 이상)`});return x;});}}catch(e){}return _om60b.call(this,t,b,c);};}
try{EVENTS.filter(e=>/openModal\('크라우드펀딩'/.test(String(e.run))).forEach(e=>{const c0=e.c;e.c=()=>c0()&&!cfBig60();});}catch(e){}

// ---------- 4) 경쟁사 지분 인수 ----------
// 10% 배당 · 20% 이사회 한 자리(우리 기자 빼가기·사설 공격·광고 덤핑을 멈춘다) · 51% 자회사(자매사 시너지 · 배당 커짐)
function mnaOk60(){return !!(S&&!S.story&&S.co&&((S.rank===7&&!S.founder)||S.founder));}
function mnaSt60(){return S.mna60=S.mna60||{};}
function mnaP60(id){const x=(S.mna60||{})[id];return x?x.p:0;}
function mnaVal60(c){return Math.max(8,+((c.pw||10)*1.6+Math.max(0,c.cash||0)*.8).toFixed(1));}
try{ACT.mna60={n:'경쟁사 지분 인수',ap:1,sc:'office',cd:4,d:'다른 언론사 지분을 사들인다 — 배당 · 이사회 자리 · 과반이면 자회사'};ACT_IC.mna60='chart';ACT_STAT.mna60=ACT_STAT.fraise||ACT_STAT.board||ACT_STAT.exec||'lead';const g=ACT_GROUPS.find(x=>x[0]==='영업과 경영');if(g&&!g[2].includes('mna60'))g[2].push('mna60');}catch(e){}
{const _rk60=rankActs;rankActs=function(){const a=_rk60.apply(this,arguments);try{if(mnaOk60()&&!a.includes('mna60'))a.push('mna60');}catch(e){}return a;};}
{const _wy60=why;why=function(id){if(id==='mna60'){if(!mnaOk60())return '사장·발행인만 할 수 있다';if(!S.comp||!S.comp.length)return '경쟁사 정보가 없다';if((S.co.cash||0)<3)return '회사 자금이 모자라다 (최소 3억)';}return _wy60.apply(this,arguments);};}
RUN.mna60=function(){const L=(S.comp||[]).slice().sort((a,b)=>(b.pw||0)-(a.pw||0));const st=mnaSt60();
  openModal('경쟁사 지분 인수',`<p class="lede">회사 자금 <b>${eok(S.co.cash)}</b>. 어느 회사 지분을 살까?</p><p class="hint">지분 10% 이상이면 해마다 배당을 받는다. 20%면 이사회에 한 자리를 얻어 그 회사가 우리 기자를 빼 가거나 사설로 공격하지 못한다. 51%를 넘기면 자회사 — 자매사로 서로 기사를 받아 준다. 과반 인수는 독과점 논란으로 신뢰가 조금 깎인다.</p>`,
   L.map(c=>{const p=mnaP60(c.id);const v=mnaVal60(c);return {label:`${cName(c)}${p?` · 내 지분 ${p}%`:''}`,sub:`기업가치 약 ${eok(v)} · ${(C_STRAT[c.strat]||['?'])[0]} ${c.share>=1?` · 점유율 ${Math.round(c.share)}%`:''}${p>=51?' · 자회사':p>=20?' · 이사회 자리':''}`,fn:()=>{mnaOne60(c);return false;}};}).concat([{label:'닫기',cls:'ghost'}]));};
function mnaOne60(c){const st=mnaSt60();const x=st[c.id]=st[c.id]||{p:0,t0:S.turn,paid:0};const v=mnaVal60(c),n=cName(c),cash=S.co.cash;
  const tr=+(v*.1*(1+.08*(x.p/10))).toFixed(1);const need=Math.max(0,51-x.p);const tko=+(v*need/100*1.35).toFixed(1);const sell=+(v*x.p/100*.9).toFixed(1);
  const done=(t)=>{spend(1,3);setCd('mna60');toast(t);};
  const C=[];
  if(x.p<51)C.push({label:`지분 10% 매입 · ${eok(tr)}`,sub:`${x.p}% → ${x.p+10}%${x.p+10>=20&&x.p<20?' · 이사회 한 자리':''} · 살수록 값이 오른다`,disabled:cash<tr||x.p+10>50,fn:()=>{S.co.cash-=tr;x.p+=10;x.paid=+(x.paid+tr).toFixed(1);log(`${n} 지분 10% 매입 (${x.p}%)`);try{tick(`「${OUT().n}」, ${n} 지분 ${x.p}% 확보`,1);}catch(e){}done(`${n} 지분 ${x.p}% · -${eok(tr)}`);}});
  if(x.p>=20&&x.p<51)C.push({label:`경영권 인수 — 51%까지 공개매수 · ${eok(tko)}`,sub:'웃돈 35% · 자회사가 된다 · 독과점 논란(신뢰 조금↓)',risk:true,disabled:cash<tko,fn:()=>{S.co.cash-=tko;x.p=51;x.paid=+(x.paid+tko).toFixed(1);x.own=S.turn;c.aggro=0;try{S.co.bS+=.008;}catch(e){}log(`${n} 경영권 인수`);try{tick(`「${OUT().n}」, ${n} 인수 — 언론 그룹으로`,2);}catch(e){}done(`${n} 인수 · ${apply({trust:-2,fame:1.5})}`);}});
  if(x.p>0)C.push({label:`지분 전량 매각 · +${eok(sell)}`,sub:`${x.p}% 전부 · 시가보다 10% 싸게`,fn:()=>{S.co.cash+=sell;log(`${n} 지분 ${x.p}% 매각`);delete st[c.id];done(`${n} 지분 매각 · +${eok(sell)}`);}});
  C.push({label:'뒤로',cls:'ghost',fn:()=>{RUN.mna60();return false;}});
  openModal(`${n} 지분`,`<p class="lede">기업가치 약 <b>${eok(v)}</b> · 지금 내 지분 <b>${x.p}%</b>${x.paid?` (들인 돈 ${eok(x.paid)})`:''}.</p><p class="hint">${C_STRAT[c.strat]?`${C_STRAT[c.strat][0]} — ${C_STRAT[c.strat][1]}. `:''}회사 자금 ${eok(cash)}.</p>`,C);}
// 이사회 자리 이상: 우리를 겨냥한 수를 두지 않는다
{const _cd60=compDecide;compDecide=function(c,ctx){const k=_cd60.apply(this,arguments);try{const p=mnaP60(c&&c.id);if(p>=20&&['poach','editorial','pricecut','lgebid'].includes(k))return p>=51?'follow':'invest';}catch(e){}return k;};}
{const _so60=sisOf;sisOf=function(id){if(mnaP60(id)>=51)return true;return _so60.apply(this,arguments);};}
// 해마다 배당 (1월 첫 주)
{const _cm60=compMonth;compMonth=function(lines){const r=_cm60.apply(this,arguments);try{if(S.mna60&&S.co&&S.turn%YW===0&&S.mnaY60!==S.turn){S.mnaY60=S.turn;let tot=0;const by=[];
    Object.keys(S.mna60).forEach(id=>{const x=S.mna60[id];const c=(S.comp||[]).find(y=>y.id===id);if(!c||x.p<10)return;const d=+(x.p/100*Math.max(0,c.cash||0)*(x.p>=51?.45:.25)).toFixed(2);if(d<=0)return;c.cash-=d;S.co.cash+=d;tot+=d;by.push(`${cName(c)} ${eok(d)}`);});
    if(tot>0&&lines)lines.push({c:'g',t:`지분 배당 +${eok(tot)} (${by.join(' · ')})`});}}catch(e){console.error(e);}return r;};}

// ───── (예전 v61.js) ─────
/* 바이라인 — src/compat/v61.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 전수 조사 ①: 버그 · AI 선택 · 회사 금고 =====

// ---------- 1) 그룹 복귀(ownReturn) 때 기록 상자가 없으면 멈추던 문제 ----------
{const _or61=ownReturn;ownReturn=function(){try{if(S&&!S.grpOwn)S.grpOwn={};}catch(e){}return _or61.apply(this,arguments);};}

// ---------- 2) 맡기기 AI가 고르는 선택지 ----------
// 예전: 「거절·접는다·넘긴다」가 들어간 선택지는 무조건 피해서, 「광고주의 조건 → 써 준다」처럼 신뢰를 깎는 쪽을 골랐다
// 이제: 추천 · 방향 · 위험 · 신뢰·벌점·소송 표시를 점수로 따져 고른다
function aiBtnScore61(k,b,i){const D=AUTO_DIR[k]||{};const t=b.innerText||'';let s=0;
  if(b.classList.contains('rec')||b.querySelector('.bdg.rec,.rec'))s+=4;
  if(D.pref&&D.pref.test(t))s+=1.2;
  if(b.querySelector('.bdg.rsk')||b.classList.contains('risk')||/위험/.test(t))s-=k==='scoop'?1.5:3;
  if(/그만두|포기|취소|닫기|뒤로|나중에/.test(t))s-=3;
  if(/신뢰도?\s*↓↓|신뢰도?\s*크게\s*↓/.test(t))s-=3;else if(/신뢰도?\s*조금\s*↓/.test(t))s-=.8;else if(/신뢰도?\s*↓/.test(t))s-=2;
  if(/신뢰도?\s*(조금\s*|크게\s*)?↑/.test(t))s+=.8;
  if(/포털 벌점|벌점|들킬|윤리 위반|징계/.test(t))s-=1.5;
  if(/소송/.test(t)&&!/소송을 막|소송 방패/.test(t))s-=.8;
  if(/접는다|킬한다|덮는다/.test(t))s-=1;
  if(k==='money'&&/돈↑|매출↑|수입↑|광고↑/.test(t))s+=.6;
  if(k==='safe'&&/확인|반론|사실만|정정/.test(t))s+=.6;
  return s-i*.01;}
autoPickBtn=function(k,tried){const bs=[...document.querySelectorAll('#mc button')].filter(b=>!b.disabled&&!(tried&&tried.has((b.innerText||'').split('\n')[0])));if(!bs.length)return null;
  const main=bs.filter(b=>!b.classList.contains('ghost'));const L=main.length?main:bs;let best=null,bv=-1e9;L.forEach((b,i)=>{const v=aiBtnScore61(k,b,i);if(v>bv){bv=v;best=b;}});return best;};

// ---------- 3) 사장의 광고주 순회: 신뢰가 낮으면 추천하지 않는다 ----------
{const _om61=openModal;openModal=function(t,b,c){try{if(t==='광고주 영업 (사장)'&&Array.isArray(c)&&(S.trust??50)<50){c=c.map(x=>{if(!x||typeof x!=='object')return x;if(x.label==='대형 광고주 순회')return Object.assign({},x,{rec:false});if(/정부·공공기관/.test(x.label||''))return Object.assign({},x,{rec:true});return x;});}}catch(e){}return _om61.call(this,t,b,c);};}

// ---------- 4) 회사 금고: 경영권 밖이면 돈이 끝없이 쌓이지 않는다 ----------
// 예전: 큰 매체는 10년이면 회사 자금이 1,000억을 넘었고, 나중에 사장이 되면 그대로 물려받았다
// 이제: 해마다 연 매출의 0.8배를 넘는 현금은 60%를 대주주 배당·설비 투자로 내보낸다 (내가 사장·발행인이면 내가 정한다)
{const _om61b=orgMonth;orgMonth=function(lines){const r=_om61b.apply(this,arguments);try{const c=S.co;if(c&&!S.founder&&!S.story&&S.rank<7&&month()===12&&S.cashCapY61!==Math.floor(S.turn/YW)){S.cashCapY61=Math.floor(S.turn/YW);
    const yr=((c.last&&c.last.rev)||0)*12;if(yr>0&&c.cash>yr*.8){const out=+((c.cash-yr*.8)*.6).toFixed(1);c.cash-=out;if(lines&&S.rank>=4)lines.push({c:'',t:`연말 결산 — 쌓인 현금 ${eok(out)}을 대주주 배당과 설비 투자로 내보냈다 (회사 자금 ${eok(c.cash)})`});}}}catch(e){console.error(e);}return r;};}

// ---------- 5) 경찰서 기자실 텃세: 스포츠·연예·전문지·영문지·주간지 수습에겐 어색하다 ----------
try{EVENTS.filter(e=>String(e.run).includes("'기자실의 텃세'")).forEach(e=>{const c0=e.c;e.c=()=>c0()&&!['sports','trade','eng','weekly'].includes((OUT()||{}).type);});}catch(e){}

// ---------- 6) 효과가 안 적혀 있던 선택지에 효과를 적는다 (플레이어와 AI가 같이 보고 고른다) ----------
const SUB61={'회장님 사진':{'싣는다':'광고주 관계↑ · 자금 조금↑ · 신뢰↓','광고면에만 싣겠다고 한다':'광고주 관계 조금↓ · 신뢰 조금↑'},
 '정부 광고 축소':{'담당자를 찾아가 관계를 푼다':'기관 관계↑ · 신뢰 조금↓'},
 '정부 광고 배정':{'고맙게 받는다':'자금↑ · 신뢰 조금↓','편집국에 "신경 쓰지 말라"고 공지한다':'자금↑ · 신뢰↑'},
 '압수수색':{'협조한다':'취재원들이 등을 돌린다 · 신뢰↓'}};
{const _om61c=openModal;openModal=function(t,b,c){try{const M=SUB61[t];if(M&&Array.isArray(c))c=c.map(x=>x&&typeof x==='object'&&M[x.label]&&(!x.sub||!/신뢰/.test(x.sub))?Object.assign({},x,{sub:M[x.label]}):x);}catch(e){}return _om61c.call(this,t,b,c);};}

// ---------- 7) 데스킹: 문제 문장이 남았으면 출고 대신 보강 지시를 권한다 ----------
// 예전: 맡기기 AI가 문제 문장이 남은 초고도 늘 「출고한다」를 눌러, 부장 10년이면 신뢰가 70 넘게 깎였다
{const _om61d=openModal;openModal=function(t,b,c){try{if(t==='데스킹 3/3 · 처리'&&Array.isArray(c)&&/오보 위험/.test(String(b||''))){c=c.map(x=>{if(!x||typeof x!=='object')return x;if(x.label==='출고한다')return Object.assign({},x,{sub:(x.sub||'')+' · 오보 위험',rec:false});if(/^보강 지시/.test(x.label||''))return Object.assign({},x,{rec:true});return x;});}}catch(e){}return _om61d.call(this,t,b,c);};}

// ───── (예전 v62.js) ─────
/* 바이라인 — src/compat/v62.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 전수 조사 ②: 광고 목표 =====
// 반기 중간에 부서를 옮기거나 팀원이 새로 꾸려지면, 새 사람들의 실적은 0부터 쌓이는데 목표는 반기 전체 몫으로 잡혀
// 「목표 10억 · 실적 20%」처럼 처음부터 못 채우는 목표가 됐다 → 반기 중간에 들어온 사람은 남은 기간만큼만 목표를 진다
function qHalf62(){return Math.floor(S.turn/(4*QM));}
function qTrack62(m){if(!m||typeof m!=='object')return;const hk=qHalf62();if(m.qH62!==hk){m.qH62=hk;m.qS62=qMon()<=1?hk*4*QM:S.turn;}}
function qFrac62(m){try{if(!m||m.qH62!==qHalf62())return 1;const h0=qHalf62()*4*QM;return clamp((h0+4*QM-m.qS62)/(4*QM),0,1);}catch(e){return 1;}}
function qTrackAll62(){try{const per=roster();Object.values(per).forEach(L=>(L||[]).forEach(qTrack62));(S.team||[]).forEach(qTrack62);}catch(e){}}
{const _das62=deptAdStat;deptAdStat=function(d){const r=_das62.apply(this,arguments);try{if(r&&Array.isArray(r.rows)){let cut=0;r.rows.forEach(x=>{qTrack62(x.m);const f=qFrac62(x.m);if(f<1){cut+=x.goal*(1-f);x.goal*=f;x.part62=f;}});r.goal-=cut;r.cut62=cut;}}catch(e){}return r;};}
{const _em62=endMonth;endMonth=function(){qTrackAll62();const r=_em62.apply(this,arguments);qTrackAll62();return r;};}
// 영업 창: 부서 목표 가운데 내 몫이 얼마인지, 나머지는 누가 채우는지 보여 준다
{const _om62=openModal;openModal=function(t,b,c){try{if(t==='광고·협찬 영업'&&typeof b==='string'&&S&&S.co&&!S.founder&&(deptShared()||nrAll())){const st=nrAll()?nrAdStat():deptAdStat(S.dept);const own=quotaOwn(),mine=myAdDirect();const rest=Math.max(0,st.goal-own),restGot=Math.max(0,st.got-mine);
    const line=`<p class="hint" style="margin:6px 0 0">이 목표는 ${jo2(nrAll()?'편집국 전체 부서':'부서원 모두','이','가')} 함께 진다 — <b>내 몫 ${eok(own)}</b> (지금 ${eok(mine)}) · ${nrAll()?'부서들':'부서원'} 몫 ${eok(rest)} (지금 ${eok(restGot)}). 부서원은 매달 알아서 영업한다.</p>`;
    b=b.replace(/(<div class="adq">[\s\S]*?<\/p>)/,'$1'+line);}}catch(e){}return _om62.call(this,t,b,c);};}
