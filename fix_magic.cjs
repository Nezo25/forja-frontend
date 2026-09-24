const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

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
  [/Em impress.*o/g, 'Em impressão']
];

for (const [regex, replacement] of replacements) {
  c = c.replace(regex, replacement);
}

// Icons
c = c.replace(/icon:\s*['"][^'"]*['"]/g, (match, offset, str) => {
  if (str.substring(Math.max(0, offset-50), offset).includes('catalogo')) return "icon: '📦'";
  if (str.substring(Math.max(0, offset-50), offset).includes('pedidos')) return "icon: '📝'";
  if (str.substring(Math.max(0, offset-50), offset).includes('orcamentos')) return "icon: '⚙️'";
  if (str.substring(Math.max(0, offset-50), offset).includes('estoque')) return "icon: '🧵'";
  if (str.substring(Math.max(0, offset-50), offset).includes('precos')) return "icon: '🏷️'";
  return match;
});

// Headers
c = c.replace(/(<h2 className="text-xl font-extrabold text-white mb-2">).*?(<\/h2>)/g, (match, p1, p2, offset, str) => {
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
});

// Fix typescript errors
c = c.replace(/scale: e\.target\.value,/g, "scale: e.target.value as any,");
c = c.replace(/material: e\.target\.value,/g, "material: e.target.value as any,");
c = c.replace(/category: initialData\?\.category \|\| 'Figures Pokémon',/g, "category: initialData?.category || 'Figures Pokémon',");

// Buttons (using basic concatenation to avoid backticks issue)
c = c.replace(/<button[^>]*>[^<]*Deletar<\/button>/g, '<button onClick={async () => { if(confirm("Certeza que deseja deletar?")) { try { await fetchApi("/models/" + p.id, { method: "DELETE" }); setCatalog(prev => prev.filter(x => x.id !== p.id)); } catch(e) { alert("Erro ao deletar!"); } } }} className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-[#374151]" style={{ background: "#3F1616", border: "1px solid #7F1D1D", color: "#FCA5A5" }}>🗑 Deletar</button>');
c = c.replace(/<button[^>]*>[^<]*Pausar<\/button>/g, '<button onClick={() => toggleActive(p.id)} className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-[#374151]" style={{ background: "#1F2937", border: "1px solid #374151", color: "#D1D5DB" }}>{p.active ? "⏸ Pausar" : "▶ Ativar"}</button>');
c = c.replace(/<button[^>]*>[^<]*Editar<\/button>/g, '<button onClick={() => setEditingProduct(p)} className="px-3 py-1 rounded-lg text-[11px] font-semibold transition-all hover:bg-[#374151]" style={{ background: "#1F2937", border: "1px solid #374151", color: "#60A5FA" }}>✏️ Editar</button>');
c = c.replace(/o /g, '✕'); // Fix the close button 'x'

// Hook up API
c = c.replace(/import \{ useState \} from 'react';/, "import { useState, useEffect } from 'react';\nimport { fetchApi } from '../api/client';");
c = c.replace(/const \[catalog, setCatalog\] = useState\(initialProducts\);/, "const [catalog, setCatalog] = useState<Product[]>([]);\n  useEffect(() => {\n    fetchApi('/models').then((data: any) => {\n      if (Array.isArray(data)) {\n        const formatted = data.map((m: any) => ({\n          id: m.id.toString(),\n          name: m.name,\n          category: m.category,\n          types: m.types || [],\n          scales: m.scales || ['1:10'],\n          materials: m.materials || ['PLA'],\n          basePrice: m.basePrice,\n          finishOptions: [],\n          image: m.imageUrl || 'https://placehold.co/600x700/1F2937/F97316?text=Figure',\n          printTimeH: m.printTimeH || 0,\n          filamentG: m.filamentG || 0,\n          active: m.active\n        }));\n        setCatalog(formatted);\n      }\n    }).catch(console.error);\n  }, []);");
c = c.replace(/function addProduct\(p: Partial<Product>\) \{[\s\S]*?setCatalog\(prev => \[p as Product, \.\.\.prev\]\);\n  \}/, "async function addProduct(p: Partial<Product>) {\n    const isEdit = !p.id?.startsWith('p');\n    const payload = {\n      name: p.name,\n      category: p.category,\n      types: p.types,\n      scales: p.scales,\n      materials: p.materials,\n      basePrice: p.basePrice,\n      imageUrl: p.image,\n      printTimeH: p.printTimeH,\n      filamentG: p.filamentG,\n      active: p.active\n    };\n    try {\n      if (isEdit) {\n        await fetchApi('/models/' + p.id, { method: 'PUT', body: JSON.stringify(payload) });\n        setCatalog(prev => prev.map(x => x.id === p.id ? { ...x, ...p } as Product : x));\n      } else {\n        const created: any = await fetchApi('/models', { method: 'POST', body: JSON.stringify(payload) });\n        setCatalog(prev => [{ ...p, id: created.id.toString() } as Product, ...prev]);\n      }\n    } catch (err) {\n      console.error('Erro', err);\n      alert('Erro ao salvar no banco!');\n    }\n  }");

// Cloudinary
c = c.replace(/active: initialData \? initialData\.active : true,\n  \}\);/, "active: initialData ? initialData.active : true,\n    imageFile: null as File | null,\n  });\n  const [isUploading, setIsUploading] = useState(false);");
c = c.replace(/<button type="submit" className="([^"]+)">{\(initialData \? 'Atualizar Produto' : 'Salvar Produto'\)}<\/button>/, "<button disabled={isUploading} type=\"submit\" className=\" disabled:opacity-50\">{isUploading ? 'Enviando...' : (initialData ? 'Atualizar Produto' : 'Salvar Produto')}</button>");
c = c.replace(/className="w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-\[#1F2937\] file:text-\[#F9FAFB\] hover:file:bg-\[#374151\]"/, "onChange={e => { if (e.target.files?.[0]) { const file = e.target.files[0]; setForm(f => ({ ...f, image: URL.createObjectURL(file), imageFile: file })) } }} className=\"w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1F2937] file:text-[#F9FAFB] hover:file:bg-[#374151]\"");
c = c.replace(/function handleSave\(e: React\.FormEvent\) \{/, "async function handleSave(e: React.FormEvent) {");
c = c.replace(/e\.preventDefault\(\);\n    onSave\(\{/, "e.preventDefault();\n    if (form.imageFile) {\n      setIsUploading(true);\n      const fd = new FormData();\n      fd.append('file', form.imageFile);\n      fd.append('upload_preset', 'forja_preset');\n      try {\n        const r = await fetch('https://api.cloudinary.com/v1_1/hsxlmx8k/image/upload', { method: 'POST', body: fd });\n        const d = await r.json();\n        if (d.secure_url) form.image = d.secure_url;\n      } catch (err) {\n        console.error(err);\n        alert('Erro ao enviar imagem. Verifique se o preset forja_preset está como Unsigned.');\n      } finally {\n        setIsUploading(false);\n      }\n    }\n    onSave({");

// Safe optional chaining
c = c.replace(/types: initialData\?\.types\.join\(\', \'\) \|\| \'\',/g, "types: initialData?.types?.join(', ') || '',");
c = c.replace(/scale: initialData\?\.scales\[0\] \|\| \'1:10\',/g, "scale: initialData?.scales?.[0] || '1:10',");
c = c.replace(/material: initialData\?\.materials\[0\] \|\| \'PLA\',/g, "material: initialData?.materials?.[0] || 'PLA',");

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');