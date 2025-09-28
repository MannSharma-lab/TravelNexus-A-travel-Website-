(function () {
  // Stage entrance
  window.addEventListener("load", () => {
    gsap.fromTo(
      "#card",
      { y: 12, opacity: 0, scale: 0.98 },
      { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "power2.out", delay: 0.1 }
    );
  });

  // Elements
  const form = document.getElementById("bookingForm");
  const stepsEl = Array.from(document.querySelectorAll(".form-step"));
  const stepDots = Array.from(document.querySelectorAll(".step"));
  const progressBar = document.getElementById("progressBar");
  const toast = document.getElementById("toast");

  const el = {
    fullName: document.getElementById("fullName"),
    age: document.getElementById("age"),
    gender: document.getElementById("gender"),
    email: document.getElementById("email"),
    phone: document.getElementById("phone"),
    city: document.getElementById("city"),
    destination: document.getElementById("destination"),
    members: document.getElementById("members"),
    startDate: document.getElementById("startDate"),
    days: document.getElementById("days"),
    timeSlot: document.getElementById("timeSlot"),
    pickup: document.getElementById("pickup"),
    addonsChips: Array.from(document.querySelectorAll(".chip")),
  };

  const live = {
    dest: document.getElementById("live-dest"),
    mem: document.getElementById("live-mem"),
    date: document.getElementById("live-date"),
    days: document.getElementById("live-days"),
    addons: document.getElementById("live-addons"),
    price: document.getElementById("live-price"),
  };

 // Pricing
  const RATES = { bali: 4500, eastjava: 3800, westpapua: 5200, ladakh: 6000, goa: 2500, custom: 100000 };
  const ADDONS = { camping: 1500, guide: 1200, offroad: 2000, meals: 700, privatejet: 30000000, yacht: 150000000, hotel: 8000000 };
  const fmtINR = (n) =>
    new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n || 0);

  // Stepper
  let step = 0;
  const totalSteps = stepsEl.length;

  function goToStep(n) {
    if (n < 0 || n >= totalSteps) return;
    stepsEl[step].hidden = true;
    stepsEl[n].hidden = false;
    gsap.fromTo(stepsEl[n], { y: 8, opacity: 0 }, { y: 0, opacity: 1, duration: 0.35, ease: "power2.out" });
    step = n;
    updateProgress();
    validateCurrentStep();
    if (step === 2) {
      buildFinalSummary();
    }
  }

  function updateProgress() {
    const pct = (step / (totalSteps - 1)) * 100;
    progressBar.style.width = pct + "%";
    document.querySelector(".progress").setAttribute("aria-valuenow", String(Math.round(pct)));
    stepDots.forEach((d, i) => {
      d.classList.toggle("active", i === step);
      d.classList.toggle("done", i < step);
    });
  }

  // Validation helpers
  function setError(inputEl, hasError) {
    const field = inputEl.closest(".field") || inputEl.parentElement;
    if (!field) return;
    field.classList.toggle("has-error", !!hasError);
  }
  const isName = (v) => /^[A-Za-z ]{2,40}$/.test((v || "").trim());
  const isAge = (v) => Number(v) >= 5 && Number(v) <= 100;
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test((v || "").trim());
  const req = (v) => (v || "").toString().trim().length > 0;
  const intRange = (v, min, max) => {
    const n = Number(v);
    return Number.isFinite(n) && n >= min && n <= max;
  };
  const futureDate = (v) => {
    if (!v) return false;
    const t = new Date();
    t.setHours(0, 0, 0, 0);
    const d = new Date(v);
    d.setHours(0, 0, 0, 0);
    return d.getTime() >= t.getTime();
  };

  function validateStep0() {
    setError(el.fullName, !isName(el.fullName.value));
    setError(el.age, !isAge(el.age.value));
    setError(el.gender, !req(el.gender.value));
    setError(el.email, !isEmail(el.email.value));
    setError(el.city, !req(el.city.value));
    return (
      document.querySelectorAll('[data-step="0"] .has-error').length === 0 &&
      isName(el.fullName.value) &&
      isAge(el.age.value) &&
      req(el.gender.value) &&
      isEmail(el.email.value) &&
      req(el.city.value)
    );
  }

  function validateStep1() {
    setError(el.destination, !req(el.destination.value));
    setError(el.members, !intRange(el.members.value, 1, 20));
    setError(el.startDate, !futureDate(el.startDate.value));
    setError(el.days, !intRange(el.days.value, 1, 30));
    setError(el.timeSlot, !req(el.timeSlot.value));
    setError(el.pickup, !req(el.pickup.value));
    return (
      document.querySelectorAll('[data-step="1"] .has-error').length === 0 &&
      req(el.destination.value) &&
      intRange(el.members.value, 1, 20) &&
      futureDate(el.startDate.value) &&
      intRange(el.days.value, 1, 30) &&
      req(el.timeSlot.value) &&
      req(el.pickup.value)
    );
  }

  function validateCurrentStep() {
    const nextBtn = stepsEl[step].querySelector(".next");
    const submitBtn = stepsEl[step].querySelector(".submit");
    let ok = true;
    if (step === 0) ok = validateStep0();
    if (step === 1) ok = validateStep1();
    if (step === 2) ok = document.getElementById("agree").checked;
    if (nextBtn) nextBtn.disabled = !ok;
    if (submitBtn) submitBtn.disabled = !ok;
    return ok;
  }

  // Live summary & pricing
  function selectedAddons() {
    return el.addonsChips
      .map((c) => ({ label: c.textContent.trim(), v: c.querySelector("input").value, checked: c.querySelector("input").checked }))
      .filter((x) => x.checked);
  }
  function calcPrice() {
    const dest = el.destination.value || "custom";
    const members = Math.max(0, Number(el.members.value || 0));
    const days = Math.max(0, Number(el.days.value || 0));
    if (!members || !days) return 0;
    const base = RATES[dest] ?? RATES.custom;
    let total = base * members * days;
    for (const ad of selectedAddons()) {
      total += (ADDONS[ad.v] || 0) * days;
    }
    return total;
  }
  function formatDateRange() {
    if (!el.startDate.value || !el.days.value) return "—";
    const start = new Date(el.startDate.value);
    const days = Number(el.days.value);
    const end = new Date(start);
    end.setDate(start.getDate() + Math.max(0, days - 1));
    const opts = { day: "2-digit", month: "short", year: "numeric" };
    return `${start.toLocaleDateString("en-GB", opts)} → ${end.toLocaleDateString("en-GB", opts)}`;
  }

  function updateLive() {
    const map = { bali: "Bali", eastjava: "East Java", westpapua: "West Papua", ladakh: "Ladakh", goa: "Goa" };
    live.dest.textContent = map[el.destination.value] || "—";
    live.mem.textContent = el.members.value || "—";
    live.date.textContent = formatDateRange();
    live.days.textContent = el.days.value || "—";
    const ads = selectedAddons().map((a) => a.label).join(", ");
    live.addons.textContent = ads || "None";
    live.price.textContent = fmtINR(calcPrice());
  }

  // Events
  form.addEventListener("input", (e) => {
    if (e.target.closest(".chip")) {
      e.target.closest(".chip").classList.toggle("active", e.target.checked);
    }
    validateCurrentStep();
    updateLive();
    saveDraft();
  });

  form.addEventListener("click", (e) => {
    if (e.target.classList.contains("next")) {
      if (step === 0 && !validateStep0()) return;
      if (step === 1 && !validateStep1()) return;
      goToStep(step + 1);
    }
    if (e.target.classList.contains("back")) {
      goToStep(step - 1);
    }
  });

  document.getElementById("agree").addEventListener("change", validateCurrentStep);

  function buildFinalSummary() {
    const box = document.getElementById("summary");
    const ads = selectedAddons().map((a) => a.label).join(", ") || "None";
    const obj = {
      Name: el.fullName.value,
      Email: el.email.value,
      City: el.city.value,
      "Age / Gender": `${el.age.value} / ${el.gender.value || "—"}`,
      Destination: document.querySelector("#destination option:checked")?.textContent || "—",
      Members: el.members.value,
      Dates: formatDateRange(),
      "Time slot": el.timeSlot.value || "—",
      Pickup: el.pickup.value || "—",
      "Add-ons": ads,
    };
    box.innerHTML =
      Object.entries(obj)
        .map(([k, v]) => `<div class="sum-row"><span>${k}</span><strong>${v || "—"}</strong></div>`)
        .join("") +
      `
    <div class="sum-price"><span>Total (est.)</span><strong>${fmtINR(calcPrice())}</strong></div>
    <div class="tiny"><i class="fa-solid fa-shield-halved"></i> Review & confirm. You can edit previous steps anytime.</div>`;
  }

  // Toast
  let toastTimer;
  function showToast(msg) {
    if (!toast) return;
    toast.innerHTML = `<i class="fa-solid fa-check-circle"></i> ${msg}`;
    toast.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("show"), 1500);
  }

  // Draft (LocalStorage)
  const STORE_KEY = "tripbuddy_booking_draft_v2";
  function saveDraft() {
    const data = {
      fullName: el.fullName.value,
      age: el.age.value,
      gender: el.gender.value,
      email: el.email.value,
      phone: el.phone.value,
      city: el.city.value,
      destination: el.destination.value,
      members: el.members.value,
      startDate: el.startDate.value,
      days: el.days.value,
      timeSlot: el.timeSlot.value,
      pickup: el.pickup.value,
      addons: selectedAddons().map((a) => a.v),
    };
    localStorage.setItem(STORE_KEY, JSON.stringify(data));
    showToast("Booking saved locally.");
  }
  function loadDraft() {
    const raw = localStorage.getItem(STORE_KEY);
    if (!raw) return;
    try {
      const d = JSON.parse(raw);
      for (const k in d) {
        if (k === "addons") {
          el.addonsChips.forEach((ch) => {
            const inp = ch.querySelector("input");
            inp.checked = d.addons.includes(inp.value);
            ch.classList.toggle("active", inp.checked);
          });
        } else if (el[k] !== undefined) {
          el[k].value = d[k];
        }
      }
    } catch (e) {}
  }

  // Submit (frontend only)
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!document.getElementById("agree").checked) {
      showToast("Please agree to the terms.");
      return;
    }
    saveDraft();
    showToast("Booking submitted! (DB in next phase)");
    setTimeout(() => {
      window.location.href = "#";
    }, 1200);
  });

  // Init
  (function init() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isoToday = today.toISOString().split("T")[0];
    el.startDate.setAttribute("min", isoToday);
    el.addonsChips.forEach((ch) => {
      ch.addEventListener("click", () => {
        const inp = ch.querySelector("input");
        setTimeout(() => ch.classList.toggle("active", inp.checked), 0);
      });
    });
    loadDraft();
    updateLive();
    validateCurrentStep();
    stepsEl.forEach((s, i) => (s.hidden = i !== 0));
  })();
})();