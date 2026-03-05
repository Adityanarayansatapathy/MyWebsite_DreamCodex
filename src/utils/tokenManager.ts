import { STORAGE_KEYS, APP_CONSTANTS } from './apiConfig';
import { authApi } from '../services/api';

export interface TokenInfo {
  token: string;
  expiresAt: number;
  issuedAt: number;
}

class TokenManager {
  private refreshPromise: Promise<string | null> | null = null;

  // Store token with metadata
  setToken(token: string): void {
    const now = Date.now();
    const tokenInfo: TokenInfo = {
      token,
      expiresAt: now + (24 * 60 * 60 * 1000), // 24 hours from now
      issuedAt: now,
    };
    
    localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, JSON.stringify(tokenInfo));
  }

  // Get token if valid
  getToken(): string | null {
    try {
      const storedData = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!storedData) return null;

      const tokenInfo: TokenInfo = JSON.parse(storedData);
      const now = Date.now();

      // Check if token is expired
      if (now >= tokenInfo.expiresAt) {
        this.clearToken();
        return null;
      }

      return tokenInfo.token;
    } catch (error) {
      console.error('Error parsing token from storage:', error);
      this.clearToken();
      return null;
    }
  }

  // Check if token needs refresh (within 5 minutes of expiry)
  needsRefresh(): boolean {
    try {
      const storedData = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!storedData) return false;

      const tokenInfo: TokenInfo = JSON.parse(storedData);
      const now = Date.now();
      const timeUntilExpiry = tokenInfo.expiresAt - now;

      return timeUntilExpiry <= APP_CONSTANTS.TOKEN_REFRESH_THRESHOLD;
    } catch (error) {
      return false;
    }
  }

  // Get time until token expires
  getTimeUntilExpiry(): number {
    try {
      const storedData = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
      if (!storedData) return 0;

      const tokenInfo: TokenInfo = JSON.parse(storedData);
      const now = Date.now();

      return Math.max(0, tokenInfo.expiresAt - now);
    } catch (error) {
      return 0;
    }
  }

  // Clear token from storage
  clearToken(): void {
    localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
    this.refreshPromise = null;
  }

  // Refresh token if needed
  async refreshTokenIfNeeded(): Promise<string | null> {
    const currentToken = this.getToken();
    if (!currentToken) return null;

    if (!this.needsRefresh()) {
      return currentToken;
    }

    // Prevent multiple refresh calls
    if (this.refreshPromise) {
      return this.refreshPromise;
    }

    this.refreshPromise = this.performTokenRefresh(currentToken);
    const newToken = await this.refreshPromise;
    this.refreshPromise = null;

    return newToken;
  }

  // Perform the actual token refresh
  private async performTokenRefresh(currentToken: string): Promise<string | null> {
    try {
      const newToken = await authApi.refreshToken(currentToken);
      if (newToken) {
        this.setToken(newToken);
        return newToken;
      }
      
      // If refresh failed, clear the token
      this.clearToken();
      return null;
    } catch (error) {
      console.error('Token refresh failed:', error);
      this.clearToken();
      return null;
    }
  }

  // Decode JWT payload (for client-side inspection only)
  decodeTokenPayload(token?: string): any {
    try {
      const tokenToUse = token || this.getToken();
      if (!tokenToUse) return null;

      const payload = tokenToUse.split('.')[1];
      if (!payload) return null;

      const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
      return JSON.parse(decoded);
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  }

  // Check if user is admin based on token
  isAdmin(): boolean {
    try {
      const payload = this.decodeTokenPayload();
      return payload?.role === 'ADMIN' || payload?.authorities?.includes('ROLE_ADMIN');
    } catch (error) {
      return false;
    }
  }

  // Get user email from token
  getUserEmail(): string | null {
    try {
      const payload = this.decodeTokenPayload();
      return payload?.sub || payload?.email || null;
    } catch (error) {
      return null;
    }
  }

  // Start session monitoring
  startSessionMonitoring(onSessionExpiring: () => void, onSessionExpired: () => void): () => void {
    let warningShown = false;

    const checkSession = () => {
      const timeUntilExpiry = this.getTimeUntilExpiry();
      
      if (timeUntilExpiry <= 0) {
        onSessionExpired();
        return;
      }

      if (timeUntilExpiry <= APP_CONSTANTS.SESSION_WARNING_TIME && !warningShown) {
        warningShown = true;
        onSessionExpiring();
      }

      // Reset warning if session was extended
      if (timeUntilExpiry > APP_CONSTANTS.SESSION_WARNING_TIME) {
        warningShown = false;
      }
    };

    // Check every minute
    const interval = setInterval(checkSession, 60000);
    
    // Initial check
    checkSession();

    // Return cleanup function
    return () => clearInterval(interval);
  }
}

// Export singleton instance
export const tokenManager = new TokenManager();