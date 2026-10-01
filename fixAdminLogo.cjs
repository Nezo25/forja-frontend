const fs = require('fs');
let code = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

code = code.replace(
  /<div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shadow-lg shadow-orange-950\/50" style={{ background: 'linear-gradient\(135deg,#F97316,#EA580C\)' }}>🔨<\/div>/g,
  `<img src="/logo.png" alt="Forja Admin" className="w-9 h-9 rounded-lg object-cover" />`
);

fs.writeFileSync('src/pages/Admin.tsx', code);
