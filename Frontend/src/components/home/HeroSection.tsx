import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import AuthButton from "@/components/auth/AuthButton";
import { ChevronLeft, ChevronRight } from "lucide-react";

const HeroSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const heroImages = [
    "/Aceso_Hero1.jpg",
    "/Aceso_Hero2.jpg", 
    "/Aceso_Hero3.jpg"
  ];

  // Auto-rotate images every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => 
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [heroImages.length]);

  const goToPrevious = () => {
    setCurrentImageIndex(
      currentImageIndex === 0 ? heroImages.length - 1 : currentImageIndex - 1
    );
  };

  const goToNext = () => {
    setCurrentImageIndex(
      currentImageIndex === heroImages.length - 1 ? 0 : currentImageIndex + 1
    );
  };

  return (
    <div className="relative overflow-hidden" style={{ height: 'calc(100vh - 90px)' }}>
      {/* Image Carousel Background */}
      <div className="absolute inset-0">
        {heroImages.map((image, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentImageIndex ? "opacity-100" : "opacity-0"
            }`}
          >
            <img
              src={image}
              alt={`Aceso Health Hero ${index + 1}`}
              className="w-full h-full object-cover"
              style={{ objectPosition: '50% 15%' }}
            />
            {/* Dark overlay for text readability */}
            <div className="absolute inset-0 bg-black/40"></div>
          </div>
        ))}
      </div>


      {/* Carousel Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-20 flex space-x-3">
        {heroImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentImageIndex(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentImageIndex
                ? "bg-white scale-125"
                : "bg-white/50 hover:bg-white/75"
            }`}
          />
        ))}
      </div>

      {/* Hero Content */}
      <div className="relative z-10 flex items-center justify-center text-white text-center" style={{ height: 'calc(100vh - 90px)' }}>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6 border border-white/20">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Trusted Healthcare Platform</span>
            </div>
            
            {/* Main Heading */}
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="block">End-to-end</span>
              <span className="block bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">
                Healthcare Management
              </span>
            </h1>
            
            {/* Description */}
            <p className="max-w-3xl mx-auto mb-8 text-lg md:text-xl leading-relaxed text-gray-100">
              Connect with doctors, nursing services, and laboratories all in one
              place. Our AI assistant Alex helps you find the perfect healthcare
              professional for your needs.
            </p>
            
            {/* CTA Button */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <AuthButton 
                defaultTab="signup" 
                className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-full text-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                Get Started
              </AuthButton>
              <Button 
                variant="outline" 
                className="bg-transparent border-white/30 text-white hover:bg-white/10 px-8 py-4 rounded-full text-lg font-semibold backdrop-blur-sm"
                onClick={() => {
                  const servicesSection = document.getElementById('services');
                  if (servicesSection) {
                    servicesSection.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
