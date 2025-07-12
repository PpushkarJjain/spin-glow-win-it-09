
import { useState, useEffect, useCallback } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { SpinnerWheel } from "@/components/SpinnerWheel";
import type { SpinnerSegment } from "@/components/SpinnerWheel";
import ResultPopup from "@/components/ResultPopup";
import { useToast } from "@/hooks/use-toast";
import { getCurrentUserSession, type UserSession } from '@/services/userService';
import { canUserSpin, recordSpin, selectRandomOffer } from '@/services/spinService';
import { getSystemState } from '@/services/systemService';

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

  // Performance optimization: memoized handlers
  const handleAdminAccess = useCallback(() => {
    navigate("/admin");
  }, [navigate]);

  const handleSpinComplete = useCallback((result: SpinnerSegment) => {
    setSpinResult(result);
    setIsSpinning(false);
    setShowResult(true);
    setHasSpun(true);
    console.log(`Spin completed: ${result.label} for user ${currentUser?.name}`);
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

    // Performance check: prevent rapid clicking
    if (isSpinning) {
      return;
    }
    
    console.log(`Starting spin for user: ${currentUser.name}`);
    setIsSpinning(true);

    try {
      // Get random offer and record spin
      const result = await selectRandomOffer();
      await recordSpin(currentUser.id, result);
      
      // Update local state
      setCanSpin(false);
      setTotalSpins(prev => prev + 1);
      
      // Map service result to UI component format
      const uiResult: SpinnerSegment = {
        id: result.id,
        label: result.label,
        color: result.color,
        textColor: "#FFD700",
        probability: 0 // This will be determined by the wheel component
      };
      
      // Set result after a delay to allow wheel animation
      setTimeout(() => {
        setSpinResult(uiResult);
        setShowResult(true);
        setIsSpinning(false);
        setHasSpun(true);
      }, 3000);
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

  const handleNextPlayer = useCallback(() => {
    // Clear current user session for next player
    localStorage.removeItem("currentUser");
    
    // Navigate to form page for next player
    navigate("/");
  }, [navigate]);

  const handleCloseResult = useCallback(() => {
    setShowResult(false);
    setSpinResult(null);
  }, []);

  // Show loading if initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-festive flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-festive font-poppins">
      {/* Header with Hamburger Menu */}
      <div className="flex justify-between items-center p-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white hover:bg-white/20">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64">
            <div className="py-6">
              <h3 className="text-lg font-semibold mb-4">Menu</h3>
              <Button 
                onClick={handleAdminAccess}
                variant="outline" 
                className="w-full justify-start"
              >
                Admin Panel
              </Button>
            </div>
          </SheetContent>
        </Sheet>

        <div className="text-white text-center">
          <h1 className="text-2xl font-bold font-playfair">LUCKY DRAW</h1>
        </div>

        <div className="w-10"></div> {/* Spacer for center alignment */}
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col items-center justify-center min-h-[80vh] p-4">
        {/* Spinner Wheel */}
        <SpinnerWheel 
          onSpinComplete={handleSpinComplete}
          isSpinning={isSpinning}
          canSpin={canSpin && !hasSpun}
          onSpinStart={handleSpinStart}
        />
        
        {/* Post-spin Next Player Button */}
        {hasSpun && !showResult && (
          <div className="mt-8 text-center">
            <Button
              onClick={handleNextPlayer}
              className="px-8 py-4 text-lg font-bold uppercase bg-gradient-primary hover:shadow-glow transition-all duration-300"
              size="lg"
            >
              🎉 Next Player 🎉
            </Button>
            <p className="text-white/90 text-sm mt-2">Ready for the next participant!</p>
          </div>
        )}
        
        {/* User eligibility check display */}
        {!isSpinning && !canSpin && !hasSpun && (
          <div className="mt-4 text-center">
            <p className="text-white/90 text-lg font-medium">Already played today!</p>
            <p className="text-white/70 text-sm mt-1">Come back tomorrow for another chance</p>
          </div>
        )}

        {/* Spin Counter - Enhanced */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-primary/20">
          <p className="text-xs font-medium text-secondary">Total Spins</p>
          <p className="text-xl font-bold text-primary">{totalSpins}</p>
          <p className="text-xs text-muted-foreground">Round {currentRound + 1}</p>
        </div>
      </div>
      
      {/* Result Popup */}
      <ResultPopup 
        isOpen={showResult}
        onClose={handleCloseResult}
        result={spinResult}
      />
    </div>
  );
};

export default SpinnerPage;
