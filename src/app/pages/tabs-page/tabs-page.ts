import { Component, OnInit } from '@angular/core';
import { ActionSheetController } from '@ionic/angular';
import { Router } from '@angular/router';

import { ConferenceData } from '../../providers/conference-data';
import { UserData } from '../../providers/user-data';

@Component({
  templateUrl: 'tabs-page.html',
  styleUrls: ['tabs-page.scss'],
})
export class TabsPage implements OnInit {
  sponsors: any = [];
  currentBannerSponsor: any;
  hasLeadRetrieval: boolean = false;
  hasDoorCheck: boolean = false;
  loggedIn: boolean = false;

  constructor(
    private userData: UserData,
    private confData: ConferenceData,
    private actionSheetCtrl: ActionSheetController,
    private router: Router,
  ) {}

  async ngOnInit() {
    this.reloadSponsors();
    this.checkHasLeadRetrieval();
    this.checkHasDoorCheck();
    this.checkLoggedIn();
    this.listenForLoginEvents();
    setInterval(this.showSponsorBanner, 30000);
  }

  checkLoggedIn() {
    this.userData.isLoggedIn().then(loggedIn => {
      this.loggedIn = loggedIn;
    });
  }

  async openStaffTools(event: Event) {
    event.stopPropagation();
    event.preventDefault();

    const buttons = [];
    if (this.hasDoorCheck) {
      buttons.push({
        text: 'Door Check',
        icon: 'checkbox-outline',
        handler: () => { this.router.navigateByUrl('/app/tabs/door-check'); }
      });
      buttons.push({
        text: 'Swag Pickup',
        icon: 'gift-outline',
        handler: () => { this.router.navigateByUrl('/app/tabs/t-shirt-redemption'); }
      });
    }
    if (this.hasLeadRetrieval || this.hasDoorCheck) {
      buttons.push({
        text: 'Lead Scanner',
        icon: 'qr-code-outline',
        handler: () => { this.router.navigateByUrl('/app/tabs/lead-retrieval'); }
      });
    }
    buttons.push({ text: 'Cancel', role: 'cancel', icon: 'close' });

    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Staff Tools',
      buttons
    });
    await actionSheet.present();
  }

  showSponsorBanner() {
    var hidden = document.getElementsByClassName('bannerSponsorHidden');
    var visible = document.getElementsByClassName('bannerSponsorVisible');
    Array.from(visible).forEach((banner, index, array) => {
      banner.classList.remove('bannerSponsorVisible');
      banner.classList.add('bannerSponsorHidden');
    });
    var newBanner = hidden.item(hidden.length * Math.random() | 0);
    if (newBanner) {
      newBanner.classList.remove('bannerSponsorHidden');
      newBanner.classList.add('bannerSponsorVisible');
    }
  }

  reloadSponsors() {
    this.confData.getSponsors().subscribe((sponsors: any[]) => {
      const bannerSponsors = [];
      for (const [level, levelSponsors] of Object.entries(sponsors)) {
        levelSponsors.forEach(function(sponsor, index, arr) {
          if (sponsor.mobile_banner) {
            bannerSponsors.push(sponsor);
          }
        });
      }
      this.sponsors = bannerSponsors;
      setTimeout(this.showSponsorBanner, 100);
    });
  }

  checkHasLeadRetrieval() {
    return this.userData.checkHasLeadRetrieval().then(hasLeadRetrieval => {
      return this.updateHasLeadRetrieval(hasLeadRetrieval);
    });
  }

  updateHasLeadRetrieval(hasLeadRetrieval: boolean) {
    setTimeout(() => {
      this.hasLeadRetrieval = hasLeadRetrieval;
    }, 200)
  }

  checkHasDoorCheck() {
    return this.userData.checkHasDoorCheck().then(hasDoorCheck => {
      return this.updateHasDoorCheck(hasDoorCheck);
    });
  }

  updateHasDoorCheck(hasDoorCheck: boolean) {
    setTimeout(() => {
      this.hasDoorCheck = hasDoorCheck;
    }, 200)
  }

  goTo(path: string) {
    this.router.navigateByUrl(path);
  }

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.checkHasLeadRetrieval();
      this.checkHasDoorCheck();
      this.checkLoggedIn();
    });

    window.addEventListener('user:logout', () => {
      this.checkHasLeadRetrieval();
      this.checkHasDoorCheck();
      this.checkLoggedIn();
    });
  }
}
