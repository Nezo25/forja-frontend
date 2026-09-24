const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.backup.tsx', 'utf8');

const replacements = [
  [/Cat.*logo/g, 'Catálogo'],
  [/Or.*amentos/g, 'Orçamentos'],
  [/Pre.*os/g, 'Preços'],
  [/Acess.*rios/g, 'Acessórios'],
  [/Pok.*mon/g, 'Pokémon'],
  [/Drag.*o/g, 'Dragão'],
  [/Met.*lico/g, 'Metálico'],
  [/Pintado.*M.*o/g, 'Pintado à Mão'],
  [/Pe.*a Crua/g, 'Peça Crua'],
  [/A.*es/g, 'Ações'],
  [/Em impress.*o/g, 'Em impressão'],
  [/icon:\s*['"][^'"]*['"]/g, (match, offset, str) => {
    if (str.substring(Math.max(0, offset-50), offset).includes('catalogo')) return "icon: '📦'";
    if (str.substring(Math.max(0, offset-50), offset).includes('pedidos')) return "icon: '📝'";
    if (str.substring(Math.max(0, offset-50), offset).includes('orcamentos')) return "icon: '⚙️'";
    if (str.substring(Math.max(0, offset-50), offset).includes('estoque')) return "icon: '🧵'";
    if (str.substring(Math.max(0, offset-50), offset).includes('precos')) return "icon: '🏷️'";
    return match;
  }],
  [/(<h2 className="text-xl font-extrabold text-white mb-2">).*?(<\/h2>)/g, (match, p1, p2, offset, str) => {
    if (offset < c.indexOf('📦 Catálogo') + 500 && offset > 200) {
      return p1 + "📦 Catálogo" + p2;
    }
    if (offset > c.indexOf('📦 Catálogo') + 100) {
      if (str.substring(offset, offset+500).includes('Pedidos')) return p1 + "📝 Pedidos" + p2;
      if (str.substring(offset, offset+500).includes('Orçamentos')) return p1 + "⚙️ Orçamentos STL" + p2;
      if (str.substring(offset, offset+500).includes('Estoque')) return p1 + "🧵 Estoque Filamento" + p2;
      if (str.substring(offset, offset+500).includes('Ajuste')) return p1 + "🏷️ Ajuste de Preços" + p2;
    }
    return match;
  }]
];

for (const [regex, replacement] of replacements) {
  c = c.replace(regex, replacement);
}

// Fix typescript errors!
c = c.replace(/scale: e\.target\.value,/g, "scale: e.target.value as any,");
c = c.replace(/material: e\.target\.value,/g, "material: e.target.value as any,");
c = c.replace(/category: initialData\?\.category \|\| 'Figures Pokémon',/g, "category: initialData?.category || 'Figures Pokémon',");

// Fix the file input missing imageFile error
c = c.replace(/setForm\(f => \(\{ \.\.\.f, image: URL\.createObjectURL\(file\) \}\)\)/, "setForm(f => ({ ...f, image: URL.createObjectURL(file), imageFile: file }))");
c = c.replace(/imageFile: null as File \| null,/g, "");
c = c.replace(/active: initialData \? initialData\.active : true,/, "active: initialData ? initialData.active : true,\n    imageFile: null as File | null,");
c = c.replace(/const \[isUploading, setIsUploading\] = useState\(false\);/, "");
c = c.replace(/function ProductModal[\s\S]*?\{/, (m) => m + "\n  const [isUploading, setIsUploading] = useState(false);");

// Fix the Deletar button which is corrupted and might have typescript errors
c = c.replace(/<button[^>]*>[^<]*Deletar<\/button>/g, \<button onClick={async () => {
                                  if(confirm('Certeza que deseja deletar?')) {
                                    try {
                                      await fetchApi(\\\/models/\\\\\\, { method: 'DELETE' });
                                      setCatalog(prev => prev.filter(x => x.id !== p.id));
                                    } catch(e) { alert('Erro ao deletar!'); }
                                  }
                                }} className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-[#374151]" style={{ background: '#3F1616', border: '1px solid #7F1D1D', color: '#FCA5A5' }}>🗑 Deletar</button>\);

c = c.replace(/<button[^>]*>[^<]*Pausar<\/button>/g, \<button onClick={() => toggleActive(p.id)} className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-[#374151]" style={{ background: '#1F2937', border: '1px solid #374151', color: '#D1D5DB' }}>{p.active ? "⏸ Pausar" : "▶ Ativar"}</button>\);

c = c.replace(/<button[^>]*>[^<]*Editar<\/button>/g, \<button onClick={() => setEditingProduct(p)} className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-[#374151]" style={{ background: '#1F2937', border: '1px solid #374151', color: '#60A5FA' }}>✏️ Editar</button>\);

c = c.replace(//g, ''); // Clear remaining broken bytes


fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
