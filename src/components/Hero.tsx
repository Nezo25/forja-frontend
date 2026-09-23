interface Props { onOrcamento: () => void; }

export function Hero({ onOrcamento }: Props) {
  return (
    <section className="relative overflow-hidden py-12 md:py-16 px-4 md:px-8">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0" style={{
        background: 'radial-gradient(ellipse 60% 80% at 80% 50%, rgba(249,115,22,0.08) 0%, transparent 70%)',
      }} />
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 min-w-0">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold mb-4" style={{ background: 'rgba(249,115,22,0.12)', color: '#F97316', border: '1px solid rgba(249,115,22,0.3)' }}>
            🔥 Impressão 3D Artesanal de Alta Precisão
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-[1.15] mb-3" style={{ color: '#F9FAFB' }}>
            Sua figure dos<br />
            <span style={{ color: '#F97316' }}>sonhos saída<br />da forja.</span>
          </h1>
          <p className="text-[15px] mb-6" style={{ color: '#9CA3AF' }}>
            Pokémon e colecionáveis em PLA e Resina, com pintura artesanal sob encomenda.
          </p>
          <div className="flex flex-wrap gap-2 mb-6">
            {['🎨 Pintura artesanal', '🧵 Filamento premium', '📦 Envio seguro', '⚡ Entrega rápida'].map(b => (
              <span key={b} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: '#1F2937', border: '1px solid #374151', color: '#D1D5DB' }}>
                {b}
              </span>
            ))}
          </div>
          <div className="flex gap-3">
            <a href="#catalogo" className="h-10 px-6 rounded-lg text-sm font-bold flex items-center gap-2 transition-all" style={{ background: '#F97316', color: '#fff' }}
              onMouseEnter={e => (e.currentTarget.style.background = '#EA6A0A')}
              onMouseLeave={e => (e.currentTarget.style.background = '#F97316')}
            >
              Ver Catálogo ↓
            </a>
            <button onClick={onOrcamento} className="h-10 px-6 rounded-lg text-sm font-bold flex items-center gap-2 transition-all" style={{ background: 'transparent', border: '1px solid #F97316', color: '#F97316' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(249,115,22,0.08)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              📐 Enviar STL
            </button>
          </div>
        </div>

        {/* Featured badge grid */}
        <div className="hidden md:grid grid-cols-3 gap-3 shrink-0">
          {[
            { emoji: '🏆', label: '+500 figures entregues' },
            { emoji: '⭐', label: '4.9 / 5 avaliações' },
            { emoji: '🔩', label: 'Forjado desde 2021' },
          ].map(s => (
            <div key={s.label} className="flex flex-col items-center gap-1.5 p-4 rounded-xl text-center" style={{ background: '#1F2937', border: '1px solid #374151', minWidth: 120 }}>
              <span className="text-2xl">{s.emoji}</span>
              <span className="text-[12px] font-semibold" style={{ color: '#D1D5DB' }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
