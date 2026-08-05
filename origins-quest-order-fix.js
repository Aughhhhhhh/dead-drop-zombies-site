(() => {
  'use strict';

  const data = window.DEAD_DROP_DATA;
  if (!data?.games) return;

  const map = data.games
    .flatMap((game) => game.maps || [])
    .find((entry) => entry.id === 'black-ops-2-origins');
  if (!map) return;

  const sourceIndex = 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/origins_little_lost_girl/';
  const sourceWiki = 'https://callofduty.fandom.com/wiki/Little_Lost_Girl';

  const step = (title, location, body, extra = {}) => ({
    title,
    location,
    body,
    sourceLabel: 'Origins source walkthrough',
    ...extra
  });

  map.players = '1–4 players; solo supported without a mod';
  map.soloMod = null;
  map.requirements = [
    'Black Ops II must be played on Original difficulty; the quest cannot be completed on Easy',
    'Open the Excavation staff chamber with the Gramophone and the black record',
    'Activate generators while setting up, then make sure all six are active together at least once after all four staffs have been built',
    'Keep one strong Panzer-killing weapon and a Zombie Shield before beginning the timed and combat-heavy stages'
  ];

  map.mainQuests = [{
    id: 'little-lost-girl',
    name: 'Little Lost Girl',
    players: '1–4 players',
    reward: 'Little Lost Girl achievement; Freedom optionally ends the match and plays the cutscene',
    summary: 'Follow the canonical eight-stage sequence. Required builds are taught inside the stage where the quest first needs them instead of being dumped into a single checklist at the beginning.',
    steps: [
      step(
        'Secure the Keys — build and upgrade all four Elemental Staffs',
        'Generators 1–6, the four elemental tunnels, the Crazy Place, and the lowest Excavation chamber',
        'Activate generators as you open the map and collect the Gramophone, black record, elemental records, crystals, and all three parts for each Staff. Build the Fire, Ice, Lightning, and Wind Staffs in the lowest Excavation chamber. After all four staffs have been built, make sure all six generators are active at the same time at least once so the quest flag can register. Complete both upgrade puzzles for every Staff, align the matching Excavation rings, shoot each elemental orb, then charge each Staff in its matching Crazy Place pedestal until Samantha confirms it is upgraded.',
        {
          success: 'Kagutsuchi’s Blood, Ull’s Arrow, Kimat’s Bite, and Boreas’ Fury are all available, and all six generator icons have been lit together after the staffs were built.',
          warning: 'Do not begin staff placement until all four upgraded names are present. Activating all generators only before the staffs are built may not satisfy the quest condition.',
          sourceUrl: `${sourceIndex}secure-the-keys-r3/`
        }
      ),
      step(
        'Ascend from Darkness — place each upgraded Staff in its quest pedestal',
        'Freya at the Church, Odin across the central mound, Thor over Generators 2–3, and the new pedestal at the bottom of Excavation',
        'Enter Freya through a glowing foot and place Ull’s Arrow in the blue pedestal. Enter Odin and place Boreas’ Fury in the yellow pedestal. Enter Thor and place Kimat’s Bite in the purple pedestal. Place Kagutsuchi’s Blood in the new red pedestal in front of the original Staff pedestals at the lowest Excavation level. The staffs may be placed in any order. When all four register, they return to their original Excavation pedestals and the Giant Robots begin continuously patrolling together.',
        {
          code: 'Ice → Freya · Wind → Odin · Lightning → Thor · Fire → Excavation',
          success: 'Samantha speaks, the temporary pedestals disappear, the staffs return to the staff room, and all three robots begin the special patrol.',
          warning: 'The quest pedestals appear only after the Staff and generator condition from Secure the Keys has registered.',
          sourceUrl: `${sourceIndex}ascend-from-darkness-r4/`
        }
      ),
      step(
        'Rain Fire — obtain a G-Strike and break the seal outside Generator 5',
        'Inside the currently enterable Giant Robot, then the circular cracked-stone seal behind and to the right of Generator 5',
        'Obtain at least one G-Strike before attempting the timing sequence. One player enters the robot through its glowing foot and presses the newly appeared red button in the head. Immediately after the press, another player throws a primed G-Strike directly onto the large circular cracked-stone seal outside Generator 5. In solo, enter Odin, press the button, allow the purge to eject you quickly, sprint toward the seal while priming the G-Strike, and throw as soon as the target is visible.',
        {
          success: 'Robot artillery strikes the seal, the stone breaks open into a pit, Samantha speaks, and a short audio cue plays.',
          warning: 'A late or inaccurate throw consumes the G-Strike and triggers demonic laughter. Wait for another valid robot foot and retry.',
          sourceUrl: `${sourceIndex}rain-fire-r5/`
        }
      ),
      step(
        'Unleash the Horde — build the Maxis Drone, send it into the pit, and defeat ten Panzers',
        'Maxis Drone part spawns and workbenches, followed by the opened seal outside Generator 5',
        'Build the Maxis Drone if it has not already been assembled, and remember the exact workbench used because it returns there later. Stand beside the opened Generator 5 pit, face the opening, and deploy the Drone so it flies underground instead of following the player. Soon afterward, ten Panzer Soldats emerge from the pit. Move to a prepared open route and eliminate all ten using upgraded Staff charged attacks, G-Strikes, the Ray Gun Mark II, or another high-damage weapon.',
        {
          success: 'The Maxis Drone enters the pit and the stage advances after the tenth Panzer Soldat is defeated.',
          warning: 'The wave is ten Panzers total, not two per player. If the Drone follows you normally, it missed the pit and must return to its original workbench before another attempt.',
          sourceUrl: `${sourceIndex}unleash-the-horde-r6/`
        }
      ),
      step(
        'Skewer the Winged Beast — shoot the Zombie Blood plane and its invisible pilot',
        'The sky above Origins and the clockwise path around the Excavation Site',
        'Obtain Zombie Blood and look into the sky for a yellow-glowing aircraft similar to the Fire Staff part plane. Shoot it down before Zombie Blood expires. Obtain another Zombie Blood, then move counter-clockwise around the Excavation mound so you meet the invisible pilot as he runs clockwise. Shoot the pilot while the effect is active and collect the upgraded Maxis Drone item he drops.',
        {
          tip: 'A repeatable Zombie Blood can be earned by extinguishing the three burning carts with the Ice Staff, then collecting the power-up near the Pack-a-Punch scaffolding.',
          success: 'The pilot drops the upgraded Maxis Drone, which later returns to the original workbench used to build it.',
          warning: 'Both the aircraft and pilot are visible only to the player currently under Zombie Blood.',
          sourceUrl: `${sourceIndex}skewer-the-winged-beast-r7/`
        }
      ),
      step(
        'Wield a Fist of Iron — obtain One Inch Punch and upgrade it for every player',
        'The four Rituals of the Ancients soul chests, then the lowest Excavation chamber',
        'If the team has not already done so, fill all four robot-footprint soul chests and have every player claim One Inch Punch from a Rituals of the Ancients reward chest. In the lowest Excavation chamber, each player must use their own One Inch Punch on approximately 20 Crusader Zombies whose arms glow white. A qualifying hit is enough; the player does not have to land the killing blow. When that player has enough hits, a white-glowing tablet drops and must be collected to receive the Iron Fist.',
        {
          success: 'Every player has personally collected a white tablet and their melee attack is upgraded to the Iron Fist.',
          warning: 'Do not hit Crusaders while they are still climbing through the walls because the tablet can drop out of reach. Progress is tracked separately for each player.',
          sourceUrl: `${sourceIndex}wield-a-fist-of-iron-r8/`
        }
      ),
      step(
        'Raise Hell — place the four staffs in the Crazy Place and charge the portal',
        'The four colored Staff pedestals and the center of the Crazy Place',
        'Retrieve all four upgraded staffs and place each one in its matching colored pedestal in the Crazy Place. Kill 100 Templar Zombies inside the Crazy Place while staying close enough for their souls to stream into the center. Continue until the screen flashes and the ceiling above the center becomes an open vortex.',
        {
          success: 'The central portal is fully open, the soul stream stops, and the Little Lost Girl achievement or trophy unlocks.',
          warning: 'Freedom is optional. Completing Raise Hell finishes the achievement requirement even if the team decides to continue the match.',
          sourceUrl: `${sourceIndex}raise-hell-r9/`
        }
      ),
      step(
        'Freedom — send the upgraded Maxis Drone into the portal and choose whether to end the match',
        'The original Maxis Drone workbench, then the center blue rock in the Crazy Place',
        'Retrieve the upgraded Maxis Drone from the same workbench where it was originally built. Deploy it beneath the open Crazy Place portal and wait for it to rise into the light. Interact with the central blue rock when the “access the teleporter” prompt appears. This interaction ends the match and plays the special ending cutscene, so leave the rock untouched if the team wants to continue playing.',
        {
          success: 'The Drone enters the vortex, the teleporter interaction works, the match ends, and the Little Lost Girl cutscene plays.',
          warning: 'If the final interaction does not work, reactivate all six generators at the same time and return. Triggering the teleporter is irreversible.',
          sourceUrl: `${sourceIndex}freedom-r10/`
        }
      )
    ]
  }];

  map.sideQuests = [
    ...(map.requiredGuides || []),
    ...(map.optionalSideQuests || [])
  ];

  map.sources = [
    ...(map.sources || []).filter((entry) => entry.url !== sourceIndex && entry.url !== sourceWiki),
    {
      label: 'Call of Duty Zombies — Origins: Little Lost Girl',
      url: sourceIndex,
      note: 'Canonical eight-stage index and stage-specific gameplay media'
    },
    {
      label: 'Call of Duty Wiki — Little Lost Girl',
      url: sourceWiki,
      note: 'Quest ordering, generator condition, Staff placement, ten-Panzer wave, Iron Fist hits, and optional Freedom ending'
    }
  ];
})();
