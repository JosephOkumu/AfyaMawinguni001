
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "@/hooks/use-toast";
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
  Video,
  UserRound,
  Clock,
  Stethoscope,
  GraduationCap,
  Languages,
  Heart,
  ThumbsUp,
  CheckCircle,
  X
} from "lucide-react";

// The mock doctors data (using the same data from DoctorConsultation.tsx)
const doctors = [
  {
    id: 1,
    name: "Dr. James Wilson",
    specialty: "General Practitioner",
    rating: 4.9,
    imageUrl: "https://randomuser.me/api/portraits/men/36.jpg",
    location: "Nairobi Central",
    price: 2500,
    experience: "15 years",
    availability: ["Monday", "Tuesday", "Wednesday", "Friday"],
    bio: "Dr. James Wilson is a highly experienced general practitioner with over 15 years of experience in treating a wide range of medical conditions. He specializes in preventive care, chronic disease management, and holistic health approaches.",
    education: "MD from University of Nairobi, Residency at Kenyatta National Hospital",
    languages: ["English", "Swahili", "French"],
    certifications: ["Kenya Medical Board Certified", "International Society of General Practice"],
    videoConsultation: {
      available: true,
      price: 2000
    },
    physicalVisit: {
      available: true,
      price: 2500
    },
    reviews: [
      {
        id: 1,
        patientName: "Michael O.",
        rating: 5,
        date: "March 15, 2025",
        comment: "Dr. Wilson was very thorough in his examination and explained everything clearly. He gave me effective medication and I felt better within days."
      },
      {
        id: 2,
        patientName: "Sarah K.",
        rating: 4,
        date: "February 22, 2025",
        comment: "Professional and knowledgeable doctor. The waiting time was a bit long but the consultation was worth it."
      }
    ]
  },
  {
    id: 2,
    name: "Dr. Lisa Chen",
    specialty: "Cardiologist",
    rating: 4.8,
    imageUrl: "https://randomuser.me/api/portraits/women/65.jpg",
    location: "Westlands",
    price: 3500,
    experience: "12 years",
    availability: ["Monday", "Thursday", "Saturday"],
    bio: "Dr. Lisa Chen is a board-certified cardiologist specializing in heart disease prevention, cardiovascular health, and heart rhythm disorders. She has conducted extensive research in interventional cardiology.",
    education: "MD from Harvard Medical School, Cardiology Fellowship at Mayo Clinic",
    languages: ["English", "Mandarin", "Swahili"],
    certifications: ["American Board of Cardiology", "Kenya Cardiac Society"],
    videoConsultation: {
      available: true,
      price: 3000
    },
    physicalVisit: {
      available: true,
      price: 3500
    },
    reviews: [
      {
        id: 1,
        patientName: "Robert M.",
        rating: 5,
        date: "April 5, 2025",
        comment: "Dr. Chen is exceptional. She took her time to explain my condition and the treatment options available. Her staff is also very friendly and professional."
      },
      {
        id: 2,
        patientName: "Jane W.",
        rating: 5,
        date: "March 28, 2025",
        comment: "I've been seeing Dr. Chen for my heart condition for over a year now. She is knowledgeable, caring, and always up-to-date with the latest treatments."
      }
    ]
  },
  // Additional doctors data would go here, matching the array from DoctorConsultation.tsx
];

// Available time slots
const timeSlots = [
  "8:00 AM", "8:30 AM", "9:00 AM", "9:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM", "1:00 PM", "1:30 PM",
  "2:00 PM", "2:30 PM", "3:00 PM", "3:30 PM", "4:00 PM", "4:30 PM",
  "5:00 PM", "5:30 PM"
];

const DoctorDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [consultationType, setConsultationType] = useState("video");
  const [date, setDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("mpesa");
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  // Find doctor by ID when component mounts
  useEffect(() => {
    const foundDoctor = doctors.find(doc => doc.id === parseInt(id));
    if (foundDoctor) {
      setDoctor(foundDoctor);
    } else {
      // Redirect if doctor not found
      navigate('/patient-dashboard/consultation');
    }
  }, [id, navigate]);

  // Function to render star ratings
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className="h-4 w-4 text-gray-300" />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          </div>
        </div>
      );
    }
    
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }
    
    return stars;
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
        description: "Your appointment has been successfully scheduled.",
        variant: "default"
      });
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/patient-dashboard/appointments');
      }, 2000);
    }, 2000);
  };

  if (!doctor) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-white flex items-center justify-center">
        <div>Loading...</div>
      </div>
    );
  }

  // Calculate consultation fee based on selected type
  const consultationFee = consultationType === 'video' 
    ? doctor.videoConsultation.price 
    : doctor.physicalVisit.price;

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
              placeholder="Search for doctors, specialties..." 
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

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Back Button */}
        <div className="mb-4">
          <Button 
            variant="ghost" 
            size="sm" 
            className="flex items-center text-gray-600" 
            onClick={() => navigate('/patient-dashboard/consultation')}
          >
            <ChevronLeft className="h-4 w-4 mr-1" />
            Back to Doctors
          </Button>
        </div>

        {/* Doctor Profile Section */}
        <Card className="mb-6 overflow-hidden border-0 shadow-md">
          <div className="bg-gradient-to-r from-blue-500/90 to-teal-500/90 text-white p-8">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <Avatar className="h-28 w-28 border-4 border-white/30 shadow-lg">
                  <AvatarImage src={doctor.imageUrl} alt={doctor.name} />
                  <AvatarFallback>{doctor.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
              </div>
              
              <div className="flex-1">
                <div className="flex flex-col md:flex-row justify-between md:items-start">
                  <div>
                    <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
                    <p className="text-lg opacity-90 mb-2">{doctor.specialty}</p>
                    <div className="flex items-center mb-2">
                      <MapPin className="h-4 w-4 opacity-80 mr-1" />
                      <span className="opacity-90">{doctor.location}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center mt-3 md:mt-0">
                    <div className="flex mr-2">
                      {renderStars(doctor.rating)}
                    </div>
                    <Badge variant="outline" className="bg-white/20 border-white/30 text-white p-1">
                      {doctor.rating} / 5
                    </Badge>
                  </div>
                </div>
                
                <p className="opacity-90 mb-4 max-w-3xl">{doctor.bio}</p>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Stethoscope className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Experience</div>
                      <div className="font-bold text-lg">{doctor.experience}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <GraduationCap className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Education</div>
                      <div className="font-bold text-sm">MD, Specialist</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm p-3 rounded-lg">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Languages className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm opacity-80">Languages</div>
                      <div className="font-bold text-sm">{doctor.languages?.join(", ")}</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Doctor Information Tabs */}
        <Card className="border-0 shadow-md overflow-hidden mb-6">
          <CardContent className="p-6">
            <Tabs defaultValue="about">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
              </TabsList>
              
              <TabsContent value="about" className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-green-700 mb-2">Biography</h3>
                  <p className="text-gray-700">{doctor.bio}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-green-700 mb-2">Education</h3>
                  <p className="text-gray-700">{doctor.education}</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-medium text-green-700 mb-2">Certifications</h3>
                  <ul className="list-disc pl-5 text-gray-700">
                    {doctor.certifications?.map((cert, index) => (
                      <li key={index}>{cert}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-medium text-green-700 flex items-center gap-2 mb-2">
                      <Video className="h-5 w-5" />
                      Video Consultation
                    </h4>
                    <p className="text-gray-700 mb-1">
                      {doctor.videoConsultation?.available ? 'Available' : 'Not Available'}
                    </p>
                    {doctor.videoConsultation?.available && (
                      <p className="font-bold text-lg text-green-700">
                        KES {doctor.videoConsultation.price}
                      </p>
                    )}
                  </div>
                  
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h4 className="font-medium text-blue-700 flex items-center gap-2 mb-2">
                      <UserRound className="h-5 w-5" />
                      Physical Visit
                    </h4>
                    <p className="text-gray-700 mb-1">
                      {doctor.physicalVisit?.available ? 'Available' : 'Not Available'}
                    </p>
                    {doctor.physicalVisit?.available && (
                      <p className="font-bold text-lg text-blue-700">
                        KES {doctor.physicalVisit.price}
                      </p>
                    )}
                  </div>
                </div>
              </TabsContent>
              
              <TabsContent value="reviews">
                <div className="space-y-4">
                  <div className="flex items-center mb-4">
                    <div className="flex mr-2">
                      {renderStars(doctor.rating)}
                    </div>
                    <span className="text-lg font-bold">{doctor.rating}/5</span>
                    <span className="text-gray-500 ml-2">({doctor.reviews?.length || 0} reviews)</span>
                  </div>
                  
                  {doctor.reviews?.map(review => (
                    <Card key={review.id} className="border-0 shadow-sm">
                      <CardContent className="p-4">
                        <div className="flex justify-between mb-2">
                          <h4 className="font-medium">{review.patientName}</h4>
                          <span className="text-gray-500 text-sm">{review.date}</span>
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
              
              <TabsContent value="faq">
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">What should I bring to my appointment?</h4>
                    <p className="text-gray-700">Please bring your ID, insurance information (if applicable), and any relevant medical records or test results.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">How long will the appointment last?</h4>
                    <p className="text-gray-700">Initial consultations typically last 30-45 minutes, while follow-up appointments are usually 15-30 minutes.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">What happens if I need to cancel my appointment?</h4>
                    <p className="text-gray-700">You can cancel or reschedule your appointment up to 24 hours before the scheduled time without any penalty.</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-green-700 mb-2">Do you accept insurance?</h4>
                    <p className="text-gray-700">Yes, we accept most major insurance providers. Please check with your provider to confirm coverage.</p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
          
        {/* Booking Section - Now vertically aligned */}
        <Card className="border-0 shadow-md overflow-hidden mb-6">
          <div className="bg-green-500 p-4 text-white">
            <h2 className="text-xl font-bold">Book Appointment</h2>
            <p className="text-sm opacity-90">Select type, date, and time</p>
          </div>
          <CardContent className="p-6">
            {/* Select Consultation Type */}
            <div className="mb-6">
              <Label className="mb-2 block font-medium">Select Consultation Type</Label>
              <RadioGroup 
                value={consultationType} 
                onValueChange={setConsultationType}
                className="grid grid-cols-2 gap-4"
              >
                <div className={`border rounded-lg p-4 flex items-center space-x-2 ${
                  consultationType === 'video' ? 'bg-blue-50 border-blue-500' : ''
                }`}>
                  <RadioGroupItem value="video" id="video" />
                  <Label htmlFor="video" className="flex items-center cursor-pointer">
                    <Video className="h-5 w-5 mr-2 text-blue-500" />
                    <div>
                      <div>Video Call</div>
                      <div className="text-sm text-gray-500">KES {doctor.videoConsultation?.price}</div>
                    </div>
                  </Label>
                </div>
                <div className={`border rounded-lg p-4 flex items-center space-x-2 ${
                  consultationType === 'physical' ? 'bg-green-50 border-green-500' : ''
                }`}>
                  <RadioGroupItem value="physical" id="physical" />
                  <Label htmlFor="physical" className="flex items-center cursor-pointer">
                    <UserRound className="h-5 w-5 mr-2 text-green-500" />
                    <div>
                      <div>Physical Visit</div>
                      <div className="text-sm text-gray-500">KES {doctor.physicalVisit?.price}</div>
                    </div>
                  </Label>
                </div>
              </RadioGroup>
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
                      // Get day of week (0 = Sunday, 1 = Monday, etc.)
                      const day = date.getDay();
                      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                      
                      // Disable dates in the past
                      const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));
                      
                      // Disable days when doctor is not available
                      const isDoctorUnavailable = !doctor.availability.includes(dayNames[day]);
                      
                      return isPastDate || isDoctorUnavailable;
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
                            ? 'bg-green-500 text-white border-green-500'
                            : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                        }`}
                        onClick={() => setTimeSlot(slot)}
                      >
                        {slot}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Booking Summary */}
            {(date && timeSlot) && (
              <div className="border rounded-lg p-4 bg-green-50 my-6">
                <h3 className="font-medium mb-2">Booking Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Doctor:</span>
                    <span className="font-medium">{doctor.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Consultation Type:</span>
                    <span className="font-medium">
                      {consultationType === 'video' ? 'Video Call' : 'Physical Visit'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium">{date.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{timeSlot}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2 mt-2 font-bold">
                    <span>Total:</span>
                    <span className="text-green-600">KES {consultationFee}</span>
                  </div>
                </div>
              </div>
            )}
            
            <Button 
              className="w-full"
              onClick={handleBookAppointment}
              disabled={!date || !timeSlot}
            >
              Proceed to Payment
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Payment Modal */}
      {isPaymentModalOpen && !isSuccess && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md border-0 shadow-xl">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 text-white p-5">
              <h2 className="text-xl font-bold">Complete Your Booking</h2>
              <p className="text-sm opacity-90">Make payment to confirm your appointment</p>
            </div>
            <CardContent className="p-6">
              <div className="mb-6 border-b pb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Doctor:</span>
                  <span className="font-medium">{doctor.name}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Consultation:</span>
                  <span className="font-medium">
                    {consultationType === 'video' ? 'Video Call' : 'Physical Visit'}
                  </span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Date & Time:</span>
                  <span className="font-medium">
                    {date?.toLocaleDateString('en-GB')} at {timeSlot}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <span>Total Amount:</span>
                  <span className="text-green-600">KES {consultationFee}</span>
                </div>
              </div>
              
              <div className="mb-6">
                <Label className="mb-2 block font-medium">Select Payment Method</Label>
                <RadioGroup 
                  value={paymentMethod} 
                  onValueChange={setPaymentMethod}
                  className="space-y-2"
                >
                  <div className="border rounded-lg p-4 flex items-center space-x-2">
                    <RadioGroupItem value="mpesa" id="mpesa" />
                    <Label htmlFor="mpesa" className="flex items-center cursor-pointer">
                      <div className="bg-green-100 rounded-full p-1 mr-2">
                        <span className="text-green-600 font-bold text-xs">M</span>
                      </div>
                      M-Pesa
                    </Label>
                  </div>
                  <div className="border rounded-lg p-4 flex items-center space-x-2">
                    <RadioGroupItem value="card" id="card" />
                    <Label htmlFor="card" className="flex items-center cursor-pointer">
                      <div className="bg-blue-100 rounded-full p-1 mr-2">
                        <span className="text-blue-600 font-bold text-xs">C</span>
                      </div>
                      Credit/Debit Card
                    </Label>
                  </div>
                </RadioGroup>
              </div>
              
              {paymentMethod === 'mpesa' && (
                <div className="mb-6">
                  <Label htmlFor="phone" className="mb-2 block font-medium">Phone Number</Label>
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
              
              {paymentMethod === 'card' && (
                <div className="mb-6 space-y-4">
                  <div>
                    <Label htmlFor="cardNumber" className="mb-2 block font-medium">Card Number</Label>
                    <Input 
                      id="cardNumber" 
                      placeholder="1234 5678 9012 3456" 
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="expiry" className="mb-2 block font-medium">Expiry Date</Label>
                      <Input 
                        id="expiry" 
                        placeholder="MM/YY" 
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv" className="mb-2 block font-medium">CVV</Label>
                      <Input 
                        id="cvv" 
                        placeholder="123" 
                      />
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
                  {isProcessing ? 'Processing...' : 'Complete Payment'}
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
              <h2 className="text-2xl font-bold text-green-700 mb-2">Booking Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your appointment with {doctor.name} has been scheduled for {date?.toLocaleDateString('en-GB')} at {timeSlot}.
              </p>
              <Button 
                className="w-full"
                onClick={() => navigate('/patient-dashboard/appointments')}
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

export default DoctorDetails;
