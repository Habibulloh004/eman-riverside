const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8090';
const PROXY_URL = '/api/proxy';

const getBaseUrl = () => (typeof window === 'undefined' ? API_URL : PROXY_URL);

interface RequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
}

class ApiClient {
  private token: string | null = null;
  private refreshPromise: Promise<string> | null = null;

  setToken(token: string | null) {
    this.token = token;
  }

  getToken() {
    return this.token;
  }

  private async refreshToken(): Promise<string> {
    // Deduplicate concurrent refresh calls
    if (this.refreshPromise) return this.refreshPromise;

    this.refreshPromise = (async () => {
      try {
      const response = await fetch(`${getBaseUrl()}/api/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (!response.ok) throw new Error('Refresh failed');

        const data = await response.json();
        this.token = data.token;
        localStorage.setItem('token', data.token);
        return data.token;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  async request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
    const { method = 'GET', body, headers = {} } = options;

    const requestHeaders: Record<string, string> = {
      'Content-Type': 'application/json',
      ...headers,
    };

    if (this.token) {
      requestHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      method,
      headers: requestHeaders,
      body: body ? JSON.stringify(body) : undefined,
      credentials: 'include',
    });

    // Auto-refresh on 401 and retry once
    if (response.status === 401 && !endpoint.includes('/auth/')) {
      try {
        const newToken = await this.refreshToken();
        const retryHeaders = { ...requestHeaders, Authorization: `Bearer ${newToken}` };
        const retryResponse = await fetch(`${getBaseUrl()}${endpoint}`, {
          method,
          headers: retryHeaders,
          body: body ? JSON.stringify(body) : undefined,
          credentials: 'include',
        });

        if (!retryResponse.ok) {
          const error = await retryResponse.json().catch(() => ({ message: 'Request failed' }));
          throw new Error(error.message || 'Request failed');
        }

        return retryResponse.json();
      } catch {
        // Refresh failed — clear auth and throw
        localStorage.removeItem('token');
        this.token = null;
        throw new Error('Session expired');
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Request failed' }));
      throw new Error(error.message || 'Request failed');
    }

    return response.json();
  }

  async upload(endpoint: string, file: File): Promise<{ url: string; path: string }> {
    const formData = new FormData();
    formData.append('file', file);

    const requestHeaders: Record<string, string> = {};
    if (this.token) {
      requestHeaders['Authorization'] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${getBaseUrl()}${endpoint}`, {
      method: 'POST',
      headers: requestHeaders,
      body: formData,
      credentials: 'include',
    });

    // Auto-refresh on 401 for uploads too
    if (response.status === 401) {
      try {
        const newToken = await this.refreshToken();
        const retryHeaders: Record<string, string> = { Authorization: `Bearer ${newToken}` };
        const retryFormData = new FormData();
        retryFormData.append('file', file);
        const retryResponse = await fetch(`${getBaseUrl()}${endpoint}`, {
          method: 'POST',
          headers: retryHeaders,
          body: retryFormData,
          credentials: 'include',
        });

        if (!retryResponse.ok) {
          const error = await retryResponse.json().catch(() => ({ message: 'Upload failed' }));
          throw new Error(error.message || 'Upload failed');
        }

        return retryResponse.json();
      } catch {
        localStorage.removeItem('token');
        this.token = null;
        throw new Error('Session expired');
      }
    }

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: 'Upload failed' }));
      throw new Error(error.message || 'Upload failed');
    }

    return response.json();
  }

  get<T>(endpoint: string) {
    return this.request<T>(endpoint);
  }

  post<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'POST', body });
  }

  put<T>(endpoint: string, body?: unknown) {
    return this.request<T>(endpoint, { method: 'PUT', body });
  }

  delete<T>(endpoint: string) {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
export default apiClient;
