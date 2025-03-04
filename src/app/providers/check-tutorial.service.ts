import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { UserData } from './user-data';

@Injectable({
  providedIn: 'root'
})
export class CheckTutorial  {
  constructor(private storage: Storage, private router: Router, private userData: UserData) {}

  canLoad() {
    this.storage.create();
    return this.storage.get('ion_did_tutorial').then(res => {
      this.userData.checkHasLeadRetrieval().then(hasLead => {
        if (hasLead) {
          this.router.navigate(['/app', 'tabs', 'lead-retrieval']);
          return false;
        }
      })
      if (res) {
        this.router.navigate(['/app', 'tabs', 'schedule']);
        return false;
      } else {
        return true;
      }
    });
  }
}
