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
