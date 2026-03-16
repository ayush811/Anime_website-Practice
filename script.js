/* ═══════════════════════════════════════════════════
   SAKURA PETALS
   ═══════════════════════════════════════════════════ */
const sakuraContainer = document.getElementById('sakura');

function createPetal() {
  const petal = document.createElement('div');
  petal.className = 'petal';
  const size = 6 + Math.random() * 10;
  petal.style.width = size + 'px';
  petal.style.height = size + 'px';
  petal.style.left = Math.random() * 100 + '%';
  petal.style.animationDuration = (8 + Math.random() * 12) + 's';
  petal.style.animationDelay = Math.random() * 15 + 's';
  sakuraContainer.appendChild(petal);

  // Remove and recreate after animation
  const duration = parseFloat(petal.style.animationDuration) + parseFloat(petal.style.animationDelay);
  setTimeout(() => {
    petal.remove();
    createPetal();
  }, duration * 1000);
}

// Create initial petals
for (let i = 0; i < 20; i++) {
  createPetal();
}

/* ═══════════════════════════════════════════════════
   PARALLAX
   ═══════════════════════════════════════════════════ */
window.addEventListener('scroll', () => {
  const scrollY = window.scrollY;
  document.querySelectorAll('.parallax-layer').forEach(el => {
    const speed = parseFloat(el.dataset.speed) || 0.03;
    el.style.transform = `translateY(${scrollY * speed * -1}px)`;
  });
});

/* ═══════════════════════════════════════════════════
   SCROLL REVEAL
   ═══════════════════════════════════════════════════ */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
