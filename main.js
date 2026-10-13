(function () {
  'use strict';

  var root = document.documentElement;
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  root.classList.add('js');

  /* reveal sections as they enter the screen */
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

  /* mark the current section in the menu */
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

  /* course path: the line fills as you scroll, stops light up one by one */
  var pathList = document.getElementById('path-list');
  if (!pathList) return;
  var stops = pathList.querySelectorAll('.stop');
  var ticking = false;

  function update() {
    var r = pathList.getBoundingClientRect();
    var line = window.innerHeight * 0.6;
    var p = Math.min(1, Math.max(0, (line - r.top) / r.height));
    pathList.style.setProperty('--p', p.toFixed(4));
    stops.forEach(function (s) {
      var n = s.querySelector('.stop__node').getBoundingClientRect();
      s.classList.toggle('on', n.top + n.height / 2 < line);
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
