import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
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
} from "lucide-react";

// Mock data for nursing providers
const nursingProviders = [
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

// Available time slots
const timeSlots = [
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

  const [provider, setProvider] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Find provider by ID when component mounts
  useEffect(() => {
    const foundProvider = nursingProviders.find((p) => p.id === parseInt(id));
    if (foundProvider) {
      setProvider(foundProvider);
    } else {
      // Redirect if provider not found
      navigate("/patient-dashboard/nursing");
    }
  }, [id, navigate]);

  // Filter services based on search term
  const filteredServices =
    provider?.services.filter(
      (service) =>
        searchTerm === "" ||
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase()),
    ) || [];

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

  const processPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      toast({
        title: "Appointment Booked!",
        description:
          "Your home nursing appointment has been successfully scheduled.",
        variant: "default",
      });

      // Redirect after a short delay
      setTimeout(() => {
        navigate("/patient-dashboard/appointments");
      }, 2000);
    }, 2000);
  };

  // Calculate total price
  const totalPrice = selectedServices.reduce((sum, serviceId) => {
    const service = provider?.services.find((s) => s.id === serviceId);
    return sum + (service?.price || 0);
  }, 0);

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

          {/* Search Bar */}
          <div className="relative hidden md:block max-w-md w-full mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for services..."
              className="pl-10 w-full border-gray-200 focus-visible:ring-secondary-green"
            />
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
                <span className="text-xs text-gray-500">Patient</span>
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
                  <AvatarImage src={provider.logo} alt={provider.name} />
                  <AvatarFallback>{provider.name.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between md:items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{provider.name}</h1>
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 opacity-80 mr-1" />
                      <span className="opacity-90">{provider.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center mt-3 md:mt-0">
                    <div className="flex mr-2">
                      {renderStars(provider.rating)}
                    </div>
                    <Badge
                      variant="outline"
                      className="bg-white/20 border-white/30 text-white p-1"
                    >
                      {provider.rating} / 5
                    </Badge>
                  </div>
                </div>

                <p className="opacity-90 mb-4 max-w-3xl">
                  {provider.description}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Availability</div>
                      <div className="font-bold text-lg">
                        {provider.availability}
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
                      <div className="text-sm opacity-80">Starting Price</div>
                      <div className="font-bold text-lg">
                        KES {provider.startingPrice}
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
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="services">Services</TabsTrigger>
                <TabsTrigger value="about">About</TabsTrigger>
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
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            Duration: {service.duration}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}

                  {filteredServices.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <p>No services match your search criteria.</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="about" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-green-700 mb-2">
                    About {provider.name}
                  </h3>
                  <p className="text-gray-700">{provider.description}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                    <CardContent className="p-5">
                      <h4 className="font-medium mb-3 flex items-center text-green-700">
                        <Home className="h-4 w-4 mr-2 text-gray-500" />
                        Address
                      </h4>
                      <p className="text-sm text-gray-700">
                        {provider.address}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                    <CardContent className="p-5">
                      <h4 className="font-medium mb-3 flex items-center text-green-700">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        Operating Hours
                      </h4>
                      <p className="text-sm text-gray-700">
                        {provider.operatingHours}
                      </p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                    <CardContent className="p-5">
                      <h4 className="font-medium mb-3 flex items-center text-green-700">
                        <Phone className="h-4 w-4 mr-2 text-gray-500" />
                        Contact Number
                      </h4>
                      <p className="text-sm text-gray-700">{provider.phone}</p>
                    </CardContent>
                  </Card>

                  <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                    <CardContent className="p-5">
                      <h4 className="font-medium mb-3 flex items-center text-green-700">
                        <Mail className="h-4 w-4 mr-2 text-gray-500" />
                        Email Address
                      </h4>
                      <p className="text-sm text-gray-700">{provider.email}</p>
                    </CardContent>
                  </Card>
                </div>

                <Card className="bg-yellow-50 border border-yellow-200 overflow-hidden shadow-sm">
                  <CardContent className="p-5">
                    <div className="flex items-start">
                      <Info className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                      <div>
                        <h4 className="font-medium text-yellow-700 mb-2">
                          Important Information
                        </h4>
                        <ul className="text-sm text-yellow-700 space-y-2 list-disc ml-4">
                          <li>
                            Our nurses are fully certified and registered with
                            the Nursing Council of Kenya.
                          </li>
                          <li>
                            We conduct thorough background checks on all our
                            staff for your safety.
                          </li>
                          <li>
                            Appointments can be rescheduled with at least 6
                            hours notice.
                          </li>
                          <li>
                            In case of emergencies, please contact our 24/7
                            support line.
                          </li>
                          <li>Payment is required at the time of booking.</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="reviews">
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderStars(provider.rating)}
                    </div>
                    <span className="text-lg font-bold">
                      {provider.rating}/5
                    </span>
                    <span className="text-gray-500 ml-2">
                      ({provider.testimonials?.length || 0} reviews)
                    </span>
                  </div>

                  {provider.testimonials?.map((testimonial) => (
                    <Card key={testimonial.id} className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{testimonial.name}</h4>
                          <span className="text-gray-500 text-sm">
                            {testimonial.date}
                          </span>
                        </div>
                        <div className="flex mb-2">
                          {renderStars(testimonial.rating)}
                        </div>
                        <p className="text-gray-700">{testimonial.comment}</p>
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
                        <span className="text-gray-900">
                          KES {service?.price}
                        </span>
                      </div>
                    );
                  })}
                  <div className="flex justify-between font-medium pt-2 border-t mt-2">
                    <span>Total Amount:</span>
                    <span className="text-green-600 font-bold">
                      KES {totalPrice}
                    </span>
                  </div>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50 text-center text-gray-500">
                  <p>Please select at least one service</p>
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
                    onSelect={setDate}
                    disabled={(date) => {
                      // Disable dates in the past
                      return date < new Date(new Date().setHours(0, 0, 0, 0));
                    }}
                    className="rounded-md border-none"
                  />
                </div>
              </div>

              {/* Select Time */}
              <div>
                <Label className="mb-2 block font-medium">Select Time</Label>
                <div className="border rounded-md p-3 shadow-sm bg-white overflow-y-auto h-[250px]">
                  <div className="grid grid-cols-3 gap-2">
                    {timeSlots.map((slot) => (
                      <div
                        key={slot}
                        className={`py-2 px-1 text-center text-sm rounded-md cursor-pointer border ${
                          timeSlot === slot
                            ? "bg-green-500 text-white border-green-500"
                            : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                        }`}
                        onClick={() => handleTimeSlotSelection(slot)}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
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
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-5">
              <h2 className="text-xl font-bold">Complete Your Booking</h2>
              <p className="text-sm opacity-90">
                Make payment to confirm your appointment
              </p>
            </div>
            <CardContent className="p-6">
              <div className="mb-6 border-b pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Provider:</span>
                  <span className="font-medium">{provider.name}</span>
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
                  <span className="text-green-600">KES {totalPrice}</span>
                </div>
              </div>

              <div className="mb-6">
                <Label className="mb-2 block font-medium">
                  Select Payment Method
                </Label>
                <RadioGroup
                  value={paymentMethod}
                  onValueChange={setPaymentMethod}
                  className="space-y-2"
                >
                  <div className="border rounded-lg p-4 flex items-center space-x-2">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label
                      htmlFor="mpesa"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="bg-green-100 rounded-full p-1 mr-2">
                        <span className="text-green-600 font-bold text-xs">
                          M
                        </span>
                      </div>
                      M-Pesa
                    </Label>
                  </div>
                  <div className="border rounded-lg p-4 flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label
                      htmlFor="card"
                      className="flex items-center cursor-pointer"
                    >
                      <div className="bg-blue-100 rounded-full p-1 mr-2">
                        <span className="text-blue-600 font-bold text-xs">
                          C
                        </span>
                      </div>
                      Credit/Debit Card
                    </Label>
                  </div>
                </RadioGroup>
              </div>

              {paymentMethod === "mpesa" && (
                <div className="mb-6">
                  <Label htmlFor="phone" className="mb-2 block font-medium">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    placeholder="e.g. 0712345678"
                    className="mb-2"
                  />
                  <p className="text-xs text-gray-500">
                    You will receive an M-Pesa prompt to complete the payment.
                  </p>
                </div>
              )}

              {paymentMethod === "card" && (
                <div className="mb-6 space-y-4">
                  <div>
                    <Label
                      htmlFor="cardNumber"
                      className="mb-2 block font-medium"
                    >
                      Card Number
                    </Label>
                    <Input id="cardNumber" placeholder="1234 5678 9012 3456" />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label
                        htmlFor="expiry"
                        className="mb-2 block font-medium"
                      >
                        Expiry Date
                      </Label>
                      <Input id="expiry" placeholder="MM/YY" />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="mb-2 block font-medium">
                        CVV
                      </Label>
                      <Input id="cvv" placeholder="123" />
                    </div>
                  </div>
                </div>
              )}

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
                  disabled={isProcessing}
                >
                  {isProcessing ? "Processing..." : "Complete Payment"}
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
