import api from "./api";

export interface NursingProvider {
  id: number;
  user_id: number;
  provider_name: string;
  description: string;
  location?: string;
  license_number: string;
  qualifications: string;
  services_offered: string;
  service_areas?: string[];
  logo?: string;
  base_rate_per_hour: number;
  is_available: boolean;
  average_rating: number;
  availability_schedule?: AvailabilitySchedule;
  appointment_duration_minutes?: number;
  repeat_weekly?: boolean;
  user: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
  };
  nursingServiceOfferings?: NursingServiceOffering[];
}

export interface AvailabilitySchedule {
  [key: string]: {
    available: boolean;
    start_time: string;
    end_time: string;
  };
}

export interface AvailabilitySettings {
  availability_schedule?: AvailabilitySchedule;
  appointment_duration_minutes?: number;
  repeat_weekly?: boolean;
}

export interface AvailableTimeSlotsResponse {
  available_slots: string[];
  appointment_duration_minutes: number;
  occupied_slots: string[];
  unavailable_slots?: string[];
  unavailable_sessions?: UnavailableSession[];
}

export interface UnavailableSession {
  id: number;
  nursing_provider_id: number;
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

export interface NursingService {
  id: number;
  patient_id: number;
  nursing_provider_id: number;
  service_name: string;
  service_description?: string;
  service_price: number;
  scheduled_datetime: string;
  end_datetime?: string;
  patient_address: string;
  status: "scheduled" | "confirmed" | "in_progress" | "completed" | "cancelled";
  care_notes?: string;
  patient_requirements?: string;
  medical_history?: string;
  doctor_referral?: string;
  is_recurring: boolean;
  recurrence_pattern?: string;
  is_paid: boolean;
  created_at: string;
  updated_at: string;
  nursing_provider?: NursingProvider;
  patient?: {
    id: number;
    name: string;
    email: string;
    phone_number: string;
    profile?: {
      avatar?: string;
    };
  };
}

export interface NursingServiceCreateData {
  nursing_provider_id: number;
  service_type: string;
  start_date: string;
  location: string;
  notes?: string;
}

export interface NursingProviderProfileUpdateData {
  name?: string;
  provider_name?: string;
  description?: string;
  location?: string;
  availability?: string;
  experience?: string;
  qualifications?: string;
  services_offered?: string;
  base_rate_per_hour?: number;
  phone_number?: string;
  email?: string;
}

export interface NursingServiceOffering {
  id: number;
  nursing_provider_id: number;
  name: string;
  description: string;
  location: string;
  availability: string;
  experience: string;
  price: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface NursingServiceOfferingCreateData {
  name: string;
  description: string;
  location: string;
  availability: string;
  experience: string;
  price: number;
}

const nursingService = {
  // Nursing Provider methods
  getAllNursingProviders: async (): Promise<NursingProvider[]> => {
    console.log("🏥 Fetching all nursing providers...");
    try {
      const response = await api.get<{ data: NursingProvider[] }>(
        "/nursing-providers",
      );
      console.log("🏥 Nursing providers response:", {
        status: response.status,
        dataType: typeof response.data,
        hasData: !!response.data.data,
        count: response.data.data?.length || 0,
      });
      return response.data.data;
    } catch (error) {
      console.error("🚨 Error fetching nursing providers:", error);
      throw error;
    }
  },

  getNursingProvider: async (id: number): Promise<NursingProvider> => {
    const response = await api.get<{ data: NursingProvider }>(
      `/nursing-providers/${id}`,
    );
    return response.data.data;
  },

  updateNursingProviderProfile: async (
    data: Partial<NursingProvider>,
  ): Promise<NursingProvider> => {
    const providerId = data.id;
    if (providerId) {
      // Update existing profile
      const response = await api.put<{ data: NursingProvider }>(
        `/nursing-providers/${providerId}`,
        data,
      );
      return response.data.data;
    } else {
      // Create new profile
      const response = await api.post<{ data: NursingProvider }>(
        "/nursing-providers",
        data,
      );
      return response.data.data;
    }
  },

  // Nursing Service methods
  getNursingServices: async (
    role: "patient" | "nursing-provider" = "patient",
  ): Promise<NursingService[]> => {
    const endpoint =
      role === "patient"
        ? "/patient/nursing-services"
        : "/nursing-provider/nursing-services";
    const response = await api.get<{ data: NursingService[] }>(endpoint);
    return response.data.data;
  },

  getNursingService: async (id: number): Promise<NursingService> => {
    const response = await api.get<{ data: NursingService }>(
      `/nursing-services/${id}`,
    );
    return response.data.data;
  },

  requestNursingService: async (
    data: NursingServiceCreateData,
  ): Promise<NursingService> => {
    const response = await api.post<{ data: NursingService }>(
      "/nursing-services",
      data,
    );
    return response.data.data;
  },

  updateNursingService: async (
    id: number,
    data: Partial<NursingService>,
  ): Promise<NursingService> => {
    const response = await api.put<{ data: NursingService }>(
      `/nursing-services/${id}`,
      data,
    );
    return response.data.data;
  },

  // Profile management methods
  getProfile: async (): Promise<NursingProvider> => {
    const response = await api.get<{ data: NursingProvider }>(
      "/nursing-provider/profile",
    );
    return response.data.data;
  },

  updateProfile: async (
    data: NursingProviderProfileUpdateData,
  ): Promise<NursingProvider> => {
    const response = await api.patch<{ data: NursingProvider }>(
      "/nursing-provider/profile",
      data,
    );
    return response.data.data;
  },

  uploadProfileImage: async (file: File): Promise<string> => {
    console.log("=== NURSING SERVICE IMAGE UPLOAD ===");
    console.log("File to upload:", file.name, file.size, file.type);

    const formData = new FormData();
    formData.append("profile_image", file);

    console.log("FormData created, making API call...");

    const response = await api.post<{
      status: string;
      data: { profile_image: string };
    }>("/nursing-provider/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log("Upload response:", response.data);
    console.log("New image URL:", response.data.data.profile_image);

    return response.data.data.profile_image;
  },

  // Service Offerings management methods
  getServiceOfferings: async (): Promise<NursingServiceOffering[]> => {
    const response = await api.get<{ data: NursingServiceOffering[] }>(
      "/nursing-provider/service-offerings",
    );
    return response.data.data;
  },

  createServiceOffering: async (
    data: NursingServiceOfferingCreateData,
  ): Promise<NursingServiceOffering> => {
    const response = await api.post<{ data: NursingServiceOffering }>(
      "/nursing-provider/service-offerings",
      data,
    );
    return response.data.data;
  },

  updateServiceOffering: async (
    id: number,
    data: Partial<NursingServiceOfferingCreateData>,
  ): Promise<NursingServiceOffering> => {
    const response = await api.put<{ data: NursingServiceOffering }>(
      `/nursing-provider/service-offerings/${id}`,
      data,
    );
    return response.data.data;
  },

  deleteServiceOffering: async (id: number): Promise<void> => {
    await api.delete(`/nursing-provider/service-offerings/${id}`);
  },

  // Public service offerings methods (for patients to view)
  getAllServiceOfferings: async (): Promise<NursingServiceOffering[]> => {
    const response = await api.get<{ data: NursingServiceOffering[] }>(
      "/service-offerings",
    );
    return response.data.data;
  },

  getProviderServiceOfferings: async (
    providerId: number,
  ): Promise<NursingServiceOffering[]> => {
    const response = await api.get<{ data: NursingServiceOffering[] }>(
      `/nursing-providers/${providerId}/service-offerings`,
    );
    return response.data.data;
  },

  // Accept/Reject nursing service requests
  acceptNursingService: async (id: number): Promise<NursingService> => {
    const response = await api.put<{ data: NursingService }>(
      `/nursing-services/${id}/accept`,
    );
    return response.data.data;
  },

  confirmNursingService: async (id: number): Promise<NursingService> => {
    const response = await api.put<{ data: NursingService }>(
      `/nursing-services/${id}/confirm`,
    );
    return response.data.data;
  },

  rejectNursingService: async (
    id: number,
    rejectionReason?: string,
  ): Promise<NursingService> => {
    const response = await api.put<{ data: NursingService }>(
      `/nursing-services/${id}/reject`,
      {
        rejection_reason: rejectionReason,
      },
    );
    return response.data.data;
  },

  completeNursingService: async (
    id: number,
    completionNotes?: string,
  ): Promise<NursingService> => {
    const response = await api.put<{ data: NursingService }>(
      `/nursing-services/${id}/complete`,
      {
        status: "completed",
        end_date: new Date().toISOString().split("T")[0], // Current date in YYYY-MM-DD format
        completion_notes: completionNotes,
        notes: completionNotes, // For backward compatibility
      },
    );
    return response.data.data;
  },

  // Get occupied dates for a nursing provider
  getOccupiedDates: async (providerId: number): Promise<string[]> => {
    const response = await api.get<{ data: string[] }>(
      `/nursing-providers/${providerId}/occupied-dates`,
    );
    return response.data.data;
  },

  // Get occupied time slots for a nursing provider on a specific date
  getOccupiedTimes: async (
    providerId: number,
    date: string,
  ): Promise<string[]> => {
    const response = await api.get<{ data: string[] }>(
      `/nursing-providers/${providerId}/occupied-times?date=${date}`,
    );
    return response.data.data;
  },

  // Update availability settings for the current nursing provider
  updateAvailabilitySettings: async (
    settings: AvailabilitySettings,
  ): Promise<AvailabilitySettings> => {
    console.log("=== UPDATING AVAILABILITY SETTINGS ===");
    console.log("Settings to update:", settings);
    console.log("JSON stringified:", JSON.stringify(settings, null, 2));

    try {
      const response = await api.put<{
        status: string;
        data: AvailabilitySettings;
      }>("/nursing-provider/availability-settings", settings);

      console.log("Availability settings updated:", response.data.data);
      return response.data.data;
    } catch (error: unknown) {
      console.error("API call failed:", error);
      console.error("Request payload:", settings);
      if (error && typeof error === "object" && "response" in error) {
        const axiosError = error as {
          response?: { status?: number; data?: unknown; headers?: unknown };
        };
        console.error("Response status:", axiosError.response?.status);
        console.error("Response data:", axiosError.response?.data);
        console.error("Response headers:", axiosError.response?.headers);
      }
      throw error;
    }
  },

  // Get available time slots for a nursing provider on a specific date
  getAvailableTimeSlots: async (
    providerId: number,
    date: string,
  ): Promise<AvailableTimeSlotsResponse> => {
    console.log("=== FETCHING AVAILABLE TIME SLOTS ===");
    console.log("Provider ID:", providerId);
    console.log("Date:", date);

    const response = await api.get<{ data: AvailableTimeSlotsResponse }>(
      `/nursing-providers/${providerId}/available-time-slots?date=${date}`,
    );

    console.log("Available time slots response:", response.data.data);
    return response.data.data;
  },

  // Unavailable Sessions methods
  getUnavailableSessions: async (): Promise<UnavailableSession[]> => {
    console.log("=== FETCHING UNAVAILABLE SESSIONS ===");
    const response = await api.get<{ data: UnavailableSession[] }>(
      "/nursing-provider/unavailable-sessions",
    );
    console.log("Unavailable sessions response:", response.data.data);
    return response.data.data;
  },

  createUnavailableSession: async (
    sessionData: UnavailableSessionCreateData,
  ): Promise<UnavailableSession> => {
    console.log("=== CREATING UNAVAILABLE SESSION ===");
    console.log("Session data:", sessionData);
    const response = await api.post<{ data: UnavailableSession }>(
      "/nursing-provider/unavailable-sessions",
      sessionData,
    );
    console.log("Created unavailable session:", response.data.data);
    return response.data.data;
  },

  deleteUnavailableSession: async (sessionId: number): Promise<void> => {
    console.log("=== DELETING UNAVAILABLE SESSION ===");
    console.log("Session ID:", sessionId);
    await api.delete(`/nursing-provider/unavailable-sessions/${sessionId}`);
    console.log("Unavailable session deleted successfully");
  },

  getProviderUnavailableSessions: async (
    providerId: number,
    params?: {
      date?: string;
      start_date?: string;
      end_date?: string;
    },
  ): Promise<UnavailableSession[]> => {
    console.log("=== FETCHING PROVIDER UNAVAILABLE SESSIONS (PUBLIC) ===");
    console.log("Provider ID:", providerId);
    console.log("Params:", params);

    const queryParams = new URLSearchParams();
    if (params?.date) queryParams.append("date", params.date);
    if (params?.start_date) queryParams.append("start_date", params.start_date);
    if (params?.end_date) queryParams.append("end_date", params.end_date);

    const response = await api.get<{ data: UnavailableSession[] }>(
      `/nursing-providers/${providerId}/unavailable-sessions?${queryParams.toString()}`,
    );

    console.log("Provider unavailable sessions response:", response.data.data);
    return response.data.data;
  },
};

export default nursingService;
