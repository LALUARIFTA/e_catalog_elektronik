tailwind.config = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'sans-serif'],
      },
      colors: {
        brand: {
          navy: '#11224D',
          navyHover: '#1B3168',
          teal: '#1A88B8',
          mint: '#5FD39D',
          lime: '#E2F952',
          ice: '#DCF0FF',
          shell: '#F3F5F8',
          outer: '#E2E6EC',
          card: '#FFFFFF',
          muted: '#64748B',
          border: '#E5E9F0'
        }
      },
      animation: {
        'fadeIn': 'fadeIn 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'slideUp': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'pulseSlow': 'pulse 3s infinite',
        'spinSlow': 'spin 12s linear infinite'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        }
      }
    }
  }
}
