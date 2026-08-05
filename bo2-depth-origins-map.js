(() => {
  'use strict';
  const D = window.BO2_DEPTH;
  if (!D) return;
  const { findMap, step, guide, image, source, diagram, fandom } = D;

  const map = findMap('black-ops-2-origins');
  if (!map) return;
  map.auditStatus = 'beginner-depth';
  map.status = 'Beginner-depth audited';
  map.players = '1–4 players; solo supported without a mod';
  map.soloMod = null;

  const shieldDiagram = image(diagram('ORIGINS ZOMBIE SHIELD · NINE SPAWNS', [
    ['VISOR / WINDOW 1', 'Fire tunnel table to the right of the portal'],
    ['VISOR / WINDOW 2', 'Trench room right of Fire tunnel / Generator 3 route'],
    ['VISOR / WINDOW 3', 'Speed Cola trench ramp, behind crate toward Workshop'],
    ['HANDLES / BASE 1', 'First trench room on the right from spawn toward Generator 2'],
    ['HANDLES / BASE 2', 'Far end of trenches beyond Generator 2 and Workshop'],
    ['HANDLES / BASE 3', 'Generator 2 Tank Station roof beside broken pipe'],
    ['FRAME / BODY 1', 'Generator 4, left of the MP40'],
    ['FRAME / BODY 2', 'Mud / Giant footprint outside Generator 4 toward Church'],
    ['FRAME / BODY 3', 'Giant footprint beside Excavation / Generator 5 path']
  ]), 'Origins Zombie Shield spawn pools', 'One part appears in each three-location zone. Build at any of the three workbenches.');

  const droneDiagram = image(diagram('MAXIS DRONE · SEVEN POSSIBLE SPAWNS', [
    ['BRAIN · FIXED', 'Spawn laboratory desk, lower floor beside stairs to Generator 1'],
    ['FRAME 1', 'Ice tunnel in front of the Crazy Place portal'],
    ['FRAME 2', 'Tank path toward Generator 4 beside skull-and-crossbones sign'],
    ['FRAME 3', 'Tank path toward Generator 5 beside skull-and-crossbones sign'],
    ['ROTOR 1', 'Bottom Excavation scaffold box beside a ring lever'],
    ['ROTOR 2', 'Top of Excavation near Pack-a-Punch'],
    ['ROTOR 3', 'Excavation secret-entrance / hidden-stair area']
  ]), 'Maxis Drone part locations', 'Build at the Generator 2–3 Workshop, Wind tunnel entrance, or Church workbench. It returns to the original bench after its timer.');

  const gStrikeDiagram = image(diagram('G-STRIKE TABLET ROUTE', [
    ['1 · DIRTY TABLET', 'Far table inside Generator 2 Tank Station'],
    ['2 · HOLY-WATER BASIN', 'Church upper floor; place tablet and earn 20 melee kills nearby'],
    ['3 · CLEAN RETURN', 'Carry by wooden boards only; touching mud dirties it'],
    ['4 · TANK STATION TABLE', 'Replace tablet and earn 20 more melee kills nearby'],
    ['5 · REWARD', 'G-Strike appears on the table for that player']
  ]), 'Origins G-Strike tablet route', 'Every player wanting G-Strikes completes their own tablet. Cleansing kills do not need to be repeated after an accidental mud touch.');

  const chestDiagram = image(diagram('ONE INCH PUNCH · FOUR SOUL CHESTS', [
    ['JUGGER-NOG', 'Odin footprint to the right of Generator 4'],
    ['STAMIN-UP', 'Odin footprint to the right of Generator 5'],
    ['EXCAVATION', 'Odin footprint beside the southern mound ramp / Pack-a-Punch'],
    ['CHURCH', 'Freya footprint directly in front of the Church'],
    ['RESET WARNING', 'A robot stepping on an unfinished chest empties its stored souls'],
    ['CLAIM', 'Rituals of the Ancients chest at Generator 1 or Generator 6']
  ]), 'Origins One Inch Punch soul chests', 'Kill zombies inside the footprint around each open chest until it sinks into the ground.');

  const staffPlacementDiagram = image(diagram('ASCEND FROM DARKNESS · STAFF PLACEMENT', [
    ['ICE · FREYA', 'Church / Generator 6 Giant Robot pedestal'],
    ['WIND · ODIN', 'Central Generator 4 / 5 Giant Robot pedestal'],
    ['LIGHTNING · THOR', 'Generator 3 Giant Robot pedestal'],
    ['FIRE', 'New red pedestal at the lowest Excavation level'],
    ['SOLO', 'Carry and place one staff at a time; retrieve the next from its Excavation pedestal']
  ]), 'Origins main-quest staff placement', 'Each robot contains a colored pedestal inside its head after all four staffs are upgraded.');

  const sealDiagram = image('/assets/origins/rain-fire-seal.svg', 'Rain Fire seal location', 'Throw the G-Strike directly onto the circular stone seal outside Generator 5, on the Stamin-Up / Church-side robot footprint lane.');
  const pitDiagram = image('/assets/origins/maxis-drone-pit.svg', 'Maxis Drone opened-pit placement', 'After the seal opens, stand beside the hole and deploy the Maxis Drone while facing directly into it.');

  const zombieBloodDiagram = image(diagram('SKewer THE WINGED BEAST · TWO ZOMBIE BLOODS', [
    ['BLOOD 1', 'Look into the sky and shoot the glowing orange aircraft'],
    ['BLOOD 2', 'Circle Excavation clockwise and shoot the invisible running pilot'],
    ['GUARANTEED BLOOD', 'Ice Staff extinguish carts: Jug footprint · opposite MP40 · behind Stamin-Up'],
    ['DROP', 'Pick up the Maxis Drone upgrade from the pilot’s death point']
  ]), 'Origins Zombie Blood plane and pilot', 'The aircraft and pilot are visible only to the player currently under Zombie Blood.');

  const magnaDiagram = image(diagram('FREE MAGNA COLLIDER · FOUR DRONE DISCS', [
    ['TRENCH', 'Outside spawn toward Generator 2, in the flaming-debris trench hole'],
    ['GENERATOR 5', 'Destroyed roof / broken building near Stamin-Up or Claymores'],
    ['CHURCH', 'Destroyed Church roof / tank path toward Generator 4'],
    ['MOUND', 'Scaffold above the Excavation entrance closest to Church'],
    ['REWARD', 'Pack-a-Punched MG08/15 appears in front of Pack-a-Punch']
  ]), 'Origins free Magna Collider locations', 'Deploy the Maxis Drone near each yellow disc and wait for it to collect the disc automatically.');

  const goldenDiagram = image(diagram('GOLDEN SHOVEL, HELMET, AND EXTRA PERK SLOTS', [
    ['GOLDEN SHOVEL', 'Each player digs 30 regular piles in the same match'],
    ['GOLDEN HELMET', 'Random reward from later regular digs with Golden Shovel'],
    ['RED DIG SPOT', 'Visible only during Zombie Blood while holding Golden Shovel'],
    ['EMPTY PERK BOTTLE', 'Dig the glowing red/orange pile; next one appears on a later round'],
    ['LIMIT', 'Gain four extra purchase slots; free Double Tap can exceed the normal four-perk limit']
  ]), 'Origins dig-up progression', 'Golden Shovel, Golden Helmet, and Empty Perk Bottles are tracked separately for every player.');

  const extraRequired = [
    guide('Maxis Drone — every part and correct workbench behavior', 'Required for the Panzer release, pilot upgrade, and ending', [
      step('Pick up Maxis’s Brain', 'Spawn laboratory lower floor, desk beside the stairs leading up to Generator 1', 'The yellow brain jar is always on this desk.', { images: [droneDiagram] }),
      step('Search the three Frame locations', 'Ice tunnel and both Church-side tank paths', 'Check in front of the Ice Crazy Place portal; the muddy tank path to Generator 4 beside a skull-and-crossbones sign; and the muddy tank path to Generator 5 beside the other skull sign.'),
      step('Search the three Rotor locations', 'Excavation Site', 'Check the box on the lowest scaffold beside a ring lever; the top of the mound beside Pack-a-Punch; and the Excavation hidden-stair / secret-entrance area.'),
      step('Choose the workbench deliberately', 'Workshop between Generators 2 and 3, Wind tunnel entrance near Generator 4, or Church', 'Attach all three parts to one bench. Remember that bench: after its approximately 90-second deployment or after special quest uses, the Drone returns there to recharge.', { success: 'The Maxis Drone appears as tactical equipment.' }),
      step('Use it as a revive and combat helper', 'Open areas', 'Deploy it to shoot zombies and revive downed teammates. It cannot prevent a game-over when the final living player goes down.', { warning: 'In the main quest, do not waste its charge immediately before the opened-seal step.' })
    ]),

    guide('G-Strike Beacon — exact tablet route', 'Required to open the Generator 5 seal', [
      step('Collect one dirty tablet', 'Far table inside the Generator 2 Tank Station', 'There is no obvious prompt. Hold interact against a stone tablet. Each player wanting G-Strikes takes and cleanses their own.', { images: [gStrikeDiagram] }),
      step('Place it in the Church basin', 'Church upper floor holy-water basin', 'Hold interact at the basin, then stay close and earn 20 melee kills. One Inch Punch, Zombie Shield bash, and other valid melee attacks count.', { success: 'The tablet turns clean/white.' }),
      step('Carry the clean tablet without touching mud', 'Church → wooden tank paths → Tank Station', 'Use wooden planks, tank tracks, and dry surfaces. Jump between boards where needed. If the carrier touches mud, return to the Church basin and interact to clean it again; the first 20 kills do not need repeating.', { warning: 'In co-op, protect the carrier and avoid body-blocking them into mud.' }),
      step('Return it to the Tank Station table', 'Same table where the dirty tablet was collected', 'Place the clean tablet, then earn 20 more melee kills very close to the table.'),
      step('Take the G-Strike reward', 'Tank Station tablet table', 'The G-Strike appears on the table for that player. Pick it up before leaving.', { success: 'The tactical slot changes to two G-Strike beacons; Max Ammo replenishes them.' })
    ]),

    guide('One Inch Punch — four soul chests', 'Required for G-Strike and the Iron Fist step', [
      step('Fill the Jugger-Nog chest', 'Odin footprint to the right of Generator 4', 'Kill zombies inside the footprint while the chest is open. Their souls must visibly enter the chest.', { images: [chestDiagram] }),
      step('Fill the Stamin-Up chest', 'Odin footprint to the right of Generator 5', 'Repeat until the chest sinks and disappears.'),
      step('Fill the Excavation chest', 'Odin footprint beside the southern Excavation ramp / centre mound lane', 'Repeat inside the footprint.'),
      step('Fill the Church chest', 'Freya footprint directly in front of the Church', 'Repeat until the fourth chest disappears.', { warning: 'If a Giant Robot steps on an unfinished chest, that chest resets to zero souls. A completed/sunken chest stays complete.' }),
      step('Claim the One Inch Punch', 'Rituals of the Ancients reward chest at Generator 1 or Generator 6', 'Interact with the fist/chest icon. Every player receives and claims their own melee upgrade after the team fills all four chests.', { success: 'The knife is replaced with the powerful One Inch Punch.' })
    ])
  ];

  map.requiredGuides = [...(map.requiredGuides || []), ...extraRequired];
  map.requirements = [
    'All six generators activated at least once; keep them active together before the ending',
    'Gramophone and black record used to open the lowest Excavation chamber',
    'Fire, Lightning, Ice, and Wind Staffs fully upgraded',
    'Maxis Drone built at a remembered workbench',
    'At least one G-Strike Beacon',
    'All four soul chests completed and every player has the One Inch Punch',
    'Strong Panzer-killing weapons, armour/shield, and a safe fighting route'
  ];

  map.mainQuests = [{
    id: 'little-lost-girl', name: 'Little Lost Girl', players: '1–4 players', reward: 'Little Lost Girl achievement and optional ending cutscene', summary: 'Place the four upgraded staffs, open the Generator 5 seal, send in the Maxis Drone, recover its upgrade with Zombie Blood, earn every Iron Fist, charge the Crazy Place portal, and choose whether to end the match.',
    steps: [
      step('Finish every required build and upgrade', 'Across Origins before beginning Ascend from Darkness', 'Upgrade all four Elemental Staffs. Build the Maxis Drone. Obtain at least one G-Strike. Fill all four soul chests and make sure every player has claimed the One Inch Punch. Activate all six generators at least once.', { success: 'All four upgraded staff names, Drone, G-Strike, and fist rewards are present.', images: [shieldDiagram, droneDiagram, gStrikeDiagram, chestDiagram] }),
      step('Ascend from Darkness — place Ice in Freya', 'Inside Freya, the Giant Robot patrolling the Church / Generator 6 lane', 'Wait for Freya’s glowing foot, shoot the sole, stand inside the open footprint, and enter the robot head. Place Ull’s Arrow in the blue pedestal. In solo, return to the Excavation chamber and collect the next staff.'),
      step('Place Wind in Odin and Lightning in Thor', 'Odin central lane and Thor Generator 3 lane', 'Repeat the glowing-foot entry for Odin and place Boreas’ Fury in the yellow pedestal. Enter Thor and place Kimat’s Bite in the purple pedestal.', { images: [staffPlacementDiagram] }),
      step('Place Fire at the bottom of Excavation', 'New red quest pedestal at the lowest Excavation level', 'Place Kagutsuchi’s Blood in the red pedestal. After all four placements register, the Giant Robots begin a special synchronized patrol and Samantha confirms the next stage.', { success: 'All four staffs are accepted and the robots begin the main-quest patrol.', warning: 'Do not place a staff into its normal build pedestal by mistake.' }),
      step('Rain Fire — press the robot’s red button', 'Inside the robot that opens during the special patrol', 'Have one player enter the only glowing foot and move to the control console in the head. The outside player waits beside the circular stone seal outside Generator 5 with a G-Strike ready. Press the red button and immediately call the throw.', { images: [sealDiagram] }),
      step('Throw the G-Strike on the Generator 5 seal', 'Circular stone seal outside Generator 5 on the Stamin-Up / Church-side footprint lane', 'Throw directly at the centre before the short artillery timer closes. In solo, press the button, exit through the foot portal, sprint to the seal, and throw as quickly as possible.', { success: 'Robot artillery destroys the seal and leaves a deep circular pit.', warning: 'Throwing beside the circle or after the timing window does nothing.' }),
      step('Unleash the Horde — deploy the Maxis Drone into the pit', 'Opened seal outside Generator 5', 'Stand beside the opening, face down into it, and deploy the Maxis Drone. It should leave the player and fly underground. Move to a prepared open fighting area.', { images: [pitDiagram], success: 'The Drone disappears into the hole and the Panzer wave begins.', warning: 'If the Drone follows the player normally, it missed the hole. Wait for it to return to its workbench and retry.' }),
      step('Kill the full Panzer wave', 'Any safe route, ideally No Man’s Land or a prepared footprint loop', 'The game releases two Panzer Soldats per player. Focus exposed faces, use upgraded staff charged shots, and avoid fighting all of them in the narrow Generator 5 lane.', { success: 'Samantha advances after the final Panzer dies.' }),
      step('Skewer the Winged Beast — shoot the hidden aircraft', 'Sky above Origins while under Zombie Blood', 'Obtain Zombie Blood, look up for the glowing orange aircraft, and shoot it with a bullet weapon before the effect expires.', { images: [zombieBloodDiagram] }),
      step('Use a second Zombie Blood to kill the invisible pilot', 'Clockwise loop around the Excavation mound', 'Obtain another Zombie Blood. Run clockwise around Excavation and look for the invisible pilot revealed by the effect. Shoot him until he dies, then pick up the Maxis Drone upgrade from the ground.', { tip: 'For repeatable Zombie Blood, extinguish all three flaming carts with the Ice Staff: the footprint right of Jugger-Nog, opposite the MP40, and behind Stamin-Up. The blood appears beside Pack-a-Punch scaffolding.', success: 'The Drone upgrade is collected and the Drone eventually returns to its original workbench.' }),
      step('Wield a Fist of Iron — each player earns their own upgrade', 'Lowest chamber beneath Excavation', 'Every player uses only the One Inch Punch to kill the glowing white-armoured Templar zombies that spawn in the chamber. Track progress separately. When a glowing stone/fist reward appears for that player, pick it up immediately.', { success: 'Every player has personally collected the upgraded Iron Fist.', warning: 'Staff, gun, grenade, and equipment kills do not count toward that player’s fist.' }),
      step('Raise Hell — return all staffs to the Crazy Place', 'Four matching colored pedestals in the Crazy Place', 'Retrieve the upgraded staffs from their quest placement points/pedestals and return Fire, Lightning, Ice, and Wind to their matching Crazy Place pedestals.'),
      step('Charge the central portal', 'Centre of the Crazy Place', 'Kill approximately 100 Templar zombies in the central area. Stay close enough that souls stream upward. Continue until the central portal opens fully and Samantha says the reward is ready.', { success: 'A bright portal/beam opens over the centre and the soul stream stops.' }),
      step('Retrieve and launch the upgraded Maxis Drone', 'Original workbench, then centre of the Crazy Place', 'Pick up the Drone from the same workbench where it was built. Deploy it under the open central portal. It flies upward into the light.', { success: 'The Drone enters the portal and the final blue-rock interaction becomes available.' }),
      step('Choose whether to trigger the ending', 'Central Crazy Place beam / blue rock', 'To end the match, all players stand in the centre and hold interact on the blue rock/teleporter prompt together. In solo, hold interact yourself. To continue playing, do not activate it.', { success: 'The Little Lost Girl cutscene plays and the match ends.', warning: 'If the prompt does not register, reactivate all six generators simultaneously and return. The ending is irreversible.' })
    ]
  }];

  map.optionalSideQuests = [
    guide('Zombie Shield — all nine part spawns', 'Back protection and shield bash', [
      step('Find the Visor / Window', 'Generator 3 and Fire-tunnel trench zone', 'Check the Fire tunnel table to the right of the portal; the trench room immediately right of the Fire tunnel; and the Speed Cola trench ramp behind the crate heading toward Workshop.', { images: [shieldDiagram] }),
      step('Find the Handles / Base', 'Generator 2 trench zone', 'Check the first room on the right from spawn toward Generator 2; the far trench end beyond Generator 2 and Workshop; and the Tank Station roof beside broken piping.'),
      step('Find the Frame / Body', 'No Man’s Land footprint zone', 'Check left of the MP40 at Generator 4; the muddy footprint outside Generator 4 toward Church; and the footprint beside Excavation / Generator 5.'),
      step('Build at one of three workbenches', 'Workshop between Generators 2–3, Wind tunnel entrance near Generator 4, or Church', 'Attach all three parts. When the shield breaks, collect a free replacement at the same bench.', { success: 'The shield blocks attacks from behind while holstered and its bash counts as melee for G-Strike cleansing.' })
    ]),

    guide('Golden Shovel, Golden Helmet, and four extra perk slots', 'Safer dig rewards, robot-stomp immunity, and up to eight purchasable perk slots', [
      step('Dig 30 regular piles for the Golden Shovel', 'Any normal bone/dirt dig spots around Origins', 'Each player tracks their own digs. Continue until the shovel HUD icon turns gold and a sound cue plays.', { images: [goldenDiagram] }),
      step('Dig regular piles for the Golden Helmet', 'Any normal dig spot after earning the Golden Shovel', 'The Helmet is a random later reward. Continue digging until its sound and HUD icon appear. It prevents Giant Robot feet from downing that player.'),
      step('Obtain Zombie Blood and locate the glowing red dig spot', 'One of sixteen special locations across the map', 'While holding the Golden Shovel and under Zombie Blood, scan for a bright red/orange dig mound visible through the effect. It remains at its chosen location until dug.'),
      step('Dig the Empty Perk Bottle', 'Current glowing red spot', 'Dig before Zombie Blood expires and collect the empty bottle. It adds one permanent purchase slot for that match. A new red spot becomes available on a later round. Repeat for up to four extra slots.', { success: 'The player can purchase another perk without losing current perks.', warning: 'Each player has separate Golden Shovel and perk-slot progression.' })
    ]),

    guide('Free Magna Collider using the Maxis Drone', 'Pack-a-Punched MG08/15', [
      step('Collect the Spawn-trench disc', 'Outside spawn toward Generator 2, in the flaming-debris trench hole', 'Deploy the Drone nearby and wait for it to fly to the yellow disc.', { images: [magnaDiagram] }),
      step('Collect the Generator 5 disc', 'Destroyed roof / broken structure near Stamin-Up or Claymore wall-buy', 'Deploy close enough for automatic collection.'),
      step('Collect the Church disc', 'Destroyed Church roof / tank path toward Generator 4', 'Walk the Drone near the yellow plate until it leaves the player and collects it.'),
      step('Collect the Mound disc', 'Scaffolding above the Excavation entrance closest to Church', 'Deploy near the scaffold.'),
      step('Claim the Magna Collider', 'In front of Pack-a-Punch on top of Excavation', 'After all four discs are collected, the upgraded MG08/15 appears and can be taken by any player.', { success: 'The weapon name is Magna Collider.' })
    ]),

    guide('Repeatable free Zombie Blood from the Ice Staff', 'Zombie Blood once per eligible round', [
      step('Extinguish the Jugger-Nog cart', 'Giant footprint to the right of Jugger-Nog / Generator 4', 'Shoot the flaming cart with the Ice Staff until the fire goes out.'),
      step('Extinguish the MP40-side cart', 'Opposite / left of the MP40 around the Excavation footprint lane', 'Shoot it with the Ice Staff.'),
      step('Extinguish the Stamin-Up cart', 'Behind Stamin-Up at Generator 5', 'Shoot it with the Ice Staff.'),
      step('Collect the blood quickly', 'Pack-a-Punch scaffolding on top of Excavation', 'The Zombie Blood appears near the scaffolding and can despawn if the player waits too long.', { success: 'This can be repeated once per round when it is not raining.' })
    ]),

    guide('Rituals of the Ancients — all four challenge rewards', 'One Inch Punch, Pack-a-Punched rifle, Max Ammo, and free Double Tap II', [
      step('Perform 115 normal-zombie headshots', 'Any area', 'Headshots on normal zombies count; Panzers and electrified generator Templars do not. Claim the Pack-a-Punched Galil, STG-44, or SCAR-H from the challenge chest.'),
      step('Capture six generators personally', 'Generators 1–6', 'The game tracks generator captures by player. If teammates complete too many, allow Templars to deactivate one so the player can recapture it. Claim Max Ammo.'),
      step('Spend 30,000 points', 'Any purchases', 'Doors, weapons, perks, box spins, and other point spending count. Claim the free Double Tap II bottle even if it temporarily exceeds the normal four-perk limit.'),
      step('Fill the four soul chests', 'Four robot footprints listed in the One Inch Punch guide', 'Claim One Inch Punch after every chest sinks.'),
      step('Claim rewards from either station', 'Laboratory at Generator 1 or behind Church at Generator 6', 'Match the lit HUD medal to the icon on the reward chest and interact.', { images: [chestDiagram] })
    ]),

    guide('“Archangel” musical Easter egg', 'Archangel by Elena Siegman, Malukah, and Clark S. Nova', [
      step('Activate the Spawn meteor fragment', 'Starting laboratory, corner right of the Rituals of the Ancients chest', 'Hold interact on the green rock.'),
      step('Activate the Workshop fragment', 'Workshop upper floor beneath the shelves', 'Hold interact on the green rock.'),
      step('Activate the Excavation-sign fragment', 'No Man’s Land beside crates near the Excavation Site sign', 'Hold interact on the final green rock.', { success: 'Archangel begins playing.' })
    ]),

    guide('Pack-a-Punch and generator upkeep', 'Weapon upgrades on top of Excavation', [
      step('Activate all six generators', 'Generator stations 1 through 6', 'Pay the point cost and defend each generator until its progress ring fills. Keep clear of electrified Templars.'),
      step('Use Pack-a-Punch', 'Top of the Excavation mound', 'After all six generators are active, Pack-a-Punch powers on. Upgrade weapons for 5,000 points.'),
      step('Stop generator-stealing Templars', 'Random generator attacks on later rounds', 'Follow the alarm marker and kill every Templar inside the generator ring before the progress drains. A deactivated generator disables nearby perks and can block the final ending until recaptured.')
    ])
  ];

  map.sideQuests = [...map.requiredGuides, ...map.optionalSideQuests];
  map.visuals = [];
  map.sources = [
    ...(map.sources || []),
    source('Call of Duty Wiki — Zombie Shield', 'https://callofduty.fandom.com/wiki/Zombie_Shield', 'All nine Origins shield spawn locations'),
    source('Call of Duty Wiki — Maxis Drone', 'https://callofduty.fandom.com/wiki/Maxis_Drone', 'Drone parts, Magna Collider discs, and behavior'),
    source('Call of Duty Wiki — G-Strike', 'https://callofduty.fandom.com/wiki/G-Strike', 'Two 20-kill stages and clean tablet route'),
    source('Call of Duty Zombies — Origins G-Strike', 'https://www.callofdutyzombies.com/zombie-library/zombies-library/black-ops_ii/origins/g-strike-beacon-r400/', 'Tablet locations and illustrated route'),
    source('Steam — A guide for Origins', 'https://steamcommunity.com/sharedfiles/filedetails/?id=188521680', 'Soul chests, tablet route, and main quest cross-check'),
    source('Call of Duty Wiki — Origins', 'https://callofduty.fandom.com/wiki/Origins', 'Dig spots, robots, buildables, and side systems'),
    source('Call of Duty Wiki — Empty Perk Bottle', 'https://callofduty.fandom.com/wiki/Empty_Perk_Bottle', 'Golden Shovel Zombie Blood perk-slot mechanic'),
    source('Call of Duty Zombies — Magna Collider', 'https://www.callofdutyzombies.com/zombie-library/zombies-library/black-ops_ii/origins/magna-collider-mg0815-using-maxis-drone-r401/', 'Four yellow-disc locations'),
    source('Call of Duty Zombies — Rituals of the Ancients', 'https://www.callofdutyzombies.com/zombie-library/zombies-library/black-ops_ii/origins/rituals-of-the-ancients-challenges-r399/', 'Four challenge requirements and rewards')
  ];
})();