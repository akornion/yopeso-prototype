// Preserve native details/summary semantics while animating both directions.
(() => {
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  document.querySelectorAll('.dl-faq details').forEach(details => {
    const summary = details.querySelector('summary');
    let animation;
    let expanded = details.open;

    function settle() {
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
        animation = null;
      }
      details.open = expanded;
      details.style.height = '';
      details.style.overflow = '';
      details.classList.remove('is-closing');
    }

    summary.addEventListener('click', event => {
      event.preventDefault();
      const startHeight = details.getBoundingClientRect().height;
      expanded = !expanded;
      if (reducedMotion.matches || !details.animate) {
        settle();
        return;
      }
      if (animation) {
        animation.onfinish = null;
        animation.cancel();
      }
      details.open = true;
      details.classList.toggle('is-closing', !expanded);
      details.style.height = '';
      const style = getComputedStyle(details);
      const closedHeight = summary.getBoundingClientRect().height
        + parseFloat(style.paddingTop) + parseFloat(style.paddingBottom)
        + parseFloat(style.borderTopWidth) + parseFloat(style.borderBottomWidth);
      const endHeight = expanded ? details.getBoundingClientRect().height : closedHeight;
      details.style.overflow = 'hidden';
      animation = details.animate(
        [{ height: `${startHeight}px` }, { height: `${endHeight}px` }],
        { duration: 250, easing: 'ease-in-out' }
      );
      animation.onfinish = settle;
    });
    // Reflow naturally if the viewport or motion preference changes mid-transition.
    window.addEventListener('resize', () => { if (animation) settle(); });
    reducedMotion.addEventListener('change', () => { if (animation) settle(); });
  });
})();
