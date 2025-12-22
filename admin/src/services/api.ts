import axios from 'axios';
import type { AxiosError, AxiosInstance } from 'axios';
import type {
  AuthResponse,
  LoginCredentials,
  User,
  MenuItem,
  CreateMenuItem,
  UpdateMenuItem,
  Booking,
  UpdateBooking,
  BlockedSlot,
  CreateBlockedSlot,
  PaginatedResponse,
  Role,
} from '../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

class ApiService {
  private api: AxiosInstance;

  constructor() {
    this.api = axios.create({
      baseURL: API_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add auth token to requests
    this.api.interceptors.request.use((config) => {
      const token = localStorage.getItem('accessToken');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    });

    // Handle 401 errors
    this.api.interceptors.response.use(
      (response) => response,
      (error: AxiosError) => {
        if (error.response?.status === 401) {
          const url = error.config?.url || '';
          
          // Não redireciona para login em:
          // - Erros de verificação de senha (change-password)
          // - Erros de login (auth/login)
          const isPasswordChange = url.includes('change-password');
          const isLoginAttempt = url.includes('auth/login');
          
          if (!isPasswordChange && !isLoginAttempt) {
            localStorage.removeItem('accessToken');
            window.location.href = '/login';
          }
        }
        return Promise.reject(error);
      }
    );
  }

  // Auth
  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    const { data } = await this.api.post<AuthResponse>('/auth/login', credentials);
    localStorage.setItem('accessToken', data.accessToken);
    return data;
  }

  async getProfile(): Promise<User> {
    const { data } = await this.api.get<User>('/auth/profile');
    return data;
  }

  logout(): void {
    localStorage.removeItem('accessToken');
  }

  async changePassword(currentPassword: string, newPassword: string): Promise<{ message: string }> {
    const { data } = await this.api.patch<{ message: string }>('/auth/change-password', {
      currentPassword,
      newPassword,
    });
    return data;
  }

  // Users
  async getUsers(params?: { page?: number; limit?: number; role?: Role }): Promise<PaginatedResponse<User>> {
    const { data } = await this.api.get<PaginatedResponse<User>>('/users', { params });
    return data;
  }

  async createUser(user: { name: string; email: string; password: string; role: Role }): Promise<User> {
    const { data } = await this.api.post<User>('/users', user);
    return data;
  }

  async updateUser(id: string, updates: Partial<User & { password?: string }>): Promise<User> {
    const { data } = await this.api.put<User>(`/users/${id}`, updates);
    return data;
  }

  async deleteUser(id: string): Promise<void> {
    await this.api.delete(`/users/${id}`);
  }

  // Menu
  async getMenuItems(params?: { category?: string; featured?: boolean }): Promise<MenuItem[]> {
    const { data } = await this.api.get<{ data: MenuItem[]; total: number } | MenuItem[]>('/menu', { params });
    // Handle both array and paginated response formats
    if (Array.isArray(data)) {
      return data;
    }
    return data.data;
  }

  async createMenuItem(item: CreateMenuItem): Promise<MenuItem> {
    const { data } = await this.api.post<MenuItem>('/menu', item);
    return data;
  }

  async updateMenuItem(id: string, updates: UpdateMenuItem): Promise<MenuItem> {
    const { data } = await this.api.put<MenuItem>(`/menu/${id}`, updates);
    return data;
  }

  async deleteMenuItem(id: string): Promise<void> {
    await this.api.delete(`/menu/${id}`);
  }

  async getMenuImages(): Promise<string[]> {
    const { data } = await this.api.get<{ images: string[] }>('/menu/images');
    return data.images;
  }

  // Bookings
  async getBookings(params?: {
    page?: number;
    limit?: number;
    date?: string;
    status?: string;
  }): Promise<PaginatedResponse<Booking>> {
    const { data } = await this.api.get<PaginatedResponse<Booking>>('/bookings', { params });
    return data;
  }

  async updateBooking(id: string, updates: UpdateBooking): Promise<Booking> {
    const { data } = await this.api.put<Booking>(`/bookings/${id}`, updates);
    return data;
  }

  async updateBookingStatus(id: string, status: string): Promise<Booking> {
    const { data } = await this.api.patch<Booking>(`/bookings/${id}/status`, { status });
    return data;
  }

  async deleteBooking(id: string): Promise<void> {
    await this.api.delete(`/bookings/${id}`);
  }

  // Blocked Slots
  async getBlockedSlots(params?: { date?: string }): Promise<BlockedSlot[]> {
    const { data } = await this.api.get<{ data: BlockedSlot[]; total: number } | BlockedSlot[]>('/blocked-slots', { params });
    // Handle both array and paginated response formats
    if (Array.isArray(data)) {
      return data;
    }
    return data.data;
  }

  async createBlockedSlot(slot: CreateBlockedSlot): Promise<BlockedSlot> {
    const { data } = await this.api.post<BlockedSlot>('/blocked-slots', slot);
    return data;
  }

  async blockDay(date: string, reason?: string): Promise<BlockedSlot[]> {
    const { data } = await this.api.post<BlockedSlot[]>('/blocked-slots/block-day', { date, reason });
    return data;
  }

  async deleteBlockedSlot(id: string): Promise<void> {
    await this.api.delete(`/blocked-slots/${id}`);
  }

  // Dashboard Stats
  async getDashboardStats(): Promise<{
    todayBookings: number;
    weekBookings: number;
    monthBookings: number;
    pendingBookings: number;
  }> {
    // This will be implemented in the backend later
    // For now, we'll calculate from existing endpoints
    const today = new Date().toISOString().split('T')[0];
    const bookings = await this.getBookings({ limit: 1000 });
    
    const todayBookings = bookings.data.filter(b => b.date.startsWith(today)).length;
    const pendingBookings = bookings.data.filter(b => b.status === 'PENDING').length;
    
    return {
      todayBookings,
      weekBookings: bookings.data.length, // Simplified
      monthBookings: bookings.total,
      pendingBookings,
    };
  }
}

export const api = new ApiService();
export default api;

