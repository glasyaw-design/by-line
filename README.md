# 바이라인 (BYLINE) — 웹 배포판

수습기자에서 사장까지, 그리고 내 언론사 창간까지. 한 파일짜리 웹게임과 동시 접속자 카운터 API입니다.

## 구성
```
index.html        게임 전체 (HTML·CSS·JS 한 파일)
api/presence.js   동시 접속자·누적 방문자·게임 시작 수 (Vercel 서버리스 함수)
package.json      @upstash/redis 의존성
vercel.json       캐시 헤더
```

## 배포 (5분)
1. 이 폴더를 GitHub 저장소에 올린다.
2. vercel.com → **Add New → Project** → 저장소 선택 → Framework Preset은 **Other** 그대로 → **Deploy**.
   - 이 상태로도 게임은 바로 돌아간다(접속자 표시만 숨겨짐).
3. 접속자 표시 켜기: 프로젝트 → **Storage** (또는 Marketplace) → **Upstash for Redis** 생성 → 이 프로젝트에 연결.
   - 연결하면 `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN`(또는 `KV_REST_API_URL`/`KV_REST_API_TOKEN`) 환경 변수가 자동으로 들어간다.
4. **Deployments → Redeploy** 한 번. 타이틀 화면 버튼 아래에 "지금 N명 플레이 중 · 누적 N명"이 뜬다.

CLI로 하려면: `npm i -g vercel` → 폴더에서 `vercel` → `vercel --prod`.

## 접속자는 어떻게 세나
- 브라우저마다 임의의 id를 하나 만들어 localStorage에 둔다(개인정보 없음).
- 페이지가 열려 있고 화면에 보이는 동안 30초마다 `/api/presence`에 신호를 보낸다.
- 최근 70초 안에 신호가 있던 id 수 = **지금 플레이 중**, HyperLogLog로 센 고유 id 수 = **누적 방문자**, 새 게임 시작 횟수도 따로 센다.
- Upstash 무료 요금제(하루 1만 명령 수준)로 동시 접속 수십 명까지 충분하다. 더 많아지면 신호 간격(`index.html`의 `30000`)을 늘리면 된다.

## 참고
- 저장은 각자 브라우저의 localStorage에만 된다(서버 저장 없음).
- 개발자 모드 버튼은 Claude 아티팩트에서만 보이고 웹 배포판에서는 숨겨진다.
- 폰트는 Google Fonts(주아·고운돋움·IBM Plex Sans KR)를 불러온다.
