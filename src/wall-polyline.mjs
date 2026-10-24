// Linked centerline path geometry, all coordinates millimetres.
export const distance=(a,b)=>Math.hypot(a.x-b.x,a.y-b.y);
export function constrainWall(p,origin,{ortho=true,diagonal=false}={}){
 if(!origin||!ortho||diagonal)return {x:p.x,y:p.y};
 const dx=p.x-origin.x,dy=p.y-origin.y;
 return Math.abs(dx)>=Math.abs(dy)?{x:p.x,y:origin.y}:{x:origin.x,y:p.y};
}
export function wallPathSegments(points,metadata={}){
 if(points.length<2)throw Error('Polyline requires at least two points');
 const out=[];
 for(let i=1;i<points.length;i++){
  if(distance(points[i-1],points[i])<20)throw Error(`Wall segment ${i} shorter than 20 mm`);
  out.push({...metadata,x1:points[i-1].x,y1:points[i-1].y,x2:points[i].x,y2:points[i].y,pathIndex:i-1});
 }
 return out;
}
function cross(a,b){return a.x*b.y-a.y*b.x}
function intersect(p,u,q,v){const d=cross(u,v);if(Math.abs(d)<1e-10)return null;const w={x:q.x-p.x,y:q.y-p.y},t=cross(w,v)/d;return {x:p.x+u.x*t,y:p.y+u.y*t}}
export function miteredWallOutline(points,width,{miterLimit=4}={}){
 if(points.length<2||!(width>0))throw Error('Invalid wall polyline');
 const clean=[points[0]];for(let i=1;i<points.length;i++)if(distance(points[i],clean.at(-1))>1e-8)clean.push(points[i]);
 if(clean.length<2)throw Error('Degenerate wall path');
 const ds=[],ns=[];for(let i=1;i<clean.length;i++){const a=clean[i-1],b=clean[i],l=distance(a,b),d={x:(b.x-a.x)/l,y:(b.y-a.y)/l};ds.push(d);ns.push({x:-d.y,y:d.x})}
 const side=sign=>clean.map((p,i)=>{const j=Math.max(0,i-1),k=Math.min(ds.length-1,i),n0=ns[j],n1=ns[k];if(i===0||i===clean.length-1){const n=i===0?ns[0]:ns.at(-1);return {x:p.x+n.x*width*sign/2,y:p.y+n.y*width*sign/2}}
  const offset=width*sign/2;
  const left={x:p.x+n0.x*offset,y:p.y+n0.y*offset},right={x:p.x+n1.x*offset,y:p.y+n1.y*offset};
  let corner=intersect(left,ds[j],right,ds[k]);
  if(!corner||distance(corner,p)>width*miterLimit/2)corner={x:(left.x+right.x)/2,y:(left.y+right.y)/2};
  return corner;
 });
 return [...side(1),...side(-1).reverse()];
}
export function pathPoints(segments){if(!segments.length)return [];const sorted=[...segments].sort((a,b)=>(a.pathIndex||0)-(b.pathIndex||0));return [{x:sorted[0].x1,y:sorted[0].y1},...sorted.map(e=>({x:e.x2,y:e.y2}))]}

// Update the shared corner of adjacent path segments as one model transaction.
export function moveSharedVertex(elements,selectedId,end,newPoint){
 const selected=elements.find(e=>e.id===selectedId);if(!selected||!selected.pathId)throw Error('No linked wall path');
 const number=Number(end);if(number!==1&&number!==2)throw Error('Invalid endpoint');
 const x=selected['x'+number],y=selected['y'+number];
 if(!Number.isFinite(newPoint.x)||!Number.isFinite(newPoint.y))throw Error('Invalid vertex coordinate');
 const members=elements.filter(e=>e.type==='wall'&&e.pathId===selected.pathId);
 const changes=[];for(const e of members)for(const v of [1,2])if(Math.hypot(e['x'+v]-x,e['y'+v]-y)<1e-5)changes.push([e,v]);
 if(!changes.length)throw Error('Shared vertex missing');
 for(const [e,v] of changes){const other=v===1?2:1;const wasVertical=Math.abs(e.x1-e.x2)<1e-7,wasHorizontal=Math.abs(e.y1-e.y2)<1e-7;e['x'+v]=newPoint.x;e['y'+v]=newPoint.y;if(wasVertical)e['x'+other]=newPoint.x;else if(wasHorizontal)e['y'+other]=newPoint.y}
 return changes.length;
}
export function coordinateWallPath(elements,pathId){
 const walls=elements.filter(e=>e.type==='wall'&&e.pathId===pathId).sort((a,b)=>a.pathIndex-b.pathIndex);
 for(let i=1;i<walls.length;i++)if(distance({x:walls[i-1].x2,y:walls[i-1].y2},{x:walls[i].x1,y:walls[i].y1})>1e-5)throw Error('Disconnected path vertex at segment '+i);
 return {segments:walls.length,vertices:pathPoints(walls)};
}
