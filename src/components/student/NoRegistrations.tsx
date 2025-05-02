import { useState } from 'react';
import { CalendarPlus, PartyPopper, AlertCircle } from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

interface NoRegistrationsProps {
  // Remove the setActiveTab prop since we're using direct navigation
}

const NoRegistrations = ({}: NoRegistrationsProps) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  
  const handleExplore = () => {
    setOpen(false);
    navigate('/student/dashboard?tab=events', { replace: true });
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md bg-white border-gray-200 text-gray-900 shadow-lg">
        <DialogHeader>
          <div className="mx-auto bg-amber-100 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-2">
            <PartyPopper className="h-6 w-6 text-amber-600" />
          </div>
          <DialogTitle className="text-center text-xl font-bold text-amber-600">No Registrations Yet</DialogTitle>
          <DialogDescription className="text-center text-gray-500">
            You haven't registered for any events. Explore our exciting events and be part of TechShethra 2025!
          </DialogDescription>
        </DialogHeader>
        
        <div className="p-4 bg-gray-50 rounded-lg my-4 flex items-start gap-3">
          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-600">
            Registration gives you access to event details, resources, and certificates after completion.
          </p>
        </div>
        
        <DialogFooter className="sm:justify-center gap-3 mt-2">
          <Button 
            variant="outline" 
            onClick={() => setOpen(false)}
            className="border-gray-300 hover:bg-gray-100 text-gray-700 hover:text-gray-900"
          >
            Maybe Later
          </Button>
          <Button 
            onClick={handleExplore} 
            className="bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-2"
          >
            <CalendarPlus className="h-4 w-4" />
            Explore Events
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NoRegistrations; 