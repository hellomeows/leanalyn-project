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

// Mini player — background music that resumes its position and play
// state across page loads, so it feels continuous while browsing.
// Edit TRACK_SRC and TRACK_TITLE below to point at your own audio file.
document.addEventListener('DOMContentLoaded', function () {
  const TRACK_SRC = 'assets/audio/now-playing.mp3'; // put your audio file here
  const TRACK_TITLE = 'add your track title';
  const STATE_KEY = 'lf-audio-state';

  const player = document.createElement('div');
  player.className = 'mini-player';
  player.innerHTML =
    '<button class="mini-player-toggle" id="mini-player-toggle" aria-label="Play music">\u25b6</button>' +
    '<div class="mini-player-info">' +
    '<span class="mini-player-label">now playing</span>' +
    '<span class="mini-player-title" id="mini-player-title">' + TRACK_TITLE + '</span>' +
    '</div>' +
    '<audio id="mini-player-audio" src="' + TRACK_SRC + '" loop preload="none"></audio>';
  document.body.appendChild(player);

  const audio = document.getElementById('mini-player-audio');
  const toggleBtn = document.getElementById('mini-player-toggle');

  function saveState(playing) {
    try {
      localStorage.setItem(STATE_KEY, JSON.stringify({
        time: audio.currentTime || 0,
        playing: playing,
      }));
    } catch (e) { /* storage unavailable */ }
  }

  function setIcon(playing) {
    toggleBtn.textContent = playing ? '\u23f8' : '\u25b6';
    toggleBtn.setAttribute('aria-label', playing ? 'Pause music' : 'Play music');
  }

  // restore saved position + play state from the previous page
  let saved = null;
  try { saved = JSON.parse(localStorage.getItem(STATE_KEY)); } catch (e) { /* none saved */ }

  if (saved && saved.time) {
    audio.addEventListener('loadedmetadata', function () {
      audio.currentTime = saved.time;
    }, { once: true });
  }

  if (saved && saved.playing) {
    // browsers may block this without a fresh user gesture on this
    // page — if so, the button just shows "paused" until tapped
    audio.play().then(function () {
      setIcon(true);
    }).catch(function () {
      setIcon(false);
    });
  }

  toggleBtn.addEventListener('click', function () {
    if (audio.paused) {
      audio.play().then(function () { setIcon(true); saveState(true); });
    } else {
      audio.pause();
      setIcon(false);
      saveState(false);
    }
  });

  // periodically checkpoint position while playing
  audio.addEventListener('timeupdate', function () {
    if (!audio.paused) saveState(true);
  });

  window.addEventListener('pagehide', function () {
    saveState(!audio.paused);
  });
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
