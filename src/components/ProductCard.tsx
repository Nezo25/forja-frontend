import { useState } from 'react';
import type { Product, PokemonType } from '@/data/products';
import { CATEGORY_LABELS } from '@/data/products';

interface Props {
  product: Product;
  index?: number;
  onConfigure: (p: Product) => void;
  onBuyNow: (p: Product) => void;
}

export function ProductCard({ product, index = 1, onConfigure, onBuyNow }: Props) {
  const [hovered, setHovered] = useState(false);

  const extraMin = product.finishOptions && product.finishOptions.length > 0
    ? Math.min(...product.finishOptions.map(f => f.extra))
    : 0;
  const lowestPrice = (product.basePrice || 0) + (isFinite(extraMin) ? extraMin : 0);
  const categoryLabel = (CATEGORY_LABELS as Record<string, string>)[product.category] || product.category;
  const itemNumber = (index).toString().padStart(2, '0');

  // Badge label (finish or scale or type)
  const badgeText = product.department === 'TCG' 
    ? (product.expansionName || 'PRONTA ENTREGA') 
    : (product.scales?.[0] || 'ESCALA 1:10');

  return (
    <article
      className="flex flex-col cursor-pointer group select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onConfigure(product)}
    >
      {/* Dark Image Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#1E1E1E] border border-black/10 shadow-sm">
        <img
          src={product.image || 'https://placehold.co/600x700/1F2937/F97316?text=Figure'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between text-[10px] font-bold tracking-widest text-[#A3A3A3] uppercase pointer-events-none z-10">
          <span className="opacity-70 font-mono">{itemNumber}</span>
          <span className="px-2 py-0.5 rounded bg-black/60 backdrop-blur-md text-[#E5E5E5] border border-white/10">
            {badgeText}
          </span>
        </div>

        {/* Floating Round Cart/Buy Button (bottom right) */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onBuyNow(product);
          }}
          className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-white text-black hover:bg-[#EA580C] hover:text-white flex items-center justify-center shadow-lg transition-transform active:scale-90 z-20"
          title="Adicionar ao carrinho"
        >
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
        </button>
      </div>

      {/* Info Below Image */}
      <div className="pt-3 pb-1 flex flex-col gap-0.5">
        <span className="text-[10px] font-bold tracking-[0.15em] text-[#737373] uppercase">
          {categoryLabel}
        </span>
        <div className="flex items-baseline justify-between gap-2">
          <h3 className="font-display text-2xl md:text-3xl font-black text-[#171717] uppercase tracking-wide group-hover:text-[#EA580C] transition-colors line-clamp-1">
            {product.name}
          </h3>
          <span className="font-display text-lg md:text-xl font-bold text-[#171717] shrink-0">
            R$ {lowestPrice.toFixed(0)}
          </span>
        </div>
      </div>
    </article>
  );
}
