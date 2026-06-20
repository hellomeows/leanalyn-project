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
  const resultValue = document.getElementById('tvm-result-value');

  if (!calcBtn) return;

  function formatMoney(num) {
    return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  }

  calcBtn.addEventListener('click', function () {
    const rate = parseFloat(rateInput.value) / 100;
    const years = parseFloat(yearsInput.value);
    const solveFor = solveSelect.value;

    if (isNaN(rate) || isNaN(years)) {
      resultValue.textContent = 'enter a rate and number of years';
      return;
    }

    if (solveFor === 'fv') {
      const pv = parseFloat(pvInput.value);
      if (isNaN(pv)) {
        resultValue.textContent = 'enter a present value';
        return;
      }
      const fv = pv * Math.pow(1 + rate, years);
      resultValue.textContent = formatMoney(fv) + '  (Future Value)';
      fvInput.value = fv.toFixed(2);
    } else {
      const fv = parseFloat(fvInput.value);
      if (isNaN(fv)) {
        resultValue.textContent = 'enter a future value';
        return;
      }
      const pv = fv / Math.pow(1 + rate, years);
      resultValue.textContent = formatMoney(pv) + '  (Present Value)';
      pvInput.value = pv.toFixed(2);
    }
  });

  // toggle which input is "active" based on solve-for selection
  solveSelect.addEventListener('change', function () {
    if (solveSelect.value === 'fv') {
      fvInput.placeholder = 'will be calculated';
      pvInput.placeholder = 'e.g. 1000';
    } else {
      pvInput.placeholder = 'will be calculated';
      fvInput.placeholder = 'e.g. 1628.89';
    }
  });
});
