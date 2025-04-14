
import { useState } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Users, Mic, Video, Clock, Search, Plus } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

// Mock data for rooms
const MOCK_ROOMS = [
  {
    id: '1',
    name: 'Music Production Talk',
    description: 'Discussing the latest DAWs and production techniques',
    participants: 12,
    speaker: 'Alex Thompson',
    category: 'Music',
    hasVideo: true,
    startedAt: new Date(Date.now() - 45 * 60000).toISOString(),
  },
  {
    id: '2',
    name: 'Web3 Development',
    description: 'Smart contracts and decentralized applications',
    participants: 8,
    speaker: 'Jay Wilson',
    category: 'Technology',
    hasVideo: false,
    startedAt: new Date(Date.now() - 20 * 60000).toISOString(),
  },
  {
    id: '3',
    name: 'Mindfulness Meditation',
    description: 'Guided session for beginners and intermediates',
    participants: 24,
    speaker: 'Emma Clarke',
    category: 'Wellness',
    hasVideo: true,
    startedAt: new Date(Date.now() - 10 * 60000).toISOString(),
  },
  {
    id: '4',
    name: 'Gaming Community Hangout',
    description: 'Casual chat about the latest releases and gaming news',
    participants: 18,
    speaker: 'Tyler Chen',
    category: 'Gaming',
    hasVideo: true,
    startedAt: new Date(Date.now() - 35 * 60000).toISOString(),
  },
  {
    id: '5',
    name: 'Startup Founder Q&A',
    description: 'Ask questions to experienced entrepreneurs',
    participants: 15,
    speaker: 'Sarah Johnson',
    category: 'Business',
    hasVideo: false,
    startedAt: new Date(Date.now() - 5 * 60000).toISOString(),
  },
  {
    id: '6',
    name: 'Book Club: Sci-Fi Edition',
    description: "This month's pick: Project Hail Mary by Andy Weir",
    participants: 9,
    speaker: 'David Park',
    category: 'Books',
    hasVideo: false,
    startedAt: new Date(Date.now() - 50 * 60000).toISOString(),
  },
];

// Format duration from ISO string
const formatDuration = (startTimeIso: string) => {
  const startTime = new Date(startTimeIso);
  const now = new Date();
  const diffMs = now.getTime() - startTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 60) {
    return `${diffMins}m`;
  } else {
    const hours = Math.floor(diffMins / 60);
    const mins = diffMins % 60;
    return `${hours}h ${mins}m`;
  }
};

// Room Card Component
const RoomCard = ({ room }) => {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md hover:border-primary/50 group">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg group-hover:text-primary transition-colors">{room.name}</CardTitle>
          <div className="flex items-center text-xs text-muted-foreground bg-secondary/50 rounded-full px-2 py-1">
            <Clock className="h-3 w-3 mr-1" />
            {formatDuration(room.startedAt)}
          </div>
        </div>
        <CardDescription>{room.description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{room.participants} listening</span>
          </div>
          <div className="flex items-center">
            {room.hasVideo ? (
              <Video className="h-4 w-4 text-primary mr-1" />
            ) : (
              <Mic className="h-4 w-4 text-primary mr-1" />
            )}
            <span>{room.hasVideo ? 'Video' : 'Audio only'}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild variant="outline" className="w-full transition-all duration-300 group-hover:bg-primary group-hover:text-white">
          <Link to={`/room/${room.id}`}>
            Join Room
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const RoomsPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const { toast } = useToast();
  
  const filteredRooms = MOCK_ROOMS.filter(room => 
    room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    room.category.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const handleCreateRoom = () => {
    toast({
      title: "Create Room",
      description: "This would open a create room modal in a full implementation.",
    });
  };
  
  return (
    <div className="min-h-screen pt-16 pb-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Live Rooms</h1>
            <p className="text-muted-foreground">Discover and join conversations</p>
          </div>
          
          <div className="flex w-full md:w-auto gap-2">
            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search rooms..."
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button onClick={handleCreateRoom} className="gap-1 shrink-0">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Room</span>
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredRooms.map(room => (
            <RoomCard key={room.id} room={room} />
          ))}
          
          {filteredRooms.length === 0 && (
            <div className="col-span-full text-center py-12">
              <p className="text-lg text-muted-foreground">No rooms found matching your search.</p>
              <Button 
                variant="link" 
                onClick={() => setSearchQuery('')}
                className="mt-2"
              >
                Clear search
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoomsPage;
