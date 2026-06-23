/* ================================================================
 *  SITE CONFIG  —  edit me to change the nav, brand, or footer.
 *  Every page on the site loads this file at the bottom.
 * ================================================================ */

const SITE = {
  brand: 'Bingda Tang「湯秉達」',
  brandHref: '/',

  // Nav links appear in this order. Add / remove / reorder freely.
  // `match` is what the script uses to highlight the current page.
  // Use either a string (matches a path segment) or an array of strings.
  nav: [
    { label: 'Home',     href: '/',                       match: ['', 'index.html'] },
    { label: 'Research', href: '/publications.html',      match: 'publications.html' },
    { label: 'CV',       href: '/assets/pdf/CV.pdf' },
    { label: 'Contact',  href: 'mailto:tangbd2003@gmail.com' },
  ],

  footerCopyright: true,
};

/* ----- end of config — internals below ----- */

(function () {
  const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();

  function isCurrent(item) {
    if (!item.match) return false;
    const m = Array.isArray(item.match) ? item.match : [item.match];
    return m.some(s => s.toLowerCase() === path || (s === '' && path === 'index.html'));
  }

  function renderHeader(el) {
    const links = SITE.nav.map(item => {
      const aria = isCurrent(item) ? ' aria-current="page"' : '';
      const target = /^https?:|^mailto:/.test(item.href) && !item.href.includes(location.host)
        ? ' target="_blank" rel="noopener"'
        : '';
      return `<a href="${item.href}"${aria}${target}>${item.label}</a>`;
    }).join('');

    el.innerHTML =
      `<a class="brand" href="${SITE.brandHref}">${SITE.brand}</a>` +
      `<nav class="site-nav">${links}</nav>`;
  }

  function renderFooter(el) {
    const year = new Date().getFullYear();
    const copyright = SITE.footerCopyright
      ? `<span class="right"><span>© ${year}</span></span>`
      : '';
    el.innerHTML = `<span class="mark">${SITE.brand}</span>${copyright}`;
  }

  const header = document.querySelector('[data-site-header]');
  if (header) renderHeader(header);

  const footer = document.querySelector('[data-site-footer]');
  if (footer) renderFooter(footer);
})();
