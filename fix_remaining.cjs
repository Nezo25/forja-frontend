const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

c = c.replace(/Ajuste ✕ preç✕ base de cada figura. Alterações refletem imediatamente n✕ catálogo./g, 'Ajuste o preço base de cada figura. Alterações refletem imediatamente no catálogo.');
c = c.replace(/Figures Pokmon/g, 'Figures Pokémon');
c = c.replace(/Acessrios/g, 'Acessórios');
c = c.replace(/Oramentos STL/g, 'Orçamentos STL');
c = c.replace(/Preos/g, 'Preços');
c = c.replace(/Aes/g, 'Ações');
c = c.replace(/Mínim✕ recomendado/g, 'Mínimo recomendado');
c = c.replace(/Nome d✕ produt✕/g, 'Nome do produto');
c = c.replace(/Preç✕ base/g, 'Preço base');
c = c.replace(/Temp✕ impressã✕/g, 'Tempo impressão');
c = c.replace(/Filament✕/g, 'Filamento');
c = c.replace(/Produt✕ ativo/g, 'Produto ativo');
c = c.replace(/Orçament✕/g, 'Orçamento');
c = c.replace(/Aguardand✕/g, 'Aguardando');
c = c.replace(/ml-aut✕/g, 'ml-auto');
c = c.replace(/z-aut✕/g, 'z-auto');
c = c.replace(/overflow-y-aut✕/g, 'overflow-y-auto');

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');