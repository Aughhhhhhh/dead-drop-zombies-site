(() => {
  'use strict';

  function applyEditorialCopy() {
    if (location.hash !== '#/accuracy') return;
    requestAnimationFrame(() => {
      const hero = document.querySelector('#view .hero.compact');
      if (!hero) return;
      const heading = hero.querySelector('h1');
      const copy = hero.querySelector('p:not(.eyebrow)');
      if (heading) heading.textContent = 'Clear about what has been audited.';
      if (copy) copy.textContent = 'Origins is the current deep-audit benchmark. Other released map entries retain their existing source-linked routes and are visibly labeled “expansion pending” until their locations, substeps, visuals, success cues, failure recovery, player-count rules, and version differences receive the same line-by-line editorial pass.';
    });
  }

  window.addEventListener('hashchange', applyEditorialCopy);
  applyEditorialCopy();
})();
