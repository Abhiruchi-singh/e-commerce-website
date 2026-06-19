/**
 * Smart image fetch — scores Unsplash results by keyword match in alt text.
 * node scripts/fetch-verified-images.js
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const outDir = path.join(__dirname, '../../client/public/products');
const outJs = path.join(__dirname, '../productImages.js');

const PRODUCTS = [
  { slug: 'premium-cotton-tshirt', query: 'white t-shirt product', keywords: ['t-shirt', 'tshirt', 'tee', 'shirt', 'cotton'] },
  { slug: 'classic-denim-jacket', query: 'denim jacket', keywords: ['jacket', 'denim'] },
  { slug: 'slim-fit-chinos', query: 'khaki chinos pants', keywords: ['chino', 'pants', 'trouser', 'khaki'] },
  { slug: 'wool-blend-sweater', query: 'sweater knit pullover', keywords: ['sweater', 'pullover', 'knit', 'jumper'] },
  { slug: 'formal-white-shirt', query: 'white dress shirt', keywords: ['shirt', 'formal', 'dress'] },
  { slug: 'floral-summer-dress', query: 'floral dress women', keywords: ['dress', 'floral'] },
  { slug: 'mens-leather-belt', query: 'leather belt buckle', keywords: ['belt', 'buckle', 'leather'] },
  { slug: 'hooded-sweatshirt', query: 'hoodie sweatshirt', keywords: ['hoodie', 'sweatshirt', 'hood'] },
  { slug: 'womens-palazzo-pants', query: 'palazzo wide leg pants women', keywords: ['pants', 'palazzo', 'wide', 'trouser'] },
  { slug: 'checked-casual-shirt', query: 'plaid flannel shirt', keywords: ['plaid', 'flannel', 'check', 'shirt'] },
  { slug: 'sports-track-pants', query: 'jogger track pants athletic', keywords: ['track', 'jogger', 'pants', 'athletic', 'sport'] },
  { slug: 'silk-saree-premium', query: 'saree silk indian', keywords: ['saree', 'sari', 'silk'] },
  { slug: 'cotton-kurta-set', query: 'kurta pajama men', keywords: ['kurta', 'pajama', 'ethnic', 'indian'] },
  { slug: 'running-sneakers-pro', query: 'red nike running shoes', keywords: ['sneaker', 'shoe', 'running', 'trainer'] },
  { slug: 'canvas-sneakers', query: 'white canvas sneakers', keywords: ['sneaker', 'canvas', 'shoe'] },
  { slug: 'leather-formal-shoes', query: 'leather oxford shoes', keywords: ['shoe', 'leather', 'oxford', 'formal'] },
  { slug: 'womens-heels-stiletto', query: 'stiletto high heels', keywords: ['heel', 'stiletto', 'pump'] },
  { slug: 'leather-crossbody-bag', query: 'leather crossbody bag', keywords: ['bag', 'crossbody', 'handbag', 'leather'] },
  { slug: 'polarized-sunglasses', query: 'sunglasses wayfarer', keywords: ['sunglass', 'wayfarer', 'glasses'] },
  { slug: 'stainless-steel-water-bottle', query: 'steel water bottle', keywords: ['bottle', 'water', 'flask'] },
  { slug: 'wireless-bluetooth-earbuds', query: 'wireless earbuds', keywords: ['earbud', 'earphone', 'airpod'] },
  { slug: 'smart-fitness-watch', query: 'smartwatch fitness', keywords: ['watch', 'smartwatch', 'fitness'] },
  { slug: 'portable-bluetooth-speaker', query: 'bluetooth speaker portable', keywords: ['speaker', 'bluetooth'] },
  { slug: 'iphone-15-pro-max-case', query: 'iphone silicone case', keywords: ['case', 'iphone', 'phone'] },
  { slug: 'gaming-mechanical-keyboard', query: 'mechanical gaming keyboard', keywords: ['keyboard', 'mechanical'] },
  { slug: '4k-smart-tv-43', query: 'flat screen smart tv', keywords: ['tv', 'television', 'screen'] },
  { slug: 'wireless-charging-pad', query: 'wireless charger pad', keywords: ['charger', 'charging', 'wireless'] },
  { slug: 'laptop-stand-aluminum', query: 'laptop stand riser', keywords: ['stand', 'riser', 'laptop'] },
  { slug: 'usb-c-hub-7in1', query: 'usb hub dongle adapter', keywords: ['hub', 'usb', 'adapter', 'dongle'] },
  { slug: 'over-ear-headphones', query: 'over ear headphones', keywords: ['headphone', 'headset', 'ear'] },
  { slug: 'tablet-10-android', query: 'tablet android screen', keywords: ['tablet', 'ipad'] },
  { slug: 'smart-led-desk-lamp', query: 'desk lamp led', keywords: ['lamp', 'desk'] },
  { slug: 'power-bank-20000mah', query: 'power bank portable', keywords: ['power bank', 'battery', 'charger'] },
];

const score = (alt, keywords) => {
  const text = (alt || '').toLowerCase();
  let s = 0;
  for (const kw of keywords) {
    if (text.includes(kw.toLowerCase())) s += 10;
  }
  if (text.includes('mockup') || text.includes('mock up')) s -= 5;
  return s;
};

const searchPhoto = async (query) => {
  const url = `https://unsplash.com/napi/search/photos?query=${encodeURIComponent(query)}&per_page=20&orientation=squarish`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Search ${res.status}`);
  return (await res.json()).results || [];
};

const pickBest = (results, keywords) => {
  const ranked = results
    .map((p) => ({ p, s: score(p.alt_description, keywords) }))
    .filter(({ p }) => p.urls?.regular)
    .sort((a, b) => b.s - a.s);
  return ranked[0]?.p || results[0];
};

if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

const map = {};
let ok = 0;
let fail = 0;

for (const { slug, query, keywords } of PRODUCTS) {
  try {
    const results = await searchPhoto(query);
    const photo = pickBest(results, keywords);
    if (!photo) throw new Error('no results');
    const imageUrl = `${photo.urls.regular}&w=800&h=800&fit=crop&q=85`;
    const res = await fetch(imageUrl);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    if (buf.length < 10000) throw new Error('too small');
    fs.writeFileSync(path.join(outDir, `${slug}.jpg`), buf);
    map[slug] = imageUrl;
    const sc = score(photo.alt_description, keywords);
    console.log(`OK  ${slug} [${sc}] ${(photo.alt_description || '').slice(0, 55)}`);
    ok++;
    await new Promise((r) => setTimeout(r, 250));
  } catch (err) {
    console.error(`FAIL ${slug}: ${err.message}`);
    fail++;
  }
}

const version = '17';
const lines = Object.entries(map).map(([slug, url]) => `  '${slug}': '${url}',`);
const js = `/** Verified product images — Unsplash search + keyword match */\nexport const IMAGE_CACHE_VERSION = '${version}';\n\nexport const PRODUCT_IMAGES = {\n${lines.join('\n')}\n};\n\nexport const localProductImage = (slug) =>\n  \`/products/\${slug}.jpg?v=\${IMAGE_CACHE_VERSION}\`;\n`;
fs.writeFileSync(outJs, js);
console.log(`\n${ok} ok, ${fail} fail → v${version}`);
