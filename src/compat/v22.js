/* 바이라인 1.6 — src/compat/v22.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.32 첫 화면 (GPT 시안) =====
const TT_MODES=[['exam','언론고시','dp_pol','#77a6ff','원하는 매체 4곳에 지원해 서류·필기·면접'],['smb','중소 매체','md_local','#5ad49b','시험 없이 작은 매체에 바로 입사'],['simple','간소화','st_sta','#77a6ff','핵심만, 승진 두 배 빠르게'],['quick','빠른 시작','st_spd','#c59bff','경력 기자·부장·국장으로 바로'],['found','창간','ai_found','#ffb84d','내 언론사를 세우는 타이쿤']];
{const _tt=titleHTML;titleHTML=function(){const old=_tt();try{const d=document.createElement('div');d.innerHTML=old;
  const h=d.querySelector('section.hero2');const nc=h&&h.querySelector('#ncard');const live=h&&h.querySelector('#live');
  const sh=[...d.querySelectorAll('h2.sech')].find(x=>/어떻게 시작/.test(x.textContent));const md=d.querySelector('.modes');
  if(!h||!nc)return old;if(h)h.remove();if(sh)sh.remove();if(md)md.remove();
  const inp=nc.querySelector('#tnm');const val=inp?inp.value:'';const tbl=nc.querySelector('#tbl');
  const btn=(go,ic2,lb,ex='')=>`<button class="ttc" data-go="${go}"${ex}><i>${ic2.length<=2?`<em>${ic2}</em>`:ic(ic2)}</i><span>${lb}</span></button>`;
  const hero=`<section class="tt22" style="--tpc:url(${IMG.tt_pc||IMG.title||''});--tmb:url(${IMG.tt_mob||IMG.tt_pc||IMG.title||''})">
   <div class="ttcorner l">${btn('sound','♪','소리')}${btn('help','?','도움말')}</div>
   <div class="ttcorner r">${btn('hall','chart','기록실')}${btn('quiz','book','상식 퀴즈')}${btn('load','doc','불러오기')}</div>
   <div class="ttlogo">${IMG.tt_logo?`<img src="${IMG.tt_logo}" alt="">`:''}<h1>바이라인</h1><p>펜 하나로 편집국 꼭대기까지</p><span class="ttver">v${VERSION}</span></div>
   <div class="ttform"><label class="ttname" id="ncard"><span class="tti">${ic('user')}</span><input id="tnm" maxlength="8" value="${esc(val)}" placeholder="기자 이름 (한글·영어 2~8자)" autocomplete="off" enterkeyhint="go" aria-label="기자 이름"><button type="button" class="ttrand" data-go="rname" title="무작위 이름">랜덤</button></label><div class="bl" id="tbl">${tbl?tbl.innerHTML:''}</div>
    <button class="ttnew" data-go="new">새 게임 <b>›</b></button>${hasSave()?'<button class="ttcont" data-go="cont">이어하기</button>':''}</div>
   <div class="ttmodes">${TT_MODES.map(([pm,n,k,c,dsc])=>`<button class="ttm" data-go="new" data-pm="${pm}" style="--mc:${c}" title="${esc(dsc)}">${(IMG['tm_'+pm]||IMG[k])?`<img src="${IMG['tm_'+pm]||IMG[k]}" alt="">`:''}<b>${n}</b><small>${esc(dsc)}</small></button>`).join('')}</div>
   ${live?`<div class="live ttlive" id="live">${live.innerHTML}</div>`:''}
  </section>`;
  return hero+d.innerHTML;}catch(e){console.error(e);return old;}};}
{const _bd=bind;bind=function(){const r=_bd.apply(this,arguments);try{const sb=document.querySelector('.tt22 [data-go="sound"]');if(sb)sb.onclick=soundMenu;}catch(e){}return r;};}
(function(){const st=document.createElement('style');st.textContent=`
body:has(.tt22) .stage{display:none}
body:has(.tt22) .mast{display:none}
.tt22{position:relative;border-radius:22px;overflow:hidden;min-height:min(86vh,760px);display:flex;flex-direction:column;align-items:center;justify-content:flex-start;padding:22px 22px 22px;background:linear-gradient(180deg,rgba(10,13,24,.15) 0%,rgba(10,13,24,0) 30%,rgba(10,13,24,.55) 62%,rgba(10,13,24,.96) 100%),var(--tpc) center 30%/cover;box-shadow:0 24px 60px rgba(0,0,0,.5);border:1px solid rgba(120,140,200,.18);margin-bottom:18px}
.ttcorner{position:absolute;top:16px;display:flex;gap:10px}.ttcorner.l{left:16px}.ttcorner.r{right:16px}
.ttc{display:flex;flex-direction:column;align-items:center;gap:3px;width:68px;padding:8px 4px;border-radius:16px;background:rgba(14,17,28,.72);border:1px solid rgba(160,180,230,.3);color:#eef;font-size:12.5px;backdrop-filter:blur(6px)}
.ttc i{display:block;line-height:0}.ttc em{font-style:normal;font-size:21px;line-height:22px;font-weight:700}.ttc svg{width:22px;height:22px}
.ttc:hover{border-color:#ffb84d}
.ttlogo{position:relative;text-align:center;width:min(90%,620px);margin:56px auto 22px}
.ttlogo img{width:clamp(80px,min(13vw,16vh),150px);height:auto;filter:drop-shadow(0 0 22px rgba(255,184,77,.55));display:block;margin:0 auto 4px}
.ttlogo h1{margin:0;font-family:var(--f-display);font-size:clamp(46px,min(9vw,12vh),104px);line-height:1;letter-spacing:.02em;background:linear-gradient(180deg,#fff4d6 10%,#ffc15a 55%,#ff9a3d);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 0 rgba(90,40,5,.6)) drop-shadow(0 0 24px rgba(255,170,60,.35))}
.ttlogo p{margin:8px auto 0;font-size:clamp(15px,2.2vw,21px);color:#fff;text-shadow:0 2px 8px #000;display:inline-block;border-top:1px solid rgba(255,200,120,.5);padding-top:8px}
.ttver{display:block;font-size:11.5px;color:#d9c9a8;margin-top:6px;opacity:.85}
.ttform{width:min(420px,100%);display:flex;flex-direction:column;align-items:center;gap:10px;margin-top:auto}
.ttname.bad{border-color:#ff6f61}.ttname{display:flex;align-items:center;width:100%;border-radius:16px;background:rgba(14,17,28,.88);border:1.5px solid rgba(255,184,77,.55);padding:4px 4px 4px 12px;gap:8px}
.ttname .tti{color:#9aa2bb;line-height:0}.ttname .tti svg{width:20px;height:20px}
.ttname input{flex:1;min-width:0;background:none;border:0;color:#fff;font-size:17px;padding:10px 0;outline:none}
.ttrand{border-radius:12px;padding:8px 12px;background:#232a42;border:1px solid rgba(120,140,200,.3);color:#dfe4f5;font-size:13.5px;white-space:nowrap}
.tt22 .bl{font-size:12.5px;color:#cfd3e2;text-align:center;min-height:1em;text-shadow:0 1px 4px #000}
.ttnew{width:100%;border:0;border-radius:18px;padding:15px;font-family:var(--f-display);font-size:26px;color:#2a1705;background:linear-gradient(180deg,#ffd27a,#ffa23d);box-shadow:0 0 0 1px rgba(255,230,170,.6) inset,0 10px 30px rgba(255,154,61,.45);cursor:pointer}
.ttnew b{font-size:.9em;margin-left:6px}
.ttcont{min-width:200px;border-radius:999px;padding:8px 22px;background:rgba(14,17,28,.85);border:1.5px solid rgba(200,210,240,.4);color:#fff;font-size:15px}
.ttmodes{width:100%;display:flex;flex-wrap:wrap;justify-content:center;gap:12px;margin-top:18px}.ttmodes>.ttm{flex:0 1 calc((100% - 48px)/5);max-width:210px}
.ttm{position:relative;border-radius:16px;overflow:hidden;border:2px solid var(--mc);background:#121626;padding:0 0 10px;display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer;box-shadow:0 0 18px color-mix(in srgb,var(--mc) 30%,transparent)}
.ttm img{width:100%;aspect-ratio:1.6/1;object-fit:cover;display:block;margin-bottom:6px}
.ttm b{font-family:var(--f-display);font-size:19px;color:var(--mc);font-weight:400;padding:0 6px}
.ttm small{font-size:11.5px;color:#aab0c6;padding:0 8px;line-height:1.35;text-align:center}
.ttm:hover{transform:translateY(-2px)}
.ttlive{margin-top:12px}
@media (max-width:900px){.ttmodes>.ttm{flex-basis:calc((100% - 24px)/3)}}
@media (max-width:600px){
 .tt22{min-height:auto;padding:150px 12px 16px;background:linear-gradient(180deg,rgba(10,13,24,0) 0%,rgba(10,13,24,0) 34%,rgba(10,13,24,.7) 55%,#0e1220 70%),var(--tmb) center top/100% auto no-repeat,#0e1220;border-radius:18px}
 .ttlogo{position:static;transform:none;margin:0 0 14px}
 .ttlogo h1{font-size:58px}.ttlogo p{font-size:15px}
 .ttc{width:54px;font-size:11px;padding:6px 2px}.ttc svg{width:18px;height:18px}
 .ttcorner{top:10px;gap:6px}.ttcorner.l{left:10px}.ttcorner.r{right:10px}
 .ttnew{font-size:23px;padding:13px}
 .ttmodes{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin-top:14px}.ttmodes>.ttm{max-width:none}.ttmodes>.ttm{max-width:none}
 .ttm:last-child:nth-child(odd){grid-column:1/-1}
 .ttm:last-child:nth-child(odd){grid-column:1/-1}
 .ttm{flex-direction:row;padding:0;gap:0;text-align:left;align-items:stretch}
 .ttm img{width:42%;max-width:150px;aspect-ratio:auto;height:62px;margin:0;object-fit:cover}
 .ttm b{align-self:center;font-size:17px;padding:0 8px}
 .ttm small{display:none}
}
@media (max-width:360px){.ttm b{font-size:15px}.ttcorner.r .ttc:last-child{display:none}}
`;document.head.appendChild(st);})();