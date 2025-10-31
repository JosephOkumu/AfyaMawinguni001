import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthButton from "./auth/AuthButton";
import { Menu, X, ChevronDown } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isServicesDropdownOpen, setIsServicesDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Click outside handler for dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsServicesDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Navigation handlers
  const handleServiceNavigation = (service: string) => {
    setIsServicesDropdownOpen(false);
    setIsMobileMenuOpen(false);
    
    // Add navigation logic based on service type
    switch (service) {
      case 'doctor-consultations':
        // Navigate to doctor consultations page or section
        console.log('Navigate to doctor consultations');
        break;
      case 'medicine-delivery':
        console.log('Navigate to medicine delivery');
        break;
      case 'laboratory-services':
        console.log('Navigate to laboratory services');
        break;
      case 'home-nursing':
        console.log('Navigate to home nursing');
        break;
      case 'medical-billing':
        console.log('Navigate to medical billing');
        break;
      case 'admin-support':
        console.log('Navigate to admin support');
        break;
      case 'credentialing':
        console.log('Navigate to credentialing');
        break;
      case 'partner':
        console.log('Navigate to partner page');
        break;
      default:
        break;
    }
  };

  const scrollToSection = (id: string) => {
    // First, check if we're on the home page
    if (location.pathname !== '/') {
      // If not, navigate to home page with the hash
      window.location.href = `/#${id}`;
      return;
    }
    
    // If already on home page, scroll to the section
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  return (
    <header className="bg-custom-white shadow-sm relative z-50">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 z-50">
            <img src="/aceso.png" alt="Aceso Health Solutions" className="h-16 sm:h-20 md:h-[100px] w-auto object-cover" style={{objectPosition: '50% 45%', clipPath: 'inset(25% 0 25% 0)'}} />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center gap-6">
            {/* Navigation Links */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                onMouseEnter={() => setIsServicesDropdownOpen(true)}
                className="flex items-center gap-1 text-custom-dark hover:text-primary-blue font-medium transition-colors"
              >
                Services
                <ChevronDown className={`h-4 w-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {/* Services Dropdown */}
              {isServicesDropdownOpen && (
                <div 
                  className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border z-50"
                  onMouseLeave={() => setIsServicesDropdownOpen(false)}
                >
                  <div className="p-4">
                    {/* View All Services Option */}
                    <button
                      onClick={() => {
                        scrollToSection('services');
                        setIsServicesDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 text-sm font-medium text-primary-blue hover:bg-blue-50 rounded-md mb-3 border-b border-gray-100"
                    >
                      View All Our Services
                    </button>
                    
                    {/* For Patients */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">For Patients</h3>
                      <div className="space-y-1">
                        <button 
                          onClick={() => handleServiceNavigation('doctor-consultations')}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-blue rounded-md"
                        >
                          Doctor Consultations
                        </button>
                        <button 
                          onClick={() => handleServiceNavigation('medicine-delivery')}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-blue rounded-md"
                        >
                          Medicine Delivery
                        </button>
                        <button 
                          onClick={() => handleServiceNavigation('laboratory-services')}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-blue rounded-md"
                        >
                          Laboratory Services
                        </button>
                        <button 
                          onClick={() => handleServiceNavigation('home-nursing')}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-blue rounded-md"
                        >
                          Home Nursing Care
                        </button>
                      </div>
                    </div>
                    
                    {/* For Providers */}
                    <div className="mb-4">
                      <h3 className="font-semibold text-gray-900 mb-2 text-sm">For Providers</h3>
                      <div className="space-y-1">
                        <button 
                          onClick={() => handleServiceNavigation('medical-billing')}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-blue rounded-md"
                        >
                          Medical Billing
                        </button>
                        <button 
                          onClick={() => handleServiceNavigation('admin-support')}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-blue rounded-md"
                        >
                          Remote Admin Support
                        </button>
                        <button 
                          onClick={() => handleServiceNavigation('credentialing')}
                          className="block w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-primary-blue rounded-md"
                        >
                          Credentialing Services
                        </button>
                      </div>
                    </div>
                    
                    {/* Partner With Us */}
                    <div>
                      <button 
                        onClick={() => handleServiceNavigation('partner')}
                        className="w-full text-left px-3 py-2 text-sm font-medium text-secondary-green hover:bg-green-50 rounded-md"
                      >
                        Partner With Us
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => scrollToSection('accounts')} 
              className="text-custom-dark hover:text-primary-blue font-medium transition-colors"
            >
              Accounts
            </button>
            <Link 
              to="/about-us"
              className="text-custom-dark hover:text-primary-blue font-medium transition-colors"
            >
              About Us
            </Link>
            
            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <AuthButton />
              <AuthButton defaultTab="signup">
                Register
              </AuthButton>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-custom-dark hover:text-primary-blue transition-colors z-50"
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>

          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="lg:hidden absolute top-16 left-0 right-0 bg-white shadow-lg border-t z-40">
              <div className="px-4 py-6 space-y-4">
                {/* Mobile Services Dropdown */}
                <div>
                  <button 
                    onClick={() => setIsServicesDropdownOpen(!isServicesDropdownOpen)}
                    className="flex items-center justify-between w-full text-left text-custom-dark hover:text-primary-blue font-medium py-2"
                  >
                    Services
                    <ChevronDown className={`h-4 w-4 transition-transform ${isServicesDropdownOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {/* Mobile Services Dropdown Content */}
                  {isServicesDropdownOpen && (
                    <div className="mt-2 ml-4 space-y-3 border-l-2 border-gray-100 pl-4">
                      {/* View All Services Option */}
                      <button
                        onClick={() => {
                          scrollToSection('services');
                          setIsMobileMenuOpen(false);
                          setIsServicesDropdownOpen(false);
                        }}
                        className="block w-full text-left text-sm font-medium text-primary-blue py-1"
                      >
                        View All Our Services
                      </button>
                      
                      {/* For Patients */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm">For Patients</h4>
                        <div className="space-y-1 ml-2">
                          <button 
                            onClick={() => handleServiceNavigation('doctor-consultations')}
                            className="block w-full text-left text-sm text-gray-700 py-1"
                          >
                            Doctor Consultations
                          </button>
                          <button 
                            onClick={() => handleServiceNavigation('medicine-delivery')}
                            className="block w-full text-left text-sm text-gray-700 py-1"
                          >
                            Medicine Delivery
                          </button>
                          <button 
                            onClick={() => handleServiceNavigation('laboratory-services')}
                            className="block w-full text-left text-sm text-gray-700 py-1"
                          >
                            Laboratory Services
                          </button>
                          <button 
                            onClick={() => handleServiceNavigation('home-nursing')}
                            className="block w-full text-left text-sm text-gray-700 py-1"
                          >
                            Home Nursing Care
                          </button>
                        </div>
                      </div>
                      
                      {/* For Providers */}
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1 text-sm">For Providers</h4>
                        <div className="space-y-1 ml-2">
                          <button 
                            onClick={() => handleServiceNavigation('medical-billing')}
                            className="block w-full text-left text-sm text-gray-700 py-1"
                          >
                            Medical Billing
                          </button>
                          <button 
                            onClick={() => handleServiceNavigation('admin-support')}
                            className="block w-full text-left text-sm text-gray-700 py-1"
                          >
                            Remote Admin Support
                          </button>
                          <button 
                            onClick={() => handleServiceNavigation('credentialing')}
                            className="block w-full text-left text-sm text-gray-700 py-1"
                          >
                            Credentialing Services
                          </button>
                        </div>
                      </div>
                      
                      {/* Partner With Us */}
                      <div>
                        <button 
                          onClick={() => handleServiceNavigation('partner')}
                          className="block w-full text-left text-sm font-medium text-secondary-green py-1"
                        >
                          Partner With Us
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              <button 
                onClick={() => {
                  scrollToSection('accounts');
                  setIsMobileMenuOpen(false);
                }} 
                className="block w-full text-left py-3 px-4 text-custom-dark hover:text-primary-blue hover:bg-gray-50 font-medium transition-colors rounded-lg"
              >
                Accounts
              </button>
              <Link 
                to="/about-us"
                onClick={() => setIsMobileMenuOpen(false)}
                className="block py-3 px-4 text-custom-dark hover:text-primary-blue hover:bg-gray-50 font-medium transition-colors rounded-lg"
              >
                About Us
              </Link>
              
              {/* Auth Buttons */}
              <div className="pt-4 border-t space-y-3">
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    const event = new CustomEvent('openAuthModal', { detail: { tab: 'signin' } });
                    window.dispatchEvent(event);
                  }}
                  className="w-full justify-center bg-gradient-to-r from-primary-blue to-secondary-green hover:brightness-110 hover:scale-[1.02] text-white shadow-sm hover:shadow-md transition-all duration-300 h-10 px-4 py-2 rounded-md font-medium text-sm inline-flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2 h-4 w-4">
                    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/>
                    <polyline points="10,17 15,12 10,7"/>
                    <line x1="15" x2="3" y1="12" y2="12"/>
                  </svg>
                  Sign In
                </button>
                <button 
                  onClick={() => {
                    setIsMobileMenuOpen(false);
                    const event = new CustomEvent('openAuthModal', { detail: { tab: 'signup' } });
                    window.dispatchEvent(event);
                  }}
                  className="w-full justify-center bg-gradient-to-r from-primary-blue to-secondary-green hover:brightness-110 hover:scale-[1.02] text-white shadow-sm hover:shadow-md transition-all duration-300 h-11 px-8 py-2 rounded-md font-medium text-sm inline-flex items-center gap-2"
                >
                  Register
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
