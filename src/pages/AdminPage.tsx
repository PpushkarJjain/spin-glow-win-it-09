
import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { getSystemState } from '@/services/systemService';
import { getOfferStats, resetAllCounters, getTotalUsers } from '@/services/adminService';
import AdminPasswordModal from '@/components/AdminPasswordModal';

interface OfferStats {
  name: string;
  current: number;
  max: number;
}

const AdminPage = () => {
  const [totalSpins, setTotalSpins] = useState(0);
  const [spinsInCurrentRound, setSpinsInCurrentRound] = useState(0);
  const [currentRound, setCurrentRound] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [offerStats, setOfferStats] = useState<OfferStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isResetting, setIsResetting] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuthentication();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      loadAdminData();
    }
  }, [isAuthenticated]);

  const checkAuthentication = () => {
    const authExpiry = sessionStorage.getItem('admin_auth_expiry');
    
    if (authExpiry && Date.now() < parseInt(authExpiry)) {
      // Valid authentication found
      setIsAuthenticated(true);
      setIsLoading(false);
    } else {
      // No valid auth, clear any expired session and show password modal
      sessionStorage.removeItem('admin_auth_expiry');
      setIsAuthenticated(false);
      setShowPasswordModal(true);
      setIsLoading(false);
    }
  };

  const handlePasswordCorrect = () => {
    setIsAuthenticated(true);
    setShowPasswordModal(false);
  };

  const handlePasswordCancel = () => {
    navigate(-1); // Go back to previous page
  };

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      
      // Load system state
      const systemState = await getSystemState();
      setTotalSpins(parseInt(systemState.total_spins));
      setSpinsInCurrentRound(parseInt(systemState.spins_in_current_round));
      setCurrentRound(parseInt(systemState.current_round));

      // Load offer stats for current round
      const stats = await getOfferStats(parseInt(systemState.current_round));
      setOfferStats(stats);

      // Load total users
      const userCount = await getTotalUsers();
      setTotalUsers(userCount);
    } catch (error) {
      console.error('Error loading admin data:', error);
      toast({
        title: "Error",
        description: "Failed to load admin data",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = async () => {
    if (!window.confirm('Are you sure you want to reset all counters? This action cannot be undone.')) {
      return;
    }

    try {
      setIsResetting(true);
      await resetAllCounters();
      
      // Reload data after reset
      await loadAdminData();
      
      toast({
        title: "Reset Successful",
        description: "All counters have been reset to 0",
      });
    } catch (error) {
      console.error('Error resetting counters:', error);
      toast({
        title: "Error",
        description: "Failed to reset counters. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  const handleBackToSpinner = () => {
    navigate("/spinner");
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-festive-gradient flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <>
        <div className="min-h-screen bg-festive-gradient"></div>
        <AdminPasswordModal
          isOpen={showPasswordModal}
          onPasswordCorrect={handlePasswordCorrect}
          onCancel={handlePasswordCancel}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-festive-gradient p-4 font-poppins">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={handleBackToSpinner}
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          
        </Button>
        
        <h1 className="text-2xl font-bold text-white font-playfair">
          ADMIN PANEL
        </h1>
        
        <Button
          onClick={handleReset}
          disabled={isResetting}
          variant="destructive"
          className="bg-red-600 hover:bg-red-700"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          {isResetting ? 'Resetting...' : ''}
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Current Round Progress */}
          <Card className="shadow-festive border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-center">
                Current Round Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-4">
                <div className="text-3xl font-bold text-primary">
                  {spinsInCurrentRound} / 100
                </div>
                <Progress value={spinsInCurrentRound} className="h-3" />
                <p className="text-sm text-muted-foreground">
                  Round {currentRound + 1}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Total Users */}
          <Card className="shadow-festive border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-center">
                Total Users
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{totalUsers}</div>
                <p className="text-sm text-muted-foreground">registered players</p>
              </div>
            </CardContent>
          </Card>

          {/* Total Spins */}
          <Card className="shadow-festive border-2 border-primary/20">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-center">
                Total Spins
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary">{totalSpins}</div>
                <p className="text-sm text-muted-foreground">all-time spins</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Offer Distribution */}
        <Card className="shadow-festive border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold">
              Offer Distribution Tracker
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {offerStats.map((offer, index) => (
                <div key={index} className="p-4 border rounded-lg bg-muted/50">
                  <div className="flex justify-between items-center mb-2">
                    <span className="font-medium">{offer.name}</span>
                    <span className="text-sm font-semibold">
                      {offer.current}/{offer.max}
                    </span>
                  </div>
                  <Progress 
                    value={(offer.current / offer.max) * 100} 
                    className="h-2"
                  />
                  <div className="mt-1 text-xs text-muted-foreground">
                    {offer.max - offer.current} remaining
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminPage;
