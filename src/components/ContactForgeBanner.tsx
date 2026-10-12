import React from 'react';

interface ContactForgeBannerProps {
  whatsappNumber?: string;
  onCustomQuote?: () => void;
}

export function ContactForgeBanner({
  whatsappNumber = '5511982563005',
  onCustomQuote
}: ContactForgeBannerProps) {
  const wppText = encodeURIComponent(
    'Olá Chico! Gostaria de tirar uma dúvida sobre uma encomenda personalizada na Forja.'
  );
  const wppUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${wppText}`;

  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 md:px-8 mt-6 mb-12">
      <div className="relative rounded-2xl bg-[#0F172A] border border-slate-800 p-6 md:p-8 shadow-xl shadow-black/40 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 overflow-hidden">
        
        {/* Glow sutil de fundo */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

        {/* Lado Esquerdo: Indicador de Presença & Copy Direta */}
        <div className="flex flex-col gap-2.5 max-w-2xl z-10">
          
          {/* Indicador de Presença Online */}
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-400">
              Chico disponível na oficina
            </span>
          </div>

          {/* Chamada Principal */}
          <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wide leading-tight">
            Precisa de uma pintura especial, escala fora do padrão ou quer encomendar um STL próprio?
          </h3>

          <p className="text-xs sm:text-sm text-slate-400 font-normal leading-relaxed">
            Atendimento direto com o artesão. Tire suas dúvidas, envie referências de cores ou solicite um orçamento sem compromisso.
          </p>
        </div>

        {/* Lado Direito: Ações */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto z-10">
          {onCustomQuote && (
            <button
              type="button"
              onClick={onCustomQuote}
              className="h-12 px-5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>📐 Enviar STL</span>
            </button>
          )}

          <a
            href={wppUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 md:flex-initial h-12 px-6 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#22c55e] hover:bg-[#16a34a] text-white flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/40 hover:shadow-emerald-600/30 active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap"
          >
            {/* Ícone SVG oficial do WhatsApp */}
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.77-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.007c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.045.072.045.419-.1.824z"/>
            </svg>
            <span>Falar com o Chico</span>
          </a>
        </div>

      </div>
    </div>
  );
}
