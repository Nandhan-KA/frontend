import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon, Laptop } from 'lucide-react';

type Theme = 'light' | 'dark' | 'system';

export function ThemeSwitch() {
  const [theme, setTheme] = useState<Theme>(() => {
    // Get theme from localStorage or default to system
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      return savedTheme || 'system';
    }
    return 'system';
  });

  useEffect(() => {
    // Apply theme to document
    if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    
    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const handleThemeChange = (newTheme: Theme) => {
    setTheme(newTheme);
  };

  // System preference listener
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handleChange = () => {
        if (mediaQuery.matches) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  return (
    <div className="flex p-1 bg-black/70 backdrop-blur-md rounded-full gap-1">
      {[
        { value: 'light', icon: <Sun size={16} /> },
        { value: 'dark', icon: <Moon size={16} /> },
        { value: 'system', icon: <Laptop size={16} /> }
      ].map(option => (
        <button
          key={option.value}
          onClick={() => handleThemeChange(option.value as Theme)}
          className="relative px-2 py-1.5 rounded-full transition-colors flex items-center justify-center"
          aria-label={`Switch to ${option.value} theme`}
        >
          {theme === option.value && (
            <motion.div
              layoutId="theme-switch-indicator"
              className="absolute inset-0 bg-gold rounded-full"
              transition={{ type: "spring", duration: 0.5 }}
            />
          )}
          <span className={`relative z-10 ${theme === option.value ? 'text-black' : 'text-white'}`}>
            {option.icon}
          </span>
        </button>
      ))}
    </div>
  );
} 