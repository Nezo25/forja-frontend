const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
let match = c.match(/Cat.*?logo/g);
console.log('Matches:', match);