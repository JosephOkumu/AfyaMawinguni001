import FeatureCard from "@/components/home/FeatureCard";
import {
  UserCog,
  Calendar,
  UserRound,
  Video,
  Pill,
  Beaker,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const FeaturesSection = () => {
  return (
    <div className="relative py-20 bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-1/2 transform -translate-x-1/2 w-80 h-80 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative container mx-auto px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-bold text-primary-blue mb-2">
            Our Services
          </h2>
          
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Comprehensive healthcare solutions for patients and providers
          </p>
          
          {/* Decorative line */}
          <div className="flex items-center justify-center mt-8 mb-4">
            <div className="h-px bg-gradient-to-r from-transparent via-blue-300 to-transparent w-32"></div>
            <div className="mx-4 w-2 h-2 bg-blue-400 rounded-full"></div>
            <div className="h-px bg-gradient-to-r from-transparent via-green-300 to-transparent w-32"></div>
          </div>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          <div className="group">
            <FeatureCard
              title="AI Health Assistant"
              description="Meet Alex, our intelligent AI assistant who helps you find the right healthcare professional based on your symptoms and preferences, offering personalized recommendations and quick access to medical advice."
              icon={UserCog}
            />
          </div>

          <div className="group">
            <FeatureCard
              title="Appointment Scheduling"
              description="Book appointments with doctors, nursing facilities, and laboratories with just a few clicks. Manage your healthcare schedule in one convenient place."
              icon={Calendar}
            />
          </div>

          <div className="group">
            <FeatureCard
              title="Secure Medical Records"
              description="Store and access your medical records securely. Share them with healthcare providers as needed, ensuring continuity of care across different facilities."
              icon={UserRound}
            />
          </div>

          <div className="group">
            <FeatureCard
              title="Telemedicine Services"
              description="Connect with healthcare professionals remotely through video consultations. Get medical advice from the comfort of your home."
              icon={Video}
            />
          </div>

          <div className="group">
            <FeatureCard
              title="Medication Tracking"
              description="Keep track of your medications, dosages, and schedules. Receive reminders to ensure you never miss a dose."
              icon={Pill}
            />
          </div>

          <div className="group">
            <FeatureCard
              title="Lab Results & Imaging"
              description="View your laboratory results and medical imaging reports online. Easily share them with your healthcare providers for better coordination."
              icon={Beaker}
            />
          </div>
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

export default FeaturesSection;
