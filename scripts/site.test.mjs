import assert from "node:assert/strict";
import { readFile, access, readdir } from "node:fs/promises";
import { test } from "node:test";
import {
  categories,
  escapeHtml,
  normalize,
  filterMaps,
  readProgress,
  parseRoute,
  externalUrl,
  expandCommunityGuides,
} from "../core.js";

const readJson = async (file) =>
  JSON.parse(
    await readFile(new URL(`../data/${file}`, import.meta.url), "utf8"),
  );
const [catalog, classic, modern, extra, aw, community, completionClassic, completionModern, completionModes, superQuests, researched, auditClassic, auditModern, auditModes, references, media, sourceGaps, coverageGaps] =
  await Promise.all(
    [
      "catalog.json",
      "guides-classic.json",
      "guides-modern.json",
      "guides-extra.json",
      "guides-aw.json",
      "guides-community.json",
      "guides-completion-classic.json",
      "guides-completion-modern.json",
      "guides-completion-modes.json",
      "guides-super-ee-doa4.json",
      "guides-goal-root.json",
      "guides-goal-classic.json",
      "guides-goal-modern.json",
      "guides-goal-modes.json",
      "references.json",
      "media.json",
      "source-gaps.json",
      "coverage-gaps.json",
    ].map(readJson),
  );
const maps = catalog.games.flatMap((game) => game.maps);
const guides = [...classic, ...modern, ...extra, ...aw, ...completionClassic, ...completionModern, ...completionModes, ...superQuests, ...researched, ...auditClassic, ...auditModern, ...auditModes, ...expandCommunityGuides(community)];

test("map-specific corrections preserve progress IDs and other editions", () => {
  const sourceSteps = [{ title: "Source route", body: "Original shared instructions" }];
  const correctedSteps = [{ title: "Corrected route", body: "Checked edition instructions" }];
  const topic = { id: "shared-topic", mapIds: ["waw-verruckt", "bo3-verruckt"], steps: sourceSteps,
    mapOverrides: { "waw-verruckt": { steps: correctedSteps, players: "1–4 players" } } };
  const [original, remaster] = expandCommunityGuides([topic]);
  assert.equal(original.id, "waw-verruckt-community-shared-topic");
  assert.deepEqual(original.steps, correctedSteps);
  assert.deepEqual(remaster.steps, sourceSteps);
  assert.equal(remaster.id, "bo3-verruckt-community-shared-topic");
  assert.equal(remaster.players, undefined);
  assert.deepEqual(topic.steps, sourceSteps);
});

test("catalog and walkthrough IDs stay linked and unique", () => {
  assert.equal(
    new Set(catalog.games.map((game) => game.id)).size,
    catalog.games.length,
  );
  assert.equal(new Set(maps.map((map) => map.id)).size, maps.length);
  assert.equal(new Set(guides.map((guide) => guide.id)).size, guides.length);
  assert.ok(maps.every((map) => guides.some((guide) => guide.mapId === map.id)), "Every catalog entry needs in-site instructions");
  for (const map of maps) {
    assert.match(map.id, /^[a-z0-9-]+$/);
    assert.ok(map.name && map.summary && map.mode && map.questNote);
    assert.ok(map.sources.length, `Missing sources: ${map.id}`);
    for (const source of map.sources)
      assert.ok(externalUrl(source.url), source.url);
  }
  for (const guide of guides) {
    assert.ok(
      maps.some((map) => map.id === guide.mapId),
      `Unknown map: ${guide.mapId}`,
    );
    assert.ok(Object.hasOwn(categories, guide.category), guide.id);
    assert.ok(
      guide.title &&
        guide.players &&
        guide.summary &&
        guide.reward &&
        guide.checked,
    );
    assert.ok(
      guide.requirements.length && guide.sources.length && guide.steps.length,
    );
    assert.equal(
      new Set(guide.steps.map((step) => step.title)).size,
      guide.steps.length,
      `Repeated step title: ${guide.id}`,
    );
    for (const step of guide.steps) {
      assert.ok(step.title && step.body && step.body.length >= (guide.sourceQuote ? 3 : 30), guide.id);
      if (step.researchSource) assert.ok(externalUrl(step.researchSource), guide.id);
      if (guide.sourceQuote && !step.original) {
        assert.ok(externalUrl(guide.sourceQuote) && step.html, guide.id);
        assert.doesNotMatch(step.html, /<script|<iframe|<style|\son\w+\s*=|javascript:|data:|cite|CHANGE ME|\bTBD\b|\bTODO\b/i, guide.id);
        for (const [, href] of step.html.matchAll(/href="([^"]+)"/g))
          assert.ok(!href || href.startsWith("https://"), href);
      }
    }
    for (const source of guide.sources)
      assert.ok(externalUrl(source.url), source.url);
    for (const id of guide.relatedGuideIds || [])
      assert.ok(id !== guide.id && guides.some((other) => other.id === id), id);
  }
});

test("community routes keep complete upgrade details, tables and version scopes", () => {
  const balmung = community.find((guide) => guide.title === "Balmung (Shadow)");
  assert.ok(balmung.steps.some((step) => step.html.includes("<table>") && step.body.includes("Scorpion")));
  for (const title of ["Void Bow", "Fire Bow", "Lightning/Storm Bow", "Wolf Bow"])
    assert.ok(community.find((guide) => guide.title === title)?.steps.length >= 6, title);
  const fireStaff = community.find((guide) => guide.title === "Staff of Fire");
  assert.ok(fireStaff.steps.some((step) => step.body.includes("red") && step.body.includes("20 Zombie")));
  const samantha = community.filter((guide) => /Samantha's Lullaby/.test(guide.title));
  assert.ok(samantha.length >= 5);
  assert.ok(samantha.every((guide) => guide.mapIds.every((id) => id.startsWith("bo3-"))));
  for (const guide of community) {
    const edition = guide.title.match(/\b(?:BO([123])|Black Ops ([123]))\b/i);
    if (edition)
      assert.ok(guide.mapIds.every((id) => id.startsWith(`bo${edition[1] || edition[2]}-`)), guide.id);
  }
  assert.deepEqual(community.find((guide) => guide.id === "shi-no-numa-easter-eggs-free-wunderwaffe-dg-2-ios").mapIds, ["waw-mobile-shi-no-numa"]);
  for (const id of ["nacht-der-untoten-special-weapons-monkey-bombs", "verruckt-special-weapons-monkey-bombs"])
    assert.ok(community.find((guide) => guide.id === id).mapIds.every((mapId) => !mapId.startsWith("waw-")), id);
  assert.deepEqual(community.find((guide) => guide.id === "verruckt-easter-eggs-the-female-statue-ee").mapIds, ["bo3-verruckt"]);
  const nachtCabinet = guides.find((guide) => guide.mapId === "bo3-nacht-der-untoten" && guide.title === "Sniper Cabinet (Zombies Chronicles)");
  assert.ok(nachtCabinet?.steps.some((step) => step.body.includes("5000") && step.body.includes("Locus")));
  assert.ok(!guides.some((guide) => guide.mapId === "bo3-nacht-der-untoten" && guide.title === "Sniper Cabinet"));
  for (const id of ["wwii-into-the-storm", "wwii-across-the-depths", "wwii-beneath-the-ice"])
    assert.ok(guides.some((guide) => guide.mapId === id && guide.category === "main"), id);
  const kowakujo = community.find((guide) => guide.id === "kowakujo-main-quest-main-quest");
  assert.ok(kowakujo.steps.some((step) => step.original && step.title.includes("Phase three")));
  assert.equal(kowakujo.sourceOmissions.length, 0);
  assert.ok(!references.some((reference) => reference.url.endsWith("/shangri-la/")), "Disabled source must not import subreddit rules");
  assert.ok(!community.some((guide) => guide.id === "moon-game-features-black-ops-1-weapons-list"), "The copied Call of the Dead table is not a Moon walkthrough");
  assert.ok(!community.some((guide) => guide.title === "Map Easter Eggs" && /^For (?:a complete coverage|constant easter egg)/i.test(guide.steps[0]?.body)), "Promotional links are not playable walkthroughs");
  const chamber = guides.find((guide) => guide.id === "coldwar-die-maschine-main").steps.find((step) => step.title === "Raise all four chamber legs");
  assert.match(chamber.body, /NOVA-5 → green.*Electrobolt → yellow/);
  assert.ok(sourceGaps.every((gap) => externalUrl(gap.source) && gap.title && gap.mapIds.every((id) => maps.some((map) => map.id === id))));
  assert.ok(coverageGaps.every((gap) => gap.note.length > 30 && gap.mapIds.length && gap.mapIds.every((id) => maps.some((map) => map.id === id))));
  assert.ok(community.find((guide) => guide.id === "shaolin-shuffle-easter-eggs-main-easter-egg").steps.length > 15);
  const superQuest = superQuests.find((guide) => guide.id === "bo7-super-easter-egg-mister-peeks-mayhem");
  assert.equal(superQuest.relatedGuideIds.filter((id) => id.endsWith("-toy")).length, 6);
});

test("quoted references keep attribution and only safe markup", () => {
  const seen = new Set();
  for (const reference of references) {
    assert.ok(
      externalUrl(reference.url) &&
        reference.fetched &&
        reference.sections.length,
    );
    for (const id of reference.mapIds) {
      assert.ok(
        maps.some((map) => map.id === id),
        `Unknown reference map: ${id}`,
      );
      assert.ok(!seen.has(id), `Duplicate reference: ${id}`);
      seen.add(id);
    }
    for (const section of reference.sections) {
      assert.ok(section.title && Object.hasOwn(categories, section.category));
      assert.ok(
        section.html || section.sourceOnly,
        `${reference.url}: ${section.title}`,
      );
      assert.doesNotMatch(
        section.html,
        /<script|<iframe|<style|\son\w+\s*=|javascript:|data:|cite|L\d+: /i,
      );
      for (const [, href] of section.html.matchAll(/href="([^"]+)"/g))
        assert.ok(!href || href.startsWith("https://"), href);
    }
  }
});

test("search combines game, category, coverage, and accent-insensitive words", () => {
  const fixtures = [
    {
      id: "a",
      game: { id: "bo3" },
      search: normalize("Der Eisendrache Lightning bow"),
      guides: [{ category: "weapon" }],
    },
    {
      id: "b",
      game: { id: "bo6" },
      search: normalize("Liberty Falls"),
      guides: [],
      reference: { sections: [{ category: "music" }] },
    },
  ];
  assert.deepEqual(
    filterMaps(fixtures, {
      game: "bo3",
      query: "lightning BOW",
      category: "weapon",
    }).map((map) => map.id),
    ["a"],
  );
  assert.deepEqual(filterMaps(fixtures, { query: "missing" }), []);
  assert.deepEqual(
    filterMaps(fixtures, { category: "music", availability: "reference" }).map(
      (map) => map.id,
    ),
    ["b"],
  );
  assert.deepEqual(
    filterMaps(fixtures, { availability: "walkthroughs" }).map((map) => map.id),
    ["a"],
  );
  assert.deepEqual(
    filterMaps([{ ...fixtures[0], search: "a rainbow below the stairs" }], {
      query: "bow",
    }),
    [],
  );
  assert.deepEqual(filterMaps(fixtures, { query: "[unknown]?" }), []);
  assert.equal(normalize("Verrückt Kowakujō"), "verruckt kowakujo");
});

test("progress survives changed step order and ignores corrupt or stale data", () => {
  const sample = [
    { id: "quest", steps: [{ title: "Power" }, { title: "Boss" }] },
  ];
  const saved = JSON.stringify({
    quest: { completed: ["Boss", "Boss", "Removed", 4], updated: "2026-10-13" },
    removed: { completed: ["Other"] },
  });
  assert.deepEqual(readProgress(saved, sample), {
    quest: { completed: ["Boss"], updated: "2026-10-13" },
  });
  for (const raw of [
    null,
    "",
    "broken",
    "[]",
    "null",
    "7",
    '{"quest":{"completed":false}}',
  ])
    assert.deepEqual(readProgress(raw, sample), {});
});

test("routes support a GitHub project path and reject unsafe external URLs", () => {
  assert.equal(
    parseRoute("#guide/bo6-liberty-falls-main").id,
    "bo6-liberty-falls-main",
  );
  assert.equal(
    parseRoute("#library?game=bo3&q=ice+staff").params.get("q"),
    "ice staff",
  );
  assert.equal(parseRoute("").page, "home");
  assert.equal(externalUrl("javascript:alert(1)"), "");
  assert.equal(externalUrl("http://example.com"), "");
  assert.equal(
    escapeHtml('<img onerror="bad()">'),
    "&lt;img onerror=&quot;bad()&quot;&gt;",
  );
});

test("all delivered images exist and have usable attribution", async () => {
  for (const [id, images] of Object.entries(media.guides || {})) {
    const guide = guides.find((guide) => guide.id === id);
    assert.ok(guide, `Unknown image guide: ${id}`);
    for (const image of images)
      assert.ok(
        Number.isInteger(image.step) &&
          image.step > 0 &&
          image.step <= guide.steps.length &&
          image.caption,
      );
  }
  const images = [
    media.fallback,
    ...Object.values(media.maps),
    ...Object.values(media.games),
    ...Object.values(media.guides || {}).flat(),
    ...guides.flatMap((guide) => [
      ...(guide.images || []),
      ...guide.steps.flatMap((step) => step.images || []),
    ]),
  ];
  const assetNames = new Set(await readdir(new URL("../assets/", import.meta.url)));
  for (const image of images) {
    assert.ok(image.alt && image.source && image.credit);
    assert.ok(externalUrl(image.source));
    assert.ok(image.src.startsWith("./assets/"));
    assert.ok(assetNames.has(image.src.slice("./assets/".length)), `Image filename case: ${image.src}`);
    await access(new URL(`../${image.src}`, import.meta.url));
  }
});
