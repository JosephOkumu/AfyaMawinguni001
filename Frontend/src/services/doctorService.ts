import api from './api';

export interface Doctor {
  id: number;
  user_id: number;
  specialty: string;
  education: string;
  experience: string;
  availability: string;
  bio: string;
  profile_image?: string;
  user: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    license_number: string;
  };
  // Add any additional fields needed
}

const doctorService = {
  // Get all doctors
  getAllDoctors: async (): Promise<Doctor[]> => {
    const response = await api.get<{ data: Doctor[] }>('/doctors');
    return response.data.data;
  },

  // Get a specific doctor
  getDoctor: async (id: number): Promise<Doctor> => {
    const response = await api.get<{ data: Doctor }>(`/doctors/${id}`);
    return response.data.data;
  },

  // Create or update doctor profile (for doctor users)
  updateProfile: async (data: Partial<Doctor>): Promise<Doctor> => {
    const doctorId = data.id;
    if (doctorId) {
      // Update existing profile
      const response = await api.put<{ data: Doctor }>(`/doctors/${doctorId}`, data);
      return response.data.data;
    } else {
      // Create new profile
      const response = await api.post<{ data: Doctor }>('/doctors', data);
      return response.data.data;
    }
  },

  // Search doctors by specialty or name
  searchDoctors: async (query: string): Promise<Doctor[]> => {
    const response = await api.get<{ data: Doctor[] }>('/doctors', {
      params: { search: query }
    });
    return response.data.data;
  }
};

export default doctorService;
