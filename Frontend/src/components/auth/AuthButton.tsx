
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { LogIn } from "lucide-react";
import AuthModal from "./AuthModal";

interface AuthButtonProps {
  defaultTab?: "signin" | "signup";
  className?: string;
  children?: React.ReactNode;
}

const AuthButton = ({ defaultTab = "signin", className, children }: AuthButtonProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <Button 
        onClick={() => setIsModalOpen(true)}
        className={className || "bg-primary-blue hover:bg-primary-blue/90 text-white"}
      >
        {children || (
          <>
            <LogIn className="mr-2 h-4 w-4" /> Sign In
          </>
        )}
      </Button>
      
      <AuthModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        defaultTab={defaultTab}
      />
    </>
  );
};

export default AuthButton;
