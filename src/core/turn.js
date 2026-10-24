/* 바이라인 1.6 — src/core/turn.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ================= 주말 처리 =================
function baseScene(){if(!S||S.phase!=='game')return S&&S.phase==='title'?'newsroom':'interview';if(S.rank===7)return 'office';if(S.rank===0)return 'police';return 'newsroom';}
const PORTAL=['미제휴','검색 제휴','뉴스스탠드 제휴','콘텐츠 제휴(CP)'];
const PORTAL_TR=[.3,.7,1,1.45];
function initPortal(o){const lv=o.custom?0:o.p>=4?3:o.p===3?(chance(.5)?3:2):1;S.portal={lv,pen:0,apply:0,demote:0};}
function portalMult(){return (S.portal?PORTAL_TR[S.portal.lv]*(S.portal.demote>0?.6:1):1)*eraPortal();}
function portalPen(v,why){if(v>0&&why&&/광고|협찬|홍보/.test(why)&&S.flags)S.flags.prPub=(S.flags.prPub||0)+1;if(!S.portal)return;S.portal.pen=Math.max(0,S.portal.pen+v);if(v>0&&why)log(`포털 벌점 +${v} (${why})`);}
function portalReview(lines){const P0=S.portal;if(!P0)return;
  if(P0.pen>=8&&P0.lv>1){P0.lv--;P0.demote=12;lines.push({c:'r',t:`포털 제휴 평가에서 벌점 누적으로 "${PORTAL[P0.lv]}"로 강등됐다. 트래픽이 크게 줄어든다.`});log(`포털 제휴 강등: ${PORTAL[P0.lv]}`);}
  else if(P0.pen>=5){lines.push({c:'r',t:`포털 제휴 평가 경고 (벌점 ${P0.pen}). 다음 평가에서 강등될 수 있다.`});}
  if(P0.apply){P0.apply=0;const sc=(S.founder?fs('pr')/5:0)+S.co.q+S.trust/2+S.fame/3-P0.pen*5+OUT().p*6+(S.facil&&S.facil.fact?8:0);const need=[45,75,100][P0.lv]??999;
    if(P0.lv<3&&sc>=need){P0.lv++;lines.push({c:'g',t:`포털 제휴 심사 통과! "${PORTAL[P0.lv]}"가 됐다.`});log(`포털 제휴 승격: ${PORTAL[P0.lv]}`);ach&&S.portal.lv===3&&tick(`${OUT().n}, 포털 콘텐츠 제휴(CP) 입성`,1);}
    else lines.push({c:'r',t:`포털 제휴 심사 탈락 (점수 ${Math.round(sc)}/${need}).`});}
  P0.pen=Math.max(0,P0.pen-3);
}
// 언론사 경쟁 구도
function initComp(){const o=OUT();const g=TYPES[o.type].g;let pool=OUTLETS.filter(x=>x.id!==o.id&&!x.custom&&!x.closed&&TYPES[x.type].g===g);if(pool.length<4)pool=OUTLETS.filter(x=>x.id!==o.id&&!x.custom&&!x.closed);
  {const sc=x=>(x.type===o.type?0:TYPES[x.type].g===g?6:14)+Math.abs(x.p-o.p);pool=OUTLETS.filter(x=>x.id!==o.id&&!x.custom&&!x.closed).sort((a,b)=>sc(a)-sc(b)).slice(0,5);}const sks=shuffle(Object.keys(C_STRAT));S.comp=pool.map((x,i)=>compInit1(x,sks[i%sks.length]));S.myPw0=null;}