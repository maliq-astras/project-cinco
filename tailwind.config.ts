import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    // Primary colors
    'text-blue-600', 'bg-blue-600', 'hover:bg-blue-700', 'border-blue-600', 'text-blue-800', 'bg-blue-50', 'bg-blue-500', 'bg-blue-700', 'bg-blue-100', 'bg-blue-800', 'border-4', 'border-blue-600', 'bg-blue-600/30',
    
    // Emerald (Animals) 
    'text-emerald-600', 'bg-emerald-600', 'hover:bg-emerald-700', 'border-emerald-600', 'text-emerald-800', 'bg-emerald-50', 'bg-emerald-500', 'bg-emerald-700', 'bg-emerald-100', 'bg-emerald-800', 'border-emerald-600', 'bg-emerald-600/30',
    
    // Violet (Movies)
    'text-violet-600', 'bg-violet-600', 'hover:bg-violet-700', 'border-violet-600', 'text-violet-800', 'bg-violet-50', 'bg-violet-500', 'bg-violet-700', 'bg-violet-100', 'bg-violet-800', 'border-violet-600', 'bg-violet-600/30',
    
    // Orange (Books)
    'text-orange-600', 'bg-orange-600', 'hover:bg-orange-700', 'border-orange-600', 'text-orange-800', 'bg-orange-50', 'bg-orange-500', 'bg-orange-700', 'bg-orange-100', 'bg-orange-800', 'border-orange-600', 'bg-orange-600/30',
    
    // Fuchsia (Musical Artists)
    'text-fuchsia-600', 'bg-fuchsia-600', 'hover:bg-fuchsia-700', 'border-fuchsia-600', 'text-fuchsia-800', 'bg-fuchsia-50', 'bg-fuchsia-500', 'bg-fuchsia-700', 'bg-fuchsia-100', 'bg-fuchsia-800', 'border-fuchsia-600', 'bg-fuchsia-600/30',
    
    // Red (Athletes)
    'text-red-600', 'bg-red-600', 'hover:bg-red-700', 'border-red-600', 'text-red-800', 'bg-red-50', 'bg-red-500', 'bg-red-700', 'bg-red-100', 'bg-red-800', 'border-red-600', 'bg-red-600/30',
    
    // Amber (Historical Figures)
    'text-amber-500', 'bg-amber-500', 'hover:bg-amber-600', 'border-amber-500', 'text-amber-700', 'bg-amber-50', 'bg-amber-400', 'bg-amber-600', 'bg-amber-100', 'bg-amber-700', 'border-amber-500', 'bg-amber-500/30',
    
    // Teal (Famous Brands)
    'text-teal-500', 'bg-teal-500', 'hover:bg-teal-600', 'border-teal-500', 'text-teal-700', 'bg-teal-50', 'bg-teal-400', 'bg-teal-600', 'bg-teal-100', 'bg-teal-700', 'border-teal-500', 'bg-teal-500/30',
    
    // Indigo (TV Shows)
    'text-indigo-500', 'bg-indigo-500', 'hover:bg-indigo-600', 'border-indigo-500', 'text-indigo-700', 'bg-indigo-50', 'bg-indigo-400', 'bg-indigo-600', 'bg-indigo-100', 'bg-indigo-700', 'border-indigo-500', 'bg-indigo-500/30',
  ],
  theme: {
    extend: {
      fontFamily: {
        game: ['var(--font-game)', 'sans-serif'],
        display: ['var(--font-display)', 'sans-serif'],
        iceberg: ['var(--font-iceberg)', 'sans-serif'],
      },
      keyframes: {
        wave: {
          '0%': { transform: 'translateX(-100%)' },
          '50%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(100%)' }
        },
        waveSlow: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-4px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(4px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        bounce: {
          '0%, 100%': { 
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)'
          },
          '50%': { 
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)'
          },
        },
        pulse: {
          '0%, 100%': { opacity: '1', transform: 'scale(1)' },
          '50%': { opacity: '.7', transform: 'scale(0.95)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeOut: {
          '0%': { opacity: '1', transform: 'translateY(0)' },
          '100%': { opacity: '0', transform: 'translateY(-10px)' },
        }
      },
      animation: {
        'wave': 'wave 2s ease-in-out infinite',
        'wave-slow': 'waveSlow 3s ease-in-out infinite',
        'shake': 'shake 0.7s cubic-bezier(.36,.07,.19,.97) infinite',
        'wiggle': 'wiggle 0.6s ease-in-out infinite',
        'bounce': 'bounce 0.5s infinite',
        'pulse': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'fadeOut': 'fadeOut 0.3s ease-in forwards',
      }
    },
  },
  plugins: [],
};

export default config;
