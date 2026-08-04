(() => {
  'use strict';

  const data = window.DEAD_DROP_DATA;
  const view = document.getElementById('view');
  const searchInput = document.getElementById('global-search');
  const searchPopover = document.getElementById('search-popover');
  const mobileButton = document.getElementById('mobile-menu-button');
  const mobileNav = document.getElementById('mobile-nav');
  const toast = document.getElementById('toast');
  const progressKey = 'dead-drop-progress-v2';
  const gameById = new Map();
  const mapById = new Map();
  const searchItems = [];
  let toastTimer = 0;

  if (!data || !Array.isArray(data.games)) {
    view.innerHTML = '<section class="empty-state"><h1>Archive unavailable</h1><p>The guide database did not load.</p></section>';
    return;
  }

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  data.games.forEach((game) => {
    gameById.set(game.id, game);
    searchItems.push({ label: game.title, meta: 'Game', hash: `#/game/${game.id}`, text: `${game.title} ${game.studio} ${game.description}`.toLowerCase() });
    game.maps.forEach((map) => {
      mapById.set(map.id, { game, map });
      searchItems.push({ label: map.name, meta: game.title, hash: `#/map/${map.id}`, text: `${map.name} ${game.title} ${map.description}`.toLowerCase() });
      map.mainQuests.forEach((quest) => searchItems.push({ label: quest.name, meta: `${map.name} main quest`, hash: `#/map/${map.id}#main-${quest.id}`, text: `${quest.name} ${quest.summary || ''} ${quest.steps.map((step) => `${step.title} ${step.body}`).join(' ')}`.toLowerCase() }));
      [...(map.requiredGuides || []), ...(map.optionalSideQuests || [])].forEach((quest) => searchItems.push({ label: quest.name, meta: `${map.name} guide`, hash: `#/map/${map.id}#guide-${slug(quest.name)}`, text: `${quest.name} ${quest.reward || ''} ${quest.steps.map((step) => `${step.title} ${step.body}`).join(' ')}`.toLowerCase() }));
    });
  });

  function slug(value = '') {
    return String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }

  function showToast(message) {
    clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2200);
  }

  function coverMarkup(game, className = 'cover-image') {
    const primary = escapeHtml(game.cover || game.coverFallback);
    const fallback = escapeHtml(game.coverFallback || game.cover);
    return `<img class="${className}" src="${primary}" data-fallback="${fallback}" alt="${escapeHtml(game.title)} cover art" loading="lazy">`;
  }

  function activateFallbacks(root = document) {
    root.querySelectorAll('img[data-fallback]').forEach((image) => {
      image.addEventListener('error', () => {
        const fallback = image.dataset.fallback;
        if (fallback && image.src !== new URL(fallback, location.href).href) image.src = fallback;
        else image.hidden = true;
      }, { once: true });
    });
  }

  function readProgress() {
    try { return JSON.parse(localStorage.getItem(progressKey) || '{}'); }
    catch { return {}; }
  }

  function writeProgress(progress) {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }

  function stepKey(mapId, questId, index) {
    return `${mapId}:${questId}:${index}`;
  }

  function sentences(body = '') {
    return String(body)
      .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
      .map((part) => part.trim())
      .filter(Boolean);
  }

  function renderHome() {
    document.title = 'Dead Drop — Call of Duty Zombies Guides';
    view.innerHTML = `
      <div class="page-shell home-page">
        <section class="hero">
          <p class="eyebrow">CALL OF DUTY ZOMBIES FIELD ARCHIVE</p>
          <h1>Choose the game.<br><span>Then run the map.</span></h1>
          <p>Real game covers, separated map guides, required main-quest preparation, optional Easter eggs, inline puzzle images, and trackable step-by-step routes.</p>
          <div class="archive-stats"><span><b>${data.stats.games}</b> games</span><span><b>${data.stats.maps}</b> maps</span><span><b>${data.stats.mainQuests}</b> main routes</span><span><b>${data.stats.sideQuests}</b> extra guides</span></div>
        </section>
        <section>
          <div class="section-heading"><div><p class="eyebrow">START HERE</p><h2>Games</h2></div><p>Select a title to open its maps and modes.</p></div>
          <div class="cover-grid">
            ${data.games.map((game) => {
              const main = game.maps.reduce((sum, map) => sum + map.mainQuests.length, 0);
              return `<a class="cover-card" href="#/game/${game.id}">
                <div class="cover-art">${coverMarkup(game)}</div>
                <div class="cover-info"><small>${escapeHtml(game.year)} · ${escapeHtml(game.mode)}</small><h3>${escapeHtml(game.title)}</h3><p>${game.maps.length} maps · ${main} main routes</p><span>Open game →</span></div>
              </a>`;
            }).join('')}
          </div>
        </section>
      </div>`;
    activateFallbacks(view);
  }

  function renderGame(game) {
    document.title = `${game.title} — Dead Drop`;
    view.innerHTML = `
      <div class="page-shell">
        <nav class="breadcrumbs"><a href="#/">Games</a><span>›</span><b>${escapeHtml(game.title)}</b></nav>
        <section class="game-header">
          <div class="game-header-cover">${coverMarkup(game, 'game-cover-large')}</div>
          <div><p class="eyebrow">${escapeHtml(game.studio)} · ${escapeHtml(game.year)}</p><h1>${escapeHtml(game.title)}</h1><p>${escapeHtml(game.description)}</p><div class="tag-row"><span>${game.maps.length} maps</span><span>${escapeHtml(game.mode)}</span></div></div>
        </section>
        <section>
          <div class="section-heading"><div><p class="eyebrow">MAP SELECT</p><h2>Maps and modes</h2></div><p>Open one map at a time. Main quests and optional content stay separated.</p></div>
          <div class="map-grid">
            ${game.maps.map((map) => `<a class="map-card" href="#/map/${map.id}"><div><small>${escapeHtml(map.release)} · ${escapeHtml(map.type)}</small><h3>${escapeHtml(map.name)}</h3><p>${escapeHtml(map.description)}</p></div><footer><span>${map.mainQuests.length ? `${map.mainQuests.length} main route${map.mainQuests.length > 1 ? 's' : ''}` : 'No story main quest'}</span><span>${(map.optionalSideQuests || []).length} optional</span><b>Open →</b></footer></a>`).join('')}
          </div>
        </section>
      </div>`;
    activateFallbacks(view);
  }

  function renderMap(game, map) {
    document.title = `${map.name} Guide — Dead Drop`;
    const required = map.requiredGuides || [];
    const optional = map.optionalSideQuests || [];
    const nav = [
      ['overview', 'Overview'],
      ...(map.requirements.length || required.length ? [['required', 'Required preparation']] : []),
      ...map.mainQuests.map((quest) => [`main-${quest.id}`, quest.name]),
      ...(optional.length ? [['optional', 'Optional Easter eggs']] : []),
      ...(map.visuals.length ? [['references', 'Puzzle references']] : []),
      ['sources', 'Sources']
    ];

    view.innerHTML = `
      <div class="page-shell map-page">
        <nav class="breadcrumbs"><a href="#/">Games</a><span>›</span><a href="#/game/${game.id}">${escapeHtml(game.title)}</a><span>›</span><b>${escapeHtml(map.name)}</b></nav>
        <header class="map-hero" id="overview"><p class="eyebrow">${escapeHtml(game.title)} · ${escapeHtml(map.type)}</p><h1>${escapeHtml(map.name)}</h1><p>${escapeHtml(map.description)}</p><div class="tag-row"><span>${escapeHtml(map.players)}</span><span>${escapeHtml(map.difficulty)}</span><span>${escapeHtml(map.time)}</span><span>${escapeHtml(map.status)}</span></div></header>
        <div class="guide-layout">
          <aside class="guide-sidebar"><p class="eyebrow">GUIDE INDEX</p>${nav.map(([id, label]) => `<a href="#${id}">${escapeHtml(label)}</a>`).join('')}</aside>
          <main class="guide-content">
            ${renderRequired(map, required)}
            ${map.mainQuests.length ? map.mainQuests.map((quest) => renderQuest(map, quest)).join('') : '<section class="guide-section"><div class="section-heading"><div><p class="eyebrow">MAIN QUEST</p><h2>No story main quest</h2></div></div><p>This map focuses on survival and optional secrets.</p></section>'}
            ${renderOptional(optional)}
            ${renderReferences(map.visuals)}
            ${renderSources(map.sources || [])}
          </main>
        </div>
      </div>`;

    bindProgress(map);
    bindAccordions();
    activateFallbacks(view);
    requestAnimationFrame(() => {
      const anchor = location.hash.split('#').slice(2).join('#');
      if (anchor) document.getElementById(anchor)?.scrollIntoView({ block: 'start' });
    });
  }

  function renderRequired(map, required) {
    if (!map.requirements.length && !required.length) return '';
    return `<section class="guide-section" id="required">
      <div class="section-heading"><div><p class="eyebrow">DO THIS BEFORE THE MAIN ROUTE</p><h2>Required preparation</h2></div><p>These are dependencies, not optional side Easter eggs.</p></div>
      <div class="requirement-grid">${map.requirements.map((item) => `<div class="requirement-item"><span>✓</span><p>${escapeHtml(item)}</p></div>`).join('')}</div>
      ${required.length ? `<div class="guide-list">${required.map((guide) => renderSubGuide(guide, true)).join('')}</div>` : ''}
    </section>`;
  }

  function renderQuest(map, quest) {
    const stored = readProgress();
    return `<section class="guide-section main-quest" id="main-${quest.id}">
      <div class="quest-heading"><div><p class="eyebrow">MAIN EASTER EGG · ${escapeHtml(quest.players || map.players)}</p><h2>${escapeHtml(quest.name)}</h2><p>${escapeHtml(quest.summary || '')}</p></div><div class="reward"><small>Completion</small><b>${escapeHtml(quest.reward || 'Quest complete')}</b></div></div>
      <div class="wiki-steps">
        ${quest.steps.map((step, index) => {
          const key = stepKey(map.id, quest.id, index);
          return `<article class="wiki-step" id="${quest.id}-step-${index + 1}">
            <div class="step-rail"><input type="checkbox" data-progress-key="${escapeHtml(key)}" ${stored[key] ? 'checked' : ''} aria-label="Mark step ${index + 1} complete"><span>${String(index + 1).padStart(2, '0')}</span></div>
            <div class="step-article">
              <p class="step-kicker">STEP ${String(index + 1).padStart(2, '0')} · ${escapeHtml(quest.name)}</p>
              <h3>${escapeHtml(step.title)}</h3>
              ${step.location ? `<div class="location-line"><b>Location</b><span>${escapeHtml(step.location)}</span></div>` : ''}
              <ol class="action-list">${sentences(step.body).map((sentence) => `<li>${escapeHtml(sentence)}</li>`).join('')}</ol>
              ${renderStepImages(step.images || [])}
              <div class="step-notes">
                ${step.code ? `<div class="note code"><b>Code / order</b><span>${escapeHtml(step.code)}</span></div>` : ''}
                ${step.tip ? `<div class="note tip"><b>Route tip</b><span>${escapeHtml(step.tip)}</span></div>` : ''}
                ${step.success ? `<div class="note success"><b>Success cue</b><span>${escapeHtml(step.success)}</span></div>` : ''}
                ${step.warning ? `<div class="note warning"><b>Common failure</b><span>${escapeHtml(step.warning)}</span></div>` : ''}
              </div>
            </div>
          </article>`;
        }).join('')}
      </div>
    </section>`;
  }

  function renderStepImages(images) {
    if (!images.length) return '';
    return `<div class="inline-visuals">${images.map((image) => `<figure><img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.title || 'Step reference')}" loading="lazy"><figcaption><b>${escapeHtml(image.title || 'Reference')}</b>${image.caption ? `<span>${escapeHtml(image.caption)}</span>` : ''}</figcaption></figure>`).join('')}</div>`;
  }

  function renderSubGuide(guide, required = false) {
    const id = `guide-${slug(guide.name)}`;
    return `<article class="subguide" id="${id}"><button class="subguide-toggle" aria-expanded="false"><span><small>${required ? 'REQUIRED FOR MAIN QUEST' : 'OPTIONAL SIDE EASTER EGG'}</small><b>${escapeHtml(guide.name)}</b></span><i>+</i></button><div class="subguide-body" hidden>${guide.reward ? `<p class="subguide-reward"><b>Reward:</b> ${escapeHtml(guide.reward)}</p>` : ''}<ol>${guide.steps.map((step) => `<li><h4>${escapeHtml(step.title || 'Step')}</h4><p>${escapeHtml(step.body)}</p>${step.code ? `<code>${escapeHtml(step.code)}</code>` : ''}</li>`).join('')}</ol></div></article>`;
  }

  function renderOptional(optional) {
    if (!optional.length) return '';
    return `<section class="guide-section" id="optional"><div class="section-heading"><div><p class="eyebrow">NOT REQUIRED FOR COMPLETION</p><h2>Optional side Easter eggs</h2></div><p>Open only the extra guide you need.</p></div><div class="guide-list">${optional.map((guide) => renderSubGuide(guide, false)).join('')}</div></section>`;
  }

  function renderReferences(visuals) {
    if (!visuals.length) return '';
    return `<section class="guide-section" id="references"><div class="section-heading"><div><p class="eyebrow">QUICK LOOKUP</p><h2>Puzzle references</h2></div><p>References that are not tied to one exact main-quest step.</p></div><div class="reference-grid">${visuals.map((visual) => visual.type === 'image' ? `<figure><img src="${escapeHtml(visual.src)}" alt="${escapeHtml(visual.title || 'Puzzle reference')}" loading="lazy"><figcaption><b>${escapeHtml(visual.title || 'Reference')}</b><span>${escapeHtml(visual.caption || '')}</span></figcaption></figure>` : `<article><h3>${escapeHtml(visual.title || 'Code')}</h3><div class="code-cells">${(visual.cells || []).map((cell) => `<code>${escapeHtml(cell)}</code>`).join('')}</div><p>${escapeHtml(visual.note || '')}</p></article>`).join('')}</div></section>`;
  }

  function renderSources(sources) {
    return `<section class="guide-section sources" id="sources"><div class="section-heading"><div><p class="eyebrow">VERIFICATION</p><h2>Sources</h2></div></div>${sources.length ? `<div class="source-list">${sources.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer"><b>${escapeHtml(source.title)}</b><span>${escapeHtml(source.note || 'Reference')}</span></a>`).join('')}</div>` : '<p>No source links are currently attached to this entry.</p>'}</section>`;
  }

  function bindProgress() {
    const boxes = [...view.querySelectorAll('[data-progress-key]')];
    boxes.forEach((box) => box.addEventListener('change', () => {
      const progress = readProgress();
      progress[box.dataset.progressKey] = box.checked;
      writeProgress(progress);
      showToast(box.checked ? 'Step completed' : 'Step reopened');
    }));
  }

  function bindAccordions() {
    view.querySelectorAll('.subguide-toggle').forEach((button) => button.addEventListener('click', () => {
      const body = button.nextElementSibling;
      const open = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!open));
      body.hidden = open;
      button.querySelector('i').textContent = open ? '+' : '−';
    }));
  }

  function renderTools() {
    document.title = 'Tools — Dead Drop';
    view.innerHTML = `<div class="page-shell"><section class="hero compact"><p class="eyebrow">FIELD TOOLS</p><h1>Puzzle quick references</h1><p>Use global search for any code, staff, map, boss, or quest step. Map pages place their most useful diagrams beside the steps they explain.</p></section></div>`;
  }

  function renderAccuracy() {
    document.title = 'Accuracy — Dead Drop';
    view.innerHTML = `<div class="page-shell"><section class="hero compact"><p class="eyebrow">VERIFICATION POLICY</p><h1>No vague completion claims.</h1><p>Required preparation is separated from optional side content. Steps expose locations, ordered actions, success cues, common failures, player requirements, and attached source links when the data contains them. Upcoming content remains disabled until public walkthroughs can be checked.</p></section></div>`;
  }

  function route() {
    const raw = location.hash.startsWith('#/') ? location.hash.slice(2) : '';
    const routePart = raw.split('#')[0];
    const parts = routePart.split('/').filter(Boolean);
    if (!parts.length) renderHome();
    else if (parts[0] === 'game' && gameById.has(parts[1])) renderGame(gameById.get(parts[1]));
    else if (parts[0] === 'map' && mapById.has(parts[1])) {
      const entry = mapById.get(parts[1]);
      renderMap(entry.game, entry.map);
    } else if (parts[0] === 'tools') renderTools();
    else if (parts[0] === 'accuracy') renderAccuracy();
    else renderHome();
    window.scrollTo({ top: 0, behavior: 'auto' });
  }

  function runSearch(query) {
    const value = query.trim().toLowerCase();
    if (!value) { searchPopover.hidden = true; return; }
    const results = searchItems.filter((item) => item.text.includes(value) || item.label.toLowerCase().includes(value)).slice(0, 10);
    searchPopover.innerHTML = results.length ? results.map((item) => `<a href="${item.hash}"><span><b>${escapeHtml(item.label)}</b><small>${escapeHtml(item.meta)}</small></span><i>↗</i></a>`).join('') : '<p>No matches</p>';
    searchPopover.hidden = false;
  }

  searchInput?.addEventListener('input', () => runSearch(searchInput.value));
  searchInput?.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') searchPopover.querySelector('a')?.click();
    if (event.key === 'Escape') { searchInput.value = ''; searchPopover.hidden = true; }
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === '/' && document.activeElement !== searchInput) { event.preventDefault(); searchInput?.focus(); }
  });
  document.addEventListener('click', (event) => {
    if (!event.target.closest('.header-search')) searchPopover.hidden = true;
  });
  mobileButton?.addEventListener('click', () => {
    const open = mobileButton.getAttribute('aria-expanded') === 'true';
    mobileButton.setAttribute('aria-expanded', String(!open));
    mobileNav.hidden = open;
  });
  mobileNav?.addEventListener('click', () => { mobileNav.hidden = true; mobileButton.setAttribute('aria-expanded', 'false'); });
  window.addEventListener('hashchange', route);
  route();
})();
