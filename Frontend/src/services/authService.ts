import api from "./api";
import SecureStorage from "../utils/secureStorage";

// Types
export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone_number: string;
  user_type_id: number;
  // Optional verification fields for healthcare providers
  license_number?: string;
  national_id?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: {
    id: number;
    name: string;
    email: string;
    user_type_id?: number;
    user_type?:
      | {
          id: number;
          name: string;
          display_name: string;
        }
      | string;
    // Additional user fields as needed
  };
  token?: string;
  access_token?: string;
  token_type?: string;
}

const authService = {
  // Register a new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>("/register", data);
    return response.data;
  },

  // Login an existing user
  login: async (data: LoginData): Promise<AuthResponse> => {
    console.log("=== LOGIN DEBUG ===");
    console.log("Login data:", data);

    const response = await api.post("/login", data);
    console.log("Login response:", response.data);

    // Handle different token field names from backend
    const token = response.data.access_token || response.data.token;
    const user = response.data.user;

    console.log("Extracted token:", token);
    console.log("Extracted user:", user);

    // Store token and user data using secure storage with XSS protection
    if (token && user) {
      const tokenStored = SecureStorage.setToken(token, 480); // 8 hours expiration
      const userStored = SecureStorage.setUser(user);
      
      if (!tokenStored || !userStored) {
        throw new Error("Failed to store authentication data securely");
      }
      
      console.log("Token and user data stored securely");
    } else {
      console.error("No token or user found in response!");
      throw new Error("Invalid authentication response");
    }

    // Return in the format expected by frontend
    return {
      token: token,
      user: user,
    };
  },

  // Logout the current user
  logout: async (): Promise<void> => {
    try {
      await api.post("/logout");
    } finally {
      // Always clear secure storage, even if the API call fails
      SecureStorage.clearAll();
    }
  },

  // Get the current authenticated user
  getCurrentUser: async () => {
    const response = await api.get("/user");
    return response.data;
  },

  // Get the current user from secure storage
  getStoredUser: () => {
    return SecureStorage.getUser();
  },

  // Check if user is authenticated with token validation
  isAuthenticated: (): boolean => {
    return SecureStorage.isAuthenticated();
  },

  // Get current token
  getToken: (): string | null => {
    return SecureStorage.getToken();
  },

  // Check if token is expiring soon
  isTokenExpiringSoon: (): boolean => {
    return SecureStorage.isTokenExpiringSoon();
  },
};

export default authService;
