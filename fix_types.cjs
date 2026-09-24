const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

c = c.replace(/scale: e.target.value as any\s*\}\)\)/g, "scale: e.target.value as any } as any))");
c = c.replace(/material: e.target.value as any\s*\}\)\)/g, "material: e.target.value as any } as any))");
c = c.replace(/category: initialData\?.category \|\| 'Figures Pokémon',/g, "category: (initialData?.category || 'Figures Pokémon') as any,");

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
