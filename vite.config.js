import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  base: '/perma-site/',
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        donate: path.resolve(__dirname, 'donate.html'),
      },
    },
  },
});
