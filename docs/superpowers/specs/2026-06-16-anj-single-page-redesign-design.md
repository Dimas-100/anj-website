# ANJ Construction — Single-Page Redesign

**Date:** 2026-06-16
**Status:** Design approved, pending spec review

## Context

ANJ Construction's site is live at `https://anjconstruction.co` (Vercel project `anj-website`, auto-deploys from `main`). It currently has six pages in an editorial/serif style (large Fraunces headlines, "Nº 01" section numbering, italic-red emphasis, dashed rules). The owner dislikes this design: it's too busy and "artsy" for the audience.

The audience is masonry/construction clients who skew **older**. They need the site to be simple, legible, and fast to act on — not clever. The owner wants the site reduced to four things: **who they are, what they offer, work they've done, and a way to get in touch.**

**Outcome:** replace the six-page editorial site with a single, clean, trustworthy scrolling page that's easy for an older audience to read and act on, while keeping the existing static/Vercel stack and the working contact form.

## Goals

- One single page covering: intro → who we are → what we offer → work → contact.
- "Clean & Trustworthy" visual style (see Design System) — a clear break from the current serif/editorial look.
- Contact **by form only**.
- Maximize legibility and ease for older visitors (big type, high contrast, large buttons, minimal motion).
- No downtime: build on a branch, preview, then promote.

## Non-Goals

- No phone-call or click-to-call CTA; no displayed phone number or email (form is the only contact path). *Assumption confirmed by approving the form-only mockup; an email fallback can be added later trivially.*
- No FAQ, no separate Services/About/Projects pages.
- No new backend, CMS, or framework — stays static HTML/CSS/JS on Vercel.
- No new photography sourced in this effort (we have 3 project photos; see Constraints).

## Decisions (locked during brainstorming)

1. **Structure:** single scrolling page with anchor navigation (not multi-page).
2. **Contact:** form only — no phone/email shown.
3. **Design direction:** "A · Clean & Trustworthy" — cream/charcoal with one terracotta accent, clean sans-serif, photo grid. Inspired by Mottern Masonry's "artisan-meets-trustworthy" feel.

## Page Structure (scroll order)

1. **Sticky nav** — "ANJ Construction" wordmark; links **About · Work · Contact** (smooth-scroll to sections); persistent terracotta **Request a quote** button (scrolls to contact).
2. **Hero** — kicker (`MASONRY & STONEWORK · GEORGIA`), H1 **"Masonry built to last."**, one plain-language subline, **Request a free quote** button, hero photo (`apartment-savanah.jpg`). Two columns on desktop, stacked on mobile.
3. **Who we are** (`#about`) — short heading + 2–3 sentences (family-run, since 2015, residential + commercial, all-Georgia) + three trust tiles: **Est. 2015 · All Georgia · Residential + Commercial**.
4. **What we offer** (`#services`) — six service cards: Brickwork, Stone Veneer, Retaining Walls, Chimneys & Fireplaces, Restoration, Commercial Masonry. Grid: 1 col (mobile) → 2–3 cols (desktop).
5. **Our work** (`#work`) — responsive photo grid of the 3 project photos, each with a caption (location) and descriptive `alt` text.
6. **Contact** (`#contact`) — dark band; heading "Request a free quote"; service-area line; **form** with fields: Name\*, Email\*, Project details (textarea); **Send request** button.
7. **Footer** — © ANJ Construction Inc.; short tagline.

## Design System ("Clean & Trustworthy")

- **Palette:** cream `#faf6f0` (primary bg) / `#f3ece1` (alt sections); charcoal text `#26241f`, muted `#6f6151`; terracotta accent `#b15c34` (hover `#9c4f2c`); dark band `#26241f` / footer `#1c1a17`; borders `#e7ddcf`.
- **Typography:** **Archivo** (already loaded in the project) with `system-ui` fallback; drop Fraunces (serif) and IBM Plex Mono. Large headings; body ≥ 18px for readability. One `<h1>` (the hero).
- **Components:** sticky nav, hero, trust tiles, service cards, photo gallery, form on dark band, footer. Generous spacing, rounded corners, subtle borders/shadows.
- **Accessibility (older audience is a first-class requirement):** semantic HTML; one H1 then logical H2s; real `<img>` with descriptive `alt`; WCAG-AA contrast; tap targets ≥ 44px; visible focus outlines; `prefers-reduced-motion` respected; readable line-length and line-height.

## Technical Approach

**Files**
- `website/index.html` — rewritten as the single page.
- **Delete** `website/about.html`, `services.html`, `projects.html`, `faq.html`, `contact.html`.
- `website/styles.css` — **replaced** with a clean, lean stylesheet for the new design system (the current ~4,000-line editorial CSS served the deleted pages; do not layer on it). Same filename, so `vercel.json` CSS passthrough is unchanged.
- `website/script.js` — slimmed to: mobile nav toggle, smooth-scroll for anchor links, sticky-nav scroll state, footer year, and the **existing Formspree submit logic (reused as-is)**. Remove project filters, scope chips, scroll-spy, hero zoom, pointer-hover effects.
- `assets/` — reuse existing `img/` (3 photos) and `branding/` (favicon already wired).

**`vercel.json`**
- Keep Root Directory = repo root; **do not add `cleanUrls`** (it 404s `.html` rewrite destinations — see CLAUDE.md).
- Rewrites: `/` → `/website/index.html`; `/styles.css` → `/website/styles.css`; `/script.js` → `/website/script.js`.
- **Redirects** (permanent) for old routes so bookmarks/links don't 404: `/about(.html)` → `/#about`, `/services(.html)` → `/#services`, `/projects(.html)` → `/#work`, `/contact(.html)` → `/#contact`, `/faq(.html)` → `/`.

**Contact form**
- Reuse Formspree endpoint `https://formspree.io/f/xdavjdyj` and the existing AJAX submit handler (`Accept: application/json`, success/error states). Fields: Name (required), Email (required), Project details (textarea). No phone field — keeps the "form only, no call" decision unambiguous.

**Safe rollout (no downtime)**
- Build the entire redesign on a new git branch (e.g. `redesign-single-page`). Vercel auto-creates a **preview deployment** with its own URL. `anjconstruction.co` keeps serving the current site untouched.
- Owner reviews the preview URL. Only on approval do we merge to `main` → production.

## Constraints / Assumptions

- **Photos:** only 3 project images exist (`apartment-savanah`, `chimney-winder`, `fireplace-winder`). The gallery is designed for 3 and is easy to expand when more are provided.
- **Copy:** reuse and tighten existing site copy (services descriptions, about text) — brief and plain.
- **Wordmark:** keep the text wordmark "ANJ Construction" (logo image optional later).
- **Contact:** form-only, no phone/email displayed (per "no call" + approved mockup).

## Verification

On the branch preview deployment:
1. Single page loads at `/`; all six sections render in order.
2. Nav links smooth-scroll to the correct sections; "Request a quote" reaches the form.
3. Old routes redirect correctly (`/services` → `/#services`, `/faq` → `/`, etc.) — no 404s.
4. Submit a real test message → Formspree delivers (form already activated).
5. All gallery images load with `alt` text; favicon present.
6. Responsive at mobile/tablet/desktop widths; large tap targets.
7. Contrast passes WCAG AA; visible keyboard focus; reduced-motion honored.
8. Then merge to `main`; confirm `https://anjconstruction.co` serves the new page and redirects work in production.
