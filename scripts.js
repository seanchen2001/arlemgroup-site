/* =====================================================================
   Kura Matcha — shared behaviors: nav, scroll reveal, contact prefill
   ===================================================================== */

(function () {
  const nav = document.querySelector('.nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  }

  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: '0px 0px -10% 0px', threshold: 0.1 }
    );
    revealEls.forEach((el) => io.observe(el));
  }

  window.KURA_MATCHA = window.KURA_MATCHA || {};
  window.KURA_MATCHA.prefillContact = function (blendName, regionName) {
    try {
      const input = document.getElementById('blend-field');
      if (input) input.value = blendName + (regionName ? ' · ' + regionName : '');
      const notice = document.getElementById('form-notice');
      if (notice) {
        notice.querySelector('[data-blend-echo]').textContent = blendName;
        notice.classList.add('is-visible');
      }
      const target = document.getElementById('contacto');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } catch (e) {
      /* noop */
    }
  };

  const url = new URL(window.location.href);
  const prefill = url.searchParams.get('blend');
  if (prefill) {
    const run = () => window.KURA_MATCHA.prefillContact(prefill, url.searchParams.get('region') || '');
    if (document.readyState === 'complete') run();
    else window.addEventListener('load', run);
  }
})();
