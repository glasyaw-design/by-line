# 원본과 분리본을 같은 조건(난수·시각 고정)으로 돌려 상태를 비교한다. 테스트 전용.
import sys, json, hashlib
from playwright.sync_api import sync_playwright

INIT = r"""
(()=>{ // 테스트 전용: 난수·시각 고정 (제품 코드는 건드리지 않는다)
  let s=0x9E3779B9>>>0; window.__seed=v=>{s=v>>>0;};
  Math.random=function(){s|=0;s=s+0x6D2B79F5|0;let t=Math.imul(s^s>>>15,1|s);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};
  let now=1767225600000; const D=Date; const tick=()=>{now+=7;return now;};
  window.Date=class extends D{constructor(...a){if(a.length)super(...a);else super(tick());} static now(){return tick();}};
  window.Date.UTC=D.UTC;window.Date.parse=D.parse;
  window.__devTest=1; try{if(!sessionStorage.getItem('__t')){localStorage.clear();localStorage.setItem('byline-vet','1');sessionStorage.setItem('__t','1');}}catch(e){}
})();
"""

SIM = r"""async([cfg,months,seed])=>{
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  let ds=seed>>>0; const drand=()=>{ds=(ds*1664525+1013904223)>>>0;return ds/4294967296;};  // 운전용 난수(게임과 별개)
  window.toast=()=>{}; __seed(seed);
  devQuick(cfg); await sleep(0); S.dev=false; closeModal(); Q.length=0;
  const errs=[];
  const drain=()=>{for(let i=0;i<80;i++){const m=$('#modal');if(m.hidden){if(Q.length){try{Q.shift()();}catch(e){errs.push('Q '+e.message);}continue;}return;}
     const t=$('#mt').textContent;const bs=[...document.querySelectorAll('#mc button')].filter(x=>!x.disabled);
     let c=bs[Math.floor(drand()*bs.length)];
     if(/인수|매각|사표|퇴사|이직|창간|스카우트|권유|희망퇴직|명예퇴직/.test(t))c=bs.find(x=>/거절|버틴|남는다|사양|안 간다|정중히|생각 없/.test(x.innerText))||bs[bs.length-1];
     if(!c){closeModal();continue;} try{c.click();}catch(e){errs.push('click '+e.message);} }
     $('#modal').hidden=true;Q.length=0;};
  for(let m=0;m<months&&S.phase==='game';m++){
    const ids=rankActs().filter(id=>ACT[id]&&!why(id)&&!['job','found'].includes(id)).sort();
    for(let g=0;g<3&&S.ap>0&&ids.length;g++){const id=ids[Math.floor(drand()*ids.length)];const a0=S.ap;try{doAction(id);}catch(e){errs.push('act '+id+' '+e.message);}drain();if(S.ap===a0)S.ap--;}
    S.ap=0; try{endMonth();}catch(e){errs.push('endMonth '+e.message);} drain();
  }
  const st=JSON.stringify(S,(k,v)=>k==='scene'?undefined:v);
  return {phase:S.phase,turn:S.turn,rank:S.founder?'대표':rankName(),money:S.money,eval:Math.round(S.eval*100)/100,team:(S.team||[]).length,items:(S.items||[]).length,len:st.length,st,errs:errs.slice(0,5),rnd:Math.random()};
}"""

def run(url, cfg, months, seed, page_errs):
    with sync_playwright() as p:
        b = p.chromium.launch()
        ctx = b.new_context(viewport={'width': 1280, 'height': 900}, reduced_motion='reduce')
        pg = ctx.new_page(); pg.add_init_script(INIT)
        pg.on('pageerror', lambda e: page_errs.append(str(e)[:200]))
        pg.goto(url); pg.wait_for_function("typeof devQuick==='function' && typeof S!=='undefined'", timeout=60000); pg.wait_for_timeout(300)
        r = pg.evaluate(SIM, [cfg, months, seed]); b.close(); return r

if __name__ == '__main__':
    cfgs = [("{rank:0,outlet:'daehan'}", 14), ("{rank:6,outlet:'daehan'}", 14), ("{rank:3,outlet:'knb'}", 12), ("{mode:'found'}", 14), ("{rank:2,outlet:'daehan',mode:'simple'}", 12), ("{mode:'found',ftype:'local'}", 10)]
    urls = {'원본': 'http://localhost:8001/', '원본(재실행)': 'http://localhost:8001/', '분리본(dev)': 'http://localhost:5173/', '빌드(dist)': 'http://localhost:4173/', '단일 빌드': 'http://localhost:4174/'}
    sel = sys.argv[1:] or list(urls)
    for cfg, months in cfgs:
        seed = int(hashlib.md5(cfg.encode()).hexdigest()[:8], 16)
        res = {}
        for name in sel:
            pe = []
            with sync_playwright() as p:
                b = p.chromium.launch(); ctx = b.new_context(viewport={'width': 1280, 'height': 900}, reduced_motion='reduce')
                pg = ctx.new_page(); pg.add_init_script(INIT); pg.on('pageerror', lambda e: pe.append(str(e)[:200]))
                pg.goto(urls[name]); pg.wait_for_function("typeof devQuick==='function' && typeof S!=='undefined'", timeout=60000); pg.wait_for_timeout(300)
                r = pg.evaluate("([c,m,s])=>(" + SIM + ")([eval('('+c+')'),m,s])", [cfg, months, seed])
                b.close()
            h = hashlib.sha256(r['st'].encode()).hexdigest()[:16]
            res[name] = (h, r)
            print(f"  {cfg:42} {name:10} 상태해시 {h} · turn {r['turn']} {r['rank']} · 돈 {r['money']} · 평가 {r['eval']} · 팀 {r['team']} · 아이템 {r['items']} · 오류 {r['errs']} · 페이지오류 {pe[:2]}", flush=True)
        hs = set(v[0] for v in res.values())
        print(f"== {cfg}: {'모두 같음' if len(hs) == 1 else '다름 ' + str(len(hs))}\n", flush=True)
