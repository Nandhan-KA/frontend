import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface ParticlesProps {
  className?: string;
  quantity?: number;
  staticity?: number;
  ease?: number;
  refresh?: boolean;
  color?: string;
  particleColor?: string;
  particleSize?: number;
  speed?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'mixed';
}

export function Particles({
  className = "",
  quantity = 30,
  staticity = 50,
  ease = 50,
  refresh = false,
  color = "#ffd700",
  particleColor = "#ffd700",
  particleSize = 2,
  speed = 1,
  direction = 'mixed'
}: ParticlesProps) {
  const [particles, setParticles] = useState<{ x: number; y: number; vx: number; vy: number; opacity: number; size: number; color: string }[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const rafRef = useRef<number>(0);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const observer = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      initParticles(width, height);
    });
    
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [refresh, quantity]);

  useEffect(() => {
    if (!containerRef.current) return;
    
    const animate = () => {
      if (!containerRef.current) return;
      
      const rect = containerRef.current.getBoundingClientRect();
      const { width, height } = rect;
      
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          const newPositionX = particle.x + particle.vx * speed;
          const newPositionY = particle.y + particle.vy * speed;
          
          // Handle boundaries and redraw particles that exit the container
          let updatedX = newPositionX;
          let updatedY = newPositionY;
          let updatedVx = particle.vx;
          let updatedVy = particle.vy;
          
          if (newPositionX < 0 || newPositionX > width) {
            updatedX = Math.random() * width;
            updatedY = direction === 'up' ? height : (direction === 'down' ? 0 : updatedY);
          }
          
          if (newPositionY < 0 || newPositionY > height) {
            updatedY = Math.random() * height;
            updatedX = direction === 'left' ? width : (direction === 'right' ? 0 : updatedX);
          }
          
          return {
            ...particle,
            x: updatedX,
            y: updatedY,
            vx: updatedVx,
            vy: updatedVy
          };
        })
      );
      
      rafRef.current = requestAnimationFrame(animate);
    };
    
    rafRef.current = requestAnimationFrame(animate);
    
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [particles, speed, direction]);

  const initParticles = (width: number, height: number) => {
    const newParticles = [];
    for (let i = 0; i < quantity; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      let vx = 0;
      let vy = 0;
      
      // Set velocity based on direction
      switch (direction) {
        case 'up':
          vx = (Math.random() - 0.5) * 0.2;
          vy = -(0.3 + Math.random() * 0.5);
          break;
        case 'down':
          vx = (Math.random() - 0.5) * 0.2;
          vy = 0.3 + Math.random() * 0.5;
          break;
        case 'left':
          vx = -(0.3 + Math.random() * 0.5);
          vy = (Math.random() - 0.5) * 0.2;
          break;
        case 'right':
          vx = 0.3 + Math.random() * 0.5;
          vy = (Math.random() - 0.5) * 0.2;
          break;
        case 'mixed':
        default:
          vx = Math.random() - 0.5;
          vy = Math.random() - 0.5;
          break;
      }
      
      newParticles.push({
        x,
        y,
        vx: vx / staticity,
        vy: vy / staticity,
        opacity: Math.random(),
        size: particleSize * Math.random() * 3,
        color: particleColor
      });
    }
    setParticles(newParticles);
  };

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}
    >
      {particles.map((particle, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full"
          style={{
            x: particle.x,
            y: particle.y,
            width: particle.size,
            height: particle.size,
            backgroundColor: particle.color,
            opacity: particle.opacity,
          }}
          animate={{
            opacity: [particle.opacity, particle.opacity * 0.8, particle.opacity],
          }}
          transition={{
            duration: 2 + Math.random() * 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
}

export function GlowingParticles({ className = "" }: { className?: string }) {
  return (
    <Particles
      className={className}
      quantity={40}
      staticity={30}
      color="#ffb700"
      particleColor="#ffb700"
      particleSize={3}
      ease={100}
      speed={0.5}
      direction="up"
    />
  );
}

export function SnowEffect({ className = "" }: { className?: string }) {
  return (
    <Particles
      className={className}
      quantity={100}
      staticity={100}
      color="#ffffff"
      particleColor="#ffffff"
      particleSize={1.5}
      ease={30}
      speed={0.4}
      direction="down"
    />
  );
} 