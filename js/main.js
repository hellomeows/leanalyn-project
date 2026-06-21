// Mobile nav toggle
document.addEventListener('DOMContentLoaded', function () {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');

  if (toggle && nav) {
    const open = () => {
      nav.classList.add('nav-open');
      toggle.classList.add('is-open');
      toggle.textContent = '✕';
      toggle.setAttribute('aria-expanded', 'true');
    };
    const close = () => {
      nav.classList.remove('nav-open');
      toggle.classList.remove('is-open');
      toggle.textContent = '☰';
      toggle.setAttribute('aria-expanded', 'false');
    };

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('nav-open')) close();
      else open();
    });

    // close after picking a link, and if you click outside the menu
    nav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', close);
    });
    document.addEventListener('click', function (e) {
      if (!nav.classList.contains('nav-open')) return;
      if (nav.contains(e.target) || toggle.contains(e.target)) return;
      close();
    });
  }
});
