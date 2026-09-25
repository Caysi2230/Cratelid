// Builds responsive, compressed images for the site from the originals in assets/src/.
//   npm install && npm run images
//
// Each output lists candidate sources in priority order; the first one that exists is used.
// `crop` is a region of the source in pixels (the originals are 1122×1402).
import { readdirSync, mkdirSync } from 'node:fs';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const SRC = 'assets/src';
const OUT = 'site/images';

const IMAGES = {
  hero: {
    widths: [640, 1120],
    from: [{ src: 'lid-fitting', crop: { left: 0, top: 230, width: 1122, height: 935 } }],
  },
  'step-1': {
    widths: [480, 720],
    from: [{ src: 'lid-fitting', crop: { left: 185, top: 650, width: 752, height: 752 } }],
  },
  'step-2': {
    widths: [480, 720],
    from: [
      { src: 'lid-closed', crop: { left: 0, top: 200, width: 1122, height: 1122 } },
      { src: 'lid-closed-bike', crop: { left: 380, top: 380, width: 720, height: 720 } },
    ],
  },
  'step-3': {
    widths: [480, 720],
    from: [{ src: 'lid-open-organiser', crop: { left: 0, top: 40, width: 1122, height: 1122 } }],
  },
  liner: {
    widths: [640, 1120],
    from: [{ src: 'lid-open-liner', crop: { left: 0, top: 50, width: 1122, height: 1122 } }],
  },
  organiser: {
    widths: [480, 800, 1120],
    from: [{ src: 'lid-open-organiser-surf' }],
  },
  wetsuit: {
    widths: [480, 800, 1120],
    from: [{ src: 'lid-wetsuit' }, { src: 'lid-closed-bike' }],
  },
  detail: {
    widths: [480, 720],
    from: [
      { src: 'lid-lock-detail', crop: { left: 0, top: 180, width: 1122, height: 1122 } },
      { src: 'lid-closed-bike', crop: { left: 380, top: 380, width: 720, height: 720 } },
    ],
  },
};

// Social share image for Meta link previews (1200×630)
const OG = [
  { src: 'lid-wetsuit', crop: { left: 0, top: 150, width: 1122, height: 589 } },
  { src: 'lid-closed-bike', crop: { left: 0, top: 330, width: 1122, height: 589 } },
];

mkdirSync(OUT, { recursive: true });
const files = readdirSync(SRC);
const find = (name) => files.find((f) => parse(f).name === name && /\.(jpe?g|png|webp)$/i.test(f));
const resolve = (candidates) => {
  for (const c of candidates) {
    const file = find(c.src);
    if (file) return { ...c, file };
  }
  return null;
};
const load = ({ file, crop }) => {
  const img = sharp(join(SRC, file)).rotate();
  return crop ? img.extract(crop) : img;
};

for (const [name, { widths, from }] of Object.entries(IMAGES)) {
  const source = resolve(from);
  if (!source) { console.warn(`! ${name}: none of ${from.map((c) => c.src).join(', ')} found`); continue; }
  const buffer = await load(source).toBuffer();
  for (const w of widths) {
    const base = sharp(buffer).resize({ width: w, withoutEnlargement: true });
    await base.clone().webp({ quality: 76 }).toFile(join(OUT, `${name}-${w}.webp`));
    await base.clone().jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(join(OUT, `${name}-${w}.jpg`));
  }
  console.log(`✓ ${name} ← ${source.file}`);
}

const og = resolve(OG);
if (og) {
  await load(og).resize(1200, 630, { fit: 'cover' }).jpeg({ quality: 80, mozjpeg: true }).toFile(join(OUT, 'og.jpg'));
  console.log(`✓ og ← ${og.file}`);
}
