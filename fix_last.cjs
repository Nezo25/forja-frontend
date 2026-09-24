const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

c = c.replace(/Pintad✕/g, 'Pintado');
c = c.replace(/category: initialData\?\.category \|\| 'Figures PokÃ©mon',/g, "category: initialData?.category || 'Figures Pokémon',");
c = c.replace(/category: initialData\?\.category \|\| 'Figures Pokémon',/g, "category: (initialData?.category as any) || 'Figures Pokémon',");
c = c.replace(/scale: e\.target\.value as any,/g, "scale: e.target.value as any,"); // Wait, let's just make it cast to Scale
c = c.replace(/scale: e\.target\.value,/g, "scale: e.target.value as any,");
c = c.replace(/material: e\.target\.value,/g, "material: e.target.value as any,");

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
