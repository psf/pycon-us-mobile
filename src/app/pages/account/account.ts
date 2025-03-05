import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { NavController, AlertController } from '@ionic/angular';

import { AppComponent } from '../../app.component';
import { UserData } from '../../providers/user-data';
import { LiveUpdateService } from '../../providers/live-update.service';


@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements OnInit, AfterViewInit {
  email: string;
  nickname: string;

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

  logout() {
    this.userData.logout();
    this.nav.navigateRoot('/');
  }
}
