const products = {
  'premium-cotton-tshirt': { ids: [7671166, 6311392], keys: ['t-shirt', 'tshirt', 'shirt', 'cotton'] },
  'classic-denim-jacket': { ids: [1124468, 6311398], keys: ['denim', 'jacket'] },
  'running-sneakers-pro': { ids: [2529148, 190550], keys: ['sneaker', 'shoe', 'running', 'footwear'] },
  'leather-crossbody-bag': { ids: [290523, 1152077], keys: ['bag', 'crossbody', 'handbag', 'purse'] },
  'wireless-bluetooth-earbuds': { ids: [3825517, 3781529], keys: ['earbud', 'headphone', 'airpod', 'wireless'] },
  'smart-fitness-watch': { ids: [393047, 437037], keys: ['watch', 'smartwatch', 'fitness'] },
  'slim-fit-chinos': { ids: [1082529, 1478442], keys: ['pants', 'chino', 'trouser', 'jeans'] },
  'polarized-sunglasses': { ids: [701877, 157675], keys: ['sunglass', 'glasses', 'eyewear'] },
  'wool-blend-sweater': { ids: [6311477, 3736259], keys: ['sweater', 'knit', 'jumper', 'pullover'] },
  'canvas-sneakers': { ids: [1598505, 2529148], keys: ['sneaker', 'shoe', 'canvas', 'footwear'] },
  'stainless-steel-water-bottle': { ids: [50593, 1695381, 416528, 604969, 3734355, 11031194], keys: ['bottle', 'flask', 'thermos', 'water bottle', 'drink'] },
  'portable-bluetooth-speaker': { ids: [3465067, 3683069], keys: ['speaker', 'bluetooth', 'audio'] },
  'iphone-15-pro-max-case': { ids: [607812, 699122, 1092678], keys: ['phone', 'iphone', 'mobile', 'case'] },
  'gaming-mechanical-keyboard': { ids: [2115256, 2115257], keys: ['keyboard', 'mechanical', 'gaming'] },
  '4k-smart-tv-43': { ids: [8442374, 5721900], keys: ['tv', 'television', 'screen', 'monitor'] },
  'wireless-charging-pad': { ids: [7889463, 4386467], keys: ['charg', 'wireless', 'phone'] },
  'laptop-stand-aluminum': { ids: [7979947, 3912949], keys: ['laptop', 'stand', 'desk', 'computer'] },
  'usb-c-hub-7in1': { ids: [7978053, 3861969], keys: ['usb', 'hub', 'adapter', 'dongle', 'port'] },
  'over-ear-headphones': { ids: [3394650, 1649771], keys: ['headphone', 'earphone', 'audio'] },
  'tablet-10-android': { ids: [3205733, 1334597, 356056], keys: ['tablet', 'ipad', 'device'] },
  'formal-white-shirt': { ids: [1431293, 297933], keys: ['shirt', 'formal', 'dress shirt', 'white'] },
  'floral-summer-dress': { ids: [1536619, 985635], keys: ['dress', 'floral', 'gown'] },
  'mens-leather-belt': { ids: [1693598, 1926769], keys: ['belt', 'leather'] },
  'hooded-sweatshirt': { ids: [4939648, 6311387], keys: ['hoodie', 'sweatshirt', 'hood'] },
  'womens-palazzo-pants': { ids: [6311486, 1485951], keys: ['pants', 'palazzo', 'trouser', 'wide'] },
  'checked-casual-shirt': { ids: [6311482, 7691091], keys: ['shirt', 'check', 'plaid', 'flannel'] },
  'sports-track-pants': { ids: [8619857, 2294480], keys: ['track', 'jogger', 'pants', 'sport'] },
  'silk-saree-premium': { ids: [2236960, 1192609], keys: ['saree', 'sari', 'indian', 'traditional'] },
  'leather-formal-shoes': { ids: [292999, 298863], keys: ['shoe', 'leather', 'oxford', 'formal', 'footwear'] },
  'womens-heels-stiletto': { ids: [336372, 335601], keys: ['heel', 'stiletto', 'shoe', 'footwear'] },
  'smart-led-desk-lamp': { ids: [6775261, 3414837], keys: ['lamp', 'desk', 'light'] },
  'power-bank-20000mah': { ids: [7869116, 163484, 909176], keys: ['power bank', 'battery', 'charger', 'portable'] },
  'cotton-kurta-set': { ids: [12469210], keys: ['kurta', 'indian', 'traditional', 'ethnic'] },
};

const pexels = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&w=600&h=600&fit=crop`;

async function pageText(id) {
  const res = await fetch(`https://www.pexels.com/photo/p-${id}/`, {
    headers: { 'User-Agent': 'Mozilla/5.0' },
    redirect: 'follow',
  });
  return (await res.text()).toLowerCase();
}

const best = {};

for (const [slug, { ids, keys }] of Object.entries(products)) {
  for (const id of ids) {
    try {
      const img = await fetch(pexels(id), { method: 'HEAD' });
      if (!img.ok) continue;
      const html = await pageText(id);
      const bad = ['facial', 'massage', 'spa', 'skincare', 'clownfish', 'mountain', 'sunrise'];
      if (bad.some((b) => html.includes(b))) {
        console.log(`SKIP ${slug} ${id} bad content`);
        continue;
      }
      if (keys.some((k) => html.includes(k))) {
        best[slug] = id;
        console.log(`OK   ${slug} -> ${id}`);
        break;
      }
      console.log(`??   ${slug} ${id} no keyword match`);
    } catch (e) {
      console.log(`ERR  ${slug} ${id}`);
    }
  }
}

console.log('\n' + JSON.stringify(best, null, 2));
