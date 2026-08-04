(() => {
  'use strict';

  const data = window.DEAD_DROP_DATA;
  if (!data || !Array.isArray(data.games)) return;

  const normalize = (value = '') => String(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

  const words = (value = '') => normalize(value)
    .split(/\s+/)
    .filter((word) => word.length > 3 && !['with', 'from', 'that', 'this', 'into', 'your', 'every', 'main', 'quest', 'side', 'weapon', 'weapons', 'upgrade', 'upgrades'].includes(word));

  const REQUIRED_GUIDE_OVERRIDES = {
    'black-ops-2-origins': [
      'Fire Staff — Kagutsuchi’s Blood',
      'Lightning Staff — Kimat’s Bite',
      'Ice Staff — Ull’s Arrow',
      'Wind Staff — Boreas’ Fury',
      'G-Strike Beacon',
      'One Inch Punch'
    ],
    'black-ops-3-der-eisendrache': ['Lightning Bow', 'Wolf Bow', 'Void Bow', 'Fire Bow'],
    'black-ops-4-voyage-of-despair': ['Kraken and elemental variants'],
    'black-ops-4-ix': ['Brazen Bull'],
    'black-ops-cold-war-die-maschine': ['Four D.I.E. variants'],
    'black-ops-cold-war-mauer-der-toten': ['Klaus upgrades'],
    'black-ops-6-the-tomb': ['Staff of Ice'],
    'black-ops-7-ashes-of-the-damned': ['Necrofluid Gauntlet', 'Ol’ Tessie upgrades'],
    'black-ops-7-totenreich': ['Jotunn Star'],
    'black-ops-7-kowakujo': ['Nekomancer', 'Maneki-neko grenades']
  };

  const originVisuals = {
    fire: { src: '/assets/origins/fire_staff_reference.png', title: 'Fire Staff church-symbol reference', caption: 'Read the lit church symbols, convert them with the chart, then shoot the matching torches plus the bloodstain torch.' },
    lightning: { src: '/assets/origins/lightning_staff_reference.png', title: 'Lightning Staff piano and dial reference', caption: 'Piano chords: 1-3-6, 3-5-7, 2-4-6. The panel directions are shown beside the keyboard.' },
    ice: { src: '/assets/origins/ice_staff_reference.png', title: 'Ice Staff symbol reference', caption: 'Match the ceiling dot pattern to its corresponding wall symbol in the Crazy Place.' },
    wind: { src: '/assets/origins/wind_staff_reference.png', title: 'Wind Staff ring solution', caption: 'Rotate the Crazy Place rings to the fixed Wind solution before completing the smoke-ball route.' },
    seal: { src: '/assets/origins/rain-fire-seal.svg', title: 'Rain Fire seal location', caption: 'The target is the circular stone seal outside Generator 5, beside the Stamin-Up route and inside the robot-footprint lane.' },
    pit: { src: '/assets/origins/maxis-drone-pit.svg', title: 'Opened seal and Maxis Drone placement', caption: 'After Rain Fire opens the seal, stand beside the opening and deploy the Maxis Drone so it flies down into the pit.' }
  };

  const getMap = (id) => {
    for (const game of data.games) {
      const map = game.maps.find((entry) => entry.id === id);
      if (map) return map;
    }
    return null;
  };

  const origins = getMap('black-ops-2-origins');
  if (origins) {
    origins.requirements = [
      'All six generators active at least once',
      'All four Elemental Staffs fully upgraded',
      'Maxis Drone built',
      'G-Strike Beacon acquired',
      'One Inch Punch acquired by every player',
      'A reliable Panzer-killing loadout'
    ];

    const quest = origins.mainQuests.find((entry) => entry.id === 'little-lost-girl');
    if (quest) {
      quest.summary = 'A complete route through the staff preparation, robot seal, Maxis Drone, Zombie Blood, Iron Fist, Crazy Place soul charge, and optional ending.';
      quest.steps = [
        {
          title: 'Finish every required preparation quest',
          location: 'Across Origins before beginning the robot-placement step',
          body: 'Build and fully upgrade the Fire, Lightning, Ice, and Wind Staffs. Build the Maxis Drone. Complete the G-Strike tablet route. Every player must also earn the One Inch Punch before the Iron Fist stage. Keep all six generators active at least once during the match.',
          tip: 'Complete the staff guides below in parallel. The Fire Staff cannot be fully built until the first Panzer Soldat has spawned.',
          success: 'All four staff names show their upgraded forms, the squad has G-Strikes, the Maxis Drone is available, and every player has the One Inch Punch.',
          images: [originVisuals.fire, originVisuals.lightning, originVisuals.ice, originVisuals.wind]
        },
        {
          title: 'Ascend from Darkness — place the upgraded staffs',
          location: 'Inside the three Giant Robots and at the bottom of the Excavation Site',
          body: 'Place the upgraded Ice Staff in Freya, the upgraded Wind Staff in Odin, and the upgraded Lightning Staff in Thor. Place the upgraded Fire Staff in the newly available pedestal at the lowest level of the Excavation Site. In solo, use the version-supported pedestal method and confirm the staff is accepted before leaving.',
          success: 'Samantha speaks about the Giants breaking the seal and the staff pedestals accept all four weapons.',
          warning: 'Do not confuse the normal staff-building pedestals with the main-quest placement points.'
        },
        {
          title: 'Rain Fire — open the seal outside Generator 5',
          location: 'The circular stone seal outside Generator 5, on the Stamin-Up side of the church route',
          body: 'Wait for the Giant Robot whose lit foot passes over the Generator 5 footprint lane. One player enters that foot and reaches the red button inside the robot. A second player waits beside the circular seal with a G-Strike ready. The player inside presses the red button, immediately calls the throw, and the outside player throws the G-Strike directly onto the centre of the seal before the short fire-control window closes.',
          tip: 'Prime the G-Strike while the robot player is moving toward the button. In solo, use Odin and begin running toward the seal immediately after pressing the button.',
          success: 'The stone seal breaks open and leaves a visible pit.',
          warning: 'Throwing beside the seal, using the wrong robot-foot lane, or throwing after the timing window closes will not register.',
          images: [originVisuals.seal]
        },
        {
          title: 'Unleash the Horde — send the Maxis Drone into the opened pit',
          location: 'The opened circular pit created by Rain Fire outside Generator 5',
          body: 'Bring the Maxis Drone to the opened seal. Stand directly beside the opening and deploy the Drone while facing the pit. It should leave the player, fly down into the opening, and trigger the Panzer Soldat wave. Move to a prepared fighting area and kill every Panzer that emerges before continuing.',
          tip: 'Use upgraded staffs, G-Strikes, or other high-damage weapons and avoid fighting the full wave in the narrow footprint lane.',
          success: 'The Drone enters the pit, the Panzer wave spawns, and Samantha gives the next instruction after the final Panzer dies.',
          warning: 'If the Drone hovers normally and follows the player, it did not enter the pit. Return it to the workbench after its timer and retry the deployment at the opening.',
          images: [originVisuals.pit]
        },
        {
          title: 'Skewer the Winged Beast — shoot the plane and invisible pilot',
          location: 'The sky above Origins, then the clockwise path around the Excavation Site',
          body: 'Obtain Zombie Blood and look for the glowing aircraft that is only visible during the effect. Shoot it down before Zombie Blood expires. Obtain another Zombie Blood, circle the Excavation Site, and locate the invisible pilot running clockwise around the mound. Kill him while the effect is active and pick up the Maxis Drone upgrade that he drops.',
          tip: 'The guaranteed Zombie Blood reward near Generator 1 can be created by extinguishing the three burning carts with the Ice Staff.',
          success: 'The pilot drops the upgraded Maxis Drone part and Samantha advances the quest.',
          warning: 'The aircraft and pilot are invisible without Zombie Blood.'
        },
        {
          title: 'Wield a Fist of Iron — upgrade every player’s melee attack',
          location: 'The lowest chamber beneath the Excavation Site',
          body: 'Every player who has the One Inch Punch must melee the glowing white-armoured Templar zombies beneath the Excavation Site. Each player tracks their own progress. Continue using melee attacks until the upgraded fist reward appears for that player, then collect it before leaving.',
          success: 'Every player has personally collected the upgraded Iron Fist reward.',
          warning: 'Gun, equipment, and staff kills do not count for the player’s melee progression.'
        },
        {
          title: 'Raise Hell — charge the Crazy Place portal',
          location: 'The centre of the Crazy Place',
          body: 'Return the four upgraded staffs to their matching Crazy Place pedestals. Fight in the central area and kill the required Templars while their souls flow into the portal. Stay until the soul stream stops and Samantha announces that the reward is ready.',
          success: 'The central portal opens fully and Samantha tells the squad to step into the light.',
          warning: 'Kills too far from the central charging area may not feed the portal.'
        },
        {
          title: 'Freedom — deploy the upgraded Drone and choose the ending',
          location: 'The open portal in the centre of the Crazy Place',
          body: 'Retrieve the upgraded Maxis Drone from the original workbench where it was built. Return to the Crazy Place and deploy it beneath the open portal. After the Drone rises into the portal, interact with the central blue rock or teleporter prompt. In co-op, all players must be in the central beam and ready before the interaction completes.',
          tip: 'This ending is optional. Leave the portal alone if the squad wants to continue playing the match.',
          success: 'The screen transitions to the Little Lost Girl ending cutscene.',
          warning: 'The ending can refuse to trigger until all six generators have been active at the same time at least once.'
        }
      ];
    }
  }

  data.games.forEach((game) => {
    game.coverFallback = game.coverFallback || game.cover;
    game.cover = game.officialCover || game.cover || game.coverFallback;

    game.maps.forEach((map) => {
      map.requirements = Array.isArray(map.requirements) ? map.requirements : [];
      map.mainQuests = Array.isArray(map.mainQuests) ? map.mainQuests : [];
      map.sideQuests = Array.isArray(map.sideQuests) ? map.sideQuests : [];
      map.visuals = Array.isArray(map.visuals) ? map.visuals : [];

      const mainText = normalize([
        ...map.requirements,
        ...map.mainQuests.flatMap((quest) => [quest.name, quest.summary, ...quest.steps.flatMap((step) => [step.title, step.body])])
      ].join(' '));

      const explicit = new Set(REQUIRED_GUIDE_OVERRIDES[map.id] || []);
      const required = [];
      const optional = [];

      map.sideQuests.forEach((guide) => {
        const guideWords = words(`${guide.name} ${guide.reward || ''}`);
        const referenced = guideWords.length > 0 && guideWords.some((word) => mainText.includes(word));
        if (explicit.has(guide.name) || referenced) required.push(guide);
        else optional.push(guide);
      });

      map.requiredGuides = required;
      map.optionalSideQuests = optional;

      map.mainQuests.forEach((quest) => {
        quest.steps.forEach((step) => {
          step.images = Array.isArray(step.images) ? step.images : [];
          if (!step.images.length) {
            const text = normalize(`${step.title} ${step.body}`);
            map.visuals.forEach((visual) => {
              const visualWords = words(`${visual.title || ''} ${visual.caption || ''}`);
              if (visual.type === 'image' && visualWords.some((word) => text.includes(word))) {
                step.images.push({ src: visual.src, title: visual.title, caption: visual.caption });
              }
            });
          }
          step.success = step.success || step.cue || '';
        });
      });
    });
  });

  data.version = '5.0.0';
  data.updated = '2026-08-04';
})();
