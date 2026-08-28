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
index.html          Company page. Hand-written; edit directly.
privacy/index.html  GENERATED — do not edit. Run `node build.mjs`.
terms/index.html    GENERATED — do not edit. Run `node build.mjs`.
404.html            Hand-written.
assets/site.css     All styling for every page.
favicon.svg
content/*.md        Source for the two legal pages.
build.mjs           content/*.md  ->  privacy/ + terms/
CNAME               Custom domain for GitHub Pages. Do not delete.
.nojekyll           Serve files as-is; skip Jekyll processing.
```

## Editing the legal pages

The **source of truth is the app repository**, at `docs/legal/`. Do not edit the
markdown here in isolation — the two copies will drift and the app will ship a
policy that disagrees with the published one.

```bash
cp ../exerciseapp/docs/legal/privacy-policy.md   content/
cp ../exerciseapp/docs/legal/terms-of-service.md content/
node build.mjs
```

`build.mjs` strips HTML comments before rendering and then asserts that none
survived. Both source documents end with a `MAINTAINER NOTE - not published`
block, so this is not a theoretical concern — hand-converting these files would
publish internal notes into page source.

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
