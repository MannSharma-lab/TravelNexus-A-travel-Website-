/* ================== NAVBAR TOGGLE ================== */
const hamburger = document.querySelector('.hamburger');
const navDrawer = document.querySelector('.nav-drawer');

if (hamburger) {
  hamburger.addEventListener('click', () => {
    navDrawer.classList.toggle('open');
    hamburger.classList.toggle('active');
  });
}

/* ================== AUTH / PROFILE ================== */
const profileBtn = document.querySelector('.profile-btn');
const authModal = document.getElementById('authModal');
const closeAuthBtn = document.getElementById('closeModal');
const loginForm = document.getElementById('loginFormModal');
const signupForm = document.getElementById('signupFormModal');
const showSignup = document.getElementById('showSignup');
const showLogin = document.getElementById('showLogin');
const logoutMenu = document.getElementById('logoutMenu');
const logoutBtn = document.getElementById('logoutBtn');

let isLoggedIn = false;
let currentUser = null;

/* Show modal or dropdown */
if (profileBtn) {
  profileBtn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent outside click from closing instantly
    if (isLoggedIn) {
      logoutMenu.classList.toggle("show");
    } else {
      if (authModal) authModal.style.display = 'flex';
    }
  });
}

/* Close modal */
if (closeAuthBtn) {
  closeAuthBtn.addEventListener('click', () => {
    if (authModal) authModal.style.display = 'none';
  });
}

/* Close dropdown when clicking outside */
document.addEventListener("click", (e) => {
  if (logoutMenu && !logoutMenu.contains(e.target) && !profileBtn.contains(e.target)) {
    logoutMenu.classList.remove("show");
  }
});

/* Switch to Signup */
if (showSignup) {
  showSignup.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.remove('active');
    signupForm.classList.add('active');
  });
}

/* Switch to Login */
if (showLogin) {
  showLogin.addEventListener('click', (e) => {
    e.preventDefault();
    signupForm.classList.remove('active');
    loginForm.classList.add('active');
  });
}

/* Handle Login */
if (loginForm) {
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let username = loginForm.querySelector('#loginUsername').value.trim();
    let password = loginForm.querySelector('#loginPassword').value.trim();

    if (username && password) {
      isLoggedIn = true;
      currentUser = username;
      profileBtn.classList.add('logged-in');
      profileBtn.innerHTML = `<span>${username.charAt(0).toUpperCase()}</span>`;
      if (authModal) authModal.style.display = 'none';
      alert(`Welcome back, ${username}!`);
    } else {
      alert("Please enter username and password.");
    }
  });
}

/* Handle Signup */
if (signupForm) {
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    let first = signupForm.querySelector('#firstName').value.trim();
    let last = signupForm.querySelector('#lastName').value.trim();
    let gender = signupForm.querySelector('#gender').value;
    let phone = signupForm.querySelector('#phone').value.trim();
    let email = signupForm.querySelector('#signupEmail').value.trim();
    let user = signupForm.querySelector('#signupUsername').value.trim();
    let pass = signupForm.querySelector('#signupPassword').value.trim();

    if (first && last && gender && phone && email && user && pass) {
      isLoggedIn = true;
      currentUser = user;
      profileBtn.classList.add('logged-in');
      profileBtn.innerHTML = `<span>${user.charAt(0).toUpperCase()}</span>`;
      if (authModal) authModal.style.display = 'none';
      alert(`Thanks for registering, ${first} ${last}!`);
    } else {
      alert("Please fill out all fields.");
    }
  });
}

/* Handle Logout */
if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    isLoggedIn = false;
    currentUser = null;
    profileBtn.classList.remove('logged-in');
    profileBtn.innerHTML = `<i class="fa-regular fa-user" id="userIcon"></i><span id="profileText">Profile</span>`;
    logoutMenu.classList.remove("show");
    alert("Logged out successfully!");
  });
}

/* ================== GSAP ANIMATIONS ================== */
window.addEventListener('load', () => {
  gsap.from(".hero__title", { y: 50, opacity: 0, duration: 1, ease: "power3.out" });
  gsap.from(".hero__subtitle", { y: 50, opacity: 0, duration: 1, delay: 0.3, ease: "power3.out" });
  gsap.from(".hero__cta", { scale: 0.8, opacity: 0, duration: 0.8, delay: 0.6, ease: "back.out(1.7)" });
});

/* ================== SCROLLREVEAL ================== */
if (typeof ScrollReveal !== "undefined") {
  ScrollReveal().reveal('.section-head', { delay: 200, origin: 'bottom', distance: '40px', duration: 800, reset: true });
  ScrollReveal().reveal('.card3d', { interval: 150, origin: 'bottom', distance: '50px', duration: 800, reset: true });
  ScrollReveal().reveal('.pkg', { interval: 200, origin: 'bottom', distance: '60px', duration: 900, reset: true });
  ScrollReveal().reveal('.about-split', { origin: 'left', distance: '70px', duration: 1000, reset: true });
}

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
      events: { onhover: { enable: true, mode: "grab" }, onclick: { enable: true, mode: "push" } },
      modes: { grab: { distance: 140, line_linked: { opacity: 0.5 } } }
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
      this.color = `hsla(${Math.random() * 360}, 70%, 60%, 1)`;
    }
    draw() {
      let gradient = ctx.createRadialGradient(this.x, this.y, this.radius * 0.2, this.x, this.y, this.radius);
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
  for (let i = 0; i < 13; i++) {
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
