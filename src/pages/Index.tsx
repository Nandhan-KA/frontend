import { useState, useEffect, useRef } from 'react';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import About from '@/components/About';
import Events from '@/components/Events';
import Schedule from '@/components/Schedule';
import Contact from '@/components/Contact';
import Footer from '@/components/Footer';
import Sponsors from '@/components/Sponsors';
import { GlowingParticles } from '@/components/ui/particles';
import { FloatingOrbs } from '@/components/ui/animated-elements';
import { motion, useScroll, useSpring, useTransform } from 'framer-motion';

const Index = () => {
  const [activeSection, setActiveSection] = useState<string>('hero');
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  // 3D cursor effect
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // For the animated gradient background
  const gradientOpacity = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.4, 0.2, 0.1]
  );

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'events', 'sponsors', 'schedule', 'contact'];
      const currentPosition = window.scrollY + 300;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (
            currentPosition >= offsetTop &&
            currentPosition < offsetTop + offsetHeight
          ) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Handle mouse move for 3D effect
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setMousePosition({
          x: e.clientX - rect.left - rect.width / 2,
          y: e.clientY - rect.top - rect.height / 2
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // Quick scroll to top button that appears after scrolling
  const [showScrollToTop, setShowScrollToTop] = useState(false);

  useEffect(() => {
    const handleScrollVisibility = () => {
      setShowScrollToTop(window.scrollY > 700);
    };

    window.addEventListener('scroll', handleScrollVisibility);
    return () => window.removeEventListener('scroll', handleScrollVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div ref={containerRef} className="min-h-screen bg-gradient-dark text-white relative overflow-hidden">
      {/* Progress bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-gold z-50 origin-left"
        style={{ scaleX }}
      />

      {/* Enhanced animated background gradient */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        style={{ opacity: gradientOpacity }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-purple-900/30 via-black to-amber-900/30 animate-gradient-slow"></div>
      </motion.div>

      {/* Spotlight effect that follows cursor */}
      <motion.div 
        className="fixed inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x + window.innerWidth / 2}px ${mousePosition.y + window.innerHeight / 2}px, rgba(255,215,0,0.07), transparent 40%)`,
        }}
      />

      {/* Background particles for hero section */}
      <div className="fixed inset-0 pointer-events-none">
        <GlowingParticles className="opacity-40" />
      </div>
      
      {/* Navigation */}
      <Navbar />
      
      {/* Page Content */}
      <main>
        <section id="hero">
          <Hero />
        </section>
        
        <section id="about">
          <About />
        </section>
        
        <section id="events" className="relative">
          <FloatingOrbs />
          <Events />
        </section>
        
        <section id="sponsors">
          <Sponsors />
        </section>
        
        <section id="schedule">
          <Schedule />
        </section>
        
        <section id="contact">
          <Contact />
        </section>
      </main>
      
      <Footer />
      
      {/* Enhanced scroll to top button with pulse effect */}
      <motion.button
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ 
          opacity: showScrollToTop ? 1 : 0,
          scale: showScrollToTop ? 1 : 0.5
        }}
        className="fixed bottom-8 right-8 bg-gold text-black p-3 rounded-full shadow-lg shadow-black/20 hover:bg-amber-400 transition-colors z-40 relative"
        onClick={scrollToTop}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="m18 15-6-6-6 6"/>
        </svg>
        <span className="absolute inset-0 rounded-full animate-ping bg-gold/40"></span>
      </motion.button>
      
      {/* Section indicator for mobile */}
      <div className="fixed bottom-16 left-1/2 transform -translate-x-1/2 bg-black/70 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium z-30 md:hidden">
        {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
      </div>
    </div>
  );
};

export default Index;
