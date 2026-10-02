import { useState } from 'react';
import type { Product } from '@/data/products';
import { TYPE_COLORS } from '@/data/products';
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

  return (
    <article
      className="flex flex-col rounded-xl overflow-hidden cursor-pointer group transition-all duration-300"
      style={{
        background: hovered
          ? 'linear-gradient(145deg, #1F2937, #253042)'
          : '#1F2937',
        border: hovered ? '1px solid rgba(249,115,22,0.4)' : '1px solid #374151',
        boxShadow: hovered ? '0 8px 32px rgba(249,115,22,0.08)' : 'none',
        transform: hovered ? 'translateY(-2px)' : 'none',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={() => onConfigure(product)}
    >
      {/* Image */}
      <div className="relative overflow-hidden aspect-square" style={{ background: '#111827' }}>
        <img
          src={product.image || 'https://placehold.co/600x700/1F2937/F97316?text=Figure'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(11,15,25,0.7) 0%, transparent 50%)' }} />

        {/* Tags top-left */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
          {(product.types || []).map((t, idx) => <TypeBadge key={t + idx} type={t} />)}
        </div>

        {/* Material badges top-right */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
          {(product.materials || ['PLA']).map((m, idx) => (
            <span key={m + idx} className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: 'rgba(17,24,39,0.85)', color: '#9CA3AF', border: '1px solid #374151' }}>
              {m}
            </span>
          ))}
        </div>

        {/* Category bottom */}
        <div className="absolute bottom-2.5 left-2.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wide" style={{ background: 'rgba(249,115,22,0.2)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}>
            {product.category}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-col gap-2 p-3 md:p-4 flex-1">
        <h3 className="font-bold text-[14px] md:text-[15px] leading-tight line-clamp-2" style={{ color: '#F9FAFB' }}>{product.name}</h3>

        <div className="flex flex-wrap gap-1 mt-0.5">
          {(product.scales || ['1:10']).map((s, idx) => (
            <span key={s + idx} className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#111827', color: '#9CA3AF', border: '1px solid #374151' }}>
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-3 flex flex-col gap-2">
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[9px] md:text-[10px] uppercase tracking-wide font-medium" style={{ color: '#6B7280' }}>a partir de</div>
              <div className="text-[18px] font-extrabold" style={{ color: '#F97316' }}>
                R$ {lowestPrice.toFixed(2).replace('.', ',')}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-1">
            <button
              className="h-9 rounded-lg text-xs md:text-sm font-bold transition-all border border-slate-700 hover:border-slate-600 hover:bg-slate-800"
              style={{ color: '#F9FAFB' }}
              onClick={e => { e.stopPropagation(); onConfigure(product); }}
            >
              Personalizar
            </button>
            <button
              className="h-9 rounded-lg text-xs md:text-sm font-bold transition-all bg-orange-500 hover:bg-orange-600 text-white"
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
