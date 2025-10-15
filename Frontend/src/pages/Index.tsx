
import HeroSection from "@/components/home/HeroSection";
import FeaturesSection from "@/components/home/FeaturesSection";
import AccountsSection from "@/components/home/AccountsSection";
import Footer from "@/components/Footer";
import AuthButton from "@/components/auth/AuthButton";
import AIChat from "@/components/AIChat";


const Index = () => {

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
      <section className="bg-gradient-to-r from-primary-blue to-secondary-green py-12 sm:py-16 text-white">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6">Ready to get started?</h2>
          <p className="max-w-2xl mx-auto mb-6 sm:mb-8 text-base sm:text-lg px-4 sm:px-0">
            Join Aceso Health Solutions today and experience the future of healthcare management.
          </p>
          <div className="flex justify-center px-4 sm:px-0">
            <AuthButton className="w-full sm:w-auto" />
          </div>
        </div>
      </section>





      {/* Footer */}
      <Footer />
      
      {/* AI Chat Component */}
      <AIChat />
    </div>
  );
};

export default Index;
