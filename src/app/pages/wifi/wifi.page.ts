import { Component, ViewChild } from '@angular/core';
import { IonContent, Platform, ToastController } from '@ionic/angular';
import { LiveUpdateService } from '../../providers/live-update.service';

@Component({
  selector: 'app-wifi',
  templateUrl: './wifi.page.html',
  styleUrls: ['./wifi.page.scss'],
})
export class WifiPage {
  @ViewChild(IonContent) content: IonContent;
  showTitle = false;

  constructor(
    private platform: Platform,
    private toastCtrl: ToastController,
    public liveUpdateService: LiveUpdateService,
  ) {}

  onScroll(event: any) {
    this.showTitle = event.detail.scrollTop > 100;
  }

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

  private async showToast(message: string, duration = 3000, color = 'medium') {
    const toast = await this.toastCtrl.create({
      message,
      duration,
      position: 'bottom',
      color,
    });
    toast.present();
  }

  openWifiSettings() {
    if (this.platform.is('ios')) {
      try {
        // Apple does not allow deep-linking to the Wi-Fi pane from third-party
        // apps. `app-settings:` opens Settings.app on this app's settings panel;
        // the user can then back out one level to reach Wi-Fi.
        window.open('app-settings:', '_system');
        this.showToast('Tap Wi-Fi from Settings to connect to PyConUS26', 3000);
      } catch (err) {
        this.showToast('Open your device settings → Wi-Fi to join PyConUS26');
      }
    } else if (this.platform.is('android')) {
      try {
        // Intent URL form invokes Settings.ACTION_WIFI_SETTINGS via the OS
        // URL handler from a WebView.
        window.open('intent:#Intent;action=android.settings.WIFI_SETTINGS;end', '_system');
      } catch (err) {
        this.showToast('Open your device settings → Wi-Fi to join PyConUS26');
      }
    } else {
      this.showToast('Open your device settings → Wi-Fi to join PyConUS26');
    }
  }
}
