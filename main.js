(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

  root.classList.add('js');

  /* ---------- reveal on scroll ---------- */
  var revealEls = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- active nav link ---------- */
  var navLinks = document.querySelectorAll('[data-nav]');
  var sections = document.querySelectorAll('[data-section]');
  if ('IntersectionObserver' in window) {
    var navIo = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (!e.isIntersecting) return;
        var id = e.target.getAttribute('data-section');
        navLinks.forEach(function (a) { a.classList.toggle('is-active', a.getAttribute('data-nav') === id); });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(function (s) { navIo.observe(s); });
  }

  /* ---------- scroll progress + timeline fill (one rAF-throttled listener) ---------- */
  var pathList = document.getElementById('path-list');
  var stops = pathList ? pathList.querySelectorAll('.stop') : [];
  var ticking = false;

  function onScroll() {
    var h = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--scroll', h > 0 ? (window.scrollY / h).toFixed(4) : 0);

    if (pathList) {
      var r = pathList.getBoundingClientRect();
      var line = window.innerHeight * 0.6;
      var p = Math.min(1, Math.max(0, (line - r.top) / r.height));
      pathList.style.setProperty('--p', p.toFixed(4));
      stops.forEach(function (s) {
        var n = s.querySelector('.stop__node').getBoundingClientRect();
        s.classList.toggle('on', n.top + n.height / 2 < line);
      });
    }
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  window.addEventListener('resize', onScroll);
  onScroll();

  /* ---------- typewriter ---------- */
  var typed = document.getElementById('typed');
  if (typed && !reduce) {
    var words = ['web pages', 'layouts with CSS Grid', 'forms that validate', 'things by hand'];
    var wi = 0, ci = words[0].length, deleting = true;
    (function tick() {
      var w = words[wi];
      if (deleting) { ci--; } else { ci++; }
      typed.textContent = w.slice(0, ci);
      var delay = deleting ? 38 : 80;
      if (!deleting && ci === w.length) { deleting = true; delay = 1700; }
      else if (deleting && ci === 0) { deleting = false; wi = (wi + 1) % words.length; delay = 320; }
      setTimeout(tick, delay);
    })();
  }

  if (reduce || !fine) return;

  /* ---------- spotlight on cards ---------- */
  document.querySelectorAll('.spot').forEach(function (el) {
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      el.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      el.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  /* ---------- 3D tilt (portrait + certificate) ---------- */
  function tilt(el, max, shine) {
    if (!el) return;
    var raf = 0;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var x = (e.clientX - r.left) / r.width - 0.5;
      var y = (e.clientY - r.top) / r.height - 0.5;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () {
        el.style.setProperty('--ry', (x * max).toFixed(2) + 'deg');
        el.style.setProperty('--rx', (-y * max).toFixed(2) + 'deg');
        if (shine) el.style.setProperty('--gx', (100 - (x + 0.5) * 100).toFixed(1) + '%');
      });
    });
    el.addEventListener('pointerleave', function () {
      cancelAnimationFrame(raf);
      el.style.setProperty('--rx', '0deg');
      el.style.setProperty('--ry', '0deg');
    });
  }
  tilt(document.getElementById('tilt'), 9, false);
  tilt(document.getElementById('holo'), 16, true);

  /* ---------- magnetic buttons ---------- */
  document.querySelectorAll('.magnet').forEach(function (el) {
    var raf = 0;
    el.addEventListener('pointermove', function (e) {
      var r = el.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width / 2)) * 0.22;
      var dy = (e.clientY - (r.top + r.height / 2)) * 0.3;
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { el.style.transform = 'translate(' + dx.toFixed(1) + 'px,' + dy.toFixed(1) + 'px)'; });
    });
    el.addEventListener('pointerleave', function () {
      cancelAnimationFrame(raf);
      el.style.transform = '';
    });
  });
})();
