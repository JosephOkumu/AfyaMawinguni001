import api from "./api";
import { Doctor } from "./doctorService";
import { LabProvider, LabTestService } from "./labService";

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

export interface LabAppointment {
  id: number;
  patient_id: number;
  lab_provider_id: number;
  appointment_datetime: string;
  status:
    | "scheduled"
    | "confirmed"
    | "completed"
    | "cancelled"
    | "rescheduled"
    | "in_progress";
  test_ids: number[];
  total_amount: number;
  is_paid: boolean;
  payment_reference?: string;
  notes?: string;
  results?: string;
  lab_notes?: string;
  created_at: string;
  updated_at: string;
  patient?: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
  };
  // Laravel returns snake_case, so we need to handle both
  labProvider?: LabProvider;
  lab_provider?: LabProvider;
  labTests?: LabTestService[];
  lab_tests?: LabTestService[];
}

export interface LabAppointmentCreateData {
  patient_id: number;
  lab_provider_id: number;
  appointment_datetime: string;
  test_ids: number[];
  total_amount: number;
  payment_reference?: string;
  notes?: string;
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

  // Lab Appointment Methods
  // Get all lab appointments for patient
  getLabAppointments: async (): Promise<LabAppointment[]> => {
    const response = await api.get<{ data: LabAppointment[] }>(
      "/patient/lab-appointments",
    );
    return response.data.data;
  },

  // Create a new lab appointment
  createLabAppointment: async (
    data: LabAppointmentCreateData,
  ): Promise<LabAppointment> => {
    const response = await api.post<{ data: LabAppointment }>(
      "/lab-appointments",
      data,
    );
    return response.data.data;
  },

  // Get specific lab appointment
  getLabAppointment: async (id: number): Promise<LabAppointment> => {
    const response = await api.get<{ data: LabAppointment }>(
      `/lab-appointments/${id}`,
    );
    return response.data.data;
  },

  // Update lab appointment
  updateLabAppointment: async (
    id: number,
    data: Partial<LabAppointment>,
  ): Promise<LabAppointment> => {
    const response = await api.put<{ data: LabAppointment }>(
      `/lab-appointments/${id}`,
      data,
    );
    return response.data.data;
  },

  // Cancel lab appointment
  cancelLabAppointment: async (id: number): Promise<void> => {
    await api.put<void>(`/lab-appointments/${id}`, { status: "cancelled" });
  },

  // Get occupied times for lab provider
  getLabProviderOccupiedTimes: async (
    providerId: number,
    date: string,
  ): Promise<string[]> => {
    const response = await api.get<{ data: string[] }>(
      `/lab-providers/${providerId}/occupied-times?date=${date}`,
    );
    return response.data.data;
  },

  // Get fully booked dates for lab provider
  getLabProviderFullyBookedDates: async (
    providerId: number,
  ): Promise<string[]> => {
    const response = await api.get<{ data: string[] }>(
      `/lab-providers/${providerId}/fully-booked-dates`,
    );
    return response.data.data;
  },
};

export default appointmentService;
