(() => {
  const normalise = (value) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

  const regionMatchers = [
    { slug: "london", postcode: /^(E|EC|N|NW|SE|SW|W|WC|EN|HA|UB)\d/i, places: /\b(london|wembley|enfield|harrow|croydon)\b/i },
    { slug: "west-midlands", postcode: /^(B|CV|DY|WS|WV)\d/i, places: /\b(birmingham|coventry|wolverhampton|walsall|solihull|dudley)\b/i },
    { slug: "kent", postcode: /^(CT|DA|ME|TN)\d/i, places: /\b(kent|maidstone|canterbury|medway|sevenoaks|ashford)\b/i },
    { slug: "bristol-and-bath", postcode: /^(BA|BS)\d/i, places: /\b(bristol|bath|weston super mare|north somerset)\b/i },
    { slug: "greater-manchester", postcode: /^(BL|M|OL|SK|WA|WN)\d/i, places: /\b(manchester|salford|stockport|wigan|bolton|oldham|rochdale|trafford)\b/i },
    { slug: "essex", postcode: /^(CM|CO|IG|RM|SS)\d/i, places: /\b(essex|chelmsford|colchester|brentwood|southend)\b/i },
    { slug: "surrey", postcode: /^(CR|GU|KT|RH|SM|TW)\d/i, places: /\b(surrey|guildford|woking|reigate|epsom|farnham)\b/i },
    { slug: "devon-and-cornwall", postcode: /^(EX|PL|TQ|TR)\d/i, places: /\b(devon|cornwall|exeter|plymouth|torquay|truro)\b/i },
  ];

  document.querySelectorAll("[data-postcode-finder]").forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const input = form.querySelector("input[name='location']");
      const status = form.querySelector("[data-postcode-status]");
      const query = input?.value.trim() ?? "";
      const compact = query.toUpperCase().replace(/\s+/g, "");
      const match = regionMatchers.find(
        (region) => region.postcode.test(compact) || region.places.test(query),
      );
      if (match) {
        window.location.assign(`/pubs-with-playgrounds/${match.slug}/`);
        return;
      }
      if (status) {
        status.textContent = query
          ? "That location is outside the first regional guides. Opening the national directory."
          : "Enter a postcode or town to find a guide.";
      }
      if (query) {
        window.location.assign("/pubs-with-playgrounds/");
      }
    });
  });

  document.querySelectorAll("[data-directory-filter]").forEach((form) => {
    const input = form.querySelector("input[name='q']");
    const result = form.querySelector("[data-directory-results]");
    const grid = document.querySelector("[data-directory-grid]");
    const empty = document.querySelector("[data-directory-empty]");
    if (!input || !grid) return;
    const cards = [...grid.querySelectorAll("[data-directory-card]")];

    const applyFilter = () => {
      const query = normalise(input.value);
      let visible = 0;
      for (const card of cards) {
        const matches = !query || normalise(card.dataset.search ?? "").includes(query);
        card.hidden = !matches;
        if (matches) visible += 1;
      }
      if (result) result.textContent = `Showing ${visible} checked ${visible === 1 ? "venue" : "venues"}.`;
      if (empty) empty.hidden = visible !== 0;
      const url = new URL(window.location.href);
      if (query) url.searchParams.set("q", input.value.trim());
      else url.searchParams.delete("q");
      window.history.replaceState({}, "", url);
    };

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      applyFilter();
    });
    input.addEventListener("input", applyFilter);
    const initial = new URLSearchParams(window.location.search).get("q");
    if (initial) {
      input.value = initial;
      applyFilter();
      document.querySelector("#listings")?.scrollIntoView({ block: "start" });
    }
  });

  document.querySelectorAll(".directory-photo img").forEach((image) => {
    image.addEventListener("error", () => {
      image.closest(".directory-photo")?.classList.add("photo-missing");
      image.remove();
    });
  });
})();
