import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: "/gochiusa_quiz/", // GitHub Pages用に修正
  plugins: [react()],
});
