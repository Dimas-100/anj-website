# ANJ Single-Page Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace ANJ Construction's six-page editorial site with one clean, trustworthy, accessible single page (hero → about → services → work → contact form) on the existing static/Vercel stack.

**Architecture:** Static HTML/CSS/JS. A single `website/index.html` holds all sections with anchor navigation. A fresh `website/styles.css` defines a small design system (cream/charcoal/terracotta, Archivo sans). `website/script.js` is slimmed to nav toggle + sticky state + footer year + the existing Formspree submit handler. `vercel.json` serves the one page and 301-redirects the old routes to anchors. The five old HTML pages are deleted. All work happens on branch `redesign-single-page` behind a Vercel preview; promote to `main` only on approval.

**Tech Stack:** HTML5, CSS3 (custom properties, grid), vanilla ES, Vercel static hosting, Formspree (`xdavjdyj`), Archivo (Google Fonts).

**Note on testing:** There is no automated test tooling in this repo (static site). "Verification" steps are concrete manual/curl checks against the local dev server and the Vercel branch preview, per the spec's Verification section.

---

## File Structure

- `website/index.html` — **rewrite**: the single page (nav, hero, about, services, work, contact, footer).
- `website/styles.css` — **replace**: new design system + component styles (~1 responsibility: present the single page).
- `website/script.js` — **rewrite (slim)**: nav toggle, sticky-nav state, footer year, Formspree submit.
- `vercel.json` — **modify**: single-page rewrites + old-route redirects (no `cleanUrls`).
- `website/about.html`, `services.html`, `projects.html`, `faq.html`, `contact.html` — **delete**.
- `assets/img/*` and `assets/branding/*` — **reuse unchanged** (3 photos + favicon).

---

## Task 1: Rewrite `website/index.html` as the single page

**Files:**
- Modify (full overwrite): `website/index.html`

- [ ] **Step 1: Replace the entire file with this content**

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#faf6f0" />
  <meta name="description" content="ANJ Construction Inc. — family-run masonry contractor serving Georgia since 2015. Brick, block, stone, retaining walls, chimneys, fireplaces, restoration and commercial masonry. Request a free quote." />
  <title>ANJ Construction Inc. — Masonry & Stonework in Georgia</title>
  <link rel="icon" type="image/svg+xml" href="../assets/branding/anj-mark-square.svg" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap" rel="stylesheet" />
  <link rel="stylesheet" href="styles.css" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="ANJ Construction Inc." />
  <meta property="og:title" content="ANJ Construction Inc. — Masonry & Stonework in Georgia" />
  <meta property="og:description" content="Family-run masonry contractor serving Georgia since 2015. Brick, stone, block, restoration and commercial masonry. Request a free quote." />
  <meta property="og:url" content="https://anjconstruction.co/" />
  <meta property="og:image" content="https://anjconstruction.co/assets/img/apartment-savanah.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="ANJ Construction Inc." />
  <meta name="twitter:description" content="Masonry & stonework across Georgia. Brick, block, stone, restoration and chimneys." />
  <meta name="twitter:image" content="https://anjconstruction.co/assets/img/apartment-savanah.jpg" />
</head>
<body>
  <header class="nav" id="top">
    <div class="container nav__inner">
      <a href="#top" class="nav__brand">ANJ <span>Construction</span></a>
      <button class="nav__toggle" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="nav-links">
        <span></span><span></span><span></span>
      </button>
      <nav class="nav__links" id="nav-links" aria-label="Primary">
        <a href="#about">About</a>
        <a href="#services">Services</a>
        <a href="#work">Work</a>
        <a href="#contact">Contact</a>
        <a href="#contact" class="btn btn--accent nav__cta">Request a quote</a>
      </nav>
    </div>
  </header>

  <main>
    <!-- HERO -->
    <section class="hero" id="home">
      <div class="container hero__inner">
        <div class="hero__text">
          <p class="kicker">Masonry &amp; Stonework · Georgia</p>
          <h1>Masonry built to last.</h1>
          <p class="hero__lead">Brick, block, stone, and masonry repair for homes and businesses across Georgia. Family-run since 2015.</p>
          <a href="#contact" class="btn btn--accent btn--lg">Request a free quote</a>
        </div>
        <div class="hero__media">
          <img src="../assets/img/apartment-savanah.jpg" alt="Commercial brick apartment building constructed by ANJ Construction in Savannah, Georgia" />
        </div>
      </div>
    </section>

    <!-- WHO WE ARE -->
    <section class="section" id="about">
      <div class="container">
        <p class="kicker kicker--muted">Who we are</p>
        <h2 class="section__title">A family-run masonry company you can trust.</h2>
        <p class="section__lead">ANJ Construction has built brick, block, and stone work across Georgia since 2015 — clean lines, honest pricing, and craftsmanship that holds up. We take on both residential and commercial projects.</p>
        <ul class="stats">
          <li><span class="stats__num">2015</span><span class="stats__label">Established</span></li>
          <li><span class="stats__num">All Georgia</span><span class="stats__label">Service area</span></li>
          <li><span class="stats__num">Res + Com</span><span class="stats__label">Project types</span></li>
        </ul>
      </div>
    </section>

    <!-- WHAT WE OFFER -->
    <section class="section section--alt" id="services">
      <div class="container">
        <p class="kicker kicker--muted">What we offer</p>
        <h2 class="section__title">Our masonry services.</h2>
        <ul class="services">
          <li class="service"><h3>Brickwork</h3><p>Brick laying, veneer, and block.</p></li>
          <li class="service"><h3>Stone Veneer</h3><p>Natural &amp; manufactured stone.</p></li>
          <li class="service"><h3>Retaining Walls</h3><p>Structural &amp; decorative walls.</p></li>
          <li class="service"><h3>Chimneys &amp; Fireplaces</h3><p>Custom builds &amp; rebuilds.</p></li>
          <li class="service"><h3>Restoration</h3><p>Repair &amp; tuckpointing.</p></li>
          <li class="service"><h3>Commercial Masonry</h3><p>Facades &amp; commercial work.</p></li>
        </ul>
      </div>
    </section>

    <!-- OUR WORK -->
    <section class="section" id="work">
      <div class="container">
        <p class="kicker kicker--muted">Our work</p>
        <h2 class="section__title">Recent projects.</h2>
        <div class="gallery">
          <figure class="gallery__item gallery__item--wide">
            <img src="../assets/img/apartment-savanah.jpg" alt="Multi-unit commercial brick building under construction in Savannah, Georgia" />
            <figcaption>Commercial Brick Build · Savannah, GA</figcaption>
          </figure>
          <figure class="gallery__item">
            <img src="../assets/img/fireplace-winder.jpg" alt="Stacked-stone fireplace built by ANJ Construction in Winder, Georgia" />
            <figcaption>Stacked-Stone Fireplace · Winder, GA</figcaption>
          </figure>
          <figure class="gallery__item">
            <img src="../assets/img/chimney-winder.jpg" alt="Brick chimney built by ANJ Construction in Winder, Georgia" />
            <figcaption>Chimney · Winder, GA</figcaption>
          </figure>
        </div>
      </div>
    </section>

    <!-- CONTACT -->
    <section class="section section--dark" id="contact">
      <div class="container">
        <p class="kicker kicker--accent">Get in touch</p>
        <h2 class="section__title">Request a free quote.</h2>
        <p class="section__lead section__lead--light">Tell us about your project. We serve Winder, Lawrenceville, Metro Atlanta, Savannah, and surrounding Georgia communities.</p>
        <form id="contact-form" class="form" action="https://formspree.io/f/xdavjdyj" method="POST" novalidate>
          <div class="form__row">
            <label class="field"><span>Your name *</span><input name="name" type="text" autocomplete="name" required /></label>
            <label class="field"><span>Email *</span><input name="email" type="email" autocomplete="email" required /></label>
          </div>
          <label class="field"><span>Project details</span><textarea name="message" rows="5" placeholder="What you need — brick, stone, repair — and the project location."></textarea></label>
          <div class="form__actions">
            <button class="btn btn--accent btn--lg" type="submit">Send request</button>
            <p id="form-status" class="form-status" role="status" aria-live="polite"></p>
          </div>
        </form>
      </div>
    </section>
  </main>

  <footer class="footer">
    <div class="container footer__inner">
      <span>&copy; <span id="year"></span> ANJ Construction Inc.</span>
      <span>Masonry &amp; Construction · Georgia</span>
    </div>
  </footer>

  <script src="script.js"></script>
</body>
</html>
```

- [ ] **Step 2: Verify structure**

Run: `grep -c "<h1" website/index.html` → Expected: `1` (exactly one H1).
Run: `grep -oE 'id="(about|services|work|contact)"' website/index.html | sort -u` → Expected: all four anchor ids present.

- [ ] **Step 3: Commit**

```bash
git add website/index.html
git commit -m "Rebuild index.html as single-page redesign"
```

---

## Task 2: Replace `website/styles.css` with the new design system

**Files:**
- Modify (full overwrite): `website/styles.css`

- [ ] **Step 1: Replace the entire file with this content**

```css
/* ===== ANJ Construction — Clean & Trustworthy design system ===== */
:root {
  --cream: #faf6f0;
  --cream-alt: #f3ece1;
  --ink: #26241f;
  --muted: #6f6151;
  --accent: #b15c34;
  --accent-dark: #9c4f2c;
  --dark: #26241f;
  --dark-deep: #1c1a17;
  --line: #e7ddcf;
  --white: #ffffff;
  --maxw: 1080px;
  --pad: clamp(1.25rem, 4vw, 2.5rem);
  --radius: 12px;
  --shadow: 0 6px 24px rgba(38, 36, 31, .10);
  --font: "Archivo", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif;
}

* { box-sizing: border-box; }
html { scroll-behavior: smooth; }
@media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }

body {
  margin: 0;
  font-family: var(--font);
  font-size: 18px;
  line-height: 1.6;
  color: var(--ink);
  background: var(--cream);
  -webkit-font-smoothing: antialiased;
}
img { max-width: 100%; display: block; }
a { color: inherit; }

.container { width: 100%; max-width: var(--maxw); margin: 0 auto; padding-inline: var(--pad); }

/* Typography */
h1 { font-size: clamp(2.4rem, 6vw, 3.6rem); line-height: 1.05; font-weight: 800; letter-spacing: -.02em; margin: 0 0 .5em; }
h2 { font-size: clamp(1.6rem, 4vw, 2.3rem); line-height: 1.1; font-weight: 800; letter-spacing: -.01em; margin: 0 0 .4em; }
h3 { font-size: 1.2rem; font-weight: 700; margin: 0 0 .25em; }
p { margin: 0 0 1rem; }
.kicker { font-size: .8rem; font-weight: 700; letter-spacing: .12em; text-transform: uppercase; color: var(--accent); margin: 0 0 .8rem; }
.kicker--muted { color: var(--muted); }
.kicker--accent { color: #d39b7e; }
.section__title { max-width: 20ch; }
.section__lead { font-size: 1.15rem; color: var(--muted); max-width: 62ch; }
.section__lead--light { color: #c9c0b3; }

/* Buttons */
.btn { display: inline-block; font-family: inherit; font-size: 1rem; font-weight: 700; text-decoration: none; border: 0; border-radius: 8px; padding: .85rem 1.4rem; cursor: pointer; transition: background-color .15s ease; }
.btn--accent { background: var(--accent); color: #fff; }
.btn--accent:hover { background: var(--accent-dark); }
.btn--lg { font-size: 1.1rem; padding: 1rem 1.7rem; }

/* Nav */
.nav { position: sticky; top: 0; z-index: 50; background: color-mix(in srgb, var(--cream) 92%, transparent); backdrop-filter: blur(8px); border-bottom: 1px solid transparent; transition: border-color .2s ease, box-shadow .2s ease; }
.nav.is-scrolled { border-bottom-color: var(--line); box-shadow: 0 2px 12px rgba(38, 36, 31, .06); }
.nav__inner { display: flex; align-items: center; justify-content: space-between; min-height: 68px; }
.nav__brand { font-size: 1.3rem; font-weight: 800; text-decoration: none; letter-spacing: -.01em; }
.nav__brand span { font-weight: 500; color: var(--muted); }
.nav__links { display: flex; align-items: center; gap: 1.5rem; }
.nav__links a { text-decoration: none; font-weight: 600; }
.nav__links a:not(.nav__cta):hover { color: var(--accent); }
.nav__cta { color: #fff; }
.nav__toggle { display: none; flex-direction: column; gap: 5px; background: none; border: 0; padding: 10px; cursor: pointer; }
.nav__toggle span { width: 24px; height: 2px; background: var(--ink); display: block; }

/* Hero */
.hero__inner { display: grid; grid-template-columns: 1.1fr 1fr; gap: clamp(1.5rem, 4vw, 3rem); align-items: center; padding: clamp(2.5rem, 6vw, 5rem) 0; }
.hero__lead { font-size: 1.2rem; color: var(--muted); max-width: 46ch; }
.hero__media img { width: 100%; height: 100%; max-height: 460px; object-fit: cover; border-radius: var(--radius); box-shadow: var(--shadow); }

/* Sections */
.section { padding: clamp(2.5rem, 6vw, 4.5rem) 0; }
.section--alt { background: var(--cream-alt); border-block: 1px solid var(--line); }
.section--dark { background: var(--dark); color: var(--cream); }

/* Stats */
.stats { list-style: none; margin: 2rem 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.stats li { background: var(--white); border: 1px solid var(--line); border-radius: var(--radius); padding: 1.25rem; text-align: center; }
.stats__num { display: block; font-size: 1.7rem; font-weight: 800; color: var(--accent); }
.stats__label { font-size: .9rem; color: var(--muted); }

/* Services */
.services { list-style: none; margin: 1.5rem 0 0; padding: 0; display: grid; grid-template-columns: repeat(3, 1fr); gap: 1rem; }
.service { background: var(--white); border: 1px solid var(--line); border-radius: var(--radius); padding: 1.4rem; }
.service p { margin: 0; color: var(--muted); }

/* Gallery */
.gallery { margin-top: 1.5rem; display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; }
.gallery__item { margin: 0; position: relative; border-radius: var(--radius); overflow: hidden; box-shadow: var(--shadow); }
.gallery__item--wide { grid-column: 1 / -1; }
.gallery__item img { width: 100%; height: 260px; object-fit: cover; }
.gallery__item--wide img { height: 340px; }
.gallery__item figcaption { position: absolute; left: 12px; bottom: 12px; background: rgba(38, 36, 31, .82); color: #fff; font-size: .85rem; padding: .35rem .7rem; border-radius: 6px; }

/* Form */
.form { margin-top: 1.5rem; max-width: 640px; }
.form__row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
.field { display: block; margin-bottom: 1rem; }
.field span { display: block; font-size: .9rem; font-weight: 600; margin-bottom: .35rem; color: var(--cream); }
.field input, .field textarea { width: 100%; font: inherit; font-size: 1rem; padding: .8rem .9rem; border: 1px solid var(--line); border-radius: 8px; background: var(--white); color: var(--ink); }
.field textarea { resize: vertical; }
.form__actions { display: flex; align-items: center; gap: 1rem; flex-wrap: wrap; }
.form-status { margin: 0; font-size: .95rem; color: var(--cream); min-height: 1.2em; }
.form-status.error { color: #ffb4a2; }

/* Footer */
.footer { background: var(--dark-deep); color: #8c8478; font-size: .9rem; }
.footer__inner { display: flex; justify-content: space-between; gap: 1rem; flex-wrap: wrap; padding-block: 1.25rem; }

/* Accessibility */
:focus-visible { outline: 3px solid var(--accent); outline-offset: 2px; }
section[id], #top { scroll-margin-top: 84px; }

/* Responsive */
@media (max-width: 860px) {
  .nav__toggle { display: flex; }
  .nav__links { position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; align-items: stretch; gap: 0; background: var(--cream); border-bottom: 1px solid var(--line); padding: .5rem var(--pad) 1rem; display: none; }
  .nav__links.is-open { display: flex; }
  .nav__links a { padding: .9rem 0; border-bottom: 1px solid var(--line); }
  .nav__cta { margin-top: .6rem; text-align: center; border-bottom: 0 !important; }
  .hero__inner { grid-template-columns: 1fr; }
  .hero__media { order: -1; }
  .services { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 560px) {
  body { font-size: 17px; }
  .stats, .services, .form__row, .gallery { grid-template-columns: 1fr; }
  .gallery__item--wide { grid-column: auto; }
  .gallery__item img, .gallery__item--wide img { height: 220px; }
}
```

- [ ] **Step 2: Verify it parses (no stray braces)**

Run: `node -e "const c=require('fs').readFileSync('website/styles.css','utf8');const o=(c.match(/{/g)||[]).length,cl=(c.match(/}/g)||[]).length;if(o!==cl)throw new Error('brace mismatch '+o+'/'+cl);console.log('braces balanced',o)"`
Expected: `braces balanced <n>`

- [ ] **Step 3: Commit**

```bash
git add website/styles.css
git commit -m "Replace stylesheet with Clean & Trustworthy design system"
```

---

## Task 3: Slim `website/script.js`

**Files:**
- Modify (full overwrite): `website/script.js`

- [ ] **Step 1: Replace the entire file with this content**

```js
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
```

- [ ] **Step 2: Verify syntax**

Run: `node --check website/script.js`
Expected: no output (exit 0 = valid JS).

- [ ] **Step 3: Commit**

```bash
git add website/script.js
git commit -m "Slim script.js to single-page interactions"
```

---

## Task 4: Update `vercel.json` and delete the old pages

**Files:**
- Modify (full overwrite): `vercel.json`
- Delete: `website/about.html`, `website/services.html`, `website/projects.html`, `website/faq.html`, `website/contact.html`

- [ ] **Step 1: Replace `vercel.json` with this content**

```json
{
  "trailingSlash": false,
  "rewrites": [
    { "source": "/", "destination": "/website/index.html" },
    { "source": "/index.html", "destination": "/website/index.html" },
    { "source": "/styles.css", "destination": "/website/styles.css" },
    { "source": "/script.js", "destination": "/website/script.js" }
  ],
  "redirects": [
    { "source": "/about", "destination": "/#about", "permanent": true },
    { "source": "/about.html", "destination": "/#about", "permanent": true },
    { "source": "/services", "destination": "/#services", "permanent": true },
    { "source": "/services.html", "destination": "/#services", "permanent": true },
    { "source": "/projects", "destination": "/#work", "permanent": true },
    { "source": "/projects.html", "destination": "/#work", "permanent": true },
    { "source": "/contact", "destination": "/#contact", "permanent": true },
    { "source": "/contact.html", "destination": "/#contact", "permanent": true },
    { "source": "/faq", "destination": "/", "permanent": true },
    { "source": "/faq.html", "destination": "/", "permanent": true }
  ]
}
```

- [ ] **Step 2: Delete the five old pages**

```bash
git rm website/about.html website/services.html website/projects.html website/faq.html website/contact.html
```

- [ ] **Step 3: Verify vercel.json is valid JSON and no `cleanUrls`**

Run: `node -e "const v=require('./vercel.json');if('cleanUrls' in v)throw new Error('cleanUrls present!');console.log('ok rewrites='+v.rewrites.length+' redirects='+v.redirects.length)"`
Expected: `ok rewrites=4 redirects=10`

- [ ] **Step 4: Commit**

```bash
git add vercel.json
git commit -m "Point vercel.json at single page; redirect old routes; remove old pages"
```

---

## Task 5: Local verification

**Files:** none (verification only)

- [ ] **Step 1: Start the dev server**

Run (from `website/`): `npm run dev`
This serves the repo root at `http://localhost:5173`.

- [ ] **Step 2: Open and eyeball the page**

Open `http://localhost:5173/website/index.html`. Confirm:
- Hero, About (+3 stat tiles), Services (6 cards), Work (3 photos with captions), Contact (form on dark band), footer all render.
- Photos load (served from `../assets/img/`).
- Clicking nav links (About/Services/Work/Contact) smooth-scrolls to the right section, not hidden under the sticky bar.
- Footer year shows the current year.
- Resize narrow (DevTools ~375px): nav collapses to the hamburger and toggles open/closed; grids drop to one column; hero image stacks above text.

- [ ] **Step 3: Stop the server** (Ctrl-C). No commit (nothing changed).

---

## Task 6: Push branch, get Vercel preview, verify live

**Files:** none (deploy + verification)

- [ ] **Step 1: Push the branch**

```bash
git push -u origin redesign-single-page
```

- [ ] **Step 2: Find the preview deployment URL**

Use the Vercel MCP `list_deployments` for project `prj_me8GjjX7md1rFH6YBC7gSwCbBI9u` (team `team_F7n5db6tgM8esGWWkHSRAQXy`); find the deployment whose `meta.githubCommitRef` is `redesign-single-page` and `state` is `READY`. Use its `url` (or the `…-git-redesign-single-page-…vercel.app` branch alias).

- [ ] **Step 3: Verify the preview serves correctly**

Preview deployment URLs are protected by Vercel Authentication — fetch them with the Vercel MCP `web_fetch_vercel_url` (not plain WebFetch). Confirm:
- `/` → 200, the single page (title contains "Masonry & Stonework").
- Old routes redirect: `/services` → 301 → `/#services`; `/contact` → `/#contact`; `/faq` → `/`. (MCP fetch reports status + redirect target.)
- `/about.html` etc. → 301 (not 404).

- [ ] **Step 4: Manual review in browser**

Open the preview branch-alias URL (authenticate if prompted). Walk the full page on desktop and a phone-width window. Submit one real test message through the form and confirm the success state (Formspree is already activated, so it delivers).

- [ ] **Step 5: No commit** — this task validates the branch. Promotion is Task 7.

---

## Task 7: Promote to production (only after owner approves the preview)

**Files:** none (release)

- [ ] **Step 1: Merge the branch to `main`**

```bash
git checkout main
git merge --no-ff redesign-single-page -m "Launch single-page redesign"
git push origin main
```

- [ ] **Step 2: Confirm the production deploy**

Vercel auto-deploys `main`. Via MCP `list_deployments`, confirm the newest `target: production` deployment for commit on `main` is `READY`.

- [ ] **Step 3: Verify live (public, no auth)**

Force-connect to the apex (DNS-independent), as established for this project:
```bash
IP=216.198.79.1
curl -s --resolve anjconstruction.co:443:$IP -o /dev/null -w "HTTP %{http_code} ssl=%{ssl_verify_result}\n" "https://anjconstruction.co/"
curl -s --resolve anjconstruction.co:443:$IP -o /dev/null -w "HTTP %{http_code} %{redirect_url}\n" "https://anjconstruction.co/services"
```
Expected: `/` → HTTP 200, `ssl=0`; `/services` → 301 with redirect to `/#services`.

- [ ] **Step 4: Final check** — open `https://anjconstruction.co/` in a browser; confirm the new single page, gallery photos, and a working form submit.

---

## Self-Review (completed by author)

- **Spec coverage:** structure (Task 1), design system + a11y (Task 2), interactions + form reuse (Task 3), old-route redirects + page deletion (Task 4), local + preview + prod verification (Tasks 5–7). All spec sections covered.
- **Placeholder scan:** none — full file contents and exact commands/expected output included.
- **Consistency:** class names and IDs in `index.html` (`.nav__toggle`, `#nav-links`, `.nav`, `#year`, `#contact-form`, `#form-status`, section ids `about/services/work/contact`) match the selectors used in `styles.css` and `script.js`. Form field `name="message"` is the Formspree-recognized details field; required fields `name`, `email` match the JS validation loop.
