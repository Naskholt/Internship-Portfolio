(() => {
  if (!window.rive) return;

  rive.RuntimeLoader.setWasmUrl("assets/vendor/rive/rive.wasm");
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)");

  document.querySelectorAll("canvas[data-rive]").forEach((canvas) => {
    let loaded = false;
    let visible = true;
    const syncPlayback = () => {
      if (!loaded) return;
      if (visible && !document.hidden && !motion.matches) instance.startRendering();
      else instance.stopRendering();
    };
    const instance = new rive.Rive({
      src: canvas.dataset.rive,
      canvas,
      autoplay: false,
      autoBind: true,
      isTouchScrollEnabled: true,
      automaticallyHandleEvents: false,
      layout: new rive.Layout({ fit: rive.Fit.Contain, alignment: rive.Alignment.Center }),
      onLoad: () => {
        loaded = true;
        instance.resizeDrawingSurfaceToCanvas();
        const machine = instance.stateMachineNames[0];
        const animation = instance.animationNames[0];
        if (machine || animation) instance.play(machine || animation);
        canvas.parentElement.classList.add("rive-ready");
        requestAnimationFrame(() => requestAnimationFrame(syncPlayback));
      },
      onLoadError: () => {
        console.warn(`Could not load Rive animation: ${canvas.dataset.rive}`);
      },
    });
    new ResizeObserver(() => {
      if (loaded) instance.resizeDrawingSurfaceToCanvas();
    }).observe(canvas);
    new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      syncPlayback();
    }).observe(canvas);
    document.addEventListener("visibilitychange", syncPlayback);
    motion.addEventListener("change", syncPlayback);

    if (canvas.closest(".brand")) {
      // Map a three-times-larger hover area onto the existing Rive artboard.
      // Listening on the document leaves nearby navigation links clickable.
      const hoverScale = 3;
      let hovering = false;
      const forwardHover = (event) => {
        if (!event.isTrusted || !loaded) return;
        const rect = canvas.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const leavingWindow = event.type === "mouseout" && !event.relatedTarget;
        const inside = visible && !leavingWindow &&
          Math.abs(event.clientX - centerX) <= rect.width * hoverScale / 2 &&
          Math.abs(event.clientY - centerY) <= rect.height * hoverScale / 2;

        // Prevent native canvas hover coordinates from overriding the mapped ones.
        if (event.target === canvas) event.stopImmediatePropagation();
        if (inside) {
          canvas.dispatchEvent(new MouseEvent("mousemove", {
            clientX: centerX + (event.clientX - centerX) / hoverScale,
            clientY: centerY + (event.clientY - centerY) / hoverScale,
          }));
        } else if (hovering) {
          canvas.dispatchEvent(new MouseEvent("mouseout", {
            clientX: rect.right + rect.width,
            clientY: rect.bottom + rect.height,
          }));
        }
        hovering = inside;
      };
      ["mousemove", "mouseover", "mouseout"].forEach((type) => {
        document.addEventListener(type, forwardHover, true);
      });
      window.addEventListener("blur", () => {
        if (hovering) {
          canvas.dispatchEvent(new MouseEvent("mouseout", { clientX: -1000, clientY: -1000 }));
          hovering = false;
        }
      });
    }
  });
})();
