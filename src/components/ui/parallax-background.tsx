import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

interface ParallaxBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  overlayOpacity?: number;
  bgColor?: string;
  intensity?: number;
}

export function ParallaxBackground({
  children,
  className = "",
  overlayOpacity = 0.5,
  bgColor = "from-black via-[#0e0e10] to-[#0e0e10]",
  intensity = 0.1
}: ParallaxBackgroundProps) {
  const backgroundRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  const { scrollYProgress } = useScroll({
    target: backgroundRef,
    offset: ["start start", "end start"]
  });
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", `${intensity * 100}%`]);
  
  useEffect(() => {
    if (!backgroundRef.current) return;
    
    const handleParallax = () => {
      if (!backgroundRef.current || !contentRef.current) return;
      
      const scrollY = window.scrollY;
      const parallaxElements = backgroundRef.current.querySelectorAll('.parallax-element');
      
      parallaxElements.forEach((element, index) => {
        const speed = 0.05 + (index * 0.02);
        const yPos = scrollY * speed;
        (element as HTMLElement).style.transform = `translateY(${yPos}px)`;
      });
    };
    
    window.addEventListener('scroll', handleParallax);
    return () => window.removeEventListener('scroll', handleParallax);
  }, []);
  
  return (
    <div ref={backgroundRef} className={`relative overflow-hidden ${className}`}>
      {/* Parallax elements */}
      <motion.div
        className="absolute inset-0 w-full h-full"
        style={{ y }}
      >
        <div className="parallax-element absolute -top-[20%] -left-[10%] w-[80%] h-[80%] rounded-full bg-purple-500/5 blur-[120px]"></div>
        <div className="parallax-element absolute top-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-amber-500/5 blur-[100px]"></div>
        <div className="parallax-element absolute -bottom-[10%] left-[30%] w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[80px]"></div>
      </motion.div>
      
      {/* Background gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgColor} opacity-${Math.round(overlayOpacity * 10)}`}></div>
      
      {/* Content container */}
      <div ref={contentRef} className="relative z-10">
        {children}
      </div>
    </div>
  );
} 