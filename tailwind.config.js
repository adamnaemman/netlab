/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        terminal: {
          bg: '#0d1117',
          'bg-secondary': '#161b22',
          text: '#c9d1d9',
          prompt: '#58a6ff',
          success: '#3fb950',
          error: '#f85149',
          warning: '#d29922',
          border: '#30363d',
          muted: '#8b949e',
        }
      },
      fontFamily: {
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
      },
    },
  },
  plugins: [],
}
