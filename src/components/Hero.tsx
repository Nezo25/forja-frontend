interface Props { onOrcamento: () => void; }

export function Hero({ onOrcamento }: Props) {
  return (
    <section className="relative overflow-hidden bg-[#161616] text-white pt-10 pb-16 md:py-20 px-4 md:px-8 border-b border-[#262626]">
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

          {/* Main Huge Condensed Headline */}
          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[0.92] tracking-wide text-white uppercase mb-6">
            Da imaginação <br />
            <span className="text-[#EA580C]">para a matéria.</span>
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
              <div className="font-display text-3xl md:text-4xl text-white">500+</div>
              <div className="text-[11px] text-[#737373] mt-0.5">peças entregues</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl text-white flex items-center gap-1.5">
                4,9 <span className="text-[#EA580C] text-xl leading-none">★</span>
              </div>
              <div className="text-[11px] text-[#737373] mt-0.5">avaliação média</div>
            </div>
            <div>
              <div className="font-display text-3xl md:text-4xl text-white">100%</div>
              <div className="text-[11px] text-[#737373] mt-0.5">acabamento manual</div>
            </div>
          </div>
        </div>

        {/* Right Studio Showcase Card */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="relative w-full max-w-md aspect-[4/5] rounded-2xl overflow-hidden bg-[#1E1E1E] border border-[#2E2E2E] shadow-2xl group">
            <img
              src="https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop"
              alt="Peça em destaque na Forja"
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            {/* Dark gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30 pointer-events-none" />

            {/* Bottom Tag */}
            <div className="absolute bottom-5 left-5 z-10">
              <span className="text-[10px] font-bold tracking-[0.2em] text-[#A3A3A3] uppercase block mb-1">
                Peça em Destaque
              </span>
              <span className="font-display text-2xl md:text-3xl text-white uppercase tracking-wide">
                Gengar Sorridente Sombrio
              </span>
            </div>

            {/* Round Seal: Forjado desde 2021 */}
            <div className="absolute -bottom-3 -right-3 md:bottom-6 md:-right-6 z-20 w-24 h-24 rounded-full bg-[#EAE5D9] text-[#161616] p-2 flex flex-col items-center justify-center text-center shadow-2xl border-4 border-[#161616] transform rotate-12 group-hover:rotate-0 transition-transform">
              <span className="text-base leading-none mb-0.5">✦</span>
              <span className="font-display text-xs font-bold leading-tight uppercase">FORJADO</span>
              <span className="text-[9px] font-bold text-[#555] leading-none">DESDE 2021</span>
            </div>
          </div>

          {/* Right vertical text */}
          <div className="hidden xl:flex absolute -right-10 top-1/2 -translate-y-1/2 rotate-90 origin-center text-[10px] tracking-[0.3em] font-semibold text-[#525252] uppercase pointer-events-none">
            MODELAGEM • IMPRESSÃO • PINTURA
          </div>
        </div>

      </div>
    </section>
  );
}
