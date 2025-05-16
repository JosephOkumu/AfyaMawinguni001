
import React from "react";
import { Calendar, Clock, Activity, Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

const AppointmentsSection = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <Tabs defaultValue="upcoming">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-[var(--dark)]">My Appointments</h2>
          <TabsList>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="past">Past</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="upcoming" className="space-y-4">
          <div className="bg-blue-50 border border-primary-blue/20 rounded-lg p-4 flex items-start space-x-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-primary-blue flex items-center justify-center text-white">
              <Calendar className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-semibold text-[var(--primary-blue)]">General Check-up</h4>
                <span className="text-sm font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded-full">Confirmed</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> Tomorrow, April 14, 2025
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Clock className="h-4 w-4 mr-1" /> 10:00 AM - 11:00 AM
              </p>
              <div className="mt-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-green-100 mr-2 flex items-center justify-center text-white text-xs">
                  <img src="https://randomuser.me/api/portraits/men/36.jpg" alt="Doctor" className="rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium">Dr. James Wilson</p>
                  <p className="text-xs text-gray-500">General Practitioner</p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">Reschedule</Button>
              <Button variant="destructive" size="sm" className="text-xs">Cancel</Button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 flex items-start space-x-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Activity className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-semibold">Cardiology Consultation</h4>
                <span className="text-sm font-medium text-blue-600 bg-blue-100 px-2 py-0.5 rounded-full">Pending</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> April 18, 2025
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Clock className="h-4 w-4 mr-1" /> 2:30 PM - 3:30 PM
              </p>
              <div className="mt-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-blue-100 mr-2 flex items-center justify-center text-white text-xs">
                  <img src="https://randomuser.me/api/portraits/women/65.jpg" alt="Doctor" className="rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium">Dr. Lisa Chen</p>
                  <p className="text-xs text-gray-500">Cardiologist</p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0 flex space-x-2">
              <Button variant="outline" size="sm" className="text-xs">Reschedule</Button>
              <Button variant="destructive" size="sm" className="text-xs">Cancel</Button>
            </div>
          </div>
          
          <Button className="w-full bg-primary-blue hover:bg-primary-blue/90">
            <Plus className="h-4 w-4 mr-2" /> Book New Appointment
          </Button>
        </TabsContent>
        
        <TabsContent value="past" className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4 flex items-start space-x-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <FileText className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-semibold">Annual Physical</h4>
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">Completed</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> March 10, 2025
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Clock className="h-4 w-4 mr-1" /> 9:00 AM - 10:30 AM
              </p>
              <div className="mt-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-100 mr-2 flex items-center justify-center text-white text-xs">
                  <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="Doctor" className="rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium">Dr. Robert Brown</p>
                  <p className="text-xs text-gray-500">General Practitioner</p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button variant="outline" size="sm" className="text-xs">View Report</Button>
            </div>
          </div>
          
          <div className="border border-gray-200 rounded-lg p-4 flex items-start space-x-4">
            <div className="flex-shrink-0 w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
              <Activity className="h-6 w-6" />
            </div>
            <div className="flex-1">
              <div className="flex justify-between">
                <h4 className="font-semibold">Blood Test</h4>
                <span className="text-sm font-medium text-gray-600 bg-gray-100 px-2 py-0.5 rounded-full">Completed</span>
              </div>
              <p className="text-sm text-gray-600 mt-1 flex items-center">
                <Calendar className="h-4 w-4 mr-1" /> February 15, 2025
              </p>
              <p className="text-sm text-gray-600 flex items-center">
                <Clock className="h-4 w-4 mr-1" /> 11:00 AM - 11:30 AM
              </p>
              <div className="mt-3 flex items-center">
                <div className="h-8 w-8 rounded-full bg-gray-100 mr-2 flex items-center justify-center text-white text-xs">
                  <img src="https://randomuser.me/api/portraits/women/45.jpg" alt="Doctor" className="rounded-full" />
                </div>
                <div>
                  <p className="text-sm font-medium">Dr. Amanda Smith</p>
                  <p className="text-xs text-gray-500">Laboratory Technician</p>
                </div>
              </div>
            </div>
            <div className="flex-shrink-0">
              <Button variant="outline" size="sm" className="text-xs">View Results</Button>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsSection;
