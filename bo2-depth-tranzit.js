(() => {
  'use strict';
  const D = window.BO2_DEPTH;
  if (!D) return;
  const { findMap, step, guide, image, source, diagram, plutoniumVictis } = D;

  const buildableMap = image(diagram('TRANZIT BUILDABLE PART ZONES', [
    ['BUS DEPOT', 'Turbine · Power Switch is not here · meteor/Navcard items'],
    ['DINER + GARAGE', 'Zombie Shield · bus-upgrade shed · Galvaknuckles roof'],
    ['FARM', 'Turret · bank/weapon-storage systems · bus-upgrade shed'],
    ['POWER STATION', 'Power Switch · Electric Trap · Jet Gun wires'],
    ['TUNNEL / NACHT / CABIN', 'Jet Engine / Hand Brake / Pressure Gauge'],
    ['TOWN', 'Jet Gun workbench · Pack-a-Punch tunnel · bank']
  ], 'Carry only one buildable at a time. Deposit every part before crossing the fog again.'), 'TranZit buildable zones', 'Use this route overview before collecting parts so you do not carry a part to the wrong workbench.');

  const jetGunMap = image(diagram('JET GUN · ALL FOUR PARTS', [
    ['JET ENGINE · TUNNEL', 'Four spawns from the first windows to the M16 car barricade'],
    ['WIRES · POWER STATION', 'Tombstone/lava room after power is switched on and Maxis finishes speaking'],
    ['HAND BRAKE · NACHT', 'Lamp · cabinet · or right side of the blocked stairway behind the desk'],
    ['PRESSURE GAUGE · HUNTER CABIN', 'Fireplace · bed/back door · or cabin shelf area'],
    ['BUILD', 'Town bar workbench; return dropped parts if the weapon breaks']
  ]), 'Jet Gun part route', 'The four parts are spread across the entire bus loop. Build the Thrustodyne at the Town bar.');

  const shieldDiagram = image(diagram('TRANZIT ZOMBIE SHIELD · TWO PARTS', [
    ['CAR DOOR · GARAGE', 'Bathroom floor by sink · car on maintenance lift · table beside workbench room'],
    ['HAND TROLLEY · DINER', 'Behind left/right counter · or booth at the far end from Speed Cola'],
    ['WORKBENCH', 'Garage workbench beside the car-door spawn room']
  ]), 'TranZit Zombie Shield spawns', 'The part model stays the same, but one location from each row is selected per match.');

  const tranzit = findMap('black-ops-2-tranzit-green-run');
  if (tranzit) {
    tranzit.auditStatus = 'beginner-depth';
    tranzit.status = 'Beginner-depth audited';
    tranzit.soloMod = plutoniumVictis;
    tranzit.requiredGuides = [
      guide('Turbine — all three Bus Depot parts', 'Portable power required by both branches and several side systems', [
        step('Pick up the mannequin body', 'Bus Depot starting room, leaning against the large route map / wall display', 'Look for the torso-and-legs mannequin piece against the wall. Pick it up and carry it to the workbench before taking another part.', { images: [image(diagram('TURBINE PART 1', [['MANNEQUIN BODY', 'Against the large map/wall display inside the starting room']]), 'Turbine mannequin spawn', 'The mannequin is the largest Turbine part and is inside the locked starting room.')] }),
        step('Pick up the fan', 'Bus Depot starting room, on the passenger seats / bench row', 'Search the seats and bench surfaces inside the same room. Deposit the fan at the workbench.', { images: [image(diagram('TURBINE PART 2', [['FAN', 'On the seats/bench row inside Bus Depot']]), 'Turbine fan spawn', 'The fan lies flat and is easy to miss against the dark seats.')] }),
        step('Pick up the tail fin', 'Bus Depot starting room, on the floor near the payphones', 'Search the floor and wall edge by the payphones for the small aircraft-tail piece. Add it to the workbench.', { images: [image(diagram('TURBINE PART 3', [['TAIL FIN', 'Floor beside/under the Bus Depot payphones']]), 'Turbine tail-fin spawn', 'The tail fin is the smallest Turbine part.')] }),
        step('Build and test the Turbine', 'Bus Depot workbench', 'Hold interact after all three parts are attached. Place the Turbine beside the first powered door to confirm it works, then pick it back up.', { success: 'The Turbine appears in the player’s equipment slot and powers nearby doors or machines.', warning: 'Zombies damage deployed Turbines. Build fresh replacements before the final Maxis lamp step.', images: [buildableMap] })
      ], { intro: 'Every Turbine part is inside the starting room. No points or doors are required.' }),

      guide('Power Switch — exact Power Station room', 'Releases the Avogadro and controls map power', [
        step('Drop into the Power Station laboratory', 'Power Station outhouse entrance after the Farm bus stop', 'Open the outhouse for 750 points and jump down. Follow the corridor into the laboratory. Do not leave until every part is placed on the switch workbench.'),
        step('Find the switch lever', 'Power Station laboratory, floor and shelving around the workbench / central chamber', 'Search the ground beside the workbench and the nearby equipment shelves for the long metal lever. Attach it immediately.'),
        step('Find the circuit board', 'Power Station laboratory, shelves and floor beside the broken control equipment', 'Look for the flat circuit-board component around the same lower laboratory rooms. Attach it to the workbench.'),
        step('Find the zombie arm', 'Power Station laboratory, floor beside the machinery and chamber route', 'Look for the severed arm in the laboratory floor spawns, then attach it as the final handle component.', { images: [image(diagram('POWER SWITCH PART AREA', [['LEVER', 'Laboratory floor/shelf beside the workbench'], ['CIRCUIT BOARD', 'Broken-control shelves and floor in the lower lab'], ['ZOMBIE ARM', 'Floor beside laboratory machinery / central chamber'], ['BUILD', 'Workbench inside Power Station laboratory']]), 'Power Switch part zone', 'All three parts remain within the Power Station laboratory.')] }),
        step('Choose the branch before pulling the switch', 'Completed Power Switch', 'For Richtofen, turn power on and leave it on. For Maxis, turn it on long enough to release the Avogadro and hear Maxis, then turn it back off.', { warning: 'Switching power incorrectly can force another storm/Avogadro setup and confuse voice-line progression.' })
      ]),

      guide('EMP Grenades — Mystery Box requirement', 'Required to destroy the Avogadro or disable street lamps', [
        step('Spin the Mystery Box until a player receives EMP Grenades', 'Mystery Box, initially outside the Diner', 'EMP Grenades cannot be built or bought from a wall. Preserve both throws for the Easter egg.', { tip: 'Do not EMP the bus, perks, Pack-a-Punch setup, or the pylon Turbines by accident.' })
      ]),

      guide('Jet Gun / Thrustodyne — every part and spawn pool', 'Required for Richtofen’s pylon overload', [
        step('Collect the Jet Engine', 'Road tunnel between Bus Depot and Diner', 'Search four possible positions: near the first window on the left; beside a car near the M16 railing; between the first window on the right and the M16 wall-buy; or between the cars on the left side of the encampment. Carry it to Town and attach it to the bar workbench.', { images: [jetGunMap] }),
        step('Collect the Wires', 'Power Station Tombstone/lava room, only after power has been activated', 'Wait for Maxis to finish speaking after power activation. Search the lower floor near the collapsed catwalk/electrical box; the lower floor near the collapsed bridge; beside Tombstone; or the small window room on a barrel. Carry them to Town.', { warning: 'The wires do not appear correctly before the Power Station event finishes.' }),
        step('Collect the Hand Brake', 'Nacht der Untoten prototype in the cornfield between Farm and Power Station', 'Enter the corn maze and find the Nacht building. Search beside the lamp, inside a cabinet, or on the right side of the blocked stairway behind the desk. Carry it to Town.'),
        step('Collect the Pressure Gauge', 'Hunter’s Cabin in the fog between Power Station and Town', 'Search beside the fireplace, on the bed near the back door, or along the cabin shelf/wall spawn. Carry it to Town.'),
        step('Build and preserve the Jet Gun', 'Town bar workbench', 'Attach all four parts. Let the left dial cool fully before the Richtofen step. If it breaks, collect the scattered parts immediately; parts lost to lava return to their original spawn, while bus contact can cause extra recovery problems.', { success: 'The completed Thrustodyne occupies the buildable-equipment slot.' })
      ], { intro: 'Only one Jet Gun part can be carried at a time. The route is Tunnel → Power → Nacht → Hunter’s Cabin → Town.' })
    ];

    tranzit.optionalSideQuests = [
      guide('Zombie Shield — all part spawns', 'Back protection and shield bash', [
        step('Find the Car Door', 'Diner gas-station Garage', 'Check the bathroom floor beside the sink; the car on the maintenance platform; or the table beside the room containing the workbench. Carry the door to the garage workbench.', { images: [shieldDiagram] }),
        step('Find the Hand Trolley', 'Inside the Diner', 'Check behind the counter on either side, or beside the booth at the far end from Speed Cola. Carry it across to the garage workbench.'),
        step('Build and replace the shield', 'Garage workbench', 'Attach both parts and build. When the shield breaks, return to the same bench for a free replacement.', { success: 'The shield protects the player’s back while holstered.' })
      ]),

      guide('Turret — all Farm parts', 'Deployable RPD turret powered by a Turbine', [
        step('Find the unusable RPD', 'Farm barn or farmhouse', 'Check the top floor of the barn near Double Tap; the upstairs farmhouse sofa; or the main-floor wall to the right of the doorway leading to the back room.'),
        step('Find the Ammo Bag', 'Farmhouse bottom floor', 'Search the bottom floor near the buildable workbench.'),
        step('Find the Lawn Mower', 'Behind the farmhouse back door', 'Open or walk around to the rear of the house and collect the mower part.'),
        step('Build and power the Turret', 'Farmhouse lower-floor workbench', 'Build all three parts. Deploy a Turbine beside the Turret to make it fire.', { warning: 'The Turret can down players. Do not stand in its firing lane.', images: [image(diagram('FARM TURRET PARTS', [['RPD', 'Barn top floor near Double Tap · upstairs sofa · main-floor back-room doorway'], ['AMMO BAG', 'Farmhouse bottom floor beside workbench'], ['LAWN MOWER', 'Behind farmhouse back door'], ['POWER', 'Deploy a Turbine beside the completed Turret']]), 'TranZit Turret spawns', 'All three Turret parts are within the Farm area.')] })
      ]),

      guide('Electric Trap — all Power Station parts', 'Portable electric barrier powered by a Turbine', [
        step('Find the Battery', 'Tombstone/lava room above the Power Switch area', 'Check directly in front of the workbench or on/near the barrels.'),
        step('Find the Tesla Coil', 'Same Tombstone/lava room', 'Check the barrels near the destroyed-road wall and the nearby floor spawns.'),
        step('Find the TV Screen', 'Same Tombstone/lava room', 'Check the upper window to the right of the stairs or the boxes below the workbench.'),
        step('Build and power the trap', 'Workbench in the Tombstone/lava room', 'Build all three parts and deploy it beside a Turbine. Keep clear of the electrical field.', { images: [image(diagram('ELECTRIC TRAP PARTS', [['BATTERY', 'In front of workbench · barrels'], ['TESLA COIL', 'Barrels by destroyed-road wall'], ['TV SCREEN', 'Upper window right of stairs · boxes below workbench'], ['BUILD', 'Workbench in Tombstone/lava room']]), 'Electric Trap part spawns', 'All three parts are in the Power Station room above the switch laboratory.')] })
      ]),

      guide('Pack-a-Punch — remote Turbine door', 'Pack-a-Punch Machine beneath Town', [
        step('Place a fresh Turbine at the remote door', 'Power Station laboratory, mechanical door after dropping into the facility', 'Deploy a fresh Turbine beside the marked mechanical door. This remotely opens the underground Town route while the Turbine remains alive.'),
        step('Open both Town bank vault doors', 'Town Bank', 'Travel quickly to Town. Throw a grenade at the first steel vault door, enter, then grenade the second vault door.'),
        step('Enter before the remote Turbine breaks', 'Tunnel behind the second bank vault door', 'If the corridor is blocked, the Power Station Turbine broke. Return with another Turbine and repeat.'),
        step('Collect the three Pack-a-Punch parts', 'Underground Town room', 'Search the room for the machine base, upper assembly, and battery/control component. Carry each one to the underground workbench and assemble the machine.', { images: [image(diagram('TRANZIT PACK-A-PUNCH ROUTE', [['1 · POWER STATION', 'Fresh Turbine beside remote mechanical door'], ['2 · TOWN BANK', 'Grenade first vault door, then second'], ['3 · UNDERGROUND', 'Collect all 3 machine parts and build before remote door closes']]), 'TranZit Pack-a-Punch route', 'The remote Power Station Turbine must survive until the team enters the underground room.')] })
      ]),

      guide('NAV Table — every part and spawn option', 'Persistent Victis super-Easter-egg table', [
        step('Collect the Meteorite', 'Bus Depot hole in the wall beside the Mystery Box spawn', 'Pick up the meteor and carry it beneath the cornfield pylon.'),
        step('Collect the Wooden Board', 'M16 tunnel or Power Station lava platform', 'The board spawns either beside the M16 in the Bus Depot–Diner tunnel, or on the platform below the Power Station workbench/Tombstone area.'),
        step('Collect the Radio', 'Diner Garage shelf or Nacht prototype', 'In the Garage, jump to grab the shelf radio; otherwise search inside Nacht in the cornfield.'),
        step('Collect the Electric Box', 'Town dumpster, Farm fridge, or behind Bus Depot lava pool', 'Search the gap between Town dumpster and Mystery Box spawn; beside the farmhouse fridge; or behind the Bus Depot lava pool.'),
        step('Build the table', 'Directly beneath the cornfield pylon', 'Carry and attach the four parts one at a time. Once built, the table persists across later matches.', { images: [image(diagram('TRANZIT NAV TABLE', [['METEOR', 'Bus Depot wall hole'], ['BOARD', 'M16 tunnel · Power Station lava platform'], ['RADIO', 'Diner Garage shelf · Nacht'], ['ELECTRIC BOX', 'Town dumpster · Farm fridge · behind Bus Depot lava'], ['BUILD', 'Under cornfield pylon']]), 'TranZit NAV Table part route', 'This table is part of the Victis meta quest, not a required Tower of Babble step.')] })
      ]),

      guide('Bus upgrades — Ladder, Roof Hatch, and Plow', 'Permanent upgrades for the current match', [
        step('Open the turbine sheds', 'Small powered sheds at Bus Depot, Diner, Farm, and Town', 'Place a Turbine beside each powered shed door. Three upgrades are distributed among the possible sheds each match.'),
        step('Install the Roof Hatch', 'Inside the bus ceiling or Diner roof access', 'Attach it to the bus ceiling for roof access, or install it at the Diner ceiling opening to reach Galvaknuckles. It cannot be installed in both places.'),
        step('Install the Ladder', 'Left exterior side of the bus', 'Attach the ladder to climb onto the bus roof from outside.'),
        step('Install the Plow', 'Front bumper of the bus', 'Attach the cowcatcher/plow so the bus kills more zombies in its path.')
      ]),

      guide('Denizen lamp teleporters', 'Fast travel between green lamps', [
        step('Let a Denizen latch on', 'Fog between major locations', 'Do not melee it off. Carry it beneath a green street lamp.'),
        step('Wait for the ground portal', 'Directly below the green lamp', 'Remain in place while the Denizen digs. Kill it only after the portal appears.'),
        step('Use linked portals', 'Any active lamp portal', 'Jump through to emerge at another active green-lamp portal. These portals make the low-player Richtofen lamp step possible but difficult.')
      ]),

      guide('Bank and Weapon Locker', 'Persistent points and one stored weapon', [
        step('Deposit or withdraw points', 'Town Bank teller counter', 'Use the deposit keys behind the counter to bank points across matches. Use the withdrawal keys to recover them, paying the game’s withdrawal fee.'),
        step('Store one eligible weapon', 'Farmhouse refrigerator', 'Interact with the refrigerator to store one eligible weapon for a later match. Wonder weapons and some special weapons cannot be stored.')
      ]),

      guide('“Carrion” musical Easter egg', 'Carrion by Kevin Sherwood', [
        step('Activate the Bus Depot teddy', 'Outside Bus Depot on a bench', 'Hold interact on the teddy bear.'),
        step('Activate the Farm teddy', 'Farmhouse upper floor on a mattress', 'Hold interact on the teddy bear.'),
        step('Activate the Town teddy', 'Town bar booth / seat', 'Hold interact on the final teddy. Carrion begins.', { success: 'The song starts immediately after the third interaction.' })
      ])
    ];

    tranzit.sideQuests = [...tranzit.requiredGuides, ...tranzit.optionalSideQuests];
    tranzit.sources = [
      source('Call of Duty Zombies — TranZit main quest', 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/tranzit/', 'Maxis and Richtofen quest branches'),
      source('Call of Duty Zombies — Construct the Jet Gun', 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/tranzit/richtofen_steps_the_tower_of_babble/construct-the-jet-gun-r60/', 'All Jet Gun spawn pools'),
      source('Call of Duty Wiki — TranZit', 'https://callofduty.fandom.com/wiki/TranZit', 'Buildables, map systems, side quests, and part locations'),
      source('Call of Duty Wiki — Zombie Shield', 'https://callofduty.fandom.com/wiki/Zombie_Shield', 'Exact shield spawns'),
      source('Call of Duty Wiki — Turret', 'https://callofduty.fandom.com/wiki/Turret', 'Exact Turret part spawns')
    ];
  }

  const nuketown = findMap('black-ops-2-nuketown-zombies');
  if (nuketown) {
    nuketown.auditStatus = 'beginner-depth';
    nuketown.status = 'Beginner-depth audited';
    nuketown.requiredGuides = [];
    nuketown.mainQuests = [];
    nuketown.optionalSideQuests = [
      guide('Random perk and Pack-a-Punch drops', 'Permanent machines for the current match', [
        step('Read the population counter', 'Welcome to Nuketown sign', 'Every zombie kill advances the two-digit population counter. At each 100-kill rollover, the white clock hand advances and the next machine-drop cycle becomes possible.'),
        step('Listen for the air-raid siren', 'Entire map', 'When the siren sounds, look up and move away from the marked landing pads. A falling perk or Pack-a-Punch machine can crush players and zombies.'),
        step('Adapt to the random order', 'Ten machine landing pads around both houses and yards', 'The order is random. Quick Revive is first in solo, but Jugger-Nog and Pack-a-Punch may arrive late. Check both front yards, both backyards, and side lanes after every siren.', { images: [image(diagram('NUKETOWN MACHINE DROPS', [['KILL COUNTER', 'Every 100 kills rolls the population counter'], ['SIREN', 'Move away from landing pads'], ['RANDOM DROP', 'Perk or Pack-a-Punch falls from mushroom cloud'], ['SOLO', 'Quick Revive arrives first; everything else stays random']]), 'Nuketown machine-drop system', 'Do not wait under a landing pad when the siren begins.')] })
      ]),
      guide('Marlton fallout-shelter dialogue', 'Hidden Victis story audio', [step('Knife the shelter door', 'Yellow-house backyard fallout-shelter entrance', 'Melee the metal shelter door repeatedly to hear Marlton Johnson hiding inside.')]),
      guide('Moon-event announcer change', 'Richtofen story event', [
        step('Listen to round-transition transmissions', 'Map-wide', 'The radios and voices reference the simultaneous events on Moon.'),
        step('Reach round 25', 'Survival progression', 'At the transition after round 24, Richtofen completes the soul swap. Zombies gain blue eyes and Richtofen becomes the demonic announcer.', { success: 'Blue-eyed zombies spawn on round 25.' })
      ]),
      guide('“Samantha’s Lullaby”', 'Music track', [
        step('Bus teddy', 'School bus interior seat', 'Hold interact on the teddy.'),
        step('Yellow-house teddy', 'Yellow house upper-floor top bunk', 'Hold interact on the teddy.'),
        step('Green-house teddy', 'Outside the green-house backyard fence', 'Hold interact on the final teddy to start the song.')
      ]),
      guide('“Coming Home” 8-bit', 'Music track', [step('Remove every mannequin head', 'Both houses, front yards, backyards, and side lanes', 'Shoot every mannequin head before the set resets. Sweep in a fixed loop so no backyard or upstairs mannequin is missed.', { success: 'The 8-bit song begins after the final valid head is destroyed.' })]),
      guide('Population-15 shed secret', 'Music / power-up interaction', [step('Collect the shed power-up at population 15', 'Locked power-up shed behind the yellow house', 'Open the shed for 3,000 points. Wait until the population counter reads 15, then take the current power-up to trigger the related secret sequence.')])
    ];
    nuketown.sideQuests = nuketown.optionalSideQuests;
    nuketown.sources = [
      source('Call of Duty Wiki — Nuketown Zombies', 'https://callofduty.fandom.com/wiki/Nuketown_Zombies', 'Machine drops, songs, Marlton, and story events'),
      source('Call of Duty Wiki — Nuketown radios', 'https://callofduty.fandom.com/wiki/Nuketown_Zombies/Radios', 'Round-transition radio timeline')
    ];
  }
})();