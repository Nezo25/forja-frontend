import { useState, useEffect } from 'react';
import type { CartItem, Finish, Material, Product, Scale } from '@/data/products';
import { TypeBadge } from './TypeBadge';

interface Props {
  product: Product | null;
  onClose: () => void;
  onAdd: (item: CartItem) => void;
}

export function ConfigModal({ product, onClose, onAdd }: Props) {
  const [scale, setScale] = useState<Scale | null>(null);
  const [finish, setFinish] = useState<Finish>('Peça Crua');
  const [material, setMaterial] = useState<Material>('PLA');
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product != null) {
      setScale(product.scales[0]);
      setFinish('Peça Crua');
      setMaterial(product.materials[0]);
      setQty(1);
      setAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const finishExtra = product.finishOptions.find(f => f.label === finish)?.extra ?? 0;
  const unitPrice = product.basePrice + finishExtra;
  const total = unitPrice * qty;

  function handleAdd() {
    if (!scale) return;
    onAdd({ product: product!, scale, finish, material, qty, unitPrice });
    setAdded(true);
    setTimeout(onClose, 800);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      {/* Backdrop */}
      <div className="absolute inset-0" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }} />

      <div
        className="relative w-full md:max-w-xl max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl flex flex-col"
        style={{ background: '#111827', border: '1px solid #374151' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Image header */}
        <div className="relative h-48 shrink-0 overflow-hidden rounded-t-2xl md:rounded-t-2xl" style={{ background: '#0B0F19' }}>
          <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-70" />
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #111827 0%, transparent 60%)' }} />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-all" style={{ background: 'rgba(0,0,0,0.5)', color: '#9CA3AF' }}>
            ✕
          </button>
          <div className="absolute bottom-3 left-4">
            <div className="flex gap-1 mb-1">{product.types.map(t => <TypeBadge key={t} type={t} />)}</div>
            <h2 className="text-xl font-extrabold" style={{ color: '#F9FAFB' }}>{product.name}</h2>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Scale */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>Escala</label>
            <div className="flex flex-wrap gap-2">
              {product.scales.map(s => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={scale === s
                    ? { background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid #F97316' }
                    : { background: '#1F2937', color: '#9CA3AF', border: '1px solid #374151' }
                  }
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Material */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>Material</label>
            <div className="flex flex-wrap gap-2">
              {product.materials.map(m => (
                <button
                  key={m}
                  onClick={() => setMaterial(m)}
                  className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
                  style={material === m
                    ? { background: 'rgba(249,115,22,0.15)', color: '#F97316', border: '1px solid #F97316' }
                    : { background: '#1F2937', color: '#9CA3AF', border: '1px solid #374151' }
                  }
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Finish */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>Acabamento</label>
            <div className="flex flex-col gap-2">
              {product.finishOptions.map(f => (
                <button
                  key={f.label}
                  onClick={() => setFinish(f.label)}
                  className="flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all text-left"
                  style={finish === f.label
                    ? { background: 'rgba(249,115,22,0.12)', color: '#F97316', border: '1px solid #F97316' }
                    : { background: '#1F2937', color: '#9CA3AF', border: '1px solid #374151' }
                  }
                >
                  <span>{f.label}</span>
                  <span className="font-bold">{f.extra === 0 ? 'Incluído' : `+ R$ ${f.extra.toFixed(2).replace('.', ',')}`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Qty */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: '#6B7280' }}>Quantidade</label>
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-lg font-bold text-lg transition-all" style={{ background: '#1F2937', border: '1px solid #374151', color: '#9CA3AF' }}>−</button>
              <span className="text-lg font-bold w-8 text-center" style={{ color: '#F9FAFB' }}>{qty}</span>
              <button onClick={() => setQty(q => q + 1)} className="w-9 h-9 rounded-lg font-bold text-lg transition-all" style={{ background: '#1F2937', border: '1px solid #374151', color: '#9CA3AF' }}>+</button>
            </div>
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-2" style={{ borderTop: '1px solid #374151' }}>
            <div>
              <div className="text-[11px] uppercase tracking-wide" style={{ color: '#6B7280' }}>Total estimado</div>
              <div className="text-2xl font-extrabold" style={{ color: '#F97316' }}>
                R$ {total.toFixed(2).replace('.', ',')}
              </div>
            </div>
            <button
              onClick={handleAdd}
              disabled={!scale || added}
              className="h-11 px-6 rounded-xl font-bold text-sm transition-all"
              style={{ background: added ? '#22C55E' : '#F97316', color: '#fff', opacity: !scale ? 0.5 : 1 }}
            >
              {added ? '✓ Adicionado!' : '🛒 Adicionar ao Carrinho'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
