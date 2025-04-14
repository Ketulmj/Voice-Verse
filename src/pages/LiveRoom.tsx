
import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Mic, MicOff, Video, VideoOff, Volume2, VolumeX, Phone, Settings, ChevronLeft, Users, MessageSquare, UserPlus, Shield } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Canvas } from "@react-three/fiber";
import { Stars } from "@react-three/drei";

// Mock data for the current room
const ROOM = {
  id: '1',
  name: 'Music Production Talk',
  description: 'Discussing the latest DAWs and production techniques',
  participants: [
    { id: '1', name: 'Alex Thompson', isSpeaking: true, hasVideo: true, isMuted: false, isHost: true },
    { id: '2', name: 'Jane Wilson', isSpeaking: false, hasVideo: true, isMuted: false, isHost: false },
    { id: '3', name: 'Michael Chen', isSpeaking: false, hasVideo: false, isMuted: true, isHost: false },
    { id: '4', name: 'Sarah Lee', isSpeaking: false, hasVideo: true, isMuted: true, isHost: false },
    { id: '5', name: 'David Kim', isSpeaking: false, hasVideo: false, isMuted: false, isHost: false },
    { id: '6', name: 'Emily Johnson', isSpeaking: false, hasVideo: true, isMuted: false, isHost: false },
  ]
};

// Mock voice commands verifier
const VOICE_COMMAND_CODE = "activate";

// Participant Video Component
const ParticipantVideo = ({ participant }) => {
  return (
    <div className="relative group">
      <div className={`aspect-video rounded-lg overflow-hidden ${participant.hasVideo ? 'bg-black' : 'bg-secondary'} ${participant.isSpeaking ? 'ring-2 ring-primary ring-offset-2 ring-offset-background' : ''}`}>
        {participant.hasVideo ? (
          <div className="w-full h-full bg-gradient-to-br from-purple-900/80 to-blue-900/80 flex items-center justify-center">
            {/* Placeholder for actual video */}
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-xl font-bold">
              {participant.name.charAt(0)}
            </div>
          </div>
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-gray-700 to-gray-900 flex items-center justify-center text-xl font-bold">
              {participant.name.charAt(0)}
            </div>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-2 left-2 flex items-center gap-1">
        {participant.isMuted && <MicOff className="h-3 w-3 text-red-500" />}
        {participant.isHost && <Shield className="h-3 w-3 text-primary" />}
        <span className="text-xs bg-black/70 px-1.5 py-0.5 rounded-md">
          {participant.name}
        </span>
      </div>
    </div>
  );
};

// 3D Background in Room
const RoomBackground = () => {
  return (
    <div className="fixed inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.1} />
        <Stars radius={100} depth={50} count={3000} factor={4} fade />
      </Canvas>
    </div>
  );
};

const LiveRoom = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State for user media controls
  const [isMuted, setIsMuted] = useState(true);
  const [isVideoOn, setIsVideoOn] = useState(false);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [volume, setVolume] = useState(80);
  const [isVoiceCommandActive, setIsVoiceCommandActive] = useState(false);
  const [voiceCommandText, setVoiceCommandText] = useState("");
  const [voiceCommandVerified, setVoiceCommandVerified] = useState(false);
  
  // References
  const recognitionRef = useRef(null);
  
  // Effect to initialize voice control
  useEffect(() => {
    // Check if SpeechRecognition is available
    if (!('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)) {
      toast({
        title: "Browser not supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }
    
    // Setup SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        title: "Browser not supported",
        description: "Your browser doesn't support voice recognition.",
        variant: "destructive"
      });
      return;
    }
    
    recognitionRef.current = new SpeechRecognition();
    const recognition = recognitionRef.current;
    
    recognition.continuous = true;
    recognition.interimResults = true;
    
    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map(result => result[0])
        .map(result => result.transcript)
        .join('');
      
      setVoiceCommandText(transcript.toLowerCase());
      
      // Check for voice command code first
      if (!voiceCommandVerified && transcript.toLowerCase().includes(VOICE_COMMAND_CODE)) {
        setVoiceCommandVerified(true);
        toast({
          title: "Voice Commands Activated",
          description: "You can now control the room with your voice.",
        });
      }
      
      // Process commands only after verification
      if (voiceCommandVerified) {
        if (transcript.toLowerCase().includes("mic on") || transcript.toLowerCase().includes("unmute")) {
          setIsMuted(false);
        } else if (transcript.toLowerCase().includes("mic off") || transcript.toLowerCase().includes("mute")) {
          setIsMuted(true);
        } else if (transcript.toLowerCase().includes("video on")) {
          setIsVideoOn(true);
        } else if (transcript.toLowerCase().includes("video off")) {
          setIsVideoOn(false);
        } else if (transcript.toLowerCase().includes("volume up")) {
          setVolume(prev => Math.min(prev + 10, 100));
        } else if (transcript.toLowerCase().includes("volume down")) {
          setVolume(prev => Math.max(prev - 10, 0));
        } else if (transcript.toLowerCase().includes("audio off") || transcript.toLowerCase().includes("speaker off")) {
          setIsAudioOn(false);
        } else if (transcript.toLowerCase().includes("audio on") || transcript.toLowerCase().includes("speaker on")) {
          setIsAudioOn(true);
        } else if (transcript.toLowerCase().includes("leave room") || transcript.toLowerCase().includes("exit room") || transcript.toLowerCase().includes("disconnect")) {
          handleLeaveRoom();
        }
      }
    };
    
    recognition.onerror = (event) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'not-allowed') {
        toast({
          title: "Microphone Access Denied",
          description: "Please allow microphone access to use voice commands.",
          variant: "destructive"
        });
      }
    };
    
    // Start listening when component mounts
    recognition.start();
    
    return () => {
      recognition.stop();
    };
  }, [voiceCommandVerified, toast]);
  
  const handleLeaveRoom = () => {
    toast({
      title: "Leaving Room",
      description: "You have left the room.",
    });
    navigate('/rooms');
  };
  
  const toggleVoiceCommand = () => {
    setIsVoiceCommandActive(prev => !prev);
    
    if (!isVoiceCommandActive) {
      toast({
        title: "Voice Command Mode",
        description: `Say "${VOICE_COMMAND_CODE}" to verify and activate voice controls.`,
      });
    } else {
      // If turning off, also reset verification
      setVoiceCommandVerified(false);
      setVoiceCommandText("");
    }
  };
  
  return (
    <div className="min-h-screen overflow-hidden relative">
      <RoomBackground />
      
      {/* Top navigation bar */}
      <header className="fixed top-0 left-0 right-0 bg-background/80 backdrop-blur-md border-b border-secondary z-40">
        <div className="container mx-auto px-4 py-2 flex items-center justify-between">
          <div className="flex items-center">
            <Button variant="ghost" size="icon" onClick={() => navigate('/rooms')} className="mr-2">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="font-bold text-lg">{ROOM.name}</h1>
              <div className="flex items-center text-xs text-muted-foreground">
                <Users className="h-3 w-3 mr-1" />
                <span>{ROOM.participants.length} participants</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={voiceCommandVerified ? "default" : "outline"} className="hidden sm:flex items-center gap-1">
              {voiceCommandVerified ? (
                <>
                  <Mic className="h-3 w-3" />
                  <span>Voice Control Active</span>
                </>
              ) : (
                <>
                  <MicOff className="h-3 w-3" />
                  <span>Voice Control Inactive</span>
                </>
              )}
            </Badge>
            
            <Button size="sm" variant="outline" onClick={() => toast({ title: "Invite", description: "Invite link copied to clipboard" })}>
              <UserPlus className="h-4 w-4 mr-1" />
              <span className="hidden sm:inline">Invite</span>
            </Button>
          </div>
        </div>
      </header>
      
      {/* Main content */}
      <main className="pt-16 pb-20 px-4 container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 py-4">
          {ROOM.participants.map(participant => (
            <ParticipantVideo key={participant.id} participant={participant} />
          ))}
        </div>
      </main>
      
      {/* Controls footer */}
      <footer className="fixed bottom-0 left-0 right-0 bg-background/80 backdrop-blur-md border-t border-secondary z-40">
        <div className="container mx-auto px-4 py-3">
          <div className="flex flex-wrap justify-center md:justify-between items-center gap-2">
            <div className="flex items-center gap-2">
              <Button 
                variant={isMuted ? "outline" : "default"} 
                size="icon" 
                onClick={() => setIsMuted(!isMuted)}
                className={isMuted ? "bg-secondary/50" : "bg-primary"}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              
              <Button 
                variant={isVideoOn ? "default" : "outline"} 
                size="icon" 
                onClick={() => setIsVideoOn(!isVideoOn)}
                className={isVideoOn ? "bg-primary" : "bg-secondary/50"}
              >
                {isVideoOn ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
              </Button>
              
              <Separator orientation="vertical" className="h-8 mx-1 hidden sm:block" />
              
              <div className="hidden sm:flex items-center gap-2">
                <Button 
                  variant={isAudioOn ? "ghost" : "outline"} 
                  size="icon"
                  onClick={() => setIsAudioOn(!isAudioOn)}
                >
                  {isAudioOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
                </Button>
                
                <div className="w-24">
                  <Slider 
                    value={[volume]} 
                    max={100} 
                    step={1}
                    onValueChange={(values) => setVolume(values[0])} 
                    disabled={!isAudioOn}
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button 
                variant={isVoiceCommandActive ? "default" : "outline"}
                onClick={toggleVoiceCommand}
                className={isVoiceCommandActive ? "bg-primary" : ""}
                size="sm"
              >
                <Mic className="h-4 w-4 mr-1" />
                Voice Controls
              </Button>
              
              <Button 
                variant="outline" 
                size="icon"
                onClick={() => toast({ title: "Settings", description: "Settings panel would open here" })}
              >
                <Settings className="h-5 w-5" />
              </Button>
              
              <Button 
                variant="destructive" 
                size="icon"
                onClick={handleLeaveRoom}
              >
                <Phone className="h-5 w-5 rotate-135" />
              </Button>
            </div>
          </div>
        </div>
        
        {/* Voice command feedback */}
        {isVoiceCommandActive && (
          <div className="container mx-auto px-4 pb-2">
            <Card className="border-primary/30 bg-secondary/30">
              <CardContent className="py-2 text-sm">
                <p className="text-center text-muted-foreground">
                  {voiceCommandVerified ? (
                    <>
                      <span className="font-semibold text-primary">Voice commands active. </span>
                      <span>Last heard: </span>
                      <span className="italic">{voiceCommandText || "Waiting for commands..."}</span>
                    </>
                  ) : (
                    <>Say "<span className="font-semibold text-primary">{VOICE_COMMAND_CODE}</span>" to activate voice controls</>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>
        )}
      </footer>
    </div>
  );
};

export default LiveRoom;
