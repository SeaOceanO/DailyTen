# DailyTen Web Prototype

This is a standalone web version of DailyTen. The frontend is deliberately small:

- `index.html` is the page shell.
- `styles.css` is the warm paper/card visual system.
- `app.js` renders the briefing, accordion cards, reading progress, favorites, and "less like this".
- `data/today.json` is the latest DailyTen edition for quick loading.
- `data/editions/YYYY-MM-DD.json` stores each generated day permanently.
- `data/editions/index.json` tells the calendar which saved dates are available.

The main anti-redundancy rule is: the website only renders one stable JSON shape. The daily generation pipeline writes the latest edition to `data/today.json` and also archives the same edition by date, so old generated days are not lost.

## Current Status

The site currently uses local mock data only. No backend, database, NewsAPI, RSS, paid data feed, or live OpenAI call is active in the browser.

## Daily AI Generation Plan

`scripts/generate-dailyten.mjs` is the future daily-generation entry point:

1. Read personal interests from `config/interests.json`.
2. Fetch real candidate articles from GDELT.
3. Ask OpenAI to produce one structured DailyTen edition.
4. Validate the result against the expected shape.
5. Write the final edition to `data/today.json`.
6. Archive the same edition to `data/editions/YYYY-MM-DD.json`.
7. Update `data/editions/index.json` so the calendar can keep showing saved dates.

The browser never receives the OpenAI API key. Generation should run on GitHub Actions, Netlify Functions, or another server-side scheduler.

## Local Commands

Validate the current local data:

```bash
node scripts/generate-dailyten.mjs --validate-only
```

Serve locally:

```bash
python -m http.server 8101
```

Then open `http://127.0.0.1:8101/` from inside `web-prototype`.

## GitHub Actions

The workflow at `.github/workflows/dailyten-generate.yml` is scheduled for 21:00 UTC, which is 05:00 in Asia/Shanghai.

Before enabling it, set:

- repository secret: `OPENAI_API_KEY`
- repository variable: `OPENAI_MODEL`

If the repository is connected to Netlify, the workflow commits the updated `web-prototype/data` folder, then Netlify can deploy the updated static site with both the latest edition and historical archives.

## Netlify

`netlify.toml` points Netlify at this folder:

```toml
[build]
  publish = "web-prototype"
```

For the existing Netlify project, connect the GitHub repository and let Netlify publish this folder. A custom domain can be added later; it is not required for the first public version.
