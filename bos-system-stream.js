(()=>{
 const root=document.querySelector('.bos-x-grid');if(!root)return;
 const ns='http://www.w3.org/2000/svg',svg=document.createElementNS(ns,'svg'),core=root.querySelector('.bos-x-core'),nodes=[...root.querySelectorAll('.bos-x-node')],motion=matchMedia('(prefers-reduced-motion: reduce)');
 svg.classList.add('bos-x-traffic');svg.setAttribute('aria-hidden','true');root.prepend(svg);
 const paths=nodes.map((node,i)=>{const path=document.createElementNS(ns,'path');svg.append(path);return{node,path,phase:i*5,direction:i%2?1:-1,remaining:8000+Math.random()*8000}});
 let frame=0,last=0,visible=false;
 function draw(){const box=root.getBoundingClientRect(),rect=e=>{const r=e.getBoundingClientRect();return{x:r.left-box.left,y:r.top-box.top,w:r.width,h:r.height}},c=rect(core);svg.setAttribute('viewBox',`0 0 ${box.width} ${box.height}`);
 paths.forEach(item=>{const n=rect(item.node),mobile=matchMedia('(max-width:760px)').matches;
 // End just beneath the midpoint of the inward-facing edge so cards mask the moving dashes.
 const x=mobile?n.x+n.w/2:(n.x<c.x?n.x+n.w-6:n.x+6);
 const y=mobile?(n.y<c.y?n.y+n.h-6:n.y+6):n.y+n.h/2;
 item.path.setAttribute('d',`M${c.x+c.w/2} ${c.y+c.h/2} L${x} ${y}`);item.path.style.strokeDashoffset=item.phase});}
 function tick(t){frame=0;if(!visible||document.hidden||motion.matches){last=0;return}const delta=last?Math.min(t-last,100):0;last=t;paths.forEach(p=>{p.phase=(p.phase+p.direction*delta/1000*(20/2.6))%13;p.remaining-=delta;if(p.remaining<=0){p.direction*=-1;p.remaining=8000+Math.random()*8000}p.path.style.strokeDashoffset=p.phase});frame=requestAnimationFrame(tick)}
 function resume(){if(frame)cancelAnimationFrame(frame);frame=0;last=0;if(visible&&!document.hidden&&!motion.matches)frame=requestAnimationFrame(tick)}
 new ResizeObserver(draw).observe(root);new IntersectionObserver(es=>{visible=es[0].isIntersecting;resume()}).observe(root);document.addEventListener('visibilitychange',resume);motion.addEventListener('change',resume);draw();
})();
