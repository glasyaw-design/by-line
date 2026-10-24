/* 바이라인 1.6 — src/compat/v25.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.32 지원자 프로필 (GPT 시안): 왼쪽 캐릭터 · 오른쪽 그림 카드 =====
const CR_SM=[['exam','언론고시','원하는 매체 4곳에 지원해 서류·필기·면접을 본다'],['smb','중소 매체','수시 채용으로 바로 입사 · 작은 곳에서 크는 길'],['quick','빠른 시작','3년 차·부장·국장·편집국장으로 바로'],['found','창간','발행인으로 내 언론사를 세운다']];
const CR_RADAR=[['inv','취재'],['wri','문장'],['ver','검증'],['net','인맥'],['sta','체력'],['kno','상식']];
function crBonus(){const b=Object.assign({},bonusOf());const a=S.age0||(S.smode==='found'?40:26);const ad=(k,v)=>{v=Math.round(v);if(v)b[k]=(b[k]||0)+v;};if(S.smode==='found'){Object.keys(STN).forEach(k=>ad(k,14));const d=a-35;ad('net',d*.5);ad('kno',d*.4);ad('sta',-d*.4);}else{const d=a-23;ad('kno',d*.8);ad('cha',d*.4);ad('sta',-d*.3);}return b;}
function crRadar(){const b=crBonus();const v=CR_RADAR.map(([k])=>clamp((ST0[k]+(b[k]||0))/70,.08,1));const cx=110,cy=100,R=78;const pt=(i,r)=>{const a=-Math.PI/2+i*Math.PI*2/6;return [cx+Math.cos(a)*R*r,cy+Math.sin(a)*R*r];};
  const ring=r=>CR_RADAR.map((_,i)=>pt(i,r).join(',')).join(' ');
  return `<svg class="crrad" viewBox="0 0 220 200" aria-hidden="true">${[.33,.66,1].map(r=>`<polygon points="${ring(r)}" fill="none" stroke="rgba(150,170,230,.28)" stroke-width="1"/>`).join('')}${CR_RADAR.map((_,i)=>`<line x1="${cx}" y1="${cy}" x2="${pt(i,1)[0]}" y2="${pt(i,1)[1]}" stroke="rgba(150,170,230,.18)"/>`).join('')}
   <polygon points="${v.map((r,i)=>pt(i,r).join(',')).join(' ')}" fill="rgba(255,184,77,.55)" stroke="#ffd27a" stroke-width="2"/>${v.map((r,i)=>`<circle cx="${pt(i,r)[0]}" cy="${pt(i,r)[1]}" r="3.2" fill="#fff3d1"/>`).join('')}
   ${CR_RADAR.map(([k,n],i)=>{const p=pt(i,1.2);return `<text x="${p[0]}" y="${p[1]+4}" text-anchor="middle" font-size="12" fill="#cfd6ee">${n}</text>`;}).join('')}</svg>`;}
function crCard(attr,on,img,name,desc,cls){return `<button type="button" class="crc ${cls||''}" ${attr} aria-pressed="${on}" title="${esc(desc||'')}">${IMG[img]?`<img src="${IMG[img]}" alt="">`:''}<b>${name}</b>${desc?`<small>${esc(desc)}</small>`:''}</button>`;}
{const _cr=createHTML;createHTML=function(){try{if(!IMG.cr_exam)return _cr();
  const sm=S.smode||'exam';const F=sm==='found';const ageL=F?[35,38,40,43,45,48,50,55]:[23,24,25,26,27,28,29];if(S.age0==null||(F&&S.age0<35)||(!F&&(S.age0<23||S.age0>29)))S.age0=F?40:26;
  const face=IMG[`me_${(typeof meG==='function'?meG():'m')}0_1`]||IMG.me_m0_1||'';
  const nextL=sm==='story'?'다음: 스토리 고르기':F?'다음: 창간 준비':sm==='smb'?'다음: 수시 채용':sm==='quick'?'다음: 경력 고르기':'다음: 언론고시 지원';
  const b=crBonus();const top=Object.keys(STN).map(k=>[k,ST0[k]+(b[k]||0),b[k]||0]);
  const MJ=MAJORS[S.major]||MAJORS[0],SP=SPECS[S.spec]||SPECS[0];const fx=o=>Object.entries(o.b).map(([k,v])=>`${STN[k]} ${v>0?'+':''}${v}`).join(' · ');
  const step=(i,ic,n)=>`<a class="crstep" href="#crs${i}"><i>${ic}</i><span>${n}</span></a>`;
  return `<section class="cr25" style="--crbg:url(${IMG.tt_pc||''})">
   <div class="crsteps">${step(1,'📄','시작 방식')}${step(2,'👥','플레이 방식')}${step(3,'🎓','나이·난이도')}${step(4,'🪪','전공·스펙')}</div>
   <aside class="crleft"><div class="crh">지원자 프로필</div>
    <div class="crface">${face?`<img src="${face}" alt="내 얼굴">`:''}</div>
    <div class="crname"><b>${esc(S.name)} 기자</b><button type="button" class="crren" data-go="title">이름 바꾸기</button></div>
    <div class="crh sm">능력치 미리보기</div>${crRadar()}
    <div class="crstat">${top.map(([k,v,d])=>`<span title="${esc(statTitle(k))}">${IMG['st_'+k]?`<img src="${IMG['st_'+k]}" alt="">`:''}<i>${STN[k]}</i><b>${v}</b>${d?`<em class="${d>0?'up':'dn'}">${d>0?'+':''}${d}</em>`:''}</span>`).join('')}</div>
   </aside>
   <div class="crright">
    <button type="button" class="crquick" data-go="quick"><b>바로 시작하기 ›</b><span>처음이라면 이걸로 · 시험 없이 추천 매체 3곳 중 하나로 바로 입사</span></button>
    <div class="crsec" id="crs1"><h4>시작 방식</h4><div class="crgrid g4">${CR_SM.map(([k,n,d])=>crCard(`data-smode="${k}"`,sm===k,'cr_'+k,n,d)).join('')}</div></div>
    <div class="crsec" id="crs2"><h4>플레이 방식 <small>시작하고 2년이 지나야 메뉴에서 바꿀 수 있다</small></h4><div class="crgrid g2">${crCard('data-simple="0"',!S.simple,'cr_full','정통 모드','모든 기능 · 사실 교차 확인 · 기사 5단계 · 관계망','wide')}${crCard('data-simple="1"',!!S.simple,'cr_simple','간소화 모드','핵심만 · 기사는 제목만 · 승진 두 배 빠르게','wide')}</div></div>
    <div class="crsec" id="crs3"><h4>나이 <small>${(()=>{const a=S.age0,d=F?a-35:a-23;if(!d)return F?'창간 대표는 경력이 있어 모든 능력치 +14 · 35세 기준, 나이가 많을수록 인맥·상식↑ 체력↓':'23세 기준 · 늦게 들어올수록 상식·친화력↑ 체력↓';return F?`${a}세 — 인맥 +${Math.round(d*.5)} · 상식 +${Math.round(d*.4)} · 체력 ${-Math.round(d*.4)}`:`${a}세 — 상식 +${Math.round(d*.8)} · 친화력 +${Math.round(d*.4)} · 체력 ${-Math.round(d*.3)}`;})()}</small></h4><div class="cragech">${IMG.cr_age?`<img src="${IMG.cr_age}" alt="">`:''}${ageL.map(a=>`<button type="button" class="chip agc" data-age="${a}" aria-pressed="${S.age0===a}">${a}세</button>`).join('')}</div>
     <h4>난이도</h4><div class="crgrid g3">${Object.keys(DIFF).map((k,i)=>crCard(`data-diff="${k}"`,S.diff===k,['cr_easy','cr_norm','cr_hard'][i]||'cr_norm',DIFF[k].n,({easy:'승진이 빠르고 오보 위험이 낮다',normal:'현실에 가까운 속도 · 실수 한 번은 버틴다',hard:'승진이 느리고 실수 하나가 커리어를 흔든다'})[k]||DIFF[k].d,'wide')).join('')}</div></div>
    <div class="crsec" id="crs4"><h4>전공 <small>${esc(MJ.n)} — ${esc(MJ.t)} · ${fx(MJ)}</small></h4><div class="crgrid gm">${MAJORS.map((m,i)=>crCard(`data-major="${i}"`,S.major===i,'cr_m'+i,m.n,'','tile')).join('')}</div>
     <h4>대표 스펙 <small>${esc(SP.n)} — ${esc(SP.t)} · ${fx(SP)}</small></h4><div class="crgrid gm">${SPECS.map((m,i)=>crCard(`data-spec="${i}"`,S.spec===i,'sp_'+i,m.n,'','tile')).join('')}</div></div>
    <button class="next crnext" data-go="create">${nextL} ›</button>
   </div></section>`;}catch(e){console.error(e);return _cr();}};}
(function(){const st=document.createElement('style');st.textContent=`
body:has(.cr25) .stage{display:none}
.cr25{position:relative;display:grid;grid-template-columns:minmax(260px,340px) minmax(0,1fr);grid-template-areas:"steps steps" "left right";gap:16px;padding:18px;border-radius:22px;border:1px solid rgba(120,140,200,.18);background:linear-gradient(180deg,rgba(12,15,26,.78),rgba(12,15,26,.92)),var(--crbg) center/cover;box-shadow:0 24px 60px rgba(0,0,0,.45)}
.crsteps{grid-area:steps;display:flex;justify-content:center;gap:0;align-items:center}
.crstep{display:flex;flex-direction:column;align-items:center;gap:4px;text-decoration:none;color:#cfd6ee;font-size:12.5px;position:relative;flex:0 1 150px}
.crstep i{width:46px;height:46px;border-radius:50%;display:grid;place-items:center;font-style:normal;font-size:20px;background:#1a2140;border:2px solid #4a67c9;box-shadow:0 0 12px rgba(80,120,255,.3)}
.crstep:not(:last-child)::after{content:"";position:absolute;top:23px;left:calc(50% + 26px);width:calc(100% - 52px);height:3px;background:linear-gradient(90deg,#4a67c9,#ffb84d);border-radius:3px}
.crstep:hover i{border-color:#ffb84d}
.crleft{grid-area:left;border-radius:20px;border:1px solid rgba(120,140,200,.2);background:rgba(16,20,34,.86);padding:16px;display:flex;flex-direction:column;align-items:center;gap:10px;align-self:start;position:sticky;top:10px}
.crh{align-self:stretch;font-family:var(--f-display);font-weight:700;font-size:20px;border-left:5px solid #ffb84d;padding-left:10px}.crh.sm{font-size:16px;margin-top:6px}
.crface img{width:min(190px,60vw);aspect-ratio:1;border-radius:50%;object-fit:cover;box-shadow:0 0 0 4px #ffb84d,0 0 34px rgba(255,184,77,.45)}
.crname{display:flex;flex-direction:column;align-items:center;gap:6px}.crname b{font-family:var(--f-display);font-size:26px}
.crren{border-radius:999px;padding:5px 16px;background:rgba(14,17,28,.9);border:1.5px solid #ffb84d;color:#ffe2a8;font-size:13.5px}
.crrad{width:100%;max-width:260px}
.crstat{display:grid;grid-template-columns:1fr 1fr;gap:4px 10px;width:100%}
.crstat span{display:flex;align-items:center;gap:6px;font-size:12.5px;color:#cfd6ee;min-width:0}
.crstat img{width:20px;height:20px;border-radius:5px}.crstat i{font-style:normal;flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.crstat b{font-family:var(--f-pix);color:#fff}.crstat em{font-style:normal;font-size:11px}.crstat em.up{color:#5ad49b}.crstat em.dn{color:#ff6f61}
.crright{grid-area:right;min-width:0;display:flex;flex-direction:column;gap:14px}
.crquick{display:flex;align-items:center;gap:14px;flex-wrap:wrap;border:0;border-radius:16px;padding:14px 20px;text-align:left;color:#2a1705;background:linear-gradient(90deg,#ffd27a,#ffa23d);box-shadow:0 8px 24px rgba(255,154,61,.35);cursor:pointer}
.crquick b{font-family:var(--f-display);font-size:22px}.crquick span{font-size:13px;opacity:.85}
.crsec{border-radius:18px;border:1px solid rgba(120,140,200,.18);background:rgba(16,20,34,.86);padding:12px 14px;scroll-margin-top:12px}
.crsec h4{margin:4px 0 10px;font-family:var(--f-display);font-weight:700;font-size:17px;border-left:4px solid #ffb84d;padding-left:9px;display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px}
.crsec h4 small{font-family:var(--f-body);font-weight:400;font-size:12.5px;color:#aab3cc}
.crsec h4:not(:first-child){margin-top:16px}
.crgrid{display:grid;gap:10px}.crgrid.g4{grid-template-columns:repeat(4,minmax(0,1fr))}.crgrid.g2{grid-template-columns:1fr 1fr}.crgrid.g3{grid-template-columns:repeat(3,minmax(0,1fr))}.crgrid.gm{grid-template-columns:repeat(auto-fill,minmax(96px,1fr))}
.crc{position:relative;display:flex;flex-direction:column;align-items:stretch;text-align:center;padding:0 0 9px;border-radius:14px;overflow:hidden;border:1.5px solid rgba(120,140,200,.22);background:#141a2d;color:#eef;cursor:pointer;min-width:0}
.crc img{width:100%;aspect-ratio:1.6/1;object-fit:cover;display:block;margin-bottom:7px}
.crc b{font-family:var(--f-display);font-weight:700;font-size:16px;padding:0 6px}
.crc small{font-size:11.5px;color:#aab3cc;padding:3px 8px 0;line-height:1.35}
.crc.wide{flex-direction:row;align-items:center;text-align:left;padding:0;gap:10px}
.crc.wide img{width:84px;height:72px;aspect-ratio:auto;margin:0;flex:none}
.crc.wide b{padding:0}.crc.wide small{padding:2px 8px 0 0}
.crc.wide>b,.crc.wide>small{display:block}
.crc.wide{display:grid;grid-template-columns:84px minmax(0,1fr);grid-template-rows:auto auto;align-content:center;column-gap:10px;min-height:72px}
.crc.wide img{grid-row:1/3}
.crc.tile img{aspect-ratio:1;margin-bottom:5px}.crc.tile b{font-size:12.5px;line-height:1.25;padding:0 4px}
.crc[aria-pressed="true"]{border-color:#ffb84d;box-shadow:0 0 0 1px #ffb84d inset,0 0 20px rgba(255,184,77,.4)}
.crc[aria-pressed="true"] b{color:#ffd27a}
.crc:hover{border-color:rgba(255,184,77,.7)}
.cragech{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.cragech img{width:40px;height:40px;border-radius:10px}
.cragech .agc{border-radius:50%;width:48px;height:48px;padding:0;justify-content:center;font-size:13.5px}
.cragech .agc[aria-pressed="true"]{background:linear-gradient(180deg,#ffd27a,#ffa23d);color:#2a1705;border-color:transparent;width:auto;padding:0 14px;border-radius:999px}
.crnext{align-self:flex-end;min-width:min(360px,100%);position:sticky;bottom:10px}
@media (max-width:900px){.cr25{grid-template-columns:1fr;grid-template-areas:"left" "steps" "right";padding:12px}
 .crleft{position:static;display:grid;grid-template-columns:110px minmax(0,1fr);grid-template-areas:"h h" "face name" "rh rh" "rad stat";align-items:center;gap:8px 12px}
 .crleft>.crh:first-child{grid-area:h}.crface{grid-area:face}.crname{grid-area:name;align-items:flex-start}.crh.sm{grid-area:rh}.crrad{grid-area:rad}.crstat{grid-area:stat;grid-template-columns:1fr}
 .crface img{width:110px}
 .crgrid.g4{grid-template-columns:1fr 1fr}.crgrid.g3,.crgrid.g2{grid-template-columns:1fr}
 .crstep{font-size:11px}.crstep i{width:40px;height:40px;font-size:17px}.crstep:not(:last-child)::after{top:20px;left:calc(50% + 23px);width:calc(100% - 46px)}
 .crnext{align-self:stretch}}
@media (max-width:900px){.crleft .crstat{display:none}.crrad{max-width:190px}}
@media (max-width:480px){.crleft{grid-template-columns:90px minmax(0,1fr);grid-template-areas:"h h" "face name" "rh rh" "rad rad" "stat stat"}.crface img{width:90px}.crstat{grid-template-columns:1fr 1fr}.crrad{max-width:220px;justify-self:center}.crgrid.gm{grid-template-columns:repeat(3,minmax(0,1fr))}.crquick b{font-size:19px}}
`;document.head.appendChild(st);})();