// 활용 팁 상세페이지: 가로 Swipe의 이전/다음 버튼과 현재 단계 Indicator만 담당 (Swipe 자체는 CSS Scroll Snap)
(() => {
  for (const root of document.querySelectorAll("[data-carousel]")) {
    const track = root.querySelector(".slides");
    const slides = [...track.children];
    const controls = root.querySelector(".slide-controls");
    const prev = controls.querySelector("[data-prev]");
    const next = controls.querySelector("[data-next]");
    const dots = [...controls.querySelectorAll(".slide-dot")];
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let index = 0;

    const go = (i) => {
      const target = slides[Math.max(0, Math.min(slides.length - 1, i))];
      track.scrollTo({ left: target.offsetLeft, behavior: reduceMotion.matches ? "auto" : "smooth" });
    };

    const update = () => {
      const center = track.scrollLeft + track.clientWidth / 2;
      index = slides.reduce((best, s, i) =>
        Math.abs(s.offsetLeft + s.offsetWidth / 2 - center) <
        Math.abs(slides[best].offsetLeft + slides[best].offsetWidth / 2 - center) ? i : best, 0);
      dots.forEach((d, i) => i === index ? d.setAttribute("aria-current", "step") : d.removeAttribute("aria-current"));
      prev.disabled = index === 0;
      next.disabled = index === slides.length - 1;
    };

    let frame = 0;
    track.addEventListener("scroll", () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    }, { passive: true });
    prev.addEventListener("click", () => go(index - 1));
    next.addEventListener("click", () => go(index + 1));
    dots.forEach((d, i) => d.addEventListener("click", () => go(i)));

    controls.hidden = false;
    update();
  }
})();
