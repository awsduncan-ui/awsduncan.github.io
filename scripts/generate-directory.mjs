#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const SITE_ORIGIN = "https://www.pubswithplaygrounds.com";
const FEED_URL =
  "https://firebasestorage.googleapis.com/v0/b/pubs-with-playgrounds-8b9d4.firebasestorage.app/o/public_feeds%2Fpubs.json?alt=media";
const MANIFEST_URL =
  "https://firebasestorage.googleapis.com/v0/b/pubs-with-playgrounds-8b9d4.firebasestorage.app/o/public_feeds%2Fpubs_manifest.json?alt=media";

const regions = [
  {
    slug: "london",
    name: "London",
    centre: "central London",
    lat: 51.5074,
    lng: -0.1278,
    radiusKm: 30,
    places: "Greater London and nearby areas around the M25",
    intro:
      "Finding outdoor space in and around London can take more planning than the pub lunch itself. This guide brings together checked venues where children have a real playground, indoor play area or soft play—not merely a children’s menu.",
    tip:
      "London journeys vary enormously by time of day. Check the official venue page for opening hours and use the directions link before setting off.",
  },
  {
    slug: "west-midlands",
    name: "the West Midlands",
    shortName: "West Midlands",
    centre: "Birmingham",
    lat: 52.4862,
    lng: -1.8904,
    radiusKm: 50,
    places: "Birmingham, Coventry, Wolverhampton and surrounding counties",
    intro:
      "The West Midlands has one of the densest groups of family pubs in the directory. Use the play-type and facility labels to separate garden climbing frames from indoor play and to check practical details such as parking and children’s menus.",
    tip:
      "The guide reaches beyond the metropolitan county so families travelling across Warwickshire, Worcestershire and Staffordshire can compare nearby options too.",
  },
  {
    slug: "kent",
    name: "Kent",
    centre: "Maidstone",
    lat: 51.2787,
    lng: 0.5217,
    radiusKm: 35,
    places: "Maidstone, Medway, Sevenoaks and central Kent",
    intro:
      "Kent’s family-pub options range from village gardens with climbing frames to larger venues with dedicated play facilities. This checked list makes the distinction visible before you choose where to eat.",
    tip:
      "Coastal and far-eastern Kent will be added as the regional cluster expands. The mobile app already covers venues beyond this first guide radius.",
  },
  {
    slug: "bristol-and-bath",
    name: "Bristol and Bath",
    centre: "between Bristol and Bath",
    lat: 51.41,
    lng: -2.48,
    radiusKm: 40,
    places: "Bristol, Bath, North Somerset and South Gloucestershire",
    intro:
      "This guide covers pubs with genuine play facilities across Bristol, Bath and the surrounding family-day-out territory. It is designed for comparing the play offer as well as the food-and-parking details that matter with children in tow.",
    tip:
      "Some venues sit in rural lanes or villages outside the two cities. Use the directions link and confirm current food service with the pub before travelling.",
  },
  {
    slug: "greater-manchester",
    name: "Greater Manchester",
    centre: "Manchester city centre",
    lat: 53.4808,
    lng: -2.2426,
    radiusKm: 30,
    places: "Manchester, Salford, Stockport, Wigan, Bolton and nearby towns",
    intro:
      "Greater Manchester’s checked listings include outdoor playgrounds, indoor play areas and soft-play venues. Browse the guide to find a practical stop for lunch, a rainy day or a family meet-up.",
    tip:
      "The radius includes border towns because the nearest useful pub is often outside a borough boundary. Every card shows its full address so that choice remains clear.",
  },
  {
    slug: "essex",
    name: "Essex",
    centre: "Chelmsford",
    lat: 51.7343,
    lng: 0.4691,
    radiusKm: 38,
    places: "Chelmsford, Brentwood, Colchester and surrounding Essex",
    intro:
      "For families comparing Essex pubs, the important question is what ‘family friendly’ actually means. These venues have evidence of a playground, play area or soft play, with visible labels for the supporting facilities recorded in the directory.",
    tip:
      "Play equipment and food service can change seasonally. Use the verification date as a freshness signal and report anything that needs correcting.",
  },
  {
    slug: "surrey",
    name: "Surrey",
    centre: "Guildford",
    lat: 51.2362,
    lng: -0.5704,
    radiusKm: 28,
    places: "Guildford, Woking, Reigate and nearby Surrey towns",
    intro:
      "Surrey has plenty of pubs with gardens, but far fewer where the garden includes a real children’s play area. This guide filters for the latter and shows the evidence-led details available for each venue.",
    tip:
      "The search radius deliberately crosses some county borders to reflect how families actually plan journeys. Check the address and distance before choosing.",
  },
  {
    slug: "devon-and-cornwall",
    name: "Devon and Cornwall",
    centre: "central Devon and Cornwall",
    lat: 50.45,
    lng: -4.25,
    radiusKm: 100,
    places: "Exeter, Plymouth, Torbay, Truro and the wider peninsula",
    intro:
      "Longer holiday drives make reliable family stops especially valuable. This Devon and Cornwall guide surfaces pubs with actual play facilities and gives parents the address, play type, facilities and last-check date before they commit to a detour.",
    tip:
      "This is the widest first-wave guide because the peninsula is spread out. Use the address and directions link to judge the route, then confirm seasonal opening directly with the venue.",
  },
];

const appStoreUrl =
  "https://apps.apple.com/gb/app/pubs-with-playgrounds/id6757747311";
const playStoreUrl =
  "https://play.google.com/store/apps/details?id=com.pubswithplaygrounds.app";

function escapeHtml(value = "") {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function cleanGeneratedHtml(value) {
  return value.replace(/[ \t]+$/gm, "");
}

function safeUrl(value) {
  if (!value) return "";
  try {
    const url = new URL(value);
    if (!['http:', 'https:'].includes(url.protocol)) return "";
    for (const key of [...url.searchParams.keys()]) {
      if (key.toLowerCase().startsWith("utm_")) url.searchParams.delete(key);
    }
    return url.href;
  } catch {
    return "";
  }
}

function safeImageUrl(value) {
  const url = safeUrl(value);
  return url && new URL(url).protocol === "https:" ? url : "";
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const toRadians = (degrees) => (degrees * Math.PI) / 180;
  const radius = 6371;
  const latDelta = toRadians(lat2 - lat1);
  const lngDelta = toRadians(lng2 - lng1);
  const value =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(lngDelta / 2) ** 2;
  return 2 * radius * Math.asin(Math.sqrt(value));
}

function isPublishable(pub) {
  return (
    ["human_verified", "community_verified"].includes(pub.verificationStatus) &&
    pub.businessStatus !== "CLOSED_PERMANENTLY" &&
    typeof pub.name === "string" &&
    pub.name.trim() &&
    typeof pub.address === "string" &&
    pub.address.trim() &&
    Number.isFinite(pub.lat) &&
    Number.isFinite(pub.lng)
  );
}

function normaliseCoordinates(pub) {
  return {
    ...pub,
    lat: Number.isFinite(pub.lat) ? pub.lat : pub.location?.lat,
    lng: Number.isFinite(pub.lng) ? pub.lng : pub.location?.lng,
  };
}

function pubsForRegion(pubs, region) {
  return pubs
    .filter(
      (pub) =>
        distanceKm(region.lat, region.lng, pub.lat, pub.lng) <=
        region.radiusKm,
    )
    .sort((a, b) => a.name.localeCompare(b.name, "en-GB"));
}

function qualityScore(pub) {
  return (
    (pub.description ? 6 : 0) +
    (photoFor(pub).url ? 5 : 0) +
    (safeUrl(pub.website) ? 3 : 0) +
    (pub.lastVerifiedAt ? 2 : 0) +
    ((pub.childrensMenuUrls?.length ?? 0) > 0 ? 2 : 0) +
    Math.min(pub.features?.length ?? 0, 5)
  );
}

function photoFor(pub) {
  const ownPhoto =
    safeImageUrl(pub.photoUrl) || safeImageUrl(pub.photoUrls?.[0]);
  if (ownPhoto) return { url: ownPhoto, attribution: "" };
  const fallback = safeImageUrl(pub.googleFallbackPhotoUrl);
  return {
    url: fallback,
    attribution: fallback
      ? pub.googleFallbackPhotoAttribution || pub.name
      : "",
  };
}

function featureLabels(pub) {
  const raw = [...(pub.features ?? []), ...(pub.equipment ?? [])]
    .map((value) => String(value).toLowerCase().trim())
    .filter(Boolean);
  const has = (...needles) =>
    raw.some((value) => needles.some((needle) => value.includes(needle)));
  const labels = [];
  if (pub.hasPlayground || has("playground", "outdoor play")) {
    labels.push("Outdoor playground");
  }
  if (has("indoor play")) labels.push("Indoor play");
  if (has("soft play")) labels.push("Soft play");
  if ((pub.childrensMenuUrls?.length ?? 0) > 0 || has("children's menu", "childrens menu", "kids menu")) {
    labels.push("Children’s menu");
  }
  if (has("baby change", "baby changing")) labels.push("Baby change");
  if (has("car park", "parking")) labels.push("Parking");
  if (has("accessible", "wheelchair")) labels.push("Accessible");
  if (has("beer garden")) labels.push("Beer garden");
  if (has("high chair")) labels.push("High chairs");
  if ((pub.foodMenuUrls?.length ?? 0) > 0 || has("food menu", "menu")) {
    labels.push("Food menu");
  }
  if (has("accommodation")) labels.push("Accommodation");
  return [...new Set(labels)].slice(0, 7);
}

function formatDate(value) {
  if (!value) return "Date not supplied";
  const date = new Date(value);
  if (Number.isNaN(date.valueOf())) return "Date not supplied";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "Europe/London",
  }).format(date);
}

function searchableText(pub) {
  return [
    pub.name,
    pub.address,
    pub.description,
    ...(pub.features ?? []),
    ...(pub.equipment ?? []),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase()
    .replace(/\s+/g, " ");
}

function cardHtml(pub, { heading = "h2", internalHref = "" } = {}) {
  const photo = photoFor(pub);
  const website = safeUrl(pub.website);
  const menu = safeUrl(pub.childrensMenuUrls?.[0]);
  const correctionSubject = encodeURIComponent(`Listing correction: ${pub.name}`);
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(`${pub.lat},${pub.lng}`)}`;
  const cardId = `pub-${pub.id.replace(/[^a-zA-Z0-9_-]/g, "")}`;
  const title = internalHref
    ? `<a class="pub-card-title" href="${escapeHtml(internalHref)}">${escapeHtml(pub.name)}</a>`
    : `<a class="pub-card-title" href="#${cardId}">${escapeHtml(pub.name)}</a>`;
  const tags = featureLabels(pub);
  const image = photo.url
    ? `<figure class="directory-photo">
        <img src="${escapeHtml(photo.url)}" alt="${escapeHtml(pub.name)}" loading="lazy" decoding="async" width="480" height="320">
        ${photo.attribution ? `<figcaption>Photo: ${escapeHtml(photo.attribution)}</figcaption>` : ""}
      </figure>`
    : `<div class="directory-photo directory-photo-placeholder" aria-hidden="true"><img src="/assets/pub-marker.png" alt="" loading="lazy" width="96" height="96"></div>`;
  const description = pub.description
    ? `<p class="pub-description">${escapeHtml(pub.description)}</p>`
    : `<p class="pub-description">This checked listing has a recorded children’s play facility. Confirm the latest details with the venue before travelling.</p>`;
  return `<article class="directory-pub-card" id="${cardId}" data-directory-card data-search="${escapeHtml(searchableText(pub))}">
    ${image}
    <div class="directory-pub-body">
      <div class="pub-card-heading">
        <${heading}>${title}</${heading}>
        <span class="verified-badge">Checked</span>
      </div>
      <address>${escapeHtml(pub.address)}</address>
      ${description}
      ${tags.length ? `<ul class="pub-features" aria-label="Recorded facilities">${tags.map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>` : ""}
      <p class="verification-date">Last checked ${escapeHtml(formatDate(pub.lastVerifiedAt))}. Details can change—please confirm opening and food service with the venue.</p>
      <div class="pub-actions">
        ${website ? `<a href="${escapeHtml(website)}" target="_blank" rel="noopener">Official website</a>` : ""}
        ${menu ? `<a href="${escapeHtml(menu)}" target="_blank" rel="noopener">Children’s menu</a>` : ""}
        <a href="${escapeHtml(directions)}" target="_blank" rel="noopener">Directions</a>
        ${pub.phone ? `<a href="tel:${escapeHtml(String(pub.phone).replace(/[^+\d]/g, ""))}">Call venue</a>` : ""}
        <a href="mailto:hello@pubswithplaygrounds.com?subject=${correctionSubject}">Report a correction</a>
      </div>
    </div>
  </article>`;
}

function regionCardHtml(region, count) {
  const displayName = region.shortName || region.name;
  return `<a class="region-card" href="/pubs-with-playgrounds/${region.slug}/">
    <span class="region-count">${count} checked ${count === 1 ? "venue" : "venues"}</span>
    <h3>${escapeHtml(displayName)}</h3>
    <p>${escapeHtml(region.places)}</p>
    <span class="region-link">Browse the guide <span aria-hidden="true">→</span></span>
  </a>`;
}

function breadcrumbJson(items) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_ORIGIN}${item.path}`,
    })),
  };
}

function itemListJson(pubs, pagePath) {
  return {
    "@type": "ItemList",
    numberOfItems: pubs.length,
    itemListElement: pubs.map((pub, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: pub.name,
      url: `${SITE_ORIGIN}${pagePath}#pub-${pub.id.replace(/[^a-zA-Z0-9_-]/g, "")}`,
    })),
  };
}

function jsonLd(graph) {
  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph })
    .replaceAll("<", "\\u003c");
}

function pageShell({ title, description, canonicalPath, h1, eyebrow, lead, content, graph }) {
  const canonical = `${SITE_ORIGIN}${canonicalPath}`;
  return `<!DOCTYPE html>
<html lang="en-GB">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${escapeHtml(title)}</title>
  <meta name="description" content="${escapeHtml(description)}">
  <meta property="og:title" content="${escapeHtml(title)}">
  <meta property="og:description" content="${escapeHtml(description)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${SITE_ORIGIN}/assets/app-logo.png">
  <meta name="theme-color" content="#173527">
  <link rel="canonical" href="${canonical}">
  <link rel="icon" href="/favicon.png" type="image/png" sizes="96x96">
  <link rel="icon" href="/favicon.ico" sizes="32x32">
  <link rel="apple-touch-icon" href="/apple-touch-icon.png">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,500;12..96,700;12..96,800&family=Nunito+Sans:opsz,wght@6..12,400;6..12,600;6..12,700;6..12,800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/styles.css">
  <script type="application/ld+json">${jsonLd(graph)}</script>
  <script src="/directory.js" defer></script>
  <script src="/marketing.js" defer></script>
</head>
<body class="directory-page">
  <header class="nav-wrap">
    <div class="shell nav">
      <a class="brand" href="/">
        <img class="brand-logo" src="/assets/app-logo.png" alt="" width="38" height="38">
        <span>Pubs With<br>Playgrounds</span>
      </a>
      <nav class="nav-links" aria-label="Page links">
        <a href="/pubs-with-playgrounds/">All regions</a>
        <a href="#listings">Pub listings</a>
        <a href="#method">How we check</a>
      </nav>
      <a class="btn btn-coral btn-nav" href="${appStoreUrl}">Get the app</a>
    </div>
  </header>
  <main>
    <section class="directory-hero">
      <div class="shell directory-hero-grid">
        <div class="directory-hero-copy">
          <nav class="breadcrumbs" aria-label="Breadcrumb">
            <a href="/">Home</a><span aria-hidden="true">/</span><a href="/pubs-with-playgrounds/">Pubs with playgrounds</a>${canonicalPath === "/pubs-with-playgrounds/" ? "" : `<span aria-hidden="true">/</span><span>${escapeHtml(eyebrow)}</span>`}
          </nav>
          <p class="eyebrow">${escapeHtml(eyebrow)}</p>
          <h1>${escapeHtml(h1)}</h1>
          <p class="lead">${escapeHtml(lead)}</p>
          <div class="store-actions directory-store-actions">
            <a class="btn-store" href="${appStoreUrl}"><span><small>Download on the</small><strong>App Store</strong></span></a>
            <a class="btn-store btn-store-ghost" href="${playStoreUrl}" target="_blank" rel="noopener"><span><small>Get it on</small><strong>Google Play</strong></span></a>
          </div>
          <ul class="hero-trust directory-hero-trust">
            <li><span class="dot"></span>Free to download</li>
            <li><span class="dot"></span>Complete UK map</li>
            <li><span class="dot"></span>No subscription</li>
          </ul>
        </div>
        <div class="directory-hero-visual" aria-hidden="true">
          <div class="phone phone-directory"><img src="/assets/shot1.png" alt="" width="600" height="1240"></div>
        </div>
      </div>
    </section>
    ${content}
  </main>
  ${footerHtml()}
</body>
</html>
`;
}

function footerHtml() {
  return `<footer class="footer">
    <div class="shell footer-grid">
      <div class="footer-col footer-about">
        <div class="footer-brand"><img src="/assets/app-logo.png" alt="" width="34" height="34"><span>Pubs With Playgrounds</span></div>
        <p class="footer-fine">The UK family pub finder. Made in the UK, mostly in beer gardens.</p>
      </div>
      <div class="footer-col"><h4>Explore</h4><a href="/pubs-with-playgrounds/">Browse pubs</a><a href="/#showcase">The app</a><a href="/#facilities">What’s listed</a></div>
      <div class="footer-col"><h4>Policies</h4><a href="/privacy.html">Privacy Policy</a><a href="/terms.html">Terms of Use</a><a href="/account-deletion.html">Account Deletion</a></div>
      <div class="footer-col"><h4>Get in touch</h4><a href="mailto:hello@pubswithplaygrounds.com">hello@pubswithplaygrounds.com</a><div class="footer-stores"><a href="${appStoreUrl}">App Store</a><a href="${playStoreUrl}" target="_blank" rel="noopener">Google Play</a></div></div>
    </div>
    <div class="shell footer-base"><p>&copy; 2026 Pubs With Playgrounds. All rights reserved.</p></div>
  </footer>`;
}

function methodologyHtml(manifest) {
  const updatedAt = formatDate(manifest.updatedAt);
  return `<section class="section directory-method" id="method" aria-labelledby="method-title">
    <div class="shell method-grid">
      <div>
        <p class="eyebrow">Evidence-led directory</p>
        <h2 id="method-title">How these listings are checked</h2>
      </div>
      <div class="method-copy">
        <p>Pages are generated from the same approved public feed used by the app. Only human- or community-verified venues that are not marked permanently closed are included.</p>
        <p>Play equipment, menus and opening arrangements can change. We show the last recorded check on every card and link to the venue where available. The public feed was last updated ${escapeHtml(updatedAt)}.</p>
        <p>Spotted a change? Email <a href="mailto:hello@pubswithplaygrounds.com">hello@pubswithplaygrounds.com</a> with the pub name and town. We do not read the private Firestore <code>/pubs</code> collection from this website.</p>
      </div>
    </div>
  </section>`;
}

function appCtaHtml() {
  return `<section class="cta-band directory-cta" aria-labelledby="directory-cta-title"><div class="shell cta-grid"><div><h2 id="directory-cta-title">Take every listing with you</h2><p>The free app covers the wider UK directory, live map browsing, saved pubs and directions from wherever you are.</p><div class="store-actions"><a class="btn-store btn-store-light" href="${appStoreUrl}"><span><small>Download on the</small><strong>App Store</strong></span></a><a class="btn-store btn-store-outline" href="${playStoreUrl}" target="_blank" rel="noopener"><span><small>Get it on</small><strong>Google Play</strong></span></a></div></div><div class="cta-pin" aria-hidden="true"><img src="/assets/app-logo.png" alt="" width="160" height="160"></div></div></section>`;
}

function regionalPage(region, pubs, regionCounts, manifest) {
  const pathName = `/pubs-with-playgrounds/${region.slug}/`;
  const displayName = region.shortName || region.name;
  const cards = pubs.map((pub) => cardHtml(pub)).join("\n");
  const neighbourCards = regions
    .filter((item) => item.slug !== region.slug)
    .slice(0, 4)
    .map((item) => regionCardHtml(item, regionCounts.get(item.slug)))
    .join("\n");
  const content = `<section class="section directory-intro"><div class="shell directory-intro-grid directory-intro-no-search"><div><h2>A practical family-pub shortlist</h2><p class="body-copy">${escapeHtml(region.intro)}</p><p class="coverage-note"><strong>Coverage:</strong> ${escapeHtml(region.places)}, using an approximately ${region.radiusKm} km guide radius from ${escapeHtml(region.centre)}. Border areas can overlap neighbouring guides.</p></div></div></section>
  <section class="section section-mint directory-list" id="listings" aria-labelledby="listings-title"><div class="shell"><div class="directory-list-heading"><div><p class="eyebrow">Checked listings</p><h2 id="listings-title">${pubs.length} pubs with play facilities in and around ${escapeHtml(displayName)}</h2></div><p>${escapeHtml(region.tip)}</p></div><div class="directory-pub-grid">${cards}</div></div></section>
  <section class="section"><div class="shell"><div class="section-heading"><p class="eyebrow">Keep exploring</p><h2>More regional guides</h2></div><div class="region-grid">${neighbourCards}</div></div></section>
  ${methodologyHtml(manifest)}${appCtaHtml()}`;
  return pageShell({
    title: `Pubs With Playgrounds in ${displayName} | Checked Family Pubs`,
    description: `Browse ${pubs.length} checked pubs with playgrounds, indoor play or soft play in and around ${displayName}. Compare addresses, facilities and verification dates.`,
    canonicalPath: pathName,
    h1: `Pubs with playgrounds in ${displayName}`,
    eyebrow: `${displayName} family pub guide`,
    lead: `Download the free app for the complete UK map, nearby results, saved favourites and directions. Preview ${pubs.length} checked venues in and around ${displayName} in the guide below.`,
    content,
    graph: [
      breadcrumbJson([
        { name: "Home", path: "/" },
        { name: "Pubs with playgrounds", path: "/pubs-with-playgrounds/" },
        { name: displayName, path: pathName },
      ]),
      itemListJson(pubs, pathName),
    ],
  });
}

function nationalPage(regionPubs, regionCounts, manifest) {
  const selected = [];
  const seen = new Set();
  for (const region of regions) {
    const candidates = [...regionPubs.get(region.slug)].sort(
      (a, b) => qualityScore(b) - qualityScore(a) || a.name.localeCompare(b.name),
    );
    for (const pub of candidates) {
      if (seen.has(pub.id)) continue;
      seen.add(pub.id);
      selected.push({ pub, region });
      if (selected.filter((item) => item.region.slug === region.slug).length >= 4) break;
    }
  }
  const regionCards = regions
    .map((region) => regionCardHtml(region, regionCounts.get(region.slug)))
    .join("\n");
  const cards = selected
    .map(({ pub, region }) =>
      cardHtml(pub, {
        heading: "h3",
        internalHref: `/pubs-with-playgrounds/${region.slug}/#pub-${pub.id.replace(/[^a-zA-Z0-9_-]/g, "")}`,
      }),
    )
    .join("\n");
  const content = `<section class="section section-mint" aria-labelledby="regions-title"><div class="shell"><div class="section-heading"><p class="eyebrow">Regional directory</p><h2 id="regions-title">Choose a regional guide</h2><p class="body-copy">Preview checked pub listings, full addresses, recorded play types, practical facilities and verification dates on the web.</p></div><div class="region-grid">${regionCards}</div></div></section>
  <section class="section directory-list" id="listings" aria-labelledby="featured-title"><div class="shell"><div class="directory-list-heading"><div><p class="eyebrow">A useful starting point</p><h2 id="featured-title">Checked pubs from across the first regional guides</h2></div><p>These are substantial listings with useful facility information. Follow a card to see it in its full regional guide.</p></div><div class="directory-pub-grid directory-featured-grid">${cards}</div></div></section>
  ${methodologyHtml(manifest)}${appCtaHtml()}`;
  return pageShell({
    title: "Browse UK Pubs With Playgrounds | Checked Regional Guides",
    description: `Browse checked UK pubs with playgrounds, indoor play areas and soft play. Start with ${regions.length} regional guides containing real addresses, facilities and verification dates.`,
    canonicalPath: "/pubs-with-playgrounds/",
    h1: "Browse UK pubs with playgrounds by region",
    eyebrow: "UK family pub directory",
    lead: "Download the free app for the complete UK map, nearby results, saved favourites and directions. The regional web guides begin below.",
    content,
    graph: [
      breadcrumbJson([
        { name: "Home", path: "/" },
        { name: "Pubs with playgrounds", path: "/pubs-with-playgrounds/" },
      ]),
      itemListJson(
        selected.map((item) => item.pub),
        "/pubs-with-playgrounds/",
      ),
    ],
  });
}

function homepageGateway(regionPubs, regionCounts) {
  const chosen = [];
  const seen = new Set();
  for (const region of regions.slice(0, 6)) {
    const pub = [...regionPubs.get(region.slug)]
      .sort((a, b) => qualityScore(b) - qualityScore(a))[0];
    if (!pub || seen.has(pub.id)) continue;
    seen.add(pub.id);
    chosen.push({ pub, region });
  }
  const regionCards = regions
    .map((region) => regionCardHtml(region, regionCounts.get(region.slug)))
    .join("\n");
  const cards = chosen
    .map(({ pub, region }) =>
      cardHtml(pub, {
        heading: "h3",
        internalHref: `/pubs-with-playgrounds/${region.slug}/#pub-${pub.id.replace(/[^a-zA-Z0-9_-]/g, "")}`,
      }),
    )
    .join("\n");
  return `<!-- DIRECTORY_GATEWAY_START -->
    <section class="section directory-gateway" id="directory" aria-labelledby="directory-title">
      <div class="shell">
        <div class="directory-intro-grid directory-intro-no-search">
          <div><p class="eyebrow">Preview the directory</p><h2 id="directory-title">Explore regional pub guides</h2><p class="body-copy">The free app is the quickest way to search the complete UK map, see what is nearby and save favourites. These regional guides let you preview checked listings on the web.</p></div>
        </div>
        <div class="region-grid homepage-region-grid">${regionCards}</div>
        <div class="directory-list-heading homepage-listing-heading"><div><p class="eyebrow">Real listings</p><h2>Recently checked family pubs</h2></div><a class="text-link" href="/pubs-with-playgrounds/">Open the UK directory <span aria-hidden="true">→</span></a></div>
        <div class="directory-pub-grid directory-featured-grid">${cards}</div>
      </div>
    </section>
    <!-- DIRECTORY_GATEWAY_END -->`;
}

function sitemapXml(lastmod) {
  const urls = [
    { path: "/", lastmod },
    { path: "/pubs-with-playgrounds/", lastmod },
    ...regions.map((region) => ({
      path: `/pubs-with-playgrounds/${region.slug}/`,
      lastmod,
    })),
    { path: "/privacy.html" },
    { path: "/terms.html" },
    { path: "/account-deletion.html" },
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((item) => `  <url>\n    <loc>${SITE_ORIGIN}${item.path}</loc>${item.lastmod ? `\n    <lastmod>${item.lastmod}</lastmod>` : ""}\n  </url>`).join("\n")}
</urlset>
`;
}

async function fetchJson(url) {
  const response = await fetch(url, {
    headers: { "user-agent": `${SITE_ORIGIN}/ directory generator` },
  });
  if (!response.ok) throw new Error(`${url} returned HTTP ${response.status}`);
  return response.json();
}

async function main() {
  const [rawPubs, manifest] = await Promise.all([
    fetchJson(FEED_URL),
    fetchJson(MANIFEST_URL),
  ]);
  if (!Array.isArray(rawPubs)) throw new TypeError("Public feed is not a list");
  const pubs = rawPubs.map(normaliseCoordinates).filter(isPublishable);
  const regionPubs = new Map(
    regions.map((region) => [region.slug, pubsForRegion(pubs, region)]),
  );
  const regionCounts = new Map(
    regions.map((region) => [region.slug, regionPubs.get(region.slug).length]),
  );
  const feedUpdatedOn = new Date(manifest.updatedAt).toISOString().slice(0, 10);

  const directoryRoot = path.join(ROOT, "pubs-with-playgrounds");
  await mkdir(directoryRoot, { recursive: true });
  await writeFile(
    path.join(directoryRoot, "index.html"),
    cleanGeneratedHtml(nationalPage(regionPubs, regionCounts, manifest)),
  );
  for (const region of regions) {
    const output = path.join(directoryRoot, region.slug);
    await mkdir(output, { recursive: true });
    await writeFile(
      path.join(output, "index.html"),
      cleanGeneratedHtml(
        regionalPage(region, regionPubs.get(region.slug), regionCounts, manifest),
      ),
    );
  }

  const homepagePath = path.join(ROOT, "index.html");
  const homepage = await readFile(homepagePath, "utf8");
  const gateway = homepageGateway(regionPubs, regionCounts);
  const start = "<!-- DIRECTORY_GATEWAY_START -->";
  const end = "<!-- DIRECTORY_GATEWAY_END -->";
  if (!homepage.includes(start) || !homepage.includes(end)) {
    throw new Error("Homepage directory gateway markers are missing");
  }
  const nextHomepage = cleanGeneratedHtml(
    homepage.replace(new RegExp(`${start}[\\s\\S]*?${end}`), gateway),
  );
  await writeFile(homepagePath, nextHomepage);
  await writeFile(path.join(ROOT, "sitemap.xml"), sitemapXml(feedUpdatedOn));

  console.log(`Generated national directory and ${regions.length} regional guides.`);
  console.log(`Loaded ${pubs.length} verified venues from feed revision ${manifest.revision}.`);
  for (const region of regions) {
    console.log(`${region.slug}: ${regionCounts.get(region.slug)}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
