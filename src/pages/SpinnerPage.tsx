import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { SpinnerWheel } from "@/components/SpinnerWheel";
import type { SpinnerSegment } from "@/components/SpinnerWheel";
import ResultPopup from "@/components/ResultPopup";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUserSession, type UserSession } from '@/services/userService';
import { canUserSpin, recordSpin, selectRandomOffer } from '@/services/spinService';
import { getSystemState } from '@/services/systemService';
import LoadingSpinner from "@/components/spinner/LoadingSpinner";
import SpinnerPageHeader from "@/components/spinner/SpinnerPageHeader";
import SpinnerActions from "@/components/spinner/SpinnerActions";
import SpinCounter from "@/components/spinner/SpinCounter";
import { Coins, Gift, Percent, Star } from "lucide-react";

const SpinnerPage = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinnerSegment | null>(null);
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [totalSpins, setTotalSpins] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [canSpin, setCanSpin] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [hasSpun, setHasSpun] = useState(false);
  
  const navigate = useNavigate();
  const { toast } = useToast();

  // User session validation and data loading
  useEffect(() => {
    const initializePage = async () => {
      const user = getCurrentUserSession();
      if (!user) {
        console.log("No user session found, redirecting to form");
        navigate("/");
        return;
      }
      
      setCurrentUser(user);
      console.log("User session validated:", user.name);

      try {
        // Check if user can spin
        const userCanSpin = await canUserSpin(user.id);
        setCanSpin(userCanSpin);

        // Load system state
        const systemState = await getSystemState();
        setTotalSpins(parseInt(systemState.total_spins));
        setCurrentRound(parseInt(systemState.current_round));
      } catch (error) {
        console.error('Error loading page data:', error);
        toast({
          title: "Error",
          description: "Failed to load data. Please refresh the page.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    initializePage();
  }, [navigate, toast]);

  const handleAdminAccess = useCallback(() => {
    navigate("/admin");
  }, [navigate]);

  const handleSpinComplete = useCallback((result: SpinnerSegment) => {
    console.log(`Spin animation completed: ${result.label} for user ${currentUser?.name}`);
    // Animation is complete, now show the result popup
    setIsSpinning(false);
    setShowResult(true);
    setHasSpun(true);
  }, [currentUser]);

  const handleSpinStart = useCallback(async () => {
    if (!currentUser || !canSpin || hasSpun) {
      toast({
        title: "Cannot Spin",
        description: canSpin ? "Session error. Please refresh." : "You've already played today!",
        variant: "destructive",
      });
      return;
    }

    if (isSpinning) {
      return;
    }
    
    console.log(`Starting spin for user: ${currentUser.name}`);
    setIsSpinning(true);

    try {
      // Get the winning offer from database FIRST
      const selectedOffer = await selectRandomOffer();
      console.log('Selected offer from database:', selectedOffer);
      
      // Convert to UI format immediately
      const uiResult: SpinnerSegment = {
        id: selectedOffer.id,
        label: selectedOffer.label,
        color: selectedOffer.color,
        textColor: "#FFD700",
        probability: 0,
        icon: getIconForSegment(selectedOffer.id)
      };
      
      // Set the result for the wheel to animate towards
      setSpinResult(uiResult);
      
      // Record the spin in database
      await recordSpin(currentUser.id, selectedOffer);
      
      // Update local state
      setCanSpin(false);
      setTotalSpins(prev => prev + 1);
      
      // Note: No setTimeout here - animation will call handleSpinComplete when done
      
    } catch (error) {
      console.error('Error during spin:', error);
      setIsSpinning(false);
      toast({
        title: "Error",
        description: "Error processing spin. Please try again.",
        variant: "destructive",
      });
    }
  }, [currentUser, canSpin, hasSpun, isSpinning, toast]);

  // Helper function to get icon for segment
  const getIconForSegment = (segmentId: number) => {
    const iconMap: Record<number, React.ReactNode> = {
      1: <Percent className="w-4 h-4" />,
      2: <Percent className="w-4 h-4" />,
      3: <Coins className="w-4 h-4" />,
      4: <Coins className="w-4 h-4" />,
      5: <Percent className="w-4 h-4" />,
      6: <Percent className="w-4 h-4" />,
      7: <Gift className="w-4 h-4" />,
      8: <Star className="w-4 h-4" />
    };
    return iconMap[segmentId] || <Gift className="w-4 h-4" />;
  };

  const handleNextPlayer = useCallback(() => {
    localStorage.removeItem("currentUser");
    navigate("/");
  }, [navigate]);

  const handleCloseResult = useCallback(() => {
    setShowResult(false);
    setSpinResult(null);
  }, []);

  // Show loading if initializing
  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-festive-gradient font-poppins">
      <SpinnerPageHeader onAdminAccess={handleAdminAccess} />

      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        <SpinnerWheel 
          onSpinComplete={handleSpinComplete}
          isSpinning={isSpinning}
          canSpin={canSpin && !hasSpun}
          onSpinStart={handleSpinStart}
          preSelectedResult={spinResult}
        />
        
        <SpinnerActions
          hasSpun={hasSpun}
          showResult={showResult}
          canSpin={canSpin}
          isSpinning={isSpinning}
          onNextPlayer={handleNextPlayer}
        />

        <SpinCounter totalSpins={totalSpins} currentRound={currentRound} />
      </div>
      
      <ResultPopup 
        isOpen={showResult}
        onClose={handleCloseResult}
        result={spinResult}
      />
    </div>
  );
};

export default SpinnerPage;
