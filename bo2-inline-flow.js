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

  const SOLVED_BURIED_CIPHER = 'https://images.saymedia-content.com/.image/c_limit%2Ccs_srgb%2Cfl_progressive%2Cq_auto%3Agood%2Cw_900/MTc0NDU1MzgyNzg1MTQwMDcy/decode-the-cypher-easter-egg-step-call-of-duty-black-ops-2-zombies.jpg';
  const SOLVED_BURIED_SOURCE = 'https://discover.hubpages.com/games-hobbies/Decode-The-Cypher-Easter-Egg-Step-Call-of-Duty-Black-Ops-2-Zombies';
  const MEDIA_HOSTS = new Set(['www.callofdutyzombies.com', 'callofdutyzombies.com', 'images.saymedia-content.com']);

  const proxyMedia = (src = '') => {
    try {
      const url = new URL(src, location.origin);
      if (url.origin === location.origin || !MEDIA_HOSTS.has(url.hostname)) return src;
      return `/api/media?src=${encodeURIComponent(url.href)}`;
    } catch {
      return src;
    }
  };

  const allSteps = (map) => [
    ...(map.mainQuests || []).flatMap((quest) => quest.steps || []),
    ...(map.requiredGuides || []).flatMap((guide) => guide.steps || []),
    ...(map.optionalSideQuests || []).flatMap((guide) => guide.steps || [])
  ];

  const isBrokenGeneratedReference = (reference) => {
    const note = String(reference?.note || '');
    const rows = reference?.rows || [];
    if (/converted from the former diagram/i.test(note)) return true;
    if (rows.length >= 4 && rows.every((row, index) => String(row?.label || '') === String(index + 1).padStart(2, '0'))) return true;
    return false;
  };

  const findMap = (id) => data.games.flatMap((game) => game.maps || []).find((map) => map.id === id);
  const findStepIndex = (quest, pattern) => {
    const index = (quest.steps || []).findIndex((step) => pattern.test(`${step.title || ''} ${step.location || ''} ${step.body || ''}`));
    return index >= 0 ? index : 0;
  };
  const matchingGuides = (guides, patterns) => guides.filter((guide) => patterns.some((pattern) => pattern.test(guide.name || '')));
  const addGuides = (quest, stepPattern, guides) => {
    if (!guides.length || !(quest.steps || []).length) return;
    const index = findStepIndex(quest, stepPattern);
    const step = quest.steps[index];
    step.inlineGuides = Array.isArray(step.inlineGuides) ? step.inlineGuides : [];
    for (const guide of guides) {
      if (!step.inlineGuides.some((entry) => entry.name === guide.name)) step.inlineGuides.push(guide);
    }
  };

  for (const game of data.games) {
    for (const map of game.maps || []) {
      if (!BO2_IDS.has(map.id)) continue;

      for (const step of allSteps(map)) {
        step.references = (step.references || []).filter((reference) => !isBrokenGeneratedReference(reference));
        step.images = (step.images || []).map((image) => ({
          ...image,
          originalSrc: image.originalSrc || image.src,
          src: proxyMedia(image.src)
        }));
      }

      const required = [...(map.requiredGuides || [])];
      const quests = map.mainQuests || [];
      for (const quest of quests) {
        quest.startingRequirements = [...(map.requirements || [])];
      }

      if (map.id === 'black-ops-2-tranzit-green-run') {
        for (const quest of quests) {
          const richtofen = /richtofen/i.test(quest.name || '');
          addGuides(quest, /power|release|avogadro|keep power/i, matchingGuides(required, [/power switch/i]));
          if (richtofen) {
            addGuides(quest, /jet gun|break|pylon|harness/i, matchingGuides(required, [/jet gun|thrustodyne/i]));
          } else {
            addGuides(quest, /turbine|pylon|lamp/i, matchingGuides(required, [/turbine/i]));
          }
        }
      } else if (map.id === 'black-ops-2-die-rise') {
        for (const quest of quests) {
          const richtofen = /richtofen/i.test(quest.name || '');
          addGuides(quest, /first|elevator|symbol|prepare/i, matchingGuides(required, [/trample steam/i]));
          if (richtofen) addGuides(quest, /sliquifier|ball|dragon/i, matchingGuides(required, [/sliquifier/i]));
          else addGuides(quest, /krauss|revive|buddha|reincarnation/i, matchingGuides(required, [/krauss|ballistic knife|refibrillator/i]));
        }
      } else if (map.id === 'black-ops-2-origins') {
        const quest = quests[0];
        if (quest) {
          addGuides(quest, /finish every|required build|staff|secure/i, matchingGuides(required, [/staff of fire|fire staff/i, /staff of lightning|lightning staff/i, /staff of ice|ice staff/i, /staff of wind|wind staff/i]));
          addGuides(quest, /rain fire|red button|g-strike|seal/i, matchingGuides(required, [/g-strike/i]));
          addGuides(quest, /unleash|horde|maxis drone|pit/i, matchingGuides(required, [/maxis drone/i]));
          addGuides(quest, /fist of iron|one inch|templar|crusader/i, matchingGuides(required, [/one inch punch/i]));
        }
      } else {
        for (const quest of quests) addGuides(quest, /.*/, required);
      }

      const used = new Set(quests.flatMap((quest) => (quest.steps || []).flatMap((step) => (step.inlineGuides || []).map((guide) => guide.name))));
      const unmatched = required.filter((guide) => !used.has(guide.name));
      for (const quest of quests) addGuides(quest, /.*/, unmatched);

      map.requiredGuides = [];
      map.requirements = [];
      map.sideQuests = [...(map.optionalSideQuests || [])];
      map.mediaPolicy = 'Gameplay images and GIFs render through Dead Drop; source links remain attribution only.';
    }
  }

  const buried = findMap('black-ops-2-buried');
  if (buried) {
    const cipherStep = allSteps(buried).find((step) => /cipher|three wall lines|tunnel signs/i.test(`${step.title || ''} ${step.body || ''}`));
    if (cipherStep) {
      const exactImage = {
        src: proxyMedia(SOLVED_BURIED_CIPHER),
        originalSrc: SOLVED_BURIED_CIPHER,
        title: 'Exact solved Buried cipher reference',
        caption: 'Match each line on the Gunsmith wall directly to one of these five complete symbol sequences.',
        creditUrl: SOLVED_BURIED_SOURCE,
        mediaKind: 'Solved cipher image'
      };
      cipherStep.images = [
        exactImage,
        ...(cipherStep.images || []).filter((image) => !/cipher|tunnel-sign|buried.*sign|saymedia-content/i.test(`${image.title || ''} ${image.originalSrc || image.src || ''}`))
      ];
      cipherStep.references = (cipherStep.references || []).filter((reference) => !/solved tunnel-sign|cipher|five possible tunnel/i.test(reference.title || ''));
      cipherStep.references.unshift({
        title: 'Cipher answer lookup',
        rows: [
          { label: 'DRY', value: 'DRY GULCHER SHAFT' },
          { label: 'LUNGER', value: 'LUNGER UNDERMINES' },
          { label: 'CONSUMPTION', value: 'CONSUMPTION CROSS' },
          { label: 'GROUND', value: 'GROUND BITER PITS' },
          { label: 'BONE', value: 'BONE ORCHARD VEIN' }
        ],
        note: 'Compare the full symbol line to the image above. After identifying all three names, punch those three matching signs in the upper tunnels quickly with Galvaknuckles or the Bowie Knife.'
      });
    }
  }

  let maps = 0;
  let mainQuests = 0;
  let sideQuests = 0;
  let steps = 0;
  for (const game of data.games) {
    for (const map of game.maps || []) {
      maps += 1;
      mainQuests += (map.mainQuests || []).length;
      sideQuests += (map.optionalSideQuests || []).length;
      steps += (map.mainQuests || []).reduce((sum, quest) => sum + (quest.steps || []).length, 0);
      steps += (map.optionalSideQuests || []).reduce((sum, guide) => sum + (guide.steps || []).length, 0);
    }
  }
  data.stats = { games: data.games.length, maps, mainQuests, sideQuests, steps };
  data.version = '7.2.0';
  data.updated = '2026-08-05';
})();
