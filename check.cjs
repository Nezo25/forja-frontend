const fs = require('fs');
let c = fs.readFileSync('src/pages/Admin.tsx', 'utf8');
console.log('Has Cat...', c.includes('CatÃ¡logo'));
console.log('Has Emoji...', c.includes('ðŸ”©'));