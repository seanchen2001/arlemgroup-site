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
      const notice = document.getElementById('form-notice');
      if (notice) {
        notice.querySelector('[data-blend-echo]').textContent = blendName;
        notice.classList.add('is-visible');
      }
      const waBtn = document.getElementById('contact-wa');
      if (waBtn) {
        const label = blendName + (regionName ? ' (' + regionName + ')' : '');
        const msg = `Hola, consulta por "${label}".`;
        waBtn.setAttribute(
          'href',
          'https://wa.me/541156670631?text=' + encodeURIComponent(msg)
        );
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

  /* ---------- Ambient mouse-follow effect on dark sections ---------- */
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reducedMotion) {
    const darkSelectors = '.hero, .about-hero, .catalog-hero, .contact, .catalog-cta';
    const sections = Array.from(document.querySelectorAll(darkSelectors));

    if (sections.length) {
      const ambients = sections.map((section) => {
        const layer = document.createElement('div');
        layer.className = 'ambient';
        layer.setAttribute('aria-hidden', 'true');
        section.insertBefore(layer, section.firstChild);

        const state = {
          section,
          layer,
          targetX: 50,
          targetY: 50,
          currentX: 50,
          currentY: 50,
          visible: false,
          hovered: false,
        };

        section.addEventListener(
          'pointermove',
          (e) => {
            const rect = section.getBoundingClientRect();
            if (!rect.width || !rect.height) return;
            state.targetX = ((e.clientX - rect.left) / rect.width) * 100;
            state.targetY = ((e.clientY - rect.top) / rect.height) * 100;
            if (!state.hovered) {
              state.hovered = true;
              state.currentX = state.targetX;
              state.currentY = state.targetY;
            }
          },
          { passive: true }
        );

        section.addEventListener('pointerleave', () => {
          state.hovered = false;
          state.targetX = 50;
          state.targetY = 50;
        });

        // Reveal when section enters view.
        requestAnimationFrame(() => layer.classList.add('is-ready'));

        return state;
      });

      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const s = ambients.find((a) => a.section === entry.target);
            if (s) s.visible = entry.isIntersecting;
          });
        },
        { threshold: 0 }
      );
      ambients.forEach((a) => io.observe(a.section));

      function tick() {
        for (const a of ambients) {
          if (!a.visible) continue;
          a.currentX += (a.targetX - a.currentX) * 0.11;
          a.currentY += (a.targetY - a.currentY) * 0.11;
          a.layer.style.setProperty('--mx', a.currentX.toFixed(2) + '%');
          a.layer.style.setProperty('--my', a.currentY.toFixed(2) + '%');
        }
        requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
    }
  }
})();
