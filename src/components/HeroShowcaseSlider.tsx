import React, { useState, useEffect, useRef, useCallback } from 'react';
import type { Product } from '@/data/products';
import { TypeBadge } from './TypeBadge';

interface HeroShowcaseSliderProps {
  featuredProduct?: Product | null;
  products?: Product[];
  onConfigure?: (p: Product) => void;
  whatsappNumber?: string;
}

export function HeroShowcaseSlider({
  featuredProduct,
  products = [],
  onConfigure,
  whatsappNumber = '5511982563005'
}: HeroShowcaseSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const touchStartX = useRef<number | null>(null);

  // Seleciona até 3 produtos para os primeiros 3 slides
  const slides = React.useMemo(() => {
    const list: Product[] = [];
    if (featuredProduct) {
      list.push(featuredProduct);
    }

    for (const p of products) {
      if (list.length >= 3) break;
      if (p.active && !list.some(item => item.id === p.id)) {
        list.push(p);
      }
    }

    return list.slice(0, 3);
  }, [featuredProduct, products]);

  // Total = produtos (até 3) + 1 Slide Misterioso (Index = slides.length)
  const totalSlides = slides.length + 1;
  const mysteryIndex = slides.length;
  const isMysteryActive = currentSlide === mysteryIndex;

  const nextSlide = useCallback(() => {
    setCurrentSlide(prev => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setCurrentSlide(prev => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  // Auto-play a cada 5.5s (pausa no hover)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 5500);
    return () => clearInterval(interval);
  }, [isPaused, nextSlide]);

  // Touch Swipe para Mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    touchStartX.current = null;
  };

  // WhatsApp link do card misterioso
  const mysteryWppText = encodeURIComponent(
    'Olá Chico! Vi o Pokémon misterioso em destaque no site e quero saber qual é a peça antes de todo mundo!'
  );
  const mysteryWppUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${mysteryWppText}`;

  // Imagem para silhueta do drop misterioso
  const mysterySilhouetteImage =
    slides[0]?.image ||
    'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop';

  return (
    <div
      className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden bg-[#1E1E1E] border border-[#2E2E2E] hover:border-orange-500/40 shadow-2xl transition-all duration-300 group select-none"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* Container de Slides Deslizantes Horizontais (Efeito Carrossel) */}
      <div
        className="flex w-full h-full transition-transform duration-500 ease-out"
        style={{ transform: `translateX(-${currentSlide * 100}%)` }}
      >
        {/* SLIDES DE PRODUTOS EM DESTAQUE (01 a 03) */}
        {slides.map((product, idx) => {
          const hasPromo = typeof product.promoPrice === 'number' && product.promoPrice > 0 && product.promoPrice < product.basePrice;
          const originalPrice = product.basePrice || 65;
          const promoPrice = hasPromo ? product.promoPrice! : originalPrice;
          const discountDiff = hasPromo ? (originalPrice - promoPrice) : 0;
          const discountPercent = hasPromo ? Math.round((discountDiff / originalPrice) * 100) : 0;

          return (
            <div
              key={product.id}
              onClick={() => onConfigure && onConfigure(product)}
              className="w-full h-full shrink-0 relative cursor-pointer"
            >
              {/* Foto da Figure em Alta Resolução */}
              <img
                src={product.image || 'https://placehold.co/600x700/1F2937/F97316?text=Figure'}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />

              {/* Degradê Editorial Dark */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/35 to-black/40 pointer-events-none" />

              {/* Top Badges do Slide */}
              <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2 z-10">
                {hasPromo ? (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/30 text-orange-300 border border-orange-500/40 backdrop-blur-md flex items-center gap-1 shadow-sm">
                    <span>🔥 Oferta da Forja</span>
                    <span className="font-extrabold">(-R$ {discountDiff.toFixed(0)})</span>
                  </span>
                ) : (
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white border border-white/20 backdrop-blur-md flex items-center gap-1 shadow-sm">
                    <span>⭐ Peça em Destaque</span>
                  </span>
                )}

                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-black/60 backdrop-blur-md text-slate-300 border border-white/10">
                  {(idx + 1).toString().padStart(2, '0')} / {totalSlides.toString().padStart(2, '0')}
                </span>
              </div>

              {/* Informações Inferiores */}
              <div className="absolute bottom-5 left-5 right-24 z-10 flex flex-col gap-1">
                {/* Element Badges */}
                {product.types && product.types.length > 0 && (
                  <div className="flex items-center gap-1.5 mb-1">
                    {product.types.map(t => (
                      <TypeBadge key={t} type={t} />
                    ))}
                  </div>
                )}

                {/* Preço Real: Normal vs Promocional Controlado */}
                {hasPromo ? (
                  <div className="flex items-center gap-2">
                    <span className="text-xs line-through text-slate-400 font-semibold">
                      R$ {originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-sm font-extrabold text-[#EA580C] bg-orange-950/60 px-2 py-0.5 rounded border border-orange-500/30">
                      R$ {promoPrice.toFixed(2).replace('.', ',')}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-400">
                      ({discountPercent}% OFF)
                    </span>
                  </div>
                ) : (
                  <div className="flex items-baseline gap-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400">A partir de</span>
                    <span className="text-base font-extrabold text-white">
                      R$ {originalPrice.toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                )}

                {/* Nome da Peça */}
                <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wide line-clamp-1 group-hover:text-orange-300 transition-colors">
                  {product.name}
                </h3>

                <span className="text-[11px] font-semibold text-[#A3A3A3] flex items-center gap-1 group-hover:text-white transition-colors">
                  Toque para personalizar <span className="text-[#EA580C]">→</span>
                </span>
              </div>
            </div>
          );
        })}

        {/* SLIDE 04: O CARD MISTERIOSO (QUEM É ESSE POKÉMON?) */}
        <div className="w-full h-full shrink-0 relative bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0A0E17] flex flex-col justify-between p-6 overflow-hidden">
          {/* Luz radial âmbar de fundo */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.22)_0,transparent_70%)] pointer-events-none" />
          <div className="absolute -top-12 -right-12 w-44 h-44 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

          {/* Top Badges */}
          <div className="flex items-center justify-between gap-2 z-10">
            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/25 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1 shadow-sm">
              <span>❓ Drop Misterioso da Oficina</span>
            </span>

            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30">
              {totalSlides.toString().padStart(2, '0')} / {totalSlides.toString().padStart(2, '0')}
            </span>
          </div>

          {/* Silhueta Escura com Ponto de Interrogação Dourado Vibrante */}
          <div className="relative flex-1 my-2 rounded-xl overflow-hidden flex items-center justify-center">
            {/* Silhueta 100% preta com alto contraste */}
            <img
              src={mysterySilhouetteImage}
              alt="Drop Misterioso"
              className="w-full h-full object-contain p-6 filter brightness-0 contrast-200 opacity-90 transition-transform duration-700 group-hover:scale-105"
            />

            {/* Interrogação Dourada Luminosa */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-display text-7xl sm:text-8xl text-amber-400 font-black drop-shadow-[0_0_25px_rgba(251,191,36,0.95)] animate-pulse">
                ?
              </span>
            </div>

            {/* Tag de Vantagem Flutuante */}
            <div className="absolute bottom-1 inset-x-2 text-center pointer-events-none">
              <span className="inline-block px-3 py-1 rounded-full text-[9px] sm:text-[10px] font-extrabold uppercase tracking-wider bg-black/85 backdrop-blur-md text-amber-300 border border-amber-500/40 shadow-lg">
                ⚡ Desconto Exclusivo p/ 3 Primeiros
              </span>
            </div>
          </div>

          {/* Bottom Callout & Botão WhatsApp */}
          <div className="z-10 flex flex-col gap-2 pt-1">
            <div>
              <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wide leading-none">
                Quem é esse Pokémon?
              </h3>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">
                Próximo lançamento secreto saindo da impressora
              </p>
            </div>

            <a
              href={mysteryWppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full h-11 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#EA580C] hover:bg-[#C2410C] text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 hover:shadow-orange-600/30 active:scale-[0.98] transition-all cursor-pointer"
            >
              <span>Descobrir no WhatsApp</span>
              <span className="text-base">💬</span>
            </a>
          </div>
        </div>
      </div>

      {/* Setas de Navegação Compactas (Hover no Desktop) */}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          prevSlide();
        }}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-[#EA580C] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 active:scale-90 z-20 cursor-pointer shadow-md"
        aria-label="Slide anterior"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M15 18l-6-6 6-6"/></svg>
      </button>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          nextSlide();
        }}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/60 hover:bg-[#EA580C] text-white border border-white/20 backdrop-blur-md flex items-center justify-center transition-all opacity-80 hover:opacity-100 active:scale-90 z-20 cursor-pointer shadow-md"
        aria-label="Próximo slide"
      >
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 18l6-6-6-6"/></svg>
      </button>

      {/* Indicadores de Bolinhas / Dots no Rodapé do Card */}
      <div className="absolute bottom-2 inset-x-0 flex items-center justify-center gap-1.5 z-20 pointer-events-none">
        {Array.from({ length: totalSlides }).map((_, dotIdx) => (
          <div
            key={dotIdx}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              currentSlide === dotIdx
                ? dotIdx === mysteryIndex
                  ? 'w-6 bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                  : 'w-6 bg-[#EA580C]'
                : 'w-1.5 bg-white/40'
            }`}
          />
        ))}
      </div>

      {/* Selo Redondo Oficial: Forjando desde 2022 (Preservado e integrado) */}
      {!isMysteryActive && (
        <div className="absolute -bottom-3 -right-3 md:bottom-6 md:-right-6 z-30 w-24 h-24 rounded-full bg-[#EAE5D9] text-[#161616] p-2 flex flex-col items-center justify-center text-center shadow-2xl border-4 border-[#161616] transform rotate-12 group-hover:rotate-0 transition-transform pointer-events-none">
          <span className="text-base leading-none mb-0.5">✦</span>
          <span className="font-display text-xs font-bold leading-tight uppercase">FORJANDO</span>
          <span className="text-[9px] font-bold text-[#555] leading-none">DESDE 2022</span>
        </div>
      )}
    </div>
  );
}
