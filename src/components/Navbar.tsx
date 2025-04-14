
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, Users, Mic } from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  
  // Don't show navbar in live room
  if (location.pathname.includes('/room/')) {
    return null;
  }
  
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-secondary">
      <div className="container mx-auto px-4 py-2 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <Mic className="h-6 w-6 text-primary" />
          <span className="font-bold text-xl text-white">VoiceVerse</span>
        </Link>
        
        <div className="flex space-x-1">
          <Button variant="ghost" asChild className="relative overflow-hidden group">
            <Link to="/">
              <Home className="h-5 w-5 mr-1" />
              <span>Home</span>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
          </Button>
          
          <Button variant="ghost" asChild className="relative overflow-hidden group">
            <Link to="/rooms">
              <Users className="h-5 w-5 mr-1" />
              <span>Rooms</span>
              <div className="absolute bottom-0 left-0 w-full h-0.5 bg-primary transform scale-x-0 group-hover:scale-x-100 transition-transform" />
            </Link>
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
