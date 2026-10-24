# 저장 호환: 원본에서 만든 저장(자동·슬롯·내보내기 코드)을 분리본에서 불러와 이어서 플레이 → 원본에서 이어서 한 결과와 비교
import json, hashlib, sys
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/tmp/claude-0/rf'); from cmp import INIT, SIM
H=lambda s: hashlib.sha256(s.encode()).hexdigest()[:12]
CONT=r"""async([code,months,seed])=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));window.toast=()=>{};
  const data=JSON.parse(decodeURIComponent(escape(atob(code))));loadInto(data);await sleep(900);closeModal();Q.length=0;__seed(seed);
  let ds=seed>>>0;const drand=()=>{ds=(ds*1664525+1013904223)>>>0;return ds/4294967296;};
  const drain=()=>{for(let i=0;i<80;i++){if($('#modal').hidden){if(Q.length){Q.shift()();continue;}return;}const t=$('#mt').textContent;const bs=[...document.querySelectorAll('#mc button')].filter(x=>!x.disabled);let c=bs[Math.floor(drand()*bs.length)];if(/인수|매각|사표|퇴사|이직|창간|스카우트|권유|희망퇴직|명예퇴직/.test(t))c=bs.find(x=>/거절|버틴|남는다|사양|안 간다|정중히|생각 없/.test(x.innerText))||bs[bs.length-1];if(!c){closeModal();continue;}c.click();}$('#modal').hidden=true;Q.length=0;};
  const errs=[];for(let m=0;m<months&&S.phase==='game';m++){const ids=rankActs().filter(id=>ACT[id]&&!why(id)&&!['job','found'].includes(id)).sort();for(let g=0;g<3&&S.ap>0&&ids.length;g++){const id=ids[Math.floor(drand()*ids.length)];const a0=S.ap;try{doAction(id);}catch(e){errs.push(e.message);}drain();if(S.ap===a0)S.ap--;}S.ap=0;try{endMonth();}catch(e){errs.push(e.message);}drain();}
  return {h:JSON.stringify(S,(k,v)=>k==='scene'?undefined:v),errs,turn:S.turn};}"""
def page(p,url):
    b=p.chromium.launch();ctx=b.new_context(reduced_motion='reduce');pg=ctx.new_page();pg.add_init_script(INIT);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:150]))
    pg.goto(url);pg.wait_for_function("typeof start==='function'&&typeof S!=='undefined'&&S&&S.phase",timeout=60000);pg.wait_for_timeout(800);return b,pg,errs
with sync_playwright() as p:
  for cfg in ["{rank:4,outlet:'knb'}","{mode:'found'}","{rank:0,outlet:'daehan'}"]:
    # 원본에서 18개월 플레이 → 자동 저장 + 슬롯 3 + 내보내기 코드
    b,pg,e0=page(p,'http://localhost:8001/')
    pg.evaluate("([c,m,s])=>("+SIM+")([eval('('+c+')'),m,s])",[cfg,18,777])
    code=pg.evaluate("()=>{saveGame();saveSlot(3);return saveCode();}")
    # 같은 원본 창에서 새로고침 → 자동 저장 이어하기 · 슬롯 3 확인
    pg.reload();pg.wait_for_function("typeof start==='function'&&S&&S.phase",timeout=60000);pg.wait_for_timeout(1500)
    auto=pg.evaluate("()=>{const d=loadGame();return d?[d.turn,d.rank,d.outlet]:null;}");slot=pg.evaluate("(()=>{const i=slotInfo(3);return i?i.label:null;})()")
    rA=pg.evaluate(CONT,[code,8,4242]);b.close()
    res={'원본':rA}
    for name,url in [('분리본','http://localhost:5173/'),('dist','http://localhost:4173/'),('단일','http://localhost:4174/')]:
        b,pg,e1=page(p,url);r=pg.evaluate(CONT,[code,8,4242]);b.close();res[name]=r;r['pe']=e1
    hs={k:H(v['h']) for k,v in res.items()}
    print(cfg,'| 원본 새로고침 후 자동저장',auto,'슬롯3',slot,'| 원본 코드 → 각 판에서 8개월 이어서:',hs,'· 모두 같음' if len(set(hs.values()))==1 else '· 다름', [ (k,v['errs'][:2],v.get('pe',[])[:2]) for k,v in res.items() if v['errs'] or v.get('pe')])
