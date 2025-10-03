import { Link } from "react-router-dom";
import { Smartphone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-custom-dark text-custom-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4">Aceso Health Solutions</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/about-us" className="hover:text-gray-300">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Policies */}
          <div>
            <h3 className="font-bold text-lg mb-4">Legal & Policies</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/terms-of-service" className="hover:text-gray-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy-policy" className="hover:text-gray-300">
                  Privacy Policy
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>info@acesohealth.co.ke</li>
              <li>
                <Link to="/faq" className="hover:text-gray-300">
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div>
            <h3 className="font-bold text-lg mb-4">Follow Us</h3>
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com/acesohealth" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-sky-500 rounded-full hover:bg-sky-600 transition-all duration-200 hover:scale-110"
                aria-label="Follow us on Facebook"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" 
                    fill="white"
                  />
                </svg>
              </a>
              <a 
                href="https://linkedin.com/company/aceso-health-solutions" 
                target="_blank" 
                rel="noopener noreferrer"
                className="p-2 bg-sky-500 rounded-full hover:bg-sky-600 transition-all duration-200 hover:scale-110"
                aria-label="Follow us on LinkedIn"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none">
                  <path 
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" 
                    fill="white"
                  />
                </svg>
              </a>
            </div>
          </div>

          {/* Download Mobile App */}
          <div>
            <h3 className="font-bold text-lg mb-4">Download Mobile App</h3>
            <ul className="space-y-2">
              <li>
                <a 
                  href="https://play.google.com/store/apps/details?id=com.acesohealthsolutions.app" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gray-300 flex items-center gap-2"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path d="M3,20.5V3.5C3,2.91 3.34,2.39 3.84,2.15L13.69,12L3.84,21.85C3.34,21.6 3,21.09 3,20.5" fill="#32BBFF"/>
                    <path d="M16.81,15.12L6.05,21.34L14.54,12.85L16.81,15.12Z" fill="#32BBFF"/>
                    <path d="M20.16,10.81C20.5,11.08 20.75,11.5 20.75,12C20.75,12.5 20.53,12.9 20.18,13.18L17.89,14.5L15.39,12L17.89,9.5L20.16,10.81Z" fill="#FFBC00"/>
                    <path d="M6.05,2.66L16.81,8.88L14.54,11.15L6.05,2.66Z" fill="#FF5722"/>
                    <path d="M14.54,11.15L16.81,8.88L17.89,9.5L15.39,12L14.54,12.85Z" fill="#4CAF50"/>
                  </svg>
                  Android App
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm">
          <p> 2025 Aceso Health Solutions. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
