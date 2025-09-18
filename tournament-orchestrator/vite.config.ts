import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    plugins: [react()],
    server: {
      port: 5174,
      strictPort: true
    },
    define: {
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.API_BASE_URL || ''),
      'import.meta.env.VITE_WS_BASE_URL': JSON.stringify(env.WS_BASE_URL || ''),
      'import.meta.env.VITE_ADMIN_BASE_URL': JSON.stringify(env.ADMIN_BASE_URL || '')
    }
  };
});

