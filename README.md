# NEREUS Lid landing page

Static first-drop landing page for NEREUS Lid. There's no framework and no build step to deploy, and it's ready for Netlify.

```
site/            ← deploy this folder (index.html, thanks.html, css/, js/, images/)
assets/src/      ← original product images
scripts/         ← image optimiser
netlify.toml     ← publish = "site"
```

## Images

Originals are in `assets/src/`. `scripts/build-images.mjs` maps them to page slots, with a crop for each slot, and writes compressed WebP and JPG sizes to `site/images/`:

| Page slot            | Source file(s), first match wins                   |
|----------------------|----------------------------------------------------|
| Hero                 | `lid-fitting`: hand lowering the lid onto the crate |
| Step 1: your crate   | `lid-fitting` (crate-only crop)                    |
| Step 2: clipped on   | `lid-closed`, else `lid-closed-bike` (crop)         |
| Step 3: open         | `lid-open-organiser`                               |
| Integrated liner     | `lid-open-liner`                                   |
| Under-lid organiser  | `lid-open-organiser-surf`                          |
| Wetsuit carry        | `lid-wetsuit`, else `lid-closed-bike`               |
| Pricing card         | `lid-lock-detail`, else `lid-closed-bike` (crop)    |
| Social share (og)    | `lid-wetsuit`, else `lid-closed-bike`               |

**Still to add:** `lid-wetsuit` (rolled wetsuit strapped on top), `lid-lock-detail` (lock and strap close-up) and `lid-closed` (closed lid on crate). Save them in `assets/src/` under these names (`.webp`, `.jpg` or `.png`), then run:

```bash
npm install
npm run images
```

Commit the regenerated `site/images/*`. If a new shot is framed differently, adjust its `crop` in the script.

## Deploy to Netlify

1. Connect this repo in Netlify (or drag the `site/` folder into Netlify Drop). `netlify.toml` sets the publish directory.
2. **Enable form detection:** Site configuration → Forms → Enable form detection, then redeploy. The form is named `first-drop`.
3. Submissions appear under **Forms**. You can set up email notifications there too. Each entry includes UTM parameters and `fbclid` from the ad click.
4. Once the domain is live, change `og:image` in `index.html` to an absolute URL (`https://your-domain/images/og.jpg`). Meta link previews need it.

## Meta Pixel

Paste your Pixel base code where marked in the `<head>` of `index.html` and `thanks.html`. `thanks.html` already fires `fbq('track', 'Lead')` once the Pixel is present.

## Local preview

```bash
npx serve site
```
