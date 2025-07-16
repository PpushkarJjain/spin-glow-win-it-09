import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface AdminPasswordModalProps {
  isOpen: boolean;
  onPasswordCorrect: () => void;
  onCancel: () => void;
}

const AdminPasswordModal = ({ isOpen, onPasswordCorrect, onCancel }: AdminPasswordModalProps) => {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const ADMIN_PASSWORD = "112345";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password.trim()) {
      setError("Please enter the password");
      return;
    }

    setIsVerifying(true);
    setError("");

    // Add small delay for better UX
    setTimeout(() => {
      if (password === ADMIN_PASSWORD) {
        // Store auth with 30-minute expiry
        const expiryTime = Date.now() + (30 * 60 * 1000); // 1 minutes
        sessionStorage.setItem('admin_auth_expiry', expiryTime.toString());
        
        setPassword("");
        onPasswordCorrect();
      } else {
        setError("Incorrect password. Please try again.");
      }
      setIsVerifying(false);
    }, 300);
  };

  const handleCancel = () => {
    setPassword("");
    setError("");
    onCancel();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit(e as any);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent 
        className="sm:max-w-md bg-festive-gradient border-4 border-primary"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="text-center text-white font-playfair text-2xl">
            <Lock className="h-8 w-8 mx-auto mb-2" />
            Admin Access Required
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-center text-white/90 text-sm mb-4">
            Enter the 6-digit admin password to continue
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter admin password"
              maxLength={6}
              className="pr-12 text-center text-lg font-mono bg-white/10 border-white/30 text-white placeholder:text-white/60"
              disabled={isVerifying}
              autoFocus
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 text-white/70 hover:text-white hover:bg-white/10"
              disabled={isVerifying}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </Button>
          </div>

          {error && (
            <div className="text-red-300 text-sm text-center bg-red-500/20 p-2 rounded border border-red-400/30">
              {error}
            </div>
          )}

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="ghost"
              onClick={handleCancel}
              className="flex-1 text-white border-white/30 hover:bg-white/10"
              disabled={isVerifying}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isVerifying || !password.trim()}
              className="flex-1 bg-gradient-primary hover:shadow-glow transition-all duration-300"
            >
              {isVerifying ? "Verifying..." : "Access Admin"}
            </Button>
          </div>
        </form>

        <div className="text-center text-xs text-white/60 mt-4">
          Access will expire after 30 minutes of inactivity
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AdminPasswordModal;