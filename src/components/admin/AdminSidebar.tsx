import * as React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  Award, 
  BookOpen, 
  Settings,
  GraduationCap,
  ChevronDown,
  BarChart,
  CreditCard,
  FileText,
  Home,
  ChevronRight
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
};

// Badge component
const NavBadge = ({ text, variant }: { text: string, variant: string }) => {
  const variantClasses = {
    default: "bg-gray-200 text-gray-800",
    warning: "bg-amber-100 text-amber-800",
    success: "bg-green-100 text-green-800",
  }[variant as keyof typeof variantClasses] || "bg-gray-200 text-gray-800";
  
  return (
    <span className={`ml-auto px-2 py-0.5 text-xs rounded-full ${variantClasses} font-bold`}>
      {text}
    </span>
  );
};

// NavItem component
const NavItem = ({ icon, name, path, id, isActive, badge, children }: NavItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = children && children.length > 0;
  
  return (
    <div className="relative">
      <Link 
        to={hasChildren ? "#" : path} 
        onClick={(e) => {
          if (hasChildren) {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
        }}
        className={`flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition-colors ${
          isActive && !hasChildren 
            ? "bg-amber-500 hover:bg-amber-600 text-white font-bold" 
            : "text-gray-800 font-bold hover:text-gray-900"
        } font-heading`}
      >
        <div className="flex-shrink-0 text-center w-6">{icon}</div>
        <span className="flex-grow font-bold">{name}</span>
        {badge && <NavBadge text={badge.text} variant={badge.variant} />}
        {hasChildren && (
          <ChevronDown 
            size={16} 
            className={`transition-transform ${isOpen ? 'transform rotate-180' : ''}`} 
          />
        )}
      </Link>
      
      {hasChildren && isOpen && (
        <div className="ml-4 pl-4 mt-1 mb-1 border-l border-gray-200">
          {children.map((item) => (
            <Link
              key={item.id}
              to={item.path}
              className={`flex items-center py-2 px-3 rounded-md text-sm hover:bg-gray-100 transition-colors my-1 ${
                useLocation().pathname === item.path 
                  ? "text-amber-600 font-bold" 
                  : "text-gray-700 hover:text-gray-800 font-bold"
              } font-heading`}
            >
              <ChevronRight size={12} className="mr-2 text-gray-400" />
              <span className="font-bold">{item.name}</span>
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

const AdminSidebar = () => {
  const location = useLocation();
  
  const navItems: NavItem[] = [
    { 
      name: 'Dashboard', 
      icon: <LayoutDashboard size={18} />, 
      path: '/admin/dashboard',
      id: 'dashboard'
    },
    { 
      name: 'Events', 
      icon: <Calendar size={18} />, 
      path: '/admin/events',
      id: 'events',
      badge: { text: 'New', variant: 'success' }
    },
    { 
      name: 'Students', 
      icon: <GraduationCap size={18} />, 
      path: '/admin/students',
      id: 'students',
      badge: { text: '12', variant: 'warning' }
    },
    { 
      name: 'Registrations', 
      icon: <FileText size={18} />, 
      path: '/admin/registrations',
      id: 'registrations'
    },
    { 
      name: 'User Management', 
      icon: <Users size={18} />, 
      path: '#',
      id: 'user-management',
      children: [
        { name: 'Teams', icon: <Users size={16} />, path: '/admin/teams', id: 'teams' }
      ]
    },
    { 
      name: 'Analytics', 
      icon: <BarChart size={18} />, 
      path: '/admin/analytics',
      id: 'analytics'
    },
    { 
      name: 'Payments', 
      icon: <CreditCard size={18} />, 
      path: '/admin/payments',
      id: 'payments'
    },
    { 
      name: 'Settings', 
      icon: <Settings size={18} />, 
      path: '/admin/settings',
      id: 'settings'
    }
  ];
  
  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="bg-white w-64 min-h-screen border-r border-gray-200 hidden md:flex flex-col shadow-sm font-heading">
      {/* Logo Area */}
      <div className="p-4 border-b border-gray-200">
        <Link to="/" className="flex items-center gap-2 py-2">
          <Home className="h-6 w-6 text-amber-500" />
          <span className="font-bold text-lg text-gray-900">
            TechShethra <span className="text-amber-500">2025</span>
          </span>
        </Link>
      </div>
      
      {/* Navigation */}
      <div className="flex-1 p-4 overflow-y-auto">
        <div className="mb-6">
          <p className="text-xs uppercase text-gray-600 font-bold tracking-wider mb-2 px-4 font-heading">Main Navigation</p>
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
              />
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <p className="text-xs uppercase text-gray-600 font-bold tracking-wider mb-2 px-4 font-heading">Management</p>
          <div className="space-y-1">
            {navItems.slice(3, 8).map((item) => (
              <NavItem 
                key={item.id}
                icon={item.icon}
                name={item.name}
                path={item.path}
                id={item.id}
                isActive={isActive(item.path)}
                badge={item.badge}
                children={item.children}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar; 