const milestoneSection = document.querySelector('#milestones');
const milestoneToggle = milestoneSection.querySelector('.story-timeline-toggle');
const extraMilestones = [...milestoneSection.querySelectorAll('.story-timeline > li')].slice(3);

if (extraMilestones.length) {
  const label = milestoneToggle.querySelector('span');
  const moreLabel = `Show ${extraMilestones.length} more ${extraMilestones.length === 1 ? 'milestone' : 'milestones'}`;
  for (const item of extraMilestones) item.dataset.extraMilestone = '';
  const firstExtra = extraMilestones[0];
  firstExtra.tabIndex = -1;
  milestoneSection.dataset.collapsed = '';
  label.textContent = moreLabel;
  milestoneToggle.hidden = false;

  const list = document.querySelector('#milestone-list');
  const motion = window.matchMedia('(max-width: 760px) and (prefers-reduced-motion: no-preference)');
  let animation;
  motion.addEventListener('change', () => animation?.cancel());

  milestoneToggle.addEventListener('click', async () => {
    if (milestoneSection.hasAttribute('data-collapsing')) return;
    const buttonTop = milestoneToggle.getBoundingClientRect().top;
    const initialHeight = list.getBoundingClientRect().height;
    animation?.cancel();
    const collapsed = milestoneSection.toggleAttribute('data-collapsed');
    const finalHeight = list.getBoundingClientRect().height;

    function keepButtonInPlace() {
      if (milestoneToggle.getClientRects().length) {
        window.scrollBy({ top: milestoneToggle.getBoundingClientRect().top - buttonTop, behavior: 'instant' });
      }
    }

    if (motion.matches) {
      if (collapsed) {
        // Keep the rows visible inside the shrinking list until the fold finishes.
        milestoneSection.removeAttribute('data-collapsed');
        milestoneSection.dataset.collapsing = '';
      }
      animation = list.animate(
        [{ height: initialHeight + 'px' }, { height: finalHeight + 'px' }],
        { duration: 320, easing: 'ease-in-out', fill: collapsed ? 'forwards' : 'none' }
      );
      if (collapsed) {
        let frame;
        function followFold() {
          keepButtonInPlace();
          frame = requestAnimationFrame(followFold);
        }
        followFold();
        await Promise.allSettled([animation.finished]);
        cancelAnimationFrame(frame);
        milestoneSection.dataset.collapsed = '';
        milestoneSection.removeAttribute('data-collapsing');
        animation.cancel();
      }
    }
    milestoneToggle.setAttribute('aria-expanded', String(!collapsed));
    label.textContent = collapsed ? moreLabel : 'Show fewer milestones';
    if (milestoneToggle.getClientRects().length) {
      (collapsed ? milestoneToggle : firstExtra).focus({ preventScroll: true });
      if (collapsed) keepButtonInPlace();
    }
  });
}
