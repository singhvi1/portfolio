/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0F1115',
          surface: '#171A21',
          border: '#262B36',
        },
        text: {
          primary: '#E6E8EB',
          muted: '#8B92A0',
        },
        accent: {
          DEFAULT: '#7C9EFF', // signature periwinkle — links, active states
          amber: '#F5C26B',   // learning highlights / tags
          green: '#4ADE80',   // "added" / shipped
          rose: '#F87171',    // "removed" / deprecated / challenges
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['"IBM Plex Sans"', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
    },
  },
  plugins: [],
}
