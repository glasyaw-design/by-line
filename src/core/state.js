/* 바이라인 — src/core/state.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ================= 상태 =================
let S=null;
const SAVE_KEY='byline-career-v2';
function newState(){try{oReset();}catch(e){}return{v:2,phase:'title',diff:'normal',name:'',major:0,spec:0,st:{...ST0},hp:100,ap:4,money:300,eval:42,fame:0,trust:48,turn:0,outlet:null,dept:'soc',rank:0,inRank:0,atOutlet:0,items:[],sources:[],clips:[],log:[],team:[],co:null,pending:[],history:[],apply:[],weekArticles:0,monthQ:[],dry:0,lowEval:0,awards:0,scoops:0,errors:0,lastError:-999,flags:{},cd:{},ach:{},scene:'newsroom',tab:'me',capName:rname(),retries:0,rival:null,ticker:[],reqDept:null,dev:false,devOpen:false};}
function saveGame(){if(!S||(S.phase!=='game'&&S.phase!=='end'))return;if((S.turn>=96||S.phase==='end')&&!S.dev)setVet();try{localStorage.setItem(SAVE_KEY,JSON.stringify(S));window.__svOK=1;}catch(e){window.__svOK=0;try{svFail76(e);}catch(_){}}}
function loadGame(){try{const s=localStorage.getItem(SAVE_KEY);return s?JSON.parse(s):null;}catch(e){return null;}}
const SAVESLOT=i=>'byline-slot-'+i;
function slotInfo(i){try{const v=localStorage.getItem(SAVESLOT(i));return v?JSON.parse(v):null;}catch(e){return null;}}
function saveSlot(i){try{localStorage.setItem(SAVESLOT(i),JSON.stringify({t:Date.now(),label:`${S.name} · ${OUT().n} ${rankName()} · ${years()}년 차 ${dateStr()}`,S}));toast(`슬롯 ${i}에 저장했다`);return true;}catch(e){toast('저장 공간이 없다 (브라우저 저장소가 막혀 있다)');return false;}}
function loadInto(data){const dv=S&&S.dev;flashLoad('저장 파일 펼치는 중…',700);S=migrate(data);S.dev=S.dev||dv;knowFix();followFixTitles();S.scene=baseScene();saveGame();render();toast('불러왔다');}
function saveCode(){return btoa(unescape(encodeURIComponent(JSON.stringify(S))));}
function saveMenu(){const inGame=S&&S.phase==='game';const rows=[1,2,3].map(i=>{const d=slotInfo(i);return{i,d};});
  openModal('저장 · 불러오기',`<p>${inGame?'자동 저장과 별개로 슬롯 3개에 따로 저장할 수 있다. ':''}저장은 이 브라우저에만 남는다. 다른 기기로 옮기려면 저장 파일(코드)을 내보내 가져오면 된다.</p>${rows.map(r=>`<div class="card"><div class="t">슬롯 ${r.i}</div><div class="meta"><span>${r.d?esc(r.d.label)+' · '+new Date(r.d.t).toLocaleString('ko-KR'):'비어 있음'}</span></div></div>`).join('')}`,
   [...(inGame?rows.map(r=>({label:`슬롯 ${r.i}에 저장${r.d?' (덮어쓰기)':''}`,fn:()=>{saveSlot(r.i);saveMenu();return false;}})):[]),
    ...rows.filter(r=>r.d).map(r=>({label:`슬롯 ${r.i} 불러오기`,sub:r.d.label,fn:()=>{loadInto(r.d.S);return undefined;}})),
    ...[0,1,2].map(i=>({i,d:autoInfo(i)})).filter(r=>r.d).map(r=>({label:`자동 저장 · ${['지난달','2달 전','3달 전'][r.i]} 불러오기`,sub:r.d.label+' · 실수를 되돌리고 싶을 때',fn:()=>{loadInto(r.d.S);return undefined;}})),
    ...(inGame?[{label:'저장 파일 내보내기',sub:'파일로 내려받거나 코드를 복사한다',fn:()=>{const code=saveCode();try{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([code],{type:'text/plain'}));a.download=`byline-${S.name}-${years()}년차.txt`;document.body.appendChild(a);a.click();a.remove();}catch(e){}openModal('저장 코드',`<p>파일이 내려받아지지 않았다면 아래 코드를 통째로 복사해 두자.</p><textarea id="svc" readonly style="width:100%;height:140px;background:var(--panel2);color:var(--fg);border:1px solid var(--line);border-radius:10px;padding:8px;font-size:11px">${code}</textarea>`,[{label:'코드 복사',fn:()=>{const t=$('#svc');t.select();try{navigator.clipboard.writeText(t.value);}catch(e){document.execCommand&&document.execCommand('copy');}toast('복사했다');return false;}},{label:'닫기',cls:'ghost'}]);return false;}}]:[]),
    {label:'저장 파일 가져오기',sub:'파일을 고르거나 코드를 붙여 넣는다',fn:()=>{openModal('저장 가져오기',`<p>내보낸 저장 파일을 고르거나 코드를 붙여 넣는다. 지금 진행 중인 게임은 덮어쓴다.</p><input type="file" id="svf" accept=".txt,.json" style="margin-bottom:8px"><textarea id="svi" placeholder="저장 코드 붙여 넣기" style="width:100%;height:120px;background:var(--panel2);color:var(--fg);border:1px solid var(--line);border-radius:10px;padding:8px;font-size:11px"></textarea><p id="svw" class="warn keep"></p>`,[{label:'가져오기',fn:()=>{const go=txt=>{try{const t=txt.trim();const data=JSON.parse(t.startsWith('{')?t:decodeURIComponent(escape(atob(t))));if(!data||!data.phase||!data.outlet)throw 0;loadInto(data);closeModal();}catch(e){$('#svw').textContent='저장 코드가 올바르지 않다.';}};const f=$('#svf').files&&$('#svf').files[0];if(f){f.text().then(go);}else go($('#svi').value);return false;}},{label:'취소',cls:'ghost'}]);return false;}},
    {label:'닫기',cls:'ghost'}]);}
function hasSave(){const s=loadGame();return s&&s.phase==='game';}

const OUT=()=>OUTLETS.find(o=>o.id===S.outlet);
const isTV=()=>!!(S&&S.outlet&&['tv','jp','ch'].includes(OUT().type));
function rankChain(o){o=o||OUT();if(S&&S.rankSys&&S.rankSys[o.id])return S.rankSys[o.id];if(o.p>=4)return [0,1,2,3,4,5,6,7];if(o.p===3)return [0,1,2,3,5,6,7];return [0,1,3,6,7];}
// 회사 규모·성격에 따라 승진 속도와 문턱이 다르다 (작을수록 빠르고 수월, 클수록 느리고 경쟁)
function orgK(o){o=o||OUT();const p=o?o.p:3;const t=o?o.type:'daily';const ten={1:.62,2:.72,3:.88,4:1.05,5:1.2}[p]||1;const tt={online:-.06,trade:-.04,weekly:-.04,local:-.02,wire:.06,tv:.05,jp:.06}[t]||0;
  return{ten:(ten+tt)*otr('ten',o),ev:{1:-8,2:-6,3:-2,4:1,5:3}[p]||0,fm:{1:-13,2:-10,3:-4,4:2,5:5}[p]||0,pick:Math.min(1,({1:1,2:1,3:.95,4:.82,5:.68}[p]||1)*otr('pick',o)),
   n:{1:'아주 작은 회사 — 사람이 모자라 금방 올라간다',2:'작은 회사 — 승진이 빠르고 문턱이 낮다',3:'중견 매체 — 보통 속도',4:'큰 매체 — 자리가 적어 경쟁이 붙는다',5:'메이저 — 동기들과 몇 안 되는 자리를 다툰다'}[p]||''};}
function promoMinW(r){return Math.round(rankMin(r)*DF().ten*orgK().ten*(S&&S.simple?.75:1));}
function promoEv(r){return RANKS[r].ev+DF().need+orgK().ev;}
function promoFm(r){return Math.max(5,RANKS[r].fm+DF().need+orgK().fm);}
function rankMin(r){const n=nextRank(r);const sk=n==null?0:Math.max(0,n-r-1);return RANKS[r].min*(1+.45*sk);}
function nextRank(r){const ch=rankChain();const i=ch.indexOf(r);return i>=0&&i<ch.length-1?ch[i+1]:null;}
function fitRank(r,o){const ch=rankChain(o);let b=ch[0];ch.forEach(x=>{if(x<=r)b=x;});return b;}
function teamSize(){const st=S.co?S.co.staff:OUT().staff;const d=OUT().depts.length||6;return clamp(Math.round(st/d/2.2),2,9)+(S.rank>=4?3:0);}
function leaders(){const o=OUT();S.lead=S.lead||{};if(S.leadOut!==S.outlet){S.lead={chief:rname(),ceo:rname(),dirs:Array.from({length:o.p>=4?R(2,4):o.p===3?1:0},()=>rname()),deps:Array.from({length:o.p>=4?R(2,3):o.p===3?1:0},()=>rname())};S.leadOut=S.outlet;try{legacyLeader(S.lead);}catch(e){}try{if(!S.founder&&!S.story){const st=seatEnsure();if(st){if(!st.ed.me)S.lead.chief=st.ed.n;if(!st.ceo.me)S.lead.ceo=st.ceo.n;}}}catch(e){}}
  const bs=colBy('boss');const chief=S.rank===6?S.name:(S.rank===4||S.rank===5)&&bs?bs.name:S.lead.chief;const ceo=S.rank===7?S.name:S.rank===6&&bs?bs.name:S.lead.ceo;
  return{chief,ceo,dirs:S.lead.dirs,deps:S.lead.deps};}
function employees(){const o=OUT();const k={daily:2.2,econ:2,wire:1.5,tv:2.6,jp:2.3,ch:2,local:1.8,sports:1.7,online:1.4,weekly:1.6,trade:1.5,eng:1.6}[o.type]||1.8;return Math.round(S.co.staff*k);}
function orgCounts(){const per=roster();let c=[0,0,0,0];Object.values(per).forEach(L=>L.forEach(m=>c[Math.min(3,m.r||0)]++));const o=OUT();const L=leaders();
  const trainee=o.p>=3?Math.max(1,Math.round(c[0]*.05)):0;
  const rows=[['사장(대표)',1,L.ceo+(S.rank===7?' (나)':'')],[isTV()?'보도국장':'편집국장',1,L.chief+(S.rank===6?' (나)':'')]];
  if(L.dirs.length)rows.push(['국장',L.dirs.length+(S.rank===5?1:0),L.dirs.join(', ')+(S.rank===5?`, ${S.name}(나)`:'')]);
  if(L.deps.length||c[3])rows.push(['부국장',L.deps.length+c[3]+(S.rank===4?1:0),L.deps.join(', ')+(c[3]?` 외 부서장 ${c[3]}명`:'')+(S.rank===4?`, ${S.name}(나)`:'')]);
  rows.push(['부장(팀장)',c[2],'부서마다 한 명'],['차장',c[1],`부장 직무대리 ${Object.values(per).flat().filter(m=>m.acting).length}명 포함 · 큰 부서·지역 취재망은 여럿`],['기자',c[0]-trainee,''],['수습기자',trainee,'']);return rows;}
// 부서별 인원 — 정치·경제·사회가 크고, 문화·체육·연예는 종합지 기준 많아야 서너 명(전문지는 예외). 편집국엔 취재 부서 말고도 편집·사진·디지털·논설 데스크가 있다
const SUPPORT={x_edit:'편집부',x_photo:'사진부',x_digi:'디지털뉴스부',x_op:'논설위원실'};
const dn=d=>DEPTS[d]?DEPTS[d].n:SUPPORT[d]||d;
function deptTarget(d,o,sf){const T=o.type;const core={sports:['spo','base','foot','ent','culspo'],econ:['eco','ind','fin','stock','estate','it'],local:['city','soc','loc','sigun'],trade:o.depts}[T]||['pol','eco','soc'];
  if(core.includes(d))return null;
  const small={cul:[3,6],culspo:[3,6],spo:[3,5],base:[2,4],foot:[2,4],ent:[2,4],med:[2,5],edu:[2,5],it:[3,7],estate:[2,5],stock:[3,7],inv:[3,8],diplo:[3,9],int:[3,10],court:[4,14],case:[5,18],fin:[3,9],ind:[4,14],city:[3,10]}[d];
  if(!small)return null;return Math.round(clamp(small[0]+(small[1]-small[0])*sf,small[0],small[1]));}
const rTitle=m=>m.desk?'편집장(데스크)':m.acting?'차장(부장 직무대리)':MR[Math.min(3,m.r||0)];
function roster(){const o=OUT(),c=S.co;const total=Math.min(c.staff,700);if(!S.ros||S.rosOut!==S.outlet||Math.abs(S.ros.n-total)>Math.max(4,total*.15)||S.ros.dk!==o.depts.join()||!S.ros.v3){
  const per={};o.depts.forEach(d=>per[d]=[]);S.team.forEach(m=>{(per[m.d]||(per[m.d]=[])).push(m);});const CR=corrs();const regD=o.depts.find(x=>isRegD(x));if(regD&&CR.length)CR.forEach(m=>per[regD].push(m));
  const sf=clamp((total-30)/300,0,1);const tv=['tv','jp','ch'].includes(o.type);
  const sup=total>=25?{x_edit:Math.round(total*(tv?.08:o.type==='wire'?.05:.11)),x_photo:Math.round(total*(tv?.12:.05)),x_digi:Math.round(total*.06),x_op:o.p>=3&&!tv?Math.max(2,Math.round(total*.03)):0}:{x_edit:total>=10?1:0};
  if(tv)SUPPORT.x_photo='영상취재부';else SUPPORT.x_photo='사진부';
  let left=total-Object.values(per).reduce((a,L)=>a+L.length,0)-Object.values(sup).reduce((a,b)=>a+b,0);
  const fixed={};if(regD&&CR.length){const hq=Math.max(3,Math.round(total*.07)-Math.round(CR.length*.25));fixed[regD]=CR.length+hq;left-=hq;}o.depts.forEach(d=>{if(d===regD&&CR.length)return;const t=deptTarget(d,o,sf);if(t!=null){fixed[d]=Math.max(t,per[d].length);left-=fixed[d]-per[d].length;}});
  const free=o.depts.filter(d=>fixed[d]==null&&!(d===regD&&CR.length));const w=free.map(d=>DEPT_W[d]||1);const ws=w.reduce((a,b)=>a+b,0)||1;left=Math.max(free.length*2,left);
  const tiny=total<14;const want={};free.forEach((d,i)=>want[d]=Math.max(tiny?1:2,Math.round(left*w[i]/ws)));Object.assign(want,fixed);
  // 정치·경제·사회 같은 핵심·인기 부서는 편집국 규모에 맞는 최소 인원을 둔다 (다른 부서에서 떼어 온다)
  {const CORE_MIN={pol:.09,eco:.09,soc:.1,ind:.06,case:.06};const hqN=Object.keys(want).filter(d=>!(d===regD&&CR.length)).reduce((a,d)=>a+want[d],0);
   o.depts.forEach(d=>{const sh=CORE_MIN[d];if(!sh||want[d]==null||(d===regD&&CR.length))return;const need=Math.max(tiny?1:2,Math.round(hqN*sh));let gap=need-want[d];if(gap<=0)return;
     const donors=Object.keys(want).filter(x=>!CORE_MIN[x]&&!(x===regD&&CR.length)&&want[x]>(tiny?1:3)).sort((a,b)=>want[b]-want[a]);let g=0;while(gap>0&&donors.length&&g++<200){const x=donors[g%donors.length];if(want[x]>(tiny?1:3)){want[x]--;want[d]++;gap--;}else donors.splice(donors.indexOf(x),1);}});}
  const fill=(d,n)=>{per[d]=per[d]||[];const k0=per[d].length;for(let k=k0;k<n;k++){const m=genMember(d,30,75);m.r=k===0?(n<=6&&chance(.35)?1:o.p>=4&&chance(.15)&&!SUPPORT[d]?3:2):(k===1&&n>=4&&chance(.8))||(n>=12&&k%11===0&&chance(.7))?1:0;if(k===0&&m.r===1)m.acting=1;m.yrs=yrsFor(m.r);per[d].push(m);}fixDept(per[d],d);};
  Object.keys(want).forEach(d=>fill(d,want[d]));if(regD&&CR.length)fixDept(per[regD],regD);
  Object.keys(sup).forEach(d=>{if(sup[d]>0)fill(d,sup[d]);});
  if(tiny){// 작은 매체: 부서장 대신 편집장(데스크) 한 명이 전체를 본다
    const all=Object.values(per).flat().filter(m=>!S.team.includes(m));const top=all.sort((a,b)=>myrs(b)-myrs(a))[0];all.forEach(m=>{if(m!==top){m.r=0;m.acting=0;}});if(top){top.r=2;top.acting=0;top.desk=1;}}
  S.ros={per,n:total,dk:o.depts.join(),v2:1,v3:1};S.rosOut=S.outlet;S.rosDept=S.dept;}Object.values(S.ros.per).forEach(a=>a.forEach(fitSk));try{rosterMove(S.ros.per);}catch(e){console.error(e);}actingFix(S.ros.per);try{headFix(S.ros.per);}catch(e){console.error(e);}try{syncPeople(S.ros.per);}catch(e){}dedupeNames(S.ros.per);return S.ros.per;}
// 7.1 내가 평기자·차장일 때 우리 부서에 부장(AI)이 없던 문제: 내 팀원으로 자리가 다 차면 부서장이 생기지 않았다
function headFix(per){if(!S||S.founder||S.story||S.rank>2||!per)return;const d=S.dept;if(!DEPTS[d]||isRegD(d))return;const L=per[d];if(!L)return;const T=S.team||[];
  if(Object.values(per).flat().some(m=>m.desk))return;if(L.some(m=>(m.r||0)>=2&&!T.includes(m)))return;
  let h=L.filter(m=>!T.includes(m)&&(m.r||0)>=1).sort((a,b)=>myrs(b)-myrs(a))[0];if(!h){h=genMember(d,50,72);h.yrs=yrsFor(2);h.t0=S.turn;fitSk(h);L.unshift(h);}h.r=2;h.acting=0;
  if(S.rank<=1&&L.length>=4&&!L.some(m=>m!==h&&(m.r||0)===1&&!T.includes(m))){const c=L.filter(m=>m!==h&&!T.includes(m)).sort((a,b)=>myrs(b)-myrs(a))[0];if(c){c.r=1;c.acting=0;if(myrs(c)<10){c.yrs=yrsFor(1);c.t0=S.turn;}}}}
// --- 주재 지역 · 부서 변경 시 구성원 교체 ---
const REGION_DEPTS=['nat','sigun','loc','city'];
const SUBCITY=['가람시','누리군','한솔시','바다군','솔내시','강마루시','들녘군','새터시'];
function regionList(){return [...new Set(Object.values(REGIONS).map(r=>r[1]))];}
function pickRegion(){const o=OUT();const home=REGIONS[o.id];
  if(S.dept==='nat')return pick(['수도권','충청권','호남권','영남권','강원·제주권'])+' 담당';
  if(S.dept==='city')return home?home[1]+' 본청':'광역시청';
  if(home)return `${home[1]} ${pick(SUBCITY)} 주재`;
  return `${pick(regionList())} 주재`;}
const NAT_REG=['인천·경기','강원','대전·세종·충남','충북','광주·전남','전북','대구·경북','부산·울산·경남','제주'];
function hasCorrDept(o){o=o||OUT();return o.depts.some(d=>['nat','loc','sigun'].includes(d));}
function corrRegions(){const o=OUT();return REGIONS[o.id]?SUBCITY.slice(0,6).map(c=>`${REGIONS[o.id][1].replace(/광역시|특별자치도|도$/,'')} ${c}`):NAT_REG;}
// 지역 주재기자 명부 — 지역마다 1~3명. 창간 모드는 발행인이 직접 주재지를 연다
function corrs(){const o=OUT();if(S.founder){S.posts=S.posts||{};const L=[];S.corrList=S.corrList||{};Object.keys(S.posts).forEach(r=>{S.corrList[r]=(S.corrList[r]||[]).slice(0,S.posts[r]);while(S.corrList[r].length<S.posts[r]){const m=genMember(o.depts.find(d=>['nat','loc','sigun'].includes(d))||o.depts[0],35,65);m.reg=r;m.role='주재기자';m.rel=R(0,20);S.corrList[r].push(m);}if(S.corrList[r].length>=2&&!S.corrList[r].some(x=>x.r>=1)){const c=S.corrList[r].slice().sort((a,b)=>myrs(b)-myrs(a))[0];c.r=corrSmall(o)?Math.max(1,corrRankFree()):1;c.role=corrTitle(c.r,o);const nd=[0,10,15,19][c.r];if(myrs(c)<nd)c.yrs+=nd-myrs(c);}L.push(...S.corrList[r]);});return L;}
  if(!hasCorrDept(o))return [];if(!S.corr||S.corrOut!==S.outlet||S.corrV!==2){S.corrV=2;const d=o.depts.find(x=>['nat','loc','sigun'].includes(x));S.corr=[];const P0=corrPlan(o);
    P0.regs.forEach(r=>{const n=R(P0.lo,P0.hi);const small=corrSmall(o);const sl=corrSlots(P0,r,n).filter(k=>k===1||chance(.75));for(let i=0;i<n;i++){const m=genMember(d,35,70);m.reg=r;m.r=small?corrRankFree():(sl[i]||0);m.role=corrTitle(m.r,o);m.yrs=yrsFor(m.r);m.rel=R(0,20);S.corr.push(m);}});
    fixDept(S.corr,d);S.corrOut=S.outlet;S.corrV3=1;}S.corr=S.corr.filter(m=>m.reg);
  if(!S.corrV3&&S.corrOut===S.outlet){S.corrV3=1;try{const d=o.depts.find(x=>['nat','loc','sigun'].includes(x));const P0=corrPlan(o);const small=corrSmall(o);let add=0;P0.regs.forEach(r=>{let n=S.corr.filter(m=>m.reg===r).length;while(n<P0.lo){const m=genMember(d,35,70);m.reg=r;m.r=small?corrRankFree():0;m.role=corrTitle(m.r,o);m.yrs=yrsFor(m.r);m.rel=R(0,20);S.corr.push(m);n++;add++;}});if(add){fixDept(S.corr,d);S.ros=null;}}catch(e){console.error(e);}}
  if(S.corrTrim!==S.outlet){S.corrTrim=S.outlet;const cap=Math.ceil(corrCap(o)*1.15);if(S.corr.length>cap){const keep=m=>(m.r||0)>=1||(m.owe||0)>0||(m.rel||0)>=30;const drop=S.corr.filter(m=>!keep(m)).slice(0,S.corr.length-cap);S.corr=S.corr.filter(m=>!drop.includes(m));S.ros=null;}}
  S.corr.forEach(fitSk);return S.corr;}
// 매체마다 다른 지역 취재망: 통신사·지상파는 지역 본부·총국이 크고, 지역 일간지는 시·군 주재가 편집국의 큰 몫, 중앙 일간지는 광역마다 1~3명
// 지역 취재망이 편집국을 다 잡아먹지 않게: 매체 유형별로 주재기자 몫을 전체 기자의 일정 비율 안으로
const CORR_SH={wire:.36,tv:.3,local:.58,daily:.17,econ:.09,jp:.13,ch:.13};
function corrCap(o){return Math.max(0,Math.round((o.staff||20)*(CORR_SH[o.type]||.1)));}
function corrPlan(o){const P=corrPlan0(o);if(!P.regs.length)return P;const cap=corrCap(o);let regs=P.regs;if(cap<regs.length)regs=regs.slice(0,Math.max(1,cap));const per=Math.max(1,Math.round(cap/regs.length));const hi=Math.max(1,Math.min(P.hi,per)),lo=Math.min(P.lo,hi);return Object.assign({},P,{regs,lo,hi,lead:hi>=2?P.lead:Math.min(P.lead,1)});}
function corrPlan0(o){const T=o.type,p=o.p;const W17=['인천','경기남부','경기북부','강원','대전·세종','충남','충북','광주','전남','전북','대구','경북','부산','울산','경남','제주'];const none={regs:[],lo:0,hi:0,lead:0,leadN:'',alt:1};
  if(T==='wire')return p>=4?{regs:W17,lo:3,hi:6,lead:2,leadN:'지역취재본부장'}:p===3?{regs:NAT_REG,lo:1,hi:2,lead:1,leadN:'주재 차장'}:{regs:NAT_REG.slice(0,3),lo:1,hi:1,lead:0,leadN:''};
  if(T==='tv')return p>=4?{regs:['부산','대구','광주','대전','청주','전주','춘천','창원','제주'],lo:6,hi:10,lead:2,leadN:'총국 보도부장'}:p===3?{regs:NAT_REG.slice(0,4),lo:2,hi:3,lead:1,leadN:'주재 차장'}:{regs:NAT_REG.slice(0,2),lo:1,hi:1,lead:0,leadN:''};
  if(T==='jp'||T==='ch')return p>=4?{regs:NAT_REG.slice(0,6),lo:2,hi:3,lead:1,leadN:'주재 차장'}:p===3?{regs:NAT_REG.slice(0,5),lo:1,hi:2,lead:1,leadN:'주재 차장'}:{regs:NAT_REG.slice(0,3),lo:1,hi:1,lead:0,leadN:''};
  if(T==='local'){const h=REGIONS[o.id];return{regs:SUBCITY.slice(0,p>=3?10:6).map(c=>`${h?h[1].replace(/광역시|특별자치도|도$/,''):''} ${c}`.trim()),lo:p>=3?2:1,hi:p>=3?4:2,lead:1,leadN:'주재 차장'};}
  if(T==='daily')return p>=4?{regs:NAT_REG,lo:2,hi:3,lead:1,leadN:'주재 차장'}:p===3?{regs:NAT_REG.slice(0,6),lo:1,hi:2,lead:1,leadN:'주재 차장'}:{regs:NAT_REG.slice(0,2),lo:1,hi:1,lead:0,leadN:''};
  if(T==='econ')return p>=4?{regs:NAT_REG.slice(0,5),lo:1,hi:2,lead:1,leadN:'주재 차장'}:p===3?{regs:NAT_REG.slice(0,3),lo:1,hi:1,lead:0,leadN:''}:none;
  return none;}
// 주재기자가 없는 매체: 지역 통신원·제휴 매체·직접 출장으로 지역 기사를 메운다
function corrAlt(o){o=o||OUT();return corrPlan(o).alt?{online:'지역 통신원(프리랜서)과 제휴 지역지 기사',weekly:'지역 통신원과 직접 출장',trade:'업계 지역 통신원',sports:'구단 연고지 통신원',eng:'통신사 영문 기사와 통신원',daily:'통신사 지역 기사와 통신원',econ:'통신사 지역 기사와 통신원'}[o.type]||'지역 통신원과 통신사 기사':'';}
function altCoord(it,next){const o=OUT();it.coord='alt';
  openModal('주재기자가 없는 지역 기사',`<p class="lede">「${esc(it.title)}」${jp(esc(it.title),'은','는')} 지역 이야기인데, ${esc(o.n)}에는 그 지역 주재기자가 없다.</p><p class="hint">작은 매체·온라인·잡지·전문지는 주재기자 대신 ${ro2(corrAlt(o))} 지역을 메운다.</p>`,[
   {label:'지역 통신원에게 맡긴다',sub:'통장 -20만 · 현지 사실 하나를 확인해 줄 수 있다',fn:()=>{S.money-=20;const f=it.facts.find(x=>!fOK(x)&&x.k!=='n')||it.facts.find(x=>!fOK(x));if(f&&chance(.6)){f.conf++;f.via.push('지역 통신원');toast('통신원이 현장 사진과 증언을 보내왔다');}else toast('통신원이 연락이 잘 안 된다');next();return false;}},
   {label:'통신사·제휴 지역지 기사를 인용한다',sub:'숫자·공식 자료는 확인될 수 있다 · 파급력 조금↓',fn:()=>{const f=it.facts.find(x=>!fOK(x)&&(x.k==='n'||x.k==='d'));if(f&&chance(.5)){f.conf++;f.via.push('통신사 기사');}it.imp=Math.round(it.imp*.93);toast('통신사 기사를 받아 보강했다');next();return false;}},
   {label:'직접 출장 간다',sub:'컨디션 -12 · 통장 -15만 · 확인 확률이 가장 높다',fn:()=>{S.hp=clamp(S.hp-12,0,100);S.money-=15;const f=it.facts.find(x=>!fOK(x));if(f&&chance(.75)){f.conf++;f.via.push('출장 현장 확인');}toast('KTX를 타고 현장에 다녀왔다');next();return false;}},
   {label:'그냥 쓴다',sub:'',fn:()=>{next();return false;}},
   {label:'취소',cls:'ghost'}]);}
function corrOf(reg){return corrs().filter(m=>m.reg===reg);}
// 본사 기자가 다른 지역 이야기를 취재할 때: 주재기자에게 먼저 전화
function coordThen(it,next){if(S.simple){it.coord='ok';return next();}const isReg=REGION_DEPTS.includes(S.dept);if(it.coord||it.d!=='loc'||S.rank>=4||S.founder&&!Object.keys(S.posts||{}).length){return next();}
  const C=corrs();if(!C.length)return corrPlan(OUT()).alt&&!S.founder?altCoord(it,next):next();if(!it.reg)it.reg=pick([...new Set(C.map(m=>m.reg).filter(Boolean))]);if(!it.reg)return next();if(isReg&&S.region&&regMine43(it.reg))return next();
  const m=corrOf(it.reg)[0];if(!m)return next();
  openModal('주재기자에게 전화',`<p class="lede">「${esc(it.title)}」${jp(esc(it.title),'은','는')} <b>${esc(it.reg)}</b> 이야기다. 그 지역은 ${esc(m.name)} ${m.role}(${myrs(m)}년 차 · ${npcAge(m)}세)의 관할이다.</p><p>본사 기자가 남의 지역 기사를 쓸 땐 주재기자에게 먼저 전화해 "써도 되겠냐"고 묻는 게 예의다. 현지 사정과 취재원은 주재기자가 제일 잘 안다.</p>`,[
   {label:'같이 쓰자고 한다 (공동 바이라인)',sub:'주재기자가 현지 사실 하나를 확인해 준다 · 관계↑ · 평판은 나눠 갖는다',fn:()=>{it.coord='co';it.coBy=m.name;const f=it.facts.find(x=>!fOK(x)&&x.k!=='n')||it.facts.find(x=>!fOK(x));if(f){f.conf++;f.via.push('주재기자');}m.rel=clamp((m.rel||0)+10,-50,100);it.imp=Math.round(it.imp*.95);toast(`${m.name}: "좋지. 현장은 내가 붙을게."`);next();return false;}},
   {label:'양해를 구하고 내가 쓴다',sub:'대개 흔쾌히 허락한다. 가끔 서운해한다',fn:()=>{it.coord='ok';if(chance(.75+(m.rel||0)/200)){m.rel=clamp((m.rel||0)+4,-50,100);toast(`${m.name}: "그래, 써. 필요하면 연락해."`);}else{m.rel=clamp((m.rel||0)-8,-50,100);toast(`${m.name}: "...알았어." 목소리가 차갑다`);}next();return false;}},
   {label:'연락 없이 그냥 쓴다',sub:'빠르지만, 주재기자가 데스크에 항의할 수 있다',fn:()=>{it.coord='no';if(chance(.5)){m.rel=clamp((m.rel||0)-15,-50,100);relUp(colBy('boss'),-4,'주재기자 항의');toast(`${jo2(m.name,'이','가')} 데스크에 "왜 내 지역을 말도 없이"라고 항의했다 · `+apply({eval:-1.2}));}next();return false;}},
   {label:'주재기자에게 넘긴다',sub:'아이템을 넘기고 관계를 쌓는다 · 나중에 제보로 돌아올 수 있다',fn:()=>{S.items=S.items.filter(x=>x!==it);m.rel=clamp((m.rel||0)+12,-50,100);m.owe=(m.owe||0)+1;toast(`${m.name}: "고마워, 신세 졌다." · `+apply({eval:.3}));return undefined;}},
   {label:'취소',cls:'ghost'}]);}
function corrMonth(lines){const C=corrs();if(!C.length)return;const debt=C.find(m=>m.owe>0);if(debt&&chance(.35)&&S.rank<=3){debt.owe--;const it=makeItem('loc',{excl:true,pre:1});it.reg=debt.reg;it.coord='co';it.coBy=debt.name;S.items.push(it);lines.push({c:'g',t:`${debt.name} 주재기자(${debt.reg})가 신세를 갚겠다며 제보를 넘겼다 → 「${it.title}」`});}
  if(S.founder&&S.posts){const n=C.length;if(n){const o=OUT();S.co.cash-=n*.015;S.co.bS+=n*.0015;S.co.cash+=o.ad*.008*n;Object.keys(S.posts).forEach(r=>{if(chance(.3)){const it=makeItem('loc',{});it.reg=r;S.items.push(it);}});lines.push({c:'',t:`지역 주재 ${Object.keys(S.posts).length}곳·${n}명 운영 (인건비 ${eok(n*.015)} · 지역 광고·독자↑)`});}}}
function runFbureau(){S.posts=S.posts||{};const R0=corrRegions().length?corrRegions():NAT_REG;const o=OUT();
  openModal('지역 주재 운영',`<p>지역마다 주재기자 1~3명을 둔다. 주재지가 있으면 그 지역 아이템과 지역 광고·독자가 늘고, 본사 기자가 그 지역을 취재할 때 협업할 수 있다. 1명당 매달 150만 원.</p><p class="hint">지금: ${Object.keys(S.posts).length?Object.entries(S.posts).map(([r,n])=>`${r} ${n}명`).join(' · '):'주재지 없음'}</p>`,
   R0.map(r=>{const n=S.posts[r]||0;return{label:`${r} — ${n?`주재 ${n}명`:'미개설'}`,sub:n>=3?'최대 인원':n?'1명 증원 · 0.05억':'주재지 개설 · 0.08억 (사무실·장비)',disabled:n>=3||S.co.cash<.1,fn:()=>{spend(1,3);setCd('fbureau');S.co.cash-=n?.05:.08;S.posts[r]=n+1;S.co.staff++;fgain('lead',.4);fgain('pr',.3);log(`${r} 주재 ${n+1}명`);toast(`${r} 주재기자 ${n?'증원':'파견'}`);}};}).concat(Object.keys(S.posts).length?[{label:'주재지 철수',sub:'비용↓, 그 지역 독자·광고↓',fn:()=>{openModal('어느 주재지를 닫을까',`<p>철수하면 그 지역 주재기자는 본사로 돌아온다.</p>`,Object.keys(S.posts).map(r=>({label:`${r} (${S.posts[r]}명)`,fn:()=>{delete S.posts[r];if(S.corrList)delete S.corrList[r];S.co.bS-=.004;toast(`${r} 주재 철수`);}})));return false;}}]:[]).concat([{label:'닫기',cls:'ghost'}]));};
function regionName(){return REGION_DEPTS.includes(S.dept)&&S.rank<=3?(S.region||''):'';}
function syncDept(){if(!S||S.phase!=='game'||!S.outlet)return;
  if(S.lastDept!==S.dept||S.lastDeptOut!==S.outlet){const changed=S.lastDept!=null&&S.lastDeptOut===S.outlet&&S.lastDept!==S.dept;
    if(REGION_DEPTS.includes(S.dept))S.region=pickRegion();else S.region='';
    if(changed&&S.rank<=3&&!S.founder){const keep=['cap','peer','rivalpeer','photo','editor','union'];const old=(S.cols||[]).filter(c=>!keep.includes(c.role));S.cols=(S.cols||[]).filter(c=>keep.includes(c.role));S.cols.push(mkCol('boss',10),mkCol('senior',10));if(S.rank>=2)S.cols.push(mkCol('junior',15));
      if(S.rank>=2&&S.team.every(t=>t.d!==S.dept))S.team=genTeam();S.mates=null;
      log(`${DEPTS[S.dept].n}${S.region?` (${S.region})`:''} 새 식구들: 부장 ${colBy('boss').name}, 선배 ${colBy('senior').name}${old.length?` · 전 부서 ${old.map(c=>c.name).join('·')}와는 이제 떨어져 일한다`:''}`);
      setTimeout(()=>{const bs=colBy('boss');toast(`새 부서${bs?` — 부장 ${bs.name}`:''}${S.region?` · ${S.region}`:''}`);},400);}
    S.lastDept=S.dept;S.lastDeptOut=S.outlet;S.deptT=S.turn;}}
function myrs(m){if(m.t0==null)m.t0=S.turn;return (m.yrs||1)+Math.floor((S.turn-m.t0)/YW);}
function colYrs(c){if(c.yrs==null){const me=years();c.yrs={cap:R(10,15),boss:R(16,24),peer:me,rivalpeer:me,senior:Math.max(me+3,R(5,9)),photo:R(5,15),editor:R(8,16),union:R(10,20),junior:Math.max(1,me-R(1,3))}[c.role]||R(3,15);c.t0=S.turn;}return c.yrs+Math.floor((S.turn-(c.t0||S.turn))/YW);}
function deptMates(){if(!S.founder&&S.co){try{const per=roster();const L=per[S.dept];if(L&&L.length){L.forEach(m=>{if(m.rel==null)m.rel=R(-5,25);m.role=(m.reg?(m.role||'주재기자'):rTitle(m))+(m.isCap&&S.rank<=1?(m.r>=1?' · 캡':' · 캡(선임 기자)'):'');});L.sort((a,b)=>((b.r||0)+(b.acting?.5:0)+(b.desk?3:0))-((a.r||0)+(a.acting?.5:0)+(a.desk?3:0))||myrs(b)-myrs(a));S.mates=L;S.matesDept=S.dept;S.matesOut=S.outlet;L.forEach(fitSk);const dk=!L.some(m=>m.r>=2||m.acting||m.desk)&&Object.values(per).flat().find(m=>m.desk);if(dk){dk.role=rTitle(dk);if(dk.rel==null)dk.rel=R(-5,25);return [dk].concat(L);}return L;}}catch(e){console.error(e);}}
  if(!S.mates||S.matesDept!==S.dept||S.matesOut!==S.outlet){const n=clamp(teamSize()+1,3,8);const bossC=colBy('boss');const me=years();S.mates=Array.from({length:n},(_,i)=>{const m=genMember(S.dept,30,72);m.r=i===0?2:i===1?1:0;m.role=MR[m.r];m.yrs=m.r?yrsFor(m.r):clamp(me+R(-3,6),1,9);if(i===0&&bossC)m.name=bossC.name;m.rel=R(-5,25);return m;}).sort((a,b)=>(b.r-a.r)||(b.yrs-a.yrs));S.matesDept=S.dept;S.matesOut=S.outlet;}S.mates.forEach(fitSk);return S.mates;}
function genTeam(){try{const pg=S&&S.protege&&(S.team||[]).find(m=>m.name===S.protege);if(pg)S._pgPrev=pg;}catch(e){}const T=Array.from({length:teamSize()},()=>genMember(S.rank>=4?pick(OUT().depts):S.dept));if(S.rank===3&&T.length){const b=T.slice().sort((a,c)=>c.skill-a.skill)[0];b.r=1;b.yrs=yrsFor(1);}if(S.rank>=4){const seen={};T.forEach(m=>{if(!seen[m.d]&&chance(.5)){seen[m.d]=1;m.r=1;m.yrs=yrsFor(1);}});}T.forEach(m=>{if(!m.r)m.yrs=R(1,9);fitSk(m);});return T;}
function rankName(i=S.rank,o){const X=o||(S&&S.outlet?OUT():null);const tv=o?['tv','jp','ch'].includes(o.type):isTV();if(!o&&S&&S.chair&&i===7)return S.founder?'그룹 회장 겸 발행인':'그룹 회장';if(!o&&S&&S.founder&&i===7)return '발행인 겸 대표';if(X&&X.p<=2){if(i===3)return '팀장';if(i===6)return '편집국장';if(i===7)return '대표';if(i===1)return '기자';}if(X&&X.type==='online'&&i===7)return '대표';if(i===1)return tv?'기자':'평기자';if(i===6&&tv)return '보도국장';return RANKS[i].n;}
function deptName(){if(S.rank===4||S.rank===5)return `${isTV()?'보도국 ':''}${S.area||AREAS[cat1(S.dept)]} 담당`;if(S.rank===6)return isTV()?'보도국':'편집국';if(S.rank===7)return '경영진';if(S.rank===0)return DEPTS[S.dept].n+' 수습'+(regionName()?` · ${regionName()}`:'');return DEPTS[S.dept].n+(regionName()?` · ${regionName()}`:'');}
const evalName=()=>S.rank===7?'이사회 신임':'사내 평가';
const YW=48;
const month=(t=S.turn)=>Math.floor(t%YW/4)+1;
function dateStr(t=S.turn){return `${2027+Math.floor(t/YW)}년 ${month(t)}월`;}
function dateShort(t=S.turn){return `${String(27+Math.floor(t/YW))}.${String(month(t)).padStart(2,'0')}`;}
const years=()=>Math.floor(S.turn/YW)+1;
function log(t){S.log.unshift({d:dateShort(),t});if(S.log.length>140)S.log.pop();}
function tick(t,me){S.ticker.unshift({t,me:!!me});if(S.ticker.length>8)S.ticker.pop();}
// 능력치 성장 곡선: 높을수록 오르기 어렵다 (게임 중에만 · 시작 보너스는 그대로)
function growCurve(cur){const x=clamp(cur,0,99)/100;return Math.max(.08,.78*(1-Math.pow(x,1.5)));}
function gain(k,v){if(v>0&&S.phase==='game'){v*=growCurve(S.st[k])*(S.outlet?otr('grow'):1)*(S.simple?1.15:1)*deptGrow(k)*(typeof trGrow==='function'?trGrow(k):1);}S.st[k]=clamp(S.st[k]+v,0,99);}
const FXN={eval:'평가',fame:'평판',trust:'신뢰도'};
// 평가·평판·신뢰는 오르기 어렵게 (깎이는 쪽은 그대로)
const GAINK={eval:[.78,.84],fame:[.86,.9],trust:[.75,.6]};
function apply(o){const out=[];for(const k in o){let v=o[k];if(v>0&&S&&GAINK[k]){v*=(S.founder&&k==='trust')?.9:GAINK[k][S.simple?1:0];if(S.outlet)v*=otr(k);try{if(k==='fame')v*=valMulFame()*dk('fame');if(k==='trust')v*=valMulTrust();if(k==='fame'||k==='trust')v*=trMul(k);if(k==='trust'&&S.fac)v*=facK().trust;}catch(e){}if(k==='eval')v*=clamp(1-((S.eval||0)-45)/90,.35,1)*(typeof deptBreadthK==='function'&&!S.founder?deptBreadthK():1);if(k==='trust')v*=clamp((100-(S.trust??50))/45,.15,1);}if(v<0&&S&&(k==='fame'||k==='trust'))v*=(DF().pen||1);if(k==='eval'&&v<0)v*=DF().harsh*(1-(S.st.men||0)/400);v=Math.round(v*10)/10;if(!v)continue;const s=(v>0?'+':'')+v;
  if(k in STN){gain(k,v);out.push(`${STN[k]} ${s}`);}
  else if(k==='money'){S.money=Math.round(S.money+v);out.push(`통장 ${s}만 원`);}
  else if(k==='hp'){S.hp=clamp(S.hp+v,0,100);out.push(`컨디션 ${s}`);}
  else{S[k]=clamp(S[k]+v,0,100);out.push(`${k==='eval'?evalName():FXN[k]} ${s}`);}}
  return out.join(' · ');}
// 7.0: 관리 업무 추가 비용을 없앴다 (창간·일반 모두 행동력 1)
const FSUR={};
// 일반·간소화: 손이 많이 가는 일은 행동력 1 더
const GSUR={};
function surOf(id){if(S&&S.simple)return 0;return (S&&S.founder?FSUR:GSUR)[id]||0;}
// 초반 숨통: 평기자~부장(창간 대표는 첫 2년)은 매달 첫 취재 1번을 행동력 없이 한다 (출입처 정기 취재)
function freeInv(){if(!S||S.phase!=='game'||S.story)return 0;const ok=S.founder?S.turn-(S.fStart||0)<YW*2:S.rank>=1&&S.rank<=3;if(!ok)return 0;return S.freeInvM===Math.floor(S.turn/4)?0:1;}
function actCost(id){const a=ACT[id]?ACT[id].ap:0;if(id==='invest'&&freeInv())return 0;return a?a+surOf(id):0;}
// 들고 있는 아이템이 많을수록 새 아이템이 덜 나온다
function glut(){const n=(S.items||[]).length;const few=n===0?1.1:n===1?1.03:1;return clamp(.88*few*(1-.12*Math.max(0,n-2))*(S.outlet?otr('item'):1)*(S.rank===0?.85:1),.35,1.3);}
function spend(a,h){if(S._curAct&&!S._mc){S._mc=true;try{misCount(S._curAct);}catch(e){}}if(S._curAct&&!S._sur&&a>0){a+=surOf(S._curAct);S._sur=true;try{rankHook(S._curAct);}catch(e){}try{statHook(S._curAct);}catch(e){}}S.ap=Math.max(0,S.ap-a);if(h>0)h*=(1-clamp((S.st.men||40)-40,0,55)/180)*(S.outlet?otr('hp'):1);S.hp=clamp(S.hp-h,0,100);}
function ach(k){if(S.ach[k])return;S.ach[k]=dateShort();log('업적 — '+ACH[k][0]);setTimeout(()=>toast('업적 달성: '+ACH[k][0]),400);}
const RANKM=[.85,.92,1.08,1.24,1.36,1.46,1.6,2.1];
// ===== 6.0 성과 보상: 기본급은 깎지 않는다. 잘하면 수당·성과급·호봉 가산, 못하면 그걸 못 받는다 =====
// 월 수당 상한: 월급의 15% 또는 60만 원 중 작은 쪽 · 연말 성과급 최대 월급 1.2배 · 우수 고과 호봉 가산 최대 +8%
function perfOn(){return !!(S&&!S.founder&&!S.story&&S.rank<7&&S.phase==='game');}
function monthAllow(pay){if(!perfOn())return null;const t=S.turn,M=mine().filter(c=>c.turn>t-4);const L=[];let sum=0;const add=(n,v)=>{if(v>0){L.push([n,v]);sum+=v;}};
  const errM=(S.errT||[]).filter(x=>x>t-4).length;
  if(errM){S.perfLog=(S.perfLog||[]);return {sum:0,L:[],lost:`이번 달 오보·정정 ${errM}건 — 수당이 나오지 않았다`};}
  const ex=M.filter(c=>c.excl).length,fr=M.filter(c=>/1면|첫 꼭지/.test(c.place||'')).length,tp=M.filter(c=>/톱/.test(c.place||'')&&!/1면/.test(c.place||'')).length;
  add('단독 수당',Math.min(3,ex)*5+M.filter(c=>c.excl&&(c.imp||0)>=60).slice(0,2).length*5);
  add('지면 수당',Math.min(2,fr)*10+Math.min(3,tp)*5);
  if(S.mis&&S.mis.all)add('미션 달성 수당',10);
  if(S.rank===3&&bjDeskOn()&&S.deskM&&S.deskM.n>=3)add('데스크 수당',10);
  if(S.rank===3&&S.deptT===t-4)add('부서 1위 격려금',20);
  const cap=Math.min(60,Math.round(pay*.15/5)*5);if(sum>cap){L.push(['상한 조정',cap-sum]);sum=cap;}
  return {sum,L,lost:''};}
// 연말 인사고과: S~D. 성과급은 회사가 적자면 절반. D는 경고만(감봉 없음)
function yearAppraise(pay){if(!perfOn())return null;const t=S.turn,Y=mine().filter(c=>c.turn>t-48);const ex=Y.filter(c=>c.excl).length,fr=Y.filter(c=>/1면|첫 꼭지|톱/.test(c.place||'')).length;
  const err=(S.errT||[]).filter(x=>x>t-48).length;const misAll=(S.misAllY||[]).filter(x=>x>t-48).length;const desk=S.rank>=2?Math.min(6,(S.deskY||0)):0;
  const sc=Math.round(S.eval+Math.min(5,ex)*2+Math.min(6,fr)+Math.min(6,misAll)*.8+desk*.6+((S.deptTopY||0)>=2?3:0)-err*4-(S.disc&&S.disc>t-48?6:0));
  const g=sc>=88?'S':sc>=76?'A':sc>=62?'B':sc>=50?'C':'D';const mul={S:1.2,A:.8,B:.4,C:0,D:0}[g];const loss=S.co&&S.co.last&&S.co.last.profit<0;
  const bonus=Math.round(pay*mul*(loss?.5:1)/10)*10;const step={S:.02,A:.01}[g]||0;const before=S.perfK||1;S.perfK=Math.min(1.08,+(before+step).toFixed(3));
  S.deskY=0;S.deptTopY=0;(S.apprHist=S.apprHist||[]).push({y:Math.floor(t/YW),g,sc});if(S.apprHist.length>30)S.apprHist.shift();
  return {g,sc,bonus,loss,step:S.perfK>before?S.perfK-before:0,ex,fr,err};}
const APPR_LINE={S:'올해의 기자급. 사장이 직접 악수를 청했다.',A:'우수 고과. 윗선에서 "내년도 기대한다"는 말이 내려왔다.',B:'무난한 한 해. 평균은 했다.',C:'아쉬운 한 해. 성과급은 없다.',D:'최하위 고과. 윗선에서 경고가 내려왔다. 내년에도 이러면 승진 심사에서 불리하다.'};
function payOf(o,rank=S.rank){return Math.max(195,Math.round((S.payK||1)*(S.perfK||1)*o.pay*otr('pay',o)*RANKM[rank]*(1+.025*Math.floor(S.turn/YW))*DF().pay/5)*5);}
// 한 달 생활비(만 원): 월세·식비·교통·통신 등. 직급이 오르면 조금씩 늘고 물가는 해마다 2%씩 오른다
function living(){let pk=1;try{if(S.outlet&&!S.founder)pk=clamp(.9+.1*payOf(OUT())/300,.9,1.1);}catch(e){}return Math.round((S.rank===0?110:118+S.rank*8)*pk*Math.pow(1.02,Math.floor(S.turn/YW)));}
const CROLE={
 cofound:{n:'공동창업자 · 편집장',perk:'친하면 기사 품질↑ · 나쁘면 결별 위기',d:'같이 회사를 나와 창간한 오랜 동료'},
 fstaff:{n:'창간 멤버 기자',perk:'친하면 박봉에도 버틴다 · 나쁘면 이탈',d:'창간 때부터 함께한 1기 기자'},
 biz:{n:'사업 이사',perk:'친하면 광고·후원 영업 유리',d:'광고와 돈을 맡은 사람'},
 mentor:{n:'옛 직장 선배',perk:'취재원·경력 기자 소개',d:'친정 언론사에 남은 선배'},
 invdir:{n:'투자사 이사',perk:'친하면 추가 투자 · 나쁘면 간섭',d:'투자사가 보낸 이사'},
 cap:{n:'캡',perk:'친하면 수습 보고 평가 가산',d:'수습 시절 나를 굴린 사건팀장'},
 boss:{n:'부장',perk:'발제 통과·부서 배치·월 평가에 영향',d:'내 기사의 운명을 쥔 사람'},
 peer:{n:'입사 동기',perk:'친하면 가끔 정보를 나눠 준다',d:'같은 날 입사한 동기'},
 rivalpeer:{n:'경쟁 동기',perk:'사이가 나쁘면 뒷말·견제',d:'늘 나와 비교당하는 동기'},
 senior:{n:'기자',perk:'조언을 구하면 능력치 성장',d:'잔소리가 많지만 실력은 진짜'},
 photo:{n:'사진기자',perk:'친하면 기사 완성도 +3',d:'현장을 함께 뛰는 동료'},
 editor:{n:'편집기자',perk:'친하면 제목·지면 배치 유리',d:'내 기사에 제목을 다는 사람'},
 union:{n:'노조 위원장',perk:'친하면 신뢰도 위기 때 방패',d:'편집권 독립의 최전선'},
 junior:{n:'기자',perk:'친하면 부서 성과 +2',d:'나를 보고 배우는 후배'}
};
function colRole(c){if(c.role==='boss'&&S.rank<=2&&c.ttl)return `${DEPTS[S.dept].n} ${c.ttl}`;if(c.role==='boss')return S.rank<=2?`${DEPTS[S.dept].n} 부장`:S.rank===3?(isTV()?'보도국 부국장':'편집부국장'):S.rank<=5?(isTV()?'보도국장':'편집국장'):S.rank===6?'사장':'대주주';if(c.role==='photo')return isTV()?'영상기자':'사진기자';if(c.role==='cap'&&S.rank>=2)return '옛 캡 (수습 시절 선배)';return CROLE[c.role].n;}
function relLabel(r){return r>=70?'든든한 내 편':r>=40?'가까운 사이':r>=15?'무난한 사이':r>=-10?'서먹한 사이':'껄끄러운 사이';}
function mkCol(role,rel,name){const my=(S&&S.turn?S.turn/YW:0);const cy={cap:10,boss:18,peer:my,rivalpeer:my,senior:my+7,photo:8,editor:11,union:15,junior:Math.max(1,my-5),cofound:my,fstaff:4,biz:12,mentor:my+6,invdir:14}[role];const base=Math.round(skillYrs(cy==null?8:cy)+R(-3,6));const st={};['inv','ver','int','wri','hed','net','cha','dat'].forEach(k=>st[k]=clamp(base+R(-10,10),10,90));return{id:uid(),name:name||rname(),role,rel:rel??R(5,25),pers:pick(Object.keys(PERS)),hist:[],st,seed:R(0,9999)};}
function estRange(v,rel,seed,k){const w=Math.max(3,Math.round(26-Math.max(-50,rel)/4));const off=((seed*31+k.length*17)%(w+1))-w/2;const mid=clamp(Math.round(v+off*.6),5,99);return `${clamp(mid-Math.round(w/2),1,99)}~${clamp(mid+Math.round(w/2),1,99)}`;}
function colStats(c){if(!c.st){const t=mkCol(c.role,c.rel);c.st=t.st;c.seed=t.seed;}return Object.keys(c.st).map(k=>`${STN[k]} ${estRange(c.st[k],c.rel,c.seed,k)}`).join(' · ');}
function initColleagues(keepCap){const v=x=>x+R(-4,4);S.cols=[mkCol('cap',v(22),keepCap?S.capName:null),mkCol('boss',v(15)),mkCol('peer',v(30)),mkCol('rivalpeer',v(5)),mkCol('senior',v(15)),mkCol('photo',v(15)),mkCol('editor',v(12)),mkCol('union',v(10))];if(S.rank>=2)S.cols.push(mkCol('junior',v(25)));}
function colBy(role){return (S.cols||[]).find(c=>c.role===role);}
function relUp(c,v,why){if(!c)return;if(v>0&&S&&S.st)v=v*(0.85+S.st.cha/260)*(S.outlet?otr('rel'):1)*(typeof trMul==='function'?trMul('rel'):1);c.rel=clamp(c.rel+v,-50,100);if(why){c.hist.unshift(`${dateShort()} ${why} (${v>0?'+':''}${Math.round(v)})`);if(c.hist.length>4)c.hist.pop();}}
function initCoX(){}
function initCo(o){return{subs:o.subs,tr:o.tr,staff:o.staff,cash:{5:300,4:150,3:60,2:20}[o.p],q:55,bS:0,bT:0,adB:0,extra:0,hist:[],last:null};}
const MR=['기자','차장','부장','부국장'];
// 부서별 인원 비중: 큰 신문은 사회·정치·경제부가 가장 크고 국제·문화·연예는 작다
const DEPT_W={pol:1.6,soc:1.7,eco:1.6,case:1.3,court:1.1,ind:1.2,fin:1,stock:.9,estate:.8,it:.9,diplo:.8,int:.7,cul:.7,ent:.6,spo:1,base:.6,foot:.6,culspo:.8,inv:.7,med:.6,edu:.6,nat:1.3,city:1.1,loc:1,sigun:.8};
const isRegD=d=>['nat','loc','sigun'].includes(d);
// 직급 정리: 일반 부서는 부장 1명·차장 1명. 지역 부서(전국부·주재)만 예외. 연차는 직급 순서를 넘지 않는다
function fixDept(list,d){if(!list.length)return list;
  if(!isRegD(d)){// 일반 부서: 차장 위 직급(부장·부국장·국장)은 딱 한 명, 반드시 있어야 한다. 차장은 0~1명.
    // 원칙: 부서장(차장 위 직급)은 한 명. 다만 작은 부서는 차장이 '부장 직무대리'로 이끌 수 있고, 큰 부서는 차장이 둘 이상일 수 있다
    list.forEach(m=>{if(m.r>=2)m.acting=0;});
    const heads=list.filter(m=>(m.r||0)>=2).sort((a,b)=>(b.r-a.r)||(myrs(b)-myrs(a)));heads.slice(1).forEach(m=>m.r=1);
    let mids=list.filter(m=>m.r===1).sort((a,b)=>myrs(b)-myrs(a));
    if(!heads.length&&list.length>=2){const h=mids[0]||list.slice().sort((a,b)=>myrs(b)-myrs(a))[0];
      if(list.length<=7&&(mids.length||chance(.5))){h.r=1;h.acting=1;}else{h.r=2;h.acting=0;}mids=mids.filter(m=>m!==h);}
    const head=list.find(m=>m.r>=2)||list.find(m=>m.acting);const maxMid=list.length<=3?0:1+Math.floor(list.length/12);
    mids.filter(m=>m!==head).slice(maxMid).forEach(m=>m.r=0);
    list.forEach(m=>{if(m!==head)m.acting=0;});
    const top=list.find(m=>m.r>=2)||list.find(m=>m.acting),mid=list.find(m=>m.r===1&&!m.acting);
    if(top){const need=top.r>=3?19:top.acting?12:15;if(myrs(top)<need)top.yrs+=need-myrs(top);}
    if(mid){const cap=top?myrs(top)-2:22;if(myrs(mid)>cap)mid.yrs-=myrs(mid)-cap;if(myrs(mid)<10)mid.yrs+=10-myrs(mid);}
    const cap0=mid?myrs(mid)-1:top?myrs(top)-3:12;list.filter(m=>!m.r).forEach(m=>{if(myrs(m)>cap0)m.yrs-=myrs(m)-cap0;if(m.yrs<1)m.yrs=1;});
    if(top){const mx=Math.max(0,...list.filter(m=>m!==top).map(myrs));if(myrs(top)<=mx)top.yrs+=mx-myrs(top)+1;}return list;}
  // 지역 부서(전국부·주재): 지역마다 차장 이상이 여럿일 수 있다. 다만 연차는 직급을 따른다
  const regs={};list.forEach(m=>(regs[m.reg||'본사']=regs[m.reg||'본사']||[]).push(m));
  Object.values(regs).forEach(L=>{L.forEach(m=>{const lo=[1,10,15,19][Math.min(3,m.r||0)];if(myrs(m)<lo)m.yrs+=lo-myrs(m);});const minLead=Math.min(...L.filter(m=>m.r).map(myrs).concat([99]));L.filter(m=>!m.r).forEach(m=>{if(myrs(m)>=minLead)m.yrs-=myrs(m)-minLead+1;if(m.yrs<1)m.yrs=1;});});
  return list;}
function fixTeam(){const by={};S.team.forEach(m=>(by[m.d]=by[m.d]||[]).push(m));const cap=(!S.founder&&S.rank>=2&&S.rank<=3)?S.rank-2:null;Object.keys(by).forEach(d=>{if(cap!=null)fixSub(by[d],cap);else fixDept(by[d],d);});}
// NPC 기자 실력은 연차에 맞춘다 (가끔 에이스·부진한 사람이 섞인다)
function skillYrs(y){y=Math.max(0,y||0);return 30+30*(1-Math.exp(-y/8))+y*.45;}
function fitSk(m){if(!m||m.yrs==null)return m;if(m._fy===m.yrs)return m;if(m._dv==null){const r=Math.random();m._dv=r<.07?R(10,17):r<.13?-R(6,10):R(-5,5);}
  // 1.21 회식·데스킹·코칭으로 직접 오른 실력은 연차가 바뀌어 다시 계산할 때도 남는다
  if(m.skill!=null){const ref=m._sk0!=null?m._sk0:(m._fy!=null?clamp(Math.round(skillYrs(m._fy)+m._dv),14,92):null);if(ref!=null){const dr=m.skill-ref;if(Math.abs(dr)>=.01)m._dv+=dr;}}
  const sk=clamp(Math.round(skillYrs(m.yrs)+m._dv),14,92);const old=m.skill||sk;m.skill=sk;m._sk0=sk;const st=m.st||{};['inv','wri','ver','net'].forEach(k=>{const off=st[k]!=null&&m._fy!=null?st[k]-old:R(-8,8);st[k]=clamp(Math.round(sk+clamp(off,-10,10)),10,92);});m.st=st;m._fy=m.yrs;return m;}
function fitAll(){if(!S||S.phase!=='game')return;[S.team,S.mates,Array.isArray(S.corr)?S.corr:null].forEach(a=>(a||[]).forEach(fitSk));if(S.ros&&S.ros.per)Object.values(S.ros.per).forEach(a=>(a||[]).forEach(fitSk));if(S.corrList)Object.values(S.corrList).forEach(a=>Array.isArray(a)&&a.forEach(fitSk));}
function yrsFor(r){return [R(1,9),R(10,15),R(15,21),R(19,26)][Math.min(3,r||0)];}
function genMember(d,lo=30,hi=65){const sk=R(lo,hi);const r=0;return{id:uid(),name:rname(),skill:sk,d,r,yrs:yrsFor(r),st:{inv:sk+R(-15,15),wri:sk+R(-15,15),ver:sk+R(-15,15),net:sk+R(-15,15)}};}
const fOK=f=>f.conf>=f.need;
const fw=f=>f.key?3:(f.k==='d'||f.k==='n'?2:1);