(() => {
  'use strict';
  const data = window.DEAD_DROP_DATA;
  if (!data?.games) return;

  let maps = 0;
  let mainQuests = 0;
  let sideQuests = 0;
  let steps = 0;

  for (const game of data.games) {
    for (const map of game.maps || []) {
      maps += 1;
      map.requiredGuides = Array.isArray(map.requiredGuides) ? map.requiredGuides : [];
      map.optionalSideQuests = Array.isArray(map.optionalSideQuests) ? map.optionalSideQuests : [];
      map.sideQuests = [...map.requiredGuides, ...map.optionalSideQuests];
      mainQuests += (map.mainQuests || []).length;
      sideQuests += map.sideQuests.length;
      for (const quest of map.mainQuests || []) steps += (quest.steps || []).length;
      for (const quest of map.sideQuests) steps += (quest.steps || []).length;

      const attached = new Set(
        (map.mainQuests || []).flatMap((quest) =>
          (quest.steps || []).flatMap((entry) => (entry.images || []).map((visual) => visual.src))
        )
      );
      map.visuals = (map.visuals || []).filter((visual) => visual.type !== 'image' || !attached.has(visual.src));
    }
  }

  data.stats = {
    games: data.games.length,
    maps,
    mainQuests,
    sideQuests,
    steps
  };
  data.version = '6.0.0';
  data.updated = '2026-08-04';
})();