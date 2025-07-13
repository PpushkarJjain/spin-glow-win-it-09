import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Coins, Gem, Trophy, Gift, Star, Sparkles, Crown, Diamond } from "lucide-react";

interface SpinnerSegment {
  id: number;
  label: string;
  color: string;
  textColor: string;
  probability: number; // out of 100
  icon?: React.ComponentType<any>;
}

interface SpinnerWheelProps {
  onSpinComplete: (result: SpinnerSegment) => void;
  isSpinning: boolean;
  canSpin: boolean;
  onSpinStart: () => void;
}

// Enhanced segments with premium colors and icons
const segments: SpinnerSegment[] = [
  { id: 1, label: "10% OFF", color: "hsl(342 92% 59%)", textColor: "hsl(45 100% 70%)", probability: 25, icon: Gift },
  { id: 2, label: "2% OFF", color: "hsl(145 63% 49%)", textColor: "hsl(45 100% 70%)", probability: 20, icon: Star },
  { id: 3, label: "0.50g Silver", color: "hsl(15 100% 60%)", textColor: "hsl(45 100% 70%)", probability: 15, icon: Coins },
  { id: 4, label: "1 Gold Coin", color: "hsl(210 100% 56%)", textColor: "hsl(45 100% 70%)", probability: 5, icon: Crown },
  { id: 5, label: "15% OFF", color: "hsl(270 60% 55%)", textColor: "hsl(45 100% 70%)", probability: 15, icon: Sparkles },
  { id: 6, label: "5% OFF", color: "hsl(0 84% 60%)", textColor: "hsl(45 100% 70%)", probability: 15, icon: Gem },
  { id: 7, label: "Premium 10%", color: "hsl(145 63% 49%)", textColor: "hsl(45 100% 70%)", probability: 3, icon: Trophy },
  { id: 8, label: "50% OFF", color: "hsl(210 100% 56%)", textColor: "hsl(45 100% 70%)", probability: 2, icon: Diamond },
];

const SpinnerWheel = ({ onSpinComplete, isSpinning, canSpin, onSpinStart }: SpinnerWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  const getWeightedRandomSegment = () => {
    // Get current offer distribution from localStorage
    const offerDistribution = JSON.parse(localStorage.getItem("offerDistribution") || JSON.stringify(Array(8).fill(0)));
    const totalSpins = parseInt(localStorage.getItem("totalSpins") || "0");
    const currentRound = Math.floor(totalSpins / 100);
    const spinsInCurrentRound = totalSpins % 100;
    
    // Auto-reset when reaching 100 spins
    if (spinsInCurrentRound === 0 && totalSpins > 0) {
      localStorage.setItem("offerDistribution", JSON.stringify(Array(8).fill(0)));
      const resetDistribution = Array(8).fill(0);
      
      // Use fresh distribution for selection
      const availableSegments = segments.filter((segment, index) => {
        return resetDistribution[index] < segment.probability;
      });
      
      if (availableSegments.length > 0) {
        const totalWeight = availableSegments.reduce((sum, segment) => sum + segment.probability, 0);
        let random = Math.random() * totalWeight;
        
        for (const segment of availableSegments) {
          random -= segment.probability;
          if (random <= 0) {
            return segment;
          }
        }
      }
    }
    
    // Filter available segments (not at max limit)
    const availableSegments = segments.filter((segment, index) => {
      return offerDistribution[index] < segment.probability;
    });
    
    // If no segments available, intelligently distribute remaining slots
    if (availableSegments.length === 0) {
      const underutilizedSegments = segments.filter((segment, index) => {
        return offerDistribution[index] < Math.floor(segment.probability * 0.8);
      });
      
      if (underutilizedSegments.length > 0) {
        return underutilizedSegments[Math.floor(Math.random() * underutilizedSegments.length)];
      }
      
      // Fallback to any segment with available slots
      return segments[Math.floor(Math.random() * segments.length)];
    }
    
    // Enhanced weighted random selection
    const totalWeight = availableSegments.reduce((sum, segment) => sum + segment.probability, 0);
    let random = Math.random() * totalWeight;
    
    for (const segment of availableSegments) {
      random -= segment.probability;
      if (random <= 0) {
        return segment;
      }
    }
    
    return availableSegments[0]; // Fallback
  };

  const spin = () => {
    // First check eligibility and call onSpinStart
    onSpinStart();
    
    if (isSpinning || !canSpin) return;

    const winningSegment = getWeightedRandomSegment();
    const segmentAngle = 360 / segments.length;
    const winningIndex = segments.findIndex(s => s.id === winningSegment.id);
    
    // Calculate the angle to land on the winning segment
    // We want the segment to be at the top (where the arrow points)
    const targetAngle = (winningIndex * segmentAngle) + (segmentAngle / 2);
    const spins = 5 + Math.random() * 5; // 5-10 full rotations
    const finalRotation = (spins * 360) - targetAngle;
    
    setRotation(prev => prev + finalRotation);
    
    // Complete the spin after animation
    setTimeout(() => {
      onSpinComplete(winningSegment);
    }, 4000);
  };

  const segmentAngle = 360 / segments.length;

  // Generate dynamic conic gradient from segments
  const generateConicGradient = () => {
    const gradientStops = segments.map((segment, index) => {
      const startAngle = index * segmentAngle;
      const endAngle = (index + 1) * segmentAngle;
      return `${segment.color} ${startAngle}deg ${endAngle}deg`;
    }).join(', ');
    
    return `conic-gradient(from 0deg, ${gradientStops})`;
  };

  return (
    <div className="relative w-full max-w-md mx-auto px-4">
      {/* Premium Golden Arrow Pointer */}
      <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 z-20">
        <div className="relative">
          {/* Golden Arrow with Multiple Layers */}
          <div className="absolute inset-0 w-0 h-0 border-l-8 border-r-8 border-b-16 border-l-transparent border-r-transparent border-b-primary transform scale-110 opacity-60"></div>
          <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-primary shadow-golden"></div>
          {/* Arrow glow effect */}
          <div className="absolute -top-2 -left-2 w-0 h-0 border-l-10 border-r-10 border-b-18 border-l-transparent border-r-transparent border-b-primary/30 animate-glow-pulse"></div>
        </div>
      </div>
      
      {/* Premium Spinner Wheel */}
      <div className="relative w-80 h-80 sm:w-96 sm:h-96 mx-auto">
        {/* LED Ring Animation */}
        <div className="absolute inset-0 rounded-full animate-glow-pulse opacity-75">
          <div className="w-full h-full rounded-full border-4 border-primary animate-rotate-golden"></div>
        </div>
        
        {/* Metallic Rim - Multiple Layers */}
        <div className="absolute inset-2 rounded-full border-8 border-primary shadow-metallic"></div>
        <div className="absolute inset-4 rounded-full border-4 border-primary shadow-golden"></div>
        
        {/* Main Spinner Wheel */}
        <div
          ref={wheelRef}
          className="absolute inset-6 w-full h-full rounded-full relative overflow-hidden transition-transform duration-[4000ms] ease-[cubic-bezier(0.23,1,0.320,1)]"
          style={{
            transform: `rotate(${rotation}deg)`,
            background: generateConicGradient(),
            boxShadow: 'inset 0 0 50px rgba(0,0,0,0.3), 0 0 30px rgba(255,215,0,0.4)'
          }}
        >
          {/* Segments with Icons and Enhanced Text */}
          {segments.map((segment, index) => {
            const angle = index * segmentAngle;
            const textAngle = angle + segmentAngle / 2;
            const IconComponent = segment.icon;
            
            return (
              <div
                key={segment.id}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `rotate(${textAngle}deg)`,
                  transformOrigin: "center"
                }}
              >
                {/* Icon */}
                <div
                  className="absolute flex items-center justify-center"
                  style={{
                    transform: `translateY(-100px) rotate(${-textAngle}deg)`,
                  }}
                >
                  {IconComponent && (
                    <IconComponent 
                      size={16} 
                      className="text-yellow-300 drop-shadow-md filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]" 
                    />
                  )}
                </div>
                
                {/* Enhanced Text with Embossed Effect */}
                <div
                  className="font-bold text-center px-1 py-0.5 font-poppins"
                  style={{
                    color: segment.textColor,
                    transform: `translateY(-80px) rotate(${-textAngle}deg)`,
                    textShadow: `
                      0 1px 0 rgba(255,255,255,0.4),
                      0 2px 0 rgba(0,0,0,0.8),
                      0 3px 5px rgba(0,0,0,0.6),
                      0 0 10px rgba(255,215,0,0.3)
                    `,
                    fontSize: "9px",
                    lineHeight: "1.1",
                    maxWidth: "50px",
                    fontWeight: "800",
                    letterSpacing: "0.5px"
                  }}
                >
                  {segment.label}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Premium Center Hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-20 h-20 z-10">
          {/* Outer golden ring */}
          <div className="w-full h-full rounded-full border-4 border-primary shadow-golden animate-glow-pulse"></div>
          {/* Inner hub */}
          <div className="absolute inset-2 rounded-full bg-gradient-metallic shadow-metallic border-2 border-yellow-400"></div>
          {/* Center gem */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-primary rounded-full shadow-golden animate-glow-pulse"></div>
        </div>
      </div>
      
      {/* Premium Spin Button */}
      <div className="flex flex-col items-center mt-12 space-y-4">
        <Button
          onClick={spin}
          disabled={isSpinning || !canSpin}
          className="relative px-20 py-10 text-3xl font-bold uppercase font-playfair bg-gradient-golden hover:bg-gradient-metallic transition-all duration-300 disabled:opacity-50 rounded-full border-4 border-yellow-600 shadow-golden hover:shadow-glow-pulse transform hover:scale-105 disabled:transform-none"
          size="lg"
        >
          <span className="relative z-10 text-yellow-900 drop-shadow-md">
            {isSpinning ? "SPINNING..." : "SPIN NOW"}
          </span>
          {/* Button glow effect */}
          <div className="absolute inset-0 rounded-full bg-gradient-golden opacity-50 animate-glow-pulse"></div>
        </Button>
        
        {/* Subtext */}
        <p className="text-yellow-200 text-sm font-poppins italic">
          One spin per day per user
        </p>
        
        {!canSpin && (
          <p className="text-yellow-300/80 text-sm font-poppins">Already played today! Come back tomorrow</p>
        )}
        {canSpin && !isSpinning && (
          <p className="text-yellow-200/70 text-sm font-poppins">Tap to spin and win exciting prizes!</p>
        )}
      </div>
    </div>
  );
};

export { SpinnerWheel, type SpinnerSegment };