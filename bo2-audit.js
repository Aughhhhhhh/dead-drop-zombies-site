(() => {
  'use strict';

  const data = window.DEAD_DROP_DATA;
  if (!data?.games) return;

  const findMap = (id) => {
    for (const game of data.games) {
      const map = (game.maps || []).find((entry) => entry.id === id);
      if (map) return map;
    }
    return null;
  };

  const step = (title, location, body, extras = {}) => ({ title, location, body, ...extras });
  const guide = (name, reward, steps) => ({ name, reward, steps });
  const image = (src, title, caption) => ({ src, title, caption });
  const source = (title, url, note) => ({ title, url, note });

  const tranzitDiagram = image('/assets/bo2/tranzit-pylon.svg', 'TranZit pylon and final lamp routes', 'Maxis uses two Turbines under the pylon and two lamp Turbines; Richtofen uses the Jet Gun, explosive kills, and four EMP-disabled green lamps.');
  const dieRiseDiagram = image('/assets/bo2/die-rise-flow.svg', 'Die Rise branch and Mahjong reference', 'The shared elevator/floor/sniper steps split into Maxis or Richtofen, then reunite at the randomized Mahjong-tile punch order.');
  const mobDiagram = image('/assets/bo2/mob-cycle.svg', 'Mob of the Dead plane and cycle route', 'Build the plane, make three bridge round-trips, complete the code/headphone route, then take the spectral plane to the final fight.');
  const buriedDiagram = image('/assets/bo2/buried-branches.svg', 'Buried Richtofen and Maxis branch map', 'The Guillotine and Gallows use shared parts, so commit to one route before attaching the wire or antenna.');

  const tranzit = findMap('black-ops-2-tranzit-green-run');
  if (tranzit) {
    tranzit.status = 'Deep-audited guide';
    tranzit.auditStatus = 'deep-audited';
    tranzit.requirements = [
      'Original difficulty; Easy disables the main quest',
      'Power Switch built in the Power Station',
      'EMP Grenades from the Mystery Box',
      'Maxis route: at least two players and fresh Turbines',
      'Richtofen route: Jet Gun, explosive weapons, and Samuel Stuhlinger for audible progress cues'
    ];
    tranzit.requiredGuides = [
      guide('Power Switch', 'Map power and Avogadro access', [
        step('Collect the three power parts', 'Power Station lower room', 'Pick up the circuit board, switch lever, and zombie arm from their possible positions in the power-building rooms.'),
        step('Assemble and activate', 'Workbench beside the power doors', 'Build the switch and pull it. Maxis requires the power to be switched back off after the Avogadro escapes; Richtofen requires it to remain on.')
      ]),
      guide('Turbine', 'Portable power for the Maxis route', [
        step('Collect the fan, mannequin, and tail piece', 'Bus Depot starting room', 'All three parts spawn inside the starting building. Build the Turbine before opening the first door.'),
        step('Prepare four fresh Turbines for a four-player Maxis run', 'Bus Depot workbench', 'Two are used beneath the pylon and two are placed under green lamps. In a two-player run, the pylon Turbines may be removed before the final lamp step.')
      ]),
      guide('Jet Gun / Thrustodyne', 'Required for Richtofen’s pylon step', [
        step('Collect the engine', 'Hunter’s Cabin between Power Station and Town', 'Leave the bus route through the fog and search the cabin.'),
        step('Collect the wires', 'Nacht der Untoten cornfield building', 'Enter the cornfield maze between Farm and Power Station and search the Nacht building.'),
        step('Collect the gauge', 'Cabin near the Diner / Tunnel route', 'Search the small cabin reached from the fog near the Diner and Bus Depot tunnel.'),
        step('Collect the hand brake', 'Power Station area near Tombstone', 'Search the lower Power Station route.'),
        step('Build the Jet Gun', 'Town bar workbench', 'Carry one part at a time to Town and assemble all four. Let it cool completely before the pylon step.')
      ])
    ];
    tranzit.mainQuests = [
      {
        id: 'tower-of-babble-maxis', name: 'Tower of Babble — Maxis', players: '2–4 players', reward: 'Orange Maxis tower alignment and Tower of Babble achievement', summary: 'Shut down the power, transfer the Avogadro into the pylon, and route energy from two green lamps.',
        steps: [
          step('Release the Avogadro and shut the power down', 'Power Station', 'Activate the completed Power Switch. Wait until Maxis explicitly asks for the power to be turned off or until the Avogadro escapes from the central chamber, then pull the switch back off. Leave the map power disabled for the rest of the Maxis route.', { success: 'The Avogadro is active in the map while the power remains off.' }),
          step('Spawn the Avogadro under a thunderstorm', 'Cornfield pylon between Farm and Power Station', 'Wait for a round transition during a thunderstorm. Lightning must flash directly above a player for the Avogadro to have a chance to spawn. Keep rotating rounds near the pylon until the electrical figure appears.', { tip: 'Save a slow final zombie before the storm round so the squad can position Turbines safely.' }),
          step('Power the pylon with two Turbines', 'Directly beneath the pylon', 'Place two fresh Turbines under the tower. Wait for Maxis to finish speaking before attacking the Avogadro. Replace a Turbine immediately if Maxis says the power supply is being drained.', { success: 'Maxis acknowledges the power sources beneath the tower.', images: [tranzitDiagram] }),
          step('EMP the Avogadro beneath the pylon', 'Centre of the pylon', 'Lure the Avogadro directly under the structure, then throw an EMP Grenade close enough to destroy it without landing the EMP on the Turbines. The Turbines must still be running when the Avogadro disappears.', { success: 'The tower is charged and Maxis advances to the lamp step.', warning: 'An EMP that disables the Turbines can invalidate the transfer. Use a fresh EMP and Turbines if Maxis reports failure.' }),
          step('Route two lamp orbs into the pylon', 'Any two green street lamps around Green Run', 'In a four-player run, leave the original two Turbines beneath the pylon. The other two players simultaneously place fresh Turbines beneath two different green lamps. In a two-player run, each player may remove a pylon Turbine and take it to a different lamp after the Avogadro transfer.', { success: 'Orange energy orbs leave the lamps, fly to the pylon, and Tower of Babble completes.', images: [tranzitDiagram] })
        ]
      },
      {
        id: 'tower-of-babble-richtofen', name: 'Tower of Babble — Richtofen', players: '1–4 players; four is strongly recommended', reward: 'Blue Richtofen tower alignment and Tower of Babble achievement', summary: 'Keep the power on, overload the pylon with the Jet Gun and explosives, then disable four green lamps together.',
        steps: [
          step('Keep power on and fully cool the Jet Gun', 'Power Station and cornfield pylon', 'Activate the Power Switch and leave it on. Carry the Jet Gun beneath the pylon. Stop firing for roughly 40–60 seconds so the weapon is completely cooled before the attempt.', { warning: 'A partially cooled Jet Gun can break before the pylon registers, forcing the team to rebuild it.' }),
          step('Break the Jet Gun beneath the pylon', 'Exact centre beneath the cornfield tower', 'Hold the Jet Gun trigger continuously while standing under the pylon until the weapon overheats and breaks into its four parts.', { success: 'Richtofen speaks to Stuhlinger and the green street lamps begin flickering.', images: [tranzitDiagram] }),
          step('Earn 25 explosive kills beneath the tower', 'Inside the pylon footprint', 'Kill 25 zombies with explosive damage while the zombies are under the pylon. Ray Gun, Ray Gun Mark II splash, RPG, War Machine, grenades, and similar explosive damage can count. The total is shared by the team.', { success: 'Stuhlinger hears Richtofen complain that the pylon now has too much power.', warning: 'Kills made outside the pylon footprint do not count.' }),
          step('Disable four different green lamps at once', 'Four green street lamps around Green Run', 'Assign one player to each lamp and throw EMP Grenades so all four lamps are disabled within the same EMP duration. With two or three players, create Denizen portals under lamp posts and use the portals to reach a second lamp before the first EMP effect expires.', { success: 'Richtofen congratulates Stuhlinger and the pylon glows blue.', warning: 'Solo completion requires difficult Denizen-portal routing and multiple EMP throws; use four players for a reliable run.', images: [tranzitDiagram] })
        ]
      }
    ];
    tranzit.optionalSideQuests = [
      guide('Navcard Table and Victis meta quest', 'Persistent table used across TranZit, Die Rise, and Buried', [
        step('Build the table beneath the pylon', 'Cornfield pylon', 'Collect the meteorite, wooden board, radio, and electrical box and assemble them beneath the tower. The completed table persists across matches.'),
        step('Use the correct Navcard later', 'Completed table', 'The TranZit Navcard is accepted on a different Victis map as part of the super Easter egg. The table itself is not a required step for Tower of Babble.')
      ]),
      guide('Denizen lamp teleporters', 'Fast travel through the fog', [
        step('Carry a Denizen to a green lamp', 'Fog between major areas', 'Allow a Denizen to latch onto the player and run beneath a green lamp.'),
        step('Let it dig the portal', 'Directly under the lamp', 'Remain in place until the Denizen creates a ground portal. Jump through to travel to another active lamp portal.')
      ]),
      guide('Pack-a-Punch', 'Underground Pack-a-Punch room in Town', [
        step('Power the Power Station door with a Turbine', 'Power Station vault door', 'Place a fresh Turbine beside the door mechanism.'),
        step('Open the Town bank vault', 'Town bank', 'Grenade both vault doors and enter the underground corridor while the remote Turbine still has power.'),
        step('Build Pack-a-Punch', 'Underground workbench', 'Collect the three parts inside the underground room and assemble the machine. The Power Station door closes when the Turbine breaks.')
      ])
    ];
    tranzit.sideQuests = [...tranzit.requiredGuides, ...tranzit.optionalSideQuests];
    tranzit.visuals = [];
    tranzit.sources = [
      source('Call of Duty: Zombies Guides — TranZit', 'https://www.codzombiesguides.com/main-quests/black-ops-2/tranzit/', 'Player counts, requirements, pylon steps, lamp steps, and completion cues'),
      source('ItemLevel — TranZit Maxis and Richtofen', 'https://itemlevel.net/black-ops-2-zombies-tranzit-easter-egg-guide-2026-richtofen-maxis/', 'Detailed failure recovery and lower-player routing'),
      source('Call of Duty Wiki — Tower of Babble', 'https://callofduty.fandom.com/wiki/Tower_of_Babble', 'Original achievement and branch cross-check')
    ];
  }

  const nuketown = findMap('black-ops-2-nuketown-zombies');
  if (nuketown) {
    nuketown.status = 'Deep-audited guide';
    nuketown.auditStatus = 'deep-audited';
    nuketown.requirements = [];
    nuketown.mainQuests = [];
    nuketown.requiredGuides = [];
    nuketown.optionalSideQuests = [
      guide('Perk and Pack-a-Punch drops', 'Random permanent machine drops', [
        step('Watch the population counter', 'Welcome to Nuketown sign', 'Each zombie kill increments the two-digit population counter. Every 100 kills resets it to 00 and advances the white clock hand.'),
        step('Move away from drop pads when the siren sounds', 'Ten marked landing positions around the houses and spawn', 'A perk machine or Pack-a-Punch falls from the mushroom cloud after a kill-count threshold. The falling machine can kill players or zombies.'),
        step('Adapt to the random order', 'Entire map', 'The order and landing location are random. In solo, Quick Revive arrives first. Do not plan a high-round route around a perk that has not landed yet.')
      ]),
      guide('Marlton in the fallout shelter', 'Hidden Victis dialogue', [step('Knife the bunker door', 'Yellow-house backyard shelter', 'Melee the fallout-shelter door to hear Marlton Johnson hiding inside.')]),
      guide('Moon-event radio progression', 'Richtofen dialogue and announcer change', [
        step('Listen at round transitions', 'Map-wide', 'Richtofen recordings play as the concurrent Moon quest progresses.'),
        step('Reach round 25', 'Survival progression', 'At the end of round 24, Richtofen completes the soul swap. The demonic announcer changes and zombie eyes turn blue on round 25.', { success: 'Richtofen becomes the announcer and blue-eyed zombies spawn.' })
      ]),
      guide('“Samantha’s Lullaby”', 'Music track', [
        step('Interact with the bus teddy', 'Seat inside the school bus', 'Hold interact on the teddy bear.'),
        step('Interact with the yellow-house teddy', 'Top bunk upstairs in the yellow house', 'Hold interact on the teddy bear.'),
        step('Interact with the green-house teddy', 'Outside the backyard fence of the green house', 'Hold interact on the final bear. The lullaby begins.', { warning: 'The bears appear on Original difficulty.' })
      ]),
      guide('“Coming Home” 8-bit', 'Music track', [step('Remove every mannequin head', 'All mannequins around both houses and yards', 'Shoot every mannequin head before the set resets. The 8-bit song starts after the final valid head is removed.')]),
      guide('Population-15 shed music', '8-bit Pareidolia / Re-Damned sequence', [step('Take the shed power-up at population 15', 'Locked power-up shed behind the yellow house', 'Open the shed for 3,000 points. When the population counter reads 15, collect the current power-up to trigger the related secret music sequence.')])
    ];
    nuketown.sideQuests = nuketown.optionalSideQuests;
    nuketown.visuals = [];
    nuketown.sources = [
      source('Call of Duty Wiki — Nuketown Zombies', 'https://callofduty.fandom.com/wiki/Nuketown_Zombies', 'Machine drops, story events, songs, and Marlton'),
      source('Call of Duty Wiki — Nuketown radios', 'https://callofduty.fandom.com/wiki/Nuketown_Zombies/Radios', 'Round and Moon-event dialogue cross-check')
    ];
  }

  const dieRise = findMap('black-ops-2-die-rise');
  if (dieRise) {
    dieRise.status = 'Deep-audited guide';
    dieRise.auditStatus = 'deep-audited';
    dieRise.players = '4 players';
    dieRise.requirements = [
      'Original difficulty and four players',
      'Power on and persistent Navcard Table built',
      'Four Trample Steams',
      'Galvaknuckles for the final Mahjong step',
      'Maxis: Ballistic Knife upgraded to Krauss Refibrillator; holder must not have bought Bowie Knife or Galvaknuckles',
      'Richtofen: Sliquifier'
    ];
    dieRise.requiredGuides = [
      guide('Trample Steam', 'Four launch devices required by both branches', [
        step('Collect the flag, bellows, motor, and battery', 'Spawn-building and upside-down-building part pools', 'Carry all four parts to the spawn-building workbench.'),
        step('Build four devices', 'Trample Steam workbench', 'Each player takes one Trample Steam. Preserve them until the branch-specific pylon stage.')
      ]),
      guide('Sliquifier', 'Required for Richtofen; useful everywhere', [
        step('Collect the four Sliquifier parts', 'Power-building rooms and lower floors', 'Find the mannequin foot, gas canister, hand brake, and wires.'),
        step('Build at the lower power-building workbench', 'Room near the AK74u route', 'Only one Sliquifier can be held at a time. Do not lose it before the Richtofen orb stage.')
      ]),
      guide('Mahjong tile decoding', 'Random final punch order', [
        step('Find the four number/bird tiles and four direction tiles', 'Eight active tiles among eleven possible spawns', 'Record the color painted on each tile. Number/bird tiles define order 1–4; direction tiles define North, East, South, or West.'),
        step('Pair matching colors', 'Notes or the quick-reference diagram', 'For each number tile, find the direction tile with the same color. The result is a four-direction sequence.'),
        step('Orient at the pylon', 'Power-building roof', 'North is the pylon side facing away from the Power Building, beside the fixed pylon tile. From that orientation, identify East, South, and West before anyone punches.', { images: [dieRiseDiagram] })
      ])
    ];
    const sharedSteps = [
      step('Activate the four elevator symbols together', 'Quick Revive elevator, Trample Steam elevator, power-switch elevator, and MP5 elevator', 'Place one player on each golden elevator-roof symbol and stand on all four simultaneously. Watch elevator movement and step away before a roof reaches the top ceiling.', { success: 'All four elevator symbols remain illuminated and both voices speak.' }),
      step('Solve the four randomized floor symbols', 'Spawn outside Quick Revive, Power Building rooftop drop-down, Cafeteria, and bank-shower rooftop', 'Test the floor symbols one at a time. A correct symbol stays lit after the player steps off; an incorrect choice resets the current sequence. Continue until all four are lit in the match’s random order.', { success: 'Both Maxis and Richtofen speak after the fourth floor symbol.' }),
      step('Shoot both dragon-mouth balls with a sniper rifle', 'Two dragon heads on the Power Building rooftop', 'Buy the SVU-AS near the Department Store or acquire another sniper rifle. Shoot the small ball inside each dragon mouth until both fall to the spawn-room lion statues.', { success: 'The two balls appear beneath the lions and the route is ready to split.', images: [dieRiseDiagram] })
    ];
    dieRise.mainQuests = [
      {
        id: 'high-maintenance-maxis', name: 'High Maintenance — Maxis', players: '4 players', reward: 'Orange pylon, all perks, and High Maintenance achievement', summary: 'Complete the shared symbol stages, perform the Buddha-room reincarnation steps, launch the balls into the tower, then solve Mahjong.',
        steps: [
          ...sharedSteps,
          step('Earn 15 uninterrupted Buddha-room kills', 'Ground floor of the upside-down Buddha room', 'Kill 15 zombies continuously while every counted kill occurs on the ground floor. A kill made outside the room during this stage resets the hidden total.', { success: 'Maxis says, “Reincarnation will reveal the way forward.”' }),
          step('Fire the Krauss Refibrillator in the Buddha room', 'Buddha-room ground floor', 'A player who has not purchased Bowie Knife or Galvaknuckles obtains the Ballistic Knife, Pack-a-Punches it to the Krauss Refibrillator, and fires it in the Buddha room. If a shot into the room does not register, fire the knife into a live zombie inside.', { success: 'Maxis gives the next instruction.', warning: 'The step can fail for a holder who previously bled out or bought a melee upgrade; use a different eligible player if possible.' }),
          step('Lock four Trample Steams onto the lion symbols', 'Power rooftop box side, bottom of spawn escalators, outside the two power-building elevators, and spawn room', 'Place each Trample Steam on a golden lion symbol with the launcher facing the same direction as the lion head—toward the pylon. A correctly placed device locks and cannot be picked up.'),
          step('Launch both balls between the buildings', 'Spawn-room lion statues and the two spawn-side Trample Steams', 'Pick up both balls. Put one on the Trample Steam in the spawn room and the other on the device at the bottom of the escalators. The chain of four devices launches orange wisps into the pylon.', { success: 'The lower pylon glows orange.', images: [dieRiseDiagram] }),
          step('Punch the pylon sides in the Mahjong order', 'Four faces of the power-roof pylon', 'Use Galvaknuckles and punch the four pylon sides in the randomized direction order decoded from the eight Mahjong tiles. Only one full attempt is allowed per round.', { success: 'The pylon surges orange, every player receives all perks, and High Maintenance completes.', warning: 'If the order fails, wait for the next round before retrying.' })
        ]
      },
      {
        id: 'high-maintenance-richtofen', name: 'High Maintenance — Richtofen', players: '4 players', reward: 'Blue pylon, all perks, and High Maintenance achievement', summary: 'Complete the shared symbol stages, spin the dragon balls with the Sliquifier, launch zombie energy into the tower, then solve Mahjong.',
        steps: [
          ...sharedSteps,
          step('Spin both balls with the Sliquifier', 'Spawn-room lion statues', 'Fire continuously at each ball beneath the lion paws. Expect roughly 20 direct Sliquifier shots per ball. Stop when both balls visibly spin.', { success: 'Richtofen asks Stuhlinger for a blood sacrifice.' }),
          step('Lock four Trample Steams onto the zombie symbols', 'Semtex balcony, outside the Quick Revive elevator, and the two symbols on the path descending from the Power rooftop', 'Place each device so the golden zombie head points toward the pylon. Correct devices lock in place.'),
          step('Feed launched bodies into the pylon', 'The four locked Trample Steam positions', 'Trigger the devices repeatedly by launching players or zombies. Continue until enough launched energy reaches the tower.', { success: 'The lower pylon glows blue.', images: [dieRiseDiagram] }),
          step('Punch the pylon sides in the Mahjong order', 'Power-roof pylon', 'Use Galvaknuckles to punch North, East, South, or West in the four-direction sequence decoded from the colored number and direction tiles.', { success: 'The pylon surges blue, every player receives all perks, and High Maintenance completes.', warning: 'A wrong sequence consumes the round’s attempt.' })
        ]
      }
    ];
    dieRise.optionalSideQuests = [
      guide('“We All Fall Down” song', 'Music track', [step('Activate the three teddy bears', 'Across the spawn, upside-down, and rooftop buildings', 'Hold interact on all three hidden teddy bears in any order. The song begins after the third.')]),
      guide('Jumping-Jack free perk', 'Random perk bottle', [step('Finish a Jumping-Jack round with perfect accuracy', 'Any defensible room', 'Kill every Jumping Jack without missing a single bullet or melee swing during the round.'), step('Collect the bottle', 'Final Jumping-Jack death location', 'The last enemy drops a Random Perk Bottle if the accuracy condition remained perfect.')])
    ];
    dieRise.sideQuests = [...dieRise.requiredGuides, ...dieRise.optionalSideQuests];
    dieRise.visuals = [];
    dieRise.sources = [
      source('Call of Duty: Zombies Guides — Die Rise', 'https://www.codzombiesguides.com/main-quests/black-ops-2/die-rise/', 'Shared steps, both branches, Mahjong logic, counts, and locations'),
      source('Call of Duty Wiki — High Maintenance', 'https://callofduty.fandom.com/wiki/High_Maintenance', 'Achievement and original-difficulty cross-check')
    ];
  }

  const mob = findMap('black-ops-2-mob-of-the-dead');
  if (mob) {
    mob.status = 'Deep-audited guide';
    mob.auditStatus = 'deep-audited';
    mob.players = '2–4 players; one must be Weasel';
    mob.requirements = [
      'Original difficulty and at least two players',
      'Albert “Weasel” Arlington must be present',
      'Warden’s Key',
      'All five plane parts and three bridge round-trips',
      'Hell’s Retriever',
      'Five spectral skulls and both spoon interactions'
    ];
    mob.requiredGuides = [
      guide('Warden’s Key', 'Unlocks all plane-part cages', [
        step('Locate the hanging key', 'Outside the Warden’s Office or above the Showers entrance', 'The key randomly uses one of the two hanging positions.'),
        step('Lower it in Afterlife', 'Blue portal above the active key position', 'Enter Afterlife, pass through the portal, and shock the highlighted generator until the key lowers. Return to life and pick it up.')
      ]),
      guide('Build Icarus', 'Plane to Golden Gate Bridge', [
        step('Shirt / Uniform', 'Showers', 'Unlock the Washing Machine cage with the key, shock its voltmeter in Afterlife, start the machine, survive the locked-room wash cycle, and collect the uniform.'),
        step('Rigging', 'Citadel spiral staircase', 'Unlock the keypad. In Afterlife, read the three large blue digits while descending and shock the keypad digits to match. Collect the lowered rigging.'),
        step('Engine', 'Generator Room and Warden’s Office', 'In Afterlife, shut down the two highlighted Generator Room units and the third unit through the blue portal. Unlock the de-energized Warden’s Office cage and collect the engine.'),
        step('Oxygen tanks', 'Docks beside the M1927', 'Unlock the outer cage. One player waits at the inner gate while an Afterlife player shocks the voltmeter, then shocks it again after the part is removed.'),
        step('Control valve', 'Infirmary green cabinet before the roof', 'Unlock the cabinet with the Warden’s Key and take the valve.'),
        step('Open the roof and assemble', 'Infirmary roof route', 'Use Afterlife to open the roof door permanently. Carry one plane part at a time to the roof ramp and install all five.', { images: [mobDiagram] })
      ]),
      guide('Hell’s Retriever and skulls', 'Required spectral weapon and free Blundergat', [
        step('Feed the three Cerberus heads', 'Broadway Cell Block, Docks, and Infirmary', 'Kill zombies close to each dog head until it disappears.'),
        step('Collect the Hell’s Retriever', 'Citadel Tunnels near Double Tap', 'Take the weapon from the wall beneath the three completed dog emblems.'),
        step('Collect five invisible skulls', 'Roof corner, Jugger-Nog lamp post, third Docks pillar, power pole outside Warden’s Office, and toilet near Library', 'Use Afterlife to confirm each skull, return to life, and hit it with a charged Retriever throw. After all five, collect the free Blundergat from the Warden’s Office table.')
      ])
    ];
    mob.mainQuests = [{
      id: 'pop-goes-the-weasel', name: 'Pop Goes the Weasel', players: '2–4 players; one Weasel', reward: 'Continue or break the cycle and unlock Pop Goes the Weasel', summary: 'Build and repeatedly fly Icarus, recover the spectral evidence, then choose the bridge ending.',
      steps: [
        step('Build Icarus and make the first bridge trip', 'Roof plane ramp', 'Complete every plane-part task, assemble Icarus, and board. The plane crashes at the Golden Gate Bridge, where Pack-a-Punch becomes available. Use the electric chairs to return to Alcatraz.', { success: 'Five fuel cans spawn near the former plane-part positions on the next round.', images: [mobDiagram] }),
        step('Complete three total bridge round-trips', 'Plane-part areas, roof, and Golden Gate Bridge', 'Collect the five fuel cans, refuel the roof plane, fly, and return in the chairs. Repeat until the team has completed three total prison-to-bridge-and-back trips.', { warning: 'The cycling keypad in the Citadel will not activate until the trip requirement and spectral evidence are complete.' }),
        step('Obtain the Hell’s Retriever and five skulls', 'Three dog heads and five spectral-skull sites', 'Feed every dog, collect the Retriever, then capture all five skulls. Take the free Blundergat from the Warden’s Office when it appears.', { success: 'The Warden’s Office Blundergat confirms all five skulls registered.' }),
        step('Complete both spoon interactions', 'Cell outside Warden’s Office and Cafeteria window', 'Throw the Retriever at the poster in the cell to reveal the Afterlife symbol. Enter Afterlife through the portal outside the Warden’s Office and shock the spoon on the floor beneath the symbol. In life, throw the Retriever through the Cafeteria window left of the workbench to collect the spoon on the table.', { success: 'Brutus gives a demonic reaction after each valid spoon.' }),
        step('Enter the four prisoner numbers', 'Cycling keypad at the bottom of the Citadel spiral staircase', 'When the display cycles endlessly, enter Afterlife and shock the keypad to submit 101, 872, 386, and 481. The four codes may be split across several Afterlife uses.', { code: '101 · 872 · 386 · 481', success: 'The screen turns black and white and the audio-log route begins.' }),
        step('Collect the five headphones in order', 'Citadel stairs, Double Tap route, Warden’s Office catwalk, Infirmary entrance, roof entrance', 'Follow the route upward from the Citadel. Collect each glowing headphone power-up and wait for its recording to finish enough to reveal the next.', { success: 'The roof plane changes into its spectral final form.' }),
        step('Board the spectral plane in Afterlife', 'Roof', 'Every player enters Afterlife and interacts with the plane. It does not require fuel for this flight. The plane takes the team to the bridge, where each player’s living body waits in an electric chair.', { images: [mobDiagram] }),
        step('Choose whether the cycle continues or breaks', 'Golden Gate Bridge', 'Revive the living bodies. Weasel can now damage the other prisoners and they can damage him. If the prisoners kill Weasel, the cycle continues. If Weasel kills every other prisoner, the cycle is broken.', { success: 'Either outcome unlocks the achievement; Weasel surviving is the canon broken-cycle ending.', warning: 'The fight ends the match, so finish optional upgrades before boarding the spectral plane.' })
      ]
    }];
    mob.optionalSideQuests = [
      guide('Acidgat and Vitriolic Withering', 'Upgraded Blundergat', [
        step('Build the Acidgat Kit', 'Any workbench', 'Collect the motor, case, and bottle parts from their map spawn pools.'),
        step('Convert the Blundergat', 'Acidgat Kit', 'Insert the Blundergat into the completed kit to receive the Acidgat.'),
        step('Pack-a-Punch at the bridge', 'Golden Gate Bridge', 'Upgrade the Acidgat into the Vitriolic Withering.')
      ]),
      guide('Hell’s Redeemer', 'Upgraded Retriever', [
        step('Earn Retriever-only kills', 'Golden Gate Bridge', 'Use only the Retriever until its kill condition is met.'),
        step('Throw it into the lava pit', 'Lava pit below the prison', 'Throw the Retriever into the pit and finish the current round.'),
        step('Collect it in Afterlife', 'Original Retriever wall', 'Enter Afterlife and take the blue Hell’s Redeemer from the wall.')
      ]),
      guide('Golden Spork', 'Powerful melee weapon', [
        step('Complete the spoon and bathtub route', 'Cafeteria, Infirmary, and bathtub', 'Use the spoon interactions, stir the Cafeteria pot, and place the spoon in the bathtub.'),
        step('Earn melee kills and claim the Spork', 'Showers / Cafeteria route', 'Complete the required melee-kill total, then retrieve the Golden Spork from the bathtub.')
      ]),
      guide('“Where Are We Going” song', 'Music track', [step('Activate the three vodka bottles', 'Across the prison and docks', 'Hold interact on all three bottles in any order.')])
    ];
    mob.sideQuests = [...mob.requiredGuides, ...mob.optionalSideQuests];
    mob.visuals = [];
    mob.sources = [
      source('Call of Duty: Zombies Guides — Mob of the Dead', 'https://www.codzombiesguides.com/main-quests/black-ops-2/mob-of-the-dead/', 'Plane parts, trips, skulls, spoons, codes, headphones, and final outcome'),
      source('Call of Duty Wiki — Pop Goes the Weasel', 'https://callofduty.fandom.com/wiki/Pop_Goes_the_Weasel', 'Player requirement and ending cross-check')
    ];
  }

  const buried = findMap('black-ops-2-buried');
  if (buried) {
    buried.status = 'Deep-audited guide';
    buried.auditStatus = 'deep-audited';
    buried.players = '4 players recommended';
    buried.requirements = [
      'Original difficulty',
      'Four players recommended for the full route and Sharpshooter',
      'Choose Gallows or Guillotine before attaching shared parts',
      'Paralyzer',
      'Galvaknuckles or Bowie Knife',
      'Time Bomb',
      'Richtofen: Vulture Aid',
      'Maxis: Turbine and Subsurface Resonator'
    ];
    buried.requiredGuides = [
      guide('Arthur / Leroy', 'Access, buildable assistance, and lantern kills', [
        step('Free Arthur', 'Jail cell', 'Find the jail key and unlock his cell.'),
        step('Use booze for barriers', 'Face Arthur toward a wooden barrier', 'Give him booze so he charges forward. Longer runs award more points.'),
        step('Use candy for buildables and repositioning', 'Near a buildable or object', 'Give him candy to assemble nearby buildables or perform context-specific assistance.')
      ]),
      guide('Commit to one structure', 'Prevents route lockout', [
        step('Richtofen — build the Guillotine', 'Between Saloon and Gunsmith', 'Attach satellite dish, crystal, spool of wire, and antenna.'),
        step('Maxis — build the Gallows', 'Beside Courthouse entrance', 'Attach battery, bulbs, spool of wire, and antenna.'),
        step('Do not mix the shared parts', 'Both workbenches', 'The spool and antenna are shared. Placing one on the wrong structure can lock the intended route for the match.', { images: [buriedDiagram] })
      ])
    ];
    const finalSharpshooter = step('Complete the Sharpshooter finale', 'Fountain between the church and mansion; four target zones around town', 'Interact with the fountain to “Make a Wish.” Assign one player to each range: mansion windows, Saloon, Candy Store/Courthouse street, and Mystery Box alley. Every target must be hit before it disappears. A single missed target fails the attempt.', { success: 'All targets disappear, the tower lights in the chosen color, and Mined Games completes.', warning: 'Retry immediately at the fountain after a failure. Use accurate high-capacity weapons and fixed callouts.' });
    buried.mainQuests = [
      {
        id: 'mined-games-richtofen', name: 'Mined Games — Richtofen', players: '4 players recommended', reward: 'Blue tower, permanent-perk reward, and Richtofen endgame progress', summary: 'Charge the Guillotine with a visible wisp, recover its Round Infinity switch, solve the maze, and win Sharpshooter.',
        steps: [
          step('Build the Guillotine and charge the four orbs', 'Guillotine plus four orb locations', 'Build the Guillotine with the correct parts. Use the Paralyzer on the orbs between Candy Store and Saloon, left of the church, near Lunger Undermines, and behind the mansion. Hold the beam until each orb turns white and gives a ding.', { success: 'All four orbs remain white.', images: [buriedDiagram] }),
          step('Knock down and charge the ghost lantern', 'Floating above town, then Haunted Mansion', 'Cook a grenade or use explosive damage near the floating lantern to drop it. Pick it up and kill roughly ten mansion ghosts while the lantern holder stays close to the deaths.', { success: 'The lantern is visibly charged and Richtofen advances.' }),
          step('Place the lantern and decode three mine signs', 'Gunsmith roof and catacomb sign tunnels', 'Use the Paralyzer to reach the Gunsmith roof and place the lantern on the symbol. Decode the three projected ciphers, then melee the matching three signs with Galvaknuckles or Bowie Knife.', { tip: 'Each of the five possible phrases has a unique first cipher symbol, so the first symbol is enough to identify each sign.' }),
          step('Walk the Vulture Aid wisp to the Guillotine', 'From the final sign through town', 'A player with Vulture Aid walks through the visible wisp within 15 seconds every time it stops. Continue guiding it until it reaches the Guillotine. Kill zombies near it whenever the zombies glow to feed the structure.', { success: 'The Guillotine is charged and the wisp remains at the structure.', warning: 'If nobody touches the wisp within 15 seconds, re-punch the three signs to respawn it.' }),
          step('Enter Round Infinity and recover the switch', 'Time Bomb on the Guillotine bench, then streets of town', 'Place a Time Bomb directly on the Guillotine and gather all players nearby before detonating. In the black-and-white Round Infinity, search the Victis corpses around town for the switch within 60 seconds. After returning to normal time, install the switch on the Guillotine.', { warning: 'If no switch is found, acquire another Time Bomb and repeat. Avoid downing with the switch because it can clip into the ground.' }),
          step('Solve the four maze levers', 'Hedge maze behind the mansion', 'Find the red, green, blue, and yellow levers. Test full four-lever orders. After all four are pulled, any lever that sparks was in its correct position. Record locked positions, return every player to town to reset the maze, and test the remaining permutations.', { success: 'All four positions are solved and the route advances.', warning: 'The order is randomized every match.' }),
          finalSharpshooter
        ]
      },
      {
        id: 'mined-games-maxis', name: 'Mined Games — Maxis', players: '4 players recommended', reward: 'Orange tower, permanent-perk reward, Samantha’s Lullaby, and Maxis endgame progress', summary: 'Charge the Gallows by escorting the Spire twice, solve the nine-bell switchboard, and win Sharpshooter.',
        steps: [
          step('Build the Gallows and destroy the four orbs', 'Gallows plus four orb locations', 'Build the Gallows with battery, bulbs, wire, and antenna. Power a Subsurface Resonator with a Turbine and aim its sonic blast at each orb between Candy Store and Saloon, left of the church, near Lunger Undermines, and behind the mansion until all four shatter.', { success: 'All four orbs are destroyed.', images: [buriedDiagram] }),
          step('Knock down and charge the ghost lantern', 'Town, then Arthur/trap kill route', 'Explode the floating lantern and pick it up. While the holder stays near the deaths, kill zombies using Arthur, powered traps, or a Nuke. Ordinary gun kills do not charge Maxis’s lantern.', { success: 'Maxis finishes his lantern dialogue.', warning: 'Wait for Maxis to finish speaking before picking up or placing the lantern to avoid dialogue progression bugs.' }),
          step('Place the lantern and prepare the Time Bomb', 'Gunsmith roof and final catacomb sign', 'Place the lantern on the roof symbol and decode the three mine signs. Set a Time Bomb before meleeing the final sign. Prepare zombies along the likely Spire route.'),
          step('Escort the Spire wisp to the Gallows twice', 'From the final sign to the Gallows', 'Melee the final sign to spawn the wisp. Keep it alive by letting it pass close to zombies and escort it into the Gallows. Detonate the pre-placed Time Bomb to reset time, repeat the same sign/wisp route, and deliver it a second time.', { success: 'Both Gallows bulbs are powered.', tip: 'If Consumption Cross is one of the signs, use it last for the shortest common route through Barn and Saloon.' }),
          step('Map all nine bells to the mansion switchboard', 'Candy Store upper floor, Barn upper floor, Courthouse ground floor, and mansion switchboard', 'Put one player in each three-bell building and one at the 3×3 switchboard past the hidden mansion bookshelf. Ring bells during setup so the board player learns which bulb maps to each exact bell.'),
          step('Complete the timed nine-bell sequence', 'Same four positions', 'The switchboard player activates the puzzle and calls the lit bulb. The corresponding building player rings that exact bell before the short timer expires. Repeat until all nine bulbs turn green.', { success: 'The switchboard shuts off and the Maxis branch reaches the final step.', warning: 'A wrong bell or timeout resets the full board.' }),
          finalSharpshooter
        ]
      }
    ];
    buried.optionalSideQuests = [
      guide('Pack-a-Punch through the mansion', 'Pack-a-Punch access', [step('Open the mansion', 'Mansion entrance', 'Use Arthur to break the barricade and enter with enough ammunition for the ghosts.'), step('Cross the hedge maze', 'Mansion exit', 'Survive the ghosts, reach the maze, and locate the gazebo stairs leading underground to Pack-a-Punch.')]),
      guide('Free perk from the mansion', 'Random perk bottle', [step('Clear every ghost without taking a hit', 'Haunted Mansion', 'Kill all mansion ghosts while avoiding every point-draining touch. The final ghost drops a Random Perk Bottle.')]),
      guide('Time Bomb checkpointing', 'Return to an earlier round state', [step('Place the Time Bomb', 'Safe location before a risky stage', 'The placed bomb records the current round, players, inventory, and map state.'), step('Detonate when recovery is needed', 'Anywhere', 'Return the lobby to the recorded moment. Quest items and steps can have special behavior, so use only at known route points.')])
    ];
    buried.sideQuests = [...buried.requiredGuides, ...buried.optionalSideQuests];
    buried.visuals = [];
    buried.sources = [
      source('Call of Duty: Zombies Guides — Buried', 'https://www.codzombiesguides.com/main-quests/black-ops-2/buried/', 'Both branches, random puzzles, bell mapping, and final targets'),
      source('Zombies Codex — Buried', 'https://www.zombiescodex.com/black-ops-2/buried/', 'Route and requirement cross-check'),
      source('Call of Duty Wiki — Mined Games', 'https://callofduty.fandom.com/wiki/Mined_Games', 'Achievement and branch cross-check')
    ];
  }

  const origins = findMap('black-ops-2-origins');
  if (origins) {
    origins.status = 'Deep-audited guide';
    origins.auditStatus = 'deep-audited';
    origins.requirements = [
      'All four Elemental Staffs built and upgraded',
      'All six generators active together after the staffs are built',
      'Maxis Drone built',
      'G-Strike Beacon acquired',
      'One Inch Punch acquired by every player',
      'High-damage weapons for the Panzer horde'
    ];

    const fireVisual = image('/assets/origins/fire_staff_reference.png', 'Fire Staff church reference', 'Wall values left to right: 11, 5, 9, 7, 6, 3, 4. Shoot the lit values and the bloodstain torch 4.');
    const lightningVisual = image('/assets/origins/lightning_staff_reference.png', 'Lightning piano and dial reference', 'Piano: 1-3-6, 3-5-7, 2-4-6. Use the shown seven panel positions.');
    const iceVisual = image('/assets/origins/ice_staff_reference.png', 'Ice symbol conversion chart', 'Match every ceiling dot pattern to its corresponding wall symbol.');
    const windVisual = image('/assets/origins/wind_staff_reference.png', 'Wind ring solution', 'Rotate the four Crazy Place rings to the fixed Wind solution.');

    const fireGuide = guide('Fire Staff — Kagutsuchi’s Blood', 'Required upgraded Fire Staff', [
      step('Collect the red record', 'Church / Generator 6 area', 'Check beside the tank between the stairs, on the upstairs church benches near the fountain, and on boxes at the Generator 6 entrance.'),
      step('Collect the three Fire parts', 'Generator 6, sky over Excavation, and first Panzer', 'Activate Generator 6 and take the part from its reward chest. Shoot down the glowing red plane and collect its dropped part between Excavation footprints. Kill the first Panzer Soldat and collect its part.'),
      step('Collect the red crystal', 'Fire tunnel near Generator 3', 'Place the gramophone with the red record, enter the Crazy Place, take the red crystal, and return.'),
      step('Build the staff', 'Red pedestal at the lowest Excavation level', 'Use all three parts and the crystal to assemble the Fire Staff.'),
      step('Fill the four Fire cauldrons', 'Fire section of the Crazy Place', 'Kill zombies with the Fire Staff while they stand on the grated floor beside the four cauldrons. Continue until every cauldron contains a flame and the confirmation shake/audio occurs.'),
      step('Solve the church torch puzzle', 'Upper church wall, then numbered torches downstairs', 'Read the lit upper symbols left to right using values 11, 5, 9, 7, 6, 3, 4. Downstairs, shoot the corresponding numbered torches with the Fire Staff and always include the bloodstain torch representing 4. Complete the input quickly enough for the puzzle to register.', { images: [fireVisual], success: 'A confirmation sound plays and Samantha speaks.', warning: 'The correct chart order is 11, 5, 9, 7, 6, 3, 4.' }),
      step('Align the red Excavation rings', 'Lowest Excavation chamber', 'Use the four levers until every ring shows its red gem in the alignment column. Look beneath the rings and shoot the red orb with the Fire Staff.'),
      step('Charge and collect Kagutsuchi’s Blood', 'Red Crazy Place pedestal', 'Place the staff in the pedestal and kill zombies close enough for their souls to stream into it. When the stream stops and Samantha confirms completion, take the upgraded staff.')
    ]);

    const lightningGuide = guide('Lightning Staff — Kimat’s Bite', 'Required upgraded Lightning Staff', [
      step('Collect the purple record', 'Generator 4 area', 'Check the wagon between Generator 4 and Excavation, the table near Jugger-Nog/Wunderfizz, and the machinery at the end of the Wind tunnel.'),
      step('Make the first tank jump', 'Church-to-Tank-Station trip, after Generator 4 near Generator 3', 'Jump from the right side of the moving tank to the raised wooden platform, follow the path into the footprint, and collect the first part.'),
      step('Make the second and third tank jumps', 'Tank-Station-to-Church trip', 'Jump left onto the Excavation-side walkway for the second part. Before the tank enters the church, jump right onto the raised path and enter the church opening for the third part.'),
      step('Collect the purple crystal and build', 'Lightning tunnel near Generator 5, then purple pedestal below Excavation', 'Open the portal with the gramophone and record, take the crystal, and build the staff.'),
      step('Play the three piano chords', 'Lightning section of the Crazy Place', 'Number the seven lower keys left to right. Shoot 1-3-6, pause for registration, then 3-5-7, then 2-4-6. If you fire a wrong key, finish that failed three-shot set, pause, and repeat the current chord.', { code: '136 → 357 → 246', images: [lightningVisual], success: 'The electrical effect confirms all three chords.' }),
      step('Set the seven sparking panels', 'Across Origins', 'Set Tank Station Down; Spawn Left; Generator 4 Up; upper Church Up; Church basement Right; Generator 5 Down; Excavation mound wall Up. Ignore the non-sparking workshop panel.', { images: [lightningVisual], success: 'The final sparking panel stops and the confirmation cue plays.' }),
      step('Align the purple rings and shoot the orb', 'Lowest Excavation chamber', 'Rotate every ring to purple and shoot the purple orb beneath them with the Lightning Staff.'),
      step('Charge and collect Kimat’s Bite', 'Purple Crazy Place pedestal', 'Place the staff, earn nearby soul kills, and collect it after the charge ends.')
    ]);

    const iceGuide = guide('Ice Staff — Ull’s Arrow', 'Required upgraded Ice Staff', [
      step('Collect the blue record', 'Generator 2 Tank Station building', 'Check the front table, the shelf beside the Mystery Box spawn, and the shelf near the rear tank-route door.'),
      step('Dig one part from each map zone during snow', 'Spawn trenches, No Man’s Land/Excavation, and church zone', 'During snow rounds, use a shovel on dig sites. One Ice part comes from the Generator 1–3 zone, one from the Generator 4–5/Excavation zone, and one from the church/Generator 6 zone. If snow ends, wait for the next snow round.'),
      step('Collect the blue crystal and build', 'Ice tunnel behind the church near Generator 6, then blue Excavation pedestal', 'Open the Ice portal, take the crystal, and build the staff.'),
      step('Solve the Crazy Place ceiling puzzle', 'Ice section of the Crazy Place', 'Read the blue dot pattern on the wall and shoot the matching ceiling symbol. Repeat for every pattern until the puzzle completes.', { images: [iceVisual], success: 'The ceiling stones stop and Samantha confirms the riddle.' }),
      step('Freeze and break the three gravestones', 'Odin footprint beside Excavation, Freya footprint behind Generator 6, and muddy path behind Generator 2/Tank Station', 'Shoot each gravestone with the Ice Staff until it freezes, then immediately break it with bullets from a normal firearm. Staff shots alone do not finish the stone.', { success: 'A confirmation cue plays after the third shattered stone.' }),
      step('Align the blue rings and shoot the orb', 'Lowest Excavation chamber', 'Rotate all four ring gems to blue and shoot the blue orb beneath the rings.'),
      step('Charge and collect Ull’s Arrow', 'Blue Crazy Place pedestal', 'Place the staff, kill zombies close to the pedestal until the souls stop, and take the upgraded staff.')
    ]);

    const windGuide = guide('Wind Staff — Boreas’ Fury', 'Required upgraded Wind Staff', [
      step('Collect the yellow record', 'Generator 5 / Stamin-Up area', 'Check the ledge beside Stamin-Up, the boxes near the Generator 5 entrance, and the bench inside the Lightning tunnel entrance.'),
      step('Collect one part from each Giant Robot', 'Thor, Odin, and Freya', 'Shoot the glowing underside of a robot foot, stand inside the footprint, and let the opened foot step over you. Collect the part from the robot head. Repeat once for each robot.'),
      step('Collect the yellow crystal and build', 'Wind tunnel near Generator 4, then yellow Excavation pedestal', 'Open the portal, take the crystal, and build the staff.'),
      step('Set the four Crazy Place rings', 'Wind section of the Crazy Place', 'Shoot each spinning ring until the four rows match the fixed Wind solution shown in the reference.', { images: [windVisual], success: 'The rings rise and Samantha confirms the puzzle.' }),
      step('Redirect all three smoke balls toward Excavation', 'Generator 4, Generator 5/Stamin-Up, and the church return tank path', 'Shoot each smoking stone ball with the Wind Staff until its smoke points toward the Excavation Site. The church-path ball is easiest to approach by backtracking from the church.', { success: 'A beam rises from Excavation after all three smoke streams point inward.' }),
      step('Align the yellow rings and shoot the orb', 'Lowest Excavation chamber', 'Rotate all ring gems to yellow and shoot the yellow orb below the rings.'),
      step('Charge and collect Boreas’ Fury', 'Yellow Crazy Place pedestal', 'Place the staff, fill it with nearby zombie souls, and retrieve it after the charge completes.')
    ]);

    const droneGuide = guide('Maxis Drone', 'Required buildable for three main-quest stages', [
      step('Collect Maxis’s brain', 'Lower starting room beside the Generator 1 stairs', 'Pick up the brain jar from the table.'),
      step('Find the frame', 'One of three locations', 'Check the Ice tunnel by Generator 6, the skull-and-crossbones sign on the tank path toward Generator 4, and the matching sign on the return path toward Generator 5.'),
      step('Find the rotor', 'One of three Excavation locations', 'Check near Pack-a-Punch on top of the mound, beside the gramophone/secret entrance machinery, and the scaffolding box beside a lower lever.'),
      step('Build at a workbench', 'Workshop, church basement, or Wind tunnel bench', 'Remember the chosen bench. After later quest stages, the Drone returns to this original bench for retrieval.')
    ]);

    const gstrikeGuide = guide('G-Strike Beacon', 'Required tactical grenade', [
      step('Take the muddy tablet', 'Table inside the Generator 2 Tank Station', 'Pick up one Runestone tablet.'),
      step('Clean it in the church', 'Holy-water basin upstairs in the church', 'Place the tablet and earn melee-only zombie kills nearby until the tablet changes to its clean state.'),
      step('Carry it back without touching mud', 'Church wooden boards to Tank Station', 'Pick up the clean tablet and stay on wooden planks and dry surfaces. Jump across unavoidable gaps. If the tablet becomes muddy, return it to the church and clean it again.'),
      step('Charge it at the Tank Station', 'Original tablet table', 'Replace the clean tablet on the table and earn additional melee-only kills nearby until the G-Strike appears.', { success: 'A portal effect opens and the player receives G-Strikes.' })
    ]);

    const punchGuide = guide('One Inch Punch', 'Required for every player', [
      step('Fill all four robot-footprint soul chests', 'The four chests inside Giant Robot footprints', 'Kill zombies inside the active footprint around each chest until it closes. If a robot steps on an unfinished chest, that chest loses its stored souls and must be refilled.'),
      step('Claim the reward', 'Ritual reward chest at Generator 6', 'After all four chests are complete, every player interacts with the reward chest to receive the One Inch Punch.')
    ]);

    origins.requiredGuides = [fireGuide, lightningGuide, iceGuide, windGuide, droneGuide, gstrikeGuide, punchGuide];

    const quest = origins.mainQuests.find((entry) => entry.id === 'little-lost-girl');
    if (quest) {
      quest.players = '1–4 players';
      quest.reward = 'Little Lost Girl achievement and optional ending cutscene';
      quest.summary = 'Upgrade the staffs, use the Giant Robots to open the seal, recover the Drone, empower every player’s fists, and charge the Crazy Place portal.';
      quest.steps = [
        step('Verify every required preparation item', 'Before staff placement', 'Confirm all four Ultimate Staff names, the Maxis Drone, G-Strikes, and One Inch Punch for every player. All six generators must have been active together at least once after the staffs were built.', { success: 'The new staff pedestals appear in the three robot heads and lowest Excavation chamber.' }),
        step('Ascend from Darkness — place all four staffs', 'Freya, Odin, Thor, and lowest Excavation chamber', 'Place Ull’s Arrow in Freya at the church, Boreas’ Fury in Odin over No Man’s Land, Kimat’s Bite in Thor over Generators 2 and 3, and Kagutsuchi’s Blood in the new central pedestal in the staff room. Staff order does not matter.', { success: 'Samantha speaks, the temporary pedestals disappear, and all staffs return to their original build pedestals.', warning: 'All six generators must still be active for the placement step to complete.' }),
        step('Rain Fire — strike the Generator 5 seal', 'Circular stone seal outside Generator 5 on the Stamin-Up side', 'Wait until the three Giant Robots walk in formation. One player enters the lit foot of any robot, reaches the red button, and announces the press. A second player stands ready and throws a G-Strike directly onto the centre of the circular seal immediately after the button is pressed.', { success: 'The seal breaks open and exposes a pit.', warning: 'A throw beside the circle or outside the short button window will not register.', images: [image('/assets/origins/rain-fire-seal.svg', 'Rain Fire target', 'Throw the G-Strike on the circular seal outside Generator 5 immediately after the red robot button is pressed.')] }),
        step('Unleash the Horde — send the Maxis Drone into the pit', 'Opened seal outside Generator 5', 'Stand beside the opened pit and deploy the Maxis Drone while facing into the opening. It should fly down rather than hover beside the player. Move to an open fighting area and kill every spawned Panzer Soldat until Samantha advances the quest.', { success: 'The Drone disappears into the pit and the Panzer wave ends with new dialogue.', warning: 'The exact Panzer count varies by version and player count; use the completion cue rather than counting.', images: [image('/assets/origins/maxis-drone-pit.svg', 'Maxis Drone pit placement', 'Deploy from the edge while facing into the open seal.')] }),
        step('Skewer the Winged Beast — recover the upgraded Drone', 'Sky over Origins and clockwise path around Excavation', 'While under Zombie Blood, shoot down the glowing aircraft with a bullet weapon. Obtain another Zombie Blood, then run counter-clockwise around the Excavation Site to intercept the invisible pilot running clockwise. Kill the pilot and pick up the dropped Maxis Drone upgrade.', { success: 'The upgraded Drone item is collected and later returns to the original workbench.', tip: 'For a renewable Zombie Blood, extinguish all three burning wagons with the Ice Staff; the reward appears near Pack-a-Punch once per round when the wagons are lit.' }),
        step('Wield a Fist of Iron — upgrade every player separately', 'Lowest Excavation chamber', 'Each player uses their One Inch Punch to melee the white-glowing-arm Templar zombies in the chamber. Each player needs roughly 20 valid melee kills and must personally collect the dropped Iron Fist reward.', { success: 'Every player has collected the Iron Fist.', warning: 'Staff, firearm, and equipment kills do not count for the individual player.' }),
        step('Raise Hell — charge the central portal', 'Crazy Place', 'Place all four upgraded staffs in their matching Crazy Place pedestals. Kill Templar zombies in the central area until the portal is fully charged. Keep all four staffs installed during the soul collection.', { success: 'The rocks stop falling, the dividers retract, the screen flashes, and the central blue portal opens.', warning: 'Kills too far from the central charge area may not produce a soul stream.' }),
        step('Freedom — trigger or postpone the ending', 'Central blue shrine in the Crazy Place', 'Retrieve the upgraded Maxis Drone from the exact workbench where it was built. Deploy it beneath the open portal and wait for it to fly upward. Stand on the central blue shrine and interact with the teleporter. In co-op, every player must be in the beam and ready.', { success: 'The Little Lost Girl ending cutscene starts.', warning: 'This optional interaction ends the match. Leave the shrine alone if the squad wants to continue playing.' })
      ];
    }

    origins.optionalSideQuests = [
      guide('Free Magna Collider', 'Pack-a-Punched MG08/15', [step('Deploy the Maxis Drone near four yellow discs', 'Spawn trench, Generator 5 roof, church roof, and Excavation scaffolding', 'The Drone automatically collects each disc when deployed nearby.'), step('Collect the reward', 'Pack-a-Punch area', 'After all four discs are collected, take the Magna Collider reward.')]),
      guide('Zombie Shield', 'Reusable back protection', [step('Collect the three shield parts', 'Spawn/Generator 3, Odin footprints, and Generator 2/Tank Station pools', 'Search the three spawn pools and build the shield at any workbench.')]),
      guide('Golden Shovel and Golden Helmet', 'Better dig rewards and robot-step protection', [step('Earn the Golden Shovel', 'Dig sites', 'Continue digging until the shovel icon upgrades.'), step('Dig orange mounds during Zombie Blood', 'Map-wide', 'With the Golden Shovel, dig glowing orange mounds visible in Zombie Blood until the Golden Helmet is awarded.')])
    ];
    origins.sideQuests = [...origins.requiredGuides, ...origins.optionalSideQuests];
    origins.visuals = [];
    origins.sources = [
      source('Call of Duty Wiki — Little Lost Girl', 'https://callofduty.fandom.com/wiki/Little_Lost_Girl', 'Staff placement, generator condition, and main-route cross-check'),
      source('Call of Duty Zombies — G-Strike Beacon', 'https://www.callofdutyzombies.com/zombie-library/zombies-library/black-ops_ii/origins/g-strike-beacon-r400/', 'Tablet cleaning and mud condition'),
      source('Call of Duty Wiki — Elemental Staffs', 'https://callofduty.fandom.com/wiki/Elemental_Staffs', 'Staff parts and upgrade references'),
      source('Call of Duty Wiki — Maxis Drone', 'https://callofduty.fandom.com/wiki/Maxis_Drone', 'Drone part pools and quest use'),
      source('CODZombie — Little Lost Girl', 'https://codzombie.com/quests/origins-little-lost-girl', 'Completion cues and troubleshooting cross-check')
    ];
  }
})();