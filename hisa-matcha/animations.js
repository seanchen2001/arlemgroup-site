/* =====================================================================
   Kura Matcha — anime.js orchestration layer
   High-impact moments only: hero intro, section rule draws, panel reveal.
   Gracefully degrades when anime.js missing or reduced-motion is on.
   ===================================================================== */

(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const hasAnime = typeof window.anime !== 'undefined';
  window.KURA_MATCHA = window.KURA_MATCHA || {};

  if (reduced || !hasAnime) {
    // Show everything natively and expose no-op hook.
    document.documentElement.classList.remove('js-anime');
    window.KURA_MATCHA.animatePanelOpen = function () {};
    return;
  }

  const EASE = 'cubicBezier(.2,.7,.2,1)';
  const EASE_EXPO = 'cubicBezier(.16,1,.3,1)';

  // ---------- 1) Split any element marked data-split="chars" ----------
  function splitChars(el) {
    if (el.dataset.split === 'done') return [];
    const raw = el.textContent;
    el.setAttribute('aria-label', raw);
    el.textContent = '';
    const chars = [];
    const isWordmark = el.classList.contains('hero__wordmark');
    const words = raw.split(' ');
    words.forEach((word, wIdx) => {
      // Wrap each word in an inline-block so line breaks can only happen
      // at the whitespace between words, never inside a word.
      const wordEl = document.createElement('span');
      wordEl.style.display = 'inline-block';
      wordEl.style.whiteSpace = 'nowrap';
      wordEl.setAttribute('aria-hidden', 'true');
      for (const ch of word) {
        const span = document.createElement('span');
        span.className = (isWordmark ? 'hero__wordmark-char ' : '') + 'split-char';
        span.style.display = 'inline-block';
        span.textContent = ch;
        wordEl.appendChild(span);
        chars.push(span);
      }
      el.appendChild(wordEl);
      if (wIdx < words.length - 1) {
        el.appendChild(document.createTextNode(' '));
      }
    });
    el.dataset.split = 'done';
    return chars;
  }

  // Pre-split hero wordmark before first paint (class already in DOM).
  const wordmark = document.querySelector('.hero__wordmark');
  if (wordmark) splitChars(wordmark);

  // ---------- 2) Hero intro timeline ----------
  function runHeroIntro() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const tl = anime.timeline({
      easing: EASE,
      duration: 800,
    });

    tl.add({
      targets: '.hero__meta span',
      opacity: [0, 0.7],
      translateY: [10, 0],
      delay: anime.stagger(110),
      duration: 700,
    }, 80);

    if (wordmark && wordmark.querySelectorAll('.hero__wordmark-char').length) {
      tl.add({
        targets: '.hero__wordmark-char',
        opacity: [0, 1],
        translateY: [80, 0],
        rotate: [{ value: [-4, 0] }],
        duration: 1200,
        delay: anime.stagger(65),
        easing: EASE_EXPO,
      }, '-=500');
    }

    tl.add({
      targets: '.hero__descriptor-line',
      scaleX: [0, 1],
      duration: 850,
      easing: 'cubicBezier(.6,0,.2,1)',
    }, '-=750')
    .add({
      targets: '.hero__descriptor-text',
      opacity: [0, 0.78],
      translateX: [12, 0],
      duration: 700,
    }, '-=550')
    .add({
      targets: '.hero__actions > *',
      opacity: [0, 1],
      translateY: [16, 0],
      delay: anime.stagger(110),
      duration: 700,
    }, '-=450')
    .add({
      targets: '.hero__foot > *',
      opacity: [0, 0.6],
      translateY: [10, 0],
      delay: anime.stagger(80),
      duration: 600,
    }, '-=550');
  }

  // ---------- 3) Non-hero .display headings — letter reveal on load ----------
  function revealOtherDisplays() {
    const displays = document.querySelectorAll('.display');
    displays.forEach((el) => {
      if (el.classList.contains('hero__wordmark')) return;
      const chars = splitChars(el);
      if (!chars.length) return;
      anime.set(chars, { opacity: 0, translateY: 40 });
      anime({
        targets: chars,
        opacity: [0, 1],
        translateY: [40, 0],
        duration: 1000,
        delay: anime.stagger(22, { start: 200 }),
        easing: EASE_EXPO,
      });
    });
  }

  // ---------- 4) Section-heading rule sweep on scroll ----------
  function observeRules() {
    const rules = document.querySelectorAll('.section-head .rule');
    if (!rules.length) return;

    const io = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          anime({
            targets: entry.target,
            scaleX: [0, 1],
            duration: 1100,
            easing: EASE_EXPO,
          });
          obs.unobserve(entry.target);
        });
      },
      { threshold: 0.4 }
    );

    rules.forEach((r) => io.observe(r));
  }

  // ---------- 5) Panel open — exposed to map.js ----------
  window.KURA_MATCHA.animatePanelOpen = function (panelBody) {
    if (!panelBody) return;
    const region = panelBody.querySelector('.panel__region');
    const heading = panelBody.querySelector('.panel__heading');
    const rule = panelBody.querySelector('.panel__rule');
    const intro = panelBody.querySelector('.panel__intro');
    const rows = panelBody.querySelectorAll('.blend-row');

    const meta = [region, heading, intro].filter(Boolean);

    if (meta.length) {
      anime.set(meta, { opacity: 0, translateY: 14 });
      anime({
        targets: meta,
        opacity: [0, 1],
        translateY: [14, 0],
        duration: 700,
        delay: anime.stagger(70),
        easing: EASE,
      });
    }

    if (rule) {
      anime.set(rule, { scaleX: 0, transformOrigin: 'left center' });
      anime({
        targets: rule,
        scaleX: [0, 1],
        duration: 700,
        delay: 120,
        easing: 'cubicBezier(.6,0,.2,1)',
      });
    }

    if (rows.length) {
      anime.set(rows, { opacity: 0, translateX: -14 });
      anime({
        targets: Array.from(rows),
        opacity: [0, 1],
        translateX: [-14, 0],
        duration: 600,
        delay: anime.stagger(55, { start: 260 }),
        easing: EASE,
      });
    }
  };

  // ---------- 6) Blend-row expand pulse (subtle) ----------
  document.addEventListener('click', (e) => {
    const trigger = e.target.closest('.blend-row__trigger');
    if (!trigger) return;
    const row = trigger.closest('.blend-row');
    if (!row) return;
    // Wait a tick for the .is-open class toggle from map.js.
    requestAnimationFrame(() => {
      if (!row.classList.contains('is-open')) return;
      const card = row.querySelector('.blend-card');
      if (!card) return;
      const parts = card.querySelectorAll(':scope > *');
      anime.set(parts, { opacity: 0, translateY: 8 });
      anime({
        targets: Array.from(parts),
        opacity: [0, 1],
        translateY: [8, 0],
        duration: 500,
        delay: anime.stagger(45, { start: 80 }),
        easing: EASE,
      });
    });
  });

  // ---------- 7) Hover float on application / product images ----------
  function wireImageHover() {
    document.querySelectorAll('.app-card, .product__image').forEach((card) => {
      card.addEventListener('mouseenter', () => {
        const img = card.querySelector('img');
        if (!img) return;
        anime.remove(img);
        anime({
          targets: img,
          scale: 1.04,
          duration: 900,
          easing: EASE_EXPO,
        });
      });
      card.addEventListener('mouseleave', () => {
        const img = card.querySelector('img');
        if (!img) return;
        anime.remove(img);
        anime({
          targets: img,
          scale: 1,
          duration: 900,
          easing: EASE_EXPO,
        });
      });
    });
  }

  // ---------- Boot ----------
  function boot() {
    runHeroIntro();
    revealOtherDisplays();
    observeRules();
    wireImageHover();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }

  // Re-wire when catalog dynamically injects products.
  const productsContainer = document.getElementById('products');
  if (productsContainer) {
    const mo = new MutationObserver(() => {
      wireImageHover();
    });
    mo.observe(productsContainer, { childList: true });
  }
})();
