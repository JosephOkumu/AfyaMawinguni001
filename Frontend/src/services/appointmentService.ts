import api from './api';
import { Doctor } from './doctorService';

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  date: string;
  time: string;
  status: string; // e.g., 'pending', 'confirmed', 'completed', 'cancelled'
  notes?: string;
  doctor?: Doctor;
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

export interface AppointmentCreateData {
  doctor_id: number;
  date: string;
  time: string;
  notes?: string;
}

const appointmentService = {
  // Get all appointments (different for patients and doctors)
  getAppointments: async (role: 'patient' | 'doctor' = 'patient'): Promise<Appointment[]> => {
    const endpoint = role === 'patient' ? '/patient/appointments' : '/doctor/appointments';
    const response = await api.get<{ data: Appointment[] }>(endpoint);
    return response.data.data;
  },

  // Get specific appointment
  getAppointment: async (id: number): Promise<Appointment> => {
    const response = await api.get<{ data: Appointment }>(`/appointments/${id}`);
    return response.data.data;
  },

  // Create a new appointment
  createAppointment: async (data: AppointmentCreateData): Promise<Appointment> => {
    const response = await api.post<{ data: Appointment }>('/appointments', data);
    return response.data.data;
  },

  // Update an appointment
  updateAppointment: async (id: number, data: Partial<Appointment>): Promise<Appointment> => {
    const response = await api.put<{ data: Appointment }>(`/appointments/${id}`, data);
    return response.data.data;
  },

  // Cancel an appointment
  cancelAppointment: async (id: number): Promise<void> => {
    await api.put<void>(`/appointments/${id}`, { status: 'cancelled' });
  }
};

export default appointmentService;
