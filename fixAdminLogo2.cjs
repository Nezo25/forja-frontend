const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(
  /<div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-lg shadow-orange-950\/50"[\s\S]*?<\/div>/,
  `<img src="/logo.png" alt="Forja Admin" className="w-10 h-10 rounded-lg object-cover bg-orange-500/20" />`
);

fs.writeFileSync('src/pages/Admin.tsx', code);
