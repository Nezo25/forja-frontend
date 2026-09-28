const fs = require('fs');
let c = fs.readFileSync('src/components/Header.tsx', 'utf8');
c = c.replace(/<img src="\/logo\.png"/g, '<img src="/logo.jpg"');
c = c.replace(/Y"\? Oramento STL/g, '🛠️ Orçamento STL');
// fix any other instances of broken characters
c = c.replace(/Oramento/g, 'Orçamento');
fs.writeFileSync('src/components/Header.tsx', c, 'utf8');