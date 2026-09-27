import { products as initialProducts, type Product, type PokemonType } from '@/data/products';
import { fetchApi } from '@/api/client';

export interface Order {
  id: string;
  cliente: string;
  produto: string;
  data: string;
  valor: string;
  status: string;
  email?: string;
  telefone?: string;
}

export interface Quote {
  id: string;
  realId?: number;
  cliente: string;
  arquivo: string;
  status: string;
  data: string;
  contato?: string;
  escala?: string;
  acabamento?: string;
  detalhes?: string;
  precoEstimado?: number;
}

export interface Filament {
  id: string;
  color: string;
  material: string;
  stockGrams: number;
  minStockGrams: number;
}

const STORAGE_KEYS = {
  PRODUCTS: 'forja_products_v2',
  ORDERS: 'forja_orders_v2',
  QUOTES: 'forja_quotes_v2',
  FILAMENTS: 'forja_filaments_v2',
};

const DEFAULT_ORDERS: Order[] = [
  { id: '#PED-1082', cliente: 'Lucas Silva', produto: 'Charizard Stance (1:10)', data: '27/09/2026', valor: '149,00', status: 'Em impressão' },
  { id: '#PED-1081', cliente: 'Mariana Souza', produto: 'Mewtwo Psíquico (1:10)', data: '26/09/2026', valor: '349,00', status: 'Enviado' },
  { id: '#PED-1080', cliente: 'Rafael Costa', produto: 'Gengar Sorridente (1:10)', data: '25/09/2026', valor: '89,00', status: 'Entregue' },
  { id: '#PED-1079', cliente: 'Beatriz Lima', produto: 'Pikachu Chibi', data: '24/09/2026', valor: '59,00', status: 'Aguardando pgto' },
];

const DEFAULT_QUOTES: Quote[] = [
  { id: '#S012', realId: 12, cliente: 'Treinador Oculto', arquivo: 'snorlax_custom.stl', status: 'Aguardando análise', data: '26/09/2026', contato: '(11) 98888-1234', escala: '1:10', acabamento: 'Pintado à Mão', detalhes: 'Quero com detalhes de grama na base' },
  { id: '#S011', realId: 11, cliente: 'Red Pallet', arquivo: 'pikachu_gigante.stl', status: 'Orçamento enviado', data: '25/09/2026', contato: 'red@kanto.com', escala: '1:1', acabamento: 'Peça Crua', detalhes: 'Impressão sólida para pintura em casa', precoEstimado: 450 },
];

const DEFAULT_FILAMENTS: Filament[] = [
  { id: 'f1', color: 'Preto Ônix', material: 'PLA', stockGrams: 850, minStockGrams: 300 },
  { id: 'f2', color: 'Branco Puro', material: 'PLA', stockGrams: 220, minStockGrams: 300 },
  { id: 'f3', color: 'Cinza Espacial', material: 'Resina', stockGrams: 1200, minStockGrams: 500 },
  { id: 'f4', color: 'Vermelho Fogo', material: 'PLA', stockGrams: 460, minStockGrams: 300 },
  { id: 'f5', color: 'Azul Celeste', material: 'PLA', stockGrams: 80, minStockGrams: 300 },
];

/** Utilitário para comprimir e converter imagem local para Base64 persistente */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDim = 800;
        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          resolve(result);
        }
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ------------------- PRODUTOS -------------------

export function getStoredProducts(): Product[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Erro ao ler produtos do localStorage:', e);
  }
  // Se não existir, salva os produtos iniciais
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(initialProducts));
  } catch (e) {
    // ignore
  }
  return initialProducts;
}

export function saveProductsToStorage(products: Product[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(products));
    window.dispatchEvent(new Event('forja_products_updated'));
  } catch (e) {
    console.error('Erro ao salvar produtos no localStorage:', e);
  }
}

export async function saveProduct(productData: Partial<Product>, initialId?: string): Promise<Product> {
  const current = getStoredProducts();
  const isEditing = Boolean(initialId);
  const id = initialId || (productData.id && !productData.id.startsWith('p') ? productData.id : 'p_' + Date.now());

  const fullProduct: Product = {
    id,
    name: productData.name?.trim() || 'Nova Figure',
    category: productData.category || 'Figures Pokémon',
    types: productData.types || ['Normal' as PokemonType],
    scales: productData.scales?.length ? productData.scales : ['1:10'],
    materials: productData.materials?.length ? productData.materials : ['PLA'],
    basePrice: Number(productData.basePrice) || 120,
    finishOptions: productData.finishOptions || [],
    image: productData.image?.trim() || 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
    printTimeH: Number(productData.printTimeH) || 12,
    filamentG: Number(productData.filamentG) || 250,
    active: productData.active !== false,
    featured: productData.featured || false,
  };

  let updatedList: Product[];
  if (isEditing) {
    updatedList = current.map(p => (p.id === id ? fullProduct : p));
  } else {
    updatedList = [fullProduct, ...current];
  }

  saveProductsToStorage(updatedList);

  // Tentativa assíncrona em segundo plano no backend
  try {
    const payload = {
      name: fullProduct.name,
      pokedexNumber: 0,
      generation: 1,
      primaryType: fullProduct.types[0] || 'Normal',
      secondaryType: fullProduct.types[1] || null,
      scale: fullProduct.scales[0] || '1:10',
      basePrintTimeMinutes: fullProduct.printTimeH * 60,
      defaultFilamentGrams: fullProduct.filamentG,
      imageUrl: fullProduct.image.startsWith('data:') ? 'https://placehold.co/600x700/1F2937/F97316?text=Figure' : fullProduct.image
    };
    const method = isEditing && !id.startsWith('p_') ? 'PUT' : 'POST';
    const url = isEditing && !id.startsWith('p_') ? `/models/${id}` : '/models';
    
    fetchApi(url, { method, body: JSON.stringify(payload) })
      .then((saved: any) => {
        if (saved?.id && !isEditing) {
          // Atualiza id do backend se for novo
          const refreshed = getStoredProducts().map(p => p.id === id ? { ...p, id: saved.id.toString() } : p);
          saveProductsToStorage(refreshed);
        }
      })
      .catch(err => {
        console.warn('Backend offline ou endpoint não disponível. Dado salvo localmente com sucesso.', err);
      });
  } catch (err) {
    // ignore backend errors, local save is primary
  }

  return fullProduct;
}

export function deleteProduct(id: string): void {
  const current = getStoredProducts();
  const updated = current.filter(p => p.id !== id);
  saveProductsToStorage(updated);

  if (!id.startsWith('p_') && !id.startsWith('p')) {
    fetchApi(`/models/${id}`, { method: 'DELETE' }).catch(() => {});
  }
}

export function toggleProductActive(id: string): boolean {
  const current = getStoredProducts();
  let newStatus = true;
  const updated = current.map(p => {
    if (p.id === id) {
      newStatus = !p.active;
      return { ...p, active: newStatus };
    }
    return p;
  });
  saveProductsToStorage(updated);
  return newStatus;
}

export function updateProductPrice(id: string, newPrice: number): void {
  const current = getStoredProducts();
  const updated = current.map(p => p.id === id ? { ...p, basePrice: newPrice } : p);
  saveProductsToStorage(updated);
}

// ------------------- FILAMENTOS -------------------

export function getStoredFilaments(): Filament[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.FILAMENTS);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error('Erro ao ler filamentos do localStorage:', e);
  }
  try {
    localStorage.setItem(STORAGE_KEYS.FILAMENTS, JSON.stringify(DEFAULT_FILAMENTS));
  } catch (e) {}
  return DEFAULT_FILAMENTS;
}

export function saveFilamentsToStorage(filaments: Filament[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FILAMENTS, JSON.stringify(filaments));
    window.dispatchEvent(new Event('forja_filaments_updated'));
  } catch (e) {}
}

export async function saveFilament(data: { color: string; material: string; stockGrams: number; minStockGrams: number }): Promise<Filament> {
  const current = getStoredFilaments();
  const newFilament: Filament = {
    id: 'fil_' + Date.now(),
    color: data.color.trim(),
    material: data.material.trim(),
    stockGrams: data.stockGrams,
    minStockGrams: data.minStockGrams || 300,
  };

  const updated = [newFilament, ...current];
  saveFilamentsToStorage(updated);

  fetchApi('/admin/filaments', { method: 'POST', body: JSON.stringify(data) }).catch(() => {});
  return newFilament;
}

export function updateFilamentStock(id: string, newStock: number): void {
  const current = getStoredFilaments();
  const updated = current.map(f => f.id === id ? { ...f, stockGrams: Math.max(0, newStock) } : f);
  saveFilamentsToStorage(updated);
}

// ------------------- PEDIDOS -------------------

export function getStoredOrders(): Order[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(DEFAULT_ORDERS));
  } catch (e) {}
  return DEFAULT_ORDERS;
}

export function saveOrdersToStorage(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('forja_orders_updated'));
  } catch (e) {}
}

export function addOrder(order: Partial<Order>): Order {
  const current = getStoredOrders();
  const newOrder: Order = {
    id: '#PED-' + Math.floor(1000 + Math.random() * 9000),
    cliente: order.cliente || 'Cliente Anônimo',
    produto: order.produto || 'Item da Forja',
    data: new Date().toLocaleDateString('pt-BR'),
    valor: order.valor || '0,00',
    status: order.status || 'Aguardando pgto',
    email: order.email,
    telefone: order.telefone
  };
  saveOrdersToStorage([newOrder, ...current]);
  return newOrder;
}

export function updateOrderStatus(id: string, status: string): void {
  const current = getStoredOrders();
  const updated = current.map(o => o.id === id ? { ...o, status } : o);
  saveOrdersToStorage(updated);
}

export function deleteOrder(id: string): void {
  const current = getStoredOrders();
  const updated = current.filter(o => o.id !== id);
  saveOrdersToStorage(updated);
}

// ------------------- ORÇAMENTOS STL -------------------

export function getStoredQuotes(): Quote[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.QUOTES);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  try {
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(DEFAULT_QUOTES));
  } catch (e) {}
  return DEFAULT_QUOTES;
}

export function saveQuotesToStorage(quotes: Quote[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
    window.dispatchEvent(new Event('forja_quotes_updated'));
  } catch (e) {}
}

export function addQuote(quote: Partial<Quote>): Quote {
  const current = getStoredQuotes();
  const newQuote: Quote = {
    id: '#S' + Math.floor(10 + Math.random() * 900).toString().padStart(3, '0'),
    cliente: quote.cliente || 'Cliente',
    arquivo: quote.arquivo || 'modelo.stl',
    status: quote.status || 'Aguardando análise',
    data: new Date().toLocaleDateString('pt-BR'),
    contato: quote.contato,
    escala: quote.escala,
    acabamento: quote.acabamento,
    detalhes: quote.detalhes
  };
  saveQuotesToStorage([newQuote, ...current]);
  return newQuote;
}

export function updateQuote(id: string, updates: Partial<Quote>): void {
  const current = getStoredQuotes();
  const updated = current.map(q => q.id === id ? { ...q, ...updates } : q);
  saveQuotesToStorage(updated);
}

export function deleteQuote(id: string): void {
  const current = getStoredQuotes();
  const updated = current.filter(q => q.id !== id);
  saveQuotesToStorage(updated);
}
