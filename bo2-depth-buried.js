(() => {
  'use strict';
  const D = window.BO2_DEPTH;
  if (!D) return;
  const { findMap, step, guide, image, source, diagram, plutoniumVictis } = D;

  const branchDiagram = image(diagram('BURIED · CHOOSE ONE MASTER', [
    ['RICHTOFEN · GUILLOTINE', 'Satellite Dish · Crystal · Wire · Antenna'],
    ['MAXIS · GALLOWS', 'Battery · Bulbs · Wire · Antenna'],
    ['SHARED PART WARNING', 'The Wire and Antenna can be attached to only one structure'],
    ['BOTH BRANCHES', '4 orbs → lantern → cipher signs → wisp → branch puzzle → Sharpshooter'],
    ['VANILLA PLAYER COUNT', 'Exactly four players for dependable completion']
  ]), 'Buried branch decision', 'Do not attach the shared Wire or Antenna until the squad has chosen Richtofen or Maxis.');

  const structureDiagram = image(diagram('GUILLOTINE AND GALLOWS PARTS', [
    ['GUILLOTINE · DISH', 'Saloon second-floor balcony, directly above the guillotine frame'],
    ['GUILLOTINE · CRYSTAL', 'Saloon ladder → first left → next left → jump hole → rubble ahead'],
    ['GALLOWS · BATTERY', 'Behind the Church altar / podium'],
    ['GALLOWS · BULBS', 'Room above Arthur’s jail, boxes by Mystery Box spawn'],
    ['SHARED · WIRE', 'Gunsmith lower-left room by the underground Bank tunnel'],
    ['SHARED · ANTENNA', 'Barn first floor, right-side stable beside catacomb entrance']
  ]), 'Buried quest-structure parts', 'The wire and antenna are shared. Once attached, the other branch cannot be built that match.');

  const orbDiagram = image(diagram('FOUR RED ORB LOCATIONS', [
    ['1 · TOWN ALLEY', 'Between the Saloon and Candy Store'],
    ['2 · CHURCH', 'Behind the large rock left of the Church entrance'],
    ['3 · CATACOMBS', 'Upper tunnel system above the town'],
    ['4 · MAZE / MANSION', 'Foliage to the right before entering the Mansion from the maze'],
    ['RICHTOFEN', 'Hold Paralyzer beam until each orb freezes / rings'],
    ['MAXIS', 'Aim a Turbine-powered Subsurface Resonator until each orb shatters']
  ]), 'Buried red-orb route', 'The same four amplifiers are used by both branches, but the required weapon is different.');

  const cipherKey = image('https://www.callofdutyzombies.com/uploads/monthly_2021_01/bur1.png.7495d63ee5199d32f5562596b233e7ba.png', 'Buried pigpen / tic-tac-toe cipher key', 'Match the white outline to a grid cell, then use the red mark to select the first, second, or third character in that group.', 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/buried_mined_games/richtofen-steps-mined-games/decipher-the-code-summon-the-wisp-r197/');
  const signReference = image(diagram('FIVE POSSIBLE TUNNEL SIGNS', [
    ['D', 'DRY GULCHER SHAFT · first repeated-letter position 11'],
    ['L', 'LUNGER UNDERMINES · first repeated-letter position 8'],
    ['C', 'CONSUMPTION CROSS · first repeated-letter position 10'],
    ['G', 'GROUND BITER PITS · first repeated-letter position 12'],
    ['B', 'BONE ORCHARD VEIN · first repeated-letter position 6']
  ], 'Each wall line is 17 characters including spaces. Decode only the first character, or use the repeated-symbol shortcut.'), 'Buried five-sign cipher reference', 'Every line resolves to one of these five signs. The three selected signs are random each match.');

  const wispDiagram = image(diagram('RICHTOFEN WISP · TOUCH EVERY STOP WITH VULTURE AID', [
    ['START', 'In front of the third correctly punched tunnel sign'],
    ['1', 'Barn second level'],
    ['2', 'Jail building second floor, beyond the wall weapon'],
    ['3', 'General Store second floor'],
    ['4', 'Candy Store'],
    ['FINISH', 'Guillotine beside the Saloon'],
    ['TIME LIMIT', 'Reach each new wisp in roughly 15 seconds or repeat the signs']
  ]), 'Richtofen wisp route', 'Only players with Vulture Aid can see the white wisp through walls.');

  const bellDiagram = image(diagram('MAXIS BELL STATIONS · EXACT POSITIONS', [
    ['COURTHOUSE 1', 'Left side of the judge’s podium'],
    ['COURTHOUSE 2', 'Right-side table closest to the podium'],
    ['COURTHOUSE 3', 'Corner immediately left after entering'],
    ['CANDY 1', 'Corner of square table along the wall'],
    ['CANDY 2', 'Table with two pots near the couch blockade'],
    ['CANDY 3', 'Chair right of the stairway door'],
    ['BARN 1', 'Hay bale before the drop toward Arthur’s jail'],
    ['BARN 2', 'Hay bale right of the wall hole facing Gunsmith'],
    ['BARN 3', 'Hay bale right of the railing gap'],
    ['BOARD COLUMNS', 'Left = Candy · Middle = Barn · Right = Courthouse']
  ]), 'Buried Maxis bell positions', 'Test and label all nine bells before pulling the switchboard lever for the real sequence.');

  const targetDiagram = image(diagram('SHARPSHOOTER · 84 TARGETS', [
    ['CANDY + COURTHOUSE', '20 targets'],
    ['MANSION LEFT WINDOWS', '23 targets'],
    ['SALOON', '19 targets'],
    ['JAIL', '22 targets'],
    ['START', 'Interact with the fountain after Arthur breaks its obstruction'],
    ['RULE', 'All four lanes run at once; one miss resets the challenge']
  ]), 'Buried Sharpshooter assignments', 'Assign one player to each lane. The Paralyzer can hit targets and helps conserve ammunition.');

  const buildableDiagram = image(diagram('GENERAL STORE BUILDABLE PARTS', [
    ['TURBINE', 'Tail: far-left shelf · Mannequin: back-room right corner · Fan: upstairs back-room desk'],
    ['RESONATOR', 'Wheel: wall right of back-room door · Mount: back hall wall · Speaker: counter before locker · Motor: top stair corner'],
    ['TRAMPLE', 'Chicken wire: upstairs banister · Motor: centre shelf · Bellows: upstairs back table · Flag: barrel below stairs'],
    ['HEAD CHOPPER', 'Base: back-room left corner · Handle: reverse of Trample motor shelf · Gears: General Store shelf/counter · Blade: barrel opposite Trample flag'],
    ['WORKBENCHES', 'Above Jail/Jug hall · Saloon · Courthouse · Church']
  ]), 'Buried buildable-part map', 'All four equipment sets are inside the General Store. The first part attached permanently assigns that workbench.');

  const map = findMap('black-ops-2-buried');
  if (!map) return;
  map.auditStatus = 'beginner-depth';
  map.status = 'Beginner-depth audited';
  map.players = 'Exactly 4 players in unmodified BO2';
  map.soloMod = plutoniumVictis;
  map.requirements = [
    'Original difficulty; Easy disables the quest',
    'Exactly four players in the original game for the final target lanes',
    'Choose Richtofen or Maxis before attaching shared structure parts',
    'Vulture Aid for players following the wisp',
    'Galvaknuckles or Bowie Knife for the three tunnel signs',
    'Time Bomb from the Mystery Box',
    'Richtofen: Paralyzer and Guillotine',
    'Maxis: Turbine, Subsurface Resonator, Gallows, and indirect-kill tools'
  ];

  map.requiredGuides = [
    guide('Arthur / The Giant — every command item', 'Opens routes, builds equipment, holds crawlers, and moves the Mystery Box', [
      step('Free Arthur from the jail', 'Jail beside the first Town Mystery Box', 'Pick up the green Jail Key beside the cell door or from its alternate wall hook after it moves. Unlock the cell and step away so Arthur can exit.'),
      step('Use Booze to break barricades', 'Free bottle in the jail or buy another from the Saloon cash register', 'Stand on the opposite side of the debris from Arthur, face the route you want opened, and give him the bottle. He charges in the direction he is facing. The longer the charge, the more points the squad receives.', { warning: 'Giving Booze while standing on the wrong side sends him into the wrong obstacle or wall.' }),
      step('Use Candy to assign a task', 'Candy Store; free bowl or replacement from the register', 'Give Candy beside an unfinished workbench and Arthur builds the matching device using the remaining General Store parts. Give it beside a crawler to make him hold it. Give it beside the Mystery Box to lock or move the box to that spawn. Give it near zombies to make him fight them.'),
      step('Use Arthur for the fountain route', 'Fountain between Church and Mansion', 'Face him toward the blocked fountain and give Booze. This opens the water/portal route used for Pack-a-Punch access and the final Make-a-Wish step.', { success: 'The fountain obstruction breaks and the water begins flowing.' })
    ]),

    guide('Choose and build the quest structure', 'Commits the match to Richtofen or Maxis', [
      step('Choose Richtofen before touching shared parts', 'Guillotine frame beside the Saloon', 'Use this branch only if the squad wants the blue/Richtofen ending. Collect the Satellite Dish from the Saloon balcony. Reach the Crystal by climbing the Saloon ladder into the mines, taking the first left, the next left, jumping the gap, and continuing to the collapsed rubble. Collect the Wire from the Gunsmith lower-left room beside the underground Bank tunnel. Collect the Antenna from the Barn first-floor right stable beside the catacomb entrance.', { images: [branchDiagram, structureDiagram] }),
      step('Choose Maxis before touching shared parts', 'Gallows frame beside the Courthouse', 'Use this branch only if the squad wants the orange/Maxis ending. Collect the Battery behind the Church altar. Collect the Bulbs from the room above Arthur’s cell, on boxes beside a Mystery Box spawn. Collect the Wire and Antenna from the same Gunsmith and Barn locations used by the Guillotine.'),
      step('Attach all four parts to one structure only', 'Selected Guillotine or Gallows worksite', 'Carry and attach each part. Once the shared Wire or Antenna is attached, the other branch cannot be completed in that match.', { success: 'The chosen energy conduit is fully assembled.', warning: 'Do not let different players unknowingly split the Wire and Antenna between structures.' })
    ], { intro: 'The structure is the branch lock. Confirm the team’s chosen master before anyone picks up the Wire or Antenna.' }),

    guide('Four red amplifiers — branch-specific method', 'Required before the lantern can be powered', [
      step('Locate all four red orbs', 'Town alley; Church rock; upper catacombs; maze-side Mansion foliage', 'Mark the route before starting so the team does not lose an orb in the changing maze.', { images: [orbDiagram] }),
      step('Richtofen: charge each orb with the Paralyzer', 'At each red orb', 'Hold the Paralyzer beam directly on the orb until it rings/freezes and Richtofen acknowledges it. Repeat at all four. The Paralyzer has infinite ammunition but must cool between long bursts.'),
      step('Maxis: destroy each orb with the Resonator', 'At each red orb', 'Place a fresh Turbine immediately behind a Subsurface Resonator and aim the Resonator at the orb. Keep both devices active until the orb shatters. Pick up or rebuild the equipment and repeat at all four.', { success: 'All four orbs are charged or destroyed and the branch voice line advances.' })
    ]),

    guide('Lantern — knock it down, charge it, and place it', 'Creates the three randomized cipher lines', [
      step('Knock the flying purple lantern down', 'Sky route from Courthouse toward Church or from Courthouse toward Jail', 'Watch for the moving lantern, then cook and throw a Frag Grenade so the explosion hits it. Pick it up immediately after it falls.', { warning: 'A lantern left on the ground too long can disappear, forcing another grenade attempt.' }),
      step('Richtofen: charge with Mansion ghosts', 'Purgatory Point Mansion while carrying the lantern', 'Enter the Mansion and kill at least ten Ghosts/Mistresses while the lantern carrier remains close. Galvaknuckles kill them in one hit on early rounds; Ray Gun weapons are safer later. The Paralyzer slows but does not kill them.'),
      step('Maxis: charge with indirect zombie kills', 'Any controllable Town lane while the lantern carrier stays close', 'Kill zombies using Arthur after Candy, a Trample Steam, a Turbine-powered Subsurface Resonator, a Head Chopper, or a Nuke. Ordinary gun and melee kills do not charge Maxis’s lantern.'),
      step('Place the full lantern on the Gunsmith roof symbol', 'Gunsmith upper balcony reached from the Saloon balcony', 'Jump from the Saloon upper balcony to the Gunsmith roof and place the lantern on the glowing wall symbol. Three lines of cipher symbols appear.', { success: 'Three 17-character cipher lines glow above the symbol.' })
    ]),

    guide('Cipher and five tunnel signs — complete solving method', 'Spawns the branch wisp', [
      step('Decode each of the three wall lines', 'Gunsmith roof lantern symbol', 'Use the pigpen/tic-tac-toe key. Match the white outline to a grid cell and the red stroke/mark to the first, second, or third character in that group. Because every possible phrase begins with a different letter, decoding the first symbol of each line is enough.', { images: [cipherKey, signReference], tip: 'Fast shortcut: compare the repeated second-symbol pattern and count the first matching position: 6 = Bone, 8 = Lunger, 10 = Consumption, 11 = Dry, 12 = Ground.' }),
      step('Open both tunnel approaches before hitting a sign', 'Upper catacombs reached from Saloon ladder and Barn stable', 'Buy the 750-point couch barriers in the tunnel network and the 1,250-point couch that connects the tunnels to the Gunsmith upper floor. For Maxis, also have Arthur break the General Store-to-Candy Store barrier before beginning the wisp.'),
      step('Locate the three named signs', 'Wooden signs throughout the upper catacomb loop', 'Enter through the Saloon ladder or Barn stable and read every wooden sign at tunnel intersections. The five names are Dry Gulcher Shaft, Lunger Undermines, Consumption Cross, Ground Biter Pits, and Bone Orchard Vein.'),
      step('Punch only the selected three signs quickly', 'The three decoded tunnel signs', 'Use Galvaknuckles or the Bowie Knife. The order does not matter, but all three must be struck within the short registration window. Do not hit either unused sign.', { success: 'A white wisp appears at the final correct sign.', warning: 'Read the next branch step before punching the third sign; both wisp routes are timed.' })
    ])
  ];

  map.mainQuests = [
    {
      id: 'mined-games-richtofen', name: 'Mined Games — Richtofen', players: 'Exactly 4 players', reward: 'All perks, blue tower alignment, and Mined Games achievement', summary: 'Build and charge the Guillotine, escort its wisp, obtain the Round Infinity switch, solve the random maze-lever order, and complete four simultaneous target lanes.',
      steps: [
        step('Complete the shared Guillotine preparation', 'Town, Mansion, Gunsmith roof, and catacombs', 'Build the Guillotine. Charge all four red orbs with the Paralyzer. Knock down and fill the lantern with Mansion Ghost kills. Place it on the Gunsmith roof, solve the three cipher lines, and quickly punch the three selected tunnel signs.', { images: [branchDiagram, orbDiagram, cipherKey, signReference] }),
        step('Touch the wisp through every fixed location', 'Final sign → Barn → Jail → General Store → Candy Store → Guillotine', 'A Vulture Aid player walks through the wisp at the final sign. Follow its wall-visible trail and touch it at the Barn second floor, Jail second floor past the wall weapon, General Store second floor, Candy Store, and finally the Guillotine. Reach each new location within roughly 15 seconds.', { images: [wispDiagram], success: 'The wisp stays at the Guillotine and begins entering nearby zombies.', warning: 'If it fades, punch the same three signs again and restart the route.' }),
        step('Kill five wisp-possessed zombies at the Guillotine', 'Directly beside the Guillotine', 'Keep living zombies nearby. The white wisp enters one zombie at a time; kill that glowing host close to the structure. Repeat until five zombie wisps orbit the crystal plus the original sign wisp.', { success: 'Richtofen announces that the Guillotine has enough energy.' }),
        step('Create Round Infinity with the Time Bomb', 'Guillotine base', 'Throw a Time Bomb directly beside the Guillotine and have all four players gather around it. Activate the bomb. The world becomes black-and-white and an Infinity symbol replaces the normal round number for about 90 seconds.', { warning: 'All four players must be close enough when the bomb activates.' }),
        step('Search the four Victis corpses for the switch', 'Random corpse points around Town, Church, Jail, Barn, Saloon, General Store, and Guillotine lanes', 'Interact with every dead crew body you find. Common areas include in front of the Guillotine; Saloon stairs; Gunsmith entrance; the crevice behind Barn/Gunsmith; Jail entrance; between General Store and the original Mystery Box; Candy/Courthouse alley; Gallows rock; behind the Church rock; and just inside the Church. One body contains the switch.', { tip: 'Split Town into four search quadrants and call each checked corpse. Round Infinity ends quickly.' }),
        step('Install the switch and solve the maze levers', 'Guillotine switch panel, then the four colored gates in the Mansion maze', 'Attach the recovered switch. Enter the maze and pull Red, Green, Blue, and Yellow levers in a guessed order. After a full four-lever attempt, correctly positioned levers spark. Record those positions. If the order is wrong, return to Town and re-enter the Mansion/maze to reset it, then test a new order around the confirmed positions.', { success: 'All four gate levers remain active and Richtofen advances.', warning: 'The lever order is random. Candy jars are not a reliable code. The Yellow lever can visually glitch; use sparks and audio cues.' }),
        step('Assign the four Sharpshooter lanes', 'Fountain, then Candy/Courthouse, Mansion, Saloon, and Jail', 'Have Arthur smash the fountain obstruction if it is still blocked. Assign one player to each lane: 20 targets beside Candy/Courthouse; 23 targets in the left Mansion windows; 19 targets inside the Saloon; and 22 targets around the Jail. Hold a crawler with Arthur using Candy before starting.', { images: [targetDiagram] }),
        step('Make a wish and hit all 84 targets', 'Fountain between Church and Mansion', 'Interact with the fountain. All four target sets rise at the same time. Each player shoots every target in their lane before it retracts. Use a stable automatic weapon or Paralyzer. Call completion; do not leave a lane to help until that player is certain every target disappeared.', { success: 'Richtofen completes the takeover, all players receive every perk for the match, the tower emits blue energy, and Mined Games unlocks.', warning: 'A single missed target resets Sharpshooter. Re-interact with the fountain after regrouping.' })
      ]
    },
    {
      id: 'mined-games-maxis', name: 'Mined Games — Maxis', players: 'Exactly 4 players', reward: 'All perks, orange tower alignment, and Mined Games achievement', summary: 'Build and charge the Gallows, escort the wisp twice using a Time Bomb, solve the nine-bell switchboard, and complete the four Sharpshooter lanes.',
      steps: [
        step('Complete the shared Gallows preparation', 'Town, four orbs, Gunsmith roof, and catacombs', 'Build the Gallows. Destroy all four red orbs with a Turbine-powered Subsurface Resonator. Knock down the lantern and charge it only with indirect kills. Place it on the Gunsmith roof, solve the cipher, and prepare the three correct tunnel signs.', { images: [branchDiagram, structureDiagram, orbDiagram, cipherKey, signReference] }),
        step('Place the Time Bomb before creating the first wisp', 'Safe Town location beside the Gallows route', 'Throw a Time Bomb and leave it armed. Open the 1,250-point tunnel-to-Gunsmith couch and have Arthur break the General Store-to-Candy Store barrier. Keep a large group of living zombies ready.', { warning: 'Without a saved Time Bomb state, the second Gallows charge cannot be created.' }),
        step('Punch the signs and feed the first wisp', 'Catacombs through Town to the Gallows', 'Punch the three decoded signs. Follow the wisp with Vulture Aid while killing zombies very close to it. Each nearby death makes the orb grow; long gaps make it shrink. Guide it through the open Town route until it enters the Gallows canister.', { success: 'One Gallows energy cell is charged and Maxis says the energy is exhausted.' }),
        step('Rewind and repeat the entire wisp charge', 'Armed Time Bomb checkpoint', 'Activate the Time Bomb to return to the saved state while preserving the first Gallows charge. Re-punch the same three signs and again kill zombies beside the wisp until it reaches the Gallows.', { success: 'Both Gallows cells are filled and Maxis requests energy be directed to the surface.' }),
        step('Test and label all nine bells', 'Courthouse ground floor, Candy second floor, Barn top level, and Mansion secret room', 'Assign one player to each three-bell building. The fourth enters the Mansion, passes through the moving-bookcase secret room, and watches the 3×3 switchboard on the sofa. Ring every bell once and record which bulb it lights. Board columns are left Candy, middle Barn, right Courthouse.', { images: [bellDiagram], tip: 'Number each building’s bells 1–3 in the order shown in the diagram. The Mansion player should use Galvaknuckles to kill Ghosts quickly.' }),
        step('Run the live bell sequence', 'Mansion switchboard and all three bell rooms', 'The Mansion player pulls the lever. One bulb turns yellow. Call its building and numbered bell; that player rings it before the timer expires. A correct bell turns the bulb green and another yellow bulb appears. Continue until all nine are green.', { success: 'Maxis directs the squad to the fountain.', warning: 'A wrong or late bell resets the board. Pull the lever again and restart.' }),
        step('Assign the four Sharpshooter lanes', 'Fountain and four target zones', 'Arthur must break the fountain. Assign Candy/Courthouse 20, Mansion left windows 23, Saloon 19, and Jail 22. Let Arthur hold a crawler after receiving Candy.', { images: [targetDiagram] }),
        step('Make a wish and clear all target lanes', 'Fountain between Mansion and Church', 'Interact with the fountain. Every player shoots their complete lane simultaneously. Paralyzer beams register against targets and can reduce reload risk.', { success: 'Maxis takes control, all players receive every perk, the tower glows orange, and Mined Games unlocks.', warning: 'Any missed target resets the challenge but not the earlier quest steps.' })
      ]
    }
  ];

  map.optionalSideQuests = [
    guide('All four General Store buildables — exact part positions', 'Turbine, Subsurface Resonator, Trample Steam, and Head Chopper', [
      step('Choose a workbench before attaching the first part', 'Above Jail/Jug hallway, Saloon, Courthouse, or Church', 'Any buildable can use any of the four benches. Once one part is attached, that bench is permanently assigned to that equipment for the match.', { images: [buildableDiagram] }),
      step('Build the Turbine', 'General Store', 'Tail Fin: far-left shelf on the main floor when entering the front door. Mannequin: back-right corner of the main-floor back room. Fan: upstairs back room, immediate right on a desk. Build all three at one bench.'),
      step('Build the Subsurface Resonator', 'General Store', 'Roulette Wheel/Table: wall right of the doorway into the back room. Mount/Base: wall opposite the table down the hall toward the back door. Speaker/Turntable: counter immediately before the Weapon Locker. Motor: corner at the top of the stairs. Build all four, then place a Turbine behind it to supply power.'),
      step('Build the Trample Steam', 'General Store', 'Chicken Wire/Screen: upstairs banister. Motor/Compressor: centre shelves on the main floor below the half-fallen shelf. Bellows: upstairs back-room table. Flag: barrel below the staircase. Build all four at one bench.'),
      step('Build the Head Chopper', 'General Store', 'Base/stand: back-room left corner opposite the Turbine mannequin. Lever/ratchet: reverse side of the same shelf holding the Trample Steam motor. Gears/wheel: General Store shelf/counter near the Head Chopper grouping. Saw Blade: wooden barrel opposite the Trample Steam flag. Build all four at one bench.', { warning: 'Head Chopper and Resonator can damage players. Do not stand in front of deployed traps.' })
    ]),

    guide('NAV Table — exact persistent-part route', 'Victis super-Easter-egg table', [
      step('Open the surface processing facility', 'Fountain at the spawn/mining area', 'Have Arthur break the Mansion fountain and then destroy the matching fountain near the spawn processing area. Jump into the resulting portal to reach the surface facility.'),
      step('Collect the Meteorite', 'NAV Table room at the surface facility', 'The meteorite is already inside the construction room.'),
      step('Collect the Board, Radio, and Electric Box', 'Area behind the Barn stables / B23R debris route', 'Open the bought route or have Arthur break the B23R-side debris. Search the small rear area for the three components, carrying them one at a time to the surface table.'),
      step('Collect the Buried Navcard', 'Mansion back-entrance room near the piano / bookshelf route', 'Search the floor near the piano and bookcase after crossing the Mansion.'),
      step('Build the table and use the correct cross-map card', 'Surface facility', 'Attach all four table parts. The Buried card is accepted on another Victis table as part of the trilogy’s meta progression.')
    ]),

    guide('Arthur shortcuts and point rewards', 'Open every town route efficiently', [
      step('Open the Candy–General Store barrier', 'Debris between the two buildings', 'Stand opposite the debris and give Arthur Booze. This route is required for the Maxis wisp path.'),
      step('Open the Church and Mansion routes', 'Town barricades facing the Church / Mansion lane', 'Use long Booze charges for larger point payouts.'),
      step('Lock the Mystery Box', 'Any active Mystery Box', 'Give Arthur Candy beside the box. He slams it and prevents the box from moving.'),
      step('Move the Mystery Box to another spawn', 'Empty Mystery Box spawn point', 'Give Arthur Candy beside the desired empty spawn. He fetches the active box and moves it there.')
    ]),

    guide('Pack-a-Punch and free Mansion perk', 'Weapon upgrades and one random perk per cleared visit', [
      step('Enter the Mansion', 'Door beyond the Church-side route', 'Buy the Mansion door and move as a group. Ghosts steal 2,000 points per hit, or damage health if the player has no points.'),
      step('Kill every Ghost in the current passage', 'Mansion rooms and moving-bookcase hallway', 'Use Galvaknuckles early or high-damage Ray Gun weapons. The final Ghost drops a random perk bottle once the house wave is cleared.'),
      step('Cross the randomized maze', 'Back of the Mansion', 'The hedge maze reshapes periodically. Use the tower or rooflines for orientation and find the Gazebo staircase.'),
      step('Use Pack-a-Punch', 'Bottom of the Gazebo stairs beyond the maze', 'Upgrade for 5,000 points. Return to Town through the Gazebo portal/fountain route rather than backtracking through every Ghost room.')
    ]),

    guide('Chalk wall weapons — all placement rewards', 'Custom wall buys and team points', [
      step('Pick up one chalk weapon outline', 'Starting processing area / Gunsmith chalk storage', 'Only one outline can be carried at a time.'),
      step('Place it on a blank question-mark wall', 'Blank chalk positions across Town', 'Hold interact to draw the weapon. The wall-buy remains for the match and awards placement points. Repeat for every outline to maximize the setup bonus.'),
      step('Use Arthur to reach inaccessible chalk', 'Starting-room and Town routes', 'Open the required debris with Booze so every chalk outline can be carried to Town.')
    ]),

    guide('Bank, Weapon Locker, and point sharing', 'Persistent resources', [
      step('Deposit and withdraw points', 'Bank counter and underground tunnel', 'Use the teller keys to store points across matches. Use the withdrawal side to recover them with the game’s fee.'),
      step('Share points', 'Bank transfer drawer', 'Deposit points into the transfer system so another player can collect them.'),
      step('Store one eligible weapon', 'Weapon Locker at the back of the General Store', 'Store one allowed weapon for a future Victis match. Wonder weapons and some special items are excluded.')
    ]),

    guide('Time Bomb — checkpoint and duplication behavior', 'Return the game to a saved round state', [
      step('Obtain the Time Bomb', 'Mystery Box', 'The Time Bomb occupies the tactical-equipment slot.'),
      step('Place the checkpoint', 'Safe location before the action to preserve', 'Throw the bomb. The current round, player states, doors, inventories, and many world objects are recorded.'),
      step('Activate the rewind', 'Anywhere while the checkpoint is active', 'Use the alternate tactical action. All players return to the saved point with the recorded state, while some collected objects/rewards can remain duplicated depending on game rules. The device is consumed.', { warning: 'Placing a new Time Bomb overwrites the previous checkpoint. Do not overwrite the Maxis wisp checkpoint.' })
    ]),

    guide('“Always Running” musical Easter egg', 'Always Running by Malukah', [
      step('Activate the mine-entrance teddy', 'Entrance to the mines near Quick Revive, beside hay', 'Hold interact on the teddy.'),
      step('Activate the Candy Store teddy', 'Inside one of the Candy Store candy barrels', 'Hold interact on the teddy.'),
      step('Activate the Mansion teddy', 'Mansion room on the right containing Double Tap II, near a corner', 'Hold interact on the final teddy.', { success: 'Always Running begins.' })
    ]),

    guide('Tipping the Ghost', 'Free perk', [
      step('Hit the Saloon dartboard bullseye', 'Saloon dartboard', 'Use the Ballistic Knife and hit the exact centre.'),
      step('Reach the second piano within 90 seconds', 'Mansion piano route', 'Travel through the Mansion quickly and interact with the required piano.'),
      step('Interact with the pink box near the Ghost', 'Mansion secret interaction area', 'Complete the final prompt to receive the perk bottle.', { warning: 'Ghost attacks can remove the points needed to reopen routes. Carry Galvaknuckles or a Ray Gun weapon.' })
    ])
  ];

  map.sideQuests = [...map.requiredGuides, ...map.optionalSideQuests];
  map.visuals = [];
  map.sources = [
    source('Call of Duty Zombies — Buried Mined Games', 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/buried_mined_games/', 'Both branch step lists and location pages'),
    source('Call of Duty Zombies — Cipher and Wisp', 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/buried_mined_games/richtofen-steps-mined-games/decipher-the-code-summon-the-wisp-r197/', 'Cipher key, five sign phrases, and sign timing'),
    source('Call of Duty Wiki — Mined Games', 'https://callofduty.fandom.com/wiki/Mined_Games', 'Orbs, lantern, wisp, Round Infinity, bells, targets, and rewards'),
    source('Call of Duty Wiki — Guillotine', 'https://callofduty.fandom.com/wiki/Guillotine', 'Exact Guillotine part locations'),
    source('Call of Duty Wiki — Gallows', 'https://callofduty.fandom.com/wiki/Gallows', 'Exact Gallows part locations'),
    source('Call of Duty Zombies — Buried Buildables', 'https://www.callofdutyzombies.com/zombie-library/zombies-library/black-ops_ii/buried/buildables-r362/', 'General Store buildables and workbenches'),
    source('Call of Duty Zombies — Maxis Bells', 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/buried_mined_games/maxis-steps-mined-games/direct-the-energy-to-the-surface-r207/', 'All nine bell positions and switchboard mapping'),
    source('Plutonium — BO2 Victis Solo Easter Eggs', 'https://forum.plutonium.pw/topic/33393/release-zm-bo2-victis-solo-easter-eggs', 'Community smaller-lobby quest adaptation')
  ];
})();