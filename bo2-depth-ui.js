(() => {
  'use strict';

  const data = window.DEAD_DROP_DATA;
  if (!data?.games) return;

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const slug = (value = '') => String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const splitActions = (body = '') => String(body)
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((part) => part.trim())
    .filter(Boolean);

  function currentMap() {
    const match = location.hash.match(/^#\/map\/([^#]+)/);
    if (!match) return null;
    for (const game of data.games) {
      const map = (game.maps || []).find((entry) => entry.id === match[1]);
      if (map) return map;
    }
    return null;
  }

  function renderImages(images = []) {
    if (!images.length) return '';
    return `<div class="depth-inline-images">${images.map((image) => `
      <figure>
        <div class="depth-media-label">${escapeHtml(image.mediaKind || 'Gameplay reference')}</div>
        <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.title || 'Guide reference')}" loading="lazy">
        <figcaption><b>${escapeHtml(image.title || 'Reference')}</b>${image.caption ? `<span>${escapeHtml(image.caption)}</span>` : ''}${image.creditUrl ? `<a href="${escapeHtml(image.creditUrl)}" target="_blank" rel="noopener noreferrer">Open original source page ↗</a>` : ''}</figcaption>
      </figure>`).join('')}</div>`;
  }

  function renderReferences(references = []) {
    if (!references.length) return '';
    return `<div class="depth-text-references">${references.map((reference) => `
      <section class="depth-text-reference">
        <header><p>SEARCHABLE QUICK REFERENCE</p><h5>${escapeHtml(reference.title || 'Reference')}</h5></header>
        <dl>${(reference.rows || []).map((entry) => `
          <div><dt>${escapeHtml(entry.label || '')}</dt><dd>${escapeHtml(entry.value || '')}</dd></div>`).join('')}</dl>
        ${reference.note ? `<p class="depth-reference-note">${escapeHtml(reference.note)}</p>` : ''}
      </section>`).join('')}</div>`;
  }

  function renderSourceLink(step) {
    if (!step?.sourceUrl) return '';
    return `<a class="depth-source-link" href="${escapeHtml(step.sourceUrl)}" target="_blank" rel="noopener noreferrer"><span>${escapeHtml(step.sourceLabel || 'Open source walkthrough')}</span><b>↗</b></a>`;
  }

  function renderGuideBody(guide) {
    return `
      ${guide.reward ? `<p class="depth-guide-reward"><b>Reward / purpose</b><span>${escapeHtml(guide.reward)}</span></p>` : ''}
      ${guide.intro ? `<p class="depth-guide-intro">${escapeHtml(guide.intro)}</p>` : ''}
      <div class="depth-substeps">
        ${(guide.steps || []).map((step, index) => `
          <article class="depth-substep">
            <div class="depth-step-number">${String(index + 1).padStart(2, '0')}</div>
            <div class="depth-step-copy">
              <p class="depth-step-kicker">${escapeHtml(step.label || `STEP ${index + 1}`)}</p>
              <h4>${escapeHtml(step.title || `Step ${index + 1}`)}</h4>
              ${step.location ? `<div class="depth-location"><b>Exact location</b><span>${escapeHtml(step.location)}</span></div>` : ''}
              <ol>${splitActions(step.body).map((action) => `<li>${escapeHtml(action)}</li>`).join('')}</ol>
              ${renderReferences(step.references || [])}
              ${renderImages(step.images || [])}
              <div class="depth-notes">
                ${step.code ? `<div class="depth-note code"><b>Code / order</b><span>${escapeHtml(step.code)}</span></div>` : ''}
                ${step.tip ? `<div class="depth-note tip"><b>Beginner tip</b><span>${escapeHtml(step.tip)}</span></div>` : ''}
                ${step.success || step.cue ? `<div class="depth-note success"><b>Success cue</b><span>${escapeHtml(step.success || step.cue)}</span></div>` : ''}
                ${step.warning ? `<div class="depth-note warning"><b>Common failure</b><span>${escapeHtml(step.warning)}</span></div>` : ''}
                ${step.version ? `<div class="depth-note version"><b>Version note</b><span>${escapeHtml(step.version)}</span></div>` : ''}
              </div>
              ${renderSourceLink(step)}
            </div>
          </article>`).join('')}
      </div>`;
  }

  function addSoloMod(map, content) {
    if (!map.soloMod || content.querySelector('.bo2-solo-mod')) return;
    const card = document.createElement('section');
    card.className = 'bo2-solo-mod';
    card.innerHTML = `
      <div><p class="eyebrow">PLAYER-COUNT OPTION</p><h2>${escapeHtml(map.soloMod.title || 'Community solo / any-player mod')}</h2></div>
      <p>${escapeHtml(map.soloMod.description || '')}</p>
      <div class="solo-mod-links">
        ${map.soloMod.downloadUrl ? `<a class="button primary" href="${escapeHtml(map.soloMod.downloadUrl)}" target="_blank" rel="noopener noreferrer">Download from source ↗</a>` : ''}
        ${map.soloMod.guideUrl ? `<a class="button" href="${escapeHtml(map.soloMod.guideUrl)}" target="_blank" rel="noopener noreferrer">Installation / release thread ↗</a>` : ''}
      </div>
      <p class="solo-mod-warning"><b>Community mod.</b> Use only with Plutonium/private Zombies. Verify the repository or forum source before running files. Every player in the lobby should use the same scripts.</p>`;
    content.prepend(card);
  }

  function enhanceMainQuestSteps(map) {
    for (const quest of map.mainQuests || []) {
      (quest.steps || []).forEach((step, index) => {
        const article = document.getElementById(`${quest.id}-step-${index + 1}`);
        const copy = article?.querySelector('.step-article');
        if (!copy || copy.dataset.sourceMediaEnhanced === 'true') return;

        const notes = copy.querySelector('.step-notes');
        const extra = document.createElement('div');
        extra.className = 'bo2-main-step-extra';
        extra.innerHTML = `${renderReferences(step.references || [])}${renderSourceLink(step)}`;
        if (extra.textContent.trim()) {
          if (notes) copy.insertBefore(extra, notes);
          else copy.append(extra);
        }
        copy.dataset.sourceMediaEnhanced = 'true';
      });
    }
  }

  function addSourcePolicy(map, content) {
    if (content.querySelector('.bo2-media-policy')) return;
    const card = document.createElement('aside');
    card.className = 'bo2-media-policy';
    card.innerHTML = `<b>Media and text policy</b><span>${escapeHtml(map.mediaPolicy || 'Source-linked gameplay media and searchable text references.')}</span>${map.sourceGuideIndex ? `<a href="${escapeHtml(map.sourceGuideIndex)}" target="_blank" rel="noopener noreferrer">Open complete source guide index ↗</a>` : ''}`;
    content.prepend(card);
  }

  function enhance() {
    const map = currentMap();
    if (!map || !map.id.startsWith('black-ops-2-')) return;
    const content = document.querySelector('.guide-content');
    if (!content) return;

    addSoloMod(map, content);
    addSourcePolicy(map, content);
    enhanceMainQuestSteps(map);

    const guides = [...(map.requiredGuides || []), ...(map.optionalSideQuests || [])];
    for (const guide of guides) {
      const article = document.getElementById(`guide-${slug(guide.name)}`);
      if (!article || article.dataset.depthEnhanced === 'true') continue;
      const body = article.querySelector('.subguide-body');
      if (!body) continue;
      body.innerHTML = renderGuideBody(guide);
      article.dataset.depthEnhanced = 'true';
    }

    document.querySelectorAll('.depth-inline-images img').forEach((image) => {
      if (image.dataset.errorBound === 'true') return;
      image.dataset.errorBound = 'true';
      image.addEventListener('error', () => {
        image.closest('figure')?.classList.add('image-failed');
      }, { once: true });
    });
  }

  const observer = new MutationObserver(() => requestAnimationFrame(enhance));
  observer.observe(document.getElementById('view'), { childList: true, subtree: true });
  window.addEventListener('hashchange', () => requestAnimationFrame(enhance));
  requestAnimationFrame(enhance);
})();