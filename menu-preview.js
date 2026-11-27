const previewDestination = !toggle.querySelector('.menu-symbol');
const contactItem = nav.querySelector('.nav-contact');

// Preserve the preview through real page navigation, including section anchors.
const menuViewport = matchMedia('(max-width:1024px)');
const backdrop = document.createElement('div');
backdrop.className = 'menu-backdrop';
backdrop.setAttribute('aria-hidden', 'true');
toggle.closest('header').after(backdrop);
backdrop.addEventListener('click', () => {
  closeNavigation();
  toggle.focus({ preventScroll: true });
});
const originalToggle = toggle.innerHTML;
const previewLinks = new Map();
function syncMobilePreview() {
  contactItem.classList.toggle('nav-contact', !menuViewport.matches);
  if (previewDestination) {
    toggle.innerHTML = menuViewport.matches
      ? '<span class="menu-open-label">Menu</span><span class="menu-close-label">Close</span><span class="menu-symbol" aria-hidden="true"></span>'
      : originalToggle;
  }
  if (!menuViewport.matches) {
    for (const [link, href] of previewLinks) link.setAttribute('href', href);
    previewLinks.clear();
    return;
  }
  for (const link of document.querySelectorAll('a[href]')) {
    const href = link.getAttribute('href');
    const url = new URL(href, location.href);
    if (href.startsWith('#') || url.origin !== location.origin || !url.pathname.endsWith('.html')) continue;
    previewLinks.set(link, href);
    url.searchParams.set('nav', 'mobile');
    link.href = url.href;
  }
}
syncMobilePreview();
menuViewport.addEventListener('change', syncMobilePreview);
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
