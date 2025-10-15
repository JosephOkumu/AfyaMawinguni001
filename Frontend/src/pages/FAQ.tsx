import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { ArrowLeft } from "lucide-react";
import Footer from "@/components/Footer";

const FAQ = () => {
  const { user } = useAuth();
  
  const faqs = [
    {
      question: "How do I book an online doctor consultation?",
      answer: "Simply sign up on our website, choose a doctor or specialty, and select a convenient time. You'll receive confirmation via SMS or email with your consultation details."
    },
    {
      question: "What types of doctors are available?",
      answer: "We have a wide range of licensed specialists including general practitioners, pediatricians, gynecologists, dermatologists, nutritionists, and more."
    },
    {
      question: "Can I use the AI symptom checker instead of seeing a doctor?",
      answer: "No. The AI symptom checker is a guide that helps suggest which type of doctor you may need. It is not a substitute for professional medical advice. Always consult a licensed doctor for diagnosis and treatment."
    },
    {
      question: "How do I order medicines or supplements?",
      answer: "You can upload your prescription or browse our store for approved over-the-counter medicines and herbal supplements. Once you place your order, payment is done via M-PESA and your items will be delivered to your doorstep."
    },
    {
      question: "Do I need a prescription to buy medicine?",
      answer: "Yes, for prescription-only medicines you must upload a valid prescription from a licensed doctor. Over-the-counter medicines and herbal supplements do not require a prescription."
    },
    {
      question: "How long does delivery take?",
      answer: "Orders are processed within 12–24 hours and delivered through a courier service of your choice."
    },
    {
      question: "Can I schedule lab tests from home?",
      answer: "Yes. You can book a lab sample collection from your home. A certified lab technician will visit, collect samples, and your results will be sent to you online or via email."
    },
    {
      question: "What is included in home nursing care?",
      answer: "Our trained nurses provide services such as wound care, IV administration, vital signs monitoring, post-surgery care, and elderly support — all at the comfort of your home."
    },
    {
      question: "How do I pay for services?",
      answer: "All payments are made via M-PESA Till Number 6694115 or card payment. A payment confirmation will be sent to you immediately."
    },
    {
      question: "Is my data safe?",
      answer: "Yes. We comply with the Kenya Data Protection Act (2019). Your health and personal data are securely encrypted and only shared with authorized healthcare providers."
    },
    {
      question: "What if I need to cancel a booking?",
      answer: "You can cancel up to 12 hours before your appointment for a full refund or reschedule at no extra cost. Late cancellations may incur a small fee."
    },
    {
      question: "Can children use the service?",
      answer: "Yes, but bookings must be made by a parent or guardian. Our pediatricians are available for children's consultations."
    }
  ];

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
          <h1 className="text-5xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-lg">
            Find answers to common questions about our healthcare services.
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="container mx-auto px-4 py-12">
        <div className="space-y-6">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-start">
                <span className="text-blue-500 mr-3 font-bold">{index + 1}.</span>
                {faq.question}
              </h3>
              <p className="text-lg text-gray-700 leading-relaxed ml-8">
                {faq.answer}
              </p>
            </div>
          ))}
        </div>

        {/* Contact Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-8 text-center">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Still have questions?
          </h2>
          <p className="text-lg text-gray-700 mb-6">
            If you can't find the answer you're looking for, feel free to contact our support team.
          </p>
          <div className="space-y-2">
            <p className="text-gray-600">
              <strong>Email:</strong> info@acesohealth.co.ke
            </p>
          </div>
        </div>
        
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

export default FAQ;
