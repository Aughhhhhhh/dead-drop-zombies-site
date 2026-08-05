import { existsSync, readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const jsPath = resolve(root, 'bo2-inline-fix.js');
const cssPath = resolve(root, 'bo2-inline-fix.css');
const indexPath = resolve(root, 'index.html');

for (const path of [jsPath, cssPath, indexPath]) {
  if (!existsSync(path)) errors.push(`Missing required file: ${path}`);
}

const js = readFileSync(jsPath, 'utf8');
const css = readFileSync(cssPath, 'utf8');
const index = readFileSync(indexPath, 'utf8');

for (const token of [
  'integrateRequiredTutorials(map)',
  'renderGuideTutorial',
  'ensureTutorialZone',
  'addRequirementChecklist',
  'FULL TUTORIAL FOR THIS STEP',
  'Everything needed to complete this step',
  "document.querySelector('.guide-sidebar a[href=\"#required\"]')?.remove()"
]) {
  if (!js.includes(token)) errors.push(`Inline tutorial implementation is missing: ${token}`);
}

if (!/integrateRequiredTutorials\(map\);\s*if \(BO2_IDS\.has\(map\.id\)\)/s.test(js)) {
  errors.push('Required-guide integration is not global before BO2-only media handling');
}
if (js.includes("guideNode.open = false") || js.includes("wrapper.appendChild(guideNode)")) {
  errors.push('Old collapsed/moved accordion implementation is still present');
}

for (const selector of [
  '.step-tutorial-zone',
  '.inline-map-requirements',
  '.inline-required-guide',
  '.inline-tutorial-step',
  '.inline-tutorial-media'
]) {
  if (!css.includes(selector)) errors.push(`Missing inline tutorial style: ${selector}`);
}
if (!index.includes('/bo2-inline-fix.js') || !index.includes('/bo2-inline-fix.css')) {
  errors.push('The global inline tutorial assets are not loaded by index.html');
}

const scripts = [
  'data.js', 'data-overrides.js', 'data-postfix.js', 'editorial-status.js',
  'bo1-audit.js', 'bo2-audit.js', 'bo3-audit.js', 'bo123-postfix.js',
  'bo2-depth-common.js', 'bo2-depth-tranzit.js', 'bo2-depth-tranzit-main.js',
  'bo2-depth-dierise.js', 'bo2-depth-mob.js', 'bo2-depth-buried.js',
  'bo2-depth-origins-staffs.js', 'bo2-depth-origins-map.js', 'bo2-depth-polish.js',
  'bo2-depth-postfix.js', 'bo2-source-media-overhaul.js', 'bo2-source-media-cleanup.js'
];

const decodeEntities = (value = '') => String(value)
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&#039;', "'")
  .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));

const sandbox = {
  window: {}, console, encodeURIComponent, decodeURIComponent, setTimeout, clearTimeout,
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
  const path = resolve(root, file);
  if (!existsSync(path)) {
    errors.push(`Missing data script: ${file}`);
    continue;
  }
  try {
    vm.runInContext(readFileSync(path, 'utf8'), sandbox, { filename: file });
  } catch (error) {
    errors.push(`${file} failed to execute: ${error.message}`);
  }
}

const maps = (sandbox.window.DEAD_DROP_DATA?.games || []).flatMap((game) => game.maps || []);
const eligible = maps.filter((map) => (map.mainQuests || []).length && (map.requiredGuides || []).length);
if (eligible.length < 10) errors.push(`Only ${eligible.length} maps have testable required-guide integration`);

let guides = 0;
let quests = 0;
for (const map of eligible) {
  quests += map.mainQuests.length;
  for (const guide of map.requiredGuides) {
    guides += 1;
    const name = String(guide.name || '').toLowerCase();
    const applicable = map.mainQuests.some((quest) => {
      const questName = String(quest.name || '').toLowerCase();
      for (const branch of ['richtofen', 'maxis']) {
        if (name.includes(branch) && !questName.includes(branch)) return false;
      }
      return (quest.steps || []).length > 0;
    });
    if (!applicable) errors.push(`${map.name}: ${guide.name} cannot be attached to any main quest`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  mapsWithInlineTutorials: eligible.length,
  mainQuestRoutesCovered: quests,
  requiredGuidesCovered: guides,
  standaloneRequiredSectionHidden: true,
  tutorialsExpandedByDefault: true
}, null, 2));