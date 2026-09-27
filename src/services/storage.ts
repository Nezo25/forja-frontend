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
  PRODUCTS: 'forja_products_v3',
  ORDERS: 'forja_orders_v3',
  QUOTES: 'forja_quotes_v3',
  FILAMENTS: 'forja_filaments_v3',
};

export function parsePrice(val: string | number | undefined): number {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const cleaned = val.toString().replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
  return parseFloat(cleaned) || 0;
}

export function formatPrice(num: number): string {
  return num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

const INITIAL_ORDERS: Order[] = [
  { id: '#PED-1082', cliente: 'Lucas Silva', produto: 'Charizard Stance (1:10)', data: '27/09/2026', valor: '389,00', status: 'Em impressão' },
  { id: '#PED-1081', cliente: 'Mariana Souza', produto: 'Mewtwo Psíquico (1:10)', data: '26/09/2026', valor: '349,00', status: 'Enviado' },
  { id: '#PED-1080', cliente: 'Rafael Costa', produto: 'Gengar Sorridente (1:10)', data: '25/09/2026', valor: '289,00', status: 'Entregue' },
  { id: '#PED-1079', cliente: 'Beatriz Lima', produto: 'Pikachu Chibi', data: '24/09/2026', valor: '149,00', status: 'Aguardando pgto' },
  { id: '#PED-1078', cliente: 'Carlos Andrade', produto: 'Gyarados Diorama', data: '18/08/2026', valor: '520,00', status: 'Entregue' },
  { id: '#PED-1077', cliente: 'Fernanda Rocha', produto: 'Rayquaza Custom', data: '12/07/2026', valor: '480,00', status: 'Entregue' },
];

const INITIAL_QUOTES: Quote[] = [
  { id: '#S012', realId: 12, cliente: 'Treinador Oculto', arquivo: 'snorlax_custom.stl', status: 'Aguardando análise', data: '26/09/2026', contato: '(11) 98888-1234', escala: '1:10', acabamento: 'Pintado à Mão', detalhes: 'Quero com detalhes de grama na base' },
  { id: '#S011', realId: 11, cliente: 'Red Pallet', arquivo: 'pikachu_gigante.stl', status: 'Orçamento enviado', data: '25/09/2026', contato: 'red@kanto.com', escala: '1:1', acabamento: 'Peça Crua', detalhes: 'Impressão sólida para pintura em casa', precoEstimado: 450 },
];

const INITIAL_FILAMENTS: Filament[] = [
  { id: 'f1', color: 'Preto Ônix', material: 'PLA', stockGrams: 850, minStockGrams: 300 },
  { id: 'f2', color: 'Branco Puro', material: 'PLA', stockGrams: 220, minStockGrams: 300 },
  { id: 'f3', color: 'Cinza Espacial', material: 'Resina', stockGrams: 1200, minStockGrams: 500 },
  { id: 'f4', color: 'Vermelho Fogo', material: 'PLA', stockGrams: 460, minStockGrams: 300 },
  { id: 'f5', color: 'Azul Celeste', material: 'PLA', stockGrams: 80, minStockGrams: 300 },
];

/** Utilitário seguro para compactar imagem local para Base64 persistente */
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve) => {
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
        canvas.width = width || 400;
        canvas.height = height || 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          resolve(canvas.toDataURL('image/jpeg', 0.82));
        } else {
          resolve(result);
        }
      };
      img.onerror = () => resolve(result);
      img.src = result;
    };
    reader.onerror = () => resolve('https://placehold.co/600x700/1F2937/F97316?text=Figure');
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
        return parsed.map(sanitizeProduct);
      }
    }
  } catch (e) {
    console.error('Erro ao ler produtos do localStorage:', e);
  }
  return initialProducts.map(sanitizeProduct);
}

function sanitizeProduct(p: any): Product {
  return {
    id: p?.id ? p.id.toString() : 'p_' + Math.random().toString(36).substring(2, 7),
    name: p?.name || 'Figure Pokémon',
    category: p?.category || 'Figures Pokémon',
    types: Array.isArray(p?.types) ? p.types : [p?.primaryType || 'Normal'].filter(Boolean),
    scales: Array.isArray(p?.scales) && p.scales.length ? p.scales : ['1:10'],
    materials: Array.isArray(p?.materials) && p.materials.length ? p.materials : ['PLA'],
    basePrice: typeof p?.basePrice === 'number' ? p.basePrice : parsePrice(p?.basePrice) || 149,
    finishOptions: p?.finishOptions || [],
    image: p?.image || p?.imageUrl || 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
    printTimeH: typeof p?.printTimeH === 'number' ? p.printTimeH : 14,
    filamentG: typeof p?.filamentG === 'number' ? p.filamentG : 320,
    active: p?.active !== false && p?.isActive !== false,
    featured: Boolean(p?.featured),
  };
}

export function saveProductsToStorage(products: Product[]): void {
  try {
    const sanitized = products.map(sanitizeProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(sanitized));
    window.dispatchEvent(new Event('forja_products_updated'));
  } catch (e) {
    console.error('Erro ao salvar produtos no localStorage:', e);
  }
}

export async function saveProduct(productData: Partial<Product>, initialId?: string): Promise<Product> {
  const current = getStoredProducts();
  const isEditing = Boolean(initialId);
  const id = initialId || (productData.id && !productData.id.startsWith('p_') ? productData.id : 'p_' + Date.now());

  const fullProduct: Product = sanitizeProduct({
    ...productData,
    id,
  });

  let updatedList: Product[];
  if (isEditing) {
    updatedList = current.map(p => (p.id === id ? fullProduct : p));
  } else {
    // Evita duplicar se já existir
    updatedList = [fullProduct, ...current.filter(p => p.id !== id)];
  }

  saveProductsToStorage(updatedList);

  // Tenta persistir diretamente no Backend Java Spring Boot
  try {
    const payload = {
      pokedexNumber: 0,
      name: fullProduct.name,
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
        if (saved?.id) {
          const syncedId = saved.id.toString();
          const refreshed = getStoredProducts().map(p => p.id === id ? { ...p, id: syncedId } : p);
          saveProductsToStorage(refreshed);
        }
      })
      .catch((err) => {
        console.warn('Backend API não respondeu:', err);
      });
  } catch (err) {
    // Silently proceed
  }

  return fullProduct;
}

export function deleteProduct(id: string): void {
  const current = getStoredProducts();
  const updated = current.filter(p => p.id !== id);
  saveProductsToStorage(updated);

  if (!id.startsWith('p_')) {
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
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed.map(f => ({
          id: f.id || 'f_' + Math.random().toString(36).substring(2, 6),
          color: f.color || 'Filamento',
          material: f.material || 'PLA',
          stockGrams: typeof f.stockGrams === 'number' ? f.stockGrams : (f.stockG || 0),
          minStockGrams: typeof f.minStockGrams === 'number' ? f.minStockGrams : (f.minStockG || 300),
        }));
      }
    }
  } catch (e) {
    console.error('Erro ao ler filamentos:', e);
  }
  return INITIAL_FILAMENTS;
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
    stockGrams: data.stockGrams || 0,
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

// ------------------- PEDIDOS E DASHBOARD FINANCEIRO -------------------

export function getStoredOrders(): Order[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (local) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return INITIAL_ORDERS;
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
    cliente: order.cliente || 'Cliente da Loja',
    produto: order.produto || 'Item da Forja',
    data: new Date().toLocaleDateString('pt-BR'),
    valor: order.valor || '149,00',
    status: order.status || 'Em impressão',
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

// Calcula dinamicamente o gráfico mensal baseado nos pedidos reais
const MONTH_NAMES = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

export function calculateMonthlySales(orders: Order[]): { mes: string; vendas: number }[] {
  const currentMonthIdx = new Date().getMonth();
  const monthsWindow: { mes: string; monthNum: number; vendas: number }[] = [];

  for (let i = 5; i >= 0; i--) {
    const mIdx = (currentMonthIdx - i + 12) % 12;
    monthsWindow.push({
      mes: MONTH_NAMES[mIdx],
      monthNum: mIdx + 1,
      vendas: 0,
    });
  }

  orders.forEach(o => {
    let mNum = -1;
    if (o.data && o.data.includes('/')) {
      const parts = o.data.split('/');
      mNum = parseInt(parts[1], 10);
    }
    const val = parsePrice(o.valor);
    const found = monthsWindow.find(m => m.monthNum === mNum);
    if (found) {
      found.vendas += val;
    } else if (monthsWindow.length > 0) {
      // Atribui ao mês mais recente
      monthsWindow[monthsWindow.length - 1].vendas += val;
    }
  });

  return monthsWindow.map(m => ({ mes: m.mes, vendas: Math.round(m.vendas) }));
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
  return INITIAL_QUOTES;
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
    detalhes: quote.detalhes,
    precoEstimado: quote.precoEstimado,
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
