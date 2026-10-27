/* 바이라인 — src/systems/career.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */

// ===== 5.7 승진의 순간: 화려한 발령장 · 이번 직급 성적표 · 동료 반응 · 커리어 연대기 =====
const PROMO_LINE={1:['수습 딱지를 뗐다. 이제 기사 끝에 내 이름이 박힌다.','"이제부터 진짜 기자다." 캡이 처음으로 웃었다.'],
 2:['데스크 자리에 앉았다. 이제 남의 기사에 빨간 펜을 댈 차례다.','후배들이 처음으로 "선배"가 아니라 "차장님"이라고 불렀다.'],
 3:['부장. 한 부서의 지면이 이제 내 손에 달렸다.','책상에 부서장 명패가 올라왔다. 부서원들이 일어나 박수를 쳤다.'],
 4:['부국장. 편집국 전체가 내려다보이는 자리다.','1면 회의 테이블 상석에 의자가 하나 늘었다. 내 자리다.'],
 5:['국장. 기자들의 기자가 됐다.','편집국 게시판 맨 위에 내 이름이 붙었다. 축하 화분이 복도까지 늘어섰다.'],
 6:['편집국장. 내일 자 마지막 결정은 이제 내 몫이다.','윤전기가 돈다. 오늘부터 이 매체의 얼굴은 나다.'],
 7:['사장. 기자로 시작해 회사의 주인이 됐다.','첫 출근길, 정문 경비가 거수경례를 했다. 사장실 문패에 내 이름이 걸렸다.']};
function promoSnap(){return{t:S.turn,arts:S.totalArticles||0,ex:S.scoops||0,tok:S.tokjong||0,aw:S.awards||0,fame:Math.round(S.fame||0)};}
// 5.7 일러스트 자산 (장면·타이틀·엔딩·신문·분야·등급·인물·장식)
const IMG={"sc_newsroom": "assets/images/sc_newsroom.webp", "sc_briefing": "assets/images/sc_briefing.webp", "sc_exec": "assets/images/sc_exec.webp", "sc_print": "assets/images/sc_print.webp", "sc_assembly": "assets/images/sc_assembly.webp", "sc_court": "assets/images/sc_court.webp", "sc_lobby": "assets/images/sc_lobby.webp", "sc_pub": "assets/images/sc_pub.webp", "sc_rain": "assets/images/sc_rain.webp", "sc_region": "assets/images/sc_region.webp", "sc_crime": "assets/images/sc_crime.webp", "sc_airport": "assets/images/sc_airport.webp", "sc_gov": "assets/images/sc_gov.webp", "sc_roof": "assets/images/sc_roof.webp", "sc_chair": "assets/images/sc_chair.webp", "title": "assets/images/title.webp", "end_retire": "assets/images/end_retire.webp", "end_found": "assets/images/end_found.webp", "end_fired": "assets/images/end_fired.webp", "paper_front": "assets/images/paper_front.webp", "paper_sec": "assets/images/paper_sec.webp", "paper_web": "assets/images/paper_web.webp", "cat_pol": "assets/images/cat_pol.webp", "cat_eco": "assets/images/cat_eco.webp", "cat_soc": "assets/images/cat_soc.webp", "cat_int": "assets/images/cat_int.webp", "cat_cul": "assets/images/cat_cul.webp", "cat_ent": "assets/images/cat_ent.webp", "cat_spo": "assets/images/cat_spo.webp", "cat_loc": "assets/images/cat_loc.webp", "gr_S": "assets/images/gr_S.webp", "gr_A": "assets/images/gr_A.webp", "gr_B": "assets/images/gr_B.webp", "gr_C": "assets/images/gr_C.webp", "pf_cap_0": "assets/images/pf_cap_0.webp", "pf_cap_1": "assets/images/pf_cap_1.webp", "pf_cap_2": "assets/images/pf_cap_2.webp", "pf_desk_0": "assets/images/pf_desk_0.webp", "pf_desk_1": "assets/images/pf_desk_1.webp", "pf_desk_2": "assets/images/pf_desk_2.webp", "pf_boss_0": "assets/images/pf_boss_0.webp", "pf_boss_1": "assets/images/pf_boss_1.webp", "pf_boss_2": "assets/images/pf_boss_2.webp", "pf_peer_0": "assets/images/pf_peer_0.webp", "pf_peer_1": "assets/images/pf_peer_1.webp", "pf_peer_2": "assets/images/pf_peer_2.webp", "pf_rival_0": "assets/images/pf_rival_0.webp", "pf_rival_1": "assets/images/pf_rival_1.webp", "pf_rival_2": "assets/images/pf_rival_2.webp", "pf_src_0": "assets/images/pf_src_0.webp", "pf_src_1": "assets/images/pf_src_1.webp", "pf_src_2": "assets/images/pf_src_2.webp", "pf_ceo_0": "assets/images/pf_ceo_0.webp", "pf_ceo_1": "assets/images/pf_ceo_1.webp", "pf_ceo_2": "assets/images/pf_ceo_2.webp", "pf_cop_0": "assets/images/pf_cop_0.webp", "pf_cop_1": "assets/images/pf_cop_1.webp", "pf_cop_2": "assets/images/pf_cop_2.webp", "pf_pol_0": "assets/images/pf_pol_0.webp", "pf_pol_1": "assets/images/pf_pol_1.webp", "pf_pol_2": "assets/images/pf_pol_2.webp", "ban_promo": "assets/images/ban_promo.webp", "ban_appoint": "assets/images/ban_appoint.webp", "med_gold": "assets/images/med_gold.webp", "med_silver": "assets/images/med_silver.webp", "med_bronze": "assets/images/med_bronze.webp", "med_crown": "assets/images/med_crown.webp"};
function imgTag(k,cls,alt){const u=IMG[k];return u?`<img class="${cls||''}" src="${u}" alt="${esc(alt||'')}" draggable="false"${alt?'':' aria-hidden="true"'}>`:'';}
// 동료 역할 → 얼굴 (관계에 따라 표정: 0 평소 · 1 웃음 · 2 화남)
const FACE_ROLE={cap:'cap',boss:'boss',peer:'peer',junior:'peer',rivalpeer:'rival',senior:'desk',editor:'desk',photo:'src',union:'boss',cofound:'desk',fstaff:'peer',biz:'ceo',mentor:'boss',invdir:'ceo'};
function faceKey(role,rel){const r=FACE_ROLE[role]||role||'src';const e=rel==null?0:rel>=40?1:rel<=-10?2:0;return `pf_${IMG['pf_'+r+'_0']?r:'src'}_${e}`;}
function face(role,rel,cls){return imgTag(faceKey(role,rel),'face'+(cls?' '+cls:''));}
function srcFaceRole(s){const t=(s.role||'')+' '+((DEPTS[s.d]||{}).n||'');return /경찰|경위|경감|경사|형사|수사|순경|지구대/.test(t)?'cop':/의원|보좌|당 |대변인|대통령실|장관|시장|구청장|도지사|정치/.test(t)?'pol':'src';}
function catImg(d){const c=['pol','eco','soc','int','cul','ent','spo','loc'].includes(d)?d:(typeof cat1==='function'?cat1(d):d);return imgTag('cat_'+c,'caticon');}
// 5.7 아이콘 세트 (선 아이콘, currentColor)
const ICP={
 cal:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M3 10h18M8 3v4M16 3v4M8.5 15l2 2 4-4"/>',
 bld:'<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M9 21v-4h6v4M8 7h2M14 7h2M8 11h2M14 11h2"/>',
 user:'<circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/>',
 users:'<circle cx="9" cy="8" r="3.5"/><path d="M2.5 20c0-3.6 3-6 6.5-6s6.5 2.4 6.5 6"/><circle cx="17" cy="9" r="2.8"/><path d="M16 14.2c3 .3 5.5 2.4 5.5 5.8"/>',
 heart:'<path d="M12 20s-7.5-4.6-9-9.3C2 7.4 4.3 4.5 7.4 4.5c1.9 0 3.5 1 4.6 2.6 1.1-1.6 2.7-2.6 4.6-2.6 3.1 0 5.4 2.9 4.4 6.2C19.5 15.4 12 20 12 20z"/>',
 coins:'<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v4c0 1.7 3.1 3 7 3s7-1.3 7-3V6M5 10v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4M5 14v4c0 1.7 3.1 3 7 3s7-1.3 7-3v-4"/>',
 gauge:'<path d="M4 18a8 8 0 1 1 16 0"/><path d="M12 18l4-6"/>',
 menu:'<path d="M4 7h16M4 12h16M4 17h16"/>',
 star:'<path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/>',
 brief:'<rect x="3" y="7" width="18" height="13" rx="2"/><path d="M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18"/>',
 doc:'<path d="M6 3h8l4 4v14H6z"/><path d="M14 3v4h4M9 12h6M9 16h6"/>',
 book:'<path d="M4 5c3-1.5 6-1.5 8 0v15c-2-1.5-5-1.5-8 0zM20 5c-3-1.5-6-1.5-8 0v15c2-1.5 5-1.5 8 0z"/>',
 chart:'<path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/>',
 search:'<circle cx="11" cy="11" r="6.5"/><path d="M16 16l5 5"/>',
 mic:'<rect x="9" y="3" width="6" height="11" rx="3"/><path d="M5 11a7 7 0 0 0 14 0M12 18v3M8 21h8"/>',
 car:'<path d="M3 16v-4l2.5-5h13L21 12v4z"/><path d="M3 12h18"/><circle cx="7" cy="17" r="2"/><circle cx="17" cy="17" r="2"/><path d="M10 4h4"/>',
 moon:'<path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/>',
 bolt:'<path d="M13 2L4 14h7l-1 8 9-12h-7z"/>',
 flag:'<path d="M5 21V4M5 4h11l-2 4 2 4H5"/>',
 map:'<path d="M3 6l6-2 6 2 6-2v14l-6 2-6-2-6 2z"/><path d="M9 4v14M15 6v14"/>',
 pen:'<path d="M4 20l1-5L16 4l4 4L9 19z"/><path d="M13 7l4 4"/>',
 edit:'<path d="M4 20h4L19 9l-4-4L4 16z"/><path d="M13 7l4 4M14 20h6"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5L19 19M5 19l1.5-1.5M17.5 6.5L19 5"/>',
 paper:'<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h4M7 16h4M14 12h3v4h-3z"/>',
 quote:'<path d="M10 7H6a2 2 0 0 0-2 2v3h5v5H4M20 7h-4a2 2 0 0 0-2 2v3h5v5h-5"/>',
 cup:'<path d="M4 8h12v6a5 5 0 0 1-5 5H9a5 5 0 0 1-5-5z"/><path d="M16 10h2a2 2 0 0 1 0 4h-2M8 3v2M12 3v2"/>',
 link:'<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
 wallet:'<rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 10h18M16 15h2M6 6l9-3 2 3"/>',
 bed:'<path d="M3 18V7M3 14h18v4M21 14v-2a3 3 0 0 0-3-3h-8v5"/><circle cx="7" cy="11" r="2"/>',
 rocket:'<path d="M12 15l-3-3c1-4 4-8 10-9-1 6-5 9-9 10z"/><path d="M9 12l-4 1-2 3 4 1M12 15l-1 4 3 2 1-4M15 9h.01"/>',
 hand:'<path d="M3 12l4-4 4 2 3-2 4 2 3 3-6 6-3-2-2 2-7-7z"/><path d="M11 10l3 3"/>',
 trophy:'<path d="M8 4h8v5a4 4 0 0 1-8 0zM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M8 21h8M9 17h6"/>',
 shield:'<path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="M9 12l2 2 4-4"/>',
 gov:'<path d="M3 21h18M5 21V10M19 21V10M9 21V10M15 21V10M2 10h20L12 3z"/>',
 vote:'<rect x="4" y="11" width="16" height="10" rx="1"/><path d="M8 11V5h8v6M10 8h4"/>',
 clip:'<rect x="5" y="4" width="14" height="17" rx="2"/><path d="M9 4V3h6v1M9 10l2 2 4-4M9 16h6"/>',
 chev:'<path d="M9 6l6 6-6 6"/>',
 fire:'<path d="M12 21c-4 0-7-3-7-7 0-3 2-5 3-7 1 2 2 3 3 3 0-3 1-6 4-8 0 3 4 6 4 11 0 5-3 8-7 8z"/>',
 tool:'<path d="M14 6a4 4 0 0 1 5 5l-9 9-4-4z"/><path d="M5 19l-2 2"/>'};
function ic(n,c){const p=ICP[n];if(!p)return '';return `<svg class="ic${c?' '+c:''}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${p}</svg>`;}
const ACT_IC={gongse:'fire',spx:'star',cfile:'search',spec:'star',rtact:'flag',breaking:'bolt',sasu:'car',hari:'moon',beat:'mic',discover:'search',invest:'search',special:'flag',source:'users',tour:'map',
 write:'pen',fassign:'clip',report:'doc',pitch:'sun',desk:'edit',meeting:'users',front:'paper',column:'quote',direction:'flag',plan:'cal',taskforce:'shield',agenda:'flag',fethics:'shield',fcrisis:'fire',
 deptlife:'users',handoff:'link',fhire:'user',fbureau:'map',colleague:'cup',drink:'cup',network:'link',recruit:'user',personnel:'users',hire:'user',
 wage:'coins',adrate:'chart',revenue:'chart',lgevent:'star',gad:'bld',fvision:'rocket',fsales:'hand',fpartner:'link',fbrand:'star',fraise:'coins',adsell:'hand',adsales:'hand',campaign:'star',digital:'chart',event:'star',portal:'link',facility:'tool',paypol:'coins',newdept:'bld',cut:'tool',
 life:'wallet',rest:'bed',deptreq:'map',job:'brief',found:'rocket'};
const GRP_IC={'추천':'star','취재 현장':'brief','기사와 지면':'doc','사람과 관계':'user','영업과 경영':'chart','나의 생활':'book','기타':'menu'};
function actGrp(id){const g=ACT_GROUPS.find(g=>g[2].includes(id));return g||['기타','var(--mute)',[]];}

// 5.7 직급 휘장 (0 수습 ~ 7 사장·대표). 이름은 매체마다 달라서 그림엔 글자를 넣지 않았다
const RANK_IMG=["assets/images/rank_0.webp", "assets/images/rank_1.webp", "assets/images/rank_2.webp", "assets/images/rank_3.webp", "assets/images/rank_4.webp", "assets/images/rank_5.webp", "assets/images/rank_6.webp", "assets/images/rank_7.webp"];
function rankBadge(r,cls){r=clamp(r|0,0,7);return `<img class="rbadge${cls?' '+cls:''}" src="${RANK_IMG[r]}" alt="${esc(rankName(r))} 휘장" draggable="false">`;}
function promoCard(prev,r,inR,fast){const P=S.pSnap||{t:Math.max(0,S.turn-inR),arts:0,ex:0,tok:0,aw:0,fame:0};const tv=isTV();
  const L=(PROMO_LINE[r]||['새 자리에 앉았다.'])[S.turn%2].replace('신문',tv?'뉴스':'신문');
  const arts=(S.totalArticles||0)-P.arts,ex=(S.scoops||0)-P.ex,tk=(S.tokjong||0)-P.tok,aw=(S.awards||0)-P.aw,fg=Math.round((S.fame||0)-P.fame);
  const best=(S.clips||[]).filter(c=>c.turn>=P.t&&!c.staff&&String(c.by||'').split(/[·,\s/]+/).includes(S.name)).sort((a,b)=>(b.imp||0)-(a.imp||0))[0];
  const N=8+hashId(S.name+r,3)%7;const pos=clamp(Math.round(1+(inR/Math.max(1,promoMinW(prev))-1)*5+(hashId(S.name,r)%3)),1,N);
  const C=S.cols||[];const nm=role=>{const c=C.find(x=>x.role===role);return c?c.name:null;};const R=[];
  const fc=role=>{const c=C.find(x=>x.role===role);return c?face(role,Math.max(45,c.rel||0),'rf',c.name):'';};if(nm('boss'))R.push(`${fc('boss')}${esc(nm('boss'))}: "${pick(['기대한다. 이제 핑계는 없다.','네가 올라갈 줄 알았다. 잘해라.','자리 무게가 다를 거다. 버텨라.'])}"`);
  if(nm('peer'))R.push(`${fc('peer')}${esc(nm('peer'))}: "${pick(['축하한다! 오늘 술은 네가 사라.','역시 동기 중에 네가 제일 먼저다.','부럽다… 진심으로 축하해.'])}"`);
  if(nm('junior'))R.push(`${fc('junior')}${esc(nm('junior'))}: "${rankName(r)}님, 축하드립니다! 저도 따라가겠습니다."`);
  if(nm('rivalpeer'))R.push(`${face('rivalpeer',-30,'rf',nm('rivalpeer'))}${jo2(esc(nm('rivalpeer')),'은','는')} 멀리서 굳은 얼굴로 박수를 쳤다.`);
  if(S.rival&&S.rival.name)R.push(`${face('rival',0,'rf',S.rival.name)}라이벌 ${esc(S.rival.name)}에게서 짧은 문자가 왔다. "축하. 다음엔 내 차례다."`);
  (S.promoHist=S.promoHist||[]).push({r,d:dateShort(),y:years(),o:OUT().n,arts,ex,fast:!!fast});S.pSnap=promoSnap();
  const stars='★'.repeat(Math.min(7,r))+'<i>'+'★'.repeat(Math.max(0,7-r))+'</i>';
  return `<div class="promo"><div class="pconf" aria-hidden="true"></div>${imgTag(r>=4?'ban_appoint':'ban_promo','pban')}<small>${esc(OUT().n)} 인사 발령 · ${dateStr()}</small>${rankBadge(r,'pbig')}<div class="prk">${esc(rankName(r))}</div><div class="pst">${stars}</div><p class="pl">${esc(L)}</p>
   <div class="ptags">${fast?'<span class="tag ok">고속 승진</span>':''}<span class="tag">입사 동기 ${N}명 중 ${pos}번째</span><span class="tag">경력 ${years()}년 차</span><span class="tag">이번 직급 ${moTxt(inR)}</span></div></div>
   <div class="psum"><div><b>${arts}</b><small>출고</small></div><div><b>${ex}</b><small>단독</small></div><div><b>${tk+aw}</b><small>특종·수상</small></div><div><b>${fg>=0?'+':''}${fg}</b><small>평판</small></div></div>
   ${best?`<p class="hint" style="margin:8px 0 0">이번 직급의 대표작 — 「${esc(best.h)}」 (${esc(best.place||'')})</p>`:''}
   ${R.length?`<ul class="feed rfeed" style="margin-top:8px">${R.slice(0,4).map(x=>`<li>${x}</li>`).join('')}</ul>`:''}`;}
function promoLineHTML(){const H=S.promoHist||[];if(!H.length||S.story)return '';return `<div class="sec">커리어 연대기</div><div class="pline">${H.map(h=>`<div class="pli${h.fast?' fast':''}">${rankBadge(h.r,'psm')}<b>${esc(rankName(h.r))}</b><span>${esc(h.d)} · ${h.y}년 차 · ${esc(h.o)}</span><small>그 직급까지 출고 ${h.arts} · 단독 ${h.ex}${h.fast?' · 고속 승진':''}</small></div>`).join('')}</div>`;}
// 사장 임기: 한 번에 2년(난이도·간소화 반영). 임기가 끝나면 이사회가 연임을 심사한다 (정년 65세까지)
function ceoTermW(){return Math.round(96*DF().ten);}
function ceoReview(){const K=(S.kpi&&S.kpi.hist)||[];const kp=K.length?K.reduce((a,b)=>a+b,0)/K.length:1.5;const c=S.co||{};
  const sc=Math.min(8,S.boardSup||0)+(S.eval-50)*.9+(kp-1.5)*14+(S.trust-45)*.4+(c.cash>0?6:-20)+((S.myShare||0)>=(S.ceoShare0||S.myShare||0)?5:-5)-((S.ceoTerm||1)-1)*6;
  const _W=ownEnsure();const _ow=_W&&OWN_T[_W.k].grp?(_W.rel-20)*.3:0;return {sc:Math.round(sc+_ow),kp,ok:sc+_ow>=0};}
function ceoTermEnd(){const n=S.ceoTerm||1,a=myAge(),R0=retireAge(),rv=ceoReview();const room=a+2<=R0&&n<3;
  const why=[`분기 KPI 평균 ${f1(rv.kp)}/3`,`이사회 신임 ${Math.round(S.eval)}`,`신뢰도 ${Math.round(S.trust)}`,`회사 자금 ${eok(S.co.cash)}`].join(' · ');
  if(!room||!rv.ok){openModal(`${n}기 임기 만료`,`<p class="lede">${esc(OUT().n)} 사장 ${n}기 임기가 끝났다. ${!room?(n>=3?'세 번의 임기를 채웠다. 이사회가 송별사를 준비했다.':'정년을 앞두고 이사회가 후임을 정했다.'):'이사회가 연임안을 부결했다. "새 사람이 필요하다"는 이유다.'}</p><p class="hint">${why}</p>`,[{label:'사장실을 비운다',sub:'커리어 결산',fn:()=>{ending('임기 만료 · 사장실의 주인');return false;}}]);return;}
  openModal(`${n}기 임기 만료 · 연임 심사`,`<p class="lede">${esc(OUT().n)} 사장 ${n}기 임기가 끝났다. 이사회가 연임안을 올렸다. "한 번 더 맡아 주시죠."</p><p class="hint">${why}<br>연임하면 ${n+1}기 임기(${moTxt(ceoTermW())})가 새로 시작되고, 이사회 KPI도 새로 잡힌다. 정년(${R0}세)이 오면 임기 중이라도 물러난다.</p>`,[
   {label:'연임한다',rec:true,sub:`${n+1}기 사장 · 이사회 신임 조금↑`,fn:()=>{S.ceoTerm=n+1;S.inRank=0;S.ceoShare0=S.myShare||0;S.ceoBad=0;try{kpiNew();}catch(e){}apply({eval:2});log(`사장 연임 (${n+1}기)`);tick(`${OUT().n}, ${S.name} 사장 연임 확정`,1);}},
   {label:'박수 칠 때 떠난다',sub:'커리어 결산',fn:()=>{ending('임기 만료 · 사장실의 주인');return false;}}]);}
function failCheck(monthEnd){
  if(S.founder){if(monthEnd&&S.co.cash<fBankLine()+2&&!S.fRescue&&S.diff!=='hard'){S.fRescue=1;return ()=>openModal('마지막 자금줄',`<p class="lede">통장이 바닥을 보인다. 이대로면 다음 달 월급을 못 준다.</p><p class="hint">한 번만 쓸 수 있는 구명줄이다.</p>`,[{label:'독자 긴급 후원 호소',sub:'자금 +1.5억 · 신뢰↑ · 다음엔 안 통한다',fn:()=>{S.co.cash+=1.5;toast(apply({trust:2}));}},{label:'지인·가족에게 빌린다',sub:'자금 +2억 · 내 통장 -3000만',fn:()=>{S.co.cash+=2;S.money-=3000;}},{label:'투자사에 지분을 판다',sub:'자금 +4억 · 지분 -15%',fn:()=>{S.co.cash+=4;S.equity=Math.max(10,(S.equity||100)-15);S.investor=Math.max(S.investor||0,1);}}]);}if(monthEnd&&S.co.cash<fBankLine())return ()=>ending('창간 실패 · 파산');return null;}
  if(S.rank===7&&!S.story&&!S.founder&&S.inRank>=ceoTermW()){if(!S.story){S.goals=S.goals||{};if(!S.goals.ceo)S.goals.ceo=dateShort();}return ()=>ceoTermEnd();}
  if(S.rank===7&&monthEnd){const bad=S.co.cash<0||S.eval<15;if(!bad)S.ceoBad=0;else{S.ceoBad=(S.ceoBad||0)+1;if(S.ceoBad>=2)return ()=>ending('이사회 해임');const why=S.co.cash<0?'회사 금고가 바닥났다':'이사회 신임이 바닥이다';return ()=>openModal('이사회의 최후통첩',`<p class="lede">긴급 이사회가 열렸다. "${why}. 다음 달 말까지 돌려놓지 못하면 사장을 바꾸겠습니다."</p><p class="hint">${S.co.cash<0?'광고 영업·비용 절감·수익 다변화로 이번 달 안에 자금을 플러스로 돌려놓자.':'미션·편집회의·1면 대결로 평가를 끌어올리자.'}</p>`,[{label:'알겠다',rec:true}]);}}
  S.lowEval=(S.eval<=10&&S.rank>0)?S.lowEval+1:0;
  if((S.lowEval>=4||S.trust<=8)&&!(S.fireGrace>S.turn)&&S._fireQ!==Math.floor(S.turn/4)){S._fireQ=Math.floor(S.turn/4);return ()=>{if(!(S.lowEval>=4||S.trust<=8)||S.fireGrace>S.turn)return closeModal();fired(S.trust<=8?'잇따른 오보와 비위로 신뢰를 잃었다.':'평가가 바닥을 쳤다.');};}
  return null;
}
function fired(reason){if(S.story){openModal('해임',`<p class="lede">${reason} 결국 자리에서 물러났다.</p>`,[{label:'결과 보기',fn:()=>{ending(`스토리 실패 · ${storyDef().n}`);return false;}}]);return;}
  let offs=OUTLETS.filter(o=>o.id!==S.outlet&&o.p<=OUT().p&&!o.closed&&!o.custom).map(o=>({o,ok:S.fame>=15&&chance(.45)})).filter(x=>x.ok).slice(0,2);if(!offs.length){const sm=shuffle(OUTLETS.filter(o=>o.id!==S.outlet&&!o.closed&&!o.custom&&o.p<=Math.max(2,OUT().p-1)))[0];if(sm)offs=[{o:sm}];}calmSet(12);
  openModal('권고사직',`<p class="lede">${reason} 회사는 사직을 권고했다.</p><p class="hint">끝이 아니다. 작은 곳에서 다시 시작해 경력을 쌓으면 큰 매체로 돌아올 수 있다.</p>${tipN(S.trust<=8?'오보가 이어지면 신뢰가 바닥난다. 정정에 솔직하고, 핵심 사실은 두 출처로.':'평가는 기사·미션·발제로 오른다. 할 일의 경고 상자를 확인하자.')}`,offs.map(f=>({label:`${f.o.n}에 재취업`,sub:`${TYPES[f.o.type].n} · ${rankName(xferRank(f.o,Math.max(1,S.rank-1)),f.o)}`,fn:()=>{transfer(f.o,Math.max(1,S.rank-1));S.eval=45;S.trust=Math.max(S.trust,25);S.lowEval=0;S.fireGrace=S.turn+24;Q.length=0;log('재취업으로 커리어를 이어간다');}})).concat([{label:'언론계를 떠난다',fn:()=>{ending('퇴사');return false;}}]));
}
// 튜토리얼: 장마다 실제 화면을 줄여 그린 샘플 그림 + 짧은 설명
const tAct=(n,d,ap,rec)=>`<div class="act${rec?' rec':''}"><span class="an">${n}<span class="pips">${'<span class="on"></span>'.repeat(ap)}</span></span><span class="ad">${d}</span></div>`;
const tRing=(v,c,n)=>`<div><div class="ring" style="--v:${v};--c:${c}"><b>${v}</b></div><small>${n}</small></div>`;
const TUTF=()=>[
 ['한 달의 흐름',`<div class="tfig"><div class="tbh"><b>이번 달 할 일</b><span>행동력 <b style="color:var(--sodium)">8</b> / 10</span></div><div class="acat"><span class="achip" aria-pressed="true" style="--c:var(--sodium)">추천<small>5</small></span><span class="achip" style="--c:#77a6ff">취재 현장<small>3</small></span><span class="achip" style="--c:#ffb84d">기사와 지면<small>2</small></span></div><div class="acts">${tAct('사쓰마와리','경찰서를 돌며 단서를 모은다',2,1)}${tAct('정보보고','모은 것을 캡에게 보고한다',1)}</div><div class="tnext">다음 달로 넘기기 →</div></div>`,
  ['한 턴은 <b>한 달</b>. 행동마다 노란 칸만큼 행동력이 든다.','위의 분야 버튼(추천·취재 현장·기사와 지면…)으로 할 일을 골라 본다.','여러 단계로 된 일은 행동력을 쓰기 전까지 <b>취소·이전 단계</b>가 된다.','할 일을 마치면 <b>결과 창</b>에 무엇이 바뀌었는지 나온다.']],
 ['처음이라면 천천히',`<div class="tfig"><div class="acts">${tAct('부서 사람들과','처음이라 천천히 열린다 · 2개월 뒤',1)}${tAct('대외 관계','처음이라 천천히 열린다 · 5개월 뒤',1)}</div></div>`,
  ['처음 하는 사람에게는 기능과 탭이 몇 달에 걸쳐 하나씩 열린다.','한 번 2년 이상 해 봤다면 다음 판부터는 바로 열린다.','이미 익숙하다면 메뉴의 <b>모든 기능 바로 열기</b>를 누르자.']],
 ['수습 시절 · 캡의 미션',`<div class="tfig"><div class="card rkc"><div class="t">캡의 이달 미션</div><div class="meta"><span class="tag ok">${typeof sasuN==='function'?sasuN():'사쓰마와리'} 3/3</span><span>정보보고 1/2</span><span>뻗치기 0/1</span></div></div><div class="statrow"><span>수습 평가</span>${bar(46,'var(--siren)')}<span class="num">46</span></div></div>`,
  ['처음 3개월은 수습(어느 매체든 3개월 · 간소화 모드 2개월). 매체마다 도는 현장이 다르다. 일간지는 경찰서를 도는 사쓰마와리, 통신사는 야간 속보 당번, 방송은 현장 수습, 경제지는 여의도, 지역지는 시·군청을 돈다. 정보보고로 평가를 쌓는다.','매달 <b>캡의 미션</b> 3개가 나온다. 다 하면 평가↑, 하나도 못 하면 새벽 3시에 전화가 온다.','매체마다 수습 평가 기준이 다르다. 다 채우면 정식 기자로 발령된다.']],
 ['취재와 교차 확인',`<div class="tfig"><div class="card"><div class="t"><span class="gr gA">A</span> 「시 산하기관 채용 특혜 의혹」 <span class="tg h">단독</span></div><ul class="facts"><li class="v">자격 요건 변경 — 문건·전화 2곳</li><li class="h">핵심: 이사장 지시 — 1곳만 확인</li><li>기관 반론 — 아직</li></ul></div><div class="card" style="margin-top:6px"><div class="t">현장의 순간</div><div class="meta"><span>경비원이 막아선다 → 정중히 / 뒷문 / 주민인 척</span></div></div></div>`,
  ['아이템에는 등급(S·A·B·C)이 있다. 핵심 사실은 <b>두 경로</b>로, 반론도 받아야 한다.','취재 중 가끔 <b>현장의 순간</b>이 와서 고를 일이 생긴다. 판이 커지거나 후속 아이템이 생기는 반전도 있다.','늦으면 라이벌·경쟁사가 먼저 쓴다.']],
 ['기사 · 속보 · 단독 · 특종',`<div class="tfig">${scoopBanner('특종')}${clipHTML({o:'대한일보',d:'soc',date:'3월',place:'1면 톱',h:'[단독] 시 산하기관, 채용 직전 자격 요건 바꿨다',lead:'시 산하기관이 신입 채용 공고 사흘 전 자격 요건을 바꾼 사실이 확인됐다.',by:S&&S.name?S.name:'한서진',excl:true},true)}</div>`,
  ['야마 → 리드 → 팩트·반론 → 인용·제목 → 출고 순서로 쓴다. 단계마다 되돌릴 수 있다.','4단계에선 누구의 말을 앞세울지 고르고, 제목을 앞머리·본문·꼬리로 직접 조립한다. 5단계에서 내보낼 기사를 미리 본다.','확인 안 된 사실을 넣으면 기사는 커지지만 신뢰가 바로 깎인다. 빨리 낼지, 더 확인할지는 내 몫이다.','먼저 쓰면 <b>단독</b>, 파급력과 완성도가 높으면 <b>특종</b>, 확인까지 탄탄하면 <b>대특종</b>. 사건이 터지면 <b>속보</b> 경쟁이 붙는다.','미확인 사실·반론 누락·낚시 제목은 오보와 <b>언론중재위원회</b>로 돌아온다. 들키면 <b>정정·반론보도</b>로 바로잡을지, 버틸지 고른다.','제보가 가끔 허위이거나, 파 보니 알맹이가 없을 때도 있다.']],
  ['매체마다 다른 일',`<div class="tfig"><div class="card"><div class="t">송고 경쟁 · 한빛뉴스통신만의 규칙</div><div class="meta"><span>이달 성과: 송고 5/8 · 채택 매체 31/40</span></div></div><div class="acts">${tAct('단신 송고','확인된 사실 하나면 바로 송고',1)}</div></div>`,
  ['매체마다 <b>평가받는 기준</b>과 <b>고유 업무</b>가 다르다. 통신사는 송고·채택, 방송은 그림 있는 리포트, 일간지는 1면, 경제지는 주가 반응, 인터넷은 조회수, 주간지는 커버스토리.','매달 그 매체 기준의 성과가 평가로 이어진다. 내 정보 탭에서 이달 성과를 볼 수 있다.','전문지·스포츠지·연예지는 엠바고·판결문·이적설·커버 섭외 같은 자기만의 규칙이 있다.','속보 송고·큐시트·생중계 같은 <b>미니게임</b>은 설정에서 끌 수 있다.']],
 ['기자의 가치 · 편집권',`<div class="tfig"><div class="card"><div class="t">나는 어떤 기자인가</div><div class="meta"><span>검증 ↔ 속도</span><span>흥행 ↔ 공익</span><span>타협 ↔ 독립</span></div></div></div>`,
  ['무엇을 앞세웠는지가 쌓여 어떤 기자인지 정해진다. 그에 맞는 일이 찾아온다 — 속보 차출, 탐사팀 러브콜, 제보, 권력의 견제, 광고주의 유혹.','광고주 기사를 쓰면 데스크가 <b>킬·단신·묵히기</b>를 지시할 수 있다. 받아들이거나 맞서거나.','부장 이상이면 부서원 기사를 내가 결재하고, <b>공세 보도</b>로 한 곳을 몇 주 동안 파헤칠 수도 있다.']],
 ['성격 · 사건 파일 · 길',`<div class="tfig"><div class="card"><div class="t">사건 파일 · 대명그룹 비자금 의혹</div><div class="meta"><span>용의자 4명</span><span>단서 5개</span><span>경쟁사 추격 42/100</span></div></div><div class="card" style="border-color:rgba(255,111,97,.35)"><div class="t">어용의 길 · 정부의 스피커</div><div class="meta"><span>노출 위험 38</span></div></div></div>`,
  ['판을 시작할 때 <b>성격</b> 두 가지를 고른다. 이점과 약점이 함께 온다.','<b>사건 파일</b>은 판마다 몸통이 다르다. 단서마다 믿을 만한 정도가 다르고 역정보도 섞인다. 맞히면 대특종, 틀리면 소송.','<b>기자의 길</b>은 열두 갈래다. 일하는 방식이 막대를 채우고, 막대가 긴 길의 부름이 먼저 온다. 어용·기레기·유착·선동·청부의 어두운 길은 빨리 크게 해 주지만 신뢰가 깎이고 노출 위험이 쌓인다. 길마다 고유 업무가 생긴다. 감시견·약자의 목소리·검증의 길 같은 <b>좋은 길</b>은 신뢰를 쌓지만 권력의 보복과 소진이 따른다.','자세한 내용은 수첩의 목표·이야기 칸에 있다.']],
 ['세계 · 법정 · 전문 분야',`<div class="tfig"><div class="card"><div class="t">이번 판의 세계 · 보수 진영 집권</div><div class="meta"><span>재벌 64</span><span>검찰 58</span><span>시민사회 41</span></div></div><div class="card"><div class="t">전문 분야 · 탐사보도 2단계</div></div></div>`,
  ['정부·야당·재벌·검찰·시민사회의 <b>힘의 균형</b>이 판마다 다르고, 내 기사로 움직인다. 대선 때 정권이 바뀔 수 있다.','보수·진보·언론계·독자가 나를 따로 평가한다. 한쪽에서 믿으면 제보가 오고, 반대쪽은 등을 돌린다.','소송은 세 라운드의 <b>법정 공방</b>. 취재 자료·증인·여론전·합의 가운데 고른다.','연차가 쌓이면 <b>전문 분야</b>를 골라 키운다. 취재원에게 진 신세는 부탁으로 돌아온다. 판이 끝나면 후배로 이어 할 수 있다.']],
 ['회사의 정체성 · 부서 이동',`<div class="tfig"><div class="card" style="border-color:#5ad49b55"><div class="t" style="color:#5ad49b">정체성 · 진실의 수호자</div><div class="meta"><span>신뢰↑ 평판↑</span><span>소송↑ 월급↓</span></div></div><div class="card"><div class="t">스카우트 · 탐사보도팀</div></div></div>`,
  ['회사마다 <b>정체성</b>이 있다. 어용 언론·진실의 수호자·클릭 공장·야성의 언론·재벌의 친구·정론지. 이점과 단점이 분명하다.','큰 사건이 회사의 정체성과 내 성격을 바꾼다. 간부·대표는 직접 고르고, 평기자는 받아들이거나 반대한다.','부서마다 <b>이점과 단점</b>이 있다. 새 부서에 가면 인수인계 아이템과 취재원을 받고, 여러 부서를 거칠수록 평가가 잘 오른다.','다른 부서 부장이 <b>스카우트</b>하러 오면 정기 인사를 기다리지 않고 바로 옮길 수 있다.']],
 ['평가 · 평판 · 신뢰 · 능력치',`<div class="tfig"><div class="trings">${tRing(58,'var(--siren)','사내 평가')}${tRing(24,'var(--sodium)','업계 평판')}${tRing(61,'var(--good)','신뢰도')}${tRing(80,'var(--pink)','컨디션')}</div></div>`,
  ['셋 다 쉽게 오르지 않는다. 평가는 높을수록 더 오르기 어렵고, 가만두면 내려간다.','능력치는 높을수록 천천히 큰다. 능력치를 누르면 역할과 효과가 나온다.','부서마다 <b>잘 크는 능력치</b>와 특수 효과가 다르다.']],
 ['같은 부서 사람들',`<div class="tfig"><div class="card" style="border-color:rgba(119,166,255,.35)"><div class="t">사건팀 현황</div><div class="meta"><span>인원 8명</span><span>평균 7년 차</span><span>분위기 가까움</span></div><ul class="pnl"><li><span class="tg pc">부서 특성</span>단독이 자주 터지고 몸이 고되다</li></ul></div><div class="acts">${tAct('부서 사람들과','밥·노하우·같이 취재·원고 검토',1,1)}</div></div>`,
  ['"부서 사람들과"에서 동료와 밥을 먹고, 선배에게 배우고, 같이 취재한다.','부서 인원·분위기·회사 규모에 따라 행동력·아이템·컨디션 효과가 붙는다.','동료가 아이템을 넘겨주기도 하고, 내가 넘길 수도 있다.']],
 ['직급마다 다른 일',`<div class="tfig"><div class="tladder">${['수습','기자','차장','부장','부국장','국장','편집국장','사장'].map((r,i)=>`<span class="${i<2?'done':i===2?'cur':''}">${r}</span>`).join('')}</div><div class="card rkc" style="margin-top:8px"><div class="t">출입처 장악도 · 출입처 터줏대감</div>${bar(58,'var(--good)')}</div></div>`,
  ['기자·차장은 <b>출입처 장악도</b>를 쌓고, 차장·부장은 <b>제자</b>를 키우고, 부장은 <b>부서 성적표</b>로 겨룬다.','부국장~편집국장은 경쟁사와 <b>1면 대결</b>, 편집국장은 1년짜리 <b>어젠다 캠페인</b>, 사장은 <b>이사회 KPI</b>.','편집국장부터는 현장 대신 지휘와 경영을 한다.']],
 ['승진 · 이직 · 정년',`<div class="tfig"><div class="tsteps"><span class="on">작은 회사: 빨리</span><span class="cur">큰 회사: 동기 경쟁</span><span>이직: 직급 재조정</span></div></div>`,
  ['승진은 1월·7월 정기 인사. 작은 회사일수록 빨리, 큰 매체는 조건을 채워도 밀릴 수 있다.','이직하면 회사 규모에 따라 직급이 오르거나 내려간다.','다음 승진까지 기다리는 기간의 4분의 3이 지나고 실적이 좋으면 <b>발탁 트랙</b> 제안이 온다. 1년 안에 어려운 목표를 채우면 일찍 오른다.','회사가 어렵거나 오래 승진이 멈추면 드물게 <b>희망퇴직·권고사직</b> 제안이 온다.','기자 <b>정년은 60세</b>(임원 65세). 선임기자로 남거나 퇴직금으로 창간할 수 있고, 창간 대표는 70세가 넘어서도 뛸 수 있다.']],
 ['관계망 · 경쟁사 · 시장',`<div class="tfig"><div class="trel"><p><span>시청</span>${bar(64,'var(--good)')}<b class="num">+64</b></p><p><span>태산건설</span>${bar(12,'var(--red)')}<b class="num">−38</b></p></div><div class="tshare" style="margin-top:8px"><i style="width:34%;background:var(--sodium)">우리 34%</i><i style="width:41%;background:var(--siren)">경쟁사</i><i style="width:25%;background:var(--line2)">기타</i></div></div>`,
  ['기관·광고주와의 관계가 광고·자료·소송을 좌우한다.','경쟁사는 전략을 갖고 움직이고, 내가 커지면 견제한다. 어려움일수록 영리하다.','해마다 새 매체가 생기고, 돈이 바닥난 매체는 폐간된다.']],
 ['돈 · 회사 경영',`<div class="tfig"><div class="tshare" style="height:24px"><i style="width:28%;background:var(--siren)">광고</i><i style="width:40%;background:var(--good)">구독</i><i style="width:18%;background:var(--sodium)">포털</i><i style="width:14%;background:var(--dev)">사업</i></div><div class="acts" style="margin-top:8px">${tAct('행사 사업 유치','마라톤·탁구대회·축제',1)}${tAct('수익 다변화','뉴스레터·영상·멤버십',1)}</div></div>`,
  ['월급과 생활비가 매달 정산된다. "월급 쓰기 → 내 돈으로"에서 사비 출장·책 출간·부업도 할 수 있다.','집을 사거나 전세를 얻으면 대출 원리금이 매달 빠진다. "월급 쓰기 → 대출 갚기"에서 미리 갚을 수 있고, 못 내면 연체 이자 → 신용 하락 → 경매로 이어진다.','간부·사장은 포털 제휴·구독·수익 사업·지자체 행사로 돈줄을 넓힌다.','광고에만 기대면 관계망이 흔들릴 때 돈줄도 흔들린다.']],
 ['창간 모드',`<div class="tfig"><div class="tgrid2"><div class="card"><div class="t">발행인 업무</div><div class="meta"><span>영업 · 채용 · 투자 · 포털 · 사업</span></div></div><div class="card"><div class="t">기자 업무</div><div class="meta"><span>발굴 · 취재 · 기사</span></div></div></div></div>`,
  ['내 회사의 <b>대표이자 1호 기자</b>. 작은 회사일 땐 한 달에 취재와 경영을 둘 다 해야 보너스.','창업 초기엔 취재·영업·채용부터, 제휴·투자·사업·행사는 회사가 자리 잡으면 열린다.','창간부터 10주년까지 이어지는 이야기가 있다. 자금이 바닥 아래로 떨어지면 파산. 첫 2년은 창업 지원금과 박봉으로 숨통이 트인다.','창간 대표는 35세 이상에서 시작하고, 정년 없이 70세 무렵부터 은퇴를 고민한다.']]
];
// 처음 시작할 때 보는 짧은 안내 3쪽 (전체 튜토리얼은 메뉴에서)
const TUT_SHORT=[
 ['한 달 = 한 턴',['매달 <b>행동력</b>만큼 할 일을 고르고, 다 쓰면 <b>다음 달로 넘기기</b>. 고르기 귀찮으면 옆의 <b>맡기기</b>로 방향만 정해도 된다.','할 일 카드 오른쪽 노란 점이 드는 행동력이다. 무료인 일도 있다.','결과는 화면을 막지 않는 <b>카드</b>로 잠깐 떴다 사라진다. 기록 탭에서 다시 볼 수 있다.']],
 ['이달의 미션부터',['할 일 맨 위 <b>이달의 미션</b>이 이번 달에 할 일이다. 카드에 <b>미션</b> 표시가 붙은 일을 하면 된다.','미션 하나 = 평가 +0.8, 전부 하면 다음 달 행동력 +1.','미션 아래 줄에 <b>다음 승진까지 모자란 것</b>이 나온다.']],
 ['취재 → 기사 → 지면',['수습은 매체마다 다른 현장(사쓰마와리·속보 당번·현장 수습…)을 돌며 단서·취재원을 모으고 정보보고로 평가를 쌓는다.','기자가 되면 <b>취재 나가기</b>로 사실을 확인하고 <b>기사 쓰기</b>로 출고한다. 핵심 사실은 두 출처로.','매체마다 평가 기준과 <b>고유 업무</b>가 다르다. 자세한 건 메뉴 → 튜토리얼.']]];
function tutShort(i){const T=TUT_SHORT[i];const n=TUT_SHORT.length;openModal(`처음 안내 ${i+1}/${n} · ${T[0]}`,`<div class="tdots">${TUT_SHORT.map((_,k)=>`<i class="${k===i?'on':k<i?'done':''}"></i>`).join('')}</div><ul class="tpts">${T[1].map(x=>`<li>${x}</li>`).join('')}</ul>`,[i<n-1?{label:'다음',fn:()=>{tutShort(i+1);return false;}}:{label:'시작하자'},{label:'건너뛰기',cls:'ghost'}]);}
function tutorial(i=0){const TUT=TUTF();const n=TUT.length;const [t,fig,pts]=TUT[i];
  openModal(`튜토리얼 ${i+1}/${n} · ${t}`,`<div class="tdots">${TUT.map((_,k)=>`<i class="${k===i?'on':k<i?'done':''}"></i>`).join('')}</div>${fig}<ul class="tpts">${pts.map(p=>`<li>${p}</li>`).join('')}</ul>`,[...(i<n-1?[{label:'다음',fn:()=>{tutorial(i+1);return false;}}]:[{label:'시작하자'}]),...(i>0?[{label:'이전',cls:'ghost',fn:()=>{tutorial(i-1);return false;}}]:[]),{label:'닫기',cls:'ghost'}]);}
const PATCH=[ // 업데이트 내역 (간소화): [버전, 제목, [종류|한 줄], 날짜, [한눈에 보기]] — 새 버전은 맨 위
 ['1.73','전수 조사',['수정|기기를 바꿔 가며 하면 기록실 판 기록이 지워질 수 있던 문제','수정|이번 달 순위에 다른 판이 보이던 문제 · 순위표 점수 조작 막기 · 아이디 노출 막기','수정|다른 플레이어 화면에 나가는 이름·대표작의 욕설·광고 거르기','수정|저장했다 불러오면 「지난 판의 나」·「업계의 전설」이 안 나오던 문제 · 새 판에서 자동 백업이 멈추던 문제','수정|전문기자 제안 창 그림 등 문장·그림 몇 곳'],'2026.10.27',[]],
 ['1.72','이어지는 세계',['대규모|명예의 전당 — 모든 플레이어의 판이 한 순위표에','대규모|다른 세계의 기자 — 다른 플레이어가 끝낸 판의 주인공이 업계의 전설로 나온다','대규모|지난 판의 나 — 은퇴한 내 기자가 이번 판에 찾아온다 · 후계자는 사수로','개선|전문 분야가 전문기자 트랙으로 이어진다 · 시대에 따라 분야의 몸값이 바뀐다','개선|출세한 취재원 — 큰 귀띔을 주거나, 내가 감시해야 할 사람이 된다'],'2026.10.26',['명예의 전당','다른 세계의 기자','지난 판의 나']],
 ['1.71','계정과 클라우드 저장',['대규모|로그인 — 아이디·비밀번호만으로 가입, 개인 정보는 받지 않는다','대규모|클라우드 저장 — 슬롯 3칸 + 석 달마다 자동 백업, 다른 기기에서 이어 하기','개선|기록실(업적·엔딩·판 기록)이 기기끼리 합쳐진다'],'2026.10.26',['로그인','클라우드 저장','기록실 동기화']],
 ['1.7','전문기자와 대기자',['대규모|전문기자·대기자 트랙 — 관리직 대신 한 분야의 이름으로 · 대형 추적 · 대기자 칼럼 · 전용 휘장','대규모|다시 위로 — 전문 에디터(부국장급) 발탁 · 명망가 편집국장 직행 · 언론인 출신 사장','대규모|경쟁사 지분 인수 — 배당 · 이사회 · 자회사 편집국장 · 합병','대규모|승진 레이스 · 나의 후계자 · 연말 기자상 출품','개선|부서마다 그 부서다운 사건 · 반복 사건은 지난 선택을 기억 · 오보 복기 · 취재원 인생','개선|맡기기 AI가 신뢰·벌점을 따져 고른다 · 커리어를 끝내는 선택은 맡기기가 하지 않는다 · 「관계」 방향 · 광고 목표 일할 계산','개선|개인 투자 현실화 · 관계 좋은 기자는 잘 안 떠난다 · 「나」 탭에 월급 · 회사 금고·배당·크라우드펀딩 한도','수정|기사 삭제 요청·봉투 상대가 어색하던 문제 · 신세 쓰기 아이콘 · 불러오기 버그 등'],'2026.10.25',['전문기자·대기자','대형 추적','지분 인수','후계자']],
 ['1.6','신세와 줄타기',['대규모|신세 장부 — 쌓은 신세를 결정적인 순간에 쓴다','대규모|줄타기 — 맞수가 있고, 너무 가까우면 유착 위험','대규모|시의성 — 물때에 맞춰 내면 파급력 +35%','대규모|조직 운영 · 지역 TO — 내 인사가 남고, 승진 적체를 지역으로 푼다','개선|봉투 개편 · 호재·비판 반반 · 비판 기사 종류 · 지역별 평가','개선|AI가 신세·줄타기·물때·봉투·조직 운영을 읽는다 · 새 시스템 안내 · 관계 한눈에 보기','개선|같은 부서·사내 관계·관계망 화면 간소화 · 재무 탭 자금 흐름','수정|저장 후 인사가 사라지던 문제 · 오래 하면 숫자가 깨지던 문제 · 총무국 수치 등 30여 건'],'2026.10.24',['신세 장부','줄타기','시의성','조직 운영·지역 TO']],
 ['1.5','자리의 무게',['대규모|그룹 회장 · 논설위원실의 결정','대규모|새 이벤트 30여 개 · 창간의 리스크와 리턴','개선|부서장 배치 · 새 음악 8곡','수정|문장·조사 110여 곳 등'],'2026.10.23',[]],
 ['1.4','새 얼굴, 새 화면',['대규모|새 화면과 그림 300여 장','개선|팝업 새 디자인 · 데스킹 보강','조정|평판·사장 신뢰 손질'],'2026.10.22',[]],
 ['1.31','신문의 목소리',['대규모|논설위원실 · 판매국과 종이 부수','개선|기사 삭제 요청 · 길 엠블럼'],'',[]],
 ['1.3','누가 회사를 갖는가',['대규모|소유 구조 · 미디어그룹과 자매사','대규모|편집국장·사장 선출과 임기 · 그룹 회장'],'',[]],
 ['1.22','단독은 귀하다',['조정|단독이 귀해졌다','개선|이달의 미션 개편 · 종합 실력 표시'],'',[]],
 ['1.21','좋은 기사, 아픈 기사',['대규모|호재 기사 · 감시 보도','개선|관계의 혜택 · 스카우트 · 제자'],'',[]],
 ['1.2','판마다 다른 사람, 다른 세계',['대규모|기자의 길 12갈래 · 성격 · 사건 파일','대규모|언론사 정체성'],'',[]],
 ['1.1','매체마다 다른 기자 인생',['대규모|매체마다 다른 평가와 업무 · 특수 매체 규칙','개선|인용과 제목 직접 고르기 · 기자의 가치'],'',[]],
 ['1.0','정식 출시',['대규모|댓글창 · 내 기사, 그 후','대규모|시대 — 경기·선거·감염병의 흐름','대규모|함께 늙어 가는 사람들','개선|출입처별 기사 · 기관·광고주 확대'],'2026.10.20',[]],
 ['베타','4.0~7.0 · 정식 출시 전',['대규모|수습부터 사장까지 · 50개 매체 · 언론고시·스토리·창간·간소화 모드','대규모|직급별 시스템 · 나이와 정년 · 언론 시장의 흥망','대규모|이달의 미션 · 결과 카드 · 승진 발령장 · 기록실과 도감','개선|경쟁사·경영진 AI · 광고 영업 · 위기 아크'],'2026.10.19',[]],
];
const PN_CAT={대규모:'대규모 업데이트',주요:'주요 변경',수정:'버그 수정·밸런스'};
function patchNotes(cat){cat=cat||'전체';const cats=['전체','대규모','주요','수정'];
  const line=x=>{const k=x.indexOf('|');const c=k>0?x.slice(0,k):'기타';const b=k>0?x.slice(k+1):x;return (cat==='전체'||cat===c)?`<li><span class="tg pc pn-${c==='대규모'?'big':c==='수정'?'fix':'main'}">${esc(PN_CAT[c]||c)}</span>${esc(b)}</li>`:'';};
  const [v0,t0,l0,d0,h0]=PATCH[0]||[];
  const hero=PATCH.length?`<div class="pnhero"><div class="pnv">v${v0}${v0==='1.0'?' 정식':''}<small>${d0||''}</small></div><div class="pnt">${esc(t0)}</div>${h0?`<ul class="pnhi">${h0.map(x=>`<li>${esc(x)}</li>`).join('')}</ul>`:''}</div>`:'';
  openModal('업데이트 내역',`${hero}<div class="acat" style="margin:10px 0">${cats.map(c=>`<button class="achip" data-pnc="${esc(c)}" aria-pressed="${c===cat}" style="--c:var(--sodium)">${esc(PN_CAT[c]||c)}</button>`).join('')}</div>
   ${PATCH.map(([v,t,l,dt],i)=>{const ls=l.map(line).join('');if(!ls)return '';return `<details class="card pnd"${i===0||cat!=='전체'?' open':''}><summary><b>${parseFloat(v)<1?'베타 ':''}v${v}</b> · ${esc(t)} <small style="color:var(--mute)">${dt||''} · ${l.length}개</small></summary><ul class="pnl">${ls}</ul></details>`;}).join('')||'<p class="empty">해당 분류 내역이 없다.</p>'}`);
  document.querySelectorAll('#mb [data-pnc]').forEach(b=>b.onclick=()=>patchNotes(b.dataset.pnc));}
function gameMenu(){
  openModal('메뉴',`<p>${esc(S.name)} · ${esc(OUT().n)} ${rankName()} · ${years()}년 차 · ${myAge()}세. 진행 상황은 자동 저장된다.</p>`,[
    {label:'▶ 계속하기'},
    {label:'💾 저장·불러오기',fn:()=>{saveMenu();return false;}},
    {label:'❓ 도움말',fn:()=>{helpCenter('start');return false;}},
    {label:'📖 튜토리얼',fn:()=>{tutorial(0);return false;}},
    {label:'📰 업데이트 내역',fn:()=>{patchNotes();return false;}},
    {label:'⚙ 설정',fn:()=>{settingsMenu();return false;}},
    {label:'🗂 커리어 관리',fn:()=>{careerMenu();return false;}},
    {label:'🏠 타이틀로',fn:()=>{saveGame();const dv=S.dev;S=newState();S.dev=dv;}}]);
}
function settingsMenu(){const lock=S.turn-(S.modeT||0)<96;
  openModal('설정',`<p class="hint">켜고 끄는 설정은 바로 저장된다.</p>`,[
    {label:S.simple?'정통 모드로':'간소화 모드로',disabled:lock,sub:lock?`${Math.ceil((96-(S.turn-(S.modeT||0)))/4)}개월 뒤 바꿀 수 있다`:(S.simple?'모든 기능과 콘텐츠':'핵심만 빠르게'),fn:()=>{S.modeT=S.turn;S.simple=!S.simple;toast(S.simple?'간소화 모드':'정통 모드');saveGame();render();}},
    {label:`마감 직전 속보: ${ddMode()==='off'?'끔':ddMode()==='calm'?'타이머 없이':'켬'}`,sub:'가끔 실제 시간이 흐르는 속보 상황 (켬 → 타이머 없이 → 끔)',fn:()=>{S.ddMode=ddMode()==='on'?'calm':ddMode()==='calm'?'off':'on';toast(`마감 직전 속보: ${ddMode()==='off'?'끔':ddMode()==='calm'?'타이머 없이':'켬'}`);settingsMenu();return false;}},
    {label:`매체 미니게임: ${mgOn()?'켬':'끔'}`,sub:'속보 송고·큐시트·생중계·공시 해독 같은 매체별 미니게임 (끄면 일반 선택으로 처리된다 · 시간 제한은 위 마감 설정을 따른다)',fn:()=>{S.mgOff=mgOn();toast(`매체 미니게임: ${mgOn()?'켬':'끔'}`);settingsMenu();return false;}},
    {label:'하단 메뉴 순서',sub:'모바일 하단 메뉴 배치를 바꾼다',fn:()=>{navOrderMenu();return false;}},
    {label:`행동력 남김 경고: ${S.warnNext===false?'끔':'켬'}`,sub:'행동력이 남았을 때 다음 달로 넘기기 전에 묻기',fn:()=>{S.warnNext=S.warnNext===false?true:false;toast(S.warnNext===false?'경고를 껐다':'경고를 켰다');settingsMenu();return false;}},
    {label:`결과 창: ${S.resPop===false?'끔':S.simple&&S.resPop!==true?'알림만':'켬'}`,sub:'할 일 결과를 창으로',fn:()=>{S.resPop=S.resPop===false?true:S.resPop===true?false:(S.simple?true:false);toast(S.resPop===false?'결과 창을 껐다':'결과 창을 켰다');settingsMenu();return false;}},
    {label:`월말 결산 창: ${S.monthSumOff?'끔':'켬'}`,sub:'한 달이 끝날 때 평가·통장·미션·광고 목표를 한 장으로 보여 주기 (끄면 알림 한 줄)',fn:()=>{S.monthSumOff=!S.monthSumOff;toast(S.monthSumOff?'월말 결산 창을 껐다':'월말 결산 창을 켰다');settingsMenu();return false;}},
    {label:`글 분량: ${S.longTxt?'자세히':'짧게'}`,sub:'짧게: 첫 문단만 보이고 설명은 「자세히」에 접힌다 · 긴 목록은 6줄만',fn:()=>{S.longTxt=!S.longTxt;toast(`글 분량: ${S.longTxt?'자세히':'짧게'}`);settingsMenu();return false;}},
    {label:`자잘한 일 맡기기: ${S.minorAuto===false?'끔':'켬'}`,sub:'명절·회식·결혼식 같은 가벼운 일은 성향대로 알아서 고르고 카드로 알린다',fn:()=>{S.minorAuto=S.minorAuto===false;toast(`자잘한 일 맡기기: ${S.minorAuto===false?'끔':'켬'}`);settingsMenu();return false;}},
    {label:`처음 하는 일 팁: ${tipLbl()}`,sub:'할 일마다 나오는 설명 (창으로 → 한 줄 알림 → 끔)',fn:()=>{const m=tipMode();S.tipsOn=m==='on'?'toast':m==='toast'?false:true;toast(`팁: ${tipLbl()}`);settingsMenu();return false;}},
    ...(devOK()?[{label:S.dev?'개발자 모드 끄기':'개발자 모드 켜기',sub:'Claude 아티팩트에서만 보인다 · 개발자 콘솔로 시간·직급·이벤트를 바로 시험',fn:()=>{S.dev=!S.dev;try{localStorage.setItem('byline-dev',S.dev?'1':'0');}catch(e){}render();toast(S.dev?'개발자 모드 켬 · 위쪽 「개발자 콘솔」':'개발자 모드 끔');return false;}}]:[]),{label:picsOn()?'간결한 화면으로 보기':'그림 많은 화면으로 보기',sub:picsOn()?'지금: 그림 많은 화면 · 선택지·팝업 그림을 끄고 한눈에 보이게':'지금: 간결한 화면 · 선택지·팝업·할 일 카드에 그림을 넣는다',fn:()=>{picsSet(!picsOn());try{render();}catch(e){}}},{label:'소리 설정',sub:'BGM·효과음',fn:()=>{try{soundMenu();}catch(e){toast('위쪽 ♪ 버튼에서 바꿀 수 있다');}return false;}},
    ...(newbie()||fNewbie()?[{label:'모든 기능 바로 열기',sub:'경험자용',fn:()=>{setVet();toast('모든 기능을 열었다');}}]:[]),
    {label:'← 메뉴',cls:'ghost',fn:()=>{gameMenu();return false;}}]);}
function careerMenu(){
  openModal('커리어 관리',`<p>${esc(S.name)} 기자의 ${years()}년 차 커리어.</p>`,[
    ...(rookieSkipOK()?[{label:'수습 건너뛰기',sub:'남은 수습을 자동으로 보낸다',fn:()=>{skipRookie();return false;}}]:[]),
    {label:'결산 보고 마무리',sub:'퇴사 처리 후 결산 화면으로',fn:()=>{ending('자진 퇴사');return false;}},
    {label:'새 커리어 시작',sub:'지금 커리어는 지워진다',fn:()=>{openModal('정말 새로 시작할까?',`<p class="lede">${esc(S.name)} 기자의 ${years()}년 차 커리어가 사라진다. 되돌릴 수 없다.</p>`,[
      {label:'새 커리어 시작',fn:()=>{try{localStorage.removeItem(SAVE_KEY);}catch(e){}startCreate();}},
      {label:'취소',cls:'ghost'}]);return false;}},
    {label:'← 메뉴',cls:'ghost',fn:()=>{gameMenu();return false;}}]);}
function ending(kind){Q.length=0;S.phase='end';S.endKind=kind;try{metaEnd(kind);}catch(e){console.error(e);}saveGame();closeModal();}