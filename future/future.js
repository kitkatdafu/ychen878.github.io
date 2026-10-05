(() => {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const body = document.body;

  const startArrival = () => {
    let arrivedThroughPortal = false;

    try {
      arrivedThroughPortal = window.sessionStorage.getItem("yc-future-entry") === "portal";
      window.sessionStorage.removeItem("yc-future-entry");
    } catch (_error) {
      // Storage is an enhancement; the interface does not depend on it.
    }

    if (!arrivedThroughPortal || reducedMotion) return;

    body.classList.add("is-booting");
    window.setTimeout(() => body.classList.remove("is-booting"), 1760);
  };

  const initializeReveals = () => {
    const elements = [...document.querySelectorAll("[data-reveal]")];
    if (!elements.length || reducedMotion || !("IntersectionObserver" in window)) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    body.classList.add("reveal-enabled");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -9%", threshold: 0.08 },
    );

    elements.forEach((element) => observer.observe(element));
  };

  const initializeClock = () => {
    const clock = document.querySelector("[data-local-time]");
    if (!clock) return;

    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: "America/Chicago",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZoneName: "short",
    });

    const update = () => {
      clock.textContent = formatter.format(new Date());
      clock.dateTime = new Date().toISOString();
    };

    update();
    window.setInterval(update, 30_000);
  };

  const initializeScrollSignals = () => {
    const progress = document.querySelector("[data-scroll-progress]");
    if (!progress) return;

    let ticking = false;
    const update = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = scrollable > 0 ? Math.min(1, window.scrollY / scrollable) : 0;
      progress.style.transform = `scaleX(${ratio})`;
      ticking = false;
    };

    const requestUpdate = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate, { passive: true });
  };

  const initializeActiveNavigation = () => {
    if (!("IntersectionObserver" in window)) return;

    const links = [...document.querySelectorAll('.future-nav a[href^="#"]')];
    const sections = links
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;

        links.forEach((link) => {
          const active = link.getAttribute("href") === `#${visible.target.id}`;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      },
      { rootMargin: "-22% 0px -60%", threshold: [0, 0.2, 0.5] },
    );

    sections.forEach((section) => observer.observe(section));
  };

  const initializeSignalField = () => {
    const canvas = document.querySelector("#signal-field");
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let nodes = [];
    let frame = 0;
    let running = false;
    const pointer = { x: -1000, y: -1000 };

    const makeNodes = () => {
      const count = Math.min(62, Math.max(22, Math.floor((width * height) / 25_000)));
      nodes = Array.from({ length: count }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.15,
        vy: (Math.random() - 0.5) * 0.15,
        size: Math.random() > 0.82 ? 1.8 : 1,
      }));
    };

    const resize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * ratio);
      canvas.height = Math.floor(height * ratio);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      makeNodes();
      if (reducedMotion) draw(false);
    };

    const draw = (advance = true) => {
      context.clearRect(0, 0, width, height);

      nodes.forEach((node, index) => {
        if (advance) {
          node.x += node.vx;
          node.y += node.vy;

          const pointerDistance = Math.hypot(node.x - pointer.x, node.y - pointer.y);
          if (pointerDistance < 130 && pointerDistance > 0) {
            node.x += ((node.x - pointer.x) / pointerDistance) * 0.12;
            node.y += ((node.y - pointer.y) / pointerDistance) * 0.12;
          }

          if (node.x < -10) node.x = width + 10;
          if (node.x > width + 10) node.x = -10;
          if (node.y < -10) node.y = height + 10;
          if (node.y > height + 10) node.y = -10;
        }

        context.fillStyle = index % 9 === 0 ? "rgba(255,107,92,0.72)" : "rgba(124,246,179,0.62)";
        context.fillRect(node.x, node.y, node.size, node.size);

        for (let otherIndex = index + 1; otherIndex < nodes.length; otherIndex += 1) {
          const other = nodes[otherIndex];
          const distance = Math.hypot(node.x - other.x, node.y - other.y);
          if (distance > 118) continue;
          context.strokeStyle = `rgba(124,246,179,${0.11 * (1 - distance / 118)})`;
          context.lineWidth = 0.5;
          context.beginPath();
          context.moveTo(node.x, node.y);
          context.lineTo(other.x, other.y);
          context.stroke();
        }
      });
    };

    const animate = () => {
      if (!running) return;
      draw(true);
      frame = window.requestAnimationFrame(animate);
    };

    const start = () => {
      if (running || reducedMotion) return;
      running = true;
      animate();
    };

    const stop = () => {
      running = false;
      window.cancelAnimationFrame(frame);
    };

    resize();
    start();

    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener(
      "pointermove",
      (event) => {
        pointer.x = event.clientX;
        pointer.y = event.clientY;
      },
      { passive: true },
    );
    document.addEventListener("visibilitychange", () => {
      if (document.hidden) stop();
      else start();
    });
  };

  startArrival();
  initializeReveals();
  initializeClock();
  initializeScrollSignals();
  initializeActiveNavigation();
  initializeSignalField();
})();
