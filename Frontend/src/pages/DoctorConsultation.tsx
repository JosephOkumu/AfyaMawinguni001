import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Search,
  Bell,
  MessageSquare,
  CalendarClock,
  Package,
  LogOut,
  Star,
  MapPin,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import FilterPopover from "@/components/ui/FilterPopover";

const doctorImage = "/lovable-uploads/a05b3053-380f-4711-b032-bc48d1c082f0.png";
// Mock data for doctors
const doctors = [
  {
    id: 1,
    name: "Dr. James Wilson",
    specialty: "General Practitioner",
    rating: 4.9,
    imageUrl: doctorImage,
    location: "Nairobi Central",
    price: 2500,
    experience: "15 years",
    availability: ["Monday", "Tuesday", "Wednesday", "Friday"],
  },
  {
    id: 2,
    name: "Dr. Lisa Chen",
    specialty: "Cardiologist",
    rating: 4.8,
    imageUrl: doctorImage,
    location: "Westlands",
    price: 3500,
    experience: "12 years",
    availability: ["Monday", "Thursday", "Saturday"],
  },
  {
    id: 3,
    name: "Dr. Robert Brown",
    specialty: "Pediatrician",
    rating: 4.7,
    imageUrl: doctorImage,
    location: "Parklands",
    price: 2800,
    experience: "10 years",
    availability: ["Tuesday", "Wednesday", "Friday", "Saturday"],
  },
  {
    id: 4,
    name: "Dr. Amanda Smith",
    specialty: "Dermatologist",
    rating: 4.9,
    imageUrl: doctorImage,
    location: "Karen",
    price: 4200,
    experience: "8 years",
    availability: ["Monday", "Wednesday", "Friday"],
  },
  {
    id: 5,
    name: "Dr. Michael Kimani",
    specialty: "Orthopedic Surgeon",
    rating: 4.6,
    imageUrl: doctorImage,
    location: "Upperhill",
    price: 5000,
    experience: "14 years",
    availability: ["Monday", "Tuesday", "Thursday"],
  },
  {
    id: 6,
    name: "Dr. Sarah Wanjiku",
    specialty: "Neurologist",
    rating: 4.8,
    imageUrl: doctorImage,
    location: "Kilimani",
    price: 4500,
    experience: "11 years",
    availability: ["Tuesday", "Thursday", "Saturday"],
  },
  {
    id: 7,
    name: "Dr. David Ochieng",
    specialty: "Psychiatrist",
    rating: 4.7,
    imageUrl: doctorImage,
    location: "Lavington",
    price: 3800,
    experience: "9 years",
    availability: ["Monday", "Wednesday", "Friday"],
  },
  {
    id: 8,
    name: "Dr. Emily Njoroge",
    specialty: "Gynecologist",
    rating: 4.9,
    imageUrl: doctorImage,
    location: "Westlands",
    price: 4000,
    experience: "13 years",
    availability: ["Tuesday", "Thursday", "Saturday"],
  },
];

// List of locations for filtering
const locations = [...new Set(doctors.map((doctor) => doctor.location))];

const DoctorCard = ({ doctor, onClick }) => {
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

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all duration-300 h-full">
      <div className="relative">
        <img
          src={doctor.imageUrl}
          alt={doctor.name}
          className="w-full h-48 object-cover object-center"
        />
        <Badge className="absolute top-2 right-2 bg-green-500 hover:bg-green-600">
          KES {doctor.price}
        </Badge>
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg text-primary-blue">
          {doctor.name}
        </h3>
        <p className="text-sm text-gray-600 mb-2">{doctor.specialty}</p>

        <div className="flex items-center text-xs text-gray-500 mb-2">
          <MapPin className="h-3.5 w-3.5 mr-1 text-gray-400" />
          {doctor.location}
        </div>

        <div className="flex items-center mb-3">
          <div className="flex mr-1">{renderStars(doctor.rating)}</div>
          <span className="text-sm text-gray-600">({doctor.rating})</span>
        </div>

        <Button
          onClick={() => onClick(doctor)}
          className="w-full bg-primary-blue hover:bg-secondary-green"
        >
          Book Appointment
        </Button>
      </CardContent>
    </Card>
  );
};

const DoctorConsultation = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [ratingFilter, setRatingFilter] = useState(0);

  // Generate user initials
  const getUserInitials = (name: string) => {
    if (!name) return "U";
    const names = name.trim().split(" ");
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    return (
      names[0].charAt(0) + names[names.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Navigation items for the horizontal navbar
  const navItems = [
    {
      icon: CalendarClock,
      label: "Appointments",
      path: "/patient-dashboard/appointments",
    },
    { icon: Package, label: "Orders", path: "/patient-dashboard/orders" },
  ];

  // Apply filters to doctors list
  const filteredDoctors = doctors.filter((doctor) => {
    return (
      (selectedLocation === "" || doctor.location === selectedLocation) &&
      doctor.price >= priceRange[0] &&
      doctor.price <= priceRange[1] &&
      doctor.rating >= ratingFilter &&
      (searchTerm === "" ||
        doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
        doctor.location.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  const handleDoctorSelect = (doctor) => {
    navigate(`/patient-dashboard/doctor/${doctor.id}`);
  };

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
              <span className="text-xl font-bold">
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
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Header Card */}
        <Card className="mb-6 bg-gradient-to-r from-green-500/90 to-teal-600/90 text-white border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">Doctor Consultation</h1>
                <p className="opacity-90 mt-1">
                  Find and book appointments with top doctors
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {navItems.map((item, index) => (
                  <Link key={index} to={item.path}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className="bg-white/20 hover:bg-white/30 border-none backdrop-blur-sm text-white"
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
                <Button
                  variant="destructive"
                  size="sm"
                  className="bg-red-500/80 hover:bg-red-600/80 border-none"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Section */}
        <div className="mb-6 flex justify-between items-center">
          <FilterPopover
            onLocationChange={setSelectedLocation}
            onPriceRangeChange={setPriceRange}
            onRatingChange={setRatingFilter}
            selectedLocation={selectedLocation}
            priceRange={priceRange}
            ratingFilter={ratingFilter}
            locations={locations}
          />

          <div className="relative max-w-xs">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search doctors..."
              className="pl-10 w-full border-gray-200 focus-visible:ring-secondary-green"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Doctors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredDoctors.map((doctor) => (
            <DoctorCard
              key={doctor.id}
              doctor={doctor}
              onClick={handleDoctorSelect}
            />
          ))}

          {filteredDoctors.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              <p className="text-lg">No doctors match your search criteria.</p>
              <p className="text-sm mt-2">
                Try adjusting your filters or search term.
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default DoctorConsultation;
