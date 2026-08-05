(() => {
  'use strict';
  const D = window.BO2_DEPTH;
  if (!D) return;
  const { findMap, step, guide, image, source, diagram, fandom } = D;

  const map = findMap('black-ops-2-origins');
  if (!map) return;

  const sharedExcavation = image(diagram('EVERY STAFF · SHARED SETUP', [
    ['GRAMOPHONE', 'Middle Excavation level, floor beside the wooden table'],
    ['BLACK RECORD 1', 'Top of mound in / beside the crystal wheelbarrow'],
    ['BLACK RECORD 2', 'Wooden walkway behind Excavation sign'],
    ['BLACK RECORD 3', 'Back Church-side path, on boxes / pillar ledge'],
    ['OPEN STAFF ROOM', 'Place Gramophone with Black Record on Excavation table'],
    ['BUILD', 'Lowest Excavation level on matching colored pedestal']
  ]), 'Shared staff setup', 'The colored record opens its Crazy Place tunnel; the black record opens the lower Excavation staff chamber.');

  const fireParts = image(diagram('FIRE STAFF · BUILD PARTS', [
    ['PART 1', 'Activate Generator 6; claim red part from its Ritual reward box'],
    ['PART 2', 'Shoot the flaming aircraft; part lands on walkway between two Excavation footprints'],
    ['PART 3', 'Kill the first Panzer Soldat on round 8'],
    ['RED RECORD', 'Church tank/stairs boxes · burning pews upstairs · boxes by Generator 6'],
    ['RED TUNNEL', 'From spawn / Generator 1 toward Generator 3'],
    ['BUILD', 'Red pedestal at bottom of Excavation']
  ]), 'Fire Staff construction route', 'The Panzer part makes Fire the only staff that cannot be fully built before the round-8 Panzer.');

  const lightningJumps = image(diagram('LIGHTNING STAFF · TANK JUMPS', [
    ['OUTBOUND · RIGHT', 'After Generator 4 approaching Generator 3, jump to the raised wooden platform'],
    ['RETURN · LEFT', 'Passing Excavation, jump left to the mound walkway'],
    ['RETURN · RIGHT', 'Immediately before Church, jump right to the raised church-wall path'],
    ['TIP', 'Use Stamin-Up and stand on the tank edge before each jump']
  ]), 'Lightning Staff tank jumps', 'One part is collected on the Church-to-Tank-Station trip and two on the return trip.');

  const iceZones = image(diagram('ICE STAFF · SNOW DIG ZONES', [
    ['BLUE PART 1', 'Spawn trenches: Generators 1, 2, and 3 zone'],
    ['BLUE PART 2', 'No Man’s Land: Generators 4, 5, and Excavation zone'],
    ['BLUE PART 3', 'Church side: Generator 6, Church, and tank-path zone'],
    ['RULE', 'Dig only while snow is actively falling; one part per zone'],
    ['BLUE RECORD', 'Generator 2 Tank Station: front entrance shelf · Mystery Box shelf · tank-route shelf']
  ]), 'Ice Staff snow zones', 'The part is random within its zone, not tied to one fixed dig pile.');

  const windRobots = image(diagram('WIND STAFF · THREE ROBOTS', [
    ['THOR', 'Generator 3 lane'],
    ['ODIN', 'Central Generator 4 / Generator 5 lane'],
    ['FREYA', 'Church / Generator 6 lane'],
    ['ENTER', 'Shoot the glowing sole, stand inside the footprint, and let the foot close around you'],
    ['COLLECT', 'Take one yellow part from the robot head before the return portal']
  ]), 'Wind Staff robot parts', 'Each robot contains one unique Wind Staff part. Only the foot with the glowing sole can be opened.');

  const fireImages = {
    plane: image(fandom('Fire Staff plane part Origins BOII.png'), 'Flaming Fire Staff aircraft', 'Shoot the orange-burning aircraft, then collect the dropped red part near the Excavation footprints.'),
    gen: image(fandom('Fire Staff Box Part Location Origins BOII.png'), 'Generator 6 Fire Staff reward', 'After completing Generator 6, collect the Fire part from the opened reward box.'),
    grate: image(fandom('Fire Staff Challenge TCP Killzone Origins BOII.png'), 'Fire Crazy Place grate kill zone', 'Kill zombies on the metal grate so their souls ignite the four cauldrons.'),
    symbols: image('/assets/origins/fire_staff_reference.png', 'Fire Staff church-symbol reference', 'Chart values left-to-right: 11, 5, 9, 7, 6, 3, 4. Shoot the lit values plus the bloodstain torch 4.'),
    torches: image(fandom('Fire Staff challenge torches Origins BOII.png'), 'Church numbered torches', 'The numbered torches are downstairs in the Church; torch 4 is marked by the bloodstain.')
  };

  const lightningImages = {
    jump1: image(fandom('Purple Staff Part Jump Location 1 Origins BOII.png'), 'Lightning tank jump 1', 'Outbound tank jump toward the wooden platform near Generator 3.'),
    jump2: image(fandom('Purple Staff Part Jump Location 2 Origins BOII.png'), 'Lightning tank jump 2', 'Return-trip jump to the Excavation mound walkway.'),
    jump3: image(fandom('Purple Staff Part Jump Location 3 Origins BOII.png'), 'Lightning tank jump 3', 'Return-trip jump into the Church wall before the tank enters the station.'),
    piano: image('/assets/origins/lightning_staff_reference.png', 'Lightning piano and dial reference', 'Piano: 1-3-6, 3-5-7, 2-4-6. Dial directions are shown on the same reference.'),
    panel: image(fandom('Staff of Lightning panel Origins BOII.png'), 'Lightning electrical panel', 'Turn each sparking panel until its dial matches the listed direction and stops sparking.')
  };

  const iceImages = {
    part: image(fandom('Staff of Ice Part Origins BOII.png'), 'Ice Staff dig part', 'Blue parts can appear only from dig spots while snow is falling.'),
    chart: image('/assets/origins/ice_staff_reference.png', 'Ice Crazy Place symbol chart', 'Match the ceiling dot pattern to the correct wall symbol.'),
    grave1: image(fandom('Ice Staff Challenge Water Tombstone 1 Origins BOII.png'), 'Ice tombstone reference 1', 'Freeze with the Ice Staff, then destroy with a bullet weapon.'),
    grave2: image(fandom('Ice Staff Challenge Water Tombstone 2 Origins BOII.png'), 'Ice tombstone reference 2', 'Freeze with the Ice Staff, then destroy with a bullet weapon.'),
    grave3: image(fandom('Ice Staff Challenge Water Tombstone 3 Origins BOII.png'), 'Ice tombstone reference 3', 'Freeze with the Ice Staff, then destroy with a bullet weapon.')
  };

  const windImages = {
    foot: image(fandom('Giant Mech Foot Opening Origins BOII.png'), 'Open Giant Robot foot', 'Shoot the glowing sole before it lands, then stand inside its footprint.'),
    part: image(fandom('Wind Staff Part Location Origins BOII.png'), 'Wind Staff robot part', 'Collect one yellow fragment inside each robot head.'),
    rings: image('/assets/origins/wind_staff_reference.png', 'Wind Crazy Place ring solution', 'Rotate the four ceiling rings into the fixed Wind solution.'),
    smoke1: image(fandom('Wind Staff Part Challenge Smoking Ball 1 Origins BOII.png'), 'Wind smoke ball reference 1', 'Use a charged Wind shot to point the smoke toward Excavation.'),
    smoke2: image(fandom('Wind Staff Part Challenge Smoking Ball 2 Origins BOII.png'), 'Wind smoke ball reference 2', 'Use a charged Wind shot to point the smoke toward Excavation.'),
    smoke3: image(fandom('Wind Staff Part Challenge Smoking Ball 3 Origins BOII.png'), 'Wind smoke ball reference 3', 'Use a charged Wind shot to point the smoke toward Excavation.')
  };

  map.requiredGuides = [
    guide('Shared Staff Setup — Gramophone, Black Record, and Staff Room', 'Access to all four Crazy Place tunnels and the Excavation staff pedestals', [
      step('Pick up the Gramophone', 'Middle floor inside the Excavation Site, on the floor beside the wooden table', 'Open the mound and descend one level. The Gramophone is beside the table used to open the lower Excavation chamber.'),
      step('Find the Black Record', 'One of three Excavation-area spawns', 'Check the wheelbarrow/crystal cart near the top of the mound; the wooden walkway behind the Excavation sign; and the Church-side rear path on a box or pillar ledge.', { images: [sharedExcavation] }),
      step('Open the staff-building chamber', 'Excavation Gramophone table', 'Place the Gramophone while carrying the Black Record. Wait for the hidden staircase and circular staff chamber to open. Pick the Gramophone back up before leaving.'),
      step('Use colored records at matching tunnels', 'Fire near Generator 1/3; Ice near Generator 6; Wind near Generator 4; Lightning near Generator 5', 'Place the Gramophone on the tunnel table while carrying that staff’s colored record. Enter the portal, collect the colored crystal, return, and retrieve the Gramophone.'),
      step('Build each staff on its colored pedestal', 'Lowest Excavation chamber', 'Once a staff’s three parts, record, crystal, and shared access are complete, hold interact on its matching pedestal. If a staff is lost or its holder bleeds out, it returns to this pedestal.')
    ]),

    guide('Fire Staff — build and upgrade to Kagutsuchi’s Blood', 'Required upgraded Fire Staff', [
      step('Collect the Generator 6 part', 'Rituals of the Ancients reward box beside Generator 6', 'Activate Generator 6. Open the nearby challenge reward box and collect the red Fire Staff part.', { images: [fireParts, fireImages.gen] }),
      step('Shoot down the flaming aircraft', 'Sky above No Man’s Land / Excavation after opening Church access', 'Watch for the orange-burning plane, shoot it with a bullet weapon, then collect the red part on the small walkway between two Giant Robot footprints near Excavation.', { images: [fireImages.plane], success: 'The aircraft explodes and the glowing part appears on the ground.' }),
      step('Kill the first Panzer Soldat', 'Round 8 after No Man’s Land is opened', 'Focus the faceplate and exposed skin. Pick up the red part dropped at the Panzer’s death location.', { warning: 'If No Man’s Land is opened late, the first Panzer timing can shift.' }),
      step('Find the Red Record', 'Church and Generator 6 area', 'Check the boxes between the stationary tank and Church staircase; the burning pew/bench pile upstairs opposite the basin; and the boxes beside Generator 6 and the challenge chest.'),
      step('Collect the Fire crystal and build', 'Fire tunnel from Generator 1 toward Generator 3, then red Excavation pedestal', 'Place the Gramophone at the Fire tunnel, enter the Crazy Place, collect the red crystal, retrieve the Gramophone, and build at the red pedestal.'),
      step('Ignite all four Crazy Place cauldrons', 'Fire section of the Crazy Place', 'Kill zombies while they are standing on the metal grate beneath the four cauldrons. Stay until every cauldron burns and Samantha confirms the step.', { images: [fireImages.grate], success: 'All four cauldrons remain lit.' }),
      step('Read the Church symbols', 'Church upper floor circular-symbol wall', 'Identify the three orange-lit symbols. Convert their left-to-right positions using 11, 5, 9, 7, 6, 3, 4. The last symbol is the bloodstain torch and is always represented by 4.', { images: [fireImages.symbols] }),
      step('Shoot the three decoded torches plus torch 4', 'Church lower floor numbered torch wall', 'Quickly shoot the three decoded numbers with the Fire Staff, then shoot torch 4 beside the bloodstain. The order among the decoded torches is not important, but complete the set without a long pause.', { images: [fireImages.torches], success: 'A confirmation tone and Samantha quote play.', warning: 'The correct chart is 11, 5, 9, 7, 6, 3, 4 — 6 and 3 must not be swapped.' }),
      step('Align the Excavation rings red', 'Lowest Excavation chamber', 'Use the four levers around the circular chamber until every ring’s gemstone is red. Look underneath and shoot the red orb with the Fire Staff.', { success: 'The orb rises through the rings.' }),
      step('Charge the staff', 'Red Fire pedestal in the Crazy Place', 'Place the staff in the pedestal and kill approximately 20 zombies close enough that their souls enter it. Pick it up after the soul stream stops.', { success: 'The weapon name changes to Kagutsuchi’s Blood and the alternate revive mode is available.' })
    ]),

    guide('Lightning Staff — build and upgrade to Kimat’s Bite', 'Required upgraded Lightning Staff', [
      step('Find the Purple Record', 'Generator 4 area', 'Check beside Wunderfizz; on the wooden cart on the mud path; and at the bottom/end of the Wind tunnel on an electrical box.'),
      step('Ride from Church toward Tank Station and take jump 1', 'Tank route after Generator 4 approaching Generator 3', 'Stand on the right edge of the tank and jump to the raised wooden platform. Follow the short path into the footprint and collect the purple part.', { images: [lightningJumps, lightningImages.jump1] }),
      step('Ride from Tank Station toward Church and take jump 2', 'Return trip beside the Excavation Site', 'Stand on the left edge and jump to the wooden walkway leading into the mound. Follow it to the purple part.', { images: [lightningImages.jump2] }),
      step('Stay on the return tank for jump 3', 'Raised path immediately before the tank enters the Church station', 'Move to the right edge, jump to the dirt/wood path, enter through the broken Church wall, and collect the third purple part.', { images: [lightningImages.jump3], tip: 'Stamin-Up makes both return-trip parts much easier to collect in one tank ride.' }),
      step('Collect the Lightning crystal and build', 'Lightning tunnel beside Generator 5, then purple Excavation pedestal', 'Place the Gramophone, enter the Crazy Place, take the purple crystal, retrieve the Gramophone, and build the staff.'),
      step('Play the three piano chords', 'Lightning section of the Crazy Place', 'Number the seven lower keys from left to right. Shoot 1-3-6, pause for registration, shoot 3-5-7, pause, then shoot 2-4-6. If a wrong note is fired, complete that three-shot attempt and repeat the current chord.', { code: '1-3-6 → 3-5-7 → 2-4-6', images: [lightningImages.piano], success: 'The electrical effects clear and Samantha confirms the puzzle.' }),
      step('Set every sparking electrical panel', 'Seven panels around Origins', 'Turn the panels until they stop sparking: Generator 5 Down; Church basement Right; Church upstairs Up; Generator 4 Up; Spawn Left; Tank Station Down; Excavation mound wall Up. Ignore the non-sparking panel at the top of the Workshop.', { code: 'Gen 5 ↓ · Church basement → · Church upstairs ↑ · Gen 4 ↑ · Spawn ← · Tank Station ↓ · Mound ↑', images: [lightningImages.panel] }),
      step('Align the Excavation rings purple', 'Lowest Excavation chamber', 'Turn all four ring gemstones purple and shoot the purple orb underneath with the Lightning Staff.'),
      step('Charge the staff', 'Purple Lightning pedestal in the Crazy Place', 'Place the staff, kill approximately 20 nearby zombies, and retrieve Kimat’s Bite after the soul stream stops.')
    ]),

    guide('Ice Staff — build and upgrade to Ull’s Arrow', 'Required upgraded Ice Staff', [
      step('Pick up a Shovel before a snow round', 'Two fixed shovels in spawn plus Church, Wind-tunnel, and Lightning-tunnel alternatives', 'Every player collecting dig rewards needs a shovel. Preserve unopened dig spots until snow begins.'),
      step('Dig the Spawn-zone part while snowing', 'Generators 1, 2, and 3 trench zone', 'During active snowfall, dig piles only in the spawn-side zone until the first blue Ice part appears.', { images: [iceZones, iceImages.part] }),
      step('Dig the No Man’s Land part while snowing', 'Generators 4, 5, and Excavation zone', 'Continue digging in the central zone until the second blue part appears.'),
      step('Dig the Church-zone part while snowing', 'Church, Generator 6, and Church tank paths', 'Dig the Church-side zone until the third blue part appears. If snow stops, wait for the next snow round; parts do not appear in rain or clear weather.'),
      step('Find the Blue Record', 'Generator 2 Tank Station', 'Check the shelf/table by the entrance facing Generator 2; the shelf beside the initial Mystery Box position; and the shelf/table by the tank-route exit.'),
      step('Collect the Ice crystal and build', 'Ice tunnel near Generator 6 / Church, then blue Excavation pedestal', 'Place the Gramophone, take the blue crystal in the Crazy Place, retrieve the Gramophone, and build the Ice Staff.'),
      step('Solve every Crazy Place ceiling pattern', 'Ice section of the Crazy Place', 'Read the dot pattern displayed on the ceiling, find the matching wall symbol using the chart, and shoot that wall panel with the Ice Staff. Continue until the puzzle finishes.', { images: [iceImages.chart], success: 'All panels are solved and Samantha confirms the chamber puzzle.' }),
      step('Freeze and shoot the Generator 4 tombstone', 'Back-right corner of the Giant footprint / mud area near Generator 4', 'Shoot the gravestone with the Ice Staff until frozen, then destroy it with an ordinary bullet weapon.', { images: [iceImages.grave1] }),
      step('Freeze and shoot the Tank Station tombstone', 'Mud path behind the Generator 2 Tank Station', 'Freeze with the Ice Staff, then break with bullets.', { images: [iceImages.grave2] }),
      step('Freeze and shoot the Excavation tombstone', 'Front/middle Excavation mound edge on the Church-facing side', 'Freeze with the Ice Staff, then break with bullets.', { images: [iceImages.grave3], success: 'Samantha confirms after all three gravestones are destroyed.' }),
      step('Align the Excavation rings blue', 'Lowest Excavation chamber', 'Turn every ring gemstone blue and shoot the blue orb underneath with the Ice Staff.'),
      step('Charge the staff', 'Blue Ice pedestal in the Crazy Place', 'Place the staff and kill approximately 20 nearby zombies. Retrieve Ull’s Arrow after the soul stream stops.')
    ]),

    guide('Wind Staff — build and upgrade to Boreas’ Fury', 'Required upgraded Wind Staff', [
      step('Find the Yellow Record', 'Generator 5 / Stamin-Up area', 'Check the broken stone wall immediately right of Stamin-Up; the boxes/burning-cart area left of the machine; and the table just inside the Lightning tunnel entrance.'),
      step('Enter Thor for the first part', 'Generator 3 Giant Robot lane', 'Watch the soles, shoot the glowing foot before it lands, stand inside that footprint, and collect the yellow part inside the robot head.', { images: [windRobots, windImages.foot, windImages.part] }),
      step('Enter Odin for the second part', 'Central Generator 4 / Generator 5 lane', 'Repeat the glowing-foot procedure and collect the second yellow part.'),
      step('Enter Freya for the third part', 'Church / Generator 6 lane', 'Repeat the procedure and collect the last yellow part.', { warning: 'A non-glowing foot cannot be opened and will down an unprotected player.' }),
      step('Collect the Wind crystal and build', 'Wind tunnel beside Generator 4, then yellow Excavation pedestal', 'Place the Gramophone, enter the Crazy Place, take the yellow crystal, retrieve the Gramophone, and build the staff.'),
      step('Set the four Crazy Place ceiling rings', 'Wind section of the Crazy Place', 'Shoot each rotating ring with the Wind Staff until the symbols match the fixed solution shown in the reference. Read the four rows from the viewing position near the Wind portal.', { images: [windImages.rings], success: 'The rings rotate automatically and Samantha confirms the chamber puzzle.' }),
      step('Redirect the Church smoke', 'Church tank path behind the Church, halfway up No Man’s Land', 'Use a charged Wind shot on the smoking stone ball until the smoke points toward the Excavation Site.', { images: [windImages.smoke1] }),
      step('Redirect the Generator 4 smoke', 'Between Generator 4 / Jugger-Nog and the Wind tunnel boundary', 'Shoot the stone ball until its smoke points at Excavation.', { images: [windImages.smoke2] }),
      step('Redirect the Generator 5 smoke', 'Near Stamin-Up on the mound-facing side of Generator 5', 'Stand near Stamin-Up, face Excavation, and shoot the smoking stone until it points toward the mound.', { images: [windImages.smoke3], success: 'A light beam forms above Excavation after all three smoke streams align.' }),
      step('Align the Excavation rings yellow', 'Lowest Excavation chamber', 'Turn all four gemstones yellow and shoot the yellow orb underneath with the Wind Staff.'),
      step('Charge the staff', 'Yellow Wind pedestal in the Crazy Place', 'Place the staff, kill approximately 20 nearby zombies, and retrieve Boreas’ Fury after the soul stream stops.')
    ])
  ];

  map.sources = [
    ...(map.sources || []),
    source('Call of Duty Zombies — Secure the Keys', 'https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_ii_zombies/451_main-easter-eggs/origins_little_lost_girl/secure-the-keys-r3/', 'Staff parts, records, crystals, and map references'),
    source('Call of Duty Wiki — Staff of Fire', 'https://callofduty.fandom.com/wiki/Elemental_Staffs/Staff_of_Fire', 'Fire parts, record, tunnel, and upgrade checks'),
    source('Call of Duty Wiki — Staff of Ice', 'https://callofduty.fandom.com/wiki/Elemental_Staffs/Staff_of_Ice', 'Snow zones, record, crystal, and upgrade checks'),
    source('Kronorium — Lightning Staff', 'https://kronorium.com/origins/lightning/', 'Lightning piano and seven panel directions'),
    source('Call of Duty Zombies — Origins staff guide', 'https://www.callofdutyzombies.com/zombie-library/zombies-library/black-ops_ii/origins/', 'Staff construction and side-guide cross-check')
  ];
})();