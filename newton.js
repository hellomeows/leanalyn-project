// Newton's Method Visualizer
// x_{n+1} = x_n - f(x_n) / f'(x_n)

document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('newton-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const fnSelect = document.getElementById('newton-fn');
  const x0Input = document.getElementById('newton-x0');
  const runBtn = document.getElementById('newton-run');
  const tableBody = document.querySelector('#newton-table tbody');

  // function definitions: f and f'
  const functions = {
    'x2-2': {
      f: x => x * x - 2,
      fp: x => 2 * x,
      label: 'x² − 2',
      domain: [-3, 3]
    },
    'x3-x-2': {
      f: x => x * x * x - x - 2,
      fp: x => 3 * x * x - 1,
      label: 'x³ − x − 2',
      domain: [-2.5, 2.5]
    },
    'cosx-x': {
      f: x => Math.cos(x) - x,
      fp: x => -Math.sin(x) - 1,
      label: 'cos(x) − x',
      domain: [-2, 2]
    }
  };

  // coordinate transform helpers
  function makeTransform(domain, range, w, h, padding) {
    const [xMin, xMax] = domain;
    const [yMin, yMax] = range;
    const plotW = w - padding * 2;
    const plotH = h - padding * 2;

    function toPx(x, y) {
      const px = padding + ((x - xMin) / (xMax - xMin)) * plotW;
      const py = padding + (1 - (y - yMin) / (yMax - yMin)) * plotH;
      return [px, py];
    }
    return toPx;
  }

  function drawAxesAndCurve(fnDef) {
    const w = canvas.width;
    const h = canvas.height;
    const padding = 36;
    ctx.clearRect(0, 0, w, h);

    const domain = fnDef.domain;
    // sample function to find y range
    let yMin = Infinity, yMax = -Infinity;
    const samples = [];
    const steps = 200;
    for (let i = 0; i <= steps; i++) {
      const x = domain[0] + (domain[1] - domain[0]) * (i / steps);
      const y = fnDef.f(x);
      samples.push([x, y]);
      if (y < yMin) yMin = y;
      if (y > yMax) yMax = y;
    }
    const yPad = (yMax - yMin) * 0.15 || 1;
    yMin -= yPad;
    yMax += yPad;

    const toPx = makeTransform(domain, [yMin, yMax], w, h, padding);

    // grid
    ctx.strokeStyle = '#ECE4D6';
    ctx.lineWidth = 1;
    for (let gx = Math.ceil(domain[0]); gx <= domain[1]; gx++) {
      const [px] = toPx(gx, 0);
      ctx.beginPath();
      ctx.moveTo(px, padding);
      ctx.lineTo(px, h - padding);
      ctx.stroke();
    }

    // axes
    ctx.strokeStyle = '#3D3833';
    ctx.lineWidth = 1.4;
    const [zx, zy] = toPx(0, 0);
    ctx.beginPath();
    ctx.moveTo(padding, zy);
    ctx.lineTo(w - padding, zy);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(zx, padding);
    ctx.lineTo(zx, h - padding);
    ctx.stroke();

    // curve
    ctx.strokeStyle = '#57629A';
    ctx.lineWidth = 2.2;
    ctx.beginPath();
    samples.forEach(([x, y], i) => {
      const [px, py] = toPx(x, y);
      if (i === 0) ctx.moveTo(px, py);
      else ctx.lineTo(px, py);
    });
    ctx.stroke();

    return toPx;
  }

  function runNewton() {
    const fnKey = fnSelect.value;
    const fnDef = functions[fnKey];
    let x = parseFloat(x0Input.value);
    if (isNaN(x)) x = 1;

    const toPx = drawAxesAndCurve(fnDef);

    const iterations = [];
    let xn = x;
    const maxIter = 6;

    for (let i = 0; i < maxIter; i++) {
      const fxn = fnDef.f(xn);
      iterations.push({ n: i, x: xn, fx: fxn });

      const fpxn = fnDef.fp(xn);
      if (Math.abs(fpxn) < 1e-10) break;

      const xNext = xn - fxn / fpxn;

      // draw tangent line segment from (xn, fxn) to (xNext, 0)
      const [px1, py1] = toPx(xn, fxn);
      const [px2, py2] = toPx(xNext, 0);
      ctx.strokeStyle = '#C97A65';
      ctx.lineWidth = 1.3;
      ctx.setLineDash([4, 3]);
      ctx.beginPath();
      ctx.moveTo(px1, py1);
      ctx.lineTo(px2, py2);
      ctx.stroke();
      ctx.setLineDash([]);

      // draw point
      ctx.fillStyle = '#57629A';
      ctx.beginPath();
      ctx.arc(px1, py1, 3.5, 0, Math.PI * 2);
      ctx.fill();

      if (Math.abs(xNext - xn) < 1e-6) {
        xn = xNext;
        break;
      }
      xn = xNext;
    }

    // final point
    const [pfx, pfy] = toPx(xn, fnDef.f(xn));
    ctx.fillStyle = '#C97A65';
    ctx.beginPath();
    ctx.arc(pfx, pfy, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // populate table
    tableBody.innerHTML = '';
    iterations.forEach(row => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${row.n}</td><td>${row.x.toFixed(6)}</td><td>${row.fx.toFixed(6)}</td>`;
      tableBody.appendChild(tr);
    });
  }

  // fade the canvas out briefly, redraw, then fade back in — used both
  // for the run button and for toggling between example functions
  function runNewtonAnimated() {
    canvas.classList.add('is-switching');
    window.setTimeout(function () {
      runNewton();
      canvas.classList.remove('is-switching');
    }, 180);
  }

  runBtn.addEventListener('click', runNewtonAnimated);
  fnSelect.addEventListener('change', runNewtonAnimated);

  // initial draw (no fade on first load)
  runNewton();
});
