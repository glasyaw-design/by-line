/* 바이라인 1.6 — src/compat/v49.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */



// ===== 1.6 저장·불러오기 바로잡기 =====
// (1) 새 게임에 저장 형식 표시가 빠져 있어, 처음 불러올 때마다 편집국 명부·주재기자·동료가 새로 만들어지던 문제
// (2) 저장 파일에선 「내 팀원」과 「명부 속 같은 사람」이 따로 풀린다 → 불러올 때 같은 사람으로 다시 묶는다
{const _ns49=newState;newState=function(){const s=_ns49.apply(this,arguments);try{s.ver4=2;}catch(e){}return s;};}
function relink49(s){try{if(!s||!s.ros||!s.ros.per)return;const canon=new Map();const key=m=>m&&(m.id!=null?'i'+m.id:'n'+m.name+'|'+(m.d||''));
  const reg=a=>(a||[]).forEach(m=>{if(m&&typeof m==='object'){const k=key(m);if(!canon.has(k))canon.set(k,m);}});
  reg(s.team);reg(s.mates);if(Array.isArray(s.corr))reg(s.corr);if(s.corrList)Object.values(s.corrList).forEach(a=>Array.isArray(a)&&reg(a));
  Object.keys(s.ros.per).forEach(d=>{const L=s.ros.per[d];if(!Array.isArray(L))return;const seen=new Set();s.ros.per[d]=L.map(m=>{const c=canon.get(key(m));return c||m;}).filter(m=>{if(!m||seen.has(m))return false;seen.add(m);return true;});});}catch(e){console.error(e);}}
{const _mg49=migrate;migrate=function(s){try{if(s&&(s.ver4||0)<2&&s.ros&&s.ros.v3)s.ver4=2;relink49(s);}catch(e){}return _mg49.apply(this,arguments);};}
// 아이템 제목에 같은 낱말이 겹치는 경우(「누리시 의회 의회」) 하나로
function dedup49(t){if(typeof t!=='string')return t;return t.replace(/(^|[\s「"'])([가-힣A-Za-z]{2,})\s+\2(?=[\s,.!?」"'·]|$)/g,(m,a,w)=>/^(하나|다시|점점|조금|천천히|계속|아니|또)$/.test(w)?m:a+w);}
{const _mi49=makeItem;makeItem=function(){const it=_mi49.apply(this,arguments);try{if(it&&it.title)it.title=dedup49(it.title);}catch(e){}return it;};}
// 명부 정합성: (1) 한 사람이 두 부서에 걸리면 지금 부서에만 (2) 새로 꾸린 내 팀원이 명부에 없으면 넣고, 같은 부서의 이름 없는 평기자 한 명과 자리를 바꾼다
{const _ro49=roster;roster=function(){const per=_ro49.apply(this,arguments);try{if(!S||!per||S.phase!=='game')return per;const keys=Object.keys(per).filter(k=>Array.isArray(per[k]));
  const where=new Map();keys.forEach(d=>per[d].forEach(m=>{if(!m)return;(where.get(m)||where.set(m,[]).get(m)).push(d);}));
  where.forEach((ds,m)=>{if(ds.length<2)return;const keep=ds.includes(m.d)?m.d:ds[0];ds.forEach(d=>{if(d!==keep)per[d]=per[d].filter(x=>x!==m);});});
  const T=S.team||[];const CR=new Set((typeof corrs==='function'?corrs():[])||[]);const TS=new Set(T);const touched=new Set();
  T.forEach(m=>{if(!m||m.reg||where.has(m))return;const d=per[m.d]?m.d:keys.find(k=>DEPTS[k]&&!isRegD(k))||m.d;if(!per[d])per[d]=[];
    if(!S.founder){const L=per[d];const f=L.filter(x=>!TS.has(x)&&!CR.has(x)&&!(typeof lk45==='function'&&lk45(x))&&(x.r||0)===0&&x.rk==null).sort((a,b)=>(a.skill||0)-(b.skill||0))[0];if(f)per[d]=L.filter(x=>x!==f);}
    per[d].push(m);touched.add(d);});
  touched.forEach(d=>{try{if(!isRegD(d))fixDept(per[d],d);}catch(e){}});
  // 한 부서에 부장이 둘이면: 내가 앉힌 사람(최근) → 점수 높은 사람 하나만 남기고 나머지는 차장(선임)으로
  keys.forEach(d=>{if(!DEPTS[d]||isRegD(d))return;const H=per[d].filter(m=>m&&(m.r||0)===2&&!m.acting);if(H.length<2)return;const lkH=H.filter(m=>typeof lk45==='function'&&lk45(m)&&m.lk45.head&&!m.lk45.dem).sort((a,b)=>b.lk45.t-a.lk45.t);const keep=lkH[0]||H.slice().sort((a,b)=>orgScore(b)-orgScore(a))[0];H.forEach(m=>{if(m!==keep){m.r=1;if(m.lk45)m.lk45={...m.lk45,r:1,head:false};}});});}catch(e){console.error(e);}return per;};}