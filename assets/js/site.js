/* ================================================================
 *  Renderer.  All content lives in /content.yml at the repo root.
 *  Each page declares what to render via `data-section` placeholders.
 *
 *  Sections available out of the box:
 *    data-section="about"               bio paragraphs + portrait
 *    data-section="highlight"           home-page timeline
 *    data-section="elsewhere"           contact / link list
 *    data-section="publications-intro"  intro line for research page
 *    data-section="publications"        year groups + cards
 *
 *  Add a new section: write a renderer function and register it in
 *  the `renderers` map at the bottom.
 * ================================================================ */

const CONTENT_URL = '/content.yml';

const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

const escapeHtml = s => String(s ?? '').replace(/[&<>"']/g, c =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

const inlineMd = s =>
  (window.marked ? marked.parseInline(String(s ?? ''), { mangle: false, headerIds: false }) : escapeHtml(s));

function highlightMe(text, me) {
  if (!me) return escapeHtml(text);
  const safe = escapeHtml(text);
  const meEsc = escapeHtml(me).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return safe.replace(new RegExp(`(${meEsc}\\*?)`, 'g'), '<span class="me">$1</span>');
}

const isExternal = href => /^https?:/.test(href) && !href.includes(location.host);
const externalAttrs = href => (isExternal(href) ? ' target="_blank" rel="noopener"' : '');

/* --------------------- header / footer -------------------------- */

function renderHeader(el, content) {
  const cfg = content.site || {};
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  const links = (cfg.nav || []).map(item => {
    const m = item.match == null ? [] : (Array.isArray(item.match) ? item.match : [item.match]);
    const cur = m.some(s => String(s).toLowerCase() === path || (s === '' && path === 'index.html'));
    const aria = cur ? ' aria-current="page"' : '';
    return `<a href="${escapeHtml(item.href)}"${aria}${externalAttrs(item.href)}>${escapeHtml(item.label)}</a>`;
  }).join('');

  el.innerHTML =
    `<a class="brand" href="${escapeHtml(cfg.brand_href || '/')}">${escapeHtml(cfg.brand || '')}</a>` +
    `<nav class="site-nav">${links}</nav>`;
}

function renderFooter(el, content) {
  const cfg = content.site || {};
  const year = new Date().getFullYear();
  el.innerHTML = `<span class="mark">${escapeHtml(cfg.brand || '')}</span>` +
                 `<span class="right"><span>© ${year}</span></span>`;
}

/* --------------------- section renderers ------------------------ */

function renderAbout(content) {
  const a = content.about || {};
  const paras = (a.paragraphs || []).map(p => `<p>${inlineMd(p)}</p>`).join('');
  const photo = a.photo
    ? `<div class="intro-photo"><img src="${escapeHtml(a.photo)}" alt="Portrait" /></div>`
    : '';
  const cls = a.photo ? 'intro' : 'intro no-photo';
  return `<section class="${cls}"><div>${paras}</div>${photo}</section>`;
}

function renderTimelineItem(item, me) {
  const cls = `t-item ${item.type || 'plain'}`;
  const tag = item.href ? 'a' : 'article';
  const hrefAttr = item.href
    ? ` href="${escapeHtml(item.href)}"${externalAttrs(item.href)}`
    : ' style="cursor: default;"';
  const idAttr = item.id ? ` id="${escapeHtml(item.id)}"` : '';

  const authors = item.authors
    ? `<p class="t-authors">${highlightMe(item.authors, me)}</p>`
    : '';
  const body = item.body ? `<p class="t-body">${inlineMd(item.body)}</p>` : '';
  const tags = item.tags && item.tags.length
    ? `<div class="t-tags">${item.tags.map(t =>
        `<a class="t-tag" href="${escapeHtml(t.href)}"${externalAttrs(t.href)}>${escapeHtml(t.label)}</a>`
      ).join('')}</div>`
    : '';

  return `<${tag}${idAttr} class="${cls}"${hrefAttr}>
    <span class="t-dot"></span>
    <div class="t-head">
      <div class="t-title">${escapeHtml(item.title || '')}</div>
      <div class="t-date">${escapeHtml(item.date || '')}</div>
    </div>
    ${authors}${body}${tags}
  </${tag}>`;
}

function renderTimeline(items, me) {
  return `<div class="timeline-wrap"><div class="timeline">${
    items.map(i => renderTimelineItem(i, me)).join('')
  }</div></div>`;
}

const renderHighlight          = c => renderTimeline(c.highlight || [], c.me);
const renderPublicationsIntro  = c =>
  `<section class="intro no-photo"><div><p>${inlineMd(c.publications_intro || '')}</p></div></section>`;
const renderPublications       = c =>
  (c.publications || []).map(g =>
    `<div class="section-label">${escapeHtml(g.year)}</div>` + renderTimeline(g.items || [], c.me)
  ).join('');
const renderElsewhere          = c =>
  `<div class="contacts">${
    (c.elsewhere || []).map(l =>
      `<a href="${escapeHtml(l.href)}"${externalAttrs(l.href)}>${escapeHtml(l.label)}</a>`
    ).join('')
  }</div>`;
const renderVisitorMap         = c => {
  const m = c.visitor_map;
  if (!m || !m.src) return '';
  const inner = `<img src="${escapeHtml(m.src)}" alt="${escapeHtml(m.alt || 'Visitor Map')}" loading="lazy" />`;
  return `<div class="visitor-map">${
    m.href
      ? `<a href="${escapeHtml(m.href)}"${externalAttrs(m.href)} title="Visit tracker">${inner}</a>`
      : inner
  }</div>`;
};

/* --------------------- registry --------------------------------- */

const renderers = {
  about: renderAbout,
  highlight: renderHighlight,
  elsewhere: renderElsewhere,
  'publications-intro': renderPublicationsIntro,
  publications: renderPublications,
  'visitor-map': renderVisitorMap,
};

/* --------------------- bootstrap -------------------------------- */

async function boot() {
  let content;
  try {
    const res = await fetch(CONTENT_URL, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`fetch ${CONTENT_URL}: ${res.status}`);
    content = jsyaml.load(await res.text());
  } catch (err) {
    console.error('Failed to load content.yml:', err);
    return;
  }

  const header = $('[data-site-header]');
  if (header) renderHeader(header, content);

  const footer = $('[data-site-footer]');
  if (footer) renderFooter(footer, content);

  $$('[data-section]').forEach(el => {
    const name = el.getAttribute('data-section');
    const fn = renderers[name];
    if (fn) el.innerHTML = fn(content);
    else console.warn(`Unknown section: ${name}`);
  });
}

boot();
