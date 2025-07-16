import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { checkDuplicateUser, createUser, saveUserSession } from '@/services/userService';

const FormPage = () => {
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !mobile.trim()) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    if (mobile.length < 10) {
      toast({
        title: "Error", 
        description: "Please enter a valid mobile number",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      // Check for duplicate user
      const isDuplicate = await checkDuplicateUser(name.trim(), mobile.trim());
      if (isDuplicate) {
        toast({
          title: "Already Played!",
          description: "You've already participated in the lucky draw.",
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser = await createUser(name.trim(), mobile.trim());
      
      // Save user session
      saveUserSession(newUser);
      
      // Navigate to spinner page
      navigate("/spinner");
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-festive-gradient flex items-center justify-center p-4 font-poppins">
      <div className="w-full max-w-md">
        <Card className="shadow-festive border-2 border-primary/20">
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-3xl font-bold font-playfair text-primary">
              Shreedhan Jwellers
            </CardTitle>
            <p className="text-secondary font-medium">
              Please sign in to try your luck!
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="mobile" className="text-sm font-medium">
                  WhatsApp Number *
                </Label>
                <Input
                  id="mobile"
                  type="tel"
                  placeholder="Enter your WhatsApp number"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  className="h-12 text-base"
                  required
                />
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-12 text-lg font-bold uppercase bg-gradient-primary hover:shadow-glow transition-all duration-300"
              >
                {isLoading ? "Please Wait..." : "Start Spinning"}
              </Button>
            </form>
            <div className="mt-4 pt-2 text-sm text-muted-foreground">
              <ul className="space-y-2">
                <li>* Offer valid till Janmashtami</li>
                <li>* Each customer will get one chance to spin the wheel for purchase of ₹5,000 (silver) or ₹15,000 (gold)</li>
                <li>* For gold purchases, the discount percentage will apply only on labour charges</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default FormPage;
