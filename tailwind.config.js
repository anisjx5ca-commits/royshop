module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Cyberpunk Neon Palette - Pink & Blue
        'neon-pink': '#FF006E',
        'neon-purple': '#B800E8',
        'neon-blue': '#00D9FF',
        'neon-cyan': '#00F0FF',
        'neon-magenta': '#FF0080',
        'neon-black': '#0a0e27',
        'neon-white': '#ffffff',
        'neon-green': '#00FF41',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        '128': '32rem',
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-in',
        slideUp: 'slideUp 0.5s ease-out',
        slideDown: 'slideDown 0.5s ease-out',
        pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        glow: 'glow 3s ease-in-out infinite',
        neonFlicker: 'neonFlicker 0.15s infinite',
        float: 'float 6s ease-in-out infinite',
        shimmer: 'shimmer 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        glow: {
          '0%, 100%': { 
            textShadow: '0 0 10px #FF006E, 0 0 20px #FF006E, 0 0 30px #FF006E, 0 0 40px #FF006E, 0 0 70px #FF006E',
            boxShadow: '0 0 10px #FF006E, 0 0 20px #FF006E, 0 0 30px #FF006E, 0 0 40px #FF006E'
          },
          '50%': { 
            textShadow: '0 0 5px #00D9FF, 0 0 10px #00D9FF, 0 0 15px #00D9FF, 0 0 20px #00D9FF',
            boxShadow: '0 0 5px #00D9FF, 0 0 10px #00D9FF, 0 0 15px #00D9FF, 0 0 20px #00D9FF'
          },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '200% center' },
          '100%': { backgroundPosition: '-200% center' },
        },
      },
      boxShadow: {
        'neon-pink': '0 0 20px #FF006E, 0 0 40px #FF006E, 0 0 60px #FF006E',
        'neon-blue': '0 0 20px #00D9FF, 0 0 40px #00D9FF, 0 0 60px #00D9FF',
        'neon-mixed': '0 0 20px #FF006E, 0 0 40px #00D9FF, 0 0 60px #FF006E',
        'bloom': '0 0 40px #FF006E, 0 0 80px #00D9FF, 0 0 120px #B800E8',
      },
      backgroundImage: {
        'gradient-neon': 'linear-gradient(135deg, #00D9FF 0%, #FF006E 100%)',
        'gradient-pink-purple': 'linear-gradient(135deg, #FF006E 0%, #B800E8 100%)',
      },
    },
  },
  plugins: [],
}
