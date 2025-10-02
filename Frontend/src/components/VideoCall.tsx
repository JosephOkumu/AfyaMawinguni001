import React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Video, VideoOff, Mic, MicOff, Phone } from 'lucide-react';
import { useWebRTC } from '@/hooks/useWebRTC';
import { VisuallyHidden } from '@radix-ui/react-visually-hidden';

interface VideoCallProps {
  isOpen: boolean;
  onClose: () => void;
  appointmentId: string;
}

export const VideoCall: React.FC<VideoCallProps> = ({ isOpen, onClose, appointmentId }) => {
  console.log("VideoCall component rendered with:", { isOpen, appointmentId });
  
  const {
    localStream,
    remoteStream,
    isConnected,
    isCallActive,
    callSession,
    isCallStarted,
    connectionState,
    currentUserId,
    isCallInitiator,
    localVideoRef,
    remoteVideoRef,
    startCall,
    joinCall,
    endCall
  } = useWebRTC(appointmentId.toString());

  const handleEndCall = () => {
    endCall();
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] p-0">
        <VisuallyHidden>
          <DialogTitle>Video Call - Appointment {appointmentId}</DialogTitle>
        </VisuallyHidden>
        <div className="flex flex-col h-full bg-gray-900">
          {/* Video Container */}
          <div className="flex-1 relative">
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Local Video */}
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="absolute bottom-4 right-4 w-48 h-36 object-cover rounded-lg border-2 border-white"
            />

            {/* Connection Status */}
            {isCallActive && (
              <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-3 py-1 rounded">
                {isConnected ? 'Connected' : 'Connecting...'}
              </div>
            )}
          </div>

          {/* Controls */}
          <div className="flex justify-center items-center gap-4 p-6 bg-gray-800">
            {!isCallActive ? (
              <div className="flex flex-col items-center gap-4">
                {/* Show call session status */}
                {callSession && (
                  <div className="text-white text-sm text-center">
                    <p>Call started by: {callSession.caller_name}</p>
                    <p className="text-gray-300">Status: {callSession.status === 'waiting_for_participant' ? 'Waiting for participant' : callSession.status === 'active' ? 'Call active' : callSession.status}</p>
                  </div>
                )}
                
                {/* Show appropriate button based on call session state */}
                {!callSession ? (
                  // No call session exists - show Start Call for first person, Join Call if call exists
                  <Button
                    onClick={() => {
                      console.log("Start Call button clicked in VideoCall component");
                      console.log("Current call session:", callSession);
                      console.log("Is call active:", isCallActive);
                      startCall();
                    }}
                    className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full"
                  >
                    <Video className="h-5 w-5 mr-2" />
                    Start Call
                  </Button>
                ) : isCallInitiator ? (
                  // Current user initiated the call - show End Call
                  <div className="flex gap-4">
                    <Button
                      onClick={handleEndCall}
                      className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full"
                    >
                      <Phone className="h-5 w-5 mr-2" />
                      End Call
                    </Button>
                  </div>
                ) : (
                  // Call session exists but user is not the initiator - show Join Call
                  <Button
                    onClick={() => {
                      console.log("Join Call button clicked in VideoCall component");
                      console.log("Current call session:", callSession);
                      console.log("Is call active:", isCallActive);
                      joinCall();
                    }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full"
                  >
                    <Video className="h-5 w-5 mr-2" />
                    Join Call
                  </Button>
                )}
              </div>
            ) : (
              <>
                <Button variant="ghost" className="text-white hover:bg-gray-700 rounded-full p-3">
                  <Mic className="h-5 w-5" />
                </Button>
                <Button variant="ghost" className="text-white hover:bg-gray-700 rounded-full p-3">
                  <Video className="h-5 w-5" />
                </Button>
                <Button
                  onClick={handleEndCall}
                  className="bg-red-600 hover:bg-red-700 text-white rounded-full p-3"
                >
                  <Phone className="h-5 w-5" />
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
