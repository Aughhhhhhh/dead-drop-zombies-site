import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const scripts = [
  'data.js', 'data-overrides.js', 'data-postfix.js', 'editorial-status.js',
  'bo1-audit.js', 'bo2-audit.js', 'bo3-audit.js', 'bo123-postfix.js',
  'bo2-depth-common.js', 'bo2-depth-tranzit.js', 'bo2-depth-tranzit-main.js',
  'bo2-depth-dierise.js', 'bo2-depth-mob.js', 'bo2-depth-buried.js',
  'bo2-depth-origins-staffs.js', 'bo2-depth-origins-map.js', 'bo2-depth-polish.js',
  'bo2-depth-postfix.js', 'bo2-source-media-overhaul.js', 'bo2-source-media-cleanup.js',
  'bo2-inline-flow.js'
];

for (const file of [...scripts, 'api/media.js', 'bo2-inline-flow.css']) {
  if (!existsSync(resolve(root, file))) errors.push(`Missing inline-flow file: ${file}`);
}

const index = readFileSync(resolve(root, 'index.html'), 'utf8');
for (const file of ['bo2-inline-flow.js', 'bo2-inline-flow.css']) {
  if (!index.includes(`/${file}`)) errors.push(`index.html does not load ${file}`);
}
if (index.indexOf('/bo2-inline-flow.js') < index.indexOf('/bo2-source-media-cleanup.js')) errors.push('BO2 inline flow loads before source-media cleanup');
if (index.indexOf('/bo2-inline-flow.js') > index.indexOf('/app-v2.js')) errors.push('BO2 inline flow loads after app renderer');

const sandbox = {
  window: {}, console, URL, encodeURIComponent, decodeURIComponent,
  location: { origin: 'https://dead-drop-zombies.vercel.app' },
  setTimeout, clearTimeout,
  document: {
    createElement() {
      return {
        value: '',
        set innerHTML(value) { this.value = String(value); },
        get innerHTML() { return this.value; }
      };
    }
  }
};
vm.createContext(sandbox);
for (const file of scripts) {
  try {
    vm.runInContext(readFileSync(resolve(root, file), 'utf8'), sandbox, { filename: file });
  } catch (error) {
    errors.push(`${file} failed: ${error.message}`);
  }
}

const data = sandbox.window.DEAD_DROP_DATA;
const ids = new Set([
  'black-ops-2-tranzit-green-run', 'black-ops-2-nuketown-zombies',
  'black-ops-2-die-rise', 'black-ops-2-mob-of-the-dead',
  'black-ops-2-buried', 'black-ops-2-origins'
]);
const maps = data.games.flatMap((game) => game.maps || []).filter((map) => ids.has(map.id));
if (maps.length !== 6) errors.push(`Expected 6 BO2 maps, found ${maps.length}`);

let integratedGuides = 0;
let proxiedMedia = 0;
let references = 0;
for (const map of maps) {
  if ((map.requiredGuides || []).length) errors.push(`${map.name} still exposes separate required-guide accordions`);
  if ((map.requirements || []).length) errors.push(`${map.name} still exposes a separate map requirements section`);

  for (const quest of map.mainQuests || []) {
    if (!(quest.startingRequirements || []).length) errors.push(`${map.name} / ${quest.name} is missing integrated starting requirements`);
    for (const step of quest.steps || []) {
      integratedGuides += (step.inlineGuides || []).length;
      for (const reference of step.references || []) {
        references += 1;
        const rows = reference.rows || [];
        if (rows.length >= 4 && rows.every((row, index) => String(row.label || '') === String(index + 1).padStart(2, '0'))) {
          errors.push(`${map.name} still has a broken sequential generated reference: ${reference.title}`);
        }
      }
      for (const image of step.images || []) {
        if (image.originalSrc?.includes('callofdutyzombies.com') || image.originalSrc?.includes('images.saymedia-content.com')) {
          if (!String(image.src).startsWith('/api/media?src=')) errors.push(`${map.name} media is not proxied: ${image.originalSrc}`);
          else proxiedMedia += 1;
        }
      }
      for (const guide of step.inlineGuides || []) {
        for (const guideStep of guide.steps || []) {
          for (const reference of guideStep.references || []) {
            references += 1;
            const rows = reference.rows || [];
            if (rows.length >= 4 && rows.every((row, index) => String(row.label || '') === String(index + 1).padStart(2, '0'))) {
              errors.push(`${map.name} inline guide still has a broken generated reference: ${reference.title}`);
            }
          }
          for (const image of guideStep.images || []) {
            if (image.originalSrc?.includes('callofdutyzombies.com') || image.originalSrc?.includes('images.saymedia-content.com')) {
              if (!String(image.src).startsWith('/api/media?src=')) errors.push(`${map.name} inline media is not proxied: ${image.originalSrc}`);
              else proxiedMedia += 1;
            }
          }
        }
      }
    }
  }
}

const buried = maps.find((map) => map.id === 'black-ops-2-buried');
const buriedSteps = [
  ...(buried.mainQuests || []).flatMap((quest) => quest.steps || []),
  ...(buried.optionalSideQuests || []).flatMap((guide) => guide.steps || []),
  ...(buried.mainQuests || []).flatMap((quest) => (quest.steps || []).flatMap((step) => (step.inlineGuides || []).flatMap((guide) => guide.steps || [])))
];
const cipherStep = buriedSteps.find((step) => /cipher|three wall lines|tunnel signs/i.test(`${step.title || ''} ${step.body || ''}`));
if (!cipherStep) errors.push('Buried cipher step not found');
else {
  const exact = (cipherStep.images || []).find((image) => image.title === 'Exact solved Buried cipher reference');
  if (!exact) errors.push('Buried does not use the exact solved cipher image');
  else if (!exact.originalSrc?.includes('MTc0NDU1MzgyNzg1MTQwMDcy')) errors.push('Buried exact cipher image uses the wrong source asset');
  if (!(cipherStep.references || []).some((reference) => reference.title === 'Cipher answer lookup')) errors.push('Buried cipher text lookup is missing');
}

const origins = maps.find((map) => map.id === 'black-ops-2-origins');
const originsText = JSON.stringify(origins);
for (const filename of ['GIANTBUTTON.gif', 'OPENTHEPIT.gif', 'INTOTHEPIT.gif', 'FISTS.gif']) {
  if (!originsText.includes(filename)) errors.push(`Origins is missing embedded gameplay media ${filename}`);
}
if (integratedGuides < 20) errors.push(`Only ${integratedGuides} required guides were integrated into main steps`);
if (proxiedMedia < 8) errors.push(`Only ${proxiedMedia} source media items use the same-site proxy`);
if (!references) errors.push('No searchable references remain');

const api = readFileSync(resolve(root, 'api/media.js'), 'utf8');
for (const token of ['ALLOWED_HOSTS', 'Content-Type', 'Cache-Control', '12 * 1024 * 1024']) {
  if (!api.includes(token)) errors.push(`Media proxy is missing safety token: ${token}`);
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  version: data.version,
  bo2Maps: maps.length,
  integratedGuides,
  proxiedMedia,
  searchableReferences: references,
  separateRequiredAccordions: 0,
  exactBuriedCipher: true
}, null, 2));
