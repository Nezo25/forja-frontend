import { fetchApi } from '@/api/client';
import { type Product } from '@/data/products';
import { getStoredProducts } from './storage';

export interface PublicShowcaseSlot {
  slotNumber: number;
  productId?: number | null;
  name?: string | null;
  category?: string | null;
  primaryType?: string | null;
  secondaryType?: string | null;
  scale?: string | null;
  imageUrl?: string | null;
  originalPrice?: number | null;
  promotionalPrice?: number | null;
  discountAmount?: number | null;
  discountPercentage?: number | null;
  badgeLabel?: string | null;
  allowCouponStacking?: boolean | null;
}

export interface PublicMysteryDrop {
  slotNumber: number;
  title: string;
  subtitle: string;
  category: string;
  imageUrl?: string | null;
  whatsappText: string;
}

export interface PublicShowcaseResponse {
  slots: PublicShowcaseSlot[];
  mysteryDrop: PublicMysteryDrop;
}

export interface AdminShowcaseSlot {
  id?: number;
  slotNumber: number;
  productId?: number | null;
  productName?: string | null;
  productCategory?: string | null;
  productImageUrl?: string | null;
  originalPrice?: number | null;
  promotionalPrice?: number | null;
  discountAmount?: number | null;
  discountPercentage?: number | null;
  badgeLabel?: string | null;
  allowCouponStacking?: boolean;
  isActive?: boolean;
  mysteryTitle?: string | null;
  mysterySubtitle?: string | null;
  mysteryCategory?: string | null;
  mysteryImageUrl?: string | null;
  mysteryWhatsappText?: string | null;
  updatedAt?: string | null;
}

export interface ShowcaseSlotUpdateRequest {
  productId?: number | null;
  promotionalPrice?: number | null;
  badgeLabel?: string | null;
  allowCouponStacking?: boolean;
  isActive?: boolean;
  mysteryTitle?: string | null;
  mysterySubtitle?: string | null;
  mysteryCategory?: string | null;
  mysteryImageUrl?: string | null;
  mysteryWhatsappText?: string | null;
}

const LOCAL_STORAGE_SHOWCASE_KEY = 'forja_showcase_slots_cache_v2';

/** Retorna fallback seguro a partir do catálogo local quando a API não estiver disponível */
export function getDefaultPublicShowcase(catalogProducts?: Product[]): PublicShowcaseResponse {
  const products = catalogProducts && catalogProducts.length > 0 ? catalogProducts : getStoredProducts();
  const activeProducts = products.filter(p => p.active);

  const p1 = activeProducts[0];
  const p2 = activeProducts[1] || p1;
  const p3 = activeProducts[2] || p1;

  const makeSlot = (num: number, p?: Product): PublicShowcaseSlot => {
    const orig = p ? (p.basePrice || 75) : 75;
    // Se ainda não houver preço customizado no slot, aplica a oferta especial da oficina
    const defaultDiff = orig >= 80 ? 16 : (orig >= 50 ? 10 : 8);
    const promo = p?.promoPrice && p.promoPrice > 0 && p.promoPrice < orig 
      ? p.promoPrice 
      : Math.max(15, orig - defaultDiff);
    const diff = orig - promo;
    const pct = Math.round((diff / orig) * 100);

    return {
      slotNumber: num,
      productId: p ? Number(p.id) || null : null,
      name: p?.name || `Figure da Semana ${num}`,
      category: p?.category || 'FIGURE_POKEMON',
      primaryType: p?.types?.[0] || 'Normal',
      secondaryType: p?.types?.[1] || null,
      scale: p?.scales?.[0] || '1:10 (~15 cm)',
      imageUrl: p?.image || 'https://placehold.co/600x700/1F2937/F97316?text=Figure',
      originalPrice: orig,
      promotionalPrice: promo,
      discountAmount: diff,
      discountPercentage: pct,
      badgeLabel: '🔥 OFERTA DESTAQUE DA OFICINA',
      allowCouponStacking: false,
    };
  };

  return {
    slots: [makeSlot(1, p1), makeSlot(2, p2), makeSlot(3, p3)],
    mysteryDrop: {
      slotNumber: 4,
      title: 'Quem é esse Pokémon?',
      subtitle: 'Próximo lançamento saindo da bancada',
      category: 'FIGURE_POKEMON',
      imageUrl: p1?.image || 'https://images.unsplash.com/photo-1618336753974-aae8e04506aa?q=80&w=1000&auto=format&fit=crop',
      whatsappText: 'Olá Chico! Vi o drop misterioso da semana no site e quero garantir com desconto exclusivo!',
    },
  };
}

/** Busca a vitrine pública do Hero da API com timeout e fallback imediato */
export async function fetchPublicShowcase(catalog?: Product[]): Promise<PublicShowcaseResponse> {
  try {
    const cached = localStorage.getItem(LOCAL_STORAGE_SHOWCASE_KEY);
    const initialFallback = cached ? JSON.parse(cached) : getDefaultPublicShowcase(catalog);

    try {
      const data = await fetchApi<PublicShowcaseResponse>('/showcase');
      if (data && Array.isArray(data.slots) && data.slots.length > 0) {
        localStorage.setItem(LOCAL_STORAGE_SHOWCASE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (apiErr) {
      console.warn('API /showcase indisponível ou iniciando no Render, usando cache/fallback:', apiErr);
    }

    return initialFallback;
  } catch {
    return getDefaultPublicShowcase(catalog);
  }
}

/** Busca os dados completos de administração dos 4 slots */
export async function fetchAdminShowcase(catalog?: Product[]): Promise<AdminShowcaseSlot[]> {
  try {
    const data = await fetchApi<AdminShowcaseSlot[]>('/admin/showcase');
    if (Array.isArray(data) && data.length > 0) {
      return data;
    }
  } catch (err) {
    console.warn('API /admin/showcase falhou, usando slots locais:', err);
  }

  // Gera slots admin a partir dos produtos locais
  const fallback = getDefaultPublicShowcase(catalog);
  return [
    ...fallback.slots.map(s => ({
      slotNumber: s.slotNumber,
      productId: s.productId,
      productName: s.name,
      productCategory: s.category,
      productImageUrl: s.imageUrl,
      originalPrice: s.originalPrice,
      promotionalPrice: s.promotionalPrice,
      discountAmount: s.discountAmount,
      discountPercentage: s.discountPercentage,
      badgeLabel: s.badgeLabel || '🔥 OFERTA DESTAQUE DA OFICINA',
      allowCouponStacking: s.allowCouponStacking ?? false,
      isActive: true,
    })),
    {
      slotNumber: 4,
      isActive: true,
      badgeLabel: '❓ DROP MISTERIOSO',
      mysteryTitle: fallback.mysteryDrop.title,
      mysterySubtitle: fallback.mysteryDrop.subtitle,
      mysteryCategory: fallback.mysteryDrop.category,
      mysteryImageUrl: fallback.mysteryDrop.imageUrl,
      mysteryWhatsappText: fallback.mysteryDrop.whatsappText,
    },
  ];
}

/** Atualiza um slot individual no backend */
export async function updateShowcaseSlot(
  slotNumber: number,
  request: ShowcaseSlotUpdateRequest
): Promise<AdminShowcaseSlot> {
  const result = await fetchApi<AdminShowcaseSlot>(`/admin/showcase/slot/${slotNumber}`, {
    method: 'PUT',
    body: JSON.stringify(request),
  });

  // Dispara evento para sincronizar componentes na tela
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('forja_showcase_updated'));
  }

  return result;
}
