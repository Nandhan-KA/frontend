import * as React from 'react';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown, Sparkles } from 'lucide-react';
import { HoverCard, HoverCardTrigger, HoverCardContent } from "@/components/ui/hover-card";
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeSwitch } from '@/components/ui/theme-switch';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const [activeSection, setActiveSection] = useState<string>('');
  
  // Handle scroll and section detection
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
      
      // Detect active section
      const sections = ['about', 'events', 'schedule', 'speakers', 'sponsors', 'registration', 'contact'];
      let currentSection = '';
      
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 200 && rect.bottom >= 200) {
            currentSection = section;
            break;
          }
        }
      }
      
      setActiveSection(currentSection);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation items
  const navItems = [
    { name: 'About', href: '#about' },
    { name: 'Events', href: '#events' },
    { name: 'Schedule', href: '#schedule' },
    { name: 'Registration', href: '#registration' },
    { name: 'Contact', href: '#contact' }
  ];

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-black/80 backdrop-blur-md py-2 shadow-lg shadow-black/20' 
          : 'bg-transparent py-4'
      }`}
    >
      <div className="container mx-auto px-4 flex justify-between items-center">
        <a href="#" className="flex items-center transition-transform duration-300 hover:scale-105 group">
          <motion.div
            whileHover={{ rotate: [0, -5, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
            className="mr-2"
          >
            <img src="/logo.png" alt="TechShethra Logo" className="h-10 w-auto" />
          </motion.div>
        </a>
        
        <div className="hidden md:flex space-x-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.href.substring(1);
            return (
              <HoverCard key={item.href} openDelay={100} closeDelay={100}>
                <HoverCardTrigger asChild>
                  <a 
                    href={item.href} 
                    className={`nav-link relative overflow-hidden group ${isActive ? 'text-gold' : 'text-white'}`}
                  >
                    <span className="relative z-10">{item.name}</span>
                    {isActive && (
                      <motion.span 
                        layoutId="navbar-active-indicator"
                        className="absolute bottom-0 left-0 w-full h-0.5 bg-gold"
                        transition={{ type: "spring", bounce: 0.25 }}
                      />
                    )}
                  </a>
                </HoverCardTrigger>
                <HoverCardContent className="bg-black/90 border-gold text-white p-3">
                  <div className="text-sm">
                    Visit our {item.name} section
                  </div>
                </HoverCardContent>
              </HoverCard>
            );
          })}
        </div>
        
        <div className="hidden md:flex items-center space-x-4">
          <ThemeSwitch />
          
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center text-white hover:text-amber-400 transition-colors">
              Student Portal <ChevronDown className="ml-1 h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-black/90 border-gold text-white">
              <DropdownMenuItem>
                <Link to="/student/login" className="w-full">Login</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/student/register" className="w-full">Register</Link>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Link to="/student/dashboard" className="w-full">Dashboard</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Link 
            to="/student/register" 
            className="relative overflow-hidden bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 rounded-full px-6 py-2 font-semibold transition-all duration-300 group"
          >
            <span className="relative z-10">Register Now</span>
            <span 
              className="absolute inset-0 bg-gradient-to-r from-amber-600 to-amber-700 -translate-x-full group-hover:translate-x-0 transition-transform duration-300"
            />
          </Link>
        </div>
        
        <div className="md:hidden flex items-center gap-2">
          <ThemeSwitch />
          
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)} 
            className="text-white focus:outline-none"
          >
            <AnimatePresence mode="wait">
              {isMenuOpen ? (
                <motion.div
                  key="close"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <X size={24} />
                </motion.div>
              ) : (
                <motion.div
                  key="menu"
                  initial={{ rotate: 90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: -90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <Menu size={24} />
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
      
      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-black/95 backdrop-blur-md absolute top-full left-0 w-full py-4 shadow-lg overflow-hidden"
          >
            <div className="container mx-auto px-4 flex flex-col space-y-4">
              {navItems.map((item, index) => (
                <motion.a 
                  key={item.href}
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  href={item.href} 
                  className="text-white hover:text-gold py-2 transform transition-all duration-300 hover:translate-x-2" 
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
              
              <motion.div 
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: navItems.length * 0.1 }}
                className="border-t border-white/10 pt-4 mt-2"
              >
                <p className="text-white/70 mb-2 font-semibold">Student Portal</p>
                <Link 
                  to="/student/login" 
                  className="text-white hover:text-gold py-2 transform transition-all duration-300 hover:translate-x-2 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link 
                  to="/student/register" 
                  className="text-white hover:text-gold py-2 transform transition-all duration-300 hover:translate-x-2 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register
                </Link>
                <Link 
                  to="/student/dashboard" 
                  className="text-white hover:text-gold py-2 transform transition-all duration-300 hover:translate-x-2 block"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
              </motion.div>
              
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: (navItems.length + 1) * 0.1 }}
              >
                <Link 
                  to="/student/register"
                  className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-full px-6 py-2 font-semibold inline-block transform transition-all duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(245,158,11,0.5)]"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Register Now
                </Link>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
};

export default Navbar;
