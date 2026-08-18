# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Run from `website/`:

```powershell
npm run dev    # python -m http.server 5173 --directory ..
```

The server serves the **repo root** (not `website/`) so the page can reach `../assets/...`. Open `http://localhost:5173/website/` — visiting `http://localhost:5173/` will 404 in local dev. No build, lint, or test tooling is configured. The contact form cannot be exercised locally (python's http.server can't run `api/contact.js`) — submitting locally shows the error path with the phone fallback, which is expected.

## Architecture

Static **single-page** site (rebuilt 2026-08-18, "String Line" design) + one Vercel serverless function. No framework, no bundler.

- `website/index.html` — the whole site: hero, course strip, `#services` (Brick/Stone/Block pillars), `#work`, `#about`, `#area`, `#contact`, footer. Old multi-page URLs (`/about`, `/services.html`, …) redirect to these hash anchors via `vercel.json` — if you rename a section id, update the redirects.
- `website/styles.css` — single coherent stylesheet, design tokens at the top (`--iron`, `--mortar`, `--brick: #c0231d`, etc.). Fonts: Besley (display) / Archivo (body) via Google Fonts. The signature device is the red "string line" (`.stringline` variants). Respects `prefers-reduced-motion`.
- `website/script.js` — guarded features (never assume a selector exists): mobile nav toggle, nav scroll shadow, footer year, `.reveal` IntersectionObserver, and the contact-form fetch handler.
- `assets/branding/` — logo lockups. Site icons are the ANJ mark (red square, white ANJ): `favicon.png` (48), `favicon-96.png`, `apple-touch-icon.png` (180), all derived from `anj-mark-square-fixed.png` (a clean 512px rebuild — the original `anj-mark-square.png` is a broken export whose "J" overflows the square; don't use it). `assets/img/` — **real project photos only, never stock**: web-optimized versions at the top level (EXIF orientation baked in, metadata stripped), camera originals under `assets/img/originals/`. Beware: the originals carry stale EXIF orientation flags — always re-derive web versions with orientation normalized (this caused the "upside down photos" mess in the abandoned `redesign/am-design-transfer` branch).
- `api/contact.js` — CommonJS Vercel function; the contact form POSTs JSON to `/api/contact` and it emails the submission via **Resend** (`https://api.resend.com/emails`, no npm deps) from `website@anjconstruction.co` to the owner's Gmail. Honeypot field `company` silently drops bots. Requires the `RESEND_API_KEY` env var on the **anj-website** Vercel project; without it the endpoint returns 500 and the site shows the call-us fallback. Never put the key in client code.

## Deployment

**Live:** `https://www.anjconstruction.co` via Vercel project `anj-website` (team `diazdimas042-8048's projects`), GitHub `Dimas-100/anj-website`. **Every push to `main` auto-deploys to production.** Root Directory is the repo root (required so `vercel.json` and `api/` are picked up).

`vercel.json` rewrites `/`, `/index.html`, `/styles.css`, `/script.js` into `/website/`, and redirects the retired multi-page URLs to hash anchors. Consequences:

- **Do NOT add `"cleanUrls": true`.** It rewrites destinations to extensionless paths and 404s every page while non-html rewrites still work — it was removed for exactly this reason.
- `robots.txt`, `sitemap.xml`, and everything under `assets/` are served statically from the repo root; no rewrites needed.
- `/api/contact` is untouched by the rewrites (they're all exact paths).

## Editing notes

- **Canonical domain is `www.anjconstruction.co`** (og/canonical/JSON-LD all point there).
- **Local SEO consistency:** the business name `ANJ Construction Inc.` must exactly match the Google Business Profile everywhere it appears (title, JSON-LD `GeneralContractor` block, header, footer). **The phone number (770) 900-0163 was deliberately removed from the whole site 2026-08-18** (owner request: no dedicated person to answer calls yet) — don't re-add it without the owner asking; when it returns it must exactly match the GBP. Dormant `.nav__phone` / `.contact__phone` / `.footer__phone` CSS rules were kept for that day.
- **Email:** the domain has NO inbound email (no root MX). Never publish an `@anjconstruction.co` mailto unless forwarding (e.g. ImprovMX) is set up first. At Namecheap DNS, never touch `send.anjconstruction.co` (MX + SPF), `resend._domainkey`, or `_dmarc` — invoice sending depends on them.
- **Never claim "Licensed and insured"** — not confirmed by the owner.
- Real photos only in `assets/img/` — no stock imagery anywhere on the site.
- **Never delete `googlea8c14d5a0071eb1c.html`** (repo root) — it's the Google Search Console ownership proof for the `https://www.anjconstruction.co/` property (verified 2026-08-18, sitemap submitted). Google re-checks it; removing it un-verifies the site.
- The nested `anj-finances/` folder is a separate git repo (gitignored here) — never commit it to this repo.
