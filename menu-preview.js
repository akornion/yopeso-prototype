// Use a separate column for direct destinations on tablet; retain site order elsewhere.
const tabletMenu = matchMedia('(min-width:600px) and (max-width:1024px)');
const previewNav = document.querySelector('#navigation');
const directItems = [...previewNav.querySelectorAll(':scope > a, :scope > button:not(.nav-contact)')];
const contactItem = previewNav.querySelector('.nav-contact');
const originalItems = [...previewNav.children];
function arrangeMenu() {
  previewNav.replaceChildren(...originalItems);
  if (tabletMenu.matches) {
    const direct = document.createElement('div');
    direct.className = 'menu-direct';
    previewNav.prepend(direct);
    direct.append(...directItems);
    const contact = document.createElement('div');
    contact.className = 'menu-contact-row';
    previewNav.append(contact);
    contact.append(contactItem);
  }
}
const previewDestination = !toggle.querySelector('.menu-symbol');
if (!previewDestination) {
  arrangeMenu();
  tabletMenu.addEventListener('change', arrangeMenu);
}

// Preserve the preview through real page navigation, including section anchors.
const phoneMenu = matchMedia('(max-width:599px)');
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
  if (previewDestination) {
    toggle.innerHTML = phoneMenu.matches
      ? '<span class="menu-open-label">Menu</span><span class="menu-close-label">Close</span><span class="menu-symbol" aria-hidden="true"></span>'
      : originalToggle;
  }
  if (!phoneMenu.matches) {
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
phoneMenu.addEventListener('change', syncMobilePreview);
const menuViewport = matchMedia('(max-width:1024px)');
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
