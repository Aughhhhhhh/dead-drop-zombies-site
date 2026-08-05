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

  const sentences = (value = '') => String(value)
    .split(/(?<=[.!?])\s+(?=[A-Z0-9])/)
    .map((part) => part.trim())
    .filter(Boolean);

  function currentMap() {
    const id = location.hash.match(/^#\/map\/([^#]+)/)?.[1];
    if (!id) return null;
    for (const game of data.games) {
      const map = (game.maps || []).find((entry) => entry.id === id);
      if (map) return map;
    }
    return null;
  }

  function renderGuide(guide, key) {
    return `<section class="inline-required-guide" data-guide-key="${escapeHtml(key)}">
      <header class="inline-required-header"><p>FULL TUTORIAL FOR THIS STEP</p><h4>${escapeHtml(guide.name)}</h4>${guide.reward ? `<span>${escapeHtml(guide.reward)}</span>` : ''}</header>
      <div class="inline-tutorial-steps">${(guide.steps || []).map((step, index) => `
        <article class="inline-tutorial-step">
          <div class="inline-tutorial-step-number">${String(index + 1).padStart(2, '0')}</div>
          <div class="inline-tutorial-step-body">
            <h5>${escapeHtml(step.title || `Step ${index + 1}`)}</h5>
            ${step.location ? `<div class="inline-tutorial-location"><b>Exact location</b><span>${escapeHtml(step.location)}</span></div>` : ''}
            <ol>${sentences(step.body).map((sentence) => `<li>${escapeHtml(sentence)}</li>`).join('')}</ol>
            ${(step.images || []).length ? `<div class="inline-tutorial-media">${step.images.map((image) => `<figure><img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.title || 'Tutorial reference')}" loading="eager" referrerpolicy="no-referrer"><figcaption><b>${escapeHtml(image.title || 'Reference')}</b>${image.caption ? `<span>${escapeHtml(image.caption)}</span>` : ''}</figcaption></figure>`).join('')}</div>` : ''}
            <div class="inline-tutorial-notes">${step.success || step.cue ? `<div class="success"><b>Success cue</b><span>${escapeHtml(step.success || step.cue)}</span></div>` : ''}${step.warning ? `<div class="warning"><b>Common failure</b><span>${escapeHtml(step.warning)}</span></div>` : ''}</div>
            ${step.sourceUrl ? `<a class="inline-tutorial-source" href="${escapeHtml(step.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(step.sourceLabel || 'Open source walkthrough')} ↗</a>` : ''}
          </div>
        </article>`).join('')}</div>
    </section>`;
  }

  function ensureBranchNeutralGuides() {
    const map = currentMap();
    if (!map?.mainQuests?.length) return;
    const guides = (map.requiredGuides || []).filter((guide) => /maxis drone/i.test(guide.name || ''));
    if (!guides.length) return;

    for (const quest of map.mainQuests) {
      for (const guide of guides) {
        const key = `${quest.id}:${guide.name}`;
        if (document.querySelector(`[data-guide-key="${CSS.escape(key)}"]`)) continue;
        let index = (quest.steps || []).findIndex((step) => /drone|horde|pit/i.test(`${step.title || ''} ${step.body || ''}`));
        if (index < 0) index = 0;
        const article = document.getElementById(`${quest.id}-step-${index + 1}`)?.querySelector('.step-article');
        if (!article) continue;
        let zone = article.querySelector('.step-tutorial-zone');
        if (!zone) {
          zone = document.createElement('section');
          zone.className = 'step-tutorial-zone';
          zone.innerHTML = '<div class="step-tutorial-heading"><p>STEP TUTORIAL</p><h4>Everything needed to complete this step</h4></div>';
          article.querySelector('.action-list')?.insertAdjacentElement('afterend', zone);
        }
        zone.insertAdjacentHTML('beforeend', renderGuide(guide, key));
      }
    }
  }

  function forceTutorialsOpen() {
    const requiredSection = document.getElementById('required');
    if (requiredSection) requiredSection.hidden = true;
    document.querySelectorAll('.guide-sidebar a[href="#required"]').forEach((link) => link.remove());

    document.querySelectorAll('.step-tutorial-zone').forEach((zone) => {
      zone.hidden = false;
      zone.removeAttribute('aria-hidden');

      zone.querySelectorAll('details').forEach((details) => {
        details.open = true;
        details.hidden = false;
      });

      zone.querySelectorAll('.subguide').forEach((guide) => {
        guide.hidden = false;
        guide.classList.add('inline-expanded-subguide');
        const toggle = guide.querySelector('.subguide-toggle');
        const body = guide.querySelector('.subguide-body');
        if (toggle) {
          toggle.setAttribute('aria-expanded', 'true');
          toggle.hidden = true;
        }
        if (body) body.hidden = false;
      });

      zone.querySelectorAll('[hidden]').forEach((element) => {
        if (element.matches('.subguide-body, .inline-required-guide, .inline-tutorial-steps, .inline-tutorial-step')) {
          element.hidden = false;
        }
      });
    });

    document.querySelectorAll('.inline-required-guide, .inline-tutorial-steps, .inline-tutorial-step').forEach((element) => {
      element.hidden = false;
      element.removeAttribute('aria-hidden');
    });
  }

  function enhance() {
    ensureBranchNeutralGuides();
    forceTutorialsOpen();
  }

  const view = document.getElementById('view');
  let queued = false;
  const queueEnhance = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      enhance();
    });
  };

  const observer = new MutationObserver(queueEnhance);
  if (view) observer.observe(view, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden', 'aria-expanded'] });
  window.addEventListener('hashchange', queueEnhance);
  queueEnhance();
})();