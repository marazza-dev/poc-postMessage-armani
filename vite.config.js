import { resolve } from 'path';
import { defineConfig } from "vite";
import basicSsl from '@vitejs/plugin-basic-ssl';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        fullscreen: resolve(__dirname, 'fullscreen/index.html'),
      },
    },
  },
  server: {
    https: true,
  },
  plugins: [
    basicSsl()
  ]
})
