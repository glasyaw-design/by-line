import * as acorn from '/opt/npm-tools/node_modules/acorn/dist/acorn.mjs';import fs from 'fs';
const src=fs.readFileSync(process.argv[2]||'orig.js','utf8');const B=acorn.parse(src,{ecmaVersion:'latest',sourceType:'script'}).body;
const isFn=n=>n&&(n.type==='FunctionExpression'||n.type==='ArrowFunctionExpression');
const DENY=new Set(['addEventListener','setTimeout','setInterval','requestAnimationFrame','then','catch','finally','push','unshift','defineProperty','observe','queueMicrotask']);
function calleeName(c){if(c.type==='Identifier')return c.name;if(c.type==='MemberExpression'&&!c.computed)return c.property.name;return null;}
// generic walker
function walk(n,visit,parent,key){if(!n||typeof n.type!=='string')return;if(visit(n,parent,key)===false)return;for(const k in n){if(k==='type'||k==='start'||k==='end')continue;const v=n[k];if(Array.isArray(v))v.forEach(x=>x&&typeof x.type==='string'&&walk(x,visit,n,k));else if(v&&typeof v.type==='string')walk(v,visit,n,k);}}
function refsAll(n){const S=new Set();walk(n,(x,p,k)=>{if(x.type==='Identifier'){if(p&&p.type==='MemberExpression'&&k==='property'&&!p.computed)return;if(p&&p.type==='Property'&&k==='key'&&!p.computed&&!p.shorthand)return;if(p&&p.type==='MethodDefinition'&&k==='key')return;S.add(x.name);}});return S;}
// eager walk: refs + called names, not descending into non-eager functions
function eager(n){const R=new Set(),C=new Set();
  const visit=(x,p,k)=>{
    if(x.type==='FunctionDeclaration')return false;
    if(isFn(x)){let isE=true;
      if(p&&p.type==='Property')isE=false;
      else if(p&&p.type==='ArrayExpression')isE=false;
      else if(p&&p.type==='CallExpression'&&k==='arguments'){const cn=calleeName(p.callee);if(DENY.has(cn))isE=false;}
      else if(p&&p.type==='NewExpression'&&k==='arguments'){const cn=calleeName(p.callee);if(/Observer$/.test(cn||''))isE=false;}
      else if(p&&p.type==='AssignmentExpression'&&(p.left.type==='MemberExpression'||(p.left.type==='Identifier'&&TOP.has(p.left.name))))isE=false;
      else if(p&&p.type==='VariableDeclarator'&&TOPDECL.has(p))isE=false;
      else if(p&&(p.type==='ReturnStatement'||p.type==='ConditionalExpression'||p.type==='LogicalExpression'))isE=true;
      if(!isE)return false;}
    if(x.type==='ClassDeclaration'||x.type==='ClassExpression')return false;
    if(x.type==='Identifier'){if(p&&p.type==='MemberExpression'&&k==='property'&&!p.computed)return;if(p&&p.type==='Property'&&k==='key'&&!p.computed&&!p.shorthand)return;R.add(x.name);}
    if((x.type==='CallExpression'||x.type==='NewExpression')){if(x.callee.type==='Identifier')C.add(x.callee.name);const cn=calleeName(x.callee);if(!DENY.has(cn))x.arguments.forEach(a=>{if(a.type==='Identifier')C.add(a.name);});}
  };walk(n,visit,null,null);return {R,C};}
// declarations
const D={};const kindOf={};B.forEach((n,i)=>{if(n.type==='FunctionDeclaration'){(D[n.id.name]=D[n.id.name]||[]).push(i);kindOf[n.id.name]='function';}
  else if(n.type==='VariableDeclaration'){n.declarations.forEach(d=>{if(d.id.type==='Identifier'){if(n.kind==='var'){(D[d.id.name]=D[d.id.name]||[]).push(i);kindOf[d.id.name]='var';}else kindOf[d.id.name]=kindOf[d.id.name]||n.kind;}});}
  else if(n.type==='ClassDeclaration')kindOf[n.id.name]='class';});
// body refs per function name: decls + any assignment NAME=fn anywhere at top level
const body={};const addBody=(nm,f)=>{const s=refsAll(f.body);body[nm]=body[nm]||new Set();s.forEach(x=>body[nm].add(x));};
const TOP=new Set(Object.keys(kindOf));const TOPDECL=new Set();B.forEach(n=>{if(n.type==='VariableDeclaration')n.declarations.forEach(d=>TOPDECL.add(d));});
B.forEach(n=>{if(n.type==='FunctionDeclaration'){addBody(n.id.name,n);return;}
  if(n.type==='VariableDeclaration')n.declarations.forEach(d=>{if(d.id.type==='Identifier'&&isFn(d.init))addBody(d.id.name,d.init);});
  walk(n,(x,p,k)=>{if(x.type==='FunctionDeclaration')return false;if(isFn(x)&&!(p&&p.type==='CallExpression'))return false;if(x.type==='AssignmentExpression'&&x.left.type==='Identifier'&&TOP.has(x.left.name)&&isFn(x.right))addBody(x.left.name,x.right);});});
// closure
const memo={};function closure(names){const out=new Set();const st=[...names];while(st.length){const nm=st.pop();if(out.has(nm))continue;out.add(nm);const b=body[nm];if(b)b.forEach(y=>{if(!out.has(y)&&TOP.has(y))st.push(y);});}return out;}
const E=B.map((n,i)=>{const {R,C}=eager(n);const cl=closure([...C].filter(c=>body[c]));cl.forEach(x=>R.add(x));return R;});
// unsafe intervals: name N with decl (function/var) at d; eager ref at r<d => cuts in (r,d] unsafe
const unsafe=new Array(B.length+1).fill(null);const why={};
for(const N in D){const dmax=Math.max(...D[N]);let rmin=Infinity;for(let i=0;i<dmax;i++){if(E[i].has(N)){rmin=i;break;}}if(rmin===Infinity)continue;
  for(let k=rmin+1;k<=dmax;k++){if(!unsafe[k])unsafe[k]=N;}why[N]=[rmin,dmax];}
const safe=[];for(let k=1;k<B.length;k++)if(!unsafe[k])safe.push(k);
console.log('names causing constraints',Object.keys(why).length);console.log(Object.entries(why).sort((a,b)=>(b[1][1]-b[1][0])-(a[1][1]-a[1][0])).slice(0,40).map(([k,v])=>k+':'+v.join('-')).join('  '));
console.log('safe cut count',safe.length,'of',B.length-1);
// contiguous unsafe ranges
let rng=[];let s0=null;for(let k=1;k<=B.length;k++){if(unsafe[k]&&s0===null)s0=k;if(!unsafe[k]&&s0!==null){rng.push([s0,k-1]);s0=null;}}console.log('unsafe ranges',rng.length,rng.slice(0,60).map(r=>r.join('-')).join(' '));
fs.writeFileSync('E.json',JSON.stringify({E:E.map(x=>[...x].filter(y=>D[y])),D,starts:B.map(n=>n.start),types:B.map(n=>n.type)}));fs.writeFileSync('safe.json',JSON.stringify({safe,unsafe:unsafe.map(x=>x||0)}));
