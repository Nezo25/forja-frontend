const fs = require('fs');
let code = fs.readFileSync('src/data/products.ts', 'utf8');

code = code.replace(
  /export type Category = 'Figures Pokémon' \| 'Dioramas' \| 'Chibis' \| 'Acessórios';/,
  `export type Category = 'Figures Pokémon' | 'Dioramas' | 'Chibis' | 'Acessórios' | 'TCG';`
);

code = code.replace(
  /export const ALL_CATEGORIES: Category\[\] = \[\s*'Figures Pokémon',\s*'Dioramas',\s*'Chibis',\s*'Acessórios'\s*\];/,
  `export const ALL_CATEGORIES: Category[] = [\n  'Figures Pokémon','Dioramas','Chibis','Acessórios', 'TCG'\n];`
);

fs.writeFileSync('src/data/products.ts', code);
