// API client for our custom backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export type ApiErrorType = 'network' | 'auth' | 'client' | 'server';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly type: ApiErrorType,
    public readonly status?: number
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  fullName?: string;
  displayName?: string;
  phone?: string;
  nit?: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    _retry = false
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = this.getAccessToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    let response: Response;
    try {
      response = await fetch(url, config);
    } catch {
      throw new ApiError(
        'No se pudo conectar al servidor. Verifica tu conexión o intenta más tarde.',
        'network'
      );
    }

    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message = body?.message || `Error ${response.status}`;
      const type: ApiErrorType =
        response.status === 401 || response.status === 403
          ? 'auth'
          : response.status >= 500
            ? 'server'
            : 'client';
      const error = new ApiError(message, type, response.status);

      // Token refresh interceptor: si el token expiró y no es un endpoint de
      // auth ni ya reintentamos, intentar refrescar y reintentar el request.
      const isAuthEndpoint = endpoint.startsWith('/auth/');
      if (type === 'auth' && response.status === 401 && !isAuthEndpoint && !_retry) {
        try {
          await this.refresh();
          return this.request<T>(endpoint, options, true);
        } catch {
          this.clearTokens();
          throw error;
        }
      }

      throw error;
    }

    return response.json();
  }

  private getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('accessToken');
  }

  private setTokens(tokens: AuthTokens): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem('accessToken', tokens.accessToken);
    localStorage.setItem('refreshToken', tokens.refreshToken);
  }

  private clearTokens(): void {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }

  // Auth methods
  async register(params: {
    email: string;
    password: string;
    fullName?: string;
    displayName?: string;
    phone?: string;
    nit?: string;
    role?: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await this.request<{ user: User; tokens: AuthTokens }>(
      '/auth/register',
      {
        method: 'POST',
        body: JSON.stringify(params),
      }
    );
    this.setTokens(result.tokens);
    return result;
  }

  async login(credentials: {
    email: string;
    password: string;
  }): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await this.request<{ user: User; tokens: AuthTokens }>(
      '/auth/login',
      {
        method: 'POST',
        body: JSON.stringify(credentials),
      }
    );
    this.setTokens(result.tokens);
    return result;
  }

  async refresh(): Promise<AuthTokens> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    const result = await this.request<AuthTokens>('/auth/refresh', {
      method: 'POST',
      body: JSON.stringify({ refreshToken }),
    });
    this.setTokens(result);
    return result;
  }

  async logout(): Promise<void> {
    const refreshToken = localStorage.getItem('refreshToken');
    if (refreshToken) {
      try {
        await this.request('/auth/logout', {
          method: 'POST',
          body: JSON.stringify({ refreshToken }),
        });
      } catch (error) {
        // Ignore logout errors
      }
    }
    this.clearTokens();
  }

  async getCurrentUser(): Promise<User> {
    const result = await this.request<{ user: User }>('/auth/me');
    return result.user;
  }

  // Properties methods
  async getProperties(): Promise<any[]> {
    return this.request<any[]>('/properties');
  }

  async createProperty(property: any): Promise<any> {
    return this.request<any>('/properties', {
      method: 'POST',
      body: JSON.stringify(property),
    });
  }

  async getProperty(id: string): Promise<any> {
    return this.request<any>(`/properties/${id}`);
  }

  async updateProperty(id: string, property: any): Promise<any> {
    return this.request<any>(`/properties/${id}`, {
      method: 'PUT',
      body: JSON.stringify(property),
    });
  }

  async deleteProperty(id: string): Promise<void> {
    return this.request<void>(`/properties/${id}`, {
      method: 'DELETE',
    });
  }

  // Units methods
  async getUnits(): Promise<any[]> {
    return this.request<any[]>('/units');
  }

  async createUnit(unit: any): Promise<any> {
    return this.request<any>('/units', {
      method: 'POST',
      body: JSON.stringify(unit),
    });
  }

  async createUnits(units: any[]): Promise<any[]> {
    const createdUnits = [];
    for (const unit of units) {
      const created = await this.createUnit(unit);
      createdUnits.push(created);
    }
    return createdUnits;
  }

  async getUnit(id: string): Promise<any> {
    return this.request<any>(`/units/${id}`);
  }

  async updateUnit(id: string, unit: any): Promise<any> {
    return this.request<any>(`/units/${id}`, {
      method: 'PUT',
      body: JSON.stringify(unit),
    });
  }

  async deleteUnit(id: string): Promise<void> {
    return this.request<void>(`/units/${id}`, {
      method: 'DELETE',
    });
  }

  // Announcements methods
  async getAnnouncements(): Promise<any[]> {
    return this.request<any[]>('/announcements');
  }

  async createAnnouncement(announcement: any): Promise<any> {
    return this.request<any>('/announcements', {
      method: 'POST',
      body: JSON.stringify(announcement),
    });
  }

  // Payments methods
  async getPayments(): Promise<any[]> {
    return this.request<any[]>('/payments');
  }

  async createPayment(payment: any): Promise<any> {
    return this.request<any>('/payments', {
      method: 'POST',
      body: JSON.stringify(payment),
    });
  }

  // Password recovery methods
  async forgotPassword(email: string): Promise<{ message: string }> {
    return this.post('/auth/forgot-password', { email });
  }

  async resetPassword(token: string, password: string): Promise<{ message: string }> {
    return this.post('/auth/reset-password', { token, password });
  }

  // OTP methods
  async requestOtp(email: string): Promise<{ maskedPhone: string }> {
    return this.request('/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOtp(email: string, code: string): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await this.request<{ user: User; tokens: AuthTokens }>('/auth/otp/verify', {
      method: 'POST',
      body: JSON.stringify({ email, code }),
    });
    this.setTokens(result.tokens);
    return result;
  }

  // Generic CRUD methods
  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint);
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string): Promise<void> {
    return this.request<void>(endpoint, {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export type { AuthTokens, User };
