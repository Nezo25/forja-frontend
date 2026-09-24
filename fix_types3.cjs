const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');

c = c.replace(/category: form.category,/g, "category: form.category as any,");

fs.writeFileSync('src/pages/Admin.tsx', c, 'utf8');
