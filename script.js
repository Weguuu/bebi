// --- Carousel Logic ---
const carousel = document.getElementById('carousel');
const cards = Array.from(carousel.getElementsByClassName('photocard'));
const prevBtn = document.querySelector('.carousel-nav.prev');
const nextBtn = document.querySelector('.carousel-nav.next');
const dotsContainer = document.getElementById('carousel-dots');
let current = 0, interval, isPaused = false;

function updateCarousel(idx) {
  const n = cards.length;
  cards.forEach((card, i) => {
    card.classList.remove('active', 'prev', 'next');
    if (i === idx) card.classList.add('active');
    else if (i === (idx - 1 + n) % n) card.classList.add('prev');
    else if (i === (idx + 1) % n) card.classList.add('next');
  });
  [...dotsContainer.children].forEach((dot, i) => {
    dot.classList.toggle('active', i === idx);
  });
}
function goTo(idx) {
  current = (idx + cards.length) % cards.length;
  updateCarousel(current);
}
function next() { goTo(current + 1); }
function prev() { goTo(current - 1); }
function startAuto() {
  interval = setInterval(() => { if (!isPaused) next(); }, 5000);
}
function stopAuto() { clearInterval(interval); }

cards.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.addEventListener('click', () => { goTo(i); });
  dotsContainer.appendChild(dot);
});
updateCarousel(0);
startAuto();

nextBtn.onclick = () => { next(); isPaused = true; };
prevBtn.onclick = () => { prev(); isPaused = true; };
carousel.onmouseenter = () => isPaused = true;
carousel.onmouseleave = () => isPaused = false;

// Touch/swipe support
let startX = 0;
carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX);
carousel.addEventListener('touchend', e => {
  let dx = e.changedTouches[0].clientX - startX;
  if (dx > 50) prev();
  else if (dx < -50) next();
  isPaused = true;
});

// Keyboard navigation
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft') { prev(); isPaused = true; }
  if (e.key === 'ArrowRight') { next(); isPaused = true; }
});

// --- Dark/Light Mode Toggle ---
const themeBtn = document.getElementById('theme-toggle');
const iconMoon = themeBtn.querySelector('.icon-moon');

function updateThemeIcon() {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  iconMoon.textContent = isDark ? '☀️' : '🌙';
}

themeBtn.onclick = () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  updateThemeIcon();
};

if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
  document.documentElement.setAttribute('data-theme', 'dark');
}
updateThemeIcon();

// Envelope intro animation
window.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('envelope-overlay');
  const envelope = overlay.querySelector('.envelope');
  setTimeout(() => {
    envelope.classList.add('open');
  }, 700); // flap opens after 0.7s
  setTimeout(() => {
    overlay.style.opacity = '0';
  }, 4000); // fade out after 2s of message
  setTimeout(() => {
    overlay.style.display = 'none';
    // --- Autoplay audio after envelope animation ---
    const audio = document.getElementById('audio');
    if (audio) {
      audio.play().catch(() => {
        // If autoplay is blocked, show a tip or do nothing
      });
    }
  }, 5000); // remove overlay after fade, then play audio
});