/* youngsters.js — Neon Current: Follow the Neon Current
   Replaces / upgrades previous jungle-strip behavior with a canvas particle flow,
   rails parallax and pulsing indicators. Vanilla JS, mobile touch support.
*/

document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------
     Basic helpers
     --------------------------- */
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const rand = (min, max) => Math.random() * (max - min) + min;

  /* ---------------------------
     Elements
     --------------------------- */
  const stripStage = document.querySelector(".strip-stage") || document.querySelector(".jungle-strip .strip-stage");
  const rails = document.querySelectorAll(".leaf-rail");
  const indicators = document.querySelectorAll(".strip-indicators .indicator");
  const heroCtaBtn = document.querySelector("[data-scroll]") || document.querySelector("[data-action='explore']");
  const yearEl = document.getElementById("year");

  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------------------
     Create canvas inside stripStage
     --------------------------- */
  let canvas, ctx, DPR = window.devicePixelRatio || 1;
  if (stripStage) {
    canvas = document.createElement("canvas");
    canvas.className = "neon-current-canvas";
    canvas.style.position = "absolute";
    canvas.style.inset = "0";
    canvas.style.pointerEvents = "none";
    canvas.style.zIndex = "2";
    stripStage.appendChild(canvas);
    ctx = canvas.getContext("2d");
  }

  /* ---------------------------
     Resize handling
     --------------------------- */
  function resizeCanvas() {
    if (!canvas || !stripStage) return;
    const rect = stripStage.getBoundingClientRect();
    canvas.width = Math.floor(rect.width * DPR);
    canvas.height = Math.floor(rect.height * DPR);
    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener("resize", resizeCanvas);
  // initial
  resizeCanvas();

  /* ---------------------------
     Particle system (neon droplets)
     --------------------------- */
  const particles = [];
  const MAX_PARTICLES = 180;
  const FLOW_SPEED = 0.6; // base lateral flow (px per frame)
  const COLORS = ["#00ffaa", "#00e0ff", "#ff3cff"];

  function spawnParticle(x, y, vx = 0, vy = 0, color) {
    if (particles.length >= MAX_PARTICLES) return;
    particles.push({
      x: x,
      y: y,
      vx: vx + rand(-0.2, 0.2),
      vy: vy + rand(-0.1, 0.1),
      life: rand(0.9, 1.8),
      age: 0,
      size: rand(1.2, 3.8),
      color: color || COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1
    });
  }

  /* ---------------------------
     Pointer & current field
     --------------------------- */
  let pointer = { x: -1000, y: -1000, active: false };
  // global current vector that gently flows horizontally and oscillates
  let currentOffset = 0;
  function updateCurrentOffset(dt) {
    currentOffset += dt * 0.0006; // slow time factor
  }

  // pointer events (mouse + touch)
  if (stripStage) {
    stripStage.addEventListener("mousemove", (e) => {
      const r = stripStage.getBoundingClientRect();
      pointer.x = e.clientX - r.left;
      pointer.y = e.clientY - r.top;
      pointer.active = true;
      // spawn a few on move
      for (let i = 0; i < 2; i++) {
        spawnParticle(pointer.x + rand(-6, 6), pointer.y + rand(-6, 6), 0.6, rand(-0.2, 0.2));
      }
    });
    stripStage.addEventListener("mouseleave", () => {
      pointer.active = false;
    });

    // touch support
    stripStage.addEventListener("touchstart", (ev) => {
      const t = ev.touches[0];
      const r = stripStage.getBoundingClientRect();
      pointer.x = t.clientX - r.left;
      pointer.y = t.clientY - r.top;
      pointer.active = true;
      ev.preventDefault();
      for (let i = 0; i < 4; i++) spawnParticle(pointer.x + rand(-8, 8), pointer.y + rand(-8, 8), 1, rand(-0.4, 0.4));
    }, { passive: false });
    stripStage.addEventListener("touchmove", (ev) => {
      const t = ev.touches[0];
      const r = stripStage.getBoundingClientRect();
      pointer.x = t.clientX - r.left;
      pointer.y = t.clientY - r.top;
      pointer.active = true;
      ev.preventDefault();
      for (let i = 0; i < 2; i++) spawnParticle(pointer.x + rand(-6, 6), pointer.y + rand(-6, 6), 0.6, rand(-0.2, 0.2));
    }, { passive: false });
    stripStage.addEventListener("touchend", () => { pointer.active = false; });
  }

  /* ---------------------------
     Rails animation (parallax-like)
     --------------------------- */
  rails.forEach((rail, idx) => {
    let speed = parseFloat(rail.dataset.speed || (0.5 + idx * 0.3));
    // animate via requestAnimationFrame for smoothness
    let t = 0;
    function railFrame() {
      t += 0.016 * speed;
      // translateX cycles left->right with sinusoidal easing; using percent
      const cycle = (t % 1000) / 1000;
      const xPct = -20 + 140 * cycle; // -20% to 120% (approx)
      rail.style.transform = `translate(${xPct}%, -50%)`;
      requestAnimationFrame(railFrame);
    }
    railFrame();
  });

  /* ---------------------------
     Indicators pulse
     --------------------------- */
  if (indicators && indicators.length) {
    let pulseIdx = 0;
    setInterval(() => {
      indicators.forEach((el, i) => {
        el.style.opacity = "0.25";
        el.style.transform = "scale(1)";
      });
      const el = indicators[pulseIdx % indicators.length];
      if (el) {
        el.style.opacity = "0.95";
        el.style.transform = "scale(1.25)";
        el.style.transition = "transform 420ms cubic-bezier(.2,.9,.3,1), opacity 420ms ease";
      }
      pulseIdx++;
    }, 700);
  }

  /* ---------------------------
     Animation loop
     --------------------------- */
  let last = performance.now();
  function frame(now) {
    const dt = now - last;
    last = now;
    updateCurrentOffset(dt);

    // clear
    if (ctx && canvas) {
      ctx.clearRect(0, 0, canvas.width / DPR, canvas.height / DPR);

      // subtle trailing glow background (soft gradient)
      const g = ctx.createLinearGradient(0, 0, canvas.width / DPR, 0);
      g.addColorStop(0, "rgba(0, 255, 170, 0.02)");
      g.addColorStop(0.5, "rgba(0, 224, 255, 0.02)");
      g.addColorStop(1, "rgba(255, 60, 255, 0.02)");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, canvas.width / DPR, canvas.height / DPR);

      // update & draw particles
      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i];

        // flow field: a base horizontal flow + sinusoidal vertical wobble influenced by currentOffset
        const flowX = FLOW_SPEED * (1 + 0.5 * Math.sin(currentOffset * 6 + p.y * 0.01));
        const flowY = 0.6 * Math.sin((p.x * 0.01) + currentOffset * 3);

        // attraction to pointer if active
        if (pointer.active) {
          const dx = pointer.x - p.x;
          const dy = pointer.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const attract = clamp(120 / (dist + 20), 0, 1.6);
          p.vx += (dx / (dist + 1)) * 0.02 * attract;
          p.vy += (dy / (dist + 1)) * 0.01 * attract;
        } else {
          // slight random drift
          p.vx += rand(-0.02, 0.02);
          p.vy += rand(-0.02, 0.02);
        }

        // apply flow
        p.vx += flowX * 0.01;
        p.vy += flowY * 0.01;

        // integrate
        p.x += p.vx;
        p.y += p.vy;

        // aging
        p.age += dt * 0.001;
        p.alpha = clamp(1 - (p.age / p.life), 0, 1);

        // edges wrap horizontally: interesting neon loop
        const W = canvas.width / DPR;
        const H = canvas.height / DPR;
        if (p.x > W + 30) p.x = -30;
        if (p.x < -30) p.x = W + 30;
        if (p.y > H + 30) p.y = -30;
        if (p.y < -30) p.y = H + 30;

        // draw glow (soft radial)
        ctx.beginPath();
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 6);
        grad.addColorStop(0, `rgba(255,255,255,${0.6 * p.alpha})`);
        grad.addColorStop(0.08, `${hexToRgba(p.color, 0.6 * p.alpha)}`);
        grad.addColorStop(0.4, `${hexToRgba(p.color, 0.15 * p.alpha)}`);
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = grad;
        ctx.arc(p.x, p.y, p.size * 6, 0, Math.PI * 2);
        ctx.fill();

        // small core dot
        ctx.fillStyle = hexToRgba(p.color, 0.9 * p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();

        // remove if too old
        if (p.age >= p.life) particles.splice(i, 1);
      }

      // ambient spawn: occasional gentle particles coming from left edge (neon current)
      if (Math.random() < 0.6) {
        const H = canvas.height / DPR;
        const y = rand(H * 0.05, H * 0.95);
        spawnParticle(-10 + rand(-6, 6), y, rand(FLOW_SPEED * 0.6, FLOW_SPEED * 1.6), rand(-0.2, 0.2), COLORS[Math.floor(Math.random() * COLORS.length)]);
      }
    }

    requestAnimationFrame(frame);
  }

  // helper to convert hex -> rgba
  function hexToRgba(hex, a = 1) {
    // support e.g. #00ffaa or #0fa
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map(s => s + s).join("");
    const r = parseInt(c.substr(0,2),16);
    const g = parseInt(c.substr(2,2),16);
    const b = parseInt(c.substr(4,2),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  // start loop
  requestAnimationFrame(frame);

  /* ---------------------------
     Small UX polish: rail hover 'gust' + card hover spark
     --------------------------- */
  const adventureCards = document.querySelectorAll(".adventure-card");
  adventureCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
      // spawn a quick burst near the card center
      const rect = card.getBoundingClientRect();
      const stageRect = stripStage ? stripStage.getBoundingClientRect() : null;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      if (stageRect) {
        // spawn relative to stripStage if visible
        const rx = clamp(cx - stageRect.left, 0, stageRect.width);
        const ry = clamp(cy - stageRect.top, 0, stageRect.height);
        for (let i = 0; i < 12; i++) spawnParticle(rx + rand(-20, 20), ry + rand(-20, 20), rand(0.6, 2.2), rand(-1,1));
      } else {
        for (let i = 0; i < 12; i++) spawnParticle(rand(0, canvas.width / DPR), rand(0, canvas.height / DPR), rand(0.6, 2.2), rand(-1,1));
      }
      card.style.boxShadow = "0 0 36px rgba(0,255,170,0.18)";
      setTimeout(() => card.style.boxShadow = "", 700);
    });
  });

  /* ---------------------------
     Optional: smooth scroll from hero CTA into stripStage
     --------------------------- */
  if (heroCtaBtn && stripStage) {
    heroCtaBtn.addEventListener("click", (e) => {
      e.preventDefault();
      stripStage.scrollIntoView({ behavior: "smooth", block: "center" });
      // small initial particle burst to greet visitor
      const r = stripStage.getBoundingClientRect();
      const x = r.width * 0.2;
      const y = r.height * 0.5;
      for (let i = 0; i < 30; i++) spawnParticle(x + rand(-40, 40), y + rand(-40, 40), rand(0.8, 2.4), rand(-0.8, 0.8));
    });
  }

  /* ---------------------------
     Keep canvas sized when stage position changes (mutation observer)
     --------------------------- */
  if (stripStage) {
    const mo = new MutationObserver(() => resizeCanvas());
    mo.observe(stripStage, { attributes: true, childList: false, subtree: false });
  }

  /* ---------------------------
     Accessibility & fallback: if canvas not present, create subtle CSS glow on .leaf-rail
     --------------------------- */
  if (!canvas) {
    rails.forEach((r, i) => {
      r.style.transition = "transform 1s linear";
    });
  }

  // End of DOMContentLoaded
});
/* ---------------------------
   Background Neon Orbs (fixed)
   --------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  const orbCanvas = document.getElementById("bg-orbs");
  if (!orbCanvas) return;
  const ctx = orbCanvas.getContext("2d");
  const DPR = window.devicePixelRatio || 1;
  let orbs = [];

  function resizeOrbs() {
    orbCanvas.width = window.innerWidth * DPR;
    orbCanvas.height = window.innerHeight * DPR;
    orbCanvas.style.width = window.innerWidth + "px";
    orbCanvas.style.height = window.innerHeight + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }
  window.addEventListener("resize", resizeOrbs);
  resizeOrbs();

  const COLORS = ["#00ffaa", "#00e0ff", "#ff00ff"];

  function createOrbs() {
    orbs = [];
    for (let i = 0; i < 15; i++) {
      orbs.push({
        x: Math.random() * (orbCanvas.width / DPR),
        y: Math.random() * (orbCanvas.height / DPR),
        r: Math.random() * 40 + 30,
        dx: (Math.random() - 0.5) * 0.2, // slower drift
        dy: (Math.random() - 0.5) * 0.2,
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
        pulse: Math.random() * Math.PI * 2
      });
    }
  }
  createOrbs();

  function drawOrbs() {
    ctx.clearRect(0, 0, orbCanvas.width / DPR, orbCanvas.height / DPR);

    orbs.forEach(o => {
      // update position
      o.x += o.dx;
      o.y += o.dy;
      o.pulse += 0.008;

      // wrap around edges instead of bouncing
      if (o.x - o.r > orbCanvas.width / DPR) o.x = -o.r;
      if (o.x + o.r < 0) o.x = orbCanvas.width / DPR + o.r;
      if (o.y - o.r > orbCanvas.height / DPR) o.y = -o.r;
      if (o.y + o.r < 0) o.y = orbCanvas.height / DPR + o.r;

      // glow effect
      const grad = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r * 2.2);
      grad.addColorStop(0, `rgba(255,255,255,0.25)`);
      grad.addColorStop(0.25, hexToRgba(o.color, 0.25 + 0.15 * Math.sin(o.pulse)));
      grad.addColorStop(1, "rgba(0,0,0,0)");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(o.x, o.y, o.r * 2.2, 0, Math.PI * 2);
      ctx.fill();
    });

    requestAnimationFrame(drawOrbs);
  }

  function hexToRgba(hex, a = 1) {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map(s => s + s).join("");
    const r = parseInt(c.substr(0,2),16);
    const g = parseInt(c.substr(2,2),16);
    const b = parseInt(c.substr(4,2),16);
    return `rgba(${r},${g},${b},${a})`;
  }

  drawOrbs();
});