import React, { useState, useEffect } from "react";
import {
  useParams,
  useNavigate,
  Link,
  useSearchParams,
} from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import nursingService, {
  NursingProvider,
  NursingServiceOffering,
  AvailableTimeSlotsResponse,
  UnavailableSession,
} from "@/services/nursingService";
import { useCalendarBookings } from "@/hooks/useCalendarBookings";
import usePesapalPayment from "@/hooks/usePesapalPayment";
import appointmentService from "@/services/appointmentService";
import {
  Search,
  Bell,
  MessageSquare,
  Calendar as CalendarIcon,
  Package,
  LogOut,
  ChevronLeft,
  Star,
  MapPin,
  Clock,
  Heart,
  Shield,
  Phone,
  Mail,
  Home,
  Users,
  Info,
  CheckCircle,
  X,
  FileText,
  Loader2,
} from "lucide-react";

// Mock data for nursing providers
interface NursingProviderWithServices extends NursingProvider {
  services: NursingServiceOffering[];
  servicesCount: number;
  startingPrice: number;
}

// Mock reviews data (keeping as requested)
const mockReviews = [
  {
    id: 1,
    patientName: "Sarah M.",
    rating: 5,
    comment: "Excellent care and very professional. Highly recommended!",
    date: "2024-01-15",
  },
  {
    id: 2,
    patientName: "John D.",
    rating: 4,
    comment: "Good service, punctual and caring nurses.",
    date: "2024-01-10",
  },
  {
    id: 3,
    patientName: "Mary K.",
    rating: 5,
    comment: "Outstanding service! My mother received excellent care.",
    date: "2024-01-05",
  },
];

const oldNursingProviders = [
  {
    id: 1,
    name: "Nairobi Home Care",
    logo: "https://randomuser.me/api/portraits/women/68.jpg",
    rating: 4.8,
    location: "Nairobi Central",
    startingPrice: 1500,
    availability: "24/7",
    servicesCount: 12,
    description:
      "Professional home nursing care with skilled and compassionate nurses. We offer a range of services from basic care to specialized medical treatments.",
    email: "info@nairobicare.co.ke",
    phone: "+254 712 345 678",
    address: "Kenyatta Avenue, Nairobi",
    operatingHours: "24/7 Service",
    services: [
      {
        id: 1,
        name: "General Nursing Care",
        description:
          "Basic nursing care including medication administration, wound care, and vital signs monitoring.",
        price: 1500,
        duration: "Per visit (1-2 hours)",
      },
      {
        id: 2,
        name: "Specialized Care for Chronic Conditions",
        description:
          "Customized care for patients with diabetes, hypertension, and other chronic conditions.",
        price: 2500,
        duration: "Per visit (2-3 hours)",
      },
      {
        id: 3,
        name: "Post-Surgical Care",
        description:
          "Specialized nursing care for patients recovering from surgery, including wound care and medication management.",
        price: 2800,
        duration: "Per visit (2-3 hours)",
      },
      {
        id: 4,
        name: "Elderly Care",
        description:
          "Comprehensive care for elderly patients, including assistance with activities of daily living and medication management.",
        price: 2200,
        duration: "Per visit (3-4 hours)",
      },
      {
        id: 5,
        name: "Pediatric Home Care",
        description:
          "Specialized nursing care for children with medical needs.",
        price: 2500,
        duration: "Per visit (2-3 hours)",
      },
      {
        id: 6,
        name: "Overnight Nursing",
        description:
          "Round-the-clock nursing care for patients requiring continuous monitoring.",
        price: 4500,
        duration: "12-hour shift",
      },
      {
        id: 7,
        name: "Physical Therapy",
        description:
          "Home-based physical therapy to improve mobility and function.",
        price: 3000,
        duration: "Per session (1 hour)",
      },
      {
        id: 8,
        name: "Medication Management",
        description:
          "Medication administration and monitoring for proper adherence to prescribed regimens.",
        price: 1200,
        duration: "Per visit (1 hour)",
      },
      {
        id: 9,
        name: "Wound Care",
        description: "Specialized care for wound dressing and management.",
        price: 1800,
        duration: "Per visit (1-2 hours)",
      },
      {
        id: 10,
        name: "IV Therapy",
        description:
          "Administration and monitoring of intravenous medications and fluids.",
        price: 2500,
        duration: "Per session (1-2 hours)",
      },
      {
        id: 11,
        name: "Respiratory Care",
        description:
          "Care for patients with respiratory conditions, including oxygen therapy management.",
        price: 2200,
        duration: "Per visit (2 hours)",
      },
      {
        id: 12,
        name: "Palliative Care",
        description:
          "Compassionate care focusing on pain management and comfort for terminally ill patients.",
        price: 3000,
        duration: "Per visit (3-4 hours)",
      },
    ],
    testimonials: [
      {
        id: 1,
        name: "James K.",
        rating: 5,
        comment:
          "The nurses from Nairobi Home Care were exceptional. They provided excellent care for my mother after her surgery.",
        date: "March 10, 2025",
      },
      {
        id: 2,
        name: "Sarah W.",
        rating: 4,
        comment:
          "Professional and compassionate service. The nurses were always on time and very attentive to my father's needs.",
        date: "February 22, 2025",
      },
    ],
  },
  {
    id: 2,
    name: "HomeNurse Kenya",
    logo: "https://randomuser.me/api/portraits/men/42.jpg",
    rating: 4.7,
    location: "Westlands",
    startingPrice: 1800,
    availability: "24/7",
    servicesCount: 15,
    description:
      "Experienced nurses providing quality care in the comfort of your home. Our team includes registered nurses and certified nursing assistants.",
    email: "contact@homenurse.co.ke",
    phone: "+254 723 456 789",
    address: "Waiyaki Way, Westlands, Nairobi",
    operatingHours: "24/7 Service",
    services: [
      {
        id: 1,
        name: "General Nursing Care",
        description:
          "Comprehensive nursing care including vital signs monitoring, medication administration, and patient assessment.",
        price: 1800,
        duration: "Per visit (2 hours)",
      },
      {
        id: 2,
        name: "Specialized Diabetic Care",
        description:
          "Specialized care for diabetic patients including blood glucose monitoring and insulin administration.",
        price: 2200,
        duration: "Per visit (2 hours)",
      },
      {
        id: 3,
        name: "Post-Surgical Care",
        description:
          "Care for patients recovering from surgery, including wound care and pain management.",
        price: 2500,
        duration: "Per visit (2-3 hours)",
      },
      {
        id: 4,
        name: "Eldercare Services",
        description:
          "Comprehensive care for elderly patients focusing on maintaining quality of life and independence.",
        price: 2000,
        duration: "Per visit (3 hours)",
      },
      {
        id: 5,
        name: "Pediatric Nursing",
        description:
          "Specialized nursing care for children with acute or chronic conditions.",
        price: 2300,
        duration: "Per visit (2 hours)",
      },
      {
        id: 6,
        name: "Wound Management",
        description:
          "Advanced wound care including assessment, cleaning, dressing, and monitoring.",
        price: 1900,
        duration: "Per visit (1-2 hours)",
      },
      {
        id: 7,
        name: "24-Hour Nursing Care",
        description:
          "Round-the-clock nursing services for patients requiring continuous care.",
        price: 8500,
        duration: "24 hours",
      },
      {
        id: 8,
        name: "Rehabilitation Support",
        description:
          "Assistance with rehabilitation exercises and activities to improve functional abilities.",
        price: 2700,
        duration: "Per session (1.5 hours)",
      },
      {
        id: 9,
        name: "Respiratory Therapy",
        description:
          "Management of respiratory conditions including oxygen therapy and nebulizer treatments.",
        price: 2400,
        duration: "Per visit (2 hours)",
      },
      {
        id: 10,
        name: "Medication Management",
        description:
          "Organization and administration of medications according to prescribed regimens.",
        price: 1500,
        duration: "Per visit (1 hour)",
      },
      {
        id: 11,
        name: "Hospice Care Support",
        description:
          "Compassionate end-of-life care focusing on comfort and dignity.",
        price: 3200,
        duration: "Per visit (4 hours)",
      },
      {
        id: 12,
        name: "IV Therapy",
        description:
          "Administration of intravenous medications, fluids, and nutrients.",
        price: 2600,
        duration: "Per session (1-2 hours)",
      },
      {
        id: 13,
        name: "Catheter Care",
        description: "Management and care of urinary catheters.",
        price: 1700,
        duration: "Per visit (1 hour)",
      },
      {
        id: 14,
        name: "Nutritional Support",
        description:
          "Assessment of nutritional needs and assistance with feeding or tube feeding.",
        price: 1900,
        duration: "Per visit (2 hours)",
      },
      {
        id: 15,
        name: "Mobility Assistance",
        description:
          "Help with ambulation, transfers, and prevention of falls and injuries.",
        price: 1600,
        duration: "Per visit (2 hours)",
      },
    ],
    testimonials: [
      {
        id: 1,
        name: "David M.",
        rating: 5,
        comment:
          "HomeNurse Kenya provided outstanding care for my wife during her recovery. The nurses were knowledgeable and caring.",
        date: "April 15, 2025",
      },
      {
        id: 2,
        name: "Grace N.",
        rating: 4,
        comment:
          "Very reliable service. The nurses were professional and helped my father recover quickly after his stroke.",
        date: "March 28, 2025",
      },
    ],
  },
  // Add more provider data as needed
];

// Default time slots (fallback)
const defaultTimeSlots = [
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
  "5:00 PM",
  "5:30 PM",
];

const HomeNursingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  // Generate user initials
  const getUserInitials = (name: string) => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  const [provider, setProvider] = useState<NursingProviderWithServices | null>(
    null,
  );
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const [availableTimeSlots, setAvailableTimeSlots] =
    useState<string[]>(defaultTimeSlots);
  const [appointmentDuration, setAppointmentDuration] = useState<number>(30);
  const [loadingTimeSlots, setLoadingTimeSlots] = useState(false);
  const [unavailableSessions, setUnavailableSessions] = useState<
    UnavailableSession[]
  >([]);
  const [loadingUnavailableSessions, setLoadingUnavailableSessions] =
    useState(false);
  const [backendUnavailableSlots, setBackendUnavailableSlots] = useState<
    string[]
  >([]);

  // Calendar booking hook
  const {
    occupiedDates,
    occupiedTimes,
    isLoading: bookingsLoading,
    getOccupiedTimesForDate,
    isDateOccupied,
    isTimeOccupied,
  } = useCalendarBookings({
    providerId: provider?.id || 0,
    providerType: "nursing",
  });

  // Pesapal payment hook
  const {
    initiatePayment: initiatePesapalPayment,
    isProcessing: pesapalProcessing,
    paymentStatus: pesapalPaymentStatus,
    resetPayment: resetPesapalPayment,
  } = usePesapalPayment({
    onError: (error) => {
      setIsProcessing(false);
      console.error("Payment error:", error);
    },
  });

  // Check for booking success parameter
  useEffect(() => {
    const bookingSuccess = searchParams.get("booking_success");
    if (bookingSuccess === "true") {
      setIsSuccess(true);
      // Clean up the URL parameter
      const newSearchParams = new URLSearchParams(searchParams);
      newSearchParams.delete("booking_success");
      navigate(
        `/patient-dashboard/nursing/${id}?${newSearchParams.toString()}`,
        { replace: true },
      );
    }
  }, [searchParams, navigate, id]);

  // Fetch provider data when component mounts
  useEffect(() => {
    const fetchProviderData = async () => {
      try {
        setLoading(true);
        const providerId = parseInt(id);
        console.log("Fetching provider details for ID:", providerId);

        // Fetch provider details
        const providerData =
          await nursingService.getNursingProvider(providerId);
        console.log("Fetched provider data:", providerData);

        // Try to get services from relationship first, then fallback to direct API call
        let services = providerData.nursingServiceOfferings || [];
        console.log("Raw services from API relationship:", services);
        console.log("Services length from relationship:", services.length);

        // If no services in the relationship, fetch them directly using provider ID
        if (services.length === 0) {
          try {
            console.log(
              "No services in relationship, fetching directly for provider:",
              providerId,
            );
            services =
              await nursingService.getProviderServiceOfferings(providerId);
            console.log("Services fetched directly for provider:", services);
          } catch (serviceError) {
            console.error(
              "Error fetching service offerings directly:",
              serviceError,
            );
            services = [];
          }
        }

        console.log("Provider service areas:", providerData.service_areas);
        console.log("Provider base rate:", providerData.base_rate_per_hour);

        const providerWithServices: NursingProviderWithServices = {
          ...providerData,
          services: services,
          servicesCount: services.length,
          startingPrice:
            services.length > 0
              ? Math.min(...services.map((s) => s.price))
              : providerData.base_rate_per_hour || 2500,
        };

        setProvider(providerWithServices);
        console.log("Provider with services:", providerWithServices);
        console.log("Final services array:", providerWithServices.services);
      } catch (error) {
        console.error("Error fetching provider details:", error);
        // Set error state instead of immediate redirect
        setProvider(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProviderData();
    }
  }, [id, navigate]);

  // Function to fetch unavailable sessions for the selected date
  const fetchUnavailableSessions = async (selectedDate: Date) => {
    if (!provider?.id) return;

    setLoadingUnavailableSessions(true);
    try {
      console.log("=== FETCHING UNAVAILABLE SESSIONS ===");
      console.log("Provider ID:", provider.id);
      console.log("Selected Date:", selectedDate.toISOString().split("T")[0]);

      const sessions = await nursingService.getProviderUnavailableSessions(
        provider.id,
        { date: selectedDate.toISOString().split("T")[0] },
      );

      console.log("Unavailable sessions response:", sessions);
      setUnavailableSessions(sessions);

      console.log("=== UNAVAILABLE SESSIONS DEBUG ===");
      console.log(
        `Found ${sessions.length} unavailable sessions for date ${selectedDate.toISOString().split("T")[0]}`,
      );
      sessions.forEach((session) => {
        console.log(
          `📅 Session: ${session.date} from ${session.start_time} to ${session.end_time}`,
        );
        console.log(`💭 Reason: ${session.reason || "No reason provided"}`);
      });
    } catch (error) {
      console.error("Failed to fetch unavailable sessions:", error);
      setUnavailableSessions([]);
    } finally {
      setLoadingUnavailableSessions(false);
    }
  };

  // Function to check if a time slot is unavailable (now using backend response)
  const isTimeUnavailable = (timeSlot: string): boolean => {
    return backendUnavailableSlots.includes(timeSlot);
  };

  // Function to fetch dynamic time slots based on provider's availability settings
  const fetchAvailableTimeSlots = async (selectedDate: Date) => {
    if (!provider?.id) return;

    setLoadingTimeSlots(true);
    try {
      console.log("=== FETCHING DYNAMIC TIME SLOTS ===");
      console.log("Provider ID:", provider.id);
      console.log("Selected Date:", selectedDate.toISOString().split("T")[0]);

      // Apply day offset correction for availability schedule - add one day to fix day-of-week mapping issue
      const adjustedDate = new Date(selectedDate);
      adjustedDate.setDate(adjustedDate.getDate() + 1);

      const response = await nursingService.getAvailableTimeSlots(
        provider.id,
        adjustedDate.toISOString().split("T")[0],
      );

      console.log("Available time slots response:", response);

      setAvailableTimeSlots(response.available_slots);
      setAppointmentDuration(response.appointment_duration_minutes);

      // Set backend unavailable slots for gray styling (these come from the adjusted date for day-of-week schedule)
      setBackendUnavailableSlots(response.unavailable_slots || []);

      // Also fetch unavailable sessions for this date (for modal display) - use actual date, not adjusted
      await fetchUnavailableSessions(selectedDate);

      // Then trigger occupation times fetch - use actual date, not adjusted
      await getOccupiedTimesForDate(selectedDate);

      console.log(
        `🔄 Loaded: ${unavailableSessions.length} sessions, ${response.unavailable_slots?.length || 0} unavailable slots`,
      );
    } catch (error) {
      console.error("Failed to fetch available time slots:", error);
      // Fallback to default time slots
      setAvailableTimeSlots(defaultTimeSlots);
      setAppointmentDuration(30);
    } finally {
      setLoadingTimeSlots(false);
    }
  };

  // Filter services based on search term
  const filteredServices =
    provider?.services.filter(
      (service) =>
        searchTerm === "" ||
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-secondary-green" />
          <p className="text-gray-600">Loading provider details...</p>
        </div>
      </div>
    );
  }

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Provider not found</p>
          <Button
            onClick={() => navigate("/patient-dashboard/nursing")}
            className="mt-4"
          >
            Back to Providers
          </Button>
        </div>
      </div>
    );
  }

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className="h-4 w-4 fill-yellow-400 text-yellow-400"
        />,
      );
    }

    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>,
      );
    }

    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const handleServiceSelection = (serviceId) => {
    setSelectedServices((prev) => {
      if (prev.includes(serviceId)) {
        return prev.filter((id) => id !== serviceId);
      } else {
        return [...prev, serviceId];
      }
    });
  };

  const handleTimeSlotSelection = (slot) => {
    // Don't allow selection of unavailable slots
    if (isTimeUnavailable(slot)) {
      console.log("Cannot select unavailable time slot:", slot);
      return;
    }
    setTimeSlot(slot);
  };

  const handleBookAppointment = () => {
    if (selectedServices.length === 0) {
      toast({
        title: "Select Services",
        description: "Please select at least one service",
        variant: "destructive",
      });
      return;
    }

    if (!date) {
      toast({
        title: "Select a date",
        description: "Please select an appointment date",
        variant: "destructive",
      });
      return;
    }

    if (!timeSlot) {
      toast({
        title: "Select a time slot",
        description: "Please select an appointment time",
        variant: "destructive",
      });
      return;
    }

    // Open payment modal
    setIsPaymentModalOpen(true);
  };

  const processPayment = async () => {
    if (!user || !provider) {
      toast({
        title: "Missing Information",
        description: "User or provider information is not available.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);

    try {
      // Both M-Pesa and Card options use Pesapal
      // Prepare booking data
      const appointmentDateTime = new Date(date);
      const [time, period] = timeSlot.split(" ");
      const [hours, minutes] = time.split(":");
      let hour24 = parseInt(hours);

      if (period === "PM" && hour24 !== 12) {
        hour24 += 12;
      } else if (period === "AM" && hour24 === 12) {
        hour24 = 0;
      }

      appointmentDateTime.setHours(hour24, parseInt(minutes), 0, 0);

      // Calculate default service duration (2 hours for most services)
      const serviceDuration = 2;
      const endDateTime = new Date(appointmentDateTime);
      endDateTime.setHours(endDateTime.getHours() + serviceDuration);

      const selectedServiceNames = selectedServices
        .map((serviceId) => {
          const service = provider?.services.find((s) => s.id === serviceId);
          return service?.name;
        })
        .filter(Boolean)
        .join(", ");

      const paymentResponse = await initiatePesapalPayment({
        amount: Math.round(Number(totalPrice) || 0),
        email: user.email || "patient@example.com",
        phone_number: "+254722549387", // Default phone number
        first_name: user.name?.split(" ")[0] || "Patient",
        last_name: user.name?.split(" ").slice(1).join(" ") || "User",
        description: `Home nursing services from ${provider?.provider_name || provider?.user.name}`,
        lab_provider_id: provider.id, // Using provider.id as reference
        patient_id: user.id,
        booking_data: {
          patient_id: user.id,
          nursing_provider_id: provider.id,
          service_ids: selectedServices,
          appointment_datetime: appointmentDateTime.toISOString(),
          end_datetime: endDateTime.toISOString(),
          total_amount: Math.round(Number(totalPrice)),
          service_names: selectedServiceNames,
        },
      });

      // Store booking data with merchant reference for future use (frontend backup)
      if (paymentResponse.merchantReference) {
        const bookingData = {
          patient_id: user.id,
          nursing_provider_id: provider.id,
          service_ids: selectedServices,
          appointment_datetime: appointmentDateTime.toISOString(),
          end_datetime: endDateTime.toISOString(),
          total_amount: Math.round(Number(totalPrice)),
          service_names: selectedServiceNames,
        };

        localStorage.setItem(
          `nursing_booking_${paymentResponse.merchantReference}`,
          JSON.stringify(bookingData),
        );
      }
    } catch (error) {
      setIsProcessing(false);
      console.error("Pesapal payment initiation failed:", error);
    }
  };

  // Calculate total price
  const totalPrice = selectedServices.reduce((sum, serviceId) => {
    const service = provider?.services.find((s) => s.id === serviceId);
    const price = service?.price;
    console.log(
      "Debug - Service price raw:",
      price,
      "Type:",
      typeof price,
      "Service:",
      service?.name,
    );
    // Convert decimal string to number and remove any extra decimals
    const numericPrice = parseFloat(String(price)) || 0;
    console.log(
      "Debug - Parsed price:",
      numericPrice,
      "Current sum:",
      sum,
      "New sum:",
      sum + numericPrice,
    );
    return sum + numericPrice;
  }, 0);
  console.log(
    "Debug - Final total price:",
    totalPrice,
    "Type:",
    typeof totalPrice,
  );

  if (!provider) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-white">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          {/* Logo & User Profile */}
          <div className="flex items-center gap-2">
            <Link to="/patient-dashboard">
              <div className="h-10 w-10 rounded-full bg-secondary-green/80 flex items-center justify-center text-white font-bold">
                AM
              </div>
            </Link>
            <Link to="/patient-dashboard">
              <span className="font-semibold text-xl font-playfair">
                <span className="text-primary-blue">AFYA</span>
                <span className="text-secondary-green"> MAWINGUNI</span>
              </span>
            </Link>
          </div>


          {/* User Actions */}
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full border-none hover:bg-green-50"
            >
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full border-none hover:bg-green-50"
            >
              <MessageSquare className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </Button>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="font-medium text-sm">
                  {user?.name || "User"}
                </span>
              </div>
              <Avatar className="h-9 w-9 border-2 border-secondary-green/20">
                <AvatarFallback className="bg-secondary-green/10 text-secondary-green font-semibold">
                  {getUserInitials(user?.name || "")}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            className="flex items-center text-gray-600"
            onClick={() => navigate("/patient-dashboard/nursing")}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Home Nursing
          </Button>
        </div>

        {/* Provider Profile Section */}
        <Card className="mb-6 overflow-hidden border-0 shadow-md">
          <div className="bg-gradient-to-r from-green-500/90 to-teal-500/90 text-white p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-28 w-28 border-4 border-white/30 shadow-lg">
                  <AvatarImage
                    src={provider.logo}
                    alt={provider.provider_name || provider.user.name}
                  />
                  <AvatarFallback>
                    {(provider.provider_name || provider.user.name).charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between md:items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">
                      {provider.provider_name || provider.user.name}
                    </h1>
                  </div>

                  <div className="flex items-center mt-3 md:mt-0">
                    <div className="flex mr-2">
                      {renderStars(provider.average_rating)}
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-white/20 border-white/30 text-white p-1"
                    >
                      {provider.average_rating} / 5
                    </Badge>
                  </div>
                </div>

                <p className="opacity-90 mb-4 max-w-3xl">
                  {provider.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <MapPin className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Location</div>
                      <div className="font-bold text-lg">
                        {provider.location ||
                          "Location not specified"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Heart className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Services</div>
                      <div className="font-bold text-lg">
                        {provider.servicesCount}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Rating</div>
                      <div className="font-bold text-lg">
                        {provider.average_rating || 0}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Provider Information and Services */}
        <Card className="border-0 shadow-md overflow-hidden mb-6">
          <CardContent className="p-6">
            <Tabs defaultValue="services">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
              </TabsList>

              <TabsContent value="services" className="space-y-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    type="search"
                    placeholder="Search for services..."
                    className="pl-10 w-full border-gray-200 focus-visible:ring-secondary-green"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="space-y-3">
                  {filteredServices.map((service) => (
                    <div
                      key={service.id}
                      className={`p-5 rounded-lg ${
                        selectedServices.includes(service.id)
                          ? "bg-green-50 border-2 border-green-500 shadow-md"
                          : "border border-gray-200 hover:border-gray-300 hover:shadow-sm"
                      } transition-all duration-300`}
                    >
                      <div className="flex items-start">
                        <Checkbox
                          id={`service-${service.id}`}
                          checked={selectedServices.includes(service.id)}
                          onCheckedChange={() =>
                            handleServiceSelection(service.id)
                          }
                          className="mt-1"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            <Label
                              htmlFor={`service-${service.id}`}
                              className="font-medium text-lg cursor-pointer"
                            >
                              {service.name}
                            </Label>
                            <div className="mt-1 md:mt-0">
                              <span className="font-bold text-green-600">
                                KES {service.price}
                              </span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">
                            {service.description}
                          </p>
                          <div className="flex items-center mt-1 text-xs text-gray-500">
                            <Users className="h-3 w-3 mr-1" />
                            Experience: {service.experience}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredServices.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No services available for this provider.</p>
                      <p className="text-xs mt-2">
                        Provider ID: {provider?.id}, Total services in DB:{" "}
                        {provider?.services?.length || 0}
                      </p>
                      <p className="text-xs">Search term: "{searchTerm}"</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderStars(provider.average_rating)}
                    </div>
                    <span className="text-lg font-bold">
                      {provider.average_rating}/5
                    </span>
                    <span className="text-gray-500 ml-2">
                      ({mockReviews.length} reviews)
                    </span>
                  </div>

                  {mockReviews.map((review) => (
                    <Card key={review.id} className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{review.patientName}</h4>
                          <span className="text-gray-500 text-sm">
                            {review.date}
                          </span>
                        </div>
                        <div className="flex mb-2">
                          {renderStars(review.rating)}
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        {/* Booking Section - Now vertically aligned */}
        <Card className="border-0 shadow-md overflow-hidden mb-6">
          <div className="bg-green-500 p-4 text-white">
            <h2 className="text-xl font-bold">Book Home Nursing</h2>
            <p className="text-sm opacity-90">Select services, date and time</p>
          </div>
          <CardContent className="p-6">
            {/* Selected Services Summary */}
            <div className="mb-6">
              <Label className="mb-2 block font-medium">
                Selected Services ({selectedServices.length})
              </Label>

              {selectedServices.length > 0 ? (
                <div className="border rounded-lg p-4 bg-green-50 space-y-2">
                  {selectedServices.map((serviceId) => {
                    const service = provider.services.find(
                      (s) => s.id === serviceId,
                    );
                    return (
                      <div
                        key={serviceId}
                        className="flex justify-between text-sm"
                      >
                        <span className="text-gray-700">{service?.name}</span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between font-medium pt-2 border-t mt-2">
                    <span>Total Amount:</span>
                    <span className="text-green-600 font-bold">
                      KES {Math.round(totalPrice)}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-red-50 text-center text-red-500 border-red-200">
                  <p>Please select at least one service above</p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Select Date */}
              <div>
                <Label className="mb-2 block font-medium">Select Date</Label>
                <div className="border rounded-md p-1 shadow-sm bg-white max-w-full">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={async (selectedDate) => {
                      setDate(selectedDate);
                      setTimeSlot(null); // Reset time slot when date changes
                      if (selectedDate) {
                        await fetchAvailableTimeSlots(selectedDate);
                      }
                    }}
                    disabled={(date) => {
                      // Disable dates in the past
                      return date < new Date(new Date().setHours(0, 0, 0, 0));
                    }}
                    modifiers={{
                      booked: (date) => isDateOccupied(date),
                    }}
                    modifiersStyles={{
                      booked: {
                        backgroundColor: "#ef4444",
                        color: "white",
                        fontWeight: "bold",
                      },
                    }}
                    className="rounded-md border-none"
                  />
                </div>
                {/* Legend */}
                <div className="flex items-center gap-4 mt-2 text-xs">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded"></div>
                    <span>Fully Booked</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded"></div>
                    <span>Available</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-orange-500 rounded"></div>
                    <span>Limited Slots</span>
                  </div>
                </div>
                {bookingsLoading && (
                  <div className="flex items-center gap-2 mt-2 text-xs text-gray-500">
                    <div className="animate-spin h-3 w-3 border border-gray-300 border-t-transparent rounded-full"></div>
                    <span>Loading availability...</span>
                  </div>
                )}
              </div>

              {/* Select Time */}
              <div>
                <Label className="mb-2 block font-medium">Select Time</Label>
                {!date ? (
                  <div className="border rounded-md p-3 shadow-sm bg-gray-50 h-[250px] flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">Please select a date first</p>
                    </div>
                  </div>
                ) : (
                  <div className="border rounded-md p-3 shadow-sm bg-white overflow-y-auto h-[250px]">
                    {bookingsLoading ? (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-green-500 rounded-full mx-auto mb-2"></div>
                          <p className="text-sm text-gray-500">
                            Loading time slots...
                          </p>
                        </div>
                      </div>
                    ) : loadingTimeSlots || loadingUnavailableSessions ? (
                      <div className="py-8">
                        <div className="text-center">
                          <div className="animate-spin h-6 w-6 border-2 border-gray-300 border-t-green-500 rounded-full mx-auto mb-2"></div>
                          <p className="text-sm text-gray-500">
                            {loadingTimeSlots
                              ? "Loading available time slots..."
                              : "Loading unavailable sessions..."}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          {availableTimeSlots.map((slot) => {
                            const isOccupied = isTimeOccupied(slot);
                            const isUnavailable = isTimeUnavailable(slot);
                            const isSelected = timeSlot === slot;
                            const isDisabled = isOccupied || isUnavailable;

                            return (
                              <div
                                key={slot}
                                className={`py-2 px-1 text-center text-sm rounded-md border transition-all duration-200 ${
                                  isOccupied
                                    ? "bg-red-100 text-red-700 border-red-300 cursor-not-allowed opacity-75"
                                    : isUnavailable
                                      ? "bg-gray-100 text-gray-700 border-gray-300 cursor-not-allowed opacity-75"
                                      : isSelected
                                        ? "bg-green-500 text-white border-green-500 cursor-pointer shadow-md transform scale-105"
                                        : "border-gray-200 hover:border-green-300 hover:bg-green-50 cursor-pointer hover:shadow-sm"
                                }`}
                                onClick={() =>
                                  !isDisabled && handleTimeSlotSelection(slot)
                                }
                                title={
                                  isOccupied
                                    ? "This time slot is already booked for nursing services"
                                    : isUnavailable
                                      ? "This time slot is unavailable due to provider's schedule"
                                      : isSelected
                                        ? "Selected time slot"
                                        : "Click to select this time slot"
                                }
                              >
                                <div className="font-medium">{slot}</div>
                                {isOccupied && (
                                  <div className="text-xs mt-0.5 flex items-center justify-center gap-1">
                                    <X className="h-3 w-3" />
                                    Booked
                                  </div>
                                )}
                                {isUnavailable && (
                                  <div className="text-xs mt-0.5 flex items-center justify-center gap-1">
                                    <X className="h-3 w-3" />
                                    Unavailable
                                  </div>
                                )}
                                {!isDisabled && !isSelected && (
                                  <div className="text-xs mt-0.5 text-green-600">
                                    Available
                                  </div>
                                )}
                                {isSelected && (
                                  <div className="text-xs mt-0.5 flex items-center justify-center gap-1">
                                    <CheckCircle className="h-3 w-3" />
                                    Selected
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Time slots summary */}
                        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 mb-2">
                            <span>
                              Available slots:{" "}
                              {
                                availableTimeSlots.filter(
                                  (slot) =>
                                    !isTimeOccupied(slot) &&
                                    !backendUnavailableSlots.includes(slot),
                                ).length
                              }
                            </span>
                            <span>
                              Booked slots:{" "}
                              {
                                availableTimeSlots.filter((slot) =>
                                  isTimeOccupied(slot),
                                ).length
                              }
                            </span>
                            <span>
                              Unavailable slots:{" "}
                              {backendUnavailableSlots.length}
                            </span>
                          </div>

                          {/* Legend */}
                          <div className="flex justify-between items-center text-xs text-gray-600">
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-green-500 rounded"></div>
                              <span>Available</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-red-500 rounded"></div>
                              <span>Booked</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <div className="w-3 h-3 bg-gray-500 rounded"></div>
                              <span>Unavailable</span>
                            </div>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                            <div
                              className="bg-red-500 h-2 rounded-full transition-all duration-300"
                              style={{
                                width: `${(availableTimeSlots.filter((slot) => isTimeOccupied(slot)).length / availableTimeSlots.length) * 100}%`,
                              }}
                            ></div>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}

                {/* Popular times notice for nursing services */}
                {date && (
                  <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
                    <div className="flex items-start gap-2">
                      <Clock className="h-4 w-4 text-blue-500 mt-0.5 flex-shrink-0" />
                      <div className="text-xs text-blue-700">
                        <div className="font-medium">Nursing Service Hours</div>
                        <div>
                          Morning slots (8-11 AM) are popular for elderly care.
                          Evening slots (4-6 PM) are in high demand for
                          post-work visits.
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <Button
              className="w-full mt-6"
              onClick={handleBookAppointment}
              disabled={selectedServices.length === 0 || !date || !timeSlot}
            >
              Proceed to Payment
            </Button>

            <p className="text-xs text-gray-500 text-center mt-3">
              By booking, you agree to our terms and conditions
            </p>
          </CardContent>
        </Card>
      </main>

      {/* Payment Modal */}
      {isPaymentModalOpen && !isSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-5">
              <h2 className="text-xl font-bold">Complete Your Booking</h2>
              <p className="text-sm opacity-90">
                Make payment to confirm your appointment
              </p>
            </div>
            <CardContent className="p-6">
              <div className="mb-6 border-b pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium">
                    {provider.provider_name || provider.user.name}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Services:</span>
                  <span className="font-medium">
                    {selectedServices.length} selected
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">
                    {date?.toLocaleDateString("en-GB")} at {timeSlot}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total Amount:</span>
                  <span className="text-green-600">
                    KES {Math.round(totalPrice)}
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setIsPaymentModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  onClick={processPayment}
                  disabled={isProcessing || pesapalProcessing}
                >
                  {isProcessing || pesapalProcessing
                    ? "Processing..."
                    : "Make Payment"}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Success Modal */}
      {isSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <CardContent className="p-8 text-center">
              <div className="bg-green-100 rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="h-10 w-10 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold text-green-700 mb-2">
                Booking Successful!
              </h2>
              <p className="text-gray-600 mb-6">
                Your home nursing appointment has been scheduled for{" "}
                {date?.toLocaleDateString("en-GB")} at {timeSlot}.
              </p>
              <Button
                className="w-full"
                onClick={() => navigate("/patient-dashboard/appointments")}
              >
                View My Appointments
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default HomeNursingDetails;
