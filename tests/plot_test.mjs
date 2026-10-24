import assert from 'node:assert/strict';
import {paperSize,layout,chooseScale,buildPlotSVG,PAPER} from '../src/plot.mjs';
const doc={title:'Model Test',elements:[{id:'wallA',type:'wall',x1:0,y1:0,x2:6000,y2:0,z:0,height:3000,thickness:200},{id:'windowA',type:'window',hostId:'wallA',u:.5,width:1200,z:900,height:1200}]};
assert.deepEqual(paperSize('A3','landscape'),[420,297]);assert.deepEqual(paperSize('A3','portrait'),[297,420]);
assert.equal(layout({paper:'A2',views:'single'}).boxes.length,1);assert.equal(layout({views:'four'}).boxes.length,4);
assert.equal(chooseScale(doc,layout({views:'single'}).boxes,'50'),50);
assert.ok(chooseScale(doc,layout({views:'four'}).boxes,'auto')>=50);
for(const fmt of Object.keys(PAPER)){const xml=buildPlotSVG(doc,{paper:fmt,orientation:'landscape'});const [w,h]=paperSize(fmt);assert.ok(xml.includes(`width="${w}mm" height="${h}mm"`));assert.ok(xml.includes('A-101'));assert.ok(xml.includes('PRELIMINARY'));}
assert.ok(buildPlotSVG(doc,{views:'single',mainView:'plan'}).includes('PLAN ·'));
assert.ok(buildPlotSVG(doc,{views:'four'}).includes('ISOMETRIC (NTS)'));
assert.ok(buildPlotSVG(doc,{weights:{cut:.7}}).includes('stroke-width="0.7"'));
console.log('Plot engine: 15 assertions passed');
