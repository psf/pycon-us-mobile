import { Component } from '@angular/core';
import { Platform, ToastController } from '@ionic/angular';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-wifi',
  templateUrl: './wifi.page.html',
  styleUrls: ['./wifi.page.scss'],
})
export class WifiPage {
  constructor(
    private platform: Platform,
    private toastCtrl: ToastController,
    public liveUpdateService: LiveUpdateService,
  ) {}

  async copyPassword() {
    await navigator.clipboard.writeText('pyconLB2026');
    const toast = await this.toastCtrl.create({
      message: 'Password copied!',
      duration: 1500,
      position: 'bottom',
      color: 'success',
    });
    toast.present();
  }

  openWifiSettings() {
    if (this.platform.is('ios')) {
      window.open('App-prefs:WIFI', '_system');
    } else {
      window.open('android.settings.WIFI_SETTINGS', '_system');
    }
  }
}
