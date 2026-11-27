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
arrangeMenu();
tabletMenu.addEventListener('change', arrangeMenu);
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
