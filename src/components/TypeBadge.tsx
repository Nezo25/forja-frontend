import { type PokemonType, TYPE_COLORS } from '@/data/products';

const DEFAULT_TYPE_COLOR = {
  text: '#F97316',
  bg: 'rgba(249, 115, 22, 0.15)',
};

const EN_TYPES: Record<string, string> = {
  Normal: 'Normal', Fogo: 'Fire', Água: 'Water', Elétrico: 'Electric',
  Planta: 'Grass', Gelo: 'Ice', Lutador: 'Fighting', Veneno: 'Poison',
  Terra: 'Ground', Voador: 'Flying', Psíquico: 'Psychic', Inseto: 'Bug',
  Pedra: 'Rock', Fantasma: 'Ghost', Dragão: 'Dragon', Escuridão: 'Dark',
  Metálico: 'Steel', Fada: 'Fairy'
};

export function TypeBadge({ type }: { type: PokemonType | string }) {
  if (!type) return null;
  const c = TYPE_COLORS[type as PokemonType] || DEFAULT_TYPE_COLOR;
  const isEn = typeof window !== 'undefined' && localStorage.getItem('forja_lang') === 'en';
  const displayType = isEn ? (EN_TYPES[type] || type) : type;

  return (
    <span
      className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-semibold tracking-wide"
      style={{ color: c?.text || '#F97316', background: c?.bg || 'rgba(249, 115, 22, 0.15)', border: c?.border ? `1px solid ${c.border}` : '1px solid transparent' }}
    >
      {displayType}
    </span>
  );
}
