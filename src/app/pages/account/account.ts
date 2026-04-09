import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NavController, AlertController } from '@ionic/angular';
import { InAppBrowser, DefaultWebViewOptions } from '@capacitor/inappbrowser';

import { AppComponent } from '../../app.component';
import { UserData } from '../../providers/user-data';
import { LiveUpdateService } from '../../providers/live-update.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements OnInit, AfterViewInit {
  email: string;
  nickname: string;
  isSpeaker: boolean = false;

  constructor(
    public app: AppComponent,
    public alertCtrl: AlertController,
    public nav: NavController,
    public router: Router,
    public userData: UserData,
    public liveUpdateService: LiveUpdateService,
  ) { }

  ngOnInit() {
    this.app.fetchFeatures();
  }

  ngAfterViewInit() {
    this.getEmail();
    this.getNickname();
    this.checkIsSpeaker();
  }

  getEmail() {
    this.userData.getEmail().then((email) => {
      this.email = email;
    });
  }

  getNickname() {
    this.userData.getNickname().then((nickname) => {
      if (nickname === null) {
        this.router.navigate(['/app/tabs/login'], { replaceUrl: true });
      }
      this.nickname = nickname;
    });
  }

  checkIsSpeaker() {
    this.userData.checkIsSpeaker().then((isSpeaker) => {
      this.isSpeaker = !!isSpeaker;
    });
  }

  openSpeakerDiscord() {
    InAppBrowser.openInWebView({
      url: environment.baseUrl + '/2026/speaker/join_discord/',
      options: DefaultWebViewOptions,
    });
  }

  openUrl(url: string) {
    window.open(url, '_system', 'location=yes');
  }

  logout() {
    this.userData.logout();
    this.nav.navigateRoot('/');
  }
}
