import type { Product } from '@/data/products';
import { HeroShowcaseSlider } from './HeroShowcaseSlider';
import { ContactForgeBanner } from './ContactForgeBanner';

interface Props {
  onOrcamento: () => void;
  featuredProduct?: Product | null;
  products?: Product[];
  onConfigure?: (p: Product) => void;
  onOpenWorkshopModal?: () => void;
}

export function Hero({ onOrcamento, featuredProduct, products = [], onConfigure, onOpenWorkshopModal }: Props) {
  return (
    <section id="destaques" className="relative overflow-hidden bg-[#161616] text-white pt-10 pb-16 md:py-20 px-4 md:px-8 border-b border-[#262626]">
      <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Editorial Content */}
        <div className="lg:col-span-7 flex flex-col justify-center">
          {/* Subtitle tag */}
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-[2px] bg-[#EA580C]" />
            <span className="text-[11px] md:text-xs font-bold tracking-[0.2em] text-[#A3A3A3] uppercase">
              Colecionáveis feitos em Santa Catarina
            </span>
          </div>

          {/* Main Huge Condensed Headline - Spacing fixed to prevent accent overlap */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-wide text-white uppercase mb-6 flex flex-col gap-2 md:gap-3 leading-none">
            <span className="block">Da imaginação</span>
            <span className="block text-[#EA580C]">para a matéria.</span>
          </h1>

          {/* Paragraph */}
          <p className="text-sm md:text-base text-[#A3A3A3] max-w-lg mb-8 leading-relaxed font-normal">
            Peças impressas, preparadas e pintadas à mão. Cada detalhe passa pelo olhar do Chico antes de deixar a oficina.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 mb-14">
            <a
              href="#catalogo"
              className="h-12 px-7 rounded-lg text-sm font-bold flex items-center gap-2.5 transition-all bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-lg shadow-orange-950/40 active:scale-95 cursor-pointer"
            >
              <span>Explorar a coleção</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </a>

            <button
              onClick={onOrcamento}
              className="h-12 px-6 rounded-lg text-sm font-semibold flex items-center gap-2.5 transition-all bg-[#262626] hover:bg-[#333333] text-white border border-[#404040] cursor-pointer"
            >
              <span>📐 Enviar meu STL</span>
            </button>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-3 gap-6 pt-6 border-t border-[#2A2A2A] max-w-md">
            <div>
              <div className="font-display text-3xl md:text-4xl text-white">100+</div>
              <div className="text-[11px] text-[#737373] mt-0.5">peças entregues</div>
            </div>
            <a
              href="#avaliacoes"
              onClick={(e) => {
                e.preventDefault();
                const el = document.getElementById('avaliacoes');
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth' });
                }
              }}
              className="group rounded-xl p-2 -m-2 transition-all cursor-pointer hover:border-orange-500/50 hover:bg-orange-950/20 border border-transparent block"
              title="Ver depoimentos e avaliações de colecionadores"
            >
              <div className="font-display text-3xl md:text-4xl text-white group-hover:text-orange-400 transition-colors flex items-center gap-1.5">
                4,9 <span className="text-[#EA580C] text-xl leading-none group-hover:scale-110 transition-transform">★</span>
              </div>
              <div className="text-[11px] text-[#737373] group-hover:text-gray-300 transition-colors mt-0.5 flex items-center justify-between">
                <span>avaliação média</span>
                <span className="text-[9px] text-orange-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Ver ↓</span>
              </div>
            </a>
            <div
              onClick={onOpenWorkshopModal}
              className={`group rounded-xl p-2 -m-2 transition-all ${
                onOpenWorkshopModal
                  ? 'cursor-pointer hover:border-orange-500/50 hover:bg-orange-950/20 border border-transparent'
                  : ''
              }`}
              title="Conheça o processo da nossa oficina"
            >
              <div className="flex items-center gap-1.5">
                <span className="font-display text-3xl md:text-4xl text-white group-hover:text-orange-400 transition-colors">100%</span>
                {onOpenWorkshopModal && (
                  <span className="text-[10px] font-bold text-orange-400 bg-orange-950/70 border border-orange-500/40 px-1.5 py-0.5 rounded-full whitespace-nowrap shadow-sm group-hover:border-orange-400 transition-all">
                    Ver bastidores ▶
                  </span>
                )}
              </div>
              <div className="text-[11px] text-[#737373] group-hover:text-gray-300 transition-colors mt-0.5">
                acabamento manual
              </div>
            </div>
          </div>
        </div>

        {/* Right Studio Showcase Card (Carrossel Interativo com Drop Misterioso) */}
        <div className="lg:col-span-5 relative flex flex-col items-center">
          <HeroShowcaseSlider
            featuredProduct={featuredProduct}
            products={products}
            onConfigure={onConfigure}
          />
          <ContactForgeBanner />

          {/* Right vertical text */}
          <div className="hidden xl:flex absolute -right-10 top-1/2 -translate-y-1/2 rotate-90 origin-center text-[10px] tracking-[0.3em] font-semibold text-[#525252] uppercase pointer-events-none">
            MODELAGEM • IMPRESSÃO • PINTURA
          </div>
        </div>

      </div>
    </section>
  );
}
