(() => {
  const portal = document.querySelector("[data-future-portal]");
  const transition = document.querySelector("[data-portal-transition]");

  if (!portal || !transition) return;

  let navigationTimer;

  const resetTransition = () => {
    window.clearTimeout(navigationTimer);
    document.body.classList.remove("portal-opening");
    transition.style.removeProperty("--portal-x");
    transition.style.removeProperty("--portal-y");
  };

  portal.addEventListener("click", (event) => {
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) return;

    event.preventDefault();

    const destination = portal.href;
    const bounds = portal.getBoundingClientRect();
    const x = bounds.left + bounds.width / 2;
    const y = bounds.top + bounds.height / 2;

    transition.style.setProperty("--portal-x", `${x}px`);
    transition.style.setProperty("--portal-y", `${y}px`);

    try {
      window.sessionStorage.setItem("yc-future-entry", "portal");
    } catch (_error) {
      // The navigation still works when storage is unavailable.
    }

    document.body.classList.add("portal-opening");

    navigationTimer = window.setTimeout(() => {
      window.location.assign(destination);
    }, 1220);
  });

  window.addEventListener("pageshow", resetTransition);
})();
