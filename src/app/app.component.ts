import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController, Platform, ToastController } from '@ionic/angular';

import { StatusBar } from '@capacitor/status-bar';
import { SplashScreen } from '@capacitor/splash-screen';

import {
  ActionPerformed,
  PushNotificationSchema,
  PushNotifications,
  Token,
} from '@capacitor/push-notifications';

import { Deploy } from 'cordova-plugin-ionic/dist/ngx';

import { Storage } from '@ionic/storage';

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
    { title: 'About PyCon', url: '/app/tabs/about-pycon', icon: 'information-circle-outline' },
    { title: 'About The PSF', url: '/app/tabs/about-psf', icon: 'logo-python' },
    { title: 'Social', url: '/app/tabs/social-media', icon: 'chatbubbles-outline' },
    { title: 'Sponsors', url: '/app/tabs/sponsors', icon: 'business-outline' },
  ]
  nickname = null;
  loggedIn = false;
  dark = false;

  updateAvailable: any = null;

  hasApps = false;
  hasLeadRetrieval = false;

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
    this.initializeApp();
  }

  async ngOnInit() {
    this.loadTheme();
    this.checkLoginStatus();
    this.listenForLoginEvents();
    this.setupPush();
    this.liveUpdateService.checkForUpdate();
  }

  initializeApp() {
    this.confData.load();
    this.platform.ready().then(() => {
      if (this.platform.is('hybrid')) {
        StatusBar.hide();
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

  updateLoggedInStatus(loggedIn: boolean) {
    setTimeout(() => {
      this.loggedIn = loggedIn;
      this.userData.fetchPreferences();
      this.userData.checkHasLeadRetrieval().then(hasLeadRetrieval => {
        this.hasApps = hasLeadRetrieval;
        this.hasLeadRetrieval = hasLeadRetrieval;
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

  setupPush() {
    // Request permission to use push notifications
    // iOS will prompt user and return if they granted permission or not
    // Android will just grant without prompting
    PushNotifications.requestPermissions().then(result => {
      if (result.receive === 'granted') {
        // Register with Apple / Google to receive push via APNS/FCM
        PushNotifications.register();
      } else {
        // Show some error
      }
    });

    PushNotifications.addListener('registration', (token: Token) => {
      console.log('Push registration success, token: ' + token.value);
    });

    PushNotifications.addListener('registrationError', (error: any) => {
      console.log('Error on registration: ' + JSON.stringify(error));
    });

    PushNotifications.addListener(
      'pushNotificationReceived',
      (notification: PushNotificationSchema) => {
        console.log('Push received: ' + JSON.stringify(notification));
      },
    );

    PushNotifications.addListener(
      'pushNotificationActionPerformed',
      (notification: ActionPerformed) => {
        console.log('Push action performed: ' + JSON.stringify(notification));
      },
    );
  }
}
