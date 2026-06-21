// Sticky note stack — click a note to swipe it away and reveal the next one,
// looping back to the start once you've gone through all of them.

document.addEventListener('DOMContentLoaded', function () {
  const stack = document.getElementById('sticky-stack');
  if (!stack) return;

  const notes = Array.from(stack.querySelectorAll('.sticky-note'));
  const dots = Array.from(document.querySelectorAll('#sticky-dots .dot'));
  const total = notes.length;

  // order[0] is the index (into `notes`) of the note currently on top
  let order = notes.map((_, i) => i);
  let animating = false;

  function setHeight() {
    const activeEl = notes[order[0]];
    // measure natural height of the active note's content
    const prevPosition = activeEl.style.position;
    stack.style.minHeight = Math.max(activeEl.scrollHeight, 220) + 'px';
  }

  function render() {
    order.forEach((noteIdx, pos) => {
      const el = notes[noteIdx];
      el.classList.remove('pos-0', 'pos-1', 'pos-2', 'pos-hidden', 'leaving');
      if (pos === 0) {
        el.classList.add('pos-0');
        el.setAttribute('aria-label', `Note ${noteIdx + 1} of ${total}, click for next`);
      } else if (pos === 1) {
        el.classList.add('pos-1');
      } else if (pos === 2) {
        el.classList.add('pos-2');
      } else {
        el.classList.add('pos-hidden');
      }
    });
    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === order[0]);
    });
    setHeight();
  }

  function advance() {
    if (animating) return;
    animating = true;

    const activeEl = notes[order[0]];
    activeEl.classList.add('leaving');

    window.setTimeout(function () {
      order.push(order.shift());
      render();
      animating = false;
    }, 450);
  }

  notes.forEach(note => {
    note.addEventListener('click', function (e) {
      // let links inside a note navigate normally instead of advancing
      if (e.target.closest('a')) return;
      advance();
    });
    note.addEventListener('keydown', function (e) {
      if (e.target.closest('a')) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        advance();
      }
    });
  });

  render();
});
