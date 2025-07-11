import { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";

interface OfferStats {
  name: string;
  current: number;
  max: number;
}

const AdminPage = () => {
  const [totalSpins, setTotalSpins] = useState(0);
  const [offerStats, setOfferStats] = useState<OfferStats[]>([
    { name: "10% OFF", current: 0, max: 25 },
    { name: "2% OFF", current: 0, max: 20 },
    { name: "0.50g Silver Coin", current: 0, max: 15 },
    { name: "1 Gold Coin", current: 0, max: 5 },
    { name: "15% OFF", current: 0, max: 15 },
    { name: "5% OFF", current: 0, max: 15 },
    { name: "10% OFF Premium", current: 0, max: 3 },
    { name: "50% OFF", current: 0, max: 2 },
  ]);

  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    loadAdminData();
  }, []);

  const loadAdminData = () => {
    // Load total spins
    const spins = localStorage.getItem("totalSpins");
    setTotalSpins(parseInt(spins || "0"));

    // Load offer distribution
    const offerData = localStorage.getItem("offerDistribution");
    if (offerData) {
      const distribution = JSON.parse(offerData);
      setOfferStats(prev => prev.map((offer, index) => ({
        ...offer,
        current: distribution[index] || 0
      })));
    }
  };

  const handleReset = () => {
    // Reset all counters
    localStorage.setItem("totalSpins", "0");
    localStorage.setItem("offerDistribution", JSON.stringify(Array(8).fill(0)));
    
    // Update local state
    setTotalSpins(0);
    setOfferStats(prev => prev.map(offer => ({ ...offer, current: 0 })));
    
    toast({
      title: "Reset Successful",
      description: "All counters have been reset to 0",
    });
  };

  const handleBackToSpinner = () => {
    navigate("/spinner");
  };

  return (
    <div className="min-h-screen bg-gradient-festive p-4 font-poppins">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <Button
          onClick={handleBackToSpinner}
          variant="ghost"
          className="text-white hover:bg-white/20"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          Back to Spinner
        </Button>
        
        <h1 className="text-2xl font-bold text-white font-playfair">
          ADMIN PANEL
        </h1>
        
        <Button
          onClick={handleReset}
          variant="destructive"
          className="bg-red-600 hover:bg-red-700"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          Reset All
        </Button>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Total Spins Card */}
        <Card className="shadow-festive border-2 border-primary/20">
          <CardHeader>
            <CardTitle className="text-xl font-semibold text-center">
              Current Round Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center space-y-4">
              <div className="text-4xl font-bold text-primary">
                {totalSpins % 100} / 100
              </div>
              <Progress value={(totalSpins % 100)} className="h-3" />
              <p className="text-muted-foreground">
                {totalSpins % 100} spins completed in current round
              </p>
              <div className="pt-2 border-t">
                <p className="text-sm text-muted-foreground">
                  Total Rounds Completed: <span className="font-semibold">{Math.floor(totalSpins / 100)}</span>
                </p>
                <p className="text-sm text-muted-foreground">
                  Total Spins Ever: <span className="font-semibold">{totalSpins}</span>
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

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