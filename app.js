import {
  categories,
  escapeHtml as e,
  normalize,
  filterMaps,
  readProgress,
  parseRoute,
  externalUrl,
  expandCommunityGuides,
} from "./core.js";

const main = document.querySelector("main");
const storageKey = "dead-drop-progress-v1";
const searchIcon =
  '<svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/></svg>';
const arrow = '<span aria-hidden="true">↗</span>';
const state = {
  game: "all",
  query: "",
  category: "all",
  availability: "all",
  limit: 12,
};
let games = [],
  guides = [],
  maps = [],
  media = {},
  references = [],
  sourceGaps = [],
  coverageGaps = [];
let progress = {};
let storageAvailable = true;
let toastTimer;

function message(text) {
  const toast = document.getElementById("toast");
  toast.textContent = text;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 3500);
}

function persist() {
  try {
    localStorage.setItem(storageKey, JSON.stringify(progress));
  } catch {
    storageAvailable = false;
    message(
      "Progress is available this visit, but this browser cannot save it.",
    );
  }
  updateBadge();
}

function updateBadge() {
  document.getElementById("progress-badge").textContent = Object.values(
    progress,
  ).filter((entry) => entry.completed.length).length;
}

function sourceLinks(sources) {
  return sources
    .map((source) =>
      externalUrl(source.url)
        ? `<a href="${e(source.url)}" target="_blank" rel="noopener noreferrer">${e(source.title)} ${arrow}</a>`
        : "",
    )
    .join("");
}

function imageFor(map) {
  return media.maps[map.id] || media.games[map.game.id] || media.fallback;
}

function guideImage(image) {
  return `<figure class="reader-figure"><a href="${e(image.src)}" target="_blank" rel="noopener noreferrer" aria-label="Open full-size image: ${e(image.alt)}"><img src="${e(image.src)}" alt="${e(image.alt)}" loading="lazy" width="960" height="540"></a><figcaption>${e(image.caption || "Map reconnaissance")} · <a href="${e(image.source)}" target="_blank" rel="noopener noreferrer">${e(image.credit)} ${arrow}</a> · Open image for full size</figcaption></figure>`;
}

function completedFor(guide) {
  return progress[guide.id]?.completed || [];
}

function searchBox(id, placeholder, value = "") {
  return `<label class="search-box">${searchIcon}<span class="sr-only">${e(placeholder)}</span><input id="${id}" type="search" placeholder="${e(placeholder)}" value="${e(value)}" autocomplete="off"><button type="button" class="search-clear" aria-label="Clear search" ${value ? "" : "hidden"}>×</button></label>`;
}

function storageNotice() {
  return storageAvailable
    ? ""
    : '<p class="storage-warning">Browser storage is unavailable. Checked steps will last for this visit only.</p>';
}

function mapCard(map, index) {
  const count = map.guides.length;
  const image = imageFor(map);
  return `<article class="map-card ${count ? "" : "reference"}"><div class="map-cover"><img src="${e(image.src)}" alt="${e(image.alt)}" loading="lazy" width="600" height="338"><span class="map-stamp">${count ? "WALKTHROUGHS" : map.reference ? "COMMUNITY REFERENCE" : "SOURCE LIBRARY"}</span>${image.mapSpecific === false ? '<span class="art-label">GAME ART / REFERENCE</span>' : ""}<span class="map-number">FILE ${String(index + 1).padStart(3, "0")}</span></div><div class="map-card-body"><div class="map-game">${e(map.game.title)}</div><h3><a class="map-card-link" href="#map/${map.id}">${e(map.name)}</a></h3><p>${e(map.summary)}</p><div class="card-meta"><span class="${count ? "ready" : ""}">${count ? `${count} guide${count === 1 ? "" : "s"}` : map.reference ? `${map.reference.sections.length} reference chapters` : "Guides to research"}</span><span>·</span><span>${e(map.mode || "Round-based")}</span></div><span class="card-arrow" aria-hidden="true">↗</span></div></article>`;
}

function guideCard(guide) {
  const completed = completedFor(guide).length;
  return `<article class="guide-card" data-guide-category="${guide.category}" data-search="${e(normalize([guide.title, guide.summary, ...guide.steps.map((step) => step.title + " " + step.body)].join(" ")))}"><div class="guide-tags"><span class="tag">${e(categories[guide.category])}</span><span class="difficulty">${e(guide.difficulty)}</span></div><h3><a class="map-card-link" href="#guide/${guide.id}">${e(guide.title)}</a></h3><p>${e(guide.summary)}</p><div class="guide-card-foot"><span>${guide.sourceQuote ? "Quoted community instructions" : e(guide.players)} · ${guide.steps.length} ${guide.sourceQuote ? "section" : "step"}${guide.steps.length === 1 ? "" : "s"}</span><span aria-hidden="true">↗</span></div>${completed ? `<div class="progress-track" aria-label="${completed} of ${guide.steps.length} steps complete"><div style="width:${(completed / guide.steps.length) * 100}%"></div></div>` : ""}</article>`;
}

function breadcrumb(map, title = "") {
  return `<div class="breadcrumbs"><a href="#library">THE ARCHIVE</a><span>/</span><a href="#library?game=${map.game.id}">${e(map.game.short)}</a><span>/</span>${title ? `<a href="#map/${map.id}">${e(map.name)}</a><span>/</span>${e(title)}` : e(map.name)}</div>`;
}

function library(home = false) {
  const saved = Object.keys(progress).length;
  main.innerHTML = `${home ? `<section class="hero"><img class="hero-art" src="./assets/terminus-recon.jpg" alt="Zombies overrun the Terminus island prison in Black Ops 6" fetchpriority="high" width="1920" height="1080"><div class="wrap"><div class="eyebrow">YOUR NEXT ROUND STARTS HERE</div><h1>Every map.<br>One <em>field manual.</em></h1><p class="hero-copy">Find your map. Follow the steps. Finish the quest.<br>A place for the big endings and the little secrets<br>that make Zombies, Zombies.</p><div class="hero-actions"><a class="button" href="#library">Explore the archive <span aria-hidden="true">→</span></a><a class="text-link" href="#progress">${saved ? "Pick up where you left off" : "Your progress, saved locally"} ${arrow}</a></div><div class="hero-caption">FIELD RECON / TERMINUS<span>BLACK OPS 6 · 2024</span></div></div></section><div class="wrap stat-strip"><div class="stat"><strong>${games.length}</strong><span>Games &<br>spin-offs</span></div><div class="stat"><strong>${maps.length}</strong><span>Maps &<br>modes indexed</span></div><div class="stat"><strong>${guides.length}</strong><span>Guides &<br>checklists</span></div><div class="stat-note">Source-linked. Ready for your next run.</div></div>` : ""}<section class="wrap library-section" id="archive"><div class="section-heading"><div><div class="eyebrow">PICK YOUR BATTLEGROUND</div><h2>The archive</h2></div><p>Main quests, hidden songs, wonder weapons, and side quests.<br>Choose a game to find your next rabbit hole.</p></div>${storageNotice()}<div class="library-layout"><aside class="game-panel" aria-label="Filter by game"><div class="sidebar-label">CALL OF DUTY TITLES</div><div class="game-list"><button class="game-filter" data-game="all" aria-pressed="${state.game === "all"}">All games <span>${maps.length}</span></button>${games.map((game) => `<button class="game-filter" data-game="${game.id}" aria-pressed="${state.game === game.id}">${e(game.short)}<span>${game.maps.length}</span></button>`).join("")}</div><div class="sidebar-note">A map in the archive isn’t a promise that every secret is documented.<a href="#coverage">See actual coverage ${arrow}</a></div></aside><div class="library-results"><div class="library-tools">${searchBox("map-search", "Search maps, quests, weapons…", state.query)}<label class="select-wrap"><span class="sr-only">Guide availability</span><select id="availability"><option value="all" ${state.availability === "all" ? "selected" : ""}>All coverage</option><option value="walkthroughs" ${state.availability === "walkthroughs" ? "selected" : ""}>With guides & checklists</option><option value="reference" ${state.availability === "reference" ? "selected" : ""}>With field notes</option></select></label></div><div class="filter-row"><div class="pills" aria-label="Filter guide category"><button class="pill" data-category="all" aria-pressed="${state.category === "all"}">All guides</button>${Object.entries(
    categories,
  )
    .map(
      ([key, label]) =>
        `<button class="pill" data-category="${key}" aria-pressed="${state.category === key}">${label}</button>`,
    )
    .join(
      "",
    )}</div><span id="result-count" class="result-count" role="status" aria-live="polite"></span></div><div id="map-grid" class="map-grid"></div><button id="load-more" class="load-more" type="button">Load more maps <span aria-hidden="true">↓</span></button></div></div><div class="field-note"><span class="field-note-mark" aria-hidden="true">01 /</span><div><h3>Less tab-switching. More zombie-slaying.</h3><p>Check off each step as you play. Your progress stays on this device, even when you leave.</p></div><a class="text-link" href="#progress">Open my progress ${arrow}</a></div></section>`;
  updateResults();
}

function updateLibraryUrl() {
  const params = new URLSearchParams();
  if (state.game !== "all") params.set("game", state.game);
  if (state.query) params.set("q", state.query);
  if (state.category !== "all") params.set("category", state.category);
  if (state.availability !== "all")
    params.set("availability", state.availability);
  const page = parseRoute(location.hash).page === "home" ? "home" : "library";
  history.replaceState(null, "", `#${page}${params.size ? `?${params}` : ""}`);
}

function updateResults() {
  const filtered = filterMaps(maps, state);
  if (state.game !== "all") filtered.sort((a, b) => a.order - b.order);
  document.getElementById("map-grid").innerHTML = filtered.length
    ? filtered
        .slice(0, state.limit)
        .map((map) => mapCard(map, maps.indexOf(map)))
        .join("")
    : '<div class="empty"><h3>No files found</h3><p>Try a map name, a different game, or clear your filters.</p><button class="button secondary" data-action="clear-filters">Clear filters</button></div>';
  document.getElementById("result-count").textContent =
    `${filtered.length} ${filtered.length === 1 ? "map" : "maps"} found`;
  document.getElementById("load-more").hidden = filtered.length <= state.limit;
  document
    .querySelectorAll("[data-game]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.game === state.game),
      ),
    );
  document
    .querySelectorAll("[data-category]")
    .forEach((button) =>
      button.setAttribute(
        "aria-pressed",
        String(button.dataset.category === state.category),
      ),
    );
  document.getElementById("map-search").nextElementSibling.hidden =
    !state.query;
  updateLibraryUrl();
}

function mapPage(map) {
  const image = imageFor(map);
  const sorted = [...map.guides].sort(
    (a, b) =>
      Object.keys(categories).indexOf(a.category) -
      Object.keys(categories).indexOf(b.category),
  );
  main.innerHTML = `<section class="wrap page-top">${breadcrumb(map)}<div class="map-banner"><div class="map-banner-copy"><div class="eyebrow">${e(map.game.title)} / ${e(map.release || map.game.year)}</div><h1>${e(map.name)}</h1><p>${e(map.summary)}</p><div class="map-facts"><span>${e(map.mode)}</span><span>${map.guides.length} guides & checklists</span><span>${map.reference ? "Community reference available" : "Source links available"}</span></div></div><img src="${e(image.src)}" alt="${e(image.alt)}" width="960" height="540"></div></section><section class="wrap map-guide-section">${storageNotice()}<div class="section-heading"><div><div class="eyebrow">KNOW BEFORE YOU DROP</div><h2>Choose your mission</h2></div><p>${e(map.questNote || "Player requirements and setup are listed inside each walkthrough.")}</p></div>${map.gaps.length ? `<details class="coverage-note"><summary>Known research gaps for this map (${map.gaps.length})</summary><ul>${map.gaps.map((gap) => `<li>${e(gap.note)}</li>`).join("")}</ul></details>` : ""}${sorted.length ? `<div class="map-guide-tools">${searchBox("guide-search", "Find a quest, upgrade, song or step…")}<div class="pills" aria-label="Filter map guides"><button class="pill" data-map-category="all" aria-pressed="true">All guides <span>${sorted.length}</span></button>${Object.entries(categories).map(([id, label]) => `<button class="pill" data-map-category="${id}" aria-pressed="false">${e(label)} <span>${sorted.filter((guide) => guide.category === id).length}</span></button>`).join("")}</div></div><p id="guide-results" class="result-count" aria-live="polite">${sorted.length} guides</p><div class="guide-list" id="map-guides">${sorted.map(guideCard).join("")}</div><div id="guide-empty" class="empty" hidden>No guides match these filters.</div>` : '<div class="empty"><h3>Walkthroughs are still being researched</h3><p>Read the attributed community reference or linked sources below. This map’s coverage has not been audited.</p></div>'}${map.reference ? `<article class="sources-panel"><div class="eyebrow">COMMUNITY FIELD NOTES</div><h3>Go beyond the walkthroughs</h3><p>${map.reference.sections.length} chapters of attributed source text: map setup, weapons, quests, secrets, and reference notes where the community has documented them. The source can include unfinished sections or multiple game versions.</p><div class="sources-list"><a href="#reference/${map.id}">Read the community reference ${arrow}</a></div></article>` : ""}<div class="sources-panel"><h3>Sources & map notes</h3><p>${e(map.questNote || "No claim of exhaustive coverage. Use these sources to cross-check your game version and any steps awaiting research.")}<br>Image: <a href="${e(image.source)}" target="_blank" rel="noopener noreferrer">${e(image.credit || "Call of Duty / Activision")}</a>${image.mapSpecific === false ? " · Game artwork; not a screenshot of this map." : ""}</p><div class="sources-list">${sourceLinks(map.sources)}</div></div></section>`;
}

function reader(guide) {
  const map = maps.find((map) => map.id === guide.mapId);
  const completed = completedFor(guide);
  const images = media.guides?.[guide.id] || [];
  const recon = guide.images?.length ? null : imageFor(map);
  const related = guides.filter(
    (other) => other.id !== guide.id &&
      ((other.mapId === map.id && other.category === "weapon") || guide.relatedGuideIds?.includes(other.id) ||
        other.relatedGuideIds?.includes(guide.id)),
  );
  const chapters = `<a href="#before-you-start" data-scroll="before-you-start">Before you start</a>${guide.steps.map((step, index) => `<a href="#step-${index + 1}" data-scroll="step-${index + 1}"><span>${String(index + 1).padStart(2, "0")}</span>${e(step.title)}</a>`).join("")}<a href="#guide-sources" data-scroll="guide-sources">Sources & reference</a>`;
  main.innerHTML = `<section class="wrap page-top" id="reader-top">${breadcrumb(map, guide.title)}<div class="guide-header"><div class="guide-tags"><span class="tag">${e(categories[guide.category])}</span><span class="difficulty">${e(guide.players)} · ${e(guide.difficulty)}</span></div><h1>${e(guide.title)}</h1><p>${e(guide.summary)}</p><nav class="sources-list guide-quick-links" aria-label="Guide quick links"><a href="#before-you-start" data-scroll="before-you-start">Setup</a><a href="#step-1" data-scroll="step-1">Steps</a><a href="#guide-sources" data-scroll="guide-sources">Sources</a>${map.reference ? `<a href="#reference/${map.id}">Map reference ${arrow}</a>` : ""}</nav></div></section><div class="wrap reader-layout"><aside class="reader-sidebar" aria-label="Guide chapters"><div class="reader-controls"><p>Your quest progress</p><strong id="step-progress">${completed.length} / ${guide.steps.length} steps</strong><div class="progress-track"><div id="step-progress-bar" style="width:${(completed.length / guide.steps.length) * 100}%"></div></div><div class="reader-buttons"><button data-action="reset-guide" data-guide="${guide.id}">Reset steps</button><button data-action="copy-link">Copy link</button><button data-action="print">Print guide</button></div></div><details class="mobile-chapters"><summary>Jump to a step</summary><nav aria-label="Step navigation">${chapters}</nav></details><h2>In this guide</h2>${chapters}</aside><article class="reader">${storageNotice()}<section class="prerequisites" id="before-you-start"><h2>Before you start</h2><ul>${guide.requirements.map((requirement) => `<li>${e(requirement)}</li>`).join("")}</ul><p><strong>Reward:</strong> ${e(guide.reward)}</p>${related.length ? `<details class="related-guides"><summary>Related setup, upgrades & routes (${related.length})</summary><div class="sources-list">${related.map((other) => `<a href="#guide/${other.id}">${other.mapId !== map.id ? e(maps.find((entry) => entry.id === other.mapId).name) + ": " : ""}${e(other.title)} →</a>`).join("")}</div></details>` : ""}</section>${guide.sourceQuote ? `<div class="community-notice"><strong>Quoted community walkthrough</strong>Source excerpts are quoted from <a href="${e(guide.sourceQuote)}" target="_blank" rel="noopener noreferrer">the credited community source</a>.${guide.sharedSource ? ` The source compares more than one version. <strong>${e(map.game.title)}: ${e(map.questNote)}</strong>` : ""} ${guide.sourceOmissions?.length ? `<p>Source gaps and corrections:</p><ul>${guide.sourceOmissions.map((note) => `<li>${e(note)}</li>`).join("")}</ul>` : ""} ${guide.supplementNote ? `<p>${e(guide.supplementNote)}</p>` : ""}Use the source image links alongside the photos and diagrams here.</div>` : ""}${recon ? guideImage({...recon, caption: recon.caption || (recon.mapSpecific === false ? "Game artwork / reference image" : "Map reconnaissance")}) : ""}${(guide.images || []).map(guideImage).join("")}${guide.steps
    .map(
      (step, index) =>
        `<section id="step-${index + 1}" class="step ${completed.includes(step.title) ? "checked" : ""}"><div class="step-heading"><label class="step-check"><input type="checkbox" data-guide="${guide.id}" data-step="${e(step.title)}" ${completed.includes(step.title) ? "checked" : ""}><span class="step-index">${String(index + 1).padStart(2, "0")}</span><h2>${e(step.title)}</h2></label></div>${guide.sourceQuote && step.html ? `<blockquote class="community-quote" cite="${e(step.researchSource || guide.sourceQuote)}">${step.html}</blockquote>` : `<p class="step-body">${e(step.body)}</p>`}${step.tip ? `<div class="step-tip"><strong>Field note</strong>${e(step.tip)}</div>` : ""}${[...images.filter((image) => image.step === index + 1), ...(step.images || [])]
          .filter((image) => image.src)
          .map(guideImage)
          .join("")}</section>`,
    )
    .join(
      "",
    )}<section class="sources-panel" id="guide-sources"><h3>Check the source</h3><p>${guide.sourceQuote ? "Quoted from the community source below" : "Written from the sources below"}. Researched ${e(guide.checked)}; not independently playtested. Patch changes and game versions can affect a step.</p><div class="sources-list">${sourceLinks(guide.sources)}${map.reference ? `<a href="#reference/${map.id}">Full community reference ${arrow}</a>` : ""}<a href="${reportLink(map, guide)}" target="_blank" rel="noopener noreferrer">Report a missing or incorrect step ${arrow}</a><a href="#reader-top" data-scroll="reader-top">Back to guide navigation ↑</a></div></section></article></div>`;
}

function reportLink(map, guide) {
  const subject = guide ? `${map.name}: ${guide.title}` : map.name;
  return `https://github.com/Aughhhhhhh/dead-drop-zombies-site/issues/new?${new URLSearchParams({ title: `Guide correction: ${subject}`, body: `Game: ${map.game.title}\nMap: ${map.name}\nGuide: ${guide?.title || "Community reference"}\n\nMissing or incorrect step:\n\nSource or screenshot:\n\nGame version / platform:` })}`;
}

function referencePage(map) {
  const reference = map.reference;
  const chapters = reference.sections.map((section, index) => `<a href="#reference-${index}" data-scroll="reference-${index}"><span>${String(index + 1).padStart(2, "0")}</span>${e(section.title)}</a>`).join("");
  main.innerHTML = `<section class="wrap page-top" id="reader-top">${breadcrumb(map, "Community reference")}<div class="guide-header"><div class="eyebrow">ATTRIBUTED COMMUNITY FIELD NOTES</div><h1>${e(map.name)} reference</h1><p>Read the documented map features and Easter eggs in one place. This reference preserves community text and may include multiple versions of the map.</p><nav class="sources-list guide-quick-links" aria-label="Reference quick links"><a href="#map/${map.id}">Map guides</a><a href="#reference-0" data-scroll="reference-0">First chapter</a><a href="${e(reference.url)}" target="_blank" rel="noopener noreferrer">Original source ${arrow}</a></nav></div></section><div class="wrap reader-layout"><aside class="reader-sidebar"><div class="reader-controls"><p>${reference.sections.length} reference chapters</p><div class="reader-buttons"><button data-action="copy-link">Copy link</button><button data-action="print">Print notes</button></div></div><details class="mobile-chapters"><summary>Jump to a chapter</summary><nav aria-label="Chapter navigation">${chapters}</nav></details><h2>Reference chapters</h2>${chapters}</aside><article class="reader"><div class="community-notice"><strong>Read this as a source reference</strong>The excerpts below are quoted from <a href="${e(reference.url)}" target="_blank" rel="noopener noreferrer">the r/CODZombies community guide ${arrow}</a>, retrieved ${e(reference.fetched)}. They have not been independently audited or playtested. Some source chapters are unfinished. For image links and any version-specific uncertainty, open the original guide.${reference.note ? `<p>${e(reference.note)}</p>` : ""}</div><div class="community-search">${searchBox("chapter-search", "Find a chapter or detail…")}</div>${reference.sections.map((section, index) => `<section class="community-section" id="reference-${index}" data-search="${e(normalize(`${section.title} ${section.text || ""}`))}"><h2>${e(section.title)}</h2>${section.sourceOnly ? `<p class="community-notice">This chapter's full transcription remains in <a href="${e(reference.url)}" target="_blank" rel="noopener noreferrer">the original source ↗</a>.</p>` : `<blockquote class="community-quote" cite="${e(reference.url)}">${section.html}</blockquote>`}</section>`).join("")}<div id="chapter-empty" class="empty" hidden>No chapters match your search.</div><div class="sources-panel"><h3>Keep the field notes accurate</h3><p>Reference text remains credited to its community authors. A transcription is not a verification that every Easter egg has been found or documented.</p><div class="sources-list"><a href="${e(reference.url)}" target="_blank" rel="noopener noreferrer">Open the original guide ${arrow}</a><a href="${reportLink(map)}" target="_blank" rel="noopener noreferrer">Report a gap ${arrow}</a><a href="#map/${map.id}">Back to walkthroughs</a></div></div></article></div>`;
}

function progressPage() {
  const started = guides
    .filter((guide) => completedFor(guide).length)
    .sort((a, b) =>
      (progress[b.id].updated || "").localeCompare(
        progress[a.id].updated || "",
      ),
    );
  const finished = started.filter(
    (guide) => completedFor(guide).length === guide.steps.length,
  ).length;
  main.innerHTML = `<section class="wrap page-top"><div class="eyebrow">YOUR PERSONAL FIELD NOTES</div><h1 style="margin-top:15px">Pick up where you left off.</h1><p class="saved-summary"><strong>${started.length}</strong> quest${started.length === 1 ? "" : "s"} started · <strong>${finished}</strong> completed. Saved on this browser and device. Community references do not use checklists.</p>${storageNotice()}${started.length ? `<div class="guide-list saved-grid">${started.map((guide) => `<div><div class="map-game">${e(maps.find((map) => map.id === guide.mapId).name)} · ${completedFor(guide).length}/${guide.steps.length} checked</div>${guideCard(guide)}</div>`).join("")}</div>` : '<div class="empty"><h3>Your next quest is waiting</h3><p>Open a walkthrough and check a step. It will show up here automatically.</p><a class="button" href="#library?availability=walkthroughs">Find a walkthrough <span aria-hidden="true">→</span></a></div>'}</section>`;
}

function coveragePage() {
  const coveredMaps = maps.filter((map) => map.guides.length).length;
  const referenceMaps = maps.filter((map) => map.reference).length;
  const originalGuides = guides.filter((guide) => !guide.sourceQuote).length;
  const missing = maps.filter((map) => !map.guides.length);
  main.innerHTML = `<section class="wrap page-top"><div class="eyebrow">NO MYSTERY ABOUT THE COVERAGE</div><h1 style="margin-top:15px">Know what’s in the archive.</h1><p class="coverage-intro">Main quests, side quests, weapons, upgrades and songs are organized into individual guides. The inventory below shows exactly which categories are documented on each map. A zero means no in-site guide in that category; it does not establish that the map has no secrets. Unsolved or unverified steps are kept visible as gaps.</p><div class="coverage-stats"><div class="coverage-stat"><strong>${guides.length}</strong><span>Guide cards and checklists across ${coveredMaps} maps and modes</span></div><div class="coverage-stat"><strong>${originalGuides}</strong><span>Original researched guides & checklists; ${guides.length - originalGuides} attributed community topics</span></div><div class="coverage-stat"><strong>${maps.length}</strong><span>Maps and modes indexed, each with source links</span></div></div><div class="coverage-note"><h2>How to read the labels</h2><ul><li><strong>Walkthroughs:</strong> original written instructions with prerequisites, ordered steps and a saved checklist.</li><li><strong>Community guide:</strong> a complete captured source topic with its lists, locations, tables and upgrade sections, quoted and credited inside a saved checklist.</li><li><strong>Community reference:</strong> the broader source book, including map features, lore and any unfinished source sections. Available for ${referenceMaps} map entries.</li><li><strong>Source library:</strong> direct references for entries awaiting an in-site walkthrough.</li></ul><p>Guides are researched from credited sources and have not been independently playtested. Original releases, remasters, survival variants and arcade modes have separate entries. Read version notes before following a route; player requirements and available equipment can differ.</p></div><table class="coverage-table"><caption class="sr-only">Guide coverage by game</caption><thead><tr><th>GAME / MODE</th><th>INDEXED</th><th>GUIDES</th><th>FIELD NOTES</th></tr></thead><tbody>${games
    .map((game) => {
      const entries = maps.filter((map) => map.game.id === game.id);
      return `<tr><td><a href="#library?game=${game.id}">${e(game.title)} ${arrow}</a></td><td>${entries.length}</td><td>${entries.reduce((total, map) => total + map.guides.length, 0)}</td><td>${entries.filter((map) => map.reference).length}</td></tr>`;
    })
    .join(
      "",
    )}</tbody></table><details class="coverage-note"><summary>Map-by-map category inventory</summary><div class="coverage-scroll"><table class="coverage-table"><thead><tr><th>MAP / VERSION</th>${Object.values(categories).map((category) => `<th>${e(category)}</th>`).join("")}</tr></thead><tbody>${maps.map((map) => `<tr><td><a href="#map/${map.id}">${e(map.name)}<small>${e(map.game.short)}</small></a></td>${Object.keys(categories).map((category) => `<td>${map.guides.filter((guide) => guide.category === category).length}</td>`).join("")}</tr>`).join("")}</tbody></table></div></details>${missing.length ? `<details class="coverage-note" open><summary>Entries still needing in-site instructions (${missing.length})</summary><p>These entries retain direct sources. Their secrets have not been certified absent.</p><ul>${missing.map((map) => `<li><a href="#map/${map.id}">${e(map.game.short)} / ${e(map.name)}</a></li>`).join("")}</ul></details>` : ""}<details class="coverage-note" open><summary>Known research gaps (${coverageGaps.length} topic groups)</summary><p>These are identified limits of the in-site guides. Having a guide card does not mean every secret on that map has been verified.</p><ul>${coverageGaps.map((gap) => `<li><strong>${gap.mapIds.map((id) => `<a href="#map/${id}">${e(maps.find((map) => map.id === id)?.name || id)}</a>`).join(" / ")}</strong>: ${e(gap.note)}</li>`).join("")}</ul></details><details class="coverage-note"><summary>Unfinished or incorrect topics in the original community sources (${sourceGaps.length})</summary><p>These source omissions are excluded from community checklist counts. An original walkthrough may cover the same topic; check that map’s guide list.</p><ul>${sourceGaps.map((gap) => `<li>${e(maps.find((map) => map.id === gap.mapIds[0])?.name || gap.mapIds[0])}: <a href="${e(gap.source)}" target="_blank" rel="noopener noreferrer">${e(gap.title)} ↗</a>${gap.note ? `<p>${e(gap.note)}</p>` : ""}</li>`).join("")}</ul></details><div class="coverage-note"><h2>Sources, images, and corrections</h2><p>Source quotations credit their community authors. Official images credit Call of Duty / Activision; community location photos and original puzzle diagrams name their sources. Game artwork is identified when a map photo is unavailable.</p><p>Use “Report a missing or incorrect step” inside a guide to submit a correction on GitHub with your game version and supporting source. Unknown secrets and unresolved ciphers are not labelled solved.</p></div></section>`;
}

function render() {
  const route = parseRoute(location.hash);
  for (const link of document.querySelectorAll("[data-nav]")) {
    const current =
      route.page === link.dataset.nav ||
      (["home", "map", "guide", "reference"].includes(route.page) &&
        link.dataset.nav === "library");
    if (current) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  }
  let title = "The Zombies Field Manual";
  if (route.page === "home" || route.page === "library") {
    state.game = games.some((game) => game.id === route.params.get("game"))
      ? route.params.get("game")
      : "all";
    state.query = route.params.get("q") || "";
    state.category = Object.hasOwn(categories, route.params.get("category"))
      ? route.params.get("category")
      : "all";
    state.availability = ["walkthroughs", "reference"].includes(
      route.params.get("availability"),
    )
      ? route.params.get("availability")
      : "all";
    state.limit = 12;
    library(route.page === "home");
  } else if (route.page === "map" || route.page === "reference") {
    const map = maps.find((map) => map.id === route.id);
    if (map && (route.page === "map" || map.reference)) {
      title = map.name;
      route.page === "map" ? mapPage(map) : referencePage(map);
    } else missing();
  } else if (route.page === "guide") {
    const guide = guides.find((guide) => guide.id === route.id);
    if (guide) {
      title = guide.title;
      reader(guide);
    } else missing();
  } else if (route.page === "progress") {
    title = "My progress";
    progressPage();
  } else if (route.page === "coverage") {
    title = "Coverage";
    coveragePage();
  } else missing();
  document.title = `${title} — Dead Drop`;
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
}

function missing() {
  main.innerHTML =
    '<section class="wrap page-top"><div class="empty"><h1>File not found.</h1><p>This map or guide isn’t in the archive yet.</p><a class="button" href="#library">Return to the archive</a></div></section>';
}

main.addEventListener("click", async (event) => {
  const scrollLink = event.target.closest("[data-scroll]");
  if (scrollLink) {
    event.preventDefault();
    const target = document.getElementById(scrollLink.dataset.scroll);
    if (target) {
      const chapterSearch = document.getElementById("chapter-search");
      if (target.hidden && chapterSearch) {
        chapterSearch.value = "";
        chapterSearch.dispatchEvent(new Event("input", { bubbles: true }));
      }
      scrollLink.closest(".mobile-chapters")?.removeAttribute("open");
      target.setAttribute("tabindex", "-1");
      target.scrollIntoView({ behavior: "auto", block: "start" });
      target.focus({ preventScroll: true });
    }
    return;
  }
  const game = event.target.closest("[data-game]");
  const mapCategory = event.target.closest("[data-map-category]");
  if (mapCategory) {
    main.querySelectorAll("[data-map-category]").forEach((button) =>
      button.setAttribute("aria-pressed", String(button === mapCategory)),
    );
    updateMapGuides();
    return;
  }
  const category = event.target.closest("[data-category]");
  if (game || category) {
    if (game) state.game = game.dataset.game;
    if (category) state.category = category.dataset.category;
    state.limit = 12;
    updateResults();
    return;
  }
  if (event.target.closest("#load-more")) {
    state.limit += 24;
    updateResults();
    return;
  }
  const clear = event.target.closest(".search-clear");
  if (clear) {
    const input = clear.previousElementSibling;
    input.value = "";
    input.dispatchEvent(new Event("input", { bubbles: true }));
    input.focus();
    return;
  }
  const action = event.target.closest("[data-action]");
  if (!action) return;
  if (action.dataset.action === "clear-filters") {
    Object.assign(state, {
      game: "all",
      query: "",
      category: "all",
      availability: "all",
      limit: 12,
    });
    document.getElementById("map-search").value = "";
    document.getElementById("availability").value = "all";
    updateResults();
  }
  if (action.dataset.action === "reset-guide") {
    if (!confirm("Reset the checked steps for this guide?")) return;
    delete progress[action.dataset.guide];
    persist();
    reader(guides.find((guide) => guide.id === action.dataset.guide));
  }
  if (action.dataset.action === "print") window.print();
  if (action.dataset.action === "copy-link") {
    try {
      await navigator.clipboard.writeText(location.href);
      message("Guide link copied.");
    } catch {
      message("Copy the guide link from your browser’s address bar.");
    }
  }
});

main.addEventListener("input", (event) => {
  if (event.target.id === "guide-search") updateMapGuides();
  if (event.target.id === "map-search") {
    state.query = event.target.value;
    state.limit = 12;
    updateResults();
  }
  if (event.target.id === "chapter-search") {
    const words = normalize(event.target.value)
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    let count = 0;
    main.querySelectorAll(".community-section").forEach((section) => {
      section.hidden = !words.every((word) =>
        section.dataset.search.includes(word),
      );
      if (!section.hidden) count++;
    });
    document.getElementById("chapter-empty").hidden = count > 0;
    event.target.nextElementSibling.hidden = !event.target.value;
  }
});

main.addEventListener("change", (event) => {
  if (event.target.id === "availability") {
    state.availability = event.target.value;
    state.limit = 12;
    updateResults();
  }
  if (event.target.matches("input[data-step]")) {
    const guide = guides.find(
      (guide) => guide.id === event.target.dataset.guide,
    );
    const completed = new Set(completedFor(guide));
    if (event.target.checked) completed.add(event.target.dataset.step);
    else completed.delete(event.target.dataset.step);
    if (completed.size)
      progress[guide.id] = {
        completed: [...completed],
        updated: new Date().toISOString(),
      };
    else delete progress[guide.id];
    event.target
      .closest(".step")
      .classList.toggle("checked", event.target.checked);
    document.getElementById("step-progress").textContent =
      `${completed.size} / ${guide.steps.length} steps`;
    document.getElementById("step-progress-bar").style.width =
      `${(completed.size / guide.steps.length) * 100}%`;
    persist();
  }
});

function updateMapGuides() {
  const input = document.getElementById("guide-search");
  const category = main.querySelector('[data-map-category][aria-pressed="true"]').dataset.mapCategory;
  const words = normalize(input.value).trim().split(/\s+/).filter(Boolean);
  let visible = 0;
  main.querySelectorAll("#map-guides .guide-card").forEach((card) => {
    card.hidden = (category !== "all" && card.dataset.guideCategory !== category) ||
      !words.every((word) => card.dataset.search.includes(word));
    if (!card.hidden) visible++;
  });
  document.getElementById("guide-results").textContent = `${visible} guide${visible === 1 ? "" : "s"}`;
  document.getElementById("guide-empty").hidden = visible > 0;
  input.nextElementSibling.hidden = !input.value;
}

async function load() {
  try {
    const [catalog, classic, modern, extra, aw, community, completionClassic, completionModern, completionModes, superQuests, researched, auditClassic, auditModern, auditModes, images, fieldNotes, gaps, knownGaps] =
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
          "media.json",
          "references.json",
          "source-gaps.json",
          "coverage-gaps.json",
        ].map(async (file) => {
          const response = await fetch(`./data/${file}`, { cache: "no-cache" });
          if (!response.ok) throw new Error(`Could not load ${file}`);
          return response.json();
        }),
      );
    games = catalog.games;
    guides = [...classic, ...modern, ...extra, ...aw, ...completionClassic, ...completionModern, ...completionModes, ...superQuests, ...researched, ...auditClassic, ...auditModern, ...auditModes, ...expandCommunityGuides(community)];
    media = images;
    references = fieldNotes;
    sourceGaps = gaps;
    coverageGaps = knownGaps;
    maps = games.flatMap((game) =>
      game.maps.map((map, order) => {
        const entries = guides.filter((guide) => guide.mapId === map.id);
        const reference = references.find((reference) =>
          reference.mapIds.includes(map.id),
        );
        return {
          ...map,
          order,
          game,
          guides: entries,
          gaps: coverageGaps.filter((gap) => gap.mapIds.includes(map.id)),
          reference,
          search: normalize(
            [
              map.name,
              game.title,
              game.short,
              map.summary,
              game.id,
              ...entries.map((guide) => `${guide.title} ${guide.summary}`),
              ...(reference?.sections.map(
                (section) =>
                  `${section.title} ${(section.text?.match(/^#{1,4} (.+)$/gm) || []).join(" ")}`,
              ) || []),
            ].join(" "),
          ),
        };
      }),
    );
    const featured = [
      "bo6-liberty-falls",
      "bo6-terminus",
      "bo3-der-eisendrache",
      "bo3-shadows-of-evil",
      "bo2-origins",
      "bo1-moon",
      "bo7-ashes-of-the-damned",
      "bo7-astra-malorum",
      "bo4-ix",
      "coldwar-die-maschine",
      "iw-zombies-in-spaceland",
      "waw-der-riese",
    ];
    maps.sort((a, b) => {
      const first = featured.indexOf(a.id),
        second = featured.indexOf(b.id);
      if (first !== -1 || second !== -1)
        return (
          (first === -1 ? featured.length : first) -
          (second === -1 ? featured.length : second)
        );
      return b.game.year - a.game.year || a.order - b.order;
    });
    try {
      progress = readProgress(localStorage.getItem(storageKey), guides);
    } catch {
      storageAvailable = false;
    }
    updateBadge();
    render();
    window.addEventListener("hashchange", render);
    window.addEventListener("storage", (event) => {
      if (event.key === storageKey) {
        progress = readProgress(event.newValue, guides);
        updateBadge();
        render();
      }
    });
  } catch (error) {
    main.innerHTML = `<section class="wrap page-top"><div class="empty"><h1>The archive couldn’t load.</h1><p>Reload the page to retry. If you opened index.html directly, use the local server described in the README.</p><p>${e(error.message)}</p><button class="button" id="reload">Try again</button></div></section>`;
    document
      .getElementById("reload")
      .addEventListener("click", () => location.reload());
  }
}

document.querySelector(".skip-link").addEventListener("click", (event) => {
  event.preventDefault();
  main.focus();
  main.scrollIntoView();
});

load();
