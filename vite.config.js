import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        donate: path.resolve(__dirname, 'donate.html'),
        about: path.resolve(__dirname, 'about.html'),
        work: path.resolve(__dirname, 'work.html'),
        getinvolved: path.resolve(__dirname, 'getinvolved.html'),
      },
    },
  },
});
