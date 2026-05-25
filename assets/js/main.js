/**
 * Avinash Muduthanapally Portfolio – main.js
 * Vanilla JS only, no external frameworks.
 */

(function () {
  'use strict';

  /* ── 1. Navbar scroll behavior ──────────────────────────── */
  const navbar = document.getElementById('navbar');
  if (navbar) {
    const onScroll = () => {
      if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); // run once on load
  }

  /* ── 2. Hamburger mobile menu toggle ────────────────────── */
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
    // Close menu when a link is clicked
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileMenu.classList.remove('open');
      });
    });
  }

  /* ── 3. Active nav link detection ──────────────────────── */
  (function setActiveNav() {
    const raw = window.location.pathname.split('/').pop() || 'index.html';
    const page = raw.replace('.html', '') || 'index';
    document.querySelectorAll('.nav-link[data-page]').forEach(link => {
      if (link.dataset.page === page) {
        link.classList.add('active');
      }
    });
  })();

  /* ── 4. Typewriter effect (index.html only) ─────────────── */
  const typewriterEl = document.getElementById('typewriter');
  if (typewriterEl) {
    const roles = [
      'Senior Data Engineer',
      'ETL Architect',
      'Technical Lead',
      'Databricks Expert',
      'Solution Architect'
    ];
    let roleIndex = 0;
    let charIndex = 0;
    let deleting = false;
    let paused = false;

    function type() {
      const current = roles[roleIndex];
      if (paused) { return; }

      if (!deleting) {
        typewriterEl.textContent = current.slice(0, charIndex + 1);
        charIndex++;
        if (charIndex === current.length) {
          paused = true;
          setTimeout(() => { paused = false; deleting = true; type(); }, 2000);
          return;
        }
      } else {
        typewriterEl.textContent = current.slice(0, charIndex - 1);
        charIndex--;
        if (charIndex === 0) {
          deleting = false;
          roleIndex = (roleIndex + 1) % roles.length;
        }
      }
      const speed = deleting ? 50 : 90;
      setTimeout(type, speed);
    }
    type();
  }

  /* ── 5. Intersection Observer – scroll animations ────────── */
  const animTargets = document.querySelectorAll(
    '.animate-on-scroll, .slide-left, .slide-right'
  );
  if (animTargets.length > 0) {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    animTargets.forEach(el => observer.observe(el));
  }

  /* ── 6. Stats counter animation ─────────────────────────── */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1800;
    const start = performance.now();
    const isFloat = String(target).includes('.');

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      // easeOutExpo
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const value = eased * target;
      el.textContent = prefix + (isFloat ? value.toFixed(1) : Math.floor(value)) + suffix;
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const counterEls = document.querySelectorAll('[data-counter]');
  if (counterEls.length > 0) {
    const counterObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    counterEls.forEach(el => counterObserver.observe(el));
  }

  /* ── 7. Smooth scroll for anchor links ──────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const href = anchor.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const navH = parseInt(
          getComputedStyle(document.documentElement).getPropertyValue('--nav-height')
        ) || 70;
        const top = target.getBoundingClientRect().top + window.scrollY - navH - 16;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  /* ── 8. Card 3D tilt effect ─────────────────────────────── */
  function addTilt(card) {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      const maxTilt = 6;
      card.style.transform =
        `perspective(800px) rotateX(${(-dy * maxTilt).toFixed(2)}deg) rotateY(${(dx * maxTilt).toFixed(2)}deg) translateY(-4px)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  }
  document.querySelectorAll('.card[data-tilt], .project-card[data-tilt], .timeline-card[data-tilt]').forEach(addTilt);

  /* ── 9. Skill bar animation (skills.html) ────────────────── */
  const skillBars = document.querySelectorAll('.skill-bar-fill[data-width]');
  if (skillBars.length > 0) {
    const barObserver = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.style.width = entry.target.dataset.width + '%';
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    skillBars.forEach(bar => barObserver.observe(bar));
  }

  /* ── 10. Contact form – simple validation & feedback ─────── */
  const contactForm = document.getElementById('contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const original = btn.innerHTML;
      btn.innerHTML = '<i class="fa-solid fa-check"></i> Message Sent!';
      btn.disabled = true;
      btn.style.opacity = '0.8';
      setTimeout(() => {
        btn.innerHTML = original;
        btn.disabled = false;
        btn.style.opacity = '';
        contactForm.reset();
      }, 3000);
    });
  }

})();
