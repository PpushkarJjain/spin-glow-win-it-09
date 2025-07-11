import { useState, useEffect, useCallback } from "react";
import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useNavigate } from "react-router-dom";
import { SpinnerWheel, SpinnerSegment } from "@/components/SpinnerWheel";
import ResultPopup from "@/components/ResultPopup";
import { useToast } from "@/hooks/use-toast";
import { useSpinnerLogic } from "@/hooks/useSpinnerLogic";

const SpinnerPage = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [spinResult, setSpinResult] = useState<SpinnerSegment | null>(null);
  const [currentUser, setCurrentUser] = useState<any>(null);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  const { spinnerState, canUserSpin, recordSpin } = useSpinnerLogic();

  // User session validation
  useEffect(() => {
    try {
      const userData = localStorage.getItem("currentUser");
      if (!userData) {
        console.log("No user session found, redirecting to form");
        navigate("/");
        return;
      }
      
      const user = JSON.parse(userData);
      if (!user.name || !user.mobile) {
        console.warn("Invalid user data, redirecting to form");
        localStorage.removeItem("currentUser");
        navigate("/");
        return;
      }
      
      setCurrentUser(user);
      console.log("User session validated:", user.name);
    } catch (error) {
      console.error("Error validating user session:", error);
      navigate("/");
    }
  }, [navigate]);

  // Performance optimization: memoized handlers
  const handleAdminAccess = useCallback(() => {
    navigate("/admin");
  }, [navigate]);

  const handleSpinComplete = useCallback((result: SpinnerSegment) => {
    if (!currentUser) {
      console.error("No current user found during spin completion");
      return;
    }

    try {
      recordSpin(currentUser.mobile, result);
      setSpinResult(result);
      setIsSpinning(false);
      setShowResult(true);
      
      console.log(`Spin completed: ${result.label} for user ${currentUser.name}`);
    } catch (error) {
      console.error("Error handling spin completion:", error);
      toast({
        title: "Error",
        description: "There was an issue processing your spin. Please try again.",
        variant: "destructive",
      });
      setIsSpinning(false);
    }
  }, [currentUser, recordSpin, toast]);

  const handleSpinStart = useCallback(() => {
    if (!currentUser) {
      toast({
        title: "Session Error",
        description: "Please refresh the page and try again.",
        variant: "destructive",
      });
      return;
    }

    // Enhanced user eligibility check
    if (!canUserSpin(currentUser.mobile)) {
      toast({
        title: "Already Played Today",
        description: "You can only spin once per day! Come back tomorrow for another chance.",
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
  }, [currentUser, canUserSpin, isSpinning, toast]);

  const handleCloseResult = useCallback(() => {
    setShowResult(false);
    setSpinResult(null);
  }, []);

  // Show loading if no user session
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-festive flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
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
          canSpin={canUserSpin(currentUser.mobile)}
          onSpinStart={handleSpinStart}
        />
        
        {/* User eligibility check display */}
        {!isSpinning && !canUserSpin(currentUser.mobile) && (
          <div className="mt-4 text-center">
            <p className="text-white/90 text-lg font-medium">Already played today!</p>
            <p className="text-white/70 text-sm mt-1">Come back tomorrow for another chance</p>
          </div>
        )}

        {/* Spin Counter - Enhanced */}
        <div className="absolute bottom-4 right-4 bg-white/95 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-primary/20">
          <p className="text-xs font-medium text-secondary">Total Spins</p>
          <p className="text-xl font-bold text-primary">{spinnerState.totalSpins}</p>
          <p className="text-xs text-muted-foreground">Round {spinnerState.currentRound + 1}</p>
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