import { Injectable } from '@angular/core';
import { Deploy } from 'cordova-plugin-ionic/dist/ngx';

@Injectable({
  providedIn: 'root'
})
export class LiveUpdateService {
  deploy: Deploy;
  updateAvailable: any = null;

  constructor() {
    console.log('ive been constructed');
    this.deploy = new Deploy();
    this.deploy.configure({});
    this.checkForUpdate();
  }

  async checkForUpdate() {
    this.deploy.checkForUpdate().then((response) => {
      this.updateAvailable = response
    })
  }
}
