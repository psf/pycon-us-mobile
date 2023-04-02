import { Injectable } from '@angular/core';
import { Deploy } from 'cordova-plugin-ionic/dist/ngx';
import { App } from '@capacitor/app';

@Injectable({
  providedIn: 'root'
})
export class LiveUpdateService {
  deploy: Deploy;
  updateAvailable: any = null;

  constructor() {
    this.deploy = new Deploy();
    this.deploy.configure({});
    this.checkForUpdate();

    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        this.checkForUpdate();
      }
    });
  }

  async checkForUpdate() {
    this.deploy.checkForUpdate().then((response) => {
      this.updateAvailable = response
    })
  }
}
