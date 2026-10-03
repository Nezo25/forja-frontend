import { useState, useMemo, useEffect } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FilterDrawer } from '@/components/FilterDrawer';
import { ProductCard } from '@/components/ProductCard';
import { ProductCustomizeModal } from '@/components/ProductCustomizeModal';
import { CartDrawer } from '@/components/CartDrawer';
import { OrcamentoModal } from '@/components/OrcamentoModal';
import { type CartItem, type Product } from '@/data/products';
import { getStoredProducts, fetchRemoteProducts } from '@/services/storage';

export interface Filters {
  categories: string[];
  types: string[];
  scales: string[];
  finishes: string[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>(getStoredProducts());
  const [isLoading, setIsLoading] = useState(getStoredProducts().length === 0);

  useEffect(() => {
    let mounted = true;
    
    fetchRemoteProducts()
      .then(res => {
        if (mounted) setProducts(res);
      })
      .catch(err => {
        console.error('Falha ao carregar catálogo remoto', err);
        if (mounted) setProducts(getStoredProducts());
      })
      .finally(() => {
        if (mounted) setIsLoading(false);
      });

    const handleUpdate = () => {
      if (mounted) setProducts(getStoredProducts());
    };
    window.addEventListener('forja_products_updated', handleUpdate);
    return () => {
      mounted = false;
      window.removeEventListener('forja_products_updated', handleUpdate);
    };
  }, []);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState<Filters>({ categories: [], types: [], scales: [], finishes: [] });
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [configProduct, setConfigProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orcamentoOpen, setOrcamentoOpen] = useState(false);

  const activeProducts = useMemo(() => {
    return products.filter(p => {
      if (!p.active) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.name.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q) && !p.types.some(t => t.toLowerCase().includes(q))) return false;
      }
      if (filters.categories.length > 0 && !filters.categories.includes(p.category)) return false;
      if (filters.types.length > 0 && !filters.types.some(t => p.types.includes(t as any))) return false;
      if (filters.scales.length > 0 && !filters.scales.some(s => p.scales.includes(s as any))) return false;
      if (filters.finishes.length > 0) return false; // Basic matching for finishes if needed, though products don't strictly have a root finish array
      return true;
    });
  }, [products, search, filters]);

  function addToCart(item: CartItem) {
    setCart(prev => {
      const idx = prev.findIndex(i => 
        i.product.id === item.product.id && 
        i.scale === item.scale && 
        i.finish === item.finish && 
        i.material === item.material &&
        i.observations === item.observations
      );
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = { ...next[idx], qty: next[idx].qty + item.qty };
        return next;
      }
      return [...prev, item];
    });
    setCartOpen(true);
  }

  function handleBuyNow(product: Product) {
    addToCart({
      product,
      scale: product.scales[0] || '1:10',
      finish: 'Peça Crua',
      material: product.materials[0] || 'PLA',
      qty: 1,
      unitPrice: product.basePrice,
      customized: false
    });
  }

  function removeFromCart(idx: number) {
    setCart(prev => prev.filter((_, i) => i !== idx));
  }

  const activeFiltersCount = filters.categories.length + filters.types.length + filters.scales.length + filters.finishes.length;

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

      {/* Control Bar */}
      <div className="sticky top-16 z-40 bg-[#0B0F19]/95 backdrop-blur-md border-b border-gray-800 py-3">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          
          {/* Categorias - Quick Nav */}
          <div className="flex-1 overflow-x-auto no-scrollbar flex items-center gap-2 pb-1 -mb-1">
            <button
              onClick={() => {
                setFilters(prev => ({ ...prev, categories: [] }));
              }}
              className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
                filters.categories.length === 0 
                  ? 'bg-orange-500/20 border-orange-500 text-orange-500' 
                  : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200'
              }`}
            >
              Todas
            </button>
            {['Figures Pokémon', 'Dioramas e Cenários', 'Chibis / Miniaturas', 'Acessórios & Colecionáveis'].map(cat => (
              <button
                key={cat}
                onClick={() => {
                  setFilters(prev => {
                    let newTypes = prev.types;
                    if (cat !== 'Figures Pokémon') {
                      newTypes = [];
                    }
                    return { ...prev, categories: [cat], types: newTypes };
                  });
                }}
                className={`whitespace-nowrap px-4 py-1.5 rounded-full text-sm font-semibold transition-colors border ${
                  filters.categories.includes(cat)
                    ? 'bg-orange-500/20 border-orange-500 text-orange-500' 
                    : 'bg-gray-800 border-gray-700 text-gray-400 hover:text-gray-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <button 
            onClick={() => setFilterDrawerOpen(true)}
            className="shrink-0 flex items-center gap-2 px-4 py-1.5 bg-gray-800 hover:bg-gray-700 text-gray-200 rounded-full text-sm font-semibold transition-colors border border-gray-700"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            Filtros {activeFiltersCount > 0 && <span className="bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-md">{activeFiltersCount}</span>}
          </button>
        </div>
      </div>

      <FilterDrawer 
        open={filterDrawerOpen} 
        onClose={() => setFilterDrawerOpen(false)} 
        filters={filters as any} 
        onChange={setFilters as any} 
      />

      {/* Catalog */}
      <main id="catalogo" className="max-w-[1440px] mx-auto px-4 md:px-8 py-6">
        {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4" style={{ color: '#6B7280' }}>
              <div className="animate-spin text-4xl text-orange-500 border-4 border-t-orange-500 border-orange-500/20 rounded-full w-12 h-12"></div>
              <div className="text-base font-semibold">Conectando ao banco de dados...</div>
              <div className="text-xs max-w-sm text-center">O plano gratuito do Render pode levar até 50 segundos para acordar na primeira vez.</div>
            </div>
          ) : activeProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ color: '#6B7280' }}>
              <div className="text-5xl">🔍</div>
              <div className="text-base font-semibold">Nenhum produto encontrado</div>
              <div className="text-sm">Tente ajustar os filtros ou a busca</div>
            </div>
          ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
            {activeProducts.map(p => (
              <ProductCard key={p.id} product={p} onConfigure={setConfigProduct} onBuyNow={handleBuyNow} />
            ))}
          </div>
        )}

        {/* STL CTA */}
        <div
          className="mt-12 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 cursor-pointer group"
          style={{ background: 'linear-gradient(135deg, #1F2937, #253042)', border: '1px solid rgba(249,115,22,0.3)' }}
          onClick={() => setOrcamentoOpen(true)}
        >
          <div className="flex-1 min-w-0 text-center md:text-left">
            <div className="text-2xl mb-2">📦</div>
            <h3 className="text-xl font-extrabold mb-1" style={{ color: '#F9FAFB' }}>
              Tem um arquivo STL próprio?
            </h3>
            <p className="text-sm" style={{ color: '#9CA3AF' }}>
              Envie seu modelo e faça um orçamento personalizado em tempo real. Imprimimos qualquer design – da Pokédex à sua criação original.
            </p>
          </div>
          <button
            className="w-full md:w-auto shrink-0 h-11 px-7 rounded-xl font-extrabold text-sm transition-all"
            style={{ background: '#F97316', color: '#fff' }}
          >
            Enviar meu STL 🚀
          </button>
        </div>
      </main>

      <footer className="text-center py-8 text-xs" style={{ color: '#374151', borderTop: '1px solid #1F2937' }}>
        © 2026 Forja do Chico • Impressão 3D Artesanal • Todos os direitos reservados
      </footer>

      {/* Modals */}
      <ProductCustomizeModal product={configProduct} onClose={() => setConfigProduct(null)} onAdd={addToCart} />
      <CartDrawer
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onClear={() => setCart([])}
      />
      <OrcamentoModal open={orcamentoOpen} onClose={() => setOrcamentoOpen(false)} />
    </div>
  );
}
