import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NavController, AlertController } from '@ionic/angular';

import { AppComponent } from '../../app.component';
import { UserData } from '../../providers/user-data';
import { ConferenceData } from '../../providers/conference-data';
import { LiveUpdateService } from '../../providers/live-update.service';


@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements OnInit, AfterViewInit {
  email: string;
  nickname: string;
  isSpeaker: boolean = false;
  speakerDiscordUrl: string = 'https://us.pycon.org/2026/speaker/join_discord/';

  constructor(
    public app: AppComponent,
    public alertCtrl: AlertController,
    public nav: NavController,
    public router: Router,
    public userData: UserData,
    public confData: ConferenceData,
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

  checkIsSpeaker() {
    Promise.all([
      this.userData.getNickname(),
      this.userData.getEmail(),
    ]).then(([nickname, email]) => {
      if (!nickname && !email) return;
      this.confData.load().subscribe((data: any) => {
        if (data.speakers) {
          const nick = (nickname || '').toLowerCase();
          const em = (email || '').toLowerCase();
          this.isSpeaker = data.speakers.some((s: any) => {
            const name = (s.name || '').toLowerCase();
            // Match: full name equals nickname, nickname is part of name, or bio contains email
            return name === nick
              || (nick.length > 2 && name.includes(nick))
              || (em && s.about?.toLowerCase().includes(em));
          });
        }
      });
    });
  }

  getEmail() {
    this.userData.getEmail().then((email) => {
      this.email = email;
    });
  }

  getNickname() {
    this.userData.getNickname().then((nickname) => {
      if (nickname === null) {
        this.router.navigate(['/login'], { replaceUrl: true });
      }
      this.nickname = nickname;
    });
  }

  openDiscord() {
    window.open(this.speakerDiscordUrl, '_blank');
  }

  logout() {
    this.userData.logout();
    this.nav.navigateRoot('/');
  }
}
