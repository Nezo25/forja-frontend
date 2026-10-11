interface Props { onOrcamento: () => void; }

export function Hero({ onOrcamento }: Props) {
  return (
    <section className="relative overflow-hidden py-6 md:py-14 px-4 md:px-8 bg-[#090D16]">
      {/* Background radial glow */}
      <div 
        className="pointer-events-none absolute inset-0" 
        style={{
          background: 'radial-gradient(ellipse 70% 60% at 75% 40%, rgba(249,115,22,0.10) 0%, transparent 70%)',
        }} 
      />
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center gap-6 md:gap-10 relative z-10">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] md:text-xs font-bold mb-3 md:mb-4 bg-orange-500/10 text-[#F97316] border border-orange-500/30">
            <span>🔥</span> Impressão 3D Artesanal & Varejo Geek
          </div>
          
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-[1.1] mb-3 text-slate-100">
            Sua figure dos <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F97316] via-orange-400 to-amber-400">
              sonhos saída da forja.
            </span>
          </h1>

          <p className="text-sm md:text-base text-slate-400 max-w-xl mb-5 leading-relaxed">
            Pokémon colecionáveis sob demanda em PLA e Resina, com acabamento e pintura artesanal sob medida, além de TCG original selado a pronta entrega.
          </p>

          <div className="flex flex-wrap gap-2 mb-6">
            {['🎨 Pintura artesanal', '🧵 Filamento premium', '📦 Envio seguro para todo Brasil', '⚡ Fatiamento sob medida'].map(badge => (
              <span key={badge} className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#0F172A] border border-slate-800 text-slate-300">
                {badge}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <a 
              href="#catalogo" 
              className="h-11 px-6 rounded-xl text-sm font-extrabold flex items-center gap-2 transition-all bg-[#F97316] hover:bg-[#EA580C] text-white shadow-lg shadow-orange-500/25 active:scale-95"
            >
              Ver Catálogo ↓
            </a>
            <button 
              onClick={onOrcamento} 
              className="h-11 px-6 rounded-xl text-sm font-bold flex items-center gap-2 transition-all bg-[#0F172A] hover:bg-slate-800/80 text-orange-400 border border-orange-500/40 active:scale-95"
            >
              📐 Orçamento STL
            </button>
          </div>
        </div>

        {/* Featured badge grid */}
        <div className="hidden md:grid grid-cols-3 gap-3 shrink-0">
          {[
            { emoji: '🏆', title: '+500 Peças', subtitle: 'Entregues com perfeição' },
            { emoji: '⭐', title: '4.9 / 5', subtitle: 'Satisfação comprovada' },
            { emoji: '🔩', title: 'Desde 2021', subtitle: 'Forjando colecionáveis' },
          ].map(s => (
            <div 
              key={s.title} 
              className="flex flex-col items-center justify-center p-4 rounded-2xl text-center bg-[#0F172A] border border-slate-800/80 shadow-xl shadow-black/30 min-w-[130px]"
            >
              <span className="text-2xl mb-1">{s.emoji}</span>
              <span className="text-sm font-black text-slate-100">{s.title}</span>
              <span className="text-[11px] text-slate-400">{s.subtitle}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
