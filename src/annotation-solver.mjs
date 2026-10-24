/** Global deterministic paper-space label placement, limited to a view box. */
export function solveAnnotations(items,bounds,obstacles=[]){
 const occupied=[...obstacles],result=[],padding=1.3;
 const inside=(b)=>b.x>=bounds.x+1&&b.y>=bounds.y+1&&b.x+b.w<=bounds.x+bounds.w-1&&b.y+b.h<=bounds.y+bounds.h-1;
 const collide=(a,b)=>a.x< b.x+b.w+padding&&a.x+a.w+padding>b.x&&a.y<b.y+b.h+padding&&a.y+a.h+padding>b.y;
 const proposals=[[6,-6],[6,5],[-6,-6],[-6,5],[12,0],[-12,0],[0,-12],[0,12],[18,-9],[-18,-9],[18,9],[-18,9]];
 const sorted=[...items].sort((a,b)=>String(a.id).localeCompare(String(b.id)));
 for(const item of sorted){const w=Math.max(8,item.text.length*1.28+1),h=3.8;let best=null;
  for(let ring=0;ring<6&&!best;ring++)for(const [dx,dy] of proposals){const ox=dx*(1+ring*.62),oy=dy*(1+ring*.62),x=item.anchor.x+ox+(ox<0?-w:0),y=item.anchor.y+oy;
   const b={x,y,w,h};if(!inside(b)||occupied.some(o=>collide(o,b)))continue;best=b;break}
  if(best){occupied.push(best);result.push({...item,rect:best,leader:{x1:item.anchor.x,y1:item.anchor.y,x2:Math.max(best.x,Math.min(best.x+best.w,item.anchor.x)),y2:best.y+best.h/2}})}
  else result.push({...item,unplaced:true});
 }
 return {placed:result.filter(x=>!x.unplaced),unplaced:result.filter(x=>x.unplaced),total:result.length};
}
