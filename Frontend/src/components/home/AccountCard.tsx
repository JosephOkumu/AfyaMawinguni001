
import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface AccountCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  iconBgClass: string;
}

const AccountCard = ({ title, description, icon: Icon, iconBgClass }: AccountCardProps) => {
  return (
    <Card className="group relative h-full bg-white/70 backdrop-blur-sm border-0 shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 overflow-hidden text-center">
      {/* Gradient border effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-primary-blue via-blue-500 to-secondary-green rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      <div className="absolute inset-[1px] bg-white rounded-lg"></div>
      
      {/* Content */}
      <CardContent className="relative p-8 h-full flex flex-col items-center">
        {/* Icon container with animated background */}
        <div className="relative mb-6">
          <div className={`w-16 h-16 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg ${iconBgClass}`}>
            <div className="absolute inset-0 bg-gradient-to-br from-primary-blue/20 to-secondary-green/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <Icon className="h-8 w-8 text-white transition-colors duration-300 relative z-10" />
          </div>
          
          {/* Floating particles effect */}
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping transition-opacity duration-300"></div>
          <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-green-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-pulse transition-opacity duration-300 animation-delay-200"></div>
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-gray-800 mb-4 group-hover:text-primary-blue transition-colors duration-300">
          {title}
        </h3>

        {/* Description */}
        <p className="text-gray-600 leading-relaxed flex-grow group-hover:text-gray-700 transition-colors duration-300">
          {description}
        </p>


        {/* Background pattern */}
        <div className="absolute top-0 right-0 w-32 h-32 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
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

export default AccountCard;
