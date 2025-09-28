/* ===========================
   Luxury Cinematic JS
   =========================== */

// ========== CANVAS: Golden Cracks ==========
const crackCanvas = document.getElementById("canvas-cracks");
const crackCtx = crackCanvas.getContext("2d");

function resizeCanvas() {
  crackCanvas.width = window.innerWidth;
  crackCanvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener("resize", resizeCanvas);

let cracks = [];
for (let i = 0; i < 12; i++) {
  cracks.push({
    x: Math.random() * crackCanvas.width,
    y: Math.random() * crackCanvas.height,
    length: 100 + Math.random() * 300,
    angle: Math.random() * Math.PI * 2,
    pulse: 0
  });
}

function drawCracks() {
  crackCtx.clearRect(0, 0, crackCanvas.width, crackCanvas.height);
  cracks.forEach(crack => {
    crackCtx.save();
    crackCtx.translate(crack.x, crack.y);
    crackCtx.rotate(crack.angle);
    let grad = crackCtx.createLinearGradient(0, 0, crack.length, 0);
    grad.addColorStop(0, "rgba(212,175,55,0)");
    grad.addColorStop(0.5, `rgba(212,175,55,${0.4 + Math.sin(crack.pulse) * 0.3})`);
    grad.addColorStop(1, "rgba(212,175,55,0)");
    crackCtx.strokeStyle = grad;
    crackCtx.lineWidth = 2;
    crackCtx.beginPath();
    crackCtx.moveTo(0, 0);
    crackCtx.lineTo(crack.length, 0);
    crackCtx.stroke();
    crackCtx.restore();
    crack.pulse += 0.05;
  });
  requestAnimationFrame(drawCracks);
}
drawCracks();

// ========== CANVAS: Gold Dust Particles ==========
const particleCanvas = document.getElementById("canvas-particles");
const pCtx = particleCanvas.getContext("2d");

function resizeParticles() {
  particleCanvas.width = window.innerWidth;
  particleCanvas.height = window.innerHeight;
}
resizeParticles();
window.addEventListener("resize", resizeParticles);

let particles = [];
for (let i = 0; i < 150; i++) {
  particles.push({
    x: Math.random() * particleCanvas.width,
    y: Math.random() * particleCanvas.height,
    size: Math.random() * 2,
    speedY: 0.2 + Math.random() * 0.5,
    alpha: 0.4 + Math.random() * 0.6
  });
}

function drawParticles() {
  pCtx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
  particles.forEach(p => {
    pCtx.beginPath();
    pCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    pCtx.fillStyle = `rgba(212,175,55,${p.alpha})`;
    pCtx.fill();
    p.y -= p.speedY;
    if (p.y < -5) {
      p.y = particleCanvas.height + 5;
      p.x = Math.random() * particleCanvas.width;
    }
  });
  requestAnimationFrame(drawParticles);
}
drawParticles();

// ========== THREE.JS: Floating Crystal Shards ==========
const shardCanvas = document.getElementById("threejs-shards");
const shardScene = new THREE.Scene();
const shardCamera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const shardRenderer = new THREE.WebGLRenderer({ canvas: shardCanvas, alpha: true });
shardRenderer.setSize(window.innerWidth, window.innerHeight);

const shardGeometry = new THREE.TetrahedronGeometry(1, 0);
let shards = [];

function createShardMaterial() {
  return new THREE.MeshStandardMaterial({
    color: 0xffd70080,         // premium gold
    transparent: true,
    opacity: 0.45,           // translucent effect
    metalness: 1,
    roughness: 0.2,
    emissiveIntensity: 0.2
  });
}

// Create shards
for (let i = 0; i < 15; i++) {
  let mesh = new THREE.Mesh(shardGeometry, createShardMaterial());
  mesh.position.set(
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 15,
    (Math.random() - 0.5) * 15
  );
  shardScene.add(mesh);
  shards.push(mesh);
}

// Lighting
const ambient = new THREE.AmbientLight(0xffd70080, 0.5);
const point = new THREE.PointLight(0xffd70080, 1.5);
point.position.set(5, 5, 5);
shardScene.add(ambient, point);

shardCamera.position.z = 10;

function animateShards() {
  requestAnimationFrame(animateShards);
  shards.forEach(s => {
    s.rotation.x += 0.01;
    s.rotation.y += 0.01;
  });
  shardRenderer.render(shardScene, shardCamera);
}
animateShards();

window.addEventListener("resize", () => {
  shardCamera.aspect = window.innerWidth / window.innerHeight;
  shardCamera.updateProjectionMatrix();
  shardRenderer.setSize(window.innerWidth, window.innerHeight);
});

//  Random 3-shard shine effect
function shardShineEffect() {
  const selectedShards = [];
  while (selectedShards.length < 3) {
    const randomShard = shards[Math.floor(Math.random() * shards.length)];
    if (!selectedShards.includes(randomShard)) {
      selectedShards.push(randomShard);
    }
  }

  selectedShards.forEach(shard => {
    gsap.to(shard.material.emissive, {
      r: 1, g: 0.85, b: 0.3, // golden reflection
      duration: 0.5,
      yoyo: true,
      repeat: 1,
      ease: "power2.inOut"
    });
  });

  setTimeout(shardShineEffect, 1000 + Math.random() * 2000);
}
shardShineEffect();

// ========== GSAP: Hero Orb Explosion ==========
gsap.registerPlugin(ScrollTrigger);

const orb = document.getElementById("hero-orb");
gsap.to(orb, {
  scrollTrigger: {
    trigger: "#destinations",
    start: "top center",
    scrub: 1
  },
  scale: 0.3,
  opacity: 0,
  rotate: 180,
  duration: 2,
  onComplete: () => {
    orb.style.display = "none";
  }
});

// ========== Card Reveal Animations ==========
gsap.utils.toArray(".lux-card").forEach((card, i) => {
  gsap.from(card, {
    scrollTrigger: {
      trigger: card,
      start: "top 80%",
      toggleActions: "play none none reverse"
    },
    y: 100,
    opacity: 0,
    rotateY: -15,
    duration: 1,
    delay: i * 0.2,
    ease: "power3.out"
  });
});