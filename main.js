/* ============================================================
   Solis Day — interactions
   - Sticky header state on scroll
   - Mobile menu toggle
   - Reveal-on-scroll with staggered delays
   - Animated meta counters
   - Enquiry form validation + status
   - Footer year
   - Philosophy read-more toggle
   ============================================================ */

const prefersReduced = window.matchMedia(
  "(prefers-reduced-motion: reduce)"
).matches;

/* ---------- Sticky header ---------- */
const header = document.getElementById("siteHeader");
const onScroll = () => {
  if (window.scrollY > 24) header.classList.add("is-scrolled");
  else header.classList.remove("is-scrolled");
};
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

/* ---------- Mobile menu ---------- */
const menuToggle = document.getElementById("menuToggle");
const mobileNav = document.getElementById("mobileNav");
const mobileNavClose = document.getElementById("mobileNavClose");

const setMenu = (open) => {
  menuToggle.classList.toggle("is-open", open);
  mobileNav.classList.toggle("is-open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  mobileNav.setAttribute("aria-hidden", String(!open));
  document.body.style.overflow = open ? "hidden" : "";
};

menuToggle.addEventListener("click", () => {
  setMenu(!menuToggle.classList.contains("is-open"));
});

mobileNavClose.addEventListener("click", () => setMenu(false));

mobileNav.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => setMenu(false))
);

window.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && menuToggle.classList.contains("is-open")) {
    setMenu(false);
  }
});

/* ---------- Reveal on scroll ---------- */
const revealEls = document.querySelectorAll(".reveal");

if (prefersReduced) {
  revealEls.forEach((el) => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const delay = Number(el.dataset.delay) || 0;
          setTimeout(() => el.classList.add("is-in"), delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  revealEls.forEach((el) => io.observe(el));
}

/* ---------- Animated counters ---------- */
const counters = document.querySelectorAll(".meta-num");

const animateCount = (el) => {
  const target = Number(el.dataset.count) || 0;
  if (prefersReduced) {
    el.textContent = String(target);
    return;
  }
  const duration = 1600;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = String(Math.round(target * eased));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if (counters.length) {
  const cio = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animateCount(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.6 }
  );
  counters.forEach((el) => cio.observe(el));
}

/* ---------- Enquiry form ---------- */
const form = document.getElementById("enquiryForm");
const status = document.getElementById("formStatus");

const setStatus = (msg, isError = false) => {
  status.textContent = msg;
  status.classList.toggle("is-error", isError);
};

if (form) {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();

    if (!name || !email || !message) {
      setStatus("Please complete the required fields.", true);
      return;
    }
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!emailOk) {
      setStatus("That email address doesn't look quite right.", true);
      return;
    }

    setStatus("Sending\u2026");
    setTimeout(() => {
      setStatus(
        `Thank you, ${name.split(" ")[0]}. Your enquiry has been received \u2014 we\u2019ll be in touch shortly.`
      );
      form.reset();
    }, 700);
  });
}

/* ---------- Footer year ---------- */
const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/* ---------- Marquee ---------- */
const marqueeInner = document.querySelector(".marquee-inner");
if (marqueeInner) {
  let pos = 0;
  const speed = 0.6; // px per frame
  const tick = () => {
    const halfWidth = marqueeInner.scrollWidth / 2;
    pos -= speed;
    if (pos <= -halfWidth) pos = 0;
    marqueeInner.style.transform = `translateX(${pos}px)`;
    requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- Philosophy read-more toggle ---------- */
const philosophyToggle = document.getElementById("philosophyToggle");
const philosophySection = document.getElementById("philosophy");

if (philosophyToggle && philosophySection) {
  philosophyToggle.addEventListener("click", () => {
    const expanded = philosophySection.classList.toggle("philosophy-expanded");
    philosophyToggle.setAttribute("aria-expanded", String(expanded));
    philosophyToggle.textContent = expanded ? "Read less" : "Read more";
  });
}

/* ---------- Process carousel ---------- */
const track = document.getElementById("processTrack");
const prevBtn = document.getElementById("processPrev");
const nextBtn = document.getElementById("processNext");
const dotsContainer = document.getElementById("processDots");

if (track && prevBtn && nextBtn && dotsContainer) {
  const slides = Array.from(track.querySelectorAll(".process-slide"));
  let current = 0;

  const dots = slides.map((_, i) => {
    const dot = document.createElement("button");
    dot.className = "process-dot" + (i === 0 ? " is-active" : "");
    dot.setAttribute("role", "tab");
    dot.setAttribute("aria-label", `Step ${i + 1}`);
    dot.addEventListener("click", () => goTo(i, i < current));
    dotsContainer.appendChild(dot);
    return dot;
  });

  const goTo = (index, reverse = false) => {
    slides[current].classList.remove("is-active");
    dots[current].classList.remove("is-active");
    current = index;
    const slide = slides[current];
    slide.classList.toggle("slide-back", reverse);
    slide.classList.add("is-active");
    void slide.offsetWidth;
    dots[current].classList.add("is-active");
    prevBtn.disabled = current === 0;
    nextBtn.disabled = current === slides.length - 1;
  };

  goTo(0);

  prevBtn.addEventListener("click", () => {
    if (current > 0) goTo(current - 1, true);
  });
  nextBtn.addEventListener("click", () => {
    if (current < slides.length - 1) goTo(current + 1, false);
  });

  let touchStartX = 0;
  track.addEventListener("touchstart", (e) => {
    touchStartX = e.touches[0].clientX;
  }, { passive: true });
  track.addEventListener("touchend", (e) => {
    const delta = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(delta) < 40) return;
    if (delta > 0 && current < slides.length - 1) goTo(current + 1, false);
    if (delta < 0 && current > 0) goTo(current - 1, true);
  }, { passive: true });

  document.addEventListener("keydown", (e) => {
    const inProcess = document.getElementById("process")?.contains(document.activeElement);
    if (!inProcess && document.activeElement !== document.body) return;
    if (e.key === "ArrowRight" && current < slides.length - 1) goTo(current + 1, false);
    if (e.key === "ArrowLeft" && current > 0) goTo(current - 1, true);
  });
}
