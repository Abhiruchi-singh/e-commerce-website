/**
 * Verify remote image URLs return JPEG before download.
 * Usage: node scripts/verify-image-urls.js
 */
import { PRODUCT_IMAGES } from '../productImages.js';

let ok = 0;
let fail = 0;

for (const [slug, url] of Object.entries(PRODUCT_IMAGES)) {
  try {
    const res = await fetch(url);
    const type = res.headers.get('content-type') || '';
    const size = (await res.arrayBuffer()).byteLength;
    if (!res.ok || !type.includes('image') || size < 5000) {
      console.log(`FAIL ${slug} ${res.status} ${type} ${size}b`);
      fail++;
    } else {
      console.log(`OK   ${slug} ${size}b`);
      ok++;
    }
  } catch (err) {
    console.log(`ERR  ${slug} ${err.message}`);
    fail++;
  }
}

console.log(`\n${ok} ok, ${fail} failed`);
process.exit(fail ? 1 : 0);
