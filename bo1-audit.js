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

  const ascensionLuna = image('/assets/bo1/ascension-luna.svg', 'Ascension LUNA lander route', 'Start with the lander at Spawn: call it to Stamin-Up for L, back to Spawn for U, to Speed Cola for N, then to Stamin-Up for A.');
  const cotdControls = image('/assets/bo1/cotd-controls.svg', 'Call of the Dead control and lighthouse reference', 'The fixed ship-control settings, co-op lighthouse dial code, radio order, and foghorn order are grouped here.');
  const shangriFlow = image('/assets/bo1/shangri-flow.svg', 'Shangri-La eclipse-stage route', 'A compact route through the eight eclipse stages, including the fixed mud-room wheel settings.');
  const moonFlow = image('/assets/bo1/moon-flow.svg', 'Moon quest flow and key locations', 'Receiving Bay terminals, the Lab hack, Tunnel 6, the MPD, Area 51 plates, and the final rocket sequence.');

  const kino = findMap('black-ops-kino-der-toten');
  if (kino) {
    kino.status = 'Deep-audited guide';
    kino.auditStatus = 'deep-audited';
    kino.requirements = [];
    kino.mainQuests = [];
    kino.requiredGuides = [];
    kino.optionalSideQuests = [
      guide('115 musical Easter egg', '“115” by Elena Siegman', [
        step('Activate the spawn meteor', 'Starting room, beside the right staircase', 'Hold the interact button on the small Element 115 meteor fragment sitting on the pedestal. A short sound confirms the trigger.'),
        step('Activate the dressing-room meteor', 'Dressing Room, on the shelf near the mannequins', 'Open the route through the theater and interact with the second meteor fragment in the Dressing Room.'),
        step('Activate the alley meteor', 'Room between the Alley and the theater route', 'Interact with the final meteor fragment near the window and wall weapon. The song starts immediately after the third valid interaction.', { success: 'The opening of “115” begins.' })
      ]),
      guide('Film reels and projection rooms', 'Hidden Group 935 films and audio', [
        step('Link the teleporter', 'Main stage and projector room', 'Turn on power, stand on the main-stage teleporter pad, interact to link it, then run to the starting-room pad and confirm the link.'),
        step('Teleport and search the random room', 'Random projector room after each teleport', 'Use the linked teleporter. After Pack-a-Punch time expires, the squad is sent to one of the small random rooms. Search the floor, beds, shelves, and furniture for a film reel before the room ejects you.'),
        step('Insert the reel', 'Projector beside Pack-a-Punch', 'On a later teleport, interact with the projector while carrying a reel. Each reel plays a different film in the theater. Repeat until all available reels have been shown.')
      ]),
      guide('Samantha dolls and portrait audio', 'Hidden dialogue', [
        step('Inspect character portraits', 'Room above the theater lobby', 'Interact with the Ultimis portraits and the blank silhouette to hear character-specific lines.'),
        step('Find the Samantha dolls', 'Random teleport rooms', 'Some projector rooms contain Samantha dolls or interactable objects that play additional audio. Search each room before the automatic return.')
      ])
    ];
    kino.sideQuests = kino.optionalSideQuests;
    kino.visuals = [];
    kino.sources = [
      source('Zombies Codex — Kino der Toten', 'https://www.zombiescodex.com/black-ops/kino-der-toten/', 'Map mechanics, song, and film-reel cross-check'),
      source('Call of Duty Wiki — Kino der Toten', 'https://callofduty.fandom.com/wiki/Kino_der_Toten', 'Location and version cross-check')
    ];
  }

  const five = findMap('black-ops-five');
  if (five) {
    five.status = 'Deep-audited guide';
    five.auditStatus = 'deep-audited';
    five.requirements = [];
    five.mainQuests = [];
    five.requiredGuides = [];
    five.optionalSideQuests = [
      guide('“Won’t Back Down” telephones', '“Won’t Back Down” by Eminem featuring P!nk', [
        step('Answer the conference-room phone', 'Starting conference room', 'Interact with the red telephone in the starting room. Wait for its sound before leaving.'),
        step('Answer the power-room phone', 'Laboratories near the power switch', 'Turn on power and interact with the red telephone near the lower laboratory route.'),
        step('Answer the Panic Room phone', 'Pack-a-Punch / Panic Room', 'Set the DEFCON switches so the teleporter reaches the Panic Room, then interact with the final red telephone. The song starts after the third phone.', { success: 'The song begins over the map audio.' })
      ]),
      guide('Bonfire Sale from the Pentagon Thief', 'Bonfire Sale power-up', [
        step('Prepare for a Thief round', 'After power is activated', 'Buy at least one weapon and keep a high-damage gun ready. The Pentagon Thief can appear instead of a normal round after power is on.'),
        step('Kill him before any weapon is stolen', 'Wherever the targeted player is chased', 'The targeted player keeps moving while the team focuses the Thief. He teleports between floors and runs toward his target. Do not let him reach any player.'),
        step('Collect the Bonfire Sale', 'Where the Thief dies', 'If no weapon was stolen, he drops Bonfire Sale. Pack-a-Punch costs 1,000 points and every teleporter temporarily routes to the Panic Room.', { warning: 'If he steals even one weapon, killing him returns the weapon but does not award Bonfire Sale.' })
      ]),
      guide('DEFCON and Pack-a-Punch route', 'Panic Room and Pack-a-Punch access', [
        step('Turn on power', 'Laboratory power room', 'Open the elevator route and activate power.'),
        step('Raise the DEFCON level', 'War Room and Server Room', 'Interact with the four DEFCON switches. The current level is displayed around the War Room.'),
        step('Use the correct teleporter', 'Server Room teleporter at DEFCON 5', 'At DEFCON 5, enter the teleporter that routes to the Panic Room. Pack-a-Punch is inside for a limited time before the room reopens.')
      ])
    ];
    five.sideQuests = five.optionalSideQuests;
    five.visuals = [];
    five.sources = [
      source('Zombies Codex — “Five”', 'https://www.zombiescodex.com/black-ops/five/', 'Map mechanics and side Easter eggs'),
      source('Call of Duty Wiki — “Five”', 'https://callofduty.fandom.com/wiki/%22Five%22', 'Pentagon Thief and telephone cross-check')
    ];
  }

  const ascension = findMap('black-ops-ascension');
  if (ascension) {
    ascension.status = 'Deep-audited guide';
    ascension.auditStatus = 'deep-audited';
    ascension.players = '4 players';
    ascension.requirements = [
      'Four players; the Space Monkey buttons are simultaneous',
      'Power on and all three Lunar Landers used so the rocket can launch',
      'Gersh Device',
      'Matryoshka Dolls',
      'Pack-a-Punched Thundergun (Zeus Cannon)',
      'Pack-a-Punched Ray Gun (Porter’s X2 Ray Gun)'
    ];
    ascension.requiredGuides = [guide('Required quest loadout', 'Items needed for the final node', [
      step('Acquire the Gersh Device and Matryoshka Dolls', 'Mystery Box', 'Two players should hold the two tactical items. A player cannot hold both at the same time.'),
      step('Upgrade the Thundergun and Ray Gun', 'Pack-a-Punch beneath the rocket', 'Use all three Lunar Landers, launch the rocket from the power room, enter the launch pad, and Pack-a-Punch both weapons before the final orb.')
    ])];
    ascension.mainQuests = [{
      id: 'casimir-mechanism', name: 'Casimir Mechanism', players: '4 players', reward: '90-second Death Machines for the squad', summary: 'Repair all five nodes around the Soviet Cosmodrome and free Gersh from the mechanism.',
      steps: [
        step('Node 1A — pull the generator into a Gersh Device', 'Outside the PhD Flopper room, beyond the MP5K-side barrier', 'Find the small generator with a glowing white light outside the playable area. Throw a Gersh Device close enough that the black hole pulls the generator away. A distant or badly bounced throw can fail and consume the device.', { success: 'Gersh speaks and tells the team to continue.' }),
        step('Node 1B — activate the static television', 'Under the staircase beside the Stamin-Up Lunar Lander', 'Go to the static-filled television beneath the stairs and hold interact. The screen changes to the Illuminati eye symbol.', { success: 'The first light illuminates on the metal Casimir device beside the Claymores.' }),
        step('Node 2 — press all four Space Monkey buttons', 'Beside Jugger-Nog, PhD Flopper, Speed Cola, and Stamin-Up during a Monkey round', 'During a Space Monkey round, place one player at each red button. Jugger-Nog is opposite the machine, PhD is left of the machine, Speed Cola is on the opposite side of the doorway, and Stamin-Up is left of the machine. Count down and press all four within roughly one second.', { success: 'A confirmation tone plays and the second device light turns on.', warning: 'A buzz means the timing failed. Keep the Monkey round alive and retry if the buttons remain available.' }),
        step('Node 3 — hold the Pack-a-Punch clock plate', 'Rocket launch pad, in front of the wall clock showing 12:00', 'Launch the rocket and enter the Pack-a-Punch area. All four players stand on the large pressure plate in front of the clock for two uninterrupted minutes. Keep the last zombie away from the room so the team does not have to leave the plate.', { success: 'A Nuke-like blast ends the round and the third device light turns on.' }),
        step('Node 4 — spell LUNA with Lunar Lander calls', 'Spawn, Stamin-Up, and Speed Cola lander pads', 'Start with the lander parked at Spawn. A rider stays aboard while another player calls it from Stamin-Up to collect L. Keep the rider aboard and call it back from Spawn to collect U. From Spawn, call it to Speed Cola for N. From Speed Cola, call it to Stamin-Up for A.', { success: 'The sky letters spell LUNA and the fourth device light turns on.', warning: 'Buying a lander ride is not enough; another player must call the occupied lander from the destination pad.', images: [ascensionLuna] }),
        step('Node 5 — overload the glowing orb', 'Ground beside the completed Casimir device near Stamin-Up and the Claymores', 'Throw a Gersh Device directly onto the glowing orb. While the black hole is active, fire the Zeus Cannon and Porter’s X2 Ray Gun into it and throw Matryoshka Dolls into the effect. Continue until the orb rises and Gersh speaks.', { success: 'Gersh announces that he is free; every player receives a 90-second Death Machine.', warning: 'All required damage types must reach the active black hole before the Gersh Device closes.' })
      ]
    }];
    ascension.optionalSideQuests = [
      guide('“Abracadavre” song', 'Music track', [step('Activate the three sickle teddy bears', 'Centrifuge room, Stamin-Up gate, and Speed Cola lander wall', 'Hold interact on all three teddy bears holding sickles in any order. The song begins after the third.')]),
      guide('Free perk from a perfect Monkey round', 'Random perk bottle', [
        step('Protect every purchased perk machine', 'All perk-machine areas during a Space Monkey round', 'Split the squad before the round starts and kill every monkey before any purchased perk machine is touched.'),
        step('Collect the bottle', 'Near the final killed monkey', 'A Random Perk Bottle drops when the round ends successfully.', { warning: 'If any purchased perk machine is attacked, the free bottle is lost for that round.' })
      ])
    ];
    ascension.sideQuests = [...ascension.requiredGuides, ...ascension.optionalSideQuests];
    ascension.visuals = [];
    ascension.sources = [
      source('Call of Duty Wiki — Casimir Mechanism', 'https://callofduty.fandom.com/wiki/Casimir_Mechanism', 'Node requirements, locations, and completion cues'),
      source('Call of Duty Zombies — Ascension guide', 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_zombies/453_main-easter-eggs/ascension/', 'Lander, button, clock, and final-light cross-check'),
      source('Zombies Codex — Ascension', 'https://www.zombiescodex.com/black-ops/ascension/', 'Route and version cross-check')
    ];
  }

  const cotd = findMap('black-ops-call-of-the-dead');
  if (cotd) {
    cotd.status = 'Deep-audited guide';
    cotd.auditStatus = 'deep-audited';
    cotd.requirements = ['Power on', 'V-R11 from the Mystery Box', 'Reliable explosive weapon or equipment', 'Co-op route: at least two players'];
    cotd.requiredGuides = [guide('V-R11 and explosive setup', 'Quest tools', [
      step('Obtain the V-R11', 'Mystery Box', 'The base V-R11 is sufficient for turning the lighthouse zombie human.'),
      step('Carry dependable explosive damage', 'Mystery Box or equipment', 'Frag Grenades, Semtex, Scavenger, China Lake, Crossbow, Ray Gun splash, or Matryoshka Dolls can handle different quest targets. Use Frag, Semtex, Scavenger, China Lake, or Crossbow for the four red generators because some other splash weapons can fail to register.')
    ])];
    cotd.mainQuests = [
      { id: 'stand-in-solo', name: 'Stand-in — Solo', players: '1 player', reward: 'Golden Rod, temporary Wunderwaffe DG-2, and Stand-in achievement', summary: 'Complete the shorter solo route to free the trapped Ultimis crew.', steps: [
        step('Turn on power and contact the trapped crew', 'Upper control room of the first ship, then the sealed door below PhD Flopper', 'Activate the ship power switch. Travel beneath the PhD Flopper room and knife the sealed metal door until Richtofen explains that the crew is trapped.'),
        step('Find and install the fuse', 'PhD Flopper room and fuse box right of the sealed door', 'Search the left table, the table beside PhD, and the floor by the locker for the fuse. Insert it into the fuse box and knife the door again.', { success: 'The crew asks you to disable the security system.' }),
        step('Destroy the four red generators', 'Outside the Ultimis door, outside the Stamin-Up cabin, rear ship water, and gap between the broken ship sections', 'Use Frag Grenades, Semtex, the Scavenger, China Lake, or Crossbow to destroy every red-lit generator. Check each target after the explosion; a generator that still glows did not register.', { success: 'All four generators go dark and new dialogue plays.' }),
        step('Set the ship controls', 'Power-room wheel and three-lever console', 'Pull the left lever once, leave the middle lever untouched, and pull the right lever three times. Turn the steering wheel right twice until the brown handle points to roughly five o’clock.', { success: 'The green lighthouse beam activates.', images: [cotdControls] }),
        step('Create and kill the V-R11 human', 'Bottom of the lighthouse shaft', 'Shoot a zombie once with the V-R11 inside the green beam. The human rises up the shaft. Damage him heavily with explosives or powerful weapons until his body slumps before he reaches the top.', { success: 'The Golden Rod drops at the bottom of the lighthouse.', warning: 'If he reaches the top still standing, no rod drops; bring another zombie and retry.' }),
        step('Deliver the Golden Rod and finish', 'Transfer tube left of the Ultimis door', 'Insert the Golden Rod into the tube and wait through all dialogue. When the fuse box on the right begins sparking, knife it once.', { success: 'The crew teleports away and the Wunderwaffe DG-2 power-up appears in front of the door.' })
      ]},
      { id: 'ensemble-cast-co-op', name: 'Ensemble Cast — Co-op', players: '2–4 players', reward: 'Golden Rod, temporary Wunderwaffe DG-2, and Ensemble Cast achievement', summary: 'Complete the full cooperative route, including vodka, radios, foghorns, and lighthouse dials.', steps: [
        step('Complete power, fuse, and generator steps', 'First ship and Ultimis-door area', 'Turn on power, contact the crew, install the fuse, and destroy all four red generators exactly as in the solo route.'),
        step('Catch Nikolai’s frozen vodka', 'One of four ship railings around the PhD and M16 routes', 'Find the frozen bottle. One player stands below while another knifes it from above. The lower player catches it before it hits the ground, then inserts it into the transfer tube left of the sealed door.', { warning: 'A missed bottle respawns at another railing.' }),
        step('Activate the four radios in order', 'Below power room, Stamin-Up cabin, rear shipping container, and room behind the Ultimis-door wall', 'Interact with the radios in the exact order shown. Wait for each response before activating the next.', { success: 'Morse audio plays and a glowing yellow marker appears.', images: [cotdControls] }),
        step('Set the ship controls', 'Power room', 'Pull the left lever once, leave the middle untouched, pull the right lever three times, and turn the steering wheel right twice to roughly five o’clock.', { success: 'The submarine surfaces when the fog condition is met.' }),
        step('Sound the four foghorns', 'Four horns around the lighthouse shoreline', 'During fog while the submarine is surfaced, sound the horns in order: water horn at the lighthouse base, water horn just right of the icy slide, nearest land horn outside the lighthouse doors, then the farther land horn behind the rock.', { success: 'The submarine projects a green beam into the lighthouse.', warning: 'A wrong sequence resets; wait for another fog/submarine opportunity and retry.', images: [cotdControls] }),
        step('Set the lighthouse dials to 2-7-4-6', 'Four colored floors of the lighthouse', 'The final top-to-bottom display must read Yellow 2, Orange 7, Blue 4, Purple 6. Because the dials move linked floors, set Purple to 6, turn Orange until Blue reads 4, turn Yellow until Orange reads 7, account for the extra Yellow turns on Purple, and finish by restoring Blue to 4.', { code: 'Top to bottom: 2 · 7 · 4 · 6', success: 'The lighthouse beam remains active for the V-R11 step.', images: [cotdControls] }),
        step('Create and kill the V-R11 human', 'Lighthouse shaft', 'Turn a zombie human with one V-R11 shot inside the beam, then damage the rising target until he slumps before reaching the top. Collect the Golden Rod at the bottom.'),
        step('Deliver the rod and finish', 'Ultimis door', 'Insert the Golden Rod, wait through the complete conversation, then knife the sparking fuse box once.', { success: 'Ensemble Cast unlocks and the Wunderwaffe reward appears.' })
      ]}
    ];
    cotd.optionalSideQuests = [
      guide('“Not Ready to Die” song', 'Avenged Sevenfold music track', [step('Activate the three meteorites', 'Spawn barrels, ship dining bench, and PhD room table', 'Hold interact on all three Element 115 meteorites in any order.')]),
      guide('Defeat George Romero', 'Random perk bottle and weapon power-up', [
        step('Cool and position George', 'Deep water near the shore', 'Lead an enraged George into water to calm him, then move him onto dry land when the team is ready to deal damage.'),
        step('Deal sustained damage', 'Open training area', 'Use Pack-a-Punched high-damage weapons and focus his head while controlling normal zombies.'),
        step('Collect the reward', 'Where George falls', 'He drops a Random Perk Bottle and a Death Machine, or a temporary Wunderwaffe after the main quest.', { warning: 'George returns after later rounds; killing him does not remove him permanently.' })
      ])
    ];
    cotd.sideQuests = [...cotd.requiredGuides, ...cotd.optionalSideQuests];
    cotd.visuals = [];
    cotd.sources = [
      source('Zombies Codex — Call of the Dead', 'https://www.zombiescodex.com/black-ops/call-of-the-dead/', 'Solo/co-op routes, locations, orders, and failure cues'),
      source('Call of Duty Wiki — Stand-in', 'https://callofduty.fandom.com/wiki/Stand-in', 'Solo-route cross-check'),
      source('Call of Duty Wiki — Ensemble Cast', 'https://callofduty.fandom.com/wiki/Ensemble_Cast', 'Co-op-route cross-check')
    ];
  }

  const shang = findMap('black-ops-shangri-la');
  if (shang) {
    shang.status = 'Deep-audited guide';
    shang.auditStatus = 'deep-audited';
    shang.players = '4 players in BO1';
    shang.requirements = ['Four players in the original Black Ops version', 'Power on using both underground switches', '31-79 JGb215 and Pack-a-Punched Fractalizer', 'Spikemores', 'Reliable explosive weapon', 'Controlled Napalm Zombie for the gas stage'];
    shang.requiredGuides = [guide('Pack-a-Punch access', 'Weapon upgrading', [
      step('Stand on all four pressure plates', 'Spawn temple, minecart side, power room, and mud/bridge side', 'All four players stand on the glowing plates simultaneously. The temple stairs rise for a limited time.'),
      step('Reach Pack-a-Punch', 'Top of the temple stairs', 'Run up before the stairs retract and upgrade the Baby Gun to the Fractalizer before the gong and finale stages.')
    ])];
    shang.mainQuests = [{ id: 'time-travel-will-tell', name: 'Time Travel Will Tell', players: '4 players in BO1', reward: 'Focusing Stone and achievement', summary: 'Use repeated Eclipse Mode windows to free Brock and Gary from their time loop.', steps: [
      step('Enter Eclipse Mode and wake Brock and Gary', 'Four circular buttons around Quick Revive, then the minecart/MPL room', 'All four players press the eclipse buttons together. In the past, interact with the button beside the blocked explorers to begin the first stage.'),
      step('Match all twelve floor-tile pairs', 'Minecart-side and mud/bridge-side tile fields', 'Split into two pairs. Reveal a symbol on one side, locate its matching symbol on the opposite side, and stand on both matching tiles at the same time. Repeat until all twelve pairs sink.', { success: 'A crystal appears above the minecart and the eclipse ends.', warning: 'Standing on a mismatched pair resets the tile progress.' }),
      step('Hit the hidden water-slide switch', 'Water slide', 'Send three players down first and have them stand on the metal grate at the bottom. The fourth player rides last while holding interact to hit the hidden switch on the slide wall.', { success: 'Dialogue plays and the eclipse ends.' }),
      step('Relay the crystal through the slide and geyser', 'Top of the water slide to the lower pool', 'In a new eclipse, knock the mounted crystal sphere down with an explosive, shrink it once with the base Baby Gun, and melee it into the slide. At the bottom, stand on the geyser as the crystal arrives so it launches onto its pedestal.', { success: 'A second crystal appears above the mud room.' }),
      step('Ignite the four gas leaks with a Napalm Zombie', 'MPL-side underground tunnel', 'Turn the red gas valve four times. Lead a calm Napalm Zombie past the leak beside the valve, the geyser route, the leak left of the M16, and the leak above the stairs right of the M16. Pull the lever after all four are burning.', { warning: 'If the Napalm Zombie explodes or the eclipse expires, acquire another and restart the complete gas stage.' }),
      step('Plug the four tunnel holes with Spikemores', 'Tunnel between the wooden bridge and waterfall', 'Aim a Spikemore toward each wall hole and lure a zombie through it so a spike lodges in the opening. Fill all four, including the dark unlit hole. Then interact with the protruding brick on the central boulder below the waterfall.', { success: 'The stage ends after the brick registers.' }),
      step('Melee twelve wall panels and destroy the snare', 'Across spawn, minecart, power, mud, bridge, and slide routes', 'Knife each of the twelve wall panels once; the panel appearance changes when counted. Destroy the hanging minecart snare outside the boundary with an explosive.', { tip: 'Assign one caller to track the twelve panels so none is counted twice.', images: [shangriFlow] }),
      step('Set the four mud-room wheels', 'Four corners of the mud room', 'Facing into the mud room from spawn, set near-left to four dots, near-right to one dot, far-left to three dots, and far-right to the C/open-bracket glyph with the vertical stroke and short dash.', { code: 'Near-left 4 dots · near-right 1 dot · far-left 3 dots · far-right C-like glyph', success: 'The eclipse ends when all four wheels are correct.', images: [shangriFlow] }),
      step('Find the four correct gongs and catch the dynamite', 'Eight gongs split across the minecart and mud sides', 'In a new eclipse, knife gongs one at a time. A correct gong gives a positive voice line and keeps the crystal yellow; a wrong gong turns it red. After all four correct gongs are active, fire the Fractalizer at a focusing crystal while another player waits beneath the spawn crystal to catch the falling dynamite.', { success: 'The crystals show the rotating Treyarch symbol and the dynamite is caught.', warning: 'Dropping the dynamite only requires repeating this eclipse stage.' }),
      step('Shrink the meteor and collect the Focusing Stone', 'Mud-room temple and Pack-a-Punch altar', 'In another eclipse, shoot the focusing crystal above the mud-room temple with the Fractalizer. Raise the Pack-a-Punch stairs with all four plates. The dynamite holder delivers the charge at the opened wall. After the explosion and return to the present, raise the stairs again and collect the Focusing Stone.', { success: 'Time Travel Will Tell unlocks and the stone appears above the altar.', images: [shangriFlow] })
    ]}];
    shang.optionalSideQuests = [
      guide('“Pareidolia” song', 'Music track', [step('Activate the three meteorites', 'Spawn, bridge/moving-wall route, and Semtex/mining room', 'Hold interact on all three meteorites in any order.')]),
      guide('Monkey power-up cycling', 'Changed power-up drop', [
        step('Let a monkey steal a drop', 'Any power-up near a zombie monkey', 'Allow the monkey to pick up the power-up and watch the icon cycle.'),
        step('Kill the monkey on the desired icon', 'Before it escapes', 'Shoot the monkey when the carried icon matches the reward you want.', { warning: 'If it escapes, the power-up is lost.' })
      ])
    ];
    shang.sideQuests = [...shang.requiredGuides, ...shang.optionalSideQuests];
    shang.visuals = [];
    shang.sources = [source('Zombies Codex — Shangri-La', 'https://www.zombiescodex.com/black-ops/shangri-la/', 'All eclipse stages, wheel settings, and failure cues'), source('Call of Duty Wiki — Time Travel Will Tell', 'https://callofduty.fandom.com/wiki/Time_Travel_Will_Tell', 'Original quest and reward cross-check')];
  }

  const moon = findMap('black-ops-moon');
  if (moon) {
    moon.status = 'Deep-audited guide';
    moon.auditStatus = 'deep-audited';
    moon.requirements = ['Power on', 'Hacker device', 'Wave Gun', 'Gersh Device and QED', 'Excavator Pi must fully breach Tunnel 6', 'BO1 full ending: qualified Richtofen profile with Call of the Dead and Shangri-La completed'];
    moon.requiredGuides = [
      guide('Hacker and vacuum safety', 'Quest utility', [step('Locate the Hacker', 'One of six paper-marked spawns across the three Laboratory floors', 'Pick it up before the timed terminal step. It replaces the P.E.S. helmet slot.'), step('Keep the Hacker carrier out of vacuum', 'Laboratory and pressurized routes', 'The Hacker carrier cannot breathe in decompressed areas. Trade back to a P.E.S. before crossing vacuum unless another player can handle the Hacker step.')]),
      guide('BO1 profile requirement', 'Access to Big Bang Theory', [step('Use a qualified Richtofen player', 'Lobby character assignment and HUD', 'In original Black Ops, the account that completed Call of the Dead and Shangri-La must spawn as Richtofen. The Golden Rod/Vril Device and Focusing Stone appear on that player’s HUD.'), step('Chronicles exception', 'Black Ops III version', 'Zombies Chronicles removes the prior-map profile requirement and allows the complete quest solo, but Richtofen remains the quest character.')])
    ];
    moon.mainQuests = [{ id: 'richtofen-s-grand-scheme', name: 'Richtofen’s Grand Scheme', players: 'Part I solo-capable; BO1 Part II requires co-op and qualified Richtofen', reward: 'Cryogenic Slumber Party, Big Bang Theory, and permanent perks', summary: 'Open the MPD, charge the Vril Device, swap souls, and launch the rockets at Earth.', steps: [
      step('Complete the first Samantha Says game', 'Four colored terminals outside Receiving Bay on the Tunnel 6 side', 'After power is on, start the terminal game. Repeat the growing color sequence for five rounds. The fixed left-to-right terminal order is red, green, blue, yellow.', { success: 'The terminals flash green rapidly and their screens go dark.', warning: 'A wrong input flashes red and restarts this game.', images: [moonFlow] }),
      step('Complete the timed Laboratory hack', 'All three Laboratory floors and the middle-floor Bowie Knife wall buttons', 'Pick up the Hacker. Hack one of the four dim wall buttons to start the timer. Find and hack the four terminals glowing bright green among the eight possible terminal positions, then return and press all four wall buttons in quick succession.', { success: 'The wall lights remain green.', warning: 'Red lights mean a terminal was missed or the timer expired; pay another 500 points and retry.' }),
      step('Let Excavator Pi breach Tunnel 6, then retract it', 'Excavator announcements and the Pi terminal in Receiving Bay', 'Do not stop Pi early. Wait until Tunnel 6 is fully breached, then use the Hacker on the terminal marked Pi in Receiving Bay to retract the arm.', { success: 'The dark Vril Sphere becomes available on the Tunnel 6 floor.', warning: 'Omicron breaches Tunnel 11 and Epsilon breaches Biodome; only Pi advances the quest.' }),
      step('Move the Vril Sphere to the MPD', 'Tunnel 6, exterior satellite dish, Tunnel 11/Stamin-Up ceiling, then MPD cavern', 'Knife the sphere whenever it stops and open any debris blocking its route. At the exterior dish, shoot it with the combined Wave Gun. When it lodges in the Tunnel 11/Stamin-Up ceiling, dislodge it with any weapon or grenade. Continue escorting it until it settles in the Vril Interface.', { success: 'The sphere seats in front of the MPD.', images: [moonFlow] }),
      step('Fill the first canister and open the MPD', 'MPD cavern', 'Kill 25 zombies close to the raised glass canister; red soul streams confirm valid kills. Pull the lever on the right of the pyramid.', { success: 'The MPD opens, Samantha is revealed, and Cryogenic Slumber Party unlocks.' }),
      step('Move the two Casimir plates from Area 51', 'Shelf right of the Area 51 teleporter, then Receiving Bay', 'Grenade the two hexagonal plates off the shelf. Throw a Gersh Device so the plates are pulled onto the teleporter pad and return to the Moon. In Receiving Bay, throw a QED at the grouped plates to move them onto the small machine opposite Quick Revive.', { success: 'Both plates sit on the machine.', images: [moonFlow] }),
      step('Install the cable and charge the Vril Device', 'Receiving Bay computer and plate machine', 'Find the small curved S-shaped cable in one of its Laboratory and tunnel spawn locations and install it between the computer and the plate machine. The qualified Richtofen inserts the Golden Rod/Vril Device and repeatedly uses the computer until the display turns green, then removes the charged device.', { warning: 'A red computer usually means the plates, cable, character, or BO1 profile prerequisites are wrong.' }),
      step('Fill the four MPD canisters and swap souls', 'Around the opened MPD', 'Kill 25 zombies near each of the four canisters, 100 total. Fill them one at a time until all are visibly full. Richtofen inserts the supercharged Vril Device into the front slot.', { success: 'Richtofen swaps places with Samantha and gains all eight perks permanently.' }),
      step('Return the sphere and arm all three rockets', 'Vril Interface and Receiving Bay terminals', 'Throw a QED at the Vril Interface to launch the sphere back to the terminal area. Complete the required follow-up Samantha Says sequences until all three rockets rise and Maxis finishes speaking.', { success: 'All three canyon rockets are standing upright.', warning: 'Do not throw the final Gersh Device until all three rockets are visibly raised.' }),
      step('Trigger Big Bang Theory', 'Vril Sphere beside the Receiving Bay terminals', 'Throw a Gersh Device beside the sphere. The black hole pulls it in and the three rockets launch toward Earth.', { success: 'Earth is destroyed, Big Bang Theory completes, and the team receives all perks for the rest of the match.', images: [moonFlow] })
    ]}];
    moon.optionalSideQuests = [
      guide('“Coming Home” song', 'Music track', [step('Activate the three helmeted teddy bears', 'Receiving Bay crates, Tunnel 6 airlock, and Biodome/Tunnel 11 route', 'Hold interact on all three bears in any order.')]),
      guide('Hacker utilities', 'Discounts, refunds, point transfers, and excavator control', [step('Hack map objects', 'Doors, wall weapons, perks, box, power-ups, windows, and excavator terminals', 'Hold the Hacker on a valid target. Different targets cost or reward different point amounts.'), step('Retract an excavator', 'Matching terminal in Receiving Bay', 'Hack the terminal marked for the announced excavator before or after a breach, depending on your objective.', { warning: 'The Hacker carrier has no P.E.S. and cannot survive vacuum for long.' })])
    ];
    moon.sideQuests = [...moon.requiredGuides, ...moon.optionalSideQuests];
    moon.visuals = [];
    moon.sources = [source('Zombies Codex — Moon', 'https://www.zombiescodex.com/black-ops/moon/', 'Full Part I/II sequence, counts, locations, and BO3 differences'), source('Call of Duty Wiki — Richtofen’s Grand Scheme', 'https://callofduty.fandom.com/wiki/Richtofen%27s_Grand_Scheme', 'Original BO1 prerequisites and quest cross-check')];
  }

  const rez = findMap('black-ops-rezurrection-classics');
  if (rez) {
    rez.status = 'Deep-audited version guide';
    rez.auditStatus = 'deep-audited';
    rez.requirements = [];
    rez.mainQuests = [];
    rez.requiredGuides = [];
    rez.optionalSideQuests = [
      guide('Nacht der Untoten — BO1 version notes', 'Correct remaster differences', [step('Use the World at War Nacht guide', 'Dead Drop World at War section', 'The map layout and classic side interactions remain the same. Apply the Black Ops weapon pool, Mule Kick, and revised interaction prompts.')]),
      guide('Verrückt — BO1 version notes', 'Correct remaster differences', [step('Use the World at War Verrückt guide', 'Dead Drop World at War section', 'The power, perk, trap, and song layout remain the same. Weapon availability and perk options follow Black Ops.')]),
      guide('Shi No Numa — BO1 version notes', 'Correct remaster differences', [step('Use the World at War Shi No Numa guide', 'Dead Drop World at War section', 'The random perk huts, Flogger, song, radios, and classic layout are retained with the Black Ops weapon pool.')]),
      guide('Der Riese — BO1 version notes', 'Correct remaster differences', [step('Use the World at War Der Riese guide', 'Dead Drop World at War section', 'The teleporter, Pack-a-Punch, Fly Trap, and song steps remain the same with Black Ops weapons and Mule Kick.')])
    ];
    rez.sideQuests = rez.optionalSideQuests;
    rez.visuals = [];
    rez.sources = [source('Zombies Codex — Rezurrection classics', 'https://www.zombiescodex.com/black-ops/rezurrection-classics/', 'Version and map cross-check')];
  }
})();