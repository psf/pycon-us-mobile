import { Component, OnInit } from '@angular/core';

import { UserData } from '../../providers/user-data';

@Component({
  templateUrl: 'tabs-page.html'
})
export class TabsPage implements OnInit {
  hasLeadRetrieval = false;

  constructor(
    private userData: UserData
  ) {}

  async ngOnInit() {
    this.checkHasLeadRetrieval();
    this.listenForLoginEvents();
  }

  checkHasLeadRetrieval() {
    return this.userData.checkHasLeadRetrieval().then(hasLeadRetrieval => {
      console.log(hasLeadRetrieval);
      if (hasLeadRetrieval) {
        this.hasLeadRetrieval = true;
      }
    });
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
