
import React from "react";
import { Search, Bell, MessageSquare } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const DashboardHeader = () => {
  return (
    <div className="w-full flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
      <div className="relative w-full sm:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input 
          type="search" 
          placeholder="Search..." 
          className="pl-10 w-full sm:w-64 border-blue-100 focus-visible:ring-blue-200"
        />
      </div>
      
      <div className="flex items-center justify-end w-full sm:w-auto space-x-3 sm:space-x-4">
        <Button variant="outline" size="icon" className="relative rounded-full border-none hover:bg-blue-50 h-8 w-8 sm:h-10 sm:w-10">
          <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          <span className="absolute top-0 right-0 sm:top-1 sm:right-1 bg-red-500 rounded-full w-2 h-2"></span>
        </Button>
        <Button variant="outline" size="icon" className="relative rounded-full border-none hover:bg-blue-50 h-8 w-8 sm:h-10 sm:w-10">
          <MessageSquare className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600" />
          <span className="absolute top-0 right-0 sm:top-1 sm:right-1 bg-red-500 rounded-full w-2 h-2"></span>
        </Button>
        <Avatar className="h-8 w-8 sm:h-9 sm:w-9 border-2 border-primary-blue/20">
          <AvatarImage src="https://randomuser.me/api/portraits/men/32.jpg" alt="User" />
          <AvatarFallback className="text-xs sm:text-sm">JD</AvatarFallback>
        </Avatar>
      </div>
    </div>
  );
};

export default DashboardHeader;
