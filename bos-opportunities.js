(()=>{
 const root=document.querySelector('.bos-opportunities');if(!root)return;
 const slides=[...root.querySelectorAll('.bos-example-slide')],choices=[...root.querySelectorAll('[data-example]')],motion=matchMedia('(prefers-reduced-motion: reduce)'),status=root.querySelector('.bos-example-status');
 let index=0,stopped=false,visible=false,hover=false,timer=null,startX=null,cycleStart=performance.now();
 function schedule(){clearTimeout(timer);if(!stopped&&visible&&!hover&&!document.hidden&&!motion.matches&&!root.contains(document.activeElement))timer=setTimeout(()=>show(index+1),12000-((performance.now()-cycleStart)%12000));}
 function stop(){stopped=true;schedule();}
 function restartDiagram(){root.classList.remove("diagram-running");void root.offsetWidth;cycleStart=performance.now();root.classList.add("diagram-running");}
 function show(n,manual=false){if(manual)stopped=true;index=(n+slides.length)%slides.length;slides.forEach((s,i)=>s.hidden=i!==index);choices.forEach(b=>b.setAttribute('aria-current',String(Number(b.dataset.example)===index)));if(manual)status.textContent=slides[index].getAttribute('aria-label');restartDiagram();schedule();}
 choices.forEach(b=>b.addEventListener('click',()=>show(Number(b.dataset.example),true)));
 root.addEventListener('click',stop);root.addEventListener('mouseenter',()=>{hover=true;schedule();});root.addEventListener('mouseleave',()=>{hover=false;schedule();});root.addEventListener('focusin',schedule);root.addEventListener('focusout',()=>setTimeout(schedule,0));
 root.addEventListener('keydown',e=>{if(['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();show(index+(e.key==='ArrowRight'?1:-1),true);}});
 root.addEventListener('touchstart',e=>{startX=e.changedTouches[0].clientX;stop();},{passive:true});root.addEventListener('touchend',e=>{if(startX!==null){const dx=e.changedTouches[0].clientX-startX;if(Math.abs(dx)>40)show(index+(dx<0?1:-1),true);startX=null;}},{passive:true});
 document.addEventListener('visibilitychange',schedule);motion.addEventListener('change',schedule);
 new IntersectionObserver(entries=>{const next=entries[0].isIntersecting;if(next&&!visible)restartDiagram();visible=next;schedule();},{threshold:.25}).observe(root);
})();
