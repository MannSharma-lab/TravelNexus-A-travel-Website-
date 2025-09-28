// script.js

function showLoading(callback) {
  document.getElementById("content").classList.add("blurred");
  const loader = document.getElementById("loading-screen");
  loader.classList.add("active");

  setTimeout(() => {
    loader.classList.remove("active");
    document.getElementById("content").classList.remove("blurred");
    if (callback) callback();
  }, 2000); // 2 sec
}

// Links with loader
document.querySelectorAll(".navigate").forEach(link => {
  link.addEventListener("click", function(event) {
    event.preventDefault();
    const url = this.getAttribute("href");
    showLoading(() => {
      window.location.href = url;
    });
  });
});

// Page load loader (optional)
window.addEventListener("load", () => {
  const loader = document.getElementById("loading-screen");
  loader.classList.add("active");
  setTimeout(() => loader.classList.remove("active"), 1500);
});
