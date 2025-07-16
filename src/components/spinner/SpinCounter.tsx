import React from 'react';

interface SpinCounterProps {
  totalSpins: number;
  currentRound: number;
}

const SpinCounter: React.FC<SpinCounterProps> = ({ totalSpins, currentRound }) => {
  return (
    <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-primary/20 flex flex-col items-center justify-center text-brand-yellow">
      <p className="text-xs font-medium">Total Spins</p>
      <p className="text-xl font-bold">{totalSpins}</p>
      <p className="text-xs">Round {currentRound + 1}</p>
    </div>
  );
};

export default SpinCounter;
