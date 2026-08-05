import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const scripts = [
  'data.js',
  'data-overrides.js',
  'data-postfix.js',
  'editorial-status.js',
  'bo1-audit.js',
  'bo2-audit.js',
  'bo3-audit.js',
  'bo123-postfix.js'
];
const errors = [];
const sandbox = { window: {} };
vm.createContext(sandbox);

for (const file of scripts) {
  const path = resolve(root, file);
  if (!existsSync(path)) {
    errors.push(`Missing audit script: ${file}`);
    continue;
  }
  try {
    vm.runInContext(readFileSync(path, 'utf8'), sandbox, { filename: file });
  } catch (error) {
    errors.push(`${file} failed to execute: ${error.message}`);
  }
}

const data = sandbox.window.DEAD_DROP_DATA;
if (!data?.games) errors.push('Audited data did not load');

const byId = new Map();
for (const game of data?.games ?? []) {
  for (const map of game.maps ?? []) byId.set(map.id, { game, map });
}

const auditedIds = [
  'black-ops-kino-der-toten',
  'black-ops-five',
  'black-ops-ascension',
  'black-ops-call-of-the-dead',
  'black-ops-shangri-la',
  'black-ops-moon',
  'black-ops-rezurrection-classics',
  'black-ops-2-tranzit-green-run',
  'black-ops-2-nuketown-zombies',
  'black-ops-2-die-rise',
  'black-ops-2-mob-of-the-dead',
  'black-ops-2-buried',
  'black-ops-2-origins',
  'black-ops-3-shadows-of-evil',
  'black-ops-3-the-giant',
  'black-ops-3-der-eisendrache',
  'black-ops-3-zetsubou-no-shima',
  'black-ops-3-gorod-krovi',
  'black-ops-3-revelations',
  'black-ops-3-bo3-nacht-der-untoten',
  'black-ops-3-bo3-verruckt',
  'black-ops-3-bo3-shi-no-numa',
  'black-ops-3-bo3-kino-der-toten',
  'black-ops-3-bo3-ascension',
  'black-ops-3-bo3-shangri-la',
  'black-ops-3-bo3-moon',
  'black-ops-3-bo3-origins'
];

const referencedAssets = new Set();
for (const id of auditedIds) {
  const entry = byId.get(id);
  if (!entry) {
    errors.push(`Missing audited map: ${id}`);
    continue;
  }
  const { map } = entry;
  if (map.auditStatus !== 'deep-audited') errors.push(`${map.name} is not marked deep-audited`);
  if (!Array.isArray(map.sources) || map.sources.length === 0) errors.push(`${map.name} has no verification sources`);
  if (!Array.isArray(map.requiredGuides)) errors.push(`${map.name} has no requiredGuides array`);
  if (!Array.isArray(map.optionalSideQuests)) errors.push(`${map.name} has no optionalSideQuests array`);

  const requiredNames = new Set((map.requiredGuides || []).map((guide) => guide.name));
  for (const optional of map.optionalSideQuests || []) {
    if (requiredNames.has(optional.name)) errors.push(`${map.name} duplicates required guide as optional: ${optional.name}`);
  }

  for (const quest of map.mainQuests || []) {
    if (!quest.id || !quest.name || !Array.isArray(quest.steps) || !quest.steps.length) {
      errors.push(`${map.name} has an incomplete main quest`);
      continue;
    }
    quest.steps.forEach((step, index) => {
      if (!step.title || !step.location || !step.body) errors.push(`${map.name} / ${quest.name} step ${index + 1} lacks title, location, or body`);
      for (const visual of step.images || []) if (visual.src?.startsWith('/')) referencedAssets.add(visual.src.slice(1));
    });
  }

  for (const guide of [...(map.requiredGuides || []), ...(map.optionalSideQuests || [])]) {
    if (!guide.name || !Array.isArray(guide.steps) || !guide.steps.length) errors.push(`${map.name} has an incomplete guide: ${guide.name || 'unnamed'}`);
    for (const step of guide.steps || []) {
      if (!step.title || !step.location || !step.body) errors.push(`${map.name} / ${guide.name} has a guide step without title, location, or body`);
      for (const visual of step.images || []) if (visual.src?.startsWith('/')) referencedAssets.add(visual.src.slice(1));
    }
  }
}

for (const asset of referencedAssets) {
  if (!existsSync(resolve(root, asset))) errors.push(`Missing inline visual: /${asset}`);
}

const index = readFileSync(resolve(root, 'index.html'), 'utf8');
for (const file of ['bo1-audit.js', 'bo2-audit.js', 'bo3-audit.js', 'bo123-postfix.js']) {
  if (!index.includes(`/${file}`)) errors.push(`index.html does not load ${file}`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

const audited = auditedIds.map((id) => byId.get(id)?.map.name).filter(Boolean);
console.log(JSON.stringify({
  auditedMaps: audited.length,
  maps: audited,
  archiveStats: data.stats,
  inlineAssetsChecked: referencedAssets.size
}, null, 2));
