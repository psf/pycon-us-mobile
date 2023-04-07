import { Component, OnInit } from '@angular/core';

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

  constructor(
    private userData: UserData,
    private confData: ConferenceData,
  ) {}

  async ngOnInit() {
    this.reloadSponsors();
    this.checkHasLeadRetrieval();
    this.listenForLoginEvents();
    setInterval(this.showSponsorBanner, 30000);
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

  listenForLoginEvents() {
    window.addEventListener('user:login', () => {
      this.checkHasLeadRetrieval();
    });

    window.addEventListener('user:logout', () => {
      this.checkHasLeadRetrieval();
    });
  }
}
