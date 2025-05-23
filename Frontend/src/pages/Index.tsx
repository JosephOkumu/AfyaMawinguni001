
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import AccountsSection from "@/components/home/AccountsSection";
import Footer from "@/components/Footer";
import AuthButton from "@/components/auth/AuthButton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import AIChat from "@/components/AIChat";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useState } from "react";
import { Phone } from "lucide-react";

const Index = () => {
  const [appDownloadDialogOpen, setAppDownloadDialogOpen] = useState(false);
  
  const handlePrescriptionRefill = () => {
    // Check if on mobile or desktop
    if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      // On mobile, directly open the app store
      const isAndroid = /Android/i.test(navigator.userAgent);
      if (isAndroid) {
        window.location.href = "https://play.google.com/store/apps/details?id=app.lovable.afyamawinguni";
      } else {
        window.location.href = "https://apps.apple.com/app/afya-mawinguni/id123456789";
      }
    } else {
      // On desktop, show a dialog
      setAppDownloadDialogOpen(true);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <HeroSection />

      {/* Features Section */}
      <div id="services">
        <FeaturesSection />
      </div>

      {/* Account Types Section */}
      <div id="accounts">
        <AccountsSection />
      </div>
      
      {/* Call to Action Section */}
      <section className="bg-gradient-to-r from-primary-blue to-secondary-green py-16 text-white">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-6">Ready to get started?</h2>
          <p className="max-w-2xl mx-auto mb-8 text-lg">
            Join Afya Mawinguni today and experience the future of healthcare management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <AuthButton />
            <Button variant="outline" className="bg-transparent text-white border-white hover:bg-white/10">
              <Link to="/patient-dashboard">View Demo</Link>
            </Button>
            <Button 
              onClick={handlePrescriptionRefill}
              className="bg-white text-primary-blue hover:bg-white/90"
            >
              Prescription & Refill
            </Button>
          </div>
        </div>
      </section>

      {/* App Download Dialog */}
      <Dialog open={appDownloadDialogOpen} onOpenChange={setAppDownloadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <div className="text-center p-4">
            <div className="w-16 h-16 bg-gradient-to-r from-primary-blue to-secondary-green rounded-full flex items-center justify-center mx-auto mb-4">
              <Phone className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Download Our Mobile App</h2>
            <p className="text-gray-600 mb-6">
              To access Prescription & Refill services, please download our mobile app from the store:
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                className="bg-black text-white hover:bg-black/90"
                onClick={() => window.open("https://apps.apple.com/app/afya-mawinguni/id123456789", "_blank")}
              >
                App Store
              </Button>
              <Button 
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={() => window.open("https://play.google.com/store/apps/details?id=app.lovable.afyamawinguni", "_blank")}
              >
                Google Play
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Footer */}
      <Footer />
      
      {/* AI Chat Component */}
      <AIChat />
    </div>
  );
};

export default Index;
