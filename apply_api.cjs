const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// 1. Imports
c = c.replace(
  "import { useState } from 'react';", 
  "import { useState, useEffect } from 'react';\nimport { fetchApi } from '../api/client';"
);

// 2. Catalog State & Fetch
c = c.replace(
  "const [catalog, setCatalog] = useState(initialProducts);",
  const [catalog, setCatalog] = useState<Product[]>([]);

  useEffect(() => {
    fetchApi('/models').then((data: any) => {
      if (Array.isArray(data)) {
        const formatted = data.map(m => ({
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
  }, []);
);

// 3. Delete Button
c = c.replace(
  "onClick={() => setCatalog(prev => prev.filter(x => x.id !== p.id))}",
  onClick={async () => {
                                  if(confirm('Certeza que deseja deletar?')) {
                                    try {
                                      await fetchApi(\/models/\\, { method: 'DELETE' });
                                      setCatalog(prev => prev.filter(x => x.id !== p.id));
                                    } catch(e) { alert('Erro ao deletar!'); }
                                  }
                                }}
);

// 4. isUploading state inside ProductModal
c = c.replace(
  "active: initialData ? initialData.active : true,\n  });",
  "active: initialData ? initialData.active : true,\n    imageFile: null as File | null,\n  });\n  const [isUploading, setIsUploading] = useState(false);"
);

// 5. Safe optional chaining for modal inputs
c = c.replace("types: initialData?.types.join(', ') || '',", "types: initialData?.types?.join(', ') || '',");
c = c.replace("scale: initialData?.scales[0] || '1:10',", "scale: initialData?.scales?.[0] || '1:10',");
c = c.replace("material: initialData?.materials[0] || 'PLA',", "material: initialData?.materials?.[0] || 'PLA',");

// 6. Handle Save in Modal
c = c.replace(
  "function addProduct(p: Partial<Product>) {",
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

  function addProduct_old(p: Partial<Product>) {
);

c = c.replace(
  "onSave({\n      id: initialData?.id || p\",
  "onSave({\n      id: initialData?.id || p\" // Wait, 1e9bbc2 probably had "p" in double quotes!
);
// Let's use regex for the id creation
c = c.replace(/id:\s*initialData\?\.id\s*\|\|\s*["']p\$\{Date\.now\(\)\}["']/, "id: initialData?.id || p");


// 7. setIsUploading inside upload block
c = c.replace(
  "if (form.imageFile) {",
  "if (form.imageFile) {\n      setIsUploading(true);"
);

c = c.replace(
  "alert('Erro ao enviar imagem. Verifique se o preset forja_preset est\u00E1 como Unsigned.');\n      }\n",
  "alert('Erro ao enviar imagem. Verifique se o preset forja_preset está como Unsigned.');\n      } finally {\n        setIsUploading(false);\n      }\n"
);

// 8. Disable button
c = c.replace(
  ">{(initialData ? \"Atualizar Produto\" : \"Salvar Produto\")}</button>",
  " disabled={isUploading}>{isUploading ? 'Enviando Imagem...' : (initialData ? \"Atualizar Produto\" : \"Salvar Produto\")}</button>"
);

// 9. Input file onChange
c = c.replace(
  "className=\"w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1F2937] file:text-[#F9FAFB] hover:file:bg-[#374151]\"",
  "onChange={e => {\n                    if (e.target.files?.[0]) {\n                      const file = e.target.files[0];\n                      setForm(f => ({ ...f, image: URL.createObjectURL(file), imageFile: file }))\n                    }\n                  }}\n                  className=\"w-full text-sm text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-[#1F2937] file:text-[#F9FAFB] hover:file:bg-[#374151]\""
);

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
