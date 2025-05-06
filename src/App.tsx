import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import StarsBackground from "./components/ui/stars-background";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminEvents from "./pages/AdminEvents";
import AdminStudents from "./pages/AdminStudents";
import AdminSettings from "./pages/AdminSettings";
import AdminRegistrations from "./pages/AdminRegistrations";
import AdminSecurityPage from "./pages/AdminSecurityPage";
import StudentRegister from "./pages/StudentRegister";
import StudentLogin from "./pages/StudentLogin";
import StudentDashboard from "./pages/StudentDashboard";
import EventRegistration from "./pages/EventRegistration";
import EventDetail from "./pages/EventDetail";
import SplashScreen from "./components/SplashScreen";

const queryClient = new QueryClient();

const App = () => {
  const [showSplash, setShowSplash] = useState(true);
  const [contentVisible, setContentVisible] = useState(false);
  const [redirectPath, setRedirectPath] = useState<string | null>(null);
  
  // Store splash screen viewed state in localStorage to avoid showing it on every page refresh
  useEffect(() => {
    const splashWatched = localStorage.getItem('splashWatched');
    const timestamp = parseInt(splashWatched || '0');
    const threeHours = 3 * 60 * 60 * 1000; // Show splash again after three hours
    
    if (splashWatched && (Date.now() - timestamp < threeHours)) {
      setShowSplash(false);
      setContentVisible(true);
    }

    // Check for redirect path from 404.html
    const savedRedirectPath = sessionStorage.getItem('redirectPath');
    if (savedRedirectPath) {
      setRedirectPath(savedRedirectPath);
      sessionStorage.removeItem('redirectPath');
    }
  }, []);
  
  const handleSplashComplete = () => {
    setShowSplash(false);
    // Slightly delay making content visible for smoother transition
    setTimeout(() => {
      setContentVisible(true);
    }, 50);
    localStorage.setItem('splashWatched', Date.now().toString());
  };

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        
        {/* Global stars background that appears on all pages */}
        <StarsBackground opacity={0.3} />
        
        {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
        
        <div 
          className={`transition-opacity duration-1000 ${
            contentVisible ? "opacity-100" : "opacity-0"
          }`}
        >
          <BrowserRouter>
            {redirectPath && <Navigate to={redirectPath} replace />}
            <Routes>
              <Route path="/" element={<Index />} />
              {/* Event Routes */}
              <Route path="/event/:eventId" element={<EventDetail />} />
              <Route path="/event-register/:eventId" element={<EventRegistration />} />
              {/* Admin Routes */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admin/dashboard" element={<AdminDashboard />} />
              <Route path="/admin/events" element={<AdminEvents />} />
              <Route path="/admin/students" element={<AdminStudents />} />
              <Route path="/admin/registrations" element={<AdminRegistrations />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/security" element={<AdminSecurityPage />} />
              {/* Student Routes */}
              <Route path="/student/register" element={<StudentRegister />} />
              <Route path="/student/login" element={<StudentLogin />} />
              <Route path="/student/dashboard" element={<StudentDashboard />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
