import api from './api';

export interface LabProvider {
  id: number;
  user_id: number;
  facilities: string;
  services_offered: string;
  operating_hours: string;
  location: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    license_number: string;
  };
}

export interface LabTest {
  id: number;
  patient_id: number;
  lab_provider_id: number;
  test_name: string;
  test_type: string;
  status: string; // e.g., 'pending', 'processing', 'completed'
  results?: string;
  requested_date: string;
  completion_date?: string;
  notes?: string;
  lab_provider?: LabProvider;
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

export interface LabTestCreateData {
  lab_provider_id: number;
  test_name: string;
  test_type: string;
  notes?: string;
}

const labService = {
  // Lab Provider methods
  getAllLabProviders: async (): Promise<LabProvider[]> => {
    const response = await api.get<{ data: LabProvider[] }>('/lab-providers');
    return response.data.data;
  },

  getLabProvider: async (id: number): Promise<LabProvider> => {
    const response = await api.get<{ data: LabProvider }>(`/lab-providers/${id}`);
    return response.data.data;
  },

  updateLabProviderProfile: async (data: Partial<LabProvider>): Promise<LabProvider> => {
    const providerId = data.id;
    if (providerId) {
      // Update existing profile
      const response = await api.put<{ data: LabProvider }>(`/lab-providers/${providerId}`, data);
      return response.data.data;
    } else {
      // Create new profile
      const response = await api.post<{ data: LabProvider }>('/lab-providers', data);
      return response.data.data;
    }
  },

  // Lab Test methods
  getLabTests: async (role: 'patient' | 'lab-provider' = 'patient'): Promise<LabTest[]> => {
    const endpoint = role === 'patient' ? '/patient/lab-tests' : '/lab-provider/lab-tests';
    const response = await api.get<{ data: LabTest[] }>(endpoint);
    return response.data.data;
  },

  getLabTest: async (id: number): Promise<LabTest> => {
    const response = await api.get<{ data: LabTest }>(`/lab-tests/${id}`);
    return response.data.data;
  },

  requestLabTest: async (data: LabTestCreateData): Promise<LabTest> => {
    const response = await api.post<{ data: LabTest }>('/lab-tests', data);
    return response.data.data;
  },

  updateLabTest: async (id: number, data: Partial<LabTest>): Promise<LabTest> => {
    const response = await api.put<{ data: LabTest }>(`/lab-tests/${id}`, data);
    return response.data.data;
  },

  // For lab providers to update test results
  updateTestResults: async (id: number, results: string, status: string = 'completed'): Promise<LabTest> => {
    const response = await api.put<{ data: LabTest }>(`/lab-tests/${id}`, {
      results,
      status,
      completion_date: new Date().toISOString().split('T')[0] // Current date in YYYY-MM-DD format
    });
    return response.data.data;
  }
};

export default labService;
