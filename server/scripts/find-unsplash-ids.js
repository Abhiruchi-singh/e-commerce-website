const candidates = {
  'classic-denim-jacket': ['photo-1551028719-09366b16c4e8','photo-1576995853123-5a10305d93c0','photo-1543076641-793d93c95f1f'],
  'formal-white-shirt': ['photo-1602810318383-e386a2a67ae2','photo-1596755094514-f87e34085b2c','photo-1622445275463-afa2ab738c34'],
  'floral-summer-dress': ['photo-1595777453416-9b00b0e89190','photo-1496747611176-843222e1e57c','photo-1515372039744-b8f02a3ae446'],
  'mens-leather-belt': ['photo-1624221074716-0c3b08d1878e','photo-1553062407-98eeb64c6a62','photo-1624221074716-0c3b08d1878e'],
  'womens-palazzo-pants': ['photo-1594633313598-6dea7ab7b87d','photo-1483985988351-763728e1935b','photo-1469334031218-e045a4deeaf3'],
  'checked-casual-shirt': ['photo-1598032564595-5ccf4d0f0b0c','photo-1603252109303-2751441dd491','photo-1602810318383-e386a2a67ae2'],
  'silk-saree-premium': ['photo-1610030153528-d4f9fad5bb40','photo-1583391733981-5f9d8ee8f0f8','photo-1610030153528-d4f9fad5bb40'],
  'cotton-kurta-set': ['photo-1595942395881-2d6a41eedc97','photo-1598032564595-5ccf4d0f0b0c','photo-1617127365859-d7d4a2d2b3d6'],
  'leather-formal-shoes': ['photo-1614251238858-6b9b0e5c8a5f','photo-1614251238858-6b9b0e5c8a5f','photo-1549298916-b41d501d3772'],
  'womens-heels-stiletto': ['photo-1543163521-966bc8ec2f8d','photo-336372','photo-1543163521-966bc8ec2f8d'],
  'leather-crossbody-bag': ['photo-1548036328-c9fa89d128b8','photo-1590874103328-eac38a683ce7','photo-1584917865442-de89d76edd62'],
  'polarized-sunglasses': ['photo-1572635196234-4b7676df7a63','photo-1511499767150-a48a237f0083','photo-1577803644263-f8e62e4a4e9e'],
  'wireless-bluetooth-earbuds': ['photo-1590658268037-3f12b30dd0d5','photo-1598331668826-9ce228ecb63d','photo-1572569511254-d8f925fe2cbb'],
  'smart-fitness-watch': ['photo-1579586337278-b5a975e4f1bc','photo-1523275335684-37898b6baf30','photo-1434493789847-2f02dc6ca35d'],
  'portable-bluetooth-speaker': ['photo-1608043152469-9b5d0d6f9c70','photo-1608043152469-9b5d0d6f9c70','photo-1545454675-3531b543be5d'],
  'iphone-15-pro-max-case': ['photo-1511707171634-5ed7ffeeeb9e','photo-1601784551446-20c9e07cdbdb','photo-1592899677977-9c10ca588abb'],
  'gaming-mechanical-keyboard': ['photo-1587829741301-d52165ff0e8f','photo-1541140535014-99a4a47c0b85','photo-1618384888359-22d907ecd07d'],
  '4k-smart-tv-43': ['photo-1593359676358-d3269cb8f7b1','photo-1593784991095-a205069470b6','photo-1461151304267-38535e780c79'],
  'wireless-charging-pad': ['photo-1591291618250-64d4e112819a','photo-1586953208448-b06a7f3dda4b','photo-1612815155741-7ecc4b9f1c1f'],
  'laptop-stand-aluminum': ['photo-1527864550417-4fd3ac9daec2','photo-1527864550417-4fd3ac9daec2','photo-1496181133206-80ce9b88a853'],
  'usb-c-hub-7in1': ['photo-1625948510601-3a6654c001ca','photo-1625948510601-3a6654c001ca','photo-1587825140708-dfaf72ae4b04'],
  'smart-led-desk-lamp': ['photo-1507473889264-e6a125c5d4c0','photo-1507473889264-e6a125c5d4c0','photo-1513506003901-1e6a229e2d15'],
  'power-bank-20000mah': ['photo-1609091839311-7f9e8e7bbdb9','photo-1609091839311-7f9e8e7bbdb9','photo-1609091839311-7f9e8e7bbdb9'],
  'stainless-steel-water-bottle': ['photo-1602143407151-7111542de6e8','photo-1559827260-dc66d52bef19'],
};

const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=600&q=80`;
const best = {};

for (const [slug, ids] of Object.entries(candidates)) {
  for (const id of ids) {
    try {
      const r = await fetch(u(id));
      const size = (await r.arrayBuffer()).byteLength;
      if (r.ok && size > 5000) {
        best[slug] = id;
        console.log(`OK ${slug} -> ${id} (${size}b)`);
        break;
      }
      console.log(`-- ${slug} ${id} ${r.status} ${size}b`);
    } catch (e) {
      console.log(`ERR ${slug} ${id}`);
    }
  }
}
console.log('\n', JSON.stringify(best, null, 2));
