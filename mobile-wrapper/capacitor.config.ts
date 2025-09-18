import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.ttt',
  appName: 'TicTacToe',
  webDir: 'dist/client',
  bundledWebRuntime: false,
  server: {
    androidScheme: 'https'
  }
};

export default config;

