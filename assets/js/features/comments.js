(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('remark42');
    if (!el || el.dataset.remarkInit === '1') return;

    var host   = el.getAttribute('data-host');
    var siteId = el.getAttribute('data-site-id');
    var url    = el.getAttribute('data-url') || window.location.href;
    var status = el.querySelector('[data-comments-status]');

    if (!host || !siteId) return;
    el.dataset.remarkInit = '1';

    function setStatus(msg) { if (status) status.textContent = msg; }
    function clearStatus() { if (status && status.parentNode) status.parentNode.removeChild(status); }

    window.remark_config = {
      host:    host,
      site_id: siteId,
      url:     url,
      theme:   document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
      locale:  'en'
    };

    var script = document.createElement('script');
    script.src   = host + '/web/embed.js';
    script.async = true;
    script.defer = true;

    // If the embed script itself can't load (server down, blocked, mixed
    // content), degrade to a message instead of leaving a blank section.
    script.onerror = function () {
      setStatus('Comments are temporarily unavailable.');
    };

    document.head.appendChild(script);

    // Remark42 renders into #remark42 once initialised. Poll briefly and remove
    // the "Loading…" placeholder on success; give up (with a message) if the
    // widget never mounts within the timeout.
    var waited = 0;
    var poll = setInterval(function () {
      if (window.REMARK42) {
        clearInterval(poll);
        clearStatus();
      } else if ((waited += 500) >= 15000) {
        clearInterval(poll);
        setStatus('Comments are temporarily unavailable.');
      }
    }, 500);

    // Sync Remark42 theme with site theme changes
    var observer = new MutationObserver(function () {
      var theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      if (window.REMARK42 && window.REMARK42.changeTheme) {
        window.REMARK42.changeTheme(theme);
      }
    });

    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
  });
})();
