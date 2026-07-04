(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    var tocList = document.getElementById('toc-list');
    if (!tocList) return;

    var headings = Array.from(document.querySelectorAll('.prose h2, .prose h3, .prose h4'));
    if (!headings.length) { document.getElementById('toc').hidden = true; return; }

    // Build TOC links
    var links = headings.map(function (h, i) {
      if (!h.id) h.id = 'heading-' + i;

      var a = document.createElement('a');
      a.href = '#' + h.id;
      a.textContent = h.textContent;
      a.className = 'toc-' + h.tagName.toLowerCase();

      tocList.appendChild(a);
      return a;
    });

    // Highlight active heading with IntersectionObserver
    var activeLink = null;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var idx = headings.indexOf(entry.target);
        if (idx === -1) return;
        if (entry.isIntersecting) {
          if (activeLink) activeLink.removeAttribute('aria-current');
          activeLink = links[idx];
          activeLink.setAttribute('aria-current', 'true');
        }
      });
    }, {
      rootMargin: '-80px 0px -60% 0px',
      threshold: 0
    });

    headings.forEach(function (h) { observer.observe(h); });
  });
})();
