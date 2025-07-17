import { useState, useEffect, useRef, useCallback } from 'react';

export interface AudioConfig {
  backgroundMusic: string;
  spinSound: string;
  winSound: string;
}

export interface AudioManager {
  isMuted: boolean;
  isLoaded: boolean;
  toggleMute: () => void;
  playBackgroundMusic: () => void;
  stopBackgroundMusic: () => void;
  playSpinSound: () => void;
  playWinSound: () => void;
}

const audioConfig: AudioConfig = {
  backgroundMusic: '/audio/background-music.mp3',
  spinSound: '/audio/spin-sound.mp3',
  winSound: '/audio/win-sound.mp3'
};

export const useAudioManager = (): AudioManager => {
  const [isMuted, setIsMuted] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  const backgroundMusicRef = useRef<HTMLAudioElement | null>(null);
  const spinSoundRef = useRef<HTMLAudioElement | null>(null);
  const winSoundRef = useRef<HTMLAudioElement | null>(null);

  // Initialize and preload audio files
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Create audio elements
        backgroundMusicRef.current = new Audio(audioConfig.backgroundMusic);
        spinSoundRef.current = new Audio(audioConfig.spinSound);
        winSoundRef.current = new Audio(audioConfig.winSound);

        // Configure background music
        if (backgroundMusicRef.current) {
          backgroundMusicRef.current.loop = true;
          backgroundMusicRef.current.volume = 0.2;
        }

        // Configure sound effects
        if (spinSoundRef.current) {
          spinSoundRef.current.volume = 0.6;
        }

        if (winSoundRef.current) {
          winSoundRef.current.volume = 1.0;
        }

        // Preload all audio files
        const preloadPromises = [
          backgroundMusicRef.current?.load(),
          spinSoundRef.current?.load(),
          winSoundRef.current?.load()
        ].filter(Boolean);

        await Promise.all(preloadPromises);
        setIsLoaded(true);
      } catch (error) {
        console.warn('Audio initialization failed:', error);
        setIsLoaded(false);
      }
    };

    initAudio();

    // Cleanup
    return () => {
      backgroundMusicRef.current?.pause();
      backgroundMusicRef.current = null;
      spinSoundRef.current = null;
      winSoundRef.current = null;
    };
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted(prev => {
      const newMuted = !prev;
      
      // Apply mute state to all audio elements
      if (backgroundMusicRef.current) {
        backgroundMusicRef.current.muted = newMuted;
      }
      if (spinSoundRef.current) {
        spinSoundRef.current.muted = newMuted;
      }
      if (winSoundRef.current) {
        winSoundRef.current.muted = newMuted;
      }
      
      return newMuted;
    });
  }, []);

  const playBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current && isLoaded && !isMuted) {
      backgroundMusicRef.current.play().catch(error => {
        console.warn('Background music play failed:', error);
      });
    }
  }, [isLoaded, isMuted]);

  const stopBackgroundMusic = useCallback(() => {
    if (backgroundMusicRef.current) {
      backgroundMusicRef.current.pause();
      backgroundMusicRef.current.currentTime = 0;
    }
  }, []);

  const playSpinSound = useCallback(() => {
    if (spinSoundRef.current && isLoaded && !isMuted) {
      spinSoundRef.current.currentTime = 0;
      spinSoundRef.current.play().catch(error => {
        console.warn('Spin sound play failed:', error);
      });
    }
  }, [isLoaded, isMuted]);

  const playWinSound = useCallback(() => {
    if (winSoundRef.current && isLoaded && !isMuted) {
      winSoundRef.current.currentTime = 0;
      winSoundRef.current.play().catch(error => {
        console.warn('Win sound play failed:', error);
      });
    }
  }, [isLoaded, isMuted]);

  return {
    isMuted,
    isLoaded,
    toggleMute,
    playBackgroundMusic,
    stopBackgroundMusic,
    playSpinSound,
    playWinSound
  };
};