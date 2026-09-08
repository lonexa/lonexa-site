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
/**
 * Every published document is namespaced under its app.
 *
 * `lonexa.ai/steady-increment/privacy/`, not `lonexa.ai/privacy/`. Lonexa will
 * host more than one app, and each needs its own privacy policy, terms and
 * deletion page - a second app arriving later would otherwise have nowhere to
 * put them without moving these, and moving a privacy-policy URL that a store
 * listing already points at is the kind of change nobody wants to make twice.
 *
 * Done before anything was submitted to Play, which is the only free moment.
 * The Play listing, the app's own `compliance/copy.ts` and the Supabase account
 * settings all reference these URLs; changing them after submission means a
 * listing update and a store review.
 *
 * **The old top-level paths still resolve** - see `REDIRECTS` below. That is not
 * politeness: build `9cdf9812` has the old URLs compiled into its bundle and is
 * on a phone, so `/privacy/` has to keep working until an update replaces it.
 */
/**
 * Every app Lonexa publishes, and the documents each one needs.
 *
 * This used to be `const APP = 'steady-increment'`, which is why a second app
 * had nowhere to put its legal pages and its Play listing pointed at a URL that
 * returned 404. Content moved to `content/<slug>/` in the same change.
 *
 * **`delete` is not automatic, and must not be.** Google Play requires a
 * publicly reachable account-deletion URL for any app that lets somebody create
 * an account, reachable *without* installing it — a reviewer, or somebody who
 * already uninstalled, has to get there. An app with no account has nothing to
 * delete on a server and no such page; publishing one anyway would describe a
 * deletion process that does not exist, which is worse than not having the
 * page. So it is listed per app, by someone who knows whether that app has
 * accounts.
 */
const APPS = [
  {
    slug: 'steady-increment',
    name: 'Steady Increment',
    docs: ['privacy', 'terms', 'delete'],
  },
  {
    // Local profile: no account, no sign-in, no server. Nothing to delete
    // anywhere but the phone, so no /delete/ page.
    slug: 'booth-log',
    name: 'Booth Log',
    docs: ['privacy', 'terms'],
  },
  {
    // The one app here that is NOT local-first, and the reason it needs all
    // three: matches are simulated on a server because a game between two
    // people's teams cannot be decided by either person's phone. So an account
    // is required rather than optional, and there is a real server-side record
    // to delete.
    //
    // The slug is one word because the app is - `ai.lonexa.micromajors`, and
    // the Expo slug `micromajors`. `steady-increment` and `booth-log` are
    // hyphenated because those names are two words, not because of a rule.
    slug: 'micromajors',
    name: 'MicroMajors',
    docs: ['privacy', 'terms', 'delete'],
  },
];

/** What each document is called, and where it comes from. */
const DOCS = {
  privacy: { md: 'privacy-policy.md', dir: 'privacy', slug: 'Privacy Policy' },
  terms: { md: 'terms-of-service.md', dir: 'terms', slug: 'Terms of Service' },
  delete: { md: 'account-deletion.md', dir: 'delete', slug: 'Delete your account' },
};

const PAGES = APPS.flatMap((app) =>
  app.docs.map((key) => {
    const doc = DOCS[key];
    if (!doc) throw new Error(`${app.slug}: unknown document "${key}"`);
    return {
      app,
      md: `content/${app.slug}/${doc.md}`,
      dir: `${app.slug}/${doc.dir}`,
      slug: doc.slug,
    };
  }),
);

/**
 * Stubs kept at the old top-level paths.
 *
 * A build already installed on a phone links to `/privacy/` and `/terms/`, and
 * a 404 behind a "Privacy policy" row reads as a broken app rather than a moved
 * page. GitHub Pages serves static files with no server-side redirect, so these
 * are meta-refresh pages that also carry `rel=canonical` at the new URL, which
 * is what tells a search engine the move was deliberate.
 *
 * Safe to delete once no shipped build points at them - which means after the
 * Play listing is live on the new URLs and both phones have taken an update.
 */
const REDIRECTS = [
  { from: 'privacy', to: '/steady-increment/privacy/' },
  { from: 'terms',   to: '/steady-increment/terms/' },
  { from: 'delete',  to: '/steady-increment/delete/' },
];

const esc = (s) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Inline markup, applied to already-escaped text. */
function inline(appSlug, s) {
  return s
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/(^|[\s(])\*([^*\n]+)\*/g, '$1<em>$2</em>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_m, text, href) => {
      // Cross-document links in the markdown point at sibling .md files.
      const to = href
        .replace(/^\.\/privacy-policy\.md$/, `/${appSlug}/privacy/`)
        .replace(/^\.\/terms-of-service\.md$/, `/${appSlug}/terms/`)
        .replace(/^\.\/account-deletion\.md$/, `/${appSlug}/delete/`);
      return `<a href="${to}">${text}</a>`;
    });
}

function renderTable(appSlug, lines) {
  const cells = (row) =>
    row.trim().replace(/^\||\|$/g, '').split('|').map((c) => c.trim());
  const head = cells(lines[0]);
  const body = lines.slice(2).map(cells);
  const th = head.map((c) => `<th>${inline(appSlug, esc(c))}</th>`).join('');
  const tr = body
    .map((r) => `<tr>${r.map((c) => `<td>${inline(appSlug, esc(c))}</td>`).join('')}</tr>`)
    .join('\n');
  return `<div class="table-wrap"><table>\n<thead><tr>${th}</tr></thead>\n<tbody>\n${tr}\n</tbody>\n</table></div>`;
}

function toHtml(md, appSlug) {
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
      out.push(`<h2>${inline(appSlug, esc(lines[0].replace(/^## /, '')))}</h2>`);
      continue;
    }
    if (/^### /.test(lines[0])) {
      out.push(`<h3>${inline(appSlug, esc(lines[0].replace(/^### /, '')))}</h3>`);
      continue;
    }
    if (/^---+$/.test(block.trim())) {
      out.push('<hr>');
      continue;
    }
    if (lines[0].trim().startsWith('|') && lines.length > 2) {
      out.push(renderTable(appSlug, lines));
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
        `<ul>\n${items.map((i) => `<li>${inline(appSlug, esc(i))}</li>`).join('\n')}\n</ul>`,
      );
      continue;
    }

    const text = inline(appSlug, esc(lines.join(' ').replace(/\s+/g, ' ')));
    const cls = /^<strong>Last updated/.test(text) ? ' class="updated"' : '';
    out.push(`<p${cls}>${text}</p>`);
  }

  return { title, body: out.join('\n\n') };
}

function shell({ title, body, slug, dir, app }) {
  // Only the documents this app actually publishes. A nav link to a
  // /delete/ page an app does not have is a 404 in the footer of its own
  // privacy policy, which is exactly where a Play reviewer looks.
  const nav = app.docs
    .map((key) => {
      const label =
        key === 'privacy' ? 'Privacy' : key === 'terms' ? 'Terms' : 'Delete account';
      return `      <a href="/${app.slug}/${DOCS[key].dir}/">${label}</a>`;
    })
    .join('\n');

  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)} · Lonexa LLC</title>
<meta name="description" content="${esc(slug)} for ${esc(app.name)}, published by Lonexa LLC.">
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
${nav}
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
  const { title, body } = toHtml(md, page.app.slug);
  const html = shell({ title, body, slug: page.slug, dir: page.dir, app: page.app });
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

/**
 * The redirect stubs, written after the real pages.
 *
 * Meta refresh plus a JS replace: the meta tag works with scripting disabled,
 * and `location.replace` does not add the stub to the browser's back stack, so
 * Back from the policy goes where the reader came from rather than bouncing
 * them through the redirect again.
 *
 * `rel=canonical` at the destination is what tells a search engine this is a
 * move rather than duplicate content.
 */
for (const redirect of REDIRECTS) {
  const html = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>Moved</title>
<meta http-equiv="refresh" content="0; url=${redirect.to}">
<link rel="canonical" href="https://lonexa.ai${redirect.to}">
<meta name="robots" content="noindex">
</head>
<body>
<p>This page has moved to <a href="${redirect.to}">${redirect.to}</a>.</p>
<script>location.replace(${JSON.stringify(redirect.to)});</script>
</body>
</html>
`;
  mkdirSync(new URL(`${redirect.from}/`, import.meta.url), { recursive: true });
  writeFileSync(new URL(`${redirect.from}/index.html`, import.meta.url), html);
  console.log(`redirect ${`/${redirect.from}/`.padEnd(11)} -> ${redirect.to}`);
}

if (failed) process.exit(1);
console.log('ok — no maintainer notes in output');
