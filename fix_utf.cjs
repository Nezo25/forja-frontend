const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

c = c.replace(/\?\? Editar/g, '✏️ Editar');
c = c.replace(/ǽ\?" Ativar/g, '▶ Ativar');
c = c.replace(/ǽ\? Pausar/g, '⏸ Pausar');
c = c.replace(/ǽY-' Deletar/g, '🗑 Deletar');
c = c.replace(/Acessrios/g, 'Acessórios');
c = c.replace(/PokǸmon/g, 'Pokémon');
c = c.replace(/Dragǜo/g, 'Dragão');
c = c.replace(/Metǭlico/g, 'Metálico');
c = c.replace(/Pintado  Mǜo/g, 'Pintado à Mão');
c = c.replace(/Pea Crua/g, 'Peça Crua');
c = c.replace(/Catǭlogo/g, 'Catálogo');
c = c.replace(/Aǜo/g, 'Ação');
c = c.replace(/Preos/g, 'Preços');
c = c.replace(/Oramentos/g, 'Orçamentos');
c = c.replace(/ǽ"\?<\/button>/g, '✕</button>');

// Remove any lingering unknown unicode fragments or just write it back
fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
