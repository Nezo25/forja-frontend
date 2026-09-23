import { type PokemonType, TYPE_COLORS } from '@/data/products';

export function TypeBadge({ type }: { type: PokemonType }) {
  const c = TYPE_COLORS[type];
  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide"
      style={{ color: c.text, background: c.bg }}
    >
      {type}
    </span>
  );
}
