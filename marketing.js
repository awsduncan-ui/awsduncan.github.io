(function () {
  "use strict";

  const MEASUREMENT_ID = "G-X59GR96YDR";
  const APPLE_PROVIDER_TOKEN = "128447115";
  const CONSENT_KEY = "pwp_analytics_consent_v1";
  const CAMPAIGN_KEY = "pwp_campaign_v1";
  const CAMPAIGN_PARAMS = [
    "utm_id",
    "utm_source",
    "utm_medium",
    "utm_campaign",
    "utm_content",
    "utm_source_platform",
    "asc_campaign",
  ];

  function browserStorage(name) {
    try {
      return window[name];
    } catch (_) {
      return null;
    }
  }

  function safeStorage(storage, operation, key, value) {
    if (!storage) return null;
    try {
      if (operation === "get") return storage.getItem(key);
      if (operation === "set") storage.setItem(key, value);
    } catch (_) {
      // Measurement and consent controls must not interrupt the website.
    }
    return null;
  }

  function readConsent() {
    return safeStorage(browserStorage("localStorage"), "get", CONSENT_KEY);
  }

  function setConsent(value) {
    safeStorage(browserStorage("localStorage"), "set", CONSENT_KEY, value);
    window.gtag("consent", "update", {
      analytics_storage: value === "granted" ? "granted" : "denied",
    });
  }

  function currentCampaign() {
    const search = new URLSearchParams(window.location.search);
    const campaign = {};
    for (const key of CAMPAIGN_PARAMS) {
      const value = search.get(key);
      if (value) campaign[key] = value.slice(0, 100);
    }

    const sessionStorage = browserStorage("sessionStorage");
    if (Object.keys(campaign).length > 0) {
      safeStorage(sessionStorage, "set", CAMPAIGN_KEY, JSON.stringify(campaign));
      return campaign;
    }

    const stored = safeStorage(sessionStorage, "get", CAMPAIGN_KEY);
    if (!stored) return {};
    try {
      return JSON.parse(stored);
    } catch (_) {
      return {};
    }
  }

  function storeForLink(link) {
    try {
      const hostname = new URL(link.href).hostname;
      if (hostname === "apps.apple.com") return "ios";
      if (hostname === "play.google.com") return "android";
    } catch (_) {
      return "";
    }
    return "";
  }

  function linkLocation(link) {
    if (link.dataset.linkLocation) return link.dataset.linkLocation;
    if (link.closest(".nav-wrap")) return "navigation";
    if (link.closest(".directory-hero")) return "directory-hero";
    if (link.closest(".hero")) return "hero";
    if (link.closest(".cta-band")) return "download-cta";
    if (link.closest(".footer")) return "footer";
    return "page";
  }

  function storeLinks() {
    return [...document.querySelectorAll("a[href]")].filter(storeForLink);
  }

  function updateStoreLinks(campaign) {
    for (const link of storeLinks()) {
      const store = storeForLink(link);
      const url = new URL(link.href);
      if (store === "ios" && campaign.asc_campaign) {
        url.searchParams.set("pt", APPLE_PROVIDER_TOKEN);
        url.searchParams.set("ct", campaign.asc_campaign);
        url.searchParams.set("mt", "8");
      } else if (store === "android") {
        const referrer = new URLSearchParams();
        for (const key of CAMPAIGN_PARAMS.filter((value) => value.startsWith("utm_"))) {
          if (campaign[key]) referrer.set(key, campaign[key]);
        }
        if ([...referrer].length > 0) url.searchParams.set("referrer", referrer.toString());
      }
      link.href = url.toString();
    }
  }

  function trackStoreClicks(campaign) {
    for (const link of storeLinks()) {
      link.addEventListener("click", function () {
        window.gtag("event", "store_click", {
          store: storeForLink(link),
          link_location: linkLocation(link),
          campaign_link_id: campaign.utm_id || "(not set)",
          campaign_source: campaign.utm_source || "(not set)",
          campaign_medium: campaign.utm_medium || "(not set)",
          campaign_name: campaign.utm_campaign || "(not set)",
          campaign_content: campaign.utm_content || "(not set)",
          transport_type: "beacon",
        });
      });
    }
  }

  function showConsentNotice() {
    if (readConsent()) return;
    const notice = document.createElement("aside");
    notice.className = "analytics-consent";
    notice.setAttribute("role", "dialog");
    notice.setAttribute("aria-labelledby", "analytics-consent-title");
    notice.innerHTML = `
      <div>
        <strong id="analytics-consent-title">Help us improve the app</strong>
        <p>Optional analytics tell us which publicity links lead to website and app-store visits. We do not use this for advertising. <a href="/privacy.html#analytics">Privacy details</a></p>
      </div>
      <div class="analytics-consent-actions">
        <button type="button" class="consent-secondary" data-consent="denied">Only essential</button>
        <button type="button" class="consent-primary" data-consent="granted">Allow analytics</button>
      </div>
    `;
    notice.addEventListener("click", function (event) {
      const button = event.target.closest("[data-consent]");
      if (!button) return;
      setConsent(button.dataset.consent);
      notice.remove();
    });
    document.body.appendChild(notice);
  }

  window.dataLayer = window.dataLayer || [];
  window.gtag = window.gtag || function () {
    window.dataLayer.push(arguments);
  };
  window.gtag("consent", "default", {
    analytics_storage: "denied",
    ad_storage: "denied",
    ad_user_data: "denied",
    ad_personalization: "denied",
    wait_for_update: 500,
  });

  const existingConsent = readConsent();
  if (existingConsent) setConsent(existingConsent);

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(MEASUREMENT_ID)}`;
  document.head.appendChild(tag);
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID, {
    allow_google_signals: false,
    allow_ad_personalization_signals: false,
  });

  const campaign = currentCampaign();
  updateStoreLinks(campaign);
  trackStoreClicks(campaign);
  showConsentNotice();
})();
