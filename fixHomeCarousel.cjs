const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

// Replace Control Bar with Category Carousel + Filter Button
const newControlBar = `
      {/* Control Bar */}
      <div className="sticky top-16 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-gray-800 py-3">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          
          {/* Categorias - Quick Nav */}
          <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 pb-1 -mb-1">
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, categories: [] }));
              }}
              className={\`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border \${
                filters.categories.length === 0 
                  ? 'bg-orange-500/20 border-orange-500 text-orange-500' 
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200'
              }\`}
            >
              Todas
            </button>
            {['Figures Pokémon', 'Dioramas e Cenários', 'Chibis / Miniaturas', 'Acessórios & Colecionáveis'].map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setFilters(prev => {
                    // Limpar tipos elementais ao selecionar categorias que não sejam Figures Pokémon
                    let newTypes = prev.types;
                    if (cat !== 'Figures Pokémon') {
                      newTypes = [];
                    }
                    return { ...prev, categories: [cat], types: newTypes };
                  });
                }}
                className={\`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border \${
                  filters.categories.includes(cat)
                    ? 'bg-orange-500/20 border-orange-500 text-orange-500' 
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200'
                }\`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setFilterDrawerOpen(true)}
            className="shrink-0 flex items-center gap-2 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-full text-sm font-semibold transition-colors border border-gray-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filtros {activeFiltersCount > 0 && <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-md">{activeFiltersCount}</span>}
          </button>
        </div>
      </div>
`;

code = code.replace(/{\/\* Control Bar \*\/}[\s\S]*?<\/div>\s*<\/div>\s*<\/div>/, newControlBar.trim());
fs.writeFileSync('src/pages/Home.tsx', code);
