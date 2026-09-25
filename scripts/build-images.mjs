// Builds responsive, compressed images for the site.
//
// Drop originals into assets/src/ using the names below (jpg, jpeg, png, webp or svg).
// A photo always wins over an svg placeholder with the same name.
//   npm install && npm run images
import { readdirSync, mkdirSync } from 'node:fs';
import { join, parse } from 'node:path';
import sharp from 'sharp';

const SRC = 'assets/src';
const OUT = 'site/images';

// name: [aspect width, aspect height, output widths]
const IMAGES = {
  hero:      [4, 3, [640, 1024, 1600]],
  'step-1':  [1, 1, [480, 800]],
  'step-2':  [1, 1, [480, 800]],
  'step-3':  [1, 1, [480, 800]],
  liner:     [3, 2, [640, 1024, 1600]],
  organiser: [4, 5, [480, 800, 1200]],
  wetsuit:   [4, 5, [480, 800, 1200]],
};
const RASTER = ['.jpg', '.jpeg', '.png', '.webp'];

mkdirSync(OUT, { recursive: true });
const files = readdirSync(SRC);
const pick = (name) =>
  files.find((f) => parse(f).name === name && RASTER.includes(parse(f).ext.toLowerCase())) ??
  files.find((f) => f === `${name}.svg`);

for (const [name, [aw, ah, widths]] of Object.entries(IMAGES)) {
  const file = pick(name);
  if (!file) { console.warn(`! missing ${name} in ${SRC}`); continue; }
  const input = join(SRC, file);
  for (const w of widths) {
    const h = Math.round((w * ah) / aw);
    const base = sharp(input, { density: 144 }).rotate().resize(w, h, { fit: 'cover' });
    await base.clone().webp({ quality: 78 }).toFile(join(OUT, `${name}-${w}.webp`));
    await base.clone().jpeg({ quality: 80, mozjpeg: true, progressive: true }).toFile(join(OUT, `${name}-${w}.jpg`));
  }
  console.log(`✓ ${name} ← ${file}`);
}

// Social share image (1200x630) for Meta link previews
const og = pick('og') ?? pick('hero');
await sharp(join(SRC, og), { density: 144 }).resize(1200, 630, { fit: 'cover' })
  .jpeg({ quality: 82, mozjpeg: true }).toFile(join(OUT, 'og.jpg'));
console.log(`✓ og ← ${og}`);
