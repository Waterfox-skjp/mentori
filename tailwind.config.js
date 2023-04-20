import { VitePWA } from 'vite-plugin-pwa'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [
    VitePWA({ registerType: 'autoUpdate' })
  ],
}

