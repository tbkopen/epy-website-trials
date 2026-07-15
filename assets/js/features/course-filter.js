(function () {
  'use strict';

  var FILTERS = { all: 1, available: 1, 'coming-soon': 1 };

  document.addEventListener('DOMContentLoaded', function () {
    var group = document.querySelector('[data-course-filter]');
    var grid = document.querySelector('[data-course-grid]');

    if (!group || !grid) return;

    var buttons = group.querySelectorAll('[data-filter]');
    var cards = grid.querySelectorAll('.course-card');
    var dividers = grid.querySelectorAll('[data-course-divider]');

    // Read/write the active filter in the URL (?show=...) so it survives a
    // page refresh and can be linked/bookmarked.
    function readFilter() {
      var value = new URLSearchParams(window.location.search).get('show');
      return FILTERS.hasOwnProperty(value) ? value : 'all';
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
      cards.forEach(function (card) {
        var match = value === 'all' || card.dataset.status === value;
        card.hidden = !match;
      });

      // In "all" view the group dividers label each section; when a single
      // status is selected they're redundant, so hide them.
      dividers.forEach(function (divider) {
        divider.hidden = value !== 'all';
      });

      grid.classList.toggle('course-grid--flat', value !== 'all');

      buttons.forEach(function (btn) {
        var active = btn.dataset.filter === value;
        btn.classList.toggle('is-active', active);
        btn.setAttribute('aria-pressed', active ? 'true' : 'false');
      });
    }

    buttons.forEach(function (btn) {
      btn.addEventListener('click', function () {
        writeFilter(btn.dataset.filter);
        apply(btn.dataset.filter);
      });
    });

    // Restore the filter from the URL on load (e.g. after a refresh).
    apply(readFilter());
  });
}());
