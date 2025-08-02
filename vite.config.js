import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: 'html-transform',
      transformIndexHtml(html) {
        return html.replace(
          '</div>',
          `</div>
    <!-- Load configuration before app -->
    <script src="config.js"></script>`
        )
      }
    }
  ],
  base: '/oversiteai.io-web/',
})
