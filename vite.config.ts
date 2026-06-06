import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { createTmdbProxy } from './vite/tmdbProxy';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@app': path.resolve(__dirname, 'src/app'),
      '@features': path.resolve(__dirname, 'src/features'),
      '@entities': path.resolve(__dirname, 'src/entities'),
      '@shared': path.resolve(__dirname, 'src/shared'),
      '@widgets': path.resolve(__dirname, 'src/widgets'),
      '@pages': path.resolve(__dirname, 'src/pages'),
    },
  },
  server: {
    proxy: {
      '/tmdb-api': createTmdbProxy('https://api.themoviedb.org', '/tmdb-api'),
      '/tmdb-img': createTmdbProxy('https://image.tmdb.org', '/tmdb-img'),
    },
  },
  preview: {
    proxy: {
      '/tmdb-api': createTmdbProxy('https://api.themoviedb.org', '/tmdb-api'),
      '/tmdb-img': createTmdbProxy('https://image.tmdb.org', '/tmdb-img'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `@use "@/shared/styles/tokens" as *; @use "@/shared/styles/mixins" as *;`,
      },
    },
  },
});
