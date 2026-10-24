from playwright.sync_api import sync_playwright
import sys,hashlib;sys.path.insert(0,'/tmp/claude-0/rf');from cmp import INIT
I2=INIT.replace("window.__devTest=1;","")
def run(url,pm,verbose=False):
  with sync_playwright() as p:
    b=p.chromium.launch();pg=b.new_page(viewport={'width':1280,'height':900});pg.add_init_script(I2);errs=[];pg.on('pageerror',lambda e:errs.append(str(e)[:150]))
    pg.goto(url);pg.wait_for_function("typeof start==='function'&&S&&S.phase",timeout=60000);pg.wait_for_timeout(2600)
    pg.evaluate("__seed(4321)")
    pg.fill('#title input, input', '테스트기자') if False else pg.evaluate("()=>{const i=[...document.querySelectorAll('input')].find(x=>x.offsetParent);i.value='테스트기자';i.dispatchEvent(new Event('input',{bubbles:true}));}")
    pg.click(f'[data-go="new"][data-pm="{pm}"]');pg.wait_for_timeout(500)
    steps=[]
    for i in range(80):
      st=pg.evaluate("S.phase")
      if st=='game':break
      info=pg.evaluate("""()=>{const m=$('#modal');if(m&&!m.hidden){const bs=[...document.querySelectorAll('#mc button')].filter(b=>!b.disabled&&!/ghost/.test(b.className));return {m:1,t:$('#mt').innerText.slice(0,30),b:bs.map(b=>b.innerText.split('\\n')[0].slice(0,20))};}
        const bs=[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&!b.disabled);return {m:0,t:S.phase,b:bs.map(b=>(b.dataset.go||Object.keys(b.dataset).join(','))+':'+b.innerText.split('\\n')[0].slice(0,16))};}""")
      steps.append(info['t'])
      if verbose: print(i,info)
      if info['m']:
        pg.evaluate("()=>{document.querySelectorAll('#mb input[type=text],#mb input:not([type])').forEach(x=>{if(!x.value){x.value='테스트일보';x.dispatchEvent(new Event('input',{bubbles:true}));}});const bs=[...document.querySelectorAll('#mc button')].filter(b=>!b.disabled&&!/ghost/.test(b.className));bs[0]&&bs[0].click();}")
      else:
        # 생성 화면: '다음'·'시작'·'응시' 같은 진행 버튼을 누른다
        ok=pg.evaluate("""()=>{const bs=[...document.querySelectorAll('button')].filter(b=>b.offsetParent&&!b.disabled);if(S.phase==='apply'){const ap=bs.filter(b=>b.dataset.go==='apply');const on=ap.filter(b=>b.getAttribute('aria-pressed')==='true'||b.classList.contains('on'));if(!on.length&&ap.length&&!window.__ap){window.__ap=1;ap[6].click();return 'pick';}const go=bs.find(b=>!['apply','af','title','sound'].includes(b.dataset.go)&&b.dataset.go);if(go){go.click();return 'go:'+go.dataset.go;}}const cr=bs.find(b=>b.dataset.go==='create');if(cr){cr.click();return 'create';}const nx=bs.find(b=>/다음|응시|지원|입사|출근|확인|계속|제출|들어간다|간다/.test(b.innerText)&&!/처음으로|뒤로|바로 시작/.test(b.innerText));if(nx){nx.click();return nx.innerText.split('\\n')[0];}
          const opt=bs.find(b=>b.classList.contains('opt')&&b.getAttribute('aria-pressed')!=='true');if(opt){opt.click();return 'opt';}return null;}""")
        if not ok: break
      pg.wait_for_timeout(250)
    r=pg.evaluate("()=>({phase:S.phase,rank:S.phase==='game'?(S.founder?'대표':rankName()):null,outlet:S.outlet&&OUT().n,dept:S.dept,turn:S.turn,h:JSON.stringify(S,(k,v)=>k==='scene'?undefined:v)})")
    b.close();return r,steps,errs
if __name__=='__main__':
  if len(sys.argv)>1: print(run('http://localhost:8001/',sys.argv[1],True)[1][:40]);sys.exit()
  for pm in ['exam','simple','found','quick','smb']:
    for k,u in [('원본','http://localhost:8001/'),('분리본','http://localhost:5173/'),('dist','http://localhost:4173/'),('단일','http://localhost:4174/')]:
      r,st,e=run(u,pm)
      print(f"{pm:6} [{k}] {r['phase']} {r['rank']} {r['outlet']} {r['dept']} · 단계 {len(st)} · 상태 {hashlib.sha256(r['h'].encode()).hexdigest()[:12]} · 오류 {e[:2]}",flush=True)
