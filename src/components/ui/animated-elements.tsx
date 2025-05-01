import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface AnimatedContainerProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  once?: boolean;
}

export const FadeIn = ({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.5,
  once = true
}: AnimatedContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration, delay }}
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const FadeInUp = ({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.5,
  once = true
}: AnimatedContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const FadeInLeft = ({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.5,
  once = true
}: AnimatedContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration, delay }}
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const FadeInRight = ({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.5,
  once = true
}: AnimatedContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration, delay }}
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const ScaleIn = ({ 
  children, 
  className = "", 
  delay = 0, 
  duration = 0.5,
  once = true 
}: AnimatedContainerProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration, delay }}
      viewport={{ once }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerContainer = ({ 
  children, 
  className = "",
  delay = 0.1,
  staggerChildren = 0.1,
  once = true
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  staggerChildren?: number;
  once?: boolean;
}) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once }}
      variants={{
        visible: {
          opacity: 1,
          transition: {
            delay,
            staggerChildren,
          },
        },
        hidden: {
          opacity: 0,
        },
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const StaggerItem = ({ 
  children, 
  className = "",
  index = 0,
  type = "fade"
}: {
  children: ReactNode;
  className?: string;
  index?: number;
  type?: "fade" | "up" | "scale" | "left" | "right";
}) => {
  const variants = {
    fade: {
      hidden: { opacity: 0 },
      visible: { opacity: 1 },
    },
    up: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    scale: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    left: {
      hidden: { opacity: 0, x: -20 },
      visible: { opacity: 1, x: 0 },
    },
    right: {
      hidden: { opacity: 0, x: 20 },
      visible: { opacity: 1, x: 0 },
    }
  };

  return (
    <motion.div
      variants={variants[type]}
      transition={{
        duration: 0.5,
        ease: "easeOut",
        delay: index * 0.1
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const AnimatedBackground = ({ className = "" }: { className?: string }) => {
  return (
    <div className={`absolute inset-0 overflow-hidden opacity-10 pointer-events-none ${className}`}>
      <div className="absolute top-0 left-[10%] w-72 h-72 bg-gold/20 rounded-full mix-blend-screen filter blur-[100px] animate-float-staggered-1"></div>
      <div className="absolute bottom-[20%] right-[5%] w-64 h-64 bg-amber-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-float-staggered-2"></div>
      <div className="absolute top-[40%] right-[20%] w-40 h-40 bg-orange-500/20 rounded-full mix-blend-screen filter blur-[100px] animate-float-staggered-3"></div>
    </div>
  );
};

export const FloatingOrbs = () => {
  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="absolute top-[10%] left-[5%] w-64 h-64 rounded-full bg-purple-500/10 blur-3xl animate-float-staggered-1"></div>
      <div className="absolute bottom-[30%] right-[15%] w-96 h-96 rounded-full bg-gold/10 blur-3xl animate-float-staggered-2"></div>
      <div className="absolute top-[40%] right-[10%] w-40 h-40 rounded-full bg-red-500/10 blur-3xl animate-float-staggered-3"></div>
    </div>
  );
};

export const ShimmerButton = ({
  children,
  className = "",
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      className={`relative overflow-hidden bg-gold text-black rounded-full px-6 py-3 font-bold hover:scale-105 transition-transform ${className}`}
    >
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-0 w-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-shimmer"></span>
    </button>
  );
}; 