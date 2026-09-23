const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Replace form state to include imageFile and uploading state
content = content.replace(/image: initialData\?\.image \|\| '',\r?\n    active: initialData \? initialData\.active : true,\r?\n  \}\);/g, 
\image: initialData?.image || '', 
    active: initialData ? initialData.active : true,
    imageFile: null as File | null,
  });
  const [isUploading, setIsUploading] = useState(false);\);

// Replace handleSave to be async and upload to Cloudinary
const oldHandleSave = /function handleSave\(e: React\.FormEvent\) \{[\s\S]*?onClose\(\);\r?\n  \}/g;
const newHandleSave = \sync function handleSave(e: React.FormEvent) {
    e.preventDefault();
    let finalImageUrl = form.image;
    
    if (form.imageFile) {
      setIsUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', form.imageFile);
        formData.append('upload_preset', 'forja_preset');
        
        const res = await fetch('https://api.cloudinary.com/v1_1/hsxlmx8k/image/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.secure_url) {
          finalImageUrl = data.secure_url;
        }
      } catch (err) {
        console.error('Erro no upload da imagem', err);
        alert('Erro ao enviar imagem. Verifique se o preset forja_preset está como Unsigned.');
      } finally {
        setIsUploading(false);
      }
    }

    onSave({
      id: initialData?.id || \\\p\$\\{Date.now()}\\+\\\,
      name: form.name,
      category: form.category,
      types: form.types.split(',').map(t => t.trim()).filter(Boolean) as PokemonType[],
      scales: [form.scale as any],
      materials: [form.material as any],
      basePrice: parseFloat(form.basePrice) || 0,
      finishOptions: [{ label: 'Peça Crua', extra: 0 }, { label: 'Com Primer', extra: 25 }, { label: 'Pintado à Mão', extra: 85 }],
      image: finalImageUrl || 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
      printTimeH: parseInt(form.printTimeH) || 0,
      filamentG: parseInt(form.filamentG) || 0,
      active: form.active,
    });
    onClose();
  }\;
content = content.replace(oldHandleSave, newHandleSave);

// Update file input onChange to save imageFile
const oldInput = /onChange=\{e => \{[\s\S]*?\}\}/g;
const newInput = \onChange={e => {
                  if (e.target.files?.[0]) {
                    const file = e.target.files[0];
                    setForm(f => ({ ...f, image: URL.createObjectURL(file), imageFile: file }))
                  }
                }}\;
content = content.replace(oldInput, newInput);

// Update submit button to show loading
const oldBtn = /<button type="submit" className="w-full h-11 rounded-xl font-extrabold text-sm mt-1".*?<\/button>/g;
const newBtn = \<button disabled={isUploading} type="submit" className="w-full h-11 rounded-xl font-extrabold text-sm mt-1 disabled:opacity-50" style={{ background: '#F97316', color: '#fff' }}>{isUploading ? "Enviando Imagem..." : (initialData ? "Atualizar Produto" : "Salvar Produto")} 🛠️</button>\;
content = content.replace(oldBtn, newBtn);

fs.writeFileSync('src/pages/Admin.tsx', content);
