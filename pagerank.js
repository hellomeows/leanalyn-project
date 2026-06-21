// PageRank Simulator
// Simple 5-node directed graph, iterative PageRank with damping factor

document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('pagerank-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const stepBtn = document.getElementById('pr-step');
  const resetBtn = document.getElementById('pr-reset');
  const tableBody = document.querySelector('#pagerank-table tbody');
  const iterCountEl = document.getElementById('pr-iter-count');

  const DAMPING = 0.85;

  // 5 pages: A, B, C, D, E
  // links: who each page points TO
  const pages = ['A', 'B', 'C', 'D', 'E'];
  const links = {
    A: ['B', 'C'],
    B: ['C'],
    C: ['A'],
    D: ['C'],
    E: ['C', 'D']
  };

  // fixed layout positions (pentagon)
  const positions = {
    A: [190, 50],
    B: [330, 140],
    C: [275, 290],
    D: [105, 290],
    E: [50, 140]
  };

  let ranks = {};       // authoritative current ranks
  let displayRanks = {}; // ranks actually drawn this frame (animated)
  let iteration = 0;
  let animFrame = null;

  function initRanks() {
    pages.forEach(p => ranks[p] = 1 / pages.length);
    displayRanks = Object.assign({}, ranks);
    iteration = 0;
  }

  function inboundLinks(page) {
    return pages.filter(p => links[p].includes(page));
  }

  function computeNextRanks() {
    const newRanks = {};
    pages.forEach(page => {
      let sum = 0;
      inboundLinks(page).forEach(src => {
        const outDegree = links[src].length || 1;
        sum += ranks[src] / outDegree;
      });
      newRanks[page] = (1 - DAMPING) / pages.length + DAMPING * sum;
    });
    return newRanks;
  }

  function highestRankPage(rankSet) {
    return pages.reduce((best, p) => rankSet[p] > rankSet[best] ? p : best, pages[0]);
  }

  function draw(rankSet) {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const maxRank = Math.max(...Object.values(rankSet));
    const minRadius = 16, maxRadius = 34;
    const topPage = highestRankPage(rankSet);

    // draw edges with arrowheads
    pages.forEach(src => {
      links[src].forEach(dst => {
        const [x1, y1] = positions[src];
        const [x2, y2] = positions[dst];
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const r2 = minRadius + (rankSet[dst] / maxRank) * (maxRadius - minRadius);
        const ex = x2 - Math.cos(angle) * (r2 + 2);
        const ey = y2 - Math.sin(angle) * (r2 + 2);
        const r1 = minRadius + (rankSet[src] / maxRank) * (maxRadius - minRadius);
        const sx = x1 + Math.cos(angle) * (r1 + 2);
        const sy = y1 + Math.sin(angle) * (r1 + 2);

        ctx.strokeStyle = '#C9C2B6';
        ctx.fillStyle = '#C9C2B6';
        ctx.lineWidth = 1.4;
        ctx.beginPath();
        ctx.moveTo(sx, sy);
        ctx.lineTo(ex, ey);
        ctx.stroke();

        // arrowhead
        const headLen = 8;
        ctx.beginPath();
        ctx.moveTo(ex, ey);
        ctx.lineTo(ex - headLen * Math.cos(angle - Math.PI / 6), ey - headLen * Math.sin(angle - Math.PI / 6));
        ctx.lineTo(ex - headLen * Math.cos(angle + Math.PI / 6), ey - headLen * Math.sin(angle + Math.PI / 6));
        ctx.closePath();
        ctx.fill();
      });
    });

    // draw nodes
    pages.forEach(page => {
      const [x, y] = positions[page];
      const radius = minRadius + (rankSet[page] / maxRank) * (maxRadius - minRadius);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = page === topPage ? '#C97A65' : '#57629A';
      ctx.fill();

      ctx.fillStyle = '#FAF6F0';
      ctx.font = '600 14px "Space Grotesk", sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(page, x, y);
    });
  }

  function updateTable() {
    tableBody.innerHTML = '';
    const sorted = [...pages].sort((a, b) => ranks[b] - ranks[a]);
    sorted.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${p}</td><td>${ranks[p].toFixed(4)}</td>`;
      tableBody.appendChild(tr);
    });
    iterCountEl.textContent = 'iteration: ' + iteration;
  }

  function pulseCanvas() {
    canvas.classList.add('is-pulsing');
    window.setTimeout(() => canvas.classList.remove('is-pulsing'), 250);
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  // smoothly interpolate node sizes from the old ranks to the new ranks
  // instead of snapping straight to the new values
  function animateTo(targetRanks, onDone) {
    if (animFrame) cancelAnimationFrame(animFrame);

    const startRanks = Object.assign({}, displayRanks);
    const duration = 420;
    const startTime = performance.now();

    function frame(now) {
      const t = Math.min(1, (now - startTime) / duration);
      const eased = easeOutCubic(t);

      pages.forEach(p => {
        displayRanks[p] = startRanks[p] + (targetRanks[p] - startRanks[p]) * eased;
      });
      draw(displayRanks);

      if (t < 1) {
        animFrame = requestAnimationFrame(frame);
      } else {
        displayRanks = Object.assign({}, targetRanks);
        animFrame = null;
        if (onDone) onDone();
      }
    }
    animFrame = requestAnimationFrame(frame);
  }

  stepBtn.addEventListener('click', function () {
    const target = computeNextRanks();
    pulseCanvas();
    animateTo(target, function () {
      ranks = target;
      iteration++;
      updateTable();
    });
  });

  resetBtn.addEventListener('click', function () {
    const target = {};
    pages.forEach(p => target[p] = 1 / pages.length);
    pulseCanvas();
    animateTo(target, function () {
      ranks = target;
      iteration = 0;
      updateTable();
    });
  });

  // initial state
  initRanks();
  draw(displayRanks);
  updateTable();
});
