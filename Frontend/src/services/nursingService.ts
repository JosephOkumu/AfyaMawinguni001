import api from './api';

export interface NursingProvider {
  id: number;
  user_id: number;
  services_offered: string;
  availability: string;
  experience: string;
  location: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    license_number: string;
  };
}

export interface NursingService {
  id: number;
  patient_id: number;
  nursing_provider_id: number;
  service_type: string;
  status: string; // e.g., 'requested', 'in-progress', 'completed', 'cancelled'
  start_date: string;
  end_date?: string;
  location: string;
  notes?: string;
  nursing_provider?: NursingProvider;
  patient?: {
    id: number;
    user_id: number;
    user: {
      name: string;
      email: string;
      phone_number: string;
    }
  };
}

export interface NursingServiceCreateData {
  nursing_provider_id: number;
  service_type: string;
  start_date: string;
  location: string;
  notes?: string;
}

const nursingService = {
  // Nursing Provider methods
  getAllNursingProviders: async (): Promise<NursingProvider[]> => {
    const response = await api.get<{ data: NursingProvider[] }>('/nursing-providers');
    return response.data.data;
  },

  getNursingProvider: async (id: number): Promise<NursingProvider> => {
    const response = await api.get<{ data: NursingProvider }>(`/nursing-providers/${id}`);
    return response.data.data;
  },

  updateNursingProviderProfile: async (data: Partial<NursingProvider>): Promise<NursingProvider> => {
    const providerId = data.id;
    if (providerId) {
      // Update existing profile
      const response = await api.put<{ data: NursingProvider }>(`/nursing-providers/${providerId}`, data);
      return response.data.data;
    } else {
      // Create new profile
      const response = await api.post<{ data: NursingProvider }>('/nursing-providers', data);
      return response.data.data;
    }
  },

  // Nursing Service methods
  getNursingServices: async (role: 'patient' | 'nursing-provider' = 'patient'): Promise<NursingService[]> => {
    const endpoint = role === 'patient' ? '/patient/nursing-services' : '/nursing-provider/nursing-services';
    const response = await api.get<{ data: NursingService[] }>(endpoint);
    return response.data.data;
  },

  getNursingService: async (id: number): Promise<NursingService> => {
    const response = await api.get<{ data: NursingService }>(`/nursing-services/${id}`);
    return response.data.data;
  },

  requestNursingService: async (data: NursingServiceCreateData): Promise<NursingService> => {
    const response = await api.post<{ data: NursingService }>('/nursing-services', data);
    return response.data.data;
  },

  updateNursingService: async (id: number, data: Partial<NursingService>): Promise<NursingService> => {
    const response = await api.put<{ data: NursingService }>(`/nursing-services/${id}`, data);
    return response.data.data;
  },

  completeNursingService: async (id: number, notes?: string): Promise<NursingService> => {
    const response = await api.put<{ data: NursingService }>(`/nursing-services/${id}`, {
      status: 'completed',
      end_date: new Date().toISOString().split('T')[0], // Current date in YYYY-MM-DD format
      notes: notes
    });
    return response.data.data;
  }
};

export default nursingService;
