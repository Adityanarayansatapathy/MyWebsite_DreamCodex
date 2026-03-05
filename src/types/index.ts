export interface User {
  id: string;
  name: string;
  email: string;
  phoneNumber: string;
  businessCategory: string;
  createdAt: string;
  updatedAt?: string;
  isActive: boolean;
  role?: 'USER' | 'ADMIN';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  name: string;
  businessCategory: string;
  email: string;
  phoneNumber: string;
  password: string;
  confirmPassword: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

export interface DashboardStats {
  totalUsers: number;
  activeUsers: number;
  totalBusinesses: number;
  newRegistrations: number;
  inactiveUsers?: number;
  recentLogins?: number;
  growthRate?: number;
}

export interface ApiError {
  status: number;
  message: string;
  details?: any;
}

export interface UserProfileUpdate {
  name?: string;
  phoneNumber?: string;
  businessCategory?: string;
}

export interface PasswordChangeRequest {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
}

export interface UserFilters {
  search?: string;
  businessCategory?: string;
  isActive?: boolean;
  sortBy?: 'name' | 'email' | 'createdAt' | 'businessCategory';
  sortOrder?: 'asc' | 'desc';
}

export interface BusinessMetrics {
  totalRevenue: number;
  monthlyGrowth: number;
  activeDeals: number;
  conversionRate: number;
  customerSatisfaction: number;
}

export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  description: string;
  timestamp: string;
  ipAddress?: string;
  userAgent?: string;
}

export interface NotificationPreferences {
  emailNotifications: boolean;
  smsNotifications: boolean;
  marketingEmails: boolean;
  securityAlerts: boolean;
}

export interface SystemSettings {
  maintenanceMode: boolean;
  registrationEnabled: boolean;
  maxUsers: number;
  sessionTimeout: number;
  passwordMinLength: number;
}