# SEO measurement and deployment baseline

Baseline date: 31 July 2026
Search Console data through: 29 July 2026

## Target and primary measurement

The primary target query is `pubs with playgrounds`, measured in Google Search
Console for the United Kingdom. The initial objective is a sustained top-three
organic position, not a one-off observation from a personalised search result.

Search Console is the source of truth for rankings, impressions, clicks, and
index coverage. Review the 28-day and 3-month windows weekly, and compare full
periods because Search Console data normally arrives with a delay.

## Search baseline

### Last 28 days (2–29 July 2026)

| Metric | Value |
| --- | ---: |
| Total clicks | 88 |
| Total impressions | 840 |
| Average CTR | 10.5% |
| Average position | 15.8 |

| Query | Clicks | Impressions | Average position |
| --- | ---: | ---: | ---: |
| pubs with playgrounds app | 20 | 124 | 3.2 |
| pubs with playgrounds | 3 | 27 | 6.9 |
| pubs with playground | 1 | 3 | 3.0 |
| child friendly pubs uk | 0 | 39 | 66.0 |
| pubs with parks | 0 | 21 | 9.1 |
| pubs with playgrounds near me | 0 | 9 | 15.6 |
| pubs with play areas | 0 | 6 | 15.5 |

Device split shows a material desktop gap: mobile generated 76 clicks from 523
impressions at position 8.8, while desktop generated 12 clicks from 313
impressions at position 27.2. The UK accounted for 83 clicks and 631
impressions at position 16.3.

### Last 3 months (7 May–29 July 2026)

| Metric | Value |
| --- | ---: |
| Total clicks | 90 |
| Total impressions | 996 |
| Average CTR | 9.0% |
| Average position | 19.8 |

The target query recorded 3 clicks, 32 impressions, and average position 6.8.

## Indexing and authority baseline

- Domain property `pubswithplaygrounds.com` is verified in Search Console by a
  DNS TXT record.
- Search Console reports 2 indexed pages and 5 non-indexed pages. The excluded
  set comprises 2 redirects, 2 alternative canonical pages, and 1 duplicate
  without a user-selected canonical.
- The indexed examples were the HTTPS homepage and the legacy HTTP
  `/android-beta.html` URL. HTTPS enforcement was disabled at baseline.
- No sitemap had been explicitly submitted in Search Console, although
  `robots.txt` correctly advertises `/sitemap.xml`.
- Search Console reports 0 external links and 1 internal link, pointing to
  `/index.html`. Internal home links now use `/` to reinforce the canonical URL.
- Manual Actions and Security Issues both report no problems.
- Core Web Vitals has insufficient field data on both mobile and desktop.

## Deployment baseline

- Production repository: `awsduncan-ui/awsduncan.github.io`
- GitHub Pages source: `main`, repository root, legacy Pages build
- Custom domain: `www.pubswithplaygrounds.com`
- Canonical URL: `https://www.pubswithplaygrounds.com/`
- Baseline deployed commit: `4d6496b351f10fb4c3a78612f74462d54b42bc24`
- TLS certificate covers the apex and `www` hostnames and was approved through
  28 October 2026.
- HTTPS enforcement was disabled at the start of this audit. It was enabled in
  GitHub Pages on 31 July 2026 and all HTTP/apex checks then resolved to the
  canonical HTTPS homepage.

Run `node scripts/audit-site.mjs` after deployment. A non-zero exit means a
canonical, metadata, robots, sitemap, or URL-health requirement failed.

## Analytics decision

No browser analytics tag is added in this foundation step. The website privacy
policy does not currently disclose website analytics or cookies, and the site
rules prohibit adding external scripts without an explicit decision. Search
Console provides the SEO measurements needed now. Before enabling GA4, choose a
dedicated website data stream, settle the consent approach, and update the
privacy information; then add only the events required for store-link and key
CTA attribution.

## Weekly scorecard

Record these figures each Monday using matching complete date ranges:

1. Target-query clicks, impressions, CTR, and average position (UK).
2. Homepage clicks, impressions, CTR, and average position (UK).
3. Indexed and excluded page counts, including exclusion reasons.
4. Sitemap status and last read date.
5. External linking domains and top linked pages.
6. Production audit result and deployed commit.

The remaining foundation action is to submit the sitemap successfully in Search
Console. That browser form changes external state and is intentionally held for
operator confirmation.
