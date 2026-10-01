const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace(
  /\}, \[search, filters\]\);/,
  `}, [products, search, filters]);`
);

fs.writeFileSync('src/pages/Home.tsx', code);
