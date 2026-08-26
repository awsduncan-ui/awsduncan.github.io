#!/usr/bin/env node

import { spawnSync } from "node:child_process";

const FEED_URL =
  "https://firebasestorage.googleapis.com/v0/b/pubs-with-playgrounds-8b9d4.firebasestorage.app/o/public_feeds%2Fpubs.json?alt=media";

const zipPath = process.argv[2];
if (!zipPath) {
  throw new Error("Usage: node scripts/analyse-phase2-seo.mjs <search-console-export.zip>");
}

function parseCsv(source) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < source.length; index += 1) {
    const character = source[index];
    if (quoted) {
      if (character === '"' && source[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"') {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field.replace(/\r$/, ""));
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (field || row.length) {
    row.push(field.replace(/\r$/, ""));
    rows.push(row);
  }
  return rows;
}

function readZipMember(member) {
  const result = spawnSync("unzip", ["-p", zipPath, member], {
    encoding: "utf8",
    maxBuffer: 10 * 1024 * 1024,
  });
  if (result.status !== 0) {
    throw new Error(result.stderr || `Could not read ${member}`);
  }
  return result.stdout;
}

function number(value) {
  const parsed = Number(String(value).replaceAll(",", "").replace("%", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalise(value) {
  return String(value)
    .toLowerCase()
    .replace(/[’']/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function distanceKm(lat1, lng1, lat2, lng2) {
  const radians = (degrees) => (degrees * Math.PI) / 180;
  const latDelta = radians(lat2 - lat1);
  const lngDelta = radians(lng2 - lng1);
  const value =
    Math.sin(latDelta / 2) ** 2 +
    Math.cos(radians(lat1)) *
      Math.cos(radians(lat2)) *
      Math.sin(lngDelta / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(value));
}

function localityFor(pub) {
  const parts = String(pub.address)
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part) => !/^(?:uk|united kingdom)$/i.test(part));
  const postcode = /\b[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}\b/i;
  for (let index = parts.length - 1; index >= 0; index -= 1) {
    if (!postcode.test(parts[index])) continue;
    const locality = parts[index].replace(postcode, "").trim();
    if (locality) return locality;
    if (index > 0) return parts[index - 1];
  }
  return parts.at(-1) || "Unknown";
}

function isPublishable(pub) {
  return (
    ["human_verified", "community_verified"].includes(pub.verificationStatus) &&
    pub.businessStatus !== "CLOSED_PERMANENTLY" &&
    typeof pub.name === "string" &&
    pub.name.trim() &&
    typeof pub.address === "string" &&
    pub.address.trim() &&
    Number.isFinite(pub.lat ?? pub.location?.lat) &&
    Number.isFinite(pub.lng ?? pub.location?.lng)
  );
}

const areaDefinitions = [
  {
    slug: "london",
    name: "London",
    status: "existing",
    keywords: ["london", "greater london"],
    lat: 51.5074,
    lng: -0.1278,
    radiusKm: 30,
  },
  {
    slug: "greater-manchester",
    name: "Greater Manchester",
    status: "existing",
    keywords: ["manchester", "greater manchester", "bolton", "wigan", "stockport"],
    lat: 53.4808,
    lng: -2.2426,
    radiusKm: 30,
  },
  {
    slug: "bristol-and-bath",
    name: "Bristol and Bath",
    status: "existing",
    keywords: ["bristol", "bath", "bristol parkway"],
    lat: 51.41,
    lng: -2.48,
    radiusKm: 40,
  },
  {
    slug: "devon-and-cornwall",
    name: "Devon and Cornwall",
    status: "existing",
    keywords: ["devon", "cornwall", "exeter", "plymouth", "truro", "torbay"],
    lat: 50.45,
    lng: -4.25,
    radiusKm: 100,
  },
  {
    slug: "dorset-bournemouth-and-poole",
    name: "Dorset, Bournemouth and Poole",
    status: "existing",
    keywords: ["dorset", "bournemouth", "poole", "christchurch", "weymouth", "dorchester"],
    lat: 50.7192,
    lng: -1.8808,
    radiusKm: 55,
  },
  {
    slug: "west-midlands",
    name: "West Midlands",
    status: "existing",
    keywords: [
      "west midlands",
      "birmingham",
      "coventry",
      "wolverhampton",
      "solihull",
      "halesowen",
      "telford",
      "stafford",
      "worcester",
      "warwickshire",
      "worcestershire",
      "staffordshire",
    ],
    lat: 52.4862,
    lng: -1.8904,
    radiusKm: 50,
  },
  {
    slug: "kent",
    name: "Kent",
    status: "existing",
    keywords: ["kent", "maidstone", "medway", "canterbury", "tonbridge", "westerham"],
    lat: 51.2787,
    lng: 0.5217,
    radiusKm: 35,
  },
  {
    slug: "essex",
    name: "Essex",
    status: "existing",
    keywords: ["essex", "chelmsford", "colchester", "brentwood", "southend"],
    lat: 51.7343,
    lng: 0.4691,
    radiusKm: 38,
  },
  {
    slug: "surrey",
    name: "Surrey",
    status: "existing",
    keywords: ["surrey", "guildford", "woking", "reigate", "leatherhead"],
    lat: 51.2362,
    lng: -0.5704,
    radiusKm: 28,
  },
  {
    slug: "southampton-and-hampshire",
    name: "Southampton and Hampshire",
    status: "candidate",
    keywords: ["southampton", "hampshire", "portsmouth", "eastleigh", "winchester"],
    lat: 50.9097,
    lng: -1.4044,
    radiusKm: 45,
  },
  {
    slug: "nottingham-and-derby",
    name: "Nottingham and Derby",
    status: "candidate",
    keywords: ["nottingham", "nottinghamshire", "derby", "derbyshire"],
    lat: 52.95,
    lng: -1.3,
    radiusKm: 40,
  },
  {
    slug: "sheffield-and-south-yorkshire",
    name: "Sheffield and South Yorkshire",
    status: "candidate",
    keywords: ["sheffield", "south yorkshire", "rotherham", "barnsley"],
    lat: 53.3811,
    lng: -1.4701,
    radiusKm: 35,
  },
  {
    slug: "norwich-and-norfolk",
    name: "Norwich and Norfolk",
    status: "candidate",
    keywords: ["norwich", "norfolk"],
    lat: 52.6309,
    lng: 1.2974,
    radiusKm: 50,
  },
  {
    slug: "leicester-and-leicestershire",
    name: "Leicester and Leicestershire",
    status: "candidate",
    keywords: ["leicester", "leicestershire"],
    lat: 52.6369,
    lng: -1.1398,
    radiusKm: 35,
  },
  {
    slug: "liverpool-and-merseyside",
    name: "Liverpool and Merseyside",
    status: "candidate",
    keywords: ["liverpool", "merseyside", "st helens", "wirral"],
    lat: 53.4084,
    lng: -2.9916,
    radiusKm: 35,
  },
  {
    slug: "york-and-north-yorkshire",
    name: "York and North Yorkshire",
    status: "candidate",
    keywords: ["york", "north yorkshire", "scarborough", "northallerton"],
    lat: 53.96,
    lng: -1.0873,
    radiusKm: 45,
  },
  {
    slug: "cardiff-and-south-wales",
    name: "Cardiff and South Wales",
    status: "candidate",
    keywords: ["cardiff", "south wales", "newport", "wales"],
    lat: 51.4816,
    lng: -3.1791,
    radiusKm: 45,
  },
  {
    slug: "brighton-and-sussex",
    name: "Brighton and Sussex",
    status: "candidate",
    keywords: ["brighton", "sussex", "east sussex", "west sussex", "horsham"],
    lat: 50.8225,
    lng: -0.1372,
    radiusKm: 45,
  },
  {
    slug: "ipswich-and-suffolk",
    name: "Ipswich and Suffolk",
    status: "candidate",
    keywords: ["ipswich", "suffolk"],
    lat: 52.0567,
    lng: 1.1482,
    radiusKm: 45,
  },
  {
    slug: "glasgow-and-central-scotland",
    name: "Glasgow and Central Scotland",
    status: "candidate",
    keywords: ["glasgow", "central scotland", "scotland"],
    lat: 55.8642,
    lng: -4.2518,
    radiusKm: 50,
  },
];

const queryRows = parseCsv(readZipMember("Queries.csv"))
  .slice(1)
  .filter((row) => row.length >= 5)
  .map(([query, clicks, impressions, ctr, position]) => ({
    query,
    normalised: normalise(query),
    clicks: number(clicks),
    impressions: number(impressions),
    ctr: number(ctr),
    position: number(position),
  }));

const response = await fetch(FEED_URL);
if (!response.ok) throw new Error(`Feed returned HTTP ${response.status}`);
const pubs = (await response.json())
  .filter(isPublishable)
  .map((pub) => ({
    ...pub,
    lat: pub.lat ?? pub.location?.lat,
    lng: pub.lng ?? pub.location?.lng,
    locality: localityFor(pub),
  }));

const pubNames = pubs
  .map((pub) => ({ name: pub.name, normalised: normalise(pub.name) }))
  .filter((pub) => pub.normalised.length >= 6)
  .sort((a, b) => b.normalised.length - a.normalised.length);

function matchesKeyword(query, keyword) {
  const queryText = ` ${query.normalised} `;
  const keywordText = ` ${normalise(keyword)} `;
  return queryText.includes(keywordText);
}

function primaryIntent(query) {
  if (/location references in your response/.test(query.normalised)) return "noise";
  if (/\b(app|download|android|iphone|ios)\b/.test(query.normalised)) return "app";
  if (pubNames.some((pub) => ` ${query.normalised} `.includes(` ${pub.normalised} `))) {
    return "venue";
  }
  if (areaDefinitions.some((area) => area.keywords.some((key) => matchesKeyword(query, key)))) {
    return "local_area";
  }
  if (/\b(near me|nearby|nearest|closest|local)\b/.test(query.normalised)) return "near_me";
  if (/\b(pub|pubs|restaurant|restaurants|beer garden|carvery)\b/.test(query.normalised)) {
    return "generic";
  }
  return "other";
}

function modifier(query) {
  if (/\b(soft play|indoor play|indoor playground)\b/.test(query.normalised)) return "indoor_soft_play";
  if (/\b(bouncy castle|bouncy castles)\b/.test(query.normalised)) return "bouncy_castle";
  if (/\b(outdoor|outside|garden|climbing frame)\b/.test(query.normalised)) return "outdoor_garden";
  if (/\b(park|parks|play park|play parks)\b/.test(query.normalised)) return "park_language";
  if (/\b(playground|playgrounds|play ground)\b/.test(query.normalised)) return "playground";
  if (/\b(play area|play areas|kids area|children area)\b/.test(query.normalised)) return "play_area";
  if (/\b(family|kid friendly|child friendly|children friendly)\b/.test(query.normalised)) return "family_friendly";
  return "other";
}

function aggregate(rows, classifier) {
  const groups = new Map();
  for (const query of rows) {
    const key = classifier(query);
    const group = groups.get(key) ?? {
      key,
      queries: 0,
      clicks: 0,
      impressions: 0,
      weightedPosition: 0,
    };
    group.queries += 1;
    group.clicks += query.clicks;
    group.impressions += query.impressions;
    group.weightedPosition += query.position * query.impressions;
    groups.set(key, group);
  }
  return [...groups.values()]
    .map((group) => ({
      key: group.key,
      queries: group.queries,
      clicks: group.clicks,
      impressions: group.impressions,
      ctr: group.impressions ? (group.clicks / group.impressions) * 100 : 0,
      position: group.impressions ? group.weightedPosition / group.impressions : 0,
    }))
    .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks);
}

const areas = areaDefinitions.map((area) => {
  const matchingQueries = queryRows.filter((query) =>
    area.keywords.some((keyword) => matchesKeyword(query, keyword)),
  );
  const queryAggregate = aggregate(matchingQueries, () => area.slug)[0] ?? {
    queries: 0,
    clicks: 0,
    impressions: 0,
    ctr: 0,
    position: 0,
  };
  const areaPubs = pubs.filter(
    (pub) => distanceKm(area.lat, area.lng, pub.lat, pub.lng) <= area.radiusKm,
  );
  const strongPubs = areaPubs.filter(
    (pub) => pub.description && pub.lastVerifiedAt && pub.website,
  );
  const areaLocalityCounts = new Map();
  for (const pub of areaPubs) {
    areaLocalityCounts.set(
      pub.locality,
      (areaLocalityCounts.get(pub.locality) ?? 0) + 1,
    );
  }
  return {
    slug: area.slug,
    name: area.name,
    status: area.status,
    radiusKm: area.radiusKm,
    publishablePubs: areaPubs.length,
    strongPubs: strongPubs.length,
    topLocalities: [...areaLocalityCounts.entries()]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "en-GB"))
      .slice(0, 8)
      .map(([locality, count]) => ({ locality, count })),
    queryCount: queryAggregate.queries,
    nonVenueImpressions: matchingQueries
      .filter((query) => primaryIntent(query) !== "venue")
      .reduce((total, query) => total + query.impressions, 0),
    clicks: queryAggregate.clicks,
    impressions: queryAggregate.impressions,
    ctr: queryAggregate.ctr,
    position: queryAggregate.position,
    topQueries: matchingQueries
      .sort((a, b) => b.impressions - a.impressions || b.clicks - a.clicks)
      .slice(0, 8)
      .map(({ query, clicks, impressions, ctr, position }) => ({
        query,
        clicks,
        impressions,
        ctr,
        position,
      })),
  };
});

const localityCounts = new Map();
for (const pub of pubs) {
  localityCounts.set(pub.locality, (localityCounts.get(pub.locality) ?? 0) + 1);
}

const pages = parseCsv(readZipMember("Pages.csv"))
  .slice(1)
  .filter((row) => row.length >= 5)
  .map(([page, clicks, impressions, ctr, position]) => ({
    page,
    clicks: number(clicks),
    impressions: number(impressions),
    ctr: number(ctr),
    position: number(position),
  }));

const output = {
  source: {
    export: zipPath,
    queryRows: queryRows.length,
    queryClicks: queryRows.reduce((total, row) => total + row.clicks, 0),
    queryImpressions: queryRows.reduce((total, row) => total + row.impressions, 0),
    landingPages: pages,
    liveFeedPubs: pubs.length,
    parsedLocalities: localityCounts.size,
  },
  intents: aggregate(queryRows, primaryIntent),
  modifiers: aggregate(queryRows, modifier),
  areas: areas.sort((a, b) => b.impressions - a.impressions || b.publishablePubs - a.publishablePubs),
  topLocalities: [...localityCounts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0], "en-GB"))
    .slice(0, 100)
    .map(([locality, count]) => ({ locality, count })),
  topQueries: queryRows.slice(0, 100).map(({ normalised, ...query }) => query),
};

const view = process.argv[3];
const selectedOutput =
  view === "--areas"
    ? {
        source: output.source,
        intents: output.intents,
        modifiers: output.modifiers,
        areas: output.areas,
      }
    : output;

console.log(JSON.stringify(selectedOutput, null, 2));
