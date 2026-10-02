import { type Product, type PokemonType } from '@/data/products';
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
  hexCode?: string;
}

const STORAGE_KEYS = {
  PRODUCTS: 'forja_prod_products',
  ORDERS: 'forja_prod_orders',
  QUOTES: 'forja_prod_quotes',
  FILAMENTS: 'forja_prod_filaments',
  INITIALIZED: 'forja_prod_initialized_v4'
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

// ------------------- PRODUTOS (REAL DATA ONLY - SEM MOCKS) -------------------

function sanitizeProduct(p: any): Product {
  return {
    id: p?.id ? p.id.toString() : 'prod_' + Math.random().toString(36).substring(2, 8),
    name: p?.name || 'Figure',
    category: p?.category || 'Figures Pokémon',
    types: Array.isArray(p?.types) && p.types.length > 0 ? p.types : [p?.primaryType || 'Normal', p?.secondaryType].filter(Boolean),
    scales: Array.isArray(p?.scales) && p.scales.length ? p.scales : [p?.scale || '1:10'],
    materials: Array.isArray(p?.materials) && p.materials.length ? p.materials : ['PLA'],
    basePrice: typeof p?.basePrice === 'number' ? p.basePrice : parsePrice(p?.basePrice) || 0,
    finishOptions: p?.finishOptions || [],
    image: p?.image || p?.imageUrl || 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
    printTimeH: typeof p?.printTimeH === 'number' ? p.printTimeH : Math.floor((p?.basePrintTimeMinutes || 0) / 60),
    filamentG: typeof p?.filamentG === 'number' ? p.filamentG : (p?.defaultFilamentGrams || 0),
    active: p?.active !== false && p?.isActive !== false,
    featured: Boolean(p?.featured),
  };
}

export function getStoredProducts(): Product[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.PRODUCTS);
    if (local !== null) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        return parsed.map(sanitizeProduct);
      }
    }
  } catch (e) {
    console.error('Erro ao ler produtos:', e);
  }
  return []; // NUNCA restaura mock!
}

export function saveProductsToStorage(products: Product[]): void {
  try {
    const sanitized = products.map(sanitizeProduct);
    localStorage.setItem(STORAGE_KEYS.PRODUCTS, JSON.stringify(sanitized));
    window.dispatchEvent(new Event('forja_products_updated'));
  } catch (e) {
    console.error('Erro ao salvar produtos:', e);
  }
}

export async function fetchRemoteProducts(): Promise<Product[]> {
  try {
    const data: any = await fetchApi('/models');
    const items = data?.content || (Array.isArray(data) ? data : []);
    if (Array.isArray(items)) {
      const mapped = items.map(sanitizeProduct);
      saveProductsToStorage(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('API /models não respondeu ou retornou erro:', err);
  }
  return getStoredProducts();
}

export async function saveProduct(productData: Partial<Product>, initialId?: string): Promise<Product> {
  const current = getStoredProducts();
  const isEditing = Boolean(initialId);
  const id = initialId || (productData.id ? productData.id : 'prod_' + Date.now());

  const fullProduct: Product = sanitizeProduct({
    ...productData,
    id,
  });

  let updatedList: Product[];
  if (isEditing) {
    updatedList = current.map(p => (p.id === id ? fullProduct : p));
  } else {
    updatedList = [fullProduct, ...current.filter(p => p.id !== id)];
  }

  saveProductsToStorage(updatedList);

  // Payload exatamente mapeado para o DTO do Spring Boot
  const payload = {
    pokedexNumber: 0,
    name: fullProduct.name,
    generation: 1,
    primaryType: fullProduct.types[0] || 'Normal',
    secondaryType: fullProduct.types[1] || null,
    scale: fullProduct.scales[0] || '1:10',
    basePrintTimeMinutes: (fullProduct.printTimeH || 0) * 60,
    defaultFilamentGrams: fullProduct.filamentG || 0,
    imageUrl: fullProduct.image,
    basePrice: fullProduct.basePrice
  };

  const method = isEditing && !id.startsWith('prod_') ? 'PUT' : 'POST';
  const url = isEditing && !id.startsWith('prod_') ? `/models/${id}` : '/models';

  try {
    const savedFromApi: any = await fetchApi(url, { method, body: JSON.stringify(payload) });
    if (savedFromApi?.id) {
      const realId = savedFromApi.id.toString();
      const updatedWithRealId = getStoredProducts().map(p => p.id === id ? { ...p, id: realId } : p);
      saveProductsToStorage(updatedWithRealId);
      fullProduct.id = realId;
    }
  } catch (apiErr) {
    console.warn('Tentativa na API falhou, dados mantidos:', apiErr);
  }

  return fullProduct;
}

export async function deleteProduct(id: string): Promise<void> {
  const current = getStoredProducts();
  const updated = current.filter(p => p.id !== id);
  saveProductsToStorage(updated);

  try {
    await fetchApi(`/models/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Erro ao deletar na API:', err);
  }
}

export async function toggleProductActive(id: string): Promise<boolean> {
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

  try {
    const p = updated.find(x => x.id === id);
    if (p) {
      await fetchApi(`/models/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
          name: p.name,
          generation: 1,
          primaryType: p.types[0] || 'Normal',
          scale: p.scales[0] || '1:10',
          basePrintTimeMinutes: (p.printTimeH || 0) * 60,
          defaultFilamentGrams: p.filamentG || 0,
          isActive: newStatus
        })
      });
    }
  } catch (err) {}
  return newStatus;
}

export async function updateProductPrice(id: string, newPrice: number): Promise<void> {
  const current = getStoredProducts();
  const updated = current.map(p => p.id === id ? { ...p, basePrice: newPrice } : p);
  saveProductsToStorage(updated);

  try {
    await fetchApi(`/models/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ basePrice: newPrice })
    });
  } catch (err) {}
}

// ------------------- FILAMENTOS (SEM MOCKS) -------------------

export function getStoredFilaments(): Filament[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.FILAMENTS);
    if (local !== null) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) {
        return parsed.map(f => ({
          id: f.id || 'fil_' + Math.random().toString(36).substring(2, 6),
          color: f.color || f.colorName || 'Filamento',
          material: f.material || f.materialType || 'PLA',
          stockGrams: typeof f.stockGrams === 'number' ? f.stockGrams : (parseFloat(f.stockGrams) || 0),
          minStockGrams: typeof f.minStockGrams === 'number' ? f.minStockGrams : 300,
        }));
      }
    }
  } catch (e) {}
  return []; // NUNCA restaura mock!
}

export function saveFilamentsToStorage(filaments: Filament[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.FILAMENTS, JSON.stringify(filaments));
    window.dispatchEvent(new Event('forja_filaments_updated'));
  } catch (e) {}
}

export async function fetchRemoteFilaments(): Promise<Filament[]> {
  try {
    const data: any = await fetchApi('/admin/filaments');
    if (Array.isArray(data)) {
      const mapped = data.map((f: any) => ({
        id: f.id ? f.id.toString() : 'fil_' + Math.random().toString(36).substring(2, 6),
        color: f.color || f.colorName || 'PLA',
        material: f.material || f.materialType || 'PLA',
        stockGrams: parseFloat(f.stockGrams) || 0,
        minStockGrams: parseFloat(f.minStockGrams) || 300,
      }));
      saveFilamentsToStorage(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('API /admin/filaments não respondeu:', err);
  }
  return getStoredFilaments();
}

export async function saveFilament(data: { color: string; material: string; stockGrams: number; minStockGrams: number; hexCode?: string }): Promise<Filament> {
  const current = getStoredFilaments();
  const newFilament: Filament = {
    id: 'fil_' + Date.now(),
    color: data.color.trim(),
    material: data.material.trim(),
    stockGrams: data.stockGrams || 0,
    minStockGrams: data.minStockGrams || 300,
    hexCode: data.hexCode,
  };

  const updated = [newFilament, ...current];
  saveFilamentsToStorage(updated);

  try {
    const saved: any = await fetchApi('/admin/filaments', {
      method: 'POST',
      body: JSON.stringify({
        color: data.color.trim(),
        material: data.material.trim(),
        stockGrams: data.stockGrams || 0,
        minStockGrams: data.minStockGrams || 300,
      })
    });
    if (saved?.id) {
      newFilament.id = saved.id.toString();
      saveFilamentsToStorage(getStoredFilaments().map(f => f.id === newFilament.id ? newFilament : f));
    }
  } catch (err) {}
  return newFilament;
}

export async function updateFilamentStock(id: string, newStock: number): Promise<void> {
  const current = getStoredFilaments();
  const updated = current.map(f => f.id === id ? { ...f, stockGrams: Math.max(0, newStock) } : f);
  saveFilamentsToStorage(updated);

  try {
    await fetchApi(`/admin/filaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ stockGrams: newStock })
    });
  } catch (err) {}
}

export async function deleteFilament(id: string): Promise<void> {
  const current = getStoredFilaments();
  const updated = current.filter(f => f.id !== id);
  saveFilamentsToStorage(updated);

  try {
    await fetchApi(`/admin/filaments/${id}`, { method: 'DELETE' });
  } catch (err) {}
}

// ------------------- PEDIDOS (SEM MOCKS) -------------------

export function getStoredOrders(): Order[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (local !== null) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return []; // NUNCA restaura mock!
}

export function saveOrdersToStorage(orders: Order[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    window.dispatchEvent(new Event('forja_orders_updated'));
  } catch (e) {}
}

export async function fetchRemoteOrders(): Promise<Order[]> {
  try {
    const data: any = await fetchApi('/orders');
    if (Array.isArray(data)) {
      const mapped = data.map((o: any) => ({
        id: o.id ? '#PED-' + o.id.toString() : '#PED-' + Math.floor(1000 + Math.random() * 9000),
        cliente: o.customerName || o.cliente || 'Cliente',
        produto: o.productName || o.produto || 'Figure',
        data: o.createdAt ? new Date(o.createdAt).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
        valor: typeof o.totalAmount === 'number' ? formatPrice(o.totalAmount) : (o.valor || '0,00'),
        status: o.status || 'Aguardando pgto',
      }));
      saveOrdersToStorage(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('API /orders não respondeu:', err);
  }
  return getStoredOrders();
}

export async function addOrder(order: Partial<Order>): Promise<Order> {
  const current = getStoredOrders();
  const newOrder: Order = {
    id: '#PED-' + Math.floor(1000 + Math.random() * 9000),
    cliente: order.cliente || 'Cliente',
    produto: order.produto || 'Item da Forja',
    data: new Date().toLocaleDateString('pt-BR'),
    valor: order.valor || '149,00',
    status: order.status || 'Em impressão',
    email: order.email,
    telefone: order.telefone
  };
  saveOrdersToStorage([newOrder, ...current]);

  try {
    await fetchApi('/orders', {
      method: 'POST',
      body: JSON.stringify({
        customerName: newOrder.cliente,
        totalAmount: parsePrice(newOrder.valor),
        status: newOrder.status,
      })
    });
  } catch (err) {}
  return newOrder;
}

export async function updateOrderStatus(id: string, status: string): Promise<void> {
  const current = getStoredOrders();
  const updated = current.map(o => o.id === id ? { ...o, status } : o);
  saveOrdersToStorage(updated);

  try {
    const cleanId = id.replace('#PED-', '');
    await fetchApi(`/orders/${cleanId}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status })
    });
  } catch (err) {}
}

export async function deleteOrder(id: string): Promise<void> {
  const current = getStoredOrders();
  const updated = current.filter(o => o.id !== id);
  saveOrdersToStorage(updated);

  try {
    const cleanId = id.replace('#PED-', '');
    await fetchApi(`/orders/${cleanId}`, { method: 'DELETE' });
  } catch (err) {}
}

// ------------------- CÁLCULO DINÂMICO DE VENDAS -------------------
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
      monthsWindow[monthsWindow.length - 1].vendas += val;
    }
  });

  return monthsWindow.map(m => ({ mes: m.mes, vendas: Math.round(m.vendas) }));
}

// ------------------- ORÇAMENTOS STL (SEM MOCKS) -------------------

export function getStoredQuotes(): Quote[] {
  try {
    const local = localStorage.getItem(STORAGE_KEYS.QUOTES);
    if (local !== null) {
      const parsed = JSON.parse(local);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return []; // NUNCA restaura mock!
}

export function saveQuotesToStorage(quotes: Quote[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.QUOTES, JSON.stringify(quotes));
    window.dispatchEvent(new Event('forja_quotes_updated'));
  } catch (e) {}
}

export async function fetchRemoteQuotes(): Promise<Quote[]> {
  try {
    const data: any = await fetchApi('/quotes');
    if (Array.isArray(data)) {
      const mapped = data.map((q: any) => ({
        id: '#S' + (q.id || Math.floor(10 + Math.random() * 900)).toString().padStart(3, '0'),
        realId: q.id,
        cliente: q.customerName || 'Cliente',
        arquivo: q.fileName || q.stlUrl || 'modelo.stl',
        status: q.status || 'Aguardando análise',
        data: q.createdAt ? new Date(q.createdAt).toLocaleDateString('pt-BR') : new Date().toLocaleDateString('pt-BR'),
        contato: q.contact,
        precoEstimado: q.finalPrice,
      }));
      saveQuotesToStorage(mapped);
      return mapped;
    }
  } catch (err) {
    console.warn('API /quotes não respondeu:', err);
  }
  return getStoredQuotes();
}

export async function addQuote(quote: Partial<Quote>): Promise<Quote> {
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

  try {
    await fetchApi('/quotes', {
      method: 'POST',
      body: JSON.stringify({
        customerName: newQuote.cliente,
        stlUrl: newQuote.arquivo,
        status: newQuote.status,
      })
    });
  } catch (err) {}
  return newQuote;
}

export async function updateQuote(id: string, updates: Partial<Quote>): Promise<void> {
  const current = getStoredQuotes();
  const updated = current.map(q => q.id === id ? { ...q, ...updates } : q);
  saveQuotesToStorage(updated);

  try {
    const realId = updates.realId || id.replace('#S', '').replace(/^0+/, '');
    await fetchApi(`/quotes/${realId}`, {
      method: 'PUT',
      body: JSON.stringify(updates)
    });
  } catch (err) {}
}

export async function deleteQuote(id: string): Promise<void> {
  const current = getStoredQuotes();
  const target = current.find(q => q.id === id);
  const updated = current.filter(q => q.id !== id);
  saveQuotesToStorage(updated);

  try {
    const realId = target?.realId || id.replace('#S', '').replace(/^0+/, '');
    await fetchApi(`/quotes/${realId}`, { method: 'DELETE' });
  } catch (err) {}
}
