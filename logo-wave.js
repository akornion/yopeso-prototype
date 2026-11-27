(() => {
 const strip=document.querySelector('.company-logos');if(!strip)return;
 const logos=[...strip.querySelectorAll('img')].map(img=>({src:img.getAttribute('src'),alt:img.alt}));
 // Decode all logos before rotating so incoming assets cannot appear late.
 const ready=Promise.all(logos.map(logo=>{const image=new Image();image.src=logo.src;return image.decode().catch(()=>{});}));
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 const accessible=document.createElement('span');accessible.className='sr-only';accessible.textContent=logos.map(x=>x.alt).join(', ');
 let count=0,offset=0,timer=null,animations=[],visible=false,active=false,generation=0;
 const canRun=()=>visible&&!document.hidden&&!reduced.matches;
 function face(index){const wrap=document.createElement('span');wrap.className='logo-face';const img=document.createElement('img');img.src=logos[index%logos.length].src;img.alt='';wrap.append(img);return wrap;}
 function schedule(){clearTimeout(timer);if(canRun()&&!active)timer=setTimeout(wave,5000);}
 function draw(){
  const nextCount=Number(getComputedStyle(strip).getPropertyValue('--logo-slots'))||6;
  if(nextCount===count)return;
  generation++;clearTimeout(timer);animations.forEach(a=>a.cancel());animations=[];active=false;count=nextCount;
  strip.replaceChildren(accessible);
  for(let i=0;i<count;i++){const slot=document.createElement('span');slot.className='logo-slot';slot.setAttribute('aria-hidden','true');const track=document.createElement('span');track.className='logo-track';track.append(face(offset+i));slot.append(track);strip.append(slot);}
  schedule();
 }
 async function wave(){
  if(!canRun())return;active=true;const version=generation;await ready;if(version!==generation)return;if(!canRun()){active=false;return;}
  const batch=[];const slots=[...strip.querySelectorAll('.logo-slot')];
  const tracks=slots.map(slot=>slot.firstElementChild);
  const incoming=tracks.map((track,i)=>{const next=face(offset+count+i);track.append(next);return next;});
  // Decode the actual DOM images, not throwaway preload elements.
  try{await Promise.all(incoming.map(next=>next.querySelector('img').decode()));}
  catch{if(version===generation){incoming.forEach(next=>next.remove());active=false;schedule();}return;}
  if(version!==generation)return;
  if(!canRun()){incoming.forEach(next=>next.remove());active=false;return;}
  tracks.forEach((track,i)=>{
   const timing={duration:800,delay:i*300,easing:'cubic-bezier(.4,0,.2,1)',fill:'both'};
   batch.push(track.animate([{transform:'translateY(0)'},{transform:'translateY(-100%)'}],timing));
  });animations=batch;
  try{await Promise.all(batch.map(a=>a.finished));}catch{return;}
  if(version!==generation)return;
  tracks.forEach(track=>track.firstElementChild.remove());batch.forEach(a=>a.cancel());animations=[];offset=(offset+count)%logos.length;active=false;schedule();
 }
 function visibility(){if(canRun()){animations.forEach(a=>{if(a.playState==='paused')a.play();});schedule();}else{clearTimeout(timer);animations.forEach(a=>{if(a.playState==='running')a.pause();});}}
 new IntersectionObserver(entries=>{visible=entries[0].intersectionRatio>=.5;visibility();},{threshold:[0,.5]}).observe(strip);
 new ResizeObserver(draw).observe(strip);
 document.addEventListener('visibilitychange',visibility);
 reduced.addEventListener('change',()=>{if(reduced.matches){clearTimeout(timer);animations.forEach(a=>a.cancel());animations=[];active=false;count=0;draw();}else schedule();});
 draw();
})();
