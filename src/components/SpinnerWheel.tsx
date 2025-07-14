
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Coins, Gift, Percent, Star } from "lucide-react";

interface SpinnerSegment {
  id: number;
  label: string;
  color: string;
  textColor: string;
  probability: number;
  icon: React.ReactNode;
}

interface SpinnerWheelProps {
  onSpinComplete: (result: SpinnerSegment) => void;
  isSpinning: boolean;
  canSpin: boolean;
  onSpinStart: () => void;
  preSelectedResult?: SpinnerSegment | null;
}

const segments: SpinnerSegment[] = [
    { id: 1, label: "10%\nOFF", color: "rgb(220, 38, 38)", textColor: "#FFD700", probability: 25, icon: <Percent className="w-4 h-4" /> },
    { id: 2, label: "2%\nOFF", color: "rgb(5, 150, 105)", textColor: "#FFD700", probability: 20, icon: <Percent className="w-4 h-4" /> },
    { id: 3, label: "0.50g\nsilver\ncoin", color: "rgb(234, 88, 12)", textColor: "#FFD700", probability: 15, icon: <Coins className="w-4 h-4" /> },
    { id: 4, label: "1G\nsilver\ncoin", color: "rgb(30, 64, 175)", textColor: "#FFD700", probability: 5, icon: <Coins className="w-4 h-4" /> },
    { id: 5, label: "15%\nOFF", color: "rgb(124, 58, 237)", textColor: "#FFD700", probability: 15, icon: <Percent className="w-4 h-4" /> },
    { id: 6, label: "5%\nOFF", color: "rgb(220, 38, 38)", textColor: "#FFD700", probability: 15, icon: <Percent className="w-4 h-4" /> },
    { id: 7, label: "10%\nOFF", color: "rgb(5, 150, 105)", textColor: "#FFD700", probability: 3, icon: <Gift className="w-4 h-4" /> },
    { id: 8, label: "50%\nOFF", color: "rgb(30, 64, 175)", textColor: "#FFD700", probability: 2, icon: <Star className="w-4 h-4" /> },
];

const SpinnerWheel = ({ onSpinComplete, isSpinning, canSpin, onSpinStart, preSelectedResult }: SpinnerWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  // Auto-trigger animation when preSelectedResult becomes available during spinning
  useEffect(() => {
    if (isSpinning && preSelectedResult) {
      console.log('Starting animation for pre-selected result:', preSelectedResult);
      
      const segmentAngle = 360 / segments.length; // 45 degrees per segment
      const winningIndex = segments.findIndex(s => s.id === preSelectedResult.id);
      
      if (winningIndex === -1) {
        console.error('Could not find segment for pre-selected result:', preSelectedResult);
        return;
      }
      
      // Calculate target angle - arrow points up (0°), segments start at top and go clockwise
      // We want the winning segment's center to align with the arrow at the top
      const segmentCenterAngle = winningIndex * segmentAngle + (segmentAngle / 2);
      
      // Add multiple full rotations for visual effect (5-8 spins)
      const extraSpins = 5 + Math.random() * 3;
      const totalRotation = (extraSpins * 360) + segmentCenterAngle;
      
      setRotation(prev => prev + totalRotation);
      
      // After animation, calculate which segment actually ended up at the pointer
      setTimeout(() => {
        // Get final rotation angle (mod 360 to normalize)
        const finalAngle = totalRotation % 360;
        
        // Calculate which segment is at the top pointer (0°)
        // Since segments go clockwise and we need to account for rotation direction
        const actualSegmentIndex = Math.floor((360 - finalAngle + (segmentAngle / 2)) / segmentAngle) % segments.length;
        const actualWinningSegment = segments[actualSegmentIndex];
        
        console.log('Final angle:', finalAngle, 'Actual segment index:', actualSegmentIndex, 'Actual winning segment:', actualWinningSegment);
        
        // Use the actual visually aligned segment for the result
        onSpinComplete(actualWinningSegment);
      }, 3000);
    }
  }, [isSpinning, preSelectedResult, onSpinComplete]);

  const handleSpinClick = () => {
    if (isSpinning || !canSpin) return;
    console.log('Spin button clicked, starting spin process');
    onSpinStart();
  };

  const segmentAngle = 360 / segments.length;
  const conicGradient = segments.map((segment, index) => `${segment.color} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`).join(", ");

  return (
    <div className="relative w-full max-w-md mx-auto px-4 flex justify-center items-center flex-col">
      {/* Arrow pointer */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 translate-y-[8px] z-20">
        <div className="w-0 h-0 border-l-[15px] border-r-[15px] border-t-[25px] border-l-transparent border-r-transparent border-t-yellow-400 filter drop-shadow-lg"></div>
        <div className="absolute top-[-2px] left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-[12px] border-r-[12px] border-t-[20px] border-l-transparent border-r-transparent border-t-yellow-500"></div>
      </div>
      
      {/* Spinner wheel */}
      <div 
        ref={wheelRef}
        className="relative w-80 h-80 rounded-full border-8 border-yellow-400 shadow-2xl transition-transform duration-3000 ease-out"
        style={{ background: `conic-gradient(from 0deg, ${conicGradient})`, transform: `rotate(${rotation}deg)` }}
      >
        {/* LED lights around the rim */}
        <div className="absolute inset-0 rounded-full">
          {Array.from({ length: 32 }).map((_, i) => (
            <div 
              key={i} 
              className="absolute w-3 h-3 bg-yellow-300 rounded-full animate-pulse-glow" 
              style={{ top: '50%', left: '50%', transform: `translate(-50%, -50%) rotate(${i * 11.25}deg) translateY(-150px)` }}
            />
          ))}
        </div>

        {/* Segments with text and icons */}
        {segments.map((segment, index) => {
          const angle = index * segmentAngle + segmentAngle / 2;
          return (
            <div
              key={segment.id}
              className="absolute w-full h-full"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 text-center w-1/2">
                <div className="flex flex-col items-center space-y-1" style={{ transform: `translateY(20px)` }}>
                  <div className="text-yellow-400 font-bold text-sm whitespace-pre-line">{segment.label}</div>
                  <div className="text-yellow-300">{segment.icon}</div>
                </div>
              </div>
            </div>
          );
        })}

        {/* Central hub */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 bg-gradient-to-br from-yellow-300 to-yellow-600 rounded-full border-4 border-yellow-200 shadow-lg flex items-center justify-center">
          <Star className="w-6 h-6 text-yellow-800" />
        </div>
      </div>
      
      {/* Spin button and status */}
      <div className="flex flex-col items-center mt-8 space-y-3">
        <Button
          onClick={handleSpinClick}
          disabled={isSpinning || !canSpin}
          className="px-16 py-8 text-2xl font-bold uppercase bg-gradient-primary hover:shadow-glow transition-all duration-300 disabled:opacity-50 shadow-festive"
          size="lg"
        >
          {isSpinning ? "SPINNING..." : "🎯 SPIN NOW 🎯"}
        </Button>
        {!canSpin && <p className="text-white/80 text-sm">Already played today! Come back tomorrow</p>}
        {canSpin && !isSpinning && <p className="text-white/70 text-sm">Tap to spin and win exciting prizes!</p>}
      </div>
    </div>
  );
};

export { SpinnerWheel, type SpinnerSegment };
