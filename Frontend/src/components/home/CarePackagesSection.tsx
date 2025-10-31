import React from "react";
import { Heart, Baby, Shield, Clock, User, Stethoscope, Utensils, Bandage, Phone, Calendar, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const CarePackagesSection = () => {
  const packages = [
    {
      title: "Post-Surgery Care",
      subtitle: "Recovery Support Package",
      price: "12,500",
      duration: "7 Days Coverage",
      icon: Heart,
      iconBg: "bg-gradient-to-br from-red-400 to-pink-500",
      cardBg: "bg-gradient-to-br from-white to-red-50/50",
      features: [
        "3-day dedicated nurse support",
        "1 doctor consultation session",
        "Nutrition consultation & meal planning",
        "Wound management & care guidance"
      ]
    },
    {
      title: "Post-Maternity Care",
      subtitle: "New Mom & Baby Package",
      price: "10,800",
      duration: "14 Days Coverage",
      icon: Baby,
      iconBg: "bg-gradient-to-br from-pink-400 to-purple-500",
      cardBg: "bg-gradient-to-br from-white to-pink-50/50",
      features: [
        "Professional lactation guidance",
        "2-day home nurse visits",
        "Pediatric teleconsultation access",
        "Newborn care & nutrition support"
      ]
    },
    {
      title: "Wellness & Preventive",
      subtitle: "Annual Health Package",
      price: "7,500",
      duration: "Full Year Access",
      icon: Shield,
      iconBg: "bg-gradient-to-br from-green-400 to-blue-500",
      cardBg: "bg-gradient-to-br from-white to-green-50/50",
      features: [
        "Comprehensive annual checkup",
        "Complete laboratory testing",
        "Nutrition consultation & planning",
        "Health monitoring & follow-up"
      ]
    }
  ];

  return (
    <div className="relative py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden z-0">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob z-0"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000 z-0"></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000 z-0"></div>
      </div>

      <div className="relative container mx-auto px-4 sm:px-6">
        {/* Header Section */}
        <div className="text-center mb-12 sm:mb-16">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-blue mb-2">Care Packages</h2>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Comprehensive healthcare packages designed for your specific needs
          </p>
          
          {/* Decorative line */}
          <div className="relative flex items-center justify-center mt-6 sm:mt-8 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-16 sm:w-32"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent w-16 sm:w-32"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-4 sm:px-0 max-w-7xl mx-auto">
          {packages.map((pkg, index) => (
            <div
              key={index}
              className={`relative group ${pkg.cardBg} rounded-3xl border border-gray-200/50 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 backdrop-blur-sm overflow-hidden h-[640px] flex flex-col`}
            >
              {/* Header Section */}
              <div className="relative p-8 pb-6">
                {/* Icon */}
                <div className="flex justify-center mb-6">
                  <div className={`${pkg.iconBg} p-4 rounded-2xl shadow-lg`}>
                    <pkg.icon className="h-10 w-10 text-white" />
                  </div>
                </div>

                {/* Title & Subtitle */}
                <div className="text-center mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {pkg.title}
                  </h3>
                  <p className="text-sm font-medium text-gray-600 bg-white/60 rounded-full px-4 py-1 inline-block">
                    {pkg.subtitle}
                  </p>
                </div>

                {/* Duration Badge */}
                <div className="text-center mb-6">
                  <span className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white text-xs font-semibold px-4 py-2 rounded-full">
                    {pkg.duration}
                  </span>
                </div>
              </div>

              {/* Features Section */}
              <div className="flex-1 px-8">
                <div className="space-y-4">
                  {pkg.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      </div>
                      <span className="text-gray-700 text-sm font-medium leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price and CTA Section */}
              <div className="p-8 pt-6 mt-auto">
                <div className="bg-white/80 rounded-2xl p-6 border border-gray-100 shadow-sm">
                  {/* Price */}
                  <div className="text-center mb-6">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-sm font-medium text-gray-600">KES</span>
                        <span className="text-3xl font-bold text-gray-900">{pkg.price}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 font-medium">One-time package fee</p>
                  </div>
                  
                  {/* Book Now Button */}
                  <Button 
                    className="w-full bg-gradient-to-r from-primary-blue to-secondary-green hover:brightness-110 hover:scale-[1.02] text-white font-bold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 text-lg"
                    onClick={() => {
                      console.log(`Booking ${pkg.title}`);
                    }}
                  >
                    Book Now
                  </Button>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl"></div>
              <div className="absolute bottom-4 left-4 w-16 h-16 bg-gradient-to-tr from-white/20 to-transparent rounded-full blur-lg"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom CSS for animations */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }
          .animate-blob {
            animation: blob 7s infinite;
          }
          .animation-delay-1000 {
            animation-delay: 1s;
          }
          .animation-delay-2000 {
            animation-delay: 2s;
          }
          .animation-delay-4000 {
            animation-delay: 4s;
          }
        `
      }} />
    </div>
  );
};

export default CarePackagesSection;
