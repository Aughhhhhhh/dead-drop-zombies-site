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
  'bo2-depth-postfix.js', 'bo2-source-media-overhaul.js'
];

for (const file of scripts) {
  if (!existsSync(resolve(root, file))) errors.push(`Missing data script: ${file}`);
}

const index = readFileSync(resolve(root, 'index.html'), 'utf8');
if (!index.includes('/bo2-source-media-overhaul.js')) errors.push('index.html does not load bo2-source-media-overhaul.js');
if (index.indexOf('/bo2-source-media-overhaul.js') < index.indexOf('/bo2-depth-postfix.js')) errors.push('Source-media overhaul loads before the BO2 depth data is complete');
if (index.indexOf('/bo2-source-media-overhaul.js') > index.indexOf('/app-v2.js')) errors.push('Source-media overhaul loads after the renderer');

const decodeEntities = (value = '') => String(value)
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&#039;', "'")
  .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));

const sandbox = {
  window: {},
  console,
  encodeURIComponent,
  decodeURIComponent,
  setTimeout,
  clearTimeout,
  document: {
    createElement() {
      return {
        value: '',
        set innerHTML(value) { this.value = decodeEntities(value); },
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
    errors.push(`${file} failed to execute: ${error.message}`);
  }
}

const data = sandbox.window.DEAD_DROP_DATA;
const bo2Ids = new Set([
  'black-ops-2-tranzit-green-run', 'black-ops-2-nuketown-zombies',
  'black-ops-2-die-rise', 'black-ops-2-mob-of-the-dead',
  'black-ops-2-buried', 'black-ops-2-origins'
]);
const maps = [];
for (const game of data?.games ?? []) {
  for (const map of game.maps ?? []) if (bo2Ids.has(map.id)) maps.push(map);
}
if (maps.length !== 6) errors.push(`Expected 6 BO2 maps, found ${maps.length}`);

const stepsFor = (map) => [
  ...(map.mainQuests ?? []).flatMap((quest) => quest.steps ?? []),
  ...(map.requiredGuides ?? []).flatMap((guide) => guide.steps ?? []),
  ...(map.optionalSideQuests ?? []).flatMap((guide) => guide.steps ?? [])
];
const imagesFor = (map) => stepsFor(map).flatMap((step) => step.images ?? []);
const isGenerated = (src = '') => src.startsWith('data:image/svg+xml') || src.startsWith('/assets/bo2/') || src.startsWith('/assets/origins/');

let sourceMedia = 0;
let searchableReferences = 0;
let sourceLinkedSteps = 0;
for (const map of maps) {
  if (!map.mediaPolicy?.includes('generated route diagrams removed')) errors.push(`${map.name} is missing the media policy`);
  if (!map.sourceGuideIndex) errors.push(`${map.name} is missing its primary source index`);
  for (const step of stepsFor(map)) {
    for (const image of step.images ?? []) {
      if (isGenerated(image.src ?? '')) errors.push(`${map.name} still contains generated visual ${image.src}`);
      if (image.creditUrl) sourceMedia += 1;
    }
    for (const reference of step.references ?? []) {
      searchableReferences += 1;
      if (!(reference.rows ?? []).length) errors.push(`${map.name} has an empty searchable reference: ${reference.title}`);
    }
    if (step.sourceUrl) sourceLinkedSteps += 1;
    else errors.push(`${map.name} / ${step.title || 'unnamed step'} is missing a source link`);
  }
}

const buried = maps.find((map) => map.id === 'black-ops-2-buried');
const buriedText = JSON.stringify(buried);
const buriedImageSources = imagesFor(buried).map((image) => image.src ?? '');
for (const phrase of ['DRY GULCHER SHAFT', 'LUNGER UNDERMINES', 'CONSUMPTION CROSS', 'GROUND BITER PITS', 'BONE ORCHARD VEIN']) {
  if (!buriedText.includes(phrase)) errors.push(`Buried is missing solved phrase ${phrase}`);
}
if (!buriedImageSources.some((src) => src.includes('images.saymedia-content.com'))) errors.push('Buried is not using the solved five-pattern reference image');
if (buriedImageSources.some((src) => src.includes('bur1.png'))) errors.push('Buried still renders the alphabet cipher-key image instead of the solved reference');

const origins = maps.find((map) => map.id === 'black-ops-2-origins');
const originsText = JSON.stringify(origins);
for (const media of ['GIANTBUTTON.gif', 'OPENTHEPIT.gif', 'INTOTHEPIT.gif', 'FISTS.gif']) {
  if (!originsText.includes(media)) errors.push(`Origins is missing source gameplay media ${media}`);
}
for (const page of ['rain-fire-r5', 'unleash-the-horde-r6', 'wield-a-fist-of-iron-r8', 'freedom-r10']) {
  if (!originsText.includes(page)) errors.push(`Origins is missing source page ${page}`);
}

const css = readFileSync(resolve(root, 'bo2-depth-ui.css'), 'utf8');
if (!css.includes('grid-template-columns:minmax(0,900px)')) errors.push('Gameplay media is not constrained to a readable single-column layout');
if (!css.includes('.depth-text-reference')) errors.push('Searchable reference styling is missing');

if (sourceMedia < 8) errors.push(`Only ${sourceMedia} source-attributed media items remain; expected at least 8`);
if (searchableReferences < 20) errors.push(`Only ${searchableReferences} searchable reference blocks were created; expected at least 20`);
if (sourceLinkedSteps < 150) errors.push(`Only ${sourceLinkedSteps} BO2 steps have source links; expected at least 150`);

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  version: data.version,
  bo2Maps: maps.length,
  sourceLinkedSteps,
  searchableReferences,
  sourceMedia,
  generatedVisualsRemaining: 0,
  solvedBuriedReference: true
}, null, 2));