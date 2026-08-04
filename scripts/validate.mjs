import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "index.html", "styles-v2.css", "app-v2.js", "data.js", "data-overrides.js", "nav-fix.js",
  "vercel.json", "favicon.svg", "manifest.webmanifest", "robots.txt", "sitemap.xml",
  "assets/origins/rain-fire-seal.svg", "assets/origins/maxis-drone-pit.svg"
];
const errors = [];
for (const file of required) {
  if (!existsSync(resolve(root, file))) errors.push(`Missing required file: ${file}`);
}

const index = readFileSync(resolve(root, "index.html"), "utf8");
for (const ref of ["styles-v2.css", "data.js", "data-overrides.js", "app-v2.js", "nav-fix.js", "manifest.webmanifest", "favicon.svg"]) {
  if (!index.includes(ref)) errors.push(`index.html does not reference ${ref}`);
}
if (/Every ritual|Open Origins|Featured guide/i.test(index)) errors.push("Old placeholder homepage wording is still present");

for (const file of ["app-v2.js", "data-overrides.js", "nav-fix.js"]) {
  try { new vm.Script(readFileSync(resolve(root, file), "utf8"), { filename: file }); }
  catch (error) { errors.push(`${file} syntax error: ${error.message}`); }
}

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(readFileSync(resolve(root, "data.js"), "utf8"), sandbox, { filename: "data.js" });
vm.runInContext(readFileSync(resolve(root, "data-overrides.js"), "utf8"), sandbox, { filename: "data-overrides.js" });
const data = sandbox.window.DEAD_DROP_DATA;
if (!data || !Array.isArray(data.games)) errors.push("Guide data did not load");

const gameIds = new Set();
const mapIds = new Set();
let maps = 0;
let mainQuests = 0;
let sideQuests = 0;
let steps = 0;
let remoteCovers = 0;
for (const game of data?.games ?? []) {
  if (!game.id || !game.title) errors.push("Game is missing id or title");
  if (gameIds.has(game.id)) errors.push(`Duplicate game id: ${game.id}`);
  gameIds.add(game.id);
  if (/^https:\/\//.test(game.cover || "")) remoteCovers++;
  if (game.cover?.startsWith("/") && !existsSync(resolve(root, game.cover.slice(1)))) errors.push(`Missing cover: ${game.cover}`);

  for (const map of game.maps ?? []) {
    maps++;
    if (!map.id || !map.name) errors.push(`Map in ${game.title} is missing id or name`);
    if (mapIds.has(map.id)) errors.push(`Duplicate map id: ${map.id}`);
    mapIds.add(map.id);
    if (!Array.isArray(map.requiredGuides) || !Array.isArray(map.optionalSideQuests)) errors.push(`Guide classification missing: ${map.name}`);
    const classified = (map.requiredGuides?.length ?? 0) + (map.optionalSideQuests?.length ?? 0);
    if (classified !== (map.sideQuests?.length ?? 0)) errors.push(`Guide classification count mismatch: ${map.name}`);

    const questIds = new Set();
    for (const quest of map.mainQuests ?? []) {
      mainQuests++;
      if (!quest.id || !quest.name) errors.push(`Main quest in ${map.name} is missing id or name`);
      if (questIds.has(quest.id)) errors.push(`Duplicate quest id in ${map.name}: ${quest.id}`);
      questIds.add(quest.id);
      if (!Array.isArray(quest.steps) || !quest.steps.length) errors.push(`Main quest has no steps: ${map.name} / ${quest.name}`);
      steps += quest.steps?.length ?? 0;
      for (const step of quest.steps ?? []) {
        for (const image of step.images ?? []) {
          if (image.src?.startsWith("/") && !existsSync(resolve(root, image.src.slice(1)))) errors.push(`Missing inline visual: ${image.src}`);
        }
      }
    }
    for (const quest of map.sideQuests ?? []) {
      sideQuests++;
      if (!quest.name) errors.push(`Side quest in ${map.name} is missing a name`);
      if (!Array.isArray(quest.steps) || !quest.steps.length) errors.push(`Side quest has no steps: ${map.name} / ${quest.name}`);
      steps += quest.steps?.length ?? 0;
    }
    for (const visual of map.visuals ?? []) {
      if (visual.src?.startsWith("/") && !existsSync(resolve(root, visual.src.slice(1)))) errors.push(`Missing visual: ${visual.src}`);
    }
  }
}

if (remoteCovers < 10) errors.push(`Expected at least 10 real remote game covers, found ${remoteCovers}`);

const origins = data?.games.flatMap((game) => game.maps).find((map) => map.id === "black-ops-2-origins");
const requiredOrigins = new Set(origins?.requiredGuides?.map((guide) => guide.name));
for (const name of ["Fire Staff — Kagutsuchi’s Blood", "Lightning Staff — Kimat’s Bite", "Ice Staff — Ull’s Arrow", "Wind Staff — Boreas’ Fury", "G-Strike Beacon", "One Inch Punch"]) {
  if (!requiredOrigins.has(name)) errors.push(`Origins requirement misclassified: ${name}`);
}
const originsQuest = origins?.mainQuests?.find((quest) => quest.id === "little-lost-girl");
if (originsQuest?.steps?.length !== 8) errors.push("Origins main quest should contain eight ordered steps");
for (const index of [2, 3]) {
  const step = originsQuest?.steps?.[index];
  if (!step?.location || !step?.success || !step?.images?.length) errors.push(`Origins step ${index + 1} lacks location, success cue, or inline image`);
}

if (data?.stats) {
  const actual = { games: gameIds.size, maps, mainQuests, sideQuests, steps };
  for (const [key, value] of Object.entries(actual)) {
    if (data.stats[key] !== value) errors.push(`Stats mismatch for ${key}: expected ${value}, found ${data.stats[key]}`);
  }
}

if (errors.length) {
  console.error(errors.map((error) => `- ${error}`).join("\n"));
  process.exit(1);
}
console.log(JSON.stringify({ games: gameIds.size, maps, mainQuests, sideQuests, steps, remoteCovers, version: data.version }, null, 2));
