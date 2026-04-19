// API client for our custom backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api';

export type ApiErrorType = 'network' | 'auth' | 'client' | 'server' | 'subscription';

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
  avatarUrl?: string;
}

interface Subscription {
  id: string;
  propertyId: string;
  status: 'TRIAL' | 'ACTIVE' | 'BLOCKED';
  trialEndsAt: string;
  activatedAt?: string;
  createdAt: string;
  updatedAt: string;
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
        response.status === 402
          ? 'subscription'
          : response.status === 401 || response.status === 403
            ? 'auth'
            : response.status >= 500
              ? 'server'
              : 'client';
      const error = new ApiError(message, type, response.status);

      // Token refresh interceptor: si el token expiró y no es un endpoint de
      // auth ni ya reintentamos, intentar refrescar y reintentar el request.
      const isAuthEndpoint = endpoint.startsWith('/auth/');
      if (
        type === 'auth' &&
        response.status === 401 &&
        !isAuthEndpoint &&
        !_retry
      ) {
        try {
          await this.refresh();
          return this.request<T>(endpoint, options, true);
        } catch {
          this.clearTokens();
          throw error;
        }
      }

      // Broadcast subscription expiry so the dashboard layout can react
      if (type === 'subscription' && typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('subscription:expired'));
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

  async uploadAvatar(file: File): Promise<User> {
    const url = `${this.baseURL}/users/me/avatar`;
    const token = this.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const formData = new FormData();
    formData.append('avatar', file);
    let response: Response;
    try {
      response = await fetch(url, { method: 'POST', headers, body: formData });
    } catch {
      throw new ApiError('No se pudo conectar al servidor.', 'network');
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
      throw new ApiError(message, type, response.status);
    }
    const result = await response.json();
    return result.user ?? result;
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
    const res = await this.request<any>('/units/bulk', {
      method: 'POST',
      body: JSON.stringify({ units }),
    });
    return res?.data ?? res ?? [];
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

  async updateAnnouncement(id: string, announcement: any): Promise<any> {
    return this.request<any>(`/announcements/${id}`, {
      method: 'PUT',
      body: JSON.stringify(announcement),
    });
  }

  async deleteAnnouncement(id: string): Promise<void> {
    return this.request<void>(`/announcements/${id}`, {
      method: 'DELETE',
    });
  }

  // Zones methods
  async getZones(propertyId?: string): Promise<any[]> {
    const qs = propertyId ? `?propertyId=${propertyId}` : '';
    return this.request<any[]>(`/zones${qs}`);
  }

  async createZone(zone: any): Promise<any> {
    const formData = new FormData();
    Object.entries(zone).forEach(([k, v]) => {
      if (v instanceof File) formData.append(k, v);
      else if (v !== undefined && v !== null) formData.append(k, String(v));
    });
    const url = `${this.baseURL}/zones`;
    const token = this.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const response = await fetch(url, { method: 'POST', headers, body: formData });
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      throw new ApiError(body?.message || `Error ${response.status}`, 'client', response.status);
    }
    return response.json();
  }

  async updateZone(id: string, zone: any): Promise<any> {
    const url = `${this.baseURL}/zones/${id}`;
    const token = this.getAccessToken();
    const hasFile = Object.values(zone).some(v => v instanceof File);

    let headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    let body: BodyInit;
    if (hasFile) {
      const formData = new FormData();
      Object.entries(zone).forEach(([k, v]) => {
        if (v instanceof File) formData.append(k, v);
        else if (v !== undefined && v !== null) formData.append(k, String(v));
      });
      body = formData;
    } else {
      headers['Content-Type'] = 'application/json';
      body = JSON.stringify(zone);
    }

    const response = await fetch(url, { method: 'PUT', headers, body });
    if (!response.ok) {
      const resBody = await response.json().catch(() => ({}));
      throw new ApiError(resBody?.message || `Error ${response.status}`, 'client', response.status);
    }
    return response.json();
  }

  async deleteZone(id: string): Promise<void> {
    return this.request<void>(`/zones/${id}`, {
      method: 'DELETE',
    });
  }

  // Reservations methods
  async getReservations(params?: { propertyId?: string; zoneId?: string; unitId?: string; date?: string }): Promise<any[]> {
    const qs = params
      ? '?' + Object.entries(params).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join('&')
      : '';
    return this.request<any[]>(`/reservations${qs}`);
  }

  async createReservation(reservation: any): Promise<any> {
    return this.request<any>('/reservations', {
      method: 'POST',
      body: JSON.stringify(reservation),
    });
  }

  async updateReservation(id: string, reservation: any): Promise<any> {
    return this.request<any>(`/reservations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(reservation),
    });
  }

  async deleteReservation(id: string): Promise<void> {
    return this.request<void>(`/reservations/${id}`, {
      method: 'DELETE',
    });
  }

  // Documents methods
  async getDocuments(propertyId?: string, category?: string): Promise<any[]> {
    const params: string[] = [];
    if (propertyId) params.push(`propertyId=${propertyId}`);
    if (category) params.push(`category=${category}`);
    const qs = params.length ? `?${params.join('&')}` : '';
    return this.request<any[]>(`/documents${qs}`);
  }

  async createDocument(formData: FormData): Promise<any> {
    const url = `${this.baseURL}/documents`;
    const token = this.getAccessToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;
    let response: Response;
    try {
      response = await fetch(url, { method: 'POST', headers, body: formData });
    } catch {
      throw new ApiError('No se pudo conectar al servidor.', 'network');
    }
    if (!response.ok) {
      const body = await response.json().catch(() => ({}));
      const message = body?.message || `Error ${response.status}`;
      const type: ApiErrorType = response.status === 401 || response.status === 403 ? 'auth' : response.status >= 500 ? 'server' : 'client';
      throw new ApiError(message, type, response.status);
    }
    return response.json();
  }

  async deleteDocument(id: string): Promise<void> {
    return this.request<void>(`/documents/${id}`, {
      method: 'DELETE',
    });
  }

  // Units (with propertyId filter)
  async getUnitsForProperty(propertyId: string): Promise<any[]> {
    return this.request<any[]>(`/units?propertyId=${propertyId}`);
  }

  // Payments methods
  async getPayments(): Promise<any[]> {
    return this.request<any[]>('/payments');
  }

  // Invitations methods
  async getInvitations(status?: 'PENDING' | 'ACCEPTED' | 'EXPIRED' | 'CANCELLED' | 'ALL'): Promise<any[]> {
    const qs = status && status !== 'ALL' ? `?status=${status}` : '';
    const res = await this.request<any>(`/invitations${qs}`);
    return res?.data ?? res ?? [];
  }

  async createInvitation(invitation: {
    email: string;
    fullName?: string;
    phone?: string;
    unitNumber?: string;
    block?: string;
  }): Promise<any> {
    const res = await this.request<any>('/invitations', {
      method: 'POST',
      body: JSON.stringify(invitation),
    });
    return res?.data ?? res;
  }

  async createBulkInvitations(invitations: Array<{
    email: string;
    fullName?: string;
    phone?: string;
    unitNumber?: string;
    block?: string;
  }>): Promise<{
    succeeded: any[];
    failed: { row: number; email: string; reason: string }[];
    total: number;
    sent: number;
    failedCount: number;
  }> {
    const res = await this.request<any>('/invitations/bulk', {
      method: 'POST',
      body: JSON.stringify({ invitations }),
    });
    return res?.data ?? res;
  }

  async resendInvitation(id: string): Promise<any> {
    const res = await this.request<any>(`/invitations/${id}/resend`, { method: 'POST' });
    return res?.data ?? res;
  }

  async cancelInvitation(id: string): Promise<void> {
    return this.request<void>(`/invitations/${id}`, { method: 'DELETE' });
  }

  // Invitation acceptance (public — for residents coming from email link)
  async getInvitationByToken(token: string): Promise<{
    email: string;
    fullName: string | null;
    phone: string | null;
    propertyId: string;
    propertyName: string;
    towers: { name: string; units: { id: string; unitNumber: string; occupied: boolean }[] }[];
    expiresAt: string;
  }> {
    const res = await this.request<any>(`/auth/invitation/${token}`);
    return res?.data ?? res;
  }

  async acceptInvitation(payload: {
    token: string;
    fullName: string;
    phone: string;
    password: string;
    unitId: string;
    dataAuthorization: boolean;
    vehicles?: Array<{ plate: string; brand?: string; color?: string }>;
    pets?: Array<{ type: 'DOG' | 'CAT' | 'BIRD' | 'FISH' | 'OTHER'; name: string }>;
    emergencyContact?: { name: string; phone: string };
  }): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await this.request<{ user: User; tokens: AuthTokens }>(
      '/auth/accept-invitation',
      {
        method: 'POST',
        body: JSON.stringify(payload),
      }
    );
    this.setTokens(result.tokens);
    return result;
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

  async resetPassword(
    token: string,
    password: string
  ): Promise<{ message: string }> {
    return this.post('/auth/reset-password', { token, password });
  }

  // OTP methods
  async requestOtp(email: string): Promise<{ maskedPhone: string }> {
    return this.request('/auth/otp/request', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }

  async verifyOtp(
    email: string,
    code: string
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const result = await this.request<{ user: User; tokens: AuthTokens }>(
      '/auth/otp/verify',
      {
        method: 'POST',
        body: JSON.stringify({ email, code }),
      }
    );
    this.setTokens(result.tokens);
    return result;
  }

  // Subscription methods
  async getMySubscription(): Promise<Subscription> {
    return this.request<Subscription>('/subscriptions/me');
  }

  async createCheckoutSession(): Promise<{ url: string }> {
    return this.request<{ url: string }>('/subscriptions/checkout', {
      method: 'POST',
    });
  }

  async createPortalSession(): Promise<{ url: string }> {
    return this.request<{ url: string }>('/subscriptions/portal', {
      method: 'POST',
    });
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
export type { AuthTokens, User, Subscription };
