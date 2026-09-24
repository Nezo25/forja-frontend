const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

c = c.replace(/>\s*\?\?\s*Editar\s*<\/button>/g, '>✏️ Editar</button>');
c = c.replace(/>\s*ǽ\?\s*Pausar\s*:\s*'ǽ\?"\s*Ativar'\s*}/g, '>{p.active ? "⏸ Pausar" : "▶ Ativar"}');
c = c.replace(/>\s*ǽY-'\s*Deletar\s*<\/button>/g, '>🗑 Deletar</button>');
c = c.replace(/>\s*ǽ"\?\s*<\/button>/g, '>✕</button>');

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
