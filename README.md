# Dead Drop

A static Call of Duty Zombies field manual, hosted on GitHub Pages.

Choose a game, choose a map, and open a quest. Each map has search and category filters for main quests, side quests, weapons/buildables and music. Original walkthroughs and attributed community topics have saved checklists. Community topics preserve nested upgrade instructions, locations, tables and source caveats. Progress stays on the current browser and device.

Guide headers link directly to setup, steps, sources and the full map reference when available. Phone layouts include collapsible step/chapter navigation. Jumps move keyboard focus to the selected section; selecting a source chapter also clears a search that hid it. Guide data is revalidated on load so published corrections can replace cached instructions.

## Content and coverage

The catalog indexes 19 games and spin-offs and 145 map/mode entries as of October 16, 2026. Original releases, remasters, survival variants, and arcade modes have separate entries. Custom maps, mods, campaign reskins, and temporary Warzone events are outside the catalog.

Every indexed map or mode has in-site instructions, with main quests, secrets and equipment where documented. This is an expanding reference, not a verified exhaustive archive. The Coverage page reports the current guide counts and identified research gaps by map. Some archived triggers and bonus-room variants remain unverified; unsolved relics are not presented as solved. Guides have not been independently playtested.

The community reader contains attributed quotations from r/CODZombies, including its original caveats and unfinished sections. Its complete captured topics are also available as individual guide cards. Empty templates, disabled wiki pages, short stubs and TBD instructions are excluded from community checklist counts and recorded in `data/source-gaps.json`. A broader source book can still contain unfinished material. Large cipher transcriptions that could not be captured completely link to the original source. Shared references identify version differences; Chronicles-only secrets are restricted to their remasters. Follow the version-specific original walkthrough when available.

Images are credited to Call of Duty / Activision and their source pages or community screenshot authors. Step galleries include local location photos and original puzzle schematics, with captions and full-size links. Cards without a map-specific image identify their game artwork or placeholder. Artwork, Multiplayer reference photos and diagrams are labelled in their captions.

## Preview

Run from the repository directory:

```sh
python -m http.server 8000 --bind 127.0.0.1
```

Open <http://127.0.0.1:8000>. Opening `index.html` directly will not load the JSON files.

## Check and publish

No dependencies, accounts, API keys, or paid services are needed to run the website. Node 22 or newer is used only for checks and packaging.

```sh
npm test
npm run build
```

The build copies the site into `dist/`. All application paths are relative, so it works under a GitHub Pages project path. In the repository's **Settings → Pages**, select **GitHub Actions** as the source. Pushing to `main` runs the checks and deploys `dist/` through `.github/workflows/pages.yml`.

Published site: <https://Aughhhhhhh.github.io/dead-drop-zombies-site/>

The previous project was replaced at the user's request. Its files remain recoverable from earlier Git commits.

## Edit a guide

- `data/catalog.json`: game/map metadata and source links.
- `data/guides-classic.json`, `data/guides-modern.json`, `data/guides-extra.json`, `data/guides-aw.json`, `data/guides-completion-*.json`, `data/guides-super-ee-doa4.json`: researched walkthroughs and attributed supplemental topics.
- `data/guides-goal-*.json`: additional researched routes, seasonal intel checklists, equipment catalogs and source corrections from the current audit.
- `data/guides-community.json`: complete captured community topics, with shared-version map IDs and sanitized step HTML. Runtime IDs combine the map ID and stable topic ID.
- `data/community-corrections.json`: reviewed field overrides applied after the community import, so a refresh preserves corrected steps, version scopes and location galleries.
- `data/references.json`: attributed community chapters, already rendered and sanitized for the static site.
- `data/media.json`: local images, captions, and attribution.
- `data/coverage-gaps.json`: identified gaps in the site's research, shown on affected maps and the Coverage page.

Guide IDs are stable. Progress stores completed step titles, so moving a step does not mark a different step complete. Renaming a step makes that step unchecked. Every guide must name an existing map ID, have unique step titles, and include sources. A `sourceQuote` guide displays sanitized `step.html` inside an attributed blockquote; original prose uses escaped `step.body`. A quoted step may name its own `researchSource`; researched replacements use `original: true` and omit `html`. Optional `step.images` and `guide.images` use the media schema with local paths, captions and source links. Run `npm test` after changing content.

`scripts/import-references.py` rebuilds quoted references, individual community topics and source-gap records from an ignored `output/reference-snapshots.json` research snapshot and `data/reddit-sources.json`. It requires the Python `markdown` package only when refreshing those references; neither Python nor Markdown is used by the deployed site. It preserves nested instructions, gives numbered main routes individual checklist steps, applies `community-corrections.json` and omits song lyrics. Do not substitute a partial source snapshot for a complete chapter. Source comparison and passing site tests do not establish gameplay accuracy or exhaustive coverage.

Use the correction link inside a guide to open a GitHub issue with the game version, incorrect or missing step, and a supporting source.
