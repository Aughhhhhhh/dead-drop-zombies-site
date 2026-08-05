import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const finalizerPath = resolve(root, 'any-player-ee-mod-finalize.js');
const indexPath = resolve(root, 'index.html');
const errors = [];

if (!existsSync(finalizerPath)) errors.push('Missing any-player-ee-mod-finalize.js');
if (!existsSync(indexPath)) errors.push('Missing index.html');

const finalizer = existsSync(finalizerPath) ? readFileSync(finalizerPath, 'utf8') : '';
const index = existsSync(indexPath) ? readFileSync(indexPath, 'utf8') : '';
const download = 'https://github.com/Hadi77KSA/Plutonium-T6-Any-Player-EE-Scripts/releases/latest/download/release.zip';

if (!finalizer.includes(download)) errors.push('Stable latest-release ZIP URL is missing');
if (!finalizer.includes('Download latest release ZIP')) errors.push('Direct download button label is missing');
if (!finalizer.includes('<code>zm_any_player_ee</code> folder')) errors.push('Corrected auto-load extraction instruction is missing');
if (!index.includes('/any-player-ee-mod-finalize.js')) errors.push('Direct-download finalizer is not loaded');
if (index.indexOf('/any-player-ee-mod-finalize.js') < index.indexOf('/any-player-ee-mod.js')) {
  errors.push('Direct-download finalizer loads before the mod page');
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(JSON.stringify({
  directLatestReleaseDownload: true,
  releaseFile: 'release.zip',
  sourceRepository: 'Hadi77KSA/Plutonium-T6-Any-Player-EE-Scripts'
}, null, 2));
