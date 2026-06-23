# tang-bd.github.io

Personal site — a static, pi.website-inspired redesign.

## Local preview

From this `site/` directory:

```bash
python3 -m http.server 4000
```

Then open <http://localhost:4000>.

## Deploy to GitHub Pages

This site is plain HTML/CSS — no build step. The `.nojekyll` file tells
GitHub Pages to serve files as-is.

1. In the repo: **Settings → Pages**
2. Set **Source** to `Deploy from a branch`
3. Choose the branch and set the folder to `/site`
4. Save — your site will be live at `https://<user>.github.io/`

If you'd rather have the site at the repo root, move everything in `site/`
up one directory before pushing.

## Structure

```
site/
├── index.html         # Home: intro + recent timeline (papers & news)
├── publications.html  # Full research list, grouped by year
├── .nojekyll          # disables Jekyll on GitHub Pages
└── assets/
    ├── css/style.css
    ├── img/photo.jpg
    └── pdf/CV.pdf
```

### Adding items

A timeline item is just one `<a>` block inside `.timeline`:

- `.t-item.feature` — featured paper (white card, black border, hard shadow)
- `.t-item.soft` — secondary paper (soft beige card)
- `.t-item.plain` — plain news/event row (no card)

Copy any existing block to add new content.
