(() => {
  'use strict';

  const PAGE_HASH = '#/mods/bo2-any-player-ee';
  const DOWNLOAD_URL = 'https://github.com/Hadi77KSA/Plutonium-T6-Any-Player-EE-Scripts/releases/latest/download/release.zip';

  function finalizePage() {
    if (location.hash !== PAGE_HASH) return;

    const primary = document.querySelector('.mod-primary-action');
    if (primary) {
      primary.href = DOWNLOAD_URL;
      primary.textContent = 'Download latest release ZIP ↗';
      primary.setAttribute('download', 'release.zip');
      primary.setAttribute('aria-label', 'Download the latest BO2 Any Player Easter Egg Mods release ZIP from GitHub');
    }

    const autoLoadHeading = [...document.querySelectorAll('.mod-guide-section h2')]
      .find((heading) => heading.textContent.trim() === 'Load every included script automatically');
    const firstStep = autoLoadHeading?.closest('.mod-guide-section')?.querySelector('.mod-install-steps li');
    if (firstStep) {
      firstStep.innerHTML = '<b>Extract the downloaded release.</b><span>Open the <code>zm_any_player_ee</code> folder.</span>';
    }
  }

  const view = document.getElementById('view');
  const observer = new MutationObserver(() => requestAnimationFrame(finalizePage));
  if (view) observer.observe(view, { childList: true, subtree: true });
  window.addEventListener('hashchange', () => requestAnimationFrame(finalizePage));
  requestAnimationFrame(finalizePage);
})();
