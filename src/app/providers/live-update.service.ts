import { Injectable } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import * as LiveUpdates from '@capacitor/live-updates';
import { App } from '@capacitor/app';

@Injectable({
  providedIn: 'root'
})
export class LiveUpdateService {
  updateAvailable: any = null;
  needsUpdate: boolean = false;
  build: string = "base";
  appVersion: string = "";
  // Active live-update snapshot from Appflow. null when running the bundled
  // native assets (no OTA applied yet, or running via livereload).
  snapshot: { id: string; buildId: string } | null = null;
  channel: string = "";

  constructor(private loadingCtrl: LoadingController) {
    App.addListener('appStateChange', ({ isActive }) => {
      if (isActive) {
        this.checkForUpdate();
      }
    });
  }

  async updateAppInfo() {
    const info = await App.getInfo();
    this.appVersion = info.version;
    this.build = info.build;
  }

  async reload() {
    await LiveUpdates.reload();
    this.needsUpdate = false;
  }

  async checkForUpdate() {
    await this.updateAppInfo();
    const result = await LiveUpdates.sync();
    this.updateAvailable = result;
    this.snapshot = result.snapshot;
    this.channel = result.liveUpdate?.channel || '';
    if (this.updateAvailable.activeApplicationPathChanged) {
        this.needsUpdate = true;
        document.body.classList.add('has-pending-update');
    }
  }

  async performAutomaticUpdate() {
    const loader = await this.loadingCtrl.create({
      message: 'Installing the latest build...',
      duration: 60000,
    });
    await loader.present();
    if (this.needsUpdate) {
      this.reload();
    }
    setTimeout(() => loader.dismiss(), 1000);
  }
}
