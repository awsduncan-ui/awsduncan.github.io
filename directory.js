(() => {
  document.querySelectorAll(".directory-photo img").forEach((image) => {
    image.addEventListener("error", () => {
      image.closest(".directory-photo")?.classList.add("photo-missing");
      image.remove();
    });
  });
})();
