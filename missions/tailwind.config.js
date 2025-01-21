/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./update.html",
    "./assets/js/**/*.js",
    "./assets/css/**/*.css",

           ],
  theme: {
    extend: {
      fontFamily: {
        teko: ['Teko', 'sans-serif'],
        ranchers: ['Ranchers', 'cursive'],
        courier: ['Courier Prime', 'monospace'],
      },
      colors: {
        primary: '#EDF2FB',  
        secondary: '#ABC4FF', 
        primarybg: '#001D3D',
        secondarybg: '#003566',
        accent: '#FFC300',    
        success: '#06D6A0',   
        danger: '#EF476F',    
      },
    },
  },
  plugins: [],
}
