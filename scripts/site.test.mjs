import assert from "node:assert/strict";
import { readFile, access } from "node:fs/promises";
import { test } from "node:test";
import {
  categories,
  escapeHtml,
  normalize,
  filterMaps,
  readProgress,
  parseRoute,
  externalUrl,
} from "../core.js";

const readJson = async (file) =>
  JSON.parse(
    await readFile(new URL(`../data/${file}`, import.meta.url), "utf8"),
  );
const [catalog, classic, modern, extra, aw, references, media] =
  await Promise.all(
    [
      "catalog.json",
      "guides-classic.json",
      "guides-modern.json",
      "guides-extra.json",
      "guides-aw.json",
      "references.json",
      "media.json",
    ].map(readJson),
  );
const maps = catalog.games.flatMap((game) => game.maps);
const guides = [...classic, ...modern, ...extra, ...aw];

test("catalog and walkthrough IDs stay linked and unique", () => {
  assert.equal(
    new Set(catalog.games.map((game) => game.id)).size,
    catalog.games.length,
  );
  assert.equal(new Set(maps.map((map) => map.id)).size, maps.length);
  assert.equal(new Set(guides.map((guide) => guide.id)).size, guides.length);
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
    for (const step of guide.steps)
      assert.ok(step.title && step.body && step.body.length > 30, guide.id);
    for (const source of guide.sources)
      assert.ok(externalUrl(source.url), source.url);
  }
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
  ];
  for (const image of images) {
    assert.ok(image.alt && image.source && image.credit);
    assert.ok(externalUrl(image.source));
    assert.ok(image.src.startsWith("./assets/"));
    await access(new URL(`../${image.src}`, import.meta.url));
  }
});
