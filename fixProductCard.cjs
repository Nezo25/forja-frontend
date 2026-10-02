const fs = require('fs');
let code = fs.readFileSync('src/components/ProductCard.tsx', 'utf8');

// Aspect ratio 4/5 -> square
code = code.replace(/aspect-\[4\/5\]/, 'aspect-square');

// Compact Padding
code = code.replace(/p-4 flex-1/, 'p-3 md:p-4 flex-1');

// Title 2 lines max (line-clamp-2)
code = code.replace(/<h3 className="font-bold text-\[15px\] leading-tight" style=\{\{ color: '#F9FAFB' \}\}>\{product.name\}<\/h3>/, '<h3 className="font-bold text-[14px] md:text-[15px] leading-tight line-clamp-2" style={{ color: \'#F9FAFB\' }}>{product.name}</h3>');

// Buttons h-8 -> h-9, text-[13px] -> text-xs md:text-sm
code = code.replace(/h-8 rounded-lg text-\[13px\] font-bold transition-all border/g, 'h-9 rounded-lg text-xs md:text-sm font-bold transition-all border');
code = code.replace(/h-8 rounded-lg text-\[13px\] font-bold transition-all bg-orange-500/g, 'h-9 rounded-lg text-xs md:text-sm font-bold transition-all bg-orange-500');

// Tags scale down
code = code.replace(/text-\[10px\] uppercase tracking-wide font-medium/, 'text-[9px] md:text-[10px] uppercase tracking-wide font-medium');

fs.writeFileSync('src/components/ProductCard.tsx', code);
