import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Plugin para garantir que as variáveis de ambiente sejam processadas corretamente
    EnvironmentPlugin([
      'VITE_FIREBASE_API_KEY',
      'VITE_FIREBASE_AUTH_DOMAIN',
      'VITE_FIREBASE_PROJECT_ID',
      'VITE_FIREBASE_STORAGE_BUCKET',
      'VITE_FIREBASE_MESSAGING_SENDER_ID',
      'VITE_FIREBASE_APP_ID',
      'VITE_API_BASE_URL'
    ], { prefix: 'VITE_' })
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    host: true,
  },
  preview: {
    // A porta será definida pela linha de comando ou variável de ambiente
    host: true,
    open: false, // Não tenta abrir navegador automaticamente
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      // Domínio do Railway
      'implantei-web-production.up.railway.app',
      // Padrão curinga para permitir todos os subdomínios do railway.app
      '.railway.app'
    ]
  }
})