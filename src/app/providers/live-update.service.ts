import { Injectable } from '@angular/core';
import * as LiveUpdates from '@capacitor/live-updates';
import { App } from '@capacitor/app';

@Injectable({
  providedIn: 'root'
})
export class LiveUpdateService {
  updateAvailable: any = null;
  needsUpdate: boolean = false;
  build: string = "base";

  constructor() {
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        this.checkForUpdate();
      }
    });
  }

  async updateAppInfo() {
    const info = await App.getInfo();
    this.build = info.name + " " + info.version + "-" + info.build
    console.log(this.build);
  }

  async reload() {
    await LiveUpdates.reload();
    this.needsUpdate = false;
  }

  async checkForUpdate() {
    await this.updateAppInfo();
    const result = await LiveUpdates.sync();
    this.updateAvailable = result;
    if (this.updateAvailable.activeApplicationPathChanged) {
        this.needsUpdate = true;
    }
  }
}
