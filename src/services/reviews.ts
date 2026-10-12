import { fetchApi } from '@/api/client';

export interface CustomerReview {
  id: number;
  customerName: string;
  rating: number;
  comment: string;
  productName: string;
  customerCity?: string | null;
  isApproved: boolean;
  createdAt: string;
}

export interface ReviewSubmitPayload {
  customerName: string;
  rating: number;
  comment: string;
  productName: string;
  customerCity?: string;
}

const STORAGE_KEY = 'forja_reviews_v1';

export function getStoredReviews(): CustomerReview[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {}
  return []; // Sem mocks ou avaliações falsas
}

export function saveStoredReviews(reviews: CustomerReview[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(reviews));
    window.dispatchEvent(new Event('forja_reviews_updated'));
  } catch (e) {}
}

/**
 * Busca avaliações públicas aprovadas (para a vitrine da loja)
 */
export async function fetchPublicReviews(): Promise<CustomerReview[]> {
  try {
    const data = await fetchApi<CustomerReview[]>('/reviews/public');
    if (Array.isArray(data)) {
      return data;
    }
  } catch (err) {
    console.warn('API /reviews/public offline, verificando cache local:', err);
  }

  // Fallback para avaliações locais que foram aprovadas
  return getStoredReviews().filter(r => r.isApproved);
}

/**
 * Submissão de avaliação pelo cliente na vitrine
 */
export async function submitCustomerReview(payload: ReviewSubmitPayload): Promise<CustomerReview> {
  const localReview: CustomerReview = {
    id: Date.now(),
    customerName: payload.customerName.trim(),
    rating: payload.rating,
    comment: payload.comment.trim(),
    productName: payload.productName.trim(),
    customerCity: payload.customerCity?.trim() || null,
    isApproved: false,
    createdAt: new Date().toISOString()
  };

  try {
    const res = await fetchApi<CustomerReview>('/reviews/submit', {
      method: 'POST',
      body: JSON.stringify(payload)
    });
    if (res && res.id) {
      // Salva no cache local para backup
      const current = getStoredReviews();
      saveStoredReviews([res, ...current.filter(r => r.id !== res.id)]);
      return res;
    }
  } catch (err) {
    console.warn('API de reviews indisponível para envio remoto, guardando localmente:', err);
  }

  const current = getStoredReviews();
  saveStoredReviews([localReview, ...current]);
  return localReview;
}

/**
 * Busca todas as avaliações para o painel administrativo
 */
export async function fetchAdminReviews(status: string = 'ALL'): Promise<CustomerReview[]> {
  try {
    const data = await fetchApi<CustomerReview[]>(`/admin/reviews?status=${status}`);
    if (Array.isArray(data)) {
      saveStoredReviews(data);
      return data;
    }
  } catch (err) {
    console.warn('API /admin/reviews indisponível, usando armazenamento local:', err);
  }

  const stored = getStoredReviews();
  if (status === 'PENDING') return stored.filter(r => !r.isApproved);
  if (status === 'APPROVED') return stored.filter(r => r.isApproved);
  return stored;
}

/**
 * Aprova ou oculta uma avaliação no site
 */
export async function toggleReviewApproval(id: number): Promise<CustomerReview> {
  let updatedReview: CustomerReview | null = null;

  try {
    updatedReview = await fetchApi<CustomerReview>(`/admin/reviews/${id}/toggle-approval`, {
      method: 'PATCH'
    });
  } catch (err) {
    console.warn('Erro ao alternar aprovação via API, atualizando localmente:', err);
  }

  const current = getStoredReviews();
  const next = current.map(r => {
    if (r.id === id) {
      return updatedReview || { ...r, isApproved: !r.isApproved };
    }
    return r;
  });

  saveStoredReviews(next);
  return updatedReview || next.find(r => r.id === id)!;
}

/**
 * Remove uma avaliação
 */
export async function deleteReview(id: number): Promise<void> {
  try {
    await fetchApi(`/admin/reviews/${id}`, { method: 'DELETE' });
  } catch (err) {
    console.warn('Erro ao deletar avaliação via API:', err);
  }

  const current = getStoredReviews();
  saveStoredReviews(current.filter(r => r.id !== id));
}
