//  Starfield Background
const canvas = document.createElement("canvas");
canvas.id = "stars";
document.body.appendChild(canvas);
const ctx = canvas.getContext("2d");

let stars = [];
let w, h;

function initStars() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
  stars = [];
  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * w,
      y: Math.random() * h,
      radius: Math.random() * 1.5,
      speed: Math.random() * 0.5 + 0.2
    });
  }
}

function animateStars() {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "white";
  stars.forEach(star => {
    ctx.beginPath();
    ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
    ctx.fill();
    star.y += star.speed;
    if (star.y > h) star.y = 0;
  });
  requestAnimationFrame(animateStars);
}

window.addEventListener("resize", initStars);
initStars();
animateStars();

// ScrollReveal Animations
window.addEventListener("scroll", () => {
  const reveals = document.querySelectorAll(".box, .heading-title, .filters");
  reveals.forEach(el => {
    const rect = el.getBoundingClientRect();
    if (rect.top < window.innerHeight - 100) {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    }
  });
});

// Apply initial hidden style
document.querySelectorAll(".box, .heading-title, .filters").forEach(el => {
  el.style.opacity = "0";
  el.style.transform = "translateY(40px)";
  el.style.transition = "all 1s ease";
});

//  Filter System (UPDATED)
const filterButtons = document.querySelectorAll(".filter-btn");
const packageBoxes = document.querySelectorAll(".box");
const loadMoreSection = document.querySelector(".load-more");
const loadMoreBtn = document.querySelector(".load-more .btn");

let currentCategory = "all"; // track selected filter

if(loadMoreSection) {
	loadMoreSection.style.display= "none";
}

filterButtons.forEach(button => {
  button.addEventListener("click", () => {
    filterButtons.forEach(btn => btn.classList.remove("active"));
    button.classList.add("active");

    currentCategory = button.getAttribute("data-filter");

    packageBoxes.forEach(box => {
      const boxCategory = box.getAttribute("data-category");

      if (currentCategory === "all" || currentCategory === boxCategory) {
        box.style.display = "block";
        setTimeout(() => (box.style.opacity = "1"), 100);
      } else {
        box.style.opacity = "0";
        setTimeout(() => (box.style.display = "none"), 400);
      }
    });

    //  Handle Load More visibility
    if (currentCategory === "all") {
      loadMoreSection.style.display = "none";
    } else {
      loadMoreSection.style.display = "block";
    }
  });
});

//  Load More Redirect Logic
if (loadMoreBtn) {
  loadMoreBtn.addEventListener("click", () => {
    if (currentCategory === "adventure") {
      window.location.href = "adventure.html";
    } else if (currentCategory === "Couples") {
      window.location.href = "couple.html";
    } else if (currentCategory === "scenery") {
      window.location.href = "Scenary.html";
    } else if (currentCategory === "luxury") {
      window.location.href = "luxury.html";
    }
  });
}