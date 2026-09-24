const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const regexes = [
  [/Cat.*?logo/g, 'Catálogo'],
  [/Or.*?amentos/g, 'Orçamentos'],
  [/Ajuste de Pre.*?os/g, 'Ajuste de Preços'],
  [/Ajuste.*?pre.*?o/g, 'Ajuste no preço'],
  [/Altera.*?es/g, 'Alterações'],
  [/A.*?\bes/g, 'Ações'],
  [/Em impress.*?o/g, 'Em impressão'],
  [/Aguardand.*? pgto/g, 'Aguardando pgto'],
  [/Aguardand.*? an.*?lise/g, 'Aguardando análise'],
  [/Or.*?ament.*? enviado/g, 'Orçamento enviado'],
  [/Pok.*?mon/g, 'Pokémon'],
  [/Acess.*?rios/g, 'Acessórios'],
  [/M.*?nimo recomendado/g, 'Mínimo recomendado'],
  [/M.*?o/g, 'Mão'],
  [/Pe.*?a/g, 'Peça'],
  [/El.*?trico/g, 'Elétrico'],
  [/Ps.*?quico/g, 'Psíquico'],
  [/Drag.*?o/g, 'Dragão'],
  [/.*?Deletar/g, '🗑 Deletar'],
  [/.*?Pausar/g, '⏸ Pausar'],
  [/.*?Editar/g, '🖊 Editar'],
];

regexes.forEach(([r, v]) => { c = c.replace(r, v); });

// Explicit string replace for emojis
c = c.split('Y"').join('📦');
c = c.split("Y>'").join('🛒');
c = c.split('Y"?').join('📐');
c = c.split('Y').join('🧵');
c = c.split("Y'").join('💰');
c = c.split('o.').join('✅');
c = c.split('??').join('⏸');
c = c.split("Y-'?'").join('🏷');

// Also for Home.tsx
let h = fs.readFileSync('src/pages/Home.tsx', 'utf8');
h = h.split('ðŸ”©').join('📦');
h = h.replace(/Tem um arquivo STL pr.*?prio\?/g, 'Tem um arquivo STL próprio?');
h = h.replace(/fa.*?a um or.*?amento/g, 'faça um orçamento');
h = h.replace(/cria.*?.*?o/g, 'criação');
h = h.replace(/Pok.*?dex/g, 'Pokédex');
h = h.replace(/Cat.*?logo/g, 'Catálogo');
fs.writeFileSync('src/pages/Home.tsx', h, 'utf8');

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');