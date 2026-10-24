/* 바이라인 1.6 — src/systems/network.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 기자들의 나이·연차·보직에 따른 행동 =====
// 주니어는 빨리 크지만 쉽게 흔들리고(이직·실수), 중견은 경쟁사가 노리는 전성기, 시니어는 덜 크고 덜 떠나며 후배를 가르친다. 60세면 정년.
function npcStage(m){const y=myrs(m);return y<5?'jr':y<13?'mid':y<22?'sr':'vet';}
const NPC_GROW={jr:.15,mid:.08,sr:.03,vet:-.03};
function npcLife(lines){const T=(S.team||[]);if(!T.length&&!(S.mates||[]).length)return;const mood=S.wMood??60;
  const all=T.concat((S.mates||[]).filter(m=>!T.includes(m)));
  all.forEach(m=>{const st=npcStage(m);m.skill=clamp(m.skill+NPC_GROW[st]*(m.r>=1&&st!=='vet'?1.2:1)*(mood>=70?1.2:mood<35?.6:1),15,92);});
  // 시니어가 있으면 주니어가 더 큰다 (사수-부사수)
  const sr=T.filter(m=>['sr','vet'].includes(npcStage(m))).length,jr=T.filter(m=>npcStage(m)==='jr');if(sr&&jr.length)jr.forEach(m=>m.skill+=.04*Math.min(3,sr));
  // 주니어 이탈: 처우·사기가 나쁠수록 (대기업 홍보실·로스쿨·공무원 등)
  if(S.rank>=2&&T.length>3){const j=T.filter(m=>npcStage(m)==='jr'&&m.rk==null&&!(m.own!=null&&S.turn-m.own<YW*3&&chance(.7)));const p=.012*j.length*(mood<40?2:mood>70?.5:1)*((S.payLv||1)<.95?1.5:1);if(chance(p)){const m=pick(j);S.team=S.team.filter(x=>x!==m);S.co.staff=Math.max(1,S.co.staff-1);const to=pick(['대기업 홍보실','로스쿨','공무원 시험','스타트업','다른 언론사']);log(`${m.name} 기자 퇴사 — ${to}`);lines.push({c:'r',t:`${m.name} 기자(${myrs(m)}년 차·${npcAge(m)}세)가 ${ro2(to)} 떠났다`});}}}
// 정기 인사 때: 정년퇴직 · 명예퇴직 · 연차에 따른 자동 승진(내가 인사권자가 아니면)
function npcJinsa(){const out=[];const T=S.team||[];const hard=S.co&&S.co.cash<0;
  T.slice().forEach(m=>{const a=npcAge(m);if(a>=60||(a>=55&&hard&&chance(.25))){S.team=S.team.filter(x=>x!==m);const n=genMember(m.d,30,48);n.yrs=R(1,3);n.t0=S.turn;S.team.push(n);out.push(`${m.name} ${MR[m.r||0]}(${a}세) ${a>=60?'정년퇴직':'명예퇴직'} → 후임 ${n.name} 기자`);log(`${m.name} ${a>=60?'정년퇴직':'명예퇴직'}`);}});
  (S.mates||[]).slice().forEach(m=>{if(npcAge(m)>=60){S.mates=S.mates.filter(x=>x!==m);out.push(`${m.name} 선배 정년퇴직`);}});
  // 편집국 명부의 기자들도 정기 인사 때 타사로 떠나거나 경력으로 들어온다 (부서 이동은 npcReshuffle)
  if(S.ros&&S.ros.per&&!S.founder){let mv=0,out2=0,inn=0;const dests=[];const fromC=[];let CRs2=[];try{CRs2=corrs();}catch(e){}const names=new Set((S.cols||[]).map(c=>c.name));
    const keys=Object.keys(S.ros.per).filter(d=>!/^x_/.test(d)&&DEPTS[d]&&!isRegD(d));
    keys.forEach(d=>{const L=S.ros.per[d];for(let i=L.length-1;i>=0;i--){const m=L[i];if(!m||(S.team||[]).includes(m)||names.has(m.name)||CRs2.includes(m)||(m.r||0)>=2)continue;
      const ae=(m.ai&&m.ai.e)||50;if(chance(.018*(ae<35?1.7:ae>=75?1.5:1)*((S.wMood??60)<40?1.4:1))){const comp=(S.comp||[]).length?pick(S.comp):null;const dest=comp?cName(comp):pick(['대기업 홍보실','로스쿨','공기업','스타트업']);dests.push(dest);const n=genMember(d,32,62);n.yrs=R(3,12);n.t0=S.turn;
        let src=null;if(chance(.45)&&(S.comp||[]).length){src=cName(pick(S.comp));fromC.push(src);inn++;}L[i]=n;out2++;}}});
    // 평가가 좋은 기자는 연차가 차면 차장으로, 부장 자리가 비면 차장이 부장으로
    let pro=0;keys.forEach(d=>{const L=S.ros.per[d];let hasHead=L.some(x=>(x.r||0)>=2);L.forEach(m=>{if(!m||(S.team||[]).includes(m)||names.has(m.name))return;const ae=(m.ai&&m.ai.e)||50,r=m.r||0;
      if(r===0&&myrs(m)>=9&&ae>=58&&(m.skill||50)>=48&&chance(.3)){m.r=1;m.yrs=Math.max(m.yrs||1,9);pro++;}
      else if(r===1&&!hasHead&&myrs(m)>=14&&ae>=55&&chance(.5)){m.r=2;m.acting=0;hasHead=true;pro++;}});});
    if(pro)out.push(`성과 승진 ${pro}명`);
    if(out2){try{actingFix(S.ros.per);}catch(e){}out.push(`편집국 인사 — 이직 ${out2}명(${[...new Set(dests)].slice(0,2).join('·')} 등)${inn?` · 경력 입사 ${inn}명(${[...new Set(fromC)].slice(0,2).join('·')} 출신 등)`:''}${out2-inn>0?` · 신입·경력 충원 ${out2-inn}명`:''}`);}}
  // 편집국 명부(내 부서 밖 간부·기자)도 60세가 되면 물러나고 신입이 들어온다
  if(S.ros&&S.ros.per&&!S.founder){let rn=0;const top=[];let CRs=[];try{CRs=corrs();}catch(e){}Object.keys(S.ros.per).forEach(d=>{const L=S.ros.per[d];for(let i=0;i<L.length;i++){const m=L[i];if(!m||(S.team||[]).includes(m)||(S.mates||[]).includes(m)||CRs.includes(m))continue;if(npcAge(m)>=60){const n=genMember(d,30,48);n.yrs=R(1,3);n.t0=S.turn;L[i]=n;rn++;if((m.r||0)>=2)top.push(`${m.name} ${MR[m.r]||'간부'}`);}}});if(rn){actingFix(S.ros.per);out.push(top.length?`편집국 정년퇴직 ${rn}명 (${top.slice(0,2).join(', ')} 등)`:`편집국 정년퇴직 ${rn}명`);}}
  if(!S.founder&&S.rank>=2&&S.rank<=5&&typeof teamSize==='function'){let k=0;while(S.team.length<teamSize()&&k++<3){const n=genMember(S.dept,30,46);n.yrs=R(1,2);n.t0=S.turn;S.team.push(n);S.co.staff++;out.push(`신입 ${n.name} 기자 배치`);}}
  if(!(S.rank>=6||S.founder)){const L=(S.team||[]).concat(S.mates||[]);L.forEach(m=>{const r=m.r||0;const need=[10,15,20][r];if(r<3&&need&&myrs(m)>=need&&m.skill>=45&&chance(.35)){const taken=L.some(x=>x!==m&&x.d===m.d&&(x.r||0)===r+1);if(!taken||r===0){m.r=r+1;if(m.role&&MR.includes(m.role))m.role=MR[m.r];out.push(`${m.name} ${MR[r]} → ${MR[m.r]} (${myrs(m)}년 차)`);}else{try{hqJam(m,L,out);}catch(e){}}}});}
  try{corrLife(out);}catch(e){console.error(e);}try{actingFix();}catch(e){}
  return out.length?`<p class="hint">우리 쪽 인사: ${out.slice(0,6).map(esc).join(' · ')}${out.length>6?` 외 ${out.length-6}건`:''}</p>`:'';}
// 경쟁사가 노리는 기자: 실력 좋은 5~12년 차
function poachPick(){const T=S.team||[];const w=T.map(m=>{const st=npcStage(m);return (st==='mid'?3:st==='jr'?1.2:st==='sr'?.8:.2)*(1+Math.max(0,m.skill-50)/25)*(m.name===S.protege?((m.rel??20)>=60?.08:.5):1);});let t=w.reduce((a,b)=>a+b,0)*Math.random();for(let i=0;i<T.length;i++){t-=w[i];if(t<=0)return T[i];}return T[0];}

// ===== 이직 조건: 장점·단점·보너스·조건 =====
function jobDeal(f){const o=f.o,cur=OUT();const star=(S.fame>=40||(S.awards||0)>=1||(S.bigScoops||0)>=1);const dp=o.p-cur.p;
  const payK=+(1+(star?R(8,18):R(0,8))/100*(dp<=0?1:.6)).toFixed(2);const np=Math.round(payOf(o,f.rank)/(S.payK||1)*payK/5)*5,cp=payOf(cur);const dPay=Math.round((np/cp-1)*100);
  const bonus=star&&dp<=0&&chance(.6)?Math.round(cp*R(2,4)/10)*10:0;const pros=[],cons=[];
  (dPay>=3?pros:dPay<=-3?cons:pros).push(`월급 ${np.toLocaleString('ko-KR')}만 원 (${dPay>=0?'+':''}${dPay}%)`);
  if(f.adj>0)pros.push(`직급 ${rankName()} → ${rankName(f.rank,f.o)}`);if(f.adj<0)cons.push(`직급 ${rankName()} → ${rankName(f.rank,f.o)}`);
  if(bonus)pros.push(`이적 보너스 ${bonus.toLocaleString('ko-KR')}만 원`);
  if(dp>0)pros.push('더 큰 간판 — 평판이 잘 오르고 취재망이 두텁다');if(dp<0)cons.push('간판이 작다 — 평판이 덜 오른다');
  const ok=orgK(o),ok0=orgK(cur);if(ok.ten<ok0.ten-.05)pros.push('승진이 더 빠르다');else if(ok.ten>ok0.ten+.05||ok.pick<.85)cons.push('승진 경쟁이 세다');
  if(o.lean!==cur.lean)cons.push(`논조가 다르다 (${LEAN[o.lean]})`);
  if(S.eval>58)cons.push('사내 평가가 55부터 다시 시작');else if(S.eval<52)pros.push('사내 평가를 새로 쌓을 기회');
  cons.push('출입처 장악도·동료 관계가 처음부터');if(S.protege)cons.push('제자와 헤어진다 (관계가 아주 좋으면 따라오고 싶어 한다)');
  if(f.capped)cons.push('연차가 모자라 직급 대우가 묶였다');
  const cond=['이직 뒤 1년은 다시 옮길 수 없다'];if(bonus)cond.push('2년 안에 나가면 보너스를 돌려준다');
  if(S.jobBind&&S.turn<S.jobBind.until)cons.push(`지금 회사 의무 근무 위반 — 보너스 ${S.jobBind.amt.toLocaleString('ko-KR')}만 원 반환`);
  const sum=[`월급 ${dPay>=0?'+':''}${dPay}%`,f.adj?`직급 ${f.adj>0?'▲':'▼'}`:'직급 그대로',bonus?`보너스 ${bonus.toLocaleString('ko-KR')}만`:'',pros.includes('승진이 더 빠르다')?'승진 빠름':cons.includes('승진 경쟁이 세다')?'승진 경쟁':''].filter(Boolean).join(' · ');
  return {payK,bonus,pros,cons,cond,sum};}
function dealHTML(d){return `<div class="deal"><div class="dp"><b>좋은 점</b><ul>${d.pros.map(x=>`<li>${esc(x)}</li>`).join('')||'<li>딱히 없다</li>'}</ul></div><div class="dc"><b>아쉬운 점</b><ul>${d.cons.map(x=>`<li>${esc(x)}</li>`).join('')}</ul></div></div><p class="hint">조건: ${d.cond.map(esc).join(' · ')}</p>`;}

// ===== 부서별 기관·기업·인물 (부서가 있을 때만 생긴다) =====
const DEPT_ENT={
 pol:[['nec','중앙선거관리위원회','gov',.005],['minor','정의로당','party',.003],['pr_whip','국회의장','person',0],['pr_poll','여론조사업체 대표','person',0],["nabudget", "국회 예산결산특별위원회", "gov", 0],["think1", "한빛정책연구원", "corp", 0.004],["think2", "새길미래연구소", "corp", 0.003],["pr_floor", "새길당 원내대표", "person", 0],["pr_gov2", "여당 최고위원", "person", 0],["pollco", "여론조사기관 리서치원", "corp", 0.004]],
 diplo:[['nis','국가정보원','gov',0],['jcs','합동참모본부','gov',0],['defco','한누리방산','corp',.03],['pr_nsa','국가안보실장','person',0],["dapa", "방위사업청", "gov", 0.008],["mpva", "국가보훈부", "gov", 0.006],["defco2", "가람에어로스페이스", "corp", 0.03],["defco3", "누리시스템", "corp", 0.02],["pr_army", "육군참모총장", "person", 0]],
 int:[['kotra','무역투자진흥공사','gov',.01],['c21','바다해운','corp',.02],['pr_corr','외신 특파원 클럽 회장','person',0],["koica", "국제협력단", "gov", 0.006],["kts", "관광공사", "gov", 0.012],["c24", "한누리무역", "corp", 0.02],["c25", "대양선사", "corp", 0.015],["pr_un", "국제기구 한국대표", "person", 0]],
 eco:[['kcci','대한상공회의소','corp',.02],['c13','누리배터리','corp',.05],['c22','가람플랫폼','corp',.04],['pr_union','금속노조 위원장','person',0],["mss", "중소벤처기업부", "gov", 0.012],["nts", "국세청", "gov", 0.006],["kepco", "전력공사", "gov", 0.02],["c26", "가람홈쇼핑", "corp", 0.04],["c27", "누리화장품", "corp", 0.035],["c28", "한결식품", "corp", 0.03],["c29", "미래패션", "corp", 0.03],["c30", "대성생활건강", "corp", 0.035],["c31", "한빛에너지", "corp", 0.03],["fran", "프랜차이즈협회", "corp", 0.01],["pr_cfo", "재계 2세 경영인", "person", 0]],
 ind:[['c12','한솔중공업','corp',.04],['c23','대성디스플레이','corp',.04],['motie','산업통상자원부','gov',.015],['pr_ceo2','중견기업 회장','person',0],["c32", "동방조선", "corp", 0.035],["c33", "가람철강", "corp", 0.03],["c34", "미르반도체", "corp", 0.05],["c35", "한솔모빌리티", "corp", 0.03],["kosmes", "중소기업진흥공단", "gov", 0.008],["pr_union2", "조선노조 지회장", "person", 0]],
 fin:[['kfb','은행연합회','corp',.02],['c14','한빛카드','corp',.04],['c15','누리저축은행','corp',.02],['pr_fsc','금융위원장','person',0],["c36", "가람생명", "corp", 0.035],["c37", "누리손해보험", "corp", 0.03],["c38", "대성캐피탈", "corp", 0.02],["c39", "미르페이", "corp", 0.03],["ksd", "예금보험공사", "gov", 0.006],["pr_bank", "시중은행장", "person", 0]],
 stock:[['c16','대성증권','corp',.04],['nps','국민연금공단','gov',.01],['pr_ant','개인투자자 모임 대표','person',0],["c40", "한빛투자증권", "corp", 0.035],["c41", "가람자산운용", "corp", 0.025],["coinx", "코인거래소 비트원", "corp", 0.03],["pr_fund", "행동주의 펀드 대표", "person", 0]],
 estate:[['lh','토지주택공사','gov',.02],['c17','가람건설','corp',.05],['realtor','공인중개사협회','corp',.01],['pr_dev','재건축 조합장','person',0],["c42", "대성건설", "corp", 0.04],["c43", "한솔주택", "corp", 0.03],["c44", "누리신탁", "corp", 0.02],["hug", "주택도시보증공사", "gov", 0.012],["pr_ceo3", "시행사 회장", "person", 0]],
 it:[['msit','과학기술정보통신부','gov',.015],['c18','미르AI','corp',.04],['c19','누리게임즈','corp',.03],['pr_ceo','유니콘 스타트업 대표','person',0],["c45", "누리클라우드", "corp", 0.03],["c46", "가람페이", "corp", 0.025],["c47", "미르모빌리티", "corp", 0.025],["c48", "한빛보안", "corp", 0.015],["kisa", "인터넷진흥원", "gov", 0.008],["pr_dev2", "천재 개발자", "person", 0]],
 soc:[['nhrc','국가인권위원회','gov',0],['ngo','시민단체 시민의눈','gov',0],['pr_vic','피해자 모임 대표','person',0],["mogef", "여성가족부", "gov", 0.008],["comwel", "근로복지공단", "gov", 0.008],["nhis", "건강보험공단", "gov", 0.015],["koroad", "도로교통공단", "gov", 0.008],["kcrc", "소비자원", "gov", 0.006],["c49", "누리택배", "corp", 0.02],["pr_lawyer", "인권 변호사", "person", 0]],
 court:[['moj','법무부','gov',.005],['ccourt','헌법재판소','gov',0],['kba','변호사협회','corp',.01],['pr_judge','법원행정처장','person',0],["cmlaw", "법무법인 가람", "corp", 0.015],["cmlaw2", "법무법인 누리", "corp", 0.012],["legalaid", "법률구조공단", "gov", 0.004],["pr_jlaw", "대형 로펌 대표", "person", 0]],
 case:[['fire','소방청','gov',.008],['nfs','국립과학수사연구원','gov',0],['pr_det','강력계 반장','person',0],["kcg", "해양경찰청", "gov", 0.008],["kcs", "관세청", "gov", 0.006],["sec2", "경비업체 가람시큐리티", "corp", 0.01],["pr_prof", "범죄심리학자", "person", 0]],
 inv:[['bai','감사원','gov',0],['acrc','국민권익위원회','gov',.005],['pr_whistle','공익신고자 모임','person',0],["nec2", "국회 국정감사 상황실", "gov", 0],["opengov", "정보공개센터", "gov", 0],["pr_ex", "전직 국정원 요원", "person", 0]],
 med:[['kma','의사협회','corp',.02],['kdca','질병관리청','gov',.01],['hosp2','가람병원','corp',.02],['pr_doc','전공의 대표','person',0],["hira", "건강보험심사평가원", "gov", 0.01],["mfds", "식품의약품안전처", "gov", 0.01],["hosp3", "한빛의료원", "corp", 0.025],["pharma2", "누리바이오", "corp", 0.03],["pharma3", "대성약품", "corp", 0.025],["pr_nurse", "간호협회장", "person", 0]],
 edu:[['kice','교육과정평가원','gov',0],['acad2','대형 입시학원','corp',.04],['pr_supt','교육감','person',0],["univ1", "한빛대학교", "corp", 0.015],["univ2", "가람대학교", "corp", 0.012],["edtech", "에듀테크 공부원", "corp", 0.02],["acad3", "인강 플랫폼 누리스터디", "corp", 0.02],["pr_pres", "국립대 총장", "person", 0]],
 cul:[['kocca','콘텐츠진흥원','gov',.01],['museum','국립박물관','gov',.005],['gallery','가람갤러리','corp',.01],['pr_poet','원로 작가','person',0],["arts", "예술위원회", "gov", 0.008],["theater", "국립극장", "gov", 0.005],["c50", "누리엔터테인먼트", "corp", 0.025],["book", "대형 서점 문고원", "corp", 0.015],["webtoon", "웹툰 플랫폼 툰원", "corp", 0.02],["pr_curator", "미술관장", "person", 0]],
 ent:[['c20','누리미디어','corp',.03],['ticket','예매 플랫폼 티켓원','corp',.015],['pr_fan','팬덤 연합 대표','person',0],["ag4", "블랙웨이브엔터", "corp", 0.015],["ag5", "유니버스레이블", "corp", 0.012],["c51", "가람스튜디오", "corp", 0.02],["ott2", "OTT 무비원", "corp", 0.02],["pr_actor", "국민 배우", "person", 0],["pr_idol", "월드 투어 아이돌", "person", 0]],
 spo:[['kbl','프로농구연맹','gov',.01],['kovo','배구연맹','gov',.01],['kada','도핑방지위원회','gov',0],['pr_agent','선수 에이전트','person',0],["c52", "미르스포츠", "corp", 0.02],["c53", "가람골프", "corp", 0.015],["sbet", "체육진흥공단", "gov", 0.012],["esport", "e스포츠협회", "gov", 0.006],["pr_star2", "올림픽 금메달리스트", "person", 0]],
 base:[['team3','한솔 베어스','corp',.03],['pr_umpire','심판위원장','person',0],["team5", "동해 마린스", "corp", 0.025],["team6", "서남 피닉스", "corp", 0.02],["pr_kboc", "KBO 총재", "person", 0]],
 foot:[['team4','남부 유나이티드','corp',.02],['pr_fagent','축구 에이전트','person',0],["team7", "경인 유나이티드", "corp", 0.02],["team8", "중원 시티즌", "corp", 0.015],["pr_kleague", "프로축구연맹 총재", "person", 0]],
 nat:[['mois','행정안전부','gov',.02],['pr_gov','도지사','person',0],["mafra", "농림축산식품부", "gov", 0.012],["mof", "해양수산부", "gov", 0.01],["nacf", "농협중앙회", "corp", 0.03],["forest", "산림청", "gov", 0.006],["pr_farm", "농민회 대표", "person", 0]],city:[['lgov','기초 지자체 협의회','gov',.01],['pr_chief','구청장','person',0],["lgov2", "광역 도시공사", "gov", 0.012],["subway", "도시철도공사", "gov", 0.01],["lbus", "시내버스 조합", "corp", 0.008],["pr_council", "시의회 의장", "person", 0]],sigun:[['pr_gun','군수','person',0],['coop','지역 농협','corp',.01],["suhyup", "지역 수협", "corp", 0.008],["lfest", "지역 축제 추진위", "gov", 0.004],["pr_vil", "이장단 협의회장", "person", 0]]
};
const DEPT_ENT_INFO={nec:['선거 관리·감시','신중함'],minor:['소수 정당','개방적'],pr_whip:['국회 의사 일정의 열쇠','신중함'],pr_poll:['여론조사 업계 거물','개방적'],nis:['정보기관','매우 폐쇄적'],jcs:['군 작전 지휘','매우 폐쇄적'],defco:['방산 기업','광고 많음'],pr_nsa:['안보 컨트롤타워','폐쇄적'],kotra:['수출·투자 지원 기관','개방적'],c21:['해운사','광고 적음'],pr_corr:['외신 기자들의 대표','개방적'],kcci:['재계 단체','광고 많음'],c13:['2차전지 기업','광고 많음'],c22:['플랫폼 기업','광고로 압박'],pr_union:['노동계 대표','개방적'],c12:['조선·중공업','광고 많음'],c23:['디스플레이 기업','광고 많음'],motie:['산업 정책 부처','신중함'],pr_ceo2:['중견기업 오너','소송을 즐긴다'],kfb:['은행권 단체','광고 많음'],c14:['카드사','광고 많음'],c15:['저축은행','광고 적음'],pr_fsc:['금융 정책 수장','신중함'],c16:['증권사','광고 많음'],nps:['연기금 큰손','신중함'],pr_ant:['개미 투자자 목소리','개방적'],lh:['공공 주택 공기업','폐쇄적'],c17:['주택 건설사','광고로 압박'],realtor:['중개업계 단체','개방적'],pr_dev:['재건축 조합의 실세','소송을 즐긴다'],msit:['과학·통신 정책 부처','신중함'],c18:['AI 기업','광고 많음'],c19:['게임사','광고 많음'],pr_ceo:['스타트업 스타 대표','개방적'],nhrc:['인권 감시 기관','개방적'],ngo:['시민단체','개방적'],pr_vic:['사건 피해자 모임','개방적'],moj:['법무 행정','폐쇄적'],ccourt:['헌법 판단 기관','매우 폐쇄적'],kba:['변호사 단체','소송을 즐긴다'],pr_judge:['사법 행정 책임자','폐쇄적'],fire:['소방·구조','개방적'],nfs:['과학수사 기관','폐쇄적'],pr_det:['사건 현장의 터줏대감','신중함'],bai:['감사 기관','폐쇄적'],acrc:['부패 신고 기관','개방적'],pr_whistle:['내부고발자 연대','개방적'],kma:['의사 단체','소송을 즐긴다'],kdca:['감염병 대응 기관','신중함'],hosp2:['대형 병원','광고 많음'],pr_doc:['젊은 의사 대표','개방적'],kice:['수능 출제 기관','매우 폐쇄적'],acad2:['입시 학원 그룹','광고로 압박'],pr_supt:['교육 수장','신중함'],kocca:['콘텐츠 지원 기관','개방적'],museum:['국립 박물관','신중함'],gallery:['대형 화랑','광고 적음'],pr_poet:['문단 원로','폐쇄적'],c20:['미디어 그룹','광고 많음'],ticket:['예매 플랫폼','광고 많음'],pr_fan:['팬덤의 목소리','개방적'],kbl:['농구 리그','신중함'],kovo:['배구 리그','신중함'],kada:['도핑 검사 기관','폐쇄적'],pr_agent:['선수 이적의 열쇠','개방적'],team3:['프로야구단','광고 적음'],pr_umpire:['심판 판정 책임자','폐쇄적'],team4:['프로축구단','광고 적음'],pr_fagent:['축구 이적 중개인','개방적'],mois:['지방행정 부처','신중함'],pr_gov:['광역 단체장','소송을 즐긴다'],lgov:['기초 지자체 연합','개방적'],pr_chief:['구청장','신중함'],pr_gun:['군수','소송을 즐긴다'],coop:['지역 농협','광고 적음']};
Object.assign(ENT_INFO,DEPT_ENT_INFO);
ENT_KEY.push(['선관위','nec'],['선거','nec'],['국정원','nis'],['합참','jcs'],['방산','defco'],['배터리','c13'],['플랫폼','c22'],['조선','c12'],['카드','c14'],['저축은행','c15'],['연금','nps'],['공매도','c16'],['재건축','pr_dev'],['임대주택','lh'],['AI','c18'],['게임','c19'],['인권','nhrc'],['헌재','ccourt'],['헌법','ccourt'],['변호사','kba'],['화재','fire'],['감사원','bai'],['권익위','acrc'],['의사','kma'],['감염','kdca'],['수능','kice'],['학원','acad2'],['박물관','museum'],['전시','gallery'],['티켓','ticket'],['암표','ticket'],['팬덤','pr_fan'],['농구','kbl'],['배구','kovo'],['도핑','kada'],['심판','pr_umpire'],['에이전트','pr_agent'],['군수','pr_gun'],['농협','coop']);
function deptEntsFor(o){const out=[];o.depts.forEach(d=>(DEPT_ENT[d]||[]).forEach(e=>out.push([e[0],e[1],e[2],cat1(d),e[3]])));return out;}
// 이미 진행 중인 저장 파일에도 부서별 대상을 채운다
function ensureDeptEnts(){if(!S||!S.outlet||!S.net||S._entV===S.outlet+':5')return;S._entV=S.outlet+':5';const add=deptEntsFor(OUT()).filter(e=>!ENT[e[0]]);if(!add.length)return;ENTS.push(...add);try{normEnts(ENTS,OUT());}catch(e){}S.ents=ENTS;setEnts(ENTS);add.forEach(e=>{if(!S.net[e[0]])S.net[e[0]]={rel:R(0,10),cut:0,block:0,who:e[2]==='person'?rname():null,known:e[2]==='gov'};});}
// 편법 방지: 새로 생긴 부서의 광고주는 1년에 걸쳐 천천히 광고가 붙는다 (부서만 만들어 광고를 뽑아 먹는 걸 막는다)
function entRamp(id){const e=S.net&&S.net[id];if(!e||e.fresh==null)return 1;return clamp((S.turn-e.fresh)/YW,.1,1);}
function maxDepts(){const c=S.co;return clamp(Math.round((c?c.staff:20)/7),3,16);}

// ===== 기관·기업 광고 집행 주기: 매달 · 2개월 · 분기 · 반기 · 연 1회 =====
// 한 해 동안 받는 총액은 같다(주기만큼 몰아서 들어온다). 관계·광고 중단·신설 부서 여부가 그때그때 금액을 바꾼다.
const AD_CAD={1:'매달',2:'2개월마다',3:'분기마다',6:'반년마다',12:'1년에 한 번'};
function hashId(id,k){let h=k||7;for(const ch of String(id))h=(h*31+ch.charCodeAt(0))>>>0;return h;}
// 집행 주기: 금액은 주기만큼 묶어서 나가므로(주기×월 몫) 연간 총액은 같다. 작은 매체·창간 매체는 소액을 자주 받는 곳이 많고, 관공서도 매달·격월 소액 집행이 섞인다
function entCad(id){const E=ENT[id];if(!E||!E.w)return 0;const h=hashId(id);const o=(S&&S.outlet&&OUT())||{p:3};const sm=o.p<=3||!!o.custom||!!o.npc;
  if(E.kind==='party')return [12,12,6][h%3];
  if(E.kind==='gov')return sm?[1,2,3,6,1,12,3,2][h%8]:[3,6,12,1,6,2,12,3][h%8];
  if(E.w>=.04)return [1,1,3,2][h%4];
  return sm?[1,2,1,3,2,6,1,12][h%8]:[2,3,6,1,3,12,1,2][h%8];}
// 집행할 때마다 금액이 조금씩 다르다: ±15% 흔들림 · 계절(관공서는 연말 예산 소진, 기업은 가정의 달·명절·연말) · 가끔 캠페인 증액이나 예산 축소. 평균은 1
function adVar(id,t){t=t??S.turn;const E=ENT[id]||{};const mi=Math.floor(t/4);const h=hashId(id+'#'+mi,31);let k=(E.kind==='gov'?.85:.82)+(h%1000)/1000*.3;const mo=month(t);
  k*=E.kind==='gov'?({1:.8,2:.85,3:.95,11:1.2,12:1.3}[mo]||1):({1:.85,2:.85,5:1.1,7:.95,8:.95,9:1.12,12:1.2}[mo]||1);
  const ev=(h>>>11)%100;const tag=ev<6?(E.kind==='gov'?'정책 홍보 캠페인':E.kind==='party'?'정당 홍보':'신제품 캠페인'):ev<10?'예산 축소':E.kind==='gov'&&mo>=11&&ev<25?'연말 예산 집행':E.kind!=='gov'&&(mo===9||mo===12)&&ev<22?(mo===9?'명절 특수':'연말 특수'):'';if(ev<6)k*=1.45;else if(ev<10)k*=.7;return[k,tag];}
function entDue(id,t){const p=entCad(id);if(!p)return false;const m=Math.floor((t??S.turn)/4);return (m+hashId(id,13)%p)%p===0;}
function entAdK(id){const e=S.net&&S.net[id];if(!e)return 1;if(e.cut>0)return 0;return (e.rel<=-50?.6:e.rel>=60?1.35:1)*(.4+.6*entRamp(id))*(e.boost&&e.boostT>S.turn?e.boost:1);}
function entNextTxt(id){const p=entCad(id);if(!p)return '';for(let k=0;k<12;k++){if(entDue(id,S.turn+k*4))return k===0?'이번 달':`${k}개월 뒤`;}return '';}
// 이번 달 광고: 이름 없는 광고(중소 광고주·지역 상인·온라인 광고망)는 매달, 기관·기업 광고는 주기대로
function adNk(){const named=ENTS.reduce((a,e)=>a+(e[4]||0),0);return named>0?clamp(.55/named,.5,1.6):1;}
function adShareOf(id){const E=ENT[id];return E&&E.w?E.w*adNk():0;}
function adMonth(o,F){const named=ENTS.reduce((a,e)=>a+(e[4]||0),0);const nk=adNk();const base=o.ad*F*(1-named*nk)*(1+(econ()-1)*.6);let pay=0;const L=[];
  ENTS.forEach(e=>{const w=e[4]*nk;if(!w)return;const id=e[0];if(!entDue(id))return;const p=entCad(id);const v=adVar(id);const a=o.ad*F*w*p*entAdK(id)*v[0]*entB(id);if(a<=0)return;pay+=a;L.push([e[1],a,p,v[1]]);});
  L.sort((a,b)=>b[1]-a[1]);return {base,pay,list:L.slice(0,6),n:L.length};}

// ===== 광고주 눈치: 큰 광고주를 비판하는 기사를 쓰려 하면 데스크(또는 광고국)가 압박한다 =====
const jo=(w,a,b)=>{const c=String(w).slice(-1).charCodeAt(0);return w+((c>=44032&&c<=55203&&(c-44032)%28)?a:b);};
const CRIT_RE=/의혹|비리|부실|갑질|유출|담합|특혜|횡령|논란|피해|사고|불법|은폐|착취|리콜|결함|하자|과징금|적발|폭리|꼼수|편법|산재|위반|누락|사적|막말|대출|부당|비위|독점|로비|떠넘|외면|방치/;
function adGate(it,go){const id=it.ent,E=ENT[id],e=S.net&&S.net[id];const sh=adShareOf(id);if(typeof oidOf==='function'&&oidOf()==='truth'&&chance(.6))return go({});
  const ecoK=(!S.founder&&S.rank<=3&&DEPT_SIG_OF[S.dept]==='eco')?.5:1;const thr=(S.simple?.03:(S.founder||OUT().p<=2)?.025:.012)*ecoK/(typeof facK==='function'?facK().ad:1)*(typeof oidOf==='function'&&E&&((oidOf()==='corp'&&E.kind==='corp')||(oidOf()==='gov'&&E.kind==='gov'))?.5:1);if(S.story||!E||!e||!sh||!(E.kind==='corp'||E.kind==='gov')||e.cut>0||!CRIT_RE.test(it.title)||sh<thr||S.turn-(e.gateT??-99)<24*ecoK||S.turn-(S.gateT??-99)<6*ecoK)return go({});e.gateT=S.turn;S.gateT=S.turn;
  const me=S.founder||S.rank>=6;const yr=OUT().ad*sh*12;const bs=colBy('boss');const who=me?'광고국장':S.rank<=2?`${bs?bs.name+' ':''}부장`:S.rank===3?`${bs?bs.name+' ':''}부국장`:'사장';
  const heavy=sh>=.025;const line=me?`"대표님, ${jo(E.n,'은','는')} 우리 광고의 ${(sh*100).toFixed(1)}%입니다. 이번 분기 매출이 흔들릴 수 있어요."`:S.rank<=3?`"${jo(E.n,'은','는')} 우리 큰 광고주야. 사실만 딱 쓰고 표현은 좀 누그러뜨리자. 광고국에서 벌써 전화 왔어."`:`"${E.n} 건, 광고국이 걱정이 많아. 편집국이 알아서 판단하되 회사 사정도 생각해 줘."`;
  S.adGateN=(S.adGateN||0)+1;
  if(!me&&S.rank<=1&&!S.founder&&chance(clamp((.3+sh*8)*(typeof facK==='function'?facK().ad:1),.3,.75)))return bossCall(it,E,id,sh,heavy,go,bs);
  openModal('광고주 눈치',`<p class="lede">「${esc(it.title)}」${jp(esc(it.title),'은','는')} <b>${esc(E.n)}</b> 이야기다. ${esc(jo(E.n,'은','는'))} 우리 광고의 <b>${(sh*100).toFixed(1)}%</b>(연 ${adAmt(yr)})를 내는 광고주다.</p><p>${esc(who)}: ${esc(line)}</p><p class="hint">톤을 낮추면 광고는 지키지만 기사 파급력이 줄고, 쌓이면 신뢰가 깎인다. 그대로 쓰면 광고가 끊길 수 있다.</p>`,[
    {label:'표현을 누그러뜨린다',sub:`파급력 약 30%↓ · ${esc(E.n)} 반발 크게 줄어듦 · 신뢰 조금↓${me?'':' · 데스크 관계↑'}`,fn:()=>{S.adSoftN=(S.adSoftN||0)+1;apply({trust:-.5-(S.adSoftN>=4?.5:0)});if(!me&&bs)relUp(bs,2,'광고주 배려');if(S.adSoftN===4)toast('"요즘 그 매체, 광고주 기사는 순하더라" — 업계에 말이 돈다');go({adTone:'soft'});return false;}},
    {label:'그대로 쓴다',rec:!heavy,sub:`신뢰↑ · ${esc(E.n)} 광고 중단 위험${heavy?' (큰손이라 회사 매출 타격이 크다)':''}${me?'':' · 데스크 관계↓'}`,fn:()=>{apply({trust:.6});if(!me&&bs)relUp(bs,-3,'광고주 기사 강행');S.resist=(S.resist||0)+1;go({adTone:'hard'});return false;}},
    {label:'이번엔 기사를 접는다',risk:true,sub:`광고 지킴 · 아이템을 버린다 · 신뢰↓ · 들키면 더 크게`,fn:()=>{S.items=S.items.filter(x=>x!==it);valN('ind',-6,'광고주를 의식해 기사를 접었다');netUp(id,5);apply({trust:-1.5});log(`${E.n} 광고를 의식해 「${it.title}」 기사를 접었다`);if(chance(.15*(DF().risk||1)))S.pending.push({type:'ethic',why:`${E.n} 광고를 의식해 기사를 접었다는 의혹`,title:it.title,due:S.turn+R(8,24)});toast('기사를 접었다');}},
    {label:'← 다른 아이템',cls:'ghost',fn:()=>{RUN.write();return false;}}]);}
// ===== 비판 보도 뒤 광고주·기관과의 줄다리기 =====
// 기사가 나가면 처음엔 관계가 틀어진다. 몇 달 뒤 ① 광고로 후속 보도를 무마하려 하거나 ② 화해하고 광고를 늘리거나 ③ 보복(광고 장기 중단·협찬 철회·자료 거부·소송)한다.
function arcStart(id,d,head){const E=ENT[id];if(!E||!(E.kind==='corp'||E.kind==='gov'&&E.w>0)||d<4)return;S.arc=S.arc||{};if(S.arc[id]){S.arc[id].d+=d*.5;return;}S.arc[id]={t:S.turn,d,head:head||''};}
function arcTick(Qx){if(!S.arc)return;const D=DF();for(const id in S.arc){const a=S.arc[id];const e=S.net&&S.net[id],E=ENT[id];if(!e||!E){delete S.arc[id];continue;}const age=S.turn-a.t;if(age<6)continue;if(age>60){delete S.arc[id];continue;}if(!chance(S.simple?.18:.3))continue;
  const tr=entTrait(id);const fol=(S.items||[]).find(i=>i.ent===id);const w=arcW(E,tr,e,a,age,fol);
  w.hit*=D===DIFF.hard?1.4:D===DIFF.easy?.7:1;w.make*=D===DIFF.easy?1.3:1;if(E.kind==='gov')w.pay*=.4;
  let t=(w.pay+w.make+w.hit)*Math.random();const k=(t-=w.pay)<0?'pay':(t-=w.make)<0?'make':'hit';delete S.arc[id];Qx.push(()=>arcEvent(id,k,fol,a));return;}}
// 보도 후 반응 가중치: 무마·화해·보복이 대체로 3분의 1씩. 성향·관계·보도 강도·후속 여부로 기운다
function arcW(E,tr,e,a,age,fol){return {pay:1.1+(e.payer?1.5:0)+(fol?1.8:0)+(tr.press?.9:0)+(E.kind==='corp'?.7:0),make:.65+(tr.open?.8:0)+(e.rel>-15?.45:0)+(age>24?.35:0)+(a.d<8?.3:0),hit:.95+(tr.press?.7:0)+(tr.lit?.9:0)+(a.d>12?.8:0)+(e.rel<-40?.5:0)};}
function arcAmt(id,mul){const o=OUT();return +Math.max(.005,o.ad*(ENT[id].w||.01)*mul*(S.adRate||1)).toFixed(3);}
function arcRes(t,txt,fx){openModal(t,`<p class="lede">${txt}</p>${fx?fxLine(fx):''}`,[{label:'확인'}]);}
function arcEvent(id,k,fol,a){const E=ENT[id],e=S.net&&S.net[id];if(!E||!e){closeModal();return;}const nm=entName(id);const me=S.founder||S.rank>=4;const via=me?'':'광고국장이 데스크를 통해 전해 왔다. ';const head=a.head?`「${esc(a.head)}」 이후 `:'';const tr=entTrait(id);const corp=E.kind==='corp';
  const nt=(S.st&&S.st.net)||40,ver=(S.st&&S.st.ver)||40;
  if(k==='pay'){const amt=arcAmt(id,R(6,12));const again=e.payer?`<p class="hint">${jo2(esc(E.n),'은','는')} 전에도 광고로 기사를 막은 적이 있다. 이번엔 더 대놓고 나왔다.</p>`:'';
    openModal('광고로 무마 제안',`<p class="lede">${head}${via}${esc(nm)} 쪽에서 "올해 광고를 ${adAmt(amt)} 더 집행하겠다"고 한다. ${fol?`조건은 후속 「${esc(fol.title)}」${jp(esc(fol.title),'을','를')} 접어 달라는 것.`:'조건은 "앞으로 잘 부탁한다"는 것.'}</p>${again}<p class="hint">돈은 되지만 들키면 신뢰가 크게 다친다. 어떻게 받느냐에 따라 결과가 달라진다.</p>`,[
    {label:fol?'받고 후속을 접는다':'광고를 받는다',risk:true,sub:`회사 자금 +${adAmt(amt)} · 관계 크게↑ · 들킬 수 있다`,fn:()=>{S.co.cash+=amt;e.cut=0;netUp(id,25);if(fol)S.items=S.items.filter(x=>x!==fol);log(`${E.n} 광고 ${adAmt(amt)} — 후속 보도 무마`);const r=Math.random(),rk=(DF().risk||1)*(e.payer?1.5:1);
      if(r<.22*rk){S.pending.push({type:'err',title:`${E.n} 광고 받고 기사 뺀 의혹`,due:S.turn+R(6,20)});arcRes('찜찜한 거래',`광고는 들어왔다. 그런데 편집국 누군가 그날 회의 내용을 메모해 두었다는 말이 돈다.`,apply({trust:-2}));}
      else if(r<.55){e.payer=1;e.boost=1.15;e.boostT=S.turn+YW;arcRes('맛을 들인 광고주',`${jo2(esc(E.n),'은','는')} 1년 내내 광고를 늘려 줬다. 대신 "이 정도면 우리 편"이라고 여기는 눈치다. 다음 기사 때도 같은 제안이 올 것이다.`,apply({trust:-1.5,eval:me?0:.5}));}
      else arcRes('조용한 거래',`광고는 들어왔고, 아무도 묻지 않았다. 아직은.`,apply({trust:-1,eval:me?.3:.6}));return false;}},
    {label:'광고는 받되 기사는 쓴다',sub:'반반 — 상대 반응에 달렸다',fn:()=>{const r=Math.random();
      if(r<.2+(tr.open?.2:0)){S.co.cash+=amt;netUp(id,10);arcRes('의외의 수긍',`${esc(E.n)} 홍보실이 "기사 내용은 겸허히 받아들이겠다"며 광고를 그대로 집행했다. 업계에선 "${esc(OUT().n)} 기사는 광고로 못 막는다"는 말이 돌았다.`,apply({trust:1,fame:.5}));}
      else if(r<.65){S.co.cash+=amt*.5;netUp(id,3);arcRes('절반의 집행',`광고는 절반만 들어왔다. "${fol?'후속은 좀 순하게…':'다음엔 잘 부탁합니다.'}" 미묘한 신호가 남았다.`,`회사 자금 +${adAmt(amt*.5)}`);}
      else{netUp(id,-10);e.cut=Math.max(e.cut||0,8);arcRes('없던 일로',`"그럼 없던 일로 하죠." 광고가 다시 끊겼다.`,apply({trust:.4}));}return false;}},
    {label:'거절한다',rec:true,sub:'신뢰↑ · 광고 중단이 길어질 수 있다',fn:()=>{netUp(id,-5);const r=Math.random();
      if(r<.25){arcRes('소문난 거절',`거절했다는 얘기가 업계에 퍼졌다. 기자협회보에 짧게 실렸다.`,apply({trust:1.5,fame:1}));}
      else if(r<.4&&corp){e.cut=(e.cut||0)+14;arcRes('경쟁지로 간 광고',`${jo2(esc(E.n),'은','는')} 광고 예산을 경쟁지로 몽땅 돌렸다. 광고 중단이 길어진다.`,apply({trust:1}));}
      else{if(corp)e.cut=(e.cut||0)+8;arcRes('거절',`정중히 거절했다. 상대는 아무 말 없이 전화를 끊었다.`,apply({trust:.8}));}return false;}},
    {label:'제안 사실을 보도한다',risk:true,sub:`대박 아니면 소송 · 검증 능력이 중요하다`,fn:()=>{netUp(id,-25);if(corp)e.cut=(e.cut||0)+16;
      if(chance(.35+ver/220)){const it=makeItem(cat1(S.dept),{excl:true,mult:1.2,keyConf:true});it.ent=id;it.title=`[단독] ${E.n}, 광고 미끼로 비판 기사 무마 시도`;it.subj=E.n;it.base='bribe_'+id;S.items.push(it);arcRes('미끼를 문 쪽은',`통화 녹취와 광고 제안서가 남아 있었다. 「${esc(it.title)}」 아이템을 잡았다.`,apply({trust:2.5,fame:2}));}
      else{S.pending.push({type:'suit',ent:id,due:S.turn+R(2,5),title:a.head||E.n});arcRes('증거 부족',`"그런 제안을 한 적이 없다." ${jo2(esc(E.n),'이','가')} 명예훼손 소송을 예고했다. 녹취가 없었다.`,apply({trust:.5,eval:-1}));}return false;}}]);return;}
  if(k==='make'){const up=+(1.15+Math.random()*.2).toFixed(2);openModal('화해의 손짓',`<p class="lede">${head}${esc(nm)} 홍보 책임자가 점심을 청했다. "그때는 저희도 서운했습니다. 이제 좋게 가시죠."</p><p class="hint">화해 방식에 따라 광고·관계·뒷말이 달라진다.</p>`,[
    {label:'화해한다',sub:`광고 재개 · 1년간 광고↑ · 관계↑`,fn:()=>{e.cut=0;e.block=0;netUp(id,20);e.boost=up;e.boostT=S.turn+YW;log(`${jo2(E.n,'과','와')} 화해 — 광고 증액`);const r=Math.random();
      if(r<.2){e.boost=+(up+.1).toFixed(2);arcRes('조건부 화해',`화해 조건으로 "보도자료는 꼭 실어 달라"는 부탁이 따라붙었다. 광고는 더 늘었다.`,apply({trust:-.6}));}
      else if(r<.3&&me){arcRes('뒷말',`"${esc(OUT().n)} 간부가 ${jo2(esc(E.n),'과','와')} 밥 먹고 논조가 바뀌었다"는 글이 미디어 비평 커뮤니티에 올라왔다.`,apply({trust:-1.2}));}
      else arcRes('화해',`${jo2(esc(E.n),'과','와')} 화해했다. 광고가 다시 붙고, 한동안 예전보다 많이 들어온다.`,`광고 ×${up} · 1년`);return false;}},
    {label:'"광고와 편집은 별개"라고 못 박는다',sub:'원칙 · 상대가 받아들이면 최선',fn:()=>{if(tr.open||chance(.45)){e.cut=0;e.block=0;netUp(id,12);e.boost=+(1+(up-1)*.6).toFixed(2);e.boostT=S.turn+YW;arcRes('선을 지킨 화해',`홍보 책임자가 웃었다. "그게 맞죠." 광고는 다시 들어오고, 기사에 대한 간섭은 없기로 했다.`,apply({trust:1}));}
      else{netUp(id,-4);arcRes('어색한 식사',`"그럼 저희도 생각해 보겠습니다." 분위기가 싸늘하게 식었다.`,apply({trust:.4}));}return false;}},
    {label:'밥만 먹고 거리를 둔다',sub:'관계 조금↑ · 뜻밖의 수확이 있을 수도',fn:()=>{netUp(id,8);if(chance(.25+nt/300)){const it=makeItem(cat1(S.dept),{excl:true});S.items.push(it);arcRes('밥값',`식사 끝에 상대가 흘리듯 말했다. "경쟁사 얘기 하나 해 드릴까요?" → 「${esc(it.title)}」`,'');}else arcRes('적당한 거리',`적당한 거리를 두기로 했다.`,'관계 조금↑');return false;}},
    {label:'만나지 않는다',sub:'신뢰 조금↑ · 관계는 식는다',fn:()=>{const t=apply({trust:.3});if(chance(.35)){netUp(id,-6);arcRes('닫힌 문',`거절 소식을 들은 ${esc(E.n)} 쪽이 "괘씸하다"고 했단다.`,t);}else arcRes('거절',`만나지 않았다. 아무 일도 없었다.`,t);return false;}}]);return;}
  const kind=E.kind==='gov'?pick(['자료 거부','정부광고 배정 축소','출입 제한']):pick(['광고 장기 중단','행사 협찬 철회','계열사 광고 동반 중단','법적 대응 예고']);
  openModal('보복',`<p class="lede">${head}${jo2(esc(nm),'이','가')} ${kind}에 나섰다.</p><p class="hint">맞서는 방식에 따라 독자 반응·손실·관계가 달라진다.</p>`,[
    {label:'버틴다',sub:'신뢰↑ · 손실은 감수',fn:()=>{if(corp)e.cut=(e.cut||0)+12;else e.block=(e.block||0)+6;if(kind==='법적 대응 예고'&&chance(.4))S.pending.push({type:'suit',ent:id,due:S.turn+R(2,5),title:a.head||E.n});if(kind==='행사 협찬 철회')S.co.cash-=arcAmt(id,2);const r=Math.random();
      if(r<.3){if(S.co&&S.co.subs)S.co.subs*=1.03;arcRes('독자가 붙었다',`"광고 끊겨도 버티는 언론"이라며 구독·후원 문의가 늘었다.`,apply({trust:1.5,fame:1}));}
      else if(r<.45){e.cut=Math.max(0,(e.cut||0)-8);e.block=0;netUp(id,6);arcRes('먼저 숙인 쪽',`석 달도 안 돼 ${jo2(esc(E.n),'이','가')} 먼저 연락해 왔다. "저희가 과했습니다."`,apply({trust:1}));}
      else arcRes('버티기',`버티기로 했다. 당분간은 손해를 감수해야 한다.`,apply({trust:.8}));return false;}},
    {label:'찾아가 오해를 푼다',sub:'관계↑ · 신뢰 조금↓ · 성공은 장담 못 한다',fn:()=>{const r=Math.random()-(nt-40)/300;
      if(r<.55){netUp(id,12);e.cut=Math.max(0,(e.cut||0)-6);e.block=0;arcRes('풀린 오해',`길게 이야기했다. 보복은 거둬들이기로 했다.`,apply({trust:-.6}));}
      else if(r<.8){netUp(id,15);e.cut=0;e.block=0;arcRes('사과문의 대가',`상대는 "유감 표명"을 조건으로 걸었다. 지면 구석에 짧은 글이 실렸고, 보복은 끝났다.`,apply({trust:-1.8,eval:-.5}));}
      else{netUp(id,-3);arcRes('문전박대',`로비에서 한 시간을 기다리다 돌아왔다.`,apply({men:-1}));}return false;}},
    {label:'추가 보도로 맞선다',sub:'단독 후속 아이템 · 관계 더 나빠짐 · 소송 위험',fn:()=>{const it=makeItem(cat1(S.dept),{excl:true,mult:1.1});it.ent=id;const kd=pick(['내부 문건 입수','하청 갑질 정황','공시 누락 의혹','보복성 광고 중단 내막']);it.title=`[후속] ${E.n}, ${kd}`;it.subj=E.n;it.base='retal_'+id;it.facts=parseFacts(`d:*${E.n} ${kd==='공시 누락 의혹'?'미공시 계약 자료':'내부 문건'}|w:전직 직원 "${kd==='하청 갑질 정황'?'협력사에 떠넘겼다':'윗선 지시였다'}"|n:관련 금액 {m}억 원|s:${E.n} 본사 현장`,filler(vars()));S.items.push(it);netUp(id,-10);
      if(chance(tr.lit?.45:.2)){S.pending.push({type:'suit',ent:id,due:S.turn+R(3,6),title:it.title});arcRes('맞불',`후속 아이템을 잡았다. ${jo2(esc(E.n),'은','는')} 소송 준비에 들어갔다는 소문이다. → 「${esc(it.title)}」`,'');}
      else arcRes('맞불',`후속 아이템을 잡았다. → 「${esc(it.title)}」`,'');return false;}},
    ...(corp?[{label:'다른 광고주로 빈자리를 메운다',sub:'영업력·인맥이 좋을수록 잘 메운다',fn:()=>{const k=clamp(.3+nt/150+(S.styT==='net'?.2:0),.3,1);const g=arcAmt(id,R(3,6))*k;S.co.cash+=g;if(chance(k)){arcRes('메운 빈자리',`발품을 팔아 새 광고주를 데려왔다. 빈자리를 대부분 메웠다.`,`회사 자금 +${adAmt(g)}`);}else arcRes('반쯤 메운 자리',`몇 곳은 붙었지만 큰손의 빈자리는 컸다.`,`회사 자금 +${adAmt(g)}`);e.cut=(e.cut||0)+10;return false;}}]:[])]);}

// ===== 관계망 · 사내 관계 화면 =====
function relPill(r,lo=-100,hi=100,good=40,bad=-25){const c=r>=good?'var(--good)':r<=bad?'var(--red)':'var(--siren)';return `<span class="rpill" style="--c:${c}"><i style="width:${clamp((r-lo)/(hi-lo)*100,2,100)}%"></i><b>${Math.round(r)}</b></span>`;}
function relBands(L,get,cuts){const n=[0,0,0,0,0];L.forEach(x=>{const r=get(x);n[r>=cuts[0]?0:r>=cuts[1]?1:r>=cuts[2]?2:r>=cuts[3]?3:4]++;});const t=L.length||1;const col=['var(--good)','#9be36b','var(--siren)','#ffb84d','var(--red)'];const nm=['든든','가까움','무난','서먹','껄끄러움'];
  return `<div class="tshare" style="height:20px">${n.map((v,i)=>v?`<i style="width:${v/t*100}%;background:${col[i]}">${v/t>=.14?nm[i]+' '+v:''}</i>`:'').join('')}</div>`;}
const NET_ICON={gov:'🏛',corp:'💼',party:'🗳',person:'👤'};
function netTabHTML(){if(!S.net)return '<p class="empty">관계망이 없다.</p>';const f=S.netF||'all';const na=netAdAdj();
  const known=ENTS.filter(e=>S.net[e[0]]&&S.net[e[0]].known);const warn=e=>{const x=S.net[e[0]];return x.rel<=-25||x.cut>0||x.block>0||(S.arc&&S.arc[e[0]]);};const soon=e=>e[4]&&entDue(e[0],S.turn)||e[4]&&entDue(e[0],S.turn+4);
  const F={all:['전체',()=>true],gov:['정부·기관',e=>e[2]==='gov'],corp:['광고주',e=>e[2]==='corp'],person:['정당·인물',e=>e[2]==='party'||e[2]==='person'],warn:['주의',warn],ad:['광고 집행 임박',soon]};
  const keys=S.simple?['all','warn','ad']:Object.keys(F);let L=known.filter((F[f]||F.all)[1]);const nk=NET_SORT[S.netSort]?S.netSort:'rec';if(nk==='rec')L.sort((a,b)=>f==='warn'?S.net[a[0]].rel-S.net[b[0]].rel:(b[4]||0)-(a[4]||0)||S.net[b[0]].rel-S.net[a[0]].rel);else L=netSorted(L,nk,e=>e[0]);
  const lim=S.simple?8:60;const more=L.length-lim;L=L.slice(0,lim);
  const cnt={cut:known.filter(e=>S.net[e[0]].cut>0).length,block:known.filter(e=>S.net[e[0]].block>0).length,boost:known.filter(e=>S.net[e[0]].boost&&S.net[e[0]].boostT>S.turn).length,due:known.filter(e=>e[4]&&entDue(e[0])).length};
  const unk=ENTS.filter(e=>S.net[e[0]]&&!S.net[e[0]].known).length;
  const row=e=>{const id=e[0],x=S.net[id],E=ENT[id];const bd=[x.cut>0?`<span class="tag ex">광고 중단 ${wkTxt(x.cut)}</span>`:'',x.block>0?`<span class="tag ex">자료 거부</span>`:'',x.boost&&x.boostT>S.turn?`<span class="tag ok">화해·광고↑</span>`:'',S.arc&&S.arc[id]?'<span class="tag ex">보도 뒤 냉랭</span>':'',e[4]&&entDue(id)?'<span class="tag so">이번 달 광고</span>':''].join('');
    return `<details class="nrow"><summary><span class="ni${e[2]==='person'?' nf':''}">${e[2]==='person'?face('pol',x.rel):ic({gov:'gov',corp:'brief',party:'vote'}[e[2]]||'bld')}</span><span class="nn">${esc(entName(id))}<small>${DEPTS[E.c]?DEPTS[E.c].n:''}${e[4]?' · 광고주':''}</small></span><span class="nb">${bd}</span>${relPill(x.rel)}</summary><div class="nd"><p>${esc(entInfo(id)[0])} · <b>${esc(entInfo(id)[1])}</b></p><p class="meta">${relLabel(x.rel)} · ${adLine(E)}${E.kind==='person'?` · ${termTxt(id)}`:''}</p></div></details>`;};
  return `<div class="rsum">${relBands(known,e=>S.net[e[0]].rel,[70,40,15,-10])}<div class="meta" style="margin-top:6px"><span>알고 지내는 곳 ${known.length}</span>${cnt.due?`<span class="tag so">이번 달 광고 ${cnt.due}곳</span>`:''}${cnt.cut?`<span class="tag ex">광고 중단 ${cnt.cut}</span>`:''}${cnt.block?`<span class="tag ex">자료 거부 ${cnt.block}</span>`:''}${cnt.boost?`<span class="tag ok">화해·증액 ${cnt.boost}</span>`:''}${na.loss>=.0005||na.gain>=.0005?`<span>관계 영향 -${eok(na.loss)} / +${eok(na.gain)}</span>`:''}</div></div>
   <div class="acat" style="margin:8px 0">${keys.map(k=>`<button class="achip" data-nf="${k}" aria-pressed="${k===f}" style="--c:var(--sodium)">${F[k][0]}<small>${known.filter(F[k][1]).length}</small></button>`).join('')}</div>${known.length>4?sortChips(NET_SORT,nk,'data-tns'):''}
   ${L.map(row).join('')||'<p class="empty">해당하는 곳이 없다.</p>'}${more>0?`<p class="hint">외 ${more}곳 — 분류를 골라 보자</p>`:''}${unk?`<p class="hint">아직 연줄이 없는 곳 ${unk}곳 — '대외 관계'에서 뚫을 수 있다</p>`:''}<p class="hint">이름을 누르면 성향과 광고 정보가 펼쳐진다. 비판 보도는 관계를 깎고, 관계가 좋으면 자료·광고가 따라온다.</p>`;}
function colsTabHTML(extra){if(!S.cols||!S.cols.length)return '<p class="empty">아직 동료가 없다.</p>';const f=S.colF||'rel';const C=S.cols.slice();
  const help=C.filter(c=>c.rel>=40).length,foe=C.filter(c=>c.rel<=-10).length,avg=Math.round(C.reduce((a,c)=>a+c.rel,0)/C.length);
  const sorts={rel:['관계순',(a,b)=>b.rel-a.rel],risk:['껄끄러운 순',(a,b)=>a.rel-b.rel],role:['직책순',(a,b)=>colYrs(b)-colYrs(a)]};C.sort(sorts[f][1]);
  const row=c=>`<details class="nrow"><summary><span class="ni nf">${face(c.role,c.rel,'',c.name)}</span><span class="nn">${esc(c.name)}<small>${colRole(c)} · ${colYrs(c)}년 차 · ${clamp(26+colYrs(c),24,64)}세</small></span><span class="nb"><span class="tag bl">${PERS[c.pers].n}</span></span>${relPill(c.rel,-50,100,40,-10)}</summary><div class="nd"><p>${relLabel(c.rel)} · ${esc(CROLE[c.role].perk)}</p>${S.simple?'':`<p class="meta">능력치 추정 (친할수록 정확): ${colStats(c)}</p>`}${c.hist.length?`<p class="meta">${c.hist.slice(0,2).map(esc).join(' · ')}</p>`:''}</div></details>`;
  return `<div class="rsum">${relBands(C,c=>c.rel,[70,40,15,-10])}<div class="meta" style="margin-top:6px"><span>평균 관계 ${avg}</span><span class="tag ok">도와주는 사람 ${help}</span>${foe?`<span class="tag ex">발목 잡는 사람 ${foe}</span>`:''}</div></div>
   <div class="acat" style="margin:8px 0">${Object.keys(sorts).map(k=>`<button class="achip" data-cf="${k}" aria-pressed="${k===f}" style="--c:var(--sodium)">${sorts[k][0]}</button>`).join('')}</div>
   ${C.map(row).join('')}${extra||''}<p class="hint">관계는 -50~100. 40 이상이면 도움을 받고, -10 이하면 발목을 잡힌다. 이름을 누르면 자세히 보인다.</p>`;}

// 간소화 모드: 관계망·사내 관계 탭 대신 '나' 탭에 한눈에 보기
function relGlance(){if(!S.simple||!S.net)return '';const K=ENTS.filter(e=>S.net[e[0]]&&S.net[e[0]].known);if(!K.length&&!(S.cols||[]).length)return '';
  const top=K.slice().sort((a,b)=>S.net[b[0]].rel-S.net[a[0]].rel).slice(0,3),bad=K.filter(e=>S.net[e[0]].rel<=-25||S.net[e[0]].cut>0).sort((a,b)=>S.net[a[0]].rel-S.net[b[0]].rel).slice(0,3);
  const cs=(S.cols||[]).slice().sort((a,b)=>b.rel-a.rel);const chip=(n,r,warn)=>`<span class="tag ${warn?'ex':'ok'}">${esc(n)} ${Math.round(r)}</span>`;
  return `<div class="card"><div class="t">관계 한눈에</div><div class="meta"><b style="color:var(--good)">내 편</b>${top.map(e=>chip(entName(e[0]),S.net[e[0]].rel)).join('')||'<span>아직 없다</span>'}</div>${bad.length?`<div class="meta"><b style="color:var(--red)">주의</b>${bad.map(e=>chip(entName(e[0])+(S.net[e[0]].cut?'(광고 중단)':''),S.net[e[0]].rel,1)).join('')}</div>`:''}${cs.length?`<div class="meta"><b>사내</b>${cs.slice(0,2).map(c=>chip(c.name,c.rel,c.rel<=-10)).join('')}${cs.length>2&&cs[cs.length-1].rel<=-10?chip(cs[cs.length-1].name,cs[cs.length-1].rel,1):''}</div>`:''}</div>`;}