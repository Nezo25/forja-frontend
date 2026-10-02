import { ALL_CATEGORIES, ALL_FINISHES, ALL_SCALES, ALL_TYPES, type Category, type Finish, type PokemonType, type Scale, TYPE_COLORS } from '@/data/products';
import { type Filters } from '@/pages/Home';

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
  onClose: () => void;
  open: boolean;
}

export function FilterDrawer({ filters, onChange, onClose, open }: Props) {
  function toggleIn<T extends string>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
  }

  const hasFilters =
    filters.categories.length > 0 ||
    filters.types.length > 0 ||
    filters.scales.length > 0 ||
    filters.finishes.length > 0;

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/60 z-50 transition-opacity" onClick={onClose} />
      <div className="fixed right-0 top-0 bottom-0 w-full max-w-sm bg-[#111827] z-50 flex flex-col shadow-2xl animate-in slide-in-from-right">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center">
          <h2 className="font-bold text-lg text-gray-100">Filtros</h2>
          <button onClick={onClose} className="p-2 bg-gray-800 rounded-full text-gray-400 hover:text-white">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
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

          {/* Escalas */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Escala</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_SCALES.map(s => (
                <button
                  key={s}
                  onClick={() => onChange({ ...filters, scales: toggleIn(filters.scales, s) })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${filters.scales.includes(s) ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-gray-800 border-gray-700 text-gray-300'}`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Acabamento */}
          <div className="flex flex-col gap-3">
            <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Acabamento</h3>
            <div className="flex flex-wrap gap-2">
              {ALL_FINISHES.map(f => (
                <button
                  key={f}
                  onClick={() => onChange({ ...filters, finishes: toggleIn(filters.finishes, f) })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all border ${filters.finishes.includes(f) ? 'bg-orange-500/20 border-orange-500 text-orange-500' : 'bg-gray-800 border-gray-700 text-gray-300'}`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-800 flex gap-3 bg-[#111827]">
          {hasFilters && (
            <button
              onClick={() => onChange({ categories: [], types: [], scales: [], finishes: [] })}
              className="flex-1 py-3 rounded-lg font-bold text-gray-300 bg-gray-800 hover:bg-gray-700 transition-colors"
            >
              Limpar Filtros
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-[2] py-3 rounded-lg font-bold text-white bg-orange-500 hover:bg-orange-600 transition-colors"
          >
            Ver Resultados
          </button>
        </div>
      </div>
    </>
  );
}
