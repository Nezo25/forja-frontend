import { useState, useMemo, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { ProductCard } from '@/components/ProductCard';
import { ProductCustomizeModal } from '@/components/ProductCustomizeModal';
import { CartDrawer } from '@/components/CartDrawer';
import { OrcamentoModal } from '@/components/OrcamentoModal';
import { type CartItem, type Product, CATEGORY_LABELS, type ProductCategory, toProductCategory } from '@/data/products';
import { getStoredProducts, fetchRemoteProducts } from '@/services/storage';

export default function Home() {
  const [products, setProducts] = useState<Product[]>(getStoredProducts());
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  // Blindagem Safari / iOS: Busca assíncrona com timeout estrito e fallback
  const loadCatalog = useCallback(async () => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const res = await fetchRemoteProducts();
      if (res && res.length > 0) {
        setProducts(res);
      } else {
        setProducts(getStoredProducts());
      }
    } catch (err: any) {
      console.warn('Falha na busca remota do catálogo, ativando fallback:', err);
      setProducts(getStoredProducts());
      setLoadError('A conexão com o servidor demorou ou falhou. Exibindo catálogo em cache.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    loadCatalog();
    const handleUpdate = () => {
      if (mounted) setProducts(getStoredProducts());
    };
    window.addEventListener('forja_products_updated', handleUpdate);
    return () => {
      mounted = false;
      window.removeEventListener('forja_products_updated', handleUpdate);
    };
  }, [loadCatalog]);

  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [configProduct, setConfigProduct] = useState<Product | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [orcamentoOpen, setOrcamentoOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter(p => {
      if (!p.active) return false;
      if (search) {
        const q = search.toLowerCase();
        const pCatLabel = (CATEGORY_LABELS as Record<string, string>)[p.category] || p.category;
        const matches = 
          p.name.toLowerCase().includes(q) || 
          p.category.toLowerCase().includes(q) || 
          pCatLabel.toLowerCase().includes(q) ||
          p.types.some(t => t.toLowerCase().includes(q));
        if (!matches) return false;
      }

      if (activeCategory === 'ALL') return true;
      if (activeCategory === 'TCG') return p.department === 'TCG' || p.category === 'TCG';

      const pEnum = toProductCategory(p.category);
      const catEnum = toProductCategory(activeCategory);
      return p.category === activeCategory || pEnum === activeCategory || pEnum === catEnum;
    });
  }, [products, search, activeCategory]);

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

  return (
    <div className="min-h-screen bg-[#141414] text-white flex flex-col font-sans selection:bg-[#EA580C] selection:text-white">
      {/* Header com Logo original */}
      <Header
        cart={cart}
        onCartOpen={() => setCartOpen(true)}
        onOrcamento={() => setOrcamentoOpen(true)}
        search={search}
        onSearch={setSearch}
      />

      {/* Hero Editorial (Figma Make) */}
      <Hero onOrcamento={() => setOrcamentoOpen(true)} />

      {/* SECTION 01 — Orange Transition Banner (Figma Make) */}
      <section className="bg-[#EA580C] text-white py-12 md:py-20 px-4 md:px-8 overflow-hidden">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          <div className="md:col-span-3 text-[11px] font-bold tracking-[0.25em] uppercase text-orange-200/80 pt-2">
            Não sai de uma prateleira.
          </div>
          <div className="md:col-span-9 flex flex-col">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-orange-200/80 mb-3">
              01 — O nosso jeito
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[0.95] text-white uppercase tracking-tight">
              Cada peça carrega pequenas marcas do processo. É isso que faz dela <span className="underline decoration-white/40 underline-offset-4">só sua.</span>
            </h2>
          </div>
        </div>
      </section>

      {/* SECTION 02 — Catálogo de Produtos (Warm Bone/Cream Figma Make) */}
      <section id="catalogo" className="bg-[#ECE8DE] text-[#171717] py-14 md:py-24 px-4 md:px-8">
        <div className="max-w-[1440px] mx-auto">
          
          {/* Section Header */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-[#D6D0C2]">
            <div>
              <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#737373] block mb-2">
                02 — Últimas da forja
              </span>
              <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#171717] uppercase tracking-wide leading-none">
                Escolha a sua próxima história.
              </h2>
            </div>
            <button
              onClick={() => setActiveCategory('ALL')}
              className="text-xs font-bold tracking-wider uppercase text-[#171717] hover:text-[#EA580C] transition-colors flex items-center gap-1.5 self-start md:self-end"
            >
              <span>Ver catálogo completo</span>
              <span>→</span>
            </button>
          </div>

          {/* Category Filter Pills (Figma Make Style) */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-6 mb-4">
            {[
              { id: 'ALL', label: 'Todos' },
              { id: 'FIGURE_POKEMON', label: 'Figures Pokémon' },
              { id: 'DIORAMA', label: 'Dioramas' },
              { id: 'CHIBI', label: 'Colecionáveis' },
              { id: 'ACCESSORY_3D', label: 'Geek 3D' },
              { id: 'TCG', label: 'TCG & Selados' },
            ].map(tab => {
              const active = activeCategory === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveCategory(tab.id)}
                  className={`px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all whitespace-nowrap cursor-pointer ${
                    active 
                      ? 'bg-[#171717] text-white shadow-md' 
                      : 'bg-[#DCD6C8] text-[#525252] hover:bg-[#D0C9B8] hover:text-[#171717]'
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Product Grid */}
          {isLoading ? (
            <div className="py-24 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-10 h-10 border-4 border-[#171717] border-t-transparent rounded-full animate-spin" />
              <span className="font-display text-xl text-[#171717] uppercase tracking-wider">
                Carregando criações da Forja...
              </span>
            </div>
          ) : loadError && filteredProducts.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center max-w-md mx-auto gap-4">
              <div className="text-3xl">⚠️</div>
              <h3 className="font-display text-2xl uppercase">Falha na conexão com o servidor</h3>
              <p className="text-xs text-[#737373]">
                O backend pode estar iniciando no Render. Clique abaixo para tentar novamente.
              </p>
              <button
                onClick={() => loadCatalog()}
                className="px-6 py-2.5 rounded-full bg-[#171717] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#EA580C] transition-colors"
              >
                Tentar Novamente
              </button>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center gap-2">
              <span className="text-3xl opacity-40">🔍</span>
              <h3 className="font-display text-2xl uppercase text-[#171717]">Nenhum item nesta categoria</h3>
              <button
                onClick={() => setActiveCategory('ALL')}
                className="text-xs font-bold text-[#EA580C] uppercase tracking-wider mt-2 hover:underline"
              >
                Voltar a todos os produtos
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredProducts.map((p, idx) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  index={idx + 1}
                  onConfigure={setConfigProduct}
                  onBuyNow={handleBuyNow}
                />
              ))}
            </div>
          )}

        </div>
      </section>

      {/* SECTION 03 — A Oficina: Feito Sem Pressa (Figma Make) */}
      <section id="oficina" className="bg-[#141414] text-white py-16 md:py-24 px-4 md:px-8 border-t border-[#262626]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Workshop Atmosphere Image */}
          <div className="lg:col-span-6 relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-[#1E1E1E] border border-[#2E2E2E] shadow-2xl">
            <img
              src="https://images.unsplash.com/photo-1581092160607-ee22621dd758?q=80&w=1000&auto=format&fit=crop"
              alt="Bancada da Forja do Chico"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
            <div className="absolute bottom-4 left-4 bg-white/90 text-black px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest">
              Na bancada, agora
            </div>
          </div>

          {/* Right Process Explanation */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#737373] mb-3">
              03 — Feito sem pressa
            </span>
            <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-white uppercase tracking-tight leading-[0.95] mb-6">
              Da camada bruta ao último traço do pincel.
            </h2>
            <p className="text-sm md:text-base text-[#A3A3A3] mb-8 leading-relaxed max-w-xl">
              A impressão é só o começo. Depois dela vêm a cura, a preparação, a pintura e uma inspeção cuidadosa — tudo dentro da nossa oficina.
            </p>

            <div className="flex flex-col border-t border-[#262626]">
              <div className="py-4 border-b border-[#262626] flex items-start gap-4">
                <span className="font-mono text-xs text-[#EA580C] font-bold pt-0.5">01</span>
                <div>
                  <h4 className="font-display text-xl text-white uppercase tracking-wide">Impressão Precisa</h4>
                  <p className="text-xs text-[#737373] mt-0.5">Resina ou PLA, escolhidos para cada projeto.</p>
                </div>
              </div>

              <div className="py-4 border-b border-[#262626] flex items-start gap-4">
                <span className="font-mono text-xs text-[#EA580C] font-bold pt-0.5">02</span>
                <div>
                  <h4 className="font-display text-xl text-white uppercase tracking-wide">Acabamento Manual</h4>
                  <p className="text-xs text-[#737373] mt-0.5">Lixamento, preparação e pintura por camadas.</p>
                </div>
              </div>

              <div className="py-4 border-b border-[#262626] flex items-start gap-4">
                <span className="font-mono text-xs text-[#EA580C] font-bold pt-0.5">03</span>
                <div>
                  <h4 className="font-display text-xl text-white uppercase tracking-wide">Envio Protegido</h4>
                  <p className="text-xs text-[#737373] mt-0.5">Embalagem pensada para a peça chegar inteira.</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 04 — Sob Medida: STL Call-to-Action (Figma Make Cream Banner) */}
      <section className="bg-[#ECE8DE] text-[#171717] py-16 md:py-24 px-4 md:px-8 border-t border-[#D6D0C2]">
        <div className="max-w-[1440px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-7 flex flex-col">
            <span className="text-[11px] font-bold tracking-[0.25em] uppercase text-[#EA580C] mb-2">
              Tem uma ideia fora do catálogo?
            </span>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#171717] uppercase tracking-tight leading-[0.92]">
              Você imagina. <br />
              A gente forja.
            </h2>
          </div>

          <div className="md:col-span-5 flex flex-col items-start md:items-end gap-5">
            <p className="text-sm md:text-base text-[#525252] leading-relaxed max-w-sm md:text-right">
              Envie seu arquivo STL ou conte a sua ideia. Avaliamos material, escala e acabamento antes de começar.
            </p>
            <button
              onClick={() => setOrcamentoOpen(true)}
              className="h-12 px-7 rounded-lg text-sm font-bold flex items-center gap-2 transition-all bg-[#171717] hover:bg-[#EA580C] text-white shadow-xl cursor-pointer"
            >
              <span>Pedir orçamento</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </section>

      {/* Footer Minimalista (Figma Make) */}
      <footer className="bg-[#141414] text-white py-12 px-4 md:px-8 border-t border-[#262626]">
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-8 pb-8 border-b border-[#262626]">
          {/* Logo original */}
          <div className="flex items-center gap-3">
            <img src="/images/logo.png" alt="Forja do Chico" className="w-9 h-9 object-contain" />
            <span className="font-display text-2xl tracking-wide uppercase text-white">
              Forja do Chico
            </span>
          </div>

          {/* Slogan */}
          <div className="font-display text-2xl md:text-3xl uppercase tracking-wider text-[#EA580C]">
            Peças que merecem ficar.
          </div>
        </div>

        <div className="max-w-[1440px] mx-auto pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#737373]">
          <div className="flex items-center gap-6">
            <a href="#catalogo" className="hover:text-white transition-colors">Catálogo</a>
            <a href="#oficina" className="hover:text-white transition-colors">Processo</a>
            <button onClick={() => setOrcamentoOpen(true)} className="hover:text-white transition-colors">Orçamentos</button>
          </div>
          <div>
            © 2026 FORJA DO CHICO • FEITO COM CUIDADO
          </div>
        </div>
      </footer>

      {/* Modais de Interação */}
      <ProductCustomizeModal
        product={configProduct}
        onClose={() => setConfigProduct(null)}
        onAdd={addToCart}
      />
      <CartDrawer
        open={cartOpen}
        cart={cart}
        onClose={() => setCartOpen(false)}
        onRemove={removeFromCart}
        onClear={() => setCart([])}
      />
      <OrcamentoModal
        open={orcamentoOpen}
        onClose={() => setOrcamentoOpen(false)}
      />
    </div>
  );
}
