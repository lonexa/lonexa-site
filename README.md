# lonexa.ai

The Lonexa LLC company site. Static HTML, no build step for the front page,
served by GitHub Pages at **https://lonexa.ai**.

It exists for two jobs:

1. The company website that Google Play Console requires for an organization
   developer account.
2. The public home for the **Privacy Policy** and **Terms of Service** that a
   Play Store listing must link to.

## Layout

```
index.html               Company page. Hand-written; edit directly.
<app>/index.html         Product page. HAND-WRITTEN; edit directly.
<app>/<topic>/index.html Marketing pages. HAND-WRITTEN; edit directly.
<app>/privacy/index.html GENERATED — do not edit. Run `node build.mjs`.
<app>/terms/index.html   GENERATED — do not edit.
<app>/delete/index.html  GENERATED — do not edit. Only for apps that have accounts.
privacy|terms|delete/    GENERATED redirect stubs at the old top-level paths.
404.html                 Hand-written.
assets/site.css          All styling for every page.
favicon.svg
content/<app>/*.md       Source for that app's legal pages.
build.mjs                content/<app>/*.md  ->  <app>/privacy/ + terms/ + delete/
CNAME                    Custom domain for GitHub Pages. Do not delete.
.nojekyll                Serve files as-is; skip Jekyll processing.
```

**Marketing pages are hand-written, and `build.mjs` never touches them.** The
build only ever writes the three legal paths and the redirect stubs — it
creates directories and files and deletes nothing — so a hand-written
`steady-increment/index.html` or `steady-increment/vs-hevy/index.html` sits
safely alongside the generated `steady-increment/privacy/index.html`. Do not
extend `build.mjs` to generate them: it exists to strip maintainer notes out of
legal markdown and asserts that none survived, which is a job marketing copy
does not have.

**Every claim on a marketing page has to match the app.** The numbers on the
Steady Increment pages (exercise counts, import results, prices) are pinned in
the app repo by `mobile/src/features/programs/__tests__/listing.test.ts` and
`.../import/__tests__/tabularParity.test.ts`. If one changes there, change it
here in the same session. `../exerciseapp/docs/launch/positioning.md` §10 is the
rulebook for the copy itself — no superlatives without a mechanism, never lead
with AI, never disparage a competitor by name.

**Every document is namespaced under its app** — `lonexa.ai/micromajors/privacy/`,
not `lonexa.ai/privacy/` — because Lonexa hosts more than one app and a
privacy-policy URL a store listing already points at is a thing nobody wants to
move twice. `APPS` at the top of `build.mjs` is the list, and `delete` is listed
per app by hand: only an app with accounts has anything to delete on a server,
and publishing a deletion page for one that does not would describe a process
that does not exist.

| App | Slug | Documents | Source repository |
|---|---|---|---|
| Steady Increment | `steady-increment` | privacy, terms, delete | `../exerciseapp/docs/legal/` |
| Booth Log | `booth-log` | privacy, terms | `../lonexa-booth-log/docs/legal/` |
| MicroMajors | `micromajors` | privacy, terms, delete | `../MicroMajors/docs/legal/` |

## Editing the legal pages

The **source of truth is the app repository**, at `docs/legal/` — see the table
above for which repository. Do not edit the markdown here in isolation: the two
copies will drift and the app will ship a policy that disagrees with the
published one.

```bash
cp ../MicroMajors/docs/legal/*.md content/micromajors/
node build.mjs
```

`build.mjs` strips HTML comments before rendering and then asserts that none
survived. Every source document ends with a `MAINTAINER NOTE - not published`
block, so this is not a theoretical concern — hand-converting these files would
publish internal notes into page source. Those notes are where the unfinished
business lives: what is described but not yet built, and which claim has to be
re-checked before a store listing goes live.

## Previewing locally

Pages use root-relative paths (`/assets/site.css`), so `file://` will not work.
Serve the directory:

```bash
npx --yes serve .        # or any static server
```

## Deploying

Push to `main`. GitHub Pages redeploys automatically.

Settings → Pages must have: source **Deploy from a branch**, branch **main**,
folder **/ (root)**, custom domain **lonexa.ai**, and **Enforce HTTPS** on.

## DNS

`lonexa.ai` is registered at Namecheap using Namecheap BasicDNS
(`dns1/dns2.registrar-servers.com`).

**Proton Mail serves email on this domain. Never remove or edit the `MX`
records, the `TXT` records, or the `protonmail*._domainkey` `CNAME` records.**
GitHub Pages needs only `A`/`AAAA` records at the apex plus a `CNAME` at `www`,
and those are different record types that do not interact with mail delivery.

Apex `A` records:

```
185.199.108.153
185.199.109.153
185.199.110.153
185.199.111.153
```

`www` → `<github-account>.github.io`
