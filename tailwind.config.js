/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        pastelYellow: '#FDCD60',
        darkPurple: '#5546CB',
        pastelOrange: '#FF8859',
        pastelLightYellow: '#FEFAE0'
      },
    },
  },
  plugins: [],
}
