const reduceMotion = window.matchMedia(
  "(prefers-reduced-motion: reduce)",
).matches;

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.12 },
);

document
  .querySelectorAll(".reveal")
  .forEach((el) => revealObserver.observe(el));

const progressBar = document.querySelector(".progress span");

function onScroll() {
  const scrollable = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
  progressBar.style.width = `${Math.min(100, Math.max(0, progress * 100))}%`;

  if (!reduceMotion) {
    document.querySelectorAll(".project").forEach((project) => {
      const rect = project.getBoundingClientRect();
      const centerOffset =
        window.innerHeight / 2 - (rect.top + rect.height / 2);
      const float = Math.max(-80, Math.min(80, centerOffset * 0.08));
      project.querySelectorAll(".float-symbol").forEach((symbol, i) => {
        symbol.style.setProperty(
          "--float-y",
          `${float * (i === 0 ? 1 : -0.7)}px`,
        );
      });
    });
  }
}
window.addEventListener("scroll", onScroll, { passive: true });
onScroll();

document.querySelectorAll("[data-gallery]").forEach((gallery) => {
  const wrap = gallery.closest(".gallery-wrap");
  const slides = [...gallery.querySelectorAll(".gallery-slide")];
  const prev = wrap.querySelector("[data-prev]");
  const next = wrap.querySelector("[data-next]");
  const counter = wrap.querySelector("[data-counter]");

  const getSlideOffset = (slide) =>
    slide.getBoundingClientRect().left -
    gallery.getBoundingClientRect().left +
    gallery.scrollLeft;

  const getIndex = () => {
    const index = slides.reduce(
      (closestIndex, slide, slideIndex) =>
        Math.abs(getSlideOffset(slide) - gallery.scrollLeft) <
        Math.abs(getSlideOffset(slides[closestIndex]) - gallery.scrollLeft)
          ? slideIndex
          : closestIndex,
      0,
    );
    return index;
  };

  const updateCounter = () => {
    const index = getIndex();
    counter.textContent = `${String(index + 1).padStart(2, "0")} / ${String(slides.length).padStart(2, "0")}`;
  };

  const goTo = (index) => {
    const clamped = Math.max(0, Math.min(slides.length - 1, index));
    gallery.scrollTo({
      left: getSlideOffset(slides[clamped]),
      behavior: reduceMotion ? "auto" : "smooth",
    });
  };

  prev.addEventListener("click", () => goTo(getIndex() - 1));
  next.addEventListener("click", () => goTo(getIndex() + 1));
  gallery.addEventListener(
    "scroll",
    () => requestAnimationFrame(updateCounter),
    { passive: true },
  );

  let isDown = false;
  let startX = 0;
  let startScrollLeft = 0;

  gallery.addEventListener("pointerdown", (event) => {
    if (event.pointerType === "touch") return;
    isDown = true;
    startX = event.clientX;
    startScrollLeft = gallery.scrollLeft;
    gallery.setPointerCapture(event.pointerId);
  });

  gallery.addEventListener("pointermove", (event) => {
    if (!isDown) return;
    const dx = event.clientX - startX;
    gallery.scrollLeft = startScrollLeft - dx;
  });

  const endDrag = () => {
    isDown = false;
  };
  gallery.addEventListener("pointerup", endDrag);
  gallery.addEventListener("pointercancel", endDrag);

  updateCounter();
});

// Optional: apply each project's accent to its live-project link.
document.querySelectorAll(".project").forEach((project) => {
  const accent = project.dataset.accent;

  if (!accent) return;

  project.style.setProperty("--accent", accent);

  const link = project.querySelector(".project-link");

  if (link) {
    link.style.color = accent;
  }
});
