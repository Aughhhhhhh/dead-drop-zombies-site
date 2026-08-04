# Dead Drop Zombies

A game-first Call of Duty Zombies guide archive.

## Navigation

1. Choose a Call of Duty game.
2. Choose a Zombies map or mode.
3. Open the main Easter egg or a categorized side guide.
4. Check off steps as you complete them. Progress is stored locally in the browser.

## Local preview

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Vercel

Import this repository into Vercel as an **Other** framework project. No build command or output directory is required. Every push to the default branch creates a new production deployment after the branch is assigned as Production in Vercel.

## Validation

```bash
npm test
```

The validation script checks JavaScript syntax, the guide data model, unique IDs, local file references, and required site files.
