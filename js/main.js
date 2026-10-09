// 뚝섬 노래방 — 사진 분류 · 크게 보기
(function () {
  var grid = document.getElementById('grid');
  var chips = document.querySelectorAll('.chip');

  // 사진 분류 버튼
  chips.forEach(function (chip) {
    chip.addEventListener('click', function () {
      var f = chip.dataset.filter;
      chips.forEach(function (c) {
        var on = c === chip;
        c.classList.toggle('is-on', on);
        c.setAttribute('aria-selected', on ? 'true' : 'false');
      });
      grid.querySelectorAll('li').forEach(function (li) {
        li.hidden = !(f === 'all' || li.dataset.cat === f);
      });
    });
  });

  // 사진 크게 보기
  var lb = document.getElementById('lightbox');
  var lbImg = lb.querySelector('img');
  var lbCap = lb.querySelector('.lb-cap');
  var current = 0;
  var lastFocus = null;

  function visibleLinks() {
    return Array.prototype.filter.call(grid.querySelectorAll('li'), function (li) { return !li.hidden; })
      .map(function (li) { return li.querySelector('a'); });
  }
  function show(i) {
    var links = visibleLinks();
    current = (i + links.length) % links.length;
    var a = links[current];
    var alt = a.querySelector('img').alt;
    lbImg.src = a.getAttribute('href');
    lbImg.alt = alt;
    lbCap.textContent = alt + '  (' + (current + 1) + ' / ' + links.length + ')';
  }
  function open(i) {
    lastFocus = document.activeElement;
    lb.hidden = false;
    document.body.style.overflow = 'hidden';
    show(i);
    lb.querySelector('.lb-close').focus();
  }
  function close() {
    lb.hidden = true;
    document.body.style.overflow = '';
    if (lastFocus) lastFocus.focus();
  }

  grid.addEventListener('click', function (e) {
    var a = e.target.closest('a');
    if (!a) return;
    e.preventDefault();
    open(visibleLinks().indexOf(a));
  });
  lb.querySelector('.lb-close').addEventListener('click', close);
  lb.querySelector('.lb-prev').addEventListener('click', function () { show(current - 1); });
  lb.querySelector('.lb-next').addEventListener('click', function () { show(current + 1); });
  lb.addEventListener('click', function (e) { if (e.target === lb) close(); });
  document.addEventListener('keydown', function (e) {
    if (lb.hidden) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(current - 1);
    if (e.key === 'ArrowRight') show(current + 1);
  });

  // 휴대폰에서 밀어서 넘기기
  var sx = null;
  lb.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', function (e) {
    if (sx === null) return;
    var dx = e.changedTouches[0].clientX - sx;
    if (Math.abs(dx) > 50) show(current + (dx < 0 ? 1 : -1));
    sx = null;
  });
})();
