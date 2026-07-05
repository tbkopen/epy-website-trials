(function () {
  'use strict';

  var LABELS = {
    all: 'All Courses',
    available: 'Available Now',
    'coming-soon': 'Coming Soon',
    archived: 'Archived'
  };

  document.addEventListener('DOMContentLoaded', function () {
    var select = document.querySelector('[data-course-filter-select]');
    var grid = document.querySelector('[data-course-grid]');
    var title = document.querySelector('[data-course-filter-title]');
    var count = document.querySelector('[data-course-filter-count]');

    if (!select || !grid) return;

    var cards = grid.querySelectorAll('.course-card');
    var dividers = grid.querySelectorAll('[data-course-divider]');

    function apply(value) {
      var visible = 0;

      cards.forEach(function (card) {
        var match = value === 'all' || card.dataset.status === value;
        card.hidden = !match;
        if (match) visible += 1;
      });

      dividers.forEach(function (divider) {
        divider.hidden = value !== 'all';
      });

      grid.classList.toggle('course-grid--flat', value !== 'all');

      if (title) title.textContent = LABELS[value] || LABELS.all;
      if (count) count.textContent = visible + (visible === 1 ? ' course' : ' courses');
    }

    select.addEventListener('change', function () {
      apply(this.value);
    });
  });
}());
