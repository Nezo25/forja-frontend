const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

const map = {
  'Cat\u00C3\u00A1logo': 'Catálogo',
  'Or\u00C3\u00A7amentos': 'Orçamentos',
  'Pre\u00C3\u00A7os': 'Preços',
  'Acess\u00C3\u00B3rios': 'Acessórios',
  'Pok\u00C3\u00A9mon': 'Pokémon',
  'Drag\u00C3\u00A3o': 'Dragão',
  'Met\u00C3\u00A1lico': 'Metálico',
  'Pintado \u00C3\u00A0 M\u00C3\u00A3o': 'Pintado à Mão',
  'Pe\u00C3\u00A7a Crua': 'Peça Crua',
  'A\u00C3\u00A7\u00C3\u00B5es': 'Ações',
  'A\u00C3\u00A7\u00C3\u00A3o': 'Ação',
  'Em impress\u00C3\u00A3o': 'Em impressão',
  '?? Editar': '✏️ Editar',
  'o ': '✕ ',
  '\u00C3\u00B3': 'ó',
  '\u00C3\u00A9': 'é',
  '\u00C3\u00A3': 'ã',
  '\u00C3\u00A1': 'á',
  '\u00C3\u00A7': 'ç',
  '\u00C3\u00AD': 'í',
  '\u00C3\u00A2': 'â',
  '\u00C3\u008D': 'Í'
};

for (const [bad, good] of Object.entries(map)) {
  c = c.split(bad).join(good);
}

// Fix buttons that have corrupted icons
c = c.replace(/<button[^>]*>[^<]*Deletar<\/button>/g, '<button onClick={() => setCatalog(prev => prev.filter(x => x.id !== p.id))} className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-[#374151]" style={{ background: "#3F1616", border: "1px solid #7F1D1D", color: "#FCA5A5" }}>🗑 Deletar</button>');
c = c.replace(/<button[^>]*>[^<]*Pausar<\/button>/g, '<button onClick={() => toggleActive(p.id)} className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-[#374151]" style={{ background: "#1F2937", border: "1px solid #374151", color: "#D1D5DB" }}>{p.active ? "⏸ Pausar" : "▶ Ativar"}</button>');

// Fix TS errors
c = c.replace(/scale: e\.target\.value,/g, "scale: e.target.value as any,");
c = c.replace(/material: e\.target\.value,/g, "material: e.target.value as any,");
c = c.replace(/category: initialData\?\.category \|\| 'Figures Pokémon',/g, "category: initialData?.category || 'Figures Pokémon',");

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
