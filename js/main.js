// Theme toggle (pastel <-> muted palette), persisted across pages
document.addEventListener('DOMContentLoaded', function () {
  const root = document.documentElement;
  const themeBtn = document.getElementById('theme-toggle');
  const STORAGE_KEY = 'lf-theme';

  function applyTheme(theme) {
    if (theme === 'muted') {
      root.setAttribute('data-theme', 'muted');
      if (themeBtn) themeBtn.textContent = 'pastel palette';
    } else {
      root.removeAttribute('data-theme');
      if (themeBtn) themeBtn.textContent = 'muted palette';
    }
  }

  let saved = null;
  try { saved = localStorage.getItem(STORAGE_KEY); } catch (e) { /* storage unavailable */ }
  applyTheme(saved);

  if (themeBtn) {
    themeBtn.addEventListener('click', function () {
      const isMuted = root.getAttribute('data-theme') === 'muted';
      const next = isMuted ? 'pastel' : 'muted';
      applyTheme(next);
      try { localStorage.setItem(STORAGE_KEY, next); } catch (e) { /* storage unavailable */ }
    });
  }
});

// Floating petals — a handful of small drifting marks behind the content
document.addEventListener('DOMContentLoaded', function () {
  const layer = document.getElementById('petal-layer');
  if (!layer) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const marks = ['·', '✿', '·'];
  const count = window.innerWidth < 560 ? 7 : 12;

  for (let i = 0; i < count; i++) {
    const petal = document.createElement('span');
    petal.className = 'petal';
    petal.textContent = marks[Math.floor(Math.random() * marks.length)];
    petal.style.left = Math.random() * 100 + 'vw';
    petal.style.fontSize = (10 + Math.random() * 10) + 'px';
    const duration = 16 + Math.random() * 14;
    petal.style.animationDuration = duration + 's';
    petal.style.animationDelay = (Math.random() * duration * -1) + 's';
    layer.appendChild(petal);
  }
});

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
