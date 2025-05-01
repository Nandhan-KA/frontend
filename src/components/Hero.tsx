import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const Hero = () => {
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });
  
  const [isLoaded, setIsLoaded] = useState(false);
  const heroRef = useRef<HTMLDivElement>(null);
  
  // Set the event date (change as needed)
  const eventDate = new Date('2025-05-09T09:00:00');
  
  useEffect(() => {
    const calculateCountdown = () => {
      const now = new Date();
      const difference = eventDate.getTime() - now.getTime();
      
      if (difference <= 0) {
        // Event has started
        setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);
      
      setCountdown({ days, hours, minutes, seconds });
    };
    
    // Calculate immediately and then every second
    calculateCountdown();
    const interval = setInterval(calculateCountdown, 1000);
    
    // Animation timing
    setTimeout(() => {
      setIsLoaded(true);
    }, 500);
    
    // Parallax effect on scroll
    const handleScroll = () => {
      if (heroRef.current) {
        const scrollValue = window.scrollY;
        const parallaxElements = heroRef.current.querySelectorAll('.parallax');
        
        parallaxElements.forEach((el, index) => {
          const speed = 0.1 + (index * 0.05);
          (el as HTMLElement).style.transform = `translateY(${scrollValue * speed}px)`;
        });
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center text-white overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[#0e0e10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#0e0e10]"></div>
        
        {/* Animated Orbs */}
        <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-purple-500/10 blur-3xl animate-float-staggered-1 parallax"></div>
        <div className="absolute bottom-[30%] right-[15%] w-96 h-96 rounded-full bg-gold/10 blur-3xl animate-float-staggered-2 parallax"></div>
        <div className="absolute top-[40%] right-[10%] w-40 h-40 rounded-full bg-red-500/10 blur-3xl animate-float-staggered-3 parallax"></div>
      </div>
      
      {/* Main Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Content */}
          <div className="text-center lg:text-left">
            <div 
              className={`overflow-hidden transition-all duration-1000 ${
                isLoaded ? 'opacity-100' : 'opacity-0 transform translate-y-10'
              }`}
            >
              <span className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold text-sm font-bold mb-4 animate-pulse-slow">
                May 9, 2025 at 9:00 AM
              </span>
            </div>
            
            <div className="overflow-hidden">
              <div 
                className={`text-center lg:text-left mb-2 transition-all duration-1000 delay-50 ${
                  isLoaded ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-10'
                }`}
              >
                <div className="flex flex-col md:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-2">
                  <img 
                    src="/mce.png" 
                    alt="MCE Logo" 
                    className="h-14 md:h-16 object-contain"
                  />
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-white">MEENAKSHI COLLEGE OF ENGINEERING</h2>
                    <p className="text-sm md:text-base text-gray-300">#12, Vembuliamman Kovil Street, West K.K.Nagar Chennai-600078</p>
                  </div>
                </div>
              </div>
              <h1 
                className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 transition-all duration-1000 delay-100 ${
                  isLoaded ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-10'
                }`}
              >
                <span className="inline-block bg-gradient-to-r from-amber-200 via-gold to-amber-600 bg-clip-text text-transparent animate-gradient-x">
                  TECHSHETHRA
                  2025
                </span>
              </h1>
            </div>
            
            <div 
              className={`transition-all duration-1000 delay-300 ${
                isLoaded ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-10'
              }`}
            >
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0">
                Join us for the ultimate tech fest with competitions, workshops, hackathons, and more, 
                featuring a fantastic lineup of speakers and amazing prizes!
              </p>
            </div>
            
            <div 
              className={`flex flex-wrap gap-4 justify-center lg:justify-start transition-all duration-1000 delay-500 ${
                isLoaded ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-10'
              }`}
            >
              <a 
                href="#events" 
                className="btn-gold px-8 py-3 rounded-full font-bold inline-flex items-center hover:scale-105 transition-transform relative overflow-hidden group"
              >
                <span className="relative z-10">Explore Events</span>
                <ArrowRight className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                <span className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </a>
              
              <a 
                href="/student/register" 
                className="bg-white/10 px-8 py-3 rounded-full font-bold inline-flex items-center hover:bg-white/20 transition-colors text-white"
              >
                Register Now
              </a>
            </div>
            
            {/* Countdown */}
            <div 
              className={`mt-12 transition-all duration-1000 delay-700 ${
                isLoaded ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-10'
              }`}
            >
              <h3 className="text-xl mb-4 text-center lg:text-left">Event Starts In:</h3>
              <div className="flex justify-center lg:justify-start gap-3 md:gap-4">
                <div className="countdown-item animate-float-staggered-1">
                  <div className="text-2xl md:text-3xl font-bold">{countdown.days}</div>
                  <div className="text-xs md:text-sm text-gray-400">Days</div>
                </div>
                <div className="countdown-item animate-float-staggered-2">
                  <div className="text-2xl md:text-3xl font-bold">{countdown.hours}</div>
                  <div className="text-xs md:text-sm text-gray-400">Hours</div>
                </div>
                <div className="countdown-item animate-float-staggered-3">
                  <div className="text-2xl md:text-3xl font-bold">{countdown.minutes}</div>
                  <div className="text-xs md:text-sm text-gray-400">Minutes</div>
                </div>
                <div className="countdown-item animate-float-staggered-4">
                  <div className="text-2xl md:text-3xl font-bold">{countdown.seconds}</div>
                  <div className="text-xs md:text-sm text-gray-400">Seconds</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* 3D/Visual Element */}
          <div 
            className={`flex justify-center items-center transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 transform-none' : 'opacity-0 transform translate-x-10'
            }`}
          >
            <div className="relative w-full max-w-md flex justify-center items-center">
              {/* Logo as main element with glow effects */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="w-96 h-96 flex items-center justify-center relative z-10"
              >
                <img 
                  src="/logo.png" 
                  alt="TechShethra Logo" 
                  className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
