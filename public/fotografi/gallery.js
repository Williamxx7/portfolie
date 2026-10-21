(() => {
  const links = Array.from(document.querySelectorAll(".photo-link"));
  const lightbox = document.getElementById("lightbox");
  if (!links.length || !lightbox) return;

  const image = document.getElementById("lightbox-img");
  const caption = document.getElementById("lightbox-caption");
  const closeButton = lightbox.querySelector(".lb-close");
  const prevButton = lightbox.querySelector(".lb-prev");
  const nextButton = lightbox.querySelector(".lb-next");

  let index = 0;
  let trigger = null;
  let closeTimer = null;

  function show(nextIndex) {
    index = (nextIndex + links.length) % links.length;
    const link = links[index];
    const text = link.dataset.caption || "";
    image.src = link.dataset.full || link.href;
    image.alt = text;
    caption.textContent = text;
  }

  function open(nextIndex, opener) {
    trigger = opener || null;
    if (closeTimer) {
      clearTimeout(closeTimer);
      closeTimer = null;
    }
    show(nextIndex);
    lightbox.hidden = false;
    document.body.style.overflow = "hidden";
    requestAnimationFrame(() => {
      lightbox.classList.add("open");
      closeButton.focus();
    });
    document.addEventListener("keydown", onKeydown);
  }

  function close() {
    lightbox.classList.remove("open");
    document.body.style.overflow = "";
    document.removeEventListener("keydown", onKeydown);
    closeTimer = setTimeout(() => {
      lightbox.hidden = true;
      closeTimer = null;
      if (trigger) trigger.focus();
    }, 260);
  }

  function onKeydown(event) {
    if (event.key === "Escape") close();
    else if (event.key === "ArrowRight") show(index + 1);
    else if (event.key === "ArrowLeft") show(index - 1);
    else if (event.key === "Tab") {
      const focusable = [closeButton, prevButton, nextButton];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  }

  links.forEach((link, linkIndex) => {
    link.addEventListener("click", event => {
      event.preventDefault();
      open(linkIndex, link);
    });
  });

  closeButton.addEventListener("click", close);
  prevButton.addEventListener("click", () => show(index - 1));
  nextButton.addEventListener("click", () => show(index + 1));
  lightbox.addEventListener("click", event => {
    if (event.target === lightbox) close();
  });
})();
