import api from "./api";
import { Doctor } from "./doctorService";

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_datetime: string;
  status:
    | "scheduled"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "rescheduled"
    | "no_show";
  type: "in_person" | "virtual";
  reason_for_visit?: string;
  symptoms?: string;
  doctor_notes?: string;
  prescription?: string;
  meeting_link?: string;
  fee: number;
  is_paid: boolean;
  // Legacy fields for backward compatibility
  date?: string;
  time?: string;
  notes?: string;
  doctor?: Doctor;
  patient?: {
    id: number;
    user_id: number;
    user: {
      name: string;
      email: string;
      phone_number: string;
    };
  };
}

export interface AppointmentCreateData {
  doctor_id: number;
  appointment_datetime: string;
  type: "in_person" | "virtual";
  reason_for_visit?: string;
  symptoms?: string;
  fee: number;
  // Legacy fields for backward compatibility
  date?: string;
  time?: string;
  notes?: string;
}

const appointmentService = {
  // Get all appointments (different for patients and doctors)
  getAppointments: async (
    role: "patient" | "doctor" = "patient",
  ): Promise<Appointment[]> => {
    const endpoint =
      role === "patient" ? "/patient/appointments" : "/doctor/appointments";
    const response = await api.get<{ data: Appointment[] }>(endpoint);
    return response.data.data;
  },

  // Get specific appointment
  getAppointment: async (id: number): Promise<Appointment> => {
    const response = await api.get<{ data: Appointment }>(
      `/appointments/${id}`,
    );
    return response.data.data;
  },

  // Create a new appointment
  createAppointment: async (
    data: AppointmentCreateData,
  ): Promise<Appointment> => {
    const response = await api.post<{ data: Appointment }>(
      "/appointments",
      data,
    );
    return response.data.data;
  },

  // Update an appointment
  updateAppointment: async (
    id: number,
    data: Partial<Appointment>,
  ): Promise<Appointment> => {
    const response = await api.put<{ data: Appointment }>(
      `/appointments/${id}`,
      data,
    );
    return response.data.data;
  },

  // Cancel an appointment
  cancelAppointment: async (id: number): Promise<void> => {
    await api.put<void>(`/appointments/${id}`, { status: "cancelled" });
  },

  // Get occupied dates for a specific doctor
  getDoctorOccupiedDates: async (doctorId: number): Promise<string[]> => {
    const response = await api.get<{ data: string[] }>(
      `/doctors/${doctorId}/occupied-dates`,
    );
    return response.data.data;
  },

  // Get occupied time slots for a specific doctor on a specific date
  getDoctorOccupiedTimes: async (
    doctorId: number,
    date: string,
  ): Promise<string[]> => {
    const response = await api.get<{ data: string[] }>(
      `/doctors/${doctorId}/occupied-times?date=${date}`,
    );
    return response.data.data;
  },

  // Get occupied dates for a specific nursing provider
  getNursingProviderOccupiedDates: async (
    providerId: number,
  ): Promise<string[]> => {
    const response = await api.get<{ data: string[] }>(
      `/nursing-providers/${providerId}/occupied-dates`,
    );
    return response.data.data;
  },

  // Get occupied time slots for a specific nursing provider on a specific date
  getNursingProviderOccupiedTimes: async (
    providerId: number,
    date: string,
  ): Promise<string[]> => {
    const response = await api.get<{ data: string[] }>(
      `/nursing-providers/${providerId}/occupied-times?date=${date}`,
    );
    return response.data.data;
  },

  // Confirm an appointment (for providers)
  confirmAppointment: async (id: number): Promise<Appointment> => {
    const response = await api.put<{ data: Appointment }>(
      `/appointments/${id}/confirm`,
      {},
    );
    return response.data.data;
  },
};

export default appointmentService;
