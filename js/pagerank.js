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

  let ranks = {};
  let iteration = 0;

  function initRanks() {
    pages.forEach(p => ranks[p] = 1 / pages.length);
    iteration = 0;
  }

  function inboundLinks(page) {
    return pages.filter(p => links[p].includes(page));
  }

  function step() {
    const newRanks = {};
    pages.forEach(page => {
      let sum = 0;
      inboundLinks(page).forEach(src => {
        const outDegree = links[src].length || 1;
        sum += ranks[src] / outDegree;
      });
      newRanks[page] = (1 - DAMPING) / pages.length + DAMPING * sum;
    });
    ranks = newRanks;
    iteration++;
  }

  function highestRankPage() {
    return pages.reduce((best, p) => ranks[p] > ranks[best] ? p : best, pages[0]);
  }

  function draw() {
    const w = canvas.width;
    const h = canvas.height;
    ctx.clearRect(0, 0, w, h);

    const maxRank = Math.max(...Object.values(ranks));
    const minRadius = 16, maxRadius = 34;
    const topPage = highestRankPage();

    // draw edges with arrowheads
    pages.forEach(src => {
      links[src].forEach(dst => {
        const [x1, y1] = positions[src];
        const [x2, y2] = positions[dst];
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const r2 = minRadius + (ranks[dst] / maxRank) * (maxRadius - minRadius);
        const ex = x2 - Math.cos(angle) * (r2 + 2);
        const ey = y2 - Math.sin(angle) * (r2 + 2);
        const r1 = minRadius + (ranks[src] / maxRank) * (maxRadius - minRadius);
        const sx = x1 + Math.cos(angle) * (r1 + 2);
        const sy = y1 + Math.sin(angle) * (r1 + 2);

        ctx.strokeStyle = '#B9B6AE';
        ctx.fillStyle = '#B9B6AE';
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
      const radius = minRadius + (ranks[page] / maxRank) * (maxRadius - minRadius);

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = page === topPage ? '#D6614A' : '#2E3A6E';
      ctx.fill();

      ctx.fillStyle = '#F7F5F0';
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

  stepBtn.addEventListener('click', function () {
    step();
    draw();
    updateTable();
  });

  resetBtn.addEventListener('click', function () {
    initRanks();
    draw();
    updateTable();
  });

  // initial state
  initRanks();
  draw();
  updateTable();
});
