import api from "./api";
import { Doctor } from "./doctorService";

export interface Appointment {
  id: number;
  patient_id: number;
  doctor_id: number;
  appointment_datetime: string;
  status: "scheduled" | "completed" | "cancelled" | "rescheduled" | "no_show";
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
};

export default appointmentService;
