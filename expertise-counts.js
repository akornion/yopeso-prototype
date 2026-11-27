(() => {
  document.querySelectorAll('#capabilities .company-numbers, .story-hero .company-numbers').forEach(group => {
  const values = [...group.querySelectorAll('dd')];
  const originals = values.map(el => el.textContent.trim());
  const targets = originals.map(text => parseInt(text, 10));
  const suffixes = originals.map(text => text.replace(/^\d+/, ""));
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  if (motion.matches || targets.some(Number.isNaN)) return;
  let frame, stopped = false;
  const restore = () => {
    stopped = true;
    cancelAnimationFrame(frame);
    values.forEach((el, i) => el.textContent = originals[i]);
  };
  motion.addEventListener('change', event => { if (event.matches) restore(); });
  const run = index => {
    if (stopped || index === values.length) return;
    let start;
    const tick = time => {
      if (stopped) return;
      start ??= time;
      const progress = Math.min((time - start) / 1200, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      values[index].textContent = Math.round(targets[index] * eased) + suffixes[index];
      if (progress < 1) frame = requestAnimationFrame(tick);
      else { values[index].textContent = originals[index]; run(index + 1); }
    };
    frame = requestAnimationFrame(tick);
  };
  const observer = new IntersectionObserver(entries => {
    if (!entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= .5)) return;
    observer.disconnect();
    if (motion.matches || stopped) return;
    values.forEach((el, i) => {
      el.setAttribute('aria-label', originals[i]);
      el.style.fontVariantNumeric = 'tabular-nums';
      el.textContent = '0' + suffixes[i];
    });
    run(0);
  }, {threshold: .5});
  observer.observe(group);
  });
})();
