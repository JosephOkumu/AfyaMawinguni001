import { useState, useEffect } from "react";
import appointmentService from "@/services/appointmentService";
import api from "@/services/api";

interface UseCalendarBookingsProps {
  providerId: number;
  providerType: "doctor" | "nursing" | "lab";
}

interface UseCalendarBookingsReturn {
  occupiedDates: string[];
  occupiedTimes: string[];
  selectedDate: Date | undefined;
  isLoading: boolean;
  error: string | null;
  getOccupiedTimesForDate: (date: Date) => Promise<void>;
  isDateOccupied: (date: Date) => boolean;
  isTimeOccupied: (time: string) => boolean;
}

// All available time slots for providers
const ALL_TIME_SLOTS = [
  "7:00 AM",
  "7:30 AM",
  "8:00 AM",
  "8:30 AM",
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "11:30 AM",
  "12:00 PM",
  "12:30 PM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
  "4:30 PM",
];

export const useCalendarBookings = ({
  providerId,
  providerType,
}: UseCalendarBookingsProps): UseCalendarBookingsReturn => {
  const [occupiedDates, setOccupiedDates] = useState<string[]>([]);
  const [occupiedTimes, setOccupiedTimes] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch occupied dates when provider changes
  useEffect(() => {
    const fetchOccupiedDates = async () => {
      if (!providerId) return;

      setIsLoading(true);
      setError(null);

      try {
        let fullyBookedDates: string[] = [];

        // Get dates where all time slots are booked based on real appointments
        if (providerType === "doctor") {
          fullyBookedDates =
            await appointmentService.getDoctorOccupiedDates(providerId);
        } else if (providerType === "nursing") {
          fullyBookedDates =
            await appointmentService.getNursingProviderOccupiedDates(
              providerId,
            );
        } else if (providerType === "lab") {
          // Lab provider fully booked dates - check when all time slots are occupied
          const response = await api.get(
            `/lab-providers/${providerId}/fully-booked-dates`,
          );
          fullyBookedDates = response.data.data;
        }

        setOccupiedDates(fullyBookedDates);
      } catch (err) {
        console.error("Error fetching fully booked dates:", err);
        setError("Failed to load availability");
        setOccupiedDates([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOccupiedDates();
  }, [providerId, providerType]);

  // Function to get occupied times for a specific date
  const getOccupiedTimesForDate = async (date: Date) => {
    if (!providerId || !date) return;

    setIsLoading(true);
    setError(null);
    setSelectedDate(date);

    try {
      const dateString = date.toISOString().split("T")[0]; // YYYY-MM-DD format
      let times: string[] = [];

      // Get occupied times based on real appointments with successful payments
      if (providerType === "doctor") {
        times = await appointmentService.getDoctorOccupiedTimes(
          providerId,
          dateString,
        );
      } else if (providerType === "nursing") {
        times = await appointmentService.getNursingProviderOccupiedTimes(
          providerId,
          dateString,
        );
      } else if (providerType === "lab") {
        // Lab provider occupied times - API endpoint exists
        const response = await api.get(
          `/lab-providers/${providerId}/occupied-times?date=${dateString}`,
        );
        times = response.data.data;
      }

      setOccupiedTimes(times);
    } catch (err) {
      console.error("Error fetching occupied times:", err);
      setError("Failed to load occupied times");
      setOccupiedTimes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if a date is fully booked (all time slots occupied)
  const isDateOccupied = (date: Date): boolean => {
    const dateString = date.toISOString().split("T")[0];
    return occupiedDates.includes(dateString);
  };

  // Helper function to check if a time is occupied
  const isTimeOccupied = (time: string): boolean => {
    return occupiedTimes.includes(time);
  };

  return {
    occupiedDates,
    occupiedTimes,
    selectedDate,
    isLoading,
    error,
    getOccupiedTimesForDate,
    isDateOccupied,
    isTimeOccupied,
  };
};

export default useCalendarBookings;
