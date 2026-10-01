const fs = require('fs');
let code = fs.readFileSync('src/components/Hero.tsx', 'utf8');

code = code.replace(/py-12 md:py-16/, 'py-8 md:py-16');
code = code.replace(/text-xs font-semibold mb-4/, 'text-[10px] md:text-xs font-semibold mb-3 md:mb-4');
code = code.replace(/text-3xl md:text-5xl font-extrabold leading-\[1\.15\] mb-3/, 'text-2xl md:text-5xl font-extrabold leading-[1.15] mb-2 md:mb-3');
code = code.replace(/text-\[15px\] mb-6/, 'text-sm md:text-[15px] mb-4 md:mb-6');

fs.writeFileSync('src/components/Hero.tsx', code);
