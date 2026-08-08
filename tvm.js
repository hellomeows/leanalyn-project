// Time Value of Money calculator
// FV = PV * (1 + r)^n
// PV = FV / (1 + r)^n

document.addEventListener('DOMContentLoaded', function () {
  const pvInput = document.getElementById('tvm-pv');
  const fvInput = document.getElementById('tvm-fv');
  const rateInput = document.getElementById('tvm-rate');
  const yearsInput = document.getElementById('tvm-years');
  const solveSelect = document.getElementById('tvm-solve');
  const calcBtn = document.getElementById('tvm-calc');
  const resultBox = document.getElementById('tvm-result');
  const resultValue = document.getElementById('tvm-result-value');

  if (!calcBtn) return;

  function formatMoney(num) {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  function flashResult() {
    resultBox.classList.remove('result-pop');
    // restart the animation even if it's already running
    void resultBox.offsetWidth;
    resultBox.classList.add('result-pop');
  }

  calcBtn.addEventListener('click', function () {
    const rate = parseFloat(rateInput.value) / 100;
    const years = parseFloat(yearsInput.value);
    const solveFor = solveSelect.value;

    if (isNaN(rate) || isNaN(years)) {
      resultValue.textContent = 'enter a rate and number of years';
      flashResult();
      return;
    }

    if (solveFor === 'fv') {
      const pv = parseFloat(pvInput.value);
      if (isNaN(pv)) {
        resultValue.textContent = 'enter a present value';
        flashResult();
        return;
      }
      const fv = pv * Math.pow(1 + rate, years);
      resultValue.textContent = formatMoney(fv) + '  (Future Value)';
      fvInput.value = fv.toFixed(2);
    } else {
      const fv = parseFloat(fvInput.value);
      if (isNaN(fv)) {
        resultValue.textContent = 'enter a future value';
        flashResult();
        return;
      }
      const pv = fv / Math.pow(1 + rate, years);
      resultValue.textContent = formatMoney(pv) + '  (Present Value)';
      pvInput.value = pv.toFixed(2);
    }
    flashResult();
  });

  // toggle which field is the "computed" one — animate the swap so it's
  // clear at a glance which input is live and which one gets filled in
  function applySolveState() {
    const computingFv = solveSelect.value === 'fv';
    fvInput.closest('.field').classList.toggle('is-computed', computingFv);
    pvInput.closest('.field').classList.toggle('is-computed', !computingFv);

    if (computingFv) {
      fvInput.placeholder = 'will be calculated';
      pvInput.placeholder = 'e.g. 1000';
    } else {
      pvInput.placeholder = 'will be calculated';
      fvInput.placeholder = 'e.g. 1628.89';
    }
  }

  solveSelect.addEventListener('change', applySolveState);
  applySolveState();
});
