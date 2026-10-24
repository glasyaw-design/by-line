# 화면·기능 점검: 같은 난수로 원본과 분리본의 화면 텍스트·저장·리소스를 비교한다. 테스트 전용.
import sys, json, hashlib, re
from playwright.sync_api import sync_playwright
sys.path.insert(0, '/tmp/claude-0/rf'); from cmp import INIT

H = lambda s: hashlib.sha256(s.encode()).hexdigest()[:12]
NAMES = json.load(open('/tmp/claude-0/rf/topnames.json'))

def check(url, tag, vp=(1280, 900), shots=False):
    out = {'tag': tag}; errs = []; bad = []; reqs = []
    with sync_playwright() as p:
        b = p.chromium.launch(); ctx = b.new_context(viewport={'width': vp[0], 'height': vp[1]}, reduced_motion='reduce')
        pg = ctx.new_page(); pg.add_init_script(INIT)
        pg.on('pageerror', lambda e: errs.append('pageerror ' + str(e)[:160]))
        pg.on('console', lambda m: errs.append('console ' + m.text[:160]) if m.type == 'error' else None)
        pg.on('requestfailed', lambda r: bad.append('failed ' + r.url[-80:] + ' ' + str(r.failure)))
        pg.on('response', lambda r: (bad.append(f'{r.status} ' + r.url[-80:]) if r.status >= 400 else None, reqs.append(r.url)))
        pg.goto(url); pg.wait_for_function("typeof start==='function' && typeof S!=='undefined' && S && S.phase", timeout=60000)
        pg.wait_for_timeout(2500)
        # 1) 첫 화면
        out['title_text'] = H(pg.evaluate("document.body.innerText"))
        out['title_phase'] = pg.evaluate("S.phase")
        if shots: pg.screenshot(path=f'/tmp/claude-0/rf/shot_{tag}_title.png')
        # 2) 전역 함수·값 소스 일치 (이름 → typeof + 소스 해시)
        out['fnmap'] = pg.evaluate("""ns=>{const o={};for(const n of ns){try{const v=eval(n);const t=typeof v;o[n]=t==='function'?t+':'+v.toString().length+':'+[...v.toString()].reduce((a,c)=>(a*31+c.charCodeAt(0))|0,0):t;}catch(e){o[n]='ERR';}}return o;}""", NAMES)
        # 3) 게임 화면·탭 텍스트 (같은 씨앗)
        r = pg.evaluate("""async()=>{const sleep=ms=>new Promise(r=>setTimeout(r,ms));window.toast=()=>{};__seed(12345);devQuick({rank:3,outlet:'daehan'});await sleep(50);closeModal();Q.length=0;
          const tabs=['me','road','world','cols','net','items','src','clips','co','fin','org','team','mates','adv','log'];const T={};
          document.body.classList.add('mv-tab');for(const t of tabs){S.tab=t;try{render();}catch(e){T[t]='ERR '+e.message;continue;}const el=document.querySelector('.bx-tab')||document.body;T[t]=el.innerText;}
          document.body.classList.remove('mv-tab');S.tab='me';render();
          // 개별 행동: 취재 · 기사 출고 · 데스킹 · 취재원 · 동료 · 인사
          const A={};const pickFirst=()=>{for(let i=0;i<30;i++){if($('#modal').hidden){if(Q.length){Q.shift()();continue;}break;}const bs=[...document.querySelectorAll('#mc button')].filter(x=>!x.disabled&&!/ghost/.test(x.className));const t=$('#mt').textContent;A[Object.keys(A).length+':'+t]=$('#mb').innerText.slice(0,400);if(!bs.length){closeModal();continue;}bs[0].click();}};
          for(const id of ['invest','write','desk','source','colleague','network','personnel','beat','discover']){if(!ACT[id]){A['없음 '+id]=1;continue;}S.ap=Math.max(S.ap,3);try{doAction(id);}catch(e){A['ERR '+id]=e.message;}pickFirst();}
          return {T,A,st:JSON.stringify(S,(k,v)=>k==='scene'?undefined:v)};}""")
        out['tabs'] = {k: H(v) for k, v in r['T'].items()}; out['tabs_raw'] = r['T']; out['acts'] = H(json.dumps(r['A'], ensure_ascii=False)); out['acts_raw'] = r['A']
        out['state_after_acts'] = H(r['st'])
        if shots: pg.screenshot(path=f'/tmp/claude-0/rf/shot_{tag}_game.png', full_page=False)
        # 4) 저장 → 새로고침 → 이어하기
        st0 = pg.evaluate("()=>{saveGame();saveSlot(2);return JSON.stringify(S,(k,v)=>k==='scene'?undefined:v);}")
        keys = pg.evaluate("Object.keys(localStorage).sort()")
        out['ls_keys'] = keys
        code = pg.evaluate("saveCode()")
        pg.reload(); pg.wait_for_function("typeof start==='function' && typeof S!=='undefined' && S && S.phase", timeout=60000); pg.wait_for_timeout(2000)
        out['after_reload_phase'] = pg.evaluate("S.phase")
        r2 = pg.evaluate("""()=>{const d=loadGame();if(!d)return 'NOSAVE';loadInto(d);return JSON.stringify(S,(k,v)=>k==='scene'?undefined:v);}""")
        pg.wait_for_timeout(900)
        out['reload_same'] = (r2 != 'NOSAVE') and (json.loads(r2).get('turn') == json.loads(st0).get('turn')) and (json.loads(r2).get('rank') == json.loads(st0).get('rank'))
        out['slot2'] = pg.evaluate("(()=>{const i=slotInfo(2);return i?i.label:null;})()")
        out['code'] = code
        # 5) 리소스: 그림·글꼴
        pg.evaluate("()=>{closeModal();Q.length=0;render();}"); pg.wait_for_timeout(1500)
        out['img'] = pg.evaluate("""()=>{const im=[...document.images];return {n:im.length,broken:im.filter(i=>i.complete&&i.naturalWidth===0).map(i=>i.src.slice(-60)).slice(0,5)};}""")
        out['font'] = pg.evaluate("""async()=>{try{await document.fonts.load('700 20px Maplestory','가');await document.fonts.load('400 20px Maplestory','가');}catch(e){}return [document.fonts.check('700 20px Maplestory','가'),document.fonts.check('400 20px Maplestory','가')];}""")
        # 6) 음악: 클릭으로 오디오를 켜고 BGM 요청이 나가는지
        pg.mouse.click(5, 5); pg.wait_for_timeout(300)
        pg.evaluate("()=>{try{auInit();if(typeof bgmUpdate==='function')bgmUpdate();}catch(e){}}"); pg.wait_for_timeout(2500)
        out['audio_req'] = sorted(set(re.sub(r'^.*/', '', u) for u in reqs if u.endswith('.mp3')))
        out['errs'] = errs[:8]; out['bad'] = [x for x in bad if '/api/presence' not in x and 'fonts.g' not in x][:8]
        out['bad_ext'] = [x for x in bad if 'fonts.g' in x][:2]
        b.close()
    return out

if __name__ == '__main__':
    urls = {'원본': 'http://localhost:8001/', '분리본': 'http://localhost:5173/', 'dist': 'http://localhost:4173/', '단일': 'http://localhost:4174/'}
    vp = (390, 844) if 'mobile' in sys.argv else (1280, 900)
    res = {k: check(u, k + ('_m' if vp[0] < 500 else ''), vp, shots=True) for k, u in urls.items()}
    json.dump(res, open('/tmp/claude-0/rf/ui_' + ('m' if vp[0] < 500 else 'd') + '.json', 'w'), ensure_ascii=False)
    R = res['원본']
    for k, v in res.items():
        fn_diff = [n for n in NAMES if v['fnmap'].get(n) != R['fnmap'].get(n)]
        print(f"[{k}] 첫화면 {v['title_phase']} 텍스트{'=' if v['title_text']==R['title_text'] else '≠'} · 함수/값 {len(NAMES)}개 중 다른 것 {len(fn_diff)} {fn_diff[:5]} · 탭 {sum(v['tabs'][t]==R['tabs'][t] for t in v['tabs'])}/{len(v['tabs'])} 같음 · 행동 화면{'=' if v['acts']==R['acts'] else '≠'} · 행동 후 상태{'=' if v['state_after_acts']==R['state_after_acts'] else '≠'}")
        print(f"     저장키 {v['ls_keys']} · 새로고침 후 {v['after_reload_phase']} 이어하기 {v['reload_same']} · 슬롯2 {v['slot2']}")
        print(f"     그림 {v['img']} · 글꼴 {v['font']} · 음악 요청 {v['audio_req']} · 오류 {v['errs']} · 실패 요청 {v['bad']} · (외부 구글 폰트 {v['bad_ext']})")
