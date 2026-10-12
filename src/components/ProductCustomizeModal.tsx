import { useState, useEffect } from 'react';
import type { CartItem, Finish, Material, Product, Scale } from '@/data/products';
import { CATEGORY_LABELS } from '@/data/products';
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
      setScale(product.scales && product.scales.length > 0 ? product.scales[0] : ('Padrão' as any));
      setFinish('Peça Crua');
      setMaterial(product.materials && product.materials.length > 0 ? product.materials[0] : 'PLA');
      setQty(1);
      setObservations('');
      setAdded(false);
    }
  }, [product]);

  if (!product) return null;

  const isTcg = product.department === 'TCG' || product.category === 'TCG';
  const finishOptions = product.finishOptions && product.finishOptions.length > 0
    ? product.finishOptions
    : [{ label: 'Peça Crua' as Finish, extra: 0 }];

  const isHeroPromo = Boolean(
    (product as any)?.origin === 'HERO_SHOWCASE' ||
    (product as any)?.isHeroPromo ||
    (typeof product.promoPrice === 'number' && product.promoPrice > 0 && product.promoPrice < product.basePrice)
  );
  const effectiveBasePrice = isHeroPromo && product.promoPrice ? product.promoPrice : (product.basePrice || 0);
  const finishExtra = finishOptions.find(f => f.label === finish)?.extra ?? 0;
  const unitPrice = effectiveBasePrice + finishExtra;
  const total = unitPrice * qty;
  const categoryLabel = (CATEGORY_LABELS as Record<string, string>)[product.category] || product.category;

  function handleAdd() {
    if (!scale && !isTcg) return;
    onAdd({ 
      product: product!, 
      scale: scale || 'Padrão', 
      finish, 
      material, 
      qty, 
      unitPrice,
      observations: observations.trim() || undefined,
      customized: !isTcg,
      origin: isHeroPromo ? 'HERO_SHOWCASE' : ((product as any).origin || 'CATALOG'),
      promoPrice: isHeroPromo ? product.promoPrice : undefined,
      promoBadge: isHeroPromo ? '[Oferta do Destaque Aplicada]' : (product as any).promoBadge,
      allowCouponStacking: (product as any).allowCouponStacking
    });
    setAdded(true);
    setTimeout(onClose, 750);
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onClose}>
      {/* Dark overlay backdrop */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity" />

      {/* Main Modal Dialog */}
      <div
        className="relative w-full sm:max-w-xl max-h-[92vh] overflow-y-auto rounded-t-2xl sm:rounded-2xl flex flex-col bg-[#161616] border border-[#2E2E2E] shadow-2xl shadow-black/80 text-white animate-in slide-in-from-bottom-6 sm:zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Image Showcase Banner */}
        <div className="relative h-64 sm:h-72 shrink-0 overflow-hidden bg-[#1E1E1E] border-b border-[#262626]">
          <img 
            src={product.image || 'https://placehold.co/600x700/1F2937/F97316?text=Figure'} 
            alt={product.name} 
            className="w-full h-full object-contain p-4" 
          />
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#161616] via-transparent to-black/40 pointer-events-none" />

          {/* Close button */}
          <button 
            type="button"
            onClick={onClose} 
            className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center bg-black/60 hover:bg-[#EA580C] text-[#A3A3A3] hover:text-white transition-all border border-white/10 z-20 cursor-pointer"
            aria-label="Fechar"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>

          {/* Product Header Information inside Banner */}
          <div className="absolute bottom-4 left-5 right-5 z-10">
            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#EA580C] uppercase">
                {categoryLabel}
              </span>
              {isHeroPromo && (
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-orange-500 text-white border border-orange-400 shadow-md flex items-center gap-1">
                  <span>🔥 [Oferta do Destaque Aplicada]</span>
                </span>
              )}
              {product.types && product.types.length > 0 && (
                <div className="flex gap-1">
                  {product.types.map(t => <TypeBadge key={t} type={t} />)}
                </div>
              )}
            </div>
            <h2 className="font-display text-2xl sm:text-3xl md:text-4xl text-white uppercase tracking-wide leading-none">
              {product.name}
            </h2>
          </div>
        </div>

        {/* Modal Configuration Body */}
        <div className="p-5 sm:p-6 flex flex-col gap-6">
          
          {/* Oferta do Destaque Contextual Banner */}
          {isHeroPromo && (
            <div className="flex gap-3 bg-gradient-to-r from-orange-950/80 to-[#1C1613] border-2 border-orange-500/50 rounded-xl p-3.5 text-xs text-orange-100 leading-relaxed shadow-lg">
              <span className="text-xl leading-none text-orange-400 shrink-0 mt-0.5">🏷️</span>
              <div>
                <span className="font-extrabold text-white block mb-0.5 uppercase tracking-wide text-xs">
                  [Oferta do Destaque Aplicada]
                </span>
                Esta peça foi selecionada da vitrine principal da oficina. O valor promocional de{' '}
                <span className="text-orange-400 font-extrabold">R$ {product.promoPrice?.toFixed(2).replace('.', ',')}</span>{' '}
                (de <span className="line-through text-slate-400 font-semibold">R$ {product.basePrice.toFixed(2).replace('.', ',')}</span>) está ativo como base desta personalização!
              </div>
            </div>
          )}

          {/* Forge Notice Banner */}
          <div className="flex gap-3 bg-[#1C1613] border border-[#EA580C]/25 rounded-xl p-3.5 text-xs text-[#D4D4D4] leading-relaxed">
            <span className="text-base leading-none text-[#EA580C] shrink-0 mt-0.5">🔥</span>
            <div>
              <span className="font-bold text-white block mb-0.5">Produção sob encomenda e acabamento manual</span>
              Os valores são estimativas base. O valor final e prazo exato podem ser refinados no WhatsApp de acordo com suas preferências.
            </div>
          </div>

          {/* Scales Selector (only if not strictly TCG) */}
          {!isTcg && product.scales && product.scales.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-[11px] font-bold tracking-[0.18em] text-[#A3A3A3] uppercase">
                  Escala & Dimensões
                </label>
                <span className="text-[11px] text-[#737373]">Selecione o tamanho</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.scales.map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setScale(s)}
                    className={`px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                      scale === s 
                        ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-md shadow-orange-950/40' 
                        : 'bg-[#1E1E1E] text-[#D4D4D4] border-[#2E2E2E] hover:border-[#404040] hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setScale('Personalizada')}
                  className={`px-3.5 py-2.5 rounded-lg text-xs font-bold transition-all border cursor-pointer ${
                    scale === 'Personalizada' 
                      ? 'bg-[#EA580C] text-white border-[#EA580C] shadow-md shadow-orange-950/40' 
                      : 'bg-[#1E1E1E] text-[#D4D4D4] border-[#2E2E2E] hover:border-[#404040] hover:text-white'
                  }`}
                >
                  📐 Medida Personalizada
                </button>
              </div>
            </div>
          )}

          {/* Finish Options (only if not TCG) */}
          {!isTcg && product.finishOptions && product.finishOptions.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-2.5">
                <label className="text-[11px] font-bold tracking-[0.18em] text-[#A3A3A3] uppercase">
                  Grau de Acabamento
                </label>
                <span className="text-[11px] text-[#737373]">Oficina Forja do Chico</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                {finishOptions.map(f => {
                  const isSelected = finish === f.label;
                  return (
                    <button
                      key={f.label}
                      type="button"
                      onClick={() => setFinish(f.label)}
                      className={`flex flex-col justify-between p-3.5 rounded-xl text-left transition-all border cursor-pointer ${
                        isSelected 
                          ? 'bg-[#EA580C]/15 border-[#EA580C] shadow-md shadow-orange-950/30 ring-1 ring-[#EA580C]' 
                          : 'bg-[#1E1E1E] border-[#2A2A2A] hover:border-[#383838]'
                      }`}
                    >
                      <span className={`text-xs font-bold block mb-1 ${isSelected ? 'text-white' : 'text-[#D4D4D4]'}`}>
                        {f.label}
                      </span>
                      <span className="text-xs font-mono font-semibold text-[#EA580C]">
                        {f.extra === 0 ? 'Sem custo extra' : `+ R$ ${f.extra.toFixed(2).replace('.', ',')}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-[#1E1E1E] border border-[#2A2A2A]">
            <span className="text-xs font-bold text-[#D4D4D4] uppercase tracking-wider">
              Quantidade de Peças
            </span>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setQty(q => Math.max(1, q - 1))}
                className="w-8 h-8 rounded-lg bg-[#262626] hover:bg-[#333333] text-white flex items-center justify-center font-bold text-sm border border-[#3A3A3A] transition-colors cursor-pointer"
              >
                −
              </button>
              <span className="font-display text-xl text-white min-w-[24px] text-center">
                {qty}
              </span>
              <button
                type="button"
                onClick={() => setQty(q => q + 1)}
                className="w-8 h-8 rounded-lg bg-[#262626] hover:bg-[#333333] text-white flex items-center justify-center font-bold text-sm border border-[#3A3A3A] transition-colors cursor-pointer"
              >
                +
              </button>
            </div>
          </div>

          {/* Observations */}
          <div>
            <label className="block text-[11px] font-bold tracking-[0.18em] text-[#A3A3A3] uppercase mb-2">
              Observações ou Detalhes Especiais (Opcional)
            </label>
            <textarea 
              value={observations}
              onChange={e => setObservations(e.target.value)}
              placeholder="Ex: pose específica, efeito brilhante/shiny, adaptação para LED..."
              className="w-full bg-[#1E1E1E] border border-[#2E2E2E] focus:border-[#EA580C] rounded-xl p-3 text-xs text-white placeholder-[#666] outline-none transition-colors"
              rows={2}
            />
          </div>

          {/* Bottom Bar: Total & High-Impact CTA */}
          <div className="pt-4 border-t border-[#262626] flex items-center justify-between gap-4">
            <div>
              <span className="text-[10px] uppercase tracking-[0.2em] text-[#A3A3A3] font-bold block mb-0.5 flex items-center gap-1.5 flex-wrap">
                <span>Estimativa Total</span>
                {isHeroPromo && (
                  <span className="text-orange-400 font-extrabold text-[9px] bg-orange-500/20 px-1.5 py-0.5 rounded border border-orange-500/40">
                    🏷️ [Oferta do Destaque Aplicada]
                  </span>
                )}
              </span>
              <div className="flex items-baseline gap-1">
                <span className="text-xs font-black text-[#EA580C]">R$</span>
                <span className="font-display text-3xl sm:text-4xl font-black text-white tracking-tight leading-none">
                  {total.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                {isHeroPromo && (
                  <span className="ml-2 text-xs line-through text-slate-500 font-semibold">
                    R$ {((product.basePrice + finishExtra) * qty).toFixed(2).replace('.', ',')}
                  </span>
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={(!scale && !isTcg) || added}
              className={`h-12 px-6 sm:px-8 rounded-lg font-bold text-xs sm:text-sm tracking-wider uppercase transition-all flex items-center gap-2 cursor-pointer shadow-lg active:scale-95 ${
                added 
                  ? 'bg-emerald-600 text-white shadow-emerald-950/40' 
                  : 'bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-orange-950/50 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              {added ? (
                <>
                  <span>✓</span> Adicionado ao Carrinho!
                </>
              ) : (
                <>
                  <span>Adicionar ao Carrinho</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}
