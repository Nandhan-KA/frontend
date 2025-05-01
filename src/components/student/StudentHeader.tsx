import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MenuIcon, 
  X, 
  User, 
  LogOut, 
  Home, 
  LayoutDashboard, 
  Calendar, 
  Receipt, 
  Settings
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from '@/components/ui/sheet';

interface StudentHeaderProps {
  studentName: string;
  registrationCount: number;
  onLogout: () => void;
}

const StudentHeader = ({ studentName, registrationCount, onLogout }: StudentHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  return (
    <header className="border-b border-gray-200 bg-white py-3 px-4 md:px-6 sticky top-0 z-30 flex justify-between items-center md:hidden">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center">
          <Home className="h-5 w-5 text-amber-600 mr-2" />
          <span className="font-bold text-lg text-gray-900">
            Tech<span className="text-amber-600">Shethra</span>
          </span>
        </Link>
      </div>
      
      <div className="flex items-center gap-3">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-9 w-9 rounded-full">
              <MenuIcon className="h-5 w-5 text-gray-700" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0 bg-white text-gray-900 border-r border-gray-200 w-[250px]">
            <SheetHeader className="p-4 border-b border-gray-200">
              <SheetTitle className="flex items-center text-gray-900">
                <Home className="h-5 w-5 text-amber-600 mr-2" />
                <span className="font-bold">
                  Tech<span className="text-amber-600">Shethra</span>
                </span>
              </SheetTitle>
            </SheetHeader>
            
            {/* User Info */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
                  {studentName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-medium text-gray-900">{studentName}</p>
                  <p className="text-xs text-gray-500">Student</p>
                </div>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <div className="flex flex-col p-2">
              <SheetClose asChild>
                <Link to="/student/dashboard" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700">
                  <LayoutDashboard size={18} className="text-gray-500" />
                  <span>Dashboard</span>
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <Link to="/student/dashboard?tab=events" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700">
                  <Calendar size={18} className="text-gray-500" />
                  <span>Browse Events</span>
                  {registrationCount === 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                      New
                    </span>
                  )}
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <Link to="/student/dashboard?tab=registered" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700">
                  <Receipt size={18} className="text-gray-500" />
                  <span>My Registrations</span>
                  {registrationCount > 0 && (
                    <span className="ml-auto px-2 py-0.5 text-xs rounded-full bg-amber-100 text-amber-700">
                      {registrationCount}
                    </span>
                  )}
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <Link to="/student/profile" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700">
                  <User size={18} className="text-gray-500" />
                  <span>My Profile</span>
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <Link to="/student/settings" className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-gray-700">
                  <Settings size={18} className="text-gray-500" />
                  <span>Settings</span>
                </Link>
              </SheetClose>
              
              <SheetClose asChild>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 rounded-md hover:bg-gray-100 transition-colors text-red-600 mt-4"
                >
                  <LogOut size={18} />
                  <span>Logout</span>
                </button>
              </SheetClose>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default StudentHeader; 