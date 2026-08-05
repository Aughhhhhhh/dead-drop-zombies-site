(() => {
  'use strict';
  const data = window.DEAD_DROP_DATA;
  if (!data?.games) return;

  const inheritedChroniclesLocations = {
    'black-ops-3-bo3-nacht-der-untoten': {
      'Musical Easter Egg — Undone': 'Help Room hidden radio',
      'Sniper Cabinet': 'Help Room weapon cabinet'
    },
    'black-ops-3-bo3-verruckt': {
      'Musical Easter Egg — Lullaby for a Deadman': 'Asylum bathroom toilets across both spawn wings',
      'Dentist Drill': 'Dentist chair and drill in the medical wing'
    },
    'black-ops-3-bo3-shi-no-numa': {
      'Musical Easter Egg — The One': 'Comm Room telephone',
      'Peter McCain Radio Trail': 'Starting building and the four swamp huts'
    }
  };

  let maps = 0;
  let mainQuests = 0;
  let sideQuests = 0;
  let steps = 0;

  for (const game of data.games) {
    for (const map of game.maps || []) {
      maps += 1;
      map.requiredGuides = Array.isArray(map.requiredGuides) ? map.requiredGuides : [];
      map.optionalSideQuests = Array.isArray(map.optionalSideQuests) ? map.optionalSideQuests : [];

      const locationMap = inheritedChroniclesLocations[map.id] || {};
      for (const guide of [...map.requiredGuides, ...map.optionalSideQuests]) {
        const inheritedLocation = locationMap[guide.name];
        (guide.steps || []).forEach((entry, index) => {
          if (!entry.title) entry.title = `Step ${index + 1}`;
          if (!entry.location && inheritedLocation) entry.location = inheritedLocation;
        });
      }

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
  data.version = '6.0.1';
  data.updated = '2026-08-04';
})();