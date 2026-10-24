import assert from 'node:assert/strict';
import {normalizeProfile,validateAssembly,assemblyLabel} from '../src/assembly-catalog.mjs';
import {hatchKind,openingSVG} from '../src/detail-graphics.mjs';
import {hatchConfiguration,fillHatchedPolygon} from '../src/plan-hatches.mjs';
import {buildPlotSVG} from '../src/plot.mjs';
for(const [material,kind] of [['Precast concrete','concrete'],['CMU','masonry'],['Steel','metal'],['Timber','timber'],['Glass','glass'],['Mineral insulation','insulation']]){assert.equal(hatchKind(material),kind);assert.equal(hatchConfiguration(material).kind,kind)}
const profile=normalizeProfile({manufacturer:'Example',product:'Series',model:'W1',revision:'2',sourceUrl:'https://example.org',verification:'manufacturer-document',frameDepth:150,frameFace:65,glazingCount:3});assert.equal(validateAssembly({assemblyProfile:profile}).length,0);assert.match(assemblyLabel({assemblyProfile:profile}),/Example/);assert.throws(()=>normalizeProfile({glazingCount:7}));
const wall={x1:0,y1:0,x2:4000,y2:0,thickness:200};const opening={type:'window',width:1200,u:.5,assemblyProfile:profile};const svg=openingSVG(wall,opening,(x,y)=>[(x/50).toFixed(2),(y/50).toFixed(2)],50);assert.match(svg,/data-bim-symbol="window"/);assert.ok((svg.match(/stroke-width="0.23"/g)||[]).length>=3);
const calls=[];const ctx=new Proxy({}, {get(_obj,key){if(key==='canvas')return {};return (...args)=>calls.push([key,...args])},set(){return true}});fillHatchedPolygon(ctx,[{x:0,y:0},{x:100,y:0},{x:100,y:50},{x:0,y:50}],{material:'CMU'});assert.ok(calls.some(x=>x[0]==='clip'));assert.ok(calls.some(x=>x[0]==='stroke'));
const plot=buildPlotSVG({title:'LOD Test',elements:[{id:'a',type:'slab',material:'Concrete',x1:0,y1:0,x2:2000,y2:2000,z:0,height:200,visible:true}]},{views:'single',mainView:'plan'});assert.match(plot,/url\(#h-concrete\)/);
console.log('LOD/profile/hatch tests passed');
