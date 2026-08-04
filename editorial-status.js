(() => {
  'use strict';
  const data = window.DEAD_DROP_DATA;
  if (!data?.games) return;

  for (const game of data.games) {
    for (const map of game.maps || []) {
      if (map.status === 'upcoming') continue;
      map.status = map.id === 'black-ops-2-origins'
        ? 'Deep-audited guide'
        : 'Source-linked · expansion pending';
    }
  }
})();
