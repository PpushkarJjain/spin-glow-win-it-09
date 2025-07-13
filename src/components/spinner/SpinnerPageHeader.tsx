import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface SpinnerPageHeaderProps {
  onAdminAccess: () => void;
}

const SpinnerPageHeader: React.FC<SpinnerPageHeaderProps> = ({ onAdminAccess }) => {
  return (
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
              onClick={onAdminAccess}
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
  );
};

export default SpinnerPageHeader;
