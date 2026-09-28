const fs = require('fs');
let c = fs.readFileSync('src/pages/Home.tsx', 'utf8');

c = c.replace(/ðŸ”©/g, '🔩');
c = c.replace(/â€”/g, '–');
c = c.replace(/Ã /g, 'à');
c = c.replace(/â†’/g, '→');
c = c.replace(/Â©/g, '©');
c = c.replace(/Â·/g, '·');
c = c.replace(/ImpressÃ£o/g, 'Impressão');
// Note: \x8D inside a string literal matches the bad character
c = c.replace(/ðŸ”\x8D/g, '🔍');

fs.writeFileSync('src/pages/Home.tsx', c, 'utf8');