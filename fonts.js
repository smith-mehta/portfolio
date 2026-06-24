/* Font pairing preview switcher — persists to localStorage('sm-font'). Default 'original'. */
(function () {
  var FONTS = [
    { id: 'original',  k: 'Original',  d: 'Instrument · Hanken' },
    { id: 'editorial', k: 'Editorial', d: 'Fraunces · Libre Franklin' },
    { id: 'literary',  k: 'Literary',  d: 'Newsreader · Source Sans' },
    { id: 'classical', k: 'Classical', d: 'Cormorant · Public Sans' },
    { id: 'modern',    k: 'Modern',    d: 'Spectral · Archivo' }
  ];
  var sw = document.createElement('div'); sw.id = 'fontSwitcher';
  var rows = FONTS.map(function (f) {
    return '<button data-font="' + f.id + '"><span class="fs-k">' + f.k + '</span><span class="fs-d">' + f.d + '</span></button>';
  }).join('');
  sw.innerHTML =
    '<button class="fs-collapse" type="button">— hide</button>' +
    '<span class="fs-title">Typeface</span>' +
    '<div class="fs-grid">' + rows + '</div>';
  document.body.appendChild(sw);

  var saved = localStorage.getItem('sm-font') || 'original';
  function apply(id) {
    if (id === 'original') document.body.removeAttribute('data-font');
    else document.body.setAttribute('data-font', id);
    sw.querySelectorAll('button[data-font]').forEach(function (b) {
      b.classList.toggle('active', b.getAttribute('data-font') === id);
    });
    localStorage.setItem('sm-font', id);
  }
  sw.addEventListener('click', function (e) {
    var b = e.target.closest('button'); if (!b) return;
    if (b.classList.contains('fs-collapse')) {
      sw.classList.toggle('collapsed');
      b.textContent = sw.classList.contains('collapsed') ? '+ font' : '— hide';
      return;
    }
    if (b.hasAttribute('data-font')) apply(b.getAttribute('data-font'));
  });
  apply(saved);
})();
