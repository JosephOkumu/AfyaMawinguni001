import { useState, useRef, useCallback, useEffect } from 'react';
import api from '@/services/api';

export const useWebRTC = (appointmentId: string) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callSession, setCallSession] = useState(null);
  const [isCallStarted, setIsCallStarted] = useState(false);
  const [connectionState, setConnectionState] = useState('new');
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isCallInitiator, setIsCallInitiator] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);
  
  const peerConnection = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);
  const pollingInterval = useRef<NodeJS.Timeout | null>(null);
  const iceCandidateQueue = useRef<any[]>([]);
  const processedSignals = useRef<Set<string>>(new Set());
  const callStartTime = useRef<Date | null>(null);

  // Send signaling data to server
  const sendSignal = async (signal: any) => {
    console.log("Sending signal:", signal);
    try {
      const response = await api.post(`/appointments/${appointmentId}/signal`, signal);
      console.log("Signal sent response:", response.data);
    } catch (error) {
      console.error('Error sending signal:', error);
    }
  };

  // Poll for signaling data and call session updates
  const pollSignals = useCallback(async () => {
    if (!appointmentId || !currentUserId) return;
    
    try {
      const response = await api.get(`/appointments/${appointmentId}/signals`);
      const signals = response.data.signals || [];
      
      // Check for session updates and update call session if status changed
      if (response.data.callSession && callSession) {
        if (response.data.callSession.status !== callSession.status) {
          console.log("Call session status updated:", response.data.callSession.status);
          setCallSession(response.data.callSession);
        }
      }
      
      // Filter out own signals and stale signals
      const relevantSignals = signals.filter(signal => {
        // Skip own signals
        if (signal.from === currentUserId) return false;
        
        // Skip stale signals from before current call session
        if (callStartTime.current && signal.timestamp) {
          const signalTime = new Date(signal.timestamp);
          if (signalTime < callStartTime.current) return false;
        }
        
        // Create unique ID for deduplication
        const signalId = `${signal.type}-${signal.from}-${signal.timestamp || Date.now()}`;
        if (processedSignals.current.has(signalId)) return false;
        
        processedSignals.current.add(signalId);
        return true;
      });

      for (const signal of relevantSignals) {
        await processSignal(signal);
      }
    } catch (error) {
      console.error('Error polling signals:', error);
    }
  }, [appointmentId, callSession, currentUserId]);

  // Process incoming signals
  const processSignal = async (signal: any) => {
    if (!peerConnection.current) return;
    
    try {
      if (signal.type === 'offer') {
        console.log("Processing offer:", signal);
        console.log("SDP length:", signal.sdp?.length);
        console.log("SDP ends with:", signal.sdp?.slice(-100));
        
        // Fix SDP by ensuring it ends with \r\n
        let fixedSdp = signal.sdp;
        if (fixedSdp && !fixedSdp.endsWith('\r\n')) {
          fixedSdp += '\r\n';
          console.log("Fixed SDP by adding \\r\\n terminator");
        }
        
        await peerConnection.current.setRemoteDescription({
          type: 'offer',
          sdp: fixedSdp
        });
        
        // Process queued ICE candidates now that remote description is set
        console.log(`Processing ${iceCandidateQueue.current.length} queued ICE candidates`);
        for (const queuedCandidate of iceCandidateQueue.current) {
          try {
            await peerConnection.current.addIceCandidate(queuedCandidate.candidate);
            console.log("Added queued ICE candidate");
          } catch (error) {
            console.error("Error adding queued ICE candidate:", error);
          }
        }
        iceCandidateQueue.current = [];
        
        const answer = await peerConnection.current.createAnswer();
        await peerConnection.current.setLocalDescription(answer);
        
        await sendSignal({
          type: 'answer',
          sdp: answer.sdp,
          from: currentUserId,
          to: signal.from
        });
      } else if (signal.type === 'answer') {
        console.log("Processing answer:", signal);
        console.log("SDP length:", signal.sdp?.length);
        
        // Fix SDP by ensuring it ends with \r\n
        let fixedSdp = signal.sdp;
        if (fixedSdp && !fixedSdp.endsWith('\r\n')) {
          fixedSdp += '\r\n';
          console.log("Fixed SDP by adding \\r\\n terminator");
        }
        
        // Only set remote description if we're in the right state
        if (peerConnection.current.signalingState === 'have-local-offer') {
          await peerConnection.current.setRemoteDescription({
            type: 'answer',
            sdp: fixedSdp
          });
          console.log("Remote description set successfully");
        } else {
          console.log("Ignoring answer - not in have-local-offer state, current state:", peerConnection.current.signalingState);
        }
      } else if (signal.type === 'ice-candidate') {
        console.log("Processing ICE candidate:", signal);
        
        if (peerConnection.current.remoteDescription) {
          try {
            await peerConnection.current.addIceCandidate(signal.candidate);
            console.log("ICE candidate added successfully");
          } catch (error) {
            console.error("Error adding ICE candidate:", error);
          }
        } else {
          console.log("Queueing ICE candidate - remote description not set yet");
          iceCandidateQueue.current.push(signal);
        }
      }
    } catch (error) {
      console.error("Error processing signal:", error);
    }
  };

  const startCall = async () => {
    console.log("Starting WebRTC call for appointment:", appointmentId);
    try {
      // Set call start time for signal filtering
      callStartTime.current = new Date();
      setIsCallInitiator(true);
      
      const response = await api.post(`/appointments/${appointmentId}/start-call`);
      console.log("Call started:", response.data);
      setCallSession(response.data.callSession);
      setIsCallStarted(true);
      
      await initializeWebRTC();
      startPolling();
    } catch (error) {
      // Handle 409 Conflict - call already exists, join it instead
      if (error.response?.status === 409 && error.response?.data?.callSession) {
        console.log("Call already exists, joining existing session:", error.response.data.callSession);
        setCallSession(error.response.data.callSession);
        setIsCallStarted(true);
        setIsCallInitiator(true); // Still the initiator even if joining existing session
        
        await initializeWebRTC();
        startPolling();
      } else {
        console.error('Error starting call:', error);
      }
    }
  };

  const joinCall = async () => {
    console.log("Joining WebRTC call for appointment:", appointmentId);
    try {
      // Set call start time for signal filtering
      callStartTime.current = new Date();
      
      const response = await api.post(`/appointments/${appointmentId}/join-call`);
      console.log("Call joined:", response.data);
      setCallSession(response.data.callSession);
      setIsCallStarted(true);
      
      await initializeWebRTC();
      startPolling();
    } catch (error) {
      console.error('Error joining call:', error);
    }
  };

  const initializeWebRTC = async () => {
    try {
      console.log("Requesting camera and microphone permissions...");
      
      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("getUserMedia is not supported in this browser");
      }

      // Try to get user media with fallback options
      let stream: MediaStream;
      try {
        // First try with both video and audio
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          },
          audio: {
            echoCancellation: true,
            noiseSuppression: true
          }
        });
        console.log("Got video and audio stream");
      } catch (videoError) {
        console.warn("Failed to get video, trying audio only:", videoError);
        try {
          // Fallback to audio only
          stream = await navigator.mediaDevices.getUserMedia({
            video: false,
            audio: true
          });
          console.log("Got audio-only stream");
        } catch (audioError) {
          console.error("Failed to get any media stream:", audioError);
          throw new Error("Camera and microphone access denied. Please allow permissions and try again.");
        }
      }
      
      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Create peer connection
      peerConnection.current = new RTCPeerConnection({
        iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
      });

      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        console.log(`Adding ${track.kind} track to peer connection`);
        peerConnection.current?.addTrack(track, stream);
      });

      // Handle connection state changes
      peerConnection.current.onconnectionstatechange = () => {
        setConnectionState(peerConnection.current?.connectionState || 'new');
        if (peerConnection.current?.connectionState === 'connected') {
          setIsConnected(true);
        } else {
          setIsConnected(false);
        }
      };

      // Handle remote stream
      peerConnection.current.ontrack = (event) => {
        console.log("Received remote stream");
        setRemoteStream(event.streams[0]);
      };

      // Handle ICE candidates
      peerConnection.current.onicecandidate = (event) => {
        if (event.candidate) {
          console.log("Sending ICE candidate");
          sendSignal({
            type: 'ice-candidate',
            candidate: event.candidate,
            from: currentUserId
          });
        }
      };

      console.log("WebRTC initialized successfully");

    } catch (error) {
      console.error('Error initializing WebRTC:', error);
      
      // Provide user-friendly error messages
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        alert('Camera and microphone access is required for video calls. Please allow permissions and refresh the page.');
      } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
        alert('No camera or microphone found. Please connect a camera/microphone and try again.');
      } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
        alert('Camera or microphone is already in use by another application. Please close other applications and try again.');
      } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
        alert('Camera settings not supported. Trying with default settings...');
        // Retry with basic constraints
        try {
          const basicStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: true
          });
          setLocalStream(basicStream);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = basicStream;
          }
        } catch (retryError) {
          console.error('Retry with basic constraints failed:', retryError);
        }
      } else {
        alert(`WebRTC initialization failed: ${error.message}`);
      }
      
      throw error;
    }
  };

  const createOffer = async () => {
    if (!peerConnection.current) {
      console.error("Peer connection not initialized");
      return;
    }

    // Check if peer connection is in a valid state
    if (peerConnection.current.connectionState === 'closed') {
      console.error("Peer connection is closed, cannot create offer");
      return;
    }

    try {
      console.log("Creating offer...");
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      
      console.log("Offer created and set as local description");
      await sendSignal({
        type: 'offer',
        sdp: offer.sdp,
        from: currentUserId
      });
    } catch (error) {
      console.error('Error creating offer:', error);
    }
  };

  const startPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
    }
    pollingInterval.current = setInterval(pollSignals, 2000);
  };

  const stopPolling = () => {
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }
  };

  const toggleMute = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
        console.log(`Microphone ${audioTrack.enabled ? 'unmuted' : 'muted'}`);
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOff(!videoTrack.enabled);
        console.log(`Video ${videoTrack.enabled ? 'enabled' : 'disabled'}`);
      }
    }
  };

  const endCall = () => {
    console.log("Ending call");
    
    // Close peer connection
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }

    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    // Reset states
    setRemoteStream(null);
    setIsConnected(false);
    setIsCallStarted(false);
    setCallSession(null);
    setConnectionState('new');
    setIsCallInitiator(false);
    setIsMuted(false);
    setIsVideoOff(false);

    // Clear processed signals and call start time
    processedSignals.current.clear();
    callStartTime.current = null;

    stopPolling();
  };

  // Get current user ID on mount
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get('/user');
        setCurrentUserId(response.data.id);
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };

    fetchCurrentUser();
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
      }
      if (peerConnection.current && peerConnection.current.connectionState !== 'closed') {
        peerConnection.current.close();
      }
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, [localStream]);

  return {
    localStream,
    remoteStream,
    isConnected,
    isCallActive,
    callSession,
    isCallStarted,
    connectionState,
    isCallInitiator,
    currentUserId,
    isMuted,
    isVideoOff,
    localVideoRef,
    remoteVideoRef,
    startCall,
    joinCall,
    endCall,
    createOffer,
    toggleMute,
    toggleVideo
  };
};
