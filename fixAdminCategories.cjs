const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

// Replace hardcoded map with ALL_CATEGORIES
code = code.replace(
  /\{\['Figures Pok[^']*','Dioramas','Chibis','Acess[^']*'\]\.map\(c => <option key=\{c\}>\{c\}<\/option>\)\}/g,
  "{ALL_CATEGORIES.map(c => <option key={c}>{c}</option>)}"
);

// If there's an import needed: ALL_CATEGORIES is probably already imported along with Category. Let's check imports.
if (!code.includes('ALL_CATEGORIES')) {
  code = code.replace(/type Category/, 'type Category, ALL_CATEGORIES');
}

fs.writeFileSync('src/pages/Admin.tsx', code);
