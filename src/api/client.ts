const getBaseUrl = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('forja_api_url');
  }
  const envUrl = import.meta.env.VITE_API_URL;
  if (envUrl) return envUrl.replace(/\/+$/, '');
  return 'https://forja-backend-1.onrender.com/api/v1';
};

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const baseUrl = getBaseUrl();
  const path = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${path}`;

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });

  if (!response.ok) {
    let errorMsg = `Erro ${response.status}: ${response.statusText || 'Falha na requisição'}`;
    try {
      const text = await response.text();
      try {
        const json = JSON.parse(text);
        if (json.message) errorMsg = json.message;
        else if (json.error) errorMsg = json.error;
      } catch {
        if (text && text.length < 200) errorMsg += ` - ${text}`;
      }
    } catch {
      // ignore
    }
    throw new Error(errorMsg);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : {} as T;
}
