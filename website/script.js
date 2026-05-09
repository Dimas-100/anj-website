const navToggle = document.querySelector(".nav__toggle");
const navLinks = document.getElementById("nav-links");

if (navToggle && navLinks) {
  navToggle.addEventListener("click", () => {
    const open = navLinks.classList.toggle("is-open");
    navToggle.classList.toggle("is-open", open);
    navToggle.setAttribute("aria-expanded", String(open));
    navToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("is-open");
      navToggle.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.setAttribute("aria-label", "Open menu");
    });
  });
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();

const filterButtons = document.querySelectorAll(".filter");
const projects = document.querySelectorAll(".project");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const active = item === button;
      item.classList.toggle("is-active", active);
      item.setAttribute("aria-selected", String(active));
    });

    projects.forEach((project) => {
      const visible = filter === "All" || project.dataset.category === filter;
      project.classList.toggle("is-hidden", !visible);
    });
  });
});

const scopeButtons = document.querySelectorAll("[data-scope]");
const scopeInput = document.getElementById("scope-input");

function updateScopeInput() {
  if (!scopeInput) return;
  const selected = Array.from(scopeButtons)
    .filter((button) => button.classList.contains("is-active"))
    .map((button) => button.dataset.scope);
  scopeInput.value = selected.join(", ");
}

scopeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.toggle("is-active");
    button.setAttribute("aria-pressed", String(button.classList.contains("is-active")));
    updateScopeInput();
  });
});

const revealEls = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );
  revealEls.forEach((element) => revealObserver.observe(element));
} else {
  revealEls.forEach((element) => element.classList.add("is-visible"));
}

const navAnchors = document.querySelectorAll(".nav__links a[href^='#']");
const navSections = Array.from(navAnchors)
  .map((anchor) => document.querySelector(anchor.getAttribute("href")))
  .filter(Boolean);

function updateActiveNav() {
  const current = navSections
    .slice()
    .reverse()
    .find((section) => section.getBoundingClientRect().top <= 120);

  navAnchors.forEach((anchor) => {
    anchor.classList.toggle("is-active", Boolean(current) && anchor.getAttribute("href") === `#${current.id}`);
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

const form = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

function clearScopeButtons() {
  scopeButtons.forEach((button) => {
    button.classList.remove("is-active");
    button.setAttribute("aria-pressed", "false");
  });
  updateScopeInput();
}

if (form && formStatus) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    formStatus.className = "form-status";
    formStatus.textContent = "";

    const requiredFields = ["name", "email"];
    for (const field of requiredFields) {
      const input = form.elements.namedItem(field);
      if (!input || !String(input.value).trim()) {
        formStatus.classList.add("error");
        formStatus.textContent = "Please fill in the required fields.";
        if (input && typeof input.focus === "function") input.focus();
        return;
      }
    }

    const action = form.getAttribute("action") || "";
    if (action.includes("TODO_FORM_ID")) {
      formStatus.textContent = "Thanks - your request has been recorded in demo mode.";
      form.reset();
      clearScopeButtons();
      return;
    }

    try {
      formStatus.textContent = "Sending...";
      const response = await fetch(action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) throw new Error("Submission failed");

      formStatus.textContent = "Thanks - we'll be in touch within a business day.";
      form.reset();
      clearScopeButtons();
    } catch {
      formStatus.classList.add("error");
      formStatus.textContent = "Couldn't send. Please try again.";
    }
  });
}
