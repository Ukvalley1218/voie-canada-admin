/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          blue: '#1E3A8A',
          red: '#D32F2F',
        },
        secondary: {
          white: '#FFFFFF',
          gray: '#F5F5F5',
          green: '#2E7D32',
        },
        accent: {
          gold: '#FFC107',
          sky: '#64B5F6',
        },
        text: {
          dark: '#1F2937',
          muted: '#6B7280',
          light: '#9CA3AF',
        },
        admin: {
          sidebar: '#1F2937',
          sidebarHover: '#374151',
          card: '#FFFFFF',
          border: '#E5E7EB',
        }
      },
      fontFamily: {
        heading: ['Montserrat', 'sans-serif'],
        body: ['Lato', 'sans-serif'],
      },
    },
  },
  plugins: [],
}