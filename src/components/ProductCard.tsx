import { useState } from 'react';
import type { Product } from '@/data/products';
import { TypeBadge } from './TypeBadge';

interface Props {
  product: Product;
  onConfigure: (p: Product) => void;
}

export function ProductCard({ product, onConfigure }: Props) {
  const [hovered, setHovered] = useState(false);

  const lowestPrice = product.basePrice + Math.min(...product.finishOptions.map(f => f.extra));

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
      <div className="relative overflow-hidden aspect-[4/5]" style={{ background: '#111827' }}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500"
          style={{ transform: hovered ? 'scale(1.07)' : 'scale(1)' }}
        />
        {/* Overlay gradient */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'linear-gradient(to top, rgba(11,15,25,0.7) 0%, transparent 50%)' }} />

        {/* Tags top-left */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap gap-1">
          {product.types.map(t => <TypeBadge key={t} type={t} />)}
        </div>

        {/* Material badges top-right */}
        <div className="absolute top-2.5 right-2.5 flex flex-col gap-1 items-end">
          {product.materials.map(m => (
            <span key={m} className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: 'rgba(17,24,39,0.85)', color: '#9CA3AF', border: '1px solid #374151' }}>
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
      <div className="flex flex-col gap-2 p-4 flex-1">
        <h3 className="font-bold text-[15px] leading-tight" style={{ color: '#F9FAFB' }}>{product.name}</h3>

        <div className="flex flex-wrap gap-1 mt-0.5">
          {product.scales.map(s => (
            <span key={s} className="px-1.5 py-0.5 rounded text-[10px] font-medium" style={{ background: '#111827', color: '#9CA3AF', border: '1px solid #374151' }}>
              {s}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-3 flex items-end justify-between">
          <div>
            <div className="text-[10px] uppercase tracking-wide font-medium" style={{ color: '#6B7280' }}>a partir de</div>
            <div className="text-[20px] font-extrabold" style={{ color: '#F97316' }}>
              R$ {lowestPrice.toFixed(2).replace('.', ',')}
            </div>
          </div>
          <button
            className="h-9 px-4 rounded-lg text-sm font-bold transition-all"
            style={{ background: '#F97316', color: '#fff' }}
            onClick={e => { e.stopPropagation(); onConfigure(product); }}
            onMouseEnter={e => (e.currentTarget.style.background = '#EA6A0A')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F97316')}
          >
            Configurar
          </button>
        </div>
      </div>
    </article>
  );
}
