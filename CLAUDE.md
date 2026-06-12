# Pubs With Playgrounds — website repo

This repo is the marketing and support website for the Pubs With Playgrounds app,
served by GitHub Pages at https://www.pubswithplaygrounds.com. It is separate from
the Flutter app repo.

## What this site is

A static site — plain HTML and CSS, no build step, no framework, no dependencies.
Whatever is pushed to the default branch is deployed automatically by GitHub Pages,
usually live within a couple of minutes.

## Pages

- `index.html` — the homepage. Hero with real app screenshots in phone frames,
  stats band, "how it works" walkthrough, facilities chips, community section,
  download CTA, support links.
- `privacy.html`, `terms.html`, `account-deletion.html` — legal pages required by
  the App Store. Do not change their content without being asked explicitly.
- `android-beta.html` — Android beta signup page.
- `styles.css` — the single shared stylesheet for ALL pages. The top half styles
  the homepage; the section at the bottom marked "Legacy pages" styles the legal
  and beta pages. Changes to shared tokens (`:root` variables) affect every page.

## Design system

- Palette (CSS variables in `:root`): deep pub green `--green-deep #173527`,
  map mint `--mint #e9f4ea`, brand coral `--coral #e8654a`, paper `--paper #fdfcf9`.
- Type: Bricolage Grotesque for headings (`--display`), Nunito Sans for body
  (`--body`), loaded from Google Fonts in each page's `<head>`.
- Keep the established look: rounded cards, pill buttons, soft shadows, generous
  spacing. The coral is reserved for CTAs and accents; don't spread it around.
- The site respects `prefers-reduced-motion` and works with JavaScript disabled
  (the only JS is a small scroll-reveal script in `index.html`). Preserve both.

## Assets

- `assets/app-logo.png` — brand logo (coral map pin with slide icon).
- `assets/pub-marker.png` — the map pin used decoratively in the hero.
- `assets/shot1.png` … `shot4.png` — real App Store screenshots
  (1 = map, 2 = pub detail, 3 = saved, 4 = nearby list). When the app ships
  refreshed store screenshots, replace these like-for-like and the site updates.
- `assets/thumb-playground.jpg` — small photo crop used in the hero's floating card.
- Keep images optimised: prefer under ~500 KB each, never over 1 MB.

## Facts that must stay accurate

- App Store link: https://apps.apple.com/gb/app/pubs-with-playgrounds/id6757747311
- Contact email: hello@pubswithplaygrounds.com
- The "1,000+ pubs" claim reflects the Firestore database; only raise it when the
  database genuinely passes the next round number.
- The "5.0 on the App Store" line reflects the current rating; check it is still
  true before any copy refresh, and remove it if the rating drops.
- Android is in beta ("coming soon") — update both hero and CTA buttons together
  when it launches.

## Conventions

- British spelling throughout the site copy.
- Tone: warm, plain, parent-to-parent. No marketing hype, no exclamation marks.
- Spaces on either side of dashes in copy.
- Don't add frameworks, build tools, or external scripts beyond Google Fonts.

## Publishing

Use the `/publish` command (defined in `.claude/commands/publish.md`). It reviews
the changes, commits with a sensible message, pushes to the default branch, and
GitHub Pages redeploys automatically. There are no other deployment steps.
