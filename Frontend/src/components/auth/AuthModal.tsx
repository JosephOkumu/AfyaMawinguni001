import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  User, 
  Lock, 
  Mail, 
  UserRound, 
  Stethoscope, 
  Building2, 
  FlaskConical 
} from "lucide-react";

type UserType = "patient" | "doctor" | "nursing" | "laboratory";

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: "signin" | "signup";
}



const AuthModal = ({ isOpen, onClose, defaultTab = "signin" }: AuthModalProps) => {
  const [activeTab, setActiveTab] = useState<"signin" | "signup">(defaultTab);
  const [userType, setUserType] = useState<UserType>("patient");

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign in logic here
    console.log("Sign in submitted");
  };

  const handleSignUp = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle sign up logic here
    console.log("Sign up submitted with user type:", userType);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] p-0 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="bg-gradient-to-r from-primary-blue to-secondary-green p-6 text-white">
          <DialogTitle className="text-2xl font-bold text-center">Welcome to Afya Mawinguni</DialogTitle>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "signin" | "signup")} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 p-3 gap-3 bg-transparent">
            <TabsTrigger 
              value="signin" 
              className="text-lg py-3 bg-gradient-to-r from-primary-blue to-secondary-green text-white font-medium hover:brightness-110 rounded-md"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="signup" 
              className="text-lg py-3 bg-gradient-to-r from-secondary-green to-primary-blue text-white font-medium hover:brightness-110 rounded-md"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>
          
          <div className="px-6 pb-6">
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <Mail className="h-5 w-5" />
                    </span>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="Enter your email" 
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </span>
                    <Input 
                      id="password" 
                      type="password" 
                      placeholder="Enter your password" 
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex justify-between items-center text-sm">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="remember" className="rounded border-gray-300" />
                    <label htmlFor="remember">Remember me</label>
                  </div>
                  <a href="#" className="text-primary-blue hover:underline">Forgot password?</a>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-primary-blue to-secondary-green text-white py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium text-lg hover:scale-[1.02] hover:brightness-105"
                  size="lg"
                >
                  Sign In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="signup">
              <div className="mb-6">
                <Label className="mb-2 block">I am a:</Label>
                <div className="grid grid-cols-2 gap-4 mt-2">
                  {(['patient', 'doctor', 'nursing', 'laboratory'] as UserType[]).map((type) => (
                    <div 
                      key={type}
                      onClick={() => setUserType(type)}
                      className={`
                        relative p-4 rounded-lg cursor-pointer transition-all duration-200
                        ${userType === type 
                          ? 'bg-gradient-to-br from-primary-blue/10 to-secondary-green/10 border-2 border-primary-blue' 
                          : 'bg-gray-50 border-2 border-gray-200 hover:bg-gray-100'
                        }
                      `}
                    >
                      <div className={`
                        w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2
                        ${userType === type 
                          ? type === 'patient' || type === 'nursing' 
                            ? 'bg-primary-blue text-white' 
                            : 'bg-secondary-green text-white'
                          : 'bg-gray-200 text-gray-500'
                        }
                      `}>
                        {type === 'patient' && <UserRound className="h-6 w-6" />}
                        {type === 'doctor' && <Stethoscope className="h-6 w-6" />}
                        {type === 'nursing' && <Building2 className="h-6 w-6" />}
                        {type === 'laboratory' && <FlaskConical className="h-6 w-6" />}
                      </div>
                      <p className={`text-center font-medium capitalize ${userType === type ? 'text-primary-blue' : 'text-gray-700'}`}>
                        {type}
                      </p>
                      {userType === type && (
                        <div className="absolute top-2 right-2 w-4 h-4 bg-primary-blue rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-name">Full Name</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <User className="h-5 w-5" />
                    </span>
                    <Input 
                      id="signup-name" 
                      type="text" 
                      placeholder="Enter your full name" 
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <Mail className="h-5 w-5" />
                    </span>
                    <Input 
                      id="signup-email" 
                      type="email" 
                      placeholder="Enter your email" 
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </span>
                    <Input 
                      id="signup-password" 
                      type="password" 
                      placeholder="Create a password" 
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="signup-confirm-password">Confirm Password</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-gray-400">
                      <Lock className="h-5 w-5" />
                    </span>
                    <Input 
                      id="signup-confirm-password" 
                      type="password" 
                      placeholder="Confirm your password" 
                      className="pl-10"
                      required
                    />
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm">
                  <input type="checkbox" id="terms" className="rounded border-gray-300" required />
                  <label htmlFor="terms">
                    I agree to the <a href="#" className="text-primary-blue hover:underline">Terms of Service</a> and <a href="#" className="text-primary-blue hover:underline">Privacy Policy</a>
                  </label>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full bg-gradient-to-r from-secondary-green to-primary-blue text-white py-6 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 font-medium text-lg hover:scale-[1.02] hover:brightness-105"
                  size="lg"
                >
                  Sign Up as {userType.charAt(0).toUpperCase() + userType.slice(1)}
                </Button>
              </form>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AuthModal;