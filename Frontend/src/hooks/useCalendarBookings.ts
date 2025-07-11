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

// Dummy occupied dates for demonstration (will be removed when payment features are implemented)
const getDummyOccupiedDates = (): string[] => {
  const dates = [];
  const today = new Date();

  // Add some dates in the next 30 days as occupied
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);

    // Make certain days fully booked (e.g., every 3rd day)
    if (i % 3 === 0 || i % 7 === 0) {
      dates.push(date.toISOString().split("T")[0]);
    }
  }

  return dates;
};

// Dummy occupied times for demonstration
const getDummyOccupiedTimes = (dateString: string): string[] => {
  const occupiedTimes = [];
  const date = new Date(dateString);
  const dayOfWeek = date.getDay();

  // Different patterns for different days
  if (dayOfWeek === 1) {
    // Monday - busy morning
    occupiedTimes.push("8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM");
  } else if (dayOfWeek === 2) {
    // Tuesday - afternoon busy
    occupiedTimes.push("1:00 PM", "1:30 PM", "2:00 PM", "2:30 PM", "3:00 PM");
  } else if (dayOfWeek === 3) {
    // Wednesday - scattered
    occupiedTimes.push("8:00 AM", "10:30 AM", "12:30 PM", "3:30 PM", "5:00 PM");
  } else if (dayOfWeek === 4) {
    // Thursday - evening busy
    occupiedTimes.push(
      "3:00 PM",
      "3:30 PM",
      "4:00 PM",
      "4:30 PM",
      "5:00 PM",
      "5:30 PM",
    );
  } else if (dayOfWeek === 5) {
    // Friday - all day busy
    occupiedTimes.push(
      "8:00 AM",
      "9:00 AM",
      "10:00 AM",
      "11:00 AM",
      "1:00 PM",
      "2:00 PM",
      "3:00 PM",
      "4:00 PM",
    );
  } else if (dayOfWeek === 6) {
    // Saturday - half day
    occupiedTimes.push("8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM");
  }
  // Sunday - mostly available

  return occupiedTimes;
};

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
        let dates: string[] = [];

        // For demonstration purposes, use dummy data
        // This will be replaced with real API calls when payment features are implemented
        dates = getDummyOccupiedDates();

        /* Real API calls (commented out for demo):
        if (providerType === "doctor") {
          dates = await appointmentService.getDoctorOccupiedDates(providerId);
        } else if (providerType === "nursing") {
          dates = await appointmentService.getNursingProviderOccupiedDates(providerId);
        } else if (providerType === "lab") {
          // Lab provider occupied dates - API endpoint exists
          const response = await api.get(`/lab-providers/${providerId}/occupied-dates`);
          dates = response.data.data;
        }
        */

        setOccupiedDates(dates);
      } catch (err) {
        console.error("Error fetching occupied dates:", err);
        setError("Failed to load occupied dates");
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

      // For demonstration purposes, use dummy data
      // This will be replaced with real API calls when payment features are implemented
      times = getDummyOccupiedTimes(dateString);

      /* Real API calls (commented out for demo):
      if (providerType === "doctor") {
        times = await appointmentService.getDoctorOccupiedTimes(providerId, dateString);
      } else if (providerType === "nursing") {
        times = await appointmentService.getNursingProviderOccupiedTimes(providerId, dateString);
      } else if (providerType === "lab") {
        // Lab provider occupied times - API endpoint exists
        const response = await api.get(`/lab-providers/${providerId}/occupied-times?date=${dateString}`);
        times = response.data.data;
      }
      */

      setOccupiedTimes(times);
    } catch (err) {
      console.error("Error fetching occupied times:", err);
      setError("Failed to load occupied times");
      setOccupiedTimes([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to check if a date is occupied
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
