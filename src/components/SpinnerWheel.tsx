
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { wheelVariants } from "@/lib/variants";
import { AnimatedButton } from "@/components/ui/AnimatedButton";
import { Star } from "lucide-react";
import { offerConfig } from "@/config/offerConfig.tsx";
import type { Offer } from "@/config/offerConfig.tsx";

interface SpinnerSegment extends Offer {
  textColor: string;
  probability: number;
}

interface SpinnerWheelProps {
  onSpinComplete: (result: SpinnerSegment) => void;
  isSpinning: boolean;
  canSpin: boolean;
  onSpinStart: () => void;
  preSelectedResult?: SpinnerSegment | null;
}

const segments: SpinnerSegment[] = offerConfig.map(offer => ({
  ...offer,
  label: offer.label.replace(/ /g, '\n'), // Add newlines for display
  textColor: "#FFD700",
  probability: offer.maxPerRound,
}));

const SpinnerWheel = ({ onSpinComplete, isSpinning, canSpin, onSpinStart, preSelectedResult }: SpinnerWheelProps) => {
  const [rotation, setRotation] = useState(0);
  const wheelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSpinning && preSelectedResult) {
      const segmentAngle = 360 / segments.length;
      const winningIndex = segments.findIndex(s => s.id === preSelectedResult.id);
      
      if (winningIndex === -1) return;

      const targetAngle = (winningIndex * segmentAngle) + (segmentAngle / 2);
      const finalRotation = (360 * 5) + (360 - targetAngle);
      
      setRotation(finalRotation);
      
      setTimeout(() => {
        onSpinComplete(preSelectedResult);
      }, 3000);
    }
  }, [isSpinning, preSelectedResult, onSpinComplete]);

  const handleSpinClick = () => {
    if (isSpinning || !canSpin) return;
    onSpinStart();
  };

  const segmentAngle = 360 / segments.length;
  const conicGradient = segments.map((segment, index) => `${segment.color} ${index * segmentAngle}deg ${(index + 1) * segmentAngle}deg`).join(", ");

  return (
    <div className="relative w-full max-w-md mx-auto px-4 flex justify-center items-center flex-col">
      {/* Arrow pointer */}
      <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-30">
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
        <AnimatedButton
          onClick={handleSpinClick}
          disabled={isSpinning || !canSpin}
          className="px-16 py-8 text-2xl font-bold uppercase bg-gradient-primary hover:shadow-glow transition-all duration-300 disabled:opacity-50 shadow-festive"
          size="lg"
          isSpinButton
        >
          {isSpinning ? "SPINNING..." : "🎯 SPIN NOW 🎯"}
        </AnimatedButton>
        
      </div>
    </div>
  );
};

export { SpinnerWheel, type SpinnerSegment };
