const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

c = c.replace(/[^>\n]*\sEditar\s*<\/button>/g, ' ✏️ Editar</button>');
c = c.replace(/[^>\n]*\sPausar\s*'\s*:\s*'[^']*\sAtivar'\s*}/g, ' {p.active ? "⏸ Pausar" : "▶ Ativar"}');
c = c.replace(/[^>\n]*\sDeletar\s*<\/button>/g, ' 🗑 Deletar</button>');
c = c.replace(/[^>\n]*<\/button>\s*<\/div>\s*<div className="p-5/g, '✕</button></div><div className="p-5');

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
