import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    root: 'src/client',
    build: {
      outDir: '../../dist/client',
      emptyOutDir: true
    },
    define: {
      'import.meta.env.VITE_PUBLIC_WEB_URL': JSON.stringify(env.PUBLIC_WEB_URL || ''),
      'import.meta.env.VITE_API_BASE_URL': JSON.stringify(env.API_BASE_URL || ''),
      'import.meta.env.VITE_WS_BASE_URL': JSON.stringify(env.WS_BASE_URL || '')
    }
  };
});

