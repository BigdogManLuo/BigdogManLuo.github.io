(function () {
  function setupSlider(slider) {
    const track = slider.querySelector('.slider-track');
    const slides = slider.querySelectorAll('.slide');
    const prevBtn = slider.querySelector('.slider-btn.prev');
    const nextBtn = slider.querySelector('.slider-btn.next');
    if (!track || slides.length === 0) return;

    let index = 0;

    function update() {
      track.style.transform = `translateX(-${index * 100}%)`;
      if (prevBtn) prevBtn.disabled = (index === 0);
      if (nextBtn) nextBtn.disabled = (index === slides.length - 1);
    }

    function go(step) {
      index = Math.max(0, Math.min(slides.length - 1, index + step));
      update();
    }

    prevBtn && prevBtn.addEventListener('click', () => go(-1));
    nextBtn && nextBtn.addEventListener('click', () => go(1));

    // 键盘支持
    slider.setAttribute('tabindex', '0');
    slider.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
    });

    // 触摸滑动
    let startX = 0, dx = 0, touching = false;
    const threshold = 40;
    slider.addEventListener('touchstart', (e) => {
      touching = true; startX = e.touches[0].clientX; dx = 0;
    }, {passive:true});
    slider.addEventListener('touchmove', (e) => {
      if (!touching) return;
      dx = e.touches[0].clientX - startX;
    }, {passive:true});
    slider.addEventListener('touchend', () => {
      if (!touching) return;
      if (dx > threshold) go(-1);
      else if (dx < -threshold) go(1);
      touching = false; dx = 0;
    });

    update();
  }

  function initAll() {
    document.querySelectorAll('.slider').forEach(setupSlider);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
  document.addEventListener('pjax:complete', initAll);
})();
