# tang-bd.github.io

Personal site. Pure static HTML/CSS/JS, no build step, all content
in one YAML file.

```
.
├── index.html          ← Home page
├── publications.html   ← Research page
├── template.html       ← Copy me to add a new page
├── content.yml         ← ★ ALL content lives here ★
├── assets/
│   ├── css/style.css   ← Theme + colour variables
│   ├── js/site.js      ← YAML → HTML renderer
│   ├── img/photo.jpg   ← Portrait
│   └── pdf/CV.pdf
├── .nojekyll           ← Tells GitHub Pages to skip Jekyll
├── LICENSE
└── README.md
```

---

## Quick start

```bash
python3 -m http.server 4000
```

Open <http://localhost:4000>. Edit any file → refresh.

> **Why a server?** The page loads `content.yml` via `fetch`,
> which browsers block on `file://`. The one-liner above is the
> simplest dev server; any static server will do.

---

## Deploy to GitHub Pages

1. Push to GitHub (this branch is `redesign`)
2. Repo **Settings → Pages → Build and deployment**
3. **Source**: `Deploy from a branch`
4. **Branch**: `redesign`, **Folder**: `/ (root)`, Save

Live at `https://<user>.github.io/` within ~30s. Every later push
to `redesign` republishes automatically.

### Deploy notes

- `.nojekyll` keeps GitHub Pages from running Jekyll on the repo
- All asset paths are root-relative (`/assets/…`). On a user site
  this works directly; on a project site (`<user>.github.io/repo`)
  you'd need to swap them to relative paths.
- The original al-folio Jekyll source still lives on the `master`
  branch (and its build on `gh-pages`). They're untouched —
  switching the Pages source back to either is the rollback path.

---

## Editing content

**99% of edits happen in one file: `content.yml`.** Open it, change
text, refresh the browser. The YAML structure mirrors what's on the
page; comments at the top of the file explain each section.

### The YAML at a glance

```yaml
me: Bingda Tang     # auto-bolded wherever it appears in `authors:`

site:               # brand, nav, footer
  brand: 'Bingda Tang「湯秉達」'
  nav: [...]

about:              # home-page bio (markdown allowed in paragraphs)
  photo: /assets/img/photo.jpg
  paragraphs: [...]

highlight: [...]    # home-page timeline (one big mixed list)

publications_intro: '...'
publications:       # research page, grouped by year
  - year: '2026'
    items: [...]

elsewhere: [...]    # contact links
```

### Adding a row to a timeline

Every timeline row has the same shape. Pick `type:` and fill in the
fields you want — extras are ignored:

```yaml
- type: feature           # feature | soft | plain
  title: My paper title
  date: CVPR 2027         # or "May 18, 2026" for news
  authors: Bingda Tang, Co-Author, Other Co-Author   # optional
  href: https://arxiv.org/abs/...                    # optional
  id: my-paper-id                                    # optional anchor
  body: One-line description.                        # optional, markdown
  tags:                                              # optional
    - { label: arXiv, href: https://arxiv.org/abs/... }
    - { label: Code,  href: https://github.com/... }
```

| `type:`   | Looks like                              | Use for                                  |
|-----------|-----------------------------------------|------------------------------------------|
| `feature` | white card, **black border**, hard shadow | first / co-first author papers, headlines |
| `soft`    | white with a thin grey border           | other co-authored papers                 |
| `plain`   | no card, just a hover background        | short news rows / events                 |

### Highlighting your own name

The top-level `me:` key (e.g. `me: Bingda Tang`) is auto-bolded
wherever it appears in an `authors:` line. The match is exact and
case-sensitive; a trailing `*` (for co-first) is included. So
`Bingda Tang*` in `Luo*, Bingda Tang*, ...` highlights correctly.

### Markdown in prose fields

`about.paragraphs`, `publications_intro`, and any `body:` field are
parsed as inline Markdown. So `[Tsinghua](https://tsinghua.edu.cn/)`
becomes a link. `**bold**` and `*italic*` also work. Plain string
fields (titles, dates, authors, labels) are NOT parsed — they're
escaped and rendered verbatim.

### Reordering items

Order in the YAML = order on the page. Cut/paste blocks to reorder.

---

## Pages

Each page is a thin HTML shell that declares which content sections
to render. Look at `index.html`:

```html
<header class="site" data-site-header></header>

<div data-section="about"></div>
<div class="section-label">Highlight</div>
<div data-section="highlight"></div>
…
<div data-section="elsewhere"></div>

<footer class="site" data-site-footer></footer>
```

The renderer (`assets/js/site.js`) sees the `data-section` attributes
and fills each placeholder from `content.yml`.

### Built-in sections

| `data-section`         | What it renders                                |
|------------------------|------------------------------------------------|
| `about`                | bio paragraphs + portrait                      |
| `highlight`            | the home-page timeline                         |
| `elsewhere`            | the contact link list                          |
| `publications-intro`   | the research-page intro paragraph              |
| `publications`         | all publication year groups, with labels       |
| `visitor-map`          | mapmyvisitors.com tracker image (centered)     |

You can use a section more than once on a page, or skip any of them.

### Adding a new page

1. Copy `template.html` → e.g. `talks.html`
2. Edit `<title>` and `<meta description>` at the top
3. Inside the body, mix `<div data-section="…">` placeholders with
   whatever raw HTML you want
4. Open `content.yml` and add a nav entry:

   ```yaml
   site:
     nav:
       - ...
       - { label: Talks, href: /talks.html, match: talks.html }
   ```

The header/footer/styles/fonts are picked up automatically. The
`match` field is what the script compares to the current path so the
nav item gets highlighted as the active page.

### Removing a page

Delete the `.html` file and remove its line from `site.nav` in
`content.yml`.

### Adding a brand-new section type

If a new page needs something that doesn't fit the existing
sections (e.g. a 3-column grid of project cards), add a renderer
in `assets/js/site.js`:

```js
function renderProjects(content) {
  return (content.projects || []).map(p => `…`).join('');
}
// register it
const renderers = {
  …,
  projects: renderProjects,
};
```

Then add `projects: [...]` to `content.yml` and drop
`<div data-section="projects"></div>` wherever you want it.

---

## Styling

All colours are CSS variables. Open `assets/css/style.css`, the
top `:root { … }` block is the light theme, the next
`@media (prefers-color-scheme: dark)` block is dark mode. Edit a
variable and the change ripples through the whole site.

Most useful knobs:

| variable                | what it controls                       |
|-------------------------|----------------------------------------|
| `--bg`                  | page background                        |
| `--fg`, `--fg-strong`   | body text, headings/labels             |
| `--fg-muted`            | secondary text (dates, descriptions)   |
| `--rule`                | timeline rules, hairlines              |
| `--rule-strong`         | bold-card borders, nav underlines      |
| `--shadow`              | feature-card drop shadow               |
| `--card-soft-border`    | soft-card border                       |
| `--accent`              | brand hover colour                     |

Layout knobs:

| selector                | what                          |
|-------------------------|-------------------------------|
| `.shell { padding }`    | side gutters                  |
| `.container { max-width }` | column width               |
| `.intro { grid-template-columns }` | width of the portrait |

---

## Architecture (one-pager)

```
HTML page  →  loads /content.yml  →  passes data to renderers in site.js
                                         │
                            data-section="about"      → renderAbout()
                            data-site-header           → renderHeader()
                            data-section="highlight"  → renderHighlight()
                            ...
```

Two CDN dependencies (loaded from jsDelivr):

- **js-yaml** (~33 KB) — parses `content.yml`
- **marked** (~50 KB) — renders Markdown in prose fields

No build step. No Node. No Ruby. No Jekyll.

### File map

| Path                   | Role                                        |
|------------------------|---------------------------------------------|
| `index.html`           | Home shell                                  |
| `publications.html`    | Research shell                              |
| `template.html`        | Copy-me starter for new pages               |
| `content.yml`          | All editable content + nav + brand          |
| `assets/css/style.css` | Theme (CSS variables on top)                |
| `assets/js/site.js`    | YAML loader + section renderers             |
| `assets/img/photo.jpg` | Portrait                                    |
| `assets/pdf/CV.pdf`    | CV linked from nav                          |
| `.nojekyll`            | Disables Jekyll on GitHub Pages             |

---

## FAQ / gotchas

**My author name isn't bolded.** Check that the spelling in your
`authors:` line matches the `me:` value exactly (including case). A
trailing `*` is fine.

**A link in a paragraph isn't clickable.** Make sure it's
Markdown-style — `[label](url)`. Only prose fields
(`about.paragraphs`, `publications_intro`, `body`) are parsed as
Markdown; titles and labels aren't.

**Page loads blank.** Open the browser console. Common causes:
the YAML has a syntax error (`jsyaml` will say so), or you opened
the file with `file://`. Use a local server.

**Adding a new section breaks the page.** Check that the
`data-section` value matches a renderer key in `assets/js/site.js`.
Unknown names log a `Unknown section: ...` warning to the console
and skip rendering.

**I want to roll back to the old al-folio site.** In repo
Settings → Pages, switch the source back to the `gh-pages` branch
(or `master` with the Jekyll workflow). Both are still on origin.
