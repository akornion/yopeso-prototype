(() => {
  const panel = document.querySelector('.lab-options');
  if (!panel) return;
  const options = [...panel.querySelectorAll(':scope > div')];
  if (options.length < 2) return;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const fade = 600;
  let timer, visible = false, previous = -1;
  const restore = () => options.forEach(option => option.classList.remove('lab-outcome-muted'));
  const choose = () => {
    const candidates = options.map((_, index) => index).filter(index => index !== previous);
    previous = candidates[Math.floor(Math.random() * candidates.length)];
    options.forEach((option, index) => option.classList.toggle('lab-outcome-muted', index !== previous));
    // Hold for three full seconds after the fade completes.
    timer = setTimeout(() => {
      restore();
      timer = setTimeout(choose, fade + 900);
    }, fade + 3000);
  };
  const sync = () => {
    clearTimeout(timer);
    restore();
    if (visible && !document.hidden && !reduced.matches) timer = setTimeout(choose, 1500);
  };
  new IntersectionObserver(entries => {
    visible = entries[0].isIntersecting;
    sync();
  }, {threshold: 0.35}).observe(panel);
  document.addEventListener('visibilitychange', sync);
  reduced.addEventListener('change', sync);
})();
