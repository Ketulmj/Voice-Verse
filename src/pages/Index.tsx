
import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars, Float } from "@react-three/drei";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Mic, Video, Headphones } from "lucide-react";
import * as THREE from "three";

// Simple 3D model component
const Model = ({ scale = 1, position = [0, 0, 0], rotation = [0, 0, 0] }) => {
  // Placeholder mesh since we don't have an actual model URL
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.01;
    }
  });
  
  return (
    <mesh ref={meshRef} position={position as any} rotation={rotation as any} scale={scale}>
      <icosahedronGeometry args={[1, 1]} />
      <meshStandardMaterial color="#9b87f5" wireframe />
    </mesh>
  );
};

// Animated sphere
const AnimatedSphere = ({ position, size, color }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const speed = Math.random() * 0.05 + 0.02;
  
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += speed * delta;
      meshRef.current.rotation.y += speed * delta * 1.5;
    }
  });
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh ref={meshRef} position={position as any}>
        <sphereGeometry args={[size, 16, 16]} />
        <meshStandardMaterial 
          color={color} 
          roughness={0.1} 
          metalness={0.8}
          emissive={color}
          emissiveIntensity={0.4}
        />
      </mesh>
    </Float>
  );
};

// Main scene component
const Scene = () => {
  return (
    <>
      <ambientLight intensity={0.3} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <Stars radius={100} depth={50} count={5000} factor={4} fade speed={1} />
      
      {/* Main model */}
      <Model scale={1.5} position={[0, 0, -3]} />
      
      {/* Decorative elements */}
      <AnimatedSphere position={[-3, 2, -5]} size={0.5} color="#7E69AB" />
      <AnimatedSphere position={[3, -1, -6]} size={0.7} color="#9b87f5" />
      <AnimatedSphere position={[-2, -2, -4]} size={0.4} color="#D946EF" />
      <AnimatedSphere position={[4, 2, -7]} size={0.6} color="#8B5CF6" />
      <AnimatedSphere position={[1, 3, -5]} size={0.3} color="#F97316" />
    </>
  );
};

const ThreeDBackground = () => {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        gl={{ antialias: true }}
      >
        <OrbitControls enableZoom={false} enablePan={false} />
        <Scene />
      </Canvas>
    </div>
  );
};

// Three Card
const FeatureCard = ({ icon: Icon, title, description }) => {
  return (
    <div className="bg-secondary/40 backdrop-blur-lg rounded-lg p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:scale-105 hover:shadow-neon border border-primary/20">
      <div className="bg-primary/20 p-3 rounded-full mb-4">
        <Icon className="h-6 w-6 text-primary" />
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

const Index = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  
  useEffect(() => {
    // Simulate the 3D models loading
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);
  
  return (
    <div className="min-h-screen pt-16 flex flex-col overflow-hidden perspective-2000">
      <ThreeDBackground />
      
      <main className="flex-1 container mx-auto px-4 py-8 flex flex-col items-center justify-center relative z-10">
        <div className={`text-center max-w-3xl mx-auto transition-all duration-1000 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-blue-500">
            Voice Verse
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-muted-foreground">
            Connect in immersive 3D voice rooms with voice commands
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button asChild size="lg" className="rounded-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600">
              <Link to="/rooms">
                Explore Voice Rooms
              </Link>
            </Button>
          </div>
        </div>
        
        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl mx-auto transition-all duration-1000 delay-300 ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-10'}`}>
          <FeatureCard 
            icon={Mic}
            title="Voice Controls"
            description="Control your mic, video and audio with just your voice commands"
          />
          <FeatureCard 
            icon={Headphones}
            title="Immersive Audio"
            description="Experience spatial audio in 3D environments with friends"
          />
          <FeatureCard 
            icon={Video}
            title="Video Grid"
            description="See all participants in a customizable video grid layout"
          />
        </div>
        
        <div className={`mt-16 slide-in-from-outside ${isLoaded ? 'block' : 'opacity-0'}`}>
          <h2 className="text-2xl font-bold mb-4 text-center">Ready to dive into 3D voice?</h2>
          <div className="flex justify-center">
            <Button asChild variant="outline" className="rounded-full">
              <Link to="/rooms">
                Join a Room Now
              </Link>
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
