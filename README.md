# Pubs With Playgrounds website

This repository is the production source for
[www.pubswithplaygrounds.com](https://www.pubswithplaygrounds.com/). GitHub Pages
publishes the root of `main`; there is no build step.

## SEO deployment checks

Run the production audit after any deployment:

```sh
node scripts/audit-site.mjs
```

The same audit runs every Monday and can be started manually from GitHub
Actions. It checks canonical redirects, homepage metadata, `robots.txt`, and
every URL in the sitemap. See [SEO_BASELINE.md](SEO_BASELINE.md) for the current
Search Console and deployment baseline.

## Directory generation

The national directory, eight regional guides, homepage directory gateway and
sitemap are generated from the approved Firebase Storage public feed:

```sh
node scripts/generate-directory.mjs
node scripts/audit-generated-directory.mjs
node scripts/audit-site.mjs
```

The generator publishes only human- or community-verified venues that are not
marked permanently closed. It does not read Firestore or expose the private
`/pubs` collection. Generated region pages use documented distance radii so
border coverage remains transparent.

The `Refresh public directory` workflow runs each Monday before the production
SEO audit. It commits only when the approved feed changes, leaving a reviewable
deployment history.
