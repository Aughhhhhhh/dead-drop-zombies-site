(() => {
  'use strict';
  const D = window.BO2_DEPTH;
  if (!D) return;
  const { findMap, step, image, diagram } = D;

  const map = findMap('black-ops-2-tranzit-green-run');
  if (!map) return;

  const pylon = image(diagram('TRANZIT PYLON · CORNFIELD ROUTE', [
    ['FROM FARM', 'Leave on the bus road toward Power Station'],
    ['ENTER CORN', 'Take the corn opening on the left before Power Station'],
    ['NACHT FORK', 'One branch reaches the Nacht prototype'],
    ['PYLON FORK', 'Other branch reaches the tall electrical transmission tower'],
    ['MAXIS', 'Two Turbines + Avogadro EMP'],
    ['RICHTOFEN', 'Break fully cooled Jet Gun + explosive zombie kills']
  ]), 'TranZit cornfield pylon route', 'The tall transmission tower is separate from the Nacht der Untoten prototype inside the same cornfield maze.');

  const maxisFlow = image(diagram('MAXIS · TOWER OF BABBLE', [
    ['1', 'Turn power ON long enough to release the Avogadro'],
    ['2', 'Turn power OFF when Maxis instructs'],
    ['3', 'Place two fresh Turbines beneath the pylon'],
    ['4', 'Lure Avogadro under tower and EMP him without disabling Turbines'],
    ['5', 'Take two working Turbines to two different green lamps'],
    ['6', 'Place both lamps simultaneously → orange tower']
  ]), 'Maxis branch overview', 'The final lamps can be any two different green street lamps. Bus Depot and Diner are easy because Denizens do not attack there.');

  const richtofenFlow = image(diagram('RICHTOFEN · TOWER OF BABBLE', [
    ['1', 'Keep power ON; Samuel must be present to hear progress'],
    ['2', 'Fully cool and break the Jet Gun beneath the pylon'],
    ['3', 'Kill 25 zombies under tower with reliable explosive damage'],
    ['4', 'Create Denizen portals if fewer than four players'],
    ['5', 'EMP four different green lamps within the same EMP window'],
    ['6', 'Blue tower + Tower of Babble achievement']
  ]), 'Richtofen branch overview', 'Four players are the reliable method. Two players each EMP one lamp, jump through a Denizen portal, and EMP a second lamp.');

  map.mainQuests = [
    {
      id: 'tower-of-babble-maxis',
      name: 'Tower of Babble — Maxis',
      players: '2–4 players in vanilla BO2',
      reward: 'Orange Maxis tower alignment and Tower of Babble achievement',
      summary: 'Release the Avogadro, shut the map power off, transfer him through two Turbines under the cornfield pylon, then route the stored energy through two green street lamps.',
      steps: [
        step('Build Turbines and obtain EMP Grenades before committing', 'Bus Depot and Mystery Box', 'Build at least two fresh Turbines in the Bus Depot starting room. Spin the Mystery Box until at least one player has EMP Grenades. Keep both EMP throws unused. If four players are present, carrying extra fresh Turbines makes replacement easier.', { tip: 'The Mystery Box initially spawns outside the Diner. Save enough points before leaving the early bus loop.' }),
        step('Turn the Power Station on and release the Avogadro', 'Power Station laboratory, fourth bus stop after Farm', 'Build the Power Switch from the lever, circuit board, and zombie arm. Pull the switch. Wait for the electrical chamber to open and the Avogadro to escape. Listen for Maxis to request that the power be shut down.', { success: 'The Avogadro can now spawn or travel around Green Run.' }),
        step('Turn the map power back off', 'Same completed Power Switch', 'Pull the switch again after Maxis speaks. Leave the map power off for the rest of this branch. Perk machines stop working, so buy essential perks beforehand.', { success: 'Maxis confirms the shutdown.', warning: 'Do not turn power back on during the pylon transfer unless recovering from a failed setup.' }),
        step('Reach the cornfield pylon', 'Cornfield between Farm and Power Station', 'From Farm, follow the road toward Power Station and enter the corn opening on the left before the Power Station stop. Navigate the maze to the tall electrical transmission tower, not the Nacht prototype.', { images: [pylon, maxisFlow] }),
        step('Spawn or lure the Avogadro to the pylon', 'Beneath the cornfield transmission tower', 'The Avogadro can spawn when the last zombie of a round dies while lightning is directly overhead. Keep a slow final zombie, wait for a thunderstorm, and end the round near the pylon. If he is already active elsewhere, lure him through the fog and corn instead.', { tip: 'The Avogadro follows the nearest player. Avoid knifing him before the Turbines are ready.' }),
        step('Place two fresh Turbines directly beneath the tower', 'Centre of the pylon footprint', 'Deploy two working Turbines close to the central NAV-table/pylon area. Wait for Maxis to acknowledge both portable power sources. If either Turbine flickers or Maxis says the power supply drained, replace it before continuing.', { success: 'Maxis asks for energy that is portable and alive.' }),
        step('EMP the Avogadro while both Turbines remain active', 'Directly under the pylon', 'Lure the Avogadro into the centre between the two Turbines. Throw an EMP close enough to destroy him but far enough that the EMP blast does not disable either Turbine. The electrical figure should vanish while both fan units continue spinning.', { success: 'Maxis confirms the living energy transfer and advances to the street-lamp step.', warning: 'If the EMP disables the Turbines or Maxis reports drained power, replace both Turbines and repeat the transfer with another Avogadro/EMP.' }),
        step('Carry the two working Turbines to two different green lamps', 'Any two green street lamps around Green Run', 'Pick up the two Turbines used beneath the pylon. Assign one player to each different green lamp. Bus Depot and Diner are simple choices because Denizens do not attack there, but any two separate lamps work.', { tip: 'With more than two players, escort each Turbine carrier through the fog so zombies do not destroy the equipment.' }),
        step('Place both Turbines under the lamps at the same time', 'Two separate green street lamps', 'Call a countdown and deploy both Turbines directly under their lamp posts. Keep them running until the orange energy leaves the lamps and travels toward the tower.', { success: 'The pylon glows orange, Maxis gives the completion quote, and Tower of Babble unlocks.', images: [maxisFlow] })
      ]
    },
    {
      id: 'tower-of-babble-richtofen',
      name: 'Tower of Babble — Richtofen',
      players: '2–4 players recommended; advanced solo is technically possible',
      reward: 'Blue Richtofen tower alignment and Tower of Babble achievement',
      summary: 'Keep power on, break a fully cooled Jet Gun beneath the pylon, feed it reliable explosive zombie kills, then EMP four different green lamps within one timing window.',
      steps: [
        step('Make sure Samuel Stuhlinger is in the lobby', 'Character selection at match start', 'Richtofen speaks only to Samuel during this route. The quest can progress with Samuel elsewhere, but the squad needs him nearby to hear confirmation and failure quotes. Restart if nobody is Samuel.', { warning: 'Without Samuel, players can continue blindly but cannot reliably know whether the Jet Gun and zombie-kill stages registered.' }),
        step('Build the Jet Gun and obtain EMP Grenades', 'Tunnel, Power Station, Nacht, Hunter’s Cabin, Town Bar, and Mystery Box', 'Collect all four Jet Gun parts using the Required Preparation guide and build it at the Town bar. At least two players should obtain EMP Grenades; four EMP holders are strongly recommended.', { images: [richtofenFlow] }),
        step('Turn power on and leave it on', 'Power Station laboratory', 'Build and activate the Power Switch. Do not turn it off for Richtofen. Wait until the Avogadro chamber and Richtofen/Maxis dialogue finish before leaving.'),
        step('Fully cool the Jet Gun before the attempt', 'Safe ground beneath the cornfield pylon', 'Equip the Jet Gun without firing and wait roughly 40–60 seconds until the left dial/weapon state is completely cooled. A weapon that appears unused can still begin partially heated.', { tip: 'Clear the final zombie and stage the squad before pulling the Jet Gun out.' }),
        step('Fire until the Jet Gun breaks under the pylon', 'Exact centre beneath the cornfield transmission tower', 'Stand under the pylon and hold the trigger continuously. Do not release it to cool. The weapon must overheat and explode into its four components while inside the tower footprint.', { success: 'Richtofen tells Samuel the obelisk is hot and the green lamps begin flickering.', warning: 'If Richtofen later says the obelisk is not hot, rebuild all four Jet Gun parts and repeat after a full cooldown.', images: [pylon, richtofenFlow] }),
        step('Kill 25 zombies with explosive damage beneath the tower', 'Inside the pylon footprint', 'Train zombies into the area directly under the tower and kill them with reliable explosive damage. Ray Gun and Ray Gun Mark II shots count; RPG, War Machine, Frag Grenades, Semtex, and similar explosions are safer than ordinary bullets. Keep Samuel inside or beside the footprint to hear progress.', { success: 'Richtofen says too much power is flowing and it must be reduced by a factor of four.', warning: 'Kills outside the pylon footprint do not count. If uncertain, continue explosive kills until the exact “reduce by four” quote plays.' }),
        step('Prepare four lamp positions', 'Four different green street lamps', 'With four EMP holders, assign one lamp per player. With two players, create Denizen portals under multiple green lamps first: let a Denizen latch onto the player, stand beneath a lamp, and wait for it to dig a ground portal. Each player needs one starting lamp and one destination lamp.'),
        step('EMP four different lamps within the same effect window', 'Four assigned green lamp posts', 'Four-player method: count down and throw one EMP at each lamp simultaneously. Two-player method: each player throws an EMP at the current lamp, immediately jumps through its Denizen portal, and throws the second EMP at the lamp where they emerge before the first EMP effect expires.', { success: 'Richtofen congratulates Samuel, the pylon glows blue, and Tower of Babble unlocks.', warning: 'Hitting the same lamp twice or arriving after the first EMP effect ends fails the attempt. Wait for Max Ammo and retry if necessary.', images: [richtofenFlow] })
      ]
    }
  ];
})();