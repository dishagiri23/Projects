const containers = document.querySelectorAll(
  "#container1, #container2, #container3, #container4, #container5"
);

containers.forEach((container) => {
  const openLock = container.querySelector(".open-lock");
  const closeLock = container.querySelector(".icon3");

  if (openLock && closeLock) {
    openLock.addEventListener("click", () => {
      container.classList.add("locked");
    });

    closeLock.addEventListener("click", () => {
      container.classList.remove("locked");
    });
  }
});
