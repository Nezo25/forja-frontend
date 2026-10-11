import { useState } from 'react';
import type { Product, PokemonType, ProductCategory } from '@/data/products';
import { TYPE_COLORS, CATEGORY_LABELS } from '@/data/products';
import { TypeBadge } from './TypeBadge';

interface Props {
  product: Product;
  onConfigure: (p: Product) => void;
  onBuyNow: (p: Product) => void;
}

export function ProductCard({ product, onConfigure, onBuyNow }: Props) {
  const [hovered, setHovered] = useState(false);

  const extraMin = product.finishOptions && product.finishOptions.length > 0
    ? Math.min(...product.finishOptions.map(f => f.extra))
    : 0;
  const lowestPrice = (product.basePrice || 0) + (isFinite(extraMin) ? extraMin : 0);

  const primaryType = (product.types && product.types.length > 0) ? (product.types[0] as PokemonType) : undefined;
  const elementalColor = primaryType && TYPE_COLORS[primaryType] ? TYPE_COLORS[primaryType].text : '#F97316';
  const categoryLabel = (CATEGORY_LABELS as Record<string, string>)[product.category] || product.category;

  return (
    <article
      className="flex flex-col rounded-xl overflow-hidden cursor-pointer group transition-all duration-300 bg-[#0F172A] border border-slate-800/80 shadow-xl shadow-black/40 hover:-translate-y-1"
      style={{
        boxShadow: hovered 
          ? `0 12px 30px -4px rgba(0,0,0,0.6), 0 0 20px -3px ${elementalColor}25`
          : '0 10px 25px -5px rgba(0,0,0,0.4)',
        borderColor: hovered ? `${elementalColor}50` : 'rgba(30, 41, 59, 0.8)',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onConfigure(product)}
    >
      {/* Image Container */}
      <div className="relative overflow-hidden aspect-square rounded-t-xl bg-[#0B0F19]">
        <img
          src={product.image || 'https://placehold.co/600x700/1F2937/F97316?text=Figure'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 ease-out"
          style={{ transform: hovered ? 'scale(1.06)' : 'scale(1)' }}
          loading="lazy"
        />
        {/* Subtle dark gradient overlay */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#0F172A] via-transparent to-black/20" />

        {/* Top-left Badges (Types or TCG) */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1.5 z-10">
          {product.department === 'TCG' ? (
            <>
              {product.expansionName && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-purple-900/90 text-purple-200 border border-purple-700/60 backdrop-blur-sm shadow-sm">
                  {product.expansionName}
                </span>
              )}
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-950/90 text-emerald-400 border border-emerald-700/60 backdrop-blur-sm shadow-sm">
                Pronta Entrega
              </span>
            </>
          ) : (
            (product.types || []).map((t, idx) => <TypeBadge key={t + idx} type={t} />)
          )}
        </div>

        {/* Top-right Material Badges */}
        {product.department !== 'TCG' && (
          <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end z-10">
            {(product.materials || ['PLA']).map((m, idx) => (
              <span key={m + idx} className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-900/90 text-slate-300 border border-slate-700/70 backdrop-blur-sm">
                {m}
              </span>
            ))}
          </div>
        )}

        {/* Bottom Category Tag */}
        <div className="absolute bottom-2.5 left-2.5 z-10">
          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-orange-500/15 text-[#F97316] border border-orange-500/30 backdrop-blur-md">
            {categoryLabel}
          </span>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-col gap-2 p-3.5 md:p-4 flex-1">
        <h3 className="font-bold text-sm md:text-[15px] text-slate-100 leading-snug line-clamp-2 group-hover:text-orange-400 transition-colors">
          {product.name}
        </h3>

        <div className="flex flex-wrap gap-1 mt-0.5">
          {(product.scales || ['1:10']).map((s, idx) => (
            <span key={s + idx} className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-slate-900/80 text-slate-400 border border-slate-800">
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-3 flex flex-col gap-2.5">
          <div className="flex items-baseline justify-between">
            <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-500">
              A partir de
            </span>
            <div className="text-[17px] md:text-lg font-black text-[#F97316]">
              R$ {lowestPrice.toFixed(2).replace('.', ',')}
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className={product.department === 'TCG' ? "grid grid-cols-1 gap-2 mt-1" : "grid grid-cols-2 gap-2 mt-1"}>
            {product.department !== 'TCG' && (
              <button
                type="button"
                className="h-9 px-3 rounded-lg text-xs md:text-sm font-bold transition-all bg-slate-800/80 hover:bg-slate-700 text-slate-200 border border-slate-700/80 active:scale-[0.98] flex items-center justify-center"
                onClick={e => { e.stopPropagation(); onConfigure(product); }}
              >
                Personalizar
              </button>
            )}
            <button
              type="button"
              className="h-9 px-3 rounded-lg text-xs md:text-sm font-extrabold transition-all bg-[#F97316] hover:bg-[#EA580C] text-white shadow-md shadow-orange-500/20 active:scale-[0.98] flex items-center justify-center gap-1.5"
              onClick={e => { e.stopPropagation(); onBuyNow(product); }}
            >
              Comprar
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}
