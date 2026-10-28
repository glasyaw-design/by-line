# 바이라인 — 기자 커리어 시뮬레이션 웹게임 (1.77)

수습기자로 시작해 단독을 쫓고, 편집국장·사장까지 오르거나 내 언론사를 세우는 게임입니다.
게임 코드는 바깥 라이브러리 없이 일반 `<script>` 여러 개로 되어 있고, 배포할 때는 하나로 묶습니다.

## 실행

Node.js 18 이상만 있으면 됩니다.

```bash
npm run dev          # http://localhost:5173 — 파일을 고치고 새로고침하면 바로 반영 (여러 파일 그대로)
npm run build        # dist/ (배포판: 코드·CSS를 하나씩으로 묶음) + dist-single/ (index.html 하나로 합친 판)
npm run preview      # http://localhost:4173 — dist/를 열어 본다
npm run check        # 정적 검사: 문법 · 파일 참조 · 리소스 해시
npm run test:api     # 계정 API 테스트 (브라우저 없이, 메모리 Redis)
npm run test:start   # 실제 시작 경로: 5모드 × 폰·PC · 계정 가입→클라우드 저장→다른 기기 · 저장 실패 알림 · CSP
npm test             # 회귀 테스트: 시나리오 8개를 같은 난수로 돌려 기준값(tests/golden.json)과 비교
```

`test:start`와 `npm test`는 Playwright가 필요합니다. 처음 한 번: `npm i --no-save playwright && npx playwright install chromium`
(배포에는 필요 없어서 package.json에 넣지 않았습니다.) GitHub에 올리면 `.github/workflows/ci.yml`이 위 테스트를 모두 돌립니다.

## 배포 (Vercel)

1. 이 폴더를 GitHub에 올리고 Vercel에 연결하면 `vercel.json`대로 `npm run build` → `dist/`가 배포됩니다.
2. **Storage → Upstash(Redis) 연결**: 환경 변수가 저절로 생깁니다. 이름에 접두사가 붙어도 찾아 씁니다.
3. 배포 주소 뒤에 `/api/account?debug=1`을 열어 `"ok":true,"write":true`인지 확인합니다.
4. `public/privacy.html`의 **【입력: …】 세 곳**(운영자·연락처·Upstash 지역)을 채웁니다. 빌드할 때 남아 있으면 경고가 나옵니다.
5. (선택) 접속자 수를 보려면 환경 변수 `ADMIN_KEY`를 정하고, 게임 주소 뒤에 `?admin=그값`을 한 번 붙여 엽니다.

공유 이미지(og:image)는 Vercel이 주는 주소로 빌드할 때 절대 주소가 됩니다. 다른 곳에 올릴 땐 `SITE_URL=https://내주소 npm run build`.

## 폴더

```
index.html              화면 골격 + CSS 2개 + script 여러 개 (개발용 · 순서가 곧 실행 순서)
styles/                 CSS
src/core|data|systems|ui|dev/   바탕 게임 코드
src/compat/             1.21~ 확장 모듈 (앞 파일의 함수를 감싸서 덮는 구조)
src/main.js             로딩 화면 · start() · 부팅
assets/images|fonts|audio       그림 · 글꼴 · 음악 (바이너리 그대로)
public/                 개인정보처리방침 · 아이콘 · manifest · robots.txt · 크레딧 (빌드 때 dist/로 복사)
api/presence.js         동시 접속자 수 (IP당 10분 40번 제한 · 숫자는 관리자만)
api/account.js          계정 · 클라우드 저장 · 기록실 · 명예의 전당
tests/                  api.mjs · start.mjs · run.mjs(회귀) · lib/fake-redis.mjs
tools/ · docs/          리소스 목록 · 구조 문서 · 분리에 쓴 스크립트
```

`dist/`, `dist-single/`은 빌드 결과라 저장소에 올리지 않습니다(.gitignore).

## 고칠 때 꼭 지킬 것

1. **`index.html`의 script 순서를 바꾸지 마세요.** 뒤 파일이 앞 파일의 함수를 감싸(`const _x=foo; foo=function(){…}`) 덮어씁니다.
2. `async`·`defer`·`type="module"`을 붙이지 마세요. 전역 이름을 공유합니다.
3. 새 기능은 새 파일을 `src/main.js` 바로 앞에 끼우는 게 가장 안전합니다.
4. 뒤 파일에서 선언한 함수를 앞 파일에서 감싸면 안 됩니다. 자세한 건 `docs/STRUCTURE.md`.
5. 버전은 `src/systems/actions.js`의 `VERSION` 한 곳과 `package.json`의 `version`만 바꿉니다.
6. 고친 뒤 `npm run check && npm run build && npm run test:start`. 일부러 게임을 바꿨다면 `npm run test:update`.

## 저장

게임 저장은 브라우저 저장소(localStorage)에만 남습니다. 저장 공간이 차면 오래된 자동 저장부터 비우고, 그래도 안 되면 화면에 경고와 「저장 파일 내보내기」를 띄웁니다.
로그인하면 석 달마다 클라우드에도 올라갑니다. 주소(origin)가 바뀌면 예전 저장이 안 보이는 건 정상입니다 — 내보내기·가져오기를 쓰세요.

문서: [구조](docs/STRUCTURE.md) · [검증](docs/VERIFICATION.md) · [크레딧](public/CREDITS.md)
