/* ============================
   WATER RIPPLE EFFECT
   ============================ */
const rippleCanvas = document.getElementById("ripple-canvas");
const rippleCtx = rippleCanvas.getContext("2d");
rippleCanvas.width = window.innerWidth;
rippleCanvas.height = window.innerHeight;

function drawRipple(x, y, maxRadius, color) {
  let radius = 0;
  const ripple = setInterval(() => {
    rippleCtx.clearRect(0, 0, rippleCanvas.width, rippleCanvas.height);
    rippleCtx.beginPath();
    rippleCtx.arc(x, y, radius, 0, Math.PI * 2);
    rippleCtx.strokeStyle = color;
    rippleCtx.lineWidth = 2;
    rippleCtx.globalAlpha = 1 - radius / maxRadius;
    rippleCtx.stroke();
    radius += 2;

    if (radius > maxRadius) {
      clearInterval(ripple);
    }
  }, 30);
}

setInterval(() => {
  const x = Math.random() * rippleCanvas.width;
  const y = Math.random() * rippleCanvas.height;
  drawRipple(x, y, 200, "rgba(0,255,195,0.5)");
}, 2000);

/* ============================
   GLOW PARTICLES
   ============================ */
const particleCanvas = document.getElementById("particle-canvas");
const particleCtx = particleCanvas.getContext("2d");
particleCanvas.width = window.innerWidth;
particleCanvas.height = window.innerHeight;

class Particle {
  constructor() {
    this.x = Math.random() * particleCanvas.width;
    this.y = Math.random() * particleCanvas.height;
    this.size = Math.random() * 2 + 1;
    this.speedX = Math.random() * 0.6 - 0.3;
    this.speedY = Math.random() * 0.6 - 0.3;
    this.color = "rgba(0,255,195,0.7)";
  }

  update() {
    this.x += this.speedX;
    this.y += this.speedY;

    if (this.x < 0 || this.x > particleCanvas.width) this.speedX *= -1;
    if (this.y < 0 || this.y > particleCanvas.height) this.speedY *= -1;
  }

  draw() {
    particleCtx.beginPath();
    particleCtx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    particleCtx.fillStyle = this.color;
    particleCtx.shadowColor = "#00ffc3";
    particleCtx.shadowBlur = 10;
    particleCtx.fill();
  }
}

let particles = [];
for (let i = 0; i < 60; i++) {
  particles.push(new Particle());
}

function animateParticles() {
  particleCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles.forEach((p) => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

/* ============================
   VINES ANIMATION
   ============================ */
const vineCanvas = document.getElementById("vines-canvas");
const vineCtx = vineCanvas.getContext("2d");
vineCanvas.width = window.innerWidth;
vineCanvas.height = window.innerHeight;

class Vine {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.length = 0;
    this.maxLength = Math.random() * 100 + 50;
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.03 + 0.01;
    this.color = "rgba(57,255,20,0.6)";
  }

  update() {
    if (this.length < this.maxLength) {
      this.length += 1;
      this.x += Math.cos(this.angle) * this.speed * 50;
      this.y += Math.sin(this.angle) * this.speed * 50;
    }
  }

  draw() {
    vineCtx.beginPath();
    vineCtx.arc(this.x, this.y, 2, 0, Math.PI * 2);
    vineCtx.fillStyle = this.color;
    vineCtx.shadowColor = "#39ff14";
    vineCtx.shadowBlur = 15;
    vineCtx.fill();
  }
}

let vines = [];
for (let i = 0; i < 30; i++) {
  vines.push(new Vine(Math.random() * vineCanvas.width, Math.random() * vineCanvas.height));
}

function animateVines() {
  vineCtx.clearRect(0, 0, vineCanvas.width, vineCanvas.height);
  vines.forEach((v) => {
    v.update();
    v.draw();
  });
  requestAnimationFrame(animateVines);
}
animateVines();

/* ============================
   CARD FADE-IN ANIMATION
   ============================ */
const cards = document.querySelectorAll(".location-card");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in");
      }
    });
  },
  { threshold: 0.2 }
);

cards.forEach((card) => observer.observe(card));