/* 바이라인 1.6 — src/compat/v32.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.4 라이벌 바로잡기 =====
// 1) 라이벌은 같은 계열(신문·방송·온라인…)의 비슷한 급 매체에서 고른다 (신문 기자 라이벌이 공영방송이던 문제)
makeRival=function(){const me=OUT();const g=(TYPES[me.type]||{}).g;const L=OUTLETS.filter(x=>x.id!==S.outlet&&!x.closed&&!x.custom&&!x.npc&&Math.abs(x.p-me.p)<=1);
  const L1=L.filter(x=>x.type===me.type),L2=L.filter(x=>(TYPES[x.type]||{}).g===g);const o=pick(L1.length?L1:L2.length?L2:L.length?L:OUTLETS.filter(x=>x.id!==S.outlet&&!x.closed));
  return {name:rname(),outlet:o.id,skill:Math.round(skillYrs(S.turn/YW)+R(2,10)),wins:0,rk:clamp(S.rank|0,0,5),t0:S.turn,rkT:S.turn};};
// 2) 이직해도 라이벌은 그대로 (「앞으로 계속 마주칠 얼굴」). 라이벌 회사로 옮기면 그때만 새 라이벌
function rivalKeep(){const rv=S.rival;if(!rv||rv.pub)return makeRival();const ro=OUTLETS.find(o=>o.id===rv.outlet);if(!ro||ro.closed)return makeRival();
  if(rv.outlet===S.outlet){try{if(!(S.cols||[]).some(x=>x.name===rv.name))S.cols.push(mkCol('rivalpeer',-5,rv.name));}catch(e){}const nr=makeRival();log(`라이벌 ${jo2(rv.name,'과','와')} 이제 한 회사다. 업계엔 새 맞수가 생겼다 — ${nr.name}`);return nr;}
  return rv;}
function rvOther(){const rv=S.rival;return rv&&!rv.pub&&rv.outlet!==S.outlet&&OUTLETS.some(o=>o.id===rv.outlet)?rv:null;}
// 3) 직급: 수습으로 같이 시작해 석 달 뒤 함께 발령. 해마다 1월 승진 심사 — 실력·낙종 성적에 따라, 한 직급에 최소 2년
rivalYear=function(lines){const rv=S.rival;if(!rv||rv.pub||S.founder||S.story)return;const ro=OUTLETS.find(o=>o.id===rv.outlet);if(!ro)return;
  if(rv.rk==null)rv.rk=clamp(S.rank|0,1,5);rv.hist=rv.hist||[];if(rv.t0==null)rv.t0=S.turn;if(rv.rkT==null)rv.rkT=S.turn;
  if(rv.rk===0&&S.turn-rv.t0>=12){rv.rk=1;rv.rkT=S.turn;rv.hist.push(`${dateStr()} 수습 마치고 발령`);if(lines)lines.push({c:'',t:`라이벌 ${rv.name}도 수습을 마치고 ${ro.n} 기자로 발령됐다`});}
  rv.skill=Math.round(rv.skill||40);
  if(month()!==1||rv.yrT===S.turn)return;rv.yrT=S.turn;
  // 실력은 해마다 자란다 (내가 물먹을수록 더)
  rv.skill=clamp(rv.skill+R(1,3)+Math.min(3,(rv.wins||0)/8),20,92);
  const yrs=(S.turn-rv.rkT)/YW,need=rv.rk<=1?3:rv.rk<=3?4:5;
  const p=clamp(.25+(rv.skill-50)/200+Math.min(10,rv.wins||0)*.01,.15,.5);
  if(rv.rk>=1&&rv.rk<6&&yrs>=need-1&&chance(yrs>=need?p+.15:p*.5)&&rv.rk<=S.rank+1){rv.rk++;rv.rkT=S.turn;const rn=rankName(rv.rk,ro);rv.hist.push(`${dateStr()} ${rn} 승진`);
    lines.push({c:rv.rk>S.rank?'r':'',t:`라이벌 ${rv.name}(${ro.n}) — ${jo2(rn,'으로','로')} 승진했다${rv.rk>S.rank?'. 나보다 한발 앞섰다':rv.rk===S.rank?'. 이제 같은 자리다':''}`});}
  if(rv.outlet!==S.outlet&&rv.rk>=3&&S.rank>=3&&chance(.06)&&(TYPES[ro.type]||{}).g===(TYPES[OUT().type]||{}).g){rv.hist.push(`${dateStr()} ${jo2(OUT().n,'으로','로')} 이직`);
    lines.push({c:'r',t:`라이벌 ${jo2(rv.name,'이','가')} 우리 회사로 왔다. 이제 같은 편집국에서 부딪힌다`});rv.outlet=S.outlet;S.rival=rivalKeep();}};
// 4) 같은 회사가 된 라이벌은 경쟁사처럼 굴지 않는다
{const _rr=rivalRoute;rivalRoute=function(lines){if(!rvOther())return;return _rr(lines);};}
// ===== 선배와 술자리: 결과가 그날 분위기·내 말솜씨·컨디션에 따라 갈린다 =====
RUN.drink=function(){spend(1,10);setCd('drink');const cp=colBy('cap');const cha=S.st.cha||40;const hp=S.hp??60;
  const r=Math.random()+(cha-45)/150+(cp&&cp.rel>=20?.08:0)-(hp<30?.25:0);
  const peer=(S.cols||[]).filter(c=>['senior','peer','photo','editor'].includes(c.role));
  if(r<.18){const ln=pick(['필름이 끊겼다. 단톡방에 내가 보낸 이모티콘 스무 개가 남아 있다.','캡 앞에서 "기자 그만둘까 봐요"라고 해 버렸다.','2차에서 선배 기사 흠을 잡았다. 분위기가 싸해졌다.']);
    if(cp)relUp(cp,-1,'술자리 실수');toast(`${ln} · `+apply({eval:-.4,hp:-6,money:-4}));log(`선배들과 소주. ${ln}`);return;}
  const big=r>.85;const ln=big?pick(['캡이 "너 괜찮다"며 자기 취재원 하나를 넘겨줬다.','형사 출신 선배가 탐문 요령을 풀어 놓다가, 요즘 도는 사건 이야기를 흘렸다.','바이스가 "다음 주에 큰 거 하나 터진다"고 귀띔했다.']):pick([`바이스가 ${sasuN()} 요령을 알려줬다.`,'선배가 자기 첫 단독 이야기를 세 번째 했다.','2차 노래방에서 부장 18번을 같이 불렀다.','"기자는 발로 쓰는 거야." 오늘만 다섯 번 들었다.','캡이 첫 보고서 얘기를 꺼내며 웃었다.']);
  if(cp)relUp(cp,big?4:3,'술자리');peer.slice(0,2).forEach(c=>relUp(c,2,'술자리'));
  if(big){if(/취재원/.test(ln)){try{addSource(S.dept,R(25,38));}catch(e){}}else S.memo=(S.memo||0)+1.5;}
  toast(`${pick(['2차까지 달렸다','새벽 1시에 택시를 탔다','막차를 놓쳤다'])} — ${ln} · `+apply({eval:big?1.2:.8,net:.5,cha:.3,money:-6}));log(`선배들과 소주. ${ln}`);};
try{ACT_FX.drink=[['캡·선배 관계↑','g'],['평가 조금↑','g'],['체력↓','r']];ACT.drink.d='캡·바이스와 소주 한잔. 말솜씨가 좋을수록 잘 풀린다';}catch(e){}