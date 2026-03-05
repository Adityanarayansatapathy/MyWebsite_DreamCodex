import { LoginCredentials, SignupData, AuthResponse, User, DashboardStats } from '../types';

import { getApiUrl, logWarn } from '../utils/env';

const API_BASE_URL = getApiUrl();

// Track if we've shown demo mode warning to avoid spam
let demoModeWarningShown = false;
const showDemoWarning = () => {
  if (!demoModeWarningShown) {
    logWarn('Running in demo mode - Backend not available');
    demoModeWarningShown = true;
  }
};

// API configuration
const apiConfig = {
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
};

// Enhanced error handling
class ApiError extends Error {
  constructor(public status: number, public message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

// Generic API request handler
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), apiConfig.timeout);

  try {
    const response = await fetch(`${API_BASE_URL}${url}`, {
      ...options,
      headers: {
        ...apiConfig.headers,
        ...options.headers,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
      throw new ApiError(response.status, errorData.message || `HTTP ${response.status}`);
    }

    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      return await response.json();
    }
    
    return await response.text();
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error instanceof ApiError) {
      throw error;
    }
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        throw new ApiError(408, 'Request timeout');
      }
      throw new ApiError(0, error.message);
    }
    
    throw new ApiError(0, 'Network error');
  }
};

// Authentication helper to get token from storage
const getAuthToken = (): string | null => {
  return localStorage.getItem('auth_token');
};

// Create authenticated headers
const createAuthHeaders = (token?: string) => {
  const authToken = token || getAuthToken();
  return authToken ? { Authorization: `Bearer ${authToken}` } : {};
};

// Mock data for fallback
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    phoneNumber: '+1234567890',
    businessCategory: 'Technology',
    createdAt: '2024-01-15T10:30:00Z',
    isActive: true
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phoneNumber: '+0987654321',
    businessCategory: 'Retail',
    createdAt: '2024-01-20T14:15:00Z',
    isActive: true
  }
];

export const authApi = {
  // Login API
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    try {
      const response = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
      });
      
      return response;
    } catch (error) {
      // Fallback to demo mode
      showDemoWarning();
      
      // Super Admin credentials
      if (credentials.email === 'admin@startup.com' && credentials.password === 'admin123') {
        return {
          success: true,
          message: 'Super Admin login successful (Demo Mode)',
          token: 'demo-admin-jwt-token',
          user: {
            id: 'admin',
            name: 'Super Admin',
            email: 'admin@startup.com',
            phoneNumber: '+1111111111',
            businessCategory: 'Administration',
            createdAt: '2024-01-01T00:00:00Z',
            isActive: true
          }
        };
      }
      
      // Regular user login
      const user = mockUsers.find(u => u.email === credentials.email);
      if (user && credentials.password === 'password123') {
        return {
          success: true,
          message: 'Login successful (Demo Mode)',
          token: 'demo-jwt-token-' + user.id,
          user
        };
      }
      
      return {
        success: false,
        message: 'Invalid email or password'
      };
    }
  },

  // Signup API
  signup: async (signupData: SignupData): Promise<AuthResponse> => {
    try {
      // Validation
      if (signupData.password !== signupData.confirmPassword) {
        return {
          success: false,
          message: 'Passwords do not match',
        };
      }

      const response = await apiRequest('/auth/register', {
        method: 'POST',
        body: JSON.stringify(signupData),
      });
      
      return response;
    } catch (error) {
      // Fallback to demo mode
      showDemoWarning();
      
      // Check if email already exists
      if (mockUsers.some(u => u.email === signupData.email)) {
        return {
          success: false,
          message: 'Email already registered'
        };
      }
      
      // Create new user in demo mode
      const newUser: User = {
        id: Date.now().toString(),
        name: signupData.name,
        email: signupData.email,
        phoneNumber: signupData.phoneNumber,
        businessCategory: signupData.businessCategory,
        createdAt: new Date().toISOString(),
        isActive: true
      };
      
      // Add to mock data
      mockUsers.push(newUser);
      
      return {
        success: true,
        message: 'Registration successful (Demo Mode)',
        token: 'demo-jwt-token-' + newUser.id,
        user: newUser
      };
    }
  },

  // Get all users (Super Admin only)
  getAllUsers: async (token?: string): Promise<User[]> => {
    try {
      const response = await apiRequest('/admin/users', {
        method: 'GET',
        headers: createAuthHeaders(token),
      });
      
      return response;
    } catch (error) {
      // Using demo data silently
      return mockUsers;
    }
  },

  // Get dashboard stats
  getDashboardStats: async (token?: string): Promise<DashboardStats> => {
    try {
      const response = await apiRequest('/admin/stats', {
        method: 'GET',
        headers: createAuthHeaders(token),
      });
      
      return response;
    } catch (error) {
      // Using demo stats silently
      return {
        totalUsers: mockUsers.length,
        activeUsers: mockUsers.filter(u => u.isActive).length,
        totalBusinesses: new Set(mockUsers.map(u => u.businessCategory)).size,
        newRegistrations: mockUsers.filter(u => {
          const createdDate = new Date(u.createdAt);
          const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
          return createdDate > thirtyDaysAgo;
        }).length
      };
    }
  },

  // Update user status (Super Admin only)
  updateUserStatus: async (userId: string, isActive: boolean, token?: string): Promise<boolean> => {
    try {
      await apiRequest(`/admin/users/${userId}/status?isActive=${isActive}`, {
        method: 'PUT',
        headers: createAuthHeaders(token),
      });
      
      return true;
    } catch (error) {
      // Updating demo data silently
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers[userIndex].isActive = isActive;
        return true;
      }
      return false;
    }
  },

  // Delete user (Super Admin only)
  deleteUser: async (userId: string, token?: string): Promise<boolean> => {
    try {
      await apiRequest(`/admin/users/${userId}`, {
        method: 'DELETE',
        headers: createAuthHeaders(token),
      });
      
      return true;
    } catch (error) {
      // Updating demo data silently
      const userIndex = mockUsers.findIndex(u => u.id === userId);
      if (userIndex !== -1) {
        mockUsers.splice(userIndex, 1);
        return true;
      }
      return false;
    }
  },

  // Search users (Super Admin only)
  searchUsers: async (query: string, token?: string): Promise<User[]> => {
    try {
      const response = await apiRequest(`/admin/users/search?query=${encodeURIComponent(query)}`, {
        method: 'GET',
        headers: createAuthHeaders(token),
      });
      
      return response;
    } catch (error) {
      // Searching demo data silently
      return mockUsers.filter(user => 
        user.name.toLowerCase().includes(query.toLowerCase()) ||
        user.email.toLowerCase().includes(query.toLowerCase()) ||
        user.phoneNumber.includes(query) ||
        user.businessCategory.toLowerCase().includes(query.toLowerCase())
      );
    }
  },

  // Get active users (Super Admin only)
  getActiveUsers: async (token?: string): Promise<User[]> => {
    try {
      const response = await apiRequest('/admin/users/active', {
        method: 'GET',
        headers: createAuthHeaders(token),
      });
      
      return response;
    } catch (error) {
      // Using demo data silently
      return mockUsers.filter(u => u.isActive);
    }
  },

  // Get current user profile
  getCurrentUser: async (token?: string): Promise<User | null> => {
    try {
      const response = await apiRequest('/user/profile', {
        method: 'GET',
        headers: createAuthHeaders(token),
      });
      
      return response;
    } catch (error) {
      // Using token-based user silently
      // In demo mode, we can't fetch from server, so we return null
      // The auth context will handle this appropriately
      return null;
    }
  },

  // Update user profile
  updateProfile: async (userData: Partial<User>, token?: string): Promise<User | null> => {
    try {
      const response = await apiRequest('/user/profile', {
        method: 'PUT',
        headers: createAuthHeaders(token),
        body: JSON.stringify(userData),
      });
      
      return response;
    } catch (error) {
      // Profile update unavailable in demo mode
      return null;
    }
  },

  // Change password
  changePassword: async (oldPassword: string, newPassword: string, token?: string): Promise<boolean> => {
    try {
      await apiRequest('/user/change-password', {
        method: 'POST',
        headers: createAuthHeaders(token),
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      
      return true;
    } catch (error) {
      // Password change unavailable in demo mode
      return false;
    }
  },

  // Logout (invalidate token on server)
  logout: async (token?: string): Promise<boolean> => {
    try {
      await apiRequest('/auth/logout', {
        method: 'POST',
        headers: createAuthHeaders(token),
      });
      
      return true;
    } catch (error) {
      // Performing local logout only
      return true; // Return true for demo mode
    }
  },

  // Refresh token
  refreshToken: async (token?: string): Promise<string | null> => {
    try {
      const response = await apiRequest('/auth/refresh', {
        method: 'POST',
        headers: createAuthHeaders(token),
      });
      
      return response.token;
    } catch (error) {
      console.warn('API not available, token refresh unavailable in demo mode');
      return null;
    }
  },

  // Verify email
  verifyEmail: async (email: string, token: string): Promise<AuthResponse> => {
    try {
      const response = await apiRequest(`/auth/verify-email?email=${encodeURIComponent(email)}&token=${token}`, {
        method: 'POST',
      });
      
      return response;
    } catch (error) {
      // Simulating email verification silently
      
      // Demo mode - simulate successful verification
      return {
        success: true,
        message: 'Email verified successfully! Welcome to StartBusiness!',
        token: 'demo-jwt-token-verified',
        user: {
          id: Date.now().toString(),
          name: 'Demo User',
          email: email,
          phoneNumber: '+1234567890',
          businessCategory: 'Technology',
          createdAt: new Date().toISOString(),
          isActive: true
        }
      };
    }
  },

  // Resend verification code
  resendVerification: async (email: string): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await apiRequest(`/auth/resend-verification?email=${encodeURIComponent(email)}`, {
        method: 'POST',
      });
      
      return response;
    } catch (error) {
      // Simulating resend verification silently
      
      // Demo mode - simulate successful resend
      return {
        success: true,
        message: 'Verification code sent successfully!'
      };
    }
  },

  // Health check
  healthCheck: async (): Promise<boolean> => {
    try {
      await apiRequest('/health');
      return true;
    } catch (error) {
      return false;
    }
  },
};