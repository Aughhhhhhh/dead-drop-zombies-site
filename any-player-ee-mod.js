(() => {
  'use strict';

  const data = window.DEAD_DROP_DATA;
  const view = document.getElementById('view');
  if (!data?.games || !view) return;

  const PAGE_HASH = '#/mods/bo2-any-player-ee';
  const RELEASE_URL = 'https://forum.plutonium.pw/topic/32568/release-zm-any-player-easter-egg-mods';
  const AFFECTED_FOUR_PLAYER_MAPS = new Set([
    'black-ops-2-die-rise',
    'black-ops-2-buried'
  ]);

  const escapeHtml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const maps = data.games.flatMap((game) => game.maps || []);
  for (const map of maps) {
    if (AFFECTED_FOUR_PLAYER_MAPS.has(map.id)) {
      map.anyPlayerMod = {
        name: 'BO2 Any Player Easter Egg Mods',
        page: PAGE_HASH,
        source: RELEASE_URL,
        note: 'Use this community Plutonium mod for solo, duo, or trio attempts. The unmodified quest requires four players.'
      };
    }
  }

  function addNavigationLinks() {
    const targets = [
      document.querySelector('.header-nav'),
      document.querySelector('.mobile-nav'),
      document.querySelector('.footer-links')
    ].filter(Boolean);

    for (const target of targets) {
      if (target.querySelector(`a[href="${PAGE_HASH}"]`)) continue;
      const link = document.createElement('a');
      link.href = PAGE_HASH;
      link.textContent = target.classList.contains('footer-links') ? 'BO2 any-player mod' : 'Mods';
      target.appendChild(link);
    }
  }

  function renderPage() {
    if (location.hash !== PAGE_HASH) {
      delete view.dataset.anyPlayerModPage;
      return false;
    }
    if (view.dataset.anyPlayerModPage === '1') return true;

    view.dataset.anyPlayerModPage = '1';
    document.title = 'BO2 Any Player Easter Egg Mod — Dead Drop';
    view.innerHTML = `
      <div class="page-shell mod-guide-page">
        <nav class="breadcrumbs"><a href="#/">Games</a><span>›</span><b>BO2 Any Player Easter Egg Mods</b></nav>

        <header class="mod-guide-hero">
          <p class="eyebrow">PLUTONIUM T6 · COMMUNITY MOD</p>
          <h1>Complete BO2 Easter Eggs with smaller lobbies</h1>
          <p>This guide covers Hadi77KSA’s Any Player Easter Egg Mods package for Plutonium Black Ops II. It changes player-count checks while keeping the quests close to their original behavior.</p>
          <div class="mod-guide-actions">
            <a class="mod-primary-action" href="${RELEASE_URL}" target="_blank" rel="noopener noreferrer">Download latest release from the author ↗</a>
            <a href="#/game/black-ops-2">Open Black Ops II maps</a>
          </div>
          <div class="mod-warning"><b>Community project</b><span>This is not an official Activision or Plutonium download. Use the author’s release thread so you receive the current files and instructions.</span></div>
        </header>

        <section class="mod-guide-section">
          <div class="section-heading"><div><p class="eyebrow">RECOMMENDED METHOD</p><h2>Install through the Mods menu</h2></div><p>The host must have the mod installed and loaded.</p></div>
          <ol class="mod-install-steps">
            <li><b>Download the latest release.</b><span>Open the author’s release thread above and click its <em>Download the latest release</em> link.</span></li>
            <li><b>Extract the ZIP.</b><span>Inside the download, locate the folder named <code>zm_any_player_ee</code>.</span></li>
            <li><b>Open the Plutonium T6 storage directory.</b><span>Press <kbd>Win</kbd> + <kbd>R</kbd>, paste <code>%localappdata%\Plutonium\storage\t6</code>, and press Enter.</span></li>
            <li><b>Create or open the mods folder.</b><span>The final directory should be <code>%localappdata%\Plutonium\storage\t6\mods</code>.</span></li>
            <li><b>Move the complete mod folder.</b><span>Place <code>zm_any_player_ee</code> inside <code>mods</code>. Do not move only the files from inside it.</span></li>
            <li><b>Load it in game.</b><span>Start Plutonium Black Ops II, open the in-game <strong>Mods</strong> menu, select <code>zm_any_player_ee</code>, and allow the game to reload.</span></li>
            <li><b>Host the Zombies lobby.</b><span>The host starts the affected map. A colored load message or a successful script entry in the external console confirms the mod is active.</span></li>
          </ol>
        </section>

        <section class="mod-guide-section">
          <div class="section-heading"><div><p class="eyebrow">AUTO-LOAD OPTION</p><h2>Load every included script automatically</h2></div><p>Use this when you do not want to select a mod each launch.</p></div>
          <ol class="mod-install-steps compact">
            <li><b>Extract the downloaded release.</b><span>Open the <code>zm_any_player_ee</code folder.</span></li>
            <li><b>Copy the IWD file.</b><span>Copy <code>zm_any_player_ee.iwd</code>.</span></li>
            <li><b>Paste it into the T6 root.</b><span>Place it directly in <code>%localappdata%\Plutonium\storage\t6</code>.</span></li>
          </ol>
          <p class="mod-detail-note">This makes the scripts load automatically. The Mods-menu method is easier to disable and is the recommended starting point for new users.</p>
        </section>

        <section class="mod-guide-section">
          <div class="section-heading"><div><p class="eyebrow">MAP SUPPORT</p><h2>What the package changes</h2></div><p>Four-player warnings link here only where this package is actually needed.</p></div>
          <div class="mod-compatibility-grid">
            <article><h3>Die Rise</h3><p><b>Vanilla:</b> exactly four players.</p><p><b>With the mod:</b> solo, duo, and trio support for both High Maintenance branches. Elevator, floor-symbol, and Trample Steam requirements scale to the lobby.</p><a href="#/map/black-ops-2-die-rise">Open Die Rise guide →</a></article>
            <article><h3>Buried</h3><p><b>Vanilla:</b> exactly four players.</p><p><b>With the mod:</b> smaller-lobby support for both Mined Games branches, including altered Wisp, Bells, Time Bomb, and Sharpshooter requirements.</p><a href="#/map/black-ops-2-buried">Open Buried guide →</a></article>
            <article><h3>TranZit</h3><p>The core package adapts the Maxis tower and lamp-post steps for solo. The release thread also provides a separate extra script for the Richtofen EMP step on solo.</p><a href="#/map/black-ops-2-tranzit-green-run">Open TranZit guide →</a></article>
            <article><h3>Mob of the Dead</h3><p>The release thread provides a separate <code>motd_solo.gsc</code> companion script. It spawns a bot after the prison numbers are entered so the original final sequence can continue solo.</p><a href="#/map/black-ops-2-mob-of-the-dead">Open Mob guide →</a></article>
            <article><h3>Origins</h3><p>Origins already supports one to four players without a mod. The included Origins script is for lobbies above four players so everyone can obtain the One Inch Punch tablet required by Wield a Fist of Iron.</p><a href="#/map/black-ops-2-origins">Open Origins guide →</a></article>
            <article><h3>Four-player lobby</h3><p>The author’s FAQ states that a normal four-player lobby does not need these scripts for the supported quests.</p></article>
          </div>
        </section>

        <section class="mod-guide-section">
          <div class="section-heading"><div><p class="eyebrow">ADVANCED</p><h2>Install only one map script</h2></div><p>Useful when another mod is already loaded.</p></div>
          <p class="mod-detail-note">Extract the <code>scripts</code> directory from <code>zm_any_player_ee.iwd</code>, then place the desired files in the matching path under <code>%localappdata%\Plutonium\storage\t6\scripts\zm</code>.</p>
          <dl class="mod-path-list">
            <div><dt>TranZit</dt><dd><code>scripts\zm\zm_transit</code></dd></div>
            <div><dt>Die Rise</dt><dd><code>scripts\zm\zm_highrise</code></dd></div>
            <div><dt>Buried</dt><dd><code>scripts\zm\zm_buried</code></dd></div>
            <div><dt>Origins</dt><dd><code>scripts\zm\zm_tomb</code></dd></div>
            <div><dt>Mob of the Dead companion</dt><dd><code>scripts\zm\zm_prison</code></dd></div>
          </dl>
        </section>

        <section class="mod-guide-section">
          <div class="section-heading"><div><p class="eyebrow">VERIFY AND TROUBLESHOOT</p><h2>Make sure the scripts loaded</h2></div></div>
          <div class="mod-check-list">
            <p><b>Mods-menu installation:</b> the top-right load message should identify <code>mods/zm_any_player_ee</code>.</p>
            <p><b>Die Rise:</b> look for the in-game message <code>Any Player EE Mod Die Rise</code>.</p>
            <p><b>Buried:</b> look for <code>Any Player EE Mod Buried</code> and the Super Easter Egg message.</p>
            <p><b>Console check:</b> the host can run <code>flashScriptHashes; scriptHashes</code> and look for the map’s any-player script.</p>
            <p><b>No message or script hash:</b> recheck that the folder was not nested twice and that it is under <code>storage\t6\mods\zm_any_player_ee</code>.</p>
          </div>
          <a class="mod-source-link" href="${RELEASE_URL}" target="_blank" rel="noopener noreferrer">Open the maintained release thread, configuration list, patches, FAQ, and downloads ↗</a>
        </section>
      </div>`;
    view.focus({ preventScroll: true });
    window.scrollTo(0, 0);
    return true;
  }

  function currentMapId() {
    return location.hash.match(/^#\/map\/([^#]+)/)?.[1] || '';
  }

  function injectAffectedQuestLinks() {
    const mapId = currentMapId();
    if (!AFFECTED_FOUR_PLAYER_MAPS.has(mapId)) return;

    document.querySelectorAll('.main-quest').forEach((quest) => {
      if (quest.querySelector('.any-player-mod-banner')) return;
      const heading = quest.querySelector('.quest-heading');
      if (!heading) return;
      const banner = document.createElement('aside');
      banner.className = 'any-player-mod-banner';
      banner.innerHTML = `<div><p>SOLO / DUO / TRIO OPTION</p><h3>This quest normally requires four players</h3><span>Install the BO2 Any Player Easter Egg Mods package before following this route with fewer than four players.</span></div><a href="${PAGE_HASH}">Installation and download →</a>`;
      heading.insertAdjacentElement('afterend', banner);
    });
  }

  function injectToolsCard() {
    if (location.hash !== '#/tools') return;
    const page = view.querySelector('.page-shell');
    if (!page || page.querySelector('.any-player-tools-card')) return;
    const card = document.createElement('a');
    card.className = 'any-player-tools-card';
    card.href = PAGE_HASH;
    card.innerHTML = '<p>PLUTONIUM T6 MOD</p><h2>BO2 Any Player Easter Egg Mods</h2><span>Download, install, verify, and use the smaller-lobby quest scripts for Die Rise, Buried, TranZit, Mob, and large Origins lobbies.</span><b>Open mod guide →</b>';
    page.appendChild(card);
  }

  function sync() {
    addNavigationLinks();
    if (renderPage()) return;
    injectAffectedQuestLinks();
    injectToolsCard();
  }

  let queued = false;
  const queueSync = () => {
    if (queued) return;
    queued = true;
    requestAnimationFrame(() => {
      queued = false;
      sync();
    });
  };

  const observer = new MutationObserver(queueSync);
  observer.observe(view, { childList: true, subtree: true });
  window.addEventListener('hashchange', queueSync);
  queueSync();
})();
