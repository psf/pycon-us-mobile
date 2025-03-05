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

  plugins: {
    LiveUpdates: {
      appId: 'e8e09c7a',
      channel: 'Production',
      autoUpdateMethod: 'none',
      maxVersions: 3,
      enabled: true
    }
  }
};

export default config;
