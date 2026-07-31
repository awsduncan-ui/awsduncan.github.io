#!/usr/bin/env node

import { access, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const ROOT = fileURLToPath(new URL("../", import.meta.url));
const ORIGIN = "https://www.pubswithplaygrounds.com";
const failures = [];

function pass(message) {
  console.log(`PASS  ${message}`);
}

function fail(message) {
  failures.push(message);
  console.error(`FAIL  ${message}`);
}

function matches(source, pattern) {
  return [...source.matchAll(pattern)];
}

function localFileFor(siteUrl) {
  const pathname = new URL(siteUrl).pathname;
  if (pathname === "/") return path.join(ROOT, "index.html");
  if (pathname.endsWith("/")) {
    return path.join(ROOT, pathname.slice(1), "index.html");
  }
  return path.join(ROOT, pathname.slice(1));
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

function attribute(tag, name) {
  return tag.match(new RegExp(`${name}=["']([^"']+)["']`, "i"))?.[1] ?? "";
}

async function main() {
  const sitemap = await readFile(path.join(ROOT, "sitemap.xml"), "utf8");
  const urls = matches(sitemap, /<loc>([^<]+)<\/loc>/g).map((item) => item[1]);
  const directoryUrls = urls.filter((url) =>
    url.startsWith(`${ORIGIN}/pubs-with-playgrounds/`),
  );

  urls.length === 13
    ? pass("Sitemap contains the expected 13 canonical URLs")
    : fail(`Sitemap contains ${urls.length} URLs; expected 13`);
  directoryUrls.length === 9
    ? pass("Sitemap contains the national directory and eight regional guides")
    : fail(`Sitemap contains ${directoryUrls.length} directory URLs; expected 9`);

  for (const url of urls) {
    const file = localFileFor(url);
    if (!(await exists(file))) {
      fail(`Missing local file for ${url}: ${file}`);
      continue;
    }
    const html = await readFile(file, "utf8");
    const titles = matches(html, /<title[^>]*>([\s\S]*?)<\/title>/gi);
    const h1s = matches(html, /<h1\b[^>]*>([\s\S]*?)<\/h1>/gi);
    const canonicalTags = matches(
      html,
      /<link\b[^>]*rel=["']canonical["'][^>]*>/gi,
    );
    const canonical = canonicalTags[0]
      ? attribute(canonicalTags[0][0], "href")
      : "";
    titles.length === 1 && h1s.length === 1
      ? pass(`One title and H1: ${url}`)
      : fail(`${url} has ${titles.length} titles and ${h1s.length} H1s`);
    canonical === url
      ? pass(`Self-referencing canonical: ${url}`)
      : fail(`${url} canonical is ${canonical || "missing"}`);
    /<meta\b[^>]*name=["']robots["'][^>]*noindex/i.test(html)
      ? fail(`${url} contains noindex`)
      : pass(`Indexable: ${url}`);

    for (const block of matches(
      html,
      /<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    )) {
      try {
        JSON.parse(block[1]);
      } catch (error) {
        fail(`${url} has invalid JSON-LD: ${error.message}`);
      }
    }

    const ids = matches(html, /\bid=["']([^"']+)["']/gi).map((item) => item[1]);
    const duplicates = [...new Set(ids.filter((id, index) => ids.indexOf(id) !== index))];
    duplicates.length
      ? fail(`${url} has duplicate IDs: ${duplicates.join(", ")}`)
      : pass(`Unique element IDs: ${url}`);
  }

  for (const url of directoryUrls) {
    const html = await readFile(localFileFor(url), "utf8");
    const cards = matches(html, /\bdata-directory-card(?:\s|>)/g).length;
    cards > 0
      ? pass(`${url} contains ${cards} static pub cards`)
      : fail(`${url} contains no static pub cards`);
    html.includes("Last checked") && html.includes("Report a correction")
      ? pass(`${url} exposes freshness and correction information`)
      : fail(`${url} is missing freshness or correction information`);
  }

  const homepage = await readFile(path.join(ROOT, "index.html"), "utf8");
  homepage.includes("Find pubs with playgrounds near you") &&
  homepage.includes("/pubs-with-playgrounds/") &&
  !homepage.includes("data-postcode-finder")
    ? pass("Homepage is a crawlable directory gateway")
    : fail("Homepage regional-guide gateway is missing or still contains postcode routing");

  const fileCache = new Map();
  let internalLinks = 0;
  for (const sourceUrl of urls) {
    const sourceHtml = await readFile(localFileFor(sourceUrl), "utf8");
    const hrefs = matches(sourceHtml, /<a\b[^>]*href=["']([^"']+)["'][^>]*>/gi)
      .map((item) => item[1])
      .filter((href) => !/^(mailto:|tel:)/i.test(href));
    for (const href of hrefs) {
      const targetUrl = new URL(href, sourceUrl);
      if (targetUrl.origin !== ORIGIN) continue;
      internalLinks += 1;
      const targetFile = localFileFor(targetUrl.href);
      if (!(await exists(targetFile))) {
        fail(`Broken internal link from ${sourceUrl}: ${href}`);
        continue;
      }
      if (targetUrl.hash) {
        let targetHtml = fileCache.get(targetFile);
        if (!targetHtml) {
          targetHtml = await readFile(targetFile, "utf8");
          fileCache.set(targetFile, targetHtml);
        }
        const id = decodeURIComponent(targetUrl.hash.slice(1));
        if (
          !targetHtml.includes(`id="${id}"`) &&
          !targetHtml.includes(`id='${id}'`)
        ) {
          fail(`Broken fragment link from ${sourceUrl}: ${href}`);
        }
      }
    }
  }
  failures.some((message) => message.includes("link from"))
    ? null
    : pass(`${internalLinks} internal links resolve to local pages and fragments`);

  console.log(`\nSummary: ${failures.length} failure(s)`);
  if (failures.length) process.exitCode = 1;
}

main().catch((error) => {
  console.error(`FAIL  Audit could not complete: ${error.message}`);
  process.exitCode = 1;
});
