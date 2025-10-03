import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

export interface AdminLoginData {
  username: string;
  password: string;
}

export interface AdminStats {
  userCounts: {
    doctors: number;
    nursing: number;
    labs: number;
    pharmacies: number;
    patients: number;
  };
  revenue: {
    total: number;
    doctors: number;
    nursing: number;
    labs: number;
    medicines: number;
  };
  recentActivity: {
    appointments: number;
    nursingServices: number;
    labAppointments: number;
    total: number;
  };
}

export interface AdminUser {
  id: number;
  user_id: number;
  name: string;
  email: string;
  phone: string;
  specialization?: string;
  license_number?: string;
  lab_name?: string;
  pharmacy_name?: string;
  created_at: string;
  type: string;
}

export interface CreateUserData {
  type: 'doctor' | 'nursing' | 'lab' | 'pharmacy' | 'patient';
  name: string;
  email: string;
  phone: string;
  password: string;
  specialization?: string;
  license_number?: string;
  lab_name?: string;
  pharmacy_name?: string;
  consultation_fee?: number;
  years_of_experience?: number;
}

class AdminService {
  private getAuthHeader() {
    const token = localStorage.getItem('adminToken');
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  async login(credentials: AdminLoginData) {
    const response = await axios.post(`${API_URL}/admin/login`, credentials);
    if (response.data.success) {
      localStorage.setItem('adminToken', response.data.token);
      localStorage.setItem('adminUser', JSON.stringify(response.data.admin));
    }
    return response.data;
  }

  async verifyToken() {
    try {
      const response = await axios.get(`${API_URL}/admin/verify`, {
        headers: this.getAuthHeader(),
      });
      return response.data;
    } catch (error) {
      return { valid: false };
    }
  }

  async getDashboardStats(): Promise<AdminStats> {
    const response = await axios.get(`${API_URL}/admin/dashboard/stats`, {
      headers: this.getAuthHeader(),
    });
    return response.data.stats;
  }

  async getUsersByType(type: string): Promise<AdminUser[]> {
    const response = await axios.get(`${API_URL}/admin/users/${type}`, {
      headers: this.getAuthHeader(),
    });
    return response.data.users;
  }

  async deleteUser(type: string, id: number) {
    const response = await axios.delete(`${API_URL}/admin/users/${type}/${id}`, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  async createUser(userData: CreateUserData) {
    const response = await axios.post(`${API_URL}/admin/users`, userData, {
      headers: this.getAuthHeader(),
    });
    return response.data;
  }

  logout() {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('adminToken');
  }

  getAdminUser() {
    const user = localStorage.getItem('adminUser');
    return user ? JSON.parse(user) : null;
  }
}

export default new AdminService();
