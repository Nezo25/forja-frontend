const API_URL = import.meta.env.VITE_API_URL || 'https://forja-backend.onrender.com/api/v1';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(API_URL + endpoint, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    throw new Error('Erro na API: ' + response.statusText);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {} as T;
}
