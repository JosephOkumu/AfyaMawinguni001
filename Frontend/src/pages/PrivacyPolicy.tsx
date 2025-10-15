import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const PrivacyPolicy = () => {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      {/* Navigation Bar - Only show when user is NOT signed in */}
      {!user && (
        <nav className="bg-white shadow-sm px-4 py-3">
          <div className="container mx-auto flex items-center justify-between">
            <Link to="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-800">
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Home</span>
            </Link>
            <Link to="/">
              <img src="/aceso.png" alt="Aceso Health Solutions" className="h-12 w-auto" />
            </Link>
          </div>
        </nav>
      )}
      
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-primary-blue to-secondary-green text-custom-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-lg">
            Your privacy matters to us. Learn how we protect and handle your personal information.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12 space-y-8">
        {/* Header Information */}
        <section className="text-center bg-white rounded-lg shadow-sm p-6">
          <p className="text-gray-600 mb-2"><strong>Effective Date:</strong> 3/10/2025</p>
          <p className="text-gray-600 mb-4"><strong>Last Updated:</strong> 3/10/2025</p>
          <p className="text-lg text-gray-700 leading-relaxed">
            Aceso Health Solutions ("we," "our," "us") respects your privacy and is committed to protecting your personal data. 
            This Privacy Policy explains how we collect, use, store, and protect your personal information when you use our website and services.
          </p>
        </section>

        {/* Section 1: Information We Collect */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">1. Information We Collect</h2>
          <p className="text-lg text-gray-700 mb-4">We may collect the following types of information:</p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <div>
                <strong>Personal Identification Data:</strong> Full name, date of birth, ID/passport number, phone number, email address, and physical address.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <div>
                <strong>Medical Data:</strong> Health history, symptoms, prescriptions, lab results, and consultation records.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <div>
                <strong>Payment Data:</strong> M-PESA transaction details or other payment method information.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <div>
                <strong>Technical Data:</strong> IP address, device type, browser type, and cookies.
              </div>
            </li>
          </ul>
        </section>

        {/* Section 2: How We Use Your Information */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">2. How We Use Your Information</h2>
          <p className="text-lg text-gray-700 mb-4">We use your information to:</p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">●</span>
              <span>Provide healthcare services (consultations, prescriptions, lab tests, home nursing).</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">●</span>
              <span>Facilitate medicine and supplement orders.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">●</span>
              <span>Process payments and issue receipts.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">●</span>
              <span>Send updates, notifications, or reminders.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">●</span>
              <span>Improve our services through analytics and customer feedback.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">●</span>
              <span>Comply with legal and regulatory requirements in Kenya.</span>
            </li>
          </ul>
        </section>

        {/* Section 3: Sharing of Information */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">3. Sharing of Information</h2>
          <p className="text-lg text-gray-700 mb-4">We may share your data with:</p>
          <ul className="space-y-3 text-gray-700 mb-4">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <div>
                <strong>Healthcare Professionals:</strong> Licensed doctors, nurses, and pharmacists for service delivery.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <div>
                <strong>Laboratory Partners:</strong> For processing and delivering test results.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <div>
                <strong>Delivery Providers:</strong> To facilitate medicine or supplement delivery.
              </div>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <div>
                <strong>Regulatory Authorities:</strong> If required by Kenyan law.
              </div>
            </li>
          </ul>
          <p className="text-lg text-gray-700 font-semibold">
            We do not sell, rent, or trade your personal information to third parties.
          </p>
        </section>

        {/* Section 4: Data Protection & Security */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">4. Data Protection & Security</h2>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2">●</span>
              <span>We store all personal data securely in compliance with the Kenya Data Protection Act (2019).</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">●</span>
              <span>Medical data is encrypted and accessible only to authorized healthcare providers.</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2">●</span>
              <span>We use SSL encryption and secure servers to protect your data.</span>
            </li>
          </ul>
        </section>

        {/* Section 5: Data Retention */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">5. Data Retention</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We will retain your personal and medical data only as long as necessary to provide services, 
            comply with legal requirements, or resolve disputes.
          </p>
        </section>

        {/* Section 6: Your Rights */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">6. Your Rights (as per the Data Protection Act)</h2>
          <p className="text-lg text-gray-700 mb-4">You have the right to:</p>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <span>Access your personal data.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <span>Request correction of inaccurate or incomplete data.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <span>Withdraw consent for data processing (except where required by law).</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <span>Request deletion of your data, subject to legal retention requirements.</span>
            </li>
            <li className="flex items-start">
              <span className="text-blue-500 mr-2">●</span>
              <span>Lodge a complaint with the Office of the Data Protection Commissioner (ODPC) Kenya.</span>
            </li>
          </ul>
        </section>

        {/* Section 7: Cookies & Tracking */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">7. Cookies & Tracking</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our website may use cookies to improve user experience and track usage patterns. 
            You may disable cookies in your browser settings, but some features may not function properly.
          </p>
        </section>

        {/* Section 8: Children's Privacy */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">8. Children's Privacy</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            Our services are intended for users 18 years and older. We do not knowingly collect 
            personal data from minors without parental or guardian consent.
          </p>
        </section>

        {/* Section 9: Changes to this Privacy Policy */}
        <section className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-3xl font-semibold text-gray-800 mb-4">9. Changes to this Privacy Policy</h2>
          <p className="text-lg text-gray-700 leading-relaxed">
            We may update this Privacy Policy from time to time. Any changes will be posted on this page 
            with an updated "Effective Date."
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

export default PrivacyPolicy;
