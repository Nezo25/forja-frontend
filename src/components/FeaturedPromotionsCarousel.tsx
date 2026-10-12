import React, { useRef, useState, useEffect } from 'react';
import type { Product } from '@/data/products';
import { TypeBadge } from './TypeBadge';
import { MysteryDropCard } from './MysteryDropCard';

interface FeaturedPromotionsCarouselProps {
  products: Product[];
  onConfigure: (p: Product) => void;
  onBuyPromo?: (p: Product) => void;
}

export function FeaturedPromotionsCarousel({
  products,
  onConfigure,
  onBuyPromo
}: FeaturedPromotionsCarouselProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  // Regra A: Seleção de Produtos em Destaque com Fallback de Segurança para 3 itens
  const promoProducts = React.useMemo(() => {
    const featuredItems = products.filter(p => p.featured && p.active);
    if (featuredItems.length >= 3) {
      return featuredItems.slice(0, 3);
    }
    // Fallback: Completa com os primeiros produtos ativos do catálogo
    const activeItems = products.filter(p => p.active);
    const combined = [...featuredItems];
    for (const item of activeItems) {
      if (combined.length >= 3) break;
      if (!combined.some(p => p.id === item.id)) {
        combined.push(item);
      }
    }
    return combined.slice(0, 3);
  }, [products]);

  // Total de slides: 3 produtos promocionais + 1 Card Misterioso (Total = 4)
  const totalSlides = promoProducts.length + 1;

  // Atualiza o dot ativo durante o scroll manual (touch/swipe no mobile)
  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth } = scrollRef.current;
    if (clientWidth > 0) {
      const index = Math.round(scrollLeft / clientWidth);
      setActiveSlide(Math.min(Math.max(0, index), totalSlides - 1));
    }
  };

  const scrollToSlide = (index: number) => {
    if (!scrollRef.current) return;
    const { clientWidth } = scrollRef.current;
    scrollRef.current.scrollTo({
      left: index * (clientWidth * 0.85),
      behavior: 'smooth'
    });
    setActiveSlide(index);
  };

  const handlePrev = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: -340, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: 340, behavior: 'smooth' });
  };

  return (
    <section className="relative w-full bg-[#111622] text-white py-12 md:py-16 border-y border-slate-800/80 overflow-hidden">
      
      {/* Background glow sutil */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-[1440px] mx-auto px-4 md:px-8">
        
        {/* Cabeçalho da Seção */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#EA580C] animate-pulse" />
              <span className="text-[11px] font-bold tracking-[0.25em] text-[#EA580C] uppercase">
                Oportunidades Especiais da Oficina
              </span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl text-white uppercase tracking-wide leading-none">
              Destaques da Forja & Drop Secreto
            </h2>
          </div>

          {/* Setas de Navegação (Desktop) */}
          <div className="hidden sm:flex items-center gap-2">
            <button
              type="button"
              onClick={handlePrev}
              className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-[#EA580C] text-slate-300 hover:text-white border border-slate-700/60 transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95"
              aria-label="Slide anterior"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
            </button>
            <button
              type="button"
              onClick={handleNext}
              className="w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-[#EA580C] text-slate-300 hover:text-white border border-slate-700/60 transition-all flex items-center justify-center cursor-pointer shadow-md active:scale-95"
              aria-label="Próximo slide"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
            </button>
          </div>
        </div>

        {/* Carrossel Scroll-Snap de Alta Performance (Compatível com WebKit / iOS Safari) */}
        <div
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-5 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-4 pt-1 no-scrollbar -mx-4 px-4 md:mx-0 md:px-0"
          style={{ WebkitOverflowScrolling: 'touch' }}
        >
          {/* Os 3 Cards de Produtos em Promoção */}
          {promoProducts.map((p, index) => {
            const discount = 10;
            const originalPrice = (p.basePrice || 60) + discount;
            const promoPrice = p.basePrice || 60;
            const scaleText = p.scales?.[0] || 'Escala 1:10';

            return (
              <div
                key={p.id}
                className="snap-start shrink-0 w-[290px] sm:w-[320px] rounded-2xl bg-[#0F172A] border border-slate-800 hover:border-slate-700 p-5 flex flex-col justify-between shadow-xl shadow-black/40 transition-all duration-300 hover:-translate-y-1 group"
              >
                {/* Top Badges */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-[#EA580C] border border-orange-500/30 flex items-center gap-1 shadow-sm">
                    <span>🔥 Oferta da Forja</span>
                    <span className="font-extrabold">(-R$ 10,00)</span>
                  </span>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {(index + 1).toString().padStart(2, '0')} / 04
                  </span>
                </div>

                {/* Imagem do Produto em Alta Resolução */}
                <div 
                  onClick={() => onConfigure(p)}
                  className="relative aspect-square w-full rounded-xl overflow-hidden bg-[#1E293B]/60 border border-slate-800/80 mb-4 cursor-pointer group-hover:border-[#EA580C]/40 transition-colors"
                >
                  <img
                    src={p.image || 'https://placehold.co/600x700/1F2937/F97316?text=Figure'}
                    alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Tag da Escala */}
                  <div className="absolute bottom-2.5 left-2.5 z-10">
                    <span className="px-2 py-0.5 rounded bg-black/70 backdrop-blur-md text-[10px] font-bold uppercase tracking-wider text-slate-200 border border-white/10">
                      {scaleText}
                    </span>
                  </div>
                </div>

                {/* Informações da Peça */}
                <div className="flex flex-col gap-1.5 mb-4">
                  {/* Badges de Tipo Pokémon */}
                  {p.types && p.types.length > 0 && (
                    <div className="flex gap-1">
                      {p.types.map(t => <TypeBadge key={t} type={t} />)}
                    </div>
                  )}

                  <h3 
                    onClick={() => onConfigure(p)}
                    className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wide leading-none group-hover:text-[#EA580C] transition-colors line-clamp-1 cursor-pointer"
                  >
                    {p.name}
                  </h3>

                  {/* Preço Visual: De R$ XX por R$ YY */}
                  <div className="flex items-baseline gap-2 pt-1">
                    <span className="line-through text-slate-500 text-xs sm:text-sm font-semibold font-mono">
                      R$ {originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[#EA580C] font-display text-2xl sm:text-3xl font-black leading-none">
                      R$ {promoPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                </div>

                {/* Botão de Ação: Garantir Promoção */}
                <button
                  type="button"
                  onClick={() => {
                    if (onBuyPromo) onBuyPromo(p);
                    else onConfigure(p);
                  }}
                  className="w-full h-11 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#EA580C] hover:bg-[#C2410C] text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 active:scale-[0.98] transition-all cursor-pointer"
                >
                  <span>Garantir Promoção</span>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </button>
              </div>
            );
          })}

          {/* O 4º Card Especial: Drop Misterioso Universal */}
          <div className="snap-start shrink-0">
            <MysteryDropCard 
              category={promoProducts[0]?.category || 'FIGURE_POKEMON'} 
              product={promoProducts[0] || null}
            />
          </div>
        </div>

        {/* Indicadores de Paginação por Dots (Mobile & Tablet) */}
        <div className="flex items-center justify-center gap-2 mt-6">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => scrollToSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                activeSlide === idx 
                  ? 'w-6 bg-[#EA580C]' 
                  : 'w-2 bg-slate-700 hover:bg-slate-500'
              }`}
              aria-label={`Ir para slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
