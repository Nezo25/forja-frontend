import { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { FilterDrawer } from '@/components/FilterDrawer';
import { ProductCard } from '@/components/ProductCard';
import { ProductCustomizeModal } from '@/components/ProductCustomizeModal';
import { CartDrawer } from '@/components/CartDrawer';
import { OrcamentoModal } from '@/components/OrcamentoModal';
import { type CartItem, type Product, CATEGORY_LABELS, type ProductCategory, toProductCategory } from '@/data/products';
import { getStoredProducts, fetchRemoteProducts } from '@/services/storage';

export interface Filters {
  categories: string[];
  types: string[];
  scales: string[];
  finishes: string[];
}

export default function Home() {
  const [products, setProducts] = useState<Product[]>(getStoredProducts());
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Blindagem Safari / iOS: Busca assíncrona com tratamento de erro e timeout controlado
  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetchRemoteProducts();
      if (res && res.length > 0) {
        setProducts(res);
      } else {
        const cached = getStoredProducts();
        setProducts(cached);
      }
    } catch (err: any) {
      console.warn('Falha na busca remota do catálogo, ativando fallback em cache:', err);
      const cached = getStoredProducts();
      setProducts(cached);
      setLoadError('A conexão com o servidor demorou ou falhou. Exibindo catálogo em cache.');
    } finally {
      // Incondicionalmente encerra o estado de carregamento
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    loadCatalog();

    const handleUpdate = () => {
      if (mounted) {
        setProducts(getStoredProducts());
      }
    };

    window.addEventListener('forja_products_updated', handleUpdate);
    return () => {
      mounted = false;
      window.removeEventListener('forja_products_updated', handleUpdate);
    };
  }, [loadCatalog]);

  const [masterTab, setMasterTab] = useState<'ALL' | 'PRINT_3D' | 'TCG'>('ALL');
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
        const pCatLabel = (CATEGORY_LABELS as Record<string, string>)[p.category] || p.category;
        const matchesSearch = 
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) || 
          pCatLabel.toLowerCase().includes(q) ||
          p.types.some(t => t.toLowerCase().includes(q));
        if (!matchesSearch) return false;
      }
      if (masterTab === 'PRINT_3D' && p.department === 'TCG') return false;
      if (masterTab === 'TCG' && p.department !== 'TCG') return false;
      
      if (filters.categories.length > 0) {
        const matchesCategory = filters.categories.some(cat => {
          const catEnum = toProductCategory(cat);
          const pEnum = toProductCategory(p.category);
          return p.category === cat || pEnum === cat || pEnum === catEnum;
        });
        if (!matchesCategory) return false;
      }

      if (filters.types.length > 0 && !filters.types.some(t => p.types.includes(t as any))) return false;
      if (filters.scales.length > 0 && !filters.scales.some(s => p.scales.includes(s as any))) return false;
      return true;
    });
  }, [products, search, masterTab, filters]);

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
    <div className="min-h-screen bg-[#090D16] text-slate-100 flex flex-col">
      <Header
        cart={cart}
        onCartOpen={() => setCartOpen(true)}
        onOrcamento={() => setOrcamentoOpen(true)}
        search={search}
        onSearch={setSearch}
      />
      
      <Hero onOrcamento={() => setOrcamentoOpen(true)} />

      {/* Control Bar */}
      <div className="sticky top-16 z-40 bg-[#090D16]/95 backdrop-blur-md border-b border-slate-800/80 py-3">
        <div className="max-w-[1440px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
          
          {/* Categorias - Quick Nav */}
          <div className="flex-1 flex flex-col gap-2.5 overflow-x-auto no-scrollbar">
            <div className="flex bg-[#0F172A] p-1 rounded-xl w-fit border border-slate-800 shadow-sm">
              {[
                { id: 'ALL', label: '🔥 Todas as Criações' },
                { id: 'PRINT_3D', label: '🖨️ Oficina 3D' },
                { id: 'TCG', label: '🃏 TCG & Selados' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setMasterTab(tab.id as any);
                    setFilters(prev => ({ ...prev, categories: [], types: [] }));
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs md:text-sm font-bold transition-all ${
                    masterTab === tab.id 
                      ? 'bg-orange-500 text-white shadow-md shadow-orange-500/20' 
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            
            <div className="flex items-center gap-2 pb-1 -mb-1 w-max">
              <button
                onClick={() => setFilters(prev => ({ ...prev, categories: [] }))}
                className={`whitespace-nowrap px-3.5 py-1 rounded-full text-xs font-bold transition-all border ${
                  filters.categories.length === 0 
                    ? 'bg-[#F97316]/20 border-[#F97316] text-[#F97316] shadow-sm' 
                    : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                }`}
              >
                Todas
              </button>
              {(masterTab === 'TCG' ? [
                { key: 'Booster Avulso', label: 'Booster Avulso' },
                { key: 'Booster Box', label: 'Booster Box' },
                { key: 'ETB', label: 'ETB' },
                { key: 'Blister', label: 'Blister' },
                { key: 'Deck', label: 'Deck' },
                { key: 'Acessório Oficial', label: 'Acessório Oficial' }
              ] : [
                { key: 'FIGURE_POKEMON', label: CATEGORY_LABELS.FIGURE_POKEMON },
                { key: 'DIORAMA', label: CATEGORY_LABELS.DIORAMA },
                { key: 'CHIBI', label: CATEGORY_LABELS.CHIBI },
                { key: 'ACCESSORY_3D', label: CATEGORY_LABELS.ACCESSORY_3D },
              ]).map(catItem => {
                const isSelected = filters.categories.includes(catItem.key) || filters.categories.includes(catItem.label);
                return (
                  <button
                    key={catItem.key}
                    onClick={() => {
                      setFilters(prev => {
                        let newTypes = prev.types;
                        if (catItem.key !== 'FIGURE_POKEMON' && catItem.key !== 'CHIBI') newTypes = [];
                        return { ...prev, categories: [catItem.key], types: newTypes };
                      });
                    }}
                    className={`whitespace-nowrap px-3.5 py-1 rounded-full text-xs font-semibold transition-all border ${
                      isSelected 
                        ? 'bg-[#F97316]/20 border-[#F97316] text-[#F97316] shadow-sm' 
                        : 'bg-[#0F172A] border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    {catItem.label}
                  </button>
                );
              })}
            </div>
          </div>
          
          <button 
            onClick={() => setFilterDrawerOpen(true)}
            className="shrink-0 flex items-center gap-2 px-4 py-2 bg-[#0F172A] hover:bg-slate-800 text-slate-200 rounded-xl text-xs md:text-sm font-bold transition-all border border-slate-800 shadow-sm"
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
            <span>Filtros</span>
            {activeFiltersCount > 0 && (
              <span className="bg-[#F97316] text-white text-[11px] px-1.5 py-0.5 rounded-full font-bold">
                {activeFiltersCount}
              </span>
            )}
          </button>
        </div>
      </div>

      <FilterDrawer 
        masterTab={masterTab}
        open={filterDrawerOpen} 
        onClose={() => setFilterDrawerOpen(false)} 
        filters={filters as any} 
        onChange={setFilters as any} 
      />

      {/* Catalog Main */}
      <main id="catalogo" className="max-w-[1440px] mx-auto px-4 md:px-8 py-8 flex-1 w-full">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4 text-slate-400">
            <div className="animate-spin text-4xl text-[#F97316] border-4 border-t-[#F97316] border-orange-500/20 rounded-full w-12 h-12" />
            <div className="text-base font-bold text-slate-200">Carregando catálogo da Forja...</div>
            <div className="text-xs max-w-sm text-center text-slate-400">
              Sincronizando modelos 3D e estoque TCG.
            </div>
          </div>
        ) : loadError && activeProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 gap-4 text-center max-w-md mx-auto bg-[#0F172A] border border-slate-800 rounded-2xl shadow-xl">
            <div className="text-4xl">⚠️</div>
            <h3 className="text-lg font-bold text-slate-100">Não foi possível carregar o catálogo</h3>
            <p className="text-xs text-slate-400">
              O servidor demorou para responder ou está inicializando.
            </p>
            <button
              onClick={() => loadCatalog()}
              className="mt-2 px-5 py-2.5 rounded-xl font-extrabold text-xs uppercase tracking-wider bg-[#F97316] hover:bg-[#EA580C] text-white shadow-lg shadow-orange-500/20 active:scale-95 transition-all flex items-center gap-2"
            >
              <span>🔄</span> Tentar Novamente
            </button>
          </div>
        ) : activeProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <div className="text-5xl opacity-40">🔍</div>
            <div className="text-base font-bold text-slate-200">Nenhum produto encontrado</div>
            <div className="text-sm text-slate-400">Tente ajustar os filtros ou os termos de busca</div>
            <button
              onClick={() => loadCatalog()}
              className="mt-3 px-4 py-2 rounded-xl text-xs font-semibold bg-[#0F172A] hover:bg-slate-800 text-slate-200 border border-slate-800 transition-colors"
            >
              🔄 Recarregar Catálogo
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5 md:gap-5">
            {activeProducts.map(p => (
              <ProductCard key={p.id} product={p} onConfigure={setConfigProduct} onBuyNow={handleBuyNow} />
            ))}
          </div>
        )}

        {/* STL CTA */}
        <div
          className="mt-14 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row items-center gap-6 cursor-pointer group bg-[#0F172A] border border-orange-500/30 shadow-xl shadow-black/40 hover:border-orange-500/60 transition-all"
          onClick={() => setOrcamentoOpen(true)}
        >
          <div className="flex-1 min-w-0 text-center md:text-left">
            <div className="text-3xl mb-2">📦</div>
            <h3 className="text-xl md:text-2xl font-black mb-1.5 text-slate-100">
              Tem um arquivo STL próprio?
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed max-w-2xl">
              Envie seu modelo 3D para um orçamento sob medida em tempo real. Imprimimos qualquer projeto — da Pokédex customizada a miniaturas exclusivas de RPG.
            </p>
          </div>
          <button
            type="button"
            className="w-full md:w-auto shrink-0 h-11 px-7 rounded-xl font-extrabold text-sm transition-all bg-[#F97316] hover:bg-[#EA580C] text-white shadow-lg shadow-orange-500/25 active:scale-95"
          >
            Enviar meu STL 🚀
          </button>
        </div>
      </main>

      <footer className="text-center py-8 text-xs text-slate-500 border-t border-slate-800/80 mt-auto bg-[#070A10]">
        © 2026 Forja do Chico • Impressão 3D Artesanal & Geek Shop • Todos os direitos reservados
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
