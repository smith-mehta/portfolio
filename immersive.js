/* ============================================================
   IMMERSIVE ART LAYER — controller
   Adds grain overlay, kinetic canvas, and the preview switcher.
   Persists choice in localStorage('sm-art'). Default 'clean'.
   ============================================================ */
(function () {
  var MODES = [
    { id: 'clean',     k: 'Clean',     d: 'Original, no FX' },
    { id: 'cinema',    k: 'Cinema',    d: 'Grain · filmstrip · letterbox' },
    { id: 'editorial', k: 'Editorial', d: 'Halftone · duotone print' },
    { id: 'kinetic',   k: 'Kinetic',   d: 'Drifting particle field' }
  ];

  // --- overlay nodes ---
  var grain = document.createElement('div'); grain.id = 'artGrain';
  var canvas = document.createElement('canvas'); canvas.id = 'artCanvas';
  document.body.appendChild(canvas);
  document.body.appendChild(grain);

  // --- switcher UI ---
  var sw = document.createElement('div'); sw.id = 'artSwitcher';
  var rows = MODES.map(function (m) {
    return '<button data-art="' + m.id + '"><span class="as-k">' + m.k + '</span><span class="as-d">' + m.d + '</span></button>';
  }).join('');
  sw.innerHTML =
    '<button class="as-collapse" type="button">— hide</button>' +
    '<span class="as-title">Art direction</span>' +
    '<div class="as-grid">' + rows + '</div>';
  document.body.appendChild(sw);

  var saved = localStorage.getItem('sm-art') || 'clean';

  function apply(mode) {
    MODES.forEach(function (m) { document.body.classList.toggle('art-' + m.id, m.id === mode && m.id !== 'clean'); });
    sw.querySelectorAll('button[data-art]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-art') === mode);
    });
    localStorage.setItem('sm-art', mode);
    if (mode === 'kinetic') startKinetic(); else stopKinetic();
  }

  sw.addEventListener('click', function (e) {
    var b = e.target.closest('button');
    if (!b) return;
    if (b.classList.contains('as-collapse')) {
      sw.classList.toggle('collapsed');
      b.textContent = sw.classList.contains('collapsed') ? '+ art' : '— hide';
      return;
    }
    if (b.hasAttribute('data-art')) apply(b.getAttribute('data-art'));
  });

  // --- kinetic particle field ---
  var raf = null, ctx = canvas.getContext('2d'), parts = [], DPR = Math.min(2, window.devicePixelRatio || 1);
  function size() {
    canvas.width = innerWidth * DPR; canvas.height = innerHeight * DPR;
    canvas.style.width = innerWidth + 'px'; canvas.style.height = innerHeight + 'px';
  }
  function seed() {
    var n = Math.round(Math.min(70, innerWidth / 22));
    parts = [];
    for (var i = 0; i < n; i++) parts.push({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height,
      vx: (Math.random() - .5) * .25 * DPR, vy: (Math.random() - .5) * .25 * DPR,
      r: (Math.random() * 1.6 + .6) * DPR
    });
  }
  function tick() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    var dark = document.body.classList.contains('art-kinetic');
    // bg wash on paper
    for (var i = 0; i < parts.length; i++) {
      var p = parts[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = canvas.width; if (p.x > canvas.width) p.x = 0;
      if (p.y < 0) p.y = canvas.height; if (p.y > canvas.height) p.y = 0;
      ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, 6.2832);
      ctx.fillStyle = 'rgba(156,107,47,0.5)'; ctx.fill();
      for (var j = i + 1; j < parts.length; j++) {
        var q = parts[j], dx = p.x - q.x, dy = p.y - q.y, d2 = dx * dx + dy * dy, max = (130 * DPR) * (130 * DPR);
        if (d2 < max) {
          var a = (1 - d2 / max) * 0.18;
          ctx.strokeStyle = 'rgba(156,107,47,' + a.toFixed(3) + ')';
          ctx.lineWidth = DPR * 0.6;
          ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y); ctx.stroke();
        }
      }
    }
    raf = requestAnimationFrame(tick);
  }
  function startKinetic() { if (raf) return; size(); seed(); raf = requestAnimationFrame(tick); }
  function stopKinetic() { if (raf) { cancelAnimationFrame(raf); raf = null; } ctx && ctx.clearRect(0, 0, canvas.width, canvas.height); }
  addEventListener('resize', function () { if (raf) { size(); seed(); } });

  apply(saved);
})();
