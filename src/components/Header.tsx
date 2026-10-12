import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CartItem } from '@/data/products';

interface Props {
  cart: CartItem[];
  onCartOpen: () => void;
  onOrcamento: () => void;
  onOpenWorkshopModal?: () => void;
  search: string;
  onSearch: (v: string) => void;
}

export function Header({ cart, onCartOpen, onOrcamento, onOpenWorkshopModal, search, onSearch }: Props) {
  const [showSearch, setShowSearch] = useState(false);
  const total = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="sticky top-0 z-50 bg-[#141414]/95 backdrop-blur-md border-b border-[#262626]">
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-20 flex items-center justify-between gap-4">
        
        {/* Logo Original Forja do Chico */}
        <Link to="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 shrink-0 flex items-center justify-center">
            <img src="/images/logo.png" alt="Forja do Chico" className="w-full h-full object-contain" />
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-wide text-white group-hover:text-orange-400 transition-colors">
              Forja do Chico
            </span>
            <span className="text-[9px] font-bold tracking-widest text-[#737373] uppercase -mt-0.5">
              IMPRESSÃO 3D ARTESANAL
            </span>
          </div>
        </Link>

        {/* Center Nav Links (Figma Make Style) */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#A3A3A3]">
          <a href="#destaques" className="hover:text-white transition-colors">Destaques</a>
          <a href="#catalogo" className="hover:text-white transition-colors">Coleção</a>
          {onOpenWorkshopModal ? (
            <button
              onClick={onOpenWorkshopModal}
              className="hover:text-white transition-colors cursor-pointer text-sm font-medium"
            >
              A oficina
            </button>
          ) : (
            <a href="#oficina" className="hover:text-white transition-colors">A oficina</a>
          )}
          <button onClick={onOrcamento} className="hover:text-white transition-colors cursor-pointer">Sob medida</button>
        </nav>

        {/* Right Actions: Search + Cart */}
        <div className="flex items-center gap-3">
          {/* Search Toggle / Input */}
          <div className="relative flex items-center">
            {showSearch ? (
              <div className="flex items-center bg-[#262626] border border-[#404040] rounded-full px-3 py-1.5 animate-in fade-in duration-200">
                <input
                  type="text"
                  placeholder="Buscar figures..."
                  value={search}
                  onChange={e => onSearch(e.target.value)}
                  autoFocus
                  className="bg-transparent text-xs text-white placeholder-[#737373] outline-none w-32 sm:w-48"
                />
                <button onClick={() => setShowSearch(false)} className="text-[#A3A3A3] hover:text-white text-xs ml-1">✕</button>
              </div>
            ) : (
              <button
                onClick={() => setShowSearch(true)}
                className="w-10 h-10 rounded-full bg-[#1F1F1F] border border-[#2E2E2E] flex items-center justify-center text-[#A3A3A3] hover:text-white hover:border-[#404040] transition-colors"
                title="Buscar"
              >
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
              </button>
            )}
          </div>

          {/* Carrinho Pill (Figma Make style) */}
          <button
            onClick={onCartOpen}
            className="flex items-center gap-2.5 h-10 px-4 rounded-full bg-[#1F1F1F] border border-[#2E2E2E] hover:border-[#404040] text-white text-xs font-semibold transition-all group"
          >
            <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span>Carrinho</span>
            <span className="w-5 h-5 rounded-full bg-white text-black font-extrabold text-[10px] flex items-center justify-center group-hover:bg-[#EA580C] group-hover:text-white transition-colors">
              {total}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
