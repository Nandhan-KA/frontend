import { useState, useEffect, useRef } from 'react';
import { ArrowRight } from 'lucide-react';
import { motion, useMotionValue, useTransform, AnimatePresence } from 'framer-motion';

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
  
  // For 3D card effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-300, 300], [15, -15]);
  const rotateY = useTransform(x, [-300, 300], [-15, 15]);

  // Typing effect state
  const [typingText, setTypingText] = useState('');
  const fullText = "Join us for the ultimate tech fest with competitions, workshops, hackathons, and more, featuring a fantastic lineup of speakers and amazing prizes!";
  const [typingIndex, setTypingIndex] = useState(0);
  
  useEffect(() => {
    // Typing effect
    if (typingIndex < fullText.length && isLoaded) {
      const timeout = setTimeout(() => {
        setTypingText(fullText.substring(0, typingIndex + 1));
        setTypingIndex(typingIndex + 1);
      }, 20);
      
      return () => clearTimeout(timeout);
    }
  }, [typingIndex, isLoaded, fullText]);
  
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
    
    // 3D mouse effect handler
    const handleMouseMove = (e: MouseEvent) => {
      if (heroRef.current) {
        const rect = heroRef.current.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [x, y]);

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center text-white overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 bg-[#0e0e10] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-[#0e0e10]"></div>
        
        {/* Enhanced Animated Orbs with motion */}
        <motion.div 
          className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-purple-500/10 blur-3xl parallax"
          animate={{
            x: [0, 20, 0],
            y: [0, 15, 0],
          }}
          transition={{
            duration: 15,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <motion.div 
          className="absolute bottom-[30%] right-[15%] w-96 h-96 rounded-full bg-gold/10 blur-3xl parallax"
          animate={{
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{
            duration: 18,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        <motion.div 
          className="absolute top-[40%] right-[10%] w-40 h-40 rounded-full bg-red-500/10 blur-3xl parallax"
          animate={{
            x: [0, 15, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 12,
            ease: "easeInOut",
            repeat: Infinity,
          }}
        />
        
        {/* Grid overlay effect for tech vibe */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
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
              <motion.span 
                className="inline-block px-4 py-1 rounded-full bg-gold/20 text-gold text-sm font-bold mb-4 relative"
                whileHover={{ scale: 1.05 }}
                animate={{
                  boxShadow: ['0 0 0px rgba(251,191,36,0.2)', '0 0 15px rgba(251,191,36,0.5)', '0 0 0px rgba(251,191,36,0.2)']
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                May 9, 2025 at 9:00 AM
              </motion.span>
            </div>
            
            <div className="overflow-hidden">
              <div 
                className={`text-center lg:text-left mb-2 transition-all duration-1000 delay-50 ${
                  isLoaded ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-10'
                }`}
              >
                <div className="flex flex-col md:flex-row items-center lg:items-start justify-center lg:justify-start gap-3 mb-2">
                  <motion.img 
                    src="/mce.png" 
                    alt="MCE Logo" 
                    className="h-14 md:h-16 object-contain"
                    whileHover={{ scale: 1.05, rotate: [0, -2, 2, 0] }}
                    transition={{ duration: 0.5 }}
                  />
                  <div>
                    <h2 className="text-xl md:text-2xl font-semibold text-white">MEENAKSHI COLLEGE OF ENGINEERING</h2>
                    <p className="text-sm md:text-base text-gray-300">#12, Vembuliamman Kovil Street, West K.K.Nagar Chennai-600078</p>
                  </div>
                </div>
              </div>
              <motion.h1 
                className={`text-4xl md:text-6xl lg:text-7xl font-bold leading-tight mb-4 transition-all duration-1000 delay-100 ${
                  isLoaded ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-10'
                }`}
                animate={{
                  textShadow: ['0 0 0px rgba(251,191,36,0)', '0 0 10px rgba(251,191,36,0.5)', '0 0 0px rgba(251,191,36,0)']
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <AnimatePresence>
                  <span className="inline-block relative bg-gradient-to-r from-amber-200 via-gold to-amber-600 bg-clip-text text-transparent animate-gradient-x">
                    TECHSHETHRA
                    <motion.span
                      className="absolute -inset-1 opacity-30 blur-xl bg-gradient-to-r from-amber-200 via-gold to-amber-600 -z-10"
                      animate={{
                        opacity: [0.2, 0.4, 0.2],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                      }}
                    />
                    <motion.div
                      className="absolute -bottom-1 h-0.5 bg-gradient-to-r from-amber-200 via-gold to-amber-600 w-0"
                      animate={{
                        width: ['0%', '100%', '0%']
                      }}
                      transition={{
                        duration: 3,
                        ease: "easeInOut",
                        repeat: Infinity,
                        repeatDelay: 1
                      }}
                    />
                  </span>
                  <br />
                  <span className="inline-block bg-gradient-to-r from-amber-200 via-gold to-amber-600 bg-clip-text text-transparent animate-gradient-x">2025</span>
                </AnimatePresence>
              </motion.h1>
            </div>
            
            <div 
              className={`transition-all duration-1000 delay-300 ${
                isLoaded ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-10'
              }`}
            >
              <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto lg:mx-0 min-h-[80px]">
                {typingText}
                <span className="animate-blink">|</span>
              </p>
            </div>
            
            <div 
              className={`flex flex-wrap gap-4 justify-center lg:justify-start transition-all duration-1000 delay-500 ${
                isLoaded ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-10'
              }`}
            >
              <motion.a 
                href="#events" 
                className="btn-gold px-8 py-3 rounded-full font-bold inline-flex items-center hover:scale-105 transition-transform relative overflow-hidden group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className="relative z-10">Explore Events</span>
                <ArrowRight className="ml-2 relative z-10 group-hover:translate-x-1 transition-transform" />
                <motion.span 
                  className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  animate={{
                    background: [
                      'linear-gradient(to right, #f59e0b, #ea580c)',
                      'linear-gradient(to right, #ea580c, #f59e0b)',
                      'linear-gradient(to right, #f59e0b, #ea580c)'
                    ]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                ></motion.span>
              </motion.a>
              
              <motion.a 
                href="/student/register" 
                className="bg-white/10 px-8 py-3 rounded-full font-bold inline-flex items-center hover:bg-white/20 transition-colors text-white"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Register Now
              </motion.a>
            </div>
            
            {/* Countdown */}
            <div 
              className={`mt-12 transition-all duration-1000 delay-700 ${
                isLoaded ? 'opacity-100 transform-none' : 'opacity-0 transform translate-y-10'
              }`}
            >
              <h3 className="text-xl mb-4 text-center lg:text-left">Event Starts In:</h3>
              <div className="flex justify-center lg:justify-start gap-3 md:gap-4">
                <motion.div 
                  className="countdown-item bg-black/30 backdrop-blur-sm p-3 rounded-lg border border-gold/20 animate-float-staggered-1"
                  whileHover={{ scale: 1.1, borderColor: 'rgba(251,191,36,0.5)' }}
                >
                  <div className="text-2xl md:text-3xl font-bold">{countdown.days}</div>
                  <div className="text-xs md:text-sm text-gray-400">Days</div>
                </motion.div>
                <motion.div 
                  className="countdown-item bg-black/30 backdrop-blur-sm p-3 rounded-lg border border-gold/20 animate-float-staggered-2"
                  whileHover={{ scale: 1.1, borderColor: 'rgba(251,191,36,0.5)' }}
                >
                  <div className="text-2xl md:text-3xl font-bold">{countdown.hours}</div>
                  <div className="text-xs md:text-sm text-gray-400">Hours</div>
                </motion.div>
                <motion.div 
                  className="countdown-item bg-black/30 backdrop-blur-sm p-3 rounded-lg border border-gold/20 animate-float-staggered-3"
                  whileHover={{ scale: 1.1, borderColor: 'rgba(251,191,36,0.5)' }}
                >
                  <div className="text-2xl md:text-3xl font-bold">{countdown.minutes}</div>
                  <div className="text-xs md:text-sm text-gray-400">Minutes</div>
                </motion.div>
                <motion.div 
                  className="countdown-item bg-black/30 backdrop-blur-sm p-3 rounded-lg border border-gold/20 animate-float-staggered-4"
                  whileHover={{ scale: 1.1, borderColor: 'rgba(251,191,36,0.5)' }}
                >
                  <div className="text-2xl md:text-3xl font-bold">{countdown.seconds}</div>
                  <div className="text-xs md:text-sm text-gray-400">Seconds</div>
                </motion.div>
              </div>
            </div>
          </div>
          
          {/* 3D/Visual Element */}
          <motion.div 
            className={`flex justify-center items-center transition-all duration-1000 delay-300 ${
              isLoaded ? 'opacity-100 transform-none' : 'opacity-0 transform translate-x-10'
            }`}
            style={{
              perspective: 1000,
            }}
          >
            <motion.div 
              className="relative w-full max-w-md flex justify-center items-center"
              style={{
                rotateX,
                rotateY,
                transformStyle: "preserve-3d"
              }}
            >
              {/* Logo as main element with enhanced 3D and glow effects */}
              <motion.div 
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                className="w-96 h-96 flex items-center justify-center relative z-10"
              >
                <motion.img 
                  src="/logo.png" 
                  alt="TechShethra Logo" 
                  className="w-full h-full object-contain"
                  animate={{
                    filter: [
                      'drop-shadow(0 0 15px rgba(251,191,36,0.6))',
                      'drop-shadow(0 0 25px rgba(251,191,36,0.8))',
                      'drop-shadow(0 0 15px rgba(251,191,36,0.6))'
                    ]
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                
                {/* Rotating particles around the logo */}
                <div className="absolute inset-0 w-full h-full">
                  {[...Array(12)].map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-2 rounded-full bg-gold/70"
                      style={{
                        left: '50%',
                        top: '50%',
                      }}
                      animate={{
                        x: Math.cos(i * (Math.PI / 6)) * 150,
                        y: Math.sin(i * (Math.PI / 6)) * 150,
                        opacity: [0.3, 0.8, 0.3],
                        scale: [0.8, 1.2, 0.8]
                      }}
                      transition={{
                        duration: 10,
                        delay: i * 0.2,
                        repeat: Infinity,
                        ease: "linear"
                      }}
                    />
                  ))}
                </div>
                
                {/* Bottom reflective surface */}
                <div className="absolute -bottom-12 w-80 h-4 bg-gold/10 blur-xl rounded-full"></div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
