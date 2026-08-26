# SEO Phase 2 — query-to-page strategy

Prepared: 23 August 2026
Search Console period: 25 July–21 August 2026
Market: United Kingdom
Website changes made in this phase: none

## Decision summary

The site does not need a large batch of new templated pages. It needs clearer page
ownership and more useful content on pages that already have impressions.

The recommended structure is:

- the homepage owns the national discovery terms, including `pubs with
  playgrounds`, `near me`, `pubs with play areas` and `pubs with parks`;
- the national directory owns browsing by region, not the main generic query;
- each regional guide owns location-qualified versions of playground, play-area,
  outdoor-play and soft-play queries;
- pub detail pages own venue-name searches and venue-plus-location searches;
- no separate `near me`, `pubs with parks`, `family-friendly pubs` or `soft play
  pubs` page should be created now.

The first implementation batch should improve the homepage and five existing
guides: Bristol and Bath, Kent, Greater Manchester, West Midlands and Surrey. These
pages already have real query evidence and enough listings to support substantial,
non-templated improvements.

No new regional guide currently passes both parts of the publishing test: meaningful
observed local-query demand in Search Console and enough distinct, strong listings.
Nottingham and Derby is the first new-guide candidate once demand is independently
validated. Southampton and Hampshire and Sheffield and South Yorkshire are the next
coverage-ready candidates.

## Evidence used

The analysis combines:

- the complete UK Search Console CSV export for 25 July–21 August;
- query-specific page breakdowns inspected in Search Console;
- the live public pub feed used by the website generator;
- the current homepage, national directory, regional guide and pub-page templates.

The export contains 430 visible query rows, accounting for 254 clicks and 6,766
impressions. The overall UK report contains 475 clicks and 10,857 impressions.
Google withholds some low-volume query data, so query-cluster totals describe the
visible query set rather than every impression.

The live feed contained 897 publishable verified listings across 458 parsed
localities. A listing was counted as strong where it had a description, website and
verification date. Radius counts are planning estimates and can overlap neighbouring
guides.

## Search-intent clusters

| Intent | Visible queries | Clicks | Impressions | CTR | Position | Recommended owner |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Near me / nearby | 162 | 19 | 3,928 | 0.48% | 7.27 | Homepage, with regional results selected by Google |
| Generic family-pub discovery | 164 | 169 | 2,087 | 8.10% | 11.93 | Homepage |
| Named local area | 59 | 6 | 400 | 1.50% | 27.92 | Relevant regional guide |
| App intent | 3 | 60 | 263 | 22.81% | 2.37 | Homepage |
| Named venue | 11 | 0 | 32 | 0% | 16.50 | Pub detail page |
| Other | 26 | 0 | 37 | 0% | 11.62 | Case by case; usually no new page |

Five obviously artificial prompt-like queries, totalling 19 impressions, were
excluded from decisions.

### Language used by searchers

| Modifier | Queries | Clicks | Impressions | CTR | Position | Treatment |
| --- | ---: | ---: | ---: | ---: | ---: | --- |
| Playground / playgrounds | 57 | 207 | 4,072 | 5.08% | 6.48 | Primary site language |
| Play area / play areas | 153 | 27 | 1,337 | 2.02% | 11.49 | Prominent supporting language |
| Park / play park | 45 | 14 | 574 | 2.44% | 10.23 | Natural synonym on homepage and suitable guides |
| Outdoor / garden | 60 | 5 | 301 | 1.66% | 10.62 | Use only where listing evidence supports it |
| Family friendly | 35 | 0 | 264 | 0% | 36.55 | Supporting copy, qualified by an actual play facility |
| Indoor / soft play | 21 | 0 | 58 | 0% | Sections within relevant guides; no national page yet |

`Family friendly` is too broad to become the site's main positioning. The current
product advantage is that listings contain evidence of an actual playground, play
area or soft play rather than a vague family-friendly label.

## National page ownership

### Homepage

Canonical URL: `https://www.pubswithplaygrounds.com/`

Primary query:

- `pubs with playgrounds`

Supporting queries:

- `pubs with playgrounds near me`
- `pubs with play areas`
- `pubs with parks`
- `pub with play area`
- `pubs with play areas near me`
- `pubs with playgrounds app`

Search Console evidence:

| Query | Total clicks | Total impressions | Position | Homepage URL result |
| --- | ---: | ---: | ---: | --- |
| pubs with playgrounds | 128 | 441 | 6.0 | 53 clicks / 271 impressions / position 6.7 |
| pubs with playgrounds near me | 2 | 2,962 | 6.5 | 1 / 1,175 / position 8.7 |
| pubs with play areas | 11 | 324 | 9.2 | 9 / 225 / position 9.5 |
| pubs with parks | 7 | 194 | 7.7 | 6 / 169 / position 7.8 |
| pubs with playgrounds app | 56 | 253 | 2.4 | 56 / 253 / position 2.4 |

The homepage should remain an advert for the app. Its SEO role and commercial role
are aligned: explain what the app finds, make download actions prominent, then offer
the web guides as evidence and a preview.

### National directory

Canonical URL: `https://www.pubswithplaygrounds.com/pubs-with-playgrounds/`

Primary topic:

- browse UK pubs with playgrounds by region

Supporting topics:

- UK family-pub directory with verified play facilities
- regional guides to pubs with playgrounds

The directory recorded 0 UK clicks, 50 impressions and position 59.54 in this
period. It should remain the navigational hub, but should not be pushed as a second
landing page for the exact national query. Its links should pass clear local context
to the regional guides.

## Regional query map

| Existing guide | Queries it should own | Current evidence | Coverage | Phase 3 treatment |
| --- | --- | --- | ---: | --- |
| London | playgrounds London; play areas London; soft play pubs London | `pubs with playgrounds london`: 5 clicks, 36 impressions, position 5.9 | 45 pubs, 39 strong | Protect the strong local result; keep broad family-friendly wording secondary |
| Bristol and Bath | play-area pubs Bristol; family pub Bristol; soft-play pub Bristol | 110 explicitly matched impressions; key terms currently position 18–36 | 38 pubs, 35 strong | Highest-priority local content expansion; retain one combined guide for now |
| Devon and Cornwall | play-area pubs Cornwall; family pub Devon/Cornwall; soft-play pub Cornwall | 53 matched impressions; Cornwall play-area query has 1 click, 13 impressions, position 11.1 | 31 pubs, 28 strong | Add separate, useful Devon and Cornwall sections; do not split into new URLs yet |
| Kent | play-area pubs Kent; indoor/soft-play venues Kent | 47 matched impressions; main play-area query position 31.6 | 33 pubs, 30 strong | Repair page selection and add facility-led local sections |
| West Midlands | family pubs with play in Halesowen; playground pubs in Birmingham and surrounding counties | 35 matched impressions; Halesowen query has 34 impressions at position 36.7 | 90 pubs, 83 strong | Add named sub-area sections; qualify family-friendly wording with real play facilities |
| Surrey | play-area pubs Surrey; child-friendly pubs with play near Guildford | 23 matched impressions; Guildford query has 16 impressions at position 43.6 | 34 pubs, 33 strong | Add a Guildford section and clearer Surrey-specific internal anchors |
| Greater Manchester | outdoor-play pubs Manchester; play-area pubs Manchester/Stockport | 19 matched impressions; outdoor-play query has 8 impressions at position 9.2 | 45 pubs, 41 strong | Strengthen the already promising outdoor-play result |
| Essex | play-area pubs Essex; soft-play pub Essex | 13 matched impressions, mostly positions 12–27 | 39 pubs, 29 strong | Modest facility-led expansion after the first batch |
| Dorset, Bournemouth and Poole | play-area pubs Poole; playground pubs Dorset/Bournemouth | Only 1 visible location query, but the landing page has 49 impressions at position 6.96 | 73 radius matches, 61 strong | Preserve current URL and monitor; avoid creating overlapping Poole/Bournemouth pages |

### Important qualifications

- The London guide ranks well for the exact local query but also appears strongly for
  the national query. That is partly useful geographic personalisation, not a reason
  to remove or redirect the guide.
- Broad queries such as `family friendly pubs in london` are a poor current fit: 31
  impressions, no clicks and position 45.4. They should not displace the clearer
  play-facility proposition.
- Bristol has the clearest local content opportunity, but creating a second Bristol
  URL now would compete with the indexed Bristol and Bath guide. Improve the existing
  page first and reassess after another 28 days.

## Query overlap and cannibalisation

### Exact national query

For `pubs with playgrounds`, the main URL-level results were:

| URL | Clicks | Impressions | CTR | Position |
| --- | ---: | ---: | ---: | ---: |
| London guide | 72 | 197 | 36.5% | 6.4 |
| Homepage | 53 | 271 | 19.6% | 6.7 |
| Bristol and Bath | 2 | 4 | 50% | 3.8 |
| Devon and Cornwall | 1 | 10 | 10% | 4.5 |

URL impressions can exceed query impressions when more than one site URL appears in
the same result set. The split is evidence of overlapping relevance, but the strong
London CTR also suggests that Google is matching a substantial local audience to a
locally useful page.

Action for the next implementation phase:

- make the homepage's national scope unambiguous in its title, H1, opening copy and
  internal link anchors;
- keep every regional title and opening paragraph explicitly location-qualified;
- do not canonicalise regional pages to the homepage or remove their useful local
  wording;
- review the exact-query page split after 28 complete days rather than reacting to a
  single manual search.

### Near-me queries

For `pubs with playgrounds near me`, Google selected several location-sensitive
pages:

| URL | Clicks | Impressions | Position |
| --- | ---: | ---: | ---: |
| Homepage | 1 | 1,175 | 8.7 |
| London | 1 | 1,144 | 4.6 |
| Greater Manchester | 0 | 469 | 4.4 |
| West Midlands | 0 | 119 | 17.3 |
| Bristol and Bath | 0 | 64 | 9.9 |
| Devon and Cornwall | 0 | 21 | 8.9 |
| Dorset, Bournemouth and Poole | 0 | 17 | 5.0 |

This is expected geographic selection rather than a defect that warrants a new
`/near-me/` page. A generic static near-me page would not know the searcher's
location and would duplicate the homepage. The app is the strongest response to
this intent because it can show actual nearby pubs.

### Local page-selection defect

`pubs with play area kent` is the clearest genuine overlap problem:

- homepage: 8 URL impressions, position 23.4;
- national directory: 6 URL impressions, position 57.2;
- Kent guide: 4 URL impressions, position 16.5.

The Kent guide is the correct target, but Google is not consistently selecting it.
Phase 3 should strengthen local internal anchors and give the Kent guide a useful
Kent play-area section. It should not create another Kent URL.

## Pages not to create

Do not create these pages in the next batch:

- `/near-me/` — location cannot be resolved usefully in static content;
- `/pubs-with-parks/` — this is a synonym cluster already ranking through the
  homepage;
- `/pubs-with-play-areas/` — it would directly compete with the homepage;
- `/family-friendly-pubs/` — too broad and weaker than the verified-play
  proposition;
- `/pubs-with-soft-play/` — only 58 visible modifier impressions nationally; use
  sections on relevant regional guides first;
- one page per town — this would create thin pages and extensive regional overlap.

## New regional-guide candidates

Search Console is visibility data, not a complete keyword-demand tool. A location
without a current page can have real market demand while producing no query rows for
this site. The absence of impressions is therefore not proof of no demand.

| Candidate | Publishable pubs | Strong pubs | Exact-locality depth | Search Console signal | Decision |
| --- | ---: | ---: | --- | --- | --- |
| Nottingham and Derby | 60 | 54 | Nottingham 12; Derby 8; Chesterfield 6 | `pubs with play areas derby`: 1 impression, position 54 | First candidate, but validate demand before publication |
| Southampton and Hampshire | 68 | 56 | Southampton 12; Eastleigh 5; Portsmouth 4 | No visible local query | Coverage-ready; demand validation required |
| Sheffield and South Yorkshire | 49 | 45 | Sheffield 8; Rotherham 7; Barnsley 4 | No visible local query | Coverage-ready; demand validation required |
| Liverpool and Merseyside | 45 | 39 | Liverpool 6; Warrington 5; Wigan 5 | No visible local query | Hold behind the first three |
| Leicester and Leicestershire | 36 | 34 | Leicester 7 | No visible local query | Hold; overlaps Nottingham/Derby and West Midlands radii |

The recommended next new-page test is one guide, not a batch: Nottingham and Derby,
after checking independent local search demand. Publishing one controlled guide
makes its indexing and performance measurable and avoids expanding the sitemap with
pages based only on radius counts.

## Publishing standard for any new guide

A new regional guide should meet all of these conditions:

- at least 25 publishable verified listings and 20 strong listings;
- enough geographic depth for at least three useful named sub-area sections;
- independent evidence of local search demand, or a small Search Console query
  signal plus unusually strong listing coverage;
- a hand-written local introduction and practical local travel/context notes;
- facility-led sections based on real listing data, not keyword variants;
- unique title, description, H1 and internal anchor language;
- no town page where the regional guide already satisfies the same intent;
- an explicit measurement date 28 days after indexing.

## Phase 3 implementation order

1. Clarify national ownership on the homepage while keeping the app-download pitch
   dominant.
2. Strengthen the existing Bristol and Bath, Kent, Greater Manchester, West
   Midlands and Surrey guides using their observed queries and real listings.
3. Improve internal anchors from the homepage and national directory so national
   language points to the homepage and location-qualified language points to guides.
4. Add useful facility and sub-area sections without creating new synonym URLs.
5. Run the site and structured-data audits, deploy, request recrawl only for the
   materially changed pages, and record the deployment date.
6. Compare query/page selection, CTR and position after 28 complete days.
7. Validate Nottingham and Derby demand before deciding whether to publish the
   first new guide.

## Measurement rules

For the Phase 3 review, report separately:

- exact `pubs with playgrounds`;
- `pubs with playgrounds app`;
- all near-me variants;
- national synonym queries such as play areas and parks;
- location-qualified queries by regional guide;
- page-level impressions for the homepage, directory and each changed guide.

Success is not just a higher average position. The desired outcome is that the
homepage receives most national-intent visibility, the correct regional guide is
selected for location-qualified searches, and app downloads remain the main action
offered to visitors.

## Reproducible analysis

The supporting script is `scripts/analyse-phase2-seo.mjs`. It reads the Search
Console export, fetches the current public feed, clusters query intent and modifiers,
and estimates listing depth for existing and candidate guide areas.

Example:

```sh
node scripts/analyse-phase2-seo.mjs /path/to/search-console-export.zip --areas
```
