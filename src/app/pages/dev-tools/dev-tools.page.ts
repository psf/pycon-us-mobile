import { Component } from '@angular/core';
import { Storage } from '@ionic/storage-angular';
import { ToastController } from '@ionic/angular';
import { ConferenceData } from '../../providers/conference-data';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dev-tools',
  templateUrl: './dev-tools.page.html',
  styleUrls: ['./dev-tools.page.scss'],
})
export class DevToolsPage {
  env = environment;
  storageKeys: string[] = [];
  storageCount = 0;
  scanCount = 0;

  constructor(
    private storage: Storage,
    private toastCtrl: ToastController,
    private confData: ConferenceData,
  ) {}

  async ionViewWillEnter() {
    await this.refreshStats();
  }

  async refreshStats() {
    const keys = await this.storage.keys();
    this.storageKeys = keys;
    this.storageCount = keys.length;
    this.scanCount = keys.filter(k =>
      k.startsWith('pending-scan-') || k.startsWith('synced-scan-') || k.startsWith('failed-scan-')
    ).length;
  }

  async clearScanData() {
    const keys = await this.storage.keys();
    let cleared = 0;
    for (const key of keys) {
      if (key.startsWith('pending-scan-') || key.startsWith('synced-scan-') || key.startsWith('failed-scan-') ||
          key.startsWith('pending-note-') || key.startsWith('note-') ||
          key === 'staff-sponsor-id' || key === 'staff-sponsor-name' || key === 'hasScannerConsent') {
        await this.storage.remove(key);
        cleared++;
      }
    }
    await this.showToast(`Cleared ${cleared} scan entries`);
    await this.refreshStats();
  }

  async invalidateCache() {
    this.confData.invalidateCache();
    await this.showToast('Schedule cache invalidated — pull to refresh');
    await this.refreshStats();
  }

  async nukeStorage() {
    await this.storage.clear();
    await this.showToast('All storage wiped — reloading...');
    setTimeout(() => window.location.reload(), 500);
  }

  async dumpStorage() {
    const dump: any = {};
    await this.storage.forEach((value, key) => {
      dump[key] = typeof value === 'object' ? JSON.stringify(value).substring(0, 100) : String(value);
    });
    console.table(dump);
    await this.showToast('Storage dumped to console (open DevTools)');
  }

  private async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
      color: 'dark',
    });
    toast.present();
  }
}
