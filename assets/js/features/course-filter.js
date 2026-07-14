(function () {
  'use strict';

  var LABELS = {
    all: 'All Courses',
    available: 'Available Now',
    'coming-soon': 'Coming Soon'
    // archived: 'Archived'   // archived temporarily hidden
  };

  document.addEventListener('DOMContentLoaded', function () {
    var select = document.querySelector('[data-course-filter-select]');
    var grid = document.querySelector('[data-course-grid]');
    var title = document.querySelector('[data-course-filter-title]');
    var count = document.querySelector('[data-course-filter-count]');

    if (!select || !grid) return;

    var cards = grid.querySelectorAll('.course-card');
    var dividers = grid.querySelectorAll('[data-course-divider]');

    // Read/write the active filter in the URL (?show=...) so it survives a
    // page refresh and can be linked/bookmarked.
    function readFilter() {
      var value = new URLSearchParams(window.location.search).get('show');
      return LABELS.hasOwnProperty(value) ? value : 'all';
    }

    function writeFilter(value) {
      var url = new URL(window.location.href);
      if (value === 'all') {
        url.searchParams.delete('show');
      } else {
        url.searchParams.set('show', value);
      }
      history.replaceState(null, '', url);
    }

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
      writeFilter(this.value);
      apply(this.value);
    });

    // Restore the filter from the URL on load (e.g. after a refresh).
    var initial = readFilter();
    select.value = initial;
    apply(initial);
  });
}());
