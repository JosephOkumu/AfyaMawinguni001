import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/contexts/AuthContext";
import Footer from "@/components/Footer";
import {
  Search,
  Bell,
  MessageSquare,
  Calendar,
  Package,
  LogOut,
  ShoppingCart,
  Filter,
  Star,
} from "lucide-react";

interface MedicineType {
  id: number;
  name: string;
  price: number;
  pharmacy: string;
  pharmacyLogo: string;
  pharmacyInitials: string;
  rating: number;
  category: string;
  status: "In Stock" | "Low Stock" | "Out of Stock";
  imagePath: string;
}

// Use the pill image provided by the user
const medicineImg = "/lovable-uploads/a05b3053-380f-4711-b032-bc48d1c082f0.png";
const medicines: MedicineType[] = [
  {
    id: 1,
    name: "Paracetamol 500mg",
    price: 250,
    pharmacy: "MediPharm",
    pharmacyLogo: "https://randomuser.me/api/portraits/women/2.jpg",
    pharmacyInitials: "MP",
    rating: 4.8,
    category: "Pain Relief",
    status: "In Stock",
    imagePath: medicineImg,
  },
  {
    id: 2,
    name: "Amoxicillin 250mg",
    price: 450,
    pharmacy: "HealthPlus",
    pharmacyLogo: "",
    pharmacyInitials: "HP",
    rating: 4.7,
    category: "Antibiotics",
    status: "In Stock",
    imagePath: medicineImg,
  },
  {
    id: 3,
    name: "Ibuprofen 400mg",
    price: 350,
    pharmacy: "MediPharm",
    pharmacyLogo: "https://randomuser.me/api/portraits/women/2.jpg",
    pharmacyInitials: "MP",
    rating: 4.5,
    category: "Pain Relief",
    status: "Low Stock",
    imagePath: medicineImg,
  },
  {
    id: 4,
    name: "Loratadine 10mg",
    price: 550,
    pharmacy: "SafeCare Pharmacy",
    pharmacyLogo: "",
    pharmacyInitials: "SP",
    rating: 4.9,
    category: "Allergy Relief",
    status: "In Stock",
    imagePath: medicineImg,
  },
  {
    id: 5,
    name: "Metformin 500mg",
    price: 650,
    pharmacy: "HealthPlus",
    pharmacyLogo: "",
    pharmacyInitials: "HP",
    rating: 4.6,
    category: "Diabetes",
    status: "In Stock",
    imagePath: medicineImg,
  },
  {
    id: 6,
    name: "Omeprazole 20mg",
    price: 450,
    pharmacy: "MediPharm",
    pharmacyLogo: "https://randomuser.me/api/portraits/women/2.jpg",
    pharmacyInitials: "MP",
    rating: 4.7,
    category: "Digestive Health",
    status: "In Stock",
    imagePath: medicineImg,
  },
];

const PatientMedicines = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [cartCount, setCartCount] = useState(0);
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

  // Navigation items for the horizontal navbar
  const navItems = [
    {
      icon: Calendar,
      label: "Appointments",
      path: "/patient-dashboard/appointments",
    },
    { icon: Package, label: "Orders", path: "/patient-dashboard/orders" },
  ];

  const filteredMedicines = medicines.filter(
    (medicine) =>
      medicine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.pharmacy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      medicine.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

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
                <span className="text-primary-blue">ACESO</span>
                <span className="text-secondary-green"> HEALTH SOLUTIONS</span>
              </span>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile */}
          <div className="relative hidden md:block max-w-md w-full mx-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="search"
              placeholder="Search for medications..."
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
              <ShoppingCart className="h-5 w-5 text-gray-600" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                  {cartCount}
                </span>
              )}
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="relative rounded-full border-none hover:bg-green-50"
            >
              <Bell className="h-5 w-5 text-gray-600" />
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

      {/* Mobile Search - Visible only on mobile */}
      <div className="md:hidden p-4 bg-white border-t border-gray-100">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            type="search"
            placeholder="Search medications..."
            className="pl-10 w-full border-gray-200 focus-visible:ring-secondary-green"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Header Card */}
        <Card className="mb-6 bg-gradient-to-r from-green-500/90 to-teal-600/90 text-white border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold font-playfair">
                  Online Pharmacy
                </h1>
                <p className="opacity-90 mt-1">
                  Browse and order medications from trusted pharmacies
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
                  variant="secondary"
                  size="sm"
                  className="bg-white text-green-600 border-none relative"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Cart
                  {cartCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold">
                      {cartCount}
                    </span>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Filter Bar */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 flex flex-wrap gap-2 items-center">
          <div className="font-medium text-sm flex items-center mr-2">
            <Filter className="h-4 w-4 mr-1" />
            Filter by:
          </div>
          <Button size="sm" variant="outline" className="rounded-full text-xs">
            All
          </Button>
          <Button size="sm" variant="outline" className="rounded-full text-xs">
            Pain Relief
          </Button>
          <Button size="sm" variant="outline" className="rounded-full text-xs">
            Antibiotics
          </Button>
          <Button size="sm" variant="outline" className="rounded-full text-xs">
            Diabetes
          </Button>
          <Button size="sm" variant="outline" className="rounded-full text-xs">
            Allergy Relief
          </Button>
        </div>

        {/* Medicines Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          {filteredMedicines.map((medicine) => (
            <Link
              to={`/patient-dashboard/medicines/${medicine.id}`}
              key={medicine.id}
            >
              <Card className="h-full hover:shadow-md transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                <div className="h-40 flex items-center justify-center overflow-hidden bg-white">
                  <img
                    src={medicine.imagePath}
                    alt={medicine.name}
                    className="object-contain h-32 w-auto transition-transform duration-300 hover:scale-110"
                  />
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-medium text-lg">{medicine.name}</h3>
                    <Badge
                      variant={
                        medicine.status === "In Stock"
                          ? "outline"
                          : medicine.status === "Low Stock"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {medicine.status}
                    </Badge>
                  </div>
                  <div className="text-xl font-bold text-green-600 mb-2">
                    KSh {medicine.price}
                  </div>
                  <div className="flex items-center gap-2 mt-3">
                    <Avatar className="h-6 w-6">
                      {medicine.pharmacyLogo ? (
                        <AvatarImage
                          src={medicine.pharmacyLogo}
                          alt={medicine.pharmacy}
                        />
                      ) : null}
                      <AvatarFallback className="bg-primary-blue/10 text-primary-blue text-xs">
                        {medicine.pharmacyInitials}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-600">
                      {medicine.pharmacy}
                    </span>
                    <div className="ml-auto flex items-center">
                      <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                      <span className="text-xs ml-1">{medicine.rating}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default PatientMedicines;
