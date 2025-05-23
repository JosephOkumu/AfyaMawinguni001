
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardFooter, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "@/hooks/use-toast";
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
  Users,
  Microscope,
  ShieldCheck,
  Phone,
  Mail,
  CheckCircle,
  Info,
  AlertCircle,
  Building
} from "lucide-react";

interface LabTestType {
  id: number;
  name: string;
  description: string;
  price: number;
  popular: boolean;
  category: string;
  turnaroundTime: string;
}

interface LabProviderType {
  id: number;
  name: string;
  logo: string;
  initials: string;
  rating: number;
  patientsServed: number;
  location: string;
  distance: string;
  tests: number;
  description: string;
  email: string;
  phone: string;
  address: string;
  operatingHours: string;
}

// Mock data for lab tests
const labTests: LabTestType[] = [
  {
    id: 1,
    name: "Complete Blood Count (CBC)",
    description: "Measures different components of blood including red blood cells, white blood cells, and platelets.",
    price: 1200,
    popular: true,
    category: "Hematology",
    turnaroundTime: "Same day"
  },
  {
    id: 2,
    name: "Comprehensive Metabolic Panel",
    description: "Assesses kidney and liver function, electrolyte balance, and blood sugar levels.",
    price: 2500,
    popular: true,
    category: "Biochemistry",
    turnaroundTime: "24 hours"
  },
  {
    id: 3,
    name: "Lipid Profile",
    description: "Measures cholesterol levels to assess risk of heart disease.",
    price: 1800,
    popular: true,
    category: "Biochemistry",
    turnaroundTime: "Same day"
  },
  {
    id: 4,
    name: "Urinalysis",
    description: "Examines urine to detect various disorders such as diabetes and kidney disease.",
    price: 1000,
    popular: false,
    category: "Microbiology",
    turnaroundTime: "Same day"
  },
  {
    id: 5,
    name: "Full Body Checkup",
    description: "Comprehensive set of tests to evaluate overall health status.",
    price: 12000,
    popular: true,
    category: "Health Packages",
    turnaroundTime: "48 hours"
  },
  {
    id: 6,
    name: "COVID-19 Test",
    description: "Detects active coronavirus infection.",
    price: 3500,
    popular: false,
    category: "Molecular Diagnostics",
    turnaroundTime: "24 hours"
  },
  {
    id: 7,
    name: "Thyroid Function Test",
    description: "Assesses thyroid gland function and helps diagnose thyroid disorders.",
    price: 2200,
    popular: false,
    category: "Endocrinology",
    turnaroundTime: "24 hours"
  },
  {
    id: 8,
    name: "HbA1c Test",
    description: "Measures average blood glucose levels over the past 2-3 months.",
    price: 1700,
    popular: false,
    category: "Diabetes",
    turnaroundTime: "Same day"
  }
];

// Mock data for lab providers
const labProviders: LabProviderType[] = [
  {
    id: 1,
    name: "Nairobi Medical Labs",
    logo: "https://randomuser.me/api/portraits/men/41.jpg",
    initials: "NML",
    rating: 4.9,
    patientsServed: 12450,
    location: "Nairobi CBD, Kenya",
    distance: "2.5 km",
    tests: 45,
    description: "Nairobi Medical Labs is a leading diagnostic center with state-of-the-art technology and experienced professionals. We offer a comprehensive range of laboratory tests and diagnostic services.",
    email: "info@nairobimedlabs.co.ke",
    phone: "+254 711 234 567",
    address: "Kimathi Street, Central Business District, Nairobi",
    operatingHours: "Monday to Friday: 7:00 AM - 8:00 PM, Saturday: 8:00 AM - 6:00 PM, Sunday: 9:00 AM - 2:00 PM"
  },
  {
    id: 2,
    name: "PathCare Laboratories",
    logo: "",
    initials: "PC",
    rating: 4.7,
    patientsServed: 8920,
    location: "Westlands, Nairobi",
    distance: "4.8 km",
    tests: 38,
    description: "PathCare Laboratories provides accurate and reliable diagnostic services to meet your healthcare needs. Our team of qualified pathologists ensures precise results and personalized care.",
    email: "contact@pathcare.co.ke",
    phone: "+254 722 345 678",
    address: "Westlands Road, Westlands, Nairobi",
    operatingHours: "Monday to Friday: 8:00 AM - 7:00 PM, Saturday: 8:00 AM - 5:00 PM, Sunday: Closed"
  },
  {
    id: 3,
    name: "Lancet Kenya",
    logo: "",
    initials: "LK",
    rating: 4.8,
    patientsServed: 15680,
    location: "Upperhill, Nairobi",
    distance: "3.1 km",
    tests: 52,
    description: "Lancet Kenya offers comprehensive laboratory and diagnostic services with a commitment to quality and innovation. Our state-of-the-art equipment and skilled professionals ensure accurate results.",
    email: "info@lancet.co.ke",
    phone: "+254 733 456 789",
    address: "Ralph Bunche Road, Upperhill, Nairobi",
    operatingHours: "Monday to Friday: 7:30 AM - 8:30 PM, Saturday: 8:00 AM - 6:00 PM, Sunday: 9:00 AM - 3:00 PM"
  },
  {
    id: 4,
    name: "Meditest Labs",
    logo: "https://randomuser.me/api/portraits/women/59.jpg",
    initials: "ML",
    rating: 4.6,
    patientsServed: 6890,
    location: "Mombasa Road, Nairobi",
    distance: "6.2 km",
    tests: 32,
    description: "Meditest Labs delivers reliable and affordable diagnostic services to the community. Our focus is on providing quick turnaround times without compromising on quality.",
    email: "services@meditestlabs.co.ke",
    phone: "+254 744 567 890",
    address: "Mombasa Road, South B, Nairobi",
    operatingHours: "Monday to Friday: 8:00 AM - 7:00 PM, Saturday: 9:00 AM - 5:00 PM, Sunday: 10:00 AM - 2:00 PM"
  }
];

// Available time slots
const timeSlots = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM", 
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM", 
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM", 
  "5:00 PM", "5:30 PM", "6:00 PM"
];

const LabProviderDetails = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const preselectedTestId = searchParams.get('test');
  const navigate = useNavigate();
  const { toast } = useToast();

  const [provider, setProvider] = useState<LabProviderType | null>(null);
  const [selectedTests, setSelectedTests] = useState<number[]>(preselectedTestId ? [parseInt(preselectedTestId)] : []);
  const [searchTerm, setSearchTerm] = useState("");
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [timeSlot, setTimeSlot] = useState<string | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [activeTab, setActiveTab] = useState("tests");

  // Calculate total price
  const totalPrice = selectedTests.reduce((sum, testId) => {
    const test = labTests.find(t => t.id === testId);
    return sum + (test?.price || 0);
  }, 0);

  useEffect(() => {
    // Find the provider by ID
    const foundProvider = labProviders.find(p => p.id === Number(id));
    if (foundProvider) {
      setProvider(foundProvider);
    } else {
      // Redirect if provider not found
      navigate('/patient-dashboard/lab-tests');
    }
  }, [id, navigate]);

  // Filter tests based on search term
  const filteredTests = labTests.filter(test => 
    test.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    test.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTestSelection = (testId: number) => {
    setSelectedTests(prev => {
      if (prev.includes(testId)) {
        return prev.filter(id => id !== testId);
      } else {
        return [...prev, testId];
      }
    });
  };

  const handleTimeSlotSelection = (slot: string) => {
    setTimeSlot(slot);
  };

  const handleBookAppointment = () => {
    if (!date) {
      toast({
        title: "Select a date",
        description: "Please select an appointment date",
        variant: "destructive"
      });
      return;
    }

    if (!timeSlot) {
      toast({
        title: "Select a time slot",
        description: "Please select an appointment time",
        variant: "destructive"
      });
      return;
    }

    if (selectedTests.length === 0) {
      toast({
        title: "Select tests",
        description: "Please select at least one test",
        variant: "destructive"
      });
      return;
    }

    setIsPaymentModalOpen(true);
  };

  const processPayment = () => {
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsPaymentSuccess(true);
    }, 2000);
  };

  // Navigation items for the horizontal navbar
  const navItems = [
    { icon: CalendarIcon, label: "Appointments", path: "/patient-dashboard/appointments" },
    { icon: Package, label: "Orders", path: "/patient-dashboard/orders" },
  ];

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
              placeholder="Search for tests..." 
              className="pl-10 w-full border-gray-200 focus-visible:ring-secondary-green"
            />
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-3">
            <Button variant="outline" size="icon" className="relative rounded-full border-none hover:bg-green-50">
              <Bell className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </Button>
            <Button variant="outline" size="icon" className="relative rounded-full border-none hover:bg-green-50">
              <MessageSquare className="h-5 w-5 text-gray-600" />
              <span className="absolute top-1 right-1 bg-red-500 rounded-full w-2 h-2"></span>
            </Button>
            
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="hidden md:flex flex-col items-end">
                <span className="font-medium text-sm">John Doe</span>
                <span className="text-xs text-gray-500">Patient</span>
              </div>
              <Avatar className="h-9 w-9 border-2 border-secondary-green/20">
                <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-gray-600" 
            onClick={() => navigate('/patient-dashboard/lab-tests')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Lab Tests
          </Button>
        </div>

        {/* Lab Provider Info Card */}
        <Card className="mb-6 bg-gradient-to-r from-teal-500/90 to-green-500/90 text-white border-none overflow-hidden shadow-lg">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-28 w-28 border-4 border-white/30 shadow-lg">
                  {provider?.logo ? (
                    <AvatarImage src={provider.logo} alt={provider.name} />
                  ) : null}
                  <AvatarFallback className="bg-teal-700 text-white text-2xl">
                    {provider?.initials}
                  </AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between md:items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2 font-playfair">{provider?.name}</h1>
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 opacity-80 mr-1" />
                      <span className="opacity-90">{provider?.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-3 mt-3 md:mt-0">
                    <Badge variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-sm p-1.5">
                      <Star className="h-4 w-4 fill-yellow-300 text-yellow-300 mr-1" />
                      <span className="font-bold">{provider?.rating}</span>
                    </Badge>
                    <Badge variant="outline" className="bg-white/20 border-white/30 text-white backdrop-blur-sm p-1.5">
                      <ShieldCheck className="h-4 w-4 mr-1" />
                      Verified Partner
                    </Badge>
                  </div>
                </div>
                
                <p className="opacity-90 mb-4 max-w-3xl">{provider?.description}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Users className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Patients Served</div>
                      <div className="font-bold text-lg">{provider?.patientsServed.toLocaleString()}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Microscope className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Tests Available</div>
                      <div className="font-bold text-lg">{provider?.tests}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Results Turnaround</div>
                      <div className="font-bold text-lg">Same Day</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Content - Full width for available tests and booking section */}
        
        {/* Tests Selection */}
        <Card className="bg-white shadow-md border-none overflow-hidden">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="tests" className="font-medium">Available Tests</TabsTrigger>
                <TabsTrigger value="info" className="font-medium">Lab Information</TabsTrigger>
              </TabsList>
              
              <TabsContent value="tests" className="space-y-4">
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input 
                    type="search" 
                    placeholder="Search for tests..." 
                    className="pl-10 w-full border-gray-200 focus-visible:ring-secondary-green"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <div className="space-y-3">
                  {filteredTests.map((test) => (
                    <div
                      key={test.id}
                      className={`p-5 rounded-lg ${
                        selectedTests.includes(test.id) 
                          ? 'bg-green-50 border-2 border-green-500 shadow-md' 
                          : 'border border-gray-200 hover:border-gray-300 hover:shadow-sm'
                      } transition-all duration-300`}
                    >
                      <div className="flex items-start">
                        <Checkbox 
                          id={`test-${test.id}`} 
                          checked={selectedTests.includes(test.id)}
                          onCheckedChange={() => handleTestSelection(test.id)}
                          className="mt-1"
                        />
                        <div className="ml-3 flex-1">
                          <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                            <Label htmlFor={`test-${test.id}`} className="font-medium text-lg cursor-pointer">
                              {test.name}
                            </Label>
                            <div className="flex items-center mt-1 md:mt-0">
                              <Badge variant="outline" className="bg-blue-50 border-blue-200 text-blue-700 mr-2">
                                {test.category}
                              </Badge>
                              <span className="font-bold text-green-600">KSh {test.price}</span>
                            </div>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{test.description}</p>
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3 mr-1" />
                            Results in: {test.turnaroundTime}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="info">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3 text-green-700">About {provider?.name}</h3>
                    <p className="text-gray-700">{provider?.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                      <CardContent className="p-5">
                        <h4 className="font-medium mb-3 flex items-center text-green-700">
                          <Building className="h-4 w-4 mr-2 text-gray-500" />
                          Address
                        </h4>
                        <p className="text-sm text-gray-700">{provider?.address}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                      <CardContent className="p-5">
                        <h4 className="font-medium mb-3 flex items-center text-green-700">
                          <Clock className="h-4 w-4 mr-2 text-gray-500" />
                          Operating Hours
                        </h4>
                        <p className="text-sm text-gray-700">{provider?.operatingHours}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                      <CardContent className="p-5">
                        <h4 className="font-medium mb-3 flex items-center text-green-700">
                          <Phone className="h-4 w-4 mr-2 text-gray-500" />
                          Contact Number
                        </h4>
                        <p className="text-sm text-gray-700">{provider?.phone}</p>
                      </CardContent>
                    </Card>
                    
                    <Card className="shadow-sm border border-gray-100 hover:shadow-md transition-shadow overflow-hidden">
                      <CardContent className="p-5">
                        <h4 className="font-medium mb-3 flex items-center text-green-700">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          Email Address
                        </h4>
                        <p className="text-sm text-gray-700">{provider?.email}</p>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <Card className="bg-yellow-50 border border-yellow-200 overflow-hidden shadow-sm">
                    <CardContent className="p-5">
                      <div className="flex items-start">
                        <Info className="h-5 w-5 text-yellow-500 mr-3 flex-shrink-0 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-yellow-700 mb-2">Important Information</h4>
                          <ul className="text-sm text-yellow-700 space-y-2 list-disc ml-4">
                            <li>Please arrive 15 minutes before your appointment time.</li>
                            <li>Bring your ID card and any previous test results if available.</li>
                            <li>Some tests require fasting - please check requirements before booking.</li>
                            <li>Results will be shared via email or can be collected in person.</li>
                            <li>You will receive a confirmation SMS after successful booking.</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        
        {/* Appointment Booking Section - Now vertically aligned */}
        <Card className="bg-white shadow-md border-none overflow-hidden">
          <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-4">
            <h2 className="text-xl font-bold font-playfair">Book Your Appointment</h2>
            <p className="text-sm opacity-90">Select tests, date, and time to schedule</p>
          </div>
          <CardContent className="p-6">
            {/* Step 1: Select Date - Full Width */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">1</div>
                Select Date
              </h3>
              <div className="border rounded-md p-1 shadow-sm bg-white max-w-sm mx-auto">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => {
                    // Disable dates in the past and Sundays
                    return date < new Date(new Date().setHours(0, 0, 0, 0)) || 
                          date.getDay() === 0;
                  }}
                  className="rounded-md border-none"
                />
              </div>
            </div>
            
            {/* Step 2: Select Time - Full Width */}
            <div className="mb-6">
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">2</div>
                Select Time
              </h3>
              <div className="border rounded-md p-3 shadow-sm bg-white overflow-y-auto max-h-[200px]">
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                  {timeSlots.map((slot) => (
                    <div
                      key={slot}
                      className={`py-2 px-1 text-center text-sm rounded-md cursor-pointer border transition-all duration-200 ${
                        timeSlot === slot
                          ? 'bg-green-500 text-white border-green-500 shadow-sm'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                      onClick={() => handleTimeSlotSelection(slot)}
                    >
                      {slot}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            {/* Step 3: Review & Book */}
            <div>
              <h3 className="text-sm font-medium mb-3 flex items-center">
                <div className="bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs mr-2">3</div>
                Review & Book
              </h3>
              
              <div className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-teal-50 mb-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Selected Tests:</span>
                  <span className="font-medium">{selectedTests.length}</span>
                </div>
                {selectedTests.length > 0 && (
                  <div className="pl-4 space-y-1">
                    {selectedTests.map(testId => {
                      const test = labTests.find(t => t.id === testId);
                      return (
                        <div key={testId} className="flex justify-between text-sm">
                          <span className="text-gray-700">{test?.name}</span>
                          <span className="text-gray-900">KSh {test?.price}</span>
                        </div>
                      );
                    })}
                  </div>
                )}
                <div className="flex justify-between font-medium pt-2 border-t mt-2">
                  <span>Total Amount:</span>
                  <span className="text-green-600 font-bold">KSh {totalPrice}</span>
                </div>
              </div>
              
              <Button 
                className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white shadow-md"
                onClick={handleBookAppointment}
                disabled={selectedTests.length === 0 || !date || !timeSlot}
              >
                Book Appointment
              </Button>
              
              <p className="text-xs text-gray-500 text-center mt-3">
                By booking, you agree to our terms and conditions
              </p>
            </div>
          </CardContent>
        </Card>
      </main>

      {/* Payment Modal */}
      {isPaymentModalOpen && !isPaymentSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md mx-auto border-none shadow-xl overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white p-5">
              <h2 className="text-xl font-bold font-playfair">Complete Your Booking</h2>
              <p className="text-sm opacity-90">Make payment to confirm your appointment</p>
            </div>
            <CardContent className="p-6">
              <div className="border-b pb-4 mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Lab:</span>
                  <span className="font-medium">{provider?.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">{date?.toLocaleDateString('en-GB')} at {timeSlot}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Selected Tests:</span>
                  <span className="font-medium">{selectedTests.length}</span>
                </div>
                <div className="flex justify-between font-bold mt-4 text-lg">
                  <span>Total Amount:</span>
                  <span className="text-green-600">KSh {totalPrice}</span>
                </div>
              </div>
              
              {/* Payment method buttons */}
              <div className="space-y-3 mb-6">
                <Button 
                  variant="outline" 
                  className="w-full justify-between py-6 border-green-100 hover:bg-green-50"
                  onClick={processPayment}
                >
                  <span className="flex items-center">
                    <div className="bg-green-100 rounded-full p-2 mr-3">
                      <img src="/placeholder.svg" alt="M-Pesa" className="h-6 w-6" />
                    </div>
                    Pay with M-Pesa
                  </span>
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-between py-6 border-blue-100 hover:bg-blue-50"
                  onClick={processPayment}
                >
                  <span className="flex items-center">
                    <div className="bg-blue-100 rounded-full p-2 mr-3">
                      <img src="/placeholder.svg" alt="Card" className="h-6 w-6" />
                    </div>
                    Pay with Card
                  </span>
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-between py-6 border-purple-100 hover:bg-purple-50"
                  onClick={processPayment}
                >
                  <span className="flex items-center">
                    <div className="bg-purple-100 rounded-full p-2 mr-3">
                      <img src="/placeholder.svg" alt="PayPal" className="h-6 w-6" />
                    </div>
                    Pay with PayPal
                  </span>
                  <ChevronLeft className="h-5 w-5 rotate-180" />
                </Button>
              </div>
              
              <div className="flex justify-between">
                <Button 
                  variant="outline" 
                  onClick={() => setIsPaymentModalOpen(false)}
                  className="text-gray-600"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={processPayment}
                  disabled={isProcessing}
                  className="bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                >
                  {isProcessing ? 'Processing...' : 'Confirm Payment'}
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Payment Success Modal */}
      {isPaymentModalOpen && isPaymentSuccess && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md mx-auto border-none shadow-xl overflow-hidden">
            <CardContent className="p-8 text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Booking Confirmed!</h2>
              <p className="text-gray-600 mb-6">Your appointment has been successfully booked.</p>
              
              <div className="bg-green-50 p-4 rounded-lg mb-6 text-left">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Booking Reference:</span>
                  <span className="font-medium">#LAB-{Math.floor(Math.random() * 1000000)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Lab:</span>
                  <span className="font-medium">{provider?.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">{date?.toLocaleDateString('en-GB')} at {timeSlot}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Amount Paid:</span>
                  <span className="font-medium text-green-600">KSh {totalPrice}</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    setIsPaymentSuccess(false);
                  }}
                >
                  Close
                </Button>
                <Button 
                  className="flex-1 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white"
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    setIsPaymentSuccess(false);
                    navigate('/patient-dashboard/appointments');
                  }}
                >
                  View Appointments
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default LabProviderDetails;
