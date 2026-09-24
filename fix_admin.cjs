const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

c = c.replace(/import { useState } from 'react';/, "import { useState, useEffect } from 'react';\nimport { fetchApi } from '../api/client';");

c = c.replace(/const \[catalog, setCatalog\] = useState\(initialProducts\);/, 
  const [catalog, setCatalog] = useState<Product[]>([]);
  useEffect(() => {
    fetchApi('/models').then((data: any) => {
      if (Array.isArray(data)) {
        const formatted = data.map((m: any) => ({
          id: m.id.toString(),
          name: m.name,
          category: m.category,
          types: m.types || [],
          scales: m.scales || ['1:10'],
          materials: m.materials || ['PLA'],
          basePrice: m.basePrice,
          finishOptions: [],
          image: m.imageUrl || 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
          printTimeH: m.printTimeH || 0,
          filamentG: m.filamentG || 0,
          active: m.active
        }));
        setCatalog(formatted);
      }
    }).catch(console.error);
  }, []););

c = c.replace(/onClick=\{\(\) => setCatalog\(prev => prev.filter\(x => x.id !== p.id\)\)\}/, 
  onClick={async () => {
    if(confirm('Certeza que deseja deletar?')) {
      try {
        await fetchApi(\/models/\\, { method: 'DELETE' });
        setCatalog(prev => prev.filter(x => x.id !== p.id));
      } catch(e) { alert('Erro ao deletar!'); }
    }
  }}
);

c = c.replace(/function addProduct\(p: Partial<Product>\) {[\s\S]*?setCatalog\(prev => \[p as Product, \.\.\.prev\]\);\n  }/, 
  sync function addProduct(p: Partial<Product>) {
    const isEdit = !p.id?.startsWith('p');
    const payload = {
      name: p.name,
      category: p.category,
      types: p.types,
      scales: p.scales,
      materials: p.materials,
      basePrice: p.basePrice,
      imageUrl: p.image,
      printTimeH: p.printTimeH,
      filamentG: p.filamentG,
      active: p.active
    };

    try {
      if (isEdit) {
        await fetchApi(\/models/\\, { method: 'PUT', body: JSON.stringify(payload) });
        setCatalog(prev => prev.map(x => x.id === p.id ? { ...x, ...p } as Product : x));
      } else {
        const created: any = await fetchApi('/models', { method: 'POST', body: JSON.stringify(payload) });
        setCatalog(prev => [{ ...p, id: created.id.toString() } as Product, ...prev]);
      }
    } catch (err) {
      console.error('Erro ao salvar no banco', err);
      alert('Erro ao salvar no banco de dados!');
    }
  }
);

// Fix crash-prone states
c = c.replace(/types: initialData\?\.types\.join\(\', \'\) \|\| \'\',/g, "types: initialData?.types?.join(', ') || '',");
c = c.replace(/scale: initialData\?\.scales\[0\] \|\| \'1:10\',/g, "scale: initialData?.scales?.[0] || '1:10',");
c = c.replace(/material: initialData\?\.materials\[0\] \|\| \'PLA\',/g, "material: initialData?.materials?.[0] || 'PLA',");
c = c.replace(/imageFile: null as File \| null,/g, "");

c = c.replace(/active: initialData \? initialData\.active : true,\n  \}\);/, "active: initialData ? initialData.active : true,\n    imageFile: null as File | null,\n  });\n  const [isUploading, setIsUploading] = useState(false);");

c = c.replace(/if \(form\.imageFile\) {/, "if (form.imageFile) {\n      setIsUploading(true);");
c = c.replace(/alert\('Erro ao enviar imagem. Verifique se o preset forja_preset est. como Unsigned\.'\);\n      }\n/, "alert('Erro ao enviar imagem. Verifique se o preset forja_preset est\xE1 como Unsigned.');\n      } finally {\n        setIsUploading(false);\n      }\n");

c = c.replace(/<button type="submit" className="([^"]+)">{isUploading \? "Enviando Imagem \?\?\.\.\." : \(initialData \? "Atualizar Produto" : "Salvar Produto"\)} \?\?\?<\/button>/, "<button disabled={isUploading} type=\"submit\" className=\" disabled:opacity-50\">{isUploading ? 'Enviando Imagem...' : (initialData ? 'Atualizar Produto' : 'Salvar Produto')}</button>");
c = c.replace(/<button type="submit" className="([^"]+)">{\(initialData \? 'Atualizar Produto' : 'Salvar Produto'\)}<\/button>/, "<button disabled={isUploading} type=\"submit\" className=\" disabled:opacity-50\">{isUploading ? 'Enviando Imagem...' : (initialData ? 'Atualizar Produto' : 'Salvar Produto')}</button>");

// Fix Emojis
c = c.replace(/\?\? Editar/g, '✏️ Editar');
c = c.replace(/â ¸ Pausar/g, '⏸ Pausar');
c = c.replace(/â–¶ Ativar/g, '▶ Ativar');
c = c.replace(/ðŸ—‘/g, '🗑');
c = c.replace(/AcessÃ³rios/g, 'Acessórios');
c = c.replace(/PokÃ©mon/g, 'Pokémon');
c = c.replace(/DragÃ£o/g, 'Dragão');
c = c.replace(/MetÃ¡lico/g, 'Metálico');
c = c.replace(/Pintado Ã  MÃ£o/g, 'Pintado à Mão');
c = c.replace(/PeÃ§a Crua/g, 'Peça Crua');
c = c.replace(/CatÃ¡logo/g, 'Catálogo');
c = c.replace(/AÃ§Ã£o/g, 'Ação');
c = c.replace(/PreÃ§os/g, 'Preços');
c = c.replace(/OrÃ§amentos/g, 'Orçamentos');
c = c.replace(/Ã/g, ''); // Clear remaining mojibake from double encoding

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
