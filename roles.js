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
 form.querySelectorAll('.filter-all').forEach(b=>b.setAttribute('aria-pressed',String(!chosen(b.dataset.clear).length)));const p=new URLSearchParams();if(search.value)p.set('q',search.value);countries.forEach(v=>p.append('country',v));areas.forEach(v=>p.append('area',v));hours.forEach(v=>p.append('hours',v));history.replaceState(null,'',location.pathname+(p.size?'?'+p:''));}
 function close(except){form.querySelectorAll('.role-filter').forEach(f=>{if(f===except)return;f.querySelector('.filter-trigger').setAttribute('aria-expanded','false');f.querySelector('.filter-options').hidden=true;});}
 form.querySelectorAll('.filter-trigger').forEach(b=>b.onclick=()=>{const f=b.closest('.role-filter'),open=b.getAttribute('aria-expanded')==='true';close();b.setAttribute('aria-expanded',String(!open));f.querySelector('.filter-options').hidden=open;});
 document.addEventListener('click',e=>{if(!e.target.closest('.role-filter'))close();});form.addEventListener('keydown',e=>{if(e.key==='Escape'){const f=e.target.closest('.role-filter');close();f?.querySelector('.filter-trigger').focus();}});
 form.addEventListener('submit',e=>e.preventDefault());search.addEventListener('input',render);form.addEventListener('change',render);
 function reset(){search.value='';form.querySelectorAll('input[type="checkbox"]').forEach(i=>i.checked=false);hourInputs.forEach(i=>i.checked=i.value==='');render();}
 form.querySelectorAll('.filter-all').forEach(b=>b.onclick=()=>{form.querySelectorAll(`input[name="${b.dataset.clear}"]`).forEach(i=>i.checked=false);render();});clear.onclick=reset;document.querySelector('#reset-empty').onclick=reset;rows.forEach(r=>r.addEventListener('click',()=>{try{sessionStorage.setItem('yopeso-role-search',JSON.stringify({query:location.search}));}catch{}}));render();
})();
