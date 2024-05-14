import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.pycon.us',
  appName: 'PyCon US',
  webDir: 'www',
  bundledWebRuntime: false,

  server: {
    hostname: 'mobile.us.pycon.org',
    androidScheme: 'https',
  }

  ios: {
    scheme: 'PyCon US',
  }
};

export default config;
