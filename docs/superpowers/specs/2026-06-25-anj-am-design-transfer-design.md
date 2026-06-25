# ANJ — AM Masonry design transfer (enriched single page) — Design

**Date:** 2026-06-25
**Status:** Approved (user delegated autonomous execution)
**Scope:** `website/index.html`, `website/styles.css`, `website/script.js`

## Goal

Bring the **design language, structure, and effects** of the A&M Masonry site
(`C:\Users\junio\code\ammasonry`) into the ANJ Construction site, while keeping
ANJ's own theme and using a **different color scheme** than AM. ANJ stays a
**single page** (it was recently redesigned to single-page on purpose); we enrich
that one page with AM's signature interactions.

## Constraints carried in from project rules / memory

- **No em dashes** in any copy.
- ANJ are **bricklayers / masonry**, not general contractors. Keep ANJ's masonry
  service set. Do **not** import AM's framing / siding / drywall / painting.
- **Do not claim "Licensed & Insured"** (not confirmed for ANJ).
- Keep the brand honest: established **2015** (AM is 2014); no fabricated project
  counts or star ratings.
- No new dependencies, no build step (static HTML/CSS/JS). One stylesheet, one
  script, per the existing CLAUDE.md single-script pattern.
- `vercel.json` untouched — the `/` route already serves `website/index.html`.

## What is kept (ANJ "Heritage Masonry" theme)

- Palette: cream `--paper #f7f1e8` / `--paper-2 #efe6d7`, ink-brown `--ink #211d18`
  / `--dark-2 #2c261f` / `--dark-deep #18140f`, **clay accent** `--clay #b5531f`
  / `--clay-deep #8f3f16` / `--clay-light #d98c5f`, `--stone #cdbfa9`.
- Fonts: **Bricolage Grotesque** (display) + **Hanken Grotesk** (body).
- Paper-grain texture overlay + warm radial background.
- This palette is already distinct from AM's crimson `#C8102E`, so "keep our
  theme" and "not AM's colors" are both satisfied.

## What is NOT copied from AM

- AM's crimson palette and Archivo / Fraunces / JetBrains Mono fonts.
- AM's general-contractor services and its "Licensed & Insured / since 2014" claims.
- AM's multi-page architecture and its inner-page-only features: video project
  rows, parallax photo spreads, lightbox gallery, FAQ accordion. (Deferred to a
  possible later multi-page pass.)

## Page structure (single page, anchor nav)

1. **Intro splash** — once per session
2. **Nav** — transparent over hero, frosts solid on scroll
3. **Hero** — full-bleed photo + overlay
4. **Stats band** — slim dark, 3 honest stats
5. **About** — "Who we are"
6. **Services** — sticky-scroll two-column
7. **Work** — center-focus carousel (3 real photos)
8. **Closing CTA** — dark section + quote form
9. **Footer** — multi-column

## Section details

### 1. Intro splash — "Course by Course" (ANJ-flavored)
- Plays on first load of a session only (`sessionStorage` key `anjIntroSeen`), set
  by an inline `<head>` gate **before first paint** so repeat views / reduced-motion
  never flash the overlay. Classes: `html.intro-armed`, `html.intro-reduced`.
- Background = ANJ ink-brown `#211d18` so the lift reveals a same-color hero base
  (no flash).
- Choreography (~2.2s), compositor-only (`transform`/`opacity`/`clip-path`):
  - clay square **"A" mark** reveals bottom-to-top via `clip-path: inset(100% 0 0 0)
    → inset(0 0 0 0)` (the "brick course");
  - clay **mortar rule** sweeps out (`scaleX(0)→scaleX(1)`, origin left);
  - **"ANJ CONSTRUCTION" wordmark** wipes in left→right (`clip-path` + opacity);
  - brief hold;
  - **curtain slides up** (`translateY(0)→translateY(-100%)`).
- Built from CSS text + shapes reusing the existing `.nav__mark` clay-square brand
  treatment. **No new image assets, no libraries.**
- **Lift gating:** ANJ's hero is a photo (not video), so lift at
  `max(minDisplay ≈ 1.9s, heroImageDecoded)` with a hard fallback ~3.2s. Hero
  image gets `<link rel="preload" as="image" fetchpriority="high">` so it is ready.
- **Skippable:** any `keydown` / `pointerdown` / `touchstart` lifts immediately; a
  subtle "Tap to skip" hint fades in ~1.2s.
- **Reduced motion:** static logo (no climb/sweep), hold ~0.6s, fade out.
- Body scroll locked while the overlay is up; released on lift.
- Overlay is decorative → `aria-hidden="true"`, no focusable children. Real content
  stays in the DOM (covered, not removed).

### 2. Nav — transparent over hero, frosts on scroll
- Reuse ANJ nav markup (brand mark + links + CTA). Two visual states:
  - **Top / over hero:** transparent background + soft top-down scrim
    (`::before`), **light** text + light brand mark, for legibility on the dark hero.
  - **Scrolled (`.is-scrolled`):** existing cream `color-mix` blur bar, **dark**
    text, bottom hairline + soft shadow.
- `.is-scrolled` driven by an **IntersectionObserver sentinel** (AM's approach),
  replacing the current `scroll` listener.
- Links: About / Services / Work / Contact + clay "Request a quote" CTA. No
  Projects dropdown (single page).
- Mobile: AM-style full drawer with body-scroll-lock, Escape-to-close, close on
  link click, close on resize past breakpoint.

### 3. Hero — full-bleed
- `min-height: ~92svh`, full-bleed `assets/img/apartment-savanah.jpg` behind a
  left-weighted dark gradient overlay (ink + faint clay glow). `<img>` (not video).
- Overlaid left: clay **hero rule** + eyebrow "Bricklaying & Masonry · Georgia";
  **word-by-word reveal** headline "Brickwork built **to last.**" (`.word > span`
  with staggered `animation-delay`, clay accent on "to last."); lead paragraph;
  CTAs: clay "Request a free quote" + "See our work →" text link.

### 4. Stats band
- Slim dark band (`--dark-2`) directly under the hero. Three **honest** stats with
  clay numerals: **2015 / Established**, **All Georgia / Service area**,
  **Res + Com / Project types**. Reuses ANJ's current honest stats; no invented
  numbers or ratings.

### 5. About — "Who we are"
- ANJ's existing family-run-since-2015 copy. Light section, two columns:
  heading + lead on one side, a `chimney-winder.jpg` (or `fireplace-winder.jpg`)
  photo in a **clay offset-frame** (reuse the `.hero__media::before` border idea)
  on the other. `.reveal` on scroll.

### 6. Services — sticky-scroll (AM signature)
- Two-column layout:
  - **Left (sticky):** eyebrow "What we offer", heading "Masonry services, done
    right.", short lead, clay "Request a quote" button. `position: sticky` so it
    pins while the list scrolls.
  - **Right (list):** ANJ's **six masonry services** as rows — Brickwork, Stone
    Veneer, Retaining Walls, Chimneys & Fireplaces, Restoration, Commercial
    Masonry — each with title, one-line description, and an arrow glyph; `.reveal`
    with staggered `data-delay`; **clay highlight on hover**.
- Mobile: collapses to a clean stacked list (intro un-sticks). Verified to pin
  correctly despite any `overflow-x` on ancestors.

### 7. Work — center-focus carousel
- Port AM's center-focus carousel: active slide large/centered, neighbours dimmed
  and scaled back as peeks, circular **clay** ‹ › arrows + dots, keyboard
  (Left/Right), pointer swipe (with click-suppression after a drag); the whole
  track glides via a single `translateX` transform (GPU, ~0.66s ease).
- Slides = ANJ's **three real photos**: Savannah commercial brick build, Winder
  chimney, Winder fireplace. Each slide: photo + caption card (title, location
  tag, short honest description). Start index centered on the middle slide.
- Re-centers on resize and after images decode. Light section background.

### 8. Closing CTA + quote form
- Dark ink section with the existing clay radial glow (`.section--dark::after`).
  Heading "Have a project in mind?" + lead. ANJ's existing contact form (name,
  email, project details) on the **existing real Formspree action**
  (`https://formspree.io/f/xdavjdyj`). Keep AJAX submit + `#form-status` live region
  + "We reply within one business day."

### 9. Footer — multi-column
- Upgrade the one-line footer to four columns:
  - **Brand** + short blurb,
  - **Services** (anchor links to the service rows / `#services`),
  - **Explore** (About / Work / Contact anchors),
  - **Get in touch** (email, service area, "Request a free quote").
- Base bar: `© <year> ANJ Construction Inc.` + honest meta "Family-run since 2015 ·
  Serving Georgia · Residential & Commercial". **No licensing claim.**

## JavaScript (single `script.js`, guarded per existing pattern)

Add / upgrade, each guarded with `if (el)` / `querySelectorAll`:
- Intro splash: lift, skip handlers, hero-image-ready gate, `sessionStorage` write,
  scroll lock/unlock.
- Sticky-nav `.is-scrolled` via IntersectionObserver sentinel (replaces scroll
  listener).
- Staggered scroll-reveal (`.reveal` + `data-delay`), IntersectionObserver.
- Center-focus carousel (ported, generalized to `[data-carousel]`).
- Lazy image fade-in (`img[loading="lazy"]` → `.is-loaded`).
- Mobile nav drawer (scroll-lock + Esc + resize-close).
- Smooth anchor scrolling; brand-click → scroll to top.
- Footer year; form AJAX submit (keep existing).
- Everything gated by `prefers-reduced-motion`.

## CSS (single `styles.css`)

- Keep the existing `:root` token block and base/typography rules unchanged.
- Append new section blocks (intro, full-bleed hero, transparent nav state, stats
  band, sticky services, carousel, multi-column footer) at the **bottom** so they
  win by cascade order, consistent with the file's layering convention.
- All new colors reference existing tokens (clay/ink/cream); no new palette.

## Accessibility

- Splash decorative + `aria-hidden`, fully skippable, reduced-motion path.
- Carousel: arrows are real `<button>`s with labels; non-active slides
  `aria-hidden` + links `tabindex="-1"`; dots labelled; keyboard support.
- Nav drawer: `aria-expanded`, Escape close, focus-visible preserved.
- Color contrast: light text only over the dark hero/overlay and dark sections.
- `:focus-visible` clay outline retained.

## Out of scope (YAGNI / later pass)

- Dedicated About / Services / Projects / FAQ pages.
- Video project rows, parallax spreads, lightbox gallery, FAQ accordion.
- New imagery beyond the 3 existing photos.
- Any `vercel.json` / routing / SEO-structure changes.

## Verification

- Local preview: `npm run dev` from `website/`, open `http://localhost:5173/website/`.
- Playwright pass: intro plays on first load + lifts to hero; reload in same
  session shows no intro; reduced-motion shows static fade; nav frosts on scroll;
  services pin while the list scrolls; carousel arrows/dots/keyboard/swipe move the
  focus slide; mobile drawer opens/locks/closes; form still posts.
- Responsive check at desktop / tablet / phone widths (stacking, sticky un-stick,
  carousel sizing).
- Content audit: no em dashes; no contractor services; no "Licensed & Insured";
  "2015" not "2014".

## Rollback

Pre-change state is the current `main` (commit `03ceada`). Revert the single
commit if needed; only 3 files change.
