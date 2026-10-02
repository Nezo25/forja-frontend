const fs = require('fs');
let code = fs.readFileSync('src/data/products.ts', 'utf8');

code = code.replace(
  /export type Category = [^;]+;/,
  "export type Category = 'Figures Pokémon' | 'Dioramas e Cenários' | 'Chibis / Miniaturas' | 'Acessórios & Colecionáveis' | 'TCG';"
);

code = code.replace(
  /export const ALL_CATEGORIES: Category\[\] = [^;]+;/,
  "export const ALL_CATEGORIES: Category[] = ['Figures Pokémon', 'Dioramas e Cenários', 'Chibis / Miniaturas', 'Acessórios & Colecionáveis', 'TCG'];"
);

fs.writeFileSync('src/data/products.ts', code);
