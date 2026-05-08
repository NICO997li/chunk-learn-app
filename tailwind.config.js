/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // 主品牌色 - 活力珊瑚橙
        primary: '#FF6B6B',
        primaryDark: '#FF4757',
        // 辅助色 - 清新薄荷绿
        secondary: '#4ECDC4',
        secondaryDark: '#26C6B5',
        // 强调色 - 温暖琥珀黄
        accent: '#FFE66D',
        accentDark: '#FFD93D',
        // 行动色 - 鲜活紫罗兰
        cta: '#A78BFA',
        ctaDark: '#8B5CF6',
        // 背景色 - 奶油白
        background: '#FFFAF5',
        backgroundAlt: '#FFF0E5',
        // 文字色 - 深邃午夜蓝
        textPrimary: '#2D3142',
        textSecondary: '#5C6B7E',
        // 装饰色
        coral: '#FF8E72',
        peach: '#FFB4A2',
        sky: '#A8DADC',
        lavender: '#C8B6FF',
      },
      fontFamily: {
        heading: ['"Plus Jakarta Sans"', '"PingFang SC"', 'system-ui', 'sans-serif'],
        body: ['"Plus Jakarta Sans"', '"PingFang SC"', 'system-ui', 'sans-serif'],
        display: ['"Fraunces"', '"Plus Jakarta Sans"', 'serif'],
      },
      borderRadius: {
        'clay': '20px',
        'clay-lg': '28px',
        'clay-xl': '36px',
      },
      boxShadow: {
        'clay': '0 8px 24px rgba(255, 107, 107, 0.12), 0 2px 6px rgba(0, 0, 0, 0.04)',
        'clay-lg': '0 16px 40px rgba(255, 107, 107, 0.18), 0 4px 12px rgba(0, 0, 0, 0.06)',
        'clay-pressed': 'inset 2px 2px 6px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
        'glow-primary': '0 0 32px rgba(255, 107, 107, 0.35)',
        'glow-secondary': '0 0 32px rgba(78, 205, 196, 0.35)',
        'glow-accent': '0 0 32px rgba(255, 230, 109, 0.45)',
        'soft': '0 4px 16px rgba(45, 49, 66, 0.06)',
      },
      backgroundImage: {
        'gradient-warm': 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
        'gradient-cool': 'linear-gradient(135deg, #4ECDC4 0%, #A78BFA 100%)',
        'gradient-sunset': 'linear-gradient(135deg, #FF6B6B 0%, #FF8E72 50%, #FFE66D 100%)',
        'gradient-ocean': 'linear-gradient(135deg, #4ECDC4 0%, #6BCBE7 100%)',
        'gradient-purple': 'linear-gradient(135deg, #A78BFA 0%, #C8B6FF 100%)',
        'gradient-bg': 'linear-gradient(180deg, #FFFAF5 0%, #FFF0E5 100%)',
        'gradient-mesh': 'radial-gradient(at 20% 0%, rgba(255, 107, 107, 0.15) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(78, 205, 196, 0.12) 0px, transparent 50%), radial-gradient(at 0% 100%, rgba(167, 139, 250, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(255, 230, 109, 0.15) 0px, transparent 50%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'float-slow': 'float 8s ease-in-out infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'bounce-soft': 'bounceSoft 2s ease-in-out infinite',
        'shimmer': 'shimmer 3s linear infinite',
        'fade-in-up': 'fadeInUp 0.5s ease-out',
        'pop': 'pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pop: {
          '0%': { transform: 'scale(0.8)', opacity: '0' },
          '50%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
