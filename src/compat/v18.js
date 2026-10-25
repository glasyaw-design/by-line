/* 바이라인 — src/compat/v18.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.32 그림 연결: 엔딩 12 · 장면 배너 32 · 시대 25 · 위기 15 · 이벤트 8 · 얼굴 · 아이콘 =====
function im18(k,cls){return IMG[k]?`<img class="${cls||''}" src="${IMG[k]}" alt="" draggable="false">`:'';}
// ---- 엔딩: 37종 → 대표 그림 12장 ----
const END_ARCH=[[1,['정년퇴직','임기 만료 퇴임','명예퇴직','논설위원으로 펜을 놓다']],[2,['임기 만료 · 사장실의 주인','대표 은퇴 · 승계','창간 10주년 · 아름다운 퇴장']],[3,['희망퇴직','권고사직','퇴사','자진 퇴사','이사회 해임']],[4,['창간 성공 · 메이저 언론','창간 완전 클리어']],[5,['창간 엔딩 · 매각','매각 후 은퇴']],[6,['창간 실패 · 파산']],[7,['정권의 입 · 대변인','기자 출신 국회의원']],[8,['어용 기자의 몰락','게이트 연루','기사 거래 적발','언론계 퇴출']],[9,['클릭 공장장','가짜뉴스 유포자','홍보대행사 대표']],[10,['데이터 저널리즘의 개척자','탐사보도의 전설','팩트체크의 대명사']],[11,['간판 앵커','권력 감시의 상징','광장의 스타 유튜버','약자의 펜']],[12,['시대의 논객','르포 문학의 거장','주필 · 신문의 목소리','펜이 꺾이다']]];
const END_AMAP={};END_ARCH.forEach(([n,L])=>L.forEach(x=>END_AMAP[x]='ea_'+n));
function endArchKey(k){k=String(k||'');let a=END_AMAP[k];if(!a){const f=Object.keys(END_AMAP).sort((x,y)=>y.length-x.length).find(x=>k.includes(x));a=f?END_AMAP[f]:/해고|해임|중단|사직|퇴사/.test(k)?'ea_3':/파산|폐간/.test(k)?'ea_6':/창간/.test(k)?'ea_4':/은퇴|퇴직|퇴임/.test(k)?'ea_1':null;}return a&&IMG[a]?a:null;}
{const _e=endImgKey;endImgKey=function(k){return endArchKey(k)||_e(k);};}
// ---- 장면 배너: 부서·매체·계절·시대에 따라 ----
function season18(){const m=month();return m>=3&&m<=5?'spring':m>=6&&m<=8?'summer':m>=9&&m<=11?'autumn':'winter';}
function eraHas18(...ks){try{return eraNow().some(x=>ks.includes(x.k));}catch(e){return false;}}
{const _sk=sceneImgKey;sceneImgKey=function(){const k=_sk();try{if(!S||S.phase!=='game'||!k||k==='title'||k==='roof'||k==='chair'||k==='pub')return k;
  const sc=S.scene,d=S.dept,t=S.turn||0,alt=(Math.floor(t/4)&1),wk=t%4,ty=(OUT()||{}).type;const has=x=>!!IMG['sc_'+x];
  if(S.op)return has('opinion')?'opinion':k;
  if(sc==='field'||sc==='briefing'){
    if(eraHas18('disaster')&&['soc','case','nat','loc','sigun','city'].includes(d)&&alt)return 'disaster';
    if(season18()==='summer'&&month()>=7&&['soc','case','nat','loc','sigun'].includes(d)&&wk===3)return 'typhoon';
    const M={diplo:'diplo',int:alt?'int':'airport',eco:alt?'eco':'lobby',fin:'eco',stock:'eco',ind:'ind',estate:'estate',it:'it',med:'med',edu:'edu',cul:'cul',ent:'ent',culspo:alt?'cul':'spo',spo:'spo',base:'spo',foot:'foot',case:alt?'case':'crime',inv:'inv',sigun:'loc',loc:alt?'loc':'region',nat:alt?'region':'loc',pol:sc==='briefing'?(alt?'pol':'assembly'):'pol',city:'gov'};
    const v=M[d];if(v&&has(v))return v;return k;}
  if(sc==='newsroom'&&k==='newsroom'){
    if(eraHas18('elect_pres','elect_gen','elect_local')&&wk===3&&has('election'))return 'election';
    if(wk===0&&has(season18()))return season18();
    const tv=ty==='tv'||ty==='jp'||ty==='ch';if(tv&&alt)return 'studio';if(ty==='wire'&&alt)return 'wire';if(ty==='online')return alt?'web':'newsroom';if(ty==='weekly'&&alt)return 'magazine';
    if(t%12===11&&has('dawn'))return 'dawn';return k;}
  if(sc==='office'&&k==='exec'&&S.rank>=6&&alt&&has('board'))return 'board';
  return k;}catch(e){return k;}};}
// ---- 팝업 머리 그림: 위기 아크 · 시대 전환 · 논설·판매·이사회·선거·중재 ----
const MODAL_SC=[[/논설|사설|주필/,'sc_opinion'],[/판매국|부수|지국|ABC|구독 영업|판매 전략/,'sc_circ'],[/이사회|주주총회|대주주|경영권/,'sc_board'],[/편집국장 선거|사장 선거|임명동의|신임 투표|개표 결과|출마/,'sc_vote'],[/언론중재|삭제 요청|정정보도 청구|반론보도/,'sc_mediation'],[/특파원|해외 연수/,'sc_int'],[/기자실|브리핑/,null]];
function modalImg18(t,b){if(!S||S.imgOff)return '';const B=String(b||'');
  if(B.includes('class="arch"')&&S.arc2){const k='ac_'+S.arc2.id;return IMG[k]?k:'ac_tense';}
  if(typeof ERA_DEF!=='undefined'){const m=/시대가 바뀐다 · ([^—<]+?) —/.exec(B);if(m){const e=Object.keys(ERA_DEF).find(x=>ERA_DEF[x].n===m[1].trim());if(e&&IMG['er_'+e])return 'er_'+e;}}
  if(typeof ILL_NO!=='undefined'&&ILL_NO.test(t||''))return '';
  if(/돌기|동선|출입처 순회|라인 돌|한 바퀴/.test(t||'')){try{const sk=(()=>{const sc0=S.scene;S.scene='field';const k=sceneImgKey();S.scene=sc0;return k;})();if(sk&&IMG['sc_'+sk])return 'sc_'+sk;}catch(e){}}
  const h=MODAL_SC.find(([re])=>re.test(t||''));return h&&h[1]&&IMG[h[1]]?h[1]:'';}
{const _o=openModal;openModal=function(t,b,c){let k='';try{k=S?modalImg18(t,b):'';}catch(e){k='';}
  if(k){let lab='';try{lab=k.startsWith('ac_')?((A2.find(x=>x.id===(S.arc2||{}).id)||{}).big?'대위기':'위기'):k.startsWith('er_')?'시대의 흐름':'';}catch(e){}b=`<div class="evimg ev18"><img src="${IMG[k]}" alt="" draggable="false">${lab?`<div class="mkick" style="--k:#ff6f61">${lab}</div>`:''}</div>`+(b||'');window.__ill18=1;}
  try{return _o.call(this,t,b,c);}finally{window.__ill18=0;try{setTimeout(deco18,0);}catch(e){}}};}
{const _ih=illHTML;illHTML=function(k){return window.__ill18?'':_ih(k);};}
// ---- 이벤트 그림 8장 추가 ----
try{Object.assign(KICK,{scold:['질책','#ff8a7a'],dinner:['회식','#ffb84d'],cal:KICK.cal||['일정','#9fb3d9'],studio:['방송','#8ab4ff'],manus:['원고','#e8dcc0'],resign:['사표','#c6c6ff'],promo:['인사','#ffcf5a'],trip:['출장','#6fd6ff']});
  ILL_MAP.unshift([/사표|사직서|사의를/,'resign'],[/승진|진급|발령장/,'promo']);
  ILL_MAP.push([/질책|호통|불호령|경고장|깨졌다/,'scold'],[/회식|술자리|송년회|환영회|저녁 자리/,'dinner'],[/일정|달력|휴가/,'cal'],[/방송|스튜디오|생방송|출연/,'studio'],[/원고|칼럼|기고|집필|책을 /,'manus'],[/출장|파견|연수/,'trip']);
  Object.assign(ILL_IMG,{scold:['scold'],dinner:['dinner'],cal:['cal'],studio:['studio','mic'],manus:['manus'],resign:['resign'],promo:['promo'],trip:['trip'],meeting:['meeting','mic2','scold']});}catch(e){console.error(e);}
// ---- 시대 카드에 그림 ----
{const _eb=eraBox;eraBox=function(){let h=_eb();try{eraNow().forEach(x=>{const D=ERA_DEF[x.k];const k='er_'+x.k;if(!IMG[k])return;h=h.replace(`<p class="hint" style="margin:6px 0 0"><b style="color:var(--fg)">${D.n}</b>`,`<div class="er18"><img src="${IMG[k]}" alt="" draggable="false"></div><p class="hint" style="margin:6px 0 0"><b style="color:var(--fg)">${D.n}</b>`);});}catch(e){}return h;};}
// ---- 얼굴: 주인공 (남·여 × 나이 4 × 표정 3) ----
function meG(){return S.meG||(hashS2(S.name||'')%2?'f':'m');}
function meFaceKey(){const y=years(),r=S.rank||0;const row=(r>=5||y>=20)?3:(r>=3||y>=12)?2:(y>=5||r>=2)?1:0;const e=S.hp<35?2:S.hp>=75?1:0;return `me_${meG()}${row}_${e}`;}
{const _rh=renderHud;renderHud=function(){_rh();try{if(!S||S.phase!=='game')return;const ch=[...document.querySelectorAll('#hud .chip.ci')];
  const o=OUT();const mk='md_'+o.type;if(ch[1]&&IMG[mk]){const sv=ch[1].querySelector('svg');if(sv)sv.outerHTML=`<img class="hud18" src="${IMG[mk]}" alt="">`;}
  const fk=meFaceKey();if(ch[2]&&IMG[fk]){const sv=ch[2].querySelector('svg');if(sv){sv.outerHTML=`<img class="hud18 me18" src="${IMG[fk]}" alt="내 얼굴" title="누르면 얼굴을 바꾼다">`;const im=ch[2].querySelector('.me18');im.style.cursor='pointer';im.onclick=e=>{e.stopPropagation();S.meG=meG()==='m'?'f':'m';renderHud();saveGame();};}}}catch(e){}};}
// ---- 얼굴: 취재원 역할 ----
{const _sf=srcFaceRole;srcFaceRole=function(s){const t=(s.role||'')+' '+((DEPTS[s.d]||{}).n||'');const h=hashS2((s.name||'')+(s.id||''));
  const r=/제보|내부 직원|공익|목격자|시민/.test(t)?'whis':/언론중재|조정위원/.test(t)?'med':/투자|벤처|VC|펀드/.test(t)?'inv':/앵커|아나운서|진행자/.test(t)?'anchor':/검사|검찰|지검/.test(t)?'pros':/판사|법원장|재판/.test(t)?'judge':/보좌관|비서관|보좌/.test(t)?'aide':/국회의원|의원/.test(t)?'mp':/변호사|로펌/.test(t)?'lawyer':/홍보|PR|커뮤니케이션|대외협력/.test(t)?'pr':/의사|전공의|병원|간호/.test(t)?'doctor':/교수|연구원|평론가|박사/.test(t)?'prof':/유튜버|크리에이터|인플루언서|BJ/.test(t)?'tuber':/외신|특파원|대사관|외국/.test(t)?'fc':null;
  if(r&&IMG['pf_'+r+'_0'])return r;const b=_sf(s);if(b==='cop'&&h%2&&IMG.pf_det_0)return 'det';return b;};}
try{Object.assign(FACE_ROLE,{invdir:'inv',investor:'inv',rivalceo:'rceo',mediator:'med',whistle:'whis'});}catch(e){}
// ---- 아이콘: 능력치·평가·이력·매체·성격·부서 (화면을 그린 뒤 덧붙인다) ----
const EV18={eval:'ss_eval',fame:'ss_rep',trust:'ss_trust',hp:'ss_hp'};
let N2I=null;function n2i(){if(N2I)return N2I;N2I={};try{Object.keys(DEPTS).forEach(k=>{if(IMG['dp_'+k])N2I[DEPTS[k].n]='dp_'+k;});Object.keys(PTRAITS).forEach(k=>{if(IMG['tr_'+k])N2I[PTRAITS[k].n]='tr_'+k;});Object.keys(TYPES).forEach(k=>{if(IMG['md_'+k])N2I[TYPES[k].n]='md_'+k;});SPECS.forEach((m,i)=>{if(IMG['sp_'+i])N2I[m.n]='sp_'+i;});OUTLETS.forEach(o=>{if(IMG['md_'+o.type]&&!N2I[o.n])N2I[o.n]='md_'+o.type;});}catch(e){}return N2I;}
function lbl18(el){const N=n2i();const tx=(el.firstChild&&el.firstChild.nodeType===3?el.firstChild.nodeValue:el.textContent||'').trim();if(!tx)return null;if(N[tx])return N[tx];const m=/^(.+?)[\s(·—]/.exec(tx);return m&&N[m[1]]?N[m[1]]:null;}
function deco18(){if(S&&S.imgOff)return;try{
  document.querySelectorAll('.stt[data-stat]:not(.d18)').forEach(b=>{b.classList.add('d18');const k='st_'+b.dataset.stat;if(IMG[k])b.insertAdjacentHTML('afterbegin',`<img class="i18" src="${IMG[k]}" alt="">`);});
  document.querySelectorAll('[data-ev]:not(.d18)').forEach(b=>{b.classList.add('d18');const k=EV18[b.dataset.ev];if(!k||!IMG[k])return;const t=b.querySelector('small')||b.querySelector('span');if(t)t.insertAdjacentHTML('afterbegin',`<img class="i18 xs" src="${IMG[k]}" alt="">`);});
  document.querySelectorAll('[data-spec]:not(.d18)').forEach(b=>{b.classList.add('d18');const k='sp_'+b.dataset.spec;const t=b.querySelector('b');if(t&&IMG[k])t.insertAdjacentHTML('beforebegin',`<img class="i18 opi" src="${IMG[k]}" alt="">`);});
  document.querySelectorAll('[data-apply]:not(.d18)').forEach(b=>{b.classList.add('d18');const o=OUTLETS.find(x=>x.id===b.dataset.apply);const k=o&&'md_'+o.type;const t=b.querySelector('.on');if(t&&k&&IMG[k])t.insertAdjacentHTML('afterbegin',`<img class="i18 xs" src="${IMG[k]}" alt="">`);});
  document.querySelectorAll('#mc .ch:not(.d18) .cl, #cards .ch:not(.d18) .cl, .opts .opt:not(.d18) b, .oc:not(.d18) .on').forEach(el=>{const b=el.closest('.ch,.opt,.oc');if(b)b.classList.add('d18');if(el.querySelector('img'))return;const k=lbl18(el);if(k)el.insertAdjacentHTML('afterbegin',`<img class="i18 xs" src="${IMG[k]}" alt="">`);});
  document.querySelectorAll('#pfd [data-pd]:not(.d18)').forEach(b=>{b.classList.add('d18');const k='dp_'+b.dataset.pd;if(b.dataset.pd&&IMG[k])b.insertAdjacentHTML('afterbegin',`<img class="i18 xs" src="${IMG[k]}" alt="">`);});
}catch(e){console.error(e);}}
{const _rd=render;render=function(){const r=_rd.apply(this,arguments);try{deco18();}catch(e){}return r;};}
(function(){const st=document.createElement('style');st.textContent=`.endhero .endimg{aspect-ratio:3/4;object-fit:cover;object-position:center 40%}.dx .dximg{aspect-ratio:3/4;object-fit:cover;width:100%}
.hud18{width:22px;height:22px;border-radius:6px;object-fit:cover;flex:0 0 auto}.hud18.me18{width:26px;height:26px;border-radius:50%;box-shadow:0 0 0 2px rgba(255,184,77,.55)}
.i18{width:22px;height:22px;border-radius:6px;object-fit:cover;vertical-align:-6px;margin-right:6px;display:inline-block}.i18.xs{width:18px;height:18px;border-radius:5px;vertical-align:-4px;margin-right:5px}.ring+small .i18.xs,[data-ev] small .i18.xs{width:14px;height:14px;margin-right:3px;vertical-align:-2px}.i18.opi{width:34px;height:34px;border-radius:8px;float:left;margin:0 8px 2px 0}
.stt.d18{position:relative}.stt>.i18{position:absolute;right:6px;top:6px;width:20px;height:20px;opacity:.9;margin:0}
.er18{border-radius:12px;overflow:hidden;margin:8px 0 2px;aspect-ratio:2.4/1;max-height:140px}.er18 img{width:100%;height:100%;object-fit:cover;display:block}
body.imgoff .i18,body.imgoff .er18,body.imgoff .hud18,body.imgoff .ev18{display:none!important}`;document.head.appendChild(st);})();
// 장면 띠 설명
const IKN18={opinion:'논설위원실 · 사설 회의',circ:'새벽 4시 · 신문 지국',board:'이사회 회의실',vote:'편집국 · 투표',mediation:'언론중재위 조정실',pol:'국회 앞 · 취재진',diplo:'외교부 · 브리핑룸',int:'특파원 사무실',eco:'증권가',ind:'공장 · 생산 라인',estate:'모델하우스 · 아파트 단지',it:'IT 기업 로비',med:'대학병원 복도',edu:'교실 · 학원가',cul:'공연장 로비',ent:'방송국 앞 · 포토월',spo:'경기장 · 기자석',foot:'축구장 · 믹스트존',case:'새벽 · 경찰서 형사과',inv:'탐사팀 · 상황판',loc:'군청 · 장터',studio:'부조정실 · 생방송',wire:'통신사 · 국제 데스크',web:'온라인 뉴스룸 · 실시간',magazine:'잡지사 · 표지 회의',spring:'봄 · 출근길',summer:'여름 · 폭염 속 현장',autumn:'가을 · 청사 앞',winter:'겨울밤 · 편집국',typhoon:'태풍 현장 · 생중계',election:'개표 방송 · 상황실',disaster:'참사 현장 · 통제선 밖',dawn:'새벽 · 편집국'};
{const _ct=capText;capText=function(){try{if(S&&S.phase==='game'){const ik=sceneImgKey();if(ik&&IKN18[ik])return IKN18[ik];}}catch(e){}return _ct();};}
// ===== 1.32 리밸런싱 =====
// 평판: 높을수록 덜 오른다 (67부터 서서히, 90이면 절반 아래)
{const _ap=apply;apply=function(o){try{if(o&&o.fame>0&&S&&S.fame>67){o=Object.assign({},o);o.fame*=clamp((112-S.fame)/45,.3,1);}}catch(e){}return _ap.call(this,o);};}
// 사장의 신뢰: 회사 보도 품질이 받쳐 준다 (기사를 안 써도 바닥으로 미끄러지지 않게)
{const _vm=v16Month;v16Month=function(lines){_vm(lines);try{if(S&&!S.founder&&!S.story&&S.rank>=7&&S.co){const q=S.co.q||50;const tg=clamp(32+q*.5,38,75);if(S.trust<tg){S.trust=clamp(S.trust+Math.min(1.2,(tg-S.trust)*.1),0,100);}}}catch(e){console.error(e);}};}
// ===== 이름에 맞는 성별 얼굴 =====
const GIV_F=new Set('서연 하은 수아 지민 유진 다은 소희 예린 나연 채원 보람 혜진 가영 미소 지우 하윤 민서 지아 서윤 수빈 윤서 지현 민지 은서 하린 소율 예은 지은 수진 미경 은정 혜원 소연 유나 다인 민경 은지 정희 현주 미란 가람 아름 보영 은비 나래 윤아 하늘 선영 다솜 희정 소영 주희 지영 혜린 숙희 은영 미진 수정 세진 수현 은영 미영 영희 정은 수연 지수 예진 다현 서현 혜수 미선 은희 선희 경희 연희 유리 아영 지혜 수민 은주 미정 현정 선미 지원 서영 예지'.split(' '));
const GIV_M=new Set('민준 지훈 도윤 현우 태호 성민 재원 준혁 동현 승우 경수 은택 정우 상혁 서준 건우 우진 시우 주원 예준 선우 도현 연우 준서 유찬 태윤 재민 성훈 정민 영호 상우 종현 진우 형준 석진 기현 동욱 병철 성진 재석 태민 한결 용준 지성 호준 경민 상민 재훈 철민 민혁 인호 범수 명수 광수 영민 준영 태경 영수 민수 동훈 성호 준호 현수 재현 승민 진호 대현 기훈 영철 성수 정훈'.split(' '));
function nameG(n){n=String(n||'').replace(/\s.*$/,'');if(n.length<2)return null;const g=n.length>=3?n.slice(-2):n.slice(1);if(GIV_F.has(g))return 'f';if(GIV_M.has(g))return 'm';return null;}
const FACE_F=new Set(['aide','anchor','desk','det','doctor','junf','whis','np10','np12','np14','np15','np18','np20','np21','np23','np26','np29','np31']);
const POOL_F=['np10','np12','np14','np15','np18','np20','np21','np23','np26','np29','np31','junf'];
const POOL_M=['np09','np11','np13','np16','np17','np19','np22','np24','np25','np27','np30','np32','junm'];
function faceG(k){return FACE_F.has(k)?'f':'m';}
// 얼굴 키(pf_xxx_e)를 이름의 성별에 맞게 고친다
function fixFaceKey(key,name){try{const m=/^pf_(.+)_(\d)$/.exec(key);if(!m)return key;const g=nameG(name);if(!g||faceG(m[1])===g)return key;const P=g==='f'?POOL_F:POOL_M;const k=P[hashS2(name)%P.length];return IMG[`pf_${k}_${m[2]}`]?`pf_${k}_${m[2]}`:key;}catch(e){return key;}}
{const _nk=npcFaceKey;npcFaceKey=function(m){const k=_nk(m);if(m&&m.d==='x_photo')return k;return fixFaceKey(k,m&&m.name);};}
{const _fc=face;face=function(role,rel,cls,name){if(!name)return _fc(role,rel,cls);return imgTag(fixFaceKey(faceKey(role,rel),name),'face'+(cls?' '+cls:''));};}
// ===== 옛 실루엣 얼굴 없애기 · 직업별 얼굴 =====
const OLD_FACE={cap:'np22',desk:'np17',boss:'jg',rival:'np19',ceo:'rceo',cop:'np13',pol:'mp',peer:null,src:null};
const ROLE_FACE=[[/조정위원|중재/,'med'],[/앵커|아나운서|진행자/,'anchor'],[/검사|검찰|지검/,'pros'],[/(^|[^출])판사|법원장|대법관|재판/,'judge'],[/변호사|로펌/,'lawyer'],
 [/형사|경위|경감|강력팀|순경|지구대|수사관/,'det'],[/경찰서장|지방청장|경찰청장|경찰서 계장/,'np22'],[/소방/,'np13'],
 [/보좌관|비서관|행정관|당직자|사무처/,'aide'],[/원내대표|국회의원|의원|구청장|시장|도지사|대변인|장관 후보|정치/,'mp'],
 [/홍보|공보관|PR|대외협력/,'pr'],[/전공의|의사|응급의학|센터장|병원장|간호/,'doctor'],[/교수|연구원|평론가|박사|큐레이터|편집자|교사|장학관|교육감|해설위원/,'prof'],
 [/유튜버|크리에이터|인플루언서/,'tuber'],[/연습생|아이돌|가수|투어 스타/,'tuber'],[/외신|특파원|대사관|외교|참사관|대사|교민/,'fc'],
 [/감독|코치|체육회장|구단|에이전트|협회/,'np24'],[/선수|유망주|국가대표|메달리스트/,'np16'],
 [/투자|벤처|스타트업|창업|개발자|유니콘|플랫폼/,'inv'],[/회장|의장|거물|대주주/,'owner'],[/대표|사장|이사|CEO|시행사|건설사/,'rceo'],
 [/애널리스트|증권|회계사|은행|지점장|본부장|금융|사무관|과장|주무관|공무원|직원|관계자/,'np11'],
 [/선수|유망주|국가대표|메달리스트/,'np16'],[/감독|코치|체육회장|구단|에이전트|협회/,'np24'],[/PD|작가|기획자|매니저|실장/,'np28'],
 [/활동가|간사|시민단체|제보|공익|목격자|시민/,'whis'],[/상인회장|주민|유지/,'np30']];
function roleFace(t){for(const [re,k] of ROLE_FACE)if(re.test(t)&&IMG['pf_'+k+'_0'])return k;return null;}
srcFaceRole=function(s){const t=(s.role||'')+' '+((DEPTS[s.d]||{}).n||'');return roleFace(s.role||'')||roleFace(t)||POOL_M.concat(POOL_F)[hashS2((s.name||'')+(s.id||''))%25];};
{const _fk=faceKey;faceKey=function(role,rel){const k=_fk(role,rel);try{const m=/^pf_(.+)_(\d)$/.exec(k);if(m&&m[1] in OLD_FACE){let n=OLD_FACE[m[1]];if(!n)n=POOL_M[hashS2(String(role)+m[1])%POOL_M.length];return `pf_${n}_${m[2]}`;}}catch(e){}return k;};}
{const _f2=face;face=function(role,rel,cls,name){if(name&&(role==='peer'||role==='src'||!FACE_ROLE[role]&&!IMG['pf_'+role+'_0'])){const P=nameG(name)==='f'?POOL_F:POOL_M;const k=`pf_${P[hashS2(name)%P.length]}_${rel==null?0:rel>=40?1:rel<=-10?2:0}`;return imgTag(k,'face'+(cls?' '+cls:''));}return _f2(role,rel,cls,name);};}