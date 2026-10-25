/* 바이라인 — src/compat/v24.js
 * 일반 <script>로 index.html에 적힌 순서대로 실행된다. 순서를 바꾸지 말 것 (README의 로드 순서 참고).
 */


// ===== 1.32 글꼴: 메이플스토리체 (제목·버튼·숫자 Bold · 본문 Light) =====
(function(){const st=document.createElement('style');st.textContent=`
:root{--f-display:"Maplestory","Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif;--f-body:"Maplestory","Noto Sans KR","Apple SD Gothic Neo","Malgun Gothic",sans-serif;--f-pix:"Maplestory","Noto Sans KR",sans-serif;--f-logo:"Maplestory","Noto Sans KR",sans-serif}
html,body,button,input,select,textarea{font-family:var(--f-body)}
body{font-weight:400;letter-spacing:0}
b,strong,.cl,.anm,.t,h3,h4{font-weight:700}
.num,.chip b,.p21t b,.ring b,.kv b{font-family:var(--f-pix);font-weight:700;letter-spacing:0}
h1,h2,.bh h3,.sec,.mt,.brand,.ttm b,.stgh,.endttl b,.mht h3,.next,.ttnew,.ttcont,.ttc,.achip,.tab,.stab,.chip b{font-family:var(--f-display);font-weight:700;letter-spacing:0}
.ttlogo h1,.brand{font-family:var(--f-logo)!important;font-weight:700;letter-spacing:.01em}
body.v19 #modal .mbx.p21 .mt{font-family:var(--f-display)!important;font-weight:700}
body.v19 #mc .ch .cl{font-family:var(--f-body);font-weight:700}
body.v19 .act.hasic .anm{font-family:var(--f-display)!important;font-weight:700;font-size:16px}
.lede,#mb p{font-family:var(--f-body)}
small,.hint,.meta{font-weight:400}
`;document.head.appendChild(st);})();