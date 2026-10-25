/* 바이라인 — src/systems/desking.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// --- 데스크 ---
// ===== 5.7 부장 데스크: 본사 부장은 기사를 덜 쓰고 부서 초고를 다듬는다 (지역 주재 부장은 예전 그대로) =====
// ===================== 6.2 데스킹 초고: 그 기사의 사실로 짓는다 =====================
/* [옮김] function jo2 → src/core/utils.js (원래 이 자리. 함수 선언은 끌어올려지므로 앞 파일에 둬야 원본과 같다) */
function ro2(w){const c=String(w||'').trim().slice(-1);const k=c.charCodeAt(0);if(k>=44032&&k<=55203){const b=(k-44032)%28;return w+(b===0||b===8?'로':'으로');}if(/[0-9]/.test(c))return w+('1378'.includes(c)?'로':'으로');return w+'로';}
function bat2(w){const k=String(w||'').trim().slice(-1).charCodeAt(0);return k>=44032&&k<=55203&&(k-44032)%28>0;}
function qGo(q){return /다$/.test(q)?`"${q}"고`:bat2(q)?`"${q}"이라고`:`"${q}"라고`;}
function deskFactSent(f){const t=String(f.t).replace(/\s*(확인|입수|존재|확보)$/,'');const m=/^(.{0,16}?)\s*"([^"]{2,40})"\s*$/.exec(t);
  if(m){const who=m[1].trim()||'한 관계자';return `${jo2(who,'은','는')} ${/다$/.test(m[2])?`"${m[2]}"라고`:qGo(m[2])} 말했다.`;}
  if(f.k==='d')return `취재팀이 입수한 문건에서도 ${jo2(t,'이','가')} 확인됐다.`;
  if(f.k==='n')return /\d/.test(t)?`관련 자료를 분석했더니 「${t}」${bat2(t)?'이라는':'라는'} 결과가 나왔다.`:`취재팀은 ${t} 자료도 확보했다.`;
  if(f.k==='s')return `취재진이 현장을 찾아가 보니 ${jo2(t,'이','가')} 눈에 띄었다.`;
  return `취재 결과 ${jo2(t,'이','가')} 확인됐다.`;}
// 6.8 데스킹 문제 생성기: 유형을 매번 섞고, '틀려 보이지만 맞는 문장(함정)'을 같이 넣는다
const DESK_SP=[['한 관계자는 "이제 어떻해요"라며 한숨을 쉬었다.','한 관계자는 "이제 어떡해요"라며 한숨을 쉬었다.','"어떻해요"는 틀린 표기. "어떡해요"가 맞다.'],
 ['피해자들은 몇일째 답을 기다리고 있다고 했다.','피해자들은 며칠째 답을 기다리고 있다고 했다.','"몇일"은 없는 말. "며칠"이 맞다.'],
 ['한 직원은 "이러면 않 돼요"라고 말했다.','한 직원은 "이러면 안 돼요"라고 말했다.','"않 돼요"가 아니라 "안 돼요". 부정 부사는 "안"이다.'],
 ['내부 소문은 금새 퍼졌다.','내부 소문은 금세 퍼졌다.','"금새"가 아니라 "금세"(금시에)다.'],
 ['담당자가 서류를 일일히 다시 확인했다.','담당자가 서류를 일일이 다시 확인했다.','"일일히"가 아니라 "일일이"다.'],
 ['감독 기관이 제 역활을 하지 못했다는 지적이다.','감독 기관이 제 역할을 하지 못했다는 지적이다.','"역활"이 아니라 "역할"이다.'],
 ['현장에선 희안한 일도 벌어졌다.','현장에선 희한한 일도 벌어졌다.','"희안한"이 아니라 "희한한"이다.'],
 ['한 피해자는 "어의가 없다"고 했다.','한 피해자는 "어이가 없다"고 했다.','"어의"는 임금의 의사다. "어이없다"가 맞다.'],
 ['담당 과장은 "서류만 내면 되요"라고 안내했다.','담당 과장은 "서류만 내면 돼요"라고 안내했다.','"되요"가 아니라 "돼요"(되어요)다.'],
 ['주민들의 바램은 하나였다.','주민들의 바람은 하나였다.','"바램"은 색이 바래는 것. 소망은 "바람"이다.']];
const DESK_DUP=[['관련 피해액은 약 {X}여억 원으로 추산된다.','관련 피해액은 약 {X}억 원으로 추산된다.','"약"과 "여"를 겹쳐 썼다. 둘 중 하나만.'],
 ['안건은 과반수 이상의 찬성으로 통과됐다.','안건은 과반의 찬성으로 통과됐다.','"과반수"에 이미 "넘는다"는 뜻이 있다. "과반수 이상"은 겹말.'],
 ['같은 문제가 다시 재발할 우려가 크다.','같은 문제가 재발할 우려가 크다.','"다시 재발"은 겹말. "재발"만 쓴다.'],
 ['{S}는 일정을 사전에 미리 공지하지 않았다.','{S}는 일정을 미리 공지하지 않았다.','"사전에 미리"는 겹말.'],
 ['피해자는 남은 여생을 치료에 써야 한다.','피해자는 남은 생을 치료에 써야 한다.','"여생"이 이미 "남은 생"이다. 겹말.'],
 ['{S} 측은 "향후 앞으로 개선하겠다"고 했다.','{S} 측은 "앞으로 개선하겠다"고 했다.','"향후"가 곧 "앞으로"다. 겹말.']];
const DESK_WHO=['현직 팀장','피해자','감독기관 관계자','전직 임원','협력업체 대표','동료 직원'];
const DESK_ORG=['도시공사','시설관리공단','교육지원청','보건소','구청','소방서','상공회의소'];
function deskFlaws(d,nb,ndec){const S0=d.subj||'해당 기관';const fx=d.fx||[];const yy=2027+Math.floor((S&&S.turn||0)/YW);const sp=t=>subJ(t,'{S}',S0);const B=[],D=[];
  const NRE=/\d+(?![\d,.])(?!\s*대)/;const nf=fx.find(f=>f.k==='n'&&NRE.test(f.t));
  const wq=fx.map(f=>{const m=/^(.{0,16}?)\s*"([^"]{2,40})"\s*$/.exec(String(f.t).replace(/\s*(확인|입수|존재|확보)$/,''));return m?{f,who:m[1].trim()||'한 관계자',q:m[2]}:null;}).find(Boolean);
  const C={
   num:nf?()=>{const tm=/\d+\s*(개월|년|일|세|시간|주|분|차|회)/.test(nf.t);const bad=nf.t.replace(NRE,(m)=>String(tm?(+m+R(2,9)):pick([+m*10,Math.max(1,Math.round(+m/10))||+m+R(3,9)])));return {b:{t:deskFactSent({t:bad,k:'n'}),e:`취재 메모에는 "${nf.t}"${ro2(nf.t).slice(nf.t.length)} 적혀 있다. 숫자를 옮겨 적다 틀렸다.`,src:nf.t},g:null};}:null,
   quote:wq?()=>{if(chance(.5)){const o=pick(DESK_WHO.filter(x=>x!==wq.who));return {b:{t:deskFactSent({t:`${o} "${wq.q}"`,k:'w'}),e:`메모상 이 말을 한 사람은 ${jo2(wq.who,'이다','다')}. 발언자를 바꿔 적었다.`,src:wq.f.t},g:null};}
     const alt=pick((HEAD_Q[d.d]||HEAD_Q.soc).filter(x=>x!==wq.q));return {b:{t:deskFactSent({t:`${wq.who} "${alt}"`,k:'w'}),e:`메모에 적힌 발언은 따로 있다 — "${wq.q}". 직접 인용은 한 글자도 바꾸면 안 된다.`,src:wq.f.t},g:null};}:null,
   date:()=>{const cm=month(),lp=y=>y%4===0&&(y%100!==0||y%400===0);const BD=[[2,30],[2,31],[4,31],[6,31],[9,31],[11,31],[2,29]],GD=[[2,28],[1,31],[3,31],[5,31],[8,31],[10,31],[12,31],[7,31],[4,30],[6,30],[9,30],[11,30],[2,29]];
     // 7.0 날짜는 지금 시점에 맞게: 지난 일은 지난해·재작년, 앞으로 할 일은 이번 달 이후(올해) 또는 내년
     const PT=[(y,m,x)=>`문제의 계약은 ${y} ${m}월 ${x}일 체결됐다.`,(y,m,x)=>`내부 감사는 ${y} ${m}월 ${x}일 시작됐다.`,(y,m,x)=>`첫 민원은 ${y} ${m}월 ${x}일 접수됐다.`],FT=[(y,m,x)=>`${jo2(S0+' 측','은','는')} ${y} ${m}월 ${x}일까지 해명 자료를 내기로 했다.`,(y,m,x)=>`감사 결과는 ${y} ${m}월 ${x}일 발표될 예정이다.`];
     const when=md=>{if(chance(.5)){const b=pick([1,2]);return {y:yy-b,lab:b===1?'지난해':'재작년',T:PT};}return md[0]>cm?{y:yy,lab:'올해',T:FT}:{y:yy+1,lab:'내년',T:FT};};
     let b,w,g2=0;do{b=pick(BD);w=when(b);}while(b[0]===2&&b[1]===29&&lp(w.y)&&g2++<20);
     let g,v,g3=0;do{g=pick(GD);v=when(g);}while(g[0]===2&&g[1]===29&&!lp(v.y)&&g3++<20);
     return {b:{t:pick(w.T)(w.lab,b[0],b[1]),e:b[0]===2&&b[1]===29?`${w.lab}(${w.y}년)는 윤년이 아니다. 2월 29일이 없다.`:`${b[0]}월에는 ${b[1]}일이 없다.`},g:{t:pick(v.T)(v.lab,g[0],g[1])}};},
   calc:()=>{const k=pick(['pct','frac','dbl','sum','half']);
     if(k==='pct'){const a=R(4,9)*10,b=a+a/2;return {b:{t:`관련 신고는 지난해 ${a}건에서 올해 ${b}건으로 ${chance(.5)?a/2:150}% 늘었다.`,e:`${a}건에서 ${b}건이면 50% 증가다.`},g:{t:`관련 신고는 지난해 ${a}건에서 올해 ${b}건으로 50% 늘었다.`}};}
     if(k==='frac'){const n=R(3,6)*60;return {b:{t:`응답자 ${n}명 중 ${n/4}명, 즉 3분의 1이 같은 경험을 했다고 답했다.`,e:`${n/4}/${jo2(n,'은','는')} 4분의 1이다.`},g:{t:`응답자 ${n}명 중 ${n/3}명, 즉 3분의 1이 같은 경험을 했다고 답했다.`}};}
     if(k==='dbl'){const a=R(3,9)*20;return {b:{t:`피해 건수는 1년 새 ${a}건에서 ${a*1.5}건으로 두 배가 됐다.`,e:`${a}건에서 ${a*1.5}건은 1.5배다. "두 배"는 과장.`},g:{t:`피해 건수는 1년 새 ${a}건에서 ${a*2}건으로 두 배가 됐다.`}};}
     if(k==='sum'){const x=R(30,90),y=R(20,70);return {b:{t:`피해자는 남성 ${x}명과 여성 ${y}명, 모두 ${x+y+R(1,3)*10}명이다.`,e:`${x}명과 ${y}명을 더하면 ${x+y}명이다. 합계가 틀렸다.`},g:{t:`피해자는 남성 ${x}명과 여성 ${y}명, 모두 ${x+y}명이다.`}};}
     const a=R(5,12)*20;return {b:{t:`관련 금액은 3년 전 ${a}억 원에서 올해 ${Math.round(a*.7)}억 원으로 절반이 됐다.`,e:`${a}억에서 ${Math.round(a*.7)}억이면 30% 줄어든 것이다. "절반"은 과장.`},g:{t:`관련 금액은 3년 전 ${a}억 원에서 올해 ${a/2}억 원으로 절반이 됐다.`}};},
   hype:()=>{const P=[['이번 일은 사상 최악의 사태로 기록될 전망이다.','근거 없는 최상급 표현. 무엇과 비교한 "사상 최악"인지 없다.'],['이는 본지가 국내 최초로 확인한 사실이다.','확인할 수 없는 "최초" 주장. 근거 없는 과장.'],['피해자 모두가 분노하고 있다.','몇 명을 만났는지 없이 "모두"로 일반화했다.'],['전문가들은 한목소리로 '+S0+'의'+' 책임을 지적했다.','어떤 전문가가 몇 명인지 없다. 익명의 다수로 뭉뚱그렸다.'],['이 같은 일은 전국 어디서나 벌어지고 있다.','근거 없는 일반화. 다른 지역 사례를 하나도 확인하지 않았다.']];
     const G=[`관련 통계를 공개한 2015년 이후 가장 많은 수치라고 ${jo2(pick(['관계 당국','감독 당국','통계 담당 부처']),'은','는')} 밝혔다.`,`취재팀이 만난 관계자 ${R(5,12)}명 가운데 대부분이 같은 문제를 지적했다.`,`${pick(['법학','행정학','회계학'])} 교수 두 명은 "제도 보완이 필요하다"고 입을 모았다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};},
   jump:()=>{const P=[[`${jo2(S0+' 측','은','는')} 공식적으로 침묵하고 있지만 사실상 의혹을 인정한 것이다.`,'침묵을 인정으로 해석했다. 기자의 비약.'],[`${S0} 측의 해명은 거짓말로 보인다.`,'기자의 판단을 사실처럼 썼다. 해명이 거짓이라는 근거를 대야 한다.'],[`경찰 조사를 받은 담당자 이모(${R(41,58)})씨가 사실상 이번 일의 주범이다.`,'수사 단계에서 유죄를 단정했다. 무죄 추정 원칙 위반.'],[`${S0} 측이 답을 피한 것 자체가 의혹을 뒷받침한다.`,'답변 회피를 증거로 삼았다. 논리 비약.']];
     const G=[`${jo2(S0+' 측','은','는')} "사실과 다르다"며 법적 대응을 검토하겠다고 밝혔다.`,`경찰은 담당자 이모(${R(41,58)})씨를 불러 사실관계를 조사하고 있다.`,`${jo2(S0+' 측','은','는')} 본지의 질의에 답하지 않았다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};},
   expose:()=>{const P=[[`제보자 D씨는 ${S0}에서 3년째 ${pick(['총무 일을','회계 일을','시설 관리를','실무를'])} 맡고 있다.`,'근무 기간과 업무로 제보자가 특정된다. 취재원 보호 원칙 위반.'],[`제보자 김모(${R(26,34)})씨는 ${S0} ${pick(['총무팀','회계팀','민원팀'])}의 유일한 ${R(2,5)}년 차 직원이다.`,'"유일한 ○년 차"면 누군지 다 안다. 제보자 노출.'],['제보 문자는 내부 메신저 계정으로 발송됐다.','발송 경로가 드러나면 제보자를 역추적할 수 있다.']];
     const G=['제보자 A씨는 신원 노출을 우려해 익명을 요청했다.','본지는 제보자 보호를 위해 일부 내용을 바꿔 적었다.',`A씨는 "보복이 두렵다"며 이름을 밝히지 말아 달라고 했다.`];const p=pick(P);return {b:{t:p[0],e:p[1]},g:{t:pick(G)}};},
   spell:()=>{const L=shuffle(DESK_SP.slice());return {b:{t:L[0][0],e:L[0][2]},g:{t:L[1][1]}};},
   dup:()=>{const L=shuffle(DESK_DUP.slice());const X=String(R(2,9)*10);const f=t=>sp(t.replace('{X}',X));return {b:{t:f(L[0][0]),e:L[0][2]},g:{t:f(L[1][1])}};},
   org:()=>{const o=pick(DESK_ORG.filter(x=>!S0.includes(x)));const on=`${pick(CITIES)} ${o}`;return {b:{t:`${jo2(on+' 측','은','는')} "사실관계를 확인 중"이라고 밝혔다.`,e:`취재 대상은 ${jo2(S0,'이다','다')}. 다른 기관 이름이 들어갔다.`},g:null};}};
  try{if(typeof deskExtraFlaws==='function')Object.assign(C,deskExtraFlaws(d,S0,yy));}catch(e){}if(d.pos)try{Object.assign(C,deskPosFlaws(d,S0,yy));}catch(e){}const ks=shuffle(Object.keys(C).filter(k=>C[k]));if(nf&&chance(.35)){ks.splice(ks.indexOf('num'),1);ks.unshift('num');}
  const used=ks.slice(0,nb);used.forEach(k=>{const r=C[k]();B.push(r.b);});
  const dk=shuffle(ks.slice(nb).concat(used)).filter(k=>k!=='num'&&k!=='quote'&&k!=='org');for(const k of dk){if(D.length>=ndec)break;const r=C[k]();if(r.g&&!B.some(x=>x.t===r.g.t)&&!D.some(x=>x.t===r.g.t))D.push(r.g);}
  return {B,D};}
function deskSents(d,nb,nok){const S0=d.subj||'해당 기관';const fx=(d.fx&&d.fx.length?d.fx:[{t:d.f0,k:'d'}]);const ndec=S.simple?1:chance(.5)?2:1;
  const FL=deskFlaws(d,nb,ndec);const srcs=FL.B.map(x=>x.src).filter(Boolean);
  const open=d.pos?deskPosOpen(S0):pick([`본지 취재팀이 ${jo2(S0,'을','를')} 둘러싼 사안을 취재했다.`,`${S0}에서 석연치 않은 일이 이어지고 있다는 제보가 들어왔다.`,`본지가 ${S0+'의'} 내부 사정을 ${R(2,5)}주간 취재했다.`,`${jo2(S0,'을','를')} 둘러싼 의혹이 커지고 있다.`]);
  const close=d.pos?deskPosClose(S0):pick(['취재팀은 후속 취재를 이어 갈 예정이다.','관계 당국은 사실관계를 들여다보겠다고 했다.','본지는 추가 제보를 받고 있다.',`${S0} 안팎에서는 재발 방지책을 요구하는 목소리가 나온다.`]);
  const reply=d.pos?deskPosReply(S0):chance(.6)?`${jo2(S0+' 측','은','는')} ${qGo(pick(['사실관계를 확인 중','따로 밝힐 입장이 없다','일부 내용은 사실과 다르다']))} 밝혔다.`:`본지는 ${S0} 측에 여러 차례 입장을 물었으나 답변을 받지 못했다.`;
  const body=fx.filter(f=>!srcs.includes(f.t)).slice(0,3).map(deskFactSent).concat([reply,close]);
  const okS=[{t:open,bad:0}].concat(shuffle(body).slice(0,Math.max(1,nok-1-FL.D.length)).map(t=>({t,bad:0})),FL.D.map(x=>({t:x.t,bad:0,dec:1})));
  const badS=FL.B.map(f=>({t:f.t,e:f.e,bad:1}));
  return {ss:[okS[0]].concat(shuffle(okS.slice(1).concat(badS))),bad:badS,dec:okS.filter(x=>x.dec)};}
function deskFb(ss,bad,sel){return bad.map(b=>`<li class="${sel.includes(ss.indexOf(b))?'g':'r'}">${sel.includes(ss.indexOf(b))?'잡았다':'놓쳤다'} · ${esc(b.t)}<br><small>${esc(b.e)}</small></li>`).join('')+sel.filter(i=>!ss[i].bad).map(i=>`<li class="r">잘못 자름 · ${esc(ss[i].t)}<br><small>${ss[i].dec?'틀려 보이지만 맞는 문장이다. 계산·표기·출처가 모두 정확하다.':'멀쩡한 문장이었다.'}</small></li>`).join('');}
function deskMemo(d){const fx=d.fx&&d.fx.length?d.fx:[{t:d.f0,k:'d'}];return `<div class="dmemo"><div class="t">${esc(d.w||'기자')} 기자 취재 메모 · 확인된 사실</div><ul>${fx.map(f=>`<li><i>${FK[f.k]||'사실'}</i>${esc(f.t)}</li>`).join('')}</ul></div>`;}
function deskHeads(d){const fx=d.fx||[];const q=(fx.map(f=>/"([^"]{2,24})"/.exec(f.t)).find(Boolean)||[])[1];const n=(fx.find(f=>f.k==='n')||{}).t;const fill=x=>subJ(x.replace(/\{T\}/g,d.t),'{S}',d.subj||'당국').replace(/\{R\}/g,d.pos?pick(HEAD_RP):'사실과 다르다').replace(/\{N\}/g,n||'').replace(/\{Q\}/g,q||'').replace(/(논란|의혹|정황|확인) \1/g,'$1').replace(/(\S+) \1(?=$|…)/g,'$1');
  const ok=x=>!(/\{N\}/.test(x)&&!n)&&!(/\{Q\}/.test(x)&&!q);
  const HH=d.pos?HEAD_P:HEAD;const g=fill(pick(HH.honest.filter(x=>x!=='{T}'&&ok(x))));return {good:(d.excl&&!/^\[단독\]/.test(g)?'[단독] ':'')+g,hype:fill(pick(HH.bait)),dull:fill(pick(HH.calm.filter(ok))),over:d.pos?fill(pick(['{T}…업계 판도 바꿨다','{T}…"사상 최고" 확정','{T}, 세계 1위 눈앞','{T}…경쟁사 모두 제쳤다'])):fill(pick(['{T}…{S} 위법 사실로 드러나','{T}…책임자 처벌 불가피','{T}, 결국 사실로 판명','{T}…{S} 조직적 은폐','{T}…"윗선 지시" 확인']))};}
function bjDeskOn(){return !!(S&&S.phase==='game'&&!S.founder&&!S.story&&S.rank===3&&!isRegD(S.dept)&&(S.team||[]).length);}
const DESK_HYPE=['[충격] ','[경악] ','"믿을 수 없다"… '],DESK_DULL=[' 관련 문제 제기',' 논란 일어',' 지적 나와'];
function bjDraft(){const T=S.team||[];const m=T.length?pick(T):{name:rname(),skill:50};const it=makeItem(S.dept);const sk=m.skill||50;
  return {id:uid(),pos:!!it.pos||posT(it.title),ent:it.ent,w:m.name,role:m.r>=1?'desk':'peer',rel:m.rel??20,sk,t:it.title,d:it.d,subj:(it.subj||'').replace(/ 측$/,''),imp:it.imp,excl:!!it.excl,f0:(it.facts[0]||{t:'관계자 확인'}).t,fx:it.facts.map(f=>({t:f.t,k:f.k})),q:clamp(Math.round(sk*.62+R(4,26)),25,85),fl:clamp(3-Math.floor((sk-35)/22)+(chance(.3)?1:0),1,S.simple?2:3),due:S.turn+R(2,4),back:0,base:it.base};}
function bjEnsure(){if(!bjDeskOn())return;S.dq=S.dq||[];S.deskM=S.deskM||{n:0,q:0,top:0,err:0};if(S.dqT==null||S.turn-S.dqT>=2){S.dqT=S.turn;const want=clamp(Math.ceil((S.team||[]).length*.6),2,4);let g=0;while(S.dq.length<want&&g++<12){const nd=bjDraft();if(S.dq.some(x=>x.t===nd.t||fBase(x.t)===fBase(nd.t)))continue;S.dq.push(nd);}}}
function deskClip(d,q,head,place){try{if(d&&d.pos&&d.ent&&S.net&&S.net[d.ent])netUp(d.ent,R(2,4));}catch(e){}const o=OUT();const it={d:d.d};const pl=place||placeOf(q,d.imp,it);const views=Math.round(q*d.imp*(o.p+1)*R(6,10)/10);
  const clip={h:head,o:o.n,d:d.d,q,imp:d.imp,excl:d.excl,date:dateShort(),turn:S.turn,views,lead:`${d.f0}.`,by:d.w+' 기자',staff:1,desk:S.name,pos:!!d.pos,place:pl.n,portal:portalRank(d.imp,q,d.excl,gradeOf({imp:d.imp,excl:d.excl}),1,o.p),base:d.base};
  S.clips.unshift(clip);if(S.clips.length>60)S.clips.pop();if(/1면|톱|첫 꼭지/.test(pl.n||''))S.deskM.top=(S.deskM.top||0)+1;return clip;}
function bjMember(d){return (S.team||[]).find(m=>m.name===d.w);}
function bjDeskOpen(){bjEnsure();if(S.dqHold){S.dq=S.dq.filter(x=>x!==S.dqHold);}const Q=S.dq;if(!Q.length){toast('데스크가 비었다 · 다음 달 초고를 기다린다');return;}
  openModal('부장 데스크 · 초고함',`<p class="lede">부서원 초고 ${Q.length}건이 올라와 있다. 하나를 골라 꼼꼼히 보거나, 두 건을 빠르게 훑어 넘길 수 있다.</p><p class="hint">꼼꼼히: 문장 손질 → 제목 → 처리(출고·보강 지시·킬). 완성도가 크게 오르고 후배가 성장한다. 빠르게: 판단력·문장력으로 자동 처리, 완성도는 조금만 오르고 놓치는 문제가 생길 수 있다.</p>`,
   Q.slice().sort((a,b)=>a.due-b.due).map(d=>({label:`${d.w} · 「${d.t}」`,tag:d.excl?'단독':d.due-S.turn<=1?'마감 임박':'',sub:`초고 완성도 ${d.q} · 문제 ${d.fl}곳 · 파급력 ${d.imp}${d.back?' · 보강본':''}`,fn:()=>{spend(1,4);bjDeskFull(d);return false;}})).concat(Q.length>=2?[{label:'두 건 빠르게 훑어 넘기기',sub:'행동력 1 · 판단력·문장력 기준 자동 처리',fn:()=>{spend(1,3);bjDeskQuick();return false;}}]:[]).concat([{label:'닫기',cls:'ghost'}]));}
function bjDeskQuick(){const Q=S.dq.slice().sort((a,b)=>a.due-b.due).slice(0,2);const st=S.st||{};const lines=[];
  Q.forEach(d=>{S.dq=S.dq.filter(x=>x!==d);const sk=((st.wri||40)+(st.ver||40)+(st.kno||40)+(st.hed||40))/400;let miss=0;for(let i=0;i<d.fl;i++)if(!chance(.45+sk*.5))miss++;const q=clamp(Math.round(d.q+6+sk*6-miss*6),20,92);
    const c=deskClip(d,q,(d.excl?'[단독] ':'')+d.t);S.deskM.n++;S.deskM.q+=q;const m=bjMember(d);if(m)m.skill=clamp(m.skill+.25,0,95);
    if(miss&&chance(.04*miss*DF().risk))S.pending.push({type:'err',title:`${d.w} 기자의 「${d.t}」`,due:S.turn+R(1,3),desk:1});
    lines.push(`<li class="${miss?'':'g'}">${esc(d.w)} · 「${esc(d.t)}」 → 완성도 ${d.q}→${q} · ${esc(c.place||'')}${miss?` · 놓친 문제 ${miss}곳`:''}</li>`);});
  Q.forEach(()=>{try{misCount('desk');}catch(e){}});try{misCheck();}catch(e){}const t=apply({eval:.5,kno:.2});openModal('빠른 데스킹 결과',`<ul class="feed">${lines.join('')}</ul><p class="hint">빨리 넘기면 시간은 벌지만 후배는 덜 큰다.</p>${fxLine(t)}`);}
function bjDeskFull(d){const nb=d.fl,nok=S.simple?3:4;const DS=deskSents(d,nb,nok);const bad=DS.bad,ss=DS.ss;
  openModal(`데스킹 1/3 · ${d.w} 기자 초고`,`<p class="lede">「${esc(d.t)}」 · 초고 완성도 ${d.q}</p>${deskMemo(d)}<p>취재 메모와 대조해 문제가 있는 문장 <b>${nb}개</b>를 골라 지워라. 메모와 다른 숫자·인용·발언자, 엉뚱한 기관명, 있을 수 없는 날짜, 틀린 계산, 근거 없는 단정·과장, 겹말, 제보자 노출, 맞춤법 오류를 찾는다. 틀려 보이지만 맞는 문장도 섞여 있다. 멀쩡한 문장을 자르면 후배가 상처받는다.</p>${ss.map((x,i)=>`<button type="button" class="sent" data-i="${i}" aria-pressed="false">${esc(x.t)}</button>`).join('')}`,[{label:'다음: 제목',fn:()=>{
    const sel=[...document.querySelectorAll('#mb .sent')].filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>+b.dataset.i);let hit=0,fal=0;sel.forEach(i=>ss[i].bad?hit++:fal++);const miss=bad.length-hit;
    const fb=deskFb(ss,bad,sel);S.dq=(S.dq||[]).filter(x=>x!==d);S.dqHold=d;
    bjDeskHead(d,{hit,fal,miss,fb});return false;}},{label:'그만두기',cls:'ghost'}]);
  document.querySelectorAll('#mb .sent').forEach(b=>b.onclick=()=>b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true'));}
function bjDeskHead(d,r){const HH=deskHeads(d);const good=HH.good,hype=HH.hype,dull=HH.dull;
  const H=shuffle([{t:good,k:'good'},{t:hype,k:'hype'},{t:dull,k:'dull'}].concat(S.simple?[]:[{t:HH.over,k:'over'}]));
  openModal('데스킹 2/3 · 제목 달기',`<ul class="feed">${r.fb}</ul><p>${r.miss?`놓친 문제 문장 ${r.miss}곳.`:r.fal?'멀쩡한 문장까지 잘랐다.':'문장 손질은 깔끔했다.'} 이제 제목을 정한다.</p>`,H.map(h=>({label:h.t,sub:'',fn:()=>{bjDeskFin(d,r,h);return false;}})));}
function bjDeskFin(d,r,h){const hb={good:6,hype:3,dull:-2,over:1}[h.k];const q=clamp(Math.round(d.q+r.hit*6-r.miss*8-r.fal*3+hb+(S.st.wri||40)/20),15,95);
  const pl=placeOf(q,d.imp,{d:d.d});
  openModal('데스킹 3/3 · 처리',`<p class="lede">「${esc(h.t)}」</p><p>다듬은 완성도 <b>${q}</b> (초고 ${d.q}) · 이대로면 <b>${esc(pl.n)}</b></p>${r.miss?'<p class="warn" style="color:var(--sodium)">아직 문제 문장이 남아 있다. 내보내면 오보 위험.</p>':''}`,[
    {label:'출고한다',sub:`${pl.n} · 부서 실적에 바로 잡힌다`,fn:()=>{S.dq=S.dq.filter(x=>x!==d);S.dqHold=null;const c=deskClip(d,q,h.t,pl);S.deskM.n++;S.deskM.q+=q;const m=bjMember(d);
      if(m){m.skill=clamp(m.skill+(r.hit===d.fl&&!r.fal?1.1:.5),0,95);if(r.fal)m.rel=clamp((m.rel||0)-2,-50,100);else m.rel=clamp((m.rel||0)+1.5,-50,100);}
      if((r.miss||h.k==='over')&&chance((.08*r.miss+(h.k==='over'?.06:0))*DF().risk))S.pending.push({type:'err',title:`${d.w} 기자의 「${d.t}」`,due:S.turn+R(1,3),desk:1});
      const fx=apply({eval:.4+r.hit*.35-r.miss*.6+(h.k==='good'?.3:0),wri:.2,kno:.2,trust:h.k==='hype'?-1:h.k==='over'?-1.5:r.miss?-.5:.4,fame:/1면|톱/.test(c.place||'')?.4:0});S.flags.desked=(S.flags.desked||0)+1;
      openModal('데스킹 완료',`${clipHTML(c)}<p>${r.hit===d.fl&&!r.fal&&h.k==='good'?`완벽한 데스킹. ${esc(d.w)} 기자가 "부장님 손 거치니 기사가 달라졌습니다"라고 했다.`:h.k==='hype'?'제목이 세다. 조회수는 오르겠지만 항의 전화도 오겠다.':h.k==='over'?'제목이 취재 내용보다 앞서 나갔다. 메모에 없는 결론을 단정했다 — 반론 보도나 소송 빌미가 될 수 있다.':h.k==='dull'?'제목이 밋밋하다. 기사 가치만큼 읽히지 않겠다.':'출고했다.'}</p>${fxLine(fx)}`);return false;}},
    {label:'보강 지시하고 돌려보낸다',sub:'이번엔 안 나간다 · 후배가 고쳐 월말에 스스로 출고 · 후배 실력↑',fn:()=>{S.dq=(S.dq||[]).filter(x=>x!==d);S.dqHold=null;d.q=clamp(d.q+8+r.hit*2,20,90);d.fl=Math.max(0,d.fl-1-(r.hit>=r.miss?1:0));d.back=1;S.dqBack=(S.dqBack||[]).concat([d]);const m=bjMember(d);if(m){m.skill=clamp(m.skill+1.3,0,95);m.rel=clamp((m.rel||0)+(m.skill>55?1:-1),-50,100);}
      const fx=apply({eval:.3,cha:.2});openModal('보강 지시',`<p class="lede">"${pick(['반론부터 다시 받아 와.','숫자 출처 하나 더 붙여.','현장 사진 한 장만 더.'])}" ${esc(d.w)} 기자가 초고를 들고 나갔다. 더 나은 초고로 돌아온다.</p>${fxLine(fx)}`);return false;}},
    {label:'킬한다',sub:'기사를 내지 않는다 · 사고는 막지만 실적은 없다',cls:'ghost',fn:()=>{S.dq=S.dq.filter(x=>x!==d);S.dqHold=null;const m=bjMember(d);if(m)m.rel=clamp((m.rel||0)-3,-50,100);S.deskM.kill=(S.deskM.kill||0)+1;toast(`「${d.t}」 킬 · ${d.w} 기자 표정이 굳었다`);}}]);}
// 월말: 방치된 초고 정리 → 성적 집계 → 새 초고
function bjDeskMonth(lines){bjEnsure();const M=S.deskM||{n:0,q:0};let auto=0,kill=0,err=0;
  if(S.dqHold){const d=S.dqHold;S.dqHold=null;deskClip(d,clamp(d.q-3,15,85),(d.excl?'[단독] ':'')+d.t);lines.push({c:'',t:`손보다 만 「${d.t}」${jp(d.t,'은','는')} 차장이 마무리해 내보냈다`});}
  if((S.dqBack||[]).length){const B=S.dqBack;S.dqBack=[];B.forEach(d=>{const q=clamp(d.q+R(0,4),20,92);deskClip(d,q,(d.excl?'[단독] ':'')+d.t);M.n++;M.q+=q;if(d.fl>0&&chance(.02*d.fl*DF().risk))S.pending.push({type:'err',title:`${d.w} 기자의 「${d.t}」`,due:S.turn+R(1,4),desk:1});});lines.push({c:'g',t:`보강 지시한 초고 ${B.length}건이 고쳐져 나갔다 (${B.map(d=>d.w).join('·')} 기자)`});}
  (S.dq||[]).filter(d=>d.due<=S.turn+1).forEach(d=>{S.dq=S.dq.filter(x=>x!==d);const dqBad=(d.q<34)||((d.fl||0)>=3&&!d.excl);if(dqBad||(!d.excl&&chance(.15))){kill++;return;}auto++;const q=clamp(d.q-(d.excl?3:6),15,80);deskClip(d,q,(d.excl?'[단독] ':'')+d.t);if(chance(.03*d.fl*DF().risk)){err++;S.pending.push({type:'err',title:`${d.w} 기자의 「${d.t}」`,due:S.turn+R(1,4),desk:1});}});
  if(auto||kill)lines.push({c:auto+kill>=2?'r':'',t:`부장 데스크를 비운 사이 초고 ${auto+kill}건 — 차장이 ${auto}건을 대충 넘기고 ${kill}건은 킬했다`});
  const R0={n:M.n,q:M.n?M.q/M.n:0,top:M.top||0,err,auto,kill};S.deskM={n:0,q:0,top:0,err:0};S.dqT=null;bjEnsure();return R0;}
RUN.desk=function(){if(bjDeskOn())return bjDeskOpen();
  spend(1,4);
  const it=makeItem(S.rank>=4?pick(Object.keys(DEPTS)):S.dept);
  const subj=(it.subj||'').replace(/ 측$/,'');const nb=S.simple?1:S.rank>=4?3:2;const nok=S.simple?3:S.rank>=4?4:3;
  const DS=deskSents({subj,t:it.title,d:it.d,pos:!!it.pos||posT(it.title),fx:it.facts.map(f=>({t:f.t,k:f.k})),f0:(it.facts[0]||{t:''}).t},nb,nok);const bad=DS.bad,ss=DS.ss;const writer=S.team.length?pick(S.team).name:rname();
  openModal(`데스킹 · ${writer} 기자 초고`,`<p class="lede">「${esc(it.title)}」 초고다.</p>${deskMemo({w:writer,fx:it.facts.map(f=>({t:f.t,k:f.k})),f0:(it.facts[0]||{t:''}).t})}<p>취재 메모와 대조해 문제가 있는 문장 ${nb}개를 골라 지워라. 메모와 다른 숫자·인용·발언자, 엉뚱한 기관명, 있을 수 없는 날짜, 틀린 계산, 근거 없는 단정·과장, 겹말, 제보자 노출, 맞춤법 오류를 찾는다. 틀려 보이지만 맞는 문장도 섞여 있다.</p>${ss.map((s,i)=>`<button type="button" class="sent" data-i="${i}" aria-pressed="false">${esc(s.t)}</button>`).join('')}`,[{label:'데스킹 완료',fn:()=>{
    const sel=[...document.querySelectorAll('#mb .sent')].filter(b=>b.getAttribute('aria-pressed')==='true').map(b=>+b.dataset.i);
    let hit=0,fal=0;sel.forEach(i=>ss[i].bad?hit++:fal++);
    const miss=bad.length-hit;S.flags.desked=(S.flags.desked||0)+1;
    const txt=apply({eval:hit*.7-fal*1-miss*1.2+.3,kno:.4,wri:.2,trust:miss?-1:.5});
    if(miss&&chance(.07*miss*DF().risk))S.pending.push({type:'err',title:`${writer} 기자의 「${it.title}」`,due:S.turn+R(1,3),desk:1});
    S.team.forEach(t=>t.skill=clamp(t.skill+(hit===nb&&!fal?.6:.2),0,95));
    openModal('데스킹 결과',`<ul class="feed">${deskFb(ss,bad,sel)}</ul><p>${hit===nb&&!fal?'완벽한 데스킹. 후배가 고개를 숙였다.':miss?'놓친 문제 문장이 그대로 나갔다.':'멀쩡한 문장까지 잘랐다. 후배 표정이 굳었다.'}</p>${fxLine(txt)}`);return false;}}]);
  document.querySelectorAll('#mb .sent').forEach(b=>b.onclick=()=>b.setAttribute('aria-pressed',b.getAttribute('aria-pressed')==='true'?'false':'true'));
};
RUN.plan=function(){
  openModal('부서 기획회의','<p>이번 분기 부서 기획을 정한다.</p>',[
    {label:'탐사 시리즈 (3회 연속)',sub:'부서 성과 크게↑, 체력 소모',fn:()=>{spend(1,8);setCd('plan');S.flags.plan=10;S.items.push(makeItem(S.dept,{excl:true,mult:1.3}));toast(apply({fame:1.5,eval:1.5}));log('탐사 시리즈 기획 확정');}},
    {label:'데이터 저널리즘 프로젝트',sub:'부서 성과↑, 부서원 성장',fn:()=>{spend(1,4);setCd('plan');S.flags.plan=6;S.team.forEach(t=>t.skill=clamp(t.skill+1.5,0,95));toast(apply({kno:.8,eval:1}));}},
    {label:'독자 참여형 연말 기획',sub:'구독·트래픽↑',fn:()=>{spend(1,4);setCd('plan');S.flags.plan=3;S.co.bS+=.006;S.co.bT+=.012;toast(apply({eval:1}));}},
    {label:'취소',cls:'ghost'}]);
};
RUN.deptreq=function(){
  const o=OUT();const TN={A:'인기·특수 부서',B:'선호 부서',C:'',D:'지원자가 적은 부서'};
  openModal('부서 이동 신청',`<p>정기 인사(1월·7월)에 반영된다. 사내 평가가 높을수록, 지금 부서에 오래 있었을수록 받아들여지기 쉽다. 인기 부서는 조건이 붙고 경쟁이 세며, 사건팀·지역 주재처럼 지원자가 적은 곳은 잘 받아 준다.${S.rank>=2?' 차장 이상이면 그 부서 부서원을 새로 맡고, 부장은 그 부서 부장 자리를 노리는 것이라 더 어렵다.':''}</p>`,o.depts.filter(d=>d!==S.dept).map(d=>{const rq=deptReq(d);const bad=rq.filter(x=>!x.ok);const [t,why]=deptTier(d);const p=deptMoveP(d);
    return {label:DEPTS[d].n,tag:t==='A'?'인기':t==='B'?'선호':t==='D'?'지원 적음':'',rec:!bad.length&&p>=.6,disabled:bad.length>0,sub:(bad.length?'조건 부족: '+bad.map(x=>x.t).join(' · '):`받아들여질 가능성 ${p>=.6?'높음':p>=.35?'반반':'낮음'}${why?' · '+why:''}`)+(catOf(d).includes(MAJORS[S.major].aff)?' · 전공 적합':'')+' · '+deptPCtxt(d,true),fn:()=>{S.reqDept=d;setCd('deptreq');log(`${DEPTS[d].n} 이동 신청`);toast(`${DEPTS[d].n} 이동을 신청했다. 다음 정기 인사 때 결정된다`);}};}).concat([{label:'취소',cls:'ghost'}]));
};