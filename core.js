export const categories = {
  main: "Main quests",
  side: "Side quests",
  weapon: "Weapons & buildables",
  music: "Music",
};

export function expandCommunityGuides(topics) {
  return topics.flatMap((topic) =>
    topic.mapIds.map((mapId) => ({
      ...topic,
      ...topic.mapOverrides?.[mapId],
      mapId,
      id: `${mapId}-community-${topic.id}`,
    })),
  );
}

export function escapeHtml(value) {
  return String(value ?? "").replace(
    /[&<>"']/g,
    (character) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        character
      ],
  );
}

export function normalize(value) {
  return String(value)
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

export function filterMaps(
  maps,
  { game = "all", query = "", category = "all", availability = "all" },
) {
  const words = normalize(query).trim().split(/\s+/).filter(Boolean);
  const gameQuery = maps.some((map) => map.game.id === normalize(query).trim())
    ? normalize(query).trim()
    : "";
  const terms = words.map(
    (word) =>
      new RegExp(
        `(?:^|[^a-z0-9])${word.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}`,
      ),
  );
  return maps.filter(
    (map) =>
      (game === "all" || map.game.id === game) &&
      (category === "all" ||
        map.guides.some((guide) => guide.category === category) ||
        map.reference?.sections.some(
          (section) =>
            section.category === category ||
            section.categories?.includes(category),
        )) &&
      (availability !== "walkthroughs" || map.guides.length > 0) &&
      (availability !== "reference" || Boolean(map.reference)) &&
      (gameQuery
        ? map.game.id === gameQuery
        : terms.every((term) => term.test(map.search))),
  );
}

export function readProgress(raw, guides) {
  let value;
  try {
    value = JSON.parse(raw);
  } catch {
    return {};
  }
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  const progress = {};
  for (const guide of guides) {
    const entry = value[guide.id];
    if (!entry || !Array.isArray(entry.completed)) continue;
    const titles = new Set(guide.steps.map((step) => step.title));
    const completed = [
      ...new Set(
        entry.completed.filter(
          (title) => typeof title === "string" && titles.has(title),
        ),
      ),
    ];
    if (completed.length)
      progress[guide.id] = {
        completed,
        updated: typeof entry.updated === "string" ? entry.updated : "",
      };
  }
  return progress;
}

export function parseRoute(hash) {
  const [path, query] = hash.replace(/^#/, "").split("?");
  const segments = path.split("/");
  return {
    page: segments[0] || "home",
    id: segments[1] || "",
    params: new URLSearchParams(query || ""),
  };
}

export function externalUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" ? url.href : "";
  } catch {
    return "";
  }
}
