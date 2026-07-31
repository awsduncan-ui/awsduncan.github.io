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
