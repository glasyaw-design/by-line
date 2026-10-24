/* 바이라인 1.6 — src/compat/v46.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.6 지역 TO로 승진 적체를 푼다: 알리고, 고를 수 있게, 내 커리어 길로도 =====
// 본사엔 차장·부장 자리가 정해져 있는데 연차 찬 사람은 계속 늘어난다. 지역 주재 책임자(주재 차장 · 주재 부장 · 지역본부장/총국장) 자리가 그 숨통이다.
// 예전엔 정기 인사 때 몰래 일어나 잘 보이지 않았다 → 이제 TO 현황판, 인사권자의 「지역 발령」, 「지역 TO 신설」, 내가 직접 가는 「지역 책임자 공모」

const NEED46=[0,10,15,19];
function regD46(){const o=OUT();return o.depts.find(x=>isRegD(x));}
// 지역 TO: 주재지마다 둘 수 있는 직급 자리 (+ 내가 새로 만든 자리)
// 지역 TO를 넓힌다: ★3 이상 매체는 지역마다 주재 차장·주재 부장, 거점 지역은 지역본부장(국장급)까지 둔다 — 본사 적체를 받아 주는 자리
{const _cs46=corrSlots;corrSlots=function(P,r,n){let a=_cs46.apply(this,arguments)||[];try{const o=OUT();if(o&&(o.p||0)>=3&&!corrSmall(o)&&n>=1){const hub=(corrHubs(P)||[]).includes(r)||(P.regs&&P.regs.indexOf(r)>=0&&P.regs.indexOf(r)<2);const b=hub?(n>=2?[3,2,1]:[2]):(n>=3?[2,1]:n>=2?[2,1]:[1]);a=[...new Set(a.concat(b))];}
  const X=(S.corrX46||{})[r];if(X&&X.length)a=[...new Set(a.concat(X))];}catch(e){}return a.sort((x,y)=>y-x);};}
function to46(){const out={hq:{},reg:{},wait:{},vac:[]};try{const per=roster();const D=orgDepts();const T=new Set(S.team||[]);
  // 본사 자리: 부장 = 부서마다 1, 차장 = 정원
  out.hq[2]={cap:D.length,fill:D.filter(d=>orgHead(per[d]||[])).length};out.hq[1]={cap:D.reduce((a,d)=>a+cap45(d,per[d]),0),fill:D.reduce((a,d)=>a+mids45(per[d]),0)};
  // 대기자: 다음 직급 연차·실력이 찼는데 본사 윗자리가 없는 사람
  [0,1].forEach(r=>{out.wait[r+1]=D.flatMap(d=>(per[d]||[]).filter(m=>!T.has(m)&&(m.r||0)===r&&!m.acting&&myrs(m)>=NEED46[r+1]&&(m.skill||0)>=50&&!(lk45(m)&&m.lk45.dem)));});
  out.wait[2]=out.wait[2].filter(()=>out.hq[2].fill>=out.hq[2].cap);out.wait[1]=out.wait[1].filter(m=>mids45(per[m.d])>=cap45(m.d,per[m.d]));
  // 지역 자리
  if(Array.isArray(S.corr)&&S.corr.length&&!S.founder){const P=corrPlan(OUT());const regs=[...new Set(S.corr.map(m=>m.reg))];[1,2,3].forEach(rk=>{out.reg[rk]={cap:0,fill:0};});
    regs.forEach(r=>{const L=S.corr.filter(m=>m.reg===r);const sl=corrSlots(P,r,L.length);sl.forEach(rk=>{if(!out.reg[rk])return;out.reg[rk].cap++;if(L.some(m=>(m.r||0)===rk))out.reg[rk].fill++;else out.vac.push({reg:r,rk});});});}}catch(e){console.error(e);}return out;}
function toBox46(){try{if(S.founder||S.story)return '';const T=to46();const rd=regD46();if(!rd)return '';const rn=['','차장','부장','국장급'];const vac=r=>T.vac.filter(v=>v.rk===r).length;
  const row=(r,lab)=>{const h=T.hq[r],g=T.reg[r]||{cap:0,fill:0},w=(T.wait[r]||[]).length;return `<li><span class="tg pc">${lab}</span>본사 ${h?`${h.fill}/${h.cap}`:'—'} · 지역 ${g.fill}/${g.cap}${vac(r)?` <b style="color:var(--good)">빈 자리 ${vac(r)}</b>`:''}${w?` · <b style="color:var(--sodium)">승진 대기 ${w}명</b>`:''}</li>`;};
  const wN=(T.wait[1]||[]).length+(T.wait[2]||[]).length,vN=T.vac.length;
  return `<div class="card"><div class="t">${ic('map')} 인사 TO — 본사와 지역</div><ul class="pnl">${row(1,'차장')}${row(2,'부장')}${row(3,'국장급')}</ul><p class="hint" style="margin:4px 0 0">${wN&&vN?`본사에서 윗자리가 막힌 사람이 ${wN}명, 지역 책임자 자리가 ${vN}곳 비어 있다 — ${orgCanRun()?'「조직 운영 → 지역 발령」으로 풀 수 있다':'정기 인사 때 지역 책임자로 승진 발령이 난다'}.`:wN?`본사 적체 ${wN}명 — 지역 TO가 차 있다.${orgCanRun()?' 「지역 TO 신설」로 자리를 만들 수 있다.':''}`:'지금은 적체가 크지 않다.'} 지역 책임자는 승진이자 발령이다 — 몇 년 뒤 본사로 돌아오면 그 직급 그대로 온다.</p></div>`;}catch(e){return '';}}
{const _tb46=tabBody;tabBody=function(){let h=_tb46.apply(this,arguments);try{if(S.tab==='org'&&!S.story)h=toBox46()+h;}catch(e){}return h;};}

// 정기 인사: 지역 발령이 났으면 맨 위에 따로 알린다
{const _nj46=npcJinsa;npcJinsa=function(){const r=_nj46.apply(this,arguments);try{if(typeof r==='string'){const n=(r.match(/승진 발령/g)||[]).length;if(n)return `<p class="hint" style="color:var(--good)">적체 해소 — 본사에서 윗자리가 막혀 있던 ${n}명이 지역 책임자로 승진 발령됐다. 본사엔 자리가 하나씩 비어 다음 사람이 올라간다.</p>`+r;}}catch(e){}return r;};}
// 매달: 인사권자에게 적체 알림 (석 달에 한 번)
{const _om46=orgMonth;orgMonth=function(lines){const r=_om46.apply(this,arguments);try{if(orgCanRun()&&!S.founder&&(S.toN46??-99)<S.turn-12){const T=to46();const w=(T.wait[1]||[]).length+(T.wait[2]||[]).length;if(w>=2){S.toN46=S.turn;lines.push({c:'',t:`인사 적체: 승진 대기 ${w}명 · 지역 책임자 빈 자리 ${T.vac.length}곳 — 조직 운영에서 지역 발령으로 풀 수 있다`});}}}catch(e){}return r;};}

// ---------- 인사권자: 지역 발령 · 지역 TO 신설 ----------
function toOpen46(){if(!orgCanRun()){toast('인사권자만 할 수 있다');return;}const T=to46();const rd=regD46();if(!rd){toast('이 회사엔 지역 취재망이 없다');return;}
  const W=[].concat((T.wait[2]||[]).map(m=>[m,2]),(T.wait[1]||[]).map(m=>[m,1])).sort((a,b)=>orgScore(b[0])-orgScore(a[0])).slice(0,8);
  const used=new Set();const O=W.map(([m,rk])=>{const v=T.vac.find(x=>x.rk===rk&&!used.has(x));if(v)used.add(v);return {label:`${m.name} ${MR[rk-1]} → ${v?`${v.reg} ${corrTitle(rk)}`:`지역 ${corrTitle(rk)} (새 자리)`}`,sub:`${DEPTS[m.d]?DEPTS[m.d].n:''} · ${myrs(m)}년 차 · 실력 ${Math.round(m.skill)} · 점수 ${orgScore(m)}${v?' · 빈 자리로 승진 발령':' · 지역 TO를 새로 만든다(인건비↑)'}`,fn:()=>{toSend46(m,rk,v&&v.reg);return false;}};});
  openModal('지역 발령으로 적체 해소',`<p class="lede">본사 윗자리가 막힌 사람을 지역 책임자로 승진 발령한다. 본인은 승진하고, 본사엔 자리가 비어 다음 사람이 올라간다.</p><p class="hint">대기자 ${W.length}명 · 지역 빈 자리 ${T.vac.length}곳. 지역 책임자가 강하면 그 지역 평가·제보·광고가 오른다.</p>`,(O.length?O:[{label:'지금은 승진 대기자가 없다',disabled:true}]).concat([{label:'뒤로',cls:'ghost',fn:()=>{org45Open();return false;}}]));}
function toSend46(m,rk,reg){const rd=regD46();const per=roster();const from=m.d,oldR=m.r||0,P=corrPlan(OUT());let cost=0;
  if(!reg){const regs=[...new Set((S.corr||[]).map(x=>x.reg))];reg=regs.map(r=>[r,(S.corr||[]).filter(x=>x.reg===r&&(x.r||0)>=1).length]).sort((a,b)=>a[1]-b[1])[0];reg=reg&&reg[0];if(!reg){toast('지역 주재지가 없다');return;}S.corrX46=S.corrX46||{};S.corrX46[reg]=(S.corrX46[reg]||[]).concat([rk]);cost=+(.004*rk*(OUT().p||3)).toFixed(3);S.co.extra=+((S.co.extra||0)+cost).toFixed(3);}
  Object.keys(per).forEach(d=>{per[d]=(per[d]||[]).filter(x=>x!==m);});corrPromoteIn(m,rk,reg,rd);(per[rd]=per[rd]||[]).includes(m)||per[rd].push(m);lock45(m);m.rel=clamp((m.rel??20)+8,-50,100);m.hqFrom46=from;
  S.wMood=clamp((S.wMood??60)+.6,0,100);S.co.q=Math.min(100,S.co.q+.2);
  // 본사 연쇄 승진: 빈 자리에 다음 사람
  let chain='';try{const L=per[from]||[];if(oldR===1&&mids45(L)<cap45(from,L)){const c=L.filter(x=>(x.r||0)===0&&myrs(x)>=8&&(x.skill||0)>=48&&!(lk45(x)&&x.lk45.dem)).sort((a,b)=>orgScore(b)-orgScore(a))[0];if(c){c.r=1;lock45(c);c.rel=clamp((c.rel??20)+5,-50,100);chain=` · 본사 ${DEPTS[from].n} 차장 자리엔 ${c.name}${jp(c.name,'이','가')} 올라갔다`;}}}catch(e){}
  log(`인사: ${m.name} → ${reg} ${corrTitle(rk)} 승진 발령${cost?' (지역 TO 신설)':''}`);
  openModal('지역 발령',`<p class="lede"><b>${esc(m.name)}</b> ${MR[oldR]} → <b>${esc(reg)} ${corrTitle(rk)}</b> 승진 발령.</p><p>${cost?`${esc(reg)}에 ${corrTitle(rk)} 자리를 새로 만들었다(월 인건비 ${eok(cost)}↑). `:''}본사 적체가 풀려 편집국 분위기가 한결 낫다${esc(chain)}.</p>`,[{label:'다른 사람도 보낸다',fn:()=>{toOpen46();return false;}},{label:'닫기',cls:'ghost'}]);}
// 조직 운영 목록 맨 위에 버튼
{const _oo46=org45Open;org45Open=function(){_oo46.apply(this,arguments);try{if(regD46()&&!S.founder){const mc=$('#mc');if(mc&&!mc.querySelector('[data-to46]')){const T=to46();const w=(T.wait[1]||[]).length+(T.wait[2]||[]).length;const b=document.createElement('button');b.className='ch';b.dataset.to46=1;b.innerHTML=`<span class="cl">지역 발령으로 적체 해소</span><span class="chips"><i class="cp">승진 대기 ${w}명</i><i class="cp">지역 빈 자리 ${T.vac.length}곳</i></span>`;b.onclick=()=>toOpen46();mc.insertBefore(b,mc.firstChild);}}}catch(e){}};}

// ---------- 내 커리어: 지역 책임자 공모 ----------
// 본사에서 승진이 막혔을 때(같은 직급에 오래 있었는데 승진 신호가 없을 때) 지역 책임자 자리가 비면 공모가 온다. 가면 한 직급 올라 지역을 이끈다
function myStall46(){try{return !S.founder&&!S.story&&!S.op&&!S.chair&&S.rank>=2&&S.rank<=4&&!isRegD(S.dept)&&S.inRank>=promoMinW(S.rank)+YW/2;}catch(e){return false;}}
function leadOffer46(lines){if(!myStall46()||!regD46()||(S.leadOf46??-99)>S.turn-YW)return;if((S.eval||0)<38)return;const reg=corrVacant(S.rank);if(!reg||!chance(.25))return;S.leadOf46=S.turn;const rk=S.rank,title=corrTitle(rk);const stay=(S.eval||0)>=68&&S.inRank<promoMinW(S.rank)+YW;
  Q.push(()=>openModal('지역 책임자 공모',`<p class="lede">본사 ${rankName(S.rank+1)} 자리가 몇 년째 막혀 있다. 그때 인사팀에서 연락이 왔다. "${esc(reg)} ${title} 자리가 비었습니다. 가시면 승진 발령입니다."</p><p class="hint">지역을 이끄는 자리다 — 지역 기관·광고주와의 관계, 주재기자들의 제보가 내 몫이 된다. 2년쯤 뒤 본사로 돌아올 때는 올라간 직급 그대로 온다. 지역 평가가 A 이상이면 복귀 때 사내 평가도 오른다.</p>${stay?'<p class="hint">사내 평가가 높아 본사 승진도 멀지 않다 — 버텨 볼 만하다.</p>':''}`,[
   {label:`간다 — ${reg} ${title}`,rec:!stay,sub:'한 직급 승진 · 지역 책임자 재량(행동력 +1) · 지역 평판↑ · 본사 사내 정치와는 멀어진다',fn:()=>{const rd=regD46();promote();deptHistAdd(S.dept);S.dept=rd;S.deptT=S.turn;S.region=`${reg} ${title}`;S.items=S.items.filter(i=>catOf(rd).includes(i.d));if(S.rank>=2)S.team=genTeam();S.lead46={reg,t:S.turn};log(`${reg} ${jo2(title,'으로','로')} 승진 발령`);toast(`${reg} ${title} 발령`);try{deptArrive(rd);}catch(e){}}},
   {label:'본사에서 버틴다',rec:stay,sub:'승진은 다음 기회로 · 사내 평가 조금↑(충성)',fn:()=>{toast(apply({eval:.5}));}}]));}
{const _om46b=orgMonth;orgMonth=function(lines){const r=_om46b.apply(this,arguments);try{leadOffer46(lines);lead46Month(lines);}catch(e){console.error(e);}return r;};}
function lead46Month(lines){const L=S.lead46;if(!L||!isRegD(S.dept))return;apply({fame:.15});
  if(S.turn-L.t>=YW*2&&!L.ask){L.ask=1;const hq=OUT().depts.filter(d=>!isRegD(d)&&DEPTS[d]);Q.push(()=>openModal('본사 복귀 제안',`<p class="lede">${esc(L.reg)}에서 2년. 본사에서 "이제 올라오라"는 연락이 왔다.</p>`,hq.slice(0,6).map(d=>({label:`${jo2(DEPTS[d].n,'으로','로')} 복귀`,sub:`${rankName()} 그대로 · ${deptPCtxt(d,true)}`,fn:()=>{doRotate(d);S.region=null;S.lead46=null;toast(`본사 ${DEPTS[d].n} 복귀`);}})).concat([{label:'지역에 남는다',sub:'지역 책임자 재량은 계속',fn:()=>{L.ask=0;L.t=S.turn;}}])));}}
{const _ap46=apParts;apParts=function(){const p=_ap46.apply(this,arguments);try{if(S&&S.lead46&&isRegD(S.dept))p.push(['지역 책임자 재량',1]);}catch(e){}return p;};}
// AI: 인사권자에게 적체가 크면 조직 운영을 권한다(이미 1.6 조직 운영 추천에 더해 적체도 본다)
{const _rc46=recommend;recommend=function(){const r=_rc46.apply(this,arguments);try{if(S&&orgCanRun()&&!S.founder&&r!=='rest'&&r!=='breaking'&&rankActs().includes('personnel')&&!why('personnel')&&(S.toR46??-99)<S.turn-8){const T=to46();if(((T.wait[1]||[]).length+(T.wait[2]||[]).length)>=3&&T.vac.length){S.toR46=S.turn;return 'personnel';}}}catch(e){}return r;};}
// 지역 책임자로 막 발령된 달엔 「승진과 함께 다른 부서 발령」이 끼어들지 않는다
{const _dr46=doRotate;doRotate=function(nd){if(S&&S.lead46&&S.lead46.t===S.turn&&isRegD(S.dept)&&!isRegD(nd))return;return _dr46.apply(this,arguments);};}