const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
c = c.replace(/useState<any\[\]>\(\[\]\);\n  useEffect/, "useState<Product[]>([]);\n  useEffect");
fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
