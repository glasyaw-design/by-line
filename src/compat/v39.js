/* 바이라인 — src/compat/v39.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.42 공세 보도: 내 부서·우리 회사에 맞는 상대를 고른다 =====
// 예전: 어느 부서든 광고 큰 순서 6곳(대기업·정부)만 나왔고, 기사 제목도 「하청 단가·안전 점검」 같은 기업형 몇 개뿐이었다.
// 이제: 부장 이하는 내 부서 출입처, 국장단·대표는 우리 회사 부서 전체, 지역 매체는 지역 기관·기업을 먼저 · 분야별 연속 기획 제목 · 매체 체급·출입처 이해도가 파급력에 반영
const ATK_CAT={econ:'eco',sports:'spo',jeonja:'eco',techreport:'eco',uiyak:'soc',beopjeong:'soc',edujournal:'soc',tv:'pol',jp:'int',ch:'int',online:'soc',wire:'pol'};
function atkCat(id){const E=ENT[id]||{};const c=E.c||'';return ['pol','eco','soc','cul','ent','spo','int','loc'].includes(c)?c:(ATK_CAT[c]||(E.kind==='gov'?'pol':'eco'));}
const ATK_T={
 pol:{corp:['{n} 정치후원금 쪼개기 정황','{n} 여론조사 표본 조작 의혹','{n} 정책 용역 수의계약 몰아주기'],gov:['{n} 특수활동비 사용 내역 비공개','{n} 공천 과정 뒷거래 의혹','{n} 보좌진 채용 특혜 정황','{n} 예산 끼워 넣기 정황']},
 eco:{corp:['{n} 하청 단가 후려치기 의혹','{n} 일감 몰아주기 정황','{n} 회계 처리 논란','{n} 담합 정황 내부 문건','{n} 총수 일가 부당 지원 의혹'],gov:['{n} 대기업 제재 봐주기 의혹','{n} 감독 부실 정황','{n} 퇴직자 재취업 유착 의혹']},
 soc:{corp:['{n} 안전 점검 결과 축소 정황','{n} 피해 신고 묵살 의혹','{n} 갑질 내부 고발','{n} 제품 결함 은폐 의혹'],gov:['{n} 피해 신고 묵살 의혹','{n} 관리 감독 부실','{n} 내부 고발자 불이익 정황','{n} 감사 결과 은폐 의혹']},
 loc:{corp:['{n} 지역 개발 사업 특혜 정황','{n} 지자체 수의계약 독식 의혹','{n} 지역 상권 갑질 논란'],gov:['{n} 수의계약 몰아주기 의혹','{n} 업무추진비 사적 사용 의혹','{n} 인허가 과정 유착 정황','{n} 측근 채용 특혜 논란']},
 cul:{corp:['{n} 작가 계약 갑질 논란','{n} 표절 의혹 은폐 정황','{n} 공연 안전 관리 부실'],gov:['{n} 지원금 심사 불공정 의혹','{n} 블랙리스트 정황','{n} 보조금 부당 집행']},
 ent:{corp:['{n} 연습생 불공정 계약 의혹','{n} 정산 누락 정황','{n} 소속 연예인 혹사 논란','{n} 음원 사재기 정황'],gov:['{n} 콘텐츠 지원 사업 특혜 의혹','{n} 심의 기준 고무줄 논란']},
 spo:{corp:['{n} 선수 폭행 은폐 의혹','{n} 승부조작 연루 정황','{n} 구단 운영비 유용 의혹'],gov:['{n} 협회 예산 유용 의혹','{n} 지도자 선임 특혜 정황','{n} 체육 시설 사업 특혜 의혹']},
 int:{corp:['{n} 해외 사업 리베이트 의혹','{n} 수출 규정 위반 정황','{n} 해외 법인 비자금 의혹'],gov:['{n} 외교 문건 축소 정황','{n} 해외 공관 예산 낭비','{n} 해외 원조 사업 부실 의혹']}};
function atkTitles(id){const E=ENT[id]||{};const T=ATK_T[atkCat(id)];const k=E.kind==='gov'||E.kind==='party'?'gov':'corp';return (T&&T[k]&&T[k].length?T[k]:PRESS_T[k==='gov'?'gov':'corp']);}
function atkScope(){if(S.founder||S.rank>=4)return {who:S.founder?'우리 회사':'편집국',cats:new Set((OUT().depts||[]).flatMap(d=>catOf(d)))};return {who:(DEPTS[S.dept]?DEPTS[S.dept].n:'내 부서'),cats:new Set(catOf(S.dept))};}
function atkRel(e){const sc=atkScope();const c=atkCat(e[0]);const mine=new Set(catOf(S.dept));const loc=OUT().type==='local'||!!REGIONS[OUT().id];
  if(loc&&c==='loc')return [3,'우리 지역'];if(mine.has(c))return [S.founder||S.rank>=4?2.2:3,'내 출입처'];if(sc.cats.has(c))return [S.founder||S.rank>=4?2.2:1.1,'우리 회사 부서 분야'];return [.4,'다른 분야(취재 기반 약함)'];}
function atkDept(id){const c=atkCat(id);const o=OUT();if(catOf(S.dept).includes(c))return S.dept;return (o.depts||[]).find(d=>catOf(d).includes(c))||S.dept;}
function atkK(id){const o=OUT();const c=atkCat(id);let k=.7+.12*(o.p||2);const loc=o.type==='local'||!!REGIONS[o.id];if(loc&&c==='loc')k*=1.25;if(catOf(S.dept).includes(c))k*=1.15;else if(!atkScope().cats.has(c))k*=.85;try{if(isTV())k*=1.1;}catch(e){}return clamp(k,.7,1.45);}
function atkPlace(n){const t=OUT().type;try{if(isTV())return n<=2?'메인뉴스 톱':'메인뉴스';}catch(e){}if(t==='online')return n<=2?'메인 톱':'메인';if(t==='wire')return n<=2?'긴급·종합':'종합';return n<=2?'1면':'종합면';}
// 승산: 4주 공세의 압박 vs 상대의 버티는 힘 (atkMonth와 같은 셈)
function atkWin(e){const E=ENT[e[0]]||{w:0};const power=(E.w||0)*3000+(E.kind==='gov'?110:80)+(S.net&&S.net[e[0]]?Math.max(0,S.net[e[0]].rel):0);const pr=(30*4+40)*atkK(e[0]);return pr/(pr+power);}
function atkTargets(){const L=ENTS.filter(e=>(e[2]==='corp'||e[2]==='gov')&&S.net&&S.net[e[0]]&&!(S.atkDone&&S.atkDone[e[0]]>S.turn));
  L.forEach(e=>{const r=atkRel(e);e._r=r;e._sc=r[0]*(.6+atkWin(e))+Math.min(1.2,(e[4]||0)*12)+(S.net[e[0]].rel<0?.4:0);});
  L.sort((a,b)=>b._sc-a._sc);const out=[],per={},cap=S.founder||S.rank>=4?2:3;L.forEach(e=>{const c=atkCat(e[0]);if(out.length<6&&(per[c]||0)<cap){out.push(e);per[c]=(per[c]||0)+1;}});L.forEach(e=>{if(out.length<6&&!out.includes(e))out.push(e);});return out;}
function atkSub(e){const w=atkWin(e);const r=e._r||atkRel(e);return `${r[1]} · 승산 ${w>=.68?'높음':w>=.55?'보통':'낮음'} · 광고 비중 ${((adShareOf(e[0])||0)*100).toFixed(1)}% · 관계 ${Math.round(S.net[e[0]].rel)}`;}
// 공세 대상이 끝나면 한동안 같은 곳은 목록에서 빠진다
{const _ae39=atkEnd;atkEnd=function(){try{if(S.atk){(S.atkDone=S.atkDone||{})[S.atk.id]=S.turn+48;}}catch(e){}return _ae39.apply(this,arguments);};}
// 윗선 지시·부서원 기사도 부서·회사에 맞는 상대를 고른다 (AI)
pressPick=function(){const L=ENTS.filter(e=>e[4]>0&&(e[2]==='corp'||e[2]==='gov')&&!(S.net&&S.net[e[0]]&&S.net[e[0]].cut>0));if(!L.length)return null;
  const W=L.map(e=>e[4]*atkRel(e)[0]);const tot=W.reduce((a,b)=>a+b,0);let r=Math.random()*tot;for(let i=0;i<L.length;i++){r-=W[i];if(r<=0)return L[i];}return L[0];};
// 공세 보도 창 첫머리: 누구 기준으로 골랐는지
{const _om39=openModal;openModal=function(t,b,c){try{if(t==='공세 보도 — 누구를 파헤칠까'){const sc=atkScope();b=(b||'')+`<p class="hint">${esc(sc.who)} 기준으로 골랐다 — ${S.founder||S.rank>=4?'회사 부서들이 맡는 분야':'내 출입처'}${OUT().type==='local'||REGIONS[OUT().id]?'와 우리 지역':''}부터. 출입처를 잘 알수록, 매체 체급이 클수록 기사가 세게 먹힌다. 승산은 상대의 영향력·광고 규모·우리와의 관계로 본다.</p>`;}}catch(e){}return _om39.call(this,t,b,c);};}

// ===== 1.42 기사 쓰기: 겹치는 문구 정리 =====
function sbjN(s){return String(s||'').replace(/\s*측$/,'');}
function hd38N(s){return String(s||'').replace(/[\s"“”'‘’…·,.!?()\[\]]/g,'');}
headCompose=function(it,W,c){const P=headParts(it,W);let tag=c.tag&&P.pre?P.pre:'';
  let body=(P.body.find(x=>x.k===c.body)||P.body[0]).t.replace(/^\[단독\] /,'');
  const bm=body.match(/^(\[[^\]]+\]) /);if(bm){tag+=bm[1]+' ';body=body.slice(bm[0].length);}
  let parts=body.split('…').map(x=>x.trim()).filter(Boolean);
  let front='';if(c.front==='quote'&&W.qt)front=`"${yamaShort(W.qt.q,20)}"`;if(c.front==='num'&&P.nf)front=yamaShort(P.nf.t,22);
  if(front){const core=hd38N(c.front==='quote'?W.qt.q:P.nf.t).slice(0,7);const dg=c.front==='num'?(String(P.nf.t).match(/\d[\d,.]*/)||[''])[0].replace(/,/g,''):'';const dup=parts.filter(p=>hd38N(p).includes(core)||(dg.length>=2&&p.replace(/,/g,'').includes(dg)));
    if(dup.length){if(parts.length>dup.length)parts=parts.filter(p=>!dup.includes(p));else front='';}}
  let tail='';const hk=String(it.id||it.title).split('').reduce((a,ch)=>a+ch.charCodeAt(0),0);const all=()=>parts.join(' ')+' '+front;
  if(c.tail==='key'&&P.C.K){let K=P.C.K;const s0=sbjN(it.subj||'');if(s0&&K.startsWith(s0)&&all().includes(s0))K=K.slice(s0.length).trim()||K;const qm=K.match(/"([^"]+)"/);const kn=hd38N(qm?qm[1]:K).slice(0,8);if(hd38N(all()).includes(kn)){if(!/"/.test(K)&&!/확인/.test(all())){const j=parts.findIndex(p=>hd38N(p).includes(kn));if(j>=0&&!/[다요까]$/.test(parts[j]))parts[j]+=' 확인';}}else tail=/"/.test(K)?K:`${K} 확인`;}
  if(c.tail==='rb'){const rq=yamaShort(it.rbq||HEAD_R[0],14);if(!hd38N(all()).includes(hd38N(rq).slice(0,6)))tail=hd38N(all()).includes(hd38N(P.S0))?`"${rq}"`:`${P.S0} "${rq}"`;}
  if(c.tail==='ask'){const A=['왜?','누구 책임인가','이대로 괜찮나'];const kw=[/왜/,/책임/,/괜찮/];let i=hk%3;for(let n=0;n<3&&kw[i].test(all());n++)i=(i+1)%3;tail=A[i];}
  if(c.tail==='bait')tail=['"충격"','경악','"이럴 수가"'][hk%3];
  let h=tag+[front].concat(parts).concat([tail]).filter(Boolean).join('…');
  return h.replace(/(논란|의혹|정황|확인) \1/g,'$1').replace(/(\S{2,}) \1(?=\s|…|$)/g,'$1').replace(/…+/g,'…').replace(/\s+/g,' ').trim();};
// 야마 고르기: 같은 사실을 두 선택지가 똑같이 따옴표로 세우지 않게
{const _yo39=yamaOpt;yamaOpt=function(it,tag){const r=_yo39.apply(this,arguments);try{if(r&&tag==='st'){const key=it.facts.find(f=>f.key)||it.facts[0];if(key&&(key.k==='s'||key.k==='w'))r.l='스트레이트 — 확인한 사실만 짧게';}}catch(e){}return r;};}
{const _hy39=headYama;headYama=function(it,W,pre){let r=_hy39.apply(this,arguments);try{if(r){const S0=sbjN(it.subj||'당국');if(S0&&r.split(S0).length>2){const i=r.lastIndexOf(S0);r=(r.slice(0,i)+r.slice(i+S0.length)).replace(/…\s+/,'…');}}}catch(e){}return r;};}