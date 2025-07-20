import type { Config } from 'tailwindcss'

export default {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        body: ['Inter', 'Poppins', 'sans-serif'],
        headline: ['Space Grotesk', 'Poppins', 'Inter', 'sans-serif'],
        code: ['Fira Code', 'Source Code Pro', 'monospace'],
        game: ['Orbitron', 'Space Grotesk', 'sans-serif'],
      },
      colors: {
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          '1': 'hsl(var(--chart-1))',
          '2': 'hsl(var(--chart-2))',
          '3': 'hsl(var(--chart-3))',
          '4': 'hsl(var(--chart-4))',
          '5': 'hsl(var(--chart-5))',
        },
        sidebar: {
          DEFAULT: 'hsl(var(--sidebar-background))',
          foreground: 'hsl(var(--sidebar-foreground))',
          primary: 'hsl(var(--sidebar-primary))',
          'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
          accent: 'hsl(var(--sidebar-accent))',
          'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
          border: 'hsl(var(--sidebar-border))',
          ring: 'hsl(var(--sidebar-ring))',
        },
        // Gamification Colors
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
        },
        achievement: {
          bronze: 'hsl(var(--achievement-bronze))',
          silver: 'hsl(var(--achievement-silver))',
          gold: 'hsl(var(--achievement-gold))',
          diamond: 'hsl(var(--achievement-diamond))',
        },
        level: {
          beginner: 'hsl(var(--level-beginner))',
          intermediate: 'hsl(var(--level-intermediate))',
          advanced: 'hsl(var(--level-advanced))',
          expert: 'hsl(var(--level-expert))',
        },
        xp: {
          DEFAULT: 'hsl(var(--xp))',
          foreground: 'hsl(var(--xp-foreground))',
        },
        neon: {
          cyan: 'hsl(var(--neon-cyan))',
          purple: 'hsl(var(--neon-purple))',
          green: 'hsl(var(--neon-green))',
          pink: 'hsl(var(--neon-pink))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: {
            height: '0',
          },
          to: {
            height: 'var(--radix-accordion-content-height)',
          },
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)',
          },
          to: {
            height: '0',
          },
        },
        'glow-pulse': {
          '0%, 100%': {
            boxShadow: '0 0 5px currentColor',
            opacity: '1',
          },
          '50%': {
            boxShadow: '0 0 20px currentColor, 0 0 30px currentColor',
            opacity: '0.8',
          },
        },
        'level-up': {
          '0%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 currentColor',
          },
          '50%': {
            transform: 'scale(1.05)',
            boxShadow: '0 0 0 10px transparent',
          },
          '100%': {
            transform: 'scale(1)',
            boxShadow: '0 0 0 0 transparent',
          },
        },
        'achievement-bounce': {
          '0%, 20%, 50%, 80%, 100%': {
            transform: 'translateY(0)',
          },
          '40%': {
            transform: 'translateY(-8px)',
          },
          '60%': {
            transform: 'translateY(-4px)',
          },
        },
        'neon-flicker': {
          '0%, 100%': {
            textShadow:
              '0 0 5px currentColor, 0 0 10px currentColor, 0 0 15px currentColor',
          },
          '50%': {
            textShadow:
              '0 0 2px currentColor, 0 0 5px currentColor, 0 0 8px currentColor',
          },
        },
        'progress-fill': {
          '0%': {
            width: '0%',
          },
          '100%': {
            width: '100%',
          },
        },
        sparkle: {
          '0%, 100%': {
            transform: 'scale(0) rotate(0deg)',
            opacity: '0',
          },
          '50%': {
            transform: 'scale(1) rotate(180deg)',
            opacity: '1',
          },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'level-up': 'level-up 0.6s ease-out',
        'achievement-bounce': 'achievement-bounce 1s ease-in-out',
        'neon-flicker': 'neon-flicker 1.5s ease-in-out infinite alternate',
        'progress-fill': 'progress-fill 1s ease-out forwards',
        sparkle: 'sparkle 1.5s ease-in-out infinite',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config
