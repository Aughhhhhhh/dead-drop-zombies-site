(() => {
  'use strict';

  const data = window.DEAD_DROP_DATA;
  if (!data?.games) return;

  const xml = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;');

  const findMap = (id) => {
    for (const game of data.games) {
      const map = (game.maps || []).find((entry) => entry.id === id);
      if (map) return map;
    }
    return null;
  };

  const step = (title, location, body, extras = {}) => ({ title, location, body, ...extras });
  const guide = (name, reward, steps, extras = {}) => ({ name, reward, steps, ...extras });
  const image = (src, title, caption, creditUrl = '') => ({ src, title, caption, creditUrl });
  const source = (title, url, note) => ({ title, url, note });

  function diagram(title, rows, caption = '') {
    const width = 1400;
    const rowHeight = 104;
    const height = 120 + (rows.length * rowHeight) + (caption ? 80 : 28);
    const body = rows.map((row, index) => {
      const y = 94 + (index * rowHeight);
      const label = Array.isArray(row) ? row[0] : row.label;
      const text = Array.isArray(row) ? row[1] : row.text;
      const accent = Array.isArray(row) && row[2] ? row[2] : '#d96b3c';
      return `<rect x="54" y="${y}" width="1292" height="82" rx="16" fill="#151515" stroke="#343434" stroke-width="3"/><rect x="54" y="${y}" width="16" height="82" rx="8" fill="${accent}"/><text x="96" y="${y + 31}" fill="#f5b078" font-family="Arial" font-size="21" font-weight="700">${xml(label)}</text><text x="96" y="${y + 62}" fill="#fff" font-family="Arial" font-size="23">${xml(text)}</text>`;
    }).join('');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" role="img"><rect width="100%" height="100%" fill="#090909"/><text x="54" y="54" fill="#fff" font-family="Arial" font-size="34" font-weight="700">${xml(title)}</text>${body}${caption ? `<text x="54" y="${height - 30}" fill="#999" font-family="Arial" font-size="20">${xml(caption)}</text>` : ''}</svg>`;
    return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
  }

  const fandom = (filename) => `https://callofduty.fandom.com/wiki/Special:Redirect/file/${encodeURIComponent(filename)}`;
  const plutoniumVictis = {
    title: 'Plutonium BO2 Victis Solo / Any-Player Easter Egg Mod',
    description: 'TranZit, Die Rise, and Buried are designed around multiple simultaneous players in the original game. This community Plutonium script pack adapts those Victis quests for smaller private lobbies.',
    downloadUrl: 'https://github.com/yaboi-zombies/BO2-Full-Solo-Mods',
    guideUrl: 'https://forum.plutonium.pw/topic/33393/release-zm-bo2-victis-solo-easter-eggs'
  };
  const plutoniumMob = {
    title: 'Plutonium Mob of the Dead Solo Easter Egg Mod',
    description: 'The original final bridge confrontation needs at least two players. This community script adapts the ending for solo Plutonium/private matches.',
    downloadUrl: 'https://github.com/teh-bandit/Plutonium-T6ZM/raw/main/Mob%20of%20the%20Dead%20Solo%20Easter%20Egg/motd_solo-compiled.gsc',
    guideUrl: 'https://forum.plutonium.pw/topic/16734/release-zombies-mob-of-the-dead-easter-egg-solo-improved/10'
  };

  window.BO2_DEPTH = { data, findMap, step, guide, image, source, diagram, fandom, plutoniumVictis, plutoniumMob };
})();