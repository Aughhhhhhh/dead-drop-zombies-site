import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const files = {
  origin: resolve(root, 'origins-quest-order-fix.js'),
  mod: resolve(root, 'any-player-ee-mod.js'),
  css: resolve(root, 'any-player-ee-mod.css'),
  index: resolve(root, 'index.html')
};

for (const [name, path] of Object.entries(files)) {
  if (!existsSync(path)) errors.push(`Missing ${name}: ${path}`);
}

const originCode = readFileSync(files.origin, 'utf8');
const modCode = readFileSync(files.mod, 'utf8');
const css = readFileSync(files.css, 'utf8');
const index = readFileSync(files.index, 'utf8');

for (const token of [
  'Secure the Keys',
  'Ascend from Darkness',
  'Rain Fire',
  'Unleash the Horde',
  'Skewer the Winged Beast',
  'Wield a Fist of Iron',
  'Raise Hell',
  'Freedom',
  'ten Panzers total',
  'qualifying hit is enough'
]) {
  if (!originCode.includes(token)) errors.push(`Origins canonical token missing: ${token}`);
}

for (const token of [
  '#/mods/bo2-any-player-ee',
  'black-ops-2-die-rise',
  'black-ops-2-buried',
  '%localappdata%\\Plutonium\\storage\\t6',
  'zm_any_player_ee.iwd',
  'scripts\\zm\\zm_highrise',
  'scripts\\zm\\zm_buried',
  'motd_solo.gsc',
  'flashScriptHashes; scriptHashes',
  'https://forum.plutonium.pw/topic/32568/release-zm-any-player-easter-egg-mods'
]) {
  if (!modCode.includes(token)) errors.push(`Any Player mod guide token missing: ${token}`);
}

for (const selector of ['.mod-guide-page', '.any-player-mod-banner', '.mod-install-steps', '.mod-compatibility-grid']) {
  if (!css.includes(selector)) errors.push(`Any Player mod style missing: ${selector}`);
}

if (!index.includes('/origins-quest-order-fix.js')) errors.push('Origins order fix is not loaded');
if (!index.includes('/any-player-ee-mod.js')) errors.push('Any Player mod page script is not loaded');
if (!index.includes('/any-player-ee-mod.css')) errors.push('Any Player mod page stylesheet is not loaded');
if (index.indexOf('/origins-quest-order-fix.js') > index.indexOf('/bo2-source-media-overhaul.js')) {
  errors.push('Origins order fix must load before BO2 source media matching');
}
if (index.indexOf('/any-player-ee-mod.js') < index.indexOf('/app-v2.js')) {
  errors.push('Any Player mod UI must load after the main renderer');
}

const scripts = [
  'data.js', 'data-overrides.js', 'data-postfix.js', 'editorial-status.js',
  'bo1-audit.js', 'bo2-audit.js', 'bo3-audit.js', 'bo123-postfix.js',
  'bo2-depth-common.js', 'bo2-depth-tranzit.js', 'bo2-depth-tranzit-main.js',
  'bo2-depth-dierise.js', 'bo2-depth-mob.js', 'bo2-depth-buried.js',
  'bo2-depth-origins-staffs.js', 'bo2-depth-origins-map.js', 'bo2-depth-polish.js',
  'bo2-depth-postfix.js', 'origins-quest-order-fix.js'
];

const decodeEntities = (value = '') => String(value)
  .replaceAll('&amp;', '&')
  .replaceAll('&lt;', '<')
  .replaceAll('&gt;', '>')
  .replaceAll('&quot;', '"')
  .replaceAll('&#039;', "'")
  .replace(/&#(\d+);/g, (_, code) => String.fromCharCode(Number(code)));

const sandbox = {
  window: {}, console, encodeURIComponent, decodeURIComponent,
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

const origins = (sandbox.window.DEAD_DROP_DATA?.games || [])
  .flatMap((game) => game.maps || [])
  .find((map) => map.id === 'black-ops-2-origins');

if (!origins) {
  errors.push('Origins map missing after data load');
} else {
  const quest = origins.mainQuests?.find((entry) => entry.id === 'little-lost-girl');
  const expected = [
    'Secure the Keys',
    'Ascend from Darkness',
    'Rain Fire',
    'Unleash the Horde',
    'Skewer the Winged Beast',
    'Wield a Fist of Iron',
    'Raise Hell',
    'Freedom'
  ];

  if (!quest) errors.push('Little Lost Girl quest missing');
  else {
    if (quest.steps.length !== expected.length) errors.push(`Expected 8 canonical Origins stages, found ${quest.steps.length}`);
    expected.forEach((title, index) => {
      if (!quest.steps[index]?.title.includes(title)) errors.push(`Origins stage ${index + 1} is not ${title}`);
    });

    const firstText = `${quest.steps[0]?.title} ${quest.steps[0]?.body}`;
    if (/Maxis Drone|G-Strike|One Inch Punch/i.test(firstText)) {
      errors.push('Secure the Keys still dumps later-stage equipment into the opening step');
    }
    if (!/G-Strike/i.test(quest.steps[2]?.body || '')) errors.push('Rain Fire does not teach the G-Strike dependency');
    if (!/Maxis Drone/i.test(quest.steps[3]?.body || '')) errors.push('Unleash the Horde does not teach the Maxis Drone dependency');
    if (!/ten Panzer/i.test(quest.steps[3]?.body || '')) errors.push('Unleash the Horde does not specify ten Panzers total');
    if (!/One Inch Punch/i.test(quest.steps[5]?.body || '')) errors.push('Wield a Fist of Iron does not teach One Inch Punch at the correct stage');
    if (!/qualifying hit is enough/i.test(quest.steps[5]?.body || '')) errors.push('Iron Fist step still implies every target must be killed');
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  originsStages: 8,
  canonicalOrder: true,
  laterRequirementsAttachedToCorrectStages: true,
  anyPlayerModPage: true,
  fourPlayerQuestLinks: ['Die Rise', 'Buried'],
  releaseThread: 'Plutonium topic 32568'
}, null, 2));
