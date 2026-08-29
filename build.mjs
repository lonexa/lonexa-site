/**
 * Builds privacy.html and terms.html from the markdown in content/.
 *
 * Why a script rather than hand-written HTML: the source documents each end
 * with an HTML comment block marked "MAINTAINER NOTE - not published". Hand
 * conversion is exactly the kind of job where that survives into page source.
 * Stripping comments is step one here and the build asserts afterwards that
 * nothing resembling a maintainer note made it through.
 *
 * The source of truth for these documents is the app repository at
 * docs/legal/. Re-copy them into content/ and re-run `node build.mjs` when
 * they change.
 *
 *   node build.mjs
 */

import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';

/**
 * Each document is emitted as `<dir>/index.html` so it serves at a clean
 * `/privacy/` rather than `/privacy.html`. These URLs are hardcoded into the
 * app (`compliance/copy.ts`) and go on the Play listing, so they need to
 * resolve without depending on the host's extension-stripping behaviour.
 */
const PAGES = [
  { md: 'content/privacy-policy.md',   dir: 'privacy', slug: 'Privacy Policy' },
  { md: 'content/terms-of-service.md', dir: 'terms',   slug: 'Terms of Service' },
  // Google Play requires a publicly reachable account-deletion URL for any app
  // that lets somebody create an account, and it has to work *without*
  // installing the app - a reviewer, or somebody who already uninstalled, has
  // to be able to reach it. `/delete/` is the constant in
  // `compliance/copy.ts` (ACCOUNT_DELETION_URL), so the directory name is not
  // free to change.
  { md: 'content/account-deletion.md', dir: 'delete',  slug: 'Delete your account' },
];

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Inline markup, applied to already-escaped text. */
function inline(s) {
  return s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, href) => {
      // Cross-document links in the markdown point at sibling .md files.
      const to = href
        .replace(/^\.\/privacy-policy\.md$/, '/privacy/')
        .replace(/^\.\/terms-of-service\.md$/, '/terms/');
      return `<a href="${to}">${text}</a>`;
    });
}

function renderTable(lines) {
  const cells = (row) =>
    row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  const head = cells(lines[0]);
  const body = lines.slice(2).map(cells);
  const th = head.map((c) => `<th>${inline(esc(c))}</th>`).join('');
  const tr = body
    .map((r) => `<tr>${r.map((c) => `<td>${inline(esc(c))}</td>`).join('')}</tr>`)
    .join('\n');
  return `<div class="table-wrap"><table>\n<thead><tr>${th}</tr></thead>\n<tbody>\n${tr}\n</tbody>\n</table></div>`;
}

function toHtml(md) {
  // 1. Strip HTML comments. This is the whole reason the build exists.
  const clean = md.replace(/<!--[\s\S]*?-->/g, '');

  const blocks = clean.split(/\n{2,}/);
  const out = [];
  let title = '';

  for (const raw of blocks) {
    const block = raw.replace(/\s+$/, '');
    if (!block.trim()) continue;

    const lines = block.split('\n');

    if (/^# /.test(lines[0])) {
      title = lines[0].replace(/^# /, '').trim();
      continue; // rendered by the page shell, not inline
    }
    if (/^## /.test(lines[0])) {
      out.push(`<h2>${inline(esc(lines[0].replace(/^## /, '')))}</h2>`);
      continue;
    }
    if (/^### /.test(lines[0])) {
      out.push(`<h3>${inline(esc(lines[0].replace(/^### /, '')))}</h3>`);
      continue;
    }
    if (/^---+$/.test(block.trim())) {
      out.push('<hr>');
      continue;
    }
    if (lines[0].trim().startsWith('|') && lines.length > 2) {
      out.push(renderTable(lines));
      continue;
    }
    if (/^[-*] /.test(lines[0].trim())) {
      // List items may wrap onto continuation lines.
      const items = [];
      for (const line of lines) {
        if (/^[-*] /.test(line.trim())) items.push(line.trim().replace(/^[-*] /, ''));
        else if (items.length) items[items.length - 1] += ' ' + line.trim();
      }
      out.push(
        `<ul>\n${items.map((i) => `<li>${inline(esc(i))}</li>`).join('\n')}\n</ul>`,
      );
      continue;
    }

    const text = inline(esc(lines.join(' ').replace(/\s+/g, ' ')));
    const cls = /^<strong>Last updated/.test(text) ? ' class="updated"' : '';
    out.push(`<p${cls}>${text}</p>`);
  }

  return { title, body: out.join('\n\n') };
}

function shell({ title, body, slug, dir }) {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Lonexa LLC</title>
<meta name="description" content="${esc(slug)} for Steady Increment, published by Lonexa LLC.">
<link rel="canonical" href="https://lonexa.ai/${dir}/">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@600;700&family=JetBrains+Mono:wght@400;500&family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,600;1,8..60,400&display=swap" rel="stylesheet">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="/assets/site.css">
</head>
<body>

<div class="shell">
  <header class="masthead">
    <a class="wordmark" href="/">Lonexa<span class="dot">.</span></a>
    <nav>
      <a href="/privacy/">Privacy</a>
      <a href="/terms/">Terms</a>
    </nav>
  </header>
</div>

<div class="shell doc">
  <div class="doc-inner">
    <a class="backlink" href="/">&larr; Lonexa</a>
    <h1>${esc(title)}</h1>

${body}

  </div>
</div>

<div class="shell">
  <footer>
    <span>&copy; 2026 Lonexa LLC. A Kentucky limited liability company.</span>
    <span><a href="/">lonexa.ai</a></span>
  </footer>
</div>

</body>
</html>
`;
}

let failed = false;

for (const page of PAGES) {
  const md = readFileSync(new URL(page.md, import.meta.url), 'utf8');
  const { title, body } = toHtml(md);
  const html = shell({ title, body, slug: page.slug, dir: page.dir });
  const out = `${page.dir}/index.html`;

  // 2. Assert nothing private leaked. Cheap, and the failure mode it guards
  //    against is publishing an internal note to a public website.
  for (const needle of ['MAINTAINER', 'not published', '<!--', 'steadyincrement.app']) {
    if (html.includes(needle)) {
      console.error(`FAIL ${out}: found ${JSON.stringify(needle)} in output`);
      failed = true;
    }
  }

  mkdirSync(new URL(`${page.dir}/`, import.meta.url), { recursive: true });
  writeFileSync(new URL(out, import.meta.url), html);
  console.log(`built ${out.padEnd(20)} ${String(html.length).padStart(6)} bytes  "${title}"`);
}

if (failed) process.exit(1);
console.log('ok — no maintainer notes in output');
