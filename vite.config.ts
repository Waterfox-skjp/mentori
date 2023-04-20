import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    VitePWA({
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Mentori | Discord向け動画圧縮ツール',
        short_name: 'Mentori',
        description: '「Mentori」はDiscord向け動画圧縮ツールです。通常Discordの無料版では最大25MBの動画しかアップロードすることができません。この「Mentori」では1ドロップ・1クリックで8MBへの動画圧縮を可能にします。',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      }
    })
  ],
})
