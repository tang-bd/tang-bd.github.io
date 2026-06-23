# tang-bd.github.io

Personal site — pure HTML/CSS, no build step.

## Local preview

```bash
cd site
python3 -m http.server 4000
```

Open <http://localhost:4000>. Edits show up on refresh.

## Deploy to GitHub Pages

1. Push this branch to GitHub
2. Repo **Settings → Pages**
3. **Source**: `Deploy from a branch` → pick the branch + folder `/site`

That's the whole deploy. `.nojekyll` tells Pages to skip Jekyll.
(If you'd rather have the site at the repo root, move everything in
`site/` up one level before pushing.)

---

## How to edit content

Every page lives in a single HTML file. Open it in any editor and the
content is right there as plain HTML — no templating.

```
site/
├── index.html          ← Home: intro + Highlight timeline + Elsewhere
├── publications.html   ← Research: all papers grouped by year
├── template.html       ← copy me to make a new page
├── assets/
│   ├── css/style.css   ← all styling
│   ├── js/site.js      ← brand, nav links, footer config
│   ├── img/photo.jpg   ← portrait
│   └── pdf/CV.pdf
```

### Brand / nav / footer (one place)

Open **`assets/js/site.js`** and edit the `SITE` object at the top.
Every page renders its header and footer from this config, so you only
edit it once:

```js
const SITE = {
  brand: 'Bingda Tang「湯秉達」',
  brandHref: '/',
  nav: [
    { label: 'Home',     href: '/',                   match: ['', 'index.html'] },
    { label: 'Research', href: '/publications.html',  match: 'publications.html' },
    { label: 'CV',       href: '/assets/pdf/CV.pdf' },
    { label: 'Contact',  href: 'mailto:tangbd2003@gmail.com' },
  ],
};
```

### Adding a new page

1. Duplicate `template.html` → e.g. `talks.html`
2. Edit the `<title>`, `<meta description>`, and the content block
   between the `EDIT FROM HERE` / `STOP EDITING HERE` markers
3. Open `assets/js/site.js` and add one line to the `nav` array:

   ```js
   { label: 'Talks', href: '/talks.html', match: 'talks.html' },
   ```

That's it. Header, footer, fonts, and styles are picked up automatically.

### Removing a page

Delete the `.html` file and remove its line from `nav` in
`assets/js/site.js`.

### Adding items to a timeline

Each list (Highlight, the year groups in Research, any future page)
is just a `<div class="timeline">…</div>` containing one `<a>` or
`<article>` per row. Three row styles:

| class | look | use for |
|---|---|---|
| `t-item feature` | white card + black border + hard shadow | first / co-first author papers, headline announcements |
| `t-item soft`    | light grey card | other co-authored papers |
| `t-item plain`   | no card, hover background | short news / events |

Copy any existing `<a class="t-item …">` block and edit the title /
date / authors / tags.

### Changing the colour palette

Open `assets/css/style.css`. The top `:root { … }` block has every
colour as a CSS variable. Edit a variable and the change ripples
through the whole site. Dark-mode values live in the next block.
