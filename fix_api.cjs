const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

c = c.replace(/fetchApi\('\/models'\)\.then\(\(data: any\) => \{[\s\S]*?\}\)\.catch\(console\.error\);/,
etchApi('/models').then((data: any) => {
      const items = data.content || data || [];
      if (Array.isArray(items)) {
        const formatted = items.map((m: any) => ({
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
    }).catch(console.error););

c = c.replace(/const \[orcamentos, setOrcamentos\] = useState\(MOCK_STL\);/,
const [orcamentos, setOrcamentos] = useState<any[]>([]);
  useEffect(() => {
    fetchApi('/quotes').then((data: any) => {
      if(Array.isArray(data)) {
        setOrcamentos(data.map((q: any) => ({
          id: '#S' + q.id.toString().padStart(3, '0'),
          realId: q.id,
          cliente: q.customerName || 'Cliente',
          arquivo: q.fileName || 'arquivo.stl',
          status: q.status || 'Aguardando análise',
          data: new Date(q.createdAt).toLocaleDateString('pt-BR')
        })));
      }
    }).catch(console.error);
  }, []););

c = c.replace(/onSave\(\{[\s\S]*?active: form\.active,[\s\S]*?\}\);/g,
const payload = {
        name: form.name,
        pokedexNumber: 0,
        generation: 1,
        primaryType: form.types.split(',')[0]?.trim() || 'Normal',
        secondaryType: form.types.split(',')[1]?.trim() || null,
        scale: form.scale,
        basePrintTimeMinutes: (parseInt(form.printTimeH) || 0) * 60,
        defaultFilamentGrams: parseInt(form.filamentG) || 0,
        imageUrl: form.image || 'https://placehold.co/600x700/1F2937/F97316?text=Figure'
      };
      
      const method = initialData ? 'PUT' : 'POST';
      const url = initialData ? \/models/\\ : '/models';
      
      fetchApi(url, {
        method,
        body: JSON.stringify(payload)
      }).then((saved: any) => {
        onSave({
          id: saved.id.toString(),
          name: saved.name,
          category: saved.category || form.category as any,
          types: [saved.primaryType, saved.secondaryType].filter(Boolean) as PokemonType[],
          scales: [saved.scale as any],
          materials: [form.material as any],
          basePrice: parseFloat(form.basePrice) || 0,
          finishOptions: [],
          image: saved.imageUrl,
          printTimeH: Math.floor((saved.basePrintTimeMinutes || 0) / 60),
          filamentG: saved.defaultFilamentGrams || 0,
          active: saved.isActive !== false
        });
      }).catch(console.error););

c = c.replace(/onClick=\{\(\) => setCatalog\(prev => prev\.filter\(x => x\.id !== p\.id\)\)\}/g,
onClick={() => {
                                  if(confirm('Tem certeza?')) {
                                    fetchApi(\/models/\\, { method: 'DELETE' }).then(() => {
                                      setCatalog(prev => prev.filter(x => x.id !== p.id));
                                    }).catch(console.error);
                                  }
                                }});

c = c.replace(/onClick=\{\(\) => setOrcamentos\(prev => prev\.filter\(x => x\.id !== s\.id\)\)\}/g,
onClick={() => {
                            if(confirm('Deletar orçamento?')) {
                              fetchApi(\/quotes/\\, { method: 'DELETE' }).then(() => {
                                setOrcamentos(prev => prev.filter(x => x.id !== s.id));
                              }).catch(console.error);
                            }
                          }});

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');