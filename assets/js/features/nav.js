(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var toggle = document.getElementById('nav-toggle');
    var nav    = document.getElementById('primary-nav');
    if (!toggle || !nav) return;

    var focusableSelectors = 'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])';

    function openNav() {
      nav.classList.add('site-nav--open');
      toggle.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
      trapFocus(nav);
    }

    function closeNav() {
      nav.classList.remove('site-nav--open');
      toggle.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
      toggle.focus();
    }

    function trapFocus(el) {
      var focusable = Array.from(el.querySelectorAll(focusableSelectors));
      if (!focusable.length) return;
      var first = focusable[0];
      var last  = focusable[focusable.length - 1];

      function handler(e) {
        if (e.key !== 'Tab') return;
        if (e.shiftKey) {
          if (document.activeElement === first) { e.preventDefault(); last.focus(); }
        } else {
          if (document.activeElement === last)  { e.preventDefault(); first.focus(); }
        }
      }

      el._trapHandler = handler;
      el.addEventListener('keydown', handler);
    }

    toggle.addEventListener('click', function () {
      if (nav.classList.contains('site-nav--open')) {
        closeNav();
      } else {
        openNav();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('site-nav--open')) closeNav();
    });

    // Close when clicking a nav link on mobile
    nav.querySelectorAll('.site-nav__link').forEach(function (link) {
      link.addEventListener('click', function () {
        if (nav.classList.contains('site-nav--open')) closeNav();
      });
    });
  });
})();
