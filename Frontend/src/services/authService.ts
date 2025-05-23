import api from './api';

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
    user_type_id: number;
    user_type: {
      id: number;
      name: string;
      display_name: string;
    };
    // Additional user fields as needed
  };
  token: string;
}

const authService = {
  // Register a new user
  register: async (data: RegisterData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/register', data);
    return response.data;
  },

  // Login an existing user
  login: async (data: LoginData): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/login', data);
    
    // Store token and user data in localStorage
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
    }
    
    return response.data;
  },

  // Logout the current user
  logout: async (): Promise<void> => {
    try {
      await api.post('/logout');
    } finally {
      // Always clear local storage, even if the API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  // Get the current authenticated user
  getCurrentUser: async () => {
    const response = await api.get('/user');
    return response.data;
  },

  // Get the current user from localStorage
  getStoredUser: () => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Check if user is authenticated
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  }
};

export default authService;
