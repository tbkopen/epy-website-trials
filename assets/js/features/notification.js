(function () {
  'use strict';

  var STORAGE_KEY = 'elastropy-alert-dismissed';
  var bar = document.querySelector('.alert-bar');
  if (!bar) return;

  // Identity of the current announcement — dismissing remembers this exact value,
  // so changing the text/button in _pages/notification.md re-shows the bar.
  var current = bar.getAttribute('data-alert-key') || '';

  var dismissed = '';
  try { dismissed = localStorage.getItem(STORAGE_KEY) || ''; } catch (e) {}

  // Already dismissed this exact announcement — hide before it can be interacted with.
  if (current && dismissed === current) {
    bar.hidden = true;
    return;
  }

  var closeBtn = document.getElementById('alert-bar-close');
  if (!closeBtn) return;

  closeBtn.addEventListener('click', function () {
    bar.hidden = true;
    try { localStorage.setItem(STORAGE_KEY, current); } catch (e) {}
  });
})();
