# Navid Group — Launch Site

A standalone static website with 3 working destinations:

- `index.html` — main landing: NAV's (left), Navid portrait/About (centre), PCB&T (right)
- `about-navid.html` — about Navid introductory profile; avoids unverified personal claims
- `navs.html` — NAV's holding-page preview (the full NAV's website remains to be built)
- PCB&T links to `https://alirezakhani91.github.io/pcb-t/` (change it in HTML if the official site/domain changes)

All files use relative paths and are suitable for a **new, separate GitHub Pages repository**.

Upload the **contents of this directory**, not the parent folder or the ZIP file, to repository root.

Enable GitHub Pages at **Settings → Pages → Deploy from a branch → main → /(root)**.

The three transparent `.png` files are transparency edits of the three **user-provided original images**; the main portrait uses source pixels to avoid altering the person's face or appearance. Background removal may leave tiny edge artifacts at extreme zoom.

The original NAV's and PCB&T logo artwork and typography are retained; only photo backgrounds were removed. A pale circular contrast surface is used behind PCB&T's dark navy lettering so the original logo remains readable on the dark site.

This project intentionally contains no fake testimonials, staff profiles, awards, credentials, or invented contact data.

**UPLOAD NOTE:** All 3 HTML files, 3 PNG images, `site.css`, and `site.js` must be uploaded **together at the root**. No folders are required; this flat layout avoids broken GitHub Pages paths.

## White logo update
The **home page** loads `pcbt-logo-white.png` (the user-selected all-white PCB&T logo) on the black background, with no pale circular backplate. The original color `pcbt-logo-transparent.png` is preserved in the project. To update an existing GitHub Pages site, upload `index.html`, `site.css`, and `pcbt-logo-white.png` together in the repository root.


## About Navid V3 (2026-11)
The redesigned `about-navid.html` includes a factual profile and uses `about-navid.css`, `about-navid.js` and `navid-standing-transparent.webp`. The submitted photograph was cut out (background removed) without redrawing facial features.
