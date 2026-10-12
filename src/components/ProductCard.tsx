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

  const basePrice = product.basePrice || 0;
  const extraMin = product.finishOptions && product.finishOptions.length > 0
    ? Math.min(...product.finishOptions.map(f => f.extra))
    : 0;
  const lowestPrice = basePrice + (isFinite(extraMin) ? extraMin : 0);
  const categoryLabel = (CATEGORY_LABELS as Record<string, string>)[product.category] || product.category;
  const itemNumber = (index).toString().padStart(2, '0');
  const stock = typeof product.stock === 'number' ? product.stock : ((product as any).stockQuantity ?? 1);

  // Badge label (unidades em estoque, escala ou expansão TCG)
  const badgeText = product.department === 'TCG' 
    ? (product.expansionName || 'PRONTA ENTREGA') 
    : (stock > 1 ? `${stock} UNIDADES` : (product.scales?.[0] || 'PADRÃO (10 CM)'));

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
      <div className="pt-3 pb-1 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2">
          <span className="text-[10px] font-bold tracking-[0.16em] text-[#737373] uppercase">
            {categoryLabel}
          </span>
          {product.types && product.types.length > 0 && (
            <span className="text-[10px] font-semibold text-[#8C8C8C] uppercase tracking-wider">
              {product.types.slice(0, 2).join(' • ')}
            </span>
          )}
        </div>

        <h3 className="font-display text-2xl md:text-3xl font-black text-[#171717] uppercase tracking-wide group-hover:text-[#EA580C] transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Grounded & Prominent Price Container */}
        <div className="mt-1 pt-2 border-t border-black/10 flex items-end justify-between">
          <div className="flex flex-col">
            <span className="text-[9px] font-bold tracking-[0.18em] text-[#8C8C8C] uppercase">
              A partir de
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-xs font-black text-[#EA580C]">R$</span>
              <span className="font-display text-2xl md:text-3xl font-black text-[#171717] tracking-tight leading-none">
                {lowestPrice.toLocaleString('pt-BR', { minimumFractionDigits: lowestPrice % 1 === 0 ? 0 : 2 })}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1 text-[11px] font-bold tracking-wider uppercase text-[#EA580C] group-hover:translate-x-1 transition-transform">
            <span>Personalizar</span>
            <span className="text-sm">→</span>
          </div>
        </div>
      </div>
    </article>
  );
}
