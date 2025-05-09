/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,tsx}', './components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#f6f3fd',
          'light-hover': '#f2edfc',
          'light-active': '#e4daf9',
          normal: '#a787ec',
          'normal-hover': '#967ad4',
          'normal-active': '#866cbd',
          dark: '#7d65b1',
          'dark-hover': '#64518e',
          'dark-active': '#4b3d6a',
          darker: '#3a2f53',
        },
        secondary: {
          light: '#f2fef3',
          'light-hover': '#ecfded',
          'light-active': '#d7fbd9',
          normal: '#7ef186',
          'normal-hover': '#71d979',
          'normal-active': '#65c16b',
          dark: '#5fb565',
          'dark-hover': '#4c9150',
          'dark-active': '#396c3c',
          darker: '#2c542f',
        },
        neutral: {
          n0: '#ffffff',
          n10: '#fdfdff',
          n20: '#fbfafe',
          n30: '#f8f5fd',
          n40: '#f4effd',
          n50: '#e9e1fa',
          n60: '#e4daf9',
          n70: '#dfd4f8',
          n80: '#dacdf7',
          n90: '#d5c5f6',
          n100: '#cfbef5',
          n200: '#cab7f4',
          n300: '#c5b0f2',
          n400: '#c1aaf2',
          n500: '#bba3f0',
          n600: '#b79def',
          n700: '#b194ee',
          n800: '#ab8ded',
          n900: '#a787ec',
        },
        muted: {
          1: '#ffffff',
          2: '#fcfcfc',
          3: '#f5f5f5',
          4: '#f0f0f0',
          5: '#d9d9d9',
          6: '#bfbfbf',
          7: '#8c8c8c',
          8: '#595959',
          9: '#454545',
          10: '#262626',
          11: '#1f1f1f',
          12: '#141414',
          13: '#000000',
        },
      },
      fontFamily: {
        urbanistLight: ['Urbanist_Light'],
        urbanist: ['UrbanistRegular'],
        urbanistBold: ['UrbanistBold'],
        UrbanistMedium: ['UrbanistMedium'],
        UrbanistSemiBold: ['UrbanistSemiBold'],
      },
    },
  },
  plugins: [],
};
