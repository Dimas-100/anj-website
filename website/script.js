/* ANJ Construction — shared page behavior.
   Every feature is guarded so missing elements never throw. */

(function () {
  "use strict";

  /* Mobile nav toggle */
  var nav = document.querySelector(".nav");
  var toggle = document.querySelector(".nav__toggle");
  var links = document.getElementById("nav-links");
  if (nav && toggle && links) {
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      nav.classList.toggle("is-open", open);
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    });
    links.addEventListener("click", function (e) {
      if (e.target.closest("a")) {
        links.classList.remove("is-open");
        nav.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Nav shadow on scroll */
  if (nav) {
    var onScroll = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 8);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* Footer year */
  var year = document.getElementById("year");
  if (year) year.textContent = String(new Date().getFullYear());

  /* Scroll reveal — deterministic position check (an IntersectionObserver
     can miss fast jumps and leave content invisible; this never does). */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  if (revealEls.length) {
    var ticking = false;
    var checkReveals = function () {
      ticking = false;
      var limit = window.innerHeight * 1.1;
      revealEls = revealEls.filter(function (el) {
        if (el.getBoundingClientRect().top < limit) {
          el.classList.add("is-visible");
          return false;
        }
        return true;
      });
    };
    var queueCheck = function () {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(checkReveals);
      }
    };
    window.addEventListener("scroll", queueCheck, { passive: true });
    window.addEventListener("resize", queueCheck, { passive: true });
    checkReveals();
  }

  /* Contact form → /api/contact */
  var form = document.getElementById("contact-form");
  var status = document.getElementById("form-status");
  if (form && status) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (!form.reportValidity()) return;

      var button = form.querySelector('button[type="submit"]');
      var data = {};
      new FormData(form).forEach(function (value, key) { data[key] = value; });

      status.className = "form__status";
      status.textContent = "Sending…";
      if (button) button.disabled = true;

      fetch(form.action, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
        .then(function (res) {
          if (!res.ok) {
            return res.json().catch(function () { return {}; }).then(function (body) {
              throw new Error(body.error || "Request failed");
            });
          }
          status.className = "form__status is-ok";
          status.textContent = "Sent. We'll get back to you within one business day.";
          form.reset();
        })
        .catch(function () {
          status.className = "form__status is-error";
          status.textContent = "Something went wrong. Please call (770) 900-0163 instead.";
        })
        .finally(function () {
          if (button) button.disabled = false;
        });
    });
  }
})();
