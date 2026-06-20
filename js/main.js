// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    toggle.addEventListener('click', function () {
      const isOpen = nav.classList.toggle('nav-open');
      toggle.setAttribute('aria-expanded', isOpen);
    });
  }
});
