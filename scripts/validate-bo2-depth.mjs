import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const requiredScripts = [
  'data.js', 'data-overrides.js', 'data-postfix.js', 'editorial-status.js',
  'bo1-audit.js', 'bo2-audit.js', 'bo3-audit.js', 'bo123-postfix.js',
  'bo2-depth-common.js', 'bo2-depth-tranzit.js', 'bo2-depth-tranzit-main.js',
  'bo2-depth-dierise.js', 'bo2-depth-mob.js', 'bo2-depth-buried.js',
  'bo2-depth-origins-staffs.js', 'bo2-depth-origins-map.js', 'bo2-depth-postfix.js'
];

for (const file of [...requiredScripts, 'bo2-depth-ui.js', 'bo2-depth-ui.css']) {
  if (!existsSync(resolve(root, file))) errors.push(`Missing BO2 depth file: ${file}`);
}

const index = readFileSync(resolve(root, 'index.html'), 'utf8');
for (const file of [...requiredScripts, 'bo2-depth-ui.js']) {
  if (!index.includes(`/${file}`)) errors.push(`index.html does not load ${file}`);
}
if (!index.includes('/bo2-depth-ui.css')) errors.push('index.html does not load bo2-depth-ui.css');

const positions = requiredScripts.map((file) => index.indexOf(`/${file}`));
for (let i = 1; i < positions.length; i += 1) {
  if (positions[i] <= positions[i - 1]) errors.push(`Incorrect script order around ${requiredScripts[i - 1]} and ${requiredScripts[i]}`);
}

const sandbox = {
  window: {},
  console,
  encodeURIComponent,
  decodeURIComponent,
  setTimeout,
  clearTimeout
};
vm.createContext(sandbox);
for (const file of requiredScripts) {
  try {
    vm.runInContext(readFileSync(resolve(root, file), 'utf8'), sandbox, { filename: file });
  } catch (error) {
    errors.push(`${file} failed to execute: ${error.message}`);
  }
}

const data = sandbox.window.DEAD_DROP_DATA;
if (!data?.games) errors.push('Guide data did not load');

const ids = [
  'black-ops-2-tranzit-green-run',
  'black-ops-2-nuketown-zombies',
  'black-ops-2-die-rise',
  'black-ops-2-mob-of-the-dead',
  'black-ops-2-buried',
  'black-ops-2-origins'
];
const maps = new Map();
for (const game of data?.games ?? []) {
  for (const map of game.maps ?? []) maps.set(map.id, map);
}

const imageThresholds = {
  'black-ops-2-tranzit-green-run': 8,
  'black-ops-2-nuketown-zombies': 1,
  'black-ops-2-die-rise': 4,
  'black-ops-2-mob-of-the-dead': 5,
  'black-ops-2-buried': 9,
  'black-ops-2-origins': 25
};

const allText = (map) => JSON.stringify(map);
const imageCount = (map) => [
  ...(map.mainQuests ?? []).flatMap((quest) => (quest.steps ?? []).flatMap((step) => step.images ?? [])),
  ...(map.requiredGuides ?? []).flatMap((guide) => (guide.steps ?? []).flatMap((step) => step.images ?? [])),
  ...(map.optionalSideQuests ?? []).flatMap((guide) => (guide.steps ?? []).flatMap((step) => step.images ?? []))
].length;

for (const id of ids) {
  const map = maps.get(id);
  if (!map) {
    errors.push(`Missing BO2 map: ${id}`);
    continue;
  }
  if (map.auditStatus !== 'beginner-depth') errors.push(`${map.name} is not marked beginner-depth`);
  if (map.status !== 'Beginner-depth audited') errors.push(`${map.name} has the wrong public audit label`);
  if (!Array.isArray(map.sources) || map.sources.length < 2) errors.push(`${map.name} needs multiple sources`);
  const domains = (map.sources ?? []).map((source) => source.url ?? '').join(' ');
  if (id !== 'black-ops-2-nuketown-zombies' && !domains.includes('callofdutyzombies.com')) errors.push(`${map.name} is missing Call of Duty Zombies guide sourcing`);
  if (!domains.includes('callofduty.fandom.com')) errors.push(`${map.name} is missing Call of Duty Wiki sourcing`);

  const requiredNames = new Set((map.requiredGuides ?? []).map((guide) => guide.name));
  for (const guide of map.optionalSideQuests ?? []) {
    if (requiredNames.has(guide.name)) errors.push(`${map.name} duplicates ${guide.name} in required and optional sections`);
  }

  for (const quest of map.mainQuests ?? []) {
    if (!quest.name || !quest.players || !quest.summary) errors.push(`${map.name} has an incomplete main-quest header`);
    for (const [index, step] of (quest.steps ?? []).entries()) {
      if (!step.title || !step.location || !step.body) errors.push(`${map.name} / ${quest.name} step ${index + 1} is missing title, location, or body`);
      if ((step.body ?? '').length < 80) errors.push(`${map.name} / ${quest.name} step ${index + 1} is too short for beginner-depth use`);
    }
  }
  for (const guide of [...(map.requiredGuides ?? []), ...(map.optionalSideQuests ?? [])]) {
    if (!guide.name || !guide.reward || !(guide.steps ?? []).length) errors.push(`${map.name} has an incomplete guide: ${guide.name ?? 'unnamed'}`);
    for (const [index, step] of (guide.steps ?? []).entries()) {
      if (!step.title || !step.location || !step.body) errors.push(`${map.name} / ${guide.name} step ${index + 1} is missing title, location, or body`);
      if ((step.body ?? '').length < 45) errors.push(`${map.name} / ${guide.name} step ${index + 1} is too short`);
    }
  }

  const images = [
    ...(map.mainQuests ?? []).flatMap((quest) => (quest.steps ?? []).flatMap((step) => step.images ?? [])),
    ...(map.requiredGuides ?? []).flatMap((guide) => (guide.steps ?? []).flatMap((step) => step.images ?? [])),
    ...(map.optionalSideQuests ?? []).flatMap((guide) => (guide.steps ?? []).flatMap((step) => step.images ?? []))
  ];
  if (images.length < imageThresholds[id]) errors.push(`${map.name} has only ${images.length} inline visuals; expected at least ${imageThresholds[id]}`);
  for (const visual of images) {
    if (!visual.src) errors.push(`${map.name} has an inline image without src`);
    if (visual.src?.startsWith('/')) {
      const local = resolve(root, visual.src.slice(1));
      if (!existsSync(local)) errors.push(`${map.name} references missing local image ${visual.src}`);
    } else if (!/^https:\/\//.test(visual.src ?? '') && !/^data:image\//.test(visual.src ?? '')) {
      errors.push(`${map.name} has unsupported image URL ${visual.src}`);
    }
  }
}

const requiredStrings = {
  'black-ops-2-tranzit-green-run': ['Zombie Shield — all part spawns', 'Hunter’s Cabin', '25 zombies', 'four different green lamps', 'BO2-Full-Solo-Mods'],
  'black-ops-2-nuketown-zombies': ['population counter', 'Marlton', 'Samantha’s Lullaby', 'mannequin head'],
  'black-ops-2-die-rise': ['Exactly 4 players', 'Trample Steam', 'Sliquifier', 'Mahjong', 'Krauss Refibrillator'],
  'black-ops-2-mob-of-the-dead': ['101', '386', '872', '481', 'Zombie Shield — every part spawn', 'Acid Gat Kit', 'motd_solo-compiled.gsc'],
  'black-ops-2-buried': ['DRY GULCHER SHAFT', 'LUNGER UNDERMINES', 'CONSUMPTION CROSS', 'GROUND BITER PITS', 'BONE ORCHARD VEIN', '84 targets', 'General Store buildables', 'bur1.png'],
  'black-ops-2-origins': ['11, 5, 9, 7, 6, 3, 4', '1-3-6', '3-5-7', '2-4-6', 'Zombie Shield — all nine part spawns', 'Maxis Drone — every part', 'G-Strike Beacon', 'One Inch Punch']
};
for (const [id, strings] of Object.entries(requiredStrings)) {
  const text = allText(maps.get(id));
  for (const value of strings) {
    if (!text.includes(value)) errors.push(`${maps.get(id)?.name ?? id} is missing required detail: ${value}`);
  }
}

for (const id of ['black-ops-2-tranzit-green-run', 'black-ops-2-die-rise', 'black-ops-2-mob-of-the-dead', 'black-ops-2-buried']) {
  const map = maps.get(id);
  if (!map?.soloMod?.downloadUrl || !map?.soloMod?.guideUrl) errors.push(`${map?.name ?? id} is missing verified Plutonium mod links`);
}
if (maps.get('black-ops-2-origins')?.soloMod) errors.push('Origins should not show a solo mod because the vanilla quest supports solo');
if (!/4 players/.test(maps.get('black-ops-2-die-rise')?.players ?? '')) errors.push('Die Rise does not clearly state four-player requirement');
if (!/4 players/.test(maps.get('black-ops-2-buried')?.players ?? '')) errors.push('Buried does not clearly state four-player requirement');
if (!/2–4 players/.test(maps.get('black-ops-2-mob-of-the-dead')?.players ?? '')) errors.push('Mob does not clearly state vanilla multiplayer requirement');

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  version: data.version,
  auditedMaps: ids.length,
  totalBO2MainRoutes: ids.reduce((sum, id) => sum + (maps.get(id).mainQuests ?? []).length, 0),
  totalBO2Guides: ids.reduce((sum, id) => sum + (maps.get(id).requiredGuides ?? []).length + (maps.get(id).optionalSideQuests ?? []).length, 0),
  totalInlineImages: ids.reduce((sum, id) => sum + imageCount(maps.get(id)), 0),
  archiveStats: data.stats
}, null, 2));