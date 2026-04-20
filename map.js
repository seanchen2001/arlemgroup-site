/* =====================================================================
   Kura Matcha — Japan prefecture map (D3 + TopoJSON)
   Data: https://raw.githubusercontent.com/dataofjapan/land/master/japan.topojson
   ===================================================================== */

(function () {
  const TOPO_URL = 'https://raw.githubusercontent.com/dataofjapan/land/master/japan.topojson';

  const stage = document.getElementById('map-stage');
  if (!stage) return;

  const svgEl = document.getElementById('map-svg');
  const loadingEl = document.getElementById('map-loading');
  const panelEl = document.getElementById('blend-panel');
  const panelBodyEl = document.getElementById('panel-body');
  const panelEmptyEl = document.getElementById('panel-empty');
  const panelCloseEl = document.getElementById('panel-close');
  const tooltipEl = document.getElementById('map-tooltip');

  const regions = window.REGIONS || [];

  // Build prefecture → region lookup.
  const normalize = (s) => (s || '').toLowerCase().replace(/\s+(fu|ken|to|do)$/, '').trim();
  const prefToRegion = new Map();
  regions.forEach((r) => {
    r.prefectures.forEach((p) => prefToRegion.set(normalize(p), r));
  });

  let activeRegionId = null;
  let openBlendId = null;

  function closePanel() {
    activeRegionId = null;
    openBlendId = null;
    panelEl.classList.remove('is-active');
    panelBodyEl.innerHTML = '';
    panelEmptyEl.style.display = '';
    d3.selectAll('.prefecture.is-selected').classed('is-selected', false);
  }

  panelCloseEl.addEventListener('click', closePanel);

  function renderPanel(region) {
    if (!region) return;
    activeRegionId = region.id;
    panelEmptyEl.style.display = 'none';
    panelEl.classList.add('is-active');

    const blendsHtml = region.blends
      .map((b) => {
        const priceLine = b.price ? `USD ${b.price} / kg` : 'Precio a consultar';
        return `
          <div class="blend-row" data-blend="${b.id}">
            <button class="blend-row__trigger" type="button" data-toggle="${b.id}">
              <span class="blend-row__name">${b.name}</span>
              <span class="blend-row__chev">↓</span>
            </button>
            <div class="blend-row__detail">
              <div class="blend-row__detail-inner">
                <div class="blend-card">
                  <dl class="blend-card__grid">
                    <div class="blend-card__cell"><dt>Variedades</dt><dd>${b.variedades}</dd></div>
                    <div class="blend-card__cell"><dt>Cosecha</dt><dd>${b.cosecha}</dd></div>
                    <div class="blend-card__cell"><dt>Proceso</dt><dd>${b.proceso}</dd></div>
                    <div class="blend-card__cell"><dt>Uso</dt><dd>${b.uso}</dd></div>
                  </dl>
                  <div class="blend-card__notes">
                    <div class="blend-card__notes-label">Perfil · Notas</div>
                    <div class="blend-card__notes-text">${b.notas}</div>
                  </div>
                  <div class="blend-card__meta">
                    <span>Precio · <strong>${priceLine}</strong></span>
                    <span>MOQ · <strong>${b.moq}</strong></span>
                  </div>
                  <button type="button" class="btn btn--ghost-dark blend-card__cta"
                          data-consult="${b.id}"
                          data-consult-name="${b.name}"
                          data-consult-region="${region.name}">
                    <span class="btn__label">Consultar este blend</span>
                    <span class="btn__arrow">→</span>
                  </button>
                </div>
              </div>
            </div>
          </div>`;
      })
      .join('');

    panelBodyEl.innerHTML = `
      <div class="panel__region"><strong>Región</strong> ${region.name}</div>
      <h3 class="panel__heading">${region.name}</h3>
      <div class="panel__rule"></div>
      <div class="panel__intro mono-label" style="margin-bottom:1.5rem; color:var(--gray-700); font-family:var(--font-sans); text-transform:none; font-size:0.98rem; letter-spacing:0; line-height:1.5;">${region.headline}</div>
      <div class="panel__blends">${blendsHtml}</div>
    `;

    panelBodyEl.querySelectorAll('[data-toggle]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-toggle');
        const rows = panelBodyEl.querySelectorAll('.blend-row');
        rows.forEach((r) => {
          if (r.getAttribute('data-blend') === id) {
            const already = r.classList.contains('is-open');
            r.classList.toggle('is-open', !already);
            openBlendId = already ? null : id;
          } else {
            r.classList.remove('is-open');
          }
        });
      });
    });

    panelBodyEl.querySelectorAll('[data-consult]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const name = btn.getAttribute('data-consult-name');
        const regionName = btn.getAttribute('data-consult-region');
        if (window.KURA_MATCHA && window.KURA_MATCHA.prefillContact) {
          window.KURA_MATCHA.prefillContact(name, regionName);
        }
      });
    });

    if (window.KURA_MATCHA && typeof window.KURA_MATCHA.animatePanelOpen === 'function') {
      window.KURA_MATCHA.animatePanelOpen(panelBodyEl);
    }
  }

  function hideTooltip() {
    tooltipEl.classList.remove('is-visible');
  }

  function showTooltip(text, x, y) {
    tooltipEl.textContent = text;
    tooltipEl.style.left = x + 'px';
    tooltipEl.style.top = y + 'px';
    tooltipEl.classList.add('is-visible');
  }

  const width = stage.clientWidth || 800;
  const height = stage.clientHeight || 640;

  const svg = d3.select(svgEl)
    .attr('viewBox', `0 0 ${width} ${height}`)
    .attr('preserveAspectRatio', 'xMidYMid meet');

  const g = svg.append('g');

  function render(features) {
    const projection = d3.geoMercator().fitSize([width * 0.92, height * 0.92], { type: 'FeatureCollection', features });
    const path = d3.geoPath(projection);

    // Center the map in the viewBox.
    const bbox = d3.geoPath(projection).bounds({ type: 'FeatureCollection', features });
    const dx = (width - (bbox[1][0] - bbox[0][0])) / 2 - bbox[0][0];
    const dy = (height - (bbox[1][1] - bbox[0][1])) / 2 - bbox[0][1];
    g.attr('transform', `translate(${dx}, ${dy})`);

    g.selectAll('path.prefecture')
      .data(features)
      .join('path')
      .attr('class', (d) => {
        const nm = normalize(d.properties.nam || d.properties.name || d.properties.NAME_1 || '');
        return 'prefecture ' + (prefToRegion.has(nm) ? 'is-active' : 'is-inactive');
      })
      .attr('d', path)
      .on('mousemove', function (event, d) {
        const nm = d.properties.nam || d.properties.name || '';
        const region = prefToRegion.get(normalize(nm));
        const label = region ? region.name : nm;
        showTooltip(label, event.clientX, event.clientY);
      })
      .on('mouseleave', hideTooltip)
      .on('click', function (event, d) {
        const nm = d.properties.nam || d.properties.name || '';
        const region = prefToRegion.get(normalize(nm));
        if (!region) return;

        d3.selectAll('.prefecture.is-selected').classed('is-selected', false);

        g.selectAll('path.prefecture').each(function (feat) {
          const featName = normalize(feat.properties.nam || feat.properties.name || '');
          const r = prefToRegion.get(featName);
          if (r && r.id === region.id) {
            d3.select(this).classed('is-selected', true);
          }
        });

        if (activeRegionId !== region.id) {
          renderPanel(region);
          if (window.innerWidth < 900) {
            setTimeout(() => {
              panelEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 150);
          }
        }
      });

    loadingEl.classList.add('is-hidden');
  }

  function renderError(msg) {
    loadingEl.textContent = msg;
    loadingEl.style.color = 'var(--ink)';
  }

  d3.json(TOPO_URL)
    .then((topo) => {
      if (!topo || !topo.objects) {
        renderError('Mapa no disponible');
        return;
      }
      const objectKey = Object.keys(topo.objects)[0];
      const geo = topojson.feature(topo, topo.objects[objectKey]);
      const features = geo.features || [];
      if (!features.length) {
        renderError('Sin datos de prefecturas');
        return;
      }
      render(features);
    })
    .catch(() => {
      renderError('Mapa no disponible · revise conexión');
    });

  // Handle resize.
  let resizeT;
  window.addEventListener('resize', () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(() => {
      const w = stage.clientWidth || width;
      const h = stage.clientHeight || height;
      svg.attr('viewBox', `0 0 ${w} ${h}`);
    }, 200);
  });
})();
