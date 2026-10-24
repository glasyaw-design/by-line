import * as acorn from '/opt/npm-tools/node_modules/acorn/dist/acorn.mjs';import fs from 'fs';
const D=process.argv[2]||'.';process.chdir(D);
for (const [f,n] of [['src/systems/actions.js','bribeEvent'],['src/systems/npc.js','bribeOut']]){
 const s=fs.readFileSync(f,'utf8');const a=acorn.parse(s,{ecmaVersion:'latest'});
 const d=a.body.find(x=>x.type==='FunctionDeclaration'&&x.id.name===n);
 const out=s.slice(0,d.start)+`// ${n}: 1.6에서 src/compat/v43.js의 같은 이름 함수로 대체됨 (예전 정의는 실행되지 않아 지웠다)`+s.slice(d.end);
 fs.writeFileSync(f,out);console.log(f,n,d.end-d.start,'bytes removed');}
