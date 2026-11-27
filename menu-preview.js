const contactItem = nav.querySelector('.nav-contact');

const menuViewport = matchMedia('(max-width:1024px)');
const backdrop = document.createElement('div');
backdrop.className = 'menu-backdrop';
backdrop.setAttribute('aria-hidden', 'true');
toggle.closest('header').after(backdrop);
backdrop.addEventListener('click', () => {
  closeNavigation();
  toggle.focus({ preventScroll: true });
});
function syncContactStyle() {
  contactItem.classList.toggle('nav-contact', !menuViewport.matches);
}
syncContactStyle();
menuViewport.addEventListener('change', syncContactStyle);
menuViewport.addEventListener('change', closeNavigation);
let openingScroll = null;
toggle.addEventListener('click', () => {
  if (toggle.getAttribute('aria-expanded') === 'false') openingScroll = window.scrollY;
}, true);
new MutationObserver(() => {
  if (toggle.getAttribute('aria-expanded') === 'false' && openingScroll !== null) {
    window.scrollTo({ top: openingScroll, behavior: 'instant' });
    openingScroll = null;
  }
}).observe(toggle, { attributes: true, attributeFilter: ['aria-expanded'] });
if (new URLSearchParams(location.search).has('menu') && menuViewport.matches) toggle.click();
