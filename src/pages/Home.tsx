import { useState, useMemo, useEffect } from 'react';
import { fetchApi } from '../api/client';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FilterBar, type Filters } from '@/components/FilterBar';
import { ProductCard } from '@/components/ProductCard';
import { ConfigModal } from '@/components/ConfigModal';
import { CartDrawer } from '@/components/CartDrawer';
import { CheckoutModal } from '@/components/CheckoutModal';
import { OrcamentoModal } from '@/components/OrcamentoModal';
import { products as MOCK_PRODUCTS, type CartItem, type Product } from '@/data/products';

export default function Home() {
  const [products, setProducts] = useState(MOCK_PRODUCTS);
  useEffect(() => {
    fetchApi('/models').then((data: any) => {
      if (Array.isArray(data) && data.length > 0) {
        const formatted = data.map(m => ({
          id: m.id.toString(),
          name: m.name,
          category: m.category,
          types: m.types || [],
          scales: m.scales || ['1:10'],
          materials: m.materials || ['PLA'],
          basePrice: m.basePrice,
          finishOptions: [],
          image: m.imageUrl || 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
          printTimeH: m.printTimeH || 0,
          filamentG: m.filamentG || 0,
          active: m.active,
        }));
        setProducts(formatted);
      }
    }).catch(console.error);
  }, []);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({ categories: [], types: [], scales: [], finishes: [] });
  const [configProduct, setConfigProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [orcamentoOpen, setOrcamentoOpen] = useState(false);

  const activeProducts = useMemo(() => {
    return products.filter(p => {
      if (!p.active) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q) && !p.types.some(t => t.toLowerCase().includes(q))) return false;
      }
      if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
      if (filters.types.length > 0 && !filters.types.some(t => p.types.includes(t))) return false;
      if (filters.scales.length > 0 && !filters.scales.some(s => p.scales.includes(s))) return false;
      return true;
    });
  }, [search, filters]);

  function addToCart(item: CartItem) {
    setCart(prev => {
      const idx = prev.findIndex(i => i.product.id === item.product.id && i.scale === item.scale && i.finish === item.finish && i.material === item.material);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
    setCartOpen(true);
  }

  function removeFromCart(idx: number) {
    setCart(prev => prev.filter((_, i) => i !== idx));
  }

  function handleCheckoutSuccess() {
    setCart([]);
    setCheckoutOpen(false);
    setCartOpen(false);
  }

  return (
    <div className="min-h-screen" style={{ background: '#0B0F19' }}>
      <Header
        cart={cart}
        onCartOpen={() => setCartOpen(true)}
        onOrcamento={() => setOrcamentoOpen(true)}
        search={search}
        onSearch={setSearch}
      />
      <Hero onOrcamento={() => setOrcamentoOpen(true)} />
      <FilterBar filters={filters} onChange={setFilters} />

      {/* Catalog */}
      <main id="catalogo" className="max-w-[1440px] mx-auto px-4 md:px-8 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-extrabold" style={{ color: '#F9FAFB' }}>Catálogo</h2>
            <p className="text-sm mt-0.5" style={{ color: '#9CA3AF' }}>
              {activeProducts.length} {activeProducts.length === 1 ? 'produto' : 'produtos'} encontrados
            </p>
          </div>
        </div>

        {activeProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ color: '#6B7280' }}>
            <div className="text-5xl">ðŸ”</div>
            <div className="text-base font-semibold">Nenhum produto encontrado</div>
            <div className="text-sm">Tente ajustar os filtros ou a busca</div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {activeProducts.map(p => (
              <ProductCard key={p.id} product={p} onConfigure={setConfigProduct} />
            ))}
          </div>
        )}

        {/* STL CTA */}
        <div
          className="mt-12 p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 cursor-pointer group"
          style={{ background: 'linear-gradient(135deg, #1F2937, #253042)', border: '1px solid rgba(249,115,22,0.3)' }}
          onClick={() => setOrcamentoOpen(true)}
        >
          <div className="flex-1 min-w-0">
            <div className="text-2xl mb-2">ðŸ”©</div>
            <h3 className="text-xl font-extrabold mb-1" style={{ color: '#F9FAFB' }}>
              Tem um arquivo STL próprio?
            </h3>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              Envie seu modelo e faça um orçamento personalizado em tempo real. Imprimimos qualquer design â€” da Pokédex Ã  sua criação original.
            </p>
          </div>
          <button
            className="shrink-0 h-11 px-7 rounded-xl font-extrabold text-sm transition-all"
            style={{ background: '#F97316', color: '#fff' }}
          >
            Enviar meu STL â†’
          </button>
        </div>
      </main>

      <footer className="text-center py-8 text-xs" style={{ color: '#374151', borderTop: '1px solid #1F2937' }}>
        Â© 2025 Forja do Chico Â· ImpressÃ£o 3D Artesanal Â· Todos os direitos reservados
      </footer>

      {/* Modals */}
      <ConfigModal product={configProduct} onClose={() => setConfigProduct(null)} onAdd={addToCart} />
      <CartDrawer
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onCheckout={() => { setCartOpen(false); setCheckoutOpen(true); }}
      />
      <CheckoutModal
        open={checkoutOpen}
        cart={cart}
        onClose={() => setCheckoutOpen(false)}
        onSuccess={handleCheckoutSuccess}
      />
      <OrcamentoModal open={orcamentoOpen} onClose={() => setOrcamentoOpen(false)} />
    </div>
  );
}



