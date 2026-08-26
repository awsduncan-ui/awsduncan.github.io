# SEO Phase 3 deployment — 26 August 2026

## Objective

Clarify which page should rank for national and local pub-with-play queries, improve
the most promising existing regional guides, and preserve the website’s main purpose
as an advert for the free app.

## Search Console baseline

Latest complete UK period available when the work was planned: 25 July–21 August
2026.

| Query or group | Clicks | Impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| `pubs with playgrounds` | 128 | 441 | 29.0% | 6.0 |
| `pubs with playgrounds app` | 56 | 253 | 22.1% | 2.4 |
| `pubs with playgrounds near me` | 2 | 2,962 | 0.1% | 6.5 |
| `pubs with play areas` | 11 | 324 | 3.4% | 9.2 |
| `pubs with parks` | 7 | 194 | 3.6% | 7.7 |

UK site total for the same period: 475 clicks, 10,857 impressions, 4.4% CTR and
average position 9.7.

## Page-level problems addressed

- The exact national query was split mainly between the London guide and homepage.
- Near-me visibility was distributed across the homepage and regional guides, with
  very low CTR.
- The national directory’s wording overlapped unnecessarily with the homepage.
- Some location-qualified searches selected the homepage or directory instead of the
  relevant regional guide. The clearest example was `pubs with play area kent`.
- Existing guides had substantial verified listings but little query-specific local
  context above the long card lists.

## Changes deployed

### Homepage

- Retained the app-download hero as the main experience.
- Made the UK and near-me purpose explicit in the title, description and opening
  copy.
- Added natural supporting language for play areas and play parks.
- Relabelled directory links as regional guides so the homepage remains the clear
  national target.

### National directory

- Repositioned the page as a regional navigation hub.
- Changed its title and H1 to avoid acting as a second homepage for the generic
  national query.
- Made regional-card link text location-specific.

### Priority regional guides

Updated:

- Bristol and Bath
- Kent
- Greater Manchester
- West Midlands
- Surrey

Each page now contains three hand-written local or facility-led sections populated
from its real checked listings. These include Bristol play-area and indoor-play
groups, Kent outdoor and indoor play, Greater Manchester outdoor play, West Midlands
sub-areas, and Guildford/Surrey groups.

No new regional or synonym page was added.

### Technical controls

- Preserved self-referencing canonicals and the current 43-URL sitemap structure.
- Preserved the app-first hero, no-search-bar requirement, correction links and
  verification dates.
- Added an audit requirement for all five priority guides to contain three
  evidence-backed query sections.
- Regenerated the directory from the approved public feed revision
  `3ece6e8cd25fe89fe2f03f88262b50316820020c43acea85adf66db524469653`.

## Verification

- Generated directory audit: 0 failures.
- Sitemap: 43 canonical URLs, including 9 regional guides and 25 pub pages.
- Internal-link check: 1,349 links resolved successfully.
- Restricted Google fallback-photo check: passed on every sitemap page.
- Desktop visual check: no horizontal overflow; all three guide cards displayed in
  columns.
- Mobile visual check at 390 px: no horizontal overflow; guide cards collapsed to
  one column and app download actions remained prominent.

## Changed URLs submitted for recrawling

Search Console accepted all seven URLs into Google's priority crawl queue on
26 August 2026. No submission quota was reached.

- `https://www.pubswithplaygrounds.com/`
- `https://www.pubswithplaygrounds.com/pubs-with-playgrounds/`
- `https://www.pubswithplaygrounds.com/pubs-with-playgrounds/bristol-and-bath/`
- `https://www.pubswithplaygrounds.com/pubs-with-playgrounds/kent/`
- `https://www.pubswithplaygrounds.com/pubs-with-playgrounds/greater-manchester/`
- `https://www.pubswithplaygrounds.com/pubs-with-playgrounds/west-midlands/`
- `https://www.pubswithplaygrounds.com/pubs-with-playgrounds/surrey/`

## Review dates

- Early crawl and page-selection check: 2 September 2026.
- Primary performance comparison after 28 complete days: 23 September 2026.

The 28-day review should separate the exact generic, app-branded, near-me, synonym
and location-qualified query groups. The main test is whether Google increasingly
selects the homepage for national intent and the relevant guide for local intent,
without weakening app downloads.
