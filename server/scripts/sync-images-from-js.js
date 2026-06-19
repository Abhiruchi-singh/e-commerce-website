import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PRODUCT_IMAGES } from '../productImages.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../../client/public/products');

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

let ok = 0;
let fail = 0;

for (const [slug, url] of Object.entries(PRODUCT_IMAGES)) {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(outDir, `${slug}.jpg`), buf);
    console.log(`OK  ${slug}`);
    ok++;
  } catch (err) {
    console.error(`FAIL ${slug}: ${err.message}`);
    fail++;
  }
}

console.log(`Done: ${ok} saved, ${fail} failed → client/public/products/`);
