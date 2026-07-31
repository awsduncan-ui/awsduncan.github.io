(() => {
  const normalise = (value) =>
    value.toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();

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
