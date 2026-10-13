(function () {
  'use strict';

  var buttons = document.querySelectorAll('.filters__btn');
  var rows = document.querySelectorAll('#rows tr');
  var count = document.getElementById('count');

  /* filter the orders table by status */
  function apply(status) {
    var shown = 0;
    rows.forEach(function (row) {
      var match = status === 'all' || row.getAttribute('data-status') === status;
      row.hidden = !match;
      if (match) shown++;
    });
    count.textContent = 'Showing ' + shown + ' of ' + rows.length + ' orders';
  }

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      buttons.forEach(function (b) {
        var on = b === btn;
        b.classList.toggle('is-on', on);
        b.setAttribute('aria-pressed', String(on));
      });
      apply(btn.getAttribute('data-filter'));
    });
  });
})();
