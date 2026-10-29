// 1.77 · 분기 개인 평가 보고서 · 능력치 성장 게이지 · 성장 기록
// 예전 파일 v77.js를 순서 그대로 이어 붙였다

// ───── (예전 v77.js) ─────
/* 바이라인 — src/compat/v77.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.77 분기 개인 평가 보고서 · 능력치 성장 게이지 =====
// 분기(1~3월·4~6월·7~9월·10~12월)가 끝나면 그 석 달 동안 능력치가 얼마나 자랐는지(또는 떨어졌는지)를 보고서 한 장으로 보여 준다.
// 「나」 탭 능력치 칸에도 이번 분기에 오른 만큼을 표시한다. 기록은 S.qr78(분기 시작 상태) · S.qrH(지난 분기들, 최대 12개).
const QR_G=[['취재',['inv','ver','int','dat']],['글',['wri','hed','spd','kno']],['사람',['net','cha','sal','lead']],['기본기',['sta','men','lng','brd']]];
const QR_GC={취재:'#77a6ff',글:'#ffb547',사람:'#5ad49b',기본기:'#c49bff',방향:'#77a6ff',돈:'#ffb547','사람과 바깥':'#5ad49b','변화와 위기':'#c49bff'};
function qrKey(t){t=t==null?S.turn:t;return Math.floor(t/YW)*4+Math.floor((month(t)-1)/3);}
function qrName(k){return `${2027+Math.floor(k/4)}년 ${k%4+1}분기`;}
function qrSnap(){const st={};for(const k in STN)st[k]=+(S.st&&S.st[k]||0);const fs={};if(S.founder&&S.fst)for(const k in FSTN)fs[k]=+(S.fst[k]||0);
  let sk=0;try{sk=+mySkill()||0;}catch(e){}
  return {k:qrKey(),t:S.turn,st,fs,sk,eval:+S.eval||0,fame:+S.fame||0,trust:+S.trust||0,money:+S.money||0,arts:S.totalArticles||0,sc:S.scoops||0,er:S.errors||0,aw:S.awards||0,rank:S.rank,founder:!!S.founder,cash:S.co&&S.co.cash!=null?+S.co.cash:null};}
function qrEnsure(){try{if(!S||S.phase!=='game')return;if(!S.qr78||typeof S.qr78!=='object'||S.qr78.k==null)S.qr78=qrSnap();if(!Array.isArray(S.qrH))S.qrH=[];}catch(e){}}
// 이번 분기에 한 능력치가 얼마나 올랐나 (분기 시작 대비)
function qrDelta(k,fs){const a=S.qr78;if(!a)return 0;const cur=fs?(S.fst&&S.fst[k]):(S.st&&S.st[k]);const base=fs?(a.fs||{})[k]:(a.st||{})[k];if(cur==null||base==null)return 0;return cur-base;}
// 보고서 계산
function qrBuild(a,b){const fs=!!(b.founder&&Object.keys(b.fs||{}).length);const N=fs?FSTN:STN,G=fs?FSTG:QR_G,src=fs?'fs':'st';
  const D={};let up=0,dn=0;for(const k in N){const d=+(((b[src]||{})[k]||0)-((a[src]||{})[k]||0)).toFixed(2);D[k]=d;if(d>0)up+=d;else dn+=d;}
  const sum=up+dn;const top=Object.keys(D).filter(k=>D[k]>=.05).sort((x,y)=>D[y]-D[x]).slice(0,3);const low=Object.keys(D).filter(k=>D[k]<=-.05).sort((x,y)=>D[x]-D[y]).slice(0,2);
  const p={arts:b.arts-a.arts,sc:b.sc-a.sc,er:b.er-a.er,aw:b.aw-a.aw,eval:b.eval-a.eval,fame:b.fame-a.fame,trust:b.trust-a.trust,money:b.money-a.money,sk:b.sk-a.sk,rank:b.rank-a.rank};
  // 등급: 성장(능력치 합) · 평가 변화 · 기사·단독 · 오보 감점 — 직급이 높을수록 능력치는 덜 오르니 기준을 낮춘다
  const avg=Object.keys(N).reduce((t,k)=>t+((a[src]||{})[k]||0),0)/Object.keys(N).length;const gc=(typeof growCurve==='function'?growCurve(avg):.6)/.62;
  const exp=Math.max(2,(fs?6.5:[15,15,14,10,6,5,4,3][clamp(b.rank|0,0,7)])*gc);
  let s=58+clamp(sum/exp-1,-1.2,.8)*35+clamp(p.eval/4,-1.5,1.5)*8+Math.min(8,p.sc*3)+Math.min(4,p.arts*.3)-p.er*10+(p.rank>0?8:0)+(p.aw>0?8:0);
  if(b.founder)s+=clamp((b.cash!=null&&a.cash!=null?b.cash-a.cash:0)/3,-1,1)*6;
  s=clamp(Math.round(s),0,100);const g=s>=88?'S':s>=74?'A':s>=58?'B':s>=42?'C':'D';
  return {fs,N,G,src,D,up,dn,sum,top,low,p,s,g};}
const QR_SAY={S:['이번 분기 최고 고과다. 위에서도 이름을 물어 온다.','눈에 띄게 컸다. 이 속도면 다음 자리가 금방이다.'],
  A:['꾸준히 자랐다. 믿고 맡길 수 있겠다.','성장도 성과도 좋다. 이대로만 가자.'],
  B:['무난한 분기였다. 한 가지를 확실히 키워 보자.','나쁘지 않다. 다만 눈에 띄는 한 방이 아쉽다.'],
  C:['제자리걸음이다. 무엇을 키울지 정하자.','바빴던 것에 비해 남은 게 적다.'],
  D:['이번 분기는 뒷걸음질이다. 다음 분기가 중요하다.','실수가 성장을 다 깎아 먹었다. 기본부터 다시.']};
function qrWho(){if(S.founder)return '편집국 구성원들';return ['캡','데스크','데스크','부장','편집국장','편집국장','사장','이사회'][clamp(S.rank|0,0,7)]+'';}
function qrSpark(H,cur,key){const L=[...H.map(x=>x[key]),cur].filter(v=>Number.isFinite(v)).slice(-8);if(L.length<2)return '';const lo=Math.min(...L),hi=Math.max(...L),w=150,h=36,n=L.length;
  const pts=L.map((v,i)=>`${Math.round(i*(w-8)/(n-1))+4},${Math.round(h-4-(hi===lo?.5:(v-lo)/(hi-lo))*(h-10))}`).join(' ');const last=pts.split(' ').pop().split(',');
  return `<svg class="qr-sp" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}" aria-hidden="true"><polyline points="${pts}" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linejoin="round" stroke-linecap="round"/><circle cx="${last[0]}" cy="${last[1]}" r="3.6" fill="currentColor"/></svg>`;}
function qrBar(cur,base,d,col){cur=clamp(cur,0,99);base=clamp(base,0,99);const lo=Math.min(cur,base),hi=Math.max(cur,base);
  return `<span class="qr-bar" style="--c:${col}"><i style="width:${lo}%"></i>${hi>lo?`<i class="${d>=0?'up':'dn'}" style="left:${lo}%;width:${Math.max(.8,hi-lo)}%"></i>`:''}</span>`;}
const sg1=v=>(v>0?'+':v<0?'−':'±')+(Math.abs(v)>=10?Math.round(Math.abs(v)):Math.abs(v).toFixed(1));
function qrHTML(R,a,b,H,partial){const {N,G,src,D,top,low,p,s,g}=R;
  const row=(k,col)=>{const cur=(b[src]||{})[k]||0,base=(a[src]||{})[k]||0,d=D[k];return `<div class="qr-st${top.includes(k)?' hot':''}${d<=-.05?' cold':''}"><span class="n">${esc(N[k])}</span><b>${Math.round(cur)}</b>${qrBar(cur,base,d,col)}<em class="${d>=.05?'p':d<=-.05?'m':'z'}">${Math.abs(d)<.05?'—':sg1(d)}</em></div>`;};
  const tile=(n,v,sub,cls)=>`<div class="qr-tl ${cls||''}"><span>${n}</span><b>${v}</b>${sub?`<small>${sub}</small>`:''}</div>`;
  const say=QR_SAY[g][(b.k||0)%2];
  const nx=(()=>{try{const h=nowHint();if(h&&(h.t||h.d))return esc(h.t||h.d);}catch(e){}return '';})();
  const weak=(()=>{const keys=R.fs?Object.keys(N):['inv','wri','ver','net','int','hed'];const L=keys.filter(k=>!top.includes(k)).sort((x,y)=>(D[x]-D[y])||(((b[src]||{})[x]||0)-((b[src]||{})[y]||0)));return L[0];})();
  return `<div class="qr78"><div class="qr-hd"><div><p class="qr-kk">${qrName(a.k)}${partial?' (일부)':''} · ${esc(S.name)}</p><p class="qr-who">${esc(OUT().n)} ${esc(rankName())}${S.founder?'':` · ${years()}년 차`}</p></div><div class="qr-grade g${g}"><b>${g}</b><small>${s}점</small></div></div>
   <p class="qr-say">“${esc(say)}”<small>— ${esc(qrWho())}</small></p>
   <div class="qr-sum"><div><span>${R.fs?'발행인 역량 합계':'종합 실력'}</span><b>${R.fs?Math.round(Object.keys(N).reduce((t,k)=>t+((b.fs||{})[k]||0),0)/Object.keys(N).length):Math.round(b.sk)}</b><em class="${(R.fs?R.sum:p.sk)>=0?'p':'m'}">${R.fs?sg1(R.sum/Object.keys(N).length):sg1(p.sk)}</em></div>${qrSpark(H,R.fs?Object.keys(N).reduce((t,k)=>t+((b.fs||{})[k]||0),0)/Object.keys(N).length:b.sk,'sk')}<div><span>능력치 변화 합</span><b class="${R.sum>=0?'p':'m'}">${sg1(R.sum)}</b><small>오름 ${sg1(R.up)} · 내림 ${sg1(R.dn)}</small></div></div>
   ${top.length?`<p class="qr-top">이번 분기 가장 많이 자란 것 — ${top.map(k=>`<b>${esc(N[k])} ${sg1(D[k])}</b>`).join(' · ')}</p>`:'<p class="qr-top">이번 분기에 눈에 띄게 자란 능력치가 없다.</p>'}
   <div class="qr-gs">${G.map(([gn,ks])=>`<div class="qr-g" style="--c:${QR_GC[gn]||'#8a93a8'}"><p>${esc(gn)}</p>${ks.filter(k=>k in N).map(k=>row(k,QR_GC[gn]||'#8a93a8')).join('')}</div>`).join('')}</div>
   <p class="qr-h">성과</p><div class="qr-tls">${tile('기사',`${p.arts}건`,'')}${tile('단독',`${p.sc}건`,'',p.sc>0?'good':'')}${tile('오보',`${p.er}건`,'',p.er>0?'bad':'')}${tile(evalName?nm76(evalName()):'평가',Math.round(b.eval),sg1(p.eval),p.eval>=0?'good':'bad')}${tile('평판',Math.round(b.fame),sg1(p.fame),p.fame>=0?'good':'bad')}${tile('신뢰',Math.round(b.trust),sg1(p.trust),p.trust>=0?'good':'bad')}</div>
   ${p.rank>0?`<p class="qr-promo">🎉 이번 분기 승진 — ${esc(rankName())}</p>`:''}${p.aw>0?'<p class="qr-promo">🏆 기자상을 받았다</p>':''}
   <p class="qr-h">다음 분기</p><ul class="qr-next">${weak&&N[weak]?`<li><b>${esc(N[weak])}</b>${D[weak]<=-.05?'이 떨어졌다':'이 제자리다'} — 이걸 쓰는 일을 늘려 보자</li>`:''}${low.length?`<li>떨어진 것: ${low.map(k=>`${esc(N[k])} ${sg1(D[k])}`).join(' · ')}${low.includes('sta')||low.includes('men')?' — 쉬는 것도 일이다':''}</li>`:''}${nx?`<li>${nx}</li>`:''}</ul></div>`;}
function qrShow(rep){if(!rep)return;const R=qrBuild(rep.a,rep.b);
  openModal(`${qrName(rep.a.k)} 개인 평가 보고서`,qrHTML(R,rep.a,rep.b,(S.qrH||[]).filter(x=>x.k<rep.a.k).map(x=>({sk:x.sk})),rep.partial),
   [{label:'확인',cls:'rec'},...((S.qrH||[]).length>1?[{label:'지난 분기들 보기',fn:()=>{qrList();return false;}}]:[]),{label:S.qrOff?'분기 보고서 다시 켜기':'다음부터 저절로 띄우지 않기',sub:'메뉴 → 성장 기록에서 언제든 볼 수 있다',cls:'ghost',fn:()=>{S.qrOff=!S.qrOff;toast(S.qrOff?'분기 보고서를 저절로 띄우지 않는다':'분기 보고서를 다시 띄운다');}}]);}
function qrList(){const H=(S.qrH||[]).slice().reverse();
  openModal('성장 기록 · 분기별',`<div class="qr78"><p class="hint">분기마다 받은 등급과 종합 실력. 누르면 그 분기 보고서를 다시 본다.</p>${qrSpark(H.slice().reverse().slice(0,-1),H.length?H[0].sk:0,'sk')}<ol class="qr-list">${H.map((x,i)=>`<li><button type="button" data-qr="${i}"><span>${qrName(x.k)}</span><b class="g g${x.g}">${x.g}</b><small>종합 ${Math.round(x.sk)} · 능력치 ${sg1(x.sum)} · 단독 ${x.sc}</small></button></li>`).join('')||'<li class="empty">아직 끝난 분기가 없다.</li>'}</ol></div>`,[{label:'이번 분기 지금까지 보기',fn:()=>{qrNow();return false;}},{label:'닫기',cls:'ghost'}]);
  setTimeout(()=>{document.querySelectorAll('[data-qr]').forEach(bt=>bt.onclick=()=>{const x=H[+bt.dataset.qr];if(x&&x.rep)qrShow(x.rep);});},30);}
function qrNow(){qrEnsure();const a=S.qr78;if(!a)return;qrShow({a,b:qrSnap(),partial:true});}
// 분기가 바뀌면 보고서
{const _em78=endMonth;endMonth=function(){qrEnsure();const k0=S&&S.qr78?S.qr78.k:null;const r=_em78.apply(this,arguments);
  try{if(S&&S.phase==='game'&&k0!=null&&qrKey()!==k0){const a=S.qr78,b=qrSnap();b.k=a.k;const R=qrBuild(a,b);const rep={a,b,partial:a.part?1:0};
    S.qrH=(S.qrH||[]).concat([{k:a.k,g:R.g,s:R.s,sk:b.sk,sum:+R.sum.toFixed(2),sc:R.p.sc,rep}]).slice(-12);
    // 오래된 보고서는 요약만 남긴다 (저장 크기)
    S.qrH.forEach((x,i)=>{if(i<S.qrH.length-4)delete x.rep;});
    S.qr78=qrSnap();if(!S.qrOff&&!S.story0)Q.push(()=>qrShow(rep));}}catch(e){}return r;};}
// 메뉴 → 성장 기록
{const _om78=openModal;openModal=function(t,b,c){try{if(t==='메뉴'&&Array.isArray(c)&&S&&S.phase==='game'){const i=c.findIndex(x=>/도움말/.test(String(x&&x.label)));c=c.slice();c.splice(i>=0?i:c.length,0,{label:'📈 성장 기록',sub:'분기별 개인 평가 보고서',fn:()=>{(S.qrH||[]).length?qrList():qrNow();return false;}});}}catch(e){}return _om78.call(this,t,b,c);};}
// 「나」 탭 능력치 칸: 이번 분기에 오른 만큼 · 분기 시작 위치 표시
function qrTiles(){try{if(!S||S.phase!=='game'||!S.qr78)return;document.querySelectorAll('.stt[data-stat]').forEach(el=>{const k=el.dataset.stat;if(!(k in STN))return;const d=qrDelta(k,false);
  let em=el.querySelector('.qr-d');if(!em){em=document.createElement('em');em.className='qr-d';el.appendChild(em);}
  em.textContent=Math.abs(d)<.05?'':sg1(d);em.className='qr-d '+(d>0?'p':'m');
  const i=el.querySelector('i');if(i&&Math.abs(d)>=.05){let gh=el.querySelector('.qr-gh');if(!gh){gh=document.createElement('u');gh.className='qr-gh';el.appendChild(gh);}const base=clamp((S.qr78.st||{})[k]||0,0,99);gh.style.left=base+'%';}});
  const h=[...document.querySelectorAll('.sec,h3,h4')].find(x=>/^능력치/.test(x.textContent.trim()));if(h&&!(h.nextElementSibling&&h.nextElementSibling.classList.contains('qr-link'))){const a=document.createElement('button');a.type='button';a.className='qr-link';a.textContent='📈 이번 분기 성장 보기 — 분기 개인 평가 보고서';a.onclick=ev=>{ev.stopPropagation();qrNow();};h.insertAdjacentElement('afterend',a);}}catch(e){}}
{const _rd78=render;render=function(){try{qrEnsure();}catch(e){}const r=_rd78.apply(this,arguments);try{qrTiles();}catch(e){}return r;};}
(function(){try{const st=document.createElement('style');st.textContent=`
.qr78{font-size:14px}.qr-hd{display:flex;justify-content:space-between;align-items:center;gap:12px;padding-bottom:10px;border-bottom:1px dashed rgba(255,255,255,.15)}
.qr-kk{margin:0;font-size:13px;opacity:.75}.qr-who{margin:2px 0 0;font-size:16px;font-weight:700}
.qr-grade{flex:none;width:76px;height:76px;border-radius:18px;display:flex;flex-direction:column;align-items:center;justify-content:center;background:#3a4256}.qr-grade b{font-size:40px;line-height:1}.qr-grade small{font-size:12px;opacity:.85}
.qr-grade.gS{background:linear-gradient(135deg,#ffcf6b,#ff9a3d);color:#1a1206}.qr-grade.gA{background:#5ad49b;color:#0b2418}.qr-grade.gB{background:#77a6ff;color:#0b1730}.qr-grade.gC{background:#8a93a8;color:#11141c}.qr-grade.gD{background:#ff6b7a;color:#2a0b0f}
.qr-say{margin:10px 0;padding:10px 12px;border-radius:12px;background:rgba(255,255,255,.04);line-height:1.5}.qr-say small{display:block;font-size:12px;opacity:.6;margin-top:4px;text-align:right}
.qr-sum{display:flex;flex-wrap:wrap;align-items:center;gap:10px 18px;margin:8px 0}.qr-sum>div{display:flex;flex-direction:column}.qr-sum span{font-size:12px;opacity:.7}.qr-sum b{font-size:26px;line-height:1.1}.qr-sum em,.qr-sum small{font-style:normal;font-size:12.5px}
.qr-sp{color:#ffb547}.p{color:#5ad49b}.m{color:#ff8b7a}.qr78 .z{opacity:.4}
.qr-top{margin:6px 0 10px;font-size:13.5px}.qr-top b{color:#5ad49b}
.qr-gs{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px}.qr-g{padding:10px;border-radius:12px;background:rgba(255,255,255,.03);border-top:3px solid var(--c)}.qr-g>p{margin:0 0 6px;font-weight:700;font-size:13px;color:var(--c)}
.qr-st{display:grid;grid-template-columns:5.2em 2em 1fr 3.4em;align-items:center;gap:6px;padding:3px 0;font-size:13px}.qr-st .n{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.qr-st b{text-align:right;font-variant-numeric:tabular-nums}.qr-st em{font-style:normal;text-align:right;font-weight:700;font-size:12.5px;font-variant-numeric:tabular-nums}
.qr-st.hot .n{color:#ffe7a8;font-weight:700}.qr-st.hot .n:before{content:'★ ';color:#ffb547}
.qr-bar{position:relative;height:8px;border-radius:5px;background:rgba(255,255,255,.08);overflow:hidden}.qr-bar i{position:absolute;left:0;top:0;bottom:0;background:var(--c);opacity:.55;border-radius:5px}.qr-bar i.up{opacity:1;background:#5ad49b;border-radius:0 5px 5px 0}.qr-bar i.dn{opacity:.9;background:repeating-linear-gradient(45deg,#ff6b7a 0 3px,transparent 3px 6px)}
.qr-h{margin:14px 0 6px;font-weight:700;font-size:13px;opacity:.75}
.qr-tls{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:6px}.qr-tl{padding:8px 6px;border-radius:10px;background:rgba(255,255,255,.04);text-align:center}.qr-tl span{display:block;font-size:11.5px;opacity:.7}.qr-tl b{display:block;font-size:17px}.qr-tl small{font-size:11.5px}.qr-tl.good small{color:#5ad49b}.qr-tl.bad small{color:#ff8b7a}.qr-tl.bad b{color:#ff8b7a}
.qr-promo{margin:8px 0 0;padding:8px 12px;border-radius:10px;background:rgba(255,181,71,.12);font-weight:700}
.qr-next{margin:0;padding-left:18px;line-height:1.6}
.qr-list{list-style:none;margin:8px 0;padding:0;display:grid;gap:5px}.qr-list button{width:100%;display:grid;grid-template-columns:1fr auto;gap:2px 10px;align-items:center;padding:9px 12px;border-radius:10px;border:0;background:rgba(255,255,255,.04);color:inherit;font:inherit;text-align:left;cursor:pointer}.qr-list small{grid-column:1/-1;font-size:12px;opacity:.7}.qr-list .g{font-size:14px;padding:1px 9px;border-radius:8px;font-weight:700}
.g.gS{background:#ffb547;color:#1a1206}.g.gA{background:#5ad49b;color:#0b2418}.g.gB{background:#77a6ff;color:#0b1730}.g.gC{background:#8a93a8;color:#11141c}.g.gD{background:#ff6b7a;color:#2a0b0f}
.stt[data-stat]{position:relative}.stt .qr-d{position:absolute;top:4px;right:34px;font-style:normal;font-size:11px;font-weight:700}.stt .qr-d.p{color:#5ad49b}.stt .qr-d.m{color:#ff8b7a}
.stt .qr-gh{position:absolute;bottom:4px;width:2px;height:9px;margin-left:-1px;background:#fff;opacity:.55;border-radius:1px;pointer-events:none;text-decoration:none}
.qr-link{display:block;width:100%;margin:6px 0 8px;padding:10px 12px;text-align:left;border-radius:10px;border:1px solid rgba(255,181,71,.5);background:rgba(255,181,71,.1);color:#ffb547;font:inherit;font-size:14px;font-weight:700;cursor:pointer}
@media (max-width:560px){.qr-gs{grid-template-columns:1fr}.qr-tls{grid-template-columns:repeat(3,minmax(0,1fr))}.qr-grade{width:64px;height:64px}.qr-grade b{font-size:34px}}`;document.head.appendChild(st);}catch(e){}})();
