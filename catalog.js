/* =====================================================================
   Kura Matcha — Catálogo · tarjetero card rack + blend detail overlay
   ===================================================================== */

(function () {
  const regions = window.REGIONS || [];
  const WHATSAPP_NUMBER = '5491156670631';

  // Flatten blends with their region, in display order.
  const blends = [];
  regions.forEach((r) => {
    r.blends.forEach((b) => blends.push({ region: r, blend: b }));
  });

  /* ---------- Blend codename + image map ----------
     Each featured blend has a short romaji codename shown on its card,
     matching the filename of its powder-stroke image in /public. */
  const CODENAMES = {
    'blend-shizuoka-maki':    { code: 'MAKI',  img: 'public/maki.png'  },
    'blend-shizuoka-rin':     { code: 'RIN',   img: 'public/maki.png'  },
    'blend-kyoto-haku':       { code: 'HAKU',  img: 'public/kai.png'   },
    'blend-kyoto-kai':        { code: 'KAI',   img: 'public/kai.png'   },
    'blend-kansai-ichi':      { code: 'ICHI',  img: 'public/ichi.png'  },
    'blend-kagoshima-tsuyu':  { code: 'TSUYU', img: 'public/sei.png'   },
    'blend-kagoshima-tsune':  { code: 'TSUNE', img: 'public/tsune.png' },
  };
  const codeFor  = (blend) => (CODENAMES[blend.id] || {}).code || '—';
  const imageFor = (blend) => (CODENAMES[blend.id] || {}).img  || 'public/ichi.png';

  /* ---------- Featured blends shown in the rack ---------- */
  const FEATURED_IDS = ['blend-shizuoka-maki','blend-kansai-ichi','blend-kyoto-kai','blend-kagoshima-tsuyu','blend-kagoshima-tsune'];
  const featured = FEATURED_IDS
    .map((id) => blends.find((p) => p.blend.id === id))
    .filter(Boolean);

  /* =====================================================================
     1 · CARD RACK (tarjetero)
     ===================================================================== */
  const rack = document.getElementById('rack');
  const rackCount = document.getElementById('rack-count');
  if (rack) {
    featured.forEach((p) => {
      const code = codeFor(p.blend);
      const img  = imageFor(p.blend);

      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'card';
      card.dataset.blendId = p.blend.id;
      card.setAttribute('role', 'listitem');
      card.setAttribute('aria-label', `${code} · ${p.blend.name} · ${p.region.name}`);

      card.innerHTML = `
        <div class="card__head">
          <span class="card__label">${code}</span>
          <span class="card__rule" aria-hidden="true"></span>
        </div>
        <div class="card__image">
          <img src="${img}" alt="" loading="lazy" />
        </div>
        <span class="card__sr">${p.blend.name} · ${p.region.name}</span>
      `;

      card.addEventListener('click', () => openBlend(p.blend.id));
      rack.appendChild(card);
    });

    if (rackCount) {
      const n = featured.length;
      rackCount.textContent = `${String(n).padStart(2, '0')} blends · 2026`;
    }
  }

  /* =====================================================================
     2 · INDEX (clickable rows → overlay)
     ===================================================================== */
  const idxEl = document.getElementById('catalog-index-list');
  if (idxEl) {
    const headRow = `
      <div class="catalog-index__head-row" style="display:contents;">
        <span>Nº</span>
        <span>Blend · Región</span>
        <span class="hide-sm">Variedades</span>
        <span>MOQ</span>
      </div>`;
    const rows = blends
      .map((p, i) => {
        const n = String(i + 1).padStart(2, '0');
        return `
          <a href="#" data-blend-id="${p.blend.id}">${n}</a>
          <a href="#" data-blend-id="${p.blend.id}" style="font-family:var(--font-sans); font-size:0.98rem; text-transform:none; letter-spacing:-0.005em; font-weight:500;">${p.blend.name} <span style="color:var(--gray-500); font-family:var(--font-mono); font-size:0.72rem; letter-spacing:0.12em; text-transform:uppercase; margin-left:0.75rem;">${p.region.name}</span></a>
          <span class="hide-sm" data-blend-id="${p.blend.id}">${p.blend.variedades}</span>
          <span data-blend-id="${p.blend.id}">${p.blend.moq}</span>`;
      })
      .join('');
    idxEl.innerHTML = headRow + rows;

    idxEl.addEventListener('click', (e) => {
      const el = e.target.closest('[data-blend-id]');
      if (!el) return;
      e.preventDefault();
      openBlend(el.dataset.blendId);
    });
  }

  /* =====================================================================
     3 · BLEND DETAIL OVERLAY
     ===================================================================== */
  const overlay = document.getElementById('blend-overlay');
  const overlayEls = {
    img:     document.getElementById('blend-overlay-img'),
    title:   document.getElementById('blend-overlay-title'),
    sub:     document.getElementById('blend-overlay-sub'),
    no:      document.getElementById('blend-overlay-no'),
    cosecha: document.getElementById('blend-overlay-cosecha'),
    notes:   document.getElementById('blend-overlay-notes'),
    specs:   document.getElementById('blend-overlay-specs'),
    pricing: document.getElementById('blend-overlay-pricing'),
    consult: document.getElementById('blend-overlay-consult'),
    wa:      document.getElementById('blend-overlay-wa'),
    closeBtn:document.getElementById('blend-overlay-close'),
  };

  function findBlend(id) {
    const idx = blends.findIndex((p) => p.blend.id === id);
    return idx === -1 ? null : { ...blends[idx], index: idx };
  }

  function openBlend(id) {
    const entry = findBlend(id);
    if (!entry || !overlay) return;

    const { region, blend, index } = entry;
    const n = String(index + 1).padStart(2, '0');
    const img = imageFor(blend, index);
    overlayEls.img.src = img;
    overlayEls.img.alt = `${blend.name} · ${region.name}`;
    overlayEls.title.textContent = blend.name;
    overlayEls.sub.textContent = `${region.name} · ${blend.proceso}`;
    overlayEls.no.textContent = `Nº ${n} · ${region.name}`;
    overlayEls.cosecha.textContent = blend.cosecha;
    overlayEls.notes.textContent = blend.notas;

    overlayEls.specs.innerHTML = `
      <div><dt>Variedades</dt><dd>${blend.variedades}</dd></div>
      <div><dt>Cosecha</dt><dd>${blend.cosecha}</dd></div>
      <div><dt>Proceso</dt><dd>${blend.proceso}</dd></div>
      <div><dt>Uso</dt><dd>${blend.uso}</dd></div>
    `;

    overlayEls.pricing.innerHTML = `
      <span>Disponibilidad · <strong>Consultar</strong></span>
      <span>MOQ · <strong>${blend.moq}</strong></span>
    `;

    const consultHref = `index.html?blend=${encodeURIComponent(blend.name)}&region=${encodeURIComponent(region.name)}#contacto`;
    overlayEls.consult.setAttribute('href', consultHref);

    const waText = encodeURIComponent(`Hola, consulta por "${blend.name}" (${region.name}).`);
    overlayEls.wa.setAttribute('href', `https://wa.me/${WHATSAPP_NUMBER}?text=${waText}`);

    // Open animation
    overlay.classList.add('is-open');
    overlay.setAttribute('aria-hidden', 'false');
    document.documentElement.classList.add('is-overlay-open');
    document.body.classList.add('is-overlay-open');

    // Shift focus to the close button after the unroll settles
    setTimeout(() => overlayEls.closeBtn && overlayEls.closeBtn.focus(), 480);
  }

  function closeBlend() {
    if (!overlay) return;
    overlay.classList.remove('is-open');
    overlay.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('is-overlay-open');
    document.body.classList.remove('is-overlay-open');
  }

  if (overlayEls.closeBtn) overlayEls.closeBtn.addEventListener('click', closeBlend);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && overlay && overlay.classList.contains('is-open')) {
      closeBlend();
    }
  });

  // Click on the sheet background (outside inner content) also closes
  if (overlay) {
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeBlend();
    });
  }

  /* =====================================================================
     4 · Deep-link support — ?blend=<id> opens overlay on load
     ===================================================================== */
  const urlParams = new URLSearchParams(window.location.search);
  const deepBlend = urlParams.get('blend');
  if (deepBlend) {
    // Allow deep link by id or by name
    const match = blends.find(
      (p) => p.blend.id === deepBlend || p.blend.name === deepBlend
    );
    if (match) {
      window.addEventListener('load', () => {
        setTimeout(() => openBlend(match.blend.id), 400);
      });
    }
  }
})();
