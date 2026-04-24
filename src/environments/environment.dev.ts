import { Capacitor } from '@capacitor/core';

// Android emulator runs in a VM with its own loopback, so 127.0.0.1 points
// at the emulator itself. 10.0.2.2 is the emulator's alias for the host
// loopback. iOS simulator shares the host network stack, so 127.0.0.1 works.
const devHost = Capacitor.getPlatform() === 'android' ? '10.0.2.2' : '127.0.0.1';

export const environment = {
  name: 'development',
  production: false,
  baseUrl: `http://${devHost}:8000`,
  storageKey: '__pycon_us_mobile_development_2026',
  timezone: 'America/Los_Angeles',
  utcOffset: -7,
};
