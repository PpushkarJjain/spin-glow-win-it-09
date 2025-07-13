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
				'gradient-golden': 'var(--gradient-golden)',
				'gradient-metallic': 'var(--gradient-metallic)',
			},
			boxShadow: {
				'glow': 'var(--shadow-glow)',
				'festive': 'var(--shadow-festive)',
				'golden': 'var(--shadow-golden)',
				'metallic': 'var(--shadow-metallic)',
				'glow-pulse': 'var(--glow-pulse)',
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
				'sparkle-float': {
					'0%': { 
						opacity: '0', 
						transform: 'translateY(100px) scale(0)' 
					},
					'15%': { 
						opacity: '1', 
						transform: 'translateY(0) scale(1)' 
					},
					'85%': { 
						opacity: '1', 
						transform: 'translateY(-20px) scale(1)' 
					},
					'100%': { 
						opacity: '0', 
						transform: 'translateY(-100px) scale(0)' 
					}
				},
				'glow-pulse': {
					'0%, 100%': { 
						boxShadow: 'var(--shadow-golden)' 
					},
					'50%': { 
						boxShadow: 'var(--glow-pulse)' 
					}
				},
				'rotate-golden': {
					'from': { 
						transform: 'rotate(0deg)' 
					},
					'to': { 
						transform: 'rotate(360deg)' 
					}
				},
				'spin-decelerate': {
					'0%': { 
						transform: 'rotate(0deg)' 
					},
					'100%': { 
						transform: 'rotate(var(--final-rotation, 3600deg))' 
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'sparkle-float': 'sparkle-float 3s ease-in-out infinite',
				'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
				'rotate-golden': 'rotate-golden 20s linear infinite',
				'spin-decelerate': 'spin-decelerate 4s cubic-bezier(0.23, 1, 0.320, 1) forwards',
			},
			transitionDuration: {
				'3000': '3000ms',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
