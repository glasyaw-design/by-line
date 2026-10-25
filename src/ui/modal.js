/* 바이라인 — src/ui/modal.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ================= 모달·토스트 =================
let mTok=0;const Q=[];
// 할 일 안의 여러 단계 창: 행동력을 쓰기 전까지는 어디서든 '← 뒤로'와 '취소'를 같은 자리(아래 줄)에 둔다
let MSTACK=[];
function openModal(title,body,choices){
  try{if(cardOK(title,body,choices)){showCard(title,body,choices);return;}}catch(e){console.error(e);}
  try{const cb=document.getElementById('cards');if(cb){cb.classList.add('mini');cb.querySelectorAll('.rcard').forEach(x=>x.classList.add('mini'));if(innerWidth<720)cb.style.visibility='hidden';}}catch(e){}
  if(S&&S.phase==='game'&&S._curAct&&!S._sur&&choices&&choices.length){const top=MSTACK[MSTACK.length-1];const rec=[title,body,choices];if(top&&top[0]===title)MSTACK[MSTACK.length-1]=rec;else MSTACK.push(rec);
    const has=re=>choices.some(c=>c.cls==='ghost'&&re.test(String(c.label)));const add=[];
    if(MSTACK.length>1&&!has(/뒤로|이전/))add.push({label:'← 뒤로',cls:'ghost',fn:()=>{MSTACK.pop();const pv=MSTACK.pop();if(pv)openModal(pv[0],pv[1],pv[2]);return false;}});
    if(!has(/취소|닫기|다음에|그만|넘긴다|남는다|접는다/))add.push({label:'취소',sub:'행동력은 쓰지 않는다',cls:'ghost',fn:()=>{MSTACK=[];}});
    if(add.length)choices=choices.concat(add);}
  else if(!(S&&S._curAct))MSTACK=[];
  mTok++;const tok=mTok;$('#mt').textContent=title;let ill='';try{if(!/튜토리얼|개발자|업데이트|저장|메뉴|소리 설정|도움말|[1-5]단계 · |취재 중|인사권|부서 이동|임금 조정|편집국 수당/.test(title)&&!String(body||'').includes('tfig'))ill=illHTML(illFor(title));}catch(e){}try{body=snapInject(body,title);}catch(e){}try{const sm=/^([1-5])단계 · /.exec(title);if(sm){const n=+sm[1];body=`<div class="wstep">${['야마','리드','팩트·반론','인용·제목','출고'].map((x,i)=>`<span class="${i+1<n?'done':i+1===n?'cur':''}">${i+1}. ${x}</span>`).join('')}</div>`+(body||'');}}catch(e){}$('#mb').innerHTML=ill+(body||'');const mc=$('#mc');mc.innerHTML='';try{const main=(choices||[]).filter(c=>c.cls!=='ghost');{const L=c=>String(c.label).replace(/<[^>]+>/g,'').length;const wide=innerWidth>=601;mc.classList.toggle('grid2',(main.length>=5||main.length>=4&&/인사권|부서 이동|임금 조정|설정/.test(title))&&main.every(c=>L(c)<=16)||wide&&main.length>=4&&main.every(c=>L(c)<=40)||!wide&&main.length>=4&&main.every(c=>L(c)<=11));}}catch(e){}
  let foot=null;(choices&&choices.length?choices:[{label:'확인'}]).forEach(c=>{if(c.cls==='ghost'&&c.label==='뒤로')c.label='← 뒤로';const b=document.createElement('button');b.className='ch'+(c.cls?' '+c.cls:'');b.disabled=!!c.disabled;
    b.innerHTML=`<span class="cl">${c.label}${c.rec?'<i class="bdg rec">추천</i>':''}${c.risk?'<i class="bdg rsk">위험</i>':''}${c.tag?`<i class="bdg">${c.tag}</i>`:''}</span>${c.sub?(c.cls==='ghost'?`<span class="cs">${c.sub}</span>`:subChips(c.sub)):''}`;
    b.onclick=()=>{let r;try{r=c.fn?c.fn():undefined;}catch(e){console.error(e);r=undefined;}if(r!==false&&tok===mTok)closeModal();};if(c.cls==='ghost'){if(!foot){foot=document.createElement('div');foot.className='mfoot';}foot.appendChild(b);}else mc.appendChild(b);});if(foot)mc.appendChild(foot);
  try{sfx(sfxFor(title,body),.02);}catch(e){}
  $('#modal').hidden=false;$('#modal .mbx').scrollTop=0;const fb=mc.querySelector('button:not([disabled])');if(fb)fb.focus({preventScroll:true});
}
function cardsBack(){try{const cb=document.getElementById('cards');if(cb){cb.style.visibility='';cb.classList.remove('mini');cb.querySelectorAll('.rcard').forEach(x=>x.classList.remove('mini'));}}catch(e){}}
function closeModal(){$('#modal').hidden=true;cardsBack();mTok++;MSTACK=[];if(S)S._curAct=null;if(Q.length){const n=Q.shift();n();return;}try{if(snapFinish())return;}catch(e){ACT_SNAP=null;}render();saveGame();}
let toastT=null;
function toast(t){try{sfx(/부족|없다|모자란다|못 한다|불가|골라 주세요|적어|정해/.test(t)?'deny':'blip');}catch(e){}try{if(ACT_SNAP&&t)ACT_SNAP.msgs.push(String(t));}catch(e){}const el=$('#toast');el.textContent=t;el.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>{el.hidden=true;},Math.min(5200,2200+String(t).length*28));}
const fxLine=t=>t?`<p class="fx">${t}</p>`:'';