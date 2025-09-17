import { Link } from "react-router-dom";
import { Smartphone } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-custom-dark text-custom-white mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
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

          {/* Download Mobile App */}
          <div>
            <h3 className="font-bold text-lg mb-4">Download Mobile App</h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  to="#" 
                  className="hover:text-gray-300 flex items-center gap-2"
                >
                  <Smartphone className="h-5 w-5" />
                  Android App
                </Link>
              </li>
              <li>
                <Link 
                  to="#" 
                  className="hover:text-gray-300 flex items-center gap-2"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  iOS App
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Us */}
          <div>
            <h3 className="font-bold text-lg mb-4">Contact Us</h3>
            <ul className="space-y-2">
              <li>info@acesohealthsolutions.com</li>
              <li>Support Center</li>
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
