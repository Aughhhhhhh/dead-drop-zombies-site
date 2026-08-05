(() => {
  'use strict';
  const D = window.BO2_DEPTH;
  if (!D) return;
  const { findMap, step, guide, image, source, diagram, plutoniumMob } = D;

  const planeDiagram = image(diagram('ICARUS PLANE · FIVE PARTS', [
    ['OXYGEN TANKS · DOCKS', 'Key gate left of M1927 → shock voltmeter → second gate'],
    ['RIGGING · CITADEL', 'Read 3 Afterlife numbers on spiral stairs → enter at number pad'],
    ['ENGINE · WARDEN', 'Shock 3 Generator Room power units → open Warden Office gate'],
    ['UNIFORMS · SHOWERS', 'Key washing machine → shock voltmeter → survive wash cycle'],
    ['CONTROL VALVE · INFIRMARY', 'Key box in hallway immediately before Roof route'],
    ['BUILD', 'Roof ramp; refuel after each normal trip using cans at all five old part sites']
  ]), 'Mob of the Dead plane-part route', 'The Warden’s Key is shared by the whole team. The full quest requires three normal bridge cycles.');

  const shieldDiagram = image(diagram('MOB ZOMBIE SHIELD · THREE PARTS', [
    ['HAND TROLLEY · DOCKS', 'Outside near crates beside the Tower Trap'],
    ['CLAMP · GENERATOR ROOM', 'Middle table · corner generators · back corners by fallen lamp'],
    ['CELL DOOR · CITADEL', 'Spiral-stair panel · rigging elevator room · hall end near Generator Room'],
    ['BUILD', 'Any prison workbench; replacements are free after breakage']
  ]), 'Mob of the Dead Zombie Shield spawns', 'One Clamp and one Cell Door spawn is chosen each match; the Docks trolley is fixed.');

  const skullDiagram = image(diagram('FIVE BLUE SKULLS · THROW HELL’S RETRIEVER', [
    ['CELL BLOCK', 'Lit cell near Library; aim toward toilet/table area'],
    ['JUGGERNOG HILL', 'Lamp post up the hill; throw from corner or moving gondola'],
    ['DOCKS', 'Third leftmost post/pillar of adjacent dock'],
    ['ROOF', 'Outer ledge at far-left corner from Roof entrance'],
    ['WARDEN OFFICE', 'Utility pole outside Speed Cola window'],
    ['REWARD', 'Free Blundergat appears on Warden Office table by Speed Cola']
  ]), 'Five blue-skull locations', 'Skulls are visible in Afterlife and can be collected with the Hell’s Retriever after visiting the bridge.');

  const audioDiagram = image(diagram('POP GOES THE WEASEL · HEADPHONE PATH', [
    ['1', 'Citadel stairway leading up from the number pad'],
    ['2', 'Centre of the Double Tap room'],
    ['3', 'Cell Block walkway between Warden Office and Cafeteria'],
    ['4', 'Infirmary staircase / doorway from upper Cell Blocks'],
    ['5', 'Doorway / stairs leading onto the Roof'],
    ['FINAL', 'Enter Afterlife below Roof → board unrefuelled spectral plane']
  ]), 'Mob audio-log path', 'Each headphone appears only after the previous narration finishes. The drops do not despawn.');

  const map = findMap('black-ops-2-mob-of-the-dead');
  if (!map) return;
  map.auditStatus = 'beginner-depth';
  map.status = 'Beginner-depth audited';
  map.players = '2–4 players for the vanilla ending';
  map.soloMod = plutoniumMob;
  map.requirements = [
    'Original difficulty; Easy disables the main quest',
    'At least two players in vanilla BO2, including one Albert “Weasel” Arlington',
    'Warden’s Key lowered',
    'Icarus plane built and three normal bridge cycles completed',
    'Hell’s Retriever obtained',
    'Five blue skulls collected for the free Blundergat',
    'Silver Spoon obtained',
    'Prisoner numbers 101, 386, 872, and 481 entered in Afterlife'
  ];

  map.requiredGuides = [
    guide('Warden’s Key — both hook locations', 'Unlocks plane parts, quest gates, and utility boxes', [
      step('Find which hook holds the key', 'Above the Warden’s Office entrance or above the Showers entrance', 'Look upward for the hanging key and its electrical mechanism. The location changes each match.'),
      step('Enter the nearby Afterlife passage', 'Afterlife box and blue doorway nearest the active hook', 'Enter Afterlife, jump through the blue-only doorway, and follow the electrical route to the key generators.'),
      step('Overcharge both key generators', 'Behind the active hook’s wall', 'Shock the highlighted electrical boxes until the key lowers. If the hook is at the Warden’s Office, also shock the nearby voltmeter to open the office door.', { success: 'The key drops to player height and becomes available to the entire team.' })
    ]),

    guide('Icarus Plane — every part, lock, and refuel location', 'Required for three normal bridge cycles and the spectral final flight', [
      step('Open the Roof', 'Infirmary tiled hallway', 'Enter Afterlife at the Infirmary, pass through the blue doorway, follow the upper path, and shock the Roof-door voltmeter. Return to your body and open the Roof route.'),
      step('Collect the Oxygen Tanks', 'Bottom of Docks, locked gate left of the M1927', 'Use the Warden’s Key on the first gate. Enter Afterlife and shock the voltmeter behind it. A living player opens the second gate and takes the tanks.', { images: [planeDiagram] }),
      step('Collect the Rigging', 'Citadel spiral staircase elevator', 'Use the Warden’s Key on the number-pad/elevator area. Enter Afterlife at the top of the spiral staircase and walk downward, memorizing the three glowing digits shown on the walls in descending order. At the bottom, shock the number pad to enter those digits before its timer expires. The elevator lowers and exposes the rigging.'),
      step('Collect the Engine', 'Electrified gate inside the Warden’s Office', 'In the Generator Room, enter Afterlife and shock the generator inside the blue-door room plus the two highlighted generators in the main room. Return to life, unlock the Warden Office gate with the key, and collect the Engine.'),
      step('Collect the Uniforms', 'Showers washing machine', 'Unlock the washing machine with the Warden’s Key. Enter Afterlife and shock its voltmeter. Start the wash cycle, survive the zombie lockdown, then take the Uniforms when the machine opens.'),
      step('Collect the Control Valve', 'Infirmary hallway immediately before the Roof access', 'Unlock the green-glowing key box and take the valve.'),
      step('Build Icarus', 'Middle of the Roof ramp', 'Attach all five parts to the plane. Have every player board before the final part interaction/takeoff.'),
      step('Complete three normal bridge cycles', 'Roof → Golden Gate Bridge → electric chairs', 'Ride to the bridge, survive, then use the electric chairs to return. After each trip, collect five fuel cans from the exact former plane-part locations and refuel on the Roof. Repeat until the team has visited and returned from the bridge three times.', { success: 'After the third cycle, the Citadel number pad begins cycling rapidly.', warning: 'Do not confuse the final spectral flight with a normal refuelled trip. The final flight uses an empty plane in Afterlife.' })
    ], { intro: 'The plane has five parts, not four. Fuel cans replace the five parts after every completed flight.' }),

    guide('Hell’s Retriever — three Cerberus heads', 'Required to collect the blue skulls and Silver Spoon', [
      step('Feed the Cell Block Cerberus', 'Cell Blocks near the Library / starting-side dog emblem', 'Kill zombies close enough that their bodies are pulled into the dog’s mouth. Wait for each chew animation. Continue until the head disappears.'),
      step('Feed the Infirmary Cerberus', 'Infirmary wall near the upper prison route', 'Repeat close-range zombie kills until the second head disappears.'),
      step('Feed the Docks Cerberus', 'Docks near the B23R and lava pit', 'Repeat close-range kills until the final head disappears.'),
      step('Collect the Retriever', 'Citadel Tunnels glowing red alcove', 'Go to the central Citadel tunnel area and interact with the red Hell’s Retriever aura. Every player can collect one.', { success: 'The Retriever replaces the player’s normal tactical equipment.' })
    ]),

    guide('Free Blundergat — all five blue skulls', 'Required main-quest free-Blundergat flag and a guaranteed Blundergat', [
      step('Collect the Cell Block skull', 'Lit jail cell outside the Library', 'Throw the Hell’s Retriever into the cell toward the toilet/table skull position.', { images: [skullDiagram] }),
      step('Collect the Jugger-Nog hill skull', 'Lamp post up the hill near Jugger-Nog', 'Aim from the closest corner or throw while riding the gondola. Use Afterlife to see the blue skull if needed.'),
      step('Collect the Docks skull', 'Third leftmost pillar/post of the adjacent dock', 'Stand at the Docks edge and throw the Retriever at the fixed pillar.'),
      step('Collect the Roof skull', 'Far-left outer Roof ledge from the Roof entrance', 'Walk to the left/farthest corner and throw at the ledge.'),
      step('Collect the Warden Office skull', 'Utility pole outside the Speed Cola window', 'Stand at the window and throw at the pole. Avoid fully boarding the window beforehand so the sight line remains clear.'),
      step('Take the free Blundergat', 'Warden’s Office table beside Speed Cola', 'After all five skulls register, the Demonic Announcer laughs and the Blundergat appears on the table.', { success: 'Taking this specific free Blundergat completes the main-quest skull requirement. A Mystery Box Blundergat alone does not.' })
    ]),

    guide('Silver Spoon — both spoon interactions', 'Required main-quest spoon flag and prerequisite for Golden Spork', [
      step('Complete at least one bridge cycle', 'Golden Gate Bridge and return chairs', 'The spoon route does not fully activate until the team has gone to the bridge and returned at least once.'),
      step('Remove the cell poster', 'Jail cell one or two cells from the Warden’s Office', 'Throw a Frag Grenade or Hell’s Retriever at the movie poster. The poster falls and reveals an Afterlife symbol.'),
      step('Shock the hidden spoon', 'Blue Afterlife doorway opposite Warden’s Office', 'Enter Afterlife, pass through the newly accessible blue doorway, and shock the spoon lying on the floor beside the wall crack until it disappears and the announcer laughs.'),
      step('Retrieve the Cafeteria spoon', 'Back Cafeteria barrier, table against the left wall', 'Throw the Hell’s Retriever through the barrier at the spoon on the table. Brutus speaks when it is collected.', { success: 'The team has the Silver Spoon quest flag.' })
    ])
  ];

  map.mainQuests = [{
    id: 'pop-goes-the-weasel', name: 'Pop Goes the Weasel', players: '2–4 players; one player must be Weasel', reward: 'Pop Goes the Weasel achievement and Break/Continue the Cycle ending', summary: 'Get the required free Blundergat and spoon, complete three bridge cycles, unlock Stanley Ferguson’s five logs, then take the spectral plane to the bridge showdown.',
    steps: [
      step('Finish all required preparation', 'Across Alcatraz', 'Lower the Warden’s Key, build Icarus, obtain the Hell’s Retriever, collect all five blue skulls and take the free Blundergat, obtain the Silver Spoon, and complete three normal bridge round-trips.', { success: 'The Citadel number pad clicks rapidly instead of showing its rigging code.', images: [planeDiagram, skullDiagram] }),
      step('Enter all four prisoner numbers', 'Bottom of the Citadel spiral staircase number pad', 'Enter Afterlife and shock the pad to input 101, 386, 872, and 481. The order is flexible. You may use multiple Afterlife sessions; in co-op, a teammate can partially revive your body to pause the meter while you finish an entry.', { code: '101 · 386 · 872 · 481', success: 'Brutus shouts, the screen turns black-and-white, and Stanley Ferguson begins narrating.', warning: 'The rigging random code and the prisoner-number sequence are different tasks. The prisoner numbers activate only after the required bridge/free-Blundergat/spoon progression.' }),
      step('Listen to headphone 1', 'Citadel staircase leading upward from the number pad', 'Collect the floating headphone power-up and stay alive until its entire narration finishes. The next headphone will not spawn early.', { images: [audioDiagram] }),
      step('Listen to headphone 2', 'Centre of the Double Tap room', 'Collect it only after the first narration ends.'),
      step('Listen to headphone 3', 'Cell Block walkway between Warden’s Office and Cafeteria, near the Cerberus route', 'Collect and wait for the narration to finish.'),
      step('Listen to headphone 4', 'Infirmary staircase / doorway entered from the upper Cell Blocks', 'Collect and wait for the narration to finish.'),
      step('Listen to headphone 5', 'Doorway and stairs leading onto the Roof', 'Collect the final headphone. The plane changes into its spectral final state.'),
      step('Board the plane in Afterlife without refuelling it', 'Infirmary Afterlife station below the Roof, then the empty plane wings', 'Do not collect fuel cans or refuel. Have a player enter Afterlife below the Roof and interact beside the spectral plane. All players are drawn into Afterlife and transported on the plane.', { success: 'The spectral plane crashes into the Golden Gate Bridge.', warning: 'There may be no normal boarding prompt; interact near the plane wing/body.' }),
      step('Revive at the electric chairs', 'Golden Gate Bridge', 'Every player revives their own body in the chair. Weasel becomes hostile to the other mobsters and receives extra durability.'),
      step('Choose whether the cycle breaks', 'Golden Gate Bridge', 'For the canon broken-cycle ending, Weasel kills Billy, Sal, and Finn. To continue the cycle, the other mobsters kill Weasel. Either outcome unlocks the achievement and ends the match.', { success: 'The ending camera and music change based on which side wins.' })
    ]
  }];

  map.optionalSideQuests = [
    guide('Zombie Shield — every part spawn', 'Back protection and shield bash', [
      step('Collect the Hand Trolley', 'Docks outside near crates beside the Tower Trap', 'The trolley spawn is fixed. Carry it to any workbench.', { images: [shieldDiagram] }),
      step('Collect the Clamp', 'Generator Room', 'Check the middle table; across from the generator that does not break; beside either corner generator; the back-left corner near the fallen lamp; or the back-right generator corner.'),
      step('Collect the Cell Door', 'Citadel Tunnels', 'Check leaning against a panel on the spiral staircase; inside the rigging-elevator room; or at the end of the hall near the Generator Room.'),
      step('Build at any workbench', 'Cafeteria, Docks route, or another prison workbench', 'Attach all three parts. When it breaks, collect a free replacement from the same bench.')
    ]),

    guide('Acid Gat Kit — all nine possible part spawns', 'Converts a Blundergat into the Acidgat', [
      step('Find the Briefcase', 'Cell Blocks / Cafeteria / Warden’s Office route', 'Check near the Library in the starting Cell Blocks; outside the Cafeteria beside the Afterlife switch; or under the stairs straight ahead after exiting the Warden’s Office.'),
      step('Find the Engine', 'Warden’s Office', 'Check immediately right when entering; immediately left when entering; or beside the fireplace in the main office room.'),
      step('Find the Acid Vial', 'Infirmary', 'Check beside the bathtub; on the table beside the bathtub/Golden Spork interaction; or in the Roof-access hallway.'),
      step('Build the Acid Gat Kit', 'Any workbench, preferably the upper prison workbench near the gondola route', 'Attach all three parts, then place the Blundergat on the completed kit to receive the Acidgat.', { images: [image(diagram('ACID GAT KIT SPAWNS', [['BRIEFCASE', 'Library cells · outside Cafeteria · stairs outside Warden Office'], ['ENGINE', 'Warden Office right · left · fireplace'], ['ACID VIAL', 'Infirmary bathtub · bathtub table · Roof hallway'], ['BUILD', 'Any workbench, then insert Blundergat']]), 'Acid Gat Kit spawns', 'One location from each row is selected per match.')] })
    ]),

    guide('Golden Spork — full melee upgrade', 'One-hit melee weapon through round 33/34', [
      step('Obtain the Silver Spoon and visit the bridge', 'Required spoon route and Golden Gate Bridge', 'Complete the Silver Spoon guide above and make at least one normal bridge trip.'),
      step('Stir the blood bathtub', 'Infirmary lone bathtub opposite a Mystery Box spawn', 'Each player who wants the Spork holds interact beside the bathtub. Their Silver Spoon appears and stirs the blood.'),
      step('Earn Acidgat kills in the Showers', 'Underground Showers', 'Kill approximately 50–70 zombies using the Acidgat or Pack-a-Punched Vitriolic Withering. Stay in the Showers until the Demonic Announcer laughs.'),
      step('Claim the Golden Spork', 'Same Infirmary blood bathtub', 'Return and hold interact. A zombified hand rises holding the Golden Spork; interact again to take it.', { success: 'The player’s melee attack becomes the Golden Spork. Each player completes this separately.' })
    ]),

    guide('Hell’s Redeemer — full upgrade', 'Blue upgraded tomahawk', [
      step('Use only the Retriever for a full bridge round', 'Golden Gate Bridge on round 10 or later', 'Kill at least 30 zombies with the Hell’s Retriever during a single bridge round. Do not fire a gun during the attempt.', { success: 'The Afterlife sound plays at the end of the round.' }),
      step('Throw the Retriever into the lava pit', 'Under the ramp near the Docks B23R / Cerberus head', 'Stand below the ramp for a clear angle and throw into the lava. It should not return.', { success: 'Another Afterlife sound plays.' }),
      step('Collect the blue Redeemer', 'Citadel Tunnels original Retriever alcove on a later round', 'Return in Afterlife. The aura is blue instead of red. Interact to collect the Hell’s Redeemer.', { warning: 'Every player upgrades independently.' })
    ]),

    guide('“Where Are We Going” musical Easter egg', 'Where Are We Going by Malukah', [
      step('Enter the music code', 'Citadel spiral-stair number pad in Afterlife', 'Shock the number pad to enter 935. The song begins after the code registers.', { code: '935' })
    ]),

    guide('“Rusty Cage” musical Easter egg', 'Rusty Cage by Johnny Cash', [
      step('Activate the three hidden whiskey bottles', 'Docks, Cell Blocks, and Infirmary/office routes', 'Search for and interact with the three bottles. Use headphones/voice cues to confirm each input before moving on.')
    ]),

    guide('Brutus 115 number-pad quote', 'Hidden Brutus voice line', [step('Enter 115', 'Citadel number pad in Afterlife', 'Shock the pad to enter 115. Brutus shouts a unique response and the display changes to 666.', { code: '115' })])
  ];

  map.sideQuests = [...map.requiredGuides, ...map.optionalSideQuests];
  map.visuals = [];
  map.sources = [
    source('Call of Duty Wiki — Pop Goes the Weasel', 'https://callofduty.fandom.com/wiki/Pop_Goes_the_Weasel', 'True required progression, player count, skulls, spoon, logs, and endings'),
    source('Call of Duty Zombies — Mob of the Dead quest', 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/mob_of_the_dead_pop_goes_the_weasel/', 'Nine-section route and inline location references'),
    source('Call of Duty Zombies — Build and Ride Plane', 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/mob_of_the_dead_pop_goes_the_weasel/build-and-ride-plane-r107/', 'All five plane parts, locks, and fuel cycles'),
    source('Call of Duty Wiki — Zombie Shield', 'https://callofduty.fandom.com/wiki/Zombie_Shield', 'Exact Mob shield spawns'),
    source('Call of Duty Zombies — Acid Gat Kit', 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/mob_of_the_dead_pop_goes_the_weasel/upgrade-the-blundergat-r110/', 'All Acid Gat Kit spawn pools'),
    source('Plutonium — Mob solo release', 'https://forum.plutonium.pw/topic/16734/release-zombies-mob-of-the-dead-easter-egg-solo-improved', 'Community solo-mod download and installation')
  ];
})();