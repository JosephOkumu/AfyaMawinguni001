import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthButton from "./auth/AuthButton";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
            <button 
              onClick={() => scrollToSection('services')} 
              className="text-custom-dark hover:text-primary-blue font-medium transition-colors"
            >
              Services
            </button>
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

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden absolute top-16 left-0 right-0 bg-custom-white shadow-lg border-t z-40">
            <div className="px-4 py-6 space-y-4">
              {/* Navigation Links */}
              <button 
                onClick={() => {
                  scrollToSection('services');
                  setIsMobileMenuOpen(false);
                }} 
                className="block w-full text-left py-3 px-4 text-custom-dark hover:text-primary-blue hover:bg-gray-50 font-medium transition-colors rounded-lg"
              >
                Services
              </button>
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
