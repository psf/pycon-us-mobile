import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform, ToastController } from '@ionic/angular';

import { SplashScreen } from '@capacitor/splash-screen';
import { PushNotifications, PushNotificationSchema } from '@capacitor/push-notifications';

import { Storage } from '@ionic/storage-angular';

import { UserData } from './providers/user-data';
import { ConferenceData } from './providers/conference-data';
import { LiveUpdateService } from './providers/live-update.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  schedulePages = [
    { title: 'Schedule',  url: '/app/tabs/schedule',         icon: 'calendar-outline' },
    { title: 'Speakers',  url: '/app/tabs/speakers',         icon: 'people-outline' },
  ]
  presentationPages = [
    { title: 'Talks',     group: 'presentations', url: '/app/tabs/tracks/talks',     icon: 'mic-outline'},
    { title: 'Charlas',   group: 'presentations', url: '/app/tabs/tracks/charlas',   icon: 'mic-outline'},
    { title: 'Tutorials', group: 'presentations', url: '/app/tabs/tracks/tutorials', icon: 'laptop-outline'},
    { title: 'Posters',   group: 'presentations', url: '/app/tabs/tracks/posters',   icon: 'reader-outline'},
    { title: 'Sponsor Presentations', url: '/app/tabs/tracks/sponsor-presentations', icon: 'mic-outline'},
  ]
  appPages = [
    { title: 'About PyCon US', url: '/app/tabs/about-pycon', icon: 'information-circle-outline' },
    { title: 'About The PSF', url: '/app/tabs/about-psf', icon: 'logo-python' },
    { title: 'Conference Map', url: '/app/tabs/conference-map', icon:'map-outline' },
    { title: 'Social', url: '/app/tabs/social-media', icon: 'chatbubbles-outline' },
    { title: 'Open Spaces', url: '/app/tabs/tracks/open-spaces', icon: 'people-circle-outline' },
    { title: 'Sponsors', url: '/app/tabs/sponsors', icon: 'business-outline' },
    { title: 'Expo Hall', url: '/app/tabs/expo-hall', icon: 'storefront-outline' },
  ]
  nickname = null;
  loggedIn = false;
  dark = false;

  updateAvailable: any = null;

  hasApps = false;
  hasLeadRetrieval = false;
  hasDoorCheck= false;
  hasMaskViolation = false;

  constructor(
    private menu: MenuController,
    private platform: Platform,
    private router: Router,
    private storage: Storage,
    private userData: UserData,
    private toastCtrl: ToastController,
    public confData: ConferenceData,
    public liveUpdateService: LiveUpdateService,
  ) {
    this.storage.create();
    this.initializeApp();
  }

  async ngOnInit() {
    this.loadTheme();
    this.checkLoginStatus();
    this.checkNotifications();
    this.listenForLoginEvents();
    this.fetchFeatures();
    this.liveUpdateService.checkForUpdate();
    await this.storage.create();
  }

  checkNotifications() {
    PushNotifications.addListener('registration', token => {
      console.info('Registration token: ', token.value);
    });
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        PushNotifications.register();
      }
    });
    PushNotifications.addListener(
      'pushNotificationReceived',
      async (notification: PushNotificationSchema) => {
        this.toastCtrl.create({
          message: `${notification.title}: ${notification.body}`,
          position: 'top',
          buttons: [{
            icon: 'close',
            side: 'end',
            role: 'cancel'
          }]
        }).then(toast => toast.present());
      }
    );
  }

  initializeApp() {
    this.confData.load();
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        SplashScreen.hide();
      }
    });
  }

  checkLoginStatus() {
    this.userData.isLoggedIn().then(loggedIn => {
      this.updateLoggedInStatus(loggedIn);
      if (loggedIn) {
        this.userData.fetchPreferences();
      }
    });
  }

  fetchFeatures() {
    this.userData.isLoggedIn().then(loggedIn => {
      if (loggedIn) {
        this.userData.fetchFeatures();
        this.updateLoggedInStatus(loggedIn);
      }
    });
  }

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
      this.userData.fetchPreferences();
      this.userData.checkHasLeadRetrieval().then(hasLeadRetrieval => {
        this.hasApps = this.hasApps || hasLeadRetrieval;
        this.hasLeadRetrieval = hasLeadRetrieval;
      });
      this.userData.checkHasDoorCheck().then(hasDoorCheck => {
        this.hasApps = this.hasApps || hasDoorCheck;
        this.hasDoorCheck = hasDoorCheck;
      });
      this.userData.checkHasMaskViolation().then(hasMaskViolation => {
        this.hasApps = this.hasApps || hasMaskViolation;
        this.hasMaskViolation = hasMaskViolation;
      });
      this.userData.getNickname().then(nickname => {
        this.nickname = nickname;
      });
    }, 300);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.updateLoggedInStatus(true);
    });

    window.addEventListener('user:logout', () => {
      this.updateLoggedInStatus(false);
    });
  }

  logout() {
    this.userData.logout().then(() => {
      this.hasApps = false;
      this.hasLeadRetrieval = false;
      this.hasDoorCheck = false;
      this.hasMaskViolation = false;
      return this.router.navigateByUrl('/app/tabs/schedule');
    });
  }

  openTutorial() {
    this.menu.enable(false);
    this.storage.set('ion_did_tutorial', false);
    this.router.navigateByUrl('/tutorial');
  }

  loadTheme() {
    this.userData.getDarkTheme().then(dark => {
      this.dark = dark;
    });
  }

  toggleDarkTheme() {
    this.userData.toggleDarkTheme();
  }
}
