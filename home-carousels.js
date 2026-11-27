// Same interaction contract as Beyond project work. No automatic restart after interaction.
document.querySelectorAll('.home-carousel').forEach(carousel=>{
 const viewport=carousel.querySelector('.home-carousel-viewport'),track=carousel.querySelector('.home-carousel-track');
 const slides=[...track.children],dots=[...carousel.querySelectorAll('.carousel-dot')];
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let page=Number(carousel.dataset.start||0),stopped=false,visible=false,hovered=false,timer;
 function render(announce=false){
  track.style.transform=`translateX(-${page*100}%)`;
  slides.forEach((slide,i)=>{slide.setAttribute('aria-hidden',String(i!==page));slide.inert=i!==page;});
  dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===page)));
  if(announce)carousel.querySelector('.carousel-status').textContent=`${carousel.getAttribute('aria-label')}: ${page+1} of ${slides.length}`;
 }
 function schedule(){clearTimeout(timer);if(!stopped&&visible&&!hovered&&!document.hidden&&!reduced.matches&&!carousel.contains(document.activeElement))timer=setTimeout(()=>{page=(page+1)%slides.length;render();schedule();},8000);}
 function stop(){stopped=true;clearTimeout(timer);}
 function show(next){stop();page=(next+slides.length)%slides.length;render(true);}
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>show(i)));
 carousel.querySelector('.carousel-previous').addEventListener('click',()=>show(page-1));
 carousel.querySelector('.carousel-next').addEventListener('click',()=>show(page+1));
 carousel.addEventListener('click',stop);
 carousel.addEventListener('pointerdown',stop,{passive:true});
 carousel.addEventListener('mouseenter',()=>{hovered=true;schedule();});
 carousel.addEventListener('mouseleave',()=>{hovered=false;schedule();});
 carousel.addEventListener('focusin',()=>clearTimeout(timer));
 carousel.addEventListener('focusout',()=>setTimeout(schedule,0));
 carousel.addEventListener('keydown',e=>{stop();if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();show(e.key==='Home'?0:e.key==='End'?slides.length-1:page+(e.key==='ArrowRight'?1:-1));if(e.target.classList.contains('carousel-dot'))dots[page].focus();});
 let touch=null;
 viewport.addEventListener('touchstart',e=>{stop();touch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
 viewport.addEventListener('touchend',e=>{if(!touch)return;const t=e.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;touch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)show(page+(dx<0?1:-1));},{passive:true});
 viewport.addEventListener('touchcancel',()=>touch=null,{passive:true});
 new IntersectionObserver(entries=>{visible=entries[0].intersectionRatio>=.5;schedule();},{threshold:[0,.5]}).observe(viewport);
 reduced.addEventListener('change',schedule);document.addEventListener('visibilitychange',schedule);render();
});
