import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Search,
  Bell,
  MessageSquare,
  Calendar,
  Package,
  LogOut,
} from "lucide-react";
import AppointmentsSection from "@/components/dashboard/AppointmentsSection";
import { Input } from "@/components/ui/input";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import AIChat from "@/components/AIChat";
import Footer from "@/components/Footer";

const PatientAppointments = () => {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");

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
      active: true,
    },
    { icon: Package, label: "Orders", path: "/patient-dashboard/orders" },
  ];

  return (
    <div className="min-h-screen bg-custom-white">
      {/* Top Navigation Bar */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4">
          <nav className="flex items-center justify-between h-16">
          {/* Logo & User Profile */}
          <div className="flex items-center gap-2">
            <Link to="/patient-dashboard">
              <img 
                src="/aceso.png" 
                alt="Aceso Health Solutions" 
                className="h-[100px] w-auto"
              />
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
          </nav>
        </div>
      </header>

      {/* Dashboard Content */}
      <main className="container mx-auto px-4 py-6">
        {/* Header Card */}
        <Card className="mb-6 bg-gradient-to-r from-green-500/90 to-teal-600/90 text-white border-none shadow-md">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold">My Appointments</h1>
                <p className="opacity-90 mt-1">
                  Manage your upcoming and past appointments
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {navItems.map((item, index) => (
                  <Link key={index} to={item.path}>
                    <Button
                      variant="secondary"
                      size="sm"
                      className={`${item.active ? "bg-white text-green-600" : "bg-white/20 hover:bg-white/30 text-white"} border-none backdrop-blur-sm`}
                    >
                      <item.icon className="h-4 w-4 mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Appointments Section */}
        <AppointmentsSection searchQuery={searchQuery} />
      </main>
      <AIChat />
      <Footer />
    </div>
  );
};

export default PatientAppointments;
