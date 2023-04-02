import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.pycon.us',
  appName: 'PyCon US 2023',
  webDir: 'www',
  bundledWebRuntime: false,

  server: {
    hostname: 'us.pycon.org',
    androidScheme: 'https',
  }
};

export default config;
