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
    let stars = [];
    let frame = 0;
    let running = false;
    let tick = 0;
    const pointer = { x: -1000, y: -1000 };
    const palette = ["#29f7f0", "#ff3cac", "#ffe75c", "#8cff3f", "#fff8df"];

    const invader = [
      "00100100",
      "00011000",
      "00111100",
      "01111110",
      "11111111",
      "10111101",
      "10100101",
      "00100100",
    ];

    const makeStars = () => {
      const count = Math.min(92, Math.max(30, Math.floor((width * height) / 18_000)));
      stars = Array.from({ length: count }, (_, index) => ({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.18 + Math.random() * 0.55,
        size: Math.random() > 0.76 ? 3 : 2,
        color: palette[index % palette.length],
        phase: Math.floor(Math.random() * 8),
      }));
    };

    const drawSprite = (x, y, scale, color) => {
      context.fillStyle = color;
      invader.forEach((row, rowIndex) => {
        [...row].forEach((pixel, columnIndex) => {
          if (pixel === "1") {
            context.fillRect(x + columnIndex * scale, y + rowIndex * scale, scale, scale);
          }
        });
      });
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
      context.imageSmoothingEnabled = false;
      makeStars();
      if (reducedMotion) draw(false);
    };

    const draw = (advance = true) => {
      context.clearRect(0, 0, width, height);

      stars.forEach((star, index) => {
        if (advance) {
          star.y += star.speed;
          const pointerDistance = Math.hypot(star.x - pointer.x, star.y - pointer.y);
          if (pointerDistance < 110 && pointerDistance > 0) {
            star.x += ((star.x - pointer.x) / pointerDistance) * 0.6;
          }
          if (star.x < -8) star.x = width + 8;
          if (star.x > width + 8) star.x = -8;
          if (star.y > height + 8) {
            star.y = -8;
            star.x = Math.random() * width;
          }
        }

        const visible = reducedMotion || (tick + star.phase + index) % 8 > 1;
        if (!visible) return;
        context.globalAlpha = 0.3 + star.speed;
        context.fillStyle = star.color;
        context.fillRect(Math.round(star.x), Math.round(star.y), star.size, star.size);
        if (star.size === 3) {
          context.globalAlpha = 0.18;
          context.fillRect(Math.round(star.x), Math.round(star.y - 8), star.size, 6);
        }
      });

      context.globalAlpha = 0.12;
      const march = reducedMotion ? 0 : (Math.floor(tick / 14) % 14) * 6;
      drawSprite(28 + march, Math.max(90, height * 0.16), 3, palette[1]);
      drawSprite(width - 110 - march, Math.max(190, height * 0.32), 2, palette[0]);
      context.globalAlpha = 1;
      if (advance) tick += 1;
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
