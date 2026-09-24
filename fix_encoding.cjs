const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

c = c.replace(/Cat.*?logo/g, 'Catálogo');
c = c.replace(/Or.*?amentos/g, 'Orçamentos');
c = c.replace(/Ajuste de Pre.*?os/g, 'Ajuste de Preços');
c = c.replace(/Ajuste.*?pre.*?o/g, 'Ajuste no preço');
c = c.replace(/Altera.*?es/g, 'Alterações');
c = c.replace(/A.*?es/g, 'Ações');
c = c.replace(/Em impress.*?o/g, 'Em impressão');
c = c.replace(/Aguardand.*? pgto/g, 'Aguardando pgto');
c = c.replace(/Aguardand.*? an.*?lise/g, 'Aguardando análise');
c = c.replace(/Or.*?ament.*? enviado/g, 'Orçamento enviado');
c = c.replace(/Pok.*?mon/g, 'Pokémon');
c = c.replace(/Acess.*?rios/g, 'Acessórios');
c = c.replace(/M.*?nimo recomendado/g, 'Mínimo recomendado');
c = c.replace(/M.*?o/g, 'Mão');
c = c.replace(/Pe.*?a/g, 'Peça');
c = c.replace(/El.*?trico/g, 'Elétrico');
c = c.replace(/Ps.*?quico/g, 'Psíquico');
c = c.replace(/Drag.*?o/g, 'Dragão');
c = c.replace(/.*?Deletar/g, '🗑 Deletar');
c = c.replace(/.*?Pausar/g, '⏸ Pausar');
c = c.replace(/.*?Editar/g, '🖊 Editar');
c = c.replace(/Y"\/g, '📦');
c = c.replace(/Y>'/g, '🛒');
c = c.replace(/Y"\?/g, '📐');
c = c.replace(/Y/g, '🧵');
c = c.replace(/Y'\/g, '💰');
c = c.replace(/o\./g, '✅');
c = c.replace(/\?\?/g, '⏸');
c = c.replace(/Y-'\?\'/g, '🏷');

// Also for Home.tsx
let h = fs.readFileSync('src/pages/Home.tsx', 'utf8');
h = h.replace(/Tem um arquivo STL pr.*?prio\?/g, 'Tem um arquivo STL próprio?');
h = h.replace(/fa.*?a um or.*?amento/g, 'faça um orçamento');
h = h.replace(/cria.*?.*?o/g, 'criação');
h = h.replace(/Pok.*?dex/g, 'Pokédex');
h = h.replace(/Cat.*?logo/g, 'Catálogo');
fs.writeFileSync('src/pages/Home.tsx', h, 'utf8');

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');