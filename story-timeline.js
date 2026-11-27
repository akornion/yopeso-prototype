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

  milestoneToggle.addEventListener('click', async () => {
    if (milestoneSection.hasAttribute('data-collapsing')) return;
    if (!milestoneSection.hasAttribute('data-collapsed')) {
      milestoneSection.dataset.collapsing = '';
      const exit = firstExtra.getAnimations().find(animation => animation.animationName === 'milestone-exit');
      if (exit) await Promise.allSettled([exit.finished]);
    }
    const buttonTop = milestoneToggle.getBoundingClientRect().top;
    const collapsed = milestoneSection.toggleAttribute('data-collapsed');
    milestoneSection.removeAttribute('data-collapsing');
    milestoneToggle.setAttribute('aria-expanded', String(!collapsed));
    label.textContent = collapsed ? moreLabel : 'Show fewer milestones';
    const target = collapsed ? milestoneToggle : firstExtra;
    if (milestoneToggle.getClientRects().length) {
      target.focus({ preventScroll: true });
      if (collapsed) {
        window.scrollBy({ top: target.getBoundingClientRect().top - buttonTop, behavior: 'instant' });
      } else {
        target.scrollIntoView({ block: 'center', behavior: 'instant' });
      }
    }
  });
}
