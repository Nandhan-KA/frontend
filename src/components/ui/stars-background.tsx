import React from 'react';

interface StarsBackgroundProps {
  className?: string;
  opacity?: number;
}

const StarsBackground: React.FC<StarsBackgroundProps> = ({ 
  className = "", 
  opacity = 0.4 
}) => {
  return (
    <div className={`absolute inset-0 z-0 overflow-hidden pointer-events-none ${className}`}>
      <div className="stars-container" style={{ opacity }}></div>
    </div>
  );
};

export default StarsBackground; 