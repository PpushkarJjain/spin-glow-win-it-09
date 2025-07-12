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
				poppins: ['Poppins', 'sans-serif'],
				playfair: ['Playfair Display', 'serif'],
			},
			colors: {
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
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				spinner: {
					green: 'hsl(var(--spinner-green))',
					gold: 'hsl(var(--spinner-gold))',
					purple: 'hsl(var(--spinner-purple))',
					blue: 'hsl(var(--spinner-blue))',
				},
			},
			backgroundImage: {
				'gradient-primary': 'var(--gradient-primary)',
				'gradient-secondary': 'var(--gradient-secondary)',
				'gradient-festive': 'var(--gradient-festive)',
				'gradient-metallic': 'var(--gradient-metallic)',
				'gradient-gold': 'var(--gradient-gold)',
				'gradient-radial': 'radial-gradient(circle, var(--tw-gradient-stops))',
				'gradient-conic': 'conic-gradient(var(--tw-gradient-stops))',
				'noise-texture': 'var(--noise-texture)',
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'festive': 'var(--shadow-festive)',
				'metallic': 'var(--shadow-metallic)',
				'wheel': 'var(--shadow-wheel)',
				'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.1)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'sparkle': {
					'0%, 100%': { 
						transform: 'translateY(0px) rotate(0deg)', 
						opacity: '1' 
					},
					'25%': { 
						transform: 'translateY(-10px) rotate(90deg)', 
						opacity: '0.8' 
					},
					'50%': { 
						transform: 'translateY(-5px) rotate(180deg)', 
						opacity: '1' 
					},
					'75%': { 
						transform: 'translateY(-15px) rotate(270deg)', 
						opacity: '0.6' 
					}
				},
				'glow-pulse': {
					'0%': { 
						boxShadow: 'var(--shadow-glow)',
						transform: 'scale(1)' 
					},
					'100%': { 
						boxShadow: 'var(--shadow-glow), 0 0 60px hsl(var(--primary) / 0.8)',
						transform: 'scale(1.02)' 
					}
				},
				'float': {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'spin-decelerate': {
					'0%': { 
						transform: 'rotate(0deg)',
						animationTimingFunction: 'cubic-bezier(0.17, 0.67, 0.12, 0.99)'
					},
					'100%': { 
						transform: 'rotate(var(--final-rotation, 1800deg))' 
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'sparkle': 'sparkle 8s linear infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite alternate',
				'float': 'float 3s ease-in-out infinite',
				'spin-decelerate': 'spin-decelerate 3s cubic-bezier(0.17, 0.67, 0.12, 0.99) forwards',
				'spin-slow': 'spin 20s linear infinite',
			},
			transitionDuration: {
				'3000': '3000ms',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
