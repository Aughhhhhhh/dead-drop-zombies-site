import { existsSync, readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import vm from "node:vm";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const required = [
  "index.html", "styles.css", "app.js", "data.js", "vercel.json",
  "favicon.svg", "manifest.webmanifest", "robots.txt", "sitemap.xml"
];
const errors = [];
for (const file of required) {
  if (!existsSync(resolve(root, file))) errors.push(`Missing required file: ${file}`);
}

const index = readFileSync(resolve(root, "index.html"), "utf8");
for (const ref of ["styles.css", "data.js", "app.js", "manifest.webmanifest", "favicon.svg"]) {
  if (!index.includes(ref)) errors.push(`index.html does not reference ${ref}`);
}
if (/Every ritual|Open Origins|Featured guide/i.test(index)) {
  errors.push("Old placeholder homepage wording is still present");
}

const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(readFileSync(resolve(root, "data.js"), "utf8"), sandbox, { filename: "data.js" });
const data = sandbox.window.DEAD_DROP_DATA;
if (!data || !Array.isArray(data.games)) errors.push("Guide data did not load");

const gameIds = new Set();
const mapIds = new Set();
let maps = 0;
let mainQuests = 0;
let sideQuests = 0;
let steps = 0;
for (const game of data?.games ?? []) {
  if (!game.id || !game.title) errors.push("Game is missing id or title");
  if (gameIds.has(game.id)) errors.push(`Duplicate game id: ${game.id}`);
  gameIds.add(game.id);
  if (game.cover?.startsWith("/")) {
    const local = resolve(root, game.cover.slice(1));
    if (!existsSync(local)) errors.push(`Missing cover: ${game.cover}`);
  }
  for (const map of game.maps ?? []) {
    maps++;
    if (!map.id || !map.name) errors.push(`Map in ${game.title} is missing id or name`);
    if (mapIds.has(map.id)) errors.push(`Duplicate map id: ${map.id}`);
    mapIds.add(map.id);
    const questIds = new Set();
    for (const quest of map.mainQuests ?? []) {
      mainQuests++;
      if (!quest.id || !quest.name) errors.push(`Main quest in ${map.name} is missing id or name`);
      if (questIds.has(quest.id)) errors.push(`Duplicate quest id in ${map.name}: ${quest.id}`);
      questIds.add(quest.id);
      if (!Array.isArray(quest.steps) || !quest.steps.length) errors.push(`Main quest has no steps: ${map.name} / ${quest.name}`);
      steps += quest.steps?.length ?? 0;
    }
    for (const quest of map.sideQuests ?? []) {
      sideQuests++;
      if (!quest.name) errors.push(`Side quest in ${map.name} is missing a name`);
      if (!Array.isArray(quest.steps) || !quest.steps.length) errors.push(`Side quest has no steps: ${map.name} / ${quest.name}`);
      steps += quest.steps?.length ?? 0;
    }
    for (const visual of map.visuals ?? []) {
      if (visual.src?.startsWith("/")) {
        const local = resolve(root, visual.src.slice(1));
        if (!existsSync(local)) errors.push(`Missing visual: ${visual.src}`);
      }
    }
  }
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
console.log(JSON.stringify({ games: gameIds.size, maps, mainQuests, sideQuests, steps }, null, 2));
