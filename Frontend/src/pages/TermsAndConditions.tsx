import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const TermsAndConditions = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navigation Bar - Only show when user is NOT signed in */}
      {!user && (
        <nav className="bg-white shadow-sm px-4 py-3">
          <div className="container mx-auto">
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
          </div>
        </nav>
      )}
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-blue to-secondary-green text-custom-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Terms and Conditions</h1>
          <p className="text-lg">
            Please read these terms carefully before using our healthcare services.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Section 1: Introduction */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">1. Introduction</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Welcome to Aceso Health Solutions ("we," "our," "us"). These Terms and Conditions govern your use of our website and services, including online doctor consultations, pharmaceutical and herbal supplement purchases, laboratory sample collection, and home nursing care. By accessing or using our platform, you agree to these Terms.
          </p>
        </section>

        {/* Section 2: Eligibility */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">2. Eligibility</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            You must be at least 18 years old to use our services. By using the platform, you confirm that you are legally capable of entering into a binding contract under Kenyan law.
          </p>
        </section>

        {/* Section 3: Services Provided */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">3. Services Provided</h2>
          <ul className="space-y-4 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <div>
                <strong>Online Consultation:</strong> We connect you with licensed healthcare professionals. These consultations are for medical guidance only and should not replace in-person emergency care.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <div>
                <strong>Pharmaceutical & Herbal Products:</strong> Medicines and supplements available for purchase comply with Kenyan Pharmacy and Poisons Board (PPB) guidelines. A valid prescription may be required.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <div>
                <strong>Laboratory Sample Collection:</strong> Customers may book sample collection from their preferred location, with results delivered securely online.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <div>
                <strong>Home Nursing Care:</strong> Nursing services are provided by certified professionals. Scheduling depends on availability.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <div>
                <strong>AI Symptom Checker:</strong> Our AI tool provides informational suggestions on the type of specialist you may need to consult. It is not a medical diagnosis tool. Always consult a licensed doctor.
              </div>
            </li>
          </ul>
        </section>

        {/* Section 4: User Responsibilities */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">4. User Responsibilities</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">●</span>
              <span>Provide accurate and complete personal and medical information.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">●</span>
              <span>Use the platform only for lawful purposes.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">●</span>
              <span>Not misuse or resell prescribed medications or services.</span>
            </li>
          </ul>
        </section>

        {/* Section 5: Payments & Refunds */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">5. Payments & Refunds</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <span>Payments are made via M-PESA or other approved channels.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <span>Fees for consultations, products, or services are payable upfront.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <span>Refunds are only available for services not rendered (e.g., order cancellation before processing).</span>
            </li>
          </ul>
        </section>

        {/* Section 6: Data Protection & Privacy */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">6. Data Protection & Privacy</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We are committed to protecting your personal data in compliance with the Kenya Data Protection Act (2019). Personal health data will be stored securely and used only for service delivery.
          </p>
        </section>

        {/* Section 7: Limitation of Liability */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">7. Limitation of Liability</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">●</span>
              <span>We are not liable for medical decisions you make based solely on AI recommendations.</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">●</span>
              <span>We are not responsible for any delays or cancellations caused by external providers (e.g., courier services).</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">●</span>
              <span>In no event shall we be liable for indirect, incidental, or consequential damages.</span>
            </li>
          </ul>
        </section>

        {/* Section 8: Intellectual Property */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">8. Intellectual Property</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            All content, including text, graphics, logos, and software, is the property of Aceso Health Solutions. You may not reproduce or redistribute without prior written consent.
          </p>
        </section>

        {/* Section 9: Termination of Use */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">9. Termination of Use</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We may suspend or terminate your access if you violate these Terms.
          </p>
        </section>

        {/* Section 10: Governing Law */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">10. Governing Law</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            These Terms shall be governed by and construed under the laws of Kenya.
          </p>
        </section>
        
        {/* Back to Home */}
        <div className="text-center mt-12">
          <Link to="/" className="inline-block px-6 py-3 bg-primary-blue text-custom-white font-medium rounded-md hover:bg-blue-700 transition duration-300">
            Back to Home
          </Link>
        </div>
      </div>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsAndConditions;
