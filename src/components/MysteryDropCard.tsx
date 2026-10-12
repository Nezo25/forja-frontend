import React from 'react';

export type MysteryCategory = 'FIGURE_POKEMON' | 'GEEK_GENERAL' | 'TCG_SPECIAL' | 'DIORAMA';

interface MysteryDropCardProps {
  category?: string;
  title?: string;
  subtitle?: string;
  imageUrl?: string;
  whatsappText?: string;
  whatsappNumber?: string;
  slotNumber?: number;
  totalSlides?: number;
}

export function MysteryDropCard({
  category = 'FIGURE_POKEMON',
  title,
  subtitle,
  imageUrl,
  whatsappText,
  whatsappNumber = '5511982563005',
  slotNumber = 4,
  totalSlides = 4,
}: MysteryDropCardProps) {
  // Contextual copy defaults based on category
  const isPokemon = category === 'FIGURE_POKEMON';
  const isGeek = category === 'GEEK_GENERAL';
  
  const displayTitle = title || (
    isPokemon 
      ? 'Quem é esse Pokémon?' 
      : isGeek 
        ? 'Quem é esse Personagem?' 
        : 'Drop Secreto da Forja'
  );

  const displaySubtitle = subtitle || (
    isPokemon 
      ? 'Nova figure saindo da impressora' 
      : isGeek 
        ? 'Colecionável exclusivo em produção' 
        : 'Lançamento especial com desconto de estreia'
  );

  const displayBadge = isPokemon 
    ? '❓ Pokémon Secreto' 
    : isGeek 
      ? '❓ Drop Geek Misterioso' 
      : '✨ Edição Especial';

  const defaultWpp = isPokemon
    ? 'Olá Chico! Vi o Pokémon misterioso em destaque no site e quero saber qual é a peça antes de todo mundo!'
    : isGeek
      ? 'Olá Chico! Vi o personagem misterioso em destaque no site e quero saber qual é o colecionável!'
      : 'Olá Chico! Vi o drop secreto em destaque no site e quero garantir as condições de estreia!';

  const finalWppText = whatsappText && whatsappText.trim() ? whatsappText : defaultWpp;
  const cleanNumber = whatsappNumber.replace(/\D/g, '');
  const wppUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(finalWppText)}`;

  const silhouetteImg = imageUrl || 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop';

  return (
    <div className="w-full h-full shrink-0 relative bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0A0E17] flex flex-col justify-between p-5 sm:p-6 overflow-hidden border border-orange-500/30 rounded-2xl select-none">
      {/* Luz radial âmbar de fundo */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.22)_0,transparent_70%)] pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-44 h-44 bg-orange-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Badges */}
      <div className="flex items-center justify-between gap-2 z-10">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/25 text-amber-300 border border-amber-500/40 backdrop-blur-md flex items-center gap-1 shadow-sm">
          <span>{displayBadge}</span>
        </span>

        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold tracking-wider bg-black/60 backdrop-blur-md text-amber-300 border border-amber-500/30">
          {slotNumber.toString().padStart(2, '0')} / {totalSlides.toString().padStart(2, '0')}
        </span>
      </div>

      {/* Silhueta Escura com Ponto de Interrogação Dourado Vibrante */}
      <div className="relative flex-1 my-2 rounded-xl overflow-hidden flex items-center justify-center">
        {/* Silhueta 100% preta com alto contraste */}
        <img
          src={silhouetteImg}
          alt="Drop Misterioso"
          className="w-full h-full object-contain p-4 filter brightness-0 contrast-200 opacity-90 transition-transform duration-700 hover:scale-105"
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
          <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wide leading-none line-clamp-1">
            {displayTitle}
          </h3>
          <p className="text-[11px] text-slate-300 mt-1 line-clamp-1">
            {displaySubtitle}
          </p>
        </div>

        <a
          href={wppUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full h-11 rounded-xl font-bold text-xs uppercase tracking-wider bg-[#EA580C] hover:bg-[#C2410C] text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-950/50 hover:shadow-orange-600/30 active:scale-[0.98] transition-all cursor-pointer"
        >
          <span>Descobrir no WhatsApp</span>
          <span className="text-base">💬</span>
        </a>
      </div>
    </div>
  );
}
