#!/usr/bin/env node

const CANONICAL_URL = "https://www.pubswithplaygrounds.com/";
const SITEMAP_URL = new URL("sitemap.xml", CANONICAL_URL).href;
const ROBOTS_URL = new URL("robots.txt", CANONICAL_URL).href;
const USER_AGENT =
  "PubsWithPlaygroundsSeoAudit/1.0 (+https://www.pubswithplaygrounds.com/)";

const failures = [];
const warnings = [];

function pass(message) {
  console.log(`PASS  ${message}`);
}

function fail(message) {
  failures.push(message);
  console.error(`FAIL  ${message}`);
}

function warn(message) {
  warnings.push(message);
  console.warn(`WARN  ${message}`);
}

async function fetchPage(url, redirect = "follow") {
  const response = await fetch(url, {
    redirect,
    headers: { "user-agent": USER_AGENT },
  });
  return response;
}

function firstMatch(source, pattern) {
  return source.match(pattern)?.[1]?.trim() ?? "";
}

function plainText(source) {
  return source.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}

function attributeFromTag(html, tagPattern, attribute) {
  const tag = html.match(tagPattern)?.[0] ?? "";
  return firstMatch(tag, new RegExp(`${attribute}=["']([^"']+)["']`, "i"));
}

async function auditRedirect(label, url) {
  const direct = await fetchPage(url, "manual");
  const final = await fetchPage(url);
  const directLocation = direct.headers.get("location") ?? "";

  if (direct.status < 300 || direct.status >= 400) {
    fail(`${label} returned ${direct.status} instead of redirecting`);
  } else if (final.url !== CANONICAL_URL || final.status !== 200) {
    fail(`${label} resolved to ${final.url} (${final.status}), expected ${CANONICAL_URL}`);
  } else {
    pass(`${label} redirects to the canonical HTTPS homepage`);
  }

  return {
    url,
    firstStatus: direct.status,
    firstLocation: directLocation,
    finalStatus: final.status,
    finalUrl: final.url,
  };
}

async function main() {
  console.log(`SEO production audit — ${new Date().toISOString()}`);
  console.log(`Canonical URL: ${CANONICAL_URL}\n`);

  const homepageResponse = await fetchPage(CANONICAL_URL);
  const homepage = await homepageResponse.text();

  homepageResponse.status === 200
    ? pass("Canonical homepage returns HTTP 200")
    : fail(`Canonical homepage returned HTTP ${homepageResponse.status}`);

  const title = plainText(firstMatch(homepage, /<title[^>]*>([\s\S]*?)<\/title>/i));
  const description = attributeFromTag(
    homepage,
    /<meta\b[^>]*name=["']description["'][^>]*>/i,
    "content",
  );
  const canonical = attributeFromTag(
    homepage,
    /<link\b[^>]*rel=["']canonical["'][^>]*>/i,
    "href",
  );
  const h1 = plainText(firstMatch(homepage, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i));
  const robotsMeta = attributeFromTag(
    homepage,
    /<meta\b[^>]*name=["']robots["'][^>]*>/i,
    "content",
  );

  title.includes("Pubs With Playgrounds")
    ? pass(`Homepage title: ${title}`)
    : fail("Homepage title is missing the brand phrase");
  description.length >= 70
    ? pass(`Homepage description present (${description.length} characters)`)
    : fail("Homepage meta description is missing or too short");
  canonical === CANONICAL_URL
    ? pass(`Homepage canonical is ${CANONICAL_URL}`)
    : fail(`Homepage canonical is ${canonical || "missing"}`);
  h1
    ? pass(`Homepage H1: ${h1}`)
    : fail("Homepage H1 is missing");
  /noindex/i.test(robotsMeta)
    ? fail("Homepage contains a noindex robots directive")
    : pass("Homepage is indexable");

  const schemaBlocks = [...homepage.matchAll(
    /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
  )];
  let schemaText = "";
  for (const block of schemaBlocks) {
    try {
      schemaText += JSON.stringify(JSON.parse(block[1]));
    } catch {
      fail("Homepage contains invalid JSON-LD");
    }
  }
  for (const type of ["Organization", "WebSite", "SoftwareApplication"]) {
    schemaText.includes(`\"@type\":\"${type}\"`)
      ? pass(`Homepage JSON-LD includes ${type}`)
      : fail(`Homepage JSON-LD is missing ${type}`);
  }

  const robotsResponse = await fetchPage(ROBOTS_URL);
  const robots = await robotsResponse.text();
  robotsResponse.status === 200
    ? pass("robots.txt returns HTTP 200")
    : fail(`robots.txt returned HTTP ${robotsResponse.status}`);
  robots.includes(`Sitemap: ${SITEMAP_URL}`)
    ? pass("robots.txt advertises the canonical sitemap")
    : fail("robots.txt does not advertise the canonical sitemap URL");

  const sitemapResponse = await fetchPage(SITEMAP_URL);
  const sitemap = await sitemapResponse.text();
  sitemapResponse.status === 200
    ? pass("sitemap.xml returns HTTP 200")
    : fail(`sitemap.xml returned HTTP ${sitemapResponse.status}`);

  const sitemapUrls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(
    (match) => match[1].trim(),
  );
  sitemapUrls.length > 0
    ? pass(`Sitemap contains ${sitemapUrls.length} URLs`)
    : fail("Sitemap contains no URLs");
  const directoryUrls = sitemapUrls.filter((url) =>
    url.startsWith(`${CANONICAL_URL}pubs-with-playgrounds/`),
  );
  directoryUrls.length >= 9
    ? pass(`Sitemap contains ${directoryUrls.length} directory URLs`)
    : fail(`Sitemap contains only ${directoryUrls.length} directory URLs; expected at least 9`);

  for (const url of sitemapUrls) {
    const response = await fetchPage(url);
    if (response.status === 200 && response.url === url) {
      pass(`Sitemap URL is healthy: ${url}`);
    } else {
      fail(`Sitemap URL ${url} resolved to ${response.url} (${response.status})`);
      continue;
    }
    if ((response.headers.get("content-type") ?? "").includes("text/html")) {
      const html = await response.text();
      const pageCanonical = attributeFromTag(
        html,
        /<link\b[^>]*rel=["']canonical["'][^>]*>/i,
        "href",
      );
      const pageTitle = plainText(
        firstMatch(html, /<title[^>]*>([\s\S]*?)<\/title>/i),
      );
      const pageH1 = plainText(
        firstMatch(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/i),
      );
      pageCanonical === url
        ? pass(`Self-referencing canonical is correct: ${url}`)
        : fail(`Canonical for ${url} is ${pageCanonical || "missing"}`);
      pageTitle && pageH1
        ? pass(`Title and H1 present: ${url}`)
        : fail(`Title or H1 missing: ${url}`);
    }
  }

  const redirectChecks = [];
  for (const [label, url] of [
    ["HTTP www", "http://www.pubswithplaygrounds.com/"],
    ["HTTPS apex", "https://pubswithplaygrounds.com/"],
    ["HTTP apex", "http://pubswithplaygrounds.com/"],
  ]) {
    redirectChecks.push(await auditRedirect(label, url));
  }

  const indexResponse = await fetchPage(`${CANONICAL_URL}index.html`, "manual");
  if (indexResponse.status >= 300 && indexResponse.status < 400) {
    pass("/index.html redirects away from the duplicate URL");
  } else {
    warn("/index.html remains reachable; the canonical tag and root-only internal links must consolidate it");
  }

  console.log(`\nSummary: ${failures.length} failure(s), ${warnings.length} warning(s)`);
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`FAIL  Audit could not complete: ${error.message}`);
  process.exitCode = 1;
});
