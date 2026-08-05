(() => {
  'use strict';

  const data = window.DEAD_DROP_DATA;
  if (!data?.games) return;

  const BO2_IDS = new Set([
    'black-ops-2-tranzit-green-run',
    'black-ops-2-nuketown-zombies',
    'black-ops-2-die-rise',
    'black-ops-2-mob-of-the-dead',
    'black-ops-2-buried',
    'black-ops-2-origins'
  ]);

  const BURIED_SOLVED = [
    ['DRY GULCHER SHAFT', 'https://unitedzombienetwork.weebly.com/uploads/3/8/8/8/38883079/9981760_orig.jpg'],
    ['LUNGER UNDERMINES', 'https://unitedzombienetwork.weebly.com/uploads/3/8/8/8/38883079/137514_orig.png'],
    ['CONSUMPTION CROSS', 'https://unitedzombienetwork.weebly.com/uploads/3/8/8/8/38883079/3002557_orig.png'],
    ['GROUND BITER PITS', 'https://unitedzombienetwork.weebly.com/uploads/3/8/8/8/38883079/5641678_orig.png'],
    ['BONE ORCHARD VEIN', 'https://unitedzombienetwork.weebly.com/uploads/3/8/8/8/38883079/2542915_orig.png']
  ];

  const STOP_WORDS = new Set([
    'the', 'and', 'for', 'with', 'from', 'into', 'every', 'exact', 'complete',
    'required', 'guide', 'setup', 'main', 'quest', 'build', 'upgrade', 'obtain'
  ]);

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

  const sentences = (value = '') => String(value)
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((part) => part.trim())
    .filter(Boolean);

  function allMaps() {
    return data.games.flatMap((game) => game.maps || []);
  }

  function currentMap() {
    const id = location.hash.match(/^#\/map\/([^#]+)/)?.[1];
    return id ? allMaps().find((map) => map.id === id) : null;
  }

  function allSteps(map) {
    return [
      ...(map.mainQuests || []).flatMap((quest) => quest.steps || []),
      ...(map.requiredGuides || []).flatMap((guide) => guide.steps || []),
      ...(map.optionalSideQuests || []).flatMap((guide) => guide.steps || [])
    ];
  }

  function cleanReferences(map) {
    for (const step of allSteps(map)) {
      step.references = (step.references || []).filter((reference) => {
        const rows = reference.rows || [];
        if (!rows.length) return false;
        const numeric = rows.filter((row) => /^\d+$/.test(String(row.label || ''))).length;
        const headings = rows.filter((row) => /^[A-Z0-9 /·—-]{4,}$/.test(String(row.value || ''))).length;
        return !(rows.length >= 6 && numeric / rows.length > 0.7 && headings >= 2);
      });
    }
  }

  function installSolvedCipher(map) {
    if (map.id !== 'black-ops-2-buried') return;
    const step = allSteps(map).find((entry) => /decode|cipher|tunnel signs/i.test(`${entry.title} ${entry.body}`));
    if (!step) return;

    step.images = (step.images || []).filter((image) =>
      !/saymedia|cipher|bur1\.png|tunnel-sign patterns/i.test(`${image.src || ''} ${image.title || ''}`)
    );
    step.solvedCipher = BURIED_SOLVED.map(([title, src]) => ({ title, src }));
    step.sourceUrl = 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/buried_mined_games/richtofen-steps-mined-games/decipher-the-code-summon-the-wisp-r197/';
  }

  function mediaInlinePolicy(map) {
    for (const step of allSteps(map)) {
      for (const image of step.images || []) {
        image.inline = true;
        image.referrerPolicy = 'no-referrer';
      }
    }
  }

  for (const map of allMaps()) {
    if (!BO2_IDS.has(map.id)) continue;
    cleanReferences(map);
    installSolvedCipher(map);
    mediaInlinePolicy(map);
  }

  function renderSolvedCipher(step) {
    if (!step?.solvedCipher?.length) return '';
    return `<figure class="buried-solved-cipher">
      <figcaption><b>Solved Buried cipher patterns</b><span>Compare each wall line directly with these five patterns. Spaces count as characters.</span></figcaption>
      <div class="buried-cipher-list">
        ${step.solvedCipher.map((entry) => `<div class="buried-cipher-row"><strong>${escapeHtml(entry.title)}</strong><img src="${escapeHtml(entry.src)}" alt="${escapeHtml(entry.title)} cipher pattern" loading="eager" referrerpolicy="no-referrer"></div>`).join('')}
      </div>
    </figure>`;
  }

  function renderReferences(references = []) {
    if (!references.length) return '';
    return `<div class="inline-tutorial-references">${references.map((reference) => `
      <section class="inline-tutorial-reference">
        <h6>${escapeHtml(reference.title || 'Quick reference')}</h6>
        <dl>${(reference.rows || []).map((row) => `<div><dt>${escapeHtml(row.label || '')}</dt><dd>${escapeHtml(row.value || '')}</dd></div>`).join('')}</dl>
        ${reference.note ? `<p>${escapeHtml(reference.note)}</p>` : ''}
      </section>`).join('')}</div>`;
  }

  function renderImages(images = []) {
    if (!images.length) return '';
    return `<div class="inline-tutorial-media">${images.map((image) => `
      <figure>
        <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.title || 'Tutorial reference')}" loading="eager" referrerpolicy="no-referrer">
        <figcaption><b>${escapeHtml(image.title || 'Reference')}</b>${image.caption ? `<span>${escapeHtml(image.caption)}</span>` : ''}${image.creditUrl ? `<a href="${escapeHtml(image.creditUrl)}" target="_blank" rel="noopener noreferrer">Source / attribution ↗</a>` : ''}</figcaption>
      </figure>`).join('')}</div>`;
  }

  function renderGuideStep(step, index) {
    return `<article class="inline-tutorial-step">
      <div class="inline-tutorial-step-number">${String(index + 1).padStart(2, '0')}</div>
      <div class="inline-tutorial-step-body">
        <h5>${escapeHtml(step.title || `Step ${index + 1}`)}</h5>
        ${step.location ? `<div class="inline-tutorial-location"><b>Exact location</b><span>${escapeHtml(step.location)}</span></div>` : ''}
        <ol>${sentences(step.body).map((sentence) => `<li>${escapeHtml(sentence)}</li>`).join('')}</ol>
        ${renderReferences(step.references || [])}
        ${renderSolvedCipher(step)}
        ${renderImages(step.images || [])}
        <div class="inline-tutorial-notes">
          ${step.code ? `<div><b>Code / order</b><span>${escapeHtml(step.code)}</span></div>` : ''}
          ${step.tip ? `<div><b>Beginner tip</b><span>${escapeHtml(step.tip)}</span></div>` : ''}
          ${step.success || step.cue ? `<div class="success"><b>Success cue</b><span>${escapeHtml(step.success || step.cue)}</span></div>` : ''}
          ${step.warning ? `<div class="warning"><b>Common failure</b><span>${escapeHtml(step.warning)}</span></div>` : ''}
          ${step.version ? `<div><b>Version note</b><span>${escapeHtml(step.version)}</span></div>` : ''}
        </div>
        ${step.sourceUrl ? `<a class="inline-tutorial-source" href="${escapeHtml(step.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(step.sourceLabel || 'Open source walkthrough')} ↗</a>` : ''}
      </div>
    </article>`;
  }

  function renderGuideTutorial(guide, key) {
    return `<section class="inline-required-guide" data-guide-key="${escapeHtml(key)}">
      <header class="inline-required-header">
        <p>FULL TUTORIAL FOR THIS STEP</p>
        <h4>${escapeHtml(guide.name)}</h4>
        ${guide.reward ? `<span>${escapeHtml(guide.reward)}</span>` : ''}
      </header>
      <div class="inline-tutorial-steps">${(guide.steps || []).map(renderGuideStep).join('')}</div>
    </section>`;
  }

  function guideTerms(guide) {
    return `${guide.name || ''} ${guide.reward || ''}`
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((term) => term.length >= 3 && !STOP_WORDS.has(term));
  }

  function guideAppliesToQuest(guide, quest) {
    const guideName = String(guide.name || '').toLowerCase();
    const questName = String(quest.name || '').toLowerCase();
    for (const branch of ['richtofen', 'maxis']) {
      if (guideName.includes(branch) && !questName.includes(branch)) return false;
    }
    return true;
  }

  function scoreGuideToStep(guide, quest, step, index) {
    const guideName = String(guide.name || '').toLowerCase();
    const text = `${step.title || ''} ${step.location || ''} ${step.body || ''}`.toLowerCase();
    let score = guideTerms(guide).reduce((sum, term) => sum + (text.includes(term) ? 2 : 0), 0);

    if (index === 0 && /build|upgrade|setup|prepare|required|obtain/.test(text)) score += 3;
    if (/staff/.test(guideName) && /staff|build|upgrade|key/.test(text)) score += 8;
    if (/g-strike|beacon/.test(guideName) && /rain fire|seal|g-strike/.test(text)) score += 10;
    if (/maxis drone/.test(guideName) && /drone|horde|pit/.test(text)) score += 10;
    if (/one inch punch|fist/.test(guideName) && /fist|punch|chest/.test(text)) score += 10;
    if (/cipher|tunnel sign/.test(guideName) && /cipher|sign|wisp/.test(text)) score += 10;
    if (/lantern/.test(guideName) && /lantern|cipher|sign/.test(text)) score += 8;
    if (/red amplifier|orb/.test(guideName) && /orb|amplifier|lantern/.test(text)) score += 8;
    if (/guillotine|gallows|quest structure/.test(guideName) && /guillotine|gallows|structure|preparation/.test(text)) score += 8;
    if (/trample|sliquifier|krauss|mahjong/.test(guideName) && /trample|sliquifier|krauss|mahjong|tower/.test(text)) score += 7;
    if (/plane|acid gat|retriever|spoon|shield/.test(guideName) && /plane|gat|retriever|spoon|shield|cycle/.test(text)) score += 7;
    return score;
  }

  function bestStepIndex(guide, quest) {
    let bestIndex = 0;
    let bestScore = -1;
    (quest.steps || []).forEach((step, index) => {
      const score = scoreGuideToStep(guide, quest, step, index);
      if (score > bestScore) {
        bestScore = score;
        bestIndex = index;
      }
    });
    return bestIndex;
  }

  function ensureTutorialZone(stepArticle) {
    let zone = stepArticle.querySelector('.step-tutorial-zone');
    if (zone) return zone;
    zone = document.createElement('section');
    zone.className = 'step-tutorial-zone';
    zone.innerHTML = '<div class="step-tutorial-heading"><p>STEP TUTORIAL</p><h4>Everything needed to complete this step</h4></div>';
    const actions = stepArticle.querySelector('.action-list');
    if (actions) actions.insertAdjacentElement('afterend', zone);
    else stepArticle.prepend(zone);
    return zone;
  }

  function addRequirementChecklist(map, quest) {
    if (!(map.requirements || []).length) return;
    const first = document.getElementById(`${quest.id}-step-1`)?.querySelector('.step-article');
    if (!first) return;
    const zone = ensureTutorialZone(first);
    if (zone.querySelector('.inline-map-requirements')) return;
    const checklist = document.createElement('section');
    checklist.className = 'inline-map-requirements';
    checklist.innerHTML = `<h5>Before starting this route</h5><ul>${map.requirements.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul>`;
    zone.querySelector('.step-tutorial-heading')?.insertAdjacentElement('afterend', checklist);
  }

  function integrateRequiredTutorials(map) {
    if (!(map.mainQuests || []).length) return;

    for (const quest of map.mainQuests || []) {
      addRequirementChecklist(map, quest);
      for (const guide of map.requiredGuides || []) {
        if (!guideAppliesToQuest(guide, quest)) continue;
        const index = bestStepIndex(guide, quest);
        const stepArticle = document.getElementById(`${quest.id}-step-${index + 1}`)?.querySelector('.step-article');
        if (!stepArticle) continue;
        const zone = ensureTutorialZone(stepArticle);
        const key = `${quest.id}:${guide.name}`;
        if (zone.querySelector(`[data-guide-key="${CSS.escape(key)}"]`)) continue;
        zone.insertAdjacentHTML('beforeend', renderGuideTutorial(guide, key));
      }
    }

    for (const guide of map.requiredGuides || []) {
      const standalone = document.getElementById(`guide-${slug(guide.name)}`);
      if (standalone) standalone.hidden = true;
    }

    const requiredSection = document.getElementById('required');
    if (requiredSection) requiredSection.hidden = true;
    document.querySelector('.guide-sidebar a[href="#required"]')?.remove();
  }

  function improveImages() {
    document.querySelectorAll('.depth-inline-images img, .inline-tutorial-media img, .buried-solved-cipher img').forEach((image) => {
      image.referrerPolicy = 'no-referrer';
      image.loading = 'eager';
      image.closest('figure')?.classList.remove('image-failed');
    });
  }

  function injectSolvedCipher(map) {
    if (map.id !== 'black-ops-2-buried') return;
    const step = allSteps(map).find((entry) => entry.solvedCipher?.length);
    if (!step) return;
    const article = [...document.querySelectorAll('.depth-substep, .wiki-step')].find((node) => /decode|cipher|tunnel signs/i.test(node.textContent || ''));
    const host = article?.querySelector('.depth-step-copy, .step-article') || article;
    if (!host || host.querySelector('.buried-solved-cipher')) return;
    host.insertAdjacentHTML('beforeend', renderSolvedCipher(step));
  }

  function enhance() {
    const map = currentMap();
    if (!map) return;
    integrateRequiredTutorials(map);
    if (BO2_IDS.has(map.id)) {
      injectSolvedCipher(map);
      improveImages();
    }
  }

  const view = document.getElementById('view');
  const observer = new MutationObserver(() => requestAnimationFrame(enhance));
  if (view) observer.observe(view, { childList: true, subtree: true });
  window.addEventListener('hashchange', () => requestAnimationFrame(enhance));
  requestAnimationFrame(enhance);
})();