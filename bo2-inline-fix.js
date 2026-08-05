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

  const slug = (value = '') => String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

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
        const headingRows = rows.filter((row) => /^[A-Z0-9 /·—-]{4,}$/.test(String(row.value || ''))).length;
        return !(rows.length >= 6 && numeric / rows.length > 0.7 && headingRows >= 2);
      });
    }
  }

  function installSolvedCipher(map) {
    if (map.id !== 'black-ops-2-buried') return;
    const steps = allSteps(map);
    const step = steps.find((entry) => /decode|cipher|tunnel signs/i.test(`${entry.title} ${entry.body}`));
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
      <figcaption>
        <b>Solved Buried cipher patterns</b>
        <span>Compare each wall line directly with these five patterns. Spaces count as characters.</span>
      </figcaption>
      <div class="buried-cipher-list">
        ${step.solvedCipher.map((entry) => `<div class="buried-cipher-row"><strong>${escapeHtml(entry.title)}</strong><img src="${escapeHtml(entry.src)}" alt="${escapeHtml(entry.title)} cipher pattern" loading="eager" referrerpolicy="no-referrer"></div>`).join('')}
      </div>
    </figure>`;
  }

  function findMainStepElement(map, guide) {
    const terms = String(guide.name || '')
      .toLowerCase()
      .replace(/—.*$/, '')
      .split(/[^a-z0-9]+/)
      .filter((term) => term.length >= 4 && !['every', 'exact', 'complete', 'required', 'guide'].includes(term));

    let best = null;
    let bestScore = 0;
    for (const quest of map.mainQuests || []) {
      (quest.steps || []).forEach((step, index) => {
        const haystack = `${step.title || ''} ${step.body || ''}`.toLowerCase();
        let score = terms.reduce((sum, term) => sum + (haystack.includes(term) ? 1 : 0), 0);

        if (/staff/.test(guide.name) && index === 0) score += 4;
        if (/g-strike/.test(guide.name) && /rain fire|seal/.test(haystack)) score += 5;
        if (/maxis drone/.test(guide.name) && /horde|drone|pit/.test(haystack)) score += 5;
        if (/one inch punch/.test(guide.name) && /fist|punch|chest/.test(haystack)) score += 5;
        if (/cipher|tunnel sign/.test(guide.name) && /cipher|sign|wisp/.test(haystack)) score += 5;
        if (/lantern/.test(guide.name) && /lantern/.test(haystack)) score += 5;
        if (/red amplifier|orb/.test(guide.name) && /orb|amplifier/.test(haystack)) score += 5;
        if (/quest structure|guillotine|gallows/.test(guide.name) && index === 0) score += 3;

        if (score > bestScore) {
          bestScore = score;
          best = document.getElementById(`${quest.id}-step-${index + 1}`);
        }
      });
    }
    return best || document.querySelector('.quest-card .step-row');
  }

  function moveRequiredGuides(map) {
    for (const guide of map.requiredGuides || []) {
      const guideNode = document.getElementById(`guide-${slug(guide.name)}`);
      if (!guideNode || guideNode.dataset.inlineMoved === 'true') continue;
      const target = findMainStepElement(map, guide);
      const copy = target?.querySelector('.step-article') || target;
      if (!copy) continue;

      const wrapper = document.createElement('section');
      wrapper.className = 'inline-required-guide';
      wrapper.innerHTML = `<p class="inline-required-label">Required preparation used in this step</p>`;
      guideNode.open = false;
      guideNode.dataset.inlineMoved = 'true';
      wrapper.appendChild(guideNode);
      copy.appendChild(wrapper);
    }

    const emptyRequired = [...document.querySelectorAll('section')].find((section) =>
      /required preparation/i.test(section.querySelector('h2')?.textContent || '') &&
      !section.querySelector('details:not([data-inline-moved="true"])')
    );
    if (emptyRequired) emptyRequired.hidden = true;
  }

  function improveImages() {
    document.querySelectorAll('.depth-inline-images img').forEach((image) => {
      image.referrerPolicy = 'no-referrer';
      image.loading = 'eager';
      image.closest('figure')?.classList.remove('image-failed');
    });
  }

  function injectSolvedCipher(map) {
    if (map.id !== 'black-ops-2-buried') return;
    const step = allSteps(map).find((entry) => entry.solvedCipher?.length);
    if (!step) return;

    const article = [...document.querySelectorAll('.depth-substep, .step-row')].find((node) =>
      /decode|cipher|tunnel signs/i.test(node.textContent || '')
    );
    const host = article?.querySelector('.depth-step-copy, .step-article') || article;
    if (!host || host.querySelector('.buried-solved-cipher')) return;
    host.insertAdjacentHTML('beforeend', renderSolvedCipher(step));
  }

  function enhance() {
    const map = currentMap();
    if (!map || !BO2_IDS.has(map.id)) return;
    moveRequiredGuides(map);
    injectSolvedCipher(map);
    improveImages();
  }

  const view = document.getElementById('view');
  const observer = new MutationObserver(() => requestAnimationFrame(enhance));
  if (view) observer.observe(view, { childList: true, subtree: true });
  window.addEventListener('hashchange', () => requestAnimationFrame(enhance));
  requestAnimationFrame(enhance);
})();