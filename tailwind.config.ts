import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  safelist: [
    // Primary colors
    'text-blue-600', 'bg-blue-600', 'hover:bg-blue-700', 'border-blue-600', 'hover:border-blue-600', 'text-blue-800', 'bg-blue-50', 'bg-blue-500', 'bg-blue-700', 'bg-blue-100', 'bg-blue-800', 'border-4', 'border-blue-600', 'bg-blue-600/30',
    
    // Emerald (Animals) 
    'text-emerald-600', 'bg-emerald-600', 'hover:bg-emerald-700', 'border-emerald-600', 'hover:border-emerald-600', 'text-emerald-800', 'bg-emerald-50', 'bg-emerald-500', 'bg-emerald-700', 'bg-emerald-100', 'bg-emerald-800', 'border-emerald-600', 'bg-emerald-600/30',
    
    // Violet (Movies)
    'text-violet-600', 'bg-violet-600', 'hover:bg-violet-700', 'border-violet-600', 'hover:border-violet-600', 'text-violet-800', 'bg-violet-50', 'bg-violet-500', 'bg-violet-700', 'bg-violet-100', 'bg-violet-800', 'border-violet-600', 'bg-violet-600/30',
    
    // Orange (Books)
    'text-orange-600', 'bg-orange-600', 'hover:bg-orange-700', 'border-orange-600', 'hover:border-orange-600', 'text-orange-800', 'bg-orange-50', 'bg-orange-500', 'bg-orange-700', 'bg-orange-100', 'bg-orange-800', 'border-orange-600', 'bg-orange-600/30',
    
    // Fuchsia (Musicians)
    'text-fuchsia-600', 'bg-fuchsia-600', 'hover:bg-fuchsia-700', 'border-fuchsia-600', 'hover:border-fuchsia-600', 'text-fuchsia-800', 'bg-fuchsia-50', 'bg-fuchsia-500', 'bg-fuchsia-700', 'bg-fuchsia-100', 'bg-fuchsia-800', 'border-fuchsia-600', 'bg-fuchsia-600/30',
    
    // Red (Athletes)
    'text-red-600', 'bg-red-600', 'hover:bg-red-700', 'border-red-600', 'hover:border-red-600', 'text-red-800', 'bg-red-50', 'bg-red-500', 'bg-red-700', 'bg-red-100', 'bg-red-800', 'border-red-600', 'bg-red-600/30',
    
    // Amber (History)
    'text-amber-500', 'bg-amber-500', 'hover:bg-amber-600', 'border-amber-500', 'hover:border-amber-500', 'text-amber-700', 'bg-amber-50', 'bg-amber-400', 'bg-amber-600', 'bg-amber-100', 'bg-amber-700', 'border-amber-500', 'bg-amber-500/30',
    
    // Teal (Companies)
    'text-teal-500', 'bg-teal-500', 'hover:bg-teal-600', 'border-teal-500', 'hover:border-teal-500', 'text-teal-700', 'bg-teal-50', 'bg-teal-400', 'bg-teal-600', 'bg-teal-100', 'bg-teal-700', 'border-teal-500', 'bg-teal-500/30',
    
    // Indigo (TV Shows)
    'text-indigo-500', 'bg-indigo-500', 'hover:bg-indigo-600', 'border-indigo-500', 'hover:border-indigo-500', 'text-indigo-700', 'bg-indigo-50', 'bg-indigo-400', 'bg-indigo-600', 'bg-indigo-100', 'bg-indigo-700', 'border-indigo-500', 'bg-indigo-500/30',
  ],
  theme: {
    extend: {
      screens: {
        // Adding height-based screen breakpoints for responsive design
        'short': {'raw': '(max-height: 705px)'},
        'shorter': {'raw': '(max-height: 600px)'},
      },
      fontFamily: {
        display: ['var(--font-display)', 'sans-serif'],
        iceberg: ['var(--font-iceberg)', 'sans-serif'],
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        waveSlow: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' }
        },
        spinSlow: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' }
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        fadeOut: {
          '0%': { opacity: '1' },
          '100%': { opacity: '0' }
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' }
        },
        slideOutRight: {
          '0%': { transform: 'translateX(0)', opacity: '1' },
          '100%': { transform: 'translateX(100%)', opacity: '0' }
        },
        pulseDot: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' }
        },
        fadeInDelay: {
          '0%, 50%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'wave': 'wave 2s ease-in-out infinite',
        'wave-slow': 'waveSlow 3s ease-in-out infinite',
        'shake': 'shake 0.7s cubic-bezier(.36,.07,.19,.97) infinite',
        'wiggle': 'wiggle 0.6s ease-in-out infinite',
        'spin-slow': 'spinSlow 3s linear infinite',
        'bounce': 'bounce 0.5s infinite',
        'pulse': 'pulse 0.8s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fadeIn': 'fadeIn 0.3s ease-out forwards',
        'fadeOut': 'fadeOut 0.3s ease-in forwards',
        'slideInRight': 'slideInRight 0.3s ease-out forwards',
        'slideOutRight': 'slideOutRight 0.3s ease-in forwards',
        'pulse-dot': 'pulseDot 1.5s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out forwards',
        'fade-in-fast': 'fadeIn 0.3s ease-in-out forwards',
        'fade-in-slow': 'fadeIn 0.7s ease-in-out forwards',
        'fade-in-delay': 'fadeInDelay 1s ease-in-out forwards',
      },
      colors: {
        // Override gray colors to ensure they have no blue tint
        gray: {
          50: '#fafafa',
          100: '#f5f5f5',
          200: '#e5e5e5',
          300: '#d4d4d4',
          400: '#a3a3a3',
          500: '#737373',
          600: '#525252',
          700: '#404040',
          800: '#262626',
          900: '#171717',
          950: '#0a0a0a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
