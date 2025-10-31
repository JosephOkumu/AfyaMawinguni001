import React from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Calendar, Users, Phone, Clock, Shield, Mail, Headphones } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const RemoteAdmin = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-green-50/20">
      <Header />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-2xl mb-6">
              <Headphones className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Remote Medical Administration
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Comprehensive remote administrative services that allow your facility to run smoothly 
              without the need for an on-site administrative team.
            </p>
            <div className="flex justify-center mt-8">
              <Button className="bg-gradient-to-r from-primary-blue to-secondary-green hover:brightness-110 text-white px-8 py-3 text-lg">
                Request a Quote
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            
            {/* Left Column - Service Details */}
            <div className="space-y-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Calendar className="h-6 w-6 text-primary-blue" />
                  Our Administrative Services
                </h2>
                
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Appointment Scheduling & Management</h3>
                      <p className="text-gray-600">Complete appointment scheduling, patient reminders, cancellations, and rescheduling services.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Patient Record Management</h3>
                      <p className="text-gray-600">Remote patient record management and follow-up services to ensure continuous care.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Patient Communication</h3>
                      <p className="text-gray-600">Handle patient inquiries, appointment confirmations, and follow-up communications.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <CheckCircle className="h-6 w-6 text-green-500 mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-2">Administrative Task Management</h3>
                      <p className="text-gray-600">Complete administrative support allowing your staff to focus on patient care.</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Benefits */}
              <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl p-8 border border-purple-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <Shield className="h-6 w-6 text-primary-blue" />
                  Benefits of Remote Administration
                </h2>
                
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">24/7 Support</h3>
                    <p className="text-sm text-gray-600">Round-the-clock administrative support for your facility</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Focus on Patient Care</h3>
                    <p className="text-sm text-gray-600">Your staff can focus more on patients, less on admin tasks</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Reduced Overhead</h3>
                    <p className="text-sm text-gray-600">No need for on-site administrative staff</p>
                  </div>
                  
                  <div className="text-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-3">
                      <CheckCircle className="h-6 w-6 text-white" />
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2">Improved Efficiency</h3>
                    <p className="text-sm text-gray-600">Streamlined processes and reduced scheduling conflicts</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column - Contact Form */}
            <div className="lg:sticky lg:top-24">
              <div className="bg-white rounded-2xl p-8 shadow-xl border border-gray-100">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-primary-blue mb-2">
                    Need Administrative Support?
                  </h3>
                  <p className="text-gray-600">Get a customized quote for remote admin services</p>
                </div>
                
                <form className="space-y-6">
                  <div>
                    <input
                      type="text"
                      placeholder="Name"
                      className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-primary-blue focus:outline-none bg-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="tel"
                      placeholder="Phone Number (*Required)"
                      className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-primary-blue focus:outline-none bg-transparent text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <select className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-primary-blue focus:outline-none bg-transparent text-gray-900">
                      <option value="">Select County</option>
                      <option value="nairobi">Nairobi</option>
                      <option value="mombasa">Mombasa</option>
                      <option value="kisumu">Kisumu</option>
                      <option value="nakuru">Nakuru</option>
                      <option value="eldoret">Eldoret</option>
                    </select>
                  </div>
                  
                  <div>
                    <input
                      type="text"
                      placeholder="Business Name"
                      className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-primary-blue focus:outline-none bg-transparent text-gray-900 placeholder-gray-500"
                    />
                  </div>
                  
                  <div>
                    <input
                      type="email"
                      placeholder="Email (*Required)"
                      className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-primary-blue focus:outline-none bg-transparent text-gray-900 placeholder-gray-500"
                      required
                    />
                  </div>
                  
                  <div>
                    <textarea
                      placeholder="Message"
                      rows={4}
                      className="w-full px-0 py-3 border-0 border-b-2 border-gray-200 focus:border-primary-blue focus:outline-none bg-transparent text-gray-900 placeholder-gray-500 resize-none"
                    ></textarea>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary-blue focus:ring-primary-blue" />
                      <span className="text-sm text-gray-600">By clicking this box, you agree to receive SMS</span>
                    </label>
                    
                    <label className="flex items-start gap-3">
                      <input type="checkbox" className="mt-1 rounded border-gray-300 text-primary-blue focus:ring-primary-blue" />
                      <span className="text-sm text-gray-600">I agree to the <a href="#" className="text-primary-blue hover:underline">Privacy Policy</a></span>
                    </label>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-primary-blue to-secondary-green hover:brightness-110 text-white py-3 text-lg font-semibold">
                    Request A Quote
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-primary-blue to-secondary-green">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Streamline Your Operations?</h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Let our remote team handle your administrative tasks efficiently
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button className="bg-white text-primary-blue hover:bg-gray-100 px-8 py-3 text-lg font-semibold">
              <Phone className="mr-2 h-5 w-5" />
              Call Us Now
            </Button>
            <Button variant="outline" className="border-2 border-white text-white hover:bg-white hover:text-primary-blue px-8 py-3 text-lg font-semibold">
              <Mail className="mr-2 h-5 w-5" />
              Email Us
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RemoteAdmin;
