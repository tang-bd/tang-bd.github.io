# tang-bd.github.io

Personal site — a static, Anthropic-inspired redesign.

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
3. Choose this branch and set the folder to `/site`
4. Save — your site will be live at `https://<user>.github.io/`

If you'd rather have the site at the repo root, move everything in `site/`
up one directory before pushing.

## Structure

```
site/
├── index.html         # Home (about, selected papers, news, contact)
├── publications.html  # Full publications list (click "Abstract" to expand)
├── .nojekyll          # disables Jekyll on GitHub Pages
└── assets/
    ├── css/style.css
    ├── img/photo.jpg
    └── pdf/CV.pdf
```

Edit content directly in the HTML files. To add a publication, copy any
`<article class="pub">` block and adjust.
