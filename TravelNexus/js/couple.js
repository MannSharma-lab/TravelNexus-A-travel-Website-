// ========== Floating Neon Hearts ==========
function createHeart() {
  const heart = document.createElement("div");
  heart.classList.add("floating-heart");
  heart.innerHTML = "❤️";
  document.body.appendChild(heart);

  // Random position & size
  heart.style.left = Math.random() * 100 + "vw";
  heart.style.fontSize = (Math.random() * 20 + 20) + "px";
  heart.style.opacity = Math.random();

  // Animation duration
  const duration = Math.random() * 5 + 5; // 5–10s
  heart.style.animation = `floatUp ${duration}s linear`;

  // Remove after animation
  setTimeout(() => {
    heart.remove();
  }, duration * 1000);
}

// Spawn hearts every 700ms
setInterval(createHeart, 700);

// Add CSS for hearts dynamically
const heartStyle = document.createElement("style");
heartStyle.innerHTML = `
.floating-heart {
  position: fixed;
  bottom: -50px;
  color: #ff4da6;
  text-shadow: 0 0 15px #ff4da6, 0 0 30px #ff80df;
  pointer-events: none;
  z-index: 9999;
}
@keyframes floatUp {
  0% { transform: translateY(0) scale(1); opacity: 1; }
  50% { opacity: 0.7; }
  100% { transform: translateY(-110vh) scale(1.5); opacity: 0; }
}
`;
document.head.appendChild(heartStyle);

// ========== Planets Circular Orbit ==========
function orbitPlanets() {
  const leftPlanet = document.querySelector(".planet-left");
  const rightPlanet = document.querySelector(".planet-right");

  let angleLeft = 0;
  let angleRight = 180;

  setInterval(() => {
    angleLeft += 0.5;
    angleRight += 0.4;

    if (leftPlanet) {
      const x = 150 * Math.cos((angleLeft * Math.PI) / 180);
      const y = 80 * Math.sin((angleLeft * Math.PI) / 180);
      leftPlanet.style.transform = `translate(${x}px, ${y}px)`;
    }

    if (rightPlanet) {
      const x = 200 * Math.cos((angleRight * Math.PI) / 180);
      const y = 120 * Math.sin((angleRight * Math.PI) / 180);
      rightPlanet.style.transform = `translate(${x}px, ${y}px)`;
    }
  }, 50);
}
orbitPlanets();

// ========== Candle Sparks Flicker ==========
function createSpark() {
  const spark = document.createElement("div");
  spark.classList.add("spark");
  document.body.appendChild(spark);

  // Random position
  spark.style.left = Math.random() * window.innerWidth + "px";
  spark.style.top = Math.random() * window.innerHeight + "px";

  // Lifetime
  setTimeout(() => {
    spark.remove();
  }, 2000);
}

// Create sparks randomly
setInterval(createSpark, 800);

// Spark CSS
const sparkStyle = document.createElement("style");
sparkStyle.innerHTML = `
.spark {
  position: fixed;
  width: 4px; height: 4px;
  background: gold;
  border-radius: 50%;
  box-shadow: 0 0 10px gold, 0 0 20px orange;
  opacity: 0.8;
  animation: sparkFlicker 2s ease-out;
  z-index: 5;
}
@keyframes sparkFlicker {
  0% { transform: scale(0.5); opacity: 0.8; }
  50% { transform: scale(1.5); opacity: 0.3; }
  100% { transform: scale(0); opacity: 0; }
}
`;
document.head.appendChild(sparkStyle);
