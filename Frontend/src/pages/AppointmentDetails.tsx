import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowLeft, Video, Calendar, X } from "lucide-react";
import { VideoCall } from "@/components/VideoCall";

const AppointmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isVideoCallOpen, setIsVideoCallOpen] = useState(false);

  const handleStartCall = () => {
    console.log("Start call clicked");
    setIsVideoCallOpen(true);
  };

  const handleReschedule = () => {
    // TODO: Implement reschedule functionality
    console.log("Reschedule clicked");
  };

  const handleCancel = () => {
    // TODO: Implement cancel functionality
    console.log("Cancel clicked");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/patient-dashboard/appointments")}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">
            Virtual Appointment
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Video Container */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="aspect-video bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center mb-6">
              <div className="text-center text-gray-500">
                <Video className="h-16 w-16 mx-auto mb-4 text-gray-400" />
                <p className="text-lg font-medium">Video Call Area</p>
                <p className="text-sm">Video will appear here when call starts</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Button
                onClick={handleStartCall}
                className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium"
                size="lg"
              >
                <Video className="h-5 w-5 mr-2" />
                Start Call
              </Button>
              
              <Button
                onClick={handleReschedule}
                variant="outline"
                className="border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-medium"
                size="lg"
              >
                <Calendar className="h-5 w-5 mr-2" />
                Reschedule
              </Button>
              
              <Button
                onClick={handleCancel}
                variant="outline"
                className="border-red-600 text-red-600 hover:bg-red-50 px-8 py-3 rounded-lg font-medium"
                size="lg"
              >
                <X className="h-5 w-5 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Appointment Info */}
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-4">Appointment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-600">Appointment ID:</span>
                <p className="text-gray-900">{id}</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Type:</span>
                <p className="text-gray-900">Virtual Consultation</p>
              </div>
              <div>
                <span className="font-medium text-gray-600">Status:</span>
                <p className="text-green-600 font-medium">Confirmed</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Video Call Modal */}
      {id && (
        <VideoCall
          isOpen={isVideoCallOpen}
          onClose={() => setIsVideoCallOpen(false)}
          appointmentId={id}
        />
      )}
    </div>
  );
};

export default AppointmentDetails;
