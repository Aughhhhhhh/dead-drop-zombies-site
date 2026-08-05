(() => {
  'use strict';
  const data = window.DEAD_DROP_DATA;
  if (!data?.games) return;

  const bo2Ids = new Set([
    'black-ops-2-tranzit-green-run',
    'black-ops-2-nuketown-zombies',
    'black-ops-2-die-rise',
    'black-ops-2-mob-of-the-dead',
    'black-ops-2-buried',
    'black-ops-2-origins'
  ]);

  let maps = 0;
  let mainQuests = 0;
  let sideQuests = 0;
  let steps = 0;

  for (const game of data.games) {
    for (const map of game.maps || []) {
      maps += 1;
      map.requiredGuides = Array.isArray(map.requiredGuides) ? map.requiredGuides : [];
      map.optionalSideQuests = Array.isArray(map.optionalSideQuests) ? map.optionalSideQuests : [];

      if (bo2Ids.has(map.id)) {
        map.status = 'Beginner-depth audited';
        map.auditStatus = 'beginner-depth';

        const seen = new Set();
        map.requiredGuides = map.requiredGuides.filter((guide) => {
          if (!guide?.name || seen.has(guide.name)) return false;
          seen.add(guide.name);
          return true;
        });
        map.optionalSideQuests = map.optionalSideQuests.filter((guide) => {
          if (!guide?.name || seen.has(guide.name)) return false;
          seen.add(guide.name);
          return true;
        });
      }

      map.sideQuests = [...map.requiredGuides, ...map.optionalSideQuests];
      mainQuests += (map.mainQuests || []).length;
      sideQuests += map.sideQuests.length;
      for (const quest of map.mainQuests || []) steps += (quest.steps || []).length;
      for (const guide of map.sideQuests) steps += (guide.steps || []).length;

      const attached = new Set([
        ...(map.mainQuests || []).flatMap((quest) => (quest.steps || []).flatMap((entry) => (entry.images || []).map((visual) => visual.src))),
        ...map.sideQuests.flatMap((guide) => (guide.steps || []).flatMap((entry) => (entry.images || []).map((visual) => visual.src)))
      ]);
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
  data.version = '7.0.0';
  data.updated = '2026-08-05';
})();