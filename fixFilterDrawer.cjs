const fs = require('fs');
let code = fs.readFileSync('src/components/FilterDrawer.tsx', 'utf8');

// The Types block
const oldTypesBlock = /\{\/\* Tipos \*\/\}[\s\S]*?\/\* Escalas \*\//;
const newTypesBlock = `
          {/* Tipos (Contextual) */}
          {(filters.categories.length === 0 || filters.categories.includes('Figures Pokémon')) && (
            <div className="flex flex-col gap-3">
              <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Tipo Pokémon</h3>
              <div className="flex flex-wrap gap-2">
                {ALL_TYPES.map(t => {
                  const active = filters.types.includes(t);
                  const col = (TYPE_COLORS as any)[t];
                  return (
                    <button
                      key={t}
                      onClick={() => onChange({ ...filters, types: toggleIn(filters.types, t) })}
                      className="px-3 py-1.5 rounded-lg text-sm font-medium transition-all border"
                      style={active
                        ? { background: col?.bg || 'rgba(249,115,22,0.15)', color: col?.text || '#F97316', borderColor: col?.text || '#F97316' }
                        : { background: '#1F2937', color: '#9CA3AF', borderColor: '#374151' }
                      }
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Escalas */`;

code = code.replace(oldTypesBlock, newTypesBlock);

// Remove Categoria block since it's in the Carousel now
const catBlock = /\{\/\* Categoria \*\/\}[\s\S]*?\{\/\* Tipos/;
code = code.replace(catBlock, `{/* Tipos`);

fs.writeFileSync('src/components/FilterDrawer.tsx', code);
