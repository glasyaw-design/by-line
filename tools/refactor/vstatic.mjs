import * as acorn from '/opt/npm-tools/node_modules/acorn/dist/acorn.mjs';import fs from 'fs';
const ref=fs.readFileSync('ref/index.html','utf8'),one=fs.readFileSync('byline/dist-single/index.html','utf8');
const parts=h=>{const a=h.indexOf('<script>'),b=h.lastIndexOf('</script>');return {pre:h.slice(0,a),js:h.slice(a+8,b),post:h.slice(b)};};
const A=parts(ref),B=parts(one);
console.log('HTML(스크립트 밖) 동일:',A.pre===B.pre&&A.post===B.post);
if(A.pre!==B.pre){let i=0;while(A.pre[i]===B.pre[i])i++;console.log(' 첫 차이',i,JSON.stringify(A.pre.slice(i-80,i+80)),'\n vs',JSON.stringify(B.pre.slice(i-80,i+80)));}
const pa=acorn.parse(A.js,{ecmaVersion:'latest'}).body,pb=acorn.parse(B.js,{ecmaVersion:'latest'}).body;
const MOV=new Set(Object.keys(JSON.parse(fs.readFileSync('moves.json','utf8'))));
const isMov=n=>n.type==='FunctionDeclaration'&&MOV.has(n.id.name);
// 원본에서 뒤에 같은 이름 선언이 또 있어 실행되지 않던(덮어써진) 함수 선언은 분리본에서 지웠다 → 비교에서 뺀다
const dead=new Set(pa.filter((n,i)=>n.type==='FunctionDeclaration'&&pa.slice(i+1).some(m=>m.type==='FunctionDeclaration'&&m.id.name===n.id.name)));console.log('덮어써져 지운 옛 선언',[...dead].map(n=>n.id.name).join(', ')||'없음');
const ta=pa.filter(n=>!isMov(n)&&!dead.has(n)).map(n=>A.js.slice(n.start,n.end)),tb=pb.filter(n=>!isMov(n)).map(n=>B.js.slice(n.start,n.end));
let diff=0;const AUD="a.src='bgm/bgm_'+k+'.mp3'",AUD2="a.src='assets/audio/bgm_'+k+'.mp3'";
for(let i=0;i<Math.max(ta.length,tb.length);i++){if(ta[i]!==tb[i]){if(ta[i]&&tb[i]&&ta[i].replace(AUD,AUD2)===tb[i]){console.log(' 의도한 차이(음악 경로) 문장',i);continue;}diff++;if(diff<4)console.log(' 다른 문장',i,JSON.stringify((ta[i]||'').slice(0,100)),'|',JSON.stringify((tb[i]||'').slice(0,100)));}}
console.log('최상위 문장 수',pa.length,pb.length,'· 옮기지 않은 문장 순서·내용 차이',diff);
const ma=pa.filter(isMov).map(n=>A.js.slice(n.start,n.end)).sort(),mb=pb.filter(isMov).map(n=>B.js.slice(n.start,n.end)).sort();
console.log('옮긴 선언',ma.length,'내용 동일',JSON.stringify(ma)===JSON.stringify(mb));
