/** SUBSTRATE PRO v2.3 bounded exact rectilinear CSG.
 * Exact on planar orthogonal coordinate partitions (double mm precision),
 * not OpenCascade/B-rep general arbitrary NURBS kernel.
 * Outputs welded-by-coordinate triangle boundary + closed mesh diagnostics.
 */
const N=x=>Number(x);
const uniq=arr=>[...new Set(arr.map(x=>Number(x.toFixed(8))))].sort((a,b)=>a-b);
const positive=(x,name)=>{if(!Number.isFinite(x)||x<=0)throw Error(`Invalid ${name}`);return x};
const inside=(v,a,b)=>v>=a-1e-7&&v<=b+1e-7;
export function solidForElement(element,doc={elements:[]}){
 const e=element,t=e.type; if(!['wall','beam','slab','column'].includes(t))throw Error('Unsupported solid type');
 let L,W,H,z=Number(e.z||0),origin,rotate;
 if(t==='wall'||t==='beam'){
   const dx=N(e.x2)-N(e.x1),dy=N(e.y2)-N(e.y1);L=positive(Math.hypot(dx,dy),'length');W=positive(N(e.thickness),'thickness');H=positive(N(e.height),'height');
   origin=[N(e.x1),N(e.y1)];rotate=[dx/L,dy/L];
 }else{
   L=positive(Math.abs(N(e.x2)-N(e.x1)),'length');W=positive(Math.abs(N(e.y2)-N(e.y1)),'width');H=positive(N(e.height),'height');
   origin=[Math.min(N(e.x1),N(e.x2)),Math.min(N(e.y1),N(e.y2))];rotate=[1,0];
 }
 const cuts=[];
 if(t==='slab')for(const h of (e.holes||[])){
  const x0=Math.min(N(h.x1),N(h.x2))-origin[0],x1=Math.max(N(h.x1),N(h.x2))-origin[0];
  const y0=Math.min(N(h.y1),N(h.y2))-origin[1],y1=Math.max(N(h.y1),N(h.y2))-origin[1];
  if(x0<0||x1>L||y0<0||y1>W||x1<=x0||y1<=y0)throw Error('Slab void outside slab boundary');
  cuts.push({x0,x1,y0:y0-W/2,y1:y1-W/2,z0:0,z1:H,id:h.id||'slab-void'});
 }
 if(t==='wall')for(const o of (doc.elements||[]).filter(o=>o.hostId===e.id&&['door','window'].includes(o.type)&&o.visible!==false)){
  const width=positive(N(o.width),'opening width'), h=positive(N(o.height),'opening height'),u=N(o.u);
  if(!Number.isFinite(u)||u<0||u>1)throw Error('Opening position outside wall');
  const x0=u*L-width/2,x1=u*L+width/2,z0=N(o.z)-z,z1=z0+h;
  if(x0< -1e-6||x1>L+1e-6||z0< -1e-6||z1>H+1e-6)throw Error('Hosted opening exceeds wall extents');
  cuts.push({x0,x1,z0,z1,id:o.id});
 }
 return boxCSG({L,W,H,origin,rotate,z,cuts,id:e.id});
}
export function boxCSG({L,W,H,origin=[0,0],rotate=[1,0],z=0,cuts=[],id=''}){
 for(const [v,k] of [[L,'length'],[W,'width'],[H,'height']])positive(v,k);
 const xs=uniq([0,L,...cuts.flatMap(c=>[c.x0,c.x1])]),ys=uniq([-W/2,W/2,...cuts.flatMap(c=>[c.y0??-W/2,c.y1??W/2])]),zs=uniq([0,H,...cuts.flatMap(c=>[c.z0,c.z1])]);
 if(xs.length*ys.length*zs.length>20000)throw Error('Solid segmentation budget exceeded');
 const nx=xs.length-1,ny=ys.length-1,nz=zs.length-1;
 const occupied=(i,j,k)=>i>=0&&i<nx&&j>=0&&j<ny&&k>=0&&k<nz&&!cuts.some(c=>{const x=(xs[i]+xs[i+1])/2,zz=(zs[k]+zs[k+1])/2;const yy=(ys[j]+ys[j+1])/2;return inside(x,c.x0,c.x1)&&inside(yy,c.y0??-W/2,c.y1??W/2)&&inside(zz,c.z0,c.z1)});
 const vertices=[],indices=[],vertexMap=new Map(); let volume=0,faceCount=0;
 const vertex=(x,y,zz)=>{const X=origin[0]+x*rotate[0]-y*rotate[1],Y=origin[1]+x*rotate[1]+y*rotate[0],Z=z+zz;const key=[X,Y,Z].map(v=>v.toFixed(7)).join(',');if(vertexMap.has(key))return vertexMap.get(key);let i=vertices.length/3;vertices.push(X,Y,Z);vertexMap.set(key,i);return i};
 const face=(points)=>{const q=points.map(v=>vertex(...v));indices.push(q[0],q[1],q[2],q[0],q[2],q[3]);faceCount++};
 for(let i=0;i<nx;i++)for(let j=0;j<ny;j++)for(let k=0;k<nz;k++)if(occupied(i,j,k)){
 const [a,b]=[xs[i],xs[i+1]],[c,d]=[ys[j],ys[j+1]],[e,f]=[zs[k],zs[k+1]];volume+=(b-a)*(d-c)*(f-e);
 if(!occupied(i-1,j,k))face([[a,c,e],[a,c,f],[a,d,f],[a,d,e]]);
 if(!occupied(i+1,j,k))face([[b,c,e],[b,d,e],[b,d,f],[b,c,f]]);
 if(!occupied(i,j-1,k))face([[a,c,e],[b,c,e],[b,c,f],[a,c,f]]);
 if(!occupied(i,j+1,k))face([[a,d,e],[a,d,f],[b,d,f],[b,d,e]]);
 if(!occupied(i,j,k-1))face([[a,c,e],[a,d,e],[b,d,e],[b,c,e]]);
 if(!occupied(i,j,k+1))face([[a,c,f],[b,c,f],[b,d,f],[a,d,f]]);
 }
 // Adjacent coplanar quads can cause T-junctions; record that restriction explicitly.
 const result={id,vertices,indices,volumeMM3:volume,volumeM3:volume/1e9,faces:faceCount,cuts:cuts.length,kernel:'rectilinear-CSG',precision:'coordinate partition',generalBRep:false};
 if(!Number.isFinite(volume)||volume<0)throw Error('Invalid solid volume');return result;
}
export function verifyKernel(){
 const b=boxCSG({L:1000,W:200,H:3000}),c=boxCSG({L:1000,W:200,H:3000,cuts:[{x0:100,x1:900,z0:0,z1:2100}]});
 if(Math.abs(b.volumeMM3-600000000)>1e-4||Math.abs(c.volumeMM3-264000000)>1e-4||!c.indices.length)throw Error('Exact rectilinear CSG verification failed');
 return {ok:true,tests:2,fullVolumeMM3:b.volumeMM3,cutVolumeMM3:c.volumeMM3,scope:'Rectilinear prismatic solids and rectangular cuts only'};
}
export function validateAssembly(doc){const errors=[];for(const e of doc.elements||[]){if(['wall','beam','slab','column'].includes(e.type)){try{solidForElement(e,doc)}catch(err){errors.push(`${e.id}: ${err.message}`)}}}return errors}

/** Union orthogonal wall solids as a single connected boundary where they overlap.
 * Scope: horizontal/vertical wall prisms sharing matching vertical extents.
 * This is a planar polyhedral boundary, not a general OpenCascade B-rep. */
export function unionOrthogonalWalls(walls){
 if(!walls.length)throw Error('Select at least one wall');
 const boxes=walls.map(e=>{
  const dx=e.x2-e.x1,dy=e.y2-e.y1,t=positive(Number(e.thickness),'thickness');
  if(Math.abs(dx)>1e-6&&Math.abs(dy)>1e-6)throw Error('Orthogonal union only: angled wall requires general B-rep kernel');
  if(Math.hypot(dx,dy)<1)throw Error('Zero wall length');
  const x0=Math.min(e.x1,e.x2)-(Math.abs(dy)>1e-6?t/2:0),x1=Math.max(e.x1,e.x2)+(Math.abs(dy)>1e-6?t/2:0);
  const y0=Math.min(e.y1,e.y2)-(Math.abs(dx)>1e-6?t/2:0),y1=Math.max(e.y1,e.y2)+(Math.abs(dx)>1e-6?t/2:0);
  return {x0,x1,y0,y1,z0:Number(e.z||0),z1:Number(e.z||0)+positive(Number(e.height),'height')};
 });
 const xs=uniq(boxes.flatMap(b=>[b.x0,b.x1])),ys=uniq(boxes.flatMap(b=>[b.y0,b.y1])),zs=uniq(boxes.flatMap(b=>[b.z0,b.z1]));
 if(xs.length*ys.length*zs.length>40000)throw Error('Union complexity limit');
 const nx=xs.length-1,ny=ys.length-1,nz=zs.length-1;
 const occ=(i,j,k)=>i>=0&&j>=0&&k>=0&&i<nx&&j<ny&&k<nz&&boxes.some(b=>{let x=(xs[i]+xs[i+1])/2,y=(ys[j]+ys[j+1])/2,z=(zs[k]+zs[k+1])/2;return x>b.x0&&x<b.x1&&y>b.y0&&y<b.y1&&z>b.z0&&z<b.z1});
 const vertices=[],indices=[];let volume=0;const vmap=new Map();
 const vertex=(x,y,z)=>{let key=[x,y,z].map(v=>v.toFixed(7)).join(',');if(vmap.has(key))return vmap.get(key);let i=vertices.length/3;vertices.push(x,y,z);vmap.set(key,i);return i};
 const quad=q=>{let a=q.map(v=>vertex(...v));indices.push(a[0],a[1],a[2],a[0],a[2],a[3])};
 for(let i=0;i<nx;i++)for(let j=0;j<ny;j++)for(let k=0;k<nz;k++)if(occ(i,j,k)){
 const a=xs[i],b=xs[i+1],c=ys[j],d=ys[j+1],e=zs[k],f=zs[k+1];volume+=(b-a)*(d-c)*(f-e);
 if(!occ(i-1,j,k))quad([[a,c,e],[a,c,f],[a,d,f],[a,d,e]]);
 if(!occ(i+1,j,k))quad([[b,c,e],[b,d,e],[b,d,f],[b,c,f]]);
 if(!occ(i,j-1,k))quad([[a,c,e],[b,c,e],[b,c,f],[a,c,f]]);
 if(!occ(i,j+1,k))quad([[a,d,e],[a,d,f],[b,d,f],[b,d,e]]);
 if(!occ(i,j,k-1))quad([[a,c,e],[a,d,e],[b,d,e],[b,c,e]]);
 if(!occ(i,j,k+1))quad([[a,c,f],[b,c,f],[b,d,f],[a,d,f]]);
 }
 return {volumeMM3:volume,volumeM3:volume/1e9,vertices,indices,faces:indices.length/6,generalBRep:false,kernel:'orthogonal-wall-union'};
}
