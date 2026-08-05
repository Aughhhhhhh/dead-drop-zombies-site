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
  const findMap = (id) => {
    for (const game of data.games) {
      const map = (game.maps || []).find((entry) => entry.id === id);
      if (map) return map;
    }
    return null;
  };
  const findGuide = (map, name) => [...(map?.requiredGuides || []), ...(map?.optionalSideQuests || [])]
    .find((guide) => guide.name === name);
  const append = (entry, text) => {
    if (entry && !entry.body.includes(text)) entry.body = `${entry.body} ${text}`;
  };

  const tranzit = findMap('black-ops-2-tranzit-green-run');
  const carrion = findGuide(tranzit, '“Carrion” musical Easter egg');
  append(carrion?.steps?.[0], 'The bear is outside the starting building rather than inside the locked Bus Depot room; wait for the interaction sound before leaving for Farm.');
  append(carrion?.steps?.[1], 'Climb to the farmhouse upper floor and check the mattress surface carefully; the small bear can blend into the bedding and debris.');

  const nuketown = findMap('black-ops-2-nuketown-zombies');
  const lullaby = findGuide(nuketown, '“Samantha’s Lullaby”');
  append(lullaby?.steps?.[0], 'Enter the bus through either open side and check the passenger seat rather than shooting the bear; this secret uses the interact button.');
  append(lullaby?.steps?.[1], 'Go upstairs, enter the bedroom, and aim at the bear on the top bunk until the interaction registers before moving to the green house.');

  const dieRise = findMap('black-ops-2-die-rise');
  const fallDown = findGuide(dieRise, '“We All Fall Down” musical Easter egg');
  append(fallDown?.steps?.[0], 'Approach the shelf from the SVU walkway and hold interact directly on the bear; shooting it does not count toward the song.');
  append(fallDown?.steps?.[1], 'The bear sits among the sewing equipment in the power room, so clear the room and listen for the activation cue before leaving.');

  const mob = findMap('black-ops-2-mob-of-the-dead');
  const mobQuest = (mob?.mainQuests || []).find((quest) => quest.id === 'pop-goes-the-weasel');
  append(mobQuest?.steps?.[3], 'The headphone floats along the Citadel route above the number pad. Walk through it, then remain alive and nearby until Stanley Ferguson finishes the entire recording.');
  append(mobQuest?.steps?.[4], 'Enter the Double Tap room and walk through the floating headphone in the centre. Do not run toward the next area until the narration and visual effect fully end.');
  append(mobQuest?.steps?.[5], 'Use the elevated Cell Block walkway connecting the Warden’s Office and Cafeteria. The headphone appears along the route near the Cerberus feeding area after the previous log finishes.');
  append(mobQuest?.steps?.[6], 'Enter the Infirmary from the upper Cell Blocks and check the stairway and doorway transition. Collect the headphone only after the Cell Block narration has ended.');

  const buried = findMap('black-ops-2-buried');
  const chalk = findGuide(buried, 'Chalk wall weapons — all placement rewards');
  append(chalk?.steps?.[0], 'A player may carry only one outline, so immediately deliver it to a blank question-mark wall before returning for another chalk weapon.');
  const always = findGuide(buried, '“Always Running” musical Easter egg');
  append(always?.steps?.[0], 'Enter the mine approach from the Town side and check beside the hay near Quick Revive; hold interact rather than shooting the teddy.');
  append(always?.steps?.[1], 'Search the candy barrels throughout the store and aim into the barrel containing the bear until the activation sound plays.');
  append(always?.steps?.[2], 'Enter the Mansion carefully, move to the right-side room containing Double Tap II, and interact with the bear placed near the room corner.');
  const cipher = findGuide(buried, 'Cipher and five tunnel signs — complete solving method');
  if (cipher?.steps?.[0]) {
    cipher.steps[0].code = 'DRY GULCHER SHAFT · LUNGER UNDERMINES · CONSUMPTION CROSS · GROUND BITER PITS · BONE ORCHARD VEIN';
    append(cipher.steps[0], 'The output can only be DRY GULCHER SHAFT, LUNGER UNDERMINES, CONSUMPTION CROSS, GROUND BITER PITS, or BONE ORCHARD VEIN; record the three selected phrases before entering the tunnels.');
  }

  const origins = findMap('black-ops-2-origins');
  const drone = findGuide(origins, 'Maxis Drone — every part and correct workbench behavior');
  append(drone?.steps?.[0], 'Walk down from the starting room toward the Generator 1 staircase and inspect the laboratory desk surface; this brain spawn is fixed in every match.');
  const punch = findGuide(origins, 'One Inch Punch — four soul chests');
  append(punch?.steps?.[1], 'Keep every kill inside the footprint boundary and watch for the white soul stream entering the open chest before counting the kill.');
  append(punch?.steps?.[2], 'Use the same method at the mound-side footprint and keep the last zombie outside the box until the squad is ready to continue filling it.');
  append(punch?.steps?.[3], 'The Church chest sits in Freya’s footprint, so watch the robot cycle and avoid filling it immediately before Freya is due to step on the unfinished box.');
  const magna = findGuide(origins, 'Free Magna Collider using the Maxis Drone');
  append(magna?.steps?.[3], 'Climb the Church-facing mound scaffolding, deploy the Drone near the yellow disc, and wait until it visibly flies away from the player to collect it.');
  const blood = findGuide(origins, 'Repeatable free Zombie Blood from the Ice Staff');
  append(blood?.steps?.[1], 'Stand across from the MP40 wall-buy and sweep the nearby burning cart with Ice Staff shots until every flame is visibly extinguished.');
  append(blood?.steps?.[2], 'Move behind the Stamin-Up machine toward the mound-facing wall, locate the burning cart, and extinguish it before collecting the reward.');
  const archangel = findGuide(origins, '“Archangel” musical Easter egg');
  append(archangel?.steps?.[0], 'Enter the starting laboratory and inspect the corner immediately to the right of the Rituals of the Ancients reward chest; hold interact on the green meteor fragment.');
  append(archangel?.steps?.[1], 'Climb to the Workshop upper floor and look beneath the storage shelves for the second green fragment, then hold interact until the sound cue plays.');
  append(archangel?.steps?.[2], 'At No Man’s Land, search the crates beside the large Excavation Site sign and interact with the final green fragment to begin the song.');

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

  data.stats = { games: data.games.length, maps, mainQuests, sideQuests, steps };
  data.version = '7.0.0';
  data.updated = '2026-08-05';
})();