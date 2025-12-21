/**
 * Serviço de API para comunicação com o backend
 * Centraliza todas as requisições HTTP
 */

// URL base da API - usar variável de ambiente em produção
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Classe de erro customizada para erros da API
 */
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public data?: unknown
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

/**
 * Faz requisições HTTP para a API
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  };

  // Adiciona token de autenticação se existir
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${token}`,
    };
  }

  try {
    const response = await fetch(url, config);

    // Se não houver conteúdo (204 No Content)
    if (response.status === 204) {
      return {} as T;
    }

    const data = await response.json();

    if (!response.ok) {
      throw new ApiError(
        data.message || 'Erro na requisição',
        response.status,
        data
      );
    }

    return data as T;
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError('Erro de conexão com o servidor', 0, error);
  }
}

// ========== TIPOS DA API ==========

export type MenuCategory = 'ENTRADAS' | 'PRATOS' | 'SOBREMESAS' | 'BEBIDAS';
export type BookingEnvironment = 'INDOOR' | 'OUTDOOR';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';

export interface ApiMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  featured: boolean;
  available: boolean;
  imageUrl: string | null;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface ApiMenuResponse {
  data: ApiMenuItem[];
  total: number;
}

export interface ApiMenuByCategory {
  entradas: ApiMenuItem[];
  pratos: ApiMenuItem[];
  sobremesas: ApiMenuItem[];
  bebidas: ApiMenuItem[];
}

export interface ApiTimeSlot {
  time: string;
  availableIndoor: boolean;
  availableOutdoor: boolean;
}

export interface ApiAvailabilityResponse {
  date: string;
  isWeekend: boolean;
  timeSlots: ApiTimeSlot[];
}

export interface ApiBookingRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string; // YYYY-MM-DD
  timeSlot: string; // HH:mm
  environment: BookingEnvironment;
  guests: number;
  observations?: string;
}

export interface ApiBookingResponse {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  environment: BookingEnvironment;
  guests: number;
  observations: string | null;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

// ========== ENDPOINTS DO MENU ==========

export const menuApi = {
  /**
   * Buscar todos os itens do cardápio
   */
  getAll: (params?: { category?: MenuCategory; featured?: boolean }) => {
    const searchParams = new URLSearchParams();
    if (params?.category) searchParams.set('category', params.category);
    if (params?.featured !== undefined) searchParams.set('featured', String(params.featured));

    const query = searchParams.toString();
    return request<ApiMenuResponse>(`/menu${query ? `?${query}` : ''}`);
  },

  /**
   * Buscar itens agrupados por categoria
   */
  getByCategory: () => {
    return request<ApiMenuByCategory>('/menu/by-category');
  },

  /**
   * Buscar itens em destaque
   */
  getFeatured: () => {
    return request<ApiMenuItem[]>('/menu/featured');
  },

  /**
   * Buscar item por ID
   */
  getById: (id: string) => {
    return request<ApiMenuItem>(`/menu/${id}`);
  },
};

// ========== ENDPOINTS DE RESERVAS ==========

export const bookingsApi = {
  /**
   * Verificar disponibilidade de horários para uma data
   */
  checkAvailability: (date: string) => {
    return request<ApiAvailabilityResponse>(`/bookings/availability?date=${date}`);
  },

  /**
   * Criar nova reserva
   */
  create: (booking: ApiBookingRequest) => {
    return request<ApiBookingResponse>('/bookings', {
      method: 'POST',
      body: JSON.stringify(booking),
    });
  },
};

// ========== HEALTH CHECK ==========

export const healthApi = {
  check: () => {
    return request<{ status: string; database: string }>('/health');
  },
};

export default {
  menu: menuApi,
  bookings: bookingsApi,
  health: healthApi,
};

