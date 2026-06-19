const candidates = {
  'premium-cotton-tshirt': [2984525, 6311392, 7671166],
  'classic-denim-jacket': [1124468, 6311398, 6311487],
  'running-sneakers-pro': [2529148, 190550, 1598505],
  'leather-crossbody-bag': [290523, 1152077, 1926629],
  'wireless-bluetooth-earbuds': [3825517, 3781529, 1649771],
  'smart-fitness-watch': [437037, 393047, 4373464],
  'slim-fit-chinos': [1082529, 1478442, 6311485],
  'polarized-sunglasses': [701877, 157675, 46710],
  'wool-blend-sweater': [6311477, 3736259, 6311386],
  'canvas-sneakers': [1598505, 190292, 2529148],
  'stainless-steel-water-bottle': [3738349, 1266810, 50593, 128756, 416528],
  'portable-bluetooth-speaker': [3465067, 1088210, 3683069],
  'iphone-15-pro-max-case': [699122, 1092678, 7889463],
  'gaming-mechanical-keyboard': [2115256, 35279496, 2115257],
  '4k-smart-tv-43': [8442374, 5721900, 6311658],
  'wireless-charging-pad': [7889463, 4386467, 699122],
  'laptop-stand-aluminum': [3912949, 7979947, 7978053],
  'usb-c-hub-7in1': [7978053, 3861969, 442150],
  'over-ear-headphones': [3394650, 1649771, 3781529],
  'tablet-10-android': [1334597, 356056, 3205733],
  'formal-white-shirt': [1431293, 297933, 996329],
  'floral-summer-dress': [1536619, 985635, 1462637],
  'mens-leather-belt': [1693598, 1926769, 1005638],
  'hooded-sweatshirt': [6311387, 4939648, 6311388],
  'womens-palazzo-pants': [1485951, 6311486, 6311484],
  'checked-casual-shirt': [7691091, 6311482, 6311483],
  'sports-track-pants': [8619857, 2294480, 3076509],
  'silk-saree-premium': [1192609, 2236960, 1884584],
  'leather-formal-shoes': [292999, 298863, 335601],
  'womens-heels-stiletto': [336372, 335601, 298863],
  'smart-led-desk-lamp': [6775261, 3414837, 1113648],
  'power-bank-20000mah': [7869116, 163484, 909176],
  'cotton-kurta-set': [12469210, 1197714, 1884584],
};

const pexels = (id) =>
  `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop`;

const best = {};

for (const [slug, ids] of Object.entries(candidates)) {
  for (const id of ids) {
    try {
      const r = await fetch(pexels(id), { method: 'HEAD' });
      if (r.ok) {
        best[slug] = id;
        console.log(`${slug}: ${id} OK`);
        break;
      }
      console.log(`${slug}: ${id} ${r.status}`);
    } catch (e) {
      console.log(`${slug}: ${id} ERR`);
    }
  }
  if (!best[slug]) console.log(`${slug}: NO MATCH`);
}

console.log('\n--- FINAL MAP ---');
console.log(JSON.stringify(best, null, 2));
