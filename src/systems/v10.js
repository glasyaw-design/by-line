/* 바이라인 — src/systems/v10.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */

// =====================================================================
// 1.0 정식: 댓글창 · 마감 10분 전 · 내 기사 그 후 · 함께 늙어 가는 인물 · 시대 · 커리어 1면
// =====================================================================

// ----- 1) 댓글창: 출고 직후 반응. 품질·제목·반론·논조·파급력에 따라 달라지고, 진짜·가짜 제보가 섞인다 -----
const CM_NICK=['익명','ㅇㅇ','동네주민','직장인','눈팅족','지나가던','팩트체커','정의구현','새벽감성','출근길','퇴근길','고구마','시민A','현직','전직','학부모','자영업자','대학원생'];
function cmNick(){return pick(CM_NICK)+(chance(.6)?R(1,999):'');}
function commentsV2(q,W,risky,it,imp,place){const out=[];const add=(t,k,lk)=>out.push({n:cmNick(),t,k,lk:Math.max(0,Math.round(lk))});const subj=it.subj||'해당 기관';
  const big=imp>=55||['front','one'].includes(place&&place.k);const base=Math.round((imp*.8+q*.4)*(big?2.2:1)*R(6,14)/10);
  const G=['이런 게 기자지','끝까지 추적해 주세요','후속 기대합니다','기레기 소리 듣는 와중에 이런 기사 고맙다','관계 당국은 답하라','이거 우리 동네 얘기네','기자 이름 기억해 둔다','이런 기사 쓰면 회사에서 안 혼나요? 응원합니다','공유합니다'];
  const B=['제목 낚시 그만','제목 보고 들어왔는데 내용이 없네','어그로 그만 끄세요','제목이랑 본문이 딴 얘기'];
  const Wk=['팩트가 부족한 거 아님?','이걸 기사라고','근거가 뭔데','"~로 알려졌다"가 몇 번이냐','확인은 하고 쓴 거죠?'];
  const L=['또 편파 기사네','한쪽 얘기만 듣냐','이 매체 논조 뻔하지','진영 논리 그만'];
  if(W.head==='bait')add(pick(B),'bad',base*.9);
  if(q<40||risky)add(pick(Wk),'bad',base*.7);
  if(it.ideo&&W.angle&&W.angle!=='neu')add(pick(L),'bad',base*.6);
  if(!W.rb&&!it.pos)add(`${subj} 쪽 얘기는 왜 없음? 반론 좀`,'bad',base*.5);
  else if(it.rebut==='got'&&!it.pos&&chance(.5))add(`${subj} 해명이 더 웃기네ㅋㅋ`,'neu',base*.4);
  if(it.ent&&chance(.35)){add(it.pos?'좋게 다뤄 주셔서 감사합니다. 앞으로도 지켜봐 주세요.':`기사 내용 중 일부는 사실과 다릅니다. 정정을 요청합니다.`,'neu',base*.15);out[out.length-1].n=`${subj} 홍보팀`;}
  if(q>=70&&chance(.6))add(pick(['문장 깔끔하다. 데스크 잘 만났네','숫자까지 다 맞춰 놨네. 정성','이 기자 기사는 믿고 본다']),'good',base*1.1);
  if(it.pos&&chance(.45))add(pick(['이거 광고 아님?','홍보 기사 같은데 숫자는 맞네','보도자료 그대로 옮긴 거 아니죠?']),'neu',base*.4);const GP=['좋은 소식 반갑다','이런 훈훈한 기사도 자주 써 주세요','오랜만에 기분 좋은 뉴스','여기 다니는데 뿌듯하네요','다음 행보도 기대된다','공유합니다'];while(out.length<4)add(pick(it.pos?GP:G),'good',base*(.5+Math.random()));
  // 숨은 제보: 좋은 기사일수록, 파급력 클수록 내부자가 붙는다. 진짜는 구체적이고, 가짜는 크고 흐릿하다
  const tipP=clamp(.06+(it.excl?.07:0)+imp/800+(q>=65?.05:0)+(big?.04:0),0,.35)*(it.pos?.3:1);
  if(chance(tipP)){const realP=clamp(.5+(q-55)/150+(it.excl?.08:0),.3,.85);const real=chance(realP);const two=chance(.3);
    const R1=[`${subj} 협력업체 다니는 사람인데요. 기사에 나온 건 일부예요. 작년 11월 내부 감사 보고서에 같은 내용이 있습니다.`,`전직 직원입니다. 3층 재무팀 문서 보관함에 원본이 있을 거예요. 담당자는 이미 바뀌었고요.`,`같은 일이 다른 지점에서도 있었어요. 직원들은 다 압니다. 퇴사자 단톡방에 캡처가 돌아요.`,`현직이라 길게는 못 씁니다. 결재 라인에 이름 하나가 빠져 있어요. 그 사람부터 보세요.`];
    const F1=[`이거 다 윗선 지시임ㅋㅋ 내가 다 앎. 진짜 몸통은 따로 있음`,`더 말하면 다침. 이 정도는 약과고 진짜는 청와대까지 감`,`나 이 회사 회장 조카 친구인데 이거 빙산의 일각임ㅋㅋ`,`기자님 제 쪽지 확인하세요 엄청난 거 있음 (돈 주면 줌)`];
    const mk=r=>({n:cmNick(),t:pick(r?R1:F1),k:'tip',lk:Math.round(base*(r?R(2,9):R(8,20))/10),tip:{real:r,d:it.d,subj,imp,excl:!!it.excl}});
    out.push(mk(real));if(two)out.push(mk(!real));}
  out.sort((a,b)=>b.lk-a.lk);if(out[0])out[0].best=1;return shuffle(out.slice(0,1)).concat(shuffle(out.slice(1))).slice(0,6);}
function cmHTML(cm){window.__cmTips=[];return `<div class="cmbox"><div class="cmh">댓글 ${cm.length}</div><ul class="cmts">${cm.map(c=>{let tipB='';if(c.tip){window.__cmTips.push(c.tip);tipB=`<button type="button" class="achip" data-cmtip="${window.__cmTips.length-1}" style="--c:var(--sodium);margin-top:5px">이 사람에게 연락해 본다 · 체력 조금</button>`;}
  return `<li class="cm-${c.k}"><span>${esc(c.n)}${c.best?' <b class="cmbest">BEST</b>':''}</span>${esc(c.t)} <small class="cmlk">♥ ${c.lk.toLocaleString('ko-KR')}</small>${tipB}</li>`;}).join('')}</ul></div>`;}
function cmBind(){setTimeout(()=>{document.querySelectorAll('#mb [data-cmtip]').forEach(b=>b.onclick=()=>{const t=(window.__cmTips||[])[+b.dataset.cmtip];if(!t||b.disabled)return;document.querySelectorAll('#mb [data-cmtip]').forEach(x=>{x.disabled=true;});cmContact(t,b);});},0);}
function cmContact(t,b){S.hp=clamp(S.hp-2,0,100);const dd=catOf(S.dept).includes(t.d)?t.d:S.dept;
  if(t.real){const it=makeItem(dd,{excl:true,mult:clamp(.9+t.imp/200,.9,1.25),src:'댓글 제보자'});const f=it.facts.find(x=>!fOK(x)&&!x.key);if(f)fFill(f,'댓글 제보자');S.items.push(it);if(chance(.5))addSource(dd,22);
    b.textContent=`제보자와 통화했다 → 「${it.title}」`;log(`댓글 제보: 「${it.title}」`);toast('진짜 내부자였다 — 새 단독 아이템');}
  else if(chance(.5)){const it=makeItem(dd,{excl:true,hoax:true,src:'댓글 제보자'});S.items.push(it);b.textContent=`그럴듯한 얘기를 들었다 → 「${it.title}」 (확인해 봐야 안다)`;toast('얘기는 들었는데… 확인이 필요하다');}
  else{b.textContent='연락하자 계정이 사라졌다. 장난이었다';toast('허탕 — 장난 댓글이었다');}}

// ----- 2) 마감 10분 전: 가끔 실제 시간이 흐르는 속보. 설정에서 '타이머 없이'나 '끔'으로 바꿀 수 있다 -----
function ddMode(){return S.ddMode||'on';}
function ddEvent(){const tv=isTV(),on=ddMode()==='on';const T=S.simple?45:35;const it=makeItem(S.dept,{mult:1.1});const call=12;
  const what=tv?'메인뉴스 생방송':OUT().type==='online'?'포털 송고 마감':'윤전기';const cap=(colBy('cap')||colBy('boss')||{}).name||'데스크';
  let left=T,state='wait',callEnd=0,done=false,iv=0;
  const fin=(kind)=>{if(done)return;done=true;clearInterval(iv);Q.unshift(()=>ddResult(kind,it,cap));closeModal();};
  openModal(`마감 직전 · ${what}`,`<p class="lede">${tv?'부조정실':'편집국'}이 술렁인다. 방금 들어온 소식: 「${esc(it.title)}」. 타사는 아직 모른다.</p>
   <p>${esc(cap)}: "넣을 거면 지금 정해. ${tv?'큐 사인 들어간다':'판 내린다'}!"</p>${on?`<div class="ddt"><b id="ddT">${T}</b>초<div class="ddbar"><i id="ddB" style="width:100%"></i></div><small id="ddS">마감까지</small></div>`:'<p class="hint">타이머 없이 고른다 (설정에서 바꿀 수 있다)</p>'}`,[
   {label:'지금 바로 1보를 넣는다',sub:'빠르다 · 확인이 덜 돼 틀릴 수 있다',fn:()=>{fin('rush');return false;}},
   {label:'전화 한 통만 더 돌리고 넣는다',sub:on?`확인에 ${call}초 걸린다 · 시간이 모자라면 놓친다`:'더 정확하다 · 놓칠 수도 있다',fn:()=>{if(!on){fin(chance(.7+S.st.spd/400)?'checked':'late');return false;}if(state!=='wait')return false;state='call';callEnd=left-call;[...document.querySelectorAll('#mc button')].slice(0,2).forEach(x=>x.disabled=true);const s=document.getElementById('ddS');if(s)s.textContent='확인 전화 중…';return false;}},
   {label:'내일 자로 미룬다',sub:'안전하다 · 단독은 사라질 수 있다',fn:()=>{fin('hold');return false;}}]);
  const tk=mTok;if(!on)return;
  iv=setInterval(()=>{if(mTok!==tk){clearInterval(iv);if(!done){done=true;}return;}left--;const e=document.getElementById('ddT'),bb=document.getElementById('ddB');if(e)e.textContent=Math.max(0,left);if(bb)bb.style.width=Math.max(0,left/T*100)+'%';
    if(state==='call'&&left<=callEnd)return fin('checked');if(left<=0)return fin(state==='call'?'late':'miss');},1000);}
function ddResult(kind,it,cap){const tv=isTV();let txt='',title='';
  if(kind==='rush'){valN('sp',3,'확인 전에 1보를 넣었다');if(chance(.62+S.st.ver/300+S.st.spd/600)){title='1보 단독';txt=quickClip(`[단독] ${it.title}`,R(52,68),Math.max(30,it.imp))+' · '+apply({fame:.8});ach('first');}else{title='1보가 틀렸다';txt=quickClip(it.title,R(32,44),Math.max(22,it.imp*.7))+' · '+apply({trust:-2,eval:-1});log('속보 1보 오류 — 다음 판에서 바로잡았다');}}
  else if(kind==='checked'){valN('sp',-2,'한 통 더 확인하고 넣었다');title='확인하고 넣었다';txt=quickClip(`[단독] ${it.title}`,R(64,80),Math.max(34,it.imp))+' · '+apply({fame:1.2,eval:.6});}
  else if(kind==='late'){title='마감을 넘겼다';txt=apply({eval:-.6});S.items.push(Object.assign(it,{excl:false}));log('확인 전화하다 마감을 놓쳤다');}
  else if(kind==='miss'){title='아무것도 못 정했다';txt=apply({eval:-1});log('속보 앞에서 얼어붙었다');}
  else{title='내일 자로';S.items.push(Object.assign(it,{excl:chance(.4)}));txt='아이템으로 챙겼다';}
  openModal(title,`<p class="lede">${kind==='rush'&&/틀렸/.test(title)?`${esc(cap)}: "숫자가 틀렸잖아! 다음 판에서 고쳐."`:kind==='checked'?`${esc(cap)}: "그래, 그게 맞다. 깔끔하네."`:kind==='late'?`${tv?'큐 사인이':'윤전기가'} 먼저 돌았다. 타사 1보가 포털에 걸렸다.`:kind==='miss'?`${esc(cap)}: "가만히 있으면 어떡해!"`:kind==='hold'?'급하게 넣느니 하루 더 보기로 했다.':`${tv?'자막이':'1보가'} 나갔다. 타사보다 먼저다.`}</p><p class="hint">${esc(txt)}</p>`);}

// ----- 3) 내 기사, 그 후: 굵직한 기사는 몇 달·몇 년 뒤 결과로 돌아온다. 기사 성격에 따라 결과가 갈린다 -----
function afterRecord(it,clip,W,unvN){if(!S||S.story)return;const imp=clip.imp||0;if(!(imp>=58||(clip.excl&&imp>=42)))return;S.after=S.after||[];if(S.after.length>=10)return;
  const src=it.src&&S.sources.some(s=>s.name===it.src)?it.src:'';
  S.after.push({h:clip.h,d:it.d,subj:it.subj||'',ent:it.ent||null,imp,q:clip.q,excl:!!clip.excl,rb:!!clip.rb,unv:unvN||0,t:S.turn,src,due:S.turn+R(20,110)+(imp>=70?R(0,40):0),done:0});}
const AFTER_CAT={law:['pol','soc','eco','med','edu','fin','estate','labor','it'],probe:['case','court','inv','soc','pol','eco','fin','ind']};
function afterPick(a){const W=[];const inC=(k)=>AFTER_CAT[k].includes(a.d);
  W.push(['law',(a.imp/28)*(a.q>=65?1.5:.6)*(inC('law')?1.4:.6)]);
  W.push(['probe',(a.excl?1.6:.5)*(inC('probe')?1.5:.5)*(a.imp/60)]);
  W.push(['suit',(a.unv?2.2:.25)+(!a.rb?.8:0)+(a.q<50?.6:0)]);
  W.push(['source',a.src?1.6:0]);
  W.push(['anniv',.7]);
  W.push(['award',a.excl&&a.imp>=68&&a.q>=72?1.2:0]);
  W.push(['fade',1.1]);
  const tot=W.reduce((x,w)=>x+w[1],0);let r=Math.random()*tot;for(const w of W){r-=w[1];if(r<=0)return w[0];}return 'fade';}
function afterMonth(lines){if(!S.after||!S.after.length)return;const a=S.after.find(x=>!x.done&&x.due<=S.turn);if(!a)return;a.done=1;S.after=S.after.filter(x=>!x.done).slice(-10);
  const y=Math.max(1,Math.round((S.turn-a.t)/YW)),ago=y>=1&&S.turn-a.t>=YW?`${y}년 전`:`${Math.max(1,Math.round((S.turn-a.t)/4))}달 전`;const k=afterPick(a);const cl=(S.clips||[]).find(c=>c.h===a.h);const note=t=>{if(cl)cl.after=t;};
  if(k==='law'){const t=`${ago} 내 기사 「${a.h}」 이후 관련 제도가 바뀌었다. 개정안이 국회를 통과했다.`;lines.push({c:'g',t:t+` (${apply({fame:1.6,eval:1})})`});note('기사 이후 제도 개선');tick(`「${a.h}」 보도 이후 개정안 국회 통과`,1);log(t);}
  else if(k==='probe'){const t=`${ago} 내가 쓴 「${a.h}」 — 수사기관이 관련자를 재판에 넘겼다.`;lines.push({c:'g',t:t+` (${apply({fame:1.1,trust:.6})})`});note('보도 이후 관련자 기소');log(t);}
  else if(k==='suit'){note('보도 뒤 소송');Q.push(()=>{const strong=a.q>=60&&!a.unv;openModal('그때 그 기사, 소송',`<p class="lede">${ago} 쓴 「${esc(a.h)}」${jp(esc(a.h),'을','를')} 두고 ${esc(a.subj||'상대')} 측이 손해배상 소송을 냈다. ${a.rb?'당시 반론은 받아 뒀다.':'당시 반론을 못 받았다.'} ${a.unv?'확인이 덜 된 대목이 있었다.':'확인은 탄탄했다.'}</p>`,[
     {label:'끝까지 맞선다',sub:strong?'근거가 탄탄하다 · 이기면 평판↑':'근거가 약하다 · 지면 신뢰·통장↓',rec:strong,risk:!strong,fn:()=>{const win=chance(strong?.8:.35);if(win){toast('승소 — '+apply({fame:1.2,trust:1}));log(`「${a.h}」 소송 승소`);}else{S.money-=R(200,600);toast('패소 — '+apply({trust:-2,eval:-1}));log(`「${a.h}」 소송 패소`);}}},
     {label:'정정보도로 합의한다',sub:'조용히 끝난다 · 신뢰 조금↓',fn:()=>{toast('합의 — '+apply({trust:-.8}));log(`「${a.h}」 정정보도 합의`);}}]);});}
  else if(k==='source'){const s=S.sources.find(x=>x.name===a.src);if(s){s.trust=clamp(s.trust+12,0,100);const up=pick(['국장','본부장','대표','실장','처장']);s.role=String(s.role).replace(/(과장|팀장|차장|부장|주무관|사무관|직원)$/,'')+up;
      const it=makeItem(s.d,{excl:true,mult:1.2,keyConf:s.trust>=55,src:s.name});S.items.push(it);const t=`${ago} 「${a.h}」 때 지켜 준 취재원 ${jo2(s.name,'이','가')} ${jo2(s.role,'이','가')} 되어 먼저 연락해 왔다 → 「${it.title}」`;lines.push({c:'g',t});note('그때의 취재원이 다시 찾아왔다');log(t);}}
  else if(k==='anniv'){const it=makeItem(a.d,{mult:1.05,pre:1});it.title=`${a.h.replace(/^\[단독\] /,'')}, 그 후`;const f=it.facts.find(x=>!fOK(x));if(f)f.conf=f.need;S.items.push(it);lines.push({c:'',t:`${ago} 쓴 「${a.h}」 — 그 뒤가 궁금하다는 독자 메일이 쌓였다. 후속 기획 「${it.title}」${jp(it.title,'을','를')} 챙겼다.`});note('후속 기획');}
  else if(k==='award'){const t=`${ago} 단독 「${a.h}」${jp(a.h,'이','가')} 기자상 심사 후보에 올랐다는 연락이 왔다.`;lines.push({c:'g',t:t+` (${apply({fame:1.5,eval:1.5})})`});note('기자상 후보');log(t);}}

// ----- 4) 함께 늙어 가는 인물: 수습 때 만난 세 사람이 커리어 내내 함께 자란다 -----
const FIG_DEF={pol:{d:'pol',path:['초선 의원','재선 의원','당 대변인','원내대표','대선 후보'],top:'대통령',sc:['정치자금 쪼개기 후원','선거 캠프 불법 자금','측근 인사 청탁']},
 pros:{d:'court',path:['평검사','부부장검사','부장검사','지검장','검찰총장 후보'],top:'검찰총장',sc:['수사 정보 유출','전관 변호사와의 유착','봐주기 수사 의혹']},
 biz:{d:'eco',path:['스타트업 대표','투자 유치한 대표','유니콘 기업 의장','대기업 회장','경제단체장 후보'],top:'경제단체 회장',sc:['분식 회계','하청 갑질 은폐','편법 승계']},
 civ:{d:'soc',path:['시민단체 간사','사무처장','공동대표','청와대 비서관','장관 후보자'],top:'장관',sc:['후원금 유용','논문 표절','자녀 특혜']},
 judge:{d:'court',path:['배석판사','단독판사','부장판사','법원장','대법관 후보'],top:'대법관',sc:['전관 변호사 청탁','재판 거래 의혹','주식 차명 보유']},
 cop:{d:'case',path:['형사계 경위','강력팀장','경찰서장','지방청장','경찰청장 후보'],top:'경찰청장',sc:['수사 무마 청탁','유흥업소 유착','사건 기록 조작']},
 diplo:{d:'diplo',path:['외교부 사무관','주재국 참사관','국장','대사','장관 후보'],top:'외교부 장관',sc:['관저 공사 특혜','기밀 유출','자녀 이중국적 특혜']},
 fin:{d:'fin',path:['은행 대리','지점장','본부장','은행장','금융지주 회장 후보'],top:'금융지주 회장',sc:['부실 대출 은폐','채용 비리','파생상품 불완전 판매']},
 tech:{d:'it',path:['스타트업 개발자','공동창업자','플랫폼 대표','빅테크 의장','과기부 장관 후보'],top:'IT 업계의 거물',sc:['개인정보 무단 판매','알고리즘 조작','스톡옵션 편법 증여']},
 build:{d:'estate',path:['시행사 직원','중견 건설사 이사','건설사 대표','재개발 조합의 큰손','건설협회장 후보'],top:'건설협회장',sc:['분양가 담합','부실 시공 은폐','인허가 로비']},
 doc:{d:'med',path:['전공의','응급의학과 교수','대학병원 센터장','병원장','보건복지부 장관 후보'],top:'보건복지부 장관',sc:['리베이트 수수','의료사고 은폐','논문 대필']},
 teach:{d:'edu',path:['평교사','교사노조 간부','교육청 장학관','교육감 후보','교육감'],top:'교육부 장관',sc:['채용 비리','교재 납품 리베이트','학교 폭력 은폐']},
 art:{d:'cul',path:['독립영화 감독','신인 감독상 수상자','천만 감독','영화제 집행위원장','문화계의 거장'],top:'문화체육관광부 장관',sc:['투자금 유용','스태프 임금 체불','작품 표절']},
 star:{d:'ent',path:['연습생','데뷔한 아이돌','음원 차트 1위 가수','월드 투어 스타','기획사 대표'],top:'엔터 업계의 거물',sc:['탈세','소속사 갑질','사재기 의혹']},
 ath:{d:'spo',path:['고교 유망주','국가대표','올림픽 메달리스트','대표팀 감독','체육회장 후보'],top:'대한체육회장',sc:['선수 폭행 은폐','협회 예산 유용','승부 조작 연루']},
 mayor:{d:'city',path:['구의원','시의원','구청장','시장','도지사 후보'],top:'도지사',sc:['측근 특혜 계약','개발 정보 투기','관용차 사적 사용']}};
const FIG_SLIP={pol:['낙선했다','경선에서 졌다'],pros:['한직으로 밀려났다','인사에서 물먹었다'],biz:['투자 유치에 실패했다','신사업이 고꾸라졌다'],civ:['내부 갈등으로 물러났다','공천에서 떨어졌다'],judge:['인사에서 밀렸다','지방 법원으로 발령 났다'],cop:['승진 심사에서 떨어졌다','감찰을 받고 좌천됐다'],diplo:['한직 공관으로 발령 났다','인사에서 물먹었다'],fin:['실적 부진으로 밀려났다','합병 뒤 자리를 잃었다'],tech:['투자 유치에 실패했다','서비스가 망했다'],build:['미분양으로 휘청였다','수주 경쟁에서 졌다'],doc:['보직 경쟁에서 밀렸다','병원 내 갈등으로 물러났다'],teach:['선거에서 떨어졌다','보직에서 밀려났다'],art:['신작이 흥행에 참패했다','투자가 끊겼다'],star:['컴백이 실패했다','계약 분쟁에 휘말렸다'],ath:['부상으로 시즌을 접었다','선발전에서 떨어졌다'],mayor:['낙선했다','공천에서 밀렸다']};
// 내 부서와 가까운 사람이 더 잘 엮인다 (적어도 한 명은 내 분야)
function figPickKinds(){const mc=(()=>{try{return catOf(S.dept);}catch(e){return [S.dept];}})();const near=k=>mc.includes(FIG_DEF[k].d)||FIG_DEF[k].d===S.dept;
  const all=shuffle(Object.keys(FIG_DEF)).filter(k=>DEPTS[FIG_DEF[k].d]||k==='pol');const A=all.filter(near),B=all.filter(k=>!near(k));const out=[];if(A.length)out.push(A.shift());
  while(out.length<3&&(A.length||B.length)){const fromA=A.length&&chance(.4);out.push(fromA?A.shift():B.length?B.shift():A.shift());}return out;}
function figEnsure(){if(!S||S.story||S.phase!=='game'||S.figs)return;const ks=figPickKinds();S.figs=ks.map((k,i)=>{const F=FIG_DEF[k];const st=S.founder?1:S.rank>=4?2:S.rank>=2?1:0;
  const s={id:uid(),name:(typeof rnameU==='function')?rnameU(new Set((S.sources||[]).map(x=>x.name))):rname(),role:F.path[st],d:DEPTS[F.d]?F.d:S.dept,trust:R(14,24),pers:pick(Object.keys(PERS)),last:-9,fresh:S.turn,fig:1};S.sources.push(s);
  return {k,sid:s.id,name:s.name,st,intro:S.founder?'창간 무렵 만난':S.rank<=1?'수습 때 만난':'젊은 시절 만난',next:S.turn+R(150,260)+i*R(10,40),luck:Math.random(),sc:chance(.45),scDone:0,fall:0,top:0};});}
function figSrc(f){return (S.sources||[]).find(s=>s.id===f.sid);}
function figMonth(lines){if(!S.figs)return;S.figs.forEach(f=>{if(f.fall||f.top||S.turn<f.next)return;const F=FIG_DEF[f.k],s=figSrc(f),tr=s?s.trust:0;
  // 승진·당선은 운과 평판을 탄다. 가끔은 미끄러진다
  if((f.slip||0)<2&&chance(.18+(f.luck<.25?.15:0))){f.slip=(f.slip||0)+1;f.next=S.turn+R(80,160);lines.push({c:'',t:`${f.intro||'오래 알고 지낸'} ${F.path[f.st]} ${jo2(f.name,'이','가')} 한 번 미끄러졌다. ${pick(FIG_SLIP[f.k]||['한 번 고배를 마셨다','자리를 놓쳤다'])}.`});return;}
  f.st++;f.slip=0;f.next=S.turn+R(170,280);const role=f.st<F.path.length?F.path[f.st]:F.top;if(s)s.role=role;
  if(f.st>=F.path.length){f.top=1;lines.push({c:'g',t:`${f.name}, 마침내 ${role}. ${f.intro||'오래 알고 지낸'} 그 사람이다.${tr>=55?' 첫 인터뷰는 나에게 주겠다고 했다.':''}`});if(tr>=55){apply({fame:2});const it=makeItem(F.d,{excl:true,mult:1.4,keyConf:true,src:f.name});it.title=`[인터뷰] ${role} ${f.name}, 첫 육성`;S.items.push(it);}tick(`${f.name} ${role} 취임`,1);return;}
  lines.push({c:'',t:`${f.intro||'오래 알고 지낸'} ${f.name}, 이제 ${role}.${tr>=55?' "자네라서 먼저 말하는 거야." 따로 귀띔이 왔다.':tr<=15?' 이제는 전화를 잘 받지 않는다.':''}`});
  if(tr>=55){const it=makeItem(F.d,{excl:true,mult:1.15+f.st*.05,src:f.name});S.items.push(it);}
  // 오래 묵은 비리: 높이 올라갈수록 터질 때가 다가온다. 오랜 인연과 기사 사이
  if(f.sc&&!f.scDone&&f.st>=2&&chance(.5))Q.push(()=>figScandal(f));});}
function figScandal(f){if(f.scDone)return closeModal();f.scDone=1;const F=FIG_DEF[f.k],s=figSrc(f),tr=s?s.trust:0,role=s?s.role:F.path[f.st];const what=pick(F.sc);
  openModal('오랜 인연의 그림자',`<p class="lede">${esc(role)} ${esc(f.name)}. 수습 때부터 알고 지낸 사람이다. 그런데 손에 「${esc(f.name)} ${esc(what)}」 정황이 들어왔다.</p><p class="hint">${tr>=50?'가까운 사이라 내부 사정을 누구보다 잘 안다.':'아주 가깝진 않다.'} 쓰면 인연은 끝난다. 덮으면 언젠가 다른 기자가 쓸 수도 있다.</p>`,[
   {label:'쓴다',sub:'초대형 단독 아이템 · 이 사람과의 관계는 끝',rec:true,fn:()=>{const it=makeItem(F.d,{excl:true,mult:1.6+f.st*.08,keyConf:tr>=50,src:'오랜 인연'});it.title=`[단독] ${role} ${f.name}, ${what}`;S.items.unshift(it);if(s){s.trust=0;s.role+=' (등 돌림)';}f.fall=1;log(`오랜 인연 ${f.name}의 비리를 쓰기로 했다`);toast('아이템으로 챙겼다 — 사실 확인부터');}},
   {label:'모른 척 덮는다',sub:'관계는 지킨다 · 신뢰↓ · 나중에 다른 매체가 쓸 수 있다',risk:true,fn:()=>{if(s)s.trust=clamp(s.trust+10,0,100);toast(apply({trust:-3}));S.figCover=(S.figCover||[]).concat([{n:f.name,what,due:S.turn+R(24,96)}]);log(`${f.name}의 비리를 덮었다`);}}]);}
function figCoverMonth(lines){if(!S.figCover||!S.figCover.length)return;const x=S.figCover.find(c=>c.due<=S.turn);if(!x)return;S.figCover=S.figCover.filter(c=>c!==x);
  if(chance(.6)){const rv=(S.rival&&S.rival.name)||'타사 기자';lines.push({c:'r',t:`${jo2(rv,'이','가')} ${x.n}의 ${jo2(x.what,'을','를')} 터뜨렸다. "그 기자는 알고 있었다"는 말이 돈다. (${apply({trust:-2.5,fame:-2})})`});}}
// ===== 정식 1.0 발탁 트랙: 조건이 어려운 대신 연차·재직 기간을 덜 채우고 승진한다 =====
function ftGoals(r){const z=promoSz?promoSz():1,n=x=>Math.max(1,Math.round(x*(z>1.2?1.15:1)*(S.simple?.7:1)));
  if(r<=2)return{sc:n(r===1?3:3),ag:n(2),ev:6};
  if(r===3)return{sc:n(2),ag:n(2),dt:n(2),ev:6};
  return{fw:n(r===4?3:4),tk:1,ev:6};}
// 발탁 트랙은 다음 승진까지 기다리는 기간(연차·재직)의 4분의 3이 지나면 열린다
function ftOpenY(r){const tg=Math.max(r+1,nextRank(r)??r+1);const a=r>=2?yrsNeedFor(r):0,b=yrsNeedFor(tg);return Math.max(1,Math.min(b-1,Math.floor(a+(b-a)*.75)));}
function ftAgN(){const t0=S.ft?S.ft.t0:S.turn;return (S.clips||[]).filter(c=>c.turn>=t0&&c.by===S.name&&/^[AS]$/.test(gradeOf({imp:c.imp||0,excl:c.excl}))).length;}
function ftErrN(){const t0=S.ft?S.ft.t0:S.turn;return (S.errT||[]).filter(t=>t>=t0).length;}
function ftProg(){const F=S.ft;if(!F)return [];const g=F.g,b=F.b,L=[];const sc=(S.scoops||0)-b.sc,fw=(S.fwWins||0)-b.fw,tk=(S.tokjong||0)-b.tk,dt=(S.deptTop||0)-b.dt,ag=ftAgN();
  if(g.sc)L.push({t:`단독 ${sc}/${g.sc}`,ok:sc>=g.sc});if(g.ag)L.push({t:`A등급 이상 기사 ${ag}/${g.ag}`,ok:ag>=g.ag});if(g.dt)L.push({t:`부서 성적 2위 이내 ${dt}/${g.dt}회`,ok:dt>=g.dt});
  if(g.fw)L.push({t:`1면 대결 ${fw}/${g.fw}승`,ok:fw>=g.fw});if(g.tk)L.push({t:`특종 이상 ${tk}/${g.tk}`,ok:tk>=g.tk});
  const ev=promoEv(F.r)+g.ev;L.push({t:`${evalName()} ${Math.round(S.eval)}/${ev}`,ok:S.eval>=ev});L.push({t:`트랙 중 오보 ${ftErrN()}/0건`,ok:ftErrN()===0});return L;}
function ftCan(){if(!S||S.story||S.founder||S.simple&&S.rank>=4)return false;const r=S.rank;if(r<1||r>5||S.ft||(S.ftCd||0)>S.turn||(S.ftUsed||{})[r])return false;const nx=nextRank(r);if(nx==null)return false;
  const minW=promoMinW(r),need=yrsNeedFor(Math.max(r+1,nx));if(S.inRank>=minW&&years()>=need)return false;
  if(S.inRank<minW*.75||years()<ftOpenY(r))return false;if(S.eval<promoEv(r)+4+dk('ft'))return false;if((S.errT||[]).some(t=>t>S.turn-YW))return false;return true;}
function ftOffer(){if(!ftCan()){closeModal();return;}const r=S.rank,g=ftGoals(r),nx=nextRank(r);const bs=colBy('boss');const who=bs?bs.name+' '+colRole(bs):(isTV()?'보도국장':'편집국장');
  const t0={r,g,b:{sc:S.scoops||0,fw:S.fwWins||0,tk:S.tokjong||0,dt:S.deptTop||0}};const GL=[];if(g.sc)GL.push(`단독 ${g.sc}건`);if(g.ag)GL.push(`A등급 이상 기사 ${g.ag}건`);if(g.dt)GL.push(`부서 성적 2위 이내 ${g.dt}회`);if(g.fw)GL.push(`1면 대결 ${g.fw}승`);if(g.tk)GL.push(`특종 이상 ${g.tk}건`);GL.push(`${evalName()} ${promoEv(r)+g.ev} 이상`);GL.push('트랙 기간 오보 0건');GL.push('연차 말고 다른 승진 조건은 그대로');const goals=GL.map(x=>`<li>${esc(x)}</li>`).join('');
  openModal('발탁 트랙 제안',`<p class="lede">${esc(jo2(who,'이','가'))} 따로 불렀다. "${rankName(nx)} 자리, 순서대로 기다리면 몇 년 걸려. 1년만 나한테 증명해 봐. 해내면 기수 무시하고 올린다."</p>
   <p><b>1년 안에 채울 것</b></p><ul class="feed">${goals}</ul>
   <p class="hint">해내면 다음 정기 인사에서 연차·재직 기간이 덜 찼어도 바로 승진한다. 트랙 동안은 매달 체력이 더 들고, 오보가 한 건이라도 나면 그 자리에서 탈락이다. 실패하면 ${jo2(evalName(),'이','가')} 깎이고 2년 동안 다시 기회가 없다.</p>`,[
   {label:'도전한다',sub:'조건 달성 시 조기 승진 · 매달 체력↓ · 실패 시 평가↓',risk:true,fn:()=>{S.ft={...t0,t0:S.turn,due:S.turn+YW};S.ftUsed=S.ftUsed||{};S.ftUsed[r]=1;log(`발탁 트랙 시작 — ${rankName(nx)} 조기 승진에 도전`);tick(`${OUT().n} — ${S.name} 기자 발탁 트랙`,1);toast('발탁 트랙에 들어갔다. 1년 승부다');}},
   {label:'순서대로 가겠다',sub:'아무 일도 없다',fn:()=>{S.ftUsed=S.ftUsed||{};S.ftUsed[r]=1;toast(`"그래, 천천히 가는 것도 방법이지."`);}}]);}
function ftFail(why){const F=S.ft;if(!F)return;S.ft=null;S.ftCd=S.turn+YW*2;const fx=apply({eval:-6,fame:-1.5});log(`발탁 트랙 탈락 — ${why}`);
  Q.push(()=>openModal('발탁 트랙 탈락',`<p class="lede">${esc(why)}</p><p>"기회는 줬다." 윗선의 시선이 식었다. 2년 동안은 다시 기회가 없다. 정상 승진 길은 그대로 열려 있다.</p>${fxLine(fx)}`));}
// 정기 인사 때 발탁 트랙을 먼저 본다. 승진하면 true
function ftJinsa(parts){const F=S.ft;if(!F)return false;if(S.rank!==F.r){S.ft=null;return false;}
  const P=ftProg(),okAll=F.ready||P.every(x=>x.ok);const nx=nextRank(S.rank),minW=promoMinW(S.rank);
  const base=[];if(S.fame<promoFm(S.rank))base.push(`평판 ${Math.round(S.fame)}/${promoFm(S.rank)}`);try{promoReqs(S.rank).slice(1).filter(x=>!x.ok).forEach(x=>base.push(x.t));}catch(e){}
    if(okAll&&!base.length){S.ft=null;ach('ftrack');parts.unshift(`<p class="lede">발탁 인사. 기수를 건너뛰고 ${rankName(nx)}에 올랐다.</p>`);promote();return true;}
  if(S.turn>=F.due&&okAll){S.ft=null;S.ftCd=S.turn+YW;const fx=apply({eval:2,fame:1});parts.push(`<p><b>발탁 트랙 종료</b> — 트랙 목표는 다 해냈지만 다른 승진 조건(${esc(base.join(', '))})이 모자라 이번엔 오르지 못했다. 윗선은 성과를 기억한다. ${fxLine(fx)}</p>`);return false;}
  if(S.turn>=F.due){ftFail(okAll?'':`1년 안에 트랙 목표를 다 채우지 못했다 (${P.filter(x=>!x.ok).map(x=>x.t).join(', ')})`);return false;}
  parts.push(`<p><b>발탁 트랙 중간 점검</b> — ${P.map(x=>`${x.ok?'✓':'·'} ${esc(x.t)}`).join(' / ')}${base.length?` / 그 밖에: ${esc(base.join(', '))}`:''}. 남은 기간 ${moTxt(F.due-S.turn)}.</p>`);return false;}
function ftMonth(lines){const F=S.ft;if(!F)return;if(S.rank!==F.r){S.ft=null;return;}if(ftErrN()>0){ftFail('트랙 기간에 오보가 났다. 발탁은 없던 일이 됐다');return;}
  if(F.ready)return;if(S.turn>=F.due){const P0=ftProg();if(P0.every(x=>x.ok)){F.ready=1;lines.push({c:'g',t:'발탁 트랙 — 1년 목표를 모두 채웠다. 다음 정기 인사에서 결정된다'});}else ftFail(`1년 안에 트랙 목표를 다 채우지 못했다 (${P0.filter(x=>!x.ok).map(x=>x.t).join(', ')})`);return;}
  S.hp=clamp(S.hp-3,0,100);const P=ftProg();lines.push({c:'',t:`발탁 트랙 — ${P.filter(x=>x.ok).length}/${P.length} 달성 · 남은 기간 ${moTxt(Math.max(0,F.due-S.turn))} (야근이 늘어 체력 -3)`});}
function ftBox(){const F=S.ft;if(!F)return '';const P=ftProg();return `<div class="card"><div class="t">${ic('rocket')} 발탁 트랙 · ${rankName(nextRank(F.r))} 조기 승진</div><div class="reqs">${P.map(x=>`<span class="${x.ok?'ok':''}">${esc(x.t)}</span>`).join('')}</div><p class="hint" style="margin:6px 0 0">남은 기간 ${moTxt(Math.max(0,F.due-S.turn))} · 다 채우면 다음 정기 인사에서 바로 승진</p></div>`;}