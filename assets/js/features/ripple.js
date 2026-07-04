(function () {
  'use strict';

  function createRipple(e) {
    var btn = e.currentTarget;
    var rect = btn.getBoundingClientRect();
    var size = Math.max(rect.width, rect.height) * 2;
    var x = (e.clientX - rect.left) - size / 2;
    var y = (e.clientY - rect.top)  - size / 2;

    var ripple = document.createElement('span');
    ripple.style.cssText = [
      'position:absolute',
      'border-radius:50%',
      'background:currentColor',
      'opacity:0.15',
      'pointer-events:none',
      'width:' + size + 'px',
      'height:' + size + 'px',
      'left:' + x + 'px',
      'top:' + y + 'px',
      'transform:scale(0)',
      'animation:ripple-expand 400ms cubic-bezier(0.2,0,0,1) forwards'
    ].join(';');

    btn.appendChild(ripple);
    ripple.addEventListener('animationend', function () { ripple.remove(); });
  }

  document.addEventListener('DOMContentLoaded', function () {
    if (!document.querySelector('style[data-ripple]')) {
      var style = document.createElement('style');
      style.setAttribute('data-ripple', '');
      style.textContent = '@keyframes ripple-expand { to { transform: scale(1); opacity: 0; } }';
      document.head.appendChild(style);
    }

    document.querySelectorAll('.btn, .icon-btn').forEach(function (el) {
      el.addEventListener('click', createRipple);
    });
  });
})();
