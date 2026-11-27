const dialog=document.querySelector('#destination');
const descriptions={'Our services':'Explore Yopeso’s capabilities and how they can contribute to your team or project.','AI-BOS':'Learn about the reference architecture and delivery framework for AI implementations.','AI Discovery Lab':'Understand the human-led discovery engagement, its purpose and the proposed process before making an enquiry.','Contact':'Start a conversation about your team, project or AI implementation.','Work':'Explore delivered engagements and Yopeso’s specific contribution.','Careers':'Learn about life at Yopeso and explore career opportunities.','Careers → Open roles':'Find roles that fit your experience and location.','Our services → How we work':'Explore how expertise, collaboration and responsibilities are shaped around an engagement.'};
document.querySelectorAll('[data-dest]').forEach(b=>b.addEventListener('click',()=>{document.querySelector('#dialog-title').textContent=b.dataset.dest;document.querySelector('#dialog-copy').textContent=b.dataset.context||descriptions[b.dataset.dest]||`Intended destination: the ${b.dataset.dest} page.`;dialog.showModal();}));
document.querySelector('.close').addEventListener('click',()=>dialog.close());document.querySelector('.return').addEventListener('click',()=>dialog.close());dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});
// Shared main navigation: click/touch disclosure buttons with ordinary links.
const toggle=document.querySelector('.menu-toggle');
const nav=document.querySelector('#navigation');
const disclosures=[...nav.querySelectorAll('.nav-disclosure')];
function closeDisclosure(group){
 group.querySelector('.nav-disclosure-toggle').setAttribute('aria-expanded','false');
 group.querySelector('.nav-submenu').hidden=true;
}
function closeNavigation(){
 disclosures.forEach(closeDisclosure);
 toggle.setAttribute('aria-expanded','false');
 nav.classList.remove('open');
}
function openDisclosure(group){
 disclosures.filter(other=>other!==group).forEach(closeDisclosure);
 group.querySelector('.nav-disclosure-toggle').setAttribute('aria-expanded','true');
 group.querySelector('.nav-submenu').hidden=false;
}
toggle.addEventListener('click',()=>{
 if(toggle.getAttribute('aria-expanded')==='true')closeNavigation();
 else {toggle.setAttribute('aria-expanded','true');nav.classList.add('open');}
});
disclosures.forEach(group=>{
 const trigger=group.querySelector('.nav-disclosure-toggle');
 const panel=group.querySelector('.nav-submenu');
 const items=[...panel.querySelectorAll('button,a')];
 trigger.addEventListener('click',()=>panel.hidden?openDisclosure(group):closeDisclosure(group));
 trigger.addEventListener('keydown',event=>{
  if(['ArrowDown','ArrowUp'].includes(event.key)){
   event.preventDefault();event.stopPropagation();openDisclosure(group);
   items[event.key==='ArrowDown'?0:items.length-1].focus();
  }
 });
 group.addEventListener('keydown',event=>{
  if(event.key==='Escape'&&!panel.hidden){
   event.preventDefault();event.stopPropagation();closeDisclosure(group);trigger.focus();
  }else if(items.includes(document.activeElement)&&['ArrowDown','ArrowUp','Home','End'].includes(event.key)){
   event.preventDefault();const i=items.indexOf(document.activeElement);
   items[event.key==='Home'?0:event.key==='End'?items.length-1:(i+(event.key==='ArrowDown'?1:-1)+items.length)%items.length].focus();
  }
 });
 group.addEventListener('focusout',event=>{if(!group.contains(event.relatedTarget))closeDisclosure(group);});
});
let navDialogReturn=null;
dialog.addEventListener('close',()=>{if(navDialogReturn){navDialogReturn.focus();navDialogReturn=null;}});
nav.addEventListener('click',event=>{
 const preview=event.target.closest('[data-dest]');
 if(preview)navDialogReturn=matchMedia('(max-width:760px)').matches?toggle:(preview.closest('.nav-disclosure')?.querySelector('.nav-disclosure-toggle')||preview);
 if(event.target.closest('a,button')&&!event.target.closest('.nav-disclosure-toggle'))closeNavigation();
});
document.addEventListener('click',event=>{
 if(!event.target.closest('header'))closeNavigation();
 else disclosures.filter(group=>!group.contains(event.target)).forEach(closeDisclosure);
});
document.addEventListener('keydown',event=>{
 if(event.key==='Escape'&&nav.classList.contains('open')){closeNavigation();toggle.focus();}
});
nav.addEventListener('focusout',event=>{
 if(!nav.contains(event.relatedTarget)&&event.relatedTarget!==toggle)closeNavigation();
});
matchMedia('(max-width:760px)').addEventListener('change',closeNavigation);

document.querySelectorAll('[data-scroll]').forEach(button=>button.addEventListener('click',()=>document.getElementById(button.dataset.scroll)?.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'})));

// Keep the complete opening area at least one viewport tall without squeezing content.
const openingHeader=document.querySelector('.site-shell>header');
const updateOpeningHeight=()=>document.documentElement.style.setProperty('--opening-header-height',`${openingHeader.getBoundingClientRect().height}px`);
new ResizeObserver(updateOpeningHeight).observe(openingHeader);
updateOpeningHeight();

let compactHeader=false;
function updateCompactHeader(){const next=compactHeader?window.scrollY>8:window.scrollY>120;if(next!==compactHeader){compactHeader=next;openingHeader.classList.toggle('is-compact',next);}}
window.addEventListener('scroll',updateCompactHeader,{passive:true});
updateCompactHeader();

// Office carousel: five-second hold; manual interaction stops rotation until refresh.
const officeCarousel=document.querySelector('.office-carousel');
if(officeCarousel){
 const slides=[...officeCarousel.querySelectorAll('.office-slide')];
 const dots=[...officeCarousel.querySelectorAll('[data-office]')];
 const track=officeCarousel.querySelector('.office-track');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)');
 let officeIndex=0,stopped=false,visible=false,hovered=false,timer;
 function schedule(delay=5000){clearTimeout(timer);if(!stopped&&visible&&!hovered&&!document.hidden&&!reduced.matches&&!officeCarousel.contains(document.activeElement))timer=setTimeout(()=>{showOffice(officeIndex+1,false);schedule(5320);},delay);}
 function stop(){stopped=true;clearTimeout(timer);}
 function showOffice(index,manual=true){
  if(manual)stop();
  officeIndex=(index+slides.length)%slides.length;
  track.style.transform=`translateX(-${officeIndex*100}%)`;
  slides.forEach((slide,i)=>slide.setAttribute('aria-hidden',String(i!==officeIndex)));
  dots.forEach((dot,i)=>dot.setAttribute('aria-current',String(i===officeIndex)));
  if(manual)officeCarousel.querySelector('.office-status').textContent=`${slides[officeIndex].querySelector('h4').textContent}, office ${officeIndex+1} of ${slides.length}`;
 }
 dots.forEach((dot,i)=>dot.addEventListener('click',()=>showOffice(i)));
 officeCarousel.querySelector('.carousel-previous').addEventListener('click',()=>showOffice(officeIndex-1));
 officeCarousel.querySelector('.carousel-next').addEventListener('click',()=>showOffice(officeIndex+1));
 officeCarousel.addEventListener('keydown',event=>{
  stop();
  if(!['ArrowLeft','ArrowRight','Home','End'].includes(event.key))return;
  event.preventDefault();
  showOffice(event.key==='Home'?0:event.key==='End'?slides.length-1:officeIndex+(event.key==='ArrowRight'?1:-1));
  if(event.target.matches('[data-office]'))dots[officeIndex].focus();
 });
 let touchStart=null;
 const viewport=officeCarousel.querySelector('.office-viewport');
 viewport.addEventListener('touchstart',event=>{stop();touchStart=event.touches.length===1?{x:event.touches[0].clientX,y:event.touches[0].clientY}:null;},{passive:true});
 viewport.addEventListener('touchend',event=>{if(!touchStart)return;const t=event.changedTouches[0];const dx=t.clientX-touchStart.x,dy=t.clientY-touchStart.y;touchStart=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)showOffice(officeIndex+(dx<0?1:-1));},{passive:true});
 viewport.addEventListener('touchcancel',()=>{touchStart=null;},{passive:true});
 officeCarousel.addEventListener('pointerdown',stop,{passive:true});
 officeCarousel.addEventListener('click',stop);
 officeCarousel.addEventListener('mouseenter',()=>{hovered=true;clearTimeout(timer);});
 officeCarousel.addEventListener('mouseleave',()=>{hovered=false;schedule();});
 officeCarousel.addEventListener('focusin',()=>clearTimeout(timer));
 officeCarousel.addEventListener('focusout',()=>setTimeout(()=>schedule(),0));
 new IntersectionObserver(entries=>{visible=entries[0].intersectionRatio>=.5;schedule();},{threshold:[0,.5]}).observe(viewport);
 document.addEventListener('visibilitychange',()=>schedule());
 reduced.addEventListener('change',()=>schedule());

}

// Activities rotate only in view. Interaction stops autoplay until page refresh.
const activities=document.querySelector('.activities-carousel');
if(activities){
 const viewport=activities.querySelector('.activities-viewport'),track=activities.querySelector('.activity-grid');
 const cards=[...track.children],dots=activities.querySelector('.activity-pagination');
 const reduced=matchMedia('(prefers-reduced-motion: reduce)'),mobile=matchMedia('(max-width:760px)');
 let perPage=mobile.matches?1:3,page=0,stopped=false,visible=false,hovered=false,timer;
 const total=()=>Math.ceil(cards.length/perPage);
 function render(announce=false){
  track.style.transform=`translateX(-${page*(viewport.clientWidth+28)}px)`;
  cards.forEach((card,i)=>card.setAttribute('aria-hidden',String(Math.floor(i/perPage)!==page)));
  [...dots.children].forEach((dot,i)=>dot.setAttribute('aria-current',String(i===page)));
  if(announce)activities.querySelector('.activity-status').textContent=`Activities ${page*perPage+1} to ${Math.min((page+1)*perPage,cards.length)} of ${cards.length}`;
 }
 function schedule(){clearTimeout(timer);if(!stopped&&visible&&!hovered&&!document.hidden&&!reduced.matches&&!activities.contains(document.activeElement))timer=setTimeout(()=>{page=(page+1)%total();render();schedule();},8000);}
 function stop(){stopped=true;clearTimeout(timer);}
 function show(next){stop();page=(next+total())%total();render(true);}
 function rebuild(){
  const first=page*perPage;perPage=mobile.matches?1:3;page=Math.min(Math.floor(first/perPage),total()-1);
  dots.replaceChildren();for(let i=0;i<total();i++){const dot=document.createElement('button');dot.className='carousel-dot';dot.setAttribute('aria-label',`Show activities ${i*perPage+1} to ${Math.min((i+1)*perPage,cards.length)}`);dot.addEventListener('click',()=>show(i));dots.append(dot);}render();schedule();
 }
 activities.querySelector('.carousel-previous').addEventListener('click',()=>show(page-1));
 activities.querySelector('.carousel-next').addEventListener('click',()=>show(page+1));
 activities.addEventListener('click',stop);
 activities.addEventListener('pointerdown',stop,{passive:true});
 activities.addEventListener('mouseenter',()=>{hovered=true;schedule();});
 activities.addEventListener('mouseleave',()=>{hovered=false;schedule();});
 activities.addEventListener('focusin',()=>clearTimeout(timer));
 activities.addEventListener('focusout',()=>setTimeout(schedule,0));
 activities.addEventListener('keydown',e=>{stop();if(!['ArrowLeft','ArrowRight','Home','End'].includes(e.key))return;e.preventDefault();show(e.key==='Home'?0:e.key==='End'?total()-1:page+(e.key==='ArrowRight'?1:-1));if(e.target.classList.contains('carousel-dot'))dots.children[page].focus();});
 let touch=null;
 viewport.addEventListener('touchstart',e=>{stop();touch=e.touches.length===1?{x:e.touches[0].clientX,y:e.touches[0].clientY}:null;},{passive:true});
 viewport.addEventListener('touchend',e=>{if(!touch)return;const t=e.changedTouches[0],dx=t.clientX-touch.x,dy=t.clientY-touch.y;touch=null;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5)show(page+(dx<0?1:-1));},{passive:true});
 viewport.addEventListener('touchcancel',()=>touch=null,{passive:true});
 new IntersectionObserver(entries=>{visible=entries[0].isIntersecting;schedule();},{threshold:.5}).observe(viewport);
 new ResizeObserver(()=>render()).observe(viewport);
 mobile.addEventListener('change',rebuild);reduced.addEventListener('change',schedule);document.addEventListener('visibilitychange',schedule);rebuild();
}
