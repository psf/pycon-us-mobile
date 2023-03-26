import { AfterViewInit, Component } from '@angular/core';
import { Router } from '@angular/router';

import { AlertController } from '@ionic/angular';

import { UserData } from '../../providers/user-data';


@Component({
  selector: 'page-account',
  templateUrl: 'account.html',
  styleUrls: ['./account.scss'],
})
export class AccountPage implements AfterViewInit {
  email: string;
  nickname: string;

  constructor(
    public alertCtrl: AlertController,
    public router: Router,
    public userData: UserData
  ) { }

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
      this.nickname = nickname;
    });
  }

  logout() {
    this.userData.logout();
    this.router.navigateByUrl('/login');
  }
}
