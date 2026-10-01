import { useState, useEffect } from 'react';
import type { CartItem, Finish, Material, Product, Scale } from '@/data/products';
import { TypeBadge } from './TypeBadge';

interface Props {
  product: Product | null;
  onClose: () => void;
  onAdd: (item: CartItem) => void;
}

export function ProductCustomizeModal({ product, onClose, onAdd }: Props) {
  const [scale, setScale] = useState<Scale | 'Personalizada' | null>(null);
  const [finish, setFinish] = useState<Finish>('Peça Crua');
  const [material, setMaterial] = useState<Material>('PLA');
  const [qty, setQty] = useState(1);
  const [observations, setObservations] = useState('');
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product != null) {
      setScale(product.scales[0]);
      setFinish('Peça Crua');
      setMaterial(product.materials[0]);
      setQty(1);
      setObservations('');
      setAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const finishExtra = product.finishOptions.find(f => f.label === finish)?.extra ?? 0;
  const unitPrice = product.basePrice + finishExtra;
  const total = unitPrice * qty;

  function handleAdd() {
    if (!scale) return;
    onAdd({ 
      product: product!, 
      scale, 
      finish, 
      material, 
      qty, 
      unitPrice,
      observations: observations.trim() || undefined,
      customized: true
    });
    setAdded(true);
    setTimeout(onClose, 800);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-0 md:p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      <div
        className="relative w-full md:max-w-xl max-h-[90vh] overflow-y-auto rounded-t-2xl md:rounded-2xl flex flex-col bg-[#111827] border border-gray-700 shadow-2xl animate-in slide-in-from-bottom-4 md:slide-in-from-bottom-0"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="relative h-40 shrink-0 overflow-hidden rounded-t-2xl bg-[#0B0F19]">
          <img src={product.image} alt={product.name} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent" />
          <button onClick={onClose} className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center bg-black/50 text-gray-400 hover:text-white transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
          <div className="absolute bottom-3 left-4">
            <div className="flex gap-1 mb-1">{product.types.map(t => <TypeBadge key={t} type={t} />)}</div>
            <h2 className="text-xl font-extrabold text-white">{product.name}</h2>
          </div>
        </div>

        <div className="p-5 flex flex-col gap-5">
          {/* Alerta */}
          <div className="flex gap-3 bg-blue-900/20 border border-blue-800 rounded-lg p-3">
            <svg className="shrink-0 text-blue-400 mt-0.5" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4M12 8h.01"/></svg>
            <p className="text-xs text-blue-200 leading-relaxed">
              <strong>Atenção:</strong> Os valores exibidos são estimativas base. O valor final e prazo exato podem variar conforme ajustes de escala, nível de detalhamento e acabamento acordados durante o atendimento via WhatsApp.
            </p>
          </div>

          {/* Scale */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-gray-400">Escala / Tamanho</label>
            <div className="flex flex-wrap gap-2">
              {product.scales.map(s => (
                <button
                  key={s}
                  onClick={() => setScale(s)}
                  className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${scale === s ? 'bg-orange-500/20 text-orange-500 border-orange-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'}`}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => setScale('Personalizada')}
                className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all border ${scale === 'Personalizada' ? 'bg-orange-500/20 text-orange-500 border-orange-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'}`}
              >
                Medida Personalizada
              </button>
            </div>
          </div>

          {/* Finish */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-gray-400">Tipo de Acabamento</label>
            <div className="flex flex-col gap-2">
              {product.finishOptions.map(f => (
                <button
                  key={f.label}
                  onClick={() => setFinish(f.label)}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg text-sm font-semibold transition-all border text-left ${finish === f.label ? 'bg-orange-500/10 text-orange-500 border-orange-500' : 'bg-gray-800 text-gray-400 border-gray-700 hover:bg-gray-700'}`}
                >
                  <span>{f.label}</span>
                  <span className="font-bold">{f.extra === 0 ? 'Incluído' : `+ R$ ${f.extra.toFixed(2).replace('.', ',')}`}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-widest mb-2 text-gray-400">Observações especiais</label>
            <textarea 
              value={observations}
              onChange={e => setObservations(e.target.value)}
              placeholder="Ex: base translúcida, efeito de ataque, suporte específico..."
              className="w-full bg-gray-800 border border-gray-700 rounded-lg p-3 text-sm text-gray-200 placeholder-gray-500 focus:outline-none focus:border-orange-500"
              rows={3}
            />
          </div>

          {/* Price + CTA */}
          <div className="flex items-center justify-between pt-4 mt-2 border-t border-gray-800">
            <div>
              <div className="text-xs uppercase tracking-wide text-gray-400 font-medium">Estimativa</div>
              <div className="text-2xl font-extrabold text-orange-500">
                R$ {total.toFixed(2).replace('.', ',')}*
              </div>
            </div>
            <button
              onClick={handleAdd}
              disabled={!scale || added}
              className={`h-11 px-6 rounded-xl font-bold text-sm transition-all text-white flex items-center gap-2 ${added ? 'bg-green-500 hover:bg-green-600' : 'bg-orange-500 hover:bg-orange-600 disabled:opacity-50'}`}
            >
              {added ? 'Adicionado!' : 'Adicionar Personalizado'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
