import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				rajdhani: ['Rajdhani', 'sans-serif'],
				orbitron: ['Orbitron', 'sans-serif'],
				sans: ['Inter', 'system-ui', 'sans-serif'],
				heading: ['Poppins', 'sans-serif'],
				mono: ['JetBrains Mono', 'monospace'],
				admin: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				gold: 'hsl(var(--gold))',
				'gold-foreground': 'hsl(var(--gold-foreground))',
				fire: 'hsl(var(--fire))',
				'fire-foreground': 'hsl(var(--fire-foreground))',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				'pulse-glow': {
					'0%, 100%': { 
						boxShadow: '0 0 10px 2px rgba(255, 215, 0, 0.7)' 
					},
					'50%': { 
						boxShadow: '0 0 20px 8px rgba(255, 69, 0, 0.7)' 
					},
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-8px)' },
				},
				'scale-fade-in': {
					'0%': { opacity: '0', transform: 'scale(0.9)' },
					'100%': { opacity: '1', transform: 'scale(1)' },
				},
				'fade-in': {
					'0%': { opacity: '0' },
					'100%': { opacity: '1' },
				},
				'fade-in-up': {
					'0%': { opacity: '0', transform: 'translateY(20px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' },
				},
				'text-glow': {
					'0%, 100%': { textShadow: '0 0 12px rgba(255, 215, 0, 0.8)' },
					'50%': { textShadow: '0 0 20px rgba(255, 69, 0, 0.8)' },
				},
				'gradient-x': {
					'0%': { backgroundPosition: '0% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'100%': { backgroundPosition: '0% 50%' },
				},
				'pulse-slow': {
					'0%, 100%': { opacity: '0.3' },
					'50%': { opacity: '0.4' },
				},
				'wave': {
					'0%': { transform: 'translateX(0)' },
					'50%': { transform: 'translateX(-2%)' },
					'100%': { transform: 'translateX(0)' },
				},
				'split-top': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(-100%)', opacity: '0' }
				},
				'split-bottom': {
					'0%': { transform: 'translateY(0)' },
					'100%': { transform: 'translateY(100%)', opacity: '0' }
				},
				'split-left': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-100%)', opacity: '0' }
				},
				'split-right': {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(100%)', opacity: '0' }
				},
				'rotate-slow': {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' }
				},
				'bounce-light': {
					'0%, 100%': { transform: 'translateY(0)', animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)' },
					'50%': { transform: 'translateY(-15%)', animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)' }
				},
				'shimmer': {
					'0%': { backgroundPosition: '-200% 0' },
					'100%': { backgroundPosition: '200% 0' }
				},
				'reveal-right': {
					'0%': { transform: 'scaleX(0)', transformOrigin: 'left' },
					'100%': { transform: 'scaleX(1)', transformOrigin: 'left' }
				},
				'reveal-left': {
					'0%': { transform: 'scaleX(0)', transformOrigin: 'right' },
					'100%': { transform: 'scaleX(1)', transformOrigin: 'right' }
				},
				'reveal-up': {
					'0%': { transform: 'scaleY(0)', transformOrigin: 'bottom' },
					'100%': { transform: 'scaleY(1)', transformOrigin: 'bottom' }
				},
				'reveal-down': {
					'0%': { transform: 'scaleY(0)', transformOrigin: 'top' },
					'100%': { transform: 'scaleY(1)', transformOrigin: 'top' }
				},
				'fade-in-left': {
					'0%': { opacity: '0', transform: 'translateX(-20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
				'fade-in-right': {
					'0%': { opacity: '0', transform: 'translateX(20px)' },
					'100%': { opacity: '1', transform: 'translateX(0)' }
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'pulse-glow': 'pulse-glow 2s infinite ease-in-out',
				'float': 'float 4s ease-in-out infinite',
				'scale-fade-in': 'scale-fade-in 0.5s ease-out forwards',
				'fade-in': 'fade-in 1s ease-out forwards',
				'fade-in-up': 'fade-in-up 0.8s ease-out forwards',
				'text-glow': 'text-glow 3s infinite ease-in-out',
				'gradient-x': 'gradient-x 5s ease infinite',
				'pulse-slow': 'pulse-slow 5s infinite ease-in-out',
				'float-staggered-1': 'float 4s ease-in-out 0s infinite',
				'float-staggered-2': 'float 4s ease-in-out 0.3s infinite',
				'float-staggered-3': 'float 4s ease-in-out 0.6s infinite',
				'float-staggered-4': 'float 4s ease-in-out 0.9s infinite',
				'wave': 'wave 10s ease-in-out infinite',
				'split-top': 'split-top 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
				'split-bottom': 'split-bottom 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
				'split-left': 'split-left 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
				'split-right': 'split-right 1s cubic-bezier(0.68, -0.55, 0.27, 1.55) forwards',
				'rotate-slow': 'rotate-slow 12s linear infinite',
				'bounce-light': 'bounce-light 1.5s infinite',
				'shimmer': 'shimmer 2s infinite linear',
				'reveal-right': 'reveal-right 0.8s ease-out forwards',
				'reveal-left': 'reveal-left 0.8s ease-out forwards',
				'reveal-up': 'reveal-up 0.8s ease-out forwards',
				'reveal-down': 'reveal-down 0.8s ease-out forwards',
				'fade-in-left': 'fade-in-left 0.8s ease-out forwards',
				'fade-in-right': 'fade-in-right 0.8s ease-out forwards',
			},
			backgroundImage: {
				'hero-pattern': "url('/hero-bg.jpg')",
				'gradient-fire': 'linear-gradient(135deg, #FF4500 0%, #FFD700 100%)',
				'gradient-dark': 'linear-gradient(to bottom, #0e0e10, #121215)',
				'gradient-gold': 'linear-gradient(to right, hsl(var(--gold)), hsl(var(--amber-500)))',
				'gradient-glow': 'radial-gradient(circle at center, hsl(var(--gold))/30%, transparent 70%)',
			},
			backdropBlur: {
				xs: '2px',
			},
			transitionProperty: {
				'width': 'width',
				'height': 'height',
				'spacing': 'margin, padding',
			},
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
