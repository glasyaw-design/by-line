import hashlib,sys
from playwright.sync_api import sync_playwright
sys.path.insert(0,'/tmp/claude-0/rf');from cmp import INIT,SIM
H=lambda s:hashlib.sha256(s.encode()).hexdigest()[:12]
def page(p,url):
  b=p.chromium.launch();ctx=b.new_context(viewport={'width':1280,'height':900},reduced_motion='reduce');pg=ctx.new_page();pg.add_init_script(INIT);e=[];pg.on('pageerror',lambda x:e.append(str(x)[:120]))
  pg.goto(url);pg.wait_for_function("typeof start==='function'&&S&&S.phase",timeout=60000);pg.wait_for_timeout(2500);return b,pg,e
urls=[('원본','http://localhost:8001/'),('분리본','http://localhost:5173/'),('dist','http://localhost:4173/'),('단일','http://localhost:4174/')]
with sync_playwright() as p:
  # 2) 스토리 모드 5편
  for st in ['rookie','local','xfile','pbs','rescue']:
    hs={}
    for k,u in urls:
      b,pg,e=page(p,u)
      r=pg.evaluate("([c,m,s])=>("+SIM+")([c,m,s])",[{'mode':'story','story':st},6,1000+len(st)]);hs[k]=(H(r['st']),r['turn'],r['rank'],r['errs'],e[:2]);b.close()
    print('스토리',st,hs,'같음' if len(set(v[0] for v in hs.values()))==1 else '다름')
