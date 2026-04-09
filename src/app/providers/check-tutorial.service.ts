import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './user-data';

@Injectable({
  providedIn: 'root'
})
export class CheckTutorial  {
  constructor(private storage: Storage, private router: Router, private userData: UserData) {}

  async canLoad() {
    await this.storage.create();
    const didTutorial = await this.storage.get('ion_did_tutorial');

    if (didTutorial) {
      const hasLead = await this.userData.checkHasLeadRetrieval();
      if (hasLead) {
        this.router.navigate(['/app', 'tabs', 'lead-retrieval']);
      } else {
        this.router.navigate(['/app', 'tabs', 'schedule']);
      }
      return false;
    }

    return true;
  }
}
