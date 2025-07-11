import { useState, useCallback, useEffect } from "react";
import { SpinnerSegment } from "@/components/SpinnerWheel";
import { useToast } from "@/hooks/use-toast";

interface SpinnerState {
  totalSpins: number;
  offerDistribution: number[];
  currentRound: number;
  spinsInCurrentRound: number;
}

export const useSpinnerLogic = () => {
  const [spinnerState, setSpinnerState] = useState<SpinnerState>({
    totalSpins: 0,
    offerDistribution: Array(8).fill(0),
    currentRound: 0,
    spinsInCurrentRound: 0,
  });
  const { toast } = useToast();

  // Load state from localStorage on initialization
  useEffect(() => {
    try {
      const totalSpins = parseInt(localStorage.getItem("totalSpins") || "0");
      const offerDistribution = JSON.parse(
        localStorage.getItem("offerDistribution") || JSON.stringify(Array(8).fill(0))
      );
      
      setSpinnerState({
        totalSpins,
        offerDistribution,
        currentRound: Math.floor(totalSpins / 100),
        spinsInCurrentRound: totalSpins % 100,
      });
    } catch (error) {
      console.error("Error loading spinner state:", error);
      resetSpinnerState();
    }
  }, []);

  // Reset spinner state
  const resetSpinnerState = useCallback(() => {
    const newState = {
      totalSpins: 0,
      offerDistribution: Array(8).fill(0),
      currentRound: 0,
      spinsInCurrentRound: 0,
    };
    
    setSpinnerState(newState);
    localStorage.setItem("totalSpins", "0");
    localStorage.setItem("offerDistribution", JSON.stringify(Array(8).fill(0)));
    
    toast({
      title: "Reset Complete",
      description: "All spinner data has been reset.",
    });
  }, [toast]);

  // Check if user can spin today
  const canUserSpin = useCallback((userMobile: string): boolean => {
    try {
      const lastSpin = localStorage.getItem(`lastSpin_${userMobile}`);
      const today = new Date().toDateString();
      return lastSpin !== today;
    } catch (error) {
      console.error("Error checking spin eligibility:", error);
      return true; // Allow spin if there's an error
    }
  }, []);

  // Record spin attempt
  const recordSpin = useCallback((userMobile: string, result: SpinnerSegment) => {
    try {
      const today = new Date().toDateString();
      const newTotalSpins = spinnerState.totalSpins + 1;
      const newOfferDistribution = [...spinnerState.offerDistribution];
      const segmentIndex = result.id - 1;
      
      newOfferDistribution[segmentIndex]++;

      // Auto-reset if completing a round
      if (newTotalSpins % 100 === 0) {
        console.log(`Round ${Math.floor(newTotalSpins / 100)} completed. Auto-resetting distribution.`);
        localStorage.setItem("offerDistribution", JSON.stringify(Array(8).fill(0)));
        setSpinnerState(prev => ({
          ...prev,
          totalSpins: newTotalSpins,
          offerDistribution: Array(8).fill(0),
          currentRound: Math.floor(newTotalSpins / 100),
          spinsInCurrentRound: 0,
        }));
      } else {
        localStorage.setItem("offerDistribution", JSON.stringify(newOfferDistribution));
        setSpinnerState(prev => ({
          ...prev,
          totalSpins: newTotalSpins,
          offerDistribution: newOfferDistribution,
          spinsInCurrentRound: newTotalSpins % 100,
        }));
      }

      localStorage.setItem("totalSpins", newTotalSpins.toString());
      localStorage.setItem(`lastSpin_${userMobile}`, today);

      // Log user win
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const userWins = JSON.parse(localStorage.getItem("userWins") || "[]");
      userWins.push({
        user: currentUser,
        result: result.label,
        timestamp: Date.now(),
        round: Math.floor(newTotalSpins / 100) + 1,
        spinNumber: newTotalSpins,
      });
      localStorage.setItem("userWins", JSON.stringify(userWins));

    } catch (error) {
      console.error("Error recording spin:", error);
      toast({
        title: "Recording Error",
        description: "There was an issue recording your spin. Please try again.",
        variant: "destructive",
      });
    }
  }, [spinnerState, toast]);

  return {
    spinnerState,
    resetSpinnerState,
    canUserSpin,
    recordSpin,
  };
};