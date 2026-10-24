/* 바이라인 1.6 — src/compat/_hoisted.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */

/* [옮겨 옴] src/systems/era-front.js 의 function eraGen — 원본에선 스크립트 뒤쪽에 선언됐지만 앞선 코드가 끌어올림으로 이 함수를 먼저 감쌌다/썼다 */
function eraGen(){const t0=S.turn,HM=12*40,E=[];const at=(k,sm,len,why)=>{if(sm<HM&&len>0)E.push({k,s:t0+sm*4,e:t0+(sm+len)*4,why:why||''});};
  // 보건: 감염병은 경기 흐름을 바꾸는 충격이다
  let pan=null;if(chance(.65)){const sm=R(36,330),len=R(18,28);pan={s:sm,e:sm+len};at('pandemic',sm,len,'해외에서 시작된 감염병이 번졌다.');at('contactless',sm+3,len+3,'유행이 길어지자 생활이 화면 앞으로 옮겨 갔다.');at('reopen',sm+len+3,R(10,14),'유행이 잦아들었다.');}
  // 경기 순환: 호황 → 거품 → 위기 → 불황 → 회복. 감염병이 오면 불황으로 꺾인다
  let m=R(10,40),st='normal';const len={boom:[18,36],bubble:[12,24],crash:[6,12],recession:[18,30],recovery:[12,24]};const why={boom:'수출과 소비가 함께 살아났다.',bubble:'호황이 길어지자 돈이 집과 주식으로 몰렸다.',crash:'부풀었던 거품이 한꺼번에 꺼졌다.',recession:'위기가 실물 경제로 번졌다.',recovery:'바닥을 지났다는 신호가 나온다.'};
  let g=0;while(m<HM&&g++<40){let nx;if(st==='normal')nx=chance(.6)?'boom':chance(.5)?'recession':'trade';else if(st==='boom')nx=chance(.5)?'bubble':'normal';else if(st==='bubble')nx=chance(.85)?'crash':'normal';else if(st==='crash')nx='recession';else if(st==='recession')nx='recovery';else if(st==='recovery')nx=chance(.5)?'boom':'normal';else nx='normal';
    if(pan&&m<=pan.s&&pan.s<m+30&&['normal','boom','recovery'].includes(st)){m=pan.s+2;at('recession',m,R(14,22),'감염병 충격이 경제를 얼렸다.');m+=R(14,22);at('recovery',m,R(12,18),'유행이 잦아들며 경기가 숨을 돌린다.');m+=R(12,18);st='recovery';pan=null;continue;}
    if(nx==='normal'){m+=R(18,40);st='normal';continue;}
    if(nx==='trade'){const l=R(10,18);at('trade',m,l,'강대국 사이 관세 전쟁이 시작됐다.');m+=l;st='normal';continue;}
    const l=R(len[nx][0],len[nx][1]);at(nx,m,l,why[nx]);if(nx==='boom'&&chance(.5))at('tech',m+R(0,6),R(12,24),'새 기술 기업들이 쏟아진다.');if(nx==='bubble'&&chance(.7))at('estate',m,l,'유동성이 부동산으로 몰렸다.');m+=l;st=nx;}
  // 정치 달력: 대선 5년, 총선·지방선거 4년(2년 엇갈림). 대선 뒤 새 정부, 임기 중반 게이트, 그 뒤 광장
  let p=R(0,59);while(p<HM){at('elect_pres',p-4,4,'');at('honeymoon',p,6,'새 대통령이 취임했다.');if(chance(.45)){const gs=p+R(24,36),gl=R(6,10);at('gate',gs,gl,'정권 핵심 인사를 둘러싼 의혹이 터졌다.');if(chance(.4))at('protest',gs+gl-2,R(4,6),'의혹이 풀리지 않자 시민들이 광장으로 나섰다.');}p+=60;}
  let q=R(0,47);while(q<HM){at('elect_gen',q-3,3,'');at('elect_local',q+24-3,3,'');q+=48;}
  // 미디어: 포털 개편 → 영상 시대 → AI 뉴스 시대
  const pr=R(36,90);at('portal',pr,R(12,20),'포털이 뉴스 서비스를 개편했다.');const vs=pr+R(30,60);at('video',vs,R(48,72),'독자들이 영상으로 옮겨 갔다.');at('ainews',vs+R(40,70),HM,'AI가 뉴스를 요약해 주는 시대가 열렸다.');
  // 재난: 참사 뒤 안전 점검, 가끔 기후 재난의 여름
  for(let i=0;i<R(1,3);i++){const ds=R(12,HM-12);at('disaster',ds,R(2,4),'대형 참사가 일어났다.');at('safety',ds+3,R(10,14),'참사의 책임을 묻는 목소리가 커졌다.');}
  for(let i=0;i<R(1,2);i++)at('climate',R(30,HM-12),R(2,3),'기록적인 폭우와 폭염이 이어졌다.');
  // 스포츠: 2년마다 올림픽·월드컵이 번갈아
  let sp=R(4,20),ol=chance(.5);while(sp<HM){at(ol?'olympic':'worldcup',sp,ol?1:2,ol?'올림픽이 열렸다.':'월드컵이 열렸다.');sp+=24;ol=!ol;}
  return E.filter(x=>x.e>t0).map(x=>({...x,s:Math.max(t0,x.s)})).sort((a,b)=>a.s-b.s);}
/* [옮겨 옴] src/systems/era-front.js 의 function eraBox — 원본에선 스크립트 뒤쪽에 선언됐지만 앞선 코드가 끌어올림으로 이 함수를 먼저 감쌌다/썼다 */
function eraBox(){const L=eraNow();if(!L.length)return '';return `<div class="card"><div class="t">${ic('flag')} 지금의 시대</div>${L.map(x=>{const D=ERA_DEF[x.k];const m=Math.max(1,Math.round((x.e-S.turn)/4));const fx=eraFx(D);
  return `<p class="hint" style="margin:6px 0 0"><b style="color:var(--fg)">${D.n}</b> <small>${D.g} · 약 ${m>200?'오래':m+'달'} 더</small><br>${esc(D.d)}${fx?`<br><span style="color:var(--sodium)">${esc(fx)}</span>`:''}${D.tip?`<br>이럴 땐: ${esc(D.tip)}`:''}${D.next?`<br><i>${esc(D.next)}</i>`:''}</p>`;}).join('')}</div>`;}
/* [옮겨 옴] src/main.js 의 function migrate — 원본에선 스크립트 뒤쪽에 선언됐지만 앞선 코드가 끌어올림으로 이 함수를 먼저 감쌌다/썼다 */
function migrate(s){if(!s)return s;try{(s.npcOut||[]).forEach(o=>{if(!OUTLETS.some(x=>x.id===o.id))OUTLETS.push(o);});(s.closedOut||[]).forEach(id=>{const o=OUTLETS.find(x=>x.id===id);if(o)o.closed=1;});}catch(e){}if((s.ver4||0)<2){s.mates=null;s.ros=null;s.corr=null;s.ver4=2;}if(s.custom){const i=OUTLETS.findIndex(x=>x.id==='mine');if(i>=0)OUTLETS.splice(i,1);OUTLETS.push(s.custom);}try{oReset();oModApply(s);}catch(e){}if(s.phase==='game'&&!s.cols){const k=S;S=s;initColleagues(true);S=k;}if(s.phase==='game'&&!s.portal){const k=S;S=s;initPortal(OUT());initComp();S=k;}if(s.phase==='game'&&(!s.net||!s.ents)){const k=S;S=s;initNet(s.net||null);S=k;}if(s.ents){const bw={};[...Object.values(ENT_BASE).flat(),...Object.values(TYPE_ENT).flat(),...Object.values(ID_ENT).flat()].forEach(e=>{if(e[3]>0&&!(e[0] in bw))bw[e[0]]=e[3];});s.ents.forEach(e=>{if(!e[4]&&bw[e[0]])e[4]=bw[e[0]];});normEnts(s.ents,OUTLETS.find(x=>x.id===s.outlet));setEnts(s.ents);}for(const k in ST0)if(s.st&&s.st[k]==null)s.st[k]=ST0[k];(s.items||[]).forEach(i=>{if(!i.ent)i.ent=findEnt(i.title,i.subj||'',i.d);});s.cd=s.cd||{};s.ach=s.ach||{};s.ticker=s.ticker||[];s.flags=s.flags||{};s.items=(s.items||[]).filter(i=>i.facts&&i.facts[0]&&'conf' in i.facts[0]);return s;}
