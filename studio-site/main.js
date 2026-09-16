/* ═══════════════════════════════════════════════════════
   MĀNASA — Main JS
   Minimal: reveal on scroll, mobile nav, header state.
   No libraries. Respects prefers-reduced-motion.
   ═══════════════════════════════════════════════════════ */

(function () {
  'use strict';

  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ─── MOBILE NAV ───
  const toggle = document.querySelector('.menu-toggle');
  const mobileNav = document.getElementById('mobile-nav');
  const mobileLinks = mobileNav ? mobileNav.querySelectorAll('a') : [];

  if (toggle && mobileNav) {
    toggle.addEventListener('click', function () {
      const expanded = this.getAttribute('aria-expanded') === 'true';
      this.setAttribute('aria-expanded', String(!expanded));
      mobileNav.setAttribute('aria-hidden', String(expanded));
      document.body.style.overflow = expanded ? '' : 'hidden';
    });

    mobileLinks.forEach(function (link) {
      link.addEventListener('click', function () {
        toggle.setAttribute('aria-expanded', 'false');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  // ─── SCROLL REVEAL ───
  if (!prefersReduced) {
    // Add .reveal to all animatable elements
    const selectors = [
      '.opening-text',
      '.opening-image',
      '.project',
      '.pullquote blockquote',
      '.practice-body',
      '.practice-image',
      '.approach-item',
      '.contact-body',
      '.contact-aside',
      '.colophon-inner'
    ];

    const elements = document.querySelectorAll(selectors.join(', '));

    elements.forEach(function (el) {
      el.classList.add('reveal');
    });

    // Observer
    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    elements.forEach(function (el) {
      observer.observe(el);
    });
  }

  // ─── HEADER COMPACT ON SCROLL ───
  var header = document.getElementById('site-header');
  var lastScroll = 0;

  if (header) {
    window.addEventListener('scroll', function () {
      var current = window.pageYOffset;
      if (current > 80) {
        header.style.boxShadow = '0 1px 0 var(--rule-faint)';
      } else {
        header.style.boxShadow = 'none';
      }
      lastScroll = current;
    }, { passive: true });
  }

  // ─── SMOOTH SCROLL FOR ANCHOR LINKS ───
  // (CSS scroll-behavior handles this, but this adds offset for sticky header)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var targetId = this.getAttribute('href');
      if (targetId === '#') return;
      var target = document.querySelector(targetId);
      if (target) {
        e.preventDefault();
        var headerHeight = header ? header.offsetHeight : 0;
        var top = target.getBoundingClientRect().top + window.pageYOffset - headerHeight - 24;
        window.scrollTo({
          top: top,
          behavior: prefersReduced ? 'auto' : 'smooth'
        });
      }
    });
  });

})();
