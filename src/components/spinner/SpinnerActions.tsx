import React from 'react';
import { Button } from '@/components/ui/button';

interface SpinnerActionsProps {
  hasSpun: boolean;
  showResult: boolean;
  canSpin: boolean;
  isSpinning: boolean;
  onNextPlayer: () => void;
}

const SpinnerActions: React.FC<SpinnerActionsProps> = ({
  hasSpun,
  showResult,
  canSpin,
  isSpinning,
  onNextPlayer,
}) => {
  if (hasSpun && !showResult) {
    return (
      <div className="mt-4 text-center">
          <div className="mb-2 text-center">
            <p className="text-white/90 text-lg font-medium">Already played!</p>
          </div>
        <Button
          onClick={onNextPlayer}
          className="px-8 py-4 text-lg font-bold uppercase bg-gradient-primary hover:shadow-glow transition-all duration-300"
          size="lg"
        >
          🎉 Next Player 🎉
        </Button>
      </div>
    );
  }
  
  // if (!isSpinning && !canSpin && !hasSpun) {
    //   return (
  //   );
  // }

  return null;
};

export default SpinnerActions;
