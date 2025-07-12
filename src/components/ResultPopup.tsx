
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { SpinnerSegment } from "./SpinnerWheel";
import { Gift, Sparkles } from "lucide-react";

interface ResultPopupProps {
  isOpen: boolean;
  onClose: () => void;
  result: SpinnerSegment | null;
}

const ResultPopup = ({ isOpen, onClose, result }: ResultPopupProps) => {
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    if (isOpen && result) {
      setShowConfetti(true);
      // Hide confetti after animation
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [isOpen, result]);

  if (!result) return null;

  return (
    <>
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-pulse"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}
      
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-md bg-gradient-festive border-4 border-primary">
          <DialogHeader>
            <DialogTitle className="text-center text-white font-playfair text-2xl">
              🎊 CONGRATULATIONS! 🎊
            </DialogTitle>
          </DialogHeader>
          
          <div className="text-center space-y-6 py-6">
            {/* Prize Display */}
            <div className="bg-white/90 rounded-xl p-6 shadow-festive">
              <div className="flex items-center justify-center mb-4">
                <Gift className="h-12 w-12 text-primary mr-3" />
                <Sparkles className="h-8 w-8 text-accent animate-pulse" />
              </div>
              
              <h3 className="text-2xl font-bold text-secondary mb-2">
                You Won!
              </h3>
              
              <div 
                className="text-3xl font-bold py-4 px-6 rounded-lg shadow-inner"
                style={{ 
                  backgroundColor: result.color,
                  color: result.textColor,
                  textShadow: "2px 2px 4px rgba(0,0,0,0.5)"
                }}
              >
                {result.label}
              </div>
              
              <p className="text-sm text-muted-foreground mt-4">
                Your reward has been logged and can be claimed at the store!
              </p>
            </div>
            
            {/* Close Button */}
            <Button
              onClick={onClose}
              className="w-full py-4 text-lg font-bold uppercase bg-gradient-primary hover:shadow-glow transition-all duration-300"
              size="lg"
            >
              ✨ Close ✨
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ResultPopup;
