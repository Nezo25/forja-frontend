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
  const [menuOpen, setMenuOpen] = useState(false);
  const total = cart.reduce((s, i) => s + i.qty, 0);

  return (
    <header className="sticky top-0 z-50" style={{ background: 'rgba(11,15,25,0.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #1F2937' }}>
      <div className="max-w-[1440px] mx-auto px-4 md:px-8 h-16 flex items-center gap-4">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 shrink-0 mr-2">
          <img src="/logo.png" alt="Forja do Chico Logo" className="w-9 h-9 rounded-lg object-cover" />
          <span className="font-bold text-[15px] leading-tight hidden sm:block" style={{ color: '#F9FAFB' }}>
            Forja do Chico
          </span>
        </Link>

        {/* Search */}
        <div className="flex-1 max-w-xl relative">
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]">
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          </div>
          <input
            type="text"
            placeholder="Buscar figures, dioramas, tipos..."
            value={search}
            onChange={e => onSearch(e.target.value)}
            className="w-full h-9 pl-9 pr-4 text-sm rounded-lg outline-none transition-all"
            style={{
              background: '#1F2937',
              border: '1px solid #374151',
              color: '#F9FAFB',
            }}
            onFocus={e => (e.target.style.borderColor = '#F97316')}
            onBlur={e => (e.target.style.borderColor = '#374151')}
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 ml-auto shrink-0">
          <button
            onClick={onOrcamento}
            className="hidden md:flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold transition-all"
            style={{ background: '#1F2937', border: '1px solid #374151', color: '#F9FAFB' }}
            onMouseEnter={e => (e.currentTarget.style.borderColor = '#F97316')}
            onMouseLeave={e => (e.currentTarget.style.borderColor = '#374151')}
          >
            📐 Orçamento STL
          </button>

          <button
            onClick={onCartOpen}
            className="relative flex items-center gap-2 h-9 px-4 rounded-lg text-sm font-semibold transition-all"
            style={{ background: '#F97316', color: '#fff' }}
            onMouseEnter={e => (e.currentTarget.style.background = '#EA6A0A')}
            onMouseLeave={e => (e.currentTarget.style.background = '#F97316')}
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>
            <span className="hidden sm:inline">Carrinho</span>
            {total > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center" style={{ background: '#0B0F19', color: '#F97316', border: '2px solid #F97316' }}>
                {total}
              </span>
            )}
          </button>

          <Link
            to="/admin"
            className="hidden md:flex items-center justify-center w-9 h-9 rounded-lg text-sm transition-all"
            style={{ background: '#1F2937', border: '1px solid #374151', color: '#9CA3AF' }}
            title="Painel Admin"
            onMouseEnter={e => (e.currentTarget.style.color = '#F97316')}
            onMouseLeave={e => (e.currentTarget.style.color = '#9CA3AF')}
          >
            ⚙️
          </Link>
        </div>
      </div>
    </header>
  );
}
