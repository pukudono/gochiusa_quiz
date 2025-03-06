import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/gochiusa_quiz/', // ここをリポジトリ名に変更
});
