import { useEffect, useState } from 'react';

interface WorkshopProcessModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRequestCustomQuote?: () => void;
}

export function WorkshopProcessModal({
  isOpen,
  onClose,
  onRequestCustomQuote
}: WorkshopProcessModalProps) {
  const [videoError, setVideoError] = useState(false);
  const [isPlayingFallback, setIsPlayingFallback] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    // Previne scroll de fundo quando modal estiver aberto
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  function handleActionClick() {
    onClose();
    if (onRequestCustomQuote) {
      onRequestCustomQuote();
    } else {
      const el = document.getElementById('catalogo');
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }

  const steps = [
    {
      num: '01',
      icon: '📐',
      title: 'Modelagem & Fatiamento Digital',
      desc: 'Ajuste milimétrico de escalas, suportes orgânicos e orientação da malha para máxima fidelidade aos detalhes.'
    },
    {
      num: '02',
      icon: '🖨️',
      title: 'Impressão 3D de Alta Resolução',
      desc: 'Construção camada por camada em resina ou PLA premium, com tolerâncias mínimas e estrutura reforçada.'
    },
    {
      num: '03',
      icon: '🛠️',
      title: 'Pós-Processamento Rigoroso',
      desc: 'Cura controlada, remoção cirúrgica de suportes, lixamento progressivo e aplicação de primer nivelador.'
    },
    {
      num: '04',
      icon: '🎨',
      title: 'Pintura & Acabamento Manual',
      desc: 'Cada peça é pintada individualmente à mão pelo Chico com aerógrafo e pincéis de precisão, finalizada com verniz protetor fosco ou brilhante.'
    }
  ];

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md transition-opacity duration-300"
      onClick={onClose}
      aria-modal="true"
      role="dialog"
    >
      <div
        className="relative w-full max-w-4xl max-h-[92vh] overflow-y-auto rounded-3xl bg-[#090D16] border border-slate-800 text-slate-100 shadow-2xl flex flex-col custom-scrollbar animate-in fade-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
        style={{
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 40px rgba(234, 88, 12, 0.1)'
        }}
      >
        {/* Cabeçalho */}
        <div className="relative px-6 pt-7 pb-5 border-b border-slate-800/80 bg-gradient-to-b from-[#0F172A]/80 to-transparent">
          <div className="flex items-start justify-between gap-4">
            <div>
              {/* Badge superior */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] md:text-xs font-black tracking-wider uppercase bg-orange-950/70 border border-orange-500/40 text-orange-400 mb-3 shadow-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-ping" />
                <span>⚡ ARTE & TECNOLOGIA SOB MEDIDA</span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight leading-snug">
                Como sua figure ganha vida na Forja do Chico
              </h2>
              <p className="text-xs md:text-sm text-slate-400 mt-1.5 max-w-2xl leading-relaxed">
                Da modelagem digital à pintura artesanal: conheça cada etapa do nosso processo cuidadoso.
              </p>
            </div>

            {/* Botão Fechar (ESC) */}
            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700/60 shrink-0"
              title="Fechar (ESC)"
              aria-label="Fechar modal"
            >
              <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Corpo do Modal */}
        <div className="p-6 md:p-8 flex flex-col gap-8">
          {/* Bloco de Vídeo / Mídia Central (16:9) */}
          <div className="relative aspect-video rounded-2xl overflow-hidden border border-slate-800 bg-[#060911] shadow-inner group">
            {!videoError && !isPlayingFallback ? (
              <video
                controls
                playsInline
                preload="metadata"
                poster="/images/processo-thumb.jpg"
                className="w-full h-full object-cover"
                onError={() => setVideoError(true)}
              >
                <source src="/videos/processo-forja.mp4" type="video/mp4" />
                Seu navegador não suporta reprodução de vídeo.
              </video>
            ) : null}

            {/* Fallback Cinematográfico Elegante */}
            {(videoError || isPlayingFallback) && (
              <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center relative overflow-hidden bg-gradient-to-br from-slate-950 via-[#0F172A] to-slate-950">
                {/* Efeito de iluminação suave de oficina */}
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-orange-600/15 rounded-full blur-3xl pointer-events-none" />
                <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

                {/* Card de Vídeo Interativo */}
                <div className="relative z-10 flex flex-col items-center max-w-md">
                  <div className="relative mb-4">
                    <div className="w-20 h-20 rounded-full bg-orange-600/20 border border-orange-500/40 flex items-center justify-center text-orange-400 shadow-lg shadow-orange-950/50">
                      <span className="w-16 h-16 rounded-full bg-orange-500/20 absolute animate-ping opacity-50" />
                      <svg width="34" height="34" viewBox="0 0 24 24" fill="currentColor" className="ml-1">
                        <polygon points="5 3 19 12 5 21 5 3" />
                      </svg>
                    </div>
                  </div>

                  <span className="inline-block text-[11px] font-bold text-orange-400 uppercase tracking-widest bg-orange-950/60 border border-orange-800/40 px-3 py-1 rounded-full mb-2">
                    🎥 Bastidores da Oficina do Chico
                  </span>
                  <h3 className="text-lg md:text-xl font-bold text-white mb-2">
                    Da Resina Líquida ao Verniz Final
                  </h3>
                  <p className="text-xs text-slate-400 leading-relaxed mb-4">
                    Veja em detalhes a fusão entre calibragem milimétrica de impressão e o toque manual de pintura que dá alma a cada peça.
                  </p>
                  <div className="flex items-center gap-3 text-[11px] text-slate-500">
                    <span>⏱️ ~2 min de vídeo</span>
                    <span>•</span>
                    <span>📍 Bancada Forja em SC</span>
                    <span>•</span>
                    <span className="text-emerald-400">100% Manual</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Timeline dos 4 Passos do Processo Artesanal */}
          <div>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm md:text-base font-bold text-white flex items-center gap-2">
                <span className="text-orange-500">❖</span>
                <span>As 4 Etapas da Produção Artesanal</span>
              </h3>
              <span className="text-[11px] text-slate-400 font-medium">Controle de qualidade etapa por etapa</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {steps.map(step => (
                <div
                  key={step.num}
                  className="relative p-5 rounded-2xl bg-[#0F172A]/70 border border-slate-800/90 hover:border-orange-500/40 hover:bg-[#0F172A] transition-all group flex flex-col justify-between"
                >
                  <div>
                    {/* Top Step + Icon */}
                    <div className="flex items-center justify-between mb-3.5">
                      <div className="w-10 h-10 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-xl shadow-inner group-hover:scale-110 transition-transform">
                        {step.icon}
                      </div>
                      <span className="font-mono text-xs font-extrabold text-orange-400/80 group-hover:text-orange-400">
                        {step.num}
                      </span>
                    </div>

                    {/* Step Title */}
                    <h4 className="text-sm font-bold text-white mb-2 leading-snug group-hover:text-orange-300 transition-colors">
                      {step.title}
                    </h4>

                    {/* Step Description */}
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {step.desc}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-500">
                    <span>Fase {step.num}</span>
                    <span className="text-orange-400 font-bold">100% supervisionada</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Rodapé do Modal */}
        <div className="px-6 py-5 border-t border-slate-800/80 bg-[#0F172A]/60 flex flex-col sm:flex-row items-center justify-between gap-4">
          {/* Texto de Garantia */}
          <div className="flex items-center gap-2.5 text-xs text-slate-300 text-center sm:text-left">
            <span className="text-emerald-400 text-base">🛡️</span>
            <span>
              <strong>Garantia de Qualidade:</strong> Nenhuma peça sai da oficina sem inspeção visual completa.
            </span>
          </div>

          {/* Botão de Ação Primária */}
          <button
            onClick={handleActionClick}
            className="w-full sm:w-auto h-11 px-6 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-[#C2410C] text-white shadow-lg shadow-orange-950/40 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          >
            <span>Quero uma Figure Personalizada</span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
