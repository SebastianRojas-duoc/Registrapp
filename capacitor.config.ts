import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Registrapp',
  webDir: 'www',
  plugins: {
    BarcodeScanner: {
    }
  }
};

export default config;
