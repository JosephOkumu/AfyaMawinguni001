
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface FeatureCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
}

const FeatureCard = ({ title, description, icon: Icon }: FeatureCardProps) => {
  return (
    <Card className="group relative h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-blue via-blue-500 to-secondary-green rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-[1px] bg-white rounded-lg"></div>
      
      {/* Content */}
      <CardContent className="relative p-4 sm:p-6 lg:p-8 h-full flex flex-col">
        {/* Icon container with animated background */}
        <div className="relative mb-4 sm:mb-6">
          <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-blue-100 to-green-100 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/20 to-secondary-green/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Icon className="h-6 w-6 sm:h-7 sm:w-7 lg:h-8 lg:w-8 text-primary-blue group-hover:text-white transition-colors duration-300 relative z-10" />
          </div>
          
          {/* Floating particles effect */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 animation-delay-200"></div>
        </div>

        {/* Title */}
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-3 sm:mb-4 group-hover:text-primary-blue transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-sm sm:text-base text-gray-600 leading-relaxed flex-grow group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>

        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-24 h-24 sm:w-28 sm:h-28 lg:w-32 lg:h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
          <Icon className="w-full h-full text-primary-blue transform rotate-12" />
        </div>
      </CardContent>

      {/* Animated border glow */}
      <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-primary-blue via-transparent to-secondary-green animate-pulse"></div>
      </div>
    </Card>
  );
};

export default FeatureCard;
