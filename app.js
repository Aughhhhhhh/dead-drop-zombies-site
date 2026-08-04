(() => {
  'use strict';

  const data = window.DEAD_DROP_DATA;
  const view = document.getElementById('view');
  const searchInput = document.getElementById('global-search');
  const searchPopover = document.getElementById('search-popover');
  const routeProgress = document.getElementById('route-progress');
  const mobileMenuButton = document.getElementById('mobile-menu-button');
  const mobileNav = document.getElementById('mobile-nav');
  const toast = document.getElementById('toast');
  const imageModal = document.getElementById('image-modal');
  const imageModalImage = imageModal.querySelector('img');
  const imageModalCaption = imageModal.querySelector('p');
  const correctionButton = document.getElementById('copy-correction');

  if (!data || !Array.isArray(data.games)) {
    view.innerHTML = '<section class="page-shell not-found"><strong>!</strong><h1>Archive unavailable</h1><p>The guide database did not load. Refresh the page to retry.</p></section>';
    return;
  }

  const gameById = new Map();
  const mapById = new Map();
  const searchIndex = [];
  const progressKey = 'dead-drop-progress-v1';
  let homeFilter = 'all';
  let searchSelection = -1;
  let toastTimer = 0;

  data.games.forEach((game) => {
    gameById.set(game.id, game);
    searchIndex.push({ type: 'Game', title: game.title, subtitle: `${game.year} · ${game.maps.length} map entries`, hash: `#/game/${game.id}`, haystack: `${game.title} ${game.studio} ${game.mode} ${game.description}`.toLowerCase() });
    game.maps.forEach((map) => {
      mapById.set(map.id, { game, map });
      searchIndex.push({ type: 'Map', title: map.name, subtitle: `${game.title} · ${map.type}`, hash: `#/map/${map.id}`, haystack: `${map.name} ${game.title} ${map.type} ${map.description} ${map.requirements.join(' ')}`.toLowerCase() });
      map.mainQuests.forEach((quest) => {
        searchIndex.push({ type: 'Main quest', title: quest.name, subtitle: `${map.name} · ${game.title}`, hash: `#/map/${map.id}#quest-${quest.id}`, haystack: `${quest.name} ${quest.summary || ''} ${quest.reward || ''} ${quest.steps.map((step) => `${step.title} ${step.body} ${step.code || ''}`).join(' ')}`.toLowerCase() });
      });
      map.sideQuests.forEach((quest, index) => {
        searchIndex.push({ type: 'Side quest', title: quest.name, subtitle: `${map.name} · ${game.title}`, hash: `#/map/${map.id}#side-${index + 1}`, haystack: `${quest.name} ${quest.summary || ''} ${quest.reward || ''} ${quest.steps.map((step) => `${step.title} ${step.body} ${step.code || ''}`).join(' ')}`.toLowerCase() });
      });
    });
  });

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const clamp = (number, min, max) => Math.min(Math.max(number, min), max);

  function titleCaseStatus(status = 'verified') {
    return status === 'current' ? 'Current' : status === 'upcoming' ? 'Upcoming' : 'Source checked';
  }

  function showToast(message) {
    window.clearTimeout(toastTimer);
    toast.textContent = message;
    toast.classList.add('show');
    toastTimer = window.setTimeout(() => toast.classList.remove('show'), 2300);
  }

  async function copyText(text, successMessage = 'Copied') {
    try {
      await navigator.clipboard.writeText(text);
      showToast(successMessage);
    } catch {
      const area = document.createElement('textarea');
      area.value = text;
      area.style.position = 'fixed';
      area.style.opacity = '0';
      document.body.appendChild(area);
      area.select();
      document.execCommand('copy');
      area.remove();
      showToast(successMessage);
    }
  }

  function readProgress() {
    try {
      return JSON.parse(localStorage.getItem(progressKey) || '{}');
    } catch {
      return {};
    }
  }

  function writeProgress(progress) {
    localStorage.setItem(progressKey, JSON.stringify(progress));
  }

  function getStepKey(mapId, questId, index) {
    return `${mapId}:${questId}:${index}`;
  }

  function getMapProgress(map) {
    const stored = readProgress();
    const keys = [];
    map.mainQuests.forEach((quest) => quest.steps.forEach((_, index) => keys.push(getStepKey(map.id, quest.id, index))));
    const complete = keys.filter((key) => stored[key]).length;
    return { complete, total: keys.length, percent: keys.length ? Math.round((complete / keys.length) * 100) : 0 };
  }

  function imageMarkup(game, className = 'game-cover', eager = false) {
    const primary = escapeHtml(game.cover || game.coverFallback);
    const fallback = escapeHtml(game.coverFallback || game.cover);
    return `<img class="${className}" src="${primary}" data-fallback="${fallback}" alt="${escapeHtml(game.title)} cover artwork" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}>`;
  }

  function activateImageFallbacks(root = document) {
    root.querySelectorAll('img[data-fallback]').forEach((image) => {
      const fallback = image.dataset.fallback;
      const handleError = () => {
        if (fallback && image.src !== new URL(fallback, location.href).href) {
          image.src = fallback;
        } else {
          image.hidden = true;
        }
      };
      image.addEventListener('error', handleError, { once: true });
      if (image.complete && image.naturalWidth === 0) handleError();
    });
  }

  function setDocumentTitle(title) {
    document.title = title ? `${title} — Dead Drop` : 'Dead Drop — Call of Duty Zombies Guides';
  }

  function setAccent(accent = '#d65336') {
    document.documentElement.style.setProperty('--accent', accent);
  }

  function scrollToTopOrAnchor(anchor) {
    requestAnimationFrame(() => {
      if (anchor) {
        const target = document.getElementById(anchor);
        if (target) {
          target.scrollIntoView({ block: 'start' });
          target.focus?.({ preventScroll: true });
          return;
        }
      }
      window.scrollTo({ top: 0, behavior: 'auto' });
      view.focus({ preventScroll: true });
    });
  }

  function startRouteTransition() {
    routeProgress.style.transition = 'none';
    routeProgress.style.width = '16%';
    requestAnimationFrame(() => {
      routeProgress.style.transition = 'width .22s ease';
      routeProgress.style.width = '72%';
    });
  }

  function finishRouteTransition() {
    routeProgress.style.width = '100%';
    window.setTimeout(() => {
      routeProgress.style.transition = 'opacity .18s ease';
      routeProgress.style.opacity = '0';
      window.setTimeout(() => {
        routeProgress.style.width = '0';
        routeProgress.style.opacity = '1';
        routeProgress.style.transition = 'width .15s ease';
      }, 200);
    }, 100);
  }

  function renderHome() {
    setDocumentTitle('Call of Duty Zombies Guide Archive');
    setAccent('#d65336');

    view.innerHTML = `
      <div class="page-shell">
        <section class="home-hero">
          <div class="hero-grid">
            <div class="hero-intro">
              <p class="eyebrow">GAME-FIRST ZOMBIES FIELD ARCHIVE</p>
              <h1 class="display-title">CHOOSE A GAME.<br><span>RUN THE QUEST.</span></h1>
              <p class="section-copy">Select a Call of Duty title, open its map list, then follow the main Easter egg, alternate branches, side quests, puzzle codes, boss preparation, completion cues, and useful visual references.</p>
              <div class="hero-actions">
                <a class="button primary" href="#games">Browse all games</a>
                <a class="button" href="#/tools">Open puzzle tools</a>
              </div>
            </div>
            <div class="hero-stats" aria-label="Archive statistics">
              <div class="hero-stat"><strong>${data.stats.games}</strong><span>Games and modes</span></div>
              <div class="hero-stat"><strong>${data.stats.maps}</strong><span>Map entries</span></div>
              <div class="hero-stat"><strong>${data.stats.mainQuests}</strong><span>Main routes</span></div>
              <div class="hero-stat"><strong>${data.stats.sideQuests}</strong><span>Side quests</span></div>
            </div>
          </div>
        </section>

        <section class="archive-section" id="games">
          <div class="section-header">
            <div><p class="eyebrow">THE ARCHIVE</p><h2 class="section-title">ALL GAMES</h2></div>
            <p class="section-copy">The landing page contains games only. Open a title to see its maps, then open a map to enter the full guide.</p>
          </div>
          <div class="filter-row" role="group" aria-label="Filter games">
            ${[
              ['all', 'All'],
              ['treyarch', 'Treyarch'],
              ['other', 'Other studios'],
              ['classic', 'Classic era'],
              ['modern', 'Modern era'],
              ['alternate', 'Alternate modes']
            ].map(([id, label]) => `<button class="filter-chip ${homeFilter === id ? 'active' : ''}" data-filter="${id}">${label}</button>`).join('')}
          </div>
          <div class="game-grid" id="game-grid">${renderGameCards(filteredGames(homeFilter))}</div>
        </section>
      </div>`;

    view.querySelectorAll('[data-filter]').forEach((button) => {
      button.addEventListener('click', () => {
        homeFilter = button.dataset.filter;
        view.querySelectorAll('[data-filter]').forEach((item) => item.classList.toggle('active', item === button));
        view.querySelector('#game-grid').innerHTML = renderGameCards(filteredGames(homeFilter));
        activateImageFallbacks(view.querySelector('#game-grid'));
      });
    });
    activateImageFallbacks(view);
  }

  function filteredGames(filter) {
    if (filter === 'treyarch') return data.games.filter((game) => /treyarch/i.test(game.studio));
    if (filter === 'other') return data.games.filter((game) => !/treyarch/i.test(game.studio));
    if (filter === 'classic') return data.games.filter((game) => Number(game.year) <= 2015);
    if (filter === 'modern') return data.games.filter((game) => Number(game.year) >= 2018);
    if (filter === 'alternate') return data.games.filter((game) => game.mode !== 'Zombies' || /Extinction|MWZ|Exo/i.test(`${game.title} ${game.mode}`));
    return data.games;
  }

  function renderGameCards(games) {
    if (!games.length) return '<div class="not-found"><h1>No games matched</h1><p>Choose another archive filter.</p></div>';
    return games.map((game) => {
      const mainCount = game.maps.reduce((sum, map) => sum + map.mainQuests.length, 0);
      const sideCount = game.maps.reduce((sum, map) => sum + map.sideQuests.length, 0);
      return `
        <a class="game-card" href="#/game/${game.id}" style="--game-accent:${escapeHtml(game.accent)}">
          <div class="game-cover-fallback" aria-hidden="true"></div>
          ${imageMarkup(game)}
          <div class="game-card-content">
            <div class="game-year"><span>${escapeHtml(game.year)}</span><span>${escapeHtml(game.mode)}</span></div>
            <h3 class="game-title">${escapeHtml(game.title)}</h3>
            <div class="game-meta"><span>${game.maps.length} map${game.maps.length === 1 ? '' : 's'}</span><span>${mainCount} main route${mainCount === 1 ? '' : 's'}</span><span>${sideCount} side quests</span></div>
            <span class="game-arrow">Open game</span>
          </div>
        </a>`;
    }).join('');
  }

  function renderGame(game) {
    setDocumentTitle(game.title);
    setAccent(game.accent);
    const mainCount = game.maps.reduce((sum, map) => sum + map.mainQuests.length, 0);
    const sideCount = game.maps.reduce((sum, map) => sum + map.sideQuests.length, 0);
    const verified = game.maps.filter((map) => map.status === 'verified').length;

    view.innerHTML = `
      <div class="page-shell">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#/">Games</a><i>›</i><span>${escapeHtml(game.title)}</span></nav>
        <section class="game-hero" style="--game-accent:${escapeHtml(game.accent)}">
          <div class="game-cover-fallback" aria-hidden="true"></div>
          ${imageMarkup(game, 'game-hero-image', true)}
          <div class="game-hero-content">
            <p class="eyebrow">${escapeHtml(game.studio)} · ${escapeHtml(game.year)}</p>
            <h1>${escapeHtml(game.title)}</h1>
            <p>${escapeHtml(game.description)}</p>
          </div>
        </section>
        <div class="game-summary-bar">
          <div class="summary-cell"><small>Map entries</small><strong>${game.maps.length}</strong></div>
          <div class="summary-cell"><small>Main routes</small><strong>${mainCount}</strong></div>
          <div class="summary-cell"><small>Side quests</small><strong>${sideCount}</strong></div>
          <div class="summary-cell"><small>Archive status</small><strong>${verified === game.maps.length ? 'Checked' : 'Current'}</strong></div>
        </div>
        <section>
          <div class="section-header">
            <div><p class="eyebrow">${escapeHtml(game.mode)}</p><h2 class="section-title">MAPS & MODES</h2></div>
            <p class="section-copy">Open a card for full main-quest steps, alternate paths, side Easter eggs, requirements, visual references, and source links.</p>
          </div>
          <div class="map-grid">
            ${game.maps.map((map) => renderMapCard(game, map)).join('')}
          </div>
        </section>
      </div>`;
    activateImageFallbacks(view);
  }

  function renderMapCard(game, map) {
    const status = map.status || 'verified';
    const mainLabel = map.mainQuests.length ? `${map.mainQuests.length} main` : 'No story main';
    return `
      <a class="map-card" href="#/map/${map.id}" style="--map-tone:${escapeHtml(map.tone)};--map-accent:${escapeHtml(map.accent)}">
        <div class="map-card-top">
          <div class="map-card-badges"><span class="badge ${escapeHtml(status)}">${titleCaseStatus(status)}</span><span class="badge">${escapeHtml(map.type)}</span></div>
          <h3>${escapeHtml(map.name)}</h3>
          <p>${escapeHtml(map.description)}</p>
        </div>
        <div class="map-card-bottom">
          <div class="map-card-stat"><small>Guide coverage</small><strong>${mainLabel} · ${map.sideQuests.length} side</strong></div>
          <span class="map-card-open" aria-hidden="true">↗</span>
        </div>
      </a>`;
  }

  function renderMap(game, map) {
    setDocumentTitle(`${map.name} Guide`);
    setAccent(game.accent);
    const firstQuest = map.mainQuests[0];
    const questLabel = firstQuest ? firstQuest.name : map.status === 'upcoming' ? 'Guide opens after verified public release' : 'Side quests, secrets, and survival reference';
    const progress = getMapProgress(map);
    const mainSteps = map.mainQuests.reduce((sum, quest) => sum + quest.steps.length, 0);

    const navLinks = [
      ['briefing', 'Briefing', '00'],
      ...map.mainQuests.map((quest, index) => [`quest-${quest.id}`, quest.name, String(index + 1).padStart(2, '0')]),
      ...(map.sideQuests.length ? [['side-quests', 'Side quests', 'S']] : []),
      ...(map.visuals.length ? [['references', 'Puzzle references', 'R']] : []),
      ['sources', 'Sources', '✓']
    ];

    view.innerHTML = `
      <div class="page-shell">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#/">Games</a><i>›</i><a href="#/game/${game.id}">${escapeHtml(game.title)}</a><i>›</i><span>${escapeHtml(map.name)}</span></nav>
        <section class="map-hero" style="--map-tone:${escapeHtml(map.tone)};--map-accent:${escapeHtml(map.accent)}">
          <div class="map-hero-content">
            <p class="eyebrow">${escapeHtml(game.title)} · ${escapeHtml(map.type)}</p>
            <h1>${escapeHtml(map.name)}</h1>
            <p class="quest-name">${escapeHtml(questLabel)}</p>
            <p class="map-description">${escapeHtml(map.description)}</p>
            <div class="map-meta-row">
              <div class="map-meta-pill"><small>Players</small><strong>${escapeHtml(map.players)}</strong></div>
              <div class="map-meta-pill"><small>Difficulty</small><strong>${escapeHtml(map.difficulty)}</strong></div>
              <div class="map-meta-pill"><small>Expected time</small><strong>${escapeHtml(map.time)}</strong></div>
              <div class="map-meta-pill"><small>Released</small><strong>${escapeHtml(map.release || game.year)}</strong></div>
              <div class="map-meta-pill"><small>Coverage</small><strong>${mainSteps} main steps</strong></div>
            </div>
            <div class="map-action-row">
              <button class="button primary" id="copy-guide-link">Copy guide link</button>
              <button class="button" id="print-guide">Print / save PDF</button>
              ${map.mainQuests.length ? `<a class="button accent" href="#/map/${map.id}#briefing">Start guide</a>` : ''}
            </div>
          </div>
        </section>

        <div class="guide-layout">
          <aside class="guide-sidebar" aria-label="Guide navigation">
            <nav class="guide-nav"><div class="guide-nav-title">Guide index</div>${navLinks.map(([id, label, marker]) => `<a href="#/map/${map.id}#${id}"><span>${escapeHtml(marker)}</span>${escapeHtml(label)}</a>`).join('')}</nav>
            ${map.mainQuests.length ? `<div class="progress-card"><div class="progress-head"><strong>Run progress</strong><span id="progress-label">${progress.complete}/${progress.total}</span></div><div class="progress-track"><i id="progress-fill" style="width:${progress.percent}%"></i></div><button id="reset-progress">Reset this map</button></div>` : ''}
          </aside>

          <div class="guide-content">
            ${renderBriefing(game, map)}
            ${map.mainQuests.length ? map.mainQuests.map((quest, questIndex) => renderMainQuest(map, quest, questIndex)).join('') : renderNoMainQuest(map)}
            ${map.sideQuests.length ? renderSideQuests(map) : ''}
            ${map.visuals.length ? renderReferences(map) : ''}
            ${renderSources(map)}
          </div>
        </div>
      </div>`;

    bindMapInteractions(game, map);
  }

  function renderBriefing(game, map) {
    const firstQuest = map.mainQuests[0];
    const setup = Array.isArray(map.setup) ? map.setup : [];
    const atAGlance = firstQuest ? firstQuest.steps.slice(0, 6).map((step, index) => `<div class="info-card"><small>Checkpoint ${index + 1}</small><strong>${escapeHtml(step.title)}</strong><p>${escapeHtml(step.body.slice(0, 130))}${step.body.length > 130 ? '…' : ''}</p></div>`).join('') : '';
    return `
      <section class="guide-section" id="briefing" tabindex="-1">
        <div class="guide-section-heading"><h2>Run briefing</h2><p>${escapeHtml(game.title)} · ${escapeHtml(map.name)}</p></div>
        <div class="info-grid">
          <div class="info-card"><small>Main routes</small><strong>${map.mainQuests.length || 'None'}</strong><p>${map.mainQuests.length ? map.mainQuests.map((quest) => escapeHtml(quest.name)).join(' · ') : 'This map does not use a conventional story main quest.'}</p></div>
          <div class="info-card"><small>Side content</small><strong>${map.sideQuests.length} quest${map.sideQuests.length === 1 ? '' : 's'}</strong><p>Wonder weapons, songs, upgrades, shortcuts, free perks, and map-specific secrets where documented.</p></div>
          <div class="info-card"><small>Verification</small><strong>${titleCaseStatus(map.status)}</strong><p>${map.status === 'upcoming' ? 'No unreleased steps are fabricated.' : 'Guide order is paired with map references and external source links.'}</p></div>
        </div>
        ${map.requirements.length ? `<p class="eyebrow">REQUIRED BEFORE THE FINAL ROUTE</p><div class="requirements">${map.requirements.map((item) => `<span class="requirement">${escapeHtml(item)}</span>`).join('')}</div>` : ''}
        ${setup.length ? `<div class="quest-block"><div class="quest-block-header"><div><h3>Recommended setup</h3><p>Preparation that prevents common run failures.</p></div></div><ol class="step-list">${setup.map((step, index) => renderSetupStep(step, index)).join('')}</ol></div>` : ''}
        ${atAGlance ? `<p class="eyebrow">FIRST SIX CHECKPOINTS AT A GLANCE</p><div class="info-grid">${atAGlance}</div>` : ''}
      </section>`;
  }

  function renderSetupStep(step, index) {
    const normalized = typeof step === 'string' ? { title: `Setup ${index + 1}`, body: step } : step;
    return `<li class="step-item"><div class="step-number-wrap"><span class="step-check" aria-hidden="true" style="cursor:default"></span></div><div class="step-body"><div class="step-kicker"><b>SETUP</b> ${String(index + 1).padStart(2, '0')}</div><h4>${escapeHtml(normalized.title)}</h4><p>${escapeHtml(normalized.body)}</p></div></li>`;
  }

  function renderMainQuest(map, quest, questIndex) {
    const progress = readProgress();
    return `
      <section class="guide-section" id="quest-${escapeHtml(quest.id)}" tabindex="-1">
        <div class="guide-section-heading"><h2>${escapeHtml(quest.name)}</h2><p>Main route ${questIndex + 1} of ${map.mainQuests.length}</p></div>
        <article class="quest-block">
          <header class="quest-block-header">
            <div><h3>${escapeHtml(quest.name)}</h3><p>${escapeHtml(quest.summary || `${quest.players} · Follow every checkpoint in order.`)}</p></div>
            <div class="quest-reward"><small>Completion</small><strong>${escapeHtml(quest.reward || 'Story quest complete')}</strong></div>
          </header>
          <ol class="step-list">
            ${quest.steps.map((step, index) => {
              const key = getStepKey(map.id, quest.id, index);
              return renderStep(step, index, key, Boolean(progress[key]), quest.name);
            }).join('')}
          </ol>
        </article>
      </section>`;
  }

  function renderStep(step, index, key, complete, questName) {
    const callouts = [
      step.cue ? `<div class="callout cue"><strong>Success cue:</strong> ${escapeHtml(step.cue)}</div>` : '',
      step.tip ? `<div class="callout tip"><strong>Shortcut:</strong> ${escapeHtml(step.tip)}</div>` : '',
      step.warning ? `<div class="callout warning"><strong>Do not miss:</strong> ${escapeHtml(step.warning)}</div>` : '',
      step.code ? `<div class="callout code"><strong>Code:</strong> ${escapeHtml(step.code)}</div>` : ''
    ].join('');
    return `
      <li class="step-item ${complete ? 'done' : ''}" data-step-key="${escapeHtml(key)}">
        <div class="step-number-wrap"><button class="step-check" type="button" aria-label="Mark ${escapeHtml(step.title)} complete" aria-pressed="${complete}"></button></div>
        <div class="step-body">
          <div class="step-kicker"><b>STEP ${String(index + 1).padStart(2, '0')}</b> ${escapeHtml(questName)}</div>
          <h4>${escapeHtml(step.title)}</h4>
          <p>${escapeHtml(step.body)}</p>
          ${callouts ? `<div class="step-callouts">${callouts}</div>` : ''}
        </div>
      </li>`;
  }

  function renderNoMainQuest(map) {
    const message = map.status === 'upcoming'
      ? 'This map is announced but not publicly released. The archive intentionally contains no speculative or invented quest steps. The guide will only be populated after release and source verification.'
      : 'This entry has no conventional story main quest. Use the side-quest section for every documented song, weapon, shortcut, challenge, or survival secret included in the archive.';
    return `
      <section class="guide-section" id="main-quest" tabindex="-1">
        <div class="guide-section-heading"><h2>${map.status === 'upcoming' ? 'Upcoming guide' : 'No story main quest'}</h2><p>${escapeHtml(map.type)}</p></div>
        <div class="quest-block"><div class="quest-block-header"><div><h3>${escapeHtml(map.name)}</h3><p>${escapeHtml(message)}</p></div></div></div>
      </section>`;
  }

  function renderSideQuests(map) {
    return `
      <section class="guide-section" id="side-quests" tabindex="-1">
        <div class="guide-section-heading"><h2>Side Easter eggs</h2><p>${map.sideQuests.length} documented route${map.sideQuests.length === 1 ? '' : 's'}</p></div>
        <div class="side-quest-grid">
          ${map.sideQuests.map((quest, index) => `
            <article class="side-quest-card" id="side-${index + 1}">
              <button class="side-quest-summary" type="button" aria-expanded="false">
                <div><h3>${escapeHtml(quest.name)}</h3><p>${escapeHtml(quest.summary || `${quest.steps.length} step${quest.steps.length === 1 ? '' : 's'}`)}</p></div><span aria-hidden="true">+</span>
              </button>
              <div class="side-quest-detail">
                <ol>${quest.steps.map((step) => `<li><strong>${escapeHtml(step.title)}.</strong> ${escapeHtml(step.body)}${step.cue ? ` <em>Success cue: ${escapeHtml(step.cue)}</em>` : ''}${step.warning ? ` <em>Warning: ${escapeHtml(step.warning)}</em>` : ''}</li>`).join('')}</ol>
                ${quest.reward ? `<div class="reward-line"><strong>Reward:</strong> ${escapeHtml(quest.reward)}</div>` : ''}
              </div>
            </article>`).join('')}
        </div>
      </section>`;
  }

  function renderReferences(map) {
    return `
      <section class="guide-section" id="references" tabindex="-1">
        <div class="guide-section-heading"><h2>Puzzle references</h2><p>Only visuals or diagrams that directly help solve a step</p></div>
        <div class="reference-grid">
          ${map.visuals.map((visual) => {
            if (visual.type === 'image') {
              return `<figure class="reference-visual" data-image-src="${escapeHtml(visual.src)}" data-image-caption="${escapeHtml(`${visual.title}. ${visual.caption || ''}`)}"><img src="${escapeHtml(visual.src)}" alt="${escapeHtml(visual.title)}" loading="lazy"><figcaption class="reference-caption"><strong>${escapeHtml(visual.title)}</strong><p>${escapeHtml(visual.caption || '')}</p></figcaption></figure>`;
            }
            return `<div class="reference-diagram"><h3>${escapeHtml(visual.title || 'Puzzle code')}</h3><div class="code-strip">${(visual.cells || []).map((cell) => `<div class="code-cell">${escapeHtml(cell)}</div>`).join('')}</div>${visual.note ? `<p class="diagram-note">${escapeHtml(visual.note)}</p>` : ''}</div>`;
          }).join('')}
        </div>
      </section>`;
  }

  function renderSources(map) {
    return `
      <section class="guide-section" id="sources" tabindex="-1">
        <div class="guide-section-heading"><h2>Sources & verification</h2><p>Use these links to cross-check route order and version differences</p></div>
        <div class="source-list">
          ${map.sources.map((source) => `<a class="source-link" href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer"><div><strong>${escapeHtml(source.title)}</strong><small>${escapeHtml(source.note || 'External guide reference')}</small></div><span aria-hidden="true">↗</span></a>`).join('')}
        </div>
      </section>`;
  }

  function bindMapInteractions(game, map) {
    activateImageFallbacks(view);

    document.getElementById('copy-guide-link')?.addEventListener('click', () => copyText(location.href, 'Guide link copied'));
    document.getElementById('print-guide')?.addEventListener('click', () => window.print());
    document.getElementById('reset-progress')?.addEventListener('click', () => {
      const progress = readProgress();
      Object.keys(progress).forEach((key) => {
        if (key.startsWith(`${map.id}:`)) delete progress[key];
      });
      writeProgress(progress);
      view.querySelectorAll('[data-step-key]').forEach((item) => {
        item.classList.remove('done');
        item.querySelector('.step-check')?.setAttribute('aria-pressed', 'false');
      });
      updateMapProgress(map);
      showToast('Map progress reset');
    });

    view.querySelectorAll('[data-step-key] .step-check').forEach((button) => {
      button.addEventListener('click', () => {
        const item = button.closest('[data-step-key]');
        const progress = readProgress();
        const key = item.dataset.stepKey;
        progress[key] = !progress[key];
        if (!progress[key]) delete progress[key];
        writeProgress(progress);
        item.classList.toggle('done', Boolean(progress[key]));
        button.setAttribute('aria-pressed', String(Boolean(progress[key])));
        updateMapProgress(map);
      });
    });

    view.querySelectorAll(`a[href^="#/map/${map.id}#"]`).forEach((link) => {
      link.addEventListener('click', (event) => {
        event.preventDefault();
        const href = link.getAttribute('href');
        const anchor = href.split('#').pop();
        history.replaceState(null, '', href);
        const target = document.getElementById(anchor);
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    view.querySelectorAll('.side-quest-summary').forEach((button) => {
      button.addEventListener('click', () => {
        const card = button.closest('.side-quest-card');
        const open = card.classList.toggle('open');
        button.setAttribute('aria-expanded', String(open));
      });
    });

    view.querySelectorAll('.reference-visual').forEach((visual) => {
      visual.addEventListener('click', () => openImageModal(visual.dataset.imageSrc, visual.dataset.imageCaption));
      visual.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') openImageModal(visual.dataset.imageSrc, visual.dataset.imageCaption);
      });
      visual.tabIndex = 0;
      visual.setAttribute('role', 'button');
    });

    const guideLinks = [...view.querySelectorAll('.guide-nav a')];
    const sections = guideLinks.map((link) => {
      const href = link.getAttribute('href') || '';
      const sectionId = href.split('#').pop();
      return sectionId ? document.getElementById(sectionId) : null;
    }).filter(Boolean);
    if ('IntersectionObserver' in window && sections.length) {
      const observer = new IntersectionObserver((entries) => {
        const active = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!active) return;
        guideLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href').endsWith(`#${active.target.id}`)));
      }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .2, .6] });
      sections.forEach((section) => observer.observe(section));
    }

    updateMapProgress(map);
  }

  function updateMapProgress(map) {
    const progress = getMapProgress(map);
    const label = document.getElementById('progress-label');
    const fill = document.getElementById('progress-fill');
    if (label) label.textContent = `${progress.complete}/${progress.total}`;
    if (fill) fill.style.width = `${progress.percent}%`;
  }

  function openImageModal(src, caption) {
    imageModalImage.src = src;
    imageModalImage.alt = caption || 'Guide reference';
    imageModalCaption.textContent = caption || '';
    imageModal.hidden = false;
    document.body.style.overflow = 'hidden';
    imageModal.querySelector('.modal-close').focus();
  }

  function closeImageModal() {
    imageModal.hidden = true;
    imageModalImage.src = '';
    document.body.style.overflow = '';
  }

  function renderTools() {
    setDocumentTitle('Puzzle Tools');
    setAccent('#d65336');
    view.innerHTML = `
      <div class="page-shell">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#/">Games</a><i>›</i><span>Tools</span></nav>
        <section class="map-hero"><div class="map-hero-content"><p class="eyebrow">FAST REFERENCES</p><h1>Puzzle tools</h1><p class="map-description">Small helpers for the puzzle steps that are easiest to misread during a live run. Every result can be copied.</p></div></section>
        <section class="guide-section" style="margin-top:42px">
          <div class="guide-section-heading"><h2>Origins solvers</h2><p>Fixed codes and conversion references</p></div>
          <div class="tools-grid">
            <article class="tool-card"><h3>Lightning piano</h3><p>Number the seven lower keys from left to right. Enter the chord you are on.</p><div class="tool-input-row"><select id="lightning-chord"><option value="1 → 3 → 6">Chord 1</option><option value="3 → 5 → 7">Chord 2</option><option value="2 → 4 → 6">Chord 3</option></select><button class="button" data-tool-copy="lightning-output">Copy</button></div><div class="tool-output" id="lightning-output">1 → 3 → 6</div></article>
            <article class="tool-card"><h3>Fire church chart</h3><p>Read the seven upper symbols left to right. Shoot each lit value downstairs plus the bloodstain torch, 4.</p><div class="tool-output" id="fire-output">11 · 5 · 9 · 7 · 6 · 3 · 4\nAlways include torch 4</div><button class="button ghost" data-tool-copy="fire-output">Copy chart</button></article>
            <article class="tool-card"><h3>Lightning dials</h3><p>All seven sparking panels. Directions are shown from the player’s view.</p><div class="tool-output" id="dial-output">Gen 5 ↓\nChurch basement →\nChurch upstairs ↑\nGen 4 ↑\nSpawn ←\nTank Station ↓\nExcavation mound ↑</div><button class="button ghost" data-tool-copy="dial-output">Copy positions</button></article>
          </div>
        </section>
        <section class="guide-section">
          <div class="guide-section-heading"><h2>Quick converters</h2><p>Live-run scratch tools</p></div>
          <div class="tools-grid">
            <article class="tool-card"><h3>Astra planets</h3><p>Convert the three planets named in O.S.C.A.R.’s recording to their digits.</p><div class="tool-input-row"><input id="planet-input" placeholder="Mars, Neptune, Earth"><button class="button" id="planet-convert">Convert</button></div><div class="tool-output" id="planet-output">Mercury 1 · Venus 2 · Earth 3 · Mars 4 · Jupiter 5 · Saturn 6 · Uranus 7 · Neptune 8</div></article>
            <article class="tool-card"><h3>Run note</h3><p>Build a short route note and copy it to Discord or your phone before starting.</p><div class="tool-input-row"><input id="run-note" placeholder="Example: save zombie after round 8"><button class="button" id="copy-note">Copy</button></div><div class="tool-output">Your text stays in this browser and is never uploaded.</div></article>
            <article class="tool-card"><h3>Guide search</h3><p>Press <strong>/</strong> anywhere outside a text box, then search a map, quest, code, or step title.</p><div class="tool-output">Examples:\nBuried Maxis\nLightning piano\nBoss fight\nGolden spork</div></article>
          </div>
        </section>
      </div>`;

    const chord = document.getElementById('lightning-chord');
    chord.addEventListener('change', () => { document.getElementById('lightning-output').textContent = chord.value; });
    document.getElementById('planet-convert').addEventListener('click', () => {
      const values = { mercury: 1, venus: 2, earth: 3, mars: 4, jupiter: 5, saturn: 6, uranus: 7, neptune: 8 };
      const words = document.getElementById('planet-input').value.toLowerCase().split(/[^a-z]+/).filter(Boolean);
      const digits = words.map((word) => values[word]).filter(Boolean);
      document.getElementById('planet-output').textContent = digits.length ? digits.join(' → ') : 'Enter planet names such as Mars, Neptune, Earth.';
    });
    document.getElementById('copy-note').addEventListener('click', () => {
      const text = document.getElementById('run-note').value.trim();
      if (!text) return showToast('Enter a run note first');
      copyText(text, 'Run note copied');
    });
    view.querySelectorAll('[data-tool-copy]').forEach((button) => button.addEventListener('click', () => copyText(document.getElementById(button.dataset.toolCopy).textContent, 'Reference copied')));
  }

  function renderAccuracy() {
    setDocumentTitle('Accuracy & Coverage');
    setAccent('#d65336');
    view.innerHTML = `
      <div class="page-shell">
        <nav class="breadcrumbs" aria-label="Breadcrumb"><a href="#/">Games</a><i>›</i><span>Accuracy</span></nav>
        <section class="map-hero"><div class="map-hero-content"><p class="eyebrow">VERIFICATION POLICY</p><h1>Accuracy over filler</h1><p class="map-description">The archive separates verified released routes, current live-game routes, maps without conventional main quests, and announced content. It does not invent unreleased steps.</p><div class="map-meta-row"><div class="map-meta-pill"><small>Database version</small><strong>${escapeHtml(data.version)}</strong></div><div class="map-meta-pill"><small>Last audited</small><strong>${escapeHtml(data.updated)}</strong></div><div class="map-meta-pill"><small>Guide steps</small><strong>${data.stats.steps}</strong></div></div></div></section>
        <section class="guide-section" style="margin-top:42px">
          <div class="accuracy-grid">
            <div>
              <div class="guide-section-heading"><h2>Policy</h2><p>How entries are handled</p></div>
              <div class="policy-list">
                <div class="policy-item"><strong>Released content only</strong><p>Unreleased maps are labeled upcoming and contain no speculative quest instructions.</p></div>
                <div class="policy-item"><strong>Version differences are preserved</strong><p>Black Ops II, Zombies Chronicles, solo, co-op, branch, and mode differences are called out inside the applicable route.</p></div>
                <div class="policy-item"><strong>Success cues matter</strong><p>When kills, timings, or registrations vary, the guide prioritizes the in-game visual or audio completion cue instead of pretending an estimate is exact.</p></div>
                <div class="policy-item"><strong>Useful visuals only</strong><p>Images and code diagrams are included where they solve a puzzle or prevent a route mistake. Decorative screenshots do not replace written instructions.</p></div>
                <div class="policy-item"><strong>Corrections stay easy</strong><p>Every map includes external references, and the correction template records game, map, platform, route, and the exact disputed step.</p></div>
              </div>
            </div>
            <div>
              <div class="guide-section-heading"><h2>Coverage</h2><p>${data.stats.maps} entries across ${data.stats.games} titles and modes</p></div>
              <table class="coverage-table"><thead><tr><th>Game</th><th>Maps</th><th>Main</th><th>Side</th><th>Status</th></tr></thead><tbody>${data.games.map((game) => {
                const main = game.maps.reduce((sum, map) => sum + map.mainQuests.length, 0);
                const side = game.maps.reduce((sum, map) => sum + map.sideQuests.length, 0);
                const current = game.maps.some((map) => map.status === 'current');
                const upcoming = game.maps.some((map) => map.status === 'upcoming');
                const status = upcoming ? 'Current + upcoming' : current ? 'Current live archive' : 'Source checked';
                const cls = upcoming ? 'upcoming' : current ? 'current' : '';
                return `<tr><td>${escapeHtml(game.title)}</td><td>${game.maps.length}</td><td>${main}</td><td>${side}</td><td><span class="status-dot ${cls}"></span>${status}</td></tr>`;
              }).join('')}</tbody></table>
            </div>
          </div>
        </section>
      </div>`;
  }

  function renderNotFound() {
    setDocumentTitle('Guide Not Found');
    setAccent('#d65336');
    view.innerHTML = '<section class="page-shell not-found"><strong>404</strong><h1>Guide not found</h1><p>The requested game or map is not in this archive route.</p><a class="button primary" href="#/">Return to games</a></section>';
  }

  function parseRoute() {
    const raw = location.hash || '#/';
    const withoutHash = raw.slice(1);
    const [routePart, anchorPart] = withoutHash.split('#');
    const parts = routePart.replace(/^\//, '').split('/').filter(Boolean).map(decodeURIComponent);
    return { parts, anchor: anchorPart || '' };
  }

  function renderRoute() {
    startRouteTransition();
    closeSearch();
    const { parts, anchor } = parseRoute();
    try {
      if (!parts.length) renderHome();
      else if (parts[0] === 'game' && gameById.has(parts[1])) renderGame(gameById.get(parts[1]));
      else if (parts[0] === 'map' && mapById.has(parts[1])) {
        const entry = mapById.get(parts[1]);
        renderMap(entry.game, entry.map);
      } else if (parts[0] === 'tools') renderTools();
      else if (parts[0] === 'accuracy') renderAccuracy();
      else renderNotFound();
      scrollToTopOrAnchor(anchor);
    } catch (error) {
      console.error(error);
      renderNotFound();
      showToast('A guide rendering error was caught');
    } finally {
      finishRouteTransition();
      mobileNav.hidden = true;
      mobileMenuButton.setAttribute('aria-expanded', 'false');
    }
  }

  function performSearch(query) {
    const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean);
    if (!terms.length) return [];
    return searchIndex
      .map((item) => {
        let score = 0;
        const title = item.title.toLowerCase();
        terms.forEach((term) => {
          if (title === term) score += 20;
          else if (title.startsWith(term)) score += 12;
          else if (title.includes(term)) score += 8;
          if (item.haystack.includes(term)) score += 2;
        });
        return { ...item, score };
      })
      .filter((item) => item.score >= terms.length * 2)
      .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title))
      .slice(0, 12);
  }

  function updateSearch() {
    const query = searchInput.value;
    const results = performSearch(query);
    searchSelection = -1;
    if (!query.trim()) {
      searchPopover.hidden = true;
      searchPopover.innerHTML = '';
      return;
    }
    searchPopover.hidden = false;
    searchPopover.innerHTML = results.length ? results.map((item, index) => `
      <a class="search-result" href="${escapeHtml(item.hash)}" data-search-index="${index}">
        <span class="search-result-icon">${escapeHtml(item.type.split(' ').map((word) => word[0]).join('').slice(0, 2))}</span>
        <span><strong>${escapeHtml(item.title)}</strong><small>${escapeHtml(item.subtitle)}</small></span>
        <em>${escapeHtml(item.type)}</em>
      </a>`).join('') : '<div class="search-empty">No matching game, map, quest, code, or step.</div>';
  }

  function closeSearch() {
    searchPopover.hidden = true;
    searchSelection = -1;
  }

  searchInput.addEventListener('input', updateSearch);
  searchInput.addEventListener('focus', updateSearch);
  searchInput.addEventListener('keydown', (event) => {
    const results = [...searchPopover.querySelectorAll('.search-result')];
    if (event.key === 'ArrowDown' && results.length) {
      event.preventDefault();
      searchSelection = clamp(searchSelection + 1, 0, results.length - 1);
    } else if (event.key === 'ArrowUp' && results.length) {
      event.preventDefault();
      searchSelection = clamp(searchSelection - 1, 0, results.length - 1);
    } else if (event.key === 'Enter' && searchSelection >= 0 && results[searchSelection]) {
      event.preventDefault();
      results[searchSelection].click();
    } else if (event.key === 'Escape') {
      closeSearch();
      searchInput.blur();
    }
    results.forEach((item, index) => item.classList.toggle('active', index === searchSelection));
    results[searchSelection]?.scrollIntoView({ block: 'nearest' });
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.header-search')) closeSearch();
  });

  document.addEventListener('keydown', (event) => {
    const tag = document.activeElement?.tagName;
    const typing = ['INPUT', 'TEXTAREA', 'SELECT'].includes(tag) || document.activeElement?.isContentEditable;
    if (event.key === '/' && !typing) {
      event.preventDefault();
      searchInput.focus();
      searchInput.select();
    }
    if (event.key === 'Escape' && !imageModal.hidden) closeImageModal();
  });

  mobileMenuButton.addEventListener('click', () => {
    const open = mobileNav.hidden;
    mobileNav.hidden = !open;
    mobileMenuButton.setAttribute('aria-expanded', String(open));
  });
  mobileNav.addEventListener('click', () => {
    mobileNav.hidden = true;
    mobileMenuButton.setAttribute('aria-expanded', 'false');
  });

  imageModal.querySelector('.modal-close').addEventListener('click', closeImageModal);
  imageModal.addEventListener('click', (event) => { if (event.target === imageModal) closeImageModal(); });

  correctionButton.addEventListener('click', () => {
    const template = `Dead Drop correction\nGame:\nMap:\nPlatform/version:\nQuest or side Easter egg:\nStep number/title:\nWhat the guide currently says:\nWhat is incorrect or missing:\nEvidence/source link:\nIn-game success cue:`;
    copyText(template, 'Correction template copied');
  });

  window.addEventListener('hashchange', renderRoute);
  renderRoute();
})();
