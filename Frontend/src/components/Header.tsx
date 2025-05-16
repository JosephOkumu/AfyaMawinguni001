
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import AuthButton from "./auth/AuthButton";

const Header = () => {
  return (
    <header className="bg-custom-white shadow-sm">
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <span className="text-xl font-bold">
              <span className="text-primary-blue">AFYA</span>
              <span className="text-secondary-green"> MAWINGUNI</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/features" className="text-custom-dark hover:text-primary-blue font-medium">
              Services
            </Link>
            <Link to="/accounts" className="text-custom-dark hover:text-primary-blue font-medium">
              Accounts
            </Link>
            
            {/* New Provider Dashboard Links */}
            <div className="group relative">
              <span className="text-custom-dark hover:text-primary-blue font-medium cursor-pointer">
                Provider Dashboards
              </span>
              <div className="absolute hidden group-hover:flex flex-col bg-white shadow-lg rounded-md mt-2 p-2 space-y-2 z-10">
                <Link to="/provider/home-nursing" className="hover:bg-gray-100 p-2 rounded">
                  Home Nursing
                </Link>
                <Link to="/provider/doctor" className="hover:bg-gray-100 p-2 rounded">
                  Doctor
                </Link>
                <Link to="/provider/laboratory" className="hover:bg-gray-100 p-2 rounded">
                  Laboratory
                </Link>
              </div>
            </div>
            
            <AuthButton />
          </div>

          {/* CTA Button */}
          <AuthButton defaultTab="signup">
            Register
          </AuthButton>
        </nav>
      </div>
    </header>
  );
};

export default Header;
