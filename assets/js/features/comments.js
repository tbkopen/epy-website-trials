(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var el = document.getElementById('remark42');
    if (!el) return;

    var host   = el.getAttribute('data-host');
    var siteId = el.getAttribute('data-site-id');
    var url    = el.getAttribute('data-url') || window.location.href;

    if (!host || !siteId) return;

    window.remark_config = {
      host:    host,
      site_id: siteId,
      url:     url,
      theme:   document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light',
      locale:  'en'
    };

    var script = document.createElement('script');
    script.src     = host + '/web/embed.js';
    script.async   = true;
    script.defer   = true;
    document.head.appendChild(script);

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
