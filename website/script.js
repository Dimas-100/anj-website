// ANJ Construction single-page interactions
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ── Intro splash (armed by the inline <head> gate; homepage only) ──
  // Entrance beats are CSS; this drives the lift, the skip, and gating the
  // lift on the hero image being decoded so the hero is painted the instant
  // the curtain rises.
  (function intro() {
    var root = document.documentElement;
    if (!root.classList.contains("intro-armed")) return;
    var overlay = document.querySelector(".intro");
    if (!overlay) return;
    var reduced = root.classList.contains("intro-reduced");
    var heroImg = document.querySelector(".hero__bg img");
    var lifted = false;

    function lift() {
      if (lifted) return;
      lifted = true;
      root.classList.add("intro-done"); // releases the scroll lock
      overlay.classList.add("is-lifting");
      var done = function () { overlay.classList.add("is-done"); };
      // Only the overlay's own transform lift ends the curtain; ignore bubbling
      // child transitions (e.g. the skip hint fading in).
      overlay.addEventListener("transitionend", function (e) {
        if (e.target === overlay && e.propertyName === "transform") done();
      });
      setTimeout(done, 700); // safety if transitionend doesn't fire
    }

    // Skip: any key / pointer / touch lifts immediately.
    window.addEventListener("keydown", lift, { once: true });
    overlay.addEventListener("pointerdown", lift, { once: true });
    overlay.addEventListener("touchstart", lift, { once: true, passive: true });

    if (reduced) { setTimeout(lift, 900); return; } // static hold, then fade

    setTimeout(function () { overlay.classList.add("show-skip"); }, 1200);

    var ready = function () { return heroImg && heroImg.complete && heroImg.naturalHeight !== 0; };
    setTimeout(function () {
      if (ready()) { lift(); return; }
      if (heroImg) {
        heroImg.addEventListener("load", lift, { once: true });
        heroImg.addEventListener("error", lift, { once: true });
      }
    }, 1900); // minimum on-screen time
    setTimeout(lift, 3200); // hard fallback
  })();

  // ── Mobile nav drawer ──
  var toggle = document.querySelector(".nav__toggle");
  var links = document.querySelector("#nav-links");
  if (toggle && links) {
    var closeNav = function () {
      links.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.setAttribute("aria-label", "Open menu");
      document.body.style.overflow = "";
    };
    toggle.addEventListener("click", function () {
      var open = links.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
      document.body.style.overflow = open ? "hidden" : "";
    });
    links.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
    window.addEventListener("resize", function () { if (window.innerWidth > 860) closeNav(); });
  }

  // ── Brand wordmark → scroll back to the very top ──
  var brand = document.querySelector(".nav__brand");
  if (brand) {
    brand.addEventListener("click", function (e) {
      e.preventDefault();
      if (links) closeNavIfOpen();
      window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
  }
  function closeNavIfOpen() {
    if (links && links.classList.contains("is-open")) {
      links.classList.remove("is-open");
      if (toggle) toggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    }
  }

  // ── Sticky-nav scrolled state via IntersectionObserver sentinel ──
  var nav = document.querySelector(".nav");
  if (nav && "IntersectionObserver" in window) {
    var sentinel = document.createElement("div");
    sentinel.setAttribute("aria-hidden", "true");
    sentinel.style.cssText = "position:absolute;top:60px;left:0;width:1px;height:1px;pointer-events:none;";
    document.body.prepend(sentinel);
    new IntersectionObserver(function (entries) {
      nav.classList.toggle("is-scrolled", !entries[0].isIntersecting);
    }).observe(sentinel);
  }

  // ── Footer year ──
  var year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ── Smooth anchor links (brand handled separately above) ──
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    if (anchor.classList.contains("nav__brand")) return;
    anchor.addEventListener("click", function (e) {
      var id = anchor.getAttribute("href");
      if (!id || id === "#") return;
      var target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeNavIfOpen();
      target.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
    });
  });

  // ── Scroll reveal (staggered via data-delay) ──
  var reveals = document.querySelectorAll(".reveal");
  if (reveals.length && !reduce && "IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            var delay = parseInt(entry.target.dataset.delay || "0", 10);
            setTimeout(function () { entry.target.classList.add("is-visible"); }, delay);
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

  // ── Lazy image fade-in ──
  document.querySelectorAll('img[loading="lazy"]').forEach(function (img) {
    if (img.complete && img.naturalHeight !== 0) {
      img.classList.add("is-loaded");
    } else {
      img.addEventListener("load", function () { img.classList.add("is-loaded"); }, { once: true });
      img.addEventListener("error", function () { img.classList.add("is-loaded"); }, { once: true });
    }
  });

  // ── Center-focus work carousel ──
  // Active slide sits scaled-up in the middle, neighbours peek dimmed. Arrows /
  // dots / keyboard / swipe change the active index; the whole track glides via
  // a single translateX transform.
  document.querySelectorAll("[data-carousel]").forEach(function (root) {
    var viewport = root.querySelector(".cz__viewport");
    var track = root.querySelector(".cz__track");
    var slides = Array.prototype.slice.call(root.querySelectorAll(".cz__slide"));
    var prevBtn = root.querySelector(".cz__prev");
    var nextBtn = root.querySelector(".cz__next");
    var dots = Array.prototype.slice.call(root.querySelectorAll(".cz__dot"));
    if (!viewport || !track || !slides.length) return;

    var index = parseInt(root.dataset.start || "0", 10);
    if (!(index >= 0 && index < slides.length)) index = 0;

    function positionTrack(animate) {
      var active = slides[index];
      var target = viewport.clientWidth / 2 - (active.offsetLeft + active.offsetWidth / 2);
      if (animate) {
        track.style.transform = "translateX(" + target + "px)";
      } else {
        var prev = track.style.transition;
        track.style.transition = "none";
        track.style.transform = "translateX(" + target + "px)";
        void track.offsetWidth; // flush so the next move animates
        track.style.transition = prev;
      }
    }

    function render(animate) {
      slides.forEach(function (s, i) {
        var on = i === index;
        s.classList.toggle("is-active", on);
        s.setAttribute("aria-hidden", String(!on));
        s.querySelectorAll("a").forEach(function (a) { a.tabIndex = on ? 0 : -1; });
      });
      dots.forEach(function (d, i) {
        var on = i === index;
        d.classList.toggle("is-active", on);
        d.setAttribute("aria-current", on ? "true" : "false");
      });
      // Move focus to the opposite arrow before disabling the one that has it,
      // so reaching an end never drops keyboard focus to <body>.
      var prevOff = index === 0, nextOff = index === slides.length - 1;
      if (nextBtn && nextOff && document.activeElement === nextBtn && prevBtn) prevBtn.focus();
      if (prevBtn && prevOff && document.activeElement === prevBtn && nextBtn) nextBtn.focus();
      if (prevBtn) prevBtn.disabled = prevOff;
      if (nextBtn) nextBtn.disabled = nextOff;
      positionTrack(animate);
    }

    function goTo(i, animate) {
      index = Math.max(0, Math.min(slides.length - 1, i));
      render(animate !== false);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });
    dots.forEach(function (d, i) { d.addEventListener("click", function () { goTo(i); }); });

    root.addEventListener("keydown", function (e) {
      swiped = false; // a keyboard activation must not be eaten by a stale swipe flag
      if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1); }
      if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1); }
    });

    // Swipe via pointer; suppress the click that follows a real drag.
    var startX = 0, startY = 0, tracking = false, swiped = false;
    viewport.addEventListener("pointerdown", function (e) { startX = e.clientX; startY = e.clientY; tracking = true; swiped = false; });
    viewport.addEventListener("pointerup", function (e) {
      if (!tracking) return;
      tracking = false;
      var dx = e.clientX - startX, dy = e.clientY - startY;
      if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) { swiped = true; goTo(dx < 0 ? index + 1 : index - 1); }
    });
    viewport.addEventListener("pointercancel", function () { tracking = false; });
    viewport.addEventListener("click", function (e) { if (swiped) { e.preventDefault(); e.stopPropagation(); swiped = false; } }, true);

    var raf = 0;
    window.addEventListener("resize", function () {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(function () { positionTrack(false); });
    }, { passive: true });

    // Image heights can shift slide offsets once they decode - re-center then.
    slides.forEach(function (s) {
      var img = s.querySelector("img");
      if (img && !img.complete) img.addEventListener("load", function () { positionTrack(false); }, { once: true });
    });

    render(false);
  });

  // ── Contact form → Formspree (AJAX) ──
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
        status.textContent = "Thank you! We'll be in touch within a business day.";
        form.reset();
      } catch (err) {
        status.classList.add("error");
        status.textContent = "Couldn't send. Please try again in a moment.";
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  // Signal to the inline head-gate failsafe that script.js ran successfully.
  window.__anjReady = true;
})();
