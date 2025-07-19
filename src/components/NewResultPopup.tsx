
import { AnimatedPopup } from "@/components/ui/AnimatedPopup";
import { Button } from "@/components/ui/button";
import { SpinnerSegment } from "./SpinnerWheel";
import { Gift } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import type { AudioManager } from "@/hooks/useAudioManager";

interface NewResultPopupProps {
  isOpen: boolean;
  onClose: () => void;
  result: SpinnerSegment | null;
  audioManager: AudioManager;
}

const NewResultPopup = ({ isOpen, onClose, result, audioManager }: NewResultPopupProps) => {
  const navigate = useNavigate();

  // Play winning sound when popup opens
  useEffect(() => {
    if (isOpen && result) {
      // Small delay to let the popup animation start, then play the winning sound
      const timer = setTimeout(() => {
        audioManager.playWinSound();
      }, 300);

      return () => clearTimeout(timer);
    }
  }, [isOpen, result, audioManager]);

  const handleNextPlayer = () => {
    // Clear current user session for next player
    localStorage.removeItem("currentUser");
    
    // Close popup and redirect to form page
    onClose();
    navigate("/");
  };

  if (!result) return null;

  return (
    <AnimatedPopup isOpen={isOpen} onClose={onClose}>
      <div className="bg-festive-gradient border-4 border-primary text-white max-w-sm w-full p-6 rounded-2xl shadow-lg">
        <div className="text-center">
          <div className="flex justify-center items-center mb-4">
            <Gift className="h-16 w-16 text-yellow-300" />
          </div>
          <h2 className="text-3xl font-playfair flex justify-center items-center">
            Congratulations!
          </h2>
          <p className="text-white/80 text-base pt-2 flex justify-center items-center">
            You've won a fantastic prize!
          </p>
        </div>
        
        <div className="my-6 text-center">
          <div 
            className="text-4xl font-bold py-4 px-6 rounded-lg shadow-inner bg-white/20"
            style={{ 
              // backgroundColor: result.color,
              color: result.textColor,
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
            }}
          >
            {result.label}
          </div>
        </div>
        
        <div className="flex sm:flex-row sm:justify-center gap-4">
          <Button onClick={onClose} className="bg-white/20 border-none hover:bg-white/30">
            Close
          </Button>
          <Button
            onClick={handleNextPlayer}
            className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
          >
            🎉 Next Player 🎉
          </Button>
        </div>
      </div>
    </AnimatedPopup>
  );
};

export default NewResultPopup;
