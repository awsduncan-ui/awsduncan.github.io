(() => {
  document
    .querySelectorAll(".directory-photo img, .pub-detail-photo img")
    .forEach((image) => {
      image.addEventListener("error", () => {
        const container = image.closest(".directory-photo, .pub-detail-photo");
        container?.classList.add("photo-missing");
        container?.querySelector("figcaption")?.remove();
        image.remove();
        if (container && !container.querySelector(".photo-placeholder-label")) {
          const label = document.createElement("span");
          label.className = "photo-placeholder-label";
          label.textContent = "Photo coming soon";
          label.setAttribute("aria-hidden", "true");
          container.setAttribute("role", "img");
          container.setAttribute("aria-label", "Photo coming soon");
          container.append(label);
        }
      });
    });
})();
