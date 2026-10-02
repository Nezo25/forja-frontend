import { LOGO_BASE64 } from '../logo-base64';
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
    <header className="sticky top-0 z-50 bg-[#0B0F19]/90 backdrop-blur-xl border-b border-gray-800">
      <div className="max-w-[1440px] mx-auto px-3 md:px-8 h-16 flex items-center justify-between gap-3 md:gap-6">
        
        {/* Logo */}
        <Link to="/" className={`flex items-center gap-2.5 shrink-0 ${searchFocused ? 'hidden md:flex' : 'flex'}`}>
          <div className="w-9 h-9 shrink-0 flex items-center justify-center">
            <img src={LOGO_BASE64} alt="Forja do Chico" className="w-full h-full object-contain" />
          </div>
          <span className="font-extrabold text-[15px] leading-tight text-white hidden sm:block">
            Forja do Chico
          </span>
        </Link>

        {/* Search */}
        <div className={`flex-1 flex justify-end md:justify-center transition-all ${searchFocused ? 'w-full' : 'max-w-xl'}`}>
          <div className="relative w-full">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            </div>
            <input
              type="text"
              placeholder="Buscar figures..."
              value={search}
              onChange={e => onSearch(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              onBlur={() => setSearchFocused(false)}
              className="w-full h-10 pl-9 pr-4 text-sm rounded-lg outline-none transition-all bg-gray-800 border border-gray-700 text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500"
            />
          </div>
        </div>

        {/* Actions */}
        <div className={`flex items-center gap-2 shrink-0 ${searchFocused ? 'hidden md:flex' : 'flex'}`}>
          <button
            onClick={onOrcamento}
            className="hidden md:flex items-center gap-2 h-10 px-4 rounded-lg text-sm font-semibold transition-all bg-gray-800 border border-gray-700 text-white hover:border-orange-500"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
            <span className="hidden lg:inline">Orçamento STL</span>
          </button>

          <button
            onClick={onCartOpen}
            className="relative flex items-center justify-center gap-2 h-10 w-10 md:w-auto md:px-4 rounded-lg text-sm font-bold transition-all bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-500/20"
          >
            <svg width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span className="hidden md:inline">Carrinho</span>
            {total > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-black flex items-center justify-center bg-white text-orange-600 shadow-sm border-2 border-orange-500">
                {total}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
