import { ALL_CATEGORIES, ALL_FINISHES, ALL_SCALES, ALL_TYPES, type Category, type Finish, type PokemonType, type Scale, TYPE_COLORS } from '@/data/products';

export interface Filters {
  categories: Category[];
  types: PokemonType[];
  scales: Scale[];
  finishes: Finish[];
}

interface Props {
  filters: Filters;
  onChange: (f: Filters) => void;
}

function Toggle<T extends string>({ label, values, active, onToggle, colorMap }: {
  label: string; values: T[]; active: T[];
  onToggle: (v: T) => void;
  colorMap?: Record<T, { text: string; bg: string }>;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-[11px] font-semibold uppercase tracking-widest shrink-0" style={{ color: '#6B7280' }}>{label}</span>
      <div className="flex flex-wrap gap-1.5">
        {values.map(v => {
          const on = active.includes(v);
          const col = colorMap?.[v];
          return (
            <button
              key={v}
              onClick={() => onToggle(v)}
              className="px-2.5 py-1 rounded-md text-[12px] font-semibold transition-all"
              style={on
                ? { background: col ? col.bg : 'rgba(249,115,22,0.15)', color: col ? col.text : '#F97316', border: `1px solid ${col ? col.text : '#F97316'}` }
                : { background: '#1F2937', color: '#9CA3AF', border: '1px solid #374151' }
              }
            >
              {v}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function FilterBar({ filters, onChange }: Props) {
  function toggleIn<T extends string>(arr: T[], v: T): T[] {
    return arr.includes(v) ? arr.filter(x => x !== v) : [...arr, v];
  }

  const hasFilters =
    filters.categories.length > 0 ||
    filters.types.length > 0 ||
    filters.scales.length > 0 ||
    filters.finishes.length > 0;

  return (
    <div className="sticky top-16 z-40 py-3 px-4 md:px-8" style={{ background: 'rgba(11,15,25,0.95)', borderBottom: '1px solid #1F2937', backdropFilter: 'blur(8px)' }}>
      <div className="max-w-[1440px] mx-auto flex flex-col gap-2.5">
        <Toggle
          label="Categoria"
          values={ALL_CATEGORIES}
          active={filters.categories}
          onToggle={v => onChange({ ...filters, categories: toggleIn(filters.categories, v) })}
        />
        <Toggle
          label="Tipo"
          values={ALL_TYPES}
          active={filters.types}
          onToggle={v => onChange({ ...filters, types: toggleIn(filters.types, v) })}
          colorMap={TYPE_COLORS as Record<PokemonType, { text: string; bg: string }>}
        />
        <div className="flex flex-wrap gap-4">
          <Toggle
            label="Escala"
            values={ALL_SCALES}
            active={filters.scales}
            onToggle={v => onChange({ ...filters, scales: toggleIn(filters.scales, v) })}
          />
          <Toggle
            label="Acabamento"
            values={ALL_FINISHES}
            active={filters.finishes}
            onToggle={v => onChange({ ...filters, finishes: toggleIn(filters.finishes, v) })}
          />
          {hasFilters && (
            <button
              onClick={() => onChange({ categories: [], types: [], scales: [], finishes: [] })}
              className="px-2.5 py-1 rounded-md text-[12px] font-semibold transition-all self-end"
              style={{ background: 'rgba(249,115,22,0.1)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}
            >
              ✕ Limpar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
