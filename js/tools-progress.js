// Highlights the active tool in the sticky progress strip as you scroll
document.addEventListener('DOMContentLoaded', function () {
  const links = document.querySelectorAll('#tools-progress a');
  const sections = Array.from(links)
    .map(link => document.getElementById(link.dataset.tool))
    .filter(Boolean);

  if (!links.length || !sections.length || !('IntersectionObserver' in window)) return;

  function setActive(id) {
    links.forEach(link => {
      link.classList.toggle('is-active', link.dataset.tool === id);
    });
  }

  const observer = new IntersectionObserver((entries) => {
    // pick the section closest to the top of the viewport among visible ones
    const visible = entries.filter(e => e.isIntersecting);
    if (visible.length === 0) return;
    visible.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
    setActive(visible[0].target.id);
  }, {
    rootMargin: '-15% 0px -60% 0px',
    threshold: 0
  });

  sections.forEach(section => observer.observe(section));

  // set an initial active state on load
  setActive(sections[0].id);
});
