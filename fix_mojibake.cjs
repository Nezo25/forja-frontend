const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const map = {
  'Ã³': 'ó', 'Ã©': 'é', 'Ã£': 'ã', 'Ã¡': 'á', 'Ã ': 'à', 'Ã§': 'ç', 'Ã­': 'í', 'Ã¢': 'â',
  'Ã“': 'Ó', 'Ã‰': 'É', 'Ãƒ': 'Ã', 'Ã\x81': 'Á', 'Ã€': 'À', 'Ã‡': 'Ç', 'Ã\x8D': 'Í', 'Ã‚': 'Â',
  'CatÃ¡logo': 'Catálogo',
  'OrÃ§amentos': 'Orçamentos',
  'PreÃ§os': 'Preços',
  'AcessÃ³rios': 'Acessórios',
  'PokÃ©mon': 'Pokémon',
  'DragÃ£o': 'Dragão',
  'MetÃ¡lico': 'Metálico',
  'Pintado Ã  MÃ£o': 'Pintado à Mão',
  'PeÃ§a Crua': 'Peça Crua',
  'AÃ§Ã£o': 'Ação'
};

for (const [bad, good] of Object.entries(map)) {
  c = c.split(bad).join(good);
}

// And fix the typescript errors!
c = c.replace(/scale: e\.target\.value/, "scale: e.target.value as any");
c = c.replace(/material: e\.target\.value/, "material: e.target.value as any");
c = c.replace(/category: initialData\?\.category \|\| 'Figures PokÃ©mon',/, "category: initialData?.category || 'Figures Pokémon',");

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
