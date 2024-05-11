module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/sections/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontSize: {
      xs: ['12px', '16px'],
      sm: ['16px', '20px'],
      base: ['16px', '19.5px'],
      lg: ['18px', '21.94px'],
      xl: ['20px', '24.38px'],
      '2xl': ['24px', '29.26px'],
      '3xl': ['28px', '50px'],
      '4xl': ['38px', '38px'],
      '8xl': ['96px', '106px']
    },
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        secondary: 'var(--color-secondary)',
        buttons: 'var(--color-buttons)',
        typography: 'var(--color-typography)',
        buttonHover: 'var(--button-hover)',
        buttonTypography: 'var(--color-button-text)',
        typographyHover: 'var(--typography-hover)', 
        borderColor: 'var(--border-color)',
        headerColor: 'var(--header-color)',
        bgFooter: 'var(--bgFooter-color)',
        toolTipBG: 'var(--toolTipBG)',
        toolTipText: 'var(--toolTipText)',
      }, 
      
    },
  },
  plugins: [],
};