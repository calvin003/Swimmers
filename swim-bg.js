/* Tiny background swimmers — shared by index.html and leaderboard.html.
   Injects a fixed full-screen layer of small animated sperm drifting across
   the page. Sits behind <main> (z-index 0) like the big bg-swimmer. */
(function(){
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var COUNT = 80;
  var COLORS = ['#a9d3ea', '#8fb9d6', '#bcd9ec', '#9ec6e0'];

  var style = document.createElement('style');
  style.textContent = [
    '.micro-swimmers{position:fixed;inset:0;z-index:0;pointer-events:none;overflow:hidden}',
    '.micro-swimmers .ms{position:absolute;left:0;top:0;will-change:transform;',
    '  animation-name:ms-swim;animation-timing-function:linear;animation-iteration-count:infinite}',
    '.micro-swimmers .ms-bob{animation:ms-bob ease-in-out infinite alternate}',
    '@keyframes ms-swim{from{transform:translateX(-8vw)}to{transform:translateX(108vw)}}',
    '@keyframes ms-bob{from{transform:translateY(-14px) rotate(-4deg)}to{transform:translateY(14px) rotate(4deg)}}'
  ].join('\n');
  document.head.appendChild(style);

  var layer = document.createElement('div');
  layer.className = 'micro-swimmers';
  layer.setAttribute('aria-hidden', 'true');

  function spermSvg(width, color){
    // head on the right, wavy tail trailing left; SMIL animates the tail wiggle
    return '<svg width="' + width + '" viewBox="0 0 64 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
      '<path stroke="' + color + '" stroke-width="2.2" stroke-linecap="round" fill="none" ' +
        'd="M46 12 C 38 7, 30 17, 22 12 C 14 7, 8 16, 2 12">' +
        '<animate attributeName="d" dur="0.8s" repeatCount="indefinite" values="' +
          'M46 12 C 38 7, 30 17, 22 12 C 14 7, 8 16, 2 12;' +
          'M46 12 C 38 17, 30 7, 22 12 C 14 16, 8 7, 2 12;' +
          'M46 12 C 38 7, 30 17, 22 12 C 14 7, 8 16, 2 12"/>' +
      '</path>' +
      '<ellipse cx="52" cy="12" rx="8" ry="5.5" fill="' + color + '"/>' +
      '<ellipse cx="50" cy="10.5" rx="2.6" ry="1.6" fill="#ffffff" opacity=".6"/>' +
    '</svg>';
  }

  for (var i = 0; i < COUNT; i++) {
    var size     = 34 + Math.random() * 26;        // px width
    var duration = 22 + Math.random() * 30;        // s to cross the screen
    var delay    = -Math.random() * duration;      // negative → already mid-swim on load
    var bobDur   = 2.5 + Math.random() * 3;
    var top      = Math.random() * 100;            // vh
    var opacity  = 0.18 + Math.random() * 0.3;
    var color    = COLORS[Math.floor(Math.random() * COLORS.length)];

    var s = document.createElement('div');
    s.className = 'ms';
    s.style.top = top + 'vh';
    s.style.opacity = opacity;
    s.style.animationDuration = duration + 's';
    s.style.animationDelay = delay + 's';

    var bob = document.createElement('div');
    bob.className = 'ms-bob';
    bob.style.animationDuration = bobDur + 's';
    bob.style.animationDelay = (-Math.random() * bobDur) + 's';
    bob.innerHTML = spermSvg(Math.round(size), color);

    s.appendChild(bob);
    layer.appendChild(s);
  }

  document.body.insertBefore(layer, document.body.firstChild);
})();
