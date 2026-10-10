// 뚝섬 노래방 — 영상 재생 · 사진 분류 · 크게 보기
(function () {
  // 표지를 누르기 전에는 영상 주소를 연결하지 않는다.
  var video = document.getElementById('date-video');
  var play = document.getElementById('date-play');
  var videoStatus = document.getElementById('date-video-status');
  if (video && play && videoStatus) {
    video.controls = false;
    video.tabIndex = -1;
    play.hidden = false;
    play.addEventListener('click', function () {
      videoStatus.textContent = '';
      if (!video.getAttribute('src')) video.src = video.dataset.src;
      video.muted = true;
      video.controls = true;
      video.tabIndex = 0;
      play.hidden = true;
      video.focus({ preventScroll: true });
      var playback = video.play();
      if (playback) playback.catch(function () {
        videoStatus.textContent = '재생을 시작하지 못했습니다. 재생바의 재생 버튼을 눌러 다시 시도해 주세요.';
      });
    });
    video.addEventListener('error', function () {
      videoStatus.textContent = '영상을 불러오지 못했습니다. 연결 상태를 확인한 뒤 페이지를 새로 고쳐 주세요. 아래 이용 안내는 그대로 확인할 수 있습니다.';
    });
    video.addEventListener('playing', function () { videoStatus.textContent = ''; });
  }

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
