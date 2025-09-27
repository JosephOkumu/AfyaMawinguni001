import api from "./api";

export interface Doctor {
  id: number;
  user_id: number;
  specialty: string;
  description?: string;
  professional_summary?: string;
  years_of_experience?: string;
  hospital?: string;
  location?: string;
  license_number: string;
  experience?: string;
  default_consultation_fee: number;
  physical_consultation_fee?: number;
  online_consultation_fee?: number;
  profile_image?: string;
  bio?: string;
  languages?: string;
  accepts_insurance: boolean;
  consultation_modes?: string[];
  availability?: string;
  is_available_for_consultation: boolean;
  average_rating: number;
  user: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
  };
}

export interface DoctorProfileUpdateData {
  name?: string;
  specialty?: string;
  description?: string;
  hospital?: string;
  location?: string;
  availability?: string;
  experience?: string;
  physicalPrice?: number;
  onlinePrice?: number;
  languages?: string;
  acceptsInsurance?: boolean;
  consultationModes?: string[];
}

export interface AvailabilitySchedule {
  [key: string]: {
    available: boolean;
    start_time?: string;
    end_time?: string;
  };
}

export interface DoctorAvailabilitySettings {
  availability_schedule: string;
  appointment_duration_minutes: number;
  repeat_weekly: boolean;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  status: 'available' | 'booked' | 'unavailable';
}

export interface DoctorAvailableTimeSlotsResponse {
  available_slots: string[];
  appointment_duration_minutes: number;
  occupied_slots: string[];
  unavailable_slots?: string[];
}

const doctorService = {
  // Get all doctors
  getAllDoctors: async (): Promise<Doctor[]> => {
    console.log("👨‍⚕️ Fetching all doctors...");
    try {
      const response = await api.get<{ data: Doctor[] }>("/doctors");
      console.log("👨‍⚕️ Doctors response:", {
        status: response.status,
        dataType: typeof response.data,
        hasData: !!response.data.data,
        count: response.data.data?.length || 0
      });
      return response.data.data;
    } catch (error) {
      console.error("🚨 Error fetching doctors:", error);
      throw error;
    }
  },

  // Get a specific doctor
  getDoctor: async (id: number): Promise<Doctor> => {
    const response = await api.get<{ data: Doctor }>(`/doctors/${id}`);
    return response.data.data;
  },

  // Create or update doctor profile (for doctor users)
  updateDoctorProfile: async (data: Partial<Doctor>): Promise<Doctor> => {
    const doctorId = data.id;
    if (doctorId) {
      // Update existing profile
      const response = await api.put<{ data: Doctor }>(
        `/doctors/${doctorId}`,
        data,
      );
      return response.data.data;
    } else {
      // Create new profile
      const response = await api.post<{ data: Doctor }>("/doctors", data);
      return response.data.data;
    }
  },

  // Get current doctor profile
  getProfile: async (): Promise<Doctor> => {
    const response = await api.get<{ data: Doctor }>("/doctor/profile");
    return response.data.data;
  },

  // Update current doctor profile
  updateProfile: async (data: DoctorProfileUpdateData): Promise<Doctor> => {
    const response = await api.patch<{ data: Doctor }>("/doctor/profile", data);
    return response.data.data;
  },

  // Upload profile image
  uploadProfileImage: async (file: File): Promise<string> => {
    console.log("=== DOCTOR SERVICE IMAGE UPLOAD ===");
    console.log("File to upload:", file.name, file.size, file.type);

    const formData = new FormData();
    formData.append("profile_image", file);

    console.log("FormData created, making API call...");

    const response = await api.post<{
      status: string;
      data: { profile_image: string };
    }>("/doctor/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload response:", response.data);
    console.log("New image URL:", response.data.data.profile_image);

    return response.data.data.profile_image;
  },

  // Search doctors by specialty or name
  searchDoctors: async (query: string): Promise<Doctor[]> => {
    const response = await api.get<{ data: Doctor[] }>("/doctors", {
      params: { search: query },
    });
    return response.data.data;
  },

  // Update availability settings for the current doctor
  updateAvailabilitySettings: async (settings: DoctorAvailabilitySettings): Promise<DoctorAvailabilitySettings> => {
    console.log("=== DOCTOR AVAILABILITY SETTINGS UPDATE ===");
    console.log("Settings to update:", settings);

    const response = await api.put<{
      status: string;
      data: DoctorAvailabilitySettings;
    }>("/doctor/availability-settings", settings);

    console.log("Availability settings update response:", response.data);
    return response.data.data;
  },

  // Get available time slots for a specific doctor on a specific date
  getAvailableTimeSlots: async (doctorId: number, date: string): Promise<DoctorAvailableTimeSlotsResponse> => {
    console.log("=== FETCHING DOCTOR AVAILABLE TIME SLOTS ===");
    console.log("Doctor ID:", doctorId);
    console.log("Date:", date);

    const response = await api.get<{
      status: string;
      data: TimeSlot[];
      appointment_duration_minutes?: number;
    }>(`/doctors/${doctorId}/available-time-slots?date=${date}`);

    console.log("Doctor available time slots response:", response.data);
    
    // Convert backend TimeSlot[] format to match nursing service format
    const timeSlots = response.data.data;
    const availableSlots = timeSlots.filter(slot => slot.available).map(slot => slot.time);
    const occupiedSlots = timeSlots.filter(slot => slot.status === 'booked').map(slot => slot.time);
    const unavailableSlots = timeSlots.filter(slot => slot.status === 'unavailable').map(slot => slot.time);

    return {
      available_slots: availableSlots,
      appointment_duration_minutes: response.data.appointment_duration_minutes || 30,
      occupied_slots: occupiedSlots,
      unavailable_slots: unavailableSlots
    };
  },

  // Unavailable Sessions Management
  createUnavailableSession: async (sessionData: UnavailableSessionCreateData): Promise<UnavailableSession> => {
    console.log("=== CREATING DOCTOR UNAVAILABLE SESSION ===");
    console.log("Session data:", sessionData);

    const response = await api.post<{
      status: string;
      message: string;
      data: UnavailableSession;
    }>('/doctor/unavailable-sessions', sessionData);

    console.log("Created session response:", response.data);
    return response.data.data;
  },

  getUnavailableSessions: async (): Promise<UnavailableSession[]> => {
    console.log("=== FETCHING DOCTOR UNAVAILABLE SESSIONS ===");

    const response = await api.get<{
      status: string;
      data: UnavailableSession[];
    }>('/doctor/unavailable-sessions');

    console.log("Unavailable sessions response:", response.data);
    return response.data.data;
  },

  deleteUnavailableSession: async (sessionId: number): Promise<void> => {
    console.log("=== DELETING DOCTOR UNAVAILABLE SESSION ===");
    console.log("Session ID:", sessionId);

    await api.delete(`/doctor/unavailable-sessions/${sessionId}`);
    console.log("Session deleted successfully");
  },
};

// Types for unavailable sessions
export interface UnavailableSession {
  id: number;
  doctor_id: number;
  date: string;
  start_time: string;
  end_time: string;
  reason?: string;
  created_at: string;
  updated_at: string;
}

export interface UnavailableSessionCreateData {
  date: string;
  start_time: string;
  end_time: string;
  reason?: string;
}

export default doctorService;
