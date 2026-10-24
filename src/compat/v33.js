/* 바이라인 1.6 — src/compat/v33.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.4 제자: 다른 부서로 가도 「옛 제자」로 남는다 =====
// 예전: 제자가 승진·발령으로 부서를 떠나면 아무 말 없이 관계가 끊겼다.
// 이제: 떠날 때 작별 장면 → 옛 제자 명단. 옛 제자는 그 부서 소식을 물어 오고, 간부가 되면 인사 때 내 편을 들고, 부장까지 크면 「청출어람」.
try{Object.assign(ACH,{pgUp:['청출어람','옛 제자가 부장이 된다'],pgTwo:['사단을 이루다','옛 제자 3명']});}catch(e){}
function pgFind(nm){const T=(S.team||[]).find(x=>x.name===nm);if(T)return T;try{const R=roster();for(const d in R)for(const x of R[d]||[])if(x&&x.name===nm)return x;}catch(e){}return null;}
function pgLog(nm){const L=(S.log||[]).slice(-12).map(x=>typeof x==='string'?x:(x.t||'')).filter(t=>t.includes(nm));return L[L.length-1]||'';}
function pgSnap(){if(!S.protege){S.pgCur=null;return;}const m=deptPeople().find(x=>x.name===S.protege);if(m)S.pgCur={name:m.name,d:m.d,r:m.r||0,rel:m.rel??20,skill:m.skill||40,yrs:myrs(m),t0:(S.pgCur&&S.pgCur.name===m.name&&S.pgCur.t0)||S.turn};}
function pgGraduate(c){if(!c||S.founder)return;const lg=pgLog(c.name);const out=/이적|이직|진로|퇴사|그만|떠났/.test(lg)&&!/부서|발령/.test(lg);const m=pgFind(c.name);
  const d=m&&m.d&&DEPTS[m.d]?m.d:c.d,r=m?(m.r||0):c.r,mon=Math.max(1,Math.round((S.turn-(c.t0||S.turn))/4));
  const A=(S.pgAlumni=S.pgAlumni||[]);if(A.some(x=>x.name===c.name))return;
  const a={name:c.name,d,r,rel:Math.max(c.rel,30),skill:c.skill,t:S.turn,out:out?1:0,mon};A.push(a);if(A.length>6)A.shift();
  (S.alumni=S.alumni||[]).push({name:c.name,d,rel:a.rel,t:S.turn,pg:1});
  if(A.filter(x=>!x.out).length>=3)try{ach('pgTwo');}catch(e){}
  const dn=DEPTS[d]?DEPTS[d].n:'다른 부서',rn=MR[Math.min(3,r)]||'기자';
  const sub=out?`${esc(c.name)} 기자가 회사를 떠났다. 마지막 날 문자가 왔다. "선배한테 배운 거, 어디 가서도 써먹을게요."`:`${esc(c.name)} 기자가 ${dn} ${jo2(rn,'으로','로')} 발령됐다. "선배, 자리는 바뀌어도 저는 선배 제자예요."`;
  Q.push(()=>openModal(out?'제자와의 작별':'제자의 독립',`<p class="lede">${sub}</p><p>${mon}개월 동안 키운 제자다. 이제 <b>옛 제자</b>로 남는다.</p><ul class="pnl"><li>가끔 ${out?'그쪽 업계':dn} 소식과 아이템을 물어 온다</li>${out?'':'<li>간부가 되면 인사 때 내 편을 든다</li><li>부장까지 크면 업적 「청출어람」</li>'}<li>관계가 식지 않게 가끔 챙기자 (동료 챙기기·술자리)</li></ul><p class="hint">"부서 사람들과"에서 새 제자를 들일 수 있다.</p>`,[
    {label:'축하주를 산다',sub:'관계↑↑ · 통장 -15만 · 평판 조금↑',fn:()=>{a.rel=Math.min(100,a.rel+15);toast(apply({money:-15,fame:.3}));}},
    {label:'"계속 연락하자"고 한다',sub:'관계↑',fn:()=>{a.rel=Math.min(100,a.rel+6);}}]));
  log(`제자 ${jo2(c.name,'이','가')} ${out?'회사를 떠났다':dn+'로 옮겼다'} — 옛 제자로 남는다`);}
function pgAlumniMonth(lines){const A=S.pgAlumni||[];if(!A.length||S.founder)return;const jan=month()===1;
  A.forEach(a=>{a.rel=Math.max(10,a.rel-(a.rel>60?.3:.6));a.skill=Math.min(92,(a.skill||40)+.15);
    // 소식·아이템 (일반 후배보다 자주, 관계가 좋을수록)
    if(a.rel>=30&&(S.items||[]).length<6&&chance(.03+a.rel/1500)){const it=makeItem(DEPTS[a.d]?a.d:S.dept,{mult:a.out?.9:1.05});it.from=a.name;it.src=`옛 제자 ${a.name}`;S.items.push(it);lines.push({c:'g',t:`옛 제자 ${jo2(a.name,'이','가')} ${a.out?'':(DEPTS[a.d]?DEPTS[a.d].n+' ':'')}소식을 물어 왔다 → 「${it.title}」`});}
    if(a.out||!jan)return;
    // 해마다 승진 심사 (실력·연차)
    if(a.r<3&&chance(clamp(.12+(a.skill-50)/250,.05,.35))){a.r++;const rn=MR[a.r];lines.push({c:'g',t:`옛 제자 ${jo2(a.name,'이','가')} ${jo2(rn,'으로','로')} 승진했다`});a.rel=Math.min(100,a.rel+3);if(a.r>=2)try{ach('pgUp');apply({fame:1});}catch(e){}}
    // 간부가 된 옛 제자는 인사 때 내 편을 든다
    if(a.r>=1&&a.rel>=40&&S.rank>=1&&S.rank<7){const v=a.r>=2?1.5:.8;apply({eval:v});lines.push({c:'g',t:`옛 제자 ${a.name} ${jo2(MR[a.r],'이','가')} 인사 평가 자리에서 내 편을 들었다 (사내 평가 +${v})`});}});}
{const _em33=endMonth;endMonth=function(){const before=S&&S.pgCur?{...S.pgCur}:null;const r=_em33.apply(this,arguments);
  try{if(S&&S.phase==='game'&&!S.founder){if(before&&S.protege!==before.name)pgGraduate(before);pgSnap();const L=[];pgAlumniMonth(L);if(L.length){S._pgL=L;L.forEach(x=>log(x.t));try{const fd=document.querySelector('#mb .feed');if(fd&&!$('#modal').hidden)fd.insertAdjacentHTML('beforeend',L.map(x=>`<li class="${x.c}">${esc(x.t)}</li>`).join(''));}catch(e){}}}}catch(e){console.error(e);}return r;};}
// 제자 카드: 무엇이 좋은지, 옛 제자 명단
{const _rb33=rankBox;rankBox=function(){let h=_rb33.apply(this,arguments);try{const A=(S.pgAlumni||[]);
  const ben='매달 실력이 큰다 · 가끔 단독을 내면 내 평판·평가↑ · 출입처 얘기를 먼저 물어 온다 · 부장 승진 조건(제자 6개월 이상 + 출입처 장악도 55) · 경쟁사가 잘 못 빼 간다 · 다른 부서로 가도 옛 제자로 남는다';
  h=h.replace('제자는 매달 조금씩 크고, 가끔 단독을 내면 내 평판도 오른다.',ben).replace('"부서 사람들과"에서 후배를 골라 "제자로 삼는다"를 누르자.','"부서 사람들과"에서 후배를 골라 "제자로 삼는다"를 누르자. '+ben);
  if(A.length&&S.rank>=1&&S.rank<7){const li=A.map(a=>`<span class="tag">${esc(a.name)} · ${a.out?'타사':(DEPTS[a.d]?DEPTS[a.d].n:'')+' '+(MR[a.r]||'기자')} · 관계 ${Math.round(a.rel)}</span>`).join('');
    const card=`<div class="card rkc"><div class="t">옛 제자 ${A.length}명</div><div class="meta">${li}</div><p class="hint" style="margin:4px 0 0">소식과 아이템을 물어 오고, 간부가 되면 1월 인사 때 내 편을 든다. 관계는 조금씩 식는다.</p></div>`;
    h=h.includes('제자 키우기')?h.replace(/(<div class="card rkc"><div class="t">제자 키우기)/,card+'$1'):h+card;}}catch(e){}return h;};}
// 옛 제자도 동료 챙기기 대상 (관계 유지)
{const _cg=typeof colGroup==='function'?colGroup:null;if(_cg)colGroup=function(){const A=(S.pgAlumni||[]).filter(a=>!a.out);if(A.length)A.forEach(a=>a.rel=Math.min(100,a.rel+2));return _cg.apply(this,arguments);};}
// ===== 1.4 좁은 화면: 아이콘이 글자를 가리지 않게 =====
soundChip=function(){const on=AU.on.bgm||AU.on.sfx;return `<button class="chip snd" data-go="sound" title="소리 설정" aria-label="소리 설정"><b class="sndi">${on?'♪':'♪̸'}</b><span class="sndt"> 소리</span></button>`;};
(function(){const st=document.createElement('style');st.textContent=`
#hud .chip.snd .sndi{font-weight:700;font-size:16px!important;line-height:1}#hud .chip.snd .sndt{display:none!important}body:not(.v19) #hud .chip.snd .sndt{display:inline!important;font-size:13px!important}
@media (max-width:640px){
 #hud .chip.snd{font-size:16px!important;display:grid!important;place-items:center}
 #hud .chip.snd .sndt{display:none}
 body.v19 .stgp .stt{grid-template-columns:30px minmax(0,1fr) auto!important;column-gap:6px!important;padding:6px 7px!important}
 body.v19 .stgp .stt>.i18{width:30px!important;height:30px!important;border-radius:8px}
 body.v19 .stgp .stt>span{font-size:12.5px!important;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
 body.v19 .stgp .stt>b{font-size:14px!important}
 .p21ci{max-width:44px!important;max-height:44px!important}
 #modal .ch .p21ci+.cl,#modal .ch .cl{min-width:0;overflow-wrap:anywhere}
}
@media (max-width:380px){
 body.v19 .stgp .stt>.i18{width:26px!important;height:26px!important}
 body.v19 .stgp .stt{grid-template-columns:26px minmax(0,1fr) auto!important}
 .p21ci{max-width:38px!important;max-height:38px!important}
}`;document.head.appendChild(st);})();
// ===== 부장 승진 조건: 출입처 장악도 55 + 제자 6개월 이상 (또는 옛 제자) =====
function pgMonths(){if(!S.protege||!S.pgCur||S.pgCur.name!==S.protege)return 0;return Math.floor((S.turn-(S.pgCur.t0||S.turn))/4);}
function pgReqOk(){return pgMonths()>=6||(S.pgAlumni||[]).some(a=>!a.out);}
function pgReqTxt(){const al=(S.pgAlumni||[]).some(a=>!a.out);return al?'제자 키우기 ✓ (옛 제자)':S.protege?`제자 ${S.protege} 키우기 ${pgMonths()}/6개월`:'제자 키우기 0/6개월 (부서 사람들과 → 제자로 삼는다)';}