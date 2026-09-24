const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const replacements = {
  'CatÃ¡logo': 'Catálogo',
  'OrÃ§amentos': 'Orçamentos',
  'PreÃ§os': 'Preços',
  'AÃ§Ãµes': 'Ações',
  'PokÃ©mon': 'Pokémon',
  'AcessÃ³rios': 'Acessórios',
  'Aguardando anÃ¡lise': 'Aguardando análise',
  'MÃ£o': 'Mão',
  'PeÃ§a': 'Peça',
  'ElÃ©trico': 'Elétrico',
  'PsÃ­quico': 'Psíquico',
  'DragÃ£o': 'Dragão',
  'impressÃ£o': 'impressão',
  'AguardandÃ£o': 'Aguardando',
  'Aguardand✕': 'Aguardando',
  'MÃ­nimo': 'Mínimo',
  'preÃ§o': 'preço',
  'AlteraÃ§Ãµes': 'Alterações'
};

for (const [bad, good] of Object.entries(replacements)) {
  c = c.split(bad).join(good);
}
fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');

let h = fs.readFileSync('src/pages/Home.tsx', 'utf8');
const hReplacements = {
  'prÃ³prio': 'próprio',
  'faÃ§a': 'faça',
  'orÃ§amento': 'orçamento',
  'PokÃ©dex': 'Pokédex',
  'criaÃ§Ã£o': 'criação',
  'CatÃ¡logo': 'Catálogo'
};
for (const [bad, good] of Object.entries(hReplacements)) {
  h = h.split(bad).join(good);
}
fs.writeFileSync('src/pages/Home.tsx', h, 'utf8');