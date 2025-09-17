import { Link } from "react-router-dom";

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

          {/* For Providers */}
          <div>
            <h3 className="font-bold text-lg mb-4">For Providers</h3>
            <ul className="space-y-2">
              <li>
                <Link to="#" className="hover:text-gray-300">
                  Provider Registration
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  Practice Management
                </Link>
              </li>
              <li>
                <Link to="#" className="hover:text-gray-300">
                  Patient Coordination
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
