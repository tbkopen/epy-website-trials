(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.prose pre, .prose .highlight').forEach(function (block) {
      var pre = block.tagName === 'PRE' ? block : block.querySelector('pre') || block;
      pre.style.position = 'relative';

      // Language label from Rouge's language-xxx class
      var code = pre.querySelector('code') || pre;
      var langClass = (code.className || '').match(/language-(\w+)/);
      if (langClass) pre.setAttribute('data-lang', langClass[1]);

      var btn = document.createElement('button');
      btn.className = 'btn btn--tonal btn--sm copy-code-btn';
      btn.setAttribute('aria-label', 'Copy code');
      btn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">content_copy</span>';

      btn.addEventListener('click', function () {
        var code = pre.querySelector('code');
        var text = code ? code.textContent : pre.textContent;

        navigator.clipboard.writeText(text).then(function () {
          btn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">check</span>';
          btn.setAttribute('aria-label', 'Copied!');
          setTimeout(function () {
            btn.innerHTML = '<span class="material-symbols-outlined" aria-hidden="true">content_copy</span>';
            btn.setAttribute('aria-label', 'Copy code');
          }, 2000);
        });
      });

      pre.appendChild(btn);
    });
  });
})();
