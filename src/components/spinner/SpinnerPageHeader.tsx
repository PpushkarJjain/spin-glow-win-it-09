import React from 'react';
import { Button } from '@/components/ui/button';
import { Volume2, VolumeX } from 'lucide-react';
import type { AudioManager } from '@/hooks/useAudioManager';

interface SpinnerPageHeaderProps {
  audioManager: AudioManager;
}

const SpinnerPageHeader: React.FC<SpinnerPageHeaderProps> = ({ audioManager }) => {
  return (
    <div className="relative flex justify-center items-center p-4">
      {/* Audio Toggle Button - positioned top right */}
      <Button
        onClick={audioManager.toggleMute}
        variant="outline"
        size="icon"
        className="absolute top-4 right-4 rounded-full w-12 h-12 bg-white/10 hover:bg-white/20 border-white/30 text-yellow-300 backdrop-blur-sm"
        aria-label={audioManager.isMuted ? "Unmute audio" : "Mute audio"}
      >
        {audioManager.isMuted ? (
          <VolumeX className="w-5 h-5" />
        ) : (
          <Volume2 className="w-5 h-5" />
        )}
      </Button>
      
      <div className="text-white text-center">
        <h1 className="text-5xl md:text-7xl font-playfair font-bold text-yellow-300 mb-2 drop-shadow-2xl">SPIN & WIN</h1>
        <p className="text-xl md:text-2xl text-yellow-200 font-poppins">GHOOMEGA WHEEL, MILEGA DEAL!</p>
      </div>
    </div>
  );
};

export default SpinnerPageHeader;
