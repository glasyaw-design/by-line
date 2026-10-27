# 바이라인 크레딧 · 라이선스

## 그림 (assets/images · og.png)
- AI 이미지 생성(ChatGPT)으로 만들고 게임에 맞게 다듬었다.
- 실존 인물·상표·로고를 그리지 않았다.

## 음악 (assets/audio · 8곡)
- AI 음악 생성(Suno)으로 만들었다.
- 밤의 편집국 · 편집국의 하루 · 새벽 라인 · 마감 30분 전 · 속보 대기 · 국장실의 오후 · 도약 · 마지막 바이라인

## 글꼴
- **메이플스토리체** (Maplestory Light · Bold)
  Copyright (c) 2017 NEXON-Maplestory. All rights reserved. Font designed by FONTRIX Inc.
  메이플스토리체의 지적 재산권은 (주)넥슨코리아에 있다. 무료로 쓸 수 있고 상업적 이용·웹 임베딩이 허용된다. 글꼴 파일을 고쳐 다시 배포하거나 글꼴만 따로 팔 수는 없다.
  이 게임은 원본 글꼴의 표를 하나도 바꾸지 않고 웹용 WOFF 포장으로만 담았다(assets/fonts/maplestory-400.woff · maplestory-700.woff).
- **Do Hyeon · Black Han Sans · Noto Sans KR** — SIL Open Font License 1.1, Google Fonts에서 불러온다.

## 등장 이름
게임 속 언론사·기업·기관·정당·인물은 모두 지어낸 것이다. 실제와 닮았다면 우연이다.

## 코드
바이라인의 게임 코드는 바깥 라이브러리 없이 직접 짰다. 서버(api/)도 Node.js 기본 모듈만 쓰고, Redis 주소로 연결할 때만 `redis` 패키지를 쓴다.
