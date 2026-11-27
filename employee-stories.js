const teamQuotes = [
  "After one of the hiring interviews at Yopeso, I closed the laptop and said: \"I found my people\". 6 months in and this phrase has not only stuck with me, but was proven time and time again that I was right. All the colleagues I met are smart, hard working, well rounded professionals, who are truly leading by example.",
  "The trust. You're given ownership of real work and the freedom to decide how to do it, not just a list of tasks. Teams talk openly, and there's room to try new tech and grow along the way.",
  "It’s having the space to do your job and actually live your life.",
  "Life at Yopeso feels good. It's chill, simple, logical, organized, and efficient. There are many things I'm grateful for.",
  "I love that Yopeso trusts that its employees are mature, continously growing individuals who know their job and work in good faith. That level of confidence pushes me to learn more, contribute more and offer help whenever and wherever I can.",
  "Life at Yopeso is flexible, friendly, and highly supportive, offering a great balance between professional work and personal time. You get to work with an incredibly helpful global team on diverse international projects. While it has the standard pacing and shifting priorities of an outsourcing environment, the atmosphere remains welcoming and relaxed."
];
const preview = document.querySelector('.team-quote-preview blockquote');
if (preview) {
  const index = Math.floor(Math.random() * teamQuotes.length);
  preview.textContent = '“' + teamQuotes[index] + '”';
}

document.querySelectorAll('.team-quote-carousel').forEach(carousel => {
  const track = carousel.querySelector('.team-quote-track');
  if (document.body.classList.contains('life-page')) {
    [...track.children].forEach((quote, index) => {
      const card = document.createElement('article');
      card.className = 'team-quote story-scroll-card';
      const frame = document.createElement('div');
      frame.className = 'story-scroll-frame';
      const scroller = document.createElement('div');
      scroller.className = 'story-scroll';
      scroller.setAttribute('role', 'region');
      scroller.setAttribute('aria-label', 'Colleague testimonial ' + (index + 1));
      quote.replaceWith(card);
      quote.className = 'story-scroll-text';
      scroller.append(quote);
      frame.append(scroller);
      card.append(frame);
      const rail = document.createElement('div');
      rail.className = 'story-scroll-rail';
      rail.setAttribute('aria-hidden', 'true');
      const thumb = document.createElement('div');
      thumb.className = 'story-scroll-thumb';
      rail.append(thumb);
      frame.append(rail);
      let drag;
      rail.addEventListener('pointerdown', event => {
        event.preventDefault();
        const bounds = rail.getBoundingClientRect();
        const thumbHeight = thumb.getBoundingClientRect().height;
        const travel = bounds.height - thumbHeight;
        if (event.target !== thumb) scroller.scrollTop = Math.max(0, Math.min(travel, event.clientY - bounds.top - thumbHeight / 2)) / travel * (scroller.scrollHeight - scroller.clientHeight);
        drag = {y:event.clientY, top:scroller.scrollTop};
        rail.setPointerCapture(event.pointerId);
      });
      rail.addEventListener('pointermove', event => {
        if (!drag) return;
        const travel = rail.clientHeight - thumb.offsetHeight;
        if (travel > 0) scroller.scrollTop = drag.top + (event.clientY - drag.y) / travel * (scroller.scrollHeight - scroller.clientHeight);
      });
      rail.addEventListener('pointerup', () => { drag = null; });
      rail.addEventListener('pointercancel', () => { drag = null; });
      const update = () => {
        const quoteStyle = getComputedStyle(quote);
        const textHeight = quote.getBoundingClientRect().height - parseFloat(quoteStyle.paddingTop) - parseFloat(quoteStyle.paddingBottom);
        const overflowing = textHeight + 56 > scroller.clientHeight + 1;
        frame.classList.toggle('is-overflowing', overflowing);
        scroller.tabIndex = overflowing ? 0 : -1;
        rail.hidden = !overflowing;
        const thumbHeight = Math.max(24, scroller.clientHeight / scroller.scrollHeight * rail.clientHeight);
        thumb.style.height = thumbHeight + 'px';
        const progress = overflowing ? scroller.scrollTop / (scroller.scrollHeight - scroller.clientHeight) : 0;
        thumb.style.transform = 'translateY(' + (progress * (rail.clientHeight - thumbHeight)) + 'px)';
        frame.classList.toggle('is-overflowing', overflowing);
      };
      scroller.addEventListener('scroll', update, {passive:true});
      scroller.addEventListener('wheel', event => {
        if (scroller.scrollHeight <= scroller.clientHeight + 1) return;
        const atTop = scroller.scrollTop <= 0;
        const atBottom = scroller.scrollTop + scroller.clientHeight >= scroller.scrollHeight - 1;
        if ((event.deltaY < 0 && atTop) || (event.deltaY > 0 && atBottom)) event.preventDefault();
      }, {passive:false});
      new ResizeObserver(update).observe(scroller);
      document.fonts.ready.then(update);
    });
  }
  const cards = [...track.children];
  const viewport = carousel.querySelector('.team-quote-viewport');
  const controls = carousel.querySelector('.carousel-controls');
  const dots = controls.querySelector('.carousel-dots');
  const status = carousel.querySelector('[aria-live]');
  const desktop = matchMedia('(min-width: 1001px)');
  const tablet = matchMedia('(min-width: 761px)');
  let perPage = 1;
  let page = 0;

  function show(next, announce = true) {
    const count = track.children.length;
    page = (next + count) % count;
    track.style.transform = 'translateX(-' + (page * 100) + '%)';
    [...track.children].forEach((group, i) => { group.inert = i !== page; });
    [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === page)));
    if (announce) status.textContent = 'Quotes ' + (page * perPage + 1) + ' to ' +
      Math.min(cards.length, (page + 1) * perPage) + ' of ' + cards.length;
  }

  function layout() {
    const first = page * perPage;
    perPage = desktop.matches ? 3 : tablet.matches ? 2 : 1;
    track.replaceChildren();
    dots.replaceChildren();
    for (let start = 0; start < cards.length; start += perPage) {
      const group = document.createElement('div');
      group.className = 'team-quote-page';
      group.append(...cards.slice(start, start + perPage));
      track.append(group);
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Show quotes starting at ' + (start + 1));
      dot.addEventListener('click', () => show(start / perPage));
      dots.append(dot);
    }
    controls.hidden = track.children.length < 2;
    show(Math.floor(first / perPage), false);
  }

  controls.querySelector('.carousel-previous').onclick = () => show(page - 1);
  controls.querySelector('.carousel-next').onclick = () => show(page + 1);
  let touch;
  viewport.addEventListener('touchstart', e => { touch = e.touches[0]; }, {passive:true});
  viewport.addEventListener('touchend', e => {
    if (!touch) return;
    const dx = e.changedTouches[0].clientX - touch.clientX;
    const dy = e.changedTouches[0].clientY - touch.clientY;
    if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) show(page + (dx < 0 ? 1 : -1));
    touch = null;
  });
  desktop.addEventListener('change', layout);
  tablet.addEventListener('change', layout);
  layout();
});
