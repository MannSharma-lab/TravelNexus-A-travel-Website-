/* ================== GSAP ANIMATIONS ================== */
window.addEventListener('load', () => {
  gsap.from(".hero h1", {
    y: -50,
    opacity: 0,
    duration: 1.2,
    ease: "power3.out"
  });
});

/* ================== SCROLLREVEAL ================== */
ScrollReveal().reveal('.why-choose .content', {
  delay: 200,
  origin: 'left',
  distance: '50px',
  duration: 800,
  reset: true
});

ScrollReveal().reveal('.why-choose .image', {
  delay: 400,
  origin: 'right',
  distance: '50px',
  duration: 800,
  reset: true
});

ScrollReveal().reveal('.timeline-item', {
  interval: 200,
  origin: 'bottom',
  distance: '60px',
  duration: 900,
  reset: true
});

ScrollReveal().reveal('.review-card', {
  interval: 150,
  origin: 'bottom',
  distance: '50px',
  duration: 800,
  reset: true
});

/* ================== COUNTERS ================== */
function animateCounter(element) {
  const target = +element.getAttribute("data-target");
  const speed = 200;
  const update = () => {
    const value = +element.innerText;
    const increment = Math.ceil(target / speed);
    if (value < target) {
      element.innerText = value + increment;
      setTimeout(update, 20);
    } else {
      element.innerText = target;
    }
  };
  update();
}

const counters = document.querySelectorAll(".counter-box h3");
const options = { threshold: 0.5 };
const observer = new IntersectionObserver((entries, obs) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      obs.unobserve(entry.target);
    }
  });
}, options);

counters.forEach(counter => observer.observe(counter));

/* ================== SCROLL TO TOP ================== */
const scrollToTopButton = document.querySelector(".scroll-to-top");

window.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    scrollToTopButton.classList.add("show");
  } else {
    scrollToTopButton.classList.remove("show");
  }
});

scrollToTopButton.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Testimonials Animation
const reviewCards = document.querySelectorAll(".review-card");
const reviewObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("show");
    }
  });
}, { threshold: 0.3 });

reviewCards.forEach(card => reviewObserver.observe(card));

/* ================== PARTICLES ================== */
if (document.getElementById("particles-js")) {
  particlesJS("particles-js", {
    particles: {
      number: { value: 60, density: { enable: true, value_area: 800 } },
      color: { value: ["#8e44ad","#00f0ff"] },
      shape: { type: "circle" },
      opacity: { value: 0.5, random: true },
      size: { value: 3, random: true },
      move: { enable: true, speed: 2, direction: "none", out_mode: "out" }
    },
    interactivity: {
      detect_on: "canvas",
      events: {
        onhover: { enable: true, mode: "grab" },
        onclick: { enable: true, mode: "push" }
      },
      modes: {
        grab: { distance: 140, line_linked: { opacity: 0.5 } }
      }
    },
    retina_detect: true
  });
}

/* ================== NEON ORBS BACKGROUND ================== */
const canvas = document.getElementById("orbs-canvas");
if (canvas) {
  const ctx = canvas.getContext("2d");

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  class Orb {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.radius = 80 + Math.random() * 100;
      this.dx = (Math.random() - 0.5) * 0.5;
      this.dy = (Math.random() - 0.5) * 0.5;
      this.color = `hsla(${Math.random() * 360}, 50%, 60%, 100)`;
    }
    draw() {
      let gradient = ctx.createRadialGradient(
        this.x, this.y, this.radius * 0.2,
        this.x, this.y, this.radius
      );
      gradient.addColorStop(0, this.color);
      gradient.addColorStop(1, "transparent");
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    update() {
      this.x += this.dx;
      this.y += this.dy;
      if (this.x - this.radius > canvas.width) this.x = -this.radius;
      if (this.x + this.radius < 0) this.x = canvas.width + this.radius;
      if (this.y - this.radius > canvas.height) this.y = -this.radius;
      if (this.y + this.radius < 0) this.y = canvas.height + this.radius;
      this.draw();
    }
  }

  let orbs = [];
  for (let i = 0; i < 10; i++) {
    orbs.push(new Orb());
  }

  function animateOrbs() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    orbs.forEach(o => o.update());
    requestAnimationFrame(animateOrbs);
  }
  animateOrbs();

  window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  });
}