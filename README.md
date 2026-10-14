# Dead Drop

A static Call of Duty Zombies field manual, hosted on GitHub Pages.

Choose a game, choose a map, and open a quest. Search covers map names, walkthrough titles, and community chapter/topic names. The community reader has its own search for details inside a chapter. Original walkthroughs include prerequisites, player requirements, ordered steps, source links, and a checklist saved in browser storage. Progress stays on the current browser and device.

## Content and coverage

The catalog indexes 19 games and spin-offs and 145 map/mode entries as of October 13, 2026. Original releases, remasters, survival variants, and arcade modes have separate entries. Custom maps, mods, campaign reskins, and temporary Warzone events are outside the catalog.

This is an expanding reference, not a verified exhaustive archive. The Coverage page reports the current walkthrough and reference counts. Original walkthroughs are researched from their credited sources and have not been independently playtested. Some maps have source links while their in-site walkthroughs are still being researched.

The community reader contains attributed quotations from r/CODZombies, including its original caveats and unfinished sections. Empty template pages are excluded. Large cipher transcriptions that could not be captured completely link to the original source. References shared between original maps and remasters clearly say they can cover multiple versions. Follow the version-specific original walkthrough when available.

Images are credited to Call of Duty / Activision and their source pages. Cards without a map-specific image identify their game artwork or placeholder. Images illustrate the map or named location; they are not invented gameplay markers.

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
- `data/guides-classic.json`, `data/guides-modern.json`, `data/guides-extra.json`, `data/guides-aw.json`: original walkthroughs.
- `data/references.json`: attributed community chapters, already rendered and sanitized for the static site.
- `data/media.json`: local images, captions, and attribution.

Guide IDs are stable. Progress stores completed step titles, so moving a step does not mark a different step complete. Renaming a step makes that step unchecked. Every guide must name an existing map ID, have unique step titles, and include sources. Run `npm test` after changing content.

`scripts/import-references.py` rebuilds quoted references from an ignored `output/reference-snapshots.json` research snapshot and `data/reddit-sources.json`. It requires the Python `markdown` package only when refreshing those references; neither Python nor Markdown is used by the deployed site. Do not substitute a partial source snapshot for a complete chapter.

Use the correction link inside a guide to open a GitHub issue with the game version, incorrect or missing step, and a supporting source.
