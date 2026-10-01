const fs = require('fs');
let code = fs.readFileSync('src/pages/Home.tsx', 'utf8');

code = code.replace(
  `const [products, setProducts] = useState<Product[]>(getStoredProducts());`,
  `const [products, setProducts] = useState<Product[]>(getStoredProducts());
  const [isLoading, setIsLoading] = useState(getStoredProducts().length === 0);`
);

code = code.replace(
  `fetchRemoteProducts().then(setProducts);`,
  `fetchRemoteProducts().then(res => {
        setProducts(res);
        setIsLoading(false);
      });`
);

code = code.replace(
  `{activeProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ color: '#6B7280' }}>
              <div className="text-5xl">📦</div>
              <div className="text-base font-semibold">Nenhum produto encontrado</div>
              <div className="text-sm">Tente ajustar os filtros ou a busca</div>
            </div>
          ) : (`,
  `{isLoading ? (
            <div className="flex flex-col items-center justify-center py-20 gap-4" style={{ color: '#6B7280' }}>
              <div className="animate-spin text-4xl text-orange-500 border-4 border-t-orange-500 border-orange-500/20 rounded-full w-12 h-12"></div>
              <div className="text-base font-semibold">Conectando ao banco de dados...</div>
              <div className="text-xs max-w-sm text-center">O plano gratuito do Render pode levar até 50 segundos para acordar na primeira vez.</div>
            </div>
          ) : activeProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 gap-3" style={{ color: '#6B7280' }}>
              <div className="text-5xl">📦</div>
              <div className="text-base font-semibold">Nenhum produto encontrado</div>
              <div className="text-sm">Tente ajustar os filtros ou a busca</div>
            </div>
          ) : (`
);

fs.writeFileSync('src/pages/Home.tsx', code);
