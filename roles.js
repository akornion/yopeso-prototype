(()=>{
 const form=document.querySelector('.role-filters');
 if(!form){const back=document.querySelector('.roles-back');try{const saved=JSON.parse(sessionStorage.getItem('yopeso-role-search')||'null');if(back&&saved)back.href='open-roles.html'+saved.query;}catch{}return;}
 const search=document.querySelector('#role-search'),rows=[...document.querySelectorAll('.role-row')],clear=document.querySelector('#clear-filters');
 const params=new URLSearchParams(location.search);search.value=params.get('q')||'';
 const chosen=key=>[...form.querySelectorAll(`input[name="${key}"]:checked`)].map(i=>i.value).filter(Boolean);
 form.querySelectorAll('input[type="checkbox"]').forEach(i=>i.checked=params.getAll(i.name).includes(i.value));
 const hourInputs=[...form.querySelectorAll('input[name="hours"]')],requestedHours=params.getAll('hours'),hourValue=requestedHours.length===1&&hourInputs.some(i=>i.value===requestedHours[0])?requestedHours[0]:'';hourInputs.forEach(i=>i.checked=i.value===hourValue);
 function updateFilterText(){for(const key of ['country','area','hours']){const list=chosen(key),span=document.querySelector('#'+key+'-value'),button=span.closest('button');const all=({country:'All countries',area:'All areas of expertise',hours:'All working hours'})[key];span.textContent=list.length?list.join(', '):all;button.title=list.length?list.join(', '):all;let shown=list.length;while(shown>1&&span.scrollWidth>span.clientWidth){shown--;span.textContent=list.slice(0,shown).join(', ')+` +${list.length-shown}`;}}}
 window.addEventListener('resize',updateFilterText);
 function render(){const countries=chosen('country'),areas=chosen('area'),hours=chosen('hours'),terms=search.value.trim().toLowerCase().split(/\s+/).filter(Boolean);const matched=rows.filter(r=>terms.every(t=>(r.querySelector('h2').textContent+' '+r.dataset.area).toLowerCase().includes(t))&&(!countries.length||countries.some(c=>r.dataset.country.split('|').includes(c)))&&(!areas.length||areas.includes(r.dataset.area))&&(!hours.length||hours.includes(r.dataset.hours)));rows.forEach(row=>{row.hidden=!matched.includes(row);});
 const filtered=Boolean(terms.length||countries.length||areas.length||hours.length);document.querySelector('#role-count').textContent=matched.length+' '+(matched.length===1?'role':'roles')+' '+(filtered?'found':'available');document.querySelector('#no-roles').hidden=matched.length!==0;clear.hidden=!(search.value||countries.length||areas.length||hours.length);

 updateFilterText();
 form.querySelectorAll('.filter-all').forEach(b=>b.setAttribute('aria-pressed',String(!chosen(b.dataset.clear).length)));if(!form.querySelector('.filter-trigger[aria-expanded="true"]'))syncUrl();}
 function syncUrl(){const countries=chosen('country'),areas=chosen('area'),hours=chosen('hours');const p=new URLSearchParams();if(search.value)p.set('q',search.value);countries.forEach(v=>p.append('country',v));areas.forEach(v=>p.append('area',v));hours.forEach(v=>p.append('hours',v));const query=p.size?'?'+p:'';if(location.search!==query)history.replaceState(history.state,'',location.pathname+query+location.hash);}
 function close(){const active=form.querySelector('.filter-trigger[aria-expanded="true"]');if(!active)return;const f=active.closest('.role-filter');f.querySelector('.filter-trigger').setAttribute('aria-expanded','false');const panel=f.querySelector('.filter-options');animatePopup(panel,false,panel.classList.contains('opens-above')?-1:1);}
 function fitOpenFilter(){
  const panel=form.querySelector('.filter-trigger[aria-expanded="true"]')?.closest('.role-filter').querySelector('.filter-options');
  if(!panel)return;
  const trigger=panel.closest('.role-filter').querySelector('.filter-trigger').getBoundingClientRect();
  const headerBottom=document.querySelector('header').getBoundingClientRect().bottom;
  const above=trigger.top-Math.max(0,headerBottom)-16;
  const below=window.innerHeight-trigger.bottom-16;
  const choices=panel.querySelector('.filter-choices');
  const naturalHeight=choices.scrollHeight+panel.querySelector('.filter-footer').offsetHeight+panel.offsetHeight-panel.clientHeight+16;
  const opensAbove=below<naturalHeight && above>below;
  panel.classList.toggle('opens-above',opensAbove);
  panel.style.setProperty('--panel-room',Math.max(0,opensAbove?above:below)+'px');
 }
 window.addEventListener('resize',fitOpenFilter);
 window.addEventListener('scroll',fitOpenFilter,{passive:true});
 form.querySelectorAll('.filter-trigger').forEach(b=>b.onclick=()=>{const f=b.closest('.role-filter'),open=b.getAttribute('aria-expanded')==='true';close();b.setAttribute('aria-expanded',String(!open));if(!open){const panel=f.querySelector('.filter-options');panel.hidden=false;fitOpenFilter();if(!popupMotion.has(panel))panel.hidden=true;animatePopup(panel,true,panel.classList.contains('opens-above')?-1:1);}});
 form.querySelectorAll('.filter-done').forEach(button=>button.addEventListener('click',()=>{
  const trigger=button.closest('.role-filter').querySelector('.filter-trigger');
  close();
  trigger.focus({preventScroll:true});
 }));
 document.addEventListener('click',e=>{if(!e.target.closest('.role-filter'))close();});form.addEventListener('keydown',e=>{if(e.key==='Escape'){const f=e.target.closest('.role-filter');close();f?.querySelector('.filter-trigger').focus({preventScroll:true});}});
 form.addEventListener('submit',e=>e.preventDefault());search.addEventListener('input',render);form.addEventListener('change',render);
 function reset(){search.value='';form.querySelectorAll('input[type="checkbox"]').forEach(i=>i.checked=false);hourInputs.forEach(i=>i.checked=i.value==='');render();}
 form.querySelectorAll('.filter-all').forEach(b=>b.onclick=()=>{form.querySelectorAll(`input[name="${b.dataset.clear}"]`).forEach(i=>i.checked=false);render();});clear.onclick=reset;document.querySelector('#reset-empty').onclick=reset;rows.forEach(r=>r.addEventListener('click',()=>{syncUrl();try{sessionStorage.setItem('yopeso-role-search',JSON.stringify({query:location.search}));}catch{}}));render();
})();
