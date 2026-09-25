# NEREUS Lid landing page

Static first-drop landing page for NEREUS Lid. There's no framework and no build step to deploy, and it's ready for Netlify.

```
site/            ← deploy this folder (index.html, thanks.html, css/, js/, images/)
assets/src/      ← source images (originals go here)
scripts/         ← image optimiser
netlify.toml     ← publish = "site"
```

## Replace the placeholder images (do this before running ads)

`assets/src/` currently holds **placeholder product illustrations** (SVG). Add your NEREUS photos using these names. Any of `.jpg`, `.png` or `.webp` works, and a photo automatically takes priority over the SVG with the same name:

| File           | Shot                                                                 | Crop |
|----------------|----------------------------------------------------------------------|------|
| `hero`         | Lid hovering above / clipping onto an existing crate (clearest shot) | 4:3  |
| `step-1`       | Existing crate on the bike, no lid                                   | 1:1  |
| `step-2`       | Lid clipped onto the crate, closed                                   | 1:1  |
| `step-3`       | Lid open: liner in crate + under-lid organiser                       | 1:1  |
| `liner`        | Large lid-open shot showing the liner lining base and sides          | 3:2  |
| `organiser`    | Under-lid organiser with wax, sunscreen, keys, fin key               | 4:5  |
| `wetsuit`      | Lifestyle: rolled wetsuit secured with the grey straps               | 4:5  |
| `og` (optional)| Social share image. Falls back to `hero`                             | 1200×630 |

Then run:

```bash
npm install
npm run images   # writes compressed WebP + JPG sizes into site/images/
```

Commit the generated `site/images/*` files. Images are centre-cropped to the ratios above, so keep the product centred. Update the `alt` text in `site/index.html` if a shot differs from its description.

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
