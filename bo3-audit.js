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
  const clone = (value) => JSON.parse(JSON.stringify(value));
  const step = (title, location, body, extras = {}) => ({ title, location, body, ...extras });
  const guide = (name, reward, steps) => ({ name, reward, steps });
  const image = (src, title, caption) => ({ src, title, caption });
  const source = (title, url, note) => ({ title, url, note });

  const shadowsFlow = image('/assets/bo3/shadows-flow.svg', 'Shadows of Evil full route', 'The four rituals and swords lead into four rounds of flag defense, the Shadowman capture, and the four-player tram finale.');
  const deFlow = image('/assets/bo3/de-flow.svg', 'Der Eisendrache quest flow', 'Bow, Ragnarok, wisp, safe, Simon Says, Keeper ritual, boss, and Summoning Key route.');
  const znsCogs = image('/assets/bo3/zns-cogs.svg', 'Zetsubou No Shima cog route', 'The three elevator cogs come from Anywhere But Here, the electrified zipline, and the AA-gun plane shot.');
  const gkTrials = image('/assets/bo3/gk-trials.svg', 'Gorod Krovi S.O.P.H.I.A. trials', 'The six trials can appear in random order; record the bomb sequence before touching the first bomb.');
  const revFlow = image('/assets/bo3/revelations-flow.svg', 'Revelations main-quest flow', 'Graves, Keeper ritual, Arnies, bones, Sophia, eggs, rune arena, Summoning Key targets, and Shadowman finale.');

  const shadows = findMap('black-ops-3-shadows-of-evil');
  if (shadows) {
    shadows.status = 'Deep-audited guide';
    shadows.auditStatus = 'deep-audited';
    shadows.players = '4 players for the full ending';
    shadows.requirements = [
      'Four players for Apocalypse Averted',
      'All four character rituals and Pack-a-Punch',
      'Apothicon Sword built and upgraded for every player',
      'Rocket Shield recommended',
      'Strong Margwa-killing weapons and full ammunition'
    ];
    shadows.requiredGuides = [
      guide('Four rituals and Pack-a-Punch', 'Gateworms and Sacred Place access', [
        step('Take the Summoning Key', 'Junction truck', 'Enter Beast Mode at spawn, melee the crate in the truck bed, return to human form, and pick up the Summoning Key.'),
        step('Open the Magician ritual', 'Nero’s Landing', 'In Beast Mode, grapple to the upper route and shock the crane box to drop the Golden Fountain Pen. Place the Pen and Summoning Key on the ritual table and survive until the Gateworm appears.'),
        step('Open the Detective ritual', 'Canals / Ruby Rabbit', 'In Beast Mode, grapple to the roof and shock the electrical box to lower the stairs. Collect the Detective Badge, place it at the Ruby Rabbit altar, and survive the ritual.'),
        step('Open the Boxer ritual', 'Waterfront / Boxing Gym', 'In Beast Mode, grapple to the Mystery Box ledge and melee the hanging crate to drop the Championship Belt. Place it at the gym altar and survive.'),
        step('Open the Femme Fatale ritual', 'Footlight / Black Lace', 'In Beast Mode, reach the casino roof and shock the box that releases the Hair Piece. Place it at the theater altar and survive.'),
        step('Open Pack-a-Punch', 'Rift and Sacred Place', 'Take all four Gateworms through the Rift. Place one in each cauldron, including the two reached by the wall-run. Put the Summoning Key on the central altar and survive the final ritual.', { success: 'Pack-a-Punch rises in the Sacred Place.' })
      ]),
      guide('Apothicon Sword and Reborn Sword', 'Required upgraded sword for every player', [
        step('Read the three tram symbols', 'Tram routes between Footlight, Waterfront, and Canals', 'Ride the tram and record the glowing symbol visible from each district side. The three required symbols are random each match.'),
        step('Enter the symbols and take the Egg', 'Subway wall opposite the ritual chamber', 'Enter Beast Mode and shock the three recorded symbols among the nine panels. Return to human form and take the revealed Apothicon Egg.'),
        step('Fill the Egg at four statues', 'Cthulhu statues in Canals, Waterfront, Footlight, and Sacred Place', 'Place the Egg at a statue and kill roughly ten zombies beside it until it turns blue and shell-less. Repeat at all four statues.'),
        step('Claim the Apothicon Sword', 'Subway pedestal', 'Return the fully charged Egg and take the sword assigned to the current character.'),
        step('Complete four Arch-Ovum rituals', 'Four red ritual circles', 'Take the Arch-Ovum from the character’s Keeper altar. Place it at one ritual circle, kill the spawned Margwas, and return it. Each player can complete only one circle per round and must use all four different circles.'),
        step('Claim the Reborn Sword', 'Character ritual altar', 'After all four circles are complete, hand the sword and Arch-Ovum to the ghost Keeper and take the upgraded sword.', { success: 'Every player must possess their upgraded Reborn Sword before the book/flag route.' })
      ])
    ];
    shadows.mainQuests = [{
      id: 'apocalypse-averted', name: 'Apocalypse Averted', players: '4 players', reward: 'Summoning Key, Gateworm, and Apocalypse Averted', summary: 'Complete the rituals and sword upgrades, awaken four Keepers with the flag, capture the Shadowman, and crush the Gateworm with the tram.',
      steps: [
        step('Finish all four rituals, Pack-a-Punch, and sword upgrades', 'All districts and the Sacred Place', 'Verify the four Gateworm ritual icons are complete, Pack-a-Punch is open, and each of the four players has personally upgraded their character sword.', { success: 'The book in Nero’s ritual room becomes interactable.', images: [shadowsFlow] }),
        step('Open the quest book', 'Floor of Nero’s ritual room', 'Interact with the open book after all upgraded swords are ready. The flag becomes available in the centre of the Subway.'),
        step('Charge the flag at both spark points in one district', 'Two pink electrical ground rifts in Canals, Waterfront, Footlight, or Junction/Nero', 'Pick up the flag and carry it to the first sparking location. Defend it for roughly 30 seconds from Meatballs, Parasites, and the Shadowman. Shoot the Shadowman whenever he attacks the cloth. After the chime and Max Ammo, carry the flag to the second point and repeat.', { success: 'The second defense chimes and the flag becomes fully charged for that district.', warning: 'If the flag health empties, it returns to the Subway and the district must be retried.' }),
        step('Deliver the flag to the district Keeper', 'Matching character ritual altar', 'Take the charged flag to the ghost Keeper at that district’s ritual room. The Keeper becomes physical and stays active for the final confrontation.'),
        step('Repeat the flag route for all four districts', 'Two flag positions and one altar per district', 'Only one district can be completed per round. Repeat the two-defense-and-delivery process until all four Keepers are physical.', { tip: 'Plan four rounds and leave one normal zombie alive before collecting the flag each time.' }),
        step('Capture the Shadowman', 'Sacred Place beneath Pack-a-Punch', 'Each player interacts with one Keeper pedestal. When all four are ready, the Keepers remove the Shadowman’s shield. Focus fire on him as he moves around the room. When he is forced over the Summoning Key altar, interact with the key to trap him.', { success: 'The Shadowman disappears into the Summoning Key and the giant Gateworm appears over Junction.' }),
        step('Open Beast Mode at all three tram stations', 'Canals, Waterfront, and Footlight tram platforms', 'Kill the spawned Margwas to make Beast Mode pods available. Put one player at each tram station electrical box and the fourth player in Junction/Subway for the Keeper shocks.'),
        step('Electrify the rails and call the tram', 'Three tram station electrical boxes', 'The three station players enter Beast Mode and shock their boxes together. One of them immediately calls the tram so it crosses the centre while the rails are charged.', { success: 'The tram strikes and stuns the giant Gateworm.', warning: 'If the electricity fades before the tram reaches the Gateworm, kill the next Margwas and repeat.' }),
        step('Shock the three underground Keepers', 'Junction/Subway during the Gateworm stun', 'While the tram hits the Gateworm, the fourth Beast player shocks the three glowing Keeper figures beneath the central area before the stun ends.', { success: 'The final cutscene plays and Apocalypse Averted completes.', images: [shadowsFlow] })
      ]
    }];
    shadows.optionalSideQuests = [
      guide('Apothicon Servant', 'Buildable wonder weapon', [
        step('Collect the Margwa Heart', 'First defeated Margwa', 'Pick up the heart dropped by a Margwa.'),
        step('Collect the Margwa Tentacle', 'Purple plant pods', 'Water plant pods until a purple pod grows, then open pods until the tentacle appears.'),
        step('Collect Xenomatter', 'Parasites after later rounds', 'Kill Parasites until Xenomatter drops.'),
        step('Build the Servant', 'A map workbench', 'Assemble all three parts. Shadows of Evil does not support the normal Pack-a-Punch upgrade for this weapon.')
      ]),
      guide('Civil Protector', 'Temporary robot ally', [step('Collect the three fuses', 'Tram-platform boxes in Canals, Waterfront, and Footlight', 'Take one fuse from each district.'), step('Install and summon', 'Rift fuse box, then district call box', 'Install all three fuses, then pay 2,000 points at a call box to summon the Civil Protector.')]),
      guide('“Cold Hard Cash” song', 'Music track', [step('Collect and assemble the microphone', 'Nero’s Workshop, Canals stairs, and Widow’s Wine tunnel', 'Collect the stand, cable, and microphone, then assemble them on the Black Lace stage.')])
    ];
    shadows.sideQuests = [...shadows.requiredGuides, ...shadows.optionalSideQuests];
    shadows.visuals = [];
    shadows.sources = [
      source('Zombies Codex — Shadows of Evil', 'https://www.zombiescodex.com/black-ops-3/shadows-of-evil/', 'Ritual, sword, flag, Shadowman, and four-player finale'),
      source('Call of Duty Wiki — Apocalypse Averted', 'https://callofduty.fandom.com/wiki/Apocalypse_Averted', 'Player requirement and final sequence cross-check')
    ];
  }

  const giant = findMap('black-ops-3-the-giant');
  if (giant) {
    giant.status = 'Deep-audited guide';
    giant.auditStatus = 'deep-audited';
    giant.requirements = [];
    giant.mainQuests = [];
    giant.requiredGuides = [];
    giant.optionalSideQuests = [
      guide('Fly Trap and Annihilator', 'Annihilator specialist weapon', [
        step('Link all three teleporters', 'Teleporter rooms and mainframe', 'Turn on power. Activate each teleporter and reach the mainframe link pad before its timer expires. Pack-a-Punch opens after all three are linked.'),
        step('Activate the Fly Trap', 'Animal Testing window near the mainframe', 'Use a Pack-a-Punched weapon to shoot the small exterior control panel. Three hidden objects launch and Samantha begins the hide-and-seek sequence.'),
        step('Shoot the teddy on the fire escape', 'Exterior ledge visible from the main courtyard', 'Shoot the teddy bear on the distant fire escape until it disappears.'),
        step('Shoot the monkey in the furnace', 'Furnace room', 'Look through the furnace opening and shoot the Monkey Bomb.'),
        step('Shoot the teddy in the vat/balcony area', 'Animal Testing / upper balcony sightline', 'Shoot the final teddy bear in its elevated location.'),
        step('Collect the Annihilator', 'Furnace', 'After the final object, interact with the Annihilator inside the furnace.', { success: 'The specialist weapon is permanently available for the match.' })
      ]),
      guide('“Beauty of Annihilation” remix', 'Music track', [step('Activate the three preserved-spine jars', 'Around the factory', 'Interact with all three green jars in any order. The remix starts after the third.')])
    ];
    giant.sideQuests = giant.optionalSideQuests;
    giant.visuals = [];
    giant.sources = [source('Zombies Codex — The Giant', 'https://www.zombiescodex.com/black-ops-3/the-giant/', 'Fly Trap, Annihilator, and side secrets'), source('Call of Duty Wiki — The Giant', 'https://callofduty.fandom.com/wiki/The_Giant', 'Version and location cross-check')];
  }

  const de = findMap('black-ops-3-der-eisendrache');
  if (de) {
    de.status = 'Deep-audited guide';
    de.auditStatus = 'deep-audited';
    de.requirements = [
      'Power and Pack-a-Punch',
      'Wrath of the Ancients',
      'One upgraded elemental bow per player in ranked online play',
      'All four bows in local, offline, or unranked matches',
      'Ragnarok DG-4',
      'Death Ray fuse and both Tesla coils',
      'Fresh shield and full boss-fight loadout recommended'
    ];
    const baseBow = guide('Wrath of the Ancients', 'Base bow required for every elemental upgrade', [
      step('Feed the courtyard dragon', 'First courtyard near spawn', 'Kill zombies close enough for the dragon to consume them one at a time. Wait for each chewing animation before killing the next.'),
      step('Feed the Mission Control dragon', 'Above the fireplace in Mission Control', 'Repeat until the dragon crumbles.'),
      step('Feed the Undercroft dragon', 'Pyramid room', 'Repeat at the third dragon.'),
      step('Collect the bow', 'Behind the knight’s tomb in Mission Control', 'Take the Wrath of the Ancients after all three dragons are complete.')
    ]);
    const stormBow = guide('Storm / Lightning Bow', 'Upgraded blue bow', [
      step('Take the broken arrow', 'Castle rooftop weather vane', 'Shoot the weather vane with the base bow and collect the dropped arrow.'),
      step('Light the three distant bonfires', 'Village hill, Clock Tower rampart, and hill above the Rocket Launch site', 'Hit each bonfire with a charged arrow. A burning bonfire confirms the shot.'),
      step('Wall-run all five symbols', 'Undercroft during low gravity', 'Touch all five blue wall symbols during one continuous wall run without touching the floor.'),
      step('Fill the three lightning urns', 'Clock Tower, room above Double Tap, and tunnel toward Rocket Launch', 'Kill roughly six zombies beside each urn until it is charged.'),
      step('Imbue the bonfires', 'From each charged urn', 'Draw a charged arrow beside an urn until it becomes electrical and fire it at one distant bonfire. Use each urn once.'),
      step('Forge and charge the arrow', 'Weather vane tower, then blue Undercroft altar', 'Collect the forged arrow from the blue cloud, place it in the blue altar, and earn nearby soul kills until the Storm Bow is ready.')
    ]);
    const voidBow = guide('Void / Demon Gate Bow', 'Upgraded purple bow', [
      step('Open the Void route', 'Purple symbol above the gate near Double Tap', 'Hit the symbol with a charged base-bow shot and collect the broken arrow.'),
      step('Release the urn', 'Trophy room below Clock Tower', 'Melee-kill a zombie on the glowing purple floor tile, then interact with the broken tile.'),
      step('Collect all six skulls', 'Mule Kick broken wall; church entrance window; Samantha’s toy chest; wall near Double Tap; teleporter-room sink; Rocket Launch truck bed', 'Interact with each skull.'),
      step('Feed six crawlers', 'Purple circle in the trophy room', 'Create and lead one crawler at a time into the circle until all six skulls consume a crawler.'),
      step('Record the three spoken words', 'Floating urn', 'Shoot the urn with a charged arrow and write down the three words in exact order.'),
      step('Collect six purple symbol drops', 'Zombie kills across the map', 'Pick up the fading purple drops before they disappear.'),
      step('Translate the words and enter the symbols', 'Knight statues and purple floor symbols', 'Interact with the knight statue matching each spoken word and record its symbol. Shoot the three floor symbols in the same word order, then take the forged arrow.'),
      step('Charge the Void Bow', 'Purple Undercroft altar', 'Place the arrow, earn nearby soul kills, and collect the bow.')
    ]);
    const wolfBow = guide('Wolf Bow', 'Upgraded green bow', [
      step('Activate the four paintings in story order', 'Clock Tower, room below it near Mule Kick, church balcony, and corridor beyond Samantha’s bedroom', 'Use this order: king on throne with wolf; armoured king on horseback; burning castle/dark creature; king’s skeleton.'),
      step('Collect the broken arrow', 'Opened wall near the Undercroft stairs', 'Take the arrow after the fourth painting.'),
      step('Shoot down the wolf skull', 'Flag above the sealed doorway at Rocket Launch', 'Hit the flag with a charged arrow and collect the falling skull.'),
      step('Awaken the spectral wolf', 'Headless skeleton beside the green altar', 'Place the skull on the skeleton.'),
      step('Fill three bone piles', 'Locations selected by the spectral wolf', 'Follow the wolf, kill zombies near each scratched pile, and collect the bone when the pile is full.'),
      step('Wall-run and obtain the arrow', 'Final Undercroft wall during low gravity', 'Wall-run, shoot the glowing wolf symbol above the hole, stand on the raised platform, and interact with the hole.'),
      step('Charge the Wolf Bow', 'Green Undercroft altar', 'Place the arrow and feed it nearby souls.')
    ]);
    const fireBow = guide('Fire / Rune Prison Bow', 'Upgraded red bow', [
      step('Open the Fire route', 'Red symbol high in Clock Tower', 'Shoot it with the base bow and take the broken arrow from the opened wall.'),
      step('Shoot the post-test fireball', 'Rocket Launch site', 'Wait through a rocket test. As soon as the safety doors reopen, step outside and shoot the glowing fireball above the concrete building before it fades.'),
      step('Hit all three Wundersphere circles', 'Three launch routes', 'Use each launch pad and shoot its glowing red ground circle while airborne. A successful circle stays lit.'),
      step('Charge the three circles', 'Inside each lit red circle', 'Kill zombies inside the circle until the fire charge completes.'),
      step('Read the rune and choose its fireplace', 'Clock Tower mechanism and the matching castle fireplace', 'Interact with the mechanism to reveal a random rune. Find the fireplace bearing that same rune.'),
      step('Chain fire into the fireplace', 'From the charged circle nearest the selected fireplace', 'Shoot charged arrows into the ground, with every new shot landing inside the currently burning patch, until the chain reaches and ignites the fireplace.'),
      step('Forge and charge the arrow', 'Clock Tower mechanism, then red Undercroft altar', 'Collect the forged arrow, place it at the red altar, and feed nearby souls until the Fire Bow is ready.')
    ]);
    const ragnarok = guide('Ragnarok DG-4', 'Required gravity spikes', [
      step('Collect the Panzer part', 'First killed Panzersoldat', 'Pick up the dropped component.'),
      step('Collect the Wundersphere part', 'Bastion / Death Ray route', 'Activate the Death Ray so the floating part appears, then launch through the correct Wundersphere and grab it in mid-air before it disappears.'),
      step('Collect the rocket-test part', 'Rocket Launch site', 'During a rocket test, flip the lever behind the rocket from red to green, reach the teleporter console before the doors seal, and interact until all three lights turn green. Take the part from the teleporter.'),
      step('Build the Ragnarok', 'Any workbench', 'Assemble all three components.')
    ]);
    de.requiredGuides = [baseBow, stormBow, voidBow, wolfBow, fireBow, ragnarok];
    de.mainQuests = [{
      id: 'my-brother-s-keeper', name: 'My Brother’s Keeper', players: '1–4 players', reward: 'Gateworm and ending cutscene', summary: 'Upgrade the required bows, travel to the past, bring down Dempsey’s pod, feed the spectral Keeper, and defeat the corrupted Keeper.',
      steps: [
        step('Complete power, Pack-a-Punch, bows, and Ragnarok', 'Entire map', 'Turn on power, teleport all three Pack-a-Punch parts, build the base bow, upgrade the required number of elemental bows, and assemble the Ragnarok DG-4.', { success: 'The Death Ray fuse, wisp, and time-travel stages can now be completed.', images: [deFlow] }),
        step('Install the fuse and set the Death Ray to Protect', 'Bastion', 'Insert the fuse on the Clock-Tower-facing side of the trap, then move to the opposite console and set the mode lever to Protect.'),
        step('Charge the teleporter and shoot four wisps', 'Undercroft teleporter, then eight possible castle objects', 'Shoot the teleporter prongs until they glow. Use uncharged bow shots to hit four blue wisps within the time limit. Possible objects include the clock, telephone, globe, radio, tire, car, and workbench areas.', { success: 'The teleporter glows purple.', warning: 'A timeout resets the current wisp attempt; repeat from the teleporter prongs.' }),
        step('Travel to the past and record Groph’s code', 'Past laboratory', 'All players enter the purple teleporter. Take the soul canister and fuses, interact with the required equipment, and write down the three symbols Dr. Groph enters into the safe.', { warning: 'The three-symbol code is randomized each match.' }),
        step('Open the safe and install the Tesla coils', 'Clock Tower terminal and Bastion towers', 'Enter the three symbols at the Clock Tower terminal. Take the Tesla coils and key items from the opened safe, then install one coil in each Bastion tower.'),
        step('Complete both Simon Says consoles', 'Clock Tower first, Rocket Launch second', 'Set the Death Ray to Destroy. Repeat the memory sequence at the Clock Tower console, then complete the Rocket Launch console while infinite Hellhounds attack. Return the Death Ray to Protect and press the green button.', { success: 'The coils fire and Dempsey’s cryopod falls into the second courtyard.' }),
        step('Collect the Vril Generator', 'Dempsey’s crashed cryopod', 'Take the golden Vril Generator from the pod.'),
        step('Repeat time travel and obtain the Keeper Stone', 'Past Undercroft, then Double Tap lamppost', 'Repeat the teleporter-prong and four-wisp route. In the past, open the Keeper Stone crate. Return and place the stone beneath the lamppost near Double Tap.'),
        step('Feed the spectral Keeper at all four circles', 'Crypt socket and four ritual circles', 'Insert the Vril Generator into the crypt socket. Follow the Keeper to each circle and kill zombies inside using the upgraded bow that matches the circle’s colour. When the route reaches Double Tap, insert the Keeper Stone into its wall slot.', { success: 'All four circles are charged and the Keeper returns to the pyramid.', warning: 'A wrong-colour bow does not charge the circle.' }),
        step('Enter the boss arena', 'Four blue MPD plates in the Undercroft', 'Activate anti-gravity and have the team stand on the four plates. The squad teleports into the corrupted Keeper arena.'),
        step('Defeat the corrupted Keeper', 'Boss arena', 'Survive skeleton and Panzer waves. When lightning gathers in the centre, place a charged Ragnarok on the orb to trap the boss, then fire upgraded bows into the exposed chest. Repeat through all damage phases.', { success: 'The Keeper dies and the team returns to the castle.' }),
        step('Charge and place the Summoning Key', 'Undercroft MPD, then Clock Tower terminal', 'Place the Summoning Key on the MPD and kill zombies nearby until it is charged. Collect it and place it in the Clock Tower terminal to trigger the ending.', { success: 'My Brother’s Keeper completes and the cutscene plays.', images: [deFlow] })
      ]
    }];
    de.optionalSideQuests = [
      guide('Panzer Helmet', 'Reduced Panzer damage', [step('Use each ceiling claw to kill a Panzer', 'First-courtyard balcony, armour corridor, and Quick Revive stone tunnel', 'Trigger all three claws and ensure each one kills a Panzersoldat. Collect the helmet reward afterward.')]),
      guide('“Dead Again” song', 'Music track', [step('Activate the three teddy bears', 'Samantha’s bedroom chair, cell opposite Jugger-Nog, and Rocket Launch truck', 'Interact with all three bears in any order.')]),
      guide('Zombie Shield', 'Back protection and boost', [step('Collect one part from each region', 'First courtyard, church/second courtyard, and low-gravity Undercroft', 'Search the three spawn pools and build the shield at a workbench.')])
    ];
    de.sideQuests = [...de.requiredGuides, ...de.optionalSideQuests];
    de.visuals = [];
    de.sources = [source('Zombies Codex — Der Eisendrache', 'https://www.zombiescodex.com/black-ops-3/der-eisendrache/', 'Main quest, bow upgrades, Ragnarok, and player-count rules'), source('Call of Duty Wiki — My Brother’s Keeper', 'https://callofduty.fandom.com/wiki/My_Brother%27s_Keeper', 'Quest and achievement cross-check')];
  }

  const zns = findMap('black-ops-3-zetsubou-no-shima');
  if (zns) {
    zns.status = 'Deep-audited guide';
    zns.auditStatus = 'deep-audited';
    zns.requirements = ['Anywhere But Here! equipped before the match', 'Permanent power and Pack-a-Punch', 'Zombie Shield and Gas Mask', 'KT-4 upgraded to Masamune', 'Skull of Nan Sapwe', 'Every player’s three challenge trials completed'];
    zns.requiredGuides = [
      guide('Power and Pack-a-Punch', 'Permanent power and weapon upgrades', [
        step('Power both laboratories', 'Lab A and Lab B', 'Fill the bucket with blue water and pour it into each lab generator. Defend both temporary generators.'),
        step('Activate permanent power', 'Bunker Power Room', 'Enter the bunker, dive into the flooded turbine, clear the webbed fan, survive the lockdown, and flip the main switch.'),
        step('Drain the Pack-a-Punch chamber', 'Operations Room', 'Collect the three drain components from the flooded turbine area, purple-water cocoon chamber, and submerged body-bag cave. Install one on each valve around Pack-a-Punch.')
      ]),
      guide('Zombie Shield and Gas Mask', 'Quest safety and electrified-panel access', [
        step('Build the Shield', 'Lab A, Lab B tree area, and AA Platform', 'Collect one shield part from each region and assemble it at a lab workbench.'),
        step('Build the Gas Mask', 'Plane crash, Lab B rear, and Docks', 'Collect the cable, face mask, and filter and assemble them. Wear it for underwater and spore-heavy routes.')
      ]),
      guide('KT-4 and Masamune', 'Required upgraded wonder weapon', [
        step('Collect spider venom', 'Lab A spider cage during a Spider round', 'Activate the cage, trap a spider, and collect the extracted venom canister.'),
        step('Collect the green vial', 'Lab B area', 'Kill the green-glowing zombie and take its vial.'),
        step('Collect the underwater plant', 'Deep cave beyond Mule Kick', 'Dive to the dead end, shooting orange spores for air, and take the red plant.'),
        step('Build the KT-4', 'Bunker workbench', 'Assemble the three base parts.'),
        step('Grow the rainbow plant', 'Underwater cave bed', 'Collect Rainbow Water during sewer-pipe fast travel. Plant a seed and water it once per round for three rounds, then take the plant.'),
        step('Collect the electric vial', 'Lab B cage', 'Charge the Shield from the lightning strike at the central altar and shock the Lab B panel to operate the vial cage. In co-op, a second player may need to re-electrify the panel for the return movement.'),
        step('Collect the spider fang', 'Giant Spider lair', 'Use the KT-4 to dissolve the web by Speed Cola, defeat the giant spider, and take its fang.'),
        step('Build the Masamune', 'KT-4 workbench', 'Combine the three upgrade ingredients with the KT-4.')
      ]),
      guide('Skull of Nan Sapwe and challenge lightning', 'Required scan tool and electrified Shield', [
        step('Cleanse all four skulls', 'Altars at spawn, plane wreckage, Docks, and Operations', 'Match each skull symbol to its altar and defend it until cleansed.'),
        step('Claim the Skull', 'Cave beneath the central altar', 'Survive the Keeper defense and take the Skull of Nan Sapwe.'),
        step('Complete every challenge trial', 'Player challenge pillars', 'Each player completes their three randomized objectives and claims the rewards.'),
        step('Catch the altar lightning', 'Central skull altar', 'After all challenges, lightning periodically strikes the altar. Hold the Zombie Shield into the strike to electrify it.')
      ])
    ];
    zns.mainQuests = [{
      id: 'seeds-of-doubt', name: 'Seeds of Doubt', players: '1–4 players', reward: 'Gateworm and Takeo ending', summary: 'Build the island equipment, upgrade the KT-4, retrieve three elevator cogs, and destroy the mutated Takeo’s four arms.',
      steps: [
        step('Complete all required preparation', 'Entire island', 'Turn on permanent power, open Pack-a-Punch, build the Shield and Gas Mask, obtain the Skull, finish every challenge, and build the Masamune.', { success: 'The hidden cog routes and elevator generator can all be accessed.', images: [znsCogs] }),
        step('Cog 1 — use Anywhere But Here!', 'Sealed chamber beneath Lab A', 'Stand inside the otherwise inaccessible chamber and activate Anywhere But Here! The GobbleGum teleports the player into the secret room above Lab A. Take the cog and use the one-way exit.', { warning: 'If Anywhere But Here! was not equipped before the match, the quest cannot be completed normally.' }),
        step('Cog 2 — drop from the electrified zipline', 'Docks-to-Lab-A zipline', 'Use the electrified Shield on the Lab A zipline panel. Ride upward from the Docks toward Lab A and melee almost immediately to release the handle and land on the small side dock. Pick up the cog.', { images: [znsCogs] }),
        step('Cog 3 — shoot down the plane', 'Blue-water plant and AA gun', 'Grow one or more blue-water plants for three rounds and shoot each plant with the KT-4 once per round. Collect the Flak Shell when it appears, load the AA gun, and shoot the passing plane. Find the smoking cog at one of its landing sites.', { tip: 'Grow two plants in parallel because the shell is a chance reward.', images: [znsCogs] }),
        step('Reveal the elevator generator room', 'Living Quarters and wall right of the bunker entrance', 'Use the Skull’s mesmerize beam on the half poster left of the purple water to reveal the other half. Then mesmerize the rusted wall right of the bunker entrance, left of the yellow danger sign, to open the hidden machinery room.'),
        step('Install the cogs and descend', 'Hidden elevator machinery', 'Place all three cogs. Ride the repaired elevator down and use the KT-4 or Masamune to clear the vines blocking the shaft.'),
        step('Enter the boss chamber', 'Lowest Division 9 room', 'Use the Masamune on the obstruction and proceed only after every player has a Gas Mask, shield, armour-equivalent perks, and ammunition.'),
        step('Destroy the giant Thrasher’s four arms', 'Boss arena', 'Shoot one arm’s spore with the Masamune to wake the boss. Ignore the body. Survive the constant Spiders and Thrashers, and damage only the orange-glowing spore on an exposed arm. Repeat until all four arms are destroyed.', { success: 'The mutated Takeo dies, Seeds of Doubt completes, and the ending cutscene plays.' })
      ]
    }];
    zns.optionalSideQuests = [
      guide('“Dead Flowers” song', 'Music track', [step('Activate the three plush toys', 'Lab A generator, Lab B upper room, and bunker Test Subjects table', 'Interact with all three in any order.')]),
      guide('Golden Bucket', 'Bucket that holds every water colour', [step('Complete the long plant/watering progression', 'Multiple plant beds and water sources', 'Grow and harvest enough properly watered plants to unlock the Golden Bucket reward at its altar.')]),
      guide('Spider Bait', 'Temporary spider transformation', [step('Complete the cocoon route', 'Giant Spider and cocoon areas', 'After the giant spider fight, complete the lure, cocoon, and timed interaction sequence to unlock Spider Bait.')])
    ];
    zns.sideQuests = [...zns.requiredGuides, ...zns.optionalSideQuests];
    zns.visuals = [];
    zns.sources = [source('Zombies Codex — Zetsubou No Shima', 'https://www.zombiescodex.com/black-ops-3/zetsubou-no-shima/', 'Power, equipment, Masamune, cogs, elevator, and boss'), source('Call of Duty Wiki — Seeds of Doubt', 'https://callofduty.fandom.com/wiki/Seeds_of_Doubt', 'Quest and ending cross-check')];
  }

  const gorod = findMap('black-ops-3-gorod-krovi');
  if (gorod) {
    gorod.status = 'Deep-audited guide';
    gorod.auditStatus = 'deep-audited';
    gorod.requirements = ['Power and Dragon Network', 'Dragon Strike', 'Gauntlet of Siegfried', 'Shield recommended', 'Six trophies', 'Master Code Cylinder', 'Strong Nikolai/dragon boss loadout'];
    gorod.requiredGuides = [
      guide('Dragon Network and Pack-a-Punch', 'Dragon travel and bunker access', [
        step('Charge three code cylinders', 'Tank Factory, Supply Depot, and Dragon Command consoles', 'Insert each dropped cylinder into its matching console and kill zombies inside the green circle until the Groph Module finishes.'),
        step('Insert all three network parts', 'Dragon Command', 'Take the module from each completed console and install all three at the Dragon Network terminal.'),
        step('Ride each dragon route', 'Three dragon command platforms', 'Call the dragons and ride to the Pack-a-Punch bunker. Complete the bunker lockdown to earn Dragon Strike.')
      ]),
      guide('Gauntlet of Siegfried', 'Required mini-dragon and melee tool', [
        step('Shoot and collect the dragon egg', 'Sewer exit / hatchery route', 'Shoot the egg down and carry it to the Pack-a-Punch incubator.'),
        step('Heat the egg', 'Dragon-breath locations', 'Place the egg where dragon fire can strike it, then collect it after it cools.'),
        step('Complete the three personal egg challenges', 'Spawn challenge board', 'Finish the displayed Napalm, penetration, or melee objectives.'),
        step('Incubate and cool the egg', 'Pack-a-Punch bunker incubator', 'Place the egg, fill it with zombie souls, wait two rounds for it to cool, and return it to the challenge board for the Gauntlet.')
      ])
    ];
    gorod.mainQuests = [{
      id: 'love-and-war', name: 'Love and War', players: '1–4 players', reward: 'Gateworm and ending cutscene', summary: 'Collect six trophies, enter KRONOS, complete S.O.P.H.I.A.’s trials, launch her core, and defeat the dragon and Nikolai.',
      steps: [
        step('Finish the Dragon Network, Dragon Strike, and Gauntlet', 'Entire map', 'Turn on power, open Pack-a-Punch, complete the lockdown for Dragon Strike, and build the Gauntlet of Siegfried.', { images: [gkTrials] }),
        step('Collect all six trophies', 'Map-specific trophy interactions', 'Collect the toilet trophy with the sewer interaction, the Dragon Strike trophy from its puddle target, the laser-eye trophy from the Gigant Laser target, the shield-fire trophy from its pipe, the supply-pod trophy, and the strongbox trophy opened with the Gauntlet melee.', { success: 'All six trophies can be placed beneath the Dragon Command monitor.' }),
        step('Obtain and insert the Master Code Cylinder', 'Valve/cylinder route and S.O.P.H.I.A. terminal', 'Complete the valve-flow puzzle so the cylinder reaches its final machine. Take the purple Master Code Cylinder and insert it into S.O.P.H.I.A.’s terminal.'),
        step('Enter the password KRONOS', 'Letter dials beside S.O.P.H.I.A.', 'Shoot the six letter dials until they spell KRONOS, then interact with the terminal.', { code: 'KRONOS', success: 'The monitor activates and the trial sequence becomes available.' }),
        step('Bomb trial — record and defuse six bombs', 'S.O.P.H.I.A. monitor and six map bomb sites', 'Watch the monitor carefully and record the six highlighted locations in exact order. Only after the full sequence is written down should the team begin defusing. Interact with the bombs in that exact order within two minutes.', { warning: 'Touching the wrong bomb causes a lethal failure. Record the full order before moving.', images: [gkTrials] }),
        step('Valkyrie escort trial', 'Spawn to Dragon Command', 'Escort the green-eyed Valkyrie Drone to the teleporter pad opposite S.O.P.H.I.A. Do not shoot it; clear zombies and keep it moving.'),
        step('Mangler escort trial', 'Tank Factory to Dragon Command', 'Shoot off the green-eyed Mangler’s arm cannon without killing it, then walk it to the S.O.P.H.I.A. teleporter pad.'),
        step('Groph Module cargo trial', 'Outside pod location to Dragon Command', 'Find the dropped pod, clear nearby zombies, send the Gauntlet’s mini-dragon to retrieve its cargo, and return the item to the teleporter pad.'),
        step('Gersh orb trial', 'Moving yellow orb across the map', 'Shoot the yellow orb until it speaks and relocates. Track and shoot it through all stages until it asks the team to stop and the trial completes.'),
        step('Penetration / incubation trial', 'Assigned challenge location', 'Complete the remaining trial shown by S.O.P.H.I.A., including the penetrating-kill or lockdown condition, without leaving the active area.', { success: 'All trial lights are complete; order varies each match.', images: [gkTrials] }),
        step('Power and launch S.O.P.H.I.A.', 'Dragon Command', 'Use the Gauntlet mini-dragon to transfer power to S.O.P.H.I.A. Rotate her toward the Nikolai machine and activate launch. Collect the Power Core she leaves behind.'),
        step('Enter the boss arena', 'Pack-a-Punch bunker sewer/console route', 'Carry the Power Core to the bunker, place it at the console, and have every player confirm readiness.'),
        step('Defeat the dragon', 'Boss arena', 'Use Dragon Strike to expose and control damage windows. Shoot the glowing weak points across the dragon’s body while avoiding fire and debris. Repeat until the dragon dies.'),
        step('Defeat Nikolai 1.0', 'Same arena', 'Destroy the yellow weak points on the mech, clear RAPS and Manglers, and shoot the exposed central core during each damage phase.', { success: 'Nikolai falls and Love and War’s ending cutscene plays.' })
      ]
    }];
    gorod.optionalSideQuests = [guide('Guard of Fafnir', 'Dragon Shield', [step('Collect the three parts', 'Armory, Infirmary, and Operations/Dragon Command pools', 'Search one part pool in each region and build the shield.')]), guide('“Ace of Spades” song', 'Music track', [step('Activate the three vodka bottles', 'Across the map', 'Interact with all three bottles in any order.')])];
    gorod.sideQuests = [...gorod.requiredGuides, ...gorod.optionalSideQuests];
    gorod.visuals = [];
    gorod.sources = [source('Gameranx — Gorod Krovi Love and War', 'https://gameranx.com/features/id/64555/article/black-ops-3-gorod-krovi-love-and-war-full-easter-egg-guide/', 'Trophies, KRONOS, trials, and boss route'), source('Call of Duty Wiki — Love and War', 'https://callofduty.fandom.com/wiki/Love_and_War', 'Quest and achievement cross-check')];
  }

  const revelations = findMap('black-ops-3-revelations');
  if (revelations) {
    revelations.status = 'Deep-audited guide';
    revelations.auditStatus = 'deep-audited';
    revelations.requirements = ['All four Corruption Engines active', 'Pack-a-Punch freed inside the Apothicon', 'Keeper Protector altar built', 'L’il Arnies', 'Apothicon Servant upgraded to Estoom-Oth', 'Pack-a-Punched bullet weapon', 'Strong Margwa and Shadowman loadout'];
    revelations.requiredGuides = [
      guide('Corruption Engines and Pack-a-Punch', 'Power, Nacht access, and Apothicon interior', [
        step('Override all four Corruption Engines', 'Spawn, Verrückt, Mob of the Dead, and Der Eisendrache areas', 'Pay and survive each short Corruption Engine lockdown.'),
        step('Capture and enter the Apothicon', 'Nacht Tesla switch and Apothicon mouth', 'Use the charged Nacht Tesla switch to stun the flying Apothicon, then enter through its open mouth.'),
        step('Free Pack-a-Punch', 'Apothicon interior', 'Shoot the three yellow heart/tendril bulbs until the machine falls to the bridge.')
      ]),
      guide('Keeper Protector altar', 'Required ritual ally', [
        step('Collect all three altar parts', 'Mob/Origins region, Verrückt region, and Kino/Der Eisendrache region', 'Search the possible part spawns in the three region groups.'),
        step('Build and summon', 'One of the rune-carved altar walls', 'Build the altar and pay to summon a Keeper Protector when the main quest calls for it.')
      ]),
      guide('Estoom-Oth', 'Upgraded Apothicon Servant', [
        step('Obtain the Apothicon Servant', 'Mystery Box', 'Keep it for the five floating 115-cube and skeleton collection stages.'),
        step('Shoot all five floating blue cubes', 'Spawn, Shangri-La, Verrückt jump-pad side, Mob side, and Verrückt/Nacht portal side', 'Shoot every cube with the Apothicon Servant until it disappears.'),
        step('Upgrade at Pack-a-Punch', 'Apothicon interior', 'When all five crystals appear around the machine, Pack-a-Punch the Servant to obtain Estoom-Oth.')
      ])
    ];
    revelations.mainQuests = [{
      id: 'for-the-good-of-all', name: 'For The Good Of All', players: '1–4 players', reward: 'Gateworm and Revelations ending', summary: 'Complete the Keeper ritual, Margwa/Arnie stage, skeleton hunt, Sophia route, four egg runes, two boss rooms, and seven Summoning Key targets.',
      steps: [
        step('Shoot the four gravestones in character order', 'Spawn cemetery', 'From left to right the stones are Takeo, Richtofen, Dempsey, Nikolai. Shoot them in chronological death order: Richtofen, Dempsey, Takeo, Nikolai—positions 2, 3, 1, 4.', { code: '2 → 3 → 1 → 4', success: 'A triangular ritual stone appears behind one jump pad.', images: [revFlow] }),
        step('Complete the Keeper-stone ritual', 'Jump pad where the stone appeared', 'Summon a Keeper Protector, travel to the correct jump pad, and keep the Keeper alive while it performs the roughly three-minute ritual. Collect the reel and play it at the Nacht radio.', { warning: 'The Keeper must teleport to the exact pad where the stone spawned.' }),
        step('Throw Arnies into all nine Apothicon spawn holes', 'Apothicon interior', 'Throw one L’il Arnie into each green-gas spawn hole, three per ammunition set. After every three valid holes, kill the three spawned Margwas. Complete all three sets—nine Margwas total.', { success: 'A reel appears on the central bridge. Play it at the Kino stage radio.' }),
        step('Upgrade the Servant and collect six skeleton parts', 'Six map regions plus Nacht bone pile', 'With Estoom-Oth ready, shoot each hidden stone slab first with any Pack-a-Punched gun, then shoot the revealed bone with Estoom-Oth. The six regions are Spawn church, Shangri-La, Origins field, Verrückt waterfall, Nacht ceiling, and the Der Eisendrache low-gravity wall run.', { success: 'All six bones form a pile beside the Nacht radio.' }),
        step('Recover Sophia’s body and place the third reel', 'Nacht bone pile and Origins desk', 'Shoot the assembled bone pile with Estoom-Oth, then shoot the revealed Sophia body with Estoom-Oth. Take the reel and place it on the desk at the top of the Origins hill.'),
        step('Aim all four Corruption turrets at Sophia’s orbs', 'Four former Corruption Engine turrets', 'Use each turret and aim at its blue spinning sky orb. A valid lock automatically ejects the player. Complete all four so Sophia materializes and moves to Kino.'),
        step('Teleport to the House and take the Kronorium', 'Kino stage teleporter', 'When Sophia charges the pod, all players interact together within the short window. In the House bedroom, interact with the bed to take the Kronorium.'),
        step('Charge four eggs and find four hidden runes', 'One egg at a time across Spawn, Origins, Verrückt, and Kino; incubation in the Apothicon', 'Find one Apothicon Egg, place it in an empty incubation seat, kill 15 enemies beside the released soul, then carry the spawned Gateworm and follow its faster sonar ping to an invisible rune. Repeat for all four eggs.', { success: 'All four runes appear at the Kino projector-room ritual.' }),
        step('Complete the four Apothicon arena trials', 'Kino projector-room ritual and first boss arena', 'Stand on the four runes and interact together. Read the Kronorium’s four-symbol order, enter it on the floating rune, and survive the four arena conditions: rising fire, lightning, moving walls, and low-gravity damaging floor.', { success: 'The Summoning Key appears in the centre.' }),
        step('Hit all seven Summoning Key targets', 'Mob cell poster, Verrückt fountain gun, Shangri-La blue orb, Origins gravestone, Der Eisendrache clock, Nacht red barrel, Kino chandelier', 'Throw the Summoning Key at each fixed object and catch or retrieve it after every hit. The seven targets can be completed in any order.', { success: 'The Key is ready for the final arena.', images: [revFlow] }),
        step('Charge the Key and remove the Shadowman’s shield', 'Final arena upper walkway', 'Place the Key in a green holder and earn nearby kills until it glows yellow. Pick it up and throw it into Sophia’s ghostly image.'),
        step('Trap the Shadowman and use the Kronorium', 'Final arena', 'Focus fire on the unshielded Shadowman until he is pushed into the Apothicon mouth. Interact with the Kronorium before he escapes.', { success: 'For The Good Of All completes and the ending cutscene begins.', warning: 'If the Kronorium is not activated quickly enough, repeat the damage window.' })
      ]
    }];
    revelations.optionalSideQuests = [guide('Dragon Shield', 'Shield buildable', [step('Collect one part in each of three region groups', 'Origins/Mob, Verrückt, and Der Eisendrache/Kino pools', 'Search each group and build at a workbench.')]), guide('God Mask', 'High-resistance mask', [step('Complete the Apothicon mask-kill requirements', 'Apothicon interior', 'Earn the required enemy and damage-type kills at the mask altar, then collect the God Mask.')]), guide('“The Gift” song', 'Music track', [step('Activate the three teddy bears', 'Across Revelations', 'Interact with all three bears in any order.')])];
    revelations.sideQuests = [...revelations.requiredGuides, ...revelations.optionalSideQuests];
    revelations.visuals = [];
    revelations.sources = [source('Gameranx — Revelations complete guide', 'https://gameranx.com/features/id/73828/article/black-ops-3-revelations-easter-eggs-guide-step-by-step-tutorial/', 'Gravestones through Shadowman finale'), source('Call of Duty Wiki — For The Good Of All', 'https://callofduty.fandom.com/wiki/For_The_Good_Of_All', 'Quest and reward cross-check')];
  }

  const chronologyCopies = [
    ['black-ops-3-bo3-nacht-der-untoten', 'world-at-war-nacht-der-untoten', 'Nacht der Untoten — Chronicles'],
    ['black-ops-3-bo3-verruckt', 'world-at-war-verruckt', 'Verrückt — Chronicles'],
    ['black-ops-3-bo3-shi-no-numa', 'world-at-war-shi-no-numa', 'Shi No Numa — Chronicles'],
    ['black-ops-3-bo3-kino-der-toten', 'black-ops-kino-der-toten', 'Kino der Toten — Chronicles'],
    ['black-ops-3-bo3-ascension', 'black-ops-ascension', 'Ascension — Chronicles'],
    ['black-ops-3-bo3-shangri-la', 'black-ops-shangri-la', 'Shangri-La — Chronicles'],
    ['black-ops-3-bo3-moon', 'black-ops-moon', 'Moon — Chronicles'],
    ['black-ops-3-bo3-origins', 'black-ops-2-origins', 'Origins — Chronicles']
  ];

  for (const [targetId, sourceId, displayName] of chronologyCopies) {
    const target = findMap(targetId);
    const original = findMap(sourceId);
    if (!target || !original) continue;
    const preserved = { id: target.id, name: displayName, release: target.release, type: target.type, tone: target.tone, accent: target.accent };
    const copy = clone(original);
    Object.assign(target, copy, preserved);
    target.status = 'Deep-audited version guide';
    target.auditStatus = 'deep-audited';
    target.description = `${displayName} uses the audited original route below, with Black Ops III weapons, GobbleGums, remastered interactions, and the version notes listed first.`;
    target.requiredGuides = [
      guide('Zombies Chronicles version notes', 'Apply these differences to the audited route', [
        step('Use BO3 weapons, GobbleGums, and perk behavior', 'Entire map', 'The map layout and quest logic remain based on the original release, while the weapon pool, GobbleGums, movement, and some interaction prompts follow Black Ops III.'),
        step('Keep original player-count locks unless listed otherwise', 'Lobby setup', 'Ascension and Shangri-La still require four players for their simultaneous stages. Survival maps still have no story main quest.')
      ]),
      ...(copy.requiredGuides || [])
    ];
    if (targetId === 'black-ops-3-bo3-moon') {
      target.players = '1–4 players; complete quest is solo-capable';
      target.requirements = (target.requirements || []).filter((item) => !/qualified Richtofen|Call of the Dead|Shangri-La completed/i.test(item));
      target.requiredGuides[0].steps.push(step('Moon profile requirement removed', 'BO3 Chronicles', 'The Golden Rod and Focusing Stone no longer require prior Call of the Dead or Shangri-La completions. The full quest can be finished solo.'));
    }
    if (targetId === 'black-ops-3-bo3-origins') {
      target.requiredGuides[0].steps.push(step('Use the Chronicles staff-placement behavior', 'Ascend from Darkness', 'The BO2 Fire Staff repeated-pedestal shortcut is not the intended BO3 route. Place Ice in Freya, Wind in Odin, Lightning in Thor, and Fire in the lowest Excavation pedestal.'));
    }
    target.sideQuests = [...target.requiredGuides, ...(copy.optionalSideQuests || [])];
    target.optionalSideQuests = clone(copy.optionalSideQuests || []);
    target.sources = [...(copy.sources || []), source('Call of Duty Wiki — Zombies Chronicles', 'https://callofduty.fandom.com/wiki/Zombies_Chronicles', 'Remaster roster and version cross-check')];
  }
})();