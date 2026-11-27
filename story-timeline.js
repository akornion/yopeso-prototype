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

  milestoneToggle.addEventListener('click', () => {
    const collapsed = milestoneSection.toggleAttribute('data-collapsed');
    milestoneToggle.setAttribute('aria-expanded', String(!collapsed));
    label.textContent = collapsed ? moreLabel : 'Show fewer milestones';
    const target = collapsed ? milestoneToggle : firstExtra;
    target.focus({ preventScroll: true });
    target.scrollIntoView({ block: 'center', behavior: 'instant' });
  });
}
