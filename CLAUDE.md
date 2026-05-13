# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from `website/`:

```powershell
npm run dev    # python -m http.server 5173 --directory ..
```

The server serves the **repo root** (not `website/`) so that pages can reach `../assets/...`. Open `http://localhost:5173/website/` — visiting `http://localhost:5173/` will 404 in local dev. No build, lint, or test tooling is configured.

## Architecture

Static multi-page site. No framework, no bundler — browsers load `.html`, `styles.css`, and `script.js` directly.

**Two-folder split, intentional:**
- `assets/` (repo root) — brand logos (`assets/branding/`) and project photos (`assets/img/`). Shared, referenced from HTML/CSS as `../assets/...`. This is why the dev server serves the parent directory.
- `website/` — all pages, the single `styles.css`, and the single `script.js`.

**Pages:** `index.html`, `about.html`, `services.html`, `projects.html`, `faq.html`, `contact.html`. Nav and footer are now identical across all 6 pages.

**Single shared `script.js` for every page.** It guards each feature with `if (element)` / `querySelectorAll` so unrelated pages don't error. To wire up new page behavior, follow the same pattern — never assume a selector exists. The features it owns:
- Mobile nav toggle (`.nav__toggle` / `#nav-links`)
- Scroll chrome: `.is-scrolled` on `.nav`, `.is-visible` on `.back-top`
- Footer year (`#year`)
- Project category filters on `projects.html` (`.filter[data-filter]` toggles `.is-hidden` on `.project[data-category]`, sets `aria-pressed`)
- Scope chips on the contact form (`[data-scope]` buttons populate hidden `#scope-input` as a comma-joined string)
- Scroll-reveal: `script.js` **auto-adds** `.reveal` to `.section, .contact, .service-detail-section, .gallery-section, .company-detail, .values-section, .capabilities` and an IntersectionObserver adds `.is-visible`. To opt a new section in, give it one of those classes (or extend the selector list).
- Scroll-spy: in-page hash links inside `.nav__links` get `.is-active` based on which section is in view. (Currently inactive on every page since the unified nav uses page links, not anchors — kept in case in-page anchor nav is reintroduced.)
- Pointer-tracking hover effect: `.project-card`, `.service-card`, `.quote-path__grid article` get CSS vars `--mx` / `--my`.

**Contact form (`contact.html` + `script.js`):** posts to `https://formspree.io/f/TODO_FORM_ID`. The submit handler detects the `TODO_FORM_ID` substring in the action URL and short-circuits to a fake-success "demo mode" message **without** sending anything. Replace `TODO_FORM_ID` in `contact.html` with the real Formspree form ID before deploy, or all real submissions will silently no-op.

**CSS layering:** `website/styles.css` is ~4,000 lines with three override blocks (lines 1, ~2400, ~3137, ~3467) layered by source order. Don't unpick the older blocks — append new rules at the bottom so they win by cascade order. A `Design polish overrides` block at the end of the file groups the most recent additions; add new tweaks there.

## Deployment

Vercel config is at repo root in `vercel.json`. It rewrites clean URLs (`/`, `/about`, `/services`, etc.) and the `.html` variants to their files under `/website/`. CSS and JS get the same passthrough. Two important consequences:

- After deploy, visit `https://<domain>/` not `https://<domain>/website/`.
- Internal links in HTML still use `*.html` (e.g. `<a href="about.html">`) — Vercel resolves them via the rewrite. Don't strip `.html` from links; that would break local dev.
- If you add a new page, add **two rewrites** in `vercel.json` for it (clean URL + `.html` variant).

## Editing notes

- Replace placeholder domain `anjconstructioninc.com` (used in og:url / og:image / twitter:image on every page) with the real domain once chosen. Search `anjconstructioninc.com`.
- Search the codebase for `TODO` to find unresolved business-info placeholders (Formspree ID, license numbers, etc.).
- Logo variants live in `assets/branding/`. The two `<img>`-style references previously in each nav were removed — the nav now renders the wordmark as styled HTML text spans. The SVGs in that folder were patched (the originals referenced undefined CSS classes and rendered blank); they're still available for business cards, social posts, etc.
- "Licensed and insured" is **not** claimed anywhere on the site as of the last review. Add only after the business owner confirms valid licensing and provides documentation.
