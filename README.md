# 바이라인 1.6 — 여러 파일 프로젝트

한 파일(약 14MB)이던 `바이라인_1.6_전체소스.html`을 **동작은 그대로 두고** 파일 여러 개로 나눈 프로젝트입니다.
게임 규칙·확률·저장 형식은 한 글자도 바꾸지 않았습니다. 원본은 `original/`에 그대로 있습니다.

## 실행

Node.js 18 이상만 있으면 됩니다. 외부 패키지는 필요 없습니다.

```bash
npm install        # 받을 게 없어서 바로 끝난다 (Vercel 접속자 API용 선택 패키지는 네트워크가 되면 받는다)
npm run dev        # http://localhost:5173  — 고친 파일을 저장하고 새로고침하면 바로 반영
npm run build      # dist/ (여러 파일 배포본) + dist-single/ (예전처럼 index.html 하나로 합친 판)
npm run preview    # http://localhost:4173  — dist/를 서버로 열어 본다
npm run preview:single   # http://localhost:4174 — dist-single/를 열어 본다
npm run check      # 정적 검사: 문법 · 파일 참조 · 리소스 해시
```

> 서버로 여는 걸 권장합니다. `index.html`을 더블클릭(`file://`)해도 게임은 돌아가지만, 원본과 마찬가지로 음악은 막히고(합성 음악으로 대체),
> 그림이 파일로 나뉜 탓에 「커리어 1면 이미지로 저장」이 `file://`에서는 실패할 수 있습니다. 서버나 `dist-single/`에서는 원본과 같습니다.

## 배포

- **Vercel**: 이 폴더를 그대로 올리면 `vercel.json`이 `npm run build` → `dist/`를 배포합니다. `api/presence.js`(동시 접속자)는 예전과 같습니다.
- **다른 정적 호스팅**: `npm run build` 후 `dist/` 폴더를 통째로 올립니다.
- **예전 방식(파일 하나)**: `dist-single/index.html`과 `dist-single/assets/audio/`를 올립니다. Claude 아티팩트에도 이 `index.html`을 쓰면 됩니다.
  - 음악 경로가 `bgm/` → `assets/audio/`로 바뀌었으니, 예전 배포의 `bgm/` 폴더 대신 `assets/audio/`를 함께 올려야 음악이 나옵니다.

## 폴더

```
index.html            화면 골격 + CSS 2개 + script 92개를 원본과 같은 순서로 부른다
styles/main.css       원본 첫 번째 <style>
styles/loader.css     원본 두 번째 <style> (로딩 화면)
src/core|data|systems|ui|dev/   바탕 게임 코드 (원본의 구획 주석 단위)
src/compat/v13a.js … v50.js     1.x 확장 모듈 49개 (원본에 이어 붙어 있던 순서 그대로)
src/compat/_hoisted.js          순서 보존용으로 앞당긴 함수 선언 3개
src/main.js           로딩 화면 · start() · 부팅
assets/images|fonts|audio       내장돼 있던 그림 738개 · 글꼴 2개 · 음악 8곡 (바이너리 그대로)
api/presence.js       동시 접속자 API (기존 그대로)
original/             원본 HTML (수정하지 않음)
tools/                리소스 목록·빌드 정보·분리/검증에 쓴 스크립트
docs/                 구조·대응표·검증 결과
```

## 고칠 때 꼭 지킬 것

1. **`index.html`의 script 순서를 바꾸지 마세요.** 모두 일반 `<script>`이고, 뒤 파일이 앞 파일의 함수를 감싸(`const _x=foo; foo=function(){…}`) 덮어쓰는 구조입니다.
2. `async`·`defer`·`type="module"`을 붙이지 마세요. 전역 이름을 그대로 공유해야 합니다.
3. 새 기능은 **새 파일을 맨 뒤 `src/main.js` 바로 앞**에 끼우는 게 가장 안전합니다. (`main.js`의 `start()`가 마지막에 게임을 켭니다.)
4. 바탕 파일에 새 **함수 선언**을 넣을 때, 그 함수를 앞 파일에서 바로 실행하거나 감싸면 안 됩니다(원본은 한 스크립트라 끌어올림으로 됐지만 파일을 나누면 안 됨). 자세한 건 `docs/STRUCTURE.md`.
5. 고친 뒤 `npm run check` → `npm run build` → `npm run preview`로 확인하세요.

## 저장

저장 키(`byline-career-v2`, `byline-slot-1~6`, `byline-auto-*` 등)와 형식은 원본과 같습니다. 원본 1.6에서 「저장 코드 내보내기」로 받은 코드를 이 판에서 「가져오기」하면 그대로 이어집니다.
브라우저 저장소는 주소(origin)마다 따로라, 주소가 바뀌면 예전 저장이 안 보이는 건 정상입니다. 이럴 땐 내보내기·가져오기를 쓰세요.

문서: [구조·로드 순서·대응표](docs/STRUCTURE.md) · [검증 결과](docs/VERIFICATION.md)
