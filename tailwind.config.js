/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./public/*.{html,js}"],
  theme: {
    extend: {
      fontFamily: {
        teko: ['Teko', 'sans-serif'],
        ranchers: ['Ranchers', 'cursive'],
        courier: ['Courier Prime', 'monospace'],
      },
      colors: {
        primary: '#f5f5f7',
        secondary: '#e1e1e3',
        primarybg: '#496486',
        secondarybg: '#bbc9db',
        accent: '#ff9500',
        success: '#4cd964',
        danger: '#ff3b30',
      },
    },
  },
  plugins: [],
}

