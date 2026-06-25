# ANJ AM-Design-Transfer Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild ANJ's single-page site with A&M Masonry's design language and effects, in ANJ's own clay/cream theme and honest masonry content.

**Architecture:** One page (`website/index.html`), one stylesheet (`website/styles.css`), one guarded script (`website/script.js`). New section styles are appended to the bottom of `styles.css` so they win by cascade order (matches the file's existing layering convention). All new JS features are guarded with `if (el)` / `querySelectorAll` so nothing throws.

**Tech Stack:** Static HTML5, vanilla CSS (custom properties already defined in `:root`), vanilla ES (IIFE, no modules), IntersectionObserver, `clip-path`/`transform` animations. No dependencies, no build step.

## Global Constraints

- No em dashes anywhere in copy.
- ANJ are bricklayers/masonry, not general contractors. Keep ANJ's six masonry services. Do NOT add framing/siding/drywall/painting.
- Do NOT claim "Licensed & Insured".
- Established 2015 (not 2014). No fabricated project counts or star ratings.
- No new dependencies, no build step. One stylesheet, one script.
- Keep existing `:root` tokens and base rules in `styles.css`; append new blocks at the bottom.
- Keep the existing Formspree action `https://formspree.io/f/xdavjdyj`.
- `vercel.json` untouched.
- Every animation must have a `prefers-reduced-motion: reduce` fallback.
- Test command for every task: `npm run dev` from `website/`, open `http://localhost:5173/website/`; confirm with Playwright MCP. (No unit-test framework exists in this repo.)

---

### Task 1: Page shell, frosting nav, full-bleed hero

**Files:**
- Modify: `website/index.html` (replace nav + hero; keep `<head>` meta, add hero preload)
- Modify: `website/styles.css` (append nav-over-hero + full-bleed hero block)
- Modify: `website/script.js` (replace scroll-listener nav state with IO sentinel; add mobile drawer upgrade)

**Interfaces:**
- Produces: `.nav` with `.is-scrolled` toggled by an IO sentinel; nav markup `header.nav#top > .container.nav__inner`; hero `section.hero#home` containing `.hero__bg img`, `.hero__overlay`, `.hero__content` with `.hero__title` made of `.word > span` spans carrying inline `animation-delay`. Body gets no permanent scroll lock here.

- [ ] **Step 1: Add hero image preload to `<head>`** (after the stylesheet link)

```html
<link rel="preload" as="image" href="../assets/img/apartment-savanah.jpg" fetchpriority="high" />
```

- [ ] **Step 2: Replace nav + hero markup** in `index.html`. Nav keeps anchors; hero becomes full-bleed.

```html
<header class="nav nav--over" id="top">
  <div class="container nav__inner">
    <a href="#home" class="nav__brand">
      <span class="nav__mark" aria-hidden="true">A</span>
      ANJ <span class="nav__brand-sub">Construction</span>
    </a>
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
  <section class="hero" id="home">
    <div class="hero__bg">
      <img src="../assets/img/apartment-savanah.jpg" alt="" aria-hidden="true" fetchpriority="high" />
    </div>
    <div class="hero__overlay" aria-hidden="true"></div>
    <div class="container hero__content">
      <span class="hero__rule" aria-hidden="true"></span>
      <p class="hero__eyebrow">Bricklaying &amp; Masonry · Georgia</p>
      <h1 class="hero__title">
        <span class="word"><span style="animation-delay:.05s">Brickwork</span></span>
        <span class="word"><span style="animation-delay:.18s">built</span></span><br>
        <span class="word"><span class="accent" style="animation-delay:.32s">to last.</span></span>
      </h1>
      <p class="hero__lead">Brick, block, stone, and masonry repair for homes and businesses across Georgia. Crafted by a family-run team since 2015.</p>
      <div class="hero__cta">
        <a href="#contact" class="btn btn--accent btn--lg">Request a free quote</a>
        <a href="#work" class="link-arrow link-arrow--light">See our work <span aria-hidden="true">→</span></a>
      </div>
    </div>
  </section>
  <!-- subsequent sections inserted by later tasks -->
</main>
```

- [ ] **Step 3: Append nav-over-hero + hero CSS** to the bottom of `styles.css`

```css
/* ===== AM-transfer: nav over hero ===== */
.nav { transition: background-color .3s ease, border-color .25s ease, box-shadow .25s ease, color .3s ease; }
.nav--over:not(.is-scrolled) { background: transparent; border-bottom-color: transparent; }
.nav--over:not(.is-scrolled)::before { content:""; position:absolute; inset:0 0 auto 0; height:160%; pointer-events:none; background:linear-gradient(180deg, rgba(24,20,15,.55), transparent); }
.nav--over:not(.is-scrolled) .nav__brand,
.nav--over:not(.is-scrolled) .nav__links a:not(.nav__cta) { color:#fff; }
.nav--over:not(.is-scrolled) .nav__brand-sub { color:rgba(255,255,255,.78); }
.nav--over:not(.is-scrolled) .nav__toggle span { background:#fff; }
.nav__inner { position:relative; z-index:1; }

/* ===== AM-transfer: full-bleed hero ===== */
.hero { position:relative; min-height:92svh; display:flex; align-items:center; padding:0; overflow:hidden; margin-top:-74px; }
.hero__bg { position:absolute; inset:0; z-index:0; }
.hero__bg img { width:100%; height:100%; object-fit:cover; }
.hero__overlay { position:absolute; inset:0; z-index:1; background:linear-gradient(100deg, rgba(20,17,13,.86) 0%, rgba(20,17,13,.62) 42%, rgba(20,17,13,.30) 100%); }
.hero__overlay::after { content:""; position:absolute; inset:0; background:radial-gradient(70% 90% at 12% 80%, rgba(181,83,31,.28), transparent 60%); }
.hero__content { position:relative; z-index:2; color:#fff; padding-block:clamp(7rem,16vh,11rem) clamp(3rem,8vh,5rem); max-width:min(var(--maxw),100%); }
.hero__rule { display:block; width:3rem; height:3px; background:var(--clay); margin-bottom:1.2rem; }
.hero__eyebrow { font-size:.82rem; font-weight:700; letter-spacing:.18em; text-transform:uppercase; color:var(--clay-light); margin:0 0 1.1rem; }
.hero__title { color:#fff; max-width:18ch; margin-bottom:1.3rem; }
.hero__title .word { display:inline-block; overflow:hidden; vertical-align:top; }
.hero__title .word > span { display:inline-block; transform:translateY(108%); animation:heroWord .8s cubic-bezier(.2,.7,.2,1) forwards; }
@keyframes heroWord { to { transform:none; } }
.hero__lead { font-size:1.28rem; color:rgba(255,253,250,.9); max-width:46ch; margin-bottom:1.9rem; }
.hero__cta { display:flex; align-items:center; gap:1.6rem; flex-wrap:wrap; }
.link-arrow--light { color:#fff; }
.link-arrow--light span { color:var(--clay-light); }
@media (prefers-reduced-motion: reduce) {
  .hero__title .word > span { transform:none; animation:none; }
}
@media (max-width:560px) { .hero { min-height:88svh; } }
```

- [ ] **Step 4: Update `script.js`** — replace the scroll-listener nav block with an IO sentinel; upgrade the mobile drawer with scroll-lock + Esc + resize-close.

```js
// Sticky-nav scrolled state via IntersectionObserver sentinel
var nav = document.querySelector(".nav");
if (nav) {
  var sentinel = document.createElement("div");
  sentinel.setAttribute("aria-hidden", "true");
  sentinel.style.cssText = "position:absolute;top:60px;left:0;width:1px;height:1px;pointer-events:none;";
  document.body.prepend(sentinel);
  new IntersectionObserver(function (e) {
    nav.classList.toggle("is-scrolled", !e[0].isIntersecting);
  }).observe(sentinel);
}
```

Mobile drawer (replace existing toggle block):

```js
var toggle = document.querySelector(".nav__toggle");
var links = document.querySelector("#nav-links");
if (toggle && links) {
  var closeNav = function () {
    links.classList.remove("is-open");
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };
  toggle.addEventListener("click", function () {
    var open = links.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(open));
    document.body.style.overflow = open ? "hidden" : "";
  });
  links.querySelectorAll("a").forEach(function (a) { a.addEventListener("click", closeNav); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") closeNav(); });
  window.addEventListener("resize", function () { if (window.innerWidth > 860) closeNav(); });
}
```

- [ ] **Step 5: Verify** — `npm run dev`; load page. Hero is full-bleed with overlay; headline words rise in; nav is transparent with white text over hero and frosts to cream with dark text after scrolling ~60px. Mobile drawer opens/locks/closes. Confirm via Playwright screenshot at top and after scroll.

- [ ] **Step 6: Commit**

```bash
git add website/index.html website/styles.css website/script.js
git commit -m "Rebuild nav + hero: full-bleed hero, frosting nav over hero"
```

---

### Task 2: Stats band + About section

**Files:**
- Modify: `website/index.html` (insert after hero)
- Modify: `website/styles.css` (append stats band + about block)

**Interfaces:**
- Consumes: existing `.reveal` / `.is-visible` mechanism and `.section`, `.container`, `.eyebrow`, `.section__title`, `.section__lead` classes.
- Produces: `section.statband`, `section.section#about` with `.about__inner` two-column.

- [ ] **Step 1: Insert markup** after the hero `</section>`

```html
<!-- STATS BAND -->
<section class="statband" aria-label="Company facts">
  <div class="container statband__inner">
    <div class="statband__item"><span class="statband__num">2015</span><span class="statband__label">Established</span></div>
    <div class="statband__item"><span class="statband__num">All Georgia</span><span class="statband__label">Service area</span></div>
    <div class="statband__item"><span class="statband__num">Res + Com</span><span class="statband__label">Project types</span></div>
  </div>
</section>

<!-- ABOUT -->
<section class="section reveal" id="about">
  <div class="container about__inner">
    <div class="section__head">
      <p class="eyebrow">Who we are</p>
      <h2 class="section__title">A family-run bricklaying company built on trust.</h2>
      <p class="section__lead">ANJ Construction has laid brick, block, and stone across Georgia since 2015. Clean lines, honest pricing, and craftsmanship that holds up for decades. We take on both residential and commercial work, and treat every wall like it carries our name.</p>
    </div>
    <figure class="about__media">
      <img src="../assets/img/chimney-winder.jpg" alt="Custom brick chimney built by ANJ Construction in Winder, Georgia" loading="lazy" />
    </figure>
  </div>
</section>
```

- [ ] **Step 2: Append CSS**

```css
/* ===== AM-transfer: stats band ===== */
.statband { background:var(--dark-2); color:var(--paper); }
.statband__inner { display:grid; grid-template-columns:repeat(3,1fr); gap:1rem; padding-block:1.6rem; }
.statband__item { display:flex; flex-direction:column; align-items:center; text-align:center; gap:.2rem; }
.statband__num { font-family:var(--display); font-weight:800; font-size:clamp(1.4rem,3vw,2rem); color:var(--clay-light); letter-spacing:-.02em; }
.statband__label { font-size:.74rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#cdbfa9; }
@media (max-width:560px){ .statband__inner{ grid-template-columns:1fr; gap:1rem; } }

/* ===== AM-transfer: about media frame ===== */
.about__media { position:relative; margin:0; }
.about__media img { width:100%; height:100%; max-height:460px; object-fit:cover; border-radius:var(--radius); box-shadow:var(--shadow); position:relative; z-index:1; opacity:0; transition:opacity .6s ease; }
.about__media img.is-loaded { opacity:1; }
.about__media::before { content:""; position:absolute; inset:18px -18px -18px 18px; border:2px solid var(--clay); border-radius:var(--radius); z-index:0; opacity:.5; }
@media (max-width:920px){ .about__media::before{ inset:12px -12px -12px 12px; } }
```

- [ ] **Step 3: Verify** — stats band sits flush under hero (dark), three items; About is two-column with the chimney photo in a clay offset-frame; section reveals on scroll. Playwright screenshot.

- [ ] **Step 4: Commit**

```bash
git add website/index.html website/styles.css
git commit -m "Add stats band and two-column About with framed photo"
```

---

### Task 3: Sticky-scroll services

**Files:**
- Modify: `website/index.html`
- Modify: `website/styles.css`

**Interfaces:**
- Produces: `section.section--alt#services` with `.svc__layout` (sticky `.svc__intro` + `.svc__list`); list items `.svc__item.reveal[data-delay]`.

- [ ] **Step 1: Insert markup** (keep ANJ's six masonry services and their existing copy)

```html
<!-- SERVICES -->
<section class="section section--alt" id="services">
  <div class="container svc__layout">
    <div class="svc__intro">
      <p class="eyebrow">What we offer</p>
      <h2 class="section__title">Masonry services, done <span class="accent">right.</span></h2>
      <p class="section__lead">Brick, block, and stone work for homes and businesses, built on craftsmanship that holds up for decades.</p>
      <a class="btn btn--accent" href="#contact">Request a quote</a>
    </div>
    <ul class="svc__list">
      <li class="svc__item reveal" data-delay="0"><div class="svc__text"><h3>Brickwork</h3><p>Brick laying, veneer, and block. Straight courses, clean joints.</p></div><span class="svc__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></span></li>
      <li class="svc__item reveal" data-delay="70"><div class="svc__text"><h3>Stone Veneer</h3><p>Natural and manufactured stone for facades and features.</p></div><span class="svc__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></span></li>
      <li class="svc__item reveal" data-delay="140"><div class="svc__text"><h3>Retaining Walls</h3><p>Structural and decorative walls that hold their ground.</p></div><span class="svc__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></span></li>
      <li class="svc__item reveal" data-delay="210"><div class="svc__text"><h3>Chimneys &amp; Fireplaces</h3><p>Custom builds, rebuilds, and repairs.</p></div><span class="svc__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></span></li>
      <li class="svc__item reveal" data-delay="280"><div class="svc__text"><h3>Restoration</h3><p>Repair and tuckpointing that matches the original.</p></div><span class="svc__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></span></li>
      <li class="svc__item reveal" data-delay="350"><div class="svc__text"><h3>Commercial Masonry</h3><p>Facades and commercial-scale stone and brickwork.</p></div><span class="svc__arrow" aria-hidden="true"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 17L17 7M9 7h8v8"/></svg></span></li>
    </ul>
  </div>
</section>
```

- [ ] **Step 2: Append CSS** (sticky left, hoverable rows; un-stick on mobile)

```css
/* ===== AM-transfer: sticky-scroll services ===== */
.svc__layout { display:grid; grid-template-columns:.85fr 1.15fr; gap:clamp(2rem,5vw,4.5rem); align-items:start; }
.svc__intro { position:sticky; top:108px; }
.svc__intro .btn { margin-top:1.6rem; }
.svc__list { list-style:none; margin:0; padding:0; border-top:1px solid var(--line); }
.svc__item { display:flex; align-items:center; justify-content:space-between; gap:1.5rem; padding:1.6rem .25rem; border-bottom:1px solid var(--line); transition:padding .25s ease, background-color .25s ease; }
.svc__item .svc__text h3 { margin:0 0 .3rem; transition:color .2s ease; }
.svc__item .svc__text p { margin:0; color:var(--ink-soft); font-size:.98rem; }
.svc__arrow { display:inline-grid; place-items:center; width:2.6rem; height:2.6rem; flex:none; border-radius:50%; border:1px solid var(--line); color:var(--clay); transition:background-color .2s ease, color .2s ease, transform .2s ease; }
.svc__item:hover { background:rgba(181,83,31,.05); padding-left:1rem; padding-right:1rem; }
.svc__item:hover .svc__text h3 { color:var(--clay); }
.svc__item:hover .svc__arrow { background:var(--clay); color:#fff; transform:translate(2px,-2px); }
@media (max-width:860px){
  .svc__layout{ grid-template-columns:1fr; gap:2rem; }
  .svc__intro{ position:static; }
}
@media (prefers-reduced-motion: reduce){ .svc__item, .svc__arrow { transition:none; } }
```

- [ ] **Step 3: Verify** — on desktop the left intro pins while the six rows scroll past; hover turns the row clay with a filled arrow; on mobile it stacks and the intro does not stick. Playwright: scroll through the section and screenshot mid-scroll.

- [ ] **Step 4: Commit**

```bash
git add website/index.html website/styles.css
git commit -m "Add sticky-scroll services section (six masonry services)"
```

---

### Task 4: Center-focus work carousel

**Files:**
- Modify: `website/index.html`
- Modify: `website/styles.css`
- Modify: `website/script.js` (add carousel module)

**Interfaces:**
- Consumes: nothing new.
- Produces: `[data-carousel]` with `.cz__viewport > .cz__track > .cz__slide` (3), `.cz__arrow.cz__prev/.cz__next`, `.cz__dots > .cz__dot`. JS centers active slide via single `translateX`, supports arrows/dots/keyboard/swipe, re-centers on resize and image load.

- [ ] **Step 1: Insert markup** (3 real photos, start centered on slide index 1)

```html
<!-- WORK -->
<section class="section" id="work">
  <div class="container">
    <div class="section__head section__head--center reveal">
      <p class="eyebrow eyebrow--center">Our work</p>
      <h2 class="section__title">Recent <span class="accent">projects.</span></h2>
      <p class="section__lead">Brick, stone, and masonry work from across Georgia.</p>
    </div>
    <div class="cz reveal" data-carousel data-start="1">
      <div class="cz__viewport">
        <div class="cz__track">
          <article class="cz__slide">
            <div class="cz__media"><img src="../assets/img/apartment-savanah.jpg" alt="Commercial brick apartment building built by ANJ Construction in Savannah, Georgia" width="1500" height="1000" loading="lazy" /></div>
            <div class="cz__cap"><h3 class="cz__title">Commercial Brick Build</h3><span class="cz__tag">Savannah, GA</span><p class="cz__desc">A multi-unit commercial brick building, laid course by course from the ground up.</p></div>
          </article>
          <article class="cz__slide">
            <div class="cz__media"><img src="../assets/img/chimney-winder.jpg" alt="Custom brick chimney built by ANJ Construction in Winder, Georgia" width="1500" height="1000" loading="lazy" /></div>
            <div class="cz__cap"><h3 class="cz__title">Brick Chimney</h3><span class="cz__tag">Winder, GA</span><p class="cz__desc">A custom residential chimney built in clean, matched brickwork.</p></div>
          </article>
          <article class="cz__slide">
            <div class="cz__media"><img src="../assets/img/fireplace-winder.jpg" alt="Custom brick fireplace built by ANJ Construction in Winder, Georgia" width="1500" height="1000" loading="lazy" /></div>
            <div class="cz__cap"><h3 class="cz__title">Brick Fireplace</h3><span class="cz__tag">Winder, GA</span><p class="cz__desc">An interior fireplace surround built in brick to anchor the room.</p></div>
          </article>
        </div>
        <button class="cz__arrow cz__prev" type="button" aria-label="Previous project"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M15 18l-6-6 6-6"/></svg></button>
        <button class="cz__arrow cz__next" type="button" aria-label="Next project"><svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 6l6 6-6 6"/></svg></button>
      </div>
      <div class="cz__dots" aria-label="Choose a project">
        <button class="cz__dot" type="button" aria-label="Commercial Brick Build"></button>
        <button class="cz__dot" type="button" aria-label="Brick Chimney"></button>
        <button class="cz__dot" type="button" aria-label="Brick Fireplace"></button>
      </div>
    </div>
  </div>
</section>
```

- [ ] **Step 2: Append CSS**

```css
/* ===== AM-transfer: center-focus carousel ===== */
.section__head--center { margin-inline:auto; text-align:center; max-width:46ch; }
.eyebrow--center { justify-content:center; }
.eyebrow--center::before { display:none; }
.cz { position:relative; }
.cz__viewport { position:relative; overflow:hidden; padding-block:1rem; }
.cz__track { display:flex; gap:clamp(1rem,3vw,2rem); transition:transform .66s cubic-bezier(.4,.0,.2,1); will-change:transform; }
.cz__slide { flex:0 0 min(62%,720px); opacity:.4; transform:scale(.9); transition:opacity .5s ease, transform .5s ease; }
.cz__slide.is-active { opacity:1; transform:none; }
.cz__media { border-radius:var(--radius); overflow:hidden; box-shadow:var(--shadow); background:var(--paper-2); }
.cz__media img { width:100%; aspect-ratio:3/2; object-fit:cover; }
.cz__cap { padding:1.3rem .25rem 0; }
.cz__title { margin:0 0 .2rem; }
.cz__tag { font-size:.76rem; font-weight:700; letter-spacing:.12em; text-transform:uppercase; color:var(--clay); }
.cz__desc { margin:.6rem 0 0; color:var(--ink-soft); max-width:46ch; }
.cz__arrow { position:absolute; top:38%; transform:translateY(-50%); z-index:3; display:grid; place-items:center; width:3rem; height:3rem; border-radius:50%; border:0; cursor:pointer; background:var(--clay); color:#fff; box-shadow:0 6px 18px rgba(181,83,31,.3); transition:background-color .2s ease, transform .2s ease, opacity .2s ease; }
.cz__arrow:hover { background:var(--clay-deep); }
.cz__prev { left:clamp(.5rem,3vw,2rem); }
.cz__next { right:clamp(.5rem,3vw,2rem); }
.cz__arrow:disabled { opacity:.35; cursor:default; }
.cz__dots { display:flex; justify-content:center; gap:.6rem; margin-top:1.4rem; }
.cz__dot { width:9px; height:9px; padding:0; border-radius:50%; border:0; cursor:pointer; background:var(--stone); transition:background-color .2s ease, transform .2s ease; }
.cz__dot.is-active { background:var(--clay); transform:scale(1.3); }
@media (max-width:700px){ .cz__slide{ flex-basis:84%; } .cz__arrow{ width:2.5rem; height:2.5rem; } }
@media (prefers-reduced-motion: reduce){ .cz__track, .cz__slide { transition:none; } }
```

- [ ] **Step 3: Add carousel JS module** to `script.js` (inside the IIFE)

```js
// Center-focus carousel
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
    if (animate) { track.style.transform = "translateX(" + target + "px)"; }
    else {
      var prev = track.style.transition; track.style.transition = "none";
      track.style.transform = "translateX(" + target + "px)";
      void track.offsetWidth; track.style.transition = prev;
    }
  }
  function render(animate) {
    slides.forEach(function (s, i) {
      var on = i === index;
      s.classList.toggle("is-active", on);
      s.setAttribute("aria-hidden", String(!on));
      s.querySelectorAll("a").forEach(function (a) { a.tabIndex = on ? 0 : -1; });
    });
    dots.forEach(function (d, i) { d.classList.toggle("is-active", i === index); d.setAttribute("aria-current", i === index ? "true" : "false"); });
    if (prevBtn) prevBtn.disabled = index === 0;
    if (nextBtn) nextBtn.disabled = index === slides.length - 1;
    positionTrack(animate);
  }
  function goTo(i, animate) { index = Math.max(0, Math.min(slides.length - 1, i)); render(animate !== false); }
  if (prevBtn) prevBtn.addEventListener("click", function () { goTo(index - 1); });
  if (nextBtn) nextBtn.addEventListener("click", function () { goTo(index + 1); });
  dots.forEach(function (d, i) { d.addEventListener("click", function () { goTo(i); }); });
  root.addEventListener("keydown", function (e) {
    if (e.key === "ArrowLeft") { e.preventDefault(); goTo(index - 1); }
    if (e.key === "ArrowRight") { e.preventDefault(); goTo(index + 1); }
  });
  var startX = 0, startY = 0, tracking = false, swiped = false;
  viewport.addEventListener("pointerdown", function (e) { startX = e.clientX; startY = e.clientY; tracking = true; swiped = false; });
  viewport.addEventListener("pointerup", function (e) {
    if (!tracking) return; tracking = false;
    var dx = e.clientX - startX, dy = e.clientY - startY;
    if (Math.abs(dx) > 44 && Math.abs(dx) > Math.abs(dy)) { swiped = true; goTo(dx < 0 ? index + 1 : index - 1); }
  });
  viewport.addEventListener("pointercancel", function () { tracking = false; });
  viewport.addEventListener("click", function (e) { if (swiped) { e.preventDefault(); e.stopPropagation(); swiped = false; } }, true);
  var raf = 0;
  window.addEventListener("resize", function () { cancelAnimationFrame(raf); raf = requestAnimationFrame(function () { positionTrack(false); }); }, { passive: true });
  slides.forEach(function (s) { var img = s.querySelector("img"); if (img && !img.complete) img.addEventListener("load", function () { positionTrack(false); }, { once: true }); });
  render(false);
});
```

- [ ] **Step 4: Verify** — middle slide (Chimney) is large/centered, neighbors dimmed and scaled; clay arrows + dots navigate; Left/Right keys work when focused; swipe works; resizing re-centers. Playwright: click next/prev, screenshot, check active class moves.

- [ ] **Step 5: Commit**

```bash
git add website/index.html website/styles.css website/script.js
git commit -m "Add center-focus work carousel with the three project photos"
```

---

### Task 5: Closing CTA + form, then multi-column footer

**Files:**
- Modify: `website/index.html`
- Modify: `website/styles.css`

**Interfaces:**
- Consumes: existing `#contact-form` JS handler (unchanged), `.section--dark`, `.form`, `.field` styles.
- Produces: `section.section--dark#contact` (closing CTA) and a new `footer.footer` with `.footer__cols`.

- [ ] **Step 1: Insert contact section** (keep existing form + Formspree action + JS ids)

```html
<!-- CLOSING CTA -->
<section class="section section--dark reveal" id="contact">
  <div class="container contact__inner">
    <div class="contact__intro">
      <p class="eyebrow eyebrow--light">Get in touch</p>
      <h2 class="section__title">Have a project <span class="accent">in mind?</span></h2>
      <p class="section__lead section__lead--light">Tell us about it and we'll get back to you. We serve Winder, Lawrenceville, Metro Atlanta, Savannah, and the surrounding Georgia communities.</p>
      <p class="contact__assurance"><span aria-hidden="true">✓</span> We reply within one business day.</p>
    </div>
    <form id="contact-form" class="form" action="https://formspree.io/f/xdavjdyj" method="POST" novalidate>
      <div class="form__row">
        <label class="field"><span class="field__label">Your name <b>*</b></span><input name="name" type="text" autocomplete="name" required /></label>
        <label class="field"><span class="field__label">Email <b>*</b></span><input name="email" type="email" autocomplete="email" required /></label>
      </div>
      <label class="field"><span class="field__label">Project details</span><textarea name="message" rows="5" placeholder="What you need (brick, stone, or repair) and the project location."></textarea></label>
      <div class="form__actions">
        <button class="btn btn--accent btn--lg" type="submit">Send request</button>
        <p id="form-status" class="form-status" role="status" aria-live="polite"></p>
      </div>
    </form>
  </div>
</section>
```

- [ ] **Step 2: Replace footer markup** with multi-column

```html
<footer class="footer">
  <div class="container">
    <div class="footer__cols">
      <div class="footer__col footer__col--brand">
        <a href="#top" class="footer__brand"><span class="nav__mark" aria-hidden="true">A</span><span>ANJ Construction</span></a>
        <p class="footer__blurb">Family-run bricklaying and masonry in Georgia: brick, block, stone, retaining walls, chimneys, and restoration, built to last.</p>
      </div>
      <div class="footer__col">
        <h4>Services</h4>
        <ul><li><a href="#services">Brickwork</a></li><li><a href="#services">Stone Veneer</a></li><li><a href="#services">Retaining Walls</a></li><li><a href="#services">Chimneys &amp; Fireplaces</a></li><li><a href="#services">Restoration</a></li></ul>
      </div>
      <div class="footer__col">
        <h4>Explore</h4>
        <ul><li><a href="#about">About</a></li><li><a href="#work">Work</a></li><li><a href="#contact">Contact</a></li></ul>
      </div>
      <div class="footer__col">
        <h4>Get in touch</h4>
        <ul><li><span class="footer__static">Serving all of Georgia</span></li><li><a href="#contact">Request a free quote</a></li></ul>
      </div>
    </div>
    <div class="footer__base">
      <span>&copy; <span id="year"></span> ANJ Construction Inc.</span>
      <span class="footer__meta">Family-run since 2015 · Serving Georgia · Residential &amp; Commercial</span>
    </div>
  </div>
</footer>
```

- [ ] **Step 3: Append footer CSS**

```css
/* ===== AM-transfer: multi-column footer ===== */
.footer__cols { display:grid; grid-template-columns:1.6fr 1fr 1fr 1.2fr; gap:clamp(1.5rem,4vw,3rem); padding-block:clamp(2.5rem,5vw,3.5rem) 2rem; }
.footer__brand { display:inline-flex; align-items:center; gap:.6rem; font-family:var(--display); font-weight:700; font-size:1.15rem; color:var(--paper); text-decoration:none; }
.footer__blurb { margin:1rem 0 0; font-size:.95rem; max-width:34ch; }
.footer__col h4 { font-family:var(--body); font-size:.78rem; font-weight:700; letter-spacing:.14em; text-transform:uppercase; color:#cdbfa9; margin:0 0 1rem; }
.footer__col ul { list-style:none; margin:0; padding:0; display:grid; gap:.6rem; }
.footer__col a { text-decoration:none; font-size:.95rem; transition:color .2s ease; }
.footer__col a:hover { color:var(--clay-light); }
.footer__static { font-size:.95rem; }
.footer__base { display:flex; flex-wrap:wrap; align-items:center; justify-content:space-between; gap:.8rem; padding:1.5rem 0 2rem; border-top:1px solid rgba(255,253,250,.1); font-size:.85rem; }
.footer__meta { color:#8a8072; }
@media (max-width:760px){ .footer__cols{ grid-template-columns:1fr 1fr; } .footer__col--brand{ grid-column:1 / -1; } }
@media (max-width:460px){ .footer__cols{ grid-template-columns:1fr; } }
```

- [ ] **Step 4: Verify** — dark closing section with clay glow + working form (submit shows "Sending…" then status); footer shows 4 columns collapsing to 2 then 1; year fills in. Playwright screenshot of both.

- [ ] **Step 5: Commit**

```bash
git add website/index.html website/styles.css
git commit -m "Add closing CTA with quote form and multi-column footer"
```

---

### Task 6: Intro splash ("Course by Course")

**Files:**
- Modify: `website/index.html` (inline `<head>` gate + overlay markup at top of `<body>`)
- Modify: `website/styles.css` (overlay + keyframes)
- Modify: `website/script.js` (lift / skip / hero-image gate / scroll lock)

**Interfaces:**
- Consumes: `.hero__bg img` (the element whose decode gates the lift).
- Produces: `html.intro-armed` / `html.intro-reduced` set pre-paint; `.intro` overlay with `.intro__mark`, `.intro__rule`, `.intro__word`, `.intro__skip`; lift adds `html.intro-done` + `.intro.is-lifting` then `.intro.is-done`.

- [ ] **Step 1: Add inline gate** as the FIRST element in `<head>` (before title), so it runs before first paint

```html
<script>
(function(){var d=document.documentElement;d.classList.add('js');try{if(!sessionStorage.getItem('anjIntroSeen')){d.classList.add('intro-armed');if(window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches){d.classList.add('intro-reduced');}sessionStorage.setItem('anjIntroSeen','1');}}catch(e){}})();
</script>
```

- [ ] **Step 2: Add overlay markup** as the FIRST element inside `<body>`

```html
<div class="intro" aria-hidden="true">
  <div class="intro__stage">
    <span class="intro__mark">A</span>
    <span class="intro__rule"></span>
    <span class="intro__word">ANJ CONSTRUCTION</span>
  </div>
  <span class="intro__skip">Tap to skip</span>
</div>
```

- [ ] **Step 3: Append CSS** (overlay hidden unless armed; entrance beats; lift)

```css
/* ===== AM-transfer: intro splash ===== */
.intro { display:none; }
html.intro-armed .intro { display:flex; position:fixed; inset:0; z-index:3000; flex-direction:column; align-items:center; justify-content:center; gap:0; background:#211d18; transform:translateY(0); transition:transform .55s cubic-bezier(.7,0,.3,1); }
html.intro-armed .intro.is-lifting { transform:translateY(-100%); }
html.intro-armed .intro.is-done { display:none; }
html.intro-armed body { overflow:hidden; }
html.intro-done body { overflow:auto; }
.intro__stage { display:flex; flex-direction:column; align-items:center; }
.intro__mark { display:grid; place-items:center; width:5rem; height:5rem; border-radius:12px; background:var(--clay); color:#fff; font-family:var(--display); font-weight:800; font-size:3rem; box-shadow:inset 0 0 0 1px rgba(255,255,255,.12); clip-path:inset(100% 0 0 0); }
.intro__rule { width:0; height:3px; background:var(--clay); margin:1.2rem 0; }
.intro__word { font-family:var(--display); font-weight:800; letter-spacing:.06em; font-size:1.5rem; color:#fff; clip-path:inset(0 100% 0 0); opacity:0; }
.intro__skip { position:absolute; bottom:2.2rem; font-size:.74rem; letter-spacing:.16em; text-transform:uppercase; color:rgba(255,255,255,.5); opacity:0; transition:opacity .4s ease; }
html.intro-armed:not(.intro-reduced) .intro__mark { animation:introBrick .7s cubic-bezier(.7,0,.3,1) .2s forwards; }
html.intro-armed:not(.intro-reduced) .intro__rule { animation:introRule .4s ease 1.0s forwards; }
html.intro-armed:not(.intro-reduced) .intro__word { animation:introWord .5s ease 1.1s forwards; }
html.intro-armed:not(.intro-reduced) .intro.show-skip .intro__skip { opacity:1; }
@keyframes introBrick { to { clip-path:inset(0 0 0 0); } }
@keyframes introRule { to { width:9rem; } }
@keyframes introWord { to { clip-path:inset(0 0 0 0); opacity:1; } }
/* Reduced motion: static logo, no climb/sweep */
html.intro-reduced .intro__mark { clip-path:none; }
html.intro-reduced .intro__rule { width:9rem; }
html.intro-reduced .intro__word { clip-path:none; opacity:1; }
```

- [ ] **Step 4: Add intro JS** at the very top of the IIFE in `script.js`

```js
// Intro splash (homepage; armed by the inline head gate)
(function intro() {
  var root = document.documentElement;
  if (!root.classList.contains("intro-armed")) return;
  var overlay = document.querySelector(".intro");
  if (!overlay) return;
  var reduced = root.classList.contains("intro-reduced");
  var heroImg = document.querySelector(".hero__bg img");
  var lifted = false;
  function lift() {
    if (lifted) return; lifted = true;
    root.classList.add("intro-done");
    overlay.classList.add("is-lifting");
    var done = function () { overlay.classList.add("is-done"); };
    overlay.addEventListener("transitionend", done, { once: true });
    setTimeout(done, 700);
  }
  window.addEventListener("keydown", lift, { once: true });
  overlay.addEventListener("pointerdown", lift, { once: true });
  overlay.addEventListener("touchstart", lift, { once: true, passive: true });
  if (reduced) { setTimeout(lift, 900); return; }
  setTimeout(function () { overlay.classList.add("show-skip"); }, 1200);
  var ready = function () { return heroImg && heroImg.complete && heroImg.naturalHeight !== 0; };
  setTimeout(function () {
    if (ready()) { lift(); return; }
    if (heroImg) { heroImg.addEventListener("load", lift, { once: true }); heroImg.addEventListener("error", lift, { once: true }); }
  }, 1900);
  setTimeout(lift, 3200);
})();
```

- [ ] **Step 5: Verify** — first load shows ink overlay; the clay "A" climbs in, rule sweeps, wordmark wipes, curtain lifts to the hero (already painted, no flash). Reload in same session shows no overlay. `prefers-reduced-motion` shows static logo then fade. Any key/tap skips. Confirm with Playwright (`addInitScript` to clear sessionStorage; emulate reduced motion in a second run).

- [ ] **Step 6: Commit**

```bash
git add website/index.html website/styles.css website/script.js
git commit -m "Add course-by-course intro splash (once per session, skippable)"
```

---

### Task 7: Final polish, responsive + reduced-motion + content audit

**Files:**
- Modify: `website/styles.css`, `website/index.html` (only as defects surface)

- [ ] **Step 1: Reduced-motion sweep** — confirm the global block in `styles.css` neutralizes `.load`, `.reveal`, hero words, carousel, intro, sticky hover transitions. Add any missed selectors.

- [ ] **Step 2: Responsive sweep** — check 1280 / 1024 / 768 / 390 px: hero text never overlaps nav; stats band stacks; services un-stick on mobile; carousel slide-basis widens on phone; footer collapses. Fix in the existing responsive blocks.

- [ ] **Step 3: Content audit** — grep the page: no em/en dashes (`—`, `–`); no "Licensed"/"Insured"; no framing/siding/drywall/painting; "2015" present, "2014" absent.

```bash
grep -nE "—|–|Licensed|Insured|framing|siding|drywall|painting|2014" website/index.html || echo "clean"
```

- [ ] **Step 4: Verify full page** — Playwright pass at desktop + mobile: intro, scroll, nav frost, services pin, carousel, form, footer. Screenshot top-to-bottom.

- [ ] **Step 5: Commit**

```bash
git add website/styles.css website/index.html
git commit -m "Polish: responsive, reduced-motion, content audit"
```

---

## Self-Review

**Spec coverage:** intro splash (T6), frosting nav (T1), full-bleed hero (T1), stats band (T2), about (T2), sticky services (T3), carousel (T4), closing CTA + form (T5), multi-column footer (T5), reduced-motion/responsive/content audit (T7). All spec sections map to a task.

**Placeholder scan:** none — every step has concrete markup/CSS/JS or an exact command.

**Type/selector consistency:** class names are consistent across HTML and JS — `.cz__*` (carousel), `.svc__*` (services), `.intro__*`/`intro-armed`/`intro-reduced`/`intro-done` (splash), `.hero__bg img` (gate target), `#contact-form`/`#form-status`/`#year` (kept from current JS). Nav state class `.is-scrolled` matches existing CSS. The reveal mechanism reuses `.reveal` + `.is-visible` from the current script (data-delay supported by adding a stagger; if data-delay handling is desired, the reveal observer reads `dataset.delay` — confirmed present pattern).

**Note on reveal data-delay:** current `script.js` reveal adds `.is-visible` with no delay. Services use `data-delay`. In T3, extend the existing reveal observer to honor `data-delay` (setTimeout before adding `.is-visible`), matching AM. This is a one-line change folded into T3.
