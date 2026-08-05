(() => {
  'use strict';
  const D = window.BO2_DEPTH;
  if (!D) return;
  const { findMap, step, guide, image, source, diagram, plutoniumVictis } = D;

  const sharedDiagram = image(diagram('DIE RISE · SHARED HIGH MAINTENANCE ROUTE', [
    ['1 · POWER + NAV TABLE', 'Power room switch; table under dragon-roof ramp'],
    ['2 · FOUR ELEVATOR RINGS', 'Bowie · Remington/MP5 · Quick Revive · adjacent elevator'],
    ['3 · FOUR FLOOR RINGS', 'M14 · above AK74u · Semtex roof · past SVU cafeteria'],
    ['4 · DRAGON BALLS', 'Shoot both dragon-mouth balls with a sniper'],
    ['5 · CHOOSE A BRANCH', 'Richtofen = Sliquifier/zombie sacrifice · Maxis = Buddha/Krauss/lion launch'],
    ['6 · MAHJONG ORDER', 'Match colored compass and dot tiles; punch tower with Galvaknuckles']
  ], 'Vanilla High Maintenance requires four players on Original difficulty.'), 'Die Rise shared route', 'The quest shares four opening stages, then splits into Maxis or Richtofen before the Mahjong finale.');

  const partDiagram = image(diagram('DIE RISE BUILDABLE PARTS', [
    ['TRAMPLE · CHICKEN WIRE', 'Left of first door · or through door on left wall'],
    ['TRAMPLE · MOTOR', 'Lobby desk · or corner beside collapsed staircase'],
    ['TRAMPLE · BELLOWS', 'Halfway up left stairs · or wall straight ahead/right'],
    ['TRAMPLE · FLAG', 'Broken chair at bottom right stairs · or top escalator rail'],
    ['SLIQUIFIER · FOOT', 'Fixed near staircase beside television'],
    ['SLIQUIFIER · CANISTER', 'Green cage by bench · or table near power'],
    ['SLIQUIFIER · BRAKE', 'Power-elevator tables · or refrigerator near bench'],
    ['SLIQUIFIER · WIRES/DISCS', 'Barrel near debris · or upstairs shower/laundry stand']
  ]), 'Die Rise buildable spawns', 'Build the Trample Steam two floors below spawn; build the Sliquifier in the power-building workbench room.');

  const mahjongDiagram = image(diagram('MAHJONG TILE SOLVER', [
    ['FIND FOUR COMPASS TILES', 'North · South · East · West'],
    ['FIND FOUR DOT TILES', 'One · Two · Three · Four dots'],
    ['MATCH BY COLOR', 'Example: green North + green 3 dots = punch North third'],
    ['ORIENT THE TOWER', 'North faces Trample Steam room · West faces the sun'],
    ['INPUT ONCE PER ROUND', 'Wrong punch darkens the tower until the next round']
  ]), 'Die Rise Mahjong order', 'The direction and number tiles are randomized every match; color pairs determine the punch order.');

  const map = findMap('black-ops-2-die-rise');
  if (!map) return;
  map.auditStatus = 'beginner-depth';
  map.status = 'Beginner-depth audited';
  map.players = 'Exactly 4 players in unmodified BO2';
  map.soloMod = plutoniumVictis;
  map.requirements = [
    'Original difficulty; Easy disables the quest',
    'Exactly four players in the original game',
    'Power on and NAV Table built under the dragon-roof ramp',
    'Four Trample Steams',
    'Galvaknuckles for the randomized Mahjong finale',
    'Richtofen route: Sliquifier with at least 40 direct shots reserved',
    'Maxis route: upgraded Ballistic Knife / Krauss Refibrillator and correct character handling'
  ];

  map.requiredGuides = [
    guide('NAV Table — exact Die Rise parts', 'Required to start High Maintenance reliably and for the Victis meta quest', [
      step('Collect the Meteorite', 'Dragon rooftop, corner beside the two transformers near the elevators leading down toward power / Claymores', 'Pick up the dark meteorite and carry it under the ramp leading to the radio tower.'),
      step('Collect the Wooden Board', 'Directly below the radio tower ramp', 'The board rests beside the table construction point. Attach it immediately.'),
      step('Collect the Radio', 'Opening behind the tower route that leads downstairs', 'Search behind the opening/stair access on the dragon roof and attach the radio.'),
      step('Collect the Electric Box', 'Upside-down building after crossing the dragon/tower gap', 'Go up the ramp and onto the tower, jump to the other building, move to the end of the platform, and drop one level. The electrical box is in the corner.'),
      step('Build the reader and insert the TranZit Navcard if required', 'Under the dragon-roof ramp', 'Attach all four pieces. The original cross-map progression uses the Green Run Navcard here; the persistent table must at least be built for the quest symbols to register consistently.', { images: [image(diagram('DIE RISE NAV TABLE', [['METEOR', 'Dragon roof · transformer/elevator corner'], ['BOARD', 'Under tower ramp beside build point'], ['RADIO', 'Behind opening leading downstairs'], ['ELECTRIC BOX', 'Upside-down building · drop one level after tower jump'], ['BUILD', 'Under radio-tower ramp']]), 'Die Rise NAV Table locations', 'Carry one part at a time to the table below the tower ramp.')] })
    ]),

    guide('Trample Steam — all four parts and exact workbench', 'Four devices are required by either High Maintenance branch', [
      step('Find the Chicken Wire', 'Spawn floor', 'Check directly left of the first purchasable door. If it is not there, open the door and check the left wall in the adjacent elevator lobby.', { images: [partDiagram] }),
      step('Find the Motor', 'Spawn elevator lobby', 'Check on the lobby desk or in the corner beside the collapsed stairwell.'),
      step('Find the Bellows', 'Spawn elevator lobby', 'Check halfway up the stairs on the left, or straight ahead leaning against the right-hand wall.'),
      step('Find the Flag', 'Spawn room / escalator edge', 'Check beside the broken chair at the bottom of the right-side stairs, or at the top of the escalator leaning against the rail.'),
      step('Build at the lower workbench', 'Two floors below the starting room', 'Carry each part down to the buildable table. Build four devices and assign one to every player before beginning the branch step.', { warning: 'Do not accidentally drop or destroy a quest Trample Steam after Richtofen confirms its placement. On the Richtofen route, picking one back up can permanently fail the step.' })
    ]),

    guide('Sliquifier — every part and spawn pool', 'Required for Richtofen; high-round wonder weapon', [
      step('Collect the Mannequin Foot', 'Power-building staircase beside the television', 'The foot has a fixed spawn near the top of the staircase beside the TV. Carry it to the Sliquifier workbench.', { images: [partDiagram] }),
      step('Collect the Gas Canister', 'Power-building workbench floor', 'Check inside/along the green cage beside the workbench, or on the nearby table closer to the power route.'),
      step('Collect the Hand Brake', 'Power room elevator tables or refrigerator route', 'Check the tables around the power-room elevators. If absent, check the refrigerator beside the workbench route.'),
      step('Collect the Wires and Discs', 'Power-building debris / upper shower-laundry floor', 'Check the barrel beside the purchased debris, or the wooden stand in the upstairs shower/laundry room.'),
      step('Build and reserve ammunition', 'Power-building Sliquifier workbench', 'Assemble all four pieces. For Richtofen, save at least two full magazines because each dragon ball takes about 20 direct hits.', { success: 'The Sliquifier becomes a normal weapon-slot weapon and can later appear in the Mystery Box if lost.' })
    ]),

    guide('Galvaknuckles and Mahjong orientation', 'Required for the final tower input', [
      step('Buy Galvaknuckles', 'Upside-down building elevator shaft', 'Reach the shaft in the inverted building and purchase Galvaknuckles for 6,000 points. Only one player needs them.'),
      step('Identify tower North and West', 'Radio tower on the dragon roof', 'North faces the Trample Steam starting-room building. West faces the sun. South and East are the opposite tower corners.'),
      step('Find the eight Mahjong tiles', 'Randomized locations across both buildings', 'Four tiles show directions and four show one through four dots. Common spawns include the spawn desk, bottom of M14 escalator, broken SVU stairs, circular-cushion couch, elevator shaft above AN-94, upper Buddha room, Sliquifier shelf, power-room sewing table, roof lawn chair, kitchen by MP5, and one tile on a tower corner.'),
      step('Match each direction to its punch number', 'Anywhere safe before returning to the tower', 'Pair tiles by color. A green North tile and green three-dot tile means North is the third punch. Record all four before touching the tower.', { images: [mahjongDiagram], warning: 'A wrong punch disables the tower until the next round. The order is never fixed between matches.' })
    ])
  ];

  map.mainQuests = [
    {
      id: 'high-maintenance-richtofen', name: 'High Maintenance — Richtofen', players: 'Exactly 4 players', reward: 'Blue tower alignment, six perks, and High Maintenance achievement', summary: 'Complete the shared symbol route, saturate the dragon balls with Sliquifier liquid, sacrifice zombies through four Trample Steams, then solve the randomized Mahjong order.',
      steps: [
        step('Turn on power and confirm the NAV Table', 'Power room and dragon rooftop', 'Reach the power-building switch and turn it on. Make sure the NAV Table under the dragon-roof ramp is fully assembled before the team begins the elevator rings.', { success: 'Elevators run and the table appears complete.' }),
        step('Occupy all four elevator rings at the same time', 'Four elevator roofs', 'Assign one player to the Bowie Knife elevator accessible from power; one to the Remington/MP5 elevator; one to the Quick Revive elevator; and one to the second elevator beside Quick Revive near the Trample Steam rooms. Step on all four golden rings simultaneously.', { success: 'All four rings glow and Maxis/Richtofen speak.', warning: 'Leave an elevator roof before it reaches the ceiling or the player can be crushed.', images: [sharedDiagram] }),
        step('Find the random order of the four floor rings', 'M14 room; floor above AK74u; dragon roof left of Semtex; cafeteria path beyond SVU-AS', 'Walk over one ring. If it stays lit, that is the next correct ring; if all active rings reset, restart from the first known ring and test another. Continue until all four remain lit. The order stays fixed for that match.', { success: 'All four floor rings stay gold and another voice line plays.' }),
        step('Shoot both dragon-mouth balls', 'Two stone dragons on the rooftop', 'Use any sniper rifle and shoot the small black ball inside each dragon’s open mouth. Both balls teleport beneath the lion paws in the starting room.', { success: 'Both balls are visible below the spawn lions.' }),
        step('Make both balls spin with the Sliquifier', 'Starting room lion paws', 'Fire 20 direct Sliquifier shots into the first ball and 20 into the second. Avoid wasting puddle shots on the floor; the projectile must hit the ball.', { success: 'Both balls spin continuously and Richtofen requests a blood sacrifice.', warning: 'Running out of Sliquifier ammunition before both balls spin can block the run until a Max Ammo.' }),
        step('Place four Trample Steams on zombie emblems facing the tower', 'One emblem by M14/spawn; three on the dragon-roof building near Claymores and Semtex', 'Every player places one device squarely on a golden zombie emblem, aimed so anything launched travels toward the radio tower. Listen for a Richtofen quote at each valid placement.', { success: 'Four placement quotes register.', warning: 'Do not pick up a confirmed Trample Steam; this can permanently fail the quest.' }),
        step('Fling zombies toward the radio tower', 'The four placed Trample Steams', 'Start a round and route zombies across the devices. A device activation can count whether a zombie or player triggers it, but zombie sacrifices are the reliable method. Continue until Richtofen tells Samuel to use the Galvaknuckles.', { success: 'The tower becomes active for the final input.' }),
        step('Punch the tower in the Mahjong order', 'Four vertical radio-tower corners', 'Use the color-matched Mahjong notes to punch North, South, East, and West in the correct one-through-four order. Punch each corner once.', { success: 'A blue electrical surge lights the tower, all dragon flares spark, six perks are awarded, and the achievement unlocks.', warning: 'If the tower goes dark after a wrong input, finish the round before retrying.', images: [mahjongDiagram] })
      ]
    },
    {
      id: 'high-maintenance-maxis', name: 'High Maintenance — Maxis', players: 'Exactly 4 players', reward: 'Orange tower alignment, six perks, and High Maintenance achievement', summary: 'Complete the shared symbol route, trigger Reincarnation in the Buddha room, use the Krauss Refibrillator, launch both balls through four lion Trample Steams, then solve Mahjong.',
      steps: [
        step('Complete the four shared opening steps', 'Power, elevator rings, floor rings, and rooftop dragons', 'Turn on power and build the NAV Table. Occupy all four elevator rings together. Solve the random floor-ring order. Finally, shoot the two balls from the dragon mouths with a sniper so they appear beneath the spawn lions.', { images: [sharedDiagram] }),
        step('Have Misty and Marlton pick up the two balls', 'Starting room lion paws', 'One valid character takes each ball. Avoid having Samuel Stuhlinger or Russman collect them because the original quest can glitch and refuse later placement.', { warning: 'If the wrong character picks up a ball, the safest recovery is restarting the match.' }),
        step('Earn Reincarnation kills', 'Direct centre of the tilted red Buddha room', 'Kill zombies in the exact central floor area. Continue across rounds until Maxis says, “Reincarnation will reveal its way forward.”', { success: 'The Reincarnation quote plays.', tip: 'Do not move the kill train to the outer balconies; kills outside the centre may not count.' }),
        step('Use the Krauss Refibrillator in the Buddha room', 'Buddha room centre', 'Obtain the Ballistic Knife from the Mystery Box and Pack-a-Punch it into the Krauss Refibrillator. A reliable character-specific method is Samuel firing it to revive Russman after Russman downs himself in the Buddha room while holding Who’s Who. Follow the Maxis voice cue for your game state.', { success: 'Maxis advances to the lion/Trample Steam step.', warning: 'Character and weapon-state glitches are common on the original map.' }),
        step('Place four Trample Steams on lion emblems', 'Spawn and dragon-roof lion emblems', 'Two players without balls place and aim their Trample Steams toward the tower. The two ball carriers place the remaining devices, then interact to set one ball on each ready Trample Steam. Correct placements lock the devices in place.'),
        step('Launch both balls to the radio tower', 'Four connected lion-emblem Trample Steams', 'Allow the devices to prime. The balls bounce from device to device and launch toward the tower at the same time.', { success: 'Maxis says the system is working and the tower glows orange.' }),
        step('Solve and enter the Mahjong order', 'Radio-tower vertical corners', 'Match direction and dot tiles by color, orient North toward the Trample Steam room, then punch the four corners with Galvaknuckles in one-through-four order.', { success: 'Orange electricity fills the tower, six perks are awarded, and High Maintenance unlocks.', images: [mahjongDiagram] })
      ]
    }
  ];

  map.optionalSideQuests = [
    guide('Pack-a-Punch elevator', 'Weapon upgrades', [
      step('Locate the Pack-a-Punch elevator', 'Random elevator shaft, commonly in the upside-down building cycle', 'Watch elevator signs and listen for the machine. The machine changes elevation with the moving shaft.'),
      step('Board only when the elevator is safely stopped', 'Elevator floor', 'Wait for the car to stop and the doors to open. Upgrade quickly and leave before it moves.', { warning: 'Players can be crushed by elevator ceilings or stranded when the machine moves.' })
    ]),
    guide('Free perk from Jumping Jacks', 'One random perk', [
      step('Reach a Jumping Jack round', 'Round transition after power is on', 'Prepare a weapon with a clear magazine and avoid environmental damage.'),
      step('Kill the entire wave with perfect accuracy', 'Safe open room or roof', 'Every fired bullet must hit a Jumping Jack; melee and equipment can complicate the accuracy check. Do not miss a shot during the wave.', { success: 'The final Jumping Jack drops a free perk bottle.', warning: 'One missed shot usually removes the free-perk reward for that wave.' })
    ]),
    guide('Bank and Weapon Locker', 'Persistent points and one stored weapon', [
      step('Use the shower tiles as the bank', 'Upside-down building shower / locker area', 'Interact with the deposit and withdrawal points to move persistent points between matches.'),
      step('Use the refrigerator as the Weapon Locker', 'Nearby kitchen/refrigerator area across the building route', 'Store one eligible weapon for a future Victis match. Some wonder weapons and special weapons are excluded.')
    ]),
    guide('“We All Fall Down” musical Easter egg', 'We All Fall Down by Clark S. Nova', [
      step('Activate the SVU teddy', 'Shelf near the SVU-AS wall-buy', 'Hold interact on the teddy.'),
      step('Activate the power-room teddy', 'Sewing-machine table in the power room', 'Hold interact on the teddy.'),
      step('Activate the Buddha-room teddy', 'Upper Buddha-room ledge / balcony', 'Hold interact on the final teddy to start the song.')
    ]),
    guide('NAV Table and Victis meta quest', 'Cross-map Navcard progression', [
      step('Build the Die Rise table', 'Under the dragon-roof tower ramp', 'Use the four locations listed in Required Preparation.'),
      step('Insert the Green Run Navcard', 'Completed reader', 'Use the Navcard collected on TranZit. Later carry the Die Rise card to the table that accepts it as part of the Victis super Easter egg.')
    ])
  ];

  map.sideQuests = [...map.requiredGuides, ...map.optionalSideQuests];
  map.visuals = [];
  map.sources = [
    source('Call of Duty Wiki — High Maintenance', 'https://callofduty.fandom.com/wiki/High_Maintenance', 'Shared steps, both branches, player count, tiles, and failure states'),
    source('Call of Duty Zombies — High Maintenance guides', 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/die_rise_high_maintenance/', 'Step-by-step route cross-check'),
    source('Call of Duty Wiki — Trample Steam', 'https://callofduty.fandom.com/wiki/Trample_Steam', 'Exact Trample Steam part spawns'),
    source('Call of Duty Wiki — Sliquifier', 'https://callofduty.fandom.com/wiki/Sliquifier', 'Exact Sliquifier parts and behavior'),
    source('Plutonium — BO2 Victis Solo Easter Eggs', 'https://forum.plutonium.pw/topic/33393/release-zm-bo2-victis-solo-easter-eggs', 'Community mod scope and installation')
  ];
})();