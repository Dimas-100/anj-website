// ANJ Construction — single-page interactions
(function () {
  "use strict";

  // Mobile nav toggle
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector("#nav-links");
  if (toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    links.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        links.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  // Brand wordmark -> scroll back to the very top
  var brand = document.querySelector(".nav__brand");
  if (brand) {
    brand.addEventListener("click", function (e) {
      e.preventDefault();
      if (links) links.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      var rm = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      window.scrollTo({ top: 0, behavior: rm ? "auto" : "smooth" });
    });
  }

  // Sticky-nav scrolled state
  var nav = document.querySelector(".nav");
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Footer year
  var year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // Scroll reveal (skipped when the user prefers reduced motion)
  var reveals = document.querySelectorAll(".reveal");
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reveals.length && !reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 }
    );
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add("is-visible"); });
  }

  // Contact form -> Formspree (AJAX)
  var form = document.querySelector("#contact-form");
  var status = document.querySelector("#form-status");
  if (form && status) {
    form.addEventListener("submit", async function (event) {
      event.preventDefault();
      status.className = "form-status";
      status.textContent = "";

      var required = ["name", "email"];
      for (var i = 0; i < required.length; i++) {
        var input = form.elements.namedItem(required[i]);
        if (!input || !String(input.value).trim()) {
          status.classList.add("error");
          status.textContent = "Please fill in your name and email.";
          if (input && input.focus) input.focus();
          return;
        }
      }

      var action = form.getAttribute("action") || "";
      var submitBtn = form.querySelector("button[type='submit']");
      try {
        status.textContent = "Sending…";
        if (submitBtn) submitBtn.disabled = true;
        var response = await fetch(action, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        });
        if (!response.ok) throw new Error("Submission failed");
        status.textContent = "Thank you — we'll be in touch within a business day.";
        form.reset();
      } catch (err) {
        status.classList.add("error");
        status.textContent = "Couldn't send. Please try again in a moment.";
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }
})();
