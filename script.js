/* ═══════════════════════════════════════════════════
   RAIN ENGINE — Canvas-based rain with splatters
   ═══════════════════════════════════════════════════ */
const canvas = document.getElementById('rain-canvas');
const ctx = canvas.getContext('2d');
let drops = [];
let splatters = [];

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function initDrops() {
  drops = [];
  const count = Math.floor(window.innerWidth / 4);
  for (let i = 0; i < count; i++) {
    drops.push(createDrop());
  }
}

function createDrop() {
  return {
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height * -1,
    length: 15 + Math.random() * 25,
    speed: 4 + Math.random() * 6,
    opacity: 0.1 + Math.random() * 0.2,
    wind: 0.5 + Math.random() * 0.5
  };
}

function drawRain() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw drops
  for (let drop of drops) {
    ctx.beginPath();
    ctx.moveTo(drop.x, drop.y);
    ctx.lineTo(drop.x + drop.wind * 2, drop.y + drop.length);
    ctx.strokeStyle = `rgba(160, 180, 220, ${drop.opacity})`;
    ctx.lineWidth = 0.8;
    ctx.stroke();

    drop.y += drop.speed;
    drop.x += drop.wind;

    // Reset & create splatter
    if (drop.y > canvas.height) {
      splatters.push({
        x: drop.x,
        y: canvas.height - 2,
        radius: 1,
        maxRadius: 3 + Math.random() * 3,
        opacity: 0.4,
        speed: 0.3 + Math.random() * 0.2
      });
      Object.assign(drop, createDrop());
      drop.y = -drop.length;
    }
  }

  // Draw splatters
  for (let i = splatters.length - 1; i >= 0; i--) {
    const s = splatters[i];
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(160, 180, 220, ${s.opacity})`;
    ctx.lineWidth = 0.5;
    ctx.stroke();

    s.radius += s.speed;
    s.opacity -= 0.02;

    if (s.opacity <= 0 || s.radius >= s.maxRadius) {
      splatters.splice(i, 1);
    }
  }

  requestAnimationFrame(drawRain);
}

initDrops();
drawRain();

/* ═══════════════════════════════════════════════════
   CLICK RIPPLE
   ═══════════════════════════════════════════════════ */
canvas.addEventListener('click', (e) => {
  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      const ripple = document.createElement('div');
      ripple.className = 'ripple';
      ripple.style.left = (e.clientX - 60) + 'px';
      ripple.style.top = (e.clientY - 60) + 'px';
      document.body.appendChild(ripple);
      ripple.addEventListener('animationend', () => ripple.remove());
    }, i * 150);
  }

  // Also make some rain drops scatter outward from click point
  for (let drop of drops) {
    const dx = drop.x - e.clientX;
    const dy = drop.y - e.clientY;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < 100) {
      drop.x += dx * 0.5;
      drop.speed += 3;
    }
  }
});

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
