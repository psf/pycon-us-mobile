import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastController } from '@ionic/angular';
import { Storage } from '@ionic/storage';
import { createHash } from 'sha1-uint8array';

import { UserData } from './user-data';


@Injectable({
  providedIn: 'root'
})
export class PyConAPI {
  base = 'https://us.pycon.org'

  constructor(
    private userData: UserData,
    private toastController: ToastController,
    private http: HttpClient,
    private storage: Storage
  ) { }

  async presentSuccess(data) {
    const toast = await this.toastController.create({
      message: 'Captured lead for ' + data.first_name+ '.',
      duration: 1000,
      position: 'top',
      icon: 'check'
    });
    toast.present();
  }

  async syncScan(accessCode: string): Promise<any> {
    const pending = await this.storage.get('pending-scan-' + accessCode).then((value) => {
      return value
    });
    const synced = await this.storage.get('synced-scan-' + accessCode).then((value) => {
      return value
    });
    console.log(synced);

    if (synced !== null) {
      this.presentSuccess(synced);
    }

    if (pending === null) {
      console.log('Unable to sync missing ' + accessCode);
    }

    const scanData = pending.scanData.split(":");
    const _accessCode = scanData[0];
    const _validator = scanData[scanData.length - 1];

    const apiKey = await this.userData.getAuthKey().then((value) => {return value});
    const secret = await this.userData.getSecret().then((value) => {return value});

    const timestamp = Math.round(Date.now() / 1000)
    const baseString = [
      secret,
      timestamp,
      'GET',
      '/2023/api/lead-retrieval/capture/?' + 'attendee_access_code=' + accessCode + "&badge_validator=" + _validator,
      '',
    ].join("")

    const headers = {
      'X-API-Key': apiKey,
      'X-API-Signature': createHash().update(baseString).digest("hex"),
      'X-API-Timestamp': String(timestamp),
    }

    this.http.get(
      this.base + '/2023/api/lead-retrieval/capture/?attendee_access_code=' + accessCode + "&badge_validator=" + _validator,
      {headers: headers}
    ).subscribe({
      next: data => {
        console.log(data['data']);
        this.storage.set('synced-scan-' + accessCode, {...data, ...pending}).then((value) => {
          this.presentSuccess(data['data']);
          this.storage.remove('pending-scan-' + accessCode).then((value) => {});
        });
      },
      error: error => {
      }
    });
  }

  async storeScan(accessCode: string, scanData: string): Promise<any> {
    const pending = await this.storage.get('pending-scan-' + accessCode).then((value) => {
      return value
    });
    const synced = await this.storage.get('synced-scan-' + accessCode).then((value) => {
      return value
    });
    if (synced != null) {
      console.log('Already captured ' + accessCode)
      this.presentSuccess(synced.data);
      return;
    } else if (pending != null) {
      console.log('Already scanned ' + accessCode)
      this.syncScan(accessCode);
      return;
    } else {
      const scanDate = new Date();
      return this.storage.set(
        'pending-scan-' + accessCode,
        {scanData: scanData, scannedAt: scanDate.toISOString()}
      ).then(() => {
        console.log('Scanned ' + accessCode);
        this.syncScan(accessCode);
      }).catch((error) => {
        console.log('SCAN FAILED ' + accessCode);
      });
    }
  }
}
