import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      boxShadow: {
        'liquid': '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
        'liquid-hover': '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
        'inner-light': 'inset 0 0 0 1px rgba(255, 255, 255, 0.4)',
      },
      backdropBlur: {
        'xs': '2px',
        '3xl': '64px',
        '4xl': '80px',
      },
      colors: {
        luxury: {
          50: '#F8FAFC',
          100: '#F1F5F9',
          200: '#E2E8F0',
          300: '#CBD5E1',
          400: '#94A3B8',
          500: '#64748B',
          600: '#475569',
          700: '#334155',
          800: '#1E293B',
          900: '#0F172A',
        },
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          300: '#7DD3FC',
          400: '#38BDF8',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          800: '#075985',
          900: '#0C4A6E',
        },
        status: {
          success: '#10B981',
          warning: '#F59E0B',
          error: '#EF4444',
          info: '#3B82F6',
        },
        glass: {
          100: 'rgba(255, 255, 255, 0.4)',
          200: 'rgba(255, 255, 255, 0.5)',
          300: 'rgba(255, 255, 255, 0.6)',
          400: 'rgba(255, 255, 255, 0.7)',
          500: 'rgba(255, 255, 255, 0.8)',
          card: 'rgba(255, 255, 255, 0.65)',
          stroke: 'rgba(255, 255, 255, 0.5)',
        },
        liquid: {
          surface: 'rgba(255, 255, 255, 0.45)',
          border: 'rgba(255, 255, 255, 0.5)',
          shine: 'rgba(255, 255, 255, 0.3)',
        }
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'mesh-flow': 'meshFlow 20s ease-in-out infinite alternate',
      },
      keyframes: {
        meshFlow: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        }
      },
    },
    plugins: [],
  },
}

export default config
