(() => {
  'use strict';

  const data = window.DEAD_DROP_DATA;
  if (!data?.games) return;

  const BO2_IDS = new Set([
    'black-ops-2-tranzit-green-run',
    'black-ops-2-nuketown-zombies',
    'black-ops-2-die-rise',
    'black-ops-2-mob-of-the-dead',
    'black-ops-2-buried',
    'black-ops-2-origins'
  ]);

  const CODZ_ROOT = 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/';
  const MAP_SOURCE = {
    'black-ops-2-tranzit-green-run': `${CODZ_ROOT}tranzit/`,
    'black-ops-2-nuketown-zombies': 'https://callofduty.fandom.com/wiki/Nuketown_Zombies',
    'black-ops-2-die-rise': `${CODZ_ROOT}die_rise_high_maintenance/`,
    'black-ops-2-mob-of-the-dead': `${CODZ_ROOT}mob_of_the_dead_pop_goes_the_weasel/`,
    'black-ops-2-buried': `${CODZ_ROOT}buried_mined_games/`,
    'black-ops-2-origins': `${CODZ_ROOT}origins_little_lost_girl/`
  };

  const ORIGINS_PAGES = {
    prep: `${CODZ_ROOT}origins_little_lost_girl/secure-the-keys-r3/`,
    ascend: `${CODZ_ROOT}origins_little_lost_girl/ascend-from-darkness-r4/`,
    rain: `${CODZ_ROOT}origins_little_lost_girl/rain-fire-r5/`,
    horde: `${CODZ_ROOT}origins_little_lost_girl/unleash-the-horde-r6/`,
    skewer: `${CODZ_ROOT}origins_little_lost_girl/skewer-the-winged-beast-r7/`,
    fist: `${CODZ_ROOT}origins_little_lost_girl/wield-a-fist-of-iron-r8/`,
    hell: `${CODZ_ROOT}origins_little_lost_girl/raise-hell-r9/`,
    freedom: `${CODZ_ROOT}origins_little_lost_girl/freedom-r10/`
  };

  const MOB_PAGES = [
    ['hell', `${CODZ_ROOT}mob_of_the_dead_pop_goes_the_weasel/obtain-the-hells-retriever-r106/`],
    ['plane', `${CODZ_ROOT}mob_of_the_dead_pop_goes_the_weasel/build-and-ride-plane-r107/`],
    ['spoon', `${CODZ_ROOT}mob_of_the_dead_pop_goes_the_weasel/find-spoons-r108/`],
    ['skull', `${CODZ_ROOT}mob_of_the_dead_pop_goes_the_weasel/find-skulls-r109/`],
    ['blundergat', `${CODZ_ROOT}mob_of_the_dead_pop_goes_the_weasel/upgrade-the-blundergat-r110/`],
    ['volt', `${CODZ_ROOT}mob_of_the_dead_pop_goes_the_weasel/zap-the-volt-meters-in-citadel-tunnels-r111/`],
    ['audio', `${CODZ_ROOT}mob_of_the_dead_pop_goes_the_weasel/collect-audio-logs-r112/`],
    ['afterlife', `${CODZ_ROOT}mob_of_the_dead_pop_goes_the_weasel/take-the-plane-in-the-afterlife-r113/`],
    ['cycle', `${CODZ_ROOT}mob_of_the_dead_pop_goes_the_weasel/break-or-continue-the-cycle-r114/`]
  ];

  const SOLVED_BURIED_CIPHER = 'https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cfl_progressive%2Cq_auto%3Agood%2Cw_700/MTc0NDU1MzgyNzg1MTQwMDcy/decode-the-cypher-easter-egg-step-call-of-duty-black-ops-2-zombies.jpg';
  const SOLVED_BURIED_CIPHER_SOURCE = 'https://discover.hubpages.com/games-hobbies/Decode-The-Cypher-Easter-Egg-Step-Call-of-Duty-Black-Ops-2-Zombies';

  const sourceImage = (src, title, caption, creditUrl) => ({ src, title, caption, creditUrl, mediaKind: /\.gif(?:\?|$)/i.test(src) ? 'Gameplay GIF' : 'Gameplay image' });
  const row = (label, value) => ({ label, value });
  const reference = (title, rows, note = '') => ({ title, rows, note });

  function htmlDecode(value = '') {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = value;
    return textarea.value;
  }

  function generatedVisual(image) {
    const src = String(image?.src || '');
    return src.startsWith('data:image/svg+xml') || src.startsWith('/assets/bo2/') || src.startsWith('/assets/origins/');
  }

  function referenceFromGeneratedVisual(image) {
    const src = String(image?.src || '');
    if (!src.startsWith('data:image/svg+xml')) return null;
    try {
      const payload = src.slice(src.indexOf(',') + 1);
      const svg = decodeURIComponent(payload);
      const labels = [...svg.matchAll(/<text[^>]*>([\s\S]*?)<\/text>/gi)]
        .map((match) => htmlDecode(match[1].replace(/<[^>]+>/g, '').trim()))
        .filter(Boolean)
        .filter((value, index, array) => array.indexOf(value) === index);
      if (!labels.length) return null;
      return reference(image.title || labels[0] || 'Quick reference', labels.map((value, index) => row(String(index + 1).padStart(2, '0'), value)), image.caption || 'Converted from the former diagram so every line is searchable and copyable.');
    } catch {
      return null;
    }
  }

  function allSteps(map) {
    return [
      ...(map.mainQuests || []).flatMap((quest) => quest.steps || []),
      ...(map.requiredGuides || []).flatMap((guide) => guide.steps || []),
      ...(map.optionalSideQuests || []).flatMap((guide) => guide.steps || [])
    ];
  }

  function addReference(step, item) {
    if (!item) return;
    step.references = Array.isArray(step.references) ? step.references : [];
    const key = `${item.title}|${JSON.stringify(item.rows || [])}`;
    if (!step.references.some((entry) => `${entry.title}|${JSON.stringify(entry.rows || [])}` === key)) step.references.push(item);
  }

  function addImage(step, item) {
    if (!item) return;
    step.images = Array.isArray(step.images) ? step.images : [];
    if (!step.images.some((entry) => entry.src === item.src)) step.images.push(item);
  }

  function findMap(id) {
    for (const game of data.games) {
      const map = (game.maps || []).find((entry) => entry.id === id);
      if (map) return map;
    }
    return null;
  }

  function findStep(map, pattern) {
    return allSteps(map).find((step) => pattern.test(`${step.title || ''} ${step.location || ''} ${step.body || ''}`));
  }

  function questSource(mapId, quest, step) {
    const text = `${quest?.name || ''} ${step?.title || ''}`.toLowerCase();
    if (mapId === 'black-ops-2-tranzit-green-run') {
      if (/turn off|power down/.test(text)) return `${CODZ_ROOT}tranzit/maxis_steps_the_tower_of_babble/turn-off-the-power-r63/`;
      if (/avogadro|electric man|kill him/.test(text)) return `${CODZ_ROOT}tranzit/maxis_steps_the_tower_of_babble/kill-him-r64/`;
      if (/lamp|turbine/.test(text) && /maxis/.test(`${quest?.name || ''}`.toLowerCase())) return `${CODZ_ROOT}tranzit/maxis_steps_the_tower_of_babble/use-the-turbines-r65/`;
      if (/jet gun|115|explosive/.test(text)) return `${CODZ_ROOT}tranzit/richtofen_steps_the_tower_of_babble/harness-115-r61/`;
      if (/emp|four different|reduce/.test(text)) return `${CODZ_ROOT}tranzit/richtofen_steps_the_tower_of_babble/reduce-power-r62/`;
    }
    if (mapId === 'black-ops-2-die-rise') {
      if (/ball|sliquifier/.test(text)) return `${CODZ_ROOT}die_rise_high_maintenance/richtofens-path/get-the-balls-wet-r86/`;
      if (/trample|sacrifice/.test(text)) return `${CODZ_ROOT}die_rise_high_maintenance/richtofens-path/make-a-sacrifice-r87/`;
      if (/buddha|reincarnation/.test(text)) return `${CODZ_ROOT}die_rise_high_maintenance/maxis-path/reincarnation-r89/`;
      if (/krauss|revive/.test(text)) return `${CODZ_ROOT}die_rise_high_maintenance/maxis-path/krauss-defibrillator-r90/`;
      if (/mahjong|tower corner|satellite/.test(text)) return `${CODZ_ROOT}die_rise_high_maintenance/maxis-path/mahjong-tiles-r92/`;
    }
    if (mapId === 'black-ops-2-mob-of-the-dead') {
      const hit = MOB_PAGES.find(([needle]) => text.includes(needle));
      if (hit) return hit[1];
      if (/retriever|dog/.test(text)) return MOB_PAGES[0][1];
      if (/bridge|plane/.test(text)) return MOB_PAGES[1][1];
    }
    if (mapId === 'black-ops-2-buried') {
      if (/cipher|sign|wisp/.test(text)) return `${CODZ_ROOT}buried_mined_games/richtofen-steps-mined-games/decipher-the-code-summon-the-wisp-r197/`;
      if (/target|sharpshooter|wish/.test(text)) return `${CODZ_ROOT}buried_mined_games/richtofen-steps-mined-games/sharpshooter-challenge-r201/`;
      if (/bell|surface/.test(text)) return `${CODZ_ROOT}buried_mined_games/maxis-steps-mined-games/direct-the-energy-to-the-surface-r207/`;
      if (/nav|endgame|unlimited/.test(text)) return `${CODZ_ROOT}buried_mined_games/endgame/`;
    }
    if (mapId === 'black-ops-2-origins') {
      if (/prepare|staff|key/.test(text)) return ORIGINS_PAGES.prep;
      if (/ascend|place.*staff/.test(text)) return ORIGINS_PAGES.ascend;
      if (/rain fire|seal|g-strike/.test(text)) return ORIGINS_PAGES.rain;
      if (/horde|drone.*pit|panzer/.test(text)) return ORIGINS_PAGES.horde;
      if (/skewer|plane|pilot/.test(text)) return ORIGINS_PAGES.skewer;
      if (/fist|templar|crusader/.test(text)) return ORIGINS_PAGES.fist;
      if (/raise hell|crazy place|portal/.test(text)) return ORIGINS_PAGES.hell;
      if (/freedom|ending|blue rock/.test(text)) return ORIGINS_PAGES.freedom;
    }
    return MAP_SOURCE[mapId];
  }

  for (const game of data.games) {
    for (const map of game.maps || []) {
      if (!BO2_IDS.has(map.id)) continue;

      map.mediaPolicy = 'Source-linked gameplay media only; generated route diagrams removed.';
      map.sourceGuideIndex = MAP_SOURCE[map.id];
      map.sources = Array.isArray(map.sources) ? map.sources : [];
      if (!map.sources.some((entry) => entry.url === MAP_SOURCE[map.id])) {
        map.sources.unshift({ title: 'Call of Duty Zombies — complete map guide index', url: MAP_SOURCE[map.id], note: 'Primary step-by-step media and walkthrough index used for the BO2 editorial pass.' });
      }

      for (const quest of map.mainQuests || []) {
        for (const step of quest.steps || []) {
          const generated = (step.images || []).filter(generatedVisual);
          for (const visual of generated) addReference(step, referenceFromGeneratedVisual(visual));
          step.images = (step.images || []).filter((image) => !generatedVisual(image));
          step.sourceUrl = step.sourceUrl || questSource(map.id, quest, step);
          step.sourceLabel = 'Source walkthrough and gameplay media';
        }
      }

      for (const guide of [...(map.requiredGuides || []), ...(map.optionalSideQuests || [])]) {
        for (const step of guide.steps || []) {
          const generated = (step.images || []).filter(generatedVisual);
          for (const visual of generated) addReference(step, referenceFromGeneratedVisual(visual));
          step.images = (step.images || []).filter((image) => !generatedVisual(image));
          step.sourceUrl = step.sourceUrl || MAP_SOURCE[map.id];
          step.sourceLabel = 'Source guide';
        }
      }

      map.visuals = (map.visuals || []).filter((visual) => !generatedVisual(visual));
    }
  }

  const buried = findMap('black-ops-2-buried');
  if (buried) {
    const cipherStep = findStep(buried, /decode|cipher|three wall lines|tunnel signs/i);
    if (cipherStep) {
      cipherStep.images = (cipherStep.images || []).filter((image) => !/bur1\.png|pigpen|tic-tac-toe cipher key/i.test(`${image.src} ${image.title}`));
      addImage(cipherStep, sourceImage(
        SOLVED_BURIED_CIPHER,
        'Solved Buried tunnel-sign patterns',
        'Compare each 17-symbol line directly with these five solved phrases. You do not need to decode the full alphabet during the match.',
        SOLVED_BURIED_CIPHER_SOURCE
      ));
      addReference(cipherStep, reference('Solved tunnel-sign lookup', [
        row('06', 'BONE ORCHARD VEIN'),
        row('08', 'LUNGER UNDERMINES'),
        row('10', 'CONSUMPTION CROSS'),
        row('11', 'DRY GULCHER SHAFT'),
        row('12', 'GROUND BITER PITS')
      ], 'Use the second symbol as the key. Count forward to the first identical symbol; the matching position identifies the sign. Spaces count as characters.'));
      cipherStep.sourceUrl = `${CODZ_ROOT}buried_mined_games/richtofen-steps-mined-games/decipher-the-code-summon-the-wisp-r197/`;
    }
  }

  const origins = findMap('black-ops-2-origins');
  if (origins) {
    const rain = findStep(origins, /Rain Fire|open the seal|Generator 5/i);
    if (rain) {
      addImage(rain, sourceImage(
        'https://www.callofdutyzombies.com/uploads/monthly_2020_03/1938076494_GIANTBUTTON.gif.6f5f70fa40916b8f37aa45717e4bb750.gif',
        'Press the red button inside the Giant Robot',
        'The player inside the robot presses this button while the outside player is already waiting beside the Generator 5 seal with a G-Strike primed.',
        ORIGINS_PAGES.rain
      ));
      addImage(rain, sourceImage(
        'https://www.callofdutyzombies.com/uploads/monthly_2020_03/869225317_OPENTHEPIT.gif.825b50ddfd3202da9ad2a7bcf7719dda.gif',
        'G-Strike target at Generator 5',
        'Throw directly onto the circular stone seal before the short robot-button timing window closes.',
        ORIGINS_PAGES.rain
      ));
      addReference(rain, reference('Rain Fire timing checklist', [
        row('Outside player', 'Wait beside the circular seal outside Generator 5 with a G-Strike equipped.'),
        row('Inside player', 'Enter the lit robot foot that crosses the Generator 5 footprint lane and reach the red button.'),
        row('Callout', 'Press the button, immediately call the throw, and land the G-Strike in the centre of the seal.'),
        row('Success', 'The circular seal opens into a visible pit. If it remains closed, repeat the robot cycle.')
      ]));
    }

    const horde = findStep(origins, /Unleash the Horde|opened pit|Maxis Drone.*pit/i);
    if (horde) {
      addImage(horde, sourceImage(
        'https://www.callofdutyzombies.com/uploads/monthly_2020_03/1746729715_INTOTHEPIT.gif.2134eef423198ed61db1fcf72b001a61.gif',
        'Deploy the Maxis Drone into the opened pit',
        'Stand next to the opening, face into it, and deploy the Drone. It must fly down into the pit rather than hover beside the player.',
        ORIGINS_PAGES.horde
      ));
      addReference(horde, reference('Drone deployment and Panzer wave', [
        row('Position', 'Stand directly beside the open Generator 5 pit and face its centre.'),
        row('Deploy', 'Equip the Maxis Drone and use it while aimed into the opening.'),
        row('Failure cue', 'If it hovers normally or follows you, it did not enter the pit. Recover it from its original workbench after the timer.'),
        row('Success cue', 'The Drone descends and the Panzer Soldat wave begins. Kill every Panzer to advance.')
      ]));
    }

    const droneGuide = (origins.requiredGuides || []).find((guide) => /Maxis Drone/i.test(guide.name));
    if (droneGuide) {
      const first = droneGuide.steps?.[0];
      if (first) {
        addImage(first, sourceImage('https://www.callofdutyzombies.com/uploads/monthly_2021_02/brain.png.bb0d8d65f776abb030ea68883d60258c.png', 'Maxis Drone brain', 'The brain has one fixed location in the starting laboratory.', ORIGINS_PAGES.horde));
        addImage(first, sourceImage('https://www.callofdutyzombies.com/uploads/monthly_2021_02/body.png.92c20f119b20190fb1784bd9aab02720.png', 'Maxis Drone frame', 'The frame rotates among its three listed Ice/Church-side positions.', ORIGINS_PAGES.horde));
        addImage(first, sourceImage('https://www.callofdutyzombies.com/uploads/monthly_2021_02/rotor.png.09c0fa55fe80996bc0b6b2285c50aee0.png', 'Maxis Drone rotor', 'The rotor rotates among its three Excavation Site positions.', ORIGINS_PAGES.horde));
        addReference(first, reference('Maxis Drone parts', [
          row('Brain', 'Starting laboratory desk on the lower floor beside the stairs toward Generator 1.'),
          row('Frame A', 'Ice tunnel, in front of the Crazy Place portal.'),
          row('Frame B', 'Tank path toward Generator 4 beside the skull-and-crossbones sign.'),
          row('Frame C', 'Tank path toward Generator 5 beside the skull-and-crossbones sign.'),
          row('Rotor A', 'Bottom Excavation scaffold box beside a ring lever.'),
          row('Rotor B', 'Top of Excavation near Pack-a-Punch.'),
          row('Rotor C', 'Excavation hidden-stair / secret-entrance area.')
        ], 'Build at the Generator 2–3 Workshop, Wind Tunnel entrance, or Church workbench. The Drone returns to the same bench after its timer.'));
      }
    }

    const fist = findStep(origins, /Wield a Fist of Iron|white-armoured|Templar|Crusader/i);
    if (fist) addImage(fist, sourceImage(
      'https://www.callofdutyzombies.com/uploads/monthly_2020_03/FISTS.gif.dde6be0e1b89e323473032ef6f15276a.gif',
      'Iron Fist melee progression',
      'Each player must personally melee the glowing Crusader/Templar zombies beneath the Excavation Site until that player receives the upgraded fist.',
      ORIGINS_PAGES.fist
    ));

    const freedom = findStep(origins, /Freedom|ending|blue rock|central beam/i);
    if (freedom) addImage(freedom, sourceImage(
      'https://www.callofdutyzombies.com/uploads/monthly_2020_03/935094161_AscendFromDarkness.gif.7e44f5ea928971aa5ec58d003cf63928.gif',
      'Final Crazy Place portal interaction',
      'After the upgraded Drone enters the portal, interact with the central light only when the squad is ready to end the match.',
      ORIGINS_PAGES.freedom
    ));
  }

  data.version = '7.1.0';
  data.updated = '2026-08-05';
})();