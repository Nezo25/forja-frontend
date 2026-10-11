import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { CartItem } from '@/data/products';

interface Props {
  cart: CartItem[];
  onCartOpen: () => void;
  onOrcamento: () => void;
  search: string;
  onSearch: (v: string) => void;
}

export function Header({ cart, onCartOpen, onOrcamento, search, onSearch }: Props) {
  const [searchFocused, setSearchFocused] = useState(false);
  const total = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="sticky top-0 z-50 bg-[#090D16]/95 backdrop-blur-xl border-b border-slate-800/80">
      <div className="max-w-[1440px] mx-auto px-3 md:px-8 h-16 flex items-center justify-between gap-3 md:gap-6">
        
        {/* Logo - Preservando rigorosamente a logo original */}
        <Link to="/" className={`flex items-center gap-3 shrink-0 ${searchFocused ? 'hidden md:flex' : 'flex'} group`}>
          <div className="w-9 h-9 shrink-0 flex items-center justify-center transition-transform group-hover:scale-105">
            <img src="/images/logo.png" alt="Forja do Chico" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-[15px] tracking-tight text-white hidden sm:block">
            Forja do <span className="text-[#F97316]">Chico</span>
          </span>
        </Link>

        {/* Search */}
        <div className={`flex-1 flex justify-end md:justify-center transition-all ${searchFocused ? 'w-full' : 'max-w-xl'}`}>
          <div className="relative w-full">
            <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <input
              type="text"
              placeholder="Buscar figures, pokémons ou TCG..."
              value={search}
              onChange={e => onSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full h-10 pl-10 pr-4 text-sm rounded-xl outline-none transition-all bg-[#0F172A] border border-slate-800 text-slate-100 placeholder-slate-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500/50 shadow-inner"
            />
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-2.5 shrink-0 ${searchFocused ? 'hidden md:flex' : 'flex'}`}>
          <button
            onClick={onOrcamento}
            className="hidden md:flex items-center gap-2 h-10 px-4 rounded-xl text-sm font-semibold transition-all bg-[#0F172A] border border-slate-800 text-slate-200 hover:border-orange-500/60 hover:text-white hover:bg-slate-800/60"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <span className="hidden lg:inline">Orçamento STL</span>
          </button>

          <button
            onClick={onCartOpen}
            className="relative flex items-center justify-center gap-2 h-10 w-10 md:w-auto md:px-4 rounded-xl text-sm font-extrabold transition-all bg-[#F97316] hover:bg-[#EA580C] text-white shadow-lg shadow-orange-500/25 active:scale-95"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span className="hidden md:inline">Carrinho</span>
            {total > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 rounded-full text-[10px] font-black flex items-center justify-center bg-white text-[#EA580C] shadow-md border-2 border-[#F97316]">
                {total}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
