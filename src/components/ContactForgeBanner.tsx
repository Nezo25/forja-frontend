import React from 'react';

interface ContactForgeBannerProps {
  whatsappNumber?: string;
  defaultMessage?: string;
}

export function ContactForgeBanner({
  whatsappNumber = '5511982563005',
  defaultMessage = 'Olá Chico! Gostaria de encomendar uma pintura personalizada ou tirar uma dúvida sobre as peças da oficina.'
}: ContactForgeBannerProps) {
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const encodedText = encodeURIComponent(defaultMessage);
  const wppUrl = `https://wa.me/${cleanNumber}?text=${encodedText}`;

  return (
    <div className="w-full max-w-md mt-4 rounded-xl p-3.5 bg-[#0F172A] border border-slate-800 shadow-xl flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
      <div className="flex-1 flex flex-col gap-1">
        {/* Indicador de presença online */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400">
            Chico disponível na oficina
          </span>
        </div>

        {/* Texto curto explicativo */}
        <p className="text-xs text-slate-300 leading-snug">
          Precisa de pintura especial, escala fora do padrão ou quer encomendar um STL próprio?
        </p>
      </div>

      {/* Botão de Ação Rápida WhatsApp */}
      <a
        href={wppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0 h-9 px-4 rounded-lg bg-[#22c55e] hover:bg-[#16a34a] text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-950/40 active:scale-95 transition-all whitespace-nowrap cursor-pointer"
      >
        <span className="text-sm">💬</span>
        <span>Falar com o Chico</span>
      </a>
    </div>
  );
}
