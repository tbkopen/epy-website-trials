(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var trigger  = document.getElementById('search-trigger');
    var modal    = document.getElementById('search-modal');
    var backdrop = document.getElementById('search-backdrop');
    var closeBtn = document.getElementById('search-close');

    if (!trigger || !modal) return;

    var pagefindLoaded = false;

    function openSearch() {
      modal.hidden = false;
      trigger.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';

      if (!pagefindLoaded) {
        pagefindLoaded = true;
        loadPagefind();
      } else {
        focusInput();
      }
    }

    function closeSearch() {
      modal.hidden = true;
      trigger.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      trigger.focus();
    }

    function focusInput() {
      var input = modal.querySelector('input[type="search"], input[type="text"]');
      if (input) { setTimeout(function () { input.focus(); }, 50); }
    }

    function loadPagefind() {
      if (typeof PagefindUI === 'undefined') {
        // Load Pagefind UI bundle dynamically
        var script = document.createElement('script');
        script.src = '/pagefind/pagefind-ui.js';
        script.onload = function () { initPagefind(); };
        document.head.appendChild(script);
      } else {
        initPagefind();
      }
    }

    function initPagefind() {
      if (typeof PagefindUI === 'undefined') return;
      new PagefindUI({
        element: '#search-container',
        showImages: false,
        showEmptyFilters: false,
        resetStyles: true
      });
      focusInput();
    }

    trigger.addEventListener('click', openSearch);
    closeBtn.addEventListener('click', closeSearch);
    backdrop.addEventListener('click', closeSearch);

    document.addEventListener('keydown', function (e) {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        modal.hidden ? openSearch() : closeSearch();
      }
      if (e.key === 'Escape' && !modal.hidden) closeSearch();
    });
  });
})();
