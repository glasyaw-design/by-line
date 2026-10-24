/* 바이라인 1.6 — src/systems/career.js
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
const PATCH=[ // 업데이트 내역: ['버전','제목',['대규모|… / 주요|… / 수정|…'],'날짜',['한눈에 보기']] — 주요 사항만 짧게, 새 버전은 맨 위
 ['1.6','신세와 줄타기',[
  '대규모|조직 운영 다시 짜기: 승진·보직 해임이 실제로 남는다 — 예전엔 부서마다 차장 1자리라 승진이 「자리가 찼다」며 막히고, 부장을 해임해도 명단 정리 때 가장 선임이라며 그 사람이 다시 부서장이 됐고, 직급에 맞춰 연차가 몰래 바뀌었다. 이제 내가 한 인사는 2년 동안 자동 정리가 되돌리지 않는다. 차장 정원은 부서 크기만큼(모자라면 인건비를 들여 늘리거나 기존 차장과 맞바꾼다), 차장을 승진시키면 어느 부서 팀장으로 보낼지 고르고, 부장을 해임하면 바로 후임을 고른다. 새 「조직 운영」 화면(인사권 행사 맨 위 · 조직 탭)에서 부서마다 팀장 교체 · 차장 지명·해임 · 부서 방침(단독 우선 · 검증 우선 · 영업 강화 · 인재 육성)을 정하고, 팀장 성향(단독형·검증형·속보형·영업형…)과 방침에 따라 매달 그 부서의 단독·정정보도·광고 실적·성장이 달라진다(예상 확률이 화면에 보인다). 밀려난 사람은 서운해하고, 사이가 나쁘면 사표를 낸다. 인사팀이 가장 처진 부서와 팀장 후보를 짚어 준다',
  '대규모|지역 TO로 승진 적체 해소: 본사 차장·부장 자리는 정해져 있고 연차 찬 사람은 늘어난다 — 지역 책임자 자리(주재 차장 · 주재 부장 · 거점 지역본부장/총국장)가 그 숨통이다. ★3 이상 매체는 지역마다 주재 차장·부장, 거점 지역엔 국장급까지 자리를 둔다. 조직 탭에 「인사 TO」 현황(본사 자리·지역 자리·빈 자리·승진 대기)이 보이고, 정기 인사 때 지역 승진 발령이 나면 맨 위에 알려 준다. 인사권자는 「조직 운영 → 지역 발령으로 적체 해소」에서 대기자를 빈 지역 자리로 승진 발령하거나 인건비를 들여 지역 TO를 새로 만들고, 그러면 본사 빈자리에 다음 사람이 연쇄로 올라간다. 내가 본사에서 승진이 막혀 있으면 「지역 책임자 공모」가 와서 한 직급 올라 지역을 이끌 수 있다(행동력 +1 · 지역 평판↑ · 2년 뒤 그 직급 그대로 본사 복귀 제안)',
  '개선|영입 기자 배치와 수습의 가치: 경력·스타 기자를 뽑으면 어느 부서에 부서장·차장·평기자 중 어떤 직책으로 둘지 바로 정한다. 경력·스타는 들어올 때 편집국 분위기가 조금 처지고 3년 안에 더 좋은 조건을 찾아 떠날 수 있다. 수습 공채는 분위기를 띄우고, 공채 출신은 5년 동안 더 빨리 자란다',
  '수정|창간 준비 3/4 회사의 성격에서 3개 이상 고르면 다음으로 넘어가지 않던 문제(이제 2개까지만 체크되고 안내가 뜬다), 승진·부서 이동으로 팀이 새로 꾸려지면 내 팀원이 편집국 명부·조직도에 빠지거나 한 사람이 두 부서에 걸리고 부장이 둘이 되던 문제를 고쳤다',
  '수정|저장·불러오기: 새로 시작한 게임을 처음 불러올 때 편집국 명부·주재기자·동료가 통째로 새로 만들어져 부서장 배치·승진이 사라지던 문제, 불러온 뒤 인사가 내 팀원과 명부 중 한쪽에만 반영되던 문제를 고쳤다',
  '수정|종편 매체에서 촬영을 고르면 멈추던 오류, 아이템 제목에 같은 낱말이 겹치던 문제(「누리시 의회 의회」), 이벤트로 기자가 줄 때 고참·부서장부터 빠지던 문제를 고쳤다',
  '수정|창간 모드 인사: 매체 위상을 올려도 저장 후 불러오면 이전 위상으로 돌아가던 문제, 영입한 기자의 실력이 인사 화면에서 낮게 다시 계산되던 문제, 명부에 실제로 없는 기자가 채워지던 문제, 다른 부서의 우리 기자를 새 부서 팀장으로 데려올 수 없던 문제를 고쳤다',
  '개선|지역 TO 순환과 밸런스: 지역 책임자도 3년쯤 지나면 본사 빈자리로 돌아와 지역 자리가 다시 열린다. 적체를 반년 넘게 두면 분위기가 처지고 막힌 사람이 떠난다. 실력 55 이상 책임자가 있는 지역은 주재기자가 함께 자라고, 내가 책임자면 주재기자 제보가 올라온다. 지역 TO 신설엔 상한이 생겼고, 공모는 사내 평가가 너무 낮으면 오지 않으며 승진이 가까우면 「버틴다」를 추천한다',
  '대규모|신세 장부: 신뢰 높은 취재원을 꾸준히 만나고, 동료와 가깝게 지내고, 기관·광고주·인물의 호재를 쓰면 「신세」가 쌓인다. 새 행동 「신세 쓰기」(행동력 0)로 결정적인 순간에 쓴다 — 사실 하나 확인 보증, 오보 방어 증언, 공식 입장 바로 받기, 반년 소송 방패, 발표 일정 귀띔(물때 아이템), 고과 챙기기, 대신 뛰어 주기(행동력 +1). 가까운 곳이 먼저 「신세를 갚으라」고 청구해 오기도 한다',
  '대규모|줄타기: 기관·광고주·인물마다 맞수가 있어 한쪽의 호재를 쓰면 맞수가 서운해하고, 비판하면 반긴다(아이템 카드에 미리 보인다). 관계 75 이상은 「유착 위험」 — 신뢰가 새고 경쟁사가 유착 의심 기사를 쓴다. 적정 거리를 여러 곳과 지키면 신뢰가 조금씩 오른다. 맞수 둘이 같은 달 정반대 부탁을 하는 「양쪽의 부탁」, 가까운 인물이 발탁되면 득·낙마하면 「측근 기자」 역풍',
  '대규모|시의성: 아이템에 「물때」(국정감사·실적 발표·판결 선고·시상식 같은 때)가 붙으면 그 직전에 내야 파급력 +35%, 지나면 받아쓰기 취급. 「전개 중」 아이템은 묵히면 커질 수도 식을 수도 있다. 뉴스 가뭄(명절·한여름)엔 웬만한 기사도 크게, 뉴스 홍수(선거·대형 재난)엔 좋은 기사도 묻힌다. 물때 아이템은 그때까지 철 지나지 않는다',
  '대규모|봉투 다시 짜기: 금액이 상대 체급·아이템 크기를 따르고, 돌려주기 · 회유까지 기사에 쓰기 · 회사에 신고하고 증거로 넘기기 · 받고 수위 낮추기 · 받고 기사 접기 중에 고른다. 예전엔 받으면 반드시 들켰지만 이제 들킬 확률(약 15~35%, 받을수록·사건이 클수록 높다)이 보이고, 들키면 인정하거나 버틴다. 돌려줄 때 얻는 신뢰는 거듭할수록 줄어든다. 호재 기사엔 「홍보 촌지」가 온다',
  '개선|호재 기사: 기사에 등록된 상대 이름이 없으면 관계 변화가 전혀 없었다(예: 「가람 타이거즈 한국시리즈 진출」, 「○○대 의대 희귀질환 치료」). 이제 관련 기관·광고주(프로야구연맹·보건복지부·문화체육관광부·소방청 등)가 반기고, 관련 인물(에이스 선수·국회의장·중견기업 회장 등)과도 관계가 오른다. 상대가 붙는 호재가 열에 넷에서 아홉 가까이로 늘었다',
  '개선|전국부·지방 주재·시군 주재·자치행정부는 「지역별 평가」 카드에서 지역 버튼을 눌러 지역마다 주재기자 실력·사내 평가·기사·단독·광고 실적을 보고, 지역끼리 순위(S~D)를 매긴다. 내 담당 지역엔 ★',
  '개선|이직하면 새 회사 인사팀이 경력을 보고 부서를 배정한다. 이름값(평판 45 이상)이 있거나 간부로 가거나 더 작은 회사로 가면 원하는 부서를 고르고, 아니면 희망 부서를 요청해 받아들여질지 본다(인기 부서일수록 어렵다)',
  '조정|호재 아이템과 비판 아이템이 반반으로 들어온다(예전엔 호재 약 30%). 호재 레퍼런스 120종(조합 약 420건)을 더해 정치 합의·외교 협정·문화 수상·스포츠 기록·지역 미담·법원·의료·IT까지 고르게',
  '조정|포털 「많이 본 뉴스」 순위: 평범한 기사도 대부분 10~14위에 오르던 것을, 매체 체급과 기사 크기에 따라 30위 안팎·순위권 밖까지 나오게 했다. 10위 안은 특종급만',
  '조정|AI 기자 실력: 연차별 실력 곡선을 올리고(10년 차 평균 약 47 → 56) 일하면서 조금씩 더 큰다. 실력 좋은 부서장 밑이면 더 빨리. 기자마다 영업력이 생겨 광고 실적이 영업력을 따른다(부서 광고 현황에 표시)',
  '조정|플레이어 광고 영업: 반기 내 몫을 크게 앞서면 광고주 예산이 빠듯해져 계약이 작아지고 성사도 조금 어려워진다(영업 창에 안내). 뒤처지면 조금 수월하다',
  '수정|간결한 화면의 할 일 카드에 행동력 소모가 안 보이던 문제 — 카드마다 「행동력 1」 「행동력 2」 「무료」가 효과 앞에 붙는다',
  '수정|호재 기사에 언론중재위원회 조정·명예훼손 소송·「상대의 반격」(내용증명·입막음)·주가 하락 반발이 붙던 문제 — 칭찬받은 쪽이 정정보도를 청구하거나 소송을 걸 리 없다. 어느 경로(오보 논란·기사 삭제 요청·정체성 이벤트 등)로도 호재 기사엔 소송이 붙지 않는다. 이제 호재 기사의 실수는 「부풀린 호재 기사」(경쟁사의 바로잡기·받아쓰기 눈총)로 돌아오고, 기업 호재를 장중에 내면 주가가 오르고 기업이 반긴다',
  '수정|판 시작 목표·도전: 시작부터 이미 이룬 것(빠른 시작 편집국장의 「편집국의 사령탑」 등)이나 이번 판엔 이룰 수 없는 것(★4 매체의 「체급 올리기」, 간부의 단독 목표, 이미 포털 제휴한 회사의 「포털의 문」, 어려움이 아닌데 「강철 멘탈」, 일반 커리어의 「5년 만의 미디어그룹」, 직선제가 없는 회사의 「기자들이 뽑은 국장」 등)이 나오던 문제. 이제 이번 판에 맞는 것만 나온다',
  '수정|목표 엔딩: 갈 수 없는 엔딩(회장 선출이 없는 회사의 회장 엔딩, 방송사의 논설위원 엔딩, 회장의 정년퇴직 등)은 후보에서 뺐다. 가는 길 설명이 없던 엔딩 27개에 조건을 적고, 도감에 빠져 있던 엔딩 3개(창간 성공 · 창업자 축출 · 편집국장의 퇴장)를 넣었다',
  '수정|「사장실의 주인」 목표가 사장 임기를 마쳐도 미완료로 남던 문제. 「기자상 3관왕」 설명을 이달의 기자상으로 바로잡고, 창간 목표 「곳간이 든든하다」는 새 재무 규칙에 맞춰 50억 → 30억',
  '수정|간결한 화면에서 그림이 붙는 이벤트(사건 파일이 열렸다 · 노조 총파업 등)의 제목 윗부분이 잘리던 문제, 선택지 그림이 다시 나와 버튼이 커지던 문제. 「사건 파일이 열렸다」의 용의자 넷은 「자세히」에 접지 않고 바로 보여 준다',
  '수정|선택지 설명이 48자를 넘으면 첫 문장만 남기고 잘라 내고, 긴 효과 칩은 숨기던 것을 없앴다 — 이제 선택지 설명과 효과가 끝까지 다 나온다. 본문을 「자세히」로 접는 기준도 훨씬 길어졌을 때로 늦췄다',
  '수정|호재 아이템에 「반론」이 나오던 문제 — 취재·기사 쓰기 모든 단계에서 「서면 질의(반론 요청)」는 「공식 코멘트 요청」으로, 반론은 「코멘트」로 바뀌고, 호재 아이템엔 반론 요청을 추천하지 않는다',
  '수정|이달의 미션 「부서 분위기 +3」이 잘 안 깨지던 문제 — 부서 평균 관계로 세서 한 사람과 점심을 먹어도 평균이 0.5밖에 안 오르고, 달 중 관계가 저절로 식으면 다시 내려갔다. 이제 「부서 분위기 챙기기 2번」(점심·노하우·가르쳐 주기·고민 상담·간식은 1번, 회식은 2번)으로 센다',
  '수정|전국부 「수도권 담당」 기자가 인천·경기 기사를 쓸 때 「주재기자에게 전화」가 뜨던 문제 — 충청·호남·영남·강원·제주권 담당도 자기 권역 기사엔 전화가 뜨지 않는다',
],'2026.10.23',['신세 장부·줄타기','시의성','봉투 다시 짜기','호재·비판 반반','지역별 평가']],
 ['1.5','자리의 무게',[
  '대규모|그룹 회장의 일: 회장은 1면 회의 대신 그룹 전략 회의 · 계열사 사장단 인사 · 정·재계 회동 · 편집권 원칙 · 문화재단 · 후계 구도를 정한다. 회장 위기 6개(비자금 수사·형제의 난·재신임 이사회 등)와, 고른 후계에 따라 갈리는 회장 엔딩 3종',
  '대규모|논설위원실을 다시 세웠다: 사설 논거가 주제·논지마다 진짜 근거로 나오고, 함정은 주제에 맞춘 궤변이다. 처음 발령받으면 논객·원칙·실세 가운데 길을 고르고, 컨디션 회복·집필 수당·영향력 보상 같은 논설위원만의 이점이 생겼다. 사설 주제 14 → 30개, 대외 관계 비중은 줄였다',
  '대규모|새 이벤트 30여 개: 국장~사장 16개(노조 총파업·해임안 표결·대형 오보의 책임·AI 기사 도입 등), 그룹 회장 6개, 방송 5개(생방송 사고·앵커 오디션 등), 수습 6개(기자실의 텃세·첫 사망 사고 현장 등)',
  '대규모|은퇴 뒤 에필로그 「그 뒤의 이야기」: 대학 강단 · 1인 미디어 · 정치 · 회고록 · 귀촌 · 시민단체. 평판·신뢰가 높을수록 길이 넓다',
  '대규모|빠른 시작 2개(꼴찌 부서를 맡은 부장 · 방송사 3년 차 기자)와 새 매체 4곳(GBS 경기방송 · YTV 뉴스24 · 영자지 · 스포츠코리아)',
  '대규모|조직 운영: 부서마다 부장·차장을 직접 앉히는 「부서장 배치」. 부서장의 실력이 그 부서의 전력(S~D)이 되어 단독·정정보도·부서원 성장에 영향을 준다. 인사팀 AI가 후보를 추천하고 빈자리를 채운다',
  '대규모|옛 제자: 키운 제자가 다른 부서로 가도 관계가 남아 소식과 아이템을 물어 오고, 간부가 되면 인사 때 내 편을 든다',
  '대규모|창간의 리스크와 리턴: 창간 자본금 조건(최소 1억), 회사 규모에 따른 대표 월급과 해마다 배당, 법인세. 작은 회사가 수십억씩 벌던 문제를 막으려 수익 사업·광고·트래픽에 회사 규모만큼의 한도를 뒀다',
  '대규모|「재정」 탭: 손익계산서 · 12개월 그래프 · 자금 흐름 · 사업·계열사 손익 · 대표 보수에 재무 담당 의견까지. 「회사」 탭은 섹션을 접고 펼 수 있게 정리했다',
  '대규모|간결한 화면이 기본: 그림 때문에 성공 확률 같은 정보가 밀려나던 것을, 글자 위주의 촘촘한 화면으로. 그림 화면은 메뉴에서 켤 수 있다',
  '대규모|새 배경 음악 8곡: 직급·상황(기사 쓰기·속보·소송·새벽 취재 등)에 따라 바뀐다. 휴대폰에서도 첫 터치부터 나온다',
  '주요|수습 기간을 3개월로 통일하고 기준도 그만큼 낮췄다. 캡이 가장 뒤처진 기준을 매달 짚어 주고, 첫날 캡의 말도 매체마다 다르다',
  '개선|공세 보도: 내 부서·우리 회사·우리 지역에 맞는 상대가 나오고, 상대마다 승산과 분야별 기획 제목이 달라진다',
  '조정|광고 영업: 간부일수록 성공률이 오르고 수당은 3.5%. 지역지는 지역 단골이 유리하다. 광고국 추천은 성공률 × 계약 규모로 고른다',
  '조정|승진: 어느 직급이든 최소 반년, 부장은 출입처 장악도와 제자 키우기가 필요하다. 간편 모드에서 석 달 만에 부장이 되던 문제를 막았다',
  '조정|리더십·영업력 성장 1.5배. 생활비는 월급의 85%를 넘지 않고, 지역지는 생활비가 덜 든다',
  'AI|라이벌: 같은 계열의 비슷한 매체에서 끝까지 같은 얼굴로 따라오고, 내가 물먹을수록 빨리 큰다',
  'AI|추천·「한 달 맡기기」: 창간 회사는 자금 사정에, 논설위원은 사설에, 그룹 회장은 회장의 일에 맞춰 고른다. 후계 같은 큰 결정은 멈추고 직접 고르게 한다',
  '수정|나이: 빠른 시작 동료가 나보다 어리던 문제, 동료가 몇 년이 지나도 나이를 안 먹던 문제. 이제 해마다 나이를 먹고 60세에 정년퇴직한다',
  '수정|휴대폰 화면: 능력치 이름이 잘리던 것, 맨 위 정보줄이 두 줄로 접히던 것, 두 칸 선택지 글자가 세로로 쪼개지던 것',
  '수정|문장: 이름·제목 뒤 조사 110여 곳, 기사 제목의 같은 문구 반복, 「○○ 기자 기자」 바이라인',
  '수정|조직 탭 수습기자 0명 표시, 재정 탭 NaN, 인사가 사라지던 문제, 수습 인건비 할인이 계속 쌓이던 문제, 사장에게 오던 스카우트 제안',
],'2026.10.23',['그룹 회장·논설위원','새 이벤트 30여 개','창간의 리스크와 리턴','부서장 배치·새 음악']],
 ['1.4','새 얼굴, 새 화면',[
  '수정|계열사 전출: 자매사 직급 체계에 같은 직급이 없으면 한 단계 낮은 자리로 옮겨지던 문제. 이제 같은 직급 이상 자리가 있을 때만 전출 제안이 온다',
  '조정|평판: 높을수록 덜 오른다(67부터 서서히). 몇 년 만에 100을 찍던 문제를 완화했다',
  '조정|사장의 신뢰: 사장은 기사를 쓰지 않아도 회사 보도 품질만큼 신뢰가 받쳐 준다. 경영만 하다 신뢰가 바닥나던 문제',
  'AI|차장의 대리 데스킹: 부장이 손 못 댄 초고를 무작위로 킬하던 것을, 완성도가 낮거나 문제가 많은 초고만 거르고 단독은 살리도록 바꿨다',
  '대규모|새 화면: PC는 장면 띠를 가로로 크게 펼치고, 가운데에 그림 카드로 된 할 일, 아래 줄에 내 얼굴·진급 막대·평가 게이지와 큰 「다음 달로」 버튼을 두었다. 상단 바에 회사 건물·내 얼굴·컨디션 막대가 보이고, 팝업은 그림이 맨 위에 크게 뜬다. 「나」 탭은 캐릭터 시트처럼 얼굴과 진급 막대, 능력치 묶음(아이콘·막대)으로 바뀌었고 엔딩 화면도 새로 꾸몄다',
  '수정|얼굴과 이름: 강동욱·노다은처럼 이름과 얼굴의 성별이 어긋나던 문제. 동료·부서원·취재원·초고 작성자 얼굴이 이름에 맞는 성별로 나온다',
  '대규모|팝업 새 디자인: 그림이 맨 위에 크게 뜨고 제목이 그림 위에 걸린다. 누가 한 말인지 얼굴과 말풍선으로 보이고, 「바뀐 것」은 아이콘 달린 색깔 칩, 결과는 큰 숫자 타일(▲▼)로 바뀌었다. 선택지마다 그림이 붙고 추천 선택지는 금색으로 빛난다. 그림이 없는 팝업은 배지 머리띠로 꾸민다',
  '대규모|첫 화면: 새 대표 그림이 화면 가득 깔리고 금빛 로고와 「바이라인」 제목, 이름 칸과 큰 「새 게임」 버튼, 그림이 들어간 시작 방식 6개 카드로 바뀌었다. 휴대폰용 세로 그림도 따로 있다',
  '수정|좁은 화면: 창이 좁아지면 상단 바가 여러 줄로 접히고, 분야 칩이 잘리지 않게 줄바꿈된다. 1280~1600px 화면에서 상단 바가 한 줄로 정리된다',
  '주요|팝업 그림: 자주 뜨는 팝업 24종(출입처 돌기·아이템 발굴·사건 파일·출고 완료·단독·결산·편집 회의·1면 회의·순시·채용·포털·행사·인사 발표·송년회·명절 등)에 전용 그림, 선택지에 전용 아이콘 16종(추천·위험·돈·관계·신뢰·법·단독·취재원·상사·미루기·지금 바로 등)',
  '수정|국장급 데스킹에서 호재 기사(흑자 전환·수출 돌파 등)를 의혹 기사처럼 「의혹이 커지고 있다」로 시작하던 문제',
  '대규모|데스킹 보강: 새 문제 유형 7가지 — 미성년 피의자·유족 실명 노출, 낙인·차별 표현, 반론 없는 단정, 조간 시제(오늘·내일), 억·조·만 단위 실수, 호재 기사의 보도자료 베끼기·판촉 문구, 불리한 사실 빼기. 꼼꼼히 볼 때 가끔 엠바고 요청·광고국의 전화·마감 직전 반론·후배의 고집·다들 쓰는 보도자료 기사 같은 일이 끼어든다',
  '주요|글꼴: 메이플스토리체로 바꿨다. 제목·버튼·숫자는 굵게(Bold), 본문은 가늘게(Light)',
  '대규모|지원자 프로필 새 화면: 왼쪽에 내 얼굴·이름·능력치 육각형, 오른쪽에 그림 카드로 시작 방식·플레이 방식·나이·난이도·전공·대표 스펙을 고른다. 위에 4단계 표시, 맨 위에 「바로 시작하기」',
  '대규모|그림 276장: 엔딩 37종이 12가지 엔딩 그림으로 바뀌었다. 장면 띠는 부서·매체·계절·시대에 맞춰 32곳이 늘었다(국회·특파원 사무실·증권가·병원·야구장·축구장·논설위원실·지국·부조정실·태풍 현장 등)',
  '주요|팝업 그림: 위기 15종과 시대 25종에 전용 그림이 생겼다. 논설·판매·이사회·편집국 선거·언론중재 팝업에도 장면 그림이 뜨고, 질책·회식·방송·원고·사표·승진·출장 그림이 더해졌다',
  '주요|얼굴과 아이콘: 상단 바에 내 얼굴(누르면 남·여 전환, 연차와 컨디션에 따라 표정이 바뀐다)과 회사 건물이 보인다. 앵커·검사·판사·의원·보좌관·변호사·홍보 임원·의사·교수·유튜버·형사·외신 기자 취재원에 얼굴이 생겼다. 능력치·평가·이력·매체·부서 아이콘과 「길」 엠블럼 새 그림',
  '대규모|남은 화면 새 단장: 편집국·브리핑룸·법정·국회·윤전실·사장실·옥상·술자리 등 장면 배너 15장을 새 그림체로 다시 그리고, 면접장·새벽 경찰서·필기시험장을 더했다. 로딩 화면, 언론고시 지원(매체마다 건물 그림), 시험 팝업, 기록실, 메뉴(그림 타일), 회사 탭 머리 그림이 바뀌었다',
  '조정|사장의 신뢰: 회사 보도 품질이 받쳐 주는 바닥을 조금 더 올렸다',
  '개선|할 일 아이콘 75개와 인물 얼굴 160여 개(주인공·역할·동료)를 원본 해상도로 다시 뽑아 선명하게 했다',
  '개선|인사권 행사·기자 채용처럼 여러 명을 고르는 화면: 얼굴·이름·실력 막대·꼬리표만 담은 2열 카드로 줄이고, 긴 설명은 접었다. 고른 사람 수와 실행 버튼이 아래에 붙어 있어 목록이 길어도 바로 누를 수 있다',
  '조정|월급·생활비: 직급이 오를수록 월급이 너무 가파르게 오르던 것을 완만하게(사장 2.8배→2.1배, 전체 약 8%↓) 하고, 생활비를 직급에 따라 140만~340만 원(물가에 따라 조금씩 오름)으로 현실화했다. 사장이 매달 1,000만 원 넘게 모으던 문제',
  '조정|인건비: 기자마다 다르게 나간다 — 수습 약 600만, 기자 900만, 10년 차 이상 1,200만, 스타 기자 1,500만 원(월급·4대 보험·취재비 포함). 채용 후보 카드에 월 인건비가 보인다',
  '수정|지원자 프로필: 능력치 미리보기에 나이 효과(상식·친화력·체력)가 빠져 있던 문제. 나이를 고르면 바뀌는 능력치가 바로 보인다',
  '수정|팝업이 화면보다 길면 아래쪽이 잘려 버튼을 누를 수 없던 문제(총무국 등)',
],'2026.10.22',['새 화면과 그림 300여 장','팝업 새 디자인','데스킹 보강']],
 ['1.31','신문의 목소리',[
  '대규모|논설위원실: 국장급에서 논설위원실로 옮기거나, 편집국장 연임에 실패했을 때 논설실장으로 갈 수 있다. 기사 대신 사설을 쓴다 — 주제·논지(찬성·반대·절충)·논거 두 개·맺음말. 그럴듯한 약한 논거(허수아비·성급한 일반화·출처 불명·감정 호소·미끄러운 비탈)를 걸러야 완성도가 오르고, 같은 주제에 지난번과 다른 입장을 쓰면 「말 바꾸기」로 남는다. 영향력을 쌓아 논설실장·주필로 오른다. 논설회의·외부 필진·사설 전쟁·신년 사설·대주주의 「사설 한 줄」 요청·위원들의 연판장. 새 엔딩 2개',
  '대규모|판매국·종이 부수: 신문사는 판촉·구독료·지국 지원·디지털 전환을 정한다(사장). 지국망과 유가율을 관리하고, 매년 11월 ABC 부수 공사 결과가 다음 해 광고 단가를 정한다. 지국장 요구·용지값 폭등·경쟁지 판촉·절독 운동·독자 늘리기 할당·자매지 공동 인쇄. 기본 정책은 이전과 똑같고, 어떤 정책도 공짜가 아니다. 사장이 아니면 AI 판매국장이 회사 사정에 맞춰 정한다',
  '대규모|기사 삭제 요청: 무죄 확정·오래된 일반인 기사·피해자 신원·기업·정치인·연예인이 지난 기사를 지워 달라고 한다. 지우기·비식별 처리·후속 보도·그대로 두기 가운데 고르고, 버티면 언론중재위 조정과 소송이 온다. 광고주 기사는 지워 주고 시민 요청은 버티면 이중잣대 비판을 받는다. 편집국장은 회사 지침(원칙·유연·위원회)을 정한다',
  '대규모|재정: 회사 매출이 구독·판매, 광고, 디지털·포털, 사업·행사, 기자 영업, 대주주·계열 지원으로 나뉘어 회사 탭에 보인다. 대기업 계열은 계열사 광고, 사주 일가는 경영 지원, 지역 기업은 지역 광고·협찬, 공영은 수신료·출연금, 재단은 출연금이 들어오고, 대주주와 사이가 나빠지거나 계열사를 건드리면 줄어든다. 자금이 바닥나면 대주주가 증자로 메우지만 사이가 나쁘면 조건이 붙는다',
  '주요|「길」 엠블럼: 기자의 길 8개(감시견·약자의 목소리·검증·선동가·어용·유착·기레기·청부)에 엠블럼이 생겼다. 길의 부름 팝업, 수첩의 길 카드, 길 목록에 보인다',
  '주요|도전 과제 배지: 도전 과제 15개에 배지 그림이 생겼다. 기록실·새 판의 도전 고르기·수첩의 「이번 판의 도전」에 보인다',
  '주요|칭호 배지: 이야기 칭호 30개에 배지 그림이 생겼다. 수첩의 「나의 이야기」에 받은 배지와 아직 못 받은 배지(흑백)가 모이고, 이야기를 끝내면 배지가 크게 뜬다',
  '주요|그림: 할 일 버튼 75개에 그림 아이콘이 붙고, 이벤트 팝업 맨 위에 상황 그림(사건·법정·돈·기자회견·태풍·화재·선거 등)이 뜬다. 부서원·팀원 목록에 얼굴이 생겼고(관계에 따라 표정이 바뀐다), 한 번 해 본 일은 버튼 설명 줄이 접혀 아이콘과 이름만 남는다',
  '주요|글 줄이기: 팝업은 첫 문단만 보이고 나머지 설명은 「자세히」에 접힌다. 긴 목록은 좋은 일·나쁜 일 6줄만 먼저 보이고, 선택지 아래 긴 설명 대신 숫자·화살표만 남는다. 설정 → 「글 분량」에서 자세히로 되돌릴 수 있다',
  '주요|자잘한 일 맡기기: 명절·송년회·결혼식·체육대회처럼 가벼운 일은 성향과 컨디션에 맞춰 알아서 고르고 카드 한 장으로 알린다(설정에서 끌 수 있다)',
  '개선|처음 하는 일 팁: 빠른 시작이나 두 번째 판부터는 창 대신 한 줄로 뜬다. 창으로 볼 때도 첫 문장만 보이고 나머지는 접힌다. 설정에서 창으로·한 줄 알림·끔을 고른다',
  '수정|월말 결산 미션 줄이 용어 밑줄 때문에 세 줄로 쪼개지던 문제',
  '주요|취재 지시: 차장(한 달 1건 · B등급 이하)·부장·부국장·국장(한 달 2건). 나보다 직급이 낮거나 연차가 적은 기자에게만 지시할 수 있다. 기자 성향에 따라 꼼꼼하거나 빠르거나 단독을 키운다',
  '주요|편집국장 기획 하명: 부장에게 탐사 기획·어젠다 연계·이슈 총력 대응·대주주·광고주 우호 기획을 내려보낸다. 부서 실력·부장과의 관계·부장 성향이 결과를 가르고, 우호 기획엔 기자들이 반발한다. 내가 부장일 땐 위에서 하명이 내려온다',
  '주요|빠른 시작: 회사를 고른 뒤 부서를 고른다(3년 차·부장은 소속 부서, 국장·편집국장은 출신 부서). 첫 화면에도 빠른 시작이 생겼다',
  '주요|미션: 차장~국장 「후배에게 취재 지시」, 편집국장 「기획 하명」, 평기자 「뻗치기」, 논설위원 「사설 쓰기」. 창간 대표의 취재 지시 미션이 더 자주 나온다',
  '조정|광고 영업: 성공률이 능력치에 따라 95%까지 오르던 것을 40~65% 안팎으로. 같은 달 여러 번 돌면 떨어지고, 반년 안에 계약한 회사는 예산이 없다. 계약 금액은 약 30% 줄고 영업 수당은 1.5%로. 개인 광고 목표도 함께 낮췄다. 창간 모드 영업도 같은 방향으로',
  '조정|하리꼬미: 수습 체력 부담 18→13, 허탕이어도 관찰 메모가 남는다. 평기자도 부서마다 다른 장소에서 뻗칠 수 있고, 성공하면 단독 단서를 잡는다',
  '조정|전국부·주재기자: 중앙일간지 ★5 주재기자 12→20여 명, ★4 9→18명, 지역일간지 ★3 시·군 주재 8→16명 등 지역 취재망을 현실에 맞게 늘렸다. 편집국장 선거에서 전국부·주재기자들도 한 표를 갖는다',
  '수정|부장 데스크: 데스킹을 시작한 초고는 초고함에서 빠진다. 보강 지시한 초고는 후배가 고쳐 월말에 스스로 출고한다',
  '수정|캡 미션에 아직 잠긴 일(하리꼬미 등)이 나와 깰 수 없던 문제',
  '수정|직급에 맞지 않는 호칭: 내가 부장인데 「부장에게 넌지시 말한다」가 뜨는 것처럼 상사 호칭이 직급과 어긋나던 문구들',
  '개선|AI: 후배가 먼저 아이템을 들고 와 「제가 해 봐도 될까요?」라고 묻는다(받아 주면 취재 지시 1건). 부장 성향에 맞는 하명은 더 잘 받는다. AI 판매국장이 자금 사정·부수 추세·ABC 결과에 맞춰 정책을 바꾸고, 고시 위반으로 걸린 뒤엔 조심한다. 공격적 판촉을 하면 경쟁지가 신고해 걸릴 가능성이 커진다. 경쟁지가 공격적 판촉을 걸어 온다. 삭제를 거절당한 기업은 광고를 줄이고 정치인은 조정을 신청한다. 경쟁지가 우리 사설에 반박 사설을 낸다'],
'2026.10.22',['논설위원실','판매국','기사 삭제 요청']],
 ['1.3','누가 회사를 갖는가',[
  '대규모|소유 구조: 회사마다 대주주가 있다 — 대기업 계열, 사주 일가, 지역 기업, 분산 지분, 사원·독자 주주, 재단, 공영, 독립. 대주주 계열사를 건드리는 기사엔 위에서 전화가 오고, 그대로 쓸지·누그러뜨릴지·접을지 골라야 한다',
  '대규모|미디어그룹과 자매 언론사: 대한미디어그룹·중앙미디어그룹·경제신보미디어그룹·서울시보미디어. 자매사와 공동 기획, 자매 방송 출연, 그룹 내 전출, 자매사가 내 단독을 먼저 내보내는 일, 그룹 차원의 보도 조율이 생긴다. 자매사끼리는 기자를 빼 가거나 사설로 공격하지 않는다',
  '대규모|편집국장·사장 선출: 회사마다 방식이 다르다 — 대주주 임명, 임명동의 투표, 기자 직선, 이사회 표결, 여야 추천 이사회 공모. 표를 가진 사람마다 관계·공약·자리 약속·대주주 뜻·실적을 따져 자기 셈법으로 찍는다. 상대 후보도 매번 움직인다',
  '대규모|임기: 편집국장·사장 자리는 회사마다 한 명이고 임기가 있어, 임기가 끝나야 자리가 열린다. 편집국장은 임기가 끝나면 연임 심사를 받고 떨어지면 국장으로 돌아간다. 사장은 편집국장 임기를 한 번 이상 마친 사람만 나설 수 있다. 편집국장 임기 중엔 못 나서고, 임기를 마칠 때 연임과 사장 출마 가운데 고른다. 문턱도 편집국장보다 높다',
  '대규모|그룹 회장: 계열사가 많은 미디어그룹엔 회장 자리가 있다. 사주 일가 그룹은 세습이라 오를 수 없고, 대기업 계열은 자리가 비어야 열리며, 나머지는 이사회가 뽑는다',
  '대규모|창간 모드: 행사 법인·영상 제작사·아카데미·연구소·마케팅 대행사·자매 매체·출판사 같은 계열사를 세우고 키우거나 판다. 셋이 되면 「OO미디어그룹」으로 출범해 그룹 회장이 된다. 지분이 절반 아래면 투자사 표가 대표를 흔들고, 주주총회에서 재신임이 부결되면 공동대표 체제가 된다. 기자가 늘면 편집국장을 임명할지·임명동의제로 할지·직선제로 할지 정한다',
  '개선|자리 기록: 다른 회사로 옮겼다 돌아와도 그 회사 편집국장·사장과 임기가 이어지고, 떠난 사이 임기가 끝났으면 후임이 앉아 있다. 같은 그룹 안에선 대주주 관계와 회장 자리를 함께 쓴다. 내가 사장이 되며 비운 편집국장 자리엔 회사 방식대로 후임이 정해진다',
  '개선|직무대행: 자리가 비었는데 조건이 조금 모자라면 반년 동안 직무대행이 맡고, 그 사이 조건을 채우면 다음 인사 때 나설 수 있다',
  '개선|선거 AI: 마음을 못 정한 표는 대세를 따라가고, 밀리는 상대 후보는 흑색선전을 건다(신뢰가 높으면 역풍). 대주주에게 한 충성 약속을 어기면 배신으로 기억한다',
  '조정|광고주의 「회장님 사진」 요청이 너무 자주 오던 것을 1년에 한 번으로',
  '대규모|빠른 시작: 3년 차 기자, 10년 차 부장, 편집국장 선거를 앞둔 국장, 갓 취임한 편집국장으로 바로 시작한다. 경력에 맞는 취재원·아이템·저축·출입처·제자·라이벌을 갖추고 시작한다. 고르기 전에 처음부터 할 때와 비교한 좋은 점·아쉬운 점을 보여 준다',
  '대규모|지금 할 일: 할 일 목록 맨 위에 다음에 할 일 하나와 이유가 뜬다. 누르면 바로 한다',
  '주요|용어 사전: 야마·사쓰마와리·엠바고 같은 말에 밑줄이 그어지고, 누르면 뜻이 나온다',
  '주요|끝나도 남는 것: 판이 끝나면 엔딩에 따라 다음 판에 작은 선물이 남는다',
  '주요|새 시대: 광고 한파·언론 규제 정국·언론계 스캔들. 판 초반에 이번 판의 시대 예고가 뜬다',
  '주요|라이벌 연대기: 라이벌도 해마다 승진하고, 우리 회사로 옮겨 오기도 하며, 편집국장·사장 선거에서 상대 후보로 맞붙는다',
  '주요|감 잡기 훈련: 녹취 편집·사진 고르기·제목 대결. 12초 안에 고른다',
  '주요|새 도전 과제 6개: 무결점 편집국장, 대주주에 맞선 사장, 5년 만의 미디어그룹, 기자들이 뽑은 국장, 다시 일어선 국장, 오랜 라이벌을 꺾다',
  '개선|같은 이벤트가 다시 오면 계절·시간·상황 묘사가 바뀌어 다르게 읽힌다',
  '개선|한 달 맡기기도 「지금 할 일」을 먼저 챙긴다',
  '개선|할 일 화면: 추천·미션 표시를 카드 모서리 배지로 옮기고, 미션 줄을 누르면 해당 일을 바로 한다',
  '주요|대주주 면담: 국장 이상은 대주주 쪽을 만나 관계를 다질 수 있다. 너무 잦으면 「대주주 줄」이라는 뒷말이 붙는다',
  '주요|AI 개선: 한 달 맡기기가 시한이 급한 단독·마감 기사부터 챙기고, 호재 기사가 몰리면 비판 기사로 균형을 잡고, 얼어붙은 부서엔 회식을 쏜다. 경쟁사는 호재 기사가 잦으면 「기업 홍보지」라고 사설로 공격하고, 내가 공들인 광고주는 덜 건드린다. 라이벌은 거의 다 확인한 단독은 가로채지 못하고 추격만 한다. 부서 동료는 성향대로 호재 기사·교차 확인·단서 넘기기로 거들고, 제자는 출입처 얘기를 먼저 들고 온다',
  '대규모|능력치 개편: 시작 능력치가 크게 올랐다. 영업력(광고·협찬 영업)과 리더십(차장부터 부서원 관계·성장, 기자 빼 가기 방어)을 새로 만들었다. 이름만 있던 인터뷰는 탐문·뻗치기·인용 기사에, 제목 감각은 조회수·데스킹에 실제로 쓰인다',
  '대규모|성격 재조정: 효과가 없던 완벽주의·글쟁이·겁이 많음의 장점이 제대로 들어간다. 술고래·인싸·독고다이는 취재원 관계에도 영향을 준다. 워커홀릭은 대가가 커졌다. 새 성격 영업통·골목대장',
  '수정|결과 카드: 결산이나 다른 팝업을 읽는 동안 오른쪽 아래 결과 카드가 저절로 사라지던 문제. 이제 팝업이 닫힌 뒤부터 시간이 흐르고, 여러 장이 겹치면 차례로 보여 준다. 지나간 카드는 기록 탭의 「결과 카드」에서 전문을 다시 볼 수 있다'],
'2026.10.22',['소유 구조','선출','미디어그룹']],
 ['1.22','단독은 귀하다',[
  '대규모|단독·특종의 무게: 단독 아이템이 예전처럼 쉽게 들어오지 않는다. 같은 취재원이 매달 제보하지는 않고, 단독을 자주 내면 타사가 바짝 붙어 같은 날 같은 기사를 내기도 한다. 특종과 대특종은 확인이 탄탄하고 파급력이 큰 기사에만 붙고, 한번 터뜨리면 한동안은 다시 나오기 어렵다. 대신 터졌을 때의 보상이 커졌다',
  '대규모|이달의 미션 개편: 단독 몰이 미션을 줄이고 감시 보도, 호재 기사, 균형 잡힌 지면, 기관·광고주 관계, 부서 분위기, 제자 키우기 같은 미션이 고르게 나온다. 창간 모드와 간소화 모드도 함께 바뀌었다',
  '주요|창간 모드: 편집국 기자들의 단독도 드물어졌다',
  '개선|회사 특성: 언론사를 고를 때와 회사 탭에서 특성의 실제 효과가 숫자로 보인다',
  '개선|종합 실력: 수첩 능력치 옆에 동료 기자와 같은 잣대의 종합 실력이 보이고, 부서 평균·데스크 추정치와 견줘 볼 수 있다',
  '개선|취재를 마치면 결과를 차분히 볼 수 있는 「편집국 복귀」 창이 뜬다. 인터뷰 녹취를 얻었는지도 따로 적힌다',
  '개선|금액 표기: 1억이 안 되는 돈은 만 원 단위로. 광고 계약 금액과 회사에 실제로 들어오는 돈이 다른 이유를 계약 창에 적었다',
  '개선|단독 추격 시한: 「약 2달 · 행동 14번」 대신 「이번 달 말까지 · 다음 달 말까지」처럼 월말 기준으로만 센다. 행동을 쓴다고 시한이 줄지 않고, 막 얻은 단독이 그달 말에 바로 낙종되지 않는다. 타사 추격으로 시한이 당겨지면 알려 준다',
  '수정|연간 결산: 단독·1면이 마이너스로 나오던 문제. 올해 낸 수를 보여 주고 전년과 견준다. 평가·평판은 지금 값과 올해 변화를, 통장 대신 저축·투자까지 합친 자산을 보여 준다'],
'2026.10.21',['단독은 귀하다','미션 개편','회사 특성 수치']],
 ['1.21','좋은 기사, 아픈 기사',[
  '대규모|호재 기사: 신기록·흥행·성과·미담 같은 좋은 소식도 기사가 된다. 부서마다 호재 아이템이 넉넉히 들어오고, 쓰면 상대 기관·광고주와 사이가 좋아지고 광고 영업이 수월해진다. 다만 업계 평판은 크게 오르지 않고, 호재만 몰아 쓰면 홍보성 기사라는 눈총을 받는다',
  '대규모|감시 보도: 확인을 탄탄히 한 비판 기사는 평판과 신뢰를 더 크게 남기고, 기사를 본 내부자의 제보로 이어지기도 한다. 힘 있는 상대일수록 보상도, 대가도 크다. 기자상은 감시 보도 쪽에 더 가깝다',
  '대규모|관계가 좋을 때: 기관·광고주·인물과 사이가 좋으면 발표회 초대, 사전 설명, 먼저 온 인터뷰, 협찬 제안이 찾아온다. 사이가 좋은 곳의 비판 기사는 그만큼 쓰기 어려워진다',
  '대규모|다른 회사의 스카우트: 이름이 알려지면 다른 회사가 먼저 손을 내민다. 옮길지, 연봉 협상 카드로 쓸지, 남을지 고른다',
  '주요|제자: 제자는 회식·코칭·데스킹으로 키운 만큼 자란다. 관계가 깊으면 부서를 옮기거나 회사를 옮길 때 따라오고 싶어 한다',
  '주요|부서 분위기: 「월급 쓰기 › 생활과 사람」에서 부서 회식이나 간식으로 분위기를 챙길 수 있다',
  '개선|데스킹 초고와 제목, 댓글이 기사 성격에 맞게 나온다. 넘기기 반응이 내 직급에 맞게 나온다',
  '수정|후속 아이템의 확인 상태, 방송 리포트의 현장 그림, 부장일 때 팀 직급과 윗선 표시, 오보 안내 문구 등 여러 문제를 고쳤다'],
'2026.10.21',['호재 기사','감시 보도','관계가 좋을 때','스카우트','제자']],
 ['1.2','판마다 다른 사람, 다른 세계',[
  '대규모|기자의 길 통합: 기자 유형과 좋은 길, 어두운 길을 기자의 길 하나로 묶었다. 어떻게 일하느냐가 길을 고르고, 가까운 길의 부름이 먼저 온다. 길에 들어서면 업계가 붙이는 이름과 그 길만의 고유 업무가 생기고 기사 쓰는 방식도 달라진다',
  '대규모|어두운 길과 좋은 길: 어용·기레기·유착·선동·청부의 길은 빨리 크게 해 주지만 신뢰가 깎이고 노출 위험이 쌓인다. 감시견·약자의 목소리·검증의 길은 신뢰를 쌓지만 권력의 보복과 소진이 따른다. 끝까지 가느냐, 무너지느냐는 내 선택에 달렸다',
  '대규모|성격: 판을 시작할 때 성격을 고른다. 술고래, 완벽주의, 정의감 과잉, 독고다이… 이점과 약점이 함께 오고, 큰일을 겪으면 사람이 변한다',
  '대규모|사건 파일: 판마다 진실이 바뀌는 장기 사건. 단서를 모아 몸통을 지목한다. 단서가 늘 믿을 만한 건 아니고, 상대도 가만있지 않는다. 경쟁사도 뒤를 쫓는다',
  '대규모|언론사 정체성: 어용 언론부터 진실의 수호자, 팬덤 매체, 풀뿌리 언론, 공영 언론까지. 회사마다 정체성과 분명한 이점·단점이 있고, 인수나 쇄신 같은 큰 사건이 회사를 바꾼다. 창간 모드에서는 직접 고른다',
  '대규모|이번 판의 세계: 정부·야당·재벌·검찰·시민사회의 힘이 판마다 다르게 시작하고 내 기사로 움직인다. 정권이 바뀌기도 한다. 진영마다 나를 따로 평가한다',
  '대규모|법정 공방: 소송이 수 싸움이 됐다. 취재 자료, 증인, 여론전, 합의로 맞선다',
  '대규모|전문 분야: 연차가 쌓이면 데이터·탐사·방송·칼럼·르포 가운데 하나를 골라 키운다',
  '대규모|부서를 옮길 이유: 부서마다 이점과 단점이 보이고, 옮기면 확실한 보상이 따른다. 다른 부서에서 스카우트 제안이 오기도 한다',
  '대규모|한 달 맡기기: 「다음 달로 넘기기」 옆 「맡기기」를 누르고 단독 위주·안전하게·출세·돈 가운데 방향만 고르면, 이번 달 할 일을 알아서 하고 결과를 한 장으로 보여 준다. 길 제안이나 소송, 승진 같은 큰 선택이 오면 멈추고 직접 고르게 한다',
  '대규모|AI: 윗선·동료·라이벌이 내가 걷는 길과 회사의 정체성을 읽고 움직인다. 라이벌도 자기 길을 걷는다',
  '주요|신세 경제 · 계보 이어 하기: 취재원에게 진 신세는 부탁으로 돌아오고, 판이 끝나면 후배로 이어 할 수 있다',
  '주요|매체에 맞는 이야기: 사건과 길, 경쟁 기자의 움직임이 매체와 부서에 맞게 나온다',
  '주요|새 매체 · 새 엔딩 · 새 업적',
  '주요|간소화 모드 조정: 곁가지 이벤트와 감점이 줄고, 미니게임은 처음부터 꺼져 있다',
  '개선|발탁 트랙: 조건을 채우면 정기 인사를 기다리지 않고 윗선이 부른다. 여는 시점은 조금 늦췄다',
  '개선|화면: 능력치를 작은 칸으로 모으고, 기자의 길을 위로 올리고, 성격·부서·전문 분야를 한 카드로 묶고, 못 딴 업적은 접어 뒀다. 넓은 화면에서는 할 일 분야 버튼을 두 줄로 줄이고, 모바일에서는 길 목록과 경력 칸을 촘촘하게 다듬어 덜 내려도 되게 했다',
  '개선|난이도: 쉬움·보통·어려움의 차이를 확실하게 벌렸다. 승진 속도와 월급, 오보 위험뿐 아니라 이름값이 오르는 속도, 매체 목표, 경쟁사·라이벌·소송 상대의 기세, 어두운 길이 들키는 속도까지 난이도를 따른다',
  '개선|이달의 미션: 매체마다 다른 할 일 이름이 안내에 그대로 나오고, 이번 달 안에 해낼 수 없는 미션은 나오지 않는다. 단독 미션이 있는 달엔 단독이 더 잘 붙고, 간부의 신뢰 미션은 지키기로 바뀌었다',
  '개선|튜토리얼에 새 시스템 안내를 더했다',
  '수정|매달 일어나야 할 이벤트 일부가 뜨지 않던 문제, 빠른 데스킹이 미션에 잡히지 않던 문제, 데스크 제목에 같은 말이 두 번 붙던 문제를 고쳤다'],
'2026.10.21',['기자의 길 통합','어두운 길과 좋은 길','성격 · 사건 파일','언론사 정체성','세계 · 법정 · AI']],
 ['1.1','매체마다 다른 기자 인생',[
  '대규모|매체마다 다른 평가와 일하는 법: 통신사는 송고 건수와 다른 매체가 받아 쓴 채택 수, 지상파·종편은 그림 있는 리포트, 보도전문채널은 생중계, 종합일간지는 1면과 면 톱, 경제지는 기사가 움직인 주가, 지역지는 지역 유지와의 관계, 영자지는 외신 인용, 인터넷 언론은 조회수, 주간지는 이번 호 커버스토리로 평가받는다. 매달 성과가 평가로 이어진다',
  '대규모|매체 고유 업무: 통신사는 확인된 사실 하나로 바로 단신 송고, 방송은 그림이 없으면 앵커 단신이라 촬영을 나가야 하고, 종편은 시사 토크에 출연한다. 보도전문채널은 중계차를 타고, 일간지는 경쟁지 가판을 보고 물먹은 기사를 쫓는다. 경제지는 지라시와 공시를 뒤지고, 지역지는 단체장·지방의원·건설업자·상공인 네 사람 사이에서 줄을 탄다. 영자지는 외신 기자클럽, 인터넷은 실시간 이슈, 주간지는 커버 기획회의',
  '대규모|특수 매체 고유 규칙: 교육저널은 입시 달력과 학부모 메일함, 의약신보는 엠바고를 지킬지 깰지, 전자일보는 협력사를 돌며 맞추는 공급망 퍼즐, 법정신문은 판례가 바뀌는 판결을 가려내는 판결문 서고, 스포츠지는 시즌 달력과 이적설, 연예지는 커버 섭외와 잠복 취재로 일한다',
  '대규모|기사 직접 만들기: 4단계가 「인용과 제목」으로 바뀌었다. 증언·녹취·인터뷰·반론·전문가 가운데 누구의 말을 앞세울지 고르고, 제목을 앞머리·본문·꼬리로 직접 조립한다. 5단계에서는 내보낼 기사를 미리 본다',
  '대규모|기자의 가치: 속도와 검증, 공익과 흥행, 독립과 타협. 무엇을 앞세웠는지가 쌓여 어떤 기자인지 정해지고, 그에 맞는 일이 찾아온다. 속보 담당 차출, 탐사팀의 러브콜, 몰려드는 제보, 광고국의 칭찬, 권력의 견제, 광고주의 「우리 편」 제안. 확인 안 된 사실을 넣으면 기사는 커지지만 신뢰가 바로 깎인다',
  '대규모|편집권 압력: 광고주 기사를 쓰면 AI 데스크가 기사를 킬하거나 단신으로 줄이거나 묵혀 두라고 한다. 받아들이거나 맞서거나, 다른 매체에 넘길 수도 있다. 내가 부장 이상이면 부서원 기사를 내가 결재한다. 그대로, 단신, 묵히기, 킬',
  '대규모|공세 보도: 부장 이상과 창간 대표는 한 곳을 정해 몇 주 동안 연속 기획으로 파헤칠 수 있다. 이기면 사과와 개선을 받아 내고, 지면 소송과 광고 철회가 온다. 뒷문으로 광고 제안이 오기도 하고, 기사를 무기로 광고를 압박할 수도 있다. 윗선이 특정 기업을 파 보라고 지시하기도 한다',
  '대규모|발탁 트랙: 다음 승진까지 기다리는 기간이 절반 지나고 실적이 뛰어나면 정기 인사 때 윗선이 조기 승진을 제안한다. 1년 안에 어려운 목표를 채우면 연차가 덜 찼어도 오르지만, 트랙 동안 야근이 늘고 오보 한 건이면 그 자리에서 탈락이다',
  '주요|매체별 수습: 사쓰마와리 대신 통신사는 야간 속보 당번, 방송은 현장 수습, 경제지는 여의도 돌기, 지역지는 시·군청 돌기, 영자지는 외신·대사관 돌기, 인터넷은 커뮤니티 모니터링, 주간지는 자료실 수습, 전문지·연예지는 각자의 현장을 돈다',
  '주요|매체 미니게임: 속보 송고 경쟁, 메인뉴스 큐시트, 생중계 진행, 가판 전쟁, 공시 해독, 번역 감수, 실시간 검색어, 커버 회의, 단톡방 팩트체크, 임상 데이터 판독, 유출 사양 판별, 법정 방청, 문자중계 마감, 잠복 셔터. 설정에서 끌 수 있다',
  '주요|대출 갚기: 월급 쓰기에서 주택담보대출과 전세자금대출을 미리 갚거나, 매달 더 많이 갚는 빨리 갚기를 고를 수 있다. 원리금을 못 내면 연체 이자가 붙고, 석 달이면 신용등급이 떨어져 금리가 오르며, 반년이면 집이 경매로 넘어간다. 전세대출 이자가 밀리면 은행이 보증금을 회수한다',
  '주요|연예 주간지 스타라운지 추가',
  '개선|튜토리얼: 매체마다 다른 일, 기자의 가치·편집권, 인용과 제목, 매체별 수습, 발탁 트랙, 대출을 반영했다',
  '개선|선택지: 버튼을 더 낮고 촘촘하게, 넓은 화면에서는 두 줄로 놓아 덜 내려도 되게 했다',
  '수정|문구: 반론에 「측」이 두 번 붙던 문제, 기관 이름 뒤 조사가 틀리던 문제, 매체 출고 메모 앞에 숫자가 붙던 문제를 고쳤다'],
'2026.10.20',['매체마다 다른 평가와 일하는 법','기사 직접 만들기 — 인용과 제목','기자의 가치 — 속도·공익·독립','편집권 압력 · 공세 보도','발탁 트랙 · 매체별 수습 · 미니게임']],
 ['1.0','정식 출시',[
  '대규모|댓글창: 기사를 내면 독자 댓글이 달린다. 완성도·제목·반론·논조·파급력에 따라 반응이 달라지고, 좋은 기사일수록 내부자가 붙는다. 댓글 사이에 숨은 제보가 있다 — 구체적인 진짜 제보와 크고 흐릿한 가짜를 가려 연락하면 새 단독이 된다',
  '대규모|내 기사, 그 후: 굵직한 기사는 몇 달·몇 년 뒤 결과로 돌아온다. 제도가 바뀌고, 관련자가 재판에 넘겨지고, 확인이 덜 된 기사에는 소송이 걸리고, 지켜 준 취재원이 높은 자리에서 다시 찾아온다. 스크랩에도 그 뒤가 남는다',
  '대규모|함께 늙어 가는 사람들: 커리어 초반에 만난 정치인·검사·판사·경찰·외교관·은행원·기업인·IT 창업자·건설업자·의사·교사·영화감독·아이돌·운동선수·지방 정치인·시민운동가 가운데 세 사람이 판 내내 함께 자란다. 내 부서와 가까운 사람이 적어도 한 명은 엮인다. 가까울수록 오를 때마다 먼저 귀띔해 주고, 정상에 서면 첫 인터뷰를 준다. 오래 묵은 비리가 드러날 때 오랜 인연과 기사 사이에서 골라야 한다',
  '대규모|시대: 판마다 다른 흐름이 원인과 결과로 맞물린다. 호황이 길어지면 거품이 끼고, 거품이 꺼지면 금융 위기와 불황이 오고, 바닥을 지나 회복한다. 감염병은 경기를 꺾고 비대면 전환과 일상 회복으로 이어진다. 대선·총선·지방선거 달력, 새 정부와 권력형 게이트와 광장, 포털 개편에서 영상·숏폼 시대와 AI 뉴스 시대로 가는 미디어 변화, 참사와 안전 점검 정국, 무역 분쟁·기술 붐·부동산 폭등·기후 재난, 올림픽과 월드컵까지 스무 가지가 넘는 시대가 온다. 경기와 광고주 예산, 광고 매출, 반기 광고 목표, 사업 매출, 트래픽과 포털, 부서별 기사의 무게가 시대를 따라 움직이고, 경영진은 비용 절감·디지털 전환·보도 품질로 전략을 바꾸고, 편집국은 인력을 돌리고, AI 기자들의 단독도 시대가 키운 부서에서 더 나온다. 수첩에서 지금의 시대와 그 영향, 다음에 올 흐름을 볼 수 있다',
  '대규모|출입처별 기사: 의료팀·교육팀·법조팀·사건팀·금융부·증권부·부동산부·IT과학부·산업부·외교안보부·자치행정부·전국부·야구·축구·탐사보도팀마다 그 출입처다운 기사가 따로 생겼다. 응급실 뺑뺑이, 대리수술, 시험 문제 거래, 전관 수임, 클럽 마약과 경찰 유착, 뱅크런, 상장 뒷돈, 깡통전세, 통신사 해킹, 기술 유출, 훈련병 사고, 출렁다리, 소멸 위기 마을, 승부조작, 보조금 빼돌리기 같은 기사를 그 부서에서 더 자주 만난다. 시대의 영향도 출입처별로 받는다',
  '주요|옆 부서 기자와 공동 바이라인: 내 아이템을 옆 부서도 쫓고 있으면 그 부서 기자가 찾아온다. 함께 쓰면 사실 확인이 빨라지고 단독이 더 오래 버티고 오보 위험이 줄지만 보상을 나누고 바이라인을 함께 쓴다. 먼저 쓰기로 하면 보상은 내 것이지만 늦으면 옆 부서가 먼저 써서 아이템을 잃는다. 넘겨주면 팀플레이로 평가와 관계를 얻는 대신 아이템을 내준다',
  '대규모|기관·광고주 대폭 확대: 부서마다 만나는 정부 기관·공공기관·기업·협회·구단·인물이 크게 늘었다. 방위사업청과 방산 기업, 국세청과 홈쇼핑·화장품·패션, 보험사·캐피털·간편결제, 자산운용사와 코인 거래소, 신탁사와 주택보증, 클라우드·보안 기업, 건강보험·근로복지·소비자원, 로펌, 해경·관세청, 심평원·식약처·바이오, 대학과 에듀테크, 웹툰·OTT·레이블, 체육진흥공단과 e스포츠, 새 프로 구단, 농협·수협·도시공사까지. 광고주가 늘어도 큰 광고주의 규모는 그대로이고 회사 전체 광고 매출의 균형도 유지된다. 작은 매체에서 이름 있는 광고주 몫이 지나치게 커지던 문제도 바로잡았다',
  '조정|광고 영업 금액: 광고·협찬 영업의 계약 크기가 광고주 규모를 따른다. 큰 그룹은 성사되면 크지만 조금 더 까다롭고, 작은 회사는 작지만 쉽다. 평균 규모는 그대로다',
  '주요|부서 간 기사 공유: 여러 부서에 걸치는 소재는 그 부서의 아이템으로도 나온다. 사회부의 기업 산재 기사가 경제부에도, 경제부의 코인 사기가 사건팀에도, 사건팀의 학교 딥페이크가 교육팀에도 뜨는 식이다. 출입처 전용 기사와 함께 부서마다 만나는 기사의 폭이 넓어진다. 스크랩에는 기사의 그 후도 함께 남는다',
  '주요|마감 직전 속보: 가끔 실제 시간이 흐르는 속보 상황이 온다. 바로 넣을지, 전화 한 통 더 돌릴지, 내일로 미룰지 시간 안에 정해야 한다. 설정에서 타이머 없이 고르거나 끌 수 있다',
  '주요|내 커리어 1면: 판이 끝나면 내 대표 기사로 신문 1면 한 장을 만들어 준다. 이미지로 저장하거나 공유할 수 있고, 기록실에서 지난 판의 1면도 다시 볼 수 있다',
  '대규모|첫 단독: 수습 첫 달, 일을 몇 가지 하고 나면 새벽 경찰서에서 단독의 냄새가 찾아온다. 현장으로 뛰거나, 형사에게 캐묻거나, 캡에게 보고하는 선택에 따라 시작이 달라지고, 기한 안에 내면 캡의 칭찬과 함께 첫 단독이 남는다. 늦으면 타사 동기가 먼저 쓴다',
  '주요|도감 보상: 엔딩·도전 과제·거친 부서·이야기를 모으면 도감 점수가 쌓이고, 점수에 따라 유산을 두 개까지 고를 수 있게 되며 새 유산(발 넓은 동기·단골 제보자·데스크의 눈·전설의 선배)이 열린다. 기록실 "도전·유산"에서 진행을 본다',
  '주요|이번 판 목표 엔딩: 새 판을 시작할 때 못 본 엔딩 하나를 목표로 걸 수 있다. 수첩 맨 위에 가는 길이 보이고, 이루면 도감 점수가 더 붙는다',
  '개선|사건 경중에 맞춘 등급: 승부조작·기술 유출·권력형 비리 같은 중대 사건은 높은 등급으로, 가벼운 화제성 기사는 낮은 등급으로 매긴다. 전체 평균은 그대로라 보상이 부풀지 않는다',
  '개선|엔딩 도감 힌트: 도감 점수가 조금 쌓이면 못 본 엔딩에 가는 길까지 보여 준다',
  '개선|취재원·대외 관계 정렬: 사람과 기관이 많아지는 후반에도 한눈에 찾도록 정렬 단추를 달았다. 취재원은 추천·신뢰 높은 순·신뢰 낮은 순·오래 못 만난 순·분야별·이름순, 대외 관계는 추천·관계 좋은 순·관계 나쁜 순·종류별·광고 큰 순·이름순. 만나기 창과 사람 탭 모두 같은 정렬을 쓰고, 정렬을 바꿔도 이미 고른 사람은 그대로 남는다. 오래 연락이 끊긴 취재원은 따로 표시된다',
'대규모|창간 모드 부서별 광고·사업 목표: 대표가 부서마다 반기 목표를 자동이나 수동으로 정한다. 자동은 영업할 수 있는 기자 수와 실력에 맞추고 실적에 따라 완만하게 오르내린다. AI 기자들은 페이스에 맞춰 광고와 사업(포럼 후원·행사·용역)을 따 오고, 목표를 채우면 기사로 돌아간다. 역량에 비해 터무니없는 목표는 사기·신뢰·보도 품질을 깎고 퇴사나 광고 강매 논란을 부른다. 영업 수당과 편집·영업 분리 원칙으로 조절할 수 있다. 사람 탭 "광고 영업"에서 부서별 진행을 본다',
  '주요|창간 모드 기사력: 좋은 기사와 실력 있는 기자가 쌓일수록 부서 기사력이 오른다. 기사력이 높으면 광고주가 먼저 찾아와 영업과 광고 매출이 늘고, 대표 평판과 매체 위상(성장 점수)도 오른다. 스타 기자는 그 자체로 광고와 위신에 보탬이 된다. 영업을 몰아붙이면 기사력이 떨어진다',
  '주요|창간 모드 취재 지시: 대표도 쥔 아이템 여러 건을 기자에게 한꺼번에 맡기거나, 새 기획 취재를 시킬 수 있다. 맡긴 기사가 잘 나오면 기자가 크게 성장하고 대표 평판도 오른다. 관련 미션도 생겼다',
  '조정|광고 목표 몫: 연차가 쌓인 평기자와 차장이 영업의 중심이 되도록 몫을 늘리고, 데스크를 보는 부장·부국장·국장의 부담은 크게 줄였다. 부서별 배정도 광고가 많은 부서가 조금 더 지는 정도로 고르게 바꿔, 사람 적은 연예·문화·체육부 같은 부서에 몰리던 쏠림을 줄였다. 편집국장은 부서가 없으므로 전 부서 광고 실적 합계가 목표가 되고, 부서별 실적을 한눈에 보며 전 부서 영업을 독려할 수 있다. AI 편집국장도 편집국 페이스가 처지면 부장단을 독려하고, 직접 큰 광고·협찬을 따 와 처지는 부서를 메운다. 영업은 여전히 연차가 어느 정도 쌓인 기자부터',
  '개선|AI 기자 영업: 자기 몫 대비 페이스를 보고 더 뛰거나 늦추고, 부서가 처지면 앞선 기자도 거든다. 한 사람이 혼자 몫을 크게 넘기던 쏠림을 없앴고, 연차가 쌓인 평기자의 영업도 회사 매출에 반영된다',
  '조정|능력만큼 채우는 영업: AI 기자·AI 편집국장·창간 모드 부서 모두 목표를 기계적으로 딱 맞추지 않는다. 실력·영업 성향·컨디션(창간 모드는 부서 기사력까지)에 따라 잘하는 쪽은 조금 넘기고 약한 쪽은 조금 못 채운다. 편집국장이 따 온 큰 건도 처지는 부서를 메울 만큼만 얹는다',
  '수정|부서장 누락: 내가 평기자·차장일 때 우리 부서에 부장이 없어 광고 목표와 부서 명단에서 빠지던 문제',
  '수정|바뀐 것 표기: 달이 바뀐 뒤 첫 취재(무료)와 불러오기 뒤 첫 취재에서 결과 창에 "바뀐 것"이 안 뜨던 문제',
  '수정|모바일 화면: 웹 주소로 접속한 폰에서 아래 탭바로 한 화면씩 넘기던 모바일 화면이 사라지고 PC 화면이 작게 뜨던 문제',
  '수정|창간 모드 경력 표기: 막 창간한 회사의 기자가 "입사 후 줄곧"으로 나오던 문제. 창간 멤버와 합류 시점, 그 전 경력을 따로 보여 준다',
  '대규모|부국장·국장의 일: 부서장으로서 직접 취재·기사도 쓸 수 있다(부장보다는 드물게). 아이템 넘기기와 새 "취재 지시"로 부서 기자에게 아이템을 맡기거나 기획 취재를 시킨다. 부서 광고 목표도 함께 진다',
  '주요|AI 기자들이 나를 찾아온다: 반기 마감 직전 영업 SOS, 막힌 후배의 조언 요청, 취재 지시한 기자의 중간 보고, 옆 부서 기자의 아이템 귀띔 같은 일이 생긴다. 다른 부서의 AI 부장들도 컨디션 좋은 유능한 기자에게 큰 건을 맡겨 단독을 노린다',
  '주요|설명 보강: 사내 평가·업계 평판·신뢰도·컨디션을 누르면 높고 낮을 때 무엇이 달라지는지, 컨디션은 매달 얼마나 차고 몇 이상이면 행동력이 느는지 보인다. 체력 설명에 컨디션 회복도 적었다. 상사의 눈 밖에 나면 대처법이 함께 뜬다',
  '조정|광고 목표와 회사 규모: 회사가 커지면 반기 광고 목표도 완만하게 커지고, 작아지면 줄어든다',
  '수정|이름: 같은 회사에 동명이인이 지나치게 많던 문제. 이름 후보를 크게 늘리고 실제 성씨 비율에 맞췄으며, 한 회사 안에서는 이름이 겹치지 않는다. 부서원 탭은 "내 팀"으로 이름을 바꾸고 부서 전체 인원과의 차이를 적었다',
  '수정|데스킹 날짜: 이미 지난 일에 앞으로의 날짜가 붙던 문제. 지난 일은 지난해·재작년, 앞으로 할 일은 이번 달 이후나 내년으로 나온다',
  '수정|주 단위 표기: 한 달이 한 턴인데 "다음 주로 넘기기", 자기계발 "주 +0.6" 같은 주 단위 표기가 남아 있던 곳을 월 기준으로 고쳤다. 능력치 변화는 소수 둘째 자리까지 보여 줘 반올림 때문에 오른 게 안 보이던 문제도 없앴다'],'2026.10.20',['댓글창 · 내 기사, 그 후','시대 — 경기·선거·감염병·미디어의 흐름','함께 늙어 가는 사람들 · 옆 부서 공동 바이라인','출입처별 기사 · 기관·광고주 대폭 확대','창간 모드 부서별 광고 목표 · 첫 단독 · 도감 보상']],
 ['7.0','사람의 결',[
  '대규모|부서 광고 목표: 연차가 쌓인 평기자부터 차장·부장까지 부서원의 광고·협찬 실적이 부서 반기 목표 하나로 합쳐진다. 평기자도 연차가 쌓이면 광고 영업을 할 수 있다. 목표는 반기마다 조금씩 바뀐다 — 넘치게 채운 부서는 다음 목표가 오르고, 크게 못 채운 부서는 내려간다',
  '대규모|사람 탭 · 광고 영업: 반기 목표 대비 누적 실적을 그래프와 글로 보여 주고, 부서원별 실적과 지난 반기 기록, 앞으로 매달 얼마를 더 채워야 하는지 알려 준다. 부장은 여기서 부서원 영업을 독려할 수 있다',
  '대규모|AI 기자들도 목표를 쫓는다: 다른 기자들도 자기 몫이 처지면 영업을 늘리고, 반기 끝에 몰아치고, 앞서 있으면 기사에 집중한다. 채우면 사내 평가가 오르고 크게 못 채우면 깎인다',
  '대규모|여러 명 한꺼번에: 동료 챙기기, 취재원(고위층 인맥) 관리, 대외 관계를 누르면 바로 사람(곳)을 골라 함께 챙긴다. 여럿일수록 한 사람당 효과는 줄지만 합치면 훨씬 크다. 한 명(곳)만 고르면 그 사람만의 깊은 선택지가 열린다',
  '대규모|데스킹 문제가 다양해졌다: 메모와 다른 인용·발언자, 엉뚱한 기관명, 틀린 합계·배율, 수사 단계의 유죄 단정 같은 유형이 늘었고, 틀려 보이지만 맞는 함정 문장이 섞인다. 제목에도 취재보다 앞서 나간 단정형이 끼고, 결과에서 왜 틀렸는지·왜 맞았는지 알려 준다',
  '대규모|상사의 성향: 부장·편집국장·사장마다 단독 위주, 탐사 위주, 속보 위주, 검증 위주, 영업 위주, 관계 위주, 원칙 위주 같은 성향이 있다. 좋아하는 일을 해내면 관계와 평가가 오르고, 싫어하는 일을 하면 눈 밖에 난다. 다른 부서 부장들의 성향은 그 부서의 단독·물량·정확도·광고 실적으로 드러난다',
  '주요|사장·대표의 일: 편집회의 대신 경영회의(이번 달 경영 중점)와 이사회·대주주 보고(연임 심사에 남는다)를 한다',
  '주요|부장 이상 미션 보강: 부서 광고 목표, 데스킹한 기사 1면 올리기, 부서 기획회의, 납득할 만한 인사, 포털 제휴·구독 캠페인, 경영회의·이사회 보고 등이 새로 나온다',
  '주요|취재원이 먼저 전화한다: 신뢰를 쌓은 취재원은 가끔 알아서 아이템을 물어다 준다. 오래 연락하지 않으면 관계가 조금씩 식는다',
  '조정|광고 영업: 계약 규모를 회사 크기에 맞게 현실적으로 바꾸고 성공률은 올렸다. 영업 수당도 현실에 가깝게 맞췄다',
  '조정|회사 돈에도 계절이 있다: 광고는 연초·한여름에 비고 봄·가을·연말에 몰린다. 연말엔 성과급, 연초엔 연봉 조정이 나가고, 가끔 뜻밖의 수입·지출도 생긴다. 회사 탭에 이번 달이 성수기인지 비수기인지 보인다',
  '주요|월말 결산 한눈에: 한 달이 끝나면 평가·평판·신뢰·통장이 얼마나 바뀌었는지, 기사·미션·광고 목표·회사 손익을 한 장으로 보여 준다. 결산 창이나 설정에서 끌 수 있고, 끄면 알림 한 줄과 기록으로 남는다',
  '주요|화면 개선: 할 일 버튼마다 무엇을 얻고 무엇을 쓰는지 미리 보인다. 사람 탭 맨 위에 가까운 사람·주의할 곳·광고 영업 진행률이 요약된다. 반기 광고 목표가 처지면 할 일 경고 상자가 알려 준다. 창이 열려 있을 때 소식 카드가 내용을 가리지 않고, 여러 명을 고르는 창에 몇 명을 골랐는지 보인다',
  '조정|간소화·창간 모드: 관리 업무 비용이 표준 모드와 같아지면서 창간 대표의 행동력을 표준에 맞췄고, 간소화 모드의 광고 목표는 조금 가볍다',
  '조정|관리 업무 부담: 광고 영업, 데스킹, 대외 관계, 인사권, 구독 캠페인, 포털 제휴 같은 일이 모두 행동력 하나로 된다. 인사권은 여러 명을 골라도 한 번이고, 실력대로 한 인사는 부서 성과·보도 품질·사기를 더 끌어올린다. 구독 캠페인과 디지털 투자는 방식을 골라 집행한다',
  '조정|관계망 첫 관계: 큰 매체일수록 기관·기업이 먼저 챙기고, 인물은 경계한다. 출입 경력이 있으면 아는 곳과 조금 더 가깝게 시작한다. 관계가 높을수록 더 올리기 어렵고, 기사 한 건으로 잃는 관계에도 한계가 생겼다',
  '조정|포털 많이 본 뉴스 순위: 조회수 하나가 아니라 뉴스 가치(등급·단독·파급력·완성도·제목)로 정한다. 제대로 터진 대특종은 최상위권에 오른다',
  '조정|수습 기간과 사람 사이: 큰 매체 수습이 거의 항상 연장되던 문제를 풀고, 방송감·속도를 어떻게 올리는지 조건에 적었다. 동료들과의 첫 관계를 높이고, 관계 이벤트가 다른 이벤트에 밀려 잘 안 뜨던 문제를 고쳤다',
  '수정|장기 추적 파일: 매번 같은 아이템만 뜨고 한 번 더 눌러야 추적이 붙던 문제. 이제 바로 추적이 붙고, 진행 상황이 보이며, 추적 중엔 단독 시한이 천천히 줄어든다',
  '주요|아이템 넘기기: 한 번에 두 건까지 같은 사람에게 넘길 수 있다',
  '수정|후속 기사가 등급과 상관없이 확인할 사실이 늘 같은 수로 나오던 문제. 이제 원래 기사처럼 등급에 맞춰 달라진다',
  '수정|관계망에서 아이콘과 이름이 겹치던 문제, "이(가)" 같은 괄호식 조사가 남아 있던 문구'],'2026.10.19',['부서 광고 목표','상사 성향']],
 ['6.7','편집국은 살아 있다',[
  '대규모|차장 이상 기자들의 광고·협찬 영업: 다른 기자들도 출입처 기업·기관을 돌며 광고와 협찬, 포럼 후원을 따 온다. 회사 매출에 "기자 영업"으로 잡히고, 내 부서 차장 이상의 실적은 내 분기 광고 목표에도 보탬이 된다. 접대·행사·영업 수당 같은 비용도 함께 든다',
  '대규모|광고주·기관의 재정: 경기가 호황과 불황을 오가고, 기업마다 실적이 따로 움직여 광고 예산을 늘리거나 줄인다. 기관은 해마다 홍보 예산이 새로 정해진다. 큰 광고주의 실적 쇼크나 최대 실적 소식이 뜨고, 관계망의 광고주 정보에서 재정 상태를 볼 수 있다',
  '주요|부서마다 광고 배정이 다르다: 경제·산업·금융·증권·부동산은 출입처가 곧 광고주라 가장 무겁고(특집 섹션·포럼 협찬), 지역 주재는 지자체·지역 기업 광고, 문화·스포츠는 행사 협찬, 정치·외교·사회·사건·법조·탐사는 가볍다. 차장·부장의 분기 광고 목표와 부서 기자들의 영업 실적도 부서에 따라 달라진다',
  '주요|기자 영업 방침(국장 이상·사장·대표, 광고 단가와 수주 메뉴): 광고국에 맡기기 / 출입처 영업 거들기 / 차장 이상 광고 할당제. 세게 밀수록 매출은 오르지만 "단독보다 매출"이라는 말이 돌고 신뢰·사기·보도 품질이 깎인다',
  '주요|경영진도 사업을 한다: 내가 사장이 아니어도 회사가 자금 여유에 맞춰 뉴스레터·영상·포럼·기사 판매·아카이브·멤버십 같은 수익 사업을 시작하고 키운다. 신뢰를 깎는 사업은 신뢰가 넉넉할 때만 벌인다',
  '대규모|AI 기자: 편집국의 다른 기자들도 플레이어처럼 매달 행동력을 나눠 취재·출고·데스킹·영업·휴식을 한다. 기자마다 스타일(특종형·검증형·마당발·속보형·영업형), 컨디션, 사내 평가, 취재원이 있어서 몰아치면 지치고 번아웃 휴직도 한다. 데스크가 꼼꼼한 부서는 오보가 적다. 단독을 내면 포털 소식에 이름이 뜨고, 오보는 정정보도로 이어진다. 인사권·편집국 명부에서 기자별 한 해 기록(기사·단독·오보·영업·평가)을 볼 수 있다',
  '주요|정기 인사 때 다른 기자들도 평가에 따라 승진하고, 타사로 이직하거나 경쟁사에서 경력으로 들어온다. 평가가 낮거나 편집국 사기가 바닥이면 더 많이 떠난다',
  '주요|다른 기자들의 일이 나에게 온다: 간부는 편집국 대형 단독의 배치, 다른 기자 오보의 처리(정정·버티기·징계), 기사 소송 대응, 영업 1등 기자가 광고주와 맺은 기사 약속, 에이스의 이직 통보, 부서 이동 요청을 결정한다. 평기자·차장은 선배의 영업 동행 요청을 받고, 옆 부서 기자상 소식에 자극받는다',
  '수정|경쟁사 소식에 "광고 단가 덤핑 0개월째"가 뜨던 문제'],'2026.10.19',['기자 영업','경기']],
 ['6.6','자리를 옮기며',[
  '수정|이직·스카우트·재취업으로 회사를 옮겨도 전 회사의 광고 단가, 비용 절감, 임금 인상, 특별취재팀, 경영 전략, 연중 기획(어젠다), 회사 위기가 새 회사까지 따라오던 문제: 이제 두고 간다',
  '수정|스카우트·동료 제안에서 약속한 직급과 실제로 받는 직급이 다르던 문제(국장 자리라더니 팀장으로 입사 등). 이제 제안 문구가 실제 직급을 그대로 말하고, 작은 매체는 그 매체의 직함(팀장·기자 등)으로 보인다',
  '수정|"스카우트"라면서 직급을 낮춰 데려가려 하던 제안, 문을 닫은 매체에서 오던 제안, 편집국장에게 온 국장 제안이 사라졌다',
  '수정|권고사직 뒤 재취업 목록에 보이는 직급이 실제 직급과 다르던 문제',
  '조정|라이벌 기자 AI: 단독 대결에서 한참 앞서면 느슨해지고, 내가 앞서면 더 바짝 붙는다. 쉬움 난이도에선 덜 몰아치고, 사이가 좋으면 내 단독을 덜 노린다. 손도 안 댄 아이템이 시들어 사라진 것까지 라이벌 단독 승리로 세던 문제도 고쳤다',
  '수정|기사 본문에 마침표가 두 번 찍히던 문제(". .")'],'2026.10.19',['이직']],
 ['6.5','경쟁의 균형',[
  '조정|경쟁사가 우리 기자를 너무 자주 빼 가던 문제: 같은 회사가 연달아 데려가지 못하고, 쉬움 난이도에선 덜 노린다',
  '조정|경쟁사 품질이 끝없이 올라 최상위에 붙어 있던 문제: 높아질수록 투자 효과가 줄어든다',
  '조정|경쟁사 사설 공격이 신뢰가 낮을 때 연달아 몰아치던 악순환을 막았다. 같은 회사의 사설 공세엔 간격이 있고, 신뢰가 바닥일 땐 타격이 줄어든다',
  '주요|경쟁사의 흥망: 경쟁사가 구조조정을 하면 빈자리만큼 우리 독자가 늘고, 오래 적자를 못 벗어난 매체는 새 대주주에게 넘어가 전략을 바꾼다',
  '조정|경쟁사 덤핑 소식이 뜨는 빈도를 줄였다'],'2026.10.19',['경쟁사 AI']],
 ['6.4','사장실의 시간',[
  '주요|사장 임기가 두 배로 길어졌다. 임기가 끝나면 이사회가 연임을 심사한다: 이사회 KPI·신임·신뢰도·회사 자금이 좋으면 연임해 세 번까지, 정년까지 사장실을 지킬 수 있다. 할 일 화면에 몇 기 사장인지와 남은 임기가 보인다',
  '조정|경쟁사 AI: 매체마다 전략 색깔이 뚜렷해졌다. 특종형은 탐사에, 품질형은 기자 교육에, 디지털형은 디지털 투자에, 인재형은 영입에 힘을 쏟는다(예전엔 대부분 광고 단가 덤핑만 되풀이했다). 같은 수만 반복하지 않고, 돈이 남으면 투자하고, 밀리면 승부수를 던지고, 우리 신뢰가 흔들리면 사설로 공격한다',
  '조정|경쟁사의 경계심이 끝까지 치솟거나 바닥에 붙지 않고, 우리의 성장과 단독에 따라 오르내린다',
  '조정|경영진 AI: 경쟁사가 기자를 빼 가고 편집국 사기가 낮으면 "인재 지키기" 전략을 쓰고, 회사 자금이 바닥나면 분기를 기다리지 않고 바로 비용 절감에 들어간다'],'2026.10.19',['사장 연임']],
 ['6.3','간부실 점검',[
  '수정|리드 문장 단계에서 "핵심 의혹으로 곧장 연다"를 고르면 기사 첫 문장이 "undefined"로 나오던 문제',
  '수정|부국장 이상의 "1면 대결" 승리가 우연한 이벤트로만 쌓여 승진 조건·미션을 채우기 어렵던 문제(사장은 아예 채울 수 없었다). 이제 1면 회의에서 톱을 정하면 다음 날 경쟁지 1면과 승부가 나고 승수에 들어간다',
  '수정|편집국 명부의 다른 부서 간부·기자가 60세를 넘겨도 퇴직하지 않던 문제: 이제 정기 인사 때 정년퇴직하고 신입이 들어온다',
  '수정|부서를 더 만들 수 없을 때 "부서 신설" 목록이 이유 없이 전부 막혀 있던 문제: 이제 왜 안 되는지 보인다',
  '조정|경쟁사가 광고 단가 덤핑을 매달 되풀이하며 소식란을 도배하던 문제: 같은 공세를 이어 갈수록 효과가 줄고, 소식은 시작할 때와 오래 이어질 때만 뜬다',
  '수정|문구 다듬기: 이름·기관 뒤 조사("한솔읍는", "정지훈와", "서성민가" 등), "0억"·"-0억"으로 보이던 작은 금액, 빈 괄호로 나오던 제목 설명'],'2026.10.19',['간부·대표 점검']],
 ['6.2','숨 고르기',[
  '수정|사장이 한 달만 자금이 마이너스로 가거나 신임이 떨어져도 바로 해임되던 문제. 이제 이사회가 먼저 최후통첩을 하고, 한 달 안에 돌려놓지 못하면 해임된다',
  '수정|간부·사장에게 "다시 출입처로 향했다"는 10년 차 평기자 이야기가 뜨던 문제',
  '조정|부장·국장이 직접 못 본 부서원 기사가 그대로 나가 오보가 나는 일이 조금 줄었다',
  '조정|회사 재정 현실화: 간부가 회사를 키우면 매출이 수년 만에 몇 배로 뛰고 회사 자금이 수천억~수조 원까지 쌓이던 문제. 광고 단가 인상은 업계 최고 수준(30%)까지만 되고 시간이 지나면 조금씩 원래대로 돌아오며, 구독·트래픽은 기본의 두 배까지만 큰다. 매출 1년 반 치를 넘는 잉여금은 배당·투자로 조금씩 빠져나간다',
  '수정|마이너스 통장 이자가 매주 2%(연 180%대)씩 복리로 붙어 빚이 수백억까지 불어나던 문제: 이제 연 13%쯤이고, 빚이 1억을 넘으면 은행이 집을 처분해 정리한다',
  '수정|권고사직이 한 달 안에 여러 번 겹쳐 실행되며 재취업하자마자 다시 잘리던 문제(부국장이 한 달 만에 평기자가 되던 원인): 이제 한 번만 처리되고, 재취업 뒤에는 두 해 동안 유예된다',
  '조정|오보 논란에서 "버틴다"에 위험 표시가 붙고, 데스크로서 놓친 부하 기사라면 소송에 져도 책임이 절반이다',
  '수정|채용 후보 명단을 공짜로 무한히 새로 받을 수 있던 문제: 이제 한 달에 한 번만 새로 받는다',
  '수정|데스킹 초고가 기사 주제와 상관없는 문장(보이스피싱 기사에 교육청 일정, 정치 기사에 환율 계산 등)으로 채워지던 문제: 이제 초고는 그 기사의 증언·문건·현장 사실과 상대 해명으로 짓고, 문제 문장도 그 기사 안에서 나온다(취재 메모와 다른 숫자, 없는 날짜, 침묵을 인정으로 해석, 제보자 신원 노출 등). 어색했던 제목 후보와 조사("민원는") 오류도 고쳤다. 초고 위에 기자의 취재 메모가 함께 떠서, 모든 문제 문장을 화면에 보이는 정보만으로 찾을 수 있다',
  '주요|취재 개편 — 단서가 단서를 부른다: 사실을 확인하면 가끔 새 단서(결재란의 이름, "그날 트럭이 들어왔다"는 말, 돈이 흘러간 업체…)가 나오고, 단서를 따라가면 다른 경로로 확인한 것으로 인정된다',
  '주요|취재 개편 — 막혀도 다른 길: 전화를 안 받으면 집 앞 뻗치기, 현장이 막히면 밤에 다시 가거나 근처 CCTV를 부탁하는 식으로 실패한 자리에서 새 선택지가 열린다',
  '주요|취재 개편 — 상대의 반격: 취재가 깊어지면 상대도 움직인다. 증거 인멸, 선제 해명 보도자료, 변호사 내용증명, 취재원 입막음에 어떻게 맞설지 고른다. 내용증명을 받고 반론 없이 쓰면 소송이 걸릴 수 있다',
  '주요|인터뷰 심리전: 상대의 경계심과 동요가 따로 보인다. 확인한 문건·단서를 증거 카드로 내밀 수 있는데, 경계가 높을 때 너무 일찍 꺼내면 상대가 입을 닫는다. 동요가 크면 질문을 하나 더 던질 수 있다',
  '주요|부서마다 전용 취재 기법(★): 법조 공소장·판결문 열람, 사건 형사과 야간 취재, 탐사 장기 잠복, 정치 국회 복도 뻗치기, 경제 공시·등기부 대조, 문화·연예 업계 술자리, 스포츠 라커룸, 지역 토박이 인맥 등',
  '주요|취재 수첩이 기사가 된다: 인터뷰 녹취와 증언 한마디, 현장 사진이 기사 인용문과 1면 지면에 그대로 실리고 완성도를 올린다',
  '주요|매체마다 다른 출고: 통신사(1보 타전·2보 이어 쓰기), 일간지(아침 지면 단독으로 아끼기·가판 보고 다듬기), 경제지(장중 출고로 주가가 흔들리면 기업 반발), 지역지(주민 목소리), 주간지(한 주 묵혀 커버스토리), 방송(현장 그림이 있어야 리포트가 산다·중계차 생방송), 인터넷·스포츠지(실시간 업데이트·낚시 썸네일), 영문지·전문지까지 각자의 선택이 있다. 취재에도 매체 성격에 맞는 기법이 더 잘 먹히고, 월말 보고에 매체별 실적이 뜬다',
  '조정|컨디션: 매주 저절로 회복되는 양을 줄이고 휴식의 회복량을 늘렸다. 몰아서 일하면 컨디션이 떨어지고, 쉬어 주면 확실히 돌아온다. 체력 능력치가 높을수록 회복이 빠르다',
  '조정|행동력: 컨디션 보너스(다음 달 행동력 +1)를 받는 기준을 낮췄다. 틈틈이 쉬어 주면 예전과 같은 행동력을 쓰고, 쉬지 않고 몰아치면 행동력이 줄어든다',
  '수정|부장 자리가 빈 부서로 옮길 때 오류가 나던 문제',
  '수정|사라진 기관·기업의 광고주 반응이 뒤늦게 뜨며 진행이 멈추던 문제'],'2026.10.19',['컨디션']],
 ['6.1','경영진의 머리',[
  '수정|아직 열리지 않은 할 일로만 채울 수 있는 미션·수습 평가 기준(캡과의 관계 등)이 미리 뜨던 문제를 고쳤다. 이제 해당 할 일이 열린 뒤부터 나온다',
  '주요|광고주와의 줄다리기가 다양해졌다: 무마 제안을 보도해 버리거나, "광고와 편집은 별개"라고 선을 긋거나, 보복당한 광고 자리를 다른 광고주로 메우는 선택지가 생겼다. 같은 선택이라도 상대 성향과 내 능력에 따라 결과가 갈리고, 한 번 무마를 받아 준 광고주는 다음에도 돈부터 내민다',
  '수정|위기 시스템 추가로 광고주 반응(무마·화해·보복)이 나오지 않던 문제를 고쳤다',
  '조정|모바일 하단 메뉴를 한 손으로 쓰기 편하게 바꿨다. 가장 자주 쓰는 할 일이 가운데로 왔다. 설정 → 하단 메뉴 순서에서 원하는 대로 바꿀 수 있다(왼손 배치·예전 배치도 있다)',
  '주요|위기 아크: 몇 달에 걸쳐 단계별로 이어지는 위기가 생겼다. 초반엔 가로채인 단독·위협받는 취재원·첫 오보 논란, 중반엔 부서원 조작 기사·광고주 삭제 요구·번아웃이 찾아온다. 고른 길이 다음 고비와 결말을 바꾸고, 잘 넘기면 칭호가 남지만 잘못 고르면 자리를 잃을 수도 있다',
  '주요|후반 대위기: 정권의 언론 탄압, 사주 일가 비리, 간판 특종 조작 의혹, 적대적 인수, 1000억 소송. 간부가 되면 커리어를 건 선택이 기다린다',
  '주요|창간 위기: 투자사의 경영권 압박, 소송 폭탄, 핵심 기자 집단 이탈, 포털 알고리즘 변경',
  '조정|간소화 모드의 위기는 더 가볍고 짧으며, 해임까지는 가지 않는다',
  '조정|경영진이 더 똑똑해졌다: 회사가 분기마다 상황을 읽고 전략을 바꾼다. 월말 보고에서 회사의 전략을 확인할 수 있다',
  '수정|평기자 한 명의 평판이 회사 전체 점유율을 좌우하던 문제를 고쳤다'],'2026.10.19',['경영진 AI']],
 ['6.0','편집국의 얼굴',[
  '조정|기사 제목 개편: 후보가 전부 "아이템 제목+꼬리말"이던 것을, 확인한 핵심 사실·증언·숫자를 살린 제목으로 바꿨다. 1단계에서 잡은 야마가 제목 후보로 나오고(현장형·탐사형·사람 이야기형·해설형 등), 기사에 맞는 야마로 제목까지 맞추면 완성도 보너스. "논란 논란" 같은 중복도 정리',
  '수정|엉뚱한 주제가 섞이던 문제: 취재 중 반전·대특종 후속이 같은 부서의 다른 사안을 끌어오던 것을 원래 사안에서 이어지게 고쳤고, 연예·스포츠·문화·국제 기사에 엉뚱한 공통 사실(감사 보고서 등)이 붙던 것을 분야 전용 사실로 바꿨다. 광고주 보복 맞대응 후속도 그 회사 이야기로',
  '조정|간소화 모드에선 새로 생긴 선택 팝업(특파원 찬스·지역 유지 청탁·기자 유형 사건)을 띄우지 않는다. 효과는 그대로',
  '주요|기자의 길: 매달 행동과 기사로 네 갈래 성향(단독·검증·인맥·속보)이 쌓이고, 1년쯤 한 방향으로 일하면 「스쿠프 헌터」「팩트의 수호자」「마당발」「속보 장인」 중 하나로 불린다. 유형마다 확실한 장점과 대가(예: 단독 아이템 +15% 대신 소송 위험 +30%), 유형 전용 사건, 결산 문구가 다르다. 방향을 바꾸면 유형도 바뀐다',
  '주요|기록실(타이틀 화면): 끝낸 판마다 이름·직급·회사·대표작·점수가 남는 명예의 전당, 16종 엔딩 도감(못 본 엔딩은 힌트만), 이야기·칭호·회사·부서·장면 갤러리 수집, 도전 과제와 유산 현황',
  '주요|세계가 이어진다: 창간 모드에서 키운 매체가 다음 판 회사 목록에 실제 회사로 남고, 부장 이상으로 끝낸 지난 판 주인공이 같은 회사의 국장·사장으로 나온다. 지난 판의 대표 특종은 편집국 전설로 회자된다',
  '주요|유산과 도전: 새 판을 시작할 때 지난 판이 열어 준 유산을 하나 고른다(작은 보너스 6종, 어려움에선 못 씀). 도전 과제 9종 중 하나를 걸면 판이 끝날 때 판정하고 기록실에 남는다',
  '주요|다음 판 미리보기: 결산 화면에 아직 못 본 엔딩·부서·이야기·도전 수와 엔딩 힌트, 다음 판 추천 출발점이 뜬다',
  '주요|부서 시그니처: 부서마다 고유 시스템이 생겼다. 정치(선거·국감 시즌), 국제(특파원 찬스), 경제(시장 지표·광고주 압력 2배), 사회·사건(사건 당번), 법조(선고 캘린더), 탐사(장기 탐사 진척도), 문화·연예(연재 기자상·조회수 전쟁), 스포츠(시즌 중 행동력 +1·비시즌 이적 시장), 지역(토박이 지수·유지의 청탁). 기존 부서 특성의 효과 폭도 두 배로 키웠다',
  '주요|부장 데스크: 본사 부장은 기사를 덜 쓰고 부서원 초고를 다듬는다. 부서원 초고가 초고함에 쌓이고, "데스킹"으로 꼼꼼히(문장 손질 → 제목 달기 → 출고·보강 지시·킬) 보거나 두 건을 빠르게 훑어 넘긴다. 꼼꼼히 볼수록 완성도가 오르고 후배가 큰다. 월말까지 방치한 초고는 차장이 대충 넘기거나 킬한다',
  '주요|사내 부서 성적표 개편: 데스킹한 부서 기사 수·완성도가 가장 크게 반영되고, 부서원 실력·톱 지면·기획회의가 뒤를 잇는다. 부장 본인 기명 기사는 한 달 2건까지만 제대로 쳐 주고, 4건 넘게 쓰면 "부장이 기사만 쓴다"는 지적을 받는다. 지역 주재 부장은 예전 방식 그대로',
  '수정|부서 성적표가 이번 달 기사 수를 0으로 읽어, 무엇을 해도 하위권에 머물던 문제를 고쳤다',
  '조정|본사 부장의 이달의 미션은 데스킹 위주로 나오고, 초고가 쌓이면 추천도 데스킹을 먼저 띄운다',
  '추가|성과 보상: 단독·1면·톱 지면·미션 달성·데스크·부서 1위에 매달 수당이 붙는다(월급의 15%, 최대 60만 원까지). 12월엔 인사고과 S~D 등급에 따라 성과급(S 월급 1.2배 · A 0.8배 · B 0.4배, 회사 적자면 절반)과 다음 해 호봉 가산(S +2%, A +1%, 누적 최대 +8%)',
  '추가|손해도 있다: 오보·정정이 나온 달엔 수당이 없고, 큰 오보는 견책 징계로 그해 고과가 깎인다. D등급은 국장 경고와 평가 하락. 같은 회사에서 기본급이 깎이는 감봉은 없다',
  '조정|월급 재조정: 지난번에 너무 깎았던 월급을 되돌렸다. 매체 기본급을 올리고(종합일간지 대형사 수습 실수령 약 290만), 직급 간 격차와 연차 호봉(해마다 2.5%)을 키웠다. 대형사 부장 실수령 약 600만, 편집국장 약 950만 수준. 어느 회사든 최저임금 아래로는 내려가지 않는다. 월급에 따라 너무 크게 오르던 생활비도 낮춰 매달 손에 남는 돈이 늘었다',
  '조정|할 일 카드 가독성: 행동 이름은 한 줄, 미션·추천 표시와 행동력은 아래 줄로 정리하고 설명은 두 줄까지만. 모바일에서 글자가 아래로 밀려 카드 높이가 들쭉날쭉하던 문제를 줄였다. 이달의 미션 상자도 더 촘촘하게',
  '추가|일러스트 대개편: 장면 15종(편집국·브리핑룸·국회·법정·청사 앞·기업 로비·공항·지역·사건 현장·비 오는 현장·술자리·윤전실·임원실·사장실·옥상)이 행동과 부서에 맞춰 바뀐다. 타이틀·로딩 화면, 엔딩 3종(은퇴·창간 성공·퇴장)도 그림이 생겼다',
  '추가|1면·톱 기사를 출고하면 신문 지면에 내 제목이 찍혀 나온다 (인터넷 언론은 화면, 방송은 기존 큐시트)',
  '추가|아이템에 분야 아이콘과 S·A·B·C 등급 휘장, 동료·취재원·라이벌 얼굴(관계에 따라 표정이 바뀐다), 승진 축하 배너, 이정표 메달',
  '조정|화면 곳곳에 아이콘: 위쪽 상태 칩, 행동 카드(분야별 색 타일), 행동 분류, 탭, 모바일 하단 메뉴, 이달의 미션',
  '추가|직급 휘장 8종: 수습부터 사장·대표까지 직급마다 휘장이 생겼다. 승진 발령장에 큼직하게 떠오르고, 현황 카드의 내 얼굴 자리와 수첩의 커리어 연대기에도 붙는다',
  '조정|차장·부장도 이달의 미션에 "광고·협찬 1건 따내기"가 나온다 (차장은 광고국 첫 미팅 뒤부터). 영업 시도가 아니라 계약 성사를 센다',
  '조정|아이템 등급(파급력)을 현실 감각에 맞게 다시 매겼다. 같은 의혹이라도 대통령실·여당 대표·대기업 반도체 공장 쪽이면 무겁게, 구청장·정당 청년위·상조회사 쪽이면 가볍게. 철근 누락 아파트·훈련병 사망·사이버 범죄 단지 감금·오디션 투표 조작 같은 대형 사안은 올리고, 통계 기사·찬반 논쟁·업계 뒷이야기는 내렸다. 같은 아이템인데 운에 따라 등급이 크게 출렁이던 폭도 줄였다',
  '조정|후속 기사 제목이 "— 윗선 — 윗선 — 윗선…"으로 끝없이 늘어나던 문제를 고쳤다. 후속은 원제목에 꼬리 하나만 붙고, 피해 확대 → 돈의 흐름·윗선 → 감사·수사 → 책임론 순으로 흘러간다. 한 사안의 후속은 4편까지이고, 같은 사안의 후속 아이템은 한 번에 하나만 생긴다',
  '추가|아이템 카드와 취재·넘기기 목록에 그 아이템의 상대(기관·업체·인물)와 나와의 관계 수치가 보인다. 연줄이 없으면 "연줄 없음"으로 표시'],'2026.10.19',['일러스트 대개편','부장 데스크','등급 재조정']],
 ['5.7','승진의 순간',[
  '수정|정기 인사 때 주재지가 비어 있던 주재기자가 "null 주재 차장"으로 발령되던 문제를 고쳤다. 이제 사람이 가장 적은 지역으로 옮겨 배치된다',
  '주요|승진하면 화려한 발령장: 새 직급과 계급별 한 줄, 입사 동기 중 몇 번째인지, 이번 직급 성적표(출고·단독·특종·평판)와 대표작, 상사·동기·후배·라이벌의 반응, 승진 축하금','주요|수첩에 커리어 연대기: 수습 수료부터 직급마다 날짜·연차·회사·성적이 쌓인다. 최소 기간 안에 오르면 "고속 승진" 업적','조정|단독이 너무 자주 나오던 것을 줄였다. 아이템 발굴·브리핑·취재원·후속 기사의 단독 확률을 낮추고, 단독인 줄 알았던 제보도 다섯 중 하나쯤은 타사가 이미 쥐고 있다(아이템에 "타사도 안다" 표시)','조정|기사 보상 차등: 아이템 급(B·A·S)이 클수록 평가·평판 보너스가 붙고(단독이면 1.3배), 확인한 사실 비중만큼 보상이 달라진다. 큰 기사의 파급력 상한도 올려 A급과 S급이 같은 보상을 받던 문제를 고쳤다','주요|아이템 등급에 따라 알아야 할 사실 수가 다르다: C급 2~3개(핵심도 한 출처면 된다) · B급 3~4개 · A급 5개 · S급 6개(핵심 사실은 세 경로). 큰 아이템은 취재 한 번에 시간 칸이 1~2칸 더 주어지고, 작은 아이템은 확인이 조금 쉽다','수정|정치·경제·사회 같은 핵심 부서 인원이 적던 문제. 지역 취재망(주재기자)이 편집국의 큰 몫을 가져가 본사 부서가 2~3명뿐이던 매체(통신사·지역지 등)를 바로잡았다. 주재기자는 매체 유형별 비율 안에서, 핵심 부서는 편집국 규모에 맞는 최소 인원을 둔다','수정|수습 건너뛰기 뒤 이달의 미션이 수습용(사쓰마와리·정보보고)으로 남고 행동력·쿨타임이 정리되지 않던 문제. 이제 새 달 첫 주에 정식 기자로 깨끗하게 시작한다','수정|캡이 명단에서 빠지거나 평기자로 나오던 문제. 캡은 부서의 차장급(아주 작은 부서는 선임 기자)이 맡고, 같은 부서 탭에 "캡"으로 표시된다. 차장이 된 뒤에는 사내 관계에 "옛 캡"으로 남는다','대규모|스토리라인 30편: 평소처럼 일하다 보면 직급·부서·경력에 맞는 이야기가 찾아와 몇 달에 걸쳐 이어진다(제보자를 지켜라·무죄의 기록·특파원의 꿈·대특종의 밤·첫 유료 독자 1,000명 등). 선택에 따라 일찍 끝나기도 하고, 끝까지 가면 칭호가 수첩에 남는다','주요|새 업적: 고속 승진 · 부서장 · 편집국 간부 · 국장'],'2026.10.18',['발령장','커리어 연대기','스토리라인 30편']],
 ['5.6','균형 맞추기',[
  '대규모|창간 모드 취재 개편: 편집국 기자들이 매달 기사를 내고(단독도 터진다), 대표는 "기자에게 취재 맡기기"로 아이템을 넘길 수 있다. 대표 기사도 구독·트래픽에 바로 반영',
  '주요|모바일·태블릿 화면 개편: 아래 탭바(할 일·현황·나·취재·사람·회사)로 한 화면씩. 할 일은 격자로, "다음 달로"는 늘 보이게',
  '주요|광고주 눈치: 큰 광고주를 비판하는 기사를 쓰려 하면 데스크(대표·사장이면 광고국)가 압박한다. 누그러뜨리기·그대로·접기 중 선택',
  '주요|경제 현실화: 월급(대형사 신입 실수령 300만 안팎, 지역·인터넷 170만~200만대)·생활비·광고 비중(신문 60%대)·광고주별 단가를 현실에 맞췄다. 작은 매체의 과한 이익도 정리',
  '주요|회사가 살아 움직인다: 해마다 인력을 늘리거나 줄이고(적자면 구조조정), 경영진이 경쟁사에 맞서 품질에 투자한다. 경쟁사가 끝없이 커져 점유율이 밀리던 문제 수정',
  '조정|아이템: 덜 자주·덜 좋게 들어오고, 능력치·연차가 높을수록 질이 오른다. 막 생긴 회사엔 규모에 맞는 아이템',
  '조정|지면: 면 톱 배정이 1면으로 나가던 버그 수정. 단독은 면 톱까지 자주, 1면은 1년에 한두 번. 온라인 매체는 홈페이지 메인·섹션 톱으로 표기',
  '조정|행동력: 기사 쓰기 1(표시만 1이고 실제 2가 빠지던 문제 수정), 창간 모드 취재 나가기 1',
  '조정|수습 뒤 부서는 대개 회사가 배치(인기 부서는 어렵다). 출입처 장악도는 천천히 오르고, 신뢰도는 높을수록 덜 오른다',
  '조정|보도 뒤 반응(광고 무마·화해·보복)이 화해로 쏠리던 것을 고르게',
  '수정|미션: 광고 영업이 실패해도 "따내기" 미션이 달성되던 문제, 장악도가 다 찼는데 장악도 미션이 나오던 문제. 추천 목록은 미션에 맞는 일을 먼저',
  '수정|부서를 옮겨도 조직 탭 부서장·부원이 그대로이던 문제. 금액 표기("21천만 원" → "2억 1천만 원")',
  '수정|관계망(대외 관계)에 정부 기관만 뜨고 광고주·정당·인물이 0곳이던 문제. 이제 출입처 분야의 기업·인물, 정치·지역 담당이면 정당, 회사 큰 광고주 두세 곳은 처음부터 안다. "대외 관계"가 발령 직후 한 달 잠기던 것도 풀었다','수정|전국부·지역 부서에서 사내 관계의 부장·캡·선배가 조직 명단에 없던 문제. 본사 데스크가 명단 맨 앞에 보인다','조정|오보 위험을 낮췄다(반론 없음·핵심 사실 한 출처만일 때). 평기자 승진의 오보 조건은 1년 2건 이하로. 간부의 취재원 만나기로 평판이 끝없이 오르던 것도 한 달 두 번까지로. 정기 인사 문구가 매번 똑같던 것 수정','조정|기사 기본 완성도를 조금 올렸다(추천대로 쓰기 감점도 줄임). 창간 모드는 돈이 쌓이는데 편집국이 작으면 공동창업자가 채용을 권한다','조정|팝업 줄이기: 아이템이 하나면 고르는 창을 건너뛴다. 스토리 모드는 손보는 동안 닫아 둔다(진행 중이던 스토리 저장은 정리됨)'],'2026.10.18',['창간 편집국','모바일 탭바','광고주 눈치','경제 현실화','살아 있는 회사']],
 ['5.5','커리어가 움직인다',[
  '주요|불쾌함 줄이기: 할 일 맨 위 경고 상자(곧 물먹을 단독·마감·컨디션·평가·신뢰·자금·다음 달 인사), 물먹기·오보·정정·권고사직 뒤 "다음엔" 팁, 큰 악재 뒤 두 달은 위기·오보 발각이 쉬어 간다, 권고사직이어도 재취업 길은 항상 하나 이상. 결과 카드는 최대 2장만 작게 떠서 화면을 가리지 않는다',
  '주요|자동 저장 3개(최근 3달)를 저장 메뉴에서 불러와 실수를 되돌릴 수 있다. 12월 결산 뒤엔 1년 결산(출고·단독·1면·평가·평판·통장·올해의 기사)',
  '주요|이달의 미션 개편: "버튼 N번" 대신 결과 미션(완성도 55 이상 기사·단독 기사 출고·반론 받은 기사·지면 배정·출입처 장악도 +5·취재원 신뢰 +10·단독 물먹지 않기·굵직한 정보보고·1면 대결 승리·흑자·사기 지키기 등). 미션마다 "어떻게" 한 줄, 지금 해낼 수 있는 것만 나온다. 스토리 모드에선 미션이 뜨지 않는다',
  
  '수정|조직 탭의 부서장·같은 부서 명단·사내 관계의 부장/캡/선배가 서로 다른 사람으로 나오던 문제. 이제 회사 명단 하나를 함께 쓴다',
  '수정|수습 정보보고로 선배가 쓴 기사(공동 바이라인)의 선배가 같은 부서 명단에 없는 사람으로 나오던 문제. 이제 같은 부서 3년 차 이상 선배(없으면 캡)가 쓰고, 그 선배와 관계가 오른다',
  '수정|승진 조건에서 나이(차장 31세 등)를 빼고 연차 기준으로 바꿨다. 23세에 입사하면 8년, 29세에 입사하면 2년을 기다리던 문제. 대신 필요 연차를 조금 늘렸다(★3 기준 차장 4년·부장 7년, ★5 차장 6년·부장 10년). 이직할 때 직급 대우도 연차로 정한다',
  '대규모|승진 정상화: 평가가 기준값으로 끌려가는 힘과 평판이 사라지는 속도를 크게 줄였다. 열심히 하면 3~5년 안에 차장(큰 회사일수록 느림), 대충 하면 제자리. 승진 막대는 재직·평가·평판·조건을 모두 반영한다',
  '주요|커리어 이정표: 첫 바이라인·첫 단독·첫 1면·단독 5건·기사 30건·첫 승진·기자상 등 14단계 중간 목표가 수첩에 차례로 뜨고, 이룰 때마다 보상',
  '주요|이달의 미션 손질: 할 수 없는 미션(잠긴 일·아이템 없는 수습의 취재)이 나오지 않고, 아침 발제처럼 행동력 0인 일도 집계된다. 달성률 약 15% → 45~55%. 3달 연속 모두 달성하면 평판·평가와 단독 제보 보상',
  '주요|라이벌이 살아 움직인다: 내 단독을 같이 쫓고(밤샘 확인·따돌리기), 먼저 단독을 터뜨리고(후속으로 반격), 기자실 술자리에서 정보를 맞바꾸고, 큰 매체로 옮겨 간다. 단독 대결에서 크게 앞서면 라이벌이 인정한다',
  '주요|돈 쓸 곳: "월급 쓰기 → 내 돈으로"에 사비 탐사 프로젝트(500만·확인이 반쯤 된 단독), 데이터 저널리즘 과정(200만), 단기 어학연수(400만), 언론대학원(1,500만·능력치·평가·평판) 추가',
  '주요|행동력이 남았는데 "다음 달로 넘기기"를 누르면 한 번 묻는다. 남은 행동력·못 한 미션·지금 할 수 있는 일을 보여 주고, "다음부터 묻지 않기"로 끄고 메뉴 → 설정에서 다시 켤 수 있다',
  '수정|코인 투자: 매달 평균 +5%로 오래 묵히면 무조건 벌던 문제. 이제 평소엔 ±20% 안팎(평균 +1% 정도), 가끔 폭락(-50~-80%)·폭등(+60~+120%)이 있다'],'2026.10.18',['승진 정상화','커리어 이정표','미션 손질','라이벌 이벤트','돈 쓸 곳']],
 ['5.4','플레이 경험 개편',[
  '대규모|이달의 미션: 할 일 맨 위에 이번 달 목표 2~3개가 뜬다(기사 출고·단독 확보·사쓰마와리 등). 하나 이루면 평가↑, 다 이루면 다음 달 행동력 +1. 해당 행동엔 "미션" 표시, 아래 줄엔 다음 승진까지 모자란 것',
  '대규모|팝업 대폭 정리: "확인"만 있던 결과 팝업은 화면을 막지 않는 결과 카드로(기록 탭에 남는다). 출고·결산·승진 같은 중요한 순간은 그대로. 한 달 팝업 약 35% 감소',
  '주요|사쓰마와리 한 화면: 동선(경찰서 세 곳)을 한 번에 고르고, 두 번째부터 "평소처럼 돌기"로 보고까지 자동. 수습 첫 달 팝업 30개 → 7개',
  '주요|빠르게 넘기기: 취재 중 "추천 기법으로 끝까지", 기사 쓰기 "추천대로 쓰기"(제목만 고른다·완성도 조금↓)',
  '주요|선택지 다양화: 출입처 브리핑에 그날 상황(해명·예산 발표·긴급·인사·정책)이 붙고 선택지 8가지 중 3개가 나온다. 동료마다 역할별 특별 선택지. 같은 달 같은 일을 세 번째부터 하면 효과가 줄어든다',
  '주요|월말 정리: 무작위 사건은 한 달 최대 2개(간소화 1개). 결산에 이달의 미션 결과',
  '주요|시작 간소화: "바로 시작하기"(시험 없이 추천 매체 3곳 중 입사), 언론고시 상식 5문제·면접 3문항, 불합격 땐 수시 채용 제안, 나이·난이도·전공·스펙은 "자세히 설정"으로. 첫 안내는 3쪽짜리로',
  '주요|성취감: 내 기사가 1면·첫 꼭지에 실리면 내일 자 지면(방송은 메인뉴스 화면)으로 보여 준다. 수첩 탭 "진행 중인 이야기"(쫓기는 단독·후속·분쟁·광고주·라이벌 전적). 수습은 굵직한 정보보고가 선배 기사로 이어지면 공동 바이라인',
  '주요|행동력 재조정: 거의 모두 12로 같던 행동력을 "기본 6 + 항목마다 ±1"로 바꿨다. 직급·매체·부서에 따라 8~10(간소화 7~9, 창간 10~11). 보너스가 실제 차이를 만들고, 한 달이 덜 늘어진다. 미션 보너스는 행동력 옆에 따로 표시',
  '주요|가독성 개선: 본문 글꼴을 손글씨체에서 읽기 쉬운 고딕(IBM Plex Sans KR)으로 바꾸고, 글자 크기·줄간격·흐린 글씨 대비를 올렸다. 한글이 단어 중간에서 끊기지 않고, 모바일 할 일 카드는 한 줄씩 넓게',
  '주요|기록 탭 개편: 달별로 묶고, 성과·사건·기사·취재·인사·돈·사람으로 분류해 골라 볼 수 있다. 결과 카드도 여기서 다시 본다. 긴 글도 줄이 맞는다',
  '주요|그래픽: 팝업의 SVG 그림을 신문 섹션 라벨(사건·단독·광고 등)로 바꾸고, 타이틀 화면을 정리했다(빈 카드 정리·3단계 안내)'],'2026.10.17',['이달의 미션','팝업 35% 감소·결과 카드','사쓰마와리·기사 빠르게','바로 시작하기','1면 지면 연출']],
 ['5.3','매체 성장과 추락',[
  '대규모|매체 위상이 움직인다: 별점은 출발점일 뿐. 구독·방문자·수익·점유율·품질·신뢰에 따라 광고 규모·인력이 매달 조금씩 늘거나 줄고, 해마다 별이 오르거나 떨어질 수 있다. 경쟁사와 다른 매체도 성적에 따라 오르내린다 (회사 탭 「회사 위상」)',
  '주요|본사 승진 적체 해소: 연차가 찼는데 윗자리가 막힌 본사 기자는 지역 책임자로 승진 발령된다 (본사 차장 → ○○ 주재 부장 등). 지역마다 국장(지역본부장·총국장)·부장·차장 자리가 규모에 맞게 하나씩 있고, 같은 직급이 겹치면 위 자리로 오르거나 본사로 돌아온다. 막힌 50대는 명예퇴직·교수·홍보 임원 등으로 빠지고, 정년·이직으로 사람이 돌아 비율이 유지된다',
  '주요|아주 작은 회사·막 생긴 회사(신생 매체·창간 초기)는 체계가 느슨해 주재기자도 차장·부장·국장 직함을 자유롭게 단다. 창간 모드는 주재지가 2명 이상이면 책임자를 둔다',
  '주요|야마 잡기가 기사마다 다르다: 선택지가 그 기사의 핵심 사실·현장·증언·숫자로 만들어지고, 휴먼 스토리·데이터 기사·생활 밀착 야마가 새로 생겼다. 기사마다 "맞는 야마"가 하나 숨어 있어 맞히면 완성도·파급력↑. 상식·글솜씨가 높거나 자기 부서 기사면 추천이 보인다',
  '주요|화면 재배치: 넓은 PC는 스크롤 없이 한 화면(왼쪽 할 일 · 가운데 편집국·상황판 · 오른쪽 탭)에 담는다. 모바일은 머리글을 한 줄로 줄이고 상황판을 옆으로 넘기는 카드로 바꿔 할 일을 맨 위로 올렸다. 스크롤바는 얇게, 필요할 때만 보인다',
  '주요|임기제 인물: 단체장·교육감은 지방선거(4년마다 6월 선거·7월 취임, 3선 제한), 지역구 의원은 총선, 대통령실·장관은 정권 교체기, 기관장·협회장은 각자 임기 끝에 바뀐다. 재선·연임하면 관계가 이어진다. 1월·7월마다 무작위로 바뀌던 문제를 고쳤고, 관계망에서 다음 선거·임기 만료 시기를 볼 수 있다. 이직해도 같은 인물은 그대로다',
  '주요|기자 명단에 재직 연차 표시: "경력 12년 차 · 재직 5년 차"처럼 지금 회사에 몇 년째인지 보인다 (경력 입사 기자 구분)',
  '주요|광고 집행 주기 다양화: 작은 매체·창간 매체도 매달·2~3개월마다 광고를 주는 곳이 섞이고, 관공서도 매달·격월 소액 집행이 있다. 주기가 길수록 한 번에 묶어서 나가 연간 총액은 같다',
  '주요|광고 금액에 굴곡: 집행할 때마다 ±15% 흔들리고, 관공서는 연말 예산 집행 때 늘고 연초엔 줄며, 기업은 가정의 달·추석·연말에 는다. 가끔 캠페인 증액(+45%)이나 예산 축소(-30%)도 있다. 평균은 그대로라 재정 균형은 유지된다',
  '수정|차장 이상이나 경력 기자로 시작하면 관계망·사내 관계·회사·조직 탭이 몇 달 동안 잠겨 있던 문제 (예: 온뉴스24 국장). 간소화 모드에서 관계망 탭이 아예 안 보이던 문제',
  '수정|부장 이상이 있는 부서에 "부장 직무대리"가 함께 부서장으로 나오던 문제. 내가 부장인 부서에 다른 부서장이 잡히던 문제',
  '수정|본사 차장이 지역 주재로 나가며 평기자로 강등되던 문제'],'2026.10.17',['매체 위상 변동','본사 승진 적체 해소','기사마다 다른 야마','PC·모바일 화면 재배치']],
 ['5.2','간소화 모드 손질',[
  '주요|초반 숨통: 평기자~부장은 매달 첫 취재 1번이 행동력 없이 된다(출입처 정기 취재). 창간 대표는 첫 2년 동안. 취재만 하다 다른 일을 못 하는 문제를 줄였다',
  '주요|아이템 등급 보정: A급은 확인 성공률 10%↓·상대 경계 20% 빠르게, S급은 성공률 20%↓·경계 40% 빠르게·핵심 사실 세 경로 확인. C급은 조금 쉽다. 대신 취재 시간 칸이 직급에 따라 완만하게 는다 (차장 +1 · 부국장 이상 +1 · 창간 대표 +1, 3년 차부터 +2)',
  '주요|아이템 순환: 공통(비단독) 아이템은 철이 빨리 지나 1~1.5달이면 사라지고(남은 시간은 "달 · 행동 몇 번"으로 표시), 최대 보유는 6건. 아이템 탭에서 직접 "접기"도 된다. 아이템이 적을 때는 새 아이템이 더 잘 들어오고, 쌓일수록 덜 들어오는 감소 폭은 완만해졌다 (수습은 조금 덜)',
  '주요|아이템 넘기기에 조건과 보상: 그냥 · 공동 바이라인(성공 확률↑) · 내 출입처 아이템과 맞교환 · 밥 사며 · (데스크) 지시로 맡기기 중에 고른다. 넘겨받은 쪽은 빚을 지고, 나중에 아이템 귀띔·당직 대타·회의에서 기사 밀어주기로 갚는다',
  '주요|아침 발제: 데스크 반응이 다양해졌다 (다른 부서와 겹쳐 강등 · 타사에 비슷한 기사 · 광고 얽힘에 머뭇 · 각도 지적 · 국장의 관심 · 보류 · 선배·막내의 도움 등). 면 톱·1면은 이제 자주 안 준다 — 큰 매체일수록, 최근 1면·면 톱을 받았을수록, 연차가 낮을수록 다른 발제와의 경쟁에서 밀린다. 기사 지면 배치(1면)도 같은 기준으로 깐깐해졌다',
  '대규모|간소화 모드를 이름답게: 행동마다 붙던 추가 행동력이 없어지고(한 달 행동력 6~9), 수습 기간은 한두 달 짧게(작은 매체 2개월 · 중견 3개월 · 메이저 4개월), 승진 재직 기간은 25% 짧다',
  '주요|간소화 모드는 끼어드는 일이 적다: 동료·관계망 이벤트가 절반 이하로 줄고, 광고주와의 줄다리기·오보 발견도 덜 자주 온다. 가벼운 정정과 중간 정도 오보는 자동으로 \"바로잡습니다\" 처리',
  '주요|간소화 모드 수습: 내가 맡은 수습의 탈락 확률이 10%p 낮고, 사수 부담(컨디션)도 절반',
  '주요|수습이 끝나면 여러 부서로 흩어지고, 수습도 떨어질 수 있다 (사회부 수습 탈락 확률 약 40% · 1월·7월에 약 50% 확률로 배치)',
  '주요|인력 수급 균형: 부서가 붐비면 다른 부서 발령·이직·진로 변경이 늘고, 경쟁사도 북적이는 곳과 갓 키운 후배를 노린다. 회사 인원이 불어나면 고참 명예퇴직이 는다'],'2026.10.17',['간소화 모드: 행동력 추가 비용 없음 · 수습·승진 짧게','끼어드는 이벤트 절반 이하','수습 배치·탈락 · 인력 수급 균형']],
 ['5.1','수습기자 · 광고 주기 · 보기 쉬운 화면',[
  '대규모|수습기자: 사회부 계열 부서에는 1월·7월 공채 시즌에 수습이 배치될 수 있다(확정이 아니라 시즌마다 절반쯤). 최종 평가에서 열에 넷은 떨어진다. 사수를 맡아 직접 가르치면(컨디션↓·정보보고 거리↑) 든든한 후배나 제자가 되고, 기본만 챙기거나 혹독하게 굴릴 수도 있다(못 버티고 떠날 수 있다)',
  '대규모|채용에서 수습기자를 뽑을 수 있다: 인건비가 싸고(수습 기간 약 40% 할인) 3년간 잘 떠나지 않으며 빨리 크지만, 실력이 낮고 수습 기간엔 전력 외이며 선배들 시간이 들고 실수가 잦다. 경쟁 매체도 해마다 수습을 뽑는다',
  '주요|경쟁사 AI: 우리와 틀어진 광고주를 낚아채고, 우리 \"몰래 수정\"이 들통나면 사설로 저격한다. 매체마다 임금 수준이 달라 처우가 좋은 곳이 기자를 더 잘 빼 가고, 낚시 기사를 남발한 곳은 무더기 정정에 나선다',
  '수정|할 일 창의 취소·닫기·뒤로 버튼이 사라지던 문제',
  '대규모|비판 보도 뒤 줄다리기: 기사가 나가면 광고주·기관과 관계가 틀어지고, 몇 달 뒤 ① 광고로 후속 보도를 무마하려 하거나 ② 화해하고 1년간 광고를 늘리거나 ③ 광고 장기 중단·협찬 철회·자료 거부·법적 대응으로 보복한다. 받으면 돈, 거절하면 신뢰 — 무마를 받았다가 들키면 오보급 논란',
  '주요|수습 기간: 작은 매체(★1~2) 3개월 · 중견(★3~4) 4개월 · 메이저(★5) 6개월. 수습 평가 기준도 매체마다 다르다 — 큰 곳일수록 평가 문턱이 높고, 정보보고 횟수와 함께 신문·지역지는 사쓰마와리, 통신사는 속도, 방송사는 방송감, 온라인은 출고 기사, ★4 이상은 캡과의 관계, ★5는 캡 미션까지 본다. 못 채우면 한 달씩 두 번까지 연장',
  '주요|모든 할 일에 같은 자리(아래 줄) "← 뒤로"·"취소": 여러 단계로 된 할 일은 행동력을 쓰기 전까지 어느 단계에서든 이전 창으로 돌아가거나 그만둘 수 있다',
  '주요|할 일 선택지 정리: 설명을 효과 칩으로 쪼개 좋은 효과는 초록, 나쁜 효과는 빨강, 성공률은 파랑으로 보여 준다. 취소·뒤로·닫기는 아래 작은 버튼 줄로 모았고, 선택지가 많으면 2열로 놓는다. 부서 사람 목록도 이름 위주로 짧게',
  '주요|수습 건너뛰기: 진행 막대 아래 버튼(또는 메뉴 → 커리어 관리)으로 남은 수습을 자동으로 보내고 바로 발령받는다. 대신 능력치는 직접 할 때의 60%쯤만 오르고, 취재원은 2명(신뢰 낮음), 캡과의 관계도 덜 쌓인다',
  '수정|수습 사쓰마와리·뻗치기에서 기사 아이템이 너무 자주, 수습이 다루기 힘든 큰 소재로 나오던 문제: 이제 대부분 정보보고 거리·취재원·물먹은 소식이고, 아이템은 드물게 동네 사건사고급 단신만 나온다 (스토리 "물먹은 수습"은 예외)',
  '주요|관계망·사내 관계 화면 개편: 맨 위에 관계 분포 막대와 광고 중단·자료 거부·이번 달 광고 요약, 분류 버튼(정부·기관/광고주/정당·인물/주의/광고 집행 임박), 한 줄짜리 목록과 관계 막대 — 누르면 자세히 펼쳐진다. 간소화 모드는 "나" 탭에 관계 한눈에 보기 카드',
  '대규모|광고 집행 주기: 기관·기업 광고가 매달 · 2개월마다 · 분기마다 · 반년마다 · 1년에 한 번 등 곳마다 다른 주기로 몰아서 들어온다(정부 기관은 주로 반기·연 단위). 1년 총액은 그대로라 재정 평균은 같고, 달마다 들쭉날쭉하다. 관계망에 주기·1회 금액·다음 집행 시기가 나오고, 회사 탭에 이번 달 들어온 광고 내역이 보인다',
  '주요|메뉴를 2열 버튼 8개로 줄이고, 모드 전환·결과 창·팁·소리는 "설정"으로, 결산·새 커리어는 "커리어 관리"로 모았다',
  '대규모|기사 소재 294개 추가: 사회·지역·문화·연예 각 50개, 정치 25개·경제 24개·스포츠 24개·국제 21개 (기존 소재와 겹치지 않게)',
  '주요|광고 영업 화면 개편: 분기 실적·목표를 막대로 보여 주고, 광고주마다 관계·성공률·광고 비중을 표시한다. 제안마다 성공률과 예상 금액이 나오고 추천·위험 표시가 붙는다. 사장 광고 영업은 대형 광고주 순회·공공기관 담당 미팅·단가와 연간 계약 중에 고른다',
  '대규모|부서마다 기관·기업·인물 70여 곳 추가 (선관위·국정원·방산 기업·배터리·카드사·국민연금·토지주택공사·AI 기업·헌법재판소·소방청·감사원·의사협회·입시학원·콘텐츠진흥원·티켓 플랫폼·배구연맹·도핑방지위원회·군수 등). 그 부서가 있는 매체에만 생기고, 기사 소재와 연결된다',
  '수정|부서를 새로 만들어 광고만 뽑아 먹는 편법을 막았다: 새 부서의 기관·기업은 처음엔 우리를 모르고 광고가 1년에 걸쳐 천천히 붙는다. 부서 수는 인력에 맞춰 제한되고, 부서마다 운영비가 들며, 없앤 부서는 2년 안에 다시 만들 수 없다'],'2026.10.17',['수습기자 배치·채용','광고 집행 주기와 비판 보도 뒤 줄다리기','기사 소재 294개 · 부서별 기관 70여 곳','관계망·선택지·메뉴 화면 개편']],
 ['5.0','직급마다 다른 재미 · 살아 있는 언론 시장',[
  '대규모|직급마다 고유 시스템: 수습 캡 미션 · 출입처 장악도 · 제자 키우기 · 부서 성적표 · 1면 대결 · 어젠다 캠페인(편집국장) · 이사회 KPI(사장)',
  '대규모|나이와 정년: 수습은 23~29세, 창간은 35세 이상에서 시작. 기자 정년 60세, 임원 65세. 선임기자로 연장하거나 퇴직금으로 창간할 수 있고, 창간 대표는 70세 이후까지 현역으로 뛸 수 있다',
  '대규모|언론 시장이 움직인다: 해마다 새 매체가 창간되고 돈이 바닥난 매체는 폐간된다. 경쟁사 AI는 우리 광고 단가·특종·행사·폐간 매체·임금과 사기에 반응하고(사기가 낮으면 기자를 빼 간다), 난이도가 높을수록 영리하다',
  '대규모|광고 단가와 수주: 매체 파워(급·포털 등급·평판·트래픽)에 따라 단가를 올리거나 내리고, 광고 문의가 먼저 들어오기도 한다. 조건 붙은 광고는 신뢰를 깎는다',
  '대규모|임금 조정(편집국장: 수당·성과급 / 사장·창간 대표: 기본급 ±20%): 구성원 사기가 생기고, 깎으면 사표·노조 반발·경쟁사 스카우트, 적자 속 인상은 이사회·투자자 반발, 인건비가 매출을 잡아먹으면 재정이 무너진다. 같은 부서원 월급도 보인다',
  '대규모|승진 조건 재정비: 연차와 함께 직급마다 실적을 본다 (차장: 기사 실적·무오보 / 부장: 단독·출입처 장악도 / 부국장: 부서 성적·특종 / 국장 이상: 1면 대결·기자상·신뢰). 간부는 나이도 본다. 큰 회사는 순환 보직으로 여러 부서를 거쳐야 한다',
  '대규모|오보·부실 기사·정정: 미확인 사실·반론 누락·낚시 제목·허위 제보로 나간 기사는 몇 달 안에 독자·당사자·경쟁지·미디어 비평·사내 심의실이 찾아낸다. "바로잡습니다" 정정·반론보도·몰래 수정·기사 삭제·사과문·버티기 중에 고르고, 몰래 고치다 들키면 더 크게 다친다. 정정에 솔직하면 다음 타격이 줄고, 1년에 오보 3건이면 징계위원회. 데스크는 부서원 기사도 책임진다',
  '주요|스토리 모드 5편에 새 장면 14개: 수습의 허위 제보 함정 · 지방지의 행사 공동 주최 딜레마 · X파일의 가짜 결정판 문건 · 공영방송 정정보도 코너와 수당 요구 · 적자 매체의 임금 구조와 광고 단가 협상',
  '주요|고르기 쉬운 선택지: 기사 쓰기는 단계 표시와 추천·위험 표시, "확인된 것만" 한 번에 고르기 · 취재는 가장 좋은 방법에 추천 표시 · 인사권은 부서별로 걸러 보고 승진 연차가 된 기자를 한 번에 고른다 · 부서 이동은 인기·선호 표시',
  '주요|동료 기자들도 나이를 먹는다: 주니어는 빨리 크지만 쉽게 떠나고, 5~12년 차는 경쟁사가 노리며, 고참은 후배를 키운다. 60세면 정년퇴직하고 후임이 오며, 연차가 차면 자동으로 승진한다(인사권자가 아닐 때). 사진·편집 등 지원 부서 인사는 자동',
  '주요|제보와 아이템 중 아주 가끔 허위 제보(약 2%)나 파 보니 알맹이가 없는 아이템(약 5%)이 섞인다',
  '주요|이직 조건: 공고마다 월급 변화·직급 대우·이적 보너스·승진 속도·간판 크기·논조를 "좋은 점 / 아쉬운 점"으로 정리하고 한 줄로 요약한다. 스카우트급 기자는 이적 보너스를 받지만 2년 안에 나가면 돌려줘야 한다',
  '주요|부서 이동 조건: 정치부·법조·탐사·외교안보 같은 인기 부서는 연차·평가·능력치 조건이 붙고 경쟁이 세다. 사건팀·지역 주재는 잘 받아 준다. 순환 보직도 실력에 맞는 곳으로 간다',
  '대규모|새 이벤트 30여 개: 광고주 단가 항의 · 덤핑 공세 · 폐간 매체 기자 영입 · 신생 매체 러브콜 · 방송 출연 · 받아쓰기 항의 · 맞불 행사 · 제자 슬럼프 · 지원사업 공모 · 정년 등',
  '주요|할 일을 마치면 결과 창에 무엇이 바뀌었는지(능력치·평가·돈·관계 등) 보여 준다. 간소화 모드는 알림으로만 빠르게. 메뉴에서 끌 수 있다',
  '주요|속보 · 단독 · 특종 · 대특종 등급이 확실해졌다. 대특종은 후속 아이템과 경쟁사 반응까지 이어진다',
  '주요|처음 하는 사람에게는 기능과 탭이 몇 달에 걸쳐 천천히 열린다 (창간 모드는 따로). 튜토리얼도 새로 썼다',
  '주요|창간 초반 숨통: 난이도에 따라 지원금·박봉 기간·파산 기준·마지막 자금줄이 다르다',
  '주요|부서마다 개성과 특수 효과 · 내 돈으로 하는 일 9가지 · 희망퇴직·권고사직 · 창마다 2D 그림',
  '주요|부서 신설은 이제 조직 개편이다. 기존 기자를 발령하거나 새로 뽑고, 늘어난 인원만큼 매달 인건비가 든다 (계약금 없음)',
  '수정|선택지가 많은 창(취재 중 등)에서 버튼이 눌려 글자가 겹치던 문제 · "취재원과 골프"를 고르면 멈추던 문제 · 간소화 모드 승진·신뢰가 너무 빠르거나 무너지던 밸런스 · 작은 회사에서 20대에 부장이 되던 문제(이직 대우도 나이를 본다)',
  '수정|경력 채용 비용을 "계약금"에서 현실적인 영입 비용(채용 절차·첫해 처우 인상분)으로 바꾸고 크게 낮췄다'],'2026.10.17',['직급마다 고유 시스템 7종','나이·정년·은퇴, 퇴직 후 창간','임금 조정과 사기 · 승진·부서 이동 조건 정비','광고 단가·수주와 똑똑해진 경쟁사 · 새 이벤트 30여 개']],
 ['4.12','지자체 행사 사업',[
  '대규모|행사 사업 유치(국장 이상·창간 대표): 마라톤·탁구대회·자전거대회·가요제·지역 축제 등 12종. 보조금·공동 주최·협찬 방식, 준비 중 사건, 당일 날씨·안전사고, 정례 행사'],'2026.10.17'],
 ['4.11','취재의 재미 · 수익 다변화',[
  '대규모|아이템 등급(S·A·B·C)과 취재 중 "현장의 순간"·반전',
  '대규모|수익 다변화(사장·창간 대표): 뉴스레터·영상·포럼·멤버십 등 8가지 사업',
  '주요|매체 규모·성격에 따라 지역 주재기자가 다르고, 채용 지원자 일부는 지역 주재를 희망한다'],'2026.10.17'],
 ['4.10','되돌리기 · 편집회의 개편',[
  '주요|기사 쓰기와 여러 단계로 된 할 일에 이전 단계·취소 버튼',
  '주요|편집회의: 발제 5~6건을 한눈에 보고 1면 톱·하단·안쪽·보강·킬을 정한다'],'2026.10.17'],
 ['4.6~4.9','같은 부서 사람들 · 광고 현실화',[
  '대규모|"부서 사람들과": 동료와 밥·노하우·공동 취재·원고 검토, 부서 이벤트 15개, 부서 규모·분위기 효과',
  '주요|편집국장·사장은 현장 대신 지휘와 경영을 한다',
  '수정|광고 금액을 현실에 맞게 낮췄다 (한 곳당 최소 월 50만 원). 정부 기관·협회도 기본 광고 비중을 갖는다'],'2026.10.17'],
 ['4.3~4.5','현실감 대개편 · 창간 10년 연대기',[
  '대규모|언론중재위원회·명예훼손 소송, 매체 특성 14종, 경쟁사 AI, 회사 규모별 승진과 이직 직급 재조정',
  '대규모|창간부터 10주년까지 이어지는 장면 41개와 창간 전용 이벤트',
  '주요|탭을 나·취재·사람·회사로 묶고, 능력치를 누르면 역할과 효과가 나온다',
  '수정|행동력·평가·평판·신뢰·능력치 성장을 전반적으로 어렵게 조정 · 동료 실력을 연차에 맞춤 · 생활비 현실화 · 창간 구성원 신뢰가 0까지 떨어지던 문제'],'2026.10.17'],
 ['4.1~4.2','이름 · 소리 · 창간 개편',[
  '대규모|창간 모드 개편: 대표이자 1호 기자로 시작',
  '주요|메인 화면에서 이름 정하기 · 로딩 화면 · BGM 9곡과 효과음 17종 · 튜토리얼 그림',
  '수정|창간할 때 취재원이 12명으로 잘리던 문제 · 로딩 화면이 가끔 안 사라지던 문제 · 모바일에서 화면이 넘어갈 때 맨 위로 가지 않던 문제'],'2026.10.17'],
 ['4.0','4.0까지의 주요 기능',[
  '대규모|수습부터 사장까지 · 50개 매체 · 사실 교차 확인과 5단계 기사 쓰기 · 언론고시·스토리·창간·간소화 모드 · 관계망·포털 제휴·경쟁 매체']]
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