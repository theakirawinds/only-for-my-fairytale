/* ================================================================
   script.js  –  Birthday Website
   Features:
     · Custom heart cursor
     · Floating particle hearts
     · Landing → main page transition
     · Typewriter animation
     · Scroll-triggered card reveals
     · Countdown timer
     · Secret message modal (with floating hearts)
     · Confetti canvas animation
     · Background music toggle
================================================================ */

'use strict';
const password = prompt("Enter Password to Open 🎀");

if (password !== "ritika1411") {
  document.body.innerHTML = "<h1 style='text-align:center;margin-top:50px;'>Access Denied ❌</h1>";
  throw new Error("Wrong Password");
}
/* ── CONFIGURATION ──────────────────────────────────────────────── */

// ★ Set her next birthday here (year, month-1, day)
const BIRTHDAY = new Date(2025, 10, 14); // Aug 15 2007 → adjust as needed

const TYPEWRITER_MSG =
  "You are one of the most important people in my life. " +
  "Thank you for all the memories, the laughs, and the late-night talks that kept me sane. " +
  "You have a way of making every ordinary moment feel like something worth remembering. " +
  "Today is all about celebrating you — exactly as you are. 🌸";

/* ================================================================
   1. CUSTOM HEART CURSOR
================================================================ */
const cursorHeart = document.getElementById('cursorHeart');

document.addEventListener('mousemove', (e) => {
  cursorHeart.style.left = e.clientX + 'px';
  cursorHeart.style.top  = e.clientY + 'px';
});

// Hide on touch devices – they don't have a pointer
window.addEventListener('touchstart', () => {
  cursorHeart.style.display = 'none';
}, { once: true });

/* ================================================================
   2. FLOATING PARTICLE HEARTS
================================================================ */
const particleContainer = document.getElementById('particlesContainer');
const PARTICLE_SYMBOLS  = ['♥', '🌸', '✨', '💫', '🌷'];
const PARTICLE_COUNT    = 28;

function createParticle() {
  const el = document.createElement('div');
  el.className = 'particle';
  el.textContent = PARTICLE_SYMBOLS[Math.floor(Math.random() * PARTICLE_SYMBOLS.length)];

  // Random horizontal position
  el.style.left     = Math.random() * 100 + 'vw';
  // Random size
  el.style.fontSize = (0.9 + Math.random() * 1.4) + 'rem';
  // Random duration & delay
  const duration = 10 + Math.random() * 18;
  const delay    = Math.random() * 12;
  el.style.animationDuration = duration + 's';
  el.style.animationDelay   = delay + 's';
  // Random opacity ceiling
  el.style.opacity = 0;

  particleContainer.appendChild(el);
}

for (let i = 0; i < PARTICLE_COUNT; i++) createParticle();

/* ================================================================
   3. LANDING → MAIN PAGE TRANSITION
================================================================ */
const landingScreen = document.getElementById('landingScreen');
const mainPage      = document.getElementById('mainPage');

function openSurprise() {
  // Trigger fade-out on landing
  landingScreen.classList.add('fade-out');

  setTimeout(() => {
    landingScreen.style.display = 'none';
    mainPage.classList.remove('hidden');

    // Kick off typewriter once main page is visible
    startTypewriter();
    startCountdown();
    initScrollReveal();
  }, 900); // matches CSS transition duration
}

/* ================================================================
   4. TYPEWRITER ANIMATION
================================================================ */
const typewriterEl = document.getElementById('typewriterText');
let typewriterIndex    = 0;
let typewriterStarted  = false;

function startTypewriter() {
  if (typewriterStarted) return;
  typewriterStarted = true;

  // Create a blinking cursor span
  const cursor = document.createElement('span');
  cursor.className = 'typewriter-cursor';
  cursor.textContent = '|';

  typewriterEl.appendChild(cursor);

  function type() {
    if (typewriterIndex < TYPEWRITER_MSG.length) {
      // Insert character before the cursor
      cursor.insertAdjacentText('beforebegin', TYPEWRITER_MSG[typewriterIndex]);
      typewriterIndex++;
      setTimeout(type, 38 + Math.random() * 26); // natural timing variation
    } else {
      // Blink cursor for a moment then fade it out
      setTimeout(() => {
        cursor.style.transition = 'opacity 0.8s';
        cursor.style.opacity    = '0';
        setTimeout(() => cursor.remove(), 900);
      }, 2000);
    }
  }

  // Small delay so the hero title can finish fading in
  setTimeout(type, 700);
}

/* ================================================================
   5. SCROLL-TRIGGERED CARD REVEALS (Intersection Observer)
================================================================ */
function initScrollReveal() {
  const cards = document.querySelectorAll('.fade-in-card');

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  cards.forEach(card => observer.observe(card));
}

/* ================================================================
   6. COUNTDOWN TIMER
================================================================ */
const cdDays  = document.getElementById('cdDays');
const cdHours = document.getElementById('cdHours');
const cdMins  = document.getElementById('cdMins');
const cdSecs  = document.getElementById('cdSecs');
const cdNote  = document.getElementById('countdownNote');

function startCountdown() {
  function tick() {
    const now  = new Date();
    let target = new Date(BIRTHDAY);

    // If birthday has passed this year, point to next year
    if (now > target) {
      target.setFullYear(now.getFullYear() + 1);
      // If it's literally today (within same date)
      const sameDay = now.toDateString() === BIRTHDAY.toDateString() ||
                      now.toDateString() === new Date(BIRTHDAY.setFullYear(now.getFullYear())).toDateString();
      if (sameDay) {
        cdNote.textContent = '🎂 Today is the day! Happy Birthday! 🎉';
        cdDays.textContent = cdHours.textContent = cdMins.textContent = cdSecs.textContent = '00';
        return;
      }
    }

    const diff  = target - now;
    const days  = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const mins  = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const secs  = Math.floor((diff % (1000 * 60)) / 1000);

    cdDays.textContent  = String(days).padStart(2, '0');
    cdHours.textContent = String(hours).padStart(2, '0');
    cdMins.textContent  = String(mins).padStart(2, '0');
    cdSecs.textContent  = String(secs).padStart(2, '0');

    cdNote.textContent = days === 0
      ? '🎉 The big day is today!'
      : `Just ${days} day${days !== 1 ? 's' : ''} until the celebration! ✨`;
  }

  tick();
  setInterval(tick, 1000);
}

/* ================================================================
   7. SECRET MESSAGE MODAL
================================================================ */
const modalOverlay = document.getElementById('modalOverlay');
const modalBox     = document.getElementById('modalBox');
const modalHearts  = document.getElementById('modalHearts');

function openModal() {
  modalOverlay.classList.add('open');
  document.body.style.overflow = 'hidden';
  spawnModalHearts();
}

function closeModal() {
  modalOverlay.classList.remove('open');
  document.body.style.overflow = '';
  // Clear modal hearts
  setTimeout(() => { modalHearts.innerHTML = ''; }, 500);
}

function closeModalOnOverlay(e) {
  if (e.target === modalOverlay) closeModal();
}

// Keyboard ESC closes modal
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') closeModal();
});

// Spawn floating hearts inside modal
function spawnModalHearts() {
  modalHearts.innerHTML = '';
  const positions = [
    { left: '10%',  top: '80%' }, { left: '85%', top: '75%' },
    { left: '20%',  top: '60%' }, { left: '70%', top: '55%' },
    { left: '50%',  top: '85%' }, { left: '5%',  top: '40%' },
    { left: '90%',  top: '35%' }, { left: '40%', top: '70%' },
  ];

  positions.forEach((pos, i) => {
    const heart = document.createElement('div');
    heart.className    = 'modal-heart-item';
    heart.textContent  = '♥';
    heart.style.left   = pos.left;
    heart.style.top    = pos.top;
    heart.style.animationDelay    = (i * 0.35) + 's';
    heart.style.animationDuration = (2.5 + Math.random()) + 's';
    heart.style.fontSize = (0.8 + Math.random() * 0.8) + 'rem';
    heart.style.color  = ['#f9a8c9','#e8739a','#d4b8f0','#ffb3c6'][i % 4];
    modalHearts.appendChild(heart);
  });
}

/* ================================================================
   8. CONFETTI ANIMATION
================================================================ */
const confettiCanvas = document.getElementById('confettiCanvas');
const confettiCtx    = confettiCanvas.getContext('2d');
let confettiPieces   = [];
let confettiActive   = false;
let confettiRaf      = null;

// Resize canvas to full window
function resizeConfettiCanvas() {
  confettiCanvas.width  = window.innerWidth;
  confettiCanvas.height = window.innerHeight;
}
resizeConfettiCanvas();
window.addEventListener('resize', resizeConfettiCanvas);

// Confetti piece constructor
function ConfettiPiece() {
  this.reset();
}

ConfettiPiece.prototype.reset = function () {
  this.x     = Math.random() * confettiCanvas.width;
  this.y     = -20;
  this.size  = 6 + Math.random() * 10;
  this.speedY = 3 + Math.random() * 4;
  this.speedX = (Math.random() - 0.5) * 3;
  this.rotation = Math.random() * 360;
  this.rotationSpeed = (Math.random() - 0.5) * 6;
  this.shape = Math.random() < 0.5 ? 'rect' : 'circle';
  const colors = [
    '#f9a8c9','#ffd6ba','#d4b8f0','#ff80ab',
    '#ce93d8','#80cbc4','#fff176','#ff8a65',
  ];
  this.color = colors[Math.floor(Math.random() * colors.length)];
  this.alpha = 1;
};

ConfettiPiece.prototype.update = function () {
  this.x        += this.speedX;
  this.y        += this.speedY;
  this.rotation += this.rotationSpeed;
  if (this.y > confettiCanvas.height + 20) this.reset();
};

ConfettiPiece.prototype.draw = function (ctx) {
  ctx.save();
  ctx.globalAlpha = this.alpha;
  ctx.fillStyle   = this.color;
  ctx.translate(this.x, this.y);
  ctx.rotate((this.rotation * Math.PI) / 180);

  if (this.shape === 'circle') {
    ctx.beginPath();
    ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
    ctx.fill();
  } else {
    ctx.fillRect(-this.size / 2, -this.size / 4, this.size, this.size / 2);
  }
  ctx.restore();
};

function launchConfetti() {
  // Create pieces
  confettiPieces = [];
  for (let i = 0; i < 160; i++) {
    const piece = new ConfettiPiece();
    piece.y = Math.random() * -300; // stagger start heights
    confettiPieces.push(piece);
  }

  confettiActive = true;
  let elapsed    = 0;

  function animate() {
    confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces.forEach(p => { p.update(); p.draw(confettiCtx); });

    elapsed++;
    // Run for ~220 frames (~3.7s at 60fps) then fade out
    if (elapsed < 220) {
      confettiRaf = requestAnimationFrame(animate);
    } else {
      // Fade out
      fadeOutConfetti();
    }
  }

  if (confettiRaf) cancelAnimationFrame(confettiRaf);
  confettiRaf = requestAnimationFrame(animate);
}

function fadeOutConfetti() {
  let opacity = 1;
  function fade() {
    opacity -= 0.03;
    confettiCtx.globalAlpha = opacity;
    if (opacity > 0) {
      requestAnimationFrame(fade);
    } else {
      confettiCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      confettiCtx.globalAlpha = 1;
    }
  }
  fade();
}

/* ================================================================
   9. BACKGROUND MUSIC TOGGLE
================================================================ */
const bgMusic   = document.getElementById('bgMusic');
const musicBtn  = document.getElementById('musicBtn');
const musicIcon = document.getElementById('musicIcon');
let   isPlaying = false;

function toggleMusic() {
  if (isPlaying) {
    bgMusic.pause();
    musicIcon.textContent = '▶';
    isPlaying = false;
  } else {
    // Play returns a promise; handle browsers that block autoplay
    const playPromise = bgMusic.play();
    if (playPromise !== undefined) {
      playPromise.then(() => {
        musicIcon.textContent = '⏸';
        isPlaying = true;
      }).catch(() => {
        // Autoplay blocked – show a friendly note
        musicIcon.textContent = '▶';
        console.info('Tip: Replace birthday.mp3 with a real audio file for music to play.');
      });
    }
  }
}

/* ================================================================
   10. SMOOTH SCROLL UTILITY  (already handled by CSS scroll-behavior
       but exposed here for programmatic use if needed)
================================================================ */
function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ================================================================
   INIT  – runs once DOM is ready
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  // Nothing to auto-init here; everything starts after openSurprise()
  // except particles and cursor, which are created at parse time above.
  console.log('🎂 Birthday site loaded — Happy Birthday, Ritika(Rituu Jii)! 🌸');
});