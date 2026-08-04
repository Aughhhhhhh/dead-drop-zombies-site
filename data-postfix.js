(() => {
  'use strict';
  const data = window.DEAD_DROP_DATA;
  if (!data?.games) return;

  const coverOverrides = {
    'black-ops-4': 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Black%20Ops%204%20insignia.png',
    'black-ops-6': 'https://commons.wikimedia.org/wiki/Special:Redirect/file/Call%20of%20Duty%202024.jpg',
    'black-ops-7': 'https://commons.wikimedia.org/wiki/Special:Redirect/file/CoDBlackOps7%20Logo.svg'
  };

  for (const game of data.games) {
    if (coverOverrides[game.id]) game.cover = coverOverrides[game.id];
    for (const map of game.maps || []) {
      const attached = new Set(
        (map.mainQuests || []).flatMap((quest) =>
          (quest.steps || []).flatMap((step) => (step.images || []).map((image) => image.src))
        )
      );
      map.visuals = (map.visuals || []).filter((visual) => visual.type !== 'image' || !attached.has(visual.src));
    }
  }
})();
