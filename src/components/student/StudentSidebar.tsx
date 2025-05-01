import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  GraduationCap, 
  Receipt,
  Award,
  Settings, 
  LogOut,
  Home,
  PieChart,
  User,
  Clock,
  ChevronDown,
  ChevronRight,
  Bookmark
} from 'lucide-react';

import { cn } from "@/lib/utils";
import { useState } from 'react';

type NavItemProps = {
  icon: React.ReactNode;
  name: string;
  path: string;
  id: string;
  isActive: boolean;
  badge?: {
    text: string;
    variant: "default" | "warning" | "success";
  };
  children?: NavItem[];
  onClick?: () => void;
};

type NavItem = {
  name: string;
  path: string;
  id: string;
  icon: React.ReactNode;
  badge?: {
    text: string;
    variant: "default" | "warning" | "success";
  };
  children?: NavItem[];
  onClick?: () => void;
};

// Badge component
const NavBadge = ({ text, variant }: { text: string, variant: string }) => {
  const variantClasses = {
    default: "bg-gray-200 text-gray-700",
    warning: "bg-amber-100 text-amber-700",
    success: "bg-green-100 text-green-700",
  }[variant as keyof typeof variantClasses] || "bg-gray-200 text-gray-700";
  
  return (
    <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${variantClasses}`}>
      {text}
    </span>
  );
};

// NavItem component
const NavItem = ({ icon, name, path, id, isActive, badge, children, onClick }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = children && children.length > 0;
  
  return (
    <div className="relative">
      {onClick ? (
        <button
          onClick={() => onClick()}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900`}
        >
          <div className="flex-shrink-0 text-center w-6">{icon}</div>
          <span className="flex-grow text-left">{name}</span>
          {badge && <NavBadge text={badge.text} variant={badge.variant} />}
        </button>
      ) : (
        <Link 
          to={hasChildren ? "#" : path} 
          onClick={(e) => {
            if (hasChildren) {
              e.preventDefault();
              setIsOpen(!isOpen);
            }
          }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${
            isActive && !hasChildren ? "bg-amber-500 text-white hover:bg-amber-600" : "text-gray-700 hover:text-gray-900"
          }`}
        >
          <div className="flex-shrink-0 text-center w-6">{icon}</div>
          <span className="flex-grow">{name}</span>
          {badge && <NavBadge text={badge.text} variant={badge.variant} />}
          {hasChildren && (
            <ChevronDown 
              size={16} 
              className={`transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
            />
          )}
        </Link>
      )}
      
      {hasChildren && isOpen && (
        <div className="ml-4 pl-4 mt-1 mb-1 border-l border-gray-200">
          {children.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center py-2 px-3 rounded-md text-sm hover:bg-gray-100 transition-colors my-1 ${
                useLocation().pathname === item.path 
                  ? "text-amber-600 font-medium" 
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <ChevronRight size={12} className="mr-2 text-gray-400" />
              <span>{item.name}</span>
              {item.badge && (
                <NavBadge text={item.badge.text} variant={item.badge.variant} />
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

interface StudentSidebarProps {
  registrationCount: number;
  onLogout: () => void;
  studentName: string;
}

const StudentSidebar = ({ registrationCount, onLogout, studentName }: StudentSidebarProps) => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={18} />, 
      path: '/student/dashboard',
      id: 'dashboard'
    },
    { 
      name: 'Browse Events', 
      icon: <Calendar size={18} />, 
      path: '/student/dashboard?tab=events',
      id: 'events',
      badge: registrationCount > 0 ? undefined : { text: 'New', variant: 'success' }
    },
    { 
      name: 'My Registrations', 
      icon: <Receipt size={18} />, 
      path: '/student/dashboard?tab=registered',
      id: 'registrations',
      badge: registrationCount > 0 ? { text: registrationCount.toString(), variant: 'warning' } : undefined
    },
    { 
      name: 'My Profile', 
      icon: <User size={18} />, 
      path: '/student/profile',
      id: 'profile'
    },
    { 
      name: 'Schedule', 
      icon: <Clock size={18} />, 
      path: '/student/schedule',
      id: 'schedule'
    },
    { 
      name: 'Certificates', 
      icon: <Award size={18} />, 
      path: '/student/certificates',
      id: 'certificates'
    },
    { 
      name: 'Bookmarks', 
      icon: <Bookmark size={18} />, 
      path: '/student/bookmarks',
      id: 'bookmarks'
    },
    { 
      name: 'Settings', 
      icon: <Settings size={18} />, 
      path: '/student/settings',
      id: 'settings'
    },
    {
      name: 'Logout',
      icon: <LogOut size={18} />,
      path: '#',
      id: 'logout',
      onClick: onLogout
    }
  ];
  
  const isActive = (path: string) => {
    if (path.includes('?')) {
      // For paths with query parameters, match the base path and query
      const [basePath, query] = path.split('?');
      return location.pathname === basePath && location.search.includes(query);
    }
    return location.pathname === path;
  };

  return (
    <div className="bg-white w-64 min-h-screen border-r border-gray-200 hidden md:flex flex-col shadow-sm">
      {/* Logo and User Area */}
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2 py-2">
          <Home className="h-6 w-6 text-amber-600" />
          <span className="font-bold text-lg text-gray-900">
            Tech<span className="text-amber-600">Shethra</span>
          </span>
        </Link>
        
        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600 font-bold">
              {studentName.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="font-medium text-gray-900 truncate">{studentName}</p>
              <p className="text-xs text-gray-500">Student</p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="mb-6">
          <p className="text-xs uppercase text-gray-400 font-semibold tracking-wider mb-2 px-4">Main Navigation</p>
          <div className="space-y-1">
            {navItems.slice(0, 3).map((item) => (
              <NavItem 
                key={item.id}
                icon={item.icon}
                name={item.name}
                path={item.path}
                id={item.id}
                isActive={isActive(item.path)}
                badge={item.badge}
                children={item.children}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2 px-4">Account</p>
          <div className="space-y-1">
            {navItems.slice(3, 7).map((item) => (
              <NavItem 
                key={item.id}
                icon={item.icon}
                name={item.name}
                path={item.path}
                id={item.id}
                isActive={isActive(item.path)}
                badge={item.badge}
                children={item.children}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-xs uppercase text-gray-500 font-semibold tracking-wider mb-2 px-4">General</p>
          <div className="space-y-1">
            {navItems.slice(7).map((item) => (
              <NavItem 
                key={item.id}
                icon={item.icon}
                name={item.name}
                path={item.path}
                id={item.id}
                isActive={isActive(item.path)}
                badge={item.badge}
                children={item.children}
                onClick={item.onClick}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="text-center text-xs text-gray-500">
          <p>TechShethra © 2025</p>
        </div>
      </div>
    </div>
  );
};

export default StudentSidebar; 