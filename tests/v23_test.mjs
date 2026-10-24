import assert from 'node:assert/strict';
import {boxCSG,solidForElement,verifyKernel,validateAssembly} from '../src/solid-kernel.mjs';
import {solveAnnotations} from '../src/annotation-solver.mjs';
const ok=verifyKernel();assert.equal(ok.cutVolumeMM3,264000000);
const wall={id:'w',type:'wall',x1:0,y1:0,x2:4000,y2:0,z:0,height:3000,thickness:200};
const door={id:'d',type:'door',hostId:'w',u:.5,width:900,z:0,height:2100};
const doc={elements:[wall,door]};
const geo=solidForElement(wall,doc);assert.equal(geo.volumeMM3,4000*200*3000-900*200*2100);
const angled={...wall,id:'a',x2:3000,y2:4000};assert.equal(solidForElement(angled,{elements:[]}).volumeMM3,5000*200*3000);
assert.equal(validateAssembly({elements:[{...wall,id:'bad',height:-2}]}).length,1);
const labels=Array.from({length:8},(_,i)=>({id:'T'+i,text:'W-00'+i,anchor:{x:25,y:25}}));
const s=solveAnnotations(labels,{x:0,y:0,w:100,h:100});assert.equal(s.total,8);
for(let i=0;i<s.placed.length;i++)for(let j=i+1;j<s.placed.length;j++){
 const a=s.placed[i].rect,b=s.placed[j].rect;assert.ok(a.x+a.w<=b.x||b.x+b.w<=a.x||a.y+a.h<=b.y||b.y+b.h<=a.y);
}
console.log('v2.3 SOLID AND ANNOTATION TESTS PASS',geo.faces,s.placed.length,s.unplaced.length);
