import React from 'react';
import type { ProductCategory } from '@/types/catalog';
import type { Product } from '@/data/products';

interface MysteryDropCardProps {
  product?: Product | null;
  category?: ProductCategory | 'TCG' | string;
  whatsappNumber?: string;
}

export function MysteryDropCard({
  product,
  category = 'FIGURE_POKEMON',
  whatsappNumber = '5511982563005'
}: MysteryDropCardProps) {
  const activeCategory = (product?.category || category) as string;

  // Determina rótulos contextuais conforme a categoria
  let title = 'Quem é esse Pokémon?';
  let subtitle = 'Nova figure saindo da impressora';
  let badge = '❓ Pokémon Secreto';
  let isPokemon = false;
  let isGeek = false;

  if (activeCategory === 'FIGURE_POKEMON') {
    title = 'Quem é esse Pokémon?';
    subtitle = 'Nova figure saindo da impressora';
    badge = '❓ Pokémon Secreto';
    isPokemon = true;
  } else if (activeCategory === 'CHIBI') {
    title = 'Quem é esse Personagem?';
    subtitle = 'Colecionável exclusivo em produção';
    badge = '❓ Drop Geek Misterioso';
    isGeek = true;
  } else {
    title = 'Drop Secreto da Forja';
    subtitle = 'Lançamento especial com desconto de estreia';
    badge = '✨ Edição Especial';
  }

  // Imagem de base para a silhueta misteriosa (Rayquaza / Mewtwo / Gengar ou imagem do produto)
  const silhouetteImage = product?.image || 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=800&auto=format&fit=crop';

  const wppText = encodeURIComponent(
    'Olá Chico! Vi o drop secreto em destaque no site e quero saber qual é a peça antes do lançamento oficial!'
  );
  const wppUrl = `https://wa.me/${whatsappNumber.replace(/\D/g, '')}?text=${wppText}`;

  return (
    <div className="relative flex flex-col justify-between h-full min-w-[280px] sm:min-w-[320px] max-w-[340px] rounded-2xl bg-gradient-to-b from-[#1E293B] via-[#0F172A] to-[#0A0E17] border border-orange-500/40 hover:border-orange-500/80 shadow-xl shadow-orange-950/20 p-5 transition-all duration-300 group overflow-hidden select-none">
      
      {/* Glow e iluminação de fundo temática */}
      <div className="absolute -top-16 -right-16 w-36 h-36 bg-orange-500/15 rounded-full blur-2xl pointer-events-none group-hover:bg-orange-500/25 transition-all" />
      <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

      {/* Top Header & Badges */}
      <div className="flex items-center justify-between gap-2 mb-3 z-10">
        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-orange-500/20 text-orange-400 border border-orange-500/30 flex items-center gap-1 shadow-sm">
          {badge}
        </span>
        <span className="text-[10px] font-mono font-bold tracking-widest text-slate-400 uppercase">
          04 / 04
        </span>
      </div>

      {/* Área da Imagem / Silhueta com Interrogação */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gradient-to-b from-black/80 to-[#111827] border border-slate-700/60 flex items-center justify-center mb-4 group-hover:border-orange-500/40 transition-colors">
        
        {/* Padrão radial de fundo retrô */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(249,115,22,0.15)_0,transparent_70%)] pointer-events-none" />

        {isPokemon || isGeek || activeCategory !== 'TCG' ? (
          <>
            {/* Silhueta escura 100% preta com alto contraste */}
            <img
              src={silhouetteImage}
              alt="Drop Misterioso da Forja"
              className="w-full h-full object-contain p-6 filter brightness-0 contrast-200 opacity-90 transition-transform duration-500 group-hover:scale-105"
            />
            {/* Interrogação Dourada Luminosa no centro */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="font-display text-6xl sm:text-7xl text-amber-400 font-black drop-shadow-[0_0_20px_rgba(251,191,36,0.9)] animate-pulse">
                ?
              </span>
            </div>
          </>
        ) : (
          /* Pacote Selado / Caixa Misteriosa para TCG ou Acessórios */
          <div className="relative flex flex-col items-center justify-center p-6 text-center">
            <div className="w-24 h-24 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center mb-2 shadow-inner">
              <span className="text-5xl animate-bounce">🎁</span>
            </div>
            <span className="text-xs font-bold text-amber-300 uppercase tracking-widest">
              Pacote Selado Secreto
            </span>
          </div>
        )}

        {/* Tag de Vantagem Flutuante na imagem */}
        <div className="absolute bottom-2 inset-x-2 text-center pointer-events-none">
          <span className="inline-block px-2.5 py-0.5 rounded-full text-[9px] font-extrabold uppercase tracking-wide bg-black/80 backdrop-blur-md text-amber-300 border border-amber-500/30">
            ⚡ Desconto Exclusivo p/ 3 Primeiros
          </span>
        </div>
      </div>

      {/* Título & Descrição */}
      <div className="flex flex-col gap-1 mb-4 z-10">
        <h3 className="font-display text-2xl sm:text-3xl text-white uppercase tracking-wide leading-none group-hover:text-orange-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-slate-400 line-clamp-1">
          {subtitle}
        </p>
      </div>

      {/* CTA Button para WhatsApp */}
      <a
        href={wppUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="w-full h-11 rounded-xl font-bold text-xs sm:text-sm tracking-wider uppercase bg-[#EA580C] hover:bg-[#C2410C] text-white flex items-center justify-center gap-2 shadow-lg shadow-orange-950/40 hover:shadow-orange-600/30 active:scale-[0.98] transition-all cursor-pointer z-10"
      >
        <span>Descobrir o Segredo</span>
        <span className="text-base">💬</span>
      </a>

    </div>
  );
}
