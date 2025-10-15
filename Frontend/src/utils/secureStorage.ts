/**
 * Secure storage utility for handling authentication tokens
 * Implements XSS protection measures for token-based authentication
 */

interface TokenData {
  token: string;
  expiresAt: number;
  refreshToken?: string;
}

interface UserData {
  id: number;
  name: string;
  email: string;
  user_type_id?: number;
  user_type?: any;
}

class SecureStorage {
  private static readonly TOKEN_KEY = 'auth_token';
  private static readonly USER_KEY = 'user_data';
  private static readonly REFRESH_TOKEN_KEY = 'refresh_token';
  
  // XSS Protection: Sanitize data before storage
  private static sanitizeString(str: string): string {
    if (typeof str !== 'string') return '';
    
    // Remove potentially dangerous characters and scripts
    return str
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:text\/html/gi, '')
      .trim();
  }

  // XSS Protection: Validate token format
  private static isValidToken(token: string): boolean {
    if (!token || typeof token !== 'string') return false;
    
    // Basic token format validation (adjust based on your token format)
    // Laravel Sanctum tokens are typically alphanumeric with pipes
    const tokenPattern = /^[a-zA-Z0-9|_-]+$/;
    return tokenPattern.test(token) && token.length > 10;
  }

  // Store token with expiration and validation
  static setToken(token: string, expiresInMinutes: number = 60): boolean {
    try {
      if (!this.isValidToken(token)) {
        console.error('Invalid token format detected');
        return false;
      }

      const sanitizedToken = this.sanitizeString(token);
      const expiresAt = Date.now() + (expiresInMinutes * 60 * 1000);
      
      const tokenData: TokenData = {
        token: sanitizedToken,
        expiresAt
      };

      localStorage.setItem(this.TOKEN_KEY, JSON.stringify(tokenData));
      return true;
    } catch (error) {
      console.error('Error storing token:', error);
      return false;
    }
  }

  // Get token with expiration check
  static getToken(): string | null {
    try {
      const tokenDataStr = localStorage.getItem(this.TOKEN_KEY);
      if (!tokenDataStr) return null;

      const tokenData: TokenData = JSON.parse(tokenDataStr);
      
      // Check if token is expired
      if (Date.now() > tokenData.expiresAt) {
        this.clearToken();
        return null;
      }

      return tokenData.token;
    } catch (error) {
      console.error('Error retrieving token:', error);
      this.clearToken();
      return null;
    }
  }

  // Store user data with sanitization
  static setUser(user: UserData): boolean {
    try {
      // Sanitize user data
      const sanitizedUser: UserData = {
        id: Number(user.id) || 0,
        name: this.sanitizeString(user.name || ''),
        email: this.sanitizeString(user.email || ''),
        user_type_id: Number(user.user_type_id) || undefined,
        user_type: user.user_type
      };

      // Validate required fields
      if (!sanitizedUser.id || !sanitizedUser.email) {
        console.error('Invalid user data');
        return false;
      }

      localStorage.setItem(this.USER_KEY, JSON.stringify(sanitizedUser));
      return true;
    } catch (error) {
      console.error('Error storing user data:', error);
      return false;
    }
  }

  // Get user data with validation
  static getUser(): UserData | null {
    try {
      const userDataStr = localStorage.getItem(this.USER_KEY);
      if (!userDataStr) return null;

      const userData: UserData = JSON.parse(userDataStr);
      
      // Validate user data structure
      if (!userData.id || !userData.email) {
        this.clearUser();
        return null;
      }

      return userData;
    } catch (error) {
      console.error('Error retrieving user data:', error);
      this.clearUser();
      return null;
    }
  }

  // Check if user is authenticated with token validation
  static isAuthenticated(): boolean {
    const token = this.getToken();
    const user = this.getUser();
    return !!(token && user);
  }

  // Clear token
  static clearToken(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // Clear user data
  static clearUser(): void {
    localStorage.removeItem(this.USER_KEY);
  }

  // Clear all authentication data
  static clearAll(): void {
    this.clearToken();
    this.clearUser();
  }

  // Get token expiration time
  static getTokenExpiration(): number | null {
    try {
      const tokenDataStr = localStorage.getItem(this.TOKEN_KEY);
      if (!tokenDataStr) return null;

      const tokenData: TokenData = JSON.parse(tokenDataStr);
      return tokenData.expiresAt;
    } catch (error) {
      return null;
    }
  }

  // Check if token will expire soon (within 5 minutes)
  static isTokenExpiringSoon(): boolean {
    const expiresAt = this.getTokenExpiration();
    if (!expiresAt) return true;
    
    const fiveMinutesFromNow = Date.now() + (5 * 60 * 1000);
    return expiresAt < fiveMinutesFromNow;
  }
}

export default SecureStorage;
