import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";

interface SpinnerSegment {
  id: number;
  label: string;
  color: string;
  textColor: string;
  probability: number; // out of 100
}

interface SpinnerWheelProps {
  onSpinComplete: (result: SpinnerSegment) => void;
  isSpinning: boolean;
  canSpin: boolean;
  onSpinStart: () => void;
}

const segments: SpinnerSegment[] = [
  { id: 1, label: "10% OFF", color: "#FF2E63", textColor: "#FFD700", probability: 25 },
  { id: 2, label: "2% OFF", color: "#2ECC71", textColor: "#FFD700", probability: 20 },
  { id: 3, label: "0.50g silver coin", color: "#FF6B35", textColor: "#FFD700", probability: 15 },
  { id: 4, label: "1 Gold Coin", color: "#3498DB", textColor: "#FFD700", probability: 5 },
  { id: 5, label: "15% OFF", color: "#9B59B6", textColor: "#FFD700", probability: 15 },
  { id: 6, label: "5% OFF", color: "#E74C3C", textColor: "#FFD700", probability: 15 },
  { id: 7, label: "10% OFF Premium", color: "#2ECC71", textColor: "#FFD700", probability: 3 },
  { id: 8, label: "50% OFF", color: "#3498DB", textColor: "#FFD700", probability: 2 },
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
    }, 3000);
  };

  const segmentAngle = 360 / segments.length;

  return (
    <div className="relative w-full max-w-md mx-auto px-4">
      {/* Arrow Pointer */}
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 z-10">
        <div className="w-0 h-0 border-l-6 border-r-6 border-b-12 border-l-transparent border-r-transparent border-b-white shadow-lg drop-shadow-lg"></div>
      </div>
      
      {/* Spinner Wheel - Mobile Responsive */}
      <div className="relative w-72 h-72 sm:w-80 sm:h-80 mx-auto">
        <div
          ref={wheelRef}
          className="w-full h-full rounded-full border-8 border-white shadow-festive relative overflow-hidden transition-transform duration-3000 ease-out"
          style={{
            transform: `rotate(${rotation}deg)`,
            background: "conic-gradient(from 0deg, #FF2E63 0deg 45deg, #2ECC71 45deg 90deg, #FF6B35 90deg 135deg, #3498DB 135deg 180deg, #9B59B6 180deg 225deg, #E74C3C 225deg 270deg, #2ECC71 270deg 315deg, #3498DB 315deg 360deg)"
          }}
        >
          {/* Segments with text */}
          {segments.map((segment, index) => {
            const angle = index * segmentAngle;
            const textAngle = angle + segmentAngle / 2;
            
            return (
              <div
                key={segment.id}
                className="absolute inset-0 flex items-center justify-center"
                style={{
                  transform: `rotate(${textAngle}deg)`,
                  transformOrigin: "center"
                }}
              >
                <div
                  className="text-xs font-bold text-center px-2 py-1 rounded"
                  style={{
                    color: segment.textColor,
                    transform: `translateY(-120px) rotate(${-textAngle}deg)`,
                    textShadow: "1px 1px 2px rgba(0,0,0,0.8)",
                    fontSize: "10px",
                    lineHeight: "1.2",
                    maxWidth: "60px"
                  }}
                >
                  {segment.label}
                </div>
              </div>
            );
          })}
          
          {/* Center circle */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-primary rounded-full border-4 border-white shadow-lg flex items-center justify-center">
            <div className="w-4 h-4 bg-white rounded-full"></div>
          </div>
        </div>
      </div>
      
      {/* Spin Button */}
      <div className="flex flex-col items-center mt-8 space-y-3">
        <Button
          onClick={spin}
          disabled={isSpinning || !canSpin}
          className="px-16 py-8 text-2xl font-bold uppercase bg-gradient-primary hover:shadow-glow transition-all duration-300 disabled:opacity-50 shadow-festive"
          size="lg"
        >
          {isSpinning ? "SPINNING..." : "🎯 SPIN NOW 🎯"}
        </Button>
        {!canSpin && (
          <p className="text-white/80 text-sm">Already played today! Come back tomorrow</p>
        )}
        {canSpin && !isSpinning && (
          <p className="text-white/70 text-sm">Tap to spin and win exciting prizes!</p>
        )}
      </div>
    </div>
  );
};

export { SpinnerWheel, type SpinnerSegment };