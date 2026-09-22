const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Stars ---------- */

function createStars() {
  const container = document.getElementById('stars');
  const count = prefersReducedMotion ? 40 : 120;

  for (let i = 0; i < count; i++) {
    const star = document.createElement('div');
    star.className = 'star';
    const size = Math.random() * 2 + 1;
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${Math.random() * 100}vw`;
    star.style.top = `${Math.random() * 100}vh`;
    star.style.animationDuration = `${Math.random() * 3 + 2}s`;
    star.style.animationDelay = `${Math.random() * 4}s`;
    container.appendChild(star);
  }
}

/* ---------- Falling petals ---------- */

function spawnPetal() {
  const container = document.getElementById('petals-container');
  const petal = document.createElement('div');
  petal.className = 'falling-petal';

  const size = Math.random() * 14 + 10;
  petal.style.width = `${size}px`;
  petal.style.height = `${size}px`;
  petal.style.left = `${Math.random() * 100}vw`;
  petal.style.animationDuration = `${Math.random() * 8 + 9}s`;

  petal.addEventListener('animationend', () => petal.remove());
  container.appendChild(petal);
}

function startPetalRain() {
  const interval = prefersReducedMotion ? 3500 : 900;
  const initial = prefersReducedMotion ? 4 : 14;

  for (let i = 0; i < initial; i++) {
    setTimeout(spawnPetal, Math.random() * 4000);
  }

  setInterval(spawnPetal, interval);
}

/* ---------- Cursor glow ---------- */

function initCursorGlow() {
  if (!window.matchMedia('(hover: hover)').matches) return;

  const glow = document.getElementById('cursorGlow');
  let targetX = window.innerWidth / 2;
  let targetY = window.innerHeight / 2;
  let currentX = targetX;
  let currentY = targetY;

  window.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    glow.classList.add('active');
  });

  function animate() {
    currentX += (targetX - currentX) * 0.12;
    currentY += (targetY - currentY) * 0.12;
    glow.style.transform = `translate(${currentX}px, ${currentY}px)`;
    requestAnimationFrame(animate);
  }
  animate();
}

/* ---------- Scroll reveal ---------- */

function initScrollReveal() {
  const targets = document.querySelectorAll('.reveal, .reveal-flower');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.classList.contains('reveal-flower')) {
        el.classList.add('bloomed');
      } else {
        el.classList.add('visible');
      }

      if (el.id === 'letterText') {
        typeLetter(el);
      }

      observer.unobserve(el);
    });
  }, { threshold: 0.3 });

  targets.forEach((el) => observer.observe(el));
}

/* ---------- Typewriter letter ---------- */

function typeLetter(el) {
  const full = el.dataset.full;
  el.textContent = '';
  const cursor = document.createElement('span');
  cursor.className = 'cursor-blink';
  el.appendChild(cursor);

  let i = 0;
  const speed = 18;

  function step() {
    if (i < full.length) {
      cursor.insertAdjacentText('beforebegin', full[i]);
      i++;
      setTimeout(step, speed);
    } else {
      cursor.remove();
    }
  }
  step();
}

/* ---------- Side nav dots ---------- */

function initDotsNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const dots = document.querySelectorAll('.dot');
  if (!dots.length) return;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      dots.forEach((dot) => {
        dot.classList.toggle('active', dot.dataset.target === entry.target.id);
      });
    });
  }, { threshold: 0.5 });

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Love button burst ---------- */

function initLoveButton() {
  const btn = document.getElementById('loveBtn');
  const message = document.getElementById('finaleMessage');
  if (!btn) return;

  let clicked = false;

  btn.addEventListener('click', () => {
    burstFrom(btn);
    message.classList.add('show');

    if (!clicked) {
      clicked = true;
      btn.textContent = 'Espero te haya gustado 🌼';
    }
  });
}

function burstFrom(button) {
  const rect = button.getBoundingClientRect();
  const originX = rect.left + rect.width / 2;
  const originY = rect.top + rect.height / 2;
  const symbols = ['🌼', '🌻', '💛', '✨'];
  const count = prefersReducedMotion ? 6 : 22;

  for (let i = 0; i < count; i++) {
    const particle = document.createElement('span');
    particle.className = 'burst-particle';
    particle.textContent = symbols[Math.floor(Math.random() * symbols.length)];
    particle.style.left = `${originX}px`;
    particle.style.top = `${originY}px`;
    document.body.appendChild(particle);

    const angle = Math.random() * Math.PI * 2;
    const distance = Math.random() * 160 + 60;
    const dx = Math.cos(angle) * distance;
    const dy = Math.sin(angle) * distance;

    const animation = particle.animate([
      { transform: 'translate(-50%, -50%) scale(0.6)', opacity: 1 },
      { transform: `translate(${dx - 50}px, ${dy - 50}px) scale(1.1) rotate(${Math.random() * 360}deg)`, opacity: 0 }
    ], {
      duration: Math.random() * 500 + 700,
      easing: 'cubic-bezier(.2,.7,.3,1)'
    });

    animation.onfinish = () => particle.remove();
  }
}

/* ---------- Init ---------- */

document.addEventListener('DOMContentLoaded', () => {
  createStars();
  startPetalRain();
  initCursorGlow();
  initScrollReveal();
  initDotsNav();
  initLoveButton();
});
