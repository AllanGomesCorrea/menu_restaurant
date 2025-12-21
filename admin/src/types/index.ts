// User types
export type Role = 'ADMIN' | 'SUPERVISOR';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

// Menu types
export type MenuCategory = 'ENTRADAS' | 'PRATOS' | 'SOBREMESAS' | 'BEBIDAS';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  featured: boolean;
  available: boolean;
  imageUrl?: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItem {
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  featured?: boolean;
  available?: boolean;
  imageUrl?: string;
  sortOrder?: number;
}

export interface UpdateMenuItem extends Partial<CreateMenuItem> {}

// Booking types
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED';
export type BookingEnvironment = 'INDOOR' | 'OUTDOOR';

export interface Booking {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  environment: BookingEnvironment;
  guests: number;
  observations?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateBooking {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  date: string;
  timeSlot: string;
  environment: BookingEnvironment;
  guests: number;
  observations?: string;
}

export interface UpdateBooking extends Partial<CreateBooking> {
  status?: BookingStatus;
}

// Blocked Slot types
export interface BlockedSlot {
  id: string;
  date: string;
  timeSlot?: string;
  environment?: BookingEnvironment;
  reason?: string;
  createdAt: string;
}

export interface CreateBlockedSlot {
  date: string;
  timeSlot?: string;
  environment?: BookingEnvironment;
  reason?: string;
}

// API Response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

// Dashboard stats
export interface DashboardStats {
  todayBookings: number;
  weekBookings: number;
  monthBookings: number;
  pendingBookings: number;
  totalMenuItems: number;
  activeMenuItems: number;
}

