import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: '#c9a84c',
          light: '#e8c97a',
          dark: '#7a5a1e',
          dim: 'rgba(201, 168, 76, 0.15)',
        },
        cream: '#f0e6d3',
        obsidian: '#0a0a0a',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', 'serif'],
        cormorant: ['"Cormorant Garamond"', 'serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      animation: {
        shimmer: 'shimmer 4s linear infinite',
        'rotate-slow': 'rotate 20s linear infinite',
        'rotate-slow-reverse': 'rotate 20s linear infinite reverse',
        'bounce-cue': 'bounceCue 2s ease-in-out infinite',
        sparkle: 'sparkle 2s ease-in-out infinite',
        'fade-up': 'fadeUp 0.6s ease forwards',
        'letter-reveal': 'letterReveal 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards',
      },
      keyframes: {
        shimmer: {
          to: { backgroundPosition: '200% center' },
        },
        bounceCue: {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0)' },
          '50%': { transform: 'translateX(-50%) translateY(8px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.1)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(30px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        letterReveal: {
          to: { opacity: '1', transform: 'translateY(0) rotate(0deg)' },
        },
      },
      backgroundImage: {
        'gold-foil': 'linear-gradient(135deg, #7a5a1e 0%, #c9a84c 25%, #f0e6d3 50%, #c9a84c 75%, #7a5a1e 100%)',
      },
    },
  },
  plugins: [],
}

export default config
