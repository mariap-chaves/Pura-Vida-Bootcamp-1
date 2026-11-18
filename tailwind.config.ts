import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        stellar: '#001a4d',
        'stellar-light': '#003399',
        'stellar-accent': '#13c0eb'
      }
    }
  },
  plugins: []
}

export default config
