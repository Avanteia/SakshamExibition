// ============================================================
// सक्षम — SAKSHAM  |  shared site behaviour
// ============================================================

const WA_NUMBER = "917083677595"; // primary WhatsApp contact (country code + number)

// Google Apps Script Web App URL bound to the registrations Google Sheet.
// See google-apps-script.gs for the script to deploy and paste the /exec URL here.
const SHEETS_ENDPOINT = "PASTE_YOUR_GOOGLE_APPS_SCRIPT_WEB_APP_URL_HERE";

function waLink(message){
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(message)}`;
}

/* ---------- Icon set (formal, rounded line icons — replaces emoji) ---------- */
const ICON_ATTRS = 'viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round"';
const ICONS = {
  whatsapp: `<svg viewBox="0 0 24 24"><path d="M4 20l1.3-3.9A8 8 0 1 1 8.8 19L4 20z" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"/><path fill="currentColor" stroke="none" d="M9.4 8.6c.2-.5.4-.5.6-.5h.5c.2 0 .4 0 .5.4.2.4.7 1.6.8 1.7.1.1.1.3 0 .5-.1.2-.2.3-.3.4-.1.2-.3.3-.1.6.2.4.7 1 1.5 1.6 1 .8 1.3.7 1.5.6.2-.1.7-.4.9-.6.2-.2.3-.2.5-.1.2.1 1.4.7 1.6.8.2.1.4.1.4.3.1.2.1.7-.2 1.4-.3.7-1.4 1.3-2 1.3-.5 0-2-.2-3.7-1.5-2-1.5-3.3-3.3-3.4-3.5-.2-.2-1-1.4-1-2.7 0-.4.1-.8.2-1.1z"/></svg>`,
  calendar: `<svg ${ICON_ATTRS}><rect x="3" y="4.5" width="18" height="16" rx="3"/><path d="M3 9.5h18"/><path d="M8 2.5v4M16 2.5v4"/></svg>`,
  clock: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="9"/><path d="M12 7.5V12l3 2"/></svg>`,
  pin: `<svg ${ICON_ATTRS}><path d="M12 21s-7-6.4-7-11.5A7 7 0 0 1 19 9.5C19 14.6 12 21 12 21z"/><circle cx="12" cy="9.5" r="2.4"/></svg>`,
  ticket: `<svg ${ICON_ATTRS}><path d="M4 8a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2 2 2 0 0 0 0 4 2 2 0 0 1-2 2H6a2 2 0 0 1-2-2 2 2 0 0 0 0-4z"/><path d="M10 6.5v11" stroke-dasharray="1.6 2"/></svg>`,
  phone: `<svg ${ICON_ATTRS}><path d="M6.6 10.8c1.3 2.6 3.4 4.7 6 6l2-2c.3-.3.7-.4 1-.2 1.1.3 2.2.5 3.4.6.6 0 1 .5 1 1V19c0 .6-.4 1-1 1C10.7 20 4 13.3 4 5c0-.6.4-1 1-1h2.7c.6 0 1 .4 1 1 .1 1.2.3 2.3.6 3.4.1.3 0 .7-.2 1l-2.5 1.4z"/></svg>`,
  "chevron-down": `<svg ${ICON_ATTRS}><path d="M6 9l6 6 6-6"/></svg>`,
  "arrow-up": `<svg ${ICON_ATTRS}><path d="M12 19V5M5 12l7-7 7 7"/></svg>`,
  x: `<svg ${ICON_ATTRS}><path d="M6 6l12 12M18 6L6 18"/></svg>`,
  heart: `<svg ${ICON_ATTRS}><path d="M12 20.5s-7-4.5-9.3-8.8C1.3 8.7 2 5.4 5 4c2.3-1.1 4.8-.2 7 2.6C14.2 3.8 16.7 2.9 19 4c3 1.4 3.7 4.7 2.3 7.7C19 16 12 20.5 12 20.5z"/></svg>`,
  target: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5.3"/><circle cx="12" cy="12" r="1.6" fill="currentColor" stroke="none"/></svg>`,
  book: `<svg ${ICON_ATTRS}><path d="M12 6.2c-1.8-1.5-4.4-2-8-2v13.6c3.6 0 6.2.5 8 2 1.8-1.5 4.4-2 8-2V4.2c-3.6 0-6.2.5-8 2z"/><path d="M12 6.2v13.6"/></svg>`,
  award: `<svg ${ICON_ATTRS}><circle cx="12" cy="8" r="5"/><path d="M8.5 12.5L6.3 20l5.7-3 5.7 3-2.2-7.5"/></svg>`,
  shirt: `<svg ${ICON_ATTRS}><path d="M8 3.5l4 2 4-2 4 3.8-3 3V20H7V10.3l-3-3z"/></svg>`,
  bag: `<svg ${ICON_ATTRS}><path d="M6.5 8h11l1 12h-13z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg>`,
  home: `<svg ${ICON_ATTRS}><path d="M3.5 11.5L12 4l8.5 7.5"/><path d="M5.5 10v9.5h13V10"/><path d="M10 19.5V14h4v5.5"/></svg>`,
  utensils: `<svg ${ICON_ATTRS}><path d="M6.5 3v6.5a2 2 0 0 0 4 0V3M8.5 9.5V21M17 3c-1.8 0-3 2-3 5s1.2 4 3 4M17 3v18"/></svg>`,
  sparkles: `<svg ${ICON_ATTRS} stroke="none" fill="currentColor"><path d="M12 2l1.9 5.1L19 9l-5.1 1.9L12 16l-1.9-5.1L5 9l5.1-1.9z"/><path d="M19 15l.8 2.2L22 18l-2.2.8L19 21l-.8-2.2L16 18l2.2-.8z"/></svg>`,
  palette: `<svg ${ICON_ATTRS}><path d="M12 3a9 8 0 1 0 0 16c1.4 0 2-1 2-2s-.5-1.4-1-2 0-2 1.2-2H16a5 5 0 0 0 5-5c0-2.8-4-5-9-5z"/><circle cx="8" cy="11" r="1" fill="currentColor" stroke="none"/><circle cx="12" cy="8.5" r="1" fill="currentColor" stroke="none"/><circle cx="16" cy="11" r="1" fill="currentColor" stroke="none"/></svg>`,
  scissors: `<svg ${ICON_ATTRS}><circle cx="6.5" cy="6.5" r="2.5"/><circle cx="6.5" cy="17.5" r="2.5"/><path d="M8.4 8.4L20 20M8.4 15.6L20 4"/></svg>`,
  gem: `<svg ${ICON_ATTRS}><path d="M6.5 3h11l3.5 5.5L12 21 2 8.5z"/><path d="M2 8.5h20M9 3l-2.5 5.5L12 21l5.5-12.5L15 3"/></svg>`,
  footware: `<svg ${ICON_ATTRS}><path d="M3.5 18v-2.6c0-.9.6-1.7 1.5-2L13 11c.9-.3 1.5-1.1 1.5-2V7c0-1.1.9-2 2-2h.6c1 0 1.9.7 2 1.7.3 2.6-1.6 4.5-1.6 7.3V18a1.5 1.5 0 0 1-1.5 1.5H5A1.5 1.5 0 0 1 3.5 18z"/></svg>`,
  package: `<svg ${ICON_ATTRS}><path d="M21 8l-9-4.5L3 8l9 4.5z"/><path d="M3 8v8l9 4.5L21 16V8"/><path d="M12 12.5V21"/></svg>`,
  lamp: `<svg ${ICON_ATTRS}><path d="M8.5 3.5h7l2 6h-11z"/><path d="M12 9.5v9.5"/><path d="M8.5 19h7"/></svg>`,
  more: `<svg ${ICON_ATTRS} stroke="none" fill="currentColor"><circle cx="5.5" cy="12" r="1.7"/><circle cx="12" cy="12" r="1.7"/><circle cx="18.5" cy="12" r="1.7"/></svg>`,
  sun: `<svg ${ICON_ATTRS}><circle cx="12" cy="12" r="4"/><path d="M12 2.5v2.7M12 18.8v2.7M4.6 4.6l1.9 1.9M17.5 17.5l1.9 1.9M2.5 12h2.7M18.8 12h2.7M4.6 19.4l1.9-1.9M17.5 6.5l1.9-1.9"/></svg>`,
  moon: `<svg ${ICON_ATTRS}><path d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11z"/></svg>`,
  link: `<svg ${ICON_ATTRS}><path d="M10.5 13.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1.3 1.3"/><path d="M13.5 10.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1.3-1.3"/></svg>`
};

function renderIcons(){
  document.querySelectorAll("[data-icon]").forEach(el => {
    const name = el.getAttribute("data-icon");
    if (ICONS[name]) {
      el.innerHTML = ICONS[name];
      el.classList.add("icon");
    }
  });
}

document.addEventListener("DOMContentLoaded", () => {

  renderIcons();

  /* ---------- Mobile nav toggle ---------- */
  const toggle = document.querySelector(".nav-toggle");
  const links = document.querySelector(".nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", () => {
      toggle.classList.toggle("open");
      links.classList.toggle("open");
    });
    links.querySelectorAll("a").forEach(a =>
      a.addEventListener("click", () => {
        toggle.classList.remove("open");
        links.classList.remove("open");
      })
    );
  }

  /* ---------- Active nav link ---------- */
  const current = location.pathname.split("/").pop() || "index.html";
  document.querySelectorAll(".nav-links a").forEach(a => {
    const href = a.getAttribute("href");
    if (href === current || (current === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  /* ---------- Build every [data-wa-msg] into a wa.me link ---------- */
  document.querySelectorAll("[data-wa-msg]").forEach(el => {
    el.setAttribute("href", waLink(el.getAttribute("data-wa-msg")));
    el.setAttribute("target", "_blank");
    el.setAttribute("rel", "noopener");
  });

  /* ---------- Day accordion (schedule page) ---------- */
  document.querySelectorAll(".day-header").forEach(header => {
    header.addEventListener("click", () => {
      const card = header.closest(".day-card");
      const wasOpen = card.classList.contains("open");
      document.querySelectorAll(".day-card").forEach(c => c.classList.remove("open"));
      if (!wasOpen) card.classList.add("open");
    });
  });
  // open first day by default
  const firstDay = document.querySelector(".day-card");
  if (firstDay) firstDay.classList.add("open");

  /* ---------- Scroll reveal ---------- */
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("in");
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(el => io.observe(el));
  } else {
    revealEls.forEach(el => el.classList.add("in"));
  }

  /* ---------- Back to top ---------- */
  const backTop = document.querySelector(".back-top");
  if (backTop) {
    window.addEventListener("scroll", () => {
      backTop.classList.toggle("show", window.scrollY > 500);
    });
    backTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
  }

  /* ---------- Countdown to event (13 Aug 2026, 10:00) ---------- */
  const countdown = document.querySelector(".countdown");
  if (countdown) {
    const target = new Date("2026-08-13T10:00:00+05:30").getTime();
    const dEl = countdown.querySelector("[data-d]");
    const hEl = countdown.querySelector("[data-h]");
    const mEl = countdown.querySelector("[data-m]");
    const sEl = countdown.querySelector("[data-s]");
    function tick(){
      const diff = target - Date.now();
      if (diff <= 0) {
        countdown.innerHTML = "<div class='box'><strong>It's here!</strong><span>Saksham has begun</span></div>";
        clearInterval(timer);
        return;
      }
      const d = Math.floor(diff / 86400000);
      const h = Math.floor((diff % 86400000) / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);
      if (dEl) dEl.textContent = d;
      if (hEl) hEl.textContent = String(h).padStart(2,"0");
      if (mEl) mEl.textContent = String(m).padStart(2,"0");
      if (sEl) sEl.textContent = String(s).padStart(2,"0");
    }
    tick();
    var timer = setInterval(tick, 1000);
  }

  /* ---------- Lightbox for poster images ---------- */
  const lightbox = document.querySelector(".lightbox");
  if (lightbox) {
    const lbImg = lightbox.querySelector("img");
    document.querySelectorAll("[data-lightbox]").forEach(el => {
      el.addEventListener("click", () => {
        lbImg.setAttribute("src", el.getAttribute("data-lightbox"));
        lightbox.classList.add("open");
      });
    });
    lightbox.addEventListener("click", (e) => {
      if (e.target === lightbox || e.target.classList.contains("lightbox-close")) {
        lightbox.classList.remove("open");
      }
    });
  }

  /* ---------- Registration form -> Google Sheet ---------- */
  const regForm = document.querySelector("#registrationForm");
  if (regForm) {
    const participantField = regForm.querySelector("#participantField");
    const stallField = regForm.querySelector("#stallField");
    const stallOtherField = regForm.querySelector("#stallOtherField");
    const stallTypeSelect = regForm.querySelector("#regStallType");
    const feeAmount = regForm.querySelector("#feeAmount");
    const statusEl = regForm.querySelector("#regStatus");

    function updateType(){
      const type = regForm.querySelector('input[name="regType"]:checked').value;
      if (type === "Participant") {
        participantField.style.display = "";
        stallField.style.display = "none";
        stallOtherField.style.display = "none";
        feeAmount.textContent = "₹100";
      } else {
        participantField.style.display = "none";
        stallField.style.display = "";
        feeAmount.textContent = "₹3500";
        stallOtherField.style.display = stallTypeSelect.value === "Other" ? "" : "none";
      }
    }
    regForm.querySelectorAll('input[name="regType"]').forEach(r => r.addEventListener("change", updateType));
    stallTypeSelect.addEventListener("change", () => {
      stallOtherField.style.display = stallTypeSelect.value === "Other" ? "" : "none";
    });
    updateType();

    regForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const type = regForm.querySelector('input[name="regType"]:checked').value;
      const name = regForm.querySelector("#regName").value.trim();
      const phone = regForm.querySelector("#regPhone").value.trim();
      const email = regForm.querySelector("#regEmail").value.trim();
      const detail = type === "Participant"
        ? regForm.querySelector("#regCompetition").value
        : (stallTypeSelect.value === "Other" ? regForm.querySelector("#regStallOther").value.trim() : stallTypeSelect.value);
      const fee = type === "Participant" ? "100" : "3500";
      const paymentRef = regForm.querySelector("#regPaymentRef").value.trim();

      try {
        const payload = new URLSearchParams({ name, phone, email, type, detail, fee, paymentRef });
        fetch(SHEETS_ENDPOINT, { method: "POST", mode: "no-cors", body: payload }).catch(() => {});
      } catch (err) { /* endpoint not configured yet — form still confirms via WhatsApp below */ }

      statusEl.textContent = "Thank you! Your registration has been recorded. You can confirm via WhatsApp below.";
      statusEl.style.display = "block";

      let waBtn = regForm.querySelector(".reg-wa-confirm");
      if (!waBtn) {
        waBtn = document.createElement("a");
        waBtn.className = "btn btn-whatsapp btn-block reg-wa-confirm";
        waBtn.style.marginTop = "12px";
        waBtn.target = "_blank";
        waBtn.rel = "noopener";
        waBtn.innerHTML = '<span class="icon" data-icon="whatsapp"></span> Confirm via WhatsApp';
        regForm.appendChild(waBtn);
        renderIcons();
      }
      const label = type === "Participant" ? "Competition" : "Stall Type";
      const msg = `Hello, I have registered for Saksham as a ${type}. Name: ${name}, Phone: ${phone}, ${label}: ${detail}, Fee: Rs ${fee}${paymentRef ? ", Payment Ref: " + paymentRef : ""}.`;
      waBtn.setAttribute("href", waLink(msg));
    });
  }
});
