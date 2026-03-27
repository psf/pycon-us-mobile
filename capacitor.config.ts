import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.pycon.us.2023.onsite',
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
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 1500,
      launchFadeOutDuration: 500,
      backgroundColor: '#680579',
      showSpinner: false,
    },
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
