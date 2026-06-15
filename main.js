/* ================================================
   MAISON DES SAVEURS — main.js
   Entry point for Vite project
   ================================================ */

import './style.css';

// ── Year ─────────────────────────────────────────
document.getElementById('yr').textContent = new Date().getFullYear();

// ── Floating particles ────────────────────────────
const spawnParticles = () => {
  const container = document.getElementById('particles');
  if (!container) return;

  for (let i = 0; i < 30; i++) {
    const p = document.createElement('div');
    p.className = 'particle';
    const size = 1 + Math.random() * 2.5;
    p.style.cssText = `
      left:${Math.random() * 100}%;
      width:${size}px; height:${size}px;
      --d:${10 + Math.random() * 16}s;
      --dl:-${Math.random() * 14}s;
      --op:${0.12 + Math.random() * 0.3};
    `;
    container.appendChild(p);
  }
};

// ── Intersection Observer (reveal on scroll) ──────
const initReveal = () => {
  const card    = document.getElementById('menu-card');
  const courses = document.querySelectorAll('.course');

  const cardObserver = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      cardObserver.unobserve(entry.target);
    }
  }, { threshold: 0.08 });

  if (card) cardObserver.observe(card);

  const courseObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const all = [...document.querySelectorAll('.course')];
        const idx = all.indexOf(entry.target);
        setTimeout(() => entry.target.classList.add('visible'), idx * 130);
        courseObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });

  courses.forEach(c => courseObserver.observe(c));
};

// ── Hero parallax ─────────────────────────────────
const initParallax = () => {
  const content = document.querySelector('.hero-content');
  if (!content) return;

  let ticking = false;
  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const y     = window.scrollY;
      const heroH = document.querySelector('.hero')?.offsetHeight ?? 800;
      if (y < heroH) {
        content.style.transform = `translateY(${y * 0.26}px)`;
        content.style.opacity   = String(1 - (y / heroH) * 1.5);
      }
      ticking = false;
    });
    ticking = true;
  }, { passive: true });
};

// ── Smooth scroll CTA ─────────────────────────────
const initCTA = () => {
  document.getElementById('cta-btn')?.addEventListener('click', (e) => {
    e.preventDefault();
    document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' });
  });
};

// ── Subtle card tilt (desktop only) ──────────────
const initTilt = () => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const card = document.getElementById('menu-card');
  if (!card) return;

  const MAX = 2.5;
  card.addEventListener('mousemove', (e) => {
    const r  = card.getBoundingClientRect();
    const dx = (e.clientX - (r.left + r.width  / 2)) / (r.width  / 2);
    const dy = (e.clientY - (r.top  + r.height / 2)) / (r.height / 2);
    card.style.transform  = `perspective(1100px) rotateX(${-dy * MAX}deg) rotateY(${dx * MAX}deg)`;
    card.style.transition = 'transform .08s ease';
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform  = 'perspective(1100px) rotateX(0) rotateY(0)';
    card.style.transition = 'transform .6s ease, opacity .9s, box-shadow .6s';
  });
};

// ── Cursor glow (desktop only) ────────────────────
const initCursorGlow = () => {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  const glow = document.createElement('div');
  Object.assign(glow.style, {
    position:      'fixed',
    width:         '300px',
    height:        '300px',
    borderRadius:  '50%',
    pointerEvents: 'none',
    zIndex:        '9999',
    background:    'radial-gradient(circle, rgba(201,169,110,.07) 0%, transparent 70%)',
    transform:     'translate(-50%,-50%)',
    mixBlendMode:  'screen',
    transition:    'opacity .4s ease',
  });
  document.body.appendChild(glow);

  let mx = 0, my = 0, gx = 0, gy = 0;
  document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
  document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
  document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });

  const tick = () => {
    gx += (mx - gx) * 0.07;
    gy += (my - gy) * 0.07;
    glow.style.left = `${gx}px`;
    glow.style.top  = `${gy}px`;
    requestAnimationFrame(tick);
  };
  tick();
};

// ── Init ──────────────────────────────────────────
spawnParticles();
initReveal();
initParallax();
initCTA();
initTilt();
initCursorGlow();
