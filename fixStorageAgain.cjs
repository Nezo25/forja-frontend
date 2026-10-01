const fs = require('fs');
let code = fs.readFileSync('src/services/storage.ts', 'utf8');

code = code.replace(
  /types: Array.isArray\(p\?\.types\) \? p\.types : \[p\?\.primaryType \|\| 'Normal'\]\.filter\(Boolean\),/,
  `types: Array.isArray(p?.types) && p.types.length > 0 ? p.types : [p?.primaryType || 'Normal', p?.secondaryType].filter(Boolean),`
);

code = code.replace(
  /imageUrl: fullProduct\.image\.startsWith\('data:'\) \? 'https:\/\/placehold\.co\/600x700\/1F2937\/F97316\?text=Figure' : \n?fullProduct\.image/,
  `imageUrl: fullProduct.image,
    basePrice: fullProduct.basePrice`
);

fs.writeFileSync('src/services/storage.ts', code);
