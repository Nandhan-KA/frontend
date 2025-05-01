import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  User, 
  Bell, 
  Settings, 
  HelpCircle, 
  ChevronDown,
  Search,
  LayoutDashboard
} from 'lucide-react';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AdminInfo {
  id: string;
  name: string;
  email: string;
  role: string;
}

const AdminHeader = () => {
  const [admin, setAdmin] = useState<AdminInfo | null>(null);
  const [showSearch, setShowSearch] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const adminInfo = localStorage.getItem('adminInfo');
    if (adminInfo) {
      setAdmin(JSON.parse(adminInfo));
    } else {
      navigate('/admin');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminInfo');
    navigate('/admin');
  };

  return (
    <header className="bg-gradient-to-r from-white to-gray-50 border-b border-gray-200 py-3 px-6 flex justify-between items-center sticky top-0 z-10 backdrop-blur-sm bg-opacity-90 shadow-sm font-heading">
      <div className="flex items-center">
        <div className="flex items-center gap-2 mr-8">
          <LayoutDashboard className="h-6 w-6 text-amber-500" />
          <h1 className="text-xl font-bold">
            <span className="text-gray-900">Tech</span>
            <span className="text-amber-500">Shethra</span>
            <span className="text-gray-900"> Admin</span>
          </h1>
        </div>
        
        {/* Global Search */}
        <div className={`transition-all duration-300 ${showSearch ? 'w-64 opacity-100' : 'w-0 opacity-0'}`}>
          {showSearch && (
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                placeholder="Search..."
                className="pl-10 py-1 h-8 bg-gray-100 border-gray-200 text-gray-800 text-sm rounded-md focus-visible:ring-amber-500 font-heading"
              />
            </div>
          )}
        </div>
      </div>
      
      <div className="flex items-center gap-4">
        {/* Search Toggle */}
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowSearch(!showSearch)}
          className="text-gray-700 hover:text-gray-900 hover:bg-amber-50 rounded-full"
        >
          <Search size={18} />
        </Button>
        
        {/* Help */}
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-gray-700 hover:text-gray-900 hover:bg-amber-50 rounded-full"
          onClick={() => window.open('https://github.com/your-repo/goldfire-techshethra-site', '_blank')}
        >
          <HelpCircle size={18} />
        </Button>
        
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="relative text-gray-700 hover:text-gray-900 hover:bg-amber-50 rounded-full">
              <Bell size={18} />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 flex items-center justify-center text-[10px] bg-gradient-to-r from-amber-500 to-amber-600 text-white p-0">
                2
              </Badge>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-80 mr-4 bg-white border-gray-200 text-gray-900 shadow-lg rounded-xl font-heading" align="end">
            <DropdownMenuLabel className="border-b border-gray-200 pb-2 px-4 py-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-900 font-bold">Notifications</span>
                <Badge className="bg-amber-100 text-amber-800 hover:bg-amber-200 font-bold">2 New</Badge>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuGroup className="max-h-72 overflow-y-auto py-1">
              <DropdownMenuItem className="py-3 px-4 cursor-pointer hover:bg-amber-50">
                <div>
                  <div className="font-bold flex items-center gap-2 text-gray-900">
                    <Badge className="h-2 w-2 p-0 rounded-full bg-amber-500" />
                    New Student Registration
                  </div>
                  <div className="text-xs text-gray-600 mt-1 font-medium">
                    Rahul Kumar has registered for TechShethra 2025.
                  </div>
                  <div className="text-xs text-gray-500 mt-1">30 minutes ago</div>
                </div>
              </DropdownMenuItem>
              <DropdownMenuItem className="py-3 px-4 cursor-pointer hover:bg-amber-50">
                <div>
                  <div className="font-bold flex items-center gap-2 text-gray-900">
                    <Badge className="h-2 w-2 p-0 rounded-full bg-green-500" />
                    Event Registration Complete
                  </div>
                  <div className="text-xs text-gray-600 mt-1 font-medium">
                    5 students registered for Hackathon event.
                  </div>
                  <div className="text-xs text-gray-500 mt-1">2 hours ago</div>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator className="bg-gray-200" />
            <DropdownMenuItem className="py-2 px-4 hover:bg-amber-50 text-center">
              <span className="w-full text-center text-amber-500 font-bold">View all notifications</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        {/* User Profile */}
        {admin && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="flex items-center gap-2 bg-gradient-to-r from-gray-100 to-gray-50 hover:bg-gray-100 text-gray-900 px-3 rounded-full border border-gray-200">
                <div className="h-7 w-7 rounded-full bg-gradient-to-r from-amber-400 to-amber-500 flex items-center justify-center text-white shadow-sm">
                  {admin.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm font-bold hidden md:inline">{admin.name}</span>
                <ChevronDown size={14} className="text-gray-500" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 mr-4 bg-white border-gray-200 text-gray-900 shadow-lg rounded-xl font-heading" align="end">
              <DropdownMenuLabel className="px-4 py-3 border-b border-gray-200">
                <div className="flex flex-col">
                  <span className="font-bold text-gray-900">{admin.name}</span>
                  <span className="text-xs text-gray-500">{admin.email}</span>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuGroup>
                <DropdownMenuItem className="cursor-pointer hover:bg-amber-50 py-2.5 px-4">
                  <User className="mr-2 h-4 w-4 text-amber-500" />
                  <span className="font-bold">Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer hover:bg-amber-50 py-2.5 px-4">
                  <Settings className="mr-2 h-4 w-4 text-amber-500" />
                  <span className="font-bold">Settings</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator className="bg-gray-200" />
              <DropdownMenuItem 
                onClick={handleLogout}
                className="cursor-pointer text-red-600 hover:bg-red-50 hover:text-red-700 py-2.5 px-4"
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span className="font-bold">Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </header>
  );
};

export default AdminHeader; 