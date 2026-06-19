const more = {
  'womens-palazzo-pants': ['photo-1487227277444-81871666c5bd','photo-1490481651871-ab68de25d43d','photo-1509631179647-017731169b2f','photo-1515372039744-b8f02a3ae446','photo-1483985988351-763728e1935b','photo-1469334031218-e045a4deeaf3','photo-1539008835657-9e8e96834197'],
  'silk-saree-premium': ['photo-1610030153528-d4f9fad5bb40','photo-1583391733981-5f9d8ee8f0f8','photo-1594736797933-d0401ba2fe65','photo-1617127365859-d7d4a2d2b3d6','photo-1583391733981-5f9d8ee8f0f8'],
  'cotton-kurta-set': ['photo-1594736797933-d0401ba2fe65','photo-1617127365859-d7d4a2d2b3d6','photo-1598032564595-5ccf4d0f0b0c','photo-1617127365859-d7d4a2d2b3d6'],
  'leather-formal-shoes': ['photo-1533860870044-528d6a852fae','photo-1463104859046-37ac27e08d8c','photo-1614251238858-6b9b0e5c8a5f','photo-1460353581641-1b0bc205f9d1','photo-1549298916-b41d501d3772'],
  'womens-heels-stiletto': ['photo-1460353581641-1b0bc205f9d1','photo-1543163521-966bc8ec2f8d','photo-336372','photo-1549298916-b41d501d3772'],
  'gaming-mechanical-keyboard': ['photo-1541140535014-99a4a47c0b85','photo-1618384888359-22d907ecd07d','photo-1595225478794-8658461e2533','photo-1587829741301-d52165ff0e8f','photo-1511467638679-4b090cc976fc'],
  'wireless-charging-pad': ['photo-1586953208448-b06a7f3dda4b','photo-1612815155741-7ecc4b9f1c1f','photo-1591291618250-64d4e112819a','photo-1601784551446-20c9e07cdbdb'],
  'power-bank-20000mah': ['photo-1583863788437-bb46752f2b59','photo-1609091839311-7f9e8e7bbdb9','photo-1601784551446-20c9e07cdbdb','photo-1601784551446-20c9e07cdbdb'],
  'stainless-steel-water-bottle': ['photo-1602143407151-7111542de6e8','photo-1674403091102-b961ad03fc22','photo-1544003484-3cd181d17917'],
};
const u = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&h=600&q=80`;
for (const [slug, ids] of Object.entries(more)) {
  for (const id of ids) {
    const r = await fetch(u(id));
    const s = (await r.arrayBuffer()).byteLength;
    if (r.ok && s > 5000) { console.log('OK', slug, id); break; }
    else console.log('--', slug, id, r.status, s);
  }
}
