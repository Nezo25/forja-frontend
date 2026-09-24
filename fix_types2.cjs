const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

c = c.replace(/category: \(initialData\?\.category \|\| 'Figures Pokémon'\) as any,/g, "category: (initialData?.category || 'Figures Pokémon') as any,");
c = c.replace(/scale: e.target.value as any \}/g, "scale: e.target.value as any } as any");
c = c.replace(/material: e.target.value as any \}/g, "material: e.target.value as any } as any");
c = c.replace(/scale: e.target.value as any,/g, "scale: e.target.value as any,");
c = c.replace(/setForm\(f => \(\{ \.\.\.f, scale: e.target.value \}\)\)/g, "setForm(f => ({ ...f, scale: e.target.value as any }))");
c = c.replace(/setForm\(f => \(\{ \.\.\.f, material: e.target.value \}\)\)/g, "setForm(f => ({ ...f, material: e.target.value as any }))");
c = c.replace(/category: initialData\?\.category \|\| 'Figures Pokémon',/g, "category: (initialData?.category as any) || 'Figures Pokémon',");

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
