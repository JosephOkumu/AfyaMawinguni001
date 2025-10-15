
import AccountCard from "@/components/home/AccountCard";
import { UserRound, UserCog, Building2, FlaskConical } from "lucide-react";

const AccountsSection = () => {
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
          <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-primary-blue mb-2">Accounts</h2>
          
          <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
            Tailored experiences for different healthcare stakeholders
          </p>
          
          {/* Decorative line */}
          <div className="relative flex items-center justify-center mt-6 sm:mt-8 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-16 sm:w-32"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent w-16 sm:w-32"></div>
            <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-blue-400 rounded-full"></div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 px-4 sm:px-0">
          <AccountCard 
            title="Patients"
            description="Find healthcare providers, book appointments, access medical records, and receive personalized health recommendations."
            icon={UserRound}
            iconBgClass="account-icon-bg-blue"
          />
          
          <AccountCard 
            title="Doctors"
            description="Manage patient appointments, access medical histories, prescribe medications, and coordinate with other healthcare providers."
            icon={UserCog}
            iconBgClass="account-icon-bg-green"
          />
          
          <AccountCard 
            title="Nursing Facilities"
            description="Coordinate patient care, manage staff schedules, track medical supplies, and communicate with doctors and laboratories."
            icon={Building2}
            iconBgClass="account-icon-bg-blue"
          />
          
          <AccountCard 
            title="Laboratories"
            description="Process test requests, manage samples, deliver results, and coordinate with doctors and nursing facilities."
            icon={FlaskConical}
            iconBgClass="account-icon-bg-green"
          />
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

export default AccountsSection;
