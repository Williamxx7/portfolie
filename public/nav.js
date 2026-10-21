(() => {
  const button = document.querySelector(".wx-menu-btn");
  const nav = document.getElementById("wx-nav");
  if (!button || !nav) return;

  function setOpen(open) {
    button.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
    button.setAttribute("aria-label", open ? "Luk menu" : "Åbn menu");
    nav.classList.toggle("is-open", open);
  }

  button.addEventListener("click", () => {
    setOpen(button.getAttribute("aria-expanded") !== "true");
  });

  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => setOpen(false));
  });

  document.addEventListener("keydown", event => {
    if (event.key === "Escape") setOpen(false);
  });

  document.addEventListener("click", event => {
    if (!nav.contains(event.target) && !button.contains(event.target)) {
      setOpen(false);
    }
  });
})();
